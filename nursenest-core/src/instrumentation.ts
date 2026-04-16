import * as Sentry from "@sentry/nextjs";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { registerNodeInstrumentation } = await import("@/instrumentation/register-node");
    await registerNodeInstrumentation();
    if (process.env.SENTRY_ENABLED === "true") {
      await import("./sentry.server.config");
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
