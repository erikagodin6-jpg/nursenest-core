/** Paginated lesson hub for Pre-Nursing modules. */
export const PRE_NURSING_LESSON_HUB_PAGE_SIZE = 12;

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
