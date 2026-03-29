import type { LessonContent } from "./types";

export const mltLessonRepairBatch: Record<string, LessonContent> = {
  "flow-cytometry-immunophenotyping-mlt": {
    title: "Flow Cytometry and Immunophenotyping",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Improper specimen handling causing cell death and loss of surface marker expression",
      "Delayed sample processing beyond 24 hours degrading lymphocyte viability",
      "Antibody panel selection errors leading to incomplete or inaccurate immunophenotyping",
    ],
    diagnostics: [
      "CD marker analysis for leukemia/lymphoma classification per WHO guidelines",
      "DNA content analysis (ploidy and S-phase) for tumor prognostication",
      "Lymphocyte subset quantification: CD3, CD4, CD8, CD19, CD56 for immune monitoring",
    ],
    management: [
      "Process specimens within 24 hours using appropriate anticoagulant (EDTA or heparin)",
      "Validate instrument performance with daily quality control beads before patient testing",
      "Apply standardized gating strategies per Euroflow or Bethesda consensus panels",
    ],
    nursingActions: [
      "Collect adequate specimen volume in correct anticoagulant tube per laboratory protocol",
      "Label specimen accurately and transport at room temperature without fixation",
      "Communicate clinical history and suspected diagnosis to laboratory for appropriate panel selection",
    ],
    assessmentFindings: [
      "Aberrant antigen expression patterns indicating neoplastic versus reactive cell populations",
      "CD4:CD8 ratio < 1.0 in HIV monitoring indicating immune suppression progression",
      "Blast population with specific immunophenotype guiding leukemia classification and treatment",
    ],
    medications: [
      { name: "Rituximab", dose: "375 mg/m² IV", route: "Intravenous", purpose: "Anti-CD20 monoclonal antibody; flow cytometry monitors CD20+ B-cell depletion" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "hemostasis-advanced-testing-mlt": {
    title: "Advanced Hemostasis and Thrombophilia Testing",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Heparin contamination from line draws causing falsely prolonged coagulation times",
      "Underfilled citrate tubes altering blood-to-anticoagulant ratio and affecting PT/aPTT results",
      "Sample hemolysis releasing phospholipids and tissue factor causing spurious coagulation results",
    ],
    diagnostics: [
      "Mixing study (1:1 mix with normal plasma) differentiating factor deficiency from inhibitor presence",
      "Lupus anticoagulant panel: dRVVT, hexagonal phase phospholipid neutralization, silica clotting time",
      "Thrombophilia workup: Protein C, Protein S, antithrombin, Factor V Leiden, prothrombin G20210A mutation",
    ],
    management: [
      "Perform mixing studies before factor assays when aPTT is prolonged to guide workup",
      "Defer thrombophilia testing until 4-6 weeks after acute thrombotic event and off anticoagulation",
      "Verify critical coagulation results with repeat testing and correlation with clinical history",
    ],
    nursingActions: [
      "Collect citrate tubes with proper 9:1 blood-to-anticoagulant ratio; reject underfilled specimens",
      "Process coagulation specimens within 4 hours at room temperature; platelet-poor plasma for aPTT",
      "Document current anticoagulant therapy on requisition as it affects all coagulation test interpretation",
    ],
    assessmentFindings: [
      "Mixing study correcting to normal indicating factor deficiency; failure to correct suggesting inhibitor",
      "Lupus anticoagulant positive: prolonged phospholipid-dependent clotting tests not correcting with mixing",
      "Factor V Leiden heterozygote with 5-10x increased DVT risk; homozygote with 50-100x risk",
    ],
    medications: [
      { name: "Enoxaparin", dose: "1 mg/kg SC q12h", route: "Subcutaneous", purpose: "LMWH monitored by anti-Xa levels; aPTT unreliable for LMWH monitoring" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "blood-gas-electrolyte-analysis-mlt": {
    title: "Blood Gas and Electrolyte Analysis",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Air bubbles in ABG syringe equilibrating with atmospheric PO2 causing falsely elevated PaO2",
      "Delayed analysis allowing continued cellular metabolism to consume O2 and produce CO2",
      "Venous sample inadvertently submitted as arterial specimen producing misleading results",
    ],
    diagnostics: [
      "Blood gas analyzer measuring pH, PaCO2, PaO2, HCO3, base excess, and electrolytes simultaneously",
      "Ion-selective electrode (ISE) technology for sodium, potassium, chloride, and ionized calcium measurement",
      "Co-oximetry measuring total hemoglobin, oxyhemoglobin, carboxyhemoglobin, and methemoglobin fractions",
    ],
    management: [
      "Analyze ABG specimens within 15-30 minutes or store on ice to minimize cellular metabolism effects",
      "Perform two-point calibration of blood gas analyzers at regular intervals using certified buffer solutions",
      "Verify electrolyte results with main laboratory chemistry when point-of-care values are critical",
    ],
    nursingActions: [
      "Ensure proper specimen collection: heparinized syringe, no air bubbles, ice transport if delayed",
      "Document patient temperature for temperature-corrected blood gas interpretation",
      "Correlate blood gas and electrolyte results with clinical status before therapeutic decisions",
    ],
    assessmentFindings: [
      "Critical ABG values requiring immediate notification: pH < 7.20 or > 7.60, PaO2 < 40 mmHg",
      "Potassium > 6.0 mEq/L or < 2.5 mEq/L requiring urgent clinical intervention",
      "Ionized calcium < 0.8 mmol/L indicating hypocalcemia requiring assessment for tetany risk",
    ],
    medications: [
      { name: "Sodium Bicarbonate", dose: "1-2 mEq/kg IV", route: "Intravenous", purpose: "Buffer for severe metabolic acidosis; blood gas monitoring guides dosing" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "automated-hematology-analyzers-mlt": {
    title: "Automated Hematology Analyzers",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Clotted specimens producing falsely decreased platelet counts and altered cell indices",
      "Cold agglutinins causing RBC clumping with falsely elevated MCV and decreased RBC count",
      "Lipemia interfering with hemoglobin measurement producing falsely elevated values",
    ],
    diagnostics: [
      "Impedance (Coulter) principle measuring cell size and count as cells pass through an aperture",
      "Optical scatter analysis using laser light to differentiate WBC subtypes by size and granularity",
      "Fluorescent flow cytometry for reticulocyte counting, nucleated RBC detection, and immature granulocytes",
    ],
    management: [
      "Review instrument flags and reflex to manual differential when flagged for abnormal cell populations",
      "Warm specimens with cold agglutinins to 37°C and rerun within 5 minutes for accurate results",
      "Perform manual platelet estimate (per 100x field × 20,000) when platelet clumps are flagged",
    ],
    nursingActions: [
      "Collect CBC specimens in EDTA tubes; mix thoroughly by gentle inversion 8-10 times",
      "Process within 4 hours for optimal cell morphology; refrigerate if delayed",
      "Alert laboratory to relevant clinical information: chemotherapy, suspected leukemia, known cold agglutinins",
    ],
    assessmentFindings: [
      "Instrument flags for blasts, immature granulocytes, or nucleated RBCs requiring slide review",
      "Platelet clumping artifact: pseudo-thrombocytopenia with citrate recheck recommended",
      "Spurious results requiring investigation: MCV > 130 fL, WBC > 100K, or MCHC > 37 g/dL",
    ],
    medications: [
      { name: "Filgrastim (G-CSF)", dose: "5-10 mcg/kg/day SC", route: "Subcutaneous", purpose: "Granulocyte colony-stimulating factor; CBC monitors neutrophil recovery" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "mycology-laboratory-testing-mlt": {
    title: "Mycology and Fungal Identification",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Immunocompromised patients (HIV, transplant, chemotherapy) at highest risk for invasive fungal infections",
      "Prolonged antibiotic therapy promoting fungal overgrowth particularly Candida species",
      "Environmental exposure to endemic mycoses: Histoplasma (Ohio/Mississippi valleys), Coccidioides (Southwest US)",
    ],
    diagnostics: [
      "KOH wet mount with calcofluor white fluorescent stain for direct microscopic fungal element detection",
      "Fungal culture on Sabouraud dextrose agar at 25-30°C with prolonged incubation up to 4-6 weeks",
      "Serum beta-D-glucan and galactomannan antigen assays for invasive fungal infection screening",
    ],
    management: [
      "Identify dimorphic fungi using thermal dimorphism: mold at 25°C converting to yeast at 37°C",
      "Perform antifungal susceptibility testing for clinically significant isolates per CLSI guidelines",
      "Report preliminary findings for dimorphic fungi to provider immediately due to biosafety implications",
    ],
    nursingActions: [
      "Collect adequate tissue or fluid specimens using sterile technique; avoid contamination with normal flora",
      "Handle suspected dimorphic fungal cultures in BSL-3 conditions to prevent laboratory-acquired infection",
      "Communicate prolonged culture incubation times to clinical team managing empiric antifungal therapy",
    ],
    assessmentFindings: [
      "Yeast forms: budding cells, pseudohyphae (Candida), encapsulated yeast (Cryptococcus with India ink)",
      "Mold colony morphology, growth rate, and microscopic conidial structures for species identification",
      "Positive galactomannan or beta-D-glucan suggesting invasive Aspergillus or systemic fungal infection",
    ],
    medications: [
      { name: "Fluconazole", dose: "400 mg IV/PO daily", route: "IV or Oral", purpose: "Azole antifungal; culture and susceptibility guide appropriate agent selection" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "blood-component-preparation-mlt": {
    title: "Blood Component Preparation and Storage",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Bacterial contamination of platelet concentrates stored at room temperature (20-24°C)",
      "Hemolytic transfusion reactions from ABO-incompatible component administration",
      "Transfusion-related acute lung injury (TRALI) from donor antibodies against recipient HLA antigens",
    ],
    diagnostics: [
      "ABO/Rh typing and antibody screen on all blood components before release",
      "Crossmatch testing: immediate spin, antiglobulin phase, or electronic crossmatch per protocol",
      "Bacterial detection testing for platelet components using culture or rapid testing methods",
    ],
    management: [
      "Store PRBCs at 1-6°C for up to 42 days; platelets at 20-24°C with agitation for 5 days",
      "Thaw FFP at 30-37°C; use within 24 hours of thawing or refreeze as cryoprecipitate-reduced plasma",
      "Irradiate cellular components for immunocompromised patients to prevent TA-GVHD",
    ],
    nursingActions: [
      "Verify two-patient-identifier match at bedside before initiating any blood component transfusion",
      "Complete transfusion of each RBC unit within 4 hours of removal from controlled storage",
      "Monitor vital signs at baseline, 15 minutes, hourly during transfusion, and post-completion",
    ],
    assessmentFindings: [
      "Hemolytic reaction signs: fever, chills, flank pain, hemoglobinuria, hypotension within minutes",
      "Visual inspection of component for abnormal color, clots, or turbidity before release",
      "Temperature excursion exceeding 10°C threshold for RBCs requiring component discard",
    ],
    medications: [
      { name: "Diphenhydramine", dose: "25-50 mg IV/PO", route: "IV or Oral", purpose: "Premedication for patients with history of allergic transfusion reactions" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "tumor-marker-interpretation-mlt": {
    title: "Tumor Marker Testing and Interpretation",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "False-positive tumor marker elevations from benign conditions: PSA elevation with BPH/prostatitis",
      "Hook effect in immunoassays causing falsely low results with extremely high analyte concentrations",
      "Heterophilic antibody interference producing erroneous tumor marker results",
    ],
    diagnostics: [
      "PSA (prostate-specific antigen): total and free PSA ratio for prostate cancer risk stratification",
      "CA-125 for ovarian cancer monitoring; AFP for hepatocellular carcinoma and testicular tumors",
      "CEA for colorectal cancer recurrence monitoring; CA 19-9 for pancreatic cancer",
    ],
    management: [
      "Use tumor markers for monitoring treatment response and recurrence, not as standalone diagnostic tests",
      "Maintain same assay platform for serial monitoring due to inter-assay variability",
      "Investigate unexpected results with specimen dilution to rule out hook effect",
    ],
    nursingActions: [
      "Collect specimens before procedures (biopsy, DRE for PSA) that may cause transient elevations",
      "Document relevant clinical information: diagnosis, treatment status, last chemotherapy date",
      "Communicate critical tumor marker results promptly to ordering provider",
    ],
    assessmentFindings: [
      "Rising CEA trend post-surgery suggesting colorectal cancer recurrence before clinical symptoms",
      "PSA > 4.0 ng/mL requiring clinical correlation; free PSA < 25% increasing malignancy probability",
      "AFP > 400 ng/mL in cirrhotic patient highly suggestive of hepatocellular carcinoma",
    ],
    medications: [
      { name: "Cisplatin", dose: "20 mg/m² IV", route: "Intravenous", purpose: "Chemotherapy monitored by tumor marker response (AFP, beta-hCG for germ cell tumors)" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "antibiotic-resistance-mechanisms-mlt": {
    title: "Antibiotic Resistance Mechanisms and Detection",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Empiric broad-spectrum antibiotic use selecting for resistant organisms",
      "Healthcare-associated infections with higher prevalence of multidrug-resistant organisms",
      "International travel to endemic areas for ESBL-producing and carbapenem-resistant organisms",
    ],
    diagnostics: [
      "Kirby-Bauer disk diffusion measuring zone of inhibition for susceptibility categorization",
      "Minimum inhibitory concentration (MIC) by broth microdilution or gradient diffusion (Etest)",
      "Molecular detection: PCR for mecA (MRSA), vanA/vanB (VRE), KPC/NDM (carbapenemase genes)",
    ],
    management: [
      "Report suspected MDRO isolates promptly for infection control notification and patient isolation",
      "Perform D-test for inducible clindamycin resistance in erythromycin-resistant staphylococci",
      "Verify ESBL production with confirmatory testing: clavulanate synergy with ceftazidime/cefotaxime",
    ],
    nursingActions: [
      "Collect cultures before initiating antibiotic therapy to ensure accurate susceptibility results",
      "Report preliminary culture results (Gram stain) to clinical team for empiric therapy guidance",
      "Communicate unusual resistance patterns or MDRO identification to infection prevention team",
    ],
    assessmentFindings: [
      "MRSA identified by oxacillin resistance or mecA gene detection requiring vancomycin therapy",
      "ESBL-producing Enterobacterales: resistant to 3rd-gen cephalosporins, susceptible to carbapenems",
      "Carbapenem-resistant organisms (CRE): resistance to all beta-lactams requiring last-resort agents",
    ],
    medications: [
      { name: "Vancomycin", dose: "15-20 mg/kg IV q8-12h", route: "Intravenous", purpose: "Treatment for MRSA infections; trough monitoring guides dosing" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "hemolytic-disease-newborn-mlt": {
    title: "Hemolytic Disease of the Fetus and Newborn",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Rh-negative mother with Rh-positive fetus and prior sensitization from previous pregnancy or transfusion",
      "ABO incompatibility (most commonly Type O mother with Type A or B infant) causing mild hemolysis",
      "Maternal alloantibodies to Kell, Duffy, or Kidd antigens causing severe fetal anemia",
    ],
    diagnostics: [
      "Maternal antibody screen and titer monitoring throughout pregnancy for alloimmunized mothers",
      "Direct antiglobulin test (DAT/Coombs) on cord blood detecting IgG-coated fetal red blood cells",
      "Middle cerebral artery (MCA) Doppler peak systolic velocity for non-invasive fetal anemia assessment",
    ],
    management: [
      "RhIg (RhoGAM) 300 mcg IM at 28 weeks and within 72 hours postpartum for Rh-negative mothers",
      "Intrauterine transfusion for severe fetal anemia detected by elevated MCA-PSV",
      "Phototherapy and exchange transfusion for neonatal hyperbilirubinemia from hemolytic disease",
    ],
    nursingActions: [
      "Collect cord blood specimens for ABO/Rh, DAT, and bilirubin immediately after delivery",
      "Monitor neonatal bilirubin levels serially using transcutaneous or serum measurement",
      "Administer RhIg within 72-hour window; perform Kleihauer-Betke to quantify fetomaternal hemorrhage",
    ],
    assessmentFindings: [
      "Positive DAT on cord blood with elevated indirect bilirubin in first 24 hours of life",
      "Neonatal jaundice progressing rapidly: rising bilirubin > 5 mg/dL per day suggesting hemolysis",
      "Severe cases: hydrops fetalis with ascites, pleural effusion, and generalized edema",
    ],
    medications: [
      { name: "RhIg (RhoGAM)", dose: "300 mcg IM", route: "Intramuscular", purpose: "Prevents Rh sensitization by neutralizing fetal Rh-positive cells in maternal circulation" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "molecular-techniques-fundamentals-mlt": {
    title: "Molecular Techniques: PCR, Sequencing, and Beyond",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "PCR contamination from amplicon carryover producing false-positive results",
      "Specimen degradation from improper collection or storage compromising nucleic acid integrity",
      "Inhibitors in clinical specimens (heme, mucus) causing false-negative PCR results",
    ],
    diagnostics: [
      "Real-time PCR (qPCR) for quantitative viral load monitoring: HIV, HCV, HBV, CMV",
      "Next-generation sequencing (NGS) for comprehensive genomic profiling and variant detection",
      "Fluorescence in situ hybridization (FISH) for chromosomal translocation detection in hematologic malignancies",
    ],
    management: [
      "Maintain unidirectional workflow: pre-amplification → amplification → post-amplification to prevent contamination",
      "Include positive, negative, and no-template controls in every PCR run for quality assurance",
      "Validate new molecular assays per CLSI MM17 guidelines before clinical implementation",
    ],
    nursingActions: [
      "Collect specimens in appropriate molecular-grade containers and transport per assay requirements",
      "Ensure proper specimen labeling and chain of custody for forensic and infectious disease testing",
      "Communicate molecular test turnaround times to clinical team for patient management planning",
    ],
    assessmentFindings: [
      "HIV viral load below limit of detection indicating successful antiretroviral therapy",
      "Positive BCR-ABL1 transcript by RT-PCR confirming Philadelphia chromosome in CML diagnosis",
      "BRCA1/2 pathogenic variant detection guiding cancer risk assessment and management decisions",
    ],
    medications: [
      { name: "Imatinib", dose: "400 mg PO daily", route: "Oral", purpose: "Tyrosine kinase inhibitor for CML; BCR-ABL1 molecular monitoring guides treatment response" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "westgard-rules-applied-mlt": {
    title: "Westgard Rules and Quality Control Application",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Reagent deterioration from improper storage conditions causing systematic analytical bias",
      "Calibration drift over time producing trending QC results approaching control limits",
      "Operator-dependent preanalytical variables introducing random error into testing processes",
    ],
    diagnostics: [
      "Levey-Jennings charts plotting QC values against mean and standard deviation limits over time",
      "Westgard rules: 1-2s warning, 1-3s rejection, 2-2s systematic error, R-4s random error, 4-1s and 10x trend rules",
      "Six Sigma quality metrics: sigma value = (allowable total error - bias) / CV to assess process capability",
    ],
    management: [
      "Reject patient results and troubleshoot when 1-3s, 2-2s, R-4s, 4-1s, or 10x rules are violated",
      "Investigate systematic errors (shift/trend) by checking calibration, reagent lots, and temperature",
      "Investigate random errors by checking pipetting, sample integrity, and environmental conditions",
    ],
    nursingActions: [
      "Run quality control materials at beginning of each shift and after calibration or reagent lot changes",
      "Document all QC results, out-of-control events, corrective actions, and resolution in QC logs",
      "Notify supervisor and withhold patient results when QC violations are detected until resolved",
    ],
    assessmentFindings: [
      "1-2s warning: QC between 2-3 SD from mean; inspect for systematic error trends before reporting",
      "2-2s violation: two consecutive QC points exceeding 2 SD in same direction indicating systematic shift",
      "R-4s violation: range between two QC levels exceeding 4 SD indicating random error in the run",
    ],
    medications: [
      { name: "Therapeutic Drug Monitoring Analytes", dose: "Varies by drug", route: "Serum collection", purpose: "QC processes ensure accurate drug level reporting for dosing decisions (digoxin, vancomycin, lithium)" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "transfusion-medicine-compatibility-mlt": {
    title: "Transfusion Medicine and Compatibility Testing",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Clerical errors in patient identification causing ABO-incompatible transfusions (most preventable cause of fatal reactions)",
      "Warm autoantibodies masking clinically significant alloantibodies during antibody identification",
      "Previous transfusion within 3 months creating anamnestic antibody response not detected by current screen",
    ],
    diagnostics: [
      "ABO/Rh typing: forward (patient RBCs + antisera) and reverse (patient serum + reagent cells) grouping",
      "Antibody screen using 2-3 cell panel with indirect antiglobulin test (IAT) for IgG detection",
      "Antibody identification using 10-16 cell panel with rule-out methodology for specific alloantibody identification",
    ],
    management: [
      "Resolve ABO discrepancies before issuing any blood products; investigate forward/reverse typing conflicts",
      "Provide antigen-negative crossmatch-compatible units for patients with clinically significant alloantibodies",
      "Maintain antibody history permanently; transfuse antigen-negative units even if current screen is negative",
    ],
    nursingActions: [
      "Collect type and screen specimens with two-patient-identifier verification at the bedside",
      "Complete crossmatch testing within the specimen validity period (typically 72 hours if recently transfused)",
      "Investigate and report all suspected transfusion reactions with post-transfusion specimen collection",
    ],
    assessmentFindings: [
      "ABO discrepancy: forward and reverse grouping results do not match requiring investigation",
      "Positive antibody screen requiring identification panel to determine alloantibody specificity",
      "Positive direct antiglobulin test (DAT) indicating in-vivo antibody or complement coating of patient RBCs",
    ],
    medications: [
      { name: "RhIg (RhoGAM)", dose: "300 mcg IM", route: "Intramuscular", purpose: "Prevents Rh alloimmunization after Rh-positive RBC exposure in Rh-negative patients" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "clinical-enzymology-mlt": {
    title: "Clinical Enzymology and Organ-Specific Markers",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Hemolysis releasing intracellular enzymes (AST, LDH, potassium) causing falsely elevated results",
      "Macro-enzyme complexes (macro-CK, macro-amylase) causing unexplained persistent elevations",
      "Delayed specimen separation allowing continued enzyme release from blood cells",
    ],
    diagnostics: [
      "Hepatic panel: AST, ALT, ALP, GGT, bilirubin for liver injury pattern recognition (hepatocellular vs cholestatic)",
      "Cardiac biomarkers: troponin I/T (most specific), CK-MB, BNP/NT-proBNP for ACS and heart failure",
      "Pancreatic enzymes: lipase (more specific than amylase) for acute pancreatitis diagnosis",
    ],
    management: [
      "Correlate enzyme elevations with clinical presentation and trending pattern for diagnostic accuracy",
      "Use isoenzyme analysis (CK-MB index, LDH isoenzymes) when tissue source of elevation is unclear",
      "Report critical enzyme values per laboratory critical value notification policy",
    ],
    nursingActions: [
      "Separate serum from cells within 30-60 minutes to prevent in-vitro enzyme release",
      "Draw serial troponin levels at presentation, 3 hours, and 6 hours for acute MI rule-out protocols",
      "Document timing of specimen collection relative to symptom onset for proper clinical interpretation",
    ],
    assessmentFindings: [
      "AST:ALT ratio > 2:1 suggesting alcoholic liver disease; ALT predominant in viral hepatitis",
      "Troponin elevation above 99th percentile with rise/fall pattern confirming acute myocardial injury",
      "Markedly elevated CK (> 5x normal) with myoglobinuria indicating rhabdomyolysis risk",
    ],
    medications: [
      { name: "Atorvastatin", dose: "10-80 mg PO daily", route: "Oral", purpose: "Statin therapy; monitor hepatic enzymes and CK for hepatotoxicity and myopathy" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "parasitology-clinical-mlt": {
    title: "Clinical Parasitology and Identification",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "International travel to endemic tropical regions with exposure to contaminated water and food",
      "Immunocompromised status increasing susceptibility to opportunistic parasites (Cryptosporidium, Strongyloides)",
      "Inadequate specimen collection (single sample) missing intermittent parasite shedding patterns",
    ],
    diagnostics: [
      "Ova and parasite (O&P) examination: direct wet mount, concentration (formalin-ethyl acetate), permanent stain",
      "Trichrome or iron hematoxylin permanent stain for protozoan trophozoite and cyst identification",
      "Modified acid-fast stain for Cryptosporidium, Cyclospora, and Isospora oocyst detection",
    ],
    management: [
      "Collect three specimens on alternate days to increase detection sensitivity for intermittent shedders",
      "Use appropriate fixatives: formalin for concentration, PVA or SAF for permanent stains",
      "Correlate microscopic findings with patient travel history, symptoms, and eosinophil count",
    ],
    nursingActions: [
      "Collect stool specimens before barium studies or antiparasitic therapy for optimal detection",
      "Transport fresh specimens within 30 minutes for trophozoite detection or place in fixative immediately",
      "Report clinically significant parasites promptly: Plasmodium species, Entamoeba histolytica, Strongyloides",
    ],
    assessmentFindings: [
      "Plasmodium species ring forms and gametocytes on thick/thin blood smears with species differentiation",
      "Giardia lamblia trophozoites (pear-shaped, falling leaf motility) or cysts in duodenal aspirate/stool",
      "Peripheral eosinophilia > 500/µL suggesting tissue-invasive helminth infection",
    ],
    medications: [
      { name: "Metronidazole", dose: "500-750 mg PO TID × 7-10 days", route: "Oral", purpose: "First-line for Giardia and amebic infections; followed by paromomycin for cyst eradication" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "point-of-care-testing-management-mlt": {
    title: "Point-of-Care Testing Program Management",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Operator errors from inadequately trained non-laboratory personnel performing POCT",
      "Environmental factors (temperature, humidity) affecting reagent stability and test accuracy",
      "Failure to perform quality control compromising result reliability and patient safety",
    ],
    diagnostics: [
      "Common POCT analytes: glucose, blood gases, INR, cardiac markers, urine dipstick, rapid strep/flu",
      "Connectivity systems transmitting POCT results to LIS/EHR for documentation and trending",
      "Proficiency testing comparing POCT results with reference laboratory methods for accuracy verification",
    ],
    management: [
      "Establish POCT committee with medical director oversight for device selection and policy development",
      "Implement competency assessment program for all POCT operators with annual recertification",
      "Perform correlation studies between POCT devices and central laboratory methods per CLIA requirements",
    ],
    nursingActions: [
      "Perform QC on POCT devices per manufacturer specifications and document results before patient testing",
      "Follow specimen collection requirements specific to each POCT device (capillary vs venous, anticoagulant)",
      "Report and document all POCT results in the patient's electronic health record promptly",
    ],
    assessmentFindings: [
      "QC failure on POCT device requiring troubleshooting before patient results can be reported",
      "Discordant POCT and laboratory results requiring investigation and clinical correlation",
      "Operator competency assessment failures indicating need for retraining before independent testing",
    ],
    medications: [
      { name: "Insulin (Regular)", dose: "Per sliding scale", route: "Subcutaneous", purpose: "Dosed based on POCT glucose results; accuracy of glucose meter directly impacts dosing safety" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "special-staining-techniques-mlt": {
    title: "Special Staining Techniques in Hematology",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Faded or improperly stored reagents producing weak or false-negative staining results",
      "Thick or poorly prepared smears preventing adequate stain penetration and cell visualization",
      "Misinterpretation of staining patterns without adequate clinical and morphological correlation",
    ],
    diagnostics: [
      "Myeloperoxidase (MPO) stain differentiating AML (positive) from ALL (negative)",
      "Periodic acid-Schiff (PAS) stain: block positivity in ALL-L1/L2; diffuse in erythroleukemia",
      "Iron stain (Prussian blue) identifying ringed sideroblasts in myelodysplastic syndromes",
    ],
    management: [
      "Use fresh reagents and control slides with each staining run to ensure consistent quality",
      "Correlate cytochemical staining results with flow cytometry immunophenotyping for accurate classification",
      "Archive stained slides per CAP guidelines for future reference and quality review",
    ],
    nursingActions: [
      "Prepare thin, well-spread peripheral blood and bone marrow smears for optimal staining",
      "Label all slides with patient identifiers and date; maintain chain of custody for diagnostic specimens",
      "Coordinate bone marrow specimen allocation: morphology, flow cytometry, cytogenetics, molecular",
    ],
    assessmentFindings: [
      "Strong MPO positivity in blasts confirming myeloid lineage for AML classification",
      "Iron stain showing > 15% ringed sideroblasts meeting criteria for MDS with ring sideroblasts",
      "Sudan Black B positive and nonspecific esterase negative distinguishing granulocytic from monocytic lineage",
    ],
    medications: [
      { name: "All-trans Retinoic Acid (ATRA)", dose: "45 mg/m²/day PO", route: "Oral", purpose: "APL treatment; MPO-positive blasts with t(15;17) guide diagnosis and ATRA initiation" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "serology-methodology-mlt": {
    title: "Serological Testing Methodologies",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Prozone effect causing false-negative results in undiluted specimens with very high antibody concentrations",
      "Cross-reactivity between related organisms producing false-positive serological results",
      "Window period: recent infection with IgM not yet detectable causing false-negative antibody results",
    ],
    diagnostics: [
      "ELISA (enzyme-linked immunosorbent assay) for quantitative antibody detection and screening",
      "Western blot/immunoblot for confirmatory testing with individual antigen band identification",
      "Rapid diagnostic tests (lateral flow immunoassay) for point-of-care infectious disease screening",
    ],
    management: [
      "Confirm positive screening results with more specific confirmatory methods per diagnostic algorithms",
      "Interpret results in context of clinical history, vaccination status, and specimen timing relative to exposure",
      "Serial testing for seroconversion: compare acute and convalescent specimens collected 2-4 weeks apart",
    ],
    nursingActions: [
      "Collect serum specimens for serological testing; avoid hemolyzed or lipemic specimens",
      "Document vaccination history and date of symptom onset for accurate result interpretation",
      "Communicate preliminary positive results for reportable infectious diseases per public health requirements",
    ],
    assessmentFindings: [
      "IgM positive with IgG negative indicating acute or recent infection within the serological window",
      "Four-fold rise in IgG titer between acute and convalescent specimens confirming recent infection",
      "Reactive screening test requiring reflexive confirmatory testing per diagnostic algorithm",
    ],
    medications: [
      { name: "Hepatitis B Immune Globulin (HBIG)", dose: "0.06 mL/kg IM", route: "Intramuscular", purpose: "Post-exposure prophylaxis; serological testing determines HBsAg/anti-HBs status and HBIG need" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "laboratory-math-calculations-mlt": {
    title: "Laboratory Mathematics and Calculations",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Dilution errors leading to inaccurate reported results and potential patient harm",
      "Unit conversion mistakes between conventional and SI units causing misinterpretation",
      "Incorrect QC calculations affecting the ability to detect analytical errors",
    ],
    diagnostics: [
      "Serial dilution calculations: C1V1 = C2V2 for preparing standards and diluting patient specimens",
      "Manual cell count using hemocytometer: cells/µL = (cells counted × dilution factor) / (squares × depth × area)",
      "Creatinine clearance calculation: CrCl = (Urine Cr × Urine volume) / (Serum Cr × time)",
    ],
    management: [
      "Verify all calculations independently before reporting results from manual or diluted specimens",
      "Use appropriate significant figures based on method precision and clinical relevance",
      "Maintain calculation worksheets as part of permanent laboratory documentation for audit trail",
    ],
    nursingActions: [
      "Ensure proper 24-hour urine collection with accurate volume measurement and timing",
      "Verify patient height, weight, and age for calculated estimates (eGFR, BSA, IBW)",
      "Double-check drug dosing calculations when based on laboratory-reported values",
    ],
    assessmentFindings: [
      "eGFR < 60 mL/min/1.73m² calculated from serum creatinine indicating chronic kidney disease",
      "Anion gap calculation (Na - Cl - HCO3) > 12 mEq/L indicating anion gap metabolic acidosis",
      "Corrected calcium calculation in hypoalbuminemia: add 0.8 mg/dL per 1 g/dL albumin below 4.0",
    ],
    medications: [
      { name: "Gentamicin", dose: "5-7 mg/kg IV", route: "Intravenous", purpose: "Aminoglycoside requiring peak/trough calculations and dosing adjustments based on renal function" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "specimen-integrity-preanalytical-mlt": {
    title: "Specimen Integrity and Pre-Analytical Variables",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Hemolysis affecting potassium, LDH, AST, bilirubin, and magnesium measurements",
      "Lipemia interfering with spectrophotometric assays producing turbidity artifacts",
      "Improper specimen transport conditions degrading labile analytes (ammonia, lactic acid, blood gases)",
    ],
    diagnostics: [
      "Serum indices (H, I, L) quantifying hemolysis, icterus, and lipemia interference levels",
      "Specimen acceptability criteria per CLSI H18-A4 guidelines for preanalytical quality",
      "Delta check comparison with previous patient results detecting specimen identification errors",
    ],
    management: [
      "Reject specimens exceeding interference thresholds and request recollection with proper technique",
      "Ultracentrifuge lipemic specimens or use lipid-clearing agents when recollection is not feasible",
      "Implement pneumatic tube system validation ensuring specimen integrity during transport",
    ],
    nursingActions: [
      "Avoid drawing blood from IV-infusing arms or above IV sites to prevent dilution artifacts",
      "Use proper specimen handling: gentle mixing, appropriate temperatures, timely centrifugation",
      "Transport specimens per analyte-specific requirements: ice for ammonia/blood gas, room temp for coagulation",
    ],
    assessmentFindings: [
      "Hemolysis index triggering automatic flagging and potential result suppression on chemistry analyzers",
      "Specimen identification discrepancy detected by delta check requiring investigation before reporting",
      "Clotted EDTA specimen requiring recollection for accurate CBC results",
    ],
    medications: [
      { name: "Heparin", dose: "Per weight-based protocol", route: "IV infusion", purpose: "Heparin-contaminated specimens cause prolonged PT/aPTT; identify line contamination artifacts" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "body-fluid-cell-counts-mlt": {
    title: "Body Fluid Analysis: Cell Counts and Differentials",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Delayed processing causing cell lysis in hypotonic fluids reducing accurate cell counts",
      "Inadequate specimen mixing producing unrepresentative cell distribution for counting",
      "Clotted specimens from synovial or body fluid samples preventing accurate cell enumeration",
    ],
    diagnostics: [
      "Manual hemocytometer cell count for CSF, synovial fluid, and serous body fluids",
      "Cytocentrifuge preparation (cytospin) with Wright stain for differential cell morphology",
      "Crystal analysis under polarized microscopy: monosodium urate (gout) vs calcium pyrophosphate (pseudogout)",
    ],
    management: [
      "Process CSF and body fluid specimens STAT due to rapid cell lysis in low-protein fluids",
      "Use EDTA anticoagulant tubes for cell counts; plain tubes for chemistry and microbiology",
      "Report cell counts with differential and note any abnormal cells requiring pathologist review",
    ],
    nursingActions: [
      "Deliver CSF specimens to the laboratory immediately; do not refrigerate CSF for cell counts",
      "Ensure proper specimen allocation: tube 1 chemistry, tube 2 microbiology, tube 3 cell count/differential",
      "Communicate specimen source and clinical indication to laboratory for appropriate testing protocols",
    ],
    assessmentFindings: [
      "CSF WBC > 5/µL with neutrophil predominance suggesting bacterial meningitis",
      "Synovial fluid WBC > 50,000/µL with positive crystals differentiating septic arthritis from crystal arthropathy",
      "Pleural fluid protein ratio > 0.5 and LDH ratio > 0.6 (Light's criteria) indicating exudative effusion",
    ],
    medications: [
      { name: "Ceftriaxone", dose: "2g IV q12h", route: "Intravenous", purpose: "Empiric bacterial meningitis treatment; CSF analysis guides antibiotic selection and duration" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "pharmacogenomics-clinical-mlt": {
    title: "Pharmacogenomics and Personalized Medicine",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Poor metabolizer phenotype causing drug accumulation and toxicity at standard doses",
      "Ultra-rapid metabolizer phenotype causing therapeutic failure from rapid drug clearance",
      "HLA-associated drug hypersensitivity reactions (HLA-B*5701 and abacavir, HLA-B*1502 and carbamazepine)",
    ],
    diagnostics: [
      "CYP2D6 genotyping: poor, intermediate, extensive, ultra-rapid metabolizer classification",
      "CYP2C19 genotyping affecting clopidogrel activation and proton pump inhibitor metabolism",
      "HLA typing for drug hypersensitivity risk assessment before initiating specific medications",
    ],
    management: [
      "Apply CPIC (Clinical Pharmacogenomics Implementation Consortium) guidelines for genotype-guided prescribing",
      "Adjust drug selection or dosing based on metabolizer phenotype per pharmacogenomic guidelines",
      "Screen for HLA-B*5701 before abacavir initiation; positive result contraindicates the drug",
    ],
    nursingActions: [
      "Collect buccal swab or blood specimen for pharmacogenomic testing per laboratory requirements",
      "Document pharmacogenomic results in the EHR for clinical decision support integration",
      "Educate patients on the purpose of pharmacogenomic testing and its impact on medication management",
    ],
    assessmentFindings: [
      "CYP2D6 poor metabolizer status affecting codeine (no analgesia), tamoxifen (reduced efficacy), and antidepressant dosing",
      "CYP2C19 poor metabolizer reducing clopidogrel activation; alternative antiplatelet therapy indicated",
      "TPMT deficiency requiring dose reduction of thiopurine drugs (azathioprine, mercaptopurine) to prevent myelosuppression",
    ],
    medications: [
      { name: "Clopidogrel", dose: "75 mg PO daily", route: "Oral", purpose: "Prodrug requiring CYP2C19 activation; poor metabolizers need alternative antiplatelet agents" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "infection-control-laboratory-mlt": {
    title: "Infection Control and Laboratory-Acquired Infections",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Aerosol generation during specimen processing (centrifugation, vortexing, culture manipulation)",
      "Sharps injuries from needles, broken glass, or contaminated instruments during specimen handling",
      "Biosafety level violations when handling high-risk organisms (Mycobacterium tuberculosis, Brucella, dimorphic fungi)",
    ],
    diagnostics: [
      "Biosafety risk assessment: classify organisms by BSL requirements (BSL-1 through BSL-4)",
      "Exposure incident evaluation: source testing, baseline serology, and post-exposure prophylaxis assessment",
      "Environmental monitoring: biological safety cabinet (BSC) certification and HEPA filter integrity testing",
    ],
    management: [
      "Follow Standard Precautions for all specimen handling; treat every specimen as potentially infectious",
      "Use BSC for all culture manipulations that may generate aerosols; never sniff culture plates",
      "Implement sharps injury prevention: safety-engineered devices, no recapping, immediate sharps disposal",
    ],
    nursingActions: [
      "Use appropriate PPE (gloves, lab coat, face protection) when processing specimens or handling cultures",
      "Decontaminate work surfaces with appropriate disinfectant before and after specimen processing",
      "Report all exposure incidents immediately for assessment and post-exposure prophylaxis initiation",
    ],
    assessmentFindings: [
      "Needle-stick injury requiring source patient testing and post-exposure prophylaxis evaluation",
      "Unexpected growth of BSL-3 organism (TB, Brucella) requiring transfer to appropriate containment",
      "BSC airflow verification failure requiring immediate cessation of aerosol-generating procedures",
    ],
    medications: [
      { name: "Tenofovir/Emtricitabine + Raltegravir", dose: "Per PEP protocol", route: "Oral", purpose: "HIV post-exposure prophylaxis after significant occupational blood/body fluid exposure" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "method-validation-verification-mlt": {
    title: "Method Validation and Verification",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Inadequate validation studies failing to detect systematic bias before patient testing implementation",
      "Matrix effects causing different performance characteristics between patient specimens and reference materials",
      "Insufficient sample size during validation producing unreliable precision and accuracy estimates",
    ],
    diagnostics: [
      "Precision studies: within-run (repeatability) and between-run (reproducibility) CV calculations",
      "Accuracy assessment: comparison with reference method, proficiency testing, or certified reference materials",
      "Analytical measurement range (AMR) verification using linearity panels across the reportable range",
    ],
    management: [
      "Follow CLSI EP15-A3 for method verification and EP05/EP09 for precision and accuracy evaluation",
      "Perform 40-specimen method comparison with Deming regression and Bland-Altman analysis",
      "Document validation results, acceptance criteria, and director approval before clinical implementation",
    ],
    nursingActions: [
      "Participate in method comparison specimen collection ensuring paired specimens are collected properly",
      "Communicate new test availability, reference ranges, and ordering changes to clinical staff",
      "Report any observed result discrepancies between old and new methods during transition periods",
    ],
    assessmentFindings: [
      "Precision CV exceeding manufacturer claims indicating unresolved analytical variability",
      "Method comparison showing proportional or constant bias requiring recalibration or alternative method",
      "Reference range verification confirming appropriateness of manufacturer ranges for local patient population",
    ],
    medications: [
      { name: "Warfarin", dose: "Per INR target", route: "Oral", purpose: "INR monitoring requires validated PT/INR method; method changes affect dose management" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "hemoglobinopathy-testing-mlt": {
    title: "Hemoglobinopathy Screening and Diagnosis",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Sickle cell trait (HbAS) carriers at risk for complications under extreme hypoxic conditions",
      "Thalassemia minor (trait) frequently misdiagnosed as iron deficiency due to microcytic indices",
      "Newborn screening timing: HbF predominance may mask hemoglobin variants in premature infants",
    ],
    diagnostics: [
      "Hemoglobin electrophoresis (cellulose acetate at alkaline pH, citrate agar at acid pH) for Hb variant separation",
      "HPLC (high-performance liquid chromatography) for hemoglobin quantification and variant identification",
      "Hemoglobin solubility test (Sickledex): positive for HbS but does not distinguish trait from disease",
    ],
    management: [
      "Confirm abnormal newborn screening results with definitive hemoglobin analysis by 2-3 months of age",
      "Differentiate thalassemia trait from iron deficiency: elevated RBC count with low MCV, normal-elevated iron/ferritin, elevated HbA2",
      "Provide genetic counseling for carriers of hemoglobinopathies regarding reproductive risk",
    ],
    nursingActions: [
      "Collect EDTA specimen for hemoglobin electrophoresis; note any recent transfusions that may alter results",
      "Document patient ethnicity and family history as hemoglobinopathies have ethnic predilections",
      "Coordinate follow-up for abnormal newborn hemoglobin screening results with pediatric hematology",
    ],
    assessmentFindings: [
      "HbSS pattern: predominantly HbS with absent HbA confirming sickle cell disease",
      "HbA2 > 3.5% with microcytosis and adequate iron stores indicating beta-thalassemia trait",
      "Newborn screening FS pattern indicating sickle cell disease requiring confirmatory testing and penicillin prophylaxis",
    ],
    medications: [
      { name: "Hydroxyurea", dose: "15-35 mg/kg/day PO", route: "Oral", purpose: "Increases HbF production in sickle cell disease; CBC monitoring for myelosuppression" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "renal-function-assessment-mlt": {
    title: "Renal Function Assessment and Markers",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Muscle mass variations affecting serum creatinine: falsely low in elderly/cachectic, elevated in muscular individuals",
      "GFR-estimating equations inaccuracy in extremes of body size, pregnancy, and acute kidney injury",
      "Cystatin C interference from thyroid dysfunction, corticosteroid use, and inflammation",
    ],
    diagnostics: [
      "Serum creatinine with eGFR calculation using CKD-EPI equation for CKD staging",
      "Cystatin C as alternative GFR marker unaffected by muscle mass, age, and sex",
      "Urine albumin-to-creatinine ratio (UACR) for early diabetic nephropathy detection",
    ],
    management: [
      "Stage CKD using both eGFR and albuminuria categories per KDIGO classification (G1-G5, A1-A3)",
      "Adjust medication dosing for drugs with renal clearance based on eGFR calculations",
      "Monitor renal function serially in patients receiving nephrotoxic medications (aminoglycosides, NSAIDs, contrast)",
    ],
    nursingActions: [
      "Collect random spot urine for UACR; first morning void preferred for consistency",
      "Ensure 24-hour urine collections are complete with proper preservative and accurate volume measurement",
      "Correlate serum creatinine trends with urine output for early acute kidney injury detection",
    ],
    assessmentFindings: [
      "eGFR < 60 mL/min for > 3 months meeting criteria for chronic kidney disease diagnosis",
      "UACR > 30 mg/g indicating albuminuria; > 300 mg/g indicating macroalbuminuria in diabetic nephropathy",
      "BUN:creatinine ratio > 20:1 suggesting prerenal azotemia from dehydration or decreased renal perfusion",
    ],
    medications: [
      { name: "Lisinopril", dose: "5-40 mg PO daily", route: "Oral", purpose: "ACE inhibitor for renoprotection; monitor creatinine and potassium after initiation or dose change" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "regulatory-compliance-clia-mlt": {
    title: "Regulatory Compliance: CLIA and Accreditation",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Non-compliance with CLIA regulations resulting in laboratory sanctions, fines, or certificate revocation",
      "Failure to maintain proficiency testing performance: unsatisfactory scores on two consecutive events in same analyte",
      "Inadequate personnel qualifications or competency documentation violating regulatory requirements",
    ],
    diagnostics: [
      "CLIA test complexity classification: waived, moderate complexity, high complexity determining regulatory requirements",
      "Proficiency testing (PT) participation: successful scores on 80% of analytes per survey event",
      "Competency assessment: six elements including direct observation, test performance review, and problem-solving",
    ],
    management: [
      "Maintain current CLIA certificate and state licensure with appropriate test category coverage",
      "Enroll in CMS-approved proficiency testing programs for all regulated analytes",
      "Conduct annual competency assessment for all testing personnel using six required evaluation methods",
    ],
    nursingActions: [
      "Follow laboratory procedures manual for all testing activities and document deviations",
      "Participate in competency assessment activities including direct observation and blind specimen testing",
      "Report quality issues and non-conforming events through the laboratory quality management system",
    ],
    assessmentFindings: [
      "Proficiency testing failure requiring root cause analysis and corrective action before resuming patient testing",
      "Inspection deficiency citation requiring documented corrective action plan within specified timeframe",
      "Competency assessment identifying training gaps requiring remediation before independent testing",
    ],
    medications: [
      { name: "Controlled Substances (Schedule II-V)", dose: "Varies", route: "Varies", purpose: "Toxicology testing for controlled substances requires CLIA-regulated confirmatory methods (GC-MS, LC-MS/MS)" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "urinalysis-comprehensive-mlt": {
    title: "Comprehensive Urinalysis: Physical, Chemical, and Microscopic",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Delayed processing beyond 2 hours causing bacterial overgrowth, pH changes, and cast dissolution",
      "Contamination from improper clean-catch collection producing false-positive culture and microscopic results",
      "Interfering substances: ascorbic acid causing false-negative glucose and blood dipstick results",
    ],
    diagnostics: [
      "Physical examination: color, clarity, specific gravity (refractometer more accurate than dipstick)",
      "Chemical analysis: pH, protein, glucose, ketones, blood, bilirubin, urobilinogen, nitrite, leukocyte esterase",
      "Microscopic sediment examination: RBCs, WBCs, casts, crystals, bacteria, yeast, epithelial cells per HPF",
    ],
    management: [
      "Process urinalysis within 2 hours of collection or refrigerate to preserve formed elements",
      "Reflex to urine culture when nitrite and/or leukocyte esterase are positive per laboratory protocol",
      "Correlate microscopic findings with chemical results: confirm dipstick blood with microscopic RBC examination",
    ],
    nursingActions: [
      "Instruct patients on proper midstream clean-catch technique to minimize contamination",
      "Transport specimens to laboratory promptly; refrigerate if delay exceeds 2 hours",
      "Document collection method (clean-catch, catheterized, suprapubic) as it affects result interpretation",
    ],
    assessmentFindings: [
      "RBC casts in sediment pathognomonic for glomerulonephritis; WBC casts indicating pyelonephritis",
      "Triple phosphate and waxy casts indicating chronic renal disease with urinary stasis",
      "Positive nitrite with leukocyte esterase highly suggestive of bacterial urinary tract infection",
    ],
    medications: [
      { name: "Nitrofurantoin", dose: "100 mg PO BID × 5 days", route: "Oral", purpose: "UTI treatment; urinalysis and culture guide antibiotic selection and treatment duration" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "dna-rna-extraction-mlt": {
    title: "Nucleic Acid Extraction and Quality Assessment",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "RNase contamination degrading RNA specimens during extraction and storage",
      "Formalin-fixed paraffin-embedded (FFPE) specimens yielding fragmented and cross-linked nucleic acids",
      "Inadequate specimen volume or cellularity producing insufficient nucleic acid yield for downstream testing",
    ],
    diagnostics: [
      "Spectrophotometric analysis: A260/A280 ratio (1.8 for DNA, 2.0 for RNA purity assessment)",
      "Fluorometric quantification (Qubit) for more accurate double-stranded DNA concentration measurement",
      "Bioanalyzer/TapeStation for nucleic acid integrity assessment: RIN score for RNA quality (RIN > 7 preferred)",
    ],
    management: [
      "Select extraction method appropriate to specimen type: column-based, magnetic bead, or organic (phenol-chloroform)",
      "Use RNase-free reagents, certified tips, and dedicated workspace for RNA extraction",
      "Store extracted DNA at -20°C and RNA at -80°C with appropriate buffer to prevent degradation",
    ],
    nursingActions: [
      "Collect specimens in appropriate nucleic acid stabilization media per test requirements",
      "Ensure specimen is properly labeled and transported at correct temperature per molecular testing protocol",
      "Document specimen type, collection time, and fixation conditions affecting nucleic acid quality",
    ],
    assessmentFindings: [
      "A260/A280 < 1.6 indicating protein contamination requiring re-extraction or additional purification",
      "Low RNA integrity number (RIN < 5) indicating degradation that may produce unreliable downstream results",
      "Insufficient nucleic acid yield requiring additional specimen collection or alternative testing approach",
    ],
    medications: [
      { name: "Tamoxifen", dose: "20 mg PO daily", route: "Oral", purpose: "Targeted therapy requiring tumor DNA extraction for estrogen receptor and HER2 testing" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "clinical-immunology-autoantibodies-mlt": {
    title: "Clinical Immunology: Autoantibody Testing and Interpretation",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "False-positive ANA in healthy individuals (up to 15%) especially in elderly and women",
      "Medication-induced lupus producing positive anti-histone antibodies (hydralazine, procainamide, isoniazid)",
      "Specimen handling errors: complement activation in improperly handled samples affecting CH50 results",
    ],
    diagnostics: [
      "ANA by immunofluorescence: titer and pattern (homogeneous, speckled, nucleolar, centromere) for disease correlation",
      "Extractable nuclear antigen (ENA) panel: anti-dsDNA, anti-Smith, anti-RNP, anti-SSA/SSB, anti-Scl-70, anti-Jo-1",
      "ANCA testing: c-ANCA (anti-PR3) associated with GPA; p-ANCA (anti-MPO) with MPA/EGPA",
    ],
    management: [
      "Use ANA pattern and titer to guide reflex ENA testing rather than ordering full panels indiscriminately",
      "Interpret autoantibody results in clinical context; positive ANA alone does not diagnose SLE",
      "Serial anti-dsDNA titers correlate with lupus nephritis activity and guide treatment intensity",
    ],
    nursingActions: [
      "Collect serum specimens; separate and freeze aliquots for complement testing to prevent in-vitro activation",
      "Document current medications as many drugs can induce autoantibody production",
      "Communicate positive autoantibody results with clinical correlation guidance to ordering provider",
    ],
    assessmentFindings: [
      "Homogeneous ANA pattern with positive anti-dsDNA highly specific for systemic lupus erythematosus",
      "Anti-CCP antibodies with RF positive in rheumatoid arthritis; anti-CCP more specific than RF alone",
      "c-ANCA positive (anti-PR3) in granulomatosis with polyangiitis requiring urgent immunosuppression evaluation",
    ],
    medications: [
      { name: "Hydroxychloroquine", dose: "200-400 mg PO daily", route: "Oral", purpose: "SLE treatment; autoantibody monitoring (anti-dsDNA, complement) guides disease activity assessment" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "transfusion-reaction-workup-mlt": {
    title: "Transfusion Reaction Investigation and Management",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "ABO-incompatible transfusion from clerical errors (most common cause of fatal hemolytic reactions)",
      "Febrile non-hemolytic reactions from recipient antibodies against donor leukocyte antigens",
      "TRALI from donor anti-HLA or anti-neutrophil antibodies causing acute respiratory distress",
    ],
    diagnostics: [
      "Post-transfusion DAT comparing pre- and post-transfusion specimens for new antibody coating",
      "Visual inspection of post-transfusion plasma/serum for hemolysis (pink/red discoloration)",
      "Repeat ABO/Rh typing on post-transfusion specimen and donor segment to verify compatibility",
    ],
    management: [
      "Stop transfusion immediately and maintain IV access with normal saline upon reaction signs",
      "Perform transfusion reaction workup: clerical check, visual hemolysis check, DAT, repeat type and screen",
      "Send post-transfusion urine for hemoglobinuria assessment and blood for haptoglobin, LDH, bilirubin",
    ],
    nursingActions: [
      "Perform bedside verification of patient identity with blood product label before initiating transfusion",
      "Monitor vital signs at baseline, 15 minutes, and hourly; observe for fever, urticaria, dyspnea, flank pain",
      "Return remaining blood product and attached tubing to blood bank along with post-transfusion specimens",
    ],
    assessmentFindings: [
      "Acute hemolytic reaction: fever, chills, flank/back pain, hemoglobinuria, hypotension, DIC within minutes",
      "Allergic reaction: urticaria, pruritus, and potentially anaphylaxis with hypotension and bronchospasm",
      "TRALI: acute respiratory distress with bilateral pulmonary infiltrates within 6 hours of transfusion",
    ],
    medications: [
      { name: "Epinephrine", dose: "0.3-0.5 mg IM", route: "Intramuscular", purpose: "First-line for anaphylactic transfusion reactions with bronchospasm and/or hypotension" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "reference-range-statistics-mlt": {
    title: "Reference Ranges and Statistical Concepts",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Inappropriate reference population not matching patient demographics (age, sex, ethnicity) producing misleading comparisons",
      "Outlier values in reference population skewing mean and standard deviation calculations",
      "Analytical imprecision (high CV%) widening confidence intervals and reducing ability to detect true clinical changes",
    ],
    diagnostics: [
      "Reference range establishment: test 120+ healthy reference individuals per CLSI EP28 guidelines",
      "Non-parametric method: 2.5th to 97.5th percentile for non-Gaussian distributions",
      "Critical value determination based on clinical outcomes and patient safety thresholds",
    ],
    management: [
      "Verify manufacturer reference ranges are appropriate for local population before clinical use",
      "Apply age-, sex-, and gestational-age-specific reference ranges where clinically significant differences exist",
      "Calculate reference change value (RCV) to determine clinically significant changes between serial results",
    ],
    nursingActions: [
      "Use age- and sex-appropriate reference ranges when interpreting laboratory results",
      "Consider physiological variables (pregnancy, fasting state, circadian rhythm) affecting normal ranges",
      "Communicate results that fall outside critical value thresholds per laboratory notification policy",
    ],
    assessmentFindings: [
      "Result outside 2 SD reference range may be normal for 5% of healthy individuals (statistical outliers)",
      "Delta check flag: result change exceeding expected biological variation suggesting specimen error",
      "Critical value requiring immediate notification: K > 6.0, glucose < 40, troponin above AMI threshold",
    ],
    medications: [
      { name: "Lithium", dose: "300-1200 mg PO daily", route: "Oral", purpose: "Therapeutic drug monitoring with narrow therapeutic range (0.6-1.2 mEq/L); reference range critical for dosing" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
  "microbiology-susceptibility-reporting-mlt": {
    title: "Antimicrobial Susceptibility Testing and Selective Reporting",
    cellular: "placeholder-keep-existing",
    riskFactors: [
      "Inoculum density errors affecting MIC results: too heavy may show false resistance, too light false susceptibility",
      "Testing conditions (incubation time, atmosphere, temperature) deviating from CLSI standards producing invalid results",
      "Intrinsic resistance patterns not tested: Klebsiella intrinsically resistant to ampicillin, Enterococcus to cephalosporins",
    ],
    diagnostics: [
      "Broth microdilution as reference standard for MIC determination per CLSI M100 guidelines",
      "Automated susceptibility systems (Vitek 2, MicroScan, Phoenix) with expert system interpretation",
      "Disk diffusion (Kirby-Bauer) with zone diameter interpretation per CLSI breakpoint tables",
    ],
    management: [
      "Apply cascade/selective reporting: report narrow-spectrum agents first to promote antibiotic stewardship",
      "Suppress reporting of broader agents if narrower alternatives test susceptible",
      "Flag unusual resistance patterns for verification: MRSA susceptible to penicillin, VRE susceptible to vancomycin",
    ],
    nursingActions: [
      "Collect cultures before initiating empiric antibiotic therapy whenever clinically feasible",
      "Communicate preliminary results (Gram stain, preliminary identification) to clinical team promptly",
      "Alert infection preventionists to multidrug-resistant organism identification for isolation precautions",
    ],
    assessmentFindings: [
      "Susceptible (S), Intermediate (I), or Resistant (R) categories determining appropriate antibiotic therapy",
      "MIC at or near breakpoint requiring clinical judgment and potentially higher dosing regimens",
      "Pan-resistant organism identification requiring infectious disease consultation and combination therapy",
    ],
    medications: [
      { name: "Meropenem", dose: "1-2g IV q8h", route: "Intravenous", purpose: "Carbapenem for ESBL-producing organisms; susceptibility testing confirms appropriate coverage" },
    ],
    signs: { left: [], right: [] },
    pearls: [],
    quiz: [],
  },
};
