/**
 * Slug list for `/questions/{slug}` programmatic pages — constants only (no page payloads).
 * Keep in sync with {@link ./programmatic-question-topic-registry-pages}.
 */
export const PROGRAMMATIC_QUESTION_TOPIC_SLUGS = [
  "heart-failure-nclex",
  "infection-control-nursing",
  "dha-exam-practice",
] as const;

export function getAllProgrammaticQuestionTopicSlugs(): readonly string[] {
  return PROGRAMMATIC_QUESTION_TOPIC_SLUGS;
}

export function isProgrammaticQuestionTopicSlug(slug: string): boolean {
  return (PROGRAMMATIC_QUESTION_TOPIC_SLUGS as readonly string[]).includes(slug);
}
