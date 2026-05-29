import { type NextRequest, NextResponse } from "next/server";
import { ContentStatus, FlashcardDeckVisibility } from "@prisma/client";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { buildFlashcardQualityReviewQueue } from "@/lib/flashcards/question-quality-engine";

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
      recentAttempts,
      recentOptionResponses,
      recentSessions,
      qualitySample,
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
      prisma.flashcardAttempt.count({
        where: { answeredAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      }),
      prisma.flashcardOptionResponse.count({
        where: { respondedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      }),
      prisma.flashcardSession.count({
        where: { startedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      }),
      prisma.flashcard.findMany({
        where: { status: ContentStatus.PUBLISHED },
        select: {
          id: true,
          questionStem: true,
          rationaleCorrect: true,
          rationaleIncorrect: true,
          options: {
            select: { optionKey: true, rationale: true, isCorrect: true },
            orderBy: { displayOrder: "asc" },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: 150,
      }),
    ]);

    const cardsPerExam = Object.fromEntries(byExamFamily.map((r) => [r.examFamily, r._count._all]));
    const qualityQueue = buildFlashcardQualityReviewQueue(
      qualitySample.map((card) => {
        const legacyDistractors = Array.isArray(card.rationaleIncorrect)
          ? (card.rationaleIncorrect as Array<{ letter?: string; rationale?: string | null }>)
              .map((row) => ({ letter: String(row.letter ?? ""), rationale: row.rationale ?? null }))
          : [];
        const optionDistractors = card.options
          .filter((option) => !option.isCorrect)
          .map((option) => ({ letter: option.optionKey, rationale: option.rationale }));
        return {
          id: card.id,
          prompt: card.questionStem,
          correctRationale: card.rationaleCorrect,
          distractorRationales: optionDistractors.length > 0 ? optionDistractors : legacyDistractors,
        };
      }),
    );

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
        sampledCards: qualitySample.length,
        sampledNeedsReview: qualityQueue.filter((row) => row.severity === "needs_review").length,
        sampledCritical: qualityQueue.filter((row) => row.severity === "critical").length,
        reviewQueueSample: qualityQueue.slice(0, 8),
      },
      health: {
        recentAttempts7d: recentAttempts,
        recentOptionResponses7d: recentOptionResponses,
        recentSessions7d: recentSessions,
        abandonmentRate: null,
        confidenceTrend: "available_from_flashcard_attempts",
      },
    });
  } catch (e) {
    safeServerLogCritical("admin_flashcards_summary", "query_failed", {}, e);
    return NextResponse.json({ error: "Summary failed" }, { status: 503 });
  }
}
