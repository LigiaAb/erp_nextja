export function getClientCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const parts = document.cookie.split(";").map((p) => p.trim());
  for (const part of parts) {
    if (part.startsWith(name + "=")) return decodeURIComponent(part.slice(name.length + 1));
  }
  return null;
}

export function setClientCookie(name: string, value: string, days?: number) {
  if (days !== undefined) {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}`;
  }
  else {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
  }
}

export function deleteClientCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0`;
}
