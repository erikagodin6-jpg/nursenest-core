/**
 * Telemetry governance V5 — canonical educational cognition orchestration payloads.
 */
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { EducationalCognitionContext } from "@/lib/educational-cognition/educational-cognition-types";
import { captureCognitionOrchestratedEvent } from "@/lib/educational-cognition/cognition-telemetry-governance";
import { deriveTimingRiskBand } from "@/lib/educational-cognition/timing-cognition";
import { normalizeCognitionTelemetryProps } from "@/lib/educational-cognition/cognition-telemetry-governance";
import { recordCoachingTelemetry } from "@/lib/learner/rn-coaching-intelligence/coaching-telemetry";
import { mergeCoachingPropsWithGraphLineage } from "@/lib/learner/rn-coaching-intelligence/coaching-graph-telemetry-bridge";
import { buildGraphLineageEnvelope } from "@/lib/educational-graph/graph-lineage-envelope";
import { getTestingModelForPathwayId } from "@/lib/testing/testing-model-pathway-map";
import {
  buildCognitionVersionMetadata,
  cognitionVersionTelemetryProps,
} from "@/lib/educational-cognition/cognition-version-governance";
import {
  filterCognitionTelemetryProps,
  partitionTelemetrySurface,
  type TelemetrySurface,
} from "@/lib/educational-cognition/telemetry-isolation-governance";
import { buildCognitionTelemetryLineage } from "@/lib/educational-cognition/cognition-telemetry-lineage";
import {
  buildCognitionExplainability,
  serializeExplainabilityForAudit,
} from "@/lib/educational-cognition/cognition-explainability";

export type CognitionTelemetryV5Payload = {
  learner_state_version: number;
  competency_id?: string;
  cognition_capabilities: string;
  remediation_pathway?: string;
  timing_risk_band: string;
  readiness_band?: string;
  measurement_priority: number;
  fatigue_score: number;
  source_surface: string;
  ontology_namespace: string;
  pathway_id: string;
  coaching_model: string;
};

export function buildCognitionTelemetryV5Payload(
  ctx: EducationalCognitionContext,
  sourceSurface: string,
  extra: Partial<CognitionTelemetryV5Payload> = {},
): CognitionTelemetryV5Payload {
  const enabledCaps = Object.entries(ctx.capabilities)
    .filter(([, on]) => on)
    .map(([k]) => k)
    .join(",");

  const primaryWeak = ctx.learnerState.competencyStates.find((c) => c.persistentWeak || c.masteryScore < 55);

  return {
    learner_state_version: ctx.learnerState.version,
    competency_id: extra.competency_id ?? primaryWeak?.competencyId,
    cognition_capabilities: enabledCaps,
    remediation_pathway: extra.remediation_pathway ?? ctx.ontology.remediationPathwayIds[0],
    timing_risk_band: deriveTimingRiskBand(ctx.learnerState),
    readiness_band: ctx.readinessResult?.band ?? extra.readiness_band,
    measurement_priority: ctx.measurement.measurementPriorityScore,
    fatigue_score: ctx.learnerState.remediationFatigueScore,
    source_surface: sourceSurface,
    ontology_namespace: ctx.ontology.telemetryNamespaces.join(","),
    pathway_id: ctx.pathwayId,
    coaching_model: ctx.coachingModel,
    ...extra,
  };
}

export function emitCognitionTelemetryV5(
  ctx: EducationalCognitionContext,
  event:
    | "cognition_context_resolved"
    | "dashboard_sequence_rendered"
    | "study_plan_generated"
    | "remediation_path_opened"
    | "timing_risk_detected"
    | "readiness_reliability_assessed"
    | "measurement_reasoning_path_opened"
    | "ai_tutoring_context_generated",
  sourceSurface: string,
  props: Record<string, string | number | boolean | null> = {},
): void {
  const v5 = buildCognitionTelemetryV5Payload(ctx, sourceSurface);
  const versionMeta = cognitionVersionTelemetryProps(buildCognitionVersionMetadata());
  const explainAudit = serializeExplainabilityForAudit(
    buildCognitionExplainability({
      ctx,
      primaryReason:
        typeof props.recommendation_reason === "string" ? props.recommendation_reason : undefined,
    }),
  );
  const telemetrySurface: TelemetrySurface = sourceSurface.startsWith("/")
    ? partitionTelemetrySurface(sourceSurface)
    : "learner_authenticated";
  const normalizedProps = Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== null),
  ) as Record<string, string | number | boolean | undefined>;
  const lineage = buildCognitionTelemetryLineage({
    surface: telemetrySurface,
    event,
    pathwayId: ctx.pathwayId,
    version: buildCognitionVersionMetadata(),
    extra: {
      ...normalizeCognitionTelemetryProps(ctx, normalizedProps),
      ...v5,
      ...versionMeta,
      ...explainAudit,
      source_surface: sourceSurface,
    },
  });
  const graphLineage = buildGraphLineageEnvelope({
    pathwayId: ctx.pathwayId,
    sourceSurface,
    testingModel: ctx.psychometric.model ?? getTestingModelForPathwayId(ctx.pathwayId),
    topicSlug: typeof props.topic_slug === "string" ? props.topic_slug : undefined,
  });
  const merged = filterCognitionTelemetryProps({
    ...lineage.props,
    ...mergeCoachingPropsWithGraphLineage(event, lineage.props, graphLineage),
  });
  recordCoachingTelemetry(event, merged);
}

export function recordCognitionContextResolved(
  ctx: EducationalCognitionContext,
  userId: string | null,
): void {
  emitCognitionTelemetryV5(ctx, "cognition_context_resolved", "cognition_resolver", {
    user_id: userId,
  });
}

/** Entitlement-aware server capture for dashboard, report card, adaptive, and study-plan surfaces. */
export function recordCognitionContextResolvedWithEntitlement(
  ctx: EducationalCognitionContext,
  userId: string | null,
  entitlement: AccessScope | null | undefined,
  sourceSurface: string,
): void {
  emitCognitionTelemetryV5(ctx, "cognition_context_resolved", sourceSurface, {
    learner_authenticated: Boolean(userId?.trim()),
  });
  if (userId?.trim() && entitlement?.hasAccess) {
    captureCognitionOrchestratedEvent(
      ctx,
      userId,
      entitlement,
      "cognition_context_resolved",
      { source_surface: sourceSurface },
    );
  }
}
