import { CountryMarketingHome } from "@/components/marketing/country-marketing-home";
import { getCountryHomepageContent } from "@/lib/marketing/countries/registry";
import { generateMarketingCountryHubMetadata } from "@/lib/marketing/marketing-country-hub-metadata";

export const revalidate = 86400;

export function generateMetadata() {
  return generateMarketingCountryHubMetadata("philippines");
}

export default function PhilippinesMarketingHubPage() {
  return <CountryMarketingHome country="philippines" content={getCountryHomepageContent("philippines")} />;
}
