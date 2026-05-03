import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildLearnerReportCardViewModel } from "@/lib/learner/learner-report-card-model";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import type { LearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import { buildAppFlashcardsTopicHref } from "@/lib/learner/app-study-internal-links";

describe("learner report card model", () => {
  it("scopes links to pathwayId and dedupes continue CTA pathway", () => {
    const snapshot = {
      learnerPath: "p1",
      pathways: [],
      overallLessons: { completed: 2, total: 10, pct: 20 },
      readiness: {
        score: 55,
        band: "building" as const,
        confidence: "medium" as const,
        trend: null,
        summary: "",
        factors: [],
        whatToImprove: [],
        nextActions: [],
        holdingBack: [],
        topWeakAreas: [],
      },
      practice: { gradedCorrect: 1, gradedTotal: 4, sessionCount: 1, accuracyPct: 25 },
      recentMocks: [],
      studyStreakDays: 0,
      momentumMessages: [],
      examReadyHeadline: null,
      milestones: [],
      mockCount: 0,
      continueLesson: null,
      recommendedQuizTopic: null,
      flashcards: null,
      insights: null,
      lessonContinuations: [],
      topicPerformance: null,
      studyBootstrap: { alliedProfessionKey: null, tier: null, learnerPath: "p1", examDate: null, examDatePlanType: null },
    } as unknown as PremiumDashboardSnapshot;
    const studySnap = {
      weakTopics: [{ topic: "Airway", missRate: 0.4, attempted: 10, normalizedTopic: "airway" }],
      topicPerformanceSource: "ledger",
      topicTrends: [],
      strongTopicsHighlight: [{ topic: "Ethics", missRate: 0.1, attempted: 20, normalizedTopic: "ethics" }],
      recommendedFocusTopic: "Airway",
      topWeak: { topic: "Airway", missRate: 0.4, attempted: 10, normalizedTopic: "airway" },
      pathwayNext: null,
      weakTopicPathwayLesson: { title: "L", href: "/app/lessons/x1", pathwayId: "p1" },
      hasWeakTopicFlashcards: false,
      hasMissedPracticeQuestions: false,
      weakTopicCodes: [],
    } as unknown as LearnerStudySnapshot;
    const m = buildLearnerReportCardViewModel({
      pathwayId: "p1",
      snapshot,
      studySnap,
      continueCheckpoint: {
        pathwayId: "p1",
        topicSlug: "airway",
        lessonSlug: null,
        activityType: "flashcards",
        updatedAt: new Date(),
        href: buildAppFlashcardsTopicHref("p1", "airway"),
        label: "x",
      },
    });
    assert.equal(m.pathwayId, "p1");
    assert.ok(
      m.links.every((l) => {
        const h = l.href;
        return (
          h.startsWith("/app/") &&
          (h.includes("pathwayId=" + encodeURIComponent("p1")) || /^\/app\/lessons\/[^?]+$/.test(h))
        );
      }),
    );
  });
});
