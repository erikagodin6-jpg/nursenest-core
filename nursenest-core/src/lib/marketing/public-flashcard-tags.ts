import "server-only";

import { unstable_cache } from "next/cache";
import { cacheDeploymentRevision } from "@/lib/cache/cache-revision";
import { CACHE_TAG_MARKETING_PUBLIC_FLASHCARD_TAGS } from "@/lib/cache/cache-tags";
import { PUBLIC_FLASHCARD_TAGS_CACHE_REVALIDATE_SEC } from "@/lib/cache/public-edge-cache";
import { publicMarketingFlashcardDeckWhere } from "@/lib/entitlements/content-access-scope";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";

export type PublicFlashcardTagsPayload = { tags: Array<{ slug: string; name: string }> };

const TAG_QUERY_TIMEOUT_MS = 800;

/**
 * Loads public-scope flashcard tags (max 80) — **uncached**; prefer {@link getCachedPublicFlashcardTags}.
 */
export async function loadPublicFlashcardTags(): Promise<PublicFlashcardTagsPayload> {
  return withDatabaseFallbackTimeout(
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
}

/**
 * Next.js Data Cache — aligns with CDN `s-maxage` on `GET /api/public/flashcard-tags` so scanners
 * do not fan out heavy Prisma work on every origin miss.
 */
export const getCachedPublicFlashcardTags = unstable_cache(
  async () => loadPublicFlashcardTags(),
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
