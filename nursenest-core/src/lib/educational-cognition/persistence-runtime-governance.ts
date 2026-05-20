import "server-only";

import {
  getCachedPersistenceHealth,
  probeLearnerCognitionPersistence,
  emitCognitionPersistenceEvent,
  type PersistenceHealthState,
} from "@/lib/educational-cognition/cognition-persistence-observability";
import { validateEnvelopeSerialization } from "@/lib/educational-cognition/cognition-persistence-observability";
import { buildFreshCognitionEnvelope } from "@/lib/educational-cognition/cognition-snapshot-migrations";
import { EMPTY_LEARNER_STATE } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import {
  readLearnerCognitionEnvelopeFromDatabase,
  writeLearnerCognitionEnvelopeToDatabase,
} from "@/lib/educational-cognition/learner-cognition-persistence-prisma";
import { safeServerLog } from "@/lib/observability/safe-server-log";

function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
}

function isCiOrDeployGate(): boolean {
  return (
    process.env.CI === "true" ||
    process.env.NN_ENFORCE_COGNITION_PERSISTENCE === "1" ||
    process.env.NN_DEPLOY_GATE === "1"
  );
}

export type PersistenceRuntimeAssertion = {
  ok: boolean;
  health: PersistenceHealthState;
  blockingReason: string | null;
  shouldHardFailDeploy: boolean;
};

/**
 * Migration readiness — production / CI must have column; dev may use memory fallback.
 */
export async function assertPersistenceRuntimeReady(): Promise<PersistenceRuntimeAssertion> {
  const health = await probeLearnerCognitionPersistence();
  const prod = isProductionRuntime();
  const gate = isCiOrDeployGate();

  let blockingReason: string | null = null;
  if (health.databaseConfigured && !health.columnAvailable) {
    blockingReason = health.degradedReason ?? "learner_cognition_envelope column missing";
    if (prod || gate) {
      emitCognitionPersistenceEvent("persistence_schema_missing", {
        mode: health.mode,
        migration_ready: false,
      });
    }
  }

  const shouldHardFailDeploy = Boolean(blockingReason && (prod || gate));

  if (shouldHardFailDeploy) {
    safeServerLog("educational_cognition", "persistence_deploy_blocked", {
      reason: blockingReason,
      mode: health.mode,
    });
  }

  return {
    ok: !shouldHardFailDeploy,
    health,
    blockingReason,
    shouldHardFailDeploy,
  };
}

/**
 * Startup write-read verification (non-destructive probe user id).
 * Never throws — records observability only.
 */
export async function runPersistenceWriteReadVerification(probeUserId?: string): Promise<{
  writeOk: boolean;
  readOk: boolean;
  serializationOk: boolean;
}> {
  const health = await probeLearnerCognitionPersistence();
  if (health.mode !== "available" || !probeUserId) {
    return { writeOk: false, readOk: false, serializationOk: validateEnvelopeSerialization(null).ok };
  }

  const envelope = buildFreshCognitionEnvelope(EMPTY_LEARNER_STATE("us-rn-nclex-rn"), "inferred");
  const ser = validateEnvelopeSerialization(envelope);
  if (!ser.ok) {
    emitCognitionPersistenceEvent("persistence_write_failed", { reason: "serialization_invalid" });
    return { writeOk: false, readOk: false, serializationOk: false };
  }

  const writeOk = await writeLearnerCognitionEnvelopeToDatabase(probeUserId, envelope);
  const readBack = writeOk ? await readLearnerCognitionEnvelopeFromDatabase(probeUserId) : null;
  const readOk = readBack != null && readBack.cognitionSnapshotVersion === envelope.cognitionSnapshotVersion;

  if (writeOk && readOk) {
    emitCognitionPersistenceEvent("persistence_available", { probe: "write_read_ok" });
  } else if (!writeOk) {
    emitCognitionPersistenceEvent("persistence_write_failed", { probe: "startup_verify" });
  }

  return { writeOk, readOk, serializationOk: ser.ok };
}

/** Process bootstrap — call from first persistence touch or admin health route. */
export async function bootstrapCognitionPersistenceRuntime(): Promise<PersistenceRuntimeAssertion> {
  const assertion = await assertPersistenceRuntimeReady();
  if (!assertion.shouldHardFailDeploy) {
    const cached = getCachedPersistenceHealth();
    if (cached?.mode === "available") {
      emitCognitionPersistenceEvent("persistence_available", { bootstrap: true });
    }
  }
  return assertion;
}
