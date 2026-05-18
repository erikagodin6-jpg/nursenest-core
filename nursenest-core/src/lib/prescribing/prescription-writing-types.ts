export type PrescriptionRoute = "PO" | "IV" | "IM" | "topical" | "inhaled";

export interface PrescriptionOrder {
  medication: string;
  dose: string;
  route: PrescriptionRoute;
  frequency: string;
  duration: string;
  indication: string;
  quantity?: string;
  refills?: number;
  patientInstructions: string[];
  monitoring: string[];
}

export interface PrescriptionWritingScenario {
  id: string;
  title: string;
  patientSummary: string;
  diagnosis: string;
  requiredSafetyChecks: string[];
  acceptableOrders: PrescriptionOrder[];
  unsafeOrders: string[];
  teachingPoints: string[];
}

export interface PrescriptionOrderEvaluation {
  safe: boolean;
  matchedOrder?: PrescriptionOrder;
  missingSafetyChecks: string[];
  warnings: string[];
  teachingPoints: string[];
}
