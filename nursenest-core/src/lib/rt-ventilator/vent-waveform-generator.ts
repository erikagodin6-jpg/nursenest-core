/**
 * Mechanical Ventilator Waveform Engine
 *
 * Generates clinically accurate Pressure-Time, Flow-Time, and Volume-Time traces
 * from a parametric VentWaveformConfig. Signal physics are based on standard
 * respiratory mechanics (resistive + elastic model, exponential expiratory decay,
 * mode-specific inspiratory flow profiles).
 *
 * Clinical units:
 *   Pressure  — cmH₂O
 *   Flow      — L/s  (positive = inspiratory, negative = expiratory)
 *   Volume    — mL
 *   Time      — seconds
 *
 * Key equations (single-compartment lung model):
 *   τ = Raw × Cst   (time constant, seconds)
 *   Ppeak (VC) = PEEP + Raw·Ḟ + Vt/Cst
 *   Pplat      = PEEP + Vt/Cst              (after end-inspiratory pause)
 *   F(t) exp   = −(Vt/τ)·e^(−t/τ)          (passive expiratory flow)
 *   V(t) exp   = Vt·e^(−t/τ)               (volume remaining in lungs)
 *
 * Architecture mirrors ecg-waveform-generator.ts — pure functions, no DOM/Canvas.
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

export type VentMode =
  | "volume_control"
  | "pressure_control"
  | "pressure_support"
  | "simv"
  | "cpap"
  | "bipap"
  | "aprv"
  | "prvc"
  | "hfov";   // High-Frequency Oscillatory Ventilation — neonatal/ARDS rescue

export type VentFlowPattern = "square" | "decelerating";

export type VentCondition =
  | "normal"
  | "high_resistance"
  | "bronchospasm"
  | "secretion_obstruction"
  | "low_compliance"
  | "ards"
  | "pulmonary_edema"
  | "pneumothorax"
  | "circuit_leak"
  | "ett_cuff_leak"
  | "auto_peep"
  | "patient_agitation"
  | "water_in_circuit"     // oscillating saw-tooth artefact on flow/pressure
  | "circuit_disconnect"   // near-zero pressure/flow after circuit separation
  | "mainstem_intubation"  // one-lung delivery: reduced compliance, high pressures
  | "pulmonary_hemorrhage";// blood in airway — pressure/flow disturbance

export type VentAsynchrony =
  | "none"
  | "flow_starvation"
  | "double_triggering"
  | "auto_triggering"
  | "ineffective_triggering"
  | "delayed_cycling"
  | "premature_cycling"
  | "breath_stacking"
  | "reverse_triggering";  // diaphragm contracts reflexively during/after mandatory breath

export type VentDifficulty = "basic" | "intermediate" | "advanced";

export type VentWaveformConfig = {
  mode: VentMode;
  /** Flow delivery pattern — relevant for volume_control only. Default: "square" */
  flowPattern?: VentFlowPattern;

  // ── Ventilator settings ──────────────────────────────────────────────────────
  /** PEEP in cmH₂O. Typical: 5. Range: 0–20. */
  peep: number;
  /** Peak inspiratory pressure (cmH₂O) for PC/PS/BiPAP/APRV modes. */
  pip?: number;
  /** Pressure support above PEEP (cmH₂O). Used in PS/BiPAP/SIMV-PS. */
  pressureSupport?: number;
  /** Tidal volume in mL. Used in VC/SIMV mandatory breaths. Typical: 400–600. */
  tidalVolume?: number;
  /** Respiratory rate (breaths/min). Typical: 12–16. */
  rr: number;
  /** Inspiratory time (seconds). Typical: 0.8–1.2. */
  ti: number;

  // ── Patient physiology ───────────────────────────────────────────────────────
  /** Static compliance (mL/cmH₂O). Normal: ~60. ARDS: 20–30. Obese: 40–50. */
  compliance: number;
  /** Airway resistance (cmH₂O/L/s). Normal: ~5. Bronchospasm: 15–25. */
  resistance: number;
  /** Intrinsic PEEP / auto-PEEP (cmH₂O). Indicates air trapping when > 0. */
  autoPeep?: number;

  // ── HFOV-specific parameters (mode === "hfov") ──────────────────────────────
  /** HFOV oscillation frequency in Hz. Typical neonatal: 10–15 Hz. Adult ARDS rescue: 5–8 Hz. */
  hfovFrequency?: number;
  /** HFOV amplitude (ΔP) in cmH₂O — controls CO₂ elimination. Typical: 20–60. */
  hfovAmplitude?: number;
  // peep field reused as MAP (Mean Airway Pressure) for HFOV display context

  // ── Condition & asynchrony overlays ─────────────────────────────────────────
  condition?: VentCondition;
  asynchrony?: VentAsynchrony;

  difficulty?: VentDifficulty;
  professionScope?: string[];
};

export type VentPoint = {
  /** Time in seconds from start of display window */
  t: number;
  /** Airway pressure in cmH₂O */
  pressure: number;
  /** Airflow in L/s (positive = inspiratory, negative = expiratory) */
  flow: number;
  /** Lung volume above FRC in mL */
  volume: number;
};

export type VentAnnotationKind =
  | "peep"
  | "pip"
  | "plateau"
  | "auto_peep"
  | "trigger"
  | "cycle"
  | "asynchrony"
  | "leak"
  | "zero_flow"
  | "breath_start";

export type VentAnnotation = {
  t: number;
  label: string;
  trace: "pressure" | "flow" | "volume" | "all";
  kind: VentAnnotationKind;
};

export type VentWaveformRanges = {
  pressure: [min: number, max: number]; // cmH₂O
  flow: [min: number, max: number];     // L/s
  volume: [min: number, max: number];   // mL
};

export type VentWaveformResult = {
  points: VentPoint[];
  /** Total rendered window (seconds) */
  totalSeconds: number;
  /** Clinical display ranges for axis scaling */
  ranges: VentWaveformRanges;
  /** Start time of each breath cycle */
  breathBoundaries: number[];
  /** Educational annotation overlays */
  annotations: VentAnnotation[];
  /** Derived clinical values for the label band */
  derived: VentDerivedValues;
};

export type VentDerivedValues = {
  /** Peak inspiratory pressure (cmH₂O) */
  peakPressure: number;
  /** Plateau pressure (cmH₂O) — set null if no pause */
  plateauPressure: number | null;
  /** Measured tidal volume (mL) — may differ from set in PC/PS modes */
  tidalVolumeMeasured: number;
  /** Time constant (seconds) */
  timeConstant: number;
  /** I:E ratio */
  ieRatio: string;
  /** Mean airway pressure (cmH₂O) */
  meanAirwayPressure: number;
  /** Auto-PEEP present in waveform */
  hasAutoPeep: boolean;
};

// ─── Internal helpers ──────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

/** Deterministic noise seed for micro-variation without DOM randomness */
function deterministicNoise(seed: number, amplitude: number): number {
  const x = Math.sin(seed * 13.7891 + 1.4142) * 31415.927;
  return (x - Math.floor(x) - 0.5) * 2 * amplitude;
}

// ─── Breath-phase generators ───────────────────────────────────────────────────

type PhaseResult = { pressure: number; flow: number; volume: number };

function vcInspiration(
  tInsp: number,
  ti: number,
  vtL: number,
  raw: number,
  cst: number,
  peep: number,
  pattern: VentFlowPattern,
): PhaseResult {
  if (pattern === "decelerating") {
    // Linear flow deceleration: F(t) = F_peak × (1 − t/Ti)
    // where F_peak = 2Vt/Ti so that ∫F dt = Vt
    const fPeak = (2 * vtL) / ti;
    const fInst = fPeak * (1 - tInsp / ti);
    const volume = vtL * (tInsp / ti - (tInsp * tInsp) / (2 * ti * ti)) * 1000;
    const pressure = peep + raw * fInst + volume / (cst * 1000);
    return { pressure, flow: fInst, volume };
  }
  // Square (constant) flow
  const flow = vtL / ti;
  const volume = flow * tInsp * 1000; // mL
  const pressure = peep + raw * flow + volume / (cst * 1000);
  return { pressure, flow, volume };
}

function pcInspiration(
  tInsp: number,
  tau: number,
  drivingPressure: number,
  raw: number,
  cst: number,
  pip: number,
): PhaseResult {
  // Pressure is constant at PIP; flow decelerates exponentially
  const flow = (drivingPressure / raw) * Math.exp(-tInsp / tau);
  const volume = cst * drivingPressure * (1 - Math.exp(-tInsp / tau)) * 1000;
  return { pressure: pip, flow, volume };
}

function psInspiration(
  tInsp: number,
  tau: number,
  ps: number,
  raw: number,
  cst: number,
  peep: number,
): PhaseResult {
  // Identical physics to PC, but driven by pressure support above PEEP
  const pip = peep + ps;
  const flow = (ps / raw) * Math.exp(-tInsp / tau);
  const volume = cst * ps * (1 - Math.exp(-tInsp / tau)) * 1000;
  return { pressure: pip, flow, volume };
}

function cpapSpontaneous(
  tInsp: number,
  ti: number,
  vtL: number,
  raw: number,
  cst: number,
  peep: number,
): PhaseResult {
  // Spontaneous tidal breath under CPAP — sinusoidal flow profile,
  // slight sub-PEEP pressure dip during inspiration (muscle effort).
  const flow = vtL / ti * Math.sin(Math.PI * tInsp / ti);
  const volume = vtL * (1 - Math.cos(Math.PI * tInsp / ti)) / 2 * 1000;
  const resistiveDrop = raw * flow;
  const pressure = peep - resistiveDrop * 0.7; // partial compensation from circuit
  return { pressure: Math.max(peep - 3, pressure), flow, volume };
}

function passiveExpiration(
  tExp: number,
  tau: number,
  vtL: number,
  peep: number,
  cst: number,
  raw: number,
): PhaseResult {
  const vFrac = Math.exp(-tExp / tau);
  const volume = vtL * vFrac * 1000; // mL
  const flow = -(vtL / tau) * vFrac; // L/s, negative
  const pressure = peep + (vtL * vFrac * 1000) / (cst * 1000);
  return { pressure, flow, volume };
}

// ─── Asynchrony overlays ────────────────────────────────────────────────────────

function applyFlowStarvation(phase: PhaseResult, tInsp: number, ti: number): PhaseResult {
  // Pressure scoops below set inspiratory pressure as patient demand > set flow.
  // The characteristic "scalloped" or "dished" pressure waveform during inspiration.
  const scoop = -3.5 * Math.sin(Math.PI * tInsp / ti);
  return { ...phase, pressure: phase.pressure + scoop };
}

function applyInefficientTrigger(phase: PhaseResult, tExp: number, te: number): PhaseResult {
  // Patient effort occurs in expiration but does NOT reach trigger threshold.
  // Shown as a brief downward pressure deflection + small flow perturbation in expiratory trace.
  const windowStart = te * 0.40;
  const windowEnd = te * 0.55;
  if (tExp < windowStart || tExp > windowEnd) return phase;
  const x = (tExp - windowStart) / (windowEnd - windowStart);
  const deflect = -1.8 * Math.sin(Math.PI * x);
  return {
    ...phase,
    pressure: phase.pressure + deflect,
    flow: phase.flow + 0.08 * Math.sin(Math.PI * x),
  };
}

function applyDelayedCycling(phase: PhaseResult, tInsp: number, ti: number): PhaseResult {
  // Pressure rises above set level near end of inspiration as patient starts to exhale
  // before the ventilator cycles off — high pressure at end of inspiration.
  if (tInsp < ti * 0.75) return phase;
  const t = (tInsp - ti * 0.75) / (ti * 0.25);
  return { ...phase, pressure: phase.pressure + 4 * t };
}

function applyPrematureCycling(phase: PhaseResult, tInsp: number, ti: number): PhaseResult {
  // Ventilator cycles off before lung is full — flow abruptly drops before Ti is complete.
  if (tInsp < ti * 0.55) return phase;
  const t = (tInsp - ti * 0.55) / (ti * 0.45);
  return { ...phase, flow: phase.flow * (1 - t * 0.85) };
}

// ─── APRV breath generator ──────────────────────────────────────────────────────

function aprvInspiration(
  tHigh: number,
  phigh: number,
  plow: number,
  cst: number,
  raw: number,
): PhaseResult {
  // APRV T_High phase: pressure held at P_High; lungs inflate to volume = Cst × (P_High − P_Low)
  // Patient can breathe spontaneously during this phase.
  const volume = cst * (phigh - plow) * 1000;
  const flow = 0.05; // minimal residual flow during T_High hold
  void tHigh;
  return { pressure: phigh, flow, volume };
}

function aprvRelease(
  tLow: number,
  tau: number,
  releaseVol: number,
  plow: number,
  cst: number,
): PhaseResult {
  const vFrac = Math.exp(-tLow / tau);
  const volume = releaseVol * vFrac;
  const flow = -(releaseVol / 1000) / tau * vFrac;
  const pressure = plow + (volume / 1000) / cst;
  return { pressure, flow, volume };
}

// ─── Main API ───────────────────────────────────────────────────────────────────

export type VentWaveformOptions = {
  /** Number of complete breath cycles to render. Default: 4 */
  breathCount?: number;
  /** Sampling rate in points/second. Default: 100 */
  sampleRate?: number;
  /** Include an end-inspiratory plateau pause. Default: true for VC modes */
  includePlateau?: boolean;
  /** Plateau duration as fraction of Ti. Default: 0.15 */
  plateauFraction?: number;
};

export function generateVentWaveform(
  config: VentWaveformConfig,
  options: VentWaveformOptions = {},
): VentWaveformResult {
  const breathCount = options.breathCount ?? 4;
  const sampleRate = options.sampleRate ?? 100;
  const isVC = config.mode === "volume_control" || (config.mode === "simv");
  const isPC = config.mode === "pressure_control" || config.mode === "prvc";
  const isPS = config.mode === "pressure_support" || config.mode === "bipap";
  const isCPAP = config.mode === "cpap";
  const isAPRV = config.mode === "aprv";
  const isHFOV = config.mode === "hfov";

  const includePlateau = options.includePlateau ?? isVC;
  // FIX 3: Plateau must be ≥ 350 ms — fraction alone gives too short a plateau at normal Ti.
  // Clinical standard: end-inspiratory pause ≥ 0.3 s is required for a valid Pplat measurement.
  const plateauFraction = options.plateauFraction ?? 0.15;

  // ── Derived physiology ──────────────────────────────────────────────────────
  const cstL = config.compliance / 1000; // L/cmH₂O
  const raw = config.resistance; // cmH₂O·s/L
  const tau = raw * cstL; // time constant (s)
  const peep = config.peep;
  // FIX 1: autoPeep does NOT inflate the pressure baseline (effectivePeep = peep only).
  // Auto-PEEP is handled by the volume floor in the expiratory phase: at the floor
  // the pressure is correctly set to peep + autoPeep, not peep + 2×autoPeep.
  const autoPeep = config.autoPeep ?? 0;
  const effectivePeep = peep; // was peep + autoPeep — that double-counted the intrinsic PEEP

  const cycleDuration = 60 / config.rr;
  const tiActual = config.ti;
  // FIX 3: Guarantee ≥ 0.35 s plateau when plateau is enabled.
  const plateauSecondsMin = 0.35;
  const plateauSeconds = includePlateau
    ? Math.min(Math.max(tiActual * plateauFraction, plateauSecondsMin), tiActual * 0.45)
    : 0;
  const tiFlow = tiActual - plateauSeconds;
  const tiPlateau = plateauSeconds;
  const te = cycleDuration - tiActual;

  // ── APRV cycle parameters ────────────────────────────────────────────────────
  const aprvPHigh = config.pip ?? 25;
  const aprvPLow = config.peep; // P_Low often set to 0 in APRV
  const aprvTHigh = config.ti; // T_High (typical: 4–6 s)
  const aprvTLow = cycleDuration - aprvTHigh; // T_Low (typical: 0.4–0.8 s)

  // ── VC parameters ────────────────────────────────────────────────────────────
  const vtL = (config.tidalVolume ?? 500) / 1000;
  const flowPattern: VentFlowPattern = config.flowPattern ?? "square";

  // ── PC/PS parameters ─────────────────────────────────────────────────────────
  const pip = config.pip ?? peep + 15;
  const drivingPressure = pip - peep; // driving pressure = PIP - set PEEP
  const ps = config.pressureSupport ?? 10;

  // ── Derived values (from first breath) ───────────────────────────────────────
  let peakPressureSeen = 0;
  let plateauPressureSeen: number | null = null;
  let vtMeasured = 0;
  let sumPressure = 0;
  let pointCount = 0;

  // ── Point generation ─────────────────────────────────────────────────────────
  const points: VentPoint[] = [];
  const breathBoundaries: number[] = [];
  const annotations: VentAnnotation[] = [];
  const totalSeconds = breathCount * cycleDuration;

  let noiseIndex = 0;

  for (let n = 0; n < breathCount; n++) {
    const breathStart = n * cycleDuration;
    breathBoundaries.push(breathStart);

    const isSimvSpontaneous = config.mode === "simv" && n % 2 === 1;
    const isDoubleTrigger = config.asynchrony === "double_triggering" && n % 2 === 1;
    const isAutoTrigger = config.asynchrony === "auto_triggering" && n % 3 === 2;

    // Annotation: breath start
    if (n === 0) {
      annotations.push({ t: breathStart, label: `PEEP: ${peep} cmH₂O`, trace: "pressure", kind: "peep" });
    }

    // Compute total samples for this breath cycle
    const cycleSamples = Math.round(cycleDuration * sampleRate);

    for (let i = 0; i < cycleSamples; i++) {
      const tInCycle = i / sampleRate;
      const t = breathStart + tInCycle;
      if (t >= totalSeconds + 0.01) break;

      noiseIndex += 1;
      let result: PhaseResult;

      // ── APRV mode ────────────────────────────────────────────────────────────
      if (isAPRV) {
        if (tInCycle < aprvTHigh) {
          result = aprvInspiration(tInCycle, aprvPHigh, aprvPLow, cstL, raw);
          // FIX 2: Spontaneous breaths during T_High are DOWNWARD pressure dips only.
          // The patient inhales against the high CPAP-like pressure, momentarily pulling
          // airway pressure below P_High. The waveform dips down then recovers.
          // Previous code added a full sinusoid (+/-) which incorrectly showed pressure
          // rising ABOVE P_High — physiologically impossible in a passive circuit.
          const spontPhase = Math.abs(Math.sin(2.8 * Math.PI * tInCycle / aprvTHigh));
          result.pressure -= spontPhase * 2.0;  // only downward deflections
          result.flow += spontPhase * 0.12;     // slight inspiratory flow during effort
        } else {
          const tLow = tInCycle - aprvTHigh;
          const releaseVol = cstL * (aprvPHigh - aprvPLow) * 1000;
          result = aprvRelease(tLow, tau, releaseVol, aprvPLow, cstL);
        }
        points.push({ t, ...result });
        sumPressure += result.pressure;
        pointCount++;
        continue;
      }

      // ── HFOV mode ─────────────────────────────────────────────────────────────
      // High-frequency oscillatory ventilation: rapid sinusoidal pressure oscillations
      // around a constant mean airway pressure (MAP = peep field).
      // Physics:
      //   P(t) = MAP ± (ΔP/2)·sin(2π·freq·t)          [pressure oscillates bidirectionally]
      //   F(t) = Vt_hfov·(2π·freq)·cos(2π·freq·t)     [flow = dV/dt]
      //   Vt_hfov = Cst·(ΔP/2)·(1 − e^−1/(2·freq·τ)) ≈ Cst·ΔP/2 at high freq
      // CO₂ eliminated by: DCO₂ = Vt² × frequency (power law)
      // Oxygenation: controlled by MAP and FiO₂
      if (isHFOV) {
        const map = peep; // MAP (set as the "PEEP" field in config)
        const amplitude = config.hfovAmplitude ?? 30; // ΔP
        const freq = config.hfovFrequency ?? 10; // Hz
        // Each "breath" cycle spans cycleDuration; t is absolute time
        const pressure = map + (amplitude / 2) * Math.sin(2 * Math.PI * freq * t);
        const vtHfov = cstL * (amplitude / 2) * 1000; // mL — small
        const flow = vtHfov / 1000 * (2 * Math.PI * freq) * Math.cos(2 * Math.PI * freq * t);
        const volume = vtHfov * (1 - Math.cos(2 * Math.PI * freq * t)) / 2;
        // HFOV noise is minimal (circuit is sealed)
        const hfovNoise = deterministicNoise(noiseIndex, 0.08);
        points.push({ t, pressure: pressure + hfovNoise, flow, volume: Math.max(0, volume) });
        sumPressure += pressure;
        pointCount++;
        peakPressureSeen = Math.max(peakPressureSeen, pressure);
        vtMeasured = Math.max(vtMeasured, vtHfov);
        continue;
      }

      // ── Inspiratory phase (flow delivery) ────────────────────────────────────
      if (tInCycle < tiFlow) {
        if (isAutoTrigger) {
          // Auto-trigger: inspiration fires without patient effort (artifact/circuit)
          result = isVC
            ? vcInspiration(tInCycle, tiFlow, vtL * 0.9, raw, cstL, peep, flowPattern)
            : pcInspiration(tInCycle, tau, drivingPressure * 0.8, raw, cstL, pip - 2);
        } else if (isSimvSpontaneous) {
          // SIMV spontaneous breath uses pressure support
          result = psInspiration(tInCycle, tau, ps, raw, cstL, peep);
        } else if (isVC) {
          result = vcInspiration(tInCycle, tiFlow, vtL, raw, cstL, peep, flowPattern);
        } else if (isPC) {
          result = pcInspiration(tInCycle, tau, drivingPressure, raw, cstL, pip);
        } else if (isPS) {
          result = psInspiration(tInCycle, tau, ps, raw, cstL, peep);
        } else if (isCPAP) {
          const cpapVt = (config.tidalVolume ?? 400) / 1000;
          result = cpapSpontaneous(tInCycle, tiFlow, cpapVt, raw, cstL, peep);
        } else {
          result = { pressure: peep, flow: 0, volume: 0 };
        }

        // Asynchrony: flow starvation
        if (config.asynchrony === "flow_starvation" && isVC) {
          result = applyFlowStarvation(result, tInCycle, tiFlow);
        }
        // Asynchrony: delayed cycling (pressure continues to rise late in insp)
        if (config.asynchrony === "delayed_cycling") {
          result = applyDelayedCycling(result, tInCycle, tiFlow);
        }
        // Asynchrony: premature cycling
        if (config.asynchrony === "premature_cycling") {
          result = applyPrematureCycling(result, tInCycle, tiFlow);
        }

        if (n === 0) {
          peakPressureSeen = Math.max(peakPressureSeen, result.pressure);
          vtMeasured = Math.max(vtMeasured, result.volume);
        }

      // ── End-inspiratory plateau ───────────────────────────────────────────────
      } else if (tInCycle < tiActual && includePlateau) {
        // Flow = 0, pressure = Pplat = PEEP + Vt/Cst
        const vtNow = isVC ? vtL * 1000 : vtMeasured;
        const pplat = peep + vtNow / (config.compliance);
        result = { pressure: pplat, flow: 0, volume: vtNow };
        if (n === 0) plateauPressureSeen = pplat;
        if (n === 0) {
          annotations.push({
            t: breathStart + tiFlow + tiPlateau * 0.5,
            label: `Pplat: ${pplat.toFixed(0)} cmH₂O`,
            trace: "pressure",
            kind: "plateau",
          });
        }

      // ── Double-triggering: second breath in expiration ───────────────────────
      } else if (isDoubleTrigger && tInCycle >= tiActual && tInCycle < tiActual + tiFlow * 0.9) {
        const t2 = tInCycle - tiActual;
        const vtL2 = vtL * 0.7;
        result = isVC
          ? vcInspiration(t2, tiFlow * 0.9, vtL2, raw, cstL, peep, flowPattern)
          : pcInspiration(t2, tau, drivingPressure * 0.7, raw, cstL, peep + drivingPressure * 0.7);
        if (n === 0) {
          annotations.push({
            t: breathStart + tiActual,
            label: "Double trigger",
            trace: "pressure",
            kind: "asynchrony",
          });
        }

      // ── Expiratory phase ──────────────────────────────────────────────────────
      } else {
        const tExpBase = isDoubleTrigger ? tInCycle - (tiActual + tiFlow * 0.9) : tInCycle - tiActual;
        const tExp = Math.max(0, tExpBase);

        // Volume remaining at start of expiration
        const vtExp = isVC ? vtL : (isPS ? cstL * ps * (1 - Math.exp(-tiFlow / tau)) : cstL * drivingPressure * (1 - Math.exp(-tiFlow / tau)));

        result = passiveExpiration(tExp, tau, vtExp, peep, cstL, raw);

        // FIX 1 (continued): Auto-PEEP floor — volume doesn't empty below residual.
        // vResidual = autoPeep × Cst: volume of trapped air above true FRC.
        // Pressure at this floor = peep + autoPeep (= total effective PEEP).
        // This correctly represents incomplete expiration without double-counting.
        if (autoPeep > 0) {
          const vResidual = autoPeep * config.compliance; // mL
          if (result.volume < vResidual) {
            result.volume = vResidual;
            result.flow = Math.min(result.flow, -0.025); // still slightly negative — not at zero
            result.pressure = peep + autoPeep;           // correct total effective PEEP
          }
        }

        // Breath stacking: incomplete expiration before next breath
        if (config.asynchrony === "breath_stacking" && tExp > te * 0.7) {
          result.volume += vtExp * 1000 * 0.25 * (1 - tExp / te);
          result.pressure += 3 * (1 - tExp / te);
        }

        // Circuit / ETT cuff leak: pressure and volume bleed toward zero
        if (config.condition === "circuit_leak" || config.condition === "ett_cuff_leak") {
          const leakSeverity = config.condition === "ett_cuff_leak" ? 0.35 : 0.55;
          const leakDecay = Math.exp(-tExp * leakSeverity);
          result.volume *= leakDecay;
          result.pressure = peep + (result.volume / 1000) / cstL;
          result.flow += leakSeverity * 0.12 * Math.exp(-tExp * leakSeverity);
        }

        // Pneumothorax: sudden compliance drop after breath 1 — pressure spike, volume drop
        if (config.condition === "pneumothorax" && n >= 2) {
          result.pressure *= 1.15;
          result.volume *= 0.60;
        }

        // Ineffective triggering: visible effort notch in expiratory pressure/flow
        if (config.asynchrony === "ineffective_triggering") {
          result = applyInefficientTrigger(result, tExp, te);
        }
      }

      // Patient agitation: erratic baseline with superimposed spontaneous efforts
      if (config.condition === "patient_agitation") {
        const agitNoise = 1.8 * Math.sin(tInCycle * 7.3 + n * 2.1) * Math.sin(tInCycle * 3.1);
        result.pressure += agitNoise;
        result.flow += agitNoise * 0.06;
      }

      // Water in circuit: characteristic saw-tooth oscillation on flow and pressure.
      // Pooled water in dependent circuit loops creates turbulence and flow oscillation
      // that is transmitted to the waveform as high-frequency irregular artefact.
      if (config.condition === "water_in_circuit") {
        const waterFreq = 12.7 + deterministicNoise(noiseIndex, 2.0);
        const waterAmp = 0.8 + 0.4 * Math.abs(result.flow); // worse during high flow
        result.flow += waterAmp * Math.sin(waterFreq * tInCycle + noiseIndex * 0.3);
        result.pressure += waterAmp * 0.6 * Math.sin(waterFreq * tInCycle + 0.7);
      }

      // Circuit disconnect: pressure collapses to ambient (0), flow drops to near zero.
      // Volume trace shows rapid descent. Alarms: LOW PRESSURE, LOW Vt.
      if (config.condition === "circuit_disconnect") {
        const disconnectFrac = Math.min(1, (tInCycle - tiFlow * 0.2) / 0.3);
        if (disconnectFrac > 0) {
          result.pressure = Math.max(0, result.pressure * (1 - disconnectFrac));
          result.flow *= (1 - disconnectFrac * 0.9);
          result.volume *= (1 - disconnectFrac);
        }
      }

      // Mainstem intubation: right-lung-only delivery — half the effective compliance,
      // elevated peak pressures, reduced delivered volume to left lung.
      // Waveform: higher Ppeak, smaller Vt measured, rapid rate of volume loss on exp.
      if (config.condition === "mainstem_intubation") {
        // Effective single-lung compliance ~half; pressure rises more per unit volume
        result.pressure = peep + (result.pressure - peep) * 1.55;
        result.volume *= 0.60; // volume distributed to one lung
      }

      // Pulmonary hemorrhage: gross disturbance on expiration (blood pooling/movement)
      if (config.condition === "pulmonary_hemorrhage") {
        const hemorrhageOsc = 0.6 * Math.sin(tInCycle * 22 + n * 1.7) * (tInCycle > tiActual ? 1 : 0.2);
        result.pressure += hemorrhageOsc;
        result.flow += hemorrhageOsc * 0.05;
      }

      // Reverse triggering: diaphragm contracts reflexively during mandatory breath.
      // Shows as brief expiratory flow effort DURING the inspiratory phase, then
      // a large breath immediately following. Often seen with high RR and deep sedation.
      if (config.asynchrony === "reverse_triggering" && n % 3 === 0 && tInCycle > tiFlow * 0.6 && tInCycle < tiActual) {
        const rtPhase = (tInCycle - tiFlow * 0.6) / (tiActual - tiFlow * 0.6);
        result.pressure -= 1.5 * Math.sin(Math.PI * rtPhase); // diaphragm contraction pulls P down
        result.flow -= 0.08 * Math.sin(Math.PI * rtPhase);    // brief expiratory effort during insp
      }

      // Micro-variation (clinical noise) — prevents perfectly smooth unrealistic traces
      const noise = deterministicNoise(noiseIndex, 0.18);
      result.pressure += noise;

      sumPressure += result.pressure;
      pointCount++;

      points.push({ t, pressure: result.pressure, flow: result.flow, volume: result.volume });
    }
  }

  // ── Annotation: PIP ─────────────────────────────────────────────────────────
  if (peakPressureSeen > effectivePeep) {
    annotations.push({
      t: tiFlow * 0.85,
      label: `PIP: ${peakPressureSeen.toFixed(0)} cmH₂O`,
      trace: "pressure",
      kind: "pip",
    });
  }

  // ── Annotation: auto-PEEP ───────────────────────────────────────────────────
  if (autoPeep > 0) {
    annotations.push({
      t: cycleDuration * 0.92,
      label: `Auto-PEEP: ${autoPeep} cmH₂O`,
      trace: "flow",
      kind: "auto_peep",
    });
  }

  // ── Compute display ranges ───────────────────────────────────────────────────
  const pressureValues = points.map((p) => p.pressure);
  const flowValues = points.map((p) => p.flow);
  const volumeValues = points.map((p) => p.volume);

  const pressureMax = Math.max(40, ...pressureValues) + 3;
  const pressureMin = Math.min(0, ...pressureValues) - 2;
  const flowMax = Math.max(0.8, ...flowValues) + 0.15;
  const flowMin = Math.min(-0.8, ...flowValues) - 0.15;
  const volumeMax = Math.max(600, ...volumeValues) + 50;

  // ── Derived values ───────────────────────────────────────────────────────────
  const te_actual = cycleDuration - tiActual;
  const ieNum = Math.round(tiActual * 10);
  const ieDen = Math.round(te_actual * 10);
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const g = gcd(ieNum, ieDen);
  const ieRatio = `1:${(ieDen / g / (ieNum / g)).toFixed(1)}`;

  const meanAirwayPressure = pointCount > 0 ? sumPressure / pointCount : peep;

  return {
    points,
    totalSeconds,
    ranges: {
      pressure: [pressureMin, pressureMax],
      flow: [flowMin, flowMax],
      volume: [0, volumeMax],
    },
    breathBoundaries,
    annotations,
    derived: {
      peakPressure: Math.round(peakPressureSeen * 10) / 10,
      plateauPressure: plateauPressureSeen ? Math.round(plateauPressureSeen * 10) / 10 : null,
      tidalVolumeMeasured: Math.round(vtMeasured),
      timeConstant: Math.round(tau * 1000) / 1000,
      ieRatio,
      meanAirwayPressure: Math.round(meanAirwayPressure * 10) / 10,
      hasAutoPeep: autoPeep > 0,
    },
  };
}

// ─── Default config factory ────────────────────────────────────────────────────

/**
 * Returns a clinically sensible default config for the given mode.
 * All parameters represent a normal adult lung with no pathology.
 */
export function defaultVentConfigForMode(mode: VentMode): VentWaveformConfig {
  const base: VentWaveformConfig = {
    mode,
    peep: 5,
    rr: 12,
    ti: 1.0,
    compliance: 60,
    resistance: 5,
    condition: "normal",
    asynchrony: "none",
    difficulty: "basic",
    professionScope: ["rt", "rn", "np", "critical_care"],
  };

  switch (mode) {
    case "volume_control":
      return { ...base, tidalVolume: 500, flowPattern: "square" };

    case "pressure_control":
      return { ...base, pip: 20, rr: 14 };

    case "pressure_support":
      return { ...base, pressureSupport: 10, rr: 14, ti: 0.9 };

    case "simv":
      return { ...base, tidalVolume: 500, pressureSupport: 8, rr: 10 };

    case "cpap":
      return { ...base, peep: 8, rr: 14, ti: 0.9, tidalVolume: 400 };

    case "bipap":
      return { ...base, pip: 18, pressureSupport: 10, peep: 5, rr: 14 };

    case "aprv":
      return { ...base, pip: 25, peep: 0, ti: 5.0, rr: 10 };

    case "prvc":
      return { ...base, pip: 20, tidalVolume: 500, rr: 14 };

    case "hfov":
      // Adult ARDS rescue HFOV defaults (Hamilton Health Sciences protocol)
      return {
        ...base,
        peep: 20,          // MAP 20 cmH₂O — higher than conventional to recruit
        hfovFrequency: 5,  // Hz — lower freq = higher Vt = better CO₂ clearance in adults
        hfovAmplitude: 60, // ΔP — adjust to achieve visible chest "wiggle"
        rr: 300,           // 5 Hz × 60 = 300 "breaths"/min (internally as Hz)
        ti: 0.1,           // Not clinically meaningful for HFOV — placeholder
        compliance: 25,    // Typical severe ARDS compliance
        resistance: 8,
        professionScope: ["rt", "critical_care"],
        difficulty: "advanced",
      };
  }
}

// ─── Neonatal config factory ────────────────────────────────────────────────────

export type NeonatalPhysiology =
  | "term_normal"       // Term infant, no pathology
  | "rds_28wk"          // 28-week premature, RDS (severe surfactant deficiency)
  | "rds_32wk"          // 32-week premature, RDS (moderate)
  | "mas"               // Meconium Aspiration Syndrome — high resistance + air trapping
  | "pphn"              // PPHN — near-normal lung mechanics, pulmonary HTN
  | "bpd"               // Bronchopulmonary Dysplasia — high resistance, variable compliance
  | "cdh";              // Congenital Diaphragmatic Hernia — reduced lung volume

/**
 * Returns a clinically accurate VentWaveformConfig for neonatal scenarios.
 * All compliance/resistance values derived from published neonatal respiratory mechanics.
 *
 * Sources: Bancalari & Jobe (NEJM), Sweet et al (ERS/ESPR 2019 guidelines),
 *          Goldsmith/Karotkin Assisted Ventilation of the Neonate (6th ed).
 */
export function neonatalVentConfig(
  physiology: NeonatalPhysiology,
  mode: "pressure_control" | "hfov" | "cpap" = "pressure_control",
): VentWaveformConfig {
  const base: VentWaveformConfig = {
    mode,
    peep: 5,
    rr: 50,
    ti: 0.30,
    compliance: 2,
    resistance: 50,
    condition: "normal",
    asynchrony: "none",
    difficulty: "advanced",
    professionScope: ["rt", "nicu", "critical_care"],
  };

  switch (physiology) {
    case "term_normal":
      // Term neonate (3.5 kg): Cst ~3–5 mL/cmH₂O, Raw ~25–40 cmH₂O/L/s
      return { ...base, mode, pip: 18, peep: 4, rr: 40, ti: 0.35, compliance: 4, resistance: 30 };

    case "rds_28wk":
      // 28-weeker (1 kg): Severe RDS. Cst ~0.5–1.5 mL/cmH₂O, Raw ~60–100 cmH₂O/L/s
      // τ = 80 × 0.001 = 0.08s — very fast time constant, emphysema of prematurity
      return {
        ...base, mode,
        pip: 22, peep: 6, rr: 55, ti: 0.25,
        compliance: 1.0, resistance: 80,
        tidalVolume: 4,  // 4 mL/kg for 1 kg baby
        condition: "low_compliance",
      };

    case "rds_32wk":
      // 32-weeker (1.8 kg): Moderate RDS. Cst ~1.5–3 mL/cmH₂O
      return {
        ...base, mode,
        pip: 20, peep: 5, rr: 50, ti: 0.28,
        compliance: 2.0, resistance: 55,
        tidalVolume: 9,  // ~5 mL/kg
        condition: "low_compliance",
      };

    case "mas":
      // MAS: meconium obstructs airways → high resistance, partial air trapping
      // Cst normal-high (3–5), Raw very high (80–150 cmH₂O/L/s)
      return {
        ...base, mode,
        pip: 24, peep: 5, rr: 40, ti: 0.35,
        compliance: 3.5, resistance: 100,
        tidalVolume: 14, // ~4 mL/kg for 3.5 kg term baby
        condition: "high_resistance",
        autoPeep: 3,     // Air trapping from ball-valve obstruction
      };

    case "pphn":
      // PPHN: lungs often normal mechanics; problem is vascular resistance
      return {
        ...base, mode,
        pip: 20, peep: 4, rr: 40, ti: 0.35,
        compliance: 3.5, resistance: 35,
        tidalVolume: 15, // slightly higher Vt to support lung inflation
        condition: "normal",
      };

    case "bpd":
      // BPD: patchy atelectasis + hyperinflation, high Raw, variable Cst
      return {
        ...base, mode,
        pip: 22, peep: 5, rr: 35, ti: 0.40,
        compliance: 2.5, resistance: 70,
        tidalVolume: 12,
        condition: "high_resistance",
        autoPeep: 2,
      };

    case "cdh":
      // CDH: one lung hypoplastic; normal lung Cst but reduced total respiratory system Cst
      return {
        ...base, mode,
        pip: 22, peep: 5, rr: 45, ti: 0.30,
        compliance: 1.8, resistance: 50,
        tidalVolume: 5,
        condition: "low_compliance",
      };
  }
}

/**
 * Pediatric VentWaveformConfig by weight and condition.
 * Weight in kg used to calculate weight-appropriate Vt (6 mL/kg).
 */
export function pediatricVentConfig(
  weightKg: number,
  condition: "normal" | "asthma" | "ards" | "bronchiolitis",
  mode: "volume_control" | "pressure_control" | "pressure_support" = "pressure_control",
): VentWaveformConfig {
  const vtTarget = Math.round(weightKg * 6);   // 6 mL/kg target
  const cst = condition === "ards" ? weightKg * 0.8
            : condition === "asthma" ? weightKg * 1.2
            : weightKg * 1.5;                  // mL/cmH₂O scales ~linearly with weight
  const raw = condition === "asthma" ? 25
            : condition === "bronchiolitis" ? 18
            : 8;

  return {
    mode,
    pip: condition === "ards" ? 22 : 20,
    peep: condition === "ards" ? 8 : condition === "asthma" ? 3 : 5,
    rr: condition === "asthma" ? 14 : weightKg < 10 ? 30 : weightKg < 20 ? 22 : 16,
    ti: weightKg < 10 ? 0.55 : weightKg < 20 ? 0.70 : 0.90,
    compliance: cst,
    resistance: raw,
    tidalVolume: vtTarget,
    condition: condition === "normal" ? "normal"
             : condition === "asthma" ? "bronchospasm"
             : condition === "ards" ? "ards"
             : "high_resistance",
    asynchrony: "none",
    difficulty: "intermediate",
    professionScope: ["rt", "picu", "critical_care"],
  };
}

// ─── SVG path builder ──────────────────────────────────────────────────────────

export type VentSvgTraceArgs = {
  points: VentPoint[];
  trace: "pressure" | "flow" | "volume";
  range: [number, number];
  viewWidth: number;
  viewHeight: number;
  totalSeconds: number;
};

/**
 * Converts a VentWaveformResult trace into an SVG path string.
 * Maps clinical value range to [0, viewHeight] (y-axis inverted — 0 at top).
 */
export function ventWaveformToSvgPath(args: VentSvgTraceArgs): string {
  const { points, trace, range, viewWidth, viewHeight, totalSeconds } = args;
  const [min, max] = range;
  const span = max - min || 1;

  return points
    .map((p, i) => {
      const x = (p.t / totalSeconds) * viewWidth;
      const raw = trace === "pressure" ? p.pressure : trace === "flow" ? p.flow : p.volume;
      const y = viewHeight - ((raw - min) / span) * viewHeight;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

/**
 * Converts a y-value in clinical units to SVG y-coordinate (inverted scale).
 */
export function clinicalValueToSvgY(value: number, range: [number, number], viewHeight: number): number {
  const [min, max] = range;
  const span = max - min || 1;
  return viewHeight - ((value - min) / span) * viewHeight;
}
