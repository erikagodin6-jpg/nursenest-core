import { Suspense } from "react";
import { cookies } from "next/headers";
import { PricingPageClient } from "@/components/marketing/pricing-page-client";
import { PricingPageErrorBoundary } from "@/components/marketing/pricing-page-error-boundary";
import { PricingPageSkeleton } from "@/components/skeletons/hub-page-skeleton";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { resolveMarketingCopy } from "@/lib/marketing-i18n-core";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { GLOBAL_REGION_COOKIE } from "@/lib/region/global-region-cookie";
import {
  collectAuthoritativeCheckoutGlobalRegionSlugs,
  GLOBAL_CHECKOUT_REGION_CONTEXT_COOKIE,
} from "@/lib/region/checkout-global-region-context";
import {
  buildPricingOptionsPayload,
  getCachedPricingOptionsPayload,
} from "@/lib/pricing/pricing-options-cached-payload";

async function loadPricingOptionsForMarketingPage() {
  try {
    return await getCachedPricingOptionsPayload();
  } catch {
    return buildPricingOptionsPayload();
  }
}

export async function MarketingPricingPage({ locale }: { locale: string }) {
  const jar = await cookies();
  const serverCheckoutRegionSlugs = collectAuthoritativeCheckoutGlobalRegionSlugs({
    globalRegionCookieRaw: jar.get(GLOBAL_REGION_COOKIE)?.value,
    checkoutRegionContextCookieRaw: jar.get(GLOBAL_CHECKOUT_REGION_CONTEXT_COOKIE)?.value,
  });
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const heading = resolveMarketingCopy(m, "pages.pricing.conversion.h1", en, "Plans by exam pathway");
  const intro = resolveMarketingCopy(
    m,
    "pages.pricing.conversion.trustLine",
    en,
    "Prices in CAD or USD for your selected region. No surprise charges at checkout.",
  );
  const heroSub = resolveMarketingCopy(
    m,
    "pages.pricing.conversion.lead",
    en,
    "Choose your exam track, country, and billing term. Totals are shown before you pay; longer terms usually lower your effective monthly cost.",
  );
  const initialPricingOptions = await loadPricingOptionsForMarketingPage();
  return (
    <PricingPageErrorBoundary>
      {/**
       * `PricingPageClient` uses `useSearchParams()` (checkout cancel query, post-login checkout intent).
       * Next.js requires a Suspense boundary so the route can stream without CSR bailout / subtree errors
       * that previously surfaced as “pricing never loads” under the pricing error boundary.
       */}
      <Suspense fallback={<PricingPageSkeleton />}>
        <PricingPageClient
          heading={heading}
          intro={intro}
          heroSub={heroSub}
          serverCheckoutRegionSlugs={serverCheckoutRegionSlugs}
          initialPricingOptions={initialPricingOptions}
        />
      </Suspense>
    </PricingPageErrorBoundary>
  );
}
