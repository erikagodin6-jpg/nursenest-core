import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withDatabaseFallback } from "@/lib/db/safe-database";
import { publicMarketingFlashcardDeckWhere } from "@/lib/entitlements/content-access-scope";

/** Topic tags that appear on at least one public-scope deck (for learner hub filters). */
export async function GET() {
  return withDatabaseFallback(
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
  );
}
