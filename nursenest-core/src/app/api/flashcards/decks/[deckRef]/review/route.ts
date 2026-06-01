import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
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
import { enforceFlashcardReviewProtection } from "@/lib/http/api-protection";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { validateFlashcardsPostLaunchRequest } from "@/lib/learner/study-product-route-contract";
import type { Prisma } from "@prisma/client";
import { toSchedulerRating } from "@/lib/flashcards/map-study-rating";
import { safeStudyOptional } from "@/lib/study-mode/study-mode-fallback";
import {
  invalidateFlashcardDueSummary,
  invalidateStudyQueueCounts,
} from "@/lib/server/content-cache";

const bodySchema = z.object({
  flashcardId: z.string().min(4),
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

type Props = { params: Promise<{ deckRef: string }> };

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: Props) {
  return runWithApiTelemetry(req, "POST /api/flashcards/decks/[deckRef]/review", "content", async () => {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const { userId, entitlement } = gate;
  const { deckRef } = await params;

  setSentryServerContext({ route: "/api/flashcards/decks/[deckRef]/review", feature: SERVER_FEATURE.flashcard, userId });

  const surface = validateFlashcardsPostLaunchRequest(req);
  if (!surface.ok) {
    safeServerLog("api_flashcards", "study_launch_route_contract_violation", {
      event: "study_launch_route_contract_violation",
      feature_surface: "flashcards",
      outcome: "rejected_invalid_route",
      expected: surface.expected,
      received: surface.received,
      user_id_prefix: userId.slice(0, 8),
    });
    return NextResponse.json(
      { error: surface.error, expected: surface.expected, received: surface.received, reason: surface.reason, retryable: false },
      { status: 403 },
    );
  }

  const reviewLimited = await enforceFlashcardReviewProtection(req, userId);
  if (reviewLimited) return reviewLimited;

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { flashcardId, rating: rawRating } = parsed.data;
  const rating = toSchedulerRating(rawRating);

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
          lapses: prev.lapses,
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
          lapses: nextSchedule.lapses,
          nextReviewAt: nextSchedule.nextReviewAt,
          lastQuality: qualityNumeric(rating),
          lastReviewedAt: now,
        },
        update: {
          easeFactor: nextSchedule.easeFactor,
          intervalDays: nextSchedule.intervalDays,
          repetitions: nextSchedule.repetitions,
          lapses: nextSchedule.lapses,
          nextReviewAt: nextSchedule.nextReviewAt,
          lastQuality: qualityNumeric(rating),
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

    });

    await safeStudyOptional(
      "gamification",
      "flashcards_deck_review",
      async () => {
        const today = utcDayIndex(now);
        const existing = await prisma.flashcardUserStats.findUnique({ where: { userId } });
        const lastDay = existing?.lastStudyDate ? utcDayIndex(existing.lastStudyDate) : null;
        const streak = nextStreakCounts(
          existing?.currentStreak ?? 0,
          existing?.longestStreak ?? 0,
          lastDay,
          today,
        );

        await prisma.flashcardUserStats.upsert({
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
        return true;
      },
      false,
      { timeoutMs: 500, label: "flashcards_deck_streak_stats" },
    );

    logFlashcardProgressSaved({
      userIdPrefix: userId.slice(0, 8),
      deckId: deck.id.slice(0, 12),
      rating: rawRating,
    });

    // Invalidate SRS count caches so dashboard due-summary and study-queue reflect
    // the new nextReviewAt/lapses values without waiting for TTL expiry.
    await Promise.all([
      invalidateFlashcardDueSummary(userId),
      invalidateStudyQueueCounts(userId, deck.pathwayId ?? null),
      ...(deck.pathwayId ? [invalidateStudyQueueCounts(userId, null)] : []),
    ]);

    return NextResponse.json({
      ok: true,
      nextReviewAt: nextSchedule.nextReviewAt.toISOString(),
      easeFactor: nextSchedule.easeFactor,
      intervalDays: nextSchedule.intervalDays,
      repetitions: nextSchedule.repetitions,
      lapses: nextSchedule.lapses,
    });
  } catch (e) {
    safeServerLogCritical("api_flashcards_review", "transaction_failed", { flashcardId: flashcardId.slice(0, 12) }, e);
    return NextResponse.json({ error: "Unable to save progress" }, { status: 503 });
  }
  });
}
