/**
 * Structured admin audit lines for platform log drains (no secrets, no full user ids).
 * Correlation: prefers edge/request ids when present on the incoming Request.
 */
import type { AdminSession } from "@/lib/admin/admin-types";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type AdminAuditGateResult = "allowed" | "denied_no_session" | "denied_rbac";

/**
 * Logs admin API authorization outcomes. Safe fields only (prefixes, tiers, truncated paths).
 */
export function logAdminApiGate(opts: {
  req?: Request;
  path: string;
  admin?: AdminSession | null;
  result: AdminAuditGateResult;
}): void {
  const actorPrefix = opts.admin?.userId ? opts.admin.userId.slice(0, 8) : "";
  const severity =
    opts.result === "allowed" ? "info" : ("expected_denial" as const);
  safeServerLog("admin_audit", "api_gate", {
    result: opts.result,
    method: (opts.req?.method ?? "").slice(0, 16),
    path: opts.path.slice(0, 200),
    actorPrefix,
    tier: opts.admin?.tier ?? "",
    role: String(opts.admin?.role ?? "").slice(0, 32),
    correlation: correlationIdFromRequest(opts.req) ?? "",
    severity,
  });
}
