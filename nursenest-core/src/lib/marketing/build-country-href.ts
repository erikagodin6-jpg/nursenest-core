import type { CountryCode } from "@/lib/marketing/countries/types";

export function buildCountryHubHref(country: CountryCode): string {
  return `/${country}`;
}
