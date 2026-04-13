// lib/api/apiFetch.ts

export type ApiError<T = unknown> = {
  status: number;
  message: string;
  cod_mensaje?: number;
  data?: T;
};

export type ApiFetchOptions<TBody = unknown> = Omit<RequestInit, "body"> & {
  auth?: boolean;
  body?: TBody;
  /**
   * Si tu backend responde con un "envelope" tipo:
   * { success, cod_mensaje, mensaje, data }
   * y quieres que apiFetch lance error cuando success === false.
   */
  expectEnvelope?: boolean;
};

type EnvelopeLike = {
  success?: boolean;
  cod_mensaje?: number;
  mensaje?: string;
  message?: string;
  data?: unknown;
};

export function buildUrl(base: string, params: Record<string, unknown>): string {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, String(v)]),
  );
  const qs = query.toString();
  return qs ? `${base}?${qs}` : base;
}

function isServer(): boolean {
  return typeof window === "undefined";
}

/**
 * ✅ Flag legible por el cliente para mostrar diálogo de sesión vencida.
 * NO usa Redux aquí, porque apiFetch corre server-side.
 *
 * - En server: intenta escribir cookie normal (NO httpOnly) para que el cliente la pueda leer.
 * - En client: escribe document.cookie.
 */
export async function setSessionExpiredFlag() {
  if (isServer()) {
    try {
      const mod = await import("next/headers");
      const store = await mod.cookies();

      store.set("session_expired", "1", {
        path: "/",
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    } catch (error) {
      console.error("No se pudo escribir la cookie session_expired en server:", error);
    }

    return;
  }

  document.cookie = `session_expired=1; path=/`;
}

/**
 * Helpers para server (leer cookies httpOnly cuando apiFetch corre en Server Actions / RSC)
 * - token cookie: "token"
 * - version cookie: "version"
 */
async function getTokenFromCookies(): Promise<string | null> {
  if (!isServer()) return null;
  const mod = await import("next/headers");
  const store = await mod.cookies();
  return store.get("token")?.value ?? null;
}

async function getVersionFromCookies(): Promise<string | null> {
  if (!isServer()) return null;
  const mod = await import("next/headers");
  const store = await mod.cookies();
  return store.get("version_app")?.value ?? null;
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

// payload genérico con message/mensaje/cod_mensaje
function hasMessage(x: unknown): x is { message?: string; mensaje?: string; cod_mensaje?: number } {
  return typeof x === "object" && x !== null;
}

function isEnvelopeLike(x: unknown): x is EnvelopeLike {
  if (typeof x !== "object" || x === null) return false;
  return "success" in x || "cod_mensaje" in x || "mensaje" in x || "data" in x;
}

export async function apiFetch<TResponse, TBody = unknown, TError = unknown>(url: string, options: ApiFetchOptions<TBody> = {}): Promise<TResponse> {
  console.log("Api:", url, options);

  const headers = new Headers(options.headers);
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  if (!isFormData) {
    headers.set("content-type", "application/json");
  }

  /**
   * ✅ Auth headers con cookies (NO localStorage)
   *
   * - En SERVER: leemos cookies httpOnly y ponemos headers authorization/version_app.
   * - En CLIENT: NO podemos leer cookie httpOnly para armar Authorization.
   */
  if (options.auth) {
    if (isServer()) {
      const token = await getTokenFromCookies();
      const version = await getVersionFromCookies();

      if (token) headers.set("authorization", token);
      if (version) headers.set("version_app", version);

      if (!token || !version) {
        await setSessionExpiredFlag();

        throw {
          status: 401,
          message: "Sesión no válida (token/version faltante).",
          cod_mensaje: 401,
        } satisfies ApiError<TError>;
      }
    }
    else {
      throw {
        status: 401,
        message: "No se puede armar Authorization en client usando cookie httpOnly. Llama este endpoint desde Server Action/Route Handler, o usa auth por cookie en el backend.",
        cod_mensaje: 401,
      } satisfies ApiError<TError>;
    }
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers,
    credentials: options.credentials ?? (options.auth ? "include" : "same-origin"),
    body: isFormData || options.body === undefined ? (options.body as BodyInit | null | undefined) : JSON.stringify(options.body),
  });

  // ✅ Error HTTP real (status != 2xx)
  if (!response.ok) {
    const errorPayload = await parseJsonSafe<TError>(response);

    let message = `Request error (${response.status})`;
    let cod_mensaje: number | undefined;

    if (hasMessage(errorPayload)) {
      const payload = errorPayload as { message?: string; mensaje?: string; cod_mensaje?: number };
      message = payload.mensaje ?? payload.message ?? message;
      cod_mensaje = payload.cod_mensaje;
    }

    if (response.status === 401 || response.status === 403) {
      await setSessionExpiredFlag();
    }

    throw {
      status: response.status,
      message,
      cod_mensaje,
      data: errorPayload,
    } satisfies ApiError<TError>;
  }

  // ✅ 204 No Content
  if (response.status === 204) {
    return undefined as TResponse;
  }

  const data = await parseJsonSafe<TResponse>(response);

  // ✅ Si esperas envelope y el backend devuelve { success: false ... } => error "de negocio"
  if (options.expectEnvelope && isEnvelopeLike(data)) {
    const nestedData = data.data as { success?: boolean; cod_mensaje?: number } | undefined;
    const hasSuccess = "success" in data || (!!nestedData && "success" in nestedData);

    if (hasSuccess) {
      const success = data.success ?? nestedData?.success ?? true;

      if (!success) {
        const cod = data.cod_mensaje ?? 400;
        const msg = data.mensaje ?? data.message ?? "Error inesperado";

        const codigos = [1001, 1003];
        const codigo = data.cod_mensaje ?? nestedData?.cod_mensaje ?? undefined;

        if (codigo === 1062 || (codigo !== undefined && codigos.includes(codigo))) {
          await setSessionExpiredFlag();
        }

        throw {
          status: cod,
          message: String(msg),
          cod_mensaje: data.cod_mensaje,
          data: undefined,
        } satisfies ApiError<TError>;
      }
    }
  }

  return data as TResponse;
}
