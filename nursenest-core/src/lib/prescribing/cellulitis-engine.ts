import type {
  CellulitisAssessmentInput,
  PrescribingRecommendation
} from "./types";

export function buildCellulitisRecommendation(
  input: CellulitisAssessmentInput
): PrescribingRecommendation {
  const severe = input.systemicSymptoms;

  if (severe) {
    return {
      acuity: "urgent",
      firstLine: ["IV cefazolin", "consider vancomycin if MRSA risk"],
      alternatives: ["linezolid", "daptomycin"],
      avoid: ["unnecessary outpatient oral therapy"],
      rationale: [
        "Systemic symptoms increase concern for severe infection.",
        "Escalate coverage only when MRSA risk factors are present."
      ],
      monitoring: [
        "hemodynamics",
        "renal function",
        "clinical progression"
      ],
      escalationTriggers: [
        "hypotension",
        "rapid progression",
        "necrotizing features"
      ],
      stewardshipScore: 68
    };
  }

  if (input.purulent || input.mrsaRisk) {
    return {
      acuity: "outpatient",
      firstLine: ["TMP-SMX", "doxycycline"],
      alternatives: ["clindamycin"],
      avoid: ["broad pseudomonas coverage"],
      rationale: [
        "Purulence increases suspicion for MRSA.",
        "Avoid unnecessarily broad-spectrum therapy."
      ],
      monitoring: ["48-72 hour reassessment", "clinical response"],
      escalationTriggers: ["fever", "spreading erythema", "abscess formation"],
      stewardshipScore: 88
    };
  }

  return {
    acuity: "outpatient",
    firstLine: ["cephalexin"],
    alternatives: ["amoxicillin-clavulanate"],
    avoid: ["vancomycin", "meropenem"],
    rationale: [
      "Most uncomplicated nonpurulent cellulitis is streptococcal.",
      "Narrow-spectrum therapy is preferred when clinically appropriate."
    ],
    monitoring: ["follow-up within 72 hours"],
    escalationTriggers: ["systemic symptoms", "treatment failure"],
    stewardshipScore: 96
  };
}
