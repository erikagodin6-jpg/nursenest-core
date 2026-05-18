export type PrescribingActivityType =
  | "coverage-drill"
  | "case-runner"
  | "culture-sensitivity"
  | "renal-dosing"
  | "prescription-writing"
  | "documentation"
  | "sepsis-progression";

export interface PrescribingAttemptRecord {
  id: string;
  learnerId: string;
  activityType: PrescribingActivityType;
  domain: string;
  score: number;
  stewardshipScore: number;
  safetyMisses: number;
  completedAtIso: string;
}

export interface PrescribingNextStepRecommendation {
  activityType: PrescribingActivityType;
  title: string;
  rationale: string;
  priority: "low" | "moderate" | "high";
  href: string;
}
