import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { FREE_STRIPE_BILLING_NURSING_TIERS, isFreeStripeBillingNursingTier } from "@/lib/pricing/display-catalog";
import { eachStripePriceMatrixRow, listMissingStripePriceEnvKeys } from "@/lib/stripe/pricing-map";

describe("Stripe price env matrix excludes free nursing pathways", () => {
  it("never lists STRIPE_PRICE_PRE_NURSING_* keys as missing (Pre-Nursing is not Stripe-billed)", () => {
    const missing = listMissingStripePriceEnvKeys();
    const bad = missing.filter((k) => k.startsWith("STRIPE_PRICE_PRE_NURSING_"));
    assert.equal(
      bad.length,
      0,
      `unexpected PRE_NURSING Stripe env keys in missing list: ${bad.join(", ")}`,
    );
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
});
