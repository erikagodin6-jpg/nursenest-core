import "server-only";

import { prisma } from "@/lib/db";
import { LEGACY_INTERNAL_COURSE_IMPORT } from "@/lib/internal-courses/legacy-import-catalog";

/** Idempotent import of bundled legacy interactive courses (safe to run multiple times). */
export async function upsertLegacyInternalCoursesFromCatalog(): Promise<{ coursesUpserted: number }> {
  let n = 0;
  for (const row of LEGACY_INTERNAL_COURSE_IMPORT) {
    const course = await prisma.internalCourse.upsert({
      where: { code: row.code },
      create: {
        code: row.code,
        title: row.title,
        description: row.description,
        status: row.status,
        pathwayIds: row.pathwayIds,
        modules: {
          create: row.modules.map((m) => ({
            type: m.type,
            sortOrder: m.sortOrder,
            content: m.content,
            pathwayId: m.pathwayId ?? null,
            lessonSlug: m.lessonSlug ?? null,
          })),
        },
      },
      update: {
        title: row.title,
        description: row.description,
        status: row.status,
        pathwayIds: row.pathwayIds,
      },
    });
    await prisma.internalCourseModule.deleteMany({ where: { courseId: course.id } });
    await prisma.internalCourseModule.createMany({
      data: row.modules.map((m) => ({
        courseId: course.id,
        type: m.type,
        sortOrder: m.sortOrder,
        content: m.content as object,
        pathwayId: m.pathwayId ?? null,
        lessonSlug: m.lessonSlug ?? null,
      })),
    });
    n += 1;
  }
  return { coursesUpserted: n };
}
