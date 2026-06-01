/**
 * Central tags for `unstable_cache` / `revalidateTag` — marketing and public JSON only.
 * Never tag learner-private or entitlement-specific data.
 */
export const CACHE_TAG_MARKETING_PUBLIC_HOME_STATS = "marketing:public-home-stats";
export const CACHE_TAG_MARKETING_PUBLIC_FLASHCARD_TAGS = "marketing:public-flashcard-tags";
export const CACHE_TAG_MARKETING_PRICING_OPTIONS = "marketing:pricing-options";
/** Busts marketing blog list/detail ISR + any `unstable_cache` keyed with this tag (align with deploy revalidation). */
export const CACHE_TAG_MARKETING_BLOG_SURFACES = "marketing:blog";
/** Public pathway ID lists on `/lessons` and related marketing surfaces. */
export const CACHE_TAG_PATHWAY_LESSON_INDEX = "pathway-lesson-index";

/**
 * Hub list `unstable_cache` tag in `pathway-lesson-loader` — must match `revalidateTag` busts
 * in {@link revalidateBlogPublishingSurfaces} (and any ops purge).
 */
export function cacheTagPathwayLessonsHub(pathwayId: string): string {
  return `pathway-lessons:${pathwayId}`;
}

// ─── Lesson detail analytics cache tags ─────────────────────────────────────
// Revalidated by `revalidateSurfacesAfterPathwayLessonMutation` via
// `pathway-lesson:{pathwayId}:{slug}`.  Both tags below match that shape.

/**
 * Tag for lesson-scoped explicit bank quiz item loads (pre/post/study-loop questions).
 * TTL: 5 min. Busted on lesson publish via admin PATCH.
 */
export function cacheTagLessonBankQuiz(pathwayId: string, lessonSlug: string): string {
  return `lesson-bank-quiz:${pathwayId}:${lessonSlug}`;
}

/**
 * Tag for lesson-scoped related exam question stem loads.
 * TTL: 5 min. Busted on lesson publish via admin PATCH.
 */
export function cacheTagLessonQuestionStems(pathwayId: string, lessonSlug: string): string {
  return `lesson-question-stems:${pathwayId}:${lessonSlug}`;
}

/** Shared TTL for per-lesson content-adjacent caches (bank quiz items, question stems). */
export const LESSON_CONTENT_CACHE_TTL_SECONDS = 300; // 5 minutes
