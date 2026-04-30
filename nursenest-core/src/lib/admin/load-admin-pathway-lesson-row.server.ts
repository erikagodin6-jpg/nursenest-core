import "server-only";

import { prisma } from "@/lib/db";

export type AdminPathwayLessonSlugLookup = {
  pathwayId: string;
  slug: string;
  locale: string;
};

/**
 * Admin-only read for `GET /api/admin/pathway-lessons/[id]` when resolving by internal id or by
 * (`pathwayId`, `slug`, `locale`) stable keys (query params on the same route).
 */
export async function loadAdminPathwayLessonRow(
  args: { pathwayLessonId: string; slugLookup?: AdminPathwayLessonSlugLookup | null } | { slugLookup: AdminPathwayLessonSlugLookup },
) {
  if ("slugLookup" in args && args.slugLookup) {
    return prisma.pathwayLesson.findFirst({
      where: {
        pathwayId: args.slugLookup.pathwayId,
        slug: args.slugLookup.slug,
        locale: args.slugLookup.locale,
      },
    });
  }
  const id = (args as { pathwayLessonId: string }).pathwayLessonId;
  return prisma.pathwayLesson.findUnique({ where: { id } });
}
