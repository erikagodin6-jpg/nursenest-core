import { loadPathwayLessonProgressMapForSlugs } from "@/lib/lessons/pathway-lesson-progress";

/**
 * Single entry point for pathway lesson progress rows (Prisma `Progress` synthetic ids).
 * Prefer loading once at the route boundary and passing a map into presentational components.
 */
export async function getLessonProgressForPathwayUser(args: {
  userId: string;
  pathwayId: string;
  lessonSlugs: readonly string[];
}) {
  return loadPathwayLessonProgressMapForSlugs(args.userId, args.pathwayId, [...args.lessonSlugs]);
}
