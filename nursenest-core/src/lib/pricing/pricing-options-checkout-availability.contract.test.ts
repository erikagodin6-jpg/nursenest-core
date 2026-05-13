import assert from "node:assert/strict";
import test from "node:test";
import type { TierCode } from "@prisma/client";
import { buildPricingOptionsPayload } from "@/lib/pricing/pricing-options-build-payload";
import type { BillingDuration } from "@/lib/pricing/billing-types";
import { ALLIED_CAREER_KEYS } from "@/lib/pricing/display-catalog";
import { resetStripePriceMapCacheForTests } from "@/lib/stripe/pricing-map";

const CONFIGURED_PRICE_ENVS: Record<string, string> = {
  STRIPE_PRICE_NEW_GRAD_MONTHLY: "price_test_newgrad_monthly",
  STRIPE_PRICE_NEW_GRAD_6MONTH: "price_test_newgrad_6m",
  STRIPE_PRICE_NEW_GRAD_YEARLY: "price_test_newgrad_yearly",
  STRIPE_PRICE_NURSENEST_RPN_1_MONTH_SUBSCRIPTION: "price_test_rpn_monthly",
  STRIPE_PRICE_NURSENEST_RPN_3_MONTH_SUBSCRIPTION: "price_test_rpn_3m",
  STRIPE_PRICE_NURSENEST_RPN_6_MONTH_SUBSCRIPTION: "price_test_rpn_6m",
  STRIPE_PRICE_NURSENEST_RPN_YEARLY_SUBSCRIPTION: "price_test_rpn_yearly",
  STRIPE_PRICE_NURSENEST_RN_1_MONTH_SUBSCRIPTION: "price_test_rn_monthly",
  STRIPE_PRICE_NURSENEST_RN_3_MONTH_SUBSCRIPTION: "price_test_rn_3m",
  STRIPE_PRICE_NURSENEST_RN_6_MONTH_SUBSCRIPTION: "price_test_rn_6m",
  STRIPE_PRICE_NURSENEST_RN_1_YEAR_SUBSCRIPTION: "price_test_rn_yearly",
  STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION: "price_test_np_monthly",
  STRIPE_PRICE_NURSENEST_NP_3_MONTH_SUBSCRIPTION: "price_test_np_3m",
  STRIPE_PRICE_NURSENEST_NP_6_MONTH_SUBSCRIPTION: "price_test_np_6m",
  STRIPE_PRICE_NURSENEST_NP_1_YEAR_SUBSCRIPTION: "price_test_np_yearly",
  STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_EXAM_PREP_MONTHLY: "price_test_allied_monthly",
  STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_EXAM_PREP_3_MONTHS: "price_test_allied_3m",
  STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_6_MONTH_SUBSCRIPTION: "price_test_allied_6m",
  STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_EXAM_PREP_YEARLY: "price_test_allied_yearly",
};

const CONFIGURED_NURSING_TIERS = new Set<TierCode>(["NEW_GRAD", "RPN", "LVN_LPN", "RN", "NP"]);
const CONFIGURED_DURATIONS: Record<TierCode, ReadonlySet<BillingDuration>> = {
  NEW_GRAD: new Set(["monthly", "6-month", "yearly"]),
  RPN: new Set(["monthly", "3-month", "6-month", "yearly"]),
  RN: new Set(["monthly", "3-month", "6-month", "yearly"]),
  NP: new Set(["monthly", "3-month", "6-month", "yearly"]),
  PRE_NURSING: new Set(),
  LVN_LPN: new Set(["monthly", "3-month", "6-month", "yearly"]),
  ALLIED: new Set(),
};

function withConfiguredPriceEnv(fn: () => void): void {
  const previous = new Map<string, string | undefined>();
  for (const key of Object.keys(CONFIGURED_PRICE_ENVS)) {
    previous.set(key, process.env[key]);
    process.env[key] = CONFIGURED_PRICE_ENVS[key];
  }

  resetStripePriceMapCacheForTests();
  try {
    fn();
  } finally {
    for (const [key, value] of previous) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    resetStripePriceMapCacheForTests();
  }
}

test("configured visible paid pricing rows are checkout-available, never Coming soon", () => {
  withConfiguredPriceEnv(() => {
    const payload = buildPricingOptionsPayload();

    for (const row of payload.plans) {
      if (!CONFIGURED_NURSING_TIERS.has(row.tier)) continue;
      if (!CONFIGURED_DURATIONS[row.tier].has(row.duration)) continue;

      assert.equal(
        row.checkoutAvailable,
        true,
        `${row.tier} ${row.duration} has a configured Stripe price and would otherwise render Coming soon`,
      );
    }

    for (const career of ALLIED_CAREER_KEYS) {
      for (const duration of ["monthly", "3-month", "6-month", "yearly"] as const) {
        const row = payload.alliedPlans.find((p) => p.alliedCareer === career && p.duration === duration);
        assert.ok(row, `Expected Allied pricing row for ${career} ${duration}`);
        assert.equal(
          row.checkoutAvailable,
          true,
          `ALLIED ${career} ${duration} has a shared configured Stripe price and would otherwise render Coming soon`,
        );
      }
    }
  });
});
