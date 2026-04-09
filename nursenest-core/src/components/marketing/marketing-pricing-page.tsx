import { PricingPageClient } from "@/components/marketing/pricing-page-client";
import { PricingPageErrorBoundary } from "@/components/marketing/pricing-page-error-boundary";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { resolveMarketingCopy } from "@/lib/marketing-i18n-core";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

export async function MarketingPricingPage({ locale }: { locale: string }) {
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const heading = resolveMarketingCopy(m, "pages.pricing.conversion.h1", en, "Choose your study plan");
  const intro = resolveMarketingCopy(
    m,
    "pages.pricing.conversion.trustLine",
    en,
    "Secure checkout with Stripe. Prices are shown in your currency before you pay.",
  );
  const heroSub = resolveMarketingCopy(
    m,
    "pages.pricing.conversion.lead",
    en,
    "Select your exam track and billing term. Longer terms reduce your effective monthly cost.",
  );
  return (
    <PricingPageErrorBoundary>
      <PricingPageClient heading={heading} intro={intro} heroSub={heroSub} />
    </PricingPageErrorBoundary>
  );
}
