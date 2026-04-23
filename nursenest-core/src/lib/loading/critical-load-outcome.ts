/**
 * Typed outcomes for **critical** server loads where empty must never masquerade as a thrown/timeout failure.
 * Call sites should branch UI on `status`; do not collapse `error` into `empty` without logging.
 */

import { safeServerLog } from "@/lib/observability/safe-server-log";

export type CriticalLoadResult<T> =
  | { status: "ok"; data: T; durationMs: number }
  | { status: "empty"; data: T; durationMs: number }
  | { status: "error"; reason: string; retryable: boolean; durationMs: number };

/** Alias for product specs / audits that refer to `LoadResult`. */
export type LoadResult<T> = CriticalLoadResult<T>;

/** How eligibility was resolved relative to Next.js data cache (for diagnostics only). */
export type ContractCacheMode = "fresh" | "cached" | "mixed" | "unknown";

/**
 * Structured contract diagnostics for critical loaders (server-only).
 * Prefer this over ad hoc `console` strings so timeouts vs true-empty stay separable in logs.
 */
export function logContractLoadDiagnostics(fields: {
  operation: string;
  duration_ms: number;
  cache_mode?: ContractCacheMode;
  pathway_id?: string;
  exam_code?: string;
  country?: string;
  locale?: string;
  feature?: string;
  outcome: "ok" | "empty" | "error" | "timeout";
  prepared_count?: number;
  kept_count?: number;
  error_class?: string;
  error_message?: string;
  destination_href?: string;
}): void {
  safeServerLog("platform_contract", "critical_load_diagnostics", {
    ...fields,
    fallback_used: "false",
  });
}

export function describeRejectedTask(taskName: string, err: unknown): { reason: string; retryable: boolean } {
  const message = err instanceof Error ? err.message : String(err);
  const retryable =
    /timeout|ETIMEDOUT|ECONNRESET|EAI_AGAIN|hub_optional_task_timeout/i.test(message) ||
    message.includes("PrismaClientInitializationError");
  return { reason: `${taskName}:${message.slice(0, 400)}`, retryable };
}
