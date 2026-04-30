import { buildAppFlashcardsWeakTopicHref, buildAppLessonsReviewLessonHref } from "@/lib/learner/app-study-internal-links";
import { pathwayLessonEligibleForLearnerStudyInventory } from "@/lib/learner-study-hub/pathway-lesson-learner-study-guards";
import { getCatalogPathwayLessonsSync } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { classifyQuestionTopicIntoLessonCategory } from "@/lib/questions/pathway-question-category-structure";

export type ClinicalScenarioCompletionStudyBundle = {
  relatedLessons: Array<{ slug: string; title: string; href: string }>;
  weakFlashcardsHref: string;
};

/**
 * After a clinical scenario, suggest **existing catalog lessons** in the same canonical study category
 * and a **flashcards hub** deep link (topic + weak filter) — no duplicated lesson bodies.
 */
export function buildClinicalScenarioCompletionStudyBundle(args: {
  pathwayId: string;
  canonicalCategoryId: string;
  /** Max related lesson links (catalog slugs only). */
  lessonLimit?: number;
}): ClinicalScenarioCompletionStudyBundle | null {
  const pathwayId = args.pathwayId.trim();
  const canonicalCategoryId = args.canonicalCategoryId.trim();
  if (!pathwayId || !canonicalCategoryId) return null;

  const limit = Math.min(Math.max(1, args.lessonLimit ?? 5), 12);
  const lessons = getCatalogPathwayLessonsSync(pathwayId).filter(pathwayLessonEligibleForLearnerStudyInventory);
  const matched = lessons.filter(
    (l) => classifyQuestionTopicIntoLessonCategory(l.topic, pathwayId).categoryId === canonicalCategoryId,
  );
  const relatedLessons = matched.slice(0, limit).map((l) => ({
    slug: l.slug,
    title: l.title,
    href: buildAppLessonsReviewLessonHref(pathwayId, l.slug),
  }));

  const weakFlashcardsHref = buildAppFlashcardsWeakTopicHref(pathwayId, canonicalCategoryId);
  return { relatedLessons, weakFlashcardsHref };
}
