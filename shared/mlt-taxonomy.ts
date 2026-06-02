export const MLT_DISCIPLINES = [
  "Clinical Chemistry",
  "Hematology",
  "Hemostasis / Coagulation",
  "Immunohematology / Blood Banking",
  "Microbiology",
  "Urinalysis & Body Fluids",
  "Immunology / Serology",
  "Molecular Diagnostics",
  "Histotechnology",
  "Cytotechnology",
  "Mycology",
  "Parasitology",
  "Virology",
  "Phlebotomy & Specimen Collection",
  "Laboratory Operations & Quality Management",
  "Point-of-Care Testing",
] as const;

export type MltDiscipline = (typeof MLT_DISCIPLINES)[number];

export const MLT_SUBDISCIPLINES: Record<string, string[]> = {
  "Clinical Chemistry": [
    "Carbohydrates",
    "Lipids & Lipoproteins",
    "Proteins & Amino Acids",
    "Enzymes",
    "Electrolytes & Blood Gases",
    "Liver Function",
    "Renal Function",
    "Endocrine / Hormones",
    "Tumor Markers",
    "Therapeutic Drug Monitoring",
    "Toxicology",
    "Instrumentation (Spectrophotometry, ISE, HPLC)",
  ],
  "Hematology": [
    "Erythrocytes (RBC Morphology & Disorders)",
    "Leukocytes (WBC Morphology & Disorders)",
    "Platelets & Megakaryocytes",
    "Hemoglobin & Hemoglobinopathies",
    "Hematopoiesis",
    "Anemias (Iron-deficiency, Megaloblastic, Hemolytic)",
    "Leukemias & Lymphomas",
    "Automated Hematology Analyzers",
    "Manual Differential",
    "Peripheral Blood Smear Evaluation",
    "ESR & Reticulocyte Count",
  ],
  "Hemostasis / Coagulation": [
    "Coagulation Cascade (Intrinsic, Extrinsic, Common)",
    "PT / INR",
    "aPTT",
    "Fibrinolysis",
    "D-dimer & FDP",
    "Platelet Function Testing",
    "DIC",
    "Anticoagulant Therapy Monitoring",
    "Mixing Studies",
    "Thrombophilia Screening",
  ],
  "Immunohematology / Blood Banking": [
    "ABO & Rh Blood Group Systems",
    "Antibody Identification",
    "Crossmatch Procedures",
    "Direct & Indirect Antiglobulin Test (DAT/IAT)",
    "Transfusion Reactions",
    "Component Therapy",
    "Hemolytic Disease of the Fetus & Newborn (HDFN)",
    "Blood Donor Screening",
    "Irradiation & Leukoreduction",
    "Rare Blood Group Antigens",
  ],
  "Microbiology": [
    "Gram-Positive Cocci",
    "Gram-Negative Rods (Enterobacteriaceae)",
    "Gram-Negative Non-Fermenters",
    "Anaerobes",
    "Mycobacteria (AFB)",
    "Staining Techniques (Gram, AFB, India Ink)",
    "Culture & Sensitivity (C&S)",
    "Antimicrobial Susceptibility Testing (AST)",
    "Biochemical Identification",
    "Automated Microbiology Systems (MALDI-TOF)",
    "Infection Control & Surveillance",
  ],
  "Urinalysis & Body Fluids": [
    "Physical Examination of Urine",
    "Chemical Examination (Dipstick)",
    "Microscopic Sediment Analysis",
    "Cerebrospinal Fluid (CSF)",
    "Synovial Fluid",
    "Serous Fluids (Pleural, Peritoneal, Pericardial)",
    "Seminal Fluid Analysis",
    "Fecal Occult Blood & Fecal Analysis",
    "Amniotic Fluid",
  ],
  "Immunology / Serology": [
    "Antigen-Antibody Reactions",
    "ELISA & EIA",
    "Immunofluorescence (DFA/IFA)",
    "Western Blot",
    "Flow Cytometry",
    "Complement System",
    "Autoimmune Markers (ANA, RF, Anti-dsDNA)",
    "Hepatitis Serology (HBsAg, Anti-HBc, Anti-HCV)",
    "HIV Testing Algorithms",
    "Syphilis Testing (RPR, FTA-ABS)",
    "Transplant Immunology (HLA Typing)",
  ],
  "Molecular Diagnostics": [
    "PCR (Conventional, Real-Time, RT-PCR)",
    "Nucleic Acid Extraction",
    "Southern / Northern / Western Blots",
    "Sequencing (Sanger, NGS)",
    "FISH (Fluorescence In Situ Hybridization)",
    "Microarray Technology",
    "Molecular Infectious Disease Testing",
    "Pharmacogenomics",
    "Molecular Oncology Markers",
  ],
  "Histotechnology": [
    "Tissue Fixation & Processing",
    "Embedding & Microtomy",
    "H&E Staining",
    "Special Stains (PAS, Masson Trichrome, GMS)",
    "Immunohistochemistry (IHC)",
    "Frozen Sections",
    "Decalcification",
    "Quality Control in Histology",
  ],
  "Cytotechnology": [
    "Pap Smear Evaluation",
    "Fine Needle Aspiration (FNA)",
    "Liquid-Based Cytology",
    "Bethesda System Classification",
    "Non-Gynecological Cytology",
  ],
  "Mycology": [
    "Dermatophytes",
    "Yeasts (Candida, Cryptococcus)",
    "Dimorphic Fungi",
    "Mold Identification",
    "Antifungal Susceptibility",
    "KOH Preparation",
  ],
  "Parasitology": [
    "Intestinal Protozoa",
    "Blood & Tissue Protozoa (Malaria, Toxoplasma)",
    "Intestinal Helminths",
    "Tissue Helminths",
    "Ova & Parasite (O&P) Examination",
    "Concentration Techniques",
    "Arthropod Vectors",
  ],
  "Virology": [
    "Viral Culture & Identification",
    "Rapid Antigen Detection",
    "Molecular Viral Testing",
    "Serological Viral Markers",
    "Emerging Viral Pathogens",
  ],
  "Phlebotomy & Specimen Collection": [
    "Order of Draw",
    "Venipuncture Technique",
    "Capillary Collection",
    "Specimen Handling & Transport",
    "Patient Identification & Safety",
    "Special Collection Procedures (Blood Cultures, Glucose Tolerance)",
  ],
  "Laboratory Operations & Quality Management": [
    "Quality Control (Levey-Jennings, Westgard Rules)",
    "Quality Assurance Programs",
    "Proficiency Testing",
    "Laboratory Safety (Chemical, Biological, Radiation)",
    "CLIA / CAP / Accreditation Canada Standards",
    "Laboratory Information Systems (LIS)",
    "Lean & Six Sigma in the Lab",
    "Regulatory Compliance",
    "Specimen Rejection Criteria",
  ],
  "Point-of-Care Testing": [
    "Glucose Meters",
    "Blood Gas Analyzers",
    "Coagulation Point-of-Care (iSTAT)",
    "Rapid Strep / Flu / COVID Testing",
    "Urine Pregnancy Testing",
    "Quality Management for POCT",
  ],
};

export const MLT_CANADA_BLUEPRINT_CATEGORIES = [
  { name: "Hematology & Coagulation", weight: 25, disciplines: ["Hematology", "Hemostasis / Coagulation"] },
  { name: "Clinical Chemistry", weight: 20, disciplines: ["Clinical Chemistry"] },
  { name: "Microbiology", weight: 20, disciplines: ["Microbiology", "Mycology", "Parasitology", "Virology"] },
  { name: "Transfusion Science", weight: 15, disciplines: ["Immunohematology / Blood Banking"] },
  { name: "Histotechnology", weight: 10, disciplines: ["Histotechnology", "Cytotechnology"] },
  { name: "Quality Management", weight: 10, disciplines: ["Laboratory Operations & Quality Management", "Point-of-Care Testing"] },
] as const;

export const MLT_USA_CONTENT_AREAS = [
  { name: "Hematology", weight: 25, disciplines: ["Hematology", "Hemostasis / Coagulation"] },
  { name: "Clinical Chemistry", weight: 25, disciplines: ["Clinical Chemistry"] },
  { name: "Microbiology", weight: 20, disciplines: ["Microbiology", "Mycology", "Parasitology", "Virology"] },
  { name: "Immunohematology / Blood Banking", weight: 15, disciplines: ["Immunohematology / Blood Banking"] },
  { name: "Urinalysis & Body Fluids", weight: 10, disciplines: ["Urinalysis & Body Fluids"] },
  { name: "Laboratory Operations", weight: 5, disciplines: ["Laboratory Operations & Quality Management", "Point-of-Care Testing"] },
] as const;

export const MLT_DIFFICULTY_LEVELS = [
  { id: "foundational", label: "Foundational", description: "Recall-level knowledge of facts, terminology, and procedures" },
  { id: "intermediate", label: "Intermediate", description: "Application of knowledge to routine laboratory scenarios" },
  { id: "advanced", label: "Advanced", description: "Analysis, evaluation, and troubleshooting of complex cases" },
  { id: "expert", label: "Expert", description: "Synthesis across disciplines, rare findings, and critical decision-making" },
] as const;

export type MltDifficultyLevel = (typeof MLT_DIFFICULTY_LEVELS)[number]["id"];

export const MLT_COGNITIVE_LEVELS = [
  { id: "recall", label: "Recall", bloom: "Remember", description: "Retrieve factual knowledge" },
  { id: "application", label: "Application", bloom: "Apply", description: "Use knowledge in routine situations" },
  { id: "analysis", label: "Analysis", bloom: "Analyze", description: "Break down information and identify patterns" },
  { id: "evaluation", label: "Evaluation", bloom: "Evaluate", description: "Make judgments based on criteria and evidence" },
  { id: "synthesis", label: "Synthesis", bloom: "Create", description: "Combine information to form new conclusions" },
] as const;

export type MltCognitiveLevel = (typeof MLT_COGNITIVE_LEVELS)[number]["id"];

export type MltCountryTrack = "canada" | "usa" | "both";
export type MltExamTrack = "csmls" | "ascp-mlt" | "ascp-mls" | "both";

export const MLT_COUNTRY_TRACKS = [
  { id: "canada" as const, label: "Canada", examBoard: "CSMLS", examName: "CSMLS National Certification Examination" },
  { id: "usa" as const, label: "United States", examBoard: "ASCP", examName: "ASCP Board of Certification MLS/MLT Examination" },
] as const;

export const MLT_EXAM_TRACKS = [
  { id: "csmls" as const, country: "canada", label: "CSMLS MLT", description: "Canadian Society for Medical Laboratory Science" },
  { id: "ascp-mlt" as const, country: "usa", label: "ASCP MLT", description: "American Society for Clinical Pathology — Medical Laboratory Technician" },
  { id: "ascp-mls" as const, country: "usa", label: "ASCP MLS", description: "American Society for Clinical Pathology — Medical Laboratory Scientist" },
] as const;

export const MLT_FLASHCARD_CARD_TYPES = [
  "term-definition",
  "image-identification",
  "clinical-scenario",
  "lab-value",
  "procedure-steps",
  "comparison",
  "mnemonic",
] as const;

export type MltFlashcardCardType = (typeof MLT_FLASHCARD_CARD_TYPES)[number];

export interface MltSeoKeywordCluster {
  discipline: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  longTailKeywords: string[];
  relatedQuestions: string[];
}

export const MLT_SEO_KEYWORD_CLUSTERS: MltSeoKeywordCluster[] = [
  {
    discipline: "Clinical Chemistry",
    primaryKeyword: "clinical chemistry MLT exam",
    secondaryKeywords: ["electrolyte panel review", "blood gas interpretation MLT", "liver function tests study guide", "renal function panel MLT", "HbA1c clinical significance", "cardiac biomarkers troponin CK-MB"],
    longTailKeywords: ["how to calculate anion gap for MLT exam", "Henderson-Hasselbalch equation practice problems", "BUN creatinine ratio interpretation guide", "Friedewald equation LDL calculation steps", "osmolal gap calculation clinical chemistry"],
    relatedQuestions: ["What is the normal fasting glucose range?", "How do you interpret arterial blood gas results?", "What causes elevated anion gap metabolic acidosis?", "What is the difference between direct and indirect bilirubin?", "How is HbA1c used to monitor diabetes?"],
  },
  {
    discipline: "Hematology",
    primaryKeyword: "hematology MLT certification review",
    secondaryKeywords: ["CBC interpretation guide", "peripheral blood smear morphology", "RBC indices MCV MCH MCHC", "white blood cell differential", "anemia classification MLT", "reticulocyte count interpretation"],
    longTailKeywords: ["how to identify spherocytes on peripheral smear", "what causes elevated RDW in iron deficiency", "schistocytes clinical significance TTP HUS", "difference between reactive lymphocytes and blasts", "Auer rods AML diagnosis significance"],
    relatedQuestions: ["What are the normal WBC count and differential ranges?", "How do you differentiate iron deficiency from thalassemia trait?", "What morphology is pathognomonic for myelofibrosis?", "What are Howell-Jolly bodies and what do they indicate?", "How do you estimate platelet count from a blood smear?"],
  },
  {
    discipline: "Hemostasis / Coagulation",
    primaryKeyword: "coagulation testing MLT exam prep",
    secondaryKeywords: ["PT aPTT interpretation", "mixing study algorithm", "DIC laboratory diagnosis", "warfarin INR monitoring", "heparin aPTT therapeutic range", "von Willebrand disease testing"],
    longTailKeywords: ["how to interpret mixing study results factor deficiency vs inhibitor", "lupus anticoagulant paradox explained for lab students", "Bethesda assay factor VIII inhibitor quantification", "ISTH DIC scoring system components and interpretation", "citrate tube underfill effect on coagulation results"],
    relatedQuestions: ["What is the difference between PT and aPTT?", "What does a mixing study tell you?", "What is the DIC laboratory profile?", "Why must citrate tubes be filled to the line?", "What are the vitamin K-dependent factors?"],
  },
  {
    discipline: "Immunohematology / Blood Banking",
    primaryKeyword: "blood banking MLT exam review",
    secondaryKeywords: ["ABO Rh typing forward reverse", "antibody identification panel", "crossmatch compatibility testing", "transfusion reactions management", "HDFN hemolytic disease newborn", "blood component storage temperatures"],
    longTailKeywords: ["how to perform antibody panel rule-out technique", "Kidd antibodies delayed hemolytic transfusion reaction", "Kleihauer-Betke test RhIG dose calculation", "difference between TRALI and TACO transfusion", "when is irradiated blood required for transfusion"],
    relatedQuestions: ["What blood type is the universal RBC donor?", "What is the Direct Antiglobulin Test?", "How do you identify antibodies using a panel?", "What are the signs of acute hemolytic transfusion reaction?", "When is RhIG administered and at what dose?"],
  },
  {
    discipline: "Microbiology",
    primaryKeyword: "microbiology MLT certification study",
    secondaryKeywords: ["Gram stain interpretation guide", "bacterial identification flowchart", "culture media selective differential", "antibiotic susceptibility testing", "MRSA detection methods", "acid-fast bacilli staining"],
    longTailKeywords: ["how to differentiate Staphylococcus from Streptococcus catalase test", "MacConkey agar lactose fermenter identification", "Neisseria gonorrhoeae vs meningitidis sugar utilization", "EMB agar green metallic sheen E coli identification", "what specimens should never be refrigerated before culture"],
    relatedQuestions: ["What organisms are gram-positive cocci in clusters?", "What does the oxidase test differentiate?", "How do you identify Pseudomonas aeruginosa?", "What is MRSA and how is it detected?", "What media is used for Neisseria gonorrhoeae?"],
  },
  {
    discipline: "Urinalysis & Body Fluids",
    primaryKeyword: "urinalysis body fluids MLT exam",
    secondaryKeywords: ["urine sediment identification", "urinary casts clinical significance", "urine crystals acid alkaline", "CSF analysis meningitis", "synovial fluid gout pseudogout", "body fluid transudate exudate"],
    longTailKeywords: ["how to differentiate bacterial from viral meningitis CSF findings", "Maltese cross polarized light nephrotic syndrome diagnosis", "triple phosphate crystals UTI alkaline urine significance", "traumatic tap vs subarachnoid hemorrhage CSF xanthochromia", "urine dipstick false positive false negative causes"],
    relatedQuestions: ["What are the types of urinary casts?", "What crystals are found in acidic vs alkaline urine?", "How do you differentiate transudates from exudates?", "What crystal finding is diagnostic for gout?", "What is the significance of oval fat bodies in urine?"],
  },
  {
    discipline: "Immunology / Serology",
    primaryKeyword: "immunology serology MLT review",
    secondaryKeywords: ["immunoglobulin classes functions", "ELISA testing principle", "ANA patterns autoimmune disease", "HIV testing algorithm 4th generation", "hepatitis B serological markers", "complement C3 C4 interpretation"],
    longTailKeywords: ["how to interpret hepatitis B serological profiles window period", "ANA homogeneous vs speckled pattern autoimmune disease correlation", "fourth generation HIV testing algorithm confirmatory testing steps", "syphilis testing RPR FTA-ABS reverse algorithm explained", "sensitivity vs specificity diagnostic testing SnNOut SpPIn"],
    relatedQuestions: ["What are the five immunoglobulin classes?", "What does a positive ANA with homogeneous pattern suggest?", "What hepatitis B profile indicates vaccination immunity?", "What is the prozone effect?", "How does flow cytometry work in clinical diagnostics?"],
  },
  {
    discipline: "Molecular Diagnostics",
    primaryKeyword: "molecular diagnostics MLT certification",
    secondaryKeywords: ["PCR polymerase chain reaction steps", "real-time qPCR Ct value interpretation", "RT-PCR RNA virus detection", "FISH fluorescence in situ hybridization", "next-generation sequencing clinical lab", "nucleic acid extraction methods"],
    longTailKeywords: ["how to interpret Ct values in real-time PCR viral load testing", "difference between conventional PCR and real-time qPCR", "BCR-ABL Philadelphia chromosome detection CML FISH PCR", "PCR contamination prevention unidirectional workflow UNG system", "digital PCR vs qPCR absolute quantification advantages"],
    relatedQuestions: ["What are the three steps of PCR?", "What does a low Ct value indicate?", "What is the Philadelphia chromosome?", "How do you prevent contamination in the molecular lab?", "What is the difference between Southern Northern and Western blots?"],
  },
  {
    discipline: "Histotechnology",
    primaryKeyword: "histotechnology MLT exam review",
    secondaryKeywords: ["tissue processing steps histology", "H&E staining hematoxylin eosin", "special stains PAS GMS trichrome", "immunohistochemistry IHC markers", "frozen section intraoperative", "formalin fixation 10% NBF"],
    longTailKeywords: ["steps of tissue processing fixation dehydration clearing embedding", "PAS vs GMS stain for fungal identification in tissue sections", "Congo Red amyloid apple-green birefringence polarized light", "IHC markers carcinoma vs lymphoma vs sarcoma differentiation", "antigen retrieval HIER EIER immunohistochemistry troubleshooting"],
    relatedQuestions: ["What are the steps in tissue processing?", "What does H&E staining demonstrate?", "What does Masson Trichrome stain?", "What IHC markers differentiate tumor types?", "When is a frozen section performed?"],
  },
  {
    discipline: "Parasitology",
    primaryKeyword: "parasitology mycology MLT exam",
    secondaryKeywords: ["O&P examination technique", "malaria blood smear identification", "dimorphic fungi classification", "Candida albicans germ tube test", "Aspergillus vs Mucor tissue morphology", "Cryptosporidium acid-fast stain"],
    longTailKeywords: ["how to differentiate Plasmodium species on thin blood smear", "Aspergillus septate 45 degrees vs Mucor non-septate 90 degrees branching", "dimorphic fungi mold cold yeast heat temperature dependent morphology", "Pneumocystis jirovecii GMS stain crushed ping pong ball appearance", "Entamoeba histolytica vs dispar microscopic identification limitations"],
    relatedQuestions: ["What is an O&P examination?", "How do you identify malaria species?", "What are the five dimorphic fungi?", "What is the germ tube test?", "How do you differentiate Aspergillus from Mucor in tissue?"],
  },
  {
    discipline: "Laboratory Operations & Quality Management",
    primaryKeyword: "laboratory QC quality management MLT",
    secondaryKeywords: ["Westgard rules explained", "Levey-Jennings chart interpretation", "proficiency testing requirements", "CLIA test complexity categories", "method validation comparison study", "coefficient of variation precision"],
    longTailKeywords: ["all six Westgard rules random vs systematic error identification", "how to establish reference ranges 120 healthy individuals", "difference between accuracy and precision QC laboratory testing", "CLIA waived moderate high complexity test classification criteria", "root cause analysis fishbone diagram five whys laboratory quality"],
    relatedQuestions: ["What are the Westgard rules?", "What is the difference between QC and QA?", "What is proficiency testing?", "How is the coefficient of variation calculated?", "What is a corrective action plan?"],
  },
  {
    discipline: "Phlebotomy & Specimen Collection",
    primaryKeyword: "phlebotomy specimen collection MLT",
    secondaryKeywords: ["order of draw venipuncture", "specimen rejection criteria", "critical value reporting protocol", "pre-analytical error prevention", "capillary puncture technique", "blood culture collection procedure"],
    longTailKeywords: ["correct order of draw venipuncture tube color sequence mnemonic", "hemolysis effects on laboratory test results potassium LDH AST", "under-filled citrate tube coagulation false prolongation rejection", "cold agglutinin interference MCV RBC MCHC resolution warm specimen", "delta check previous result comparison specimen mislabeling detection"],
    relatedQuestions: ["What is the correct order of draw?", "What are common reasons for specimen rejection?", "What tests are affected by hemolysis?", "What is the tourniquet time limit?", "What are critical values and the reporting protocol?"],
  },
];
