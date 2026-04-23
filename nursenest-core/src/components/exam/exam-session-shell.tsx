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
    <div className="border-b border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3">
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

/** Full-bleed thin strip (legacy mock-exam / flashcard study) — fill uses semantic brand readiness. */
export function ExamSessionProgressStrip({ pct }: { pct: number }) {
  const w = Math.min(100, Math.max(0, pct));
  return (
    <div
      className="h-1 w-full bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-panel-muted))]"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(w)}
      aria-label={`Progress ${Math.round(w)} percent`}
    >
      <div
        className="h-full nn-progress-fill-semantic-readiness transition-[width] duration-500 ease-out"
        style={{ width: `${w}%` }}
      />
    </div>
  );
}

export type ExamProgressBarVariant = "fixed_session" | "adaptive_item";

/**
 * Thin progress track — fill uses theme primary at restrained opacity.
 *
 * `adaptive_item`: avoids implying a fixed session length (CAT can grow/stop early). The bar uses
 * `adaptiveMaxItems` as a soft ceiling when provided; otherwise it falls back to `total` from the server.
 */
export function ExamProgressBar({
  current,
  total,
  answeredCount,
  variant = "fixed_session",
  sessionLabel,
  adaptiveMaxItems,
}: {
  current: number;
  total: number;
  /** Optional: how many questions have been answered/graded (for richer status). */
  answeredCount?: number;
  variant?: ExamProgressBarVariant;
  /** Left label override (e.g. pathway-aware "Adaptive session"). */
  sessionLabel?: string;
  /** Soft upper bound for fill + a11y when `variant === "adaptive_item"` (e.g. config catMaxQuestions). */
  adaptiveMaxItems?: number | null;
}) {
  const isAdaptive = variant === "adaptive_item";
  const denom =
    isAdaptive && adaptiveMaxItems != null && adaptiveMaxItems > 0
      ? adaptiveMaxItems
      : total > 0
        ? total
        : 1;
  const pct = denom > 0 ? Math.min(100, Math.max(0, (current / denom) * 100)) : 0;
  const remaining = total - (answeredCount ?? current - 1);
  const leftLabel = sessionLabel ?? (isAdaptive ? "Adaptive session" : "Session progress");
  const ariaAdaptive =
    isAdaptive && adaptiveMaxItems != null && adaptiveMaxItems > 0
      ? `${leftLabel}: item ${current}, up to ${adaptiveMaxItems} items (length is not fixed).`
      : isAdaptive
        ? `${leftLabel}: item ${current} (session length is not fixed).`
        : `Session progress ${current} of ${total}`;
  return (
    <div className="nn-exam-progress border-b border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-2.5">
      <div className="nn-marketing-caption mb-1.5 flex justify-between gap-3 font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
        <span>{leftLabel}</span>
        <div className="flex items-center gap-2 shrink-0">
          {!isAdaptive && answeredCount != null && answeredCount > 0 ? (
            <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2 py-0.5 text-[10px] font-semibold tabular-nums text-[var(--semantic-text-muted)]">
              {remaining} left
            </span>
          ) : null}
          <span className="tabular-nums text-[var(--semantic-text-primary)]">
            {isAdaptive ? (
              <>
                Item <span className="tabular-nums">{current}</span>
                {adaptiveMaxItems != null && adaptiveMaxItems > 0 ? (
                  <span className="ml-1 font-normal normal-case text-[10px] text-[var(--semantic-text-muted)]">
                    (≤{adaptiveMaxItems})
                  </span>
                ) : null}
              </>
            ) : (
              <>
                {current} / {total}
              </>
            )}
          </span>
        </div>
      </div>
      <div
        className="nn-progress-track-semantic nn-progress-track-semantic--md"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-label={ariaAdaptive}
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
