export interface InstructorLearnerSnapshot {
  learnerId: string;
  learnerName: string;
  competencyScore: number;
  stewardshipScore: number;
  safetyMisses: number;
  highestRiskDomain: string;
  remediationStatus:
    | "on-track"
    | "monitor"
    | "high-risk";
}

export interface InstructorCohortReport {
  cohortId: string;
  generatedAtIso: string;
  averageCompetencyScore: number;
  averageStewardshipScore: number;
  highestRiskDomains: string[];
  learners: InstructorLearnerSnapshot[];
}
