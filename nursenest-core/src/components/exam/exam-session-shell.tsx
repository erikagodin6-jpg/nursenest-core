"use client";

import type { ReactNode } from "react";
import { useExamStudyThemeOptional } from "@/components/exam/exam-study-theme-context";

/**
 * Focused, low-chrome container for timed tests, CAT, and exam-style practice.
 * Theme primary is used only for thin accents (progress fill, selection rings)—surfaces stay neutral.
 *
 * When `ExamStudyThemeProvider` is present, optional session `data-theme` overrides apply to this shell only.
 */
export function ExamSessionShell({
  children,
  className = "",
  /** When true, applies slightly cooler neutrals (see `.nn-exam-session--neutral`). */
  neutralPalette = false,
  /** Larger radius, stronger shadow — reference “full-screen study” chrome. */
  immersive = false,
}: {
  children: ReactNode;
  className?: string;
  neutralPalette?: boolean;
  immersive?: boolean;
}) {
  const examTheme = useExamStudyThemeOptional();
  const scoped = examTheme?.sessionTheme ?? undefined;
  return (
    <div
      className={`nn-exam-session rounded-2xl border ${neutralPalette ? "nn-exam-session--neutral" : ""} ${immersive ? "nn-exam-session--immersive" : ""} ${className}`.trim()}
      data-theme={scoped}
    >
      {children}
    </div>
  );
}

export function ExamSessionTopBar({
  left,
  center,
  right,
}: {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="border-b border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))] px-4 py-3 backdrop-blur-[2px]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="nn-marketing-body-sm min-w-0 flex-1 leading-snug text-[var(--theme-body-text)]">{left}</div>
        {center ? (
          <div className="nn-marketing-caption max-w-[min(100%,14rem)] shrink-0 text-center font-semibold uppercase tracking-wide">
            {center}
          </div>
        ) : null}
        <div className="min-w-0 flex-1 text-right">{right}</div>
      </div>
    </div>
  );
}

/** Thin progress track — fill uses theme primary at restrained opacity. */
export function ExamProgressBar({
  current,
  total,
  answeredCount,
}: {
  current: number;
  total: number;
  /** Optional: how many questions have been answered/graded (for richer status). */
  answeredCount?: number;
}) {
  const pct = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
  const remaining = total - (answeredCount ?? current - 1);
  return (
    <div className="nn-exam-progress border-b border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-2.5">
      <div className="nn-marketing-caption mb-1.5 flex justify-between gap-3 font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
        <span>Session progress</span>
        <div className="flex items-center gap-2 shrink-0">
          {answeredCount != null && answeredCount > 0 ? (
            <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-0.5 text-[10px] font-semibold tabular-nums text-[var(--semantic-text-muted)]">
              {remaining} left
            </span>
          ) : null}
          <span className="tabular-nums text-[var(--semantic-text-primary)]">
            {current} / {total}
          </span>
        </div>
      </div>
      <div
        className="nn-progress-track-semantic nn-progress-track-semantic--md"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-label={`Session progress ${current} of ${total}`}
      >
        <div
          className="nn-progress-fill-semantic-readiness nn-progress-fill-reveal transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** Monospace-style countdown; warning tiers without loud color blocks. */
export function ExamTimerReadout({
  remainingSec,
  untimedLabel = "No time limit",
}: {
  remainingSec: number | null | undefined;
  untimedLabel?: string;
}) {
  if (remainingSec == null) {
    return (
      <div className="flex flex-col items-end gap-0.5 text-right">
        <span className="nn-marketing-caption font-semibold uppercase tracking-wider">Timer</span>
        <span className="nn-marketing-body-sm font-medium text-[var(--theme-muted-text)]">{untimedLabel}</span>
      </div>
    );
  }
  const warn = remainingSec < 120;
  const critical = remainingSec < 60;
  const m = Math.floor(remainingSec / 60);
  const s = remainingSec % 60;
  return (
    <div className="flex flex-col items-end gap-0.5 text-right">
      <span className="nn-marketing-caption font-semibold uppercase tracking-wider">Time remaining</span>
      <span
        className={`font-mono text-lg font-semibold tabular-nums tracking-tight ${
          critical
            ? "text-[var(--semantic-danger)]"
            : warn
              ? "text-[var(--semantic-warning-contrast)]"
              : "text-[var(--semantic-text-primary)]"
        }`}
        aria-live="polite"
      >
        {m}:{String(s).padStart(2, "0")}
      </span>
    </div>
  );
}
