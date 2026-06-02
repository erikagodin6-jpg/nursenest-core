import type { FlashcardSrsStats } from "@/components/flashcards/flashcard-srs-stats-strip";

export type FlashcardsReadinessNarrative = {
  headline: string;
  support: string;
  tone: "success" | "info" | "warning" | "danger";
  streakLabel: string | null;
  dueLabel: string | null;
};

export function buildFlashcardsReadinessNarrative(
  stats: FlashcardSrsStats | null,
): FlashcardsReadinessNarrative {
  const masteryPct = stats?.masteryPct ?? 0;
  const reviewDue = (stats?.dueToday ?? 0) + (stats?.overdue ?? 0);
  const overdue = stats?.overdue ?? 0;
  const lapsing = stats?.lapsingCards ?? 0;
  const streak = stats?.streak ?? 0;

  let headline = "Your recall rhythm is taking shape.";
  let support = "Start a short adaptive session to build momentum toward exam readiness.";
  let tone: FlashcardsReadinessNarrative["tone"] = "info";

  if (masteryPct >= 75) {
    headline = "You're trending toward exam-ready recall.";
    support =
      reviewDue > 0
        ? "Strong retention — clear today's due cards to keep confidence high."
        : "Retention looks solid. A focused review keeps NCLEX-style recall sharp.";
    tone = "success";
  } else if (masteryPct >= 55) {
    headline = "Your retention is improving this week.";
    support =
      lapsing > 0
        ? `${lapsing} card${lapsing === 1 ? "" : "s"} need a quick reinforcement pass today.`
        : "Keep short daily sessions — consistency matters more than marathon runs.";
    tone = "info";
  } else if (masteryPct >= 35) {
    headline = "Core recall is still building — stay steady.";
    support =
      reviewDue > 0
        ? `${reviewDue} card${reviewDue === 1 ? "" : "s"} are due — a 15-minute session closes the gap.`
        : "Pick weak systems or continue your last session to reinforce what you just learned.";
    tone = "warning";
  } else if (masteryPct > 0) {
    headline = "Early deck exposure — small wins compound fast.";
    support = "Use Resume or a short session from the hub to establish a daily rhythm.";
    tone = "warning";
  }

  if (overdue > 0 && masteryPct >= 35) {
    headline = "Spaced repetition is calling — catch up today.";
    support = `${overdue} overdue card${overdue === 1 ? "" : "s"} — a quick session restores confidence before they slip.`;
    tone = "warning";
  }

  const streakLabel =
    streak > 0 ? `${streak}-day study streak` : streak === 0 && masteryPct > 0 ? "Start a streak today" : null;

  const dueLabel =
    reviewDue > 0
      ? `${reviewDue} due now${overdue > 0 ? ` · ${overdue} overdue` : ""}`
      : masteryPct > 0
        ? "Queue clear for today"
        : null;

  return { headline, support, tone, streakLabel, dueLabel };
}
