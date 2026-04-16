import "server-only";

import { unstable_cache } from "next/cache";
import type { TierCode } from "@prisma/client";
import type { BillingDuration } from "@/lib/pricing/billing-types";
import {
  BILLING_DURATION_ORDER,
  NURSING_TIERS,
  ALLIED_CAREER_KEYS,
  ALLIED_CAREER_DISPLAY_NAMES,
  eachNursingPricedCombination,
  eachAlliedPricedCombination,
  durationMonths,
  formatCurrencyLabel,
  formatPerMonthLabel,
  getDisplayTotalMajorUnits,
  getAlliedDisplayPrice,
  getAnchorPriceMajorUnits,
  STRIPE_TRIAL_DAYS,
  type AlliedCareerKey,
} from "@/lib/pricing/display-catalog";
import { findPriceEntry, findAlliedPriceEntry } from "@/lib/stripe/pricing-map";
import { cacheDeploymentRevision } from "@/lib/cache/cache-revision";
import { CACHE_TAG_MARKETING_PRICING_OPTIONS } from "@/lib/cache/cache-tags";
import { PRICING_OPTIONS_DATA_REVALIDATE_SEC } from "@/lib/cache/public-edge-cache";

/** Display catalog is CA-only today; keep explicit so future US rows never share a cache line. */
const PRICING_OPTIONS_COUNTRY = "CA" as const;

export type NursingPlanRow = {
  tier: TierCode;
  country: "CA";
  duration: BillingDuration;
  checkoutAvailable: boolean;
  totalLabel: string;
  monthlyEquivalentLabel: string;
  savingsVsMonthlyPercent: number;
  isBestValue: boolean;
  isMostPopular: boolean;
  anchorPriceLabel: string | null;
  planCode: string;
};

export type AlliedPlanRow = {
  tier: "ALLIED";
  alliedCareer: AlliedCareerKey;
  alliedCareerLabel: string;
  country: "CA";
  duration: BillingDuration;
  checkoutAvailable: boolean;
  totalLabel: string;
  monthlyEquivalentLabel: string;
  savingsVsMonthlyPercent: number;
  isBestValue: boolean;
  isMostPopular: boolean;
  planCode: string;
};

export type PricingOptionsPayload = {
  durations: typeof BILLING_DURATION_ORDER;
  nursingTiers: typeof NURSING_TIERS;
  alliedCareers: typeof ALLIED_CAREER_KEYS;
  alliedCareerLabels: typeof ALLIED_CAREER_DISPLAY_NAMES;
  plans: NursingPlanRow[];
  alliedPlans: AlliedPlanRow[];
  trialDays: typeof STRIPE_TRIAL_DAYS;
};

function buildPricingOptionsPayload(): PricingOptionsPayload {
  const nursingPlans: NursingPlanRow[] = [];
  for (const combo of eachNursingPricedCombination()) {
    const { tier, duration, planCode } = combo;
    const total = getDisplayTotalMajorUnits(PRICING_OPTIONS_COUNTRY, tier, duration);
    if (total === undefined) continue;

    const months = durationMonths(duration);
    const monthlyEquiv = Number((total / months).toFixed(2));
    const monthlyPlan = getDisplayTotalMajorUnits(PRICING_OPTIONS_COUNTRY, tier, "monthly");
    const baselineMonthly =
      monthlyPlan !== undefined && months > 1 ? Number((monthlyPlan * months).toFixed(2)) : 0;
    const savingsVsMonthly =
      months > 1 && baselineMonthly > 0 ? Math.max(0, Math.round((1 - total / baselineMonthly) * 100)) : 0;

    const priceEntry = findPriceEntry(PRICING_OPTIONS_COUNTRY, tier, duration);
    const hasYearly = Boolean(findPriceEntry(PRICING_OPTIONS_COUNTRY, tier, "yearly"));
    const isBestValue = duration === "yearly" || (!hasYearly && duration === "6-month");
    const isMostPopular = duration === "3-month";

    const anchorPrice = getAnchorPriceMajorUnits(PRICING_OPTIONS_COUNTRY, tier, duration);

    nursingPlans.push({
      tier,
      country: "CA",
      duration,
      checkoutAvailable: Boolean(priceEntry),
      totalLabel: formatCurrencyLabel(total),
      monthlyEquivalentLabel: formatPerMonthLabel(monthlyEquiv),
      savingsVsMonthlyPercent: savingsVsMonthly,
      isBestValue: Boolean(isBestValue && months > 1),
      isMostPopular,
      anchorPriceLabel: anchorPrice ? formatCurrencyLabel(anchorPrice) : null,
      planCode,
    });
  }

  const alliedPlans: AlliedPlanRow[] = [];
  for (const combo of eachAlliedPricedCombination()) {
    const { duration, alliedCareer, planCode } = combo;
    if (!alliedCareer) continue;
    const total = getAlliedDisplayPrice(PRICING_OPTIONS_COUNTRY, duration);
    const months = durationMonths(duration);
    const monthlyEquiv = Number((total / months).toFixed(2));
    const monthlyBase = getAlliedDisplayPrice(PRICING_OPTIONS_COUNTRY, "monthly");
    const baselineMonthly = months > 1 ? Number((monthlyBase * months).toFixed(2)) : 0;
    const savingsVsMonthly =
      months > 1 && baselineMonthly > 0 ? Math.max(0, Math.round((1 - total / baselineMonthly) * 100)) : 0;

    const priceEntry = findAlliedPriceEntry(PRICING_OPTIONS_COUNTRY, alliedCareer, duration);
    const isBestValue = duration === "yearly";
    const isMostPopular = duration === "3-month";

    alliedPlans.push({
      tier: "ALLIED",
      alliedCareer,
      alliedCareerLabel: ALLIED_CAREER_DISPLAY_NAMES[alliedCareer],
      country: "CA",
      duration,
      checkoutAvailable: Boolean(priceEntry),
      totalLabel: formatCurrencyLabel(total),
      monthlyEquivalentLabel: formatPerMonthLabel(monthlyEquiv),
      savingsVsMonthlyPercent: savingsVsMonthly,
      isBestValue: Boolean(isBestValue && months > 1),
      isMostPopular,
      planCode,
    });
  }

  return {
    durations: BILLING_DURATION_ORDER,
    nursingTiers: NURSING_TIERS,
    alliedCareers: ALLIED_CAREER_KEYS,
    alliedCareerLabels: ALLIED_CAREER_DISPLAY_NAMES,
    plans: nursingPlans,
    alliedPlans,
    trialDays: STRIPE_TRIAL_DAYS,
  };
}

/**
 * Anonymous display-only pricing JSON — **never** include user id, session, or entitlement.
 * Checkout remains the authority for real charges (`POST /api/subscriptions/checkout`).
 */
export const getCachedPricingOptionsPayload = unstable_cache(
  async () => buildPricingOptionsPayload(),
  [
    "pricing-options",
    `country:${PRICING_OPTIONS_COUNTRY}`,
    `rev:${cacheDeploymentRevision()}`,
    String(PRICING_OPTIONS_DATA_REVALIDATE_SEC),
  ],
  {
    revalidate: PRICING_OPTIONS_DATA_REVALIDATE_SEC,
    tags: [CACHE_TAG_MARKETING_PRICING_OPTIONS],
  },
);
