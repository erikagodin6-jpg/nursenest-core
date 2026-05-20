/**
 * Indexable `/questions/{slug}` SEO pages — registry-backed copy + bounded DB filters.
 *
 * The large page-definition array lives in {@link ./programmatic-question-topic-registry-pages} and is
 * lazy-loaded on first registry use via `import()` so importing this module alone does not pull the payload
 * into the webpack graph until an async lookup runs.
 */
import type { ProgrammaticQuestionTopicDefinition } from "./programmatic-question-topic-registry-pages";

export type { ProgrammaticQuestionTopicDefinition };

export {
  getAllProgrammaticQuestionTopicSlugs,
  isProgrammaticQuestionTopicSlug,
} from "./programmatic-question-topic-registry-slugs";

let pagesModulePromise: Promise<typeof import("./programmatic-question-topic-registry-pages")> | null = null;

function loadPagesModule(): Promise<typeof import("./programmatic-question-topic-registry-pages")> {
  if (!pagesModulePromise) {
    pagesModulePromise = import("./programmatic-question-topic-registry-pages");
  }
  return pagesModulePromise;
}

async function getPages(): Promise<readonly ProgrammaticQuestionTopicDefinition[]> {
  const m = await loadPagesModule();
  return m.PROGRAMMATIC_QUESTION_TOPIC_PAGES;
}

let bySlugCache: Map<string, ProgrammaticQuestionTopicDefinition> | null = null;

async function getBySlugMap(): Promise<Map<string, ProgrammaticQuestionTopicDefinition>> {
  if (!bySlugCache) {
    const pages = await getPages();
    bySlugCache = new Map(pages.map((p) => [p.slug, p]));
  }
  return bySlugCache;
}

/** Full programmatic topic rows (same reference as {@link ./programmatic-question-topic-registry-pages}). */
export async function getProgrammaticQuestionTopicPages(): Promise<readonly ProgrammaticQuestionTopicDefinition[]> {
  return getPages();
}

export async function getProgrammaticQuestionTopicDefinition(
  slug: string,
): Promise<ProgrammaticQuestionTopicDefinition | undefined> {
  return (await getBySlugMap()).get(slug);
}
