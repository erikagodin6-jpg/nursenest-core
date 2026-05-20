import type { CareerQuestion } from "./rrt-questions";

export const mltQuestionsBatch3: CareerQuestion[] = [
  {
    id: "mlt-batch-001",
    stem: "A fasting glucose level of 130 mg/dL is obtained on two separate occasions. This result is most consistent with:",
    options: ["Normal glucose metabolism", "Diabetes mellitus", "Impaired fasting glucose", "Hypoglycemia"],
    correctIndex: 1,
    rationale: "Fasting glucose ≥126 mg/dL on two separate occasions meets the diagnostic criteria for diabetes mellitus per ADA guidelines. Impaired fasting glucose is 100-125 mg/dL. Normal fasting glucose is <100 mg/dL.",
    difficulty: 5,
    category: "Clinical Chemistry",
    topic: "glucose metabolism"
  },
  {
    id: "mlt-batch-002",
    stem: "Which specimen type is preferred for most routine chemistry analyses?",
    options: ["Whole blood", "Serum", "Plasma", "Urine"],
    correctIndex: 1,
    rationale: "Serum is the preferred specimen for most routine chemistry tests. It is obtained from a clotted blood sample after centrifugation. Plasma contains fibrinogen and other clotting factors that may interfere with some assays.",
    difficulty: 5,
    category: "Clinical Chemistry",
    topic: "specimen collection"
  },
  {
    id: "mlt-batch-003",
    stem: "A patient has the following results: BUN 45 mg/dL, creatinine 4.5 mg/dL. The BUN/creatinine ratio is 10:1. This pattern is most consistent with:",
    options: ["Prerenal azotemia", "Intrinsic renal disease", "Postrenal obstruction", "Dehydration"],
    correctIndex: 1,
    rationale: "A BUN/creatinine ratio of 10:1 with both values elevated suggests intrinsic renal disease. Prerenal azotemia typically shows a ratio >20:1 due to increased urea reabsorption. Postrenal obstruction can also show elevated values but typically has a higher ratio.",
    difficulty: 4,
    category: "Clinical Chemistry",
    topic: "renal function"
  },
  {
    id: "mlt-batch-004",
    stem: "Which enzyme is most specific for hepatocellular damage?",
    options: ["Alkaline phosphatase (ALP)", "Alanine aminotransferase (ALT)", "Gamma-glutamyl transferase (GGT)", "Lactate dehydrogenase (LDH)"],
    correctIndex: 1,
    rationale: "ALT is the most specific marker for hepatocellular damage because it is found predominantly in the liver. AST is found in liver, heart, skeletal muscle, and other tissues. ALP and GGT are more specific for cholestatic disease.",
    difficulty: 5,
    category: "Clinical Chemistry",
    topic: "liver function tests"
  },
  {
    id: "mlt-batch-005",
    stem: "A patient's serum potassium is reported as 7.2 mEq/L. Before reporting this critical value, the technologist should first:",
    options: ["Immediately call the physician", "Check the specimen for hemolysis", "Repeat the test on a new instrument", "Verify the patient's identity"],
    correctIndex: 1,
    rationale: "Hemolysis is the most common preanalytical cause of falsely elevated potassium. RBCs contain high intracellular potassium, and lysis releases it into the serum. The specimen should be visually inspected or checked with a hemolysis index before reporting.",
    difficulty: 4,
    category: "Clinical Chemistry",
    topic: "electrolytes"
  },
  {
    id: "mlt-batch-006",
    stem: "Which lipoprotein fraction carries the highest percentage of cholesterol?",
    options: ["VLDL", "LDL", "HDL", "Chylomicrons"],
    correctIndex: 1,
    rationale: "LDL carries approximately 60-70% of total serum cholesterol. LDL is considered 'bad' cholesterol because elevated levels are associated with increased risk of atherosclerosis and cardiovascular disease.",
    difficulty: 5,
    category: "Clinical Chemistry",
    topic: "lipid metabolism"
  },
  {
    id: "mlt-batch-007",
    stem: "A patient has the following arterial blood gas results: pH 7.28, pCO2 55 mmHg, HCO3 26 mEq/L. This is consistent with:",
    options: ["Metabolic acidosis", "Respiratory acidosis", "Metabolic alkalosis", "Respiratory alkalosis"],
    correctIndex: 1,
    rationale: "Low pH (acidosis) with elevated pCO2 and near-normal HCO3 indicates uncompensated respiratory acidosis. The primary disturbance is CO2 retention. The kidneys have not yet compensated by retaining bicarbonate.",
    difficulty: 4,
    category: "Clinical Chemistry",
    topic: "blood gases"
  },
  {
    id: "mlt-batch-008",
    stem: "Troponin I is elevated in a patient presenting with chest pain. This biomarker is most specific for:",
    options: ["Skeletal muscle injury", "Myocardial infarction", "Pulmonary embolism", "Hepatic damage"],
    correctIndex: 1,
    rationale: "Troponin I is highly specific for myocardial injury and is the preferred biomarker for diagnosing acute myocardial infarction. It rises within 3-6 hours and remains elevated for 7-14 days. CK-MB is less specific than troponin.",
    difficulty: 5,
    category: "Clinical Chemistry",
    topic: "cardiac biomarkers"
  },
  {
    id: "mlt-batch-009",
    stem: "A patient's total calcium is 8.0 mg/dL and albumin is 2.0 g/dL. The corrected calcium is:",
    options: ["8.0 mg/dL", "9.6 mg/dL", "10.0 mg/dL", "7.2 mg/dL"],
    correctIndex: 1,
    rationale: "Corrected calcium = measured calcium + 0.8 × (4.0 − albumin). So: 8.0 + 0.8 × (4.0 − 2.0) = 8.0 + 1.6 = 9.6 mg/dL. This correction accounts for the decrease in protein-bound calcium when albumin is low.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "calcium metabolism"
  },
  {
    id: "mlt-batch-010",
    stem: "Which of the following is the primary buffer system in blood?",
    options: ["Phosphate buffer system", "Bicarbonate/carbonic acid buffer system", "Protein buffer system", "Hemoglobin buffer system"],
    correctIndex: 1,
    rationale: "The bicarbonate/carbonic acid (HCO3−/H2CO3) buffer system is the most important extracellular buffer in blood. It accounts for about 53% of total blood buffering capacity and is regulated by both the lungs (CO2) and kidneys (HCO3−).",
    difficulty: 5,
    category: "Clinical Chemistry",
    topic: "acid-base balance"
  },
  {
    id: "mlt-batch-011",
    stem: "An elevated amylase and lipase with lipase being more than three times the upper limit of normal is most indicative of:",
    options: ["Hepatitis", "Acute pancreatitis", "Cholecystitis", "Peptic ulcer disease"],
    correctIndex: 1,
    rationale: "Lipase is more specific and stays elevated longer than amylase for acute pancreatitis. Lipase >3× the upper limit of normal is highly suggestive. Amylase can also be elevated in parotitis, renal failure, and macroamylasemia.",
    difficulty: 4,
    category: "Clinical Chemistry",
    topic: "pancreatic enzymes"
  },
  {
    id: "mlt-batch-012",
    stem: "A hemoglobin A1c of 8.5% corresponds to an estimated average glucose (eAG) of approximately:",
    options: ["126 mg/dL", "154 mg/dL", "197 mg/dL", "240 mg/dL"],
    correctIndex: 2,
    rationale: "HbA1c of 8.5% corresponds to an eAG of approximately 197 mg/dL using the formula eAG = 28.7 × A1c − 46.7. HbA1c reflects average blood glucose over the preceding 2-3 months based on the lifespan of red blood cells.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "glycated hemoglobin"
  },
  {
    id: "mlt-batch-013",
    stem: "A serum protein electrophoresis shows a monoclonal spike (M-spike) in the gamma region. This finding is most consistent with:",
    options: ["Chronic inflammation", "Multiple myeloma", "Nephrotic syndrome", "Liver cirrhosis"],
    correctIndex: 1,
    rationale: "A monoclonal spike in the gamma region indicates a single clone of plasma cells producing one type of immunoglobulin, characteristic of multiple myeloma or other monoclonal gammopathies. Polyclonal gammopathy (broad increase) is seen in chronic inflammation and infection.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "protein electrophoresis"
  },
  {
    id: "mlt-batch-014",
    stem: "Which electrolyte imbalance is most commonly associated with prolonged vomiting?",
    options: ["Hyperkalemia", "Hypokalemia and metabolic alkalosis", "Hypernatremia", "Metabolic acidosis"],
    correctIndex: 1,
    rationale: "Prolonged vomiting causes loss of HCl from the stomach, leading to metabolic alkalosis. Potassium is also lost in gastric fluid, and the kidneys excrete more potassium to retain hydrogen ions, worsening hypokalemia.",
    difficulty: 4,
    category: "Clinical Chemistry",
    topic: "electrolyte disorders"
  },
  {
    id: "mlt-batch-015",
    stem: "The Jaffe reaction is used to measure which analyte?",
    options: ["Urea nitrogen", "Creatinine", "Uric acid", "Ammonia"],
    correctIndex: 1,
    rationale: "The Jaffe reaction involves creatinine reacting with alkaline picrate to form a red-orange chromogen. It is the classic colorimetric method for serum creatinine measurement, though enzymatic methods are now preferred for greater specificity.",
    difficulty: 4,
    category: "Clinical Chemistry",
    topic: "analytical methods"
  },
  {
    id: "mlt-batch-016",
    stem: "A patient's CSF glucose is 25 mg/dL with a simultaneous serum glucose of 100 mg/dL. The CSF/serum glucose ratio is most consistent with:",
    options: ["Normal CSF", "Bacterial meningitis", "Viral meningitis", "Multiple sclerosis"],
    correctIndex: 1,
    rationale: "Normal CSF glucose is 60-70% of serum glucose. A CSF/serum ratio of 0.25 (25/100) is markedly decreased, which is characteristic of bacterial meningitis. Bacteria metabolize glucose in the CSF. Viral meningitis typically shows normal glucose.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "cerebrospinal fluid analysis"
  },
  {
    id: "mlt-batch-017",
    stem: "Ion-selective electrodes (ISE) are used to measure which group of analytes?",
    options: ["Enzymes", "Electrolytes (Na+, K+, Cl−)", "Lipids", "Proteins"],
    correctIndex: 1,
    rationale: "Ion-selective electrodes use selective membranes that respond to specific ions. They are the standard method for measuring electrolytes including sodium, potassium, chloride, pH, ionized calcium, and lithium.",
    difficulty: 5,
    category: "Clinical Chemistry",
    topic: "instrumentation"
  },
  {
    id: "mlt-batch-018",
    stem: "A patient has elevated total bilirubin with predominantly direct (conjugated) bilirubin. This pattern is most suggestive of:",
    options: ["Hemolytic anemia", "Obstructive jaundice", "Gilbert syndrome", "Neonatal physiologic jaundice"],
    correctIndex: 1,
    rationale: "Elevated direct (conjugated) bilirubin indicates the liver has conjugated the bilirubin but it cannot be excreted, suggesting obstruction of the biliary system. Hemolytic anemia and Gilbert syndrome cause predominantly indirect (unconjugated) hyperbilirubinemia.",
    difficulty: 4,
    category: "Clinical Chemistry",
    topic: "bilirubin metabolism"
  },
  {
    id: "mlt-batch-019",
    stem: "Which tumor marker is most commonly associated with hepatocellular carcinoma?",
    options: ["CEA", "AFP (alpha-fetoprotein)", "PSA", "CA 19-9"],
    correctIndex: 1,
    rationale: "Alpha-fetoprotein (AFP) is the primary tumor marker for hepatocellular carcinoma. It is also elevated in nonseminomatous germ cell tumors and during pregnancy. CEA is associated with colorectal cancer, PSA with prostate cancer, and CA 19-9 with pancreatic cancer.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "tumor markers"
  },
  {
    id: "mlt-batch-020",
    stem: "A specimen drawn in a light green top tube contains which anticoagulant?",
    options: ["EDTA", "Lithium heparin with gel separator", "Sodium citrate", "Potassium oxalate"],
    correctIndex: 1,
    rationale: "Light green top (PST - plasma separator tube) contains lithium heparin and a gel barrier. After centrifugation, plasma sits above the gel. It is commonly used for stat chemistry testing because no clotting time is needed.",
    difficulty: 5,
    category: "Clinical Chemistry",
    topic: "specimen collection"
  },
  {
    id: "mlt-batch-021",
    stem: "An elevated serum ceruloplasmin combined with decreased serum copper and increased urinary copper is characteristic of:",
    options: ["Menkes disease", "Wilson disease", "Hemochromatosis", "Lead poisoning"],
    correctIndex: 1,
    rationale: "Wilson disease is characterized by decreased serum ceruloplasmin and copper (because ceruloplasmin, which carries copper, is deficient) with increased urinary copper excretion and hepatic copper accumulation. Kayser-Fleischer rings in the eyes are pathognomonic.",
    difficulty: 4,
    category: "Clinical Chemistry",
    topic: "trace elements"
  },
  {
    id: "mlt-batch-022",
    stem: "The Henderson-Hasselbalch equation relates pH to the ratio of:",
    options: ["pCO2 to pO2", "HCO3− to H2CO3 (dissolved CO2)", "Hemoglobin to oxyhemoglobin", "Sodium to potassium"],
    correctIndex: 1,
    rationale: "The Henderson-Hasselbalch equation: pH = pKa + log([HCO3−]/[H2CO3]). At body temperature, pKa = 6.1 and H2CO3 = 0.03 × pCO2. The normal ratio of HCO3− to dissolved CO2 is 20:1, giving a normal pH of 7.40.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "acid-base balance"
  },
  {
    id: "mlt-batch-023",
    stem: "Which of the following causes a falsely decreased hemoglobin A1c result?",
    options: ["Iron deficiency anemia", "Hemolytic anemia", "Vitamin B12 deficiency", "Chronic kidney disease"],
    correctIndex: 1,
    rationale: "Hemolytic anemia causes falsely decreased HbA1c because RBCs have a shortened lifespan, allowing less time for glycation. Conditions that prolong RBC lifespan (iron deficiency, B12 deficiency) can falsely elevate HbA1c.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "glycated hemoglobin"
  },
  {
    id: "mlt-batch-024",
    stem: "A serum osmolality is measured at 320 mOsm/kg with a calculated osmolality of 290 mOsm/kg. The osmolal gap of 30 suggests:",
    options: ["Normal finding", "Presence of unmeasured osmotically active substances", "Laboratory error", "Dehydration"],
    correctIndex: 1,
    rationale: "The osmolal gap (measured minus calculated osmolality) >10 mOsm/kg suggests unmeasured osmotically active substances such as ethanol, methanol, ethylene glycol, or isopropanol. This is an important finding in toxicology workups.",
    difficulty: 4,
    category: "Clinical Chemistry",
    topic: "osmolality"
  },
  {
    id: "mlt-batch-025",
    stem: "Which immunoglobulin class is present in the highest concentration in serum?",
    options: ["IgA", "IgG", "IgM", "IgE"],
    correctIndex: 1,
    rationale: "IgG is the most abundant immunoglobulin in serum, comprising approximately 75-80% of total serum immunoglobulins. It is the only immunoglobulin that crosses the placenta and provides passive immunity to the newborn.",
    difficulty: 5,
    category: "Clinical Chemistry",
    topic: "immunoglobulins"
  },
  {
    id: "mlt-batch-026",
    stem: "A 24-hour urine collection for creatinine clearance is received. The total volume is 1440 mL, urine creatinine is 100 mg/dL, and serum creatinine is 1.0 mg/dL. What is the creatinine clearance?",
    options: ["50 mL/min", "100 mL/min", "125 mL/min", "150 mL/min"],
    correctIndex: 1,
    rationale: "CrCl = (U × V) / P, where U = urine creatinine (100 mg/dL), V = urine flow rate (1440 mL/1440 min = 1.0 mL/min), P = plasma creatinine (1.0 mg/dL). CrCl = (100 × 1.0) / 1.0 = 100 mL/min. Normal range is 85-125 mL/min.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "renal function"
  },
  {
    id: "mlt-batch-027",
    stem: "Which of the following is the most sensitive marker for detecting early glomerular damage in diabetic patients?",
    options: ["Serum creatinine", "Microalbumin (urine albumin)", "BUN", "Urine specific gravity"],
    correctIndex: 1,
    rationale: "Microalbuminuria (30-300 mg/day or albumin/creatinine ratio 30-300 mg/g) is the earliest detectable sign of diabetic nephropathy. It appears before serum creatinine rises or GFR decreases, allowing early intervention.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "renal function"
  },
  {
    id: "mlt-batch-028",
    stem: "A chemistry analyzer flags a result with a hemolysis index (H-index) of 150. Which of the following analytes would be LEAST affected?",
    options: ["Potassium", "Sodium", "LDH", "AST"],
    correctIndex: 1,
    rationale: "Sodium concentration is similar in RBCs and plasma, so hemolysis has minimal effect on sodium results. Potassium, LDH, and AST are all present in much higher concentrations within RBCs, so hemolysis causes falsely elevated results for these analytes.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "preanalytical errors"
  },
  {
    id: "mlt-batch-029",
    stem: "A thyroid panel shows: TSH <0.01 mIU/L (low), free T4 4.5 ng/dL (high). This pattern is consistent with:",
    options: ["Primary hypothyroidism", "Hyperthyroidism", "Secondary hypothyroidism", "Euthyroid sick syndrome"],
    correctIndex: 1,
    rationale: "Low TSH with elevated free T4 indicates hyperthyroidism. The excess thyroid hormone suppresses TSH via negative feedback on the anterior pituitary. Primary hypothyroidism shows high TSH with low T4. Secondary hypothyroidism shows low TSH with low T4.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "thyroid function"
  },
  {
    id: "mlt-batch-030",
    stem: "The enzyme urease is used in the clinical chemistry measurement of:",
    options: ["Creatinine", "Blood urea nitrogen (BUN)", "Uric acid", "Ammonia"],
    correctIndex: 1,
    rationale: "Urease hydrolyzes urea to ammonia and CO2. The ammonia produced is then measured, usually by the Berthelot reaction or by coupling with glutamate dehydrogenase (GLDH) and monitoring NADH consumption at 340 nm.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "analytical methods"
  },
  {
    id: "mlt-batch-031",
    stem: "Which condition would cause an elevated anion gap metabolic acidosis?",
    options: ["Diarrhea", "Diabetic ketoacidosis", "Renal tubular acidosis", "Normal saline infusion"],
    correctIndex: 1,
    rationale: "DKA produces ketoacids (beta-hydroxybutyrate, acetoacetate) that consume bicarbonate and increase the anion gap. The mnemonic MUDPILES (Methanol, Uremia, DKA, Propylene glycol, Isoniazid/Iron, Lactic acidosis, Ethylene glycol, Salicylates) lists causes. Diarrhea and RTA cause non-anion-gap acidosis.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "acid-base balance"
  },
  {
    id: "mlt-batch-032",
    stem: "A neonatal screening test measures phenylalanine levels in a dried blood spot. Elevated levels are diagnostic of:",
    options: ["Galactosemia", "Phenylketonuria (PKU)", "Maple syrup urine disease", "Cystic fibrosis"],
    correctIndex: 1,
    rationale: "PKU results from deficiency of phenylalanine hydroxylase, causing accumulation of phenylalanine. Newborn screening detects elevated phenylalanine levels. Early dietary restriction prevents intellectual disability. Testing should be done after 24 hours of protein feeding.",
    difficulty: 5,
    category: "Clinical Chemistry",
    topic: "inborn errors of metabolism"
  },
  {
    id: "mlt-batch-033",
    stem: "An ELISA test uses an enzyme-labeled antibody that produces a color change proportional to the analyte concentration. This describes which type of ELISA?",
    options: ["Competitive ELISA", "Sandwich (noncompetitive) ELISA", "Indirect ELISA", "Inhibition ELISA"],
    correctIndex: 1,
    rationale: "In a sandwich ELISA, the analyte is captured between two antibodies — one bound to the plate and one enzyme-labeled. The signal is directly proportional to analyte concentration. In competitive ELISA, the signal is inversely proportional.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "immunoassay methods"
  },
  {
    id: "mlt-batch-034",
    stem: "A point-of-care glucose meter reads 45 mg/dL in a critically ill patient receiving IV fluids. The most important consideration is:",
    options: ["Accept the result and treat for hypoglycemia", "Verify with a laboratory venous glucose before treatment", "Repeat the POC test immediately", "Check the meter calibration"],
    correctIndex: 0,
    rationale: "In symptomatic hypoglycemia, treatment should not be delayed. However, POC glucose meters can be inaccurate in critically ill patients due to hematocrit extremes, poor perfusion, and interfering substances. A confirmatory venous sample should be sent simultaneously but should not delay treatment of symptomatic hypoglycemia.",
    difficulty: 4,
    category: "Clinical Chemistry",
    topic: "point-of-care testing"
  },
  {
    id: "mlt-batch-035",
    stem: "Which of the following is the reference method for measuring serum cholesterol?",
    options: ["Enzymatic colorimetric method", "Abell-Kendall method", "Direct LDL measurement", "Friedewald equation"],
    correctIndex: 1,
    rationale: "The Abell-Kendall method is the CDC reference method for total cholesterol. It involves saponification, extraction with petroleum ether, and a Liebermann-Burchard color reaction. Enzymatic methods are used for routine clinical testing.",
    difficulty: 4,
    category: "Clinical Chemistry",
    topic: "reference methods"
  },
  {
    id: "mlt-batch-036",
    stem: "A patient has Na+ 128 mEq/L, serum osmolality 260 mOsm/kg, and urine osmolality 500 mOsm/kg. This pattern is most consistent with:",
    options: ["Diabetes insipidus", "SIADH (syndrome of inappropriate ADH)", "Psychogenic polydipsia", "Adrenal insufficiency"],
    correctIndex: 1,
    rationale: "SIADH presents with hyponatremia, low serum osmolality (dilute serum), and inappropriately concentrated urine (high urine osmolality). Excess ADH causes water retention, diluting serum sodium. Diabetes insipidus shows dilute urine with high serum osmolality.",
    difficulty: 4,
    category: "Clinical Chemistry",
    topic: "endocrine disorders"
  },
  {
    id: "mlt-batch-037",
    stem: "The Friedewald equation is used to calculate:",
    options: ["Total cholesterol", "LDL cholesterol", "HDL cholesterol", "VLDL cholesterol"],
    correctIndex: 1,
    rationale: "LDL = Total cholesterol − HDL − (Triglycerides/5). This equation is valid only when triglycerides are <400 mg/dL. The triglycerides/5 estimates VLDL cholesterol. Direct LDL measurement is needed when triglycerides exceed 400 mg/dL.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "lipid calculations"
  },
  {
    id: "mlt-batch-038",
    stem: "Which of the following enzymes has the longest half-life and remains elevated the longest after myocardial infarction?",
    options: ["CK-MB", "Troponin I", "Myoglobin", "AST"],
    correctIndex: 1,
    rationale: "Troponin I remains elevated for 7-14 days after MI, making it useful for late diagnosis. Myoglobin rises first (1-3 hours) but normalizes in 24 hours. CK-MB peaks at 12-24 hours and normalizes in 48-72 hours. AST peaks at 24-48 hours.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "cardiac biomarkers"
  },
  {
    id: "mlt-batch-039",
    stem: "A patient's iron studies show: serum iron low, TIBC high, ferritin low, transferrin saturation low. This pattern is most consistent with:",
    options: ["Anemia of chronic disease", "Iron deficiency anemia", "Hemochromatosis", "Sideroblastic anemia"],
    correctIndex: 1,
    rationale: "Iron deficiency anemia shows low serum iron, high TIBC (the body increases transferrin to capture more iron), low ferritin (depleted iron stores), and low transferrin saturation. Anemia of chronic disease shows low iron with low TIBC and normal/high ferritin.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "iron studies"
  },
  {
    id: "mlt-batch-040",
    stem: "In spectrophotometry, Beer's law states that absorbance is directly proportional to:",
    options: ["Wavelength of light", "Concentration and path length", "Temperature of the solution", "Volume of the cuvette"],
    correctIndex: 1,
    rationale: "Beer-Lambert law: A = εbc, where A = absorbance, ε = molar absorptivity, b = path length, and c = concentration. Absorbance is directly proportional to both concentration and path length. This is the foundation of quantitative spectrophotometry.",
    difficulty: 4,
    category: "Clinical Chemistry",
    topic: "instrumentation"
  },
  {
    id: "mlt-batch-041",
    stem: "A Levey-Jennings chart shows 7 consecutive QC results all falling above the mean but within 2 SD. This violates which Westgard rule?",
    options: ["1-2s rule", "7x rule (shift)", "R-4s rule", "2-2s rule"],
    correctIndex: 1,
    rationale: "The 7x rule detects systematic error (shift) when 7 or more consecutive QC values fall on the same side of the mean. Even though all values are within 2 SD, the trend indicates a systematic bias requiring investigation of reagents, calibration, or instrument function.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "quality control"
  },
  {
    id: "mlt-batch-042",
    stem: "Which anticoagulant chelates calcium to prevent clotting and is used for coagulation studies?",
    options: ["EDTA", "Sodium citrate", "Lithium heparin", "Sodium fluoride"],
    correctIndex: 1,
    rationale: "Sodium citrate (light blue top) chelates calcium ions to prevent coagulation and is the standard anticoagulant for PT, aPTT, and other coagulation studies. The 3.2% concentration maintains a 9:1 blood-to-anticoagulant ratio.",
    difficulty: 4,
    category: "Clinical Chemistry",
    topic: "specimen collection"
  },
  {
    id: "mlt-batch-043",
    stem: "A patient's CK total is 1200 U/L with a CK-MB of 60 U/L. The relative CK-MB index is:",
    options: ["2%", "5%", "10%", "20%"],
    correctIndex: 1,
    rationale: "CK-MB relative index = (CK-MB / total CK) × 100 = (60/1200) × 100 = 5%. An index >5% suggests myocardial origin, while <5% suggests skeletal muscle origin. This helps differentiate cardiac from skeletal muscle injury.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "cardiac biomarkers"
  },
  {
    id: "mlt-batch-044",
    stem: "Which method is used to separate proteins based on their charge at a given pH?",
    options: ["Chromatography", "Electrophoresis", "Nephelometry", "Mass spectrometry"],
    correctIndex: 1,
    rationale: "Electrophoresis separates proteins based on their net charge in an electric field at a specific pH (usually 8.6 for serum protein electrophoresis). Proteins migrate toward the anode or cathode based on their charge. The five major bands are albumin, alpha-1, alpha-2, beta, and gamma.",
    difficulty: 4,
    category: "Clinical Chemistry",
    topic: "analytical methods"
  },
  {
    id: "mlt-batch-045",
    stem: "A patient's BNP (B-type natriuretic peptide) is 850 pg/mL. This result is most consistent with:",
    options: ["Normal cardiac function", "Congestive heart failure", "Pulmonary fibrosis", "Renal failure only"],
    correctIndex: 1,
    rationale: "BNP >400 pg/mL is strongly suggestive of congestive heart failure. BNP is released from ventricular myocytes in response to volume overload and wall stress. Values <100 pg/mL generally rule out heart failure. BNP can also be mildly elevated in renal failure and pulmonary embolism.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "cardiac biomarkers"
  },
  {
    id: "mlt-batch-046",
    stem: "A lipemic specimen will most likely interfere with which type of analytical measurement?",
    options: ["Ion-selective electrode", "Spectrophotometric (colorimetric)", "Immunoturbidimetric", "Potentiometric"],
    correctIndex: 1,
    rationale: "Lipemia causes turbidity that scatters light and increases absorbance readings, interfering with spectrophotometric methods. ISE (potentiometric) methods are less affected by lipemia. Ultracentrifugation or lipemia-clearing agents can reduce interference.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "interferences"
  },
  {
    id: "mlt-batch-047",
    stem: "A newborn has a total bilirubin of 18 mg/dL on day 2 of life with predominantly indirect bilirubin. The most appropriate treatment is:",
    options: ["Exchange transfusion immediately", "Phototherapy", "Antibiotics", "No treatment needed"],
    correctIndex: 1,
    rationale: "Phototherapy is the primary treatment for neonatal hyperbilirubinemia. Blue light (wavelength 460-490 nm) converts unconjugated bilirubin in the skin to water-soluble photoisomers that can be excreted without hepatic conjugation. Exchange transfusion is reserved for severe cases unresponsive to phototherapy.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "neonatal bilirubin"
  },
  {
    id: "mlt-batch-048",
    stem: "Which of the following is the best marker for monitoring long-term glycemic control over 2-3 weeks, complementing HbA1c?",
    options: ["Fasting glucose", "Fructosamine", "Random glucose", "C-peptide"],
    correctIndex: 1,
    rationale: "Fructosamine measures glycated serum proteins (primarily albumin) and reflects average glucose over the preceding 2-3 weeks. It is useful when HbA1c is unreliable (hemolytic anemia, hemoglobin variants) or when more frequent monitoring of glycemic changes is needed.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "diabetes monitoring"
  },
  {
    id: "mlt-batch-049",
    stem: "A delta check is a quality assurance tool that compares:",
    options: ["QC results to established ranges", "A patient's current result to their previous result", "Results between two different analyzers", "Patient results to reference ranges"],
    correctIndex: 1,
    rationale: "Delta checks compare a patient's current result with their most recent previous result. An excessive change (exceeding the delta check limit) may indicate specimen mislabeling, misidentification, or a significant clinical change requiring investigation.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "quality assurance"
  },
  {
    id: "mlt-batch-050",
    stem: "Which of the following enzymes is most useful for diagnosing bone disease when liver function is normal?",
    options: ["ALT", "Bone-specific alkaline phosphatase", "GGT", "CK"],
    correctIndex: 1,
    rationale: "Bone-specific ALP is useful for diagnosing metabolic bone diseases like Paget disease and osteomalacia. Total ALP can be elevated from either liver or bone sources. GGT helps differentiate: if GGT is elevated with ALP, the source is hepatic; if GGT is normal with elevated ALP, the source is likely bone.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "enzyme markers"
  },
  {
    id: "mlt-batch-051",
    stem: "A peripheral blood smear shows target cells (codocytes). Which condition is LEAST likely to cause this finding?",
    options: ["Thalassemia", "Iron deficiency anemia", "Spherocytosis", "Liver disease"],
    correctIndex: 2,
    rationale: "Spherocytes have decreased membrane relative to volume, the opposite of target cells. Target cells form when there is excess membrane relative to cell volume, seen in thalassemia, iron deficiency, liver disease, hemoglobin C disease, and post-splenectomy states.",
    difficulty: 3,
    category: "Hematology",
    topic: "red cell morphology"
  },
  {
    id: "mlt-batch-052",
    stem: "A CBC shows WBC 52,000/μL with 85% mature lymphocytes that appear small with scant cytoplasm. This smear finding in an elderly patient is most consistent with:",
    options: ["Acute lymphoblastic leukemia", "Chronic lymphocytic leukemia (CLL)", "Infectious mononucleosis", "Acute myeloid leukemia"],
    correctIndex: 1,
    rationale: "CLL is the most common leukemia in elderly adults and is characterized by a marked lymphocytosis of small, mature-appearing lymphocytes. Smudge cells (basket cells) are characteristically seen on the peripheral smear due to fragile neoplastic lymphocytes.",
    difficulty: 3,
    category: "Hematology",
    topic: "leukemias"
  },
  {
    id: "mlt-batch-053",
    stem: "What is the normal adult hemoglobin A (HbA) composed of?",
    options: ["Two alpha and two delta chains", "Two alpha and two beta chains", "Two alpha and two gamma chains", "Four beta chains"],
    correctIndex: 1,
    rationale: "Normal adult hemoglobin A (HbA) consists of two alpha (α) and two beta (β) globin chains (α2β2). HbA2 (α2δ2) normally constitutes 2-3% of total hemoglobin. Fetal hemoglobin HbF (α2γ2) is normally <1% in adults.",
    difficulty: 1,
    category: "Hematology",
    topic: "hemoglobin structure"
  },
  {
    id: "mlt-batch-054",
    stem: "An automated hematology analyzer reports an MCV of 68 fL, MCH 22 pg, and MCHC 30 g/dL. These indices are most consistent with:",
    options: ["Normocytic normochromic anemia", "Microcytic hypochromic anemia", "Macrocytic normochromic anemia", "Microcytic normochromic anemia"],
    correctIndex: 1,
    rationale: "MCV <80 fL = microcytic; MCH <27 pg = hypochromic; MCHC <32 g/dL = hypochromic. This pattern is classic for iron deficiency anemia and thalassemia. The most common cause of microcytic hypochromic anemia worldwide is iron deficiency.",
    difficulty: 1,
    category: "Hematology",
    topic: "red cell indices"
  },
  {
    id: "mlt-batch-055",
    stem: "Which stain is used to identify iron stores in bone marrow aspirates?",
    options: ["Wright-Giemsa stain", "Prussian blue (Perls) stain", "Periodic acid-Schiff (PAS) stain", "Myeloperoxidase stain"],
    correctIndex: 1,
    rationale: "Prussian blue (Perls stain) detects hemosiderin (storage iron) in bone marrow. It turns iron deposits blue-green. Absence of stainable iron in marrow confirms iron deficiency. Ring sideroblasts (iron-laden mitochondria encircling the nucleus) are seen in sideroblastic anemia.",
    difficulty: 1,
    category: "Hematology",
    topic: "special stains"
  },
  {
    id: "mlt-batch-056",
    stem: "A patient has a prolonged aPTT that corrects with a 1:1 mixing study. This result indicates:",
    options: ["Presence of an inhibitor (e.g., lupus anticoagulant)", "Factor deficiency", "Heparin contamination", "Disseminated intravascular coagulation"],
    correctIndex: 1,
    rationale: "If a prolonged aPTT corrects in a mixing study, the cause is a factor deficiency — the normal plasma provides the missing factor. If it does not correct, an inhibitor (such as lupus anticoagulant or a specific factor inhibitor) is present that inactivates the added factors.",
    difficulty: 3,
    category: "Hematology",
    topic: "coagulation"
  },
  {
    id: "mlt-batch-057",
    stem: "Auer rods in blast cells are pathognomonic for which type of leukemia?",
    options: ["Acute lymphoblastic leukemia", "Acute myeloid leukemia", "Chronic myeloid leukemia", "Chronic lymphocytic leukemia"],
    correctIndex: 1,
    rationale: "Auer rods are crystallized aggregates of myeloperoxidase found exclusively in myeloid lineage blasts. They are pathognomonic for AML and are never found in ALL. Multiple Auer rods (faggot cells) are characteristically seen in acute promyelocytic leukemia (APL, AML-M3).",
    difficulty: 3,
    category: "Hematology",
    topic: "leukemias"
  },
  {
    id: "mlt-batch-058",
    stem: "A reticulocyte count of 8% in a patient with hemoglobin of 7 g/dL indicates:",
    options: ["Inadequate bone marrow response", "Appropriate bone marrow response to anemia", "Aplastic anemia", "Myelodysplastic syndrome"],
    correctIndex: 1,
    rationale: "An elevated reticulocyte count (>2%) indicates the bone marrow is responding appropriately to anemia by increasing RBC production. This is typical of hemolytic anemia or acute blood loss. Low reticulocyte counts in anemia suggest inadequate marrow response (aplastic anemia, nutritional deficiency).",
    difficulty: 2,
    category: "Hematology",
    topic: "reticulocyte count"
  },
  {
    id: "mlt-batch-059",
    stem: "The Philadelphia chromosome t(9;22) is the hallmark cytogenetic abnormality of:",
    options: ["Acute promyelocytic leukemia", "Chronic myeloid leukemia (CML)", "Burkitt lymphoma", "Chronic lymphocytic leukemia"],
    correctIndex: 1,
    rationale: "The Philadelphia chromosome results from a reciprocal translocation between chromosomes 9 and 22, creating the BCR-ABL1 fusion gene. It is found in >95% of CML cases and produces a constitutively active tyrosine kinase. Imatinib (Gleevec) specifically targets this fusion protein.",
    difficulty: 2,
    category: "Hematology",
    topic: "cytogenetics"
  },
  {
    id: "mlt-batch-060",
    stem: "Which cell is the most immature recognizable cell of the erythroid lineage in the bone marrow?",
    options: ["Reticulocyte", "Pronormoblast (proerythroblast)", "Basophilic normoblast", "Polychromatic normoblast"],
    correctIndex: 1,
    rationale: "The pronormoblast (proerythroblast) is the earliest recognizable erythroid precursor. The maturation sequence is: pronormoblast → basophilic normoblast → polychromatic normoblast → orthochromic normoblast → reticulocyte → mature RBC. Nuclear condensation and hemoglobinization increase with maturation.",
    difficulty: 2,
    category: "Hematology",
    topic: "erythropoiesis"
  },
  {
    id: "mlt-batch-061",
    stem: "A D-dimer test is most useful for:",
    options: ["Diagnosing hemophilia", "Ruling out venous thromboembolism (VTE)", "Monitoring warfarin therapy", "Diagnosing von Willebrand disease"],
    correctIndex: 1,
    rationale: "D-dimer is a fibrin degradation product released when cross-linked fibrin is broken down by plasmin. A negative D-dimer has high negative predictive value for ruling out VTE (DVT/PE). However, D-dimer is nonspecific and can be elevated in many conditions including surgery, pregnancy, and infection.",
    difficulty: 2,
    category: "Hematology",
    topic: "coagulation"
  },
  {
    id: "mlt-batch-062",
    stem: "Schistocytes on a peripheral smear combined with thrombocytopenia and elevated LDH are most consistent with:",
    options: ["Immune thrombocytopenic purpura", "Thrombotic thrombocytopenic purpura (TTP)", "Hemophilia A", "Bernard-Soulier syndrome"],
    correctIndex: 1,
    rationale: "TTP is a thrombotic microangiopathy (TMA) characterized by the classic pentad: microangiopathic hemolytic anemia (schistocytes), thrombocytopenia, neurological symptoms, renal dysfunction, and fever. The mechanical fragmentation of RBCs by fibrin strands produces schistocytes and elevated LDH.",
    difficulty: 3,
    category: "Hematology",
    topic: "hemolytic anemias"
  },
  {
    id: "mlt-batch-063",
    stem: "Which test is used to differentiate iron deficiency anemia from thalassemia trait when both show microcytosis?",
    options: ["Hemoglobin electrophoresis", "RBC count and RDW", "Peripheral smear only", "Reticulocyte count"],
    correctIndex: 1,
    rationale: "In iron deficiency, RBC count is decreased and RDW is elevated (anisocytosis). In thalassemia trait, RBC count is often normal or elevated and RDW is usually normal. The Mentzer index (MCV/RBC) >13 suggests iron deficiency, <13 suggests thalassemia trait. HbA2 elevation on electrophoresis confirms beta-thalassemia trait.",
    difficulty: 3,
    category: "Hematology",
    topic: "microcytic anemias"
  },
  {
    id: "mlt-batch-064",
    stem: "The INR (International Normalized Ratio) is used to standardize which coagulation test?",
    options: ["aPTT", "Prothrombin time (PT)", "Thrombin time", "Fibrinogen"],
    correctIndex: 1,
    rationale: "INR = (Patient PT / Mean Normal PT)^ISI. The ISI (International Sensitivity Index) accounts for different thromboplastin reagent sensitivities, allowing standardized PT results across laboratories. INR is used to monitor warfarin therapy with a typical target of 2.0-3.0.",
    difficulty: 1,
    category: "Hematology",
    topic: "coagulation"
  },
  {
    id: "mlt-batch-065",
    stem: "A patient has a hemoglobin electrophoresis showing HbS 40%, HbA 55%, HbA2 3%, and HbF 2%. This pattern indicates:",
    options: ["Sickle cell disease (HbSS)", "Sickle cell trait (HbAS)", "HbS-beta thalassemia", "HbSC disease"],
    correctIndex: 1,
    rationale: "Sickle cell trait (HbAS) shows HbA >HbS, typically HbA ~55-60% and HbS ~35-40%. In sickle cell disease (HbSS), HbS is 80-90% with no HbA present. Sickle cell trait carriers are generally asymptomatic but can sickle under extreme conditions.",
    difficulty: 2,
    category: "Hematology",
    topic: "hemoglobinopathies"
  },
  {
    id: "mlt-batch-066",
    stem: "Which of the following conditions is characterized by pancytopenia with a hypocellular bone marrow?",
    options: ["Chronic myeloid leukemia", "Aplastic anemia", "Polycythemia vera", "Essential thrombocythemia"],
    correctIndex: 1,
    rationale: "Aplastic anemia is characterized by pancytopenia (decreased RBCs, WBCs, and platelets) with a hypocellular bone marrow replaced by fat. It can be acquired (idiopathic, drugs, viruses, radiation) or inherited (Fanconi anemia). Treatment may include immunosuppression or bone marrow transplant.",
    difficulty: 1,
    category: "Hematology",
    topic: "bone marrow failure"
  },
  {
    id: "mlt-batch-067",
    stem: "Howell-Jolly bodies seen on a peripheral smear are most commonly associated with:",
    options: ["Lead poisoning", "Asplenia or post-splenectomy", "Iron deficiency anemia", "G6PD deficiency"],
    correctIndex: 1,
    rationale: "Howell-Jolly bodies are nuclear remnants (DNA) in RBCs that are normally removed by splenic pitting. Their presence indicates functional asplenia or post-splenectomy. They appear as single, round, dark-staining inclusions. Lead poisoning shows basophilic stippling, and G6PD deficiency shows Heinz bodies.",
    difficulty: 2,
    category: "Hematology",
    topic: "red cell inclusions"
  },
  {
    id: "mlt-batch-068",
    stem: "A platelet aggregation study shows absence of aggregation with ristocetin but normal aggregation with ADP, collagen, and epinephrine. This pattern is most consistent with:",
    options: ["Glanzmann thrombasthenia", "Von Willebrand disease", "Bernard-Soulier syndrome", "Both B and C"],
    correctIndex: 3,
    rationale: "Ristocetin-induced platelet aggregation requires von Willebrand factor (vWF) and platelet GPIb receptor. Absence of aggregation with ristocetin alone occurs in both vWD (deficient vWF) and Bernard-Soulier syndrome (deficient GPIb). Further testing (vWF antigen, ristocetin cofactor activity) differentiates them.",
    difficulty: 4,
    category: "Hematology",
    topic: "platelet disorders"
  },
  {
    id: "mlt-batch-069",
    stem: "Basophilic stippling on a peripheral blood smear is most classically associated with:",
    options: ["Iron deficiency anemia", "Lead poisoning", "Hereditary spherocytosis", "Sickle cell disease"],
    correctIndex: 1,
    rationale: "Basophilic stippling represents aggregated ribosomes (RNA) in the RBC cytoplasm. It is classically seen in lead poisoning (lead inhibits pyrimidine 5' nucleotidase, preventing RNA degradation) and also in thalassemia, myelodysplastic syndrome, and sideroblastic anemia.",
    difficulty: 1,
    category: "Hematology",
    topic: "red cell inclusions"
  },
  {
    id: "mlt-batch-070",
    stem: "The direct antiglobulin test (DAT/direct Coombs) detects:",
    options: ["Antibodies in the patient's serum", "Antibodies or complement already bound to the patient's RBCs in vivo", "ABO antigens on the RBC surface", "Platelet-associated antibodies"],
    correctIndex: 1,
    rationale: "The DAT detects IgG antibodies or complement (C3d) bound to the patient's RBCs in vivo. It is positive in autoimmune hemolytic anemia (AIHA), hemolytic disease of the fetus/newborn (HDFN), and transfusion reactions. The indirect antiglobulin test (IAT) detects antibodies in serum.",
    difficulty: 2,
    category: "Hematology",
    topic: "immunohematology"
  },
  {
    id: "mlt-batch-071",
    stem: "A patient has a hemoglobin of 9 g/dL and a hematocrit of 27%. What is the rule-of-three check?",
    options: ["The hematocrit should be approximately 3 times the hemoglobin", "The RBC count should be 3 times the hemoglobin", "The MCV should be 3 times the hematocrit", "The MCHC should be 3 times the MCH"],
    correctIndex: 0,
    rationale: "The rule of three states: Hgb × 3 ≈ Hct (±3). Here: 9 × 3 = 27, which matches the hematocrit of 27%. This validates the internal consistency of the CBC results. Discrepancies suggest lipemia, hemolysis, high WBC, or abnormal hemoglobins interfering with measurement.",
    difficulty: 1,
    category: "Hematology",
    topic: "quality assurance"
  },
  {
    id: "mlt-batch-072",
    stem: "DIC (disseminated intravascular coagulation) is characterized by which laboratory findings?",
    options: ["Elevated fibrinogen, normal PT, normal platelets", "Prolonged PT/aPTT, decreased fibrinogen, decreased platelets, elevated D-dimer", "Prolonged PT only with normal aPTT", "Isolated thrombocytopenia with normal coagulation studies"],
    correctIndex: 1,
    rationale: "DIC involves widespread activation of coagulation consuming clotting factors and platelets, followed by secondary fibrinolysis. Lab findings include prolonged PT/aPTT, decreased fibrinogen (consumed), thrombocytopenia, elevated D-dimer/FDP, and schistocytes on smear.",
    difficulty: 3,
    category: "Hematology",
    topic: "coagulation disorders"
  },
  {
    id: "mlt-batch-073",
    stem: "Which hemoglobin variant migrates in the same position as HbS on cellulose acetate electrophoresis at alkaline pH?",
    options: ["HbC", "HbD and HbG", "HbE", "HbH"],
    correctIndex: 1,
    rationale: "On alkaline cellulose acetate electrophoresis, HbD and HbG migrate in the same position as HbS. Citrate agar electrophoresis at acid pH is used to separate them: HbS migrates differently from HbD at acid pH. Confirmatory testing (solubility test, HPLC) distinguishes these variants.",
    difficulty: 4,
    category: "Hematology",
    topic: "hemoglobin electrophoresis"
  },
  {
    id: "mlt-batch-074",
    stem: "A positive sugar water test (sucrose hemolysis test) and a confirmatory acidified serum test (Ham test) are diagnostic for:",
    options: ["Hereditary spherocytosis", "Paroxysmal nocturnal hemoglobinuria (PNH)", "Autoimmune hemolytic anemia", "Sickle cell disease"],
    correctIndex: 1,
    rationale: "PNH RBCs lack GPI-anchored complement regulatory proteins (CD55, CD59) and are unusually sensitive to complement-mediated lysis. The sugar water test is a screening test and the Ham test (acidified serum) confirms PNH. Flow cytometry for CD55/CD59 is now the standard diagnostic method.",
    difficulty: 4,
    category: "Hematology",
    topic: "hemolytic anemias"
  },
  {
    id: "mlt-batch-075",
    stem: "Which type of white blood cell is characteristically elevated in parasitic infections and allergic reactions?",
    options: ["Neutrophils", "Eosinophils", "Basophils", "Monocytes"],
    correctIndex: 1,
    rationale: "Eosinophils are elevated (eosinophilia >500/μL) in parasitic infections (especially helminths), allergic reactions, drug hypersensitivity, and some malignancies (Hodgkin lymphoma). Eosinophils contain major basic protein and eosinophilic cationic protein that are toxic to parasites.",
    difficulty: 1,
    category: "Hematology",
    topic: "white blood cell disorders"
  },
  {
    id: "mlt-batch-076",
    stem: "A patient is on heparin therapy. Which coagulation test is most appropriate for monitoring?",
    options: ["PT/INR", "aPTT", "Thrombin time", "Bleeding time"],
    correctIndex: 1,
    rationale: "aPTT is used to monitor unfractionated heparin therapy. Heparin enhances antithrombin's ability to inhibit factors in the intrinsic pathway (XII, XI, IX, VIII) and common pathway (X, thrombin). Therapeutic aPTT is typically 1.5-2.5 times the control. Anti-Xa is used for LMWH monitoring.",
    difficulty: 1,
    category: "Hematology",
    topic: "anticoagulant monitoring"
  },
  {
    id: "mlt-batch-077",
    stem: "Reed-Sternberg cells are the hallmark of which malignancy?",
    options: ["Non-Hodgkin lymphoma", "Hodgkin lymphoma", "Multiple myeloma", "Hairy cell leukemia"],
    correctIndex: 1,
    rationale: "Reed-Sternberg cells are large binucleated cells with prominent nucleoli (owl-eye appearance) that are pathognomonic for Hodgkin lymphoma. They are derived from B lymphocytes and typically express CD15 and CD30. Their presence is required for diagnosis.",
    difficulty: 1,
    category: "Hematology",
    topic: "lymphomas"
  },
  {
    id: "mlt-batch-078",
    stem: "A patient with hemophilia A has a deficiency of which coagulation factor?",
    options: ["Factor IX", "Factor VIII", "Factor XI", "Factor VII"],
    correctIndex: 1,
    rationale: "Hemophilia A is caused by deficiency of Factor VIII (X-linked recessive). It is the most common severe inherited bleeding disorder. Hemophilia B (Christmas disease) is Factor IX deficiency. Both present with prolonged aPTT, normal PT, and deep tissue/joint bleeding.",
    difficulty: 1,
    category: "Hematology",
    topic: "coagulation disorders"
  },
  {
    id: "mlt-batch-079",
    stem: "An elevated reticulocyte production index (RPI) >2.0 in an anemic patient indicates:",
    options: ["Inadequate marrow response", "Effective erythropoiesis with appropriate marrow response", "Myelodysplastic syndrome", "Iron deficiency"],
    correctIndex: 1,
    rationale: "The RPI corrects the reticulocyte count for the degree of anemia and reticulocyte maturation time. RPI >2.0 indicates adequate marrow compensation, seen in hemolytic anemia and acute blood loss. RPI <2.0 suggests inadequate response (hypoproliferative anemia).",
    difficulty: 3,
    category: "Hematology",
    topic: "reticulocyte count"
  },
  {
    id: "mlt-batch-080",
    stem: "Which stain is used to identify hemoglobin H inclusions in alpha-thalassemia?",
    options: ["Wright-Giemsa", "Brilliant cresyl blue (supravital stain)", "Prussian blue", "Sudan black B"],
    correctIndex: 1,
    rationale: "Brilliant cresyl blue is a supravital stain that precipitates HbH (β4 tetramers) as multiple small inclusions giving a 'golf ball' appearance. HbH inclusions form in alpha-thalassemia where 3 of 4 alpha genes are deleted. This stain is also used for reticulocyte counting.",
    difficulty: 4,
    category: "Hematology",
    topic: "thalassemias"
  },
  {
    id: "mlt-batch-081",
    stem: "A blood smear shows numerous large, atypical lymphocytes with abundant basophilic cytoplasm in a young patient with fever, pharyngitis, and lymphadenopathy. The most likely diagnosis is:",
    options: ["CLL", "Infectious mononucleosis", "ALL", "CMV infection"],
    correctIndex: 1,
    rationale: "Reactive (atypical) lymphocytes are the hallmark of infectious mononucleosis caused by EBV. These are cytotoxic T cells reacting to EBV-infected B cells. They are large with abundant deeply basophilic cytoplasm that may indent around adjacent RBCs. Monospot test confirms the diagnosis.",
    difficulty: 2,
    category: "Hematology",
    topic: "reactive lymphocytes"
  },
  {
    id: "mlt-batch-082",
    stem: "The ESR (erythrocyte sedimentation rate) is increased in all of the following conditions EXCEPT:",
    options: ["Multiple myeloma", "Rheumatoid arthritis", "Polycythemia vera", "Pregnancy"],
    correctIndex: 2,
    rationale: "Polycythemia vera (increased RBC mass) decreases the ESR because the increased number of RBCs resists rouleaux formation. ESR is increased by elevated fibrinogen, immunoglobulins (multiple myeloma), and inflammatory proteins that promote rouleaux formation.",
    difficulty: 2,
    category: "Hematology",
    topic: "sedimentation rate"
  },
  {
    id: "mlt-batch-083",
    stem: "G6PD deficiency is an X-linked disorder that causes hemolytic anemia triggered by:",
    options: ["Cold temperatures", "Oxidative stress (drugs, infections, fava beans)", "Physical trauma", "Antibody-mediated complement activation"],
    correctIndex: 1,
    rationale: "G6PD deficiency impairs the hexose monophosphate shunt, reducing NADPH and glutathione production. Without adequate antioxidant defense, RBCs are vulnerable to oxidative damage from drugs (primaquine, sulfonamides, dapsone), infections, and fava beans. Heinz bodies and bite cells are seen on smear.",
    difficulty: 2,
    category: "Hematology",
    topic: "enzyme deficiencies"
  },
  {
    id: "mlt-batch-084",
    stem: "Which myeloproliferative neoplasm is associated with the JAK2 V617F mutation in >95% of cases?",
    options: ["Chronic myeloid leukemia", "Polycythemia vera", "Myelodysplastic syndrome", "Acute promyelocytic leukemia"],
    correctIndex: 1,
    rationale: "The JAK2 V617F point mutation is found in >95% of polycythemia vera cases and approximately 50-60% of essential thrombocythemia and primary myelofibrosis cases. It causes constitutive activation of the JAK-STAT signaling pathway. CML is associated with BCR-ABL1 (Philadelphia chromosome).",
    difficulty: 3,
    category: "Hematology",
    topic: "myeloproliferative neoplasms"
  },
  {
    id: "mlt-batch-085",
    stem: "A fibrinogen level of <100 mg/dL combined with elevated D-dimer and prolonged PT/aPTT is most suggestive of:",
    options: ["Vitamin K deficiency", "Disseminated intravascular coagulation (DIC)", "Liver failure alone", "Hemophilia B"],
    correctIndex: 1,
    rationale: "The combination of low fibrinogen (consumed), elevated D-dimer (fibrinolysis), and prolonged PT/aPTT (factor consumption) is the classic laboratory triad of DIC. Vitamin K deficiency shows prolonged PT with normal fibrinogen and D-dimer. Hemophilia shows prolonged aPTT only.",
    difficulty: 3,
    category: "Hematology",
    topic: "coagulation disorders"
  },
  {
    id: "mlt-batch-086",
    stem: "Which cell marker is most specific for identifying T lymphocytes by flow cytometry?",
    options: ["CD19", "CD3", "CD20", "CD34"],
    correctIndex: 1,
    rationale: "CD3 is a pan-T-cell marker present on all mature T lymphocytes. CD4 identifies helper T cells and CD8 identifies cytotoxic T cells. CD19 and CD20 are B-cell markers. CD34 is a hematopoietic stem cell marker.",
    difficulty: 1,
    category: "Hematology",
    topic: "flow cytometry"
  },
  {
    id: "mlt-batch-087",
    stem: "A manual WBC differential shows 45% bands in addition to elevated total WBC. This finding is termed:",
    options: ["Leukocytosis", "Left shift", "Leukemoid reaction", "Leukoerythroblastosis"],
    correctIndex: 1,
    rationale: "A left shift refers to an increase in immature neutrophils (bands, metamyelocytes, myelocytes) in the peripheral blood, typically indicating acute bacterial infection. The term comes from the Schilling hemogram where immature cells were listed on the left side. Bands >10% is considered a significant left shift.",
    difficulty: 1,
    category: "Hematology",
    topic: "white blood cell disorders"
  },
  {
    id: "mlt-batch-088",
    stem: "Rouleaux formation on a peripheral blood smear is most commonly caused by:",
    options: ["Dehydration", "Elevated plasma proteins (fibrinogen, immunoglobulins)", "Thrombocytopenia", "Cold agglutinins"],
    correctIndex: 1,
    rationale: "Rouleaux formation (stacking of RBCs like coins) occurs when elevated plasma proteins (fibrinogen, immunoglobulins) reduce the zeta potential between RBCs. It is commonly seen in multiple myeloma, Waldenström macroglobulinemia, and inflammatory states. Must be differentiated from agglutination.",
    difficulty: 2,
    category: "Hematology",
    topic: "red cell morphology"
  },
  {
    id: "mlt-batch-089",
    stem: "A bone marrow showing >20% blasts with myeloperoxidase (MPO) positivity confirms:",
    options: ["Acute lymphoblastic leukemia", "Acute myeloid leukemia", "Chronic lymphocytic leukemia", "Multiple myeloma"],
    correctIndex: 1,
    rationale: "AML is defined by ≥20% myeloid blasts in the bone marrow (WHO criteria). MPO positivity confirms myeloid lineage. ALL blasts are MPO-negative but may be PAS-positive (block pattern) or TdT-positive. Cytogenetics and flow cytometry further subclassify AML.",
    difficulty: 3,
    category: "Hematology",
    topic: "leukemias"
  },
  {
    id: "mlt-batch-090",
    stem: "Which condition causes a positive sickle solubility test (Sickledex)?",
    options: ["Sickle cell trait only", "Any condition with HbS (sickle cell trait or disease)", "Iron deficiency anemia", "Thalassemia"],
    correctIndex: 1,
    rationale: "The sickle solubility test (dithionite tube test) detects the presence of HbS. It is positive in both sickle cell trait (HbAS) and sickle cell disease (HbSS). HbS is insoluble when deoxygenated, producing turbidity. It cannot differentiate trait from disease — hemoglobin electrophoresis is needed for that.",
    difficulty: 2,
    category: "Hematology",
    topic: "hemoglobinopathies"
  },
  {
    id: "mlt-batch-091",
    stem: "A patient has an elevated PT and aPTT that correct with vitamin K administration. The most likely cause is:",
    options: ["Hemophilia A", "Vitamin K deficiency", "DIC", "Factor V Leiden"],
    correctIndex: 1,
    rationale: "Vitamin K is required for synthesis of factors II, VII, IX, and X (and proteins C and S). Deficiency causes prolongation of both PT and aPTT. Administration of vitamin K restores factor synthesis within 12-24 hours. Common causes include malabsorption, antibiotics, and warfarin therapy.",
    difficulty: 2,
    category: "Hematology",
    topic: "coagulation disorders"
  },
  {
    id: "mlt-batch-092",
    stem: "A hematology analyzer flags 'platelet clumps.' The most likely cause is:",
    options: ["True thrombocytopenia", "EDTA-dependent pseudothrombocytopenia", "DIC", "Heparin-induced thrombocytopenia"],
    correctIndex: 1,
    rationale: "EDTA-dependent pseudothrombocytopenia occurs when EDTA causes in vitro platelet clumping, resulting in falsely low platelet counts. Reviewing the smear shows platelet clumps. Collecting in sodium citrate tube and applying a correction factor or using a non-EDTA anticoagulant resolves the issue.",
    difficulty: 3,
    category: "Hematology",
    topic: "platelet disorders"
  },
  {
    id: "mlt-batch-093",
    stem: "The t(15;17) translocation producing the PML-RARA fusion gene is diagnostic for:",
    options: ["CML", "Acute promyelocytic leukemia (APL, AML-M3)", "Burkitt lymphoma", "Follicular lymphoma"],
    correctIndex: 1,
    rationale: "The t(15;17) translocation creates the PML-RARA fusion gene, which is pathognomonic for APL (AML-M3). APL is characterized by abnormal promyelocytes with heavy granulation and Auer rods, and carries a high risk of DIC. All-trans retinoic acid (ATRA) targets the fusion protein and is the standard treatment.",
    difficulty: 4,
    category: "Hematology",
    topic: "cytogenetics"
  },
  {
    id: "mlt-batch-094",
    stem: "An osmotic fragility test shows decreased fragility (resistance to hemolysis). This finding is characteristic of:",
    options: ["Hereditary spherocytosis", "Thalassemia (target cells)", "Autoimmune hemolytic anemia", "Warm antibody hemolysis"],
    correctIndex: 1,
    rationale: "Target cells (seen in thalassemia, liver disease, and iron deficiency) have increased surface area-to-volume ratio, making them resistant to osmotic lysis (decreased osmotic fragility). Spherocytes have decreased surface area-to-volume ratio and increased osmotic fragility.",
    difficulty: 3,
    category: "Hematology",
    topic: "osmotic fragility"
  },
  {
    id: "mlt-batch-095",
    stem: "Hairy cell leukemia is characterized by which unique cytochemical stain positivity?",
    options: ["Myeloperoxidase", "Tartrate-resistant acid phosphatase (TRAP)", "Periodic acid-Schiff", "Sudan black B"],
    correctIndex: 1,
    rationale: "TRAP positivity is characteristic of hairy cell leukemia, a rare B-cell lymphoproliferative disorder. Hairy cells show cytoplasmic projections on the smear and are positive for CD20, CD25, CD103, and CD11c. The BRAF V600E mutation is found in virtually all cases.",
    difficulty: 3,
    category: "Hematology",
    topic: "leukemias"
  },
  {
    id: "mlt-batch-096",
    stem: "Which hemoglobin has the highest oxygen affinity?",
    options: ["HbA", "HbF (fetal hemoglobin)", "HbS", "HbA2"],
    correctIndex: 1,
    rationale: "Fetal hemoglobin (HbF, α2γ2) has a higher oxygen affinity than adult hemoglobin (HbA) because it binds 2,3-BPG less effectively. This allows HbF to extract oxygen from maternal HbA across the placenta. HbF shifts the oxygen-hemoglobin dissociation curve to the left.",
    difficulty: 2,
    category: "Hematology",
    topic: "hemoglobin physiology"
  },
  {
    id: "mlt-batch-097",
    stem: "A patient with chronic liver disease has a prolonged PT. This is because the liver is the primary site of synthesis for:",
    options: ["Immunoglobulins", "Most coagulation factors", "Erythropoietin", "Thrombopoietin only"],
    correctIndex: 1,
    rationale: "The liver synthesizes most coagulation factors (I, II, V, VII, IX, X, XI, XII, XIII) and regulatory proteins (antithrombin, protein C, protein S). Factor VII has the shortest half-life (4-6 hours), so PT is the first to become prolonged in liver disease.",
    difficulty: 1,
    category: "Hematology",
    topic: "coagulation"
  },
  {
    id: "mlt-batch-098",
    stem: "A blood smear shows numerous spherocytes and polychromasia in a patient with a positive DAT. The most likely diagnosis is:",
    options: ["Hereditary spherocytosis", "Autoimmune hemolytic anemia (AIHA)", "G6PD deficiency", "Microangiopathic hemolytic anemia"],
    correctIndex: 1,
    rationale: "Spherocytes + positive DAT = autoimmune hemolytic anemia. In AIHA, antibodies (IgG or complement) coat RBCs, which are then partially phagocytosed by splenic macrophages, losing membrane and becoming spherocytes. Polychromasia indicates reticulocytosis (compensatory response). Hereditary spherocytosis has a negative DAT.",
    difficulty: 3,
    category: "Hematology",
    topic: "hemolytic anemias"
  },
  {
    id: "mlt-batch-099",
    stem: "Which anticoagulant is the standard for complete blood count (CBC) testing?",
    options: ["Sodium citrate", "EDTA (lavender top)", "Lithium heparin", "Sodium fluoride"],
    correctIndex: 1,
    rationale: "EDTA (ethylenediaminetetraacetic acid) in the lavender top tube is the standard anticoagulant for CBC testing. EDTA chelates calcium to prevent clotting while preserving cell morphology and preventing platelet clumping better than other anticoagulants for hematologic analysis.",
    difficulty: 1,
    category: "Hematology",
    topic: "specimen collection"
  },
  {
    id: "mlt-batch-100",
    stem: "A patient undergoing chemotherapy has a WBC of 1,200/μL with an ANC (absolute neutrophil count) of 400/μL. This patient is classified as:",
    options: ["Neutropenic", "Severely neutropenic", "Leukopenic only", "Pancytopenic"],
    correctIndex: 1,
    rationale: "Severe neutropenia is defined as ANC <500/μL. This patient is at high risk for life-threatening bacterial and fungal infections. Neutropenic precautions (reverse isolation, hand hygiene, avoiding raw foods, prophylactic antimicrobials) are critical. ANC = WBC × (% segs + % bands)/100.",
    difficulty: 2,
    category: "Hematology",
    topic: "white blood cell disorders"
  }
];
