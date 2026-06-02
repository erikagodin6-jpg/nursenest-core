/**
 * ReadinessProgressCard
 *
 * Premium card showing the learner's readiness score trajectory over recent
 * CAT sessions. No heavy charting library — rendered as a minimal SVG polyline.
 *
 * Design surface: --surface-soft-b with info/success semantic accents
 *
 * Features:
 *   - Mini SVG trend line (last 5 CAT scores)
 *   - Direction indicator: up ↑ / down ↓ / flat —
 *   - Band label for the most recent session
 *   - Supportive interpretation copy
 *   - Empty state when no CAT sessions taken yet
 *
 * This is a server component — no client interactivity needed here.
 */

import { BAND_LABELS } from "./cat-readiness-hero";
import type { RecentReadinessPoint } from "@/lib/study/motivation-data";
import type { ReadinessBand } from "./cat-readiness-hero";

// ── Band color helpers ────────────────────────────────────────────────────────

const BAND_SURFACE: Record<ReadinessBand, string> = {
  not_ready: "color-mix(in srgb, var(--semantic-danger) 10%, var(--semantic-surface))",
  building: "color-mix(in srgb, var(--semantic-warning) 10%, var(--semantic-surface))",
  approaching: "color-mix(in srgb, var(--semantic-info) 10%, var(--semantic-surface))",
  exam_ready: "color-mix(in srgb, var(--semantic-success) 10%, var(--semantic-surface))",
};

const BAND_ACCENT: Record<ReadinessBand, string> = {
  not_ready: "var(--semantic-danger)",
  building: "var(--semantic-warning)",
  approaching: "var(--semantic-info)",
  exam_ready: "var(--semantic-success)",
};

const BAND_BORDER: Record<ReadinessBand, string> = {
  not_ready: "color-mix(in srgb, var(--semantic-danger) 20%, transparent)",
  building: "color-mix(in srgb, var(--semantic-warning) 20%, transparent)",
  approaching: "color-mix(in srgb, var(--semantic-info) 20%, transparent)",
  exam_ready: "color-mix(in srgb, var(--semantic-success) 20%, transparent)",
};

// ── Trend direction ───────────────────────────────────────────────────────────

type TrendDirection = "up" | "down" | "flat" | "none";

function getTrendDirection(points: RecentReadinessPoint[]): TrendDirection {
  if (points.length < 2) return "none";
  const latest = points[points.length - 1]!.score;
  const prev = points[points.length - 2]!.score;
  const delta = latest - prev;
  if (delta >= 3) return "up";
  if (delta <= -3) return "down";
  return "flat";
}

function trendLabel(direction: TrendDirection, delta: number): string {
  if (direction === "up") return `+${delta} from last session`;
  if (direction === "down") return `${delta} from last session`;
  if (direction === "flat") return "Stable from last session";
  return "Run a CAT to begin tracking";
}

function trendColor(direction: TrendDirection): string {
  if (direction === "up") return "var(--semantic-success)";
  if (direction === "down") return "var(--semantic-danger)";
  return "var(--semantic-text-muted)";
}

function trendArrow(direction: TrendDirection): string {
  if (direction === "up") return "↑";
  if (direction === "down") return "↓";
  if (direction === "flat") return "→";
  return "—";
}

// ── Mini trend sparkline ──────────────────────────────────────────────────────

function TrendSparkline({ points }: { points: RecentReadinessPoint[] }) {
  if (points.length < 2) return null;

  const W = 100;
  const H = 36;
  const PADDING = 4;

  const scores = points.map((p) => p.score);
  const minScore = Math.max(0, Math.min(...scores) - 5);
  const maxScore = Math.min(100, Math.max(...scores) + 5);
  const scoreRange = Math.max(maxScore - minScore, 10);

  const coords = points.map((p, i) => {
    const x = PADDING + ((i / (points.length - 1)) * (W - 2 * PADDING));
    const y = PADDING + ((1 - (p.score - minScore) / scoreRange) * (H - 2 * PADDING));
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const latest = points[points.length - 1]!;
  const latestAccent = BAND_ACCENT[latest.band];
  const lastX = parseFloat(coords[coords.length - 1]!.split(",")[0]!);
  const lastY = parseFloat(coords[coords.length - 1]!.split(",")[1]!);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <polyline
        points={coords.join(" ")}
        fill="none"
        stroke={latestAccent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
      {/* End dot */}
      <circle cx={lastX} cy={lastY} r="3" fill={latestAccent} />
    </svg>
  );
}

// ── Score history row ─────────────────────────────────────────────────────────

function ScoreRow({ point, index }: { point: RecentReadinessPoint; index: number }) {
  const accent = BAND_ACCENT[point.band];
  const date = new Date(point.completedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="flex items-center gap-3 py-2"
      style={{
        borderBottom:
          index > 0
            ? "1px solid color-mix(in srgb, var(--semantic-border-soft) 60%, transparent)"
            : "none",
      }}
    >
      <div
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ background: accent }}
        aria-hidden="true"
      />
      <span
        className="flex-1 text-xs"
        style={{ color: "var(--semantic-text-muted)" }}
      >
        {point.sessionLabel} · {date}
      </span>
      <span
        className="text-sm font-bold tabular-nums"
        style={{ color: accent }}
      >
        {point.score}
      </span>
      <span
        className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
        style={{
          background: BAND_SURFACE[point.band],
          color: accent,
        }}
      >
        {BAND_LABELS[point.band]}
      </span>
    </div>
  );
}

// ── ReadinessProgressCard ─────────────────────────────────────────────────────

export type ReadinessProgressCardProps = {
  recentReadiness: RecentReadinessPoint[];
};

export function ReadinessProgressCard({ recentReadiness }: ReadinessProgressCardProps) {
  const hasData = recentReadiness.length > 0;
  const latest = hasData ? recentReadiness[recentReadiness.length - 1]! : null;
  const direction = getTrendDirection(recentReadiness);
  const delta =
    recentReadiness.length >= 2
      ? recentReadiness[recentReadiness.length - 1]!.score -
        recentReadiness[recentReadiness.length - 2]!.score
      : 0;

  const latestBand: ReadinessBand = latest?.band ?? "not_ready";
  const cardSurface = BAND_SURFACE[latestBand];
  const accent = BAND_ACCENT[latestBand];
  const border = BAND_BORDER[latestBand];

  // No-data surface
  const emptySurface =
    "var(--surface-soft-b, color-mix(in srgb, var(--theme-primary) 5%, var(--bg-page)))";

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background: hasData ? cardSurface : emptySurface,
        border: hasData ? `1px solid ${border}` : "1px solid var(--semantic-border-soft)",
      }}
    >
      <div className="px-5 pt-5 pb-4">
        {/* Label */}
        <p
          className="mb-3 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          Readiness progress
        </p>

        {!hasData ? (
          /* Empty state */
          <div className="space-y-1">
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--semantic-text-primary)" }}
            >
              No CAT sessions yet
            </p>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--semantic-text-muted)" }}
            >
              Complete a Computer Adaptive Test to begin tracking your readiness score over time.
            </p>
          </div>
        ) : (
          /* Score header */
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span
                  className="text-4xl font-extrabold tabular-nums"
                  style={{ color: accent }}
                >
                  {latest!.score}
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--semantic-text-secondary)" }}
                >
                  / 100
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    background: `color-mix(in srgb, ${accent} 15%, var(--semantic-surface))`,
                    color: accent,
                  }}
                >
                  {BAND_LABELS[latestBand]}
                </span>
              </div>
              <p
                className="text-xs font-medium"
                style={{ color: trendColor(direction) }}
              >
                {trendArrow(direction)}{" "}
                {trendLabel(direction, delta)}
              </p>
            </div>

            {/* Sparkline */}
            {recentReadiness.length >= 2 && (
              <div className="pt-1">
                <TrendSparkline points={recentReadiness} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Score history */}
      {hasData && (
        <div
          className="px-5 py-3"
          style={{
            borderTop: `1px solid color-mix(in srgb, ${accent} 15%, transparent)`,
          }}
        >
          <p
            className="mb-2 text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--semantic-text-muted)" }}
          >
            Recent sessions
          </p>
          <div>
            {[...recentReadiness].reverse().map((point, i) => (
              <ScoreRow key={point.id} point={point} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
