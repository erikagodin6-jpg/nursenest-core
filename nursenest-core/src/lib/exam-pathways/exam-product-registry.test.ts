import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getExamPathwayByRoute,
  resolveExamPathwayFromMarketingHubSegment,
} from "@/lib/exam-pathways/exam-product-registry";

describe("exam-product-registry marketing hub resolution", () => {
  it("resolves canonical pathway with case-insensitive segments", () => {
    const a = getExamPathwayByRoute("us", "rn", "nclex-rn");
    const b = getExamPathwayByRoute("US", "RN", "NCLEX-RN");
    assert.ok(a && b);
    assert.equal(a.id, "us-rn-nclex-rn");
    assert.equal(b.id, "us-rn-nclex-rn");
  });

  it("resolveExamPathwayFromMarketingHubSegment trims and lowercases", () => {
    const p = resolveExamPathwayFromMarketingHubSegment(" canada ", " rpn ", " rex-pn ");
    assert.ok(p);
    assert.equal(p.id, "ca-rpn-rex-pn");
  });

  it("resolves NP SEO alias segments with mixed case", () => {
    const p = resolveExamPathwayFromMarketingHubSegment("US", "NP", "AANP-Practice-Test");
    assert.ok(p);
    assert.equal(p.id, "us-np-fnp");
  });

  it("returns undefined for unknown routes", () => {
    assert.equal(resolveExamPathwayFromMarketingHubSegment("us", "pn", "nclex-pn"), undefined);
  });
});
