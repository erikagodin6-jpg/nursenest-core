/**
 * Guardrails for legacy `ContentItem` lessons tagged with `pathway-lesson-id:{cuid}` — canonical authoring
 * stays on `pathway_lessons` / `/admin/pathway-lessons` (see `/api/admin/lessons/[id]` PATCH).
 */
/** Keys that would fork “truth” away from {@link PathwayLesson} when a bridge tag is present. */
const CONTENT_ITEM_PATCH_PATHWAY_AUTHORITY_KEYS = [
  "title",
  "summary",
  "body",
  "slug",
  "status",
  "categoryId",
  "tier",
  "examFamily",
  "difficulty",
  "topicTag",
  "systemTag",
] as const;

export type ContentItemLessonPatchPayload = Partial<
  Record<(typeof CONTENT_ITEM_PATCH_PATHWAY_AUTHORITY_KEYS)[number], unknown>
>;

export function pathwayAuthorityBlocksContentItemLessonPatch(args: {
  linkedPathwayLessonId: string | null | undefined;
  patch: ContentItemLessonPatchPayload;
}): boolean {
  const linked = typeof args.linkedPathwayLessonId === "string" ? args.linkedPathwayLessonId.trim() : "";
  if (!linked) return false;
  return CONTENT_ITEM_PATCH_PATHWAY_AUTHORITY_KEYS.some((k) => args.patch[k] !== undefined);
}
