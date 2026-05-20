import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import type { CountryCode } from "@/lib/marketing/countries/types";
import { getExplicitMarketingCountryFromPathname } from "@/lib/marketing/get-country-from-path";
import { marketingCountryFromOptionalRegionCookie } from "@/lib/marketing/marketing-country-region-map";

/**
 * Explicit URL segment wins. Otherwise map the optional US/CA marketing cookie; when absent, Canada-first.
 * Locale prefixes are ignored for detection (country stays separate from UI language).
 */
export function getEffectiveMarketingCountry(
  pathname: string,
  regionCookie: MarketingRegionToggle | undefined,
): CountryCode {
  const explicit = getExplicitMarketingCountryFromPathname(pathname);
  if (explicit) return explicit;
  return marketingCountryFromOptionalRegionCookie(regionCookie);
}
