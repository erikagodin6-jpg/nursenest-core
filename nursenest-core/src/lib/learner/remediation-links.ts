import { resolveStudyLoopCatHref } from "@/lib/exam-pathways/study-loop-cat-routing";

export function remediationTopicDrillHref(topic: string, pathwayId?: string | null): string {
  const q = new URLSearchParams({
    preset: "topic_drill",
    topic: topic.trim(),
  });
  const pathway = pathwayId?.trim();
  if (pathway) q.set("pathwayId", pathway);
  return `/app/questions?${q.toString()}`;
}

/**
 * App lessons list with optional topic / topicSlug filter (pathway lessons branch).
 */
export function remediationLessonsTopicHref(
  topic: string,
  topicSlug?: string | null,
  pathwayId?: string | null,
): string {
  const pathway = pathwayId?.trim();
  const slug = topicSlug?.trim();
  if (slug) {
    const q = new URLSearchParams({ topicSlug: slug.toLowerCase() });
    if (pathway) q.set("pathwayId", pathway);
    return `/app/lessons?${q.toString()}`;
  }
  const q = new URLSearchParams({ topic: topic.trim() });
  if (pathway) q.set("pathwayId", pathway);
  return `/app/lessons?${q.toString()}`;
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
  return resolveStudyLoopCatHref({
    authState: "signed_in",
    pathwayId,
    intent: "weak_focus",
    topic,
  });
}

