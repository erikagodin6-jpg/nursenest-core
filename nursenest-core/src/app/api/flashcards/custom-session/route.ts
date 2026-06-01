import { NextRequest, NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";
import { classifyDatabaseFallbackKind } from "@/lib/db/safe-database";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import {
  buildFlashcardCustomSession,
  parseCustomSessionCardLimit,
  parseCustomSessionCategories,
  parseCustomSessionOffset,
  parseCustomSessionStudyMode,
} from "@/lib/flashcards/build-flashcard-custom-session";
import { parseCustomSessionSourceKind } from "@/lib/flashcards/custom-session-card-filters";
import { normalizeLearnerFlashcardsPathwayQueryId } from "@/lib/flashcards/flashcards-pathway-query";
import { logCoreApiStudyDiagnostic } from "@/lib/observability/core-api-diagnostics";
import { TimeoutError, withTimeout } from "@/lib/server/with-timeout";
import {
  buildSelfHealingCacheKey,
  getSelfHealingSessionCache,
  setSelfHealingSessionCache,
} from "@/lib/study-content-failover/self-healing-flashcard-session-cache";
import { buildFlashcardCatalogFallbackSession } from "@/lib/study-content-failover/build-flashcard-catalog-fallback-session";

export const dynamic = "force-dynamic";

type CustomSessionCountOnlyCacheEntry = { cachedAtMs: number; body: unknown };
const customSessionCountOnlyCache = new Map<string, CustomSessionCountOnlyCacheEntry>();
const CUSTOM_SESSION_COUNT_ONLY_CACHE_TTL_MS = 60_000; // 60 s — count-only results are stable across filter toggles
const CUSTOM_SESSION_COUNT_ONLY_CACHE_MAX = 2000;

type FlashcardSessionCreateLogContext = {
  userIdPrefix: string;
  pathway: string;
  pathwayRaw: string;
  country: string;
  tier: string;
  systems: string;
  selectedTopics: string;
  selectedFilters: string;
  selectedDeckIds: string;
  sessionId: string;
  includeCards: string;
  mode: string;
  cardLimit: string;
  offset: string;
};

function flashcardSessionCreateLogBase(ctx: FlashcardSessionCreateLogContext) {
  return {
    userId: ctx.userIdPrefix,
    pathway: ctx.pathway,
    pathwayRaw: ctx.pathwayRaw,
    country: ctx.country,
    tier: ctx.tier,
    systems: ctx.systems,
    selectedTopics: ctx.selectedTopics,
    selectedFilters: ctx.selectedFilters,
    selectedDeckIds: ctx.selectedDeckIds,
    sessionId: ctx.sessionId,
    includeCards: ctx.includeCards,
    mode: ctx.mode,
    cardLimit: ctx.cardLimit,
    offset: ctx.offset,
  };
}

function customSessionCountOnlyCacheKey(userId: string, url: string): string {
  // Key by exact query string to avoid drift across filter combinations.
  // Strip origin to keep key short.
  try {
    const u = new URL(url);
    return `${userId}::${u.pathname}?${u.searchParams.toString()}`;
  } catch {
    return `${userId}::${url}`;
  }
}

export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/flashcards/custom-session", "content", async () => {
    let launchLogContext: FlashcardSessionCreateLogContext | null = null;
    try {
      const headers = mergeSubscriberPrivateCacheHeaders();

      const gate = await requireSubscriberSession();
      if (!gate.ok) {
        safeServerLog("flashcards", "FLASHCARD_SESSION_CREATE", {
          stage: "failed",
          userId: "",
          pathway: req.nextUrl.searchParams.get("pathwayId")?.trim() ?? "",
          pathwayRaw: req.nextUrl.searchParams.get("pathwayId")?.trim() ?? "",
          country: "",
          tier: "",
          systems: req.nextUrl.searchParams.get("categories")?.trim() ?? "",
          selectedTopics:
            req.nextUrl.searchParams.get("topicCode")?.trim() ||
            req.nextUrl.searchParams.get("topic")?.trim() ||
            "",
          selectedFilters: "entitlement_required",
          selectedDeckIds: req.nextUrl.searchParams.get("lessonId")?.trim() ? "lesson" : "",
          candidateFlashcards: null,
          publishedFlashcards: null,
          eligibleFlashcards: null,
          finalSessionPoolSize: 0,
          sessionId: req.nextUrl.searchParams.get("sessionSeed")?.trim().slice(0, 12) ?? "",
          failureReason: "entitlement_denied_or_session_missing",
          includeCards: req.nextUrl.searchParams.get("includeCards") === "1" ? "1" : "0",
          mode: req.nextUrl.searchParams.get("mode")?.trim() ?? "mixed",
          cardLimit: req.nextUrl.searchParams.get("cardLimit")?.trim() ?? "20",
          offset: req.nextUrl.searchParams.get("offset")?.trim() ?? "0",
        });
        return gate.response;
      }

      const userId = gate.userId;
      const entitlement = gate.entitlement;

      // Cache count-only requests briefly to prevent query amplification when learners toggle filters
      // or the client retries under transient network/DB pressure.
      const includeCardsParam = req.nextUrl.searchParams.get("includeCards");
      const includeCards = includeCardsParam === "1";
      if (!includeCards) {
        const cacheKey = customSessionCountOnlyCacheKey(userId, req.url);
        const cached = customSessionCountOnlyCache.get(cacheKey);
        if (cached && Date.now() - cached.cachedAtMs < CUSTOM_SESSION_COUNT_ONLY_CACHE_TTL_MS) {
          const h = new Headers(headers);
          h.set("x-nn-custom-session-cache", "hit");
          return NextResponse.json(cached.body, { status: 200, headers: h });
        }
      }

      const sp = req.nextUrl.searchParams;
      const pathwayIdRaw = sp.get("pathwayId")?.trim() || null;
      const pathwayId = pathwayIdRaw
        ? normalizeLearnerFlashcardsPathwayQueryId(pathwayIdRaw, entitlement.country)
        : null;
      const lessonIdEarly = sp.get("lessonId")?.trim() || null;
      if (!pathwayId && !lessonIdEarly) {
        return NextResponse.json(
          { ok: false, error: "pathwayId is required (or pass lessonId for a lesson-scoped deck)." },
          { status: 400 },
        );
      }
      const topicFromAlias = sp.get("topic")?.trim().toLowerCase() || null;
      const topicCode = sp.get("topicCode")?.trim().toLowerCase() || topicFromAlias || null;
      const lessonId = lessonIdEarly;
      const selectedCategories = parseCustomSessionCategories(sp.get("categories"));
      const stateIds = parseCustomSessionCategories(sp.get("stateIds"));
      const weakOnly = sp.get("weakOnly") === "1";
      const incorrectOnly = sp.get("incorrectOnly") === "1";
      const starredOnly = sp.get("starredOnly") === "1";
      const savedOnly = sp.get("savedOnly") === "1";
      const notesOnly = sp.get("notesOnly") === "1";
      const revisitOnly = sp.get("revisitOnly") === "1";
      const notStudiedOnly = sp.get("notStudiedOnly") === "1";
      const recentStudiedOnly = sp.get("recentStudiedOnly") === "1";
      const recentDaysRaw = Number(sp.get("recentDays") ?? "7");
      const recentDays =
        Number.isFinite(recentDaysRaw) && recentDaysRaw > 0 ? Math.min(90, Math.floor(recentDaysRaw)) : 7;
      const shuffle = sp.get("shuffle") === "1";
      const mode = parseCustomSessionStudyMode(sp.get("mode"));
      const limit = parseCustomSessionCardLimit(sp.get("cardLimit"));
      const offset = parseCustomSessionOffset(sp.get("offset"));
      // NOTE: includeCards is read above for cache gating.
      const sourceKind = parseCustomSessionSourceKind(sp.get("sourceKind"));
      const sessionSeed = sp.get("sessionSeed")?.trim() || null;
      const selectedFiltersForLog = [
        weakOnly ? "weak" : "",
        incorrectOnly ? "incorrect" : "",
        starredOnly ? "starred" : "",
        savedOnly ? "saved" : "",
        notesOnly ? "notes" : "",
        revisitOnly ? "revisit" : "",
        notStudiedOnly ? "not_studied" : "",
        recentStudiedOnly ? "recent" : "",
      ].filter(Boolean).join(",");
      launchLogContext = {
        userIdPrefix: userId.slice(0, 8),
        pathway: pathwayId ?? "",
        pathwayRaw: pathwayIdRaw ?? "",
        country: String(entitlement.country ?? ""),
        tier: String(entitlement.tier ?? ""),
        systems: selectedCategories.slice(0, 24).join(","),
        selectedTopics: topicCode ?? "",
        selectedFilters: selectedFiltersForLog,
        selectedDeckIds: lessonId ? `lesson:${lessonId.slice(0, 12)}` : "",
        sessionId: sessionSeed ? sessionSeed.slice(0, 12) : "",
        includeCards: includeCards ? "1" : "0",
        mode,
        cardLimit: String(limit),
        offset: String(offset),
      };

      const selfHealingKey = buildSelfHealingCacheKey({
        pathwayId,
        lessonId: lessonId ?? null,
        tier: String(entitlement.tier ?? ""),
        country: String(entitlement.country ?? ""),
        selectedCategories,
        sourceKind,
        mode,
        limit,
        weakOnly,
        incorrectOnly,
        starredOnly,
        savedOnly,
        notesOnly,
        revisitOnly,
        notStudiedOnly,
        recentStudiedOnly,
      });

      const topicIdsForLog =
        selectedCategories.length > 0
          ? selectedCategories.slice(0, 24).join(",")
          : topicCode
            ? `topicCode:${topicCode}`
            : lessonId
              ? `lessonId:${lessonId.slice(0, 12)}`
              : "all";
      safeServerLog("flashcards", "custom_session_query", {
        loader_name: "flashcards_custom_session_api",
        user_id_prefix: userId.slice(0, 8),
        pathwayId: pathwayId ?? "",
        pathwayIdRaw: pathwayIdRaw ?? "",
        tier: String(entitlement.tier ?? ""),
        country: String(entitlement.country ?? ""),
        topicIds: topicIdsForLog.slice(0, 200),
        relaxation: "none",
        includeCards: includeCards ? "1" : "0",
        sourceKind,
        weakOnly: weakOnly ? "1" : "0",
        incorrectOnly: incorrectOnly ? "1" : "0",
        selectedCategoryCount: selectedCategories.length,
      });
      safeServerLog("flashcards", "FLASHCARD_SESSION_CREATE", {
        stage: "attempt",
        ...flashcardSessionCreateLogBase(launchLogContext),
        candidateFlashcards: null,
        publishedFlashcards: null,
        eligibleFlashcards: null,
        finalSessionPoolSize: null,
        failureReason: "",
      });

      // Timeout budgets must be lower than the browser attempt timeout so the client receives
      // structured JSON instead of aborting locally with the hydration-race timeout copy.
      // Target warm path: <1s. Hard fallback: return retryable JSON before client timeout.
      const sessionBuildTimeoutMs = includeCards ? 4_800 : 1_200;
      const sessionBuildStart = Date.now();
      const built = await withTimeout(
        buildFlashcardCustomSession({
          userId,
          entitlement,
          pathwayId,
          topicCode,
          lessonId,
          selectedCategories,
          stateIds,
          weakOnly,
          incorrectOnly,
          starredOnly,
          savedOnly,
          notesOnly,
          revisitOnly,
          notStudiedOnly,
          recentStudiedOnly,
          recentDays,
          shuffle,
          mode,
          limit,
          includeCards,
          sourceKind,
          offset,
          sessionSeed,
          cardLimitRaw: sp.get("cardLimit"),
        }),
        sessionBuildTimeoutMs,
        { label: "flashcards_custom_session_startup" },
      );
      const sessionBuildDurationMs = Date.now() - sessionBuildStart;

      if (!built.ok) {
        const kind = classifyDatabaseFallbackKind(new Error(built.reason));
        safeServerLog("flashcards", "custom_session_db_failed", {
          loader_name: "flashcards_custom_session_api",
          user_id_prefix: userId.slice(0, 8),
          kind,
          message: built.reason.slice(0, 400),
          pathwayId: pathwayId ?? "",
          pathwayIdRaw: pathwayIdRaw ?? "",
          tier: String(entitlement.tier ?? ""),
          country: String(entitlement.country ?? ""),
        });
        safeServerLog("flashcards", "FLASHCARD_SESSION_CREATE", {
          stage: "failed",
          ...flashcardSessionCreateLogBase(launchLogContext),
          candidateFlashcards: null,
          publishedFlashcards: null,
          eligibleFlashcards: null,
          finalSessionPoolSize: 0,
          failureReason: `${built.code}:${kind}`.slice(0, 120),
          buildDurationMs: sessionBuildDurationMs,
          timeoutBudgetMs: sessionBuildTimeoutMs,
        });

        // ── Secondary: in-memory session cache ───────────────────────────────
        const cachedSession = getSelfHealingSessionCache(selfHealingKey);
        if (cachedSession) {
          const h = new Headers(headers);
          h.set("x-nn-session-source", "secondary_cache");
          h.set("x-nn-session-build-ms", String(sessionBuildDurationMs));
          const healedBody = {
            ok: true,
            unsupportedFilters: [],
            summary: cachedSession.summary,
            categoryOptions: cachedSession.categoryOptions,
            cards: cachedSession.cards,
          };
          h.set("x-nn-session-response-bytes", String(Buffer.byteLength(JSON.stringify(healedBody), "utf8")));
          return NextResponse.json(healedBody, { status: 200, headers: h });
        }

        // ── Tertiary: catalog-derived virtual cards ───────────────────────────
        if (pathwayId) {
          const catalogSession = buildFlashcardCatalogFallbackSession({
            pathwayId,
            limit,
            mode,
            includeCards,
            tier: String(entitlement.tier ?? ""),
            country: String(entitlement.country ?? ""),
          });
          if (catalogSession) {
            const h = new Headers(headers);
            h.set("x-nn-session-source", "tertiary_catalog");
            h.set("x-nn-session-build-ms", String(sessionBuildDurationMs));
            const healedBody = {
              ok: true,
              unsupportedFilters: [],
              summary: catalogSession.summary,
              categoryOptions: catalogSession.categoryOptions,
              cards: catalogSession.cards,
            };
            h.set("x-nn-session-response-bytes", String(Buffer.byteLength(JSON.stringify(healedBody), "utf8")));
            return NextResponse.json(healedBody, { status: 200, headers: h });
          }
        }

        // All tiers exhausted — only now surface an error
        const h = new Headers(headers);
        h.set("Retry-After", "3");
        h.set("x-nn-session-build-ms", String(sessionBuildDurationMs));
        const errorBody = {
            ok: false,
            code: built.code,
            error: built.message,
            retryable: true,
            integrity: {
              querySucceeded: false,
              source: "error",
              rawCount: null,
              filteredCount: null,
              finalCount: 0,
              reasonFailed: `${kind}:${built.reason}`.slice(0, 500),
            },
          };
        const responseBytes = Buffer.byteLength(JSON.stringify(errorBody), "utf8");
        h.set("x-nn-session-response-bytes", String(responseBytes));
        return NextResponse.json(errorBody, { status: 503, headers: h });
      }

      if (includeCards && built.summary.matchingCards === 0) {
        const h = new Headers(headers);
        h.set("Retry-After", "0");
        safeServerLog("flashcards", "FLASHCARD_SESSION_CREATE", {
          stage: "empty",
          ...flashcardSessionCreateLogBase(launchLogContext),
          candidateFlashcards: built.summary.poolInventoryDiagnostics?.examQuestionSqlPoolCount ?? 0,
          publishedFlashcards: built.summary.poolInventoryDiagnostics?.dedicatedFlashcardRowCount ?? null,
          eligibleFlashcards: 0,
          finalSessionPoolSize: 0,
          failureReason: "empty_pool_after_filters",
        });
        h.set("x-nn-session-build-ms", String(sessionBuildDurationMs));
        const emptyBody = {
            ok: false,
            code: "empty_flashcard_pool",
            error: "No flashcards found for selected systems.",
            retryable: false,
            integrity: {
              querySucceeded: true,
              source: "flashcard_custom_session",
              rawCount: built.summary.poolInventoryDiagnostics?.examQuestionSqlPoolCount ?? null,
              filteredCount: 0,
              finalCount: 0,
              reasonFailed: "empty_pool_after_filters",
            },
          };
        h.set("x-nn-session-response-bytes", String(Buffer.byteLength(JSON.stringify(emptyBody), "utf8")));
        return NextResponse.json(emptyBody, { status: 404, headers: h });
      }

      if (includeCards && built.summary.matchingCards > 0 && built.summary.returnedCards === 0) {
        const h = new Headers(headers);
        h.set("Retry-After", "0");
        safeServerLog("flashcards", "FLASHCARD_SESSION_CREATE", {
          stage: "failed",
          ...flashcardSessionCreateLogBase(launchLogContext),
          candidateFlashcards: built.summary.poolInventoryDiagnostics?.examQuestionSqlPoolCount ?? built.summary.matchingCards,
          publishedFlashcards: built.summary.poolInventoryDiagnostics?.dedicatedFlashcardRowCount ?? null,
          eligibleFlashcards: built.summary.matchingCards,
          finalSessionPoolSize: 0,
          failureReason: "serialized_session_window_empty",
        });
        h.set("x-nn-session-build-ms", String(sessionBuildDurationMs));
        const invalidBody = {
            ok: false,
            code: "session_data_invalid",
            error: "Session data is invalid.",
            retryable: false,
            integrity: {
              querySucceeded: true,
              source: "flashcard_custom_session",
              rawCount: built.summary.poolInventoryDiagnostics?.examQuestionSqlPoolCount ?? built.summary.matchingCards,
              filteredCount: built.summary.matchingCards,
              finalCount: 0,
              reasonFailed: "serialized_session_window_empty",
            },
          };
        h.set("x-nn-session-response-bytes", String(Buffer.byteLength(JSON.stringify(invalidBody), "utf8")));
        return NextResponse.json(invalidBody, { status: 422, headers: h });
      }

      safeServerLog("flashcards", "custom_session_query", {
        loader_name: "flashcards_custom_session_api",
        user_id_prefix: userId.slice(0, 8),
        pathwayId: pathwayId ?? "",
        pathwayIdRaw: pathwayIdRaw ?? "",
        tier: String(entitlement.tier ?? ""),
        country: String(entitlement.country ?? ""),
        topicIds: topicIdsForLog.slice(0, 200),
        rawCount: String(built.summary.matchingCards),
        returnedCount: String(built.summary.returnedCards),
        relaxation: built.queryRelaxation,
        includeCards: includeCards ? "1" : "0",
      });
      safeServerLog("flashcards", "FLASHCARD_SESSION_CREATE", {
        stage: built.summary.returnedCards > 0 || !includeCards ? "success" : "empty",
        userId: userId.slice(0, 8),
        pathway: built.summary.pathwayId ?? pathwayId ?? "",
        pathwayRaw: pathwayIdRaw ?? "",
        country: String(entitlement.country ?? ""),
        tier: String(entitlement.tier ?? ""),
        systems: built.summary.selectedCategories.slice(0, 24).join(","),
        selectedTopics: built.summary.topicCode ?? "",
        selectedFilters: [
          built.summary.weakOnly ? "weak" : "",
          built.summary.incorrectOnly ? "incorrect" : "",
          built.summary.starredOnly ? "starred" : "",
          built.summary.savedOnly ? "saved" : "",
          built.summary.notesOnly ? "notes" : "",
          built.summary.revisitOnly ? "revisit" : "",
          built.summary.notStudiedOnly ? "not_studied" : "",
          built.summary.recentStudiedOnly ? "recent" : "",
        ].filter(Boolean).join(","),
        selectedDeckIds: built.summary.lessonId ? `lesson:${built.summary.lessonId.slice(0, 12)}` : "",
        candidateFlashcards: built.summary.poolInventoryDiagnostics?.examQuestionSqlPoolCount ?? built.summary.matchingCards,
        publishedFlashcards: built.summary.poolInventoryDiagnostics?.dedicatedFlashcardRowCount ?? null,
        eligibleFlashcards: built.summary.matchingCards,
        finalSessionPoolSize: built.summary.returnedCards,
        sessionId: built.summary.sessionShuffleSalt?.slice(0, 12) ?? "",
        failureReason:
          built.summary.matchingCards === 0
            ? "empty_pool_after_filters"
            : includeCards && built.summary.returnedCards === 0
              ? "no_serialized_cards_in_first_window"
              : "",
        includeCards: includeCards ? "1" : "0",
        mode: built.summary.mode,
        cardLimit: built.summary.cardLimit,
        offset: String(built.summary.offset ?? 0),
        buildDurationMs: sessionBuildDurationMs,
        timeoutBudgetMs: sessionBuildTimeoutMs,
        responseBytes: null,
      });
      logCoreApiStudyDiagnostic({
        endpoint: "GET /api/flashcards/custom-session",
        pathwayId: pathwayId ?? null,
        tier: String(entitlement.tier ?? ""),
        includeCards,
        sourceKind,
        rowsReturned: built.summary.returnedCards,
        matchingTotal: built.summary.matchingCards,
        reasonIfZero:
          built.summary.matchingCards === 0
            ? "no_cards_after_filters_or_empty_bank"
            : undefined,
      });

      // Populate secondary cache with successful full-card sessions for silent fallback.
      if (includeCards && built.summary.returnedCards > 0) {
        setSelfHealingSessionCache(selfHealingKey, built);
      }

      const body = {
        ok: true,
        unsupportedFilters: [],
        summary: built.summary,
        categoryOptions: built.categoryOptions,
        cards: built.cards,
      };
      const responseBytes = Buffer.byteLength(JSON.stringify(body), "utf8");

      // Expose build duration as a diagnostic header for client-side telemetry.
      headers.set("x-nn-session-build-ms", String(sessionBuildDurationMs));
      headers.set("x-nn-session-response-bytes", String(responseBytes));
      safeServerLog("flashcards", "FLASHCARD_SESSION_RESPONSE", {
        userId: userId.slice(0, 8),
        pathway: built.summary.pathwayId ?? pathwayId ?? "",
        includeCards: includeCards ? "1" : "0",
        buildDurationMs: sessionBuildDurationMs,
        timeoutBudgetMs: sessionBuildTimeoutMs,
        responseBytes,
        returnedCards: built.summary.returnedCards,
        matchingCards: built.summary.matchingCards,
      });

      // Cache only count-only responses (includeCards=0); full card payloads can be large and user-state sensitive.
      if (!includeCards) {
        const cacheKey = customSessionCountOnlyCacheKey(userId, req.url);
        if (customSessionCountOnlyCache.size > CUSTOM_SESSION_COUNT_ONLY_CACHE_MAX) customSessionCountOnlyCache.clear();
        customSessionCountOnlyCache.set(cacheKey, { cachedAtMs: Date.now(), body });
        const h = new Headers(headers);
        h.set("x-nn-custom-session-cache", "miss");
        return NextResponse.json(body, { status: 200, headers: h });
      }

      return NextResponse.json(body, { headers });
    } catch (error) {
      safeServerLogCritical("flashcards", "custom_session_route_error", {}, error);
      const isTimeout = error instanceof TimeoutError || (error instanceof Error && /timeout/i.test(error.message));
      if (launchLogContext) {
        safeServerLog("flashcards", "FLASHCARD_SESSION_CREATE", {
          stage: "failed",
          ...flashcardSessionCreateLogBase(launchLogContext),
          candidateFlashcards: null,
          publishedFlashcards: null,
          eligibleFlashcards: null,
          finalSessionPoolSize: 0,
          failureReason: isTimeout ? "session_timeout" : "route_exception",
        });
      }

      // ── Secondary: in-memory session cache (on route-level exception / timeout) ──
      if (launchLogContext) {
        const sp = req.nextUrl.searchParams;
        const catchPathwayId = sp.get("pathwayId")?.trim() || null;
        const catchLessonId = sp.get("lessonId")?.trim() || null;
        const catchCategories = parseCustomSessionCategories(sp.get("categories"));
        const catchMode = parseCustomSessionStudyMode(sp.get("mode"));
        const catchLimit = parseCustomSessionCardLimit(sp.get("cardLimit"));
        const catchSourceKind = parseCustomSessionSourceKind(sp.get("sourceKind"));
        const catchKey = buildSelfHealingCacheKey({
          pathwayId: catchPathwayId,
          lessonId: catchLessonId,
          tier: launchLogContext.tier,
          country: launchLogContext.country,
          selectedCategories: catchCategories,
          sourceKind: catchSourceKind,
          mode: catchMode,
          limit: catchLimit,
          weakOnly: sp.get("weakOnly") === "1",
          incorrectOnly: sp.get("incorrectOnly") === "1",
          starredOnly: sp.get("starredOnly") === "1",
          savedOnly: sp.get("savedOnly") === "1",
          notesOnly: sp.get("notesOnly") === "1",
          revisitOnly: sp.get("revisitOnly") === "1",
          notStudiedOnly: sp.get("notStudiedOnly") === "1",
          recentStudiedOnly: sp.get("recentStudiedOnly") === "1",
        });
        const cachedSession = getSelfHealingSessionCache(catchKey);
        if (cachedSession) {
          const h = mergeSubscriberPrivateCacheHeaders();
          h.set("x-nn-session-source", "secondary_cache");
          h.set("x-nn-session-timeout-ms", isTimeout ? "4800" : "0");
          const healedBody = {
            ok: true,
            unsupportedFilters: [],
            summary: cachedSession.summary,
            categoryOptions: cachedSession.categoryOptions,
            cards: cachedSession.cards,
          };
          h.set("x-nn-session-response-bytes", String(Buffer.byteLength(JSON.stringify(healedBody), "utf8")));
          return NextResponse.json(healedBody, { status: 200, headers: h });
        }

        // ── Tertiary: catalog fallback on exception ──────────────────────────
        if (catchPathwayId) {
          const normalizedPathwayId = catchPathwayId;
          const includeCardsParam = sp.get("includeCards");
          const catchIncludeCards = includeCardsParam === "1";
          const catalogSession = buildFlashcardCatalogFallbackSession({
            pathwayId: normalizedPathwayId,
            limit: catchLimit,
            mode: catchMode,
            includeCards: catchIncludeCards,
            tier: launchLogContext.tier,
            country: launchLogContext.country,
          });
          if (catalogSession) {
            const h = mergeSubscriberPrivateCacheHeaders();
            h.set("x-nn-session-source", "tertiary_catalog");
            h.set("x-nn-session-timeout-ms", isTimeout ? "4800" : "0");
            const healedBody = {
              ok: true,
              unsupportedFilters: [],
              summary: catalogSession.summary,
              categoryOptions: catalogSession.categoryOptions,
              cards: catalogSession.cards,
            };
            h.set("x-nn-session-response-bytes", String(Buffer.byteLength(JSON.stringify(healedBody), "utf8")));
            return NextResponse.json(healedBody, { status: 200, headers: h });
          }
        }
      }

      const h = mergeSubscriberPrivateCacheHeaders();
      h.set("Retry-After", "3");
      h.set("x-nn-session-timeout-ms", isTimeout ? "4800" : "0");
      const errorBody = {
          ok: false,
          code: isTimeout ? "session_timeout" : "service_unavailable",
          error: isTimeout
            ? "Flashcard session creation timed out. Please retry."
            : "Flashcard session is temporarily unavailable. Please retry.",
          retryable: true,
          integrity: {
            querySucceeded: false,
            source: "route_error",
            rawCount: null,
            filteredCount: null,
            finalCount: 0,
            reasonFailed: error instanceof Error ? error.message.slice(0, 500) : "unknown",
          },
        };
      h.set("x-nn-session-response-bytes", String(Buffer.byteLength(JSON.stringify(errorBody), "utf8")));
      return NextResponse.json(errorBody, { status: 503, headers: h });
    }
  });
}
