import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { pathwayLessonProgressStatusFromRow } from "@/lib/lessons/pathway-lesson-progress";
import { listClinicalSkills } from "@/lib/clinical-skills/clinical-skills-catalog";
import { syntheticClinicalSkillProgressId } from "@/lib/clinical-skills/clinical-skills-lesson-progress-keys";

const CHUNK = 64;

export function clinicalSkillProgressId(slug: string): string {
  return syntheticClinicalSkillProgressId(slug);
}

export async function loadClinicalSkillProgressForSlug(
  userId: string,
  slug: string,
): Promise<PathwayLessonProgressStatus> {
  if (!userId || !isDatabaseUrlConfigured()) return "not_started";
  const row = await prisma.progress.findUnique({
    where: { userId_lessonId: { userId, lessonId: clinicalSkillProgressId(slug) } },
    select: { completed: true },
  });
  return pathwayLessonProgressStatusFromRow(row);
}

export async function loadClinicalSkillProgressMap(
  userId: string,
): Promise<Record<string, PathwayLessonProgressStatus>> {
  const skills = listClinicalSkills();
  const initial = Object.fromEntries(skills.map((s) => [s.slug, "not_started" as const]));
  if (!userId || !isDatabaseUrlConfigured()) return initial;

  const ids = skills.map((s) => clinicalSkillProgressId(s.slug));
  const map: Record<string, PathwayLessonProgressStatus> = { ...initial };

  for (let i = 0; i < ids.length; i += CHUNK) {
    const chunk = ids.slice(i, i + CHUNK);
    const rows = await prisma.progress.findMany({
      where: { userId, lessonId: { in: chunk } },
      select: { lessonId: true, completed: true },
    });
    for (const row of rows) {
      const slug = skills.find((s) => clinicalSkillProgressId(s.slug) === row.lessonId)?.slug;
      if (slug) map[slug] = pathwayLessonProgressStatusFromRow(row);
    }
  }
  return map;
}

export async function findLatestClinicalSkillProgressTouch(
  userId: string,
): Promise<{ slug: string; completed: boolean } | null> {
  if (!userId || !isDatabaseUrlConfigured()) return null;
  const skills = listClinicalSkills();
  const ids = skills.map((s) => clinicalSkillProgressId(s.slug));
  let best: { lessonId: string; completed: boolean; updatedAt: Date } | null = null;

  for (let i = 0; i < ids.length; i += CHUNK) {
    const row = await prisma.progress.findFirst({
      where: { userId, lessonId: { in: ids.slice(i, i + CHUNK) } },
      orderBy: { updatedAt: "desc" },
      select: { lessonId: true, completed: true, updatedAt: true },
    });
    if (!row) continue;
    if (!best || row.updatedAt > best.updatedAt) best = row;
  }

  if (!best) return null;
  const skill = skills.find((s) => clinicalSkillProgressId(s.slug) === best!.lessonId);
  if (!skill) return null;
  return { slug: skill.slug, completed: best.completed };
}

export function aggregateClinicalSkillProgressCounts(
  progressMap: Record<string, PathwayLessonProgressStatus>,
): { completed: number; inProgress: number; total: number } {
  const values = Object.values(progressMap);
  return {
    total: values.length,
    completed: values.filter((s) => s === "completed").length,
    inProgress: values.filter((s) => s === "in_progress").length,
  };
}
