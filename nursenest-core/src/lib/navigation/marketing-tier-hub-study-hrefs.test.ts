import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { marketingTierHubStudyActionHref } from "@/lib/navigation/marketing-tier-hub-study-hrefs";

describe("marketingTierHubStudyActionHref", () => {
  it("scopes core study surfaces to the pathway URL tree", () => {
    const usPn = getExamPathwayById("us-lpn-nclex-pn");
    assert.ok(usPn);
    assert.equal(marketingTierHubStudyActionHref(usPn, "lessons"), "/us/pn/nclex-pn/lessons");
    assert.equal(marketingTierHubStudyActionHref(usPn, "practice_questions"), "/us/pn/nclex-pn/questions");
    assert.equal(marketingTierHubStudyActionHref(usPn, "exams"), "/us/pn/nclex-pn/cat");
    assert.ok(marketingTierHubStudyActionHref(usPn, "flashcards").includes("pathwayId=us-lpn-nclex-pn"));
  });

  it("never returns empty or fragment-only paths for core actions", () => {
    const caRn = getExamPathwayById("ca-rn-nclex-rn");
    assert.ok(caRn);
    for (const id of ["lessons", "practice_questions", "exams"] as const) {
      const h = marketingTierHubStudyActionHref(caRn, id);
      assert.ok(h.startsWith("/"));
      assert.notEqual(h, "#");
      assert.equal(h.includes("#"), false);
    }
  });
});
