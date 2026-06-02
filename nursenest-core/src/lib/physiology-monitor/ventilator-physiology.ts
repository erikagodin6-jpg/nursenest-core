/**
 * Ventilator Physiology — SVG Waveform Data Generator
 *
 * Generates physiologically accurate pressure, flow, and volume waveform
 * data points from a PhysiologyState. The rendering layer (React SVG) turns
 * these into polyline paths.
 *
 * Breath cycle math:
 *   - Inspiratory time = I:E ratio applied to 60/RR
 *   - Pressure: volume-controlled square → trapezoidal; pressure-controlled sine
 *   - Flow: volume-controlled square wave; PSV decreasing sinusoid
 *   - Volume: triangular integration of flow
 *
 * Pathologic patterns generated:
 *   - ARDS: reduced compliance → steep pressure rise, high plateau
 *   - Air trapping / auto-PEEP: flow doesn't return to zero before next breath
 *   - Bronchospasm: "shark fin" decelerating expiratory flow
 *   - Patient-ventilator asynchrony: double trigger, flow fighting
 *   - Tube obstruction: sudden pressure spike mid-breath
 */

import type { PhysiologyState } from "./physiology-state";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WaveformPoint {
  x: number;
  y: number;
}

export interface VentWaveformData {
  pressure: WaveformPoint[];
  flow: WaveformPoint[];
  volume: WaveformPoint[];
  viewBox: string;
  breathsRendered: number;
  /** Human-readable label for the current waveform pattern. */
  patternLabel: string;
  /** Educational note about what the waveform pattern indicates. */
  patternExplanation: string;
}

export type VentWaveformPattern =
  | "normal_vc"
  | "ards"
  | "air_trapping"
  | "bronchospasm"
  | "asynchrony"
  | "tube_obstruction"
  | "circuit_leak";

// ─── Waveform configuration ───────────────────────────────────────────────────

const SVG_WIDTH = 500;
const SVG_HEIGHT = 200;
const PRESSURE_ZERO_Y = 60;   // Y coord for PEEP baseline
const PRESSURE_SCALE = 2.5;   // pixels per cmH2O above PEEP
const FLOW_ZERO_Y = 130;       // Y coord for zero flow
const FLOW_SCALE = 1.6;        // pixels per L/min
const VOLUME_ZERO_Y = 195;     // Y coord for zero volume
const VOLUME_SCALE = 0.24;     // pixels per mL

// ─── Pattern detection ────────────────────────────────────────────────────────

export function detectVentPattern(state: PhysiologyState): VentWaveformPattern {
  if (!state.isVentilated) return "normal_vc";
  if (state.peakInspiratoryPressure > 45) return "tube_obstruction";
  if (state.lungCompliance < 20) return "ards";
  if (state.airwayResistance > 25) return "bronchospasm";
  if (state.peep > state.peep * 1.4) return "air_trapping"; // simplified heuristic
  // Air trapping when RR is very high (intrinsic PEEP)
  if (state.respiratoryRate > 28) return "air_trapping";
  return "normal_vc";
}

// ─── Main generator ───────────────────────────────────────────────────────────

export function generateVentWaveformData(state: PhysiologyState): VentWaveformData {
  if (!state.isVentilated) {
    return buildSpontaneousBreathingData(state);
  }

  const pattern = detectVentPattern(state);
  const rr = Math.max(5, Math.min(35, state.respiratoryRate));
  const breathPeriodPx = SVG_WIDTH / Math.max(1, Math.round((rr / 60) * (SVG_WIDTH / 25)));

  switch (pattern) {
    case "ards": return buildArdsWaveform(state, breathPeriodPx, rr);
    case "bronchospasm": return buildBronchospasmWaveform(state, breathPeriodPx, rr);
    case "air_trapping": return buildAirTrappingWaveform(state, breathPeriodPx, rr);
    case "tube_obstruction": return buildTubeObstructionWaveform(state, breathPeriodPx, rr);
    default: return buildNormalVcWaveform(state, breathPeriodPx, rr);
  }
}

// ─── Normal VC waveform ───────────────────────────────────────────────────────

function buildNormalVcWaveform(state: PhysiologyState, breathPx: number, rr: number): VentWaveformData {
  const pressure: WaveformPoint[] = [];
  const flow: WaveformPoint[] = [];
  const volume: WaveformPoint[] = [];

  const breathCount = Math.max(2, Math.round(SVG_WIDTH / breathPx));
  const ieFraction = 0.33; // I:E 1:2
  const tInspPx = breathPx * ieFraction;
  const tExpPx = breathPx * (1 - ieFraction);

  const pip = state.peakInspiratoryPressure;
  const peep = state.peep;
  const peepY = PRESSURE_ZERO_Y;
  const pipY = peepY - (pip - peep) * PRESSURE_SCALE;
  const flowPeak = 40; // L/min
  const tv = state.tidalVolume;

  for (let b = 0; b < breathCount; b++) {
    const xStart = b * breathPx;
    const xInspEnd = xStart + tInspPx;
    const xExpEnd = xStart + breathPx;

    // Pressure: square wave with rapid rise/fall
    pressure.push({ x: xStart, y: peepY });
    pressure.push({ x: xStart + 3, y: pipY });
    pressure.push({ x: xInspEnd - 3, y: pipY });
    pressure.push({ x: xInspEnd, y: peepY });
    pressure.push({ x: xExpEnd, y: peepY });

    // Flow: positive square during inspiration, negative passive during expiration
    flow.push({ x: xStart, y: FLOW_ZERO_Y });
    flow.push({ x: xStart + 3, y: FLOW_ZERO_Y - flowPeak * FLOW_SCALE });
    flow.push({ x: xInspEnd - 3, y: FLOW_ZERO_Y - flowPeak * FLOW_SCALE });
    flow.push({ x: xInspEnd, y: FLOW_ZERO_Y + (flowPeak * 0.7) * FLOW_SCALE });
    flow.push({ x: xInspEnd + tExpPx * 0.4, y: FLOW_ZERO_Y + (flowPeak * 0.3) * FLOW_SCALE });
    flow.push({ x: xExpEnd, y: FLOW_ZERO_Y });

    // Volume: triangular rise then fall
    volume.push({ x: xStart, y: VOLUME_ZERO_Y });
    volume.push({ x: xInspEnd, y: VOLUME_ZERO_Y - tv * VOLUME_SCALE });
    volume.push({ x: xExpEnd, y: VOLUME_ZERO_Y });
  }

  return {
    pressure, flow, volume,
    viewBox: `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`,
    breathsRendered: breathCount,
    patternLabel: "Normal VC ventilation",
    patternExplanation: `TV ${Math.round(tv)} mL  |  RR ${Math.round(rr)}  |  PIP ${Math.round(pip)} cmH₂O  |  PEEP ${Math.round(peep)}`,
  };
}

// ─── ARDS waveform ────────────────────────────────────────────────────────────

function buildArdsWaveform(state: PhysiologyState, breathPx: number, rr: number): VentWaveformData {
  const pressure: WaveformPoint[] = [];
  const flow: WaveformPoint[] = [];
  const volume: WaveformPoint[] = [];

  const breathCount = Math.max(2, Math.round(SVG_WIDTH / breathPx));
  const ieFraction = 0.4; // longer I-time in ARDS (1:1.5)
  const tInspPx = breathPx * ieFraction;

  // ARDS: very high PIP, high plateau, low TV (lung protective)
  const pip = Math.min(75, state.peakInspiratoryPressure);
  const plateau = Math.min(65, state.plateauPressure);
  const peep = Math.max(8, state.peep);
  const peepY = PRESSURE_ZERO_Y;
  const pipY = peepY - (pip - peep) * PRESSURE_SCALE;
  const plateauY = peepY - (plateau - peep) * PRESSURE_SCALE;
  const tv = Math.min(450, state.tidalVolume);
  const flowPeak = 35;

  for (let b = 0; b < breathCount; b++) {
    const xStart = b * breathPx;
    const xPlateau = xStart + tInspPx * 0.3;
    const xInspEnd = xStart + tInspPx;
    const xExpEnd = xStart + breathPx;

    // Pressure: rapid rise to PIP, then falls to plateau (inspiratory pause pattern)
    pressure.push({ x: xStart, y: peepY });
    pressure.push({ x: xStart + 4, y: pipY });
    pressure.push({ x: xPlateau, y: plateauY });
    pressure.push({ x: xInspEnd - 4, y: plateauY });
    pressure.push({ x: xInspEnd, y: peepY });
    pressure.push({ x: xExpEnd, y: peepY });

    // Flow: peak then decelerating (pressure-regulated pattern)
    flow.push({ x: xStart, y: FLOW_ZERO_Y });
    flow.push({ x: xStart + 5, y: FLOW_ZERO_Y - flowPeak * FLOW_SCALE });
    flow.push({ x: xPlateau, y: FLOW_ZERO_Y - (flowPeak * 0.4) * FLOW_SCALE });
    flow.push({ x: xInspEnd, y: FLOW_ZERO_Y + (flowPeak * 0.6) * FLOW_SCALE });
    flow.push({ x: xInspEnd + (xExpEnd - xInspEnd) * 0.3, y: FLOW_ZERO_Y + (flowPeak * 0.25) * FLOW_SCALE });
    flow.push({ x: xExpEnd, y: FLOW_ZERO_Y });

    volume.push({ x: xStart, y: VOLUME_ZERO_Y });
    volume.push({ x: xInspEnd, y: VOLUME_ZERO_Y - tv * VOLUME_SCALE });
    volume.push({ x: xExpEnd, y: VOLUME_ZERO_Y });
  }

  return {
    pressure, flow, volume,
    viewBox: `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`,
    breathsRendered: breathCount,
    patternLabel: "ARDS — Reduced compliance",
    patternExplanation: `High PIP ${Math.round(pip)} cmH₂O  |  Plateau ${Math.round(plateau)} cmH₂O  |  Compliance ${Math.round(state.lungCompliance)} mL/cmH₂O  |  Target TV ≤ 6 mL/kg IBW`,
  };
}

// ─── Bronchospasm "shark fin" waveform ────────────────────────────────────────

function buildBronchospasmWaveform(state: PhysiologyState, breathPx: number, rr: number): VentWaveformData {
  const pressure: WaveformPoint[] = [];
  const flow: WaveformPoint[] = [];
  const volume: WaveformPoint[] = [];

  const breathCount = Math.max(2, Math.round(SVG_WIDTH / breathPx));
  const ieFraction = 0.33;
  const tInspPx = breathPx * ieFraction;
  const tExpPx = breathPx * (1 - ieFraction);

  const pip = state.peakInspiratoryPressure;
  const peep = state.peep;
  const peepY = PRESSURE_ZERO_Y;
  const pipY = peepY - (pip - peep) * PRESSURE_SCALE;
  const flowPeak = 45;
  const tv = state.tidalVolume;

  for (let b = 0; b < breathCount; b++) {
    const xStart = b * breathPx;
    const xInspEnd = xStart + tInspPx;
    const xExpEnd = xStart + breathPx;

    pressure.push({ x: xStart, y: peepY });
    pressure.push({ x: xStart + 3, y: pipY });
    pressure.push({ x: xInspEnd - 3, y: pipY });
    pressure.push({ x: xInspEnd, y: peepY + 5 }); // slight auto-PEEP
    pressure.push({ x: xExpEnd, y: peepY + 5 });

    // "Shark fin" expiratory flow: linear decrease never fully returns to zero
    flow.push({ x: xStart, y: FLOW_ZERO_Y + 5 }); // doesn't quite reach zero (trapped)
    flow.push({ x: xStart + 3, y: FLOW_ZERO_Y - flowPeak * FLOW_SCALE });
    flow.push({ x: xInspEnd - 3, y: FLOW_ZERO_Y - flowPeak * FLOW_SCALE });
    flow.push({ x: xInspEnd, y: FLOW_ZERO_Y + (flowPeak * 0.9) * FLOW_SCALE });
    // Shark fin: slow linear decay, doesn't reach zero
    flow.push({ x: xExpEnd, y: FLOW_ZERO_Y + 6 });

    volume.push({ x: xStart, y: VOLUME_ZERO_Y });
    volume.push({ x: xInspEnd, y: VOLUME_ZERO_Y - tv * VOLUME_SCALE });
    volume.push({ x: xExpEnd, y: VOLUME_ZERO_Y + 8 }); // gas trapping shown as rising baseline
  }

  return {
    pressure, flow, volume,
    viewBox: `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`,
    breathsRendered: breathCount,
    patternLabel: "Bronchospasm — Shark fin pattern",
    patternExplanation: `Expiratory flow not returning to zero. Resistance ${Math.round(state.airwayResistance)} cmH₂O/L/s. Treatment: bronchodilators, increased expiratory time.`,
  };
}

// ─── Air trapping / auto-PEEP ─────────────────────────────────────────────────

function buildAirTrappingWaveform(state: PhysiologyState, breathPx: number, rr: number): VentWaveformData {
  const pressure: WaveformPoint[] = [];
  const flow: WaveformPoint[] = [];
  const volume: WaveformPoint[] = [];

  const breathCount = Math.max(2, Math.round(SVG_WIDTH / breathPx));
  const pip = state.peakInspiratoryPressure;
  const peep = state.peep;
  const peepY = PRESSURE_ZERO_Y;
  const pipY = peepY - (pip - peep) * PRESSURE_SCALE;
  const flowPeak = 40;
  const tv = state.tidalVolume;
  const ieFraction = 0.4; // insufficient expiratory time

  for (let b = 0; b < breathCount; b++) {
    const xStart = b * breathPx;
    const xInspEnd = xStart + breathPx * ieFraction;
    const xExpEnd = xStart + breathPx;
    const autoPeepDrift = b * 5; // escalating auto-PEEP offset in pixels

    pressure.push({ x: xStart, y: peepY - autoPeepDrift * 0.4 });
    pressure.push({ x: xStart + 4, y: pipY - autoPeepDrift * 0.4 });
    pressure.push({ x: xInspEnd, y: peepY - autoPeepDrift * 0.4 });
    pressure.push({ x: xExpEnd, y: peepY - autoPeepDrift * 0.4 });

    // Expiratory flow still running when next breath triggers
    flow.push({ x: xStart, y: FLOW_ZERO_Y + autoPeepDrift * 0.6 });
    flow.push({ x: xStart + 4, y: FLOW_ZERO_Y - flowPeak * FLOW_SCALE });
    flow.push({ x: xInspEnd, y: FLOW_ZERO_Y + (flowPeak * 0.8) * FLOW_SCALE });
    flow.push({ x: xExpEnd, y: FLOW_ZERO_Y + autoPeepDrift * 0.6 }); // doesn't return to 0

    volume.push({ x: xStart, y: VOLUME_ZERO_Y - autoPeepDrift * 0.5 });
    volume.push({ x: xInspEnd, y: VOLUME_ZERO_Y - tv * VOLUME_SCALE - autoPeepDrift * 0.5 });
    volume.push({ x: xExpEnd, y: VOLUME_ZERO_Y - autoPeepDrift * 0.5 });
  }

  return {
    pressure, flow, volume,
    viewBox: `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`,
    breathsRendered: breathCount,
    patternLabel: "Air trapping — Auto-PEEP",
    patternExplanation: `RR ${Math.round(rr)} too fast. Expiratory flow not completing before next breath. Reduce RR or I:E ratio to allow full exhalation.`,
  };
}

// ─── Tube obstruction ────────────────────────────────────────────────────────

function buildTubeObstructionWaveform(state: PhysiologyState, breathPx: number, rr: number): VentWaveformData {
  const pressure: WaveformPoint[] = [];
  const flow: WaveformPoint[] = [];
  const volume: WaveformPoint[] = [];

  const breathCount = Math.max(2, Math.round(SVG_WIDTH / breathPx));
  const pip = state.peakInspiratoryPressure;
  const peep = state.peep;
  const peepY = PRESSURE_ZERO_Y;
  const ieFraction = 0.33;

  for (let b = 0; b < breathCount; b++) {
    const xStart = b * breathPx;
    const xInspEnd = xStart + breathPx * ieFraction;
    const xExpEnd = xStart + breathPx;
    const obstructionX = xStart + breathPx * 0.15;

    // Pressure: rapid rise, then sudden spike at obstruction
    pressure.push({ x: xStart, y: peepY });
    pressure.push({ x: obstructionX - 2, y: peepY - (pip - peep) * PRESSURE_SCALE * 0.6 });
    pressure.push({ x: obstructionX, y: peepY - (pip - peep) * PRESSURE_SCALE * 1.4 }); // spike
    pressure.push({ x: obstructionX + 3, y: peepY - (pip - peep) * PRESSURE_SCALE * 0.9 });
    pressure.push({ x: xInspEnd, y: peepY });
    pressure.push({ x: xExpEnd, y: peepY });

    // Flow: interrupted / truncated
    flow.push({ x: xStart, y: FLOW_ZERO_Y });
    flow.push({ x: xStart + 3, y: FLOW_ZERO_Y - 30 * FLOW_SCALE });
    flow.push({ x: obstructionX, y: FLOW_ZERO_Y - 15 * FLOW_SCALE }); // flow drops suddenly
    flow.push({ x: xInspEnd, y: FLOW_ZERO_Y + 20 * FLOW_SCALE });
    flow.push({ x: xExpEnd, y: FLOW_ZERO_Y });

    volume.push({ x: xStart, y: VOLUME_ZERO_Y });
    volume.push({ x: xInspEnd, y: VOLUME_ZERO_Y - state.tidalVolume * VOLUME_SCALE * 0.6 }); // reduced TV
    volume.push({ x: xExpEnd, y: VOLUME_ZERO_Y });
  }

  return {
    pressure, flow, volume,
    viewBox: `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`,
    breathsRendered: breathCount,
    patternLabel: "HIGH PRESSURE ALARM — Obstruction",
    patternExplanation: `PIP ${Math.round(pip)} cmH₂O. Check for secretions, kinking, or bite. Suction ETT, confirm tube position.`,
  };
}

// ─── Spontaneous (non-ventilated) breathing ───────────────────────────────────

function buildSpontaneousBreathingData(state: PhysiologyState): VentWaveformData {
  const pressure: WaveformPoint[] = [];
  const flow: WaveformPoint[] = [];
  const volume: WaveformPoint[] = [];

  const rr = Math.max(8, Math.min(40, state.respiratoryRate));
  const breathCount = Math.max(2, Math.round(SVG_WIDTH / (SVG_WIDTH / (rr / 10))));
  const breathPx = SVG_WIDTH / breathCount;
  const ieFraction = 0.4;
  const tInspPx = breathPx * ieFraction;
  const distressMultiplier = rr > 24 ? 1.4 : 1.0;
  const flowPeak = 25 * distressMultiplier;
  const tvApprox = 450;

  for (let b = 0; b < breathCount; b++) {
    const xStart = b * breathPx;
    const xInspEnd = xStart + tInspPx;
    const xExpEnd = xStart + breathPx;

    // Spontaneous: negative pleural pressure during inspiration (shown as negative deflection)
    pressure.push({ x: xStart, y: PRESSURE_ZERO_Y });
    pressure.push({ x: xStart + tInspPx * 0.5, y: PRESSURE_ZERO_Y + 8 * distressMultiplier });
    pressure.push({ x: xInspEnd, y: PRESSURE_ZERO_Y });
    pressure.push({ x: xExpEnd, y: PRESSURE_ZERO_Y });

    flow.push({ x: xStart, y: FLOW_ZERO_Y });
    flow.push({ x: xStart + tInspPx * 0.3, y: FLOW_ZERO_Y - flowPeak * FLOW_SCALE });
    flow.push({ x: xInspEnd, y: FLOW_ZERO_Y + (flowPeak * 0.7) * FLOW_SCALE });
    flow.push({ x: xInspEnd + (xExpEnd - xInspEnd) * 0.5, y: FLOW_ZERO_Y + (flowPeak * 0.2) * FLOW_SCALE });
    flow.push({ x: xExpEnd, y: FLOW_ZERO_Y });

    volume.push({ x: xStart, y: VOLUME_ZERO_Y });
    volume.push({ x: xInspEnd, y: VOLUME_ZERO_Y - tvApprox * VOLUME_SCALE });
    volume.push({ x: xExpEnd, y: VOLUME_ZERO_Y });
  }

  return {
    pressure, flow, volume,
    viewBox: `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`,
    breathsRendered: breathCount,
    patternLabel: "Spontaneous breathing",
    patternExplanation: rr > 24
      ? `RR ${Math.round(rr)} — Respiratory distress. Accessory muscle use. Consider NIV/BiPAP.`
      : `RR ${Math.round(rr)} — Room air or supplemental O₂.`,
  };
}
