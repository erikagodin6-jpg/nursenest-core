import { NextResponse } from "next/server";
import type { TierCode } from "@prisma/client";
import type { BillingDuration } from "@/lib/pricing/billing-types";
import {
  BILLING_DURATION_ORDER,
  eachPricedCombination,
  durationMonths,
  formatCurrencyLabel,
  formatPerMonthLabel,
  getDisplayTotalMajorUnits,
  getAnchorPriceMajorUnits,
  STRIPE_TRIAL_DAYS,
} from "@/lib/pricing/display-catalog";
import { findPriceEntry, logStripePricingConfigurationGaps } from "@/lib/stripe/pricing-map";

export const dynamic = "force-dynamic";

export async function GET() {
  logStripePricingConfigurationGaps();
  const tiers = Array.from(
    new Set(
      Array.from(eachPricedCombination(), (c) => c.tier),
    ),
  ) as TierCode[];

  const plans: Array<{
    tier: TierCode;
    country: "CA" | "US";
    duration: BillingDuration;
    checkoutAvailable: boolean;
    totalLabel: string;
    monthlyEquivalentLabel: string;
    savingsVsMonthlyPercent: number;
    isBestValue: boolean;
    isMostPopular: boolean;
    anchorPriceLabel: string | null;
  }> = [];

  for (const { country, tier, duration } of eachPricedCombination()) {
    const total = getDisplayTotalMajorUnits(country, tier, duration);
    if (total === undefined) continue;

    const months = durationMonths(duration);
    const monthlyEquiv = Number((total / months).toFixed(2));
    const monthlyPlan = getDisplayTotalMajorUnits(country, tier, "monthly");
    const baselineMonthly =
      monthlyPlan !== undefined && months > 1 ? Number((monthlyPlan * months).toFixed(2)) : 0;
    const savingsVsMonthly =
      months > 1 && baselineMonthly > 0 ? Math.max(0, Math.round((1 - total / baselineMonthly) * 100)) : 0;

    const priceEntry = findPriceEntry(country, tier, duration);
    const hasYearly = Boolean(findPriceEntry(country, tier, "yearly"));
    const isBestValue = duration === "yearly" || (!hasYearly && duration === "6-month");
    const isMostPopular = duration === "3-month";

    const anchorPrice = getAnchorPriceMajorUnits(country, tier, duration);

    plans.push({
      tier,
      country,
      duration,
      checkoutAvailable: Boolean(priceEntry),
      totalLabel: formatCurrencyLabel(total, country),
      monthlyEquivalentLabel: formatPerMonthLabel(monthlyEquiv, country),
      savingsVsMonthlyPercent: savingsVsMonthly,
      isBestValue: Boolean(isBestValue && months > 1),
      isMostPopular,
      anchorPriceLabel: anchorPrice ? formatCurrencyLabel(anchorPrice, country) : null,
    });
  }

  return NextResponse.json({
    durations: BILLING_DURATION_ORDER,
    tiers,
    plans,
    trialDays: STRIPE_TRIAL_DAYS,
  });
}
