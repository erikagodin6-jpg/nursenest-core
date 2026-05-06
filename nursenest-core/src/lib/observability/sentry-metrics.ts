/**
 * Thin wrappers for Sentry metrics (SDK v10+). Safe no-ops when Sentry is disabled or API unavailable.
 * Prefer **low-cardinality** `attributes` keys — high cardinality breaks billing and alert noise.
 */
import { isSentryServerRuntimeEnabled } from "@/lib/observability/sentry-flags";

type SentryMetricsApi = {
  metrics: {
    count(name: string, value: number, options?: { attributes?: Record<string, string> }): void;
    distribution(name: string, value: number, options?: { attributes?: Record<string, string> }): void;
  };
};

let sentryMetricsPromise: Promise<SentryMetricsApi | null> | null = null;

function loadSentryMetrics(): Promise<SentryMetricsApi | null> {
  if (!sentryMetricsPromise) {
    sentryMetricsPromise = import("@sentry/core")
      .then((mod) => ({ metrics: mod.metrics as unknown as SentryMetricsApi["metrics"] }))
      .catch(() => null);
  }
  return sentryMetricsPromise!;
}

function enabled(): boolean {
  return isSentryServerRuntimeEnabled();
}

/** Increment a counter (e.g. auth failure reason bucket, checkout outcome). */
export function sentryCount(
  name: string,
  value: number = 1,
  attributes?: Record<string, string>,
): void {
  if (!enabled()) return;
  void loadSentryMetrics().then((api) => {
    if (!api) return;
    try {
      api.metrics.count(name, value, attributes ? { attributes } : undefined);
    } catch {
      /* noop — edge / constrained runtime */
    }
  });
}

/** Distribution sample (e.g. API duration ms). */
export function sentryDistribution(name: string, value: number, attributes?: Record<string, string>): void {
  if (!enabled()) return;
  void loadSentryMetrics().then((api) => {
    if (!api) return;
    try {
      api.metrics.distribution(name, value, attributes ? { attributes } : undefined);
    } catch {
      /* noop */
    }
  });
}
