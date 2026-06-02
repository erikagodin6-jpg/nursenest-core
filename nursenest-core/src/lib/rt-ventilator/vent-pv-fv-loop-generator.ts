/**
 * Pressure-Volume and Flow-Volume Loop Generator
 *
 * Derives P-V and F-V loops from the existing VentWaveformResult point array.
 * No new physics — just different coordinate mappings of the same data.
 *
 * Clinical interpretation:
 *
 *   P-V Loop (Pressure on X, Volume on Y):
 *     - Slope = dynamic compliance (ΔV/ΔP)
 *     - Loop area = resistive work of breathing
 *     - Upper inflection point (UIP) → overdistension risk
 *     - Lower inflection point (LIP) → recruitment / de-recruitment zone
 *     - Rightward shift = decreased compliance (ARDS, edema, PTX)
 *     - Wider loop = increased resistance (bronchospasm, secretions)
 *
 *   F-V Loop (Volume on X, Flow on Y):
 *     - Clockwise direction for mechanically ventilated patient
 *     - Inspiratory limb (positive flow) — shape depends on mode
 *     - Expiratory limb (negative flow) — shape depends on resistance/compliance
 *     - Scooping of expiratory limb = air trapping / obstruction
 *     - Reduced peak expiratory flow = high resistance
 *     - Incomplete return to zero = auto-PEEP / air trapping
 *
 * Both loops are returned as SVG path strings for direct rendering.
 */

import type { VentWaveformResult, VentPoint } from "./vent-waveform-generator";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type LoopPoint = {
  x: number;
  y: number;
};

export type PvLoopResult = {
  /** Loop path string for SVG */
  path: string;
  /** Inflation limb path (inspiration) */
  inflationPath: string;
  /** Deflation limb path (expiration) */
  deflationPath: string;
  /** Clinical ranges for display */
  ranges: {
    pressure: [min: number, max: number];
    volume: [min: number, max: number];
  };
  /** Estimated dynamic compliance (slope of inflation limb, mL/cmH₂O) */
  dynamicCompliance: number | null;
  /** Upper inflection point pressure (cmH₂O) if detectable */
  upperInflectionPressure: number | null;
};

export type FvLoopResult = {
  path: string;
  inspiratoryPath: string;
  expiratoryPath: string;
  ranges: {
    volume: [min: number, max: number];
    flow: [min: number, max: number];
  };
  /** Peak inspiratory flow (L/s) */
  peakInspFlow: number;
  /** Peak expiratory flow (L/s, magnitude) */
  peakExpFlow: number;
  /** Whether expiratory flow returns to zero (false = air trapping) */
  expFlowReturnsToZero: boolean;
};

export type LoopViewOptions = {
  viewWidth?: number;
  viewHeight?: number;
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function pointsToPath(points: LoopPoint[], close = false): string {
  if (points.length === 0) return "";
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  return close ? `${d} Z` : d;
}

function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  const span = inMax - inMin || 1;
  return outMin + ((value - inMin) / span) * (outMax - outMin);
}

// ─── Breath cycle extraction ───────────────────────────────────────────────────

/**
 * Extracts points for a single breath cycle (the second cycle — first is often
 * a startup transient).
 */
function extractBreathCycle(result: VentWaveformResult): VentPoint[] {
  const boundaries = result.breathBoundaries;
  if (boundaries.length < 2) return result.points;

  const startT = boundaries[1] ?? boundaries[0] ?? 0;
  const endT = boundaries[2] ?? result.totalSeconds;

  return result.points.filter((p) => p.t >= startT && p.t < endT);
}

/**
 * Splits breath cycle into inspiratory (flow ≥ 0) and expiratory (flow < 0) phases.
 */
function splitBreathPhases(points: VentPoint[]): {
  inspiratory: VentPoint[];
  expiratory: VentPoint[];
} {
  const inspiratory: VentPoint[] = [];
  const expiratory: VentPoint[] = [];

  let peakVolumeIdx = 0;
  let peakVol = 0;
  points.forEach((p, i) => {
    if (p.volume > peakVol) { peakVol = p.volume; peakVolumeIdx = i; }
  });

  points.forEach((p, i) => {
    if (i <= peakVolumeIdx) {
      inspiratory.push(p);
    } else {
      expiratory.push(p);
    }
  });

  return { inspiratory, expiratory };
}

// ─── P-V Loop ──────────────────────────────────────────────────────────────────

export function generatePvLoop(result: VentWaveformResult, options: LoopViewOptions = {}): PvLoopResult {
  const vw = options.viewWidth ?? 260;
  const vh = options.viewHeight ?? 200;

  const cycle = extractBreathCycle(result);
  const { inspiratory, expiratory } = splitBreathPhases(cycle);

  const allPressures = cycle.map((p) => p.pressure);
  const allVolumes = cycle.map((p) => p.volume);

  const pMin = Math.max(0, Math.min(...allPressures) - 2);
  const pMax = Math.max(...allPressures) + 3;
  const vMin = 0;
  const vMax = Math.max(...allVolumes) + 50;

  // Map pressure → x, volume → y (y inverted: high volume at top)
  const toPoint = (pt: VentPoint): LoopPoint => ({
    x: mapRange(pt.pressure, pMin, pMax, 0, vw),
    y: mapRange(pt.volume, vMax, vMin, 0, vh), // invert y
  });

  const inflPts = inspiratory.map(toPoint);
  const deflPts = expiratory.map(toPoint);
  const allPts = [...inflPts, ...deflPts];

  // Estimate dynamic compliance from the linear portion of the inflation limb
  // (middle 40–80% of tidal volume range to avoid inflection points)
  let dynamicCompliance: number | null = null;
  const midInsp = inspiratory.filter(
    (p) => p.volume > vMax * 0.15 && p.volume < vMax * 0.85,
  );
  if (midInsp.length >= 4) {
    const first = midInsp[0]!;
    const last = midInsp[midInsp.length - 1]!;
    const dP = last.pressure - first.pressure;
    const dV = last.volume - first.volume;
    if (Math.abs(dP) > 0.5) dynamicCompliance = Math.round(dV / dP);
  }

  // Detect upper inflection point: where slope starts to decrease (overdistension)
  let upperInflectionPressure: number | null = null;
  if (midInsp.length >= 6) {
    for (let i = 2; i < midInsp.length - 2; i++) {
      const slope1 = (midInsp[i]!.volume - midInsp[i - 2]!.volume) / (midInsp[i]!.pressure - midInsp[i - 2]!.pressure);
      const slope2 = (midInsp[i + 2]!.volume - midInsp[i]!.volume) / (midInsp[i + 2]!.pressure - midInsp[i]!.pressure);
      if (slope1 > 0 && slope2 > 0 && slope2 < slope1 * 0.6) {
        upperInflectionPressure = Math.round(midInsp[i]!.pressure);
        break;
      }
    }
  }

  return {
    path: pointsToPath(allPts, false),
    inflationPath: pointsToPath(inflPts),
    deflationPath: pointsToPath(deflPts),
    ranges: {
      pressure: [pMin, pMax],
      volume: [vMin, vMax],
    },
    dynamicCompliance,
    upperInflectionPressure,
  };
}

// ─── F-V Loop ──────────────────────────────────────────────────────────────────

export function generateFvLoop(result: VentWaveformResult, options: LoopViewOptions = {}): FvLoopResult {
  const vw = options.viewWidth ?? 260;
  const vh = options.viewHeight ?? 200;

  const cycle = extractBreathCycle(result);
  const { inspiratory, expiratory } = splitBreathPhases(cycle);

  const allFlows = cycle.map((p) => p.flow);
  const allVols = cycle.map((p) => p.volume);

  const fMin = Math.min(...allFlows) - 0.05;
  const fMax = Math.max(...allFlows) + 0.05;
  const vMin = 0;
  const vMax = Math.max(...allVols) + 10;

  // Map volume → x, flow → y (y inverted: positive flow at top)
  const toPoint = (pt: VentPoint): LoopPoint => ({
    x: mapRange(pt.volume, vMin, vMax, 0, vw),
    y: mapRange(pt.flow, fMax, fMin, 0, vh), // invert y: positive flow at top
  });

  const inspPts = inspiratory.map(toPoint);
  const expPts = expiratory.map(toPoint);

  const peakInspFlow = Math.max(...inspiratory.map((p) => p.flow));
  const peakExpFlow = Math.abs(Math.min(...expiratory.map((p) => p.flow)));

  // Auto-PEEP: expiratory flow does not return within 10% of zero by end of expiration
  const lastExpFlow = expiratory[expiratory.length - 1]?.flow ?? 0;
  const expFlowReturnsToZero = Math.abs(lastExpFlow) < peakExpFlow * 0.15;

  return {
    path: pointsToPath([...inspPts, ...expPts], false),
    inspiratoryPath: pointsToPath(inspPts),
    expiratoryPath: pointsToPath(expPts),
    ranges: {
      volume: [vMin, vMax],
      flow: [fMin, fMax],
    },
    peakInspFlow: Math.round(peakInspFlow * 100) / 100,
    peakExpFlow: Math.round(peakExpFlow * 100) / 100,
    expFlowReturnsToZero,
  };
}

// ─── SVG helpers ───────────────────────────────────────────────────────────────

/**
 * Returns the SVG y-coordinate for a clinical value on a loop axis.
 * Used by loop display components for reference line placement.
 */
export function loopAxisY(value: number, min: number, max: number, height: number): number {
  return mapRange(value, max, min, 0, height); // inverted
}

export function loopAxisX(value: number, min: number, max: number, width: number): number {
  return mapRange(value, min, max, 0, width);
}
