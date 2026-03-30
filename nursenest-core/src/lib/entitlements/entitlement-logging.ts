import { safeServerLog, type SafeLogMeta } from "@/lib/observability/safe-server-log";

/** Subscriber or API denied due to tier, country, pathway, or paywall. */
export function logBlockedAccess(meta: SafeLogMeta & { reason: string; surface: string }): void {
  safeServerLog("entitlement", "blocked_access_reason", meta);
}

/** Invariant broken: e.g. published row exists but filters exclude it while list suggested access. */
export function logEntitlementMismatch(meta: SafeLogMeta & { reason: string; surface: string }): void {
  safeServerLog("entitlement", "entitlement_mismatch", meta);
}
