import { buildAppLessonsReviewLessonHref } from "@/lib/learner/app-study-internal-links";
import { getCatalogPathwayLessonDisplayTitleForSlug } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { pathwayLessonSlugFromFlashcardFields } from "@/lib/flashcards/flashcard-pathway-lesson-slug";

export type FlashcardLessonCrossLink = {
  lessonStudyHref: string;
  lessonStudyTitle: string;
} | null;

/**
 * Resolves a subscriber-visible lesson review link for a flashcard row + deck pathway.
 * Uses catalog titles only — no duplicated authoring.
 */
export function flashcardLessonCrossLinkForDeckStudyRow(
  pathwayId: string | null | undefined,
  row: { lessonId?: string | null; sourceKey?: string | null },
): FlashcardLessonCrossLink {
  const pid = typeof pathwayId === "string" ? pathwayId.trim() : "";
  const slug = pathwayLessonSlugFromFlashcardFields(row);
  if (!pid || !slug) return null;
  const title = getCatalogPathwayLessonDisplayTitleForSlug(pid, slug)?.trim();
  if (!title) return null;
  return {
    lessonStudyHref: buildAppLessonsReviewLessonHref(pid, slug),
    lessonStudyTitle: title,
  };
}
