"use client";

import { useState, useMemo } from "react";
import type { PhysiologySnapshot } from "@/lib/physiology-monitor/physiology-state";
import { SIM_SECONDS_PER_TICK } from "@/lib/physiology-monitor/monitor-engine";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TrendWindow = 5 | 15 | 30 | 60;

export interface TrendVital {
  key: keyof PhysiologySnapshot["state"];
  label: string;
  color: string;
  unit: string;
}

export interface TrendPanelProps {
  history: PhysiologySnapshot[];
  vitals: TrendVital[];
}

const WINDOWS: TrendWindow[] = [5, 15, 30, 60];

// ─── Window → tick count ──────────────────────────────────────────────────────

function ticksForWindow(minutes: TrendWindow): number {
  return Math.ceil((minutes * 60) / SIM_SECONDS_PER_TICK);
}

// ─── SVG trend line ───────────────────────────────────────────────────────────

const W = 400;
const H = 48;
const PADDING = { top: 4, bottom: 4, left: 2, right: 2 };

function TrendLine({
  snapshots,
  vitalKey,
  color,
}: {
  snapshots: PhysiologySnapshot[];
  vitalKey: keyof PhysiologySnapshot["state"];
  color: string;
}) {
  const values = snapshots
    .map((s) => s.state[vitalKey])
    .filter((v): v is number => typeof v === "number");

  if (values.length < 2) {
    return <text x={W / 2} y={H / 2 + 4} textAnchor="middle" fontSize="9" fill="#4a6a88">No data</text>;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const drawH = H - PADDING.top - PADDING.bottom;
  const drawW = W - PADDING.left - PADDING.right;
  const step = drawW / (values.length - 1);

  const points = values
    .map((v, i) => {
      const x = PADDING.left + i * step;
      const y = PADDING.top + drawH - ((v - min) / range) * drawH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const lastVal = values[values.length - 1]!;
  const lastY = PADDING.top + drawH - ((lastVal - min) / range) * drawH;

  return (
    <g>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* Current value dot */}
      <circle cx={PADDING.left + drawW} cy={lastY} r="2.5" fill={color} />
      {/* Min / max labels */}
      <text x={PADDING.left + 2} y={H - PADDING.bottom} fontSize="7" fill={color} opacity="0.5">
        {min % 1 === 0 ? min : min.toFixed(1)}
      </text>
      <text x={PADDING.left + 2} y={PADDING.top + 7} fontSize="7" fill={color} opacity="0.5">
        {max % 1 === 0 ? max : max.toFixed(1)}
      </text>
    </g>
  );
}

// ─── Time axis labels ─────────────────────────────────────────────────────────

function TimeAxis({
  snapshots,
  window,
}: {
  snapshots: PhysiologySnapshot[];
  window: TrendWindow;
}) {
  if (snapshots.length === 0) return null;
  const totalSimSec = window * 60;
  const labels = [0, 0.25, 0.5, 0.75, 1].map((frac) => {
    const simSec = totalSimSec * frac;
    const minAgo = Math.round((totalSimSec - simSec) / 60);
    return { x: frac * W, label: minAgo === 0 ? "Now" : `-${minAgo}m` };
  });

  return (
    <g>
      {labels.map(({ x, label }) => (
        <text
          key={label}
          x={x}
          y={10}
          textAnchor="middle"
          fontSize="7"
          fill="#4a6a88"
        >
          {label}
        </text>
      ))}
    </g>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TrendPanel({ history, vitals }: TrendPanelProps) {
  const [window, setWindow] = useState<TrendWindow>(15);

  const windowedHistory = useMemo(() => {
    const needed = ticksForWindow(window);
    return history.slice(-needed);
  }, [history, window]);

  return (
    <div data-nn-monitor-trend="" aria-label="Vital sign trend chart">
      {/* Header with window selector */}
      <div className="flex items-center justify-between mb-2">
        <span
          style={{
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#4a6a88",
          }}
        >
          Trends
        </span>
        <div className="flex gap-1">
          {WINDOWS.map((w) => (
            <button
              key={w}
              type="button"
              data-nn-monitor-mode-pill=""
              aria-pressed={window === w}
              onClick={() => setWindow(w)}
              style={{ fontSize: "8px", padding: "2px 6px" }}
            >
              {w}m
            </button>
          ))}
        </div>
      </div>

      {/* One row per vital */}
      <div className="flex flex-col gap-2">
        {vitals.map((v) => {
          const values = windowedHistory
            .map((s) => s.state[v.key])
            .filter((x): x is number => typeof x === "number");

          const current = values[values.length - 1];
          const formatted =
            current === undefined
              ? "—"
              : v.key === "temperature" || v.key === "lactate" || v.key === "cardiacOutput"
              ? current.toFixed(1)
              : Math.round(current).toString();

          return (
            <div key={v.key} className="flex items-center gap-2">
              {/* Label + value */}
              <div style={{ width: 60, flexShrink: 0 }}>
                <div style={{ fontSize: "8px", color: v.color, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {v.label}
                </div>
                <div style={{ fontSize: "13px", color: v.color, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                  {formatted}
                  <span style={{ fontSize: "8px", color: "#4a6a88", marginLeft: 2 }}>{v.unit}</span>
                </div>
              </div>

              {/* Spark */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  className="w-full"
                  style={{ height: 32, display: "block" }}
                  role="img"
                  aria-label={`${v.label} trend over last ${window} minutes`}
                >
                  <TrendLine snapshots={windowedHistory} vitalKey={v.key} color={v.color} />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Time axis below last row */}
      <svg
        viewBox={`0 0 ${W} 12`}
        className="w-full mt-1"
        style={{ height: 12, marginLeft: 68 }}
        aria-hidden
      >
        <TimeAxis snapshots={windowedHistory} window={window} />
      </svg>

      {windowedHistory.length === 0 && (
        <p style={{ fontSize: "9px", color: "#4a6a88", textAlign: "center", marginTop: 8 }}>
          Collecting trend data…
        </p>
      )}
    </div>
  );
}
