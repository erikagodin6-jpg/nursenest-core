/**
 * Approved surface adapters — all measurement display + AI copy routes through the orchestrator boundary.
 * Do not add parallel interpretation or remediation paths; compose from clinical-measurement-orchestrator exports only.
 */
import type { MeasurementSystem } from "@/lib/measurements/measurement-domain";
import {
  governAiNarrativeForMeasurement,
  resolveGovernedMeasurementText,
  type MeasurementSourceSurface,
} from "@/lib/measurements/clinical-measurement-orchestrator";
import type { AiGenerationSurface } from "@/lib/measurements/measurement-ai-boundary";
import {
  buildMeasurementOrchestrationTelemetry,
  trackMeasurementOrchestrationEvent,
} from "@/lib/measurements/measurement-analytics";
import { loftSafeTrendLabel } from "@/lib/learner/rn-coaching-intelligence/coaching-semantics";
import type { CoachingModel } from "@/lib/learner/rn-coaching-intelligence/coaching-types";

export const CNPLE_LOFT_PATHWAY_ID = "ca-np-cnple";

export type MeasurementSurfaceConvergenceContext = {
  measurementSystem: MeasurementSystem;
  pathwayId?: string | null;
  countryCode?: string | null;
  loftSafe?: boolean;
  aiSurface: AiGenerationSurface;
  sourceSurface?: MeasurementSourceSurface;
};

export function governMeasurementSurfaceCopy(
  text: string,
  ctx: MeasurementSurfaceConvergenceContext,
): string {
  if (!text?.trim()) return text;
  const tokenResolved = resolveGovernedMeasurementText({
    text,
    measurementSystem: ctx.measurementSystem,
    pathwayId: ctx.pathwayId,
    countryCode: ctx.countryCode,
    loftSafe: ctx.loftSafe,
  });
  return governAiNarrativeForMeasurement({
    text: tokenResolved,
    surface: ctx.aiSurface,
    pathwayId: ctx.pathwayId,
  });
}

export function loftCaseConvergenceContext(
  measurementSystem: MeasurementSystem,
  pathwayId: string | null = CNPLE_LOFT_PATHWAY_ID,
): MeasurementSurfaceConvergenceContext {
  return {
    measurementSystem,
    pathwayId,
    countryCode: "CA",
    loftSafe: true,
    aiSurface: "loft_review",
    sourceSurface: "loft",
  };
}

export function governLoftCaseCopy(
  text: string,
  measurementSystem: MeasurementSystem,
  pathwayId?: string | null,
): string {
  return governMeasurementSurfaceCopy(text, loftCaseConvergenceContext(measurementSystem, pathwayId));
}

export function ecgDrillConvergenceContext(
  measurementSystem: MeasurementSystem = "SI",
  pathwayId?: string | null,
): MeasurementSurfaceConvergenceContext {
  return {
    measurementSystem,
    pathwayId: pathwayId ?? null,
    aiSurface: "interpretation_explainer",
    sourceSurface: "labs",
  };
}

export function governEcgDrillCopy(
  text: string,
  measurementSystem: MeasurementSystem = "SI",
  pathwayId?: string | null,
): string {
  return governMeasurementSurfaceCopy(text, ecgDrillConvergenceContext(measurementSystem, pathwayId));
}

export function governDashboardAiCopy(
  text: string,
  pathwayId?: string | null,
  measurementSystem: MeasurementSystem = "SI",
): string {
  return governMeasurementSurfaceCopy(text, {
    measurementSystem,
    pathwayId,
    aiSurface: "dashboard_summary",
    sourceSurface: "dashboard",
  });
}

export function governStudyPlanCopy(
  text: string,
  pathwayId?: string | null,
  measurementSystem: MeasurementSystem = "SI",
): string {
  return governMeasurementSurfaceCopy(text, {
    measurementSystem,
    pathwayId,
    aiSurface: "study_plan",
    sourceSurface: "dashboard",
  });
}

export function governPdfExportCopy(
  text: string,
  pathwayId?: string | null,
  measurementSystem: MeasurementSystem = "SI",
): string {
  return governMeasurementSurfaceCopy(text, {
    measurementSystem,
    pathwayId,
    aiSurface: "coaching",
    sourceSurface: "export",
  });
}

/** LOFT simulation — psychometric-safe vital trend phrasing (no answer-leaking direction cues). */
export function loftSafeVitalTrendDisplay(
  trend: "improving" | "worsening" | "stable",
  simulationMode: boolean,
  coachingModel: CoachingModel = "loft_readiness",
): string | null {
  if (!simulationMode) return trend;
  const raw =
    trend === "worsening"
      ? "Serial values changed — reassess before acting"
      : trend === "improving"
        ? "Serial values changed — reassess before acting"
        : "stable";
  return loftSafeTrendLabel(raw, coachingModel) ?? "Serial change noted — interpret in context";
}

export function trackSurfaceOrchestrationTelemetry(args: {
  event:
    | "interpretation_viewed"
    | "interpretation_completed"
    | "trend_path_opened"
    | "remediation_triggered"
    | "bedside_escalation_reviewed"
    | "monitoring_sequence_started"
    | "reassessment_path_started";
  sourceSurface: MeasurementSourceSurface;
  pathwayId?: string | null;
  competencyId?: string | null;
  interpretationId?: string | null;
  learnerStateReason?: string | null;
}): void {
  void trackMeasurementOrchestrationEvent(
    buildMeasurementOrchestrationTelemetry({
      event: args.event,
      surface: args.sourceSurface,
      pathwayId: args.pathwayId,
      competencyId: args.competencyId,
      interpretationId: args.interpretationId,
      learnerStateReason: args.learnerStateReason ?? undefined,
    }),
  );
}
