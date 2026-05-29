import assert from "node:assert/strict";
import test from "node:test";
import {
  buildReadinessExecutiveAnalytics,
  buildReadinessReport,
  scoreTopicMastery,
  type LearnerReadinessReportInput,
} from "@/lib/learner/readiness-report-engine";

const input: LearnerReadinessReportInput = {
  userId: "learner-1",
  pathway: "RN",
  tier: "RN Premium",
  examGoal: "NCLEX-RN",
  availableStudyMinutesPerDay: 45,
  topics: [
    {
      topic: "Cardiovascular",
      domain: "Medical-Surgical",
      questionAccuracy: 0.92,
      questionsAnswered: 80,
      flashcardMasteryRate: 0.88,
      flashcardsReviewed: 120,
      lessonsCompleted: 5,
      clinicalSkillsCompleted: 3,
      confidenceAverage: 4.4,
      remediationAssigned: 4,
      remediationCompleted: 4,
      priorMasteryScore: 82,
    },
    {
      topic: "Maternity",
      domain: "Maternal Child",
      questionAccuracy: 0.44,
      questionsAnswered: 55,
      flashcardMasteryRate: 0.48,
      flashcardsReviewed: 60,
      lessonsCompleted: 1,
      confidenceAverage: 2.1,
      remediationAssigned: 5,
      remediationCompleted: 1,
      repeatedMisses: 4,
      missedConcepts: ["postpartum hemorrhage", "fetal monitoring"],
      priorMasteryScore: 58,
    },
    {
      topic: "Pharmacology",
      domain: "Medication Safety",
      questionAccuracy: 0.62,
      questionsAnswered: 60,
      flashcardMasteryRate: 0.58,
      flashcardsReviewed: 90,
      lessonsCompleted: 2,
      pharmacologyActivities: 3,
      confidenceAverage: 4.2,
      remediationAssigned: 3,
      remediationCompleted: 1,
      missedConcepts: ["insulin timing"],
      priorMasteryScore: 61,
    },
  ],
};

test("topic mastery combines performance, confidence, remediation, and activity evidence", () => {
  const mastery = scoreTopicMastery(input.topics[0]);

  assert.equal(mastery.topic, "Cardiovascular");
  assert.ok(mastery.masteryScore >= 80);
  assert.equal(mastery.progressTrend, "stable");
  assert.equal(mastery.evidence.some((line) => line.includes("question accuracy")), true);
});

test("readiness report explains strengths, gaps, confidence, and next actions", () => {
  const report = buildReadinessReport(input, "2026-05-29T00:00:00.000Z");

  assert.equal(report.userId, "learner-1");
  assert.equal(report.strengths[0].topic, "Cardiovascular");
  assert.equal(report.improvementAreas.some((area) => area.topic === "Maternity"), true);
  assert.equal(report.confidenceInsights.some((insight) => insight.category === "Weak Knowledge + High Confidence"), true);
  assert.equal(report.recommendedNextSteps.some((step) => step.activityType === "pharmacology"), true);
  assert.equal(report.studyPlans.sevenDay.days, 7);
  assert.ok(report.dashboardCard.recommendedActions.length > 0);
  assert.notEqual(report.readinessDelta, null);
});

test("executive readiness analytics summarizes cohorts and weak areas", () => {
  const rn = buildReadinessReport(input, "2026-05-29T00:00:00.000Z");
  const rpn = buildReadinessReport({ ...input, userId: "learner-2", pathway: "RPN", tier: "RPN Premium" }, "2026-05-29T00:00:00.000Z");
  const analytics = buildReadinessExecutiveAnalytics([rn, rpn], "2026-05-29T00:00:00.000Z");

  assert.equal(analytics.learnerCount, 2);
  assert.ok(analytics.averageReadiness > 0);
  assert.equal(Object.hasOwn(analytics.readinessByPathway, "RN"), true);
  assert.equal(analytics.mostCommonWeakAreas[0].topic, "Maternity");
  assert.ok(analytics.readinessImprovements.length > 0);
});

