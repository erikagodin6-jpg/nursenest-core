import type { PathwayLessonsPageResult } from "@/lib/lessons/pathway-lesson-loader";
import { PATHWAY_HUB_PAGE_SIZE_DEFAULT } from "@/lib/lessons/pathway-lesson-scale";
import type { PathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";

/** Safe default when DB/cache for question counts is unavailable. */
export const EMPTY_QUESTION_SNAPSHOT: PathwayQuestionBankSnapshot = { status: "unavailable" };

export const ZERO_LESSON_COUNT = 0;

/** Empty paginated hub when lesson list load fails — keeps redirects and layout stable. */
export function emptyPathwayLessonsPageResult(page: number, pageSize: number): PathwayLessonsPageResult {
  const ps = Math.max(1, Math.floor(pageSize)) || PATHWAY_HUB_PAGE_SIZE_DEFAULT;
  const p = Math.max(1, Math.floor(page));
  return {
    items: [],
    total: 0,
    page: p,
    pageSize: ps,
    pageCount: 1,
    /** Keeps hub + toolbar on the same shape as {@link getPathwayLessonsPageImpl} (no `items`-only fallback drift). */
    renderableAll: [],
  };
}
