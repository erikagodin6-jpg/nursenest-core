/**
 * Advanced Labs Interpretation — Paywall Curriculum
 *
 * All lessons require the advanced_labs_paid entitlement.
 * Gate: /modules/labs-advanced via loadAdvancedLabsAccess()
 *
 * 10 lessons covering CBC, BMP/CMP, LFTs, coagulation, lactate/sepsis,
 * ABG, cardiac markers, DKA, AKI, and critical care electrolytes.
 */

export type AdvancedLabsLesson = {
  id: string;
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  level: "advanced" | "mastery";
  estimatedMinutes: number;
  objectives: readonly string[];
  overview: {
    clinicalSignificance: string;
    commonSettings: readonly string[];
    keyQuestion: string;
  };
  mechanism: {
    physiologicalBasis: string;
    keyRelationships: readonly string[];
    whyItMatters: string;
  };
  normalRanges: readonly {
    parameter: string;
    value: string;
    unit: string;
    clinicalNote: string;
  }[];
  abnormalPatterns: readonly {
    pattern: string;
    direction: "high" | "low" | "abnormal";
    causes: readonly string[];
    clinicalMeaning: string;
  }[];
  deepDive: string;
  nursingPriorities: readonly string[];
  commonTraps: readonly string[];
  notThisBecause: readonly {
    mimicker: string;
    differentiator: string;
  }[];
  caseApplication: {
    patientProfile: string;
    labSnapshot: string;
    clinicalContext: string;
    question: string;
    reasoning: string;
    nursingActions: readonly string[];
  };
  practiceItems: readonly {
    stem: string;
    choices: readonly [string, string, string, string];
    correct: 0 | 1 | 2 | 3;
    rationale: string;
    trapGuarded: string;
  }[];
};

// ─── Lesson 1 — Complete Blood Count ─────────────────────────────────────────

const advLesson01: AdvancedLabsLesson = {
  id: "adv-labs-cbc",
  slug: "cbc-interpretation",
  number: 1,
  title: "CBC Mastery: Beyond Normal Ranges",
  subtitle: "RBC indices, differential white counts, platelet dynamics, and clinical pattern recognition",
  level: "advanced",
  estimatedMinutes: 35,
  objectives: [
    "Interpret hemoglobin, hematocrit, and RBC indices to classify anemia by mechanism",
    "Differentiate neutrophilia, left shift, and lymphocytosis in infectious vs inflammatory contexts",
    "Recognize thrombocytopenia patterns — consumptive, immune-mediated, and dilutional",
    "Apply CBC pattern recognition to sepsis, DIC, and hematologic emergencies",
  ],
  overview: {
    clinicalSignificance:
      "The CBC is the most ordered lab in critical care yet the most misread. Nurses who understand indices — MCV, MCHC, MCH, RDW — can flag the type of anemia before the physician calls. The differential counts tell a story about the immune response type; a left shift with bandemia is a sepsis signal, not just 'high WBC'.",
    commonSettings: ["ICU/CCU", "ED triage", "post-operative units", "oncology", "hematology-oncology"],
    keyQuestion:
      "What is the bone marrow doing and why — is this a production problem, a destruction problem, or a loss problem?",
  },
  mechanism: {
    physiologicalBasis:
      "Red blood cells are produced by erythropoiesis in response to EPO from the kidney. Iron, B12, and folate are required. MCV reflects cell volume: low in iron deficiency (microcytic), high in B12/folate deficiency (macrocytic), normal in early or mixed deficiencies. The differential reflects which immune cell line the body is mobilizing — neutrophils for bacterial infection, lymphocytes for viral, eosinophils for allergy/parasites.",
    keyRelationships: [
      "MCV < 80 fL → microcytic (iron, thalassemia, chronic disease)",
      "MCV 80–100 fL → normocytic (acute blood loss, hemolysis, chronic disease)",
      "MCV > 100 fL → macrocytic (B12/folate, hypothyroid, alcohol, medications)",
      "Bands > 10% + left shift → marrow stress from infection or severe inflammation",
      "Platelets < 100k + falling → active consumption (DIC, HIT, ITP, TTP)",
    ],
    whyItMatters:
      "Missing a downtrending platelet count costs lives in ICU patients on heparin — HIT can develop within days and cause fatal clots. Missing a hemoglobin of 6.8 in a patient already tachycardic means missing a transfusion trigger.",
  },
  normalRanges: [
    { parameter: "Hemoglobin (male)", value: "13.5–17.5", unit: "g/dL", clinicalNote: "Transfusion trigger typically <7 (restrictive strategy)" },
    { parameter: "Hemoglobin (female)", value: "12.0–15.5", unit: "g/dL", clinicalNote: "Pregnancy lowers normal range further" },
    { parameter: "Hematocrit", value: "36–50", unit: "%", clinicalNote: "Hct ≈ Hgb × 3 as a quick mental check" },
    { parameter: "MCV", value: "80–100", unit: "fL", clinicalNote: "Most informative index for anemia classification" },
    { parameter: "WBC", value: "4.5–11.0", unit: "×10³/μL", clinicalNote: ">12 or <4 in sepsis meets SIRS criteria" },
    { parameter: "Neutrophils (ANC)", value: "1.8–7.7", unit: "×10³/μL", clinicalNote: "ANC <500 = severe neutropenia, infection risk critical" },
    { parameter: "Platelets", value: "150–400", unit: "×10³/μL", clinicalNote: "< 50k = bleeding risk; < 20k = spontaneous bleed risk" },
  ],
  abnormalPatterns: [
    {
      pattern: "Microcytic hypochromic anemia",
      direction: "low",
      causes: ["Iron deficiency (most common)", "Thalassemia trait", "Chronic disease (late)", "Lead poisoning"],
      clinicalMeaning: "Iron deficiency is #1 globally. Low MCV + low ferritin + high TIBC = iron deficiency until proven otherwise.",
    },
    {
      pattern: "Macrocytic anemia",
      direction: "abnormal",
      causes: ["B12 deficiency", "Folate deficiency", "Hypothyroidism", "Alcohol", "Methotrexate, hydroxyurea"],
      clinicalMeaning: "B12 deficiency causes irreversible neurological damage if untreated. Always check in elderly patients with cognitive changes.",
    },
    {
      pattern: "Leukocytosis with left shift",
      direction: "high",
      causes: ["Bacterial infection", "Sepsis", "Corticosteroids (demargination)", "Severe stress response"],
      clinicalMeaning: "Bands > 10% = left shift = marrow releasing immature neutrophils under stress. Not all leukocytosis is infection.",
    },
    {
      pattern: "Thrombocytopenia (falling trend)",
      direction: "low",
      causes: ["Heparin-induced thrombocytopenia (HIT)", "DIC", "ITP", "TTP", "Medication-induced", "Bone marrow suppression"],
      clinicalMeaning: "Any platelet drop >50% in a heparin-treated patient within days 4–14 must prompt HIT evaluation. Stopping heparin is the intervention.",
    },
  ],
  deepDive:
    "DIC (disseminated intravascular coagulation) produces a characteristic CBC pattern: thrombocytopenia, falling hemoglobin (microangiopathic hemolysis), and elevated WBC from the underlying trigger. The peripheral smear shows schistocytes. Coagulation times are prolonged and D-dimer is markedly elevated. DIC is a consumptive coagulopathy — the clotting system is activated everywhere simultaneously, consuming platelets and clotting factors, while fibrinolysis is simultaneously dysregulated. Treatment is directed at the underlying cause; blood products are supportive, not corrective.",
  nursingPriorities: [
    "Track CBC trends, not just single values — a downtrend in platelets is more alarming than a single low value",
    "Correlate WBC with clinical picture: steroids cause leukocytosis without infection",
    "Report ANC < 1,000 immediately in oncology/immunosuppressed patients",
    "In heparin-treated patients: check platelet count every 2–3 days; alert for >50% drop",
    "Before any procedure in thrombocytopenic patient: verify platelet threshold with ordering provider",
    "Avoid IM injections in patients with platelets <50k",
  ],
  commonTraps: [
    "Normal WBC does not rule out sepsis — elderly and immunosuppressed patients may be leukopenic",
    "Hemoglobin of 10 in a bleeding patient looks 'okay' but may be 12 hours behind the actual blood loss",
    "Corticosteroid-induced leukocytosis can hit 20,000 and is not infection",
    "Relative polycythemia from dehydration: Hgb looks high but is just concentrated",
    "Platelet transfusion in TTP worsens outcome — must distinguish TTP from ITP",
  ],
  notThisBecause: [
    {
      mimicker: "Leukocytosis from steroids",
      differentiator: "Steroid leukocytosis is neutrophilia without left shift, no fever/infection source, resolves with dose reduction",
    },
    {
      mimicker: "Spurious thrombocytopenia (EDTA clumping)",
      differentiator: "Repeat CBC in citrate tube; platelet clumping artifact resolves, true thrombocytopenia does not",
    },
  ],
  caseApplication: {
    patientProfile: "72-year-old female admitted to ICU day 6 for aspiration pneumonia, on IV heparin for DVT prophylaxis.",
    labSnapshot: "Day 1: Platelets 210k. Day 4: Platelets 145k. Day 6: Platelets 78k. No bleeding observed.",
    clinicalContext:
      "Patient's platelet count has dropped 63% over 5 days while on heparin. No overt bleeding, but patient has DVT prophylaxis via IV heparin infusion.",
    question: "What is the nurse's priority action?",
    reasoning:
      "A >50% drop in platelets within days 4–14 of heparin exposure is the classic HIT pattern. HIT is a prothrombotic, not a bleeding disorder — the paradox is that patients clot despite low platelets. The 4T score (Thrombocytopenia severity, Timing, Thrombosis, other cause unlikely) should be calculated. All heparin must be held immediately, including heparin flushes and LMWH, and a direct thrombin inhibitor (argatroban) started.",
    nursingActions: [
      "Immediately hold all heparin (including flushes, heparin-coated catheters)",
      "Notify provider: platelet trend, 4T score calculation",
      "Anticipate order for HIT antibody (PF4/heparin ELISA) and serotonin release assay",
      "Expect switch to argatroban or bivalirudin — monitor aPTT per protocol",
      "Document all heparin exposures (IV, SQ, flushes, catheter coatings)",
      "Continue DVT monitoring — HIT is prothrombotic, not protective",
    ],
  },
  practiceItems: [
    {
      stem: "A 55-year-old man has Hgb 8.2, MCV 72 fL, MCH 22 pg. Which additional lab would most help confirm the likely diagnosis?",
      choices: [
        "Serum B12 level",
        "Serum ferritin and TIBC",
        "Peripheral blood smear for schistocytes",
        "Reticulocyte count",
      ],
      correct: 1,
      rationale: "Low MCV (72 fL) with low MCH indicates microcytic hypochromic anemia — iron deficiency until proven otherwise. Ferritin (storage iron) and TIBC (binding capacity, high in deficiency) confirm iron deficiency anemia.",
      trapGuarded: "B12 causes macrocytic anemia (high MCV), not microcytic",
    },
    {
      stem: "An ICU patient on day 7 of heparin infusion has platelets drop from 220k to 95k. She has no bleeding. What is the most appropriate immediate action?",
      choices: [
        "Transfuse 1 unit of platelets and recheck in 4 hours",
        "Stop all heparin products and notify the provider immediately",
        "Increase heparin dose — low platelets indicate inadequate anticoagulation",
        "Continue current management and recheck CBC in 24 hours",
      ],
      correct: 1,
      rationale: "A >50% platelet drop within days 4–14 of heparin is HIT until proven otherwise. All heparin must be stopped immediately. HIT is prothrombotic — continuing heparin risks fatal clots.",
      trapGuarded: "Platelet transfusion and continuation of heparin both worsen HIT outcomes",
    },
    {
      stem: "A post-surgical patient has WBC 18.2 but no fever, no infection source, and just received methylprednisolone 1g IV. The nurse correctly interprets this as:",
      choices: [
        "Early sepsis requiring blood cultures and broad-spectrum antibiotics",
        "Medication-induced leukocytosis from corticosteroids — not infection",
        "Severe bacterial infection — neutrophilia this high is always pathological",
        "Viral syndrome — lymphocytosis is the expected pattern",
      ],
      correct: 1,
      rationale: "High-dose corticosteroids cause neutrophilia by demarginating bone marrow neutrophils. Leukocytosis can reach 20–30k without infection. Clinical context — afebrile, no source, steroid administration — distinguishes this from sepsis.",
      trapGuarded: "Never treat leukocytosis in isolation; always interpret in clinical context",
    },
  ],
};

// ─── Lesson 2 — BMP/CMP Interpretation ───────────────────────────────────────

const advLesson02: AdvancedLabsLesson = {
  id: "adv-labs-bmp",
  slug: "bmp-cmp-interpretation",
  number: 2,
  title: "BMP & CMP Mastery",
  subtitle: "Electrolyte emergencies, renal function, glucose crises, and the anion gap",
  level: "advanced",
  estimatedMinutes: 40,
  objectives: [
    "Calculate and interpret the anion gap with albumin correction",
    "Recognize hyponatremia patterns and select appropriate correction rate",
    "Interpret BUN/creatinine ratio to distinguish prerenal from intrinsic AKI",
    "Identify electrolyte emergencies requiring immediate intervention",
  ],
  overview: {
    clinicalSignificance:
      "The BMP is 8 values that capture fluid/electrolyte status, renal function, and glucose in one panel. The anion gap — Na minus (Cl + HCO3) — is the single most powerful calculated value in medicine, identifying unmeasured acids before the patient looks sick. Nurses who understand it catch DKA, lactic acidosis, and toxic ingestions early.",
    commonSettings: ["ICU", "ED", "nephrology", "endocrinology", "surgical units"],
    keyQuestion: "Is there an anion gap, and if so, what acid is accumulating?",
  },
  mechanism: {
    physiologicalBasis:
      "Electroneutrality requires cations equal anions. The anion gap (AG = Na - [Cl + HCO3]) represents unmeasured anions (albumin, phosphate, sulfate, organic acids). Normal AG is 8–12 mEq/L (lab-dependent). An elevated AG signals accumulation of an unmeasured acid — lactate, ketones, uremic acids, or toxins. Hyponatremia reflects relative water excess versus sodium, not absolute sodium loss in most cases.",
    keyRelationships: [
      "AG = Na - (Cl + HCO3); normal 8–12 mEq/L (correct for albumin)",
      "Albumin correction: AG + 2.5 × (4 - measured albumin)",
      "BUN/Cr ratio > 20 → prerenal (dehydration, GI bleed, CHF)",
      "BUN/Cr ratio < 10 → intrinsic renal disease or malnutrition",
      "Na correction for hyperglycemia: Na + 1.6 × (glucose - 100) / 100",
    ],
    whyItMatters:
      "A corrected anion gap of 22 in a patient 'just admitted for nausea' may be the first sign of DKA or lactic acidosis. The glucose and AG together point the clinician toward the correct diagnosis before the blood gas returns.",
  },
  normalRanges: [
    { parameter: "Sodium", value: "136–145", unit: "mEq/L", clinicalNote: "Hyponatremia <125 = severe; correction max 10–12 mEq/L per 24h" },
    { parameter: "Potassium", value: "3.5–5.1", unit: "mEq/L", clinicalNote: "K < 3.0 or > 6.5 = cardiac emergency" },
    { parameter: "Chloride", value: "98–106", unit: "mEq/L", clinicalNote: "High chloride saline-induced metabolic acidosis" },
    { parameter: "Bicarbonate (CO2)", value: "22–29", unit: "mEq/L", clinicalNote: "Low = metabolic acidosis or compensation for resp alkalosis" },
    { parameter: "BUN", value: "7–20", unit: "mg/dL", clinicalNote: "Elevated in dehydration, GI bleed, high protein diet" },
    { parameter: "Creatinine", value: "0.6–1.2", unit: "mg/dL", clinicalNote: "Lags behind true GFR change by 24–48h in AKI" },
    { parameter: "Glucose (fasting)", value: "70–100", unit: "mg/dL", clinicalNote: "DKA: >250 typical; HHS: >600 typical" },
    { parameter: "Anion Gap", value: "8–12", unit: "mEq/L", clinicalNote: "Correct for albumin: low albumin artificially lowers AG" },
  ],
  abnormalPatterns: [
    {
      pattern: "Elevated anion gap metabolic acidosis (HAGMA)",
      direction: "high",
      causes: ["Lactic acidosis (sepsis, shock, metformin)", "DKA", "Uremia", "Toxic ingestions (methanol, ethylene glycol, salicylates)"],
      clinicalMeaning: "MUDPILES mnemonic. Lactate is the most common cause in ICU. Always get a lactate when AG > 14.",
    },
    {
      pattern: "Severe hyponatremia (<125 mEq/L)",
      direction: "low",
      causes: ["SIADH", "Heart failure", "Cirrhosis", "Hypothyroidism", "Psychogenic polydipsia"],
      clinicalMeaning: "Correction faster than 10–12 mEq/L per 24h risks osmotic demyelination syndrome (central pontine myelinolysis). Never overcorrect.",
    },
    {
      pattern: "Hyperkalemia (K >6.0)",
      direction: "high",
      causes: ["AKI/CKD", "ACE inhibitor + K supplement", "Adrenal insufficiency", "Acidosis (H+/K+ exchange)", "Crush injury, rhabdomyolysis"],
      clinicalMeaning: "K >6.0 requires ECG evaluation for peaked T waves, wide QRS, sine wave pattern. Calcium gluconate stabilizes myocardium immediately.",
    },
    {
      pattern: "Hypokalemia (K <3.0)",
      direction: "low",
      causes: ["Loop/thiazide diuretics", "GI losses (vomiting, NG drainage)", "Hyperaldosteronism", "Refeeding syndrome"],
      clinicalMeaning: "Hypokalemia increases digoxin toxicity risk and predisposes to VT/VF. Replace potassium with cardiac monitoring when K <3.0.",
    },
  ],
  deepDive:
    "The delta-delta ratio (ΔAG / ΔHCO3) identifies hidden metabolic disorders in a high AG acidosis. Normal delta-delta is 1–2. If < 1, a non-AG metabolic acidosis coexists (e.g., diarrhea with DKA). If > 2, a concurrent metabolic alkalosis is present (e.g., vomiting with uremia). This matters because treating only the visible disorder leaves the hidden one uncorrected.",
  nursingPriorities: [
    "Calculate anion gap for any metabolic acidosis — never accept 'low bicarb' without knowing why",
    "Never correct hyponatremia faster than 10–12 mEq/L in 24h — set a rate limit on hypertonic saline",
    "For K >6.0: obtain ECG immediately, hold K-retaining medications, notify provider",
    "For K <3.0 on digoxin: priority replacement, ECG monitoring, hold dose pending K level",
    "In DKA: track glucose hourly, anion gap every 4h — gap closure is the true endpoint, not glucose normalization",
    "BUN/Cr >20 with dry mucous membranes and low urine output = prerenal → IV fluid trial, reassess",
  ],
  commonTraps: [
    "Low albumin artificially lowers the AG — always correct AG for albumin in ICU patients",
    "Normal glucose does not rule out DKA — euglycemic DKA occurs with SGLT2 inhibitors",
    "Creatinine lags AKI by 24–48 hours — trend matters more than single value",
    "Overcorrecting hyponatremia too quickly causes irreversible brainstem demyelination",
    "K 3.5 is 'normal' but a patient on digoxin with K 3.5 is at risk — contextualize",
  ],
  notThisBecause: [
    {
      mimicker: "Normal-gap metabolic acidosis (hyperchloremic)",
      differentiator: "AG is normal; HCO3 is low; chloride is high — causes: RTA, diarrhea, saline infusion. Different from HAGMA.",
    },
    {
      mimicker: "Pseudohyperkalemia",
      differentiator: "Hemolyzed sample releases intracellular K. If no ECG changes and no clinical reason, repeat on non-hemolyzed specimen before treating.",
    },
  ],
  caseApplication: {
    patientProfile: "28-year-old woman with type 1 diabetes, vomiting × 2 days, now lethargic.",
    labSnapshot: "Na 132, K 3.2, Cl 92, HCO3 10, BUN 28, Cr 1.1, Glucose 310. AG = 132 - (92 + 10) = 30.",
    clinicalContext: "AG is 30 (normal 8–12). Glucose 310, HCO3 10, pH will confirm acidosis. She has type 1 diabetes — DKA until proven otherwise.",
    question: "What is the nurse's priority assessment and intervention?",
    reasoning:
      "DKA diagnosis: glucose >250, HCO3 <18, pH <7.3 (expected given HCO3 of 10), elevated AG. Priority is fluid resuscitation (1L NS bolus per protocol), insulin infusion after potassium replacement (K 3.2 is dangerously low — insulin will drive K further down), and continuous monitoring. The AG of 30 indicates significant ketoacid accumulation.",
    nursingActions: [
      "Establish 2 large-bore IV accesses immediately",
      "Initiate 1L NS bolus per DKA protocol",
      "Hold insulin until K >3.5 — replace potassium IV first",
      "Obtain ABG to confirm pH and HCO3",
      "Start insulin infusion once K is safe and IV fluid is running",
      "Monitor glucose hourly, BMP every 2–4 hours, track anion gap closure",
      "Foley catheter for accurate urine output measurement",
    ],
  },
  practiceItems: [
    {
      stem: "A patient has Na 138, Cl 100, HCO3 14, albumin 2.0 g/dL. What is the albumin-corrected anion gap?",
      choices: [
        "AG = 24 (uncorrected); corrected = 29",
        "AG = 24 (uncorrected); corrected = 24",
        "AG = 14 (uncorrected); corrected = 19",
        "AG = 14 (uncorrected); corrected = 14",
      ],
      correct: 0,
      rationale: "AG = 138 - (100 + 14) = 24. Albumin correction: 24 + 2.5 × (4 - 2.0) = 24 + 5 = 29. This is significantly elevated — indicating unmeasured acid accumulation masked by low albumin.",
      trapGuarded: "Failing to correct for low albumin in ICU patients misses elevated AG acidosis",
    },
    {
      stem: "A 55-year-old man has Na 118 mEq/L with severe symptomatic hyponatremia. 3% NaCl is ordered. The nurse's priority monitoring goal is:",
      choices: [
        "Increase Na by 20 mEq/L in the first 8 hours to resolve symptoms",
        "Increase Na by no more than 10–12 mEq/L in 24 hours to prevent osmotic demyelination",
        "Normalize Na to 140 mEq/L within 24 hours using bolus dosing",
        "Hold 3% NaCl until urine Na is checked; correct only if SIADH confirmed",
      ],
      correct: 1,
      rationale: "Correction rate must not exceed 10–12 mEq/L per 24 hours (some guidelines allow up to 8 mEq/L per 8h for severe symptoms). Faster correction causes osmotic demyelination syndrome — irreversible brainstem injury.",
      trapGuarded: "Rapid correction urgency can lead to overcorrection — the treatment becomes the injury",
    },
    {
      stem: "K+ returns at 6.4 mEq/L in an oliguric post-op patient. The first nursing action is:",
      choices: [
        "Administer potassium chloride 40 mEq IV to normalize the level",
        "Obtain a 12-lead ECG and notify the provider immediately",
        "Hold all IV fluids until the cause of hyperkalemia is identified",
        "Recheck K in 2 hours — a single elevated value may be spurious",
      ],
      correct: 1,
      rationale: "K 6.4 with oliguria is a genuine hyperkalemia emergency. The immediate risk is cardiac arrhythmia — peaked T waves, widened QRS, ventricular fibrillation. ECG must come first; then calcium gluconate to stabilize the myocardium while other treatments begin.",
      trapGuarded: "Never give additional potassium for hyperkalemia; never delay ECG",
    },
  ],
};

// ─── Lesson 3 — Liver Function Tests ─────────────────────────────────────────

const advLesson03: AdvancedLabsLesson = {
  id: "adv-labs-lft",
  slug: "liver-function-tests",
  number: 3,
  title: "Liver Function Tests: Hepatocellular vs Cholestatic",
  subtitle: "AST, ALT, ALP, GGT, bilirubin, albumin, and synthetic function assessment",
  level: "advanced",
  estimatedMinutes: 30,
  objectives: [
    "Classify liver injury as hepatocellular, cholestatic, or mixed using LFT patterns",
    "Interpret bilirubin fractions to localize jaundice etiology",
    "Recognize acute liver failure using synthetic function markers (PT/INR, albumin)",
    "Identify drug-induced liver injury patterns",
  ],
  overview: {
    clinicalSignificance:
      "LFTs reveal whether the liver is being damaged (hepatocellular), blocked (cholestatic), or failing (synthetic dysfunction). The pattern of enzyme elevation — aminotransferases vs alkaline phosphatase — guides diagnosis. Albumin and INR measure what only the liver can do: make protein and produce clotting factors.",
    commonSettings: ["Hepatology", "gastroenterology", "post-op", "toxicology", "transplant"],
    keyQuestion: "Is the liver being damaged, obstructed, or losing its ability to function?",
  },
  mechanism: {
    physiologicalBasis:
      "AST and ALT are hepatocellular enzymes released when hepatocytes are injured. ALT is liver-specific; AST is also in muscle/heart. ALP and GGT reflect biliary/cholestatic damage. Total bilirubin = direct (conjugated, water-soluble, from the liver) + indirect (unconjugated, from RBC breakdown). When the liver can't conjugate or bile can't drain, bilirubin accumulates.",
    keyRelationships: [
      "AST/ALT >10× ULN → acute hepatocellular injury (viral, ischemic, drug)",
      "ALP >3× ULN + GGT elevation → cholestatic pattern (biliary obstruction, PSC, PBC)",
      "AST:ALT ratio >2:1 → alcoholic hepatitis (AST from mitochondria in ethanol injury)",
      "Unconjugated hyperbilirubinemia → pre-hepatic (hemolysis) or Gilbert syndrome",
      "Conjugated hyperbilirubinemia → hepatocellular or post-hepatic (obstruction)",
    ],
    whyItMatters:
      "Acetaminophen overdose produces transaminases in the thousands within 24–72 hours. A patient presenting with 'stomach pain' who has AST 4,200, ALT 5,800 is in acute liver failure — not just GI distress.",
  },
  normalRanges: [
    { parameter: "AST (SGOT)", value: "10–40", unit: "U/L", clinicalNote: "Not liver-specific; also elevated in MI, muscle injury" },
    { parameter: "ALT (SGPT)", value: "7–56", unit: "U/L", clinicalNote: "Liver-specific — most sensitive for hepatocellular damage" },
    { parameter: "ALP", value: "44–147", unit: "U/L", clinicalNote: "Also elevated in bone disease and pregnancy" },
    { parameter: "GGT", value: "8–61", unit: "U/L", clinicalNote: "Sensitive for cholestasis and alcohol use" },
    { parameter: "Total bilirubin", value: "0.1–1.2", unit: "mg/dL", clinicalNote: "Jaundice visible when >2.5–3.0 mg/dL" },
    { parameter: "Direct bilirubin", value: "0–0.3", unit: "mg/dL", clinicalNote: "Elevated = hepatocellular or obstructive" },
    { parameter: "Albumin", value: "3.5–5.0", unit: "g/dL", clinicalNote: "Half-life 20 days — reflects chronic synthetic function" },
  ],
  abnormalPatterns: [
    {
      pattern: "Acute hepatocellular injury (>10× ULN)",
      direction: "high",
      causes: ["Viral hepatitis (A, B, C)", "Acetaminophen/drug toxicity", "Ischemic hepatitis (shock liver)", "Autoimmune hepatitis"],
      clinicalMeaning: "AST/ALT in the thousands requires urgent evaluation — this is liver cell death, not inflammation.",
    },
    {
      pattern: "Cholestatic pattern (ALP > AST/ALT)",
      direction: "high",
      causes: ["Biliary obstruction (stone, stricture)", "Primary biliary cholangitis", "Primary sclerosing cholangitis", "Drug-induced (estrogens, antibiotics)"],
      clinicalMeaning: "Imaging (ultrasound, MRCP) is essential — obstruction is often surgically treatable.",
    },
    {
      pattern: "Hypoalbuminemia",
      direction: "low",
      causes: ["Cirrhosis (reduced synthesis)", "Malnutrition", "Nephrotic syndrome (loss)", "Protein-losing enteropathy", "Sepsis (redistribution)"],
      clinicalMeaning: "Albumin reflects chronic liver synthetic function. In acute liver failure, it may be normal initially because of its 20-day half-life.",
    },
  ],
  deepDive:
    "Ischemic hepatitis ('shock liver') produces extreme transaminase elevations — AST/ALT can exceed 10,000 U/L — within 24–48 hours of a hypotensive episode. It mimics acute viral hepatitis but has a clear temporal link to hemodynamic compromise. The transaminases will fall dramatically once perfusion is restored. Differentiating from acetaminophen toxicity requires medication history and acetaminophen level.",
  nursingPriorities: [
    "Report AST or ALT >500 immediately — acute hepatic injury regardless of cause",
    "Monitor INR trend in liver disease patients — rising INR = failing synthetic function",
    "Jaundiced patients: avoid IM injections, assess for coagulopathy before procedures",
    "Assess bilirubin daily in ICU patients on total parenteral nutrition (TPN-associated cholestasis)",
    "In suspected acetaminophen overdose: obtain 4-hour post-ingestion level for Rumack-Matthew nomogram",
    "Albumin <2.5 g/dL: reassess ascites, edema, wound healing, and medication binding",
  ],
  commonTraps: [
    "AST elevation without ALT elevation = muscle source, not liver (rhabdomyolysis, MI)",
    "ALP elevated in pregnancy (placental isoform) — not liver disease",
    "Normal LFTs do not exclude cirrhosis — burned-out cirrhosis can have normal enzymes",
    "Albumin reflects chronic function; don't use it to assess acute liver injury",
  ],
  notThisBecause: [
    {
      mimicker: "Rhabdomyolysis (elevated AST)",
      differentiator: "CK is dramatically elevated; ALT is normal or minimally elevated; urine is cola-colored",
    },
    {
      mimicker: "Bone disease (elevated ALP)",
      differentiator: "GGT is normal in bone disease; ALP rises from bone isoform in Paget's, fractures, metastases",
    },
  ],
  caseApplication: {
    patientProfile: "45-year-old man admitted with confusion and jaundice. No alcohol use per history. Acetaminophen 'taken for back pain' over the past week.",
    labSnapshot: "AST 8,200, ALT 9,100, ALP 180, Bilirubin 8.4, INR 3.2, Albumin 2.9.",
    clinicalContext: "Hepatocellular pattern (transaminases massively elevated vs modest ALP). INR 3.2 = significant synthetic dysfunction. Likely acetaminophen toxicity.",
    question: "What is the priority intervention and monitoring?",
    reasoning:
      "This is acute liver failure — hepatic encephalopathy (confusion), INR >2, jaundice, massive transaminase elevation. N-acetylcysteine (NAC) is indicated for acetaminophen toxicity even after 24 hours. Liver transplant team should be consulted. King's College Criteria assess transplant need.",
    nursingActions: [
      "Initiate N-acetylcysteine (NAC) infusion per protocol immediately",
      "Contact hepatology/liver transplant service — this meets acute liver failure criteria",
      "Hourly neuro checks — hepatic encephalopathy grading",
      "Avoid all hepatically-metabolized sedatives",
      "Monitor INR, lactate, creatinine every 4–6 hours",
      "Strict I&O, daily weights — ascites and hepatorenal syndrome risk",
    ],
  },
  practiceItems: [
    {
      stem: "A patient has AST 4,800, ALT 5,200, ALP 160. INR is 2.8. Which is most likely?",
      choices: [
        "Primary biliary cholangitis — ALP elevation pattern",
        "Acute hepatocellular injury (viral or toxic) with synthetic dysfunction",
        "Alcoholic hepatitis — AST:ALT ratio distinguishes this",
        "Gilbert syndrome — unconjugated hyperbilirubinemia pattern",
      ],
      correct: 1,
      rationale: "Massive transaminase elevation (>10× ULN) with disproportionately normal ALP is the hepatocellular pattern. INR 2.8 shows synthetic dysfunction — the liver can no longer produce clotting factors. Alcoholic hepatitis would have AST:ALT ratio >2:1.",
      trapGuarded: "Confusing hepatocellular and cholestatic patterns leads to wrong workup",
    },
    {
      stem: "A patient's AST is 2,100 but ALT is 52. CK is 48,000. The most accurate interpretation is:",
      choices: [
        "Acute viral hepatitis — transaminases elevated",
        "Rhabdomyolysis — CK elevation with AST from muscle, not liver",
        "Alcoholic hepatitis — AST disproportionately elevated",
        "Ischemic hepatitis — hypotensive episode caused both to rise",
      ],
      correct: 1,
      rationale: "AST is also found in muscle. Massively elevated CK with only modestly elevated ALT (liver-specific) confirms the AST is from muscle injury (rhabdomyolysis), not hepatocellular damage.",
      trapGuarded: "AST alone cannot diagnose liver disease — ALT and CK must be interpreted together",
    },
    {
      stem: "Albumin is 2.2 g/dL in a patient admitted for decompensated cirrhosis. Which effect does the nurse need to anticipate?",
      choices: [
        "Enhanced protein-bound drug effects (e.g., phenytoin) due to more free drug",
        "Decreased drug efficacy — low albumin increases drug clearance",
        "Higher risk of hypercoagulability from excess free fibrinogen",
        "Rapid normalization with albumin infusion",
      ],
      correct: 0,
      rationale: "Albumin is the primary carrier protein for many drugs (phenytoin, warfarin, furosemide). Low albumin means more free (unbound, active) drug. Phenytoin toxicity at 'normal' total levels is a classic trap in hypoalbuminemia.",
      trapGuarded: "Free drug levels matter more than total when albumin is low",
    },
  ],
};

// ─── Lesson 4 — Coagulation Panel ────────────────────────────────────────────

const advLesson04: AdvancedLabsLesson = {
  id: "adv-labs-coag",
  slug: "coagulation-panel",
  number: 4,
  title: "Coagulation Panel: PT, INR, aPTT, and Anti-Xa",
  subtitle: "Clotting cascade, anticoagulation monitoring, DIC, and bleeding risk stratification",
  level: "advanced",
  estimatedMinutes: 35,
  objectives: [
    "Interpret PT/INR, aPTT, and anti-Xa in the context of the coagulation cascade",
    "Monitor anticoagulation safely using the correct test for each agent",
    "Recognize DIC from coagulation panel pattern",
    "Stratify bleeding risk before procedures using coagulation data",
  ],
  overview: {
    clinicalSignificance:
      "Coagulation labs guide one of the highest-risk nursing tasks: managing anticoagulants. Using the wrong monitoring test for the wrong drug is a patient safety error. aPTT monitors heparin; anti-Xa monitors LMWH; INR monitors warfarin; direct oral anticoagulants require specific assays. DIC produces a characteristic pan-coagulopathy.",
    commonSettings: ["ICU", "cardiac", "vascular surgery", "hematology", "interventional radiology"],
    keyQuestion: "Which pathway is abnormal, and is this a drug effect, a consumption coagulopathy, or a factor deficiency?",
  },
  mechanism: {
    physiologicalBasis:
      "Coagulation has two pathways converging on factor X activation. The extrinsic pathway (PT/INR) begins with tissue factor and factor VII — measured by the prothrombin time. The intrinsic pathway (aPTT) begins with factors XII, XI, IX, VIII — measured by the aPTT. Both converge at factor X and then proceed through the common pathway (thrombin → fibrin). Heparin activates antithrombin III, inhibiting thrombin and factor Xa — detected by aPTT.",
    keyRelationships: [
      "PT/INR monitors: warfarin, factor VII deficiency, liver synthetic function",
      "aPTT monitors: unfractionated heparin, factor VIII/IX deficiency (hemophilia)",
      "Anti-Xa monitors: LMWH (enoxaparin), fondaparinux, direct Xa inhibitors",
      "DIC: PT prolonged + aPTT prolonged + platelets falling + D-dimer very high + fibrinogen falling",
      "Fibrinogen falling in DIC = coagulation factors being consumed — a late and ominous sign",
    ],
    whyItMatters:
      "A supratherapeutic heparin infusion with aPTT >150 seconds and a missed infusion titration can cause intracranial hemorrhage. The nurse who checks the aPTT, titrates per protocol, and acts on critical values prevents this.",
  },
  normalRanges: [
    { parameter: "PT", value: "11–13.5", unit: "seconds", clinicalNote: "Extended by warfarin, liver disease, vitamin K deficiency" },
    { parameter: "INR", value: "0.9–1.1", unit: "ratio", clinicalNote: "Target 2–3 for AF/DVT/PE; 2.5–3.5 for mechanical valve" },
    { parameter: "aPTT", value: "25–35", unit: "seconds", clinicalNote: "Therapeutic heparin target: 60–100 sec (protocol-dependent)" },
    { parameter: "Anti-Xa (LMWH)", value: "0.5–1.0", unit: "IU/mL", clinicalNote: "4h post-dose peak for once-daily dosing monitoring" },
    { parameter: "D-dimer", value: "<0.5", unit: "mg/L FEU", clinicalNote: "Sensitive not specific — elevated in PE, DVT, DIC, inflammation, surgery" },
    { parameter: "Fibrinogen", value: "200–400", unit: "mg/dL", clinicalNote: "Low in DIC and liver failure; elevated as acute-phase reactant" },
  ],
  abnormalPatterns: [
    {
      pattern: "Isolated PT/INR elevation",
      direction: "high",
      causes: ["Warfarin therapy", "Vitamin K deficiency", "Liver disease", "Factor VII deficiency"],
      clinicalMeaning: "PT/INR reflects the extrinsic pathway. Warfarin and liver failure are most common causes in clinical practice.",
    },
    {
      pattern: "Isolated aPTT elevation",
      direction: "high",
      causes: ["Unfractionated heparin (therapeutic)", "Hemophilia A (factor VIII) or B (factor IX)", "Lupus anticoagulant (in vitro prolongation — paradoxically prothrombotic)"],
      clinicalMeaning: "Isolated aPTT elevation in a heparinized patient is expected. In non-heparinized patient, investigate hemophilia or factor inhibitor.",
    },
    {
      pattern: "DIC pattern",
      direction: "abnormal",
      causes: ["Sepsis (most common)", "Trauma/massive transfusion", "Obstetric emergencies (abruption, HELLP)", "Acute leukemia (APL)", "Transfusion reaction"],
      clinicalMeaning: "Simultaneous PT↑, aPTT↑, platelet↓, fibrinogen↓, D-dimer markedly ↑ = DIC. Treatment is directed at the underlying cause.",
    },
  ],
  deepDive:
    "Heparin resistance occurs when aPTT fails to achieve therapeutic range despite adequate dosing. Causes: antithrombin III deficiency (hereditary or acquired from prolonged heparin or liver disease), elevated factor VIII (acute-phase reactant), or high fibrinogen. In these patients, anti-Xa level is a more reliable monitor of heparin effect than aPTT.",
  nursingPriorities: [
    "Never use aPTT to monitor LMWH — use anti-Xa (aPTT is unreliable for LMWH)",
    "Check aPTT 6 hours after heparin infusion dose change; titrate per protocol",
    "INR >3.5 with no active bleeding: hold warfarin, administer vitamin K per protocol",
    "INR >5 or active bleeding: anticipate 4-factor PCC or FFP",
    "Falling fibrinogen trend in ICU patient: flag DIC workup",
    "Before any invasive procedure: confirm INR <1.5, platelets >50k (procedure-dependent)",
  ],
  commonTraps: [
    "Using aPTT to monitor enoxaparin — aPTT does NOT reflect LMWH levels",
    "D-dimer is non-specific: elevated in post-op, infection, pregnancy, cancer — don't diagnose PE on D-dimer alone",
    "Lupus anticoagulant prolongs aPTT in vitro but causes thrombosis in vivo",
    "INR >1.5 may be acceptable for some procedures (lumbar puncture requires <1.5; chest tube requires <1.5)",
  ],
  notThisBecause: [
    {
      mimicker: "Hemophilia A (factor VIII deficiency)",
      differentiator: "aPTT prolonged, PT normal, factor VIII level low — not from heparin (which would also be in the clinical context)",
    },
    {
      mimicker: "Liver failure coagulopathy vs DIC",
      differentiator: "Both prolong PT and aPTT; DIC has D-dimer markedly elevated and fibrinogen falling; liver failure has lower factor levels across the board",
    },
  ],
  caseApplication: {
    patientProfile: "ICU patient post-CABG day 2, on IV heparin for mechanical valve. aPTT returns at 187 seconds. Target aPTT: 60–100 seconds.",
    labSnapshot: "aPTT 187 sec. Platelets 88k (down from 140k on day 0). No active bleeding currently.",
    clinicalContext: "Supratherapeutic heparin with rapidly falling platelets. HIT must be considered simultaneously.",
    question: "What are the immediate nursing actions?",
    reasoning:
      "aPTT 187 seconds is dangerously supratherapeutic — risk of intracranial hemorrhage. Hold heparin infusion per protocol (typically for aPTT >120 sec). Simultaneously, platelet drop from 140k to 88k (>37%) within 48h in a post-CABG patient on heparin requires HIT evaluation — 4T score, PF4 antibody testing. The conflict: mechanical valve needs anticoagulation, but HIT requires stopping all heparin.",
    nursingActions: [
      "Hold heparin infusion immediately per supratherapeutic aPTT protocol",
      "Notify provider of aPTT 187 AND platelet downtrend",
      "Anticipate HIT evaluation: 4T score, PF4/heparin antibody",
      "Monitor for bleeding: neurological checks, urine color, drain output",
      "If HIT confirmed: anticipate argatroban or bivalirudin for anticoagulation of mechanical valve",
      "Recheck aPTT per protocol after heparin hold",
    ],
  },
  practiceItems: [
    {
      stem: "A patient on enoxaparin (LMWH) 1 mg/kg BID returns an aPTT of 64 seconds. The nurse should:",
      choices: [
        "Decrease the enoxaparin dose — aPTT >60 indicates supratherapeutic LMWH",
        "No adjustment needed — aPTT is not a valid monitor for LMWH; order anti-Xa if monitoring is required",
        "Increase enoxaparin — aPTT <100 indicates sub-therapeutic anticoagulation",
        "Switch to unfractionated heparin to achieve consistent aPTT monitoring",
      ],
      correct: 1,
      rationale: "aPTT does not reliably reflect LMWH activity. LMWH acts primarily on factor Xa; anti-Xa level is the correct monitoring assay. An aPTT in the 'therapeutic heparin range' from LMWH is coincidental and should not drive dose adjustments.",
      trapGuarded: "Using heparin monitoring parameters for LMWH — fundamentally different pharmacology",
    },
    {
      stem: "A patient presents with INR 6.2, oozing from IV sites, and melena. Management priorities include all of the following EXCEPT:",
      choices: [
        "4-factor prothrombin complex concentrate (PCC) for rapid reversal",
        "Vitamin K IV for more durable reversal",
        "Fresh frozen plasma if PCC unavailable",
        "Heparin to bridge anticoagulation while warfarin is held",
      ],
      correct: 3,
      rationale: "Active bleeding with INR 6.2 requires urgent reversal — 4-factor PCC is fastest (minutes), followed by vitamin K (hours). Heparin is an anticoagulant — adding heparin to an actively bleeding patient with supratherapeutic warfarin would be catastrophic.",
      trapGuarded: "Never bridge anticoagulation with heparin in the acute setting of severe over-anticoagulation with bleeding",
    },
    {
      stem: "An ICU patient with sepsis has: PT 22s, aPTT 68s, platelets 62k (down from 180k 2 days ago), fibrinogen 95 mg/dL, D-dimer 18 mg/L FEU. The nurse identifies this pattern as:",
      choices: [
        "Heparin supratherapeutic — hold infusion and recheck",
        "Vitamin K deficiency — administer phytonadione",
        "DIC — contact provider, anticipate coagulation product support",
        "Liver failure — hepatology consult and restrict protein",
      ],
      correct: 2,
      rationale: "DIC pattern: both PT and aPTT prolonged, platelets falling, fibrinogen critically low (consumptive), D-dimer markedly elevated (fibrinolysis). Underlying trigger is sepsis. Treatment targets the source; blood products are temporizing.",
      trapGuarded: "Liver failure can look similar but fibrinogen is lower in DIC relative to liver failure; D-dimer markedly elevated",
    },
  ],
};

// ─── Lesson 5 — Lactate and Sepsis Markers ────────────────────────────────────

const advLesson05: AdvancedLabsLesson = {
  id: "adv-labs-lactate",
  slug: "lactate-sepsis-markers",
  number: 5,
  title: "Lactate, Procalcitonin & Sepsis Lab Cluster",
  subtitle: "Lactate clearance, sepsis-3 criteria, procalcitonin guidance, and perfusion markers",
  level: "advanced",
  estimatedMinutes: 30,
  objectives: [
    "Interpret serial lactate levels to assess tissue perfusion and treatment response",
    "Apply Sepsis-3 criteria using lab and clinical parameters",
    "Use procalcitonin appropriately to guide antibiotic de-escalation",
    "Recognize non-infectious causes of elevated lactate",
  ],
  overview: {
    clinicalSignificance:
      "Lactate ≥2 mmol/L in sepsis indicates tissue hypoperfusion — even with a normal blood pressure. Lactate ≥4 mmol/L defines septic shock and mandates immediate aggressive resuscitation. Serial lactate clearance (>10% per 2 hours) is the best real-time measure of resuscitation success.",
    commonSettings: ["ICU", "ED", "rapid response", "sepsis protocol management"],
    keyQuestion: "Is tissue hypoperfusion resolving with treatment, or is the patient deteriorating despite intervention?",
  },
  mechanism: {
    physiologicalBasis:
      "Lactate is produced when cells shift from aerobic to anaerobic metabolism — either from poor oxygen delivery (Type A: shock, hypoxemia) or from metabolic dysfunction despite adequate delivery (Type B: metformin, liver failure, thiamine deficiency, malignancy). In sepsis, both occur: vasodilation reduces delivery AND cytokines impair cellular oxygen use.",
    keyRelationships: [
      "Lactate >2 mmol/L + suspected infection = sepsis with hypoperfusion",
      "Lactate ≥4 mmol/L = septic shock (regardless of blood pressure)",
      "Lactate clearance: (initial - repeat) / initial × 100; target >10–20% per 2h",
      "Procalcitonin rises within 4–6h of bacterial infection; falls with successful treatment",
      "SOFA score uses labs (creatinine, bilirubin, platelets) + clinical data for organ dysfunction scoring",
    ],
    whyItMatters:
      "A patient with MAP 68, normal mental status but lactate 5.2 is in septic shock by Sepsis-3 — this is not a 'stable' patient. The nurse who checks the lactate and escalates saves the patient. The nurse who doesn't check because 'BP is okay' misses it.",
  },
  normalRanges: [
    { parameter: "Lactate (venous)", value: "<2.0", unit: "mmol/L", clinicalNote: "Sepsis protocol: ≥2 triggers aggressive intervention" },
    { parameter: "Lactate (arterial)", value: "<1.0", unit: "mmol/L", clinicalNote: "Arterial slightly lower; use consistent sampling site" },
    { parameter: "Procalcitonin", value: "<0.1", unit: "ng/mL", clinicalNote: ">0.5 suggests bacterial infection; >10 suggests severe sepsis" },
    { parameter: "C-reactive protein", value: "<10", unit: "mg/L", clinicalNote: "Non-specific marker; peaks 48–72h after infection onset" },
    { parameter: "WBC", value: "4.5–11.0", unit: "×10³/μL", clinicalNote: "<4 or >12 meets SIRS criteria" },
  ],
  abnormalPatterns: [
    {
      pattern: "Lactate ≥4 mmol/L",
      direction: "high",
      causes: ["Septic shock", "Cardiogenic shock", "Distributive shock", "Severe hepatic failure", "Metformin toxicity"],
      clinicalMeaning: "30-day mortality correlates directly with lactate level. Aggressive resuscitation targeting lactate clearance is essential.",
    },
    {
      pattern: "Rising PCT on antibiotics",
      direction: "high",
      causes: ["Antibiotic failure", "Undrained source (abscess)", "Fungal superinfection", "Non-bacterial cause"],
      clinicalMeaning: "Rising PCT despite antibiotics signals treatment failure — source control review, microbiology reassessment, antifungal consideration.",
    },
  ],
  deepDive:
    "Type B lactic acidosis occurs without tissue hypoperfusion. Metformin impairs hepatic lactate clearance — in patients with AKI, metformin accumulates and causes severe lactic acidosis (pH <7.0, lactate >10). Thiamine deficiency blocks pyruvate dehydrogenase, shunting pyruvate to lactate. In prolonged ICU malnutrition or alcohol dependence, empiric thiamine before glucose is critical.",
  nursingPriorities: [
    "Obtain lactate within 1 hour of sepsis screen — this is a Sepsis-3 bundle requirement",
    "Repeat lactate at 2 hours after resuscitation to assess clearance",
    "30mL/kg IV crystalloid within 3 hours for sepsis-induced hypoperfusion",
    "Document lactate trend — clearance, not absolute value, guides success",
    "Report rising PCT to provider — may require source control reassessment",
    "Metformin patients in AKI: alert provider; hold medication, anticipate lactate monitoring",
  ],
  commonTraps: [
    "Normal BP does not rule out tissue hypoperfusion — lactate is required",
    "Lactate elevation from tourniquet or prolonged sample transport is an artifact",
    "Procalcitonin is elevated in non-infectious conditions: burns, trauma, pancreatitis — not a stand-alone sepsis test",
    "Lactate normalization is the treatment goal, not just BP normalization",
  ],
  notThisBecause: [
    {
      mimicker: "Metformin-associated lactic acidosis",
      differentiator: "Extreme lactate elevation (often >10), AKI, metformin use — no sepsis source; responds to hemodialysis",
    },
    {
      mimicker: "Thiamine deficiency (Type B lactate)",
      differentiator: "Lactate elevated without infection or hemodynamic compromise; risk in malnutrition, alcohol use; empiric thiamine is diagnostic and therapeutic",
    },
  ],
  caseApplication: {
    patientProfile: "68-year-old with urosepsis: HR 118, BP 94/60, temp 39.2°C, confused. Initial lactate: 5.8 mmol/L.",
    labSnapshot: "WBC 22.4, bands 18%, Lactate 5.8, Cr 2.1 (baseline 0.9), Procalcitonin 42 ng/mL.",
    clinicalContext: "Septic shock by Sepsis-3: suspected infection + SOFA ≥2 + lactate ≥4. Immediate bundle activation required.",
    question: "What are the 1-hour and 3-hour bundle priorities?",
    reasoning:
      "1-hour bundle: lactate measurement (done), blood cultures before antibiotics, broad-spectrum antibiotics, 30mL/kg IV crystalloid if hypotensive or lactate ≥4, vasopressors if MAP <65 despite fluids. Lactate 5.8 = septic shock. Norepinephrine is first-line vasopressor. Repeat lactate at 2 hours to assess clearance.",
    nursingActions: [
      "Blood cultures ×2 sets before antibiotics — do not delay antibiotics for culture",
      "Broad-spectrum antibiotics within 1 hour of septic shock recognition",
      "30 mL/kg NS or LR IV bolus — reassess after each 500mL",
      "Vasopressor (norepinephrine) if MAP <65 after fluid resuscitation",
      "Repeat lactate at 2 hours post-resuscitation",
      "Foley catheter: target UO >0.5 mL/kg/hr",
      "Notify intensivist immediately — this patient needs ICU-level care",
    ],
  },
  practiceItems: [
    {
      stem: "A patient's lactate is 3.4 mmol/L at time 0. After 30 mL/kg fluid resuscitation and norepinephrine, repeat lactate at 2 hours is 2.9 mmol/L. This represents:",
      choices: [
        "Adequate lactate clearance — >10% reduction achieved, continue current management",
        "Inadequate lactate clearance — escalate interventions, reassess source control",
        "Lactate normalization — resuscitation complete, downgrade care level",
        "Type B lactic acidosis — stop IV fluids to prevent fluid overload",
      ],
      correct: 1,
      rationale: "Lactate clearance = (3.4 - 2.9) / 3.4 × 100 = 14.7%. Target is >10% per 2 hours. 14.7% meets the threshold — continue current management. However, lactate is still elevated (>2), so resuscitation continues with reassessment.",
      trapGuarded: "Lactate 'improving' is not the same as lactate clearance meeting the defined threshold",
    },
    {
      stem: "A patient with type 2 diabetes develops AKI (Cr 3.8) and has a lactate of 11.2 mmol/L with pH 6.9. No infection source found. Which intervention is most likely indicated?",
      choices: [
        "Broad-spectrum antibiotics — septic shock until proven otherwise",
        "Hold metformin and consider hemodialysis — metformin-associated lactic acidosis",
        "Insulin infusion — DKA with elevated anion gap",
        "Thiamine 100 mg IV — thiamine deficiency causing Type B lactate",
      ],
      correct: 1,
      rationale: "Extreme lactate (>10), AKI, diabetes + metformin: classic metformin-associated lactic acidosis (MALA). Metformin is renally cleared; AKI causes accumulation. Hemodialysis clears both metformin and lactate. No infection source identified.",
      trapGuarded: "Assuming all high lactate is sepsis — non-infectious causes must be systematically considered",
    },
  ],
};

// ─── Lesson 6 — ABG Interpretation ───────────────────────────────────────────

const advLesson06: AdvancedLabsLesson = {
  id: "adv-labs-abg",
  slug: "abg-interpretation",
  number: 6,
  title: "ABG Mastery: Systematic 5-Step Interpretation",
  subtitle: "pH, PaCO2, HCO3, compensation, oxygenation, A-a gradient, and ventilator implications",
  level: "mastery",
  estimatedMinutes: 45,
  objectives: [
    "Apply 5-step systematic ABG interpretation without shortcuts",
    "Identify primary disorders and verify compensation adequacy",
    "Calculate A-a gradient and interpret oxygenation failure mechanism",
    "Apply ABG findings to ventilator management and clinical decision-making",
  ],
  overview: {
    clinicalSignificance:
      "ABG interpretation is the most cognitively demanding lab skill in acute care. Done well, it identifies the primary acid-base disorder, confirms compensation, reveals mixed disorders, and assesses oxygenation failure type. Done poorly, it leads to wrong interventions — giving bicarbonate for respiratory acidosis, or adjusting rate instead of tidal volume.",
    commonSettings: ["ICU", "ED", "PACU", "respiratory therapy", "any ventilated patient"],
    keyQuestion: "What is the primary disorder, is compensation appropriate, and is the oxygenation failure ventilatory or parenchymal?",
  },
  mechanism: {
    physiologicalBasis:
      "pH is determined by the ratio of HCO3 (metabolic) to PaCO2 (respiratory) via the Henderson-Hasselbalch equation. Normal: pH 7.35–7.45, PaCO2 35–45, HCO3 22–26. The lungs regulate CO2 (respiratory); the kidneys regulate HCO3 (metabolic). Each compensates for the other's dysfunction — but compensation is never complete (pH does not normalize with compensation alone).",
    keyRelationships: [
      "pH < 7.35 = acidosis; pH > 7.45 = alkalosis",
      "PaCO2 ↑ (>45) = respiratory acidosis; PaCO2 ↓ (<35) = respiratory alkalosis",
      "HCO3 ↓ (<22) = metabolic acidosis; HCO3 ↑ (>26) = metabolic alkalosis",
      "Metabolic acidosis compensation: expected PaCO2 = 1.5 × HCO3 + 8 ± 2 (Winter's formula)",
      "A-a gradient = PAO2 - PaO2; normal <10–15 on room air; ↑ = V/Q mismatch, shunt, or diffusion impairment",
    ],
    whyItMatters:
      "A ventilated patient with pH 7.21, PaCO2 72, HCO3 28 has respiratory acidosis with metabolic compensation — the ventilator rate needs to increase, not the bicarb. Giving bicarb would be the wrong treatment and could worsen CO2 retention.",
  },
  normalRanges: [
    { parameter: "pH", value: "7.35–7.45", unit: "(dimensionless)", clinicalNote: "pH <7.2 or >7.6 = life-threatening" },
    { parameter: "PaCO2", value: "35–45", unit: "mmHg", clinicalNote: "Reflects ventilation; ↑ = hypoventilation" },
    { parameter: "HCO3", value: "22–26", unit: "mEq/L", clinicalNote: "Reflects metabolic component; calculated from pH + PaCO2" },
    { parameter: "PaO2 (room air)", value: "80–100", unit: "mmHg", clinicalNote: "Decreases with age; target >60 for adequate saturation" },
    { parameter: "SaO2", value: "95–100", unit: "%", clinicalNote: "Reflects oxyhemoglobin saturation" },
    { parameter: "Base excess", value: "-2 to +2", unit: "mEq/L", clinicalNote: "Metabolic component summary; negative = acidosis" },
  ],
  abnormalPatterns: [
    {
      pattern: "Respiratory acidosis (pH↓, PaCO2↑)",
      direction: "abnormal",
      causes: ["COPD exacerbation", "Opioid overdose (hypoventilation)", "Neuromuscular failure", "Severe pneumonia", "Obesity hypoventilation"],
      clinicalMeaning: "The lung cannot blow off CO2 fast enough. Treatment: improve ventilation (NIPPV, intubation, reverse opioids).",
    },
    {
      pattern: "Metabolic acidosis (pH↓, HCO3↓)",
      direction: "abnormal",
      causes: ["DKA", "Lactic acidosis", "AKI/CKD", "Diarrhea (normal gap)", "Toxins"],
      clinicalMeaning: "Calculate AG — determines if this is high-gap (acid accumulation) or normal-gap (HCO3 loss).",
    },
    {
      pattern: "Mixed disorder",
      direction: "abnormal",
      causes: ["COPD with metabolic alkalosis (diuretics)", "Sepsis + vomiting", "DKA + pneumonia"],
      clinicalMeaning: "If compensation is not appropriate for the primary disorder, a mixed disorder is present.",
    },
  ],
  deepDive:
    "Permissive hypercapnia in ARDS allows PaCO2 to rise (accepting acidosis) in order to use lung-protective low tidal volumes. The strategy prioritizes preventing ventilator-induced lung injury over normalizing pH. Target: pH >7.20, tidal volume 6 mL/kg IBW. Nurses must understand this — a PaCO2 of 65 in an ARDS patient may be intentional, not an emergency.",
  nursingPriorities: [
    "Always interpret ABG with the clinical picture — a single value means nothing without context",
    "5-step approach: pH → primary disorder → compensation check → AG → oxygenation",
    "Alert for pH <7.20 regardless of etiology — organ-level acidosis reaches critical thresholds",
    "In COPD baseline hypercapnia: compare to patient's personal baseline, not normal ranges",
    "Opioid-induced respiratory acidosis: naloxone, positioning, stimulation — avoid intubation if reversible",
    "Ventilator changes: rate adjusts PaCO2; tidal volume adjusts both CO2 and lung protection",
  ],
  commonTraps: [
    "Interpreting compensation as a mixed disorder — compensation moves in the same direction as the primary change",
    "Treating COPD hypercapnia as acute respiratory failure — chronic retainers have high PaCO2 at baseline",
    "Giving bicarbonate for respiratory acidosis — it does not fix the problem and worsens CO2 retention",
    "Missing a mixed disorder: a COPD patient with vomiting-induced metabolic alkalosis will have 'normal' pH despite CO2 retention",
  ],
  notThisBecause: [
    {
      mimicker: "Compensation for metabolic acidosis vs respiratory alkalosis",
      differentiator: "In pure metabolic acidosis, PaCO2 drops (compensation). If PaCO2 drops MORE than expected by Winter's formula, respiratory alkalosis is also present.",
    },
    {
      mimicker: "Chronic respiratory acidosis vs acute",
      differentiator: "In chronic: HCO3 is elevated (kidney compensated), pH is near normal. In acute: HCO3 may be normal, pH is low. Chronic retainers tolerate high PaCO2 without symptoms.",
    },
  ],
  caseApplication: {
    patientProfile: "55-year-old COPD patient intubated for respiratory failure. Ventilator: rate 14, TV 500mL, FiO2 0.5.",
    labSnapshot: "pH 7.22, PaCO2 78, HCO3 31, PaO2 74, SaO2 94%.",
    clinicalContext: "Respiratory acidosis with metabolic compensation (HCO3 elevated). Compensation check: expected HCO3 for chronic resp. acidosis = 24 + 0.35 × (PaCO2 - 40) = 24 + 13.3 = 37.3 — actual HCO3 31 is LESS than expected, suggesting the compensation is incomplete or an additional metabolic acidosis exists.",
    question: "What ventilator adjustments and nursing priorities are indicated?",
    reasoning:
      "pH 7.22 is dangerously acidotic. Primary problem: respiratory (CO2 retention). Increase ventilator RATE to blow off more CO2. Consider checking metabolic cause. PaO2 74 on FiO2 0.5 — calculate A-a gradient: PAO2 = FiO2 × (760-47) - PaCO2/0.8 = 0.5 × 713 - 97.5 = 259. A-a = 259 - 74 = 185 (markedly elevated — significant V/Q mismatch from COPD).",
    nursingActions: [
      "Notify physician immediately — pH 7.22 is critical",
      "Anticipate increase in ventilator rate (not tidal volume, which risks barotrauma)",
      "Repeat ABG 30 minutes after ventilator change",
      "Assess for bronchospasm — bronchodilators may improve CO2 clearance",
      "Monitor hemodynamics — severe acidosis impairs myocardial contractility",
      "Document ventilator settings before and after change",
    ],
  },
  practiceItems: [
    {
      stem: "ABG: pH 7.28, PaCO2 22, HCO3 10. What is the primary disorder and is compensation appropriate?",
      choices: [
        "Respiratory alkalosis with metabolic compensation; compensation appropriate",
        "Metabolic acidosis with respiratory compensation; check Winter's formula: expected PaCO2 = 1.5(10)+8 = 23 ± 2; actual 22 — appropriate",
        "Mixed metabolic and respiratory acidosis — both pH drivers abnormal",
        "Metabolic alkalosis with respiratory acidosis — HCO3 elevated, PaCO2 low",
      ],
      correct: 1,
      rationale: "pH 7.28 = acidosis. PaCO2 22 (low) + HCO3 10 (low) — primary is metabolic acidosis (HCO3 drives pH down; PaCO2 is compensation). Winter's formula: 1.5 × 10 + 8 = 23 ± 2. Actual PaCO2 22 is within 23 ± 2 → compensation is appropriate. No mixed disorder.",
      trapGuarded: "Confusing compensation with a mixed disorder — compensation is appropriate when it follows the predicted formula",
    },
    {
      stem: "COPD patient's baseline ABG: pH 7.37, PaCO2 58, HCO3 32. Today's ABG: pH 7.18, PaCO2 88, HCO3 33. What changed?",
      choices: [
        "New metabolic alkalosis on top of chronic respiratory acidosis",
        "Acute-on-chronic respiratory acidosis — CO2 markedly worsened without commensurate HCO3 rise",
        "Metabolic acidosis replacing the metabolic alkalosis from diuretics",
        "Normal for this patient — COPD patients routinely have pH of 7.18",
      ],
      correct: 1,
      rationale: "Baseline shows chronic respiratory acidosis with renal compensation (HCO3 32). Today: CO2 jumped to 88 but HCO3 barely changed (33 — kidneys can't compensate this fast). pH 7.18 = acute decompensation. This is acute-on-chronic respiratory failure — same etiology but acutely worse.",
      trapGuarded: "Accepting abnormal ABG as 'baseline' without comparing to the patient's actual personal baseline",
    },
  ],
};

// ─── Lesson 7 — Cardiac Markers ───────────────────────────────────────────────

const advLesson07: AdvancedLabsLesson = {
  id: "adv-labs-cardiac",
  slug: "cardiac-markers",
  number: 7,
  title: "Cardiac Markers: Troponin, BNP & CK-MB",
  subtitle: "High-sensitivity troponin kinetics, BNP in heart failure, and cardiac biomarker patterns",
  level: "advanced",
  estimatedMinutes: 30,
  objectives: [
    "Interpret troponin rise-and-fall kinetics to differentiate ACS from chronic elevation",
    "Use BNP/NT-proBNP to assess heart failure severity and guide diuresis",
    "Recognize non-cardiac causes of troponin elevation",
    "Apply 0h/3h rapid rule-out protocols using high-sensitivity troponin",
  ],
  overview: {
    clinicalSignificance:
      "High-sensitivity troponin has redefined ACS diagnosis — it can detect myocardial injury within 1–2 hours of onset. The kinetics (rising or falling) matter as much as the absolute value. A troponin of 200 that's falling differs from a troponin of 200 that's been rising for 6 hours.",
    commonSettings: ["ED chest pain protocol", "CCU", "step-down cardiac", "post-procedure monitoring"],
    keyQuestion: "Is the troponin rising (acute injury) or stable/falling (chronic injury), and what is the clinical context?",
  },
  mechanism: {
    physiologicalBasis:
      "Troponin I and T are structural proteins within cardiomyocytes, released into blood when cells are damaged. High-sensitivity assays detect extremely small amounts — normal is essentially 'undetectable'. BNP and NT-proBNP are released by ventricular myocytes under stretch from volume/pressure overload. BNP reflects neurohormonal activation; it rises in heart failure, PE, and right ventricular strain.",
    keyRelationships: [
      "hs-TnI or hs-TnT: >99th percentile = elevated; rising by >20–50% confirms acute MI",
      "Serial troponin: draw at 0h and 3h (some protocols 0h/1h/3h)",
      "BNP >100 pg/mL: likely heart failure; <100: low probability",
      "NT-proBNP: age-adjusted thresholds (>450 pg/mL <50y; >900 >50y; >1800 >75y)",
      "CK-MB peaks 18–24h post-MI; used in reinfarction detection (troponin stays elevated longer)",
    ],
    whyItMatters:
      "Missing a rising troponin pattern in a patient being worked up for 'anxiety chest pain' is a missed NSTEMI. The patient will be discharged and return with full occlusion. The nurse who catches a delta troponin rise and escalates prevents the event.",
  },
  normalRanges: [
    { parameter: "hs-Troponin I", value: "<52", unit: "ng/L (lab-dependent)", clinicalNote: "Rising >20% in 3h = acute myocardial injury" },
    { parameter: "hs-Troponin T", value: "<14", unit: "ng/L (lab-dependent)", clinicalNote: "Threshold varies by assay — always use lab-specific reference" },
    { parameter: "BNP", value: "<100", unit: "pg/mL", clinicalNote: ">400 = high probability heart failure" },
    { parameter: "NT-proBNP", value: "<300", unit: "pg/mL", clinicalNote: "Age-adjusted: >450 (<50y), >900 (50–75y), >1800 (>75y)" },
    { parameter: "CK-MB", value: "<5.0", unit: "ng/mL", clinicalNote: "Less specific than troponin; useful for reinfarction timing" },
  ],
  abnormalPatterns: [
    {
      pattern: "Rising troponin pattern (delta >20% in 3h)",
      direction: "high",
      causes: ["Type 1 MI (plaque rupture)", "Type 2 MI (demand ischemia: sepsis, tachyarrhythmia, anemia)", "Myocarditis"],
      clinicalMeaning: "Rising troponin + symptoms = ACS until proven otherwise. Activate cardiology evaluation immediately.",
    },
    {
      pattern: "Stable elevated troponin",
      direction: "high",
      causes: ["Chronic kidney disease", "Heart failure (chronic myocardial stretch)", "Pulmonary hypertension"],
      clinicalMeaning: "Chronic elevation without delta rise may not be acute — trending is essential for interpretation.",
    },
    {
      pattern: "Markedly elevated BNP (>1000 pg/mL)",
      direction: "high",
      causes: ["Decompensated heart failure", "Massive pulmonary embolism (RV strain)", "ARDS", "Sepsis-induced cardiomyopathy"],
      clinicalMeaning: "BNP >1000 correlates with hospital mortality risk in heart failure. Aggressive diuresis may be indicated.",
    },
  ],
  deepDive:
    "Type 2 MI (myocardial infarction due to supply-demand mismatch, not plaque rupture) is increasingly recognized. Tachyarrhythmia, severe anemia, sepsis, and cocaine can produce demand ischemia with rising troponin. Management differs from Type 1 MI — treating the underlying cause (rate control, transfusion, infection source) is the priority, not emergency PCI.",
  nursingPriorities: [
    "Serial troponin timing is critical — document exact draw times (0h, 3h) for delta calculation",
    "Rising troponin: notify provider immediately; prepare for rapid ACS workup",
    "Monitor for ST changes on telemetry — correlate troponin with rhythm",
    "BNP trending: track response to diuresis in decompensated heart failure",
    "Avoid assuming troponin elevation is 'non-cardiac' without delta calculation",
    "Document symptoms at time of each troponin draw — temporal correlation is essential",
  ],
  commonTraps: [
    "Single elevated troponin without delta does not confirm or rule out ACS",
    "CKD patients have chronically elevated troponin — delta rise is still valid for ACS detection",
    "BNP is reduced by obesity; morbidly obese patients may have underestimated BNP",
    "Demand ischemia (Type 2 MI) treated as Type 1 MI leads to unnecessary intervention",
  ],
  notThisBecause: [
    {
      mimicker: "Troponin elevation from PE",
      differentiator: "RV strain on echo, D-dimer markedly elevated, clinical PE risk, no ischemic ECG changes localizable to territory",
    },
    {
      mimicker: "Myocarditis troponin rise",
      differentiator: "Often younger patient, viral prodrome, diffuse ST changes without territory-specific pattern, echo with global wall motion abnormality",
    },
  ],
  caseApplication: {
    patientProfile: "62-year-old with exertional chest pain for 4 hours. ECG: ST depression leads V4–V6. Troponin at 0h: 180 ng/L.",
    labSnapshot: "0h: Troponin 180 ng/L. 3h: Troponin 340 ng/L. BNP 220 pg/mL.",
    clinicalContext: "Delta troponin: (340-180)/180 × 100 = 89% rise in 3 hours. ST depression V4–V6. This is NSTEMI.",
    question: "What are the immediate priorities?",
    reasoning:
      "89% delta troponin rise + ischemic ECG changes + chest pain = NSTEMI. Immediate: aspirin 325 mg, activate cardiology/cath lab, anticoagulation, P2Y12 inhibitor (timing per cardiology), continuous cardiac monitoring. This patient requires urgent catheterization (within 24h for NSTEMI with risk features).",
    nursingActions: [
      "Aspirin 325 mg PO immediately (unless contraindicated)",
      "Notify cardiology stat — NSTEMI protocol activation",
      "Continuous 12-lead ECG monitoring, repeat ECG if symptoms change",
      "IV access × 2, type and screen",
      "Anticoagulation (heparin or enoxaparin) per NSTEMI protocol",
      "NPO in anticipation of catheterization",
      "Oxygen only if SaO2 <94%",
    ],
  },
  practiceItems: [
    {
      stem: "Troponin at 0h is 85 ng/L. Repeat at 3h is 92 ng/L. The patient is asymptomatic and stable. This delta troponin represents:",
      choices: [
        "Acute MI — troponin is elevated and any rise confirms the diagnosis",
        "Non-significant rise (<20%) — likely stable elevation; HEART score and clinical assessment guide further workup",
        "Demand ischemia — begin anticoagulation for Type 2 MI",
        "False positive — troponin at these levels is within normal variation",
      ],
      correct: 1,
      rationale: "Delta = (92-85)/85 × 100 = 8.2% — less than the 20% threshold for significant acute rise. This does not confirm ACS. Clinical context (HEART score, symptoms, ECG) determines next steps — may warrant observation or stress testing rather than cath lab activation.",
      trapGuarded: "Any troponin elevation is not automatically ACS — delta kinetics determine acuity",
    },
    {
      stem: "A 78-year-old with known CKD stage 4 has a troponin of 120 ng/L after 2 hours of chest pain. Previous troponin 6 months ago was 118 ng/L. The correct interpretation is:",
      choices: [
        "NSTEMI — troponin elevation always means acute infarction",
        "Chronic elevation from CKD — delta is only 2 ng/L, not significant; no acute MI evidence",
        "Demand ischemia requiring anticoagulation",
        "False positive — CKD specimens are always unreliable",
      ],
      correct: 1,
      rationale: "CKD causes chronically elevated troponin due to impaired clearance and subclinical cardiac stress. Previous baseline of 118 ng/L makes current 120 ng/L a non-significant delta — no evidence of acute myocardial injury. Clinical context and serial monitoring guide next steps.",
      trapGuarded: "Treating CKD-related chronic troponin elevation as acute MI leads to unnecessary anticoagulation and invasive procedures",
    },
  ],
};

// ─── Lesson 8 — DKA Lab Pattern ───────────────────────────────────────────────

const advLesson08: AdvancedLabsLesson = {
  id: "adv-labs-dka",
  slug: "dka-lab-pattern",
  number: 8,
  title: "DKA: The Complete Lab Pattern",
  subtitle: "Glucose, anion gap, potassium dynamics, ketones, and monitoring the insulin infusion",
  level: "mastery",
  estimatedMinutes: 35,
  objectives: [
    "Diagnose DKA from lab criteria: glucose, HCO3, pH, and anion gap",
    "Manage potassium replacement safely during insulin infusion",
    "Identify euglycemic DKA in SGLT2 inhibitor patients",
    "Track anion gap closure as the correct DKA resolution endpoint",
  ],
  overview: {
    clinicalSignificance:
      "DKA is simultaneously a fluid, electrolyte, acid-base, and hormonal emergency. The most dangerous DKA nursing errors: giving insulin without potassium replacement (cardiac arrest from severe hypokalemia), stopping insulin when glucose normalizes but gap hasn't closed, and missing euglycemic DKA in SGLT2 inhibitor users.",
    commonSettings: ["ICU", "ED", "endocrinology", "step-down"],
    keyQuestion: "Is the anion gap closing? Is potassium safe before insulin is started?",
  },
  mechanism: {
    physiologicalBasis:
      "Insulin deficiency + counter-regulatory hormones (glucagon, cortisol, catecholamines) produce: hyperglycemia from gluconeogenesis, ketogenesis from free fatty acid oxidation (producing beta-hydroxybutyrate and acetoacetate — unmeasured anions), and metabolic acidosis from ketoacid accumulation. Total body potassium is depleted by osmotic diuresis, but serum K is often normal or HIGH on presentation due to acidosis shifting K extracellularly.",
    keyRelationships: [
      "DKA criteria: glucose >250, pH <7.3, HCO3 <18, elevated AG with ketonemia/ketonuria",
      "Serum K is deceiving: total body K depleted, but serum K elevated from acidosis",
      "Insulin drives K into cells → serum K falls rapidly → can cause fatal hypokalemia",
      "Hold insulin if K <3.5 until K is repleted to safe level",
      "Anion gap closes as ketoacids are metabolized — this is the true DKA resolution endpoint",
    ],
    whyItMatters:
      "Glucose normalizes before the anion gap closes. If insulin is stopped at glucose 200, the acidosis continues and the patient has persistent DKA. The insulin infusion must continue with dextrose added to the IV fluids until the gap closes.",
  },
  normalRanges: [
    { parameter: "DKA diagnosis: Glucose", value: ">250", unit: "mg/dL", clinicalNote: "Euglycemic DKA: glucose <250 with SGLT2 inhibitor" },
    { parameter: "DKA diagnosis: pH", value: "<7.30", unit: "", clinicalNote: "Severe DKA: pH <7.0" },
    { parameter: "DKA diagnosis: HCO3", value: "<18", unit: "mEq/L", clinicalNote: "Mild: 15–18; Moderate: 10–15; Severe: <10" },
    { parameter: "DKA monitoring: K", value: "3.5–5.0", unit: "mEq/L", clinicalNote: "Recheck every 1–2h during insulin; hold insulin if K <3.5" },
    { parameter: "DKA monitoring: Glucose", value: "150–250 (target)", unit: "mg/dL", clinicalNote: "Add D5W when glucose <250 to allow continued insulin" },
    { parameter: "DKA resolution: AG", value: "<12", unit: "mEq/L", clinicalNote: "Gap closure confirms DKA resolution — not glucose normalization" },
  ],
  abnormalPatterns: [
    {
      pattern: "Euglycemic DKA",
      direction: "abnormal",
      causes: ["SGLT2 inhibitor use (canagliflozin, dapagliflozin, empagliflozin)", "Prolonged fasting", "Pregnancy"],
      clinicalMeaning: "Glucose <250 with DKA in a patient on SGLT2 inhibitor. Missed because 'glucose isn't that high'. Treated the same as standard DKA.",
    },
    {
      pattern: "Hypokalemia during DKA treatment",
      direction: "low",
      causes: ["Insulin driving K into cells", "Ongoing urinary K loss", "Inadequate K replacement"],
      clinicalMeaning: "Fatal if not anticipated. Monitor K every 1–2h during insulin infusion and replace aggressively.",
    },
  ],
  deepDive:
    "The DKA 'overlap' trap: when glucose reaches 200 mg/dL, add D5W or D10W to the IV fluid and continue insulin infusion until the anion gap closes and HCO3 >18. Stopping insulin prematurely causes anion gap rebound. Transition to subcutaneous insulin only after 2 hours of overlap (long-acting insulin given, then insulin infusion stopped).",
  nursingPriorities: [
    "Check K before starting insulin — if K <3.5, replace first",
    "Hourly glucose monitoring during insulin infusion",
    "Add dextrose to IV when glucose <250 — do NOT stop insulin",
    "BMP/anion gap every 2–4 hours — track gap closure",
    "Accurate I&O — osmotic diuresis causes significant fluid deficit (average 3–5L in DKA)",
    "Phosphate: replete if <1.0 mg/dL, especially in severe DKA",
  ],
  commonTraps: [
    "Stopping insulin when glucose hits 200 — the gap is still open, DKA continues",
    "Missing euglycemic DKA in SGLT2 inhibitor patients — glucose is not always high",
    "Assuming normal serum K means adequate total body K — the patient is K-depleted despite a high K",
    "Not monitoring K frequently enough — can drop from safe to dangerous in hours",
  ],
  notThisBecause: [
    {
      mimicker: "Hyperosmolar hyperglycemic state (HHS)",
      differentiator: "HHS: glucose >600, minimal or no ketones, HCO3 >18, pH near normal, massive osmolality elevation. DKA: moderate glucose, ketoacidosis, lower osmolality.",
    },
    {
      mimicker: "Alcoholic ketoacidosis (AKA)",
      differentiator: "History of alcohol binge + starvation; glucose is normal or low (not elevated); responds to IV glucose + thiamine; no hyperglycemia.",
    },
  ],
  caseApplication: {
    patientProfile: "19-year-old with type 1 DM presenting with vomiting. Glucose 380, Na 131, K 5.2, HCO3 8, AG 28.",
    labSnapshot: "Glucose 380, K 5.2, HCO3 8, AG 28, pH 7.18. Urine ketones large.",
    clinicalContext: "Severe DKA: pH 7.18, HCO3 8, AG 28. K 5.2 is safe to start insulin — but K will fall quickly.",
    question: "What are the DKA management priorities and monitoring plan?",
    reasoning:
      "1. IV fluid: 1L NS bolus immediately. 2. Insulin infusion: 0.1 units/kg/hour (K is 5.2, safe). 3. Potassium replacement starts in IV fluids — K will fall as insulin drives it intracellularly. 4. Glucose hourly. 5. BMP every 2h — track K and AG. 6. Add D5W when glucose <250 and continue insulin until AG <12 and HCO3 >18.",
    nursingActions: [
      "1L NS bolus STAT, then switch to 0.45% NaCl + 20 mEq KCl per bag at 250–500 mL/hr",
      "Start insulin infusion 0.1 units/kg/hr (K is safe at 5.2)",
      "Hourly glucose checks — document every result",
      "Add D5 to IV fluid when glucose <250 mg/dL",
      "BMP every 2 hours — recheck K and anion gap",
      "Hold insulin if K drops to <3.5 — replace K aggressively then resume",
      "Foley catheter — accurate urine output, hourly assessment",
    ],
  },
  practiceItems: [
    {
      stem: "A DKA patient's glucose is 198 mg/dL. Anion gap is still 22. HCO3 is 13. The nurse should:",
      choices: [
        "Stop insulin infusion — glucose is in target range, DKA is resolving",
        "Continue insulin infusion and add dextrose to IV fluid — gap is not closed, DKA continues",
        "Switch to subcutaneous insulin — the oral/SQ transition is appropriate at glucose <200",
        "Increase insulin infusion rate — HCO3 still low, need more aggressive treatment",
      ],
      correct: 1,
      rationale: "Glucose normalization before anion gap closure is expected — it happens early in DKA treatment. Stopping insulin prematurely causes gap rebound. Continue insulin + add dextrose to prevent hypoglycemia until AG <12 and HCO3 >18.",
      trapGuarded: "Equating glucose normalization with DKA resolution — the anion gap is the true endpoint",
    },
    {
      stem: "A DKA patient has K of 3.1 mEq/L. Glucose is 420. Insulin infusion is ordered at 0.1 units/kg/hr. The nurse should:",
      choices: [
        "Start insulin infusion immediately — glucose needs rapid control",
        "Hold insulin infusion, aggressively replace potassium IV, recheck K before starting insulin",
        "Start insulin at half the ordered dose until K improves",
        "Administer PO potassium and start insulin infusion",
      ],
      correct: 1,
      rationale: "Insulin drives potassium into cells. K 3.1 is already hypokalemic — insulin will cause life-threatening hypokalemia. The absolute rule: hold insulin if K <3.5. Replace IV potassium at 20–40 mEq/hr, recheck within 1–2 hours, then start insulin when K ≥3.5.",
      trapGuarded: "Starting insulin in hypokalemic DKA causes cardiac arrest from fatal hypokalemia",
    },
  ],
};

// ─── Lesson 9 — AKI Lab Pattern ───────────────────────────────────────────────

const advLesson09: AdvancedLabsLesson = {
  id: "adv-labs-aki",
  slug: "aki-lab-pattern",
  number: 9,
  title: "AKI Laboratory Pattern: Classification and Monitoring",
  subtitle: "Creatinine trends, BUN/Cr ratio, urine indices, KDIGO staging, and nephrotoxin avoidance",
  level: "advanced",
  estimatedMinutes: 30,
  objectives: [
    "Stage AKI using KDIGO creatinine and urine output criteria",
    "Use BUN/Cr ratio and urine indices to classify AKI as prerenal, intrinsic, or postrenal",
    "Identify nephrotoxic medication exposures and adjust accordingly",
    "Monitor renal recovery and anticipate need for dialysis",
  ],
  overview: {
    clinicalSignificance:
      "AKI occurs in up to 50% of ICU patients and significantly increases mortality. Creatinine lags the true GFR by 24–48 hours — a patient can lose 50% of nephron function before creatinine rises significantly. Trend and staging are more actionable than single values.",
    commonSettings: ["ICU", "nephrology", "post-surgical", "oncology", "transplant"],
    keyQuestion: "Is the kidney not getting enough blood (prerenal), damaged (intrinsic), or blocked (postrenal) — and is it getting worse or improving?",
  },
  mechanism: {
    physiologicalBasis:
      "KDIGO AKI criteria: creatinine rise ≥0.3 mg/dL within 48h, OR ≥1.5× baseline within 7 days, OR UO <0.5 mL/kg/hr × 6h. Stage 1: Cr ×1.5–1.9 or UO <0.5 mL/kg × 6–12h. Stage 2: Cr ×2–2.9 or UO <0.5 × ≥12h. Stage 3: Cr ×3 or UO <0.3 × ≥24h (or anuria ×12h) — dialysis threshold.",
    keyRelationships: [
      "BUN/Cr >20: prerenal (dehydration, GI bleed, CHF — kidney functioning, perfusion low)",
      "BUN/Cr <10: intrinsic renal disease or malnutrition",
      "FENa <1%: prerenal (kidney avidly retaining Na — responding to low flow)",
      "FENa >2%: intrinsic renal injury (tubular damage — can't retain Na)",
      "Urine osmolality >500: prerenal (concentrating ability intact); <350: intrinsic AKI",
    ],
    whyItMatters:
      "A patient with creatinine rising from 0.9 to 1.6 mg/dL over 48 hours has Stage 1 AKI (×1.78 baseline) — not just 'slightly elevated creatinine'. Recognizing staging drives urgency: nephrotoxin review, fluid challenge, urology consult for obstruction, nephrology involvement.",
  },
  normalRanges: [
    { parameter: "Creatinine", value: "0.6–1.2", unit: "mg/dL", clinicalNote: "Lags GFR — a 'normal' Cr can exist with significant GFR loss" },
    { parameter: "BUN", value: "7–20", unit: "mg/dL", clinicalNote: "BUN/Cr >20 = prerenal; elevated by GI bleed, catabolic state, steroids" },
    { parameter: "Urine output", value: ">0.5 mL/kg/hr", unit: "", clinicalNote: "Oliguria <0.5 mL/kg/hr for 6h = AKI criterion" },
    { parameter: "FENa", value: "<1%", unit: "% (calculated)", clinicalNote: "FENa = (UNa × SCr) / (SNa × UCr) × 100" },
  ],
  abnormalPatterns: [
    {
      pattern: "Stage 3 AKI (Cr ×3 or oliguria >24h)",
      direction: "high",
      causes: ["Prolonged prerenal (progressed to ATN)", "Nephrotoxins (contrast, aminoglycosides, NSAIDs)", "Sepsis-associated AKI", "Renal vascular occlusion"],
      clinicalMeaning: "Stage 3 AKI has highest mortality. Renal replacement therapy (CRRT or hemodialysis) is often indicated.",
    },
    {
      pattern: "Rapidly rising creatinine (>0.5 mg/dL/day)",
      direction: "high",
      causes: ["Rhabdomyolysis", "Contrast nephropathy", "Acute GN", "Obstruction"],
      clinicalMeaning: "Rapidly rising Cr requires urgent workup — can reach dialysis threshold within days.",
    },
  ],
  deepDive:
    "Contrast-induced AKI: creatinine peaks at 2–5 days post-contrast and returns to baseline at 7–14 days in most patients. Risk factors: pre-existing CKD, diabetes, CHF, dehydration, concurrent nephrotoxins. Prevention: pre-hydration with isotonic saline, avoid concurrent NSAIDs/ACE inhibitors, low-osmolality contrast, minimize contrast volume.",
  nursingPriorities: [
    "Track creatinine trend daily — calculate staging from baseline",
    "Strict I&O: UO goal >0.5 mL/kg/hr; notify for UO <30 mL/hr × 2h",
    "Review all medications for nephrotoxins: NSAIDs, aminoglycosides, contrast, IV acyclovir, methotrexate",
    "Hold ACE inhibitors, ARBs, metformin, SGLT2 inhibitors in AKI",
    "Monitor electrolytes: hyperkalemia, metabolic acidosis are dialysis-trigger conditions",
    "Daily weights: detect fluid overload from decreased urinary clearance",
  ],
  commonTraps: [
    "Creatinine 1.4 in a patient whose baseline is 0.7 is Stage 2 AKI — not 'borderline elevated'",
    "Low creatinine in elderly with low muscle mass can mask significant AKI",
    "FENa is unreliable in contrast nephropathy, pigment nephropathy, and partial obstruction",
    "Stopping aminoglycosides after 2 days still allows nephrotoxicity from already-accumulated drug",
  ],
  notThisBecause: [
    {
      mimicker: "CKD (chronic) vs AKI",
      differentiator: "CKD: small echogenic kidneys on ultrasound, anemia, phosphate elevation, long-standing elevated Cr. AKI: acute rise from baseline, normal-sized kidneys, more reversible.",
    },
    {
      mimicker: "Rhabdomyolysis AKI",
      differentiator: "Massive CK elevation (>10,000), cola-colored urine positive for blood on dipstick but no RBCs on microscopy, caused by muscle injury not renal pathology per se.",
    },
  ],
  caseApplication: {
    patientProfile: "70-year-old post-op day 3 from bowel resection. Creatinine trending: pre-op 0.9, POD1 1.2, POD2 1.8, POD3 2.6. UO last 12h: 0.3 mL/kg/hr.",
    labSnapshot: "Cr 2.6, BUN 54, BUN/Cr 20.8. Urine Na <20, urine osm 510. BP 88/54 this morning.",
    clinicalContext: "AKI Stage 2 (2.6 / 0.9 = ×2.9) with oliguria. BUN/Cr 20.8, FENa likely <1%, urine osm 510 — prerenal pattern. BP 88/54 confirms hypoperfusion.",
    question: "What are the priorities?",
    reasoning:
      "Prerenal AKI from hypoperfusion post-surgical hypotension. Intervention: fluid challenge (250–500mL crystalloid bolus, reassess), address cause of hypotension (hemorrhage? sepsis?). Hold all nephrotoxins (NSAIDs were given for post-op pain — stop immediately). If prerenal not responsive to fluids, consider ATN already established.",
    nursingActions: [
      "Fluid challenge: 250–500 mL isotonic crystalloid, reassess UO and BP within 1 hour",
      "Hold all NSAIDs, ACE inhibitors, ACE-ARBs immediately",
      "Notify surgical team and nephrology — Stage 2 AKI with oliguria",
      "Strict hourly I&O; Foley if not already placed",
      "Daily BMP — monitor K (hyperkalemia risk), HCO3, creatinine trend",
      "Review all medications for nephrotoxic exposures",
      "Daily renal assessment for CRRT indication: severe acidosis, refractory hyperkalemia, volume overload",
    ],
  },
  practiceItems: [
    {
      stem: "A patient's creatinine is 2.1 mg/dL. Baseline (3 months ago) was 0.8 mg/dL. KDIGO staging is:",
      choices: [
        "Stage 1 — creatinine increased by 1.3 mg/dL (>0.3 mg/dL criterion)",
        "Stage 2 — creatinine is 2.6× baseline (between ×2.0 and ×2.9)",
        "Stage 3 — creatinine exceeds ×3 baseline",
        "No AKI — absolute creatinine below 3.0 mg/dL",
      ],
      correct: 1,
      rationale: "2.1 / 0.8 = 2.625× baseline. KDIGO Stage 2 criteria: Cr ×2.0–2.9 from baseline. Stage does not depend on absolute value — it requires comparison to the individual's baseline.",
      trapGuarded: "Using absolute creatinine to stage AKI instead of fold-change from individual baseline",
    },
    {
      stem: "An ICU patient has oliguria 0.2 mL/kg/hr for 8 hours. BUN/Cr ratio is 28. Urine Na is 12 mEq/L. The most appropriate initial intervention is:",
      choices: [
        "Furosemide 40 mg IV to increase urine output",
        "Fluid challenge with 500 mL isotonic crystalloid and reassess",
        "Immediate nephrology consult for hemodialysis",
        "Urinary catheter placement to rule out obstruction",
      ],
      correct: 1,
      rationale: "BUN/Cr 28 (>20) and urine Na 12 (<20 mEq/L) = prerenal pattern — the kidney is retaining sodium and concentrating urine in response to low perfusion. A fluid challenge is indicated to restore renal perfusion. Diuretics would worsen prerenal AKI.",
      trapGuarded: "Giving diuretics for oliguria when the kidney is already maximally conserving sodium — this worsens prerenal injury",
    },
  ],
};

// ─── Lesson 10 — Critical Care Electrolytes ──────────────────────────────────

const advLesson10: AdvancedLabsLesson = {
  id: "adv-labs-crit-electrolytes",
  slug: "critical-care-electrolytes",
  number: 10,
  title: "Critical Care Electrolytes: Mg, Phos, Ca, Ammonia",
  subtitle: "Magnesium in arrhythmias, phosphate in respiratory failure, ionized calcium, and hepatic encephalopathy",
  level: "mastery",
  estimatedMinutes: 30,
  objectives: [
    "Recognize hypomagnesemia as the driver of refractory hypokalemia",
    "Apply phosphate repletion to ventilator weaning readiness",
    "Interpret ionized calcium rather than total calcium in ICU patients",
    "Use ammonia levels appropriately in hepatic encephalopathy evaluation",
  ],
  overview: {
    clinicalSignificance:
      "These electrolytes are frequently checked, less frequently understood. Hypomagnesemia causes refractory arrhythmias AND makes hypokalemia impossible to correct — two critical pathways. Hypophosphatemia in intubated patients predicts failure to wean. Ionized calcium (not total) guides treatment decisions in ICU.",
    commonSettings: ["ICU", "cardiac", "post-surgical", "hepatology", "liver transplant"],
    keyQuestion: "Is this electrolyte abnormality the primary problem, or is it masking/amplifying another electrolyte disorder?",
  },
  mechanism: {
    physiologicalBasis:
      "Magnesium is required for Na/K-ATPase pump function — low Mg causes potassium wasting by the kidney. You cannot fix hypokalemia without first fixing hypomagnesemia. Phosphate is the backbone of ATP; hypophosphatemia impairs respiratory muscle function — the diaphragm cannot generate enough force to sustain spontaneous breathing. Ionized calcium (not total calcium corrected for albumin) is the biologically active fraction that affects cardiac and neuromuscular function.",
    keyRelationships: [
      "Hypomagnesemia → refractory hypokalemia (replace Mg first, then K)",
      "Phosphate <1.0 mg/dL → diaphragm weakness → failure to wean from ventilator",
      "Ionized Ca (iCa) normal 1.1–1.3 mmol/L; use this not total Ca in ICU",
      "Citrate anticoagulation in CRRT chelates ionized Ca — monitor iCa every 4–6h",
      "Ammonia >150 μmol/L + encephalopathy = hepatic encephalopathy; treat underlying cause",
    ],
    whyItMatters:
      "A ventilated patient who fails every weaning trial despite otherwise improving may have phosphate of 0.7 — replace it and the next trial succeeds. A patient with refractory VF despite multiple defibrillations and all antiarrhythmics may have Mg of 0.9 — give 2g Mg IV and convert.",
  },
  normalRanges: [
    { parameter: "Magnesium", value: "1.7–2.2", unit: "mg/dL", clinicalNote: "Low Mg causes refractory hypokalemia and arrhythmias" },
    { parameter: "Phosphate", value: "2.5–4.5", unit: "mg/dL", clinicalNote: "<1.0 = severe; impairs respiratory, cardiac, RBC function" },
    { parameter: "Ionized calcium", value: "1.12–1.32", unit: "mmol/L", clinicalNote: "Use iCa in ICU, not corrected total calcium" },
    { parameter: "Total calcium", value: "8.5–10.5", unit: "mg/dL", clinicalNote: "Albumin-dependent — unreliable in hypoalbuminemia" },
    { parameter: "Ammonia (venous)", value: "<35", unit: "μmol/L", clinicalNote: ">100 with encephalopathy supports hepatic etiology" },
  ],
  abnormalPatterns: [
    {
      pattern: "Hypomagnesemia + refractory hypokalemia",
      direction: "low",
      causes: ["Diuretics (loop, thiazide)", "Malnutrition", "PPI long-term use", "Alcohol use disorder", "Diarrhea"],
      clinicalMeaning: "Replace Mg 2–4g IV first, then potassium. Potassium will not stay up until magnesium is corrected.",
    },
    {
      pattern: "Hypophosphatemia in ventilated patient",
      direction: "low",
      causes: ["Refeeding syndrome", "Malnutrition", "Antacid use", "Respiratory alkalosis (shifts phos into cells)", "Total parenteral nutrition without phos"],
      clinicalMeaning: "Hypophosphatemia impairs diaphragmatic contractility and oxygen delivery (2,3-DPG depletion). Repleting phosphate is often the key to successful ventilator liberation.",
    },
    {
      pattern: "Low ionized calcium in ICU",
      direction: "low",
      causes: ["Hypoparathyroidism (post-thyroid surgery)", "Massive transfusion (citrate chelation)", "CRRT with citrate", "Pancreatitis", "Sepsis"],
      clinicalMeaning: "iCa <0.9 mmol/L causes hypotension unresponsive to vasopressors, arrhythmias, laryngospasm. Treat with calcium chloride (CVC) or calcium gluconate (peripheral).",
    },
  ],
  deepDive:
    "Refeeding syndrome: in malnourished patients, aggressive nutritional repletion causes a massive intracellular shift of phosphate, potassium, and magnesium as cells resume anabolic metabolism. Serum phosphate crashes (often within 12–24 hours of refeeding), causing cardiac arrhythmias, respiratory failure, and hemolysis. Prevention: identify high-risk patients (BMI <18, prolonged fasting), start nutrition slowly, supplement electrolytes proactively.",
  nursingPriorities: [
    "Always check Mg when potassium is low — correct Mg before K replacement",
    "In ventilated patients: check phosphate daily; replace if <2.0 mg/dL before weaning trials",
    "Use ionized calcium for dosing decisions in ICU — total calcium is misleading",
    "In post-thyroidectomy patients: monitor for sudden iCa drop — hypocalcemic tetany emergency",
    "CRRT patients: ionized calcium every 4–6h; citrate accumulation can cause severe hypocalcemia",
    "In liver failure patients: ammonia if mental status changes; lactulose titrated to 2–3 soft stools/day",
  ],
  commonTraps: [
    "Replacing K when Mg is low — K will not correct until Mg is replaced",
    "Checking total calcium in ICU instead of ionized — low albumin artifactually lowers total Ca",
    "Ammonia level does not correlate with degree of hepatic encephalopathy — use clinical grading scale",
    "Starting full nutrition in a malnourished patient without electrolyte monitoring — refeeding syndrome",
  ],
  notThisBecause: [
    {
      mimicker: "Chvostek/Trousseau sign from hypomagnesemia vs hypocalcemia",
      differentiator: "Both cause tetany signs; check both Mg and iCa. Low Mg impairs PTH release and can cause functional hypocalcemia — treat both.",
    },
    {
      mimicker: "Elevated ammonia from GI bleed vs hepatic failure",
      differentiator: "GI bleed dramatically raises ammonia from protein load in the gut without hepatic failure — improve bowel clearance, not hepatic encephalopathy protocol.",
    },
  ],
  caseApplication: {
    patientProfile: "ICU patient on CRRT for AKI. Citrate regional anticoagulation. Hemodynamics suddenly worsen: BP 78/42, HR 132. Ionized Ca returns at 0.71 mmol/L.",
    labSnapshot: "iCa 0.71 mmol/L (normal 1.12–1.32). Total calcium 8.9 mg/dL (normal).",
    clinicalContext: "CRRT with citrate chelates ionized calcium. Total calcium is normal (citrate-calcium complexes measured as 'total'). iCa 0.71 is critically low — causing cardiogenic hypotension and vasopressor resistance.",
    question: "What is the immediate treatment?",
    reasoning:
      "Critical hypocalcemia from citrate chelation in CRRT. Total calcium is misleadingly normal. Calcium chloride 1g IV bolus via CVC immediately (faster and more reliable than gluconate in emergency). Adjust CRRT citrate rate and calcium replacement protocol.",
    nursingActions: [
      "Calcium chloride 1g IV via central line (calcium gluconate via peripheral as alternative)",
      "Notify provider immediately — critical ionized calcium",
      "Adjust CRRT citrate infusion rate per protocol",
      "Increase calcium replacement in CRRT circuit per protocol",
      "Continuous cardiac monitoring",
      "Repeat iCa in 30–60 minutes after calcium administration",
      "Document exact citrate rate and calcium infusion rates",
    ],
  },
  practiceItems: [
    {
      stem: "An ICU patient has K 3.0 mEq/L despite receiving 160 mEq of IV potassium over 8 hours. K remains at 3.1. Which lab should the nurse check immediately?",
      choices: [
        "Sodium — hyponatremia causes potassium dysregulation",
        "Magnesium — hypomagnesemia causes renal potassium wasting that prevents K replacement",
        "Phosphate — hypophosphatemia competes with potassium for intracellular entry",
        "Urine potassium — confirm renal potassium conservation before giving more",
      ],
      correct: 1,
      rationale: "Refractory hypokalemia despite aggressive replacement is the classic sign of concomitant hypomagnesemia. Mg is required for Na/K-ATPase — without it, the kidney continuously wastes potassium. Replace Mg first, then K will stay.",
      trapGuarded: "Continuing to give more and more potassium without checking and correcting magnesium",
    },
    {
      stem: "A post-thyroidectomy patient develops circumoral tingling, carpopedal spasm, and laryngeal stridor. The priority lab and intervention are:",
      choices: [
        "Check TSH — hypothyroidism from thyroid removal; start levothyroxine",
        "Check ionized calcium — hypocalcemic emergency; calcium gluconate IV immediately",
        "Check total calcium — if <8.0, oral calcium carbonate supplementation",
        "Check phosphate — hypophosphatemia from parathyroid damage; replace with IV sodium phosphate",
      ],
      correct: 1,
      rationale: "Circumoral tingling + carpopedal spasm + laryngospasm = hypocalcemic tetany, a known complication of thyroidectomy from parathyroid removal/injury. This is an emergency. IV calcium gluconate immediately, then check ionized calcium to guide ongoing replacement.",
      trapGuarded: "Using total calcium and oral replacement in a symptomatic emergency — IV treatment is required",
    },
  ],
};

// ─── Curriculum index ─────────────────────────────────────────────────────────

export const ADVANCED_LABS_LESSONS: readonly AdvancedLabsLesson[] = [
  advLesson01,
  advLesson02,
  advLesson03,
  advLesson04,
  advLesson05,
  advLesson06,
  advLesson07,
  advLesson08,
  advLesson09,
  advLesson10,
] as const;

export type AdvancedLabsLessonIndex = {
  id: string;
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  level: "advanced" | "mastery";
  estimatedMinutes: number;
};

export const ADVANCED_LABS_LESSON_INDEX: readonly AdvancedLabsLessonIndex[] =
  ADVANCED_LABS_LESSONS.map(({ id, slug, number, title, subtitle, level, estimatedMinutes }) => ({
    id,
    slug,
    number,
    title,
    subtitle,
    level,
    estimatedMinutes,
  }));

export function getAdvancedLabsLessonBySlug(
  slug: string,
): AdvancedLabsLesson | undefined {
  return ADVANCED_LABS_LESSONS.find((l) => l.slug === slug);
}
