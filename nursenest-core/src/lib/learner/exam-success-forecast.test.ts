import assert from "node:assert/strict";
import test from "node:test";
import { buildExamSuccessForecast } from "@/lib/learner/exam-success-forecast";
import type { PersonalizedCommandCenterPlan } from "@/lib/learner/personalized-command-center";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";

function commandPlan(): PersonalizedCommandCenterPlan {
  return {
    focusTopic: "Cardiac",
    estimatedMinutes: 42,
    currentReadiness: 80,
    predictedReadiness: 84,
    strengthAreas: ["Fundamentals"],
    weakAreas: ["Cardiac"],
    startHref: "/app/questions/start",
    startLabel: "Start My Session",
    explanation: "Built from weak topic.",
    activities: [
      {
        kind: "cat",
        label: "Assess",
        title: "1 CAT",
        detail: "Readiness check",
        minutes: 24,
        href: "/app/cat",
        reason: "Validate readiness.",
      },
      {
        kind: "questions",
        label: "Practice",
        title: "15 Questions",
        detail: "Question set",
        minutes: 18,
        href: "/app/questions/start?count=15",
        reason: "Build accuracy.",
      },
      {
        kind: "flashcards",
        label: "Recall",
        title: "10 Flashcards",
        detail: "Recall set",
        minutes: 10,
        href: "/app/flashcards",
        reason: "Build retention.",
      },
    ],
  };
}

function snapshot(overrides: Partial<PremiumDashboardSnapshot> = {}): PremiumDashboardSnapshot {
  return {
    learnerPath: "us-rn-nclex-rn",
    pathways: [],
    overallLessons: { completed: 12, total: 20, pct: 60 },
    readiness: {
      score: 78,
      band: "near_ready",
      confidence: "medium",
      trend: "improving",
      summary: "Near ready",
      factors: [],
      whatToImprove: [],
      nextActions: [],
      holdingBack: ["Cardiac"],
      topWeakAreas: ["Cardiac"],
    },
    cognition: {} as PremiumDashboardSnapshot["cognition"],
    practice: { gradedCorrect: 70, gradedTotal: 95, sessionCount: 5, accuracyPct: 74 },
    recentMocks: [
      { id: "a", examTitle: "CAT", pct: 76, score: 38, total: 50, at: "2026-05-20" },
      { id: "b", examTitle: "CAT", pct: 70, score: 35, total: 50, at: "2026-05-10" },
    ],
    studyStreakDays: 7,
    momentumMessages: [],
    examReadyHeadline: null,
    milestones: [],
    mockCount: 3,
    continueLesson: null,
    recommendedQuizTopic: "Cardiac",
    flashcards: { cardsReviewedTotal: 70, reviewStreak: 4, suggestedDecks: [] },
    insights: null,
    lessonContinuations: [],
    topicPerformance: null,
    examDimensions: { bodySystems: [] } as unknown as PremiumDashboardSnapshot["examDimensions"],
    studyBootstrap: {
      alliedProfessionKey: null,
      tier: null,
      learnerPath: "us-rn-nclex-rn",
      examDate: null,
      examDatePlanType: null,
    },
    ...overrides,
  };
}

test("exam success forecast exposes probability, confidence interval, date, hours, and actions for CAT pathways", () => {
  const forecast = buildExamSuccessForecast({
    snapshot: snapshot(),
    studySnap: null,
    pathwayId: "us-rn-nclex-rn",
    commandPlan: commandPlan(),
  });

  assert.equal(forecast.allowsPassProbability, true);
  assert.ok(forecast.passProbability != null && forecast.passProbability > 75);
  assert.ok(forecast.confidenceInterval);
  assert.ok(forecast.projectedReadinessDate);
  assert.ok(forecast.estimatedStudyHoursRemaining != null);
  assert.equal(forecast.trend, "improving");
  assert.equal(forecast.recommendedNextActions.length, 3);
});

test("exam success forecast hides pass probability where testing model policy forbids it", () => {
  const forecast = buildExamSuccessForecast({
    snapshot: snapshot({
      learnerPath: "ca-np-cnple",
      studyBootstrap: {
        alliedProfessionKey: null,
        tier: null,
        learnerPath: "ca-np-cnple",
        examDate: null,
        examDatePlanType: null,
      },
    }),
    studySnap: null,
    pathwayId: "ca-np-cnple",
    commandPlan: commandPlan(),
  });

  assert.equal(forecast.allowsPassProbability, false);
  assert.equal(forecast.passProbability, null);
  assert.equal(forecast.confidenceInterval, null);
  assert.ok(forecast.projectedReadinessDate);
});
