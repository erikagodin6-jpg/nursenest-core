import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { stringSimilarityDice } from "@/lib/seo/seo-text-similarity";

describe("stringSimilarityDice", () => {
  it("returns 1 for identical strings", () => {
    assert.equal(stringSimilarityDice("Heart Failure NCLEX Review", "Heart Failure NCLEX Review"), 1);
  });

  it("flags near-duplicate titles above threshold", () => {
    const a = "Heart Failure Pathophysiology Explained (RN Guide)";
    const b = "Heart Failure Pathophysiology Explained (RN Guide) — Part 2";
    assert.ok(stringSimilarityDice(a, b) >= 0.85);
  });
});
