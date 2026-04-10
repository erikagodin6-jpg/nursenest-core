import type { CountrySlug } from "@/lib/exam-pathways/types";
import { DEFAULT_MARKETING_LOCALE, isMarketingLocaleCode } from "@/lib/i18n/marketing-locale-policy";

/** First URL segment for marketing exam pathway hubs (`/{country}/{role}/{exam}/…`). */
export function isExamPathwayCountrySlug(segment: string): segment is CountrySlug {
  return segment === "us" || segment === "canada";
}

/**
 * True when the pathname is an exam hub path (country slug first), not a BCP marketing locale prefix.
 * Uses the raw pathname (e.g. from `usePathname()`). If the URL is `/{lang}/us/…` or `/{lang}/canada/…`
 * (non-English UI locale prefix), the country segment is detected after stripping that prefix.
 */
export function isExamHubMarketingPath(pathname: string): boolean {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const parts = p.split("/").filter(Boolean);
  if (parts.length === 0) return false;
  let idx = 0;
  const maybeLocale = parts[0]!;
  if (isMarketingLocaleCode(maybeLocale) && maybeLocale !== DEFAULT_MARKETING_LOCALE) {
    idx = 1;
  }
  const country = parts[idx];
  return country ? isExamPathwayCountrySlug(country) : false;
}

export function canonicalExamHubPathFromPossiblyLocalizedPath(
  pathname: string,
): { locale: string; canonicalPath: string } | null {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const parts = p.split("/").filter(Boolean);
  if (parts.length < 2) return null;

  const maybeLocale = parts[0]!;
  if (!isMarketingLocaleCode(maybeLocale) || maybeLocale === DEFAULT_MARKETING_LOCALE) {
    return null;
  }

  const country = parts[1];
  if (!country || !isExamPathwayCountrySlug(country)) {
    return null;
  }

  return {
    locale: maybeLocale,
    canonicalPath: `/${parts.slice(1).join("/")}`,
  };
}
