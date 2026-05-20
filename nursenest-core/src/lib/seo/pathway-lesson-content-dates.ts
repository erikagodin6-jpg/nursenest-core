import "server-only";

import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { normalizePathwayLessonLocale } from "@/lib/lessons/pathway-lesson-locale";

/**
 * ISO timestamps for JSON-LD when a published `pathway_lessons` row exists.
 * Catalog-only lessons return nulls (do not invent dates).
 */
export async function getPathwayLessonContentDates(
  pathwayId: string,
  slug: string,
  requestedLocale: string,
): Promise<{ datePublished: string | null; dateModified: string | null } | null> {
  if (!isDatabaseUrlConfigured()) return null;
  const locale = normalizePathwayLessonLocale(requestedLocale);
  try {
    const row = await prisma.pathwayLesson.findFirst({
      where: { pathwayId, slug, locale },
      select: { createdAt: true, updatedAt: true },
    });
    if (!row) return null;
    return {
      datePublished: row.createdAt.toISOString(),
      dateModified: row.updatedAt.toISOString(),
    };
  } catch {
    return null;
  }
}
