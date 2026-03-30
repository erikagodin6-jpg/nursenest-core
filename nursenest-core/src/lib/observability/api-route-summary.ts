import { recordRouteHttpFailure } from "@/lib/observability/route-failure-tracker";
import { logApiPayloadAlert, logLargeApiResponse } from "@/lib/observability/perf-log";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type ApiUserClass = "guest" | "subscriber" | "admin" | "unknown";

export type ApiRequestSummaryOpts = {
  /** Stable label e.g. `GET /api/public/home-stats` */
  route: string;
  request: Request;
  response: Response;
  startedAt: number;
  userType: ApiUserClass;
};

/**
 * Node route handlers: call once per response for duration, status, optional payload size, and alert hooks.
 * Does not read response bodies (uses Content-Length when present).
 */
export function logNodeApiRequestSummary(opts: ApiRequestSummaryOpts): void {
  const durationMs = Date.now() - opts.startedAt;
  const route = opts.route.slice(0, 200);
  const clOut = opts.response.headers.get("content-length");
  const approxResponseBytes = clOut ? Number(clOut) : undefined;
  const clIn = opts.request.headers.get("content-length");
  const requestContentLength = clIn ? Number(clIn) : undefined;

  safeServerLog("api", "api_request_summary", {
    route,
    method: opts.request.method.slice(0, 16),
    status: opts.response.status,
    durationMs,
    approxResponseBytes: Number.isFinite(approxResponseBytes) ? approxResponseBytes : undefined,
    requestContentLength: Number.isFinite(requestContentLength) ? requestContentLength : undefined,
    userType: opts.userType,
  });

  if (opts.response.status >= 400) {
    recordRouteHttpFailure(route, opts.response.status);
    if (opts.response.status >= 500) {
      safeServerLog("api", "api_error_response", {
        route,
        status: opts.response.status,
        durationMs,
        userType: opts.userType,
      });
    } else {
      safeServerLog("api", "api_client_error", {
        route,
        status: opts.response.status,
        durationMs,
        userType: opts.userType,
      });
    }
  }

  if (approxResponseBytes !== undefined && Number.isFinite(approxResponseBytes)) {
    logApiPayloadAlert(route, approxResponseBytes);
    logLargeApiResponse(route, approxResponseBytes);
  }
}
