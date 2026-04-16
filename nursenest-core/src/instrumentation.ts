import * as Sentry from "@sentry/nextjs";
import "@/lib/db/env-bootstrap";
import { logDatabaseEnvOnce } from "@/lib/db/database-env";
import { validateProductionDatabaseEnv } from "@/lib/db/validate-production-db-env";
import {
  assertNextPublicSurfaceHasNoSecrets,
  warnIfStripeLiveKeyOutsideProduction,
} from "@/lib/env/central-env-validation";
import { runProductionEnvGuard } from "@/lib/env/production-env-guard";
import { logStartupContext } from "@/lib/env/server-env";
import { logHighMemory } from "@/lib/observability/perf-log";
import {
  logStripeCheckoutEnvStartupStatus,
  logStripeProductionPricingMisconfiguration,
} from "@/lib/stripe/pricing-map";
import { assertPinnedAuthBasePath } from "@/lib/auth/auth-base-path";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
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
    void import("@/lib/observability/http-access-log-hook").then((m) => {
      m.installHttpAccessLogHook();
    });
    logStripeCheckoutEnvStartupStatus();
    logStripeProductionPricingMisconfiguration();
    if (process.env.SENTRY_ENABLED === "true") {
      await import("./sentry.server.config");
    }
    process.on("unhandledRejection", (reason) => {
      const msg = reason instanceof Error ? reason.message : String(reason);
      console.error(`[nursenest-core] process_unhandledRejection ${msg}`);
    });
    process.on("uncaughtException", (err) => {
      console.error(`[nursenest-core] process_uncaughtException ${err?.message ?? err}`);
    });

    const memIntervalMs = Number(process.env.PERF_MEMORY_LOG_INTERVAL_MS ?? "0");
    if (process.env.NODE_ENV === "production" && Number.isFinite(memIntervalMs) && memIntervalMs >= 120_000) {
      const id = setInterval(() => {
        try {
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
  if (process.env.NEXT_RUNTIME === "edge") {
    if (process.env.SENTRY_ENABLED === "true") {
      await import("./sentry.edge.config");
    }
  }
}

export const onRequestError: typeof Sentry.captureRequestError = (...args) => {
  const err = args[0];
  const req = args[1] as { url?: string } | undefined;
  const msg = err instanceof Error ? err.message : String(err);
  safeServerLog("http", "request_error", {
    route: typeof req?.url === "string" ? req.url.slice(0, 160) : "unknown",
    errorName: err instanceof Error ? err.name : "non_error",
    messageSample: msg.slice(0, 200),
  });
  if (process.env.SENTRY_ENABLED !== "true") return;
  return Sentry.captureRequestError(...args);
};
