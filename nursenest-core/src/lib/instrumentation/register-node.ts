import "@/lib/db/env-bootstrap";
import { logDatabaseEnvOnce } from "@/lib/db/database-env";
import { validateProductionDatabaseEnv } from "@/lib/db/validate-production-db-env";
import {
  assertNextPublicSurfaceHasNoSecrets,
  warnIfStripeLiveKeyOutsideProduction,
} from "@/lib/env/central-env-validation";
import { runProductionEnvGuard } from "@/lib/env/production-env-guard";
import { logRuntimeEnvSnapshot, validateRuntimeEnvOrThrow } from "@/lib/env/runtime-env-guard";
import { logStartupContext } from "@/lib/env/server-env";
import { logHighMemory } from "@/lib/observability/perf-log-core";
import { logMemoryPressureSample } from "@/lib/observability/perf-log-host-memory";
import { getAdminAiGenerationGate, warnAdminAiGenerationMisconfigurationIfNeeded } from "@/lib/ai/admin-ai-policy";
import { assertPinnedAuthBasePath } from "@/lib/auth/auth-base-path";
import { importSentryNextjs } from "@/lib/observability/sentry-nextjs-dynamic";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { isSentryServerRuntimeEnabled } from "@/lib/observability/sentry-flags";

async function captureSentryProcessException(
  error: unknown,
  options: {
    tags: Record<string, string>;
    level: "error" | "fatal";
  },
): Promise<void> {
  if (!isSentryServerRuntimeEnabled()) return;
  const Sentry = await importSentryNextjs();
  const err = error instanceof Error ? error : new Error(String(error));
  Sentry.captureException(err, options);
}

export async function registerNodeInstrumentation(): Promise<void> {
  logStartupContext();
  assertNextPublicSurfaceHasNoSecrets();
  warnIfStripeLiveKeyOutsideProduction();
  logDatabaseEnvOnce();
  validateProductionDatabaseEnv();
  runProductionEnvGuard();
  logRuntimeEnvSnapshot();
  validateRuntimeEnvOrThrow();
  try {
    const { logStudyPublishedSnapshotStartupDiagnostics } = await import(
      "@/lib/study-content-failover/study-snapshot-runtime-diagnostics",
    );
    await logStudyPublishedSnapshotStartupDiagnostics();
  } catch (e) {
    safeServerLog("study_failover", "study_snapshot_boot_diagnostics_failed", {
      error_message: e instanceof Error ? e.message.slice(0, 240) : String(e).slice(0, 240),
    });
  }
  console.error(
    `[nursenest-core] instrumentation: nodejs runtime registered PORT=${process.env.PORT ?? "(unset)"}`,
  );
  assertPinnedAuthBasePath();
  {
    const aiGate = getAdminAiGenerationGate();
    warnAdminAiGenerationMisconfigurationIfNeeded(aiGate);
    /** Redacted boot line — no secret values; confirms runtime env visibility for admin AI gate. */
    console.error(
      `[nursenest-core] boot admin_ai_gate ` +
        `AI_ADMIN_GENERATION_ENABLED_present=${String(aiGate.diagnostics.aiAdminGenerationEnvPresent)} ` +
        `AI_ADMIN_GENERATION_ENABLED_flag_class=${aiGate.diagnostics.aiAdminGenerationFlagClass} ` +
        `AI_ADMIN_GENERATION_ENABLED_normalized=${String(aiGate.diagnostics.adminAiGenerationFlagNormalized)} ` +
        `AI_INTEGRATIONS_OPENAI_API_KEY_present=${String(aiGate.diagnostics.aiIntegrationsOpenAiKeyPresent)} ` +
        `OPENAI_API_KEY_present=${String(aiGate.diagnostics.legacyOpenAiKeyPresent)} ` +
        `final_gate_runnable=${String(aiGate.runnable)} ` +
        `final_gate_mode=${aiGate.mode}`,
    );
    if (!aiGate.runnable) {
      safeServerLog("admin_ai_generation", "boot_gate_inactive", {
        AI_ADMIN_GENERATION_ENABLED_present: aiGate.diagnostics.aiAdminGenerationEnvPresent,
        AI_ADMIN_GENERATION_ENABLED_flag_class: aiGate.diagnostics.aiAdminGenerationFlagClass,
        AI_ADMIN_GENERATION_ENABLED_normalized: aiGate.diagnostics.adminAiGenerationFlagNormalized,
        AI_INTEGRATIONS_OPENAI_API_KEY_present: aiGate.diagnostics.aiIntegrationsOpenAiKeyPresent,
        OPENAI_API_KEY_present: aiGate.diagnostics.legacyOpenAiKeyPresent,
        final_gate_runnable: aiGate.runnable,
        final_gate_mode: aiGate.mode,
      });
    } else {
      safeServerLog("admin_ai_generation", "boot_gate_active", {
        AI_ADMIN_GENERATION_ENABLED_present: aiGate.diagnostics.aiAdminGenerationEnvPresent,
        AI_ADMIN_GENERATION_ENABLED_flag_class: aiGate.diagnostics.aiAdminGenerationFlagClass,
        AI_ADMIN_GENERATION_ENABLED_normalized: aiGate.diagnostics.adminAiGenerationFlagNormalized,
        AI_INTEGRATIONS_OPENAI_API_KEY_present: aiGate.diagnostics.aiIntegrationsOpenAiKeyPresent,
        OPENAI_API_KEY_present: aiGate.diagnostics.legacyOpenAiKeyPresent,
        final_gate_runnable: aiGate.runnable,
        final_gate_mode: aiGate.mode,
      });
    }
  }
  void import("@/lib/observability/http-access-log-hook").then((m) => {
    m.installHttpAccessLogHook();
  });
  /** Defer: pulls `pricing-map` + matrix walk off the instrumentation critical path (readiness / handlers). */
  setImmediate(() => {
    void import("@/lib/stripe/pricing-map")
      .then((m) => {
        m.logStripeCheckoutEnvStartupStatus();
        m.logStripeProductionPricingMisconfiguration();
      })
      .catch(() => {});
  });

  process.on("unhandledRejection", (reason) => {
    const msg = reason instanceof Error ? reason.message : String(reason);
    console.error(`[nursenest-core] process_unhandledRejection ${msg}`);
    void captureSentryProcessException(reason instanceof Error ? reason : new Error(msg), {
        tags: { scope: "process", event: "unhandledRejection", critical: "true" },
        level: "error",
      });
  });
  process.on("uncaughtException", (err) => {
    console.error(`[nursenest-core] process_uncaughtException ${err?.message ?? err}`);
    void captureSentryProcessException(err instanceof Error ? err : new Error(String(err)), {
        tags: { scope: "process", event: "uncaughtException", critical: "true" },
        level: "fatal",
      });
  });

  const rawMemInterval = process.env.PERF_MEMORY_LOG_INTERVAL_MS;
  const memIntervalMs =
    rawMemInterval !== undefined && rawMemInterval !== ""
      ? Number(rawMemInterval)
      : process.env.NODE_ENV === "production"
        ? 600_000
        : 0;
  if (process.env.NODE_ENV === "production" && Number.isFinite(memIntervalMs) && memIntervalMs >= 60_000) {
    const id = setInterval(() => {
      try {
        logMemoryPressureSample("process_interval");
        const heap = typeof process.memoryUsage === "function" ? process.memoryUsage().heapUsed : 0;
        if (heap >= 512 * 1024 * 1024) {
          logHighMemory("process_interval");
        }
      } catch {
        /* ignore — Edge / constrained runtimes */
      }
    }, memIntervalMs);
    if (typeof (id as ReturnType<typeof setInterval>).unref === "function") {
      (id as ReturnType<typeof setInterval> & { unref: () => void }).unref();
    }
  }
}
