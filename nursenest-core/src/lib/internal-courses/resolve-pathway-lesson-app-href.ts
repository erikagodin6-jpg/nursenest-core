import "server-only";

import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { appLearnerLessonDetailPath } from "@/lib/lessons/lesson-routes";

/**
 * Resolves `/app/lessons/{id}` for a published pathway lesson (canonical body lives in PathwayLesson — not duplicated in internal modules).
 */
export async function resolvePathwayLessonAppDetailHref(
  pathwayId: string | null | undefined,
  lessonSlug: string | null | undefined,
): Promise<string | null> {
  const pid = typeof pathwayId === "string" ? pathwayId.trim() : "";
  const slug = typeof lessonSlug === "string" ? lessonSlug.trim() : "";
  if (!pid || !slug) return null;

  const row = await prisma.pathwayLesson.findFirst({
    where: {
      pathwayId: pid,
      slug,
      locale: "en",
      status: ContentStatus.PUBLISHED,
    },
    select: { id: true },
  });
  if (!row?.id) return null;
  return appLearnerLessonDetailPath(row.id);
}
