import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { TierCode } from "@prisma/client";
import {
  eachNursingPricedCombination,
  isFreeStripeBillingNursingTier,
  NURSING_TIERS,
  STRIPE_BILLED_NURSING_TIERS,
} from "@/lib/pricing/display-catalog";

describe("display-catalog nursing tracks", () => {
  it("yields at least one priced combination for every Stripe-billed nursing tier tab", () => {
    const counts = new Map<string, number>();
    for (const c of eachNursingPricedCombination()) {
      counts.set(c.tier, (counts.get(c.tier) ?? 0) + 1);
    }
    for (const tier of STRIPE_BILLED_NURSING_TIERS) {
      assert.ok((counts.get(tier) ?? 0) > 0, `expected priced rows for tier ${tier}`);
    }
    assert.equal(counts.get("PRE_NURSING") ?? 0, 0, "Pre-Nursing must not appear in Stripe-priced combinations");
  });

  it("documents catalog gaps so pricing UI keeps four duration slots (no silent empty grid columns)", () => {
    const byTier = new Map<TierCode, Set<string>>();
    for (const c of eachNursingPricedCombination()) {
      if (!byTier.has(c.tier)) byTier.set(c.tier, new Set());
      byTier.get(c.tier)!.add(c.duration);
    }
    assert.equal(byTier.get("NEW_GRAD")!.has("3-month"), false);
    for (const d of ["monthly", "3-month", "6-month", "yearly"] as const) {
      assert.ok(byTier.get("RN")!.has(d), `RN should include ${d}`);
    }
  });

  it("keeps Pre-Nursing on marketing tabs but marks it free for Stripe billing", () => {
    assert.ok(NURSING_TIERS.includes("PRE_NURSING"));
    assert.ok(!STRIPE_BILLED_NURSING_TIERS.includes("PRE_NURSING"));
    assert.equal(isFreeStripeBillingNursingTier("PRE_NURSING"), true);
    assert.equal(isFreeStripeBillingNursingTier("RN"), false);
  });
});
