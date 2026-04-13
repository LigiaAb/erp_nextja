"use client";

import { setSessionExpiredFlag } from "@/lib/api/apiFetch";
import { useMutation as useTanstackMutation, useQuery as useTanstackQuery, type UseMutationOptions, type UseMutationResult, type UseQueryOptions, type UseQueryResult } from "@tanstack/react-query";

export type QueryFilters = Record<string, string | number | boolean | null | undefined>;

export type CatalogBase = {
  label: string;
  value: string | number;
};

export type ApiEnvelope<TData = unknown> = {
  status?: number;
  message?: string;
  mensaje?: string;
  length?: number;
  data?: TData;

  success?: boolean;
  cod_mensaje?: number;

  page?: number;
  pageNumber?: number;
  currentPage?: number;
  pagina?: number;
  paginaActual?: number;

  pageSize?: number;
  perPage?: number;
  per_page?: number;
  limit?: number;
  limite?: number;
  rowsPerPage?: number;

  total?: number;
  totalRows?: number;
  total_records?: number;
  totalRecords?: number;
  registros?: number;

  totalPages?: number;
  pages?: number;
  lastPage?: number;
  last_page?: number;
  paginas?: number;

  hasNext?: boolean;
  hasPrevious?: boolean;
  nextPage?: number | null;
  prevPage?: number | null;

  [key: string]: unknown;
};

export type CatalogResponse<TItem> = {
  status?: number;
  message?: string;
  length?: number;
  items: TItem[];
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  nextPage?: number | null;
  prevPage?: number | null;
  raw?: unknown;
};

export type ApiError<TError = unknown> = {
  status: number;
  message: string;
  cod_mensaje?: number;
  data?: TError;
};

export type MutationMethod = "POST" | "PUT" | "PATCH" | "DELETE";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const normalizeKeys = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj.map(normalizeKeys);
  }

  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj as Record<string, unknown>).reduce((acc: Record<string, unknown>, key) => {
      acc[key.toLowerCase()] = normalizeKeys((obj as Record<string, unknown>)[key]);
      return acc;
    }, {});
  }

  return obj;
};

function buildUrl(path: string, filters?: QueryFilters) {
  const params = new URLSearchParams();

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === null || value === "") continue;
      params.set(key, String(value));
    }
  }

  const qs = params.toString();
  const url = qs ? `${path}?${qs}` : path;

  return `${API_BASE_URL}${url}`;
}

async function parseJsonSafe<T>(res: Response): Promise<T | undefined> {
  const text = await res.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

async function validateApiBusinessError<TError = unknown>(data: unknown): Promise<void> {
  if (!isRecord(data)) return;

  const nestedData = isRecord(data.data) ? data.data : undefined;

  const hasSuccess = "success" in data || (!!nestedData && "success" in nestedData);

  if (!hasSuccess) return;

  const success = (typeof data.success === "boolean" ? data.success : undefined) ?? (typeof nestedData?.success === "boolean" ? nestedData.success : undefined) ?? true;

  if (success) return;

  const cod = (typeof data.cod_mensaje === "number" ? data.cod_mensaje : undefined) ?? (typeof nestedData?.cod_mensaje === "number" ? nestedData.cod_mensaje : undefined) ?? 400;

  const msg =
    (typeof data.mensaje === "string" ? data.mensaje : undefined) ??
    (typeof data.message === "string" ? data.message : undefined) ??
    (typeof nestedData?.mensaje === "string" ? nestedData.mensaje : undefined) ??
    (typeof nestedData?.message === "string" ? nestedData.message : undefined) ??
    "Error inesperado";

  const codigosSesionExpirada = [1001, 1003];
  const codigo = (typeof data.cod_mensaje === "number" ? data.cod_mensaje : undefined) ?? (typeof nestedData?.cod_mensaje === "number" ? nestedData.cod_mensaje : undefined);

  if (codigo === 1062 || (codigo !== undefined && codigosSesionExpirada.includes(codigo))) {
    await setSessionExpiredFlag();
  }

  throw {
    status: cod,
    message: String(msg),
    cod_mensaje: codigo,
    data: undefined,
  } satisfies ApiError<TError>;
}

async function requestJson<TResponse, TError = unknown>(url: string, init: RequestInit): Promise<TResponse> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      Authorization: localStorage.getItem("token") ?? "",
      version_app: localStorage.getItem("version_app") ?? "",
      ...(init.headers ?? {}),
    },
  });

  const rawData = await parseJsonSafe<unknown>(res);

  if (res.status === 401 || res.status === 403) {
    await setSessionExpiredFlag();
  }

  if (!res.ok) {
    const errorPayload = isRecord(rawData) ? rawData : undefined;

    throw {
      status: res.status,
      message:
        (typeof errorPayload?.mensaje === "string" ? errorPayload.mensaje : undefined) ??
        (typeof errorPayload?.message === "string" ? errorPayload.message : undefined) ??
        (typeof errorPayload?.error === "string" ? errorPayload.error : undefined) ??
        `Request error (${res.status})`,
      cod_mensaje: typeof errorPayload?.cod_mensaje === "number" ? errorPayload.cod_mensaje : undefined,
      data: errorPayload as TError | undefined,
    } satisfies ApiError<TError>;
  }

  if (rawData === undefined) {
    return undefined as TResponse;
  }

  const data = normalizeKeys(rawData);

  await validateApiBusinessError<TError>(data);

  return data as TResponse;
}

async function getJson<T, TError = unknown>(url: string): Promise<T> {
  return requestJson<T, TError>(url, {
    method: "GET",
  });
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function firstDefined<T>(...values: (T | undefined)[]): T | undefined {
  for (const value of values) {
    if (value !== undefined) return value;
  }
  return undefined;
}

function normalizePaginationMeta(
  payload: ApiEnvelope<unknown>,
  itemCount: number,
): Pick<CatalogResponse<unknown>, "page" | "pageSize" | "total" | "totalPages" | "hasNext" | "hasPrevious" | "nextPage" | "prevPage"> {
  const page = firstDefined(toNumber(payload.page), toNumber(payload.pageNumber), toNumber(payload.currentPage), toNumber(payload.pagina), toNumber(payload.paginaActual));

  const pageSize = firstDefined(toNumber(payload.pageSize), toNumber(payload.perPage), toNumber(payload.per_page), toNumber(payload.limit), toNumber(payload.limite), toNumber(payload.rowsPerPage));

  const total = firstDefined(
    toNumber(payload.total),
    toNumber(payload.totalRows),
    toNumber(payload.total_records),
    toNumber(payload.totalRecords),
    toNumber(payload.registros),
    toNumber(payload.length),
  );

  const totalPages =
    firstDefined(toNumber(payload.totalPages), toNumber(payload.pages), toNumber(payload.lastPage), toNumber(payload.last_page), toNumber(payload.paginas)) ??
    (pageSize && total ? Math.ceil(total / pageSize) : undefined);

  const nextPage = toNumber(payload.nextPage) ?? (page && totalPages && page < totalPages ? page + 1 : undefined);

  const prevPage = toNumber(payload.prevPage) ?? (page && page > 1 ? page - 1 : undefined);

  const hasNext = typeof payload.hasNext === "boolean" ? payload.hasNext : nextPage !== undefined && nextPage !== null;

  const hasPrevious = typeof payload.hasPrevious === "boolean" ? payload.hasPrevious : prevPage !== undefined && prevPage !== null;

  return {
    page,
    pageSize,
    total: total ?? itemCount,
    totalPages,
    hasNext,
    hasPrevious,
    nextPage: nextPage ?? null,
    prevPage: prevPage ?? null,
  };
}

function normalizeApiResponse<TSource, TMapped>(payload: TSource[] | ApiEnvelope<TSource[]>, mapItem: (item: TSource) => TMapped): CatalogResponse<TMapped> {
  if (Array.isArray(payload)) {
    return {
      items: payload.map(mapItem),
      length: payload.length,
      total: payload.length,
      raw: payload,
    };
  }

  const sourceItems = Array.isArray(payload.data) ? payload.data : [];
  const items = sourceItems.map(mapItem);
  const pagination = normalizePaginationMeta(payload, items.length);

  return {
    status: toNumber(payload.status),
    message: (typeof payload.mensaje === "string" ? payload.mensaje : undefined) ?? (typeof payload.message === "string" ? payload.message : undefined),
    length: toNumber(payload.length) ?? items.length,
    items,
    ...pagination,
    raw: payload,
  };
}

function normalizeMutationResponse<TResponse>(payload: TResponse | ApiEnvelope<TResponse>): TResponse {
  if (!isRecord(payload)) return payload as TResponse;

  if ("data" in payload) {
    return (payload.data as TResponse) ?? (payload as TResponse);
  }

  return payload as TResponse;
}

export function createCatalogFetcher<TSource, TMapped>(endpoint: string, mapItem: (item: TSource) => TMapped) {
  return async function fetchCatalog(filters?: QueryFilters): Promise<CatalogResponse<TMapped>> {
    const url = buildUrl(endpoint, filters);
    const payload = await getJson<TSource[] | ApiEnvelope<TSource[]>>(url);
    return normalizeApiResponse(payload, mapItem);
  };
}

export function createCatalogHook<TItem>(keyBase: string, fetcher: (filters?: QueryFilters) => Promise<CatalogResponse<TItem>>) {
  return function useCatalog(
    filters?: QueryFilters,
    options?: Omit<UseQueryOptions<CatalogResponse<TItem>, ApiError, CatalogResponse<TItem>, readonly [string, QueryFilters]>, "queryKey" | "queryFn">,
  ): UseQueryResult<CatalogResponse<TItem>, ApiError> {
    return useTanstackQuery<CatalogResponse<TItem>, ApiError, CatalogResponse<TItem>, readonly [string, QueryFilters]>({
      queryKey: [keyBase, filters ?? {}] as const,
      queryFn: () => fetcher(filters),
      staleTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
      placeholderData: (previousData) => previousData,
      ...options,
      meta: {
        feature: "catalogos",
        entity: keyBase,
        action: "list",
        logName: `Consultar ${keyBase}`,
        ...(options?.meta ?? {}),
      },
    });
  };
}

export function createCatalogMutationFetcher<TBody = unknown, TResponse = unknown>(endpoint: string, method: MutationMethod = "POST") {
  return async function mutateCatalog(body?: TBody, filters?: QueryFilters): Promise<TResponse> {
    const url = buildUrl(endpoint, filters);

    const payload = await requestJson<TResponse | ApiEnvelope<TResponse>>(url, {
      method,
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    return normalizeMutationResponse(payload);
  };
}

export function createCatalogMutationHook<TBody = unknown, TResponse = unknown, TContext = unknown>(keyBase: string, mutationFn: (body?: TBody, filters?: QueryFilters) => Promise<TResponse>) {
  return function useCatalogMutation(
    options?: Omit<UseMutationOptions<TResponse, ApiError, { body?: TBody; filters?: QueryFilters }, TContext>, "mutationFn">,
  ): UseMutationResult<TResponse, ApiError, { body?: TBody; filters?: QueryFilters }, TContext> {
    return useTanstackMutation<TResponse, ApiError, { body?: TBody; filters?: QueryFilters }, TContext>({
      mutationFn: ({ body, filters }) => mutationFn(body, filters),
      ...options,
      meta: {
        feature: "catalogos",
        entity: keyBase,
        action: "mutation",
        logName: `Mutar ${keyBase}`,
        ...(options?.meta ?? {}),
      },
    });
  };
}
