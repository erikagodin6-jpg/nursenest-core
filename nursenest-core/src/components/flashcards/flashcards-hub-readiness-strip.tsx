"use client";

import { useEffect, useState } from "react";
import type { FlashcardSrsStats } from "@/components/flashcards/flashcard-srs-stats-strip";
import { buildFlashcardsReadinessNarrative } from "@/lib/flashcards/flashcards-hub-readiness-narrative";
import { semanticFillClassForAccuracyPct } from "@/lib/ui/semantic-progress-fill";
import { fetchLearnerActivityJson } from "@/lib/runtime/learner-activity-fetch";

async function fetchSrsStats(pathwayId: string, signal: AbortSignal): Promise<FlashcardSrsStats | null> {
  const qs = new URLSearchParams({ countsOnly: "1", pathwayId });
  const [queueResult, statsResult] = await Promise.all([
    fetchLearnerActivityJson<{ counts: Partial<FlashcardSrsStats> }>(`/api/flashcards/study-queue?${qs}`, {
      signal,
      diagnosticScope: "flashcards_readiness",
      diagnosticKey: pathwayId,
      diagnosticMeta: { pathwayId },
    }),
    fetchLearnerActivityJson<{ currentStreak?: number }>("/api/flashcards/stats", {
      signal,
      diagnosticScope: "flashcards_readiness",
      diagnosticKey: `stats:${pathwayId}`,
      diagnosticMeta: { pathwayId },
    }),
  ]);
  if (!queueResult.ok && !statsResult.ok) return null;
  const queue = queueResult.ok ? queueResult.data : null;
  const statsData = statsResult.ok ? statsResult.data : null;
  const counts = queue?.counts ?? {};
  const totalReviewed = (counts as { totalReviewed?: number }).totalReviewed ?? 0;
  const newCards = (counts as { newCards?: number }).newCards ?? 0;
  const totalAccessible = totalReviewed + newCards;
  const masteryPct = totalAccessible > 0 ? Math.round((totalReviewed / totalAccessible) * 100) : 0;
  return {
    dueToday: (counts as { dueToday?: number }).dueToday ?? 0,
    overdue: (counts as { overdue?: number }).overdue ?? 0,
    lapsingCards: (counts as { lapsingCards?: number }).lapsingCards ?? 0,
    newCards,
    streak: statsData?.currentStreak ?? 0,
    masteryPct,
  };
}

const toneFillClass: Record<ReturnType<typeof buildFlashcardsReadinessNarrative>["tone"], string> = {
  success: "nn-progress-fill-semantic-success",
  info: "nn-progress-fill-semantic-info",
  warning: "nn-progress-fill-semantic-warning",
  danger: "nn-progress-fill-semantic-danger",
};

export function FlashcardsHubReadinessStrip({
  pathwayId,
  className = "",
}: {
  pathwayId: string;
  className?: string;
}) {
  const [stats, setStats] = useState<FlashcardSrsStats | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void fetchSrsStats(pathwayId, controller.signal).then((s) => {
      if (!controller.signal.aborted && s) setStats(s);
    });
    return () => controller.abort();
  }, [pathwayId]);

  const narrative = buildFlashcardsReadinessNarrative(stats);
  const masteryPct = stats?.masteryPct ?? 0;
  const fillClass =
    masteryPct > 0 ? semanticFillClassForAccuracyPct(masteryPct) : toneFillClass[narrative.tone];

  return (
    <div
      className={`nn-flashcards-readiness-strip nn-flashcards-readiness-strip--editorial ${className}`.trim()}
      data-nn-e2e-flashcards-readiness
      aria-label="Study readiness"
    >
      <div className="nn-flashcards-readiness-editorial min-w-0 flex-1">
        <p
          className="text-base font-semibold leading-snug text-[var(--semantic-text-primary)] sm:text-lg"
          data-nn-e2e-flashcards-readiness-headline
        >
          {narrative.headline}
        </p>
        <p className="mt-1.5 max-w-prose text-pretty text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          {narrative.support}
        </p>
        <div className="nn-progress-track-semantic nn-progress-track-semantic--xs mt-3 h-1.5 max-w-md overflow-hidden rounded-full bg-[var(--semantic-progress-track)]">
          <div
            className={`h-full rounded-full ${fillClass} transition-[width] duration-500 ease-out`}
            style={{ width: `${Math.max(masteryPct, masteryPct > 0 ? 8 : 4)}%` }}
          />
        </div>
      </div>
      <div className="nn-flashcards-readiness-chips flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end sm:justify-center">
        {narrative.streakLabel ? (
          <span className="nn-badge-semantic-brand inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold">
            {narrative.streakLabel}
          </span>
        ) : null}
        {narrative.dueLabel ? (
          <span className="nn-badge-semantic-warning inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold">
            {narrative.dueLabel}
          </span>
        ) : null}
        {masteryPct > 0 ? (
          <span
            className="text-[11px] font-semibold tabular-nums text-[var(--semantic-text-muted)]"
            aria-label={`Recall readiness ${masteryPct} percent`}
          >
            {masteryPct}% recall
          </span>
        ) : null}
      </div>
    </div>
  );
}
