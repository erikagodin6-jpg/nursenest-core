/**
 * PracticeBenchmarkBlock
 *
 * Compact benchmark surface for practice test results and CAT report cards.
 *
 * Behavior:
 *   - If benchmark is active: shows percentile rank + comparison text
 *   - If not active: shows BenchmarkStatusNotice (neutral, no percentile)
 *
 * Design:
 *   - mode="practice" → softer brand tint, relaxed
 *   - mode="cat"      → slightly more structured, exam-like
 *   - Never gamified. Never a leaderboard.
 *   - Uses semantic CSS variables only — fully theme-aware.
 */

import { BarChart3, Users } from "lucide-react";
import type { BenchmarkServiceResult } from "@/lib/study/benchmarking/benchmark-service";
import { BenchmarkStatusNotice } from "./benchmark-status-notice";

type Props = {
  benchmark: BenchmarkServiceResult;
  /** Visual mode adapts tone and weight to context. */
  mode?: "practice" | "cat";
};

function PercentileBand({ pct }: { pct: number }) {
  if (pct >= 90) return "Top 10%";
  if (pct >= 75) return "Top 25%";
  if (pct >= 50) return "Above median";
  if (pct >= 25) return "Building";
  return "Getting started";
}

export function PracticeBenchmarkBlock({ benchmark, mode = "practice" }: Props) {
  const isCat = mode === "cat";

  return (
    <div
      className={[
        "rounded-2xl border shadow-sm",
        isCat
          ? "border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_5%,var(--semantic-surface))] px-5 py-5"
          : "border-[color-mix(in_srgb,var(--semantic-brand)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_4%,var(--semantic-surface))] px-5 py-5",
      ].join(" ")}
      aria-label="Peer benchmark comparison"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div
          className={[
            "flex h-8 w-8 items-center justify-center rounded-lg",
            isCat
              ? "bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))]"
              : "bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))]",
          ].join(" ")}
          aria-hidden
        >
          <BarChart3
            className={[
              "h-4 w-4",
              isCat ? "text-[var(--semantic-info)]" : "text-[var(--semantic-brand)]",
            ].join(" ")}
            strokeWidth={1.75}
          />
        </div>
        <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">
          {isCat ? "Exam Benchmark" : "How You Compare"}
        </h3>
      </div>

      {/* Content */}
      <div className="mt-3">
        {benchmark.active && benchmark.percentileRank != null ? (
          <div className="space-y-2">
            {/* Percentile display */}
            <div className="flex items-baseline gap-2">
              <span
                className={[
                  "text-2xl font-bold tabular-nums",
                  isCat
                    ? "text-[var(--semantic-info)]"
                    : "text-[var(--semantic-brand)]",
                ].join(" ")}
              >
                {benchmark.percentileRank}
                <span className="text-base font-semibold">%</span>
              </span>
              <span className="text-xs font-medium text-[var(--semantic-text-muted)]">
                percentile ·{" "}
                <PercentileBand pct={benchmark.percentileRank} />
              </span>
            </div>

            {/* Comparison text */}
            {benchmark.comparisonText && (
              <p className="text-[0.8125rem] leading-relaxed text-[var(--semantic-text-secondary)]">
                {benchmark.comparisonText}
              </p>
            )}

            {/* Cohort info */}
            <div className="flex items-center gap-1.5 pt-1">
              <Users
                className="h-3.5 w-3.5 text-[var(--semantic-text-muted)]"
                aria-hidden
                strokeWidth={1.75}
              />
              <p className="text-xs text-[var(--semantic-text-muted)]">
                Based on {benchmark.cohortSize.toLocaleString()}{" "}
                {benchmark.cohortLabel} with recent activity.
              </p>
            </div>
          </div>
        ) : (
          <div className="pt-1">
            <BenchmarkStatusNotice
              message={benchmark.neutralMessage}
              variant="inline"
            />
            {benchmark.cohortSize > 0 && benchmark.cohortSize < benchmark.threshold && (
              <p className="mt-1.5 text-xs text-[var(--semantic-text-muted)]">
                Current cohort: {benchmark.cohortSize.toLocaleString()} learner
                {benchmark.cohortSize !== 1 ? "s" : ""} ({benchmark.threshold} required).
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
