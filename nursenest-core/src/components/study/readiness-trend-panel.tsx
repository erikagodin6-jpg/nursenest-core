"use client";

/**
 * ReadinessTrendPanel — readiness score evolution over CAT sessions.
 *
 * Surface: --surface-soft-b with semantic accent polyline.
 *
 * Features:
 *   - SVG polyline trend chart (no external charting library)
 *   - Readiness band interpretation per session
 *   - "Load more history" via Server Action (cursor pagination)
 *   - Empty state if no CAT sessions taken
 *
 * Only the chart SVG requires client-side rendering; the data can be passed as props.
 */

import { useState, useTransition } from "react";
import { getReadinessBand, BAND_LABELS } from "./cat-readiness-hero";
import type { ReadinessTrendPoint } from "@/lib/study/analytics-data";

type Props = {
  initialPoints: ReadinessTrendPoint[];
  hasMore: boolean;
  cursor: string | null;
  onLoadMore: (cursor: string) => Promise<{
    points: ReadinessTrendPoint[];
    hasMore: boolean;
    cursor: string | null;
  }>;
};

export function ReadinessTrendPanel({ initialPoints, hasMore: initialHasMore, cursor: initialCursor, onLoadMore }: Props) {
  const [points, setPoints] = useState<ReadinessTrendPoint[]>(initialPoints);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [isPending, startTransition] = useTransition();

  function handleLoadMore() {
    if (!cursor) return;
    startTransition(async () => {
      const result = await onLoadMore(cursor);
      setPoints((prev) => [...prev, ...result.points]);
      setHasMore(result.hasMore);
      setCursor(result.cursor);
    });
  }

  const hasData = points.length > 0;
  const latest = points[points.length - 1];
  const earliest = points[0];
  const delta = hasData && points.length >= 2
    ? (latest?.score ?? 0) - (earliest?.score ?? 0)
    : null;

  return (
    <section
      className="rounded-2xl border p-5 sm:p-6"
      style={{
        background: "var(--surface-soft-b, var(--semantic-panel-cool))",
        borderColor: "color-mix(in srgb, var(--semantic-brand) 20%, var(--semantic-border-soft))",
      }}
    >
      <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">Readiness Evolution</h2>
          <p className="mt-0.5 text-xs text-[var(--semantic-text-muted)]">
            Based on CAT readiness scores over time
          </p>
        </div>
        {hasData && delta !== null && (
          <DeltaBadge delta={delta} sessionCount={points.length} />
        )}
      </div>

      {!hasData ? (
        <div className="py-6 text-center">
          <p className="text-sm text-[var(--semantic-text-muted)]">
            Take your first CAT to start tracking readiness over time.
          </p>
          <a
            href="/app/practice-tests"
            className="mt-3 inline-flex items-center text-sm font-semibold"
            style={{ color: "var(--semantic-brand)" }}
          >
            Start a CAT →
          </a>
        </div>
      ) : (
        <div className="space-y-5">
          {/* SVG trend chart */}
          <TrendChart points={points} />

          {/* Session list (compact) */}
          <div className="divide-y divide-[var(--semantic-border-soft)]">
            {[...points].reverse().slice(0, 6).map((p) => (
              <SessionRow key={p.id} point={p} />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isPending}
              className="w-full rounded-xl py-2.5 text-sm font-medium text-[var(--semantic-text-secondary)] transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{
                background: "color-mix(in srgb, var(--semantic-brand) 8%, var(--semantic-surface))",
                border: "1px solid color-mix(in srgb, var(--semantic-brand) 20%, transparent)",
              }}
            >
              {isPending ? "Loading…" : "Load older history"}
            </button>
          )}
        </div>
      )}
    </section>
  );
}

function TrendChart({ points }: { points: ReadinessTrendPoint[] }) {
  if (points.length < 2) {
    return (
      <div
        className="flex h-28 items-center justify-center rounded-xl text-xs text-[var(--semantic-text-muted)]"
        style={{ background: "color-mix(in srgb, var(--semantic-border-soft) 50%, transparent)" }}
      >
        {points.length === 1
          ? `One session recorded (${points[0]?.score ?? 0}%) — complete another to see a trend`
          : "No chart data"}
      </div>
    );
  }

  const W = 600;
  const H = 120;
  const PAD = { top: 16, right: 20, bottom: 28, left: 36 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const minScore = Math.max(0, Math.min(...points.map((p) => p.score)) - 10);
  const maxScore = Math.min(100, Math.max(...points.map((p) => p.score)) + 10);
  const scoreRange = maxScore - minScore || 1;

  const toX = (i: number) => PAD.left + (i / (points.length - 1)) * chartW;
  const toY = (score: number) =>
    PAD.top + chartH - ((score - minScore) / scoreRange) * chartH;

  const polyPoints = points.map((p, i) => `${toX(i)},${toY(p.score)}`).join(" ");

  // Band threshold lines
  const thresholds = [
    { score: 75, label: "Exam Ready", color: "var(--semantic-success)" },
    { score: 60, label: "Approaching", color: "var(--semantic-info-contrast, var(--semantic-info))" },
    { score: 40, label: "Building", color: "color-mix(in srgb, var(--semantic-warning) 80%, var(--semantic-text-primary))" },
  ];

  return (
    <div className="overflow-hidden rounded-xl" style={{ background: "color-mix(in srgb, var(--semantic-surface) 80%, transparent)" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        aria-label="Readiness score trend chart"
        role="img"
      >
        {/* Band threshold lines */}
        {thresholds.map(({ score, label, color }) => {
          if (score < minScore || score > maxScore) return null;
          const y = toY(score);
          return (
            <g key={label}>
              <line
                x1={PAD.left}
                y1={y}
                x2={W - PAD.right}
                y2={y}
                stroke={color}
                strokeWidth="1"
                strokeDasharray="4 3"
                opacity="0.4"
              />
              <text
                x={PAD.left - 4}
                y={y + 4}
                fill={color}
                fontSize="8"
                textAnchor="end"
                opacity="0.7"
              >
                {score}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--semantic-brand)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--semantic-brand)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon
          points={`${PAD.left},${toY(minScore)} ${polyPoints} ${W - PAD.right},${toY(minScore)}`}
          fill="url(#trend-fill)"
        />

        {/* Trend line */}
        <polyline
          points={polyPoints}
          fill="none"
          stroke="var(--semantic-brand)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={p.id}
            cx={toX(i)}
            cy={toY(p.score)}
            r="3.5"
            fill="var(--semantic-brand)"
            stroke="var(--semantic-surface)"
            strokeWidth="2"
          >
            <title>{`${p.sessionLabel}: ${p.score}%`}</title>
          </circle>
        ))}

        {/* X axis labels (every other point) */}
        {points.map((p, i) => {
          if (points.length > 4 && i % 2 !== 0) return null;
          return (
            <text
              key={p.id + "label"}
              x={toX(i)}
              y={H - 4}
              textAnchor="middle"
              fontSize="8"
              fill="var(--semantic-text-muted)"
            >
              {p.sessionLabel}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function SessionRow({ point }: { point: ReadinessTrendPoint }) {
  const band = getReadinessBand(point.score);
  const bandColors = {
    exam_ready: "var(--semantic-success)",
    approaching: "var(--semantic-info-contrast, var(--semantic-info))",
    building: "color-mix(in srgb, var(--semantic-warning) 80%, var(--semantic-text-primary))",
    not_ready: "var(--semantic-danger)",
  };
  const date = new Date(point.completedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs text-[var(--semantic-text-muted)]">{point.sessionLabel}</span>
        <span className="text-xs text-[var(--semantic-text-muted)]">·</span>
        <span className="text-xs text-[var(--semantic-text-muted)]">{date}</span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-medium"
          style={{ color: bandColors[band] }}
        >
          {BAND_LABELS[band]}
        </span>
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color: bandColors[band] }}
        >
          {point.score}%
        </span>
      </div>
    </div>
  );
}

function DeltaBadge({ delta, sessionCount }: { delta: number; sessionCount: number }) {
  const positive = delta > 0;
  const neutral = delta === 0;
  const color = positive
    ? "var(--semantic-success)"
    : neutral
    ? "var(--semantic-text-muted)"
    : "var(--semantic-danger)";
  const bg = positive
    ? "color-mix(in srgb, var(--semantic-success) 12%, var(--semantic-surface))"
    : neutral
    ? "color-mix(in srgb, var(--semantic-text-muted) 8%, var(--semantic-surface))"
    : "color-mix(in srgb, var(--semantic-danger) 12%, var(--semantic-surface))";

  return (
    <div
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold tabular-nums"
      style={{ background: bg, color, border: `1px solid ${color}20` }}
    >
      {positive ? "+" : ""}
      {delta}% over {sessionCount} session{sessionCount !== 1 ? "s" : ""}
    </div>
  );
}
