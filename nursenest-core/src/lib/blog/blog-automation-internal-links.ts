import type { BlogLessonLinkRow } from "@/lib/blog/blog-control-panel-schema";

export type BrokenInternalLinkSummary = { path: string; pathStatus: string; label?: string };

/** Lesson rows that failed allowlist or are not found in published pathway lessons. */
export function summarizeBrokenInternalLessonLinks(rows: BlogLessonLinkRow[]): BrokenInternalLinkSummary[] {
  return rows
    .filter((r) => r.pathStatus === "not_found" || r.pathStatus === "invalid_allowlist")
    .map((r) => ({
      path: r.suggestedPath,
      pathStatus: r.pathStatus ?? "unknown",
      label: r.label,
    }));
}
