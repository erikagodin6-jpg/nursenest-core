import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { PATHWAY_LESSON_METADATA_LIST_SELECT } from "@/lib/lessons/pathway-lesson-metadata-select";

/**
 * Next pathway lesson in catalog order that shares the same `bodySystem` as the current lesson
 * (bounded list scan — same ordering as pathway “next lesson” helpers).
 */
export async function findNextPathwayLessonSameBodySystem(input: {
  pathwayWhere: Prisma.PathwayLessonWhereInput;
  pathwayId: string;
  currentLessonId: string;
  bodySystem: string;
}): Promise<{ id: string; title: string } | null> {
  const bs = input.bodySystem.trim().toLowerCase();
  if (bs.length < 2) return null;

  const rows = await prisma.pathwayLesson.findMany({
    where: { AND: [input.pathwayWhere, { pathwayId: input.pathwayId, structuralPublicComplete: true }] },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: PATHWAY_LESSON_METADATA_LIST_SELECT,
  });

  const idx = rows.findIndex((r) => r.id === input.currentLessonId);
  if (idx < 0) return null;

  for (let i = idx + 1; i < rows.length; i++) {
    const r = rows[i]!;
    if (r.bodySystem.trim().toLowerCase() === bs) {
      return { id: r.id, title: r.title };
    }
  }
  return null;
}
