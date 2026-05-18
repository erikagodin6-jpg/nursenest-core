function quiz(question: string, options: string[], correct: number, rationale: string) {
  return { question, options, correct, rationale };
}

type MltSectionKey =
  | "hematology"
  | "bloodBank"
  | "chemistry"
  | "microbiology"
  | "coagulation"
  | "urinalysis"
  | "qualityControl";

const mltSections: Record<MltSectionKey, unknown[]> = {
  hematology: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Hematology interpretation is not isolated memorization. MLS professionals correlate CBC indices, morphology, analyzer flags, coagulation abnormalities, and specimen integrity before validating results. Exams increasingly reward mechanism-first reasoning rather than flat recall.",
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Interpret CBCs systematically: hemoglobin and hematocrit for severity, MCV for cell size, RDW for variability, platelet count for bleeding risk, and WBC differential for inflammatory or malignant patterns. Morphology findings must correlate with analyzer data and clinical context.",
    },
    {
      id: "workflow",
      heading: "Laboratory Workflow",
      kind: "clinical_scenario",
      body: "A smear with schistocytes, thrombocytopenia, prolonged coagulation studies, and worsening renal markers should trigger fragmentation hemolysis reasoning and timely escalation. The MLS is not diagnosing independently; the MLS protects result integrity and flags critical findings through policy-defined communication.",
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "CSMLS and ASCP items frequently combine morphology, analyzer interpretation, coagulation reasoning, and escalation judgment. Expect questions that ask what the laboratorian should do next, not only what cell is present.",
    },
  ],
  bloodBank: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Blood bank testing directly affects transfusion safety. MLS professionals must interpret antibody reactions, evaluate compatibility risk, and escalate unsafe transfusion situations immediately.",
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "ABO/Rh interpretation, antibody screening, crossmatching, DAT/IAT interpretation, and transfusion reaction investigation form the foundation of transfusion medicine workflow. Reaction strength patterns help narrow likely antibodies and guide compatibility decisions.",
    },
    {
      id: "workflow",
      heading: "Workflow Scenario",
      kind: "clinical_scenario",
      body: "A trauma patient requires emergency uncrossmatched blood while antibody identification remains unresolved. The MLS must balance urgency, compatibility risk, inventory constraints, and escalation policy simultaneously.",
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Blood bank questions reward elimination logic, reaction interpretation, and escalation judgment under pressure. Questions often focus on the safest operational decision rather than ideal laboratory conditions.",
    },
  ],
  chemistry: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Clinical chemistry connects analyzer output to patient physiology and specimen integrity. The MLS must decide whether a result is analytically reliable before it is verified, especially when hemolysis, lipemia, icterus, contamination, delayed transport, or calibration concerns are present.",
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Interpret chemistry panels by pattern: sodium and osmolality for water balance, potassium and bicarbonate for acid-base and renal handling, creatinine and BUN for renal function, AST/ALT/ALP/bilirubin for hepatocellular versus cholestatic patterns, and troponin or lactate for time-sensitive escalation.",
    },
    {
      id: "workflow",
      heading: "Analyzer and Specimen Workflow",
      kind: "clinical_scenario",
      body: "A critically high potassium from a hemolyzed draw should not be treated as equivalent to a clean specimen. The MLS reviews hemolysis index, collection notes, prior results, analyzer flags, and redraw policy before verification or critical value communication.",
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Exam traps include confusing true hyperkalemia with pseudohyperkalemia, ignoring IV contamination, missing lipemia interference, and treating critical values as purely numeric instead of workflow-dependent.",
    },
  ],
  microbiology: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Microbiology reasoning is a narrowing process. MLS professionals integrate specimen source, Gram stain, colony morphology, growth conditions, biochemical reactions, resistance clues, and contamination risk before final organism identification or escalation.",
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Begin with specimen quality and source. A Gram-positive cocci result means something different in a sterile blood culture than in a superficial wound swab. Gram reaction, arrangement, oxygen tolerance, catalase/coagulase or oxidase patterns, and culture timing guide the next best test.",
    },
    {
      id: "workflow",
      heading: "Unknown Organism Workflow",
      kind: "clinical_scenario",
      body: "A blood culture flags positive and Gram stain shows Gram-positive cocci in clusters. The MLS should recognize possible Staphylococcus species, follow site protocol for rapid identification or susceptibility workflows, and communicate urgent preliminary findings appropriately.",
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Microbiology questions often test the next best narrowing step. Avoid jumping to final identification before considering specimen source, contamination likelihood, and which biochemical or molecular test logically follows.",
    },
  ],
  coagulation: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Coagulation testing evaluates bleeding and clotting risk. MLS professionals must connect PT, aPTT, INR, fibrinogen, D-dimer, platelet count, anticoagulant exposure, and specimen quality to determine whether results are valid and urgent.",
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "PT primarily reflects extrinsic/common pathway activity and is used with INR for warfarin monitoring. aPTT reflects intrinsic/common pathway activity and is affected by heparin, factor deficiencies, inhibitors, and specimen issues. Citrate tube fill volume is critical because incorrect anticoagulant ratio can invalidate results.",
    },
    {
      id: "workflow",
      heading: "Specimen Integrity Workflow",
      kind: "clinical_scenario",
      body: "A coagulation tube is visibly underfilled. Even if the analyzer produces a numeric result, the citrate-to-blood ratio may be wrong and can prolong clotting times artifactually. The MLS should follow rejection and recollection policy rather than reporting a misleading result.",
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Coagulation exam traps often combine tube fill errors, heparin contamination, DIC patterns, anticoagulant monitoring, and mixing-study logic. Validity comes before interpretation.",
    },
  ],
  urinalysis: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Urinalysis combines physical, chemical, and microscopic findings to screen renal, metabolic, infectious, and hydration patterns. MLS professionals correlate dipstick results with sediment findings and specimen age before reporting.",
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Specific gravity, protein, glucose, ketones, blood, leukocyte esterase, nitrite, bilirubin, and urobilinogen should be interpreted alongside RBCs, WBCs, casts, crystals, bacteria, epithelial cells, and collection quality. Old or poorly stored urine can alter pH, cells, casts, and bacterial growth patterns.",
    },
    {
      id: "workflow",
      heading: "Microscopy Workflow",
      kind: "clinical_scenario",
      body: "A specimen with positive blood on dipstick but few intact RBCs on microscopy may suggest hemoglobinuria, myoglobinuria, lysed RBCs, or preanalytic delay. The MLS should correlate chemistry, microscopy, and specimen handling rather than reporting in isolation.",
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Urinalysis questions commonly test dipstick-microscopy mismatch, cast identification, crystal interpretation, contamination recognition, and specimen preservation effects.",
    },
  ],
  qualityControl: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Quality control protects patients from unreliable laboratory results. MLS professionals must recognize when controls, calibration, reagent integrity, maintenance status, or analyzer behavior make patient results unsafe to release.",
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "QC interpretation includes random error, systematic error, shifts, trends, calibration drift, reagent problems, control deterioration, and rule violations. A failed QC event is not a paperwork issue; it may invalidate patient testing until resolved according to laboratory policy.",
    },
    {
      id: "workflow",
      heading: "QC Failure Workflow",
      kind: "clinical_scenario",
      body: "A chemistry analyzer shows a progressive control trend high over several runs. The MLS should suspect systematic drift, follow QC troubleshooting policy, assess affected patient results, and avoid releasing questionable results until acceptability is restored.",
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Exam questions often ask whether results can be reported after QC failure. The safest answer protects analytical validity: troubleshoot, recalibrate or rerun controls as required, and assess impacted patient specimens.",
    },
  ],
};

export const medicalLaboratoryTechnologistLessons = [
  {
    pathwayId: "us-allied-core",
    slug: "mlt-hematology-cbc-and-morphology-foundations",
    title: "Hematology: CBC and Morphology Foundations",
    topic: "Hematology",
    topicSlug: "hematology-cbc-interpretation",
    system: "hematology",
    bodySystem: "hematology",
    previewSectionCount: 2,
    seoTitle: "MLT Hematology CBC and Morphology Foundations",
    seoDescription: "MLS and MLT hematology lesson covering CBC interpretation, morphology correlation, analyzer flags, specimen integrity, and escalation reasoning.",
    alliedProfessionKey: "mlt",
    sections: mltSections.hematology,
    studyTakeaways: [
      "Interpret CBC values systematically instead of memorizing isolated ranges.",
      "Correlate morphology with analyzer findings and specimen quality.",
      "Critical values require workflow judgment and escalation discipline.",
    ],
    studyCommonTraps: [
      "Ignoring specimen hemolysis during chemistry interpretation",
      "Memorizing morphology without disease correlation",
      "Reporting implausible analyzer results without verification",
    ],
    preTest: [quiz("A severely hemolyzed specimen shows critically elevated potassium. What should the MLS evaluate first?", ["Room temperature only", "Specimen integrity and analyzer flags", "Patient insurance status", "ABO compatibility"], 1, "Hemolysis can produce pseudohyperkalemia and requires specimen integrity evaluation before verification.")],
    postTest: [quiz("Which finding most strongly suggests fragmentation hemolysis?", ["Target cells", "Schistocytes", "Howell-Jolly bodies", "Spherocytes only"], 1, "Schistocytes suggest RBC fragmentation processes such as DIC or TTP.")],
  },
  {
    pathwayId: "us-allied-core",
    slug: "mlt-blood-bank-and-transfusion-workflow",
    title: "Blood Bank and Transfusion Workflow",
    topic: "Blood Bank",
    topicSlug: "blood-banking-crossmatch",
    system: "transfusion",
    bodySystem: "hematology",
    previewSectionCount: 2,
    seoTitle: "MLT Blood Bank and Transfusion Workflow",
    seoDescription: "MLS and MLT transfusion medicine lesson covering ABO/Rh, antibody screening, crossmatching, emergency release, and transfusion safety.",
    alliedProfessionKey: "mlt",
    sections: mltSections.bloodBank,
    studyTakeaways: [
      "Blood bank reasoning prioritizes transfusion safety and escalation.",
      "Reaction patterns guide antibody narrowing workflows.",
      "Emergency transfusion scenarios require operational judgment under pressure.",
    ],
    studyCommonTraps: [
      "Assuming compatibility without full reaction interpretation",
      "Ignoring urgency escalation pathways",
      "Treating transfusion medicine as memorization only",
    ],
    preTest: [quiz("Which blood bank principle is most important during emergency uncrossmatched transfusion?", ["Perfect antibody identification before release", "Balancing urgency with compatibility risk", "Ignoring reaction strength", "Avoiding provider communication"], 1, "Emergency release workflows balance life-threatening urgency against transfusion compatibility risk.")],
    postTest: [quiz("What is the purpose of antibody screening?", ["Measure potassium", "Identify unexpected RBC antibodies", "Evaluate platelet aggregation", "Measure fibrinogen"], 1, "Antibody screening detects clinically significant unexpected RBC antibodies before transfusion.")],
  },
  {
    pathwayId: "us-allied-core",
    slug: "mlt-clinical-chemistry-analyzer-and-interference-reasoning",
    title: "Clinical Chemistry: Analyzer and Interference Reasoning",
    topic: "Clinical Chemistry",
    topicSlug: "clinical-chemistry-panels",
    system: "chemistry",
    bodySystem: "metabolic",
    previewSectionCount: 2,
    seoTitle: "MLT Clinical Chemistry Analyzer and Interference Reasoning",
    seoDescription: "MLS and MLT clinical chemistry lesson covering electrolytes, renal/liver patterns, hemolysis, lipemia, icterus, analyzer flags, and result verification.",
    alliedProfessionKey: "mlt",
    sections: mltSections.chemistry,
    studyTakeaways: [
      "Chemistry interpretation requires physiology plus specimen validity.",
      "Hemolysis, lipemia, icterus, contamination, and delayed transport can alter reportability.",
      "Critical results still require analyzer and specimen context before safe release.",
    ],
    studyCommonTraps: [
      "Treating all high potassium values as true hyperkalemia",
      "Ignoring IV fluid contamination patterns",
      "Missing analyzer interference warnings",
    ],
    preTest: [quiz("Which preanalytic issue can falsely elevate potassium?", ["Hemolysis", "Proper fasting", "Correct tube fill", "Immediate centrifugation"], 0, "Hemolysis releases intracellular potassium and can cause pseudohyperkalemia.")],
    postTest: [quiz("A chemistry analyzer flags severe lipemia. What should the MLS consider?", ["Possible analytical interference", "Automatic blood bank compatibility", "No effect on any assay", "Only urine sediment changes"], 0, "Lipemia can interfere with some chemistry assays and may affect result reliability.")],
  },
  {
    pathwayId: "us-allied-core",
    slug: "mlt-microbiology-culture-and-unknown-identification-workflow",
    title: "Microbiology: Culture and Unknown Identification Workflow",
    topic: "Microbiology",
    topicSlug: "microbiology-culture-identification",
    system: "microbiology",
    bodySystem: "infection",
    previewSectionCount: 2,
    seoTitle: "MLT Microbiology Culture and Unknown Identification Workflow",
    seoDescription: "MLS and MLT microbiology lesson covering Gram stain interpretation, culture source, colony morphology, biochemical narrowing, contamination risk, and urgent communication.",
    alliedProfessionKey: "mlt",
    sections: mltSections.microbiology,
    studyTakeaways: [
      "Microbiology identification is a narrowing workflow, not a single-step guess.",
      "Specimen source changes the meaning of the same organism pattern.",
      "Preliminary Gram stain findings may require timely escalation.",
    ],
    studyCommonTraps: [
      "Jumping to final ID before source and morphology are considered",
      "Ignoring contamination likelihood",
      "Choosing a biochemical test that does not logically narrow the organism",
    ],
    preTest: [quiz("Gram-positive cocci in clusters from a positive blood culture most directly suggests consideration of:", ["Staphylococcus species", "Enteric Gram-negative rods only", "Candida only", "Mycobacteria only"], 0, "Gram-positive cocci in clusters raise concern for Staphylococcus species and require urgent preliminary workflow attention.")],
    postTest: [quiz("Which factor is essential before interpreting culture significance?", ["Specimen source", "Patient shoe size", "Label color only", "Room number only"], 0, "Specimen source determines contamination likelihood and clinical significance.")],
  },
  {
    pathwayId: "us-allied-core",
    slug: "mlt-coagulation-pt-aptt-inr-and-specimen-validity",
    title: "Coagulation: PT, aPTT, INR, and Specimen Validity",
    topic: "Coagulation",
    topicSlug: "coagulation-studies-guide",
    system: "coagulation",
    bodySystem: "hematology",
    previewSectionCount: 2,
    seoTitle: "MLT Coagulation PT aPTT INR and Specimen Validity",
    seoDescription: "MLS and MLT coagulation lesson covering PT, aPTT, INR, anticoagulants, citrate tube fill, DIC patterns, and reportability judgment.",
    alliedProfessionKey: "mlt",
    sections: mltSections.coagulation,
    studyTakeaways: [
      "Coagulation validity depends heavily on specimen collection quality.",
      "PT, aPTT, INR, fibrinogen, D-dimer, and platelets should be interpreted as patterns.",
      "Underfilled citrate tubes can produce misleading clotting results.",
    ],
    studyCommonTraps: [
      "Reporting underfilled citrate tubes",
      "Confusing PT and aPTT pathway emphasis",
      "Ignoring heparin contamination or anticoagulant exposure",
    ],
    preTest: [quiz("An underfilled blue-top tube can most directly cause:", ["Incorrect citrate-to-blood ratio", "Automatic antibody identification", "False colony growth", "No coagulation impact"], 0, "Underfill changes citrate-to-blood ratio and can invalidate coagulation testing.")],
    postTest: [quiz("INR is most closely associated with monitoring which therapy?", ["Warfarin", "Insulin", "Albuterol", "Levothyroxine"], 0, "INR standardizes PT reporting and is used for warfarin monitoring.")],
  },
  {
    pathwayId: "us-allied-core",
    slug: "mlt-urinalysis-dipstick-microscopy-and-body-fluid-correlation",
    title: "Urinalysis: Dipstick, Microscopy, and Body Fluid Correlation",
    topic: "Urinalysis and Body Fluids",
    topicSlug: "urinalysis-body-fluids",
    system: "urinalysis",
    bodySystem: "renal",
    previewSectionCount: 2,
    seoTitle: "MLT Urinalysis Dipstick Microscopy and Body Fluid Correlation",
    seoDescription: "MLS and MLT urinalysis lesson covering dipstick chemistry, sediment microscopy, casts, crystals, specimen age, and mismatch interpretation.",
    alliedProfessionKey: "mlt",
    sections: mltSections.urinalysis,
    studyTakeaways: [
      "Urinalysis requires physical, chemical, and microscopic correlation.",
      "Specimen age and storage can change sediment interpretation.",
      "Dipstick-microscopy mismatches are high-yield exam traps.",
    ],
    studyCommonTraps: [
      "Reporting dipstick and microscopy in isolation",
      "Ignoring old specimen effects",
      "Missing hemoglobin or myoglobin explanations for positive blood with few RBCs",
    ],
    preTest: [quiz("Positive blood on dipstick with few intact RBCs may suggest:", ["Hemoglobin or myoglobin correlation", "Always perfect collection", "ABO incompatibility only", "No need to correlate"], 0, "Dipstick blood detects heme activity and may be positive with hemoglobinuria, myoglobinuria, or lysed RBCs.")],
    postTest: [quiz("Which finding is part of urine sediment microscopy?", ["Casts", "INR", "Antibody screen", "Ventilator PEEP"], 0, "Casts are evaluated microscopically in urine sediment.")],
  },
  {
    pathwayId: "us-allied-core",
    slug: "mlt-quality-control-westgard-and-analyzer-troubleshooting",
    title: "Quality Control, Westgard Logic, and Analyzer Troubleshooting",
    topic: "Quality Control",
    topicSlug: "lab-values",
    system: "laboratory-quality",
    bodySystem: "quality-control",
    previewSectionCount: 2,
    seoTitle: "MLT Quality Control Westgard and Analyzer Troubleshooting",
    seoDescription: "MLS and MLT quality control lesson covering shifts, trends, systematic error, random error, analyzer troubleshooting, result validity, and patient result release decisions.",
    alliedProfessionKey: "mlt",
    sections: mltSections.qualityControl,
    studyTakeaways: [
      "QC protects analytical reliability before patient results are released.",
      "Trends and shifts suggest different troubleshooting pathways.",
      "Patient reporting must stop when QC failure invalidates analytical confidence.",
    ],
    studyCommonTraps: [
      "Releasing patient results after unresolved QC failure",
      "Treating trends as random error only",
      "Ignoring affected patient result review after analyzer problems",
    ],
    preTest: [quiz("A progressive QC trend high most strongly suggests:", ["Systematic drift", "Perfect analyzer stability", "Blood bank compatibility", "Normal urine sediment"], 0, "A progressive trend suggests systematic drift or method instability that requires troubleshooting.")],
    postTest: [quiz("After unresolved QC failure, patient results should generally be:", ["Released without review", "Held according to policy until acceptability is restored", "Changed manually to normal", "Ignored because controls are optional"], 1, "Failed QC can invalidate patient results; reporting should follow policy after troubleshooting and acceptability are restored.")],
  },
];

export default { lessons: medicalLaboratoryTechnologistLessons };
