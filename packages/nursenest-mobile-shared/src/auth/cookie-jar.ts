/**
 * Minimal cookie jar for NextAuth session cookies on React Native.
 * Stores a `Cookie` header value (name=value pairs joined by "; ").
 */

const SESSION_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
] as const;

export function parseCookieHeader(cookieHeader: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (!trimmed.includes("=")) continue;
    const eq = trimmed.indexOf("=");
    const name = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (name) map.set(name, value);
  }
  return map;
}

export function serializeCookieHeader(map: Map<string, string>): string {
  return [...map.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

/** Extract name=value from each Set-Cookie line (first segment only). */
export function parseSetCookieLines(lines: string[]): Map<string, string> {
  const out = new Map<string, string>();
  for (const line of lines) {
    const first = line.split(";")[0]?.trim();
    if (!first?.includes("=")) continue;
    const eq = first.indexOf("=");
    const name = first.slice(0, eq).trim();
    const value = first.slice(eq + 1).trim();
    if (name && value !== undefined) out.set(name, value);
  }
  return out;
}

export function mergeCookieJar(existingHeader: string | null | undefined, setCookieLines: string[]): string {
  const base = parseCookieHeader(existingHeader ?? "");
  const incoming = parseSetCookieLines(setCookieLines);
  for (const [k, v] of incoming) {
    base.set(k, v);
  }
  return serializeCookieHeader(base);
}

export function clearSessionCookiesFromJar(cookieHeader: string | null | undefined): string {
  const map = parseCookieHeader(cookieHeader ?? "");
  for (const name of SESSION_COOKIE_NAMES) {
    map.delete(name);
  }
  return serializeCookieHeader(map);
}

export function readSetCookieHeaders(headers: Headers): string[] {
  const h = headers as Headers & { getSetCookie?: () => string[] };
  if (typeof h.getSetCookie === "function") {
    return h.getSetCookie();
  }
  const single = headers.get("set-cookie");
  return single ? [single] : [];
}
