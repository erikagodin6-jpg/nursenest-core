import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ContentStatus } from "@prisma/client";
import { z } from "zod";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { computeNextSchedule, initialSm2State, type FlashcardRating } from "@/lib/flashcards/spaced-repetition";
import { utcDayIndex, nextStreakCounts } from "@/lib/flashcards/streak";
import { prisma } from "@/lib/db";
import { logFlashcardAccessDenied, logFlashcardProgressSaved, logSpacedRepetitionScheduleError } from "@/lib/observability/flashcard-log";
import { enforceFlashcardReviewProtection } from "@/lib/http/api-protection";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { toSchedulerRating } from "@/lib/flashcards/map-study-rating";

const bodySchema = z.object({
  rating: z.enum(["again", "hard", "good", "easy", "incorrect", "unsure", "known"]),
});

function qualityNumeric(rating: FlashcardRating): number {
  switch (rating) {
    case "again":
      return 1;
    case "hard":
      return 3;
    case "good":
      return 4;
    case "easy":
      return 5;
    default:
      return 3;
  }
}

type Props = { params: Promise<{ cardId: string }> };

export const dynamic = "force-dynamic";

/**
 * Save SM-2 progress for a single flashcard without a deck-scoped session (custom / multi-deck study).
 * Deck study should keep using `POST /api/flashcards/decks/[deckRef]/review` so session cursors stay coherent.
 */
export async function POST(req: NextRequest, { params }: Props) {
  return runWithApiTelemetry(req, "POST /api/flashcards/cards/[cardId]/review", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    const { userId, entitlement } = gate;
    const { cardId } = await params;

    setSentryServerContext({ route: "/api/flashcards/cards/[cardId]/review", feature: SERVER_FEATURE.flashcard, userId });

    const reviewLimited = await enforceFlashcardReviewProtection(req, userId);
    if (reviewLimited) return reviewLimited;

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const flashcardId = cardId;
    const { rating: rawRating } = parsed.data;
    const rating = toSchedulerRating(rawRating);

    const card = await prisma.flashcard.findFirst({
      where: {
        AND: [{ id: flashcardId, status: ContentStatus.PUBLISHED }, flashcardAccessWhere(entitlement)],
      },
      select: { id: true },
    });

    if (!card) {
      logFlashcardAccessDenied({ userIdPrefix: userId.slice(0, 8), flashcardId: flashcardId.slice(0, 12), reason: "card_not_accessible" });
      return NextResponse.json({ error: "Card not found", code: "flashcard_access_denied" }, { status: 404 });
    }

    const now = new Date();
    let nextSchedule;
    try {
      const prev = await prisma.flashcardProgress.findUnique({
        where: { userId_flashcardId: { userId, flashcardId } },
      });
      const base = prev
        ? {
            easeFactor: prev.easeFactor,
            intervalDays: prev.intervalDays,
            repetitions: prev.repetitions,
          }
        : initialSm2State();
      nextSchedule = computeNextSchedule(base, rating, now);
    } catch (e) {
      logSpacedRepetitionScheduleError({ flashcardId: flashcardId.slice(0, 12) }, e);
      return NextResponse.json({ error: "Unable to schedule review" }, { status: 500 });
    }

    try {
      await prisma.$transaction(async (tx) => {
        await tx.flashcardProgress.upsert({
          where: { userId_flashcardId: { userId, flashcardId } },
          create: {
            userId,
            flashcardId,
            easeFactor: nextSchedule.easeFactor,
            intervalDays: nextSchedule.intervalDays,
            repetitions: nextSchedule.repetitions,
            nextReviewAt: nextSchedule.nextReviewAt,
            lastQuality: qualityNumeric(rating),
            lastReviewedAt: now,
          },
          update: {
            easeFactor: nextSchedule.easeFactor,
            intervalDays: nextSchedule.intervalDays,
            repetitions: nextSchedule.repetitions,
            nextReviewAt: nextSchedule.nextReviewAt,
            lastQuality: qualityNumeric(rating),
            lastReviewedAt: now,
          },
        });

        const today = utcDayIndex(now);
        const existing = await tx.flashcardUserStats.findUnique({ where: { userId } });
        const lastDay = existing?.lastStudyDate ? utcDayIndex(existing.lastStudyDate) : null;
        const streak = nextStreakCounts(existing?.currentStreak ?? 0, existing?.longestStreak ?? 0, lastDay, today);

        await tx.flashcardUserStats.upsert({
          where: { userId },
          create: {
            userId,
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            lastStudyDate: now,
            cardsReviewedTotal: 1,
          },
          update: {
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            lastStudyDate: now,
            cardsReviewedTotal: { increment: 1 },
          },
        });
      });

      logFlashcardProgressSaved({
        userIdPrefix: userId.slice(0, 8),
        deckId: "custom-session",
        rating: rawRating,
      });

      return NextResponse.json({
        ok: true,
        nextReviewAt: nextSchedule.nextReviewAt.toISOString(),
        easeFactor: nextSchedule.easeFactor,
        intervalDays: nextSchedule.intervalDays,
        repetitions: nextSchedule.repetitions,
      });
    } catch (e) {
      safeServerLogCritical("api_flashcards_card_review", "transaction_failed", { flashcardId: flashcardId.slice(0, 12) }, e);
      return NextResponse.json({ error: "Unable to save progress" }, { status: 503 });
    }
  });
}
