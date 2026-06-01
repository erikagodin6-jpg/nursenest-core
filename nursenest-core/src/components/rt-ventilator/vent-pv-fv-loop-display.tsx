"use client";

/**
 * VentPvFvLoopDisplay — renders Pressure-Volume and Flow-Volume loops
 * derived from a VentWaveformResult. Both loops are pure SVG, SSR-safe.
 *
 * Clinical interpretation shown inline:
 *   P-V loop: slope = compliance, area = resistive work
 *   F-V loop: expiratory scooping = obstruction, incomplete return = auto-PEEP
 */

import type { VentWaveformResult } from "@/lib/rt-ventilator/vent-waveform-generator";
import {
  generatePvLoop,
  generateFvLoop,
  loopAxisY,
  loopAxisX,
} from "@/lib/rt-ventilator/vent-pv-fv-loop-generator";

const LOOP_W = 240;
const LOOP_H = 180;

// ─── P-V Loop panel ────────────────────────────────────────────────────────────

function PvLoopPanel({ result }: { result: VentWaveformResult }) {
  const pv = generatePvLoop(result, { viewWidth: LOOP_W, viewHeight: LOOP_H });
  const zeroVolY = loopAxisY(0, pv.ranges.volume[0], pv.ranges.volume[1], LOOP_H);
  const peepX = loopAxisX(result.ranges.pressure[0] + 2, pv.ranges.pressure[0], pv.ranges.pressure[1], LOOP_W);

  return (
    <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          P-V Loop
        </p>
        <div className="flex gap-2 text-[9px] text-[var(--semantic-text-muted)]">
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-3 rounded-full bg-[var(--semantic-brand)]" /> Inflation
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-3 rounded-full bg-[var(--semantic-chart-3)]" /> Deflation
          </span>
        </div>
      </div>
      <svg viewBox={`0 0 ${LOOP_W} ${LOOP_H}`} className="w-full" role="img" aria-label="Pressure-Volume loop">
        {/* Axes */}
        <line x1={0} y1={zeroVolY} x2={LOOP_W} y2={zeroVolY} stroke="var(--semantic-border-soft)" strokeWidth="0.8" />
        <line x1={peepX} y1={0} x2={peepX} y2={LOOP_H} stroke="var(--semantic-border-soft)" strokeWidth="0.8" />

        {/* Inflation limb */}
        <path
          d={pv.inflationPath}
          fill="none"
          stroke="var(--semantic-brand)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Deflation limb */}
        <path
          d={pv.deflationPath}
          fill="none"
          stroke="var(--semantic-chart-3)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 2"
        />

        {/* Axis labels */}
        <text x={LOOP_W - 2} y={zeroVolY - 3} textAnchor="end" fontSize="7" fill="var(--semantic-text-muted)">
          Pressure (cmH₂O) →
        </text>
        <text x={3} y={8} fontSize="7" fill="var(--semantic-text-muted)">
          Volume (mL) ↑
        </text>
      </svg>

      {/* Derived values */}
      <div className="mt-2 flex flex-wrap gap-3 text-[10px]">
        {pv.dynamicCompliance != null && (
          <div>
            <span className="font-semibold text-[var(--semantic-text-muted)]">Cdyn </span>
            <span className="font-bold text-[var(--semantic-text-primary)]">{pv.dynamicCompliance} mL/cmH₂O</span>
          </div>
        )}
        {pv.upperInflectionPressure != null && (
          <div>
            <span className="font-semibold text-[var(--semantic-warning)]">UIP </span>
            <span className="font-bold text-[var(--semantic-warning)]">{pv.upperInflectionPressure} cmH₂O</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── F-V Loop panel ────────────────────────────────────────────────────────────

function FvLoopPanel({ result }: { result: VentWaveformResult }) {
  const fv = generateFvLoop(result, { viewWidth: LOOP_W, viewHeight: LOOP_H });
  const zeroFlowY = loopAxisY(0, fv.ranges.flow[0], fv.ranges.flow[1], LOOP_H);
  const zeroVolX = loopAxisX(0, fv.ranges.volume[0], fv.ranges.volume[1], LOOP_W);

  return (
    <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          F-V Loop
        </p>
        <div className="flex gap-2 text-[9px] text-[var(--semantic-text-muted)]">
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-3 rounded-full bg-[var(--semantic-success)]" /> Insp
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-3 rounded-full bg-[var(--semantic-error)]" /> Exp
          </span>
        </div>
      </div>
      <svg viewBox={`0 0 ${LOOP_W} ${LOOP_H}`} className="w-full" role="img" aria-label="Flow-Volume loop">
        {/* Axes */}
        <line x1={0} y1={zeroFlowY} x2={LOOP_W} y2={zeroFlowY} stroke="var(--semantic-border-soft)" strokeWidth="0.8" />
        <line x1={zeroVolX} y1={0} x2={zeroVolX} y2={LOOP_H} stroke="var(--semantic-border-soft)" strokeWidth="0.8" />

        {/* Inspiratory limb */}
        <path
          d={fv.inspiratoryPath}
          fill="none"
          stroke="var(--semantic-success)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Expiratory limb */}
        <path
          d={fv.expiratoryPath}
          fill="none"
          stroke="var(--semantic-error)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Axis labels */}
        <text x={LOOP_W - 2} y={zeroFlowY - 3} textAnchor="end" fontSize="7" fill="var(--semantic-text-muted)">
          Volume (mL) →
        </text>
        <text x={3} y={8} fontSize="7" fill="var(--semantic-text-muted)">
          Flow (L/s) ↑
        </text>

        {/* Auto-PEEP warning */}
        {!fv.expFlowReturnsToZero && (
          <text x={LOOP_W / 2} y={LOOP_H - 5} textAnchor="middle" fontSize="7" fill="var(--semantic-warning)" fontWeight="bold">
            ⚠ Flow not at zero — auto-PEEP
          </text>
        )}
      </svg>

      {/* Derived values */}
      <div className="mt-2 flex flex-wrap gap-3 text-[10px]">
        <div>
          <span className="font-semibold text-[var(--semantic-text-muted)]">Peak Insp </span>
          <span className="font-bold text-[var(--semantic-text-primary)]">{fv.peakInspFlow.toFixed(2)} L/s</span>
        </div>
        <div>
          <span className="font-semibold text-[var(--semantic-text-muted)]">Peak Exp </span>
          <span className="font-bold text-[var(--semantic-text-primary)]">{fv.peakExpFlow.toFixed(2)} L/s</span>
        </div>
        {!fv.expFlowReturnsToZero && (
          <div>
            <span className="font-bold text-[var(--semantic-warning)]">Auto-PEEP detected</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export function VentPvFvLoopDisplay({
  result,
  showPv = true,
  showFv = true,
}: {
  result: VentWaveformResult;
  showPv?: boolean;
  showFv?: boolean;
}) {
  if (!showPv && !showFv) return null;
  return (
    <div className={`grid gap-4 ${showPv && showFv ? "sm:grid-cols-2" : "grid-cols-1"}`}>
      {showPv && <PvLoopPanel result={result} />}
      {showFv && <FvLoopPanel result={result} />}
    </div>
  );
}
