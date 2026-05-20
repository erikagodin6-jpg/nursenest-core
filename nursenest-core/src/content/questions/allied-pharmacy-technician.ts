export type PharmacyTechnicianQuestion = {
  id: string;
  stem: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  incorrectRationales: string[];
  domain: "workflow" | "calculations" | "pharmacology" | "medicationSafety" | "law" | "compounding";
  difficulty: "intro" | "core" | "exam";
  alliedProfessionKey: "pharmacy-tech";
  examTags: Array<"PTCE" | "ExCPT" | "PEBC">;
  lessonSlug?: string;
};

function q(
  id: string,
  domain: PharmacyTechnicianQuestion["domain"],
  difficulty: PharmacyTechnicianQuestion["difficulty"],
  stem: string,
  options: string[],
  correctIndex: number,
  rationale: string,
  incorrectRationales: string[],
  lessonSlug?: string,
  examTags: PharmacyTechnicianQuestion["examTags"] = ["PTCE", "ExCPT", "PEBC"],
): PharmacyTechnicianQuestion {
  return {
    id,
    stem,
    options,
    correctIndex,
    rationale,
    incorrectRationales,
    domain,
    difficulty,
    alliedProfessionKey: "pharmacy-tech",
    examTags,
    lessonSlug,
  };
}

export const pharmacyTechnicianQuestions: PharmacyTechnicianQuestion[] = [
  q(
    "pharm-tech-workflow-quantity-mismatch",
    "workflow",
    "core",
    "A prescription reads: metformin 1000 mg, take 1 tablet twice daily, quantity 30, refills 5. What is the safest technician action?",
    [
      "Dispense 30 tablets as a 30-day supply",
      "Change the quantity to 60 without clarification",
      "Flag the quantity and days' supply mismatch according to pharmacy policy",
      "Delete the refill information",
    ],
    2,
    "The directions imply 2 tablets per day. Quantity 30 would only provide 15 days. The technician should flag the mismatch for pharmacist or prescriber clarification according to policy rather than guessing intent.",
    [
      "Thirty tablets is not a 30-day supply when the patient takes two tablets daily.",
      "Technicians should not independently change quantity based on assumed intent.",
      "Refill information is not the source of the mismatch and should not be deleted.",
    ],
    "pharm-tech-workflow-and-prescription-interpretation",
  ),
  q(
    "pharm-tech-workflow-lasa-product-selection",
    "workflow",
    "exam",
    "A technician is selecting hydroxyzine from a shelf where hydralazine is stored nearby. Which action best prevents a dispensing error?",
    [
      "Rely on memory because the first few letters match",
      "Verify NDC/product barcode, strength, dosage form, and label details before moving forward",
      "Choose the product with the most similar-looking bottle",
      "Skip verification if the medication is not controlled",
    ],
    1,
    "Hydroxyzine and hydralazine are a look-alike/sound-alike risk. Product verification using barcode/NDC, strength, dosage form, and label checks is the safest action.",
    [
      "Memory is unreliable for LASA medications and should not replace verification.",
      "Bottle appearance can increase error risk and is not a safety check.",
      "LASA risk applies regardless of controlled-substance status.",
    ],
    "pharm-tech-workflow-and-prescription-interpretation",
  ),
  q(
    "pharm-tech-calc-liquid-dose",
    "calculations",
    "core",
    "A suspension contains 250 mg/5 mL. How many mL are needed for a 500 mg dose?",
    ["2.5 mL", "5 mL", "10 mL", "25 mL"],
    2,
    "500 mg is twice 250 mg, so the volume is twice 5 mL: 10 mL.",
    [
      "2.5 mL would contain only 125 mg at this concentration.",
      "5 mL contains 250 mg, not 500 mg.",
      "25 mL would contain 1250 mg at this concentration.",
    ],
    "pharm-tech-dosage-calculation-fundamentals",
  ),
  q(
    "pharm-tech-calc-days-supply",
    "calculations",
    "core",
    "A patient takes 1 tablet by mouth three times daily. How many tablets are required for a 30-day supply?",
    ["30", "60", "90", "120"],
    2,
    "Three times daily means 3 tablets/day. 3 x 30 days = 90 tablets.",
    [
      "30 tablets would cover once daily dosing for 30 days.",
      "60 tablets would cover twice daily dosing for 30 days.",
      "120 tablets would cover four times daily dosing for 30 days.",
    ],
    "pharm-tech-dosage-calculation-fundamentals",
  ),
  q(
    "pharm-tech-calc-mg-mcg",
    "calculations",
    "intro",
    "Convert 0.5 mg to micrograms.",
    ["5 mcg", "50 mcg", "500 mcg", "5000 mcg"],
    2,
    "1 mg = 1000 mcg, so 0.5 mg = 500 mcg.",
    [
      "5 mcg is too small by a factor of 100.",
      "50 mcg is too small by a factor of 10.",
      "5000 mcg is 5 mg, not 0.5 mg.",
    ],
    "pharm-tech-dosage-calculation-fundamentals",
  ),
  q(
    "pharm-tech-pharm-warfarin-class",
    "pharmacology",
    "intro",
    "Warfarin belongs to which medication class?",
    ["Antibiotic", "Anticoagulant", "Antihistamine", "Antacid"],
    1,
    "Warfarin is an anticoagulant and is high-alert because of bleeding risk and interaction potential.",
    [
      "Warfarin is not an antibiotic.",
      "Warfarin is not an antihistamine.",
      "Warfarin is not an antacid.",
    ],
    "pharm-tech-top-200-brand-generic-and-drug-classes",
  ),
  q(
    "pharm-tech-pharm-lisinopril-suffix",
    "pharmacology",
    "core",
    "The suffix -pril commonly identifies which drug class?",
    ["ACE inhibitors", "Beta blockers", "Statins", "Proton pump inhibitors"],
    0,
    "Many ACE inhibitors end in -pril, such as lisinopril, enalapril, and ramipril.",
    [
      "Many beta blockers end in -olol.",
      "Many statins end in -statin.",
      "Many proton pump inhibitors end in -prazole.",
    ],
    "pharm-tech-top-200-brand-generic-and-drug-classes",
  ),
  q(
    "pharm-tech-safety-insulin-u",
    "medicationSafety",
    "exam",
    "A prescription says insulin glargine 10U nightly. What is the concern?",
    [
      "U is an unsafe abbreviation for units",
      "Insulin glargine cannot be given at night",
      "The route is always implied and never needed",
      "There is no need to clarify high-alert medication orders",
    ],
    0,
    "U for units is unsafe because it can be misread as zero or another number. Insulin is high-alert, so unclear notation should be clarified according to policy.",
    [
      "Insulin glargine is commonly administered once daily, including at night when prescribed.",
      "Route and complete directions matter for safe medication use.",
      "High-alert medication orders require careful verification and clarification when unclear.",
    ],
    "pharm-tech-medication-safety-and-error-prevention",
  ),
  q(
    "pharm-tech-safety-leading-zero",
    "medicationSafety",
    "core",
    "Which notation is safest?",
    [".5 mg", "0.5 mg", "1.0 mg", "10.0 mg"],
    1,
    "0.5 mg includes a leading zero, reducing the risk that the decimal point is missed. Trailing zeros should be avoided.",
    [
      ".5 mg lacks a leading zero and can be misread if the decimal is missed.",
      "1.0 mg has a trailing zero and can be misread as 10 mg.",
      "10.0 mg has a trailing zero and can be misread as 100 mg.",
    ],
    "pharm-tech-medication-safety-and-error-prevention",
  ),
  q(
    "pharm-tech-law-privacy-family",
    "law",
    "exam",
    "A patient's sibling asks the technician what medication the patient picked up yesterday. What is the best response?",
    [
      "Provide the medication name because they are family",
      "Provide the medication only if the sibling seems worried",
      "Follow privacy policy and approved verification procedures; escalate if unsure",
      "Post the medication list in the waiting area",
    ],
    2,
    "Medication information is private. The technician should follow privacy policy and approved verification processes and escalate uncertainty.",
    [
      "Family relationship alone does not automatically authorize disclosure.",
      "Concern does not replace privacy requirements.",
      "Public posting would be a serious privacy violation.",
    ],
    "pharm-tech-law-ethics-controlled-substances-and-privacy",
  ),
  q(
    "pharm-tech-law-controlled-substance",
    "law",
    "core",
    "Which workflow area is especially important for controlled substances?",
    ["Decorative shelf placement", "Inventory and documentation", "Skipping verification", "Using only verbal memory"],
    1,
    "Controlled substances require strict inventory, storage, documentation, and policy-based handling.",
    [
      "Shelf appearance is not the core legal control.",
      "Verification should not be skipped.",
      "Memory cannot replace documented controlled-substance workflow.",
    ],
    "pharm-tech-law-ethics-controlled-substances-and-privacy",
  ),
  q(
    "pharm-tech-compounding-first-air",
    "compounding",
    "exam",
    "During sterile compounding, a technician reaches across the critical site and blocks first air. What is the primary concern?",
    ["Insurance rejection", "Sterility/contamination risk", "Brand-generic mismatch", "Days' supply error only"],
    1,
    "Blocking first air can compromise the sterile field and create contamination risk.",
    [
      "This is a compounding safety problem, not an insurance issue.",
      "The issue is aseptic technique, not brand/generic matching.",
      "Days' supply math is unrelated to first air.",
    ],
    "pharm-tech-sterile-and-nonsterile-compounding",
  ),
  q(
    "pharm-tech-compounding-bud",
    "compounding",
    "core",
    "In compounding, BUD stands for:",
    ["Brand use direction", "Beyond-use date", "Billing upload document", "Basic unit dose"],
    1,
    "BUD means beyond-use date and relates to stability, sterility, storage, formulation, and policy requirements.",
    [
      "BUD is not a brand-use direction.",
      "BUD is not a billing upload document.",
      "BUD is not basic unit dose.",
    ],
    "pharm-tech-sterile-and-nonsterile-compounding",
  ),
];

export default { questions: pharmacyTechnicianQuestions };
