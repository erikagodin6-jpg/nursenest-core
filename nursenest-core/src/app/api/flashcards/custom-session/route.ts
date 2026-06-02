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
  recordRecoveryEvent,
  recordFlashcardReliabilityCounter,
} from "@/lib/study-content-failover/self-healing-flashcard-session-cache";
import { buildFlashcardCatalogFallbackSession } from "@/lib/study-content-failover/build-flashcard-catalog-fallback-session";

export const dynamic = "force-dynamic";

type CustomSessionCountOnlyCacheEntry = { cachedAtMs: number; body: unknown };
const customSessionCountOnlyCache = new Map<string, CustomSessionCountOnlyCacheEntry>();
const CUSTOM_SESSION_COUNT_ONLY_CACHE_TTL_MS = 60_000;
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
  try {
    const u = new URL(url);
    return `${userId}::${u.pathname}?${u.searchParams.toString()}`;
  } catch {
    return `${userId}::${url}`;
  }
}

/** Log a session recovery event with the serving tier and reason. */
function logRecoveryEvent(args: {
  tier: "A" | "B" | "C" | "D_error";
  reason: string;
  pathwayId: string;
  userId: string;
  returnedCards: number;
  isPrecheck?: boolean;
}): void {
  safeServerLog("flashcards", "flashcard_session_recovery", {
    recovery_tier: args.tier,
    reason: args.reason,
    pathway_id: args.pathwayId,
    user_id_prefix: args.userId.slice(0, 8),
    returned_cards: args.returnedCards,
    is_precheck: args.isPrecheck ? "1" : "0",
  });
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

      // Whether the session depends on user-specific progress (weakOnly, incorrectOnly, etc.).
      // Progress-filtered sessions: include userId in cache key so user A's weak-card set is
      // never served as a pre-check to user B.
      // Non-progress sessions: shared cache key — content is the same across users for the same
      // pathway+filters combination.
      const hasProgressFilter =
        weakOnly || incorrectOnly || notStudiedOnly || recentStudiedOnly;
      const hasPersistenceFilter =
        starredOnly || savedOnly || notesOnly || revisitOnly;
      const isUserSpecific = hasProgressFilter || hasPersistenceFilter;

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
        // Scope key to user when session is progress/persistence-filtered so a returning user
        // gets their own cached session, not another user's.  Non-filtered sessions share the
        // same cache slot across users (content-identical, safe to share).
        userPrefix: isUserSpecific ? userId.slice(0, 8) : undefined,
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

      // ── Tier A — session persistence pre-check ────────────────────────────
      // For full-card requests that are not progress-filtered and not paginated,
      // check whether a valid persisted session (15-min TTL) exists before firing
      // the live DB path.  Advantages:
      //   • Eliminates all DB latency for returning users on warm instances.
      //   • Makes session launch resilient to partial DB degradation.
      //   • Consistent experience: users see the same well-formed session they had
      //     before rather than a different shuffle on every retry.
      //
      // Progress-filtered (weakOnly etc.) sessions skip pre-check intentionally:
      // the user explicitly wants fresh progress-weighted cards, not cached ones.
      // Paginated requests (offset > 0) also skip pre-check because the cached
      // session only contains the first page of cards.
      if (includeCards && !hasProgressFilter && !hasPersistenceFilter && offset === 0) {
        const precheckSession = await getSelfHealingSessionCache(selfHealingKey);
        if (precheckSession && precheckSession.summary.returnedCards > 0) {
          recordRecoveryEvent("tier_a_precheck_hit");
          void recordFlashcardReliabilityCounter("tier_a");
          logRecoveryEvent({
            tier: "A",
            reason: "session_persistence_precheck",
            pathwayId: pathwayId ?? "",
            userId,
            returnedCards: precheckSession.summary.returnedCards,
            isPrecheck: true,
          });
          const h = new Headers(headers);
          h.set("x-nn-session-source", "tier_a_persistence");
          h.set("x-nn-recovery-tier", "A");
          h.set("x-nn-session-build-ms", "0");
          const precheckBody = {
            ok: true,
            unsupportedFilters: [],
            summary: precheckSession.summary,
            categoryOptions: precheckSession.categoryOptions,
            cards: precheckSession.cards,
          };
          h.set("x-nn-session-response-bytes", String(Buffer.byteLength(JSON.stringify(precheckBody), "utf8")));
          return NextResponse.json(precheckBody, { status: 200, headers: h });
        }
      }

      // ── Tier B — live generation ──────────────────────────────────────────
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

        // ── Tier A fallback — 15-min persisted session ────────────────────
        const cachedSession = await getSelfHealingSessionCache(selfHealingKey);
        if (cachedSession && cachedSession.summary.returnedCards > 0) {
          recordRecoveryEvent("tier_a_fallback_hit"); void recordFlashcardReliabilityCounter("tier_a");
          logRecoveryEvent({
            tier: "A",
            reason: `db_error:${kind}`,
            pathwayId: pathwayId ?? "",
            userId,
            returnedCards: cachedSession.summary.returnedCards,
          });
          const h = new Headers(headers);
          h.set("x-nn-session-source", "tier_a_persistence");
          h.set("x-nn-recovery-tier", "A");
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

        // ── Tier C — snapshot-backed (catalog virtual cards, no DB) ──────
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
            recordRecoveryEvent("tier_c_catalog_hit"); void recordFlashcardReliabilityCounter("tier_c");
            logRecoveryEvent({
              tier: "C",
              reason: `db_error_and_cache_miss:${kind}`,
              pathwayId,
              userId,
              returnedCards: catalogSession.summary.returnedCards,
            });
            const h = new Headers(headers);
            h.set("x-nn-session-source", "tier_c_catalog");
            h.set("x-nn-recovery-tier", "C");
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

        // Tier D (emergency deck) is client-side; all server tiers exhausted.
        recordRecoveryEvent("tier_d_error"); void recordFlashcardReliabilityCounter("tier_d_error");
        logRecoveryEvent({
          tier: "D_error",
          reason: `all_tiers_exhausted:${kind}`,
          pathwayId: pathwayId ?? "",
          userId,
          returnedCards: 0,
        });
        const h = new Headers(headers);
        h.set("Retry-After", "3");
        h.set("x-nn-session-build-ms", String(sessionBuildDurationMs));
        h.set("x-nn-recovery-tier", "D_error");
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

      // Empty pool — intentional (filters returned no cards); do not fall through to recovery.
      // The user explicitly filtered for criteria that match 0 cards; an empty-state message
      // is better UX than serving unrelated cached cards.
      if (includeCards && built.summary.matchingCards === 0) {
        const h = new Headers(headers);
        h.set("Retry-After", "0");
        h.set("x-nn-recovery-tier", "B_empty");
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

      // Matching cards exist but serialisation window returned 0 cards.
      // Try the session persistence cache before surfacing an error — this handles
      // the race between publishing new content and the session build window shift.
      if (includeCards && built.summary.matchingCards > 0 && built.summary.returnedCards === 0) {
        const cachedSession = await getSelfHealingSessionCache(selfHealingKey);
        if (cachedSession && cachedSession.summary.returnedCards > 0) {
          recordRecoveryEvent("tier_a_fallback_hit"); void recordFlashcardReliabilityCounter("tier_a");
          logRecoveryEvent({
            tier: "A",
            reason: "serialized_window_empty_cache_rescue",
            pathwayId: pathwayId ?? "",
            userId,
            returnedCards: cachedSession.summary.returnedCards,
          });
          const h = new Headers(headers);
          h.set("x-nn-session-source", "tier_a_persistence");
          h.set("x-nn-recovery-tier", "A");
          h.set("x-nn-session-build-ms", String(sessionBuildDurationMs));
          const rescueBody = {
            ok: true,
            unsupportedFilters: [],
            summary: cachedSession.summary,
            categoryOptions: cachedSession.categoryOptions,
            cards: cachedSession.cards,
          };
          h.set("x-nn-session-response-bytes", String(Buffer.byteLength(JSON.stringify(rescueBody), "utf8")));
          return NextResponse.json(rescueBody, { status: 200, headers: h });
        }

        const h = new Headers(headers);
        h.set("Retry-After", "0");
        h.set("x-nn-recovery-tier", "B_invalid");
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

      // ── Tier B success ────────────────────────────────────────────────────
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

      // Populate session persistence cache with successful full-card sessions for tier A recovery.
      if (includeCards && built.summary.returnedCards > 0) {
        setSelfHealingSessionCache(selfHealingKey, built);
        recordRecoveryEvent("tier_b_primary_success");
        void recordFlashcardReliabilityCounter("tier_b");
      }

      const body = {
        ok: true,
        unsupportedFilters: [],
        summary: built.summary,
        categoryOptions: built.categoryOptions,
        cards: built.cards,
      };
      const responseBytes = Buffer.byteLength(JSON.stringify(body), "utf8");

      headers.set("x-nn-session-build-ms", String(sessionBuildDurationMs));
      headers.set("x-nn-session-response-bytes", String(responseBytes));
      headers.set("x-nn-recovery-tier", "B");
      safeServerLog("flashcards", "FLASHCARD_SESSION_RESPONSE", {
        userId: userId.slice(0, 8),
        pathway: built.summary.pathwayId ?? pathwayId ?? "",
        includeCards: includeCards ? "1" : "0",
        buildDurationMs: sessionBuildDurationMs,
        timeoutBudgetMs: sessionBuildTimeoutMs,
        responseBytes,
        returnedCards: built.summary.returnedCards,
        matchingCards: built.summary.matchingCards,
        recoveryTier: "B",
      });

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

      // ── Tier A fallback on route-level exception / timeout ────────────────
      if (launchLogContext) {
        const sp = req.nextUrl.searchParams;
        const catchPathwayId = sp.get("pathwayId")?.trim() || null;
        const catchLessonId = sp.get("lessonId")?.trim() || null;
        const catchCategories = parseCustomSessionCategories(sp.get("categories"));
        const catchMode = parseCustomSessionStudyMode(sp.get("mode"));
        const catchLimit = parseCustomSessionCardLimit(sp.get("cardLimit"));
        const catchSourceKind = parseCustomSessionSourceKind(sp.get("sourceKind"));
        const catchWeakOnly = sp.get("weakOnly") === "1";
        const catchIncorrectOnly = sp.get("incorrectOnly") === "1";
        const catchStarredOnly = sp.get("starredOnly") === "1";
        const catchSavedOnly = sp.get("savedOnly") === "1";
        const catchNotesOnly = sp.get("notesOnly") === "1";
        const catchRevisitOnly = sp.get("revisitOnly") === "1";
        const catchNotStudiedOnly = sp.get("notStudiedOnly") === "1";
        const catchRecentStudiedOnly = sp.get("recentStudiedOnly") === "1";
        const catchIsUserSpecific =
          catchWeakOnly || catchIncorrectOnly || catchNotStudiedOnly || catchRecentStudiedOnly ||
          catchStarredOnly || catchSavedOnly || catchNotesOnly || catchRevisitOnly;

        const catchKey = buildSelfHealingCacheKey({
          pathwayId: catchPathwayId,
          lessonId: catchLessonId,
          tier: launchLogContext.tier,
          country: launchLogContext.country,
          selectedCategories: catchCategories,
          sourceKind: catchSourceKind,
          mode: catchMode,
          limit: catchLimit,
          weakOnly: catchWeakOnly,
          incorrectOnly: catchIncorrectOnly,
          starredOnly: catchStarredOnly,
          savedOnly: catchSavedOnly,
          notesOnly: catchNotesOnly,
          revisitOnly: catchRevisitOnly,
          notStudiedOnly: catchNotStudiedOnly,
          recentStudiedOnly: catchRecentStudiedOnly,
          userPrefix: catchIsUserSpecific ? launchLogContext.userIdPrefix : undefined,
        });
        const cachedSession = getSelfHealingSessionCache(catchKey);
        if (cachedSession && cachedSession.summary.returnedCards > 0) {
          recordRecoveryEvent("tier_a_fallback_hit"); void recordFlashcardReliabilityCounter("tier_a");
          logRecoveryEvent({
            tier: "A",
            reason: isTimeout ? "session_timeout_cache_rescue" : "route_exception_cache_rescue",
            pathwayId: catchPathwayId ?? "",
            userId: launchLogContext.userIdPrefix,
            returnedCards: cachedSession.summary.returnedCards,
          });
          const h = mergeSubscriberPrivateCacheHeaders();
          h.set("x-nn-session-source", "tier_a_persistence");
          h.set("x-nn-recovery-tier", "A");
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

        // ── Tier C — catalog fallback on exception ────────────────────────
        if (catchPathwayId) {
          const includeCardsParam = sp.get("includeCards");
          const catchIncludeCards = includeCardsParam === "1";
          const catalogSession = buildFlashcardCatalogFallbackSession({
            pathwayId: catchPathwayId,
            limit: catchLimit,
            mode: catchMode,
            includeCards: catchIncludeCards,
            tier: launchLogContext.tier,
            country: launchLogContext.country,
          });
          if (catalogSession) {
            recordRecoveryEvent("tier_c_catalog_hit"); void recordFlashcardReliabilityCounter("tier_c");
            logRecoveryEvent({
              tier: "C",
              reason: isTimeout ? "session_timeout_catalog_rescue" : "route_exception_catalog_rescue",
              pathwayId: catchPathwayId,
              userId: launchLogContext.userIdPrefix,
              returnedCards: catalogSession.summary.returnedCards,
            });
            const h = mergeSubscriberPrivateCacheHeaders();
            h.set("x-nn-session-source", "tier_c_catalog");
            h.set("x-nn-recovery-tier", "C");
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

      // Tier D (emergency deck) is client-side.
      recordRecoveryEvent("tier_d_error"); void recordFlashcardReliabilityCounter("tier_d_error");
      const h = mergeSubscriberPrivateCacheHeaders();
      h.set("Retry-After", "3");
      h.set("x-nn-session-timeout-ms", isTimeout ? "4800" : "0");
      h.set("x-nn-recovery-tier", "D_error");
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
