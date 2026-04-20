import { PINNED_AUTH_BASE_PATH } from "@/lib/auth/auth-base-path";

/**
 * JSON body for proxy 429s on {@link isAuthStrictPath} routes.
 * NextAuth `signIn({ redirect: false })` requires `data.url` so `new URL(data.url)` does not throw.
 */
export function buildAuthStrictRateLimit429Json(origin: string, retryAfterSec: number): Record<string, unknown> {
  return {
    url: `${origin}${PINNED_AUTH_BASE_PATH}/signin?error=AccessDenied&code=rate_limit_exceeded`,
    error: "Too many requests",
    code: "rate_limit_exceeded",
    retryAfterSec,
  };
}
