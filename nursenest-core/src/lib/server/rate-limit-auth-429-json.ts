/**
 * JSON body for proxy 429s on {@link isAuthStrictPath} routes.
 * NextAuth `signIn({ redirect: false })` requires `data.url` so `new URL(data.url)` does not throw.
 *
 * The URL must be a **real UI route** (never `/api/auth/signin` or `/api/auth/error`): if anything
 * follows `data.url` as a full-page navigation, users would see raw JSON or Auth.js stubs instead of `/login`.
 */
export function buildAuthStrictRateLimit429Json(origin: string, retryAfterSec: number): Record<string, unknown> {
  const u = new URL("/login", origin);
  u.searchParams.set("error", "AccessDenied");
  u.searchParams.set("code", "rate_limit_exceeded");
  u.searchParams.set("retryAfterSec", String(retryAfterSec));
  return {
    url: u.toString(),
    error: "Too many requests",
    code: "rate_limit_exceeded",
    retryAfterSec,
  };
}
