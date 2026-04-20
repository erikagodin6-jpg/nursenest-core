import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { eachNursingPricedCombination, NURSING_TIERS } from "@/lib/pricing/display-catalog";

describe("display-catalog nursing tracks", () => {
  it("yields at least one priced combination for every marketing nursing tier tab", () => {
    const counts = new Map<string, number>();
    for (const c of eachNursingPricedCombination()) {
      counts.set(c.tier, (counts.get(c.tier) ?? 0) + 1);
    }
    for (const tier of NURSING_TIERS) {
      assert.ok((counts.get(tier) ?? 0) > 0, `expected priced rows for tier ${tier}`);
    }
  });
});
