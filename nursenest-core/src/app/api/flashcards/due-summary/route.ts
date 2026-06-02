import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { logCoreApiStudyDiagnostic } from "@/lib/observability/core-api-diagnostics";
import {
  getFlashcardDueSummary,
  setFlashcardDueSummary,
} from "@/lib/server/content-cache";

export const dynamic = "force-dynamic";

function utcDayBounds(d: Date): { start: Date; end: Date } {
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
  return { start, end };
}

/**
 * Scoped SRS snapshot: due within UTC today, overdue before UTC today, “learning” (low repetition ladder).
 */
export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/flashcards/due-summary", "content", async () => {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const { userId, entitlement } = gate;
  setSentryServerContext({ route: "/api/flashcards/due-summary", feature: SERVER_FEATURE.flashcard, userId });

  if (!isDatabaseUrlConfigured()) {
    logCoreApiStudyDiagnostic({
      endpoint: "GET /api/flashcards/due-summary",
      pathwayId: null,
      tier: String(entitlement.tier ?? ""),
      reasonIfZero: "database_url_unset",
    });
    return NextResponse.json(
      {
        error: "Due summary is unavailable (database not configured in this environment).",
        code: "db_unavailable",
        dueToday: 0,
        overdue: 0,
        learning: 0,
        degraded: true,
      },
      { status: 503 },
    );
  }

  const cached = await getFlashcardDueSummary(userId);
  if (cached) return NextResponse.json(cached);

  const now = new Date();
  const { start: todayStart, end: todayEnd } = utcDayBounds(now);
  const cardScope = flashcardAccessWhere(entitlement);
  // Restrict progress counts to deck-based cards only, matching totalAccessible denominator.
  const deckCardScope = { ...cardScope, deckId: { not: null as null } };

  try {
    const [dueToday, overdue, learning, lapsingCards, totalReviewed, totalAccessible] = await Promise.all([
      // Due today — exclude lapsing (handled separately)
      prisma.flashcardProgress.count({
        where: {
          userId,
          lapses: 0,
          nextReviewAt: { gte: todayStart, lte: todayEnd },
          flashcard: deckCardScope,
        },
      }),
      // Overdue — exclude lapsing to avoid double-count
      prisma.flashcardProgress.count({
        where: {
          userId,
          lapses: 0,
          nextReviewAt: { lt: todayStart },
          flashcard: deckCardScope,
        },
      }),
      // Learning: low repetitions with scheduled review (early retention stage)
      prisma.flashcardProgress.count({
        where: {
          userId,
          repetitions: { lt: 2 },
          nextReviewAt: { not: null },
          flashcard: deckCardScope,
        },
      }),
      // Lapsing: lapses > 0 AND due/overdue — separate bucket from overdue
      prisma.flashcardProgress.count({
        where: {
          userId,
          lapses: { gt: 0 },
          nextReviewAt: { lte: todayEnd },
          flashcard: deckCardScope,
        },
      }),
      // Total reviewed (deck cards only, matches totalAccessible denominator)
      prisma.flashcardProgress.count({
        where: {
          userId,
          OR: [{ repetitions: { gt: 0 } }, { lapses: { gt: 0 } }],
          flashcard: deckCardScope,
        },
      }),
      prisma.flashcard.count({
        where: { status: "PUBLISHED", deckId: { not: null }, ...cardScope },
      }),
    ]);

    const newCards = Math.max(0, totalAccessible - totalReviewed);

    logCoreApiStudyDiagnostic({
      endpoint: "GET /api/flashcards/due-summary",
      pathwayId: null,
      tier: String(entitlement.tier ?? ""),
      rowsReturned: dueToday + overdue + learning,
      matchingTotal: dueToday + overdue + learning,
    });

    const payload = { dueToday, overdue, learning, lapsingCards, newCards, totalReviewed, asOf: now.toISOString() };
    await setFlashcardDueSummary(userId, payload);
    return NextResponse.json(payload);
  } catch (e) {
    safeServerLogCritical("api_flashcards_due_summary", "query_failed", {}, e);
    logCoreApiStudyDiagnostic({
      endpoint: "GET /api/flashcards/due-summary",
      pathwayId: null,
      tier: String(entitlement.tier ?? ""),
      reasonIfZero: "due_summary_query_failed",
    });
    return NextResponse.json({ error: "Unable to load due summary", code: "query_failed" }, { status: 503 });
  }
  });
}
