/**
 * Telemetry governance V5 — cognition-scoped analytics with canonical event families.
 */
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { captureOrchestratedAnalytics } from "@/lib/testing/psychometric-orchestrator";
import type { EducationalCognitionContext } from "@/lib/educational-cognition/educational-cognition-types";
import {
  logCognitionGovernanceViolation,
  type CognitionGovernanceViolation,
} from "@/lib/educational-cognition/governance-observability";

export const COGNITION_TELEMETRY_EVENTS = {
  cognitionContextResolved: "cognition_context_resolved",
  dashboardWidgetRendered: "dashboard_widget_rendered",
  remediationSequenceStarted: "remediation_sequence_started",
  readinessSurfaceOpened: "readiness_surface_opened",
  measurementInterpretationStarted: "measurement_interpretation_started",
  aiGovernanceBlocked: "ai_governance_blocked",
  psychometricViolationDetected: "psychometric_violation_detected",
} as const;

export type CognitionTelemetryEnvelope = {
  event: string;
  pathway_id: string;
  testing_model: string;
  cognition_capabilities: string;
  psychometric_style: string;
  remediation_style: string;
  readiness_band?: string;
  coaching_model: string;
  competency_id?: string;
  remediation_pathway?: string;
  learner_state_reason?: string;
  measurement_priority?: number;
  source_surface?: string;
  ontology_namespace?: string;
};

export function normalizeCognitionTelemetryProps(
  ctx: EducationalCognitionContext,
  props: Record<string, string | number | boolean | undefined> = {},
): Record<string, string | number | boolean | undefined> {
  const enabledCaps = Object.entries(ctx.capabilities)
    .filter(([, on]) => on)
    .map(([k]) => k)
    .join(",");

  const topCompetency = ctx.ontology.competencyIds[0];
  const remediationPathway = ctx.ontology.remediationPathwayIds[0];

  return {
    ...props,
    pathway_id: ctx.pathwayId,
    testing_model: ctx.psychometric.model,
    psychometric_style: ctx.psychometric.analytics.psychometricStyle,
    remediation_style: ctx.psychometric.analytics.remediationStyle,
    cognition_capabilities: enabledCaps,
    coaching_model: ctx.coachingModel,
    readiness_band: ctx.readinessResult?.band,
    dashboard_adaptive_plan: ctx.dashboard.showAdaptivePlan,
    competency_id: topCompetency,
    remediation_pathway: remediationPathway,
    learner_state_reason: ctx.measurement.learnerStateReason ?? undefined,
    measurement_priority: ctx.measurement.measurementPriorityScore || undefined,
    ontology_namespace: ctx.ontology.telemetryNamespaces.join(","),
    source_surface: props.source_surface ?? "cognition_orchestrator",
  };
}

export function captureCognitionOrchestratedEvent(
  ctx: EducationalCognitionContext,
  userId: string,
  entitlement: AccessScope,
  event: string,
  props: Record<string, string | number | boolean | undefined> = {},
): void {
  if (/^cat_/i.test(event) && ctx.psychometric.model === "LOFT") {
    const violation: CognitionGovernanceViolation = {
      code: "telemetry_semantic_drift",
      surface: "cognition_capture",
      pathwayId: ctx.pathwayId,
      detail: `Blocked ${event} on LOFT pathway`,
    };
    logCognitionGovernanceViolation(violation);
    captureOrchestratedAnalytics(
      userId,
      entitlement,
      COGNITION_TELEMETRY_EVENTS.psychometricViolationDetected,
      normalizeCognitionTelemetryProps(ctx, { blocked_event: event, ...props }),
    );
    return;
  }
  captureOrchestratedAnalytics(userId, entitlement, event, normalizeCognitionTelemetryProps(ctx, props));
}

/** Server-side resolution hook — no entitlement required for anonymous pathway probes. */
export function recordCognitionContextResolved(
  ctx: EducationalCognitionContext,
  userId: string | null,
): void {
  if (!userId?.trim()) return;
}
