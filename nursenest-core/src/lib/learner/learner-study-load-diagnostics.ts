import "server-only";

import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Structured outcome for learner study loaders (progress, guided, dashboard segments). */
export type LearnerStudyLoadOutcome = "ok" | "empty" | "error" | "degraded" | "timeout";

/**
 * Platform-contract diagnostics for critical learner study loads.
 * Prefer this over ad-hoc strings so log pipelines can filter `outcome` / `segment` / `fallback_used`.
 */
export function logLearnerStudyLoadDiagnostics(fields: {
  operation: string;
  feature_surface: string;
  duration_ms: number;
  outcome: LearnerStudyLoadOutcome;
  segment?: string;
  pathway_id?: string;
  exam?: string;
  locale?: string;
  user_id_prefix?: string;
  source_row_count?: string;
  reason?: string;
  error_class?: string;
  fallback_used?: "true" | "false";
  live_outcome?: string;
  snapshot_used?: "true" | "false";
  final_outcome?: string;
}): void {
  safeServerLog("platform_contract", "learner_study_load_diagnostics", {
    event: "learner_study_load_diagnostics",
    fallback_used: fields.fallback_used ?? "false",
    ...fields,
  });
}
