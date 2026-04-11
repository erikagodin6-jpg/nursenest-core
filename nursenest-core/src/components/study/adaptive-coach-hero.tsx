/**
 * AdaptiveCoachHero
 *
 * Top-of-page hero for the Adaptive Study Coach.
 * Combines: exam countdown + readiness score + pass forecast + 1-line interpretation.
 *
 * Surface: --surface-emphasis (the premium emphasis palette surface)
 *
 * This is a server component — no client state needed.
 */

import type { ReadinessResult } from "@/lib/learner/readiness-score";
import type { PassReadinessForecast } from "@/lib/study/pass-readiness-forecast";

const BAND_LABELS: Record<ReadinessResult["band"], string> = {
  insufficient_data: "Gathering Data",
  not_ready: "Building Foundation",
  improving: "Improving",
  near_ready: "Approaching Ready",
  ready: "Exam Ready",
};

const BAND_SURFACE: Record<ReadinessResult["band"], string> = {
  insufficient_data: "color-mix(in srgb, var(--semantic-border-soft) 30%, var(--semantic-surface))",
  not_ready: "color-mix(in srgb, var(--semantic-danger) 12%, var(--semantic-surface))",
  improving: "color-mix(in srgb, var(--semantic-warning) 12%, var(--semantic-surface))",
  near_ready: "color-mix(in srgb, var(--semantic-info) 12%, var(--semantic-surface))",
  ready: "color-mix(in srgb, var(--semantic-success) 12%, var(--semantic-surface))",
};

const BAND_ACCENT: Record<ReadinessResult["band"], string> = {
  insufficient_data: "var(--semantic-text-muted)",
  not_ready: "var(--semantic-danger)",
  improving: "var(--semantic-warning)",
  near_ready: "var(--semantic-info)",
  ready: "var(--semantic-success)",
};

function formatCountdown(days: number | null): string {
  if (days === null) return "No exam date set";
  if (days < 0) return "Exam date passed";
  if (days === 0) return "Exam today";
  if (days === 1) return "Exam tomorrow";
  if (days < 7) return `Exam in ${days} days`;
  const weeks = Math.round(days / 7);
  if (weeks === 1) return "Exam in 1 week";
  return `Exam in ${weeks} weeks (${days} days)`;
}

// ── Stat pill ─────────────────────────────────────────────────────────────────

function StatPill({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-2"
      style={{
        background: "color-mix(in srgb, var(--semantic-surface) 60%, transparent)",
        border: "1px solid color-mix(in srgb, var(--semantic-border-soft) 50%, transparent)",
      }}
    >
      <span className="text-lg font-extrabold tabular-nums" style={{ color: accent }}>
        {value}
      </span>
      <span
        className="text-[9px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--semantic-text-muted)" }}
      >
        {label}
      </span>
    </div>
  );
}

// ── AdaptiveCoachHero ─────────────────────────────────────────────────────────

export type AdaptiveCoachHeroProps = {
  readiness: ReadinessResult;
  passReadiness: PassReadinessForecast;
  daysUntilExam: number | null;
  examDatePlanType: string | null;
  streakDays: number;
  overallAccuracyPct: number | null;
};

export function AdaptiveCoachHero({
  readiness,
  passReadiness,
  daysUntilExam,
  examDatePlanType,
  streakDays,
  overallAccuracyPct,
}: AdaptiveCoachHeroProps) {
  const band = readiness.band;
  const bandLabel = BAND_LABELS[band];
  const bandSurface = BAND_SURFACE[band];
  const accent = BAND_ACCENT[band];
  const hasExamDate = daysUntilExam !== null && examDatePlanType !== "unsure";

  return (
    <div
      className="overflow-hidden rounded-2xl px-6 pt-6 pb-5 sm:px-8 sm:pt-8"
      style={{ background: "var(--surface-emphasis, var(--semantic-panel-cool))" }}
    >
      <div className="flex flex-col gap-6">
        {/* Top row: label + countdown badge */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--semantic-text-muted)" }}
          >
            Adaptive Study Coach
          </p>

          {/* Exam countdown badge */}
          <div
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              background: hasExamDate
                ? "color-mix(in srgb, var(--semantic-warning) 14%, var(--semantic-surface))"
                : "color-mix(in srgb, var(--semantic-border-soft) 30%, var(--semantic-surface))",
              color: hasExamDate ? "var(--semantic-warning)" : "var(--semantic-text-muted)",
              border: hasExamDate
                ? "1px solid color-mix(in srgb, var(--semantic-warning) 25%, transparent)"
                : "1px solid var(--semantic-border-soft)",
            }}
          >
            {formatCountdown(hasExamDate ? daysUntilExam : null)}
          </div>
        </div>

        {/* Main score row */}
        <div className="flex flex-wrap items-end gap-6">
          {/* Readiness score */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              {readiness.score !== null ? (
                <>
                  <span
                    className="text-5xl font-extrabold tabular-nums"
                    style={{ color: accent }}
                  >
                    {readiness.score}
                  </span>
                  <span
                    className="text-lg font-medium"
                    style={{ color: "var(--semantic-text-secondary)" }}
                  >
                    / 100
                  </span>
                </>
              ) : (
                <span
                  className="text-3xl font-bold"
                  style={{ color: "var(--semantic-text-muted)" }}
                >
                  —
                </span>
              )}
            </div>

            {/* Band badge */}
            <span
              className="inline-block rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{ background: bandSurface, color: accent }}
            >
              {bandLabel}
            </span>

            <p
              className="mt-1 max-w-sm text-xs leading-relaxed"
              style={{ color: "var(--semantic-text-secondary)" }}
            >
              {passReadiness.interpretation}
            </p>
          </div>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-2">
            {passReadiness.displayRange && (
              <StatPill
                label="Est. pass readiness"
                value={passReadiness.displayRange}
                accent={
                  passReadiness.band === "strong"
                    ? "var(--semantic-success)"
                    : passReadiness.band === "building"
                      ? "var(--semantic-info)"
                      : "var(--semantic-warning)"
                }
              />
            )}

            {streakDays > 0 && (
              <StatPill
                label="Study streak"
                value={`${streakDays}d`}
                accent="var(--semantic-brand)"
              />
            )}

            {overallAccuracyPct !== null && (
              <StatPill
                label="Accuracy"
                value={`${overallAccuracyPct}%`}
                accent={
                  overallAccuracyPct >= 75
                    ? "var(--semantic-success)"
                    : overallAccuracyPct >= 60
                      ? "var(--semantic-info)"
                      : "var(--semantic-warning)"
                }
              />
            )}
          </div>
        </div>

        {/* CTA row */}
        <div className="flex flex-wrap gap-2">
          <a
            href="/app/practice"
            className="rounded-xl px-4 py-2 text-xs font-bold transition-opacity hover:opacity-80"
            style={{
              background: accent,
              color: "var(--semantic-surface, white)",
            }}
          >
            Practice now
          </a>
          <a
            href="/app/review"
            className="rounded-xl px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-80"
            style={{
              background: "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))",
              color: "var(--semantic-brand)",
              border: "1px solid color-mix(in srgb, var(--semantic-brand) 20%, transparent)",
            }}
          >
            Review queue
          </a>
          <a
            href="/app/account/analytics"
            className="rounded-xl px-4 py-2 text-xs font-semibold transition-opacity hover:opacity-80"
            style={{
              background: "color-mix(in srgb, var(--semantic-border-soft) 30%, var(--semantic-surface))",
              color: "var(--semantic-text-secondary)",
              border: "1px solid var(--semantic-border-soft)",
            }}
          >
            Analytics
          </a>
        </div>
      </div>
    </div>
  );
}
