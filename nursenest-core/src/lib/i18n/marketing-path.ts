import { isExamHubMarketingPath, isExpansionExamMarketingPath } from "@/lib/i18n/exam-hub-path";
import { DEFAULT_MARKETING_LOCALE, isMarketingLocaleCode } from "@/lib/i18n/marketing-locale-policy";
import { stripMarketingLocalePrefix } from "@/lib/i18n/marketing-locale-prefix";
import { isMarketingCountryEntryPath } from "@/lib/marketing/marketing-country-hub-path";

export { stripMarketingLocalePrefix } from "@/lib/i18n/marketing-locale-prefix";

/**
 * Prefix a same-origin marketing path with `/[lang]` when UI language is not English and the target
 * has a localized route under `(marketing)/[locale]/…`.
 *
 * Exam pathway URLs (`/us/…`, `/canada/…`) are never prefixed — those routes do not exist under
 * `/{lang}/us/…`; UI language there comes from `nn_marketing_locale` (`MARKETING_LOCALE_COOKIE`) + nested layout.
 *
 * Expansion hubs (`/exams/…`) follow the same rule: many only exist under `(default)`, not `/{lang}/exams/…`.
 */
export function withMarketingLocale(locale: string, href: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (locale === DEFAULT_MARKETING_LOCALE) return href.startsWith("/") ? href : `/${href}`;
  const path = href.startsWith("/") ? href : `/${href}`;
  /**
   * Subscriber app + staff admin live outside `(marketing)/[locale]…`. Prefixing breaks routes:
   * `/app/lessons` → `/fr/app/lessons` matches marketing `[locale]/[slug]/…` (wrong layout / 404), not `(student)/app/(learner)`.
   */
  if (path.startsWith("/app") || path.startsWith("/admin")) return path;
  if (isExamHubMarketingPath(path) || isExpansionExamMarketingPath(path)) return path;
  if (isMarketingCountryEntryPath(path)) return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

/** Alias for readability where “locale” is not in scope. */
export function internalMarketingHref(href: string): string {
  return withMarketingLocale(DEFAULT_MARKETING_LOCALE, href);
}
