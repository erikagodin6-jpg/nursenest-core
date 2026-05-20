/**
 * Shared types for the programmatic SEO engine (metadata merge, link plans, audits).
 * Keep this module importable from tests without `server-only` graphs.
 */

export type ProgrammaticLinkKind = "blog" | "lesson" | "hub" | "pathway_questions" | "pathway_cat" | "lessons_index";

export type ProgrammaticInternalLink = {
  href: string;
  anchor: string;
  kind: ProgrammaticLinkKind;
};

export type ProgrammaticMetadataSource = "manual" | "auto" | "merged";

export type ProgrammaticTitleMerge = {
  title: string;
  source: ProgrammaticMetadataSource;
};

export type ProgrammaticDescriptionMerge = {
  description: string;
  source: ProgrammaticMetadataSource;
};

export type PathwayLessonSeoGraph = {
  pathwayId: string;
  examHubHref: string;
  lessonsIndexHref: string;
  questionsHubHref: string;
  catHubHref: string | null;
  flashcardsHubHref: string;
  topicLessonsHref: string | null;
};
