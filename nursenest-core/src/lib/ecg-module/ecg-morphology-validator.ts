/**
 * ECG Morphology Validator
 *
 * Runtime validation of rhythm-specific morphology invariants.
 * Called by the CI contract tests, the strip publication gate, and optionally at
 * question-authoring time to prevent morphologically inconsistent strips.
 *
 * Design principle: each validator checks a single, clinically meaningful invariant.
 * Failures are hard errors for published learner-facing strips; warnings only for
 * draft/internal strips.
 *
 * Validation is based on the EcgStripMediaConfig — not the rendered waveform.
 * Rendered-waveform analysis (pixel-level peak detection) is in the test suite.
 *
 * Architecture:
 *   - All validators are pure functions (EcgStripMediaConfig → EcgMorphologyViolation[])
 *   - `validateEcgStripMorphology()` runs all applicable validators for a rhythm
 *   - `isPublishableMorphology()` is the single-call gate for production content
 */

import type {
  EcgStripMediaConfig,
  EcgEducationalMode,
} from "@/lib/ecg-module/ecg-waveform-generator";
import { getEcgRhythmTemplate } from "@/lib/ecg-module/ecg-rhythm-templates";
import {
  getPediatricNormalRateRange,
  type PediatricAgeGroup,
} from "@/lib/ecg-module/ecg-pediatric-rhythm-registry";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type EcgMorphologyViolationSeverity = "error" | "warning";

export type EcgMorphologyViolation = {
  rule: string;
  message: string;
  severity: EcgMorphologyViolationSeverity;
  /** Clinical rationale — why this invariant matters for learner safety. */
  clinicalRationale: string;
};

export type EcgMorphologyValidationResult = {
  ok: boolean;
  rhythmKey: string;
  educationalMode: EcgEducationalMode | undefined;
  violations: EcgMorphologyViolation[];
  errors: EcgMorphologyViolation[];
  warnings: EcgMorphologyViolation[];
};

// ─── Educational mode governance ──────────────────────────────────────────────

/**
 * Validates that the educational mode is consistent with the strip type and rhythm.
 * Emergency scenario mode MUST be paired with a non-single_rhythm strip type.
 * Artifact training mode MUST use a rhythm that can plausibly exhibit artifact.
 */
function validateEducationalModeConsistency(
  config: EcgStripMediaConfig,
): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];
  const mode = config.educationalMode;
  const stripType = config.stripType ?? "single_rhythm";

  if (mode === "emergency_scenario" && stripType === "single_rhythm") {
    v.push({
      rule: "emergency_mode_requires_non_single_rhythm",
      severity: "error",
      message:
        `educationalMode="emergency_scenario" requires a non-single_rhythm stripType. ` +
        `Current stripType="${stripType}". Set stripType to "deterioration" or "transition".`,
      clinicalRationale:
        "Emergency scenario strips show deteriorating presentations — presenting them " +
        "as a stable single rhythm teaches incorrect identification patterns.",
    });
  }

  if (mode === "artifact_training" && stripType === "single_rhythm") {
    v.push({
      rule: "artifact_training_requires_label",
      severity: "warning",
      message:
        `educationalMode="artifact_training" without a non-single_rhythm stripType. ` +
        "Consider using stripType='artifact_onset' to ensure learners understand they are " +
        "seeing intentional artifact, not a rendering error.",
      clinicalRationale:
        "Unlabeled artifact on a 'clean' strip will be interpreted as rendering failure. " +
        "Learners need explicit context to distinguish motion artifact from rhythm pathology.",
    });
  }

  return v;
}

// ─── Rhythm-specific morphology validators ─────────────────────────────────────

function validateVtMorphology(config: EcgStripMediaConfig): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];
  if (config.qrsWidth < 0.12) {
    v.push({
      rule: "vt_requires_wide_qrs",
      severity: "error",
      message: `VT strip has QRS width ${config.qrsWidth}s — must be ≥ 0.12s.`,
      clinicalRationale:
        "VT is defined by wide QRS (≥ 120ms). A narrow-QRS VT strip teaches learners " +
        "to miss this critical discriminator, leading to treatment errors (adenosine for VT).",
    });
  }
  if (config.pWavePattern !== "absent" && config.pWavePattern !== "dissociated") {
    v.push({
      rule: "vt_p_waves_absent_or_dissociated",
      severity: "warning",
      message: `VT strip has pWavePattern="${config.pWavePattern}" — expected "absent" or "dissociated".`,
      clinicalRationale:
        "In VT, P-waves are either absent or march independently (AV dissociation). " +
        "A strip showing organized P-before-every-QRS misleads learners to exclude VT.",
    });
  }
  if (config.rate < 100) {
    v.push({
      rule: "vt_rate_too_slow",
      severity: "warning",
      message: `VT strip rate ${config.rate} BPM — VT is typically ≥ 100 BPM.`,
      clinicalRationale:
        "Slow wide-complex rhythm at < 100 BPM should be labeled as accelerated idioventricular " +
        "rhythm, not VT — a clinically significant distinction in the post-MI setting.",
    });
  }
  return v;
}

function validateSvtMorphology(config: EcgStripMediaConfig): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];
  if (config.qrsWidth > 0.11 && !config.features?.widenedQrs) {
    v.push({
      rule: "svt_narrow_complex_unless_aberrant",
      severity: "error",
      message: `SVT strip has QRS width ${config.qrsWidth}s without aberrant conduction flag. ` +
        "Set features.widenedQrs=true and add morphologyProfile='aberrant_conduction' for SVT with aberrancy.",
      clinicalRationale:
        "SVT with a wide QRS (aberrancy) is a distinct educational scenario requiring explicit " +
        "labeling — presenting it as standard SVT teaches incorrect QRS-width assessment.",
    });
  }
  if (config.rate < 150) {
    v.push({
      rule: "svt_minimum_rate",
      severity: "warning",
      message: `SVT strip rate ${config.rate} BPM — SVT typically presents at ≥ 150 BPM.`,
      clinicalRationale:
        "Rates < 150 BPM can be sinus tachycardia, not SVT. The rapid rate is the key " +
        "discriminating feature of SVT for novice learners.",
    });
  }
  return v;
}

function validateTorsadesMorphology(config: EcgStripMediaConfig): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];
  if (!config.features?.polymorphicTwisting) {
    v.push({
      rule: "torsades_requires_polymorphic_twisting",
      severity: "error",
      message: "Torsades strip missing features.polymorphicTwisting=true.",
      clinicalRationale:
        "The defining feature of torsades is axis twisting. A strip without this feature " +
        "is morphologically indistinguishable from monomorphic VT — the management differs " +
        "(IV magnesium vs amiodarone).",
    });
  }
  if (!config.qtBehavior || config.qtBehavior !== "prolonged") {
    v.push({
      rule: "torsades_requires_prolonged_qt",
      severity: "warning",
      message: `Torsades strip has qtBehavior="${config.qtBehavior ?? 'unset'}" — expected "prolonged".`,
      clinicalRationale:
        "Torsades requires a prolonged QTc substrate. Teaching torsades without conveying the " +
        "QT-prolongation trigger misses the pharmacology integration (drug-induced LQTS).",
    });
  }
  return v;
}

function validateAfibMorphology(config: EcgStripMediaConfig): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];
  if (config.regularity === "regular") {
    v.push({
      rule: "afib_irregularly_irregular",
      severity: "error",
      message: "AFib strip has regularity='regular' — AFib is always irregularly irregular.",
      clinicalRationale:
        "A 'regular' AFib strip is a contradiction in terms. This will teach learners " +
        "to accept regular rhythms as AFib, missing AF with complete heart block or " +
        "junctional rhythm as the actual cause of a regular narrow-complex rhythm.",
    });
  }
  if (config.pWavePattern !== "absent") {
    v.push({
      rule: "afib_no_organized_p_waves",
      severity: "error",
      message: `AFib strip has pWavePattern="${config.pWavePattern}" — expected "absent".`,
      clinicalRationale:
        "AFib by definition has no organized atrial activity (no discrete P-waves). " +
        "A strip showing organized P-waves before QRS complexes is not AFib — teaching it " +
        "as AFib is a fundamental clinical error.",
    });
  }
  return v;
}

function validateStemiMorphology(config: EcgStripMediaConfig): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];
  if (!config.features?.stElevation) {
    v.push({
      rule: "stemi_requires_st_elevation",
      severity: "error",
      message: "STEMI strip missing features.stElevation=true.",
      clinicalRationale:
        "A STEMI strip without visible ST elevation cannot teach the defining feature " +
        "of STEMI. This would prevent learners from recognizing the pattern in clinical practice.",
    });
  }
  return v;
}

function validatePacedRhythmMorphology(config: EcgStripMediaConfig): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];
  if (!config.features?.pacerSpikes) {
    v.push({
      rule: "paced_rhythm_requires_spikes",
      severity: "error",
      message: "Paced rhythm strip missing features.pacerSpikes=true.",
      clinicalRationale:
        "Pacemaker spikes are the primary identifying feature of a paced rhythm. Without them, " +
        "the strip is morphologically indistinguishable from LBBB or VT — both clinically distinct.",
    });
  }
  if (config.qrsWidth < 0.12) {
    v.push({
      rule: "paced_qrs_typically_wide",
      severity: "warning",
      message: `Paced rhythm QRS ${config.qrsWidth}s — expected ≥ 0.12s for ventricular pacing.`,
      clinicalRationale:
        "Ventricular pacing produces wide QRS complexes (LBBB morphology). A narrow-QRS " +
        "paced strip only applies to atrial pacing — mark this explicitly if intentional.",
    });
  }
  return v;
}

function validateAvBlockMorphology(config: EcgStripMediaConfig): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];

  if (config.rhythmKey === "second_degree_type_i_av_block" && !config.features?.progressivePr) {
    v.push({
      rule: "mobitz_i_requires_progressive_pr",
      severity: "error",
      message: "Mobitz I strip missing features.progressivePr=true.",
      clinicalRationale:
        "Progressive PR lengthening is the defining feature of Wenckebach. Without it, " +
        "the strip cannot teach the Mobitz I/II distinction that drives pacing decisions.",
    });
  }

  if (config.rhythmKey === "second_degree_type_ii_av_block" && config.features?.progressivePr) {
    v.push({
      rule: "mobitz_ii_no_progressive_pr",
      severity: "error",
      message: "Mobitz II strip has progressivePr=true — Mobitz II has a constant PR before dropped beats.",
      clinicalRationale:
        "Progressive PR on a 'Mobitz II' strip would teach the wrong diagnosis, leading " +
        "learners to under-triage a rhythm that requires immediate pacing consultation.",
    });
  }

  if (
    config.rhythmKey === "third_degree_av_block" &&
    config.prIntervalPattern !== "av_dissociation"
  ) {
    v.push({
      rule: "third_degree_requires_av_dissociation",
      severity: "error",
      message: `3rd-degree AV block strip has prIntervalPattern="${config.prIntervalPattern}" — requires "av_dissociation".`,
      clinicalRationale:
        "Complete heart block is defined by complete AV dissociation. A strip without " +
        "this feature would be teaching an incomplete or incorrect picture of this " +
        "life-threatening conduction abnormality.",
    });
  }

  return v;
}

function validateAsystoleMorphology(config: EcgStripMediaConfig): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];
  if (config.features?.hasRecurringQrs) {
    v.push({
      rule: "asystole_no_recurring_qrs",
      severity: "error",
      message: "Asystole strip has hasRecurringQrs=true — asystole must be near-flat.",
      clinicalRationale:
        "Asystole with recurring QRS complexes is PEA, not asystole. Conflating the two " +
        "teaches incorrect ACLS algorithm selection.",
    });
  }
  return v;
}

function validateHighRateMorphology(config: EcgStripMediaConfig): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];
  if (config.rate > 200 && config.morphologyProfile !== "high_rate_collapse") {
    v.push({
      rule: "high_rate_morphology_profile_required",
      severity: "warning",
      message:
        `Strip rate ${config.rate} BPM without morphologyProfile="high_rate_collapse". ` +
        "At rates > 200 BPM, QRS complexes may overlap with preceding T-waves. " +
        "Set morphologyProfile='high_rate_collapse' to confirm this has been audited.",
      clinicalRationale:
        "At very high rates, the T-wave of one beat begins to overlap with the QRS of the " +
        "next. Without explicit acknowledgment, reviewers may miss this morphology artifact.",
    });
  }
  return v;
}

function validateJunctionalMorphology(config: EcgStripMediaConfig): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];
  if (config.pWavePattern === "present") {
    v.push({
      rule: "junctional_no_sinus_p_waves",
      severity: "error",
      message: `Junctional rhythm strip has pWavePattern="present" — junctional rhythms have absent or retrograde P-waves, not normal upright sinus P-waves.`,
      clinicalRationale:
        "A junctional rhythm with normal upright sinus P-waves preceding each QRS is indistinguishable from normal sinus rhythm. " +
        "Learners would be taught to identify sinus rhythm as junctional, a fundamental rhythm-identification error.",
    });
  }
  if (config.qrsWidth >= 0.12) {
    v.push({
      rule: "junctional_narrow_qrs",
      severity: "warning",
      message: `Junctional rhythm strip QRS ${config.qrsWidth}s — expected < 0.12s for uncomplicated junctional pacemaker.`,
      clinicalRationale:
        "Junctional rhythms conduct normally through the His–Purkinje system, producing narrow QRS. " +
        "A wide QRS at junctional rates suggests ventricular escape rhythm or aberrant conduction — a different diagnosis with different management.",
    });
  }
  return v;
}

function validateVentricularEscapeMorphology(config: EcgStripMediaConfig): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];
  if (config.qrsWidth < 0.12) {
    v.push({
      rule: "ventricular_escape_wide_qrs",
      severity: "error",
      message: `Ventricular escape rhythm strip QRS ${config.qrsWidth}s — must be ≥ 0.12s.`,
      clinicalRationale:
        "Ventricular escape beats originate in ventricular myocardium, bypassing the His–Purkinje system and always producing wide QRS (≥ 120ms). " +
        "A narrow-QRS ventricular escape is a clinical impossibility and would lead learners to underestimate pacing urgency.",
    });
  }
  if (config.pWavePattern !== "absent" && config.pWavePattern !== "dissociated") {
    v.push({
      rule: "ventricular_escape_no_sinus_p",
      severity: "warning",
      message: `Ventricular escape strip has pWavePattern="${config.pWavePattern}" — expected "absent" or "dissociated".`,
      clinicalRationale:
        "In ventricular escape rhythm the SA node has failed or is dissociated from the ventricles. " +
        "Organized sinus P-waves before each QRS contradicts the escape mechanism and confuses the clinical picture.",
    });
  }
  return v;
}

function validateIdioventricularMorphology(config: EcgStripMediaConfig): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];
  if (config.qrsWidth < 0.12) {
    v.push({
      rule: "idioventricular_wide_qrs",
      severity: "error",
      message: `Idioventricular rhythm strip QRS ${config.qrsWidth}s — must be ≥ 0.12s.`,
      clinicalRationale:
        "AIVR originates from an accelerated ventricular pacemaker cell, always producing wide QRS (≥ 120ms). " +
        "A narrow AIVR strip would be misidentified as accelerated junctional rhythm, leading to incorrect interpretation of post-reperfusion MI findings.",
    });
  }
  return v;
}

function validateRbbbMorphology(config: EcgStripMediaConfig): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];
  if (config.qrsWidth < 0.12) {
    v.push({
      rule: "rbbb_requires_wide_qrs",
      severity: "error",
      message: `RBBB strip QRS ${config.qrsWidth}s — must be ≥ 0.12s.`,
      clinicalRationale:
        "Bundle branch blocks are defined by delayed ventricular activation producing QRS ≥ 120ms. A narrow RBBB is clinically impossible.",
    });
  }
  if (!config.features?.rsrPrime) {
    v.push({
      rule: "rbbb_requires_rsr_prime",
      severity: "error",
      message: "RBBB strip missing features.rsrPrime=true.",
      clinicalRationale:
        "The RSR' pattern (rabbit ears) in V1 is the defining morphological feature of RBBB. " +
        "Without it, learners cannot distinguish RBBB from LBBB, nonspecific IVCD, or VT — each with different clinical implications.",
    });
  }
  return v;
}

function validateLbbbMorphology(config: EcgStripMediaConfig): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];
  if (config.qrsWidth < 0.12) {
    v.push({
      rule: "lbbb_requires_wide_qrs",
      severity: "error",
      message: `LBBB strip QRS ${config.qrsWidth}s — must be ≥ 0.12s.`,
      clinicalRationale: "LBBB is defined by QRS ≥ 120ms. A narrow LBBB is a clinical impossibility.",
    });
  }
  if (!config.features?.broadNotchedR) {
    v.push({
      rule: "lbbb_requires_broad_notched_r",
      severity: "error",
      message: "LBBB strip missing features.broadNotchedR=true.",
      clinicalRationale:
        "The broad notched R-wave in leads I and V6 is the defining feature of LBBB. " +
        "Without this morphology, the strip is indistinguishable from nonspecific IVCD, " +
        "and learners miss the clinical significance for STEMI identification (LBBB = STEMI equivalent in the right context).",
    });
  }
  return v;
}

function validateNstemiMorphology(config: EcgStripMediaConfig): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];
  if (!config.features?.stDepression) {
    v.push({
      rule: "nstemi_requires_st_depression",
      severity: "error",
      message: "NSTEMI strip missing features.stDepression=true.",
      clinicalRationale:
        "ST depression is the defining ECG feature of subendocardial ischemia (NSTEMI). " +
        "Without it, the strip cannot teach learners to identify NSTEMI, the most common acute coronary syndrome pattern.",
    });
  }
  if (config.features?.stElevation) {
    v.push({
      rule: "nstemi_no_st_elevation",
      severity: "error",
      message: "NSTEMI strip has features.stElevation=true — NSTEMI is defined by ST depression, not elevation.",
      clinicalRationale:
        "A NSTEMI strip with ST elevation teaches the opposite finding from the diagnostic criterion. " +
        "Learners would confuse NSTEMI with STEMI — an error that directly affects triage and cath lab activation decisions.",
    });
  }
  return v;
}

// ─── Pediatric morphology validators ──────────────────────────────────────────

/**
 * Validates that a pediatric strip has the ageGroup field set.
 * Pediatric rhythm templates without ageGroup will use adult morphology defaults,
 * producing clinically incorrect strips.
 */
function validatePediatricAgeGroupPresent(config: EcgStripMediaConfig): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];
  if (!config.ageGroup) {
    v.push({
      rule: "pediatric_strip_requires_age_group",
      severity: "error",
      message:
        `Pediatric rhythm "${config.rhythmKey}" strip is missing the ageGroup field. ` +
        "Use defaultPediatricEcgStripConfig(rhythmKey, ageGroup) to get age-appropriate parameters.",
      clinicalRationale:
        "Without ageGroup set, the waveform renderer uses adult PR interval and QRS defaults. " +
        "A neonate strip rendered with adult PR intervals (0.18s) would be clinically incorrect — " +
        "neonate normal PR is 0.08–0.10s. Learners trained on incorrect pediatric morphology " +
        "will misidentify normal neonatal ECGs as first-degree AV block.",
    });
  }
  return v;
}

/**
 * Validates that a pediatric strip's rate is within the age-appropriate normal
 * or expected range for the rhythm.
 *
 * This catches the most dangerous error: a neonate SVT strip rendered at 150 BPM
 * (adult SVT range) when neonatal SVT is 220–300 BPM.
 */
function validatePediatricRateForAgeGroup(config: EcgStripMediaConfig): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];
  const ageGroup = config.ageGroup as PediatricAgeGroup | undefined;
  if (!ageGroup || config.rate === 0) return v;

  const ranges = getPediatricNormalRateRange(ageGroup);

  // For sinus rhythms: rate must be within normal resting range (with tolerance)
  const sinusRhythms = ["pediatric_normal_sinus", "normal_sinus_rhythm", "respiratory_sinus_arrhythmia"];
  if (sinusRhythms.includes(config.rhythmKey)) {
    const low = ranges.restingMin * 0.85;  // 15% below min (clinical variability)
    const high = ranges.restingMax * 1.15; // 15% above max
    if (config.rate < low || config.rate > high) {
      v.push({
        rule: "pediatric_sinus_rate_outside_age_range",
        severity: "warning",
        message:
          `Pediatric ${config.rhythmKey} strip rate ${config.rate} BPM is outside the expected range ` +
          `for ${ageGroup} (${ranges.restingMin}–${ranges.restingMax} BPM ±15%).`,
        clinicalRationale:
          `A ${ageGroup} sinus rhythm at ${config.rate} BPM would be misidentified ` +
          `as ${config.rate < ranges.restingMin ? "bradycardia" : "tachycardia"} if the normal ` +
          "age-specific range is not known. Learners must internalize that pediatric normal " +
          "rates are age-stratified, not the adult 60–100 BPM standard.",
      });
    }
  }

  // For SVT: must be above sinusTachMaxBeforeSvtSuspicion
  if (config.rhythmKey === "pediatric_svt") {
    if (config.rate < ranges.sinusTachMaxBeforeSvtSuspicion) {
      v.push({
        rule: "pediatric_svt_rate_below_svt_threshold",
        severity: "error",
        message:
          `Pediatric SVT strip rate ${config.rate} BPM is below the SVT threshold for ` +
          `${ageGroup} (≥ ${ranges.sinusTachMaxBeforeSvtSuspicion} BPM). ` +
          "At this rate, the strip represents sinus tachycardia, not SVT.",
        clinicalRationale:
          "In infants, sinus tachycardia can reach 220 BPM with fever or sepsis. " +
          "Presenting a strip at 180 BPM as 'SVT' in an infant teaches learners to " +
          "cardiovert what may be sinus tach — a dangerous management error.",
      });
    }
  }

  // For bradycardia: must be below the age-specific bradycardia threshold
  if (config.rhythmKey === "sinus_bradycardia" || config.rhythmKey === "pediatric_hypoxic_bradycardia") {
    if (config.rate >= ranges.bradycardiaThreshold) {
      v.push({
        rule: "pediatric_bradycardia_rate_too_fast",
        severity: "warning",
        message:
          `Pediatric bradycardia strip rate ${config.rate} BPM is at or above the bradycardia ` +
          `threshold for ${ageGroup} (< ${ranges.bradycardiaThreshold} BPM).`,
        clinicalRationale:
          `A ${ageGroup} heart rate of ${config.rate} BPM is not bradycardic for this age group. ` +
          "Presenting it as bradycardia teaches learners an incorrect threshold and may " +
          "cause them to under-triage a child who truly is bradycardic.",
      });
    }
  }

  return v;
}

/**
 * Validates that a pediatric SVT strip has narrow QRS (absent or near-normal width).
 * Wide-QRS SVT with aberrancy is a distinct scenario requiring explicit labeling.
 */
function validatePediatricSvtMorphology(config: EcgStripMediaConfig): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];
  if (config.qrsWidth > 0.09 && !config.features?.widenedQrs) {
    v.push({
      rule: "pediatric_svt_narrow_complex",
      severity: "error",
      message:
        `Pediatric SVT strip QRS ${config.qrsWidth}s is wider than expected without ` +
        "features.widenedQrs=true. Pediatric SVT QRS is typically ≤ 0.08–0.09s.",
      clinicalRationale:
        "Pediatric SVT with a wide QRS (aberrancy or antidromic WPW) is a distinct " +
        "educational scenario. Presenting it without labeling teaches learners to accept " +
        "wide-complex tachycardia as typical SVT — missing the VT differential in a child.",
    });
  }
  if (config.pWavePattern === "present") {
    v.push({
      rule: "pediatric_svt_no_sinus_p_waves",
      severity: "error",
      message: `Pediatric SVT strip has pWavePattern="present" — SVT has absent or retrograde P-waves.`,
      clinicalRationale:
        "Sinus P-waves before every QRS identifies sinus tachycardia, not SVT. " +
        "A pediatric SVT strip with sinus P-waves teaches the wrong discriminating feature.",
    });
  }
  return v;
}

/**
 * Validates that JET (junctional ectopic tachycardia) is not incorrectly flagged
 * as adenosine-responsive or cardioversion-responsive in the question rationale.
 * This is a morphology proxy check: JET must have pWavePattern "absent" or "dissociated".
 */
function validateJetMorphology(config: EcgStripMediaConfig): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];
  if (config.pWavePattern === "present") {
    v.push({
      rule: "jet_no_sinus_p_waves",
      severity: "error",
      message: `JET strip has pWavePattern="present" — JET has AV dissociation, not sinus P-wave conduction.`,
      clinicalRationale:
        "JET originates from the AV junction, which fires independently faster than the sinus node. " +
        "Visible sinus P-waves marching at a slower rate than QRS defines the AV dissociation. " +
        "A strip showing 1:1 sinus conduction is not JET — it would be treated differently (adenosine " +
        "for SVT vs cooling and antiarrhythmics for JET).",
    });
  }
  if (config.qrsWidth > 0.10) {
    v.push({
      rule: "jet_narrow_qrs",
      severity: "warning",
      message: `JET strip QRS ${config.qrsWidth}s — JET conducts via His-Purkinje, producing narrow or near-narrow QRS (≤ 0.10s).`,
      clinicalRationale:
        "JET is distinguished from VT by its narrow QRS. A wide-QRS 'JET' strip would " +
        "be clinically indistinguishable from VT — a different PALS algorithm pathway.",
    });
  }
  return v;
}

/**
 * Validates pediatric VT morphology — same rules as adult VT but with
 * age-specific rate validation.
 */
function validatePediatricVtMorphology(config: EcgStripMediaConfig): EcgMorphologyViolation[] {
  const v: EcgMorphologyViolation[] = [];
  if (config.qrsWidth < 0.12) {
    v.push({
      rule: "pediatric_vt_wide_qrs",
      severity: "error",
      message: `Pediatric VT strip QRS ${config.qrsWidth}s — must be ≥ 0.12s.`,
      clinicalRationale:
        "Pediatric VT, like adult VT, is defined by wide QRS (≥ 120ms). A narrow-QRS " +
        "wide-complex tachycardia in a child should be labeled SVT with aberrancy or JET, " +
        "not VT — different PALS management pathways.",
    });
  }
  return v;
}

// ─── Registry of validators per rhythmKey ──────────────────────────────────────

type MorphologyValidator = (config: EcgStripMediaConfig) => EcgMorphologyViolation[];

const RHYTHM_VALIDATORS: Record<string, MorphologyValidator[]> = {
  ventricular_tachycardia: [validateVtMorphology, validateHighRateMorphology],
  svt: [validateSvtMorphology, validateHighRateMorphology],
  torsades_de_pointes: [validateTorsadesMorphology, validateHighRateMorphology],
  atrial_fibrillation: [validateAfibMorphology],
  stemi_pattern: [validateStemiMorphology],
  nstemi_pattern: [validateNstemiMorphology],
  paced_rhythm: [validatePacedRhythmMorphology],
  second_degree_type_i_av_block: [validateAvBlockMorphology],
  second_degree_type_ii_av_block: [validateAvBlockMorphology],
  third_degree_av_block: [validateAvBlockMorphology],
  asystole: [validateAsystoleMorphology],
  // P0 clinical accuracy audit additions
  junctional_rhythm: [validateJunctionalMorphology],
  accelerated_junctional_rhythm: [validateJunctionalMorphology],
  ventricular_escape_rhythm: [validateVentricularEscapeMorphology],
  idioventricular_rhythm: [validateIdioventricularMorphology],
  right_bundle_branch_block: [validateRbbbMorphology],
  left_bundle_branch_block: [validateLbbbMorphology],
  // Pediatric rhythm validators — enforce age-specific morphology rules
  pediatric_svt: [
    validatePediatricAgeGroupPresent,
    validatePediatricRateForAgeGroup,
    validatePediatricSvtMorphology,
    validateHighRateMorphology,
  ],
  pediatric_hypoxic_bradycardia: [
    validatePediatricAgeGroupPresent,
    validatePediatricRateForAgeGroup,
  ],
  pediatric_ventricular_tachycardia: [
    validatePediatricAgeGroupPresent,
    validatePediatricRateForAgeGroup,
    validatePediatricVtMorphology,
    validateHighRateMorphology,
  ],
  pediatric_normal_sinus: [
    validatePediatricAgeGroupPresent,
    validatePediatricRateForAgeGroup,
  ],
  junctional_ectopic_tachycardia: [
    validatePediatricAgeGroupPresent,
    validateJetMorphology,
    validateHighRateMorphology,
  ],
  // Adult rhythms used in pediatric context still need age validation
  normal_sinus_rhythm:            [],  // pediatric use handled by age group check at runtime
  sinus_bradycardia:              [],
  sinus_tachycardia:              [],
  respiratory_sinus_arrhythmia:   [],
};

// ─── Public API ─────────────────────────────────────────────────────────────────

/**
 * Runs all applicable morphology validators for the given strip config.
 * Returns a typed result with separated errors and warnings.
 *
 * Errors = publishable=false for learner-facing content.
 * Warnings = require human review before publication.
 */
export function validateEcgStripMorphology(
  config: EcgStripMediaConfig,
): EcgMorphologyValidationResult {
  const violations: EcgMorphologyViolation[] = [];

  // Run mode-consistency check for all rhythms
  violations.push(...validateEducationalModeConsistency(config));

  // Run rhythm-specific validators
  const validators = RHYTHM_VALIDATORS[config.rhythmKey] ?? [];
  for (const validator of validators) {
    violations.push(...validator(config));
  }

  // Template-level cross-check: rate must be within template's expected range
  const template = getEcgRhythmTemplate(config.rhythmKey);
  if (
    template &&
    template.expectedRateRange[0] > 0 &&
    config.rate > 0 &&
    (config.rate < template.expectedRateRange[0] || config.rate > template.expectedRateRange[1])
  ) {
    violations.push({
      rule: "rate_outside_template_range",
      severity: "warning",
      message: `Strip rate ${config.rate} BPM is outside expected range ` +
        `${template.expectedRateRange[0]}–${template.expectedRateRange[1]} BPM for ${template.rhythmName}.`,
      clinicalRationale:
        "A rate far outside the typical range may cause learners to misidentify the rhythm. " +
        "Edge-case rates are valid but should be explicitly acknowledged in the question rationale.",
    });
  }

  const errors = violations.filter((v) => v.severity === "error");
  const warnings = violations.filter((v) => v.severity === "warning");

  return {
    ok: errors.length === 0,
    rhythmKey: config.rhythmKey,
    educationalMode: config.educationalMode,
    violations,
    errors,
    warnings,
  };
}

/**
 * Hard-fail gate for learner-facing published strips.
 *
 * Returns true only when ALL of:
 *   - No morphology errors
 *   - Educational mode is not "emergency_scenario" (unless strip type is non-single_rhythm)
 *   - If educationalMode is "artifact_training", strip type must acknowledge artifact
 *
 * This is the single function called by the CI publication gate.
 */
export function isPublishableMorphology(config: EcgStripMediaConfig): boolean {
  const result = validateEcgStripMorphology(config);
  return result.ok; // errors.length === 0
}

/**
 * Returns a human-readable morphology audit summary for admin dashboards.
 */
export function getMorphologyAuditSummary(config: EcgStripMediaConfig): string {
  const result = validateEcgStripMorphology(config);
  if (result.ok && result.warnings.length === 0) {
    return `✓ ${config.rhythmKey} — morphology valid (${config.educationalMode ?? "default"} mode)`;
  }
  const parts: string[] = [];
  if (result.errors.length > 0) {
    parts.push(`${result.errors.length} error(s): ${result.errors.map((e) => e.rule).join(", ")}`);
  }
  if (result.warnings.length > 0) {
    parts.push(`${result.warnings.length} warning(s): ${result.warnings.map((w) => w.rule).join(", ")}`);
  }
  return `✗ ${config.rhythmKey} — ${parts.join("; ")}`;
}

/** All rhythm keys that have registered morphology validators. */
export const ECG_MORPHOLOGY_VALIDATED_RHYTHMS: ReadonlyArray<string> =
  Object.keys(RHYTHM_VALIDATORS);
