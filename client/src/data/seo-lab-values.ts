export interface LabValuePracticeQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

export interface LabValuePageData {
  slug: string;
  name: string;
  fullName: string;
  h1Title: string;
  metaDescription: string;
  keywords: string;
  normalRange: {
    value: string;
    unit: string;
    notes?: string;
  };
  overview: string;
  clinicalSignificance: string;
  highCauses: {
    condition: string;
    explanation: string;
  }[];
  lowCauses: {
    condition: string;
    explanation: string;
  }[];
  criticalValues: {
    high?: string;
    low?: string;
    action: string;
  };
  nursingInterventions: {
    forHigh: string[];
    forLow: string[];
  };
  examTips: string[];
  practiceQuestions: LabValuePracticeQuestion[];
  relatedLabSlugs: string[];
  relatedLessonIds: string[];
  faqItems: {
    question: string;
    answer: string;
  }[];
}

export const seoLabValues: LabValuePageData[] = [
  {
    slug: "sodium",
    name: "Sodium",
    fullName: "Serum Sodium (Na+)",
    h1Title: "Sodium Lab Values: Normal Range, Clinical Significance & Nursing Guide",
    metaDescription: "Learn sodium (Na+) normal range 135-145 mEq/L, causes of hyponatremia and hypernatremia, nursing interventions, and NCLEX practice questions.",
    keywords: "sodium lab values, hyponatremia, hypernatremia, Na+ normal range, electrolyte imbalance nursing, NCLEX lab values",
    normalRange: {
      value: "135-145",
      unit: "mEq/L",
      notes: "Primary extracellular cation responsible for fluid balance and osmolality"
    },
    overview: "Sodium is the primary extracellular cation and plays a critical role in maintaining fluid balance, osmolality, nerve impulse transmission, and muscle contraction. Serum sodium levels reflect the ratio of sodium to water in the body rather than total body sodium content. Sodium imbalances are among the most common electrolyte disorders encountered in clinical practice and can have serious neurological consequences.",
    clinicalSignificance: "Sodium imbalances directly affect the central nervous system due to osmotic shifts of water across the blood-brain barrier. Hyponatremia causes cerebral edema, while hypernatremia causes cellular dehydration. Rapid correction of either condition can lead to devastating neurological complications including osmotic demyelination syndrome (central pontine myelinolysis) or cerebral edema.",
    highCauses: [
      { condition: "Dehydration", explanation: "Loss of free water exceeding sodium loss concentrates serum sodium" },
      { condition: "Diabetes Insipidus", explanation: "Insufficient ADH or renal resistance to ADH causes massive water loss" },
      { condition: "Excessive sodium intake", explanation: "Hypertonic IV solutions, sodium bicarbonate administration, or excessive dietary sodium" },
      { condition: "Cushing syndrome", explanation: "Excess cortisol promotes sodium retention and water excretion" },
      { condition: "Hyperaldosteronism", explanation: "Excess aldosterone causes sodium reabsorption in the distal tubule" }
    ],
    lowCauses: [
      { condition: "SIADH", explanation: "Excess ADH causes water retention, diluting serum sodium" },
      { condition: "Heart failure", explanation: "Decreased cardiac output triggers ADH release and water retention" },
      { condition: "Diuretic use", explanation: "Thiazide diuretics impair sodium reabsorption in the distal convoluted tubule" },
      { condition: "Vomiting/diarrhea", explanation: "GI losses of sodium-containing fluids deplete total body sodium" },
      { condition: "Water intoxication", explanation: "Excessive free water intake dilutes serum sodium (psychogenic polydipsia)" }
    ],
    criticalValues: {
      high: ">160 mEq/L",
      low: "<120 mEq/L",
      action: "Notify provider immediately. Critical sodium levels require ICU monitoring, frequent neurological assessments, and carefully controlled correction rate (no more than 8-10 mEq/L per 24 hours to prevent osmotic demyelination)."
    },
    nursingInterventions: {
      forHigh: [
        "Administer hypotonic IV fluids (0.45% NaCl) as ordered",
        "Monitor intake and output strictly",
        "Assess neurological status every 2-4 hours (confusion, lethargy, seizures)",
        "Encourage oral free water intake if able to swallow safely",
        "Monitor serum sodium every 4-6 hours during correction",
        "Implement seizure precautions"
      ],
      forLow: [
        "Restrict fluid intake as ordered (typically 1000-1500 mL/day)",
        "Administer hypertonic saline (3% NaCl) via IV pump if severely symptomatic",
        "Monitor serum sodium every 2-4 hours during correction",
        "Assess neurological status frequently (headache, nausea, confusion, seizures)",
        "Weigh patient daily to monitor fluid retention",
        "Implement fall precautions due to confusion risk"
      ]
    },
    examTips: [
      "SIADH = dilutional hyponatremia (low sodium, concentrated urine, fluid restriction is key intervention)",
      "Diabetes Insipidus = hypernatremia (high sodium, dilute urine, replace fluids)",
      "Never correct sodium faster than 8-10 mEq/L in 24 hours to prevent osmotic demyelination",
      "Hyponatremia with seizures = administer 3% hypertonic saline",
      "Thiazide diuretics cause hyponatremia; loop diuretics are less likely to cause sodium imbalance"
    ],
    practiceQuestions: [
      {
        question: "A patient with SIADH has a serum sodium of 125 mEq/L. Which nursing intervention is the highest priority?",
        options: [
          "Administer normal saline at 200 mL/hr",
          "Restrict fluid intake to 1000 mL/day",
          "Encourage increased oral fluid intake",
          "Administer furosemide 40 mg IV"
        ],
        correctIndex: 1,
        rationale: "Fluid restriction is the primary intervention for SIADH-related hyponatremia. SIADH causes water retention that dilutes sodium, so restricting water intake allows sodium concentration to normalize. Administering additional fluids would worsen the dilutional hyponatremia."
      },
      {
        question: "Which assessment finding would the nurse expect in a patient with a serum sodium of 162 mEq/L?",
        options: [
          "Moist mucous membranes and weight gain",
          "Muscle weakness and hyporeflexia",
          "Thirst, dry mucous membranes, and restlessness",
          "Peripheral edema and crackles in lungs"
        ],
        correctIndex: 2,
        rationale: "Hypernatremia causes cellular dehydration as water shifts from cells to the hyperosmolar extracellular space. Clinical manifestations include intense thirst, dry mucous membranes, restlessness, agitation, and eventually seizures and coma if untreated."
      },
      {
        question: "A nurse is correcting severe hyponatremia (Na+ 112 mEq/L). What is the maximum safe correction rate?",
        options: [
          "4-6 mEq/L per hour",
          "8-10 mEq/L per 24 hours",
          "15-20 mEq/L per 24 hours",
          "Correct to normal range within 12 hours"
        ],
        correctIndex: 1,
        rationale: "Sodium correction should not exceed 8-10 mEq/L per 24 hours. Rapid correction of chronic hyponatremia can cause osmotic demyelination syndrome (central pontine myelinolysis), leading to irreversible neurological damage including quadriplegia and locked-in syndrome."
      }
    ],
    relatedLabSlugs: ["potassium", "creatinine"],
    relatedLessonIds: ["siadh-di"],
    faqItems: [
      {
        question: "What is the normal sodium level?",
        answer: "The normal serum sodium level is 135-145 mEq/L. Values below 135 indicate hyponatremia, and values above 145 indicate hypernatremia."
      },
      {
        question: "What are the symptoms of low sodium?",
        answer: "Symptoms of hyponatremia include headache, nausea, confusion, lethargy, muscle cramps, and in severe cases (<120 mEq/L), seizures and coma due to cerebral edema."
      },
      {
        question: "Why is sodium important for nurses to monitor?",
        answer: "Sodium directly affects neurological function, fluid balance, and cardiac rhythm. Imbalances can cause seizures, altered mental status, and cardiac arrest. Nurses must monitor sodium levels, assess neurological status, and ensure safe correction rates."
      }
    ]
  },
  {
    slug: "potassium",
    name: "Potassium",
    fullName: "Serum Potassium (K+)",
    h1Title: "Potassium Lab Values: Normal Range, Clinical Significance & Nursing Guide",
    metaDescription: "Learn potassium (K+) normal range 3.5-5.0 mEq/L, causes of hypokalemia and hyperkalemia, cardiac effects, nursing interventions, and NCLEX practice questions.",
    keywords: "potassium lab values, hypokalemia, hyperkalemia, K+ normal range, cardiac arrhythmia potassium, NCLEX lab values",
    normalRange: {
      value: "3.5-5.0",
      unit: "mEq/L",
      notes: "Primary intracellular cation essential for cardiac and neuromuscular function"
    },
    overview: "Potassium is the primary intracellular cation and is essential for maintaining cellular membrane potential, cardiac conduction, neuromuscular function, and acid-base balance. Only about 2% of total body potassium is found in the extracellular fluid, making serum levels a poor indicator of total body stores. Even small changes in serum potassium can have life-threatening cardiac consequences.",
    clinicalSignificance: "Potassium abnormalities are among the most dangerous electrolyte imbalances because of their direct effect on cardiac conduction. Both hypokalemia and hyperkalemia can cause fatal cardiac arrhythmias. Potassium levels must be maintained within a narrow range, and any value outside 3.5-5.0 mEq/L requires prompt assessment and intervention.",
    highCauses: [
      { condition: "Acute kidney injury/Renal failure", explanation: "Impaired renal excretion is the most common cause of sustained hyperkalemia" },
      { condition: "Acidosis", explanation: "Hydrogen ions move intracellularly in exchange for potassium, raising serum levels" },
      { condition: "Tissue destruction", explanation: "Crush injuries, burns, rhabdomyolysis, and tumor lysis release intracellular potassium" },
      { condition: "ACE inhibitors/ARBs/K-sparing diuretics", explanation: "These medications reduce potassium excretion by the kidneys" },
      { condition: "Excessive supplementation", explanation: "Over-aggressive IV or oral potassium replacement" }
    ],
    lowCauses: [
      { condition: "Loop and thiazide diuretics", explanation: "Increase renal potassium excretion (most common medication-related cause)" },
      { condition: "Vomiting and nasogastric suction", explanation: "Loss of gastric contents and resulting metabolic alkalosis drive potassium intracellularly" },
      { condition: "Diarrhea", explanation: "GI losses contain significant potassium" },
      { condition: "Alkalosis", explanation: "Potassium shifts intracellularly in exchange for hydrogen ions" },
      { condition: "Insulin administration", explanation: "Insulin drives potassium into cells along with glucose" }
    ],
    criticalValues: {
      high: ">6.0 mEq/L",
      low: "<3.0 mEq/L",
      action: "Place patient on continuous cardiac monitoring immediately. For critical hyperkalemia: administer calcium gluconate (cardiac membrane stabilizer), insulin with dextrose, sodium bicarbonate, and kayexalate. For critical hypokalemia: IV potassium replacement via infusion pump (never IV push)."
    },
    nursingInterventions: {
      forHigh: [
        "Place on continuous cardiac monitoring and obtain 12-lead ECG",
        "Administer calcium gluconate IV to stabilize cardiac membrane",
        "Administer regular insulin with D50 to shift potassium intracellularly",
        "Administer sodium polystyrene sulfonate (Kayexalate) to promote GI excretion",
        "Restrict dietary potassium intake",
        "Monitor for ECG changes: peaked T waves, widened QRS, sine wave pattern",
        "Prepare for potential dialysis if refractory"
      ],
      forLow: [
        "Administer IV potassium chloride via infusion pump (never IV push, never faster than 10-20 mEq/hr)",
        "Encourage potassium-rich foods: bananas, oranges, potatoes, spinach",
        "Monitor cardiac rhythm for U waves, flattened T waves, ST depression",
        "Assess for muscle weakness, leg cramps, and decreased bowel sounds",
        "Check magnesium level (hypomagnesemia prevents potassium correction)",
        "Hold potassium-wasting diuretics and notify provider"
      ]
    },
    examTips: [
      "NEVER give potassium IV push - always diluted via infusion pump",
      "Always check renal function (creatinine/BUN) before giving potassium supplements",
      "Hyperkalemia ECG changes: peaked T waves → widened QRS → sine wave → cardiac arrest",
      "Hypokalemia ECG changes: flattened T waves, U waves, ST depression",
      "Digoxin toxicity is potentiated by hypokalemia - always monitor K+ in patients on digoxin",
      "Correct hypomagnesemia first - potassium will not normalize if magnesium is low"
    ],
    practiceQuestions: [
      {
        question: "A patient on furosemide has a potassium level of 2.8 mEq/L. Which ECG change should the nurse anticipate?",
        options: [
          "Peaked T waves",
          "Widened QRS complex",
          "Prominent U waves",
          "ST elevation"
        ],
        correctIndex: 2,
        rationale: "Hypokalemia (K+ <3.5 mEq/L) causes characteristic ECG changes including flattened or inverted T waves, prominent U waves, and ST segment depression. Peaked T waves and widened QRS are signs of hyperkalemia."
      },
      {
        question: "A patient with a potassium level of 6.8 mEq/L is showing peaked T waves on the monitor. What is the priority nursing action?",
        options: [
          "Administer oral kayexalate",
          "Administer IV calcium gluconate",
          "Restrict potassium in the diet",
          "Obtain a repeat potassium level"
        ],
        correctIndex: 1,
        rationale: "With symptomatic hyperkalemia showing ECG changes, the priority is administering IV calcium gluconate to stabilize the cardiac cell membrane and prevent fatal arrhythmias. This does not lower potassium but protects the heart while other treatments take effect."
      },
      {
        question: "Which patient is at greatest risk for hyperkalemia?",
        options: [
          "A patient receiving IV normal saline",
          "A patient with chronic diarrhea",
          "A patient with acute kidney injury on an ACE inhibitor",
          "A patient receiving a loop diuretic"
        ],
        correctIndex: 2,
        rationale: "A patient with acute kidney injury already has impaired potassium excretion. Adding an ACE inhibitor, which further reduces potassium excretion by decreasing aldosterone, creates a high risk for life-threatening hyperkalemia. Loop diuretics and diarrhea cause potassium loss (hypokalemia)."
      }
    ],
    relatedLabSlugs: ["sodium", "creatinine"],
    relatedLessonIds: [],
    faqItems: [
      {
        question: "What is a dangerously high potassium level?",
        answer: "A potassium level above 6.0 mEq/L is considered critical. Levels above 6.5 mEq/L can cause life-threatening cardiac arrhythmias including ventricular fibrillation and cardiac arrest. Immediate treatment is required."
      },
      {
        question: "Why can't potassium be given IV push?",
        answer: "IV push potassium can cause immediate fatal cardiac arrest. Potassium must always be diluted and administered via infusion pump at a controlled rate (typically no faster than 10-20 mEq/hour) with cardiac monitoring."
      },
      {
        question: "What foods are high in potassium?",
        answer: "Potassium-rich foods include bananas, oranges, potatoes, spinach, tomatoes, avocados, dried fruits, beans, and dairy products. Patients with hyperkalemia should limit these foods."
      }
    ]
  },
  {
    slug: "troponin",
    name: "Troponin",
    fullName: "Cardiac Troponin (cTnI / cTnT)",
    h1Title: "Troponin Lab Values: Normal Range, Clinical Significance & Nursing Guide",
    metaDescription: "Learn troponin normal range, causes of elevated troponin, myocardial infarction diagnosis, nursing interventions, and NCLEX practice questions.",
    keywords: "troponin lab values, cardiac troponin, myocardial infarction diagnosis, troponin normal range, cardiac biomarkers nursing, NCLEX lab values",
    normalRange: {
      value: "<0.04",
      unit: "ng/mL",
      notes: "High-sensitivity troponin (hs-cTn) has lower thresholds; any detectable elevation may be significant"
    },
    overview: "Troponin is a regulatory protein complex found in cardiac and skeletal muscle that controls muscle contraction. Cardiac-specific troponin I (cTnI) and troponin T (cTnT) are released into the bloodstream when myocardial cells are damaged or die. Troponin is the gold standard biomarker for diagnosing acute myocardial infarction and is the most sensitive and specific marker of myocardial injury available.",
    clinicalSignificance: "Elevated troponin indicates myocardial cell injury or death. Troponin begins to rise 3-6 hours after myocardial injury, peaks at 12-24 hours, and can remain elevated for 7-14 days. Serial troponin measurements (at 0, 3, and 6 hours) are used to diagnose or rule out acute myocardial infarction. A rising pattern of troponin levels is more diagnostic than a single elevated value.",
    highCauses: [
      { condition: "Acute myocardial infarction", explanation: "Coronary artery occlusion causes ischemic necrosis of myocardial tissue, releasing troponin" },
      { condition: "Myocarditis", explanation: "Inflammation of the myocardium from viral, autoimmune, or toxic causes damages cardiac cells" },
      { condition: "Pulmonary embolism", explanation: "Right ventricular strain from massive PE can cause myocardial injury" },
      { condition: "Heart failure exacerbation", explanation: "Acute decompensation causes myocardial stretch and micro-injury" },
      { condition: "Sepsis", explanation: "Sepsis-induced myocardial depression and demand ischemia elevate troponin" },
      { condition: "Renal failure", explanation: "Impaired clearance and chronic myocardial stress elevate baseline troponin" }
    ],
    lowCauses: [
      { condition: "Normal finding", explanation: "Troponin is normally undetectable or present at very low levels in healthy individuals" }
    ],
    criticalValues: {
      high: ">0.4 ng/mL (or rising trend on serial measurements)",
      action: "Notify provider immediately. Initiate acute coronary syndrome protocol: continuous cardiac monitoring, 12-lead ECG, IV access, oxygen if SpO2 <94%, aspirin administration, and preparation for cardiac catheterization."
    },
    nursingInterventions: {
      forHigh: [
        "Initiate continuous cardiac monitoring and obtain serial 12-lead ECGs",
        "Establish IV access and ensure patency",
        "Administer aspirin 325 mg chewable if not contraindicated and not already given",
        "Assess and document chest pain characteristics using PQRST",
        "Administer nitroglycerin and morphine as ordered for pain management",
        "Draw serial troponin levels at 0, 3, and 6 hours as ordered",
        "Maintain bedrest and minimize oxygen demand",
        "Prepare for potential cardiac catheterization and PCI",
        "Monitor vital signs every 15 minutes during acute phase"
      ],
      forLow: [
        "Document normal findings - no specific intervention required for normal troponin levels"
      ]
    },
    examTips: [
      "Troponin is the MOST specific and sensitive marker for myocardial injury - it is the gold standard",
      "Troponin rises 3-6 hours after MI, peaks at 12-24 hours, stays elevated 7-14 days",
      "A RISING pattern on serial troponins confirms acute MI (draw at 0, 3, 6 hours)",
      "CK-MB rises faster (4-6 hrs) but is less specific than troponin",
      "Troponin can be elevated in conditions OTHER than MI (PE, sepsis, renal failure, myocarditis)",
      "STEMI diagnosis requires ECG changes + troponin elevation + clinical presentation"
    ],
    practiceQuestions: [
      {
        question: "A patient presents to the ED with chest pain. The initial troponin is 0.02 ng/mL. What should the nurse anticipate?",
        options: [
          "The patient is not having a myocardial infarction; discharge is appropriate",
          "Serial troponin levels will be drawn at 3 and 6 hours",
          "Immediate cardiac catheterization is needed",
          "A CK-MB level replaces the need for repeat troponin"
        ],
        correctIndex: 1,
        rationale: "A single normal troponin does not rule out MI, as troponin may not rise until 3-6 hours after onset. Serial troponin measurements at 0, 3, and 6 hours are required. A rising pattern confirms myocardial injury. Early discharge based on a single normal troponin is unsafe."
      },
      {
        question: "Which statement about troponin is correct?",
        options: [
          "Troponin levels return to normal within 24 hours after MI",
          "Troponin is specific only to myocardial infarction",
          "Troponin can remain elevated for 7-14 days after myocardial injury",
          "Troponin is less sensitive than CK-MB for detecting MI"
        ],
        correctIndex: 2,
        rationale: "Troponin levels can remain elevated for 7-14 days after myocardial injury, making it useful for detecting recent MI but less helpful for detecting reinfarction within that window. Troponin is the most sensitive cardiac biomarker and can be elevated in conditions other than MI."
      },
      {
        question: "A nurse is caring for a patient with a troponin of 2.5 ng/mL and ST elevation in leads II, III, and aVF. What is the priority action?",
        options: [
          "Administer a stool softener",
          "Prepare for emergent cardiac catheterization",
          "Schedule an echocardiogram for tomorrow",
          "Obtain a chest X-ray"
        ],
        correctIndex: 1,
        rationale: "ST elevation in leads II, III, and aVF with elevated troponin indicates an acute inferior STEMI. The priority is emergent cardiac catheterization and percutaneous coronary intervention (PCI) to restore blood flow. Door-to-balloon time should be less than 90 minutes."
      }
    ],
    relatedLabSlugs: ["inr", "potassium"],
    relatedLessonIds: ["mi-acute", "mi-management"],
    faqItems: [
      {
        question: "What does an elevated troponin mean?",
        answer: "An elevated troponin indicates myocardial (heart muscle) cell injury or death. While it is most commonly associated with myocardial infarction (heart attack), troponin can also be elevated in myocarditis, pulmonary embolism, heart failure, sepsis, and renal failure."
      },
      {
        question: "How long does troponin stay elevated after a heart attack?",
        answer: "Troponin begins rising 3-6 hours after myocardial injury, peaks at 12-24 hours, and can remain elevated for 7-14 days. This extended elevation makes troponin useful for late presentation but less helpful for detecting reinfarction."
      },
      {
        question: "What is the difference between troponin I and troponin T?",
        answer: "Both troponin I (cTnI) and troponin T (cTnT) are cardiac-specific isoforms used to detect myocardial injury. They have similar diagnostic accuracy. The main difference is that troponin T may be mildly elevated in skeletal muscle disease and chronic kidney disease, while troponin I is more cardiac-specific."
      }
    ]
  },
  {
    slug: "creatinine",
    name: "Creatinine",
    fullName: "Serum Creatinine (SCr)",
    h1Title: "Creatinine Lab Values: Normal Range, Clinical Significance & Nursing Guide",
    metaDescription: "Learn creatinine normal range 0.6-1.2 mg/dL, causes of elevated creatinine, kidney function assessment, nursing interventions, and NCLEX practice questions.",
    keywords: "creatinine lab values, serum creatinine normal range, kidney function test, acute kidney injury, renal failure nursing, NCLEX lab values",
    normalRange: {
      value: "0.6-1.2",
      unit: "mg/dL",
      notes: "May vary by age, sex, and muscle mass. More reliable indicator of kidney function than BUN"
    },
    overview: "Creatinine is a waste product of creatine phosphate metabolism in skeletal muscle. It is produced at a relatively constant rate and is freely filtered by the glomeruli without significant tubular reabsorption or secretion. This makes serum creatinine the most reliable endogenous marker of glomerular filtration rate (GFR) and kidney function. Creatinine levels are used alongside GFR to diagnose, stage, and monitor chronic kidney disease.",
    clinicalSignificance: "Serum creatinine is the cornerstone of kidney function assessment. Because creatinine production is relatively constant, rising serum levels directly reflect declining kidney function. However, creatinine is a lagging indicator - by the time serum creatinine rises above normal, approximately 50% of kidney function has already been lost. The BUN-to-creatinine ratio helps differentiate prerenal, intrarenal, and postrenal causes of kidney injury.",
    highCauses: [
      { condition: "Acute kidney injury", explanation: "Sudden decline in GFR reduces creatinine clearance, causing rapid serum elevation" },
      { condition: "Chronic kidney disease", explanation: "Progressive nephron loss reduces filtration capacity over months to years" },
      { condition: "Dehydration", explanation: "Reduced renal perfusion decreases GFR and creatinine clearance" },
      { condition: "Rhabdomyolysis", explanation: "Massive skeletal muscle breakdown releases creatine, increasing creatinine production" },
      { condition: "Nephrotoxic medications", explanation: "NSAIDs, aminoglycosides, contrast dye, and ACE inhibitors can impair renal function" },
      { condition: "Urinary obstruction", explanation: "Postrenal obstruction (kidney stones, BPH) impairs filtration" }
    ],
    lowCauses: [
      { condition: "Decreased muscle mass", explanation: "Elderly, cachectic, or bedridden patients produce less creatinine" },
      { condition: "Pregnancy", explanation: "Increased GFR during pregnancy enhances creatinine clearance" },
      { condition: "Liver disease", explanation: "Reduced creatine synthesis in severe liver failure lowers creatinine production" }
    ],
    criticalValues: {
      high: ">4.0 mg/dL (or acute rise >0.3 mg/dL from baseline)",
      action: "Notify provider immediately. Assess urine output, review nephrotoxic medications for discontinuation, ensure adequate hydration, and prepare for potential dialysis. An acute rise of 0.3 mg/dL or 50% increase within 48 hours meets KDIGO criteria for acute kidney injury."
    },
    nursingInterventions: {
      forHigh: [
        "Monitor urine output strictly (report <0.5 mL/kg/hr for 6 hours)",
        "Review and hold nephrotoxic medications (NSAIDs, aminoglycosides, contrast dye)",
        "Maintain adequate hydration to support renal perfusion",
        "Assess for fluid overload signs: edema, crackles, jugular venous distension",
        "Monitor potassium levels closely (hyperkalemia accompanies renal failure)",
        "Weigh patient daily to track fluid balance",
        "Monitor BUN-to-creatinine ratio to differentiate prerenal vs intrarenal causes",
        "Educate patient on avoiding nephrotoxic substances including OTC NSAIDs"
      ],
      forLow: [
        "Assess nutritional status and muscle mass",
        "Consider that low creatinine may mask impaired kidney function in cachectic patients",
        "Use cystatin C or 24-hour creatinine clearance for more accurate GFR estimation in low-muscle-mass patients"
      ]
    },
    examTips: [
      "BUN:Creatinine ratio >20:1 suggests PRERENAL cause (dehydration, heart failure, shock)",
      "BUN:Creatinine ratio 10-20:1 is normal or suggests INTRARENAL cause",
      "Always check creatinine BEFORE administering contrast dye or nephrotoxic medications",
      "Creatinine is a LAGGING indicator - 50% of kidney function is lost before it rises",
      "Acute rise of 0.3 mg/dL within 48 hours = Acute Kidney Injury (KDIGO criteria)",
      "Elderly patients may have 'normal' creatinine despite significant kidney disease due to low muscle mass"
    ],
    practiceQuestions: [
      {
        question: "A patient's serum creatinine rises from 1.0 to 1.8 mg/dL over 24 hours. The BUN is 42 mg/dL. The nurse calculates a BUN:creatinine ratio of approximately 23:1. What does this suggest?",
        options: [
          "Intrarenal kidney injury from nephrotoxic medication",
          "Prerenal azotemia, likely from dehydration or decreased perfusion",
          "Postrenal obstruction from kidney stones",
          "Normal kidney function with expected variation"
        ],
        correctIndex: 1,
        rationale: "A BUN:creatinine ratio greater than 20:1 indicates prerenal azotemia, where reduced renal perfusion (from dehydration, heart failure, or shock) causes the kidneys to reabsorb more BUN but not creatinine. The rapid creatinine rise also meets AKI criteria."
      },
      {
        question: "A nurse is preparing a patient for a CT scan with IV contrast. The patient's creatinine is 2.4 mg/dL. What is the priority nursing action?",
        options: [
          "Proceed with the scan as ordered",
          "Administer acetaminophen for potential allergic reaction",
          "Notify the provider of the elevated creatinine before the procedure",
          "Increase the contrast dose for better imaging"
        ],
        correctIndex: 2,
        rationale: "IV contrast is nephrotoxic and can cause contrast-induced nephropathy, especially in patients with pre-existing renal impairment (elevated creatinine). The nurse must notify the provider so the risk-benefit can be assessed and renal-protective measures (hydration, reduced contrast volume, or alternative imaging) can be implemented."
      },
      {
        question: "Which medication should a nurse question giving to a patient with a creatinine of 3.2 mg/dL?",
        options: [
          "Acetaminophen 650 mg PO",
          "Metformin 500 mg PO",
          "Ondansetron 4 mg IV",
          "Famotidine 20 mg PO"
        ],
        correctIndex: 1,
        rationale: "Metformin is contraindicated in patients with significant renal impairment (creatinine >1.5 in males, >1.4 in females, or eGFR <30) due to the risk of lactic acidosis. Impaired kidneys cannot adequately clear metformin, allowing it to accumulate to toxic levels."
      }
    ],
    relatedLabSlugs: ["potassium", "sodium"],
    relatedLessonIds: ["aki-management-np"],
    faqItems: [
      {
        question: "What does a high creatinine level indicate?",
        answer: "A high creatinine level indicates that the kidneys are not filtering waste products effectively. It can be caused by acute kidney injury, chronic kidney disease, dehydration, medications, or conditions that damage the kidneys."
      },
      {
        question: "What is the BUN-to-creatinine ratio?",
        answer: "The BUN:creatinine ratio helps determine the cause of kidney dysfunction. A ratio greater than 20:1 suggests prerenal causes (dehydration, heart failure), while a ratio of 10-20:1 suggests intrarenal damage. Normal ratio is approximately 10-20:1."
      },
      {
        question: "Can creatinine levels be normal despite kidney disease?",
        answer: "Yes. In patients with low muscle mass (elderly, cachectic, or bedridden patients), creatinine production is decreased, which can mask impaired kidney function. In these cases, cystatin C or calculated GFR provides more accurate assessment."
      }
    ]
  },
  {
    slug: "inr",
    name: "INR",
    fullName: "International Normalized Ratio (INR)",
    h1Title: "INR Lab Values: Normal Range, Therapeutic Range & Nursing Guide",
    metaDescription: "Learn INR normal range 0.8-1.2, therapeutic range 2.0-3.0 for warfarin, causes of elevated and low INR, nursing interventions, and NCLEX practice questions.",
    keywords: "INR lab values, international normalized ratio, warfarin monitoring, anticoagulation nursing, bleeding risk INR, NCLEX lab values",
    normalRange: {
      value: "0.8-1.2",
      unit: "(ratio)",
      notes: "Therapeutic range for warfarin therapy is typically 2.0-3.0; higher range (2.5-3.5) for mechanical heart valves"
    },
    overview: "The International Normalized Ratio (INR) is a standardized measurement of the extrinsic coagulation pathway derived from the prothrombin time (PT). It was developed to provide consistency across laboratories regardless of the thromboplastin reagent used. INR is the primary test used to monitor warfarin (Coumadin) anticoagulation therapy. A higher INR indicates blood takes longer to clot, while a lower INR indicates faster clotting.",
    clinicalSignificance: "INR monitoring is essential for safe warfarin therapy. Warfarin has a narrow therapeutic index, meaning small dose changes can produce large effects on coagulation. An INR below the therapeutic range increases the risk of thromboembolic events (stroke, DVT, PE), while an INR above the therapeutic range increases bleeding risk. Regular INR monitoring and dose adjustments are required throughout warfarin therapy.",
    highCauses: [
      { condition: "Warfarin overdose or dose adjustment", explanation: "Excessive warfarin inhibits vitamin K-dependent clotting factor synthesis" },
      { condition: "Liver disease", explanation: "Impaired hepatic synthesis of clotting factors prolongs coagulation" },
      { condition: "Vitamin K deficiency", explanation: "Inadequate vitamin K reduces production of factors II, VII, IX, and X" },
      { condition: "Drug interactions", explanation: "Many drugs increase warfarin effect: antibiotics, NSAIDs, acetaminophen (high dose), amiodarone" },
      { condition: "Dietary changes", explanation: "Decreased vitamin K intake (reduced green leafy vegetables) potentiates warfarin" },
      { condition: "DIC", explanation: "Disseminated intravascular coagulation consumes clotting factors" }
    ],
    lowCauses: [
      { condition: "Warfarin non-adherence", explanation: "Missing doses allows clotting factors to normalize" },
      { condition: "Increased vitamin K intake", explanation: "High intake of green leafy vegetables antagonizes warfarin effect" },
      { condition: "Drug interactions", explanation: "Rifampin, carbamazepine, and St. John's Wort increase warfarin metabolism" },
      { condition: "Subtherapeutic dosing", explanation: "Insufficient warfarin dose to achieve target INR" }
    ],
    criticalValues: {
      high: ">5.0 (or any INR with active bleeding)",
      low: "<1.5 in patients requiring anticoagulation",
      action: "For INR >5.0 without bleeding: hold warfarin, consider oral vitamin K. For INR >9.0 or any INR with active bleeding: administer IV vitamin K, consider fresh frozen plasma or prothrombin complex concentrate. For subtherapeutic INR in high-risk patient: consider bridging with heparin."
    },
    nursingInterventions: {
      forHigh: [
        "Hold warfarin and notify provider immediately",
        "Assess for signs of bleeding: bruising, petechiae, hematuria, melena, hemoptysis, gum bleeding",
        "Assess neurological status for signs of intracranial hemorrhage (headache, altered LOC, unequal pupils)",
        "Administer vitamin K (phytonadione) as ordered - oral for non-emergent, IV for life-threatening bleeding",
        "Apply prolonged pressure to any venipuncture or injection sites",
        "Implement bleeding precautions: soft toothbrush, electric razor, avoid IM injections",
        "Avoid antiplatelet medications (aspirin, NSAIDs) unless specifically ordered",
        "Have fresh frozen plasma available for severe hemorrhage"
      ],
      forLow: [
        "Notify provider for dose adjustment",
        "Assess for signs of thromboembolism: unilateral leg swelling, chest pain, dyspnea, neurological changes",
        "Educate patient on medication adherence",
        "Review dietary intake for excessive vitamin K (consistent intake is key, not avoidance)",
        "Review all medications including OTC and herbal supplements for interactions",
        "Consider heparin bridge therapy for high-risk patients while adjusting warfarin"
      ]
    },
    examTips: [
      "Normal INR: 0.8-1.2; Therapeutic on warfarin: 2.0-3.0; Mechanical valve: 2.5-3.5",
      "INR monitors WARFARIN (extrinsic pathway); aPTT monitors HEPARIN (intrinsic pathway)",
      "Warfarin antidote = Vitamin K (phytonadione); Heparin antidote = Protamine sulfate",
      "Teach patients to maintain CONSISTENT vitamin K intake (not eliminate it)",
      "Green leafy vegetables (kale, spinach, broccoli) are high in vitamin K and can decrease INR",
      "Warfarin is teratogenic - contraindicated in pregnancy (use heparin instead)",
      "Multiple drug interactions: antibiotics, amiodarone, NSAIDs increase INR; rifampin decreases INR"
    ],
    practiceQuestions: [
      {
        question: "A patient on warfarin has an INR of 7.2 and no signs of active bleeding. What is the priority nursing action?",
        options: [
          "Continue warfarin at the current dose",
          "Administer protamine sulfate IV",
          "Hold warfarin and administer oral vitamin K as ordered",
          "Administer fresh frozen plasma immediately"
        ],
        correctIndex: 2,
        rationale: "For a supratherapeutic INR >5.0 without active bleeding, the standard approach is to hold warfarin and administer oral vitamin K. Protamine sulfate is the antidote for heparin, not warfarin. FFP is reserved for life-threatening hemorrhage. Continuing warfarin would further increase bleeding risk."
      },
      {
        question: "A nurse is educating a patient newly started on warfarin. Which statement by the patient indicates understanding?",
        options: [
          "I need to eliminate all green vegetables from my diet",
          "I should keep my intake of vitamin K-rich foods consistent from week to week",
          "I can take ibuprofen for headaches while on this medication",
          "I only need to have my blood tested once when I start the medication"
        ],
        correctIndex: 1,
        rationale: "Patients on warfarin should maintain CONSISTENT vitamin K intake rather than eliminating it. Sudden increases or decreases in vitamin K intake will cause INR fluctuations. Ibuprofen (NSAID) increases bleeding risk. Regular INR monitoring is required throughout therapy."
      },
      {
        question: "A patient on warfarin for atrial fibrillation has an INR of 1.4. What is the nursing concern?",
        options: [
          "The patient is at increased risk for bleeding",
          "The patient is at increased risk for stroke",
          "The INR is within the normal therapeutic range",
          "Warfarin should be discontinued immediately"
        ],
        correctIndex: 1,
        rationale: "The therapeutic INR range for atrial fibrillation is 2.0-3.0. An INR of 1.4 is subtherapeutic, meaning the patient is not adequately anticoagulated and is at increased risk for thromboembolic events, particularly stroke. The provider should be notified for dose adjustment."
      }
    ],
    relatedLabSlugs: ["troponin", "creatinine"],
    relatedLessonIds: [],
    faqItems: [
      {
        question: "What is the difference between PT and INR?",
        answer: "PT (prothrombin time) measures the time it takes for blood to clot via the extrinsic pathway. INR standardizes the PT result using an international sensitivity index, making results comparable across laboratories. INR is preferred for monitoring warfarin therapy."
      },
      {
        question: "What INR level is dangerous?",
        answer: "An INR above 5.0 significantly increases bleeding risk and requires intervention. An INR above 9.0 is a medical emergency. However, any INR with active bleeding is dangerous regardless of the number. Subtherapeutic INR (<2.0 on warfarin) increases clotting risk."
      },
      {
        question: "How often should INR be checked on warfarin?",
        answer: "INR should be checked frequently when starting warfarin (every 1-3 days) until stable, then weekly for 1-2 weeks, and eventually monthly once the dose is stable and consistent INR values are achieved. Any medication, dietary, or health changes require more frequent monitoring."
      }
    ]
  },
  {
    slug: "calcium",
    name: "Calcium",
    fullName: "Serum Calcium (Ca2+)",
    h1Title: "Calcium Lab Values: Normal Range, Clinical Significance & Nursing Guide",
    metaDescription: "Learn calcium (Ca2+) normal range 8.5-10.5 mg/dL, causes of hypercalcemia and hypocalcemia, nursing interventions, and NCLEX practice questions.",
    keywords: "calcium lab values, hypercalcemia, hypocalcemia, Ca2+ normal range, calcium nursing, NCLEX lab values, Chvostek sign, Trousseau sign",
    normalRange: {
      value: "8.5-10.5",
      unit: "mg/dL",
      notes: "Ionized calcium (1.12-1.32 mmol/L) is the physiologically active form; always check albumin level for corrected calcium"
    },
    overview: "Calcium is the most abundant mineral in the body, with 99% stored in bones and teeth. The remaining 1% circulates in the blood in three forms: ionized (free, physiologically active ~45%), protein-bound (~40%), and complexed with anions (~15%). Calcium is essential for bone formation, muscle contraction, nerve impulse transmission, blood clotting, and cardiac function. Serum calcium is tightly regulated by parathyroid hormone (PTH), calcitonin, and vitamin D.",
    clinicalSignificance: "Calcium imbalances directly affect neuromuscular excitability and cardiac function. Hypocalcemia increases neuromuscular excitability, leading to tetany and seizures. Hypercalcemia decreases neuromuscular excitability and can cause life-threatening cardiac arrhythmias. Because approximately 40% of calcium is bound to albumin, total calcium must be corrected for albumin levels: corrected Ca = measured Ca + 0.8 × (4.0 - albumin).",
    highCauses: [
      { condition: "Primary hyperparathyroidism", explanation: "Excess PTH from parathyroid adenoma increases bone resorption and renal calcium reabsorption" },
      { condition: "Malignancy", explanation: "Tumors produce PTHrP (parathyroid hormone-related protein) or metastasize to bone, releasing calcium" },
      { condition: "Immobility", explanation: "Prolonged bed rest causes bone demineralization and calcium release into the blood" },
      { condition: "Thiazide diuretics", explanation: "Thiazides reduce renal calcium excretion, increasing serum levels" },
      { condition: "Excessive vitamin D intake", explanation: "Vitamin D toxicity enhances intestinal calcium absorption" }
    ],
    lowCauses: [
      { condition: "Hypoparathyroidism", explanation: "Insufficient PTH (often post-thyroidectomy) reduces calcium reabsorption and bone mobilization" },
      { condition: "Chronic kidney disease", explanation: "Impaired vitamin D activation and hyperphosphatemia bind calcium" },
      { condition: "Vitamin D deficiency", explanation: "Inadequate vitamin D impairs intestinal calcium absorption" },
      { condition: "Hypomagnesemia", explanation: "Low magnesium impairs PTH secretion and PTH receptor function" },
      { condition: "Acute pancreatitis", explanation: "Calcium is sequestered by saponification of peripancreatic fat" }
    ],
    criticalValues: {
      high: ">12.0 mg/dL",
      low: "<7.0 mg/dL",
      action: "For critical hypercalcemia: aggressive IV normal saline hydration, loop diuretics (furosemide) to promote calcium excretion, calcitonin for rapid effect, bisphosphonates for sustained reduction. For critical hypocalcemia: IV calcium gluconate via infusion pump with cardiac monitoring, seizure precautions."
    },
    nursingInterventions: {
      forHigh: [
        "Administer IV normal saline aggressively to promote renal calcium excretion",
        "Administer loop diuretics (furosemide) as ordered to enhance calciuresis",
        "Monitor cardiac rhythm for shortened QT interval and arrhythmias",
        "Encourage ambulation if possible to reduce bone resorption",
        "Monitor for renal calculi (flank pain, hematuria)",
        "Assess for lethargy, confusion, constipation, and muscle weakness",
        "Maintain strict intake and output monitoring"
      ],
      forLow: [
        "Administer IV calcium gluconate slowly via infusion pump (never IV push rapidly)",
        "Place patient on continuous cardiac monitoring for prolonged QT interval",
        "Implement seizure precautions",
        "Assess for Chvostek sign (facial twitching with nerve tap) and Trousseau sign (carpopedal spasm with BP cuff)",
        "Monitor for numbness, tingling, and muscle cramps",
        "Administer oral calcium and vitamin D supplements as ordered",
        "Check magnesium level - correct hypomagnesemia before calcium will normalize"
      ]
    },
    examTips: [
      "Chvostek sign = facial twitching when tapping facial nerve (CN VII) anterior to ear → hypocalcemia",
      "Trousseau sign = carpopedal spasm when BP cuff inflated above systolic for 3 minutes → hypocalcemia",
      "Calcium and phosphorus have an INVERSE relationship (when one goes up, the other goes down)",
      "Post-thyroidectomy: monitor for hypocalcemia from accidental parathyroid removal",
      "Hypercalcemia mnemonic: 'Stones, Bones, Groans, and Psychiatric Moans'",
      "Always correct total calcium for albumin level: corrected Ca = measured Ca + 0.8 × (4.0 - albumin)"
    ],
    practiceQuestions: [
      {
        question: "A patient 24 hours post-thyroidectomy reports numbness and tingling around the mouth. Which assessment should the nurse perform first?",
        options: [
          "Check the surgical incision for bleeding",
          "Tap the facial nerve anterior to the ear and check for twitching",
          "Assess the patient's blood glucose level",
          "Evaluate the patient's oxygen saturation"
        ],
        correctIndex: 1,
        rationale: "Perioral numbness and tingling after thyroidectomy suggest hypocalcemia from accidental parathyroid gland damage. The nurse should check for Chvostek sign (tapping the facial nerve causes facial twitching), which confirms neuromuscular irritability from low calcium."
      },
      {
        question: "A patient with a calcium level of 6.8 mg/dL is ordered IV calcium gluconate. Which nursing action is most important?",
        options: [
          "Administer the calcium via rapid IV push",
          "Place the patient on continuous cardiac monitoring during infusion",
          "Hold the calcium if the patient has a normal phosphorus level",
          "Mix the calcium with sodium bicarbonate for faster absorption"
        ],
        correctIndex: 1,
        rationale: "IV calcium gluconate must be administered slowly with continuous cardiac monitoring because rapid infusion can cause cardiac arrest. Calcium should never be mixed with sodium bicarbonate as it will precipitate."
      },
      {
        question: "Which patient is at greatest risk for hypercalcemia?",
        options: [
          "A patient with chronic kidney disease on dialysis",
          "A patient with lung cancer and bone metastases",
          "A patient taking loop diuretics daily",
          "A patient recovering from acute pancreatitis"
        ],
        correctIndex: 1,
        rationale: "Malignancy with bone metastases is a leading cause of hypercalcemia. Cancer cells in bone cause osteolysis, releasing calcium. Some tumors also produce PTHrP. CKD, loop diuretics, and pancreatitis are associated with hypocalcemia, not hypercalcemia."
      }
    ],
    relatedLabSlugs: ["magnesium", "creatinine", "potassium"],
    relatedLessonIds: [],
    faqItems: [
      {
        question: "What is the normal calcium level?",
        answer: "The normal total serum calcium level is 8.5-10.5 mg/dL (2.12-2.62 mmol/L). Ionized calcium, the physiologically active form, is normally 1.12-1.32 mmol/L (4.5-5.3 mg/dL). Total calcium should be corrected for albumin levels."
      },
      {
        question: "What are the signs of low calcium?",
        answer: "Signs of hypocalcemia include numbness and tingling (especially perioral and in extremities), muscle cramps, tetany, positive Chvostek sign, positive Trousseau sign, hyperactive reflexes, and in severe cases, laryngospasm and seizures."
      },
      {
        question: "Why is calcium important after thyroid surgery?",
        answer: "The parathyroid glands are located on the posterior surface of the thyroid and can be accidentally damaged or removed during thyroidectomy. Without PTH, calcium levels drop rapidly. Nurses must monitor for hypocalcemia signs for 24-72 hours post-thyroidectomy."
      }
    ]
  },
  {
    slug: "magnesium",
    name: "Magnesium",
    fullName: "Serum Magnesium (Mg2+)",
    h1Title: "Magnesium Lab Values: Normal Range, Clinical Significance & Nursing Guide",
    metaDescription: "Learn magnesium (Mg2+) normal range 1.5-2.5 mEq/L, causes of hypomagnesemia and hypermagnesemia, nursing interventions, and NCLEX practice questions.",
    keywords: "magnesium lab values, hypomagnesemia, hypermagnesemia, Mg2+ normal range, electrolyte nursing, NCLEX lab values, torsades de pointes",
    normalRange: {
      value: "1.5-2.5",
      unit: "mEq/L",
      notes: "Also reported as 1.8-3.0 mg/dL; fourth most abundant cation in the body"
    },
    overview: "Magnesium is the fourth most abundant cation in the body and the second most abundant intracellular cation after potassium. Approximately 50-60% is stored in bone, 39% is intracellular, and only 1% is in the extracellular fluid. Magnesium is essential for over 300 enzymatic reactions, including ATP production, protein synthesis, neuromuscular function, and cardiac conduction. It plays a critical role in regulating calcium and potassium channels.",
    clinicalSignificance: "Magnesium is often called the 'forgotten electrolyte' because it is frequently overlooked despite its critical importance. Hypomagnesemia is extremely common in hospitalized patients (up to 65% of ICU patients) and is often the underlying cause of refractory hypokalemia and hypocalcemia. Magnesium must be corrected before potassium or calcium will normalize. Hypermagnesemia is less common but can occur with renal failure or excessive magnesium administration.",
    highCauses: [
      { condition: "Renal failure", explanation: "Impaired renal excretion is the most common cause, as the kidneys regulate 95% of magnesium balance" },
      { condition: "Excessive magnesium administration", explanation: "IV magnesium sulfate for eclampsia or tocolysis can cause iatrogenic hypermagnesemia" },
      { condition: "Adrenal insufficiency", explanation: "Aldosterone deficiency reduces renal magnesium excretion" },
      { condition: "Antacid/laxative overuse", explanation: "Magnesium-containing products (Maalox, milk of magnesia) can elevate levels in renal impairment" },
      { condition: "Lithium therapy", explanation: "Lithium reduces renal magnesium excretion" }
    ],
    lowCauses: [
      { condition: "Chronic alcoholism", explanation: "Alcohol increases renal magnesium excretion and impairs intestinal absorption (most common cause)" },
      { condition: "Loop and thiazide diuretics", explanation: "Both drug classes increase renal magnesium wasting" },
      { condition: "Malnutrition/malabsorption", explanation: "Inadequate dietary intake or GI conditions (Crohn's, celiac) impair magnesium absorption" },
      { condition: "Proton pump inhibitors (PPIs)", explanation: "Long-term PPI use reduces intestinal magnesium absorption" },
      { condition: "Diabetic ketoacidosis", explanation: "Osmotic diuresis from hyperglycemia causes renal magnesium loss" }
    ],
    criticalValues: {
      high: ">5.0 mEq/L",
      low: "<1.0 mEq/L",
      action: "For critical hypermagnesemia: stop all magnesium-containing products, administer IV calcium gluconate as an antagonist, aggressive IV normal saline with furosemide to promote renal excretion, prepare for dialysis if renal failure. For critical hypomagnesemia: IV magnesium sulfate replacement, continuous cardiac monitoring, correct concurrent hypokalemia and hypocalcemia."
    },
    nursingInterventions: {
      forHigh: [
        "Discontinue all magnesium-containing medications and supplements immediately",
        "Administer IV calcium gluconate as a direct antagonist to magnesium effects",
        "Administer IV normal saline with loop diuretics to promote renal excretion",
        "Monitor deep tendon reflexes (DTRs) - absent reflexes indicate severe toxicity",
        "Monitor respiratory rate and depth - respiratory depression is a late sign",
        "Place on continuous cardiac monitoring for bradycardia and heart block",
        "Assess for hypotension, flushing, and lethargy"
      ],
      forLow: [
        "Administer IV magnesium sulfate via infusion pump (1-2 g over 1-2 hours)",
        "Monitor cardiac rhythm for torsades de pointes, PVCs, and prolonged QT",
        "Assess and monitor deep tendon reflexes",
        "Check potassium and calcium levels - correct magnesium FIRST",
        "Implement seizure precautions",
        "Encourage magnesium-rich foods: nuts, green leafy vegetables, whole grains, legumes",
        "Assess for tremors, hyperreflexia, and muscle cramps"
      ]
    },
    examTips: [
      "Hypomagnesemia causes refractory hypokalemia - always check Mg2+ when K+ won't correct",
      "Magnesium sulfate is the treatment for torsades de pointes (polymorphic V-tach with prolonged QT)",
      "Magnesium sulfate is used in eclampsia/preeclampsia - monitor DTRs, respiratory rate, and urine output",
      "Hypermagnesemia toxicity: first loss of DTRs → then respiratory depression → then cardiac arrest",
      "Alcohol use disorder is the #1 cause of hypomagnesemia",
      "Calcium gluconate is the antidote for magnesium toxicity"
    ],
    practiceQuestions: [
      {
        question: "A patient on a magnesium sulfate drip for preeclampsia has absent deep tendon reflexes. What is the priority nursing action?",
        options: [
          "Increase the infusion rate to prevent seizures",
          "Stop the magnesium infusion and notify the provider",
          "Document the finding and reassess in 1 hour",
          "Administer a fluid bolus of normal saline"
        ],
        correctIndex: 1,
        rationale: "Absent deep tendon reflexes are the earliest sign of magnesium toxicity. The infusion must be stopped immediately because the next progression is respiratory depression followed by cardiac arrest. Calcium gluconate should be available at the bedside as the antidote."
      },
      {
        question: "A nurse is unable to correct a patient's potassium level despite multiple IV potassium replacements. What should the nurse check?",
        options: [
          "Serum sodium level",
          "Serum magnesium level",
          "Serum chloride level",
          "Serum phosphorus level"
        ],
        correctIndex: 1,
        rationale: "Hypomagnesemia causes refractory hypokalemia because magnesium is required for the Na+/K+-ATPase pump to function properly. Without adequate magnesium, potassium cannot be retained intracellularly and will continue to be wasted by the kidneys."
      },
      {
        question: "Which cardiac arrhythmia is specifically treated with IV magnesium sulfate?",
        options: [
          "Atrial fibrillation",
          "Sinus bradycardia",
          "Torsades de pointes",
          "First-degree heart block"
        ],
        correctIndex: 2,
        rationale: "Torsades de pointes is a polymorphic ventricular tachycardia associated with prolonged QT interval. IV magnesium sulfate is the first-line treatment as it stabilizes the cardiac cell membrane and shortens the QT interval."
      }
    ],
    relatedLabSlugs: ["calcium", "potassium", "sodium"],
    relatedLessonIds: [],
    faqItems: [
      {
        question: "What is the normal magnesium level?",
        answer: "The normal serum magnesium level is 1.5-2.5 mEq/L (1.8-3.0 mg/dL). Since only 1% of total body magnesium is in the blood, serum levels may not accurately reflect total body stores. Clinical assessment of symptoms is important."
      },
      {
        question: "Why is magnesium important in nursing?",
        answer: "Magnesium is critical because it affects potassium and calcium balance, cardiac rhythm, neuromuscular function, and is used therapeutically in eclampsia, torsades de pointes, and asthma. Nurses must monitor for both deficiency and toxicity signs."
      },
      {
        question: "What happens if magnesium is too low?",
        answer: "Low magnesium (hypomagnesemia) causes neuromuscular irritability (tremors, hyperreflexia, seizures), cardiac arrhythmias (torsades de pointes, PVCs), and prevents correction of low potassium and calcium levels."
      }
    ]
  },
  {
    slug: "bicarbonate",
    name: "Bicarbonate",
    fullName: "Serum Bicarbonate (HCO3-)",
    h1Title: "Bicarbonate Lab Values: Normal Range, Clinical Significance & Nursing Guide",
    metaDescription: "Learn bicarbonate (HCO3-) normal range 22-26 mEq/L, metabolic acidosis and alkalosis causes, ABG interpretation, nursing interventions, and NCLEX practice questions.",
    keywords: "bicarbonate lab values, HCO3 normal range, metabolic acidosis, metabolic alkalosis, ABG interpretation nursing, NCLEX lab values, acid-base balance",
    normalRange: {
      value: "22-26",
      unit: "mEq/L",
      notes: "Represents the metabolic component of acid-base balance; regulated by the kidneys"
    },
    overview: "Bicarbonate (HCO3-) is the primary buffer in the blood and represents the metabolic component of acid-base balance. It is regulated by the kidneys through reabsorption in the proximal tubule and regeneration in the distal tubule. The bicarbonate-carbonic acid buffer system maintains blood pH within the narrow range of 7.35-7.45. Bicarbonate works in conjunction with carbon dioxide (the respiratory component) to maintain acid-base homeostasis.",
    clinicalSignificance: "Bicarbonate levels are essential for interpreting arterial blood gases (ABGs) and diagnosing acid-base disorders. A low bicarbonate indicates metabolic acidosis, while a high bicarbonate indicates metabolic alkalosis. Understanding bicarbonate is fundamental to interpreting the anion gap, determining compensation patterns, and guiding treatment for critically ill patients.",
    highCauses: [
      { condition: "Prolonged vomiting/NG suction", explanation: "Loss of hydrochloric acid (HCl) from the stomach leaves excess bicarbonate (contraction alkalosis)" },
      { condition: "Excessive antacid or bicarbonate use", explanation: "Exogenous bicarbonate administration raises serum levels directly" },
      { condition: "Loop and thiazide diuretics", explanation: "Volume contraction concentrates bicarbonate and triggers renal bicarbonate reabsorption" },
      { condition: "Cushing syndrome", explanation: "Excess cortisol promotes hydrogen ion excretion and bicarbonate retention by the kidneys" },
      { condition: "Hypokalemia", explanation: "Low potassium causes the kidneys to excrete hydrogen ions and retain bicarbonate in exchange" }
    ],
    lowCauses: [
      { condition: "Diabetic ketoacidosis (DKA)", explanation: "Ketoacid accumulation consumes bicarbonate as it buffers excess hydrogen ions" },
      { condition: "Lactic acidosis", explanation: "Tissue hypoperfusion causes anaerobic metabolism and lactic acid production, consuming bicarbonate" },
      { condition: "Renal failure", explanation: "Damaged kidneys cannot regenerate bicarbonate or excrete hydrogen ions" },
      { condition: "Severe diarrhea", explanation: "GI losses of bicarbonate-rich intestinal secretions cause hyperchloremic metabolic acidosis" },
      { condition: "Renal tubular acidosis", explanation: "Defective tubular reabsorption of bicarbonate or hydrogen ion excretion" }
    ],
    criticalValues: {
      high: ">35 mEq/L",
      low: "<10 mEq/L",
      action: "For critical metabolic acidosis (HCO3- <10): treat underlying cause (DKA: insulin, lactic acidosis: improve perfusion), consider IV sodium bicarbonate only if pH <7.1, monitor for cardiac arrhythmias. For critical metabolic alkalosis (HCO3- >35): replace potassium and chloride, administer IV normal saline, hold diuretics."
    },
    nursingInterventions: {
      forHigh: [
        "Administer IV normal saline to correct volume contraction and dilute bicarbonate",
        "Replace potassium chloride as ordered (corrects the underlying alkalosis trigger)",
        "Hold diuretics that contribute to alkalosis",
        "Monitor for signs of alkalosis: confusion, muscle twitching, tetany",
        "Assess respiratory rate - expect compensatory hypoventilation (slow, shallow breathing)",
        "Monitor cardiac rhythm for arrhythmias associated with concurrent hypokalemia"
      ],
      forLow: [
        "Identify and treat the underlying cause of acidosis (DKA, sepsis, renal failure)",
        "Administer IV sodium bicarbonate only if pH <7.1 and ordered by provider",
        "Monitor respiratory rate and pattern - expect compensatory hyperventilation (Kussmaul breathing)",
        "Place on continuous cardiac monitoring for arrhythmias",
        "Monitor neurological status for confusion and decreased LOC",
        "Assess for signs of hyperkalemia (often accompanies metabolic acidosis)",
        "Maintain strict intake and output"
      ]
    },
    examTips: [
      "Bicarbonate = METABOLIC component; CO2 = RESPIRATORY component of ABGs",
      "Low HCO3- = metabolic acidosis; High HCO3- = metabolic alkalosis",
      "Kussmaul breathing (deep, rapid) = respiratory compensation for metabolic acidosis (blowing off CO2)",
      "DKA classic triad: hyperglycemia + ketonemia + metabolic acidosis (low HCO3-)",
      "Anion gap = Na+ - (Cl- + HCO3-); normal 8-12; elevated = suggests accumulation of unmeasured acids",
      "Vomiting causes metabolic ALKALOSIS (loss of HCl); diarrhea causes metabolic ACIDOSIS (loss of HCO3-)"
    ],
    practiceQuestions: [
      {
        question: "A patient in DKA has the following ABG: pH 7.22, PaCO2 22 mmHg, HCO3- 10 mEq/L. How should the nurse interpret these results?",
        options: [
          "Respiratory acidosis with metabolic compensation",
          "Metabolic acidosis with respiratory compensation",
          "Mixed respiratory and metabolic alkalosis",
          "Respiratory alkalosis, uncompensated"
        ],
        correctIndex: 1,
        rationale: "The pH is acidic (7.22), HCO3- is low (10 mEq/L) indicating metabolic acidosis, and the PaCO2 is low (22 mmHg) showing respiratory compensation (hyperventilation to blow off CO2). DKA produces ketoacids that consume bicarbonate, and the lungs compensate with Kussmaul breathing."
      },
      {
        question: "A patient with persistent vomiting has a bicarbonate of 34 mEq/L. Which electrolyte imbalance should the nurse expect?",
        options: [
          "Hyperkalemia",
          "Hypernatremia",
          "Hypokalemia",
          "Hyperphosphatemia"
        ],
        correctIndex: 2,
        rationale: "Vomiting causes loss of HCl and potassium from gastric secretions, resulting in metabolic alkalosis (elevated HCO3-) and hypokalemia. The hypokalemia also perpetuates the alkalosis because the kidneys excrete hydrogen ions instead of potassium to preserve potassium."
      },
      {
        question: "Which patient presentation is consistent with metabolic acidosis?",
        options: [
          "Slow, shallow breathing and muscle twitching",
          "Deep, rapid breathing (Kussmaul respirations) and confusion",
          "Bradypnea and hypertension",
          "Eupnea with muscle weakness"
        ],
        correctIndex: 1,
        rationale: "Metabolic acidosis triggers compensatory hyperventilation (Kussmaul breathing) to blow off CO2 and raise pH. Neurological symptoms (confusion, decreased LOC) result from acidotic effects on the brain. Slow, shallow breathing would be seen in metabolic alkalosis compensation."
      }
    ],
    relatedLabSlugs: ["sodium", "potassium", "bun", "creatinine"],
    relatedLessonIds: [],
    faqItems: [
      {
        question: "What is the normal bicarbonate level?",
        answer: "The normal serum bicarbonate level is 22-26 mEq/L. Values below 22 indicate metabolic acidosis (excess acid or bicarbonate loss), and values above 26 indicate metabolic alkalosis (excess bicarbonate or acid loss)."
      },
      {
        question: "How does bicarbonate relate to ABG interpretation?",
        answer: "Bicarbonate represents the metabolic component in ABG analysis. To interpret ABGs: 1) Check pH for acidosis (<7.35) or alkalosis (>7.45), 2) Check PaCO2 (respiratory component), 3) Check HCO3- (metabolic component), 4) Determine which matches the pH direction, 5) Assess for compensation."
      },
      {
        question: "Why does vomiting cause high bicarbonate?",
        answer: "Vomiting removes hydrochloric acid (HCl) from the stomach. When acid is lost, the body retains bicarbonate to maintain electroneutrality. Additionally, volume contraction from vomiting triggers the kidneys to reabsorb more bicarbonate. This is called contraction alkalosis."
      }
    ]
  },
  {
    slug: "bun",
    name: "BUN",
    fullName: "Blood Urea Nitrogen (BUN)",
    h1Title: "BUN Lab Values: Normal Range, Clinical Significance & Nursing Guide",
    metaDescription: "Learn BUN normal range 7-20 mg/dL, causes of elevated and low BUN, BUN-to-creatinine ratio, nursing interventions, and NCLEX practice questions.",
    keywords: "BUN lab values, blood urea nitrogen, BUN normal range, BUN creatinine ratio, kidney function nursing, prerenal azotemia, NCLEX lab values",
    normalRange: {
      value: "7-20",
      unit: "mg/dL",
      notes: "BUN is affected by protein intake, hydration, liver function, and kidney function; less specific for kidney function than creatinine"
    },
    overview: "Blood urea nitrogen (BUN) is a waste product of protein metabolism. When proteins are broken down, the liver converts the amino group to ammonia, then to urea via the urea cycle. Urea is transported in the blood to the kidneys, where it is filtered and excreted. Unlike creatinine, BUN is reabsorbed by the renal tubules (40-60% is normally reabsorbed), making it more susceptible to non-renal factors such as dehydration, dietary protein intake, and GI bleeding.",
    clinicalSignificance: "BUN is most useful when evaluated alongside creatinine as the BUN-to-creatinine ratio. A ratio >20:1 suggests prerenal causes (dehydration, heart failure, GI bleeding), while a ratio 10-20:1 is normal. BUN alone is an imprecise measure of kidney function because it is influenced by many non-renal factors. However, markedly elevated BUN (uremia) causes symptoms including nausea, altered mental status, pericarditis, and platelet dysfunction.",
    highCauses: [
      { condition: "Dehydration/Prerenal azotemia", explanation: "Decreased renal blood flow increases tubular urea reabsorption, elevating BUN disproportionately to creatinine" },
      { condition: "GI bleeding", explanation: "Blood proteins are digested and metabolized to urea, significantly raising BUN" },
      { condition: "Acute or chronic kidney disease", explanation: "Impaired glomerular filtration reduces urea clearance" },
      { condition: "High protein intake/catabolism", explanation: "Increased protein breakdown from diet, burns, sepsis, or steroids produces more urea" },
      { condition: "Heart failure", explanation: "Poor cardiac output decreases renal perfusion, causing prerenal elevation of BUN" }
    ],
    lowCauses: [
      { condition: "Severe liver disease", explanation: "The damaged liver cannot synthesize urea from ammonia via the urea cycle" },
      { condition: "Malnutrition/Low protein intake", explanation: "Insufficient protein substrate reduces urea production" },
      { condition: "Overhydration", explanation: "Excessive fluid intake dilutes BUN concentration" },
      { condition: "Pregnancy", explanation: "Increased plasma volume and GFR dilute BUN and increase clearance" },
      { condition: "SIADH", explanation: "Water retention dilutes serum BUN levels" }
    ],
    criticalValues: {
      high: ">100 mg/dL (uremic symptoms likely)",
      low: "<2 mg/dL (may indicate severe hepatic failure)",
      action: "For critical BUN elevation with uremic symptoms (encephalopathy, pericarditis, bleeding): prepare for emergent dialysis, monitor for pericardial friction rub, assess neurological status frequently. For severely low BUN: assess liver function and nutritional status."
    },
    nursingInterventions: {
      forHigh: [
        "Assess hydration status: skin turgor, mucous membranes, urine output, daily weights",
        "Administer IV fluids for dehydration/prerenal azotemia as ordered",
        "Monitor BUN-to-creatinine ratio to differentiate prerenal from intrinsic renal causes",
        "Assess for uremic symptoms: nausea, confusion, asterixis (flapping tremor), pericardial friction rub",
        "Implement dietary protein restrictions as ordered for chronic elevation",
        "Monitor for GI bleeding (melena, hematemesis) as a potential cause of elevated BUN",
        "Monitor intake and output strictly"
      ],
      forLow: [
        "Assess nutritional status and dietary protein intake",
        "Evaluate liver function tests if hepatic cause suspected",
        "Monitor for signs of fluid overload if dilutional cause",
        "Encourage adequate protein intake if related to malnutrition",
        "Assess for signs of liver failure: jaundice, coagulopathy, encephalopathy"
      ]
    },
    examTips: [
      "BUN-to-creatinine ratio >20:1 = prerenal cause (dehydration, heart failure, GI bleeding)",
      "GI bleeding ELEVATES BUN because digested blood proteins are metabolized to urea",
      "BUN is LESS specific for kidney function than creatinine - it is affected by diet, hydration, and liver function",
      "Uremia symptoms: nausea, metallic taste, asterixis, pericarditis, platelet dysfunction, frost on skin (uremic frost)",
      "In liver failure, BUN may be LOW even with kidney dysfunction because the liver cannot make urea",
      "Always check creatinine alongside BUN for accurate kidney assessment"
    ],
    practiceQuestions: [
      {
        question: "A patient has a BUN of 52 mg/dL and creatinine of 1.2 mg/dL. What is the most likely cause?",
        options: [
          "Intrinsic acute kidney injury",
          "Dehydration or GI bleeding",
          "Chronic kidney disease stage 4",
          "Medication-induced nephrotoxicity"
        ],
        correctIndex: 1,
        rationale: "The BUN-to-creatinine ratio is approximately 43:1, which is markedly elevated (>20:1). This disproportionate BUN elevation with near-normal creatinine is classic for prerenal causes: dehydration (increased tubular reabsorption) or upper GI bleeding (protein metabolism to urea)."
      },
      {
        question: "A nurse is assessing a patient with a BUN of 110 mg/dL. Which assessment finding is most concerning?",
        options: [
          "Increased appetite",
          "Pericardial friction rub on auscultation",
          "Mild peripheral edema",
          "Urine specific gravity of 1.020"
        ],
        correctIndex: 1,
        rationale: "A pericardial friction rub in the setting of severe uremia (BUN >100) indicates uremic pericarditis, a life-threatening complication that requires urgent dialysis. Uremic toxins irritate the pericardial membranes, causing inflammation and potential cardiac tamponade."
      },
      {
        question: "A patient with cirrhosis has a BUN of 3 mg/dL. What does this finding suggest?",
        options: [
          "Excellent kidney function",
          "Severe hepatic dysfunction with impaired urea synthesis",
          "Overhydration requiring fluid restriction",
          "High protein diet compensating for liver disease"
        ],
        correctIndex: 1,
        rationale: "A critically low BUN in a patient with cirrhosis indicates that the liver can no longer convert ammonia to urea via the urea cycle. This is a sign of severe hepatic dysfunction and often correlates with elevated ammonia levels and hepatic encephalopathy."
      }
    ],
    relatedLabSlugs: ["creatinine", "sodium", "potassium"],
    relatedLessonIds: [],
    faqItems: [
      {
        question: "What is the normal BUN level?",
        answer: "The normal BUN level is 7-20 mg/dL. BUN measures urea nitrogen in the blood, which reflects protein metabolism and kidney excretion. Unlike creatinine, BUN is affected by diet, hydration, liver function, and GI bleeding."
      },
      {
        question: "What is the BUN-to-creatinine ratio?",
        answer: "The BUN-to-creatinine ratio helps determine the cause of kidney dysfunction. A ratio of 10-20:1 is normal. A ratio >20:1 suggests prerenal causes (dehydration, heart failure, GI bleeding) where BUN rises disproportionately. A ratio <10:1 may suggest liver disease or malnutrition."
      },
      {
        question: "Why does GI bleeding cause elevated BUN?",
        answer: "When blood enters the GI tract, the proteins (hemoglobin) in blood are digested by intestinal enzymes, producing amino acids that are metabolized by the liver into urea. This additional urea load raises BUN significantly while creatinine remains stable, producing a high BUN-to-creatinine ratio."
      }
    ]
  },
  {
    slug: "hemoglobin",
    name: "Hemoglobin",
    fullName: "Hemoglobin (Hgb/Hb)",
    h1Title: "Hemoglobin Lab Values: Normal Range, Clinical Significance & Nursing Guide",
    metaDescription: "Learn hemoglobin normal range 12-17 g/dL, causes of high and low hemoglobin, anemia types, nursing interventions, and NCLEX practice questions.",
    keywords: "hemoglobin lab values, hemoglobin normal range, anemia nursing, polycythemia, blood transfusion nursing, NCLEX lab values, CBC interpretation",
    normalRange: {
      value: "12.0-17.0",
      unit: "g/dL",
      notes: "Males: 14.0-17.0 g/dL; Females: 12.0-16.0 g/dL; varies with age and altitude"
    },
    overview: "Hemoglobin is the iron-containing protein in red blood cells responsible for oxygen transport from the lungs to the tissues and carbon dioxide transport back to the lungs. Each hemoglobin molecule can carry four oxygen molecules. Hemoglobin concentration is the primary measure used to diagnose anemia and polycythemia. It is measured as part of the complete blood count (CBC) and is one of the most frequently ordered laboratory tests in clinical practice.",
    clinicalSignificance: "Hemoglobin directly reflects the oxygen-carrying capacity of the blood. Low hemoglobin (anemia) impairs tissue oxygenation and triggers compensatory tachycardia, increased cardiac output, and potential heart failure in severe or chronic cases. The type of anemia is classified by red cell size (MCV): microcytic (<80 fL), normocytic (80-100 fL), or macrocytic (>100 fL). High hemoglobin (polycythemia) increases blood viscosity and risk of thrombosis.",
    highCauses: [
      { condition: "Polycythemia vera", explanation: "Myeloproliferative disorder causes uncontrolled RBC production independent of erythropoietin" },
      { condition: "Chronic hypoxia (COPD, high altitude)", explanation: "Persistent low oxygen triggers EPO release and compensatory erythropoiesis" },
      { condition: "Dehydration", explanation: "Reduced plasma volume concentrates hemoglobin (relative polycythemia)" },
      { condition: "Smoking", explanation: "Carbon monoxide exposure triggers compensatory RBC production and carboxyhemoglobin displaces O2" },
      { condition: "EPO-secreting tumors", explanation: "Renal cell carcinoma and hepatocellular carcinoma can produce erythropoietin ectopically" }
    ],
    lowCauses: [
      { condition: "Iron deficiency anemia", explanation: "Most common cause worldwide; insufficient iron for hemoglobin synthesis produces microcytic, hypochromic RBCs" },
      { condition: "Chronic disease/inflammation", explanation: "Cytokines (IL-6, hepcidin) sequester iron, reduce EPO production, and shorten RBC lifespan" },
      { condition: "Acute hemorrhage", explanation: "Rapid blood loss directly depletes circulating hemoglobin" },
      { condition: "Chronic kidney disease", explanation: "Decreased erythropoietin production reduces RBC production (normocytic anemia)" },
      { condition: "Vitamin B12/folate deficiency", explanation: "Impaired DNA synthesis produces large, immature RBCs (macrocytic/megaloblastic anemia)" }
    ],
    criticalValues: {
      high: ">20 g/dL",
      low: "<7.0 g/dL",
      action: "For critical low hemoglobin: type and crossmatch, prepare for packed RBC transfusion, monitor for transfusion reactions (fever, chills, urticaria, hemolytic reaction). For critical high hemoglobin: therapeutic phlebotomy for polycythemia vera, aggressive hydration, assess for hyperviscosity symptoms (headache, visual changes, thrombosis)."
    },
    nursingInterventions: {
      forHigh: [
        "Administer IV fluids to reduce blood viscosity",
        "Assist with therapeutic phlebotomy as ordered",
        "Assess for signs of hyperviscosity: headache, blurred vision, dizziness, ruddy complexion",
        "Monitor for thrombotic events: DVT, PE, stroke, MI",
        "Encourage adequate hydration",
        "Administer antiplatelet or anticoagulant therapy as ordered"
      ],
      forLow: [
        "Administer packed red blood cells as ordered with proper identification verification (two-nurse check)",
        "Monitor vital signs before, during (every 15 min for first hour), and after transfusion",
        "Watch for transfusion reactions: fever, chills, urticaria, dyspnea, back pain, dark urine",
        "Administer supplemental oxygen to optimize oxygen delivery",
        "Implement fall precautions (dizziness, orthostatic hypotension)",
        "Administer iron supplements with vitamin C for better absorption (avoid with calcium/antacids)",
        "Monitor for activity intolerance: fatigue, dyspnea on exertion, tachycardia"
      ]
    },
    examTips: [
      "Hemoglobin <7 g/dL = generally transfuse (unless patient is young, stable, or has chronic adaptation)",
      "Iron deficiency anemia: low ferritin, low serum iron, HIGH TIBC, microcytic/hypochromic (low MCV)",
      "B12 deficiency: macrocytic (HIGH MCV), may have neurological symptoms (numbness, ataxia)",
      "Blood transfusion: verify with TWO nurses, use Y-tubing with normal saline only, infuse within 4 hours",
      "Stop transfusion IMMEDIATELY for hemolytic reaction signs: fever, chills, flank pain, dark urine",
      "Sickle cell crisis: DO NOT give supplemental O2 unless SpO2 is low; hydrate aggressively, manage pain"
    ],
    practiceQuestions: [
      {
        question: "A patient has a hemoglobin of 6.2 g/dL and is symptomatic with tachycardia and dyspnea. What is the priority nursing action?",
        options: [
          "Administer oral iron supplements",
          "Prepare for packed RBC transfusion with two-nurse verification",
          "Encourage increased dietary iron intake",
          "Administer supplemental oxygen and recheck in 4 hours"
        ],
        correctIndex: 1,
        rationale: "A hemoglobin of 6.2 g/dL with symptomatic anemia (tachycardia, dyspnea) requires urgent packed RBC transfusion to restore oxygen-carrying capacity. Oral iron and dietary changes are too slow for this acute situation. Two-nurse verification is required per blood transfusion safety protocols."
      },
      {
        question: "During a blood transfusion, a patient develops fever, chills, and back pain. What should the nurse do first?",
        options: [
          "Slow the transfusion rate and administer acetaminophen",
          "Stop the transfusion immediately and keep the IV line open with normal saline",
          "Continue the transfusion and notify the provider",
          "Administer diphenhydramine and restart the transfusion"
        ],
        correctIndex: 1,
        rationale: "Fever, chills, and back pain during transfusion are signs of a hemolytic transfusion reaction, which is life-threatening. The nurse must stop the transfusion immediately, keep the line open with normal saline, notify the provider and blood bank, and send the blood bag and patient blood samples for analysis."
      },
      {
        question: "Which lab findings are consistent with iron deficiency anemia?",
        options: [
          "High MCV, normal ferritin, low B12",
          "Low MCV, low ferritin, high TIBC",
          "Normal MCV, low EPO, high ferritin",
          "High MCV, high ferritin, low folate"
        ],
        correctIndex: 1,
        rationale: "Iron deficiency anemia produces microcytic (low MCV), hypochromic red blood cells. Ferritin is low (depleted iron stores), and TIBC is elevated (the body makes more transferrin to try to capture available iron). This pattern is diagnostic and distinguishes it from anemia of chronic disease."
      }
    ],
    relatedLabSlugs: ["white-blood-cells", "creatinine", "inr"],
    relatedLessonIds: [],
    faqItems: [
      {
        question: "What is the normal hemoglobin level?",
        answer: "Normal hemoglobin ranges are 14.0-17.0 g/dL for males and 12.0-16.0 g/dL for females. Values below these ranges indicate anemia, while values above indicate polycythemia. Hemoglobin levels vary with age, sex, altitude, and pregnancy status."
      },
      {
        question: "When is a blood transfusion needed?",
        answer: "Blood transfusion is generally recommended when hemoglobin drops below 7 g/dL or when the patient is symptomatic (tachycardia, dyspnea, chest pain, altered mental status) regardless of hemoglobin level. Each unit of packed RBCs typically raises hemoglobin by approximately 1 g/dL."
      },
      {
        question: "What is the difference between iron deficiency anemia and B12 deficiency anemia?",
        answer: "Iron deficiency causes microcytic anemia (small RBCs, low MCV <80) with low ferritin and high TIBC. B12 deficiency causes macrocytic anemia (large RBCs, high MCV >100) with possible neurological symptoms. Iron deficiency is the most common anemia; B12 deficiency is seen in pernicious anemia and strict vegans."
      }
    ]
  },
  {
    slug: "white-blood-cells",
    name: "White Blood Cells",
    fullName: "White Blood Cell Count (WBC)",
    h1Title: "White Blood Cell Lab Values: Normal Range, Clinical Significance & Nursing Guide",
    metaDescription: "Learn WBC normal range 4,500-11,000/µL, causes of leukocytosis and leukopenia, differential count interpretation, nursing interventions, and NCLEX practice questions.",
    keywords: "WBC lab values, white blood cell count, leukocytosis, leukopenia, neutropenia nursing, infection nursing, NCLEX lab values, CBC differential",
    normalRange: {
      value: "4,500-11,000",
      unit: "/µL",
      notes: "Differential: Neutrophils 55-70%, Lymphocytes 20-40%, Monocytes 2-8%, Eosinophils 1-4%, Basophils 0.5-1%"
    },
    overview: "White blood cells (leukocytes) are the cellular components of the immune system responsible for defending the body against infection and foreign substances. The WBC count is measured as part of the complete blood count (CBC) and includes five types of cells, each with specific functions: neutrophils (bacterial defense), lymphocytes (viral/immune defense), monocytes (phagocytosis and antigen presentation), eosinophils (parasitic and allergic response), and basophils (inflammatory and allergic mediation).",
    clinicalSignificance: "WBC count and differential are essential for diagnosing infection, inflammation, allergic reactions, immunosuppression, and hematologic malignancies. The absolute neutrophil count (ANC) is the most clinically significant value, as neutropenia (ANC <1500) dramatically increases infection risk. An ANC <500 constitutes severe neutropenia, and an ANC <100 is agranulocytosis, where even normal flora can cause fatal sepsis.",
    highCauses: [
      { condition: "Bacterial infection", explanation: "Bone marrow releases mature and immature (band) neutrophils in response to infection (left shift)" },
      { condition: "Inflammation/tissue necrosis", explanation: "Burns, MI, trauma, and surgery cause cytokine release that stimulates WBC production" },
      { condition: "Leukemia", explanation: "Malignant proliferation of immature WBCs (blasts) markedly elevates WBC count" },
      { condition: "Corticosteroid use", explanation: "Steroids cause demargination of neutrophils from vessel walls and reduce neutrophil apoptosis" },
      { condition: "Physiological stress", explanation: "Pain, anxiety, vigorous exercise, and seizures cause catecholamine-mediated leukocytosis" }
    ],
    lowCauses: [
      { condition: "Chemotherapy/Radiation", explanation: "Cytotoxic agents destroy rapidly dividing bone marrow precursor cells" },
      { condition: "Bone marrow failure/Aplastic anemia", explanation: "Damaged stem cells cannot produce adequate WBCs" },
      { condition: "Overwhelming sepsis", explanation: "Massive infection can exhaust bone marrow reserves, causing paradoxical leukopenia" },
      { condition: "HIV/AIDS", explanation: "HIV destroys CD4+ T lymphocytes, reducing total WBC count" },
      { condition: "Autoimmune disorders", explanation: "Lupus (SLE) and other autoimmune conditions cause antibody-mediated WBC destruction" }
    ],
    criticalValues: {
      high: ">30,000/µL (assess for leukemia or severe infection)",
      low: "<2,000/µL (severe leukopenia) or ANC <500 (severe neutropenia)",
      action: "For severe leukocytosis: assess for leukemia (peripheral smear, hematology consult), rule out severe infection. For severe neutropenia (ANC <500): implement neutropenic precautions (private room, no fresh flowers/fruits, strict hand hygiene, avoid rectal temps/suppositories), monitor for infection signs, administer G-CSF (filgrastim) as ordered."
    },
    nursingInterventions: {
      forHigh: [
        "Obtain blood cultures before initiating antibiotics",
        "Assess for signs and symptoms of infection (fever, chills, tachycardia, localized inflammation)",
        "Administer antibiotics as ordered (within 1 hour for sepsis)",
        "Monitor temperature every 4 hours",
        "Assess for sources of infection: lungs, urinary tract, surgical sites, central lines",
        "Review WBC differential to identify the predominant cell type elevation",
        "If leukemia suspected: prepare for bone marrow biopsy and peripheral blood smear"
      ],
      forLow: [
        "Calculate absolute neutrophil count: ANC = WBC × (% neutrophils + % bands)",
        "Implement neutropenic precautions for ANC <1000",
        "Place in private room with positive pressure airflow if available",
        "Strict hand hygiene - most important infection prevention measure",
        "Avoid fresh flowers, plants, standing water in room",
        "No raw fruits, vegetables, or undercooked meats (neutropenic diet)",
        "Avoid rectal temperatures, suppositories, and enemas",
        "Administer colony-stimulating factors (G-CSF/filgrastim) as ordered",
        "Educate patient to report fever >100.4°F (38°C) immediately"
      ]
    },
    examTips: [
      "Left shift = increased immature neutrophils (bands) = acute bacterial infection",
      "ANC <500 = severe neutropenia; ANC <100 = agranulocytosis (life-threatening infection risk)",
      "ANC calculation: WBC × (% segs + % bands) ÷ 100",
      "Neutrophilia = bacterial infection; Lymphocytosis = viral infection; Eosinophilia = parasites or allergies",
      "Neutropenic precautions: private room, hand hygiene, no fresh flowers/fruits, no rectal temps",
      "In neutropenic patients, FEVER may be the ONLY sign of infection (no pus formation without WBCs)"
    ],
    practiceQuestions: [
      {
        question: "A chemotherapy patient has a WBC of 1,800/µL with 30% neutrophils and 5% bands. What is the ANC and what precautions should be implemented?",
        options: [
          "ANC 630; standard precautions are sufficient",
          "ANC 630; implement neutropenic precautions",
          "ANC 1,800; no additional precautions needed",
          "ANC 350; prepare for immediate bone marrow transplant"
        ],
        correctIndex: 1,
        rationale: "ANC = WBC × (% neutrophils + % bands) = 1,800 × (0.30 + 0.05) = 630. An ANC <1000 requires neutropenic precautions: private room, strict hand hygiene, no fresh flowers/fruits, neutropenic diet, and avoiding rectal procedures. The patient is at significant infection risk."
      },
      {
        question: "A patient with leukemia has a WBC of 85,000/µL. Which complication should the nurse monitor for?",
        options: [
          "Severe bleeding from thrombocytosis",
          "Leukostasis causing stroke-like symptoms and respiratory distress",
          "Hemolytic anemia from excess WBC production",
          "Spontaneous fractures from bone marrow expansion"
        ],
        correctIndex: 1,
        rationale: "Leukostasis occurs when extremely elevated WBC counts (typically >100,000, but possible at lower levels with blasts) cause white blood cells to aggregate in small vessels, causing microvascular occlusion. This most commonly affects the brain (stroke symptoms) and lungs (respiratory distress) and is a medical emergency."
      },
      {
        question: "A neutropenic patient reports a temperature of 100.6°F (38.1°C). What is the priority nursing action?",
        options: [
          "Administer acetaminophen and recheck in 1 hour",
          "Obtain blood cultures and notify the provider for empiric antibiotic orders",
          "Assess for other signs of infection before taking action",
          "Apply cooling blankets and increase IV fluid rate"
        ],
        correctIndex: 1,
        rationale: "In a neutropenic patient, fever >100.4°F (38°C) is a medical emergency (neutropenic fever). Blood cultures should be obtained immediately, and empiric broad-spectrum antibiotics must be started within 1 hour. Neutropenic patients cannot mount a normal inflammatory response, so fever may be the only sign of potentially fatal infection."
      }
    ],
    relatedLabSlugs: ["hemoglobin", "inr", "creatinine"],
    relatedLessonIds: [],
    faqItems: [
      {
        question: "What is a normal white blood cell count?",
        answer: "The normal WBC count is 4,500-11,000/µL (4.5-11.0 × 10^9/L). Elevation above 11,000 is called leukocytosis and may indicate infection, inflammation, or leukemia. A count below 4,500 is leukopenia and increases infection susceptibility."
      },
      {
        question: "What is the ANC and why is it important?",
        answer: "The absolute neutrophil count (ANC) measures the total number of neutrophils available to fight infection. It is calculated as WBC × (% neutrophils + % bands). ANC <1500 is neutropenia, ANC <500 is severe neutropenia, and ANC <100 is agranulocytosis. Low ANC dramatically increases risk of life-threatening bacterial and fungal infections."
      },
      {
        question: "What does a left shift mean in the WBC differential?",
        answer: "A 'left shift' means an increased percentage of immature neutrophils (bands) in the blood, typically >10%. This occurs when the bone marrow releases immature cells early to fight acute bacterial infection. It indicates the body is mobilizing all available immune resources against an active infection."
      }
    ]
  }
];

export function getLabValueBySlug(slug: string): LabValuePageData | undefined {
  return seoLabValues.find(lab => lab.slug === slug);
}

export function getAllLabValueSlugs(): string[] {
  return seoLabValues.map(lab => lab.slug);
}
