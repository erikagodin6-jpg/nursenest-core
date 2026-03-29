export interface MedMathQuestion {
  id: string;
  category: "dosage" | "iv-flow" | "weight-based" | "infusion" | "pediatric";
  statement: string;
  answer: number;
  unit: string;
  formula: string;
  steps: string[];
  rationale: string;
  safetyNote?: string;
}

export const medMathQuestions: MedMathQuestion[] = [
  // ============================================================
  // DOSAGE CALCULATIONS (25 questions)
  // ============================================================
  {
    id: "dos-1",
    category: "dosage",
    statement: "The provider orders Metoprolol 50 mg PO twice daily. Available: Metoprolol 25 mg scored tablets. How many tablets should you administer per dose?",
    answer: 2,
    unit: "tablet(s)",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 50 mg",
      "Available: 25 mg per tablet",
      "Calculation: 50 ÷ 25 × 1 = 2 tablets"
    ],
    rationale: "Metoprolol is a beta-blocker commonly given PO in 25 mg or 50 mg tablets. Giving 2 tablets of 25 mg is a standard clinical scenario."
  },
  {
    id: "dos-2",
    category: "dosage",
    statement: "Order: Furosemide 60 mg PO daily. Available: Furosemide 40 mg scored tablets. How many tablets will you give?",
    answer: 1.5,
    unit: "tablet(s)",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 60 mg",
      "Available: 40 mg per scored tablet",
      "Calculation: 60 ÷ 40 = 1.5 tablets"
    ],
    rationale: "Furosemide (Lasix) is a loop diuretic. The 40 mg tablet is scored, allowing you to split it. 1.5 tablets (one whole + one half) delivers 60 mg."
  },
  {
    id: "dos-3",
    category: "dosage",
    statement: "Order: Amoxicillin 500 mg PO q8h. Available: Amoxicillin 250 mg capsules. How many capsules per dose?",
    answer: 2,
    unit: "capsule(s)",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 500 mg",
      "Available: 250 mg per capsule",
      "Calculation: 500 ÷ 250 = 2 capsules"
    ],
    rationale: "Amoxicillin is a penicillin-type antibiotic. 250 mg and 500 mg capsules are standard. Doubling 250 mg capsules to get 500 mg is routine practice."
  },
  {
    id: "dos-4",
    category: "dosage",
    statement: "Order: Lisinopril 10 mg PO daily. Available: Lisinopril 20 mg scored tablets. How many tablets should you give?",
    answer: 0.5,
    unit: "tablet(s)",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 10 mg",
      "Available: 20 mg per scored tablet",
      "Calculation: 10 ÷ 20 = 0.5 tablet (half a tablet)"
    ],
    rationale: "Lisinopril is an ACE inhibitor. Scored tablets can be split in half. Half of a 20 mg tablet delivers 10 mg."
  },
  {
    id: "dos-5",
    category: "dosage",
    statement: "Order: Prednisone 15 mg PO daily. Available: Prednisone 5 mg tablets. How many tablets?",
    answer: 3,
    unit: "tablet(s)",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 15 mg",
      "Available: 5 mg per tablet",
      "Calculation: 15 ÷ 5 = 3 tablets"
    ],
    rationale: "Prednisone is a corticosteroid commonly prescribed in 5 mg tablets to allow flexible dosing. Three 5 mg tablets gives 15 mg."
  },
  {
    id: "dos-6",
    category: "dosage",
    statement: "Order: Digoxin 0.125 mg PO daily. Available: Digoxin 0.25 mg scored tablets. How many tablets?",
    answer: 0.5,
    unit: "tablet(s)",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 0.125 mg",
      "Available: 0.25 mg per scored tablet",
      "Calculation: 0.125 ÷ 0.25 = 0.5 tablet"
    ],
    rationale: "Digoxin is a cardiac glycoside with a narrow therapeutic index. The 0.125 mg dose is a common maintenance dose, obtained by halving a 0.25 mg scored tablet.",
    safetyNote: "⚠️ Always check apical pulse for 60 seconds before administering digoxin. Hold if HR < 60 bpm and notify the provider."
  },
  {
    id: "dos-7",
    category: "dosage",
    statement: "Order: Morphine 4 mg IV push now. Available: Morphine 10 mg/mL in a prefilled syringe. How many mL will you administer?",
    answer: 0.4,
    unit: "mL",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 4 mg",
      "Available: 10 mg per 1 mL",
      "Calculation: 4 ÷ 10 × 1 = 0.4 mL"
    ],
    rationale: "Morphine is an opioid analgesic. The 10 mg/mL concentration is standard for IV use. 0.4 mL is a reasonable IV push volume.",
    safetyNote: "⚠️ IV morphine should be pushed slowly over 4-5 minutes. Monitor respiratory rate and oxygen saturation."
  },
  {
    id: "dos-8",
    category: "dosage",
    statement: "Order: Ondansetron 4 mg IV q6h PRN nausea. Available: Ondansetron 4 mg/2 mL vial. How many mL per dose?",
    answer: 2,
    unit: "mL",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 4 mg",
      "Available: 4 mg per 2 mL",
      "Calculation: 4 ÷ 4 × 2 = 2 mL"
    ],
    rationale: "Ondansetron (Zofran) is an antiemetic. The 4 mg/2 mL vial is a standard concentration. The entire vial is used for a 4 mg dose."
  },
  {
    id: "dos-9",
    category: "dosage",
    statement: "Order: Ketorolac 15 mg IM now. Available: Ketorolac 30 mg/mL vial. How many mL will you draw up?",
    answer: 0.5,
    unit: "mL",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 15 mg",
      "Available: 30 mg per 1 mL",
      "Calculation: 15 ÷ 30 × 1 = 0.5 mL"
    ],
    rationale: "Ketorolac (Toradol) is an NSAID for moderate to severe pain. 15 mg IM is a standard dose for patients ≥ 65 years or < 50 kg."
  },
  {
    id: "dos-10",
    category: "dosage",
    statement: "Order: Hydromorphone 1 mg IV q3h PRN pain. Available: Hydromorphone 2 mg/mL. How many mL will you administer?",
    answer: 0.5,
    unit: "mL",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 1 mg",
      "Available: 2 mg per 1 mL",
      "Calculation: 1 ÷ 2 × 1 = 0.5 mL"
    ],
    rationale: "Hydromorphone (Dilaudid) is an opioid analgesic 5-7× more potent than morphine. 0.5 mL is a safe, measurable IV volume.",
    safetyNote: "⚠️ Administer slowly over 2-3 minutes. Have naloxone available. Monitor respiratory rate."
  },
  {
    id: "dos-11",
    category: "dosage",
    statement: "Order: Levothyroxine 75 mcg PO daily. Available: Levothyroxine 150 mcg scored tablets. How many tablets?",
    answer: 0.5,
    unit: "tablet(s)",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 75 mcg",
      "Available: 150 mcg per scored tablet",
      "Calculation: 75 ÷ 150 = 0.5 tablet"
    ],
    rationale: "Levothyroxine (Synthroid) is a thyroid replacement hormone. Half of a 150 mcg scored tablet delivers the ordered 75 mcg. Administer on an empty stomach."
  },
  {
    id: "dos-12",
    category: "dosage",
    statement: "Order: Potassium Chloride 40 mEq PO daily. Available: Potassium Chloride 20 mEq tablets. How many tablets per dose?",
    answer: 2,
    unit: "tablet(s)",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 40 mEq",
      "Available: 20 mEq per tablet",
      "Calculation: 40 ÷ 20 = 2 tablets"
    ],
    rationale: "KCl tablets replace potassium lost from diuretic therapy. 40 mEq is a standard daily replacement dose. Administer with a full glass of water and food."
  },
  {
    id: "dos-13",
    category: "dosage",
    statement: "Order: Cephalexin 500 mg PO q6h. Available: Cephalexin oral suspension 250 mg/5 mL. How many mL per dose?",
    answer: 10,
    unit: "mL",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 500 mg",
      "Available: 250 mg per 5 mL",
      "Calculation: (500 ÷ 250) × 5 = 10 mL"
    ],
    rationale: "Cephalexin (Keflex) is a first-generation cephalosporin antibiotic. The liquid formulation is used when patients cannot swallow capsules. 10 mL is a clinically standard volume."
  },
  {
    id: "dos-14",
    category: "dosage",
    statement: "Order: Diphenhydramine 50 mg IM now. Available: Diphenhydramine 50 mg/mL. How many mL will you draw up?",
    answer: 1,
    unit: "mL",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 50 mg",
      "Available: 50 mg per 1 mL",
      "Calculation: 50 ÷ 50 = 1 mL"
    ],
    rationale: "Diphenhydramine (Benadryl) is an antihistamine. A 1 mL IM injection is standard and can be given in the ventrogluteal or deltoid site."
  },
  {
    id: "dos-15",
    category: "dosage",
    statement: "Order: Metformin 1000 mg PO twice daily with meals. Available: Metformin 500 mg tablets. How many tablets per dose?",
    answer: 2,
    unit: "tablet(s)",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 1000 mg",
      "Available: 500 mg per tablet",
      "Calculation: 1000 ÷ 500 = 2 tablets"
    ],
    rationale: "Metformin is a first-line oral antidiabetic. 1000 mg BID is a common therapeutic dose. Two 500 mg tablets is standard practice."
  },
  {
    id: "dos-16",
    category: "dosage",
    statement: "Order: Warfarin 7.5 mg PO daily. Available: Warfarin 5 mg scored tablets. How many tablets?",
    answer: 1.5,
    unit: "tablet(s)",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 7.5 mg",
      "Available: 5 mg per scored tablet",
      "Calculation: 7.5 ÷ 5 = 1.5 tablets"
    ],
    rationale: "Warfarin (Coumadin) is an anticoagulant with dosing adjusted by INR. 1.5 scored tablets is a realistic administration using one whole + one half tablet.",
    safetyNote: "⚠️ Monitor INR regularly. Target INR is typically 2.0-3.0. Watch for signs of bleeding."
  },
  {
    id: "dos-17",
    category: "dosage",
    statement: "Order: Lorazepam 2 mg IV push now for seizure. Available: Lorazepam 4 mg/mL. How many mL?",
    answer: 0.5,
    unit: "mL",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 2 mg",
      "Available: 4 mg per 1 mL",
      "Calculation: 2 ÷ 4 = 0.5 mL"
    ],
    rationale: "Lorazepam (Ativan) is a benzodiazepine used for acute seizures. The 4 mg/mL concentration is standard for IV use. Push slowly at no more than 2 mg/min.",
    safetyNote: "⚠️ Administer no faster than 2 mg/min IV. Monitor respiratory status and have flumazenil available."
  },
  {
    id: "dos-18",
    category: "dosage",
    statement: "Order: Phenytoin 100 mg PO TID. Available: Phenytoin 100 mg capsules. How many capsules per dose?",
    answer: 1,
    unit: "capsule(s)",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 100 mg",
      "Available: 100 mg per capsule",
      "Calculation: 100 ÷ 100 = 1 capsule"
    ],
    rationale: "Phenytoin (Dilantin) is an antiepileptic. 100 mg TID (300 mg/day) is a standard maintenance dose. Capsules should not be crushed or opened."
  },
  {
    id: "dos-19",
    category: "dosage",
    statement: "Order: Enoxaparin 40 mg subQ daily for DVT prophylaxis. Available: Enoxaparin 40 mg/0.4 mL prefilled syringe. How many mL?",
    answer: 0.4,
    unit: "mL",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 40 mg",
      "Available: 40 mg per 0.4 mL",
      "Calculation: the prefilled syringe contains exactly 40 mg in 0.4 mL  -  administer the full syringe"
    ],
    rationale: "Enoxaparin (Lovenox) is a low-molecular-weight heparin for DVT prophylaxis. The 40 mg/0.4 mL prefilled syringe is a standard formulation. Inject into abdominal subcutaneous tissue.",
    safetyNote: "⚠️ Do not expel the air bubble from the prefilled syringe. Inject at a 90° angle into the abdomen."
  },
  {
    id: "dos-20",
    category: "dosage",
    statement: "Order: Amlodipine 10 mg PO daily. Available: Amlodipine 5 mg tablets. How many tablets?",
    answer: 2,
    unit: "tablet(s)",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 10 mg",
      "Available: 5 mg per tablet",
      "Calculation: 10 ÷ 5 = 2 tablets"
    ],
    rationale: "Amlodipine (Norvasc) is a calcium channel blocker for hypertension. 10 mg is the maximum daily dose. Two 5 mg tablets is a standard administration."
  },
  {
    id: "dos-21",
    category: "dosage",
    statement: "Order: Famotidine 20 mg IV q12h. Available: Famotidine 10 mg/mL in a 2 mL vial. How many mL per dose?",
    answer: 2,
    unit: "mL",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 20 mg",
      "Available: 10 mg per 1 mL (20 mg in 2 mL vial)",
      "Calculation: 20 ÷ 10 = 2 mL (the entire vial)"
    ],
    rationale: "Famotidine (Pepcid) is an H2 blocker for stress ulcer prophylaxis. The full 2 mL vial provides the 20 mg dose."
  },
  {
    id: "dos-22",
    category: "dosage",
    statement: "Order: Acetaminophen 650 mg PO q4h PRN pain. Available: Acetaminophen 325 mg tablets. How many tablets per dose?",
    answer: 2,
    unit: "tablet(s)",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 650 mg",
      "Available: 325 mg per tablet",
      "Calculation: 650 ÷ 325 = 2 tablets"
    ],
    rationale: "Acetaminophen (Tylenol) is available in 325 mg and 500 mg tablets. 650 mg is a standard adult dose. Monitor total daily intake (max 3000-4000 mg/day).",
    safetyNote: "⚠️ Total daily acetaminophen should not exceed 3000 mg for older adults or 4000 mg for healthy adults. Check all medication sources."
  },
  {
    id: "dos-23",
    category: "dosage",
    statement: "Order: Dexamethasone 6 mg IV q6h. Available: Dexamethasone 4 mg/mL in a 5 mL vial. How many mL per dose?",
    answer: 1.5,
    unit: "mL",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 6 mg",
      "Available: 4 mg per 1 mL",
      "Calculation: 6 ÷ 4 = 1.5 mL"
    ],
    rationale: "Dexamethasone is a potent corticosteroid used for inflammation, cerebral edema, and as an antiemetic. 1.5 mL from a multi-dose vial is a routine administration."
  },
  {
    id: "dos-24",
    category: "dosage",
    statement: "Order: Haloperidol 2 mg IM now for acute agitation. Available: Haloperidol 5 mg/mL. How many mL?",
    answer: 0.4,
    unit: "mL",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 2 mg",
      "Available: 5 mg per 1 mL",
      "Calculation: 2 ÷ 5 = 0.4 mL"
    ],
    rationale: "Haloperidol (Haldol) is a typical antipsychotic. 2 mg IM is a standard acute dose. 0.4 mL is easily measured with a 1 mL syringe."
  },
  {
    id: "dos-25",
    category: "dosage",
    statement: "Order: Metoclopramide 10 mg IV before chemotherapy. Available: Metoclopramide 5 mg/mL in a 2 mL vial. How many mL?",
    answer: 2,
    unit: "mL",
    formula: "Desired ÷ Have × Quantity",
    steps: [
      "Desired dose: 10 mg",
      "Available: 5 mg per 1 mL (10 mg in 2 mL vial)",
      "Calculation: 10 ÷ 5 = 2 mL (the entire vial)"
    ],
    rationale: "Metoclopramide (Reglan) is a prokinetic antiemetic. The full 2 mL vial delivers the ordered 10 mg dose. Administer IV over 1-2 minutes."
  },

  // ============================================================
  // IV FLOW RATE (20 questions)
  // ============================================================
  {
    id: "iv-1",
    category: "iv-flow",
    statement: "Order: Infuse 1000 mL of 0.9% Normal Saline over 8 hours. Drop factor: 15 gtt/mL. Calculate the drip rate in gtt/min.",
    answer: 31.25,
    unit: "gtt/min",
    formula: "(Volume × Drop Factor) ÷ (Time in minutes)",
    steps: [
      "Volume: 1000 mL",
      "Time: 8 hours = 480 minutes",
      "Drop factor: 15 gtt/mL",
      "Calculation: (1000 × 15) ÷ 480 = 31.25 gtt/min",
      "Round to 31 gtt/min in practice"
    ],
    rationale: "0.9% NS is the most commonly used isotonic crystalloid. An 8-hour infusion at 125 mL/hr is standard maintenance. With macrodrip tubing (15 gtt/mL), the nurse counts drops to set the rate."
  },
  {
    id: "iv-2",
    category: "iv-flow",
    statement: "Order: Infuse 500 mL of Lactated Ringer's over 4 hours using an IV pump. Calculate the pump rate in mL/hr.",
    answer: 125,
    unit: "mL/hr",
    formula: "Volume ÷ Time (hours)",
    steps: [
      "Volume: 500 mL",
      "Time: 4 hours",
      "Calculation: 500 ÷ 4 = 125 mL/hr"
    ],
    rationale: "Lactated Ringer's is an isotonic solution used for fluid resuscitation and maintenance. With an IV pump, you simply divide volume by hours to get the mL/hr rate."
  },
  {
    id: "iv-3",
    category: "iv-flow",
    statement: "Order: Infuse 250 mL of D5W over 2 hours. Drop factor: 60 gtt/mL (microdrip). Calculate the drip rate in gtt/min.",
    answer: 125,
    unit: "gtt/min",
    formula: "With microdrip (60 gtt/mL): gtt/min = mL/hr",
    steps: [
      "Volume: 250 mL over 2 hours",
      "mL/hr: 250 ÷ 2 = 125 mL/hr",
      "With microdrip (60 gtt/mL), gtt/min equals mL/hr",
      "Answer: 125 gtt/min"
    ],
    rationale: "With microdrip tubing (60 gtt/mL), the drip rate in gtt/min is always equal to the mL/hr rate. This is a key shortcut for nursing practice."
  },
  {
    id: "iv-4",
    category: "iv-flow",
    statement: "An IV of 0.9% NS is running at 100 mL/hr. Drop factor: 20 gtt/mL. What is the drip rate in gtt/min?",
    answer: 33.33,
    unit: "gtt/min",
    formula: "(mL/hr × Drop Factor) ÷ 60",
    steps: [
      "Rate: 100 mL/hr",
      "Drop factor: 20 gtt/mL",
      "Calculation: (100 × 20) ÷ 60 = 33.33 gtt/min",
      "Round to 33 gtt/min in practice"
    ],
    rationale: "Converting from pump rate (mL/hr) to manual drip rate requires multiplying by the drop factor and dividing by 60. This is common when a pump is unavailable."
  },
  {
    id: "iv-5",
    category: "iv-flow",
    statement: "An IV is running at 42 gtt/min with a drop factor of 10 gtt/mL. What is the rate in mL/hr?",
    answer: 252,
    unit: "mL/hr",
    formula: "(gtt/min × 60) ÷ Drop Factor",
    steps: [
      "Current rate: 42 gtt/min",
      "Drop factor: 10 gtt/mL",
      "Calculation: (42 × 60) ÷ 10 = 252 mL/hr"
    ],
    rationale: "Reverse-calculating mL/hr from a counted drip rate helps verify that the infusion is running at the correct speed, especially during shift change assessments."
  },
  {
    id: "iv-6",
    category: "iv-flow",
    statement: "Order: Infuse 1000 mL of D5 0.45% NaCl over 10 hours using an IV pump. What rate should you set?",
    answer: 100,
    unit: "mL/hr",
    formula: "Volume ÷ Time (hours)",
    steps: [
      "Volume: 1000 mL",
      "Time: 10 hours",
      "Calculation: 1000 ÷ 10 = 100 mL/hr"
    ],
    rationale: "D5 0.45% NaCl is a hypotonic maintenance fluid. Running 1000 mL over 10 hours provides steady hydration without fluid overload."
  },
  {
    id: "iv-7",
    category: "iv-flow",
    statement: "Order: Infuse 100 mL of 0.9% NS over 30 minutes via IV pump. Calculate the pump rate in mL/hr.",
    answer: 200,
    unit: "mL/hr",
    formula: "(Volume ÷ Time in minutes) × 60",
    steps: [
      "Volume: 100 mL",
      "Time: 30 minutes",
      "Calculation: (100 ÷ 30) × 60 = 200 mL/hr"
    ],
    rationale: "Many IV medications are mixed in 100 mL minibags and infused over 30 minutes. Converting this to mL/hr for the pump requires multiplying by 60 ÷ time in minutes."
  },
  {
    id: "iv-8",
    category: "iv-flow",
    statement: "1000 mL of 0.9% NS was started at 0800 at 125 mL/hr. It is now 1200. How many mL remain?",
    answer: 500,
    unit: "mL",
    formula: "Remaining = Total − (Rate × Hours elapsed)",
    steps: [
      "Total volume: 1000 mL",
      "Time elapsed: 1200 − 0800 = 4 hours",
      "Infused: 125 × 4 = 500 mL",
      "Remaining: 1000 − 500 = 500 mL"
    ],
    rationale: "Calculating remaining volume is part of routine IV assessment. Nurses check how much fluid has infused to verify the rate is correct and anticipate when a new bag is needed."
  },
  {
    id: "iv-9",
    category: "iv-flow",
    statement: "Order: Infuse 500 mL of D5W over 6 hours. Drop factor: 10 gtt/mL. Calculate the drip rate in gtt/min.",
    answer: 13.89,
    unit: "gtt/min",
    formula: "(Volume × Drop Factor) ÷ (Time in minutes)",
    steps: [
      "Volume: 500 mL",
      "Time: 6 hours = 360 minutes",
      "Drop factor: 10 gtt/mL",
      "Calculation: (500 × 10) ÷ 360 = 13.89 gtt/min",
      "Round to 14 gtt/min in practice"
    ],
    rationale: "D5W provides glucose and free water. With a 10 gtt/mL macrodrip set, counting approximately 14 drops per minute achieves the ordered rate."
  },
  {
    id: "iv-10",
    category: "iv-flow",
    statement: "750 mL of Lactated Ringer's is infusing at 150 mL/hr. How many hours will the infusion take to complete?",
    answer: 5,
    unit: "hours",
    formula: "Volume ÷ Rate (mL/hr)",
    steps: [
      "Volume: 750 mL",
      "Rate: 150 mL/hr",
      "Calculation: 750 ÷ 150 = 5 hours"
    ],
    rationale: "Knowing when an infusion will finish helps nurses plan bag changes and manage the patient's IV therapy throughout the shift."
  },
  {
    id: "iv-11",
    category: "iv-flow",
    statement: "Order: Vancomycin 1 g in 250 mL NS to infuse over 90 minutes via IV pump. What rate in mL/hr?",
    answer: 166.67,
    unit: "mL/hr",
    formula: "(Volume ÷ Time in minutes) × 60",
    steps: [
      "Volume: 250 mL",
      "Time: 90 minutes",
      "Calculation: (250 ÷ 90) × 60 = 166.67 mL/hr"
    ],
    rationale: "Vancomycin is an antibiotic infused over at least 60 minutes to prevent Red Man Syndrome. 90-minute infusion for 1 g is standard.",
    safetyNote: "⚠️ Infuse vancomycin over at least 60 minutes. Rapid infusion can cause Red Man Syndrome (flushing, hypotension)."
  },
  {
    id: "iv-12",
    category: "iv-flow",
    statement: "Order: Ceftriaxone 1 g in 50 mL D5W to infuse over 30 minutes via IV pump. What rate?",
    answer: 100,
    unit: "mL/hr",
    formula: "(Volume ÷ Time in minutes) × 60",
    steps: [
      "Volume: 50 mL",
      "Time: 30 minutes",
      "Calculation: (50 ÷ 30) × 60 = 100 mL/hr"
    ],
    rationale: "Ceftriaxone (Rocephin) is a third-generation cephalosporin often mixed in a 50 mL minibag. A 30-minute infusion at 100 mL/hr is standard."
  },
  {
    id: "iv-13",
    category: "iv-flow",
    statement: "Order: Infuse 1000 mL of 0.9% NS over 12 hours. Drop factor: 15 gtt/mL. Calculate gtt/min.",
    answer: 20.83,
    unit: "gtt/min",
    formula: "(Volume × Drop Factor) ÷ (Time in minutes)",
    steps: [
      "Volume: 1000 mL",
      "Time: 12 hours = 720 minutes",
      "Drop factor: 15 gtt/mL",
      "Calculation: (1000 × 15) ÷ 720 = 20.83 gtt/min",
      "Round to 21 gtt/min in practice"
    ],
    rationale: "A 12-hour NS infusion is common overnight or for patients on fluid restriction. Approximately 83 mL/hr is a moderate maintenance rate."
  },
  {
    id: "iv-14",
    category: "iv-flow",
    statement: "A 500 mL bag of D5W was started 3 hours ago at 75 mL/hr. How many hours remain until completion?",
    answer: 3.67,
    unit: "hours",
    formula: "(Total − Infused) ÷ Rate",
    steps: [
      "Total: 500 mL",
      "Infused in 3 hours: 75 × 3 = 225 mL",
      "Remaining: 500 − 225 = 275 mL",
      "Time remaining: 275 ÷ 75 = 3.67 hours (about 3 hours 40 minutes)"
    ],
    rationale: "Calculating remaining infusion time lets nurses anticipate when to hang a new bag and coordinate with other scheduled medications or procedures."
  },
  {
    id: "iv-15",
    category: "iv-flow",
    statement: "Order: Infuse 250 mL of 0.9% NS over 1 hour. Drop factor: 10 gtt/mL. What is the drip rate?",
    answer: 41.67,
    unit: "gtt/min",
    formula: "(Volume × Drop Factor) ÷ (Time in minutes)",
    steps: [
      "Volume: 250 mL",
      "Time: 1 hour = 60 minutes",
      "Drop factor: 10 gtt/mL",
      "Calculation: (250 × 10) ÷ 60 = 41.67 gtt/min",
      "Round to 42 gtt/min in practice"
    ],
    rationale: "Rapid 1-hour infusions are common for fluid boluses. With 10 gtt/mL tubing, counting 42 drops per minute achieves 250 mL/hr."
  },
  {
    id: "iv-16",
    category: "iv-flow",
    statement: "An IV pump is set at 83 mL/hr infusing 0.45% NaCl. The tubing drop factor is 15 gtt/mL. If the pump fails, what manual drip rate should you set?",
    answer: 20.75,
    unit: "gtt/min",
    formula: "(mL/hr × Drop Factor) ÷ 60",
    steps: [
      "Pump rate: 83 mL/hr",
      "Drop factor: 15 gtt/mL",
      "Calculation: (83 × 15) ÷ 60 = 20.75 gtt/min",
      "Round to 21 gtt/min"
    ],
    rationale: "When an IV pump fails, nurses must quickly convert to gravity flow. Knowing this formula is critical for maintaining the correct infusion rate while waiting for a replacement pump."
  },
  {
    id: "iv-17",
    category: "iv-flow",
    statement: "Order: Infuse 1000 mL of Lactated Ringer's over 6 hours using microdrip tubing (60 gtt/mL). Calculate the drip rate in gtt/min.",
    answer: 166.67,
    unit: "gtt/min",
    formula: "With microdrip: gtt/min = mL/hr",
    steps: [
      "mL/hr: 1000 ÷ 6 = 166.67 mL/hr",
      "With microdrip (60 gtt/mL), gtt/min = mL/hr",
      "Answer: 166.67 gtt/min"
    ],
    rationale: "With microdrip tubing, the gtt/min always equals the mL/hr rate. This simplifies calculations but results in a fast drip that can be hard to count manually."
  },
  {
    id: "iv-18",
    category: "iv-flow",
    statement: "Order: Infuse 200 mL of 0.9% NS over 2 hours. Drop factor: 20 gtt/mL. Calculate gtt/min.",
    answer: 33.33,
    unit: "gtt/min",
    formula: "(Volume × Drop Factor) ÷ (Time in minutes)",
    steps: [
      "Volume: 200 mL",
      "Time: 2 hours = 120 minutes",
      "Drop factor: 20 gtt/mL",
      "Calculation: (200 × 20) ÷ 120 = 33.33 gtt/min",
      "Round to 33 gtt/min"
    ],
    rationale: "A 200 mL NS infusion over 2 hours is common for medication piggybacks or small-volume fluid replacement. About 33 drops per minute with 20 gtt/mL tubing."
  },
  {
    id: "iv-19",
    category: "iv-flow",
    statement: "Order: Gentamicin 80 mg in 100 mL D5W to infuse over 60 minutes. Drop factor: 15 gtt/mL. What is the drip rate?",
    answer: 25,
    unit: "gtt/min",
    formula: "(Volume × Drop Factor) ÷ (Time in minutes)",
    steps: [
      "Volume: 100 mL",
      "Time: 60 minutes",
      "Drop factor: 15 gtt/mL",
      "Calculation: (100 × 15) ÷ 60 = 25 gtt/min"
    ],
    rationale: "Gentamicin is an aminoglycoside antibiotic infused over 30-60 minutes. Peak and trough levels should be monitored to prevent nephrotoxicity and ototoxicity.",
    safetyNote: "⚠️ Monitor gentamicin peak and trough levels. Assess renal function (BUN, creatinine) during therapy."
  },
  {
    id: "iv-20",
    category: "iv-flow",
    statement: "A 1000 mL bag of D5 0.45% NaCl is started at 0600 at 100 mL/hr. At what time will the infusion be complete?",
    answer: 10,
    unit: "hours (completion at 1600)",
    formula: "Volume ÷ Rate = Time",
    steps: [
      "Volume: 1000 mL",
      "Rate: 100 mL/hr",
      "Duration: 1000 ÷ 100 = 10 hours",
      "Start: 0600 + 10 hours = 1600 (4:00 PM)"
    ],
    rationale: "Calculating completion time helps plan nursing care. At 100 mL/hr, a 1 L bag will finish at 1600. The day shift nurse should communicate this to the oncoming shift."
  },

  // ============================================================
  // WEIGHT-BASED DOSING (20 questions)
  // ============================================================
  {
    id: "wb-1",
    category: "weight-based",
    statement: "Order: Vancomycin 15 mg/kg IV q12h. Patient weighs 80 kg. What is the dose per administration?",
    answer: 1200,
    unit: "mg",
    formula: "Weight (kg) × Dose per kg",
    steps: [
      "Patient weight: 80 kg",
      "Ordered dose: 15 mg/kg",
      "Calculation: 80 × 15 = 1200 mg"
    ],
    rationale: "Vancomycin is dosed by weight (15-20 mg/kg) to achieve therapeutic trough levels (15-20 mcg/mL for serious infections). 1200 mg for an 80 kg patient is a standard dose."
  },
  {
    id: "wb-2",
    category: "weight-based",
    statement: "Order: Gentamicin 1.5 mg/kg IV q8h. Patient weighs 70 kg. Available: Gentamicin 40 mg/mL. Calculate the dose in mg and the volume in mL.",
    answer: 2.63,
    unit: "mL",
    formula: "Dose = Weight × mg/kg, then Volume = Dose ÷ Concentration",
    steps: [
      "Dose: 70 × 1.5 = 105 mg",
      "Available: 40 mg/mL",
      "Volume: 105 ÷ 40 = 2.63 mL"
    ],
    rationale: "Gentamicin is an aminoglycoside dosed by weight. 105 mg for a 70 kg patient is within the therapeutic range. The volume is drawn up from a multi-dose vial."
  },
  {
    id: "wb-3",
    category: "weight-based",
    statement: "Order: Heparin 80 units/kg IV bolus. Patient weighs 90 kg. What is the bolus dose?",
    answer: 7200,
    unit: "units",
    formula: "Weight × units/kg",
    steps: [
      "Weight: 90 kg",
      "Dose: 90 × 80 = 7200 units"
    ],
    rationale: "The 80 units/kg bolus is part of the standard heparin weight-based protocol for treating acute DVT/PE. After the bolus, a continuous infusion of 18 units/kg/hr typically follows.",
    safetyNote: "⚠️ Heparin is a high-alert medication. Two-nurse independent double-check is required."
  },
  {
    id: "wb-4",
    category: "weight-based",
    statement: "Patient weighs 176 lbs. Order: Enoxaparin 1 mg/kg subQ q12h. Convert weight and calculate the dose. (1 kg = 2.2 lbs)",
    answer: 80,
    unit: "mg",
    formula: "Convert lbs → kg, then Weight × mg/kg",
    steps: [
      "Convert: 176 ÷ 2.2 = 80 kg",
      "Dose: 80 × 1 = 80 mg"
    ],
    rationale: "Enoxaparin (Lovenox) for DVT treatment is dosed at 1 mg/kg q12h. Weight conversion from lbs to kg is the essential first step. 80 mg matches a standard prefilled syringe size."
  },
  {
    id: "wb-5",
    category: "weight-based",
    statement: "Order: Amikacin 7.5 mg/kg IV q12h. Patient weighs 60 kg. Available: Amikacin 250 mg/mL. What volume will you draw up?",
    answer: 1.8,
    unit: "mL",
    formula: "Dose = Weight × mg/kg, then Volume = Dose ÷ Concentration",
    steps: [
      "Dose: 60 × 7.5 = 450 mg",
      "Available: 250 mg/mL",
      "Volume: 450 ÷ 250 = 1.8 mL"
    ],
    rationale: "Amikacin is an aminoglycoside. Weight-based dosing ensures therapeutic levels while minimizing nephrotoxicity and ototoxicity. 1.8 mL is a precise volume requiring careful measurement."
  },
  {
    id: "wb-6",
    category: "weight-based",
    statement: "The maximum safe dose of ibuprofen is 10 mg/kg/dose. A patient weighs 65 kg. The order is for 800 mg. Is the dose safe?",
    answer: 650,
    unit: "mg (max safe dose)",
    formula: "Max dose = Weight × max mg/kg",
    steps: [
      "Maximum safe dose: 65 × 10 = 650 mg",
      "Ordered dose: 800 mg",
      "800 mg > 650 mg: the ordered dose EXCEEDS the safe limit"
    ],
    rationale: "Safe dose verification is a critical nursing skill. Calculating the maximum allowable dose and comparing it to the ordered dose protects the patient from medication errors.",
    safetyNote: "⚠️ The ordered dose (800 mg) exceeds the maximum safe dose (650 mg). Do NOT administer. Notify the prescriber immediately."
  },
  {
    id: "wb-7",
    category: "weight-based",
    statement: "Order: Dopamine 5 mcg/kg/min IV infusion. Patient weighs 75 kg. How many mcg/min should the patient receive?",
    answer: 375,
    unit: "mcg/min",
    formula: "Weight × mcg/kg/min",
    steps: [
      "Weight: 75 kg",
      "Rate: 5 mcg/kg/min",
      "Calculation: 75 × 5 = 375 mcg/min"
    ],
    rationale: "Dopamine is a vasopressor given only IV. At 5 mcg/kg/min, it primarily stimulates beta-1 receptors to increase cardiac output. This is a first step before calculating the pump rate."
  },
  {
    id: "wb-8",
    category: "weight-based",
    statement: "Order: Phenytoin loading dose 15 mg/kg IV. Patient weighs 70 kg. Available: Phenytoin 50 mg/mL. How many mL?",
    answer: 21,
    unit: "mL",
    formula: "Dose = Weight × mg/kg, then Volume = Dose ÷ Concentration",
    steps: [
      "Dose: 70 × 15 = 1050 mg",
      "Available: 50 mg/mL",
      "Volume: 1050 ÷ 50 = 21 mL"
    ],
    rationale: "A phenytoin loading dose of 15-20 mg/kg is used for status epilepticus or new seizure treatment. The large volume (21 mL) is infused IV slowly, not pushed.",
    safetyNote: "⚠️ Infuse phenytoin no faster than 50 mg/min in adults. Monitor ECG and blood pressure during infusion. Use only NS for flushing (precipitates in dextrose)."
  },
  {
    id: "wb-9",
    category: "weight-based",
    statement: "Patient weighs 198 lbs. Order: Cefazolin 25 mg/kg IV. Convert weight and calculate the dose. (1 kg = 2.2 lbs)",
    answer: 2250,
    unit: "mg",
    formula: "Convert lbs → kg, then Weight × mg/kg",
    steps: [
      "Convert: 198 ÷ 2.2 = 90 kg",
      "Dose: 90 × 25 = 2250 mg"
    ],
    rationale: "Cefazolin is a first-generation cephalosporin used for surgical prophylaxis. Weight-based dosing (often 25-30 mg/kg) is recommended for patients over 120 kg, but 2250 mg (≈2 g) is within standard dosing."
  },
  {
    id: "wb-10",
    category: "weight-based",
    statement: "Order: Heparin 18 units/kg/hr continuous IV infusion. Patient weighs 85 kg. What is the hourly dose?",
    answer: 1530,
    unit: "units/hr",
    formula: "Weight × units/kg/hr",
    steps: [
      "Weight: 85 kg",
      "Rate: 18 units/kg/hr",
      "Calculation: 85 × 18 = 1530 units/hr"
    ],
    rationale: "After the heparin bolus, the standard weight-based protocol calls for 18 units/kg/hr as the initial continuous infusion rate. This is adjusted based on PTT/aPTT results.",
    safetyNote: "⚠️ Heparin is a high-alert medication. Monitor aPTT q6h initially. Target is typically 1.5-2.5× control."
  },
  {
    id: "wb-11",
    category: "weight-based",
    statement: "Order: Tobramycin 2 mg/kg IV q8h. Patient weighs 55 kg. What is the dose?",
    answer: 110,
    unit: "mg",
    formula: "Weight × mg/kg",
    steps: [
      "Weight: 55 kg",
      "Dose: 55 × 2 = 110 mg"
    ],
    rationale: "Tobramycin is an aminoglycoside antibiotic. 2 mg/kg per dose is within the standard range. Peak and trough levels must be monitored for efficacy and safety."
  },
  {
    id: "wb-12",
    category: "weight-based",
    statement: "Order: Methotrexate 3.3 mg/kg IV. Patient weighs 60 kg. Available: Methotrexate 25 mg/mL. Calculate the volume.",
    answer: 7.92,
    unit: "mL",
    formula: "Dose = Weight × mg/kg, then Volume = Dose ÷ Concentration",
    steps: [
      "Dose: 60 × 3.3 = 198 mg",
      "Available: 25 mg/mL",
      "Volume: 198 ÷ 25 = 7.92 mL"
    ],
    rationale: "Methotrexate is an antimetabolite used in oncology. Precise weight-based dosing is critical for efficacy and to minimize toxicity. Verify dose with pharmacist before administration."
  },
  {
    id: "wb-13",
    category: "weight-based",
    statement: "Order: Ciprofloxacin 10 mg/kg IV q12h. Patient weighs 72 kg. What is the dose?",
    answer: 720,
    unit: "mg",
    formula: "Weight × mg/kg",
    steps: [
      "Weight: 72 kg",
      "Dose: 72 × 10 = 720 mg"
    ],
    rationale: "Ciprofloxacin is a fluoroquinolone antibiotic. 720 mg is close to the standard 750 mg dose. Weight-based dosing ensures appropriate drug levels."
  },
  {
    id: "wb-14",
    category: "weight-based",
    statement: "Order: Ampicillin 50 mg/kg IV q6h. Patient weighs 68 kg. Available: Ampicillin reconstituted to 250 mg/mL. Calculate the volume.",
    answer: 13.6,
    unit: "mL",
    formula: "Dose = Weight × mg/kg, then Volume = Dose ÷ Concentration",
    steps: [
      "Dose: 68 × 50 = 3400 mg",
      "Available: 250 mg/mL",
      "Volume: 3400 ÷ 250 = 13.6 mL"
    ],
    rationale: "Ampicillin 50 mg/kg q6h is used for serious infections like endocarditis or meningitis. The large volume (13.6 mL) should be further diluted in 50-100 mL and infused IV."
  },
  {
    id: "wb-15",
    category: "weight-based",
    statement: "Order: Methylprednisolone 2 mg/kg IV loading dose. Patient weighs 75 kg. Available: 125 mg/2 mL vial. How many mL?",
    answer: 2.4,
    unit: "mL",
    formula: "Dose = Weight × mg/kg, then Volume = Dose ÷ Concentration",
    steps: [
      "Dose: 75 × 2 = 150 mg",
      "Available: 125 mg per 2 mL = 62.5 mg/mL",
      "Volume: 150 ÷ 62.5 = 2.4 mL"
    ],
    rationale: "Methylprednisolone (Solu-Medrol) is a corticosteroid used for acute inflammatory conditions. Weight-based dosing ensures adequate anti-inflammatory response."
  },
  {
    id: "wb-16",
    category: "weight-based",
    statement: "Patient weighs 154 lbs. Order: Metronidazole 7.5 mg/kg IV q6h. Convert weight and calculate the dose. (1 kg = 2.2 lbs)",
    answer: 525,
    unit: "mg",
    formula: "Convert lbs → kg, then Weight × mg/kg",
    steps: [
      "Convert: 154 ÷ 2.2 = 70 kg",
      "Dose: 70 × 7.5 = 525 mg"
    ],
    rationale: "Metronidazole (Flagyl) is an antibiotic used for anaerobic infections and C. difficile. 525 mg is close to the standard 500 mg dose, confirming appropriate ordering."
  },
  {
    id: "wb-17",
    category: "weight-based",
    statement: "Order: Filgrastim 5 mcg/kg subQ daily. Patient weighs 80 kg. Available: Filgrastim 300 mcg/0.5 mL prefilled syringe. How many mcg is the dose?",
    answer: 400,
    unit: "mcg",
    formula: "Weight × mcg/kg",
    steps: [
      "Weight: 80 kg",
      "Dose: 80 × 5 = 400 mcg"
    ],
    rationale: "Filgrastim (Neupogen) is a colony-stimulating factor used after chemotherapy. The 400 mcg dose would require more than one 300 mcg syringe. Coordinate with pharmacy for proper dose preparation."
  },
  {
    id: "wb-18",
    category: "weight-based",
    statement: "Order: Acyclovir 10 mg/kg IV q8h. Patient weighs 65 kg. What is the dose?",
    answer: 650,
    unit: "mg",
    formula: "Weight × mg/kg",
    steps: [
      "Weight: 65 kg",
      "Dose: 65 × 10 = 650 mg"
    ],
    rationale: "Acyclovir (Zovirax) 10 mg/kg IV q8h is the dose for herpes encephalitis or varicella in immunocompromised patients. Ensure adequate hydration to prevent crystalluria."
  },
  {
    id: "wb-19",
    category: "weight-based",
    statement: "Order: Ceftriaxone 50 mg/kg IV daily (max 2000 mg). Patient weighs 50 kg. What is the dose?",
    answer: 2000,
    unit: "mg",
    formula: "Weight × mg/kg (capped at max dose)",
    steps: [
      "Calculated dose: 50 × 50 = 2500 mg",
      "Maximum dose: 2000 mg",
      "Since 2500 mg > 2000 mg, cap at 2000 mg"
    ],
    rationale: "This question tests the concept of maximum dose limits. Even though the weight-based calculation yields 2500 mg, the maximum single dose is 2000 mg (2 g)."
  },
  {
    id: "wb-20",
    category: "weight-based",
    statement: "Order: Midazolam 0.05 mg/kg IV for moderate sedation. Patient weighs 70 kg. Available: Midazolam 5 mg/mL. How many mL?",
    answer: 0.7,
    unit: "mL",
    formula: "Dose = Weight × mg/kg, then Volume = Dose ÷ Concentration",
    steps: [
      "Dose: 70 × 0.05 = 3.5 mg",
      "Available: 5 mg/mL",
      "Volume: 3.5 ÷ 5 = 0.7 mL"
    ],
    rationale: "Midazolam (Versed) is a benzodiazepine for procedural sedation. 0.05 mg/kg is a standard initial dose. 0.7 mL is precisely measured with a 1 mL syringe.",
    safetyNote: "⚠️ Have flumazenil and resuscitation equipment available. Monitor respiratory status continuously during and after sedation."
  },

  // ============================================================
  // INFUSION / DRIP CALCULATIONS (20 questions)
  // ============================================================
  {
    id: "inf-1",
    category: "infusion",
    statement: "Order: Dopamine 5 mcg/kg/min IV. Patient weighs 80 kg. Available: Dopamine 400 mg in 250 mL D5W. Calculate the IV pump rate in mL/hr.",
    answer: 15,
    unit: "mL/hr",
    formula: "(Weight × mcg/kg/min × 60) ÷ (Concentration in mcg/mL)",
    steps: [
      "mcg/min: 80 × 5 = 400 mcg/min",
      "Concentration: 400 mg / 250 mL = 1.6 mg/mL = 1600 mcg/mL",
      "mL/min: 400 ÷ 1600 = 0.25 mL/min",
      "mL/hr: 0.25 × 60 = 15 mL/hr"
    ],
    rationale: "Dopamine is a vasopressor given ONLY via IV infusion (never PO or IM). At 5 mcg/kg/min, it primarily has inotropic effects (increased cardiac contractility). The 400 mg/250 mL is a standard premixed concentration."
  },
  {
    id: "inf-2",
    category: "infusion",
    statement: "Order: Heparin drip at 1000 units/hr. Available: Heparin 25,000 units in 500 mL NS. Set pump to how many mL/hr?",
    answer: 20,
    unit: "mL/hr",
    formula: "Desired units/hr ÷ (Total units ÷ Total mL)",
    steps: [
      "Concentration: 25,000 units / 500 mL = 50 units/mL",
      "Pump rate: 1000 ÷ 50 = 20 mL/hr"
    ],
    rationale: "Heparin 25,000 units in 500 mL (50 units/mL) is a standard premixed concentration. At 1000 units/hr, the pump rate is 20 mL/hr.",
    safetyNote: "⚠️ Heparin is a high-alert medication. Require independent double-check. Monitor aPTT every 6 hours."
  },
  {
    id: "inf-3",
    category: "infusion",
    statement: "Order: Lidocaine drip at 2 mg/min. Available: Lidocaine 2 g in 500 mL D5W. Calculate the mL/hr rate.",
    answer: 30,
    unit: "mL/hr",
    formula: "(mg/min ÷ Concentration mg/mL) × 60",
    steps: [
      "Rate: 2 mg/min",
      "Concentration: 2000 mg / 500 mL = 4 mg/mL",
      "mL/min: 2 ÷ 4 = 0.5 mL/min",
      "mL/hr: 0.5 × 60 = 30 mL/hr"
    ],
    rationale: "Lidocaine drip (1-4 mg/min) is used for ventricular arrhythmias. 2 g in 500 mL is a standard premixed concentration. The pump rate calculation prevents medication errors."
  },
  {
    id: "inf-4",
    category: "infusion",
    statement: "Order: Regular Insulin drip at 4 units/hr. Available: 100 units Regular Insulin in 100 mL NS. Set the pump rate.",
    answer: 4,
    unit: "mL/hr",
    formula: "Desired units/hr ÷ Concentration (units/mL)",
    steps: [
      "Concentration: 100 units / 100 mL = 1 unit/mL",
      "Pump rate: 4 ÷ 1 = 4 mL/hr"
    ],
    rationale: "The insulin drip concentration of 1 unit/mL (100 units in 100 mL) makes calculations straightforward. At 4 units/hr, the pump rate equals 4 mL/hr.",
    safetyNote: "⚠️ Insulin is a high-alert medication. Check blood glucose every 1-2 hours. Use an infusion pump only."
  },
  {
    id: "inf-5",
    category: "infusion",
    statement: "Order: Nitroglycerin 10 mcg/min IV. Available: Nitroglycerin 50 mg in 250 mL D5W. Calculate mL/hr.",
    answer: 3,
    unit: "mL/hr",
    formula: "(mcg/min ÷ 1000 ÷ mg/mL) × 60",
    steps: [
      "Rate: 10 mcg/min = 0.01 mg/min",
      "Concentration: 50 mg / 250 mL = 0.2 mg/mL",
      "mL/min: 0.01 ÷ 0.2 = 0.05 mL/min",
      "mL/hr: 0.05 × 60 = 3 mL/hr"
    ],
    rationale: "Nitroglycerin is a vasodilator titrated by mcg/min for angina or acute HF. Starting dose is typically 5-10 mcg/min, increased by 5-10 mcg/min every 5 minutes based on BP and symptoms."
  },
  {
    id: "inf-6",
    category: "infusion",
    statement: "Order: Magnesium sulfate 2 g/hr for eclampsia. Available: 40 g in 1000 mL NS. Set the pump rate.",
    answer: 50,
    unit: "mL/hr",
    formula: "(Desired g/hr ÷ Available g) × Volume mL",
    steps: [
      "Desired: 2 g/hr",
      "Concentration: 40 g / 1000 mL = 0.04 g/mL",
      "Pump rate: (2 ÷ 40) × 1000 = 50 mL/hr"
    ],
    rationale: "Magnesium sulfate is used to prevent seizures in preeclampsia/eclampsia. The maintenance dose of 2 g/hr follows a 4-6 g IV loading dose.",
    safetyNote: "⚠️ Monitor deep tendon reflexes, respiratory rate (>12/min), and urine output (>30 mL/hr). Have calcium gluconate at bedside as antidote."
  },
  {
    id: "inf-7",
    category: "infusion",
    statement: "A Dopamine drip is running at 22.5 mL/hr. Concentration: 400 mg in 250 mL D5W. Patient weighs 75 kg. How many mcg/kg/min is the patient receiving?",
    answer: 4,
    unit: "mcg/kg/min",
    formula: "(mL/hr × mg/mL × 1000) ÷ 60 ÷ weight",
    steps: [
      "Concentration: 400 mg / 250 mL = 1.6 mg/mL",
      "mg/hr: 22.5 × 1.6 = 36 mg/hr",
      "mcg/min: (36 × 1000) ÷ 60 = 600 mcg/min",
      "mcg/kg/min: 600 ÷ 75 = 8 mcg/kg/min... wait",
      "Let me recalculate: mg/hr: 22.5 × 1.6 = 36, mcg/min: 36000/60 = 600, per kg: 600/75 = 8"
    ],
    answer: 8,
    rationale: "Reverse-calculating mcg/kg/min from mL/hr is essential for shift change assessments and verifying that the infusion rate matches the ordered dose."
  },
  {
    id: "inf-8",
    category: "infusion",
    statement: "Order: Norepinephrine 0.1 mcg/kg/min IV. Patient weighs 70 kg. Available: Norepinephrine 4 mg in 250 mL D5W. Calculate mL/hr.",
    answer: 26.25,
    unit: "mL/hr",
    formula: "(Weight × mcg/kg/min × 60) ÷ (Concentration in mcg/mL)",
    steps: [
      "mcg/min: 70 × 0.1 = 7 mcg/min",
      "Concentration: 4 mg / 250 mL = 0.016 mg/mL = 16 mcg/mL",
      "mL/min: 7 ÷ 16 = 0.4375 mL/min",
      "mL/hr: 0.4375 × 60 = 26.25 mL/hr"
    ],
    rationale: "Norepinephrine (Levophed) is a first-line vasopressor for septic shock. It is always given IV via central line. Standard concentration is 4 mg/250 mL."
  },
  {
    id: "inf-9",
    category: "infusion",
    statement: "Order: Phenylephrine 100 mcg/min IV. Available: 50 mg in 250 mL NS. Calculate the pump rate.",
    answer: 30,
    unit: "mL/hr",
    formula: "(mcg/min ÷ 1000 ÷ mg/mL) × 60",
    steps: [
      "100 mcg/min = 0.1 mg/min",
      "Concentration: 50 mg / 250 mL = 0.2 mg/mL",
      "mL/min: 0.1 ÷ 0.2 = 0.5 mL/min",
      "mL/hr: 0.5 × 60 = 30 mL/hr"
    ],
    rationale: "Phenylephrine (Neo-Synephrine) is a pure alpha-1 agonist used for hypotension. It is titrated to maintain MAP > 65 mmHg."
  },
  {
    id: "inf-10",
    category: "infusion",
    statement: "Order: Dobutamine 10 mcg/kg/min IV. Patient weighs 65 kg. Available: Dobutamine 250 mg in 250 mL D5W (1000 mcg/mL). Calculate mL/hr.",
    answer: 39,
    unit: "mL/hr",
    formula: "(Weight × mcg/kg/min) ÷ mcg/mL × 60",
    steps: [
      "mcg/min: 65 × 10 = 650 mcg/min",
      "Concentration: 1000 mcg/mL",
      "mL/min: 650 ÷ 1000 = 0.65 mL/min",
      "mL/hr: 0.65 × 60 = 39 mL/hr"
    ],
    rationale: "Dobutamine is a beta-1 agonist used for heart failure with low cardiac output. 10 mcg/kg/min is within the standard range (2.5-20 mcg/kg/min)."
  },
  {
    id: "inf-11",
    category: "infusion",
    statement: "Order: Amiodarone 1 mg/min IV for 6 hours. Available: Amiodarone 450 mg in 250 mL D5W. What pump rate?",
    answer: 33.33,
    unit: "mL/hr",
    formula: "(mg/min × 60) ÷ (mg/mL)",
    steps: [
      "Rate: 1 mg/min = 60 mg/hr",
      "Concentration: 450 mg / 250 mL = 1.8 mg/mL",
      "mL/hr: 60 ÷ 1.8 = 33.33 mL/hr"
    ],
    rationale: "Amiodarone is an antiarrhythmic. After the initial bolus (150 mg/10 min), it infuses at 1 mg/min for 6 hours, then 0.5 mg/min for 18 hours.",
    safetyNote: "⚠️ Use a volumetric pump and non-PVC tubing. Monitor for hypotension and bradycardia. ECG monitoring required."
  },
  {
    id: "inf-12",
    category: "infusion",
    statement: "Order: Vasopressin 0.04 units/min IV for septic shock. Available: Vasopressin 20 units in 100 mL NS. Calculate mL/hr.",
    answer: 12,
    unit: "mL/hr",
    formula: "(units/min × 60) ÷ (units/mL)",
    steps: [
      "Rate: 0.04 units/min",
      "Per hour: 0.04 × 60 = 2.4 units/hr",
      "Concentration: 20 units / 100 mL = 0.2 units/mL",
      "mL/hr: 2.4 ÷ 0.2 = 12 mL/hr"
    ],
    rationale: "Vasopressin at a fixed 0.04 units/min is used as an adjunct vasopressor in septic shock (not titrated). 20 units/100 mL is a standard concentration."
  },
  {
    id: "inf-13",
    category: "infusion",
    statement: "Order: Propofol 50 mcg/kg/min IV for sedation. Patient weighs 80 kg. Available: Propofol 10 mg/mL (1%). Calculate mL/hr.",
    answer: 24,
    unit: "mL/hr",
    formula: "(Weight × mcg/kg/min × 60) ÷ (mcg/mL)",
    steps: [
      "mcg/min: 80 × 50 = 4000 mcg/min",
      "mg/min: 4000 ÷ 1000 = 4 mg/min",
      "mg/hr: 4 × 60 = 240 mg/hr",
      "mL/hr: 240 ÷ 10 = 24 mL/hr"
    ],
    rationale: "Propofol (Diprivan) is used for ICU sedation. It comes as a 1% emulsion (10 mg/mL). 50 mcg/kg/min is a moderate sedation dose. Assess sedation level using RASS or Ramsay scale."
  },
  {
    id: "inf-14",
    category: "infusion",
    statement: "Order: Milrinone 0.375 mcg/kg/min IV. Patient weighs 80 kg. Available: Milrinone 20 mg in 100 mL D5W. Calculate mL/hr.",
    answer: 9,
    unit: "mL/hr",
    formula: "(Weight × mcg/kg/min × 60) ÷ (mcg/mL)",
    steps: [
      "mcg/min: 80 × 0.375 = 30 mcg/min",
      "Concentration: 20 mg/100 mL = 0.2 mg/mL = 200 mcg/mL",
      "mL/min: 30 ÷ 200 = 0.15 mL/min",
      "mL/hr: 0.15 × 60 = 9 mL/hr"
    ],
    rationale: "Milrinone is a phosphodiesterase inhibitor (inodilator) used in acute decompensated heart failure. 0.375 mcg/kg/min is within the standard range (0.375-0.75)."
  },
  {
    id: "inf-15",
    category: "infusion",
    statement: "Order: Epinephrine 0.05 mcg/kg/min IV. Patient weighs 70 kg. Available: Epinephrine 1 mg in 250 mL NS. Calculate mL/hr.",
    answer: 52.5,
    unit: "mL/hr",
    formula: "(Weight × mcg/kg/min × 60) ÷ (mcg/mL)",
    steps: [
      "mcg/min: 70 × 0.05 = 3.5 mcg/min",
      "Concentration: 1 mg / 250 mL = 0.004 mg/mL = 4 mcg/mL",
      "mL/min: 3.5 ÷ 4 = 0.875 mL/min",
      "mL/hr: 0.875 × 60 = 52.5 mL/hr"
    ],
    rationale: "Epinephrine infusion at low doses (0.01-0.1 mcg/kg/min) provides beta-adrenergic effects for cardiogenic shock. Central line access is required."
  },
  {
    id: "inf-16",
    category: "infusion",
    statement: "Order: Heparin 1200 units/hr. Available: 25,000 units in 250 mL D5W. What is the pump rate?",
    answer: 12,
    unit: "mL/hr",
    formula: "Desired units/hr ÷ Concentration (units/mL)",
    steps: [
      "Concentration: 25,000 units / 250 mL = 100 units/mL",
      "Pump rate: 1200 ÷ 100 = 12 mL/hr"
    ],
    rationale: "Heparin 25,000 units in 250 mL (100 units/mL) is another standard premixed concentration. The pump rate calculation must be verified by two nurses."
  },
  {
    id: "inf-17",
    category: "infusion",
    statement: "Order: Dopamine 10 mcg/kg/min IV. Patient weighs 90 kg. Available: 800 mg in 500 mL D5W. Calculate mL/hr.",
    answer: 33.75,
    unit: "mL/hr",
    formula: "(Weight × mcg/kg/min × 60) ÷ (Concentration in mcg/mL)",
    steps: [
      "mcg/min: 90 × 10 = 900 mcg/min",
      "Concentration: 800 mg / 500 mL = 1.6 mg/mL = 1600 mcg/mL",
      "mL/min: 900 ÷ 1600 = 0.5625 mL/min",
      "mL/hr: 0.5625 × 60 = 33.75 mL/hr"
    ],
    rationale: "At 10 mcg/kg/min, dopamine has both beta-1 (cardiac) and alpha (vasopressor) effects. Higher doses (>10) primarily cause vasoconstriction."
  },
  {
    id: "inf-18",
    category: "infusion",
    statement: "Order: Fentanyl 50 mcg/hr IV continuous. Available: Fentanyl 2500 mcg in 250 mL NS. Calculate the pump rate.",
    answer: 5,
    unit: "mL/hr",
    formula: "Desired mcg/hr ÷ Concentration (mcg/mL)",
    steps: [
      "Desired: 50 mcg/hr",
      "Concentration: 2500 mcg / 250 mL = 10 mcg/mL",
      "Pump rate: 50 ÷ 10 = 5 mL/hr"
    ],
    rationale: "Continuous fentanyl infusion is used for ICU analgesia. 50 mcg/hr is a moderate dose. Monitor respiratory status and sedation level.",
    safetyNote: "⚠️ Opioid infusion: monitor respiratory rate, SpO2, and level of consciousness. Have naloxone available."
  },
  {
    id: "inf-19",
    category: "infusion",
    statement: "Order: Nitroglycerin increased from 20 mcg/min to 30 mcg/min. Available: 50 mg in 250 mL D5W. What is the new pump rate?",
    answer: 9,
    unit: "mL/hr",
    formula: "(mcg/min ÷ 1000 ÷ mg/mL) × 60",
    steps: [
      "New rate: 30 mcg/min = 0.03 mg/min",
      "Concentration: 50 mg / 250 mL = 0.2 mg/mL",
      "mL/min: 0.03 ÷ 0.2 = 0.15 mL/min",
      "mL/hr: 0.15 × 60 = 9 mL/hr"
    ],
    rationale: "Nitroglycerin is titrated in increments of 5-10 mcg/min based on blood pressure and symptom response. Recalculating the pump rate after each titration is a critical nursing skill."
  },
  {
    id: "inf-20",
    category: "infusion",
    statement: "Order: Oxytocin (Pitocin) 4 milliunits/min IV. Available: Oxytocin 10 units in 1000 mL LR. Calculate mL/hr.",
    answer: 24,
    unit: "mL/hr",
    formula: "(milliunits/min × 60) ÷ (milliunits/mL)",
    steps: [
      "Rate: 4 milliunits/min",
      "Concentration: 10 units = 10,000 milliunits in 1000 mL = 10 milliunits/mL",
      "mL/min: 4 ÷ 10 = 0.4 mL/min",
      "mL/hr: 0.4 × 60 = 24 mL/hr"
    ],
    rationale: "Oxytocin for labor augmentation is measured in milliunits/min. Starting dose is typically 1-4 milliunits/min, increased every 30-60 minutes. Continuous fetal monitoring is required.",
    safetyNote: "⚠️ Oxytocin is a high-alert medication in obstetrics. Monitor uterine contractions, fetal heart rate, and maternal vitals continuously."
  },

  // ============================================================
  // PEDIATRIC DOSING (20 questions)
  // ============================================================
  {
    id: "ped-1",
    category: "pediatric",
    statement: "Pediatric patient weighing 15 kg has a fever. Order: Acetaminophen 15 mg/kg PO. Available: Acetaminophen 160 mg/5 mL. How many mL per dose?",
    answer: 7.03,
    unit: "mL",
    formula: "(Weight × mg/kg) ÷ Concentration × Volume",
    steps: [
      "Dose: 15 × 15 = 225 mg",
      "Available: 160 mg per 5 mL",
      "Volume: (225 ÷ 160) × 5 = 7.03 mL"
    ],
    rationale: "Acetaminophen (Tylenol) at 15 mg/kg is the standard pediatric antipyretic dose. The 160 mg/5 mL concentration is the standard children's liquid formulation. Max single dose is 1000 mg."
  },
  {
    id: "ped-2",
    category: "pediatric",
    statement: "Child weighing 20 kg. Order: Amoxicillin 25 mg/kg/day divided q12h. Available: Amoxicillin 250 mg/5 mL. How many mL per dose?",
    answer: 5,
    unit: "mL per dose",
    formula: "Daily dose ÷ doses = per dose, then (dose ÷ concentration) × volume",
    steps: [
      "Daily: 20 × 25 = 500 mg/day",
      "Per dose: 500 ÷ 2 = 250 mg",
      "Volume: (250 ÷ 250) × 5 = 5 mL"
    ],
    rationale: "Amoxicillin 25 mg/kg/day divided q12h is the standard dose for mild otitis media. 5 mL is one measured teaspoon, making it easy for parents to administer."
  },
  {
    id: "ped-3",
    category: "pediatric",
    statement: "Infant weighing 6 kg. Order: Ibuprofen 10 mg/kg PO q6h PRN. Available: Infant Ibuprofen 50 mg/1.25 mL. How many mL?",
    answer: 1.5,
    unit: "mL",
    formula: "(Weight × mg/kg) ÷ Concentration × Volume",
    steps: [
      "Dose: 6 × 10 = 60 mg",
      "Available: 50 mg per 1.25 mL",
      "Volume: (60 ÷ 50) × 1.25 = 1.5 mL"
    ],
    rationale: "Ibuprofen (Motrin) at 10 mg/kg is a standard pediatric dose. The infant drops (50 mg/1.25 mL) are more concentrated than children's liquid. Use the calibrated dropper provided."
  },
  {
    id: "ped-4",
    category: "pediatric",
    statement: "Child weighing 25 kg. Order: Azithromycin 10 mg/kg PO on day 1. Available: Azithromycin 200 mg/5 mL. How many mL?",
    answer: 6.25,
    unit: "mL",
    formula: "(Weight × mg/kg) ÷ Concentration × Volume",
    steps: [
      "Dose: 25 × 10 = 250 mg",
      "Available: 200 mg per 5 mL",
      "Volume: (250 ÷ 200) × 5 = 6.25 mL"
    ],
    rationale: "Azithromycin (Zithromax) Z-pack: 10 mg/kg on day 1, then 5 mg/kg on days 2-5. 6.25 mL can be measured with an oral syringe."
  },
  {
    id: "ped-5",
    category: "pediatric",
    statement: "Calculate 24-hour maintenance IV fluids for a child weighing 22 kg using the Holliday-Segar method. What is the hourly rate?",
    answer: 60.83,
    unit: "mL/hr",
    formula: "Holliday-Segar: 100/50/20 rule, then ÷ 24",
    steps: [
      "First 10 kg: 10 × 100 = 1000 mL",
      "Next 10 kg: 10 × 50 = 500 mL",
      "Over 20 kg: 2 × 20 = 40 mL",
      "Total daily: 1000 + 500 + 40 = 1540 mL/day",
      "Hourly: 1540 ÷ 24 = 64.17... let me recalculate",
      "Actually: 1540 ÷ 24 = 64.17 mL/hr"
    ],
    answer: 64.17,
    rationale: "The Holliday-Segar method (4-2-1 rule simplified) calculates pediatric maintenance fluids: 100 mL/kg for first 10 kg, 50 mL/kg for next 10 kg, 20 mL/kg for each additional kg."
  },
  {
    id: "ped-6",
    category: "pediatric",
    statement: "Neonate weighing 3.5 kg. Maintenance IV fluid rate: 4 mL/kg/hr for day 1 of life. Calculate the IV rate.",
    answer: 14,
    unit: "mL/hr",
    formula: "Weight × mL/kg/hr",
    steps: [
      "Weight: 3.5 kg",
      "Rate: 3.5 × 4 = 14 mL/hr"
    ],
    rationale: "Neonatal fluid requirements vary by day of life. Day 1 typically starts at 60-80 mL/kg/day (~3-4 mL/kg/hr). Precise infusion pumps and buretrol sets are mandatory for neonates.",
    safetyNote: "⚠️ Neonatal fluid rates require precision. Always use a volumetric pump. Even small errors can cause fluid overload."
  },
  {
    id: "ped-7",
    category: "pediatric",
    statement: "Child weighing 12 kg. Order: Cefazolin 25 mg/kg IV q8h. Available: Cefazolin reconstituted to 100 mg/mL. How many mL per dose?",
    answer: 3,
    unit: "mL",
    formula: "(Weight × mg/kg) ÷ Concentration",
    steps: [
      "Dose: 12 × 25 = 300 mg",
      "Available: 100 mg/mL",
      "Volume: 300 ÷ 100 = 3 mL"
    ],
    rationale: "Cefazolin is a first-generation cephalosporin used for pediatric surgical prophylaxis and skin infections. 25 mg/kg is a standard pediatric dose."
  },
  {
    id: "ped-8",
    category: "pediatric",
    statement: "Child weighing 30 kg has a fever. Order: Acetaminophen 15 mg/kg PO. Max single dose: 1000 mg. Available: 325 mg tablets. Calculate the dose and number of tablets.",
    answer: 1.38,
    unit: "tablet(s)",
    formula: "Weight × mg/kg (cap at max), then Desired ÷ Have",
    steps: [
      "Dose: 30 × 15 = 450 mg",
      "450 mg is within the 1000 mg max",
      "Tablets: 450 ÷ 325 = 1.38 → round to 1 tablet (325 mg)",
      "Or give 1.5 tablets (487.5 mg) if scored"
    ],
    rationale: "For a 30 kg child, the calculated dose is 450 mg. In practice, you would give either 1 tablet (325 mg, slightly under) or 1.5 scored tablets (487.5 mg), based on provider preference."
  },
  {
    id: "ped-9",
    category: "pediatric",
    statement: "Infant weighing 8 kg. Order: Ondansetron 0.15 mg/kg IV. Available: Ondansetron 2 mg/mL. How many mL?",
    answer: 0.6,
    unit: "mL",
    formula: "(Weight × mg/kg) ÷ Concentration",
    steps: [
      "Dose: 8 × 0.15 = 1.2 mg",
      "Available: 2 mg/mL",
      "Volume: 1.2 ÷ 2 = 0.6 mL"
    ],
    rationale: "Ondansetron (Zofran) 0.15 mg/kg is the standard pediatric antiemetic dose. 0.6 mL is precisely measured with a 1 mL syringe."
  },
  {
    id: "ped-10",
    category: "pediatric",
    statement: "Child weighing 18 kg. Order: Cephalexin 25 mg/kg/day divided q6h. Available: Cephalexin 250 mg/5 mL. How many mL per dose?",
    answer: 4.5,
    unit: "mL per dose",
    formula: "(Daily dose ÷ doses) ÷ concentration × volume",
    steps: [
      "Daily: 18 × 25 = 450 mg/day",
      "Per dose: 450 ÷ 4 = 112.5 mg",
      "Volume: (112.5 ÷ 250) × 5 = 2.25 mL"
    ],
    answer: 2.25,
    rationale: "Cephalexin (Keflex) divided q6h means 4 doses per day. Each dose of 112.5 mg requires 2.25 mL of the suspension, measured with an oral syringe."
  },
  {
    id: "ped-11",
    category: "pediatric",
    statement: "Child weighing 10 kg. Order: Prednisolone 2 mg/kg/day PO in 2 divided doses. Available: Prednisolone 15 mg/5 mL. How many mL per dose?",
    answer: 3.33,
    unit: "mL per dose",
    formula: "(Daily dose ÷ doses) ÷ concentration × volume",
    steps: [
      "Daily: 10 × 2 = 20 mg/day",
      "Per dose: 20 ÷ 2 = 10 mg",
      "Volume: (10 ÷ 15) × 5 = 3.33 mL"
    ],
    rationale: "Prednisolone is a liquid corticosteroid for pediatric patients. 2 mg/kg/day is used for asthma exacerbations and croup. 3.33 mL is measured with an oral syringe."
  },
  {
    id: "ped-12",
    category: "pediatric",
    statement: "Neonate weighing 2.5 kg. Order: Ampicillin 50 mg/kg IV q12h. Available: Ampicillin reconstituted to 100 mg/mL. How many mL?",
    answer: 1.25,
    unit: "mL",
    formula: "(Weight × mg/kg) ÷ Concentration",
    steps: [
      "Dose: 2.5 × 50 = 125 mg",
      "Available: 100 mg/mL",
      "Volume: 125 ÷ 100 = 1.25 mL"
    ],
    rationale: "Ampicillin is a first-line antibiotic for neonatal sepsis (combined with gentamicin). q12h dosing is appropriate for neonates < 7 days old.",
    safetyNote: "⚠️ Neonatal doses are very small. Use a syringe pump. Verify all calculations with a second nurse."
  },
  {
    id: "ped-13",
    category: "pediatric",
    statement: "Child weighing 14 kg. Order: Clindamycin 10 mg/kg IV q8h. Available: Clindamycin 150 mg/mL. How many mL per dose?",
    answer: 0.93,
    unit: "mL",
    formula: "(Weight × mg/kg) ÷ Concentration",
    steps: [
      "Dose: 14 × 10 = 140 mg",
      "Available: 150 mg/mL",
      "Volume: 140 ÷ 150 = 0.93 mL"
    ],
    rationale: "Clindamycin is used for bone and soft tissue infections in penicillin-allergic children. 10 mg/kg q8h is within the standard range (20-40 mg/kg/day)."
  },
  {
    id: "ped-14",
    category: "pediatric",
    statement: "Infant weighing 5 kg. Order: Gentamicin 2.5 mg/kg IV q8h. Available: Gentamicin 10 mg/mL. How many mL?",
    answer: 1.25,
    unit: "mL",
    formula: "(Weight × mg/kg) ÷ Concentration",
    steps: [
      "Dose: 5 × 2.5 = 12.5 mg",
      "Available: 10 mg/mL",
      "Volume: 12.5 ÷ 10 = 1.25 mL"
    ],
    rationale: "Gentamicin in neonates/infants is dosed at 2.5 mg/kg per dose. Peak and trough levels are essential to prevent nephrotoxicity and ototoxicity."
  },
  {
    id: "ped-15",
    category: "pediatric",
    statement: "Child weighing 16 kg. Order: Dexamethasone 0.6 mg/kg IM for croup (max 10 mg). Available: 4 mg/mL. How many mL?",
    answer: 2.4,
    unit: "mL",
    formula: "(Weight × mg/kg) ÷ Concentration",
    steps: [
      "Dose: 16 × 0.6 = 9.6 mg",
      "9.6 mg is within the 10 mg max",
      "Volume: 9.6 ÷ 4 = 2.4 mL"
    ],
    rationale: "Dexamethasone 0.6 mg/kg (single dose, max 10 mg) is the standard treatment for moderate-to-severe croup. IM route is used when the child is unable to take PO."
  },
  {
    id: "ped-16",
    category: "pediatric",
    statement: "Child weighing 22 kg. Order: Ibuprofen 10 mg/kg PO q6h PRN. Available: Children's Ibuprofen 100 mg/5 mL. How many mL?",
    answer: 11,
    unit: "mL",
    formula: "(Weight × mg/kg) ÷ Concentration × Volume",
    steps: [
      "Dose: 22 × 10 = 220 mg",
      "Available: 100 mg per 5 mL",
      "Volume: (220 ÷ 100) × 5 = 11 mL"
    ],
    rationale: "Ibuprofen 10 mg/kg is the standard pediatric dose. Children's liquid (100 mg/5 mL) is less concentrated than infant drops. 11 mL is measured using an oral syringe."
  },
  {
    id: "ped-17",
    category: "pediatric",
    statement: "Neonate weighing 4 kg. Order: Caffeine citrate loading dose 20 mg/kg PO. Available: Caffeine citrate 20 mg/mL. How many mL?",
    answer: 4,
    unit: "mL",
    formula: "(Weight × mg/kg) ÷ Concentration",
    steps: [
      "Dose: 4 × 20 = 80 mg",
      "Available: 20 mg/mL",
      "Volume: 80 ÷ 20 = 4 mL"
    ],
    rationale: "Caffeine citrate is used for apnea of prematurity. The loading dose is 20 mg/kg, followed by maintenance of 5 mg/kg/day. Note: caffeine citrate 20 mg = caffeine base 10 mg.",
    safetyNote: "⚠️ Do not confuse caffeine citrate with caffeine base. Verify the formulation to avoid a dosing error."
  },
  {
    id: "ped-18",
    category: "pediatric",
    statement: "Child weighing 28 kg. Order: Fluconazole 6 mg/kg IV daily. Available: Fluconazole 2 mg/mL in 100 mL premixed bag. How many mg is the dose?",
    answer: 168,
    unit: "mg",
    formula: "Weight × mg/kg",
    steps: [
      "Weight: 28 kg",
      "Dose: 28 × 6 = 168 mg"
    ],
    rationale: "Fluconazole 6 mg/kg is used for invasive fungal infections in children. The pharmacy would prepare the appropriate volume from the 2 mg/mL solution (168 ÷ 2 = 84 mL to infuse)."
  },
  {
    id: "ped-19",
    category: "pediatric",
    statement: "Child weighing 8 kg, height 70 cm. Calculate BSA using the Mosteller formula: BSA = √(height cm × weight kg ÷ 3600). Then calculate the dose if the order is Methotrexate 12 mg/m².",
    answer: 4.73,
    unit: "mg",
    formula: "BSA = √(H × W ÷ 3600), then Dose = BSA × mg/m²",
    steps: [
      "BSA: √(70 × 8 ÷ 3600) = √(0.1556) = 0.394 m²",
      "Dose: 0.394 × 12 = 4.73 mg"
    ],
    rationale: "BSA-based dosing is used for chemotherapy agents in pediatric oncology. The Mosteller formula is the most commonly used method. This ensures dosing accuracy adjusted for body size."
  },
  {
    id: "ped-20",
    category: "pediatric",
    statement: "Calculate 24-hour maintenance IV fluids for a 7 kg infant using the Holliday-Segar method. What is the hourly rate?",
    answer: 29.17,
    unit: "mL/hr",
    formula: "Holliday-Segar: 100 mL/kg for first 10 kg, then ÷ 24",
    steps: [
      "Weight: 7 kg (all within first 10 kg bracket)",
      "Daily: 7 × 100 = 700 mL/day",
      "Hourly: 700 ÷ 24 = 29.17 mL/hr"
    ],
    rationale: "For infants under 10 kg, the Holliday-Segar method is simply 100 mL/kg/day. This translates to about 4 mL/kg/hr as a quick estimate."
  },
];
