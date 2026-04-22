import { Suspense } from "react";
import type { TierCode } from "@prisma/client";
import { cookies } from "next/headers";
import { PricingPageClient } from "@/components/marketing/pricing-page-client";
import { PricingPageErrorBoundary } from "@/components/marketing/pricing-page-error-boundary";
import { PricingPageSkeleton } from "@/components/skeletons/hub-page-skeleton";
import { pricingTierToNarrativeSlug } from "@/lib/conversion/pricing-catalog";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { resolveMarketingCopy } from "@/lib/marketing-i18n-core";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { GLOBAL_REGION_COOKIE } from "@/lib/region/global-region-cookie";
import {
  collectAuthoritativeCheckoutGlobalRegionSlugs,
  GLOBAL_CHECKOUT_REGION_CONTEXT_COOKIE,
} from "@/lib/region/checkout-global-region-context";
import {
  buildPricingOptionsPayload,
  getCachedPricingOptionsPayload,
} from "@/lib/pricing/pricing-options-cached-payload";
import { validatePricingOptionsPayload } from "@/lib/pricing/pricing-options-payload-validate";
import { STRIPE_BILLED_NURSING_TIERS } from "@/lib/pricing/display-catalog";

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
  const payloadCheck = validatePricingOptionsPayload(initialPricingOptions);
  if (!payloadCheck.ok) {
    safeServerLog("billing", "marketing_pricing_page_payload_invalid", {
      errors: payloadCheck.errors.join("|").slice(0, 900),
      warnings: payloadCheck.warnings.join("|").slice(0, 400),
    });
  }

  /** RSC-resolved tier subheads so “Choose your plan” never depends on a fragile client `t()` alone. */
  const subheadTiers: TierCode[] = [...STRIPE_BILLED_NURSING_TIERS, "ALLIED"];
  const serverTierSubheads: Partial<Record<TierCode, string>> = {};
  for (const tier of subheadTiers) {
    const slug = pricingTierToNarrativeSlug(tier);
    serverTierSubheads[tier] = resolveMarketingCopy(
      m,
      `pages.pricing.narrative.${slug}.subhead`,
      en,
      "Pick a billing cadence that fits your study plan and exam date.",
    );
  }

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
          serverTierSubheads={serverTierSubheads}
          initialPricingOptions={initialPricingOptions}
        />
      </Suspense>
    </PricingPageErrorBoundary>
  );
}
