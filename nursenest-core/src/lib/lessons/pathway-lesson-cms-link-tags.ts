/** Admin/CMS tag: pin a `content_items` lesson row to a canonical `pathway_lessons.id` for redirects + migration. */
export const PATHWAY_LESSON_LINK_TAG_PREFIX = "pathway-lesson-id:";

export function pathwayLessonIdFromContentItemTags(tags: string[] | null | undefined): string | null {
  for (const t of tags ?? []) {
    const s = typeof t === "string" ? t.trim() : "";
    if (!s.toLowerCase().startsWith(PATHWAY_LESSON_LINK_TAG_PREFIX)) continue;
    const id = s.slice(PATHWAY_LESSON_LINK_TAG_PREFIX.length).trim();
    if (id) return id;
  }
  return null;
}
