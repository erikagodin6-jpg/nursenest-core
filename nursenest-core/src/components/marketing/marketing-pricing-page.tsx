import { PricingPageClient } from "@/components/marketing/pricing-page-client";
import { PricingPageErrorBoundary } from "@/components/marketing/pricing-page-error-boundary";
import { resolveMarketingCopy } from "@/lib/marketing-i18n-core";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";

export async function MarketingPricingPage({ locale }: { locale: string }) {
  const m = await loadMarketingMessages(locale);
  const heading = resolveMarketingCopy(m, "pages.pricing.h1", undefined, `[missing:pages.pricing.h1]`);
  const intro = resolveMarketingCopy(m, "pages.pricing.intro", undefined, `[missing:pages.pricing.intro]`);
  const heroSub = resolveMarketingCopy(
    m,
    "pages.pricing.hero.subheadMain",
    undefined,
    `[missing:pages.pricing.hero.subheadMain]`,
  );
  return (
    <PricingPageErrorBoundary>
      <PricingPageClient heading={heading} intro={intro} heroSub={heroSub} />
    </PricingPageErrorBoundary>
  );
}
