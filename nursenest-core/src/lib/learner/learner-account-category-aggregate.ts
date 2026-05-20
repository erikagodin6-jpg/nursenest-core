import { CANONICAL_STUDY_CATEGORIES, normalizeStudyCategory } from "@/lib/study/normalize-study-category";

export type TopicSignalForCanonicalAgg = { topic: string; weight?: number };

/**
 * Buckets free-text / bank topic labels into canonical study categories (same model as practice + flashcards hubs).
 */
export function aggregateTopicsByCanonicalStudyCategory(
  pathwayId: string | null | undefined,
  topics: TopicSignalForCanonicalAgg[],
): Array<{ id: string; label: string; count: number }> {
  const counts = new Map<string, number>();
  for (const c of CANONICAL_STUDY_CATEGORIES) {
    counts.set(c.id, 0);
  }
  for (const row of topics) {
    const topic = row.topic?.trim();
    if (!topic) continue;
    const w = row.weight ?? 1;
    const { id } = normalizeStudyCategory({ pathwayId, topic });
    if (id === "uncategorized") continue;
    counts.set(id, (counts.get(id) ?? 0) + w);
  }
  return CANONICAL_STUDY_CATEGORIES.filter((c) => c.id !== "uncategorized").map((c) => ({
    id: c.id,
    label: c.label,
    count: counts.get(c.id) ?? 0,
  }));
}
