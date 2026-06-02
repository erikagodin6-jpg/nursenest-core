import { DEFAULT_MARKETING_LOCALE, MARKETING_LOCALE_CODES, isMarketingLocaleCode } from "@/lib/i18n/marketing-locale-policy";

/**
 * Login under `/{locale}/…` only — validates the URL segment; never trusts browser or cookies here.
 * Invalid or empty segments fall back to English.
 */
export function resolveLoginMarketingLocaleFromUrlSegment(segment: string | undefined | null): string {
  const raw = typeof segment === "string" ? segment.trim() : "";
  if (!raw) return DEFAULT_MARKETING_LOCALE;
  if (isMarketingLocaleCode(raw)) return raw;
  // When `MarketingLocaleCode` widens to `string`, TS can narrow `raw` to `never` here; keep runtime string.
  const lower = (raw as string).toLowerCase();
  const match = (MARKETING_LOCALE_CODES as readonly string[]).find((c) => c.toLowerCase() === lower);
  return match ?? DEFAULT_MARKETING_LOCALE;
}
