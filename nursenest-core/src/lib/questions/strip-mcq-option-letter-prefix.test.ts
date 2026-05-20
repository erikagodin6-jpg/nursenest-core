import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { stripRedundantMcqLetterPrefix } from "@/lib/questions/strip-mcq-option-letter-prefix";

describe("stripRedundantMcqLetterPrefix", () => {
  it("removes chained letter prefixes from shuffled display text", () => {
    assert.equal(stripRedundantMcqLetterPrefix("A. C. Persistent sadness."), "Persistent sadness.");
  });

  it("leaves unlabeled text unchanged", () => {
    assert.equal(stripRedundantMcqLetterPrefix("Decreased need for sleep."), "Decreased need for sleep.");
  });
});
