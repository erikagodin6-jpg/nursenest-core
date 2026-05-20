import { safeServerLog } from "@/lib/observability/safe-server-log";

export type StudyInventorySurface = "lessons" | "flashcards" | "practice_exams";

export type StudyInventoryFailoverOutcome = "ok" | "degraded_snapshot" | "empty" | "error";

export type StudyInventoryFailoverResult<T> = {
  data: T;
  source_used: "primary" | "secondary";
  failover_reason?: string;
  snapshot_version?: string;
  snapshot_age_ms?: number;
  final_outcome: StudyInventoryFailoverOutcome;
};

/**
 * Try a primary loader, then an optional secondary (published snapshot / last-known-good).
 * **No fabricated rows** — secondary must return the same normalized contract as primary.
 *
 * Wire real snapshot readers here when durable snapshot storage is available; until then
 * callers pass `secondary: null` and failures surface as explicit errors.
 */
export async function loadStudyInventoryWithFailover<T>(args: {
  surface: StudyInventorySurface;
  user_id_prefix?: string;
  pathway_id?: string;
  primary: () => Promise<T>;
  secondary?: (() => Promise<T>) | null;
  isEmpty: (data: T) => boolean;
}): Promise<StudyInventoryFailoverResult<T>> {
  const t0 = performance.now();
  const { surface, user_id_prefix, pathway_id, primary, secondary, isEmpty } = args;

  try {
    const data = await primary();
    const duration_ms = Math.round(performance.now() - t0);
    const empty = isEmpty(data);
    safeServerLog("platform_contract", "learner_study_load_diagnostics", {
      event: "learner_study_load_diagnostics",
      operation: "loadStudyInventoryWithFailover",
      feature_surface: surface,
      duration_ms,
      outcome: empty ? "empty" : "ok",
      user_id_prefix,
      pathway_id,
      fallback_used: "false",
      source_used: "primary",
      final_outcome: empty ? "empty" : "ok",
    });
    return {
      data,
      source_used: "primary",
      final_outcome: empty ? "empty" : "ok",
    };
  } catch (primaryErr) {
    const reason =
      primaryErr instanceof Error ? primaryErr.message.slice(0, 400) : String(primaryErr).slice(0, 400);
    if (!secondary) {
      const duration_ms = Math.round(performance.now() - t0);
      safeServerLog("platform_contract", "learner_study_load_diagnostics", {
        event: "learner_study_load_diagnostics",
        operation: "loadStudyInventoryWithFailover",
        feature_surface: surface,
        duration_ms,
        outcome: "error",
        user_id_prefix,
        pathway_id,
        reason,
        fallback_used: "false",
        source_used: "primary",
        final_outcome: "error",
      });
      throw primaryErr;
    }
    try {
      const data = await secondary();
      const duration_ms = Math.round(performance.now() - t0);
      const empty = isEmpty(data);
      safeServerLog("platform_contract", "learner_study_load_diagnostics", {
        event: "learner_study_load_diagnostics",
        operation: "loadStudyInventoryWithFailover",
        feature_surface: surface,
        duration_ms,
        outcome: "degraded",
        user_id_prefix,
        pathway_id,
        reason,
        fallback_used: "true",
        source_used: "secondary",
        final_outcome: empty ? "empty" : "degraded_snapshot",
      });
      return {
        data,
        source_used: "secondary",
        failover_reason: reason,
        final_outcome: empty ? "empty" : "degraded_snapshot",
      };
    } catch (secondaryErr) {
      const duration_ms = Math.round(performance.now() - t0);
      const secReason =
        secondaryErr instanceof Error ? secondaryErr.message.slice(0, 400) : String(secondaryErr).slice(0, 400);
      safeServerLog("platform_contract", "learner_study_load_diagnostics", {
        event: "learner_study_load_diagnostics",
        operation: "loadStudyInventoryWithFailover",
        feature_surface: surface,
        duration_ms,
        outcome: "error",
        user_id_prefix,
        pathway_id,
        reason: `${reason} | secondary: ${secReason}`,
        fallback_used: "true",
        source_used: "primary",
        final_outcome: "error",
      });
      throw secondaryErr;
    }
  }
}
