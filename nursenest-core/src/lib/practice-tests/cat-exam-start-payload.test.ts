import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildCatExamStartPayload,
  CAT_EXAM_QUESTION_COUNT,
  CAT_EXAM_TIME_LIMIT_SEC,
} from "@/lib/practice-tests/cat-exam-start-payload";

describe("buildCatExamStartPayload", () => {
  it("always creates an exam-only CAT session with no live tutor feedback", () => {
    const payload = buildCatExamStartPayload({
      pathwayId: " us-rn-nclex-rn ",
      catSelectionBasis: "weak",
      studyLaunchPayload: {
        pathwayId: "stale",
        mode: "practice_exam",
        count: 25,
        selectedCategories: ["respiratory"],
        filters: { hubFilter: "weak" },
        shuffle: true,
      },
    });

    assert.equal(payload.selectionMode, "cat");
    assert.equal(payload.catPresentationMode, "exam_simulation");
    assert.equal(payload.catExamFeedbackMode, "test");
    assert.equal(payload.questionCount, CAT_EXAM_QUESTION_COUNT);
    assert.equal(payload.timedMode, true);
    assert.equal(payload.timeLimitSec, CAT_EXAM_TIME_LIMIT_SEC);
    assert.equal(payload.pathwayId, "us-rn-nclex-rn");
    assert.equal(payload.studyLaunchPayload.pathwayId, "us-rn-nclex-rn");
    assert.equal(payload.studyLaunchPayload.mode, "cat_exam");
    assert.equal(payload.studyLaunchPayload.count, CAT_EXAM_QUESTION_COUNT);
  });
});
