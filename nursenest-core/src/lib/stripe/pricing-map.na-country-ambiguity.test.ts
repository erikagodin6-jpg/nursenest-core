import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { stripePriceEnvKey } from "@/lib/pricing/display-catalog";
import { findTierCountryByPriceId, resetStripePriceMapCacheForTests } from "@/lib/stripe/pricing-map";

const RN_MONTHLY_KEY = stripePriceEnvKey("CA", "RN", "monthly");
const TEST_PRICE = "price_test_rn_monthly_na_shared";

describe("findTierCountryByPriceId (North America shared nursing price)", () => {
  let prior: string | undefined;

  beforeEach(() => {
    prior = process.env[RN_MONTHLY_KEY];
    process.env[RN_MONTHLY_KEY] = TEST_PRICE;
    resetStripePriceMapCacheForTests();
  });

  afterEach(() => {
    if (prior === undefined) delete process.env[RN_MONTHLY_KEY];
    else process.env[RN_MONTHLY_KEY] = prior;
    resetStripePriceMapCacheForTests();
  });

  it("returns RN tier without inventing CA/US when one Stripe price serves both NA markets", () => {
    const mapped = findTierCountryByPriceId(TEST_PRICE);
    assert.ok(mapped);
    assert.equal(mapped!.tier, "RN");
    assert.equal(mapped!.duration, "monthly");
    assert.equal(mapped!.country, undefined);
  });
});
