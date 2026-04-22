import type { TierCode } from "@prisma/client";
import { cookies } from "next/headers";
import { PricingPageClient } from "@/components/marketing/pricing-page-client";
import { PricingPageErrorBoundary } from "@/components/marketing/pricing-page-error-boundary";
import { pricingTierToNarrativeSlug } from "@/lib/conversion/pricing-catalog";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getOptionalPublicMessage } from "@/lib/marketing-i18n-core";
import { getRequiredPublicMetadataLine } from "@/lib/marketing-i18n/marketing-metadata-strict";
import {
  MARKETING_PRICING_CONVERSION_H1_FALLBACK,
  MARKETING_PRICING_CONVERSION_LEAD_FALLBACK,
  MARKETING_PRICING_CONVERSION_TRUST_LINE_FALLBACK,
  MARKETING_PRICING_TIER_SUBHEAD_FALLBACK,
} from "@/lib/marketing-i18n/marketing-safe-fallbacks";
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
import type { PricingOptionsPayload } from "@/lib/pricing/pricing-options-payload-types";
import { validatePricingOptionsPayload } from "@/lib/pricing/pricing-options-payload-validate";
import { STRIPE_BILLED_NURSING_TIERS } from "@/lib/pricing/display-catalog";

function pricingPayloadHasRenderablePlans(p: PricingOptionsPayload): boolean {
  const plans = p.plans;
  const allied = p.alliedPlans;
  return (
    (Array.isArray(plans) && plans.length > 0) || (Array.isArray(allied) && allied.length > 0)
  );
}

async function loadPricingOptionsForMarketingPage(): Promise<PricingOptionsPayload> {
  let payload: PricingOptionsPayload;
  try {
    payload = await getCachedPricingOptionsPayload();
  } catch {
    payload = buildPricingOptionsPayload();
  }
  const fallback = buildPricingOptionsPayload();
  const check = validatePricingOptionsPayload(payload);
  if (!check.ok) {
    safeServerLog("billing", "marketing_pricing_page_payload_invalid_using_fallback", {
      errors: check.errors.join("|").slice(0, 900),
      warnings: check.warnings.join("|").slice(0, 400),
    });
    return pricingPayloadHasRenderablePlans(fallback) ? fallback : payload;
  }
  if (!pricingPayloadHasRenderablePlans(payload)) {
    safeServerLog("billing", "marketing_pricing_page_payload_empty_using_fallback", {});
    return pricingPayloadHasRenderablePlans(fallback) ? fallback : payload;
  }
  return payload;
}

export async function MarketingPricingPage({
  locale,
  initialSearchParamsString = "",
}: {
  locale: string;
  /** Serialized query string from the page RSC (`searchParams`) so the client tree avoids `useSearchParams()`. */
  initialSearchParamsString?: string;
}) {
  const jar = await cookies();
  const serverCheckoutRegionSlugs = collectAuthoritativeCheckoutGlobalRegionSlugs({
    globalRegionCookieRaw: jar.get(GLOBAL_REGION_COOKIE)?.value,
    checkoutRegionContextCookieRaw: jar.get(GLOBAL_CHECKOUT_REGION_CONTEXT_COOKIE)?.value,
  });
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const heading = getRequiredPublicMetadataLine(
    m,
    "pages.pricing.conversion.h1",
    en,
    MARKETING_PRICING_CONVERSION_H1_FALLBACK,
  );
  const intro =
    getOptionalPublicMessage(m, "pages.pricing.conversion.trustLine", { fallbackMessages: en }).trim() ||
    MARKETING_PRICING_CONVERSION_TRUST_LINE_FALLBACK;
  const heroSub =
    getOptionalPublicMessage(m, "pages.pricing.conversion.lead", { fallbackMessages: en }).trim() ||
    MARKETING_PRICING_CONVERSION_LEAD_FALLBACK;
  const initialPricingOptions = await loadPricingOptionsForMarketingPage();
  const payloadCheck = validatePricingOptionsPayload(initialPricingOptions);
  if (!payloadCheck.ok) {
    safeServerLog("billing", "marketing_pricing_page_payload_invalid_after_fallback", {
      errors: payloadCheck.errors.join("|").slice(0, 900),
      warnings: payloadCheck.warnings.join("|").slice(0, 400),
    });
  }

  /** RSC-resolved tier subheads so “Choose your plan” never depends on a fragile client `t()` alone. */
  const subheadTiers: TierCode[] = [...STRIPE_BILLED_NURSING_TIERS, "ALLIED"];
  const serverTierSubheads: Partial<Record<TierCode, string>> = {};
  for (const tier of subheadTiers) {
    const slug = pricingTierToNarrativeSlug(tier);
    serverTierSubheads[tier] = getRequiredPublicMetadataLine(
      m,
      `pages.pricing.narrative.${slug}.subhead`,
      en,
      MARKETING_PRICING_TIER_SUBHEAD_FALLBACK,
    );
  }

  return (
    <PricingPageErrorBoundary>
      <PricingPageClient
        heading={heading}
        intro={intro}
        heroSub={heroSub}
        serverCheckoutRegionSlugs={serverCheckoutRegionSlugs}
        serverTierSubheads={serverTierSubheads}
        initialPricingOptions={initialPricingOptions}
        initialSearchParamsString={initialSearchParamsString}
      />
    </PricingPageErrorBoundary>
  );
}
