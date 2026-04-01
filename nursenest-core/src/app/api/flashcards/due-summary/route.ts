import { NextResponse } from "next/server";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { flashcardAccessWhere } from "@/lib/entitlements/content-access-scope";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";
import { safeServerLogCritical } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

function utcDayBounds(d: Date): { start: Date; end: Date } {
  const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
  const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
  return { start, end };
}

/**
 * Scoped SRS snapshot: due by end of UTC today, overdue before UTC today, “learning” (low repetition ladder).
 */
export async function GET() {
  const gate = await requireSubscriberSession();
  if (!gate.ok) return gate.response;

  const { userId, entitlement } = gate;
  setSentryServerContext({ route: "/api/flashcards/due-summary", feature: SERVER_FEATURE.flashcard, userId });

  if (!isDatabaseUrlConfigured()) {
    return NextResponse.json({
      dueToday: 0,
      overdue: 0,
      learning: 0,
      degraded: true,
    });
  }

  const now = new Date();
  const { start: todayStart, end: todayEnd } = utcDayBounds(now);
  const cardScope = flashcardAccessWhere(entitlement);

  try {
    const [dueToday, overdue, learning] = await Promise.all([
      prisma.flashcardProgress.count({
        where: {
          userId,
          nextReviewAt: { lte: todayEnd },
          flashcard: cardScope,
        },
      }),
      prisma.flashcardProgress.count({
        where: {
          userId,
          nextReviewAt: { lt: todayStart },
          flashcard: cardScope,
        },
      }),
      prisma.flashcardProgress.count({
        where: {
          userId,
          repetitions: { lt: 2 },
          nextReviewAt: { not: null },
          flashcard: cardScope,
        },
      }),
    ]);

    return NextResponse.json({
      dueToday,
      overdue,
      learning,
      asOf: now.toISOString(),
    });
  } catch (e) {
    safeServerLogCritical("api_flashcards_due_summary", "query_failed", {}, e);
    return NextResponse.json({ error: "Unable to load due summary" }, { status: 503 });
  }
}
