import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { getEffectiveCatalogLessonsForPathwaySync } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { canonicalHubLessonDisplayTitle } from "@/lib/lessons/pathway-lesson-hub-organize";
import { pathwayLessonPublicDetailPath } from "@/lib/lessons/pathway-lesson-types";

export type PathwayLessonTopicSibling = {
  slug: string;
  title: string;
  href: string;
};

/**
 * Bounded same-topic lessons for marketing detail cross-links (catalog-backed, no DB).
 */
export function listTopicSiblingLessonsForMarketing(input: {
  pathway: ExamPathwayDefinition;
  topicSlug: string;
  excludeSlug: string;
  limit?: number;
}): PathwayLessonTopicSibling[] {
  const topic = input.topicSlug.trim().toLowerCase();
  const exclude = input.excludeSlug.trim();
  const limit = Math.min(Math.max(input.limit ?? 6, 2), 8);
  if (!topic || !exclude) return [];

  const out: PathwayLessonTopicSibling[] = [];
  const seen = new Set<string>([exclude]);

  for (const row of getEffectiveCatalogLessonsForPathwaySync(input.pathway.id)) {
    if (out.length >= limit) break;
    const slug = typeof row.slug === "string" ? row.slug.trim() : "";
    if (!slug || seen.has(slug)) continue;
    const rowTopic = (row.topicSlug ?? "").trim().toLowerCase();
    if (rowTopic !== topic) continue;
    if (!row.structuralQuality?.publicComplete) continue;
    const href = pathwayLessonPublicDetailPath(input.pathway, slug);
    if (!href) continue;
    seen.add(slug);
    out.push({
      slug,
      title: canonicalHubLessonDisplayTitle(row),
      href,
    });
  }

  return out;
}
