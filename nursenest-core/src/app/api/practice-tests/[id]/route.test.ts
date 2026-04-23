/**
 * Run: `NODE_ENV=test node --import tsx --test src/app/api/practice-tests/[id]/route.test.ts`
 * so learner-private cache invalidation is bypassed (see `shouldBypassLearnerPrivateReadCache`).
 */
import "../../../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { PracticeTestStatus } from "@prisma/client";
import { createInitialAdaptiveState } from "@/lib/exams/cat-engine";
import type { PracticeTestResultsJson } from "@/lib/practice-tests/types";
import { NextRequest } from "next/server";
import { GET, PATCH } from "@/app/api/practice-tests/[id]/route";
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

const Q1 = "q11111111";
const Q2 = "q22222222";

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
  sessionPickSalt: "aaaaaaaaaaaa",
};

const catResults: PracticeTestResultsJson = {
  scoreCorrect: 9,
  scoreTotal: 14,
  accuracyPct: 64,
  byTopic: {
    Pharmacology: { correct: 2, total: 4 },
  },
  weakAreas: ["Pharmacology"],
  incorrectQuestionIds: [Q1],
  estimatedAbility: 0.32,
  abilityStdError: 0.58,
  readinessLabel: "Building confidence",
  catReport: {
    decision: "uncertain",
    result: "BORDERLINE",
    readinessLevel: "Borderline",
    abilityScore: 0.55,
    confidenceLevelLabel: "Low",
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

function makeRequest(body: Record<string, unknown>, referer = "http://localhost/app/practice-tests") {
  return new Request("http://localhost/api/practice-tests/test_12345678", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(referer ? { Referer: referer } : {}),
    },
    body: JSON.stringify(body),
  });
}

afterEach(() => {
  mock.restoreAll();
});

describe("GET /api/practice-tests/[id] contractStrict", () => {
  it("returns 409 with sessionContractError JSON when the row fails hydrate contract", async () => {
    mock.method(practiceTestRouteDeps, "requireSubscriberSession", async () => gate);
    mock.method(practiceTestRouteDeps, "enforcePracticeTestDetailProtection", () => null);
    mock.method(practiceTestRouteDeps, "setSentryServerContext", () => {});
    mock.method(practiceTestRouteDeps, "parsePracticeTestConfigAtBoundary", () => ({
      questionCount: 10,
      topicNames: [],
      difficultyMin: null,
      difficultyMax: null,
      selectionMode: "random" as const,
      pathwayId: "us-rn-nclex-rn",
      timedMode: false,
      sessionPickSalt: "aaaaaaaaaaaa",
      linearDeliveryMode: "exam" as const,
      linearRationaleVisibility: "end_of_exam" as const,
      linearAllowReviewNavigation: false,
    }));
    mock.method(practiceTestRouteDeps, "findPracticeTest", async () => ({
      id: "test_12345678",
      userId: gate.userId,
      title: "Exam",
      status: PracticeTestStatus.IN_PROGRESS,
      questionIds: [Q1],
      answers: {},
      cursorIndex: 0,
      elapsedMs: null,
      config: {},
      adaptiveState: { theta: 1 },
      startedAt: new Date("2026-01-01T00:00:00.000Z"),
      completedAt: null,
      timedMode: false,
      timeLimitSec: null,
      results: null,
    }));

    const req = new NextRequest("http://localhost/api/practice-tests/test_12345678?contractStrict=1");
    const res = await GET(req, { params: Promise.resolve({ id: "test_12345678" }) });
    assert.equal(res.status, 409);
    const data = (await res.json()) as { code?: string; sessionContractError?: { code: string } };
    assert.equal(data.code, "linear_engine_resume_missing_linear_engine");
    assert.equal(data.sessionContractError?.code, "linear_engine_resume_missing_linear_engine");
  });
});

describe("PATCH /api/practice-tests/[id] session contract preflight", () => {
  it("returns 409 when the persisted row fails hydrate contract (cannot PATCH into a broken session)", async () => {
    const update = mock.fn(async () => ({}));
    mock.method(practiceTestRouteDeps, "requireSubscriberSession", async () => gate);
    mock.method(practiceTestRouteDeps, "enforcePracticeTestMutationProtection", () => null);
    mock.method(practiceTestRouteDeps, "setSentryServerContext", () => {});
    mock.method(practiceTestRouteDeps, "parsePracticeTestConfigAtBoundary", () => ({
      questionCount: 10,
      topicNames: [],
      difficultyMin: null,
      difficultyMax: null,
      selectionMode: "random" as const,
      pathwayId: "us-rn-nclex-rn",
      timedMode: false,
      sessionPickSalt: "aaaaaaaaaaaa",
      linearDeliveryMode: "exam" as const,
      linearRationaleVisibility: "end_of_exam" as const,
      linearAllowReviewNavigation: false,
    }));
    mock.method(practiceTestRouteDeps, "findPracticeTest", async () => ({
      id: "test_12345678",
      userId: gate.userId,
      status: PracticeTestStatus.IN_PROGRESS,
      questionIds: [Q1],
      answers: {},
      cursorIndex: 0,
      elapsedMs: null,
      config: {},
      adaptiveState: { theta: 1 },
    }));
    mock.method(practiceTestRouteDeps, "updatePracticeTest", update);

    const res = await PATCH(makeRequest({ action: "save", answers: {}, cursorIndex: 0 }) as never, {
      params: Promise.resolve({ id: "test_12345678" }),
    });
    assert.equal(res.status, 409);
    const data = (await res.json()) as { code?: string; sessionContractError?: { code: string } };
    assert.equal(data.code, "linear_engine_resume_missing_linear_engine");
    assert.equal(update.mock.callCount(), 0);
  });
});

describe("PATCH /api/practice-tests/[id] study launch surface", () => {
  it("rejects save when Referer is the flashcards study surface", async () => {
    mock.method(practiceTestRouteDeps, "requireSubscriberSession", async () => gate);
    mock.method(practiceTestRouteDeps, "enforcePracticeTestMutationProtection", () => null);
    mock.method(practiceTestRouteDeps, "setSentryServerContext", () => {});

    const res = await PATCH(
      makeRequest({ action: "save", answers: {}, cursorIndex: 0 }, "http://localhost/app/flashcards") as never,
      { params: Promise.resolve({ id: "test_12345678" }) },
    );
    assert.equal(res.status, 403);
    const data = (await res.json()) as { error?: string };
    assert.equal(data.error, "INVALID_SURFACE");
  });
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
      questionIds: [Q1],
      answers: {},
      cursorIndex: 0,
      elapsedMs: null,
      config: {},
      adaptiveState: createInitialAdaptiveState(),
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

    const res = await PATCH(makeRequest({ action: "cat_advance", answers: { [Q1]: "A" }, cursorIndex: 0 }) as never, {
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
      questionIds: [Q1, Q2],
      answers: { [Q1]: "A" },
      cursorIndex: 1,
      elapsedMs: null,
      config: {},
      adaptiveState: createInitialAdaptiveState(),
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

    const res = await PATCH(
      makeRequest({ action: "complete", answers: { [Q1]: "A", [Q2]: "B" }, cursorIndex: 1 }) as never,
      { params: Promise.resolve({ id: "test_12345678" }) },
    );
    const data = (await res.json()) as { ok: boolean; results?: PracticeTestResultsJson };

    assert.equal(res.status, 200);
    assert.equal(data.ok, true);
    assert.equal(data.results?.catCoach?.reliabilityLevel, "low");
    assert.equal(update.mock.callCount(), 1);
    assert.equal(captureCompleted.mock.callCount(), 1);
    assert.equal(captureCoach.mock.callCount(), 1);
  });

  it("rejects explicit CAT complete with only one answered item on strict adaptive runs", async () => {
    mock.method(practiceTestRouteDeps, "requireSubscriberSession", async () => gate);
    mock.method(practiceTestRouteDeps, "enforcePracticeTestMutationProtection", () => null);
    mock.method(practiceTestRouteDeps, "setSentryServerContext", () => {});
    mock.method(practiceTestRouteDeps, "parsePracticeTestConfigAtBoundary", () => ({
      ...catConfig,
      catAdaptiveSessionType: "cat" as const,
    }));
    mock.method(practiceTestRouteDeps, "findPracticeTest", async () => ({
      id: "test_12345678",
      userId: gate.userId,
      status: PracticeTestStatus.IN_PROGRESS,
      questionIds: [Q1, Q2],
      answers: { [Q1]: "A" },
      cursorIndex: 0,
      elapsedMs: null,
      config: {},
      adaptiveState: createInitialAdaptiveState(),
    }));

    const res = await PATCH(makeRequest({ action: "complete", answers: { [Q1]: "A" }, cursorIndex: 0 }) as never, {
      params: Promise.resolve({ id: "test_12345678" }),
    });
    const data = (await res.json()) as { code?: string };

    assert.equal(res.status, 400);
    assert.equal(data.code, "cat_complete_not_terminal", JSON.stringify(data));
  });
});

describe("PATCH /api/practice-tests/[id] complete empty session", () => {
  it("rejects complete when the session has zero question ids", async () => {
    mock.method(practiceTestRouteDeps, "requireSubscriberSession", async () => gate);
    mock.method(practiceTestRouteDeps, "enforcePracticeTestMutationProtection", () => null);
    mock.method(practiceTestRouteDeps, "setSentryServerContext", () => {});
    mock.method(practiceTestRouteDeps, "parsePracticeTestConfigAtBoundary", () => ({
      questionCount: 10,
      topicNames: [],
      difficultyMin: null,
      difficultyMax: null,
      selectionMode: "random" as const,
      pathwayId: "us-rn-nclex-rn",
      timedMode: false,
      timeLimitSec: null,
    }));
    mock.method(practiceTestRouteDeps, "findPracticeTest", async () => ({
      id: "test_12345678",
      userId: gate.userId,
      status: PracticeTestStatus.IN_PROGRESS,
      questionIds: [],
      answers: {},
      cursorIndex: 0,
      elapsedMs: null,
      config: {},
      adaptiveState: {},
    }));

    const res = await PATCH(
      makeRequest({ action: "complete", answers: {}, cursorIndex: 0 }) as never,
      { params: Promise.resolve({ id: "test_12345678" }) },
    );
    const data = (await res.json()) as { code?: string };

    assert.equal(res.status, 400);
    assert.equal(data.code, "complete_no_questions");
  });
});

describe("PATCH /api/practice-tests/[id] cursor safety", () => {
  it("clamps out-of-range cursorIndex before persistence", async () => {
    const update = mock.fn(async () => ({}));

    mock.method(practiceTestRouteDeps, "requireSubscriberSession", async () => gate);
    mock.method(practiceTestRouteDeps, "enforcePracticeTestMutationProtection", () => null);
    mock.method(practiceTestRouteDeps, "setSentryServerContext", () => {});
    mock.method(practiceTestRouteDeps, "parsePracticeTestConfigAtBoundary", () => ({
      questionCount: 10,
      topicNames: [],
      difficultyMin: null,
      difficultyMax: null,
      selectionMode: "random" as const,
      pathwayId: "us-rn-nclex-rn",
      timedMode: false,
      timeLimitSec: null,
    }));
    mock.method(practiceTestRouteDeps, "findPracticeTest", async () => ({
      id: "test_12345678",
      userId: gate.userId,
      status: PracticeTestStatus.IN_PROGRESS,
      questionIds: ["q12345678", "q23456789", "q34567890"],
      answers: {},
      cursorIndex: 0,
      elapsedMs: null,
      config: {},
      adaptiveState: {},
    }));
    mock.method(practiceTestRouteDeps, "updatePracticeTest", update);

    const res = await PATCH(
      makeRequest({
        action: "save",
        answers: { q12345678: "A" },
        cursorIndex: 999, // intentionally invalid/out-of-range
      }) as never,
      { params: Promise.resolve({ id: "test_12345678" }) },
    );
    const data = (await res.json()) as { ok?: boolean; error?: string };

    assert.equal(res.status, 200);
    assert.equal(data.ok, true);
    assert.equal(update.mock.callCount(), 1);
    const firstCall = update.mock.calls.at(0) as { arguments: Array<unknown> } | undefined;
    const updateArg = firstCall?.arguments[0] as { data?: { cursorIndex?: number } } | undefined;
    assert.equal(updateArg?.data?.cursorIndex, 2);
  });
});
