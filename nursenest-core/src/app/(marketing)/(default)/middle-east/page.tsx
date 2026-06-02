import { CountryMarketingHome } from "@/components/marketing/country-marketing-home";
import { getCountryHomepageContent } from "@/lib/marketing/countries/registry";
import { generateMarketingCountryHubMetadata } from "@/lib/marketing/marketing-country-hub-metadata";

export const revalidate = 86400;

export function generateMetadata() {
  return generateMarketingCountryHubMetadata("middle-east");
}

export default function MiddleEastMarketingHubPage() {
  return <CountryMarketingHome country="middle-east" content={getCountryHomepageContent("middle-east")} />;
}
