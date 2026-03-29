import type { Metadata } from "next";
import { MarketingPricingPage } from "@/components/marketing/marketing-pricing-page";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const m = await loadMarketingMessages(locale);
  return {
    title: m["pages.pricing.title"],
    description: m["pages.pricing.description"],
    alternates: { canonical: `/${locale}/pricing` },
  };
}

export default async function LocalizedPricingPage({ params }: Props) {
  const { locale } = await params;
  return <MarketingPricingPage locale={locale} />;
}
