import "server-only";

import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { emitMonitoringRecord } from "@/lib/observability/observability-record";
import { emitStructuredLog } from "@/lib/observability/structured-log";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { sentryCount, sentryDistribution } from "@/lib/observability/sentry-metrics";

/** Alert when an API route exceeds this duration (ms). Tunable via env. */
export function slowApiThresholdMs(): number {
  const raw = process.env.NN_SLOW_API_ROUTE_MS?.trim();
  const n = raw ? Number(raw) : 8000;
  return Number.isFinite(n) && n >= 500 ? Math.min(120_000, n) : 8000;
}

/** Emit `route_timeout` structured log when handler exceeds this (ms). */
export function routeTimeoutLogMs(): number {
  const raw = process.env.NN_ROUTE_TIMEOUT_LOG_MS?.trim();
  const n = raw ? Number(raw) : 45_000;
  return Number.isFinite(n) && n >= 10_000 ? Math.min(300_000, n) : 45_000;
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
 * Wrap a Route Handler body: records telemetry once with the final response (status + duration).
 * Emits structured records, slow-route logs, 5xx/4xx signal logs, and Sentry metrics when enabled.
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
  const timeoutMs = routeTimeoutLogMs();
  const method = req.method;
  const degraded = durationMs >= slowMs;

  let routePath = route;
  try {
    routePath = new URL(req.url).pathname.slice(0, 200);
  } catch {
    /* keep routeId label */
  }

  emitStructuredLog("request_end", httpStatus >= 500 ? "error" : httpStatus >= 400 ? "warn" : "info", {
    correlationId,
    route: routePath,
    method,
    durationMs,
    httpStatus,
    flow,
    degraded,
  });

  if (httpStatus >= 500) {
    emitStructuredLog("request_failed", "error", {
      correlationId,
      route: routePath,
      method,
      durationMs,
      httpStatus,
      flow,
      degraded,
      errorClass: "http_5xx",
      message: `handler returned ${httpStatus}`,
    });
  }

  if (durationMs >= timeoutMs) {
    emitStructuredLog("route_timeout", "error", {
      correlationId,
      route: routePath,
      method,
      durationMs,
      httpStatus,
      flow,
      degraded: true,
      errorClass: "handler_duration_exceeded",
      message: `duration ${durationMs}ms >= ${timeoutMs}ms`,
    });
  }

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
    sentryCount("api.route.rate_limited", 1, { flow });
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
