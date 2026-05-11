/**
 * Clinical / nursing SERP title frameworks — intent-aligned patterns for CTR + specificity.
 * Use builders when authoring metadata; do not auto-slug mass pages without editorial review.
 */

/** Rough Google Title pixel budgets vary by character width; use chars as proxy for audits. */
export const SERP_TITLE_CHAR_SOFT_CAP_DESKTOP = 60;
export const SERP_TITLE_CHAR_SOFT_CAP_MOBILE = 55;

export type ExamPrepBrand = "NCLEX-RN" | "NCLEX-PN" | "REx-PN" | "NP" | "Clinical";

export type ClinicalSerpIntentBucket =
  | "mechanism"
  | "interpretation"
  | "comparison"
  | "exam_prep"
  | "clinical_application"
  | "tool_calculator"
  | "unknown";

const INTENT_HINTS: ReadonlyArray<{ bucket: ClinicalSerpIntentBucket; re: RegExp }> = [
  { bucket: "mechanism", re: /\b(why|how)\s+.+\s+causes?\b/i },
  { bucket: "mechanism", re: /\b(pathophysiology|mechanism)\b/i },
  { bucket: "interpretation", re: /\binterpretation\b|\bexplained for nurses\b|\bhow to interpret\b/i },
  { bucket: "comparison", re: /\bvs\.?\b|\bversus\b|\bdifference between\b|\bcompared (?:with|to)\b/i },
  { bucket: "exam_prep", re: /\b(nclex|rex-pn|exam prep|review|study guide)\b/i },
  { bucket: "clinical_application", re: /\b(nursing assessment|nursing implications|clinical interpretation)\b/i },
  { bucket: "tool_calculator", re: /\b(calculator|formula|dosage|drip rate|med math)\b/i },
];

export function inferSerpIntentFromTitle(title: string): ClinicalSerpIntentBucket {
  const t = title.trim();
  for (const { bucket, re } of INTENT_HINTS) {
    if (re.test(t)) return bucket;
  }
  return "unknown";
}

/** Strip redundant whitespace for consistent SERP construction. */
export function normalizeClinicalTitle(title: string): string {
  return title.replace(/\s+/g, " ").trim();
}

export type MechanismTitleParts = {
  cause: string;
  effect: string;
  /** Optional exam or audience qualifier appended in parentheses */
  qualifier?: string;
};

/** Pattern: Why X Causes Y (Qualifier) */
export function buildMechanismWhyCausesTitle(parts: MechanismTitleParts): string {
  const q = parts.qualifier?.trim();
  const base = normalizeClinicalTitle(`Why ${parts.cause} Causes ${parts.effect}`);
  return q ? `${base} (${q})` : base;
}

/** Pattern: How X Leads to Y */
export function buildMechanismHowLeadsTitle(cause: string, outcome: string, qualifier?: string): string {
  const base = normalizeClinicalTitle(`How ${cause} Leads to ${outcome}`);
  const q = qualifier?.trim();
  return q ? `${base} (${q})` : base;
}

export type InterpretationTitleParts = {
  topic: string;
  audience?: "Nurses" | "Nursing Students";
};

/** Pattern: X Explained for Nurses | Interpretation Guide */
export function buildInterpretationGuideTitle(parts: InterpretationTitleParts): string {
  const audience = parts.audience ?? "Nurses";
  return normalizeClinicalTitle(`${parts.topic} Explained for ${audience} | Interpretation Guide`);
}

export type ComparisonTitleParts = {
  a: string;
  b: string;
  context?: string;
};

export function buildVersusTitle(parts: ComparisonTitleParts): string {
  const ctx = parts.context?.trim();
  const core = normalizeClinicalTitle(`${parts.a} vs ${parts.b}`);
  return ctx ? `${core}: ${ctx}` : core;
}

export type ExamPrepTitleParts = {
  topic: string;
  exam: ExamPrepBrand;
  variant?: "Review" | "Study Guide" | "Practice Focus";
};

export function buildExamPrepTitle(parts: ExamPrepTitleParts): string {
  const variant = parts.variant ?? "Review";
  return normalizeClinicalTitle(`${parts.topic}: ${parts.exam} ${variant}`);
}

export type ClinicalApplicationTitleParts = {
  topic: string;
  frame: "Nursing Assessment" | "Nursing Implications" | "Clinical Interpretation";
};

export function buildClinicalApplicationTitle(parts: ClinicalApplicationTitleParts): string {
  return normalizeClinicalTitle(`${parts.frame} of ${parts.topic}`);
}

/** Heuristic: titles that look like bare topic labels (high CTR risk). */
export function looksLikeBareTopicTitle(title: string): boolean {
  const t = normalizeClinicalTitle(title);
  if (t.length <= 2) return true;
  const words = t.split(/\s+/).filter(Boolean);
  if (words.length === 1 && t.length < 28) return true;
  if (words.length <= 2 && t.length < 18 && !/\b(nclex|nursing|interpretation|explained|review)\b/i.test(t)) {
    return true;
  }
  return false;
}

export function titleTruncationRiskMobile(title: string): "low" | "medium" | "high" {
  const len = normalizeClinicalTitle(title).length;
  if (len <= SERP_TITLE_CHAR_SOFT_CAP_MOBILE) return "low";
  if (len <= SERP_TITLE_CHAR_SOFT_CAP_DESKTOP + 10) return "medium";
  return "high";
}
