import type { CareerQuestion } from "./rrt-questions";

export const mltQuestionsBatch12: CareerQuestion[] = [
  {
    id: "mlt-b12-001",
    stem: "A Gram stain of a sputum sample shows gram-positive diplococci that are lancet-shaped. The MOST likely organism is:",
    options: ["Staphylococcus aureus", "Streptococcus pneumoniae", "Neisseria meningitidis", "Moraxella catarrhalis"],
    correctIndex: 1,
    rationale: "S. pneumoniae are gram-positive, lancet-shaped diplococci. They are alpha-hemolytic, optochin-sensitive, and bile-soluble. Leading cause of community-acquired pneumonia, meningitis, and otitis media. Quellung reaction positive (capsular swelling with type-specific antisera).",
    difficulty: 1,
    category: "Microbiology",
    topic: "Bacteriology"
  },
  {
    id: "mlt-b12-002",
    stem: "Which anticoagulant chelates calcium to prevent coagulation and is used for coagulation studies (PT, aPTT)?",
    options: ["Heparin", "Sodium citrate (3.2%)", "EDTA", "Sodium fluoride"],
    correctIndex: 1,
    rationale: "Sodium citrate (3.2%, light blue top tube) chelates calcium (Ca²⁺ is factor IV) reversibly, making it the anticoagulant of choice for coagulation testing. The 9:1 blood-to-anticoagulant ratio is critical — underfilling causes falsely prolonged results. EDTA is used for CBC; heparin for chemistry panels.",
    difficulty: 1,
    category: "Phlebotomy & Specimen Collection",
    topic: "Anticoagulants & Tube Selection"
  },
  {
    id: "mlt-b12-003",
    stem: "A culture from a wound shows beta-hemolytic colonies. Gram stain: gram-positive cocci in chains. Bacitracin sensitive, PYR positive. Identification?",
    options: ["Staphylococcus aureus", "Group A Streptococcus (Streptococcus pyogenes)", "Enterococcus faecalis", "Group B Streptococcus"],
    correctIndex: 1,
    rationale: "Group A Strep (S. pyogenes): beta-hemolytic, gram-positive cocci in chains, bacitracin sensitive (A disc), PYR positive. Causes pharyngitis, impetigo, necrotizing fasciitis, post-streptococcal glomerulonephritis, rheumatic fever. Group B (S. agalactiae): bacitracin resistant, CAMP positive, hippurate positive.",
    difficulty: 1,
    category: "Microbiology",
    topic: "Bacteriology"
  },
  {
    id: "mlt-b12-004",
    stem: "The citrate test determines whether an organism can utilize citrate as its sole carbon source. A positive result is indicated by:",
    options: ["Yellow color (acidic)", "Blue color (alkaline) on Simmons citrate agar due to pH indicator bromthymol blue", "No growth", "Gas production"],
    correctIndex: 1,
    rationale: "Simmons citrate: organisms that use citrate produce alkaline byproducts → pH rises → bromthymol blue indicator turns from green to blue. Positive: Klebsiella, Enterobacter, Serratia, Citrobacter, Proteus. Negative: E. coli, Shigella. Part of the IMViC reactions (Indole, Methyl red, Voges-Proskauer, Citrate).",
    difficulty: 1,
    category: "Microbiology",
    topic: "Biochemical Testing"
  },
  {
    id: "mlt-b12-005",
    stem: "Which stain is used to identify Mycobacterium tuberculosis in clinical specimens?",
    options: ["Gram stain", "Ziehl-Neelsen (acid-fast) stain — mycobacteria resist decolorization by acid-alcohol due to mycolic acid in their cell wall", "India ink", "PAS stain"],
    correctIndex: 1,
    rationale: "Acid-fast staining (Ziehl-Neelsen or Kinyoun): mycobacteria stain red (carbol fuchsin) and resist decolorization with acid-alcohol due to high mycolic acid content. Background stains blue (methylene blue counterstain). Fluorochrome (auramine-rhodamine) is more sensitive for screening. Culture on Löwenstein-Jensen or BACTEC MGIT for definitive ID.",
    difficulty: 1,
    category: "Microbiology",
    topic: "Staining Techniques"
  },
  {
    id: "mlt-b12-006",
    stem: "A blood culture grows gram-negative diplococci that are oxidase positive. The organism grows on chocolate agar but NOT on blood agar at 37°C in CO2. Most likely identification?",
    options: ["Moraxella catarrhalis", "Neisseria gonorrhoeae", "Neisseria meningitidis", "Haemophilus influenzae"],
    correctIndex: 1,
    rationale: "N. gonorrhoeae: gram-negative diplococci, oxidase positive, grows on chocolate agar (requires CO2) but NOT standard blood agar (selective media: Thayer-Martin/Martin-Lewis with antibiotics). N. meningitidis grows on both blood and chocolate agar. N. gonorrhoeae ferments only glucose; N. meningitidis ferments glucose AND maltose.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Bacteriology"
  },
  {
    id: "mlt-b12-007",
    stem: "The order of draw for venipuncture (CLSI standard) begins with:",
    options: ["EDTA (lavender) tube", "Blood culture bottles (sterile), then light blue (citrate), then red/gold (SST), then green (heparin), then lavender (EDTA), then gray (fluoride/oxalate)", "Red top tube", "Gray tube"],
    correctIndex: 1,
    rationale: "CLSI order of draw prevents additive carryover. Mnemonic: Boys Love Righteous Girls Living Gracefully. Blood cultures → Light blue (citrate) → Red/gold (SST/clot activator) → Green (heparin) → Lavender (EDTA) → Gray (fluoride/oxalate). If no blood culture, light blue is drawn first (but waste tube may be needed).",
    difficulty: 1,
    category: "Phlebotomy & Specimen Collection",
    topic: "Order of Draw"
  },
  {
    id: "mlt-b12-008",
    stem: "A platelet count of 35,000/µL is classified as:",
    options: ["Normal", "Mild thrombocytopenia", "Severe thrombocytopenia — risk of spontaneous bleeding increases significantly below 50,000/µL", "Thrombocytosis"],
    correctIndex: 2,
    rationale: "Thrombocytopenia classification: mild 100,000-150,000; moderate 50,000-100,000; severe <50,000/µL. Below 10,000-20,000: risk of spontaneous intracranial hemorrhage. Causes: ITP, TTP/HUS, DIC, bone marrow failure, drug-induced, hypersplenism. Verify low platelet count by reviewing smear for clumps (pseudothrombocytopenia from EDTA-dependent agglutinins).",
    difficulty: 1,
    category: "Hematology",
    topic: "Platelet Disorders"
  },
  {
    id: "mlt-b12-009",
    stem: "MacConkey agar is a selective and differential medium. It selects for gram-negative organisms and differentiates based on:",
    options: ["Hemolysis pattern", "Lactose fermentation — lactose fermenters (e.g., E. coli) produce pink/red colonies, non-fermenters (e.g., Salmonella) produce colorless colonies", "Motility", "Oxidase reaction"],
    correctIndex: 1,
    rationale: "MacConkey agar: bile salts + crystal violet inhibit gram-positives (selective). Lactose + neutral red indicator differentiates: lactose fermenters (E. coli, Klebsiella, Enterobacter) produce acid → pink/red colonies. Non-lactose fermenters (Salmonella, Shigella, Proteus) → colorless/transparent colonies. Key differential plate for enteric pathogens.",
    difficulty: 1,
    category: "Microbiology",
    topic: "Culture Media"
  },
  {
    id: "mlt-b12-010",
    stem: "A patient's serum shows: Total protein 8.5 g/dL, albumin 2.0 g/dL. The A/G ratio is:",
    options: ["4.25", "0.31 (reversed A/G ratio indicating elevated globulins, suggestive of chronic infection, liver disease, or myeloma)", "1.0", "2.0"],
    correctIndex: 1,
    rationale: "A/G ratio = albumin / globulin. Globulin = total protein - albumin = 8.5 - 2.0 = 6.5 g/dL. A/G = 2.0/6.5 = 0.31. Normal A/G: 1.1-2.5. Reversed ratio (<1.0) with elevated globulins: multiple myeloma, chronic infections (HIV, hepatitis), autoimmune disease, liver cirrhosis. Low albumin alone: nephrotic syndrome, malnutrition, liver failure.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Protein Studies"
  },
  {
    id: "mlt-b12-011",
    stem: "Clue cells on a wet mount preparation are characteristic of:",
    options: ["Trichomonas vaginalis", "Bacterial vaginosis (Gardnerella vaginalis and associated anaerobes)", "Candida albicans", "Chlamydia trachomatis"],
    correctIndex: 1,
    rationale: "Clue cells: squamous epithelial cells with edges obscured by adherent small gram-variable coccobacilli (Gardnerella vaginalis). Diagnostic of bacterial vaginosis. Amsel criteria (3 of 4): clue cells, thin gray discharge, pH >4.5, positive whiff test (amine/fishy odor with KOH). Nugent scoring of Gram stain is the gold standard.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Genital Tract Infections"
  },
  {
    id: "mlt-b12-012",
    stem: "The ABO blood group system antigens are composed of:",
    options: ["Proteins only", "Carbohydrates (oligosaccharides) attached to glycoproteins and glycolipids on the RBC membrane", "Lipids only", "Nucleic acids"],
    correctIndex: 1,
    rationale: "ABO antigens are carbohydrate (sugar) structures. H antigen is the precursor: L-fucose added to terminal galactose. A gene adds N-acetylgalactosamine → A antigen. B gene adds D-galactose → B antigen. Group O has unmodified H antigen. Bombay phenotype (Oh) lacks H antigen due to homozygous h/h (no fucosyltransferase).",
    difficulty: 2,
    category: "Immunohematology / Blood Banking",
    topic: "ABO System"
  },
  {
    id: "mlt-b12-013",
    stem: "Sensitivity (analytical) of a laboratory test refers to:",
    options: ["Ability to detect true negatives", "The lowest concentration of an analyte that can be reliably distinguished from zero (limit of detection)", "The range of values the test can measure", "Ability to exclude false positives"],
    correctIndex: 1,
    rationale: "Analytical sensitivity = limit of detection (LOD). The lowest concentration that can be distinguished from blank with stated confidence (usually 95%). Different from diagnostic sensitivity (ability to detect disease: TP/(TP+FN)). Analytical specificity = ability to measure only the intended analyte without interference. Both are determined during method validation.",
    difficulty: 2,
    category: "Laboratory Operations & Quality",
    topic: "Method Validation"
  },
  {
    id: "mlt-b12-014",
    stem: "A urine dipstick is positive for leukocyte esterase and nitrite. Microscopy shows >20 WBCs/HPF and bacteria. This is consistent with:",
    options: ["Normal urine", "Urinary tract infection — LE detects WBC esterase, nitrite detects Enterobacterales (E. coli) that reduce nitrate to nitrite", "Renal calculi only", "Glomerulonephritis"],
    correctIndex: 1,
    rationale: "UTI constellation: positive LE (WBCs present, esterase from granulocytes), positive nitrite (gram-negative Enterobacterales convert dietary nitrate to nitrite — requires bladder incubation time), WBCs >5/HPF, and bacteria on microscopy. Gram-positive organisms (Enterococcus, Staph saprophyticus) cause UTI but don't produce nitrite. Culture confirms.",
    difficulty: 1,
    category: "Urinalysis & Body Fluids",
    topic: "Urine Chemistry"
  },
  {
    id: "mlt-b12-015",
    stem: "Cold agglutinin disease is caused by autoantibodies of which immunoglobulin class?",
    options: ["IgA", "IgM — reacts optimally at 4°C, causes complement activation and extravascular hemolysis", "IgG", "IgE"],
    correctIndex: 1,
    rationale: "Cold agglutinins: IgM autoantibodies with anti-I (usually) specificity. React optimally at 4°C but can be active up to 30-37°C (high thermal amplitude = clinically significant). IgM activates complement → C3b-coated RBCs → extravascular hemolysis in liver. DAT: positive with anti-C3d, negative with anti-IgG. Associated with Mycoplasma pneumoniae, EBV, lymphoproliferative disorders.",
    difficulty: 2,
    category: "Immunohematology / Blood Banking",
    topic: "Autoimmune Hemolytic Anemia"
  },
  {
    id: "mlt-b12-016",
    stem: "The coefficient of variation (CV) is calculated as:",
    options: ["Mean / SD × 100", "(SD / Mean) × 100 — expresses precision as a percentage of the mean", "SD × Mean", "SD - Mean"],
    correctIndex: 1,
    rationale: "CV% = (SD / Mean) × 100. Expresses variability relative to the mean, allowing comparison of precision across different concentration levels or analytes. Lower CV = better precision. Typical acceptable CVs: glucose <3%, hemoglobin <2%, platelet count <5%. Used in quality control to assess within-run and between-run precision.",
    difficulty: 1,
    category: "Laboratory Operations & Quality",
    topic: "Quality Control Statistics"
  },
  {
    id: "mlt-b12-017",
    stem: "Entamoeba histolytica trophozoites are distinguished from E. dispar by:",
    options: ["Size only", "Ingested RBCs (erythrophagocytosis) in E. histolytica trophozoites — E. dispar does not ingest RBCs; molecular testing (PCR or antigen detection) is required for definitive differentiation", "Cyst morphology", "Motility pattern"],
    correctIndex: 1,
    rationale: "E. histolytica (pathogenic) vs. E. dispar (non-pathogenic) are morphologically identical except that only E. histolytica trophozoites ingest RBCs. However, erythrophagocytosis is not always present. Definitive differentiation requires EIA (E. histolytica-specific antigen) or PCR. Both produce cysts with 4 nuclei. Treatment only for confirmed E. histolytica.",
    difficulty: 2,
    category: "Parasitology",
    topic: "Intestinal Protozoa"
  },
  {
    id: "mlt-b12-018",
    stem: "The Henderson-Hasselbalch equation for blood pH is:",
    options: ["pH = pKa + log [CO2/HCO3]", "pH = pKa + log [HCO3-] / [H2CO3] — at pKa 6.1, HCO3/H2CO3 ratio of 20:1 yields normal pH 7.4", "pH = HCO3 × pCO2", "pH = pKa - log [HCO3/CO2]"],
    correctIndex: 1,
    rationale: "Henderson-Hasselbalch: pH = pKa + log ([HCO3-]/[H2CO3]). pKa of carbonic acid = 6.1. H2CO3 = 0.03 × pCO2. Normal: pH = 6.1 + log (24 / 1.2) = 6.1 + log 20 = 6.1 + 1.3 = 7.4. This equation links metabolic (HCO3) and respiratory (pCO2) components, fundamental to acid-base interpretation.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Acid-Base Balance"
  },
  {
    id: "mlt-b12-019",
    stem: "What is the preferred specimen for a CBC (complete blood count)?",
    options: ["Sodium citrate (blue top)", "EDTA (lavender top) — chelates calcium without affecting cell morphology or volume", "Heparin (green top)", "Serum (red top)"],
    correctIndex: 1,
    rationale: "EDTA (K2EDTA or K3EDTA, lavender/purple top): anticoagulant of choice for CBC/differential because it preserves cell morphology, prevents platelet clumping, and doesn't affect MCV. EDTA chelates calcium irreversibly. K2EDTA is preferred (CLSI recommendation). Time-sensitive: blood films should ideally be made within 1 hour to prevent EDTA-induced changes.",
    difficulty: 1,
    category: "Phlebotomy & Specimen Collection",
    topic: "Anticoagulants & Tube Selection"
  },
  {
    id: "mlt-b12-020",
    stem: "Which electrolyte is predominantly intracellular and acts as the major intracellular cation?",
    options: ["Sodium", "Potassium — 98% of total body potassium is intracellular (ICF ~150 mEq/L vs ECF 3.5-5.0 mEq/L)", "Chloride", "Calcium"],
    correctIndex: 1,
    rationale: "Potassium: major intracellular cation. ICF concentration ~150 mEq/L vs ECF 3.5-5.0 mEq/L. Na+/K+-ATPase pump maintains gradient. Small ECF changes cause significant physiological effects (cardiac arrhythmias). Hemolysis is the #1 pre-analytical cause of falsely elevated K (released from RBCs). Always evaluate hemolysis index before reporting elevated K.",
    difficulty: 1,
    category: "Clinical Chemistry",
    topic: "Electrolytes"
  },
  {
    id: "mlt-b12-021",
    stem: "A pregnancy test (urine or serum) detects which hormone?",
    options: ["Estrogen", "Human chorionic gonadotropin (hCG) — produced by trophoblastic cells of the placenta, detectable 8-10 days post-conception", "Progesterone", "FSH"],
    correctIndex: 1,
    rationale: "hCG: glycoprotein hormone (alpha + beta subunits). Beta subunit is unique (alpha shared with LH, FSH, TSH). Produced by syncytiotrophoblasts. Detectable in serum 8-10 days post-conception. Qualitative urine tests: threshold ~20-25 mIU/mL. Quantitative serum hCG: monitor ectopic pregnancy, trophoblastic disease, tumor markers (germ cell tumors).",
    difficulty: 1,
    category: "Clinical Chemistry",
    topic: "Endocrinology"
  },
  {
    id: "mlt-b12-022",
    stem: "Gram-negative rods that are oxidase positive, produce a blue-green pigment (pyocyanin), and have a grape-like odor on culture are:",
    options: ["Escherichia coli", "Pseudomonas aeruginosa", "Klebsiella pneumoniae", "Proteus mirabilis"],
    correctIndex: 1,
    rationale: "P. aeruginosa: gram-negative rod, non-fermenter, oxidase positive, pyocyanin (blue-green pigment, unique to P. aeruginosa), grape-like/tortilla-like odor, motile (single polar flagellum). Grows at 42°C. Causes nosocomial infections (pneumonia, UTI, wound infections, burn infections), especially in immunocompromised. Intrinsically resistant to many antibiotics.",
    difficulty: 1,
    category: "Microbiology",
    topic: "Non-fermenters"
  },
  {
    id: "mlt-b12-023",
    stem: "In gel column technology for blood bank testing, a positive reaction (agglutination) is indicated by:",
    options: ["RBCs pelleted at the bottom of the column", "RBCs trapped in the gel matrix or at the top of the column (agglutinates too large to pass through the gel)", "No visible reaction", "Color change"],
    correctIndex: 1,
    rationale: "Gel column (column agglutination technology): RBCs are centrifuged through dextran-acrylamide gel. Agglutinated RBCs (positive): trapped in gel or remain on top (too large to pass through matrix). Non-agglutinated RBCs (negative): pellet at bottom. Advantages: standardized centrifugation, stable endpoint, reduced subjectivity. Used for ABO/Rh typing, antibody screen, crossmatch, DAT.",
    difficulty: 2,
    category: "Immunohematology / Blood Banking",
    topic: "Testing Methods"
  },
  {
    id: "mlt-b12-024",
    stem: "Calcium oxalate crystals in urine are clinically significant when associated with:",
    options: ["Normal finding only", "Kidney stones (nephrolithiasis) — calcium oxalate is the most common type of kidney stone (70-80%)", "Liver disease", "Pancreatic disease"],
    correctIndex: 1,
    rationale: "Calcium oxalate: most common crystal in acidic urine AND most common kidney stone type. Monohydrate (dumbbell/oval) and dihydrate (envelope/octahedral) forms. Massive calcium oxalate crystalluria: ethylene glycol poisoning (medical emergency). Also increased in hyperoxaluria, inflammatory bowel disease (enteric hyperoxaluria), and high-oxalate diet.",
    difficulty: 1,
    category: "Urinalysis & Body Fluids",
    topic: "Urine Sediment"
  },
  {
    id: "mlt-b12-025",
    stem: "The Westgard 1-3s rule violation indicates:",
    options: ["Acceptable performance", "Random error — a single control value exceeds ±3 SD from the mean, requiring immediate rejection of the run", "Systematic error only", "Need for recalibration only"],
    correctIndex: 1,
    rationale: "1-3s: single QC value exceeds ±3 SD. Probability of occurring by chance: 0.3% (99.7% of values fall within ±3 SD). Indicates random error (large, sudden). Action: reject run, do not report patient results, troubleshoot (sample integrity, reagent, instrument malfunction). Different from 2-2s or 4-1s rules which indicate systematic error.",
    difficulty: 1,
    category: "Laboratory Operations & Quality",
    topic: "Westgard Rules"
  },
  {
    id: "mlt-b12-026",
    stem: "Plasmodium falciparum malaria is distinguished from other Plasmodium species on peripheral blood smear by:",
    options: ["Large trophozoites", "Multiple ring forms per RBC, crescent/banana-shaped gametocytes, and high parasitemia (>5%) — only ring forms typically seen in peripheral blood", "Schüffner dots", "Enlarged infected RBCs"],
    correctIndex: 1,
    rationale: "P. falciparum: multiple ring forms in single RBC (double chromatin dot rings), crescent/banana-shaped gametocytes (pathognomonic), high parasitemia (>5%), RBCs NOT enlarged, no Schüffner dots. Only rings seen peripherally (mature stages sequester in capillaries). Most dangerous species (cerebral malaria). P. vivax: enlarged RBCs, Schüffner dots, ameboid trophozoites.",
    difficulty: 2,
    category: "Parasitology",
    topic: "Blood Parasites"
  },
  {
    id: "mlt-b12-027",
    stem: "A serum sample is hemolyzed. Which analyte will be MOST significantly affected (falsely elevated)?",
    options: ["Sodium", "Potassium — intracellular K+ (150 mEq/L) released from lysed RBCs dramatically elevates serum K+", "Chloride", "BUN"],
    correctIndex: 1,
    rationale: "Hemolysis: RBC lysis releases intracellular contents. K+ is most affected (ICF 150 vs ECF 3.5-5.0 mEq/L = 30-40x gradient). Also falsely elevates: LDH, AST, iron, phosphorus, magnesium. Hemolysis index (HI) measured by automated analyzers flags affected specimens. Most common pre-analytical error in clinical chemistry.",
    difficulty: 1,
    category: "Clinical Chemistry",
    topic: "Pre-analytical Variables"
  },
  {
    id: "mlt-b12-028",
    stem: "CAMP test is used to identify which organism?",
    options: ["Staphylococcus aureus", "Group B Streptococcus (S. agalactiae) — CAMP factor enhances the hemolysis of S. aureus beta-lysin, producing an arrowhead-shaped zone of hemolysis", "Group A Streptococcus", "Listeria monocytogenes"],
    correctIndex: 1,
    rationale: "CAMP test: Group B Strep produces CAMP factor that synergistically enhances the beta-hemolysin of S. aureus. Result: arrowhead-shaped zone of enhanced hemolysis where GBS streak meets S. aureus streak on sheep blood agar. GBS also: hippurate hydrolysis positive, beta-hemolytic, bacitracin resistant. Important: GBS causes neonatal sepsis and meningitis.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Bacteriology"
  },
  {
    id: "mlt-b12-029",
    stem: "Urine bilirubin is normally:",
    options: ["Present in large amounts", "Absent (negative) — conjugated bilirubin is water-soluble and can appear in urine only in liver/biliary disease", "Present in small amounts", "Only present in newborns"],
    correctIndex: 1,
    rationale: "Normal urine: bilirubin is absent. Only conjugated (direct) bilirubin is water-soluble enough to be excreted by kidneys. Positive urine bilirubin: hepatocellular disease (hepatitis), obstructive jaundice (bile duct obstruction). Unconjugated bilirubin is albumin-bound and cannot pass through glomerulus. Urine bilirubin + absent urobilinogen = biliary obstruction.",
    difficulty: 1,
    category: "Urinalysis & Body Fluids",
    topic: "Urine Chemistry"
  },
  {
    id: "mlt-b12-030",
    stem: "The Bethesda System classification HSIL on a Pap smear indicates:",
    options: ["Normal cells", "High-grade squamous intraepithelial lesion — includes CIN 2/CIN 3 and carcinoma in situ, requiring colposcopy and biopsy", "Low-grade changes only", "Reactive changes"],
    correctIndex: 1,
    rationale: "Bethesda System: HSIL includes moderate dysplasia (CIN 2), severe dysplasia (CIN 3), and carcinoma in situ. Cells show high N/C ratio, hyperchromatic nuclei, irregular nuclear membranes, and coarse chromatin. Management: immediate colposcopy with biopsy. LSIL corresponds to CIN 1 (mild dysplasia, often HPV-related, may regress spontaneously).",
    difficulty: 2,
    category: "Cytotechnology",
    topic: "Bethesda System"
  },
  {
    id: "mlt-b12-031",
    stem: "Giardia lamblia cysts are identified by which characteristic feature?",
    options: ["Single nucleus", "Oval shape with 4 nuclei and a distinct median body (median bodies appear as parallel bars)", "Round with 8 nuclei", "Operculated"],
    correctIndex: 1,
    rationale: "Giardia lamblia cysts: oval, 8-12 µm, 4 nuclei, prominent median bodies (bars), axonemes. Trophozoites: pear/teardrop-shaped, 2 nuclei (owl-face appearance), 4 pairs of flagella, ventral sucking disk. Transmission: fecal-oral (contaminated water, daycare). Diagnosis: O&P (may require multiple specimens), DFA, EIA, molecular testing.",
    difficulty: 2,
    category: "Parasitology",
    topic: "Intestinal Protozoa"
  },
  {
    id: "mlt-b12-032",
    stem: "A TSH result of 15 mIU/L (ref 0.4-4.0) with free T4 of 0.5 ng/dL (ref 0.8-1.8) indicates:",
    options: ["Hyperthyroidism", "Primary hypothyroidism — elevated TSH with low free T4 indicates thyroid gland failure", "Secondary hypothyroidism", "Normal thyroid function"],
    correctIndex: 1,
    rationale: "Primary hypothyroidism: thyroid gland failure → low T4 → loss of negative feedback → elevated TSH. Most common cause: Hashimoto thyroiditis (autoimmune). Secondary hypothyroidism: pituitary failure → low TSH + low T4. Hyperthyroidism: suppressed TSH + elevated T4. TSH is the most sensitive screening test for thyroid dysfunction.",
    difficulty: 1,
    category: "Clinical Chemistry",
    topic: "Endocrinology"
  },
  {
    id: "mlt-b12-033",
    stem: "The VDRL and RPR tests for syphilis detect antibodies against:",
    options: ["Treponemal antigens", "Cardiolipin-lecithin-cholesterol antigen (non-treponemal reagin antibodies produced in response to tissue damage)", "Surface proteins of T. pallidum", "Specific treponemal DNA"],
    correctIndex: 1,
    rationale: "VDRL/RPR: non-treponemal tests detecting reagin (IgM and IgG against cardiolipin released from damaged host cells and treponemes). Flocculation reactions. Titer correlates with disease activity. Biologic false positives: SLE, pregnancy, drug use, EBV, hepatitis. Confirm positive results with treponemal tests (FTA-ABS, TP-PA, treponemal EIA).",
    difficulty: 2,
    category: "Immunology / Serology",
    topic: "Syphilis Testing"
  },
  {
    id: "mlt-b12-034",
    stem: "The Wright stain used for peripheral blood smears is a type of:",
    options: ["Acid-fast stain", "Romanowsky stain — a polychromatic stain containing eosin (acidic, stains basic structures orange/red) and methylene blue/azure B (basic, stains acidic structures blue/purple)", "Gram stain", "Fluorescent stain"],
    correctIndex: 1,
    rationale: "Wright stain: Romanowsky-type stain (eosin + methylene blue derivatives). RBCs (basic hemoglobin) stain pink/orange (eosinophilic). WBC nuclei (acidic DNA) stain blue/purple (basophilic). Eosinophil granules (basic proteins) stain orange-red. Basophil granules (acidic GAGs) stain dark blue/purple. pH 6.4 buffer is critical for proper staining.",
    difficulty: 1,
    category: "Hematology",
    topic: "Staining Techniques"
  },
  {
    id: "mlt-b12-035",
    stem: "Serum creatinine is used as a marker of kidney function because:",
    options: ["It is produced only by the kidneys", "It is produced at a constant rate from muscle creatine, freely filtered by glomeruli, and not significantly reabsorbed — making it a reliable marker of GFR", "It is only affected by diet", "It is the most sensitive early marker"],
    correctIndex: 1,
    rationale: "Creatinine: end product of muscle creatine phosphate metabolism. Production is relatively constant (proportional to muscle mass). Freely filtered by glomerulus, not significantly reabsorbed or secreted (small amount of tubular secretion exists). GFR decrease → creatinine rises. Limitation: not sensitive to early CKD (GFR must decrease ~50% before creatinine rises). Cystatin C may detect earlier decline.",
    difficulty: 1,
    category: "Clinical Chemistry",
    topic: "Renal Function"
  },
  {
    id: "mlt-b12-036",
    stem: "An organism tested with the germ tube test produces a true germ tube (no constriction at base) within 2-3 hours. Identification?",
    options: ["Candida tropicalis", "Candida albicans (or C. dubliniensis) — germ tube production (>95% specific for C. albicans) is a rapid, presumptive identification method", "Candida glabrata", "Candida parapsilosis"],
    correctIndex: 1,
    rationale: "Germ tube test: rapid presumptive ID for C. albicans (and C. dubliniensis). Inoculate yeast in serum, incubate 2-3 hours at 37°C. True germ tube: tube-like projection WITHOUT constriction at junction with mother cell. C. albicans also: chlamydospore production on cornmeal-Tween 80 agar, CHROMagar green colonies. C. dubliniensis differentiated by growth at 45°C (negative).",
    difficulty: 1,
    category: "Mycology",
    topic: "Yeast Identification"
  },
  {
    id: "mlt-b12-037",
    stem: "Standard precautions (formerly universal precautions) are applied to:",
    options: ["Only patients known to be infected", "ALL patients regardless of infection status — treating all blood and body fluids as potentially infectious", "Only surgical patients", "Only HIV-positive patients"],
    correctIndex: 1,
    rationale: "Standard precautions: treat ALL blood and body fluids as potentially infectious regardless of diagnosis. Components: hand hygiene, PPE (gloves, gown, mask, eye protection based on anticipated exposure), safe injection practices, sharps safety, respiratory hygiene/cough etiquette. Replaced universal precautions (blood/body fluids only) by adding all body fluids, secretions, excretions.",
    difficulty: 1,
    category: "Laboratory Operations & Quality",
    topic: "Laboratory Safety"
  },
  {
    id: "mlt-b12-038",
    stem: "Hemolytic disease of the fetus and newborn (HDFN) most commonly involves which antibody?",
    options: ["Anti-A", "Anti-D (Rh) — the most clinically significant cause of severe HDFN due to strong immunogenicity of the D antigen", "Anti-M", "Anti-Lewis"],
    correctIndex: 1,
    rationale: "Anti-D: most clinically significant HDFN antibody. D antigen is highly immunogenic. Rh-negative mother exposed to D-positive fetal RBCs → IgG anti-D production → crosses placenta → coats fetal RBCs → hemolysis. Prevention: RhIG (Rh immune globulin) at 28 weeks and within 72 hours of delivery. ABO HDFN (anti-A/anti-B) is common but usually mild.",
    difficulty: 2,
    category: "Immunohematology / Blood Banking",
    topic: "HDFN"
  },
  {
    id: "mlt-b12-039",
    stem: "A POC glucose meter reading of 45 mg/dL in a critically ill patient should be:",
    options: ["Reported as final", "Confirmed with a central laboratory venous plasma glucose before treatment decisions — POC glucose meters have wider analytical imprecision, especially at low values", "Ignored", "Repeated on the same meter"],
    correctIndex: 1,
    rationale: "POC glucose critical values (especially hypoglycemia) should be confirmed by central laboratory testing (venous plasma glucose). POC meters have wider allowable error (±12-15 mg/dL), and factors like hematocrit, interfering substances (acetaminophen, maltose, vitamin C), and oxygen tension can affect accuracy. FDA recommends laboratory confirmation for critical values.",
    difficulty: 2,
    category: "Point-of-Care Testing",
    topic: "POCT Quality"
  },
  {
    id: "mlt-b12-040",
    stem: "The prozone phenomenon in serological testing results in:",
    options: ["Enhanced agglutination", "False-negative results due to antibody excess — too much antibody prevents lattice formation, requiring specimen dilution for accurate detection", "False-positive results", "No effect on results"],
    correctIndex: 1,
    rationale: "Prozone: antibody excess prevents optimal antigen-antibody lattice formation → false-negative or weakly reactive result. Occurs in RPR/VDRL (secondary syphilis with high titer), ABO typing (high-titer antibodies), and other agglutination/precipitation tests. Solution: serial dilutions until optimal antibody-antigen ratio (zone of equivalence) is reached.",
    difficulty: 2,
    category: "Immunology / Serology",
    topic: "Serological Principles"
  },
  {
    id: "mlt-b12-041",
    stem: "Prussian blue stain is used to detect:",
    options: ["Glycogen", "Iron (hemosiderin) deposits in tissue — ferric iron reacts with potassium ferrocyanide to produce blue precipitate", "Collagen", "Amyloid"],
    correctIndex: 1,
    rationale: "Prussian blue (Perls) stain: detects ferric iron (Fe³⁺) in tissues and bone marrow. Potassium ferrocyanide + HCl → ferric iron produces blue precipitate. Used to: assess bone marrow iron stores, identify ring sideroblasts (MDS), detect hemosiderin in tissue (hemochromatosis, hemosiderosis). Also used to stain siderotic granules in RBCs (Pappenheimer bodies).",
    difficulty: 1,
    category: "Histotechnology",
    topic: "Special Stains"
  },
  {
    id: "mlt-b12-042",
    stem: "Enterobius vermicularis (pinworm) diagnosis is BEST made by:",
    options: ["Stool O&P examination", "Scotch tape (cellophane paddle) preparation of the perianal area collected early in the morning before bathing", "Blood smear", "Urine examination"],
    correctIndex: 1,
    rationale: "Pinworm (Enterobius vermicularis): female migrates to perianal area at night to deposit eggs. Scotch tape test (Graham test): apply clear tape to perianal area in the morning before bathing/defecation. Press onto slide and examine microscopically. Eggs: asymmetric/D-shaped (flattened on one side), embryonated. Stool O&P has low sensitivity (<5%) for pinworm.",
    difficulty: 1,
    category: "Parasitology",
    topic: "Helminth Diagnosis"
  },
  {
    id: "mlt-b12-043",
    stem: "Hepatitis B surface antigen (HBsAg) positive with IgM anti-HBc positive indicates:",
    options: ["Chronic infection", "Acute hepatitis B infection — IgM anti-HBc is the hallmark of acute infection, present during the window period when HBsAg may become undetectable", "Immunity from vaccination", "Past resolved infection"],
    correctIndex: 1,
    rationale: "Acute HBV infection: HBsAg+ (first marker), IgM anti-HBc+ (hallmark of acute infection, present during window period). Window period: HBsAg negative, anti-HBs not yet positive → IgM anti-HBc is the ONLY marker. Chronic infection: HBsAg+ >6 months, IgG anti-HBc+. Immunity from vaccination: anti-HBs+ only. Resolved infection: anti-HBs+, IgG anti-HBc+.",
    difficulty: 2,
    category: "Virology",
    topic: "Hepatitis Serology"
  },
  {
    id: "mlt-b12-044",
    stem: "A serous fluid specimen has a fluid/serum protein ratio of 0.6 and a fluid/serum LDH ratio of 0.7. Using Light's criteria, this is classified as:",
    options: ["Transudate", "Exudate — meets Light's criteria (protein ratio >0.5 AND/OR LDH ratio >0.6, or fluid LDH >2/3 upper limit of normal)", "Neither", "Indeterminate"],
    correctIndex: 1,
    rationale: "Light's criteria for exudate (any 1 of 3): (1) fluid/serum protein >0.5 (met: 0.6), (2) fluid/serum LDH >0.6 (met: 0.7), (3) fluid LDH >2/3 upper limit of normal serum LDH. This specimen meets criteria 1 AND 2 = definitive exudate. Exudate causes: infection, malignancy, inflammation, PE. Transudate: CHF, cirrhosis, nephrotic syndrome.",
    difficulty: 2,
    category: "Urinalysis & Body Fluids",
    topic: "Serous Fluids"
  },
  {
    id: "mlt-b12-045",
    stem: "Which organism produces an 'alpha-prime' (wide zone of alpha) hemolysis pattern and is PYR positive?",
    options: ["Streptococcus pneumoniae", "Enterococcus species — alpha, beta, or gamma hemolysis possible; PYR positive, bile esculin positive, growth in 6.5% NaCl", "Group A Streptococcus", "Viridans streptococci"],
    correctIndex: 1,
    rationale: "Enterococcus: gram-positive cocci in pairs/chains, PYR positive, bile esculin positive (blackening), grows in 6.5% NaCl (differentiates from Group D Strep which is BE+ but NaCl−). Variable hemolysis. Most common: E. faecalis (85-90%), E. faecium (5-10%). Intrinsic resistance to cephalosporins, clindamycin. VRE: vancomycin-resistant enterococci (hospital-acquired).",
    difficulty: 2,
    category: "Microbiology",
    topic: "Bacteriology"
  },
  {
    id: "mlt-b12-046",
    stem: "Serum AST 500 IU/L, ALT 800 IU/L, ALP 120 IU/L (mildly elevated), total bilirubin 5.0 mg/dL. This pattern suggests:",
    options: ["Biliary obstruction", "Hepatocellular injury (hepatitis) — AST and ALT dramatically elevated with only mild ALP elevation indicates hepatocyte damage rather than cholestasis", "Normal liver function", "Bone disease"],
    correctIndex: 1,
    rationale: "Hepatocellular pattern: AST/ALT markedly elevated (>10x ULN), ALP mildly elevated or normal. Causes: viral hepatitis, drug/toxin-induced hepatitis, ischemic hepatitis. Cholestatic pattern: ALP markedly elevated (>3x ULN), AST/ALT mildly elevated. ALT is more liver-specific than AST. AST/ALT ratio >2 suggests alcoholic hepatitis (alcohol induces mitochondrial AST).",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Liver Function Tests"
  },
  {
    id: "mlt-b12-047",
    stem: "The Kidd blood group system (Jka/Jkb) antibodies are clinically significant because they:",
    options: ["Never cause hemolysis", "Characteristically show dosage, are notoriously difficult to detect (evanescent/disappearing antibodies), and cause delayed hemolytic transfusion reactions", "Only cause acute reactions", "Are always IgM"],
    correctIndex: 1,
    rationale: "Kidd antibodies (anti-Jka, anti-Jkb): clinically significant IgG antibodies that activate complement. Known for: dosage effect (stronger reactions with homozygous cells), rapid titer decline to undetectable levels (evanescent), and causing delayed hemolytic transfusion reactions upon re-exposure. Enhanced by enzyme treatment and LISS. Mnemonic: Kidd kills, Kidd kidneys (associated with renal failure).",
    difficulty: 3,
    category: "Immunohematology / Blood Banking",
    topic: "Blood Group Systems"
  },
  {
    id: "mlt-b12-048",
    stem: "Creatine kinase (CK) isoenzymes and their tissue sources: CK-MB is found predominantly in:",
    options: ["Skeletal muscle", "Cardiac muscle (heart) — CK-MB comprises 20-30% of total cardiac CK, making it useful for myocardial injury detection", "Brain", "Liver"],
    correctIndex: 1,
    rationale: "CK isoenzymes: CK-MM (skeletal muscle, 95-100% of serum CK), CK-MB (cardiac muscle, 20-30% of cardiac CK), CK-BB (brain, smooth muscle — rarely in serum). Elevated CK-MB: acute MI, cardiac surgery, myocarditis. CK-MB index >5% suggests cardiac source. Now largely replaced by troponin (more specific and sensitive). Macro-CK can cause falsely elevated CK-MB.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Cardiac Biomarkers"
  },
  {
    id: "mlt-b12-049",
    stem: "The India ink preparation is used for rapid detection of which organism in CSF?",
    options: ["Mycobacterium tuberculosis", "Cryptococcus neoformans — encapsulated yeast with prominent capsule visible as clear halo against dark ink background", "Neisseria meningitidis", "Listeria monocytogenes"],
    correctIndex: 1,
    rationale: "India ink: negative staining technique. Cryptococcus neoformans capsule excludes ink particles → yeast appears as clear halo against dark background. Sensitivity is low (30-50%); cryptococcal antigen (CrAg) lateral flow assay is more sensitive (>95%) and is the preferred diagnostic test. Mucicarmine stain highlights capsule in tissue. Culture on Sabouraud agar at 30-37°C.",
    difficulty: 1,
    category: "Mycology",
    topic: "Yeast Identification"
  },
  {
    id: "mlt-b12-050",
    stem: "In a mixing study, a prolonged aPTT that corrects to normal when mixed 1:1 with normal plasma indicates:",
    options: ["Inhibitor present", "Factor deficiency — the normal plasma provides the missing factor, correcting the aPTT. An inhibitor (e.g., lupus anticoagulant) would NOT correct", "Heparin contamination", "DIC"],
    correctIndex: 1,
    rationale: "Mixing study interpretation: (1) Corrects to normal = factor deficiency (normal plasma provides missing factor). Pursue specific factor assays. (2) Does NOT correct = inhibitor present (antibody neutralizes factor in normal plasma too). Types: specific inhibitors (anti-Factor VIII in hemophilia) or non-specific (lupus anticoagulant). Time-dependent inhibitors (Factor VIII) may show correction at 0 min but prolongation after 2-hour incubation.",
    difficulty: 2,
    category: "Hemostasis / Coagulation",
    topic: "Coagulation Testing"
  },
  {
    id: "mlt-b12-051",
    stem: "Frozen section (cryostat) in histotechnology is used primarily for:",
    options: ["Routine processing", "Rapid intraoperative diagnosis — tissue is frozen, sectioned at -20°C, and stained with H&E within 15-20 minutes to guide surgical decisions", "Special stains only", "Electron microscopy"],
    correctIndex: 1,
    rationale: "Frozen section: rapid intraoperative consultation. Tissue snap-frozen in OCT medium, sectioned at -20°C in cryostat, stained H&E or toluidine blue. Results in 15-20 minutes. Uses: tumor margin assessment, presence/absence of malignancy, lymph node involvement. Limitations: ice crystal artifact, poorer morphology than paraffin sections. Also required for lipid stains (Oil Red O).",
    difficulty: 1,
    category: "Histotechnology",
    topic: "Tissue Processing"
  },
  {
    id: "mlt-b12-052",
    stem: "Schistocytes (fragmented red blood cells) on a peripheral blood smear are MOST commonly associated with:",
    options: ["Iron deficiency", "Microangiopathic hemolytic anemia (MAHA) — mechanical fragmentation of RBCs in damaged microvasculature (TTP, HUS, DIC, prosthetic heart valves)", "B12 deficiency", "Sickle cell disease"],
    correctIndex: 1,
    rationale: "Schistocytes: helmet cells, triangular fragments, small irregular fragments. Caused by mechanical shearing of RBCs through damaged/obstructed microvasculature. MAHA causes: TTP (ADAMTS13 deficiency), HUS (Shiga toxin), DIC, HELLP syndrome, malignant hypertension, prosthetic heart valves. >1% schistocytes on smear with anemia and thrombocytopenia = consider TMA.",
    difficulty: 2,
    category: "Hematology",
    topic: "RBC Morphology"
  },
  {
    id: "mlt-b12-053",
    stem: "Which immunoglobulin class crosses the placenta?",
    options: ["IgM", "IgG — the only immunoglobulin that crosses the placenta via FcRn receptor, providing passive immunity to the newborn", "IgA", "IgE"],
    correctIndex: 1,
    rationale: "IgG: smallest Ig, longest half-life (23 days), crosses placenta (FcRn-mediated transport), provides passive immunity for first 3-6 months of life. IgM: pentamer, largest, first antibody in primary immune response, does NOT cross placenta (detection of IgM in neonate = congenital infection: TORCH). IgA: secretory, mucosal immunity. IgE: allergic reactions, parasites.",
    difficulty: 1,
    category: "Immunology / Serology",
    topic: "Immunoglobulin Classes"
  },
  {
    id: "mlt-b12-054",
    stem: "A bone marrow aspirate stained with Prussian blue shows ringed sideroblasts (>5 iron granules encircling >1/3 of the nucleus). This is characteristic of:",
    options: ["Iron deficiency anemia", "Myelodysplastic syndrome with ring sideroblasts (MDS-RS) — iron accumulates in perinuclear mitochondria due to defective heme synthesis", "Thalassemia major", "Aplastic anemia"],
    correctIndex: 1,
    rationale: "Ring sideroblasts: iron-laden mitochondria encircling the nucleus (≥5 granules, ≥1/3 circumference). Pathologic accumulation due to defective incorporation of iron into heme (mitochondrial iron overload). MDS-RS: SF3B1 mutation (>80% of cases), relatively favorable prognosis. Also seen in congenital sideroblastic anemia, lead poisoning, isoniazid, alcohol.",
    difficulty: 3,
    category: "Hematology",
    topic: "Bone Marrow"
  },
  {
    id: "mlt-b12-055",
    stem: "C. difficile infection is BEST diagnosed by:",
    options: ["Stool culture only", "Nucleic acid amplification test (NAAT/PCR) for toxin gene detection, or a multi-step algorithm: GDH screen followed by toxin EIA, with NAAT for discordant results", "Gram stain of stool", "Blood culture"],
    correctIndex: 1,
    rationale: "C. difficile diagnosis: (1) NAAT/PCR for toxin B gene (tcdB) — most sensitive single test. (2) Multi-step algorithm: GDH (glutamate dehydrogenase) screen (sensitive) → positive GDH → toxin A/B EIA (specific) → discordant results → NAAT. Only test formed/liquid stool. Do not test: formed stool, test of cure, patients <2 years. Toxigenic culture is reference method but slow.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Anaerobic Bacteriology"
  },
  {
    id: "mlt-b12-056",
    stem: "A blood gas analyzer measures pH, pCO2, and pO2 directly. All other values (HCO3, base excess, O2 saturation) are:",
    options: ["Directly measured", "Calculated from the measured pH and pCO2 using the Henderson-Hasselbalch equation and algorithms", "Estimated from patient history", "Measured by a separate instrument"],
    correctIndex: 1,
    rationale: "Blood gas analyzers directly measure: pH (glass electrode), pCO2 (Severinghaus electrode), pO2 (Clark electrode). Calculated values: HCO3 (Henderson-Hasselbalch), base excess (nomogram), O2 saturation (ODC algorithm). CO-oximeters directly measure: total Hgb, O2Hb, COHb, MetHb, deoxyHb by spectrophotometry at multiple wavelengths.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Blood Gas Analysis"
  },
  {
    id: "mlt-b12-057",
    stem: "Antinuclear antibody (ANA) testing by indirect immunofluorescence (IIF) showing a homogeneous pattern is associated with:",
    options: ["Limited scleroderma", "SLE (systemic lupus erythematosus) — anti-dsDNA and anti-histone antibodies produce a homogeneous (diffuse) nuclear staining pattern", "Sjögren syndrome", "Polymyositis"],
    correctIndex: 1,
    rationale: "ANA IIF patterns and associations: Homogeneous (diffuse): anti-dsDNA, anti-histone → SLE, drug-induced lupus. Speckled: anti-Sm, anti-RNP, anti-SSA/SSB → SLE, Sjögren, MCTD. Nucleolar: anti-RNA polymerase → scleroderma. Centromere: anti-centromere → limited scleroderma (CREST). ANA screen by IIF is more sensitive than ELISA.",
    difficulty: 2,
    category: "Immunology / Serology",
    topic: "Autoimmune Testing"
  },
  {
    id: "mlt-b12-058",
    stem: "What is the maximum time blood can remain at room temperature before being returned to the blood bank for reissue?",
    options: ["1 hour", "30 minutes — RBC units must not exceed 30 minutes out of controlled storage (1-6°C) to be eligible for reissue", "2 hours", "4 hours"],
    correctIndex: 1,
    rationale: "30-minute rule: RBCs must not be out of controlled 1-6°C storage for >30 minutes to be reissued. After 30 minutes at room temperature, bacterial growth risk increases. If not transfused within 30 minutes of leaving the blood bank, the unit must be transfused or discarded. Once transfusion begins, it must be completed within 4 hours.",
    difficulty: 2,
    category: "Immunohematology / Blood Banking",
    topic: "Blood Product Storage"
  },
  {
    id: "mlt-b12-059",
    stem: "The Levey-Jennings chart plots QC data against:",
    options: ["Patient results", "Time (x-axis) and control values in SD units from the established mean (y-axis) — providing visual trend analysis for QC performance", "Reagent lot numbers", "Calibrator values"],
    correctIndex: 1,
    rationale: "Levey-Jennings chart: x-axis = time/run number, y-axis = QC values (with mean and ±1, 2, 3 SD lines). Allows visual identification of: shifts (6+ consecutive values on one side of mean), trends (6+ consecutive values moving in one direction), random errors (outliers). Westgard multi-rules are applied to L-J chart data for objective QC acceptance/rejection decisions.",
    difficulty: 1,
    category: "Laboratory Operations & Quality",
    topic: "Quality Control"
  },
  {
    id: "mlt-b12-060",
    stem: "Dermatophyte infections (tinea) are caused by which fungal genera?",
    options: ["Candida and Aspergillus", "Trichophyton, Microsporum, and Epidermophyton — keratinophilic molds that infect skin, hair, and nails", "Histoplasma and Blastomyces", "Mucor and Rhizopus"],
    correctIndex: 1,
    rationale: "Dermatophytes: keratinophilic fungi infecting keratinized tissue only (skin, hair, nails). Three genera: Trichophyton (most common, infects skin/hair/nails), Microsporum (hair/skin, Wood's lamp fluorescence), Epidermophyton (skin/nails only). Identified by colony morphology and microscopic features (macroconidia shape). T. rubrum: most common worldwide cause of dermatophytosis.",
    difficulty: 1,
    category: "Mycology",
    topic: "Dermatophytes"
  },
  {
    id: "mlt-b12-061",
    stem: "A patient's WBC differential shows: Segs 25%, Bands 10%, Lymphocytes 55%, Monocytes 8%, Eosinophils 2%. WBC 3,500/µL. The ANC is:",
    options: ["1,925/µL", "1,225/µL — ANC = WBC × (% segs + % bands)/100 = 3,500 × (25+10)/100 = moderate neutropenia", "875/µL", "3,500/µL"],
    correctIndex: 1,
    rationale: "ANC = WBC × (% segs + % bands)/100 = 3,500 × (25 + 10)/100 = 3,500 × 0.35 = 1,225/µL. This is moderate neutropenia (1,000-1,500). The absolute lymphocyte count is elevated (55% × 3,500 = 1,925/µL), which may indicate viral infection as the cause of the relative lymphocytosis and neutropenia.",
    difficulty: 1,
    category: "Hematology",
    topic: "WBC Differential"
  },
  {
    id: "mlt-b12-062",
    stem: "Hemolysis in vitro (during blood collection) can be caused by all of the following EXCEPT:",
    options: ["Using too small a needle gauge with vigorous aspiration", "Mixing the tube by gentle inversion 8-10 times as recommended", "Forcing blood through the needle into the tube", "Drawing from a hematoma site"],
    correctIndex: 1,
    rationale: "Proper mixing (gentle inversion 8-10 times) does NOT cause hemolysis. Causes of in vitro hemolysis: small gauge needle (high shear force), vigorous aspiration or syringe force, vigorous shaking/mixing, prolonged tourniquet time, drawing from hematoma, wet alcohol on skin not dried before venipuncture, tube under/overfilling. Hemolysis is the #1 cause of specimen rejection.",
    difficulty: 1,
    category: "Phlebotomy & Specimen Collection",
    topic: "Pre-analytical Errors"
  },
  {
    id: "mlt-b12-063",
    stem: "The HIV screening algorithm recommended by CDC/APHL begins with:",
    options: ["Western blot", "4th generation HIV-1/2 Ag/Ab combination immunoassay (detects both HIV antibodies and p24 antigen, reducing the window period to ~2 weeks)", "Rapid HIV test only", "PCR viral load"],
    correctIndex: 1,
    rationale: "Updated HIV algorithm (CDC/APHL): (1) 4th gen Ag/Ab combination assay (detects p24 Ag + HIV-1/2 antibodies). (2) If reactive: HIV-1/HIV-2 antibody differentiation immunoassay. (3) If indeterminate/negative differentiation: HIV-1 NAT (RNA). This algorithm detects acute infection (p24 antigen present before antibody seroconversion). Western blot is no longer recommended for confirmation.",
    difficulty: 2,
    category: "Virology",
    topic: "HIV Testing"
  },
  {
    id: "mlt-b12-064",
    stem: "Masson trichrome stain is used to detect:",
    options: ["Iron", "Collagen (fibrosis) — collagen stains blue/green, muscle fibers stain red, nuclei stain dark brown/black", "Glycogen", "Mucin"],
    correctIndex: 1,
    rationale: "Masson trichrome: differential stain for connective tissue. Collagen: blue (or green depending on variant). Muscle fibers (cytoplasm): red. Nuclei: dark brown/black. Used to: assess degree of fibrosis (liver fibrosis staging, renal fibrosis, cardiac fibrosis), identify collagen in tumors, distinguish smooth muscle tumors from fibrous tumors.",
    difficulty: 1,
    category: "Histotechnology",
    topic: "Special Stains"
  },
  {
    id: "mlt-b12-065",
    stem: "Ion-selective electrodes (ISEs) are used to measure electrolytes. The principle is based on:",
    options: ["Color change", "Nernst equation — the potential difference across a selective membrane is proportional to the logarithm of the ion activity in the sample", "Light absorbance", "Fluorescence emission"],
    correctIndex: 1,
    rationale: "ISEs: potentiometric measurement. Ion-selective membrane generates a potential proportional to ion activity (not concentration). Nernst equation relates potential to ion activity. Types: glass (Na+, pH), valinomycin (K+), liquid membrane (Ca²+, Cl−). Direct ISE (undiluted sample, POC analyzers): measures activity directly. Indirect ISE (diluted, central analyzers): affected by protein/lipid (pseudohyponatremia).",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Instrumentation"
  },
  {
    id: "mlt-b12-066",
    stem: "Howell-Jolly bodies seen on a peripheral blood smear are:",
    options: ["RNA remnants", "Nuclear remnants (DNA fragments) in RBCs — normally removed by the spleen; their presence indicates functional asplenia or post-splenectomy state", "Iron granules", "Hemoglobin precipitates"],
    correctIndex: 1,
    rationale: "Howell-Jolly bodies: small, round, dense basophilic inclusions (DNA remnants from nuclear fragmentation). Normally removed by splenic pitting function. Presence indicates: post-splenectomy, functional asplenia (sickle cell disease autosplenectomy), congenital asplenia. Other post-splenectomy findings: target cells, acanthocytes, Pappenheimer bodies, increased platelet count.",
    difficulty: 1,
    category: "Hematology",
    topic: "RBC Inclusions"
  },
  {
    id: "mlt-b12-067",
    stem: "Antibody screening (indirect antiglobulin test) detects:",
    options: ["ABO antibodies", "Unexpected (non-ABO) antibodies in patient serum/plasma that may cause hemolytic transfusion reactions — tested against type O reagent screening cells with known antigen profiles", "Bacterial antibodies", "Platelet antibodies"],
    correctIndex: 1,
    rationale: "IAT (antibody screen): detects unexpected IgG antibodies in patient serum. Patient serum + type O screening cells (known antigen profile, 2-3 cells) → incubate → wash → add AHG → agglutination = positive (unexpected antibody present). If positive: antibody identification panel (11+ cells) determines specificity. Pre-transfusion and prenatal testing requirement.",
    difficulty: 2,
    category: "Immunohematology / Blood Banking",
    topic: "Antibody Detection"
  },
  {
    id: "mlt-b12-068",
    stem: "Aspergillus fumigatus in tissue shows:",
    options: ["Wide, ribbon-like, pauci-septate hyphae", "Narrow (3-6 µm), septate hyphae with 45° dichotomous (Y-shaped) branching — contrast with Mucorales which show wide, pauci-septate hyphae with 90° branching", "Yeast cells only", "Spherules with endospores"],
    correctIndex: 1,
    rationale: "Aspergillus tissue morphology: narrow (3-6 µm), septate, dichotomous (45°) branching hyphae. Culture: rapidly growing mold, blue-green colonies (A. fumigatus), uniseriate conidial heads. Galactomannan antigen: serum biomarker for invasive aspergillosis. BDG (1,3-beta-D-glucan): elevated in most invasive fungal infections (not Mucorales or Cryptococccus). Thermotolerant (grows at 45°C).",
    difficulty: 2,
    category: "Mycology",
    topic: "Mold Identification"
  },
  {
    id: "mlt-b12-069",
    stem: "An elevated reticulocyte count in the setting of anemia indicates:",
    options: ["Bone marrow failure", "Appropriate bone marrow response to peripheral red cell destruction or blood loss — the marrow is actively producing new RBCs", "Aplastic anemia", "Myelodysplastic syndrome"],
    correctIndex: 1,
    rationale: "Elevated reticulocyte count (reticulocytosis): appropriate marrow response to anemia from hemolysis (autoimmune, mechanical, hereditary) or acute blood loss. The marrow is releasing immature RBCs (reticulocytes with residual RNA, stained with supravital dye) to compensate. Low reticulocyte count with anemia = inadequate response (aplastic anemia, B12/folate deficiency, iron deficiency, MDS).",
    difficulty: 1,
    category: "Hematology",
    topic: "Reticulocyte Count"
  },
  {
    id: "mlt-b12-070",
    stem: "The GMS (Grocott methenamine silver) stain is used to detect:",
    options: ["Collagen", "Fungal organisms — fungal cell walls stain black/dark brown against a green counterstain background", "Iron", "Acid-fast organisms"],
    correctIndex: 1,
    rationale: "GMS stain: silver-based stain for fungal organisms. Fungal cell walls contain polysaccharides (glucan, chitin) that are oxidized → react with silver → black/dark brown. Background: light green counterstain. Stains ALL fungi (yeasts and molds). Also stains Pneumocystis jirovecii cysts. More sensitive than PAS for fungi in tissue. Used on tissue sections and cytology specimens.",
    difficulty: 1,
    category: "Histotechnology",
    topic: "Special Stains"
  },
  {
    id: "mlt-b12-071",
    stem: "Celiac disease screening typically includes which serological test?",
    options: ["ANA", "Tissue transglutaminase IgA (tTG-IgA) — highly sensitive and specific for celiac disease, must also check total IgA to rule out IgA deficiency", "Anti-CCP", "RF (rheumatoid factor)"],
    correctIndex: 1,
    rationale: "Celiac disease serology: tTG-IgA is first-line screening (sensitivity >95%, specificity >95%). Must measure total IgA simultaneously (2-3% of celiac patients have selective IgA deficiency → false-negative tTG-IgA). If IgA deficient: use IgG-based tests (DGP-IgG, tTG-IgG). Endomysial antibody (EMA-IgA): confirmatory, very specific. Gold standard: small bowel biopsy (villous atrophy).",
    difficulty: 2,
    category: "Immunology / Serology",
    topic: "Autoimmune Testing"
  },
  {
    id: "mlt-b12-072",
    stem: "The minimum volume of blood for a blood culture set in adults is:",
    options: ["1 mL", "20-30 mL (10 mL per bottle × 2-3 bottles per set) — blood volume is the single most important variable affecting blood culture sensitivity", "5 mL total", "50 mL"],
    correctIndex: 1,
    rationale: "Blood culture volume: single most important factor for detection. Adults: 20-30 mL per set (10 mL per bottle, 2 bottles: aerobic + anaerobic). Optimal: 2 sets from 2 different sites before antibiotics. Each mL of blood increases detection by 3-5%. Underfilling significantly reduces sensitivity. Pediatric volumes are weight-based and lower. Fill aerobic bottle first if volume is limited.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Specimen Collection"
  },
  {
    id: "mlt-b12-073",
    stem: "Specimen rejection criteria for coagulation testing include:",
    options: ["Room temperature transport", "Hemolyzed specimens, clotted specimens, incorrect blood-to-anticoagulant ratio (underfilled or overfilled citrate tubes), and specimens not tested within 4 hours", "Specimens collected from IV arm with proper waste", "Slightly lipemic specimens"],
    correctIndex: 1,
    rationale: "Coagulation specimen rejection: clotted (coagulation factors consumed), hemolyzed (phospholipids interfere with clot-based assays), incorrect fill (<90% = prolonged results; >110% = shortened results), >4 hours old at RT for PT/aPTT (labile factors V, VIII degrade). 9:1 blood-to-citrate ratio is critical. Light blue top (3.2% sodium citrate). First or second tube in order of draw.",
    difficulty: 2,
    category: "Phlebotomy & Specimen Collection",
    topic: "Specimen Rejection"
  },
  {
    id: "mlt-b12-074",
    stem: "A CSF cell count shows 500 WBCs/µL with 90% neutrophils, protein 200 mg/dL, glucose 20 mg/dL (blood glucose 100 mg/dL). This pattern is MOST consistent with:",
    options: ["Viral meningitis", "Bacterial meningitis — high WBC with neutrophilic predominance, markedly elevated protein, and very low glucose (CSF/serum ratio 0.2) is classic", "Normal CSF", "Multiple sclerosis"],
    correctIndex: 1,
    rationale: "Bacterial meningitis CSF: WBC 1,000-10,000/µL (neutrophils >80%), protein >100 mg/dL, glucose <40 mg/dL or CSF/serum glucose <0.4, positive Gram stain (60-90%), culture positive. Viral meningitis: WBC 10-500 (lymphocytes), normal glucose, mildly elevated protein. TB/fungal: WBC 50-500 (lymphocytes), low glucose, very high protein. Opening pressure also elevated in bacterial meningitis.",
    difficulty: 2,
    category: "Urinalysis & Body Fluids",
    topic: "CSF Analysis"
  },
  {
    id: "mlt-b12-075",
    stem: "Troponin I or T is preferred over CK-MB for acute MI diagnosis because:",
    options: ["It is cheaper", "It is more cardiac-specific (not found in skeletal muscle in significant amounts), more sensitive (detects smaller infarcts), and remains elevated longer (7-14 days)", "It rises faster", "It is easier to measure"],
    correctIndex: 1,
    rationale: "Troponin advantages over CK-MB: (1) Higher cardiac specificity (cTnI is cardiac-only; CK-MB is also in skeletal muscle at ~2%). (2) Higher sensitivity with hs-troponin assays (detect microinfarction). (3) Wider diagnostic window (elevated 7-14 days vs CK-MB 2-3 days). (4) WHO/ESC universal definition of MI requires troponin rise/fall. CK-MB still useful for re-infarction detection.",
    difficulty: 1,
    category: "Clinical Chemistry",
    topic: "Cardiac Biomarkers"
  },
  {
    id: "mlt-b12-076",
    stem: "Babesia microti in a blood smear can be distinguished from Plasmodium falciparum by:",
    options: ["Ring forms only", "Absence of pigment (hemozoin), presence of tetrad forms (Maltese cross), and extracellular organisms — Babesia does not produce pigment unlike Plasmodium", "Banana-shaped gametocytes", "Schüffner dots"],
    correctIndex: 1,
    rationale: "Babesia vs. Plasmodium: Babesia has NO hemozoin pigment, forms tetrads (Maltese cross, pathognomonic), has extracellular organisms, no gametocytes, and has variable ring morphology. Plasmodium has hemozoin pigment, no tetrads, gametocytes. Both have ring forms that can look similar. Babesia is tick-borne (Ixodes), diagnosed by PCR, smear, or serology.",
    difficulty: 3,
    category: "Parasitology",
    topic: "Blood Parasites"
  },
  {
    id: "mlt-b12-077",
    stem: "Serum protein electrophoresis (SPE) showing a narrow, tall spike in the gamma region (M-spike) suggests:",
    options: ["Chronic infection", "Monoclonal gammopathy — a single clone of plasma cells producing identical immunoglobulin (multiple myeloma, MGUS, or Waldenström macroglobulinemia)", "Normal pattern", "Iron deficiency"],
    correctIndex: 1,
    rationale: "Monoclonal spike (M-spike): narrow, tall peak in gamma (or occasionally beta-gamma) region = single immunoglobulin from one plasma cell clone. Causes: MGUS (most common, benign), multiple myeloma, Waldenström macroglobulinemia (IgM), primary amyloidosis. Quantify by densitometry. Confirm with immunofixation electrophoresis (IFE) to determine heavy and light chain type.",
    difficulty: 2,
    category: "Immunology / Serology",
    topic: "Protein Electrophoresis"
  },
  {
    id: "mlt-b12-078",
    stem: "The tourniquet during venipuncture should not be left on for more than:",
    options: ["30 seconds", "1 minute — prolonged tourniquet application causes hemoconcentration, falsely elevating proteins, cholesterol, calcium, and potassium", "5 minutes", "10 minutes"],
    correctIndex: 1,
    rationale: "Tourniquet time: <1 minute recommended. Prolonged tourniquet (>1 min): hemoconcentration (water/small molecules leave vasculature → large molecules concentrate) → falsely elevated: total protein, albumin, cholesterol, calcium, enzymes, cellular elements. Also: localized hypoxia → increased lactate, decreased pH. Release tourniquet as soon as blood flow is established.",
    difficulty: 1,
    category: "Phlebotomy & Specimen Collection",
    topic: "Venipuncture Technique"
  },
  {
    id: "mlt-b12-079",
    stem: "Which body fluid must be analyzed within 1 hour of collection to prevent cellular deterioration?",
    options: ["Urine", "Cerebrospinal fluid (CSF) — WBCs (especially neutrophils) lyse rapidly in CSF due to low protein content and hypotonic environment", "Pleural fluid", "Synovial fluid"],
    correctIndex: 1,
    rationale: "CSF: analyze within 1 hour (ideally 30 minutes). WBCs (especially neutrophils) lyse rapidly in CSF due to: low protein (no protective protein coat), relatively hypotonic environment, absence of nutrients. Cell count decreases 30-50% within 2 hours. If delay is unavoidable, refrigerate for chemistry/micro but analyze cell count immediately. CSF glucose decreases with delay (glycolysis).",
    difficulty: 2,
    category: "Urinalysis & Body Fluids",
    topic: "Specimen Handling"
  },
  {
    id: "mlt-b12-080",
    stem: "Direct oral anticoagulants (DOACs) such as rivaroxaban and apixaban inhibit:",
    options: ["Thrombin only", "Factor Xa — direct factor Xa inhibitors prevent conversion of prothrombin to thrombin", "Vitamin K", "Platelet aggregation"],
    correctIndex: 1,
    rationale: "DOACs: rivaroxaban, apixaban, edoxaban = direct factor Xa inhibitors. Dabigatran = direct thrombin (IIa) inhibitor. DOACs affect PT and aPTT variably (assay-dependent). Anti-Xa assay (calibrated for specific DOAC) is the preferred method for monitoring levels. Advantages over warfarin: fixed dosing, no routine monitoring, fewer food/drug interactions. Reversal: andexanet alfa (Xa inhibitors), idarucizumab (dabigatran).",
    difficulty: 2,
    category: "Hemostasis / Coagulation",
    topic: "Anticoagulant Monitoring"
  },
  {
    id: "mlt-b12-081",
    stem: "A positive heterophile antibody test (Monospot) in a patient with pharyngitis, lymphadenopathy, and atypical lymphocytes is diagnostic for:",
    options: ["HIV", "Infectious mononucleosis caused by Epstein-Barr virus (EBV)", "CMV infection", "Toxoplasmosis"],
    correctIndex: 1,
    rationale: "Monospot: rapid qualitative test for heterophile antibodies (IgM that agglutinate horse/sheep RBCs). Present in ~85% of EBV mononucleosis. Classic triad: pharyngitis + lymphadenopathy + fever + atypical lymphocytes (activated CD8 T cells, >10%). False negatives in children <4 years. If Monospot negative but clinically suspected: EBV-specific antibodies (VCA-IgM, VCA-IgG, EBNA, EA).",
    difficulty: 1,
    category: "Virology",
    topic: "EBV Serology"
  },
  {
    id: "mlt-b12-082",
    stem: "The most common inherited bleeding disorder is:",
    options: ["Hemophilia A", "Von Willebrand disease (vWD) — affects 1% of the population; vWF mediates platelet adhesion and stabilizes factor VIII", "Hemophilia B", "Factor V Leiden"],
    correctIndex: 1,
    rationale: "Von Willebrand disease: prevalence ~1% (most common inherited bleeding disorder). vWF functions: (1) mediates platelet adhesion to subendothelium via GPIb, (2) stabilizes factor VIII (carrier protein, protects from degradation). Type 1 (80%): quantitative decrease. Type 2 (15-20%): qualitative defect (subtypes 2A, 2B, 2M, 2N). Type 3 (<5%): severe, virtually absent vWF.",
    difficulty: 1,
    category: "Hemostasis / Coagulation",
    topic: "Bleeding Disorders"
  },
  {
    id: "mlt-b12-083",
    stem: "Strongyloides stercoralis is unique among helminths because it can:",
    options: ["Only infect the liver", "Complete its life cycle within the human host (autoinfection), leading to hyperinfection in immunosuppressed patients", "Only be diagnosed by blood smear", "Be transmitted by ingestion only"],
    correctIndex: 1,
    rationale: "Strongyloides stercoralis: unique autoinfection cycle. Rhabditiform larvae can transform to filariform larvae within the intestine → penetrate intestinal mucosa or perianal skin → reinfect the host. In immunosuppressed patients (especially corticosteroid use): hyperinfection syndrome with massive larval dissemination (lungs, CNS, liver) → potentially fatal. Diagnosed by stool (larvae, NOT eggs), serology, or agar plate culture.",
    difficulty: 3,
    category: "Parasitology",
    topic: "Intestinal Helminths"
  },
  {
    id: "mlt-b12-084",
    stem: "Which chromogenic substrate is used in automated coagulation analyzers using the amidolytic (chromogenic) method?",
    options: ["ONPG", "para-Nitroaniline (pNA) — released from a synthetic peptide substrate when cleaved by the target serine protease, producing a yellow color measured at 405 nm", "NBT", "TMB"],
    correctIndex: 1,
    rationale: "Chromogenic (amidolytic) assays: synthetic peptide substrate linked to pNA (chromophore). Target protease cleaves substrate → releases free pNA → yellow color measured at 405 nm. Rate of color change proportional to enzyme activity. Used for: antithrombin, protein C, heparin (anti-Xa), plasminogen, and individual factor assays. More specific than clot-based methods.",
    difficulty: 3,
    category: "Hemostasis / Coagulation",
    topic: "Instrumentation"
  },
  {
    id: "mlt-b12-085",
    stem: "Which fixative is the gold standard for routine histological tissue processing?",
    options: ["Bouin fixative", "10% neutral buffered formalin (NBF) — 4% formaldehyde in phosphate buffer, provides excellent morphology preservation and is compatible with most stains and IHC", "Glutaraldehyde", "Carnoy fixative"],
    correctIndex: 1,
    rationale: "10% NBF: standard fixative for surgical pathology. Contains 4% formaldehyde (10% of stock 37-40% formalin) in phosphate buffer pH 7.0. Cross-links proteins (methylene bridges). Fixation time: 6-72 hours depending on tissue size (1 mm/hour penetration). Compatible with H&E, most special stains, and IHC (with antigen retrieval). Disadvantage: requires antigen retrieval for many IHC antibodies.",
    difficulty: 1,
    category: "Histotechnology",
    topic: "Tissue Fixation"
  },
  {
    id: "mlt-b12-086",
    stem: "A reverse grouping shows unexpected anti-A1 in a patient typed as A. The most likely ABO subgroup is:",
    options: ["Group O", "A2 (or weaker A subgroup) — A2 individuals may produce anti-A1 lectin, causing a discrepancy in reverse grouping", "Group B", "Group AB"],
    correctIndex: 1,
    rationale: "ABO subgroups: A2 is the second most common A subgroup (~20% of group A). A2 RBCs have fewer A antigen sites than A1. Some A2 individuals produce anti-A1 (naturally occurring, usually clinically insignificant). Discrepancy: forward = A; reverse = reacts with A1 cells. Resolution: test with anti-A1 lectin (Dolichos biflorus). A1 cells: positive with anti-A1 lectin; A2 cells: negative.",
    difficulty: 2,
    category: "Immunohematology / Blood Banking",
    topic: "ABO Discrepancies"
  },
  {
    id: "mlt-b12-087",
    stem: "Post-analytical errors in laboratory testing include:",
    options: ["Wrong patient identification", "Incorrect result reporting, transcription errors, failure to report critical values within required timeframe, and misinterpretation of results", "Hemolyzed specimen", "Wrong tube collected"],
    correctIndex: 1,
    rationale: "Post-analytical errors: occur after testing is complete. Include: transcription errors (manual entry mistakes), reporting to wrong patient/provider, failure to notify critical values (CLIA requires defined critical value policy and documented notification), incorrect reference range assignment, delayed reporting, and misinterpretation. Post-analytical errors: ~15-20% of total lab errors. Pre-analytical: 60-70%. Analytical: 10-15%.",
    difficulty: 1,
    category: "Laboratory Operations & Quality",
    topic: "Error Classification"
  },
  {
    id: "mlt-b12-088",
    stem: "Heparin-induced thrombocytopenia (HIT) Type II is diagnosed by:",
    options: ["Low platelet count alone", "4Ts scoring system combined with PF4-heparin antibody testing (ELISA screening, serotonin release assay for confirmation) — paradoxically causes thrombosis despite thrombocytopenia", "Bleeding time", "Platelet aggregation with ADP"],
    correctIndex: 1,
    rationale: "HIT Type II: immune-mediated (IgG against PF4-heparin complex). 4Ts scoring: Thrombocytopenia (30-50% drop), Timing (5-10 days after heparin, or <1 day if prior exposure), Thrombosis (arterial or venous), oTher causes excluded. Lab: PF4-ELISA (sensitive screening), serotonin release assay (SRA, gold standard confirmation). Management: immediately stop ALL heparin, start non-heparin anticoagulant (argatroban, bivalirudin).",
    difficulty: 3,
    category: "Hemostasis / Coagulation",
    topic: "Platelet Disorders"
  },
  {
    id: "mlt-b12-089",
    stem: "The photometric measurement in spectrophotometry follows which law?",
    options: ["Ohm's law", "Beer-Lambert law — absorbance is directly proportional to the concentration of the absorbing substance and the path length of the light through the solution", "Boyle's law", "Newton's law"],
    correctIndex: 1,
    rationale: "Beer-Lambert law: A = εbc (A = absorbance, ε = molar absorptivity, b = path length in cm, c = concentration). Absorbance is directly proportional to concentration (linear relationship). Deviations from Beer's law: stray light, fluorescence, high concentrations, chemical reactions. Spectrophotometry components: light source → monochromator → cuvette → detector → readout.",
    difficulty: 1,
    category: "Clinical Chemistry",
    topic: "Instrumentation"
  },
  {
    id: "mlt-b12-090",
    stem: "Toxoplasma gondii IgM positive, IgG negative in a pregnant woman indicates:",
    options: ["Past infection with immunity", "Recent acute infection — IgM appears first (1-2 weeks), IgG follows (2-4 weeks). Acute toxoplasmosis in early pregnancy carries highest risk of congenital transmission", "Chronic infection", "No infection"],
    correctIndex: 1,
    rationale: "Toxoplasma serology: IgM+/IgG− = very early acute infection (or false-positive IgM). IgM+/IgG+ = recent infection (weeks to months). IgM−/IgG+ = past infection (immune). In pregnancy, acute primary infection during first trimester carries highest risk of severe congenital toxoplasmosis (hydrocephalus, chorioretinitis, intracranial calcifications). IgG avidity testing helps distinguish recent vs. past infection.",
    difficulty: 2,
    category: "Parasitology",
    topic: "Serological Diagnosis"
  },
  {
    id: "mlt-b12-091",
    stem: "The most sensitive and specific test for diagnosing Helicobacter pylori infection without endoscopy is:",
    options: ["Serology (IgG)", "Urea breath test (UBT) or stool antigen test — both detect active infection and can be used to confirm eradication after treatment", "Blood culture", "Gram stain of blood"],
    correctIndex: 1,
    rationale: "H. pylori non-invasive tests: (1) Urea breath test: patient ingests ¹³C-urea → H. pylori urease cleaves urea → labeled CO2 detected in breath. Sensitivity/specificity >95%. (2) Stool antigen (HpSA): EIA detects H. pylori antigens. Both test for ACTIVE infection (unlike serology which cannot distinguish active from past). Must stop PPI 2 weeks before testing (false negatives).",
    difficulty: 2,
    category: "Microbiology",
    topic: "GI Pathogens"
  },
  {
    id: "mlt-b12-092",
    stem: "A blood smear shows spherocytes with a positive direct antiglobulin test (DAT). The MOST likely diagnosis is:",
    options: ["Hereditary spherocytosis", "Autoimmune hemolytic anemia (AIHA) — IgG-coated RBCs are partially phagocytosed by splenic macrophages, losing membrane and becoming spherocytes", "Iron deficiency", "Thalassemia"],
    correctIndex: 1,
    rationale: "AIHA: autoantibodies coat RBCs → splenic macrophages partially phagocytose membrane → loss of surface area → spherocytes. DAT positive (anti-IgG for warm AIHA, anti-C3d for cold). Hereditary spherocytosis also has spherocytes but DAT is NEGATIVE (no immune coating). Warm AIHA: IgG, extravascular hemolysis. Cold AIHA: IgM, complement activation, extravascular hemolysis.",
    difficulty: 2,
    category: "Hematology",
    topic: "Hemolytic Anemia"
  },
  {
    id: "mlt-b12-093",
    stem: "Which immunoassay technique uses enzymes as labels and is the most widely used format in clinical laboratories?",
    options: ["RIA (radioimmunoassay)", "ELISA (enzyme-linked immunosorbent assay) / EIA — enzyme-labeled antibodies produce a colorimetric signal; no radioactive materials required", "Western blot", "Nephelometry"],
    correctIndex: 1,
    rationale: "ELISA/EIA: enzyme-labeled antibodies or antigens. After binding, substrate is added → enzyme produces color change measured spectrophotometrically. Types: direct, indirect, sandwich (most common for antigen detection), competitive. Enzymes used: HRP (horseradish peroxidase), ALP (alkaline phosphatase). Replaced RIA (radioactive) in most applications. Used for HIV, hepatitis, hormones, drugs.",
    difficulty: 1,
    category: "Immunology / Serology",
    topic: "Immunoassay Methods"
  },
  {
    id: "mlt-b12-094",
    stem: "Proficiency testing (PT) in the clinical laboratory is required by CLIA to:",
    options: ["Replace internal QC", "Evaluate and verify the accuracy of test results by comparing with peer laboratories — failure to achieve satisfactory PT can result in loss of testing privileges", "Train new employees", "Validate new instruments only"],
    correctIndex: 1,
    rationale: "Proficiency testing: external quality assessment. Labs receive blinded samples, test them as routine patient samples, and submit results to PT provider. Graded against peer group or target values. CLIA: PT required 3 times/year for each regulated analyte. Unsatisfactory: <80% for analyte event. Two consecutive or 2/3 unsatisfactory: directed plan of correction. Three consecutive: sanctions (loss of testing privileges). Intentional PT referral is prohibited.",
    difficulty: 1,
    category: "Laboratory Operations & Quality",
    topic: "Regulatory Compliance"
  },
  {
    id: "mlt-b12-095",
    stem: "A stool specimen for ova and parasite (O&P) examination should be collected in:",
    options: ["Sterile cup only", "Polyvinyl alcohol (PVA) fixative and 10% formalin — PVA preserves trophozoite morphology for permanent stained smears, formalin preserves cysts for concentration", "Blood culture bottles", "EDTA tube"],
    correctIndex: 1,
    rationale: "O&P collection: two containers. (1) PVA (polyvinyl alcohol) or SAF: preserves trophozoite morphology for permanent stained smears (trichrome or iron hematoxylin). (2) 10% formalin: preserves cysts/eggs for concentration (formalin-ethyl acetate sedimentation). Three specimens on alternate days recommended (pathogens shed intermittently). No antibiotics, barium, or mineral oil for 1-2 weeks before collection.",
    difficulty: 2,
    category: "Parasitology",
    topic: "Specimen Collection"
  },
  {
    id: "mlt-b12-096",
    stem: "Coombs control cells (check cells) are used in blood bank testing to:",
    options: ["Type ABO group", "Verify that AHG (anti-human globulin) is active and functional in negative IAT results — IgG-coated check cells must agglutinate with the AHG already in the tube", "Cross-match platelets", "Screen for hemoglobin variants"],
    correctIndex: 1,
    rationale: "Coombs control cells (CCC): IgG-sensitized RBCs added to all NEGATIVE AHG tests. Purpose: verify AHG reagent was added and is functional. Expected result: agglutination (AHG reacts with IgG on CCC). If CCC negative: AHG was not added, was neutralized (inadequate washing), or was inactive → test is INVALID and must be repeated. Quality control requirement for all AHG testing.",
    difficulty: 2,
    category: "Immunohematology / Blood Banking",
    topic: "Quality Control"
  },
  {
    id: "mlt-b12-097",
    stem: "Cystine crystals in urine (hexagonal, flat, colorless) are clinically significant because they indicate:",
    options: ["Normal finding", "Cystinuria — an inherited amino acid transport defect leading to cystine stone formation; cystine crystals are always pathological", "Liver disease", "Gout"],
    correctIndex: 1,
    rationale: "Cystine crystals: hexagonal, flat, colorless. ALWAYS pathological (never normal). Indicate cystinuria (autosomal recessive defect in renal tubular reabsorption of cystine, ornithine, lysine, arginine — COLA). Cystine is poorly soluble → forms stones (radioopaque on X-ray). Treatment: high fluid intake, urine alkalinization, D-penicillamine or tiopronin (increase cystine solubility). Confirm with cyanide-nitroprusside test.",
    difficulty: 2,
    category: "Urinalysis & Body Fluids",
    topic: "Urine Crystals"
  },
  {
    id: "mlt-b12-098",
    stem: "The direct (conjugated) bilirubin fraction is elevated in:",
    options: ["Hemolytic anemia", "Biliary obstruction and hepatocellular disease — conjugated bilirubin is water-soluble and regurgitates back into blood when bile flow is impaired", "Gilbert syndrome", "Neonatal physiologic jaundice"],
    correctIndex: 1,
    rationale: "Conjugated (direct) bilirubin elevation: biliary obstruction (gallstones, pancreatic head tumor), hepatocellular disease (hepatitis, cirrhosis), Dubin-Johnson syndrome, Rotor syndrome. Conjugated bilirubin is water-soluble → excreted in urine (dark urine/bilirubinuria). Unconjugated elevation: hemolysis, Gilbert, Crigler-Najjar, neonatal jaundice. Total bilirubin = direct + indirect.",
    difficulty: 1,
    category: "Clinical Chemistry",
    topic: "Bilirubin Metabolism"
  },
  {
    id: "mlt-b12-099",
    stem: "Listeria monocytogenes is identified by which characteristic motility pattern?",
    options: ["Swarming motility", "Tumbling motility at 25°C (room temperature) — umbrella-shaped motility in semi-solid agar. Motile at 25°C but less motile or non-motile at 37°C", "Non-motile", "Gliding motility"],
    correctIndex: 1,
    rationale: "Listeria monocytogenes: gram-positive rod (can look coccoid), beta-hemolytic, catalase positive (differentiates from streptococci), motile at 25°C (tumbling motility, umbrella pattern in semi-solid agar), cold enrichment (grows at 4°C). Causes meningitis in neonates/elderly/immunocompromised, pregnancy complications. CAMP-positive (synergistic hemolysis with S. aureus, rectangular zone).",
    difficulty: 2,
    category: "Microbiology",
    topic: "Bacteriology"
  },
  {
    id: "mlt-b12-100",
    stem: "Immunofixation electrophoresis (IFE) is performed to:",
    options: ["Quantify total protein", "Identify the specific heavy chain class (IgG, IgA, IgM) and light chain type (kappa or lambda) of a monoclonal protein detected on serum protein electrophoresis", "Measure complement levels", "Detect ANA antibodies"],
    correctIndex: 1,
    rationale: "IFE: confirmatory/typing test after M-spike detected on SPE. Serum electrophoresed in 5-6 lanes, each overlaid with monospecific antisera (anti-IgG, anti-IgA, anti-IgM, anti-kappa, anti-lambda). After fixation and staining, a precipitated band in one heavy chain + one light chain lane = monoclonal (e.g., IgG kappa). More sensitive than SPE for detecting small monoclonal proteins.",
    difficulty: 2,
    category: "Immunology / Serology",
    topic: "Protein Electrophoresis"
  },
  {
    id: "mlt-b12-101",
    stem: "The minimum bactericidal concentration (MBC) differs from MIC in that MBC:",
    options: ["Measures inhibition of growth", "Measures the lowest concentration of antibiotic that kills ≥99.9% of the original bacterial inoculum — determines bactericidal vs. bacteriostatic activity", "Is always lower than MIC", "Uses disk diffusion"],
    correctIndex: 1,
    rationale: "MIC: lowest concentration that INHIBITS visible growth. MBC: lowest concentration that KILLS 99.9% of organisms (subculture from MIC wells showing no growth → plates with no colonies). MBC/MIC ratio ≤4 = bactericidal; ratio >4 = bacteriostatic for that organism-drug combination. MBC testing important for endocarditis, meningitis, osteomyelitis, neutropenic patients.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Antimicrobial Susceptibility"
  },
  {
    id: "mlt-b12-102",
    stem: "Hemoglobin S (sickle hemoglobin) results from a single amino acid substitution in the beta-globin chain:",
    options: ["Glutamic acid replaced by lysine at position 6", "Glutamic acid replaced by valine at position 6 — this point mutation causes polymerization of deoxygenated HbS leading to sickle-shaped RBCs", "Valine replaced by glutamic acid at position 6", "Histidine replaced by proline"],
    correctIndex: 1,
    rationale: "HbS: GAG → GTG mutation in beta-globin gene → glutamic acid (charged, hydrophilic) replaced by valine (nonpolar, hydrophobic) at position 6. Under deoxygenation, valine creates hydrophobic contact → HbS polymers → rigid, sickle-shaped RBCs → vaso-occlusion, hemolysis. Sickle cell disease (SS): both beta genes affected. Sickle trait (AS): one normal, one S gene; generally asymptomatic.",
    difficulty: 2,
    category: "Hematology",
    topic: "Hemoglobinopathies"
  },
  {
    id: "mlt-b12-103",
    stem: "Which hepatitis virus is an RNA virus transmitted by the fecal-oral route and does NOT cause chronic infection?",
    options: ["Hepatitis B", "Hepatitis A — RNA picornavirus, fecal-oral transmission (contaminated food/water), self-limiting acute infection with no chronic carrier state", "Hepatitis C", "Hepatitis D"],
    correctIndex: 1,
    rationale: "Hepatitis A (HAV): RNA picornavirus, fecal-oral route (contaminated water, shellfish, daycare). Causes acute hepatitis only (no chronic infection, no carrier state). Diagnosis: IgM anti-HAV (acute), IgG anti-HAV (past infection/immunity). Hepatitis E is also fecal-oral/RNA but can cause chronic infection in immunosuppressed. HBV/HCV can cause chronic infection.",
    difficulty: 1,
    category: "Virology",
    topic: "Hepatitis Virology"
  },
  {
    id: "mlt-b12-104",
    stem: "A Gram stain of a urine specimen shows gram-negative rods. Culture on blood agar shows swarming growth with a characteristic fishy odor. Identification?",
    options: ["E. coli", "Proteus mirabilis — swarming motility on blood agar (concentric rings), urease positive, fishy odor, associated with struvite (staghorn) kidney stones", "Klebsiella pneumoniae", "Pseudomonas aeruginosa"],
    correctIndex: 1,
    rationale: "Proteus mirabilis: gram-negative rod, swarming motility (concentric rings on blood agar due to flagella-mediated migration), urease positive (strongly), indole negative (P. vulgaris is indole positive), fishy/burnt chocolate odor. Urease splits urea → alkaline urine pH → struvite (magnesium ammonium phosphate/triple phosphate) stone formation. Common UTI pathogen, especially catheter-associated.",
    difficulty: 1,
    category: "Microbiology",
    topic: "Bacteriology"
  },
  {
    id: "mlt-b12-105",
    stem: "Delta checks in the laboratory compare:",
    options: ["QC results to established ranges", "A patient's current result with their previous result for the same analyte — flagging significant differences that may indicate specimen error, acute clinical change, or wrong patient specimen", "Calibrator values", "Reagent lot variations"],
    correctIndex: 1,
    rationale: "Delta checks: compare current patient result to their most recent previous result. Flags: significant changes that exceed expected biological variation within the time interval. Detects: specimen mix-up (wrong patient), IV contamination, sudden clinical deterioration, or analytical errors. Delta limits are analyte-specific (e.g., MCV should not change significantly between draws in the absence of transfusion).",
    difficulty: 1,
    category: "Laboratory Operations & Quality",
    topic: "Quality Assurance"
  },
  {
    id: "mlt-b12-106",
    stem: "The cold enrichment technique at 4°C is used to isolate which organism from clinical specimens?",
    options: ["Staphylococcus aureus", "Listeria monocytogenes — one of few bacteria that can grow at refrigerator temperatures (psychrophilic growth advantage)", "Streptococcus pyogenes", "Pseudomonas aeruginosa"],
    correctIndex: 1,
    rationale: "Cold enrichment: specimen placed in selective broth at 4°C for weeks → Listeria multiplies (psychrotrophic) while most other bacteria are inhibited. Used for stool and environmental specimens where Listeria may be present in low numbers. However, cold enrichment is slow and rarely used clinically (blood cultures are more practical). Listeria also grows on blood agar at 35°C (beta-hemolytic, small colonies).",
    difficulty: 2,
    category: "Microbiology",
    topic: "Culture Techniques"
  },
  {
    id: "mlt-b12-107",
    stem: "What type of light microscopy is used to identify crystals in synovial fluid?",
    options: ["Phase contrast only", "Compensated polarized light microscopy — differentiates MSU crystals (negative birefringence, needle-shaped) from CPPD crystals (positive birefringence, rhomboid) using a red compensator", "Darkfield only", "Electron microscopy"],
    correctIndex: 1,
    rationale: "Compensated polarized microscopy with red compensator (first-order red plate): essential for crystal identification. MSU (gout): needle-shaped, negatively birefringent (yellow when parallel to slow axis of compensator). CPPD (pseudogout): rhomboid/rod, positively birefringent (blue when parallel). Mnemonic: Yellow-Parallel-Negative = YPN = gout crystals; Blue-Parallel-Positive = pseudogout.",
    difficulty: 2,
    category: "Urinalysis & Body Fluids",
    topic: "Synovial Fluid"
  },
  {
    id: "mlt-b12-108",
    stem: "Platelet-rich plasma (PRP) for platelet aggregation studies is obtained by centrifuging whole blood at:",
    options: ["3,000g for 15 minutes", "150-200g for 10-15 minutes (soft spin) — gentle centrifugation separates PRP from RBCs without pelleting platelets", "10,000g for 5 minutes", "500g for 30 minutes"],
    correctIndex: 1,
    rationale: "PRP preparation: soft spin (150-200g × 10-15 min). Too high speed pellets platelets. PPP (platelet-poor plasma): hard spin (1,500-2,000g × 15 min) of remaining blood after PRP removal. PPP used as blank for 100% light transmission. Platelet aggregation: PRP placed in aggregometer, agonist added (ADP, collagen, epinephrine, arachidonic acid, ristocetin) → measure light transmission increase as platelets aggregate.",
    difficulty: 2,
    category: "Hemostasis / Coagulation",
    topic: "Platelet Function Testing"
  },
  {
    id: "mlt-b12-109",
    stem: "A laboratory receives a sample for cortisol measurement. The appropriate collection time for AM cortisol is:",
    options: ["Any time of day", "Early morning (6-8 AM) — cortisol follows a diurnal (circadian) rhythm with peak levels in the morning and nadir at midnight", "Midnight only", "After eating lunch"],
    correctIndex: 1,
    rationale: "Cortisol diurnal rhythm: peak at 6-8 AM, nadir at midnight. AM cortisol: screen for adrenal insufficiency (low AM = abnormal). Midnight cortisol (salivary or serum): screen for Cushing syndrome (elevated midnight = loss of diurnal rhythm). 24-hour urine free cortisol: overall cortisol production. Dexamethasone suppression test: confirmatory for Cushing (dex should suppress cortisol in normal patients).",
    difficulty: 1,
    category: "Clinical Chemistry",
    topic: "Endocrinology"
  },
  {
    id: "mlt-b12-110",
    stem: "The Donath-Landsteiner antibody associated with paroxysmal cold hemoglobinuria (PCH) is:",
    options: ["IgG anti-D", "Biphasic IgG anti-P — binds RBCs and fixes complement at cold temperatures, then complement-mediated lysis occurs upon warming to 37°C", "IgM anti-I", "IgG anti-Jka"],
    correctIndex: 1,
    rationale: "PCH (Donath-Landsteiner hemolytic anemia): biphasic IgG antibody with anti-P specificity. At cold temperatures (<15°C): IgG binds RBCs and fixes complement (C1-C4). Upon warming (37°C): complement cascade completes → intravascular hemolysis (hemoglobinuria). Most common in children post-viral infection. Diagnosis: Donath-Landsteiner test (incubate patient serum + RBCs at 4°C then warm to 37°C → hemolysis).",
    difficulty: 3,
    category: "Immunohematology / Blood Banking",
    topic: "Hemolytic Anemia"
  },
  {
    id: "mlt-b12-111",
    stem: "The antigen retrieval technique in immunohistochemistry is performed to:",
    options: ["Fix the tissue", "Unmask epitopes that were cross-linked by formalin fixation — heat-induced (HIER) or enzyme-induced epitope retrieval restores antigenicity for antibody binding", "Dehydrate the tissue", "Stain the nuclei"],
    correctIndex: 1,
    rationale: "Antigen retrieval: formalin fixation creates methylene bridges that cross-link proteins, masking antigenic epitopes. HIER (heat-induced epitope retrieval): slides in citrate or EDTA buffer heated in pressure cooker/microwave to break cross-links. PIER (protease/enzyme-induced): enzymatic digestion (trypsin, proteinase K, pepsin) unmasks epitopes. Choice of retrieval method depends on the specific antibody being used.",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Immunohistochemistry"
  },
  {
    id: "mlt-b12-112",
    stem: "A urine protein electrophoresis shows a single dense band in the gamma region not present on serum protein electrophoresis. This finding suggests:",
    options: ["Normal proteinuria", "Bence Jones proteinuria (free light chains) — monoclonal free light chains are small enough to pass through the glomerulus and appear in urine but may not be detectable in serum SPE", "Albuminuria", "Tamm-Horsfall protein"],
    correctIndex: 1,
    rationale: "Bence Jones protein: monoclonal free light chains (kappa or lambda) produced by myeloma cells. Small MW (~25 kDa) → freely filtered by glomerulus → appears in urine. May not be detectable on serum SPE (small, rapidly cleared). Detected by: urine protein electrophoresis (UPEP) and urine immunofixation. Serum free light chain assay is more sensitive. Bence Jones protein causes renal tubular damage (cast nephropathy/myeloma kidney).",
    difficulty: 3,
    category: "Clinical Chemistry",
    topic: "Protein Studies"
  },
  {
    id: "mlt-b12-113",
    stem: "MRSA (methicillin-resistant Staphylococcus aureus) resistance is mediated by:",
    options: ["Beta-lactamase production only", "mecA gene encoding altered penicillin-binding protein (PBP2a/PBP2') — PBP2a has low affinity for beta-lactam antibiotics, conferring resistance to all beta-lactams", "Efflux pumps only", "Target modification of ribosomes"],
    correctIndex: 1,
    rationale: "MRSA: mecA gene (on SCCmec mobile genetic element) encodes PBP2a, an altered penicillin-binding protein with low affinity for beta-lactams. Confers resistance to ALL beta-lactams (penicillins, cephalosporins, carbapenems). Detection: cefoxitin disk screen (surrogate for oxacillin resistance), latex agglutination for PBP2a, PCR for mecA gene. Treatment: vancomycin, daptomycin, linezolid, TMP-SMX.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Antimicrobial Resistance"
  },
  {
    id: "mlt-b12-114",
    stem: "Immature granulocyte (IG) count or left shift on a CBC is indicated by an increase in:",
    options: ["Lymphocytes", "Band neutrophils, metamyelocytes, myelocytes, and/or promyelocytes — shifted to the left of the maturation spectrum, indicating increased marrow release in response to infection or inflammation", "Eosinophils", "Basophils"],
    correctIndex: 1,
    rationale: "Left shift: increased immature granulocytes in peripheral blood. Bands >10% (bandemia), metamyelocytes, myelocytes (toxic left shift). Causes: bacterial infection, inflammation, stress response, CML (extreme left shift with all stages). Right shift: hypersegmented neutrophils (>5 lobes), seen in B12/folate deficiency and megaloblastic anemia. Automated analyzers now report IG count/percentage.",
    difficulty: 1,
    category: "Hematology",
    topic: "WBC Morphology"
  },
  {
    id: "mlt-b12-115",
    stem: "The most common cause of transfusion-related fatalities reported to the FDA is:",
    options: ["Hemolytic reactions", "TRALI (transfusion-related acute lung injury) — non-cardiogenic pulmonary edema occurring within 6 hours of transfusion, caused by donor antibodies or bioactive lipids", "Allergic reactions", "Bacterial contamination"],
    correctIndex: 1,
    rationale: "TRALI: leading cause of transfusion-related deaths. Non-cardiogenic pulmonary edema within 6 hours of transfusion. Two-hit hypothesis: (1) recipient predisposition (surgery, sepsis), (2) trigger from transfused product (donor anti-HLA/anti-HNA antibodies or bioactive lipids). Mitigation: male-predominant plasma strategy (avoiding high-plasma products from multiparous female donors). Treatment: supportive (oxygen, mechanical ventilation).",
    difficulty: 2,
    category: "Immunohematology / Blood Banking",
    topic: "Transfusion Reactions"
  },
  {
    id: "mlt-b12-116",
    stem: "Glycosylated hemoglobin (HbA1c) measurement can be falsely LOW in which condition?",
    options: ["Iron deficiency anemia", "Hemolytic anemia — shortened RBC lifespan means less time for glucose to glycosylate hemoglobin, producing falsely low HbA1c values", "Chronic kidney disease", "Hypothyroidism"],
    correctIndex: 1,
    rationale: "Falsely LOW HbA1c: conditions with shortened RBC lifespan (hemolytic anemia, sickle cell disease, blood loss, splenomegaly) → less glycosylation time. Falsely HIGH: conditions with prolonged RBC lifespan (iron deficiency, B12/folate deficiency, asplenia) → more glycosylation time. Hemoglobin variants (HbS, HbC, HbE) interfere with some methods. Fructosamine reflects 2-3 week glucose control (albumin glycation).",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Diabetes Testing"
  },
  {
    id: "mlt-b12-117",
    stem: "XLD (xylose lysine deoxycholate) agar is selective and differential for:",
    options: ["Gram-positive cocci", "Enteric pathogens — selects for gram-negative organisms and differentiates Salmonella (red with black centers) from Shigella (red) and normal flora (yellow)", "Anaerobes", "Mycobacteria"],
    correctIndex: 1,
    rationale: "XLD agar: selective (bile salts inhibit gram-positives) and differential for enteric pathogens. Xylose fermentation + lysine decarboxylation: Salmonella decarboxylates lysine → alkaline (red colonies) + H2S (black centers). Shigella: does not ferment xylose rapidly → red colonies, no H2S. Normal flora (E. coli): ferment xylose → acid (yellow colonies). Used alongside HE and MacConkey for stool cultures.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Culture Media"
  },
  {
    id: "mlt-b12-118",
    stem: "A peripheral blood smear shows basophilic stippling in RBCs. This finding is associated with:",
    options: ["Iron deficiency only", "Lead poisoning, thalassemia, and sideroblastic anemia — basophilic stippling represents aggregated ribosomes (RNA) due to impaired pyrimidine 5'-nucleotidase activity", "Normal finding", "Vitamin C deficiency"],
    correctIndex: 1,
    rationale: "Basophilic stippling: coarse or fine blue granules (aggregated ribosomes/RNA) in RBCs on Wright stain. Causes: lead poisoning (inhibits pyrimidine-5'-nucleotidase → ribosomal RNA accumulates), thalassemia, sideroblastic anemia, MDS, heavy metal poisoning. Coarse stippling is more clinically significant. In lead poisoning, also see: ringed sideroblasts, elevated zinc protoporphyrin, and microcytic anemia.",
    difficulty: 2,
    category: "Hematology",
    topic: "RBC Inclusions"
  },
  {
    id: "mlt-b12-119",
    stem: "A PCR test for a genetic mutation uses restriction fragment length polymorphism (RFLP) analysis. This technique involves:",
    options: ["Sequencing the entire genome", "Amplifying a DNA segment by PCR, then digesting with a restriction enzyme that cuts at a specific sequence — presence or absence of the cut site indicates the mutation", "Only electrophoresis", "RNA extraction"],
    correctIndex: 1,
    rationale: "PCR-RFLP: (1) PCR amplifies target DNA region, (2) restriction endonuclease digests the product (enzyme recognizes specific 4-8 bp sequence), (3) gel electrophoresis separates fragments by size. If mutation creates or destroys a restriction site: different fragment pattern (wild-type vs. mutant). Used for: Factor V Leiden, sickle cell disease (MstII site abolished), and other point mutations.",
    difficulty: 2,
    category: "Molecular Diagnostics",
    topic: "PCR Applications"
  },
  {
    id: "mlt-b12-120",
    stem: "An immunocompromised patient has modified acid-fast positive oocysts (4-6 µm) in stool. The MOST likely organism is:",
    options: ["Giardia lamblia", "Cryptosporidium parvum — modified acid-fast stain (Kinyoun) shows pink/red oocysts against blue background; common cause of chronic diarrhea in AIDS patients", "Entamoeba histolytica", "Ascaris lumbricoides"],
    correctIndex: 1,
    rationale: "Cryptosporidium oocysts: 4-6 µm, round, modified acid-fast positive (variably staining, some pink, some unstained = classic finding). Causes watery diarrhea, self-limited in immunocompetent but chronic/life-threatening in AIDS (CD4 <100). Also detected by DFA (most sensitive), EIA, and PCR. Oocysts resistant to chlorine. Cyclospora (8-10 µm) and Cystoisospora (20-30 µm) also are modified AFB positive.",
    difficulty: 2,
    category: "Parasitology",
    topic: "Intestinal Protozoa"
  },
  {
    id: "mlt-b12-121",
    stem: "Anti-M antibody is generally considered clinically insignificant because:",
    options: ["It is always IgG", "It is typically a naturally occurring IgM antibody that reacts at room temperature or below and does not cause hemolysis at body temperature (37°C) — rare IgG forms can be clinically significant", "It is never detected", "It reacts only with autologous cells"],
    correctIndex: 1,
    rationale: "Anti-M: usually naturally occurring IgM, reactive at room temperature (RT) or below. Generally not clinically significant for transfusion (no reactivity at 37°C). However, rare IgG anti-M can cause HDFN and hemolytic transfusion reactions. Testing: if anti-M is identified, check reactivity at 37°C/AHG phase. If reactive at 37°C → select M-negative units. If only reactive at RT → crossmatch-compatible units are acceptable.",
    difficulty: 2,
    category: "Immunohematology / Blood Banking",
    topic: "Antibody Significance"
  },
  {
    id: "mlt-b12-122",
    stem: "The POC test using immunochromatographic (lateral flow) technology is based on:",
    options: ["Centrifugation", "Capillary migration of sample across a membrane with embedded antibodies — positive results show colored lines where labeled antigen-antibody complexes are captured", "Mass spectrometry", "Culture methods"],
    correctIndex: 1,
    rationale: "Lateral flow immunoassay (LFIA): sample applied to sample pad → migrates by capillary action → mixes with colloidal gold or latex-labeled antibodies → complexes travel across nitrocellulose membrane → captured at test line (anti-analyte antibody) and control line (anti-species antibody). Two lines = positive; control line only = negative. No line or no control = invalid. Used for: pregnancy, rapid strep, COVID-19 Ag, HIV, drugs of abuse.",
    difficulty: 1,
    category: "Point-of-Care Testing",
    topic: "POCT Technology"
  },
  {
    id: "mlt-b12-123",
    stem: "Activated charcoal yeast extract (BCYE) agar is the primary isolation medium for:",
    options: ["Mycobacterium tuberculosis", "Legionella pneumophila — requires L-cysteine and iron for growth, which are provided in BCYE agar but not in standard blood agar", "Streptococcus pneumoniae", "Haemophilus influenzae"],
    correctIndex: 1,
    rationale: "BCYE (buffered charcoal yeast extract) agar: L-cysteine (essential amino acid for Legionella) and iron (ferric pyrophosphate). Legionella does NOT grow on blood agar or chocolate agar (no L-cysteine). Charcoal absorbs fatty acids and other inhibitors. Colonies appear after 3-5 days. Legionella urinary antigen test detects serogroup 1 (most common). PCR also available.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Culture Media"
  },
  {
    id: "mlt-b12-124",
    stem: "The 10x Westgard rule is violated when:",
    options: ["One value exceeds 3 SD", "10 consecutive QC values fall on the same side of the mean — indicating a systematic shift that may require recalibration", "Two consecutive values exceed 2 SD", "Range between two controls exceeds 4 SD"],
    correctIndex: 1,
    rationale: "10x rule: 10 consecutive QC values on the same side of the mean. Indicates systematic error (shift). Probability of 10 consecutive values on one side by chance: (0.5)^10 = 0.1%. Causes: gradual reagent deterioration, calibration drift, environmental changes. 6x rule (6 consecutive on one side) is also used as an early warning. Corrective action: recalibration, check reagents, check environment.",
    difficulty: 2,
    category: "Laboratory Operations & Quality",
    topic: "Westgard Rules"
  },
  {
    id: "mlt-b12-125",
    stem: "Ascaris lumbricoides eggs are identified by:",
    options: ["Operculated, bile-stained", "Round to oval shape (60-75 × 35-50 µm) with a thick, knobby (mammillated) outer shell — largest and most common intestinal helminth worldwide", "Comma-shaped", "Hexagonal with polar plugs"],
    correctIndex: 1,
    rationale: "Ascaris lumbricoides eggs: fertile eggs are round/oval, 45-75 µm, thick shell with mammillated (bumpy) outer protein coat (brown/bile-stained). Decorticated eggs lack the outer mammillated coat. Unfertilized eggs are larger, more elongated, and irregular. Ascaris: largest intestinal nematode (20-35 cm adults). Fecal-oral transmission. Löffler syndrome (larval migration through lungs) → eosinophilia + pulmonary infiltrates.",
    difficulty: 2,
    category: "Parasitology",
    topic: "Helminth Identification"
  },
  {
    id: "mlt-b12-126",
    stem: "The accuracy of a laboratory test is BEST defined as:",
    options: ["Reproducibility of results", "The closeness of a measured value to the true (accepted reference) value — accuracy reflects systematic error or bias", "The coefficient of variation", "The range of reportable results"],
    correctIndex: 1,
    rationale: "Accuracy: how close a measured value is to the true value (trueness). Affected by systematic error (bias). Precision: how reproducible results are (closeness of repeated measurements to each other). Affected by random error. A test can be precise but inaccurate (tight grouping, off target), or accurate but imprecise (scattered around target). Both accuracy and precision are evaluated during method validation.",
    difficulty: 1,
    category: "Laboratory Operations & Quality",
    topic: "Quality Control Statistics"
  },
  {
    id: "mlt-b12-127",
    stem: "Flow cytometry uses which technology to count and characterize individual cells?",
    options: ["Centrifugation", "Laser light scattering and fluorescent-labeled antibody detection — cells pass single-file through a laser beam, and forward/side scatter plus fluorescence data characterize each cell", "Culture plates", "Spectrophotometry"],
    correctIndex: 1,
    rationale: "Flow cytometry: cells in suspension pass through a flow cell, intersecting a laser beam. Forward scatter (FSC): cell size. Side scatter (SSC): internal complexity/granularity. Fluorescent-conjugated antibodies (CD markers) detected by photomultiplier tubes. Data displayed as dot plots, histograms, contour plots. Applications: leukemia/lymphoma immunophenotyping, CD4 counting (HIV), DNA ploidy, stem cell enumeration (CD34).",
    difficulty: 1,
    category: "Hematology",
    topic: "Instrumentation"
  },
  {
    id: "mlt-b12-128",
    stem: "Refractometry is used in urinalysis to measure:",
    options: ["pH", "Specific gravity — the refractive index of urine correlates with the concentration of dissolved solutes (total solids)", "Protein", "Glucose"],
    correctIndex: 1,
    rationale: "Refractometry: specific gravity measurement based on refractive index (bending of light through sample). Correlates with dissolved solute concentration. Quick, requires only 1 drop. Clinical refractometers are temperature-compensated. Normal random urine SG: 1.003-1.030. High SG: concentrated (dehydration). Low SG: dilute (DI, excessive water intake). High-molecular-weight solutes (protein, glucose, contrast media) disproportionately increase SG.",
    difficulty: 1,
    category: "Urinalysis & Body Fluids",
    topic: "Physical Examination"
  },
  {
    id: "mlt-b12-129",
    stem: "Phenylketonuria (PKU) newborn screening detects elevated levels of:",
    options: ["Tyrosine", "Phenylalanine — deficiency of phenylalanine hydroxylase prevents conversion of phenylalanine to tyrosine, causing toxic accumulation of phenylalanine and metabolites", "Leucine", "Tryptophan"],
    correctIndex: 1,
    rationale: "PKU: autosomal recessive deficiency of phenylalanine hydroxylase (PAH). Phenylalanine accumulates → intellectual disability if untreated. Newborn screening: blood collected on filter paper (Guthrie card) at 24-48 hours of age. MS/MS (tandem mass spectrometry) detects elevated phenylalanine. Confirmatory: quantitative amino acid analysis. Treatment: phenylalanine-restricted diet for life. Maternal PKU: uncontrolled maternal Phe causes fetal damage.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Newborn Screening"
  },
  {
    id: "mlt-b12-130",
    stem: "Erythropoietin (EPO) is produced primarily by the:",
    options: ["Bone marrow", "Kidneys (peritubular interstitial cells of the renal cortex) — hypoxia-inducible factor (HIF) pathway senses low oxygen and stimulates EPO transcription", "Liver", "Spleen"],
    correctIndex: 1,
    rationale: "EPO: glycoprotein hormone produced by peritubular interstitial cells (fibroblast-like) of the renal cortex in response to hypoxia. Small amount from liver (10-15%, primary fetal source). Stimulates erythroid progenitor cells (BFU-E, CFU-E) in bone marrow. Low EPO: CKD (secondary anemia), polycythemia vera (autonomous RBC production). High EPO: secondary polycythemia (hypoxia, high altitude, EPO-secreting tumors).",
    difficulty: 1,
    category: "Hematology",
    topic: "Erythropoiesis"
  },
  {
    id: "mlt-b12-131",
    stem: "TTP (thrombotic thrombocytopenic purpura) is caused by deficiency of which enzyme?",
    options: ["Factor V", "ADAMTS13 — a metalloprotease that cleaves ultra-large von Willebrand factor multimers; deficiency leads to platelet aggregation and microthrombi formation", "Protein C", "Antithrombin"],
    correctIndex: 1,
    rationale: "TTP: deficiency of ADAMTS13 (acquired autoantibody or congenital) → ultra-large vWF multimers accumulate → spontaneous platelet aggregation → microthrombi → MAHA + thrombocytopenia. Pentad: thrombocytopenia, MAHA (schistocytes), neurological symptoms, renal dysfunction, fever. Lab: ADAMTS13 activity <10%, schistocytes on smear, elevated LDH, low haptoglobin. Treatment: plasma exchange (provides ADAMTS13, removes inhibitor) + caplacizumab.",
    difficulty: 3,
    category: "Hemostasis / Coagulation",
    topic: "Thrombotic Microangiopathies"
  },
  {
    id: "mlt-b12-132",
    stem: "The most appropriate specimen for vancomycin trough level is drawn:",
    options: ["Immediately after infusion", "30 minutes before the next scheduled dose — trough represents the lowest drug concentration in the dosing interval", "2 hours after the dose", "At any time"],
    correctIndex: 1,
    rationale: "Vancomycin trough: draw within 30 minutes BEFORE the next dose (lowest concentration). Peak: 1-2 hours after IV infusion completion (not routinely used with AUC-guided dosing). AUC-guided monitoring: two levels (1-2 hours post-dose and trough) input into Bayesian software to calculate AUC. Target AUC/MIC 400-600 for MRSA infections. Trough-only target (when AUC not available): 15-20 µg/mL.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Therapeutic Drug Monitoring"
  },
  {
    id: "mlt-b12-133",
    stem: "Congo Red stain viewed under polarized light showing apple-green birefringence is diagnostic of:",
    options: ["Fibrosis", "Amyloidosis — amyloid deposits show apple-green birefringence under polarized light with Congo Red stain", "Glycogen storage disease", "Iron overload"],
    correctIndex: 1,
    rationale: "Congo Red stain: amyloid deposits stain orange-red under regular light. Under polarized light: characteristic apple-green birefringence (pathognomonic). Amyloid: misfolded proteins with beta-pleated sheet structure. Types: AL (light chain, myeloma), AA (serum amyloid A, chronic inflammation), ATTR (transthyretin, hereditary/senile). Biopsy sites: abdominal fat pad, rectal mucosa, involved organ.",
    difficulty: 2,
    category: "Histotechnology",
    topic: "Special Stains"
  },
  {
    id: "mlt-b12-134",
    stem: "Anti-HBs (hepatitis B surface antibody) positive with all other hepatitis B markers negative indicates:",
    options: ["Acute infection", "Immunity from vaccination — anti-HBs is the only marker present after successful HBV vaccination (no exposure to core antigen)", "Chronic infection", "Window period"],
    correctIndex: 1,
    rationale: "Anti-HBs only positive: vaccination (recombinant HBsAg vaccine → anti-HBs only, no anti-HBc). Anti-HBs + anti-HBc positive: resolved natural infection (exposed to core antigen). Anti-HBs >10 mIU/mL = protective. If anti-HBs negative after vaccination: non-responder (revaccinate series or check for chronic HBV infection).",
    difficulty: 1,
    category: "Virology",
    topic: "Hepatitis Serology"
  },
  {
    id: "mlt-b12-135",
    stem: "Type and screen (T&S) in the blood bank involves:",
    options: ["Only ABO typing", "ABO/Rh typing of the patient AND antibody screening (IAT) to detect unexpected clinically significant antibodies — both must be complete before blood can be issued", "Only crossmatching", "Only antibody identification"],
    correctIndex: 1,
    rationale: "Type and screen: (1) ABO/Rh typing (forward and reverse grouping for ABO, D antigen testing). (2) Antibody screen (IAT: patient serum + 2-3 type O screening cells with known antigen profiles → incubate → AHG phase). If both normal: compatible blood can be issued rapidly. If antibody screen positive: identify antibody with panel, provide antigen-negative crossmatch-compatible units.",
    difficulty: 1,
    category: "Immunohematology / Blood Banking",
    topic: "Pre-transfusion Testing"
  },
  {
    id: "mlt-b12-136",
    stem: "Negative predictive value (NPV) of a test is defined as:",
    options: ["True positives / (true positives + false positives)", "True negatives / (true negatives + false negatives) — the probability that a person with a negative test result is truly disease-free", "True positives / (true positives + false negatives)", "True negatives / (true negatives + true positives)"],
    correctIndex: 1,
    rationale: "NPV = TN / (TN + FN). The probability that a negative test result truly means no disease. NPV depends on disease prevalence: in low-prevalence populations, NPV is high (negative results are reliable). In high-prevalence populations, NPV decreases (more false negatives). PPV = TP / (TP + FP). Sensitivity = TP / (TP + FN). Specificity = TN / (TN + FP).",
    difficulty: 1,
    category: "Laboratory Operations & Quality",
    topic: "Test Performance"
  },
  {
    id: "mlt-b12-137",
    stem: "Taenia solium (pork tapeworm) ova in stool cannot be distinguished from Taenia saginata (beef tapeworm) ova. Differentiation requires:",
    options: ["Ova morphology", "Examination of the scolex (T. solium has rostellum with hooklets; T. saginata lacks hooklets) or proglottid morphology (T. solium has <13 uterine branches; T. saginata has >13)", "Blood smear examination", "Serology only"],
    correctIndex: 1,
    rationale: "Taenia ova: identical between species (round, 30-40 µm, thick radially striated shell, hexacanth embryo with 6 hooklets). Differentiation: (1) Scolex: T. solium has 4 suckers + rostellum with 2 rows of hooklets (armed); T. saginata has 4 suckers, no hooklets (unarmed). (2) Gravid proglottids: T. solium <13 lateral uterine branches; T. saginata >13. Distinction is clinically important: T. solium causes cysticercosis.",
    difficulty: 2,
    category: "Parasitology",
    topic: "Helminth Identification"
  },
  {
    id: "mlt-b12-138",
    stem: "A BNP (B-type natriuretic peptide) level of 50 pg/mL in a patient presenting with dyspnea:",
    options: ["Confirms heart failure", "Makes heart failure very unlikely — BNP <100 pg/mL has high negative predictive value for ruling out acute decompensated heart failure", "Is inconclusive", "Indicates severe heart failure"],
    correctIndex: 1,
    rationale: "BNP decision values: <100 pg/mL → HF very unlikely (NPV >90%). 100-400 pg/mL → gray zone (consider other causes of elevation: renal failure, PE, COPD). >400 pg/mL → HF very likely. NT-proBNP cutoffs are age-adjusted: <300 pg/mL rules out acute HF. BNP is released by ventricular myocytes in response to wall stress/volume overload. Cleared by neutral endopeptidase and NPR-C receptor.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Cardiac Biomarkers"
  },
  {
    id: "mlt-b12-139",
    stem: "The Wright-Giemsa stain differentiates eosinophil granules from basophil granules because:",
    options: ["Both stain the same color", "Eosinophil granules are acidophilic (bind eosin dye → orange/red) while basophil granules are basophilic (bind methylene blue → dark blue/purple) based on their chemical composition", "Only by size", "Only by location"],
    correctIndex: 1,
    rationale: "Eosinophil granules contain major basic protein and eosinophil peroxidase (basic/cationic) → attract acidic eosin dye → orange-red bilobed appearance. Basophil granules contain heparin and histamine (acidic) → attract basic methylene blue/azure dyes → dark blue-purple, often obscuring the nucleus. This acid-base dye affinity is the fundamental principle of Romanowsky staining.",
    difficulty: 1,
    category: "Hematology",
    topic: "Staining Principles"
  },
  {
    id: "mlt-b12-140",
    stem: "ESBL (extended-spectrum beta-lactamase) producing organisms are resistant to which antibiotics?",
    options: ["Carbapenems", "Penicillins, cephalosporins (including 3rd and 4th generation), and aztreonam — but remain susceptible to carbapenems and beta-lactam/beta-lactamase inhibitor combinations", "Vancomycin", "Aminoglycosides only"],
    correctIndex: 1,
    rationale: "ESBLs: extended-spectrum beta-lactamases (CTX-M, TEM, SHV variants). Hydrolyze: penicillins, all cephalosporins (including 3rd gen ceftriaxone, ceftazidime), and aztreonam. Susceptible to: carbapenems (treatment of choice), cephamycins (cefoxitin, cefotetan — but resistance can emerge), piperacillin-tazobactam (controversial). Detection: CLSI screening (cefotaxime/ceftazidime MIC), confirmation (clavulanate synergy test). Common in E. coli, Klebsiella.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Antimicrobial Resistance"
  },
  {
    id: "mlt-b12-141",
    stem: "Which electrophoretic pattern on hemoglobin electrophoresis at alkaline pH shows Hgb S migrating between Hgb A and Hgb A2?",
    options: ["Normal pattern", "Sickle cell trait (AS) pattern — at alkaline pH, migration order from fastest to slowest is: A, F, S, C. Hgb S migrates slower than A but faster than C", "Hgb C disease", "Beta-thalassemia trait"],
    correctIndex: 1,
    rationale: "Hemoglobin electrophoresis at alkaline pH (cellulose acetate): migration order (fastest to slowest, cathode → anode): C/A2/E → S/D/G → F → A. Sickle trait (AS): bands at both A and S positions. SS disease: band at S, no A. SC disease: bands at S and C. Acid (citrate agar) electrophoresis separates co-migrating hemoglobins: S from D, and C from E.",
    difficulty: 2,
    category: "Hematology",
    topic: "Hemoglobin Electrophoresis"
  },
  {
    id: "mlt-b12-142",
    stem: "A laboratory performing high-complexity testing under CLIA must have which personnel?",
    options: ["Only a phlebotomist", "Laboratory director (MD/DO or PhD), technical supervisor, clinical consultant, general supervisor, and testing personnel — all meeting specific education and experience requirements", "Only a medical technologist", "No specific requirements"],
    correctIndex: 1,
    rationale: "CLIA high-complexity personnel: (1) Laboratory director: MD/DO board-certified in pathology, or PhD with specific qualifications. (2) Technical supervisor: qualifications vary by specialty. (3) Clinical consultant: MD/DO or PhD. (4) General supervisor: MLT/MLS with experience. (5) Testing personnel: documented training and competency. All must meet specific education, training, and experience requirements defined in CLIA '88 regulations (42 CFR 493).",
    difficulty: 2,
    category: "Laboratory Operations & Quality",
    topic: "Regulatory Compliance"
  },
  {
    id: "mlt-b12-143",
    stem: "The lectin Dolichos biflorus is used in blood banking to differentiate:",
    options: ["Rh subtypes", "A1 from A2 red cells — D. biflorus lectin agglutinates A1 cells but NOT A2 cells due to different terminal sugar arrangements on the A antigen", "Kell subtypes", "Duffy subtypes"],
    correctIndex: 1,
    rationale: "Dolichos biflorus (anti-A1 lectin): agglutinates A1 cells (strong), does not agglutinate A2 cells. A1 cells have ~1 million A antigen sites; A2 cells have ~250,000 (fewer, different structural arrangement). Used to resolve ABO discrepancies when A2 individuals produce anti-A1. Ulex europaeus lectin: anti-H (identifies O and A2 cells, which have more H antigen than A1 cells).",
    difficulty: 2,
    category: "Immunohematology / Blood Banking",
    topic: "ABO Subgroups"
  },
  {
    id: "mlt-b12-144",
    stem: "The calprotectin fecal biomarker is used to differentiate:",
    options: ["Viral from bacterial diarrhea", "Inflammatory bowel disease (IBD) from irritable bowel syndrome (IBS) — elevated fecal calprotectin indicates intestinal inflammation and favors IBD over functional IBS", "Food allergy from intolerance", "Celiac from Crohn disease"],
    correctIndex: 1,
    rationale: "Fecal calprotectin: neutrophil-derived protein (S100A8/A9) released during intestinal inflammation. Elevated (>50-250 µg/g depending on cutoff): IBD (Crohn disease, ulcerative colitis), infectious colitis, colorectal cancer. Normal: suggests functional disorder (IBS) — avoids unnecessary colonoscopy. Used for IBD monitoring (correlates with disease activity and mucosal healing). Stable in stool at room temperature for 7 days.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "GI Biomarkers"
  },
  {
    id: "mlt-b12-145",
    stem: "The cytochemical stain myeloperoxidase (MPO) is positive in cells from which lineage?",
    options: ["Lymphoid lineage", "Myeloid lineage (granulocytes and monocytes) — MPO is present in primary (azurophilic) granules of neutrophils and is used to differentiate AML from ALL", "Erythroid lineage", "Megakaryocytic lineage"],
    correctIndex: 1,
    rationale: "MPO: enzyme in primary granules of granulocytes (neutrophils > eosinophils > monocytes). Positive in AML (>3% blasts MPO+ = WHO criterion for myeloid differentiation). Negative in ALL. Sudan Black B stains lipids in myeloid granules (similar to MPO). Esterase stains: specific esterase (naphthol AS-D chloroacetate) = granulocytic; nonspecific esterase (alpha-naphthyl butyrate) = monocytic. Flow cytometry now preferred for lineage determination.",
    difficulty: 2,
    category: "Hematology",
    topic: "Cytochemistry"
  },
  {
    id: "mlt-b12-146",
    stem: "Indole test detects the ability of an organism to produce indole from tryptophan. A positive result with Kovac's reagent shows:",
    options: ["Blue color", "Cherry-red color at the surface of the medium — indole reacts with p-dimethylaminobenzaldehyde in Kovac's reagent", "Yellow color", "No color change"],
    correctIndex: 1,
    rationale: "Indole test: organisms with tryptophanase enzyme convert tryptophan → indole + pyruvic acid + ammonia. Kovac's reagent (p-dimethylaminobenzaldehyde in amyl alcohol + HCl) reacts with indole → cherry-red color in alcohol layer. Indole positive: E. coli, P. vulgaris, Morganella. Indole negative: Klebsiella, Enterobacter, Serratia, P. mirabilis. Part of IMViC reactions for Enterobacterales identification.",
    difficulty: 1,
    category: "Microbiology",
    topic: "Biochemical Testing"
  },
  {
    id: "mlt-b12-147",
    stem: "Heparin monitoring using anti-Xa assay is preferred over aPTT in which clinical scenario?",
    options: ["All patients on heparin", "Patients with lupus anticoagulant (LA) — LA prolongs aPTT independent of heparin, making aPTT unreliable for heparin monitoring in these patients", "Patients on warfarin", "Patients with hemophilia A"],
    correctIndex: 1,
    rationale: "Anti-Xa assay preferred when aPTT is unreliable: (1) Lupus anticoagulant (falsely prolongs baseline aPTT). (2) Elevated factor VIII (shortens aPTT, may underestimate heparin effect). (3) Liver disease, DIC (multiple factor deficiencies). Anti-Xa directly measures heparin activity. UFH therapeutic range: 0.3-0.7 IU/mL (anti-Xa). LMWH therapeutic range: 0.5-1.0 IU/mL (peak anti-Xa, 4h post-dose).",
    difficulty: 3,
    category: "Hemostasis / Coagulation",
    topic: "Anticoagulant Monitoring"
  },
  {
    id: "mlt-b12-148",
    stem: "The trichrome stain is used in parasitology for:",
    options: ["Helminth egg identification", "Permanent stained smear examination of intestinal protozoan trophozoites and cysts — provides detailed nuclear and cytoplasmic morphology for definitive identification", "Blood parasite identification", "Urine sediment examination"],
    correctIndex: 1,
    rationale: "Trichrome (Wheatley modification of Gomori): permanent stain for intestinal protozoa on PVA-fixed specimens. Results: cytoplasm = blue-green to purple; nuclei = red to purple-red; background = green. Essential for detecting and identifying protozoan trophozoites (Entamoeba, Giardia, Dientamoeba) which are poorly preserved in formalin. Iron hematoxylin is an alternative permanent stain.",
    difficulty: 2,
    category: "Parasitology",
    topic: "Staining Techniques"
  },
  {
    id: "mlt-b12-149",
    stem: "Nephelometry and turbidimetry both measure light in a solution containing immune complexes. The key difference is:",
    options: ["They use different wavelengths", "Nephelometry measures scattered light (at an angle), while turbidimetry measures decreased transmitted light — nephelometry is more sensitive at low concentrations", "There is no difference", "Turbidimetry is always more sensitive"],
    correctIndex: 1,
    rationale: "Nephelometry: measures light SCATTERED by immune complexes (detected at 70° or 90° angle from incident beam). More sensitive at low protein concentrations. Used for: immunoglobulins (IgG, IgA, IgM), complement (C3, C4), CRP, specific proteins. Turbidimetry: measures DECREASE in transmitted light (detected in line with incident beam, 180°). Better at higher concentrations. Both use rate (kinetic) methods for improved sensitivity.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Instrumentation"
  },
  {
    id: "mlt-b12-150",
    stem: "A laboratory technologist notices that the Levey-Jennings chart shows 7 consecutive QC values progressively increasing but all within ±2 SD. This pattern represents:",
    options: ["Random error", "A trend — 7 consecutive values moving in one direction suggests progressive systematic error (reagent deterioration, calibration drift) even though values are within acceptable range", "Normal variation", "Instrument failure"],
    correctIndex: 1,
    rationale: "Trend: 6-7+ consecutive QC values progressively increasing or decreasing in one direction. Indicates gradual systematic change: reagent deterioration, calibrator degradation, lamp aging, tubing wear, environmental drift. Even if within ±2 SD, a trend predicts future out-of-control results. Action: investigate cause, consider recalibration, replace suspect reagent/component. Shift vs. trend: shift is abrupt change, trend is gradual.",
    difficulty: 2,
    category: "Laboratory Operations & Quality",
    topic: "Quality Control"
  },
  {
    id: "mlt-b12-151",
    stem: "Serum lactate dehydrogenase (LDH) is elevated in hemolytic anemia because:",
    options: ["LDH is produced by the liver only", "LDH is abundantly present in RBCs — hemolysis releases intracellular LDH into the serum. Combined with low haptoglobin, elevated LDH is a hallmark of hemolysis", "LDH is a kidney enzyme", "LDH responds to inflammation"],
    correctIndex: 1,
    rationale: "LDH: present in most cells (highest in heart, liver, muscle, RBCs, kidney). Hemolysis releases RBC contents including LDH → elevated serum LDH. Hemolysis triad: elevated LDH + low haptoglobin (consumed binding free hemoglobin) + elevated indirect bilirubin (from hemoglobin catabolism). Reticulocyte count elevated (marrow compensation). LDH isoenzymes: LDH-1/LDH-2 (heart, RBCs), LDH-5 (liver, muscle).",
    difficulty: 1,
    category: "Clinical Chemistry",
    topic: "Lab Value Interpretation"
  },
  {
    id: "mlt-b12-152",
    stem: "Capillary blood collection (heel stick) in neonates should be performed on which area of the foot?",
    options: ["The arch of the foot", "The medial or lateral plantar surface of the heel — avoiding the posterior curvature and central area to prevent calcaneus bone injury", "The toes", "The top of the foot"],
    correctIndex: 1,
    rationale: "Neonatal heel stick: medial or lateral plantar surface (fleshy portions). Avoid: posterior curvature of heel (close to calcaneus bone → osteomyelitis risk), central area, arch, toes. Puncture depth: ≤2.0 mm. Warm heel for 3-5 minutes (increases blood flow). First drop wiped away (tissue fluid contamination). Used for: newborn screening (PKU, hypothyroidism), bilirubin, blood gas, glucose.",
    difficulty: 1,
    category: "Phlebotomy & Specimen Collection",
    topic: "Capillary Collection"
  },
  {
    id: "mlt-b12-153",
    stem: "The DAT (direct antiglobulin test) detects antibodies or complement that are:",
    options: ["Free in serum", "Already bound (in vivo) to the patient's own RBCs — washed patient RBCs are tested directly with anti-human globulin reagent", "On reagent red cells", "On donor RBCs only"],
    correctIndex: 1,
    rationale: "DAT: detects IN VIVO sensitization of patient RBCs. Wash patient RBCs (remove unbound serum proteins) → add AHG (polyspecific or monospecific). Positive = agglutination = antibody/complement bound to RBCs in the body. Causes: warm AIHA (anti-IgG+), cold AIHA (anti-C3d+), HDFN, hemolytic transfusion reaction, drug-induced. IAT (indirect) detects free SERUM antibodies using reagent RBCs.",
    difficulty: 1,
    category: "Immunohematology / Blood Banking",
    topic: "Antiglobulin Testing"
  },
  {
    id: "mlt-b12-154",
    stem: "RT-PCR (reverse transcription PCR) is used for RNA viruses because:",
    options: ["RNA can be directly amplified by standard PCR", "RNA must first be converted to complementary DNA (cDNA) by reverse transcriptase enzyme before PCR amplification can occur — standard Taq polymerase cannot use RNA as a template", "RNA is more stable than DNA", "It is faster than standard PCR"],
    correctIndex: 1,
    rationale: "RT-PCR: (1) Reverse transcriptase converts RNA → cDNA (complementary DNA). (2) Standard PCR amplifies cDNA. Required for RNA targets: RNA viruses (HIV, HCV, SARS-CoV-2, influenza), gene expression analysis (mRNA). Real-time RT-PCR (qRT-PCR): quantitative, uses fluorescent probes (TaqMan) or dyes (SYBR Green). Ct (cycle threshold) value inversely proportional to target quantity.",
    difficulty: 2,
    category: "Molecular Diagnostics",
    topic: "PCR Methods"
  },
  {
    id: "mlt-b12-155",
    stem: "A blood gas specimen collected in a heparinized syringe contains visible air bubbles. The effect on results is:",
    options: ["No effect", "pO2 will be falsely elevated and pCO2 will be falsely decreased — room air equilibrates with the blood sample, raising pO2 toward ~150 mmHg and lowering pCO2 toward ~0 mmHg", "pO2 decreases", "pH is unaffected"],
    correctIndex: 1,
    rationale: "Air bubble effect: room air has pO2 ~150 mmHg, pCO2 ~0.3 mmHg. Gas exchange between bubble and blood: pO2 rises (toward 150), pCO2 falls (toward 0), pH rises (loss of CO2). Minimize by: expelling all air immediately, mixing thoroughly, analyzing within 30 minutes (or ice for up to 1 hour). Larger bubbles and longer exposure = greater effect. Critical error for blood gas accuracy.",
    difficulty: 2,
    category: "Phlebotomy & Specimen Collection",
    topic: "Blood Gas Collection"
  },
  {
    id: "mlt-b12-156",
    stem: "Which marker is the most specific for hepatocellular carcinoma (HCC) surveillance?",
    options: ["CEA", "Alpha-fetoprotein (AFP) — elevated in HCC (>400 ng/mL highly suggestive), hepatitis, cirrhosis, and germ cell tumors. Used for HCC surveillance in high-risk patients", "CA-125", "PSA"],
    correctIndex: 1,
    rationale: "AFP: glycoprotein, fetal liver and yolk sac protein. Elevated in: HCC (surveillance marker in cirrhosis patients, combined with ultrasound every 6 months), hepatoblastoma, germ cell tumors (yolk sac tumor), pregnancy. AFP >400 ng/mL in cirrhosis patient with liver mass = highly suggestive of HCC. Sensitivity: ~60% (not all HCCs produce AFP). AFP-L3% (lens culinaris-reactive AFP) improves specificity for HCC.",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Tumor Markers"
  },
  {
    id: "mlt-b12-157",
    stem: "Taenia solium cysticercosis (larval stage in tissue) is diagnosed by:",
    options: ["Stool O&P only", "Neuroimaging (CT/MRI showing cystic lesions with scolex) combined with serology (EITB/immunoblot for cysticercal antibodies) — stool examination is NOT reliable for diagnosing cysticercosis", "Blood smear", "Urine examination"],
    correctIndex: 1,
    rationale: "Cysticercosis (T. solium larva in tissue): diagnosed by neuroimaging (ring-enhancing cystic lesions, calcified cysts) + serology. CDC immunoblot (EITB) has >90% sensitivity and specificity. Stool O&P detects intestinal tapeworm carrier (eggs/proglottids) but NOT tissue cysticercosis (different stage of life cycle). Neurocysticercosis: most common helminthic CNS infection worldwide. Treatment: albendazole + corticosteroids.",
    difficulty: 3,
    category: "Parasitology",
    topic: "Tissue Parasites"
  },
  {
    id: "mlt-b12-158",
    stem: "Pseudothrombocytopenia is caused by:",
    options: ["True platelet consumption", "EDTA-dependent platelet clumping (agglutination) — EDTA exposes GPIIb/IIIa epitopes that bind IgG autoantibodies, causing platelet aggregation and falsely low automated platelet counts", "Platelet satellitism around WBCs", "Both EDTA-dependent clumping and platelet satellitism"],
    correctIndex: 3,
    rationale: "Pseudothrombocytopenia: in vitro artifact, NOT true thrombocytopenia. Causes: (1) EDTA-dependent platelet clumping (most common): EDTA conformational change exposes GPIIb/IIIa → IgG autoantibodies cause aggregation → clumps counted as single events or WBCs by analyzer. (2) Platelet satellitism: platelets rosette around neutrophils. Solution: redraw in sodium citrate tube, examine smear for clumps. Never transfuse platelets for pseudothrombocytopenia.",
    difficulty: 2,
    category: "Hematology",
    topic: "Pre-analytical Artifacts"
  },
  {
    id: "mlt-b12-159",
    stem: "The glucose oxidase method measures glucose by converting it to gluconic acid and hydrogen peroxide. The H2O2 is then measured by a peroxidase-mediated chromogenic reaction. This method is specific for:",
    options: ["All sugars", "D-glucose only — glucose oxidase is highly specific for beta-D-glucose, not reacting with other sugars (galactose, fructose, maltose)", "Fructose", "Lactose"],
    correctIndex: 1,
    rationale: "Glucose oxidase (GOD): highly specific for beta-D-glucose. Reaction: glucose + O2 → gluconic acid + H2O2. H2O2 + chromogen → colored product (measured spectrophotometrically). Mutarotase may be added to convert alpha-D-glucose to beta form. Interferences: ascorbic acid, uric acid, bilirubin (reduce H2O2, causing negative interference). Hexokinase method is the reference method (less susceptible to interference).",
    difficulty: 2,
    category: "Clinical Chemistry",
    topic: "Instrumentation"
  },
  {
    id: "mlt-b12-160",
    stem: "A Gram stain showing gram-positive branching filamentous rods that are partially acid-fast is MOST consistent with:",
    options: ["Actinomyces israelii", "Nocardia species — partially acid-fast (modified Kinyoun), gram-positive branching filaments, aerobic, found in soil. Causes pulmonary nocardiosis in immunocompromised patients", "Streptomyces", "Mycobacterium tuberculosis"],
    correctIndex: 1,
    rationale: "Nocardia: gram-positive, weakly/partially acid-fast (modified Kinyoun using 1% H2SO4 instead of acid-alcohol), aerobic, branching filamentous rods. Soil saprophyte, causes pulmonary disease in immunocompromised (transplant, HIV, corticosteroids). Can disseminate to brain (abscess). Actinomyces: similar morphology but NOT acid-fast, anaerobic/microaerophilic, endogenous flora. This distinction is high-yield for exams.",
    difficulty: 2,
    category: "Microbiology",
    topic: "Bacteriology"
  }
];
