/**
 * Opt-in server timing for `/app/lessons` hub + detail investigations.
 * Enable with `NN_LESSONS_PERF_LOG=1` in any NODE_ENV, or logs automatically in development.
 */
import { performance } from "node:perf_hooks";

export type LessonsPerfPhase =
  | "route_start"
  | "route_end"
  | "catalog_build_start"
  | "catalog_build_end"
  | "catalog_size"
  | "summary_index_start"
  | "summary_index_end"
  | "detail_lookup_start"
  | "detail_lookup_end"
  | "personalization_start"
  | "personalization_end"
  | "effective_hub_catalog";

function lessonsPerfEnabled(): boolean {
  if (process.env.NN_LESSONS_PERF_LOG === "1") return true;
  return process.env.NODE_ENV !== "production";
}

export function lessonsPerfMark(phase: LessonsPerfPhase, extra?: Record<string, string | number>): void {
  if (!lessonsPerfEnabled()) return;
  const t = Math.round(performance.now());
  const suffix = extra && Object.keys(extra).length ? ` ${JSON.stringify({ ...extra, t_ms: t })}` : ` {"t_ms":${t}}`;
  console.info(`[lessons-perf] ${phase}${suffix}`);
}
