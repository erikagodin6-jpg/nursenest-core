import { PricingPageClient } from "@/components/marketing/pricing-page-client";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

export async function MarketingPricingPage({ locale }: { locale: string }) {
  const m = await loadMarketingMessages(locale);
  return <PricingPageClient heading={m["pages.pricing.h1"]} intro={m["pages.pricing.intro"]} />;
}
