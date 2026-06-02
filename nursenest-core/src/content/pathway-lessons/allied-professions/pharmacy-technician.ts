function quiz(question: string, options: string[], correct: number, rationale: string) {
  return { question, options, correct, rationale };
}

const pharmacySections = {
  workflow: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Pharmacy technician work is a safety-critical medication workflow, not a simple clerical sequence. The technician supports prescription intake, data entry, product selection, labeling, inventory handling, insurance or billing workflows, and final pharmacist verification. The exam tests whether the learner can recognize when a prescription, dose, product, patient factor, storage requirement, or workflow step needs clarification before the medication reaches the patient."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "A safe dispensing workflow starts with patient identifiers, prescription validity, medication name, strength, dosage form, route, directions, quantity, refills, prescriber information, allergy profile, duplication risk, and storage needs. Pharmacy technicians do not clinically approve therapy, but they must recognize red flags: unclear SIGs, mismatched strength and directions, dangerous abbreviations, refill-too-soon concerns, controlled-substance rules, look-alike/sound-alike product risk, and unusual doses that require pharmacist review."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A prescription reads: metformin 1000 mg, take 1 tablet twice daily, quantity 30, refill 5. The directions imply a 15-day supply, but many patients expect a 30-day supply. The technician should not simply change the quantity. The correct workflow is to flag the mismatch for pharmacist or prescriber clarification according to policy. The exam often rewards identifying the safest handoff point, not guessing what the prescriber intended."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "PTCE, ExCPT, and PEBC-style questions frequently use ordinary-looking prescriptions with one unsafe detail. Common traps include assuming a prescription is valid because the drug name is recognizable, ignoring days' supply math, overlooking contraindication flags in the profile, selecting a LASA product from memory, or failing to escalate unclear directions."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "The pharmacy technician mindset is accuracy plus escalation. Verify identifiers, read the whole prescription, check consistency, recognize workflow red flags, and route clinical judgment or ambiguity to the pharmacist."
    }
  ],
  calculations: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Pharmacy calculations protect patients from wrong dose, wrong volume, wrong concentration, wrong days' supply, and wrong compounding quantity. Exam math is not just arithmetic; it tests whether the learner can keep units aligned and decide whether an answer is plausible before it becomes a dispensing error."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Use dimensional analysis as the default method: start with the ordered amount, multiply by conversion factors that cancel unwanted units, and end with the requested unit. For liquids, connect strength to volume. If a suspension contains 250 mg per 5 mL, then 500 mg requires 10 mL. For days' supply, divide total quantity by daily use. For percent strength, remember that w/v percent means grams per 100 mL. Always estimate first so decimal placement errors are easier to catch."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A prescription is written for amoxicillin 400 mg/5 mL, give 10 mL twice daily for 10 days. The patient receives 800 mg per dose and 20 mL per day. Ten days requires 200 mL total. A 100 mL bottle would be insufficient. The technician should calculate quantity before labeling and route any mismatch to the pharmacist or workflow policy."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Calculation questions often hide the trap in units: mg vs mcg, mL vs tsp, once daily vs twice daily, concentration per 5 mL, or total quantity vs days' supply. Wrong answers are frequently off by a factor of 10, 100, or 1000. Estimate and unit-cancel before selecting an option."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Set up the units before calculating. If the units do not cancel cleanly, the setup is wrong. Then estimate to catch decimal errors before finalizing the answer."
    }
  ],
  topDrugs: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Top 200 drug study is not only brand-to-generic memorization. Pharmacy technicians must connect common medication names to class, indication, dosage form patterns, high-alert warnings, storage needs, and look-alike/sound-alike risks. This supports safer product selection and stronger exam recall."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Build drug memory in layers: generic name, common brand, class, therapeutic use, major safety concern, and practical pharmacy clue. For example, warfarin is an anticoagulant with bleeding risk and many interactions; insulin products require careful name, concentration, and storage checks; levothyroxine is thyroid replacement and timing consistency matters; metformin is an antidiabetic with GI effects and renal function considerations handled clinically by the pharmacist."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A technician sees hydroxyzine and hydralazine stored near each other. Both names begin similarly, but one is an antihistamine/anxiolytic and the other is an antihypertensive vasodilator. The technician should use barcode scanning, NDC verification, strength, dosage form, and workflow checks rather than relying on memory alone."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Drug-name questions test pattern recognition under pressure. Expect brand/generic matching, class identification, common indication, high-alert category, storage clue, and LASA safety traps. Grouping drugs by suffix and class improves recall more than memorizing a flat list."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Learn drug cards as safety cards: name, class, use, key warning, and pharmacy handling clue. Use suffixes and therapeutic classes to reduce memorization load."
    }
  ],
  medicationSafety: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Medication safety is the core judgment domain for pharmacy technicians. The technician is not making independent clinical decisions, but they are a key barrier against preventable harm. Safety performance depends on recognizing high-alert medications, unsafe abbreviations, decimal risks, LASA pairs, allergies, contraindication flags, incorrect storage, and unclear directions."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "High-alert medication classes include insulin, anticoagulants, opioids, concentrated electrolytes, chemotherapy or hazardous drugs, and some pediatric or weight-based medications. Common error patterns include trailing zeros, missing leading zeros, U for units, QD or QOD ambiguity, mg/mcg confusion, sound-alike drug names, wrong strength selection, and product substitution without correct authorization. The safe response is to stop, verify, and escalate according to policy."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A prescription states insulin glargine U-100, inject 10U nightly. The abbreviation U is unsafe because it can be misread as a zero or number. The technician should flag the prescription for clarification or policy-guided correction before dispensing. Insulin is high-alert, so small notation errors can lead to serious harm."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Exam questions often ask which prescription should be clarified first or which action prevents medication error. Prioritize high-alert drugs, pediatric dosing, decimal ambiguity, allergies, wrong route, controlled-substance issues, and LASA product selection."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Medication safety questions reward escalation, not guessing. High-alert drug plus unclear order equals stop and clarify."
    }
  ],
  law: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Pharmacy law and ethics define what can be dispensed, documented, transferred, refilled, stored, counted, or disclosed. Pharmacy technicians must know the boundaries of their role and recognize when legal or privacy requirements shape the workflow. Rules vary by jurisdiction, but the exam commonly tests controlled substances, confidentiality, documentation, prescription validity, and scope boundaries."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "US-focused study emphasizes DEA scheduling, prescription requirements, refill limits, controlled-substance inventory, pseudoephedrine rules, HIPAA, and record retention. Canada-focused study emphasizes federal/provincial controlled drug rules, privacy expectations, NAPRA-aligned standards, PEBC-style professionalism, and technician scope under pharmacist oversight. The safe exam habit is to identify the jurisdiction and choose the most conservative compliant action."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient asks the technician to confirm whether their spouse picked up a controlled medication. The technician must follow pharmacy privacy policy and applicable law, not casual family assumptions. Privacy and controlled-substance workflows should be routed through approved verification steps and pharmacist guidance when uncertain."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Law questions reward role boundaries and documentation. Do not invent permissions. If the item involves controlled substances, privacy, suspicious activity, missing information, or professional judgment, select the response that follows policy and escalates appropriately."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Know the technician role, protect privacy, document accurately, follow controlled-substance rules, and escalate legal ambiguity."
    }
  ],
  compounding: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Compounding questions test contamination prevention, measurement accuracy, labeling, stability, hazardous-drug safety, and documentation. Pharmacy technicians may support sterile or non-sterile compounding only within training, policy, and jurisdictional scope. The learner must understand why workflow discipline matters: one skipped cleaning step or measurement error can harm multiple patients."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Non-sterile compounding focuses on accurate formulas, weighing, trituration, levigation, mixing, beyond-use dating, packaging, labeling, and cleaning. Sterile compounding adds aseptic technique, airflow protection, garbing, hand hygiene, cleanroom behavior, line of first air, contamination control, and sterile product checks. Hazardous compounding adds PPE, containment, spill response, and exposure control."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A technician preparing a sterile product reaches across the critical site and blocks first air. Even if the product is otherwise correct, the aseptic field has been compromised. The appropriate response is to stop and follow facility policy for remediation rather than continuing because the dose calculation was correct."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Compounding exam questions often test the next safe action: hand hygiene before garbing, disinfecting entry points, maintaining first air, avoiding touch contamination, checking beyond-use date logic, and using hazardous-drug precautions. Sterile technique questions prioritize contamination control over speed."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Compounding is controlled process plus documentation. Accuracy, contamination prevention, stability, labeling, and scope boundaries drive safe answers."
    }
  ]
};

export const pharmacyTechnicianLessons = [
  {
    pathwayId: "us-allied-core",
    slug: "pharm-tech-workflow-and-prescription-interpretation",
    title: "Workflow and Prescription Interpretation",
    topic: "Pharmacy Technician",
    topicSlug: "pharmacy-tech",
    system: "pharmacy",
    bodySystem: "pharmacy",
    previewSectionCount: 2,
    seoTitle: "Pharmacy Technician Workflow and Prescription Interpretation",
    seoDescription: "Pharmacy technician lesson on prescription intake, SIGs, days supply, dispensing workflow, product checks, and clarification triggers.",
    alliedProfessionKey: "pharmacy-tech",
    sections: pharmacySections.workflow,
    studyTakeaways: ["Read the whole prescription before filling.", "Check days supply, quantity, strength, route, and patient identifiers.", "Escalate unclear or unsafe orders instead of guessing."],
    studyCommonTraps: ["Changing quantity without clarification", "Ignoring mismatched directions and days supply", "Selecting LASA products by memory alone"],
    preTest: [quiz("A prescription's directions imply a 15-day supply but the quantity appears intended for 30 days. What should the technician do?", ["Change the quantity independently", "Flag for clarification according to policy", "Ignore the mismatch", "Dispense the larger amount automatically"], 1, "A mismatch between directions and quantity should be clarified; technicians should not infer prescriber intent independently.")],
    postTest: [quiz("Which detail is a prescription workflow red flag?", ["Patient identifier present", "Clear dosage form", "Unclear SIG for a high-alert medication", "Valid prescriber information"], 2, "Unclear directions for high-alert medications require escalation before dispensing.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "pharm-tech-dosage-calculation-fundamentals",
    title: "Dosage Calculation Fundamentals",
    topic: "Pharmacy Calculations",
    topicSlug: "pharmacy-calculations",
    system: "pharmacy",
    bodySystem: "pharmacy",
    previewSectionCount: 2,
    seoTitle: "Pharmacy Technician Dosage Calculation Fundamentals",
    seoDescription: "PTCE and ExCPT-aligned pharmacy math lesson on unit cancellation, liquid dosing, days supply, percent strength, and decimal safety.",
    alliedProfessionKey: "pharmacy-tech",
    sections: pharmacySections.calculations,
    studyTakeaways: ["Use unit cancellation before arithmetic.", "Estimate to catch decimal errors.", "Liquid strength connects mg to mL."],
    studyCommonTraps: ["mg/mcg confusion", "Forgetting frequency in days supply", "Treating per-5-mL strengths as per-1-mL strengths"],
    preTest: [quiz("A liquid contains 250 mg per 5 mL. How many mL contain 500 mg?", ["2.5 mL", "5 mL", "10 mL", "25 mL"], 2, "500 mg is double 250 mg, so the volume is double 5 mL: 10 mL.")],
    postTest: [quiz("A patient takes 1 tablet twice daily. How many tablets are needed for 30 days?", ["15", "30", "60", "90"], 2, "Twice daily means 2 tablets per day. 2 x 30 = 60 tablets.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "pharm-tech-top-200-brand-generic-and-drug-classes",
    title: "Top 200 Drugs: Brand, Generic, and Classes",
    topic: "Top 200 Drugs",
    topicSlug: "top-200-drugs",
    system: "pharmacy",
    bodySystem: "pharmacy",
    previewSectionCount: 2,
    seoTitle: "Top 200 Drugs for Pharmacy Technicians",
    seoDescription: "Pharmacy technician lesson on Top 200 drug brand/generic matching, drug classes, suffix patterns, LASA risks, and safety memory cues.",
    alliedProfessionKey: "pharmacy-tech",
    sections: pharmacySections.topDrugs,
    studyTakeaways: ["Study drug names with class and safety clue.", "Use suffixes to reduce memorization load.", "LASA pairs require barcode and product verification."],
    studyCommonTraps: ["Flat memorization without class", "Confusing LASA pairs", "Ignoring storage and high-alert clues"],
    preTest: [quiz("Warfarin is best classified as:", ["Antibiotic", "Anticoagulant", "Antacid", "Antihistamine"], 1, "Warfarin is an anticoagulant and is high-alert because of bleeding risk and interactions.")],
    postTest: [quiz("Which pair is a look-alike/sound-alike risk?", ["Hydroxyzine and hydralazine", "Metformin and glucose", "Levothyroxine and thyroid", "Ibuprofen and pain"], 0, "Hydroxyzine and hydralazine can be confused by name and require careful product verification.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "pharm-tech-medication-safety-and-error-prevention",
    title: "Medication Safety and Error Prevention",
    topic: "Medication Safety",
    topicSlug: "medication-safety",
    system: "pharmacy",
    bodySystem: "pharmacy",
    previewSectionCount: 2,
    seoTitle: "Medication Safety for Pharmacy Technician Exams",
    seoDescription: "PTCE/ExCPT medication safety lesson on high-alert drugs, unsafe abbreviations, decimal errors, LASA medications, and escalation triggers.",
    alliedProfessionKey: "pharmacy-tech",
    sections: pharmacySections.medicationSafety,
    studyTakeaways: ["High-alert plus unclear order means clarify.", "Unsafe abbreviations are exam red flags.", "Decimal errors can become severe medication errors."],
    studyCommonTraps: ["Accepting U for units", "Missing leading zero errors", "Treating LASA products as memory questions only"],
    preTest: [quiz("Which order should be clarified because of an unsafe abbreviation?", ["Take one tablet by mouth daily", "Inject 10U nightly", "Apply to rash twice daily", "Take with food"], 1, "U for units is unsafe and can be misread; insulin is also high-alert.")],
    postTest: [quiz("Which medication group is generally high-alert?", ["Insulins", "Multivitamins", "Saline nasal spray", "Artificial tears"], 0, "Insulins are high-alert because dose or product errors can cause serious harm.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "pharm-tech-law-ethics-controlled-substances-and-privacy",
    title: "Law, Ethics, Controlled Substances, and Privacy",
    topic: "Pharmacy Law and Ethics",
    topicSlug: "pharmacy-law-and-ethics",
    system: "pharmacy",
    bodySystem: "pharmacy",
    previewSectionCount: 2,
    seoTitle: "Pharmacy Technician Law, Ethics, Controlled Substances, and Privacy",
    seoDescription: "Pharmacy technician exam lesson on controlled-substance rules, privacy, documentation, role boundaries, US/Canada exam framing, and escalation.",
    alliedProfessionKey: "pharmacy-tech",
    sections: pharmacySections.law,
    studyTakeaways: ["Know the technician role boundary.", "Privacy rules control disclosure.", "Controlled-substance questions reward documentation and policy."],
    studyCommonTraps: ["Assuming family disclosure is permitted", "Inventing controlled-substance permissions", "Skipping documentation details"],
    preTest: [quiz("A legal or privacy question is ambiguous. What is the safest technician action?", ["Guess based on convenience", "Follow policy and escalate", "Ignore it if the patient is waiting", "Disclose information to any family member"], 1, "Legal and privacy ambiguity should be handled by policy and escalation, not informal judgment.")],
    postTest: [quiz("Which topic is central to controlled-substance workflow?", ["Color of bottle cap only", "Inventory and documentation", "Patient preference only", "Shelf decoration"], 1, "Controlled substances require strict inventory, documentation, storage, and dispensing controls.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "pharm-tech-sterile-and-nonsterile-compounding",
    title: "Sterile and Non-Sterile Compounding",
    topic: "Compounding",
    topicSlug: "pharmacy-compounding",
    system: "pharmacy",
    bodySystem: "pharmacy",
    previewSectionCount: 2,
    seoTitle: "Sterile and Non-Sterile Compounding for Pharmacy Technicians",
    seoDescription: "Pharmacy technician compounding lesson on aseptic technique, first air, non-sterile formulas, hazardous drugs, beyond-use dating, labeling, and contamination prevention.",
    alliedProfessionKey: "pharmacy-tech",
    sections: pharmacySections.compounding,
    studyTakeaways: ["Sterile compounding prioritizes contamination prevention.", "Non-sterile compounding requires accurate formula and labeling.", "Hazardous drugs require PPE and containment thinking."],
    studyCommonTraps: ["Blocking first air", "Treating BUD as optional", "Continuing after contamination risk"],
    preTest: [quiz("Blocking first air during sterile compounding most directly risks:", ["Contamination", "Lower insurance billing", "Brand-generic mismatch", "Refill-too-soon rejection"], 0, "First air protects critical sites; blocking it can compromise sterility.")],
    postTest: [quiz("Which is a non-sterile compounding concern?", ["Beyond-use dating", "Ventilator PEEP", "ABG compensation", "ECG axis"], 0, "Beyond-use dating is a key compounding, labeling, and stability concern.")]
  }
];

export default { lessons: pharmacyTechnicianLessons };
