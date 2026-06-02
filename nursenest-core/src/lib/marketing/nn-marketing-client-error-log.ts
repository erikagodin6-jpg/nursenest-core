/**
 * Central client-side diagnostics for marketing route / main-column failures.
 * Used from `error.tsx`, `MarketingMainErrorBoundary`, and related paths so
 * Playwright and browser devtools always see the same prefix.
 *
 * **Production noise:** logs only when `NODE_ENV !== "production"` (e.g. `next dev`)
 * or when `NEXT_PUBLIC_NN_MARKETING_CLIENT_ERROR_DEBUG=1` is set at **build** time
 * for `next build` / CI (inlined into the client bundle).
 */
export function nnMarketingClientDiagnosticsEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return process.env.NEXT_PUBLIC_NN_MARKETING_CLIENT_ERROR_DEBUG === "1";
}

export function logNnMarketingClientError(
  surface: string,
  error: Error & { digest?: string },
  info?: { componentStack?: string },
): void {
  if (!nnMarketingClientDiagnosticsEnabled()) return;
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
