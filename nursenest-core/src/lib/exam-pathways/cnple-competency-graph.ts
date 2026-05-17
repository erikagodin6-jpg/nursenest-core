export type CnpleCompetencyNodeType =
  | "lesson"
  | "question-bank"
  | "flashcard"
  | "simulation"
  | "longitudinal-case"
  | "analytics-domain";

export type CnpleCompetencyGraphNode = {
  id: string;
  competency: string;
  type: CnpleCompetencyNodeType;
  title: string;
  linkedCompetencies: readonly string[];
  remediationTargets: readonly string[];
};

/**
 * Canonical NP competency graph.
 *
 * Purpose:
 * Connect lessons, question banks, flashcards, simulations,
 * longitudinal cases, and analytics into one adaptive NP learning system.
 *
 * This architecture supports:
 *  - adaptive remediation
 *  - competency heatmaps
 *  - longitudinal progression tracking
 *  - intelligent weak-area routing
 *  - simulation remediation mapping
 */
export const CNPLE_COMPETENCY_GRAPH: readonly CnpleCompetencyGraphNode[] = [
  {
    id: "dx-chest-pain",
    competency: "Chest Pain Diagnostic Reasoning",
    type: "lesson",
    title: "Approach to Chest Pain in Primary Care",
    linkedCompetencies: [
      "Acute Coronary Syndrome Recognition",
      "Pulmonary Embolism Assessment",
      "Diagnostic Prioritization",
    ],
    remediationTargets: [
      "Premature Diagnostic Closure",
      "Red-Flag Misses",
    ],
  },
  {
    id: "abx-stewardship-qbank",
    competency: "Antibiotic Stewardship",
    type: "question-bank",
    title: "Antibiotic Stewardship Clinical Question Set",
    linkedCompetencies: [
      "Prescribing Safety",
      "Follow-Up Monitoring",
      "Medication Contraindications",
    ],
    remediationTargets: [
      "Unsafe Prescribing Pattern",
    ],
  },
  {
    id: "diabetes-followup-case",
    competency: "Longitudinal Diabetes Management",
    type: "longitudinal-case",
    title: "Type 2 Diabetes Repeat-Visit Progression",
    linkedCompetencies: [
      "Medication Escalation",
      "Chronic Disease Monitoring",
      "Preventive Care",
    ],
    remediationTargets: [
      "Follow-Up Management Failure",
    ],
  },
  {
    id: "sepsis-sim-domain",
    competency: "Acute Sepsis Prioritization",
    type: "simulation",
    title: "Sepsis Escalation Simulation",
    linkedCompetencies: [
      "Clinical Prioritization",
      "Emergency Referral Thresholds",
      "Hemodynamic Recognition",
    ],
    remediationTargets: [
      "Critical Red-Flag Misses",
      "Escalation Delay",
    ],
  },
] as const;
