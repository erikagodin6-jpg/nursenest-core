import type { ContentItem } from "@prisma/client";

/**
 * TODO: Temporary compatibility bridge. PathwayLesson direct admin editing is now the source of truth for pathway
 * lessons. Remove this bridge after legacy ContentItem lesson migration is complete.
 *
 * Legacy hook for optional ContentItem → PathwayLesson sync on **ContentItem** publish flows only.
 * PathwayLesson admin `PATCH`/`POST` and `/api/admin/pathway-lessons/*` must **never** call this.
 */
export async function syncPublishedContentItemToPathwayLessons(_lesson: ContentItem): Promise<void> {
  void _lesson;
  // Intentional no-op: pathway catalog authoring is `pathway_lessons` + `/api/admin/pathway-lessons/[id]` only (Option B).
}
