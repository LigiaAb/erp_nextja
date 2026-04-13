import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiFetch, buildUrl, type ApiError } from "@/lib/api/apiFetch";

// Helpers
function mockFetchOnce(response: Partial<Response> & { status?: number; ok?: boolean; bodyText?: string }) {
  const res = {
    ok: response.ok ?? true,
    status: response.status ?? 200,
    text: vi.fn(async () => response.bodyText ?? ""),
  } as unknown as Response;

  (globalThis.fetch as any).mockResolvedValueOnce(res);
  return res;
}

describe("buildUrl", () => {
  it("arma querystring y omite null/undefined", () => {
    const out = buildUrl("/endpoint", { a: 1, b: "x", c: null, d: undefined });
    expect(out).toBe("/endpoint?a=1&b=x");
  });

  it("si no hay params, devuelve base", () => {
    const out = buildUrl("/endpoint", { a: null, b: undefined });
    expect(out).toBe("/endpoint");
  });
});

describe("apiFetch", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...OLD_ENV, NEXT_PUBLIC_API_URL: "https://api.example.com" };

    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    process.env = OLD_ENV;
    vi.restoreAllMocks();
    // @ts-expect-error cleanup
    delete (globalThis as any).window;
  });

  it("hace fetch con URL base + path", async () => {
    mockFetchOnce({ ok: true, status: 200, bodyText: JSON.stringify({ hello: "world" }) });

    const res = await apiFetch<{ hello: string }>("/ping");
    expect(res.hello).toBe("world");

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    const [calledUrl] = (globalThis.fetch as any).mock.calls[0];
    expect(calledUrl).toBe("https://api.example.com/ping");
  });

  it("si status 204, devuelve undefined", async () => {
    mockFetchOnce({ ok: true, status: 204, bodyText: "" });

    const res = await apiFetch<void>("/no-content");
    expect(res).toBeUndefined();
  });

  it("si response.ok=false, lanza ApiError con message de payload", async () => {
    mockFetchOnce({
      ok: false,
      status: 400,
      bodyText: JSON.stringify({ mensaje: "Fallo backend", cod_mensaje: 123 }),
    });

    try {
      await apiFetch("/bad");
      throw new Error("Expected to throw");
    } catch (e) {
      const err = e as ApiError;
      expect(err.status).toBe(400);
      expect(err.message).toBe("Fallo backend");
      expect(err.cod_mensaje).toBe(123);
      expect(err.data).toEqual({ mensaje: "Fallo backend", cod_mensaje: 123 });
    }
  });

  it("si expectEnvelope y success=false, lanza ApiError", async () => {
    mockFetchOnce({
      ok: true,
      status: 200,
      bodyText: JSON.stringify({ success: false, cod_mensaje: 999, mensaje: "Regla de negocio" }),
    });

    await expect(apiFetch("/envelope", { expectEnvelope: true })).rejects.toMatchObject({
      status: 999,
      message: "Regla de negocio",
      cod_mensaje: 999,
    });
  });

  it("si auth=true en CLIENT, lanza ApiError 401 (y no llama fetch)", async () => {
    // Simular client
    (globalThis as any).window = { location: { pathname: "/x", href: "" } };

    await expect(apiFetch("/needs-auth", { auth: true })).rejects.toMatchObject({
      status: 401,
    });

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("si status 401/403 en client, redirige a /login (cuando no estás ya en /login)", async () => {
    (globalThis as any).window = { location: { pathname: "/dashboard", href: "" } };

    mockFetchOnce({
      ok: false,
      status: 401,
      bodyText: JSON.stringify({ message: "Unauthorized" }),
    });

    await expect(apiFetch("/unauth")).rejects.toMatchObject({ status: 401 });

    expect((globalThis as any).window.location.href).toBe("/login");
  });

  it("si errorPayload no es JSON, usa message por defecto con status", async () => {
    mockFetchOnce({ ok: false, status: 500, bodyText: "<html>oops</html>" });

    await expect(apiFetch("/boom")).rejects.toMatchObject({
      status: 500,
      message: "Request error (500)",
    });
  });
});
