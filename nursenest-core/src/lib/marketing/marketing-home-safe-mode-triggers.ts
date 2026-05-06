import {
  logNnMarketingClientError,
  nnMarketingClientDiagnosticsEnabled,
} from "@/lib/marketing/nn-marketing-client-error-log";

/**
 * When to show MarketingHomeSafeMode vs a generic error card.
 *
 * Do **not** match `pages.home.` — i18n and copy guards often embed that key prefix in
 * thrown messages (e.g. `[marketing] missing required marketing copy: pages.home…`,
 * `… in resolved:pages.home…`), which would incorrectly force safe-mode for routine
 * marketing errors and hide the real homepage.
 *
 * Reserve safe-mode for errors that **explicitly** opt in via `marketing_homepage` /
 * `nn_homepage` in the message or digest.
 */
export function shouldUseMarketingHomeSafeModeFromError(error: {
  message?: string;
  digest?: string;
}): boolean {
  const blob = `${error?.message ?? ""} ${error?.digest ?? ""}`.toLowerCase();
  return blob.includes("marketing_homepage") || blob.includes("nn_homepage");
}

export function logMarketingRouteErrorClient(
  surface: string,
  error: Error & { digest?: string },
  extra?: Record<string, unknown>,
): void {
  if (!nnMarketingClientDiagnosticsEnabled()) return;
  try {
    logNnMarketingClientError(`marketing_route:${surface}`, error);
    const stack = typeof error?.stack === "string" ? error.stack.slice(0, 4000) : undefined;
    console.error(
      "[nn-marketing-route-error]",
      JSON.stringify({
        surface,
        name: error?.name,
        message: error?.message,
        digest: error?.digest,
        stack,
        ...extra,
      }),
    );
  } catch {
    /* ignore */
  }
}
