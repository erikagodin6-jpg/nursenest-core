import type { EduGraphStep } from "@/lib/educational-graph/graph-step-contract";
import type { EducationalCognitionContext } from "@/lib/educational-cognition/educational-cognition-types";
import { governCoachingReportCopy } from "@/lib/learner/rn-coaching-intelligence/ai-coaching-governance";
import type { AiTutorContextEnvelope } from "@/lib/learner/rn-coaching-intelligence/ai-tutor-context-envelope";
import { buildAiTutorContextEnvelope } from "@/lib/learner/rn-coaching-intelligence/ai-tutor-context-envelope";
import type { TutoringPromptContext } from "@/lib/ai-tutor/types";
import { deriveTimingCognitionSignals } from "@/lib/educational-cognition/timing-cognition";
import { emitCognitionTelemetryV5 } from "@/lib/educational-cognition/cognition-telemetry-v5";

/**
 * AI tutoring envelope from full cognition context + graph steps (not report-only).
 */
export function buildAiTutorContextFromCognition(
  ctx: EducationalCognitionContext,
  graphSteps: readonly EduGraphStep[],
): AiTutorContextEnvelope {
  const timing = deriveTimingCognitionSignals({ learnerState: ctx.learnerState });
  const base: AiTutorContextEnvelope = ctx.coachingReport
    ? buildAiTutorContextEnvelope(ctx.coachingReport)
    : {
        pathwayId: ctx.pathwayId,
        coachingModel: ctx.coachingModel,
        certaintyTier: "directional",
        readinessReliability: ctx.readinessResult ? "moderate" : "low",
        softenPredictions: !ctx.readinessSemantics.allowsPassOutlook,
        persistentWeakTopics: ctx.learnerState.competencyStates
          .filter((c) => c.persistentWeak)
          .map((c) => c.competencyId.replace(/_/g, " ")),
        reasoningFocusAreas: ctx.learnerState.reasoningPatterns.map((p) => ({
          pattern: p.replace(/_/g, " "),
          guidance: "Reinforce clinical reasoning in this pattern before expanding scope.",
        })),
        timingCoachingLines: [],
        remediationPriorities: graphSteps.slice(0, 4).map((s) => ({
          title: s.title,
          href: s.href,
          reason: s.description,
        })),
        graphSteps,
        measurementGaps: ctx.learnerState.measurementWeaknesses.slice(0, 5),
        tutoringPlanSummary: graphSteps[0]
          ? `Begin with ${graphSteps[0].title}: ${graphSteps[0].description}`
          : "Review weakest competency with mechanism content, then timed practice.",
      };

  const lines = governCoachingReportCopy(
    [
      base.tutoringPlanSummary,
      timing.riskBand !== "low"
        ? "Pacing signals suggest shorter focused blocks with consolidation between sessions."
        : "",
      ctx.measurement.learnerStateReason ?? "",
    ].filter(Boolean),
    ctx.coachingModel,
  );

  const envelope: AiTutorContextEnvelope = {
    ...base,
    tutoringPlanSummary: lines[0] ?? base.tutoringPlanSummary,
    timingCoachingLines: [...base.timingCoachingLines, ...lines.slice(1)].slice(0, 4),
    remediationPriorities:
      graphSteps.length > 0
        ? graphSteps.slice(0, 4).map((s) => ({
            title: s.title,
            href: s.href,
            reason: s.description,
          }))
        : base.remediationPriorities,
    graphSteps: graphSteps.length > 0 ? graphSteps : (base.graphSteps ?? []),
    measurementGaps:
      base.measurementGaps.length > 0 ? base.measurementGaps : ctx.ontology.measurementWeaknessTags.slice(0, 5),
  };

  emitCognitionTelemetryV5(ctx, "ai_tutoring_context_generated", "ai_tutor", {
    graph_step_count: graphSteps.length,
    timing_risk_band: timing.riskBand,
  });

  return envelope;
}

/** Tutoring provider input — graph step ordering is authoritative when present. */
export function tutoringPromptContextFromAiEnvelope(
  envelope: AiTutorContextEnvelope,
  partial: Omit<TutoringPromptContext, "graphSteps">,
): TutoringPromptContext {
  return {
    ...partial,
    entitlementSnapshot: {
      ...partial.entitlementSnapshot,
      pathwayId: partial.entitlementSnapshot.pathwayId || envelope.pathwayId,
    },
    graphSteps: envelope.graphSteps,
  };
}
