/** Paginated lesson hub for Pre-Nursing modules. */
export const PRE_NURSING_LESSON_HUB_PAGE_SIZE = 12;

/** Stable `pathwayId` query for marketing → learner practice-tests deep links (normalized to `pre-nursing-ca` for CA). */
export const PRE_NURSING_PRACTICE_PATHWAY_QUERY_ID = "pre-nursing" as const;

/** Stored in `Progress.lessonId` for completed Pre-Nursing modules. */
export const PRE_NURSING_PROGRESS_PREFIX = "pre-nursing-module:" as const;

export function preNursingModuleProgressId(slug: string): string {
  return `${PRE_NURSING_PROGRESS_PREFIX}${slug}`;
}

export function parsePreNursingModuleSlugFromLessonId(lessonId: string): string | null {
  if (!lessonId.startsWith(PRE_NURSING_PROGRESS_PREFIX)) return null;
  const slug = lessonId.slice(PRE_NURSING_PROGRESS_PREFIX.length);
  return slug.length > 0 ? slug : null;
}
