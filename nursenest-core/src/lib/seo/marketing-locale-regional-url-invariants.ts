import { isExamPathwayCountrySlug, isLocalePrefixedDefaultOnlyExpansionExamPath } from "@/lib/i18n/exam-hub-path";
import { DEFAULT_MARKETING_LOCALE, isCoreHostedNonDefaultLocale, isMarketingLocaleCode } from "@/lib/i18n/marketing-locale-policy";

/** Path segments after splitting on `/` (no empty strings). */
export function pathnameSegmentCount(pathname: string): number {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return p.split("/").filter(Boolean).length;
}

/**
 * Invalid SEO pattern: marketing locale (`/fr`, …) immediately followed by exam country (`us`, `canada`).
 * Real routes are `/{us|canada}/{role}/{exam}/…` with **no** `/{lang}` prefix (UI locale is cookie-driven).
 */
export function pathnameHasLocalePrefixBeforeExamCountry(pathname: string): boolean {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const parts = p.split("/").filter(Boolean);
  if (parts.length < 2) return false;
  const first = parts[0]!;
  if (!isCoreHostedNonDefaultLocale(first)) return false;
  return isExamPathwayCountrySlug(parts[1]!);
}

/**
 * Deep locale-first paths are not part of the current marketing route set (max observed depth is 4, e.g.
 * `/{locale}/pre-nursing/lessons/{slug}`). Five or more segments after a non-default locale is almost
 * always a generation bug (e.g. `/{locale}/us/np/fnp/topic`).
 */
export function localeFirstPathExceedsSegmentBudget(pathname: string, maxSegments = 4): boolean {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const parts = p.split("/").filter(Boolean);
  if (parts.length === 0 || parts.length <= maxSegments) return false;
  const first = parts[0]!;
  if (first === DEFAULT_MARKETING_LOCALE) return false;
  if (!isMarketingLocaleCode(first)) return false;
  return true;
}

/** Sitemap + metadata guard: drop paths that cannot correspond to a real marketing route. */
export function isDisallowedMarketingSeoPathname(pathname: string): boolean {
  if (pathnameHasLocalePrefixBeforeExamCountry(pathname)) return true;
  if (isLocalePrefixedDefaultOnlyExpansionExamPath(pathname)) return true;
  if (localeFirstPathExceedsSegmentBudget(pathname)) return true;
  return false;
}

export function assertMarketingPathnamePassesSeoLocaleRegionalPolicy(pathname: string): void {
  if (isDisallowedMarketingSeoPathname(pathname)) {
    throw new Error(
      `Invalid marketing pathname (locale+region or locale-first segment budget): ${pathname}`,
    );
  }
}
