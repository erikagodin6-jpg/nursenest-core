import { NextRequest, NextResponse } from "next/server";
import { ContentStatus, FlashcardDeckVisibility } from "@prisma/client";
import { auth } from "@/lib/auth";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import {
  truncateForPreview,
  userCanAccessDeckForStudy,
} from "@/lib/flashcards/flashcard-access";
import { findPublishedDeckByRef } from "@/lib/flashcards/resolve-deck";
import { buildStudyQueueIds } from "@/lib/flashcards/study-queue";
import { prisma } from "@/lib/db";
import { estimateJsonUtf8Bytes } from "@/lib/questions/question-payload-metrics";
import { logLargeApiResponse } from "@/lib/observability/perf-log";
import {
  logFlashcardAccessDenied,
  logFlashcardLargePayload,
} from "@/lib/observability/flashcard-log";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { withRetry } from "@/lib/resilience/with-retry";
import type { Prisma } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";

const NO_ACCESS: AccessScope = {
  hasAccess: false,
  reason: "no_access",
  tier: null,
  country: null,
};

const PREVIEW_CARD_CAP = 12;
const MAX_BATCH = 12;

type Props = { params: Promise<{ deckRef: string }> };

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: Props) {
  const { deckRef } = await params;
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const sp = req.nextUrl.searchParams;
  const limit = Math.min(MAX_BATCH, Math.max(1, Number(sp.get("limit") ?? "8")));
  const reset = sp.get("reset") === "1";

  setSentryServerContext({ route: "/api/flashcards/decks/[deckRef]/study", feature: "flashcard", userId: userId ?? "" });

  const deck = await findPublishedDeckByRef(deckRef);
  if (!deck) {
    return NextResponse.json({ error: "Deck not found" }, { status: 404 });
  }

  let entitlement: AccessScope = NO_ACCESS;
  if (userId) {
    try {
      entitlement = await resolveEntitlement(userId);
    } catch (e) {
      safeServerLogCritical("api_flashcards_study", "entitlement_failed", { deckId: deck.id.slice(0, 12) }, e);
      return NextResponse.json({ error: "Unable to verify access" }, { status: 503 });
    }
  }

  if (!userCanAccessDeckForStudy(deck, entitlement)) {
    logFlashcardAccessDenied({ deckId: deck.id.slice(0, 12), surface: "study_get" });
    return NextResponse.json({ error: "Access denied", code: "flashcard_access_denied" }, { status: 403 });
  }

  const isSubscriber = Boolean(entitlement.hasAccess);
  const usePreviewOnly =
    deck.visibility === FlashcardDeckVisibility.PUBLIC_PREVIEW && !isSubscriber;

  try {
    if (usePreviewOnly) {
      const cards = await withRetry(() =>
        prisma.flashcard.findMany({
          where: { deckId: deck.id, status: ContentStatus.PUBLISHED },
          orderBy: { positionInDeck: "asc" },
          take: PREVIEW_CARD_CAP,
          select: { id: true, front: true, back: true },
        }),
      );

      const body = {
        mode: "preview" as const,
        deckId: deck.id,
        slug: deck.slug,
        cards: cards.map((c) => ({
          id: c.id,
          front: c.front,
          back: truncateForPreview(c.back),
          fullBackAvailable: false,
        })),
        session: null,
      };
      const approx = estimateJsonUtf8Bytes(body);
      logLargeApiResponse(`/api/flashcards/decks/${deckRef}/study`, approx);
      if (approx > 350_000) logFlashcardLargePayload({ route: "study_preview", approxUtf8: approx });
      return NextResponse.json(body);
    }

    if (!userId) {
      logFlashcardAccessDenied({ deckId: deck.id.slice(0, 12), reason: "auth_required_full_study" });
      return NextResponse.json({ error: "Sign in to study this deck", code: "auth_required" }, { status: 401 });
    }

    if (deck.visibility === FlashcardDeckVisibility.SUBSCRIBER && !isSubscriber) {
      logFlashcardAccessDenied({ deckId: deck.id.slice(0, 12), reason: "subscription_required" });
      return NextResponse.json({ error: "Subscription required", code: "no_active_subscription" }, { status: 403 });
    }

    const cardWhere: Prisma.FlashcardWhereInput = {
      AND: [{ deckId: deck.id, status: ContentStatus.PUBLISHED }, flashcardAccessWhere(entitlement)],
    };

    const deckCards = await withRetry(() =>
      prisma.flashcard.findMany({
        where: cardWhere,
        select: { id: true, positionInDeck: true },
        orderBy: { positionInDeck: "asc" },
      }),
    );

    if (deckCards.length === 0) {
      return NextResponse.json({
        mode: "subscriber" as const,
        deckId: deck.id,
        slug: deck.slug,
        cards: [],
        session: { cursor: 0, queueLength: 0, done: true },
      });
    }

    const progressRows = await withRetry(() =>
      prisma.flashcardProgress.findMany({
        where: { userId, flashcardId: { in: deckCards.map((c) => c.id) } },
        select: {
          flashcardId: true,
          nextReviewAt: true,
          repetitions: true,
        },
      }),
    );

    const progressMap = new Map(
      progressRows.map((p) => [
        p.flashcardId,
        { nextReviewAt: p.nextReviewAt, repetitions: p.repetitions },
      ]),
    );

    const now = new Date();
    const queueIds = buildStudyQueueIds(deckCards, progressMap, now);

    let sessionRow = await withRetry(() =>
      prisma.flashcardStudySession.findUnique({
        where: { userId_deckId: { userId, deckId: deck.id } },
      }),
    );

    if (!sessionRow || reset) {
      sessionRow = await withRetry(() =>
        prisma.flashcardStudySession.upsert({
          where: { userId_deckId: { userId, deckId: deck.id } },
          create: {
            userId,
            deckId: deck.id,
            queueIds: queueIds as unknown as Prisma.InputJsonValue,
            cursor: 0,
          },
          update: {
            queueIds: queueIds as unknown as Prisma.InputJsonValue,
            cursor: 0,
          },
        }),
      );
    }

    const storedQueue = sessionRow.queueIds as string[];
    const cursor = Math.min(sessionRow.cursor, storedQueue.length);
    const sliceIds = storedQueue.slice(cursor, cursor + limit);
    const cardPayload = await withRetry(() =>
      prisma.flashcard.findMany({
        where: { id: { in: sliceIds } },
        select: { id: true, front: true, back: true },
      }),
    );
    const byId = new Map(cardPayload.map((c) => [c.id, c]));
    const ordered = sliceIds.map((id) => byId.get(id)).filter(Boolean) as { id: string; front: string; back: string }[];

    const body = {
      mode: "subscriber" as const,
      deckId: deck.id,
      slug: deck.slug,
      cards: ordered.map((c) => ({
        id: c.id,
        front: c.front,
        back: c.back,
        fullBackAvailable: true,
      })),
      session: {
        cursor,
        queueLength: storedQueue.length,
        done: cursor >= storedQueue.length,
        batchSize: ordered.length,
      },
    };

    const approx = estimateJsonUtf8Bytes(body);
    logLargeApiResponse(`/api/flashcards/decks/${deckRef}/study`, approx);
    if (approx > 400_000) logFlashcardLargePayload({ route: "study_subscriber", approxUtf8: approx });

    return NextResponse.json(body);
  } catch (e) {
    safeServerLogCritical("api_flashcards_study", "query_failed", { deckRef }, e);
    return NextResponse.json({ error: "Unable to load study batch" }, { status: 503 });
  }
}
