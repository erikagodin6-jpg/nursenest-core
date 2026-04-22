import type { TierCode } from "@prisma/client";
import type { PricingOptionsPayload } from "@/lib/pricing/pricing-options-payload-types";
import { STRIPE_BILLED_NURSING_TIERS } from "@/lib/pricing/display-catalog";

export type PricingOptionsPayloadValidation = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};

/**
 * Validates anonymous marketing pricing JSON before RSC render or API response.
 * Callers log `errors` in production — do not show raw validation codes to learners.
 */
export function validatePricingOptionsPayload(payload: PricingOptionsPayload): PricingOptionsPayloadValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!payload || typeof payload !== "object") {
    return { ok: false, errors: ["payload_not_object"], warnings };
  }
  if (!Array.isArray(payload.plans)) errors.push("plans_not_array");
  if (!Array.isArray(payload.alliedPlans)) errors.push("alliedPlans_not_array");
  if (typeof payload.trialDays !== "number" || payload.trialDays < 0) {
    warnings.push("trial_days_missing_or_invalid");
  }

  const plans = Array.isArray(payload.plans) ? payload.plans : [];
  const allied = Array.isArray(payload.alliedPlans) ? payload.alliedPlans : [];

  if (plans.length === 0 && allied.length === 0) {
    errors.push("no_plan_rows");
  }

  /**
   * Catalog is static + deterministic (see `eachNursingPricedCombination` / allied generator).
   * Nursing: 19 rows today (New Grad has no 3-month). Allied: 7×4 = 28.
   */
  if (plans.length < 16) {
    errors.push(`nursing_plan_row_count_low:${plans.length}`);
  }
  if (allied.length < 24) {
    errors.push(`allied_plan_row_count_low:${allied.length}`);
  }

  const checkoutable =
    plans.filter((p) => p.checkoutAvailable).length + allied.filter((p) => p.checkoutAvailable).length;
  /** Stripe envs are absent in many CI/local runs — list prices must still render. */
  if (checkoutable === 0) {
    warnings.push("no_checkoutable_rows_stripe_envs_likely_missing");
  }

  for (const row of plans) {
    if (!row.planCode?.trim()) errors.push("nursing_missing_plan_code");
    if (!row.totalLabel?.trim()) errors.push("nursing_missing_total_label");
    if (!row.monthlyEquivalentLabel?.trim()) errors.push("nursing_missing_monthly_equiv");
  }
  for (const row of allied) {
    if (!row.planCode?.trim()) errors.push("allied_missing_plan_code");
    if (!row.totalLabel?.trim()) errors.push("allied_missing_total_label");
  }

  /** Every Stripe-billed nursing tier should appear at least once (catalog drift guard). */
  const tiersSeen = new Set<TierCode>(plans.map((p) => p.tier));
  for (const tier of STRIPE_BILLED_NURSING_TIERS) {
    if (!tiersSeen.has(tier)) {
      errors.push(`missing_tier_rows:${tier}`);
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}
