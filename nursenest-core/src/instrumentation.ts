import * as Sentry from "@sentry/nextjs";
import "@/lib/db/env-bootstrap";
import { logDatabaseEnvOnce } from "@/lib/db/database-env";
import { logStartupContext } from "@/lib/env/server-env";
import { logHighMemory } from "@/lib/observability/perf-log";
import { logStripeProductionPricingMisconfiguration } from "@/lib/stripe/pricing-map";

function validateAuthEnv(): void {
  if (process.env.NODE_ENV !== "production") return;
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret?.trim()) {
    console.error(
      "[nursenest-core] auth env: AUTH_SECRET (or NEXTAUTH_SECRET) is missing — login will fail in production.",
    );
  }
  const url = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
  if (!url?.trim()) {
    console.warn(
      "[nursenest-core] auth env: AUTH_URL is unset — relying on trustHost + forwarded headers. Set AUTH_URL to your public origin (e.g. https://app.example.com) if cookies or redirects misbehave.",
    );
  }
}

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    logStartupContext();
    logDatabaseEnvOnce();
    console.error(
      `[nursenest-core] instrumentation: nodejs runtime registered PORT=${process.env.PORT ?? "(unset)"}`,
    );
    validateAuthEnv();
    logStripeProductionPricingMisconfiguration();
    await import("./sentry.server.config");
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
        const heap = process.memoryUsage().heapUsed;
        if (heap >= 512 * 1024 * 1024) {
          logHighMemory("process_interval");
        }
      }, memIntervalMs);
      if (typeof (id as ReturnType<typeof setInterval>).unref === "function") {
        (id as ReturnType<typeof setInterval> & { unref: () => void }).unref();
      }
    }
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
