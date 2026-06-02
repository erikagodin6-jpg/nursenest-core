/**
 * Clinical risk-language scanner for question-bank governance.
 *
 * This does not prove a question is wrong. It flags content that needs clinician review because
 * outdated guidance, unsafe medication wording, dosing claims, or special-population issues are
 * easy to miss in generated/imported question banks.
 */

export type ClinicalRiskSignalCode =
  | "UNQUALIFIED_DOSING_CLAIM"
  | "ABSOLUTE_CLINICAL_LANGUAGE"
  | "ACS_OXYGEN_OUTDATED_PATTERN"
  | "SEPSIS_BUNDLE_OUTDATED_PATTERN"
  | "INSULIN_WITHOUT_SAFETY_CHECK"
  | "ANTIBIOTIC_WITHOUT_ALLERGY_OR_RENAL_CONTEXT"
  | "PREGNANCY_MEDICATION_RISK"
  | "PEDIATRIC_DOSE_RISK"
  | "ANTICOAGULATION_BLEEDING_RISK"
  | "OPIOID_RESPIRATORY_RISK"
  | "POTASSIUM_ADMINISTRATION_RISK"
  | "LASIX_DIGOXIN_ELECTROLYTE_RISK";

export type ClinicalRiskSignal = {
  code: ClinicalRiskSignalCode;
  severity: "review" | "high";
  message: string;
  matchedText?: string;
  reviewPrompt: string;
};

export type ClinicalRiskLanguageInput = {
  stem?: string | null;
  rationale?: string | null;
  clinicalReasoning?: string | null;
  examStrategy?: string | null;
  options?: unknown;
  topic?: string | null;
  bodySystem?: string | null;
};

function stringifyOptions(options: unknown): string {
  if (!options) return "";
  if (Array.isArray(options)) return options.map((option) => JSON.stringify(option)).join(" ");
  if (typeof options === "string") return options;
  return JSON.stringify(options);
}

function content(input: ClinicalRiskLanguageInput): string {
  return [
    input.stem,
    stringifyOptions(input.options),
    input.rationale,
    input.clinicalReasoning,
    input.examStrategy,
    input.topic,
    input.bodySystem,
  ]
    .filter(Boolean)
    .join("\n")
    .replace(/\s+/g, " ");
}

function firstMatch(text: string, pattern: RegExp): string | undefined {
  return text.match(pattern)?.[0];
}

function addIfMatch(
  signals: ClinicalRiskSignal[],
  text: string,
  pattern: RegExp,
  signal: Omit<ClinicalRiskSignal, "matchedText">,
): void {
  const matchedText = firstMatch(text, pattern);
  if (!matchedText) return;
  signals.push({ ...signal, matchedText });
}

export function scanClinicalRiskLanguage(input: ClinicalRiskLanguageInput): ClinicalRiskSignal[] {
  const text = content(input);
  const signals: ClinicalRiskSignal[] = [];

  addIfMatch(signals, text, /\b\d+(\.\d+)?\s?(mg|mcg|g|units?|u|mEq|mmol|mL|L)\b/i, {
    code: "UNQUALIFIED_DOSING_CLAIM",
    severity: "review",
    message: "Content contains a specific dose or unit claim.",
    reviewPrompt: "Verify dose, route, frequency, renal/hepatic adjustment, pediatric/weight-based applicability, and local guideline alignment.",
  });

  addIfMatch(signals, text, /\b(always|never|guarantee|guaranteed|only appropriate|only intervention|cure)\b/i, {
    code: "ABSOLUTE_CLINICAL_LANGUAGE",
    severity: "review",
    message: "Content uses absolute clinical language that can be unsafe unless intentionally tested.",
    reviewPrompt: "Confirm the absolute is clinically true in all relevant contexts or rewrite with conditional clinical reasoning.",
  });

  addIfMatch(signals, text, /\b(chest pain|ACS|acute coronary|myocardial infarction|MI)\b.*\b(always|routine|automatically|all clients?)\b.*\boxygen\b|\boxygen\b.*\b(always|routine|automatically|all clients?)\b.*\b(chest pain|ACS|acute coronary|myocardial infarction|MI)\b/i, {
    code: "ACS_OXYGEN_OUTDATED_PATTERN",
    severity: "high",
    message: "Possible outdated ACS/chest-pain oxygen guidance.",
    reviewPrompt: "Verify that oxygen is targeted to hypoxemia/respiratory distress rather than routine use for every chest-pain client.",
  });

  addIfMatch(signals, text, /\bsepsis\b.*\b30\s?mL\/kg|\b30\s?mL\/kg\b.*\bsepsis\b/i, {
    code: "SEPSIS_BUNDLE_OUTDATED_PATTERN",
    severity: "review",
    message: "Sepsis fluid-bolus language needs current-guideline and patient-specific review.",
    reviewPrompt: "Check whether the item accounts for hypotension/lactate, heart failure/renal failure risk, reassessment, and current local bundle expectations.",
  });

  if (/\binsulin\b/i.test(text) && !/\b(glucose|blood sugar|hypoglyc|potassium|K\+|meal|eating|NPO)\b/i.test(text)) {
    signals.push({
      code: "INSULIN_WITHOUT_SAFETY_CHECK",
      severity: "high",
      message: "Insulin content appears without key safety-check language.",
      reviewPrompt: "Confirm glucose, hypoglycemia risk, meal/NPO status, potassium context when relevant, and order clarity.",
    });
  }

  if (/\b(antibiotic|ceftriaxone|cefazolin|cephalexin|piperacillin|tazobactam|vancomycin|gentamicin|tobramycin|ciprofloxacin|levofloxacin|amoxicillin|azithromycin|doxycycline|clindamycin|metronidazole|nitrofurantoin|trimethoprim|sulfamethoxazole)\b/i.test(text)
    && !/\b(allerg|renal|kidney|creatinine|culture|sensitivity|pregnan|QT|C\. diff|diarrhea)\b/i.test(text)) {
    signals.push({
      code: "ANTIBIOTIC_WITHOUT_ALLERGY_OR_RENAL_CONTEXT",
      severity: "review",
      message: "Antibiotic content lacks common safety context.",
      reviewPrompt: "Review allergy, renal dosing, cultures/sensitivity, pregnancy/lactation, QT/C. difficile risk, and local resistance assumptions.",
    });
  }

  if (/\b(pregnan|trimester|fetus|fetal|lactat|breastfeed)\b/i.test(text)
    && /\b(warfarin|ACE inhibitor|ARB|isotretinoin|valproate|tetracycline|doxycycline|fluoroquinolone|ciprofloxacin|levofloxacin|methotrexate|misoprostol|lithium)\b/i.test(text)) {
    signals.push({
      code: "PREGNANCY_MEDICATION_RISK",
      severity: "high",
      message: "Pregnancy/lactation medication-risk content needs clinician review.",
      reviewPrompt: "Verify pregnancy/lactation contraindications, trimester nuance, and safer alternatives.",
    });
  }

  if (/\b(pediatric|paediatric|infant|child|toddler|neonate|newborn|kg)\b/i.test(text)
    && /\b\d+(\.\d+)?\s?(mg|mcg|units?|mEq|mL)\b/i.test(text)) {
    signals.push({
      code: "PEDIATRIC_DOSE_RISK",
      severity: "high",
      message: "Pediatric/weight-based dosing content requires review.",
      reviewPrompt: "Verify weight-based math, max dose, route, concentration, and age-specific contraindications.",
    });
  }

  if (/\b(warfarin|heparin|enoxaparin|apixaban|rivaroxaban|dabigatran|anticoag)\b/i.test(text)
    && !/\b(bleed|INR|PTT|platelet|reversal|fall|renal|creatinine|antidote|vitamin K|protamine)\b/i.test(text)) {
    signals.push({
      code: "ANTICOAGULATION_BLEEDING_RISK",
      severity: "review",
      message: "Anticoagulation content lacks bleeding/monitoring context.",
      reviewPrompt: "Confirm monitoring, reversal, bleeding precautions, renal adjustment, fall risk, and contraindications.",
    });
  }

  if (/\b(opioid|morphine|hydromorphone|fentanyl|oxycodone|codeine)\b/i.test(text)
    && !/\b(respiratory|sedation|naloxone|rate|oxygen saturation|SpO2|LOC|level of consciousness)\b/i.test(text)) {
    signals.push({
      code: "OPIOID_RESPIRATORY_RISK",
      severity: "review",
      message: "Opioid content lacks respiratory/sedation safety context.",
      reviewPrompt: "Review respiratory rate, sedation, naloxone, opioid tolerance, and monitoring language.",
    });
  }

  if (/\b(potassium chloride|KCl|IV potassium|potassium replacement)\b/i.test(text)
    && !/\b(pump|dilut|rate|cardiac monitor|telemetry|renal|urine output|central line|peripheral)\b/i.test(text)) {
    signals.push({
      code: "POTASSIUM_ADMINISTRATION_RISK",
      severity: "high",
      message: "Potassium administration content lacks high-risk administration safeguards.",
      reviewPrompt: "Verify infusion rate, dilution, pump use, route, telemetry need, renal status, and urine output.",
    });
  }

  if (/\b(furosemide|Lasix|digoxin)\b/i.test(text)
    && !/\b(potassium|K\+|electrolyte|renal|creatinine|apical pulse|digoxin level|toxicity)\b/i.test(text)) {
    signals.push({
      code: "LASIX_DIGOXIN_ELECTROLYTE_RISK",
      severity: "review",
      message: "Furosemide/digoxin content lacks expected electrolyte or monitoring context.",
      reviewPrompt: "Review potassium/renal monitoring, digoxin toxicity, pulse checks, and interaction logic.",
    });
  }

  return signals;
}
