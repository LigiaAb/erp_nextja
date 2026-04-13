// lib/query/queryLogger.ts

export type QueryAction = "GET" | "MUTATE";
export type QueryStatus = "SUCCESS" | "ERROR";

export type AppQueryMeta = {
  feature?: string;
  entity?: string;
  action?: string;
  logName?: string;
  silent?: boolean;
};

export type QueryLogPayload = {
  kind: QueryAction;
  status: QueryStatus;
  queryKey?: readonly unknown[];
  mutationKey?: readonly unknown[];
  meta?: AppQueryMeta;
  data?: unknown;
  error?: unknown;
  variables?: unknown;
};

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    const typedError = error as Error & { status?: number; cod_mensaje?: number; data?: unknown };

    return {
      name: typedError.name,
      message: typedError.message,
      status: typedError.status ?? null,
      cod_mensaje: typedError.cod_mensaje ?? null,
      data: typedError.data ?? null,
    };
  }

  if (typeof error === "object" && error !== null) {
    return error;
  }

  return {
    message: String(error),
  };
}

export async function logQueryEvent(payload: QueryLogPayload) {
  if (payload.meta?.silent) return;

  const base = {
    kind: payload.kind,
    status: payload.status,
    feature: payload.meta?.feature ?? null,
    entity: payload.meta?.entity ?? null,
    action: payload.meta?.action ?? null,
    logName: payload.meta?.logName ?? null,
    queryKey: payload.queryKey ?? null,
    mutationKey: payload.mutationKey ?? null,
  };

  if (payload.status === "SUCCESS") {
    // console.log("[TANSTACK_LOG]", {
    //   ...base,
    //   data: payload.data,
    //   variables: payload.variables ?? null,
    // });
    return;
  }

  console.warn("[TANSTACK_LOG]", {
    ...base,
    error: normalizeError(payload.error),
    variables: payload.variables ?? null,
  });
}
