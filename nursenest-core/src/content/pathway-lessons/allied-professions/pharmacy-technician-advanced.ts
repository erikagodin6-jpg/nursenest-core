function quiz(question: string, options: string[], correct: number, rationale: string) {
  return { question, options, correct, rationale };
}

export const pharmacyTechnicianAdvancedLessons = [
  {
    pathwayId: "us-allied-core",
    slug: "pharm-tech-controlled-substances-and-dea-schedules",
    title: "Controlled Substances and DEA Schedules",
    topic: "Controlled Substances",
    topicSlug: "controlled-substances",
    system: "pharmacy",
    bodySystem: "pharmacy",
    alliedProfessionKey: "pharmacy-tech",
    previewSectionCount: 2,
    seoTitle: "Controlled Substances and DEA Schedules for Pharmacy Technicians",
    seoDescription: "PTCE and ExCPT lesson on DEA schedules, narcotic inventory, refill limits, suspicious prescriptions, pseudoephedrine rules, and diversion prevention.",
    sections: [
      {
        id: "dea-overview",
        heading: "DEA Schedule Overview",
        kind: "core_concept",
        body: "Controlled substances are grouped into schedules based on abuse potential, accepted medical use, and dependence risk. Pharmacy technicians must recognize that inventory, storage, transfer, refill, and documentation requirements become stricter as medication risk increases."
      },
      {
        id: "inventory",
        heading: "Inventory and Documentation",
        kind: "clinical_meaning",
        body: "Controlled-substance workflow depends on accurate perpetual inventory, discrepancy reporting, secure storage, and chain-of-custody discipline. Small counting errors can indicate diversion or unsafe workflow.",
      },
      {
        id: "suspicious-rx",
        heading: "Suspicious Prescriptions",
        kind: "clinical_scenario",
        body: "Technicians should recognize red flags such as altered quantities, inconsistent prescriber information, refill-too-soon requests, suspicious behavior, or unusual prescribing patterns and escalate according to policy.",
      },
      {
        id: "exam-relevance",
        heading: "Exam Relevance",
        kind: "exam_relevance",
        body: "Controlled-substance questions often test role boundaries, documentation, inventory accuracy, and escalation logic rather than independent clinical judgment."
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: "Controlled-substance workflow is security plus documentation plus escalation discipline."
      }
    ],
    studyTakeaways: [
      "Controlled substances require strict inventory workflows.",
      "Discrepancies should be escalated immediately.",
      "Suspicious prescriptions are workflow red flags."
    ],
    studyCommonTraps: [
      "Ignoring inventory mismatches",
      "Assuming family or verbal requests override policy",
      "Treating narcotic counts casually"
    ],
    preTest: [
      quiz(
        "A controlled-substance inventory count does not match expected stock. What should the technician do?",
        [
          "Ignore the discrepancy if the pharmacy is busy",
          "Adjust the count to match expected inventory",
          "Follow policy and escalate immediately",
          "Continue dispensing before documenting"
        ],
        2,
        "Controlled-substance discrepancies require documentation and escalation according to policy.",
      )
    ],
    postTest: [
      quiz(
        "Which workflow principle is most important for controlled substances?",
        ["Decorative organization", "Inventory and documentation", "Skipping verification", "Verbal memory only"],
        1,
        "Controlled-substance workflows depend on inventory accuracy and documentation.",
      )
    ]
  },
  {
    pathwayId: "us-allied-core",
    slug: "pharm-tech-sig-codes-and-prescription-abbreviations",
    title: "SIG Codes and Prescription Abbreviations",
    topic: "SIG Codes",
    topicSlug: "sig-codes",
    system: "pharmacy",
    bodySystem: "pharmacy",
    alliedProfessionKey: "pharmacy-tech",
    previewSectionCount: 2,
    seoTitle: "SIG Codes and Prescription Abbreviations for Pharmacy Technicians",
    seoDescription: "Pharmacy technician lesson on SIG code interpretation, prescription abbreviations, unsafe abbreviations, labeling, and workflow clarification.",
    sections: [
      {
        id: "sig-overview",
        heading: "SIG Code Interpretation",
        kind: "core_concept",
        body: "SIG codes communicate route, timing, frequency, and administration instructions. Pharmacy technicians must accurately interpret abbreviations while recognizing when directions are unclear or unsafe."
      },
      {
        id: "unsafe-abbreviations",
        heading: "Unsafe Abbreviations",
        kind: "clinical_meaning",
        body: "Unsafe abbreviations such as U, IU, QD, QOD, trailing zeros, and naked decimals can create medication errors and should be clarified according to policy."
      },
      {
        id: "workflow-labeling",
        heading: "Workflow and Labeling",
        kind: "clinical_scenario",
        body: "Incorrect SIG interpretation can produce incorrect labels, wrong days supply, and dosing confusion. Technicians should verify unclear directions before processing."
      },
      {
        id: "exam-relevance",
        heading: "Exam Relevance",
        kind: "exam_relevance",
        body: "SIG-code questions commonly test frequency interpretation, route recognition, and unsafe abbreviation identification."
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: "Accurate SIG interpretation supports safe labeling, correct days supply, and safe medication administration instructions."
      }
    ],
    studyTakeaways: [
      "SIG interpretation affects labeling accuracy.",
      "Unsafe abbreviations should be clarified.",
      "Frequency affects days supply calculations."
    ],
    studyCommonTraps: [
      "Misreading BID/TID/QID",
      "Ignoring unsafe abbreviations",
      "Assuming unclear directions are acceptable"
    ],
    preTest: [
      quiz(
        "Which abbreviation is considered unsafe?",
        ["PO", "BID", "U", "PRN"],
        2,
        "U for units can be misread and should generally be avoided.",
      )
    ],
    postTest: [
      quiz(
        "BID means:",
        ["Once daily", "Twice daily", "Three times daily", "At bedtime"],
        1,
        "BID means twice daily.",
      )
    ]
  },
  {
    pathwayId: "us-allied-core",
    slug: "pharm-tech-high-alert-medications",
    title: "High-Alert Medications",
    topic: "Medication Safety",
    topicSlug: "high-alert-medications",
    system: "pharmacy",
    bodySystem: "pharmacy",
    alliedProfessionKey: "pharmacy-tech",
    previewSectionCount: 2,
    seoTitle: "High-Alert Medications for Pharmacy Technicians",
    seoDescription: "Pharmacy technician medication safety lesson covering insulin, anticoagulants, opioids, chemotherapy, concentrated electrolytes, and escalation logic.",
    sections: [
      {
        id: "high-alert-definition",
        heading: "High-Alert Medication Definition",
        kind: "core_concept",
        body: "High-alert medications carry elevated risk of severe harm when used incorrectly. Technicians must apply enhanced verification and escalation discipline."
      },
      {
        id: "examples",
        heading: "Major High-Alert Categories",
        kind: "clinical_meaning",
        body: "Common high-alert categories include insulin, anticoagulants, opioids, chemotherapy, concentrated electrolytes, and pediatric weight-based medications."
      },
      {
        id: "workflow",
        heading: "Verification Workflow",
        kind: "clinical_scenario",
        body: "High-alert workflow emphasizes barcode verification, concentration checks, route confirmation, storage verification, and clarification of unclear notation."
      },
      {
        id: "exam",
        heading: "Exam Relevance",
        kind: "exam_relevance",
        body: "Medication safety questions frequently ask which order should be clarified first or which workflow step best prevents harm."
      },
      {
        id: "summary",
        heading: "Takeaways",
        kind: "takeaways",
        body: "High-alert medication questions reward escalation, verification, and workflow discipline rather than guessing."
      }
    ],
    studyTakeaways: [
      "Insulin and anticoagulants are high-alert.",
      "Unclear high-alert orders require clarification.",
      "Verification reduces LASA and dosing errors."
    ],
    studyCommonTraps: [
      "Ignoring unclear insulin notation",
      "Assuming high-alert drugs are routine",
      "Skipping barcode verification"
    ],
    preTest: [
      quiz(
        "Which medication category is considered high-alert?",
        ["Artificial tears", "Insulins", "Saline nasal spray", "Multivitamins"],
        1,
        "Insulins are high-alert because dosing or product errors can cause severe harm.",
      )
    ],
    postTest: [
      quiz(
        "Which action best reduces high-alert medication error risk?",
        ["Skipping verification", "Guessing unclear abbreviations", "Barcode and product verification", "Ignoring concentration differences"],
        2,
        "Verification processes reduce high-alert medication errors.",
      )
    ]
  }
];

export default { lessons: pharmacyTechnicianAdvancedLessons };
