import { ContentStatus } from "@prisma/client";
import type { PathwayLessonAdjacentHrefs } from "@/components/lessons/pathway-lesson-sequence-nav";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import {
  getCatalogLessonsRaw,
  normalizeLesson,
  sortAndFilterLessonsForPathwayContext,
} from "@/lib/lessons/pathway-lesson-catalog-sync";

export type PathwayLessonAdjacentSlugs = {
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
};

function pathwayLessonAdjacentFromOrderedSlugs(
  ordered: readonly { slug: string; title: string }[],
  lessonSlug: string,
): PathwayLessonAdjacentSlugs {
  const idx = ordered.findIndex((l) => l.slug === lessonSlug);
  if (idx < 0) return { prev: null, next: null };
  const prev = idx > 0 ? { slug: ordered[idx - 1].slug, title: ordered[idx - 1].title } : null;
  const next = idx < ordered.length - 1 ? { slug: ordered[idx + 1].slug, title: ordered[idx + 1].title } : null;
  return { prev, next };
}

/**
 * Prev/next using the same **catalog / marketing** ordering as the lessons hub when DB rows are absent
 * or the app runs without `DATABASE_URL` (bounded list — no full-table scan).
 */
export function loadPathwayLessonAdjacentFromCatalog(pathwayId: string, lessonSlug: string): PathwayLessonAdjacentSlugs {
  try {
    const raw = getCatalogLessonsRaw(pathwayId);
    const sorted = sortAndFilterLessonsForPathwayContext(
      pathwayId,
      raw.map((row) => normalizeLesson(row, pathwayId)),
    ).map((l) => ({ slug: l.slug, title: l.title }));
    return pathwayLessonAdjacentFromOrderedSlugs(sorted, lessonSlug);
  } catch {
    return { prev: null, next: null };
  }
}

/**
 * Neighbors in the published pathway lesson sequence (`sort_order`, then `slug`).
 * Uses bounded lookups (current row + prev/next) instead of loading the full pathway into memory.
 * Falls back to **catalog order** (hub-aligned) when the DB is unavailable or the slug is not published in DB yet.
 */
export async function loadPathwayLessonAdjacent(
  pathwayId: string,
  lessonSlug: string,
  locale: string,
): Promise<PathwayLessonAdjacentSlugs> {
  if (!isDatabaseUrlConfigured()) {
    return loadPathwayLessonAdjacentFromCatalog(pathwayId, lessonSlug);
  }
  try {
    const current = await prisma.pathwayLesson.findFirst({
      where: { pathwayId, locale, status: ContentStatus.PUBLISHED, slug: lessonSlug },
      select: { sortOrder: true },
    });
    if (!current) {
      return loadPathwayLessonAdjacentFromCatalog(pathwayId, lessonSlug);
    }

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
    return loadPathwayLessonAdjacentFromCatalog(pathwayId, lessonSlug);
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
