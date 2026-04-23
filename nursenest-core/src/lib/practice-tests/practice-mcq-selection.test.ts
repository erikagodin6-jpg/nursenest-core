import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mcqAnswerSelectsCanonical } from "@/lib/practice-tests/practice-mcq-selection";

describe("mcqAnswerSelectsCanonical", () => {
  it("returns false for empty / nullish", () => {
    assert.equal(mcqAnswerSelectsCanonical(undefined, "a"), false);
    assert.equal(mcqAnswerSelectsCanonical(null, "a"), false);
  });

  it("matches single-select string", () => {
    assert.equal(mcqAnswerSelectsCanonical("B", "B"), true);
    assert.equal(mcqAnswerSelectsCanonical("B", "A"), false);
  });

  it("matches SATA array membership", () => {
    assert.equal(mcqAnswerSelectsCanonical(["A", "C"], "A"), true);
    assert.equal(mcqAnswerSelectsCanonical(["A", "C"], "B"), false);
  });
});
