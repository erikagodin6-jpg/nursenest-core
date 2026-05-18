export type MedicalLaboratoryTechnologistFlashcard = {
  id: string;
  deck:
    | "hematology"
    | "blood-bank"
    | "clinical-chemistry"
    | "microbiology"
    | "coagulation"
    | "urinalysis"
    | "quality-control";
  front: string;
  back: string;
  explanation: string;
  difficulty: "intro" | "core" | "exam";
  domain:
    | "hematology"
    | "bloodBank"
    | "chemistry"
    | "microbiology"
    | "coagulation"
    | "urinalysis"
    | "qualityControl";
  alliedProfessionKey: "mlt";
  examTags: Array<"CSMLS" | "ASCP_MLS" | "ASCP_MLT">;
  morphologyTags?: string[];
  workflowTags?: string[];
};

function card(
  id: string,
  deck: MedicalLaboratoryTechnologistFlashcard["deck"],
  domain: MedicalLaboratoryTechnologistFlashcard["domain"],
  difficulty: MedicalLaboratoryTechnologistFlashcard["difficulty"],
  front: string,
  back: string,
  explanation: string,
  morphologyTags: string[] = [],
  workflowTags: string[] = [],
  examTags: MedicalLaboratoryTechnologistFlashcard["examTags"] = ["CSMLS", "ASCP_MLS", "ASCP_MLT"],
): MedicalLaboratoryTechnologistFlashcard {
  return { id, deck, domain, difficulty, front, back, explanation, alliedProfessionKey: "mlt", examTags, morphologyTags, workflowTags };
}

export const medicalLaboratoryTechnologistFlashcards: MedicalLaboratoryTechnologistFlashcard[] = [
  card("mlt-hematology-schistocytes", "hematology", "hematology", "exam", "Schistocytes: major clinical association?", "RBC fragmentation; think MAHA patterns such as DIC, TTP, and HUS.", "Schistocytes are not just morphology trivia. They should trigger fragmentation hemolysis reasoning and timely escalation according to policy.", ["schistocyte", "rbc-fragmentation"], ["smear-review", "escalation"]),
  card("mlt-hematology-spherocytes", "hematology", "hematology", "core", "Spherocytes: two key associations?", "Hereditary spherocytosis and autoimmune hemolytic anemia.", "Spherocytes lack central pallor and should be correlated with hemolysis markers, DAT context, and clinical history.", ["spherocyte"], ["smear-review", "hemolysis-correlation"]),
  card("mlt-hematology-target-cells", "hematology", "hematology", "core", "Target cells commonly correlate with which patterns?", "Hemoglobinopathies, thalassemia, liver disease, and post-splenectomy states.", "Target cells are high-yield because exams often ask learners to distinguish hemoglobinopathy patterns from iron deficiency or artifact.", ["target-cell"], ["morphology-differential"]),
  card("mlt-chemistry-hemolysis-potassium", "clinical-chemistry", "chemistry", "exam", "How can hemolysis affect potassium?", "It may falsely elevate potassium due to release from cells.", "A critically high potassium on a hemolyzed specimen requires specimen integrity review before safe verification or critical value communication.", [], ["specimen-integrity", "critical-value", "result-verification"]),
  card("mlt-chemistry-lipemia", "clinical-chemistry", "chemistry", "core", "Why does lipemia matter in chemistry testing?", "It can interfere with some analytical methods and affect result reliability.", "Lipemia is an analytical interference clue, not a cosmetic specimen issue. The MLS must follow method and site policy.", [], ["analyzer-interference", "result-verification"]),
  card("mlt-blood-bank-antibody-screen", "blood-bank", "bloodBank", "core", "Purpose of an antibody screen?", "Detect unexpected clinically significant RBC antibodies before transfusion.", "A positive screen requires follow-up identification workflow and compatibility planning rather than simple product release.", [], ["antibody-screen", "transfusion-safety"]),
  card("mlt-blood-bank-dat", "blood-bank", "bloodBank", "core", "DAT detects what?", "IgG and/or complement bound to patient red cells in vivo.", "DAT interpretation is used in hemolytic transfusion reaction workups, autoimmune hemolysis contexts, and newborn hemolysis investigations.", [], ["DAT", "transfusion-reaction"]),
  card("mlt-blood-bank-emergency-release", "blood-bank", "bloodBank", "exam", "Emergency uncrossmatched blood requires what kind of reasoning?", "Balancing life-threatening urgency with compatibility risk and escalation policy.", "Blood bank exams often test the safest operational choice under imperfect conditions, not ideal textbook timing.", [], ["emergency-release", "escalation", "inventory"]),
  card("mlt-micro-gram-positive-clusters", "microbiology", "microbiology", "core", "Gram-positive cocci in clusters suggests what initial direction?", "Consider Staphylococcus species and follow source-specific workflow.", "Specimen source determines significance. A sterile-source preliminary result may require urgent communication before final ID.", ["gram-positive-cocci"], ["preliminary-report", "unknown-organism"]),
  card("mlt-micro-contamination", "microbiology", "microbiology", "exam", "Why does specimen source matter in microbiology?", "It changes contamination likelihood and clinical significance.", "The same organism may be clinically urgent in blood but less meaningful in a poor-quality superficial swab.", [], ["specimen-source", "contamination-risk"]),
  card("mlt-coag-underfilled-blue-top", "coagulation", "coagulation", "exam", "Why reject an underfilled blue-top tube?", "Incorrect citrate-to-blood ratio can artifactually alter clotting times.", "Coagulation interpretation starts with specimen validity. A numeric result from an invalid specimen can be unsafe to report.", [], ["specimen-rejection", "coag-validity"]),
  card("mlt-coag-inr-warfarin", "coagulation", "coagulation", "intro", "INR is most closely associated with monitoring which therapy?", "Warfarin.", "INR standardizes PT reporting and is high-yield for anticoagulant monitoring questions.", [], ["anticoagulant-monitoring"]),
  card("mlt-urine-blood-no-rbc", "urinalysis", "urinalysis", "exam", "Positive dipstick blood with few RBCs suggests what correlation?", "Hemoglobinuria, myoglobinuria, lysed RBCs, or specimen handling effects.", "Dipstick and microscopy must be interpreted together. A mismatch is a classic urinalysis reasoning trap.", ["urine-sediment"], ["dipstick-microscopy-correlation"]),
  card("mlt-urine-casts", "urinalysis", "urinalysis", "core", "Casts are evaluated in which urinalysis component?", "Microscopic sediment examination.", "Casts can provide renal localization clues, but interpretation requires specimen freshness and sediment quality.", ["casts"], ["microscopy"]),
  card("mlt-qc-trend", "quality-control", "qualityControl", "exam", "A progressive QC trend high suggests what?", "Systematic drift or method instability requiring troubleshooting.", "QC trends protect patient result reliability. Trend recognition should stop unsafe release until acceptability is restored.", [], ["QC", "systematic-error", "analyzer-troubleshooting"]),
  card("mlt-qc-random-error", "quality-control", "qualityControl", "core", "Random QC error usually suggests what pattern?", "Imprecision or unpredictable variation rather than a consistent directional shift.", "Distinguishing random from systematic error guides the troubleshooting pathway and result-release decision.", [], ["QC", "random-error"]),
];
