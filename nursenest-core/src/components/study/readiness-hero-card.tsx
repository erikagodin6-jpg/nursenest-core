/**
 * ReadinessHeroCard
 *
 * Premium hero for the readiness dashboard.
 * Combines the animated SVG ring gauge, readiness score, trend sparkline,
 * percentile badge, and key stat row into a single visually coherent card.
 *
 * Layout (desktop): gauge left | score + trend right | stat strip below
 * Layout (mobile):  score + gauge stacked | trend | stat strip
 *
 * Uses the existing StudyReadinessGauge (animated ring) and builds a new
 * sparkline inline using the catTrend data from the dashboard loader.
 *
 * Server Component — no client state needed.
 */

import { StudyReadinessGauge } from "@/components/study/study-readiness-gauge";
import type { ReadinessBand } from "@/lib/learner/readiness-score";
import type { BenchmarkData } from "@/lib/learner/benchmark-engine";
import type { CatTrendPoint } from "@/lib/learner/readiness-dashboard-data";

// ── Band helpers ──────────────────────────────────────────────────────────────

type GaugeBand = "insufficient" | "early" | "building" | "strong";

function toGaugeBand(band: ReadinessBand): GaugeBand {
  switch (band) {
    case "ready":          return "strong";
    case "near_ready":     return "building";
    case "improving":      return "early";
    default:               return "insufficient";
  }
}

function bandAccent(band: ReadinessBand): string {
  switch (band) {
    case "ready":          return "var(--semantic-success, #22c55e)";
    case "near_ready":     return "var(--semantic-brand, #1da2d8)";
    case "improving":      return "var(--semantic-warning, #d97706)";
    default:               return "var(--semantic-text-muted, #8fa8b8)";
  }
}

function bandLabel(band: ReadinessBand): string {
  switch (band) {
    case "ready":          return "Exam Ready";
    case "near_ready":     return "Near Ready";
    case "improving":      return "Building";
    case "not_ready":      return "Early Stage";
    default:               return "Getting Started";
  }
}

function bandSurface(band: ReadinessBand): string {
  switch (band) {
    case "ready":     return "color-mix(in srgb, var(--semantic-success) 7%, var(--bg-card, var(--theme-card-bg)))";
    case "near_ready": return "color-mix(in srgb, var(--semantic-brand) 7%, var(--bg-card, var(--theme-card-bg)))";
    case "improving": return "color-mix(in srgb, var(--semantic-warning) 7%, var(--bg-card, var(--theme-card-bg)))";
    default:          return "var(--surface-soft-a, var(--bg-card, var(--theme-card-bg)))";
  }
}

// ── Trend sparkline ───────────────────────────────────────────────────────────

function TrendSparkline({
  points,
  accent,
}: {
  points: CatTrendPoint[];
  accent: string;
}) {
  if (points.length < 2) return null;

  const W = 120;
  const H = 32;
  const PAD = 3;

  const scores = points.map((p) => p.score);
  const minS = Math.max(0, Math.min(...scores) - 8);
  const maxS = Math.min(100, Math.max(...scores) + 8);
  const range = Math.max(maxS - minS, 12);

  const coords = points.map((p, i) => {
    const x = PAD + (i / (points.length - 1)) * (W - PAD * 2);
    const y = PAD + (1 - (p.score - minS) / range) * (H - PAD * 2);
    return [x, y] as [number, number];
  });

  const pathD = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");

  const [lastX, lastY] = coords[coords.length - 1]!;

  const delta =
    points.length >= 2
      ? points[points.length - 1]!.score - points[0]!.score
      : 0;
  const trendColor =
    delta > 2
      ? "var(--semantic-success, #22c55e)"
      : delta < -2
      ? "var(--semantic-danger, #ef4444)"
      : "var(--semantic-text-muted, #8fa8b8)";

  return (
    <div className="flex flex-col gap-1">
      <p
        className="text-[10px] font-bold uppercase tracking-[0.1em]"
        style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
      >
        Score trend
      </p>
      <div className="flex items-center gap-2">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          aria-hidden="true"
          style={{ overflow: "visible" }}
        >
          {/* Area fill */}
          <path
            d={`${pathD} L ${(lastX).toFixed(1)} ${H} L ${PAD} ${H} Z`}
            fill={accent}
            opacity={0.07}
          />
          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke={accent}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.75}
          />
          {/* End dot */}
          <circle cx={lastX} cy={lastY} r={3} fill={accent} />
        </svg>
        {/* Delta label */}
        <span
          className="text-xs font-bold tabular-nums"
          style={{ color: trendColor }}
        >
          {delta > 0 ? "+" : ""}{delta !== 0 ? delta : "±0"}
        </span>
      </div>
      <p
        className="text-[10px]"
        style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
      >
        {points[0]!.sessionLabel} → {points[points.length - 1]!.sessionLabel}
      </p>
    </div>
  );
}

// ── Stat chip ─────────────────────────────────────────────────────────────────

function StatChip({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <span
        className="text-lg font-extrabold tabular-nums leading-none"
        style={{ color: accent ?? "var(--semantic-text-primary, var(--foreground))" }}
      >
        {value}
      </span>
      <span
        className="text-[10px] font-medium leading-tight"
        style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Percentile badge ──────────────────────────────────────────────────────────

function PercentileBadge({ benchmark }: { benchmark: BenchmarkData | null }) {
  if (!benchmark) return null;

  if (!benchmark.hasEnoughData) {
    return (
      <div
        className="flex flex-col gap-0.5 rounded-xl px-4 py-3 text-center"
        style={{
          background: "color-mix(in srgb, var(--semantic-info, #76b6c4) 8%, var(--bg-card))",
          border:
            "1px solid color-mix(in srgb, var(--semantic-info, #76b6c4) 20%, var(--border-subtle))",
        }}
      >
        <span
          className="text-[11px] font-semibold"
          style={{ color: "var(--semantic-info, #76b6c4)" }}
        >
          Percentile rank
        </span>
        <span
          className="text-[10px]"
          style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
        >
          Computing when more learners join
        </span>
      </div>
    );
  }

  const pct = benchmark.percentile ?? 0;
  const accent =
    pct >= 75
      ? "var(--semantic-success, #22c55e)"
      : pct >= 50
      ? "var(--semantic-info, #76b6c4)"
      : pct >= 25
      ? "var(--semantic-warning, #d97706)"
      : "var(--semantic-text-muted, #8fa8b8)";

  return (
    <div
      className="flex flex-col items-center gap-0.5 rounded-xl px-4 py-3 text-center"
      style={{
        background: `color-mix(in srgb, ${accent} 8%, var(--bg-card))`,
        border: `1px solid color-mix(in srgb, ${accent} 22%, var(--border-subtle))`,
      }}
    >
      <span
        className="text-xl font-extrabold tabular-nums"
        style={{ color: accent }}
      >
        {pct}
        <span className="text-xs font-semibold">th</span>
      </span>
      <span
        className="text-[10px] font-bold uppercase tracking-[0.07em]"
        style={{ color: accent }}
      >
        percentile
      </span>
      {benchmark.percentileLabel ? (
        <span
          className="mt-0.5 text-[10px]"
          style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
        >
          {benchmark.percentileLabel}
        </span>
      ) : null}
    </div>
  );
}

// ── ReadinessHeroCard ─────────────────────────────────────────────────────────

export interface ReadinessHeroCardProps {
  score: number | null;
  band: ReadinessBand;
  summary: string;
  confidence: "low" | "medium" | "high";
  studyStreakDays: number;
  catSessionCount: number;
  overallAccuracyPct: number | null;
  catTrend: CatTrendPoint[];
  benchmark: BenchmarkData | null;
}

export function ReadinessHeroCard({
  score,
  band,
  summary,
  confidence,
  studyStreakDays,
  catSessionCount,
  overallAccuracyPct,
  catTrend,
  benchmark,
}: ReadinessHeroCardProps) {
  const accent = bandAccent(band);
  const surface = bandSurface(band);
  const gaugeBand = toGaugeBand(band);

  const confidenceColor =
    confidence === "high"
      ? "var(--semantic-success, #22c55e)"
      : confidence === "medium"
      ? "var(--semantic-info, #76b6c4)"
      : "var(--semantic-text-muted, #8fa8b8)";

  const confidenceLabel =
    confidence === "high"
      ? "High confidence estimate"
      : confidence === "medium"
      ? "Moderate data confidence"
      : "Low data — answer more questions";

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background: surface,
        border: `1px solid color-mix(in srgb, ${accent} 22%, var(--border-subtle, var(--theme-border)))`,
      }}
      role="region"
      aria-label="Readiness score overview"
    >
      <div className="px-6 pt-6 pb-5 sm:px-7 sm:pt-7">
        {/* Label */}
        <p
          className="mb-4 text-[10px] font-bold uppercase tracking-[0.13em]"
          style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
          aria-hidden="true"
        >
          Exam readiness score
        </p>

        {/* Main row: gauge + score block */}
        <div className="flex flex-wrap items-center gap-6">
          {/* Animated gauge */}
          <StudyReadinessGauge
            score={score}
            forecast={null}
            band={gaugeBand}
            size={128}
          />

          {/* Score + band + trend */}
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            {/* Score headline */}
            <div>
              <div className="flex flex-wrap items-baseline gap-3">
                <span
                  className="text-5xl font-black tabular-nums leading-none tracking-tight"
                  style={{ color: accent }}
                >
                  {score ?? "—"}
                </span>
                <span
                  className="text-lg font-semibold"
                  style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
                >
                  / 100
                </span>
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.07em]"
                  style={{
                    background: `color-mix(in srgb, ${accent} 14%, var(--bg-card))`,
                    border: `1px solid color-mix(in srgb, ${accent} 28%, var(--border-subtle))`,
                    color: accent,
                  }}
                >
                  {bandLabel(band)}
                </span>
              </div>
              <p
                className="mt-2 max-w-md text-sm leading-relaxed"
                style={{ color: "var(--semantic-text-secondary, var(--muted-foreground))" }}
              >
                {summary}
              </p>
            </div>

            {/* Confidence + trend row */}
            <div className="flex flex-wrap items-start gap-6">
              {/* Confidence */}
              <div className="flex flex-col gap-0.5">
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.1em]"
                  style={{ color: "var(--semantic-text-muted, var(--muted-foreground))" }}
                >
                  Data confidence
                </p>
                <span
                  className="text-xs font-semibold"
                  style={{ color: confidenceColor }}
                >
                  {confidenceLabel}
                </span>
              </div>

              {/* Trend sparkline */}
              {catTrend.length >= 2 ? (
                <TrendSparkline points={catTrend} accent={accent} />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div
        className="flex flex-wrap items-center gap-6 border-t px-6 py-4 sm:px-7"
        style={{
          borderColor: `color-mix(in srgb, ${accent} 14%, var(--border-subtle, var(--theme-border)))`,
          background: `color-mix(in srgb, ${accent} 4%, var(--bg-card))`,
        }}
      >
        <StatChip
          label="Study streak"
          value={`${studyStreakDays}d`}
          accent={studyStreakDays >= 7 ? "var(--semantic-success)" : undefined}
        />
        <StatChip
          label="CAT sessions"
          value={catSessionCount}
          accent={catSessionCount >= 3 ? accent : undefined}
        />
        <StatChip
          label="Overall accuracy"
          value={overallAccuracyPct != null ? `${overallAccuracyPct}%` : "—"}
          accent={
            overallAccuracyPct != null
              ? overallAccuracyPct >= 75
                ? "var(--semantic-success)"
                : overallAccuracyPct >= 55
                ? "var(--semantic-info)"
                : "var(--semantic-warning)"
              : undefined
          }
        />

        {/* Percentile badge — rightmost on desktop */}
        <div className="ml-auto">
          <PercentileBadge benchmark={benchmark} />
        </div>
      </div>
    </div>
  );
}
