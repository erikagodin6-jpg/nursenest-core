/**
 * Adaptive recommendation cognition convergence.
 *
 * Run: node --import tsx --test src/lib/educational-cognition/adaptive-recommendation.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildGovernedAdaptiveRecommendations } from "@/lib/educational-cognition/adaptive-recommendation-cognition";
import { CNPLE_PATHWAY_ID } from "@/lib/testing/testing-model-pathway-map";

describe("buildGovernedAdaptiveRecommendations", () => {
  it("falls back without userId but exposes cognition shell", async () => {
    const r = await buildGovernedAdaptiveRecommendations({
      examDatePlanType: null,
      examDate: null,
      readiness: {
        score: 55,
        band: "improving",
        confidence: "low",
        trend: null,
        summary: "Early.",
        factors: [],
        whatToImprove: [],
        nextActions: [],
        holdingBack: [],
        topWeakAreas: [],
      },
      weakTopics: [],
      streakDays: 0,
      lessonPct: 10,
      lessonsCompleted: 1,
      lessonsTotal: 10,
      studyCadencePreference: null,
      continueLesson: null,
      recommendedQuizTopic: null,
      mockCount: 0,
      practiceSessionCount: 0,
      preferredPathwayId: CNPLE_PATHWAY_ID,
    });
    assert.ok(r.primaryNext.href);
    assert.equal(r.cognition.pathwayId, CNPLE_PATHWAY_ID);
  });

  it("suppresses pass-outlook timeline on LOFT pathway", async () => {
    const r = await buildGovernedAdaptiveRecommendations({
      examDatePlanType: null,
      examDate: null,
      readiness: {
        score: 60,
        band: "improving",
        confidence: "medium",
        trend: "stable",
        summary: "Building.",
        factors: [],
        whatToImprove: [],
        nextActions: [],
        holdingBack: [],
        topWeakAreas: ["pharmacology"],
      },
      weakTopics: [
        {
          topic: "pharmacology",
          normalizedTopic: "pharmacology",
          missed: 12,
          attempted: 20,
          missRate: 0.6,
          weakPriorityScore: 0.8,
        },
      ],
      streakDays: 2,
      lessonPct: 30,
      lessonsCompleted: 3,
      lessonsTotal: 10,
      studyCadencePreference: null,
      continueLesson: null,
      recommendedQuizTopic: "pharmacology",
      mockCount: 1,
      practiceSessionCount: 5,
      preferredPathwayId: CNPLE_PATHWAY_ID,
    });
    if (r.readinessTimelineLine) {
      assert.ok(!/pass probability|likelihood to pass/i.test(r.readinessTimelineLine));
    }
    assert.equal(r.cognition.testingModel, "LOFT");
  });
});
