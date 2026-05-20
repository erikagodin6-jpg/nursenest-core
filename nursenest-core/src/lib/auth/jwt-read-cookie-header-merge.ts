/**
 * Pure helpers for JWT read paths: `@auth/core` `getToken` only parses the raw `Cookie` header string.
 * When App Router omits `Cookie` from `headers()`, rebuild it from `cookies().getAll()` before calling `getToken`.
 */

export type CookieJarEntry = { name: string; value: string };

/**
 * If `merged` has no non-empty `Cookie` header, serializes `jarEntries` into one `Cookie` header.
 * Mutates `merged` when synthesis runs. Safe to call with an empty jar (no-op).
 */
export function ensureCookieHeaderForJwtRead(
  merged: Headers,
  jarEntries: ReadonlyArray<CookieJarEntry>,
): { hadIncomingCookieHeader: boolean; synthesizedFromJar: boolean } {
  const hadIncomingCookieHeader = Boolean(merged.get("cookie")?.trim());
  if (hadIncomingCookieHeader) {
    return { hadIncomingCookieHeader: true, synthesizedFromJar: false };
  }
  if (!jarEntries.length) {
    return { hadIncomingCookieHeader: false, synthesizedFromJar: false };
  }
  const serialized = jarEntries.map((c) => `${c.name}=${c.value}`).join("; ");
  if (!serialized.trim()) {
    return { hadIncomingCookieHeader: false, synthesizedFromJar: false };
  }
  merged.set("Cookie", serialized);
  return { hadIncomingCookieHeader: false, synthesizedFromJar: true };
}
