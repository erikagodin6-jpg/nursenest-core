import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import type { LessonCategory } from "@/lib/lessons/lesson-taxonomy";
import {
  getMarketingLessonsHubCatalogLessons,
  lessonCategoryFromMarketingHubPathSegment,
} from "@/lib/lessons/marketing-lessons-hub-category";

/**
 * When `…/lessons/{segment}` matches a display-category slug, route to the category hub **unless**
 * a published lesson uses the same slug (lesson wins).
 */
export async function resolveMarketingLessonsHubDynamicSegment(
  pathwayId: string,
  segment: string,
): Promise<"lesson" | { category: LessonCategory }> {
  const slug = segment.trim();
  const slugLower = slug.toLowerCase();
  const cat = lessonCategoryFromMarketingHubPathSegment(slug);
  if (!cat) return "lesson";

  const catalog = getMarketingLessonsHubCatalogLessons(pathwayId);
  if (catalog.some((l) => (l.slug ?? "").trim().toLowerCase() === slugLower)) {
    return "lesson";
  }

  if (isDatabaseUrlConfigured()) {
    try {
      const row = await prisma.pathwayLesson.findFirst({
        where: { pathwayId, slug, status: ContentStatus.PUBLISHED },
        select: { id: true },
      });
      if (row) return "lesson";
    } catch {
      /* treat as no row */
    }
  }

  return { category: cat };
}
