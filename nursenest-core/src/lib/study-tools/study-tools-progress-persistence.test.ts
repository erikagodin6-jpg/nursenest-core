import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { summarizeStudyToolsProgress } from "@/lib/study-tools/study-tools-progress-persistence";

describe("summarizeStudyToolsProgress", () => {
  it("returns zeros without browser storage", () => {
    const s = summarizeStudyToolsProgress("user_test_1");
    assert.equal(s.totalAttempts, 0);
    assert.equal(s.mastered, 0);
    assert.equal(s.weak, 0);
  });
});
