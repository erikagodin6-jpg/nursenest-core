import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { learnerAggregateDegradedState } from "@/lib/learner/aggregate-loader-degraded-state";
import { progressPagePayloadToDataResult } from "./progress-page-data-result";
import type { ProgressPagePayload } from "./load-progress-page-payload";

const allReliable: ProgressPagePayload["segmentReliability"] = {
  pathwaySummaries: true,
  contentLessonInventoryCount: true,
  scopedLessonProgress: true,
  topicLedgerAggregate: true,
  topicLedgerTopicCount: true,
  recentGradedSessions: true,
  examMockHistory: true,
  practiceTestHistory: true,
  pathwayTopicCoverage: true,
  incompleteLessonProgressLookup: true,
  continueLessonHrefResolution: true,
};

function basePayload(over: Partial<ProgressPagePayload> = {}): ProgressPagePayload {
  return {
    lessonsPool: { available: 10, completed: 1, inProgress: 0, notStarted: 9 },
    pathways: [{ pathwayId: "p1", shortLabel: "RN", trackKey: "rn", lessonsTotal: 5, lessonsCompleted: 1, lessonsInProgress: 0, notStarted: 4, pct: 20, topicsCovered: 0, topicsTotal: 0, topicCoveragePct: 0 }],
    questionBank: {
      ledgerAttempted: 12,
      ledgerAccuracyPct: 80,
      topicsPracticed: 2,
      recentGraded: { correct: 1, total: 2, sessionCount: 1, accuracyPct: 50 },
    },
    exams: {
      completedPracticeTests: 0,
      recentPracticeTests: [],
      recentMocks: [],
    },
    continueLesson: null,
    segmentReliability: { ...allReliable },
    loadOutcome: "ok",
    ...over,
  };
}

describe("progressPagePayloadToDataResult", () => {
  it("maps uncaught-style error outcome to error (failure is not empty)", () => {
    const p = basePayload({
      loadOutcome: "error",
      pathways: [],
      lessonsPool: { available: 0, completed: 0, inProgress: 0, notStarted: 0 },
      questionBank: {
        ledgerAttempted: 0,
        ledgerAccuracyPct: null,
        topicsPracticed: 0,
        recentGraded: { correct: 0, total: 0, sessionCount: 0, accuracyPct: null },
      },
      segmentReliability: { ...allReliable, pathwaySummaries: false, contentLessonInventoryCount: false },
    });
    const r = progressPagePayloadToDataResult(p, 12);
    assert.equal(r.status, "error");
    if (r.status === "error") {
      assert.equal(r.retryable, true);
      assert.match(r.error, /Progress aggregates/);
    }
  });

  it("maps degraded outcome", () => {
    const p = basePayload({
      loadOutcome: "degraded",
      degraded: learnerAggregateDegradedState("temporarily_unavailable", ["topic_ledger"]),
    });
    const r = progressPagePayloadToDataResult(p, 8);
    assert.equal(r.status, "degraded");
    if (r.status === "degraded") assert.match(r.reason, /topic_ledger/);
  });

  it("still classifies trusted all-zero as empty", () => {
    const p = basePayload({
      pathways: [],
      lessonsPool: { available: 0, completed: 0, inProgress: 0, notStarted: 0 },
      questionBank: {
        ledgerAttempted: 0,
        ledgerAccuracyPct: null,
        topicsPracticed: 0,
        recentGraded: { correct: 0, total: 0, sessionCount: 0, accuracyPct: null },
      },
      exams: { completedPracticeTests: 0, recentPracticeTests: [], recentMocks: [] },
    });
    const r = progressPagePayloadToDataResult(p, 5);
    assert.equal(r.status, "empty");
  });

  it("treats healthy payload as ok", () => {
    const r = progressPagePayloadToDataResult(basePayload(), 3);
    assert.equal(r.status, "ok");
  });
});
