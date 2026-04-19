import { ContentStatus } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { PATHWAY_LESSON_DB_TIMEOUT_MS } from "@/lib/lessons/pathway-lesson-loader-config";
import { sortPathwayLessonsForPublicPreview } from "@/lib/lessons/pathway-lesson-public-preview-priority";

/**
 * Lightweight public lesson metadata boundary for shared marketing surfaces.
 * This intentionally avoids the full `pathway-lesson-loader` graph.
 */

async function listPathwayIdsWithPublishedDbLessons(): Promise<string[]> {
  return withDatabaseFallbackTimeout(
    async () => {
      const groups = await prisma.pathwayLesson.groupBy({
        by: ["pathwayId"],
        where: { status: ContentStatus.PUBLISHED },
        _count: { _all: true },
      });
      return groups.map((group) => group.pathwayId);
    },
    [],
    PATHWAY_LESSON_DB_TIMEOUT_MS,
    {
      scope: "pathway_lessons_public_metadata",
      label: "pathway_ids_with_published_db_lessons",
    },
  );
}

async function loadPublicCatalogSync() {
  return await import("@/lib/lessons/pathway-lesson-catalog-sync");
}

export const listPathwayIdsWithLessonsForPublicSurface = unstable_cache(
  async (): Promise<string[]> => {
    const { listCatalogPathwayIdsWithLessonsSync } = await loadPublicCatalogSync();
    const catalogIds = listCatalogPathwayIdsWithLessonsSync();
    const dbIds = await listPathwayIdsWithPublishedDbLessons();
    return [...new Set([...catalogIds, ...dbIds])].sort((a, b) => a.localeCompare(b));
  },
  ["public-pathway-lesson-metadata-v1"],
  { revalidate: 600, tags: ["pathway-lesson-index"] },
);

export async function getCatalogLessonPreviewTitlesForPublicSurface(pathwayId: string, limit = 4): Promise<string[]> {
  const { getCatalogPathwayLessonsSync } = await loadPublicCatalogSync();
  const lessons = sortPathwayLessonsForPublicPreview(pathwayId, getCatalogPathwayLessonsSync(pathwayId));
  return lessons.slice(0, Math.max(0, limit)).map((lesson) => lesson.title);
}
