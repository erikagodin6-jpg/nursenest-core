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
} from "@/lib/pricing/display-catalog";
import { findPriceEntry } from "@/lib/stripe/pricing-map";

export const dynamic = "force-dynamic";

export async function GET() {
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

    plans.push({
      tier,
      country,
      duration,
      checkoutAvailable: Boolean(priceEntry),
      totalLabel: formatCurrencyLabel(total, country),
      monthlyEquivalentLabel: formatPerMonthLabel(monthlyEquiv, country),
      savingsVsMonthlyPercent: savingsVsMonthly,
      isBestValue: Boolean(isBestValue && months > 1),
    });
  }

  return NextResponse.json({
    durations: BILLING_DURATION_ORDER,
    tiers,
    plans,
  });
}
