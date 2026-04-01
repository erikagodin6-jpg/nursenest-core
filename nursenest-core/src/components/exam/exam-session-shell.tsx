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
    <div
      className={`nn-exam-session rounded-2xl border border-slate-200/95 bg-slate-50 shadow-[0_1px_0_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-950/80 ${neutralPalette ? "nn-exam-session--neutral" : ""} ${className}`}
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
    <div className="border-b-[3px] border-b-primary/[0.12] border-slate-200/80 bg-white/95 px-4 py-3 dark:border-slate-800 dark:border-b-primary/[0.15] dark:bg-slate-900/95">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 text-sm leading-snug text-slate-700 dark:text-slate-200">{left}</div>
        {center ? (
          <div className="shrink-0 max-w-[min(100%,14rem)] text-center text-[11px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
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
    <div className="nn-exam-progress border-b border-slate-200/80 bg-white/50 px-4 py-2 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="mb-1 flex justify-between text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <span>Progress</span>
        <span className="tabular-nums text-slate-600 dark:text-slate-300">
          {current} / {total}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200/90 dark:bg-slate-700/90">
        <div
          className="h-full rounded-full bg-primary/55 transition-[width] duration-500 ease-out dark:bg-primary/50"
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
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Timer
        </span>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{untimedLabel}</span>
      </div>
    );
  }
  const warn = remainingSec < 120;
  const critical = remainingSec < 60;
  const m = Math.floor(remainingSec / 60);
  const s = remainingSec % 60;
  return (
    <div className="flex flex-col items-end gap-0.5 text-right">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Time remaining
      </span>
      <span
        className={`font-mono text-lg font-semibold tabular-nums tracking-tight ${
          critical
            ? "text-red-600 dark:text-red-400"
            : warn
              ? "text-amber-800 dark:text-amber-400"
              : "text-slate-900 dark:text-slate-100"
        }`}
        aria-live="polite"
      >
        {m}:{String(s).padStart(2, "0")}
      </span>
    </div>
  );
}
