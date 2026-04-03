import { DEFAULT_MARKETING_LOCALE, isMarketingLocaleCode } from "@/lib/i18n/marketing-locale-policy";

/** Persisted UI language for `(default)` marketing routes (exam hubs use country as first segment, not this). */
export const MARKETING_LOCALE_COOKIE = "nn_marketing_locale";

export const MARKETING_LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 400;

/** Normalize cookie/header value to a supported marketing locale, else English. */
export function normalizePreferredMarketingLocale(raw: string | undefined): string {
  if (!raw || typeof raw !== "string") return DEFAULT_MARKETING_LOCALE;
  const v = raw.trim();
  if (!v) return DEFAULT_MARKETING_LOCALE;
  return isMarketingLocaleCode(v) ? v : DEFAULT_MARKETING_LOCALE;
}
