/**
 * Validates `callbackUrl` for auth flows — same-origin, path-only (with query/hash).
 */
export function safeCallbackPath(raw: string | null): string | null {
  if (!raw?.trim()) return null;
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost";
    const u = new URL(raw, origin);
    if (u.origin !== new URL(origin).origin) return null;
    if (!u.pathname.startsWith("/")) return null;
    return `${u.pathname}${u.search}${u.hash}`;
  } catch {
    return null;
  }
}
