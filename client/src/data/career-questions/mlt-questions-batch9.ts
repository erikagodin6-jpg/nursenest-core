import type { CareerQuestion } from "./rrt-questions";

export const mltQuestionsBatch9: CareerQuestion[] = [
  {
    id: "mlt-b9-001",
    stem: "Tissue embedding in histology requires orienting the specimen so that:",
    options: ["The largest surface faces up", "The cut surface of interest faces down toward the bottom of the mold for optimal sectioning", "Orientation does not matter", "The specimen floats in paraffin"],
    correctIndex: 1,
    rationale: "Proper embedding orientation ensures the diagnostically important surface is sectioned first. The cut surface faces down (toward the block face). Incorrect orientation may require re-embedding and re-cutting, delaying diagnosis. Embedding protocols should be standardized for each specimen type.",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Embedding & Microtomy"
  },
  {
    id: "mlt-b9-002",
    stem: "Antigen retrieval in immunohistochemistry is performed because:",
    options: ["It removes all antibodies from tissue", "Formalin fixation crosslinks proteins and masks epitopes; heat-induced (HIER) or enzyme-induced retrieval restores antigenicity", "It improves H&E staining", "It decalcifies bone tissue"],
    correctIndex: 1,
    rationale: "Formalin crosslinks proteins via methylene bridges, masking antigenic epitopes. HIER (Heat-Induced Epitope Retrieval) uses citrate buffer (pH 6.0) or EDTA (pH 9.0) in a pressure cooker/microwave to break crosslinks. EIER uses proteolytic enzymes (proteinase K, trypsin). Proper retrieval is critical for IHC success.",
    difficulty: 3,
    category: "Histotechnology",
    topic: "Immunohistochemistry"
  },
  {
    id: "mlt-b9-003",
    stem: "Reticulin stain (Gordon and Sweets or Gomori) demonstrates:",
    options: ["Collagen type I fibers", "Reticulin fibers (type III collagen) in liver and bone marrow architecture", "Elastic fibers", "Smooth muscle"],
    correctIndex: 1,
    rationale: "Reticulin stain: silver impregnation technique that demonstrates type III collagen fibers as black lines. Essential for evaluating hepatic fibrosis architecture and grading myelofibrosis in bone marrow biopsies. Normal liver shows reticulin framework around sinusoids and central veins.",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Special Stains"
  },
  {
    id: "mlt-b9-004",
    stem: "The IHC markers CD20 and CD3 are used to identify:",
    options: ["Epithelial cells", "B lymphocytes (CD20) and T lymphocytes (CD3) respectively", "Endothelial cells", "Melanocytes"],
    correctIndex: 1,
    rationale: "CD20: pan-B cell marker (therapeutic target for rituximab). CD3: pan-T cell marker (all mature T cells). Used in lymphoma classification, evaluating lymph node architecture, and determining lymphoid vs. non-lymphoid infiltrates. Essential IHC panel members for hematopathology.",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Immunohistochemistry"
  },
  {
    id: "mlt-b9-005",
    stem: "Verhoeff-van Gieson (VVG) stain demonstrates:",
    options: ["Glycogen deposits", "Elastic fibers (black) with collagen (red) and smooth muscle (yellow)", "Iron deposits", "Calcium"],
    correctIndex: 1,
    rationale: "VVG stain: elastic fibers stain black (Verhoeff iron hematoxylin), collagen stains red (van Gieson counterstain), smooth muscle and cytoplasm stain yellow. Used to evaluate vascular wall structure, pulmonary disease, and skin biopsies for elastic tissue changes.",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Special Stains"
  },
  {
    id: "mlt-b9-006",
    stem: "Mucicarmine stain is specific for:",
    options: ["Collagen", "Mucin (epithelial mucin stains deep rose/magenta), used to identify mucin-producing adenocarcinomas and Cryptococcus capsule", "Iron", "Elastic fibers"],
    correctIndex: 1,
    rationale: "Mucicarmine stains acidic mucopolysaccharides (epithelial mucins) deep rose/magenta. Clinical uses: differentiating mucinous adenocarcinomas, identifying Cryptococcus neoformans capsule (magenta capsule around yeast). Combined with other stains helps classify tumors of uncertain origin.",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Special Stains"
  },
  {
    id: "mlt-b9-007",
    stem: "Oil Red O stain is performed on:",
    options: ["Paraffin-embedded tissue", "Fresh frozen sections (lipids are dissolved during paraffin processing)", "Decalcified bone", "Fixed formalin tissue only"],
    correctIndex: 1,
    rationale: "Oil Red O (lipid stain) must be performed on frozen sections because standard tissue processing (dehydration with alcohols, clearing with xylene) dissolves lipids. Stains neutral triglycerides and lipids red-orange. Used for fatty liver disease diagnosis, lipid-laden macrophages, and fat embolism.",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Frozen Sections"
  },
  {
    id: "mlt-b9-008",
    stem: "Von Kossa stain detects:",
    options: ["Iron deposits", "Calcium deposits (calcium phosphate/carbonate) in tissue — appears brown/black", "Amyloid", "Glycogen"],
    correctIndex: 1,
    rationale: "Von Kossa: silver nitrate reacts with phosphate/carbonate (associated with calcium deposits) to form brown/black precipitate. Demonstrates calcification in tissue. Note: it actually detects phosphate/carbonate anions, not calcium directly. Alizarin Red S directly stains calcium.",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Special Stains"
  },
  {
    id: "mlt-b9-009",
    stem: "HER2/neu IHC scoring for breast cancer uses a scale of:",
    options: ["Positive or negative only", "0, 1+, 2+, 3+ based on membrane staining intensity and completeness", "1-10 scale", "Percentage of cells staining"],
    correctIndex: 1,
    rationale: "HER2 IHC scoring: 0 (negative, no staining), 1+ (negative, faint incomplete membrane), 2+ (equivocal, weak-moderate complete membrane, requires FISH confirmation), 3+ (positive, strong complete membrane >10% of cells). 3+ patients are eligible for trastuzumab (Herceptin) therapy.",
    difficulty: 3,
    category: "Histotechnology",
    topic: "Immunohistochemistry"
  },
  {
    id: "mlt-b9-010",
    stem: "Ki-67 IHC staining measures:",
    options: ["Apoptosis rate", "Cell proliferation index (percentage of cells in active phases of cell cycle)", "Hormone receptor status", "HER2 amplification"],
    correctIndex: 1,
    rationale: "Ki-67 (MIB-1): nuclear protein present in all active cell cycle phases (G1, S, G2, M) but absent in quiescent (G0) cells. The Ki-67 proliferation index = percentage of positive tumor cells. High Ki-67 indicates aggressive tumor behavior. Used for grading in breast cancer, neuroendocrine tumors, and lymphomas.",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Immunohistochemistry"
  },
  {
    id: "mlt-b9-011",
    stem: "HSIL (high-grade squamous intraepithelial lesion) on Pap smear shows cells with:",
    options: ["Normal nuclear-to-cytoplasmic ratio", "High nuclear-to-cytoplasmic ratio, hyperchromatic nuclei, irregular nuclear membranes, and scant cytoplasm", "Only koilocytic changes", "Abundant mature cytoplasm"],
    correctIndex: 1,
    rationale: "HSIL cells: high N/C ratio (>50% of cell area is nucleus), hyperchromatic nuclei with irregular nuclear contours, coarse chromatin, and scant immature cytoplasm. HSIL encompasses CIN 2 and CIN 3 (carcinoma in situ). Requires colposcopy and biopsy for definitive diagnosis and treatment.",
    difficulty: 2,
    category: "Cytotechnology",
    topic: "Pap Smear Evaluation"
  },
  {
    id: "mlt-b9-012",
    stem: "ASC-US on a Pap smear stands for:",
    options: ["Abnormal squamous cells, undifferentiated significance", "Atypical squamous cells of undetermined significance", "Acute squamous cell ulceration, superficial", "Advanced squamous carcinoma, unspecified site"],
    correctIndex: 1,
    rationale: "ASC-US: atypical squamous cells of undetermined significance. Most common abnormal Pap result. Cellular changes suggestive but not diagnostic of SIL. Management: reflex HPV testing — if high-risk HPV positive → colposcopy; if HPV negative → repeat cotesting in 3 years.",
    difficulty: 1,
    category: "Cytotechnology",
    topic: "Bethesda System Classification"
  },
  {
    id: "mlt-b9-013",
    stem: "A urine cytology showing cells with high N/C ratio, hyperchromatic nuclei, and irregular nuclear contours is MOST concerning for:",
    options: ["Benign urothelial cells", "Urothelial carcinoma (high-grade)", "Squamous metaplasia", "Viral cytopathic effect"],
    correctIndex: 1,
    rationale: "Urine cytology is most sensitive for high-grade urothelial carcinoma. Malignant urothelial cells show: high N/C ratio, nuclear hyperchromasia, irregular nuclear membranes, prominent nucleoli, and coarse chromatin. Low-grade tumors may be missed. Paired with cystoscopy for complete evaluation.",
    difficulty: 3,
    category: "Cytotechnology",
    topic: "Non-Gynecological Cytology"
  },
  {
    id: "mlt-b9-014",
    stem: "Rapid on-site evaluation (ROSE) during FNA procedures serves to:",
    options: ["Replace the final cytology report", "Assess specimen adequacy in real-time, ensuring sufficient diagnostic material is obtained before the patient leaves", "Culture the specimen for bacteria", "Perform flow cytometry immediately"],
    correctIndex: 1,
    rationale: "ROSE: cytopathologist or cytotechnologist examines Diff-Quik stained touch preps during the FNA procedure. Provides immediate assessment of specimen adequacy, preliminary diagnosis, and guidance for additional passes or ancillary testing (flow cytometry, molecular, cultures). Reduces non-diagnostic rates.",
    difficulty: 2,
    category: "Cytotechnology",
    topic: "Fine Needle Aspiration"
  },
  {
    id: "mlt-b9-015",
    stem: "Serous effusion cytology showing clusters of cells with 3D architecture, prominent nucleoli, and mucin vacuoles is MOST consistent with:",
    options: ["Reactive mesothelial cells", "Metastatic adenocarcinoma", "Lymphoma", "Tuberculosis"],
    correctIndex: 1,
    rationale: "Adenocarcinoma cells in serous effusions: 3D clusters (cell balls, papillary groups), eccentric nuclei, prominent nucleoli, mucin vacuoles. Differentiated from reactive mesothelial cells by IHC: carcinoma = BerEP4+, MOC-31+, calretinin-; mesothelial = calretinin+, CK5/6+, BerEP4-.",
    difficulty: 3,
    category: "Cytotechnology",
    topic: "Non-Gynecological Cytology"
  },
  {
    id: "mlt-b9-016",
    stem: "Trichophyton rubrum is the MOST common dermatophyte causing:",
    options: ["Tinea capitis in children", "Tinea pedis (athlete's foot) and tinea unguium (onychomycosis) in adults", "Systemic fungal infection", "Pneumonia"],
    correctIndex: 1,
    rationale: "T. rubrum: most common dermatophyte worldwide. Causes chronic tinea pedis, tinea unguium, tinea corporis, and tinea cruris. Colony: white cottony surface with distinctive wine-red reverse pigment. Microconidia: teardrop-shaped along hyphae. Urease negative (unlike T. mentagrophytes).",
    difficulty: 2,
    category: "Mycology",
    topic: "Dermatophytes"
  },
  {
    id: "mlt-b9-017",
    stem: "Epidermophyton floccosum is unique among dermatophytes because it:",
    options: ["Produces macroconidia only (no microconidia)", "Infects hair follicles", "Is dimorphic", "Produces large capsules"],
    correctIndex: 0,
    rationale: "Epidermophyton floccosum: produces characteristic smooth, club-shaped macroconidia in clusters but NO microconidia. Only genus that does not infect hair (affects skin and nails only). Causes tinea cruris (jock itch) and tinea pedis. Colony: khaki-green to yellow, flat.",
    difficulty: 2,
    category: "Mycology",
    topic: "Dermatophytes"
  },
  {
    id: "mlt-b9-018",
    stem: "Pneumocystis jirovecii (formerly P. carinii) is detected in respiratory specimens by:",
    options: ["Routine bacterial culture", "GMS stain (shows crushed ping-pong ball or cup-shaped cysts) or DFA, or PCR", "Acid-fast stain", "Gram stain"],
    correctIndex: 1,
    rationale: "Pneumocystis jirovecii cannot be cultured in vitro. GMS stain: cysts appear as crushed ping-pong balls (cup-shaped, 5-8 µm) with dark black walls. Also: DFA with monoclonal antibodies, Giemsa (shows trophozoites), calcofluor white. PCR is increasingly used. Causes PCP pneumonia in HIV/AIDS patients.",
    difficulty: 2,
    category: "Mycology",
    topic: "Mold Identification"
  },
  {
    id: "mlt-b9-019",
    stem: "Mucor/Rhizopus species in tissue show:",
    options: ["Narrow septate hyphae with 45° branching", "Wide (6-25 µm), ribbon-like, pauci-septate (few or no septa) hyphae with irregular 90° branching", "Encapsulated yeast", "Small intracellular organisms"],
    correctIndex: 1,
    rationale: "Mucorales (Mucor, Rhizopus): wide, ribbon-like, non-septate or pauci-septate hyphae with 90° branching (often irregular). Angioinvasive, causing vascular thrombosis and tissue infarction. Rhinocerebral mucormycosis in diabetic ketoacidosis. Treatment: amphotericin B + surgical debridement. Voriconazole is NOT effective.",
    difficulty: 2,
    category: "Mycology",
    topic: "Mold Identification"
  },
  {
    id: "mlt-b9-020",
    stem: "Candida species are differentiated by:",
    options: ["Gram stain only", "Germ tube test (C. albicans positive), CHROMagar (color-based identification), biochemical assimilation, and MALDI-TOF", "Colony color on blood agar", "Acid-fast staining"],
    correctIndex: 1,
    rationale: "Candida identification: germ tube test (C. albicans/C. dubliniensis positive). CHROMagar Candida: C. albicans = green, C. tropicalis = blue, C. krusei = pink fuzzy. Biochemical: API 20C, VITEK 2 YST. MALDI-TOF MS provides rapid, definitive identification. Species identification guides antifungal selection.",
    difficulty: 2,
    category: "Mycology",
    topic: "Yeasts"
  },
  {
    id: "mlt-b9-021",
    stem: "Sabouraud dextrose agar (SDA) is the primary culture medium for fungi because:",
    options: ["It supports bacterial growth only", "Its acidic pH (5.6) and high glucose concentration favor fungal growth while inhibiting most bacteria", "It contains blood", "It is selective for viruses"],
    correctIndex: 1,
    rationale: "SDA: acidic pH 5.6, 4% dextrose supports fungal growth. Antibiotics (chloramphenicol, gentamicin) are often added to suppress bacteria. Cycloheximide may be added to inhibit saprophytic molds (but also inhibits Cryptococcus, Aspergillus). Incubate at 25-30°C for molds, 37°C for dimorphic fungi.",
    difficulty: 1,
    category: "Mycology",
    topic: "Mold Identification"
  },
  {
    id: "mlt-b9-022",
    stem: "Calcofluor white stain enhances visualization of fungi because it:",
    options: ["Stains nuclei of fungal cells", "Binds to chitin and cellulose in fungal cell walls, fluorescing bright apple-green/blue-white under UV light", "Dissolves tissue around fungi", "Cultures fungi in vitro"],
    correctIndex: 1,
    rationale: "Calcofluor white: fluorescent whitener that binds chitin (fungal cell walls) and cellulose. Under UV/fluorescent microscopy, fungi fluoresce bright apple-green or blue-white against a dark background. More sensitive than KOH alone for detecting fungal elements. Also used with KOH for synergy.",
    difficulty: 2,
    category: "Mycology",
    topic: "KOH Preparation"
  },
  {
    id: "mlt-b9-023",
    stem: "Paracoccidioides brasiliensis in tissue shows yeast cells with:",
    options: ["Single narrow-based budding", "Multiple buds around a central cell (pilot wheel/mariner's wheel/Mickey Mouse appearance)", "Broad-based single budding", "Endospores within spherules"],
    correctIndex: 1,
    rationale: "Paracoccidioides: large yeast (10-60 µm) with multiple peripheral buds giving a characteristic pilot/mariner's wheel appearance. Endemic to Latin America. Causes chronic progressive pulmonary and disseminated disease. Dimorphic: mold at 25°C, yeast at 37°C.",
    difficulty: 3,
    category: "Mycology",
    topic: "Dimorphic Fungi"
  },
  {
    id: "mlt-b9-024",
    stem: "Sporothrix schenckii is acquired through:",
    options: ["Inhalation of spores", "Traumatic inoculation from thorns, splinters, or sphagnum moss (rose gardener's disease)", "Ingestion of contaminated food", "Person-to-person transmission"],
    correctIndex: 1,
    rationale: "Sporotrichosis: acquired by traumatic inoculation (rose thorns, splinters, sphagnum moss handling). Causes lymphocutaneous disease: nodular lesion at inoculation site with satellite nodules along lymphatics. Dimorphic fungus. Treatment: itraconazole. Also known as 'rose gardener's disease.'",
    difficulty: 2,
    category: "Mycology",
    topic: "Dimorphic Fungi"
  },
  {
    id: "mlt-b9-025",
    stem: "Lactophenol cotton blue (LPCB) preparation is used in mycology to:",
    options: ["Culture fungi", "Mount and stain fungal structures (hyphae, conidia) for microscopic identification — chitin stains blue", "Perform antifungal susceptibility", "Detect fungal antigens"],
    correctIndex: 1,
    rationale: "LPCB: mounting medium for fungal microscopy. Lactophenol kills organisms and preserves structures. Cotton blue (aniline blue) stains chitin in fungal cell walls. Used to examine mold colony morphology: hyphal structures, conidiophores, and conidia shape/arrangement for species identification.",
    difficulty: 1,
    category: "Mycology",
    topic: "Mold Identification"
  },
  {
    id: "mlt-b9-026",
    stem: "A POC INR device is used for:",
    options: ["Monitoring heparin therapy", "Patient self-monitoring of warfarin therapy at home or in anticoagulation clinics", "Blood typing", "Glucose monitoring"],
    correctIndex: 1,
    rationale: "POC INR devices (e.g., CoaguChek): allow patients on warfarin to self-test at home using fingerstick blood. Measures PT and calculates INR. Improves time in therapeutic range, reduces clinic visits. Requires periodic correlation with laboratory venous INR. Also used in anticoagulation clinics.",
    difficulty: 1,
    category: "Point-of-Care Testing",
    topic: "Coagulation Point-of-Care"
  },
  {
    id: "mlt-b9-027",
    stem: "POC cardiac troponin testing is used in emergency departments to:",
    options: ["Screen for cancer", "Rapidly diagnose or rule out acute myocardial infarction at the bedside", "Measure blood glucose", "Test for HIV"],
    correctIndex: 1,
    rationale: "POC high-sensitivity troponin (hs-cTnI/hs-cTnT): provides rapid results (8-20 minutes) for acute MI diagnosis in the ED. Serial testing at 0 and 1-3 hours allows rapid rule-in/rule-out protocols. Must correlate with clinical presentation and ECG findings. Reduces time to diagnosis and treatment.",
    difficulty: 2,
    category: "Point-of-Care Testing",
    topic: "Blood Gas Analyzers"
  },
  {
    id: "mlt-b9-028",
    stem: "The Accreditation Canada (formerly CCHSA) standards for POCT require:",
    options: ["No oversight needed for waived tests", "Centralized oversight including competency assessment, quality control, proficiency testing, and documentation for all POCT devices", "Only annual calibration", "Testing by physicians only"],
    correctIndex: 1,
    rationale: "Canadian POCT standards (Accreditation Canada, CSA Z22870): centralized POCT coordination, operator training and competency, daily/per-shift QC, EQA/proficiency testing, result documentation in medical record, analytical correlation with central lab, and incident reporting. Similar to CAP/CLIA in the US.",
    difficulty: 2,
    category: "Point-of-Care Testing",
    topic: "Quality Management for POCT"
  },
  {
    id: "mlt-b9-029",
    stem: "POC D-dimer testing is used to:",
    options: ["Confirm deep vein thrombosis", "Rule out DVT/PE in low-to-moderate probability patients when negative (high negative predictive value)", "Diagnose DIC", "Monitor heparin therapy"],
    correctIndex: 1,
    rationale: "POC D-dimer: high sensitivity, moderate specificity. Negative result in low/moderate clinical probability patients effectively rules out DVT/PE (no imaging needed). Positive result is nonspecific (elevated in many conditions) and requires confirmatory imaging. Used with clinical probability scoring (Wells criteria).",
    difficulty: 2,
    category: "Point-of-Care Testing",
    topic: "Coagulation Point-of-Care"
  },
  {
    id: "mlt-b9-030",
    stem: "Rapid COVID-19 antigen tests detect:",
    options: ["SARS-CoV-2 RNA", "SARS-CoV-2 nucleocapsid protein by lateral flow immunochromatography", "Anti-SARS-CoV-2 antibodies", "Spike protein mRNA"],
    correctIndex: 1,
    rationale: "Rapid COVID antigen tests: lateral flow immunochromatographic assays detecting SARS-CoV-2 nucleocapsid (N) protein from nasal swabs. Results in 15-30 minutes. Most sensitive when viral load is high (symptomatic, first 5 days). Lower sensitivity than RT-PCR; negative results may need molecular confirmation.",
    difficulty: 1,
    category: "Point-of-Care Testing",
    topic: "Rapid Strep / Flu / COVID Testing"
  },
  {
    id: "mlt-b9-031",
    stem: "A laboratory case: A patient has the following liver panel - AST 1,200 IU/L, ALT 1,500 IU/L, ALP 150 IU/L, total bilirubin 8.5 mg/dL, direct bilirubin 5.2 mg/dL. This pattern MOST suggests:",
    options: ["Biliary obstruction (cholestatic pattern)", "Acute hepatocellular injury (hepatitis pattern) — markedly elevated transaminases with mild ALP elevation", "Normal liver function", "Bone disease"],
    correctIndex: 1,
    rationale: "Hepatocellular injury pattern: dramatically elevated transaminases (ALT>AST usually in viral hepatitis) with relatively mild ALP elevation. Cholestatic pattern: ALP predominantly elevated with mild transaminase elevation. Mixed bilirubin elevation indicates both hepatocellular dysfunction and some cholestasis.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b9-032",
    stem: "Case: A hemoglobin electrophoresis shows Hgb S 85%, Hgb F 10%, Hgb A2 5%, no Hgb A. This is consistent with:",
    options: ["Sickle cell trait (Hgb AS)", "Sickle cell disease (Hgb SS)", "Sickle-beta-zero thalassemia", "Normal hemoglobin pattern"],
    correctIndex: 2,
    rationale: "No Hgb A + predominant Hgb S + elevated Hgb F + elevated Hgb A2 = sickle-beta-zero thalassemia (no beta gene producing normal Hgb A). Sickle cell disease (SS) would show <5% HgbA2 and variable HgbF. Sickle trait (AS) would show ~40% S and ~60% A. Elevated A2 indicates beta-thal trait component.",
    difficulty: 3,
    category: "Hematology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b9-033",
    stem: "A QC troubleshooting scenario: Both Level 1 and Level 2 controls are beyond +2 SD on the same side. The MOST likely type of error is:",
    options: ["Random error", "Systematic error (positive bias/shift) — both levels affected in the same direction", "No error, results are acceptable", "Pre-analytical error"],
    correctIndex: 1,
    rationale: "2-2s violation (both levels beyond 2 SD on the same side) indicates systematic error (shift/bias). Both controls are affected similarly = systematic cause: new lot of reagent/calibrator, temperature change, or deteriorating optics. Random error would affect levels differently. Investigate and correct before reporting.",
    difficulty: 2,
    category: "Laboratory Operations & Quality Management",
    topic: "Quality Control"
  },
  {
    id: "mlt-b9-034",
    stem: "Case: A urinalysis shows pH 8.5, nitrite positive, leukocyte esterase 3+, WBC >50/HPF, many bacteria, and triple phosphate crystals. The MOST likely diagnosis is:",
    options: ["Normal urine", "UTI with urease-producing organism (likely Proteus) causing alkaline urine and struvite crystal formation", "Nephrotic syndrome", "Diabetic ketoacidosis"],
    correctIndex: 1,
    rationale: "Alkaline pH + nitrite positive + WBCs + bacteria + triple phosphate crystals = UTI with urease-producing organism (Proteus mirabilis most common). Urease splits urea → ammonia → alkaline pH → struvite (triple phosphate) crystal/stone formation. Culture and sensitivity needed for treatment.",
    difficulty: 3,
    category: "Urinalysis & Body Fluids",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b9-035",
    stem: "Instrument troubleshooting: A hematology analyzer flags 'platelet clumps.' The corrective action is:",
    options: ["Report the platelet count as is", "Examine the blood smear for platelet clumps, collect a citrate tube to rule out EDTA-dependent pseudothrombocytopenia, and perform a manual estimate", "Redraw in a red-top tube", "Add more EDTA to the specimen"],
    correctIndex: 1,
    rationale: "EDTA-dependent pseudothrombocytopenia: EDTA activates anti-platelet antibodies causing in vitro clumping → falsely low platelet count. Check smear for clumps. Redraw in sodium citrate tube (multiply count × 1.1 for dilution factor). ~0.1-0.2% of patients are affected. Report corrected count with comment.",
    difficulty: 3,
    category: "Hematology",
    topic: "Instrument Troubleshooting"
  },
  {
    id: "mlt-b9-036",
    stem: "Case: A bone marrow shows >20% blasts positive for CD34, CD117, MPO, and CD13/CD33. TdT is negative. The diagnosis is:",
    options: ["Acute lymphoblastic leukemia", "Acute myeloid leukemia (AML)", "Chronic myeloid leukemia", "Multiple myeloma"],
    correctIndex: 1,
    rationale: "CD34+ (blast marker), CD117+ (myeloid), MPO+ (myeloid lineage), CD13/CD33+ (myeloid) with TdT negative (lymphoid marker absent) = AML. ≥20% myeloid blasts = diagnostic criterion. Classification by WHO based on genetics, cytochemistry, and immunophenotype guides treatment.",
    difficulty: 3,
    category: "Hematology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b9-037",
    stem: "A mixing study shows: Patient aPTT 85 sec, 1:1 mix aPTT 38 sec (normal control 30 sec). The interpretation is:",
    options: ["Inhibitor present — mixing study does NOT correct", "Factor deficiency — mixing study CORRECTS (aPTT normalizes or nearly normalizes)", "Heparin contamination", "No conclusion can be drawn"],
    correctIndex: 1,
    rationale: "Mixing study corrects: 1:1 mix aPTT (38 sec) approaches normal (30 sec) = factor deficiency. Normal plasma provides the missing factor. If inhibitor (lupus anticoagulant, factor inhibitor) were present, the mixed aPTT would remain prolonged. Next step: specific factor assays to identify the deficient factor.",
    difficulty: 3,
    category: "Hemostasis / Coagulation",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b9-038",
    stem: "Case: An antibody panel shows anti-K (Kell) identified. When selecting compatible units for transfusion, what percentage of random donors are K-negative?",
    options: ["9%", "50%", "91%", "99%"],
    correctIndex: 2,
    rationale: "K antigen prevalence: ~9% of the population is K-positive (K+). Therefore, ~91% of random donors are K-negative. Finding K-negative units is usually straightforward. Anti-K is clinically significant: causes HTR and HDFN. K-negative, crossmatch-compatible units must be provided.",
    difficulty: 3,
    category: "Immunohematology / Blood Banking",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b9-039",
    stem: "Lab value interpretation: Anion gap = Na - (Cl + HCO3). Given Na 140, Cl 100, HCO3 10, the anion gap is:",
    options: ["10 (normal)", "20 (normal)", "30 (elevated — indicates high anion gap metabolic acidosis)", "50"],
    correctIndex: 2,
    rationale: "Anion gap = 140 - (100 + 10) = 30. Normal anion gap: 8-12 mEq/L. Elevated AG = unmeasured anions present: ketoacids (DKA), lactate, uremia, toxins (methanol, ethylene glycol, salicylates). Low HCO3 = metabolic acidosis. Evaluate with ABG for full acid-base assessment.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b9-040",
    stem: "Case: A 24-hour urine shows: volume 2000 mL, urine protein 4.5 g/day (ref <150 mg/day), serum albumin 2.0 g/dL, cholesterol 350 mg/dL, lipiduria present. This is MOST consistent with:",
    options: ["Nephritic syndrome", "Nephrotic syndrome (massive proteinuria, hypoalbuminemia, hyperlipidemia, lipiduria)", "Urinary tract infection", "Dehydration"],
    correctIndex: 1,
    rationale: "Nephrotic syndrome tetrad: (1) massive proteinuria (>3.5 g/day), (2) hypoalbuminemia (<3 g/dL, from urinary loss), (3) hyperlipidemia (liver increases lipoprotein production), (4) lipiduria (oval fat bodies, fatty casts, Maltese cross under polarized light). Causes: minimal change disease (children), membranous nephropathy (adults), diabetic nephropathy.",
    difficulty: 3,
    category: "Urinalysis & Body Fluids",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b9-041",
    stem: "A POC blood gas shows: pH 7.18, pCO2 65 mmHg, pO2 55 mmHg, HCO3 24 mEq/L. This represents:",
    options: ["Metabolic acidosis", "Acute respiratory acidosis with hypoxemia (no metabolic compensation yet)", "Metabolic alkalosis", "Respiratory alkalosis"],
    correctIndex: 1,
    rationale: "pH 7.18 (acidotic) + elevated pCO2 65 (respiratory cause) + normal HCO3 24 (no renal compensation = acute) + low pO2 (hypoxemia) = acute respiratory acidosis. Causes: COPD exacerbation, drug overdose, neuromuscular disease, severe pneumonia. Treatment: address underlying cause, support ventilation.",
    difficulty: 2,
    category: "Point-of-Care Testing",
    topic: "Blood Gas Analyzers"
  },
  {
    id: "mlt-b9-042",
    stem: "An aPTT-based heparin assay shows anti-Xa activity of 0.8 IU/mL (therapeutic range 0.3-0.7). The MOST appropriate action is:",
    options: ["Continue current heparin dose", "Decrease heparin dose — supratherapeutic level with increased bleeding risk", "Increase heparin dose", "Switch to warfarin immediately"],
    correctIndex: 1,
    rationale: "Anti-Xa activity 0.8 IU/mL exceeds the therapeutic range (0.3-0.7 IU/mL for standard UFH). Supratherapeutic anticoagulation increases bleeding risk. Dose reduction or temporary hold required. Anti-Xa assay is more accurate than aPTT when interfering factors are present (lupus anticoagulant, elevated factor VIII).",
    difficulty: 3,
    category: "Hemostasis / Coagulation",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b9-043",
    stem: "Case: A thyroid panel shows TSH 35 mIU/L (ref 0.4-4.0), free T4 0.3 ng/dL (ref 0.8-1.8). This is MOST consistent with:",
    options: ["Hyperthyroidism", "Primary hypothyroidism — elevated TSH attempting to stimulate an underperforming thyroid", "Secondary hypothyroidism", "Euthyroid sick syndrome"],
    correctIndex: 1,
    rationale: "High TSH + low free T4 = primary hypothyroidism. The thyroid gland is failing, so the pituitary produces more TSH (trying to stimulate the thyroid). Most common cause: Hashimoto thyroiditis (anti-TPO antibodies). Treatment: levothyroxine. Secondary hypothyroidism: low TSH + low T4 (pituitary problem).",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b9-044",
    stem: "A case scenario: GFR calculated at 22 mL/min/1.73m². This corresponds to CKD stage:",
    options: ["Stage 2 (mild)", "Stage 3b (moderate)", "Stage 4 (severe — referral to nephrologist for transplant/dialysis planning)", "Stage 5 (kidney failure)"],
    correctIndex: 2,
    rationale: "CKD staging by GFR: Stage 1: ≥90 (normal, with kidney damage markers). Stage 2: 60-89. Stage 3a: 45-59. Stage 3b: 30-44. Stage 4: 15-29 (severe). Stage 5: <15 (kidney failure/ESRD). GFR 22 = Stage 4. Requires nephrology referral for renal replacement therapy planning.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b9-045",
    stem: "Troubleshooting: A Gram stain shows all cells appearing gram-negative (pink). The MOST likely cause is:",
    options: ["All organisms in the specimen are truly gram-negative", "Over-decolorization with acetone-alcohol — gram-positive organisms lost crystal violet and appeared pink", "Under-decolorization", "Expired safranin"],
    correctIndex: 1,
    rationale: "Over-decolorization: excessive time or concentration of decolorizer removes crystal violet-iodine complex from gram-positive cells, making them appear pink (gram-negative). QC: run a known mixed gram-positive/gram-negative control slide with each batch. Optimal decolorization: 5-10 seconds or until runoff is clear.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Instrument Troubleshooting"
  },
  {
    id: "mlt-b9-046",
    stem: "Case: A blood culture grows gram-positive cocci in clusters. Catalase positive, coagulase positive, mannitol salt agar positive (yellow colonies). The organism is:",
    options: ["Staphylococcus epidermidis", "Staphylococcus aureus", "Streptococcus pyogenes", "Enterococcus faecalis"],
    correctIndex: 1,
    rationale: "GPC in clusters + catalase positive = Staphylococcus. Coagulase positive = S. aureus. Mannitol fermentation (yellow on MSA) confirms S. aureus. Check for MRSA: cefoxitin disk or mecA/PBP2a testing. S. epidermidis and other CoNS are coagulase negative and usually do not ferment mannitol.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b9-047",
    stem: "A laboratory uses the Bethesda inhibitor assay to quantify anti-Factor VIII antibodies. A result of 10 Bethesda units indicates:",
    options: ["No inhibitor present", "High-titer inhibitor — significant clinical impact requiring bypassing agents for treatment", "Low-titer inhibitor", "Normal factor level"],
    correctIndex: 1,
    rationale: "Bethesda assay quantifies factor inhibitors: 1 BU = amount of inhibitor that neutralizes 50% of factor activity. Low titer: <5 BU (may respond to higher factor doses). High titer: ≥5 BU (bypassing agents needed: FEIBA, rFVIIa). 10 BU = high-titer inhibitor with significant clinical management implications.",
    difficulty: 3,
    category: "Hemostasis / Coagulation",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b9-048",
    stem: "Case: A peripheral smear shows bite cells (degmacytes) and blister cells. The patient recently took a sulfonamide antibiotic. The MOST likely diagnosis is:",
    options: ["Iron deficiency anemia", "G6PD deficiency with oxidative hemolysis triggered by the sulfonamide", "Hereditary spherocytosis", "Sickle cell disease"],
    correctIndex: 1,
    rationale: "Bite cells + blister cells + oxidant drug exposure (sulfonamides, primaquine, dapsone, fava beans) = G6PD deficiency. G6PD protects RBCs from oxidative damage via glutathione pathway. Deficiency → Heinz bodies (denatured Hgb) → splenic pitting creates bite cells. X-linked recessive. Test G6PD level AFTER hemolytic episode resolves.",
    difficulty: 3,
    category: "Hematology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b9-049",
    stem: "A 1,3-beta-D-glucan (BDG) assay result of 150 pg/mL (ref <80) in a febrile neutropenic patient suggests:",
    options: ["Bacterial infection", "Invasive fungal infection (Candida, Aspergillus, Pneumocystis) — BDG is a panfungal biomarker", "Viral infection", "Normal result"],
    correctIndex: 1,
    rationale: "1,3-beta-D-glucan: cell wall component of most fungi (except Cryptococcus and Mucorales). Elevated BDG suggests invasive fungal infection. Used as an adjunctive diagnostic marker in high-risk patients. Does NOT detect Cryptococcus (capsule masks BDG) or Mucor/Rhizopus (minimal BDG in cell wall).",
    difficulty: 3,
    category: "Mycology",
    topic: "Antifungal Susceptibility"
  },
  {
    id: "mlt-b9-050",
    stem: "Galactomannan antigen testing is specific for:",
    options: ["Candida species", "Aspergillus species (cell wall component used as a biomarker for invasive aspergillosis)", "Cryptococcus", "Histoplasma"],
    correctIndex: 1,
    rationale: "Galactomannan: polysaccharide component of Aspergillus cell wall. Serum or BAL galactomannan EIA is used for early detection of invasive aspergillosis in high-risk patients (neutropenic, transplant). False positives: piperacillin-tazobactam (older formulations), some foods. Serial testing improves sensitivity.",
    difficulty: 3,
    category: "Mycology",
    topic: "Antifungal Susceptibility"
  },
  {
    id: "mlt-b9-051",
    stem: "Fite-Faraco modification of the acid-fast stain is used for:",
    options: ["Mycobacterium tuberculosis", "Nocardia and weakly acid-fast organisms (uses weaker decolorizer)", "Fungi", "Viruses"],
    correctIndex: 1,
    rationale: "Fite-Faraco: modified AFB stain using a weaker decolorizer (dilute H2SO4 instead of acid-alcohol). Detects weakly acid-fast organisms: Nocardia, Mycobacterium leprae. Standard Ziehl-Neelsen is too harsh for weakly acid-fast organisms. Nocardia: partially acid-fast, beaded branching filaments.",
    difficulty: 3,
    category: "Microbiology",
    topic: "Staining Techniques"
  },
  {
    id: "mlt-b9-052",
    stem: "Case: A WBC count on a leukemia patient shows 150,000/µL with 90% blasts. The technologist notices the chemistry lactate is also falsely elevated. This is due to:",
    options: ["True metabolic acidosis", "Pseudohyperlactatemia from in vitro metabolism of glucose by the markedly elevated WBCs (leukocyte larceny)", "Instrument interference", "Hemolysis"],
    correctIndex: 1,
    rationale: "Leukocyte larceny (pseudohypoglycemia/pseudohyperlactatemia): extremely elevated WBCs continue to metabolize glucose and produce lactate in vitro after specimen collection. Results: falsely low glucose, falsely elevated lactate, falsely low pO2. Prevention: process specimens immediately or collect in fluoride/oxalate tubes.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b9-053",
    stem: "A blood gas analyzer performs automatic calibration using:",
    options: ["Patient blood samples", "Known gas mixtures (high and low O2/CO2 concentrations) and buffer solutions at defined intervals", "External QC samples only", "Distilled water"],
    correctIndex: 1,
    rationale: "Blood gas analyzers auto-calibrate using precision gas mixtures (known O2, CO2 concentrations) for pO2 and pCO2, and pH buffer solutions (pH 6.840 and 7.384) for pH. One-point calibration occurs frequently (every 30-60 min), two-point calibration every 2-8 hours. Ensures accuracy between QC runs.",
    difficulty: 2,
    category: "Point-of-Care Testing",
    topic: "Blood Gas Analyzers"
  },
  {
    id: "mlt-b9-054",
    stem: "Case: A clinical chemistry result shows lipase 5x upper limit of normal with amylase 3x ULN. Triglycerides are 1,200 mg/dL. The MOST likely diagnosis and clinical concern is:",
    options: ["Cholecystitis with normal triglycerides", "Hypertriglyceridemia-induced acute pancreatitis — lipase is more specific and stays elevated longer than amylase", "Hepatitis", "Normal variation"],
    correctIndex: 1,
    rationale: "Lipase ≥3x ULN is diagnostic for acute pancreatitis. Extremely elevated triglycerides (>1,000 mg/dL) are a known cause of pancreatitis (3rd most common after gallstones and alcohol). Note: amylase may be falsely normal in hypertriglyceridemic pancreatitis due to lipid interference with the assay.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b9-055",
    stem: "Select ALL that apply: Which of the following findings are associated with hemolytic anemia? (Select ALL correct answers)",
    options: ["Elevated reticulocyte count, elevated LDH, elevated indirect bilirubin, decreased haptoglobin", "Low reticulocyte count, normal LDH", "Elevated direct bilirubin only", "Normal haptoglobin, low LDH"],
    correctIndex: 0,
    rationale: "Hemolytic anemia markers: (1) elevated reticulocytes (marrow compensation), (2) elevated LDH (released from lysed RBCs), (3) elevated indirect bilirubin (from heme catabolism), (4) decreased haptoglobin (consumed binding free hemoglobin). Also: hemoglobinemia, hemoglobinuria (intravascular), spherocytes (extravascular).",
    difficulty: 2,
    category: "Hematology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b9-056",
    stem: "Case: A newborn screening dried blood spot shows elevated phenylalanine (Phe 25 mg/dL, ref <2). The MOST appropriate next step is:",
    options: ["No follow-up needed", "Confirmatory quantitative plasma amino acid analysis and immediate referral to metabolic specialist for dietary intervention", "Repeat screening in 6 months", "Start antibiotics"],
    correctIndex: 1,
    rationale: "Elevated Phe on newborn screen: presumptive PKU. Requires immediate confirmation by quantitative plasma amino acids. If confirmed: immediate dietary restriction of phenylalanine (special formula, low-Phe diet for life). Early treatment prevents intellectual disability. Phe >20 mg/dL = classic PKU.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b9-057",
    stem: "A Westgard 10x violation means:",
    options: ["One result exceeds 10 SD", "Ten consecutive QC values fall on the same side of the mean, indicating a systematic shift requiring investigation", "Ten random errors in one run", "Ten different analytes are out of range"],
    correctIndex: 1,
    rationale: "10x rule: 10 consecutive QC values on the same side of the mean (all above or all below, regardless of magnitude). Indicates systematic bias/shift. Causes: gradual calibration drift, slow reagent deterioration, temperature drift. More sensitive than 2-2s for detecting small systematic changes.",
    difficulty: 2,
    category: "Laboratory Operations & Quality Management",
    topic: "Quality Control"
  },
  {
    id: "mlt-b9-058",
    stem: "Immunofixation electrophoresis (IFE) is performed to:",
    options: ["Measure total protein", "Identify and characterize the monoclonal protein (M-protein) type (IgG, IgA, IgM, kappa, lambda) detected by SPEP", "Measure albumin", "Perform ANA testing"],
    correctIndex: 1,
    rationale: "IFE: follows SPEP when an M-spike is detected. Serum proteins are separated by electrophoresis, then individual lanes are overlaid with anti-IgG, anti-IgA, anti-IgM, anti-kappa, and anti-lambda antisera. Precipitin bands identify the specific heavy chain and light chain of the monoclonal protein.",
    difficulty: 3,
    category: "Immunology / Serology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b9-059",
    stem: "Case: Flow cytometry on a lymph node biopsy shows cells positive for CD10, CD19, CD20, BCL-2, and surface immunoglobulin light chain restriction (kappa). This immunophenotype is MOST consistent with:",
    options: ["Diffuse large B-cell lymphoma", "Follicular lymphoma", "Mantle cell lymphoma", "CLL/SLL"],
    correctIndex: 1,
    rationale: "CD10+, CD19+, CD20+, BCL-2+, surface Ig light chain restricted = follicular lymphoma (FL). BCL-2 overexpression from t(14;18) is characteristic. CD10 (germinal center marker) distinguishes FL from other B-cell lymphomas. Kappa or lambda restriction confirms monoclonality (B-cell neoplasm).",
    difficulty: 3,
    category: "Hematology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b9-060",
    stem: "A POC A1c device reports HbA1c of 6.8%. According to ADA guidelines, this indicates:",
    options: ["Normal glucose control", "Prediabetes (5.7-6.4%)", "Diabetes mellitus (≥6.5%) — confirmatory testing or symptoms needed for initial diagnosis", "Excellent diabetes control"],
    correctIndex: 2,
    rationale: "ADA diagnostic criteria for diabetes: HbA1c ≥6.5%, fasting glucose ≥126 mg/dL, or 2-hour OGTT ≥200 mg/dL (each requires confirmation on a separate day). POC A1c devices: useful for monitoring and screening but must be NGSP-certified. For established diabetes, A1c 6.8% indicates near-target control (target <7% for most adults).",
    difficulty: 2,
    category: "Point-of-Care Testing",
    topic: "Glucose Meters"
  },
  {
    id: "mlt-b9-061",
    stem: "A fetal fibronectin (fFN) test performed by POC swab in a pregnant woman at 28 weeks is negative. This indicates:",
    options: ["Imminent preterm delivery", "Low risk of preterm delivery in the next 7-14 days (high negative predictive value >99%)", "Confirmed full-term pregnancy", "Placental abruption"],
    correctIndex: 1,
    rationale: "Fetal fibronectin: glycoprotein at maternal-fetal interface. Negative fFN in symptomatic patients (22-34 weeks) has >99% NPV for delivery within 7-14 days. Positive result is less specific. Reduces unnecessary interventions (tocolytics, transfer, steroid administration) when negative.",
    difficulty: 3,
    category: "Point-of-Care Testing",
    topic: "Quality Management for POCT"
  },
  {
    id: "mlt-b9-062",
    stem: "MALDI-TOF mass spectrometry has revolutionized microbiology by:",
    options: ["Replacing Gram staining entirely", "Providing rapid, accurate organism identification (often within minutes) by analyzing unique protein/peptide fingerprints of microorganisms", "Performing antibiotic susceptibility testing directly", "Eliminating the need for specimen collection"],
    correctIndex: 1,
    rationale: "MALDI-TOF MS: ionizes microbial proteins, analyzes mass/charge ratios, creates unique spectral fingerprint matched to database. Identifies bacteria and fungi directly from colonies in minutes (vs. hours-days for biochemical methods). Reduces identification time, labor, and costs. Some assays can detect resistance markers.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Automated Microbiology Systems"
  },
  {
    id: "mlt-b9-063",
    stem: "The India ink preparation for CSF is used to detect:",
    options: ["Bacteria", "Cryptococcus neoformans — encapsulated yeast with clear halo against dark background", "Mycobacteria", "Parasites"],
    correctIndex: 1,
    rationale: "India ink: negative stain. Carbon particles in ink cannot penetrate the polysaccharide capsule of Cryptococcus, creating a clear halo around the yeast cells against a dark background. Sensitivity ~50% in non-HIV patients; higher in AIDS with high fungal burden. Cryptococcal antigen (CrAg) is more sensitive (>95%).",
    difficulty: 1,
    category: "Mycology",
    topic: "Yeasts"
  },
  {
    id: "mlt-b9-064",
    stem: "Case: A patient with suspected TTP has the following: platelets 18,000/µL, LDH 1,500 IU/L, schistocytes on smear, indirect bilirubin 4.5 mg/dL, creatinine 2.1 mg/dL, ADAMTS13 activity <5%. This confirms:",
    options: ["HUS", "TTP — severely decreased ADAMTS13 confirms the diagnosis and guides plasma exchange therapy", "DIC", "ITP"],
    correctIndex: 1,
    rationale: "TTP pentad: MAHA (schistocytes, elevated LDH, elevated indirect bilirubin), thrombocytopenia, renal dysfunction, fever, neurologic symptoms. ADAMTS13 <10% is diagnostic. ADAMTS13 deficiency → ultra-large vWF multimers → platelet microthrombi. Emergency treatment: plasma exchange (replaces ADAMTS13, removes inhibitor).",
    difficulty: 3,
    category: "Hematology",
    topic: "Case-Based Lab Scenarios"
  },
  {
    id: "mlt-b9-065",
    stem: "A troponin I at presentation is <5 ng/L (hs-cTn, 99th percentile URL = 16 ng/L). A repeat at 3 hours shows 45 ng/L. This pattern indicates:",
    options: ["Chronic stable troponin elevation", "Acute myocardial injury with significant delta change — consistent with acute MI in appropriate clinical context", "Normal variation", "Laboratory error"],
    correctIndex: 1,
    rationale: "High-sensitivity troponin: a significant rise and/or fall pattern with at least one value above the 99th percentile URL indicates acute myocardial injury. Delta (change) >20% at 3 hours or absolute change >6-7 ng/L supports acute MI diagnosis. Rapid rule-in/rule-out algorithms use serial hs-cTn measurements.",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b9-066",
    stem: "POCT connectivity refers to:",
    options: ["WiFi connectivity for internet browsing", "Electronic interface between POC devices and the laboratory information system (LIS) for automatic result documentation, QC tracking, and operator management", "Physical connection between devices", "Power supply connections"],
    correctIndex: 1,
    rationale: "POCT connectivity: bidirectional interface between POC devices and LIS/HIS. Benefits: automatic result documentation in patient record, real-time QC monitoring, operator lockout if competency expired, remote device management, regulatory compliance, and error reduction. POCT1-A standard defines connectivity requirements.",
    difficulty: 2,
    category: "Point-of-Care Testing",
    topic: "Quality Management for POCT"
  },
  {
    id: "mlt-b9-067",
    stem: "Tissue microarray (TMA) technology in histology allows:",
    options: ["Single specimen analysis only", "Simultaneous analysis of hundreds of tissue samples on a single slide for high-throughput IHC, FISH, or ISH studies", "Only H&E staining", "In vivo tissue analysis"],
    correctIndex: 1,
    rationale: "TMA: small cylindrical cores (0.6-2 mm) from multiple paraffin blocks are arrayed into a single recipient block. One section from this block contains hundreds of tissue samples. Enables high-throughput biomarker studies, assay validation, and QC for IHC antibodies. Revolutionized translational research.",
    difficulty: 3,
    category: "Histotechnology",
    topic: "Immunohistochemistry"
  },
  {
    id: "mlt-b9-068",
    stem: "Ziehl-Neelsen acid-fast stain: positive organisms appear:",
    options: ["Blue against a red background", "Red (retain carbolfuchsin) against a blue (methylene blue counterstain) background", "Green against a black background", "Purple against a pink background"],
    correctIndex: 1,
    rationale: "ZN stain: carbolfuchsin (red, heated) penetrates mycolic acid-rich cell walls. Acid-alcohol decolorization removes stain from non-acid-fast organisms. Methylene blue counterstains background blue. AFB retain red stain = acid-fast positive. Kinyoun stain: cold method (no heating) using higher concentration of phenol.",
    difficulty: 1,
    category: "Microbiology",
    topic: "Staining Techniques"
  },
  {
    id: "mlt-b9-069",
    stem: "ER (estrogen receptor) and PR (progesterone receptor) IHC testing on breast cancer is performed because:",
    options: ["They determine tumor grade", "Positive ER/PR status predicts response to hormonal therapy (tamoxifen, aromatase inhibitors) and is associated with better prognosis", "They identify metastatic disease", "They measure tumor size"],
    correctIndex: 1,
    rationale: "ER+/PR+ breast cancers: responsive to hormonal therapy (tamoxifen blocks ER, aromatase inhibitors block estrogen synthesis). Better prognosis than ER-/PR- (triple-negative). Allred scoring system: proportion score + intensity score. ER/PR, HER2, and Ki-67 guide treatment decisions (luminal A, B, HER2+, triple-negative subtypes).",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Immunohistochemistry"
  },
  {
    id: "mlt-b9-070",
    stem: "A POC hemoglobin electrophoresis (e.g., Sebia HYDRASYS) performed at a sickle cell screening clinic shows Hgb A 55%, Hgb S 42%, Hgb A2 3%. This is consistent with:",
    options: ["Sickle cell disease (SS)", "Sickle cell trait (AS) — heterozygous carrier", "Beta-thalassemia major", "Normal hemoglobin pattern"],
    correctIndex: 1,
    rationale: "Sickle cell trait (HbAS): Hgb A predominates (~55-60%), Hgb S ~35-42%, normal Hgb A2 (<3.5%). Carriers are generally asymptomatic but should receive genetic counseling. Sickle cell disease (SS): Hgb S >80%, no Hgb A. Citrate agar (acid pH) separates S from D and G (which co-migrate on alkaline electrophoresis).",
    difficulty: 2,
    category: "Hematology",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b9-071",
    stem: "The AB screen (antibody screen/indirect antiglobulin test) is performed to detect:",
    options: ["ABO antibodies only", "Unexpected (irregular) antibodies in the patient's serum that could cause hemolytic transfusion reactions", "Platelet antibodies", "WBC antibodies"],
    correctIndex: 1,
    rationale: "Antibody screen (IAT): detects unexpected (non-ABO) antibodies in patient serum using commercially prepared screening cells with known antigen profiles. Clinically significant antibodies (anti-D, -K, -Fy^a, -Jk^a, etc.) detected at 37°C/AHG phase. Positive screen requires antibody identification panel.",
    difficulty: 1,
    category: "Immunohematology / Blood Banking",
    topic: "Antibody Identification"
  },
  {
    id: "mlt-b9-072",
    stem: "Post-analytical errors include:",
    options: ["Hemolyzed specimen", "Incorrect result entry, wrong reference range application, failure to report critical values, or delayed reporting", "Instrument malfunction during testing", "Using wrong collection tube"],
    correctIndex: 1,
    rationale: "Post-analytical errors: occur AFTER testing. Include: transcription errors, failure to notify critical values, wrong reference range, incorrect unit of measurement, delayed reporting, misinterpretation, and LIS system errors. Account for 18-47% of laboratory errors. Autoverification and delta checks reduce post-analytical errors.",
    difficulty: 2,
    category: "Laboratory Operations & Quality Management",
    topic: "Quality Assurance Programs"
  },
  {
    id: "mlt-b9-073",
    stem: "Fibrin degradation products (FDPs) differ from D-dimer because:",
    options: ["FDPs and D-dimer are identical", "D-dimer is specific for cross-linked fibrin degradation (indicating both clot formation and lysis), while FDPs can come from fibrinogen or non-cross-linked fibrin degradation", "FDPs are more specific", "D-dimer measures fibrinogen directly"],
    correctIndex: 1,
    rationale: "D-dimer: specific for plasmin degradation of CROSS-LINKED fibrin (Factor XIIa-stabilized clot). FDPs: detect degradation of both fibrinogen AND fibrin (less specific). Elevated D-dimer confirms that both coagulation (clot formation) and fibrinolysis have occurred. FDPs are positive in both primary fibrinolysis and DIC.",
    difficulty: 3,
    category: "Hemostasis / Coagulation",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b9-074",
    stem: "A lab technologist discovers that the DI water resistivity is 14 MΩ·cm instead of the required ≥18 MΩ·cm. The action is:",
    options: ["Continue using the water", "Stop testing — water quality below specifications may affect reagent preparation, dilutions, and assay performance. Investigate and correct the DI water system", "Add more DI water to dilute impurities", "Filter the water through paper"],
    correctIndex: 1,
    rationale: "Clinical laboratory reagent-grade water (Type I/CLRW): ≥18 MΩ·cm resistivity, <10 CFU/mL bacteria, <10 ppb TOC. Below-spec water can cause interference, increased background, and erroneous results. Check DI system: filters, membranes, deionization cartridges, UV lamp. Daily resistivity monitoring is required.",
    difficulty: 2,
    category: "Laboratory Operations & Quality Management",
    topic: "Quality Control"
  },
  {
    id: "mlt-b9-075",
    stem: "The difference between accuracy and precision in laboratory testing is:",
    options: ["They are the same thing", "Accuracy = closeness to the true value (trueness); Precision = reproducibility (consistency) of repeated measurements", "Accuracy means low CV; Precision means low bias", "Neither is important in clinical testing"],
    correctIndex: 1,
    rationale: "Accuracy (trueness): how close the result is to the true/accepted value. Measured by comparison studies, calibration verification. Precision (reproducibility): how close repeated measurements are to each other. Measured by SD, CV. A method can be precise but inaccurate (consistent but biased), or accurate but imprecise (scattered around true value).",
    difficulty: 1,
    category: "Laboratory Operations & Quality Management",
    topic: "Quality Assurance Programs"
  }
];
