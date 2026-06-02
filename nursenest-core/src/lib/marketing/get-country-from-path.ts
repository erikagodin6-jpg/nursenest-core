import { stripMarketingLocalePrefix } from "@/lib/i18n/marketing-path";
import { isMarketingCountryHubSegment } from "@/lib/marketing/countries/registry";
import type { CountryCode } from "@/lib/marketing/countries/types";

/**
 * Returns a marketing country code only when the pathname is a dedicated country hub
 * (`/canada`, `/us`, `/philippines`, `/middle-east`, with optional leading `/{lang}/`).
 */
export function getExplicitMarketingCountryFromPathname(pathname: string): CountryCode | null {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const { pathname: stripped } = stripMarketingLocalePrefix(normalized);
  const parts = stripped.split("/").filter(Boolean);
  const first = parts[0];
  if (first && isMarketingCountryHubSegment(first)) return first;
  return null;
}
