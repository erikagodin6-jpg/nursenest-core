import { isExamHubMarketingPath } from "@/lib/i18n/exam-hub-path";
import { getHreflangEligibleLocales } from "@/lib/i18n/language-readiness";
import { stripMarketingLocalePrefix } from "@/lib/i18n/marketing-path";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { filterPublicHreflangRecord, isValidPublicUrl } from "@/lib/seo/public-url-validator";
import { safeServerLog } from "@/lib/observability/safe-server-log";
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
 * English-default shell path: strips a leading `/{locale}` when callers accidentally pass a localized
 * path, so exam hubs (`/us/…`) are recognized even if the input was `/fr/us/…`.
 */
function defaultShellMarketingPath(enPath: string): string {
  const n = normalizeEnMarketingPath(enPath);
  const { pathname } = stripMarketingLocalePrefix(n);
  return pathname;
}

/** URL path for a marketing locale, given the English-default path. */
export function marketingCanonicalPathForLocale(locale: string, enPath: string): string {
  const path = defaultShellMarketingPath(enPath);
  if (isExamHubMarketingPath(path)) {
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
  const path = defaultShellMarketingPath(enPath);
  const enUrl = absoluteUrl(path === "/" ? "/" : path);
  /** US/CA exam product URLs: only one indexable URL shape; regional hreflang is handled per-page (en-US/en-CA). */
  if (isExamHubMarketingPath(path)) {
    return filterPublicHreflangRecord({ "x-default": enUrl, en: enUrl }, "seo", "marketing_hreflang_rejected");
  }
  const out: Record<string, string> = {
    "x-default": enUrl,
    en: enUrl,
  };
  for (const code of getHreflangEligibleLocales()) {
    const localized = path === "/" ? `/${code}` : `/${code}${path}`;
    out[code] = absoluteUrl(localized);
  }
  return filterPublicHreflangRecord(out, "seo", "marketing_hreflang_rejected");
}

/** `alternates` for shared localized marketing routes (canonical + hreflang). */
export function marketingAlternatesSharedPage(
  locale: string,
  enPath: string,
): { canonical: string; languages: Record<string, string> } {
  const canonical = absoluteMarketingCanonical(locale, enPath);
  const c = isValidPublicUrl(canonical);
  if (!c.ok) {
    safeServerLog("seo", "marketing_canonical_rejected", {
      code: c.code,
      url: canonical.slice(0, 400),
      detail: (c.detail ?? "").slice(0, 200),
    });
  }
  return {
    canonical,
    languages: marketingHreflangLanguagesForEnPath(enPath),
  };
}

/**
 * English-only or non-localized marketing URLs: self canonical only (no `languages` — avoids broken cross-locale links).
 */
export function marketingAlternatesEnglishOnly(enPath: string): { canonical: string } {
  const canonical = absoluteUrl(normalizeEnMarketingPath(enPath));
  const c = isValidPublicUrl(canonical);
  if (!c.ok) {
    safeServerLog("seo", "marketing_canonical_rejected", {
      code: c.code,
      url: canonical.slice(0, 400),
      detail: (c.detail ?? "").slice(0, 200),
    });
  }
  return { canonical };
}
