import type { Metadata } from "next";
import { MarketingForInstitutionsPage } from "@/components/marketing/marketing-for-institutions-page";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = await loadMarketingMessages(locale);
  const alt = marketingAlternatesSharedPage(locale, "/for-institutions");
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

export default async function LocalizedForInstitutionsPage({ params }: Props) {
  const { locale } = await params;
  return <MarketingForInstitutionsPage locale={locale} />;
}
