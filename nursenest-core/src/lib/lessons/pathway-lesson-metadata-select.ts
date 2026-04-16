import type { Prisma } from "@prisma/client";

/**
 * Shared Prisma select for learner/dashboard list paths that need pathway metadata + structural gate
 * **without** `sections` JSON. Detail routes should load full rows (including `sections`) separately.
 */
export const PATHWAY_LESSON_METADATA_LIST_SELECT = {
  id: true,
  pathwayId: true,
  slug: true,
  title: true,
  topic: true,
  topicSlug: true,
  bodySystem: true,
  previewSectionCount: true,
  seoTitle: true,
  seoDescription: true,
  locale: true,
  structuralPublicComplete: true,
} satisfies Prisma.PathwayLessonSelect;

export type PathwayLessonMetadataListRow = Prisma.PathwayLessonGetPayload<{
  select: typeof PATHWAY_LESSON_METADATA_LIST_SELECT;
}>;
