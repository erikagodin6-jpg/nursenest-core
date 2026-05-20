function quiz(question: string, options: string[], correct: number, rationale: string) {
  return { question, options, correct, rationale };
}

const mltSections = {
  specimenIntegrity: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Medical laboratory technology starts before the analyzer ever runs. Specimen integrity determines whether a result can be trusted. Hemolysis, clotting, wrong tube selection, underfilling, poor mixing, delayed transport, temperature errors, and mislabeled specimens can produce misleading results that affect diagnosis, treatment, transfusion decisions, and patient safety."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Pre-analytical quality means collecting the right patient, right specimen, right container, right additive, right volume, right timing, and right transport conditions. EDTA supports hematology testing because it preserves cellular morphology. Sodium citrate must be correctly filled for coagulation testing because the blood-to-anticoagulant ratio affects clotting results. Serum and plasma are not interchangeable for every assay. When identity or specimen quality is uncertain, the safest response is to reject, recollect, document, and escalate according to laboratory policy."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A potassium result is critically high, but the specimen is visibly hemolyzed and the patient has no symptoms or ECG changes documented. The technologist should not silently release the result as if it is unquestionably physiologic. Hemolysis can falsely increase potassium. The correct reasoning is to follow laboratory policy for hemolysis index review, result suppression or comment, recollection, and clinical notification when appropriate."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "MLT and MLS exams frequently test whether the learner can identify the source of an error before choosing a result interpretation. Common traps include treating hemolyzed chemistry specimens as reliable, ignoring underfilled citrate tubes, mixing up serum and plasma, accepting unlabeled specimens, and failing to recognize that pre-analytical error can mimic disease."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "A result is only as reliable as the specimen. Confirm identity, tube type, volume, mixing, timing, transport, and visible quality before trusting the number."
    }
  ],
  hematology: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Hematology links numbers, morphology, and clinical context. The CBC is not a simple list of values; it is a pattern-recognition tool for anemia, infection, inflammation, marrow response, platelet disorders, and urgent hematologic abnormalities. Exam questions often test whether the learner can connect indices, smear clues, and flags into the safest next laboratory action."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Start with hemoglobin, hematocrit, RBC count, MCV, MCHC, RDW, WBC count, differential, and platelet count. Microcytic patterns suggest iron deficiency or thalassemia patterns depending on RBC count and RDW. Macrocytosis may reflect B12 or folate deficiency, liver disease, alcohol use, medication effects, or reticulocytosis. A manual smear review is triggered by analyzer flags, unexpected differentials, blasts, platelet clumps, schistocytes, or critical abnormalities according to policy."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A platelet count is very low, but the smear shows platelet clumps. The low automated count may be spurious, often related to EDTA-dependent clumping or collection issues. The technologist should follow smear review and recollection policy rather than reporting a severe thrombocytopenia without comment."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Exam traps include assuming every abnormal count reflects disease, ignoring smear review triggers, missing platelet clumping, confusing microcytic and macrocytic patterns, and failing to recognize schistocytes as an urgent morphology finding."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Read CBCs as patterns. Use indices, differentials, flags, and smear morphology together before deciding whether a result is valid or urgent."
    }
  ],
  chemistry: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Clinical chemistry translates metabolism, renal function, liver injury, endocrine status, cardiac injury, and acid-base patterns into measurable analytes. The technologist must understand analytical interference, critical values, delta checks, calibration, and QC before interpreting whether a number is plausible."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Chemistry interpretation combines analyte physiology with method limitations. Sodium and potassium reflect fluid and electrolyte balance but are vulnerable to sample and handling issues. Creatinine and urea support renal assessment. AST, ALT, ALP, bilirubin, albumin, and total protein help differentiate hepatocellular and cholestatic patterns. Troponin requires strict timing, assay awareness, and critical-value handling. Glucose results must be interpreted with collection timing, contamination risk, and specimen stability in mind."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A glucose value is unexpectedly high from a line draw. If the line was not adequately cleared and dextrose-containing fluid was running, contamination may falsely elevate glucose. The laboratory response is not to diagnose diabetes; it is to recognize the pre-analytical risk, follow recollection or comment policy, and protect result integrity."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Chemistry exam items often ask which factor explains an implausible result. Watch for hemolysis affecting potassium and LDH, delayed processing affecting glucose, IV contamination, wrong tube additives, lipemia, icterus, calibration failure, and failed QC."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Do not interpret chemistry values without checking specimen quality, timing, method limits, delta checks, and QC status."
    }
  ],
  microbiology: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Microbiology supports infection diagnosis by connecting specimen source, organism growth, Gram stain, culture conditions, susceptibility testing, and contamination risk. The technologist must distinguish pathogens from normal flora and decide when a specimen is acceptable for culture."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Start with the specimen source. A sputum specimen with many squamous epithelial cells suggests oral contamination. Blood culture collection technique affects contamination rates. Urine culture interpretation depends on collection method, colony count, symptoms, and organism identity. Gram stain gives early direction: Gram-positive cocci in clusters suggest staphylococcal patterns, Gram-positive cocci in chains suggest streptococcal or enterococcal patterns, and Gram-negative rods require source-based interpretation and susceptibility follow-up."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A sputum Gram stain shows abundant squamous epithelial cells and mixed oral flora. This is more consistent with saliva contamination than a high-quality lower respiratory specimen. The correct laboratory action is to follow rejection or recollection criteria rather than overinterpreting the culture."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Exam questions frequently test specimen acceptability, Gram stain interpretation, contamination clues, culture media selection, susceptibility reasoning, and urgent reporting. A common trap is naming an organism without considering whether the specimen itself is valid."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Microbiology interpretation starts with specimen quality and source. Valid specimen first, organism identification second, susceptibility and reporting third."
    }
  ],
  transfusion: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Transfusion medicine is a high-risk laboratory domain because identification, compatibility, antibody detection, product selection, and reaction workups directly affect patient survival. The exam rewards conservative safety reasoning and strict adherence to policy."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "ABO and Rh typing, antibody screening, crossmatching, product modification, and emergency-release procedures must align with patient identity and transfusion history. Clerical checks are as important as serology. Acute hemolytic reactions require immediate stop-transfusion communication, clerical check, visual plasma inspection, DAT testing, repeat ABO/Rh checks, and hemolysis evaluation according to policy."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient develops fever, back pain, and hypotension shortly after transfusion begins. The laboratory should treat this as a possible acute hemolytic transfusion reaction until proven otherwise. The safest pathway is immediate clinical notification, specimen and unit return per policy, identity checks, DAT and hemolysis investigation, and documentation."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Transfusion exam traps include skipping clerical checks, confusing ABO incompatibility with less urgent reactions, ignoring previous antibodies, issuing product without resolving identity mismatch, and failing to prioritize suspected acute hemolysis."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "In transfusion medicine, identity and compatibility are never shortcuts. When a reaction is suspected, stop, notify, investigate, and document."
    }
  ],
  qualityControl: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Quality control and quality assurance turn laboratory testing from isolated measurements into a reliable clinical service. QC detects analytical problems before patient results are released; QA reviews the entire process from collection through reporting."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "A technologist must know when QC is acceptable, when it violates rules, when calibration is needed, when maintenance affects testing, and when patient results must be held. Levey-Jennings charts, shifts, trends, random error, systematic error, reagent lot changes, calibration verification, proficiency testing, and corrective-action documentation are core exam domains."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "Two levels of QC are outside acceptable limits after a reagent lot change. The technologist should not release patient results while hoping the next run improves. The correct response is to stop testing, troubleshoot reagent, calibration, instrument, and procedural causes, document corrective action, and resume only when QC is acceptable by policy."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "QC exam questions often ask whether to report, repeat, recalibrate, troubleshoot, or hold results. The safe answer is usually to protect patient results until QC demonstrates the method is in control."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Failed QC means patient reporting stops until the system is corrected and documented. Never release results from an out-of-control process."
    }
  ]
};

export const medicalLaboratoryTechnologyLessons = [
  {
    pathwayId: "us-allied-core",
    slug: "mlt-specimen-integrity-and-preanalytical-errors",
    title: "Specimen Integrity and Pre-Analytical Errors",
    topic: "Specimen Integrity",
    topicSlug: "specimen-integrity",
    system: "laboratory",
    bodySystem: "laboratory",
    previewSectionCount: 2,
    seoTitle: "MLT Specimen Integrity and Pre-Analytical Errors",
    seoDescription: "MLT and MLS lesson on specimen quality, tube selection, hemolysis, underfilled citrate tubes, labeling, transport, and pre-analytical error recognition.",
    alliedProfessionKey: "mlt",
    sections: mltSections.specimenIntegrity,
    studyTakeaways: ["Specimen quality controls result reliability.", "Reject or recollect when identity or integrity is unsafe.", "Hemolysis, wrong tube, and underfilling can mimic disease."],
    studyCommonTraps: ["Reporting hemolyzed potassium without review", "Accepting unlabeled specimens", "Ignoring citrate tube fill volume"],
    preTest: [quiz("A visibly hemolyzed specimen has a critically high potassium. What is the safest laboratory reasoning?", ["Assume true hyperkalemia", "Review hemolysis impact and follow recollection or comment policy", "Delete the result without documentation", "Change the result to normal"], 1, "Hemolysis can falsely elevate potassium; follow laboratory policy for review, recollection, comments, and escalation.")],
    postTest: [quiz("Which pre-analytical problem affects coagulation testing most directly?", ["Underfilled sodium citrate tube", "EDTA tube mixed gently", "Serum separator tube allowed to clot", "Specimen transported upright"], 0, "Citrate tubes require the correct blood-to-anticoagulant ratio for valid coagulation results.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "mlt-hematology-cbc-indices-and-smear-review",
    title: "Hematology: CBC Indices and Smear Review",
    topic: "Hematology",
    topicSlug: "hematology",
    system: "laboratory",
    bodySystem: "hematology",
    previewSectionCount: 2,
    seoTitle: "MLT Hematology CBC Indices and Smear Review",
    seoDescription: "Medical laboratory technology lesson on CBC patterns, RBC indices, platelet clumps, analyzer flags, smear review triggers, and morphology traps.",
    alliedProfessionKey: "mlt",
    sections: mltSections.hematology,
    studyTakeaways: ["CBC interpretation is pattern-based.", "Analyzer flags and smear morphology matter.", "Platelet clumps can create spurious thrombocytopenia."],
    studyCommonTraps: ["Ignoring platelet clumps", "Confusing microcytic and macrocytic patterns", "Missing schistocytes or blasts"],
    preTest: [quiz("A very low platelet count is paired with platelet clumps on smear. What should the technologist suspect?", ["Spurious low platelet count", "Guaranteed leukemia", "Normal platelet function", "No need for comment"], 0, "Platelet clumping can falsely lower automated platelet counts and requires policy-guided review or recollection.")],
    postTest: [quiz("Which finding is an urgent smear-review concern?", ["Schistocytes", "Normal neutrophils", "Adequate platelets", "Mild rouleaux only"], 0, "Schistocytes can indicate microangiopathic hemolysis and require urgent review according to policy.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "mlt-clinical-chemistry-critical-values-and-interference",
    title: "Clinical Chemistry: Critical Values and Interference",
    topic: "Clinical Chemistry",
    topicSlug: "clinical-chemistry",
    system: "laboratory",
    bodySystem: "chemistry",
    previewSectionCount: 2,
    seoTitle: "MLT Clinical Chemistry Critical Values and Interference",
    seoDescription: "MLT/MLS chemistry lesson on electrolyte patterns, liver enzymes, troponin timing, glucose contamination, hemolysis, lipemia, icterus, QC, and delta checks.",
    alliedProfessionKey: "mlt",
    sections: mltSections.chemistry,
    studyTakeaways: ["Check specimen quality before interpretation.", "Critical values require policy-based notification.", "Delta checks help identify implausible changes."],
    studyCommonTraps: ["Ignoring IV contamination", "Missing hemolysis interference", "Reporting results while QC is out"],
    preTest: [quiz("A line-draw glucose is unexpectedly high and dextrose fluid was running. What is the main concern?", ["Analyzer cannot measure glucose", "Possible IV fluid contamination", "Patient must have diabetes", "Specimen is automatically acceptable"], 1, "Dextrose contamination can falsely elevate glucose; recollection or policy-based review is needed.")],
    postTest: [quiz("Which issue can falsely increase potassium?", ["Hemolysis", "Proper centrifugation", "Correct tube fill", "Prompt separation"], 0, "Hemolysis releases intracellular potassium and can falsely increase potassium results.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "mlt-microbiology-specimen-quality-gram-stain-and-culture",
    title: "Microbiology: Specimen Quality, Gram Stain, and Culture",
    topic: "Microbiology",
    topicSlug: "microbiology",
    system: "laboratory",
    bodySystem: "microbiology",
    previewSectionCount: 2,
    seoTitle: "MLT Microbiology Specimen Quality Gram Stain and Culture",
    seoDescription: "MLT microbiology lesson on specimen acceptability, sputum contamination, Gram stain patterns, culture interpretation, and susceptibility workflow.",
    alliedProfessionKey: "mlt",
    sections: mltSections.microbiology,
    studyTakeaways: ["Specimen source drives interpretation.", "Contaminated specimens can mislead culture results.", "Gram stain gives early but not complete direction."],
    studyCommonTraps: ["Overinterpreting poor sputum specimens", "Naming organisms without source context", "Ignoring mixed flora contamination"],
    preTest: [quiz("A sputum Gram stain has many squamous epithelial cells and mixed oral flora. What does this suggest?", ["High-quality lower respiratory specimen", "Likely oral contamination", "Confirmed bloodstream infection", "Sterile specimen"], 1, "Many squamous epithelial cells suggest oral contamination rather than a reliable lower respiratory specimen.")],
    postTest: [quiz("Gram-positive cocci in clusters most strongly suggests which broad pattern?", ["Staphylococcal pattern", "Enteric Gram-negative rod pattern", "Yeast only", "Mycobacterial pattern"], 0, "Gram-positive cocci in clusters are classically associated with staphylococcal patterns, pending full identification.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "mlt-transfusion-medicine-compatibility-and-reaction-workup",
    title: "Transfusion Medicine: Compatibility and Reaction Workup",
    topic: "Transfusion Medicine",
    topicSlug: "transfusion-medicine",
    system: "laboratory",
    bodySystem: "transfusion-medicine",
    previewSectionCount: 2,
    seoTitle: "MLT Transfusion Medicine Compatibility and Reaction Workup",
    seoDescription: "MLT lesson on ABO/Rh typing, antibody screening, crossmatch safety, identity checks, emergency release, and acute hemolytic transfusion reaction workup.",
    alliedProfessionKey: "mlt",
    sections: mltSections.transfusion,
    studyTakeaways: ["Identity checks are transfusion safety steps, not paperwork.", "Suspected acute hemolysis is urgent.", "Previous antibodies and compatibility history matter."],
    studyCommonTraps: ["Skipping clerical checks", "Issuing product despite identity mismatch", "Ignoring acute reaction symptoms"],
    preTest: [quiz("Back pain, fever, and hypotension shortly after transfusion begins should trigger concern for:", ["Possible acute hemolytic transfusion reaction", "Routine mild bruising", "Specimen hemolysis only", "No laboratory follow-up"], 0, "These symptoms can indicate acute hemolytic transfusion reaction and require immediate policy-guided workup.")],
    postTest: [quiz("Which step is essential in a transfusion reaction investigation?", ["Clerical identity check", "Ignoring the returned unit", "Deleting the transfusion record", "Skipping DAT testing by default"], 0, "Clerical checks help detect wrong-patient or wrong-unit errors and are central to reaction workup.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "mlt-quality-control-qc-rules-and-corrective-action",
    title: "Quality Control: QC Rules and Corrective Action",
    topic: "Laboratory Quality Control",
    topicSlug: "laboratory-quality-control",
    system: "laboratory",
    bodySystem: "quality-control",
    previewSectionCount: 2,
    seoTitle: "MLT Quality Control QC Rules and Corrective Action",
    seoDescription: "Medical laboratory technology lesson on QC acceptability, Levey-Jennings charts, shifts, trends, calibration, failed QC, corrective action, and result release decisions.",
    alliedProfessionKey: "mlt",
    sections: mltSections.qualityControl,
    studyTakeaways: ["Failed QC means patient result release stops.", "Trends and shifts suggest method problems.", "Corrective action must be documented."],
    studyCommonTraps: ["Releasing results during failed QC", "Ignoring reagent lot changes", "Repeating controls endlessly without troubleshooting"],
    preTest: [quiz("Two QC levels are outside acceptable limits after a reagent lot change. What should happen to patient testing?", ["Release results anyway", "Hold results and troubleshoot before release", "Ignore QC because both levels failed", "Change patient results manually"], 1, "Out-of-control QC requires holding patient results, troubleshooting, and documenting corrective action before release.")],
    postTest: [quiz("A Levey-Jennings chart showing a gradual movement in one direction suggests:", ["Trend", "Perfect stability", "No need for review", "Patient identity error only"], 0, "A gradual movement can indicate a trend and should prompt QC review according to laboratory policy.")]
  }
];

export default { lessons: medicalLaboratoryTechnologyLessons };
