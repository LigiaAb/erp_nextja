const CANDIDATE_KEYS = ["cod_usuario", "codUsuario"] as const;
type CodUsuarioResolver = () => string | undefined;
let customResolver: CodUsuarioResolver | undefined;

const normalizeValue = (value: unknown): string | undefined => {
  if (value === null || value === undefined) return undefined;
  const parsed = String(value).trim();
  return parsed.length > 0 ? parsed : undefined;
};

const getFromJsonObject = (value: unknown): string | undefined => {
  if (!value || typeof value !== "object") return undefined;

  const record = value as Record<string, unknown>;
  for (const key of CANDIDATE_KEYS) {
    const candidate = normalizeValue(record[key]);
    if (candidate) return candidate;
  }

  return undefined;
};

const getFromStorage = (storage: Storage): string | undefined => {
  for (const key of CANDIDATE_KEYS) {
    const direct = normalizeValue(storage.getItem(key));
    if (direct) return direct;
  }

  const authRaw = storage.getItem("auth");
  if (!authRaw) return undefined;

  try {
    const parsed = JSON.parse(authRaw) as unknown;
    return getFromJsonObject(parsed);
  } catch {
    return undefined;
  }
};

const getFromCookie = (): string | undefined => {
  if (typeof document === "undefined") return undefined;

  const cookieItems = document.cookie.split(";").map((item) => item.trim());
  for (const cookie of cookieItems) {
    const [rawKey, ...rawValue] = cookie.split("=");
    if (rawKey !== "cod_usuario") continue;
    return normalizeValue(decodeURIComponent(rawValue.join("=")));
  }

  return undefined;
};

const getFromReduxStore = (): string | undefined => {
  if (customResolver) {
    try {
      const customValue = normalizeValue(customResolver());
      if (customValue) return customValue;
    } catch {
      // ignore custom resolver failures
    }
  }

  if (typeof window === "undefined") return undefined;

  try {
    const maybeWindow = window as typeof window & {
      __NEXT_REDUX_STORE__?: { getState?: () => unknown };
    };
    const state = maybeWindow.__NEXT_REDUX_STORE__?.getState?.() as { auth?: { cod_usuario?: unknown } } | undefined;
    return normalizeValue(state?.auth?.cod_usuario);
  } catch {
    return undefined;
  }
};

export const setCodUsuarioResolver = (resolver?: CodUsuarioResolver) => {
  customResolver = resolver;
};

export const resolveClientCodUsuario = (explicitValue?: string): string | undefined => {
  const explicit = normalizeValue(explicitValue);
  if (explicit) return explicit;

  if (typeof window === "undefined") return undefined;

  const fromStore = getFromReduxStore();
  if (fromStore) return fromStore;

  const fromLocalStorage = getFromStorage(window.localStorage);
  if (fromLocalStorage) return fromLocalStorage;

  const fromSessionStorage = getFromStorage(window.sessionStorage);
  if (fromSessionStorage) return fromSessionStorage;

  return getFromCookie();
};
