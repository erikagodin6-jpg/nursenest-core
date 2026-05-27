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
    [
      "Draw 2.5 mL after dividing both the dose and concentration",
      "Draw 5 mL because the label lists 250 mg per 5 mL",
      "Draw 10 mL because 500 mg is twice the labeled 250 mg dose",
      "Draw 25 mL after multiplying 5 mL by the 5 in 500 mg",
    ],
    2,
    "500 mg is twice 250 mg, so the volume is twice 5 mL: 10 mL.",
    [
      "This reverses the proportion; 2.5 mL would contain only 125 mg at this concentration.",
      "This copies the label volume without adjusting for the requested 500 mg dose.",
      "This multiplies unrelated numbers and would provide 1250 mg, creating a major dose error.",
    ],
    "pharm-tech-dosage-calculation-fundamentals",
  ),
  q(
    "pharm-tech-calc-days-supply",
    "calculations",
    "core",
    "A patient takes 1 tablet by mouth three times daily. How many tablets are required for a 30-day supply?",
    [
      "Enter 30 tablets by matching the tablet count to the number of days",
      "Enter 60 tablets by treating three times daily as twice daily",
      "Enter 90 tablets because 3 tablets daily for 30 days are needed",
      "Enter 120 tablets by adding an extra daily dose for safety stock",
    ],
    2,
    "Three times daily means 3 tablets/day. 3 x 30 days = 90 tablets.",
    [
      "This misses the three-times-daily direction and would only cover once-daily use.",
      "This is a common BID/TID mix-up and would leave the patient short by 30 tablets.",
      "This adds an unauthorized extra dose and overstates the quantity needed for the directions.",
    ],
    "pharm-tech-dosage-calculation-fundamentals",
  ),
  q(
    "pharm-tech-calc-mg-mcg",
    "calculations",
    "intro",
    "Convert 0.5 mg to micrograms.",
    [
      "Record 5 mcg after moving the decimal one place",
      "Record 50 mcg after moving the decimal two places",
      "Record 500 mcg because 1 mg equals 1000 mcg",
      "Record 5000 mcg after multiplying by 10,000",
    ],
    2,
    "1 mg = 1000 mcg, so 0.5 mg = 500 mcg.",
    [
      "This under-converts milligrams to micrograms and creates a 100-fold low result.",
      "This uses the wrong conversion factor and produces a 10-fold low result.",
      "This over-converts the dose; 5000 mcg equals 5 mg, not 0.5 mg.",
    ],
    "pharm-tech-dosage-calculation-fundamentals",
  ),
  q(
    "pharm-tech-pharm-warfarin-class",
    "pharmacology",
    "intro",
    "Warfarin belongs to which medication class?",
    [
      "Antibiotic used to treat bacterial infections",
      "Anticoagulant used to reduce clot formation",
      "Antihistamine used for allergy symptoms",
      "Antacid used to neutralize stomach acid",
    ],
    1,
    "Warfarin is an anticoagulant and is high-alert because of bleeding risk and interaction potential.",
    [
      "This confuses medication classes; antibiotics treat infection and do not describe warfarin's bleeding-risk monitoring.",
      "This distractor may sound familiar from allergy products, but it does not match warfarin's clot-prevention purpose.",
      "This focuses on gastrointestinal acid control rather than anticoagulation and INR-related safety checks.",
    ],
    "pharm-tech-top-200-brand-generic-and-drug-classes",
  ),
  q(
    "pharm-tech-pharm-lisinopril-suffix",
    "pharmacology",
    "core",
    "The suffix -pril commonly identifies which drug class?",
    [
      "ACE inhibitors such as lisinopril or ramipril",
      "Beta blockers such as metoprolol or atenolol",
      "Statins such as atorvastatin or rosuvastatin",
      "Proton pump inhibitors such as omeprazole or pantoprazole",
    ],
    0,
    "Many ACE inhibitors end in -pril, such as lisinopril, enalapril, and ramipril.",
    [
      "This is a plausible cardiovascular distractor, but beta blockers are commonly recognized by the -olol suffix.",
      "This confuses common chronic-disease drugs; statins usually use the -statin naming pattern.",
      "This selects an acid-suppression class; proton pump inhibitors often end in -prazole.",
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
    [
      "Use .5 mg because the leading zero is optional",
      "Use 0.5 mg because the leading zero prevents decimal misreading",
      "Use 1.0 mg because the trailing zero makes the dose look precise",
      "Use 10.0 mg because trailing zeros improve consistency",
    ],
    1,
    "0.5 mg includes a leading zero, reducing the risk that the decimal point is missed. Trailing zeros should be avoided.",
    [
      "This is a common shortcut, but omitting the leading zero can turn .5 mg into a misread 5 mg dose.",
      "This includes an unsafe trailing zero that can be misread as 10 mg if the decimal is missed.",
      "This repeats the trailing-zero hazard and could be misread as a much larger dose.",
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
    [
      "Brand use direction listed for a manufactured product",
      "Beyond-use date assigned from stability, sterility, storage, and policy",
      "Billing upload document used during third-party claim processing",
      "Basic unit dose selected for routine inventory counting",
    ],
    1,
    "BUD means beyond-use date and relates to stability, sterility, storage, formulation, and policy requirements.",
    [
      "This sounds workflow-related, but brand directions are not the compounding dating control.",
      "This confuses billing workflow with the safety dating assigned to a compounded preparation.",
      "This uses inventory language, but BUD is about preparation stability, sterility, and storage limits.",
    ],
    "pharm-tech-sterile-and-nonsterile-compounding",
  ),
];

export default { questions: pharmacyTechnicianQuestions };
