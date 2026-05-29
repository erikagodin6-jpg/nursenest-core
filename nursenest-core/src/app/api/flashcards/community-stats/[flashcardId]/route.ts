/**
 * GET /api/flashcards/community-stats/[flashcardId]
 *
 * Returns aggregated community performance for a single flashcard.
 * Data sourced from denormalized FlashcardOption counters.
 *
 * Minimum sample size: 100 total selections. Below this threshold,
 * the response returns `{ sampleTooSmall: true }` — the UI must suppress stats.
 *
 * Response shape:
 *   communityCorrectRate  — 0–1 fraction of total sessions answered correctly
 *   totalSessions         — total unique selection events (proxy for sessions)
 *   difficulty            — "easy" | "medium" | "hard" | "very-hard"
 *   sampleTooSmall        — true when totalSessions < MIN_SAMPLE
 *   answerDistribution    — per-option breakdown: letter, selectRate, isCorrect
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { runWithApiTelemetry } from "@/lib/observability/api-route-telemetry";
import { requireSubscriberSession } from "@/lib/entitlements/require-subscriber-session";
import { prisma } from "@/lib/db";
import { setSentryServerContext, SERVER_FEATURE } from "@/lib/observability/sentry-server-context";

const MIN_SAMPLE = 100;

function difficultyFromRate(rate: number): "easy" | "medium" | "hard" | "very-hard" {
  if (rate >= 0.75) return "easy";
  if (rate >= 0.55) return "medium";
  if (rate >= 0.35) return "hard";
  return "very-hard";
}

type Props = { params: Promise<{ flashcardId: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest, { params }: Props) {
  return runWithApiTelemetry(req, "GET /api/flashcards/community-stats/[flashcardId]", "content", async () => {
    const gate = await requireSubscriberSession();
    if (!gate.ok) return gate.response;

    const { flashcardId } = await params;
    setSentryServerContext({ route: "/api/flashcards/community-stats/[flashcardId]", feature: SERVER_FEATURE.flashcard, userId: gate.userId });

    const rows = await prisma.flashcardOption.findMany({
      where: { flashcardId },
      select: {
        optionKey: true,
        isCorrect: true,
        selectCount: true,
        correctSelectCount: true,
      },
      orderBy: { displayOrder: "asc" },
    });

    if (rows.length === 0) {
      return NextResponse.json({ sampleTooSmall: true, totalSessions: 0 });
    }

    const totalSelections = rows.reduce((sum, r) => sum + r.selectCount, 0);

    if (totalSelections < MIN_SAMPLE) {
      return NextResponse.json({ sampleTooSmall: true, totalSessions: totalSelections });
    }

    // Community correct rate: sessions where the correct option was selected /
    // total sessions. For MCQ: correctSelectCount on the single correct option.
    const correctRow = rows.find((r) => r.isCorrect);
    const communityCorrectRate = correctRow && totalSelections > 0
      ? correctRow.selectCount / totalSelections
      : 0;

    const answerDistribution = rows.map((r) => ({
      letter: r.optionKey,
      selectRate: totalSelections > 0 ? r.selectCount / totalSelections : 0,
      isCorrect: r.isCorrect,
    }));

    return NextResponse.json({
      sampleTooSmall: false,
      totalSessions: totalSelections,
      communityCorrectRate,
      difficulty: difficultyFromRate(communityCorrectRate),
      answerDistribution,
    });
  });
}
