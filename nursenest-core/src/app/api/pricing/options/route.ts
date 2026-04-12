import { NextResponse } from "next/server";
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
import { findPriceEntry, findAlliedPriceEntry, logStripePricingConfigurationGaps } from "@/lib/stripe/pricing-map";

export const dynamic = "force-dynamic";

type NursingPlanRow = {
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

type AlliedPlanRow = {
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

export async function GET() {
  logStripePricingConfigurationGaps();

  const nursingPlans: NursingPlanRow[] = [];
  for (const combo of eachNursingPricedCombination()) {
    const { tier, duration, planCode } = combo;
    const total = getDisplayTotalMajorUnits("CA", tier, duration);
    if (total === undefined) continue;

    const months = durationMonths(duration);
    const monthlyEquiv = Number((total / months).toFixed(2));
    const monthlyPlan = getDisplayTotalMajorUnits("CA", tier, "monthly");
    const baselineMonthly =
      monthlyPlan !== undefined && months > 1 ? Number((monthlyPlan * months).toFixed(2)) : 0;
    const savingsVsMonthly =
      months > 1 && baselineMonthly > 0 ? Math.max(0, Math.round((1 - total / baselineMonthly) * 100)) : 0;

    const priceEntry = findPriceEntry("CA", tier, duration);
    const hasYearly = Boolean(findPriceEntry("CA", tier, "yearly"));
    const isBestValue = duration === "yearly" || (!hasYearly && duration === "6-month");
    const isMostPopular = duration === "3-month";

    const anchorPrice = getAnchorPriceMajorUnits("CA", tier, duration);

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
    const total = getAlliedDisplayPrice("CA", duration);
    const months = durationMonths(duration);
    const monthlyEquiv = Number((total / months).toFixed(2));
    const monthlyBase = getAlliedDisplayPrice("CA", "monthly");
    const baselineMonthly = months > 1 ? Number((monthlyBase * months).toFixed(2)) : 0;
    const savingsVsMonthly =
      months > 1 && baselineMonthly > 0 ? Math.max(0, Math.round((1 - total / baselineMonthly) * 100)) : 0;

    const priceEntry = findAlliedPriceEntry("CA", alliedCareer, duration);
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

  return NextResponse.json({
    durations: BILLING_DURATION_ORDER,
    nursingTiers: NURSING_TIERS,
    alliedCareers: ALLIED_CAREER_KEYS,
    alliedCareerLabels: ALLIED_CAREER_DISPLAY_NAMES,
    plans: nursingPlans,
    alliedPlans,
    trialDays: STRIPE_TRIAL_DAYS,
  });
}
