import assert from "node:assert/strict";
import { test } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { isNpPremiumConvergencePathway, NP_PREMIUM_CONVERGENCE_PATHWAY_IDS } from "@/lib/marketing/np-premium-convergence-pathways";

test("NP premium convergence covers FNP / AGPCNP / PMHNP / WHNP / PNP-PC / CNPLE pathway ids", () => {
  for (const id of NP_PREMIUM_CONVERGENCE_PATHWAY_IDS) {
    const p = getExamPathwayById(id);
    assert.ok(p, `missing pathway ${id}`);
    assert.equal(p!.roleTrack, "np");
    assert.ok(isNpPremiumConvergencePathway(p!), id);
  }
});

test("RN hub is not NP premium convergence", () => {
  const rn = getExamPathwayById("us-rn-nclex-rn");
  assert.ok(rn);
  assert.equal(isNpPremiumConvergencePathway(rn!), false);
});
