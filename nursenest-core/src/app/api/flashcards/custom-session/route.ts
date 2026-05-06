import { NextRequest, NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { resolveEntitlement } from "@/lib/entitlements/resolve-entitlement";
import { auth } from "@/lib/auth";
import { classifyDatabaseFallbackKind } from "@/lib/db/safe-database";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  buildFlashcardCustomSession,
  parseCustomSessionCardLimit,
  parseCustomSessionCategories,
  parseCustomSessionStudyMode,
} from "@/lib/flashcards/build-flashcard-custom-session";
import { parseCustomSessionSourceKind } from "@/lib/flashcards/custom-session-card-filters";
import { normalizeLearnerFlashcardsPathwayQueryId } from "@/lib/flashcards/flashcards-pathway-query";
import { logCoreApiStudyDiagnostic } from "@/lib/observability/core-api-diagnostics";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/flashcards/custom-session", "content", async () => {
    try {
      const session = await auth();
      const userId = (session?.user as { id?: string } | undefined)?.id;
      if (!userId) {
        return NextResponse.json({ error: "Sign in required", code: "auth_required" }, { status: 401 });
      }

      const entitlement = await resolveEntitlement(userId);
      if (!entitlement.hasAccess) {
        return NextResponse.json({ error: "Subscription required", code: "subscription_required" }, { status: 403 });
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
      const includeCards = sp.get("includeCards") === "1";
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
        pathwayId: pathwayId ?? "",
        topicIds: topicIdsForLog.slice(0, 200),
        relaxation: "none",
        includeCards: includeCards ? "1" : "0",
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
        sessionSeed: sp.get("sessionSeed")?.trim() || null,
        cardLimitRaw: sp.get("cardLimit"),
      });

      if (!built.ok) {
        const kind = classifyDatabaseFallbackKind(new Error(built.reason));
        safeServerLog("flashcards", "custom_session_db_failed", {
          kind,
          message: built.reason.slice(0, 400),
          pathwayId: pathwayId ?? "",
        });
        return NextResponse.json(
          {
            ok: false,
            code: built.code,
            error: built.message,
            integrity: {
              querySucceeded: false,
              source: "error",
              rawCount: null,
              filteredCount: null,
              finalCount: 0,
              reasonFailed: `${kind}:${built.reason}`.slice(0, 500),
            },
          },
          { status: 503 },
        );
      }

      safeServerLog("flashcards", "custom_session_query", {
        pathwayId: pathwayId ?? "",
        topicIds: topicIdsForLog.slice(0, 200),
        rawCount: String(built.summary.matchingCards),
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

      return NextResponse.json({
        ok: true,
        unsupportedFilters: [],
        summary: built.summary,
        categoryOptions: built.categoryOptions,
        cards: built.cards,
      });
    } catch (error) {
      console.error("FLASHCARD CUSTOM SESSION ERROR:", error);
      return NextResponse.json(
        {
          ok: false,
          code: "internal_error",
          error: "Flashcard session could not be loaded. Please retry.",
          categories: [],
          total: 0,
        },
        { status: 500 },
      );
    }
  });
}
