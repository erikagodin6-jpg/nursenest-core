/**
 * Multilingual rollout gate (client + server).
 *
 * Default: off — target language UI stays hidden from public nav;
 *              preview via `?previewLocale=xx` is staff-only.
 *
 * Target languages: Tagalog (tl), Arabic (ar), German (de),
 *                   Indonesian (id), Japanese (ja).
 *
 * When enabled, locales are surfaced in:
 *   - Language selector
 *   - SEO hreflang tags
 *   - Sitemap (except when feature flag is off)
 *
 * Env: NEXT_PUBLIC_ENABLE_MULTILINGUAL_ROLLOUT="true"
 */
export function isMultilingualRolloutEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_MULTILINGUAL_ROLLOUT === "true";
}

/** Locales covered by this targeted rollout. */
export const MULTILINGUAL_ROLLOUT_LOCALES = [
  "tl",
  "ar",
  "de",
  "id",
  "ja",
] as const;

export type MultilingualRolloutLocale =
  (typeof MULTILINGUAL_ROLLOUT_LOCALES)[number];

/** Check if a locale is part of the targeted rollout set. */
export function isRolloutLocale(locale: string): locale is MultilingualRolloutLocale {
  return MULTILINGUAL_ROLLOUT_LOCALES.includes(locale as MultilingualRolloutLocale);
}

/**
 * Determine whether a locale should be visible to the current request.
 *
 * Rules:
 *   - If rollout is enabled → all rollout locales are public
 *   - If rollout is disabled → only staff/preview can see them
 *   - English (en) and existing public locales (fr, es, pt, hi, etc.) are always public
 */
export function isLocaleVisible(
  locale: string,
  opts?: { isStaff?: boolean; previewLocale?: string }
): boolean {
  if (!isRolloutLocale(locale)) return true; // non-rollout locales are always public
  if (isMultilingualRolloutEnabled()) return true;
  if (opts?.isStaff) return true;
  if (opts?.previewLocale === locale) return true;
  return false;
}
