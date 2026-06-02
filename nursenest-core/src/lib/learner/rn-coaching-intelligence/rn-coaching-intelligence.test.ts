import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildRnCoachingIntelligenceReport,
  resolveCoachingSessionKind,
} from "@/lib/learner/rn-coaching-intelligence/build-rn-coaching-intelligence-report";
import { sanitizeCoachingNarrative, resolveCoachingModel } from "@/lib/learner/rn-coaching-intelligence/coaching-semantics";
import { planRemediationV3 } from "@/lib/learner/rn-coaching-intelligence/remediation-planner-v3";
import { buildLongitudinalContextV2 } from "@/lib/learner/rn-coaching-intelligence/longitudinal-memory";
import { analyzeTimingIntelligenceV2 } from "@/lib/learner/rn-coaching-intelligence/timing-intelligence-v2";
import { certaintyTierFromReliability, allowPassOutlookCopy } from "@/lib/learner/rn-coaching-intelligence/coaching-claim-governance";
import { hydrateLearnerState, readinessMomentumFromTrajectory } from "@/lib/learner/rn-coaching-intelligence/hydrate-learner-state";
import { governCoachingReportCopy } from "@/lib/learner/rn-coaching-intelligence/ai-coaching-governance";
import { buildOrchestratedPostExamReport } from "@/lib/learner/rn-coaching-intelligence/coaching-orchestration";
import { buildTimingInsightCards } from "@/lib/learner/rn-coaching-intelligence/timing-insights-ui";
import { buildAiTutorContextEnvelope } from "@/lib/learner/rn-coaching-intelligence/ai-tutor-context-envelope";
import { buildGovernedRnStudyPlan } from "@/lib/learner/rn-coaching-intelligence/study-plan-orchestration";
import { composeDashboardOrchestrationV3 } from "@/lib/learner/rn-coaching-intelligence/dashboard-orchestration-v3";
import { EMPTY_LEARNER_STATE } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import type { PracticeTestResultsJson } from "@/lib/practice-tests/types";

function baseResults(): PracticeTestResultsJson {
  return {
    scoreCorrect: 14,
    scoreTotal: 20,
    accuracyPct: 70,
    byTopic: { Pharmacology: { correct: 4, total: 10 } },
    weakAreas: ["Pharmacology"],
    catCoach: {
      generatedAt: new Date().toISOString(),
      passOutlookPercent: 55,
      passOutlookDisclaimer: "Estimate.",
      confidenceLevel: "medium",
      reliabilityLevel: "low",
      confidenceSummary: "Low.",
      readinessHeadline: "Borderline",
      readinessNarrative: "Review pharmacology.",
      strongestDomains: [],
      weakestDomains: ["Pharmacology"],
      keyRiskFactor: "Pharmacology",
      studyNext: [],
      specificStudyActions: [],
      difficultySeries: [],
      difficultyTrendLabel: "steady",
      stabilityTrendLabel: "steady",
      stabilityInterpretation: "Steady",
      passingBandRelative: "below",
      passingBandCopy: "Below",
      weaknessInsights: [],
      errorPatterns: [{ code: "prioritization", title: "Prioritization", detail: "Unsafe ordering." }],
      multiSessionGuidance: "",
      passOutlookOmitted: true,
    },
  };
}

describe("RN coaching intelligence", () => {
  it("isolates LOFT psychometric language", () => {
    const out = sanitizeCoachingNarrative("Adaptive readiness with standard error on theta.", "loft_readiness");
    assert.ok(!/\badaptive readiness\b/i.test(out));
    assert.ok(!/\bstandard error\b/i.test(out));
  });

  it("low reliability uses observation tier and blocks pass outlook copy", () => {
    const tier = certaintyTierFromReliability("low");
    assert.equal(tier, "observation");
    assert.equal(allowPassOutlookCopy(tier, true), false);
  });

  it("detects fatigue in timing v2", () => {
    const outcomes = Array.from({ length: 16 }, (_, i) => ({
      questionId: `q${i}`,
      isCorrect: i < 12,
      topic: "Cardiovascular",
      questionType: i > 12 ? "MCQ" : "SATA",
    }));
    const timing = analyzeTimingIntelligenceV2({
      totalQuestions: 16,
      elapsedMs: 40 * 60 * 1000,
      outcomes,
      timingByQuestionId: Object.fromEntries(
        outcomes.map((o, i) => [o.questionId, { dwellMs: i > 12 ? 5_000 : 130_000 }]),
      ),
    });
    assert.ok(timing.cognitive.lateSessionAccuracyDrop || timing.cognitive.fatigueDetected);
  });

  it("generates longitudinal improving-but-inconsistent narrative", () => {
    const { narratives } = buildLongitudinalContextV2({
      topicTrends: [
        { topic: "Pharmacology", momentum: "improving", summary: "Trending up." },
      ],
      weakTopics: [
        { topic: "Pharmacology", missed: 6, attempted: 10, missRate: 55, wrongStreak: 3, strength: "weak" },
      ],
      sessionWeakLabels: ["Pharmacology"],
      readinessReliability: "moderate",
    });
    assert.ok(narratives.some((n) => /inconsistent|improving/i.test(n)));
  });

  it("plans remediation without duplicate hrefs", () => {
    const recs = planRemediationV3({
      coachingModel: "cat_adaptive",
      sessionKind: "cat",
      pathwayId: "us-rn-nclex",
      weakTopicLabels: ["Pharmacology"],
      coach: null,
      maxItems: 5,
    });
    const hrefs = recs.map((r) => r.href);
    assert.equal(hrefs.length, new Set(hrefs).size);
    assert.ok(recs.length >= 1);
  });

  it("builds full intelligence report with learner state", () => {
    const report = buildRnCoachingIntelligenceReport({
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
      topicTrends: [{ topic: "Pharmacology", momentum: "declining", summary: "Slipping." }],
      weakTopicRows: [
        { topic: "Pharmacology", missed: 6, attempted: 10, missRate: 60, wrongStreak: 2, strength: "weak" },
      ],
    });
    assert.equal(report.readinessReliability.level, "low");
    assert.ok(report.learnerState.competencyStates.length >= 0);
    assert.ok(report.clinicalJudgment.length >= 1);
    assert.ok(report.longitudinalNarratives.length >= 1);
  });

  it("readiness momentum increases with volatile trajectory", () => {
    const m = readinessMomentumFromTrajectory([50, 62, 48, 70]);
    assert.ok(m > 0);
  });

  it("AI governance strips guaranteed pass claims", () => {
    const governed = governCoachingReportCopy(["You are guaranteed pass on NCLEX."], "cat_adaptive");
    assert.ok(!/guaranteed pass/i.test(governed[0]));
  });

  it("orchestrated post-exam report includes timingV2 and learnerState", () => {
    const report = buildOrchestratedPostExamReport({
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
      questionOutcomes: Array.from({ length: 12 }, (_, i) => ({
        questionId: `q${i}`,
        isCorrect: i < 8,
        topic: "Pharmacology",
      })),
    });
    assert.ok(report.coaching);
    assert.ok(report.coaching.timingV2);
    assert.ok(report.coaching.learnerState);
  });

  it("suppresses timing insight cards when signal count is low", () => {
    const report = buildRnCoachingIntelligenceReport({
      results: baseResults(),
      config: {
        selectionMode: "cat",
        questionCount: 5,
        topicNames: [],
        difficultyMin: null,
        difficultyMax: null,
        pathwayId: "us-rn-nclex",
        timedMode: false,
        timeLimitSec: null,
      },
      questionOutcomes: [{ questionId: "q1", isCorrect: true }],
    });
    const cards = buildTimingInsightCards({
      timing: report.timingV2,
      reliability: "low",
      minSignals: 6,
    });
    assert.equal(cards.length, 0);
  });

  it("builds psychometric-safe AI tutor envelope", () => {
    const report = buildRnCoachingIntelligenceReport({
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
    const env = buildAiTutorContextEnvelope(report);
    assert.equal(env.softenPredictions, true);
    assert.ok(!/guaranteed pass/i.test(env.tutoringPlanSummary));
  });

  it("study plan orchestration avoids duplicate hrefs", () => {
    const state = EMPTY_LEARNER_STATE("us-rn-nclex");
    state.competencyStates.push({
      competencyId: "perfusion_hemodynamics",
      masteryScore: 40,
      volatility: "declining",
      sessionEvidenceCount: 3,
      persistentWeak: true,
      remediationResponsive: null,
      lastUpdatedAt: new Date().toISOString(),
    });
    const plan = buildGovernedRnStudyPlan({
      learnerState: state,
      coachingModel: "cat_adaptive",
      pathwayId: "us-rn-nclex",
    });
    const hrefs = plan.blocks.map((b) => b.href);
    assert.equal(hrefs.length, new Set(hrefs).size);
  });

  it("dashboard orchestration v3 returns bounded cards", () => {
    const orch = composeDashboardOrchestrationV3();
    assert.ok(orch.cards.length <= 6);
  });

  it("resolves LOFT session kind for CNPLE pathway config", () => {
    const kind = resolveCoachingSessionKind(
      {
        selectionMode: "random",
        questionCount: 100,
        topicNames: [],
        difficultyMin: null,
        difficultyMax: null,
        pathwayId: "canada-np-cnple",
        timedMode: true,
        timeLimitSec: 7200,
        linearDeliveryMode: "exam",
      },
      "canada-np-cnple",
    );
    assert.equal(kind, "loft_simulation");
    assert.equal(
      resolveCoachingModel(
        {
          selectionMode: "random",
          questionCount: 100,
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
      ),
      "loft_readiness",
    );
  });
});
