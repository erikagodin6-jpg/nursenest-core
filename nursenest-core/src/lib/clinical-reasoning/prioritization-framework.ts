export type PrioritizationStrategyKey =
  | "abcs"
  | "urgency"
  | "risk"
  | "safety"
  | "expected_vs_unexpected"
  | "acute_vs_chronic"
  | "stable_vs_unstable";

export type PrioritizationStrategy = {
  readonly key: PrioritizationStrategyKey;
  readonly title: string;
  readonly learnerUse: string;
  readonly commonTrap: string;
};

export type PrioritizationSystemCoverage = {
  readonly system: string;
  readonly requiredActivities: readonly string[];
  readonly escalationExamples: readonly string[];
};

export const PRIORITIZATION_STRATEGIES: readonly PrioritizationStrategy[] = [
  {
    key: "abcs",
    title: "ABCs",
    learnerUse: "Rank airway, breathing, and circulation threats above routine comfort, teaching, or delayed review.",
    commonTrap: "Choosing education or documentation while oxygenation, perfusion, or airway protection is changing.",
  },
  {
    key: "urgency",
    title: "Urgency",
    learnerUse: "Choose the action that cannot safely wait.",
    commonTrap: "Treating all abnormal findings as equally urgent.",
  },
  {
    key: "risk",
    title: "Risk",
    learnerUse: "Prioritize cues that could cause rapid deterioration or irreversible harm.",
    commonTrap: "Ignoring a low-frequency but high-harm complication.",
  },
  {
    key: "safety",
    title: "Safety",
    learnerUse: "Protect the patient from medication, fall, infection, bleeding, or procedure-related harm.",
    commonTrap: "Completing a task before confirming the safety condition that makes the task appropriate.",
  },
  {
    key: "expected_vs_unexpected",
    title: "Expected vs Unexpected",
    learnerUse: "Escalate unexpected findings and evaluate whether expected findings are worsening beyond the normal course.",
    commonTrap: "Reassuring the patient because a sign is common, even when severity or timing is unsafe.",
  },
  {
    key: "acute_vs_chronic",
    title: "Acute vs Chronic",
    learnerUse: "Address acute changes before chronic baseline problems unless the chronic problem is now unstable.",
    commonTrap: "Choosing a familiar chronic diagnosis over the new unstable change.",
  },
  {
    key: "stable_vs_unstable",
    title: "Stable vs Unstable",
    learnerUse: "See the unstable or deteriorating patient first and keep assessment, teaching, and evaluation with licensed clinicians.",
    commonTrap: "Delegating a task that requires judgment about instability.",
  },
] as const;

export const PRIORITIZATION_SYSTEM_COVERAGE: readonly PrioritizationSystemCoverage[] = [
  {
    system: "Cardiology",
    requiredActivities: ["acute coronary syndrome triage", "heart failure deterioration", "dysrhythmia escalation"],
    escalationExamples: ["new chest pain with diaphoresis", "unstable tachyarrhythmia", "pulmonary edema"],
  },
  {
    system: "Respiratory",
    requiredActivities: ["oxygenation versus ventilation", "respiratory failure trend", "airway compromise"],
    escalationExamples: ["accessory muscle use", "falling level of consciousness", "persistent hypoxemia"],
  },
  {
    system: "Neurology",
    requiredActivities: ["stroke recognition", "seizure safety", "new confusion"],
    escalationExamples: ["new unilateral weakness", "declining Glasgow Coma Scale", "sudden severe headache"],
  },
  {
    system: "Endocrine",
    requiredActivities: ["DKA recognition", "hypoglycemia rescue", "thyroid crisis flags"],
    escalationExamples: ["Kussmaul respirations", "altered mental status with low glucose", "severe dehydration"],
  },
  {
    system: "Renal",
    requiredActivities: ["hyperkalemia ECG risk", "fluid overload", "AKI medication safety"],
    escalationExamples: ["peaked T waves", "oliguria with dyspnea", "rising creatinine with nephrotoxins"],
  },
  {
    system: "Mental Health",
    requiredActivities: ["suicide risk", "violence risk", "therapeutic communication priority"],
    escalationExamples: ["active plan with means", "command hallucinations", "withdrawal instability"],
  },
  {
    system: "Maternal/Newborn",
    requiredActivities: ["postpartum hemorrhage", "preeclampsia escalation", "fetal distress"],
    escalationExamples: ["boggy uterus with heavy bleeding", "severe-range blood pressure", "late decelerations"],
  },
  {
    system: "Pediatrics",
    requiredActivities: ["pediatric respiratory distress", "dehydration", "sepsis cues"],
    escalationExamples: ["retractions with fatigue", "poor perfusion", "nonblanching rash with fever"],
  },
] as const;

export function auditPrioritizationFramework(): readonly string[] {
  const issues: string[] = [];
  const strategies = new Set(PRIORITIZATION_STRATEGIES.map((strategy) => strategy.key));
  for (const key of [
    "abcs",
    "urgency",
    "risk",
    "safety",
    "expected_vs_unexpected",
    "acute_vs_chronic",
    "stable_vs_unstable",
  ] as const) {
    if (!strategies.has(key)) issues.push(`missing prioritization strategy: ${key}`);
  }
  for (const coverage of PRIORITIZATION_SYSTEM_COVERAGE) {
    if (coverage.requiredActivities.length < 3) issues.push(`${coverage.system} needs at least three prioritization activities`);
    if (coverage.escalationExamples.length < 3) issues.push(`${coverage.system} needs escalation examples`);
  }
  return issues;
}
