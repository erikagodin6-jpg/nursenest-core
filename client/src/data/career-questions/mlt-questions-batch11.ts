import type { CareerQuestion } from "./rrt-questions";

export const mltQuestionsBatch11: CareerQuestion[] = [
  {
    id: "mlt-b11-001",
    stem: "Serum osmolality is calculated using which formula?",
    options: ["2(Na) + glucose/18 + BUN/2.8", "Na + Cl + glucose", "BUN × 2 + glucose", "K + Na + Cl + HCO3"],
    correctIndex: 0,
    rationale: "Calculated osmolality = 2(Na) + glucose/18 + BUN/2.8. Normal: 275-295 mOsm/kg. Osmol gap = measured - calculated. Gap >10 mOsm/kg suggests unmeasured osmoles: ethanol, methanol, ethylene glycol, isopropanol. Critical for toxicology workup.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-002",
    stem: "A serum sample shows lipase 800 IU/L (ref <60) and amylase 350 IU/L (ref <100). Which enzyme is MORE specific for acute pancreatitis?",
    options: ["Amylase (it is only produced by the pancreas)", "Lipase (it is more specific for pancreatic origin and remains elevated longer than amylase)", "Both are equally specific", "Neither is specific for pancreatitis"],
    correctIndex: 1,
    rationale: "Lipase is more specific than amylase for acute pancreatitis. Amylase is also produced by salivary glands. Lipase rises 4-8 hours after onset, peaks at 24 hours, and remains elevated 8-14 days (longer than amylase which normalizes in 3-5 days). Lipase ≥3x ULN is diagnostic when combined with clinical presentation.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-003",
    stem: "Serum magnesium of 1.0 mEq/L (ref 1.5-2.5) can cause:",
    options: ["Hypertension", "Cardiac arrhythmias, muscle weakness, tremors, and refractory hypokalemia/hypocalcemia", "No symptoms", "Hypercoagulability"],
    correctIndex: 1,
    rationale: "Hypomagnesemia (<1.5 mEq/L): cardiac arrhythmias (torsades de pointes), muscle weakness, tremors, seizures. Importantly, it causes refractory hypokalemia (Mg is needed for K channel function) and refractory hypocalcemia (Mg needed for PTH secretion). Must correct Mg before K and Ca will normalize. Common in alcoholism, diuretic use.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-004",
    stem: "A patient's arterial blood gas shows pH 7.30, pCO2 40 mmHg, HCO3 18 mEq/L, anion gap 20. The acid-base disorder is:",
    options: ["Respiratory acidosis", "High anion gap metabolic acidosis (non-respiratory, with elevated anion gap indicating unmeasured acids)", "Metabolic alkalosis", "Respiratory alkalosis"],
    correctIndex: 1,
    rationale: "pH 7.30 (acidosis) + normal pCO2 40 (no respiratory component) + low HCO3 18 (metabolic acidosis) + elevated AG 20 (normal 8-12) = HAGMA. Causes (MUDPILES): Methanol, Uremia, DKA, Propylene glycol, Isoniazid/Iron, Lactic acidosis, Ethylene glycol, Salicylates. Expected respiratory compensation: pCO2 ≈ 1.5(HCO3) + 8 = 35.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-005",
    stem: "CRP (C-reactive protein) is an acute phase reactant that rises within how many hours of inflammation onset?",
    options: ["1 hour", "6-12 hours (peaks at 24-48 hours)", "3-5 days", "1-2 weeks"],
    correctIndex: 1,
    rationale: "CRP rises within 6-12 hours of inflammation, peaks at 24-48 hours, and has a half-life of 18 hours (declines rapidly when stimulus resolves). Used to monitor infection, inflammation, treatment response. hs-CRP (high-sensitivity) is used for cardiovascular risk assessment. CRP >10 mg/L suggests significant inflammation/infection.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-006",
    stem: "Hemoglobin A1c (HbA1c) reflects average blood glucose over what time period?",
    options: ["1-2 weeks", "2-3 months (reflecting the 120-day RBC lifespan)", "6 months", "1 year"],
    correctIndex: 1,
    rationale: "HbA1c measures glycated hemoglobin (glucose bound to N-terminal valine of beta chain). Reflects average glucose over 2-3 months (RBC lifespan ~120 days, weighted toward recent weeks). ADA target <7% for most diabetics. Conditions affecting RBC lifespan alter A1c: hemolytic anemia (falsely low), iron deficiency (falsely high).",
    difficulty: 1,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-007",
    stem: "Alkaline phosphatase (ALP) is elevated in bone disease and liver disease. To determine the source, which additional test is MOST helpful?",
    options: ["AST", "GGT (gamma-glutamyl transferase) — elevated GGT confirms hepatic origin of elevated ALP", "Lipase", "Amylase"],
    correctIndex: 1,
    rationale: "GGT is elevated in liver/biliary disease but NOT in bone disease. If ALP is elevated and GGT is normal → bone source (Paget disease, growing children, bone metastases). If ALP and GGT are both elevated → liver/biliary source. ALP isoenzymes can also be separated by electrophoresis. 5'-nucleotidase is another liver-specific marker.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-008",
    stem: "Iron deficiency anemia shows which iron studies pattern?",
    options: ["Low serum iron, high TIBC, low ferritin, low transferrin saturation", "High serum iron, low TIBC, high ferritin", "Normal iron studies", "Low serum iron, low TIBC, high ferritin"],
    correctIndex: 0,
    rationale: "Iron deficiency: low serum iron (depleted stores), high TIBC (liver produces more transferrin to capture available iron), low ferritin (reflects depleted iron stores, most sensitive early marker), low transferrin saturation (<20%). Contrast with anemia of chronic disease: low iron, low TIBC, normal/high ferritin (iron trapped in macrophages).",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-009",
    stem: "The RBC indices MCV, MCH, and MCHC are classified as macrocytic/normochromic when:",
    options: ["MCV <80 fL, MCHC <32 g/dL", "MCV >100 fL, MCH >33 pg, MCHC 32-36 g/dL", "MCV 80-100 fL, MCHC 32-36 g/dL", "MCV >100 fL, MCHC >37 g/dL"],
    correctIndex: 1,
    rationale: "Macrocytic (MCV >100 fL) normochromic (MCHC 32-36 g/dL): cells are larger than normal with normal hemoglobin concentration. Causes: B12/folate deficiency (megaloblastic), liver disease, reticulocytosis, hypothyroidism, MDS. Microcytic hypochromic: MCV <80, MCHC <32 (iron deficiency, thalassemia).",
    difficulty: 1,
    category: "Hematology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-010",
    stem: "An elevated ESR (erythrocyte sedimentation rate) indicates:",
    options: ["Specific diagnosis of infection", "Nonspecific indicator of inflammation — proteins like fibrinogen and immunoglobulins promote RBC rouleaux formation and faster sedimentation", "Normal health status", "Dehydration only"],
    correctIndex: 1,
    rationale: "ESR: rate at which RBCs sediment in 1 hour. Elevated by acute phase proteins (fibrinogen, immunoglobulins) that reduce RBC negative charge → promote rouleaux → faster sedimentation. Elevated in: infection, autoimmune disease, malignancy, pregnancy. Normal: <20 mm/hr (increases with age). Very nonspecific — CRP is more responsive and specific.",
    difficulty: 1,
    category: "Hematology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-011",
    stem: "Normal adult hemoglobin electrophoresis shows approximately:",
    options: ["Hgb A 95-98%, Hgb A2 2-3.5%, Hgb F <1%", "Hgb A 60%, Hgb S 40%", "Hgb F 70%, Hgb A 30%", "Hgb A2 50%, Hgb A 50%"],
    correctIndex: 0,
    rationale: "Normal adult hemoglobin: Hgb A (α2β2) = 95-98%, Hgb A2 (α2δ2) = 2-3.5%, Hgb F (α2γ2) = <1%. Elevated A2 (>3.5%) = beta-thalassemia trait. Elevated F: HPFH, beta-thalassemia major, sickle cell disease. Absent A: SS disease, Sβ⁰-thalassemia. Hemoglobin electrophoresis is essential for hemoglobinopathy diagnosis.",
    difficulty: 2,
    category: "Hematology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-012",
    stem: "A corrected reticulocyte count (reticulocyte production index) is calculated to account for:",
    options: ["Platelet count", "The degree of anemia (lower hematocrit means reticulocytes are released earlier and proportionally overrepresented)", "White blood cell count", "Mean corpuscular volume"],
    correctIndex: 1,
    rationale: "Corrected reticulocyte count = retic% × (patient Hct/normal Hct). Reticulocyte production index (RPI) also accounts for shift reticulocytes (premature release): RPI = corrected retic count / maturation factor. RPI >2 = adequate marrow response. RPI <2 = inadequate response (aplastic anemia, B12/folate deficiency, pure red cell aplasia).",
    difficulty: 2,
    category: "Hematology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-013",
    stem: "A D-dimer result of <0.5 µg/mL (negative) in a patient with low clinical probability for PE:",
    options: ["Confirms PE diagnosis", "Effectively rules out PE — the high negative predictive value (>99%) allows safe discharge without imaging", "Requires CT angiography for confirmation", "Is meaningless without imaging"],
    correctIndex: 1,
    rationale: "D-dimer has high sensitivity (>95%) and NPV (>99%) for VTE when combined with low/moderate clinical probability (Wells score). Negative D-dimer safely rules out DVT/PE without imaging. Positive D-dimer is nonspecific (surgery, trauma, infection, pregnancy, cancer can all elevate it) and requires confirmatory imaging (CT-PA for PE, ultrasound for DVT).",
    difficulty: 2,
    category: "Hemostasis / Coagulation",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-014",
    stem: "Urine specific gravity of 1.001 with a urine osmolality of 50 mOsm/kg indicates:",
    options: ["Concentrated urine", "Very dilute urine — consistent with diabetes insipidus (DI) or excessive water intake", "Normal hydration", "Urinary tract infection"],
    correctIndex: 1,
    rationale: "SG 1.001 (near water) and osmolality 50 mOsm/kg (very dilute, normal random urine: 300-900) = maximally dilute urine. Causes: diabetes insipidus (central = low ADH production; nephrogenic = kidneys resist ADH), psychogenic polydipsia, or recent excessive fluid intake. Water deprivation test differentiates central vs. nephrogenic DI.",
    difficulty: 2,
    category: "Urinalysis & Body Fluids",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-015",
    stem: "A CSF/serum glucose ratio of 0.3 (normal >0.6) with elevated protein and lymphocytic pleocytosis suggests:",
    options: ["Normal CSF", "Tuberculous or fungal meningitis — low glucose ratio with lymphocytes suggests chronic infection", "Bacterial meningitis", "Viral meningitis"],
    correctIndex: 1,
    rationale: "TB/fungal meningitis: CSF/serum glucose ratio <0.5, elevated protein (>100 mg/dL), lymphocytic pleocytosis (50-500 WBC/µL). Bacterial meningitis has neutrophils and even lower glucose. Viral meningitis has lymphocytes but usually NORMAL glucose. Acid-fast stain (low sensitivity for TB CSF), cryptococcal antigen, and cultures aid diagnosis.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-016",
    stem: "B-type natriuretic peptide (BNP) or NT-proBNP is used clinically to:",
    options: ["Diagnose MI", "Assess heart failure severity and guide treatment — elevated levels indicate ventricular stretch/volume overload", "Monitor anticoagulation", "Diagnose pulmonary embolism"],
    correctIndex: 1,
    rationale: "BNP/NT-proBNP: released by ventricular cardiomyocytes in response to wall stretch from volume/pressure overload. BNP <100 pg/mL or NT-proBNP <300 pg/mL effectively rules out acute heart failure. Higher levels correlate with HF severity and prognosis. Also used to monitor treatment response. Elevated in renal failure (reduced clearance).",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-017",
    stem: "Procalcitonin (PCT) levels >2 ng/mL are MOST suggestive of:",
    options: ["Viral infection", "Bacterial sepsis — PCT is a biomarker for bacterial infection severity and guides antibiotic stewardship", "Autoimmune disease", "Allergic reaction"],
    correctIndex: 1,
    rationale: "PCT: produced by C-cells of thyroid and extrathyroidal tissues in response to bacterial infection. PCT <0.1 = bacterial infection unlikely (consider stopping antibiotics). 0.1-0.5 = possible. 0.5-2 = likely. >2 = highly likely severe bacterial infection/sepsis. Not significantly elevated in viral infections. Used for antibiotic stewardship (de-escalation guide).",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-018",
    stem: "Urine protein-to-creatinine ratio (UPCR) of 5.0 g/g (ref <0.2) indicates:",
    options: ["Normal proteinuria", "Nephrotic-range proteinuria (UPCR >3.5 g/g correlates with >3.5 g/day protein excretion)", "Mild proteinuria", "Orthostatic proteinuria"],
    correctIndex: 1,
    rationale: "UPCR on random urine correlates with 24-hour protein excretion (grams per gram creatinine ≈ grams per day). UPCR >3.5 g/g = nephrotic range. UPCR 0.2-3.5 = sub-nephrotic proteinuria. Advantages over 24-hour collection: no timing errors, single specimen, can be repeated easily for monitoring.",
    difficulty: 2,
    category: "Urinalysis & Body Fluids",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-019",
    stem: "An absolute eosinophil count of 2,500/µL (ref <500) is termed:",
    options: ["Eosinopenia", "Eosinophilia — elevated eosinophils suggest allergic reactions, parasitic infections, drug reactions, or eosinophilic disorders", "Basophilia", "Monocytosis"],
    correctIndex: 1,
    rationale: "Eosinophilia: absolute eosinophil count >500/µL. Mild: 500-1,500; moderate: 1,500-5,000; severe: >5,000. Causes: allergic/atopic diseases (asthma, eczema), parasitic infections (tissue-invasive helminth), drug reactions, hypereosinophilic syndrome, Churg-Strauss, Hodgkin lymphoma. Mnemonic: NAACP (Neoplasm, Allergy, Addison, Connective tissue, Parasites).",
    difficulty: 1,
    category: "Hematology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-020",
    stem: "The direct antiglobulin test (DAT) uses:",
    options: ["Patient serum + reagent RBCs", "Anti-human globulin (AHG) reagent added directly to patient's washed RBCs to detect in vivo-bound IgG or complement (C3d)", "Only patient plasma", "Donor serum + patient RBCs"],
    correctIndex: 1,
    rationale: "DAT: detects antibodies/complement ALREADY bound to patient RBCs in vivo. Wash patient RBCs (remove unbound proteins) → add polyspecific AHG → agglutination = positive. Monospecific AHG differentiates: anti-IgG (warm AIHA, HDFN, HTR) vs. anti-C3d (cold AIHA, drug-induced). IAT (antibody screen) detects free serum antibodies.",
    difficulty: 2,
    category: "Immunohematology / Blood Banking",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-021",
    stem: "Therapeutic drug monitoring (TDM) for vancomycin now recommends targeting which pharmacokinetic parameter?",
    options: ["Peak level only", "AUC/MIC ratio of 400-600 (area under the concentration-time curve divided by MIC) rather than trough-only monitoring", "Random level", "Trough level of 25-30 µg/mL"],
    correctIndex: 1,
    rationale: "Updated vancomycin TDM guidelines (ASHP/IDSA 2020): target AUC/MIC ratio of 400-600 for serious MRSA infections. AUC-guided dosing reduces nephrotoxicity compared to trough-only targeting (15-20 µg/mL). Bayesian software calculates AUC from 1-2 levels. Trough monitoring alone is still acceptable when AUC monitoring is not available.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-022",
    stem: "Ammonia levels must be analyzed within 15 minutes of collection because:",
    options: ["Ammonia is stable for hours", "In vitro deamination of amino acids by blood cell enzymes causes falsely ELEVATED ammonia if processing is delayed", "Ammonia evaporates", "The tube additive interferes over time"],
    correctIndex: 1,
    rationale: "Ammonia: extremely labile analyte. Blood cell enzymes (glutaminase) deaminate amino acids, producing ammonia in vitro. Collect in EDTA on ice, transport to lab immediately, centrifuge within 15 minutes, and analyze plasma immediately. Delayed processing = falsely elevated results. Critical for hepatic encephalopathy assessment.",
    difficulty: 2,
    category: "Phlebotomy & Specimen Collection",
    topic: "Specimen Handling & Transport"
  },
  {
    id: "mlt-b11-023",
    stem: "A blood smear shows rouleaux formation. The MOST likely associated clinical finding is:",
    options: ["Iron deficiency", "Elevated fibrinogen or immunoglobulins (multiple myeloma, chronic inflammation)", "Dehydration", "Sickle cell disease"],
    correctIndex: 1,
    rationale: "Rouleaux: RBCs stacked like coins. Caused by elevated fibrinogen (acute phase reactant, inflammation) or immunoglobulins (multiple myeloma, Waldenström). Proteins bridge RBCs by reducing negative surface charge (zeta potential). Also causes elevated ESR. Must distinguish from agglutination (irregular clumps, not stacks). Saline replacement disperses rouleaux but not agglutination.",
    difficulty: 2,
    category: "Hematology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-024",
    stem: "An elevated serum uric acid level (>7 mg/dL in males) is associated with:",
    options: ["Hypothyroidism only", "Gout, tumor lysis syndrome, renal disease, and myeloproliferative disorders", "Liver disease exclusively", "Iron deficiency"],
    correctIndex: 1,
    rationale: "Hyperuricemia: elevated uric acid from increased production (tumor lysis, myeloproliferative disorders, high-purine diet) or decreased excretion (renal disease, diuretics, lead poisoning). Gout: MSU crystal deposition in joints. Tumor lysis syndrome: massive cell breakdown releases purines → extreme hyperuricemia → acute kidney injury. Treat with rasburicase/allopurinol.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-025",
    stem: "Methemoglobin (MetHb) level of 30% in a patient exposed to dapsone will present with:",
    options: ["No symptoms", "Cyanosis unresponsive to supplemental oxygen, chocolate-brown blood, and SpO2 reading approximately 85% regardless of true oxygenation", "Jaundice", "Cherry-red skin color"],
    correctIndex: 1,
    rationale: "Methemoglobin: iron in Fe³⁺ state cannot bind O2. >20%: cyanosis, chocolate-brown blood. >50%: seizures, coma. SpO2 gravitates toward 85% (cannot distinguish MetHb from O2Hb/deoxyHb). CO-oximetry required for accurate measurement. Treatment: methylene blue IV (reduces MetHb). Causes: dapsone, benzocaine, nitrites.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-026",
    stem: "An absolute neutrophil count (ANC) of 400/µL is classified as:",
    options: ["Mild neutropenia", "Severe neutropenia (<500/µL) — high risk for life-threatening bacterial and fungal infections", "Normal", "Neutrophilia"],
    correctIndex: 1,
    rationale: "ANC classification: normal >1,500/µL, mild neutropenia 1,000-1,500, moderate 500-1,000, severe <500 (high infection risk), profound <100 (extremely high risk). ANC = WBC × (% segs + % bands)/100. Severe neutropenia requires protective measures, empiric antibiotics for fever, and investigation of cause (chemotherapy, aplastic anemia, drug reaction).",
    difficulty: 1,
    category: "Hematology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-027",
    stem: "A peripheral blood smear shows teardrop cells (dacrocytes), nucleated RBCs, and immature granulocytes. This leukoerythroblastic picture suggests:",
    options: ["Iron deficiency", "Myelophthisic process (bone marrow infiltration by fibrosis, metastatic cancer, or granulomas) — myelofibrosis is the classic example", "Vitamin B12 deficiency", "Normal finding"],
    correctIndex: 1,
    rationale: "Leukoerythroblastic blood film: teardrop cells + NRBCs + immature granulocytes (myelocytes, metamyelocytes) = bone marrow infiltrative process. Classic in myelofibrosis (spent phase of myeloproliferative neoplasm). Also seen in metastatic cancer to bone, granulomatous disease, severe infections. Bone marrow biopsy required for diagnosis.",
    difficulty: 3,
    category: "Hematology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-028",
    stem: "Serum complement C3 and C4 levels are both decreased in a patient with SLE. This indicates:",
    options: ["Normal complement levels", "Classical pathway activation and complement consumption by immune complexes in active SLE", "Alternative pathway activation only", "Complement deficiency syndrome"],
    correctIndex: 1,
    rationale: "SLE: immune complexes activate the classical complement pathway, consuming C4 (classical-specific) and C3 (shared). Both low C3 and C4 = classical pathway consumption. Low C3 only with normal C4 = alternative pathway activation (e.g., C3 nephritic factor). Complement levels correlate with disease activity and are used for monitoring.",
    difficulty: 3,
    category: "Immunology / Serology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-029",
    stem: "A urine sediment shows waxy casts. These indicate:",
    options: ["Normal finding", "Chronic kidney disease with advanced tubular stasis — waxy casts represent the final stage of cast degeneration in stagnant nephrons", "Acute UTI", "Exercise-induced proteinuria"],
    correctIndex: 1,
    rationale: "Waxy casts: smooth, waxy, homogeneous, sharp edges, higher refractive index. Represent end-stage cast degeneration in chronically dilated, stagnant nephrons. Associated with CKD, renal failure, renal amyloidosis. Cast progression: hyaline → granular → waxy → broad (renal failure casts). Broad waxy casts are particularly ominous.",
    difficulty: 2,
    category: "Urinalysis & Body Fluids",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-030",
    stem: "The Friedewald equation for calculating LDL cholesterol is:",
    options: ["LDL = Total cholesterol + HDL + (TG/5)", "LDL = Total cholesterol - HDL - (TG/5)", "LDL = HDL - Total cholesterol", "LDL = TG/5 - HDL"],
    correctIndex: 1,
    rationale: "Friedewald: LDL = TC - HDL - (TG/5). TG/5 estimates VLDL cholesterol. Valid only when TG <400 mg/dL (high TG = inaccurate VLDL estimate). Fasting specimen required (postprandial TG invalidates calculation). Direct LDL measurement is used when TG >400 or for non-fasting specimens. Martin-Hopkins equation is an improved alternative.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-031",
    stem: "A platelet aggregation study shows absent response to ADP, collagen, and epinephrine but NORMAL response to ristocetin. This pattern is consistent with:",
    options: ["Von Willebrand disease", "Glanzmann thrombasthenia — deficient GPIIb/IIIa prevents platelet-to-platelet aggregation via fibrinogen bridging", "Bernard-Soulier syndrome", "Normal platelet function"],
    correctIndex: 1,
    rationale: "Glanzmann thrombasthenia: deficient/dysfunctional GPIIb/IIIa (fibrinogen receptor). Platelets cannot bind fibrinogen → no aggregation with any agonist (ADP, collagen, epinephrine, arachidonic acid). Ristocetin response is NORMAL (ristocetin agglutination uses GPIb-vWF, not GPIIb/IIIa). Bernard-Soulier: absent ristocetin response (GPIb deficiency).",
    difficulty: 3,
    category: "Hemostasis / Coagulation",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-032",
    stem: "Serum ceruloplasmin <20 mg/dL (ref 20-50) with elevated 24-hour urine copper is diagnostic for:",
    options: ["Hemochromatosis", "Wilson disease (hepatolenticular degeneration) — autosomal recessive defect in copper excretion into bile", "Iron deficiency", "Lead poisoning"],
    correctIndex: 1,
    rationale: "Wilson disease: low ceruloplasmin (copper-binding protein, decreased synthesis/copper incorporation), elevated urine copper (>100 µg/24h), elevated hepatic copper on biopsy. Kayser-Fleischer rings (copper in cornea). ATP7B gene mutation prevents biliary copper excretion. Treatment: penicillamine (copper chelation), zinc (blocks absorption).",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-033",
    stem: "The reference range for CSF glucose is approximately:",
    options: ["10-20 mg/dL", "40-70 mg/dL (or 60-70% of simultaneous blood glucose)", "100-200 mg/dL", "200-300 mg/dL"],
    correctIndex: 1,
    rationale: "Normal CSF glucose: 40-70 mg/dL, or 60-70% of simultaneous blood glucose. Always compare to blood glucose drawn within 30 minutes. Decreased CSF glucose: bacterial/TB/fungal meningitis (organisms consume glucose), subarachnoid hemorrhage, meningeal carcinomatosis. Normal glucose in viral meningitis.",
    difficulty: 1,
    category: "Urinalysis & Body Fluids",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-034",
    stem: "An elevated indirect (unconjugated) bilirubin with normal direct bilirubin and normal liver enzymes is MOST consistent with:",
    options: ["Biliary obstruction", "Gilbert syndrome (benign, inherited UGT1A1 deficiency) or hemolytic anemia", "Hepatocellular carcinoma", "Cholangitis"],
    correctIndex: 1,
    rationale: "Isolated indirect hyperbilirubinemia with normal liver function: (1) Gilbert syndrome (most common, affects 5-10% of population, mild UGT1A1 deficiency, bilirubin usually <3 mg/dL, increases with fasting/stress); (2) hemolytic anemia (increased bilirubin production from RBC breakdown — check LDH, haptoglobin, reticulocytes). Distinguish by hemolysis markers.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-035",
    stem: "Platelet count of 600,000/µL with elevated WBC, elevated RBC mass, and low erythropoietin is MOST consistent with:",
    options: ["Essential thrombocythemia", "Polycythemia vera — JAK2 V617F mutation-driven myeloproliferative neoplasm with panmyelosis", "Reactive thrombocytosis", "CML"],
    correctIndex: 1,
    rationale: "Polycythemia vera (PV): elevated RBC mass (elevated Hgb/Hct) + low EPO (endogenous erythropoietin) + JAK2 V617F mutation (~95%). Often accompanied by leukocytosis and thrombocytosis (panmyelosis). Essential thrombocythemia has isolated thrombocytosis. Secondary polycythemia has high EPO. PV risk: thrombosis, progression to myelofibrosis/AML.",
    difficulty: 3,
    category: "Hematology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-036",
    stem: "A urine dipstick positive for protein (1+) with a urine specific gravity of 1.005 indicates:",
    options: ["Insignificant proteinuria", "Potentially significant proteinuria — low SG with 1+ protein means more dilute urine, so the actual protein concentration may be higher than it appears", "Normal finding", "Overflow proteinuria"],
    correctIndex: 1,
    rationale: "Dipstick protein must be interpreted with specific gravity. 1+ protein at SG 1.005 (dilute) represents more protein than 1+ at SG 1.030 (concentrated). At low SG, even trace/1+ may be significant. Confirm with urine protein/creatinine ratio or 24-hour collection. Dipstick primarily detects albumin (insensitive to Bence Jones protein).",
    difficulty: 2,
    category: "Urinalysis & Body Fluids",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-037",
    stem: "Von Willebrand disease (vWD) type 1 laboratory findings include:",
    options: ["Normal everything", "Decreased vWF antigen, decreased vWF activity (ristocetin cofactor), prolonged bleeding time/PFA-100 closure time, mildly prolonged aPTT, normal PT", "Absent vWF with severely prolonged aPTT", "Decreased factor VIII only"],
    correctIndex: 1,
    rationale: "vWD type 1 (most common, 70-80%): quantitative deficiency (reduced levels, all multimers present). Low vWF:Ag, low vWF:RCo (ristocetin cofactor activity), prolonged PFA-100 (platelet function screen), mildly prolonged aPTT (vWF stabilizes factor VIII). Normal PT. Treatment: DDAVP releases stored vWF. Type 3 = absent vWF (most severe).",
    difficulty: 3,
    category: "Hemostasis / Coagulation",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-038",
    stem: "Serum protein electrophoresis showing a polyclonal gammopathy (diffuse, broad-based elevation in gamma region) is MOST associated with:",
    options: ["Multiple myeloma", "Chronic infection, autoimmune disease, or chronic liver disease — multiple clones of B cells produce diverse immunoglobulins", "Waldenström macroglobulinemia", "MGUS"],
    correctIndex: 1,
    rationale: "Polyclonal gammopathy: broad-based elevation in gamma region (multiple immunoglobulin types from many B-cell clones). Causes: chronic infections (HIV, hepatitis), autoimmune diseases (SLE, RA), chronic liver disease. Contrast with monoclonal gammopathy: narrow M-spike (single clone) seen in myeloma, MGUS, Waldenström.",
    difficulty: 2,
    category: "Immunology / Serology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-039",
    stem: "The troponin T or I value associated with 99th percentile upper reference limit (URL) for a high-sensitivity assay is typically:",
    options: ["100 ng/mL", "14-16 ng/L (0.014-0.016 ng/mL) depending on the specific assay manufacturer", "500 ng/L", "1 µg/L"],
    correctIndex: 1,
    rationale: "High-sensitivity troponin assays detect very low levels. 99th percentile URL varies by manufacturer: hs-cTnI (Abbott): 16 ng/L females, 34 ng/L males; hs-cTnT (Roche): 14 ng/L (sex-specific cutoffs being adopted). Any value above URL with rise/fall pattern indicates acute myocardial injury. CV must be ≤10% at the 99th percentile.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-040",
    stem: "Hemoglobin H (HbH) disease results from deletion of how many alpha-globin genes?",
    options: ["1 gene (silent carrier)", "2 genes (alpha-thal trait)", "3 genes (HbH disease — excess beta chains form beta-4 tetramers = HbH)", "4 genes (hydrops fetalis)"],
    correctIndex: 2,
    rationale: "Alpha-thalassemia: 4 alpha genes (αα/αα). 1 deletion: silent carrier. 2 deletions: alpha-thal trait (mild microcytosis). 3 deletions: HbH disease (excess β chains form β4 = HbH; moderate hemolytic anemia, HbH inclusions on brilliant cresyl blue stain). 4 deletions: hydrops fetalis (γ4 = Hb Bart's, incompatible with life).",
    difficulty: 2,
    category: "Hematology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-041",
    stem: "A serum sodium of 160 mEq/L (ref 136-145) with urine osmolality <300 mOsm/kg indicates:",
    options: ["SIADH", "Hypernatremia with dilute urine — suggests diabetes insipidus (kidneys unable to concentrate urine despite high serum osmolality)", "Adrenal insufficiency", "Normal finding"],
    correctIndex: 1,
    rationale: "Hypernatremia (Na >145) with inappropriately dilute urine (should be >800 in hypernatremia) = DI. Central DI: no ADH production (pituitary). Nephrogenic DI: kidneys resistant to ADH. DDAVP (synthetic ADH) test differentiates: central DI responds (urine concentrates), nephrogenic DI does not. Treatment: DDAVP for central, address underlying cause for nephrogenic.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-042",
    stem: "Blood product storage: Packed RBCs are stored at what temperature and for how long (CPDA-1)?",
    options: ["Room temperature for 5 days", "1-6°C for 35 days (CPDA-1) or 42 days (additive solutions like AS-1/AS-3/AS-5)", "-20°C for 1 year", "37°C for 24 hours"],
    correctIndex: 1,
    rationale: "RBC storage: 1-6°C. CPDA-1: 35 days. Additive solutions (AS-1, AS-3, AS-5): 42 days. Platelets: 20-24°C with agitation, 5 days (7 with pathogen reduction). FFP: -18°C or below, 1 year. Cryoprecipitate: -18°C, 1 year. Once thawed, FFP must be used within 24 hours. RBCs expire 24 hours after pooling or entry into system.",
    difficulty: 2,
    category: "Immunohematology / Blood Banking",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-043",
    stem: "Serum ferritin of 15 ng/mL (ref 20-200) confirms:",
    options: ["Iron overload", "Iron deficiency — ferritin is the most sensitive early marker of depleted iron stores", "Anemia of chronic disease", "Normal iron status"],
    correctIndex: 1,
    rationale: "Ferritin <20 ng/mL is diagnostic for iron deficiency (sensitivity ~59%, specificity ~99%). It is the first lab value to decrease in iron depletion (before serum iron, TIBC, or hemoglobin changes). Ferritin is also an acute phase reactant: may be falsely normal/elevated in inflammation, masking concurrent iron deficiency. Check CRP to assess inflammation.",
    difficulty: 1,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-044",
    stem: "A semen analysis shows complete absence of sperm (azoospermia). The next step in evaluation is:",
    options: ["Repeat the analysis", "Centrifuge the specimen to look for rare sperm, and evaluate FSH and testicular volume to differentiate obstructive from non-obstructive azoospermia", "No further testing needed", "Testosterone level only"],
    correctIndex: 1,
    rationale: "Azoospermia evaluation: (1) centrifuge entire specimen (cryptozoospermia = rare sperm). (2) FSH + testicular exam: normal FSH + normal testis size = obstructive (vasectomy, CBAVD, ejaculatory duct obstruction). Elevated FSH + small testes = non-obstructive (maturation arrest, Sertoli cell-only, Klinefelter). Karyotype and Y-microdeletion testing may follow.",
    difficulty: 3,
    category: "Urinalysis & Body Fluids",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-045",
    stem: "A peripheral blood smear shows numerous target cells, and hemoglobin electrophoresis reveals: Hgb A 95%, Hgb A2 5.5%, Hgb F 2%. This is consistent with:",
    options: ["Sickle cell trait", "Beta-thalassemia trait (minor) — elevated Hgb A2 (>3.5%) with mild microcytosis and target cells", "Hgb C disease", "Normal hemoglobin"],
    correctIndex: 1,
    rationale: "Beta-thalassemia trait: one defective beta gene → reduced beta chain production → microcytic hypochromic anemia (usually mild), target cells, elevated Hgb A2 (>3.5%, typically 4-6%), slightly elevated Hgb F. Differentiate from iron deficiency (normal/low A2 in iron deficiency). Important to identify carriers for genetic counseling.",
    difficulty: 2,
    category: "Hematology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-046",
    stem: "A serum lithium level of 2.5 mEq/L (therapeutic range 0.6-1.2) requires:",
    options: ["No action", "Immediate medical attention — lithium toxicity (>1.5 mEq/L) causes tremor, confusion, seizures, and renal failure; >2.5 is severe requiring potential dialysis", "Increased lithium dose", "Repeat in 2 weeks"],
    correctIndex: 1,
    rationale: "Lithium therapeutic range: 0.6-1.2 mEq/L. Toxicity: 1.5-2.5 (mild-moderate: GI symptoms, tremor, confusion); 2.5-3.5 (severe: seizures, coma, cardiac arrhythmias); >3.5 (life-threatening). Draw trough level (12 hours post-dose). Treatment of severe toxicity: hemodialysis. Narrow therapeutic index requires regular TDM.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-047",
    stem: "The reference method for measuring hemoglobin in the clinical laboratory is:",
    options: ["Visual comparison", "Cyanmethemoglobin (HiCN) spectrophotometric method at 540 nm", "Copper sulfate specific gravity", "Sahli method"],
    correctIndex: 1,
    rationale: "Cyanmethemoglobin: reference method. Drabkin reagent (potassium ferricyanide + potassium cyanide) converts all hemoglobin forms (oxy, deoxy, carboxy, met) to cyanmethemoglobin. Read at 540 nm against standard curve. Measures total hemoglobin. Exception: sulfhemoglobin is not converted. Most analyzers use modified cyanide-free methods.",
    difficulty: 2,
    category: "Hematology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-048",
    stem: "Hepatitis B e-antigen (HBeAg) positive status indicates:",
    options: ["Immunity", "High viral replication and high infectivity — the patient has a high viral load and is highly contagious", "Resolved infection", "Vaccination response"],
    correctIndex: 1,
    rationale: "HBeAg: secreted protein indicating active viral replication, high HBV DNA levels, and high infectivity. HBeAg seroconversion (HBeAg → anti-HBe) usually indicates decreased replication and lower infectivity. HBeAg-positive chronic hepatitis B has higher risk of liver disease progression. Treatment consideration: HBeAg status guides therapy duration.",
    difficulty: 2,
    category: "Virology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-049",
    stem: "Factor V Leiden mutation is detected by:",
    options: ["PT testing", "Activated protein C resistance (APC-R) screening assay, confirmed by molecular testing (PCR) for the factor V R506Q mutation", "Platelet aggregation", "Bleeding time"],
    correctIndex: 1,
    rationale: "Factor V Leiden: most common inherited thrombophilia (3-8% of Caucasians). Point mutation (R506Q) makes factor V resistant to inactivation by activated protein C. Screening: APC resistance assay (modified aPTT-based). Confirmation: PCR for the specific G1691A mutation. Heterozygous: 5-7x VTE risk. Homozygous: 80x risk.",
    difficulty: 3,
    category: "Hemostasis / Coagulation",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-050",
    stem: "Urobilinogen on a urine dipstick is normally:",
    options: ["Absent", "Present in small amounts (0.2-1.0 Ehrlich units/dL) — it is a normal product of bilirubin metabolism", "Only present in liver disease", "Only present in hemolytic anemia"],
    correctIndex: 1,
    rationale: "Normal urine contains small amounts of urobilinogen (bilirubin → intestinal bacteria produce urobilinogen → some reabsorbed and excreted by kidneys). Increased: hemolytic anemia (increased bilirubin production), hepatitis (impaired liver reuptake). Absent/decreased: biliary obstruction (no bilirubin reaches intestine), broad-spectrum antibiotics.",
    difficulty: 1,
    category: "Urinalysis & Body Fluids",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-051",
    stem: "Serum phosphorus of 6.5 mg/dL (ref 2.5-4.5) with calcium 7.8 mg/dL and elevated PTH is MOST consistent with:",
    options: ["Primary hyperparathyroidism", "Secondary hyperparathyroidism due to chronic kidney disease — kidneys cannot excrete phosphorus or produce active vitamin D", "Hypoparathyroidism", "Vitamin D toxicity"],
    correctIndex: 1,
    rationale: "CKD causes: (1) decreased phosphorus excretion → hyperphosphatemia, (2) decreased 1,25-dihydroxyvitamin D production → decreased calcium absorption → hypocalcemia, (3) compensatory PTH elevation (secondary hyperparathyroidism). In contrast, primary hyperparathyroidism shows high Ca, low P, high PTH. Treatment of secondary HPT: phosphate binders, vitamin D analogs.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-052",
    stem: "A FISH (fluorescence in situ hybridization) test on a CML patient shows the BCR-ABL1 fusion gene. This corresponds to which chromosomal abnormality?",
    options: ["t(15;17)", "t(9;22) Philadelphia chromosome — BCR-ABL1 fusion producing a constitutively active tyrosine kinase", "t(8;14)", "t(14;18)"],
    correctIndex: 1,
    rationale: "Philadelphia chromosome t(9;22): BCR (chr 22) fuses with ABL1 (chr 9) → constitutively active tyrosine kinase. Present in >95% of CML. Also found in some ALL cases. Treatment: tyrosine kinase inhibitors (imatinib/Gleevec, dasatinib, nilotinib). Molecular monitoring by RT-PCR for BCR-ABL1 transcript quantification guides therapy response.",
    difficulty: 2,
    category: "Molecular Diagnostics",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-053",
    stem: "An INR of 2.5 in a patient on warfarin with a mechanical heart valve is:",
    options: ["Supratherapeutic — needs dose reduction", "Within the therapeutic range (INR 2.5-3.5 for mechanical heart valves)", "Subtherapeutic", "Critically elevated"],
    correctIndex: 1,
    rationale: "Warfarin INR targets: most indications (DVT, PE, A-fib) = 2.0-3.0. Mechanical heart valves = 2.5-3.5 (higher target due to increased thrombotic risk). INR 2.5 for a mechanical valve patient is at the lower end of therapeutic range. Time in therapeutic range (TTR) >65% indicates good anticoagulation management.",
    difficulty: 2,
    category: "Hemostasis / Coagulation",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-054",
    stem: "The CD4 count that defines AIDS (acquired immunodeficiency syndrome) is:",
    options: ["<500 cells/µL", "<350 cells/µL", "<200 cells/µL (or any AIDS-defining illness regardless of CD4 count)", "<50 cells/µL"],
    correctIndex: 2,
    rationale: "AIDS defined by: CD4 <200 cells/µL OR an AIDS-defining illness (Pneumocystis pneumonia, Kaposi sarcoma, CMV retinitis, etc.) regardless of CD4 count. CD4 200-499 = immunosuppressed. CD4 <50 = high risk for MAC, CMV, Cryptosporidium. ART (antiretroviral therapy) is indicated for all HIV+ patients regardless of CD4 count.",
    difficulty: 1,
    category: "Immunology / Serology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-055",
    stem: "Amniotic fluid showing a lecithin/sphingomyelin (L/S) ratio ≥2.0 indicates:",
    options: ["Fetal neural tube defect", "Fetal lung maturity — sufficient surfactant production to reduce risk of respiratory distress syndrome (RDS)", "Fetal kidney maturity", "Maternal diabetes"],
    correctIndex: 1,
    rationale: "L/S ratio ≥2.0 indicates fetal lung maturity (adequate surfactant production by type II pneumocytes). L/S <2.0 = immature lungs, risk of RDS. Phosphatidylglycerol (PG) presence is the most reliable indicator (not affected by blood or meconium contamination). Lamellar body count >50,000/µL on automated counter is another rapid assessment.",
    difficulty: 2,
    category: "Urinalysis & Body Fluids",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-056",
    stem: "A molecular test shows an HIV-1 viral load of 150 copies/mL (ref: undetectable <20 copies/mL). The patient is on ART. This indicates:",
    options: ["Complete viral suppression", "Low-level viremia — investigate adherence, drug resistance testing may be warranted if viral load remains detectable on repeat testing", "Treatment failure", "Acute HIV infection"],
    correctIndex: 1,
    rationale: "HIV viral load goal on ART: undetectable (<20-50 copies/mL, assay-dependent). Detectable viremia (50-200 copies/mL) = low-level viremia. Often transient (viral blip). Persistent viremia >200 copies/mL on two consecutive tests = virologic failure. Evaluate adherence first, then consider genotypic resistance testing. Undetectable = untransmittable (U=U).",
    difficulty: 2,
    category: "Molecular Diagnostics",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-057",
    stem: "A sweat chloride test result of 75 mmol/L (ref <30 normal, 30-59 borderline, ≥60 positive) in a child with recurrent respiratory infections confirms:",
    options: ["Normal result", "Cystic fibrosis — sweat chloride ≥60 mmol/L is diagnostic (pilocarpine iontophoresis method)", "Adrenal insufficiency", "Dehydration"],
    correctIndex: 1,
    rationale: "Sweat chloride ≥60 mmol/L = diagnostic for cystic fibrosis (gold standard test). Pilocarpine iontophoresis stimulates sweat production, collected on gauze/coil. Minimum 75 mg sweat required. CF: defective CFTR chloride channel → elevated sweat NaCl. Confirmatory: CFTR mutation analysis. Newborn screening uses immunoreactive trypsinogen (IRT).",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-058",
    stem: "Flow cytometry CD4/CD8 ratio in a healthy adult is normally:",
    options: ["<0.5", "1.0-3.5 (with CD4 cells outnumbering CD8 cells)", ">10", "Exactly 1.0"],
    correctIndex: 1,
    rationale: "Normal CD4/CD8 ratio: 1.0-3.5. CD4 (helper T cells): 500-1,500/µL. CD8 (cytotoxic T cells): 150-1,000/µL. Inverted ratio (<1.0): HIV/AIDS, CMV infection, some malignancies. Elevated ratio: autoimmune diseases. Used for HIV monitoring (absolute CD4 count more important than ratio for staging).",
    difficulty: 2,
    category: "Immunology / Serology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-059",
    stem: "An ASO (antistreptolysin O) titer of 400 IU/mL (ref <200) indicates:",
    options: ["Current Group A Strep infection", "Recent Group A Streptococcal infection — elevated ASO confirms recent exposure, supporting diagnosis of post-streptococcal glomerulonephritis or rheumatic fever", "Chronic strep carrier state", "Staphylococcal infection"],
    correctIndex: 1,
    rationale: "ASO detects antibodies to streptolysin O (GAS exotoxin). Rises 1-3 weeks after GAS pharyngitis, peaks at 3-5 weeks. Elevated ASO supports post-streptococcal sequelae (rheumatic fever, post-streptococcal glomerulonephritis). Serial titers showing rise are more significant than single elevated value. Anti-DNase B also used (more sensitive for skin infections).",
    difficulty: 2,
    category: "Immunology / Serology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-060",
    stem: "A peripheral blood smear shows Auer rods in blast cells. This finding is pathognomonic for:",
    options: ["ALL", "AML — Auer rods are crystallized primary granule contents (MPO, lysozyme) found exclusively in myeloid blasts", "CLL", "Hairy cell leukemia"],
    correctIndex: 1,
    rationale: "Auer rods: pink-red needle-like cytoplasmic inclusions in myeloid blasts. Composed of fused primary (azurophilic) granules containing myeloperoxidase. Pathognomonic for AML (never seen in ALL). Bundles of Auer rods (faggot cells) are characteristic of APL (AML-M3, t(15;17)). PML-RARA fusion treated with ATRA + arsenic trioxide.",
    difficulty: 2,
    category: "Hematology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-061",
    stem: "Fibrinogen level <100 mg/dL (ref 200-400) in a patient with active bleeding suggests:",
    options: ["Normal coagulation", "Hypofibrinogenemia requiring cryoprecipitate transfusion — each unit of cryo raises fibrinogen approximately 5-10 mg/dL", "Thrombotic tendency", "No treatment needed"],
    correctIndex: 1,
    rationale: "Fibrinogen <100 mg/dL with active bleeding: transfuse cryoprecipitate (concentrated fibrinogen, factor VIII, vWF, XIII). Each unit raises fibrinogen ~5-10 mg/dL. Standard dose: 10 units (pool). Target fibrinogen: >100 mg/dL for bleeding patients, >200 mg/dL in DIC. Causes of low fibrinogen: DIC (consumption), liver failure, dilution (massive transfusion).",
    difficulty: 2,
    category: "Hemostasis / Coagulation",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-062",
    stem: "An eGFR of 45 mL/min/1.73m² calculated by the CKD-EPI equation corresponds to CKD Stage:",
    options: ["Stage 2", "Stage 3a (45-59 mL/min = 3a, 30-44 mL/min = 3b)", "Stage 4", "Stage 5"],
    correctIndex: 1,
    rationale: "CKD-EPI equation: more accurate than MDRD, especially at higher GFR. GFR 45 = Stage 3a (mild-moderate decrease). Stage 3a: 45-59. Stage 3b: 30-44. CKD-EPI uses serum creatinine, age, sex, and race (2021 equation removed race variable). Cystatin C-based equations provide race-independent estimation.",
    difficulty: 1,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-063",
    stem: "An RPR (rapid plasma reagin) is reactive at 1:64 dilution. The confirmatory test is:",
    options: ["Repeat RPR", "FTA-ABS (fluorescent treponemal antibody absorption) or TP-PA (T. pallidum particle agglutination) — specific treponemal tests confirm syphilis", "Blood culture", "Gram stain"],
    correctIndex: 1,
    rationale: "Syphilis testing algorithm: (1) Screening: RPR or VDRL (non-treponemal, detect reagin/anticardiolipin). (2) Confirmation: FTA-ABS, TP-PA, or treponemal EIA (specific for T. pallidum antibodies). RPR/VDRL titer correlates with disease activity (decreases with treatment). False positive RPR: SLE, pregnancy, IV drug use, viral infections.",
    difficulty: 2,
    category: "Immunology / Serology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-064",
    stem: "The Kleihauer-Betke (KB) test detects:",
    options: ["Sickle hemoglobin", "Fetal hemoglobin (HbF)-containing RBCs in maternal blood, quantifying fetomaternal hemorrhage to determine RhIG dosage", "Adult hemoglobin variants", "Methemoglobin"],
    correctIndex: 1,
    rationale: "KB test: acid elution technique. Adult Hgb A is eluted from maternal RBCs (appear as ghosts), while fetal HbF resists acid elution (appear as dark-staining cells). Percent fetal cells × maternal blood volume = volume of fetomaternal hemorrhage. >30 mL fetal blood requires additional RhIG doses beyond the standard 300 µg. Flow cytometry is more accurate.",
    difficulty: 2,
    category: "Immunohematology / Blood Banking",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b11-065",
    stem: "A next-generation sequencing (NGS) panel for hematologic malignancies detects mutations in which clinically actionable genes?",
    options: ["Only BCR-ABL1", "Multiple genes including FLT3, NPM1, IDH1/IDH2, TP53, DNMT3A, and others that guide prognosis and targeted therapy selection in AML and MDS", "Only BRCA1/2", "Only KRAS"],
    correctIndex: 1,
    rationale: "NGS panels for hematologic malignancies detect multiple mutations simultaneously: FLT3-ITD/TKD (midostaurin for AML), NPM1 (favorable prognosis AML), IDH1/2 (ivosidenib/enasidenib), TP53 (poor prognosis), DNMT3A, ASXL1 (adverse MDS), CEBPA, RUNX1. Results guide ELN risk stratification and targeted therapy selection. Essential for personalized medicine.",
    difficulty: 3,
    category: "Molecular Diagnostics",
    topic: "Lab Value Interpretation"
  }
];
