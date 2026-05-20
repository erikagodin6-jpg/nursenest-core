import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";
import { orchestrateEducationalGraph } from "@/lib/educational-graph/educational-graph-orchestrator";
import { maxGraphStepsForSurface } from "@/lib/educational-graph/graph-surface-caps";
import type { RnCoachingIntelligenceReport } from "@/lib/learner/rn-coaching-intelligence/coaching-types";
import { governCoachingReportCopy } from "@/lib/learner/rn-coaching-intelligence/ai-coaching-governance";
import { summarizeReasoningForUi } from "@/lib/learner/rn-coaching-intelligence/reasoning-insights-ui";
import { recordCoachingTelemetry } from "@/lib/learner/rn-coaching-intelligence/coaching-telemetry";

/**
 * Psychometric-safe context envelope for AI tutoring (no guaranteed-pass language).
 */
export type AiTutorContextEnvelope = {
  pathwayId: string | null;
  coachingModel: RnCoachingIntelligenceReport["coachingModel"];
  certaintyTier: RnCoachingIntelligenceReport["certaintyTier"];
  readinessReliability: RnCoachingIntelligenceReport["readinessReliability"]["level"];
  softenPredictions: boolean;
  persistentWeakTopics: string[];
  reasoningFocusAreas: { pattern: string; guidance: string }[];
  timingCoachingLines: string[];
  remediationPriorities: { title: string; href: string; reason: string }[];
  /** Canonical EduGraphStep[] — sole traversal authority for AI tutor (no parallel planner maps). */
  graphSteps: readonly EduGraphStep[];
  measurementGaps: string[];
  tutoringPlanSummary: string;
};

export function buildAiTutorContextEnvelope(
  report: RnCoachingIntelligenceReport,
): AiTutorContextEnvelope {
  const reasoning = summarizeReasoningForUi(report.clinicalJudgment).filter((r) => r.emphasis === "focus");
  const measurementGaps =
    report.learnerState?.measurementWeaknesses?.slice(0, 5) ??
    report.longitudinal.persistentWeakTopics.slice(0, 3);

  const lines = governCoachingReportCopy(
    [
      report.readinessReliability.guidance,
      ...report.timingV2.coachingNarratives.slice(0, 3),
      ...report.longitudinalNarratives.slice(0, 2),
    ],
    report.coachingModel,
  );

  const pathwayId = report.dashboardFeed.pathwayId;
  const fatigue = report.learnerState?.remediationFatigueScore ?? 0;
  const weakTopics = report.longitudinal.persistentWeakTopics.slice(0, 3);
  const graphSteps: EduGraphStep[] = [];
  const seenHref = new Set<string>();

  for (const topicSlug of weakTopics.length ? weakTopics : ["prioritization"]) {
    const traversal = orchestrateEducationalGraph({
      topicSlug,
      pathwayId,
      sourceSurface: "ai_tutor",
      coachingModel: report.coachingModel,
      learnerState: report.learnerState,
      persistentWeakTopics: report.longitudinal.persistentWeakTopics,
      maxSteps: maxGraphStepsForSurface("ai_tutor", { fatigueScore: fatigue }),
    });
    for (const step of traversal.steps) {
      if (seenHref.has(step.href)) continue;
      seenHref.add(step.href);
      graphSteps.push(step);
    }
  }

  const primaryStep = graphSteps[0];
  const fallbackRec = report.recommendations[0];
  const tutoringPlanSummary = primaryStep
    ? `Start with ${primaryStep.title}: ${primaryStep.description}`
    : fallbackRec
      ? `Start with ${fallbackRec.title}: ${fallbackRec.reason}`
      : "Review weakest competency with mechanism content, then timed practice.";

  const remediationPriorities =
    graphSteps.length > 0
      ? graphSteps.slice(0, 4).map((s) => ({
          title: s.title,
          href: s.href,
          reason: s.description,
        }))
      : report.recommendations.slice(0, 4).map((r) => ({
          title: r.title,
          href: r.href,
          reason: r.reason,
        }));

  recordCoachingTelemetry("ai_tutor_envelope_built", {
    graph_step_count: graphSteps.length,
    weak_topic_count: weakTopics.length,
    pathway_id: pathwayId ?? "unknown",
  });

  return {
    pathwayId: report.dashboardFeed.pathwayId,
    coachingModel: report.coachingModel,
    certaintyTier: report.certaintyTier,
    readinessReliability: report.readinessReliability.level,
    softenPredictions: report.readinessReliability.softenPredictions,
    persistentWeakTopics: report.longitudinal.persistentWeakTopics,
    reasoningFocusAreas: reasoning.map((r) => ({
      pattern: r.patternLabel,
      guidance: r.guidance,
    })),
    timingCoachingLines: lines,
    remediationPriorities,
    graphSteps,
    measurementGaps,
    tutoringPlanSummary: governCoachingReportCopy([tutoringPlanSummary], report.coachingModel)[0] ?? tutoringPlanSummary,
  };
}
