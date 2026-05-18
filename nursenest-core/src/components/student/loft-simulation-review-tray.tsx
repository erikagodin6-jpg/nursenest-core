"use client";

import { AlertTriangle, CheckCircle2, Clock3, Flag } from "lucide-react";

export type LoftSimulationReviewItem = {
  id: string;
  index: number;
  title?: string | null;
  answered: boolean;
  flagged: boolean;
  timeSpentSeconds?: number | null;
};

function formatDuration(totalSeconds?: number | null): string {
  const safe = Math.max(0, Math.floor(totalSeconds ?? 0));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function LoftSimulationReviewTray({
  items,
  onResumeQuestion,
  onReviewFlagged,
}: {
  items: LoftSimulationReviewItem[];
  onResumeQuestion?: (index: number) => void;
  onReviewFlagged?: () => void;
}) {
  const answeredCount = items.filter((item) => item.answered).length;
  const unansweredCount = items.length - answeredCount;
  const flaggedCount = items.filter((item) => item.flagged).length;

  return (
    <section
      className="nn-loft-review-tray rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_95%,var(--semantic-panel-muted))] p-4 shadow-sm"
      data-nn-loft-review-tray=""
      aria-label="LOFT simulation review tray"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-[0.18em] text-[var(--semantic-text-muted)]">
            Simulation review
          </p>
          <h2 className="mt-1 text-base font-semibold text-[var(--semantic-text-primary)]">
            Review unanswered and flagged questions
          </h2>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] px-3 py-2 text-sm font-medium text-[var(--semantic-text-primary)] transition hover:opacity-90"
          onClick={() => onReviewFlagged?.()}
        >
          <Flag className="h-4 w-4" aria-hidden />
          Review flagged ({flaggedCount})
        </button>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--semantic-text-primary)]">
            <CheckCircle2 className="h-4 w-4" aria-hidden />
            Answered
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums text-[var(--semantic-text-primary)]">
            {answeredCount}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--semantic-text-primary)]">
            <AlertTriangle className="h-4 w-4" aria-hidden />
            Remaining
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums text-[var(--semantic-text-primary)]">
            {unansweredCount}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--semantic-text-primary)]">
            <Flag className="h-4 w-4" aria-hidden />
            Flagged
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums text-[var(--semantic-text-primary)]">
            {flaggedCount}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onResumeQuestion?.(item.index)}
            className="flex w-full items-center justify-between rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-3 text-left transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))]"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-xs font-bold text-[var(--semantic-text-primary)]">
                  {item.index + 1}
                </span>

                <p className="truncate text-sm font-medium text-[var(--semantic-text-primary)]">
                  {item.title?.trim() || `Question ${item.index + 1}`}
                </p>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--semantic-text-muted)]">
                <span>{item.answered ? "Answered" : "Not answered"}</span>
                {item.flagged ? (
                  <span className="inline-flex items-center gap-1 text-[var(--semantic-warning)]">
                    <Flag className="h-3 w-3" aria-hidden />
                    Flagged
                  </span>
                ) : null}
              </div>
            </div>

            <div className="ml-3 flex items-center gap-1 text-xs text-[var(--semantic-text-muted)]">
              <Clock3 className="h-3.5 w-3.5" aria-hidden />
              <span className="tabular-nums">{formatDuration(item.timeSpentSeconds)}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
