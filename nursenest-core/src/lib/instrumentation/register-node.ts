import "@/lib/db/env-bootstrap";
import { logDatabaseEnvOnce } from "@/lib/db/database-env";
import { validateProductionDatabaseEnv } from "@/lib/db/validate-production-db-env";
import {
  assertNextPublicSurfaceHasNoSecrets,
  warnIfStripeLiveKeyOutsideProduction,
} from "@/lib/env/central-env-validation";
import { runProductionEnvGuard } from "@/lib/env/production-env-guard";
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
  console.error(
    `[nursenest-core] instrumentation: nodejs runtime registered PORT=${process.env.PORT ?? "(unset)"}`,
  );
  assertPinnedAuthBasePath();
  {
    const aiGate = getAdminAiGenerationGate();
    warnAdminAiGenerationMisconfigurationIfNeeded(aiGate);
    console.error(
      `[nursenest-core] boot admin_ai env: flag_normalized=${String(aiGate.diagnostics.adminAiGenerationFlagNormalized)} flag_class=${aiGate.diagnostics.aiAdminGenerationFlagClass} openai_key_integrations=${String(aiGate.diagnostics.aiIntegrationsOpenAiKeyPresent)} openai_key_legacy=${String(aiGate.diagnostics.legacyOpenAiKeyPresent)} mode=${aiGate.mode}`,
    );
    if (!aiGate.runnable) {
      safeServerLog("admin_ai_generation", "boot_gate_inactive", {
        mode: aiGate.mode,
        flagEnabled: aiGate.flagEnabled,
        openAiKeyPresent: aiGate.openAiKeyPresent,
        ...aiGate.diagnostics,
      });
    } else {
      safeServerLog("admin_ai_generation", "boot_gate_active", {
        mode: aiGate.mode,
        ...aiGate.diagnostics,
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
