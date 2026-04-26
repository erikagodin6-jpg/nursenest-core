import { logNnMarketingClientError } from "@/lib/marketing/nn-marketing-client-error-log";

/**
 * When to show MarketingHomeSafeMode vs a generic error card.
 * Narrow markers only — never match generic "home" (chunk paths, stacks, etc.).
 */
export function shouldUseMarketingHomeSafeModeFromError(error: {
  message?: string;
  digest?: string;
}): boolean {
  const blob = `${error?.message ?? ""} ${error?.digest ?? ""}`.toLowerCase();
  return (
    blob.includes("marketing_homepage") ||
    blob.includes("pages.home.") ||
    blob.includes("nn_homepage")
  );
}

export function logMarketingRouteErrorClient(
  surface: string,
  error: Error & { digest?: string },
  extra?: Record<string, unknown>,
): void {
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
