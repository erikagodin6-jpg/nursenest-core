import type { Metadata } from "next";
import type { CountryCode } from "@/lib/marketing/countries/types";
import { getCountryHomepageContent } from "@/lib/marketing/countries/registry";
import { marketingAlternatesEnglishOnly } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

function hubPathForCountry(country: CountryCode): string {
  return `/${country}`;
}

export function generateMarketingCountryHubMetadata(country: CountryCode): Promise<Metadata> {
  const path = hubPathForCountry(country);
  const content = getCountryHomepageContent(country);
  const title = `${content.headline} | NurseNest`;
  const description = content.subheadline;

  return safeGenerateMetadata(
    async () => {
      const { canonical } = marketingAlternatesEnglishOnly(path);
      return {
        title,
        description,
        robots: { index: true, follow: true },
        alternates: { canonical },
        openGraph: { title, description, url: canonical, type: "website" },
      };
    },
    { pathname: path, locale: "en", routeGroup: "marketing.country_hub" },
  );
}
