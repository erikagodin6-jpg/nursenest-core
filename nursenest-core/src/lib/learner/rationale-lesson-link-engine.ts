/**
 * Thin adapter: **question bank metadata** → ranked lesson slugs for rationale links.
 * @see `@/lib/learner/lesson-question-rationale` for the mapping model and registry.
 */
import { pathwayRationaleContextFromId } from "@/lib/learner/lesson-question-rationale/pathway-context";
import { rankRelatedLessonSlugsForQuestion } from "@/lib/learner/lesson-question-rationale/match";
import type { RationaleLessonLinkKind } from "@/lib/learner/lesson-question-rationale/types";
import { mapTopicCodeToCanonicalClusterSlug } from "@/lib/lessons/lesson-topic-cluster-registry";
import { deriveTopicCode } from "@/lib/learner/topic-linking";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";

export type { RationaleLessonLinkKind };

export type RationaleLessonSlugCandidate = {
  slug: string;
  kind: RationaleLessonLinkKind;
  score: number;
};

/**
 * Returns up to `max` lesson slug candidates, deduped by slug (highest score wins).
 * Uses the shared registry + ranking in `lesson-question-rationale`.
 */
export function inferRationaleLessonSlugCandidates(
  args: {
    topic?: string | null;
    subtopic?: string | null;
    bodySystem?: string | null;
    tags: string[];
    pathwayId?: string | null;
  },
  max = 3,
): RationaleLessonSlugCandidate[] {
  const pathwayCtx = pathwayRationaleContextFromId(args.pathwayId);
  const topicCode =
    deriveTopicCode({ topic: args.topic, subtopic: args.subtopic, bodySystem: args.bodySystem }) ?? null;

  const ranked = rankRelatedLessonSlugsForQuestion(
    {
      topic: args.topic,
      subtopic: args.subtopic,
      bodySystem: args.bodySystem,
      tags: args.tags ?? [],
      topicCode,
    },
    pathwayCtx,
    { maxLinks: max },
  );

  return ranked.map((r) => ({ slug: r.lessonSlug, kind: r.kind, score: r.score }));
}

/**
 * Best-effort canonical topic slug for hub URLs (no pathway filter). Prefer
 * {@link pickTopicClusterSlugForPathway} when pathway lesson index is known.
 */
export function topicClusterSlugForHub(topicCode: string | null): string | null {
  if (!topicCode || topicCode === "general") return null;
  return mapTopicCodeToCanonicalClusterSlug(topicCode);
}

export function normalizedTopicCodeForQuestion(args: {
  topic?: string | null;
  subtopic?: string | null;
  bodySystem?: string | null;
}): string | null {
  const sub = (args.subtopic ?? "").trim();
  if (sub.length > 1) return normalizeTopicKey(sub);
  const top = (args.topic ?? "").trim();
  if (top.length > 1) return normalizeTopicKey(top);
  const bs = (args.bodySystem ?? "").trim();
  if (bs.length > 1) return normalizeTopicKey(bs);
  return null;
}
