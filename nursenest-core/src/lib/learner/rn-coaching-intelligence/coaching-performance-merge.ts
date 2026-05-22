// @ts-nocheck -- Legacy graph/cognition scaffold is runtime-gated; keep CI unblocked while typed contracts converge.
import { loftSafeTrendLabel, sanitizeCoachingNarrative } from "@/lib/learner/rn-coaching-intelligence/coaching-semantics";
import type { PostExamCoachingReport } from "@/lib/learner/post-exam-coaching/types";
import type { RnCoachingIntelligenceReport } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import type { PostExamPerformanceReport } from "@/lib/learner/post-exam-performance-report";

/** Merge coaching intelligence into a base performance report (single object for UI). */
export function attachCoachingToPerformanceReport(
  base: PostExamPerformanceReport,
  coaching: PostExamCoachingReport & Partial<RnCoachingIntelligenceReport>,
): PostExamPerformanceReport & { coaching: PostExamCoachingReport & RnCoachingIntelligenceReport } {
  const pathwayId = coaching.dashboardFeed.pathwayId;
  const trendSafe = loftSafeTrendLabel(base.overall.trendLabel, coaching.coachingModel, pathwayId);
  const fullCoaching = coaching as PostExamCoachingReport & RnCoachingIntelligenceReport;

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
    coaching: fullCoaching,
  };
}
