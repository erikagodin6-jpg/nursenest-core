/**
 * Legacy bundled OSCE JSON is used only when the DB table is empty **and**
 * `OSCE_LEGACY_FALLBACK=1` is set (staging / local import). Production should
 * rely on migrated `osce_stations` rows instead of `@legacy-client` bundles.
 */
export function isOsceLegacyFallbackWhenDbEmptyEnabled(): boolean {
  const v = process.env.OSCE_LEGACY_FALLBACK?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}
