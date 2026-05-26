"use client";

import { useEffect, useState } from "react";
import { Flame, BookOpen, AlertTriangle, Clock } from "lucide-react";
import { fetchLearnerActivityJson } from "@/lib/runtime/learner-activity-fetch";

export type FlashcardSrsStats = {
  dueToday: number;
  overdue: number;
  lapsingCards: number;
  newCards: number;
  streak: number;
  masteryPct: number;
};

type Props = {
  pathwayId?: string | null;
  /** Override fetched data — useful when parent already has stats. */
  stats?: Partial<FlashcardSrsStats>;
  className?: string;
};

function normalizeSrsStats(stats: Partial<FlashcardSrsStats> | null | undefined): FlashcardSrsStats | null {
  if (!stats) return null;
  return {
    dueToday: stats.dueToday ?? 0,
    overdue: stats.overdue ?? 0,
    lapsingCards: stats.lapsingCards ?? 0,
    newCards: stats.newCards ?? 0,
    streak: stats.streak ?? 0,
    masteryPct: stats.masteryPct ?? 0,
  };
}

async function fetchSrsStats(pathwayId: string | null, signal: AbortSignal): Promise<FlashcardSrsStats | null> {
  const qs = new URLSearchParams({ countsOnly: "1" });
  if (pathwayId) qs.set("pathwayId", pathwayId);
  const [queueResult, statsResult] = await Promise.all([
    fetchLearnerActivityJson<{ counts: Partial<FlashcardSrsStats> }>(`/api/flashcards/study-queue?${qs}`, {
      signal,
      diagnosticScope: "flashcard_srs_stats",
      diagnosticKey: pathwayId ?? "all",
      diagnosticMeta: { pathwayId },
    }),
    fetchLearnerActivityJson<{ currentStreak?: number; cardsReviewedTotal?: number }>("/api/flashcards/stats", {
      signal,
      diagnosticScope: "flashcard_srs_stats",
      diagnosticKey: `stats:${pathwayId ?? "all"}`,
      diagnosticMeta: { pathwayId },
    }),
  ]);
  if (!queueResult.ok && !statsResult.ok) return null;
  const queue = queueResult.ok ? queueResult.data : null;
  const statsData = statsResult.ok ? statsResult.data : null;

  const counts = queue?.counts ?? {};
  const streak = statsData?.currentStreak ?? 0;
  const totalReviewed = (counts as { totalReviewed?: number }).totalReviewed ?? 0;
  const newCards = (counts as { newCards?: number }).newCards ?? 0;
  const totalAccessible = totalReviewed + newCards;
  const masteryPct = totalAccessible > 0 ? Math.round((totalReviewed / totalAccessible) * 100) : 0;

  return {
    dueToday: (counts as { dueToday?: number }).dueToday ?? 0,
    overdue: (counts as { overdue?: number }).overdue ?? 0,
    lapsingCards: (counts as { lapsingCards?: number }).lapsingCards ?? 0,
    newCards,
    streak,
    masteryPct,
  };
}

export function FlashcardSrsStatsStrip({ pathwayId = null, stats: overrideStats, className = "" }: Props) {
  const [stats, setStats] = useState<FlashcardSrsStats | null>(() => normalizeSrsStats(overrideStats));

  useEffect(() => {
    if (overrideStats) return;
    const controller = new AbortController();
    void fetchSrsStats(pathwayId, controller.signal).then((s) => {
      if (!controller.signal.aborted && s) setStats(s);
    });
    return () => controller.abort();
  }, [pathwayId, overrideStats]);

  if (!stats) return null;

  const reviewDue = stats.dueToday + stats.overdue;

  return (
    <div
      className={`nn-flashcard-srs-stats-strip flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] tabular-nums ${className}`}
      data-testid="flashcard-srs-stats-strip"
      aria-label="Flashcard study stats"
    >
      {reviewDue > 0 ? (
        <span
          className="inline-flex items-center gap-1 font-semibold text-[var(--semantic-warning)]"
          title={`${stats.dueToday} due today, ${stats.overdue} overdue`}
          data-testid="srs-due-badge"
        >
          <Clock className="h-3 w-3" aria-hidden />
          {reviewDue} due
          {stats.overdue > 0 ? (
            <span className="ml-0.5 text-[var(--semantic-danger)]">({stats.overdue} overdue)</span>
          ) : null}
        </span>
      ) : null}

      {stats.lapsingCards > 0 ? (
        <span
          className="inline-flex items-center gap-1 font-semibold text-[var(--semantic-danger)]"
          title={`${stats.lapsingCards} lapsing cards`}
          data-testid="srs-lapsing-badge"
        >
          <AlertTriangle className="h-3 w-3" aria-hidden />
          {stats.lapsingCards} lapsing
        </span>
      ) : null}

      {stats.newCards > 0 ? (
        <span
          className="inline-flex items-center gap-1 text-[var(--semantic-text-muted)]"
          title={`${stats.newCards} new cards available`}
          data-testid="srs-new-badge"
        >
          <BookOpen className="h-3 w-3" aria-hidden />
          {stats.newCards} new
        </span>
      ) : null}

      {stats.streak > 0 ? (
        <span
          className="inline-flex items-center gap-1 font-semibold text-[var(--semantic-brand)]"
          title={`${stats.streak}-day streak`}
          data-testid="srs-streak-badge"
        >
          <Flame className="h-3 w-3" aria-hidden />
          {stats.streak}d streak
        </span>
      ) : null}

      {stats.masteryPct > 0 ? (
        <span
          className="inline-flex items-center gap-1 text-[var(--semantic-text-secondary)]"
          title={`${stats.masteryPct}% mastery (cards reviewed / total accessible)`}
          data-testid="srs-mastery-badge"
        >
          {stats.masteryPct}% mastered
        </span>
      ) : null}
    </div>
  );
}
