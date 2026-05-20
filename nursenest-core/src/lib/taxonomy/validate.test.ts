import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ClassificationResult } from "@/lib/taxonomy/classifier";
import { validateClassification } from "@/lib/taxonomy/validate";
import { DEFAULT_CONTENT_TIER_OVERLAY, REVIEW_REQUIRED } from "@/lib/taxonomy/taxonomy";

function baseResult(partial: Partial<ClassificationResult>): ClassificationResult {
  return {
    domain: "CLINICAL",
    category: "cardiovascular",
    confidenceScore: 0.5,
    scores: {},
    tierOverlay: DEFAULT_CONTENT_TIER_OVERLAY,
    ...partial,
  };
}

describe("validateClassification", () => {
  it("accepts REVIEW_REQUIRED with REVIEW_PENDING", () => {
    assert.doesNotThrow(() =>
      validateClassification(
        baseResult({
          domain: "REVIEW_PENDING",
          category: REVIEW_REQUIRED,
        }),
      ),
    );
  });

  it("throws when REVIEW_REQUIRED is paired with a non-pending domain", () => {
    assert.throws(() =>
      validateClassification(
        baseResult({
          domain: "CLINICAL",
          category: REVIEW_REQUIRED,
        }),
      ),
    );
  });

  it("throws when clinical domain carries a professional category", () => {
    assert.throws(() =>
      validateClassification(
        baseResult({
          domain: "CLINICAL",
          category: "documentation",
        }),
      ),
    );
  });
});
