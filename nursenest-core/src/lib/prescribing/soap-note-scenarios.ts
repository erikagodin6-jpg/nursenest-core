import type {
  PrescribingSoapScenario
} from "./soap-note-types";

export const PRESCRIBING_SOAP_SCENARIOS: PrescribingSoapScenario[] = [
  {
    id: "cap-outpatient",
    title: "Community-Acquired Pneumonia",
    patientSummary:
      "A 63-year-old with fever, productive cough, tachycardia, and right lower lobe crackles.",
    expectedDiagnosis: "Community-acquired pneumonia",
    requiredPlanElements: [
      "empiric therapy",
      "follow-up",
      "return precautions",
      "oxygen assessment"
    ],
    redFlags: [
      "hypoxia",
      "hemodynamic instability",
      "confusion"
    ],
    exemplarNote: {
      subjective: [
        "productive cough",
        "fever",
        "pleuritic discomfort"
      ],
      objective: [
        "tachycardia",
        "crackles",
        "fever"
      ],
      assessment: [
        "Likely community-acquired pneumonia without shock."
      ],
      plan: [
        "Start empiric antibiotic therapy.",
        "Arrange reassessment within 48-72 hours.",
        "Review escalation triggers."
      ],
      safetyChecks: [
        "assess oxygenation",
        "evaluate admission criteria"
      ],
      followUp: [
        "return immediately if worsening dyspnea or hypoxia"
      ]
    }
  }
];
