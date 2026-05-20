/**
 * Pure gate for public pathway topic links: keep only slugs where an async check reports
 * at least one visible topic-page lesson (typically {@link getLessonsForTopicPage} with pageSize 1).
 * No server/DB imports — unit-testable.
 */
export type TopicClusterPublicCandidate = { topicSlug: string };

export type TopicPageTotalCheck = (topicSlug: string) => Promise<{ total: number }>;

/**
 * Preserves input order. Drops empty/whitespace slugs and clusters whose check returns `total <= 0`.
 */
export async function filterTopicClustersForPublicNavigationByTopicPageTotal<T extends TopicClusterPublicCandidate>(
  clusters: readonly T[],
  check: TopicPageTotalCheck,
): Promise<T[]> {
  const out: T[] = [];
  for (const t of clusters) {
    const slug = typeof t.topicSlug === "string" ? t.topicSlug.trim() : "";
    if (!slug) continue;
    const page = await check(slug);
    if (page.total > 0) out.push(t);
  }
  return out;
}
