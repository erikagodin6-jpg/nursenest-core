/**
 * Client-safe pathway lesson progress key helpers (no Prisma / db imports).
 */
export function syntheticPathwayLessonId(pathwayId: string, slug: string): string {
  return `pathway:${pathwayId}:${slug}`;
}
