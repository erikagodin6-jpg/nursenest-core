/**
 * Default catalog locale for pathway lessons — omitted from stable edit URLs when unchanged.
 * Matches common admin list filters (e.g. `/admin/pathway-lessons` index).
 */
export const DEFAULT_PATHWAY_LESSON_ADMIN_LOCALE = "en";

/**
 * Admin editor URL by stable keys (`pathwayId` + `slug`) for Option B / bookmarkable editing.
 * @see `/admin/pathway-lessons/edit`
 */
export function buildAdminPathwayLessonStableEditHref(params: {
  pathwayId: string;
  slug: string;
  locale?: string | null;
}): string {
  const sp = new URLSearchParams();
  sp.set("pathwayId", params.pathwayId);
  sp.set("slug", params.slug);
  const loc = (params.locale ?? "").trim();
  if (loc && loc !== DEFAULT_PATHWAY_LESSON_ADMIN_LOCALE) {
    sp.set("locale", loc);
  }
  return `/admin/pathway-lessons/edit?${sp.toString()}`;
}
