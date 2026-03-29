import { DEFAULT_MARKETING_LOCALE, isMarketingLocaleCode } from "@/lib/i18n/marketing-locale-policy";

/** Prefix a same-origin marketing path with `/[locale]` when not English. */
export function withMarketingLocale(locale: string, href: string): string {
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (locale === DEFAULT_MARKETING_LOCALE) return href.startsWith("/") ? href : `/${href}`;
  const path = href.startsWith("/") ? href : `/${href}`;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
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
