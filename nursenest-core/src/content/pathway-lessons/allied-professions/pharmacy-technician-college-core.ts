function quiz(question: string, options: string[], correct: number, rationale: string) {
  return { question, options, correct, rationale };
}

export const pharmacyTechnicianCollegeCoreLessons = [
  {
    pathwayId: "us-allied-core",
    slug: "pharm-tech-pharmacology-foundations",
    title: "Pharmacology Foundations for Pharmacy Technicians",
    topic: "Pharmacology Foundations",
    topicSlug: "pharmacology-foundations",
    system: "pharmacy",
    bodySystem: "pharmacy",
    alliedProfessionKey: "pharmacy-tech",
    previewSectionCount: 2,
    seoTitle: "Pharmacology Foundations for Pharmacy Technician Students",
    seoDescription: "College-level pharmacy technician lesson on pharmacodynamics, pharmacokinetics, therapeutic classes, adverse effects, contraindication flags, and technician escalation.",
    sections: [
      {
        id: "clinical-meaning",
        heading: "Clinical Meaning",
        kind: "clinical_meaning",
        body: "A pharmacy technician does not prescribe or independently assess therapy, but a college-level technician must understand the language of pharmacology well enough to recognize medication classes, common use patterns, dosage forms, high-risk categories, and profile flags that require pharmacist review. Pharmacology is the foundation for safe product selection, Top 200 recall, medication safety, and licensing-exam reasoning."
      },
      {
        id: "core-concept",
        heading: "Core Concept",
        kind: "core_concept",
        body: "Pharmacodynamics describes what a drug does to the body, while pharmacokinetics describes what the body does to the drug through absorption, distribution, metabolism, and elimination. Pharmacy technicians should connect drug names to class, route, formulation, storage, common indication, and safety concern. For example, anticoagulants connect to bleeding risk, insulin connects to concentration and storage checks, and opioids connect to controlled-substance workflow and respiratory depression risk."
      },
      {
        id: "clinical-scenario",
        heading: "Clinical Scenario",
        kind: "clinical_scenario",
        body: "A patient's profile shows warfarin and a new antibiotic prescription. The technician does not evaluate the interaction independently or advise the patient clinically, but should recognize that anticoagulants and antibiotics can be clinically important together and route the profile flag to the pharmacist. This is the correct technician role: recognize the safety signal and escalate."
      },
      {
        id: "college-program-focus",
        heading: "College Program Focus",
        kind: "college_program_focus",
        body: "A college-level pharmacy technician program should teach drug classes by therapeutic system: cardiovascular, endocrine, infectious disease, respiratory, gastrointestinal, neurologic, psychiatric, pain, anticoagulation, and reproductive health. Each class should include representative drugs, common suffixes, major warnings, and handling implications for pharmacy workflow."
      },
      {
        id: "licensing-exam-relevance",
        heading: "Licensing Exam Relevance",
        kind: "exam_relevance",
        body: "PTCE, ExCPT, and PEBC questions frequently test class recognition, brand/generic matching, adverse-effect awareness, storage, and escalation triggers. Exam success depends on linking drug names to safety behavior, not memorizing isolated lists."
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: "Pharmacology for technicians is practical safety knowledge: class, use, formulation, warning, storage, and escalation. The technician does not make therapy decisions but must recognize when a medication pattern needs pharmacist attention."
      }
    ],
    studyTakeaways: [
      "Pharmacodynamics is drug effect; pharmacokinetics is movement through the body.",
      "Technicians should connect drug classes to safety and workflow implications.",
      "Recognize profile flags and escalate clinical judgment to the pharmacist."
    ],
    studyCommonTraps: [
      "Memorizing brand/generic names without class or safety context",
      "Trying to independently resolve clinical drug interactions",
      "Ignoring storage and formulation details during product selection"
    ],
    preTest: [quiz("Which phrase best describes pharmacokinetics?", ["What the drug does to the body", "What the body does to the drug", "How insurance claims are submitted", "How tablets are counted"], 1, "Pharmacokinetics describes absorption, distribution, metabolism, and elimination.")],
    postTest: [quiz("A technician notices warfarin and a new antibiotic on a profile. What is the best technician action?", ["Ignore it", "Counsel the patient independently", "Flag for pharmacist review", "Change the antibiotic"], 2, "Technicians recognize safety signals and escalate clinical judgment to the pharmacist.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "pharm-tech-anatomy-physiology-for-medication-use",
    title: "Anatomy and Physiology for Medication Use",
    topic: "Anatomy and Physiology",
    topicSlug: "anatomy-physiology-pharmacy",
    system: "pharmacy",
    bodySystem: "pharmacy",
    alliedProfessionKey: "pharmacy-tech",
    previewSectionCount: 2,
    seoTitle: "Anatomy and Physiology for Pharmacy Technician Students",
    seoDescription: "College-level pharmacy technician lesson linking body systems to medication classes, drug routes, adverse effects, and pharmacy workflow recognition.",
    sections: [
      {
        id: "clinical-meaning",
        heading: "Clinical Meaning",
        kind: "clinical_meaning",
        body: "Pharmacy technicians need anatomy and physiology because medications are organized by body system and therapeutic effect. Understanding basic cardiovascular, endocrine, respiratory, gastrointestinal, renal, neurologic, and immune-system concepts helps technicians recognize why a medication is used and which safety flags matter."
      },
      {
        id: "cardio-endocrine",
        heading: "Cardiovascular and Endocrine Medication Context",
        kind: "core_concept",
        body: "Cardiovascular medications often target blood pressure, rhythm, clotting, or cholesterol. Endocrine medications commonly involve diabetes and thyroid replacement. A technician should connect insulin to glucose control and high-alert storage/dosing, levothyroxine to thyroid replacement and strength accuracy, and anticoagulants to clot prevention and bleeding risk."
      },
      {
        id: "renal-hepatic",
        heading: "Renal and Hepatic Relevance",
        kind: "clinical_meaning",
        body: "Kidney and liver function affect medication handling. Technicians do not adjust doses independently, but profile alerts about renal function, liver disease, pregnancy, age, duplicate therapy, or allergies are escalation signals."
      },
      {
        id: "clinical-scenario",
        heading: "Clinical Scenario",
        kind: "clinical_scenario",
        body: "A pediatric liquid antibiotic prescription includes a weight-based dose. The technician should pay close attention to concentration, volume, duration, and quantity because pediatric dosing errors can be high risk. Any unusual dose or mismatch should be flagged for pharmacist review."
      },
      {
        id: "licensing-exam-relevance",
        heading: "Licensing Exam Relevance",
        kind: "exam_relevance",
        body: "Licensing questions may ask which medication belongs to a body system, which patient factor is a safety flag, or which medication class requires careful handling. Body-system knowledge makes drug-class recall more logical."
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: "Anatomy and physiology gives medication names clinical context. Technicians use it to recognize patterns, not to diagnose or independently manage therapy."
      }
    ],
    studyTakeaways: [
      "Medication classes often map to body systems.",
      "Renal, hepatic, pediatric, and pregnancy flags require careful escalation.",
      "Body-system context improves Top 200 recall."
    ],
    studyCommonTraps: [
      "Studying anatomy separately from medications",
      "Ignoring pediatric dose risk",
      "Trying to make clinical decisions outside technician scope"
    ],
    preTest: [quiz("Insulin is most directly associated with which body system/domain?", ["Endocrine/glucose regulation", "Skeletal alignment", "Hearing", "Vision only"], 0, "Insulin is used in diabetes and glucose regulation.")],
    postTest: [quiz("A pediatric liquid dose seems unusual. What is the best technician action?", ["Change it independently", "Ignore the concern", "Flag for pharmacist review", "Round to the nearest bottle size only"], 2, "Pediatric dosing concerns should be escalated for pharmacist review.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "pharm-tech-professional-practice-and-scope",
    title: "Professional Practice, Scope, and Ethics",
    topic: "Professional Practice",
    topicSlug: "professional-practice-pharmacy",
    system: "pharmacy",
    bodySystem: "pharmacy",
    alliedProfessionKey: "pharmacy-tech",
    previewSectionCount: 2,
    seoTitle: "Professional Practice and Scope for Pharmacy Technicians",
    seoDescription: "College-level pharmacy technician lesson on scope, ethics, confidentiality, professionalism, pharmacist handoff, patient communication, and documentation.",
    sections: [
      {
        id: "clinical-meaning",
        heading: "Clinical Meaning",
        kind: "clinical_meaning",
        body: "A pharmacy technician's professional value comes from accuracy, reliability, confidentiality, communication, and knowing when to escalate. College-level preparation must teach the boundaries between technical workflow tasks and pharmacist-only clinical judgment."
      },
      {
        id: "scope",
        heading: "Technician Scope",
        kind: "core_concept",
        body: "Technicians commonly support prescription intake, data entry, product preparation, inventory, compounding support, billing workflows, and patient service. Pharmacists handle clinical verification, counseling, therapy assessment, and final professional judgment. Exact scope varies by jurisdiction and employer policy."
      },
      {
        id: "confidentiality",
        heading: "Confidentiality and Communication",
        kind: "clinical_meaning",
        body: "Technicians handle private medication information and must follow privacy law and workplace policy. Communication should be respectful, factual, and escalated when questions require clinical interpretation."
      },
      {
        id: "clinical-scenario",
        heading: "Clinical Scenario",
        kind: "clinical_scenario",
        body: "A patient asks whether they can stop an antibiotic because they feel better. The technician should not provide clinical advice. The appropriate action is to refer the question to the pharmacist while maintaining professional tone and patient privacy."
      },
      {
        id: "licensing-exam-relevance",
        heading: "Licensing Exam Relevance",
        kind: "exam_relevance",
        body: "Licensing exams test role boundaries, professionalism, confidentiality, documentation, and escalation. When unsure, choose the answer that protects privacy, follows policy, and routes clinical judgment to the pharmacist."
      },
      {
        id: "takeaways",
        heading: "Takeaways",
        kind: "takeaways",
        body: "Technician professionalism is safe workflow plus role clarity. Do the technical work accurately, communicate clearly, and escalate clinical questions."
      }
    ],
    studyTakeaways: [
      "Scope varies by jurisdiction and employer policy.",
      "Clinical counseling should be referred to the pharmacist.",
      "Privacy and professionalism are licensing-exam priorities."
    ],
    studyCommonTraps: [
      "Answering clinical therapy questions independently",
      "Disclosing medication information casually",
      "Assuming scope is identical in every jurisdiction"
    ],
    preTest: [quiz("A patient asks whether to stop an antibiotic. What should the technician do?", ["Tell them to stop", "Tell them to double the dose", "Refer to the pharmacist", "Ignore the patient"], 2, "Therapy advice requires pharmacist review.")],
    postTest: [quiz("Which behavior best reflects technician professionalism?", ["Guessing clinical answers", "Protecting privacy and escalating clinical questions", "Discussing patient medications publicly", "Changing prescriptions independently"], 1, "Professional practice includes privacy, accuracy, and escalation.")]
  }
];

export default { lessons: pharmacyTechnicianCollegeCoreLessons };
