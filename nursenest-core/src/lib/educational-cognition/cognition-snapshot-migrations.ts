import { EMPTY_LEARNER_STATE } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import {
  COGNITION_SNAPSHOT_VERSION,
  type CognitionReliabilityTier,
  type CognitionSnapshotVersion,
  type DurableLearnerCognitionEnvelope,
} from "@/lib/educational-cognition/cognition-snapshot-types";
import {
  fingerprintLearnerState,
  type LearnerStateServerEnvelope,
} from "@/lib/learner/rn-coaching-intelligence/learner-state-server-sync";

const DEFAULT_STALE_MS = 7 * 24 * 60 * 60 * 1000;

function isRecord(v: unknown): v is Record<string, unknown> {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

function migrateSnapshotV1ToV2(snapshot: RnLearnerStateSnapshot, pathwayId: string | null): RnLearnerStateSnapshot {
  if (snapshot.version >= 1) {
    return {
      ...snapshot,
      version: 1,
      pathwayId: snapshot.pathwayId ?? pathwayId,
      updatedAt: snapshot.updatedAt || new Date().toISOString(),
    };
  }
  return EMPTY_LEARNER_STATE(pathwayId);
}

function envelopeFromLegacyV1(
  raw: LearnerStateServerEnvelope,
): DurableLearnerCognitionEnvelope {
  const snapshot = migrateSnapshotV1ToV2(raw.snapshot, raw.pathwayId);
  return {
    cognitionSnapshotVersion: COGNITION_SNAPSHOT_VERSION,
    cognitionReliability: "persisted",
    updatedAt: raw.updatedAt,
    pathwayId: raw.pathwayId,
    snapshot,
    stateFingerprint: raw.stateFingerprint || fingerprintLearnerState(snapshot),
    staleAfterMs: DEFAULT_STALE_MS,
  };
}

function normalizeReliability(value: unknown): CognitionReliabilityTier {
  if (value === "ephemeral" || value === "inferred" || value === "persisted" || value === "validated") {
    return value;
  }
  return "persisted";
}

/** Ensures partial DB / salvage payloads are safe for fingerprint + hydration. */
export function normalizeSnapshotShape(
  snapshot: RnLearnerStateSnapshot,
  pathwayId: string | null,
): RnLearnerStateSnapshot {
  const base = EMPTY_LEARNER_STATE(pathwayId);
  return {
    ...base,
    ...snapshot,
    version: snapshot.version >= 1 ? snapshot.version : base.version,
    pathwayId: snapshot.pathwayId ?? pathwayId,
    updatedAt: snapshot.updatedAt || base.updatedAt,
    readinessTrajectory: Array.isArray(snapshot.readinessTrajectory)
      ? snapshot.readinessTrajectory
      : base.readinessTrajectory,
    competencyStates: Array.isArray(snapshot.competencyStates)
      ? snapshot.competencyStates
      : base.competencyStates,
    measurementWeaknesses: Array.isArray(snapshot.measurementWeaknesses)
      ? snapshot.measurementWeaknesses
      : base.measurementWeaknesses,
    reasoningPatterns: Array.isArray(snapshot.reasoningPatterns)
      ? snapshot.reasoningPatterns
      : base.reasoningPatterns,
  };
}

/**
 * Migrates raw DB / in-memory JSON to the current cognition envelope.
 * Returns null when payload is irreparable (caller should hydrate fresh).
 */
export function migrateCognitionEnvelopeFromStorage(
  raw: unknown,
  fallbackPathwayId: string | null,
): DurableLearnerCognitionEnvelope | null {
  if (!isRecord(raw)) return null;

  if (raw.version === 1 && isRecord(raw.snapshot)) {
    return envelopeFromLegacyV1(raw as unknown as LearnerStateServerEnvelope);
  }

  const version = (raw.cognitionSnapshotVersion as CognitionSnapshotVersion | undefined) ?? 1;
  if (!isRecord(raw.snapshot)) {
    return null;
  }

  let snapshot = raw.snapshot as unknown as RnLearnerStateSnapshot;
  const pathwayId =
    (typeof raw.pathwayId === "string" ? raw.pathwayId : null) ?? snapshot.pathwayId ?? fallbackPathwayId;

  if (version < COGNITION_SNAPSHOT_VERSION) {
    snapshot = migrateSnapshotV1ToV2(snapshot, pathwayId);
  }
  snapshot = normalizeSnapshotShape(snapshot, pathwayId);

  const updatedAt =
    typeof raw.updatedAt === "string" ? raw.updatedAt : snapshot.updatedAt || new Date().toISOString();

  return {
    cognitionSnapshotVersion: COGNITION_SNAPSHOT_VERSION,
    cognitionReliability: normalizeReliability(raw.cognitionReliability),
    updatedAt,
    pathwayId,
    snapshot: { ...snapshot, pathwayId, updatedAt },
    stateFingerprint:
      typeof raw.stateFingerprint === "string"
        ? raw.stateFingerprint
        : fingerprintLearnerState(snapshot),
    staleAfterMs:
      typeof raw.staleAfterMs === "number" && raw.staleAfterMs > 0 ? raw.staleAfterMs : DEFAULT_STALE_MS,
    graphContinuity: isRecord(raw.graphContinuity)
      ? {
          currentTopicSlug:
            typeof raw.graphContinuity.currentTopicSlug === "string"
              ? raw.graphContinuity.currentTopicSlug
              : null,
          remediationPathwayIds: Array.isArray(raw.graphContinuity.remediationPathwayIds)
            ? raw.graphContinuity.remediationPathwayIds.filter((x): x is string => typeof x === "string")
            : [],
          glossaryContinuityKeys: Array.isArray(raw.graphContinuity.glossaryContinuityKeys)
            ? raw.graphContinuity.glossaryContinuityKeys.filter((x): x is string => typeof x === "string")
            : [],
          interpretationContinuityKeys: Array.isArray(raw.graphContinuity.interpretationContinuityKeys)
            ? raw.graphContinuity.interpretationContinuityKeys.filter((x): x is string => typeof x === "string")
            : [],
          lastGraphStepId:
            typeof raw.graphContinuity.lastGraphStepId === "string"
              ? raw.graphContinuity.lastGraphStepId
              : null,
          lastGraphHref:
            typeof raw.graphContinuity.lastGraphHref === "string" ? raw.graphContinuity.lastGraphHref : null,
        }
      : undefined,
    longitudinal: isRecord(raw.longitudinal) ? (raw.longitudinal as DurableLearnerCognitionEnvelope["longitudinal"]) : undefined,
    telemetryCorrelationId:
      typeof raw.telemetryCorrelationId === "string" ? raw.telemetryCorrelationId : null,
  };
}

export function buildFreshCognitionEnvelope(
  snapshot: RnLearnerStateSnapshot,
  reliability: CognitionReliabilityTier = "inferred",
): DurableLearnerCognitionEnvelope {
  const merged = { ...snapshot, updatedAt: new Date().toISOString() };
  return {
    cognitionSnapshotVersion: COGNITION_SNAPSHOT_VERSION,
    cognitionReliability: reliability,
    updatedAt: merged.updatedAt,
    pathwayId: merged.pathwayId,
    snapshot: merged,
    stateFingerprint: fingerprintLearnerState(merged),
    staleAfterMs: DEFAULT_STALE_MS,
  };
}

export function isEnvelopeSchemaCurrent(envelope: DurableLearnerCognitionEnvelope): boolean {
  return envelope.cognitionSnapshotVersion === COGNITION_SNAPSHOT_VERSION;
}
