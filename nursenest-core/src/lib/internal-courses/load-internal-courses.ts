import "server-only";

import type { InternalCourse, InternalCourseModule } from "@prisma/client";
import { prisma } from "@/lib/db";

export type InternalCourseWithModules = InternalCourse & { modules: InternalCourseModule[] };

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
