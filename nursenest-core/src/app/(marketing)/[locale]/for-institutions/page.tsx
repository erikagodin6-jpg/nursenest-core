import type { Metadata } from "next";
import { MarketingForInstitutionsPage } from "@/components/marketing/marketing-for-institutions-page";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = await loadMarketingMessages(locale);
  return {
    title: m["pages.forInstitutions.title"],
    description: m["pages.forInstitutions.description"],
    alternates: { canonical: `/${locale}/for-institutions` },
  };
}

export default async function LocalizedForInstitutionsPage({ params }: Props) {
  const { locale } = await params;
  return <MarketingForInstitutionsPage locale={locale} />;
}
