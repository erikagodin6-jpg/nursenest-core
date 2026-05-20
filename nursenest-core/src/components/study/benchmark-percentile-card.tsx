/**
 * BenchmarkPercentileCard
 *
 * Threshold-gated percentile display (per spec §10–11).
 *
 * Rules:
 *   - HIDDEN until cohort reaches BENCHMARK_THRESHOLD (100 users by default)
 *   - Shows neutral message before threshold
 *   - Displays percentile rank and comparison text after threshold
 *   - Never shown for stale or meaningless comparisons
 *   - Calm, clinical, premium — not flashy
 *
 * Surface: soft neutral / emphasis surface
 * Tone: serious and honest — no exaggerated claims
 */

import type { BenchmarkResult } from "@/lib/study/benchmark-data";
import { BENCHMARK_THRESHOLD } from "@/lib/study/benchmark-data";

// ── Percentile band helper ────────────────────────────────────────────────────

function percentileBand(pct: number): { label: string; accent: string } {
  if (pct >= 75) return { label: "Top quartile", accent: "var(--semantic-success)" };
  if (pct >= 50) return { label: "Above median", accent: "var(--semantic-info)" };
  if (pct >= 25) return { label: "Below median", accent: "var(--semantic-warning)" };
  return { label: "Bottom quartile", accent: "var(--semantic-danger)" };
}

// ── BenchmarkPercentileCard ───────────────────────────────────────────────────

export function BenchmarkPercentileCard({ benchmark }: { benchmark: BenchmarkResult }) {
  if (!benchmark.active) {
    /* Pre-threshold: neutral message */
    return (
      <div
        className="rounded-2xl px-5 py-4"
        style={{
          background:
            "color-mix(in srgb, var(--semantic-border-soft) 20%, var(--bg-page))",
          border: "1px solid var(--semantic-border-soft)",
        }}
      >
        <p
          className="mb-1 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          Comparative benchmarking
        </p>
        <p className="text-xs" style={{ color: "var(--semantic-text-muted)" }}>
          {benchmark.neutralMessage}
        </p>
        {benchmark.cohortSize > 0 && (
          <p
            className="mt-1 text-[10px]"
            style={{ color: "var(--semantic-text-muted)" }}
          >
            {benchmark.cohortSize} of {BENCHMARK_THRESHOLD} qualifying learners reached.
          </p>
        )}
      </div>
    );
  }

  /* Active benchmarking */
  const pct = benchmark.percentileRank!;
  const band = percentileBand(pct);

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background:
          "color-mix(in srgb, var(--semantic-brand) 5%, var(--bg-page))",
        border:
          "1px solid color-mix(in srgb, var(--semantic-brand) 18%, transparent)",
      }}
    >
      <div className="px-5 py-5">
        <p
          className="mb-3 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          Comparative benchmarking
        </p>

        <div className="flex items-end gap-4">
          {/* Percentile number */}
          <div className="space-y-0.5">
            <span
              className="text-4xl font-extrabold tabular-nums"
              style={{ color: band.accent }}
            >
              {pct}
              <span className="text-xl">th</span>
            </span>
            <p
              className="text-xs font-semibold"
              style={{ color: band.accent }}
            >
              {band.label}
            </p>
          </div>

          {/* Bar */}
          <div className="flex-1 pb-1">
            <div
              className="h-2 w-full overflow-hidden rounded-full"
              style={{
                background:
                  "color-mix(in srgb, var(--semantic-border-soft) 50%, transparent)",
              }}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={1}
              aria-valuemax={99}
              aria-label={`${pct}th percentile`}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: band.accent }}
              />
            </div>
            <p
              className="mt-1 text-right text-[9px]"
              style={{ color: "var(--semantic-text-muted)" }}
            >
              vs. {benchmark.cohortSize.toLocaleString()} comparable learners
            </p>
          </div>
        </div>

        {benchmark.comparisonText && (
          <p
            className="mt-3 text-xs leading-relaxed"
            style={{ color: "var(--semantic-text-secondary)" }}
          >
            {benchmark.comparisonText}
          </p>
        )}
      </div>

      <div
        className="px-5 py-3"
        style={{
          borderTop:
            "1px solid color-mix(in srgb, var(--semantic-brand) 12%, transparent)",
        }}
      >
        <p
          className="text-[10px] italic"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          Percentile reflects recent performance among same-tier learners with sufficient practice history.
        </p>
      </div>
    </div>
  );
}
