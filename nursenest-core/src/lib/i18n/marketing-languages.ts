/**
 * Locale codes aligned with legacy `client/src/lib/i18n.tsx` for marketing shell links.
 * Core-hosted locales use `/{code}/…` routes; see `marketing-locale-policy.ts` and `LOCALE_REGION_THEME.md`.
 *
 * **Tiers** reflect overlay translation coverage vs English (`marketing-en.json`). Incomplete locales
 * remain routable and merged; they are hidden from the header/footer switcher so users are not
 * steered into mostly-English experiences.
 */
export type MarketingLanguageTier = "full" | "partial" | "incomplete";

export type MarketingLanguage = {
  code: string;
  name: string;
  flag: string;
  tier: MarketingLanguageTier;
};

export const MARKETING_LANGUAGES: MarketingLanguage[] = [
  { code: "en", name: "English", flag: "\uD83C\uDDEC\uD83C\uDDE7", tier: "full" },
  { code: "fr", name: "Fran\u00e7ais", flag: "\uD83C\uDDEB\uD83C\uDDF7", tier: "partial" },
  { code: "tl", name: "Tagalog", flag: "\uD83C\uDDF5\uD83C\uDDED", tier: "full" },
  { code: "hi", name: "\u0939\u093f\u0928\u094d\u0926\u0940", flag: "\uD83C\uDDEE\uD83C\uDDF3", tier: "incomplete" },
  { code: "es", name: "Espa\u00f1ol", flag: "\uD83C\uDDEA\uD83C\uDDF8", tier: "full" },
  { code: "zh", name: "\u4e2d\u6587", flag: "\uD83C\uDDE8\uD83C\uDDF3", tier: "incomplete" },
  { code: "zh-tw", name: "\u7e41\u9ad4\u4e2d\u6587", flag: "\uD83C\uDDF9\uD83C\uDDFC", tier: "incomplete" },
  { code: "ar", name: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", flag: "\uD83C\uDDF8\uD83C\uDDE6", tier: "incomplete" },
  { code: "ko", name: "\ud55c\uad6d\uc5b4", flag: "\uD83C\uDDF0\uD83C\uDDF7", tier: "incomplete" },
  { code: "pt", name: "Portugu\u00eas", flag: "\uD83C\uDDE7\uD83C\uDDF7", tier: "incomplete" },
  { code: "pa", name: "\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40", flag: "\uD83C\uDDE8\uD83C\uDDE6", tier: "incomplete" },
  { code: "vi", name: "Ti\u1ebfng Vi\u1ec7t", flag: "\uD83C\uDDFB\uD83C\uDDF3", tier: "incomplete" },
  { code: "ht", name: "Krey\u00f2l", flag: "\uD83C\uDDED\uD83C\uDDF9", tier: "incomplete" },
  { code: "ur", name: "\u0627\u0631\u062f\u0648", flag: "\uD83C\uDDF5\uD83C\uDDF0", tier: "incomplete" },
  { code: "ja", name: "\u65e5\u672c\u8a9e", flag: "\uD83C\uDDEF\uD83C\uDDF5", tier: "incomplete" },
  { code: "fa", name: "\u0641\u0627\u0631\u0633\u06cc", flag: "\uD83C\uDDEE\uD83C\uDDF7", tier: "incomplete" },
  { code: "de", name: "Deutsch", flag: "\uD83C\uDDE9\uD83C\uDDEA", tier: "incomplete" },
  { code: "th", name: "\u0e44\u0e17\u0e22", flag: "\uD83C\uDDF9\uD83C\uDDED", tier: "incomplete" },
  { code: "tr", name: "T\u00fcrk\u00e7e", flag: "\uD83C\uDDF9\uD83C\uDDF7", tier: "incomplete" },
  { code: "id", name: "Indonesia", flag: "\uD83C\uDDEE\uD83C\uDDE9", tier: "incomplete" },
];

/** Suffix for partial-tier locales in the switcher (English; switcher is a meta-UI affordance). */
export const MARKETING_LANGUAGE_PARTIAL_SWITCHER_SUFFIX = " (partial)";

/**
 * Locales shown in header/footer language picker: high- and medium-coverage overlays only.
 * Order: full first (en, es, tl), then partial (fr).
 */
const SWITCHER_CODES_ORDER: readonly string[] = ["en", "es", "tl", "fr"];

export function getMarketingLanguagesForSwitcher(): MarketingLanguage[] {
  return SWITCHER_CODES_ORDER.map((code) => MARKETING_LANGUAGES.find((l) => l.code === code)).filter(
    (l): l is MarketingLanguage => l != null && (l.tier === "full" || l.tier === "partial"),
  );
}

export function marketingLanguageDisplayNameForSwitcher(lang: MarketingLanguage): string {
  if (lang.tier === "partial") {
    return `${lang.name}${MARKETING_LANGUAGE_PARTIAL_SWITCHER_SUFFIX}`;
  }
  return lang.name;
}
