/**
 * Typed outcomes for **critical** server loads where empty must never masquerade as a thrown/timeout failure.
 * Call sites should branch UI on `status`; do not collapse `error` into `empty` without logging.
 *
 * Canonical name: {@link DataResult}. Prefer `error` (not `reason`) on the `error` branch; `degraded` carries a human reason plus partial data.
 */

import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Single shared discriminated union for learner-critical loads (progress, hubs, study payloads). */
export type DataResult<T> =
  | { status: "ok"; data: T; durationMs: number }
  | { status: "empty"; data: T; durationMs: number }
  | { status: "error"; error: string; retryable: boolean; durationMs: number }
  | { status: "degraded"; data: Partial<T>; reason: string; durationMs: number };

export type CriticalLoadResult<T> = DataResult<T>;

/** Alias for product specs / audits that refer to `LoadResult`. */
export type LoadResult<T> = DataResult<T>;

/** How eligibility was resolved relative to Next.js data cache (for diagnostics only). */
export type ContractCacheMode = "fresh" | "cached" | "mixed" | "unknown";

/**
 * Structured contract diagnostics for critical loaders (server-only).
 * Prefer this over ad hoc `console` strings so timeouts vs true-empty stay separable in logs.
 */
export type CriticalLoadFinalOutcome =
  | "ok"
  | "degraded_snapshot"
  | "empty"
  | "error"
  | "timeout"
  | "invariant_violation";

export function logContractLoadDiagnostics(fields: {
  operation: string;
  duration_ms: number;
  cache_mode?: ContractCacheMode;
  pathway_id?: string;
  exam_code?: string;
  country?: string;
  locale?: string;
  feature?: string;
  /** Legacy coarse outcome (kept for log continuity). */
  outcome: "ok" | "empty" | "error" | "timeout";
  /** Finer product outcome: distinguishes live ok vs degraded snapshot vs invariant violations. */
  final_outcome?: CriticalLoadFinalOutcome;
  feature_surface?: string;
  live_outcome?: "ok" | "error" | "timeout" | "invalid_payload" | "unknown";
  snapshot_used?: "true" | "false";
  snapshot_age_ms?: string;
  prepared_count?: number;
  kept_count?: number;
  error_class?: string;
  error_message?: string;
  destination_href?: string;
  /**
   * True only when a last-known-good snapshot was intentionally used after live load failed.
   * Distinct from DB driver "fallback_used" logs elsewhere.
   */
  fallback_used?: "true" | "false";
}): void {
  const fallback_used = fields.fallback_used ?? "false";
  safeServerLog("platform_contract", "critical_load_diagnostics", {
    ...fields,
    fallback_used,
  });
}

export function describeRejectedTask(taskName: string, err: unknown): { reason: string; retryable: boolean } {
  const message = err instanceof Error ? err.message : String(err);
  const retryable =
    /timeout|ETIMEDOUT|ECONNRESET|EAI_AGAIN|hub_optional_task_timeout/i.test(message) ||
    message.includes("PrismaClientInitializationError");
  return { reason: `${taskName}:${message.slice(0, 400)}`, retryable };
}
