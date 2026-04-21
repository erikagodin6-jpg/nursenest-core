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

let bySlugCache: Map<string, ProgrammaticQuestionTopicDefinition> | null = null;

function getBySlugMap(): Map<string, ProgrammaticQuestionTopicDefinition> {
  if (!bySlugCache) {
    bySlugCache = new Map(PROGRAMMATIC_QUESTION_TOPIC_PAGES.map((p) => [p.slug, p]));
  }
  return bySlugCache;
}

export function getProgrammaticQuestionTopicDefinition(
  slug: string,
): ProgrammaticQuestionTopicDefinition | undefined {
  return getBySlugMap().get(slug);
}

export function getAllProgrammaticQuestionTopicSlugs(): string[] {
  return PROGRAMMATIC_QUESTION_TOPIC_PAGES.map((p) => p.slug);
}
