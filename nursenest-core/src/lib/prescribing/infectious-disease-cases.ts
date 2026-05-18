import type { PrescribingCase } from "./prescribing-case-types";

export const INFECTIOUS_DISEASE_CASES: PrescribingCase[] = [
  {
    id: "cellulitis-outpatient-mrsa",
    title: "Purulent Cellulitis With MRSA Risk",
    syndrome: "Cellulitis",
    acuity: "urgent",
    patientSummary:
      "A 42-year-old with purulent lower-extremity cellulitis after failing a recent outpatient beta-lactam course.",
    clinicalPearls: [
      "Purulence increases suspicion for MRSA.",
      "Escalation should remain targeted rather than indiscriminately broad."
    ],
    nclexTrap:
      "Choosing broad pseudomonas coverage without clinical risk factors.",
    steps: [
      {
        id: "likely-organism",
        title: "Identify likely organism",
        type: "organism-likelihood",
        prompt:
          "Which organism pattern is most clinically likely in purulent cellulitis?",
        options: [
          {
            id: "mrsa",
            label: "MRSA",
            correct: true,
            rationale:
              "Purulence and prior beta-lactam failure increase suspicion for MRSA.",
            stewardshipImpact: 15
          },
          {
            id: "pseudomonas",
            label: "Pseudomonas aeruginosa",
            correct: false,
            rationale:
              "Pseudomonas coverage is not routinely required for uncomplicated purulent cellulitis.",
            stewardshipImpact: -15
          }
        ]
      },
      {
        id: "empiric-therapy",
        title: "Choose empiric therapy",
        type: "empiric-therapy",
        prompt: "Which outpatient therapy is most appropriate?",
        options: [
          {
            id: "tmp-smx",
            label: "TMP-SMX",
            correct: true,
            rationale:
              "TMP-SMX provides MRSA coverage without unnecessary broad-spectrum escalation.",
            stewardshipImpact: 20
          },
          {
            id: "meropenem",
            label: "Meropenem",
            correct: false,
            rationale:
              "Carbapenem escalation is inappropriate without severe resistant gram negative concern.",
            stewardshipImpact: -25
          }
        ]
      }
    ]
  }
];
