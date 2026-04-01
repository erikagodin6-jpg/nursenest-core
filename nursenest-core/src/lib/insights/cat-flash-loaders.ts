import { PracticeTestStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { CatInsightSummary, FlashcardInsight } from "@/lib/insights/types";

export async function loadCatInsightSummary(userId: string): Promise<CatInsightSummary> {
  try {
    const row = await prisma.practiceTest.findFirst({
      where: { userId, status: PracticeTestStatus.COMPLETED },
      orderBy: { completedAt: "desc" },
      select: { adaptiveState: true, results: true },
    });
    if (!row?.adaptiveState || typeof row.adaptiveState !== "object") {
      return { hasData: false, theta: null, se: null, line: null };
    }
    const st = row.adaptiveState as { theta?: number; se?: number };
    const theta = typeof st.theta === "number" ? st.theta : null;
    const se = typeof st.se === "number" ? st.se : null;
    if (theta == null && se == null) {
      return { hasData: false, theta: null, se: null, line: null };
    }
    let line: string | null = null;
    if (se != null && se <= 0.55) {
      line = `Your last adaptive (CAT-style) run estimated ability around θ=${theta?.toFixed(2) ?? "—"} with moderate precision (SE≈${se.toFixed(2)}) — indicative only.`;
    } else if (theta != null) {
      line =
        "Your last adaptive practice run recorded an ability estimate — keep using CAT occasionally alongside linear mocks.";
    }
    return { hasData: true, theta, se, line };
  } catch {
    return { hasData: false, theta: null, se: null, line: null };
  }
}

export async function loadFlashcardInsight(userId: string): Promise<FlashcardInsight> {
  try {
    const row = await prisma.flashcardUserStats.findUnique({
      where: { userId },
      select: {
        cardsReviewedTotal: true,
        lastStudyDate: true,
        currentStreak: true,
      },
    });
    if (!row) {
      return {
        cardsReviewedTotal: 0,
        lastStudyDate: null,
        currentStreak: 0,
        line: "No flashcard reviews logged yet — short decks help lock in weak-topic facts.",
      };
    }
    const line =
      row.cardsReviewedTotal < 20
        ? "Flashcard volume is still low — pair 5–10 cards after each question bank session."
        : `You have logged ${row.cardsReviewedTotal} card reviews — keep tying cards to your weakest topics.`;
    return {
      cardsReviewedTotal: row.cardsReviewedTotal,
      lastStudyDate: row.lastStudyDate?.toISOString() ?? null,
      currentStreak: row.currentStreak,
      line,
    };
  } catch {
    return {
      cardsReviewedTotal: 0,
      lastStudyDate: null,
      currentStreak: 0,
      line: "Flashcard stats unavailable — you can still study decks from the flashcards area.",
    };
  }
}
