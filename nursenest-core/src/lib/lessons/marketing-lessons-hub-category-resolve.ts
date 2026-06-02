import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { getMarketingHubEffectiveCatalogSlugSet } from "@/lib/lessons/pathway-lesson-catalog-sync";
import {
  pathwayMarketingHubCategoryFromSegment,
  type MarketingHubCategoryDescriptor,
} from "@/lib/lessons/marketing-lessons-hub-category";

/**
 * When `…/lessons/{segment}` matches a canonical display-category slug, route to the category hub.
 * Legacy aliases such as `fundamentals` still allow a published lesson with the same slug to win.
 */
export async function resolveMarketingLessonsHubDynamicSegment(
  pathwayId: string,
  segment: string,
): Promise<"lesson" | { category: MarketingHubCategoryDescriptor }> {
  const slug = segment.trim();
  const slugLower = slug.toLowerCase();
  const cat = pathwayMarketingHubCategoryFromSegment(pathwayId, slug);
  if (!cat) return "lesson";

  if (cat.slug === slugLower) {
    return { category: cat };
  }

  if (getMarketingHubEffectiveCatalogSlugSet(pathwayId).has(slugLower)) {
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
