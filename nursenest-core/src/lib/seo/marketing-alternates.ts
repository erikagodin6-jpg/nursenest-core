import { isExamHubMarketingPath } from "@/lib/i18n/exam-hub-path";
import { getHreflangEligibleLocales } from "@/lib/i18n/language-readiness";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { absoluteUrl } from "@/lib/seo/site-origin";

/**
 * Normalizes the English-default marketing path (no `/[locale]` prefix).
 * Home is `/`; other routes use a leading slash (e.g. `/pricing`, `/login`).
 */
export function normalizeEnMarketingPath(enPath: string): string {
  const t = enPath.trim();
  if (t === "" || t === "/") return "/";
  return t.startsWith("/") ? t : `/${t}`;
}

/**
 * Exam hubs (`/us/…`, `/canada/…`) and expansion pages (`/exams/…`) do not use `/{locale}` as a **path**
 * prefix for the US/CA product tree; prefixing would yield non-routes like `/fr/us/np/…`.
 * Expansion hubs may still have localized routes (`/fr/exams/india`) — those use the normal prefix rule.
 */
function shouldOmitMarketingLocalePathPrefix(enPath: string): boolean {
  const path = normalizeEnMarketingPath(enPath);
  if (isExamHubMarketingPath(path)) return true;
  return false;
}

/** URL path for a marketing locale, given the English-default path. */
export function marketingCanonicalPathForLocale(locale: string, enPath: string): string {
  const path = normalizeEnMarketingPath(enPath);
  if (shouldOmitMarketingLocalePathPrefix(enPath)) {
    return path;
  }
  if (locale === DEFAULT_MARKETING_LOCALE) {
    return path;
  }
  if (path === "/") {
    return `/${locale}`;
  }
  return `/${locale}${path}`;
}

/** Absolute canonical URL for the active marketing locale. */
export function absoluteMarketingCanonical(locale: string, enPath: string): string {
  return absoluteUrl(marketingCanonicalPathForLocale(locale, enPath));
}

/**
 * Full hreflang cluster for pages that exist at the same English path across all
 * hreflang-eligible locales (`/` + `/{code}/…`).
 *
 * Only includes locales with tier=full or tier=partial — incomplete locales are
 * excluded to prevent diluting hreflang signal and avoid recommending mostly-English
 * pages to search engines.
 *
 * `x-default` points at the English-default URL.
 */
export function marketingHreflangLanguagesForEnPath(enPath: string): Record<string, string> {
  const path = normalizeEnMarketingPath(enPath);
  const enUrl = absoluteUrl(path === "/" ? "/" : path);
  /** US/CA exam product URLs: only one indexable URL shape; regional hreflang is handled per-page (en-US/en-CA). */
  if (isExamHubMarketingPath(path)) {
    return { "x-default": enUrl, en: enUrl };
  }
  const out: Record<string, string> = {
    "x-default": enUrl,
    en: enUrl,
  };
  for (const code of getHreflangEligibleLocales()) {
    const localized = path === "/" ? `/${code}` : `/${code}${path}`;
    out[code] = absoluteUrl(localized);
  }
  return out;
}

/** `alternates` for shared localized marketing routes (canonical + hreflang). */
export function marketingAlternatesSharedPage(
  locale: string,
  enPath: string,
): { canonical: string; languages: Record<string, string> } {
  return {
    canonical: absoluteMarketingCanonical(locale, enPath),
    languages: marketingHreflangLanguagesForEnPath(enPath),
  };
}

/**
 * English-only or non-localized marketing URLs: self canonical only (no `languages` — avoids broken cross-locale links).
 */
export function marketingAlternatesEnglishOnly(enPath: string): { canonical: string } {
  return { canonical: absoluteUrl(normalizeEnMarketingPath(enPath)) };
}
