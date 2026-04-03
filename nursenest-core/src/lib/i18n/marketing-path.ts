import { isExamHubMarketingPath } from "@/lib/i18n/exam-hub-path";
import { DEFAULT_MARKETING_LOCALE, isMarketingLocaleCode } from "@/lib/i18n/marketing-locale-policy";

/**
 * Prefix a same-origin marketing path with `/[lang]` when UI language is not English and the target
 * has a localized route under `(marketing)/[locale]/…`.
 *
 * Exam pathway URLs (`/us/…`, `/canada/…`) are never prefixed — those routes do not exist under
 * `/{lang}/us/…`; UI language there comes from `nn_marketing_locale` (`MARKETING_LOCALE_COOKIE`) + nested layout.
 */
export function withMarketingLocale(locale: string, href: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (locale === DEFAULT_MARKETING_LOCALE) return href.startsWith("/") ? href : `/${href}`;
  const path = href.startsWith("/") ? href : `/${href}`;
  if (isExamHubMarketingPath(path)) return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

/** Alias for readability where “locale” is not in scope. */
export function internalMarketingHref(href: string): string {
  return withMarketingLocale(DEFAULT_MARKETING_LOCALE, href);
}

export function stripMarketingLocalePrefix(pathname: string): { locale: string; pathname: string } {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const parts = p.split("/").filter(Boolean);
  const first = parts[0];
  if (first && isMarketingLocaleCode(first) && first !== DEFAULT_MARKETING_LOCALE) {
    const rest = parts.length > 1 ? `/${parts.slice(1).join("/")}` : "/";
    return { locale: first, pathname: rest };
  }
  return { locale: DEFAULT_MARKETING_LOCALE, pathname: p === "" ? "/" : p };
}
