import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured, withDatabaseFallbackTimeout } from "@/lib/db/safe-database";

const TIMEOUT_MS = 8000;

/**
 * Fast count for SEO robots + empty-state (bounded; uses indexed pathway + locale + status).
 */
export async function countPublishedPathwayLessonsForAlliedMarketing(
  pathwayId: string,
  locale: string,
  topicSlugsIn?: string[],
): Promise<number | null> {
  if (!isDatabaseUrlConfigured()) return null;
  const n = await withDatabaseFallbackTimeout(
    () =>
      prisma.pathwayLesson.count({
        where: {
          pathwayId,
          status: ContentStatus.PUBLISHED,
          locale,
          ...(topicSlugsIn && topicSlugsIn.length > 0 ? { topicSlug: { in: topicSlugsIn } } : {}),
        },
      }),
    -1,
    TIMEOUT_MS,
  );
  if (n < 0) return null;
  return n;
}
