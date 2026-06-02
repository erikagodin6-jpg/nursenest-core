import "server-only";

import type { DurableLearnerCognitionEnvelope } from "@/lib/educational-cognition/cognition-snapshot-types";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { cognitionVersionTelemetryProps } from "@/lib/educational-cognition/cognition-version-governance";
import { versionMetadataForEnvelope } from "@/lib/educational-cognition/prepare-durable-cognition-envelope";

export type LongitudinalCognitionEvent =
  | "competency_progression_sample"
  | "remediation_velocity_sample"
  | "continuity_interruption"
  | "recommendation_adherence_proxy"
  | "cognition_repair_observed"
  | "ontology_migration_impact"
  | "persistence_degradation_sample"
  | "graph_traversal_depth_sample";

/** Educator-safe bounded props — no learner id, no raw envelope. */
export function buildLongitudinalObservabilityProps(
  envelope: DurableLearnerCognitionEnvelope,
): Record<string, string | number | boolean> {
  const weak = envelope.snapshot.competencyStates.filter((c) => c.persistentWeak).length;
  const total = envelope.snapshot.competencyStates.length || 1;
  return {
    ...cognitionVersionTelemetryProps(versionMetadataForEnvelope(envelope)),
    integrity_tier: envelope.integrityTier ?? "unknown",
    weak_competency_rate: Math.round((weak / total) * 100) / 100,
    remediation_continuity: envelope.longitudinal?.remediationContinuityCount ?? 0,
    graph_depth: envelope.graphContinuity?.remediationPathwayIds.length ?? 0,
    repair_observed: Boolean(envelope.repairReport?.repaired),
    readiness_momentum: envelope.snapshot.readinessMomentum ?? 0,
    cognition_reliability: envelope.cognitionReliability,
  };
}

export function emitLongitudinalCognitionObservation(
  envelope: DurableLearnerCognitionEnvelope,
  event: LongitudinalCognitionEvent,
  extra: Record<string, string | number | boolean> = {},
): void {
  safeServerLog("educational_cognition_longitudinal", event, {
    ...buildLongitudinalObservabilityProps(envelope),
    ...extra,
  });
}
