/**
 * Lazy entry to Sentry span helpers used from marketing layouts — keeps `@sentry/nextjs` graph
 * off the static import path of `layout.tsx`.
 */
export type MarketingLayoutObservabilityModule = typeof import("@/lib/observability/sentry-route-observability");

let modulePromise: Promise<MarketingLayoutObservabilityModule> | null = null;

export function loadMarketingLayoutObservability(): Promise<MarketingLayoutObservabilityModule> {
  if (!modulePromise) {
    modulePromise = import("@/lib/observability/sentry-route-observability");
  }
  return modulePromise;
}
