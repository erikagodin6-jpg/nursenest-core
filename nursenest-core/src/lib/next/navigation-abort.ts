/**
 * Next.js App Router implements `redirect()` / `notFound()` / `permanentRedirect()` by throwing
 * special digest-bearing errors. These must never be caught and treated as ordinary failures.
 */

export function isNextRedirectError(e: unknown): boolean {
  if (typeof e !== "object" || e === null) return false;
  const digest = "digest" in e ? String((e as { digest?: unknown }).digest) : "";
  return digest.startsWith("NEXT_REDIRECT");
}

export function isNextNotFoundNavigationError(e: unknown): boolean {
  if (typeof e !== "object" || e === null) return false;
  const digest = "digest" in e ? String((e as { digest?: unknown }).digest) : "";
  return digest === "NEXT_NOT_FOUND" || digest.includes("NEXT_NOT_FOUND");
}

/** Re-throws Next navigation control-flow errors so callers can use try/catch or Promise.allSettled safely. */
export function rethrowNextNavigationControlFlow(e: unknown): void {
  if (isNextRedirectError(e) || isNextNotFoundNavigationError(e)) {
    throw e;
  }
}
