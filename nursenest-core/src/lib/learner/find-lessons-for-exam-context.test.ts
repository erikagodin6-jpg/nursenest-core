import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { findLessonsForExamContext } from "./find-lessons-for-exam-context";

describe("findLessonsForExamContext", () => {
  it("returns invalid_pathway for unknown id", async () => {
    const fakePrisma = {
      pathwayLesson: { findMany: async () => [] },
    };
    const r = await findLessonsForExamContext(fakePrisma as never, {
      pathwayId: "not-a-real-pathway",
      topicSlug: "cardiac",
    });
    assert.equal(r.suppressedReason, "invalid_pathway");
    assert.equal(r.primary, null);
  });
});
