import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import type { CountryCode } from "@/lib/marketing/countries/types";

/**
 * Maps the legacy US/CA marketing region cookie to a coarse marketing country.
 * When the cookie is absent, callers should fall back to Canada-first defaults.
 */
export function marketingCountryFromOptionalRegionCookie(region: MarketingRegionToggle | undefined): CountryCode {
  if (region === "CA") return "canada";
  if (region === "US") return "us";
  return "canada";
}
