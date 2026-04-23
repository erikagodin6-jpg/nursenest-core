import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { computeReadiness } from "@/lib/learner/readiness-score";

describe("computeReadiness reliability flags", () => {
  it("does not award full topic credit when topic performance signal is unreliable", () => {
    const r = computeReadiness({
      practiceCorrect: 20,
      practiceTotal: 40,
      recentMocks: [{ score: 40, total: 50 }],
      weakTopics: [],
      lessonsCompleted: 0,
      lessonsAvailable: 0,
      topicPerformanceSignalReliable: false,
    });
    const topicFactor = r.factors.find((f) => f.id === "topic_errors");
    assert.ok(topicFactor);
    assert.equal(topicFactor!.maxPoints, 0);
    assert.equal(r.topWeakAreas.length, 0);
  });

  it("does not treat practice totals as real when practice signal is unreliable", () => {
    const r = computeReadiness({
      practiceCorrect: 0,
      practiceTotal: 0,
      recentMocks: [{ score: 45, total: 50 }],
      weakTopics: [
        { topic: "Cardiac", missRate: 40, weakPriorityScore: 1, missed: 4, attempted: 10 },
      ],
      lessonsCompleted: 0,
      lessonsAvailable: 0,
      practiceSignalReliable: false,
    });
    const p = r.factors.find((f) => f.id === "practice_accuracy");
    assert.ok(p);
    assert.equal(p!.maxPoints, 0);
    assert.match(p!.detail, /could not be loaded/i);
  });

  it("does not use mock history for scoring when mock history signal is unreliable", () => {
    const r = computeReadiness({
      practiceCorrect: 40,
      practiceTotal: 80,
      recentMocks: [{ score: 99, total: 100 }],
      weakTopics: [],
      lessonsCompleted: 0,
      lessonsAvailable: 0,
      mockHistorySignalReliable: false,
    });
    const m = r.factors.find((f) => f.id === "mock_performance");
    assert.ok(m);
    assert.equal(m!.maxPoints, 0);
    assert.match(m!.detail, /could not be loaded/i);
  });

  it("does not award lesson completion points when lesson completion signal is unreliable", () => {
    const r = computeReadiness({
      practiceCorrect: 40,
      practiceTotal: 80,
      recentMocks: [{ score: 40, total: 50 }],
      weakTopics: [],
      lessonsCompleted: 10,
      lessonsAvailable: 20,
      lessonCompletionSignalReliable: false,
    });
    const l = r.factors.find((f) => f.id === "lesson_completion");
    assert.ok(l);
    assert.equal(l!.maxPoints, 0);
    assert.match(l!.detail, /could not be loaded/i);
  });
});
