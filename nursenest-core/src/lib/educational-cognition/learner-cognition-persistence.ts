import "server-only";

import {
  readLearnerCognitionEnvelopeFromDatabase,
  writeLearnerCognitionEnvelopeToDatabase,
} from "@/lib/educational-cognition/learner-cognition-persistence-prisma";
import type { RnLearnerStateSnapshot } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import {
  fingerprintLearnerState,
  mergeServerLearnerState,
  type LearnerStateServerEnvelope,
} from "@/lib/learner/rn-coaching-intelligence/learner-state-server-sync";
import { EMPTY_LEARNER_STATE } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import {
  buildFreshCognitionEnvelope,
} from "@/lib/educational-cognition/cognition-snapshot-migrations";
import type {
  CognitionReliabilityTier,
  DurableLearnerCognitionEnvelope,
  LongitudinalCognitionHistory,
  PersistedGraphContinuity,
} from "@/lib/educational-cognition/cognition-snapshot-types";
import {
  governCognitionHydration,
  mergeOptimisticCognitionUpdate,
} from "@/lib/educational-cognition/cognition-hydration-governance";
import { inferReliabilityFromPersistSource } from "@/lib/educational-cognition/cognition-reliability";
import {
  assertCognitionPersistenceReadiness,
  recordCognitionCacheWarmed,
  recordPersistenceWriteResult,
  validateEnvelopeSerialization,
} from "@/lib/educational-cognition/cognition-persistence-observability";
import { buildEnvelopeGovernanceMetadata } from "@/lib/educational-cognition/cognition-hydration-governance";
import { prepareDurableCognitionEnvelope } from "@/lib/educational-cognition/prepare-durable-cognition-envelope";
import { EDUCATIONAL_ONTOLOGY_NAMESPACE } from "@/lib/educational-graph/unified-educational-substrate";

/** Process-local fallback when DB column unavailable or unconfigured. */
const durableByUser = new Map<string, DurableLearnerCognitionEnvelope>();

let persistencePrimed = false;

async function ensurePersistencePrimed(): Promise<void> {
  if (persistencePrimed) return;
  persistencePrimed = true;
  await assertCognitionPersistenceReadiness();
}

function ingestPreparedEnvelope(
  userId: string,
  raw: unknown,
  pathwayId: string | null,
  fromDatabase: boolean,
): DurableLearnerCognitionEnvelope | null {
  const prepared = prepareDurableCognitionEnvelope(raw, pathwayId);
  if (!prepared.envelope) return null;
  writeEnvelopeToMemory(userId, prepared.envelope);
  recordCognitionCacheWarmed(userId, fromDatabase);
  return prepared.envelope;
}

async function readEnvelopeFromDatabase(userId: string): Promise<DurableLearnerCognitionEnvelope | null> {
  await ensurePersistencePrimed();
  const row = await readLearnerCognitionEnvelopeFromDatabase(userId);
  if (!row) return null;
  return ingestPreparedEnvelope(userId, row, row.pathwayId, true);
}

async function writeEnvelopeToDatabase(
  userId: string,
  envelope: DurableLearnerCognitionEnvelope,
): Promise<boolean> {
  await ensurePersistencePrimed();
  const ok = await writeLearnerCognitionEnvelopeToDatabase(userId, envelope);
  recordPersistenceWriteResult(ok, userId);
  return ok;
}

function readEnvelopeFromMemory(userId: string): DurableLearnerCognitionEnvelope | null {
  return durableByUser.get(userId) ?? null;
}

function writeEnvelopeToMemory(userId: string, envelope: DurableLearnerCognitionEnvelope): void {
  durableByUser.set(userId, envelope);
}

export async function loadDurableLearnerCognitionEnvelope(
  userId: string,
): Promise<DurableLearnerCognitionEnvelope | null> {
  await ensurePersistencePrimed();
  const fromDb = await readEnvelopeFromDatabase(userId);
  if (fromDb) return fromDb;
  const mem = readEnvelopeFromMemory(userId);
  if (mem) return mem;
  return null;
}

/** Primes process-local cache from Prisma — call at dashboard / report-card entry. */
export async function warmDurableLearnerCognitionCache(userId: string): Promise<void> {
  await loadDurableLearnerCognitionEnvelope(userId);
}

export function loadDurableLearnerCognition(userId: string): RnLearnerStateSnapshot | null {
  const row = durableByUser.get(userId);
  return row?.snapshot ?? null;
}

export function loadDurableLearnerCognitionEnvelopeSync(
  userId: string,
): DurableLearnerCognitionEnvelope | null {
  return readEnvelopeFromMemory(userId);
}

function appendLongitudinalSample(
  prior: LongitudinalCognitionHistory | undefined,
  snapshot: RnLearnerStateSnapshot,
  options?: { countAdaptive?: boolean },
): LongitudinalCognitionHistory {
  const base: LongitudinalCognitionHistory = prior ?? {
    competencyVolatilitySamples: [],
    timingTrajectorySamples: [],
    readinessMomentumSamples: [],
    remediationContinuityCount: 0,
    adaptiveRecommendationCount: 0,
    measurementHistoryKeys: [],
  };
  const at = snapshot.updatedAt;
  const lastScore = snapshot.readinessTrajectory.at(-1);
  const samples = [...base.readinessMomentumSamples];
  if (lastScore != null) {
    samples.push({ at, score: lastScore });
    if (samples.length > 32) samples.shift();
  }
  const volSamples = [...base.competencyVolatilitySamples];
  for (const c of snapshot.competencyStates.slice(0, 4)) {
    volSamples.push({ at, volatility: c.volatility, competencyId: c.competencyId });
  }
  while (volSamples.length > 48) volSamples.shift();

  const timingSamples = [...base.timingTrajectorySamples];
  if (snapshot.timingCognition) {
    timingSamples.push({ at, riskBand: snapshot.timingCognition.riskBand });
    if (timingSamples.length > 24) timingSamples.shift();
  }

  const measurementKeys = [
    ...new Set([...base.measurementHistoryKeys, ...snapshot.measurementWeaknesses]),
  ].slice(0, 24);

  return {
    ...base,
    readinessMomentumSamples: samples,
    competencyVolatilitySamples: volSamples,
    timingTrajectorySamples: timingSamples,
    remediationContinuityCount: base.remediationContinuityCount + 1,
    adaptiveRecommendationCount:
      base.adaptiveRecommendationCount + (options?.countAdaptive ? 1 : 0),
    measurementHistoryKeys: measurementKeys,
  };
}

export function saveDurableLearnerCognition(
  userId: string,
  snapshot: RnLearnerStateSnapshot,
  options?: {
    graphContinuity?: PersistedGraphContinuity;
    reliability?: CognitionReliabilityTier;
    telemetryCorrelationId?: string | null;
    countAdaptiveRecommendation?: boolean;
  },
): DurableLearnerCognitionEnvelope {
  const prior = readEnvelopeFromMemory(userId);
  const merged =
    mergeServerLearnerState(prior?.snapshot ?? null, snapshot) ??
    mergeOptimisticCognitionUpdate(prior?.snapshot ?? EMPTY_LEARNER_STATE(snapshot.pathwayId), snapshot);

  const reliability =
    options?.reliability ??
    inferReliabilityFromPersistSource({
      fromDatabase: prior?.cognitionReliability === "validated",
      fingerprintMatch: true,
      hasUserId: true,
    });

  let envelope: DurableLearnerCognitionEnvelope = {
    ...(prior ?? buildFreshCognitionEnvelope(merged, reliability)),
    snapshot: merged,
    updatedAt: new Date().toISOString(),
    pathwayId: merged.pathwayId,
    stateFingerprint: fingerprintLearnerState(merged),
    cognitionReliability: reliability,
    graphContinuity: options?.graphContinuity ?? prior?.graphContinuity,
    longitudinal: appendLongitudinalSample(prior?.longitudinal, merged, {
      countAdaptive: options?.countAdaptiveRecommendation,
    }),
    telemetryCorrelationId: options?.telemetryCorrelationId ?? prior?.telemetryCorrelationId ?? null,
    ontologyRevision: EDUCATIONAL_ONTOLOGY_NAMESPACE,
  };

  const prepared = prepareDurableCognitionEnvelope(envelope, merged.pathwayId);
  envelope = prepared.envelope ?? envelope;
  envelope.governance = buildEnvelopeGovernanceMetadata({
    envelope,
    hydrationState: "full",
    reliabilityTier: envelope.cognitionReliability,
  });
  envelope.envelopeVersion = envelope.cognitionSnapshotVersion;

  const ser = validateEnvelopeSerialization(envelope);
  if (!ser.ok) {
    recordPersistenceWriteResult(false, userId);
    writeEnvelopeToMemory(userId, envelope);
    return envelope;
  }

  writeEnvelopeToMemory(userId, envelope);
  void persistLearnerCognitionToDatabase(userId, envelope);
  return envelope;
}

/** Fire-and-forget DB persist — memory store is authoritative for same-process continuity. */
export async function persistLearnerCognitionToDatabase(
  userId: string,
  envelope: DurableLearnerCognitionEnvelope,
): Promise<boolean> {
  const ok = await writeEnvelopeToDatabase(userId, envelope);
  if (ok) {
    const row = readEnvelopeFromMemory(userId);
    if (row) {
      row.cognitionReliability = inferReliabilityFromPersistSource({
        fromDatabase: true,
        fingerprintMatch: true,
        hasUserId: true,
      });
    }
  }
  return ok;
}

export function hydratePriorLearnerState(args: {
  userId: string | null | undefined;
  pathwayId: string | null;
}): RnLearnerStateSnapshot {
  if (!args.userId) return EMPTY_LEARNER_STATE(args.pathwayId);

  const stored = readEnvelopeFromMemory(args.userId);
  const hydration = governCognitionHydration({
    userId: args.userId,
    pathwayId: args.pathwayId,
    stored,
    fromDatabase: stored?.cognitionReliability === "validated" || stored?.cognitionReliability === "persisted",
    fingerprintMatch: stored
      ? stored.stateFingerprint === fingerprintLearnerState(stored.snapshot)
      : true,
  });

  if (stored?.repairReport?.repairOperations.length) {
    hydration.warnings.push(...stored.repairReport.repairOperations.map((op) => `repair:${op}`));
  }
  if (stored?.integrityTier === "degraded" || stored?.integrityTier === "corrupted") {
    hydration.warnings.push(`integrity:${stored.integrityTier}`);
  }

  return hydration.snapshot;
}

export function reconcileLearnerStateFingerprint(userId: string, snapshot: RnLearnerStateSnapshot): boolean {
  const prior = durableByUser.get(userId);
  if (!prior) return true;
  return prior.stateFingerprint === fingerprintLearnerState(snapshot);
}

export function isLearnerCognitionStale(userId: string): boolean {
  const row = durableByUser.get(userId);
  if (!row) return false;
  const hydration = governCognitionHydration({
    userId,
    pathwayId: row.pathwayId,
    stored: row,
  });
  return hydration.stale;
}

/** Legacy envelope shape for API routes still expecting v1 wrapper. */
export function toLearnerStateServerEnvelope(
  envelope: DurableLearnerCognitionEnvelope,
): LearnerStateServerEnvelope {
  return {
    version: 1,
    updatedAt: envelope.updatedAt,
    pathwayId: envelope.pathwayId,
    snapshot: envelope.snapshot,
    stateFingerprint: envelope.stateFingerprint,
  };
}

/** Shared in-memory backing for API route — single source when DB unavailable. */
export function getDurableCognitionStore(): Map<string, DurableLearnerCognitionEnvelope> {
  return durableByUser;
}
