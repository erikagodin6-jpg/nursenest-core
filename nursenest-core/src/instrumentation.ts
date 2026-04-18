import { isSentryServerRuntimeEnabled } from "@/lib/observability/sentry-flags";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
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
  const Sentry = await import("@sentry/nextjs");
  return Sentry.captureRequestError(...args);
}
