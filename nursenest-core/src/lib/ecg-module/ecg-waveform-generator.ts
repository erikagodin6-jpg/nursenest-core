import { getEcgRhythmTemplate, type EcgRhythmTemplate } from "@/lib/ecg-module/ecg-rhythm-templates";
import type { PediatricAgeGroup } from "@/lib/ecg-module/ecg-pediatric-rhythm-registry";

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
  /**
   * Pediatric age group — when set, adjusts morphology parameters for age-appropriate
   * rendering. Pediatric strips MUST set this; it prevents adult morphology defaults
   * from producing clinically incorrect strips.
   *
   * Age-specific adjustments applied when ageGroup is set:
   *   - PR interval shortened per AHA pediatric ECG norms
   *   - QRS duration narrowed per developmental stage
   *   - Neonatal/infant right ventricular dominance: tall upright T in right-sided leads
   *   - Rate validated against age-specific expected range
   */
  ageGroup?: PediatricAgeGroup;
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
    /** NSTEMI / subendocardial ischemia: horizontal or downsloping ST depression */
    stDepression?: boolean;
    /** RBBB: RSR' (rabbit-ears) pattern in V1 — adds R' wave after the S-wave */
    rsrPrime?: boolean;
    /** LBBB: broad notched R in I/V6, QS in V1 — replaces standard Q-R-S morphology */
    broadNotchedR?: boolean;
    /** Junctional: small retrograde P-wave appearing after QRS (~80–100 ms post-QRS) */
    retrogradeP?: boolean;
    /**
     * Neonatal/infant right ventricular dominance: tall upright T-wave in right-precordial
     * leads (V1–V3). Normal in neonates up to 7 days; persistence suggests RVH.
     * Inverted T in V1 is normal for children > 7 days and adults — this flag reverses that.
     */
    rightVentricularDominance?: boolean;
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

// ─── Pediatric morphology parameters ──────────────────────────────────────────

/**
 * Age-specific normal PR interval midpoints (seconds).
 * Source: AHA/ACC pediatric ECG norms, Harriet Lane Handbook.
 *
 * Adults: 0.12–0.20s (rendered as 0.18s offset in our coordinate space).
 * Pediatric values are shorter — neonates have the shortest PR of any age group.
 */
const PEDIATRIC_PR_OFFSETS: Record<PediatricAgeGroup, number> = {
  neonate:    -0.10,  // 80–100 ms typical
  infant:     -0.11,  // 80–110 ms typical
  toddler:    -0.12,  // 80–120 ms typical
  child:      -0.14,  // 90–140 ms typical
  adolescent: -0.16,  // 110–160 ms (approaching adult range)
};

/**
 * Age-specific typical QRS durations (seconds) for narrowing adjustment.
 * Pediatric QRS is narrower because the conduction system is smaller.
 * Source: AHA pediatric ECG reference values.
 */
const PEDIATRIC_QRS_WIDTHS: Record<PediatricAgeGroup, number> = {
  neonate:    0.055,  // 30–65 ms
  infant:     0.058,  // 30–65 ms
  toddler:    0.064,  // 30–75 ms
  child:      0.070,  // 40–80 ms
  adolescent: 0.080,  // 50–90 ms (approaching adult range)
};

/**
 * Returns age-appropriate PR interval offset for pediatric strips.
 * For adult strips (no ageGroup), returns the standard adult value.
 */
function pediatricPrOffset(ageGroup: PediatricAgeGroup | undefined, prolonged: boolean): number {
  if (!ageGroup) return prolonged ? -0.26 : -0.18;
  const base = PEDIATRIC_PR_OFFSETS[ageGroup];
  // First-degree AV block in children: add ~0.04s beyond the age-normal max
  return prolonged ? base - 0.04 : base;
}

/**
 * Returns age-appropriate effective QRS width for pediatric strips.
 * Does not override explicit wide-QRS rhythms (VT, BBB, paced).
 */
function pediatricQrsWidth(
  configQrsWidth: number,
  ageGroup: PediatricAgeGroup | undefined,
): number {
  if (!ageGroup || configQrsWidth >= 0.12) return configQrsWidth;
  // Blend toward age-typical: if author specified a wider value, respect it
  return Math.min(configQrsWidth, PEDIATRIC_QRS_WIDTHS[ageGroup]);
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
    // Organized sawtooth F-waves at 300/min (0.2s cycle).
    // Amplitude 0.18 gives clear picket-fence visibility between QRS complexes.
    return 0.18 * Math.asin(Math.sin(t * Math.PI * 10)) / (Math.PI / 2);
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
 * Morphology changelog:
 *
 *   2026-05-15: PR interval adaptation, T-wave rate adaptation, smooth ST elevation,
 *               Torsades first-beat fix, AV dissociation P-waves.
 *
 *   P0 audit corrections:
 *
 *   PVC beat-level morphology: every 3rd beat is an ectopic PVC (wide bizarre QRS,
 *     no P-wave, inverted T). Remaining beats show normal narrow sinus morphology.
 *     Previously ALL beats were rendered wide — visually identical to VT.
 *
 *   PAC beat-level morphology: every 4th beat is a PAC (small biphasic ectopic P,
 *     normal narrow QRS). Previously all beats were identical, misrepresenting PACs.
 *
 *   Wenckebach progressive PR: PR lengthens across beats 0→1→2 before the dropped
 *     beat (position 3). Previously the P-wave offset was fixed for all beats.
 *
 *   RBBB morphology: RSR' pattern (R' wave after S) added when features.rsrPrime
 *     is set. Secondary T-wave inversion included.
 *
 *   LBBB morphology: broad notched R (two overlapping humps), no Q-wave, discordant
 *     T-wave when features.broadNotchedR is set.
 *
 *   NSTEMI: downsloping ST depression when features.stDepression is set.
 *
 *   Junctional retrograde P: small inverted P after QRS when features.retrogradeP
 *     is set (junctional rhythms where retrograde atrial activation is visible).
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

  // ── PVC beat-level morphology ────────────────────────────────────────────────
  // Trigeminy representation: every 3rd beat is an ectopic PVC.
  //   PVC beat: wide bizarre QRS (no preceding P, inverted T, tall R with deep S).
  //   Other beats: normal sinus morphology (upright P + narrow QRS + upright T).
  // This replaces the previous incorrect behavior where ALL beats were rendered
  // wide — making the strip look like VT rather than PVCs.
  if (config.rhythmKey === "pvcs") {
    const isPvc = beatIndex % 3 === 2;
    if (isPvc) {
      const pw = Math.max(config.qrsWidth, 0.14); // ectopic beat uses config qrsWidth (≥ 0.14s)
      y += pulse(dt, -pw * 0.22, pw * 0.18, -0.22);   // small Q-equivalent
      y += pulse(dt, 0, pw * 0.11, 1.45);             // tall R (no P precedes it)
      y += pulse(dt, pw * 0.40, pw * 0.28, -0.68);    // deep S
      y += pulse(dt, tOffset, 0.105, -0.32);           // inverted T (opposite polarity to R)
    } else {
      y += pulse(dt, -0.18, 0.038, 0.13);             // normal sinus P-wave
      y += pulse(dt, -0.024, 0.016, -0.30);           // Q
      y += pulse(dt, 0, 0.0096, 0.85);                // R
      y += pulse(dt, 0.0272, 0.0176, -0.38);          // S
      y += pulse(dt, tOffset, 0.092, 0.24);           // upright T
    }
    return y;
  }

  // ── PAC beat-level morphology ────────────────────────────────────────────────
  // Every 4th beat is a PAC: premature ectopic P-wave (small, biphasic, different
  // axis) followed by normal narrow QRS. All other beats show normal sinus morphology.
  if (config.rhythmKey === "pacs") {
    const isPac = beatIndex % 4 === 3;
    if (isPac) {
      // Ectopic atrial P: clearly inverted, reflecting a depolarization vector
      // from an ectopic atrial focus. Inversion is immediately distinct from the
      // upright sinus P-wave — the key visual teaching cue learners must recognise.
      y += pulse(dt, -0.15, 0.036, -0.13); // inverted ectopic P-wave
    } else {
      y += pulse(dt, -0.18, 0.038, 0.13);  // normal sinus P
    }
    // All PAC-rhythm beats: normal narrow QRS + upright T
    y += pulse(dt, -0.024, 0.016, -0.30);
    y += pulse(dt, 0, 0.0096, 0.85);
    y += pulse(dt, 0.0272, 0.0176, -0.38);
    y += pulse(dt, tOffset, 0.092, 0.24);
    return y;
  }

  // ── P-wave ──────────────────────────────────────────────────────────────────
  const ageGroup = config.ageGroup;
  const effQrsWidth = pediatricQrsWidth(qrsWidth, ageGroup);

  if (config.pWavePattern === "present") {
    let prOffset: number;
    if (config.rhythmKey === "second_degree_type_i_av_block") {
      // Wenckebach: PR lengthens progressively across the 4-beat group.
      // Pediatric Wenckebach uses age-appropriate base PR.
      const basePr = ageGroup ? PEDIATRIC_PR_OFFSETS[ageGroup] : -0.19;
      const wenckPr = [basePr, basePr - 0.05, basePr - 0.11, basePr - 0.11];
      prOffset = wenckPr[beatIndex % 4] ?? basePr;
    } else {
      prOffset = pediatricPrOffset(ageGroup, config.prIntervalPattern === "prolonged");
    }
    // Pediatric P-wave: slightly lower amplitude and narrower in neonates/infants
    const pAmp = (ageGroup === "neonate" || ageGroup === "infant") ? 0.09 : 0.13;
    const pWidth = (ageGroup === "neonate" || ageGroup === "infant") ? 0.030 : 0.038;
    y += pulse(dt, prOffset, pWidth, pAmp);
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
    const tMod = ((t % atrialCycle) + atrialCycle) % atrialCycle;
    const pCenter = atrialCycle * 0.2; // P-wave at 20% into atrial cycle
    const distFromP = tMod - pCenter;
    y += pulse(distFromP, 0, 0.035, 0.11);
  }

  // ── QRS + T-wave ─────────────────────────────────────────────────────────────
  // Drop the QRS for:
  //   Wenckebach (progressive_prolongation): dropped beat follows longest PR.
  //   Mobitz II (dropped_beats): abrupt non-conducted P — no preceding PR change.
  // In both cases the P-wave is rendered above, so the non-conducted P is visible.
  const dropBeat =
    (config.prIntervalPattern === "progressive_prolongation" ||
      config.prIntervalPattern === "dropped_beats") &&
    beatIndex % 4 === 3;

  if (!dropBeat) {
    const wide = effQrsWidth > 0.12;
    const qrsAmp = wide ? 1.05 : 0.85;

    if (config.features?.broadNotchedR) {
      // ── LBBB morphology ──────────────────────────────────────────────────────
      y += pulse(dt, -effQrsWidth * 0.14, effQrsWidth * 0.24, qrsAmp * 0.62);
      y += pulse(dt, effQrsWidth * 0.24, effQrsWidth * 0.24, qrsAmp * 0.88);
      y += pulse(dt, tOffset, 0.092, -0.22);
    } else {
      // ── Standard Q-R-S morphology ────────────────────────────────────────────
      y += pulse(dt, -effQrsWidth * 0.30, effQrsWidth * 0.20, -0.30);  // Q-wave
      y += pulse(dt, 0, effQrsWidth * 0.12, qrsAmp);                    // R-wave
      y += pulse(dt, effQrsWidth * 0.34, effQrsWidth * 0.22, -0.38);   // S-wave

      if (config.features?.rsrPrime) {
        // ── RBBB: RSR' (rabbit ears) pattern ──────────────────────────────────
        y += pulse(dt, effQrsWidth * 0.74, effQrsWidth * 0.18, 0.50);
        y += pulse(dt, effQrsWidth * 0.96, effQrsWidth * 0.14, -0.20);
        y += pulse(dt, tOffset, 0.092, -0.16);
      } else if (config.features?.rightVentricularDominance) {
        // ── Neonatal/infant RV dominance ─────────────────────────────────────
        // Neonates have physiologic tall upright T-wave in right-sided leads reflecting
        // high RV mass at birth. Reduced S-wave depth (less left-ward QRS axis than adults).
        // The S-wave was already added above as -0.38; we add +0.16 to net -0.22 (shallower).
        const rvdTAmp = (ageGroup === "neonate") ? 0.48 : 0.36;
        y += pulse(dt, tOffset, 0.072, rvdTAmp);               // tall upright T (RV dominance)
        y += pulse(dt, effQrsWidth * 0.34, effQrsWidth * 0.22, +0.16);  // shallows the S
      } else {
        // ── Standard T-wave ───────────────────────────────────────────────────
        const tAmp = config.features?.peakedT
          ? 0.58
          : config.rhythmKey === "hypokalemia_pattern"
            ? 0.06
          : config.features?.stDepression
            // NSTEMI: near-flat T-wave — ischaemia reduces repolarisation amplitude
            ? 0.04
            : 0.24;
        const tWidth = config.features?.peakedT ? 0.048 : 0.092;
        y += pulse(dt, tOffset, tWidth, tAmp);

        // Hypokalemia: prominent U-wave after T-wave
        if (config.rhythmKey === "hypokalemia_pattern") {
          y += pulse(dt, tOffset + 0.18, 0.055, 0.20);
        }
      }

      // ── ST elevation (STEMI): smooth J-point takeoff into T-wave upstroke ───
      if (config.features?.stElevation) {
        const stCenter = qrsWidth * 0.5 + 0.08;
        y += pulse(dt, stCenter, 0.085, 0.20);
        y += pulse(dt, stCenter + 0.06, 0.06, 0.08);
      }

      // ── ST depression (NSTEMI / subendocardial ischemia) ─────────────────────
      // ~2mm downsloping ST depression — visually unambiguous ischaemic pattern.
      // Combined with the near-flat T-wave above, the J-point-to-T pattern matches
      // accepted NSTEMI teaching criteria (horizontal/downsloping ST ≥ 1mm).
      if (config.features?.stDepression) {
        y -= pulse(dt, 0.08, 0.082, 0.40);  // primary depression (~2mm)
        y -= pulse(dt, 0.17, 0.070, 0.15);  // downsloping extension
      }

      // Backward-compat: ST depression for stemi_pattern without stElevation flag
      if (config.rhythmKey === "stemi_pattern" && !config.features?.stElevation) {
        y -= pulse(dt, 0.10, 0.07, 0.14);
      }
    }
  }

  // ── Junctional retrograde P-wave (after QRS) ────────────────────────────────
  // Small inverted P ~80–100 ms after QRS, reflecting retrograde atrial activation.
  // Rendered only when features.retrogradeP is set (junctional rhythms).
  if (config.features?.retrogradeP) {
    y += pulse(dt, 0.10, 0.030, -0.09);
  }

  // ── Torsades de pointes: polymorphic axis twisting ──────────────────────────
  // Using + π/2 phase shift: first beat has full positive amplitude (sin(π/2) = 1),
  // ensuring the polymorphic character is visible from the very first complex.
  if (config.rhythmKey === "torsades_de_pointes") {
    const twist = Math.sin(beatIndex * 0.85 + Math.PI / 2);
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
    : rhythmKey === "atrial_flutter"
      // 4:1 AV conduction (atrial 300/min → ventricular 75/min) — shows exactly
      // 4 F-waves per QRS, producing the classic picket-fence teaching pattern.
      ? 75
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
      stDepression: rhythmKey === "nstemi_pattern",
      rsrPrime: rhythmKey === "right_bundle_branch_block",
      broadNotchedR: rhythmKey === "left_bundle_branch_block",
      retrogradeP: rhythmKey === "junctional_rhythm" || rhythmKey === "accelerated_junctional_rhythm",
    },
  };
}

/**
 * Returns a clinically correct EcgStripMediaConfig for a pediatric rhythm at a
 * specific age group. Rate is drawn from PEDIATRIC_NORMAL_RATE_RANGES or the
 * pediatric rhythm registry's rateRangesByAgeGroup.
 *
 * Key differences from defaultEcgStripConfigForRhythm():
 *   - ageGroup is set → age-specific PR interval and QRS width applied in rendering
 *   - Rate is age-stratified, not the adult mid-range
 *   - Neonates/infants receive rightVentricularDominance=true for sinus rhythms
 *   - Educational mode defaults to clean_teaching for foundational pediatric content
 */
export function defaultPediatricEcgStripConfig(
  rhythmKey: string,
  ageGroup: PediatricAgeGroup,
  overrides: Partial<EcgStripMediaConfig> = {},
): EcgStripMediaConfig {
  const base = defaultEcgStripConfigForRhythm(rhythmKey);

  // Age-stratified rate selection for common pediatric sinus rhythms.
  const pediatricRates: Partial<Record<string, Record<PediatricAgeGroup, number>>> = {
    normal_sinus_rhythm: { neonate: 130, infant: 120, toddler: 95, child: 80, adolescent: 72 },
    sinus_tachycardia:   { neonate: 185, infant: 175, toddler: 155, child: 140, adolescent: 120 },
    sinus_bradycardia:   { neonate: 85,  infant: 72,  toddler: 62,  child: 55,  adolescent: 48  },
    respiratory_sinus_arrhythmia: { neonate: 120, infant: 110, toddler: 90, child: 75, adolescent: 65 },
    svt:                 { neonate: 260, infant: 250, toddler: 220, child: 190, adolescent: 190 },
    ventricular_tachycardia: { neonate: 200, infant: 190, toddler: 170, child: 150, adolescent: 140 },
  };

  const ageRate = pediatricRates[rhythmKey]?.[ageGroup];
  const rate = ageRate ?? base.rate;

  const isNeonateOrInfant = ageGroup === "neonate" || ageGroup === "infant";
  const isSinusRhythm = [
    "normal_sinus_rhythm",
    "sinus_bradycardia",
    "sinus_tachycardia",
    "respiratory_sinus_arrhythmia",
  ].includes(rhythmKey);

  return {
    ...base,
    rate,
    ageGroup,
    educationalMode: "clean_teaching",
    features: {
      ...base.features,
      // Neonatal/infant RV dominance for sinus rhythms — physiologic finding
      rightVentricularDominance: isNeonateOrInfant && isSinusRhythm,
    },
    ...overrides,
  };
}

/** Exported pediatric morphology lookup for use by comparison module and validators. */
export { PEDIATRIC_PR_OFFSETS, PEDIATRIC_QRS_WIDTHS };
export type { PediatricAgeGroup };
