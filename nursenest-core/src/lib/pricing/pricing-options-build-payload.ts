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
} from "@/lib/pricing/display-catalog";
import type {
  AlliedPlanRowPayload,
  NursingPlanRowPayload,
  PricingOptionsPayload,
} from "@/lib/pricing/pricing-options-payload-types";
import { validatePricingOptionsPayload } from "@/lib/pricing/pricing-options-payload-validate";
import { findPriceEntry, findAlliedPriceEntry } from "@/lib/stripe/pricing-map";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const PRICING_OPTIONS_COUNTRIES = ["CA", "US"] as const;

/**
 * Synchronous marketing + API pricing catalog (list prices + checkout flags).
 * Safe to import from build scripts — no `server-only` gate.
 */
export function buildPricingOptionsPayload(): PricingOptionsPayload {
  const nursingPlans: NursingPlanRowPayload[] = [];
  for (const combo of eachNursingPricedCombination(PRICING_OPTIONS_COUNTRIES)) {
    const { country, tier, duration, planCode } = combo;
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

    nursingPlans.push({
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
      planCode,
    });
  }

  const alliedPlans: AlliedPlanRowPayload[] = [];
  for (const combo of eachAlliedPricedCombination(PRICING_OPTIONS_COUNTRIES)) {
    const { country, duration, alliedCareer, planCode } = combo;
    if (!alliedCareer) continue;
    const total = getAlliedDisplayPrice(country, duration);
    const months = durationMonths(duration);
    const monthlyEquiv = Number((total / months).toFixed(2));
    const monthlyBase = getAlliedDisplayPrice(country, "monthly");
    const baselineMonthly = months > 1 ? Number((monthlyBase * months).toFixed(2)) : 0;
    const savingsVsMonthly =
      months > 1 && baselineMonthly > 0 ? Math.max(0, Math.round((1 - total / baselineMonthly) * 100)) : 0;

    const priceEntry = findAlliedPriceEntry(country, alliedCareer, duration);
    const isBestValue = duration === "yearly";
    const isMostPopular = duration === "3-month";

    alliedPlans.push({
      tier: "ALLIED",
      alliedCareer,
      alliedCareerLabel: ALLIED_CAREER_DISPLAY_NAMES[alliedCareer],
      country,
      duration,
      checkoutAvailable: Boolean(priceEntry),
      totalLabel: formatCurrencyLabel(total, country),
      monthlyEquivalentLabel: formatPerMonthLabel(monthlyEquiv, country),
      savingsVsMonthlyPercent: savingsVsMonthly,
      isBestValue: Boolean(isBestValue && months > 1),
      isMostPopular,
      planCode,
    });
  }

  const payload = {
    durations: BILLING_DURATION_ORDER,
    nursingTiers: NURSING_TIERS,
    alliedCareers: ALLIED_CAREER_KEYS,
    alliedCareerLabels: ALLIED_CAREER_DISPLAY_NAMES,
    plans: nursingPlans,
    alliedPlans,
    trialDays: STRIPE_TRIAL_DAYS,
  } satisfies PricingOptionsPayload;

  const v = validatePricingOptionsPayload(payload);
  if (!v.ok) {
    safeServerLog("billing", "pricing_options_payload_validation_failed", {
      errors: v.errors.join("|").slice(0, 900),
      warnings: v.warnings.join("|").slice(0, 400),
      nursingRows: nursingPlans.length,
      alliedRows: alliedPlans.length,
    });
  }

  return payload;
}
