"use client";

import type { ConfidencePatternSummary, ConfidenceScatterPoint } from "@/lib/study/analytics-data";
import { ConfidenceDistributionBar } from "@/components/study/confidence-patterns-panel";
import { ConfidenceScatterChart } from "@/components/study/confidence-scatter-chart";

/**
 * Right column of the analytics hero row: scatter + distribution + compact cognitive stats.
 * Pairs with `QuestionTypePerformancePanel` (legacy two-up analytics layout).
 */
export function ConfidenceVsPerformancePanel({
  patterns,
  scatterPoints,
  loaded,
}: {
  patterns: ConfidencePatternSummary;
  scatterPoints: ConfidenceScatterPoint[];
  /** When false, show skeleton for scatter-dependent copy. */
  loaded: boolean;
}) {
  const hasPatterns = patterns.totalRated > 0;

  return (
    <section
      className="flex h-full flex-col rounded-2xl border p-5 sm:p-6"
      style={{
        background: "var(--surface-soft-b, var(--semantic-panel-warm))",
        borderColor: "var(--semantic-border-soft)",
        boxShadow: "0 1px 0 color-mix(in srgb, var(--semantic-border-soft) 80%, transparent)",
      }}
    >
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">Confidence vs. performance</h2>
        {hasPatterns && loaded ? (
          <span className="text-xs text-[var(--semantic-text-muted)]">
            {patterns.totalRated.toLocaleString()} rated · {patterns.sessionsAnalyzed} session
            {patterns.sessionsAnalyzed !== 1 ? "s" : ""}
          </span>
        ) : null}
      </div>

      {!loaded ? (
        <div className="min-h-[240px] animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--semantic-border-soft)_35%,var(--semantic-surface))]" aria-hidden />
      ) : !hasPatterns ? (
        <p className="text-sm text-[var(--semantic-text-muted)]">
          Use the confidence selector during practice to see how your self-rating aligns with outcomes.
        </p>
      ) : (
        <div className="flex flex-1 flex-col gap-4">
          <ConfidenceScatterChart points={scatterPoints} />
          <ConfidenceDistributionBar patterns={patterns} />
          <div className="grid grid-cols-3 gap-2 text-center">
            <div
              className="rounded-xl border px-2 py-2"
              style={{
                borderColor: "color-mix(in srgb, var(--semantic-danger) 28%, var(--semantic-border-soft))",
                background: "color-mix(in srgb, var(--semantic-danger) 8%, var(--semantic-surface))",
              }}
            >
              <p className="text-[0.6rem] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Risk</p>
              <p className="text-lg font-extrabold tabular-nums text-[var(--semantic-danger)]">
                {patterns.overconfidentErrors}
              </p>
              <p className="text-[0.6rem] leading-tight text-[var(--semantic-text-secondary)]">High conf. · wrong</p>
            </div>
            <div
              className="rounded-xl border px-2 py-2"
              style={{
                borderColor: "color-mix(in srgb, var(--semantic-info) 28%, var(--semantic-border-soft))",
                background: "color-mix(in srgb, var(--semantic-info) 8%, var(--semantic-surface))",
              }}
            >
              <p className="text-[0.6rem] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Build</p>
              <p className="text-lg font-extrabold tabular-nums text-[var(--semantic-info-contrast,var(--semantic-info))]">
                {patterns.uncertainCorrect}
              </p>
              <p className="text-[0.6rem] leading-tight text-[var(--semantic-text-secondary)]">Low conf. · right</p>
            </div>
            <div
              className="rounded-xl border px-2 py-2"
              style={{
                borderColor: "color-mix(in srgb, var(--semantic-success) 28%, var(--semantic-border-soft))",
                background: "color-mix(in srgb, var(--semantic-success) 8%, var(--semantic-surface))",
              }}
            >
              <p className="text-[0.6rem] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">Solid</p>
              <p className="text-lg font-extrabold tabular-nums text-[var(--semantic-success)]">{patterns.stableMastery}</p>
              <p className="text-[0.6rem] leading-tight text-[var(--semantic-text-secondary)]">High conf. · right</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
