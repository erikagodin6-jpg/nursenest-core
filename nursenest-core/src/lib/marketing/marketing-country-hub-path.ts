import { DEFAULT_MARKETING_LOCALE, isMarketingLocaleCode } from "@/lib/i18n/marketing-locale-policy";

/**
 * Top-level marketing country hubs that are not US/Canada exam pathway prefixes
 * (those are already exempt from locale-prefixing via {@link isExamHubMarketingPath}).
 */
export function isMarketingCountryEntryPath(pathname: string): boolean {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const parts = p.split("/").filter(Boolean);
  let i = 0;
  const maybeLocale = parts[0];
  if (maybeLocale && isMarketingLocaleCode(maybeLocale) && maybeLocale !== DEFAULT_MARKETING_LOCALE) {
    i = 1;
  }
  const seg = parts[i];
  return seg === "philippines" || seg === "middle-east";
}
