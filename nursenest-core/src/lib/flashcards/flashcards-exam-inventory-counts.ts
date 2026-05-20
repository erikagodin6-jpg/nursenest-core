import { resolveBuilderCategoryId } from "@/lib/flashcards/flashcard-builder-taxonomy";

/**
 * Prisma `groupBy` row for `(bodySystem, topic)` buckets on `exam_questions`.
 * Used by flashcards hub inventory — same bucket key the legacy per-row loop used
 * for {@link resolveBuilderCategoryId} (only `examBodySystem` / `examTopic` / label).
 */
export type ExamQuestionTopicBodyGroupRow = {
  bodySystem: string | null;
  topic: string | null;
  _count: { _all: number };
};

/**
 * Folds `groupBy(['bodySystem','topic'])` buckets into builder-category totals.
 * Deterministic with the historical per-question loop because classification only
 * consulted `bodySystem`, `topic`, and `pathwayId` for exam rows.
 */
export function foldExamQuestionTopicBodyGroupsIntoBuilderCounts(
  groups: ReadonlyArray<ExamQuestionTopicBodyGroupRow>,
  pathwayId: string,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const g of groups) {
    const n = g._count._all;
    if (!Number.isFinite(n) || n <= 0) continue;
    const categoryId = resolveBuilderCategoryId({
      label: g.topic?.trim() || g.bodySystem?.trim() || "General",
      topicCode: null,
      pathwayId,
      deckTitle: null,
      front: "",
      back: "",
      examBodySystem: g.bodySystem,
      examTopic: g.topic,
    });
    counts[categoryId] = (counts[categoryId] ?? 0) + n;
  }
  return counts;
}
