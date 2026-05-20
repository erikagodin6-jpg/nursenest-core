import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  pathwayLessonMetadataListSelectForReads,
  pathwayLessonStructuralCompleteWhereInput,
} from "@/lib/db/pathway-lesson-structural-column-runtime";

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

  const structuralWhere = await pathwayLessonStructuralCompleteWhereInput();
  const select = await pathwayLessonMetadataListSelectForReads();
  const rows = await prisma.pathwayLesson.findMany({
    where: { AND: [input.pathwayWhere, { pathwayId: input.pathwayId, ...structuralWhere }] },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select,
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
