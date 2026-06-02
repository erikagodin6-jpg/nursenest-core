import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

/** Relative href to the live marketing page for a locale + canonical route from the slot registry. */
export function buildMarketingPublicLivePageHref(locale: string, route: string): string {
  const loc = (locale.trim().toLowerCase() || "en").slice(0, 32);
  const r = route.startsWith("/") ? route : `/${route}`;
  if (loc === DEFAULT_MARKETING_LOCALE) {
    return r.length > 0 ? r : "/";
  }
  if (r === "/") return `/${loc}`;
  return `/${loc}${r}`;
}
