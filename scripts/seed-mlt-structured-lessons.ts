import "../server/load-env";
import { getPool, logStartupDatabaseResolution } from "../server/db";

const pool = getPool();

interface LessonSection {
  sectionTitle: string;
  content: string;
  imageUrl?: string;
  imageAlt?: string;
}

interface MltStructuredLesson {
  title: string;
  slug: string;
  moduleTitle: string;
  topicTitle: string;
  discipline: string;
  disciplines: string[];
  countryTrack: string;
  difficulty: string;
  blueprintCategories: string[];
  content: LessonSection[];
  summary: string;
  objectives: string[];
  glossaryTerms: { term: string; definition: string }[];
  estimatedMinutes: number;
  sortOrder: number;
  tier: string;
  status: string;
  seoTitle: string;
  seoDescription: string;
  relatedQuestionDisciplines?: string[];
  relatedFlashcardDecks?: string[];
}

interface MltFlashcardData {
  discipline: string;
  countryTrack: string;
  deckTitle: string;
  cardType: string;
  front: string;
  back: string;
  hint?: string;
  mnemonic?: string;
  imageUrl?: string;
  imageAlt?: string;
  tags: string[];
  difficulty: string;
  sortOrder: number;
  status: string;
}

const lessons: MltStructuredLesson[] = [
  {
    title: "Iron Deficiency Anemia: Laboratory Findings",
    slug: "iron-deficiency-anemia-lab-findings",
    moduleTitle: "Hematology",
    topicTitle: "Iron Deficiency Anemia Lab Findings",
    discipline: "Hematology",
    disciplines: ["Hematology", "Clinical Chemistry"],
    countryTrack: "both",
    difficulty: "intermediate",
    blueprintCategories: ["Analytical", "Clinical Correlation"],
    content: [
      {
        sectionTitle: "Overview",
        content: "Iron deficiency anemia (IDA) is the most common nutritional deficiency worldwide and the leading cause of microcytic hypochromic anemia. It results from inadequate iron stores to support normal erythropoiesis. In the clinical laboratory, IDA is diagnosed through a combination of CBC findings, iron studies, and peripheral blood smear morphology. Understanding the laboratory progression from iron depletion to frank anemia is essential for MLT certification examinations."
      },
      {
        sectionTitle: "Pathophysiology / Laboratory Significance",
        content: "Iron is essential for hemoglobin synthesis. Iron depletion progresses through three stages: (1) Storage iron depletion — ferritin decreases, serum iron may remain normal; (2) Iron-deficient erythropoiesis — serum iron drops, TIBC rises, transferrin saturation falls below 16%, free erythrocyte protoporphyrin (FEP) increases; (3) Iron deficiency anemia — hemoglobin and hematocrit decrease, MCV falls below 80 fL, MCH and MCHC decrease. The RDW (red cell distribution width) increases early, reflecting anisocytosis as normocytic cells are gradually replaced by microcytic cells."
      },
      {
        sectionTitle: "Specimen Collection and Handling",
        content: "CBC: EDTA (lavender-top) tube, well-mixed, analyzed within 4 hours. Iron studies: Serum separator tube (SST/gold-top), fasting morning specimen preferred due to diurnal variation in serum iron (highest in morning). Ferritin: SST tube, no special timing required. Reticulocyte count: EDTA tube. Peripheral smear: prepared from EDTA specimen within 2 hours for optimal morphology. Hemolyzed specimens falsely elevate serum iron and should be rejected."
      },
      {
        sectionTitle: "Laboratory Methods",
        content: "CBC: Automated hematology analyzer using impedance/light scatter (Coulter principle). Iron studies: Serum iron measured by colorimetric methods (ferrozine or bathophenanthroline); TIBC calculated from transferrin binding capacity; ferritin measured by immunoassay (chemiluminescent, ELISA, or turbidimetric). Transferrin saturation = (serum iron / TIBC) × 100. Peripheral smear: Wright-Giemsa stain, manual review under oil immersion (100×). Reticulocyte count: Supravital staining with new methylene blue or brilliant cresyl blue.",
        imageUrl: "/images/mlt/iron-studies-flowchart.png",
        imageAlt: "Flowchart showing iron studies interpretation pathway for iron deficiency anemia diagnosis"
      },
      {
        sectionTitle: "Interpretation of Results",
        content: "Classic IDA laboratory profile: Low hemoglobin/hematocrit, low MCV (<80 fL), low MCH, low MCHC, elevated RDW (>14.5%), low serum iron, elevated TIBC, low ferritin (<12 ng/mL is diagnostic), low transferrin saturation (<16%). Peripheral smear shows microcytic hypochromic RBCs, target cells, pencil cells (elliptocytes), and anisocytosis/poikilocytosis. Reticulocyte count is low (indicating inadequate marrow response). The Mentzer index (MCV/RBC count) >13 favors IDA over thalassemia trait."
      },
      {
        sectionTitle: "Quality Control Considerations",
        content: "Verify CBC QC daily before running patient specimens. Iron studies require QC at two levels (normal and abnormal). Ferritin immunoassays require manufacturer-specific calibration curves. Monitor for hemolysis interference in serum iron testing. EDTA carryover from hematology tubes can falsely lower serum iron if tubes are drawn out of order. Delta checks on MCV and hemoglobin help detect specimen mislabeling."
      },
      {
        sectionTitle: "Clinical Correlation",
        content: "IDA commonly results from chronic blood loss (GI bleeding, menorrhagia), malabsorption (celiac disease, gastric bypass), increased demand (pregnancy, growth), or dietary insufficiency. Ferritin is an acute phase reactant and may be falsely normal or elevated in infection, inflammation, liver disease, or malignancy despite true iron deficiency. In these cases, transferrin saturation <16% and soluble transferrin receptor (sTfR) elevation help confirm IDA."
      },
      {
        sectionTitle: "Common Laboratory Errors",
        content: "Reporting iron studies from hemolyzed specimens (falsely elevated serum iron from released intracellular iron). Drawing iron studies in the afternoon (diurnal variation causes lower serum iron). Failing to correlate low ferritin with inflammatory markers (CRP, ESR) — ferritin may be falsely normal in concurrent infection. Confusing IDA with thalassemia trait (both microcytic but thalassemia has normal/elevated iron stores and low RDW). Not checking the peripheral smear when automated indices suggest IDA."
      },
      {
        sectionTitle: "Clinical Pearls",
        content: "Ferritin <12 ng/mL is virtually diagnostic of IDA — it is the single most useful test. RDW elevation in IDA helps differentiate it from thalassemia trait (RDW is normal in thalassemia). Pencil cells (elliptocytes) on the smear are characteristic of IDA. After iron therapy, the reticulocyte count peaks at 7-10 days — this is the earliest indicator of response. MCV normalizes last, often taking 2-3 months. TIBC >400 μg/dL with transferrin saturation <16% strongly supports IDA."
      }
    ],
    summary: "Comprehensive laboratory approach to diagnosing iron deficiency anemia, including CBC findings, iron studies interpretation, peripheral smear morphology, and differentiation from thalassemia trait.",
    objectives: [
      "Identify the classic laboratory profile of iron deficiency anemia",
      "Interpret iron studies (serum iron, TIBC, ferritin, transferrin saturation)",
      "Differentiate IDA from thalassemia trait using Mentzer index and RDW",
      "Recognize characteristic peripheral smear findings in IDA",
      "Describe common pre-analytical and analytical errors in iron studies"
    ],
    glossaryTerms: [
      { term: "Ferritin", definition: "The primary storage form of iron; the most sensitive and specific single test for iron deficiency" },
      { term: "TIBC", definition: "Total iron-binding capacity; measures transferrin's capacity to bind iron; elevated in IDA" },
      { term: "Transferrin saturation", definition: "Percentage of transferrin bound to iron; calculated as (serum iron/TIBC) × 100" },
      { term: "Mentzer index", definition: "MCV divided by RBC count; >13 suggests IDA, <13 suggests thalassemia trait" },
      { term: "RDW", definition: "Red cell distribution width; measures variation in RBC size (anisocytosis); elevated early in IDA" }
    ],
    estimatedMinutes: 20,
    sortOrder: 1,
    tier: "free",
    status: "published",
    seoTitle: "Iron Deficiency Anemia Lab Findings | MLT Study Guide",
    seoDescription: "Master the laboratory diagnosis of iron deficiency anemia including CBC, iron studies, ferritin, peripheral smear, and differentiation from thalassemia for MLT certification.",
    relatedQuestionDisciplines: ["Hematology", "Clinical Chemistry"],
    relatedFlashcardDecks: ["Iron Deficiency Anemia Lab Findings"]
  },
  {
    title: "Gram Stain Interpretation",
    slug: "gram-stain-interpretation-mlt",
    moduleTitle: "Microbiology",
    topicTitle: "Gram Stain Interpretation",
    discipline: "Microbiology",
    disciplines: ["Microbiology"],
    countryTrack: "both",
    difficulty: "foundational",
    blueprintCategories: ["Analytical", "Clinical Correlation"],
    content: [
      {
        sectionTitle: "Overview",
        content: "The Gram stain is the single most important staining procedure in clinical microbiology. Developed by Hans Christian Gram in 1884, it differentiates bacteria into two major groups based on cell wall structure: gram-positive (retain crystal violet, appear purple/blue) and gram-negative (decolorized, counterstained with safranin, appear pink/red). Rapid Gram stain interpretation guides empiric antibiotic therapy and directs specimen processing in the microbiology laboratory."
      },
      {
        sectionTitle: "Pathophysiology / Laboratory Significance",
        content: "Gram-positive bacteria have a thick peptidoglycan layer (20-80 nm) that retains crystal violet-iodine complex during decolorization. Gram-negative bacteria have a thin peptidoglycan layer (1-3 nm) surrounded by an outer membrane containing lipopolysaccharide (LPS/endotoxin), which is dissolved by the acetone-alcohol decolorizer, releasing the crystal violet and allowing safranin uptake. This structural difference correlates with antibiotic susceptibility patterns, pathogenicity mechanisms, and clinical management.",
        imageUrl: "/images/mlt/gram-stain-cell-wall-comparison.png",
        imageAlt: "Comparison diagram of gram-positive and gram-negative bacterial cell wall structures showing peptidoglycan layer thickness"
      },
      {
        sectionTitle: "Specimen Collection and Handling",
        content: "Direct Gram stains are performed on clinical specimens including sputum, CSF, body fluids, wound swabs, blood culture positives, and urine. Specimens should be transported promptly to the lab. CSF is highest priority and should be processed immediately. Sputum quality is assessed by the Q-score: acceptable specimens have >25 WBCs and <10 squamous epithelial cells per low-power field. Swabs should be placed in transport media (Amies, Stuart's) to preserve viability."
      },
      {
        sectionTitle: "Laboratory Methods",
        content: "Gram stain procedure: (1) Heat-fix smear; (2) Apply crystal violet (primary stain) for 1 minute; (3) Apply Gram's iodine (mordant) for 1 minute — forms CV-I complex; (4) Decolorize with acetone-alcohol for 10-30 seconds — critical step; (5) Counterstain with safranin for 30-60 seconds. Read under oil immersion (1000×). Report: organism morphology (cocci, bacilli, coccobacilli), arrangement (clusters, chains, pairs, tetrads), Gram reaction (positive or negative), and quantity (few, moderate, many). Also report WBCs, epithelial cells, and yeast if present."
      },
      {
        sectionTitle: "Interpretation of Results",
        content: "Gram-positive cocci in clusters: Staphylococcus species (aureus vs. coagulase-negative). Gram-positive cocci in chains/pairs: Streptococcus or Enterococcus species. Gram-positive bacilli (large, spore-forming): Clostridium or Bacillus species. Gram-positive bacilli (small, non-sporing): Listeria, Corynebacterium, Lactobacillus. Gram-negative diplococci (kidney-bean shaped): Neisseria species (gonorrhoeae, meningitidis). Gram-negative bacilli: Enterobacteriaceae (E. coli, Klebsiella), Pseudomonas, Haemophilus. Gram-negative coccobacilli: Haemophilus, Acinetobacter, Bordetella.",
        imageUrl: "/images/mlt/gram-stain-morphology-guide.png",
        imageAlt: "Visual guide showing common bacterial morphologies seen on Gram stain including cocci in clusters, chains, pairs, and various bacilli arrangements"
      },
      {
        sectionTitle: "Quality Control Considerations",
        content: "QC organisms: Staphylococcus aureus ATCC 25923 (gram-positive control) and Escherichia coli ATCC 25922 (gram-negative control). Run QC with each new lot of reagents and at least weekly. Check crystal violet for precipitation, iodine for expiration (loses potency over time), and decolorizer for contamination. Over-decolorization causes gram-positive organisms to appear gram-negative (false negative). Under-decolorization causes gram-negative organisms to appear gram-positive (false positive)."
      },
      {
        sectionTitle: "Clinical Correlation",
        content: "Gram stain results are communicated to clinicians immediately to guide empiric antibiotic therapy. Gram-positive cocci in clusters from blood culture → suspect S. aureus → start anti-staphylococcal therapy. Gram-negative diplococci in CSF → suspect N. meningitidis → start ceftriaxone. Gram-negative rods in urine → suspect E. coli → start fluoroquinolone or cephalosporin. No organisms seen does not rule out infection — some organisms stain poorly (Mycoplasma, Chlamydia, Mycobacteria require special stains)."
      },
      {
        sectionTitle: "Common Laboratory Errors",
        content: "Over-decolorization: most common technical error, causes gram-positive organisms to appear gram-negative. Under-decolorization: gram-negative organisms falsely appear gram-positive. Too-thick smear: organisms in thick areas stain irregularly. Using expired iodine: weakens CV-I complex, causing false gram-negative results. Misidentifying artifacts (stain precipitate, fibrin strands) as bacteria. Failing to assess sputum quality before reporting — saliva contamination leads to misleading results."
      },
      {
        sectionTitle: "Clinical Pearls",
        content: "The decolorization step is the most critical — it determines the differential staining result. Crystal violet is the primary stain, NOT gentian violet (though they contain the same dye). Sputum quality screening (Q-score) should be performed before Gram stain to reject saliva specimens. Some organisms are gram-variable (Gardnerella vaginalis) or do not stain well with Gram stain (Mycobacteria — use acid-fast, Legionella — use DFA). In CSF, a negative Gram stain does not rule out meningitis — sensitivity is only 60-90% depending on bacterial load."
      }
    ],
    summary: "Complete guide to Gram stain technique, interpretation, quality control, and clinical significance for identifying common bacterial pathogens in the clinical microbiology laboratory.",
    objectives: [
      "Describe the Gram stain procedure and the function of each reagent",
      "Interpret Gram stain morphology to narrow bacterial identification",
      "Identify common Gram stain errors and their causes",
      "Assess sputum specimen quality for Gram stain adequacy",
      "Correlate Gram stain findings with empiric antibiotic therapy"
    ],
    glossaryTerms: [
      { term: "Crystal violet", definition: "Primary stain in the Gram stain procedure; stains all bacteria purple initially" },
      { term: "Mordant", definition: "Gram's iodine; forms crystal violet-iodine complex that is retained by gram-positive cell walls" },
      { term: "Decolorizer", definition: "Acetone-alcohol mixture; dissolves outer membrane of gram-negative bacteria, releasing the CV-I complex" },
      { term: "Safranin", definition: "Counterstain; stains decolorized gram-negative bacteria pink/red" },
      { term: "Q-score", definition: "Sputum quality assessment: acceptable if >25 WBCs and <10 squamous epithelial cells per low-power field" }
    ],
    estimatedMinutes: 18,
    sortOrder: 2,
    tier: "free",
    status: "published",
    seoTitle: "Gram Stain Interpretation Guide | MLT Certification Review",
    seoDescription: "Master Gram stain technique, interpretation of bacterial morphology, QC procedures, and clinical correlation for CSMLS and ASCP MLT certification exams.",
    relatedQuestionDisciplines: ["Microbiology"],
    relatedFlashcardDecks: ["Gram Stain Interpretation"]
  },
  {
    title: "Urinalysis Microscopy: Sediment Analysis",
    slug: "urinalysis-microscopy-sediment",
    moduleTitle: "Urinalysis & Body Fluids",
    topicTitle: "Urinalysis Microscopy",
    discipline: "Urinalysis & Body Fluids",
    disciplines: ["Urinalysis & Body Fluids"],
    countryTrack: "both",
    difficulty: "intermediate",
    blueprintCategories: ["Analytical", "Clinical Correlation"],
    content: [
      {
        sectionTitle: "Overview",
        content: "Urine sediment microscopy is the third component of a complete urinalysis (physical, chemical, microscopic). It involves centrifuging a urine specimen, resuspending the sediment, and examining it under the microscope to identify cells, casts, crystals, bacteria, and other formed elements. Sediment findings provide critical diagnostic information about renal and urinary tract diseases that cannot be obtained from dipstick chemistry alone."
      },
      {
        sectionTitle: "Pathophysiology / Laboratory Significance",
        content: "Urinary casts are formed in the distal convoluted tubules and collecting ducts from Tamm-Horsfall protein (uromodulin) secreted by tubular epithelial cells. The type of cast reflects the disease process: hyaline casts (concentrated urine, strenuous exercise — benign), RBC casts (glomerulonephritis — indicate glomerular bleeding), WBC casts (pyelonephritis, interstitial nephritis), granular casts (degenerating cellular casts, renal disease), waxy casts (advanced renal failure, chronic kidney disease), and broad casts (dilated tubules, severe renal disease)."
      },
      {
        sectionTitle: "Specimen Collection and Handling",
        content: "First morning void or midstream clean-catch specimen is preferred (most concentrated). Collect in sterile container. Examine within 2 hours of collection or refrigerate to prevent bacterial overgrowth, cast dissolution, and crystal formation changes. Minimum volume: 12 mL recommended. Alkaline pH causes cast and RBC dissolution — process acidic specimens promptly. Specimens left at room temperature >2 hours may show increased bacteria, decreased glucose (bacterial consumption), and cast deterioration.",
        imageUrl: "/images/mlt/urine-specimen-collection-guide.png",
        imageAlt: "Diagram showing proper midstream clean-catch urine collection technique and specimen handling requirements"
      },
      {
        sectionTitle: "Laboratory Methods",
        content: "Standardized sediment preparation: Centrifuge 12 mL urine at 400×g for 5 minutes. Decant supernatant to 1 mL, resuspend sediment. Place drop on slide with coverslip. Examine at 100× (low power, 10× objective) for casts and crystals, then 400× (high power, 40× objective) for cells, bacteria, and crystal identification. Use reduced light (lower condenser, partially close iris diaphragm) for better contrast. Report casts per low-power field (LPF), cells per high-power field (HPF). Polarized light identifies doubly refractile fat bodies (Maltese cross pattern) and certain crystals."
      },
      {
        sectionTitle: "Interpretation of Results",
        content: "Normal sediment: 0-2 RBCs/HPF, 0-5 WBCs/HPF, occasional hyaline casts, rare squamous epithelial cells, few crystals. Abnormal findings: >5 RBCs/HPF (hematuria — consider UTI, stones, glomerulonephritis, malignancy); >5 WBCs/HPF (pyuria — UTI, interstitial nephritis); RBC casts (glomerulonephritis — pathognomonic); WBC casts (pyelonephritis); oval fat bodies with Maltese cross pattern (nephrotic syndrome); transitional epithelial cells in clumps (may indicate bladder pathology). Crystal identification depends on pH: uric acid and calcium oxalate in acidic urine; triple phosphate (struvite) and amorphous phosphates in alkaline urine.",
        imageUrl: "/images/mlt/urine-sediment-identification-chart.png",
        imageAlt: "Chart showing common urine sediment elements including RBCs, WBCs, casts, crystals, and epithelial cells under microscopy"
      },
      {
        sectionTitle: "Quality Control Considerations",
        content: "Standardize centrifugation speed and time (400×g, 5 minutes). Verify microscope calibration periodically. Use KOVA or Urisys systems for standardized sediment analysis. Run known positive sediment controls periodically. Participate in proficiency testing programs for urine sediment identification. Document and investigate discrepancies between dipstick and sediment findings (e.g., positive blood on dipstick but no RBCs on sediment may indicate hemoglobin or myoglobin)."
      },
      {
        sectionTitle: "Clinical Correlation",
        content: "UTI: >5 WBCs/HPF + bacteria + positive nitrite and leukocyte esterase on dipstick. Glomerulonephritis: RBC casts + dysmorphic RBCs + proteinuria. Nephrotic syndrome: oval fat bodies + heavy proteinuria (>3.5 g/day) + lipiduria. Pyelonephritis: WBC casts + bacteria + fever and flank pain. Kidney stones: crystals (calcium oxalate most common) + hematuria. Renal tubular injury: renal tubular epithelial (RTE) cells + granular casts."
      },
      {
        sectionTitle: "Common Laboratory Errors",
        content: "Failing to standardize centrifugation speed and volume (inconsistent results). Examining unstained sediment with too much light (structures become transparent and are missed). Confusing RBCs with yeast cells (both are round, but yeast shows budding). Confusing WBCs with renal tubular epithelial cells (both are nucleated, but RTEs are larger with eccentric nuclei). Reporting casts from a dilute specimen without noting specific gravity. Missing casts because they dissolve in alkaline urine — process promptly."
      },
      {
        sectionTitle: "Clinical Pearls",
        content: "RBC casts are pathognomonic for glomerulonephritis — their presence localizes bleeding to the kidney. Oval fat bodies with Maltese cross under polarized light are diagnostic for nephrotic syndrome. Triple phosphate (struvite/coffin-lid) crystals in alkaline urine suggest urease-producing bacteria (Proteus) UTI. Waxy casts indicate chronic kidney disease with very slow tubular flow. Dysmorphic RBCs (acanthocytes >5%) indicate glomerular origin of hematuria versus non-glomerular (isomorphic RBCs from lower urinary tract)."
      }
    ],
    summary: "Comprehensive guide to urine sediment microscopy including identification of cells, casts, crystals, and other formed elements for diagnosing renal and urinary tract diseases.",
    objectives: [
      "Describe standardized urine sediment preparation technique",
      "Identify and classify urinary casts and their clinical significance",
      "Differentiate common urinary crystals by pH and morphology",
      "Correlate sediment findings with renal disease processes",
      "Recognize common microscopy errors and artifacts"
    ],
    glossaryTerms: [
      { term: "Tamm-Horsfall protein", definition: "Also called uromodulin; glycoprotein secreted by renal tubular cells that forms the matrix of urinary casts" },
      { term: "Dysmorphic RBCs", definition: "Red blood cells with irregular shapes indicating glomerular origin of hematuria" },
      { term: "Oval fat bodies", definition: "Renal tubular epithelial cells or macrophages containing lipid droplets; show Maltese cross under polarized light" },
      { term: "Triple phosphate", definition: "Also called struvite crystals; coffin-lid shaped crystals found in alkaline urine, associated with urease-producing bacterial UTI" }
    ],
    estimatedMinutes: 22,
    sortOrder: 3,
    tier: "free",
    status: "published",
    seoTitle: "Urinalysis Microscopy & Sediment Analysis | MLT Guide",
    seoDescription: "Learn urine sediment microscopy identification of casts, crystals, cells, and clinical correlations for CSMLS and ASCP MLT certification.",
    relatedQuestionDisciplines: ["Urinalysis & Body Fluids"],
    relatedFlashcardDecks: ["Urinalysis Microscopy"]
  },
  {
    title: "Blood Gas Analysis and Acid-Base Interpretation",
    slug: "blood-gas-acid-base-analysis",
    moduleTitle: "Clinical Chemistry",
    topicTitle: "Blood Gas Analysis",
    discipline: "Clinical Chemistry",
    disciplines: ["Clinical Chemistry"],
    countryTrack: "both",
    difficulty: "advanced",
    blueprintCategories: ["Analytical", "Clinical Correlation", "Pre-analytical"],
    content: [
      {
        sectionTitle: "Overview",
        content: "Arterial blood gas (ABG) analysis is a critical laboratory test that measures blood pH, partial pressures of oxygen (pO2) and carbon dioxide (pCO2), and calculated values including bicarbonate (HCO3−), base excess, and oxygen saturation. ABGs are essential for assessing acid-base status, ventilation adequacy, and oxygenation in critically ill patients. MLTs must understand both the analytical methodology and the interpretation framework."
      },
      {
        sectionTitle: "Pathophysiology / Laboratory Significance",
        content: "Normal arterial blood pH is 7.35-7.45. The body maintains acid-base balance through three buffer systems: bicarbonate (most important extracellular buffer), phosphate, and protein (hemoglobin). The Henderson-Hasselbalch equation: pH = 6.1 + log([HCO3−] / (0.03 × pCO2)). The respiratory system regulates pCO2 (acid component) through ventilation. The kidneys regulate HCO3− (base component) through reabsorption and generation. Acid-base disorders: metabolic acidosis (low pH, low HCO3−), metabolic alkalosis (high pH, high HCO3−), respiratory acidosis (low pH, high pCO2), respiratory alkalosis (high pH, low pCO2)."
      },
      {
        sectionTitle: "Specimen Collection and Handling",
        content: "Arterial blood collected in heparinized syringe (liquid lithium heparin or pre-heparinized syringe). Air bubbles must be expelled immediately — room air contamination falsely increases pO2 and decreases pCO2. Specimen must be analyzed within 30 minutes at room temperature or 60 minutes if iced. Excess heparin dilutes the specimen, falsely lowering pCO2 and HCO3−. Venous samples can substitute for pH and pCO2 assessment but not for oxygenation (pO2). Patient temperature must be documented — blood gas analyzers measure at 37°C and results require temperature correction for hypothermic or febrile patients."
      },
      {
        sectionTitle: "Laboratory Methods",
        content: "Blood gas analyzers use electrode-based technology. pH electrode: Glass electrode (Sanz electrode) measuring hydrogen ion activity. pCO2 electrode: Severinghaus electrode — modified pH electrode with CO2-permeable membrane. pO2 electrode: Clark electrode — amperometric, measures oxygen reduction current. HCO3− is calculated from pH and pCO2 using the Henderson-Hasselbalch equation. Modern analyzers also measure electrolytes (Na+, K+, Ca2+, Cl−), glucose, lactate, hemoglobin/oximetry (total Hgb, oxyhemoglobin, deoxyhemoglobin, carboxyhemoglobin, methemoglobin), and bilirubin."
      },
      {
        sectionTitle: "Interpretation of Results",
        content: "Normal ABG values: pH 7.35-7.45, pCO2 35-45 mmHg, pO2 80-100 mmHg, HCO3− 22-26 mEq/L. Systematic interpretation: (1) Check pH — acidemia (<7.35) or alkalemia (>7.45); (2) Identify primary disorder — respiratory (pCO2) or metabolic (HCO3−); (3) Assess compensation — respiratory compensation for metabolic disorders (changes in pCO2), metabolic compensation for respiratory disorders (changes in HCO3−); (4) Calculate anion gap = Na+ − (Cl− + HCO3−), normal 8-12 mEq/L. Elevated anion gap: MUDPILES mnemonic (Methanol, Uremia, DKA, Propylene glycol, Isoniazid/Iron, Lactic acidosis, Ethylene glycol, Salicylates)."
      },
      {
        sectionTitle: "Quality Control Considerations",
        content: "Run QC at minimum every 8 hours or per manufacturer recommendations. Three-level QC (acidotic, normal, alkalotic). Calibrate electrodes with precision gas mixtures (zero and span gases for pO2 and pCO2). Verify pH electrode with phosphate buffer. Monitor electrode drift and membrane integrity. Proficiency testing quarterly. Temperature control is critical — all measurements are standardized to 37°C. Document corrective actions for all out-of-range QC."
      },
      {
        sectionTitle: "Clinical Correlation",
        content: "DKA: Metabolic acidosis with elevated anion gap, low HCO3−, compensatory low pCO2 (Kussmaul respirations). COPD exacerbation: Respiratory acidosis with elevated pCO2, compensatory elevated HCO3− (chronic compensation). Anxiety/hyperventilation: Respiratory alkalosis with low pCO2. Vomiting: Metabolic alkalosis with elevated HCO3−, compensatory mild respiratory acidosis. Carbon monoxide poisoning: Normal pO2 on ABG but low oxyhemoglobin saturation — pulse oximetry reads falsely normal because it cannot distinguish carboxyhemoglobin."
      },
      {
        sectionTitle: "Common Laboratory Errors",
        content: "Air bubbles in syringe: falsely elevate pO2 and lower pCO2 (equilibration with room air). Delayed analysis: cellular metabolism continues, consuming O2 and producing CO2 (pO2 drops, pCO2 rises, pH drops). Excess liquid heparin: dilutional effect lowers pCO2 and HCO3−. Venous sample labeled as arterial: lower pO2, higher pCO2, lower pH than true arterial values. Not recording patient temperature: results will be inaccurate without temperature correction. Clotted specimen from inadequate mixing: reject and recollect."
      },
      {
        sectionTitle: "Clinical Pearls",
        content: "Air bubbles are the most common pre-analytical error in blood gas analysis — always expel before transport. The anion gap helps differentiate causes of metabolic acidosis — always calculate it. In CO poisoning, pO2 is normal but the patient is hypoxic — only co-oximetry detects carboxyhemoglobin. Winter's formula predicts expected pCO2 compensation in metabolic acidosis: expected pCO2 = (1.5 × HCO3−) + 8 ± 2. If actual pCO2 differs significantly, a mixed disorder is present."
      }
    ],
    summary: "Complete guide to arterial blood gas analysis including specimen handling, electrode methodology, systematic acid-base interpretation, anion gap calculation, and clinical correlation.",
    objectives: [
      "Describe ABG specimen collection and pre-analytical requirements",
      "Explain the electrode technology used for pH, pCO2, and pO2 measurement",
      "Systematically interpret ABG results to identify acid-base disorders",
      "Calculate and interpret the anion gap in metabolic acidosis",
      "Identify common pre-analytical and analytical errors in blood gas testing"
    ],
    glossaryTerms: [
      { term: "Henderson-Hasselbalch equation", definition: "pH = 6.1 + log([HCO3−] / (0.03 × pCO2)); relates pH to the ratio of bicarbonate and dissolved CO2" },
      { term: "Anion gap", definition: "Na+ − (Cl− + HCO3−); normal 8-12 mEq/L; elevated in certain metabolic acidoses" },
      { term: "Severinghaus electrode", definition: "Modified pH electrode with CO2-permeable membrane used to measure pCO2" },
      { term: "Clark electrode", definition: "Amperometric electrode that measures pO2 by detecting oxygen reduction current" }
    ],
    estimatedMinutes: 25,
    sortOrder: 4,
    tier: "free",
    status: "published",
    seoTitle: "Blood Gas Analysis & Acid-Base Interpretation | MLT Study",
    seoDescription: "Master ABG analysis, Henderson-Hasselbalch equation, anion gap calculation, and acid-base disorder interpretation for CSMLS and ASCP MLT exams.",
    relatedQuestionDisciplines: ["Clinical Chemistry"],
    relatedFlashcardDecks: ["Blood Gas Analysis"]
  },
  {
    title: "Liver Function Tests: Laboratory Assessment",
    slug: "liver-function-tests-lab",
    moduleTitle: "Clinical Chemistry",
    topicTitle: "Liver Function Tests",
    discipline: "Clinical Chemistry",
    disciplines: ["Clinical Chemistry"],
    countryTrack: "both",
    difficulty: "intermediate",
    blueprintCategories: ["Analytical", "Clinical Correlation"],
    content: [
      {
        sectionTitle: "Overview",
        content: "Liver function tests (LFTs) are a panel of blood tests that assess liver health, including markers of hepatocellular injury, cholestasis, and synthetic function. The standard LFT panel includes ALT, AST, ALP, GGT, total and direct bilirubin, albumin, and total protein. Understanding the patterns of LFT elevation helps differentiate between hepatocellular disease, cholestatic disease, and infiltrative processes."
      },
      {
        sectionTitle: "Pathophysiology / Laboratory Significance",
        content: "Hepatocellular enzymes: ALT (alanine aminotransferase) is the most liver-specific enzyme, found primarily in the cytoplasm of hepatocytes. AST (aspartate aminotransferase) is found in liver, heart, skeletal muscle, kidney, and brain. The AST:ALT ratio (De Ritis ratio) helps differentiate etiologies: ratio >2 suggests alcoholic liver disease, ratio <1 suggests viral hepatitis. Cholestatic enzymes: ALP (alkaline phosphatase) is elevated in biliary obstruction and bone disease. GGT (gamma-glutamyl transferase) is specific for hepatobiliary disease and is the most sensitive marker of alcohol use. Bilirubin: Direct (conjugated) bilirubin elevation indicates hepatocellular dysfunction or biliary obstruction. Indirect (unconjugated) elevation indicates hemolysis or conjugation defects (Gilbert syndrome)."
      },
      {
        sectionTitle: "Specimen Collection and Handling",
        content: "Serum separator tube (SST/gold-top) or lithium heparin (green-top). Fasting specimen preferred for accurate bilirubin and lipid assessment. Protect bilirubin specimens from light — exposure degrades bilirubin by up to 50% per hour under direct light. Hemolysis falsely elevates AST (released from RBCs) and LDH, and interferes with bilirubin measurement. Separate serum from cells within 2 hours. Specimens are stable refrigerated for 7 days for most analytes."
      },
      {
        sectionTitle: "Laboratory Methods",
        content: "ALT and AST: Enzymatic kinetic assays measuring NADH consumption at 340 nm. ALT reaction: Alanine + α-ketoglutarate → pyruvate + glutamate (coupled to LDH/NADH). AST reaction: Aspartate + α-ketoglutarate → oxaloacetate + glutamate (coupled to MDH/NADH). ALP: Kinetic assay using p-nitrophenyl phosphate (pNPP) as substrate at alkaline pH, measuring p-nitrophenol formation at 405 nm. Bilirubin: Diazo reaction (Jendrassik-Grof method) — direct bilirubin reacts with diazo reagent without accelerator; total bilirubin requires accelerator (caffeine-benzoate) to solubilize unconjugated bilirubin. Albumin: Bromcresol green (BCG) or bromcresol purple (BCP) dye-binding methods."
      },
      {
        sectionTitle: "Interpretation of Results",
        content: "Hepatocellular pattern: ALT and AST markedly elevated (>10× upper limit), ALP mildly elevated (<3×). Causes: viral hepatitis, drug-induced liver injury, ischemic hepatitis. Cholestatic pattern: ALP markedly elevated (>3×), ALT and AST mildly elevated (<3×). Causes: biliary obstruction, primary biliary cholangitis, drug-induced cholestasis. Mixed pattern: Both hepatocellular and cholestatic enzymes elevated. Synthetic function: Albumin (<3.5 g/dL) and prolonged PT/INR indicate impaired liver synthetic capacity and correlate with disease severity."
      },
      {
        sectionTitle: "Quality Control Considerations",
        content: "Run two-level QC (normal and abnormal) daily for each analyte. Monitor Levey-Jennings charts for trends and shifts. Bilirubin standards require protection from light. ALP activity is affected by specimen age — run promptly. Verify linearity ranges and perform dilutions for markedly elevated specimens. Check for hemolysis, lipemia, and icterus interference. Cross-check AST elevation with CK to rule out skeletal muscle or cardiac source."
      },
      {
        sectionTitle: "Clinical Correlation",
        content: "Viral hepatitis (A, B, C): ALT > AST, often >1000 U/L in acute infection. Alcoholic hepatitis: AST:ALT ratio >2, AST rarely >300 U/L, elevated GGT. Biliary obstruction (gallstones, tumor): Elevated ALP, GGT, direct bilirubin. Cirrhosis: Mildly elevated AST > ALT, low albumin, prolonged PT, elevated bilirubin. Drug-induced (acetaminophen toxicity): Massively elevated ALT/AST (>3000 U/L). Neonatal jaundice: Elevated unconjugated (indirect) bilirubin — physiologic vs. pathologic."
      },
      {
        sectionTitle: "Common Laboratory Errors",
        content: "Hemolyzed specimen: Falsely elevates AST, LDH, and total bilirubin. Light exposure: Decreases bilirubin levels (photodegradation). Using ALP elevation alone to diagnose liver disease without checking GGT — ALP is also elevated in bone disease, pregnancy, and growth. Not calculating the De Ritis ratio (AST:ALT) which helps differentiate alcoholic from non-alcoholic liver disease. Failure to protect bilirubin specimens from light during transport."
      },
      {
        sectionTitle: "Clinical Pearls",
        content: "ALT is the most liver-specific enzyme — always prioritize it over AST for hepatocellular injury assessment. AST:ALT ratio >2 with AST <300 = think alcoholic liver disease. GGT is the most sensitive marker for alcohol use disorder. ALP elevation with normal GGT = think bone source (not liver). Direct bilirubin >50% of total = hepatocellular dysfunction or biliary obstruction. In cirrhosis, falling transaminase levels with worsening clinical status (burnout pattern) indicate loss of functioning hepatocytes — a poor prognostic sign."
      }
    ],
    summary: "Comprehensive laboratory guide to liver function tests including hepatocellular and cholestatic enzyme patterns, bilirubin metabolism, synthetic function markers, and clinical disease correlations.",
    objectives: [
      "Differentiate hepatocellular from cholestatic LFT patterns",
      "Interpret the AST:ALT ratio for etiologic classification",
      "Describe methodology for ALT, AST, ALP, and bilirubin assays",
      "Identify pre-analytical factors affecting LFT accuracy",
      "Correlate LFT patterns with common liver diseases"
    ],
    glossaryTerms: [
      { term: "De Ritis ratio", definition: "AST:ALT ratio; >2 suggests alcoholic liver disease, <1 suggests viral hepatitis" },
      { term: "Direct bilirubin", definition: "Conjugated bilirubin; elevated in hepatocellular dysfunction and biliary obstruction" },
      { term: "GGT", definition: "Gamma-glutamyl transferase; most sensitive marker of hepatobiliary disease and alcohol use" },
      { term: "Jendrassik-Grof method", definition: "Reference method for bilirubin measurement using diazo reaction with caffeine-benzoate accelerator" }
    ],
    estimatedMinutes: 20,
    sortOrder: 5,
    tier: "free",
    status: "published",
    seoTitle: "Liver Function Tests Laboratory Guide | MLT Review",
    seoDescription: "Master liver function test interpretation including ALT, AST, ALP, bilirubin, albumin patterns and clinical correlations for MLT certification.",
    relatedQuestionDisciplines: ["Clinical Chemistry"],
    relatedFlashcardDecks: ["Liver Function Tests"]
  },
  {
    title: "Renal Function Tests: BUN, Creatinine, and GFR",
    slug: "renal-function-tests-lab",
    moduleTitle: "Clinical Chemistry",
    topicTitle: "Renal Function Tests",
    discipline: "Clinical Chemistry",
    disciplines: ["Clinical Chemistry"],
    countryTrack: "both",
    difficulty: "intermediate",
    blueprintCategories: ["Analytical", "Clinical Correlation"],
    content: [
      {
        sectionTitle: "Overview",
        content: "Renal function testing is a cornerstone of clinical chemistry. The primary markers — blood urea nitrogen (BUN), creatinine, and estimated glomerular filtration rate (eGFR) — assess the kidney's ability to filter waste products. Cystatin C is an emerging marker that is less affected by muscle mass. Understanding these tests and their limitations is essential for MLT certification and clinical practice."
      },
      {
        sectionTitle: "Pathophysiology / Laboratory Significance",
        content: "BUN: Urea is the end product of protein metabolism, synthesized in the liver. It is freely filtered at the glomerulus but approximately 40-50% is passively reabsorbed in the tubules (more reabsorption in dehydration). Creatinine: Produced from creatine phosphate in skeletal muscle at a relatively constant rate. Freely filtered at the glomerulus with minimal tubular reabsorption and some tubular secretion. Because creatinine production correlates with muscle mass, it is affected by age, sex, and body composition. eGFR: Estimated from serum creatinine using CKD-EPI equation (adjusted for age, sex, race); most accurate for clinical staging of chronic kidney disease."
      },
      {
        sectionTitle: "Specimen Collection and Handling",
        content: "BUN and creatinine: Serum (SST) or plasma (lithium heparin). No fasting required but heavy protein meals may transiently elevate BUN. Avoid hemolysis. 24-hour urine for creatinine clearance requires complete timed collection — incomplete collection is the most common source of error. Cystatin C: Serum, no special requirements. eGFR is calculated, not measured directly. BUN is stable in separated serum at room temperature for 7 days."
      },
      {
        sectionTitle: "Laboratory Methods",
        content: "BUN: Urease/glutamate dehydrogenase coupled enzymatic method — urease converts urea to ammonia and CO2; GLDH couples ammonia with α-ketoglutarate and NADH; NADH consumption measured at 340 nm. Alternatively, conductimetric method measures ammonia conductivity change. Creatinine: Jaffe reaction (alkaline picrate) — creatinine reacts with picric acid in alkaline solution to form orange-red Janovsky complex measured at 520 nm. Known interferents include bilirubin, glucose, cephalosporins, and ketones. Enzymatic creatinine method (creatininase) is more specific and less prone to interference. Cystatin C: Particle-enhanced immunonephelometry or immunoturbidimetry."
      },
      {
        sectionTitle: "Interpretation of Results",
        content: "Normal values: BUN 7-20 mg/dL, creatinine 0.6-1.2 mg/dL (male), 0.5-1.0 mg/dL (female), eGFR >90 mL/min/1.73m². BUN:creatinine ratio: Normal 10-20:1. Elevated ratio (>20:1): Pre-renal azotemia (dehydration, CHF, GI bleeding). Normal ratio with both elevated: Renal (intrinsic kidney disease). Low ratio: Liver disease, malnutrition, dialysis. CKD staging by eGFR: Stage 1 (≥90, with kidney damage), Stage 2 (60-89), Stage 3a (45-59), Stage 3b (30-44), Stage 4 (15-29), Stage 5 (<15, ESRD)."
      },
      {
        sectionTitle: "Quality Control Considerations",
        content: "Jaffe creatinine method has known positive interferents (bilirubin, glucose, ketones, cephalosporins) — use enzymatic method for specimens with potential interferents. BUN is unaffected by muscle mass (unlike creatinine) but is affected by protein intake and liver function. Verify eGFR calculation equations are current (CKD-EPI 2021 equation removed race coefficient). Monitor QC at two levels. Hemolyzed specimens may falsely elevate some creatinine methods."
      },
      {
        sectionTitle: "Clinical Correlation",
        content: "Pre-renal azotemia (dehydration, heart failure): BUN elevated disproportionately to creatinine (ratio >20:1) due to increased tubular reabsorption of urea in low-flow states. Intrinsic renal disease (glomerulonephritis, acute tubular necrosis): Both BUN and creatinine elevated proportionally (ratio 10-20:1). Post-renal obstruction (kidney stones, prostatic hypertrophy): Both elevated, may resolve with relief of obstruction. Diabetic nephropathy: Progressive eGFR decline with microalbuminuria as early marker."
      },
      {
        sectionTitle: "Common Laboratory Errors",
        content: "Jaffe method interferents causing falsely elevated creatinine (ketones in DKA patients, bilirubin in jaundiced patients, cephalosporin antibiotics). Incomplete 24-hour urine collection for creatinine clearance — verify adequacy by checking total creatinine excretion (normal 15-25 mg/kg/day for males). Using serum creatinine alone in elderly or cachetic patients with low muscle mass — creatinine may be deceptively normal despite significant renal impairment. Not recalculating eGFR when using updated equations."
      },
      {
        sectionTitle: "Clinical Pearls",
        content: "BUN:creatinine ratio >20:1 = think pre-renal (dehydration, CHF, GI bleed). Creatinine is a late marker — up to 50% of nephrons must be lost before creatinine rises above normal. Cystatin C is independent of muscle mass, making it useful in elderly and malnourished patients. The Jaffe reaction is the traditional creatinine method but has significant interference — enzymatic methods are preferred for accuracy. A creatinine that drops from 2.0 to 1.8 in a patient losing muscle mass may actually represent worsening renal function."
      }
    ],
    summary: "Laboratory guide to renal function testing including BUN, creatinine, eGFR, and cystatin C with methodology, interpretation, BUN:creatinine ratio, and CKD staging.",
    objectives: [
      "Describe the methodology for BUN, creatinine, and cystatin C measurement",
      "Interpret the BUN:creatinine ratio for pre-renal, renal, and post-renal disease",
      "Stage chronic kidney disease using eGFR values",
      "Identify Jaffe method interferents for creatinine",
      "Explain why creatinine is a late marker of renal dysfunction"
    ],
    glossaryTerms: [
      { term: "eGFR", definition: "Estimated glomerular filtration rate; calculated from serum creatinine using CKD-EPI equation" },
      { term: "Jaffe reaction", definition: "Colorimetric method for creatinine using alkaline picrate; subject to positive interferents" },
      { term: "Cystatin C", definition: "Low molecular weight protein produced by all nucleated cells; filtration marker independent of muscle mass" },
      { term: "Azotemia", definition: "Elevated BUN in the blood; classified as pre-renal, renal, or post-renal based on BUN:creatinine ratio" }
    ],
    estimatedMinutes: 20,
    sortOrder: 6,
    tier: "free",
    status: "published",
    seoTitle: "Renal Function Tests: BUN, Creatinine, eGFR | MLT Guide",
    seoDescription: "Master BUN, creatinine, eGFR interpretation and CKD staging for CSMLS and ASCP MLT certification exams.",
    relatedQuestionDisciplines: ["Clinical Chemistry"],
    relatedFlashcardDecks: ["Renal Function Tests"]
  },
  {
    title: "Hemoglobin Electrophoresis and Hemoglobinopathies",
    slug: "hemoglobin-electrophoresis-mlt",
    moduleTitle: "Hematology",
    topicTitle: "Hemoglobin Electrophoresis",
    discipline: "Hematology",
    disciplines: ["Hematology"],
    countryTrack: "both",
    difficulty: "advanced",
    blueprintCategories: ["Analytical", "Clinical Correlation"],
    content: [
      {
        sectionTitle: "Overview",
        content: "Hemoglobin electrophoresis separates hemoglobin variants based on charge differences at specific pH values. It is the primary laboratory method for diagnosing hemoglobinopathies including sickle cell disease, thalassemias, and hemoglobin C disease. MLTs must understand the migration patterns on both alkaline and acid electrophoresis, as well as HPLC and capillary electrophoresis methods used in modern laboratories."
      },
      {
        sectionTitle: "Pathophysiology / Laboratory Significance",
        content: "Normal adult hemoglobin composition: HbA (α2β2) — 95-98%, HbA2 (α2δ2) — 2-3.5%, HbF (α2γ2) — <2%. Hemoglobinopathies result from point mutations (qualitative defects — sickle cell, HbC) or decreased globin chain production (quantitative defects — thalassemias). Sickle cell disease: HbS results from glutamic acid → valine substitution at position 6 of the beta chain. HbC: glutamic acid → lysine at position 6. Beta-thalassemia minor: elevated HbA2 (>3.5%) is diagnostic. Beta-thalassemia major: predominance of HbF (60-90%). Alpha-thalassemia: normal electrophoresis in carriers; HbH (β4) inclusions in HbH disease.",
        imageUrl: "/images/mlt/hemoglobin-electrophoresis-patterns.png",
        imageAlt: "Hemoglobin electrophoresis patterns on alkaline and acid pH showing migration positions of HbA, HbS, HbC, HbF, and HbA2"
      },
      {
        sectionTitle: "Specimen Collection and Handling",
        content: "EDTA whole blood (lavender-top tube). Hemolysate prepared by washing RBCs and lysing with water or commercially available lysing reagent. Specimens stable at 4°C for up to 7 days. Transfused patients: wait at least 3 months post-transfusion for accurate results (donor HbA masks patient hemoglobin pattern). Newborn screening: heel-stick capillary blood collected on filter paper (Guthrie card) within 24-48 hours of birth."
      },
      {
        sectionTitle: "Laboratory Methods",
        content: "Alkaline electrophoresis (cellulose acetate, pH 8.6): Separates based on net negative charge. Migration order (fastest to slowest): HbA, HbF, HbS, HbC. IMPORTANT: HbS and HbD comigrate; HbC and HbA2 and HbE comigrate at alkaline pH. Acid electrophoresis (citrate agar, pH 6.0-6.2): Resolves comigrations. HbS separates from HbD; HbC separates from HbA2 and HbE. HPLC (high-performance liquid chromatography): Cation-exchange method providing precise quantification of hemoglobin fractions. Capillary electrophoresis: Automated, high-throughput method increasingly used for hemoglobin analysis."
      },
      {
        sectionTitle: "Interpretation of Results",
        content: "Sickle cell trait (HbAS): HbA 55-60%, HbS 35-40%, normal HbA2 and HbF. Sickle cell disease (HbSS): HbS 80-90%, HbF 5-15%, elevated HbA2, NO HbA. Sickle-C disease (HbSC): HbS ~50%, HbC ~50%, no HbA. Beta-thalassemia minor: Elevated HbA2 >3.5%, mildly elevated HbF, normal HbA. Beta-thalassemia major: HbF 60-90%, variable HbA2, little or no HbA. HbH disease: HbH (β4) inclusions on supravital stain, fast-migrating band on electrophoresis. HbC disease: HbC predominant, target cells on smear.",
        imageUrl: "/images/mlt/sickle-cell-peripheral-smear.png",
        imageAlt: "Peripheral blood smear showing sickle cells (drepanocytes), target cells, and nucleated red blood cells in sickle cell disease"
      },
      {
        sectionTitle: "Quality Control Considerations",
        content: "Run AFSC control (contains HbA, HbF, HbS, HbC) with each electrophoresis run to verify migration positions. For HPLC, run manufacturer-specified controls and verify retention times. Quantification accuracy is essential for HbA2 measurement (diagnostic for beta-thalassemia minor). Document and investigate any unexpected bands or peaks. Confirm electrophoresis findings with a second method (alkaline + acid, or HPLC) for definitive identification."
      },
      {
        sectionTitle: "Clinical Correlation",
        content: "Sickle cell disease: Vaso-occlusive crises, hemolytic anemia, splenic sequestration in children, aplastic crises (parvovirus B19). Newborn screening detects HbFS pattern (fetal hemoglobin predominant with sickle hemoglobin) — HbA is absent. Beta-thalassemia major: Transfusion-dependent, iron overload requiring chelation therapy. HbC disease: Mild hemolytic anemia with target cells. Compound heterozygotes (HbSC, HbS-beta-thal) have variable severity."
      },
      {
        sectionTitle: "Common Laboratory Errors",
        content: "Reporting HbS without confirming by acid electrophoresis — HbD comigrates at alkaline pH. Not quantifying HbA2 accurately — elevated HbA2 (>3.5%) is the diagnostic marker for beta-thalassemia minor. Testing transfused patients — donor HbA masks the patient's abnormal hemoglobin. Misidentifying HbE as HbA2 or HbC on alkaline electrophoresis (all comigrate). Not correlating with CBC findings (MCV, RBC morphology) for comprehensive diagnosis."
      },
      {
        sectionTitle: "Clinical Pearls",
        content: "HbS and HbD comigrate on alkaline electrophoresis — always confirm with acid electrophoresis or HPLC. HbA2 >3.5% = beta-thalassemia minor — the single most important quantitative finding. In newborn screening, HbF predominates — the pattern is reported as HbFS (sickle trait) or HbFSC (sickle-C), with HbA absent in disease states. Solubility testing (Sickledex) is a screening test that cannot distinguish sickle cell trait from disease — electrophoresis is required. Never test patients within 3 months of transfusion."
      }
    ],
    summary: "Complete guide to hemoglobin electrophoresis methodology, migration patterns, quantification, and clinical interpretation for diagnosing sickle cell disease, thalassemias, and other hemoglobinopathies.",
    objectives: [
      "Describe hemoglobin electrophoresis at alkaline and acid pH",
      "Identify comigrating hemoglobins and resolution strategies",
      "Interpret electrophoresis patterns for common hemoglobinopathies",
      "Quantify HbA2 and HbF for thalassemia diagnosis",
      "Explain newborn screening hemoglobin patterns"
    ],
    glossaryTerms: [
      { term: "HbS", definition: "Sickle hemoglobin; glutamic acid → valine substitution at beta chain position 6; polymerizes under low oxygen" },
      { term: "HbA2", definition: "Normal minor hemoglobin (α2δ2); elevated >3.5% in beta-thalassemia minor" },
      { term: "AFSC control", definition: "Electrophoresis control containing hemoglobins A, F, S, and C for migration position verification" },
      { term: "Sickledex", definition: "Solubility screening test for HbS; cannot differentiate trait from disease" }
    ],
    estimatedMinutes: 22,
    sortOrder: 7,
    tier: "free",
    status: "published",
    seoTitle: "Hemoglobin Electrophoresis & Hemoglobinopathies | MLT Guide",
    seoDescription: "Master hemoglobin electrophoresis patterns, sickle cell diagnosis, thalassemia identification, and HPLC methods for MLT certification.",
    relatedQuestionDisciplines: ["Hematology"],
    relatedFlashcardDecks: ["Hemoglobin Electrophoresis"]
  },
  {
    title: "Antibiotic Susceptibility Testing (AST)",
    slug: "antibiotic-susceptibility-testing-mlt",
    moduleTitle: "Microbiology",
    topicTitle: "Antibiotic Susceptibility Testing",
    discipline: "Microbiology",
    disciplines: ["Microbiology"],
    countryTrack: "both",
    difficulty: "intermediate",
    blueprintCategories: ["Analytical", "Quality Control", "Clinical Correlation"],
    content: [
      {
        sectionTitle: "Overview",
        content: "Antibiotic susceptibility testing (AST) determines whether a bacterial isolate is susceptible, intermediate, or resistant to specific antimicrobial agents. Results guide targeted antibiotic therapy and are critical for antimicrobial stewardship. The two primary methods are disk diffusion (Kirby-Bauer) and broth microdilution (MIC determination). CLSI (Clinical and Laboratory Standards Institute) or EUCAST standards provide interpretive criteria."
      },
      {
        sectionTitle: "Pathophysiology / Laboratory Significance",
        content: "Antibiotic resistance mechanisms include: enzymatic inactivation (beta-lactamases destroying penicillins/cephalosporins), target modification (altered PBPs in MRSA), efflux pumps (tetracycline resistance), decreased permeability (loss of outer membrane porins in gram-negatives), and target bypass (vancomycin resistance in VRE). Detection of resistance patterns is essential: MRSA (methicillin-resistant S. aureus), VRE (vancomycin-resistant Enterococcus), ESBL (extended-spectrum beta-lactamase) producers, and CRE (carbapenem-resistant Enterobacteriaceae)."
      },
      {
        sectionTitle: "Specimen Collection and Handling",
        content: "AST is performed on pure culture isolates, not directly from clinical specimens (with few exceptions like direct blood culture disk diffusion). Inoculum is prepared by suspending colonies in saline to match a 0.5 McFarland standard (approximately 1.5 × 10⁸ CFU/mL). Mueller-Hinton agar (MHA) is the standard medium for disk diffusion. Mueller-Hinton broth for MIC testing. Plates are incubated at 35°C ± 2°C for 16-18 hours (specific exceptions exist for MRSA screening, VRE, and oxacillin testing)."
      },
      {
        sectionTitle: "Laboratory Methods",
        content: "Disk diffusion (Kirby-Bauer): Antibiotic-impregnated disks placed on inoculated MHA. Zone of inhibition measured in mm after overnight incubation. Interpreted as S (susceptible), I (intermediate), or R (resistant) using CLSI breakpoint tables. Broth microdilution: Serial two-fold dilutions of antibiotics in Mueller-Hinton broth inoculated with standardized bacterial suspension. The MIC (minimum inhibitory concentration) is the lowest antibiotic concentration that inhibits visible growth. Automated systems: VITEK 2, MicroScan, Phoenix — combine identification and AST using proprietary panels.",
        imageUrl: "/images/mlt/kirby-bauer-disk-diffusion-plate.png",
        imageAlt: "Kirby-Bauer disk diffusion plate showing zones of inhibition around antibiotic disks on Mueller-Hinton agar"
      },
      {
        sectionTitle: "Interpretation of Results",
        content: "CLSI breakpoints are updated annually and are organism-specific. Key resistance patterns to recognize: MRSA — oxacillin/cefoxitin resistant S. aureus (report all beta-lactams resistant). ESBL — cephalosporin-resistant Enterobacteriaceae (screen with ceftriaxone/ceftazidime, confirm with clavulanate). VRE — vancomycin-resistant Enterococcus (distinguish VanA from VanB phenotype). Inducible clindamycin resistance — D-zone test (erythromycin disk placed near clindamycin disk; flattening of clindamycin zone indicates inducible resistance).",
        imageUrl: "/images/mlt/d-zone-test-inducible-clindamycin.png",
        imageAlt: "D-zone test showing blunted clindamycin zone adjacent to erythromycin disk indicating inducible clindamycin resistance"
      },
      {
        sectionTitle: "Quality Control Considerations",
        content: "QC organisms: S. aureus ATCC 25923 (disk diffusion), E. coli ATCC 25922, P. aeruginosa ATCC 27853, E. faecalis ATCC 29212 (MIC). Run QC daily during the first 30 days of use, then weekly if results are within range. Verify 0.5 McFarland inoculum density. Check MHA lot for appropriate depth (4mm), pH (7.2-7.4), and thymidine content (thymidine interferes with trimethoprim-sulfamethoxazole results). Store antibiotic disks at recommended temperatures with desiccant."
      },
      {
        sectionTitle: "Clinical Correlation",
        content: "MRSA infections require vancomycin, daptomycin, or linezolid — all beta-lactams are ineffective. ESBL-producing organisms are treated with carbapenems (meropenem, imipenem). VRE infections are treated with linezolid or daptomycin. Inducible clindamycin resistance (positive D-zone): clindamycin should NOT be used for treatment. Antibiograms (cumulative AST data) guide empiric therapy choices and are updated annually."
      },
      {
        sectionTitle: "Common Laboratory Errors",
        content: "Inoculum too heavy: falsely decreased zone sizes (appears more resistant). Inoculum too light: falsely increased zone sizes (appears more susceptible). Using expired antibiotic disks: decreased potency, falsely resistant results. Not performing D-zone test for staphylococci that are erythromycin-resistant and clindamycin-susceptible. Reading zones in transmitted vs. reflected light incorrectly (use reflected light for MHA, transmitted light for Mueller-Hinton blood agar). Not checking CLSI updates for revised breakpoints."
      },
      {
        sectionTitle: "Clinical Pearls",
        content: "The 0.5 McFarland standard is the foundation of accurate AST — inoculum errors are the most common source of incorrect results. MRSA screening uses cefoxitin (30 μg) disk — more reliable than oxacillin for detection. The D-zone test detects inducible clindamycin resistance — a positive D-zone means clindamycin will fail in vivo despite appearing susceptible on standard testing. Always report MRSA as resistant to ALL beta-lactams (penicillins, cephalosporins, carbapenems) regardless of individual disk results. ESBL confirmation: ≥5 mm increase in zone with clavulanate = ESBL positive."
      }
    ],
    summary: "Comprehensive guide to antibiotic susceptibility testing including disk diffusion, MIC determination, resistance detection (MRSA, ESBL, VRE), D-zone test, and quality control procedures.",
    objectives: [
      "Perform and interpret Kirby-Bauer disk diffusion testing",
      "Describe MIC determination by broth microdilution",
      "Identify key resistance patterns: MRSA, ESBL, VRE",
      "Perform and interpret the D-zone test for inducible clindamycin resistance",
      "Apply CLSI QC standards for AST"
    ],
    glossaryTerms: [
      { term: "MIC", definition: "Minimum inhibitory concentration; lowest antibiotic concentration that inhibits visible bacterial growth" },
      { term: "McFarland standard", definition: "Barium sulfate turbidity standard; 0.5 McFarland = approximately 1.5 × 10⁸ CFU/mL for AST inoculum" },
      { term: "ESBL", definition: "Extended-spectrum beta-lactamase; enzyme that hydrolyzes third-generation cephalosporins" },
      { term: "D-zone test", definition: "Test for inducible clindamycin resistance; positive result shows flattened clindamycin zone adjacent to erythromycin disk" }
    ],
    estimatedMinutes: 22,
    sortOrder: 8,
    tier: "free",
    status: "published",
    seoTitle: "Antibiotic Susceptibility Testing (AST) Guide | MLT Review",
    seoDescription: "Master Kirby-Bauer disk diffusion, MIC testing, MRSA/ESBL/VRE detection, and D-zone test for CSMLS and ASCP MLT exams.",
    relatedQuestionDisciplines: ["Microbiology"],
    relatedFlashcardDecks: ["Antibiotic Susceptibility Testing"]
  },
  {
    title: "ELISA Methodology and Applications",
    slug: "elisa-methodology-applications",
    moduleTitle: "Immunology / Serology",
    topicTitle: "ELISA Methodology",
    discipline: "Immunology / Serology",
    disciplines: ["Immunology / Serology"],
    countryTrack: "both",
    difficulty: "intermediate",
    blueprintCategories: ["Analytical", "Instrumentation"],
    content: [
      {
        sectionTitle: "Overview",
        content: "Enzyme-linked immunosorbent assay (ELISA) is one of the most widely used immunoassay techniques in clinical laboratories. It uses enzyme-conjugated antibodies or antigens to detect and quantify analytes including infectious disease markers (HIV, hepatitis), hormones (TSH, hCG), tumor markers, drugs, and autoantibodies. Understanding ELISA formats, principles, and troubleshooting is essential for MLT practice."
      },
      {
        sectionTitle: "Pathophysiology / Laboratory Significance",
        content: "ELISA is based on the principle of specific antigen-antibody binding combined with enzyme amplification for signal detection. Four main formats: (1) Direct ELISA — enzyme-labeled antibody binds directly to antigen; (2) Indirect ELISA — unlabeled primary antibody binds antigen, enzyme-labeled secondary antibody detects the primary; (3) Sandwich ELISA — capture antibody binds antigen, enzyme-labeled detection antibody binds the other epitope (used for antigen detection, e.g., HBsAg); (4) Competitive ELISA — patient analyte competes with labeled analyte for limited antibody binding sites (inverse relationship between signal and concentration)."
      },
      {
        sectionTitle: "Specimen Collection and Handling",
        content: "Serum (SST tube) is most common. Plasma (EDTA or heparin) acceptable for many assays — verify with manufacturer. Avoid hemolyzed, lipemic, or icteric specimens as they may cause optical interference with spectrophotometric reading. Heat inactivation (56°C, 30 minutes) may be required for complement-sensitive assays. Specimens stable at 2-8°C for short-term storage; freeze at -20°C or -70°C for long-term. Avoid repeated freeze-thaw cycles."
      },
      {
        sectionTitle: "Laboratory Methods",
        content: "ELISA procedure (sandwich format example): (1) Microplate wells pre-coated with capture antibody; (2) Add patient specimen — target antigen binds to capture antibody; (3) Wash to remove unbound material; (4) Add enzyme-conjugated detection antibody — binds to captured antigen; (5) Wash again; (6) Add substrate (TMB for HRP enzyme, pNPP for ALP enzyme); (7) Enzyme converts substrate to colored product; (8) Stop reaction with acid; (9) Read absorbance with microplate spectrophotometer (450 nm for TMB). Common enzymes: Horseradish peroxidase (HRP), alkaline phosphatase (ALP). Signal is proportional to analyte concentration (except competitive ELISA — inverse)."
      },
      {
        sectionTitle: "Interpretation of Results",
        content: "Qualitative ELISA: Results compared to cutoff value. Signal-to-cutoff ratio (S/CO) ≥1.0 = reactive (positive). S/CO <1.0 = non-reactive (negative). Specimens near the cutoff (gray zone) should be retested. Reactive screening results (e.g., HIV, HBsAg) require confirmatory testing. Quantitative ELISA: Standard curve generated from known concentrations; patient results interpolated from the curve. Report in concentration units (mIU/mL, ng/mL, etc.). Competitive ELISA: High signal = low analyte concentration; low signal = high analyte concentration."
      },
      {
        sectionTitle: "Quality Control Considerations",
        content: "Run positive and negative controls with each batch. Include cutoff calibrators for qualitative assays. Monitor reagent lot changes and perform parallel testing. Verify washer and reader performance. Check wash buffer concentration and pH. Incomplete washing is the most common cause of high background (false positives). Ensure incubation times and temperatures are precise. Validate standard curves for quantitative assays — check linearity, sensitivity, and coefficient of variation."
      },
      {
        sectionTitle: "Clinical Correlation",
        content: "HIV screening: 4th generation ELISA (combo test) detects both HIV-1/2 antibodies AND p24 antigen — shortens the window period to approximately 2 weeks. HBsAg screening: Sandwich ELISA detects hepatitis B surface antigen for acute and chronic infection. Anti-HCV: Indirect ELISA screens for hepatitis C antibodies. TSH and hormone levels: Sandwich ELISA quantifies thyroid and reproductive hormones. Autoantibody detection: Indirect ELISA for ANA, anti-dsDNA, RF in autoimmune diseases."
      },
      {
        sectionTitle: "Common Laboratory Errors",
        content: "Incomplete washing: Residual unbound conjugate causes false positive results (high background). Incorrect pipetting: Volume errors affect concentration calculations. Using expired reagents: Decreased enzyme activity leads to false negatives. Prozone (hook) effect in sandwich ELISA: Very high antigen concentration saturates both capture and detection antibodies, causing falsely low or negative results — dilute and retest. Timing errors: Inconsistent incubation times cause variable results across the plate (edge effects)."
      },
      {
        sectionTitle: "Clinical Pearls",
        content: "Incomplete washing is the #1 cause of false positive ELISA results. The hook (prozone) effect in sandwich ELISA can cause falsely negative results in very high concentration specimens — always suspect in discordant clinical scenarios. 4th generation HIV ELISA detects p24 antigen + antibodies, reducing the window period. Competitive ELISA has an INVERSE signal-concentration relationship (opposite of sandwich). ELISA is a screening test — all reactive results require confirmation (Western blot for HIV, neutralization for HBsAg, RIBA/NAT for HCV)."
      }
    ],
    summary: "Complete guide to ELISA methodology including direct, indirect, sandwich, and competitive formats, clinical applications, QC, and troubleshooting for clinical laboratory practice.",
    objectives: [
      "Describe the four ELISA formats and their applications",
      "Explain the sandwich ELISA procedure step by step",
      "Interpret qualitative and quantitative ELISA results",
      "Identify common ELISA errors including the hook effect",
      "Apply ELISA in HIV, hepatitis, and autoantibody screening"
    ],
    glossaryTerms: [
      { term: "Sandwich ELISA", definition: "Format using capture and detection antibodies to detect antigen; signal proportional to concentration" },
      { term: "Competitive ELISA", definition: "Format where patient analyte competes with labeled analyte; signal inversely proportional to concentration" },
      { term: "Hook effect", definition: "Prozone phenomenon in sandwich ELISA where excess antigen causes falsely low results" },
      { term: "TMB", definition: "3,3',5,5'-tetramethylbenzidine; chromogenic substrate for HRP enzyme, produces blue color (yellow after acid stop)" }
    ],
    estimatedMinutes: 20,
    sortOrder: 9,
    tier: "free",
    status: "published",
    seoTitle: "ELISA Methodology & Applications | MLT Certification Guide",
    seoDescription: "Master ELISA formats, sandwich and competitive assays, hook effect, and clinical applications for MLT certification exams.",
    relatedQuestionDisciplines: ["Immunology / Serology"],
    relatedFlashcardDecks: ["ELISA Methodology"]
  },
  {
    title: "PCR and Molecular Testing in the Clinical Lab",
    slug: "pcr-molecular-testing-clinical-lab",
    moduleTitle: "Molecular Diagnostics",
    topicTitle: "PCR Molecular Testing",
    discipline: "Molecular Diagnostics",
    disciplines: ["Molecular Diagnostics"],
    countryTrack: "both",
    difficulty: "advanced",
    blueprintCategories: ["Analytical", "Instrumentation", "Quality Control"],
    content: [
      {
        sectionTitle: "Overview",
        content: "Polymerase chain reaction (PCR) is the cornerstone of molecular diagnostics in the clinical laboratory. It amplifies specific DNA sequences exponentially, enabling detection of infectious agents, genetic mutations, and oncology markers with extraordinary sensitivity and specificity. Modern clinical labs use real-time PCR (qPCR), reverse-transcription PCR (RT-PCR), and increasingly digital PCR for quantitative applications."
      },
      {
        sectionTitle: "Pathophysiology / Laboratory Significance",
        content: "PCR amplifies target DNA through repeated thermal cycles: (1) Denaturation (94-98°C) — separates double-stranded DNA; (2) Annealing (50-65°C) — primers bind to complementary target sequences; (3) Extension (72°C) — Taq DNA polymerase synthesizes new DNA strands. Each cycle doubles the target, yielding approximately 2^n copies after n cycles (typically 25-40 cycles). Real-time PCR monitors amplification in real-time using fluorescent probes (TaqMan) or intercalating dyes (SYBR Green). The Ct value (cycle threshold) is inversely proportional to the starting template amount."
      },
      {
        sectionTitle: "Specimen Collection and Handling",
        content: "Specimen type depends on the target: nasopharyngeal swab (respiratory viruses), EDTA blood (viral loads, genetic testing), CSF (meningitis/encephalitis panel), tissue (oncology markers), urine (CT/NG testing). RNA targets require special handling — RNA degrades rapidly, so specimens should be placed in RNA stabilization media or processed quickly. Avoid heparin anticoagulant for PCR specimens — heparin inhibits Taq polymerase. Use EDTA or citrate. Contamination prevention is critical — even trace DNA can produce false positives."
      },
      {
        sectionTitle: "Laboratory Methods",
        content: "Conventional PCR: Amplification followed by gel electrophoresis or capillary electrophoresis for size-based detection. Real-time PCR (qPCR): Fluorescent detection during amplification. TaqMan probes: Reporter + quencher; 5' nuclease activity releases reporter, generating fluorescence proportional to amplification. SYBR Green: Intercalating dye that fluoresces when bound to dsDNA (less specific — requires melt curve analysis). RT-PCR: Reverse transcriptase converts RNA to cDNA before PCR amplification — used for RNA viruses (SARS-CoV-2, HIV, HCV). Multiplex PCR: Multiple primer sets detect several targets simultaneously (syndromic panels for respiratory, GI, meningitis).",
        imageUrl: "/images/mlt/pcr-thermal-cycling-diagram.png",
        imageAlt: "Diagram showing the three steps of PCR thermal cycling: denaturation, annealing, and extension with temperature profiles"
      },
      {
        sectionTitle: "Interpretation of Results",
        content: "Qualitative PCR: Detected/Not Detected result. Used for infectious disease diagnosis (e.g., SARS-CoV-2 detected). Quantitative PCR: Ct value converted to copy number using standard curve. Low Ct (<20) = high viral/bacterial load. High Ct (>35) = low target amount, borderline positive. HIV viral load: Quantified in copies/mL or log copies/mL; undetectable (<20-50 copies/mL) indicates treatment success. HCV viral load: Used to monitor treatment response. BCR-ABL (CML): Quantified as IS (international scale) percentage for monitoring molecular response to tyrosine kinase inhibitors."
      },
      {
        sectionTitle: "Quality Control Considerations",
        content: "Contamination prevention: Unidirectional workflow (pre-amplification → amplification → post-amplification areas). Use dedicated equipment in each area. UNG (uracil-N-glycosylase) system with dUTP incorporation prevents carryover contamination. Run positive control, negative control (no template control, NTC), and extraction control with each run. Internal controls (ICs) detect PCR inhibition in patient specimens. Monitor Ct values of controls on Levey-Jennings charts."
      },
      {
        sectionTitle: "Clinical Correlation",
        content: "COVID-19 diagnosis: RT-PCR detecting SARS-CoV-2 RNA from nasopharyngeal specimens. HIV monitoring: Quantitative RT-PCR viral load guides antiretroviral therapy decisions. HCV diagnosis and monitoring: Qualitative detection and quantitative viral load for treatment duration decisions. CT/NG screening: Nucleic acid amplification testing (NAAT) is the gold standard for Chlamydia trachomatis and Neisseria gonorrhoeae detection. BCR-ABL monitoring: RT-qPCR monitors CML patients on tyrosine kinase inhibitor therapy. Syndromic panels: Multiplex PCR for simultaneous detection of multiple pathogens (BioFire FilmArray)."
      },
      {
        sectionTitle: "Common Laboratory Errors",
        content: "Contamination (amplicon carryover): False positive results from previously amplified DNA entering pre-amplification area. This is the most critical error in molecular diagnostics. Inhibition: Substances in the specimen (heparin, hemoglobin, melanin) inhibit Taq polymerase, causing false negatives — internal controls detect this. Incorrect primer design or degraded primers: Failed amplification. Temperature cycling errors: Incorrect denaturation or annealing temperatures affect specificity. Not performing melt curve analysis with SYBR Green (may miss non-specific amplification)."
      },
      {
        sectionTitle: "Clinical Pearls",
        content: "Contamination is the #1 enemy in the molecular lab — unidirectional workflow is mandatory. Low Ct value = high target = high viral/bacterial load; high Ct value = low target (inverse relationship). Heparin is a PCR inhibitor — always use EDTA tubes for molecular specimens. SYBR Green is cheaper but less specific than TaqMan probes — always perform melt curve analysis. RT-PCR requires reverse transcriptase FIRST to convert RNA to cDNA — without this step, RNA targets will not be detected. The NTC (no template control) must be negative — a positive NTC indicates contamination and invalidates the entire run."
      }
    ],
    summary: "Comprehensive guide to PCR methodology in clinical laboratories including real-time PCR, RT-PCR, contamination prevention, Ct value interpretation, and clinical applications.",
    objectives: [
      "Describe the three steps of PCR thermal cycling",
      "Compare TaqMan probes and SYBR Green detection methods",
      "Interpret Ct values for qualitative and quantitative PCR",
      "Implement contamination prevention strategies",
      "Apply PCR to infectious disease diagnosis and molecular monitoring"
    ],
    glossaryTerms: [
      { term: "Ct value", definition: "Cycle threshold; the PCR cycle at which fluorescence exceeds background; inversely proportional to target amount" },
      { term: "TaqMan probe", definition: "Fluorescent probe with reporter and quencher; cleaved during amplification to generate signal" },
      { term: "RT-PCR", definition: "Reverse transcription PCR; converts RNA to cDNA before amplification; used for RNA virus detection" },
      { term: "NTC", definition: "No template control; negative control containing all reagents except template DNA; must be negative" }
    ],
    estimatedMinutes: 25,
    sortOrder: 10,
    tier: "free",
    status: "published",
    seoTitle: "PCR & Molecular Testing in Clinical Lab | MLT Guide",
    seoDescription: "Master PCR methodology, real-time qPCR, RT-PCR, Ct value interpretation, and contamination prevention for MLT certification.",
    relatedQuestionDisciplines: ["Molecular Diagnostics"],
    relatedFlashcardDecks: ["PCR Molecular Testing"]
  },
  {
    title: "Blood Culture Techniques and Interpretation",
    slug: "blood-culture-techniques-interpretation",
    moduleTitle: "Microbiology",
    topicTitle: "Blood Culture Techniques",
    discipline: "Microbiology",
    disciplines: ["Microbiology"],
    countryTrack: "both",
    difficulty: "intermediate",
    blueprintCategories: ["Pre-analytical", "Analytical", "Clinical Correlation"],
    content: [
      {
        sectionTitle: "Overview",
        content: "Blood cultures are the gold standard for diagnosing bloodstream infections (bacteremia and fungemia). Proper collection technique, adequate blood volume, and appropriate number of sets are critical for optimizing detection. Automated continuous-monitoring blood culture systems (BacT/ALERT, BACTEC) have revolutionized detection by continuously monitoring for microbial growth indicators."
      },
      {
        sectionTitle: "Pathophysiology / Laboratory Significance",
        content: "Bacteremia can be transient (dental procedures, manipulation of infected sites), intermittent (undrained abscesses, certain endocarditis), or continuous (endocarditis, intravascular infections). Blood cultures detect as few as 1-10 CFU/mL in adults and are essential for identifying the causative organism and determining antibiotic susceptibility. The timing of collection relative to fever spikes was historically emphasized but current guidelines recommend collecting cultures as soon as bacteremia is clinically suspected, regardless of temperature timing."
      },
      {
        sectionTitle: "Specimen Collection and Handling",
        content: "Collection: Clean skin with chlorhexidine (preferred) or povidone-iodine. Allow antiseptic to dry completely (most important contamination prevention step). Collect 2-3 sets from separate venipuncture sites (each set = 1 aerobic + 1 anaerobic bottle). Adults: 20-30 mL total blood per set (10 mL per bottle). Pediatric: 1-3 mL based on weight. Blood volume is the single most important variable affecting sensitivity. Inoculate bottles at bedside, transport promptly. Do NOT refrigerate blood cultures.",
        imageUrl: "/images/mlt/blood-culture-collection-procedure.png",
        imageAlt: "Step-by-step blood culture collection procedure showing skin preparation, venipuncture, and bottle inoculation technique"
      },
      {
        sectionTitle: "Laboratory Methods",
        content: "Automated continuous-monitoring systems: BacT/ALERT (colorimetric CO2 detection), BACTEC (fluorescent CO2 detection). Bottles contain enrichment broth with antibiotic-neutralizing resins or charcoal. Instruments monitor bottles continuously (every 10 minutes) for growth indicators. Positive bottles trigger an alert. Processing positive bottles: Gram stain of broth, subculture to appropriate media (blood agar, chocolate agar, MacConkey agar, anaerobic blood agar). Some labs perform rapid identification directly from positive bottles using MALDI-TOF MS."
      },
      {
        sectionTitle: "Interpretation of Results",
        content: "True positive: Organism is the cause of infection. Most S. aureus, Enterobacteriaceae, Pseudomonas, and Candida species from blood cultures represent true infection. Contaminant: Organism is from skin flora introduced during collection. Common contaminants: Coagulase-negative staphylococci (CoNS), Corynebacterium species, Propionibacterium (Cutibacterium) acnes, Bacillus species (not anthracis). Key differentiators: number of positive sets (multiple = likely true positive), time to positivity (short = higher bacterial load = likely true), clinical correlation."
      },
      {
        sectionTitle: "Quality Control Considerations",
        content: "Monitor contamination rate — acceptable rate is <3%. Track by phlebotomist and collection site for targeted retraining. Monitor blood volume adequacy — under-filling reduces sensitivity. Track time to positivity for clinically significant organisms. Verify automated system calibration and maintenance per manufacturer schedule. Participate in proficiency testing for blood culture identification. Document and investigate false-positive alarms (instrument issues)."
      },
      {
        sectionTitle: "Clinical Correlation",
        content: "S. aureus bacteremia: Always significant — requires echocardiography to rule out endocarditis. Candidemia: Always significant — requires antifungal therapy and ophthalmologic evaluation. CoNS in 1 of 4 bottles: Likely contaminant. CoNS in 3 of 4 bottles with short time to positivity: Consider true infection (especially with prosthetic devices). Enterobacteriaceae: Almost always significant — look for urinary, abdominal, or biliary source. Anaerobic bacteremia: Consider intra-abdominal source, especially with Bacteroides fragilis."
      },
      {
        sectionTitle: "Common Laboratory Errors",
        content: "Inadequate blood volume: The #1 reason for false negative blood cultures. Each mL of blood below the recommended 10 mL per bottle decreases sensitivity by 3-5%. Collecting from IV line instead of fresh venipuncture: High contamination rate. Delayed transport to lab: Organisms may die, especially fastidious organisms. Not collecting anaerobic bottles: Misses anaerobic bacteremia (Bacteroides, Clostridium). Dismissing CoNS as contaminant without considering clinical context (prosthetic valves, central lines)."
      },
      {
        sectionTitle: "Clinical Pearls",
        content: "Blood volume is the single most important variable for blood culture sensitivity — do not under-fill bottles. Contamination rate should be <3% — track and report to reduce unnecessary antibiotics and workup. S. aureus in even one blood culture bottle is ALWAYS clinically significant. Time to positivity <14 hours suggests high-grade bacteremia. Chlorhexidine is superior to povidone-iodine for skin preparation, and it must be allowed to dry completely. Never refrigerate blood cultures — cold temperatures kill some pathogens and delay growth detection."
      }
    ],
    summary: "Complete guide to blood culture collection, automated detection systems, interpretation of positive results, contamination assessment, and clinical significance of bloodstream infections.",
    objectives: [
      "Describe proper blood culture collection technique",
      "Explain automated continuous-monitoring blood culture systems",
      "Differentiate true positive blood cultures from contaminants",
      "Identify the significance of common blood culture isolates",
      "Apply quality metrics to blood culture contamination rates"
    ],
    glossaryTerms: [
      { term: "Bacteremia", definition: "Presence of viable bacteria in the bloodstream" },
      { term: "Time to positivity", definition: "Time from bottle loading to positive signal; shorter times suggest higher bacterial load" },
      { term: "Contaminant", definition: "Organism introduced during collection, not causing true infection; usually skin flora" },
      { term: "CoNS", definition: "Coagulase-negative staphylococci; most common blood culture contaminant" }
    ],
    estimatedMinutes: 20,
    sortOrder: 11,
    tier: "free",
    status: "published",
    seoTitle: "Blood Culture Techniques & Interpretation | MLT Guide",
    seoDescription: "Master blood culture collection, automated systems, result interpretation, and contamination prevention for MLT certification exams.",
    relatedQuestionDisciplines: ["Microbiology"],
    relatedFlashcardDecks: ["Blood Culture Techniques"]
  },
  {
    title: "Cerebrospinal Fluid (CSF) Analysis",
    slug: "cerebrospinal-fluid-analysis-mlt",
    moduleTitle: "Urinalysis & Body Fluids",
    topicTitle: "CSF Analysis",
    discipline: "Urinalysis & Body Fluids",
    disciplines: ["Urinalysis & Body Fluids", "Microbiology", "Clinical Chemistry", "Hematology"],
    countryTrack: "both",
    difficulty: "advanced",
    blueprintCategories: ["Analytical", "Clinical Correlation", "Pre-analytical"],
    content: [
      {
        sectionTitle: "Overview",
        content: "Cerebrospinal fluid analysis is a STAT laboratory procedure requiring immediate processing. CSF is obtained via lumbar puncture and is analyzed for cell counts, differential, glucose, protein, Gram stain, culture, and additional tests based on clinical suspicion. CSF analysis is critical for diagnosing meningitis, encephalitis, subarachnoid hemorrhage, and CNS malignancies."
      },
      {
        sectionTitle: "Pathophysiology / Laboratory Significance",
        content: "Normal CSF is clear and colorless with very few cells (<5 WBCs/μL in adults, all mononuclear). The blood-brain barrier selectively restricts entry of proteins and cells. In meningitis, the barrier is disrupted, allowing WBC migration, protein leakage, and glucose consumption. Bacterial meningitis: neutrophilic pleocytosis, very low glucose (<40 mg/dL or <60% of serum glucose), elevated protein. Viral meningitis: lymphocytic pleocytosis, normal to mildly low glucose, mildly elevated protein. Subarachnoid hemorrhage: RBCs present in all tubes (vs. traumatic tap where RBCs decrease from tube 1 to tube 4), xanthochromia (yellow supernatant from bilirubin/oxyhemoglobin)."
      },
      {
        sectionTitle: "Specimen Collection and Handling",
        content: "Collected by physician via lumbar puncture into 3-4 sterile numbered tubes. Tube 1: Chemistry and serology. Tube 2: Microbiology (Gram stain, culture). Tube 3: Cell count and differential (least likely to be contaminated by traumatic tap). Tube 4: Special studies (cytology, flow cytometry). CSF MUST be processed immediately — cells deteriorate rapidly (WBCs lyse within 1 hour, especially neutrophils). DO NOT refrigerate if culture is needed. Volume is limited (typically 1-3 mL per tube) — prioritize tests based on clinical suspicion.",
        imageUrl: "/images/mlt/csf-tube-distribution-guide.png",
        imageAlt: "Guide showing CSF collection tube distribution: Tube 1 chemistry, Tube 2 microbiology, Tube 3 cell count, Tube 4 special studies"
      },
      {
        sectionTitle: "Laboratory Methods",
        content: "Cell count: Manual hemocytometer (Neubauer chamber) — count undiluted CSF (or diluted with saline if bloody). WBC count: If RBCs present, lyse with 3% acetic acid (add crystal violet to identify WBCs) before counting. Differential: Cytospin preparation, Wright-Giemsa stain. Glucose: Same method as serum glucose (hexokinase or glucose oxidase). Protein: Turbidimetric (trichloroacetic acid precipitation or Coomassie blue dye binding). Gram stain: Cytocentrifuged concentrate for increased sensitivity. Culture: Blood agar, chocolate agar (incubate in CO2), thioglycollate broth."
      },
      {
        sectionTitle: "Interpretation of Results",
        content: "Normal CSF: Clear, colorless, 0-5 WBC/μL (mononuclear), 0 RBC/μL, glucose 40-70 mg/dL (60-70% of serum glucose), protein 15-45 mg/dL. Bacterial meningitis: Turbid, 100-10,000+ WBC/μL (predominantly neutrophils >80%), glucose <40 mg/dL, protein >250 mg/dL, Gram stain positive in 60-90%. Viral meningitis: Clear to slightly turbid, 10-500 WBC/μL (predominantly lymphocytes), glucose normal to mildly decreased, protein 50-200 mg/dL. TB/fungal meningitis: 10-500 WBC/μL (lymphocytes predominant), very low glucose, very high protein. Subarachnoid hemorrhage: RBCs in all tubes, xanthochromia."
      },
      {
        sectionTitle: "Quality Control Considerations",
        content: "Verify hemocytometer calibration. Perform cell count immediately (cells degrade rapidly). If cell count is low, count all 9 large squares of the hemocytometer (undiluted) for maximum precision. Verify CSF glucose by comparing to simultaneously drawn serum glucose (CSF:serum ratio). Document specimen appearance (clarity, color, presence of xanthochromia). Run QC on chemistry analyzers before stat CSF glucose and protein."
      },
      {
        sectionTitle: "Clinical Correlation",
        content: "Bacterial meningitis: Medical emergency requiring immediate antibiotics. Common organisms: Neisseria meningitidis (gram-negative diplococci), Streptococcus pneumoniae (gram-positive diplococci), Group B Streptococcus and E. coli (neonates), Listeria monocytogenes (elderly, immunocompromised). Viral meningitis: Usually self-limited (enteroviruses most common). TB meningitis: Requires acid-fast stain and mycobacterial culture (slow-growing). Cryptococcal meningitis: India ink preparation, cryptococcal antigen testing (immunocompromised patients)."
      },
      {
        sectionTitle: "Common Laboratory Errors",
        content: "Delayed processing: Cells deteriorate rapidly — neutrophils lyse within 30-60 minutes, giving falsely low counts and shifting the differential toward lymphocyte predominance. Traumatic tap confusion: Misinterpreting blood from traumatic LP as subarachnoid hemorrhage — check for xanthochromia (present in SAH, absent in traumatic tap) and decreasing RBC count from tube 1 to tube 4 (traumatic tap). Using the wrong tube for cell count: Tube 3 is preferred (least contaminated by traumatic blood). Not calculating CSF:serum glucose ratio: CSF glucose alone without comparison to serum can be misleading."
      },
      {
        sectionTitle: "Clinical Pearls",
        content: "CSF is the most time-critical specimen in the laboratory — process immediately upon receipt. Neutrophilic predominance suggests bacterial meningitis; lymphocytic predominance suggests viral, TB, or fungal. CSF glucose <40 mg/dL or CSF:serum ratio <0.6 = strongly suggests bacterial or TB meningitis. Xanthochromia distinguishes SAH (yellow supernatant from bilirubin) from traumatic tap (clear supernatant after centrifugation). A negative Gram stain does NOT rule out bacterial meningitis — sensitivity is only 60-90%. India ink is positive in only 50% of cryptococcal meningitis cases — use cryptococcal antigen (CrAg) for better sensitivity."
      }
    ],
    summary: "Comprehensive guide to CSF analysis including cell count methodology, chemistry interpretation, Gram stain, culture, and differentiation of bacterial, viral, and fungal meningitis.",
    objectives: [
      "Prioritize CSF specimen distribution to appropriate tubes",
      "Perform manual cell count on CSF using hemocytometer",
      "Differentiate bacterial from viral meningitis by CSF findings",
      "Distinguish traumatic tap from subarachnoid hemorrhage",
      "Identify common organisms causing meningitis by Gram stain morphology"
    ],
    glossaryTerms: [
      { term: "Pleocytosis", definition: "Elevated WBC count in CSF indicating CNS inflammation or infection" },
      { term: "Xanthochromia", definition: "Yellow discoloration of CSF supernatant from hemoglobin breakdown; indicates subarachnoid hemorrhage" },
      { term: "Traumatic tap", definition: "Blood introduced during lumbar puncture; RBC count decreases from tube 1 to tube 4" },
      { term: "India ink", definition: "Negative staining technique for Cryptococcus neoformans; capsule appears as clear halo against dark background" }
    ],
    estimatedMinutes: 22,
    sortOrder: 12,
    tier: "free",
    status: "published",
    seoTitle: "CSF Analysis & Meningitis Diagnosis | MLT Study Guide",
    seoDescription: "Master CSF analysis including cell count, chemistry, Gram stain, and differentiation of bacterial, viral, and fungal meningitis for MLT exams.",
    relatedQuestionDisciplines: ["Urinalysis & Body Fluids", "Microbiology"],
    relatedFlashcardDecks: ["CSF Analysis"]
  },
  {
    title: "Thyroid Function Testing",
    slug: "thyroid-function-testing-mlt",
    moduleTitle: "Clinical Chemistry",
    topicTitle: "Thyroid Function Tests",
    discipline: "Clinical Chemistry",
    disciplines: ["Clinical Chemistry"],
    countryTrack: "both",
    difficulty: "intermediate",
    blueprintCategories: ["Analytical", "Clinical Correlation"],
    content: [
      { sectionTitle: "Overview", content: "Thyroid function testing (TFTs) is one of the most commonly ordered endocrine panels. The primary screening test is thyroid-stimulating hormone (TSH), followed by free T4 (FT4) and free T3 (FT3) for further evaluation. Understanding the hypothalamic-pituitary-thyroid axis and the negative feedback loop is essential for interpreting TFTs and identifying thyroid disorders." },
      { sectionTitle: "Pathophysiology / Laboratory Significance", content: "The hypothalamus releases TRH (thyrotropin-releasing hormone), which stimulates the anterior pituitary to release TSH. TSH stimulates the thyroid gland to produce T4 (thyroxine, 80%) and T3 (triiodothyronine, 20%). T4 is converted to active T3 in peripheral tissues by deiodinases. Free (unbound) hormones are biologically active. Negative feedback: Elevated T4/T3 suppress TSH; low T4/T3 increase TSH. This feedback loop makes TSH the most sensitive initial screening test — it changes logarithmically in response to small changes in T4." },
      { sectionTitle: "Specimen Collection and Handling", content: "Serum (SST/gold-top tube). No fasting required. Biotin supplementation can cause significant interference with immunoassays — recommend discontinuing biotin for 48 hours before testing (biotin interferes with streptavidin-biotin-based platforms). TSH has a circadian rhythm (peaks at night, nadir in afternoon) — timing generally not critical for routine screening but important for monitoring. Grossly hemolyzed or lipemic specimens may interfere with immunoassay measurements." },
      { sectionTitle: "Laboratory Methods", content: "TSH: Third-generation immunometric (sandwich) assays using chemiluminescent (CLIA) or electrochemiluminescent (ECLIA) detection. Functional sensitivity ≤0.02 mIU/L for distinguishing hyperthyroid from euthyroid states. Free T4 and Free T3: Competitive immunoassays — analyte competes with labeled analog for limited antibody. Alternatively, equilibrium dialysis followed by RIA/LC-MS/MS is the reference method for free T4 (used when binding protein abnormalities are suspected). Total T4/T3: Competitive immunoassays measuring both bound and free fractions — affected by TBG (thyroxine-binding globulin) changes." },
      { sectionTitle: "Interpretation of Results", content: "Normal ranges: TSH 0.4-4.0 mIU/L, FT4 0.8-1.8 ng/dL, FT3 2.3-4.2 pg/mL. Primary hypothyroidism: High TSH, low FT4 (most common: Hashimoto thyroiditis). Subclinical hypothyroidism: High TSH, normal FT4. Primary hyperthyroidism: Low TSH, high FT4 and/or FT3 (most common: Graves disease). Subclinical hyperthyroidism: Low TSH, normal FT4 and FT3. Secondary (pituitary) hypothyroidism: Low or normal TSH, low FT4 (TSH is inappropriately low). Sick euthyroid syndrome (non-thyroidal illness): Low T3, variable T4 and TSH — avoid testing TFTs during acute illness if possible." },
      { sectionTitle: "Quality Control Considerations", content: "Run multi-level QC (low, normal, high) for TSH and free T4. Monitor Levey-Jennings charts for trends. Screen for biotin interference — increasingly common with over-the-counter biotin supplements. In sandwich assays (TSH), biotin causes falsely LOW results. In competitive assays (FT4, FT3), biotin causes falsely HIGH results — combined pattern mimics hyperthyroidism. Verify heterophilic antibody interference when results are clinically discordant." },
      { sectionTitle: "Clinical Correlation", content: "Hashimoto thyroiditis: Most common cause of hypothyroidism in iodine-sufficient areas. Anti-TPO antibodies elevated. Graves disease: Most common cause of hyperthyroidism. TSH receptor antibodies (TRAb) positive. Thyroid storm: Severe hyperthyroidism — medical emergency. Myxedema coma: Severe hypothyroidism — medical emergency. Pregnancy: TSH decreases in first trimester (hCG stimulates thyroid receptor) — use trimester-specific reference ranges. Central hypothyroidism: Pituitary failure — TSH is not elevated despite low T4." },
      { sectionTitle: "Common Laboratory Errors", content: "Biotin interference: Falsely low TSH + falsely high FT4 mimics hyperthyroidism — patient is actually euthyroid. Always ask about biotin supplement use. Heterophilic antibodies (HAMA): Cause falsely abnormal results — suspect when results do not match clinical picture. Not using trimester-specific TSH reference ranges in pregnancy. Testing TFTs during acute illness (sick euthyroid syndrome produces confusing results). Using total T4 instead of free T4 in patients with altered binding protein levels (pregnancy, oral contraceptives increase TBG → increase total T4 but free T4 is normal)." },
      { sectionTitle: "Clinical Pearls", content: "TSH is the single best screening test for thyroid disorders — it changes logarithmically in response to small changes in free T4. Biotin interference is a growing problem — in sandwich assays (TSH) it causes falsely LOW results; in competitive assays (FT4) it causes falsely HIGH results — mimicking Graves disease. In central hypothyroidism (pituitary failure), TSH is not elevated — the screening TSH will miss this diagnosis. Always compare free T4, not total T4, for accurate assessment. T3 thyrotoxicosis: Elevated T3 with normal T4 — early Graves disease; order FT3 when TSH is suppressed but FT4 is normal." }
    ],
    summary: "Comprehensive laboratory guide to thyroid function testing including TSH, free T4, free T3 methodology, interpretation of hypo/hyperthyroid patterns, biotin interference, and clinical correlations.",
    objectives: [
      "Explain the hypothalamic-pituitary-thyroid feedback axis",
      "Interpret TSH and FT4 patterns for thyroid disorders",
      "Identify biotin interference in thyroid immunoassays",
      "Differentiate primary from secondary thyroid dysfunction",
      "Apply trimester-specific reference ranges for pregnancy"
    ],
    glossaryTerms: [
      { term: "TSH", definition: "Thyroid-stimulating hormone; most sensitive screening test for thyroid disorders; produced by anterior pituitary" },
      { term: "Free T4", definition: "Unbound thyroxine; biologically active fraction; not affected by binding protein changes" },
      { term: "Biotin interference", definition: "Vitamin B7 supplement causing falsely low TSH and falsely high FT4 in streptavidin-biotin-based immunoassays" },
      { term: "Sick euthyroid syndrome", definition: "Abnormal TFTs during acute illness without true thyroid disease; typically low T3, variable T4/TSH" }
    ],
    estimatedMinutes: 20,
    sortOrder: 13,
    tier: "free",
    status: "published",
    seoTitle: "Thyroid Function Testing | MLT Certification Study Guide",
    seoDescription: "Master TSH, FT4, FT3 interpretation, biotin interference, and thyroid disorder patterns for CSMLS and ASCP MLT exams.",
    relatedQuestionDisciplines: ["Clinical Chemistry"],
    relatedFlashcardDecks: ["Thyroid Function Testing"]
  },
  {
    title: "Cardiac Biomarkers: Troponin and Beyond",
    slug: "cardiac-biomarkers-troponin-mlt",
    moduleTitle: "Clinical Chemistry",
    topicTitle: "Cardiac Biomarkers",
    discipline: "Clinical Chemistry",
    disciplines: ["Clinical Chemistry"],
    countryTrack: "both",
    difficulty: "intermediate",
    blueprintCategories: ["Analytical", "Clinical Correlation"],
    content: [
      { sectionTitle: "Overview", content: "Cardiac biomarkers are blood tests used to diagnose acute myocardial infarction (AMI), assess heart failure severity, and risk-stratify cardiac patients. High-sensitivity cardiac troponin (hs-cTn) has replaced CK-MB as the gold standard biomarker for myocardial injury. BNP and NT-proBNP are used for heart failure diagnosis. Understanding the kinetics, methodology, and clinical interpretation of cardiac biomarkers is essential for MLT practice." },
      { sectionTitle: "Pathophysiology / Laboratory Significance", content: "Troponin I (cTnI) and troponin T (cTnT) are structural proteins of the cardiac sarcomere that regulate actin-myosin interaction. They are highly cardiac-specific and are released into the blood when cardiomyocytes are damaged. Troponin begins rising 2-4 hours after myocardial injury, peaks at 12-24 hours, and remains elevated for 7-14 days. High-sensitivity troponin assays (hs-cTn) can detect very low concentrations, enabling earlier AMI diagnosis (within 1-3 hours of presentation). CK-MB: Creatine kinase MB isoenzyme, previously the primary AMI marker. Rises 4-6 hours, peaks 12-24 hours, returns to normal in 48-72 hours. BNP/NT-proBNP: Released from ventricular myocytes in response to volume overload and stretch — markers of heart failure." },
      { sectionTitle: "Specimen Collection and Handling", content: "Troponin: Serum (SST) or plasma (heparin). Serial sampling at 0, 3, and 6 hours per current guidelines (0 and 1 hour with hs-cTn rapid algorithms). Avoid hemolysis — significant interferent. CK-MB: Serum or heparin plasma. BNP: EDTA plasma (BNP is unstable in serum). NT-proBNP: Serum or plasma (more stable than BNP). Specimens should be analyzed promptly or stored at 2-8°C. Point-of-care troponin testing available for emergency departments." },
      { sectionTitle: "Laboratory Methods", content: "High-sensitivity troponin: Sandwich immunoassay (chemiluminescent or electrochemiluminescent). Defined as assay that can measure cTn in >50% of a healthy reference population with CV <10% at the 99th percentile. CK-MB: Immunoinhibition method (immunologically blocks CK-M subunit activity, measures residual CK-B activity) or mass assay (immunometric). BNP: Sandwich immunoassay on automated platforms. NT-proBNP: Electrochemiluminescent immunoassay (Roche) or chemiluminescent. Note: BNP and NT-proBNP are NOT interchangeable — different assays, different reference ranges, different half-lives." },
      { sectionTitle: "Interpretation of Results", content: "hs-cTn: 99th percentile upper reference limit (URL) is the diagnostic cutoff. Rising/falling pattern (delta change ≥20% at 3 hours) distinguishes acute MI from chronic troponin elevation. Elevated troponin without dynamic change may indicate chronic conditions (renal failure, heart failure, myocarditis). CK-MB: Elevated in AMI, rhabdomyolysis (use CK-MB/total CK ratio — ratio >5% suggests cardiac origin). BNP: <100 pg/mL = heart failure unlikely, >400 pg/mL = heart failure likely. NT-proBNP: Age-dependent cutoffs — <300 pg/mL rules out HF in all age groups, positive cutoffs increase with age." },
      { sectionTitle: "Quality Control Considerations", content: "Run multi-level QC for troponin assays. Verify functional sensitivity meets manufacturer claims. Monitor for lot-to-lot variation — troponin assays are highly sensitive to calibration shifts. Verify 99th percentile URL established using sex-specific healthy reference populations. Hemolysis index monitoring is essential — hemolysis interferes with some troponin assays. Check for heterophilic antibody interference when results are clinically unexpected." },
      { sectionTitle: "Clinical Correlation", content: "Acute MI (STEMI/NSTEMI): Rising/falling troponin pattern with ischemic symptoms and/or ECG changes. Type 1 MI: Atherosclerotic plaque rupture. Type 2 MI: Supply/demand mismatch (hypotension, tachycardia, anemia). Myocarditis: Troponin elevated with inflammatory pattern. Chronic kidney disease: Chronically elevated troponin (impaired clearance) — look for delta change to diagnose acute MI. Pulmonary embolism: Troponin elevation indicates right ventricular strain. Heart failure: BNP/NT-proBNP elevation correlates with severity." },
      { sectionTitle: "Common Laboratory Errors", content: "Using non-high-sensitivity troponin assay and reporting as 'negative' too early — standard assays miss early AMI. Not recognizing chronic troponin elevation in renal failure patients — look for rising/falling pattern, not absolute value. Reporting BNP and NT-proBNP interchangeably — they have different reference ranges. Hemolysis interference causing false troponin results. Failure to use sex-specific 99th percentile cutoffs (females have lower troponin thresholds)." },
      { sectionTitle: "Clinical Pearls", content: "Troponin is the ONLY recommended biomarker for AMI diagnosis — CK-MB is no longer first-line. High-sensitivity troponin can detect AMI within 1-3 hours of presentation using 0/1-hour or 0/3-hour algorithms. A rising/falling pattern (delta change) is essential — a single elevated troponin is not diagnostic of acute MI. BNP <100 pg/mL has strong negative predictive value for heart failure. Obesity falsely LOWERS BNP levels (adipose tissue clears BNP) — use NT-proBNP in obese patients. Renal failure chronically elevates both troponin and NT-proBNP — serial measurements and delta changes are essential." }
    ],
    summary: "Complete laboratory guide to cardiac biomarkers including high-sensitivity troponin, CK-MB, BNP, and NT-proBNP for AMI diagnosis, heart failure assessment, and clinical decision-making.",
    objectives: [
      "Describe troponin kinetics and the significance of rising/falling patterns",
      "Compare high-sensitivity troponin with CK-MB for AMI diagnosis",
      "Interpret BNP and NT-proBNP for heart failure assessment",
      "Identify analytical interferences in cardiac biomarker testing",
      "Apply sex-specific and age-specific reference ranges"
    ],
    glossaryTerms: [
      { term: "hs-cTn", definition: "High-sensitivity cardiac troponin; assay capable of measuring troponin in >50% of healthy individuals" },
      { term: "99th percentile URL", definition: "Upper reference limit; diagnostic cutoff for troponin; sex-specific" },
      { term: "Delta change", definition: "Rising or falling troponin pattern (≥20% change at 3 hours); distinguishes acute MI from chronic elevation" },
      { term: "NT-proBNP", definition: "N-terminal pro-B-type natriuretic peptide; heart failure biomarker with age-dependent cutoffs" }
    ],
    estimatedMinutes: 20,
    sortOrder: 14,
    tier: "free",
    status: "published",
    seoTitle: "Cardiac Biomarkers: Troponin, BNP | MLT Study Guide",
    seoDescription: "Master high-sensitivity troponin, CK-MB, BNP, NT-proBNP for AMI and heart failure diagnosis in MLT certification exams.",
    relatedQuestionDisciplines: ["Clinical Chemistry"],
    relatedFlashcardDecks: ["Cardiac Biomarkers"]
  },
  {
    title: "Hemolytic Anemia: Laboratory Workup",
    slug: "hemolytic-anemia-lab-workup",
    moduleTitle: "Hematology",
    topicTitle: "Hemolytic Anemia Workup",
    discipline: "Hematology",
    disciplines: ["Hematology", "Immunohematology / Blood Banking", "Clinical Chemistry"],
    countryTrack: "both",
    difficulty: "advanced",
    blueprintCategories: ["Analytical", "Clinical Correlation"],
    content: [
      { sectionTitle: "Overview", content: "Hemolytic anemia results from premature destruction of red blood cells, either intravascularly or extravascularly. The laboratory workup differentiates immune from non-immune causes and intravascular from extravascular hemolysis. Key markers include elevated reticulocyte count, elevated LDH, elevated indirect bilirubin, decreased haptoglobin, positive DAT (immune hemolysis), and characteristic peripheral smear findings." },
      { sectionTitle: "Pathophysiology / Laboratory Significance", content: "Extravascular hemolysis: RBCs destroyed by macrophages in the spleen/liver. Hemoglobin is catabolized to bilirubin (unconjugated/indirect bilirubin rises). Haptoglobin may be decreased but not absent. No hemoglobinemia or hemoglobinuria. Causes: hereditary spherocytosis, warm autoimmune hemolytic anemia (WAIHA), sickle cell disease. Intravascular hemolysis: RBCs lyse within the circulation. Free hemoglobin saturates haptoglobin (haptoglobin undetectable), excess hemoglobin appears in plasma (hemoglobinemia) and urine (hemoglobinuria). Hemosiderin appears in urine days later. Causes: ABO transfusion reactions, paroxysmal nocturnal hemoglobinuria (PNH), mechanical valve hemolysis, microangiopathic hemolytic anemia (TTP/HUS/DIC).",
        imageUrl: "/images/mlt/hemolysis-markers-comparison.png",
        imageAlt: "Comparison chart of laboratory markers in intravascular versus extravascular hemolysis showing haptoglobin, bilirubin, LDH, and hemoglobin patterns"
      },
      { sectionTitle: "Specimen Collection and Handling", content: "CBC with reticulocyte count: EDTA tube. Peripheral smear: EDTA within 2 hours. LDH, indirect bilirubin, haptoglobin: Serum (SST). Avoid hemolyzed specimens — they falsely elevate LDH and free hemoglobin. DAT (Direct Antiglobulin Test): EDTA tube, process promptly. Hemoglobin in plasma: Heparin tube, centrifuge gently to avoid in vitro hemolysis. Urine hemosiderin: Random urine, Prussian blue stain. Cold agglutinin specimens: Collect in pre-warmed tube, transport at 37°C." },
      { sectionTitle: "Laboratory Methods", content: "Reticulocyte count: Flow cytometry (thiazole orange) or manual supravital stain (new methylene blue). LDH: Enzymatic kinetic assay (lactate → pyruvate, NADH production at 340 nm). Haptoglobin: Immunonephelometry or immunoturbidimetry. DAT (Direct Coombs): RBCs washed and tested with polyspecific AHG (anti-IgG + anti-C3d), then monospecific reagents. Positive DAT = antibody and/or complement bound to patient RBCs in vivo. Osmotic fragility: RBCs incubated in hypotonic saline solutions — spherocytes lyse at higher saline concentrations (increased fragility). Ham test / flow cytometry for PNH: CD55 and CD59 deficiency." },
      { sectionTitle: "Interpretation of Results", content: "Hemolysis markers: ↑ Reticulocyte count (>2%), ↑ LDH, ↑ indirect bilirubin, ↓ haptoglobin (most sensitive single marker). Immune hemolysis: Positive DAT. IgG-mediated (warm AIHA): Spherocytes on smear, DAT positive for IgG. C3d-mediated (cold AIHA): DAT positive for C3d, cold agglutinins. Non-immune hemolysis: Negative DAT. Mechanical: Schistocytes (TTP, DIC, valves). Membrane defect: Spherocytes (hereditary spherocytosis — DAT negative, increased osmotic fragility). Enzyme defect: Bite cells, Heinz bodies (G6PD deficiency)." },
      { sectionTitle: "Quality Control Considerations", content: "Specimen hemolysis must be carefully assessed — in vitro hemolysis mimics intravascular hemolysis markers. Always note hemolysis index on chemistry results. DAT reagents require daily QC with known positive and negative control cells. Haptoglobin is an acute phase reactant — may be falsely normal despite hemolysis if concurrent inflammation exists. Reticulocyte count should be corrected for anemia (reticulocyte production index = RPI)." },
      { sectionTitle: "Clinical Correlation", content: "Warm AIHA: IgG autoantibodies active at 37°C — spherocytes, positive DAT (IgG), extravascular hemolysis. Treat with steroids, rituximab. Cold agglutinin disease: IgM autoantibodies active at 4°C — complement-mediated hemolysis, DAT positive (C3d only), acrocyanosis. Hereditary spherocytosis: Most common inherited hemolytic anemia — spherocytes, increased osmotic fragility, negative DAT, splenomegaly. G6PD deficiency: Episodic hemolysis triggered by oxidative stress (drugs, fava beans, infection) — Heinz bodies, bite cells. TTP/HUS: Schistocytes + thrombocytopenia + renal failure — medical emergency." },
      { sectionTitle: "Common Laboratory Errors", content: "In vitro hemolysis mimicking intravascular hemolysis — always correlate with clinical picture and note hemolysis index. Not performing DAT to differentiate immune from non-immune hemolysis. Using haptoglobin alone — it is an acute phase reactant that may be falsely normal in concurrent infection/inflammation. Not identifying schistocytes on smear in TTP/DIC — life-threatening diagnoses that require immediate notification. Performing G6PD testing during acute hemolytic episode — G6PD-deficient older RBCs have been destroyed, leaving young RBCs with near-normal G6PD levels (falsely normal result)." },
      { sectionTitle: "Clinical Pearls", content: "Haptoglobin is the most sensitive single marker for hemolysis — an undetectable haptoglobin in the absence of liver disease is virtually diagnostic. Positive DAT = immune hemolysis; negative DAT = non-immune (think membrane, enzyme, or mechanical). Schistocytes on a smear require immediate clinical notification — TTP/DIC are emergencies. Do NOT test G6PD during acute crisis — wait 2-3 months for accurate results. In warm AIHA, the autoantibody often has anti-e or anti-Rh specificity — finding compatible blood for transfusion can be challenging (blood bank must be notified)." }
    ],
    summary: "Comprehensive laboratory approach to hemolytic anemia workup including markers of hemolysis, DAT interpretation, peripheral smear findings, and differentiation of immune from non-immune causes.",
    objectives: [
      "Identify the laboratory markers of intravascular vs extravascular hemolysis",
      "Interpret the Direct Antiglobulin Test for immune hemolytic anemia",
      "Recognize characteristic smear findings in different hemolytic anemias",
      "Differentiate warm AIHA from cold agglutinin disease",
      "Apply the hemolysis workup algorithm systematically"
    ],
    glossaryTerms: [
      { term: "DAT", definition: "Direct Antiglobulin Test (Direct Coombs); detects antibody/complement bound to patient RBCs in vivo" },
      { term: "Haptoglobin", definition: "Plasma protein that binds free hemoglobin; consumed in hemolysis; most sensitive hemolysis marker" },
      { term: "Schistocytes", definition: "Fragmented red blood cells indicating mechanical hemolysis (TTP, HUS, DIC, prosthetic valves)" },
      { term: "Spherocytes", definition: "Small, round, dense RBCs without central pallor; seen in hereditary spherocytosis and warm AIHA" }
    ],
    estimatedMinutes: 25,
    sortOrder: 15,
    tier: "free",
    status: "published",
    seoTitle: "Hemolytic Anemia Lab Workup | MLT Certification Guide",
    seoDescription: "Master hemolytic anemia laboratory diagnosis including DAT, hemolysis markers, peripheral smear, and immune vs non-immune differentiation for MLT exams.",
    relatedQuestionDisciplines: ["Hematology", "Immunohematology / Blood Banking"],
    relatedFlashcardDecks: ["Hemolytic Anemia Workup"]
  },
  {
    title: "Platelet Function Testing and Disorders",
    slug: "platelet-function-testing-disorders",
    moduleTitle: "Hemostasis / Coagulation",
    topicTitle: "Platelet Function Testing",
    discipline: "Hemostasis / Coagulation",
    disciplines: ["Hemostasis / Coagulation", "Hematology"],
    countryTrack: "both",
    difficulty: "advanced",
    blueprintCategories: ["Analytical", "Clinical Correlation"],
    content: [
      { sectionTitle: "Overview", content: "Platelet function testing evaluates primary hemostasis — the ability of platelets to adhere, activate, and aggregate to form a platelet plug. Testing is indicated for patients with mucocutaneous bleeding (petechiae, purpura, epistaxis, menorrhagia) despite normal platelet counts and normal PT/aPTT. Methods include the PFA-100, platelet aggregometry, and flow cytometry." },
      { sectionTitle: "Pathophysiology / Laboratory Significance", content: "Primary hemostasis involves: (1) Adhesion — platelets bind to exposed subendothelial collagen via vWF/GPIb-IX-V receptor; (2) Activation — shape change, granule release (ADP, thromboxane A2, serotonin from dense granules; fibrinogen, vWF, PF4 from alpha granules); (3) Aggregation — fibrinogen cross-links activated platelets via GPIIb/IIIa receptors. Disorders: von Willebrand disease (vWF deficiency — most common inherited bleeding disorder), Bernard-Soulier syndrome (GPIb deficiency — defective adhesion, giant platelets), Glanzmann thrombasthenia (GPIIb/IIIa deficiency — defective aggregation)." },
      { sectionTitle: "Specimen Collection and Handling", content: "Platelet aggregometry: Citrate tube (3.2% sodium citrate, blue-top). Platelet-rich plasma (PRP) prepared by slow centrifugation (150-200×g, 10 minutes). Analyze within 4 hours. Specimen must be kept at room temperature — DO NOT refrigerate (cold activates platelets). PFA-100: Citrate tube, analyze within 4 hours. Patient should avoid aspirin and NSAIDs for 7-10 days before testing — these drugs affect results." },
      { sectionTitle: "Laboratory Methods", content: "PFA-100 (Platelet Function Analyzer): Screens for platelet dysfunction by measuring closure time — citrated blood flows through a capillary and adheres to a membrane coated with collagen/epinephrine (Col/EPI) or collagen/ADP (Col/ADP). Normal closure times: Col/EPI <175 sec, Col/ADP <120 sec. Prolonged Col/EPI with normal Col/ADP = aspirin effect. Both prolonged = vWD or intrinsic platelet defect. Platelet aggregometry: Gold standard. PRP exposed to agonists (ADP, epinephrine, collagen, ristocetin, arachidonic acid). Aggregation measured by light transmission through PRP as platelets clump (increased light transmission = aggregation). Ristocetin-induced platelet aggregation (RIPA): Tests vWF-GPIb interaction — absent in vWD type 2B and Bernard-Soulier." },
      { sectionTitle: "Interpretation of Results", content: "von Willebrand disease: Decreased ristocetin aggregation, decreased or absent response to ristocetin. Reduced vWF antigen and activity (ristocetin cofactor). Type 1: Quantitative reduction (most common, 70-80%). Type 2: Qualitative defects (multiple subtypes). Type 3: Complete absence (rare, severe bleeding). Bernard-Soulier syndrome: Absent ristocetin aggregation (not corrected by adding normal plasma, unlike vWD), normal response to other agonists. Giant platelets on smear. Glanzmann thrombasthenia: Absent aggregation to ALL agonists EXCEPT ristocetin (ristocetin tests adhesion, not aggregation). Aspirin/NSAID effect: Absent arachidonic acid response, decreased collagen response, decreased secondary wave to ADP and epinephrine." },
      { sectionTitle: "Quality Control Considerations", content: "PFA-100: Run normal control cartridge daily. Verify hematocrit >30% and platelet count >100,000 — both affect closure times (anemia and thrombocytopenia cause prolonged results independent of platelet function). Aggregometry: Calibrate with PRP (0% baseline) and PPP (100% aggregation). Run normal donor control with each batch. Verify agonist concentrations and expiration dates. Document medication history (aspirin, clopidogrel, NSAIDs)." },
      { sectionTitle: "Clinical Correlation", content: "von Willebrand disease: Most common inherited bleeding disorder (1% prevalence). Mucocutaneous bleeding, menorrhagia, post-surgical bleeding. Treatment: Desmopressin (DDAVP) for type 1, vWF concentrates for severe types. Bernard-Soulier: Rare autosomal recessive, giant platelets, severe mucocutaneous bleeding. Glanzmann thrombasthenia: Rare autosomal recessive, severe bleeding with normal platelet count. Acquired platelet dysfunction: Uremia (dialysis improves function), myeloproliferative disorders, cardiopulmonary bypass." },
      { sectionTitle: "Common Laboratory Errors", content: "Not checking medication history — aspirin and NSAIDs cause abnormal results that mimic intrinsic platelet defects. Refrigerating PRP — cold activates platelets, causing false aggregation results. Running PFA-100 on specimens with hematocrit <30% or platelet count <100,000 — results are unreliable. Not differentiating Bernard-Soulier (giant platelets, absent ristocetin, NOT corrected by normal plasma) from vWD (absent ristocetin, CORRECTED by adding normal plasma). Delayed testing — platelet function deteriorates in stored specimens." },
      { sectionTitle: "Clinical Pearls", content: "Ristocetin tests vWF-GPIb ADHESION — it is the only agonist that tests this pathway. Absent ristocetin response = think vWD or Bernard-Soulier. Absent response to ALL agonists EXCEPT ristocetin = Glanzmann thrombasthenia (GPIIb/IIIa deficiency). PFA-100 Col/EPI prolonged with normal Col/ADP = aspirin effect — the most common cause of prolonged PFA-100. Always check hematocrit and platelet count before interpreting PFA-100 — both must be adequate. vWD type 2B shows INCREASED ristocetin aggregation (enhanced vWF-platelet binding) — opposite of other vWD types." }
    ],
    summary: "Comprehensive guide to platelet function testing including PFA-100, aggregometry, ristocetin testing, von Willebrand disease, Bernard-Soulier, and Glanzmann thrombasthenia diagnosis.",
    objectives: [
      "Describe PFA-100 and platelet aggregometry methodology",
      "Interpret aggregation patterns for von Willebrand disease",
      "Differentiate Bernard-Soulier from Glanzmann thrombasthenia",
      "Identify the effect of aspirin on platelet aggregation",
      "Apply pre-analytical requirements for platelet function testing"
    ],
    glossaryTerms: [
      { term: "Ristocetin", definition: "Antibiotic that induces vWF-GPIb binding; used to test platelet adhesion and diagnose vWD" },
      { term: "PFA-100", definition: "Platelet Function Analyzer; screens for platelet dysfunction by measuring closure time" },
      { term: "Glanzmann thrombasthenia", definition: "GPIIb/IIIa deficiency; absent aggregation to all agonists except ristocetin" },
      { term: "Bernard-Soulier syndrome", definition: "GPIb deficiency; absent ristocetin response, giant platelets, not corrected by normal plasma" }
    ],
    estimatedMinutes: 22,
    sortOrder: 16,
    tier: "free",
    status: "published",
    seoTitle: "Platelet Function Testing & Disorders | MLT Guide",
    seoDescription: "Master platelet aggregometry, PFA-100, von Willebrand disease, and platelet disorder diagnosis for CSMLS and ASCP MLT exams.",
    relatedQuestionDisciplines: ["Hemostasis / Coagulation", "Hematology"],
    relatedFlashcardDecks: ["Platelet Function Testing"]
  },
  {
    title: "Acid-Fast Staining and Mycobacteriology",
    slug: "acid-fast-staining-mycobacteriology",
    moduleTitle: "Microbiology",
    topicTitle: "Acid-Fast Staining",
    discipline: "Microbiology",
    disciplines: ["Microbiology"],
    countryTrack: "both",
    difficulty: "intermediate",
    blueprintCategories: ["Analytical", "Clinical Correlation", "Safety & Compliance"],
    content: [
      { sectionTitle: "Overview", content: "Acid-fast staining is the primary method for detecting mycobacteria, including Mycobacterium tuberculosis and nontuberculous mycobacteria (NTM). Mycobacteria have cell walls containing mycolic acid, which resists conventional Gram staining but retains carbol fuchsin dye after acid-alcohol decolorization. Detection of acid-fast bacilli (AFB) in clinical specimens triggers immediate public health reporting and infection control measures." },
      { sectionTitle: "Pathophysiology / Laboratory Significance", content: "Mycobacteria possess unique cell walls with high mycolic acid content (60% of cell wall weight), making them: acid-fast (resist decolorization), slow-growing (generation time 15-20 hours vs minutes for typical bacteria), resistant to many disinfectants and antibiotics. M. tuberculosis is transmitted via airborne droplets and primarily infects the lungs. The laboratory plays a critical role in diagnosis because clinical symptoms are nonspecific and culture remains the gold standard. AFB smear microscopy provides rapid preliminary results within hours." },
      { sectionTitle: "Specimen Collection and Handling", content: "Sputum: Three specimens collected on separate days (ideally early morning, deep cough). Minimum 5-10 mL volume. Induced sputum (hypertonic saline nebulization) if patient cannot produce adequate specimen. Other specimens: Bronchial washings, gastric aspirates (pediatric), tissue biopsies, body fluids, urine (first morning void on 3 consecutive days). ALL specimens handled in BSL-3 conditions or biological safety cabinet (BSC) due to aerosol transmission risk. Transport in sealed, leak-proof containers." },
      { sectionTitle: "Laboratory Methods", content: "Ziehl-Neelsen (ZN) hot stain: (1) Flood with carbol fuchsin, heat until steaming for 5 minutes (heat drives dye into mycolic acid layer); (2) Decolorize with acid-alcohol (3% HCl in 95% ethanol); (3) Counterstain with methylene blue. AFB appear RED against BLUE background. Kinyoun cold stain: Higher concentration carbol fuchsin without heating — same result, less hazardous. Auramine-rhodamine fluorescent stain: Mycobacteria fluoresce yellow-green under UV microscopy. More sensitive than ZN (larger area scanned at lower magnification). Positive fluorescent smears should be confirmed with ZN. Culture: Lowenstein-Jensen (LJ) egg-based medium and Middlebrook 7H10/7H11 agar. Automated liquid culture (BACTEC MGIT 960) reduces detection time to 1-2 weeks vs 4-8 weeks for solid media.",
        imageUrl: "/images/mlt/afb-smear-ziehl-neelsen.png",
        imageAlt: "Acid-fast bacilli (AFB) on Ziehl-Neelsen stain showing red rod-shaped mycobacteria against blue background"
      },
      { sectionTitle: "Interpretation of Results", content: "Smear reporting (standardized): No AFB seen, 1-2 AFB/300 fields (report number and request additional specimen), 1-9 AFB/100 fields (1+), 1-9 AFB/10 fields (2+), 1-9 AFB/field (3+), >9 AFB/field (4+). Smear-positive patients are the most infectious. Culture identification: M. tuberculosis complex confirmed by nucleic acid amplification testing (NAAT), growth rate, colony morphology, and biochemical tests (niacin positive, nitrate reduction positive). Drug susceptibility testing on all M. tuberculosis isolates (rifampin, isoniazid, ethambutol, pyrazinamide, fluoroquinolones)." },
      { sectionTitle: "Quality Control Considerations", content: "Process all mycobacteriology specimens in a certified biological safety cabinet (BSC Class II or III). Run positive AFB control (heat-killed M. gordonae or M. fortuitum) and negative control with each staining run. Monitor fluorescent microscope lamp intensity (replace at manufacturer-specified intervals). Participate in proficiency testing for AFB smear and culture. Document decontamination and digestion (NALC-NaOH) procedure for contamination rate monitoring (acceptable: <5% contaminated cultures)." },
      { sectionTitle: "Clinical Correlation", content: "Pulmonary TB: Cough >3 weeks, hemoptysis, night sweats, weight loss. Smear-positive = highly infectious, requires respiratory isolation. Drug-resistant TB: MDR-TB (resistant to INH + rifampin), XDR-TB (MDR + fluoroquinolone + injectable agent resistance). Nontuberculous mycobacteria: M. avium complex (MAC) in immunocompromised (HIV/AIDS), M. abscessus (cystic fibrosis patients), M. marinum (fish tank granuloma). Latent TB: Positive TST or IGRA with negative cultures — not infectious but may reactivate." },
      { sectionTitle: "Common Laboratory Errors", content: "Inadequate specimen (saliva instead of deep sputum): Low sensitivity. Overheating during ZN staining: Crystal formation obscures AFB. Under-decolorization: Non-mycobacterial organisms may retain carbol fuchsin (false positive). Cross-contamination between specimens during processing: False positive culture. Not performing NAAT on smear-positive specimens for rapid TB confirmation. Processing specimens outside the BSC: biosafety violation with aerosol exposure risk." },
      { sectionTitle: "Clinical Pearls", content: "AFB smear sensitivity is only 50-80% — a negative smear does NOT rule out TB. Culture is the gold standard and remains positive for several weeks even after treatment starts. Auramine-rhodamine is more sensitive than ZN (scans more fields at lower magnification) — preferred for high-volume laboratories. All smear-positive specimens should have NAAT performed for rapid TB confirmation. Niacin production is a key biochemical test — M. tuberculosis is niacin-positive (differentiates from most NTM). Three sputum specimens on different days improve detection by ~10-20% per additional specimen." }
    ],
    summary: "Comprehensive guide to acid-fast staining, AFB smear interpretation, mycobacterial culture methods, and TB diagnosis including biosafety considerations and drug susceptibility testing.",
    objectives: [
      "Perform and interpret Ziehl-Neelsen and auramine-rhodamine staining",
      "Report AFB smear results using standardized quantification",
      "Describe mycobacterial culture methods and identification",
      "Apply biosafety requirements for mycobacteriology",
      "Differentiate M. tuberculosis from nontuberculous mycobacteria"
    ],
    glossaryTerms: [
      { term: "Acid-fast", definition: "Property of mycobacteria to retain carbol fuchsin after acid-alcohol decolorization due to mycolic acid in cell wall" },
      { term: "Carbol fuchsin", definition: "Primary stain in AFB staining; penetrates mycolic acid layer with heat (ZN) or high concentration (Kinyoun)" },
      { term: "MGIT", definition: "Mycobacteria Growth Indicator Tube; automated liquid culture system for rapid mycobacterial detection" },
      { term: "MDR-TB", definition: "Multi-drug resistant tuberculosis; resistant to at least isoniazid and rifampin" }
    ],
    estimatedMinutes: 22,
    sortOrder: 17,
    tier: "free",
    status: "published",
    seoTitle: "Acid-Fast Staining & Mycobacteriology | MLT Study Guide",
    seoDescription: "Master AFB smear interpretation, Ziehl-Neelsen staining, mycobacterial culture, and TB diagnosis for CSMLS and ASCP MLT exams.",
    relatedQuestionDisciplines: ["Microbiology"],
    relatedFlashcardDecks: ["Acid-Fast Staining"]
  },
  {
    title: "Flow Cytometry: Principles and Clinical Applications",
    slug: "flow-cytometry-clinical-applications",
    moduleTitle: "Immunology / Serology",
    topicTitle: "Flow Cytometry",
    discipline: "Immunology / Serology",
    disciplines: ["Immunology / Serology", "Hematology"],
    countryTrack: "both",
    difficulty: "advanced",
    blueprintCategories: ["Analytical", "Instrumentation", "Clinical Correlation"],
    content: [
      { sectionTitle: "Overview", content: "Flow cytometry is a technology that analyzes individual cells in a fluid stream using laser-based detection. Cells are labeled with fluorochrome-conjugated antibodies targeting specific surface or intracellular markers (CD antigens). Flow cytometry is essential for immunophenotyping leukemias/lymphomas, monitoring HIV (CD4 counts), diagnosing PNH, and performing cross-matching in transplant immunology." },
      { sectionTitle: "Pathophysiology / Laboratory Significance", content: "Flow cytometry measures multiple parameters simultaneously on individual cells: forward scatter (FSC — correlates with cell size), side scatter (SSC — correlates with internal complexity/granularity), and fluorescence from labeled antibodies. CD (cluster of differentiation) markers identify cell lineage and maturation stage. CD3 = T cells, CD4 = helper T cells, CD8 = cytotoxic T cells, CD19/CD20 = B cells, CD56 = NK cells, CD34 = hematopoietic stem cells, CD13/CD33 = myeloid cells. Aberrant marker expression identifies neoplastic populations." },
      { sectionTitle: "Specimen Collection and Handling", content: "EDTA or heparin whole blood for immunophenotyping. Process within 24 hours (preferably <6 hours for optimal results). Bone marrow aspirate in EDTA for leukemia/lymphoma phenotyping. Tissue (lymph node) may be disaggregated into single-cell suspension. CSF and body fluids processed for lymphocyte subsets. Maintain at room temperature — do not freeze or refrigerate. Minimum cell count required varies by application." },
      { sectionTitle: "Laboratory Methods", content: "Sample preparation: Lyse-and-wash or stain-and-lyse technique. Cells incubated with fluorochrome-conjugated monoclonal antibodies (FITC, PE, APC, PerCP, etc.). Red cells lysed. Cells passed single-file through laser beam in the flow cell (hydrodynamic focusing). Fluorescence detected by photomultiplier tubes and analyzed as histograms (single parameter) or dot plots (two parameters). Gating strategy: FSC vs SSC identifies cell populations (lymphocytes, monocytes, granulocytes). Subsequent gates analyze marker expression on specific populations.",
        imageUrl: "/images/mlt/flow-cytometry-scatter-plot.png",
        imageAlt: "Flow cytometry FSC vs SSC scatter plot showing lymphocyte, monocyte, and granulocyte populations with gating regions"
      },
      { sectionTitle: "Interpretation of Results", content: "HIV monitoring: CD4 count (normal 500-1500 cells/μL). CD4 <200 = AIDS-defining. CD4:CD8 ratio normally >1.0, inverted in HIV. Leukemia immunophenotyping: ALL (CD10/CD19/CD34 for B-ALL; CD3/CD7 for T-ALL). AML (CD13/CD33/CD34/MPO). CLL (CD5+/CD19+/CD23+, dim CD20). Hairy cell leukemia (CD11c+/CD25+/CD103+/CD123+). PNH: Absence of CD55 and CD59 on RBCs and WBCs (GPI-anchored proteins). FLAER assay more sensitive for WBC analysis." },
      { sectionTitle: "Quality Control Considerations", content: "Daily instrument QC: Fluorescent beads verify laser alignment, fluorescence intensity, and coefficient of variation. Compensation: Correct for spectral overlap between fluorochromes using single-stained controls. Isotype controls or FMO (Fluorescence Minus One) controls identify non-specific binding. Verify target values for fluorescent bead QC on Levey-Jennings charts. Maintain reagent inventory and expiration tracking. Proficiency testing participation for immunophenotyping." },
      { sectionTitle: "Clinical Correlation", content: "Acute leukemia classification: Flow cytometry is essential for distinguishing ALL from AML and identifying lineage (B-cell, T-cell, myeloid). Guides treatment protocol selection. Minimal residual disease (MRD): Flow cytometry detects residual leukemia cells at 0.01% (1 in 10,000 cells) after treatment. HIV monitoring: CD4 count guides antiretroviral therapy initiation and prophylaxis decisions. PNH diagnosis: CD55/CD59 deficiency with FLAER assay. Transplant cross-matching: Flow cytometry cross-match detects donor-specific antibodies." },
      { sectionTitle: "Common Laboratory Errors", content: "Inadequate compensation: Spectral overlap between fluorochromes causes false positive co-expression. Not using proper gating strategy: Including debris or dead cells in analysis. Delayed specimen processing: Cell viability decreases, especially lymphocytes. Using wrong antibody panel for clinical question. Not verifying daily QC before running patient specimens. Misidentifying cell populations due to aberrant scatter properties in neoplastic cells." },
      { sectionTitle: "Clinical Pearls", content: "Forward scatter = cell SIZE, side scatter = GRANULARITY/COMPLEXITY — this is the foundation of flow cytometry analysis. CD4 count is the most important marker for HIV disease staging — <200 cells/μL defines AIDS. In leukemia phenotyping, aberrant marker expression (e.g., CD19+/CD5+ = CLL; CD10+/CD19+ = B-ALL) identifies neoplastic populations. PNH diagnosis requires FLAER assay on WBCs — more sensitive than CD55/CD59 on RBCs. Always verify compensation before interpreting multi-color panels — inadequate compensation is the most common source of analysis errors." }
    ],
    summary: "Complete guide to flow cytometry principles, instrumentation, immunophenotyping for leukemia/lymphoma, HIV CD4 monitoring, PNH diagnosis, and quality control.",
    objectives: [
      "Explain flow cytometry instrumentation and scatter parameters",
      "Identify CD marker panels for leukemia immunophenotyping",
      "Interpret CD4 counts for HIV monitoring and staging",
      "Describe PNH diagnosis using CD55, CD59, and FLAER",
      "Apply compensation and gating strategies for accurate analysis"
    ],
    glossaryTerms: [
      { term: "Forward scatter (FSC)", definition: "Light scattered in forward direction; correlates with cell size" },
      { term: "Side scatter (SSC)", definition: "Light scattered at 90°; correlates with cellular granularity/internal complexity" },
      { term: "CD4", definition: "Surface marker on helper T cells; critical for HIV monitoring; <200 cells/μL defines AIDS" },
      { term: "Compensation", definition: "Mathematical correction for spectral overlap between fluorochromes in multi-color flow cytometry" }
    ],
    estimatedMinutes: 25,
    sortOrder: 18,
    tier: "free",
    status: "published",
    seoTitle: "Flow Cytometry Principles & Applications | MLT Guide",
    seoDescription: "Master flow cytometry immunophenotyping, CD4 monitoring, leukemia classification, and PNH diagnosis for MLT certification exams.",
    relatedQuestionDisciplines: ["Immunology / Serology", "Hematology"],
    relatedFlashcardDecks: ["Flow Cytometry"]
  },
  {
    title: "Electrolyte Panel: Sodium, Potassium, Chloride, CO2",
    slug: "electrolyte-panel-interpretation-mlt",
    moduleTitle: "Clinical Chemistry",
    topicTitle: "Electrolyte Panel",
    discipline: "Clinical Chemistry",
    disciplines: ["Clinical Chemistry"],
    countryTrack: "both",
    difficulty: "intermediate",
    blueprintCategories: ["Analytical", "Clinical Correlation", "Instrumentation"],
    content: [
      { sectionTitle: "Overview", content: "The electrolyte panel (basic metabolic panel) measures sodium (Na+), potassium (K+), chloride (Cl−), and total CO2 (bicarbonate). These analytes are among the most frequently ordered laboratory tests and are critical for assessing fluid balance, acid-base status, and organ function. Electrolyte measurement by ion-selective electrodes (ISE) is a fundamental analytical technique in clinical chemistry." },
      { sectionTitle: "Pathophysiology / Laboratory Significance", content: "Sodium (135-145 mEq/L): Primary extracellular cation, maintains osmotic pressure. Hyponatremia: SIADH, heart failure, cirrhosis. Hypernatremia: Dehydration, diabetes insipidus. Potassium (3.5-5.0 mEq/L): Primary intracellular cation, critical for cardiac and neuromuscular function. Hypokalemia: Diuretics, vomiting, diarrhea. Hyperkalemia: Renal failure, hemolysis, acidosis, potassium-sparing diuretics. Chloride (98-106 mEq/L): Major extracellular anion, follows sodium. Low in metabolic alkalosis, high in metabolic acidosis. Total CO2 (22-28 mEq/L): Predominantly bicarbonate; reflects acid-base status." },
      { sectionTitle: "Specimen Collection and Handling", content: "Serum (SST) or plasma (lithium heparin — NOT sodium heparin for Na+, NOT potassium EDTA for K+). Avoid hemolysis — K+ released from lysed RBCs falsely elevates potassium (RBC K+ is 150 mEq/L vs plasma 4 mEq/L). Avoid fist clenching during collection (increases K+ by 1-2 mEq/L). Separate serum/plasma from cells within 1-2 hours to prevent glycolysis effects on bicarbonate and K+ leakage. CO2 specimens must be kept anaerobic — exposure to air falsely decreases total CO2." },
      { sectionTitle: "Laboratory Methods", content: "Ion-selective electrodes (ISE): Primary method for Na+, K+, Cl−. Direct ISE: Undiluted specimen — measures analyte activity directly (unaffected by protein/lipid). Used in blood gas analyzers and point-of-care devices. Indirect ISE: Diluted specimen — most common on large chemistry analyzers. Susceptible to pseudohyponatremia in hyperlipidemia or hyperproteinemia (dilution displaces water fraction). Total CO2: Enzymatic method — phosphoenolpyruvate carboxylase converts HCO3− and PEP to oxaloacetate; coupled to NADH consumption measured at 340 nm. Or, acidification releases CO2 measured by pCO2 electrode." },
      { sectionTitle: "Interpretation of Results", content: "Anion gap = Na+ − (Cl− + HCO3−). Normal: 8-12 mEq/L. Elevated anion gap metabolic acidosis: MUDPILES (Methanol, Uremia, DKA, Propylene glycol, Isoniazid/Iron, Lactic acidosis, Ethylene glycol, Salicylates). Non-anion gap metabolic acidosis: Diarrhea, renal tubular acidosis (Cl− elevated to compensate for HCO3− loss). Osmolal gap = Measured osmolality − Calculated osmolality (2Na + Glucose/18 + BUN/2.8). Elevated osmolal gap: Ethanol, methanol, ethylene glycol, isopropanol ingestion." },
      { sectionTitle: "Quality Control Considerations", content: "ISE membranes require regular conditioning and replacement. Monitor electrode drift with multi-level QC. Verify direct vs indirect ISE agreement when discrepancies arise. Check for pseudohyponatremia: If indirect ISE shows low Na+ but direct ISE (blood gas analyzer) shows normal Na+, suspect protein or lipid displacement. CO2 QC must be run with capped specimens to prevent CO2 loss. Hemolysis index monitoring for K+ — reject hemolyzed specimens." },
      { sectionTitle: "Clinical Correlation", content: "DKA (Diabetic ketoacidosis): Elevated anion gap acidosis, hyperkalemia (despite total body K+ depletion), low total CO2. SIADH: Hyponatremia with low serum osmolality, concentrated urine. Renal failure: Hyperkalemia, elevated BUN/creatinine, metabolic acidosis. Diuretic therapy: Hypokalemia, hypochloremia, metabolic alkalosis (loop diuretics). Vomiting: Hypochloremic metabolic alkalosis with hypokalemia. Addison disease: Hyperkalemia, hyponatremia (aldosterone deficiency)." },
      { sectionTitle: "Common Laboratory Errors", content: "Hemolysis causing falsely elevated K+ — the most common pre-analytical error for potassium. Pseudohyponatremia on indirect ISE in patients with high protein (multiple myeloma) or high lipids — verify with direct ISE. CO2 loss from uncapped specimen — falsely low total CO2. Drawing blood proximal to IV fluid infusion — dilutional effect on electrolytes. Potassium EDTA contamination from purple-top tube — massively elevated K+ (>10 mEq/L). Fist clenching during phlebotomy — increases K+ by 1-2 mEq/L." },
      { sectionTitle: "Clinical Pearls", content: "Hemolysis is the #1 pre-analytical error affecting potassium — always check hemolysis index before reporting K+. Pseudohyponatremia (indirect ISE only) occurs in hyperlipidemia and hyperproteinemia — direct ISE gives the true value. Always calculate the anion gap on every electrolyte panel — it can reveal hidden metabolic acidosis. K+ >6.0 mEq/L is a critical value requiring immediate notification — cardiac arrhythmia risk. In DKA, serum K+ may be normal or high despite severe total body K+ depletion — K+ drops rapidly with insulin treatment, requiring close monitoring." }
    ],
    summary: "Complete guide to electrolyte panel testing including ISE methodology, sodium/potassium/chloride/CO2 interpretation, anion gap calculation, pseudohyponatremia, and clinical correlations.",
    objectives: [
      "Describe direct and indirect ISE methodology for electrolyte measurement",
      "Calculate and interpret the anion gap and osmolal gap",
      "Identify causes of pseudohyponatremia",
      "Recognize critical electrolyte values and their clinical significance",
      "Apply pre-analytical requirements to prevent electrolyte errors"
    ],
    glossaryTerms: [
      { term: "ISE", definition: "Ion-selective electrode; primary method for measuring Na+, K+, Cl−; direct (undiluted) or indirect (diluted)" },
      { term: "Pseudohyponatremia", definition: "Falsely low sodium on indirect ISE due to lipid or protein displacement of the water fraction" },
      { term: "Anion gap", definition: "Na+ − (Cl− + HCO3−); elevated in certain metabolic acidoses; normal 8-12 mEq/L" },
      { term: "Osmolal gap", definition: "Difference between measured and calculated osmolality; elevated in toxic alcohol ingestion" }
    ],
    estimatedMinutes: 22,
    sortOrder: 19,
    tier: "free",
    status: "published",
    seoTitle: "Electrolyte Panel Interpretation | MLT Certification Review",
    seoDescription: "Master electrolyte testing by ISE, anion gap calculation, pseudohyponatremia, and critical value interpretation for MLT exams.",
    relatedQuestionDisciplines: ["Clinical Chemistry"],
    relatedFlashcardDecks: ["Electrolyte Panel"]
  },
  {
    title: "Westgard Rules and Quality Control in the Clinical Lab",
    slug: "westgard-rules-quality-control-lab",
    moduleTitle: "Laboratory Operations & Quality Management",
    topicTitle: "Westgard Rules and QC",
    discipline: "Laboratory Operations & Quality Management",
    disciplines: ["Laboratory Operations & Quality Management"],
    countryTrack: "both",
    difficulty: "intermediate",
    blueprintCategories: ["Quality Control"],
    content: [
      { sectionTitle: "Overview", content: "Quality control (QC) is a systematic process that ensures laboratory test results are accurate and precise. The Westgard multi-rule system is the most widely used QC interpretation framework in clinical laboratories. It uses a series of rules applied to QC data plotted on Levey-Jennings charts to detect random errors, systematic errors, and analytical shifts or trends before patient results are affected." },
      { sectionTitle: "Pathophysiology / Laboratory Significance", content: "QC monitors analytical performance by testing control materials with known target values alongside patient specimens. Control results are plotted on Levey-Jennings (L-J) charts with the mean ± 1SD, 2SD, and 3SD limits marked. Westgard rules analyze the pattern of control results to determine if the analytical system is in-control (results can be reported) or out-of-control (results must be held until the error is investigated and resolved). Two categories of error: Random error (imprecision — scattered data points) and systematic error (inaccuracy — shift or trend in one direction).",
        imageUrl: "/images/mlt/levey-jennings-chart-westgard.png",
        imageAlt: "Levey-Jennings chart showing QC data points with mean, 1SD, 2SD, and 3SD limits and Westgard rule violations marked"
      },
      { sectionTitle: "Specimen Collection and Handling", content: "QC materials (lyophilized or liquid controls) are reconstituted and handled per manufacturer instructions. Stored at appropriate temperature (usually 2-8°C after reconstitution). Run at least two levels of QC (normal and abnormal) per day for quantitative assays. Process QC materials exactly like patient specimens. Allow frozen or refrigerated controls to equilibrate to room temperature before testing. Mix gently — do not vortex (may denature proteins). Document lot numbers and expiration dates." },
      { sectionTitle: "Laboratory Methods", content: "Levey-Jennings chart: X-axis = time (day/run), Y-axis = QC value. Mean calculated from 20+ data points during method establishment. Calculate SD and plot ±1SD, ±2SD, ±3SD limits. Westgard multi-rules applied sequentially: 1₂s (warning rule — investigate), 1₃s (reject — random error), 2₂s (reject — systematic error), R₄s (reject — random error), 4₁s (reject — systematic error), 10x̄ (reject — systematic error/trend). Modern LIS systems automate Westgard rule application and flag violations." },
      { sectionTitle: "Interpretation of Results", content: "Westgard rules: 1₂s — one control exceeds ±2SD (WARNING — investigate, not reject). 1₃s — one control exceeds ±3SD (REJECT — random error likely). 2₂s — two consecutive controls exceed the same +2SD or -2SD limit (REJECT — systematic error/shift). R₄s — range between two controls in the same run exceeds 4SD (REJECT — random error). 4₁s — four consecutive controls on the same side of the mean exceed ±1SD (REJECT — systematic error/trend). 10x̄ — ten consecutive controls on the same side of the mean (REJECT — systematic error/shift). When a reject rule triggers: hold patient results, investigate and correct the error, rerun QC before releasing results." },
      { sectionTitle: "Quality Control Considerations", content: "Establish target mean and SD from 20+ data points during new reagent/instrument setup. Review L-J charts daily for trends (gradual drift in one direction — reagent deterioration, calibrator degradation) and shifts (sudden change — new reagent lot, calibration error). Acceptable CV (coefficient of variation) depends on the assay — generally <5% for chemistry, <3% for hematology. Participate in external proficiency testing (CAP, state programs). Document all out-of-control events, root cause analysis, and corrective actions." },
      { sectionTitle: "Clinical Correlation", content: "QC failures affect patient care — releasing inaccurate results can lead to misdiagnosis and inappropriate treatment. A shift in glucose QC could cause false hyperglycemia or hypoglycemia in diabetic patients. A trend in troponin QC could miss or falsely diagnose AMI. Proficiency testing failures may result in regulatory sanctions and potential loss of laboratory accreditation. QC is not just a regulatory requirement — it is a patient safety imperative." },
      { sectionTitle: "Common Laboratory Errors", content: "Using expired QC materials (target values no longer valid). Not allowing QC to equilibrate to room temperature before testing. Confusing the 1₂s warning rule with a rejection rule — 1₂s is a flag to investigate, not an automatic rejection. Not investigating the root cause of QC failures (simply repeating QC until it passes is not acceptable). Failing to apply Westgard rules in the correct sequence. Not documenting corrective actions when out-of-control events occur." },
      { sectionTitle: "Clinical Pearls", content: "1₃s detects random error; 2₂s and 10x̄ detect systematic error — know the difference for the exam. The 1₂s rule is a WARNING, not a rejection — it triggers investigation of subsequent rules. A trend = 6+ consecutive QC points in one direction (gradual shift). A shift = sudden jump to a new mean level. CV = (SD/mean) × 100 — lower CV = better precision. When QC is out of control: STOP releasing results, investigate, correct, rerun QC, document everything. The most common causes of QC failure: reagent deterioration, calibration drift, incorrect control reconstitution, pipetting errors." }
    ],
    summary: "Comprehensive guide to clinical laboratory quality control including Levey-Jennings charts, Westgard multi-rules, error detection, trending, troubleshooting, and corrective action procedures.",
    objectives: [
      "Construct and interpret Levey-Jennings charts",
      "Apply the six Westgard multi-rules to QC data",
      "Differentiate random error from systematic error",
      "Identify trends and shifts in QC data",
      "Implement corrective action procedures for out-of-control events"
    ],
    glossaryTerms: [
      { term: "1₃s rule", definition: "Westgard rejection rule; one QC value exceeds ±3SD; indicates random error" },
      { term: "2₂s rule", definition: "Westgard rejection rule; two consecutive QC values exceed the same ±2SD limit; indicates systematic error" },
      { term: "Levey-Jennings chart", definition: "QC chart plotting control values over time with mean and SD limits for visual error detection" },
      { term: "Coefficient of variation", definition: "(SD/mean) × 100; measure of analytical precision; lower CV = better precision" }
    ],
    estimatedMinutes: 20,
    sortOrder: 20,
    tier: "free",
    status: "published",
    seoTitle: "Westgard Rules & Lab QC Guide | MLT Certification Review",
    seoDescription: "Master Westgard multi-rules, Levey-Jennings charts, QC troubleshooting, and error detection for CSMLS and ASCP MLT exams.",
    relatedQuestionDisciplines: ["Laboratory Operations & Quality Management"],
    relatedFlashcardDecks: ["Westgard Rules and QC"]
  },
  {
    title: "Transfusion Reactions: Identification and Management",
    slug: "transfusion-reactions-identification-mlt",
    moduleTitle: "Immunohematology / Blood Banking",
    topicTitle: "Transfusion Reactions",
    discipline: "Immunohematology / Blood Banking",
    disciplines: ["Immunohematology / Blood Banking"],
    countryTrack: "both",
    difficulty: "advanced",
    blueprintCategories: ["Clinical Correlation", "Post-analytical"],
    content: [
      { sectionTitle: "Overview", content: "Transfusion reactions are adverse events occurring during or after blood transfusion. They range from mild allergic reactions to life-threatening acute hemolytic transfusion reactions (AHTR). The blood bank technologist plays a critical role in investigating suspected transfusion reactions through clerical checks, DAT, visual hemolysis assessment, and repeat ABO/Rh typing to identify the cause and prevent recurrence." },
      { sectionTitle: "Pathophysiology / Laboratory Significance", content: "Acute hemolytic transfusion reaction (AHTR): ABO incompatibility (most severe) — preformed anti-A or anti-B IgM antibodies cause immediate intravascular hemolysis. Complement activation leads to DIC, renal failure, and shock. Most common cause: clerical/identification error. Delayed hemolytic transfusion reaction (DHTR): Anamnestic antibody response (usually Kidd, Duffy, or Kell antibodies). Occurs 3-14 days post-transfusion. Extravascular hemolysis with falling hemoglobin, positive DAT, rising bilirubin. Febrile non-hemolytic transfusion reaction (FNHTR): Cytokines from donor leukocytes or recipient antibodies to donor WBC antigens. Most common reaction type. Allergic: IgE-mediated reaction to donor plasma proteins (urticaria to anaphylaxis)." },
      { sectionTitle: "Specimen Collection and Handling", content: "Transfusion reaction workup specimens: Post-reaction EDTA tube and clotted (SST) tube from the recipient (from opposite arm to the transfusion site). Pre-transfusion specimen (if available) for comparison. Return the blood bag with attached tubing (clamped) to the blood bank. First post-reaction voided urine specimen (check for hemoglobinuria). ALL specimens and the blood bag labeled and verified by TWO people. Process immediately — this is a STAT procedure." },
      { sectionTitle: "Laboratory Methods", content: "Transfusion reaction investigation protocol: (1) Stop transfusion immediately; (2) Clerical check — verify ALL identification on the patient, blood bag, compatibility label, and transfusion record (most AHTRs are due to clerical errors); (3) Visual check of post-reaction serum/plasma for hemolysis (pink/red = hemoglobinemia); (4) DAT on post-reaction specimen (new positive DAT suggests antibody coating of transfused cells); (5) Repeat ABO/Rh on post-reaction specimen AND the blood bag; (6) Check for hemoglobinuria in urine; (7) If AHTR suspected: DIC panel (PT, aPTT, fibrinogen, D-dimer), renal function, LDH, bilirubin, haptoglobin." },
      { sectionTitle: "Interpretation of Results", content: "AHTR: Positive visual hemolysis, positive DAT (new), ABO discrepancy between patient and bag, hemoglobinuria. DHTR: New positive DAT, new antibody identified on antibody screen, falling hemoglobin 3-14 days post-transfusion, elevated bilirubin. FNHTR: Negative DAT, no hemolysis, fever without other cause. Allergic: Negative DAT, no hemolysis, urticaria/anaphylaxis. Bacterial contamination: Positive Gram stain of bag contents, fever, hypotension, DIC. TRALI (Transfusion-related acute lung injury): Non-cardiogenic pulmonary edema within 6 hours, bilateral infiltrates on CXR, no hemolysis. TACO (Transfusion-associated circulatory overload): Cardiogenic pulmonary edema, elevated BNP." },
      { sectionTitle: "Quality Control Considerations", content: "Two-person verification of patient ID and blood product is the single most important safety measure. Electronic crossmatch systems reduce clerical errors. Blood bank refrigerator temperature monitoring (1-6°C for RBCs). Bacterial detection systems for platelet products (pH testing, culture). Track and trend reaction rates for continuous quality improvement. Document all reaction investigations completely with resolution and outcome." },
      { sectionTitle: "Clinical Correlation", content: "ABO-incompatible AHTR: Medical emergency — mortality rate 10-40%. DIC, renal failure, cardiovascular collapse. Immediate treatment: Stop transfusion, IV fluids, support blood pressure, maintain renal output. Kidd (anti-Jka, anti-Jkb) antibodies: Most common cause of DHTR — antibody titers drop below detectable levels and are missed on subsequent pre-transfusion testing. TRALI: Leading cause of transfusion-related mortality. Associated with donor antibodies to recipient HLA or neutrophil antigens. TACO: Risk in elderly, cardiac patients — transfuse slowly with diuretic premedication." },
      { sectionTitle: "Common Laboratory Errors", content: "Patient misidentification: #1 cause of fatal AHTRs — wrong blood to wrong patient. Not performing clerical check first during reaction investigation — this is the most critical step. Delaying the transfusion reaction investigation — specimens and blood bag must be processed immediately. Not checking urine for hemoglobinuria (may be the first sign of intravascular hemolysis). Confusing TRALI with TACO — both cause respiratory distress, but treatment is opposite (TACO needs diuretics, TRALI needs supportive care without diuretics)." },
      { sectionTitle: "Clinical Pearls", content: "Clerical/identification error is the #1 cause of fatal AHTRs — always perform the clerical check FIRST. Kidd antibodies (Jka, Jkb) are notorious for causing DHTRs because they fall below detectable levels between transfusions — antigen-negative blood should be provided for patients with a history of Kidd antibodies. TRALI is the leading cause of transfusion-related mortality — bilateral infiltrates within 6 hours, non-cardiogenic (normal BNP). A new positive DAT after transfusion suggests immune-mediated hemolysis. Visual hemolysis of post-reaction serum is a rapid, cost-effective indicator of intravascular hemolysis — compare to pre-transfusion specimen." }
    ],
    summary: "Comprehensive guide to transfusion reaction types, blood bank investigation protocol, DAT interpretation, and differentiation of AHTR, DHTR, FNHTR, allergic, TRALI, and TACO.",
    objectives: [
      "Classify transfusion reactions by type and pathophysiology",
      "Perform a transfusion reaction investigation protocol",
      "Interpret DAT, visual hemolysis, and hemoglobinuria findings",
      "Differentiate TRALI from TACO",
      "Identify the role of clerical checks in preventing fatal AHTRs"
    ],
    glossaryTerms: [
      { term: "AHTR", definition: "Acute hemolytic transfusion reaction; immediate intravascular hemolysis from ABO incompatibility" },
      { term: "DHTR", definition: "Delayed hemolytic transfusion reaction; occurs 3-14 days post-transfusion from anamnestic antibody response" },
      { term: "TRALI", definition: "Transfusion-related acute lung injury; non-cardiogenic pulmonary edema within 6 hours of transfusion" },
      { term: "TACO", definition: "Transfusion-associated circulatory overload; cardiogenic pulmonary edema from volume overload" }
    ],
    estimatedMinutes: 22,
    sortOrder: 21,
    tier: "free",
    status: "published",
    seoTitle: "Transfusion Reactions Investigation | MLT Study Guide",
    seoDescription: "Master transfusion reaction identification, blood bank investigation protocol, AHTR/DHTR/TRALI/TACO differentiation for MLT exams.",
    relatedQuestionDisciplines: ["Immunohematology / Blood Banking"],
    relatedFlashcardDecks: ["Transfusion Reactions"]
  },
  {
    title: "Syphilis Testing: Algorithms and Interpretation",
    slug: "syphilis-testing-algorithms-mlt",
    moduleTitle: "Immunology / Serology",
    topicTitle: "Syphilis Testing",
    discipline: "Immunology / Serology",
    disciplines: ["Immunology / Serology", "Microbiology"],
    countryTrack: "both",
    difficulty: "intermediate",
    blueprintCategories: ["Analytical", "Clinical Correlation"],
    content: [
      { sectionTitle: "Overview", content: "Syphilis testing involves a combination of non-treponemal (screening) and treponemal (confirmatory) serological tests to diagnose infection by Treponema pallidum. Two testing algorithms exist: the traditional algorithm (non-treponemal screen → treponemal confirmation) and the reverse algorithm (treponemal screen → non-treponemal confirmation). Understanding the differences, advantages, and limitations of each algorithm is essential for MLT practice." },
      { sectionTitle: "Pathophysiology / Laboratory Significance", content: "Non-treponemal tests (RPR, VDRL): Detect antibodies (reagin) against cardiolipin-lecithin-cholesterol antigen released from damaged host cells and treponemes. These antibodies appear 1-4 weeks after primary chancre. Titers correlate with disease activity and decline with successful treatment. Can produce biologic false positives (BFP) in pregnancy, autoimmune diseases, viral infections, and IV drug use. Treponemal tests (FTA-ABS, TP-PA, EIA/CIA): Detect antibodies specific to T. pallidum antigens. More specific than non-treponemal tests. Remain positive for life even after successful treatment (cannot be used to monitor treatment response)." },
      { sectionTitle: "Specimen Collection and Handling", content: "Serum (SST tube) for all serological tests. No fasting required. Specimens can be stored at 2-8°C for up to 7 days, or frozen for longer storage. RPR: Performed on unheated serum. VDRL: Performed on heated (56°C, 30 minutes) serum to inactivate complement. CSF: VDRL is the only non-treponemal test validated for CSF testing (RPR is NOT approved for CSF). Dark-field microscopy: Specimen from primary chancre or condylomata lata — must be examined within 20 minutes." },
      { sectionTitle: "Laboratory Methods", content: "RPR (Rapid Plasma Reagin): Macroscopic flocculation test. Patient serum mixed with cardiolipin-coated carbon particles on a card. Reactive = visible flocculation (clumping). Non-reactive = smooth suspension. Quantified by serial dilutions (titer). VDRL: Microscopic flocculation test. Similar principle but requires heated serum and microscopic reading. FTA-ABS (Fluorescent Treponemal Antibody Absorption): Indirect immunofluorescence. Patient serum absorbed with non-pathogenic treponemes (Reiter strain) to remove cross-reactive antibodies, then applied to T. pallidum-coated slides. Fluorescent anti-human IgG detects bound antibodies. TP-PA: Particle agglutination with T. pallidum antigens. EIA/CIA: Automated treponemal immunoassays (enzyme immunoassay or chemiluminescent immunoassay) — used in the reverse algorithm." },
      { sectionTitle: "Interpretation of Results", content: "Traditional algorithm: (1) Screen with RPR/VDRL; (2) Confirm reactive with FTA-ABS or TP-PA. Reverse algorithm: (1) Screen with treponemal EIA/CIA; (2) Confirm reactive with RPR; (3) If EIA reactive but RPR non-reactive, confirm with TP-PA. RPR titer interpretation: Rising titer (≥4-fold increase) = new infection or reinfection. Declining titer after treatment = successful therapy. Persistent low titer (serofast state) = treated syphilis with residual antibody. Prozone phenomenon: Falsely non-reactive RPR at high antibody concentrations — specimen must be diluted." },
      { sectionTitle: "Quality Control Considerations", content: "RPR/VDRL: Run reactive and non-reactive controls daily. Use calibrated mechanical rotator for consistent mixing speed. Card test reading at 8 minutes (RPR) — timing is critical. FTA-ABS: Run reactive, non-reactive, and minimally reactive controls. Check fluorescence microscope lamp intensity. EIA/CIA: Multi-level QC per manufacturer. Quantitative RPR: Report highest dilution showing reactivity. Check for prozone by testing undiluted and diluted specimens when clinical suspicion is high but initial screen is non-reactive." },
      { sectionTitle: "Clinical Correlation", content: "Primary syphilis: Painless chancre at inoculation site, 10-90 days post-exposure. RPR may be non-reactive (too early) — dark-field microscopy is the definitive test at this stage. Secondary syphilis: Disseminated rash (including palms and soles), condylomata lata, high RPR titer. Tertiary syphilis: Gummas, cardiovascular syphilis, neurosyphilis — may have lower RPR titer. Neurosyphilis: CSF VDRL is specific but insensitive (30-70%) — negative CSF VDRL does not rule out neurosyphilis. Congenital syphilis: Maternal IgG crosses placenta — test infant with RPR (IgM-specific tests if available)." },
      { sectionTitle: "Common Laboratory Errors", content: "Not testing for prozone effect in suspected secondary syphilis with non-reactive RPR — always dilute and retest. Using RPR on CSF — only VDRL is validated for CSF. Reporting treponemal tests as 'positive' without noting they remain positive for life — may cause unnecessary retreatment. Biologic false positive RPR: Not confirming with treponemal test in pregnant patients, autoimmune disease, recent vaccination, viral infections. Not recognizing that the reverse algorithm can detect early or treated syphilis that RPR misses." },
      { sectionTitle: "Clinical Pearls", content: "The prozone effect is a classic exam topic — secondary syphilis with high antibody titers can give a falsely non-reactive RPR. Always dilute and retest when clinical suspicion is high. RPR titer monitors treatment response — a 4-fold decline (e.g., 1:32 → 1:8) indicates successful treatment. Treponemal tests remain positive for LIFE — they cannot be used to monitor treatment. The reverse algorithm (treponemal screen first) is increasingly used because automated EIA/CIA is more efficient than manual RPR for high-volume screening. CSF VDRL is the ONLY non-treponemal test approved for CSF — its specificity is high but sensitivity is low." }
    ],
    summary: "Complete guide to syphilis testing including RPR, VDRL, FTA-ABS, treponemal immunoassays, traditional and reverse algorithms, prozone effect, and treatment monitoring.",
    objectives: [
      "Compare non-treponemal and treponemal test characteristics",
      "Interpret RPR titers for disease activity and treatment response",
      "Apply the traditional and reverse syphilis testing algorithms",
      "Identify the prozone effect and biologic false positive causes",
      "Describe CSF testing for neurosyphilis"
    ],
    glossaryTerms: [
      { term: "RPR", definition: "Rapid Plasma Reagin; macroscopic non-treponemal flocculation test for syphilis screening" },
      { term: "FTA-ABS", definition: "Fluorescent Treponemal Antibody Absorption; specific treponemal confirmatory test using indirect immunofluorescence" },
      { term: "Prozone effect", definition: "Falsely non-reactive RPR at high antibody concentrations due to antigen-antibody imbalance" },
      { term: "Serofast state", definition: "Persistent low RPR titer after adequate treatment; does not indicate treatment failure" }
    ],
    estimatedMinutes: 20,
    sortOrder: 22,
    tier: "free",
    status: "published",
    seoTitle: "Syphilis Testing Algorithms & Interpretation | MLT Guide",
    seoDescription: "Master RPR, VDRL, FTA-ABS, traditional and reverse syphilis algorithms, prozone effect, and treatment monitoring for MLT exams.",
    relatedQuestionDisciplines: ["Immunology / Serology"],
    relatedFlashcardDecks: ["Syphilis Testing"]
  }
];

function generateFlashcardsForLesson(lesson: MltStructuredLesson): MltFlashcardData[] {
  const flashcardSets: Record<string, MltFlashcardData[]> = {
    "iron-deficiency-anemia-lab-findings": [
      { discipline: "Hematology", countryTrack: "both", deckTitle: "Iron Deficiency Anemia Lab Findings", cardType: "lab-value", front: "What is the classic iron studies profile in iron deficiency anemia?", back: "Low serum iron, elevated TIBC, low ferritin (<12 ng/mL), low transferrin saturation (<16%). RDW is elevated early.", hint: "Think about iron stores depleted, transport capacity increased", tags: ["iron-deficiency", "iron-studies"], difficulty: "intermediate", sortOrder: 1, status: "published" },
      { discipline: "Hematology", countryTrack: "both", deckTitle: "Iron Deficiency Anemia Lab Findings", cardType: "term-definition", front: "What is the Mentzer index and how does it differentiate IDA from thalassemia?", back: "Mentzer index = MCV / RBC count. >13 suggests iron deficiency anemia. <13 suggests thalassemia trait.", hint: "MCV divided by RBC count", tags: ["iron-deficiency", "thalassemia", "mentzer-index"], difficulty: "intermediate", sortOrder: 2, status: "published" },
      { discipline: "Hematology", countryTrack: "both", deckTitle: "Iron Deficiency Anemia Lab Findings", cardType: "clinical-scenario", front: "A patient has Hgb 8.5 g/dL, MCV 68 fL, elevated RDW, low ferritin, and pencil cells on smear. What is the most likely diagnosis?", back: "Iron deficiency anemia. The combination of microcytic anemia, elevated RDW, low ferritin, and pencil cells (elliptocytes) is classic for IDA.", hint: "Low ferritin is virtually diagnostic", tags: ["iron-deficiency", "peripheral-smear"], difficulty: "intermediate", sortOrder: 3, status: "published" },
      { discipline: "Hematology", countryTrack: "both", deckTitle: "Iron Deficiency Anemia Lab Findings", cardType: "term-definition", front: "What is the single most useful test for diagnosing iron deficiency anemia?", back: "Serum ferritin. A level <12 ng/mL is virtually diagnostic of IDA. However, ferritin is an acute phase reactant and may be falsely normal in concurrent inflammation.", hint: "Storage form of iron", tags: ["ferritin", "iron-deficiency"], difficulty: "foundational", sortOrder: 4, status: "published" },
      { discipline: "Hematology", countryTrack: "both", deckTitle: "Iron Deficiency Anemia Lab Findings", cardType: "comparison", front: "How does RDW help differentiate IDA from thalassemia trait?", back: "RDW is elevated in IDA (reflects anisocytosis as normal cells are replaced by microcytic cells). RDW is usually normal in thalassemia trait (uniformly microcytic cells).", hint: "Variation in cell size", tags: ["rdw", "iron-deficiency", "thalassemia"], difficulty: "intermediate", sortOrder: 5, status: "published" },
      { discipline: "Hematology", countryTrack: "both", deckTitle: "Iron Deficiency Anemia Lab Findings", cardType: "lab-value", front: "After starting iron therapy for IDA, what is the earliest lab indicator of response and when does it peak?", back: "Reticulocyte count peaks at 7-10 days after starting iron therapy. This is the earliest indicator of response. MCV normalizes last (2-3 months).", hint: "Young red blood cells increase first", tags: ["iron-therapy", "reticulocyte"], difficulty: "advanced", sortOrder: 6, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Iron Deficiency Anemia Lab Findings", cardType: "procedure-steps", front: "Why should iron studies specimens be collected in the morning and what tube is used?", back: "Serum iron has diurnal variation — highest in the morning, lowest in the afternoon. Collect in SST (gold-top) tube, fasting preferred. Hemolyzed specimens falsely elevate serum iron and should be rejected.", hint: "Diurnal variation affects timing", tags: ["pre-analytical", "iron-studies"], difficulty: "intermediate", sortOrder: 7, status: "published" }
    ],
    "gram-stain-interpretation-mlt": [
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Gram Stain Interpretation", cardType: "procedure-steps", front: "What are the four steps of the Gram stain procedure in order?", back: "1. Crystal violet (primary stain, 1 min). 2. Gram's iodine (mordant, 1 min). 3. Acetone-alcohol (decolorizer, 10-30 sec — critical step). 4. Safranin (counterstain, 30-60 sec).", hint: "CV → Iodine → Decolorize → Safranin", tags: ["gram-stain", "procedure"], difficulty: "foundational", sortOrder: 1, status: "published" },
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Gram Stain Interpretation", cardType: "term-definition", front: "What is the function of Gram's iodine in the Gram stain?", back: "Gram's iodine acts as a mordant — it forms a crystal violet-iodine (CV-I) complex that is too large to be washed out of the thick peptidoglycan layer of gram-positive bacteria during decolorization.", hint: "Mordant = fixes the primary stain", tags: ["gram-stain", "iodine"], difficulty: "foundational", sortOrder: 2, status: "published" },
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Gram Stain Interpretation", cardType: "clinical-scenario", front: "A blood culture Gram stain shows gram-positive cocci in clusters. What organism should be suspected?", back: "Staphylococcus species (most likely S. aureus from blood). Gram-positive cocci in clusters is the characteristic arrangement of staphylococci.", hint: "Clusters = Staph, Chains = Strep", tags: ["gram-stain", "staphylococcus"], difficulty: "foundational", sortOrder: 3, status: "published" },
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Gram Stain Interpretation", cardType: "comparison", front: "What is the most common Gram stain error and what does it cause?", back: "Over-decolorization — causes gram-positive organisms to falsely appear gram-negative. Under-decolorization causes the opposite: gram-negative organisms falsely appear gram-positive.", hint: "The decolorization step is the most critical", tags: ["gram-stain", "errors"], difficulty: "intermediate", sortOrder: 4, status: "published" },
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Gram Stain Interpretation", cardType: "lab-value", front: "What is the Q-score for sputum quality assessment?", back: "Acceptable sputum has >25 WBCs and <10 squamous epithelial cells per low-power field. Specimens with many epithelial cells represent oral/saliva contamination and should be rejected.", hint: "WBCs = good, epithelial cells = bad (saliva)", tags: ["gram-stain", "sputum-quality"], difficulty: "intermediate", sortOrder: 5, status: "published" },
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Gram Stain Interpretation", cardType: "image-identification", front: "Gram-negative diplococci (kidney-bean shaped) seen in CSF. What organism is suspected?", back: "Neisseria meningitidis. Gram-negative diplococci in CSF is classic for meningococcal meningitis — requires immediate clinical notification and initiation of ceftriaxone therapy.", hint: "Kidney-bean shaped pairs in CSF", imageUrl: "/images/mlt/gram-negative-diplococci-csf.png", imageAlt: "Gram stain showing gram-negative diplococci in CSF", tags: ["gram-stain", "neisseria", "meningitis"], difficulty: "intermediate", sortOrder: 6, status: "published" },
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Gram Stain Interpretation", cardType: "term-definition", front: "Which organisms do NOT stain well with Gram stain?", back: "Mycobacteria (use acid-fast stain), Mycoplasma (no cell wall), Chlamydia (intracellular), Legionella (use DFA), Treponema (use darkfield), Rickettsia (intracellular). These require alternative detection methods.", hint: "Organisms without typical cell walls or intracellular organisms", tags: ["gram-stain", "limitations"], difficulty: "advanced", sortOrder: 7, status: "published" }
    ],
    "urinalysis-microscopy-sediment": [
      { discipline: "Urinalysis & Body Fluids", countryTrack: "both", deckTitle: "Urinalysis Microscopy", cardType: "term-definition", front: "What is the clinical significance of RBC casts in urine?", back: "RBC casts are pathognomonic for glomerulonephritis. They indicate that bleeding originates from the glomeruli (within the kidney) rather than the lower urinary tract.", hint: "Localizes bleeding to the kidney", tags: ["urine-casts", "glomerulonephritis"], difficulty: "intermediate", sortOrder: 1, status: "published" },
      { discipline: "Urinalysis & Body Fluids", countryTrack: "both", deckTitle: "Urinalysis Microscopy", cardType: "image-identification", front: "What crystal finding is associated with urease-producing bacterial UTI?", back: "Triple phosphate (struvite) crystals — coffin-lid shaped crystals found in alkaline urine. Associated with Proteus and other urease-producing organisms that alkalinize urine.", hint: "Coffin-lid shape, alkaline urine, UTI", imageUrl: "/images/mlt/triple-phosphate-crystals.png", imageAlt: "Triple phosphate (struvite) crystals with coffin-lid morphology", tags: ["urine-crystals", "struvite", "UTI"], difficulty: "intermediate", sortOrder: 2, status: "published" },
      { discipline: "Urinalysis & Body Fluids", countryTrack: "both", deckTitle: "Urinalysis Microscopy", cardType: "clinical-scenario", front: "Under polarized light, Maltese cross pattern is seen in urine sediment. What condition does this indicate?", back: "Nephrotic syndrome. The Maltese cross pattern is produced by oval fat bodies (lipid-laden renal tubular epithelial cells or macrophages) and is diagnostic for nephrotic syndrome with lipiduria.", hint: "Cross-shaped birefringence under polarized light", tags: ["oval-fat-bodies", "nephrotic-syndrome"], difficulty: "advanced", sortOrder: 3, status: "published" },
      { discipline: "Urinalysis & Body Fluids", countryTrack: "both", deckTitle: "Urinalysis Microscopy", cardType: "comparison", front: "How do you differentiate RBCs from yeast cells in urine sediment?", back: "Both are round and similar in size. RBCs are smooth, biconcave, and can be crenated. Yeast cells show budding (daughter cells attached) and may have pseudohyphae. Acetic acid lyses RBCs but not yeast.", hint: "Look for budding", tags: ["urine-sediment", "microscopy"], difficulty: "intermediate", sortOrder: 4, status: "published" },
      { discipline: "Urinalysis & Body Fluids", countryTrack: "both", deckTitle: "Urinalysis Microscopy", cardType: "term-definition", front: "What are waxy casts and what do they indicate?", back: "Waxy casts are homogeneous, waxy-appearing casts with sharp, broken edges. They indicate chronic kidney disease with very slow tubular flow and prolonged cast formation time. They are a sign of severe, long-standing renal dysfunction.", hint: "Advanced/chronic kidney disease", tags: ["urine-casts", "waxy-casts", "CKD"], difficulty: "advanced", sortOrder: 5, status: "published" },
      { discipline: "Urinalysis & Body Fluids", countryTrack: "both", deckTitle: "Urinalysis Microscopy", cardType: "procedure-steps", front: "What is the standardized procedure for urine sediment preparation?", back: "Centrifuge 12 mL urine at 400×g for 5 minutes. Decant to 1 mL. Resuspend sediment. Place drop on slide with coverslip. Examine at 100× (LPF) for casts and crystals, then 400× (HPF) for cells and bacteria.", hint: "400g for 5 minutes, resuspend in 1 mL", tags: ["urine-sediment", "procedure"], difficulty: "foundational", sortOrder: 6, status: "published" }
    ],
    "blood-gas-acid-base-analysis": [
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Blood Gas Analysis", cardType: "procedure-steps", front: "What are the three electrodes used in blood gas analyzers and what do they measure?", back: "pH electrode (Sanz glass electrode): measures hydrogen ion activity. pCO2 electrode (Severinghaus): modified pH electrode with CO2-permeable membrane. pO2 electrode (Clark): amperometric electrode measuring oxygen reduction current.", hint: "Glass, Severinghaus, Clark", tags: ["blood-gas", "electrodes"], difficulty: "intermediate", sortOrder: 1, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Blood Gas Analysis", cardType: "clinical-scenario", front: "ABG shows: pH 7.28, pCO2 24 mmHg, HCO3- 11 mEq/L. What is the acid-base disorder?", back: "Metabolic acidosis with respiratory compensation. Low pH = acidemia. Low HCO3- = metabolic acidosis (primary). Low pCO2 = respiratory compensation (hyperventilation to blow off CO2).", hint: "Low pH + low bicarb = metabolic acidosis", tags: ["acid-base", "metabolic-acidosis"], difficulty: "advanced", sortOrder: 2, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Blood Gas Analysis", cardType: "mnemonic", front: "What is the MUDPILES mnemonic for elevated anion gap metabolic acidosis?", back: "M = Methanol, U = Uremia, D = DKA, P = Propylene glycol, I = Isoniazid/Iron, L = Lactic acidosis, E = Ethylene glycol, S = Salicylates.", mnemonic: "MUDPILES", hint: "Causes of high anion gap acidosis", tags: ["anion-gap", "metabolic-acidosis"], difficulty: "intermediate", sortOrder: 3, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Blood Gas Analysis", cardType: "term-definition", front: "What is the most common pre-analytical error in blood gas analysis?", back: "Air bubbles in the syringe. Room air equilibrates with the specimen, falsely increasing pO2 (room air pO2 ~150 mmHg) and decreasing pCO2. Always expel air bubbles immediately after collection.", hint: "Room air contamination", tags: ["pre-analytical", "blood-gas"], difficulty: "foundational", sortOrder: 4, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Blood Gas Analysis", cardType: "lab-value", front: "What are the normal ABG values?", back: "pH: 7.35-7.45. pCO2: 35-45 mmHg. pO2: 80-100 mmHg. HCO3-: 22-26 mEq/L. Normal anion gap: 8-12 mEq/L.", hint: "7.35-7.45 / 35-45 / 80-100 / 22-26", tags: ["normal-values", "blood-gas"], difficulty: "foundational", sortOrder: 5, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Blood Gas Analysis", cardType: "clinical-scenario", front: "A patient with CO poisoning has normal pO2 on ABG but is hypoxic. Why?", back: "The Clark electrode measures dissolved O2 (pO2), which is normal. However, carboxyhemoglobin (COHb) displaces O2 from hemoglobin. Pulse oximetry reads falsely normal. Only co-oximetry detects COHb and reveals the true oxygen deficit.", hint: "pO2 measures dissolved oxygen, not hemoglobin-bound", tags: ["CO-poisoning", "co-oximetry"], difficulty: "advanced", sortOrder: 6, status: "published" }
    ],
    "liver-function-tests-lab": [
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Liver Function Tests", cardType: "comparison", front: "What is the De Ritis ratio (AST:ALT) and how does it help differentiate liver diseases?", back: "AST:ALT ratio >2 suggests alcoholic liver disease (AST rarely >300 U/L). AST:ALT ratio <1 suggests viral hepatitis. This ratio helps differentiate the etiology of hepatocellular injury.", hint: ">2 = alcohol, <1 = viral", tags: ["de-ritis-ratio", "liver"], difficulty: "intermediate", sortOrder: 1, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Liver Function Tests", cardType: "term-definition", front: "What distinguishes a hepatocellular pattern from a cholestatic pattern in LFTs?", back: "Hepatocellular: ALT/AST markedly elevated (>10×), ALP mildly elevated (<3×). Cholestatic: ALP markedly elevated (>3×), ALT/AST mildly elevated (<3×). Mixed patterns show both elevations.", hint: "Hepatocellular = aminotransferases up, Cholestatic = ALP up", tags: ["hepatocellular", "cholestatic", "LFT-patterns"], difficulty: "intermediate", sortOrder: 2, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Liver Function Tests", cardType: "lab-value", front: "How do you determine if an elevated ALP is from liver or bone?", back: "Check GGT. If GGT is also elevated → hepatobiliary source. If GGT is normal → bone source (growth, Paget disease, bone metastases). GGT is specific for hepatobiliary disease.", hint: "GGT differentiates liver from bone ALP", tags: ["ALP", "GGT", "bone-vs-liver"], difficulty: "intermediate", sortOrder: 3, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Liver Function Tests", cardType: "clinical-scenario", front: "A specimen for bilirubin testing was left on the bench near a window for 2 hours. How are results affected?", back: "Bilirubin is photosensitive and degrades by up to 50% per hour under direct light. The bilirubin result will be falsely LOW. Specimens should be protected from light during transport and storage.", hint: "Light destroys bilirubin", tags: ["bilirubin", "pre-analytical"], difficulty: "foundational", sortOrder: 4, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Liver Function Tests", cardType: "term-definition", front: "What does elevated direct (conjugated) bilirubin indicate?", back: "Direct bilirubin >50% of total bilirubin indicates hepatocellular dysfunction (liver cannot excrete conjugated bilirubin) or biliary obstruction (conjugated bilirubin backs up into blood). Direct bilirubin is water-soluble and appears in urine (dark urine).", hint: "Conjugated = already processed by liver", tags: ["bilirubin", "direct-bilirubin"], difficulty: "intermediate", sortOrder: 5, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Liver Function Tests", cardType: "lab-value", front: "What is the clinical significance of low albumin with prolonged PT/INR in liver disease?", back: "Low albumin and prolonged PT/INR indicate impaired liver synthetic function. The liver synthesizes albumin and most clotting factors (I, II, V, VII, IX, X). These markers correlate with disease severity in cirrhosis and acute liver failure.", hint: "Liver makes albumin and clotting factors", tags: ["albumin", "synthetic-function", "cirrhosis"], difficulty: "advanced", sortOrder: 6, status: "published" }
    ],
    "renal-function-tests-lab": [
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Renal Function Tests", cardType: "lab-value", front: "What does a BUN:creatinine ratio >20:1 indicate?", back: "Pre-renal azotemia — conditions like dehydration, congestive heart failure, or GI bleeding where reduced renal perfusion increases tubular reabsorption of urea (BUN rises disproportionately). Normal ratio is 10-20:1.", hint: "BUN goes up more than creatinine", tags: ["BUN-creatinine-ratio", "pre-renal"], difficulty: "intermediate", sortOrder: 1, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Renal Function Tests", cardType: "term-definition", front: "What are the known interferents of the Jaffe creatinine method?", back: "Positive interferents (falsely elevate creatinine): Bilirubin, glucose, ketones (DKA patients), cephalosporin antibiotics, and ascorbic acid. The enzymatic creatinine method is more specific and less prone to interference.", hint: "Alkaline picrate reaction has many interferents", tags: ["jaffe-method", "creatinine", "interferents"], difficulty: "intermediate", sortOrder: 2, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Renal Function Tests", cardType: "comparison", front: "Why is creatinine considered a 'late' marker of renal dysfunction?", back: "Up to 50% of nephrons must be lost before serum creatinine rises above the normal range. This is because the remaining nephrons compensate by increasing filtration. eGFR can detect earlier decline. Cystatin C may be more sensitive.", hint: "Nephron reserve capacity", tags: ["creatinine", "late-marker"], difficulty: "advanced", sortOrder: 3, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Renal Function Tests", cardType: "lab-value", front: "What are the CKD stages based on eGFR?", back: "Stage 1: ≥90 (with kidney damage). Stage 2: 60-89. Stage 3a: 45-59. Stage 3b: 30-44. Stage 4: 15-29. Stage 5: <15 (end-stage renal disease, dialysis).", hint: "5 stages, decreasing eGFR", tags: ["CKD-staging", "eGFR"], difficulty: "foundational", sortOrder: 4, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Renal Function Tests", cardType: "term-definition", front: "What is cystatin C and when is it preferred over creatinine?", back: "Cystatin C is a low molecular weight protein produced by all nucleated cells. It is freely filtered by glomeruli and not affected by muscle mass, diet, or sex. Preferred in elderly, malnourished, or patients with extreme body composition where creatinine is unreliable.", hint: "Not affected by muscle mass", tags: ["cystatin-C", "GFR"], difficulty: "advanced", sortOrder: 5, status: "published" }
    ],
    "hemoglobin-electrophoresis-mlt": [
      { discipline: "Hematology", countryTrack: "both", deckTitle: "Hemoglobin Electrophoresis", cardType: "procedure-steps", front: "What hemoglobins comigrate on alkaline (cellulose acetate, pH 8.6) electrophoresis?", back: "HbS comigrates with HbD. HbC comigrates with HbA2 and HbE. These must be resolved by acid electrophoresis (citrate agar, pH 6.0) or HPLC.", hint: "S=D and C=A2=E at alkaline pH", tags: ["hemoglobin-electrophoresis", "comigration"], difficulty: "advanced", sortOrder: 1, status: "published" },
      { discipline: "Hematology", countryTrack: "both", deckTitle: "Hemoglobin Electrophoresis", cardType: "lab-value", front: "What HbA2 level is diagnostic for beta-thalassemia minor?", back: "HbA2 >3.5% is diagnostic for beta-thalassemia minor. Normal HbA2 is 2-3.5%. Accurate quantification is essential — this is the key diagnostic finding.", hint: "Elevated delta chain hemoglobin", tags: ["HbA2", "beta-thalassemia"], difficulty: "intermediate", sortOrder: 2, status: "published" },
      { discipline: "Hematology", countryTrack: "both", deckTitle: "Hemoglobin Electrophoresis", cardType: "comparison", front: "What is the difference between sickle cell trait (HbAS) and sickle cell disease (HbSS) on electrophoresis?", back: "Sickle cell trait: HbA 55-60%, HbS 35-40%, HbA PRESENT. Sickle cell disease: HbS 80-90%, HbF 5-15%, NO HbA. The presence or absence of HbA is the key differentiator.", hint: "Disease = no HbA, Trait = HbA present and predominant", tags: ["sickle-cell", "electrophoresis"], difficulty: "intermediate", sortOrder: 3, status: "published" },
      { discipline: "Hematology", countryTrack: "both", deckTitle: "Hemoglobin Electrophoresis", cardType: "term-definition", front: "What is the Sickledex (solubility) test and what is its limitation?", back: "Sickledex is a screening test that detects HbS by its insolubility in deoxygenated conditions (turbid solution = positive). Limitation: It CANNOT distinguish sickle cell trait from disease — electrophoresis is required for definitive diagnosis.", hint: "Screening only, not diagnostic", tags: ["sickledex", "screening"], difficulty: "intermediate", sortOrder: 4, status: "published" },
      { discipline: "Hematology", countryTrack: "both", deckTitle: "Hemoglobin Electrophoresis", cardType: "clinical-scenario", front: "A newborn screening shows HbFS pattern. What does this indicate?", back: "HbF + HbS without HbA indicates either sickle cell disease (HbSS) or sickle-beta zero thalassemia. The absence of HbA is significant. Follow-up confirmatory testing is required at 3-6 months.", hint: "No HbA in newborn = possible disease", tags: ["newborn-screening", "sickle-cell"], difficulty: "advanced", sortOrder: 5, status: "published" },
      { discipline: "Hematology", countryTrack: "both", deckTitle: "Hemoglobin Electrophoresis", cardType: "term-definition", front: "Why should hemoglobin electrophoresis NOT be performed on recently transfused patients?", back: "Donor HbA from transfused RBCs masks the patient's abnormal hemoglobin pattern, potentially leading to missed diagnosis. Wait at least 3 months post-transfusion for accurate results.", hint: "Donor blood contains normal HbA", tags: ["transfusion", "electrophoresis"], difficulty: "intermediate", sortOrder: 6, status: "published" }
    ],
    "antibiotic-susceptibility-testing-mlt": [
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Antibiotic Susceptibility Testing", cardType: "term-definition", front: "What is the 0.5 McFarland standard and why is it critical for AST?", back: "A barium sulfate turbidity standard corresponding to approximately 1.5 × 10⁸ CFU/mL. It standardizes the inoculum density for AST. Too heavy inoculum → falsely resistant. Too light → falsely susceptible.", hint: "Standardizes bacterial concentration", tags: ["mcfarland", "inoculum"], difficulty: "foundational", sortOrder: 1, status: "published" },
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Antibiotic Susceptibility Testing", cardType: "clinical-scenario", front: "An S. aureus isolate is erythromycin-resistant and clindamycin-susceptible. What additional test is needed?", back: "D-zone test. Place erythromycin and clindamycin disks 15-26 mm apart. If the clindamycin zone is flattened (D-shaped) on the side facing erythromycin, inducible clindamycin resistance is present — report clindamycin as RESISTANT.", hint: "Blunted zone = positive D-test", tags: ["d-zone-test", "clindamycin", "inducible-resistance"], difficulty: "advanced", sortOrder: 2, status: "published" },
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Antibiotic Susceptibility Testing", cardType: "term-definition", front: "What is an ESBL and how is it confirmed in the laboratory?", back: "Extended-spectrum beta-lactamase: enzyme that hydrolyzes third-generation cephalosporins. Confirmed by demonstrating ≥5 mm increase in zone diameter with clavulanate (beta-lactamase inhibitor) compared to cephalosporin alone.", hint: "Clavulanate restores susceptibility", tags: ["ESBL", "beta-lactamase"], difficulty: "advanced", sortOrder: 3, status: "published" },
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Antibiotic Susceptibility Testing", cardType: "comparison", front: "How does MRSA differ from MSSA in laboratory detection and clinical significance?", back: "MRSA is detected by cefoxitin (30 μg) disk — resistant (zone <22 mm). MRSA carries mecA gene encoding altered PBP2a. Report ALL beta-lactams resistant (penicillins, cephalosporins, carbapenems). MSSA is cefoxitin-susceptible and responds to beta-lactam antibiotics.", hint: "Cefoxitin screen for mecA-mediated resistance", tags: ["MRSA", "cefoxitin"], difficulty: "intermediate", sortOrder: 4, status: "published" },
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Antibiotic Susceptibility Testing", cardType: "lab-value", front: "What is the MIC and what does it represent?", back: "Minimum Inhibitory Concentration: the lowest concentration of an antibiotic that inhibits visible bacterial growth after overnight incubation. Determined by broth microdilution (serial two-fold dilutions). Compared to CLSI breakpoints for S/I/R interpretation.", hint: "Lowest concentration that stops growth", tags: ["MIC", "broth-dilution"], difficulty: "intermediate", sortOrder: 5, status: "published" },
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Antibiotic Susceptibility Testing", cardType: "procedure-steps", front: "What QC organisms are used for disk diffusion AST?", back: "S. aureus ATCC 25923 (gram-positive control), E. coli ATCC 25922 (gram-negative control), P. aeruginosa ATCC 27853 (Pseudomonas control). Run daily for first 30 days, then weekly if within range.", hint: "ATCC reference strains", tags: ["QC", "ATCC-strains"], difficulty: "intermediate", sortOrder: 6, status: "published" }
    ],
    "elisa-methodology-applications": [
      { discipline: "Immunology / Serology", countryTrack: "both", deckTitle: "ELISA Methodology", cardType: "comparison", front: "What are the four ELISA formats?", back: "1. Direct: enzyme-labeled Ab binds antigen. 2. Indirect: unlabeled primary Ab + enzyme-labeled secondary Ab. 3. Sandwich: capture Ab + antigen + enzyme-labeled detection Ab (signal proportional to Ag). 4. Competitive: patient analyte competes with labeled analyte (signal INVERSE to concentration).", hint: "Direct, Indirect, Sandwich, Competitive", tags: ["ELISA-formats"], difficulty: "intermediate", sortOrder: 1, status: "published" },
      { discipline: "Immunology / Serology", countryTrack: "both", deckTitle: "ELISA Methodology", cardType: "term-definition", front: "What is the hook (prozone) effect in sandwich ELISA?", back: "When antigen concentration is extremely high, it saturates both capture and detection antibodies independently (preventing sandwich formation). Result: falsely LOW or NEGATIVE signal despite very high analyte. Solution: dilute specimen and retest.", hint: "Too much antigen overwhelms the assay", tags: ["hook-effect", "prozone", "ELISA"], difficulty: "advanced", sortOrder: 2, status: "published" },
      { discipline: "Immunology / Serology", countryTrack: "both", deckTitle: "ELISA Methodology", cardType: "term-definition", front: "What is the #1 cause of false positive ELISA results?", back: "Incomplete washing. Residual unbound enzyme-conjugated antibody remains in the well, reacts with substrate, and produces signal regardless of whether the target analyte is present.", hint: "Washing removes unbound conjugate", tags: ["false-positive", "washing", "ELISA"], difficulty: "intermediate", sortOrder: 3, status: "published" },
      { discipline: "Immunology / Serology", countryTrack: "both", deckTitle: "ELISA Methodology", cardType: "clinical-scenario", front: "A 4th generation HIV ELISA is reactive. What is the next step?", back: "Confirmatory testing is required. Current algorithm: Reactive 4th gen screen → HIV-1/HIV-2 antibody differentiation assay. If indeterminate → HIV-1 RNA (NAT). A reactive ELISA alone is NOT diagnostic — false positives occur.", hint: "ELISA is screening, not confirmatory", tags: ["HIV-testing", "ELISA", "screening"], difficulty: "intermediate", sortOrder: 4, status: "published" },
      { discipline: "Immunology / Serology", countryTrack: "both", deckTitle: "ELISA Methodology", cardType: "term-definition", front: "What is the advantage of 4th generation HIV ELISA over 3rd generation?", back: "4th generation (combo) tests detect both HIV-1/2 antibodies AND p24 antigen. This shortens the window period to approximately 2 weeks (vs 3-4 weeks for 3rd gen antibody-only tests), enabling earlier detection of acute HIV infection.", hint: "Detects antigen + antibody", tags: ["4th-gen-HIV", "p24-antigen"], difficulty: "advanced", sortOrder: 5, status: "published" }
    ],
    "pcr-molecular-testing-clinical-lab": [
      { discipline: "Molecular Diagnostics", countryTrack: "both", deckTitle: "PCR Molecular Testing", cardType: "procedure-steps", front: "What are the three steps of each PCR thermal cycle?", back: "1. Denaturation (94-98°C): Separates double-stranded DNA into single strands. 2. Annealing (50-65°C): Primers bind to complementary target sequences. 3. Extension (72°C): Taq DNA polymerase synthesizes new DNA strands from primers.", hint: "Denature → Anneal → Extend", tags: ["PCR-steps", "thermal-cycling"], difficulty: "foundational", sortOrder: 1, status: "published" },
      { discipline: "Molecular Diagnostics", countryTrack: "both", deckTitle: "PCR Molecular Testing", cardType: "term-definition", front: "What does a low Ct value indicate in real-time PCR?", back: "A low Ct value indicates HIGH target concentration (more starting template = fewer cycles needed to reach detection threshold). Conversely, high Ct value = low target. Ct is INVERSELY proportional to starting template amount.", hint: "Ct and target are inversely related", tags: ["Ct-value", "qPCR"], difficulty: "intermediate", sortOrder: 2, status: "published" },
      { discipline: "Molecular Diagnostics", countryTrack: "both", deckTitle: "PCR Molecular Testing", cardType: "comparison", front: "What is the difference between TaqMan probes and SYBR Green in real-time PCR?", back: "TaqMan: Sequence-specific fluorescent probe (reporter + quencher). More specific — detects only the target. SYBR Green: Intercalating dye that fluoresces when bound to ANY double-stranded DNA. Less specific — requires melt curve analysis to verify specificity.", hint: "TaqMan = specific, SYBR Green = non-specific", tags: ["TaqMan", "SYBR-Green", "detection"], difficulty: "advanced", sortOrder: 3, status: "published" },
      { discipline: "Molecular Diagnostics", countryTrack: "both", deckTitle: "PCR Molecular Testing", cardType: "term-definition", front: "Why is heparin contraindicated for PCR specimens?", back: "Heparin is a potent inhibitor of Taq DNA polymerase. It binds to the enzyme and prevents DNA synthesis during the extension step, causing false negative results. Always use EDTA or citrate tubes for PCR.", hint: "PCR inhibitor", tags: ["heparin", "PCR-inhibitor", "pre-analytical"], difficulty: "intermediate", sortOrder: 4, status: "published" },
      { discipline: "Molecular Diagnostics", countryTrack: "both", deckTitle: "PCR Molecular Testing", cardType: "term-definition", front: "What is the most critical quality concern in the molecular lab and how is it prevented?", back: "Amplicon contamination (carryover of previously amplified DNA causing false positives). Prevention: Unidirectional workflow (specimen processing → amplification → detection, NEVER return), dedicated equipment in each area, UNG/dUTP system.", hint: "Unidirectional workflow", tags: ["contamination", "molecular-QC"], difficulty: "intermediate", sortOrder: 5, status: "published" },
      { discipline: "Molecular Diagnostics", countryTrack: "both", deckTitle: "PCR Molecular Testing", cardType: "clinical-scenario", front: "A PCR run shows a positive NTC (no template control). What does this mean?", back: "A positive NTC indicates contamination — amplified DNA has contaminated the reagents or work area. The entire run is INVALID. All patient results must be held. Investigate contamination source, decontaminate, and repeat the run.", hint: "NTC must ALWAYS be negative", tags: ["NTC", "contamination", "invalid-run"], difficulty: "intermediate", sortOrder: 6, status: "published" }
    ],
    "blood-culture-techniques-interpretation": [
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Blood Culture Techniques", cardType: "term-definition", front: "What is the single most important variable affecting blood culture sensitivity?", back: "Blood volume. Each mL below the recommended 10 mL per bottle decreases sensitivity by 3-5%. Adults should have 20-30 mL total drawn per set (10 mL per aerobic + 10 mL per anaerobic bottle).", hint: "Volume, volume, volume", tags: ["blood-volume", "sensitivity"], difficulty: "foundational", sortOrder: 1, status: "published" },
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Blood Culture Techniques", cardType: "comparison", front: "How do you differentiate a true positive blood culture from a contaminant?", back: "True positive: S. aureus, Enterobacteriaceae, Pseudomonas, Candida — almost always significant. Contaminant: CoNS, Corynebacterium, Bacillus (not anthracis). Key differentiators: number of positive sets (multiple = true), time to positivity (short = true), clinical correlation.", hint: "Number of positive bottles and organism type", tags: ["contaminant", "true-positive"], difficulty: "intermediate", sortOrder: 2, status: "published" },
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Blood Culture Techniques", cardType: "term-definition", front: "What is the acceptable blood culture contamination rate?", back: "Less than 3%. Rates above 3% require investigation — track by phlebotomist and collection site. High contamination rates lead to unnecessary antibiotics, extended hospital stays, and increased healthcare costs.", hint: "Below 3%", tags: ["contamination-rate", "quality"], difficulty: "intermediate", sortOrder: 3, status: "published" },
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Blood Culture Techniques", cardType: "clinical-scenario", front: "S. aureus grows in 1 of 2 blood culture sets. Is this significant?", back: "YES — S. aureus in even one blood culture bottle is ALWAYS clinically significant. Requires full workup including echocardiography to rule out endocarditis, and a minimum 2-week course of antibiotics.", hint: "S. aureus is always significant", tags: ["S-aureus", "bacteremia"], difficulty: "intermediate", sortOrder: 4, status: "published" },
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Blood Culture Techniques", cardType: "procedure-steps", front: "What is the proper skin preparation for blood culture collection?", back: "Clean with chlorhexidine (preferred over povidone-iodine). Apply with friction for 30 seconds. Allow to DRY COMPLETELY (most important step). Do not palpate the site after cleaning. Chlorhexidine reduces contamination rates more effectively than povidone-iodine.", hint: "Chlorhexidine must dry completely", tags: ["skin-prep", "collection"], difficulty: "foundational", sortOrder: 5, status: "published" }
    ],
    "cerebrospinal-fluid-analysis-mlt": [
      { discipline: "Urinalysis & Body Fluids", countryTrack: "both", deckTitle: "CSF Analysis", cardType: "comparison", front: "How do you differentiate bacterial from viral meningitis by CSF findings?", back: "Bacterial: Turbid, WBC 100-10,000+ (neutrophils >80%), glucose <40 mg/dL, protein >250 mg/dL, Gram stain often positive. Viral: Clear, WBC 10-500 (lymphocytes), glucose normal/mildly low, protein 50-200 mg/dL, Gram stain negative.", hint: "Neutrophils + low glucose = bacterial; Lymphocytes + normal glucose = viral", tags: ["meningitis", "CSF-differential"], difficulty: "intermediate", sortOrder: 1, status: "published" },
      { discipline: "Urinalysis & Body Fluids", countryTrack: "both", deckTitle: "CSF Analysis", cardType: "term-definition", front: "How do you distinguish traumatic tap from subarachnoid hemorrhage?", back: "Traumatic tap: RBC count decreases from tube 1 to tube 4 (clearing). Supernatant is clear after centrifugation. SAH: RBC count is consistent across all tubes. Xanthochromia (yellow supernatant from bilirubin/oxyhemoglobin degradation) is present.", hint: "Xanthochromia = SAH, Clearing RBCs = traumatic", tags: ["traumatic-tap", "SAH", "xanthochromia"], difficulty: "advanced", sortOrder: 2, status: "published" },
      { discipline: "Urinalysis & Body Fluids", countryTrack: "both", deckTitle: "CSF Analysis", cardType: "procedure-steps", front: "How should CSF collection tubes be distributed to laboratory departments?", back: "Tube 1: Chemistry/serology (glucose, protein). Tube 2: Microbiology (Gram stain, culture). Tube 3: Cell count and differential (least contaminated by traumatic blood). Tube 4: Special studies (cytology, flow cytometry).", hint: "3 for cell count (least traumatic contamination)", tags: ["CSF-tubes", "specimen-distribution"], difficulty: "foundational", sortOrder: 3, status: "published" },
      { discipline: "Urinalysis & Body Fluids", countryTrack: "both", deckTitle: "CSF Analysis", cardType: "term-definition", front: "Why is CSF the most time-critical specimen in the laboratory?", back: "Cells in CSF deteriorate rapidly — neutrophils lyse within 30-60 minutes. Delayed processing causes falsely low WBC counts and shifts the differential toward lymphocyte predominance (mimicking viral meningitis when bacterial meningitis is present).", hint: "Neutrophils lyse within 1 hour", tags: ["CSF", "time-critical", "cell-lysis"], difficulty: "intermediate", sortOrder: 4, status: "published" },
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "CSF Analysis", cardType: "clinical-scenario", front: "India ink preparation of CSF shows organisms with clear halos. What is the diagnosis?", back: "Cryptococcal meningitis (Cryptococcus neoformans). The clear halo represents the polysaccharide capsule seen by negative staining. However, India ink sensitivity is only ~50% — cryptococcal antigen (CrAg) testing is more sensitive.", hint: "Encapsulated yeast in immunocompromised", tags: ["cryptococcus", "india-ink", "meningitis"], difficulty: "advanced", sortOrder: 5, status: "published" }
    ],
    "thyroid-function-testing-mlt": [
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Thyroid Function Testing", cardType: "lab-value", front: "What is the pattern of primary hypothyroidism on TFTs?", back: "High TSH, low free T4. The most common cause is Hashimoto thyroiditis (autoimmune). The elevated TSH reflects the pituitary responding to low thyroid hormone levels via the negative feedback loop.", hint: "TSH UP, FT4 DOWN", tags: ["hypothyroidism", "TSH", "FT4"], difficulty: "foundational", sortOrder: 1, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Thyroid Function Testing", cardType: "clinical-scenario", front: "A patient taking biotin supplements has TSH 0.05 mIU/L and FT4 3.2 ng/dL. What should be suspected?", back: "Biotin interference! In streptavidin-biotin platforms, biotin causes falsely LOW TSH (sandwich assay) and falsely HIGH FT4 (competitive assay) — mimicking hyperthyroidism. The patient is likely euthyroid. Discontinue biotin for 48 hours and retest.", hint: "Biotin = low sandwich, high competitive", tags: ["biotin-interference", "thyroid"], difficulty: "advanced", sortOrder: 2, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Thyroid Function Testing", cardType: "term-definition", front: "Why is TSH the best single screening test for thyroid disorders?", back: "TSH changes logarithmically in response to small changes in free T4. A doubling of FT4 causes a 100-fold decrease in TSH. This amplification effect makes TSH far more sensitive than FT4 for detecting early thyroid dysfunction.", hint: "Logarithmic vs linear response", tags: ["TSH", "screening-sensitivity"], difficulty: "intermediate", sortOrder: 3, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Thyroid Function Testing", cardType: "comparison", front: "What is sick euthyroid syndrome and why should TFTs be avoided during acute illness?", back: "Non-thyroidal illness causes abnormal TFTs without true thyroid disease: typically low T3, variable T4 and TSH. Testing during acute illness produces confusing results that may lead to inappropriate treatment. Defer testing until illness resolves.", hint: "Acute illness causes false abnormalities", tags: ["sick-euthyroid", "non-thyroidal-illness"], difficulty: "intermediate", sortOrder: 4, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Thyroid Function Testing", cardType: "lab-value", front: "What is T3 thyrotoxicosis and when should FT3 be ordered?", back: "T3 thyrotoxicosis: Elevated T3 with normal T4 — occurs in early Graves disease. Order FT3 when TSH is suppressed but FT4 is normal. Approximately 5% of hyperthyroid patients have T3 thyrotoxicosis.", hint: "Suppressed TSH + normal FT4 = check FT3", tags: ["T3-thyrotoxicosis", "Graves-disease"], difficulty: "advanced", sortOrder: 5, status: "published" }
    ],
    "cardiac-biomarkers-troponin-mlt": [
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Cardiac Biomarkers", cardType: "lab-value", front: "What defines a high-sensitivity troponin (hs-cTn) assay?", back: "An assay that can measure troponin in >50% of a healthy reference population with a CV <10% at the 99th percentile upper reference limit (URL). This allows detection of very low troponin levels for early AMI diagnosis.", hint: "Detects troponin in >50% of healthy people", tags: ["hs-troponin", "definition"], difficulty: "intermediate", sortOrder: 1, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Cardiac Biomarkers", cardType: "term-definition", front: "What is the delta change and why is it essential for AMI diagnosis?", back: "Delta change is a rising or falling pattern in serial troponin measurements (≥20% change at 3 hours). It distinguishes acute MI (dynamic change from new injury) from chronic troponin elevation (stable levels from CKD, heart failure).", hint: "Rising/falling pattern = acute", tags: ["delta-change", "serial-troponin"], difficulty: "intermediate", sortOrder: 2, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Cardiac Biomarkers", cardType: "comparison", front: "Why has hs-cTn replaced CK-MB as the primary AMI biomarker?", back: "hs-cTn is more cardiac-specific (CK-MB also found in skeletal muscle), more sensitive (detects smaller infarcts), has earlier rise (1-3 hours vs 4-6 hours for CK-MB), and remains elevated longer (7-14 days vs 48-72 hours).", hint: "More specific, more sensitive, earlier detection", tags: ["troponin-vs-CK-MB"], difficulty: "intermediate", sortOrder: 3, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Cardiac Biomarkers", cardType: "lab-value", front: "What BNP level effectively rules out heart failure?", back: "BNP <100 pg/mL has strong negative predictive value (>95%) for ruling out heart failure. BNP >400 pg/mL is strongly suggestive of heart failure. The 100-400 range is a gray zone requiring clinical correlation.", hint: "<100 = unlikely, >400 = likely", tags: ["BNP", "heart-failure"], difficulty: "intermediate", sortOrder: 4, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Cardiac Biomarkers", cardType: "clinical-scenario", front: "An obese patient has symptoms of heart failure but BNP is only 80 pg/mL. Why might this be misleading?", back: "Obesity falsely LOWERS BNP levels because adipose tissue clears BNP. The apparently normal BNP may not rule out heart failure in obese patients. Use NT-proBNP instead (not cleared by adipose tissue).", hint: "Fat tissue clears BNP", tags: ["BNP", "obesity", "NT-proBNP"], difficulty: "advanced", sortOrder: 5, status: "published" }
    ],
    "hemolytic-anemia-lab-workup": [
      { discipline: "Hematology", countryTrack: "both", deckTitle: "Hemolytic Anemia Workup", cardType: "lab-value", front: "What is the most sensitive single marker for hemolysis?", back: "Haptoglobin. It binds free hemoglobin released from lysed RBCs. Undetectable haptoglobin (in the absence of liver disease) is virtually diagnostic of hemolysis. However, haptoglobin is an acute phase reactant — may be falsely normal in concurrent inflammation.", hint: "Consumed by free hemoglobin", tags: ["haptoglobin", "hemolysis-marker"], difficulty: "intermediate", sortOrder: 1, status: "published" },
      { discipline: "Hematology", countryTrack: "both", deckTitle: "Hemolytic Anemia Workup", cardType: "comparison", front: "How do you differentiate intravascular from extravascular hemolysis?", back: "Intravascular: Hemoglobinemia, hemoglobinuria, hemosiderinuria, haptoglobin undetectable. Extravascular: Elevated indirect bilirubin, haptoglobin decreased but may be detectable, no hemoglobinemia/hemoglobinuria. Both show elevated LDH and reticulocytosis.", hint: "Intravascular = free hemoglobin in blood and urine", tags: ["intravascular", "extravascular", "hemolysis"], difficulty: "advanced", sortOrder: 2, status: "published" },
      { discipline: "Hematology", countryTrack: "both", deckTitle: "Hemolytic Anemia Workup", cardType: "term-definition", front: "What does a positive DAT (Direct Antiglobulin Test) indicate in hemolytic anemia?", back: "A positive DAT indicates immune-mediated hemolysis — antibodies (IgG) and/or complement (C3d) are bound to the patient's RBCs in vivo. Warm AIHA: DAT positive for IgG. Cold AIHA: DAT positive for C3d only.", hint: "Antibody on the red cell surface", tags: ["DAT", "immune-hemolysis"], difficulty: "intermediate", sortOrder: 3, status: "published" },
      { discipline: "Hematology", countryTrack: "both", deckTitle: "Hemolytic Anemia Workup", cardType: "clinical-scenario", front: "A peripheral smear shows schistocytes with thrombocytopenia. What diagnoses should be considered?", back: "TTP (thrombotic thrombocytopenic purpura), HUS (hemolytic uremic syndrome), or DIC (disseminated intravascular coagulation). Schistocytes indicate microangiopathic hemolytic anemia (MAHA). This is a medical emergency requiring immediate clinical notification.", hint: "Fragmented RBCs = mechanical hemolysis", tags: ["schistocytes", "TTP", "DIC", "MAHA"], difficulty: "advanced", sortOrder: 4, status: "published" },
      { discipline: "Hematology", countryTrack: "both", deckTitle: "Hemolytic Anemia Workup", cardType: "term-definition", front: "Why should G6PD testing NOT be performed during an acute hemolytic episode?", back: "During acute hemolysis, the older G6PD-deficient RBCs have already been destroyed, leaving predominantly young RBCs (reticulocytes) which have near-normal G6PD levels. This produces a falsely normal result. Wait 2-3 months after the episode.", hint: "Old deficient cells are gone, young normal cells remain", tags: ["G6PD", "timing", "false-normal"], difficulty: "advanced", sortOrder: 5, status: "published" }
    ],
    "platelet-function-testing-disorders": [
      { discipline: "Hemostasis / Coagulation", countryTrack: "both", deckTitle: "Platelet Function Testing", cardType: "term-definition", front: "What does ristocetin test and what disorders affect it?", back: "Ristocetin induces vWF-GPIb binding (platelet ADHESION). Absent ristocetin response: von Willebrand disease (corrected by adding normal plasma) or Bernard-Soulier syndrome (NOT corrected by adding normal plasma).", hint: "Tests adhesion, not aggregation", tags: ["ristocetin", "vWD", "Bernard-Soulier"], difficulty: "advanced", sortOrder: 1, status: "published" },
      { discipline: "Hemostasis / Coagulation", countryTrack: "both", deckTitle: "Platelet Function Testing", cardType: "comparison", front: "How does Glanzmann thrombasthenia differ from Bernard-Soulier on aggregometry?", back: "Glanzmann (GPIIb/IIIa deficiency): Absent aggregation to ALL agonists EXCEPT ristocetin. Bernard-Soulier (GPIb deficiency): Absent response to ristocetin ONLY, normal response to all other agonists. Plus giant platelets on smear.", hint: "Glanzmann = can't aggregate, Bernard-Soulier = can't adhere", tags: ["Glanzmann", "Bernard-Soulier", "aggregometry"], difficulty: "advanced", sortOrder: 2, status: "published" },
      { discipline: "Hemostasis / Coagulation", countryTrack: "both", deckTitle: "Platelet Function Testing", cardType: "lab-value", front: "PFA-100 shows prolonged Col/EPI closure time but normal Col/ADP. What is the most likely cause?", back: "Aspirin effect. Aspirin irreversibly inhibits cyclooxygenase (COX-1), blocking thromboxane A2 production. This affects the epinephrine pathway more than ADP. Prolonged Col/EPI with normal Col/ADP is the classic aspirin pattern.", hint: "Aspirin blocks thromboxane", tags: ["PFA-100", "aspirin-effect"], difficulty: "intermediate", sortOrder: 3, status: "published" },
      { discipline: "Hemostasis / Coagulation", countryTrack: "both", deckTitle: "Platelet Function Testing", cardType: "term-definition", front: "What is von Willebrand disease and why is it the most common inherited bleeding disorder?", back: "vWD is a quantitative or qualitative deficiency of von Willebrand factor. Prevalence ~1%. Type 1 (70-80%): Partial quantitative deficiency. Type 2: Qualitative defects (subtypes A, B, M, N). Type 3: Complete absence (rare, severe). Causes mucocutaneous bleeding.", hint: "vWF deficiency, 1% prevalence", tags: ["vWD", "inherited-bleeding"], difficulty: "intermediate", sortOrder: 4, status: "published" },
      { discipline: "Hemostasis / Coagulation", countryTrack: "both", deckTitle: "Platelet Function Testing", cardType: "procedure-steps", front: "What pre-analytical requirements are critical for platelet aggregometry?", back: "Citrate tube (blue-top). Prepare PRP by slow centrifugation (150-200×g, 10 min). Keep at room temperature — DO NOT refrigerate (cold activates platelets). Analyze within 4 hours. Patient should avoid aspirin/NSAIDs for 7-10 days before testing.", hint: "Room temperature, no aspirin, analyze quickly", tags: ["aggregometry", "pre-analytical"], difficulty: "intermediate", sortOrder: 5, status: "published" }
    ],
    "acid-fast-staining-mycobacteriology": [
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Acid-Fast Staining", cardType: "procedure-steps", front: "What are the steps of the Ziehl-Neelsen (ZN) acid-fast stain?", back: "1. Flood with carbol fuchsin, heat until steaming for 5 min. 2. Decolorize with acid-alcohol (3% HCl in 95% ethanol). 3. Counterstain with methylene blue. Result: AFB = RED rods on BLUE background.", hint: "Carbol fuchsin → Acid-alcohol → Methylene blue", tags: ["ZN-stain", "AFB-procedure"], difficulty: "foundational", sortOrder: 1, status: "published" },
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Acid-Fast Staining", cardType: "comparison", front: "What is the advantage of auramine-rhodamine over Ziehl-Neelsen for AFB detection?", back: "Auramine-rhodamine fluorescent stain is more sensitive because mycobacteria fluoresce brightly, allowing examination at lower magnification (250×-450×) and scanning of more fields per slide. ZN requires oil immersion (1000×). Positive fluorescent smears should be confirmed with ZN.", hint: "More area scanned at lower magnification", tags: ["auramine-rhodamine", "fluorescent-AFB"], difficulty: "intermediate", sortOrder: 2, status: "published" },
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Acid-Fast Staining", cardType: "lab-value", front: "How is AFB smear result quantified and reported?", back: "No AFB seen (report after scanning 300 fields). 1-2 AFB/300 fields (report exact number, request repeat). 1-9 AFB/100 fields = 1+. 1-9 AFB/10 fields = 2+. 1-9 AFB/field = 3+. >9 AFB/field = 4+.", hint: "Standardized semiquantitative reporting", tags: ["AFB-reporting", "quantification"], difficulty: "intermediate", sortOrder: 3, status: "published" },
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Acid-Fast Staining", cardType: "term-definition", front: "What biochemical test differentiates M. tuberculosis from most nontuberculous mycobacteria?", back: "Niacin accumulation test. M. tuberculosis is niacin-positive (accumulates niacin because it lacks the enzyme to convert niacin to other metabolites). Most NTM are niacin-negative.", hint: "Niacin positive = TB", tags: ["niacin-test", "M-tuberculosis", "identification"], difficulty: "intermediate", sortOrder: 4, status: "published" },
      { discipline: "Microbiology", countryTrack: "both", deckTitle: "Acid-Fast Staining", cardType: "term-definition", front: "What biosafety precautions are required for processing mycobacteriology specimens?", back: "Process all specimens in a certified biological safety cabinet (BSC Class II or III). BSL-3 containment for culture manipulation. N95 respirator if BSC not available. Never centrifuge uncapped tubes. All waste autoclaved before disposal.", hint: "BSC, BSL-3, N95", tags: ["biosafety", "mycobacteriology", "BSL-3"], difficulty: "intermediate", sortOrder: 5, status: "published" }
    ],
    "flow-cytometry-clinical-applications": [
      { discipline: "Immunology / Serology", countryTrack: "both", deckTitle: "Flow Cytometry", cardType: "term-definition", front: "What do forward scatter (FSC) and side scatter (SSC) measure in flow cytometry?", back: "FSC = cell SIZE (larger cells scatter more light forward). SSC = cellular GRANULARITY/COMPLEXITY (cells with more internal structures scatter more light at 90°). Together they identify lymphocytes (low FSC/SSC), monocytes (medium), and granulocytes (high SSC).", hint: "Forward = size, Side = granularity", tags: ["scatter", "flow-cytometry"], difficulty: "foundational", sortOrder: 1, status: "published" },
      { discipline: "Immunology / Serology", countryTrack: "both", deckTitle: "Flow Cytometry", cardType: "lab-value", front: "What CD4 count defines AIDS and what is the normal range?", back: "CD4 <200 cells/μL defines AIDS. Normal CD4: 500-1500 cells/μL. CD4:CD8 ratio normally >1.0, inverted in HIV. CD4 count guides prophylaxis decisions (PCP prophylaxis when CD4 <200).", hint: "<200 = AIDS", tags: ["CD4", "HIV", "AIDS"], difficulty: "foundational", sortOrder: 2, status: "published" },
      { discipline: "Immunology / Serology", countryTrack: "both", deckTitle: "Flow Cytometry", cardType: "clinical-scenario", front: "Flow cytometry on a blood sample shows CD5+/CD19+/CD23+ with dim CD20 expression. What is the diagnosis?", back: "Chronic lymphocytic leukemia (CLL). The classic immunophenotype is CD5+ (normally a T-cell marker) co-expressed with CD19+ (B-cell), CD23+, and characteristically DIM CD20. This is a classic exam question.", hint: "B-cell marker + T-cell marker coexpression", tags: ["CLL", "immunophenotyping", "CD5"], difficulty: "advanced", sortOrder: 3, status: "published" },
      { discipline: "Immunology / Serology", countryTrack: "both", deckTitle: "Flow Cytometry", cardType: "term-definition", front: "What is compensation in flow cytometry and why is it necessary?", back: "Compensation is mathematical correction for spectral overlap between fluorochromes. When multiple fluorochromes emit in overlapping wavelengths, the signal from one bleeds into the detector for another, causing false co-expression. Single-stained controls establish correction values.", hint: "Corrects for fluorochrome overlap", tags: ["compensation", "spectral-overlap"], difficulty: "advanced", sortOrder: 4, status: "published" },
      { discipline: "Immunology / Serology", countryTrack: "both", deckTitle: "Flow Cytometry", cardType: "comparison", front: "How is PNH diagnosed by flow cytometry?", back: "PNH (paroxysmal nocturnal hemoglobinuria) is diagnosed by absence of GPI-anchored proteins CD55 and CD59 on RBCs and WBCs. FLAER (fluorescent aerolysin) assay on WBCs is more sensitive than CD55/CD59 on RBCs and is the preferred method.", hint: "Missing GPI-anchored proteins", tags: ["PNH", "CD55", "CD59", "FLAER"], difficulty: "advanced", sortOrder: 5, status: "published" }
    ],
    "electrolyte-panel-interpretation-mlt": [
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Electrolyte Panel", cardType: "term-definition", front: "What is pseudohyponatremia and how is it detected?", back: "Falsely low sodium on indirect ISE due to lipid or protein displacement of the water fraction. The lipid/protein occupies volume, reducing the plasma water fraction. Direct ISE (blood gas analyzer) gives the TRUE sodium value. Compare direct vs indirect ISE to detect.", hint: "Indirect ISE artifact in high lipids/proteins", tags: ["pseudohyponatremia", "ISE"], difficulty: "advanced", sortOrder: 1, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Electrolyte Panel", cardType: "lab-value", front: "What is the most common pre-analytical error affecting potassium?", back: "Hemolysis. RBC intracellular K+ concentration is ~150 mEq/L vs plasma ~4 mEq/L. Even mild hemolysis releases enough K+ to falsely elevate the result. Always check hemolysis index before reporting potassium.", hint: "K+ in RBCs is 40x higher than plasma", tags: ["hemolysis", "potassium", "pre-analytical"], difficulty: "foundational", sortOrder: 2, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Electrolyte Panel", cardType: "clinical-scenario", front: "Na+ 140, Cl- 100, HCO3- 14 mEq/L. What is the anion gap and what does it suggest?", back: "Anion gap = 140 - (100 + 14) = 26 mEq/L. Elevated (normal 8-12). Suggests elevated anion gap metabolic acidosis — use MUDPILES to determine cause (DKA, lactic acidosis, uremia, toxic ingestion).", hint: "Na - (Cl + HCO3) = AG", tags: ["anion-gap", "metabolic-acidosis"], difficulty: "intermediate", sortOrder: 3, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Electrolyte Panel", cardType: "comparison", front: "What is the difference between direct and indirect ISE for electrolyte measurement?", back: "Direct ISE: Undiluted specimen — measures ion activity. Not affected by protein/lipid (no pseudohyponatremia). Used in blood gas analyzers. Indirect ISE: Diluted specimen — most common on chemistry analyzers. Susceptible to pseudohyponatremia in hyperproteinemia/hyperlipidemia.", hint: "Direct = undiluted, Indirect = diluted", tags: ["direct-ISE", "indirect-ISE"], difficulty: "intermediate", sortOrder: 4, status: "published" },
      { discipline: "Clinical Chemistry", countryTrack: "both", deckTitle: "Electrolyte Panel", cardType: "lab-value", front: "K+ >6.0 mEq/L is reported. What is the clinical urgency?", back: "K+ >6.0 mEq/L is a CRITICAL value requiring immediate notification. Hyperkalemia causes cardiac arrhythmias (peaked T waves, widened QRS, sine wave) and cardiac arrest. First verify: rule out hemolysis, EDTA contamination, and fist clenching.", hint: "Life-threatening arrhythmia risk", tags: ["critical-value", "hyperkalemia"], difficulty: "intermediate", sortOrder: 5, status: "published" }
    ],
    "westgard-rules-quality-control-lab": [
      { discipline: "Laboratory Operations & Quality Management", countryTrack: "both", deckTitle: "Westgard Rules and QC", cardType: "term-definition", front: "What is the 1₂s Westgard rule and is it a rejection rule?", back: "The 1₂s rule: One QC value exceeds ±2SD. This is a WARNING rule, NOT a rejection rule. It alerts the technologist to investigate further by checking subsequent Westgard rules (1₃s, 2₂s, R₄s, 4₁s, 10x̄). Do not reject results based on 1₂s alone.", hint: "Warning only, investigate further", tags: ["1-2s", "warning-rule"], difficulty: "intermediate", sortOrder: 1, status: "published" },
      { discipline: "Laboratory Operations & Quality Management", countryTrack: "both", deckTitle: "Westgard Rules and QC", cardType: "comparison", front: "Which Westgard rules detect random error vs systematic error?", back: "Random error: 1₃s (one QC exceeds ±3SD), R₄s (range between two controls exceeds 4SD). Systematic error: 2₂s (two consecutive QC on same side exceed ±2SD), 4₁s (four consecutive QC on same side exceed ±1SD), 10x̄ (ten consecutive QC on same side of mean).", hint: "Random = individual outliers, Systematic = patterns/shifts", tags: ["random-error", "systematic-error", "westgard"], difficulty: "advanced", sortOrder: 2, status: "published" },
      { discipline: "Laboratory Operations & Quality Management", countryTrack: "both", deckTitle: "Westgard Rules and QC", cardType: "term-definition", front: "What is the difference between a trend and a shift on a Levey-Jennings chart?", back: "Trend: 6+ consecutive QC points moving progressively in one direction (gradual drift — often due to reagent deterioration or calibrator degradation). Shift: Sudden, abrupt change to a new mean level (often due to new reagent lot, calibration error, or instrument change).", hint: "Gradual = trend, Sudden = shift", tags: ["trend", "shift", "L-J-chart"], difficulty: "intermediate", sortOrder: 3, status: "published" },
      { discipline: "Laboratory Operations & Quality Management", countryTrack: "both", deckTitle: "Westgard Rules and QC", cardType: "lab-value", front: "How is the coefficient of variation (CV) calculated and what does it indicate?", back: "CV = (SD / Mean) × 100. It measures analytical precision as a percentage. Lower CV = better precision. General targets: <5% for chemistry, <3% for hematology. CV allows comparison of precision across different analytes and methods.", hint: "Standard deviation as percentage of mean", tags: ["CV", "precision", "QC-calculation"], difficulty: "intermediate", sortOrder: 4, status: "published" },
      { discipline: "Laboratory Operations & Quality Management", countryTrack: "both", deckTitle: "Westgard Rules and QC", cardType: "procedure-steps", front: "What should a technologist do when a QC result violates a Westgard rejection rule?", back: "1. STOP releasing patient results. 2. Investigate the cause (reagents, calibration, instrument, controls, technique). 3. Correct the identified problem. 4. Rerun QC to verify correction. 5. Re-analyze patient specimens run since the last acceptable QC. 6. Document everything (error, investigation, corrective action).", hint: "Stop → Investigate → Correct → Rerun → Document", tags: ["out-of-control", "corrective-action"], difficulty: "intermediate", sortOrder: 5, status: "published" },
      { discipline: "Laboratory Operations & Quality Management", countryTrack: "both", deckTitle: "Westgard Rules and QC", cardType: "clinical-scenario", front: "QC shows 7 consecutive values below the mean but within ±2SD. What Westgard rule is triggered and what does it indicate?", back: "The 10x̄ rule is being approached (not yet triggered at 7 — requires 10 consecutive values on the same side). However, 7 consecutive values on one side indicates a developing SHIFT or systematic error. Investigate proactively: check calibration, reagent lot, and instrument performance.", hint: "Developing systematic error", tags: ["10x-rule", "systematic-error", "shift"], difficulty: "advanced", sortOrder: 6, status: "published" }
    ],
    "transfusion-reactions-identification-mlt": [
      { discipline: "Immunohematology / Blood Banking", countryTrack: "both", deckTitle: "Transfusion Reactions", cardType: "procedure-steps", front: "What is the first step in a transfusion reaction investigation?", back: "STOP the transfusion immediately, then perform a CLERICAL CHECK — verify all identification on the patient armband, blood bag label, compatibility tag, and transfusion record. Most fatal AHTRs are caused by patient/specimen misidentification (wrong blood to wrong patient).", hint: "Clerical check first — most errors are identification errors", tags: ["clerical-check", "transfusion-reaction"], difficulty: "foundational", sortOrder: 1, status: "published" },
      { discipline: "Immunohematology / Blood Banking", countryTrack: "both", deckTitle: "Transfusion Reactions", cardType: "comparison", front: "How do you differentiate TRALI from TACO?", back: "TRALI (Transfusion-Related Acute Lung Injury): NON-cardiogenic pulmonary edema, normal/low BNP, bilateral infiltrates within 6 hours, hypoxia. Treatment: supportive care (NO diuretics). TACO (Circulatory Overload): CARDIOGENIC pulmonary edema, elevated BNP, volume overload. Treatment: diuretics, slow transfusion rate.", hint: "TRALI = immune/non-cardiogenic, TACO = volume/cardiogenic", tags: ["TRALI", "TACO", "differentiation"], difficulty: "advanced", sortOrder: 2, status: "published" },
      { discipline: "Immunohematology / Blood Banking", countryTrack: "both", deckTitle: "Transfusion Reactions", cardType: "term-definition", front: "Why are Kidd antibodies (anti-Jka, anti-Jkb) notorious in blood banking?", back: "Kidd antibodies drop below detectable levels between transfusion episodes (evanescent antibodies). They are missed on subsequent pre-transfusion antibody screens. Upon re-exposure, an anamnestic response produces rapid antibody rise causing DHTR 3-14 days later.", hint: "Antibodies disappear and come back", tags: ["Kidd-antibodies", "DHTR"], difficulty: "advanced", sortOrder: 3, status: "published" },
      { discipline: "Immunohematology / Blood Banking", countryTrack: "both", deckTitle: "Transfusion Reactions", cardType: "clinical-scenario", front: "During a transfusion reaction workup, the post-reaction serum appears pink/red. What does this indicate?", back: "Hemoglobinemia — free hemoglobin in the plasma from intravascular hemolysis. This suggests acute hemolytic transfusion reaction (AHTR), most commonly from ABO incompatibility. Compare to pre-transfusion specimen for confirmation.", hint: "Visual hemolysis check", tags: ["hemoglobinemia", "visual-hemolysis", "AHTR"], difficulty: "intermediate", sortOrder: 4, status: "published" },
      { discipline: "Immunohematology / Blood Banking", countryTrack: "both", deckTitle: "Transfusion Reactions", cardType: "term-definition", front: "What is the most common type of transfusion reaction?", back: "Febrile non-hemolytic transfusion reaction (FNHTR). Caused by cytokines from stored donor leukocytes or recipient antibodies to donor WBC antigens. Symptoms: Fever, chills, rigors without hemolysis. Prevented by leukoreduction of blood products.", hint: "Fever without hemolysis", tags: ["FNHTR", "most-common-reaction"], difficulty: "intermediate", sortOrder: 5, status: "published" }
    ],
    "syphilis-testing-algorithms-mlt": [
      { discipline: "Immunology / Serology", countryTrack: "both", deckTitle: "Syphilis Testing", cardType: "comparison", front: "What is the difference between non-treponemal and treponemal syphilis tests?", back: "Non-treponemal (RPR, VDRL): Detect reagin antibodies to cardiolipin. Correlate with disease activity (titer rises/falls). Can have biologic false positives. Treponemal (FTA-ABS, TP-PA, EIA): Detect antibodies to T. pallidum antigens. More specific. Remain positive for LIFE — cannot monitor treatment.", hint: "Non-treponemal = activity, Treponemal = ever infected", tags: ["non-treponemal", "treponemal"], difficulty: "intermediate", sortOrder: 1, status: "published" },
      { discipline: "Immunology / Serology", countryTrack: "both", deckTitle: "Syphilis Testing", cardType: "term-definition", front: "What is the prozone effect in syphilis testing?", back: "The prozone effect occurs in secondary syphilis when antibody concentration is so high that it overwhelms the antigen in the test system, preventing flocculation and producing a falsely NON-REACTIVE RPR. Solution: dilute the specimen and retest.", hint: "Too much antibody = false negative", tags: ["prozone-effect", "RPR"], difficulty: "advanced", sortOrder: 2, status: "published" },
      { discipline: "Immunology / Serology", countryTrack: "both", deckTitle: "Syphilis Testing", cardType: "lab-value", front: "How is RPR titer used to monitor treatment response?", back: "A 4-fold decline in RPR titer (e.g., 1:32 → 1:8) indicates successful treatment. Titers should be monitored at 6, 12, and 24 months post-treatment. A 4-fold RISE suggests reinfection or treatment failure. Persistent low titer (serofast) after adequate treatment is acceptable.", hint: "4-fold decline = treatment success", tags: ["RPR-titer", "treatment-monitoring"], difficulty: "intermediate", sortOrder: 3, status: "published" },
      { discipline: "Immunology / Serology", countryTrack: "both", deckTitle: "Syphilis Testing", cardType: "comparison", front: "What is the difference between the traditional and reverse syphilis algorithms?", back: "Traditional: Screen with non-treponemal (RPR/VDRL) → Confirm reactive with treponemal (FTA-ABS). Reverse: Screen with treponemal EIA/CIA → Confirm reactive with RPR → If discordant, resolve with TP-PA. Reverse algorithm is preferred for automated high-volume labs.", hint: "Traditional starts non-treponemal, Reverse starts treponemal", tags: ["traditional-algorithm", "reverse-algorithm"], difficulty: "intermediate", sortOrder: 4, status: "published" },
      { discipline: "Immunology / Serology", countryTrack: "both", deckTitle: "Syphilis Testing", cardType: "term-definition", front: "What syphilis test can be performed on CSF for neurosyphilis?", back: "CSF-VDRL is the only non-treponemal test validated for CSF. It is highly specific but has low sensitivity (30-70%). A positive CSF-VDRL strongly supports neurosyphilis. A negative CSF-VDRL does NOT rule out neurosyphilis. RPR is NOT approved for CSF.", hint: "VDRL only, NOT RPR, for CSF", tags: ["CSF-VDRL", "neurosyphilis"], difficulty: "advanced", sortOrder: 5, status: "published" }
    ]
  };

  return flashcardSets[lesson.slug] || [];
}

async function seedMltStructuredLessons() {
  console.log("\n=== MLT Structured Lessons & Flashcards Seeder ===\n");
  logStartupDatabaseResolution();

  const tableCheck = await pool.query(
    `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'mlt_lessons')`
  );
  if (!tableCheck.rows[0].exists) {
    console.error("mlt_lessons table does not exist! Run migrations first.");
    process.exit(1);
  }

  const flashcardTableCheck = await pool.query(
    `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'mlt_flashcards')`
  );
  if (!flashcardTableCheck.rows[0].exists) {
    console.error("mlt_flashcards table does not exist! Run migrations first.");
    process.exit(1);
  }

  const existingSlugs = await pool.query(`SELECT slug FROM mlt_lessons`);
  const existingSlugSet = new Set(existingSlugs.rows.map((r: any) => r.slug));
  console.log(`Existing lesson slugs in DB: ${existingSlugSet.size}`);

  let lessonsInserted = 0;
  let lessonsSkipped = 0;
  let flashcardsInserted = 0;
  let errors = 0;

  for (const lesson of lessons) {
    if (existingSlugSet.has(lesson.slug)) {
      console.log(`  SKIP (exists): ${lesson.slug}`);
      lessonsSkipped++;
      continue;
    }

    try {
      const contentWithCrossRefs = lesson.content.map(section => ({
        ...section,
      }));

      const contentJson = JSON.stringify(contentWithCrossRefs);

      const relatedMeta = {
        relatedQuestionDisciplines: lesson.relatedQuestionDisciplines || [],
        relatedFlashcardDecks: lesson.relatedFlashcardDecks || [],
      };

      const fullContent = JSON.stringify([
        ...contentWithCrossRefs,
        { sectionTitle: "Related Study Materials", content: JSON.stringify(relatedMeta) }
      ]);

      await pool.query(
        `INSERT INTO mlt_lessons (
          id, title, slug, module_title, topic_title, discipline, disciplines,
          country_track, difficulty, blueprint_categories, content, summary,
          objectives, glossary_terms, estimated_minutes, sort_order, tier, status,
          seo_title, seo_description, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
          $12, $13, $14, $15, $16, $17, $18, $19, NOW(), NOW()
        )`,
        [
          lesson.title,
          lesson.slug,
          lesson.moduleTitle,
          lesson.topicTitle,
          lesson.discipline,
          lesson.disciplines,
          lesson.countryTrack,
          lesson.difficulty,
          lesson.blueprintCategories,
          fullContent,
          lesson.summary,
          lesson.objectives,
          JSON.stringify(lesson.glossaryTerms),
          lesson.estimatedMinutes,
          lesson.sortOrder,
          lesson.tier,
          lesson.status,
          lesson.seoTitle,
          lesson.seoDescription,
        ]
      );

      lessonsInserted++;
      console.log(`  INSERT: ${lesson.slug} (${lesson.title})`);

      const flashcards = generateFlashcardsForLesson(lesson);
      for (let i = 0; i < flashcards.length; i++) {
        const fc = flashcards[i];
        try {
          await pool.query(
            `INSERT INTO mlt_flashcards (
              id, discipline, country_track, deck_title, card_type, front, back,
              hint, mnemonic, image_url, image_alt, tags, difficulty, sort_order,
              status, created_at, updated_at
            ) VALUES (
              gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW()
            )`,
            [
              fc.discipline,
              fc.countryTrack,
              fc.deckTitle,
              fc.cardType,
              fc.front,
              fc.back,
              fc.hint || null,
              fc.mnemonic || null,
              fc.imageUrl || null,
              fc.imageAlt || null,
              fc.tags,
              fc.difficulty,
              fc.sortOrder,
              fc.status,
            ]
          );
          flashcardsInserted++;
        } catch (err: any) {
          errors++;
          console.error(`    Flashcard error (${fc.deckTitle} #${i + 1}): ${err.message}`);
        }
      }
    } catch (err: any) {
      errors++;
      console.error(`  ERROR inserting ${lesson.slug}: ${err.message}`);
    }
  }

  console.log("\n--- Summary ---");
  console.log(`Total lessons defined: ${lessons.length}`);
  console.log(`Lessons inserted: ${lessonsInserted}`);
  console.log(`Lessons skipped (already exist): ${lessonsSkipped}`);
  console.log(`Flashcards inserted: ${flashcardsInserted}`);
  console.log(`Errors: ${errors}`);

  const lessonCount = await pool.query(`SELECT COUNT(*) FROM mlt_lessons WHERE status = 'published'`);
  const flashcardCount = await pool.query(`SELECT COUNT(*) FROM mlt_flashcards WHERE status = 'published'`);
  console.log(`\nTotal published mlt_lessons: ${lessonCount.rows[0].count}`);
  console.log(`Total published mlt_flashcards: ${flashcardCount.rows[0].count}`);

  const disciplineBreakdown = await pool.query(
    `SELECT discipline, COUNT(*) as count FROM mlt_lessons WHERE status = 'published' GROUP BY discipline ORDER BY count DESC`
  );
  console.log("\nLesson discipline breakdown:");
  for (const row of disciplineBreakdown.rows) {
    console.log(`  ${row.discipline}: ${row.count}`);
  }

  const deckBreakdown = await pool.query(
    `SELECT deck_title, COUNT(*) as count FROM mlt_flashcards WHERE status = 'published' GROUP BY deck_title ORDER BY deck_title`
  );
  console.log("\nFlashcard deck breakdown:");
  for (const row of deckBreakdown.rows) {
    console.log(`  ${row.deck_title}: ${row.count}`);
  }

  const success = errors === 0;
  console.log("\n=== Seeding complete! ===");
  console.log(
    JSON.stringify({
      type: "mlt_seed_verification",
      success,
      lessonsInserted,
      lessonsSkipped,
      flashcardsInserted,
      errors,
      publishedMltLessons: lessonCount.rows[0].count,
      publishedMltFlashcards: flashcardCount.rows[0].count,
    }),
  );
  console.log("\n");

  return success;
}

seedMltStructuredLessons()
  .then((ok) => process.exit(ok ? 0 : 1))
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
  });
