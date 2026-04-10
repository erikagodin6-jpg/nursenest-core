import type { CheckStatus, OverallSystemStatus, SystemCheckResult } from "@/lib/admin/system-status-types";

/**
 * Derive overall platform status from individual checks.
 *
 * Rules (v1):
 * - **failed**: any **critical** check is `failed` — `appReadiness`, `database`, `configSanity`.
 * - **degraded**: no critical `failed`, but any check is `degraded` or `failed` on a non-critical card
 *   (e.g. `queueHealth`, `contentHealth`, `appLiveness` — currently only queue/content use degraded/failed).
 * - **healthy**: all checks `healthy`.
 *
 * Note: a **critical** check in `degraded` (e.g. DB connected but migration table unreadable) yields **degraded** overall,
 * not failed — only `status === "failed"` on critical ids triggers Down.
 */
const CRITICAL_IDS = new Set<SystemCheckResult["id"]>(["appReadiness", "database", "configSanity"]);

export function classifyOverallStatus(checks: SystemCheckResult[]): OverallSystemStatus {
  if (checks.some((c) => CRITICAL_IDS.has(c.id) && c.status === "failed")) {
    return "failed";
  }
  if (checks.some((c) => c.status === "failed" || c.status === "degraded")) {
    return "degraded";
  }
  return "healthy";
}

/** Unit-test helper: map check id → status */
export function checksToStatusMap(checks: SystemCheckResult[]): Record<string, CheckStatus> {
  return Object.fromEntries(checks.map((c) => [c.id, c.status])) as Record<string, CheckStatus>;
}
