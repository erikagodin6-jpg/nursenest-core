import type { CatExamReport } from "@/lib/exams/cat-types";
import type { CatResultsCoachSnapshot } from "@/lib/practice-tests/cat-results-coach";
import type { PracticeTestConfigJson } from "@/lib/practice-tests/types";
import type { TopicTrendRow } from "@/lib/learner/topic-performance";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";
import {
  buildPostExamPerformanceReport,
  getReadinessBandFromScore,
  resolvePostExamSessionKind,
  type BuildPostExamPerformanceReportInput,
  type PostExamQuestionOutcome,
} from "@/lib/learner/post-exam-performance-report";
import { buildCoachingSemanticsCopy, loftSafeTrendLabel, resolveCoachingModel, sanitizeCoachingNarrative } from "@/lib/learner/post-exam-coaching/coaching-semantics";
import { validateCoachingCopyForPathway } from "@/lib/testing/testing-model";
import { buildStructuredClinicalInsights } from "@/lib/learner/post-exam-coaching/clinical-judgment-patterns";
import { buildLongitudinalContext } from "@/lib/learner/post-exam-coaching/longitudinal-memory";
import { orchestrateCoachingRecommendations } from "@/lib/learner/post-exam-coaching/recommendation-orchestrator";
import { assessReadinessReliability } from "@/lib/learner/post-exam-coaching/readiness-reliability";
import { buildQuestionTimingSignals, analyzeTimingIntelligence } from "@/lib/learner/post-exam-coaching/timing-intelligence";
import { buildDashboardFeed } from "@/lib/learner/post-exam-coaching/dashboard-feed";
import type { PostExamCoachingReport } from "@/lib/learner/post-exam-coaching/types";

export type BuildPostExamCoachingReportInput = BuildPostExamPerformanceReportInput & {
  topicTrends?: TopicTrendRow[];
  weakTopicRows?: WeakTopicRow[];
  recentSessionCount?: number;
  remediationUserId?: string | null;
  timingByQuestionId?: Record<string, { dwellMs?: number; answerChanges?: number; rereads?: number }>;
};

function confidenceVolatility(confidenceByQuestionId?: Record<string, "low" | "medium" | "high">): number {
  if (!confidenceByQuestionId) return 0;
  const vals = Object.values(confidenceByQuestionId);
  if (vals.length < 4) return 0;
  const highs = vals.filter((v) => v === "high").length / vals.length;
  const lows = vals.filter((v) => v === "low").length / vals.length;
  return Math.min(1, highs + lows);
}

export function buildPostExamCoachingReport(input: BuildPostExamCoachingReportInput): PostExamCoachingReport {
  const base = buildPostExamPerformanceReport(input);
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
    timingByQuestionId,
  } = input;

  const sessionKind = resolvePostExamSessionKind(config, pathwayId);
  const coachingModel = resolveCoachingModel(config, pathwayId, sessionKind);
  const semantics = buildCoachingSemanticsCopy(coachingModel, config, pathwayId);
  const catReport = results.catReport;
  const coach = results.catCoach;

  const weakLabels = base.weakTopics.map((t) => t.label);
  const { context: longitudinal, narratives: longitudinalNarratives } = buildLongitudinalContext({
    topicTrends,
    weakTopics: weakTopicRows,
    sessionWeakLabels: weakLabels,
    recentCompletedSessions: recentSessionCount,
  });

  const domainCount = base.competencyGroups.reduce((n, g) => n + g.rows.length, 0);
  const readinessReliability = assessReadinessReliability({
    coachingModel,
    totalQuestions: results.scoreTotal,
    domainCount,
    coach,
    catReport: catReport ?? null,
    confidenceVolatility: confidenceVolatility(confidenceByQuestionId),
    pacingAnomaly: base.timing.pacingLabel.includes("pressure") || base.timing.pacingLabel.includes("Hesitation"),
    sessionCompletedCleanly: true,
  });

  const signals = buildQuestionTimingSignals({
    outcomes: questionOutcomes,
    confidenceByQuestionId,
    timingByQuestionId,
  });
  const timing = analyzeTimingIntelligence({
    elapsedMs,
    totalQuestions: results.scoreTotal,
    timedMode,
    timeLimitSec,
    signals,
  });

  const extraDomains = catReport?.categoryBreakdown?.filter((c) => c.strength === "weak").map((c) => c.category) ?? [];
  const clinicalJudgment = buildStructuredClinicalInsights(coach?.errorPatterns ?? [], extraDomains);

  const recommendations = orchestrateCoachingRecommendations({
    coachingModel,
    sessionKind,
    pathwayId,
    weakTopicLabels: weakLabels,
    coach,
    remediationUserId,
  });

  const scorePct = base.overall.scorePct;
  const headline = sanitizeCoachingNarrative(base.headline, coachingModel, pathwayId);
  const dashboardFeed = buildDashboardFeed({
    pathwayId,
    coaching: {
      coachingModel,
      readinessReliability,
      recommendations,
      longitudinal,
    },
    readinessScore: scorePct,
    headline,
  });

  return {
    coachingModel,
    semantics,
    readinessReliability,
    readinessBand: getReadinessBandFromScore(scorePct),
    longitudinal,
    longitudinalNarratives: longitudinalNarratives.map((n) =>
      sanitizeCoachingNarrative(n, coachingModel, pathwayId),
    ),
    timing,
    clinicalJudgment,
    recommendations,
    dashboardFeed: {
      ...dashboardFeed,
      headline: sanitizeCoachingNarrative(dashboardFeed.headline, coachingModel, pathwayId),
    },
  };

  if (pathwayId) {
    validateCoachingCopyForPathway(
      pathwayId,
      [headline, ...longitudinalNarratives, dashboardFeed.headline].join(" "),
    );
  }
}

/** Merge coaching intelligence into a base performance report (single object for UI). */
export function attachCoachingToPerformanceReport(
  base: ReturnType<typeof buildPostExamPerformanceReport>,
  coaching: PostExamCoachingReport,
): typeof base & { coaching: PostExamCoachingReport } {
  const pathwayId = coaching.dashboardFeed.pathwayId;
  const trendSafe = loftSafeTrendLabel(base.overall.trendLabel, coaching.coachingModel, pathwayId);
  return {
    ...base,
    examModeLabel: coaching.semantics.examModeLabel,
    headline: coaching.dashboardFeed.headline,
    narrative: sanitizeCoachingNarrative(base.narrative, coaching.coachingModel, pathwayId),
    overall: {
      ...base.overall,
      trendLabel: trendSafe,
      passOutlookPct: coaching.readinessReliability.softenPredictions ? null : base.overall.passOutlookPct,
    },
    timing: {
      elapsedLabel: coaching.timing.elapsedLabel,
      avgSecPerQuestion: coaching.timing.avgSecPerQuestion,
      pacingLabel: coaching.timing.pacingLabel,
      pacingDetail: sanitizeCoachingNarrative(coaching.timing.pacingDetail, coaching.coachingModel, pathwayId),
      recommendations: coaching.timing.recommendations.map((r) =>
        sanitizeCoachingNarrative(r, coaching.coachingModel, pathwayId),
      ),
    },
    recommendations: coaching.recommendations.map((r) => ({
      priority: r.priority,
      title: r.title,
      reason: sanitizeCoachingNarrative(r.reason, coaching.coachingModel, pathwayId),
      href: r.href,
      kind:
        r.kind === "readiness_reassessment"
          ? "cat"
          : r.kind === "simulation"
            ? "simulation"
            : r.kind === "mechanism"
              ? "lesson"
              : r.kind === "flashcards"
                ? "flashcards"
                : r.kind === "drill"
                  ? "drill"
                  : r.kind === "lesson"
                    ? "lesson"
                    : "review",
    })),
    clinicalJudgment: coaching.clinicalJudgment.map((c) => ({
      domain: c.domain,
      pattern: c.patternLabel,
      guidance: sanitizeCoachingNarrative(c.guidance, coaching.coachingModel, pathwayId),
      emphasis: c.emphasis,
    })),
    coaching,
  };
}

export function buildEnrichedPostExamPerformanceReport(
  input: BuildPostExamCoachingReportInput,
): ReturnType<typeof attachCoachingToPerformanceReport> {
  const coaching = buildPostExamCoachingReport(input);
  const base = buildPostExamPerformanceReport(input);
  return attachCoachingToPerformanceReport(base, coaching);
}
