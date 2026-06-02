import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildEnrichedPostExamPerformanceReport,
  buildPostExamCoachingReport,
} from "@/lib/learner/post-exam-coaching/build-coaching-report";
import { sanitizeCoachingNarrative, resolveCoachingModel } from "@/lib/learner/post-exam-coaching/coaching-semantics";
import { orchestrateCoachingRecommendations } from "@/lib/learner/post-exam-coaching/recommendation-orchestrator";
import type { PracticeTestResultsJson } from "@/lib/practice-tests/types";

function baseResults(): PracticeTestResultsJson {
  return {
    scoreCorrect: 12,
    scoreTotal: 20,
    accuracyPct: 60,
    byTopic: { Cardiovascular: { correct: 3, total: 10 } },
    weakAreas: ["Cardiovascular"],
    catReport: {
      decision: "uncertain",
      result: "BORDERLINE",
      readinessLevel: "Borderline",
      abilityScore: 50,
      confidenceLevelLabel: "Moderate",
      theta: 0.1,
      se: 0.55,
      totalQuestions: 20,
      correctCount: 12,
      stoppedReason: "confidence_pass",
      categoryBreakdown: [
        { category: "Cardiovascular", blueprintKey: "cv", correct: 3, total: 10, strength: "weak" },
      ],
      weakAreas: ["Cardiovascular"],
      suggestedNextSteps: [],
      readinessScore: 60,
      confidenceLevel: "medium",
      confidenceText: "Moderate.",
      trajectory: "steady",
      readinessHeadline: "Borderline",
    },
    catCoach: {
      generatedAt: new Date().toISOString(),
      passOutlookPercent: 52,
      passOutlookDisclaimer: "Estimate.",
      confidenceLevel: "medium",
      reliabilityLevel: "low",
      confidenceSummary: "Low reliability.",
      readinessHeadline: "Borderline",
      readinessNarrative: "Adaptive readiness needs more items.",
      strongestDomains: [],
      weakestDomains: ["Cardiovascular"],
      keyRiskFactor: "Cardiovascular",
      studyNext: [],
      specificStudyActions: [],
      difficultySeries: [],
      difficultyTrendLabel: "rising",
      stabilityTrendLabel: "steady",
      stabilityInterpretation: "Steady",
      passingBandRelative: "below",
      passingBandCopy: "Below",
      weaknessInsights: [],
      errorPatterns: [
        { code: "prioritization", title: "Prioritization", detail: "Unsafe ordering on unstable patients." },
      ],
      multiSessionGuidance: "",
      passOutlookOmitted: true,
    },
  };
}

describe("post-exam coaching semantics", () => {
  it("resolves loft_readiness for CNPLE pathway", () => {
    const model = resolveCoachingModel(
      {
        selectionMode: "random",
        questionCount: 120,
        topicNames: [],
        difficultyMin: null,
        difficultyMax: null,
        pathwayId: "canada-np-cnple",
        timedMode: true,
        timeLimitSec: 7200,
        linearDeliveryMode: "exam",
      },
      "canada-np-cnple",
      "loft_simulation",
    );
    assert.equal(model, "loft_readiness");
  });

  it("sanitizes adaptive psychometric language for LOFT", () => {
    const out = sanitizeCoachingNarrative(
      "Your adaptive readiness improved with lower standard error on difficulty progression.",
      "loft_readiness",
    );
    assert.ok(!/\badaptive readiness\b/i.test(out));
    assert.ok(!/\bstandard error\b/i.test(out));
  });
});

describe("buildPostExamCoachingReport", () => {
  it("softens pass outlook when reliability is low", () => {
    const enriched = buildEnrichedPostExamPerformanceReport({
      results: baseResults(),
      config: {
        selectionMode: "cat",
        questionCount: 20,
        topicNames: [],
        difficultyMin: null,
        difficultyMax: null,
        pathwayId: "us-rn-nclex",
        timedMode: false,
        timeLimitSec: null,
      },
      questionOutcomes: [
        { questionId: "q1", isCorrect: false, topic: "Cardiovascular" },
      ],
      topicTrends: [
        {
          topic: "Cardiovascular",
          momentum: "improving",
          summary: "Cardiovascular accuracy has improved over your last 3 sessions.",
        },
      ],
      weakTopicRows: [
        {
          topic: "Cardiovascular",
          missed: 7,
          missRate: 55,
          attempted: 12,
          wrongStreak: 3,
          strength: "weak",
        },
      ],
    });
    assert.equal(enriched.coaching?.readinessReliability.level, "low");
    assert.equal(enriched.overall.passOutlookPct, null);
    assert.ok(enriched.coaching?.longitudinalNarratives.some((n) => /Cardiovascular/i.test(n)));
  });

  it("orchestrates graph-scaffolded recommendations without duplicate hrefs", () => {
    const recs = orchestrateCoachingRecommendations({
      coachingModel: "linear_practice",
      sessionKind: "practice_exam",
      pathwayId: null,
      weakTopicLabels: ["Pharmacology"],
      coach: null,
      maxItems: 5,
    });
    const hrefs = recs.map((r) => r.href);
    assert.equal(hrefs.length, new Set(hrefs).size);
    assert.ok(recs.length >= 1);
    assert.ok(recs[0].graphStep != null);
  });

  it("uses structured clinical judgment taxonomy", () => {
    const coaching = buildPostExamCoachingReport({
      results: baseResults(),
      config: {
        selectionMode: "cat",
        questionCount: 20,
        topicNames: [],
        difficultyMin: null,
        difficultyMax: null,
        pathwayId: "us-rn-nclex",
        timedMode: false,
        timeLimitSec: null,
      },
    });
    assert.ok(coaching.clinicalJudgment.some((c) => c.pattern === "unsafe_prioritization"));
    assert.equal(coaching.coachingModel, "cat_adaptive");
  });
});
