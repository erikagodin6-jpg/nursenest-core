export type ClinicalJudgmentScoringDomainKey =
  | "recognition"
  | "interpretation"
  | "prioritization"
  | "decision_making"
  | "escalation"
  | "safety"
  | "evaluation";

export type ClinicalJudgmentScoringDomain = {
  readonly key: ClinicalJudgmentScoringDomainKey;
  readonly label: string;
  readonly description: string;
  readonly reportCardSignal: string;
};

export type ClinicalJudgmentScoreInput = Partial<Record<ClinicalJudgmentScoringDomainKey, number>>;

export const CLINICAL_JUDGMENT_SCORING_DOMAINS: readonly ClinicalJudgmentScoringDomain[] = [
  {
    key: "recognition",
    label: "Recognition",
    description: "Identifies relevant cues, abnormal findings, and pattern shifts.",
    reportCardSignal: "Cue recognition accuracy",
  },
  {
    key: "interpretation",
    label: "Interpretation",
    description: "Connects cues to pathophysiology, mechanisms, and likely hypotheses.",
    reportCardSignal: "Clinical interpretation strength",
  },
  {
    key: "prioritization",
    label: "Prioritization",
    description: "Ranks urgency using ABCs, risk, safety, stability, and acuity.",
    reportCardSignal: "Priority decision accuracy",
  },
  {
    key: "decision_making",
    label: "Decision-Making",
    description: "Chooses the safest next action and explains why similar options are not best.",
    reportCardSignal: "Decision quality",
  },
  {
    key: "escalation",
    label: "Escalation",
    description: "Recognizes when to notify, call rapid response, request help, or move to a higher level of care.",
    reportCardSignal: "Escalation timing",
  },
  {
    key: "safety",
    label: "Safety",
    description: "Avoids medication, delegation, infection, fall, bleeding, procedural, and communication harm.",
    reportCardSignal: "Patient safety performance",
  },
  {
    key: "evaluation",
    label: "Evaluation",
    description: "Reassesses outcomes and changes the plan when the patient does not respond.",
    reportCardSignal: "Reassessment and response tracking",
  },
] as const;

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function computeClinicalJudgmentScore(input: ClinicalJudgmentScoreInput): {
  readonly overall: number;
  readonly complete: boolean;
  readonly weakDomains: readonly ClinicalJudgmentScoringDomainKey[];
  readonly readyForExamLevelPractice: boolean;
} {
  const values = CLINICAL_JUDGMENT_SCORING_DOMAINS.map((domain) => clampScore(input[domain.key] ?? 0));
  const overall = clampScore(values.reduce((sum, value) => sum + value, 0) / values.length);
  const weakDomains = CLINICAL_JUDGMENT_SCORING_DOMAINS.filter((domain) => clampScore(input[domain.key] ?? 0) < 75).map(
    (domain) => domain.key,
  );
  return {
    overall,
    complete: CLINICAL_JUDGMENT_SCORING_DOMAINS.every((domain) => typeof input[domain.key] === "number"),
    weakDomains,
    readyForExamLevelPractice: overall >= 85 && weakDomains.length === 0,
  };
}

export function auditClinicalJudgmentScoring(): readonly string[] {
  const issues: string[] = [];
  const domains = new Set(CLINICAL_JUDGMENT_SCORING_DOMAINS.map((domain) => domain.key));
  for (const key of [
    "recognition",
    "interpretation",
    "prioritization",
    "decision_making",
    "escalation",
    "safety",
    "evaluation",
  ] as const) {
    if (!domains.has(key)) issues.push(`missing scoring domain: ${key}`);
  }
  return issues;
}
