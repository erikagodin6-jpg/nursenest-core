import "server-only";

import { unstable_cache } from "next/cache";
import { cacheDeploymentRevision } from "@/lib/cache/cache-revision";
import { CACHE_TAG_MARKETING_PUBLIC_FLASHCARD_TAGS } from "@/lib/cache/cache-tags";
import { PUBLIC_FLASHCARD_TAGS_CACHE_REVALIDATE_SEC } from "@/lib/cache/public-edge-cache";
import { publicMarketingFlashcardDeckWhere } from "@/lib/entitlements/content-access-scope";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeoutOrThrow } from "@/lib/db/safe-database";
import { logRouteDataPipeline, routeDataDiagnosticsEnabled } from "@/lib/observability/route-data-pipeline-log";

export type PublicFlashcardTagsPayload = { tags: Array<{ slug: string; name: string }> };

/** Cold pool / Prisma warmup can exceed sub-second budgets; empty fallback here poisons `unstable_cache`. */
const TAG_QUERY_TIMEOUT_MS = 12_000;

/**
 * Tags linked via `flashcard_deck_tags` to at least one published, non-hidden deck.
 * When that join is empty (common on prod until content ops link tags), fall back to **deck slugs**
 * so `/flashcards/[slug]` and the marketing hub still have stable navigation targets — same scope as
 * {@link publicMarketingFlashcardDeckWhere} (deck slug wins over tag slug in slug resolution).
 */
async function loadPublicFlashcardTagsFromDb(): Promise<PublicFlashcardTagsPayload> {
  const deckWhere = publicMarketingFlashcardDeckWhere();
  const joinTags = await prisma.flashcardTag.findMany({
    where: { decks: { some: { deck: deckWhere } } },
    orderBy: { name: "asc" },
    take: 80,
    select: { slug: true, name: true },
  });
  if (joinTags.length > 0) return { tags: joinTags };

  const decks = await prisma.flashcardDeck.findMany({
    where: { ...deckWhere, cardCount: { gt: 0 } },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    take: 80,
    select: { slug: true, title: true },
  });
  return { tags: decks.map((d) => ({ slug: d.slug, name: d.title })) };
}

/**
 * Loads public-scope flashcard tags (max 80) — **uncached**, **throws** on DB/timeout (no silent `[]`).
 * Prefer {@link getCachedPublicFlashcardTags} for route handlers.
 */
export async function loadPublicFlashcardTags(): Promise<PublicFlashcardTagsPayload> {
  const payload = await withDatabaseFallbackTimeoutOrThrow(
    loadPublicFlashcardTagsFromDb,
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
      },
    });
  }
  return payload;
}

/**
 * Next.js Data Cache — aligns with CDN `s-maxage` on `GET /api/public/flashcard-tags` so scanners
 * do not fan out heavy Prisma work on every origin miss.
 */
export const getCachedPublicFlashcardTags = unstable_cache(
  async () => loadPublicFlashcardTags(),
  [
    "public-flashcard-tags",
    "v2-deck-fallback",
    `rev:${cacheDeploymentRevision()}`,
    String(PUBLIC_FLASHCARD_TAGS_CACHE_REVALIDATE_SEC),
  ],
  {
    revalidate: PUBLIC_FLASHCARD_TAGS_CACHE_REVALIDATE_SEC,
    tags: [CACHE_TAG_MARKETING_PUBLIC_FLASHCARD_TAGS],
  },
);
