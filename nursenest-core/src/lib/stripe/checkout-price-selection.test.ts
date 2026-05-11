import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { resetStripePriceMapCacheForTests } from "@/lib/stripe/pricing-map";
import { resolveCheckoutPriceSelection, usesLegacyNaCheckoutPricing } from "@/lib/stripe/checkout-price-selection";

const ENV_KEYS = [
  "STRIPE_PRICE_RPN_MONTHLY",
  "STRIPE_PRICE_RN_MONTHLY",
  "STRIPE_PRICE_CANADA_NURSING_MONTHLY",
  "STRIPE_PRICE_PHILIPPINES_NURSING_MONTHLY",
  "STRIPE_PRICE_ALLIED_MONTHLY",
  "STRIPE_PRICE_CANADA_ALLIED_MONTHLY",
] as const;

describe("checkout price selection", () => {
  const prior = new Map<string, string | undefined>();

  beforeEach(() => {
    for (const key of ENV_KEYS) {
      prior.set(key, process.env[key]);
      delete process.env[key];
    }
    resetStripePriceMapCacheForTests();
  });

  afterEach(() => {
    for (const key of ENV_KEYS) {
      const value = prior.get(key);
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    resetStripePriceMapCacheForTests();
  });

  it("keeps Canada on the legacy NA billing path", () => {
    assert.equal(usesLegacyNaCheckoutPricing("canada"), true);
    assert.equal(usesLegacyNaCheckoutPricing("us"), true);
    assert.equal(usesLegacyNaCheckoutPricing("philippines"), false);
  });

  it("prefers the RPN tier-aware legacy price when Canada region metadata is present", () => {
    process.env.STRIPE_PRICE_RPN_MONTHLY = "price_rpn_monthly_legacy";
    process.env.STRIPE_PRICE_CANADA_NURSING_MONTHLY = "price_canada_nursing_generic";
    resetStripePriceMapCacheForTests();

    const selected = resolveCheckoutPriceSelection({
      country: "CA",
      region: "canada",
      tier: "RPN",
      duration: "monthly",
    });

    assert.equal(selected.source, "legacy_na");
    assert.equal(selected.priceId, "price_rpn_monthly_legacy");
    assert.equal(selected.planCode, "rexpn_monthly");
    assert.equal(selected.envKey, "STRIPE_PRICE_RPN_MONTHLY");
    assert.equal(selected.currency, "CAD");
  });

  it("uses regional pricing for non-NA markets when a regional Stripe price exists", () => {
    process.env.STRIPE_PRICE_PHILIPPINES_NURSING_MONTHLY = "price_ph_nursing_monthly";
    process.env.STRIPE_PRICE_RPN_MONTHLY = "price_rpn_monthly_legacy";
    resetStripePriceMapCacheForTests();

    const selected = resolveCheckoutPriceSelection({
      country: "CA",
      region: "philippines",
      tier: "RPN",
      duration: "monthly",
    });

    assert.equal(selected.source, "regional");
    assert.equal(selected.priceId, "price_ph_nursing_monthly");
    assert.equal(selected.planCode, "philippines_nursing_monthly");
    assert.equal(selected.envKey, "STRIPE_PRICE_PHILIPPINES_NURSING_MONTHLY");
    assert.equal(selected.currency, "PHP");
  });
});
