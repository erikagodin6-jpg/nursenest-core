import assert from "node:assert/strict";
import test from "node:test";

import { buildAdaptiveIntelligenceProfile } from "@/lib/learner/adaptive-intelligence-profile";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { DimensionBreakdown } from "@/lib/learner/exam-attempt-dimension-breakdown";
import type { TopicPerformanceSnapshot } from "@/lib/learner/topic-performance";

const snapshot = {
  learnerPath: "us-rn-nclex-rn",
  pathways: [
    {
      pathwayId: "rn",
      label: "RN Clinical Skills",
      shortLabel: "RN",
      catPathwayExamLabel: "NCLEX-RN",
      catPathwayRegionalExamLine: "",
      lessonsCompleted: 12,
      lessonsTotal: 30,
      lessonsInProgress: 2,
      pct: 40,
    },
  ],
  overallLessons: { completed: 12, total: 30, pct: 40 },
  readiness: {
    score: 64,
    band: "improving",
    confidence: "medium",
    trend: "improving",
    summary: "Your readiness is improving but weak-topic pressure remains.",
    factors: [
      {
        id: "practice_accuracy",
        label: "Practice Questions",
        points: 23,
        maxPoints: 35,
        detail: "42 of 64 correct.",
      },
      {
        id: "mock_performance",
        label: "Practice Exams",
        points: 18,
        maxPoints: 30,
        detail: "Recent mock signal.",
      },
      {
        id: "topic_errors",
        label: "Topic Errors",
        points: 12,
        maxPoints: 25,
        detail: "Weak topic pressure.",
      },
      {
        id: "lesson_completion",
        label: "Lessons",
        points: 6,
        maxPoints: 15,
        detail: "Lesson progress.",
      },
    ],
    whatToImprove: ["Cardiac pharmacology"],
    nextActions: ["Review cardiac medications"],
    holdingBack: ["Topic Errors"],
    topWeakAreas: ["Cardiac pharmacology", "Delegation"],
  },
  cognition: null,
  practice: {
    gradedCorrect: 42,
    gradedTotal: 64,
    sessionCount: 4,
    accuracyPct: 66,
  },
  recentMocks: [
    { id: "mock-1", title: "Mock", pct: 61, completedAt: new Date() },
  ],
  studyStreakDays: 5,
  momentumMessages: [],
  examReadyHeadline: null,
  milestones: [],
  mockCount: 1,
  continueLesson: {
    title: "Cardiac medications",
    href: "/app/lessons/cardiac-medications",
  },
  recommendedQuizTopic: "Delegation",
  flashcards: { cardsReviewedTotal: 48, reviewStreak: 3, suggestedDecks: [] },
  insights: null,
  lessonContinuations: [],
  topicPerformance: null,
  examDimensions: {
    byBodySystem: [],
    byCognitiveLevel: [],
    byQuestionType: [],
    byClientNeeds: [],
  },
  studyBootstrap: {
    alliedProfessionKey: null,
    tier: "RN",
    learnerPath: "us-rn-nclex-rn",
    examDate: null,
    examDatePlanType: null,
  },
} as unknown as PremiumDashboardSnapshot;

const dimensions: DimensionBreakdown = {
  byBodySystem: [
    { label: "Cardiac", correct: 6, total: 12, accuracyPct: 50 },
    { label: "Respiratory", correct: 9, total: 10, accuracyPct: 90 },
  ],
  byCognitiveLevel: [
    {
      label: "Clinical judgment analysis",
      correct: 10,
      total: 18,
      accuracyPct: 56,
    },
  ],
  byQuestionType: [{ label: "SATA", correct: 4, total: 9, accuracyPct: 44 }],
  byClientNeeds: [
    {
      label: "Safe and effective care",
      correct: 8,
      total: 16,
      accuracyPct: 50,
    },
  ],
};

const topicPerf: TopicPerformanceSnapshot = {
  weakTopics: [
    {
      topic: "Cardiac pharmacology",
      normalizedTopic: "cardiac-pharmacology",
      missed: 7,
      attempted: 10,
      missRate: 70,
      wrongStreak: 3,
      weakPriorityScore: 0.82,
      evidenceCount: 10,
      strength: "weak",
    },
    {
      topic: "Delegation",
      normalizedTopic: "delegation",
      missed: 5,
      attempted: 9,
      missRate: 56,
      wrongStreak: 2,
      weakPriorityScore: 0.71,
      evidenceCount: 9,
      strength: "weak",
    },
  ],
  strongTopics: [],
  trends: [],
};

test("adaptive profile blends readiness, dimensions, topic weakness, and retention decay", () => {
  const profile = buildAdaptiveIntelligenceProfile({
    snapshot,
    topicPerf,
    dimensions,
    catTrend: [
      {
        id: "cat-1",
        score: 58,
        completedAt: "2026-05-01T00:00:00.000Z",
        sessionLabel: "CAT #1",
      },
      {
        id: "cat-2",
        score: 66,
        completedAt: "2026-05-08T00:00:00.000Z",
        sessionLabel: "CAT #2",
      },
    ],
    generatedAt: new Date("2026-05-28T00:00:00.000Z"),
  });

  assert.equal(profile.readiness.examReadinessScore, 64);
  assert.equal(profile.readiness.passingProbability, "developing");
  assert.equal(profile.readiness.momentumScore, 66);
  assert.ok(
    profile.signalCoverage.some(
      (signal) => signal.surface === "flashcards" && signal.active,
    ),
  );

  const pharm = profile.competencies.find((item) => item.id === "pharmacology");
  assert.equal(pharm?.retentionRisk, "high");
  assert.equal(pharm?.direction, "regressing");

  const delegation = profile.competencies.find(
    (item) => item.id === "delegation",
  );
  assert.equal(delegation?.retentionRisk, "high");

  assert.ok(
    profile.prescriptions.criticalWeakAreas.some(
      (item) => item.surface === "pharmacology",
    ),
  );
  assert.ok(profile.prescriptions.examReadinessGaps.length > 0);
});
