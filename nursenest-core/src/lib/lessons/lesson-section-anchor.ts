/**
 * Optional hash anchor for pathway lesson detail routes when subsection slugs exist.
 * Safe to call with null — returns href unchanged. Does not invent section ids.
 */
export function appendLessonSectionAnchor(href: string, sectionSlug: string | null | undefined): string {
  const s = typeof sectionSlug === "string" ? sectionSlug.trim() : "";
  if (!s || !href.includes("/app/lessons/")) return href;
  if (href.includes("#")) return href;
  return `${href}#${encodeURIComponent(s)}`;
}
