import { NextResponse } from "next/server";
import { ContentStatus } from "@prisma/client";
import { z } from "zod";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import {
  computeNextSchedule,
  initialSm2State,
  type FlashcardRating,
} from "@/lib/flashcards/spaced-repetition";
import { utcDayIndex, nextStreakCounts } from "@/lib/flashcards/streak";
import { userCanAccessDeckForStudy } from "@/lib/flashcards/flashcard-access";
import { findPublishedDeckByRef } from "@/lib/flashcards/resolve-deck";
import { prisma } from "@/lib/db";
import {
  logFlashcardAccessDenied,
  logFlashcardProgressSaved,
  logSpacedRepetitionScheduleError,
} from "@/lib/observability/flashcard-log";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import type { Prisma } from "@prisma/client";

const bodySchema = z.object({
  flashcardId: z.string().min(4),
  rating: z.enum(["again", "hard", "good", "easy"]),
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

type Props = { params: Promise<{ deckRef: string }> };

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: Props) {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const { userId, entitlement } = gate;
  const { deckRef } = await params;

  setSentryServerContext({ route: "/api/flashcards/decks/[deckRef]/review", feature: "flashcard", userId });

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { flashcardId, rating } = parsed.data;

  const deck = await findPublishedDeckByRef(deckRef);
  if (!deck) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });
  }

  if (!userCanAccessDeckForStudy(deck, entitlement)) {
    logFlashcardAccessDenied({ userIdPrefix: userId.slice(0, 8), deckId: deck.id.slice(0, 12), surface: "review" });
    return NextResponse.json({ error: "Access denied", code: "flashcard_access_denied" }, { status: 403 });
  }

  const cardWhere: Prisma.FlashcardWhereInput = {
    AND: [
      { id: flashcardId, deckId: deck.id, status: ContentStatus.PUBLISHED },
      flashcardAccessWhere(entitlement),
    ],
  };

  const card = await prisma.flashcard.findFirst({
    where: cardWhere,
    select: { id: true },
  });

  if (!card) {
    logFlashcardAccessDenied({ userIdPrefix: userId.slice(0, 8), flashcardId: flashcardId.slice(0, 12), reason: "card_not_in_deck" });
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
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
    nextSchedule = computeNextSchedule(base, rating as FlashcardRating, now);
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
          lastQuality: qualityNumeric(rating as FlashcardRating),
          lastReviewedAt: now,
        },
        update: {
          easeFactor: nextSchedule.easeFactor,
          intervalDays: nextSchedule.intervalDays,
          repetitions: nextSchedule.repetitions,
          nextReviewAt: nextSchedule.nextReviewAt,
          lastQuality: qualityNumeric(rating as FlashcardRating),
          lastReviewedAt: now,
        },
      });

      const sess = await tx.flashcardStudySession.findUnique({
        where: { userId_deckId: { userId, deckId: deck.id } },
      });
      if (sess) {
        const q = sess.queueIds as string[];
        if (q.length > 0 && q[sess.cursor] === flashcardId) {
          await tx.flashcardStudySession.update({
            where: { id: sess.id },
            data: { cursor: Math.min(sess.cursor + 1, q.length) },
          });
        }
      }

      const today = utcDayIndex(now);
      const existing = await tx.flashcardUserStats.findUnique({ where: { userId } });
      const lastDay = existing?.lastStudyDate ? utcDayIndex(existing.lastStudyDate) : null;
      const streak = nextStreakCounts(
        existing?.currentStreak ?? 0,
        existing?.longestStreak ?? 0,
        lastDay,
        today,
      );

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
      deckId: deck.id.slice(0, 12),
      rating,
    });

    return NextResponse.json({
      ok: true,
      nextReviewAt: nextSchedule.nextReviewAt.toISOString(),
      easeFactor: nextSchedule.easeFactor,
      intervalDays: nextSchedule.intervalDays,
      repetitions: nextSchedule.repetitions,
    });
  } catch (e) {
    safeServerLogCritical("api_flashcards_review", "transaction_failed", { flashcardId: flashcardId.slice(0, 12) }, e);
    return NextResponse.json({ error: "Unable to save progress" }, { status: 503 });
  }
}
