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

export const dynamic = "force-dynamic";

type CustomSessionCountOnlyCacheEntry = { cachedAtMs: number; body: unknown };
const customSessionCountOnlyCache = new Map<string, CustomSessionCountOnlyCacheEntry>();
const CUSTOM_SESSION_COUNT_ONLY_CACHE_TTL_MS = 15_000;
const CUSTOM_SESSION_COUNT_ONLY_CACHE_MAX = 2000;

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
    try {
      const headers = mergeSubscriberPrivateCacheHeaders();

      const gate = await requireSubscriberSession();
      if (!gate.ok) return gate.response;

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

      const built = await buildFlashcardCustomSession({
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
        sessionSeed: sp.get("sessionSeed")?.trim() || null,
        cardLimitRaw: sp.get("cardLimit"),
      });

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
        const h = new Headers(headers);
        h.set("Retry-After", "3");
        return NextResponse.json(
          {
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
          },
          { status: 503, headers: h },
        );
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

      const body = {
        ok: true,
        unsupportedFilters: [],
        summary: built.summary,
        categoryOptions: built.categoryOptions,
        cards: built.cards,
      };

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
      const h = mergeSubscriberPrivateCacheHeaders();
      h.set("Retry-After", "3");
      return NextResponse.json(
        {
          ok: false,
          code: "service_unavailable",
          error: "Flashcard session is temporarily unavailable. Please retry.",
          retryable: true,
        },
        { status: 503, headers: h },
      );
    }
  });
}
