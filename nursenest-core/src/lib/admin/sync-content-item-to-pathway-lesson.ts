import type { ContentItem } from "@prisma/client";

/**
 * TODO: TEMPORARY COMPATIBILITY ONLY
 * PathwayLesson is now the source of truth for pathway lessons at runtime and in admin editing.
 * Remove after full ContentItem lesson migration.
 *
 * Legacy hook for optional ContentItem → PathwayLesson sync on **ContentItem** publish flows only.
 * PathwayLesson admin `PATCH`/`POST` and `/api/admin/pathway-lessons/*` must **never** call this.
 */
export async function syncPublishedContentItemToPathwayLessons(_lesson: ContentItem): Promise<void> {
  void _lesson;
  // Intentional no-op: pathway catalog authoring is `pathway_lessons` + `/api/admin/pathway-lessons/[id]` only (Option B).
}
