import { remediationLessonsTopicHref } from "@/lib/learner/remediation-links";
import type { RationaleLessonLinkClient } from "@/lib/questions/question-bank-client-types";

/**
 * When the grade API returns no pathway lesson rows but the question has a `topic` tag,
 * surface a single app lessons link (filtered list) — no fabricated lesson titles.
 */
export function mergeRationaleLessonLinksWithTopicFallback(
  api: RationaleLessonLinkClient[] | null | undefined,
  topic: string | null | undefined,
  pathwayId?: string | null,
): RationaleLessonLinkClient[] {
  const fromApi = (api ?? []).filter((l) => Boolean(l.href?.trim() && l.ctaKey));
  if (fromApi.length > 0) return fromApi;
  const topicTrim = topic?.trim();
  if (!topicTrim) return [];
  return [
    {
      kind: "topic_lessons",
      slug: `topic-lessons-${topicTrim.slice(0, 40)}`,
      title: topicTrim,
      href: remediationLessonsTopicHref(topicTrim, null, pathwayId),
      hrefSource: "app",
      ctaKey: "learner.qbank.rationaleLinks.openTopicLessons",
    },
  ];
}
