import type { CatExamReport } from "@/lib/exams/cat-types";
import type { CatResultsCoachSnapshot } from "@/lib/practice-tests/cat-results-coach";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";
import type { TopicTrendRow } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import {
  buildCoachingSemanticsCopy,
  resolveCoachingModel,
  sanitizeCoachingNarrative,
} from "@/lib/learner/rn-coaching-intelligence/coaching-semantics";
import { certaintyTierFromReliability } from "@/lib/learner/rn-coaching-intelligence/coaching-claim-governance";
import { governCoachingReportCopy } from "@/lib/learner/rn-coaching-intelligence/ai-coaching-governance";
import { governDashboardAiCopy } from "@/lib/measurements/measurement-surface-convergence";
import { buildDashboardFeedV2 } from "@/lib/learner/rn-coaching-intelligence/dashboard-feed";
import { hydrateLearnerState } from "@/lib/learner/rn-coaching-intelligence/hydrate-learner-state";
import { readLearnerState, persistLearnerState } from "@/lib/learner/rn-coaching-intelligence/learner-state-store";
import { buildLongitudinalContextV2 } from "@/lib/learner/rn-coaching-intelligence/longitudinal-memory";
import { planRemediationV3 } from "@/lib/learner/rn-coaching-intelligence/remediation-planner-v3";
import { assessReadinessReliability } from "@/lib/learner/rn-coaching-intelligence/readiness-reliability";
import { buildRnStructuredClinicalInsights } from "@/lib/learner/rn-coaching-intelligence/rn-reasoning-ontology";
import {
  analyzeTimingIntelligenceV2,
  ingestTimingFromPerformanceEvents,
} from "@/lib/learner/rn-coaching-intelligence/timing-intelligence-v2";
import { countRemediationExposures } from "@/lib/learner/rn-coaching-intelligence/remediation-exposure";
import { recordCoachingTelemetry } from "@/lib/learner/rn-coaching-intelligence/coaching-telemetry";
import type {
  QuestionOutcome,
  ReadinessBand,
  RnCoachingIntelligenceReport,
} from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { CoachingSessionKind } from "@/lib/learner/rn-coaching-intelligence/remediation-planner-v3";

export function getReadinessBandFromScore(score: number): ReadinessBand {
  if (score >= 75) return "exam_ready";
  if (score >= 60) return "approaching";
  if (score >= 40) return "building";
  return "not_ready";
}

export function resolveCoachingSessionKind(
  config: PracticeTestConfigJson | null,
  pathwayId?: string | null,
): CoachingSessionKind {
  const model = resolveCoachingModel(config, pathwayId);
  if (model === "loft_readiness") return "loft_simulation";
  if (config?.selectionMode === "cat") return "cat";
  if (config?.timedMode) return "timed_assessment";
  return "practice_exam";
}

function weakLabelsFromResults(
  results: PracticeTestResultsJson,
  outcomes: QuestionOutcome[],
): string[] {
  const counts = new Map<string, { c: number; t: number }>();
  for (const o of outcomes) {
    const label = (o.topic?.trim() || "General").slice(0, 120);
    const row = counts.get(label) ?? { c: 0, t: 0 };
    row.t += 1;
    if (o.isCorrect) row.c += 1;
    counts.set(label, row);
  }
  if (counts.size === 0) {
    for (const [k, v] of Object.entries(results.byTopic ?? {})) {
      const pct = v.total > 0 ? v.correct / v.total : 1;
      if (pct < 0.55) counts.set(k, { c: v.correct, t: v.total });
    }
  }
  return [...counts.entries()]
    .filter(([, v]) => v.t > 0 && v.c / v.t < 0.55)
    .sort((a, b) => a[1].c / a[1].t - b[1].c / b[1].t)
    .map(([k]) => k)
    .slice(0, 5);
}

function confidenceVolatility(confidenceByQuestionId?: Record<string, "low" | "medium" | "high">): number {
  if (!confidenceByQuestionId) return 0;
  const vals = Object.values(confidenceByQuestionId);
  if (vals.length < 4) return 0;
  const highs = vals.filter((v) => v === "high").length / vals.length;
  const lows = vals.filter((v) => v === "low").length / vals.length;
  return Math.min(1, highs + lows);
}

export type BuildRnCoachingIntelligenceInput = {
  results: PracticeTestResultsJson;
  config: PracticeTestConfigJson | null;
  pathwayId?: string | null;
  sessionKind?: CoachingSessionKind;
  elapsedMs?: number | null;
  timedMode?: boolean;
  timeLimitSec?: number | null;
  questionOutcomes?: QuestionOutcome[];
  confidenceByQuestionId?: Record<string, "low" | "medium" | "high">;
  topicTrends?: TopicTrendRow[];
  weakTopicRows?: WeakTopicRow[];
  recentSessionCount?: number;
  remediationUserId?: string | null;
  timingByQuestionId?: Record<string, { dwellMs?: number; answerChanges?: number; rereads?: number }>;
  headline?: string;
  narrative?: string;
};

export function buildRnCoachingIntelligenceReport(
  input: BuildRnCoachingIntelligenceInput,
): RnCoachingIntelligenceReport {
  const {
    results,
    config,
    pathwayId = config?.pathwayId ?? null,
    elapsedMs,
    timedMode = config?.timedMode ?? false,
    timeLimitSec = config?.timeLimitSec ?? null,
    questionOutcomes = [],
    confidenceByQuestionId,
    topicTrends = [],
    weakTopicRows = [],
    recentSessionCount = 0,
    remediationUserId,
    timingByQuestionId: timingInput,
  } = input;

  const sessionKind = input.sessionKind ?? resolveCoachingSessionKind(config, pathwayId);
  const coachingModel = resolveCoachingModel(config, pathwayId, sessionKind);
  const semantics = buildCoachingSemanticsCopy(coachingModel, config);
  const catReport = results.catReport;
  const coach = results.catCoach;

  const outcomes =
    questionOutcomes.length > 0
      ? questionOutcomes
      : (results.incorrectQuestionIds ?? []).map((id) => ({
          questionId: id,
          isCorrect: false,
          topic: null,
          questionType: null,
        }));

  let timingByQuestionId = timingInput;
  if (remediationUserId && !timingByQuestionId) {
    timingByQuestionId = ingestTimingFromPerformanceEvents(
      remediationUserId,
      outcomes.map((o) => o.questionId),
    );
  }

  const timingV2 = analyzeTimingIntelligenceV2({
    elapsedMs,
    totalQuestions: results.scoreTotal,
    timedMode,
    timeLimitSec,
    outcomes,
    confidenceByQuestionId,
    timingByQuestionId,
  });

  const weakLabels = weakLabelsFromResults(results, outcomes);
  const domainCount = catReport?.categoryBreakdown?.length ?? Object.keys(results.byTopic ?? {}).length;

  const readinessReliability = assessReadinessReliability({
    coachingModel,
    totalQuestions: results.scoreTotal,
    domainCount,
    coach,
    catReport: catReport ?? null,
    confidenceVolatility: confidenceVolatility(confidenceByQuestionId),
    pacingAnomaly:
      timingV2.pacingLabel.includes("pressure") || timingV2.pacingLabel.includes("Hesitation"),
    sessionCompletedCleanly: true,
  });

  const certaintyTier = certaintyTierFromReliability(readinessReliability.level);

  const priorState = remediationUserId ? readLearnerState(remediationUserId) : null;
  const scorePct =
    catReport?.readinessScore != null ? Math.round(catReport.readinessScore) : results.accuracyPct;

  const learnerState = hydrateLearnerState({
    pathwayId,
    topicTrends,
    weakTopics: weakTopicRows,
    sessionWeakLabels: weakLabels,
    sessionReadinessScore: scorePct,
    timing: timingV2,
    reasoningPatterns: (coach?.errorPatterns ?? []).map((p) =>
      p.code === "prioritization" ? "unsafe_prioritization" : "monitoring_gap",
    ) as import("@/lib/learner/rn-coaching-intelligence/coaching-types").ClinicalJudgmentPattern[],
    priorState,
    remediationExposureCount: remediationUserId ? countRemediationExposures(remediationUserId) : 0,
    confidenceInstability: timingV2.cognitive.confidenceInstability,
  });

  if (remediationUserId) persistLearnerState(remediationUserId, learnerState);

  const { context: longitudinal, narratives: longitudinalNarratives } = buildLongitudinalContextV2({
    topicTrends,
    weakTopics: weakTopicRows,
    sessionWeakLabels: weakLabels,
    recentCompletedSessions: recentSessionCount,
    learnerState,
    timing: timingV2,
    readinessReliability: readinessReliability.level,
  });

  const extraDomains = catReport?.categoryBreakdown?.filter((c) => c.strength === "weak").map((c) => c.category) ?? [];
  const clinicalJudgment = buildRnStructuredClinicalInsights(
    coach?.errorPatterns ?? [],
    extraDomains,
    learnerState.measurementWeaknesses,
  );

  const recommendations = planRemediationV3({
    coachingModel,
    sessionKind,
    pathwayId,
    weakTopicLabels: weakLabels,
    coach,
    remediationUserId,
    learnerState,
  });

  const rawHeadline =
    input.headline ??
    coach?.readinessHeadline?.trim() ??
    catReport?.readinessHeadline?.trim() ??
    `${results.readinessLevel ?? "Session"} — ${scorePct}%`;

  const headline = governCoachingReportCopy([rawHeadline], coachingModel)[0];

  const dashboardFeed = buildDashboardFeedV2({
    pathwayId,
    coachingModel,
    readinessReliability,
    recommendations,
    longitudinal,
    readinessScore: scorePct,
    headline,
    learnerState,
  });

  recordCoachingTelemetry("coaching_report_generated", {
    coachingModel,
    reliability: readinessReliability.level,
    recommendationCount: recommendations.length,
    pathwayId,
  });

  recordCoachingTelemetry("readiness_reliability_assessed", {
    level: readinessReliability.level,
    soften: readinessReliability.softenPredictions,
  });

  return {
    coachingModel,
    semantics,
    readinessReliability,
    certaintyTier,
    readinessBand: getReadinessBandFromScore(scorePct),
    longitudinal,
    longitudinalNarratives: governCoachingReportCopy(longitudinalNarratives, coachingModel),
    timing: timingV2,
    timingV2,
    clinicalJudgment,
    recommendations,
    dashboardFeed: {
      ...dashboardFeed,
      headline: governDashboardAiCopy(
        sanitizeCoachingNarrative(dashboardFeed.headline, coachingModel),
        pathwayId,
      ),
    },
    learnerState,
  };
}
