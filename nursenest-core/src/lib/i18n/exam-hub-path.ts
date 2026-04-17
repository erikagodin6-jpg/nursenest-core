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

/**
 * Global expansion SEO hubs (`/exams/philippines`, `/exams/india`, …) are implemented under
 * `(marketing)/(default)/exams/...` only for several countries — not under `/{lang}/exams/...`.
 * Prefixing these with a marketing locale (e.g. `/tl/exams/philippines`) 404s and looks like a dead click.
 */
export function isExpansionExamMarketingPath(pathname: string): boolean {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return p === "/exams" || p.startsWith("/exams/");
}

/**
 * Country segment under /exams/:country that has a matching localized marketing route under [locale]/exams.
 * Hubs like /exams/philippines, /exams/canada, /exams/uk are default-shell only — prefixing a locale would 404.
 * Keep in sync with src/app/(marketing)/[locale]/exams/... page modules when adding localized shells.
 */
export const EXPANSION_EXAM_COUNTRY_SLUGS_WITH_LOCALIZED_SHELL: ReadonlySet<string> = new Set([
  "australia",
  "china",
  "france",
  "germany",
  "hungary",
  "india",
  "italy",
  "japan",
  "korea",
  "mexico",
  "middle-east",
  "portugal",
]);

/** First path segment after /exams/ (e.g. india for /exams/india), or null when the path is just /exams. */
export function expansionExamCountrySlugFromPath(pathname: string): string | null {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const parts = p.split("/").filter(Boolean);
  if (parts.length < 2 || parts[0] !== "exams") return null;
  return parts[1] ?? null;
}

/** True when /exams/:country exists under both default and locale marketing shells. */
export function expansionExamPathSupportsLocalizedMarketingShell(pathname: string): boolean {
  const slug = expansionExamCountrySlugFromPath(pathname);
  if (!slug) return false;
  return EXPANSION_EXAM_COUNTRY_SLUGS_WITH_LOCALIZED_SHELL.has(slug);
}

/**
 * Invalid SEO URL: locale-prefixed /exams/:country when that country only has the default shell (no localized duplicate).
 * Crawlers follow these hreflang targets to 404.
 */
export function isLocalePrefixedDefaultOnlyExpansionExamPath(pathname: string): boolean {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const parts = p.split("/").filter(Boolean);
  if (parts.length < 3) return false;
  const maybeLocale = parts[0]!;
  if (maybeLocale === DEFAULT_MARKETING_LOCALE || !isMarketingLocaleCode(maybeLocale)) return false;
  if (parts[1] !== "exams") return false;
  const country = parts[2];
  if (!country) return false;
  return !expansionExamPathSupportsLocalizedMarketingShell(`/exams/${country}`);
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
