import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { sharedAlliedStripePriceEnvKey } from "@/lib/pricing/display-catalog";
import { findTierCountryByPriceId, resetStripePriceMapCacheForTests } from "@/lib/stripe/pricing-map";

const SHARED_KEY = sharedAlliedStripePriceEnvKey("monthly");
const TEST_PRICE = "price_test_shared_allied_monthly_stub";

describe("findTierCountryByPriceId (shared allied Stripe price)", () => {
  let prior: string | undefined;

  beforeEach(() => {
    prior = process.env[SHARED_KEY];
    process.env[SHARED_KEY] = TEST_PRICE;
    resetStripePriceMapCacheForTests();
  });

  afterEach(() => {
    if (prior === undefined) delete process.env[SHARED_KEY];
    else process.env[SHARED_KEY] = prior;
    resetStripePriceMapCacheForTests();
  });

  it("returns ALLIED tier without alliedCareer when multiple matrix rows share one price id", () => {
    const mapped = findTierCountryByPriceId(TEST_PRICE);
    assert.ok(mapped);
    assert.equal(mapped!.tier, "ALLIED");
    assert.equal(mapped!.alliedCareer, undefined);
    assert.equal(mapped!.country, undefined);
    assert.equal(mapped!.duration, "monthly");
  });
});
