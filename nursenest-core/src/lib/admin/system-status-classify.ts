import type { CheckStatus, OverallSystemStatus, SystemCheckResult } from "@/lib/admin/system-status-types";

/** Jobs stuck in RUNNING longer than this are flagged (minutes). */
export const STUCK_RUNNING_THRESHOLD_MINUTES = 30;

/**
 * Derive overall platform status from individual checks.
 *
 * Rules:
 * - **failed**: a **critical** check (`appReadiness`, `database`, `auth`) is `failed` — platform down / unsafe.
 * - **degraded**: no critical failure, but any check is `degraded` or **non-critical** `failed` (e.g. Stripe, OpenAI policy).
 * - **healthy**: all checks `healthy`.
 */
const CRITICAL_IDS = new Set<SystemCheckResult["id"]>(["appReadiness", "database", "auth"]);

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
