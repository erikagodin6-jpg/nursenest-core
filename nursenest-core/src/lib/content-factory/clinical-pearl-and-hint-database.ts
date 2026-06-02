export type ClinicalPearlCategory =
  | "medical-surgical"
  | "critical-care"
  | "emergency"
  | "mental-health"
  | "maternity"
  | "pediatrics"
  | "community-health"
  | "leadership"
  | "pharmacology"
  | "labs"
  | "ecg"
  | "np"
  | "allied-health";

export type HintType =
  | "assessment"
  | "prioritization"
  | "pharmacology"
  | "labs"
  | "ecg"
  | "clinical-judgment"
  | "diagnostics"
  | "professional-practice";

export type ReusableClinicalPearlTarget = {
  readonly category: ClinicalPearlCategory;
  readonly targetCount: number;
  readonly reusableAcrossAssets: true;
  readonly storedSeparately: true;
};

export type ReusableHintTarget = {
  readonly type: HintType;
  readonly targetCount: number;
  readonly guidesThinking: true;
  readonly revealsAnswer: false;
  readonly storedSeparately: true;
};

export const CLINICAL_PEARL_DATABASE_TARGETS: readonly ReusableClinicalPearlTarget[] = [
  "medical-surgical",
  "critical-care",
  "emergency",
  "mental-health",
  "maternity",
  "pediatrics",
  "community-health",
  "leadership",
  "pharmacology",
  "labs",
  "ecg",
  "np",
  "allied-health",
].map((category) => ({ category: category as ClinicalPearlCategory, targetCount: 4000, reusableAcrossAssets: true, storedSeparately: true }));

export const HINT_DATABASE_TARGETS: readonly ReusableHintTarget[] = [
  "assessment",
  "prioritization",
  "pharmacology",
  "labs",
  "ecg",
  "clinical-judgment",
  "diagnostics",
  "professional-practice",
].map((type) => ({ type: type as HintType, targetCount: 6250, guidesThinking: true, revealsAnswer: false, storedSeparately: true }));

export function summarizePearlHintTargets() {
  return {
    clinicalPearls: CLINICAL_PEARL_DATABASE_TARGETS.reduce((sum, item) => sum + item.targetCount, 0),
    hints: HINT_DATABASE_TARGETS.reduce((sum, item) => sum + item.targetCount, 0),
  };
}

export function validatePearlHintDatabases(): readonly string[] {
  const totals = summarizePearlHintTargets();
  const issues: string[] = [];
  if (totals.clinicalPearls < 50000) issues.push("Clinical Pearl database target must be at least 50,000");
  if (totals.hints < 50000) issues.push("Hint database target must be at least 50,000");
  for (const hint of HINT_DATABASE_TARGETS) {
    if (hint.revealsAnswer) issues.push(`${hint.type} hints must never reveal answers`);
  }
  return issues;
}
