import type { Metadata } from "next";
import { MarketingForInstitutionsPage } from "@/components/marketing/marketing-for-institutions-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";

export async function generateMetadata(): Promise<Metadata> {
  const m = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/for-institutions");
  return {
    title: m["pages.forInstitutions.title"],
    description: m["pages.forInstitutions.description"],
    alternates: { canonical: alt.canonical, languages: alt.languages },
    openGraph: {
      title: m["pages.forInstitutions.title"],
      description: m["pages.forInstitutions.description"],
      url: alt.canonical,
      type: "website",
    },
  };
}

export default async function ForInstitutionsPage() {
  const locale = await getMarketingLocaleForDefaultRoute();
  return <MarketingForInstitutionsPage locale={locale} />;
}
