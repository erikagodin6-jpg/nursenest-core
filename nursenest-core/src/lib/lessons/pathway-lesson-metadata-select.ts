import type { Prisma } from "@prisma/client";

/**
 * Same fields as {@link PATHWAY_LESSON_METADATA_LIST_SELECT} but **without** `structuralPublicComplete`
 * for databases that have not yet applied migration `20260416160000_pathway_lessons_structural_public_complete`.
 * Callers should default missing boolean to `false` when matching {@link PathwayLessonDashboardRow}.
 */
export const PATHWAY_LESSON_METADATA_LIST_SELECT_WITHOUT_STRUCTURAL_PUBLIC = {
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
} satisfies Prisma.PathwayLessonSelect;

/**
 * Shared Prisma select for learner/dashboard list paths that need pathway metadata + structural gate
 * **without** `sections` JSON. Detail routes should load full rows (including `sections`) separately.
 */
export const PATHWAY_LESSON_METADATA_LIST_SELECT = {
  ...PATHWAY_LESSON_METADATA_LIST_SELECT_WITHOUT_STRUCTURAL_PUBLIC,
  structuralPublicComplete: true,
} satisfies Prisma.PathwayLessonSelect;

export type PathwayLessonMetadataListRow = Prisma.PathwayLessonGetPayload<{
  select: typeof PATHWAY_LESSON_METADATA_LIST_SELECT;
}>;
