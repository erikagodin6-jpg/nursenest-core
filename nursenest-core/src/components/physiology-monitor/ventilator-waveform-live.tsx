"use client";

import { useMemo } from "react";
import { generateVentWaveformData, detectVentPattern } from "@/lib/physiology-monitor/ventilator-physiology";
import type { PhysiologyState } from "@/lib/physiology-monitor/physiology-state";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VentilatorWaveformLiveProps {
  state: PhysiologyState;
  /** Which waveforms to display. */
  show?: Array<"pressure" | "flow" | "volume">;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pointsToString(pts: Array<{ x: number; y: number }>): string {
  return pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

// ─── Pattern label badge ──────────────────────────────────────────────────────

const PATTERN_COLORS: Record<string, { bg: string; text: string }> = {
  normal_vc:       { bg: "rgba(0,230,118,0.1)",  text: "#00e676" },
  ards:            { bg: "rgba(255,23,68,0.12)",  text: "#ff6090" },
  bronchospasm:    { bg: "rgba(255,145,0,0.12)",  text: "#ff9100" },
  air_trapping:    { bg: "rgba(255,215,64,0.12)", text: "#ffd740" },
  tube_obstruction:{ bg: "rgba(255,23,68,0.2)",   text: "#ff1744" },
  circuit_leak:    { bg: "rgba(234,128,252,0.12):",text: "#ea80fc" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function VentilatorWaveformLive({
  state,
  show = ["pressure", "flow", "volume"],
}: VentilatorWaveformLiveProps) {
  const data = useMemo(() => generateVentWaveformData(state), [
    state.respiratoryRate,
    state.peakInspiratoryPressure,
    state.plateauPressure,
    state.peep,
    state.tidalVolume,
    state.lungCompliance,
    state.airwayResistance,
    state.isVentilated,
  ]);

  const pattern = detectVentPattern(state);
  const patternStyle = PATTERN_COLORS[pattern] ?? { bg: "rgba(255,255,255,0.06)", text: "#8fafc8" };

  const isAlarm = pattern === "tube_obstruction" || pattern === "ards";

  return (
    <div data-nn-monitor-vent="" aria-label="Ventilator waveforms">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span data-nn-monitor-vent-label="">Ventilator Waveforms</span>
        <span
          style={{
            background: patternStyle.bg,
            color: patternStyle.text,
            border: `1px solid ${patternStyle.text}44`,
            fontSize: "8px",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            borderRadius: "3px",
            padding: "2px 6px",
            animation: isAlarm ? "mon-alarm-pulse 1s ease-in-out infinite" : "none",
          }}
        >
          {data.patternLabel}
        </span>
      </div>

      {/* Vent parameter strip */}
      <div
        className="flex gap-3 mb-2 flex-wrap"
        style={{ fontSize: "9px", color: "#4a6a88", fontVariantNumeric: "tabular-nums" }}
      >
        {state.isVentilated && (
          <>
            <span>PIP <strong style={{ color: "#40c4ff" }}>{Math.round(state.peakInspiratoryPressure)}</strong></span>
            <span>Plat <strong style={{ color: "#40c4ff" }}>{Math.round(state.plateauPressure)}</strong></span>
            <span>PEEP <strong style={{ color: "#40c4ff" }}>{Math.round(state.peep)}</strong></span>
            <span>TV <strong style={{ color: "#ffd740" }}>{Math.round(state.tidalVolume)}</strong> mL</span>
            <span>Cmpl <strong style={{ color: "#00e676" }}>{Math.round(state.lungCompliance)}</strong></span>
            <span>RR <strong style={{ color: "#ffd740" }}>{Math.round(state.respiratoryRate)}</strong></span>
          </>
        )}
      </div>

      {/* Waveform SVGs */}
      <div className="flex flex-col gap-1">
        {show.includes("pressure") && (
          <WaveformRow
            label="Paw"
            color="var(--mon-vent-pressure, #40c4ff)"
            points={data.pressure}
            viewBox={data.viewBox}
            zeroY={60}
            unit="cmH₂O"
          />
        )}
        {show.includes("flow") && (
          <WaveformRow
            label="Flow"
            color="var(--mon-vent-flow, #ea80fc)"
            points={data.flow}
            viewBox={data.viewBox}
            zeroY={130}
            unit="L/min"
          />
        )}
        {show.includes("volume") && (
          <WaveformRow
            label="Vol"
            color="var(--mon-vent-volume, #ffd740)"
            points={data.volume}
            viewBox={data.viewBox}
            zeroY={195}
            unit="mL"
          />
        )}
      </div>

      {/* Educational explanation */}
      {data.patternExplanation && (
        <p
          className="mt-2"
          style={{ fontSize: "9px", color: "#4a6a88", lineHeight: 1.5, letterSpacing: "0.01em" }}
        >
          {data.patternExplanation}
        </p>
      )}
    </div>
  );
}

// ─── Single waveform row ──────────────────────────────────────────────────────

function WaveformRow({
  label,
  color,
  points,
  viewBox,
  zeroY,
  unit,
}: {
  label: string;
  color: string;
  points: Array<{ x: number; y: number }>;
  viewBox: string;
  zeroY: number;
  unit: string;
}) {
  return (
    <div className="relative">
      {/* Label */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "8px",
          fontWeight: 700,
          color,
          letterSpacing: "0.1em",
          width: 28,
          textAlign: "right",
        }}
        aria-hidden
      >
        {label}
      </div>

      <div style={{ marginLeft: 32 }}>
        <svg
          viewBox={viewBox}
          className="w-full"
          style={{ height: 44, background: "var(--mon-ecg-bg, #040e18)", borderRadius: 3 }}
          role="img"
          aria-label={`${label} waveform (${unit})`}
        >
          {/* Zero line */}
          <line
            x1="0"
            y1={zeroY}
            x2="500"
            y2={zeroY}
            stroke="#0d2a40"
            strokeWidth="1"
          />
          {/* Waveform */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsToString(points)}
          />
        </svg>
      </div>
    </div>
  );
}
