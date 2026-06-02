import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { pathwayLessonProgressStatusFromRow } from "@/lib/lessons/pathway-lesson-progress";
import type { LabCategorySlug, LabLessonDefinition, LabTrack } from "@/lib/labs/labs-engine";
import { listLabLessonsForTrack } from "@/lib/labs/labs-engine";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { syntheticLabLessonId } from "@/lib/labs/lab-lesson-progress-keys";

export type { PathwayLessonProgressStatus as LabLessonProgressStatus };

const PROGRESS_CHUNK = 64;

export function labLessonProgressId(track: LabTrack, lesson: Pick<LabLessonDefinition, "category" | "slug">): string {
  return syntheticLabLessonId(track, lesson.category, lesson.slug);
}

export async function loadLabLessonProgressForLesson(
  userId: string,
  track: LabTrack,
  lesson: Pick<LabLessonDefinition, "category" | "slug">,
): Promise<PathwayLessonProgressStatus> {
  if (!userId || !isDatabaseUrlConfigured()) return "not_started";
  const row = await prisma.progress.findUnique({
    where: { userId_lessonId: { userId, lessonId: labLessonProgressId(track, lesson) } },
    select: { completed: true },
  });
  return pathwayLessonProgressStatusFromRow(row);
}

export async function loadLabLessonProgressMap(
  userId: string,
  track: LabTrack,
  lessons: LabLessonDefinition[],
  entitlement?: AccessScope,
): Promise<Record<string, PathwayLessonProgressStatus>> {
  const scoped = lessons.length > 0 ? lessons : listLabLessonsForTrack(track, entitlement);
  const initial = Object.fromEntries(scoped.map((l) => [l.slug, "not_started" as const]));
  if (!userId || !isDatabaseUrlConfigured() || scoped.length === 0) return initial;

  const ids = scoped.map((l) => labLessonProgressId(track, l));
  const progressMap: Record<string, PathwayLessonProgressStatus> = { ...initial };

  for (let i = 0; i < ids.length; i += PROGRESS_CHUNK) {
    const chunkIds = ids.slice(i, i + PROGRESS_CHUNK);
    const rows = await prisma.progress.findMany({
      where: { userId, lessonId: { in: chunkIds } },
      select: { lessonId: true, completed: true },
    });
    for (const row of rows) {
      const slug = scoped.find((l) => labLessonProgressId(track, l) === row.lessonId)?.slug;
      if (slug) progressMap[slug] = pathwayLessonProgressStatusFromRow(row);
    }
  }

  return progressMap;
}

export async function findLatestLabProgressTouch(
  userId: string,
  track: LabTrack,
  lessons: LabLessonDefinition[],
): Promise<{ category: LabCategorySlug; slug: string; completed: boolean } | null> {
  if (!userId || !isDatabaseUrlConfigured() || lessons.length === 0) return null;
  const ids = lessons.map((l) => labLessonProgressId(track, l));
  let best: { lessonId: string; completed: boolean; updatedAt: Date } | null = null;

  for (let i = 0; i < ids.length; i += PROGRESS_CHUNK) {
    const chunk = ids.slice(i, i + PROGRESS_CHUNK);
    const row = await prisma.progress.findFirst({
      where: { userId, lessonId: { in: chunk } },
      orderBy: { updatedAt: "desc" },
      select: { lessonId: true, completed: true, updatedAt: true },
    });
    if (!row) continue;
    if (!best || row.updatedAt > best.updatedAt) {
      best = row;
    }
  }

  if (!best) return null;
  const lesson = lessons.find((l) => labLessonProgressId(track, l) === best!.lessonId);
  if (!lesson) return null;
  return { category: lesson.category, slug: lesson.slug, completed: best.completed };
}

export function aggregateLabProgressCounts(progressMap: Record<string, PathwayLessonProgressStatus>): {
  completed: number;
  inProgress: number;
  total: number;
} {
  const values = Object.values(progressMap);
  return {
    total: values.length,
    completed: values.filter((s) => s === "completed").length,
    inProgress: values.filter((s) => s === "in_progress").length,
  };
}
