import assert from "node:assert/strict";
import test from "node:test";
import { buildPersonalizedCommandCenterPlan } from "@/lib/learner/personalized-command-center";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { LearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";

function snapshot(overrides: Partial<PremiumDashboardSnapshot> = {}): PremiumDashboardSnapshot {
  return {
    learnerPath: "us-rn-nclex-rn",
    pathways: [],
    overallLessons: { completed: 4, total: 20, pct: 20 },
    readiness: {
      score: 80,
      band: "near_ready",
      confidence: "medium",
      trend: "stable",
      summary: "Near ready",
      factors: [],
      whatToImprove: [],
      nextActions: [],
      holdingBack: ["Cardiac"],
      topWeakAreas: ["Cardiac"],
    },
    cognition: {} as PremiumDashboardSnapshot["cognition"],
    practice: { gradedCorrect: 40, gradedTotal: 60, sessionCount: 3, accuracyPct: 67 },
    recentMocks: [],
    studyStreakDays: 3,
    momentumMessages: ["Performing well in Fundamentals."],
    examReadyHeadline: null,
    milestones: [],
    mockCount: 1,
    continueLesson: { title: "Cardiac Output", href: "/app/lessons/cardiac-output" },
    recommendedQuizTopic: "Cardiac",
    flashcards: { cardsReviewedTotal: 12, reviewStreak: 2, suggestedDecks: [{ slug: "cardiac", title: "Cardiac", cardCount: 24 }] },
    insights: null,
    lessonContinuations: [],
    topicPerformance: null,
    examDimensions: {},
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

function studySnap(overrides: Partial<LearnerStudySnapshot> = {}): LearnerStudySnapshot {
  return {
    weakTopics: [{ topic: "Cardiac", missRate: 42, attempted: 18, normalizedTopic: "cardiac" }],
    topicPerformanceSource: "ledger",
    topicTrends: [],
    strongTopicsHighlight: [{ topic: "Fundamentals", missRate: 12, attempted: 20, normalizedTopic: "fundamentals" }],
    recommendedFocusTopic: "Cardiac",
    topWeak: { topic: "Cardiac", missRate: 42, attempted: 18, normalizedTopic: "cardiac" },
    pathwayNext: null,
    weakTopicPathwayLesson: { title: "Cardiac Output", href: "/app/lessons/cardiac-output", pathwayId: "us-rn-nclex-rn" },
    hasWeakTopicFlashcards: true,
    hasMissedPracticeQuestions: true,
    weakTopicCodes: ["cardiac"],
    ...overrides,
  } as LearnerStudySnapshot;
}

test("personalized command center builds a mixed adaptive session from weak-topic signals", () => {
  const plan = buildPersonalizedCommandCenterPlan({
    snapshot: snapshot(),
    studySnap: studySnap(),
    preferredPathwayId: "us-rn-nclex-rn",
  });

  assert.equal(plan.focusTopic, "Cardiac");
  assert.equal(plan.currentReadiness, 80);
  assert.ok(plan.predictedReadiness != null && plan.predictedReadiness > 80);
  assert.ok(plan.estimatedMinutes > 0);
  assert.equal(plan.startHref, "/app/lessons/cardiac-output");
  assert.deepEqual(plan.activities.map((activity) => activity.kind), ["lesson", "questions", "flashcards", "ecg"]);
  assert.ok(plan.strengthAreas.includes("Fundamentals"));
  assert.ok(plan.weakAreas.includes("Cardiac"));
});

test("personalized command center avoids empty plans for new learners", () => {
  const plan = buildPersonalizedCommandCenterPlan({
    snapshot: snapshot({
      readiness: {
        ...snapshot().readiness,
        score: null,
        band: "insufficient_data",
        topWeakAreas: [],
        holdingBack: [],
      },
      continueLesson: null,
      recommendedQuizTopic: null,
      flashcards: null,
      momentumMessages: [],
    }),
    studySnap: null,
    preferredPathwayId: null,
  });

  assert.equal(plan.focusTopic, "Core readiness");
  assert.equal(plan.predictedReadiness, null);
  assert.ok(plan.activities.length >= 2);
  assert.equal(plan.activities[0]?.kind, "lesson");
  assert.equal(plan.activities[1]?.kind, "questions");
});

