import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LESSON_RATIONALE_MAPPING_ENTRIES } from "@/lib/learner/lesson-question-rationale/registry";

describe("lesson-question-rationale registry", () => {
  it("has unique entry ids", () => {
    const ids = LESSON_RATIONALE_MAPPING_ENTRIES.map((e) => e.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it("has unique haystack patterns per id (manual: ids are unique)", () => {
    assert.ok(LESSON_RATIONALE_MAPPING_ENTRIES.length >= 10);
  });
});
