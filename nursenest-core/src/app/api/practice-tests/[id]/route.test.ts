import "../../../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { PracticeTestStatus } from "@prisma/client";
import type { PracticeTestResultsJson } from "@/lib/practice-tests/types";
import { PATCH } from "@/app/api/practice-tests/[id]/route";
import { practiceTestRouteDeps } from "@/app/api/practice-tests/[id]/route-deps";
import type { SubscriberSessionOk } from "@/lib/entitlements/require-subscriber-session";

const gate: SubscriberSessionOk = {
  ok: true,
  userId: "user_test_123",
  entitlement: {
    hasAccess: true,
    reason: "active_subscription",
    tier: "RN",
    country: "US",
    alliedCareer: null,
  },
  userAccess: {
    userId: "user_test_123",
    hasPremium: true,
    reason: "active_subscription",
    allowedRegion: { country: "US", billingRegionSlug: null },
    allowedProfession: { tier: "RN", alliedCareer: null },
    allowedExam: { pathwayId: null },
    plan: {
      planCode: null,
      duration: null,
      status: "active",
      expiresAt: null,
      cancelAtPeriodEnd: false,
    },
  },
};

const catConfig = {
  questionCount: 75,
  topicNames: [],
  difficultyMin: null,
  difficultyMax: null,
  selectionMode: "cat" as const,
  pathwayId: "us-rn-nclex-rn",
  timedMode: true,
  timeLimitSec: 3600,
  catExamFeedbackMode: "test" as const,
};

const catResults: PracticeTestResultsJson = {
  scoreCorrect: 9,
  scoreTotal: 14,
  accuracyPct: 64,
  byTopic: {
    Pharmacology: { correct: 2, total: 4 },
  },
  weakAreas: ["Pharmacology"],
  incorrectQuestionIds: ["q1", "q2"],
  estimatedAbility: 0.32,
  abilityStdError: 0.58,
  readinessLabel: "Building confidence",
  catReport: {
    decision: "uncertain",
    theta: 0.32,
    se: 0.58,
    totalQuestions: 14,
    correctCount: 9,
    stoppedReason: "completed",
    categoryBreakdown: [{ category: "Pharmacology", blueprintKey: "pharm", correct: 2, total: 4, strength: "weak" }],
    weakAreas: ["Pharmacology"],
    suggestedNextSteps: ["Review pharmacology"],
    readinessScore: 55,
    confidenceLevel: "low",
    confidenceText: "Building. Keep going; the estimate will firm up as you answer more.",
    trajectory: "steady",
    readinessHeadline: "Building confidence. Keep practicing",
  },
};

const catCoach = {
  generatedAt: "2026-04-10T00:00:00.000Z",
  passOutlookPercent: 55,
  passOutlookDisclaimer: "Practice CAT uses the same adaptive engine as test mode, but no home platform can guarantee your licensure result.",
  confidenceLevel: "low" as const,
  reliabilityLevel: "low" as const,
  confidenceSummary: "Short run; keep the language conservative until the estimate stabilizes.",
  readinessHeadline: "The outlook is still forming for this session.",
  readinessNarrative: "Not enough stable evidence yet.",
  strongestDomains: [],
  weakestDomains: [],
  keyRiskFactor: "Estimate still volatile.",
  studyNext: [],
  specificStudyActions: [],
  difficultySeries: [],
  difficultyTrendLabel: "flat" as const,
  stabilityTrendLabel: "insufficient" as const,
  stabilityInterpretation: "Not enough scored steps.",
  passingBandRelative: "uncertain" as const,
  passingBandCopy: "Another CAT or more items will narrow this.",
  weaknessInsights: [],
  errorPatterns: [],
  multiSessionGuidance: "Compare several CAT runs over time.",
};

function makeRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/practice-tests/test_12345678", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

afterEach(() => {
  mock.restoreAll();
});

describe("PATCH /api/practice-tests/[id] CAT completion paths", () => {
  it("captures telemetry and persists enriched results when cat_advance completes the session", async () => {
    const captureCompleted = mock.fn();
    const captureCoach = mock.fn();
    const update = mock.fn(async () => ({}));

    mock.method(practiceTestRouteDeps, "requireSubscriberSession", async () => gate);
    mock.method(practiceTestRouteDeps, "enforcePracticeTestMutationProtection", () => null);
    mock.method(practiceTestRouteDeps, "setSentryServerContext", () => {});
    mock.method(practiceTestRouteDeps, "parsePracticeTestConfigAtBoundary", () => catConfig);
    mock.method(practiceTestRouteDeps, "findPracticeTest", async () => ({
      id: "test_12345678",
      userId: gate.userId,
      status: PracticeTestStatus.IN_PROGRESS,
      questionIds: ["q1"],
      answers: {},
      cursorIndex: 0,
      elapsedMs: null,
      config: {},
      adaptiveState: {},
    }));
    mock.method(practiceTestRouteDeps, "updatePracticeTest", update);
    mock.method(practiceTestRouteDeps, "advanceCatPracticeTest", async () => ({
      kind: "completed" as const,
      results: catResults,
      adaptiveState: { theta: 0.32, se: 0.58 },
    }));
    mock.method(practiceTestRouteDeps, "enrichPracticeTestResultsWithCatCoach", async (results: PracticeTestResultsJson) => ({
      ...results,
      catCoach,
    }));
    mock.method(practiceTestRouteDeps, "recordTopicOutcomesFromPracticeTest", async () => {});
    mock.method(practiceTestRouteDeps, "capturePracticeTestCompletedAnalytics", captureCompleted);
    mock.method(practiceTestRouteDeps, "captureCatCoachGenerationAnalytics", captureCoach);

    const res = await PATCH(makeRequest({ action: "cat_advance", answers: { q1: "A" }, cursorIndex: 0 }) as never, {
      params: Promise.resolve({ id: "test_12345678" }),
    });
    const data = (await res.json()) as { ok: boolean; catCompleted?: boolean; results?: PracticeTestResultsJson };

    assert.equal(res.status, 200);
    assert.equal(data.ok, true);
    assert.equal(data.catCompleted, true);
    assert.equal(data.results?.catCoach?.reliabilityLevel, "low");
    assert.equal(update.mock.callCount(), 1);
    assert.equal(captureCompleted.mock.callCount(), 1);
    assert.equal(captureCoach.mock.callCount(), 1);
  });

  it("captures telemetry and persists enriched results when explicit CAT completion uses finalizeCatPracticeTest", async () => {
    const captureCompleted = mock.fn();
    const captureCoach = mock.fn();
    const update = mock.fn(async () => ({}));

    mock.method(practiceTestRouteDeps, "requireSubscriberSession", async () => gate);
    mock.method(practiceTestRouteDeps, "enforcePracticeTestMutationProtection", () => null);
    mock.method(practiceTestRouteDeps, "setSentryServerContext", () => {});
    mock.method(practiceTestRouteDeps, "parsePracticeTestConfigAtBoundary", () => catConfig);
    mock.method(practiceTestRouteDeps, "findPracticeTest", async () => ({
      id: "test_12345678",
      userId: gate.userId,
      status: PracticeTestStatus.IN_PROGRESS,
      questionIds: ["q1", "q2"],
      answers: { q1: "A" },
      cursorIndex: 1,
      elapsedMs: null,
      config: {},
      adaptiveState: {},
    }));
    mock.method(practiceTestRouteDeps, "updatePracticeTest", update);
    mock.method(practiceTestRouteDeps, "finalizeCatPracticeTest", async () => ({
      results: catResults,
      adaptiveState: { theta: 0.32, se: 0.58 },
    }));
    mock.method(practiceTestRouteDeps, "enrichPracticeTestResultsWithCatCoach", async (results: PracticeTestResultsJson) => ({
      ...results,
      catCoach,
    }));
    mock.method(practiceTestRouteDeps, "recordTopicOutcomesFromPracticeTest", async () => {});
    mock.method(practiceTestRouteDeps, "capturePracticeTestCompletedAnalytics", captureCompleted);
    mock.method(practiceTestRouteDeps, "captureCatCoachGenerationAnalytics", captureCoach);

    const res = await PATCH(makeRequest({ action: "complete", answers: { q1: "A", q2: "B" }, cursorIndex: 1 }) as never, {
      params: Promise.resolve({ id: "test_12345678" }),
    });
    const data = (await res.json()) as { ok: boolean; results?: PracticeTestResultsJson };

    assert.equal(res.status, 200);
    assert.equal(data.ok, true);
    assert.equal(data.results?.catCoach?.reliabilityLevel, "low");
    assert.equal(update.mock.callCount(), 1);
    assert.equal(captureCompleted.mock.callCount(), 1);
    assert.equal(captureCoach.mock.callCount(), 1);
  });
});
