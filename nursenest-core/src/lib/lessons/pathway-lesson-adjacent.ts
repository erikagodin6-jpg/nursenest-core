import { ContentStatus } from "@prisma/client";
import type { PathwayLessonAdjacentHrefs } from "@/components/lessons/pathway-lesson-sequence-nav";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

export type PathwayLessonAdjacentSlugs = {
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
};

/**
 * Neighbors in the published pathway lesson sequence (`sort_order`, then `slug`).
 * Mirrors the monolith lesson hub order used for prev/next in `client/src/pages/lesson-detail.tsx`.
 */
export async function loadPathwayLessonAdjacent(
  pathwayId: string,
  lessonSlug: string,
  locale: string,
): Promise<PathwayLessonAdjacentSlugs> {
  if (!isDatabaseUrlConfigured()) return { prev: null, next: null };
  try {
    const rows = await prisma.pathwayLesson.findMany({
      where: { pathwayId, locale, status: ContentStatus.PUBLISHED },
      orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
      select: { slug: true, title: true },
    });
    const idx = rows.findIndex((r) => r.slug === lessonSlug);
    if (idx < 0) return { prev: null, next: null };
    const prev = idx > 0 ? rows[idx - 1]! : null;
    const next = idx < rows.length - 1 ? rows[idx + 1]! : null;
    return {
      prev: prev ? { slug: prev.slug, title: prev.title } : null,
      next: next ? { slug: next.slug, title: next.title } : null,
    };
  } catch {
    return { prev: null, next: null };
  }
}

/** Build ready-to-render prev/next links (e.g. marketing vs allied URL shapes). */
export function mapPathwayLessonAdjacentToHrefs(
  adjacent: PathwayLessonAdjacentSlugs,
  resolveDetailHref: (slug: string) => string | null,
): PathwayLessonAdjacentHrefs {
  const mapOne = (row: { slug: string; title: string } | null) => {
    if (!row) return null;
    const href = resolveDetailHref(row.slug);
    if (!href) return null;
    return { href, title: row.title };
  };
  return {
    prev: mapOne(adjacent.prev),
    next: mapOne(adjacent.next),
  };
}
