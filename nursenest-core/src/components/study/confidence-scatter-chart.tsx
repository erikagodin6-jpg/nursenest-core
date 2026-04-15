"use client";

import { useId } from "react";
import type { ConfidenceScatterPoint } from "@/lib/study/analytics-data";

/**
 * SVG scatter: X = self-reported confidence (low → high), Y = item outcome (incorrect → correct).
 * Uses semantic chart tokens — no hardcoded hex.
 */
export function ConfidenceScatterChart({ points }: { points: ConfidenceScatterPoint[] }) {
  const gid = useId().replace(/:/g, "");
  if (points.length === 0) {
    return (
      <div
        className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed p-6 text-center text-sm text-[var(--semantic-text-muted)]"
        style={{ borderColor: "var(--semantic-border-soft)", background: "var(--semantic-surface)" }}
      >
        Rate confidence on practice items to see how self-assessment lines up with results.
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]">
      <svg viewBox="0 0 100 100" className="aspect-[5/3] w-full min-h-[200px]" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Confidence versus performance scatter plot">
        <defs>
          <linearGradient id={`nn-scatter-grid-${gid}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--semantic-border-soft)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--semantic-border-soft)" stopOpacity={0.08} />
          </linearGradient>
        </defs>
        {/* Quadrant shading (premium calm zones) */}
        <rect x="0" y="0" width="50" height="50" fill="color-mix(in srgb, var(--semantic-danger) 6%, transparent)" />
        <rect x="50" y="50" width="50" height="50" fill="color-mix(in srgb, var(--semantic-success) 6%, transparent)" />
        <rect x="0" y="50" width="50" height="50" fill="color-mix(in srgb, var(--semantic-info) 5%, transparent)" />
        <rect x="50" y="0" width="50" height="50" fill="color-mix(in srgb, var(--semantic-warning) 5%, transparent)" />

        {/* Axes */}
        <line x1="8" y1="92" x2="92" y2="92" stroke="var(--semantic-border-soft)" strokeWidth={0.6} />
        <line x1="8" y1="8" x2="8" y2="92" stroke="var(--semantic-border-soft)" strokeWidth={0.6} />

        {/* Mid guides */}
        <line
          x1="50"
          y1="8"
          x2="50"
          y2="92"
          stroke={`url(#nn-scatter-grid-${gid})`}
          strokeWidth={0.35}
          strokeDasharray="2 2"
          opacity={0.9}
        />
        <line
          x1="8"
          y1="50"
          x2="92"
          y2="50"
          stroke={`url(#nn-scatter-grid-${gid})`}
          strokeWidth={0.35}
          strokeDasharray="2 2"
          opacity={0.9}
        />

        {points.map((p) => (
          <circle
            key={p.id}
            cx={8 + (p.x / 100) * 84}
            cy={92 - (p.y / 100) * 84}
            r={1.35}
            fill={
              p.y >= 50
                ? "color-mix(in srgb, var(--semantic-success) 88%, var(--semantic-text-primary))"
                : "color-mix(in srgb, var(--semantic-danger) 85%, var(--semantic-text-primary))"
            }
            opacity={0.88}
          />
        ))}
      </svg>
      <div className="space-y-1 border-t border-[var(--semantic-border-soft)] px-3 py-2">
        <div className="flex justify-between text-[0.65rem] text-[var(--semantic-text-muted)]">
          <span>Lower self-rated confidence</span>
          <span>Higher self-rated confidence</span>
        </div>
        <p className="text-center text-[0.65rem] text-[var(--semantic-text-muted)]">
          Vertical: incorrect (bottom) → correct (top)
        </p>
      </div>
    </div>
  );
}
