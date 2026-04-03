import { MARKETING_LANGUAGES } from "./marketing-languages";

/** Default marketing locale: URL has no `/[locale]` prefix; lavender theme remains app default via `AppThemeProvider`. */
export const DEFAULT_MARKETING_LOCALE = "en" as const;

/** All routable marketing locale codes (overlays + `/{code}/…`); wider than the header/footer switcher. */
export const MARKETING_LOCALE_CODES = MARKETING_LANGUAGES.map((l) => l.code) as readonly string[];

export type MarketingLocaleCode = (typeof MARKETING_LOCALE_CODES)[number];

export function isMarketingLocaleCode(segment: string): segment is MarketingLocaleCode {
  return (MARKETING_LOCALE_CODES as readonly string[]).includes(segment);
}

/**
 * Locales Core serves under `/{code}/…` with lazy-loaded overlay JSON (may be `{}` → English copy).
 * English uses `(default)` routes without a prefix.
 */
export const CORE_HOSTED_MARKETING_LOCALES = MARKETING_LOCALE_CODES.filter(
  (c) => c !== DEFAULT_MARKETING_LOCALE,
) as readonly string[];

export function isCoreHostedNonDefaultLocale(locale: string): boolean {
  return locale !== DEFAULT_MARKETING_LOCALE && isMarketingLocaleCode(locale);
}

/** Primary subtags that use right-to-left text direction in the marketing / learner shell. */
const RTL_PRIMARY_LOCALES = new Set(["ar", "fa", "ur", "he"]);

export function localePrimarySubtag(locale: string): string {
  return locale.split(/[-_]/)[0]?.trim().toLowerCase() || "en";
}

export function isRtlMarketingLocale(locale: string): boolean {
  return RTL_PRIMARY_LOCALES.has(localePrimarySubtag(locale));
}
