"use client";

import type { ConfidencePatternSummary, ConfidenceScatterPoint } from "@/lib/study/analytics-data";
import type { AnalyticsLoadResult } from "@/lib/study/analytics-load-result";
import { analyticsResolvedData } from "@/lib/study/analytics-load-result";
import { ConfidenceDistributionBar } from "@/components/study/confidence-patterns-panel";
import { ConfidenceScatterChart } from "@/components/study/confidence-scatter-chart";

/**
 * Right column of the analytics hero row: scatter + distribution + compact cognitive stats.
 * Pairs with `QuestionTypePerformancePanel`.
 */
export function ConfidenceVsPerformancePanel({
  patterns,
  scatterPoints,
}: {
  patterns: AnalyticsLoadResult<ConfidencePatternSummary> | null;
  scatterPoints: AnalyticsLoadResult<ConfidenceScatterPoint[]>;
}) {
  if (patterns === null) {
    return (
      <section
        className="flex h-full min-h-[280px] flex-col rounded-2xl border p-5 sm:p-6"
        style={{
          background: "var(--surface-soft-b, var(--semantic-panel-warm))",
          borderColor: "var(--semantic-border-soft)",
          boxShadow: "0 1px 0 color-mix(in srgb, var(--semantic-border-soft) 80%, transparent)",
        }}
        data-testid="confidence-vs-performance-loading"
      >
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">Confidence vs. performance</h2>
            <p className="mt-0.5 text-xs text-[var(--semantic-text-muted)]">Mastery quadrant analysis</p>
          </div>
        </div>
        <div
          className="min-h-[240px] flex-1 animate-pulse rounded-xl"
          style={{ background: "color-mix(in_srgb,var(--semantic-border-soft)_35%,var(--semantic-surface))" }}
          aria-hidden
        />
        <span className="sr-only">Loading confidence analysis…</span>
      </section>
    );
  }

  if (patterns.kind === "error") {
    return (
      <section
        className="flex h-full flex-col rounded-2xl border p-5 sm:p-6"
        style={{
          background: "var(--surface-soft-b, var(--semantic-panel-warm))",
          borderColor: "var(--semantic-border-soft)",
          boxShadow: "0 1px 0 color-mix(in srgb, var(--semantic-border-soft) 80%, transparent)",
        }}
        data-testid="confidence-vs-performance-error"
      >
        <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">Confidence vs. performance</h2>
        <p className="mt-2 text-sm text-[var(--semantic-danger)]">
          Could not load confidence patterns ({patterns.reason}). This is a load failure — not the same as skipping
          confidence ratings.
        </p>
      </section>
    );
  }

  if (patterns.kind === "empty") {
    return (
      <section
        className="flex h-full flex-col rounded-2xl border p-5 sm:p-6"
        style={{
          background: "var(--surface-soft-b, var(--semantic-panel-warm))",
          borderColor: "var(--semantic-border-soft)",
          boxShadow: "0 1px 0 color-mix(in srgb, var(--semantic-border-soft) 80%, transparent)",
        }}
        data-testid="confidence-vs-performance-empty"
      >
        <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">Confidence vs. performance</h2>
        <p className="mt-2 text-sm text-[var(--semantic-text-muted)]">
          Use the confidence selector during practice to see how your self-rating aligns with outcomes.
        </p>
      </section>
    );
  }

  const pat = analyticsResolvedData(patterns)!;
  const patternsDegradedReason = patterns.kind === "degraded" ? patterns.reason : null;
  const hasPatterns = pat.totalRated > 0;

  const scatterErr = scatterPoints.kind === "error" ? scatterPoints.reason : null;
  const scatterDegradedReason = scatterPoints.kind === "degraded" ? scatterPoints.reason : null;
  const scatterRows = analyticsResolvedData(scatterPoints) ?? [];

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
        <div>
          <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">Confidence vs. performance</h2>
          <p className="mt-0.5 text-xs text-[var(--semantic-text-muted)]">Mastery quadrant analysis</p>
        </div>
        {hasPatterns ? (
          <span className="text-xs text-[var(--semantic-text-muted)]">
            {pat.totalRated.toLocaleString()} rated · {pat.sessionsAnalyzed} session
            {pat.sessionsAnalyzed !== 1 ? "s" : ""}
          </span>
        ) : null}
      </div>

      {patternsDegradedReason ? (
        <p
          className="mb-2 text-xs font-semibold text-[var(--semantic-warning)]"
          data-testid="confidence-patterns-degraded"
        >
          <span className="uppercase tracking-wide">Degraded</span> — {patternsDegradedReason}
        </p>
      ) : null}

      {!hasPatterns ? (
        <p className="text-sm text-[var(--semantic-text-muted)]">
          Use the confidence selector during practice to see how your self-rating aligns with outcomes.
        </p>
      ) : (
        <div className="flex flex-1 flex-col gap-4">
          {scatterErr ? (
            <p
              className="rounded-xl border px-3 py-2 text-sm text-[var(--semantic-danger)]"
              style={{
                borderColor: "color-mix(in srgb, var(--semantic-danger) 28%, var(--semantic-border-soft))",
                background: "color-mix(in srgb, var(--semantic-danger) 6%, var(--semantic-surface))",
              }}
              data-testid="confidence-scatter-error"
            >
              Scatter chart unavailable ({scatterErr}). Distribution below may still reflect loaded sessions.
            </p>
          ) : (
            <>
              {scatterDegradedReason ? (
                <p className="text-xs font-semibold text-[var(--semantic-warning)]" data-testid="confidence-scatter-degraded">
                  <span className="uppercase tracking-wide">Degraded</span> — {scatterDegradedReason}
                </p>
              ) : null}
              <ConfidenceScatterChart points={scatterRows} />
            </>
          )}
          <ConfidenceDistributionBar patterns={pat} />
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
                {pat.overconfidentErrors}
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
                {pat.uncertainCorrect}
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
              <p className="text-lg font-extrabold tabular-nums text-[var(--semantic-success)]">{pat.stableMastery}</p>
              <p className="text-[0.6rem] leading-tight text-[var(--semantic-text-secondary)]">High conf. · right</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
