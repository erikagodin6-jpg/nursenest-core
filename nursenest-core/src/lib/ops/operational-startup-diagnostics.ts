import "server-only";

import { isAuthSecretConfigured } from "@/lib/auth/auth-secret";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { getLearnerDurabilityObservabilityFields } from "@/lib/durability/durability-flags";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const GLOBAL_KEY = "__nnOperationalStartupDiagnosticsEmitted__" as const;

function truthyEnv(v: string | undefined): boolean {
  const t = v?.trim().toLowerCase();
  return t === "1" || t === "true" || t === "yes";
}

/**
 * Non-secret snapshot for stderr traces (layouts) and structured logs.
 * Booleans only — suitable for degraded-mode diagnostics.
 */
export function getOperationalStartupTraceFields(): Record<string, boolean> {
  const redisish =
    Boolean(process.env.UPSTASH_REDIS_REST_URL?.trim()) ||
    Boolean(process.env.REDIS_URL?.trim()) ||
    Boolean(process.env.KV_REST_API_URL?.trim());
  return {
    databaseUrlConfigured: isDatabaseUrlConfigured(),
    authSecretConfigured: isAuthSecretConfigured(),
    redisOrKvEnvPresent: redisish,
    vercelEnvPresent: Boolean(process.env.VERCEL?.trim()),
  };
}

/**
 * One structured line per process when `NN_OPERATIONS_STARTUP_LOG=1`.
 * Use in staging / incident response — not enabled by default.
 */
export function emitOperationalStartupDiagnosticsOnce(): void {
  if (!truthyEnv(process.env.NN_OPERATIONS_STARTUP_LOG)) return;
  const g = globalThis as typeof globalThis & { [GLOBAL_KEY]?: boolean };
  if (g[GLOBAL_KEY]) return;
  g[GLOBAL_KEY] = true;

  const dur = getLearnerDurabilityObservabilityFields();
  const base = getOperationalStartupTraceFields();

  safeServerLog("operations", "startup_diagnostics", {
    databaseUrlConfigured: base.databaseUrlConfigured,
    authSecretConfigured: base.authSecretConfigured,
    redisOrKvEnvPresent: base.redisOrKvEnvPresent,
    vercelEnvPresent: base.vercelEnvPresent,
    envNnDegradedMode: dur.envNnDegradedMode,
    publicNnDegradedMode: dur.publicNnDegradedMode,
    coreOnlyEmergency: dur.coreOnlyEmergency,
    autoDegradedActive: dur.autoDegradedActive,
    skipNonCriticalLearnerWork: dur.skipNonCriticalLearnerWork,
  });
}
