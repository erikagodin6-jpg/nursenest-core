import { DEFAULT_MARKETING_LOCALE, isMarketingLocaleCode } from "@/lib/i18n/marketing-locale-policy";
import { MARKETING_LANGUAGES } from "@/lib/i18n/marketing-languages";

/**
 * Product-facing localization depth for marketing UI (not the same as switcher tiers).
 *
 * - **full** — Broad overlay coverage; primary locales.
 * - **reviewed-partial** — Meaningful coverage with known gaps (e.g. French).
 * - **shell-placeholder** — High-frequency shell only (nav, auth CTAs); long-form may remain English until reviewed.
 */
export type MarketingLocaleLocalizationCoverage = "full" | "reviewed-partial" | "shell-placeholder";

const byCode = new Map(MARKETING_LANGUAGES.map((l) => [l.code, l]));

/**
 * Returns localization coverage for a marketing locale code.
 * Incomplete switcher tiers map to **shell-placeholder** (safe UI shell strings; not full product localization).
 */
export function marketingLocaleLocalizationCoverage(locale: string): MarketingLocaleLocalizationCoverage {
  if (!locale || locale === DEFAULT_MARKETING_LOCALE) return "full";
  const row = byCode.get(locale);
  if (!row) return "shell-placeholder";
  if (row.tier === "full") return "full";
  if (row.tier === "partial") return "reviewed-partial";
  return "shell-placeholder";
}

export function isShellPlaceholderMarketingLocale(locale: string): boolean {
  return isMarketingLocaleCode(locale) && marketingLocaleLocalizationCoverage(locale) === "shell-placeholder";
}

/** True for any locale that is not **full** (includes reviewed-partial French and shell-placeholder low-coverage locales). */
export function marketingLocaleIsPartialCoverage(locale: string): boolean {
  return marketingLocaleLocalizationCoverage(locale) !== "full";
}
