export interface PrescribingSoapNote {
  subjective: string[];
  objective: string[];
  assessment: string[];
  plan: string[];
  safetyChecks: string[];
  followUp: string[];
}

export interface PrescribingSoapScenario {
  id: string;
  title: string;
  patientSummary: string;
  expectedDiagnosis: string;
  requiredPlanElements: string[];
  redFlags: string[];
  exemplarNote: PrescribingSoapNote;
}

export interface PrescribingSoapEvaluation {
  complete: boolean;
  missingPlanElements: string[];
  missedRedFlags: string[];
  feedback: string[];
}
