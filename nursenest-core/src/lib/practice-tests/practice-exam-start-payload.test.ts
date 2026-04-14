import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildPracticeExamStartPayload } from "@/lib/practice-tests/practice-exam-start-payload";

describe("buildPracticeExamStartPayload", () => {
  it("maps tutor mode to practice delivery with immediate rationale visibility", () => {
    const payload = buildPracticeExamStartPayload({
      questionCount: 20,
      selectionMode: "random",
      topicNames: [" Cardiovascular ", "Cardiovascular", "Respiratory"],
      pathwayId: " us-rn-nclex-rn ",
      timedMode: true,
      timeLimitSec: 3600,
      difficultyMin: 2,
      difficultyMax: 4,
      sessionMode: "tutor",
      rationaleVisibilityMode: "review",
    });

    assert.equal(payload.linearDeliveryMode, "practice");
    assert.equal(payload.linearRationaleVisibility, "after_each");
    assert.deepEqual(payload.topicNames, ["Cardiovascular", "Respiratory"]);
    assert.equal(payload.pathwayId, "us-rn-nclex-rn");
    assert.equal(payload.timedMode, true);
    assert.equal(payload.timeLimitSec, 3600);
    assert.equal(payload.difficultyMin, 2);
    assert.equal(payload.difficultyMax, 4);
  });

  it("maps exam mode to exam delivery with end-of-exam rationale visibility", () => {
    const payload = buildPracticeExamStartPayload({
      questionCount: 40,
      selectionMode: "targeted",
      topicNames: ["Renal"],
      pathwayId: null,
      timedMode: false,
      timeLimitSec: 1234,
      difficultyMin: null,
      difficultyMax: null,
      sessionMode: "exam",
      rationaleVisibilityMode: "review",
    });

    assert.equal(payload.linearDeliveryMode, "exam");
    assert.equal(payload.linearRationaleVisibility, "end_of_exam");
    assert.equal(payload.timedMode, false);
    assert.equal(payload.timeLimitSec, null);
  });

  it("clamps question count to supported linear bounds", () => {
    const low = buildPracticeExamStartPayload({
      questionCount: 2,
      selectionMode: "weak",
      timedMode: false,
      sessionMode: "tutor",
      rationaleVisibilityMode: "immediate",
    });
    const high = buildPracticeExamStartPayload({
      questionCount: 200,
      selectionMode: "random",
      timedMode: false,
      sessionMode: "exam",
      rationaleVisibilityMode: "review",
    });

    assert.equal(low.questionCount, 5);
    assert.equal(high.questionCount, 100);
  });
});
