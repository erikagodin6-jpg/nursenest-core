/**
 * Emergency / abuse spike: tighten **anonymous & public JSON** per-IP limits (~50%),
 * without changing authenticated learner buckets.
 *
 * Set `NN_RATE_LIMIT_STRICT_PUBLIC=1` during viral traffic or scraping storms; unset to restore defaults.
 */
export function isPublicRateLimitStrictMode(): boolean {
  const v = process.env.NN_RATE_LIMIT_STRICT_PUBLIC?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

export function tightenPublicCap(base: number): number {
  if (!isPublicRateLimitStrictMode()) return base;
  return Math.max(1, Math.floor(base * 0.5));
}
