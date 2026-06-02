import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizePracticeTestQuestionIds } from "./practice-test-question-ids";

describe("normalizePracticeTestQuestionIds", () => {
  it("keeps normal cuid/uuid-style ids", () => {
    const ids = ["clxxxxxxxxxxxxxxxxxx", "aaaaaaaa-bbbb-4ccc-dddd-eeeeeeeeeeee"];
    assert.deepEqual(normalizePracticeTestQuestionIds(ids), ids);
  });

  it("drops junk placeholders but never drops plausible DB ids", () => {
    assert.deepEqual(
      normalizePracticeTestQuestionIds(["", "  ", "short", "1234567", "12345678"]),
      ["12345678"],
    );
  });
});
