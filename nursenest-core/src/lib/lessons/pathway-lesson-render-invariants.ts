import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

/**
 * Dev / staff / explicit CI: fail fast when the legacy five-block expander ran despite substantive incoming
 * `sections[]` (regression guard for PathwayLesson-as-sole-render-source).
 */
export function assertPathwayLessonNoLegacyFallbackWithSubstantiveIncoming(opts: {
  lesson: Pick<PathwayLessonRecord, "slug" | "normalizeTrace">;
  staffSession: boolean;
}): void {
  const enforce =
    process.env.NODE_ENV !== "production" ||
    opts.staffSession ||
    process.env.NN_PATHWAY_LESSON_RENDER_ASSERT === "1";
  if (!enforce) return;
  const nt = opts.lesson.normalizeTrace;
  if (!nt?.usedLegacyFiveBlockExpander) return;
  if ((nt.incomingSectionCount ?? 0) <= 0) return;
  if ((nt.totalWordCount ?? 0) < 50) return;
  throw new Error(
    `[LESSON_RENDER] invariant: legacy expander ran for lesson with substantive incoming sections slug=${String(opts.lesson.slug)} incomingSections=${nt.incomingSectionCount} incomingWords=${nt.totalWordCount}`,
  );
}
