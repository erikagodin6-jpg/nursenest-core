/**
 * Indexable `/questions/{slug}` SEO pages — registry-backed copy + bounded DB filters.
 *
 * The large page-definition array lives in {@link ./programmatic-question-topic-registry-pages} and is
 * loaded on first registry use via `createRequire` so evaluating this module alone does not eagerly
 * execute that payload’s top-level initializer.
 */
import { createRequire } from "node:module";
import type { ProgrammaticQuestionTopicDefinition } from "./programmatic-question-topic-registry-pages";

export type { ProgrammaticQuestionTopicDefinition };

const require = createRequire(import.meta.url);

type PagesModule = typeof import("./programmatic-question-topic-registry-pages");
let pagesModuleCache: PagesModule | null = null;

function getPagesModule(): PagesModule {
  if (!pagesModuleCache) {
    // Lazy sync load: first slug lookup or definition read pulls the copy-heavy pages module.
    pagesModuleCache = require("./programmatic-question-topic-registry-pages") as PagesModule;
  }
  return pagesModuleCache;
}

function getPages(): readonly ProgrammaticQuestionTopicDefinition[] {
  return getPagesModule().PROGRAMMATIC_QUESTION_TOPIC_PAGES;
}

/** Full programmatic topic rows (same reference as {@link ./programmatic-question-topic-registry-pages}). */
export function getProgrammaticQuestionTopicPages(): readonly ProgrammaticQuestionTopicDefinition[] {
  return getPages();
}

let bySlugCache: Map<string, ProgrammaticQuestionTopicDefinition> | null = null;

function getBySlugMap(): Map<string, ProgrammaticQuestionTopicDefinition> {
  if (!bySlugCache) {
    bySlugCache = new Map(getPages().map((p) => [p.slug, p]));
  }
  return bySlugCache;
}

export function getProgrammaticQuestionTopicDefinition(
  slug: string,
): ProgrammaticQuestionTopicDefinition | undefined {
  return getBySlugMap().get(slug);
}

export function getAllProgrammaticQuestionTopicSlugs(): string[] {
  return getPages().map((p) => p.slug);
}
