import type {
  PrescriptionWritingScenario
} from "./prescription-writing-types";

export const PRESCRIPTION_WRITING_SCENARIOS: PrescriptionWritingScenario[] = [
  {
    id: "simple-cystitis",
    title: "Acute Uncomplicated Cystitis",
    patientSummary:
      "A 26-year-old with dysuria, urinary frequency, and no systemic symptoms.",
    diagnosis: "Acute uncomplicated cystitis",
    requiredSafetyChecks: [
      "pregnancy assessment",
      "allergy review",
      "renal function review"
    ],
    acceptableOrders: [
      {
        medication: "Nitrofurantoin",
        dose: "100 mg",
        route: "PO",
        frequency: "BID",
        duration: "5 days",
        indication: "Acute uncomplicated cystitis",
        quantity: "10 capsules",
        refills: 0,
        patientInstructions: [
          "Complete the full course.",
          "Seek reassessment if fever or flank pain develops."
        ],
        monitoring: ["symptom improvement", "culture review if obtained"]
      }
    ],
    unsafeOrders: [
      "meropenem",
      "unnecessary fluoroquinolone escalation"
    ],
    teachingPoints: [
      "Avoid unnecessarily broad-spectrum therapy.",
      "Assess pregnancy status before prescribing certain agents."
    ]
  }
];
