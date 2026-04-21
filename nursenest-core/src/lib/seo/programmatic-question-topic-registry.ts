/**
 * Indexable `/questions/{slug}` SEO pages — registry-backed copy + bounded DB filters.
 * Add rows in {@link ./programmatic-question-topic-registry-pages}; wire sitemap via {@link getAllProgrammaticQuestionTopicSlugs}.
 */
import {
  PROGRAMMATIC_QUESTION_TOPIC_PAGES,
  type ProgrammaticQuestionTopicDefinition,
} from "./programmatic-question-topic-registry-pages";

export type { ProgrammaticQuestionTopicDefinition };

export { PROGRAMMATIC_QUESTION_TOPIC_PAGES };

const bySlug = new Map(PROGRAMMATIC_QUESTION_TOPIC_PAGES.map((p) => [p.slug, p]));

export function getProgrammaticQuestionTopicDefinition(
  slug: string,
): ProgrammaticQuestionTopicDefinition | undefined {
  return bySlug.get(slug);
}

export function getAllProgrammaticQuestionTopicSlugs(): string[] {
  return PROGRAMMATIC_QUESTION_TOPIC_PAGES.map((p) => p.slug);
}
