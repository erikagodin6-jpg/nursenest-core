#!/usr/bin/env node
/**
 * Pricing checkout availability guard — registered in npm test suite.
 *
 * Guards against the "Coming soon on every plan" production outage caused when
 * STRIPE_PRICE_* env vars are wiped (e.g. via doctl apps update with an incomplete spec)
 * or when plan env keys are mistakenly set as type:SECRET with no value.
 *
 * Three test groups:
 *  1. Nursing plans: mock env injected → every configured tier/duration → checkoutAvailable=true
 *  2. Allied plans: same approach for shared allied prices
 *  3. do-spec-guard validation: guard must reject SECRET/empty values on price keys
 */
import assert from "node:assert/strict";
import test from "node:test";

// ── Mock Stripe price env vars (canonical key names the code resolves) ────────
const MOCK_PRICE_ENVS = {
  // NP
  STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION: "price_test_np_monthly",
  STRIPE_PRICE_NURSENEST_NP_3_MONTH_SUBSCRIPTION: "price_test_np_3m",
  STRIPE_PRICE_NURSENEST_NP_6_MONTH_SUBSCRIPTION: "price_test_np_6m",
  STRIPE_PRICE_NURSENEST_NP_1_YEAR_SUBSCRIPTION:  "price_test_np_yearly",
  // RN
  STRIPE_PRICE_NURSENEST_RN_1_MONTH_SUBSCRIPTION: "price_test_rn_monthly",
  STRIPE_PRICE_NURSENEST_RN_3_MONTH_SUBSCRIPTION: "price_test_rn_3m",
  STRIPE_PRICE_NURSENEST_RN_6_MONTH_SUBSCRIPTION: "price_test_rn_6m",
  STRIPE_PRICE_NURSENEST_RN_1_YEAR_SUBSCRIPTION:  "price_test_rn_yearly",
  // RPN
  STRIPE_PRICE_NURSENEST_RPN_1_MONTH_SUBSCRIPTION: "price_test_rpn_monthly",
  STRIPE_PRICE_NURSENEST_RPN_3_MONTH_SUBSCRIPTION: "price_test_rpn_3m",
  STRIPE_PRICE_NURSENEST_RPN_6_MONTH_SUBSCRIPTION: "price_test_rpn_6m",
  STRIPE_PRICE_NURSENEST_RPN_YEARLY_SUBSCRIPTION:  "price_test_rpn_yearly",
  // NEW_GRAD (no 3-month — intentionally absent from Stripe catalog)
  STRIPE_PRICE_NEW_GRAD_MONTHLY: "price_test_newgrad_monthly",
  STRIPE_PRICE_NEW_GRAD_6MONTH:  "price_test_newgrad_6m",
  STRIPE_PRICE_NEW_GRAD_YEARLY:  "price_test_newgrad_yearly",
  // Allied (4 shared prices cover all 7 career tracks)
  STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_EXAM_PREP_MONTHLY:    "price_test_allied_monthly",
  STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_EXAM_PREP_3_MONTHS:   "price_test_allied_3m",
  STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_6_MONTH_SUBSCRIPTION: "price_test_allied_6m",
  STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_EXAM_PREP_YEARLY:     "price_test_allied_yearly",
};

const CONFIGURED_NURSING_TIERS = new Set(["NEW_GRAD", "RPN", "RN", "NP"]);
const CONFIGURED_DURATIONS = {
  NEW_GRAD: new Set(["monthly", "6-month", "yearly"]),
  RPN:      new Set(["monthly", "3-month", "6-month", "yearly"]),
  RN:       new Set(["monthly", "3-month", "6-month", "yearly"]),
  NP:       new Set(["monthly", "3-month", "6-month", "yearly"]),
};

function injectMockPrices() {
  const saved = {};
  for (const [k, v] of Object.entries(MOCK_PRICE_ENVS)) {
    saved[k] = process.env[k];
    process.env[k] = v;
  }
  return saved;
}

function restorePrices(saved) {
  for (const [k, v] of Object.entries(saved)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
}

test("all configured paid nursing plans are checkout-available (not Coming soon)", async () => {
  const saved = injectMockPrices();
  try {
    const { buildPricingOptionsPayload } = await import("../src/lib/pricing/pricing-options-build-payload.ts");
    const { resetStripePriceMapCacheForTests } = await import("../src/lib/stripe/pricing-map.ts");
    resetStripePriceMapCacheForTests();

    const payload = buildPricingOptionsPayload();

    for (const row of payload.plans) {
      if (!CONFIGURED_NURSING_TIERS.has(row.tier)) continue;
      const durations = CONFIGURED_DURATIONS[row.tier];
      if (!durations?.has(row.duration)) continue;
      assert.equal(
        row.checkoutAvailable,
        true,
        `${row.tier} ${row.duration}: checkoutAvailable=false → "Coming soon" on pricing page. ` +
        `Root cause: STRIPE_PRICE env var missing or empty in production.`,
      );
    }
  } finally {
    restorePrices(saved);
    const { resetStripePriceMapCacheForTests } = await import("../src/lib/stripe/pricing-map.ts");
    resetStripePriceMapCacheForTests();
  }
});

test("all configured allied health plans are checkout-available (not Coming soon)", async () => {
  const saved = injectMockPrices();
  try {
    const { buildPricingOptionsPayload } = await import("../src/lib/pricing/pricing-options-build-payload.ts");
    const { resetStripePriceMapCacheForTests } = await import("../src/lib/stripe/pricing-map.ts");
    const { ALLIED_CAREER_KEYS } = await import("../src/lib/pricing/display-catalog.ts");
    resetStripePriceMapCacheForTests();

    const payload = buildPricingOptionsPayload();
    const durations = ["monthly", "3-month", "6-month", "yearly"];

    for (const career of ALLIED_CAREER_KEYS) {
      for (const dur of durations) {
        const row = payload.alliedPlans.find(p => p.alliedCareer === career && p.duration === dur);
        assert.ok(row, `Allied plan row missing: career=${career} duration=${dur}`);
        assert.equal(
          row.checkoutAvailable,
          true,
          `Allied ${career} ${dur}: checkoutAvailable=false → "Coming soon". ` +
          `Root cause: STRIPE_PRICE_NURSENEST_ALLIED_HEALTH_* vars missing in production.`,
        );
      }
    }
  } finally {
    restorePrices(saved);
    const { resetStripePriceMapCacheForTests } = await import("../src/lib/stripe/pricing-map.ts");
    resetStripePriceMapCacheForTests();
  }
});

// ── do-spec-guard value validation tests ──────────────────────────────────────
// The guard file is in the root-level scripts/ (not nursenest-core/scripts/).

test("do-spec-guard rejects Stripe price key with type:SECRET (missing value causes Coming soon)", async () => {
  const { validateSpec } = await import("../../scripts/do-spec-guard.mjs");

  const spec = {
    services: [{
      name: "web",
      source_dir: ".",
      run_command: "node scripts/start-standalone.mjs",
      envs: [
        { key: "STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION", type: "SECRET", scope: "RUN_AND_BUILD_TIME" },
      ],
    }],
  };

  const result = validateSpec(spec);
  const hasPriceFailure = result.failures.some(
    f => f.includes("STRIPE_PRICE_NURSENEST_NP_1_MONTH_SUBSCRIPTION") && f.includes("SECRET"),
  );
  assert.ok(hasPriceFailure, `Guard must reject type:SECRET on a Stripe price key. Got failures: ${JSON.stringify(result.failures)}`);
});

test("do-spec-guard rejects Stripe price key with empty value (causes Coming soon)", async () => {
  const { validateSpec } = await import("../../scripts/do-spec-guard.mjs");

  const spec = {
    services: [{
      name: "web",
      source_dir: ".",
      run_command: "node scripts/start-standalone.mjs",
      envs: [
        { key: "STRIPE_PRICE_NURSENEST_RN_1_MONTH_SUBSCRIPTION", value: "", scope: "RUN_AND_BUILD_TIME" },
      ],
    }],
  };

  const result = validateSpec(spec);
  const hasPriceFailure = result.failures.some(
    f => f.includes("STRIPE_PRICE_NURSENEST_RN_1_MONTH_SUBSCRIPTION") && f.includes("empty or placeholder"),
  );
  assert.ok(hasPriceFailure, `Guard must reject empty value on Stripe price key. Got failures: ${JSON.stringify(result.failures)}`);
});
