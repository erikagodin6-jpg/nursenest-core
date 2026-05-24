import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import { EMPTY_LEARNER_STATE } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import type {
  CognitionReliabilityTier,
  DurableLearnerCognitionEnvelope,
} from "@/lib/educational-cognition/cognition-snapshot-types";
import { buildFreshCognitionEnvelope } from "@/lib/educational-cognition/cognition-snapshot-migrations";
import { inferReliabilityFromPersistSource } from "@/lib/educational-cognition/cognition-reliability";
import {
  buildCognitionVersionMetadata,
  GRAPH_VERSION,
} from "@/lib/educational-cognition/cognition-version-governance";
import type {
  CognitionContinuityLineage,
  CognitionEnvelopeGovernanceMetadata,
  CognitionHydrationProvenance,
} from "@/lib/educational-cognition/cognition-snapshot-types";

export type CognitionHydrationMode = "full" | "partial" | "degraded" | "fresh";

export type CognitionHydrationResult = {
  snapshot: RnLearnerStateSnapshot;
  envelope: DurableLearnerCognitionEnvelope | null;
  mode: CognitionHydrationMode;
  stale: boolean;
  reliability: CognitionReliabilityTier;
  warnings: string[];
};

function isStale(envelope: DurableLearnerCognitionEnvelope): boolean {
  const staleMs = envelope.staleAfterMs ?? 7 * 24 * 60 * 60 * 1000;
  const age = Date.now() - new Date(envelope.updatedAt).getTime();
  return age > staleMs;
}

/**
 * Governed hydration — partial recovery, stale detection, pathway drift handling.
 */
export function governCognitionHydration(args: {
  userId: string | null | undefined;
  pathwayId: string | null;
  stored: DurableLearnerCognitionEnvelope | null;
  fromDatabase?: boolean;
  fingerprintMatch?: boolean;
}): CognitionHydrationResult {
  const warnings: string[] = [];
  const pathwayId = (args.pathwayId ?? "").trim() || null;

  if (!args.userId) {
    const snapshot = EMPTY_LEARNER_STATE(pathwayId);
    return {
      snapshot,
      envelope: null,
      mode: "fresh",
      stale: false,
      reliability: "ephemeral",
      warnings,
    };
  }

  if (!args.stored) {
    const snapshot = EMPTY_LEARNER_STATE(pathwayId);
    const envelope = buildFreshCognitionEnvelope(snapshot, "inferred");
    return {
      snapshot,
      envelope,
      mode: "fresh",
      stale: false,
      reliability: "inferred",
      warnings,
    };
  }

  const stale = isStale(args.stored);
  if (stale) warnings.push("cognition_envelope_stale");

  const pathwayDrift =
    pathwayId != null &&
    args.stored.pathwayId != null &&
    args.stored.pathwayId !== pathwayId;
  if (pathwayDrift) warnings.push("pathway_drift_partial_hydration");

  const reliability = inferReliabilityFromPersistSource({
    fromDatabase: args.fromDatabase ?? false,
    fingerprintMatch: args.fingerprintMatch ?? true,
    hasUserId: true,
  });

  let snapshot = args.stored.snapshot;
  if (pathwayDrift && pathwayId) {
    snapshot = { ...snapshot, pathwayId };
    warnings.push("snapshot_pathway_realigned");
  }

  const mode: CognitionHydrationMode = stale
    ? "degraded"
    : pathwayDrift
      ? "partial"
      : warnings.length > 0
        ? "partial"
        : "full";

  const hydrationProvenance: CognitionHydrationProvenance = {
    mode,
    fromDatabase: args.fromDatabase ?? false,
    fingerprintMatch: args.fingerprintMatch ?? true,
    warnings: [...warnings],
    hydratedAt: new Date().toISOString(),
  };

  const envelope: DurableLearnerCognitionEnvelope = {
    ...args.stored,
    snapshot,
    cognitionReliability: reliability,
    hydrationProvenance,
    continuityLineage: buildContinuityLineage(args.stored),
    governance: buildEnvelopeGovernanceMetadata({
      envelope: args.stored,
      hydrationState: mode,
      reliabilityTier: reliability,
    }),
  };

  return {
    snapshot,
    envelope,
    mode,
    stale,
    reliability,
    warnings,
  };
}

function buildContinuityLineage(
  stored: DurableLearnerCognitionEnvelope,
): CognitionContinuityLineage {
  const g = stored.graphContinuity;
  return {
    graphVersion: g?.graphVersion ?? GRAPH_VERSION,
    lastCheckpointAt: g?.graphCheckpointAt ?? null,
    remediationReturnHref: g?.remediationReturnHref ?? null,
    adaptiveAnchorHref: g?.adaptiveAnchorHref ?? null,
  };
}

export function buildEnvelopeGovernanceMetadata(args: {
  envelope: DurableLearnerCognitionEnvelope | null;
  hydrationState: CognitionHydrationMode;
  reliabilityTier: CognitionReliabilityTier;
}): CognitionEnvelopeGovernanceMetadata {
  const version = buildCognitionVersionMetadata({
    envelopeVersion: args.envelope?.cognitionSnapshotVersion,
    migrationPath: args.envelope?.migrationPath ?? null,
  });
  return {
    cognitionSchemaVersion: version.cognitionSchemaVersion,
    envelopeVersion: version.envelopeVersion,
    ontologyRevision: version.ontologyRevision,
    graphVersion: version.graphVersion,
    migrationPath: version.migrationPath,
    hydrationState: args.hydrationState,
    reliabilityTier: args.reliabilityTier,
  };
}

export function mergeOptimisticCognitionUpdate(
  local: RnLearnerStateSnapshot,
  server: RnLearnerStateSnapshot,
): RnLearnerStateSnapshot {
  if (server.updatedAt >= local.updatedAt) return server;
  return local;
}
