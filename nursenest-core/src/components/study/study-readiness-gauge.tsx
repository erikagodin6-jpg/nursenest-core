"use client";

/**
 * StudyReadinessGauge
 *
 * SVG ring gauge for readiness score (0–100) and forecast range.
 * Theme-adaptive — all colours via CSS custom properties.
 * Animates on mount via CSS transition.
 */

import { useEffect, useState } from "react";

type GaugeBand = "insufficient" | "early" | "building" | "strong";

function bandColor(band: GaugeBand): string {
  switch (band) {
    case "strong":    return "var(--semantic-success)";
    case "building":  return "var(--semantic-brand)";
    case "early":     return "var(--semantic-warning)";
    default:          return "var(--semantic-border-soft)";
  }
}

function bandLabel(band: GaugeBand): string {
  switch (band) {
    case "strong":    return "Exam Ready";
    case "building":  return "Building";
    case "early":     return "Early Stage";
    default:          return "Getting Started";
  }
}

interface StudyReadinessGaugeProps {
  score: number | null;
  forecast: string | null;
  band: GaugeBand;
  size?: number;
}

export function StudyReadinessGauge({
  score,
  forecast,
  band,
  size = 140,
}: StudyReadinessGaugeProps) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setAnimated(true); }, []);

  const r = (size / 2) * 0.82;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  // Use 75% of the circle (270°) for the gauge arc
  const arcFraction = 0.75;
  const maxDash = circumference * arcFraction;
  const pct = score !== null ? Math.min(100, Math.max(0, score)) / 100 : 0;
  const dash = animated ? maxDash * pct : 0;
  const gap = circumference - dash;

  // Rotate so the arc starts at 135° (bottom-left)
  const startAngle = 135;

  const accentColor = bandColor(band);
  const trackColor = "color-mix(in srgb, var(--border-subtle) 60%, transparent)";

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={size * 0.085}
          strokeDasharray={`${maxDash} ${circumference - maxDash}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(${startAngle} ${cx} ${cy})`}
        />
        {/* Progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={accentColor}
          strokeWidth={size * 0.085}
          strokeDasharray={`${dash} ${gap}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(${startAngle} ${cx} ${cy})`}
          style={{ transition: "stroke-dasharray 1.1s cubic-bezier(0.34, 1.2, 0.64, 1)" }}
        />
      </svg>

      {/* Center text */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          userSelect: "none",
        }}
      >
        <span
          style={{
            fontSize: size * 0.22,
            fontWeight: 900,
            lineHeight: 1,
            color: accentColor,
            letterSpacing: "-0.02em",
          }}
        >
          {score !== null ? score : "--"}
        </span>
        {forecast && (
          <span
            style={{
              fontSize: size * 0.09,
              fontWeight: 600,
              color: "var(--semantic-text-muted)",
              letterSpacing: "0.01em",
            }}
          >
            {forecast}
          </span>
        )}
        <span
          style={{
            fontSize: size * 0.08,
            fontWeight: 700,
            color: accentColor,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {bandLabel(band)}
        </span>
      </div>
    </div>
  );
}
