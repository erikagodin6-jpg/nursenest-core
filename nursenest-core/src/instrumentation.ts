import { importSentryNextjs } from "@/lib/observability/sentry-nextjs-dynamic";
import { isSentryServerRuntimeEnabled } from "@/lib/observability/sentry-flags";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { emitNnHomePerfDiagLine, isNnTraceHomePerfTrue } from "@/lib/observability/home-perf-diag";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    if (isNnTraceHomePerfTrue()) {
      emitNnHomePerfDiagLine({
        tag: "nn_home_perf_boot",
        pid: process.pid,
        next_runtime: process.env.NEXT_RUNTIME,
        pathname: "(boot)",
        nn_trace_home_perf_env_defined: process.env.NN_TRACE_HOME_PERF !== undefined,
        nn_trace_home_perf_env_len: process.env.NN_TRACE_HOME_PERF?.length ?? 0,
        nn_trace_home_perf_literal_true: true,
      });
    }
    if (isSentryServerRuntimeEnabled()) {
      await import("./sentry.server.config");
    }
    const { registerNodeInstrumentation } = await import("@/lib/instrumentation/register-node");
    await registerNodeInstrumentation();
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    if (isSentryServerRuntimeEnabled()) {
      await import("./sentry.edge.config");
    }
  }
}

export async function onRequestError(...args: Parameters<typeof import("@sentry/nextjs").captureRequestError>) {
  const err = args[0];
  const req = args[1] as { url?: string } | undefined;
  const msg = err instanceof Error ? err.message : String(err);
  safeServerLog("http", "request_error", {
    route: typeof req?.url === "string" ? req.url.slice(0, 160) : "unknown",
    errorName: err instanceof Error ? err.name : "non_error",
    messageSample: msg.slice(0, 200),
  });
  if (!isSentryServerRuntimeEnabled()) return;
  const Sentry = await importSentryNextjs();
  return Sentry.captureRequestError(...args);
}
