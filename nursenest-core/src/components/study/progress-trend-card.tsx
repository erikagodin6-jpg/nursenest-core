/**
 * ProgressTrendCard
 *
 * Compact readiness trend view. Shows up to 5 recent readiness score points
 * with a simple SVG sparkline, direction arrow, and a one-line interpretation.
 *
 * Used on the Exam Plan dashboard "Recent Progress" section.
 * Intentionally compact — not a full analytics chart.
 *
 * Server component (receives pre-computed trend data).
 */

import type { CoachPageData } from "@/lib/study/coach-page-data";

// ── Types ─────────────────────────────────────────────────────────────────────

export type TrendPoint = {
  score: number;
  label: string; // e.g. "Apr 5" or "CAT #3"
};

// ── SVG sparkline ─────────────────────────────────────────────────────────────

function Sparkline({ points, accent }: { points: TrendPoint[]; accent: string }) {
  if (points.length < 2) return null;

  const W = 200;
  const H = 40;
  const min = Math.min(...points.map((p) => p.score)) - 5;
  const max = Math.max(...points.map((p) => p.score)) + 5;
  const range = Math.max(max - min, 10);

  const coords = points.map((p, i) => ({
    x: (i / (points.length - 1)) * W,
    y: H - ((p.score - min) / range) * H,
  }));

  const d = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ");
  const last = coords[coords.length - 1]!;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-10 w-full"
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <path
        d={d}
        fill="none"
        stroke={accent}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0.7 }}
      />
      <circle cx={last.x} cy={last.y} r={3} fill={accent} />
    </svg>
  );
}

// ── Direction arrow ───────────────────────────────────────────────────────────

function TrendArrow({ delta }: { delta: number }) {
  if (Math.abs(delta) < 2) {
    return <span style={{ color: "var(--semantic-info)" }}>→</span>;
  }
  return delta > 0 ? (
    <span style={{ color: "var(--semantic-success)" }}>↑</span>
  ) : (
    <span style={{ color: "var(--semantic-warning)" }}>↓</span>
  );
}

// ── Interpretation ────────────────────────────────────────────────────────────

function trendInterpretation(
  delta: number,
  band: CoachPageData["readiness"]["band"],
): string {
  if (delta > 5) return "Significant improvement — your preparation is paying off.";
  if (delta > 0) return "Steady improvement — consistent study is moving you forward.";
  if (Math.abs(delta) < 2) return "Stable readiness — focus on weak areas to build momentum.";
  if (band === "near_ready" || band === "ready") {
    return "Minor dip — maintain consistency and prioritize review.";
  }
  return "Scores have dipped — focus today's plan on the highest-impact weak areas.";
}

// ── Main component ────────────────────────────────────────────────────────────

export function ProgressTrendCard({
  trendPoints,
  readiness,
}: {
  trendPoints: TrendPoint[];
  readiness: CoachPageData["readiness"];
}) {
  const BAND_ACCENT: Record<CoachPageData["readiness"]["band"], string> = {
    insufficient_data: "var(--semantic-text-muted)",
    not_ready: "var(--semantic-danger)",
    improving: "var(--semantic-warning)",
    near_ready: "var(--semantic-info)",
    ready: "var(--semantic-success)",
  };
  const accent = BAND_ACCENT[readiness.band];

  const hasData = trendPoints.length >= 2;
  const latestScore = trendPoints[trendPoints.length - 1]?.score ?? readiness.score;
  const prevScore = trendPoints[trendPoints.length - 2]?.score;
  const delta = hasData && latestScore != null && prevScore != null ? latestScore - prevScore : 0;

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: `color-mix(in srgb, ${accent} 6%, var(--bg-page))`,
        border: `1px solid color-mix(in srgb, ${accent} 18%, transparent)`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--semantic-text-muted)" }}
          >
            Readiness trend
          </p>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold tabular-nums" style={{ color: accent }}>
              {latestScore ?? "—"}
            </span>
            {hasData && (
              <span className="text-sm font-semibold">
                <TrendArrow delta={delta} />
                {" "}
                <span className="tabular-nums" style={{ color: delta > 0 ? "var(--semantic-success)" : delta < -1 ? "var(--semantic-warning)" : "var(--semantic-text-muted)" }}>
                  {delta > 0 ? "+" : ""}{delta !== 0 ? delta : "±0"}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sparkline */}
      {hasData && (
        <div className="mt-3">
          <Sparkline points={trendPoints} accent={accent} />
          <div className="mt-1 flex justify-between">
            <span className="text-[10px]" style={{ color: "var(--semantic-text-muted)" }}>
              {trendPoints[0]?.label}
            </span>
            <span className="text-[10px]" style={{ color: "var(--semantic-text-muted)" }}>
              {trendPoints[trendPoints.length - 1]?.label}
            </span>
          </div>
        </div>
      )}

      {/* Score history */}
      {hasData && (
        <div className="mt-3 space-y-1.5">
          {trendPoints
            .slice()
            .reverse()
            .slice(0, 3)
            .map((p, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span style={{ color: "var(--semantic-text-muted)" }}>{p.label}</span>
                <span className="font-semibold tabular-nums" style={{ color: "var(--semantic-text-primary)" }}>
                  {p.score}
                </span>
              </div>
            ))}
        </div>
      )}

      {/* Interpretation */}
      <p
        className="mt-3 border-t pt-3 text-xs leading-relaxed"
        style={{
          color: "var(--semantic-text-secondary)",
          borderColor: `color-mix(in srgb, ${accent} 15%, transparent)`,
        }}
      >
        {hasData ? trendInterpretation(delta, readiness.band) : "Complete more CAT sessions to see your readiness trend over time."}
      </p>
    </div>
  );
}
