"use client";

import type { ReactNode } from "react";

/**
 * Focused, low-chrome container for timed tests, CAT, and exam-style practice.
 * Uses theme primary only for accents (buttons, selection, progress)—surface stays clinical/neutral.
 */
export function ExamSessionShell({
  children,
  className = "",
  /** When true, applies slightly cooler neutrals (see `html[data-exam-palette="neutral"]`). */
  neutralPalette = false,
}: {
  children: ReactNode;
  className?: string;
  neutralPalette?: boolean;
}) {
  return (
    <div
      className={`nn-exam-session rounded-2xl border border-slate-200 bg-slate-50 shadow-[0_1px_0_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-950/80 ${neutralPalette ? "nn-exam-session--neutral" : ""} ${className}`}
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
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-white/90 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/90">
      <div className="min-w-0 flex-1 text-sm text-slate-600 dark:text-slate-300">{left}</div>
      {center ? <div className="shrink-0 text-center text-xs font-medium text-slate-500">{center}</div> : null}
      <div className="min-w-0 flex-1 text-right text-sm tabular-nums text-slate-800 dark:text-slate-100">{right}</div>
    </div>
  );
}
