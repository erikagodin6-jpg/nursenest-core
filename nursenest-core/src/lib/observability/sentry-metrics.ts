/**
 * Thin wrappers for Sentry metrics (SDK v10+). Safe no-ops when Sentry is disabled or API unavailable.
 * Prefer **low-cardinality** `attributes` keys — high cardinality breaks billing and alert noise.
 */
import { metrics } from "@sentry/core";

function enabled(): boolean {
  return process.env.SENTRY_ENABLED === "true";
}

/** Increment a counter (e.g. auth failure reason bucket, checkout outcome). */
export function sentryCount(
  name: string,
  value: number = 1,
  attributes?: Record<string, string>,
): void {
  if (!enabled()) return;
  try {
    metrics.count(name, value, attributes ? { attributes } : undefined);
  } catch {
    /* noop — edge / constrained runtime */
  }
}

/** Distribution sample (e.g. API duration ms). */
export function sentryDistribution(name: string, value: number, attributes?: Record<string, string>): void {
  if (!enabled()) return;
  try {
    metrics.distribution(name, value, attributes ? { attributes } : undefined);
  } catch {
    /* noop */
  }
}
