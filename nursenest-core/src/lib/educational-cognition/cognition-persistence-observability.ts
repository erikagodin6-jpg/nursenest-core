import "server-only";

import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { COGNITION_SNAPSHOT_VERSION } from "@/lib/educational-cognition/cognition-snapshot-types";

export type CognitionPersistenceEvent =
  | "persistence_available"
  | "persistence_degraded"
  | "persistence_write_failed"
  | "persistence_recovered"
  | "persistence_cache_warmed"
  | "persistence_cache_rehydrated"
  | "persistence_schema_missing";

export type PersistenceHealthMode = "available" | "degraded" | "memory_only" | "unconfigured";

export type PersistenceHealthState = {
  databaseConfigured: boolean;
  columnAvailable: boolean;
  migrationReady: boolean;
  mode: PersistenceHealthMode;
  lastProbeAt: string | null;
  lastWriteSucceeded: boolean | null;
  degradedReason: string | null;
};

let cachedHealth: PersistenceHealthState | null = null;
let lastMode: PersistenceHealthMode | null = null;

function baseHealth(): PersistenceHealthState {
  return {
    databaseConfigured: isDatabaseUrlConfigured(),
    columnAvailable: false,
    migrationReady: true,
    mode: isDatabaseUrlConfigured() ? "degraded" : "unconfigured",
    lastProbeAt: null,
    lastWriteSucceeded: null,
    degradedReason: null,
  };
}

function isMissingColumnError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /learner_cognition_envelope|Unknown field|column.*does not exist/i.test(msg);
}

export function emitCognitionPersistenceEvent(
  event: CognitionPersistenceEvent,
  detail: Record<string, string | number | boolean | null> = {},
): void {
  safeServerLog("educational_cognition", event, {
    envelope_version: COGNITION_SNAPSHOT_VERSION,
    ...detail,
  });
}

function transitionMode(next: PersistenceHealthMode, reason: string | null): void {
  if (lastMode === next) return;
  if (next === "available") {
    emitCognitionPersistenceEvent("persistence_available", { reason: reason ?? "probe_ok" });
    if (lastMode === "degraded" || lastMode === "memory_only") {
      emitCognitionPersistenceEvent("persistence_recovered", { prior_mode: lastMode ?? "unknown" });
    }
  } else if (next === "degraded" || next === "memory_only") {
    emitCognitionPersistenceEvent("persistence_degraded", {
      mode: next,
      reason: reason ?? "unknown",
    });
    if (reason) {
      safeServerLog("educational_cognition", "persistence_warning", {
        severity: "high",
        message: reason,
        mode: next,
      });
    }
  }
  lastMode = next;
}

/**
 * Runtime DB capability detection — cached per process; never throws.
 */
export async function probeLearnerCognitionPersistence(): Promise<PersistenceHealthState> {
  const health = baseHealth();
  health.lastProbeAt = new Date().toISOString();

  if (!health.databaseConfigured) {
    health.mode = "unconfigured";
    health.degradedReason = "DATABASE_URL not configured — memory-only cognition continuity";
    cachedHealth = health;
    transitionMode(health.mode, health.degradedReason);
    return health;
  }

  try {
    await prisma.user.findFirst({
      select: { id: true, learnerCognitionEnvelope: true },
      take: 1,
    });
    health.columnAvailable = true;
    health.mode = "available";
    health.degradedReason = null;
  } catch (err) {
    if (isMissingColumnError(err)) {
      health.columnAvailable = false;
      health.migrationReady = false;
      health.mode = "memory_only";
      health.degradedReason =
        "User.learner_cognition_envelope column missing — apply prisma/manual/learner-cognition-envelope.sql";
      emitCognitionPersistenceEvent("persistence_schema_missing", {
        migration_ready: false,
        mode: health.mode,
      });
    } else {
      health.mode = "degraded";
      health.degradedReason = "Database probe failed — using in-memory cognition fallback";
    }
  }

  cachedHealth = health;
  transitionMode(health.mode, health.degradedReason);
  return health;
}

export function getCachedPersistenceHealth(): PersistenceHealthState | null {
  return cachedHealth;
}

/** Startup / first-touch readiness — non-blocking for learner routes. */
export async function assertCognitionPersistenceReadiness(): Promise<PersistenceHealthState> {
  const { bootstrapCognitionPersistenceRuntime } = await import(
    "@/lib/educational-cognition/persistence-runtime-governance"
  );
  const assertion = await bootstrapCognitionPersistenceRuntime();
  return assertion.health;
}

export function recordPersistenceWriteResult(ok: boolean, userId?: string): void {
  if (cachedHealth) {
    cachedHealth.lastWriteSucceeded = ok;
  }
  if (!ok) {
    emitCognitionPersistenceEvent("persistence_write_failed", {
      user_id_present: Boolean(userId),
      mode: cachedHealth?.mode ?? "unknown",
    });
    if (cachedHealth && cachedHealth.mode === "available") {
      cachedHealth.mode = "degraded";
      cachedHealth.degradedReason = "Last envelope write failed — memory cache remains authoritative";
      transitionMode("degraded", cachedHealth.degradedReason);
    }
  }
}

export function recordCognitionCacheWarmed(userId: string, fromDatabase: boolean): void {
  if (fromDatabase) {
    emitCognitionPersistenceEvent("persistence_cache_rehydrated", {
      from_database: true,
      user_id_present: Boolean(userId),
      mode: cachedHealth?.mode ?? "unknown",
    });
  }
  emitCognitionPersistenceEvent("persistence_cache_warmed", {
    from_database: fromDatabase,
    user_id_present: Boolean(userId),
    mode: cachedHealth?.mode ?? "unknown",
  });
}

/** Validates envelope is JSON-serializable and within bounded size for User JSONB. */
export function validateEnvelopeSerialization(
  envelope: unknown,
): { ok: boolean; byteLength: number; error: string | null } {
  try {
    const json = JSON.stringify(envelope);
    const byteLength = Buffer.byteLength(json, "utf8");
    const maxBytes = 512_000;
    if (byteLength > maxBytes) {
      return { ok: false, byteLength, error: `envelope_exceeds_${maxBytes}_bytes` };
    }
    JSON.parse(json);
    return { ok: true, byteLength, error: null };
  } catch (e) {
    return {
      ok: false,
      byteLength: 0,
      error: e instanceof Error ? e.message : "serialization_failed",
    };
  }
}
