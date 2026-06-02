import type { DurableLearnerCognitionEnvelope } from "@/lib/educational-cognition/cognition-snapshot-types";
import { EDUCATIONAL_ONTOLOGY_NAMESPACE } from "@/lib/educational-graph/unified-educational-substrate";
import { assessCognitionEnvelopeIntegrity } from "@/lib/educational-cognition/cognition-envelope-integrity";
import { migrateCognitionEnvelopeFromStorage } from "@/lib/educational-cognition/cognition-snapshot-migrations";
import { repairDurableLearnerCognitionEnvelope } from "@/lib/educational-cognition/repair-durable-learner-cognition-envelope";
import {
  buildCognitionVersionMetadata,
  cognitionVersionTelemetryProps,
} from "@/lib/educational-cognition/cognition-version-governance";
import { pruneStaleGraphContinuity } from "@/lib/educational-cognition/graph-next-step-continuity";
import { applyOntologyLifecycleToEnvelope } from "@/lib/educational-cognition/ontology-lifecycle-governance";
import { emitLongitudinalCognitionObservation } from "@/lib/educational-cognition/cognition-longitudinal-observability";

export type PreparedCognitionEnvelope = {
  envelope: DurableLearnerCognitionEnvelope | null;
  migrationPath: string | null;
  integrityTier: DurableLearnerCognitionEnvelope["integrityTier"];
  repairOperations: string[];
};

/**
 * Full durable envelope pipeline: migrate → integrity → repair → continuity prune.
 */
export function prepareDurableCognitionEnvelope(
  raw: unknown,
  fallbackPathwayId: string | null,
): PreparedCognitionEnvelope {
  const migrated = raw != null ? migrateCognitionEnvelopeFromStorage(raw, fallbackPathwayId) : null;
  const migrationPath = migrated
    ? raw != null && typeof raw === "object" && "version" in (raw as object) && (raw as { version?: number }).version === 1
      ? "legacy_v1_server_envelope"
      : migrated.cognitionSnapshotVersion < 2
        ? "snapshot_v1_to_v2"
        : "current"
    : null;

  const integrity = assessCognitionEnvelopeIntegrity(raw, fallbackPathwayId);
  let envelope = integrity.envelope;
  if (!envelope) {
    return {
      envelope: null,
      migrationPath,
      integrityTier: integrity.tier,
      repairOperations: [],
    };
  }

  envelope = {
    ...envelope,
    ontologyRevision: EDUCATIONAL_ONTOLOGY_NAMESPACE,
    integrityTier: integrity.tier,
    integrityChecksum: integrity.checksum,
    migrationPath,
  };

  if (envelope.graphContinuity) {
    envelope = {
      ...envelope,
      graphContinuity: pruneStaleGraphContinuity(envelope.graphContinuity),
    };
  }

  const { envelope: repaired, report } = repairDurableLearnerCognitionEnvelope(envelope);
  const lifecycle = applyOntologyLifecycleToEnvelope(repaired);
  const tier =
    report.repaired && integrity.tier === "valid"
      ? "repaired"
      : integrity.tier === "corrupted"
        ? "corrupted"
        : integrity.tier;

  const finalEnvelope: DurableLearnerCognitionEnvelope = {
    ...lifecycle.envelope,
    integrityTier: tier,
    repairReport: {
      ...report,
      integrityTier: tier,
    },
    ontologyRevision: EDUCATIONAL_ONTOLOGY_NAMESPACE,
    migrationPath: lifecycle.migrationPath || migrationPath,
  };

  if (report.repaired) {
    emitLongitudinalCognitionObservation(finalEnvelope, "cognition_repair_observed", {
      repair_ops: report.repairOperations.length,
    });
  }
  if (lifecycle.operations.length > 0) {
    emitLongitudinalCognitionObservation(finalEnvelope, "ontology_migration_impact", {
      ops: lifecycle.operations.length,
    });
  }

  return {
    envelope: finalEnvelope,
    migrationPath: finalEnvelope.migrationPath ?? migrationPath,
    integrityTier: tier,
    repairOperations: [...report.repairOperations, ...lifecycle.operations],
  };
}

export function versionMetadataForEnvelope(
  envelope: DurableLearnerCognitionEnvelope | null,
): ReturnType<typeof buildCognitionVersionMetadata> {
  return buildCognitionVersionMetadata({
    envelopeVersion: envelope?.cognitionSnapshotVersion,
    migrationPath: envelope?.migrationPath ?? null,
  });
}

export function versionTelemetryForEnvelope(
  envelope: DurableLearnerCognitionEnvelope | null,
): Record<string, string | number> {
  return cognitionVersionTelemetryProps(versionMetadataForEnvelope(envelope));
}
