"use client";

/**
 * VentScalarDisplay — three stacked SVG panels rendering Pressure, Flow, and Volume
 * waveforms from a VentWaveformResult. All rendering is pure SVG — no Canvas, no DOM
 * measurement — making it safe for SSR, screenshots, and marketing assets.
 *
 * Visual design: Midnight-compatible via CSS variables. Each panel has:
 *   - Background grid (minor + major)
 *   - Clinical reference lines (PEEP, zero-flow, etc.)
 *   - Colored waveform trace
 *   - Axis labels
 *   - Breath-start vertical guides
 */

import type { VentWaveformResult } from "@/lib/rt-ventilator/vent-waveform-generator";
import {
  ventWaveformToSvgPath,
  clinicalValueToSvgY,
} from "@/lib/rt-ventilator/vent-waveform-generator";

// ─── Panel constants ───────────────────────────────────────────────────────────

const PANEL_W = 700;
const PANEL_H = 120;
const LABEL_W = 52; // left axis label area
const PLOT_W = PANEL_W - LABEL_W;

// Trace colors — CSS variable references for Midnight theme compatibility
const COLOR_PRESSURE = "var(--semantic-info)";
const COLOR_FLOW = "var(--semantic-chart-3)";
const COLOR_VOLUME = "var(--semantic-success)";

type PanelTrace = "pressure" | "flow" | "volume";

// ─── Individual panel ──────────────────────────────────────────────────────────

function WaveformPanel({
  result,
  trace,
  label,
  unit,
  color,
  refLines,
}: {
  result: VentWaveformResult;
  trace: PanelTrace;
  label: string;
  unit: string;
  color: string;
  refLines?: Array<{ value: number; dash?: boolean; label?: string }>;
}) {
  const range = result.ranges[trace];
  const svgPath = ventWaveformToSvgPath({
    points: result.points,
    trace,
    range,
    viewWidth: PLOT_W,
    viewHeight: PANEL_H,
    totalSeconds: result.totalSeconds,
  });

  const breathGuides = result.breathBoundaries.map((bt) => {
    const x = (bt / result.totalSeconds) * PLOT_W;
    return { x };
  });

  return (
    <div className="relative">
      {/* Panel label */}
      <div className="absolute left-0 top-0 flex h-full w-12 flex-col items-center justify-center gap-0.5">
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color, writingMode: "vertical-lr", transform: "rotate(180deg)" }}>
          {label}
        </span>
        <span className="text-[8px] text-[var(--semantic-text-muted)]" style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}>
          {unit}
        </span>
      </div>

      {/* SVG plot */}
      <div className="ml-12">
        <svg
          viewBox={`0 0 ${PLOT_W} ${PANEL_H}`}
          className="w-full"
          style={{ height: PANEL_H, maxHeight: PANEL_H }}
          aria-label={`${label} waveform`}
          role="img"
        >
          {/* Grid */}
          {[0.25, 0.5, 0.75].map((frac) => (
            <line
              key={frac}
              x1={0}
              y1={PANEL_H * frac}
              x2={PLOT_W}
              y2={PANEL_H * frac}
              stroke="var(--semantic-border-soft)"
              strokeWidth="0.5"
              strokeDasharray="3 3"
            />
          ))}

          {/* Breath boundaries */}
          {breathGuides.map(({ x }, i) => (
            <line
              key={i}
              x1={x}
              y1={0}
              x2={x}
              y2={PANEL_H}
              stroke="var(--semantic-border-soft)"
              strokeWidth="0.8"
            />
          ))}

          {/* Clinical reference lines */}
          {(refLines ?? []).map((rl, i) => {
            const y = clinicalValueToSvgY(rl.value, range, PANEL_H);
            if (y < 0 || y > PANEL_H) return null;
            return (
              <g key={i}>
                <line
                  x1={0}
                  y1={y}
                  x2={PLOT_W}
                  y2={y}
                  stroke={color}
                  strokeWidth="0.8"
                  strokeOpacity="0.35"
                  strokeDasharray={rl.dash ? "4 3" : undefined}
                />
                {rl.label && (
                  <text
                    x={PLOT_W - 4}
                    y={y - 2}
                    textAnchor="end"
                    fontSize="7"
                    fill={color}
                    fillOpacity="0.7"
                  >
                    {rl.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Waveform trace */}
          <path
            d={svgPath}
            fill="none"
            stroke={color}
            strokeWidth="1.75"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Inline axis labels (min/max) */}
          <text x={2} y={10} fontSize="7.5" fill="var(--semantic-text-muted)">
            {range[1].toFixed(0)}
          </text>
          <text x={2} y={PANEL_H - 3} fontSize="7.5" fill="var(--semantic-text-muted)">
            {range[0].toFixed(0)}
          </text>
        </svg>
      </div>
    </div>
  );
}

// ─── Derived value band ────────────────────────────────────────────────────────

function DerivedValueBand({ result }: { result: VentWaveformResult }) {
  const d = result.derived;
  const items = [
    { label: "PIP", value: `${d.peakPressure} cmH₂O` },
    d.plateauPressure != null ? { label: "Pplat", value: `${d.plateauPressure} cmH₂O` } : null,
    { label: "Vt", value: `${d.tidalVolumeMeasured} mL` },
    { label: "I:E", value: d.ieRatio },
    { label: "MAP", value: `${d.meanAirwayPressure} cmH₂O` },
    { label: "τ", value: `${d.timeConstant}s` },
    d.hasAutoPeep ? { label: "Auto-PEEP", value: "detected", urgent: true } : null,
  ].filter(Boolean) as Array<{ label: string; value: string; urgent?: boolean }>;

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-[var(--semantic-border-soft)] pt-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            {item.label}
          </span>
          <span
            className={`text-xs font-bold ${item.urgent ? "text-[var(--semantic-warning)]" : "text-[var(--semantic-text-primary)]"}`}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Annotation overlay (text callouts on waveform) ────────────────────────────

function AnnotationBadges({ result }: { result: VentWaveformResult }) {
  if (result.annotations.length === 0) return null;
  const visible = result.annotations.filter((a) => a.kind === "asynchrony" || a.kind === "auto_peep");
  if (visible.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((ann, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--semantic-warning)] px-2 py-0.5 text-[10px] font-bold text-[var(--semantic-warning)]"
        >
          ⚠ {ann.label}
        </span>
      ))}
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export type VentScalarDisplayProps = {
  result: VentWaveformResult;
  /** Clinical label shown above the panel cluster */
  label?: string;
  /** PEEP value to draw as reference line on pressure panel */
  peep?: number;
  /** Whether to show the derived values band below the panels */
  showDerivedValues?: boolean;
  /** Whether to show annotation badges (asynchrony, auto-PEEP alerts) */
  showAnnotations?: boolean;
  className?: string;
};

export function VentScalarDisplay({
  result,
  label,
  peep,
  showDerivedValues = true,
  showAnnotations = true,
  className = "",
}: VentScalarDisplayProps) {
  const peepValue = peep ?? result.annotations.find((a) => a.kind === "peep") ? 5 : undefined;

  return (
    <div
      className={`rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)] ${className}`}
      data-nn-vent-scalar-display=""
    >
      {/* Header */}
      {label && (
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--semantic-text-muted)]">
            {label}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold text-[var(--semantic-text-secondary)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-5 rounded-full" style={{ background: COLOR_PRESSURE }} />
              Pressure (cmH₂O)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-5 rounded-full" style={{ background: COLOR_FLOW }} />
              Flow (L/s)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-5 rounded-full" style={{ background: COLOR_VOLUME }} />
              Volume (mL)
            </span>
          </div>
        </div>
      )}

      {/* Three trace panels */}
      <div className="space-y-1 overflow-hidden rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface-alt)_60%,transparent)]">
        {/* Pressure trace */}
        <div className="border-b border-[var(--semantic-border-soft)] px-2 pt-2 pb-1">
          <WaveformPanel
            result={result}
            trace="pressure"
            label="Pressure"
            unit="cmH₂O"
            color={COLOR_PRESSURE}
            refLines={[
              peepValue != null ? { value: peepValue, dash: true, label: `PEEP ${peepValue}` } : undefined,
            ].filter(Boolean) as Array<{ value: number; dash?: boolean; label?: string }>}
          />
        </div>

        {/* Flow trace */}
        <div className="border-b border-[var(--semantic-border-soft)] px-2 py-1">
          <WaveformPanel
            result={result}
            trace="flow"
            label="Flow"
            unit="L/s"
            color={COLOR_FLOW}
            refLines={[
              { value: 0, dash: false, label: "0" },
            ]}
          />
        </div>

        {/* Volume trace */}
        <div className="px-2 pb-2 pt-1">
          <WaveformPanel
            result={result}
            trace="volume"
            label="Volume"
            unit="mL"
            color={COLOR_VOLUME}
            refLines={[
              { value: 0, dash: true },
            ]}
          />
        </div>
      </div>

      {/* Derived values */}
      {showDerivedValues && (
        <div className="mt-3">
          <DerivedValueBand result={result} />
        </div>
      )}

      {/* Annotation badges */}
      {showAnnotations && result.annotations.length > 0 && (
        <div className="mt-2">
          <AnnotationBadges result={result} />
        </div>
      )}
    </div>
  );
}

// ─── Compact variant (for hub/marketing previews) ──────────────────────────────

export function VentScalarDisplayCompact({ result, label }: { result: VentWaveformResult; label?: string }) {
  return (
    <VentScalarDisplay
      result={result}
      label={label}
      showDerivedValues={false}
      showAnnotations={false}
    />
  );
}
