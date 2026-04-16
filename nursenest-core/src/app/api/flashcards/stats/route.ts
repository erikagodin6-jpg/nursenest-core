import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

export async function GET() {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;
  const { userId } = gate;

  setSentryServerContext({ route: "/api/flashcards/stats", feature: SERVER_FEATURE.flashcard, userId });

  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({
      currentStreak: 0,
      longestStreak: 0,
      cardsReviewedTotal: 0,
      lastStudyDate: null,
      degraded: true,
    });
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

    return NextResponse.json({
      currentStreak: stats?.currentStreak ?? 0,
      longestStreak: stats?.longestStreak ?? 0,
      cardsReviewedTotal: stats?.cardsReviewedTotal ?? 0,
      lastStudyDate: stats?.lastStudyDate?.toISOString() ?? null,
    });
  } catch (e) {
    safeServerLogCritical("api_flashcards_stats", "find_failed", { userId: userId.slice(0, 8) }, e);
    return NextResponse.json(
      {
        currentStreak: 0,
        longestStreak: 0,
        cardsReviewedTotal: 0,
        lastStudyDate: null,
        degraded: true,
      },
      { status: 200 },
    );
  }
  });
}
