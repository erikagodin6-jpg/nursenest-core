import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import { EMPTY_LEARNER_STATE } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import {
  fingerprintLearnerState,
} from "@/lib/learner/rn-coaching-intelligence/learner-state-server-sync";
import type { DurableLearnerCognitionEnvelope } from "@/lib/educational-cognition/cognition-snapshot-types";
import { migrateCognitionEnvelopeFromStorage } from "@/lib/educational-cognition/cognition-snapshot-migrations";
import { logCognitionGovernanceViolation } from "@/lib/educational-cognition/governance-observability";

import type { CognitionIntegrityTier } from "@/lib/educational-cognition/cognition-snapshot-types";

export type CognitionEnvelopeIntegrityResult = {
  tier: CognitionIntegrityTier;
  checksum: string;
  fingerprintMatch: boolean;
  salvaged: boolean;
  warnings: string[];
  envelope: DurableLearnerCognitionEnvelope | null;
};

function stableStringify(value: unknown): string {
  return JSON.stringify(value, (_k, v) => (v === undefined ? null : v));
}

function hashPayload(payload: string): string {
  let h = 0;
  for (let i = 0; i < payload.length; i++) h = (h * 31 + payload.charCodeAt(i)) >>> 0;
  return `ce_${h.toString(16)}`;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

function salvageSnapshot(raw: unknown, pathwayId: string | null): RnLearnerStateSnapshot | null {
  if (!isRecord(raw)) return null;
  const base = EMPTY_LEARNER_STATE(pathwayId);
  const trajectory = Array.isArray(raw.readinessTrajectory)
    ? raw.readinessTrajectory.filter((n): n is number => typeof n === "number").slice(0, 32)
    : [];
  const measurementWeaknesses = Array.isArray(raw.measurementWeaknesses)
    ? raw.measurementWeaknesses.filter((x): x is string => typeof x === "string").slice(0, 24)
    : [];
  const reasoningPatterns = Array.isArray(raw.reasoningPatterns)
    ? raw.reasoningPatterns.filter((x): x is string => typeof x === "string").slice(0, 12)
    : [];
  return {
    ...base,
    pathwayId: typeof raw.pathwayId === "string" ? raw.pathwayId : pathwayId,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : new Date().toISOString(),
    readinessTrajectory: trajectory,
    measurementWeaknesses,
    reasoningPatterns: reasoningPatterns as RnLearnerStateSnapshot["reasoningPatterns"],
    pacingProfile:
      raw.pacingProfile === "fast" ||
      raw.pacingProfile === "balanced" ||
      raw.pacingProfile === "deliberate" ||
      raw.pacingProfile === "volatile"
        ? raw.pacingProfile
        : base.pacingProfile,
    hesitationProfile:
      raw.hesitationProfile === "low" || raw.hesitationProfile === "moderate" || raw.hesitationProfile === "high"
        ? raw.hesitationProfile
        : base.hesitationProfile,
    remediationFatigueScore:
      typeof raw.remediationFatigueScore === "number"
        ? Math.max(0, Math.min(1, raw.remediationFatigueScore))
        : 0,
    confidenceInstability:
      typeof raw.confidenceInstability === "number" ? Math.max(0, Math.min(1, raw.confidenceInstability)) : 0,
    readinessMomentum:
      typeof raw.readinessMomentum === "number" ? Math.max(-1, Math.min(1, raw.readinessMomentum)) : 0,
    competencyStates: Array.isArray(raw.competencyStates)
      ? (raw.competencyStates as RnLearnerStateSnapshot["competencyStates"])
      : [],
  };
}

/**
 * Validates, salvages, and classifies envelope integrity — never throws.
 */
export function assessCognitionEnvelopeIntegrity(
  raw: unknown,
  fallbackPathwayId: string | null,
): CognitionEnvelopeIntegrityResult {
  const warnings: string[] = [];
  const isPartialSnapshot =
    isRecord(raw) &&
    isRecord(raw.snapshot) &&
    !Array.isArray((raw.snapshot as Record<string, unknown>).competencyStates);

  if (raw == null) {
    return {
      tier: "degraded",
      checksum: hashPayload("null"),
      fingerprintMatch: true,
      salvaged: false,
      warnings: ["empty_envelope"],
      envelope: null,
    };
  }

  let envelope: DurableLearnerCognitionEnvelope | null = null;
  try {
    envelope = migrateCognitionEnvelopeFromStorage(raw, fallbackPathwayId);
  } catch {
    envelope = null;
  }
  if (!envelope && isRecord(raw) && isRecord(raw.snapshot)) {
    const salvaged = salvageSnapshot(raw.snapshot, fallbackPathwayId);
    if (salvaged) {
      warnings.push("partial_snapshot_salvage");
      const fp = fingerprintLearnerState(salvaged);
      envelope = migrateCognitionEnvelopeFromStorage(
        {
          cognitionSnapshotVersion: 2,
          cognitionReliability: "degraded",
          updatedAt: salvaged.updatedAt,
          pathwayId: salvaged.pathwayId ?? fallbackPathwayId,
          snapshot: salvaged,
          stateFingerprint: fp,
        },
        fallbackPathwayId,
      );
    }
  }

  if (envelope && isPartialSnapshot) {
    warnings.push("partial_snapshot_salvage");
  }

  if (!envelope) {
    logCognitionGovernanceViolation({
      code: "ontology_conflict",
      surface: "envelope_integrity",
      pathwayId: fallbackPathwayId,
      detail: "Irreparable cognition envelope payload — fresh hydration required",
    });
    return {
      tier: "corrupted",
      checksum: hashPayload(stableStringify(raw)),
      fingerprintMatch: false,
      salvaged: false,
      warnings: ["corrupted_payload"],
      envelope: null,
    };
  }

  const checksum = hashPayload(stableStringify(envelope.snapshot));
  const fingerprintMatch = envelope.stateFingerprint === fingerprintLearnerState(envelope.snapshot);
  if (!fingerprintMatch) warnings.push("fingerprint_drift");

  const continuity = envelope.graphContinuity;
  if (continuity?.remediationPathwayIds?.some((h) => typeof h !== "string" || !h.startsWith("/"))) {
    warnings.push("continuity_chain_reset_protected");
  }

  const tier: CognitionIntegrityTier =
    warnings.includes("corrupted_payload")
      ? "corrupted"
      : warnings.includes("partial_snapshot_salvage")
        ? "repaired"
        : warnings.length > 0
          ? "degraded"
          : "valid";

  return {
    tier,
    checksum,
    fingerprintMatch,
    salvaged: warnings.includes("partial_snapshot_salvage"),
    warnings,
    envelope: {
      ...envelope,
      stateFingerprint: fingerprintLearnerState(envelope.snapshot),
    },
  };
}
