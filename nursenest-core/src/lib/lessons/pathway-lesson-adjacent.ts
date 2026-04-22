import { ContentStatus } from "@prisma/client";
import type { PathwayLessonAdjacentHrefs } from "@/components/lessons/pathway-lesson-sequence-nav";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import {
  getCatalogLessonsRaw,
  normalizeLesson,
  sortAndFilterLessonsForPathwayContext,
} from "@/lib/lessons/pathway-lesson-catalog-sync";

/** Neighbor in pathway lesson order (`sort_order`, catalog, or DB). */
export type PathwayLessonAdjacentNeighbor = {
  slug: string;
  title: string;
  /** Set when resolved from `pathway_lessons` — used for `/app/lessons/:id`. */
  id?: string | null;
};

export type PathwayLessonAdjacentSlugs = {
  prev: PathwayLessonAdjacentNeighbor | null;
  next: PathwayLessonAdjacentNeighbor | null;
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

async function attachPathwayLessonIdsToAdjacent(
  pathwayId: string,
  locale: string,
  adjacent: PathwayLessonAdjacentSlugs,
): Promise<PathwayLessonAdjacentSlugs> {
  const slugs = new Set<string>();
  if (adjacent.prev && !adjacent.prev.id) slugs.add(adjacent.prev.slug);
  if (adjacent.next && !adjacent.next.id) slugs.add(adjacent.next.slug);
  if (slugs.size === 0 || !isDatabaseUrlConfigured()) return adjacent;
  try {
    const rows = await prisma.pathwayLesson.findMany({
      where: {
        pathwayId,
        locale,
        status: ContentStatus.PUBLISHED,
        slug: { in: [...slugs] },
      },
      select: { id: true, slug: true, title: true },
    });
    const bySlug = new Map(rows.map((r) => [r.slug, r]));
    return {
      prev: adjacent.prev
        ? {
            slug: adjacent.prev.slug,
            title: bySlug.get(adjacent.prev.slug)?.title ?? adjacent.prev.title,
            id: adjacent.prev.id ?? bySlug.get(adjacent.prev.slug)?.id ?? null,
          }
        : null,
      next: adjacent.next
        ? {
            slug: adjacent.next.slug,
            title: bySlug.get(adjacent.next.slug)?.title ?? adjacent.next.title,
            id: adjacent.next.id ?? bySlug.get(adjacent.next.slug)?.id ?? null,
          }
        : null,
    };
  } catch {
    return adjacent;
  }
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
    return attachPathwayLessonIdsToAdjacent(
      pathwayId,
      locale,
      loadPathwayLessonAdjacentFromCatalog(pathwayId, lessonSlug),
    );
  }
  try {
    const current = await prisma.pathwayLesson.findFirst({
      where: { pathwayId, locale, status: ContentStatus.PUBLISHED, slug: lessonSlug },
      select: { sortOrder: true },
    });
    if (!current) {
      return attachPathwayLessonIdsToAdjacent(
        pathwayId,
        locale,
        loadPathwayLessonAdjacentFromCatalog(pathwayId, lessonSlug),
      );
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
        select: { id: true, slug: true, title: true },
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
        select: { id: true, slug: true, title: true },
      }),
    ]);

    return {
      prev: prev ? { slug: prev.slug, title: prev.title, id: prev.id } : null,
      next: next ? { slug: next.slug, title: next.title, id: next.id } : null,
    };
  } catch {
    return attachPathwayLessonIdsToAdjacent(
      pathwayId,
      locale,
      loadPathwayLessonAdjacentFromCatalog(pathwayId, lessonSlug),
    );
  }
}

/** Build ready-to-render prev/next links (e.g. marketing vs allied URL shapes). */
export function mapPathwayLessonAdjacentToHrefs(
  adjacent: PathwayLessonAdjacentSlugs,
  resolveDetailHref: (slug: string) => string | null,
): PathwayLessonAdjacentHrefs {
  const mapOne = (row: PathwayLessonAdjacentNeighbor | null) => {
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

/** Prev/next for signed-in app shell (`/app/lessons/:id`). Requires DB `id` on neighbors. */
export function mapPathwayLessonAdjacentToAppHrefs(adjacent: PathwayLessonAdjacentSlugs): PathwayLessonAdjacentHrefs {
  const mapOne = (row: PathwayLessonAdjacentNeighbor | null) => {
    if (!row?.id) return null;
    return { href: `/app/lessons/${row.id}`, title: row.title };
  };
  return {
    prev: mapOne(adjacent.prev),
    next: mapOne(adjacent.next),
  };
}
