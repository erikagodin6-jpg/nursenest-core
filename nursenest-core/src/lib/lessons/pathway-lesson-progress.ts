import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";

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

  const ids = slugs.map((s) => syntheticPathwayLessonId(pathwayId, s));
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
}> {
  if (!userId || !isDatabaseUrlConfigured()) {
    return {
      progressMap: Object.fromEntries(hubSlugs.map((s) => [s, "not_started" as const])),
      lastForResume: null,
      lessonsCompleted: 0,
    };
  }

  const prefix = `pathway:${pathwayId}:`;
  const narrowIds = hubSlugs.map((s) => syntheticPathwayLessonId(pathwayId, s));

  const [idRows, lastRow, lessonsCompleted] = await Promise.all([
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
    prisma.progress.count({
      where: { userId, completed: true, lessonId: { startsWith: prefix } },
    }),
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

  return { progressMap, lastForResume, lessonsCompleted };
}
