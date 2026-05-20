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
