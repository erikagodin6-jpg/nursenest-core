import { type NextRequest, NextResponse } from "next/server";
import { ContentStatus, FlashcardDeckVisibility } from "@prisma/client";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  try {
    const [
      totalDecks,
      publishedDecks,
      hiddenDecks,
      totalCards,
      publishedCards,
      orphanCards,
      byExamFamily,
      publishedCardsMissingTopicCode,
      publishedDecksLowCards,
      deckTagSlugCollisions,
    ] = await Promise.all([
      prisma.flashcardDeck.count(),
      prisma.flashcardDeck.count({ where: { status: ContentStatus.PUBLISHED } }),
      prisma.flashcardDeck.count({ where: { visibility: FlashcardDeckVisibility.HIDDEN } }),
      prisma.flashcard.count(),
      prisma.flashcard.count({ where: { status: ContentStatus.PUBLISHED } }),
      prisma.flashcard.count({ where: { deckId: null, status: ContentStatus.PUBLISHED } }),
      prisma.flashcard.groupBy({
        by: ["examFamily"],
        where: { status: ContentStatus.PUBLISHED },
        _count: { _all: true },
      }),
      prisma.flashcard.count({
        where: { status: ContentStatus.PUBLISHED, category: { topicCode: null } },
      }),
      prisma.flashcardDeck.count({
        where: { status: ContentStatus.PUBLISHED, cardCount: { lt: 3 } },
      }),
      prisma.$queryRaw<{ slug: string }[]>`
        SELECT d.slug AS slug
        FROM "flashcard_decks" d
        INNER JOIN "flashcard_tags" t ON t.slug = d.slug
        LIMIT 100
      `,
    ]);

    const cardsPerExam = Object.fromEntries(byExamFamily.map((r) => [r.examFamily, r._count._all]));

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      decks: {
        total: totalDecks,
        published: publishedDecks,
        hidden: hiddenDecks,
      },
      cards: {
        total: totalCards,
        published: publishedCards,
        publishedOrphans: orphanCards,
        publishedMissingTopicCode: publishedCardsMissingTopicCode,
        perExamFamily: cardsPerExam,
      },
      quality: {
        publishedDecksWithCardCountUnder3: publishedDecksLowCards,
        deckAndTagSlugCollisions: deckTagSlugCollisions.map((r) => r.slug),
      },
    });
  } catch (e) {
    safeServerLogCritical("admin_flashcards_summary", "query_failed", {}, e);
    return NextResponse.json({ error: "Summary failed" }, { status: 503 });
  }
}
