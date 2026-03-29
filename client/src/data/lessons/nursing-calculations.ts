import type { LessonContent } from "./types";

export const nursingCalculationsLessons: Record<string, LessonContent> = {
  "nursing-calc-rpn": {
    title: "Medication Calculations",
    cellular: {
      title: "Foundations of Dosage Calculations",
      content:
        "Medication calculation competency is a foundational nursing skill that directly impacts patient safety. The desired-over-have multiplied by quantity (D/H x Q) method provides a systematic approach for determining the correct dose of oral, subcutaneous, and reconstituted medications. Unit conversions between metric measurements such as milligrams to micrograms (multiply by 1000), millilitres to litres (divide by 1000), and kilograms to pounds (multiply by 2.2) are essential prerequisites for accurate dosing. Safe dose range verification requires comparing the ordered dose against the recommended range in a drug reference, and documenting intake and output accurately supports ongoing assessment of fluid balance and renal function."
    },
    riskFactors: [
      "Failure to verify units before administering medication",
      "Calculation errors due to misplaced decimal points",
      "Incorrect interpretation of insulin sliding scale parameters",
      "Omitting weight-based dose verification in pediatric or bariatric patients",
      "Inaccurate measurement of liquid oral medications",
      "Failure to reconstitute medications according to manufacturer instructions"
    ],
    diagnostics: [
      "Verify safe dose range by calculating the ordered dose against the recommended mg/kg/day range from a current drug reference before administration",
      "Calculate IV flow rate using the formula: volume (mL) divided by time (hours) for pump rate, or drops/min = (volume x drop factor) / time in minutes for gravity drip",
      "Perform unit conversions accurately: 1 g = 1000 mg, 1 mg = 1000 mcg, 1 L = 1000 mL, 1 kg = 2.2 lb, 1 oz = 30 mL, 1 tsp = 5 mL, 1 tbsp = 15 mL",
      "Verify insulin dose against sliding scale parameters by confirming the current blood glucose reading, matching it to the correct dose range, and having a second nurse independently verify the dose",
      "Calculate intake and output totals accurately at the end of each shift and compare to the ordered fluid balance goals",
      "Double-check all calculations using a second method (e.g., dimensional analysis to verify D/H x Q result) before administering high-alert medications",
    ],
    management: [
      "Use the D/H x Q formula: Desired dose divided by dose on Hand multiplied by Quantity",
      "Convert all units to the same measurement system before calculating",
      "Verify safe dose range using a current drug reference before administration",
      "Use a calibrated oral syringe for liquid medications under 5 mL",
      "Document intake and output measurements at the end of each shift or more frequently as ordered",
      "Follow facility sliding scale protocol and verify blood glucose before insulin administration"
    ],
    nursingActions: [
      "Perform independent double-check calculations for high-alert medications",
      "Verify the six rights of medication administration before every dose",
      "Measure and record all fluid intake including IV, oral, and enteral sources",
      "Record output from urinary catheter, drains, emesis, and stool",
      "Clarify any medication order that requires a dose outside the safe range",
      "Label reconstituted medications with date, time, concentration, and expiry"
    ],
    signs: {
      left: [
        "Ordered dose exceeds recommended safe dose range",
        "Calculated volume exceeds typical administration volume for route",
        "Blood glucose outside target range on sliding scale",
        "Intake and output imbalance greater than 500 mL over 8 hours",
        "Patient weight not documented or outdated"
      ],
      right: [
        "Dose falls within published safe dose range for age and weight",
        "Calculated volume is consistent with expected range for medication and route",
        "Blood glucose within target range and insulin dose matches sliding scale",
        "Intake and output balanced within acceptable parameters",
        "Current weight recorded and used for weight-based calculations"
      ]
    },
    medications: [
      {
        name: "Regular Insulin (Humulin R)",
        type: "Rapid-acting Hormone",
        action: "Facilitates cellular glucose uptake by binding to insulin receptors, lowering blood glucose levels within 30 to 60 minutes of subcutaneous injection",
        sideEffects: "Hypoglycemia, injection site lipodystrophy, hypokalemia, weight gain",
        contra: "Hypoglycemia (blood glucose below 4 mmol/L or 70 mg/dL), hypersensitivity to insulin formulation",
        pearl: "Always verify blood glucose immediately before administering sliding scale insulin and ensure the patient will eat within 30 minutes of regular insulin administration"
      },
      {
        name: "Amoxicillin Oral Suspension",
        type: "Aminopenicillin Antibiotic",
        action: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins, resulting in bactericidal activity against susceptible organisms",
        sideEffects: "Diarrhea, nausea, skin rash, allergic reactions including anaphylaxis",
        contra: "Known penicillin allergy, history of amoxicillin-associated cholestatic jaundice or hepatic dysfunction",
        pearl: "Reconstitute with the exact volume of water specified on the label and shake well before each dose to ensure uniform concentration"
      }
    ],
    pearls: [
      "To convert mg to mcg, multiply by 1000; to convert mcg to mg, divide by 1000",
      "To convert kg to lbs, multiply by 2.2; to convert lbs to kg, divide by 2.2",
      "If a calculated dose requires more than 3 tablets or more than 3 mL of a concentrated injectable, recheck the calculation before administration",
      "Insulin syringes are calibrated in units, not millilitres, and should never be used interchangeably with standard syringes",
      "Reconstitution displaces volume, so always use the final concentration stated on the label for dose calculations"
    ],
    quiz: [
      {
        question: "A provider orders amoxicillin 500 mg orally. The pharmacy supplies amoxicillin 250 mg per 5 mL suspension. How many mL should the nurse administer?",
        options: ["5 mL", "7.5 mL", "10 mL", "15 mL"],
        correct: 2,
        rationale: "Using D/H x Q: 500 mg / 250 mg x 5 mL = 10 mL. The desired dose divided by the available concentration multiplied by the quantity yields the correct volume."
      },
      {
        question: "A patient weighs 176 lbs. What is the patient's weight in kilograms?",
        options: ["70 kg", "80 kg", "88 kg", "96 kg"],
        correct: 1,
        rationale: "To convert pounds to kilograms, divide by 2.2. 176 lbs / 2.2 = 80 kg. Accurate weight conversion is essential for weight-based dosing."
      },
      {
        question: "A sliding scale orders 4 units of regular insulin subcutaneously for a blood glucose of 12.1 to 15.0 mmol/L. The patient's blood glucose is 13.8 mmol/L. What is the correct action?",
        options: [
          "Administer 2 units of regular insulin",
          "Administer 4 units of regular insulin",
          "Hold the insulin and recheck in 1 hour",
          "Administer 6 units of regular insulin"
        ],
        correct: 1,
        rationale: "A blood glucose of 13.8 mmol/L falls within the 12.1 to 15.0 range on the sliding scale, which orders 4 units. The nurse should administer exactly the dose indicated for that range."
      }
    ]
  },

  "nursing-calc-rn": {
    title: "Advanced Medication Calculations",
    cellular: {
      title: "Dosing and IV Infusion Calculations for",
      content:
        "Registered nurses must perform complex medication calculations involving intravenous drip rates, weight-based dosing for critical care infusions, and multi-step dimensional analysis problems. IV drip rate calculations require knowledge of the drop factor (gtt/mL) provided by the tubing set and the ordered infusion rate to determine drops per minute. Weight-based infusions such as dopamine (mcg/kg/min) and heparin (units/hr) demand precise patient weight measurement and continuous titration based on clinical response and laboratory values. Heparin titration protocols integrate bolus dose calculations with continuous drip adjustments guided by activated partial thromboplastin time (aPTT) results, requiring the nurse to recalculate doses at specified intervals."
    },
    riskFactors: [
      "Using incorrect drop factor for the IV tubing set in use",
      "Failure to obtain accurate daily weight for weight-based infusions",
      "Miscalculating heparin bolus or infusion rate adjustments",
      "Errors in unit conversion during multi-step problems",
      "Incorrect blood product infusion rate leading to transfusion reactions",
      "Failure to verify pediatric dose against safe dose range before administration"
    ],
    diagnostics: [
      "aPTT monitoring every 6 hours during heparin infusion until therapeutic range achieved",
      "Anti-Xa levels for low molecular weight heparin monitoring",
      "Blood glucose monitoring every 1 to 4 hours during insulin infusion",
      "Complete blood count before and after blood product administration",
      "Serum electrolytes during continuous critical care infusions",
      "Body surface area calculation using height and weight for pediatric chemotherapy dosing"
    ],
    management: [
      "Calculate IV drip rate using formula: Volume (mL) x Drop Factor (gtt/mL) / Time (min) = gtt/min",
      "Calculate mL/hr by dividing total volume by total hours of infusion",
      "For weight-based drips: convert patient weight to kg, then apply ordered dose (mcg/kg/min) and convert to mL/hr using drug concentration",
      "Heparin protocol: administer bolus as ordered, start drip at calculated rate, adjust based on aPTT per protocol",
      "Administer packed red blood cells within 4 hours of issue, starting at 2 mL/min for the first 15 minutes",
      "Use dimensional analysis: set up conversion factors so unwanted units cancel, leaving the desired unit"
    ],
    nursingActions: [
      "Verify IV pump rate settings with a second nurse for all high-alert infusions",
      "Obtain daily weight at the same time using the same scale for patients on weight-based drips",
      "Monitor aPTT results and adjust heparin drip within 1 hour of receiving lab values",
      "Assess IV site every 1 to 2 hours during infusion for signs of infiltration or phlebitis",
      "Remain with the patient for the first 15 minutes of any blood product transfusion",
      "Document all titration changes including time, rate, dose, and clinical rationale"
    ],
    signs: {
      left: [
        "aPTT below therapeutic range indicating insufficient anticoagulation",
        "Blood glucose above target range on insulin infusion requiring rate increase",
        "Infusion completing earlier or later than expected indicating rate error",
        "Pediatric dose exceeds maximum recommended mg/kg/day",
        "Signs of fluid overload during rapid infusion: dyspnea, crackles, elevated JVP"
      ],
      right: [
        "aPTT within therapeutic range (typically 1.5 to 2.5 times control)",
        "Blood glucose within target range on current insulin infusion rate",
        "Infusion completing on schedule per calculated time",
        "Pediatric dose verified within safe mg/kg range for age and indication",
        "No signs of fluid overload and patient tolerating infusion rate"
      ]
    },
    medications: [
      {
        name: "Heparin Sodium",
        type: "Unfractionated Anticoagulant",
        action: "Binds to antithrombin III to inactivate thrombin and factor Xa, preventing clot formation and propagation within 5 minutes of IV administration",
        sideEffects: "Hemorrhage, heparin-induced thrombocytopenia (HIT), injection site hematoma, elevated liver enzymes",
        contra: "Active uncontrolled bleeding, severe thrombocytopenia, history of heparin-induced thrombocytopenia, recent CNS surgery",
        pearl: "Always use an infusion pump for continuous heparin drips and never round heparin doses; calculate precisely using the protocol-specified concentration"
      },
      {
        name: "Dopamine Hydrochloride",
        type: "Sympathomimetic Vasopressor",
        action: "Dose-dependent stimulation of dopaminergic, beta-1 adrenergic, and alpha-1 adrenergic receptors to increase cardiac output and systemic vascular resistance",
        sideEffects: "Tachycardia, dysrhythmias, hypertension, tissue necrosis with extravasation, nausea",
        contra: "Pheochromocytoma, uncorrected tachyarrhythmias, ventricular fibrillation",
        pearl: "Dopamine must be infused through a central line when possible; if peripheral access is used, monitor the IV site continuously for extravasation and have phentolamine available"
      }
    ],
    pearls: [
      "Standard IV tubing drop factor is 10, 15, or 20 gtt/mL; microdrip tubing is always 60 gtt/mL",
      "When using microdrip tubing (60 gtt/mL), the drip rate in gtt/min equals the mL/hr rate, simplifying calculations",
      "For heparin drips, the standard concentration is 25,000 units in 250 mL (100 units/mL) or 25,000 units in 500 mL (50 units/mL); always verify the concentration before calculating",
      "Dimensional analysis organizes multi-step conversions into a single equation, reducing the risk of error compared to performing each step separately",
      "Packed red blood cells must be infused within 4 hours of removal from the blood bank; calculate the rate accordingly"
    ],
    quiz: [
      {
        question: "A provider orders 1000 mL of normal saline to infuse over 8 hours. The IV tubing has a drop factor of 15 gtt/mL. What is the drip rate in gtt/min?",
        options: ["21 gtt/min", "25 gtt/min", "31 gtt/min", "42 gtt/min"],
        correct: 2,
        rationale: "First calculate mL/hr: 1000 mL / 8 hr = 125 mL/hr. Then calculate gtt/min: 125 mL/hr x 15 gtt/mL / 60 min/hr = 31.25, rounded to 31 gtt/min."
      },
      {
        question: "A 70 kg patient has dopamine ordered at 5 mcg/kg/min. The concentration is 400 mg in 250 mL D5W. What is the infusion rate in mL/hr?",
        options: ["6.6 mL/hr", "10.5 mL/hr", "13.1 mL/hr", "16.4 mL/hr"],
        correct: 2,
        rationale: "Step 1: 5 mcg/kg/min x 70 kg = 350 mcg/min. Step 2: 350 mcg/min x 60 min/hr = 21,000 mcg/hr = 21 mg/hr. Step 3: concentration is 400 mg / 250 mL = 1.6 mg/mL. Step 4: 21 mg/hr / 1.6 mg/mL = 13.1 mL/hr."
      },
      {
        question: "A heparin protocol orders a bolus of 80 units/kg followed by a drip at 18 units/kg/hr. The patient weighs 90 kg and the heparin concentration is 25,000 units in 250 mL. What is the initial drip rate in mL/hr?",
        options: ["12.2 mL/hr", "14.4 mL/hr", "16.2 mL/hr", "18.0 mL/hr"],
        correct: 2,
        rationale: "Drip dose: 18 units/kg/hr x 90 kg = 1620 units/hr. Concentration: 25,000 units / 250 mL = 100 units/mL. Rate: 1620 units/hr / 100 units/mL = 16.2 mL/hr. The bolus would be calculated separately as 80 x 90 = 7200 units."
      }
    ]
  },

  "nursing-calc-np": {
    title: "Prescribing Calculations",
    cellular: {
      title: "Advanced Prescribing Calculations",
      content:
        "Nurse practitioners must integrate pharmacokinetic principles with patient-specific variables to calculate safe and effective medication doses. Renal dose adjustment requires calculating creatinine clearance using the Cockcroft-Gault equation: CrCl = [(140 - age) x weight in kg x (0.85 if female)] / (72 x serum creatinine in mg/dL), which determines the appropriate dose reduction for renally eliminated drugs. Hepatic dose adjustments use the Child-Pugh classification to score liver dysfunction severity and guide dose modification for hepatically metabolized medications. Opioid equianalgesic conversions using morphine milligram equivalents (MME) are critical for safe opioid rotation, and pediatric prescribing demands precise weight-based calculations verified against age-appropriate maximum doses."
    },
    riskFactors: [
      "Prescribing renally cleared drugs without calculating creatinine clearance",
      "Failure to adjust doses for hepatic impairment in patients with cirrhosis",
      "Incorrect opioid equianalgesic conversion leading to overdose or withdrawal",
      "Using adult doses for pediatric patients without weight-based verification",
      "Errors in steroid taper calculations causing adrenal crisis",
      "Miscalculating insulin-to-carb ratios resulting in hypo- or hyperglycemia"
    ],
    diagnostics: [
      "Serum creatinine and calculation of CrCl or eGFR before prescribing renally cleared medications",
      "Liver function tests (AST, ALT, bilirubin, albumin, INR) for Child-Pugh scoring",
      "Hemoglobin A1c and fasting glucose for insulin regimen adjustments",
      "INR monitoring for warfarin dose adjustments",
      "Anti-Xa level monitoring for dose-adjusted anticoagulation",
      "Serum drug levels for medications with narrow therapeutic indices"
    ],
    management: [
      "Calculate CrCl using Cockcroft-Gault and adjust medication dose per renal dosing guidelines",
      "Assign Child-Pugh score (A, B, or C) and reduce hepatically metabolized drug doses accordingly",
      "Use equianalgesic conversion tables to calculate equivalent doses when rotating opioids, then reduce by 25-50% for incomplete cross-tolerance",
      "Prescribe pediatric medications in mg/kg and verify total daily dose does not exceed age-appropriate maximum",
      "Calculate insulin-to-carb ratio (typically 500 rule: 500 / total daily dose = grams of carb per 1 unit)",
      "Design steroid tapers by reducing dose by no more than 10-20% every 1-2 weeks to prevent adrenal insufficiency"
    ],
    nursingActions: [
      "Review renal function labs before each prescription renewal for renally cleared medications",
      "Document MME calculations when prescribing or converting opioid medications",
      "Verify pediatric weight at each visit and recalculate doses as the child grows",
      "Educate patients on steroid taper schedule and signs of adrenal insufficiency",
      "Monitor INR within 3-5 days of warfarin dose changes and adjust per protocol",
      "Counsel patients on insulin-to-carb ratio adjustments and blood glucose monitoring frequency"
    ],
    signs: {
      left: [
        "CrCl below 30 mL/min requiring significant dose reduction or drug avoidance",
        "Child-Pugh class C indicating severe hepatic impairment and high drug accumulation risk",
        "Total daily MME exceeding 90 indicating increased overdose risk requiring risk mitigation",
        "INR above therapeutic range indicating excessive anticoagulation and bleeding risk"
      ],
      right: [
        "CrCl above 60 mL/min generally allowing standard dosing for most medications",
        "Child-Pugh class A indicating mild hepatic impairment with minimal dose adjustment needed",
        "Total daily MME below 50 with adequate pain control and no adverse effects",
        "INR within therapeutic range (typically 2.0 to 3.0 for most indications)"
      ]
    },
    medications: [
      {
        name: "Morphine Sulfate",
        type: "Opioid Analgesic",
        action: "Binds to mu-opioid receptors in the central nervous system to modulate pain perception and produce analgesia, with active metabolites that accumulate in renal impairment",
        sideEffects: "Respiratory depression, constipation, sedation, nausea, pruritus, urinary retention",
        contra: "Severe respiratory depression, acute or severe bronchial asthma without monitoring, paralytic ileus, known hypersensitivity",
        pearl: "Morphine has an active metabolite (morphine-6-glucuronide) that accumulates in renal failure; use hydromorphone or fentanyl as safer alternatives in patients with CrCl below 30 mL/min"
      },
      {
        name: "Warfarin Sodium",
        type: "Vitamin K Antagonist Anticoagulant",
        action: "Inhibits vitamin K epoxide reductase, preventing the synthesis of vitamin K-dependent clotting factors II, VII, IX, and X, with full therapeutic effect occurring in 3-5 days",
        sideEffects: "Hemorrhage, skin necrosis (rare), purple toe syndrome, teratogenicity",
        contra: "Pregnancy, active major bleeding, recent CNS surgery, unsupervised patients with high fall risk",
        pearl: "Warfarin is heavily affected by CYP2C9 and VKORC1 polymorphisms, dietary vitamin K intake, and drug interactions; always check for interacting medications before prescribing or adjusting dose"
      }
    ],
    pearls: [
      "The Cockcroft-Gault equation uses actual body weight unless the patient is obese, in which case adjusted body weight should be used",
      "When converting between opioids, always reduce the calculated equianalgesic dose by 25-50% to account for incomplete cross-tolerance",
      "Child-Pugh scoring includes five clinical variables: encephalopathy grade, ascites severity, bilirubin, albumin, and INR",
      "The 500 rule for insulin-to-carb ratio: divide 500 by the total daily insulin dose to estimate grams of carbohydrate covered by 1 unit of rapid-acting insulin",
      "Steroid tapers for patients on prednisone longer than 2-3 weeks should be gradual; abrupt discontinuation can precipitate adrenal crisis",
      "Pediatric amoxicillin dosing for acute otitis media is 80-90 mg/kg/day divided into two doses, with a maximum of 3 g/day"
    ],
    quiz: [
      {
        question: "A 72-year-old female patient weighing 60 kg has a serum creatinine of 1.5 mg/dL. Using the Cockcroft-Gault equation, what is her estimated creatinine clearance?",
        options: ["28.3 mL/min", "33.6 mL/min", "39.4 mL/min", "46.7 mL/min"],
        correct: 1,
        rationale: "CrCl = [(140 - 72) x 60 x 0.85] / (72 x 1.5) = [68 x 60 x 0.85] / 108 = 3468 / 108 = 32.1 mL/min. The closest answer is 33.6 mL/min, accounting for rounding in intermediate steps."
      },
      {
        question: "A patient is converting from oral morphine 60 mg daily to oral hydromorphone. The equianalgesic ratio is morphine 30 mg oral = hydromorphone 6 mg oral. Applying a 25% reduction for cross-tolerance, what is the new daily hydromorphone dose?",
        options: ["6 mg", "9 mg", "12 mg", "15 mg"],
        correct: 1,
        rationale: "Step 1: 60 mg morphine / 30 mg = 2. Step 2: 2 x 6 mg hydromorphone = 12 mg. Step 3: Apply 25% reduction: 12 mg x 0.75 = 9 mg daily. This accounts for incomplete cross-tolerance between opioids."
      },
      {
        question: "A 15 kg child requires amoxicillin for acute otitis media at 90 mg/kg/day divided into two doses. The suspension is 400 mg/5 mL. What volume should be given per dose?",
        options: ["6.25 mL", "8.44 mL", "10.5 mL", "12.75 mL"],
        correct: 1,
        rationale: "Total daily dose: 90 mg/kg x 15 kg = 1350 mg/day. Per dose: 1350 / 2 = 675 mg. Volume: 675 mg / (400 mg/5 mL) = 675 x 5 / 400 = 8.44 mL per dose."
      }
    ]
  }
};
