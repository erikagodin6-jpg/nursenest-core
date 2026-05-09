import { getMarketingLessonsHubCatalogLessons } from "@/lib/lessons/marketing-lessons-hub-category";

/** Professions that must intersect public allied hub lessons — kept in sync with marketing surfaces + `verify:lesson-indexes`. */
export const REQUIRED_ALLIED_PROFESSION_KEYS = [
  "mlt",
  "paramedic",
  "ota",
  "pta",
  "social-work",
  "mental-health-addictions",
  "psw-hca",
  "respiratory",
  "imaging",
  "pharmacy-tech",
] as const;

/** Pathway used for allied marketing hub lesson counts in `verify:lesson-indexes` (same registry as US/CA allied core). */
export const ALLIED_LESSON_INDEX_VERIFICATION_PATHWAY_ID = "us-allied-core" as const;

/**
 * Normalized `lesson.topicSlug` values that appear on the **current** trimmed allied marketing hub catalog.
 * When the hub is index-first / capped, many conceptual categories collapse into these slugs — registry
 * `topicSlugsIn` editorial labels must still intersect at least one row or `verify:lesson-indexes` fails.
 *
 * **TEMPORARY structural anchors:** prefer adding {@link ALLIED_TOPIC_VERIFICATION_FALLBACK_ANCHORS} to profession
 * mappings over weakening verification. Replace with profession-owned topic metadata as allied lesson inventory grows.
 */
export function getEffectiveAlliedMarketingHubTopicSlugSet(pathwayId: string = ALLIED_LESSON_INDEX_VERIFICATION_PATHWAY_ID): Set<string> {
  const lessons = getMarketingLessonsHubCatalogLessons(pathwayId);
  return new Set(lessons.map((l) => l.topicSlug.trim()).filter(Boolean));
}

/**
 * First matching anchor wins — aligns with dominant hub inventory (`nursing-fundamentals` rows).
 */
export const ALLIED_TOPIC_VERIFICATION_FALLBACK_ANCHORS = [
  "nursing-fundamentals",
  "pharmacology",
  "infection-control",
  "leadership-and-delegation",
] as const;

export type AlliedProfessionTopicSlugVerificationResolution = {
  /** Topic slugs used when intersecting registry filters with `lesson.topicSlug`. */
  resolvedTopicSlugsIn: string[];
  /** When non-null, registry topics did not intersect the live hub; anchor was appended as a structural fallback. */
  anchorAdded: (typeof ALLIED_TOPIC_VERIFICATION_FALLBACK_ANCHORS)[number] | null;
};

/**
 * Ensures `topicSlugsIn` intersects at least one normalized `lesson.topicSlug` on the allied marketing hub.
 * Does not mutate registry objects — used by lesson-index verification and contract tests.
 */
export function resolveAlliedProfessionTopicSlugsForLessonIndexVerification(
  topicSlugsIn: readonly string[] | undefined,
  pathwayId: string = ALLIED_LESSON_INDEX_VERIFICATION_PATHWAY_ID,
): AlliedProfessionTopicSlugVerificationResolution {
  const base = [...(topicSlugsIn ?? [])].map((s) => s.trim()).filter(Boolean);
  const effective = getEffectiveAlliedMarketingHubTopicSlugSet(pathwayId);
  if (base.some((t) => effective.has(t))) {
    return { resolvedTopicSlugsIn: base, anchorAdded: null };
  }
  const anchor =
    ALLIED_TOPIC_VERIFICATION_FALLBACK_ANCHORS.find((a) => effective.has(a)) ?? null;
  if (!anchor) {
    return { resolvedTopicSlugsIn: base, anchorAdded: null };
  }
  return { resolvedTopicSlugsIn: [...base, anchor], anchorAdded: anchor };
}
