import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { PATHWAY_CATALOG_LIST_HARD_CAP } from "@/lib/lessons/pathway-lesson-scale";

/** Never issue more than this many `lessonId IN (...)` keys per hub request (matches hub page cap). */
export const PATHWAY_HUB_PROGRESS_SLUG_CAP = 64;

export type PathwayLessonProgressStatus = "not_started" | "in_progress" | "completed";

export function syntheticPathwayLessonId(pathwayId: string, slug: string): string {
  return `pathway:${pathwayId}:${slug}`;
}

const PROGRESS_INVENTORY_CHUNK = 400;

/**
 * Published pathway lesson slugs up to {@link PATHWAY_CATALOG_LIST_HARD_CAP} — same bound as learner catalog inventory.
 * Used for `lessonId IN (...)` progress queries (avoids `startsWith` / `LIKE` scans on `Progress`).
 */
export async function listPublishedSyntheticLessonIdsForPathway(pathwayId: string): Promise<string[]> {
  const rows = await prisma.pathwayLesson.findMany({
    where: { pathwayId, status: ContentStatus.PUBLISHED },
    select: { slug: true },
    orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
    take: PATHWAY_CATALOG_LIST_HARD_CAP,
  });
  return rows.map((r) => syntheticPathwayLessonId(pathwayId, r.slug));
}

export async function countProgressCompletedForSyntheticIds(userId: string, lessonIds: string[]): Promise<number> {
  if (lessonIds.length === 0) return 0;
  let n = 0;
  for (let i = 0; i < lessonIds.length; i += PROGRESS_INVENTORY_CHUNK) {
    const chunk = lessonIds.slice(i, i + PROGRESS_INVENTORY_CHUNK);
    n += await prisma.progress.count({
      where: { userId, completed: true, lessonId: { in: chunk } },
    });
  }
  return n;
}

export async function countProgressInProgressForSyntheticIds(userId: string, lessonIds: string[]): Promise<number> {
  if (lessonIds.length === 0) return 0;
  let n = 0;
  for (let i = 0; i < lessonIds.length; i += PROGRESS_INVENTORY_CHUNK) {
    const chunk = lessonIds.slice(i, i + PROGRESS_INVENTORY_CHUNK);
    n += await prisma.progress.count({
      where: { userId, completed: false, lessonId: { in: chunk } },
    });
  }
  return n;
}

/** Any progress row (opened / touched) for the lesson id set — used for hub “total opened” style stats. */
export async function countProgressTouchedForSyntheticIds(userId: string, lessonIds: string[]): Promise<number> {
  if (lessonIds.length === 0) return 0;
  let n = 0;
  for (let i = 0; i < lessonIds.length; i += PROGRESS_INVENTORY_CHUNK) {
    const chunk = lessonIds.slice(i, i + PROGRESS_INVENTORY_CHUNK);
    n += await prisma.progress.count({ where: { userId, lessonId: { in: chunk } } });
  }
  return n;
}

/**
 * Latest touched progress row among a bounded set of lesson ids (max `updatedAt` across chunked queries).
 */
export async function findLatestProgressTouchAmongLessonIds(
  userId: string,
  lessonIds: string[],
): Promise<{ lessonId: string; completed: boolean; updatedAt: Date } | null> {
  if (lessonIds.length === 0) return null;
  let best: { lessonId: string; completed: boolean; updatedAt: Date } | null = null;
  for (let i = 0; i < lessonIds.length; i += PROGRESS_INVENTORY_CHUNK) {
    const chunk = lessonIds.slice(i, i + PROGRESS_INVENTORY_CHUNK);
    const row = await prisma.progress.findFirst({
      where: { userId, lessonId: { in: chunk } },
      orderBy: { updatedAt: "desc" },
      select: { lessonId: true, completed: true, updatedAt: true },
    });
    if (!row) continue;
    if (!best || row.updatedAt > best.updatedAt) {
      best = { lessonId: row.lessonId, completed: row.completed, updatedAt: row.updatedAt };
    }
  }
  return best;
}

export function pathwayLessonProgressStatusFromRow(row: { completed: boolean } | null): PathwayLessonProgressStatus {
  if (!row) return "not_started";
  if (row.completed) return "completed";
  return "in_progress";
}

export async function loadPathwayLessonProgressForSlug(
  userId: string,
  pathwayId: string,
  slug: string,
): Promise<PathwayLessonProgressStatus> {
  if (!userId || !isDatabaseUrlConfigured()) return "not_started";
  const row = await prisma.progress.findUnique({
    where: { userId_lessonId: { userId, lessonId: syntheticPathwayLessonId(pathwayId, slug) } },
    select: { completed: true },
  });
  return pathwayLessonProgressStatusFromRow(row);
}

/**
 * Progress for a page of hub slugs (subscriber pathway scope). Missing slugs are not_started.
 */
export async function loadPathwayLessonProgressMap(
  userId: string,
  pathwayId: string,
  slugs: string[],
): Promise<Record<string, PathwayLessonProgressStatus>> {
  if (!userId || !isDatabaseUrlConfigured() || slugs.length === 0) {
    return Object.fromEntries(slugs.map((s) => [s, "not_started" as const]));
  }

  const capped = slugs.slice(0, PATHWAY_HUB_PROGRESS_SLUG_CAP);
  const ids = capped.map((s) => syntheticPathwayLessonId(pathwayId, s));
  const rows = await prisma.progress.findMany({
    where: { userId, lessonId: { in: ids } },
    select: { lessonId: true, completed: true },
  });

  const prefix = `pathway:${pathwayId}:`;
  const bySlug = new Map<string, PathwayLessonProgressStatus>();
  for (const s of slugs) bySlug.set(s, "not_started");

  for (const r of rows) {
    if (!r.lessonId.startsWith(prefix)) continue;
    const slug = r.lessonId.slice(prefix.length);
    bySlug.set(slug, pathwayLessonProgressStatusFromRow(r));
  }

  return Object.fromEntries(slugs.map((s) => [s, bySlug.get(s) ?? "not_started"]));
}

/**
 * Completed vs in-progress counts for **published pathway inventory** (capped list) — chunked `IN`, no prefix scans.
 * Pass `inventoryIds` when the caller already listed slugs (avoids a second `pathwayLesson` read).
 */
export async function aggregatePathwayProgressCounts(
  userId: string,
  pathwayId: string,
  inventoryIdsPreloaded?: string[],
): Promise<{ lessonsCompleted: number; lessonsInProgress: number }> {
  if (!userId || !isDatabaseUrlConfigured()) {
    return { lessonsCompleted: 0, lessonsInProgress: 0 };
  }
  const inventoryIds =
    inventoryIdsPreloaded ?? (await listPublishedSyntheticLessonIdsForPathway(pathwayId));
  if (inventoryIds.length === 0) {
    return { lessonsCompleted: 0, lessonsInProgress: 0 };
  }
  const [lessonsCompleted, lessonsInProgress] = await Promise.all([
    countProgressCompletedForSyntheticIds(userId, inventoryIds),
    countProgressInProgressForSyntheticIds(userId, inventoryIds),
  ]);
  return { lessonsCompleted, lessonsInProgress };
}

/**
 * Single round-trip for hub subscriber UI: page-level progress map + resume stats.
 * Does not cache (user-specific).
 */
export async function loadPathwayHubProgressBatch(
  userId: string,
  pathwayId: string,
  hubSlugs: string[],
): Promise<{
  progressMap: Record<string, PathwayLessonProgressStatus>;
  lastForResume: { slug: string; completed: boolean } | null;
  lessonsCompleted: number;
  lessonsInProgress: number;
}> {
  if (!userId || !isDatabaseUrlConfigured()) {
    return {
      progressMap: Object.fromEntries(hubSlugs.map((s) => [s, "not_started" as const])),
      lastForResume: null,
      lessonsCompleted: 0,
      lessonsInProgress: 0,
    };
  }

  const prefix = `pathway:${pathwayId}:`;
  const cappedSlugs = hubSlugs.slice(0, PATHWAY_HUB_PROGRESS_SLUG_CAP);
  const narrowIds = cappedSlugs.map((s) => syntheticPathwayLessonId(pathwayId, s));

  const inventoryIds = await listPublishedSyntheticLessonIdsForPathway(pathwayId);

  const [idRows, lastRow, counts] = await Promise.all([
    narrowIds.length > 0
      ? prisma.progress.findMany({
          where: { userId, lessonId: { in: narrowIds } },
          select: { lessonId: true, completed: true },
        })
      : Promise.resolve([]),
    findLatestProgressTouchAmongLessonIds(userId, inventoryIds),
    aggregatePathwayProgressCounts(userId, pathwayId, inventoryIds),
  ]);

  const progressMap: Record<string, PathwayLessonProgressStatus> = {};
  const idToRow = new Map(idRows.map((r) => [r.lessonId, r]));
  for (const s of hubSlugs) {
    const row = idToRow.get(syntheticPathwayLessonId(pathwayId, s));
    progressMap[s] = pathwayLessonProgressStatusFromRow(row ? { completed: row.completed } : null);
  }

  let lastForResume: { slug: string; completed: boolean } | null = null;
  if (lastRow?.lessonId.startsWith(prefix)) {
    const slug = lastRow.lessonId.slice(prefix.length);
    if (slug) lastForResume = { slug, completed: lastRow.completed };
  }
  return {
    progressMap,
    lastForResume,
    lessonsCompleted: counts.lessonsCompleted,
    lessonsInProgress: counts.lessonsInProgress,
  };
}
