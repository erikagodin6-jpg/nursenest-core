import { getEcgRhythmTemplate } from "@/lib/ecg-module/ecg-rhythm-templates";
import type { EcgStripMediaConfig } from "@/lib/ecg-module/ecg-waveform-generator";

export type EcgStripClinicalValidationResult = {
  ok: boolean;
  rhythmKey: string | null;
  warnings: string[];
  failures: string[];
  needsManualReview: boolean;
};

function hasCorrectAnswerMatch(config: EcgStripMediaConfig, correctAnswer: string | null | undefined): boolean {
  const answer = String(correctAnswer ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  return !answer || answer === config.rhythmKey || answer.includes(config.rhythmKey) || config.rhythmKey.includes(answer);
}

export function isEcgStripMediaConfig(raw: unknown): raw is EcgStripMediaConfig {
  return Boolean(raw && typeof raw === "object" && !Array.isArray(raw) && typeof (raw as { rhythmKey?: unknown }).rhythmKey === "string");
}

export const isEcgLiveStripMediaConfig = isEcgStripMediaConfig;

export function validateEcgStripClinicalConfig(
  rawConfig: unknown,
  args: { correctAnswer?: string | null; highRiskManualReviewed?: boolean | null } = {},
): EcgStripClinicalValidationResult {
  if (!isEcgStripMediaConfig(rawConfig)) {
    return {
      ok: false,
      rhythmKey: null,
      warnings: [],
      failures: ["ECG strip question requires deterministic mediaConfig with rhythmKey."],
      needsManualReview: false,
    };
  }

  const config = rawConfig;
  const template = getEcgRhythmTemplate(config.rhythmKey);
  const failures: string[] = [];
  const warnings: string[] = [];
  if (!template) failures.push(`Unknown ECG rhythm template: ${config.rhythmKey}.`);

  if (template) {
    if (config.rate < template.expectedRateRange[0] || config.rate > template.expectedRateRange[1]) {
      if (!(template.expectedRateRange[0] === 0 && template.expectedRateRange[1] === 0 && config.rate === 0)) {
        failures.push(`${template.rhythmName} rate must be within ${template.expectedRateRange[0]}-${template.expectedRateRange[1]}.`);
      }
    }
    if (config.regularity !== template.rhythmRegularity) {
      failures.push(`${template.rhythmName} regularity must be ${template.rhythmRegularity}.`);
    }
    if (config.qrsWidth < template.qrsWidthRange[0] || config.qrsWidth > template.qrsWidthRange[1]) {
      failures.push(`${template.rhythmName} QRS width must be within ${template.qrsWidthRange[0]}-${template.qrsWidthRange[1]} seconds.`);
    }
  }

  if (config.rhythmKey === "atrial_fibrillation" && config.regularity === "regular") failures.push("Atrial fibrillation cannot be regular.");
  if (config.rhythmKey === "ventricular_fibrillation" && config.features?.hasOrganizedQrs) failures.push("Ventricular fibrillation cannot have organized QRS complexes.");
  if (config.rhythmKey === "asystole" && config.features?.hasRecurringQrs) failures.push("Asystole cannot have recurring QRS complexes.");
  if (config.rhythmKey === "first_degree_av_block" && config.prIntervalPattern !== "prolonged") failures.push("First-degree AV block requires prolonged PR interval.");
  if (config.rhythmKey === "second_degree_type_i_av_block" && !config.features?.progressivePr) failures.push("Mobitz I requires progressive PR prolongation.");
  if (config.rhythmKey === "second_degree_type_ii_av_block" && config.features?.progressivePr) failures.push("Mobitz II must not have progressive PR prolongation.");
  if (config.rhythmKey === "third_degree_av_block" && !config.features?.avDissociation) failures.push("Third-degree AV block requires AV dissociation.");
  if (config.rhythmKey === "ventricular_tachycardia" && config.qrsWidth < 0.12) failures.push("Ventricular tachycardia requires wide QRS complexes.");
  if (config.rhythmKey === "torsades_de_pointes" && !config.features?.polymorphicTwisting) failures.push("Torsades requires polymorphic twisting amplitude.");
  if (config.rhythmKey === "hyperkalemia_pattern" && (!config.features?.peakedT || !config.features?.widenedQrs)) failures.push("Hyperkalemia pattern requires peaked T-wave and widening features when configured.");
  if (!hasCorrectAnswerMatch(config, args.correctAnswer)) failures.push("ECG strip features contradict the correct answer.");

  const needsManualReview = Boolean(template?.highRisk && !args.highRiskManualReviewed && !config.manualReviewed);
  if (needsManualReview) warnings.push("High-risk ECG rhythm requires manual staff review before publishing.");

  return {
    ok: failures.length === 0 && !needsManualReview,
    rhythmKey: config.rhythmKey,
    warnings,
    failures,
    needsManualReview,
  };
}
