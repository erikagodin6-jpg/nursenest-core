import assert from "node:assert/strict";
import test from "node:test";
import {
  buildChurnPredictionReport,
  calculateEngagementScore,
  evaluateChurnRisk,
  type ChurnLearnerInput,
  type RetentionWindowMetrics,
} from "@/lib/retention/churn-risk-engine";

const activeWindow: RetentionWindowMetrics = {
  logins: 12,
  studyDays: 11,
  sessions: 14,
  sessionMinutes: 420,
  questionsAnswered: 160,
  flashcardsReviewed: 260,
  lessonsCompleted: 12,
  catExamsTaken: 2,
  loftSimulationsCompleted: 1,
  clinicalSkillsActivity: 8,
  pharmacologyActivity: 7,
  ecgActivity: 6,
};

const emptyWindow: RetentionWindowMetrics = {
  logins: 0,
  studyDays: 0,
  sessions: 0,
  sessionMinutes: 0,
  questionsAnswered: 0,
  flashcardsReviewed: 0,
  lessonsCompleted: 0,
  catExamsTaken: 0,
  loftSimulationsCompleted: 0,
  clinicalSkillsActivity: 0,
  pharmacologyActivity: 0,
  ecgActivity: 0,
};

function learner(overrides: Partial<ChurnLearnerInput>): ChurnLearnerInput {
  return {
    userId: "learner-1",
    pathway: "RN",
    tier: "RN Premium",
    lastLoginAt: "2026-05-28T00:00:00.000Z",
    lastActivityAt: "2026-05-28T00:00:00.000Z",
    onboardingCompleted: true,
    readinessAssessmentCompleted: true,
    studyPlanProgressPct: 82,
    confidenceTrend: "stable",
    frustrationEvents7d: 0,
    purchasedFeatures: ["questions", "flashcards", "lessons", "cat"],
    launchedFeatures: ["questions", "flashcards", "lessons", "cat"],
    current7d: activeWindow,
    previous7d: activeWindow,
    current30d: activeWindow,
    previous30d: activeWindow,
    subscription: { status: "active", renewalDate: "2026-06-15T00:00:00.000Z" },
    ...overrides,
  };
}

test("engagement scoring rewards consistent multi-feature learning", () => {
  const score = calculateEngagementScore(learner({}));

  assert.ok(score.engagementScore >= 85);
  assert.ok(score.featureAdoptionScore >= 95);
  assert.ok(score.contentConsumptionScore >= 90);
});

test("churn engine flags inactivity, CAT abandonment, unused purchased ECG, and billing risk", () => {
  const profile = evaluateChurnRisk(
    learner({
      userId: "learner-risk",
      pathway: "ECGCore",
      lastLoginAt: "2026-05-01T00:00:00.000Z",
      lastActivityAt: "2026-05-01T00:00:00.000Z",
      current7d: emptyWindow,
      current30d: emptyWindow,
      previous7d: activeWindow,
      previous30d: { ...activeWindow, catExamsTaken: 3 },
      purchasedFeatures: ["questions", "flashcards", "ecg", "cat"],
      launchedFeatures: ["questions", "flashcards"],
      confidenceTrend: "declining",
      frustrationEvents7d: 4,
      subscription: {
        status: "past_due",
        renewalDate: "2026-06-02T00:00:00.000Z",
        failedPaymentCount: 1,
        billingPortalVisits30d: 3,
      },
    }),
    new Date("2026-05-29T00:00:00.000Z"),
  );

  assert.equal(profile.status, "Critical");
  assert.equal(profile.likelyToCancel, true);
  assert.equal(profile.signals.some((signal) => signal.code === "inactive_14d"), true);
  assert.equal(profile.signals.some((signal) => signal.code === "cat_abandonment"), true);
  assert.equal(profile.signals.some((signal) => signal.code === "purchased_ecg_not_launched"), true);
  assert.equal(profile.interventions.includes("billing_recovery"), true);
  assert.equal(profile.interventions.includes("personalized_study_plan"), true);
  assert.equal(profile.winBackActions.includes("Continue Last Flashcard Session"), true);
});

test("churn prediction report summarizes pathways, features, and interventions", () => {
  const report = buildChurnPredictionReport(
    [
      learner({ userId: "healthy-rn", pathway: "RN" }),
      learner({
        userId: "risk-np",
        pathway: "NP",
        lastActivityAt: "2026-05-10T00:00:00.000Z",
        current7d: emptyWindow,
        current30d: emptyWindow,
        previous7d: activeWindow,
        previous30d: activeWindow,
        subscription: { status: "active", cancelAtPeriodEnd: true },
      }),
    ],
    "2026-05-29T00:00:00.000Z",
  );

  assert.equal(report.totalLearners, 2);
  assert.equal(report.criticalLearners, 1);
  assert.equal(report.predictiveSummary.likelyToCancelUserIds.includes("risk-np"), true);
  assert.equal(report.predictiveSummary.pathwaysWithMostRisk[0], "NP");
  assert.ok(report.featureRetentionScores.some((feature) => feature.feature === "flashcards"));
});

