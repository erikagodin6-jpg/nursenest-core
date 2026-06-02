/**
 * Dev-only missing-key warnings for marketing `t()` — keeps production silent and dedupes noise.
 *
 * Uses `console.warn` + `[nursenest-core]` prefix (no `safe-server-log` import — this module is reachable from client).
 */

const warnedMissingMarketingKeys = new Set<string>();
let missingMarketingKeySessionInvocations = 0;

/** Clears dedupe state (unit tests only). */
export function resetMarketingMissingKeyDevWarningsForTests(): void {
  warnedMissingMarketingKeys.clear();
  missingMarketingKeySessionInvocations = 0;
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
  missingMarketingKeySessionInvocations += 1;
  console.warn("[i18n] Missing marketing message key", { key, fallback });
  if (missingMarketingKeySessionInvocations === 1 || missingMarketingKeySessionInvocations % 25 === 0) {
    console.warn(
      `[nursenest-core] i18n marketing_missing_key_session ${JSON.stringify({
        uniqueKeys: warnedMissingMarketingKeys.size,
        invocations: missingMarketingKeySessionInvocations,
      })}`,
    );
  }
}
