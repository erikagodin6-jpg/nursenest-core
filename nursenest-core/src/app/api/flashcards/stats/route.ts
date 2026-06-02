import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { logCoreApiStudyDiagnostic } from "@/lib/observability/core-api-diagnostics";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return runWithApiTelemetry(req, "GET /api/flashcards/stats", "content", async () => {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;
  const { userId } = gate;

  setSentryServerContext({ route: "/api/flashcards/stats", feature: SERVER_FEATURE.flashcard, userId });

  if (!isDatabaseUrlConfigured()) {
    logCoreApiStudyDiagnostic({
      endpoint: "GET /api/flashcards/stats",
      pathwayId: null,
      tier: String(gate.entitlement.tier ?? ""),
      reasonIfZero: "database_url_unset",
    });
    return NextResponse.json(
      {
        error: "Study stats are unavailable (database not configured in this environment).",
        code: "db_unavailable",
        currentStreak: 0,
        longestStreak: 0,
        cardsReviewedTotal: 0,
        lastStudyDate: null,
        degraded: true,
      },
      { status: 503 },
    );
  }

  try {
    const stats = await prisma.flashcardUserStats.findUnique({
      where: { userId },
      select: {
        currentStreak: true,
        longestStreak: true,
        cardsReviewedTotal: true,
        lastStudyDate: true,
      },
    });

    const body = {
      currentStreak: stats?.currentStreak ?? 0,
      longestStreak: stats?.longestStreak ?? 0,
      cardsReviewedTotal: stats?.cardsReviewedTotal ?? 0,
      lastStudyDate: stats?.lastStudyDate?.toISOString() ?? null,
    };
    logCoreApiStudyDiagnostic({
      endpoint: "GET /api/flashcards/stats",
      pathwayId: null,
      tier: String(gate.entitlement.tier ?? ""),
      cardsReviewedTotal: body.cardsReviewedTotal,
    });
    return NextResponse.json(body);
  } catch (e) {
    safeServerLogCritical("api_flashcards_stats", "find_failed", { userId: userId.slice(0, 8) }, e);
    logCoreApiStudyDiagnostic({
      endpoint: "GET /api/flashcards/stats",
      pathwayId: null,
      tier: String(gate.entitlement.tier ?? ""),
      reasonIfZero: "flashcard_user_stats_query_failed",
    });
    return NextResponse.json(
      {
        error: "Unable to load flashcard stats. Please retry.",
        code: "stats_query_failed",
        currentStreak: 0,
        longestStreak: 0,
        cardsReviewedTotal: 0,
        lastStudyDate: null,
        degraded: true,
      },
      { status: 503 },
    );
  }
  });
}
