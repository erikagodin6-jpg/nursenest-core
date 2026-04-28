/**
 * Dev-only missing-key warnings for marketing `t()` — keeps production silent and dedupes noise.
 */

const warnedMissingMarketingKeys = new Set<string>();

/** Clears dedupe state (unit tests only). */
export function resetMarketingMissingKeyDevWarningsForTests(): void {
  warnedMissingMarketingKeys.clear();
}

export type WarnMissingMarketingMessageKeyDevOpts = {
  /** When false (e.g. empty degraded catalog), skip — avoids spam outside a real provider. */
  hasCatalog: boolean;
};

/**
 * Logs once per key in development when marketing copy is missing and UI will humanize.
 * Never throws; never logs in production.
 */
export function warnMissingMarketingMessageKeyDev(
  key: string,
  fallback: string,
  opts: WarnMissingMarketingMessageKeyDevOpts,
): void {
  if (process.env.NODE_ENV === "production") return;
  if (!opts.hasCatalog) return;
  if (warnedMissingMarketingKeys.has(key)) return;
  warnedMissingMarketingKeys.add(key);
  console.warn("[i18n] Missing marketing message key", { key, fallback });
}
