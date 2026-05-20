/**
 * Incident / degraded mode: skip non-essential database reads and return empty fallbacks.
 * Set `RUNTIME_SAFE_MODE=1` (or `true`) when the database is unstable or under recovery.
 *
 * Does not affect auth writes; pair with monitoring. Read paths using `withDatabaseFallback`
 * or `withDatabaseFallbackTimeout` automatically return their fallbacks without querying.
 */
export function isRuntimeSafeMode(): boolean {
  const v = process.env.RUNTIME_SAFE_MODE?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}
