import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { isNewGradTransitionPathway } from "@/lib/marketing/is-new-grad-transition-pathway";

describe("isNewGradTransitionPathway", () => {
  it("is true for the US New Grad transition pathway", () => {
    const p = getExamPathwayById("us-rn-new-grad-transition");
    assert.ok(p);
    assert.equal(isNewGradTransitionPathway(p), true);
  });

  it("is false for NCLEX-RN marketing pathway", () => {
    const p = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(p);
    assert.equal(isNewGradTransitionPathway(p), false);
  });
});
