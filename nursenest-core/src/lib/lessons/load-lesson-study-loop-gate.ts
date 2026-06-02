import { sanitizeQuestionIdArray } from "@/lib/lessons/pathway-lesson-catalog-sync";

/** Minimum bank questions to activate the guided study loop (graceful degrade below target count). */
export const LESSON_STUDY_LOOP_MIN_QUESTIONS = 5;

/** Pure gate for learner lesson page: explicit id pack vs topic-discovery bank pack. */
export function shouldUseExplicitLessonStudyLoopPack(opts: {
  hasUserId: boolean;
  hasPathway: boolean;
  lessonStudyLoopEnabled: boolean;
  enablePrePostQuizzes: boolean;
  /** Count of MCQ items that survive server resolution + finalization for the combined pre+post id list. */
  resolvedCombinedExplicitItemCount: number;
}): boolean {
  return (
    opts.hasUserId &&
    opts.hasPathway &&
    opts.lessonStudyLoopEnabled &&
    opts.enablePrePostQuizzes &&
    opts.resolvedCombinedExplicitItemCount >= LESSON_STUDY_LOOP_MIN_QUESTIONS
  );
}

/** Sanitized, deduped union of pre + post ids (order: pre first, then post-only ids). */
export function explicitLessonStudyLoopCombinedSanitizedIds(
  preTestQuestionIds?: string[],
  postTestQuestionIds?: string[],
): string[] {
  const preSan = sanitizeQuestionIdArray(preTestQuestionIds) ?? [];
  const postSan = sanitizeQuestionIdArray(postTestQuestionIds) ?? [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of [...preSan, ...postSan]) {
    if (seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

/** Deduped count of sanitized pre+post exam question ids (study loop activation threshold). */
export function explicitLessonStudyLoopCombinedIdCount(
  preTestQuestionIds?: string[],
  postTestQuestionIds?: string[],
): number {
  return explicitLessonStudyLoopCombinedSanitizedIds(preTestQuestionIds, postTestQuestionIds).length;
}
