import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { ContentStatus, FlashcardDeckVisibility } from "@prisma/client";
import { auth } from "@/lib/auth";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import { notSubscribedResponse } from "@/lib/entitlements/require-subscriber-session";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import {
  truncateForPreview,
  userCanAccessDeckForStudy,
} from "@/lib/flashcards/flashcard-access";
import { findPublishedDeckByRef } from "@/lib/flashcards/resolve-deck";
import { buildStudyQueueIds, shuffleFlashcardQueueWithinDueBands } from "@/lib/flashcards/study-queue";
import { prisma } from "@/lib/db";
import {
  PRISMA_FLASHCARD_DECK_INDEX_MAX,
  takeForIdIn,
} from "@/lib/db/prisma-find-many-bounds";
import { estimateJsonUtf8Bytes } from "@/lib/questions/question-payload-metrics";
import { logLargeApiResponse } from "@/lib/observability/perf-log";
import {
  logFlashcardAccessDenied,
  logFlashcardLargePayload,
} from "@/lib/observability/flashcard-log";
import { enforceFlashcardStudyProtection } from "@/lib/http/api-protection";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { withRetry } from "@/lib/resilience/with-retry";
import type { Prisma } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { resolveMergedFlashcardEducationalBundle } from "@/lib/i18n/educational-translation-db";
import { getMarketingLocaleFromRequestCookie } from "@/lib/i18n/marketing-locale-cookie";
import {
  serializeFlashcardForDeckStudy,
  type FlashcardStudySelectRow,
  type FlashcardStudyApiCard,
} from "@/lib/flashcards/flashcard-study-serialize";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { bankExamQuestionRowToFlashcardStudySelectRow } from "@/lib/flashcards/bank-exam-question-to-flashcard-select";
import { loadExamQuestionRowsForFlashcardPool } from "@/lib/flashcards/flashcard-exam-bank-hub-inventory";
import { resolveAccessScopeForPathwayExamQuestionPool } from "@/lib/flashcards/load-flashcards-exam-inventory.server";
import {
  buildFlashcardSessionFallback,
  hasFallbackContentForPathway,
} from "@/lib/study-content-failover/flashcard-session-static-fallback.server";

const NO_ACCESS: AccessScope = {
  hasAccess: false,
  reason: "no_access",
  tier: null,
  country: null,
  alliedCareer: null,
};

const PREVIEW_CARD_CAP = 12;
const MAX_BATCH = 40;

type Props = { params: Promise<{ deckRef: string }> };

export const dynamic = "force-dynamic";

type DeckStudyFailureCode =
  | "auth_required"
  | "deck_not_found"
  | "deck_study_empty_pool"
  | "deck_study_query_failed"
  | "entitlement_check_failed";

function deckStudyFailureResponse(
  code: DeckStudyFailureCode,
  error: string,
  status: number,
  integrity?: {
    rawCount?: number | null;
    filteredCount?: number | null;
    finalCount?: number | null;
    reasonFailed?: string;
  },
) {
  return NextResponse.json(
    {
      ok: false,
      code,
      error,
      retryable: status >= 500,
      integrity: {
        querySucceeded: status < 500,
        source: "flashcard_deck_study",
        rawCount: integrity?.rawCount ?? null,
        filteredCount: integrity?.filteredCount ?? null,
        finalCount: integrity?.finalCount ?? 0,
        reasonFailed: integrity?.reasonFailed ?? code,
      },
    },
    { status },
  );
}

function logDeckSessionLoad(args: {
  stage: "attempt" | "success" | "failed" | "empty";
  deckRef: string;
  deckId?: string | null;
  userId?: string | null;
  pathway?: string | null;
  country?: string | null;
  tier?: string | null;
  requestedCount?: number | null;
  candidateFlashcards?: number | null;
  publishedFlashcards?: number | null;
  eligibleFlashcards?: number | null;
  finalSessionPoolSize?: number | null;
  sessionId?: string | null;
  failureReason?: string;
}) {
  safeServerLog("api_flashcards_study", "FLASHCARD_DECK_SESSION_LOAD", {
    stage: args.stage,
    userId: args.userId?.slice(0, 8) ?? "",
    pathway: args.pathway ?? "",
    country: args.country ?? "",
    tier: args.tier ?? "",
    systems: "",
    selectedTopics: args.deckRef,
    selectedDeckIds: args.deckId ? `deck:${args.deckId.slice(0, 12)}` : args.deckRef,
    candidateFlashcards: args.candidateFlashcards ?? null,
    publishedFlashcards: args.publishedFlashcards ?? null,
    eligibleFlashcards: args.eligibleFlashcards ?? null,
    finalSessionPoolSize: args.finalSessionPoolSize ?? null,
    sessionId: args.sessionId ?? "",
    requestedCount: args.requestedCount ?? null,
    failureReason: args.failureReason ?? "",
  });
}

async function loadBankBackedStudyCards(args: {
  userId: string;
  entitlement: AccessScope;
  pathwayId: string | null | undefined;
  take: number;
  educationalLocale: string;
  flashcardBundle: Awaited<ReturnType<typeof resolveMergedFlashcardEducationalBundle>> | undefined;
  examOptionShuffleSalt: string;
  existingExamQuestionIds: Set<string>;
}): Promise<FlashcardStudyApiCard[]> {
  const pid = args.pathwayId?.trim();
  if (!pid || args.take <= 0) return [];
  const pathway = getExamPathwayById(pid);
  if (!pathway) return [];
  const access = await resolveAccessScopeForPathwayExamQuestionPool(args.userId, args.entitlement, pathway);
  const scope = access.scope;
  if (!scope) return [];
  const rows = await loadExamQuestionRowsForFlashcardPool(scope, pathway, null, Math.max(args.take * 4, 24));
  const out: FlashcardStudyApiCard[] = [];
  for (const row of rows) {
    if (out.length >= args.take) break;
    if (args.existingExamQuestionIds.has(row.id)) continue;
    const base = bankExamQuestionRowToFlashcardStudySelectRow(row);
    if (!base) continue;
    const studyRow: FlashcardStudySelectRow = {
      ...base,
      id: `exam_bank:${row.id}`,
      sourceKey: `exam_q:${row.id}`,
      category: { name: row.bodySystem?.trim() || row.topic?.trim() || "NCLEX practice", topicCode: row.topic ?? null },
      deck: { pathwayId: pid, title: "NCLEX question bank" },
      clinicalPearl: row.clinicalPearl ?? null,
      keyTakeaway: row.keyTakeaway ?? null,
    };
    const serialized = serializeFlashcardForDeckStudy(studyRow, {
      educationalLocale: args.educationalLocale,
      flashcardBundle: args.flashcardBundle,
      fullBackAvailable: true,
      examOptionShuffleSalt: args.examOptionShuffleSalt,
    });
    args.existingExamQuestionIds.add(row.id);
    out.push(serialized);
  }
  return out;
}

export async function GET(req: NextRequest, { params }: Props) {
  return runWithApiTelemetry(req, "GET /api/flashcards/decks/[deckRef]/study", "content", async () => {
  const { deckRef } = await params;
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const sp = req.nextUrl.searchParams;
  const rawLimit = Number(sp.get("limit") ?? "8");
  const requestedCount = Number.isFinite(rawLimit) ? Math.max(1, rawLimit) : 8;
  const limit = Math.min(MAX_BATCH, requestedCount);
  const reset = sp.get("reset") === "1";
  const shuffle = sp.get("shuffle") === "1";
  const instant = sp.get("instant") === "1";
  const rawCursor = Number(sp.get("cursor") ?? "0");
  const requestedCursor = Number.isFinite(rawCursor) && rawCursor > 0 ? Math.floor(rawCursor) : 0;
  const educationalLocale = getMarketingLocaleFromRequestCookie(req);
  const flashcardBundle =
    educationalLocale === "en" ? undefined : await resolveMergedFlashcardEducationalBundle(educationalLocale);
  const examOptionShuffleSalt = randomUUID();

  setSentryServerContext({ route: "/api/flashcards/decks/[deckRef]/study", feature: SERVER_FEATURE.flashcard, userId: userId ?? "" });
  logDeckSessionLoad({
    stage: "attempt",
    deckRef,
    userId,
    requestedCount,
    finalSessionPoolSize: null,
  });

  const deck = await findPublishedDeckByRef(deckRef);
  if (!deck) {
    logDeckSessionLoad({
      stage: "failed",
      deckRef,
      userId,
      requestedCount,
      finalSessionPoolSize: 0,
      failureReason: "deck_not_found",
    });
    return deckStudyFailureResponse("deck_not_found", "Flashcard deck was not found.", 404, {
      reasonFailed: "deck_not_found",
    });
  }

  let entitlement: AccessScope = NO_ACCESS;
  if (userId) {
    try {
      entitlement = await resolveEntitlement(userId);
    } catch (e) {
      safeServerLogCritical("api_flashcards_study", "entitlement_failed", { deckId: deck.id.slice(0, 12) }, e);
      logDeckSessionLoad({
        stage: "failed",
        deckRef,
        deckId: deck.id,
        userId,
        pathway: deck.pathwayId,
        requestedCount,
        finalSessionPoolSize: 0,
        failureReason: "entitlement_check_failed",
      });
      return deckStudyFailureResponse("entitlement_check_failed", "Unable to verify access to this flashcard deck.", 503, {
        reasonFailed: "entitlement_check_failed",
      });
    }
  }

  if (!userCanAccessDeckForStudy(deck, entitlement)) {
    logFlashcardAccessDenied({ deckId: deck.id.slice(0, 12), surface: "study_get" });
    safeServerLog("api_flashcards_study", "entitlement_mismatch_deck_access", {
      deckIdPrefix: deck.id.slice(0, 8),
      tier: String(entitlement.tier ?? ""),
      country: String(entitlement.country ?? ""),
      visibility: deck.visibility,
    });
    return notSubscribedResponse();
  }

  const isSubscriber = Boolean(entitlement.hasAccess);
  const usePreviewOnly =
    deck.visibility === FlashcardDeckVisibility.PUBLIC_PREVIEW && !isSubscriber;

  try {
    if (usePreviewOnly) {
      const totalPreviewAvailable = await withRetry(() =>
        prisma.flashcard.count({
          where: { deckId: deck.id, status: ContentStatus.PUBLISHED },
        }),
      );
      const cards = await withRetry(() =>
        prisma.flashcard.findMany({
          where: { deckId: deck.id, status: ContentStatus.PUBLISHED },
          orderBy: { positionInDeck: "asc" },
          take: PREVIEW_CARD_CAP,
          select: {
            id: true,
            front: true,
            back: true,
            lessonId: true,
            sourceKey: true,
            examItemKind: true,
            questionStem: true,
            answerOptions: true,
            correctAnswer: true,
            rationaleCorrect: true,
            rationaleIncorrect: true,
            options: {
              orderBy: { displayOrder: "asc" },
              select: {
                id: true,
                optionKey: true,
                content: true,
                isCorrect: true,
                rationale: true,
                displayOrder: true,
                selectCount: true,
                correctSelectCount: true,
              },
            },
            category: { select: { name: true, topicCode: true } },
            deck: { select: { pathwayId: true } },
          },
        }),
      );

      const serializedCards = cards
        .map((c) => {
          const row = serializeFlashcardForDeckStudy(c, {
            educationalLocale,
            flashcardBundle,
            fullBackAvailable: false,
            examOptionShuffleSalt,
          });
          return {
            ...row,
            back: truncateForPreview(row.back),
          };
        });
      const body = {
        mode: "preview" as const,
        deckId: deck.id,
        slug: deck.slug,
        cards: serializedCards,
        session: null,
        sessionMeta: {
          requestedCount,
          returnedCount: serializedCards.length,
          totalAvailable: totalPreviewAvailable,
          hasMore: serializedCards.length < totalPreviewAvailable,
        },
      };
      const approx = estimateJsonUtf8Bytes(body);
      logLargeApiResponse(`/api/flashcards/decks/${deckRef}/study`, approx);
      if (approx > 350_000) logFlashcardLargePayload({ route: "study_preview", approxUtf8: approx });
      logDeckSessionLoad({
        stage: serializedCards.length > 0 ? "success" : "empty",
        deckRef,
        deckId: deck.id,
        userId,
        pathway: deck.pathwayId,
        country: String(entitlement.country ?? ""),
        tier: String(entitlement.tier ?? ""),
        requestedCount,
        candidateFlashcards: totalPreviewAvailable,
        publishedFlashcards: totalPreviewAvailable,
        eligibleFlashcards: totalPreviewAvailable,
        finalSessionPoolSize: serializedCards.length,
        sessionId: `preview:${deck.id.slice(0, 8)}`,
        failureReason: serializedCards.length > 0 ? "" : "deck_study_empty_pool",
      });
      return NextResponse.json(body);
    }

    if (!userId) {
      logFlashcardAccessDenied({ deckId: deck.id.slice(0, 12), reason: "auth_required_full_study" });
      logDeckSessionLoad({
        stage: "failed",
        deckRef,
        deckId: deck.id,
        pathway: deck.pathwayId,
        requestedCount,
        finalSessionPoolSize: 0,
        failureReason: "auth_required",
      });
      return deckStudyFailureResponse("auth_required", "Sign in to study this deck.", 401, {
        reasonFailed: "auth_required",
      });
    }

    if (deck.visibility === FlashcardDeckVisibility.SUBSCRIBER && !isSubscriber) {
      logFlashcardAccessDenied({ deckId: deck.id.slice(0, 12), reason: "subscription_required" });
      return notSubscribedResponse();
    }

    const studyLimited = await enforceFlashcardStudyProtection(req, userId);
    if (studyLimited) return studyLimited;

    const cardWhere: Prisma.FlashcardWhereInput = {
      AND: [{ deckId: deck.id, status: ContentStatus.PUBLISHED }, flashcardAccessWhere(entitlement)],
    };

    if (instant) {
      const rows = await withRetry(() =>
        prisma.flashcard.findMany({
          where: cardWhere,
          select: {
            id: true,
            front: true,
            back: true,
            lessonId: true,
            sourceKey: true,
            examItemKind: true,
            questionStem: true,
            answerOptions: true,
            correctAnswer: true,
            rationaleCorrect: true,
            rationaleIncorrect: true,
            options: {
              orderBy: { displayOrder: "asc" },
              select: {
                id: true,
                optionKey: true,
                content: true,
                isCorrect: true,
                rationale: true,
                displayOrder: true,
                selectCount: true,
                correctSelectCount: true,
              },
            },
            category: { select: { name: true, topicCode: true } },
            deck: { select: { pathwayId: true } },
          },
          orderBy: { positionInDeck: "asc" },
          skip: requestedCursor,
          take: limit + 1,
        }),
      );
      const serializedDeckCards = rows
        .slice(0, limit)
        .map((c) =>
          serializeFlashcardForDeckStudy(c, {
            educationalLocale,
            flashcardBundle,
            fullBackAvailable: true,
            examOptionShuffleSalt,
          }),
        );
      const studyCards = serializedDeckCards.slice(0, limit);
      if (requestedCursor === 0 && studyCards.length === 0) {
        logDeckSessionLoad({
          stage: "empty",
          deckRef,
          deckId: deck.id,
          userId,
          pathway: deck.pathwayId,
          country: String(entitlement.country ?? ""),
          tier: String(entitlement.tier ?? ""),
          requestedCount,
          candidateFlashcards: rows.length,
          publishedFlashcards: rows.length,
          eligibleFlashcards: rows.length,
          finalSessionPoolSize: 0,
          sessionId: `instant:${deck.id.slice(0, 8)}`,
          failureReason: "deck_study_empty_pool",
        });
        return deckStudyFailureResponse("deck_study_empty_pool", "No flashcards were found for this deck.", 404, {
          rawCount: rows.length,
          filteredCount: rows.length,
          finalCount: 0,
          reasonFailed: "empty_deck_study_pool",
        });
      }
      const body = {
        mode: "subscriber" as const,
        deckId: deck.id,
        slug: deck.slug,
        title: deck.title,
        cards: studyCards,
        session: {
          cursor: requestedCursor,
          queueLength: null,
          done: rows.length <= limit,
          batchSize: studyCards.length,
          instant: true,
        },
        sessionMeta: {
          requestedCount,
          returnedCount: studyCards.length,
          totalAvailable: null,
          hasMore: rows.length > limit,
        },
      };
      const approx = estimateJsonUtf8Bytes(body);
      logLargeApiResponse(`/api/flashcards/decks/${deckRef}/study?instant=1`, approx);
      if (approx > 120_000) logFlashcardLargePayload({ route: "study_subscriber_instant", approxUtf8: approx });
      logDeckSessionLoad({
        stage: "success",
        deckRef,
        deckId: deck.id,
        userId,
        pathway: deck.pathwayId,
        country: String(entitlement.country ?? ""),
        tier: String(entitlement.tier ?? ""),
        requestedCount,
        candidateFlashcards: rows.length,
        publishedFlashcards: rows.length,
        eligibleFlashcards: rows.length,
        finalSessionPoolSize: studyCards.length,
        sessionId: `instant:${deck.id.slice(0, 8)}`,
      });
      return NextResponse.json(body);
    }

    const deckCards = await withRetry(() =>
      prisma.flashcard.findMany({
        where: cardWhere,
        select: { id: true, positionInDeck: true },
        orderBy: { positionInDeck: "asc" },
        take: PRISMA_FLASHCARD_DECK_INDEX_MAX,
      }),
    );

    if (deckCards.length === 0) {
      logDeckSessionLoad({
        stage: "empty",
        deckRef,
        deckId: deck.id,
        userId,
        pathway: deck.pathwayId,
        country: String(entitlement.country ?? ""),
        tier: String(entitlement.tier ?? ""),
        requestedCount,
        candidateFlashcards: 0,
        publishedFlashcards: 0,
        eligibleFlashcards: 0,
        finalSessionPoolSize: 0,
        sessionId: `deck:${deck.id.slice(0, 8)}`,
        failureReason: "deck_study_empty_pool",
      });
      return deckStudyFailureResponse("deck_study_empty_pool", "No flashcards were found for this deck.", 404, {
        rawCount: 0,
        filteredCount: 0,
        finalCount: 0,
        reasonFailed: "empty_deck_study_pool",
      });
    }

    const deckIdList = deckCards.map((c) => c.id);
    const [progressRows, sessionRow0] = await Promise.all([
      withRetry(() =>
        prisma.flashcardProgress.findMany({
          where: { userId, flashcardId: { in: deckIdList } },
          select: {
            flashcardId: true,
            nextReviewAt: true,
            repetitions: true,
          },
          take: takeForIdIn(deckIdList, PRISMA_FLASHCARD_DECK_INDEX_MAX),
        }),
      ),
      withRetry(() =>
        prisma.flashcardStudySession.findUnique({
          where: { userId_deckId: { userId, deckId: deck.id } },
        }),
      ),
    ]);

    const progressMap = new Map(
      progressRows.map((p) => [
        p.flashcardId,
        { nextReviewAt: p.nextReviewAt, repetitions: p.repetitions },
      ]),
    );

    const now = new Date();
    let queueIds = buildStudyQueueIds(deckCards, progressMap, now);

    let sessionRow = sessionRow0;

    if (!sessionRow || reset) {
      if (shuffle) {
        queueIds = shuffleFlashcardQueueWithinDueBands(queueIds, progressMap, now, randomUUID());
      }
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
        select: {
          id: true,
          front: true,
          back: true,
          lessonId: true,
          sourceKey: true,
          examItemKind: true,
          questionStem: true,
          answerOptions: true,
          correctAnswer: true,
          rationaleCorrect: true,
          rationaleIncorrect: true,
          options: {
            orderBy: { displayOrder: "asc" },
            select: {
              id: true,
              optionKey: true,
              content: true,
              isCorrect: true,
              rationale: true,
              displayOrder: true,
              selectCount: true,
              correctSelectCount: true,
            },
          },
          category: { select: { name: true, topicCode: true } },
          deck: { select: { pathwayId: true } },
        },
        take: takeForIdIn(sliceIds, MAX_BATCH),
      }),
    );
    const byId = new Map(cardPayload.map((c) => [c.id, c]));
    const ordered = sliceIds.map((id) => byId.get(id)).filter(Boolean) as FlashcardStudySelectRow[];

    const existingExamQuestionIds = new Set(
      ordered
        .map((card) => card.sourceKey?.startsWith("exam_q:") ? card.sourceKey.slice("exam_q:".length) : null)
        .filter((id): id is string => Boolean(id)),
    );
    const serializedDeckCards = ordered
      .map((c) =>
        serializeFlashcardForDeckStudy(c, {
          educationalLocale,
          flashcardBundle,
          fullBackAvailable: true,
          examOptionShuffleSalt,
        }),
      );
    const bankCards = serializedDeckCards.length < limit
      ? await loadBankBackedStudyCards({
          userId,
          entitlement,
          pathwayId: deck.pathwayId,
          take: limit - serializedDeckCards.length,
          educationalLocale,
          flashcardBundle,
          examOptionShuffleSalt,
          existingExamQuestionIds,
        })
      : [];
    const studyCards = [...serializedDeckCards, ...bankCards].slice(0, limit);

    const body = {
      mode: "subscriber" as const,
      deckId: deck.id,
      slug: deck.slug,
      title: deck.title,
      cards: studyCards,
      session: {
        cursor,
        queueLength: storedQueue.length,
        done: cursor >= storedQueue.length,
        batchSize: studyCards.length,
      },
      sessionMeta: {
        requestedCount,
        returnedCount: studyCards.length,
        totalAvailable: storedQueue.length,
        hasMore: cursor + ordered.length < storedQueue.length,
      },
    };

    const approx = estimateJsonUtf8Bytes(body);
    logLargeApiResponse(`/api/flashcards/decks/${deckRef}/study`, approx);
    if (approx > 400_000) logFlashcardLargePayload({ route: "study_subscriber", approxUtf8: approx });
    logDeckSessionLoad({
      stage: studyCards.length > 0 ? "success" : "empty",
      deckRef,
      deckId: deck.id,
      userId,
      pathway: deck.pathwayId,
      country: String(entitlement.country ?? ""),
      tier: String(entitlement.tier ?? ""),
      requestedCount,
      candidateFlashcards: deckCards.length,
      publishedFlashcards: deckCards.length,
      eligibleFlashcards: deckCards.length,
      finalSessionPoolSize: studyCards.length,
      sessionId: sessionRow.id,
      failureReason: studyCards.length > 0 ? "" : "deck_study_empty_pool",
    });

    return NextResponse.json(body);
  } catch (e) {
    safeServerLogCritical("api_flashcards_study", "query_failed", { deckRef }, e);
    logDeckSessionLoad({
      stage: "failed",
      deckRef,
      deckId: deck.id,
      userId,
      pathway: deck.pathwayId,
      country: String(entitlement.country ?? ""),
      tier: String(entitlement.tier ?? ""),
      requestedCount,
      finalSessionPoolSize: 0,
      failureReason: "deck_study_query_failed",
    });

    // ── Tertiary static-catalog fallback ────────────────────────────────────
    // When the DB session build fails after all retries, serve cards from the
    // static TypeScript content bundles so paying users can continue studying.
    // These cards carry no SRS state; mode is "preview" so the client omits
    // progress controls. The header signals the fallback to monitoring.
    if (hasFallbackContentForPathway(deck.pathwayId)) {
      try {
        const fallback = buildFlashcardSessionFallback({
          deckRef,
          pathwayId: deck.pathwayId,
          limit: requestedCount,
          topicFilter: deck.title ?? null,
        });
        if (fallback.cards.length > 0) {
          const fallbackBody = {
            mode: "preview" as const,
            title: deck.title,
            cards: fallback.cards,
            sessionMeta: {
              requestedCount,
              returnedCount: fallback.cards.length,
              totalAvailable: fallback.totalAvailable,
              hasMore: false,
            },
            _fallback: true,
            _fallbackSource: "static_catalog",
          };
          safeServerLog("api_flashcards_study", "static_fallback_served", {
            deckRef,
            cardCount: fallback.cards.length,
          });
          return NextResponse.json(fallbackBody, {
            headers: { "X-NurseNest-Content-Fallback": "1" },
          });
        }
      } catch (fallbackErr) {
        safeServerLog("api_flashcards_study", "static_fallback_failed", {
          deckRef,
          error: fallbackErr instanceof Error ? fallbackErr.message.slice(0, 200) : "unknown",
        });
      }
    }

    return deckStudyFailureResponse("deck_study_query_failed", "Unable to create study session from this deck.", 503, {
      reasonFailed: e instanceof Error ? e.message.slice(0, 500) : "deck_study_query_failed",
    });
  }
  });
}
