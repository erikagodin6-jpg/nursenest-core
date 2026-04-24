import "server-only";

import { unstable_cache } from "next/cache";
import { cacheDeploymentRevision } from "@/lib/cache/cache-revision";
import { CACHE_TAG_MARKETING_PUBLIC_FLASHCARD_TAGS } from "@/lib/cache/cache-tags";
import { PUBLIC_FLASHCARD_TAGS_CACHE_REVALIDATE_SEC } from "@/lib/cache/public-edge-cache";
import { publicMarketingFlashcardDeckWhere } from "@/lib/entitlements/content-access-scope";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout, withDatabaseFallbackTimeoutOrThrow } from "@/lib/db/safe-database";
import { logRouteDataPipeline, routeDataDiagnosticsEnabled } from "@/lib/observability/route-data-pipeline-log";

export type PublicFlashcardTagsPayload = { tags: Array<{ slug: string; name: string }> };

/** Cold pool / Prisma warmup can exceed sub-second budgets; empty fallback here poisons `unstable_cache`. */
const TAG_QUERY_TIMEOUT_MS = 12_000;

/**
 * Loads public-scope flashcard tags (max 80) — **uncached**; prefer {@link getCachedPublicFlashcardTags}.
 */
export async function loadPublicFlashcardTags(): Promise<PublicFlashcardTagsPayload> {
  const payload = await withDatabaseFallbackTimeout(
    async () => {
      const deckWhere = publicMarketingFlashcardDeckWhere();
      const tags = await prisma.flashcardTag.findMany({
        where: { decks: { some: { deck: deckWhere } } },
        orderBy: { name: "asc" },
        take: 80,
        select: { slug: true, name: true },
      });
      return { tags };
    },
    { tags: [] },
    TAG_QUERY_TIMEOUT_MS,
    { scope: "api_public", label: "flashcard_tags" },
  );
  if (routeDataDiagnosticsEnabled()) {
    logRouteDataPipeline({
      route: "public_flashcard_tags",
      stage: "loadPublicFlashcardTags_result",
      meta: {
        tagCount: payload.tags.length,
        timeoutMs: TAG_QUERY_TIMEOUT_MS,
        degradedEmpty: payload.tags.length === 0 ? 1 : 0,
      },
    });
  }
  return payload;
}

/**
 * Same query as {@link loadPublicFlashcardTags} but **throws** on timeout/DB errors so
 * {@link getCachedPublicFlashcardTags} never persists an empty poisoned payload in `unstable_cache`.
 */
async function loadPublicFlashcardTagsForDataCache(): Promise<PublicFlashcardTagsPayload> {
  const deckWhere = publicMarketingFlashcardDeckWhere();
  return withDatabaseFallbackTimeoutOrThrow(
    async () => {
      const tags = await prisma.flashcardTag.findMany({
        where: { decks: { some: { deck: deckWhere } } },
        orderBy: { name: "asc" },
        take: 80,
        select: { slug: true, name: true },
      });
      return { tags };
    },
    TAG_QUERY_TIMEOUT_MS,
    { scope: "api_public", label: "flashcard_tags_data_cache" },
  );
}

/**
 * Next.js Data Cache — aligns with CDN `s-maxage` on `GET /api/public/flashcard-tags` so scanners
 * do not fan out heavy Prisma work on every origin miss.
 */
export const getCachedPublicFlashcardTags = unstable_cache(
  async () => loadPublicFlashcardTagsForDataCache(),
  [
    "public-flashcard-tags",
    "v1",
    `rev:${cacheDeploymentRevision()}`,
    String(PUBLIC_FLASHCARD_TAGS_CACHE_REVALIDATE_SEC),
  ],
  {
    revalidate: PUBLIC_FLASHCARD_TAGS_CACHE_REVALIDATE_SEC,
    tags: [CACHE_TAG_MARKETING_PUBLIC_FLASHCARD_TAGS],
  },
);
