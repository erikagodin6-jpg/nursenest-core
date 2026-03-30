import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { setSentryServerContext } from "@/lib/observability/sentry-server-context";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  setSentryServerContext({ route: "/api/flashcards/stats", feature: "flashcard", userId });

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
}
