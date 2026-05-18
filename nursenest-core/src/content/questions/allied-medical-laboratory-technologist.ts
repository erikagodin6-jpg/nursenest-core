export type MedicalLaboratoryTechnologistQuestion = {
  id: string;
  stem: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  incorrectRationales: string[];
  domain:
    | "hematology"
    | "bloodBank"
    | "chemistry"
    | "microbiology"
    | "coagulation"
    | "urinalysis"
    | "qualityControl"
    | "workflow";
  difficulty: "intro" | "core" | "exam";
  alliedProfessionKey: "mlt";
  examTags: Array<"CSMLS" | "ASCP_MLS" | "ASCP_MLT">;
  lessonSlug?: string;
  workflowTags?: string[];
};

function q(
  id: string,
  domain: MedicalLaboratoryTechnologistQuestion["domain"],
  difficulty: MedicalLaboratoryTechnologistQuestion["difficulty"],
  stem: string,
  options: string[],
  correctIndex: number,
  rationale: string,
  incorrectRationales: string[],
  lessonSlug?: string,
  workflowTags: string[] = [],
  examTags: MedicalLaboratoryTechnologistQuestion["examTags"] = ["CSMLS", "ASCP_MLS", "ASCP_MLT"],
): MedicalLaboratoryTechnologistQuestion {
  return {
    id,
    stem,
    options,
    correctIndex,
    rationale,
    incorrectRationales,
    domain,
    difficulty,
    alliedProfessionKey: "mlt",
    examTags,
    lessonSlug,
    workflowTags,
  };
}

export const medicalLaboratoryTechnologistQuestions: MedicalLaboratoryTechnologistQuestion[] = [
  q(
    "mlt-heme-schistocyte-escalation",
    "hematology",
    "exam",
    "A smear shows schistocytes with thrombocytopenia and prolonged coagulation studies. What is the most appropriate MLS action?",
    [
      "Ignore the morphology because analyzer counts are available",
      "Correlate findings, follow smear review/escalation policy, and communicate critical concerns appropriately",
      "Release all results without review because morphology is optional",
      "Report hereditary spherocytosis immediately without correlation",
    ],
    1,
    "Schistocytes plus thrombocytopenia and coagulation abnormalities may indicate critical fragmentation hemolysis patterns. The MLS should correlate findings and follow escalation workflow according to policy.",
    [
      "Morphology remains clinically important even with analyzer automation.",
      "Ignoring critical smear findings can delay patient care and violates workflow expectations.",
      "Spherocytes are a different morphology pattern and should not be assumed.",
    ],
    "mlt-hematology-cbc-and-morphology-foundations",
    ["morphology", "critical-escalation", "smear-review"],
  ),
  q(
    "mlt-chemistry-pseudohyperkalemia",
    "chemistry",
    "exam",
    "A specimen is visibly hemolyzed and potassium is critically elevated. Which reasoning is safest?",
    [
      "Treat the value as unquestionably accurate",
      "Consider pseudohyperkalemia and review specimen integrity before verification",
      "Delete the result without documentation",
      "Ignore analyzer hemolysis flags",
    ],
    1,
    "Hemolysis can falsely elevate potassium. MLS professionals should evaluate specimen integrity, analyzer flags, prior trends, and redraw policy before verification.",
    [
      "Hemolysis may invalidate interpretation and requires workflow review.",
      "Critical results require documentation and policy-based handling, not silent deletion.",
      "Analyzer flags are important safety indicators.",
    ],
    "mlt-clinical-chemistry-analyzer-and-interference-reasoning",
    ["specimen-integrity", "critical-value", "verification"],
  ),
  q(
    "mlt-blood-bank-emergency-release",
    "bloodBank",
    "exam",
    "During a trauma activation, antibody identification remains unresolved but blood is urgently needed. What principle best guides MLS reasoning?",
    [
      "Delay all blood until complete antibody workup is finished regardless of patient instability",
      "Balance transfusion urgency with compatibility risk and emergency-release policy",
      "Ignore compatibility concerns during all emergencies",
      "Release blood products without documentation",
    ],
    1,
    "Emergency transfusion workflows require balancing life-threatening urgency with transfusion safety and institutional policy.",
    [
      "Delaying life-saving transfusion indefinitely may be unsafe.",
      "Compatibility and documentation still matter during emergencies.",
      "Emergency release still requires controlled workflow and traceability.",
    ],
    "mlt-blood-bank-and-transfusion-workflow",
    ["transfusion-safety", "emergency-release", "escalation"],
  ),
  q(
    "mlt-micro-preliminary-gram-stain",
    "microbiology",
    "core",
    "A positive blood culture Gram stain shows Gram-positive cocci in clusters. What is the best next reasoning step?",
    [
      "Assume contamination without considering source",
      "Recognize possible Staphylococcus species and follow urgent preliminary reporting workflow",
      "Finalize the culture immediately without further testing",
      "Ignore the Gram stain because susceptibility testing is pending",
    ],
    1,
    "Preliminary Gram stain findings from blood cultures may require urgent communication and workflow escalation before final identification.",
    [
      "Sterile-source cultures require careful significance assessment.",
      "Final identification requires additional testing.",
      "Preliminary findings still matter clinically before susceptibilities are complete.",
    ],
    "mlt-microbiology-culture-and-unknown-identification-workflow",
    ["preliminary-report", "gram-stain", "workflow"],
  ),
  q(
    "mlt-coag-underfilled-tube",
    "coagulation",
    "core",
    "Why should an underfilled citrate tube be rejected according to policy?",
    [
      "The tube color is aesthetically incorrect",
      "Incorrect citrate-to-blood ratio may invalidate clotting results",
      "Coagulation analyzers never require quality specimens",
      "Underfill only affects microbiology testing",
    ],
    1,
    "Incorrect anticoagulant ratio can artifactually prolong clotting studies and make results unsafe to report.",
    [
      "Tube appearance is not the reason for rejection.",
      "Specimen quality is essential for coagulation validity.",
      "Citrate underfill specifically affects coagulation interpretation.",
    ],
    "mlt-coagulation-pt-aptt-inr-and-specimen-validity",
    ["specimen-rejection", "coag-validity"],
  ),
  q(
    "mlt-urinalysis-dipstick-mismatch",
    "urinalysis",
    "exam",
    "A urine dipstick is strongly positive for blood but microscopy shows very few intact RBCs. Which interpretation is most appropriate?",
    [
      "The dipstick must automatically be wrong",
      "Consider hemoglobinuria, myoglobinuria, lysed RBCs, or specimen delay",
      "Report no abnormality because RBC count is low",
      "Assume transfusion incompatibility immediately",
    ],
    1,
    "Dipstick heme detection can remain positive when intact RBCs are absent or lysed. Correlation is required before interpretation.",
    [
      "Dipstick and microscopy mismatches require investigation, not automatic dismissal.",
      "Positive heme findings still matter clinically.",
      "Urinalysis findings alone do not diagnose transfusion reactions.",
    ],
    "mlt-urinalysis-dipstick-microscopy-and-body-fluid-correlation",
    ["dipstick-correlation", "sediment-review"],
  ),
  q(
    "mlt-qc-trend-high",
    "qualityControl",
    "exam",
    "A chemistry control has trended progressively high over several runs. What should the MLS suspect?",
    [
      "Systematic drift requiring troubleshooting",
      "Perfect analyzer performance",
      "No impact on patient testing",
      "An issue affecting only urinalysis",
    ],
    0,
    "A consistent directional trend suggests systematic instability rather than random isolated error.",
    [
      "QC trends indicate instability, not perfect performance.",
      "Patient result validity may be affected until troubleshooting is complete.",
      "The issue is analyzer/QC related rather than limited to urinalysis.",
    ],
    "mlt-quality-control-westgard-and-analyzer-troubleshooting",
    ["QC", "systematic-error", "analyzer-troubleshooting"],
  ),
];
