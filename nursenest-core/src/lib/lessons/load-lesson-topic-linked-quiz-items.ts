import "server-only";

import type { CountryCode } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { loadLessonBankQuizItemsByExamIds } from "@/lib/lessons/lesson-explicit-exam-question-items";
import type { LessonBankQuizItem } from "@/lib/lessons/exam-question-to-lesson-quiz-item";

/** Focused lesson-page quiz length (active recall, not a bank dump). */
export const LESSON_TOPIC_LINKED_QUIZ_MAX_ITEMS = 18;

export type LoadLessonTopicLinkedQuizItemsResult = {
  items: LessonBankQuizItem[];
  stemIdsRequested: number;
};

/**
 * Resolve MCQ-shaped bank rows for lesson-linked stems (same ordering as {@link loadRelatedExamQuestionStemsForPathwayLesson}).
 */
export async function loadLessonTopicLinkedQuizItems(args: {
  entitlement: AccessScope;
  countryCode: CountryCode;
  stemIds: readonly string[];
  maxItems?: number;
  logContext?: { pathwayId?: string; lessonSlug?: string };
}): Promise<LoadLessonTopicLinkedQuizItemsResult> {
  const cap = args.maxItems ?? LESSON_TOPIC_LINKED_QUIZ_MAX_ITEMS;
  const ordered = args.stemIds.map((id) => id.trim()).filter(Boolean).slice(0, cap);
  if (ordered.length === 0) {
    return { items: [], stemIdsRequested: 0 };
  }
  const res = await loadLessonBankQuizItemsByExamIds({
    entitlement: args.entitlement,
    countryCode: args.countryCode,
    ids: [...ordered],
    context: {
      pathwayId: args.logContext?.pathwayId,
      lessonSlug: args.logContext?.lessonSlug,
      phase: "post",
    },
  });
  return { items: res.items, stemIdsRequested: ordered.length };
}
