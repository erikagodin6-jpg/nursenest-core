import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { FREE_STRIPE_BILLING_NURSING_TIERS, isFreeStripeBillingNursingTier } from "@/lib/pricing/display-catalog";
import { eachStripePriceMatrixRow, listMissingStripePriceEnvKeys, resetStripePriceMapCacheForTests } from "@/lib/stripe/pricing-map";

describe("Stripe price env matrix excludes free nursing pathways", () => {
  it("never lists PRE_NURSING keys as missing (legacy or canonical prefix)", () => {
    const missing = listMissingStripePriceEnvKeys();
    const bad = missing.filter(
      (k) => k.startsWith("STRIPE_PRICE_PRE_NURSING_") || k.startsWith("STRIPE_PRICE_NURSENEST_PRE_NURSING_"),
    );
    assert.equal(bad.length, 0, `unexpected PRE_NURSING Stripe env keys in missing list: ${bad.join(", ")}`);
  });

  it("matrix rows exclude free nursing tiers", () => {
    const tiers = new Set(eachStripePriceMatrixRow().map((r) => r.tier));
    for (const free of FREE_STRIPE_BILLING_NURSING_TIERS) {
      assert.equal(tiers.has(free), false, `tier ${String(free)} must not appear in Stripe matrix`);
    }
  });

  it("guards: every free nursing tier is classified and excluded from Stripe matrix", () => {
    for (const tier of FREE_STRIPE_BILLING_NURSING_TIERS) {
      assert.equal(isFreeStripeBillingNursingTier(tier), true);
    }
  });

  it("missing list contains no duplicate canonical keys", () => {
    const missing = listMissingStripePriceEnvKeys();
    const unique = new Set(missing);
    assert.equal(missing.length, unique.size, `listMissingStripePriceEnvKeys returned duplicates: ${missing.join(", ")}`);
  });

  it("all matrix rows carry both envKey (canonical) and legacyEnvKey fields", () => {
    for (const row of eachStripePriceMatrixRow()) {
      assert.ok(row.envKey.length > 0, `row missing envKey: ${JSON.stringify(row)}`);
      assert.ok(row.legacyEnvKey.length > 0, `row missing legacyEnvKey: ${JSON.stringify(row)}`);
      assert.ok(["canonical", "legacy", "missing"].includes(row.priceSource), `unexpected priceSource: ${row.priceSource}`);
    }
  });

  it("canonical env keys resolve when set; legacy env keys serve as fallback", () => {
    resetStripePriceMapCacheForTests();
    const canonicalKey = "STRIPE_PRICE_NURSENEST_RN_1_MONTH_SUBSCRIPTION";
    const legacyKey = "STRIPE_PRICE_RN_MONTHLY";
    const sentinel = "price_test_canonical_sentinel";

    process.env[canonicalKey] = sentinel;
    delete process.env[legacyKey];

    const rows = eachStripePriceMatrixRow().filter((r) => r.envKey === canonicalKey);
    const resolved = rows.find((r) => r.priceId === sentinel);
    assert.ok(resolved, "canonical key should resolve when set");
    assert.equal(resolved?.priceSource, "canonical", "source should be 'canonical'");

    delete process.env[canonicalKey];
    process.env[legacyKey] = sentinel;
    resetStripePriceMapCacheForTests();

    const rows2 = eachStripePriceMatrixRow().filter((r) => r.legacyEnvKey === legacyKey);
    const resolved2 = rows2.find((r) => r.priceId === sentinel);
    assert.ok(resolved2, "legacy key should resolve as fallback");
    assert.equal(resolved2?.priceSource, "legacy", "source should be 'legacy'");

    delete process.env[legacyKey];
    resetStripePriceMapCacheForTests();
  });
});
