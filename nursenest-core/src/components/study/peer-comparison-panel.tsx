/**
 * PeerComparisonPanel
 *
 * Unified peer comparison UI for all learner contexts (CAT, practice test,
 * question bank, overall readiness). Handles three states elegantly:
 *
 *   "active"      → Full percentile display with progress bar and copy.
 *   "building"    → Neutral dormant message; optional cohort progress indicator.
 *   "unavailable" → Compact single-line note; never shown prominently.
 *
 * Design principles:
 *   - Professional, clinical, understated — not gamified
 *   - Context-aware copy and visual weight
 *   - Pre-threshold state never implies fake data
 *   - All colors via CSS custom properties (fully theme-adaptive)
 *   - Accessible: ARIA labels, roles, reduced-motion friendly
 *
 * Server Component — data pre-loaded upstream.
 */

import { BarChart3, Users, Clock } from "lucide-react";
import type {
  PeerComparisonResult,
  PeerComparisonContext,
} from "@/lib/study/benchmarking/peer-comparison-service";
import { PEER_THRESHOLD } from "@/lib/study/benchmarking/peer-comparison-service";

// ── Context display strings ───────────────────────────────────────────────────

function contextHeading(context: PeerComparisonContext, scoreType: "accuracy" | "readiness_score"): string {
  switch (context) {
    case "cat_exam":
      return scoreType === "readiness_score" ? "CAT Readiness Benchmark" : "CAT Performance Benchmark";
    case "practice_test":
      return "Practice Test Benchmark";
    case "question_bank":
      return "Question Bank Comparison";
    case "readiness_overall":
      return "Readiness Comparison";
  }
}

function contextSubtitle(context: PeerComparisonContext): string {
  switch (context) {
    case "cat_exam":
      return "How your adaptive exam readiness compares to learners with similar preparation.";
    case "practice_test":
      return "How your practice accuracy compares to learners on the same pathway.";
    case "question_bank":
      return "How your question bank accuracy compares to learners with similar question volume.";
    case "readiness_overall":
      return "How your overall preparation compares to learners on the same pathway.";
  }
}

function scoreTypeLabel(scoreType: "accuracy" | "readiness_score"): string {
  return scoreType === "readiness_score" ? "readiness score" : "accuracy";
}

// ── Percentile band styling ───────────────────────────────────────────────────

function percentileBandStyle(pct: number): {
  accent: string;
  surface: string;
  border: string;
  barFillClass: string;
} {
  if (pct >= 75) {
    return {
      accent: "var(--semantic-success, #22c55e)",
      surface: "color-mix(in srgb, var(--semantic-success) 6%, var(--bg-card))",
      border: "color-mix(in srgb, var(--semantic-success) 20%, var(--border-subtle))",
      barFillClass: "nn-progress-fill-semantic-success",
    };
  }
  if (pct >= 50) {
    return {
      accent: "var(--semantic-info, #76b6c4)",
      surface: "color-mix(in srgb, var(--semantic-info) 6%, var(--bg-card))",
      border: "color-mix(in srgb, var(--semantic-info) 20%, var(--border-subtle))",
      barFillClass: "nn-progress-fill-semantic-info",
    };
  }
  if (pct >= 25) {
    return {
      accent: "var(--semantic-warning, #d97706)",
      surface: "color-mix(in srgb, var(--semantic-warning) 6%, var(--bg-card))",
      border: "color-mix(in srgb, var(--semantic-warning) 18%, var(--border-subtle))",
      barFillClass: "nn-progress-fill-semantic-warning",
    };
  }
  return {
    accent: "var(--semantic-danger, #e11d48)",
    surface: "color-mix(in srgb, var(--semantic-danger) 5%, var(--bg-card))",
    border: "color-mix(in srgb, var(--semantic-danger) 16%, var(--border-subtle))",
    barFillClass: "nn-progress-fill-semantic-danger",
  };
}

// ── Cohort dimension badge ────────────────────────────────────────────────────

function CohortDimensionBadge({
  dimension,
}: {
  dimension: PeerComparisonResult["cohortDimension"];
}) {
  const label: Record<typeof dimension, string> = {
    pathway_exam_type: "Exam-specific cohort",
    pathway:           "Pathway cohort",
    tier:              "Tier cohort",
    global:            "All learners",
  };
  const color =
    dimension === "pathway_exam_type"
      ? "var(--semantic-success)"
      : dimension === "pathway"
      ? "var(--semantic-info)"
      : "var(--semantic-text-muted)";

  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{
        background: `color-mix(in srgb, ${color} 10%, var(--bg-card))`,
        border: `1px solid color-mix(in srgb, ${color} 20%, var(--border-subtle))`,
        color,
      }}
    >
      {label[dimension]}
    </span>
  );
}

// ── Active: full percentile display ──────────────────────────────────────────

function ActivePanel({ result }: { result: PeerComparisonResult }) {
  const pct = result.percentileRank!;
  const style = percentileBandStyle(pct);
  const heading = contextHeading(result.context, result.scoreType);
  const subtitle = contextSubtitle(result.context);

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{ background: style.surface, border: `1px solid ${style.border}` }}
      role="region"
      aria-label={`${heading}: ${pct}th percentile`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 px-5 pt-5 pb-0">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{
            background: `color-mix(in srgb, ${style.accent} 12%, var(--bg-card))`,
          }}
          aria-hidden="true"
        >
          <BarChart3
            className="h-4 w-4"
            style={{ color: style.accent }}
            strokeWidth={1.75}
          />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className="text-sm font-bold tracking-tight"
              style={{ color: "var(--theme-heading-text, var(--foreground))" }}
            >
              {heading}
            </h3>
            <CohortDimensionBadge dimension={result.cohortDimension} />
          </div>
          <p
            className="mt-0.5 text-xs leading-relaxed"
            style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
          >
            {subtitle}
          </p>
        </div>
      </div>

      {/* Percentile display */}
      <div className="px-5 py-5">
        <div className="flex items-end gap-5">
          {/* Large percentile number */}
          <div className="shrink-0">
            <div className="flex items-baseline gap-0.5">
              <span
                className="text-4xl font-extrabold tabular-nums leading-none"
                style={{ color: style.accent }}
              >
                {pct}
              </span>
              <span
                className="text-lg font-bold"
                style={{ color: style.accent }}
              >
                th
              </span>
            </div>
            <p
              className="mt-1 text-[11px] font-bold uppercase tracking-[0.07em]"
              style={{ color: style.accent }}
            >
              {result.percentileLabel}
            </p>
          </div>

          {/* Percentile bar */}
          <div className="flex flex-1 flex-col gap-2 pb-1">
            <div
              className="nn-progress-track-semantic"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={1}
              aria-valuemax={99}
              aria-label={`${pct}th percentile`}
            >
              <div
                className={`h-full rounded-full ${style.barFillClass} nn-progress-fill-reveal transition-[width] duration-700 ease-out`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px]" style={{ color: "var(--semantic-text-muted)" }}>
              <span>0</span>
              <span>50th</span>
              <span>99th</span>
            </div>
          </div>
        </div>

        {/* Comparison text */}
        {result.comparisonText ? (
          <p
            className="mt-3 text-sm leading-relaxed"
            style={{ color: "var(--semantic-text-secondary, var(--muted-foreground))" }}
          >
            {result.comparisonText}
          </p>
        ) : null}
      </div>

      {/* Footer: cohort info + methodology note */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3"
        style={{
          borderColor: `color-mix(in srgb, ${style.accent} 14%, var(--border-subtle))`,
          background: `color-mix(in srgb, ${style.accent} 3%, var(--bg-card))`,
        }}
      >
        <div className="flex items-center gap-1.5">
          <Users
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: "var(--semantic-text-muted)" }}
            aria-hidden="true"
            strokeWidth={1.75}
          />
          <p
            className="text-[11px]"
            style={{ color: "var(--semantic-text-muted)" }}
          >
            Based on {result.cohortSize.toLocaleString()} {result.cohortLabel} with recent activity.
          </p>
        </div>
        <p
          className="text-[10px] italic"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          {scoreTypeLabel(result.scoreType)} comparison · last 180 days
        </p>
      </div>
    </div>
  );
}

// ── Building: pre-threshold neutral state ─────────────────────────────────────

function BuildingPanel({ result }: { result: PeerComparisonResult }) {
  const heading = contextHeading(result.context, result.scoreType);
  const progress = result.cohortSize > 0
    ? Math.min(99, Math.round((result.cohortSize / PEER_THRESHOLD) * 100))
    : 0;

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background:
          "color-mix(in srgb, var(--semantic-border-soft) 15%, var(--bg-card))",
        border: "1px solid var(--semantic-border-soft, var(--border-subtle))",
      }}
      role="region"
      aria-label={`${heading}: benchmarking not yet available`}
    >
      <div className="flex items-start gap-3 px-5 py-4">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
          style={{
            background:
              "color-mix(in srgb, var(--semantic-brand) 8%, var(--bg-card))",
          }}
          aria-hidden="true"
        >
          <Clock
            className="h-4 w-4"
            style={{ color: "var(--semantic-text-muted)" }}
            strokeWidth={1.75}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className="text-sm font-semibold tracking-tight"
            style={{ color: "var(--theme-heading-text, var(--foreground))" }}
          >
            {heading}
          </h3>
          <p
            className="mt-1 text-xs leading-relaxed"
            style={{ color: "var(--semantic-text-muted)" }}
          >
            {result.neutralMessage}
          </p>

          {/* Cohort progress bar — only shown when some data is accumulating */}
          {result.cohortSize > 0 ? (
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-[10px]" style={{ color: "var(--semantic-text-muted)" }}>
                <span>Cohort progress</span>
                <span className="tabular-nums font-medium">
                  {result.cohortSize.toLocaleString()} / {PEER_THRESHOLD}
                </span>
              </div>
              <div
                className="h-1.5 w-full overflow-hidden rounded-full"
                style={{
                  background:
                    "color-mix(in srgb, var(--semantic-border-soft) 50%, var(--bg-card))",
                }}
                role="progressbar"
                aria-valuenow={result.cohortSize}
                aria-valuemin={0}
                aria-valuemax={PEER_THRESHOLD}
                aria-label={`${result.cohortSize} of ${PEER_THRESHOLD} qualifying learners`}
              >
                <div
                  className="h-full rounded-full nn-progress-fill-semantic-brand nn-progress-fill-reveal transition-[width] duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ── Unavailable: compact inline note ─────────────────────────────────────────

function UnavailablePanel({ result }: { result: PeerComparisonResult }) {
  const heading = contextHeading(result.context, result.scoreType);
  return (
    <p
      className="flex items-center gap-1.5 text-xs"
      style={{ color: "var(--semantic-text-muted)" }}
      role="note"
      aria-label={`${heading}: not available`}
    >
      <BarChart3 className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
      {result.neutralMessage}
    </p>
  );
}

// ── PeerComparisonPanel ───────────────────────────────────────────────────────

export interface PeerComparisonPanelProps {
  result: PeerComparisonResult | null;
  /**
   * "full"    → full card with header, bar, footer (default for report card / readiness)
   * "compact" → single-section, no footer (for inline results, sidebar)
   * "inline"  → just the text for pre-threshold, or compact bar for active (list rows)
   */
  variant?: "full" | "compact" | "inline";
}

export function PeerComparisonPanel({
  result,
  variant = "full",
}: PeerComparisonPanelProps) {
  if (!result) return null;

  if (result.activationState === "unavailable") {
    if (variant === "full" || variant === "compact") return null;
    return <UnavailablePanel result={result} />;
  }

  if (result.activationState === "building") {
    if (variant === "inline") return <UnavailablePanel result={result} />;
    return <BuildingPanel result={result} />;
  }

  // active
  if (variant === "inline") {
    // Compact inline: just the percentile label and comparison text
    const pct = result.percentileRank!;
    const style = percentileBandStyle(pct);
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs font-semibold"
        style={{ color: style.accent }}
        aria-label={`${pct}th percentile among ${result.cohortLabel}`}
      >
        <BarChart3 className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        {result.percentileLabel} among {result.cohortLabel}
      </span>
    );
  }

  return <ActivePanel result={result} />;
}
