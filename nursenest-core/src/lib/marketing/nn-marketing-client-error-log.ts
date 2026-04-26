/**
 * Central client-side diagnostics for marketing route / main-column failures.
 * Used from `error.tsx`, `MarketingMainErrorBoundary`, and related paths so
 * Playwright and browser devtools always see the same prefix.
 */
export function logNnMarketingClientError(
  surface: string,
  error: Error & { digest?: string },
  info?: { componentStack?: string },
): void {
  try {
    const pathname =
      typeof window !== "undefined" && typeof window.location?.pathname === "string"
        ? window.location.pathname
        : "";
    console.error(
      "[NN_MARKETING_CLIENT_ERROR]",
      JSON.stringify({
        surface,
        pathname,
        message: error?.message ?? String(error),
        stack: typeof error?.stack === "string" ? error.stack.slice(0, 8000) : undefined,
        digest: error?.digest != null ? String(error.digest) : undefined,
        componentStack:
          typeof info?.componentStack === "string" ? info.componentStack.slice(0, 4000) : undefined,
      }),
    );
  } catch {
    try {
      console.error("[NN_MARKETING_CLIENT_ERROR]", surface, error?.message ?? String(error));
    } catch {
      /* ignore */
    }
  }
}
