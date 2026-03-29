import type { CareerQuestion } from "./rrt-questions";

export const mltQuestionsBatch10: CareerQuestion[] = [
  {
    id: "mlt-b10-001",
    stem: "A patient presents with fatigue, pallor, and a CBC showing: Hgb 6.5 g/dL, MCV 110 fL, MCH 36 pg, RDW elevated, reticulocyte count 0.5%. The peripheral smear shows oval macrocytes and hypersegmented neutrophils (≥5 lobes). The MOST likely diagnosis is:",
    options: ["Iron deficiency anemia", "Megaloblastic anemia (vitamin B12 or folate deficiency)", "Aplastic anemia", "Hemolytic anemia"],
    correctIndex: 1,
    rationale: "Megaloblastic anemia: macrocytic (MCV >100), oval macrocytes, hypersegmented neutrophils (≥5 lobes or >5% with 5 lobes = pathognomonic). Low reticulocytes indicate inadequate marrow response. Caused by B12 or folate deficiency impairing DNA synthesis. Distinguish by measuring serum B12, folate, methylmalonic acid (elevated in B12 deficiency only), and homocysteine (elevated in both).",
    difficulty: 3,
    category: "Hematology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-002",
    stem: "A 60-year-old male presents with bone pain, hypercalcemia, and elevated total protein. SPEP shows a large M-spike in the gamma region. Urine shows Bence Jones proteinuria. Bone marrow biopsy shows >30% plasma cells. The diagnosis is:",
    options: ["MGUS", "Multiple myeloma", "Waldenström macroglobulinemia", "Reactive plasmacytosis"],
    correctIndex: 1,
    rationale: "Multiple myeloma diagnostic criteria: ≥10% clonal bone marrow plasma cells AND myeloma-defining events (CRAB: hypercalcemia, renal insufficiency, anemia, bone lesions). M-spike on SPEP with >30% plasma cells is diagnostic. Bence Jones protein = free light chains in urine. IFE identifies the monoclonal protein type.",
    difficulty: 3,
    category: "Hematology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-003",
    stem: "A pediatric patient has a WBC of 85,000/µL with 92% lymphoblasts. Flow cytometry shows CD10+, CD19+, CD34+, TdT+. The diagnosis is:",
    options: ["AML", "B-cell ALL (acute lymphoblastic leukemia)", "CML", "CLL"],
    correctIndex: 1,
    rationale: "CD19+ (B-cell), CD10+ (CALLA/common ALL antigen), CD34+ (blast marker), TdT+ (immature lymphoid marker) = B-cell ALL, the most common childhood leukemia. Peak age 2-5 years. Excellent prognosis with modern therapy (>90% cure rate). Philadelphia chromosome t(9;22) worsens prognosis.",
    difficulty: 3,
    category: "Hematology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-004",
    stem: "A chemistry analyzer flags a potassium result of 8.2 mEq/L on a routine specimen. The patient is an outpatient with no history of renal disease. The specimen appears slightly pink. The BEST next step is:",
    options: ["Report the result immediately as a critical value", "Check the specimen for hemolysis, contact the ordering provider about the unexpected result, and request a recollection", "Repeat the test on the same specimen", "Assume the result is accurate"],
    correctIndex: 1,
    rationale: "K+ 8.2 in an outpatient without renal disease is suspect. Pink serum = hemolysis, the most common cause of falsely elevated potassium. RBCs contain ~23x more K+ than plasma. Check hemolysis index, notify provider, request recollection. Never report a suspicious critical value without verifying specimen integrity.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Instrument Troubleshooting"
  },
  {
    id: "mlt-b10-005",
    stem: "A lab technologist performs a DAT (direct antiglobulin test) on a newborn with jaundice. The result is 2+ with anti-IgG. The mother is type O, Rh positive. The baby is type A, Rh positive. The MOST likely cause of the positive DAT is:",
    options: ["Rh hemolytic disease", "ABO hemolytic disease of the fetus/newborn (HDFN)", "Autoimmune hemolytic anemia", "Drug-induced antibodies"],
    correctIndex: 1,
    rationale: "ABO HDFN: Group O mother has naturally occurring anti-A and anti-B IgG that crosses the placenta and coats fetal type A (or B) red cells. DAT positive with anti-IgG. More common than Rh HDFN (since Rh immune globulin prophylaxis). Usually milder than Rh HDFN. Treatment: phototherapy, rarely exchange transfusion.",
    difficulty: 3,
    category: "Immunohematology / Blood Banking",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-006",
    stem: "Case: A urine dipstick shows blood 3+ but microscopic examination reveals 0-2 RBCs/HPF. The MOST likely explanation is:",
    options: ["False negative microscopy", "Myoglobinuria or hemoglobinuria (both produce positive dipstick blood without intact RBCs in sediment)", "Laboratory error in dipstick reading", "Normal finding"],
    correctIndex: 1,
    rationale: "Dipstick 'blood' detects the peroxidase activity of hemoglobin — whether in intact RBCs, free hemoglobin, or myoglobin. Positive dipstick with few/no RBCs on microscopy = hemoglobinuria (intravascular hemolysis) or myoglobinuria (rhabdomyolysis). Differentiate by serum color (pink = hemoglobin) and CK levels (elevated in rhabdomyolysis).",
    difficulty: 3,
    category: "Urinalysis & Body Fluids",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-007",
    stem: "A blood bank technologist crossmatches a unit and finds an incompatibility at the AHG (indirect antiglobulin) phase. The antibody screen is negative. The MOST likely cause is:",
    options: ["ABO incompatibility", "An antibody to a low-frequency antigen present on the donor RBCs but not on screening cells", "Technical error in ABO typing", "The crossmatch is always incompatible"],
    correctIndex: 1,
    rationale: "Negative antibody screen + incompatible crossmatch at AHG = antibody to a low-frequency (low-prevalence) antigen. Screening cells may not carry the antigen, but the specific donor unit does. Examples: anti-Kp^a, anti-Js^a, anti-Wr^a. Select an alternative unit that is crossmatch-compatible. Panel testing may not identify these antibodies.",
    difficulty: 3,
    category: "Immunohematology / Blood Banking",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-008",
    stem: "A laboratory receives a specimen for coagulation testing in a light blue (citrate) tube. The tube is only half full. The correct action is:",
    options: ["Process the specimen normally", "Reject the specimen — under-filled citrate tubes have an incorrect blood-to-anticoagulant ratio, causing falsely prolonged results", "Centrifuge and test only the PT", "Add saline to fill the tube"],
    correctIndex: 1,
    rationale: "Citrate tubes require 9:1 blood-to-anticoagulant ratio. Under-filling increases relative citrate concentration, which over-chelates calcium and falsely prolongs PT/aPTT results. Tubes must be ≥90% full. Reject and request recollection. Exception: some labs accept for fibrinogen (less affected).",
    difficulty: 2,
    category: "Phlebotomy & Specimen Collection",
    topic: "Specimen Handling & Transport"
  },
  {
    id: "mlt-b10-009",
    stem: "A patient's serum protein electrophoresis (SPEP) shows decreased albumin, elevated alpha-1 and alpha-2 globulins, and normal gamma globulins. This pattern is MOST consistent with:",
    options: ["Multiple myeloma", "Nephrotic syndrome (albumin loss with compensatory increase in larger proteins)", "Chronic liver disease", "Acute inflammation"],
    correctIndex: 1,
    rationale: "Nephrotic syndrome SPEP: low albumin (lost in urine, MW ~66 kDa), elevated alpha-2 macroglobulin (too large to filter, MW 720 kDa, liver increases production), elevated alpha-2 fraction. Acute inflammation shows elevated alpha-1 (AAT, AAG) and alpha-2 (haptoglobin, ceruloplasmin). Multiple myeloma shows M-spike in gamma.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-010",
    stem: "A hematology analyzer generates an abnormal scattergram showing an extra cluster of cells between the lymphocyte and monocyte regions. This finding is MOST consistent with:",
    options: ["Normal blood", "Atypical lymphocytes or circulating blast cells requiring manual differential review", "Platelet clumps", "Lipemia interference"],
    correctIndex: 1,
    rationale: "Abnormal scattergram clusters between normal populations indicate abnormal cells: blasts, atypical lymphocytes (reactive), circulating lymphoma cells, or immature granulocytes. Automated flags (blasts, atypical lymphs, LUC/variant lymphs) must trigger manual smear review for confirmation and classification.",
    difficulty: 2,
    category: "Hematology",
    topic: "Instrument Troubleshooting"
  },
  {
    id: "mlt-b10-011",
    stem: "Case: A 45-year-old alcoholic presents with macrocytic anemia (MCV 105 fL), thrombocytopenia, and target cells on smear. B12 and folate levels are normal. The MOST likely cause is:",
    options: ["Megaloblastic anemia", "Liver disease-related macrocytosis (non-megaloblastic) with hypersplenism", "Myelodysplastic syndrome", "Iron deficiency"],
    correctIndex: 1,
    rationale: "Alcoholic liver disease causes macrocytosis WITHOUT megaloblastic changes (round macrocytes, not oval; no hypersegmented neutrophils). Mechanism: altered lipid metabolism changes RBC membrane composition. Target cells are characteristic of liver disease. Thrombocytopenia from portal hypertension/hypersplenism. Normal B12/folate rules out megaloblastic anemia.",
    difficulty: 3,
    category: "Hematology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-012",
    stem: "Troubleshooting: A chemistry analyzer consistently produces lipemic interference errors. Which methods are MOST affected by lipemia?",
    options: ["Ion-selective electrode (ISE) methods", "Spectrophotometric/colorimetric methods — lipemia increases light scattering and absorbance, causing turbidity interference", "All methods are equally affected", "Only enzymatic methods"],
    correctIndex: 1,
    rationale: "Lipemia causes turbidity that increases absorbance at all wavelengths, affecting spectrophotometric methods (falsely elevated results). ISE methods (Na, K, Cl) are minimally affected by lipemia. Solutions: ultracentrifugation to remove lipid layer, lipemia-clearing reagent (lipase), or dilution (if within linear range). Hemolysis and icterus indices should also be checked.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Instrument Troubleshooting"
  },
  {
    id: "mlt-b10-013",
    stem: "A microbiology culture grows oxidase-positive, gram-negative bacilli on blood agar with a fruity (grape-like) odor and blue-green pigment. The organism is MOST likely:",
    options: ["Escherichia coli", "Pseudomonas aeruginosa", "Klebsiella pneumoniae", "Proteus mirabilis"],
    correctIndex: 1,
    rationale: "Pseudomonas aeruginosa: gram-negative bacillus, oxidase positive, produces pyocyanin (blue-green pigment) and pyoverdin (yellow-green fluorescent pigment), grape-like or tortilla-like odor. Non-lactose fermenter (colorless on MacConkey). Inherently resistant to many antibiotics. Causes hospital-acquired pneumonia, UTIs, wound infections, CF lung infections.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-014",
    stem: "A blood culture grows in 12 hours. Gram stain shows gram-positive cocci in chains. Catalase negative, beta-hemolytic on blood agar, bacitracin sensitive, PYR positive. The organism is:",
    options: ["Staphylococcus aureus", "Streptococcus pyogenes (Group A Streptococcus)", "Enterococcus faecalis", "Streptococcus agalactiae"],
    correctIndex: 1,
    rationale: "GPC in chains + catalase negative = Streptococcus or Enterococcus. Beta-hemolytic + bacitracin sensitive + PYR positive = S. pyogenes (Group A Strep). S. agalactiae (Group B) is bacitracin resistant, CAMP positive. Enterococcus is PYR positive but usually alpha/gamma hemolytic and grows in 6.5% NaCl.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-015",
    stem: "A CSF specimen is received for culture. What is the MOST critical pre-analytical requirement?",
    options: ["Refrigerate immediately", "Process immediately — CSF specimens must never be refrigerated due to sensitivity of meningeal pathogens (especially N. meningitidis and H. influenzae) to cold", "Hold until the next batch run", "Freeze for transport"],
    correctIndex: 1,
    rationale: "CSF must be processed immediately (STAT). Neisseria meningitidis and Haemophilus influenzae are extremely sensitive to cold and will die if refrigerated. S. pneumoniae also declines rapidly at room temperature. Process for cell count, protein, glucose, Gram stain, culture, and any requested molecular tests as soon as received.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-016",
    stem: "A gram stain of sputum shows >25 squamous epithelial cells per low power field and <10 WBCs per low power field. The specimen should be:",
    options: ["Cultured normally", "Rejected — excessive squamous epithelial cells indicate oropharyngeal contamination, not a true lower respiratory tract specimen", "Cultured for anaerobes", "Refrigerated and processed the next day"],
    correctIndex: 1,
    rationale: "Sputum quality assessment (Murray-Washington): >25 squamous epithelial cells/LPF indicates saliva/oropharyngeal contamination. Acceptable sputum: <10 SEC/LPF and >25 WBCs/LPF. Reject and request new specimen. Exception: Legionella and Mycobacteria cultures are never rejected based on quality screen.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-017",
    stem: "A patient has the following results: WBC 2,500/µL, ANC 800/µL, Hgb 9.5 g/dL, platelets 85,000/µL. The bone marrow shows hypocellularity with fatty replacement. This presentation is MOST consistent with:",
    options: ["AML", "Aplastic anemia — pancytopenia with hypocellular bone marrow", "Iron deficiency anemia", "CML"],
    correctIndex: 1,
    rationale: "Pancytopenia (low WBC, Hgb, and platelets) + hypocellular marrow with fatty replacement = aplastic anemia. Causes: idiopathic (most common), drugs (chloramphenicol, chemotherapy), radiation, viral (hepatitis, parvovirus B19), toxins (benzene). ANC <500 = severe aplastic anemia. Treatment: immunosuppression or stem cell transplant.",
    difficulty: 3,
    category: "Hematology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-018",
    stem: "Case: An ABG shows pH 7.35, pCO2 60 mmHg, HCO3 33 mEq/L. This represents:",
    options: ["Acute respiratory acidosis", "Chronic respiratory acidosis with appropriate metabolic compensation", "Metabolic alkalosis with respiratory compensation", "Normal blood gas"],
    correctIndex: 1,
    rationale: "pH near-normal (slightly acidotic side) + elevated pCO2 (respiratory acidosis) + elevated HCO3 (metabolic compensation) = chronic respiratory acidosis with appropriate compensation. The kidneys have had time to retain HCO3 (3.5 mEq/L increase per 10 mmHg pCO2 in chronic state). Seen in COPD, obesity hypoventilation.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b10-019",
    stem: "A microbiology culture from a wound specimen grows on MacConkey agar as lactose-fermenting pink colonies, is indole positive, and produces gas from glucose. The organism is:",
    options: ["Pseudomonas aeruginosa", "Escherichia coli", "Salmonella enterica", "Proteus vulgaris"],
    correctIndex: 1,
    rationale: "Lactose fermenter (pink on MacConkey) + indole positive + gas from glucose = E. coli. Most common gram-negative bacillus in clinical specimens. Causes UTI (most common), bacteremia, wound infections, neonatal meningitis. Non-lactose fermenters: Salmonella, Shigella, Proteus, Pseudomonas (colorless on MacConkey).",
    difficulty: 2,
    category: "Microbiology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-020",
    stem: "A laboratory performs method comparison between a new glucose analyzer and the reference method. The Bland-Altman plot shows a consistent positive bias of +8 mg/dL across all glucose concentrations. The interpretation is:",
    options: ["Random error requiring investigation", "Constant systematic bias — the new method consistently reads 8 mg/dL higher than the reference across the entire measurement range", "Proportional error", "No error — this is acceptable"],
    correctIndex: 1,
    rationale: "Constant bias: the difference between methods is the same across all concentrations (+8 mg/dL regardless of glucose level). This is a fixed offset, often correctable by calibration adjustment. Proportional bias would show increasing differences at higher concentrations (e.g., always 5% higher). Bland-Altman plots display mean difference ± limits of agreement.",
    difficulty: 3,
    category: "Laboratory Operations & Quality Management",
    topic: "Quality Assurance Programs"
  },
  {
    id: "mlt-b10-021",
    stem: "A patient with suspected DIC is started on heparin therapy. Which test is MOST appropriate for monitoring unfractionated heparin?",
    options: ["PT/INR", "aPTT or anti-Xa activity", "Fibrinogen level", "Bleeding time"],
    correctIndex: 1,
    rationale: "Unfractionated heparin (UFH) is monitored by aPTT (therapeutic range: 1.5-2.5x normal) or anti-Xa activity (therapeutic range: 0.3-0.7 IU/mL). Anti-Xa is preferred when aPTT is unreliable (lupus anticoagulant, elevated factor VIII, high-dose heparin). LMWH is monitored by anti-Xa only (aPTT is not reliably prolonged by LMWH).",
    difficulty: 2,
    category: "Hemostasis / Coagulation",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-022",
    stem: "Troubleshooting: A urine dipstick shows positive leukocyte esterase and nitrite, but the microscopic exam shows no WBCs or bacteria. The MOST likely explanation is:",
    options: ["Contamination of the dipstick", "Delay in processing — WBCs lysed in hypotonic or alkaline urine, releasing LE enzyme; bacteria may settle or lyse", "Laboratory error", "The dipstick is always more accurate than microscopy"],
    correctIndex: 1,
    rationale: "WBCs lyse in dilute (specific gravity <1.010), alkaline (pH >8), or old urine, releasing LE enzyme (positive dipstick). The membrane is gone but the enzyme persists. Also possible: formaldehyde contamination, Trichomonas WBC destruction. Always correlate dipstick with microscopy and consider specimen quality/timing.",
    difficulty: 3,
    category: "Urinalysis & Body Fluids",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-023",
    stem: "A microbiology technologist identifies a gram-negative diplococcus growing on chocolate agar but NOT on blood agar or MacConkey agar in a CO2-enriched environment. The specimen is a urethral swab. The organism is MOST likely:",
    options: ["Neisseria meningitidis", "Neisseria gonorrhoeae", "Moraxella catarrhalis", "Haemophilus influenzae"],
    correctIndex: 1,
    rationale: "N. gonorrhoeae: gram-negative diplococcus, oxidase positive, grows on chocolate agar and selective media (Thayer-Martin) but NOT on blood agar (inhibited by vancomycin in the medium). Requires CO2, does not grow on MacConkey. N. meningitidis grows on blood agar. Clinical context (urethral swab) confirms identity.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-024",
    stem: "A chemistry result shows: BUN 45 mg/dL, creatinine 5.2 mg/dL, BUN/creatinine ratio 8.7. GFR is estimated at 12 mL/min. This pattern indicates:",
    options: ["Pre-renal azotemia", "Intrinsic renal failure (CKD Stage 5) — both BUN and creatinine elevated with low BUN/creatinine ratio", "Post-renal obstruction", "Normal renal function"],
    correctIndex: 1,
    rationale: "BUN/creatinine ratio <10:1 with both markedly elevated + GFR <15 = intrinsic renal failure (CKD Stage 5/ESRD). Pre-renal azotemia would show ratio >20:1 (BUN rises disproportionately from increased reabsorption). Post-renal shows variable ratio depending on duration. GFR <15 = Stage 5, requires dialysis or transplant.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b10-025",
    stem: "Case: A patient on warfarin has an INR of 8.5 with minor gum bleeding. The recommended treatment is:",
    options: ["Continue warfarin at current dose", "Hold warfarin, administer oral vitamin K, and monitor INR closely", "Administer factor concentrate", "Perform emergency surgery"],
    correctIndex: 1,
    rationale: "INR >4.5-10 with minor bleeding: hold warfarin + oral vitamin K (2.5-5 mg). INR >10 without bleeding: hold + oral vitamin K (5 mg). Major/life-threatening bleeding: hold + IV vitamin K + 4-factor PCC (prothrombin complex concentrate) or FFP. Recheck INR in 6-12 hours. Identify cause of supratherapeutic INR.",
    difficulty: 3,
    category: "Hemostasis / Coagulation",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-026",
    stem: "A laboratory scientist is validating a new troponin assay. The 99th percentile URL (upper reference limit) is 16 ng/L. At this cutoff, the CV must be ≤ what value to meet imprecision guidelines?",
    options: ["20%", "10% (desirable ≤10% CV at the 99th percentile URL per IFCC/ESC guidelines)", "5%", "1%"],
    correctIndex: 1,
    rationale: "IFCC recommends CV ≤10% at the 99th percentile URL for high-sensitivity troponin assays. This ensures analytical imprecision does not cause excessive false positives or negatives near the diagnostic cutpoint. If CV >10%, the assay cannot reliably distinguish normal from mildly elevated values at the decision point.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Quality Assurance Programs"
  },
  {
    id: "mlt-b10-027",
    stem: "A stool culture on XLD (xylose lysine deoxycholate) agar shows black-centered colonies with a clear zone. The organism is MOST likely:",
    options: ["E. coli", "Salmonella species (H2S-producing, lysine-positive)", "Shigella", "Campylobacter"],
    correctIndex: 1,
    rationale: "XLD agar: Salmonella = red colonies with black centers (lysine decarboxylation → alkaline/red + H2S production → black). Shigella = red colonies without black centers (no H2S, no lysine decarboxylation but xylose-negative → alkaline/red). E. coli = yellow colonies (xylose fermentation). Essential differential medium for enteric pathogens.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-028",
    stem: "Troubleshooting: A blood gas analyzer gives a pO2 of 250 mmHg on a venous specimen. This is impossible because:",
    options: ["Venous pO2 normally ranges 35-45 mmHg; a value of 250 suggests the specimen contains air bubbles that equilibrated oxygen into the sample", "The instrument is always wrong", "Venous blood has no oxygen", "The pH must also be abnormal"],
    correctIndex: 0,
    rationale: "Venous pO2 normally 35-45 mmHg. A pO2 of 250 is consistent with room air equilibration (atmospheric pO2 ~150 mmHg, but oxygen diffusion into sample + humidity can produce higher readings). Air bubbles: increase pO2 (falsely elevated) and decrease pCO2 (falsely low). Specimens must be anaerobic and analyzed within 30 minutes.",
    difficulty: 2,
    category: "Point-of-Care Testing",
    topic: "Instrument Troubleshooting"
  },
  {
    id: "mlt-b10-029",
    stem: "A peripheral blood smear from a patient with chronic lymphocytic leukemia (CLL) shows numerous:",
    options: ["Auer rods in blasts", "Mature, small lymphocytes with scant cytoplasm and numerous smudge cells (basket cells)", "Hypersegmented neutrophils", "Pelger-Huët cells"],
    correctIndex: 1,
    rationale: "CLL morphology: mature-appearing small lymphocytes with clumped chromatin and scant cytoplasm dominating the differential. Smudge cells (basket cells) are characteristic — fragile CLL lymphocytes that rupture during slide preparation. Flow: CD5+, CD19+, CD20 dim, CD23+, surface Ig dim. Most common adult leukemia.",
    difficulty: 2,
    category: "Hematology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-030",
    stem: "Case: A liver panel shows AST 85 IU/L, ALT 35 IU/L, ALP 450 IU/L, GGT 380 IU/L, total bilirubin 4.5 mg/dL, direct bilirubin 3.8 mg/dL. This pattern is MOST consistent with:",
    options: ["Hepatocellular pattern (hepatitis)", "Cholestatic/obstructive pattern — markedly elevated ALP and GGT with predominant direct hyperbilirubinemia", "Isolated Gilbert syndrome", "Normal liver function"],
    correctIndex: 1,
    rationale: "Cholestatic pattern: ALP and GGT markedly elevated (>3x ULN) with relatively mild transaminase elevation. Direct (conjugated) bilirubin predominates (3.8/4.5 = 84% direct). Causes: bile duct obstruction (gallstones, tumor), primary biliary cholangitis, drug-induced cholestasis. GGT confirms ALP is hepatic origin (not bone).",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b10-031",
    stem: "A blood bank technologist performs an immediate spin crossmatch. This procedure detects:",
    options: ["IgG antibodies", "ABO incompatibility only (detects IgM anti-A and anti-B at room temperature)", "Antibodies to all blood group systems", "Platelet antibodies"],
    correctIndex: 1,
    rationale: "Immediate spin (IS) crossmatch: patient serum + donor RBCs centrifuged immediately at room temperature. Detects ABO incompatibility (IgM anti-A/anti-B). Only appropriate when the antibody screen is NEGATIVE and there is no history of clinically significant antibodies. Positive screen requires full AHG crossmatch.",
    difficulty: 2,
    category: "Immunohematology / Blood Banking",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-032",
    stem: "Case: A patient has a platelet count of 15,000/µL, normal PT, normal aPTT, and no schistocytes on smear. The bone marrow shows increased megakaryocytes. This is MOST consistent with:",
    options: ["DIC", "Immune thrombocytopenia (ITP) — isolated thrombocytopenia with adequate/increased megakaryocytes, no other cytopenias", "TTP", "Aplastic anemia"],
    correctIndex: 1,
    rationale: "ITP: isolated thrombocytopenia, normal coagulation (PT/aPTT), no schistocytes (excludes TTP/DIC), increased megakaryocytes (marrow produces platelets but peripheral destruction by anti-platelet autoantibodies exceeds production). Diagnosis of exclusion. Treatment: corticosteroids, IVIG, rituximab, TPO receptor agonists.",
    difficulty: 3,
    category: "Hematology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-033",
    stem: "A chemistry lab performs linearity verification. The results show that the measured values increasingly deviate from expected values above 500 mg/dL glucose. This means:",
    options: ["The method is linear across the entire range", "The upper limit of the analytical measurement range (AMR) is approximately 500 mg/dL — specimens exceeding this must be diluted", "The method has poor precision", "Random error at all levels"],
    correctIndex: 1,
    rationale: "Linearity verification establishes the analytical measurement range (AMR). Above 500 mg/dL, the method loses linearity (proportional response). Specimens exceeding AMR must be diluted with appropriate diluent (saline, water, depending on method) and the result multiplied by the dilution factor. CLIA requires linearity verification at least every 6 months.",
    difficulty: 2,
    category: "Laboratory Operations & Quality Management",
    topic: "Quality Assurance Programs"
  },
  {
    id: "mlt-b10-034",
    stem: "Case: A 28-year-old pregnant woman at 28 weeks is Rh-negative. Her antibody screen is negative. The appropriate blood bank action is:",
    options: ["No action needed until delivery", "Administer RhIG (Rh immune globulin, 300 µg) at 28 weeks to prevent Rh immunization, and again within 72 hours of delivery if the baby is Rh-positive", "Perform intrauterine transfusion", "Type and crossmatch 6 units of blood"],
    correctIndex: 1,
    rationale: "Rh-negative mothers: antenatal RhIG at 28 weeks (prevents immunization from small fetomaternal hemorrhage during pregnancy). Postpartum: RhIG within 72 hours if baby is Rh-positive. Rosette test/KB stain quantifies fetomaternal hemorrhage to determine if additional RhIG is needed (>30 mL fetal blood requires extra doses).",
    difficulty: 2,
    category: "Immunohematology / Blood Banking",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-035",
    stem: "A chemistry analyzer reports a potassium of 2.1 mEq/L (critical low). The technologist MUST:",
    options: ["Report the result and move to the next specimen", "Verify the result (repeat if needed), document, and immediately notify the responsible caregiver per the laboratory's critical value notification policy", "Only document in the LIS", "Wait for the physician to call"],
    correctIndex: 1,
    rationale: "Critical value notification: verify result (repeat, check specimen integrity), then immediately notify responsible caregiver (read-back confirmation), document: value, who was notified, time, and read-back confirmation. K+ 2.1 is life-threatening (cardiac arrhythmias). CLIA and accrediting bodies mandate critical value reporting policies.",
    difficulty: 2,
    category: "Laboratory Operations & Quality Management",
    topic: "Quality Assurance Programs"
  },
  {
    id: "mlt-b10-036",
    stem: "Case: A tuberculosis skin test (PPD) is read at 48 hours. The induration is 12 mm. In a healthcare worker, this is interpreted as:",
    options: ["Negative (requires ≥15 mm)", "Positive (≥10 mm is positive for healthcare workers and other high-risk groups)", "Indeterminate", "Requires repeat testing"],
    correctIndex: 1,
    rationale: "PPD interpretation depends on risk category. ≥5 mm: HIV+, immunocompromised, close TB contacts, CXR consistent with TB. ≥10 mm: healthcare workers, immigrants from high-prevalence areas, IV drug users, lab personnel handling M. tuberculosis. ≥15 mm: low-risk individuals. Healthcare worker + 12 mm = positive.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-037",
    stem: "Troubleshooting: The hemoglobin result from the hematology analyzer is 18 g/dL but the spun hematocrit is 36% (expected Hct ~54% for Hgb 18). The 'rule of three' is violated. The MOST likely cause is:",
    options: ["True polycythemia", "Lipemia or turbidity interference — falsely elevating the spectrophotometric hemoglobin measurement", "Dehydration", "Thalassemia"],
    correctIndex: 1,
    rationale: "Rule of three: Hgb × 3 ≈ Hct (±3). Here: 18 × 3 = 54, but Hct = 36. Lipemia/turbidity falsely elevates Hgb (cyanmethemoglobin measured spectrophotometrically at 540 nm). Hct is measured by impedance/scatter and is unaffected. Saline replacement: centrifuge, replace plasma with saline, re-run Hgb. Also check for cold agglutinins, Waldenström.",
    difficulty: 3,
    category: "Hematology",
    topic: "Instrument Troubleshooting"
  },
  {
    id: "mlt-b10-038",
    stem: "A positive cellulose acetate hemoglobin electrophoresis at alkaline pH shows a band that migrates at the position of Hgb S. To confirm Hgb S and differentiate from Hgb D and Hgb G (which co-migrate at alkaline pH), the confirmatory test is:",
    options: ["Repeat alkaline electrophoresis", "Acid (citrate agar) electrophoresis at pH 6.0 — Hgb S migrates differently from D and G at acid pH", "Osmotic fragility", "Heat stability test"],
    correctIndex: 1,
    rationale: "Alkaline electrophoresis (pH 8.6): S, D, and G co-migrate. Acid electrophoresis (pH 6.0-6.2): S separates from D and G (S migrates toward anode with C, while D/G migrate with A). Solubility test (Sickledex) also confirms S but doesn't quantify. HPLC and capillary electrophoresis provide definitive identification.",
    difficulty: 3,
    category: "Hematology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-039",
    stem: "Case: A urinalysis shows glucose 4+, ketones 3+, pH 5.0, specific gravity 1.035. Blood glucose is 450 mg/dL. This is MOST consistent with:",
    options: ["Normal diabetes management", "Diabetic ketoacidosis (DKA) — severe hyperglycemia with ketone production, acidotic urine", "Starvation ketosis", "Renal glucosuria"],
    correctIndex: 1,
    rationale: "Glucose 4+ (glycosuria from blood glucose exceeding renal threshold ~180 mg/dL) + ketones 3+ (beta-hydroxybutyrate from fat metabolism due to insulin deficiency) + acidic pH + high SG = DKA. Also expect: metabolic acidosis on ABG, elevated anion gap, elevated serum BHB. Emergency requiring insulin, fluids, electrolyte replacement.",
    difficulty: 2,
    category: "Urinalysis & Body Fluids",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-040",
    stem: "An antimicrobial susceptibility test (AST) using broth microdilution shows an MIC of 2 µg/mL for ciprofloxacin against E. coli. The CLSI breakpoint for susceptible is ≤0.25 µg/mL. The interpretation is:",
    options: ["Susceptible", "Resistant — the MIC (2 µg/mL) exceeds the susceptible breakpoint (≤0.25 µg/mL)", "Intermediate", "Cannot be determined"],
    correctIndex: 1,
    rationale: "MIC (minimum inhibitory concentration): lowest antibiotic concentration that inhibits visible growth. If MIC exceeds the susceptible breakpoint, the organism is resistant (or intermediate, depending on the specific breakpoints). CLSI publishes S/I/R breakpoints for each organism-antibiotic combination. Results guide antibiotic selection.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-041",
    stem: "Case: A cardiac biomarker panel shows CK 1,200 IU/L, CK-MB 85 IU/L (relative index 7.1%), troponin I 25 ng/mL. The CK-MB relative index >6% indicates:",
    options: ["Skeletal muscle injury", "Myocardial injury — CK-MB relative index >6% suggests cardiac source rather than skeletal muscle", "Rhabdomyolysis alone", "Normal result"],
    correctIndex: 1,
    rationale: "CK-MB relative index = (CK-MB/total CK) × 100. >6% suggests myocardial source. <6% with elevated CK = skeletal muscle injury (rhabdomyolysis). However, troponin is the preferred cardiac biomarker (more specific). CK-MB has been largely replaced by high-sensitivity troponin for MI diagnosis but remains useful for detecting reinfarction.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b10-042",
    stem: "A laboratory is implementing a new LDL cholesterol direct method. The acceptable performance criterion for total error (per NCEP/CLIA) is:",
    options: ["±5%", "±10%", "±12% or ±4 mg/dL (whichever is greater)", "±20%"],
    correctIndex: 2,
    rationale: "CLIA acceptable total error for LDL cholesterol: target ±12% or ±4 mg/dL. Total cholesterol: ±10%. HDL: target ±30%. Triglycerides: ±25%. LDL is critical for cardiovascular risk assessment and treatment decisions (NCEP ATP III guidelines). Calculated LDL (Friedewald) requires TG <400 mg/dL.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Quality Assurance Programs"
  },
  {
    id: "mlt-b10-043",
    stem: "Case: A bone marrow aspirate shows ringed sideroblasts on Prussian blue stain (iron granules encircling >1/3 of the nucleus). This finding is diagnostic of:",
    options: ["Iron deficiency anemia", "Sideroblastic anemia — ringed sideroblasts indicate impaired iron incorporation into heme within mitochondria", "Megaloblastic anemia", "Thalassemia"],
    correctIndex: 1,
    rationale: "Ringed sideroblasts: ≥5 iron granules encircling ≥1/3 of the nuclear circumference (perinuclear mitochondrial iron deposits). Impaired heme synthesis traps iron in mitochondria. Causes: MDS-RS (myelodysplastic syndrome with ring sideroblasts), lead poisoning, alcohol, drugs (isoniazid), hereditary (ALAS2 mutation). Responds to pyridoxine in some cases.",
    difficulty: 3,
    category: "Hematology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-044",
    stem: "An enzyme immunoassay (EIA) for HBsAg shows an absorbance reading just above the cutoff (signal/cutoff ratio 1.1). The MOST appropriate action is:",
    options: ["Report as positive", "Repeat the test in duplicate — weakly reactive initial results must be confirmed per the testing algorithm", "Report as negative", "Report as indeterminate without further testing"],
    correctIndex: 1,
    rationale: "Weakly reactive EIA results (S/CO near cutoff) require repeat testing in duplicate on the original specimen. If repeat reactive, perform confirmatory/neutralization test. False positives occur with specimens near cutoff. FDA mandates initial reactive results be repeated. Negative repeat = consider initial as false positive.",
    difficulty: 2,
    category: "Virology",
    topic: "Serological Viral Markers"
  },
  {
    id: "mlt-b10-045",
    stem: "A patient has the following coagulation results: PT normal, aPTT prolonged, thrombin time normal, fibrinogen normal. The lupus anticoagulant test (DRVVT) is positive. The aPTT mixing study does NOT correct. This indicates:",
    options: ["Factor VIII deficiency", "Lupus anticoagulant (antiphospholipid antibody) — an inhibitor that prolongs aPTT but is actually associated with THROMBOSIS, not bleeding", "Heparin contamination", "Factor XII deficiency"],
    correctIndex: 1,
    rationale: "Lupus anticoagulant: antiphospholipid antibody that interferes with phospholipid-dependent coagulation tests (prolongs aPTT in vitro). Mixing study does NOT correct (inhibitor pattern). DRVVT confirms LA. Paradoxically, LA is associated with thrombosis, not bleeding. Part of antiphospholipid syndrome (APS). Normal thrombin time excludes heparin.",
    difficulty: 3,
    category: "Hemostasis / Coagulation",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-046",
    stem: "Case: A manual platelet count using a hemocytometer with phase-contrast microscopy shows 150 platelets counted in the center 1 mm² area. The dilution is 1:100. The platelet count is:",
    options: ["15,000/µL", "150,000/µL", "1,500,000/µL", "15,000,000/µL"],
    correctIndex: 1,
    rationale: "Manual platelet count: Platelets counted in center 1 mm² square (0.1 mm depth = 0.1 µL volume). Count = 150 × dilution factor (100) × volume correction (10, since 0.1 µL → 1 µL) = 150 × 100 × 10 / 10 = 150,000/µL. Alternative formula: (platelets counted ÷ volume) × dilution = (150 ÷ 0.1) × 100 = 150,000.",
    difficulty: 3,
    category: "Hematology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-047",
    stem: "Troubleshooting: A chemistry analyzer reports frequent 'clot detected' errors on serum specimens. The MOST likely pre-analytical cause is:",
    options: ["Using the wrong tube color", "Insufficient clotting time before centrifugation — serum tubes need 30-60 minutes for complete clot formation before centrifuging", "Lipemic specimens", "Expired reagents"],
    correctIndex: 1,
    rationale: "Incomplete clotting: specimens centrifuged too quickly after collection have residual fibrin strands that clog analyzer probes. Standard serum tubes: 30-60 minutes. Serum separator tubes (SST) with clot activator: 30 minutes. Patients on anticoagulants may require longer clotting time. Thrombin tubes: 5 minutes.",
    difficulty: 2,
    category: "Phlebotomy & Specimen Collection",
    topic: "Instrument Troubleshooting"
  },
  {
    id: "mlt-b10-048",
    stem: "A tumor marker profile shows PSA 65 ng/mL (ref <4.0), free PSA 5% (ref 10-25%). This pattern suggests:",
    options: ["Benign prostatic hyperplasia (BPH)", "Prostate cancer — total PSA markedly elevated with low percent free PSA (<10%) suggests malignancy", "Normal prostate", "Prostatitis only"],
    correctIndex: 1,
    rationale: "Percent free PSA helps differentiate cancer from BPH. Low %fPSA (<10%): higher cancer probability (PSA bound to ACT). High %fPSA (>25%): BPH more likely (free PSA predominates). Total PSA >10 ng/mL with %fPSA <10% = high suspicion for prostate cancer. PSA is organ-specific, not cancer-specific.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b10-049",
    stem: "Case: A microbiology lab isolates an organism from stool that grows as colorless (non-lactose fermenting) colonies on MacConkey agar, is H2S positive on TSI (triple sugar iron agar, K/A with H2S), and is motile. The organism is MOST likely:",
    options: ["Shigella species", "Salmonella species", "E. coli", "Klebsiella pneumoniae"],
    correctIndex: 1,
    rationale: "Non-lactose fermenter (colorless on MacConkey) + H2S positive + motile = Salmonella. Shigella is also a non-lactose fermenter but is H2S negative and NON-motile. TSI K/A: alkaline slant (no lactose/sucrose fermentation) / acid butt (glucose fermented) with H2S and gas. Serotyping and molecular methods confirm species.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-050",
    stem: "A patient receiving massive transfusion develops ionized calcium of 0.8 mmol/L (ref 1.15-1.35). The cause is:",
    options: ["Hypercalcemia from transfused blood", "Citrate toxicity — citrate anticoagulant in blood products chelates ionized calcium, causing hypocalcemia", "Vitamin D excess", "Hyperparathyroidism"],
    correctIndex: 1,
    rationale: "Citrate in blood products chelates calcium. During massive transfusion (>1 blood volume in 24 hours), citrate overwhelms the liver's metabolic capacity, causing clinically significant hypocalcemia. Symptoms: perioral tingling, tetany, prolonged QT, cardiac dysfunction. Treatment: IV calcium gluconate or calcium chloride.",
    difficulty: 3,
    category: "Immunohematology / Blood Banking",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-051",
    stem: "A laboratory calculates the coefficient of variation (CV%) for glucose QC: mean = 100 mg/dL, SD = 3 mg/dL. The CV is:",
    options: ["0.3%", "3%", "30%", "300%"],
    correctIndex: 1,
    rationale: "CV% = (SD/Mean) × 100 = (3/100) × 100 = 3%. CV allows comparison of precision between different analytes and methods regardless of concentration. Acceptable CV for glucose: <3-4%. CV is useful for comparing precision at different concentration levels and between laboratories.",
    difficulty: 1,
    category: "Laboratory Operations & Quality Management",
    topic: "Quality Control"
  },
  {
    id: "mlt-b10-052",
    stem: "Case: A blood gas analysis on a patient with suspected carbon monoxide poisoning shows pO2 95 mmHg (normal) but pulse oximetry reads SpO2 99%. The carboxyhemoglobin (COHb) level is 25%. Why is the pO2 normal?",
    options: ["There is no CO poisoning", "pO2 measures dissolved oxygen, which is unaffected by CO; CO binds hemoglobin but does not affect dissolved O2 partial pressure. Pulse oximetry falsely reads normal because it cannot distinguish COHb from O2Hb", "The blood gas analyzer is malfunctioning", "The patient is on supplemental oxygen"],
    correctIndex: 1,
    rationale: "Critical concept: pO2 measures DISSOLVED oxygen (Henry's law) — unaffected by CO. CO displaces O2 from hemoglobin but dissolved O2 remains normal. Standard pulse oximetry reads COHb as O2Hb (falsely normal SpO2). CO-oximetry measures COHb, O2Hb, MetHb separately. COHb >25% is life-threatening. Treatment: 100% O2 or hyperbaric O2.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-053",
    stem: "A laboratory is implementing electronic crossmatching (computer crossmatch). The requirements include:",
    options: ["No prior antibody testing needed", "Two concordant ABO typings on file, current negative antibody screen, no history of clinically significant antibodies, and a validated computer system", "Only one ABO typing", "Only applicable to emergency transfusions"],
    correctIndex: 1,
    rationale: "Electronic (computer) crossmatch requirements: (1) validated ABO compatibility-checking computer system, (2) two concordant ABO typings on file (can include current), (3) current negative antibody screen, (4) no history of clinically significant antibodies. Eliminates serological crossmatch, reducing TAT and workload. FDA-approved alternative.",
    difficulty: 3,
    category: "Immunohematology / Blood Banking",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-054",
    stem: "A semen analysis for fertility evaluation shows: volume 2.5 mL, count 18 million/mL, motility 42%, morphology 3% normal (strict Kruger criteria). According to WHO 2021 criteria, this is:",
    options: ["Normal semen analysis", "Asthenoteratozoospermia — reduced motility and morphology with normal count and volume", "Azoospermia", "Severe oligozoospermia"],
    correctIndex: 1,
    rationale: "WHO 2021 lower reference limits: volume ≥1.4 mL (normal), count ≥16 M/mL (18 = normal), total motility ≥42% (42 = borderline), morphology ≥4% normal (3% = abnormal by strict criteria). Asthenozoospermia = reduced motility. Teratozoospermia = abnormal morphology. Combined = asthenoteratozoospermia.",
    difficulty: 3,
    category: "Urinalysis & Body Fluids",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-055",
    stem: "Case: An ANA (antinuclear antibody) test shows a homogeneous pattern at 1:320 titer. The MOST associated autoimmune condition is:",
    options: ["Rheumatoid arthritis", "Systemic lupus erythematosus (SLE) — homogeneous pattern correlates with anti-dsDNA and anti-histone antibodies", "Sjögren syndrome", "Hashimoto thyroiditis"],
    correctIndex: 1,
    rationale: "ANA patterns and associations: Homogeneous = SLE (anti-dsDNA, anti-histone). Speckled = mixed connective tissue disease, SLE, Sjögren (anti-Sm, anti-RNP, anti-SSA/SSB). Centromere = limited scleroderma (CREST). Nucleolar = diffuse scleroderma. Titer ≥1:160 is clinically significant. ANA is screening; specific antibodies confirm diagnosis.",
    difficulty: 2,
    category: "Immunology / Serology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-056",
    stem: "A quality indicator shows that the laboratory's hemolysis rejection rate is 12% (benchmark <2%). Root cause analysis should FIRST examine:",
    options: ["Instrument calibration", "Phlebotomy technique, needle gauge, tourniquet time, and transport conditions — pre-analytical factors cause most hemolysis", "Reagent lots", "Building temperature"],
    correctIndex: 1,
    rationale: "Hemolysis is the most common cause of pre-analytical specimen rejection. Root causes: small-gauge needles, difficult draws, excessive tourniquet time, vigorous mixing, pneumatic tube transport, temperature extremes, prolonged transport. Phlebotomy training and standardized collection procedures reduce hemolysis rates. Benchmark: <2% hemolysis rejection.",
    difficulty: 2,
    category: "Laboratory Operations & Quality Management",
    topic: "Quality Assurance Programs"
  },
  {
    id: "mlt-b10-057",
    stem: "A Clostridium difficile diagnostic algorithm uses which initial screening test followed by confirmatory testing?",
    options: ["Blood culture followed by Gram stain", "GDH (glutamate dehydrogenase) EIA screening followed by toxin EIA or NAAT (PCR) confirmation", "Stool culture only", "O&P examination"],
    correctIndex: 1,
    rationale: "C. difficile two-step algorithm: (1) GDH EIA screen (high sensitivity, detects toxigenic and non-toxigenic strains); if positive → (2) toxin A/B EIA (confirms toxin production) or NAAT/PCR (detects toxin genes). GDH+/Toxin+ = positive. GDH+/Toxin- may need NAAT for resolution. GDH- = negative, no further testing.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-058",
    stem: "Troubleshooting: A coagulation analyzer reports 'optical interference' on a plasma specimen. The specimen appears milky white. The interference is caused by:",
    options: ["Hemolysis", "Lipemia — turbid/lipemic plasma interferes with optical clot detection methods by scattering light", "Icterus", "Normal plasma"],
    correctIndex: 1,
    rationale: "Lipemia causes turbidity that interferes with optical clot detection (photometric methods measure light transmission change when clot forms). Solution: ultracentrifuge to clear lipemic layer, or use mechanical clot detection (viscosity-based, unaffected by turbidity). Hemolysis and icterus also cause spectral interference at specific wavelengths.",
    difficulty: 2,
    category: "Hemostasis / Coagulation",
    topic: "Instrument Troubleshooting"
  },
  {
    id: "mlt-b10-059",
    stem: "Case: A NRBC (nucleated red blood cell) count of 25/100 WBC is reported by the hematology analyzer. The corrected WBC count, if the uncorrected count is 15,000/µL, is:",
    options: ["15,000/µL", "12,000/µL", "18,000/µL", "10,000/µL"],
    correctIndex: 1,
    rationale: "NRBCs are counted as WBCs by automated analyzers (similar size, nucleated). Corrected WBC = uncorrected WBC × 100/(100 + NRBC count per 100 WBCs) = 15,000 × 100/125 = 12,000/µL. Some modern analyzers auto-correct for NRBCs. NRBCs in peripheral blood indicate severe stress, hemolytic anemia, or myelophthisic processes.",
    difficulty: 3,
    category: "Hematology",
    topic: "Instrument Troubleshooting"
  },
  {
    id: "mlt-b10-060",
    stem: "Case: A laboratory comparison study between two glucose methods yields r = 0.99, slope = 1.02, y-intercept = 3 mg/dL. The interpretation is:",
    options: ["Poor correlation requiring method rejection", "Excellent correlation (r=0.99) with minimal proportional bias (slope 1.02, ~2% proportional error) and small constant bias (3 mg/dL)", "No bias present", "Random error dominates"],
    correctIndex: 1,
    rationale: "Regression analysis interpretation: r = 0.99 (excellent correlation). Slope 1.02 = 2% proportional bias (new method reads 2% higher at all concentrations). Y-intercept 3 mg/dL = constant bias (3 mg/dL offset at all levels). Combined: at glucose 100 mg/dL, expected difference = (100 × 0.02) + 3 = 5 mg/dL. Clinically acceptable for most glucose methods.",
    difficulty: 3,
    category: "Laboratory Operations & Quality Management",
    topic: "Quality Assurance Programs"
  },
  {
    id: "mlt-b10-061",
    stem: "A culture from a diabetic foot ulcer grows on blood agar showing double zone of beta-hemolysis (narrow zone of complete hemolysis closest to the colony and wider zone of partial hemolysis beyond). The organism is MOST likely:",
    options: ["Staphylococcus aureus", "Clostridium perfringens", "Streptococcus pyogenes", "E. coli"],
    correctIndex: 1,
    rationale: "C. perfringens: double zone hemolysis on blood agar (theta toxin = narrow inner zone, alpha toxin/lecithinase = wider outer zone). Gram-positive large boxcar-shaped rods, non-motile, spore-forming (but spores rarely seen). Causes gas gangrene (myonecrosis) and food poisoning. Reverse CAMP test positive.",
    difficulty: 3,
    category: "Microbiology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-062",
    stem: "Case: A laboratory discovers that lot-to-lot reagent change has caused a shift in creatinine results (+0.15 mg/dL). The corrective action includes:",
    options: ["Ignore the shift since it's within reagent specifications", "Recalibrate the analyzer with the new lot, verify with QC, run parallel testing with old and new lots if available, and document the change", "Return the new lot immediately", "Adjust all previous patient results"],
    correctIndex: 1,
    rationale: "Lot-to-lot reagent changes can introduce shifts/bias. Corrective actions: recalibrate with new lot, verify QC is within acceptable ranges, run parallel patient samples (if possible) to assess clinical impact, document the changeover, and notify clinicians if the shift is clinically significant. CLSI and CAP require lot-to-lot verification procedures.",
    difficulty: 2,
    category: "Laboratory Operations & Quality Management",
    topic: "Quality Control"
  },
  {
    id: "mlt-b10-063",
    stem: "A flow cytometry result on a pleural fluid shows a population of large cells that are CD45 negative, CK positive, and EpCAM positive. This population represents:",
    options: ["T lymphocytes", "Metastatic carcinoma cells (epithelial origin, non-hematopoietic)", "Reactive mesothelial cells", "Monocytes"],
    correctIndex: 1,
    rationale: "CD45 negative (not leukocyte) + CK positive (cytokeratin, epithelial marker) + EpCAM positive (epithelial cell adhesion molecule) = metastatic carcinoma cells. Flow cytometry can identify malignant cells in body fluids. CD45+ would indicate hematopoietic origin (lymphoma, leukemia). Calretinin+ would suggest mesothelial origin.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-064",
    stem: "Case: A neonatal blood gas shows pH 7.25, pCO2 55 mmHg, pO2 40 mmHg, HCO3 22 mEq/L, lactate 5 mmol/L. The MOST likely diagnosis is:",
    options: ["Metabolic alkalosis", "Mixed respiratory acidosis (elevated pCO2) with metabolic acidosis (elevated lactate) in a neonate with respiratory distress", "Compensated metabolic acidosis", "Normal neonatal values"],
    correctIndex: 1,
    rationale: "Neonatal ABG: pH 7.25 (acidotic), elevated pCO2 (respiratory acidosis from immature lungs/RDS), normal-low HCO3 (no compensation yet), elevated lactate (tissue hypoxia from poor oxygenation). pO2 40 = hypoxemic. This represents respiratory failure with secondary tissue hypoxia. Treatment: surfactant, ventilatory support, oxygen.",
    difficulty: 3,
    category: "Point-of-Care Testing",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-065",
    stem: "A molecular lab performs multiplex PCR for respiratory pathogens. The internal control amplifies but the targets are negative. This means:",
    options: ["The test is invalid", "The test is valid and negative — the internal control confirms that extraction, amplification, and detection steps worked properly; no target organisms detected", "The test is positive", "Only the internal control organism is present"],
    correctIndex: 1,
    rationale: "Internal control (IC) amplification confirms the entire molecular process worked: nucleic acid extraction, reverse transcription (if applicable), amplification, and detection. IC positive + targets negative = true negative. If IC also fails = invalid (PCR inhibition or extraction failure — repeat with dilution or re-extraction). IC ensures no false negatives from technical failure.",
    difficulty: 2,
    category: "Molecular Diagnostics",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-066",
    stem: "Case: A blood bank technologist performs an elution on a patient's DAT-positive RBCs. The eluate reacts with all panel cells. The autocontrol is positive. This pattern indicates:",
    options: ["Alloantibody with known specificity", "Warm autoantibody — reacts with all cells including autologous cells, covering a common Rh antigen", "Cold autoantibody", "No antibody identified"],
    correctIndex: 1,
    rationale: "Warm autoantibody: eluate reacts with ALL panel cells (panreactive) because the autoantibody targets a common/public antigen (usually Rh-related). Positive autocontrol confirms auto-reactivity. Challenge: autoantibodies can mask underlying alloantibodies. Adsorption studies (autoadsorption or alloadsorption) required to detect clinically significant alloantibodies.",
    difficulty: 3,
    category: "Immunohematology / Blood Banking",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-067",
    stem: "A microbiology lab identifies a gram-positive coccus that is catalase negative, gamma-hemolytic (non-hemolytic), grows in 6.5% NaCl, and hydrolyzes bile esculin. The organism is:",
    options: ["Staphylococcus aureus", "Enterococcus species", "Streptococcus pyogenes", "Streptococcus pneumoniae"],
    correctIndex: 1,
    rationale: "GPC catalase negative = Streptococcus/Enterococcus. Growth in 6.5% NaCl + bile esculin hydrolysis + gamma/alpha hemolysis = Enterococcus. PYR positive confirms. Key species: E. faecalis (most common) and E. faecium (often VRE). VRE: resistant to vancomycin (vanA, vanB genes). Important nosocomial pathogen.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b10-068",
    stem: "A laboratory safety audit finds that biohazardous waste is being placed in regular trash. The MOST serious regulatory consequence is:",
    options: ["A minor citation", "OSHA violations with potential fines, laboratory shutdown, and risk of bloodborne pathogen exposure to waste handlers", "No consequence", "A verbal warning"],
    correctIndex: 1,
    rationale: "OSHA Bloodborne Pathogen Standard (29 CFR 1910.1030): biohazardous waste must be placed in labeled, leak-proof containers. Improper disposal = OSHA violation (fines up to $15,625 per violation for serious, $156,259 for willful). Also violates state and local regulations, EPA guidelines, and accreditation standards. Risk of needlestick/exposure to waste handlers.",
    difficulty: 2,
    category: "Laboratory Operations & Quality Management",
    topic: "Laboratory Safety"
  },
  {
    id: "mlt-b10-069",
    stem: "Troubleshooting: A chemistry analyzer shows drift in sodium results over several hours (results trending 2-3 mEq/L lower). The MOST likely cause is:",
    options: ["Reagent degradation", "ISE electrode aging or protein coating — the ion-selective electrode reference or measuring electrode needs conditioning or replacement", "Incorrect specimen type", "Operator error"],
    correctIndex: 1,
    rationale: "ISE drift: gradual change in electrode response over time. Causes: protein/lipid coating on electrode membrane, KCl reference solution depletion, aging electrode membrane, temperature drift. Corrective actions: condition electrodes, replace KCl reference, clean measuring chamber, replace electrodes if beyond useful life. Calibration frequency may need increasing.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Instrument Troubleshooting"
  },
  {
    id: "mlt-b10-070",
    stem: "Case: A newborn screen for congenital hypothyroidism shows elevated TSH. The confirmatory test and treatment are:",
    options: ["Repeat screen only", "Serum TSH and free T4 confirmation; if confirmed, immediate levothyroxine treatment to prevent intellectual disability", "No follow-up until age 1", "Iodine supplementation only"],
    correctIndex: 1,
    rationale: "Newborn screen TSH elevated → confirmatory serum TSH and free T4 within 2 weeks. Congenital hypothyroidism (1:3,000-4,000 births): most common preventable cause of intellectual disability. Immediate levothyroxine replacement normalizes development. Treatment must begin before 2 weeks of age for optimal outcomes. Most cases: thyroid dysgenesis.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Case-Based Lab Scenarios"
  }
];
