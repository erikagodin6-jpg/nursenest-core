import { getEcgRhythmTemplate, type EcgRhythmTemplate } from "@/lib/ecg-module/ecg-rhythm-templates";

export type EcgStripMediaType = "ecg_live_strip";

/**
 * Classifies the educational intent of the strip.
 *
 *   "single_rhythm"  — the entire strip shows one consistent, stable rhythm.
 *                      This is the default and the only type that may be used in
 *                      standard rhythm identification questions without a label.
 *
 *   "transition"     — the strip intentionally shows a rhythm change (e.g. normal
 *                      sinus → VT). Must be labeled "rhythm progression" in the UI.
 *
 *   "deterioration"  — the strip shows progressive clinical worsening (e.g. SR → VF).
 *                      Must be labeled "deterioration scenario".
 *
 *   "conversion"     — the strip shows a rhythm converting to another (e.g. AFib → SR
 *                      after cardioversion). Must be labeled "conversion strip".
 *
 *   "artifact_onset" — the strip shows clean rhythm followed by artifact onset.
 *                      Must be labeled "artifact onset".
 *
 * Strips of any non-single_rhythm type must not be used in questions that ask
 * "identify this rhythm" without explicitly framing the transition.
 */
export type EcgStripType =
  | "single_rhythm"
  | "transition"
  | "deterioration"
  | "conversion"
  | "artifact_onset";

/** Human-readable label to display in the UI for non-single_rhythm strips. */
export const ECG_STRIP_TYPE_LABELS: Record<EcgStripType, string | null> = {
  single_rhythm: null,                // No label — strip speaks for itself
  transition: "Rhythm Progression",
  deterioration: "Deterioration Scenario",
  conversion: "Conversion Strip",
  artifact_onset: "Artifact Onset",
};

export type EcgEducationalMode =
  | "clean_teaching"
  | "realistic_monitor"
  | "artifact_training"
  | "telemetry_review"
  | "emergency_scenario";

export type EcgMorphologyProfile =
  | "standard"
  | "high_rate_collapse"
  | "aberrant_conduction"
  | "compensated"
  | "decompensating";

/** Artifact level per educational mode — applied in generateEcgWaveform(). */
export const ECG_MODE_ARTIFACT_LEVELS: Record<EcgEducationalMode, number> = {
  clean_teaching: 0.008,
  realistic_monitor: 0.035,
  artifact_training: 0.14,
  telemetry_review: 0.025,
  emergency_scenario: 0.06,
};

export type EcgStripMediaConfig = {
  mediaType?: EcgStripMediaType;
  rhythmKey: string;
  rate: number;
  regularity: EcgRhythmTemplate["rhythmRegularity"];
  pWavePattern: EcgRhythmTemplate["pWavePresence"];
  prIntervalPattern: EcgRhythmTemplate["prIntervalPattern"];
  qrsWidth: number;
  qtBehavior?: EcgRhythmTemplate["qtBehavior"];
  artifactLevel?: number;
  difficulty: EcgRhythmTemplate["difficulty"];
  pathwayTierScope: string[];
  paperSpeed?: number;
  amplitude?: number;
  manualReviewed?: boolean;
  manuallyReviewedAt?: string;
  /**
   * Strip educational type — governs whether a transition label must be shown.
   * Defaults to "single_rhythm" when absent.
   * Any non-"single_rhythm" type MUST display the corresponding label from
   * ECG_STRIP_TYPE_LABELS. Enforced by validateStripContinuity().
   */
  stripType?: EcgStripType;
  /**
   * Controls how much waveform realism (noise, baseline wander, artifact)
   * is rendered. Prevents accidental mixing of educational-clarity strips
   * with realistic-monitor strips in the same question bank.
   *
   *   "clean_teaching"     — minimal noise/artifact; maximum morphology clarity.
   *                          Use for: initial concept introduction, beginner questions.
   *   "realistic_monitor"  — moderate baseline wander + low-level artifact; matches
   *                          bedside telemetry appearance. Use for: NCLEX/CNPLE prep.
   *   "artifact_training"  — intentional artifact overlay for artifact-recognition
   *                          teaching. Must carry stripType="artifact_onset" when used
   *                          in non-artifact-question contexts.
   *   "telemetry_review"   — standard clinical appearance; appropriate for advanced
   *                          learners practicing 12-lead interpretation.
   *   "emergency_scenario" — high-fidelity deteriorating presentation; always requires
   *                          stripType !== "single_rhythm" with a learner-visible label.
   */
  educationalMode?: EcgEducationalMode;
  /**
   * Describes the morphology profile used for rendering — informs validation and
   * the strip governance audit trail. Content authors set this explicitly when
   * the strip is created; the validator checks it against the rhythm template.
   *
   *   "standard"           — default clinical morphology for the rhythm.
   *   "high_rate_collapse" — explicitly validated for high-rate rendering where
   *                          complexes may overlap. Requires rate > 150.
   *   "aberrant_conduction"— deliberately showing aberrant ventricular conduction.
   *   "compensated"        — hemodynamically compensated presentation.
   *   "decompensating"     — deteriorating presentation (matches emergency_scenario mode).
   */
  morphologyProfile?: EcgMorphologyProfile;
  features?: {
    hasOrganizedQrs?: boolean;
    hasRecurringQrs?: boolean;
    avDissociation?: boolean;
    progressivePr?: boolean;
    polymorphicTwisting?: boolean;
    peakedT?: boolean;
    widenedQrs?: boolean;
    stElevation?: boolean;
    pacerSpikes?: boolean;
  };
};

export type EcgWaveformConfig = EcgStripMediaConfig;

export type EcgPoint = { x: number; y: number };

export type EcgWaveformOptions = {
  width?: number;
  height?: number;
  seconds?: number;
  sampleRate?: number;
};

export type EcgWaveformResult = {
  points: EcgPoint[];
  viewBox: string;
  path: string;
  grid: { minor: number; major: number };
  /**
   * Respiration phase at each sample point — only populated for
   * respiratory_sinus_arrhythmia strips in educationalMode.
   * "inspiration" = R-R shortening phase; "expiration" = R-R lengthening phase.
   * Empty array for all other rhythms.
   */
  respirationPhases: ReadonlyArray<"inspiration" | "expiration">;
};

// ─── Strip Continuity Validation ──────────────────────────────────────────

export type EcgStripContinuityResult = {
  /** True when the strip begins cleanly with the intended rhythm. */
  ok: boolean;
  /** Time (seconds) at which the first beat appears. */
  firstBeatTime: number | null;
  /** Maximum allowed first-beat time for this rhythm (one cardiac cycle). */
  maxAllowedFirstBeatTime: number;
  /** Whether the first beat appears within the acceptable window. */
  firstBeatOnTime: boolean;
  /** Strip type (defaults to "single_rhythm"). */
  stripType: EcgStripType;
  /** Whether a UI label is required for this strip type. */
  requiresLabel: boolean;
  /** The label string to display if requiresLabel is true. */
  labelText: string | null;
  warnings: string[];
};

/**
 * Validates that an ECG strip begins cleanly and consistently.
 *
 * The "first beat time" must be ≤ one cardiac cycle length for the given rate.
 * This ensures learners see the intended rhythm from the very start of the strip,
 * not a flatline/apparent-asystole segment followed by the rhythm.
 *
 * For asystole and VF (no discrete beats), the check is skipped.
 * For single-beat rhythms: first beat must appear within max(0.6s, one cycle).
 */
export function validateStripContinuity(
  config: EcgStripMediaConfig,
  seconds = 6,
): EcgStripContinuityResult {
  const stripType: EcgStripType = config.stripType ?? "single_rhythm";
  const requiresLabel = stripType !== "single_rhythm";
  const labelText = ECG_STRIP_TYPE_LABELS[stripType];
  const warnings: string[] = [];

  // VF and asystole have no discrete beats — continuity check doesn't apply.
  if (config.rhythmKey === "ventricular_fibrillation" || config.rhythmKey === "asystole") {
    return {
      ok: true,
      firstBeatTime: null,
      maxAllowedFirstBeatTime: 0,
      firstBeatOnTime: true,
      stripType,
      requiresLabel,
      labelText,
      warnings,
    };
  }

  if (requiresLabel) {
    warnings.push(
      `Strip type is "${stripType}" — label "${labelText}" must be visible in the UI. ` +
      "This strip must not be used in standard rhythm identification questions without the label.",
    );
  }

  // Calculate expected beat positions using the same algorithm as beatOffsets().
  const beats = beatOffsets(config, seconds);
  const firstBeatTime = beats.length > 0 ? (beats[0] ?? null) : null;

  const rate = Math.max(config.rate || 60, 20);
  const cycleLength = 60 / rate;
  // Allow at most one full cardiac cycle before the first beat appears.
  // Also cap at 0.6s to ensure even very slow rhythms start promptly.
  const maxAllowedFirstBeatTime = Math.min(cycleLength, 0.6);
  const firstBeatOnTime = firstBeatTime !== null && firstBeatTime <= maxAllowedFirstBeatTime;

  if (!firstBeatOnTime && firstBeatTime !== null) {
    warnings.push(
      `First beat at ${firstBeatTime.toFixed(3)}s exceeds max allowed ${maxAllowedFirstBeatTime.toFixed(3)}s ` +
      `(one cycle for ${rate} BPM). Strip will show ${firstBeatTime.toFixed(2)}s of flatline before first beat — ` +
      "adjust beatOffsets() start time.",
    );
  }

  if (beats.length < 3 && config.rhythmKey !== "asystole") {
    warnings.push(`Strip contains only ${beats.length} beats for a ${seconds}s strip — insufficient for rhythm identification.`);
  }

  return {
    ok: firstBeatOnTime && !requiresLabel,
    firstBeatTime,
    maxAllowedFirstBeatTime,
    firstBeatOnTime,
    stripType,
    requiresLabel,
    labelText,
    warnings,
  };
}

// ─── Internal waveform helpers ─────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function pseudoNoise(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function pulse(t: number, center: number, width: number, amplitude: number): number {
  const z = (t - center) / Math.max(width, 0.0001);
  return amplitude * Math.exp(-z * z);
}

/**
 * Computes the time offsets (in seconds) of each beat center (R-wave) in the strip.
 *
 * CONTINUITY FIX (2026-05-15):
 *   The algorithm previously used `t = 0.35` as the pre-advance starting offset.
 *   Because beats are pushed AFTER adding one cycle length (`t += base; out.push(t)`),
 *   the first beat was always at 0.35 + cycle_length:
 *     - 60 BPM  (cycle 1.0s): first beat at 1.35s → 1.17s of flatline (19% of strip)
 *     - 80 BPM  (cycle 0.75s): first beat at 1.10s → 0.92s of flatline
 *     - 150 BPM (cycle 0.4s):  first beat at 0.75s → 0.57s of flatline
 *     - 250 BPM (cycle 0.24s): first beat at 0.59s → 0.41s (>1 full cycle!) of flatline
 *
 *   The fix: set the initial `t` so that `t + first_cycle_advance = 0.20`.
 *   For regular rhythms this is exact: `t = 0.20 - base`.
 *   For irregular rhythms the first beat may vary slightly around 0.20s but
 *   always within the first cardiac cycle.
 *
 *   Result: the first beat appears at approximately 0.20s into the strip.
 *   - P-wave peak is at t = 0.20 - 0.18 = 0.02s — visible from the strip edge.
 *   - No initial flatline / asystole-artifact before the rhythm begins.
 *   - Matches real telemetry behavior (the trace is already running when the
 *     strip window opens; learners see the rhythm in progress from frame 1).
 */
/**
 * Breathing cycle length for RSA waveform generation (seconds).
 * ~20 breaths/min in children = 3.0s cycle.
 * Exported so ecg-live-strip.tsx can compute the respiration overlay width.
 */
export const RSA_BREATHING_CYCLE_SECONDS = 3.0;
/** Maximum R-R modulation depth for RSA — ±18% of base cycle. */
export const RSA_RR_MODULATION_DEPTH = 0.18;

function beatOffsets(config: EcgStripMediaConfig, seconds: number): number[] {
  if (config.rhythmKey === "asystole" || config.rhythmKey === "ventricular_fibrillation") return [];
  const rate = clamp(config.rate || 60, 20, 260);
  const base = 60 / rate;
  const out: number[] = [];
  // Set start so that t + first_advance ≈ 0.20s (first beat appears at strip start).
  let t = 0.20 - Math.max(0.22, base);
  let i = 0;
  while (t < seconds + 0.5) {
    const irregular =
      config.regularity === "irregular" ? (pseudoNoise(i + rate) - 0.5) * base * 0.55 :
      config.regularity === "regularly_irregular" && i % 4 === 3 ? base * 0.75 :
      0;

    // RSA: sinusoidal R-R modulation synchronized to respiratory cycle.
    // -sin(2π*t/T) means: at t=T/4 (early inspiration) R-R shortens (faster rate);
    // at t=3T/4 (expiration) R-R lengthens (slower rate). Matches clinical physiology.
    const rsa = config.rhythmKey === "respiratory_sinus_arrhythmia"
      ? -Math.sin((2 * Math.PI * t) / RSA_BREATHING_CYCLE_SECONDS) * base * RSA_RR_MODULATION_DEPTH
      : 0;

    t += Math.max(0.22, base + irregular + rsa);
    out.push(t);
    i += 1;
  }
  return out;
}

/**
 * Baseline signal for rhythms that have continuous atrial or chaotic activity
 * between QRS complexes (independent of beat timing).
 *
 * Morphology notes:
 *   VF     — chaotic fibrillatory waveform with 5 incommensurate sinusoids.
 *            No two cycles look the same — matches real clinical VF morphology.
 *   AFib   — irregular fine f-waves (350–600/min equivalent) using 4 sinusoids
 *            at incommensurate frequencies. Distinctly different from the organized
 *            sawtooth of flutter. Amplitude is low (~0.05–0.06 units) as seen on
 *            real telemetry monitors.
 *   Flutter — organized sawtooth at ~300/min (rate 10*π Hz ≈ 31.4 cycles/s here).
 *             Perfectly regular between QRS complexes.
 *   Asystole — near-flat with minimal low-frequency wandering only.
 */
function baselineForRhythm(config: EcgStripMediaConfig, t: number): number {
  if (config.rhythmKey === "ventricular_fibrillation") {
    // 5 incommensurate sinusoids: more chaotic, less periodic-looking than 3.
    return (
      0.40 * Math.sin(t * 28 + 0.3) +
      0.28 * Math.sin(t * 47 + 1.1) +
      0.18 * Math.sin(t * 73 + 2.0) +
      0.13 * Math.sin(t * 111 + 0.8) +
      0.09 * Math.sin(t * 89 + 3.1)
    );
  }
  if (config.rhythmKey === "asystole") {
    return 0.015 * Math.sin(t * 7);
  }
  if (config.rhythmKey === "atrial_flutter") {
    // Organized sawtooth flutter waves
    return 0.11 * Math.asin(Math.sin(t * Math.PI * 10)) / (Math.PI / 2);
  }
  if (config.rhythmKey === "atrial_fibrillation") {
    // Irregular fine f-waves: 4 incommensurate sinusoids at AF-typical frequencies.
    // Low amplitude, irregular appearance — distinctly NOT organized like flutter.
    return (
      0.055 * Math.sin(t * 43.7) +
      0.040 * Math.sin(t * 71.3 + 1.17) +
      0.030 * Math.sin(t * 113.9 + 2.31) +
      0.025 * Math.sin(t * 97.1 + 0.74)
    );
  }
  return 0;
}

/**
 * Contribution of a single beat to the waveform signal at time t.
 *
 * Morphology improvements (2026-05-15 sprint):
 *
 *   1. PR interval adaptation: prolonged PR (1st-degree AV block) shifts P-wave
 *      onset earlier (more negative dt) to reflect the delayed conduction.
 *
 *   2. T-wave rate adaptation: QT shortens with tachycardia. T-wave peak is
 *      placed at ~65% of the rate-adapted QT interval instead of a fixed 0.28s.
 *      Uses Bazett-approximated QT: QT ≈ 0.40 / √(rate/60).
 *
 *   3. ST elevation: replaced rectangular step function with a smooth Gaussian
 *      centered at the J-point. Produces the curved ST morphology seen in STEMI —
 *      the old dt > 0.05 step produced an abrupt cliff not found in real strips.
 *
 *   4. Torsades axis twisting: previous sin(beatIndex * 0.9) started at sin(0)=0
 *      for beatIndex=0 — the first torsades beat had ZERO polymorphic contribution,
 *      making it look like a normal narrow QRS. Fixed: use sin(beatIndex * 0.9 + π/2)
 *      so the first beat has full positive-axis twisting and the pattern is
 *      visible from the start of the strip.
 *
 *   5. AV dissociation P-waves: when prIntervalPattern==="av_dissociation" (3rd-degree
 *      AV block), the P-wave runs at a fixed atrial rate (≈70 BPM) independent of
 *      the slow ventricular escape rate. Computed using a separate t-based calculation
 *      rather than the beat-offset position.
 */
function beatContribution(
  config: EcgStripMediaConfig,
  t: number,
  beat: number,
  beatIndex: number,
): number {
  const dt = t - beat;
  const qrsWidth = clamp(config.qrsWidth || 0.08, 0.04, 0.24);
  const rate = clamp(config.rate || 60, 20, 260);

  // Rate-adapted QT: Bazett approximation (capped for extremes)
  const qtSeconds = clamp(0.40 / Math.sqrt(rate / 60), 0.22, 0.55);
  // T-wave peak at ~65% of QT, minimum 0.22s from QRS
  const tOffset = Math.max(0.22, qtSeconds * 0.65);

  let y = 0;

  // ── P-wave ──────────────────────────────────────────────────────────────────
  if (config.pWavePattern === "present") {
    // PR prolongation (1st-degree AV block): P-wave shifts to ~0.24s before QRS
    const prOffset = config.prIntervalPattern === "prolonged" ? -0.26 : -0.18;
    y += pulse(dt, prOffset, 0.038, 0.13);
  }
  if (config.pWavePattern === "paced" || config.features?.pacerSpikes) {
    // Pacer spike: very narrow, high amplitude, just before QRS
    y += pulse(dt, -0.038, 0.0035, 1.05);
    // Add paced P-wave morphology after spike
    y += pulse(dt, -0.022, 0.035, 0.10);
  }

  // AV dissociation (3rd-degree AV block): independent atrial activity.
  // P-waves march at ~70 BPM regardless of the slow ventricular escape rate.
  // Implemented as t-based (not beat-based) calculation.
  if (config.prIntervalPattern === "av_dissociation" && config.pWavePattern === "dissociated") {
    const atrialRate = 72; // typical intact sinus rate in complete heart block
    const atrialCycle = 60 / atrialRate;
    // Generate P-wave contribution from t directly using a repeating window
    const tMod = ((t % atrialCycle) + atrialCycle) % atrialCycle;
    const pCenter = atrialCycle * 0.2; // P-wave at 20% into atrial cycle
    const distFromP = tMod - pCenter;
    y += pulse(distFromP, 0, 0.035, 0.11);
  }

  // ── QRS + T-wave ─────────────────────────────────────────────────────────────
  const dropBeat =
    config.prIntervalPattern === "progressive_prolongation" && beatIndex % 4 === 3;

  if (!dropBeat) {
    const wide = qrsWidth > 0.12;
    const qrsAmp = wide ? 1.05 : 0.85;

    // Q-wave
    y += pulse(dt, -qrsWidth * 0.30, qrsWidth * 0.20, -0.30);
    // R-wave (main positive deflection)
    y += pulse(dt, 0, qrsWidth * 0.12, qrsAmp);
    // S-wave
    y += pulse(dt, qrsWidth * 0.34, qrsWidth * 0.22, -0.38);

    // ── T-wave (rate-adapted position) ────────────────────────────────────────
    const tAmp = config.features?.peakedT
      ? 0.58
      : config.rhythmKey === "hypokalemia_pattern"
        ? 0.06
        : 0.24;
    const tWidth = config.features?.peakedT ? 0.048 : 0.092;
    y += pulse(dt, tOffset, tWidth, tAmp);

    // Hypokalemia: prominent U-wave after T-wave
    if (config.rhythmKey === "hypokalemia_pattern") {
      y += pulse(dt, tOffset + 0.18, 0.055, 0.20);
    }

    // ── ST elevation (smooth curve — replaces old rectangular step) ────────────
    // Clinical STEMI morphology: smooth J-point takeoff, curved ST plateau,
    // blending into T-wave upstroke. Gaussian centered between J-point and T-peak.
    if (config.features?.stElevation) {
      const stCenter = qrsWidth * 0.5 + 0.08; // just after QRS end, before T
      y += pulse(dt, stCenter, 0.085, 0.20);   // primary elevation hump
      y += pulse(dt, stCenter + 0.06, 0.06, 0.08); // plateau extension into T-wave upstroke
    }

    // ST depression (subendocardial ischemia): downward Gaussian
    if (config.rhythmKey === "stemi_pattern" && !config.features?.stElevation) {
      y -= pulse(dt, 0.10, 0.07, 0.14);
    }
  }

  // ── Torsades de pointes: polymorphic axis twisting ──────────────────────────
  // CRITICAL FIX: previous sin(beatIndex * 0.9) started at sin(0) = 0, making the
  // first beat's polymorphic contribution zero — it looked like a normal QRS.
  // Using + π/2 phase shift: first beat has full positive amplitude (sin(π/2) = 1),
  // ensuring the polymorphic character is visible from the very first complex.
  if (config.rhythmKey === "torsades_de_pointes") {
    const twist = Math.sin(beatIndex * 0.85 + Math.PI / 2);
    // Additional mid-cycle swing to exaggerate the axis shift
    const swing = Math.sin(beatIndex * 0.42);
    y += pulse(dt, 0, 0.055, 1.2 * twist) +
         pulse(dt, 0.09, 0.07, -0.85 * twist) +
         pulse(dt, -0.04, 0.04, 0.35 * swing);
  }

  return y;
}

// ─── Public API ────────────────────────────────────────────────────────────

export function generateEcgWaveform(config: EcgStripMediaConfig, options: EcgWaveformOptions = {}): EcgWaveformResult {
  const width = options.width ?? 720;
  const height = options.height ?? 220;
  const seconds = options.seconds ?? 6;
  const sampleRate = options.sampleRate ?? 120;
  const modeArtifact = config.educationalMode
    ? ECG_MODE_ARTIFACT_LEVELS[config.educationalMode]
    : 0.02;
  const artifact = clamp(config.artifactLevel ?? modeArtifact, 0, 0.18);
  const amplitude = config.amplitude ?? 44;
  const beats = beatOffsets(config, seconds);
  const points: EcgPoint[] = [];
  const total = Math.max(2, Math.floor(seconds * sampleRate));
  const isRsa = config.rhythmKey === "respiratory_sinus_arrhythmia";
  const respirationPhases: Array<"inspiration" | "expiration"> = [];

  for (let i = 0; i <= total; i += 1) {
    const t = (i / total) * seconds;
    let signal = baselineForRhythm(config, t);
    beats.forEach((beat, beatIndex) => {
      signal += beatContribution(config, t, beat, beatIndex);
    });
    signal += (pseudoNoise(i + config.rate) - 0.5) * artifact;
    points.push({ x: (t / seconds) * width, y: height / 2 - signal * amplitude });

    // Respiration phase overlay: only for RSA in educational mode
    if (isRsa) {
      // Phase within breathing cycle. -sin < 0 = inspiration (faster), -sin > 0 = expiration.
      const phase = -Math.sin((2 * Math.PI * t) / RSA_BREATHING_CYCLE_SECONDS);
      respirationPhases.push(phase <= 0 ? "inspiration" : "expiration");
    }
  }

  return {
    points,
    viewBox: `0 0 ${width} ${height}`,
    path: points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" "),
    grid: { minor: 8, major: 40 },
    respirationPhases,
  };
}

export function generateEcgWaveformPoints(config: EcgStripMediaConfig, options: EcgWaveformOptions = {}): EcgWaveformResult & { width: number; height: number } {
  const result = generateEcgWaveform(config, options);
  return { ...result, width: options.width ?? 720, height: options.height ?? 220 };
}

export function defaultEcgStripConfigForRhythm(rhythmKey: string): EcgStripMediaConfig {
  const template = getEcgRhythmTemplate(rhythmKey);
  if (!template) throw new Error(`Unknown ECG rhythm template: ${rhythmKey}`);
  const rate = template.expectedRateRange[0] === 0 && template.expectedRateRange[1] === 0
    ? 0
    : Math.round((template.expectedRateRange[0] + template.expectedRateRange[1]) / 2);

  // Default educational mode by difficulty:
  //   basic → clean_teaching (minimal distraction, maximum morphology clarity)
  //   intermediate → realistic_monitor
  //   advanced → telemetry_review
  const educationalMode: EcgEducationalMode =
    template.difficulty === "basic" ? "clean_teaching"
    : template.difficulty === "intermediate" ? "realistic_monitor"
    : "telemetry_review";

  return {
    mediaType: "ecg_live_strip",
    rhythmKey,
    rate,
    regularity: template.rhythmRegularity,
    pWavePattern: template.pWavePresence,
    prIntervalPattern: template.prIntervalPattern,
    qrsWidth: Number(((template.qrsWidthRange[0] + template.qrsWidthRange[1]) / 2).toFixed(2)),
    qtBehavior: template.qtBehavior,
    difficulty: template.difficulty,
    pathwayTierScope: template.applicableTiers,
    stripType: "single_rhythm",
    educationalMode,
    morphologyProfile: "standard",
    features: {
      hasOrganizedQrs: !["ventricular_fibrillation", "asystole"].includes(rhythmKey),
      hasRecurringQrs: !["ventricular_fibrillation", "asystole"].includes(rhythmKey),
      avDissociation: template.prIntervalPattern === "av_dissociation",
      progressivePr: template.prIntervalPattern === "progressive_prolongation",
      polymorphicTwisting: rhythmKey === "torsades_de_pointes",
      peakedT: rhythmKey === "hyperkalemia_pattern",
      widenedQrs: template.qrsWidthRange[1] > 0.12,
      stElevation: rhythmKey === "stemi_pattern",
      pacerSpikes: rhythmKey === "paced_rhythm",
    },
  };
}
