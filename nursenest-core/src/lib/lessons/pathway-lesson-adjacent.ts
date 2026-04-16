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
 * Uses bounded lookups (current row + prev/next) instead of loading the full pathway into memory.
 */
export async function loadPathwayLessonAdjacent(
  pathwayId: string,
  lessonSlug: string,
  locale: string,
): Promise<PathwayLessonAdjacentSlugs> {
  if (!isDatabaseUrlConfigured()) return { prev: null, next: null };
  try {
    const current = await prisma.pathwayLesson.findFirst({
      where: { pathwayId, locale, status: ContentStatus.PUBLISHED, slug: lessonSlug },
      select: { sortOrder: true },
    });
    if (!current) return { prev: null, next: null };

    const [prev, next] = await Promise.all([
      prisma.pathwayLesson.findFirst({
        where: {
          pathwayId,
          locale,
          status: ContentStatus.PUBLISHED,
          OR: [
            { sortOrder: { lt: current.sortOrder } },
            { AND: [{ sortOrder: current.sortOrder }, { slug: { lt: lessonSlug } }] },
          ],
        },
        orderBy: [{ sortOrder: "desc" }, { slug: "desc" }],
        select: { slug: true, title: true },
      }),
      prisma.pathwayLesson.findFirst({
        where: {
          pathwayId,
          locale,
          status: ContentStatus.PUBLISHED,
          OR: [
            { sortOrder: { gt: current.sortOrder } },
            { AND: [{ sortOrder: current.sortOrder }, { slug: { gt: lessonSlug } }] },
          ],
        },
        orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
        select: { slug: true, title: true },
      }),
    ]);

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
