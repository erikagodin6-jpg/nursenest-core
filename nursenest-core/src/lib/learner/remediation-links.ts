export function remediationTopicDrillHref(topic: string): string {
  return `/app/questions?preset=topic_drill&topic=${encodeURIComponent(topic)}`;
}

/**
 * App lessons list with optional topic / topicSlug filter (pathway lessons branch).
 */
export function remediationLessonsTopicHref(topic: string, topicSlug?: string | null): string {
  const slug = topicSlug?.trim();
  if (slug) return `/app/lessons?topicSlug=${encodeURIComponent(slug.toLowerCase())}`;
  return `/app/lessons?topic=${encodeURIComponent(topic.trim())}`;
}

export function remediationWeakModeTestHref(topic?: string): string {
  const base = "/app/practice-tests?focus=weak";
  if (!topic) return base;
  return `${base}&topic=${encodeURIComponent(topic)}`;
}

