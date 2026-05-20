/**
 * Measurement orchestration analytics — canonical events + metadata.
 */
import type { ClinicalMeasurementSystem, MeasurementContext } from "@/lib/measurements/measurement-domain";

export type MeasurementAnalyticsEvent =
  | "measurement_preference_set"
  | "measurement_toggle_session"
  | "measurement_pathway_mismatch"
  | "interpretation_viewed"
  | "interpretation_completed"
  | "trend_path_opened"
  | "remediation_triggered"
  | "bedside_escalation_reviewed"
  | "ai_measurement_guardrail_blocked"
  | "monitoring_sequence_started"
  | "reassessment_path_started"
  | "measurement_hint_viewed"
  | "measurement_interpretation_opened"
  | "measurement_conversion_friction"
  | "measurement_trend_engagement"
  | "measurement_interpretation_difficulty"
  | "measurement_unsafe_render_detected"
  | "measurement_ai_semantic_flag"
  | "measurement_remediation_signal";

export type MeasurementOrchestrationTelemetry = {
  event: MeasurementAnalyticsEvent;
  pathwayId?: string | null;
  instructionalSystem?: ClinicalMeasurementSystem;
  renderedSystem?: ClinicalMeasurementSystem;
  measurementContext?: MeasurementContext;
  surface?: string;
  competencyId?: string | null;
  interpretationId?: string | null;
  trendSeverity?: string;
  learnerStateReason?: string;
  monitoringPriority?: number;
  remediationPriority?: number;
  governanceIssueCode?: string;
  mismatchInstructional?: boolean;
};

export type MeasurementAnalyticsPayload = MeasurementOrchestrationTelemetry;

export function buildMeasurementOrchestrationTelemetry(
  args: MeasurementOrchestrationTelemetry,
): MeasurementOrchestrationTelemetry {
  return { ...args };
}

/** @deprecated Use buildMeasurementOrchestrationTelemetry */
export function buildMeasurementAnalyticsPayload(
  args: MeasurementOrchestrationTelemetry & {
    event: MeasurementAnalyticsEvent;
  },
): MeasurementAnalyticsPayload {
  return buildMeasurementOrchestrationTelemetry(args);
}

export async function trackMeasurementOrchestrationEvent(
  payload: MeasurementOrchestrationTelemetry,
): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const { trackClientEvent } = await import("@/lib/observability/posthog-client");
    await trackClientEvent(payload.event, {
      pathway_id: payload.pathwayId ?? undefined,
      instructional_system: payload.instructionalSystem,
      rendered_system: payload.renderedSystem,
      measurement_context: payload.measurementContext,
      surface: payload.surface,
      competency_id: payload.competencyId ?? undefined,
      interpretation_id: payload.interpretationId ?? undefined,
      trend_severity: payload.trendSeverity,
      learner_state_reason: payload.learnerStateReason,
      monitoring_priority: payload.monitoringPriority,
      remediation_priority: payload.remediationPriority,
      governance_issue_code: payload.governanceIssueCode,
      mismatch_instructional: payload.mismatchInstructional ?? false,
    });
  } catch {
    /* optional telemetry */
  }
}

/** @deprecated Use trackMeasurementOrchestrationEvent */
export async function trackMeasurementAnalytics(
  payload: MeasurementAnalyticsPayload,
): Promise<void> {
  return trackMeasurementOrchestrationEvent(payload);
}
