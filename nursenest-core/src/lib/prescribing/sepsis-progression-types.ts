export type SepsisProgressionStage =
  | "initial-infection"
  | "systemic-response"
  | "sepsis"
  | "septic-shock";

export interface SepsisVitalSigns {
  temperatureC: number;
  heartRate: number;
  respiratoryRate: number;
  systolicBp: number;
  oxygenSaturation: number;
  mentalStatus: "alert" | "confused" | "obtunded";
}

export interface SepsisProgressionStep {
  id: string;
  stage: SepsisProgressionStage;
  timeLabel: string;
  clinicalStatus: string;
  vitalSigns: SepsisVitalSigns;
  prescribingDecision: string;
  escalationDecision: string;
  teachingPoint: string;
}

export interface SepsisProgressionCase {
  id: string;
  title: string;
  sourceSyndrome: string;
  patientSummary: string;
  steps: SepsisProgressionStep[];
}
