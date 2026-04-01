import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { deriveWeakAreasFromPerformanceEvents, type QuestionPerformanceEventV1 } from "@/lib/learner/question-performance-events";

function ev(input: Partial<QuestionPerformanceEventV1> & Pick<QuestionPerformanceEventV1, "questionId" | "correct">): QuestionPerformanceEventV1 {
  return {
    v: 1,
    topic: null,
    subtopic: null,
    pathwayId: null,
    exam: "NCLEX_RN",
    at: new Date().toISOString(),
    ...input,
  };
}

describe("deriveWeakAreasFromPerformanceEvents", () => {
  it("does not let a single miss outrank sustained misses", () => {
    const events: QuestionPerformanceEventV1[] = [
      ev({ questionId: "1", topic: "Cardiac", correct: false }),
      ev({ questionId: "2", topic: "Pharm", correct: false }),
      ev({ questionId: "3", topic: "Pharm", correct: false }),
      ev({ questionId: "4", topic: "Pharm", correct: true }),
      ev({ questionId: "5", topic: "Pharm", correct: false }),
    ];

    const rows = deriveWeakAreasFromPerformanceEvents(events, 3);
    assert.equal(rows[0]?.topic, "Pharm");
  });

  it("returns empty when no topic/subtopic signals exist", () => {
    const rows = deriveWeakAreasFromPerformanceEvents(
      [
        ev({ questionId: "1", correct: false, topic: null, subtopic: null }),
        ev({ questionId: "2", correct: true, topic: null, subtopic: null }),
      ],
      3,
    );
    assert.equal(rows.length, 0);
  });
});

