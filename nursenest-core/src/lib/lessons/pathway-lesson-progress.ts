import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

/** Never issue more than this many `lessonId IN (...)` keys per hub request (matches hub page cap). */
export const PATHWAY_HUB_PROGRESS_SLUG_CAP = 64;

export type PathwayLessonProgressStatus = "not_started" | "in_progress" | "completed";

export function syntheticPathwayLessonId(pathwayId: string, slug: string): string {
  return `pathway:${pathwayId}:${slug}`;
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
 * Single DB round-trip for pathway-scoped completed vs in-progress row counts (synthetic `pathway:{id}:` ids).
 */
export async function aggregatePathwayProgressCounts(
  userId: string,
  pathwayId: string,
): Promise<{ lessonsCompleted: number; lessonsInProgress: number }> {
  if (!userId || !isDatabaseUrlConfigured()) {
    return { lessonsCompleted: 0, lessonsInProgress: 0 };
  }
  const prefix = `pathway:${pathwayId}:`;
  const pattern = `${prefix}%`;
  try {
    const rows = await prisma.$queryRaw<{ completed: bigint; in_progress: bigint }[]>`
      SELECT
        COUNT(*) FILTER (WHERE "completed")::bigint AS completed,
        COUNT(*) FILTER (WHERE NOT "completed")::bigint AS in_progress
      FROM "Progress"
      WHERE "userId" = ${userId}
        AND "lessonId" LIKE ${pattern}
    `;
    const r = rows[0];
    return {
      lessonsCompleted: Number(r?.completed ?? 0),
      lessonsInProgress: Number(r?.in_progress ?? 0),
    };
  } catch {
    const [lessonsCompleted, lessonsInProgress] = await Promise.all([
      prisma.progress.count({
        where: { userId, completed: true, lessonId: { startsWith: prefix } },
      }),
      prisma.progress.count({
        where: { userId, completed: false, lessonId: { startsWith: prefix } },
      }),
    ]);
    return { lessonsCompleted, lessonsInProgress };
  }
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

  const [idRows, lastRow, counts] = await Promise.all([
    narrowIds.length > 0
      ? prisma.progress.findMany({
          where: { userId, lessonId: { in: narrowIds } },
          select: { lessonId: true, completed: true },
        })
      : Promise.resolve([]),
    prisma.progress.findFirst({
      where: { userId, lessonId: { startsWith: prefix } },
      orderBy: { updatedAt: "desc" },
      select: { lessonId: true, completed: true },
    }),
    aggregatePathwayProgressCounts(userId, pathwayId),
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
