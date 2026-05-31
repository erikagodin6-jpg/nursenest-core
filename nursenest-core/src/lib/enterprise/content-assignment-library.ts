import { HIDDEN_ENTERPRISE_VISIBILITY } from "@/lib/enterprise/enterprise-visibility";
import type { EnterpriseAssignmentType } from "@/lib/enterprise/educator-assignment-engine";

export type ContentAssignmentBundle = Readonly<{
  id: string;
  name: string;
  description: string;
  assignmentTypes: readonly EnterpriseAssignmentType[];
  contentIds: readonly string[];
  visibility: typeof HIDDEN_ENTERPRISE_VISIBILITY;
}>;

export const CONTENT_ASSIGNMENT_BUNDLES: readonly ContentAssignmentBundle[] = [
  {
    id: "telemetry-readiness-bundle",
    name: "Telemetry Readiness Bundle",
    description: "ECG, escalation, telemetry interpretation, and simulation readiness.",
    assignmentTypes: ["lesson", "ecg_activity", "simulation", "practice_question"],
    contentIds: ["ecg-interpretation", "telemetry-shift", "vt-deterioration", "telemetry-practice"],
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
  {
    id: "medication-safety-bundle",
    name: "Medication Safety Bundle",
    description: "Medication safety lessons, dosage practice, clinical skills, and documentation.",
    assignmentTypes: ["lesson", "medication_math", "clinical_skill", "practice_question"],
    contentIds: ["medication-safety", "dosage-calculation", "medication-administration", "med-safety-practice"],
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
  {
    id: "new-graduate-bundle",
    name: "New Graduate Bundle",
    description: "Transition-to-practice readiness across prioritization, documentation, communication, and safety.",
    assignmentTypes: ["lesson", "simulation", "clinical_skill", "practice_question"],
    contentIds: ["shift-organization", "delegation", "documentation-exercise", "patient-deterioration"],
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
  {
    id: "critical-care-bundle",
    name: "Critical Care Bundle",
    description: "Shock, ECG, ABG, labs, and critical deterioration workflows.",
    assignmentTypes: ["lesson", "lab_activity", "ecg_activity", "simulation"],
    contentIds: ["shock", "abg-interpretation", "critical-labs", "critical-care-deterioration"],
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
  {
    id: "emergency-nursing-bundle",
    name: "Emergency Nursing Bundle",
    description: "Triage, trauma, emergency prioritization, and rapid escalation.",
    assignmentTypes: ["lesson", "simulation", "clinical_skill", "practice_question"],
    contentIds: ["triage", "trauma-assessment", "rapid-response", "emergency-prioritization"],
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
  {
    id: "ecg-readiness-bundle",
    name: "ECG Readiness Bundle",
    description: "Rhythm recognition, ECG reasoning, telemetry, and deterioration exercises.",
    assignmentTypes: ["lesson", "ecg_activity", "simulation", "flashcard"],
    contentIds: ["ecg-foundations", "ecg-detective", "telemetry-shift", "ecg-flashcards"],
    visibility: HIDDEN_ENTERPRISE_VISIBILITY,
  },
];
