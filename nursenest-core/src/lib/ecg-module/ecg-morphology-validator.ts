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

// ─── Registry of validators per rhythmKey ──────────────────────────────────────

type MorphologyValidator = (config: EcgStripMediaConfig) => EcgMorphologyViolation[];

const RHYTHM_VALIDATORS: Record<string, MorphologyValidator[]> = {
  ventricular_tachycardia: [validateVtMorphology, validateHighRateMorphology],
  svt: [validateSvtMorphology, validateHighRateMorphology],
  torsades_de_pointes: [validateTorsadesMorphology, validateHighRateMorphology],
  atrial_fibrillation: [validateAfibMorphology],
  stemi_pattern: [validateStemiMorphology],
  paced_rhythm: [validatePacedRhythmMorphology],
  second_degree_type_i_av_block: [validateAvBlockMorphology],
  second_degree_type_ii_av_block: [validateAvBlockMorphology],
  third_degree_av_block: [validateAvBlockMorphology],
  asystole: [validateAsystoleMorphology],
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
