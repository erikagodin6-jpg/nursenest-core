import { appCatWeakFocusPath } from "@/lib/exam-pathways/pathway-cat-flow";

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
  return remediationWeakModeTestHrefForPathway(topic, null);
}

export function remediationWeakModeTestHrefForPathway(
  topic?: string,
  pathwayId?: string | null,
): string {
  const q = new URLSearchParams({ focus: "weak" });
  const topicLabel = topic?.trim();
  if (topicLabel) q.set("topic", topicLabel);
  const pathway = pathwayId?.trim();
  if (pathway) q.set("pathwayId", pathway);
  return `/app/practice-tests?${q.toString()}`;
}

export function remediationCatPracticeHref(topic?: string, pathwayId?: string | null): string {
  return appCatWeakFocusPath(pathwayId, topic);
}

