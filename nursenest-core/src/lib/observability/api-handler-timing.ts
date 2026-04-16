import "server-only";

import { safeServerLog } from "@/lib/observability/safe-server-log";

function slowApiThresholdMs(): number {
  const raw = process.env.NN_SLOW_API_LOG_MS?.trim();
  const n = raw ? Number(raw) : 3000;
  return Number.isFinite(n) && n >= 500 ? Math.floor(n) : 3000;
}

/**
 * Call after building a Response from a Route Handler to log slow endpoints (ops / load investigation).
 * Does not change status codes or body.
 */
export function logSlowApiResponse(routeLabel: string, startedPerfNow: number, res: Response): Response {
  const durationMs = Math.round(performance.now() - startedPerfNow);
  const threshold = slowApiThresholdMs();
  if (durationMs < threshold) return res;
  safeServerLog("perf", "api_handler_slow", {
    route: routeLabel.slice(0, 120),
    durationMs,
    status: res.status,
  });
  return res;
}
