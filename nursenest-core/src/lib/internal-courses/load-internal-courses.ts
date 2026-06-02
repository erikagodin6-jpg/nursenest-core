import "server-only";

import type { InternalCourse, InternalCourseModule } from "@prisma/client";
import { prisma } from "@/lib/db";

export type InternalCourseWithModules = InternalCourse & { modules: InternalCourseModule[] };

/** Index rows only — avoids loading module JSON on `/internal/courses`. */
export type InternalCourseListRow = Pick<
  InternalCourse,
  "id" | "code" | "title" | "description" | "status" | "pathwayIds" | "updatedAt"
>;

export async function listInternalCourseSummariesForSurface(): Promise<InternalCourseListRow[]> {
  return prisma.internalCourse.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      code: true,
      title: true,
      description: true,
      status: true,
      pathwayIds: true,
      updatedAt: true,
    },
  });
}

export async function listInternalCoursesForSurface(): Promise<InternalCourseWithModules[]> {
  return prisma.internalCourse.findMany({
    orderBy: { updatedAt: "desc" },
    include: { modules: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getInternalCourseByIdForSurface(
  id: string,
): Promise<InternalCourseWithModules | null> {
  return prisma.internalCourse.findUnique({
    where: { id },
    include: { modules: { orderBy: { sortOrder: "asc" } } },
  });
}
