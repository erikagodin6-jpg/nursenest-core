"use client";

import type { ReactNode } from "react";

/**
 * Focused, low-chrome container for timed tests, CAT, and exam-style practice.
 * Theme primary is used only for thin accents (progress fill, selection rings)—surfaces stay neutral.
 */
export function ExamSessionShell({
  children,
  className = "",
  /** When true, applies slightly cooler neutrals (see `.nn-exam-session--neutral`). */
  neutralPalette = false,
}: {
  children: ReactNode;
  className?: string;
  neutralPalette?: boolean;
}) {
  return (
    <div className={`nn-exam-session rounded-2xl border ${neutralPalette ? "nn-exam-session--neutral" : ""} ${className}`}>
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
    <div className="border-b border-b-primary/[0.12] border-border/80 bg-card/90 px-4 py-3 backdrop-blur-[2px]">
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
export function ExamProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
  return (
    <div className="nn-exam-progress border-b border-border/70 bg-[var(--bg-inset)]/50 px-4 py-2.5">
      <div className="nn-marketing-caption mb-1.5 flex justify-between gap-3 font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
        <span>Session progress</span>
        <span className="shrink-0 tabular-nums text-[var(--theme-heading-text)]">
          {current} / {total}
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted/50"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-label={`Session progress ${current} of ${total}`}
      >
        <div
          className="h-full rounded-full bg-primary/45 transition-[width] duration-500 ease-out"
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
            ? "text-[color-mix(in_srgb,#b91c1c_78%,var(--theme-heading-text))] dark:text-[color-mix(in_srgb,#fca5a5_75%,var(--theme-heading-text))]"
            : warn
              ? "text-[var(--role-warning-text)]"
              : "text-[var(--theme-heading-text)]"
        }`}
        aria-live="polite"
      >
        {m}:{String(s).padStart(2, "0")}
      </span>
    </div>
  );
}
