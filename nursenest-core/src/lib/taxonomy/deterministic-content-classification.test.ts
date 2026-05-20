import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { classifyStrings } from "@/lib/taxonomy/classifier";
import { classifyDeterministicContent } from "@/lib/taxonomy/deterministic-content-classification";
import { REVIEW_REQUIRED } from "@/lib/taxonomy/taxonomy";

describe("placementStrictUnique (classifyStrings)", () => {
  it("returns REVIEW_REQUIRED when two clinical systems tie at the top score", () => {
    const r = classifyStrings({
      title: "MI and COPD combined management",
      placementStrictUnique: true,
    });
    assert.equal(r.domain, "REVIEW_PENDING");
    assert.equal(r.category, REVIEW_REQUIRED);
  });

  it("still picks a single clinical leaf when default tie-break mode is off", () => {
    const r = classifyStrings({
      title: "MI and COPD combined management",
      placementStrictUnique: false,
    });
    assert.equal(r.domain, "CLINICAL");
    assert.ok(r.category === "cardiovascular" || r.category === "respiratory");
  });
});

describe("classifyDeterministicContent", () => {
  it("maps professional copy to domain professional when one leaf uniquely wins", () => {
    const r = classifyDeterministicContent({
      title: "SBAR therapeutic handoff during shift report",
      content: "Use structured communication for safe transitions.",
    });
    assert.equal(r.domain, "professional");
    assert.equal(r.category, "communication");
  });

  it("returns review_required when several professional leaves tie at the top score", () => {
    const r = classifyDeterministicContent({
      title: "HIPAA documentation and nursing communication standards",
    });
    assert.equal(r.domain, "review_required");
    assert.equal(r.category, REVIEW_REQUIRED);
  });

  it("maps pharmacology hits to clinical domain", () => {
    const r = classifyDeterministicContent({
      title: "Vancomycin trough monitoring for sepsis therapy",
    });
    assert.equal(r.domain, "clinical");
    assert.ok(
      r.category === "anti_infectives" ||
        r.category === "immune_infectious" ||
        r.category === "cardiovascular_drugs",
    );
  });

  it("surfaces REVIEW_REQUIRED for empty corpus", () => {
    const r = classifyDeterministicContent({ title: "   ", content: "" });
    assert.equal(r.domain, "review_required");
    assert.equal(r.category, REVIEW_REQUIRED);
  });
});
