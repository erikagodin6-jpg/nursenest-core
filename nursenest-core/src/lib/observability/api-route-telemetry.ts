import "server-only";

import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { emitMonitoringRecord } from "@/lib/observability/observability-record";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { sentryCount, sentryDistribution } from "@/lib/observability/sentry-metrics";

/** Alert when an API route exceeds this duration (ms). Tunable via env. */
export function slowApiThresholdMs(): number {
  const raw = process.env.NN_SLOW_API_ROUTE_MS?.trim();
  const n = raw ? Number(raw) : 8000;
  return Number.isFinite(n) && n >= 500 ? Math.min(120_000, n) : 8000;
}

export type ApiRouteTelemetryOpts = {
  req: Request;
  routeId: string;
  startedAt: number;
  response: Response;
  /** For dashboards / Sentry attributes (keep low cardinality). */
  flow?: "billing" | "auth" | "content" | "public" | "admin" | "cron" | "webhook" | "other";
};

/**
 * Call once per Route Handler completion with the final `Response`.
 * Emits structured records, slow-route logs, 5xx/4xx signal logs, and Sentry metrics when enabled.
 */
/**
 * Wrap a Route Handler body: records telemetry once with the final response (status + duration).
 */
export async function runWithApiTelemetry(
  req: Request,
  routeId: string,
  flow: NonNullable<ApiRouteTelemetryOpts["flow"]>,
  fn: () => Promise<Response>,
): Promise<Response> {
  const startedAt = performance.now();
  const response = await fn();
  recordApiRouteTelemetry({ req, routeId, startedAt, response, flow });
  return response;
}

export function recordApiRouteTelemetry(opts: ApiRouteTelemetryOpts): void {
  const { req, routeId, startedAt, response, flow = "other" } = opts;
  const durationMs = Math.round(performance.now() - startedAt);
  const correlationId = correlationIdFromRequest(req);
  const httpStatus = response.status;
  const route = routeId.slice(0, 160);
  const slowMs = slowApiThresholdMs();

  emitMonitoringRecord({
    scope: "api",
    event: "request_completed",
    severity: httpStatus >= 500 ? "error" : httpStatus >= 400 ? "warn" : "info",
    correlationId,
    route,
    httpStatus,
    durationMs,
    flow,
  });

  sentryDistribution("api.route.duration_ms", durationMs, {
    route: route.replace(/\/[a-f0-9-]{36}/gi, "/:id").slice(0, 120),
    flow,
  });
  sentryCount("api.route.count", 1, {
    status_bucket: httpStatus >= 500 ? "5xx" : httpStatus >= 400 ? "4xx" : "2xx",
    flow,
  });

  if (durationMs >= slowMs) {
    sentryCount("api.route.slow", 1, { flow });
    safeServerLog("api_perf", "slow_route", {
      route,
      durationMs,
      httpStatus,
      correlation: correlationId ?? "",
      flow,
    });
    emitMonitoringRecord({
      scope: "api_perf",
      event: "slow_route",
      severity: "warn",
      correlationId,
      route,
      httpStatus,
      durationMs,
      flow,
    });
  }

  if (httpStatus >= 500) {
    safeServerLogCritical(
      "api",
      "http_5xx",
      { route, httpStatus, durationMs, correlation: correlationId ?? "", flow },
      undefined,
      { flow, route: route.slice(0, 80) },
    );
  } else if (httpStatus === 429) {
    safeServerLog("api", "http_429", { route, durationMs, correlation: correlationId ?? "", flow });
  } else if (httpStatus >= 400 && httpStatus < 500) {
    safeServerLog("api", "http_4xx", {
      route,
      httpStatus,
      durationMs,
      correlation: correlationId ?? "",
      flow,
    });
  }
}
