export interface VitalSigns {
  hr: number;
  bp: string;
  rr: number;
  spo2: number;
  temp: number;
  pain?: number;
}

export interface LabResult {
  name: string;
  value: string;
  unit: string;
  flag?: "high" | "low" | "critical";
}

export interface CaseDecision {
  id: string;
  text: string;
  isOptimal: boolean;
  consequence: string;
  mechanismExplanation: string;
  vitalChanges?: Partial<VitalSigns>;
  newLabs?: LabResult[];
  timeAdvance?: string;
}

export interface CaseStage {
  id: string;
  title: string;
  narrative: string;
  vitals: VitalSigns;
  labs?: LabResult[];
  assessmentFindings?: string[];
  nursingPriority?: string;
  decisions: CaseDecision[];
  criticalThinking?: string;
}

export interface ClinicalCase {
  id: string;
  title: string;
  patientProfile: string;
  chiefComplaint: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  bodySystem: string;
  stages: CaseStage[];
  debriefing: {
    keyLearning: string[];
    mechanismSummary: string;
    commonErrors: string[];
  };
}
