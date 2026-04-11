import Link from "next/link";
import { BAND_LABELS, BAND_HELPER } from "./cat-readiness-hero";
import type { ReadinessBand } from "./cat-readiness-hero";

/**
 * AnalyticsHero — full-width emphasis surface hero for the analytics page.
 *
 * Shows: readiness band + interpretation, total sessions, streak, and CTA row.
 * Uses --surface-emphasis as the primary surface.
 */
export function AnalyticsHero({
  latestReadinessScore,
  latestReadinessBand,
  streakDays,
  studySessionCount,
  catSessionCount,
}: {
  latestReadinessScore: number | null;
  latestReadinessBand: ReadinessBand | null;
  streakDays: number;
  studySessionCount: number;
  catSessionCount: number;
}) {
  const band = latestReadinessBand;
  const score = latestReadinessScore;
  const hasData = score !== null && band !== null;

  return (
    <div
      className="rounded-2xl border border-[var(--semantic-border-soft)] px-6 py-8 shadow-[var(--semantic-shadow-soft)] sm:px-8"
      style={{ background: "var(--surface-emphasis, var(--semantic-panel-cool))" }}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: score + band */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--semantic-text-muted)]">
            Analytics Overview
          </p>
          {hasData ? (
            <>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-extrabold tabular-nums text-[var(--semantic-text-primary)]">
                  {score}%
                </span>
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide"
                  style={{
                    background:
                      "color-mix(in srgb, var(--semantic-brand) 15%, var(--semantic-surface))",
                    color: "var(--semantic-brand)",
                    border: "1px solid color-mix(in srgb, var(--semantic-brand) 30%, transparent)",
                  }}
                >
                  {BAND_LABELS[band]}
                </span>
              </div>
              <p className="max-w-md text-sm text-[var(--semantic-text-secondary)]">
                {BAND_HELPER[band]}
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-[var(--semantic-text-primary)]">
                No CAT sessions yet
              </p>
              <p className="max-w-md text-sm text-[var(--semantic-text-secondary)]">
                Complete your first CAT to unlock readiness scoring, trend tracking, and cognitive pattern analysis.
              </p>
            </>
          )}
        </div>

        {/* Right: stat chips */}
        <div className="flex flex-wrap gap-3">
          <AnalyticsStatChip label="Study sessions" value={studySessionCount} />
          <AnalyticsStatChip label="CAT sessions" value={catSessionCount} />
          <AnalyticsStatChip
            label={`Day${streakDays !== 1 ? "s" : ""} streak`}
            value={streakDays}
            accent={streakDays >= 7 ? "success" : streakDays >= 3 ? "info" : "neutral"}
          />
        </div>
      </div>

      {/* CTA row */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/app/practice-tests"
          className="nn-btn-primary inline-flex min-h-[2.5rem] items-center rounded-lg px-5 text-sm font-semibold shadow-none"
        >
          Take a CAT
        </Link>
        <Link
          href="/app/review"
          className="nn-btn-secondary inline-flex min-h-[2.5rem] items-center rounded-lg px-5 text-sm font-semibold"
        >
          Review Queue
        </Link>
        <Link
          href="/app/account/report-card"
          className="nn-btn-secondary inline-flex min-h-[2.5rem] items-center rounded-lg px-5 text-sm font-semibold"
        >
          Full Report Card
        </Link>
      </div>
    </div>
  );
}

function AnalyticsStatChip({
  label,
  value,
  accent = "neutral",
}: {
  label: string;
  value: number;
  accent?: "success" | "info" | "neutral";
}) {
  const colorMap = {
    success: {
      bg: "color-mix(in srgb, var(--semantic-success) 12%, var(--semantic-surface))",
      text: "var(--semantic-success)",
      border: "color-mix(in srgb, var(--semantic-success) 30%, transparent)",
    },
    info: {
      bg: "color-mix(in srgb, var(--semantic-info) 12%, var(--semantic-surface))",
      text: "var(--semantic-info-contrast, var(--semantic-info))",
      border: "color-mix(in srgb, var(--semantic-info) 30%, transparent)",
    },
    neutral: {
      bg: "color-mix(in srgb, var(--semantic-text-muted) 8%, var(--semantic-surface))",
      text: "var(--semantic-text-secondary)",
      border: "var(--semantic-border-soft)",
    },
  };
  const c = colorMap[accent];

  return (
    <div
      className="flex flex-col items-center rounded-xl px-4 py-2.5 text-center"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
      }}
    >
      <span
        className="text-xl font-bold tabular-nums"
        style={{ color: c.text }}
      >
        {value.toLocaleString()}
      </span>
      <span className="text-[0.65rem] font-medium uppercase tracking-wider text-[var(--semantic-text-muted)]">
        {label}
      </span>
    </div>
  );
}
