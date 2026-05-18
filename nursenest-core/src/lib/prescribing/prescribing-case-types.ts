export type PrescribingCaseAcuity = "routine" | "urgent" | "emergent";

export type PrescribingCaseDecisionType =
  | "organism-likelihood"
  | "empiric-therapy"
  | "safety-check"
  | "de-escalation"
  | "follow-up";

export interface PrescribingCaseDecisionOption {
  id: string;
  label: string;
  correct: boolean;
  rationale: string;
  stewardshipImpact: number;
}

export interface PrescribingCaseStep {
  id: string;
  title: string;
  type: PrescribingCaseDecisionType;
  prompt: string;
  options: PrescribingCaseDecisionOption[];
}

export interface PrescribingCase {
  id: string;
  title: string;
  syndrome: string;
  acuity: PrescribingCaseAcuity;
  patientSummary: string;
  clinicalPearls: string[];
  nclexTrap: string;
  steps: PrescribingCaseStep[];
}

export interface PrescribingCaseScore {
  totalSteps: number;
  correctSteps: number;
  stewardshipScore: number;
  missedSafetyIssues: string[];
  remediationTopics: string[];
}
