/**
 * Server / Edge instrumentation entry.
 *
 * Goals:
 * - Keep this file extremely lightweight (do not pull heavy modules into the build graph)
 * - Defer ALL heavy imports (Sentry, node instrumentation) behind runtime checks
 * - Never let instrumentation throw and break boot
 */

import { importSentryNextjs } from "@/lib/observability/sentry-nextjs-dynamic";
import { isSentryServerRuntimeEnabled } from "@/lib/observability/sentry-flags";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  emitNnHomePerfDiagLine,
  isNnTraceHomePerfTrue,
} from "@/lib/observability/home-perf-diag";

export async function register() {
  try {
    const runtime = process.env.NEXT_RUNTIME;

    // -----------------------------
    // NODE RUNTIME
    // -----------------------------
    if (runtime === "nodejs") {
      try {
        if (isNnTraceHomePerfTrue()) {
          emitNnHomePerfDiagLine({
            tag: "nn_home_perf_boot",
            pid: process.pid,
            next_runtime: runtime,
            pathname: "(boot)",
            nn_trace_home_perf_env_defined: process.env.NN_TRACE_HOME_PERF !== undefined,
            nn_trace_home_perf_env_len: process.env.NN_TRACE_HOME_PERF?.length ?? 0,
            nn_trace_home_perf_literal_true: true,
          });
        }
      } catch {
        // never block boot on diagnostics
      }

      // Sentry (deferred)
      if (isSentryServerRuntimeEnabled()) {
        try {
          await import("./sentry.server.config");
        } catch {
          // swallow — do not break server boot
        }
      }

      // Node instrumentation (deferred)
      try {
        const mod = await import("@/lib/instrumentation/register-node");
        if (typeof mod.registerNodeInstrumentation === "function") {
          await mod.registerNodeInstrumentation();
        }
      } catch {
        // swallow — instrumentation must never crash app
      }
    }

    // -----------------------------
    // EDGE RUNTIME
    // -----------------------------
    if (runtime === "edge") {
      if (isSentryServerRuntimeEnabled()) {
        try {
          await import("./sentry.edge.config");
        } catch {
          // swallow — edge must stay resilient
        }
      }
    }
  } catch {
    // absolute safety: never let register() crash
  }
}

/**
 * Avoid compile-time Sentry type imports.
 * Keep args as `unknown[]` so Next does not pull Sentry into the server graph.
 */
export async function onRequestError(...args: unknown[]) {
  try {
    const err = args[0];
    const req = args[1] as { url?: string } | undefined;

    const message =
      err instanceof Error ? err.message : typeof err === "string" ? err : "unknown_error";

    safeServerLog("http", "request_error", {
      route: typeof req?.url === "string" ? req.url.slice(0, 160) : "unknown",
      errorName: err instanceof Error ? err.name : "non_error",
      messageSample: message.slice(0, 200),
    });

    if (!isSentryServerRuntimeEnabled()) return;

    const Sentry = await importSentryNextjs().catch(() => null);
    const capture = Sentry?.captureRequestError as
      | ((error: unknown, request: unknown, ...rest: unknown[]) => unknown | Promise<unknown>)
      | undefined;

    if (capture) {
      return capture(...args);
    }
  } catch {
    // never throw from error handler
  }
}