import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withDatabaseFallbackTimeout } from "@/lib/db/safe-database";
import { publicMarketingFlashcardDeckWhere } from "@/lib/entitlements/content-access-scope";
import { API_ROUTE_MAX_DURATION_DEFAULT_SEC } from "@/lib/server/api-route-constants";
import { safeJsonReadRoute } from "@/lib/server/safe-api-route";

export const maxDuration = API_ROUTE_MAX_DURATION_DEFAULT_SEC;

const TAG_QUERY_TIMEOUT_MS = 12_000;

/** Topic tags that appear on at least one public-scope deck (for learner hub filters). */
export async function GET() {
  return safeJsonReadRoute(
    "GET /api/public/flashcard-tags",
    async () =>
      withDatabaseFallbackTimeout(
      async () => {
        const deckWhere = publicMarketingFlashcardDeckWhere();
        const tags = await prisma.flashcardTag.findMany({
          where: { decks: { some: { deck: deckWhere } } },
          orderBy: { name: "asc" },
          take: 80,
          select: { slug: true, name: true },
        });
        return NextResponse.json({ tags });
      },
      NextResponse.json({ tags: [] }),
      TAG_QUERY_TIMEOUT_MS,
      { scope: "api_public", label: "flashcard_tags" },
      ),
    { tags: [] },
  );
}
