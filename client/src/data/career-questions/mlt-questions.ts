export interface CareerQuestion {
    id: string;
    stem: string;
    options: string[];
    correctIndex: number;
    rationale: string;
    difficulty: number;
    category: string;
    topic: string;
  }

  export const mltQuestions: CareerQuestion[] = [
  {
      id: "mlt-001",
      stem: "A 45-year-old female with fatigue: Hgb 8.2, MCV 68, MCHC 28, RDW 18.5%. Most important initial test:",
      options: ["Hemoglobin electrophoresis", "Serum ferritin and iron studies", "Vitamin B12 and folate", "DAT"],
      correctIndex: 1,
      rationale: "Microcytic hypochromic anemia with elevated RDW = classic iron deficiency. Iron studies confirm. Elevated RDW distinguishes from thalassemia trait.",
      difficulty: 2,
      category: "Hematology",
      topic: "CBC interpretation"
    },
  {
      id: "mlt-002",
      stem: "Differential: neutrophils 82%, bands 8%, lymphocytes 6%. WBC 14.5. This indicates:",
      options: ["Viral infection", "Left shift from bacterial infection", "CLL", "Allergic response"],
      correctIndex: 1,
      rationale: "Leukocytosis with neutrophilia and increased bands (>5%) = left shift from acute bacterial infection.",
      difficulty: 2,
      category: "Hematology",
      topic: "CBC interpretation"
    },
  {
      id: "mlt-003",
      stem: "Hgb 12.5 but Hct only 28% (expected ~37.5%). Cause:",
      options: ["Lipemia falsely elevating Hgb", "Cold agglutinins", "Platelet clumping", "Underfill"],
      correctIndex: 0,
      rationale: "Lipemia increases optical density → falsely elevated photometric Hgb. Hct unaffected. Use plasma replacement.",
      difficulty: 3,
      category: "Hematology",
      topic: "CBC interpretation"
    },
  {
      id: "mlt-004",
      stem: "WBC 2.1, Hgb 8.0, platelets 45, retics 0.3%. Diagnosis:",
      options: ["Hemolytic anemia", "Iron deficiency", "Aplastic anemia", "Megaloblastic anemia"],
      correctIndex: 2,
      rationale: "Pancytopenia + reticulocytopenia = marrow failure (aplastic anemia).",
      difficulty: 3,
      category: "Hematology",
      topic: "CBC interpretation"
    },
  {
      id: "mlt-005",
      stem: "Analyzer: RBC agglutination flag, MCV 128, MCHC 41. Action:",
      options: ["Report with comment", "Warm to 37°C and re-run", "New citrate specimen", "Manual Hct"],
      correctIndex: 1,
      rationale: "Cold agglutinins → RBC clumps counted as large cells. Warm to dissociate.",
      difficulty: 4,
      category: "Hematology",
      topic: "CBC interpretation"
    },
  {
      id: "mlt-006",
      stem: "Neonatal WBC 18.5, nRBCs 8/100 WBCs. Corrected WBC:",
      options: ["17.1", "10.2", "18.5", "15.5"],
      correctIndex: 0,
      rationale: "(18.5 × 100)/108 = 17.1. nRBCs counted as WBCs must be corrected.",
      difficulty: 3,
      category: "Hematology",
      topic: "CBC interpretation"
    },
  {
      id: "mlt-007",
      stem: "MCHC formula:",
      options: ["(Hgb × 10)/RBC", "(Hct × 10)/RBC", "(Hgb/Hct) × 100", "SD/MCV × 100"],
      correctIndex: 2,
      rationale: "MCHC = (Hgb/Hct) × 100 in g/dL.",
      difficulty: 1,
      category: "Hematology",
      topic: "CBC interpretation"
    },
  {
      id: "mlt-008",
      stem: "MCV 72, RBC 6.8M, RDW 13.2%. Mentzer index:",
      options: ["10.6 — thalassemia trait", "10.6 — iron deficiency", "15.3 — thalassemia", "6.8 — iron deficiency"],
      correctIndex: 0,
      rationale: "72/6.8 = 10.6. <13 = thalassemia trait. Normal RDW supports thalassemia.",
      difficulty: 3,
      category: "Hematology",
      topic: "CBC interpretation"
    },
  {
      id: "mlt-009",
      stem: "In vitro hemolysis most affects:",
      options: ["WBC decreased", "Hgb falsely elevated", "MCV increased", "Platelets elevated"],
      correctIndex: 1,
      rationale: "Free Hgb from hemolysis → measured with intracellular Hgb → false elevation.",
      difficulty: 2,
      category: "Hematology",
      topic: "CBC interpretation"
    },
  {
      id: "mlt-010",
      stem: "Coulter principle measures:",
      options: ["Light scatter", "Impedance through aperture", "Fluorescence", "Optical density"],
      correctIndex: 1,
      rationale: "Cells displace diluent through aperture → impedance change proportional to volume.",
      difficulty: 1,
      category: "Hematology",
      topic: "CBC interpretation"
    },
  {
      id: "mlt-011",
      stem: "Primary CBC anticoagulant:",
      options: ["Citrate", "K2EDTA", "Heparin", "NaF"],
      correctIndex: 1,
      rationale: "EDTA chelates calcium, preserves morphology.",
      difficulty: 1,
      category: "Hematology",
      topic: "CBC interpretation"
    },
  {
      id: "mlt-012",
      stem: "RDW measures:",
      options: ["Average RBC size", "RBC size variation", "Hgb concentration", "Reticulocyte ratio"],
      correctIndex: 1,
      rationale: "RDW = coefficient of variation of RBC volume. Elevated = anisocytosis.",
      difficulty: 1,
      category: "Hematology",
      topic: "CBC interpretation"
    },
  {
      id: "mlt-013",
      stem: "Normal M:E ratio:",
      options: ["1:1", "2:1 to 4:1", "6:1 to 8:1", "10:1"],
      correctIndex: 1,
      rationale: "Normal ~3:1. Increased in infection/CML; decreased in erythroid hyperplasia.",
      difficulty: 2,
      category: "Hematology",
      topic: "CBC interpretation"
    },
  {
      id: "mlt-014",
      stem: "Lipemic Hgb 18.5, Hct 38%. Correction:",
      options: ["Warm and re-run", "Replace plasma with saline, re-run", "Report as is", "Use serum"],
      correctIndex: 1,
      rationale: "Plasma replacement eliminates turbidity interference.",
      difficulty: 3,
      category: "Hematology",
      topic: "CBC interpretation"
    },
  {
      id: "mlt-015",
      stem: "EDTA specimen delayed 6 hrs:",
      options: ["MCV decreased", "MCV increased from swelling", "WBC decreased", "Platelets increased"],
      correctIndex: 1,
      rationale: "Prolonged EDTA → RBC swelling → increased MCV. Process within 4 hrs.",
      difficulty: 2,
      category: "Hematology",
      topic: "CBC interpretation"
    },
  {
      id: "mlt-016",
      stem: "Fragmented helmet RBCs from mechanical valve:",
      options: ["Spherocytes", "Acanthocytes", "Schistocytes", "Dacryocytes"],
      correctIndex: 2,
      rationale: "Schistocytes from mechanical trauma. Also TTP, HUS, DIC.",
      difficulty: 1,
      category: "Hematology",
      topic: "RBC morphology"
    },
  {
      id: "mlt-017",
      stem: "Round RBCs, no pallor, +DAT, high MCHC:",
      options: ["Targets", "Spherocytes", "Stomatocytes", "Elliptocytes"],
      correctIndex: 1,
      rationale: "Spherocytes lost membrane, positive DAT = AIHA.",
      difficulty: 2,
      category: "Hematology",
      topic: "RBC morphology"
    },
  {
      id: "mlt-018",
      stem: "Bull's-eye RBCs in liver disease:",
      options: ["Rouleaux", "Target cells", "Echinocytes", "Bite cells"],
      correctIndex: 1,
      rationale: "Target cells from excess membrane. Liver disease, thalassemia, HbC.",
      difficulty: 1,
      category: "Hematology",
      topic: "RBC morphology"
    },
  {
      id: "mlt-019",
      stem: "Dacryocytes + nRBCs + immature granulocytes:",
      options: ["Left shift", "Leukemoid reaction", "Leukoerythroblastic reaction", "Pseudo-Pelger-Huët"],
      correctIndex: 2,
      rationale: "Myelofibrosis → extramedullary hematopoiesis → leukoerythroblastic picture.",
      difficulty: 3,
      category: "Hematology",
      topic: "RBC morphology"
    },
  {
      id: "mlt-020",
      stem: "Basophilic stippling + developmental delay in child:",
      options: ["Asplenia", "Lead poisoning", "G6PD deficiency", "Sideroblastic anemia"],
      correctIndex: 1,
      rationale: "Lead inhibits heme synthesis enzymes → stippling + microcytic anemia.",
      difficulty: 2,
      category: "Hematology",
      topic: "RBC morphology"
    },
  {
      id: "mlt-021",
      stem: "Supravital-stain-only inclusions near RBC membrane:",
      options: ["Howell-Jolly bodies", "Basophilic stippling", "Heinz bodies", "Cabot rings"],
      correctIndex: 2,
      rationale: "Heinz bodies = denatured Hgb precipitate. G6PD deficiency, oxidant drugs. Spleen removal → bite cells.",
      difficulty: 3,
      category: "Hematology",
      topic: "RBC morphology"
    },
  {
      id: "mlt-022",
      stem: "Post-splenectomy inclusions persist because spleen normally:",
      options: ["Prevents formation", "Removes via pitting function", "Produces protective factors", "No effect"],
      correctIndex: 1,
      rationale: "Spleen pits inclusions without destroying cells.",
      difficulty: 2,
      category: "Hematology",
      topic: "RBC morphology"
    },
  {
      id: "mlt-023",
      stem: "Rouleaux formation suggests elevated:",
      options: ["Albumin", "Fibrinogen/immunoglobulins", "Transferrin", "Hemoglobin"],
      correctIndex: 1,
      rationale: "Asymmetric proteins bridge RBCs. Myeloma, Waldenström.",
      difficulty: 2,
      category: "Hematology",
      topic: "RBC morphology"
    },
  {
      id: "mlt-024",
      stem: "Normal RBC lifespan:",
      options: ["30 days", "60 days", "120 days", "180 days"],
      correctIndex: 2,
      rationale: "~120 days. Aged cells removed by splenic macrophages.",
      difficulty: 1,
      category: "Hematology",
      topic: "RBC morphology"
    },
  {
      id: "mlt-025",
      stem: "Evaluate RBC morphology in smear:",
      options: ["Thick area", "Feathered edge", "Monolayer", "Any area"],
      correctIndex: 2,
      rationale: "Monolayer = accurate morphology representation.",
      difficulty: 2,
      category: "Hematology",
      topic: "RBC morphology"
    },
  {
      id: "mlt-026",
      stem: "Large lymphocytes with scalloped basophilic cytoplasm, sore throat:",
      options: ["Blasts", "Reactive lymphocytes", "Monocytes", "Plasma cells"],
      correctIndex: 1,
      rationale: "Reactive lymphocytes = EBV mononucleosis.",
      difficulty: 2,
      category: "Hematology",
      topic: "WBC differential"
    },
  {
      id: "mlt-027",
      stem: "Segs 25%, bands 2%, lymph 65%. WBC 3.2. ANC:",
      options: ["864", "2,080", "1,600", "480"],
      correctIndex: 0,
      rationale: "ANC = 3,200 × 0.27 = 864. Neutropenia (ANC <1,500).",
      difficulty: 2,
      category: "Hematology",
      topic: "WBC differential"
    },
  {
      id: "mlt-028",
      stem: "Pink rod inclusions in blasts:",
      options: ["Toxic granulation", "Döhle bodies", "Auer rods", "Charcot-Leyden"],
      correctIndex: 2,
      rationale: "Auer rods pathognomonic for AML. Multiple = APL (faggot cells).",
      difficulty: 2,
      category: "Hematology",
      topic: "WBC differential"
    },
  {
      id: "mlt-029",
      stem: "Eosinophilia LEAST likely from:",
      options: ["Parasites", "Asthma", "Acute bacterial infection", "Drug reaction"],
      correctIndex: 2,
      rationale: "Bacterial infections → neutrophilia, not eosinophilia.",
      difficulty: 1,
      category: "Hematology",
      topic: "WBC differential"
    },
  {
      id: "mlt-030",
      stem: "Toxic granulation + Döhle bodies in sepsis:",
      options: ["Reactive neutrophil changes", "Leukemia", "Genetic anomaly", "Artifact"],
      correctIndex: 0,
      rationale: "Reactive from accelerated granulopoiesis in severe infection.",
      difficulty: 2,
      category: "Hematology",
      topic: "WBC differential"
    },
  {
      id: "mlt-031",
      stem: "WBC 85, 92% mature lymphocytes, smudge cells:",
      options: ["ALL", "CLL", "Hairy cell leukemia", "Mononucleosis"],
      correctIndex: 1,
      rationale: "CLL most common adult leukemia. Mature lymphocytes + smudge cells.",
      difficulty: 2,
      category: "Hematology",
      topic: "WBC differential"
    },
  {
      id: "mlt-032",
      stem: "Eccentric nucleus, clock-face chromatin, hof:",
      options: ["Reactive lymphocyte", "Monocyte", "Plasma cell", "Blast"],
      correctIndex: 2,
      rationale: "Plasma cell morphology.",
      difficulty: 1,
      category: "Hematology",
      topic: "WBC differential"
    },
  {
      id: "mlt-033",
      stem: "ANC 120 in chemo patient:",
      options: ["Mild neutropenia", "Moderate neutropenia", "Severe neutropenia — life-threatening", "Leukocytosis"],
      correctIndex: 2,
      rationale: "ANC <500 = severe. Immediate empiric antibiotics for any fever.",
      difficulty: 2,
      category: "Hematology",
      topic: "WBC differential"
    },
  {
      id: "mlt-034",
      stem: "Low iron, high TIBC, very low ferritin, low sat:",
      options: ["Anemia of chronic disease", "Thalassemia trait", "Iron deficiency anemia", "Sideroblastic anemia"],
      correctIndex: 2,
      rationale: "Classic iron deficiency. ACD = low TIBC, normal/elevated ferritin.",
      difficulty: 2,
      category: "Hematology",
      topic: "anemias classification"
    },
  {
      id: "mlt-035",
      stem: "Oval macrocytes, hypersegmented neuts, low B12. Also expected:",
      options: ["High reticulocytes", "Elevated MMA", "Decreased LDH", "Low indirect bilirubin"],
      correctIndex: 1,
      rationale: "MMA elevated in B12 def (not folate). Key distinguishing test.",
      difficulty: 3,
      category: "Hematology",
      topic: "anemias classification"
    },
  {
      id: "mlt-036",
      stem: "Hemolysis after TMP-SMX, bite cells, Heinz bodies:",
      options: ["HS", "G6PD deficiency", "PK deficiency", "Sickle cell"],
      correctIndex: 1,
      rationale: "G6PD: X-linked. Oxidant drugs → Heinz bodies → bite cells.",
      difficulty: 2,
      category: "Hematology",
      topic: "anemias classification"
    },
  {
      id: "mlt-037",
      stem: "CKD: normocytic anemia, normal iron, low EPO:",
      options: ["Iron deficiency", "Chronic disease", "CKD anemia — decreased EPO", "Aplastic"],
      correctIndex: 2,
      rationale: "CKD = decreased EPO production. Treatment: recombinant EPO.",
      difficulty: 2,
      category: "Hematology",
      topic: "anemias classification"
    },
  {
      id: "mlt-038",
      stem: "Hemolysis + positive DAT with IgG:",
      options: ["Warm AIHA", "Cold agglutinin disease", "HS", "Mechanical"],
      correctIndex: 0,
      rationale: "DAT + IgG = warm AIHA.",
      difficulty: 3,
      category: "Hematology",
      topic: "anemias classification"
    },
  {
      id: "mlt-039",
      stem: "Test distinguishing folate from B12 deficiency:",
      options: ["Homocysteine", "MMA", "Hypersegmented neuts", "Macrocytes"],
      correctIndex: 1,
      rationale: "MMA elevated ONLY in B12 deficiency.",
      difficulty: 2,
      category: "Hematology",
      topic: "anemias classification"
    },
  {
      id: "mlt-040",
      stem: "Increased osmotic fragility, spherocytes, negative DAT:",
      options: ["AIHA", "Hereditary spherocytosis", "Thalassemia", "Iron deficiency"],
      correctIndex: 1,
      rationale: "HS: membrane defects → negative DAT rules out AIHA.",
      difficulty: 3,
      category: "Hematology",
      topic: "anemias classification"
    },
  {
      id: "mlt-041",
      stem: "Iron store stain:",
      options: ["Wright-Giemsa", "Prussian blue", "PAS", "MPO"],
      correctIndex: 1,
      rationale: "Prussian blue stains Fe³⁺ blue.",
      difficulty: 1,
      category: "Hematology",
      topic: "anemias classification"
    },
  {
      id: "mlt-042",
      stem: "Ringed sideroblasts on iron stain:",
      options: ["Iron deficiency", "Sideroblastic anemia", "Megaloblastic", "Aplastic"],
      correctIndex: 1,
      rationale: "Iron-laden mitochondria ring = sideroblastic anemia.",
      difficulty: 3,
      category: "Hematology",
      topic: "anemias classification"
    },
  {
      id: "mlt-043",
      stem: "Most common inherited bleeding disorder:",
      options: ["Hemophilia A", "Hemophilia B", "Von Willebrand disease", "Factor XI def"],
      correctIndex: 2,
      rationale: "vWD ~1% of population. Autosomal dominant.",
      difficulty: 1,
      category: "Hematology",
      topic: "anemias classification"
    },
  {
      id: "mlt-044",
      stem: "Hgb A2 5.5%, decreased HgbA:",
      options: ["Normal", "Beta-thal trait", "Alpha-thal trait", "HgbE trait"],
      correctIndex: 1,
      rationale: "Elevated A2 (>3.5%) = beta-thal trait.",
      difficulty: 2,
      category: "Hematology",
      topic: "hemoglobin variants"
    },
  {
      id: "mlt-045",
      stem: "Highest O₂ affinity:",
      options: ["Hgb A", "Hgb F", "Hgb S", "Hgb A2"],
      correctIndex: 1,
      rationale: "HgbF doesn't bind 2,3-DPG well → higher O₂ affinity.",
      difficulty: 2,
      category: "Hematology",
      topic: "hemoglobin variants"
    },
  {
      id: "mlt-046",
      stem: "Sickle solubility principle:",
      options: ["Crystallization", "Insolubility in dithionite → turbidity", "Different migration", "Color change"],
      correctIndex: 1,
      rationale: "Deoxy HbS insoluble → turbidity. Cannot distinguish AS from SS.",
      difficulty: 2,
      category: "Hematology",
      topic: "hemoglobin variants"
    },
  {
      id: "mlt-047",
      stem: "Fastest alkaline electrophoresis migration:",
      options: ["Hgb A", "Hgb S", "Hgb C", "Hgb F"],
      correctIndex: 0,
      rationale: "A > F > S > C toward anode.",
      difficulty: 2,
      category: "Hematology",
      topic: "hemoglobin variants"
    },
  {
      id: "mlt-048",
      stem: "Age 2: HgbF 95%, no HgbA:",
      options: ["Normal", "Beta-thal major", "SCD", "HPFH"],
      correctIndex: 1,
      rationale: "Absent HgbA = both beta genes nonfunctional. Lifelong transfusions needed.",
      difficulty: 3,
      category: "Hematology",
      topic: "hemoglobin variants"
    },
  {
      id: "mlt-049",
      stem: "Under-filled citrate tube:",
      options: ["PT/aPTT shortened", "PT/aPTT falsely prolonged", "Only PT affected", "No effect"],
      correctIndex: 1,
      rationale: "Excess citrate → falsely prolonged times. Reject <90% filled.",
      difficulty: 1,
      category: "Hematology",
      topic: "coagulation cascade"
    },
  {
      id: "mlt-050",
      stem: "Prolonged aPTT corrects on mixing:",
      options: ["Lupus anticoagulant", "Factor deficiency", "Heparin", "Factor VIII inhibitor"],
      correctIndex: 1,
      rationale: "Correction = deficiency. No correction = inhibitor.",
      difficulty: 2,
      category: "Hematology",
      topic: "coagulation cascade"
    },
  {
      id: "mlt-051",
      stem: "DIC profile:",
      options: ["Normal PT, long aPTT", "Long PT/aPTT, low fibrinogen, high D-dimer, low plts, schistocytes", "Isolated thrombocytopenia", "Long PT only"],
      correctIndex: 1,
      rationale: "Classic DIC. Always secondary to underlying trigger.",
      difficulty: 2,
      category: "Hematology",
      topic: "coagulation cascade"
    },
  {
      id: "mlt-052",
      stem: "Warfarin factors:",
      options: ["V, VIII, XI, XII", "II, VII, IX, X, proteins C and S", "I, V, VIII, XIII", "III, IV, VII, X"],
      correctIndex: 1,
      rationale: "1972 mnemonic. Factor VII shortest half-life → PT prolongs first.",
      difficulty: 1,
      category: "Hematology",
      topic: "coagulation cascade"
    },
  {
      id: "mlt-053",
      stem: "aPTT normalizes with protamine:",
      options: ["Lupus anticoagulant", "Factor VIII def", "Heparin contamination", "Factor XII def"],
      correctIndex: 2,
      rationale: "Protamine neutralizes heparin.",
      difficulty: 2,
      category: "Hematology",
      topic: "coagulation cascade"
    },
  {
      id: "mlt-054",
      stem: "Factor causing prolonged aPTT without bleeding:",
      options: ["VIII", "IX", "XII", "XI"],
      correctIndex: 2,
      rationale: "Factor XII not essential for in vivo hemostasis.",
      difficulty: 2,
      category: "Hematology",
      topic: "coagulation cascade"
    },
  {
      id: "mlt-055",
      stem: "vWD type 1 pattern:",
      options: ["Long PT, normal aPTT", "Normal PT, long aPTT, long bleeding time", "Long PT/aPTT", "Normal all, thrombocytopenia"],
      correctIndex: 1,
      rationale: "vWD: long bleeding time (adhesion) + long aPTT (carries VIII). Normal PT.",
      difficulty: 3,
      category: "Hematology",
      topic: "coagulation cascade"
    },
  {
      id: "mlt-056",
      stem: "Isolated prolonged PT:",
      options: ["Factor VIII", "Factor IX", "Factor VII", "Factor XII"],
      correctIndex: 2,
      rationale: "VII only in extrinsic pathway.",
      difficulty: 1,
      category: "Hematology",
      topic: "coagulation cascade"
    },
  {
      id: "mlt-057",
      stem: "Negative D-dimer, low pretest PE:",
      options: ["Definitively ruled out", "Effectively ruled out — high NPV", "Cannot rule out", "Irrelevant"],
      correctIndex: 1,
      rationale: "High sensitivity. Negative + low pretest → rules out PE.",
      difficulty: 2,
      category: "Hematology",
      topic: "coagulation cascade"
    },
  {
      id: "mlt-058",
      stem: "Clauss fibrinogen method:",
      options: ["From PT waveform", "Thrombin + diluted plasma → time inversely proportional", "ELISA", "Heat precipitation"],
      correctIndex: 1,
      rationale: "Reference method for quantitative fibrinogen.",
      difficulty: 2,
      category: "Hematology",
      topic: "coagulation cascade"
    },
  {
      id: "mlt-059",
      stem: "Automated plts 18, no bleeding, clumps on smear:",
      options: ["Report critical value", "New citrate specimen", "Manual count", "Report unable"],
      correctIndex: 1,
      rationale: "EDTA pseudothrombocytopenia. Citrate recollection, multiply 1.1.",
      difficulty: 2,
      category: "Hematology",
      topic: "platelet disorders"
    },
  {
      id: "mlt-060",
      stem: "Plts 22, large plts, megakaryocyte hyperplasia, anti-plt antibodies:",
      options: ["TTP", "ITP", "DIC", "HIT"],
      correctIndex: 1,
      rationale: "ITP: autoimmune destruction. Marrow compensation. Normal PT/aPTT.",
      difficulty: 2,
      category: "Hematology",
      topic: "platelet disorders"
    },
  {
      id: "mlt-061",
      stem: "Platelet estimate per OIF ×:",
      options: ["1,000", "15,000-20,000", "100,000", "500"],
      correctIndex: 1,
      rationale: "Each plt/OIF ≈ 15-20K/µL.",
      difficulty: 1,
      category: "Hematology",
      topic: "platelet disorders"
    },
  {
      id: "mlt-062",
      stem: "Thrombocytopenia + schistocytes + pentad:",
      options: ["DIC", "TTP", "ITP", "HUS"],
      correctIndex: 1,
      rationale: "TTP pentad. ADAMTS13 deficiency. Normal PT/aPTT.",
      difficulty: 3,
      category: "Hematology",
      topic: "platelet disorders"
    },
  {
      id: "mlt-063",
      stem: "EDTA platelet clumping occurs because:",
      options: ["Lyses platelets", "Alters GPIIb/IIIa → IgM binding → agglutination", "Activates coagulation", "Excess calcium chelation"],
      correctIndex: 1,
      rationale: "~0.1% of patients. False low count.",
      difficulty: 1,
      category: "Hematology",
      topic: "platelet disorders"
    },
  {
      id: "mlt-064",
      stem: "Blasts: TdT+, CD10+, CD19+, MPO−:",
      options: ["AML", "Precursor B-ALL", "CLL", "Burkitt"],
      correctIndex: 1,
      rationale: "B-ALL. Most common childhood cancer. CD10+ = favorable prognosis.",
      difficulty: 3,
      category: "Hematology",
      topic: "leukemia identification"
    },
  {
      id: "mlt-065",
      stem: "Faggot cells + DIC:",
      options: ["AML-M1", "APL (AML-M3)", "M5", "M7"],
      correctIndex: 1,
      rationale: "Faggot cells pathognomonic for APL. t(15;17). Treat with ATRA.",
      difficulty: 3,
      category: "Hematology",
      topic: "leukemia identification"
    },
  {
      id: "mlt-066",
      stem: "ALL: PAS block pattern. AML positive for:",
      options: ["PAS", "MPO", "TdT", "CD10"],
      correctIndex: 1,
      rationale: "AML: MPO+ (≥3%), SBB+. Gold standard for myeloid lineage.",
      difficulty: 2,
      category: "Hematology",
      topic: "leukemia identification"
    },
  {
      id: "mlt-067",
      stem: "CML monitoring:",
      options: ["JAK2", "BCR-ABL1 qRT-PCR", "FLT3", "NPM1"],
      correctIndex: 1,
      rationale: "Imatinib targets BCR-ABL1. Monitor by qRT-PCR.",
      difficulty: 3,
      category: "Hematology",
      topic: "leukemia identification"
    },
  {
      id: "mlt-068",
      stem: "≥20% blasts:",
      options: ["MDS", "Acute leukemia", "CML chronic", "Normal"],
      correctIndex: 1,
      rationale: "WHO criteria for acute leukemia.",
      difficulty: 2,
      category: "Hematology",
      topic: "leukemia identification"
    },
  {
      id: "mlt-069",
      stem: "Corrected retic >2%:",
      options: ["Inadequate response", "Adequate marrow response", "Failure", "Need biopsy"],
      correctIndex: 1,
      rationale: "Adequate response to anemia (hemolysis, blood loss).",
      difficulty: 2,
      category: "Hematology",
      topic: "ESR significance"
    },
  {
      id: "mlt-070",
      stem: "Reticulocyte stain:",
      options: ["Wright", "New methylene blue", "Prussian blue", "MPO"],
      correctIndex: 1,
      rationale: "Supravital stain precipitates residual RNA.",
      difficulty: 1,
      category: "Hematology",
      topic: "ESR significance"
    },
  {
      id: "mlt-071",
      stem: "Factor decreasing ESR:",
      options: ["Fibrinogen", "Myeloma", "Polycythemia", "Pregnancy"],
      correctIndex: 2,
      rationale: "High RBC concentration prevents rouleaux.",
      difficulty: 2,
      category: "Hematology",
      topic: "ESR significance"
    },
  {
      id: "mlt-072",
      stem: "A fasting glucose is 135 mg/dL. According to ADA criteria, this result:",
      options: ["Is normal", "Indicates impaired fasting glucose (pre-diabetes)", "Meets criteria for diabetes if confirmed on repeat testing", "Is critically high"],
      correctIndex: 2,
      rationale: "ADA: fasting glucose ≥126 mg/dL on two occasions = diabetes. 100-125 = IFG (pre-diabetes). <100 = normal. This result of 135 meets criteria if confirmed.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "glucose testing"
    },
  {
      id: "mlt-073",
      stem: "HbA1c of 7.2% reflects average glucose control over:",
      options: ["Past 24 hours", "Past 1-2 weeks", "Past 2-3 months", "Past 6 months"],
      correctIndex: 2,
      rationale: "HbA1c reflects average glucose over RBC lifespan (~120 days, weighted toward last 2-3 months). ADA target <7% for most diabetics.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "glucose testing"
    },
  {
      id: "mlt-074",
      stem: "A patient's glucose is measured as 45 mg/dL on a gray-top tube collected 4 hours ago. The tube sat at room temperature. Is this reliable?",
      options: ["Yes — gray top preserves glucose", "No — glycolysis continues in gray top if not centrifuged promptly", "It depends on the patient's hematocrit", "Only if the patient is fasting"],
      correctIndex: 0,
      rationale: "Gray top (NaF/oxalate) inhibits glycolysis by blocking enolase enzyme. However, it takes ~1-2 hours for full inhibition. Best practice: centrifuge within 30 min. After 4 hrs at RT, NaF should have prevented significant loss.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "glucose testing"
    },
  {
      id: "mlt-075",
      stem: "An oral glucose tolerance test (OGTT) 2-hour value of 155 mg/dL indicates:",
      options: ["Normal glucose tolerance", "Impaired glucose tolerance (pre-diabetes)", "Diabetes mellitus", "Hypoglycemia"],
      correctIndex: 1,
      rationale: "OGTT 2-hr: <140 = normal; 140-199 = IGT (pre-diabetes); ≥200 = diabetes. 155 mg/dL = IGT.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "glucose testing"
    },
  {
      id: "mlt-076",
      stem: "A patient has Na⁺ 128 mEq/L (low), serum osmolality 265 mOsm/kg (low). The most likely condition:",
      options: ["Hypernatremia", "Hyponatremia with hypoosmolality (true hyponatremia)", "Pseudohyponatremia", "Diabetes insipidus"],
      correctIndex: 1,
      rationale: "Low sodium with low osmolality = true hyponatremia. Causes include SIADH, heart failure, cirrhosis, renal failure. Pseudohyponatremia (artifact from lipemia/hyperproteinemia) shows normal osmolality.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "electrolyte panels"
    },
  {
      id: "mlt-077",
      stem: "Serum K⁺ is 6.8 mEq/L. Before reporting as critical, the technologist should first check for:",
      options: ["Lipemia", "Hemolysis in the specimen", "Icterus", "Patient age"],
      correctIndex: 1,
      rationale: "Hemolysis releases intracellular K⁺ (RBC K⁺ ~150 mEq/L) → falsely elevated. Check specimen for hemolysis before calling critical potassium. Also check for tourniquet time and fist clenching.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "electrolyte panels"
    },
  {
      id: "mlt-078",
      stem: "The anion gap is calculated as:",
      options: ["Na⁺ − (Cl⁻ + HCO₃⁻)", "Na⁺ + K⁺ − (Cl⁻ + HCO₃⁻)", "Cl⁻ − HCO₃⁻", "Na⁺ − Cl⁻"],
      correctIndex: 0,
      rationale: "Anion gap = Na⁺ − (Cl⁻ + HCO₃⁻). Normal 8-12 mEq/L. Elevated in metabolic acidosis from unmeasured anions (lactate, ketoacids, uremia, toxins — mnemonic MUDPILES).",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "electrolyte panels"
    },
  {
      id: "mlt-079",
      stem: "ABG: pH 7.28, pCO₂ 55 mmHg, HCO₃⁻ 26 mEq/L. Interpretation:",
      options: ["Metabolic acidosis", "Respiratory acidosis (uncompensated)", "Respiratory alkalosis", "Metabolic alkalosis"],
      correctIndex: 1,
      rationale: "pH low (acidosis), pCO₂ high (respiratory cause), HCO₃⁻ normal/slightly elevated (minimal compensation) = respiratory acidosis. Causes: COPD, hypoventilation, airway obstruction.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "electrolyte panels"
    },
  {
      id: "mlt-080",
      stem: "Ionized calcium is the physiologically active form. What falsely affects total calcium?",
      options: ["Hemolysis", "Hypoalbuminemia (low total Ca but normal ionized Ca)", "Lipemia", "Heparin anticoagulant"],
      correctIndex: 1,
      rationale: "~45% of total calcium is bound to albumin. Hypoalbuminemia → low total Ca but normal ionized (free) Ca. Corrected Ca = measured Ca + 0.8 × (4.0 − albumin). Ionized Ca is gold standard.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "electrolyte panels"
    },
  {
      id: "mlt-081",
      stem: "Osmolal gap = measured osmolality − calculated osmolality. An elevated osmolal gap suggests:",
      options: ["Normal state", "Ingestion of unmeasured osmoles (ethanol, methanol, ethylene glycol)", "Dehydration only", "Hypernatremia"],
      correctIndex: 1,
      rationale: "Calculated osmolality = 2Na + Glucose/18 + BUN/2.8. If measured exceeds calculated by >10, unmeasured osmoles present (alcohols, mannitol).",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "electrolyte panels"
    },
  {
      id: "mlt-082",
      stem: "A patient has ALT 450 U/L, AST 380 U/L, ALP 95 U/L, total bilirubin 2.8 mg/dL. This pattern suggests:",
      options: ["Obstructive (cholestatic) liver disease", "Hepatocellular damage (hepatitis pattern)", "Bone disease", "Normal liver function"],
      correctIndex: 1,
      rationale: "Markedly elevated ALT/AST with relatively normal ALP = hepatocellular injury (viral hepatitis, drug toxicity, ischemia). ALT is more specific for liver. Cholestatic disease shows elevated ALP/GGT with mild ALT/AST elevation.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "liver function tests"
    },
  {
      id: "mlt-083",
      stem: "Elevated ALP with elevated GGT. This combination indicates the ALP source is:",
      options: ["Bone", "Liver/biliary", "Intestinal", "Placental"],
      correctIndex: 1,
      rationale: "GGT is elevated in liver/biliary disease but NOT in bone disease. If ALP and GGT are both elevated, the ALP is hepatobiliary in origin. If ALP elevated but GGT normal, suspect bone source (Paget's, fracture healing, growing child).",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "liver function tests"
    },
  {
      id: "mlt-084",
      stem: "Direct (conjugated) bilirubin is 8.5 mg/dL, total bilirubin 10.2 mg/dL. This pattern indicates:",
      options: ["Hemolytic anemia (pre-hepatic)", "Obstructive jaundice (post-hepatic)", "Gilbert syndrome", "Physiologic neonatal jaundice"],
      correctIndex: 1,
      rationale: "Predominantly direct (conjugated) hyperbilirubinemia = post-hepatic obstruction (gallstones, pancreatic head tumor, cholangiocarcinoma). Pre-hepatic causes (hemolysis) predominantly elevate indirect (unconjugated) bilirubin.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "liver function tests"
    },
  {
      id: "mlt-085",
      stem: "Which enzyme is most specific for liver damage?",
      options: ["ALP", "AST", "ALT", "CK"],
      correctIndex: 2,
      rationale: "ALT (alanine aminotransferase/SGPT) is most specific for liver — found primarily in hepatocytes. AST is also in heart, muscle, brain, kidney. ALT is preferred marker for hepatocellular injury.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "liver function tests"
    },
  {
      id: "mlt-086",
      stem: "AST/ALT ratio >2:1 suggests:",
      options: ["Viral hepatitis", "Alcoholic liver disease", "Drug-induced hepatitis", "Autoimmune hepatitis"],
      correctIndex: 1,
      rationale: "De Ritis ratio (AST/ALT >2:1) suggests alcoholic hepatitis. Alcohol damages mitochondria (where mitochondrial AST is located) and pyridoxal phosphate deficiency decreases ALT production. Viral hepatitis typically shows ALT > AST.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "liver function tests"
    },
  {
      id: "mlt-087",
      stem: "Which cardiac biomarker rises first after acute MI?",
      options: ["Troponin I/T", "CK-MB", "Myoglobin", "BNP"],
      correctIndex: 2,
      rationale: "Myoglobin rises first (1-3 hours) but is not cardiac-specific (also in skeletal muscle). Troponin rises at 3-6 hours and is the preferred marker. CK-MB rises at 4-6 hours. BNP is for heart failure, not MI.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "cardiac biomarkers"
    },
  {
      id: "mlt-088",
      stem: "High-sensitivity troponin I is elevated at 8 hours post-chest pain onset. CK-MB is also elevated. This confirms:",
      options: ["Skeletal muscle injury", "Acute myocardial infarction", "Rhabdomyolysis", "Heart failure"],
      correctIndex: 1,
      rationale: "Troponin I is highly specific for myocardial injury. Combined with CK-MB elevation and clinical symptoms, this confirms acute MI. Serial troponins showing rise and/or fall pattern are diagnostic.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "cardiac biomarkers"
    },
  {
      id: "mlt-089",
      stem: "BNP (B-type natriuretic peptide) is used primarily for:",
      options: ["Diagnosing MI", "Diagnosing and monitoring heart failure", "Detecting arrhythmias", "Monitoring warfarin therapy"],
      correctIndex: 1,
      rationale: "BNP and NT-proBNP are released by ventricular myocytes in response to volume overload/stretching. Used for diagnosis and monitoring of congestive heart failure. Not specific for MI.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "cardiac biomarkers"
    },
  {
      id: "mlt-090",
      stem: "Creatinine is preferred over BUN for GFR estimation because:",
      options: ["Creatinine is produced at a variable rate", "Creatinine production is relatively constant and less affected by diet and hydration", "BUN is more sensitive", "Creatinine is easier to measure"],
      correctIndex: 1,
      rationale: "Creatinine is a breakdown product of muscle creatine phosphate, produced at a relatively constant rate. BUN is affected by protein intake, dehydration, GI bleeding, liver function, and catabolic states — less specific for kidney function.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "renal function tests"
    },
  {
      id: "mlt-091",
      stem: "BUN 45 mg/dL, creatinine 1.2 mg/dL. BUN/creatinine ratio is 37.5. This suggests:",
      options: ["Renal failure", "Pre-renal azotemia (dehydration, GI bleeding, high protein diet)", "Post-renal obstruction", "Normal"],
      correctIndex: 1,
      rationale: "Normal BUN/Cr ratio is 10-20:1. Elevated ratio (>20:1) with normal creatinine suggests pre-renal causes: dehydration, GI bleeding (digested blood → elevated BUN), or high protein intake. Renal failure elevates both proportionally.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "renal function tests"
    },
  {
      id: "mlt-092",
      stem: "Microalbuminuria (30-300 mg/day) in a diabetic patient indicates:",
      options: ["Normal kidney function", "Early diabetic nephropathy — need for ACE inhibitor therapy", "End-stage renal disease", "Urinary tract infection"],
      correctIndex: 1,
      rationale: "Microalbuminuria is the earliest marker of diabetic nephropathy, indicating glomerular damage before clinical proteinuria appears. ACE inhibitors/ARBs slow progression. Screen annually in diabetics.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "renal function tests"
    },
  {
      id: "mlt-093",
      stem: "Cystatin C as a GFR marker advantage over creatinine:",
      options: ["Not affected by muscle mass, age, sex, or diet", "Cheaper to measure", "Available in all laboratories", "More specific for tubular function"],
      correctIndex: 0,
      rationale: "Cystatin C is produced by all nucleated cells at a constant rate, freely filtered by glomerulus, and is not affected by muscle mass. Better GFR estimate in elderly, obese, malnourished, and pediatric patients where creatinine may be misleading.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "renal function tests"
    },
  {
      id: "mlt-094",
      stem: "According to ATP guidelines, desirable LDL-cholesterol is:",
      options: ["<100 mg/dL for high-risk patients", "<200 mg/dL", "<130 mg/dL for all patients", "<50 mg/dL"],
      correctIndex: 0,
      rationale: "LDL targets: <100 for high-risk (CAD, diabetes); optional <70 for very high risk. <130 for moderate risk. <160 for low risk. LDL is the primary treatment target.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "lipid panels"
    },
  {
      id: "mlt-095",
      stem: "Friedewald equation for LDL calculation:",
      options: ["LDL = Total cholesterol − HDL − (Triglycerides/5)", "LDL = HDL + Total cholesterol", "LDL = Triglycerides/HDL", "LDL = Total cholesterol × 0.5"],
      correctIndex: 0,
      rationale: "LDL = TC − HDL − (TG/5). Valid only when TG < 400 mg/dL. When TG ≥ 400, direct LDL measurement required because chylomicrons interfere with VLDL estimation.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "lipid panels"
    },
  {
      id: "mlt-096",
      stem: "A lipid panel shows TG 650 mg/dL. Why can't LDL be calculated?",
      options: ["Friedewald equation invalid when TG ≥ 400 due to inaccurate VLDL estimation", "LDL cannot be measured at all with high TG", "The specimen must be rejected", "HDL is artificially elevated"],
      correctIndex: 0,
      rationale: "Friedewald estimates VLDL as TG/5, which is inaccurate when TG ≥ 400 (chylomicrons and VLDL-remnants alter the TG-to-VLDL relationship). Direct LDL measurement by ultracentrifugation or direct homogeneous assay is needed.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "lipid panels"
    },
  {
      id: "mlt-097",
      stem: "TSH is elevated, free T4 is low. This pattern indicates:",
      options: ["Hyperthyroidism", "Primary hypothyroidism", "Secondary (pituitary) hypothyroidism", "Euthyroid sick syndrome"],
      correctIndex: 1,
      rationale: "High TSH + low freeT4 = primary hypothyroidism (thyroid gland failure). Pituitary tries to stimulate failing thyroid by increasing TSH. Secondary hypothyroidism shows low TSH + low T4 (pituitary failure).",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "endocrine testing"
    },
  {
      id: "mlt-098",
      stem: "TSH is suppressed (<0.01), free T4 is elevated. This indicates:",
      options: ["Hypothyroidism", "Hyperthyroidism (Graves' disease, toxic nodule)", "Normal thyroid function", "Central hypothyroidism"],
      correctIndex: 1,
      rationale: "Low TSH + high free T4 = hyperthyroidism. TSH is suppressed by negative feedback from excess thyroid hormones. Causes: Graves' disease, toxic multinodular goiter, thyroiditis.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "endocrine testing"
    },
  {
      id: "mlt-099",
      stem: "The best initial screening test for thyroid function is:",
      options: ["Free T4", "Free T3", "TSH", "Thyroid antibodies"],
      correctIndex: 2,
      rationale: "TSH is the most sensitive screening test for thyroid dysfunction. It changes before T4/T3 levels become abnormal. Reflex testing: if TSH abnormal → check free T4.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "endocrine testing"
    },
  {
      id: "mlt-100",
      stem: "Cortisol follows a diurnal pattern. Peak cortisol occurs:",
      options: ["At midnight", "In early morning (6-8 AM)", "In late afternoon", "At random times"],
      correctIndex: 1,
      rationale: "Cortisol peaks at 6-8 AM and reaches nadir around midnight. This diurnal variation must be considered when interpreting results. Loss of diurnal pattern suggests Cushing syndrome.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "endocrine testing"
    },
  {
      id: "mlt-101",
      stem: "CK-MB is elevated but total CK is normal. This could indicate:",
      options: ["Acute MI with small infarct", "Laboratory error — CK-MB cannot exceed total CK", "Macro-CK (CK-BB/immunoglobulin complex)", "Rhabdomyolysis"],
      correctIndex: 2,
      rationale: "CK-MB greater than total CK is usually a macro-CK — an immunoglobulin-CK complex that interferes with the CK-MB immunoassay. It is a benign finding but can cause false MI diagnosis. Electrophoresis can confirm macro-CK.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "enzyme assays"
    },
  {
      id: "mlt-102",
      stem: "Which isoenzyme pattern indicates liver damage? LD isoenzymes show:",
      options: ["LD1 > LD2 (flipped pattern)", "LD5 > LD4 elevated", "LD3 elevated", "All isoenzymes equally elevated"],
      correctIndex: 1,
      rationale: "LD5 predominates in liver and skeletal muscle. LD5 elevation = hepatic damage. LD1 > LD2 (flipped ratio) = cardiac damage (MI) or hemolytic anemia. LD3 = pulmonary.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "enzyme assays"
    },
  {
      id: "mlt-103",
      stem: "Amylase and lipase are both elevated. Lipase remains elevated longer. This pattern suggests:",
      options: ["Pancreatitis — lipase is more specific and has longer elevation", "Salivary gland disease", "Macroamylasemia", "Renal failure"],
      correctIndex: 0,
      rationale: "In acute pancreatitis, both amylase and lipase rise. Amylase rises first (2-12 hrs) but returns to normal in 3-5 days. Lipase rises slightly later but stays elevated 7-14 days. Lipase is more specific for pancreas (amylase also from salivary glands).",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "enzyme assays"
    },
  {
      id: "mlt-104",
      stem: "pH 7.48, pCO₂ 30, HCO₃⁻ 22. Interpretation:",
      options: ["Respiratory acidosis", "Respiratory alkalosis (acute)", "Metabolic alkalosis", "Metabolic acidosis"],
      correctIndex: 1,
      rationale: "pH high (alkalosis), pCO₂ low (respiratory cause = hyperventilation), HCO₃⁻ normal = acute respiratory alkalosis. Causes: anxiety, pain, early PE, mechanical over-ventilation.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "arterial blood gases"
    },
  {
      id: "mlt-105",
      stem: "pH 7.32, pCO₂ 40, HCO₃⁻ 18. Anion gap 18. Interpretation:",
      options: ["Respiratory acidosis", "Metabolic acidosis with elevated anion gap", "Respiratory alkalosis", "Mixed disorder"],
      correctIndex: 1,
      rationale: "pH low (acidosis), normal pCO₂, low HCO₃⁻ = metabolic acidosis. Elevated anion gap (normal 8-12) indicates unmeasured anions: lactic acidosis, DKA, uremia, toxins (MUDPILES mnemonic).",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "arterial blood gases"
    },
  {
      id: "mlt-106",
      stem: "An ABG specimen should be analyzed within:",
      options: ["1 hour at room temperature", "30 minutes (or on ice to delay metabolism)", "4 hours", "24 hours if refrigerated"],
      correctIndex: 1,
      rationale: "Cells in whole blood continue to metabolize: consuming O₂ (↓pO₂), producing CO₂ (↑pCO₂), and producing lactate (↓pH). Analyze within 30 min at RT or place on ice (delays metabolism up to 1-2 hours).",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "arterial blood gases"
    },
  {
      id: "mlt-107",
      stem: "The Henderson-Hasselbalch equation relates pH to which ratio?",
      options: ["pCO₂/HCO₃⁻", "HCO₃⁻/pCO₂ (bicarbonate to carbonic acid ratio)", "Na⁺/K⁺", "Cl⁻/HCO₃⁻"],
      correctIndex: 1,
      rationale: "pH = 6.1 + log([HCO₃⁻]/[0.03 × pCO₂]). Normal ratio ~20:1 maintains pH 7.4. Metabolic disorders affect numerator; respiratory disorders affect denominator.",
      difficulty: 1,
      category: "Clinical Chemistry",
      topic: "arterial blood gases"
    },
  {
      id: "mlt-108",
      stem: "Phenytoin level is 8 µg/mL (therapeutic 10-20) in a patient with albumin 2.0 g/dL. The adjusted level:",
      options: ["Remains 8 — no adjustment needed", "Is approximately 14 µg/mL — clinically therapeutic", "Is below 5 — subtherapeutic", "Cannot be calculated"],
      correctIndex: 1,
      rationale: "Phenytoin is ~90% protein-bound. Low albumin → more free drug. Adjusted phenytoin = measured/(0.2 × albumin + 0.1) = 8/(0.2×2+0.1) = 8/0.5 = 16. Patient has therapeutic free drug level despite seemingly low total.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "therapeutic drug monitoring"
    },
  {
      id: "mlt-109",
      stem: "Trough levels for aminoglycosides (gentamicin) should be drawn:",
      options: ["Immediately after infusion", "30 minutes before next dose (at the lowest concentration)", "At peak concentration", "At random times"],
      correctIndex: 1,
      rationale: "Trough = drawn just before next dose (lowest point). Peak = 30-60 min after IV infusion. Troughs monitor toxicity (nephrotoxicity); peaks monitor efficacy.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "therapeutic drug monitoring"
    },
  {
      id: "mlt-110",
      stem: "Which drug requires monitoring because of its narrow therapeutic index and risk of toxicity?",
      options: ["Acetaminophen at therapeutic doses", "Digoxin", "Ibuprofen", "Omeprazole"],
      correctIndex: 1,
      rationale: "Digoxin has a narrow therapeutic range (0.8-2.0 ng/mL). Toxicity causes cardiac arrhythmias, nausea, visual disturbances. Renal impairment and hypokalemia increase toxicity risk.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "therapeutic drug monitoring"
    },
  {
      id: "mlt-111",
      stem: "Serum protein electrophoresis shows a sharp, tall peak in the gamma region (M-spike). This suggests:",
      options: ["Normal polyclonal response to infection", "Monoclonal gammopathy (multiple myeloma, MGUS, Waldenström)", "Nephrotic syndrome", "Liver cirrhosis"],
      correctIndex: 1,
      rationale: "A monoclonal spike (M-spike) = single clone of plasma cells producing identical immunoglobulin. Multiple myeloma is the most concerning diagnosis. MGUS is benign but requires monitoring. Polyclonal elevation (broad gamma) = reactive/infectious.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-112",
      stem: "A patient has very low total protein with a markedly decreased albumin band on SPEP, but elevated alpha-2 globulin. This pattern is seen in:",
      options: ["Multiple myeloma", "Nephrotic syndrome", "Liver cirrhosis", "Chronic inflammation"],
      correctIndex: 1,
      rationale: "Nephrotic syndrome: massive albumin loss in urine → low albumin. Alpha-2 macroglobulin is too large to be lost → elevated alpha-2 band. This is a classic SPEP pattern.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-113",
      stem: "Elevated serum osmolality with clinical intoxication. Measured osmolality is 340, calculated is 295. Osmolal gap is 45. Most likely ingestion:",
      options: ["Aspirin", "Ethylene glycol or methanol", "Acetaminophen", "Opioids"],
      correctIndex: 1,
      rationale: "Osmolal gap >10 suggests unmeasured osmotically active substances: methanol, ethylene glycol, ethanol, isopropanol. These alcohols increase measured but not calculated osmolality. Ethylene glycol also causes oxalate crystals in urine.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-114",
      stem: "A critically ill ICU patient has capillary (POC) glucose 65 mg/dL but plasma glucose from central lab is 92 mg/dL. Explanation:",
      options: ["POC meters are more accurate", "Peripheral vasoconstriction and poor perfusion cause falsely low capillary readings", "The lab result is wrong", "Both are accurate — glucose varies this much"],
      correctIndex: 1,
      rationale: "In critically ill patients with poor peripheral perfusion (shock, vasopressors, hypothermia), capillary samples poorly reflect arterial/venous glucose. POC meters may read 20-30% lower. Lab plasma glucose from venipuncture is more reliable in these patients.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "glucose testing"
    },
  {
      id: "mlt-115",
      stem: "A phosphorus level of 1.5 mg/dL (low) with calcium 11.2 mg/dL (high). Most likely cause:",
      options: ["Hypoparathyroidism", "Primary hyperparathyroidism", "Vitamin D deficiency", "Renal failure"],
      correctIndex: 1,
      rationale: "PTH increases calcium (bone resorption + renal reabsorption) while decreasing phosphorus (renal excretion). High Ca + low phos = hyperparathyroidism. Hypoparathyroidism shows low Ca + high phos.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "electrolyte panels"
    },
  {
      id: "mlt-116",
      stem: "Magnesium 1.0 mEq/L (low). Which other electrolyte abnormality is commonly associated?",
      options: ["Hypernatremia", "Hypokalemia (refractory to potassium replacement)", "Hyperchloremia", "Hypercalcemia"],
      correctIndex: 1,
      rationale: "Hypomagnesemia causes renal potassium wasting and refractory hypokalemia — potassium cannot be adequately repleted until magnesium is corrected. Always check magnesium when treating hypokalemia.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "electrolyte panels"
    },
  {
      id: "mlt-117",
      stem: "PSA (prostate-specific antigen) >4.0 ng/mL. Important consideration:",
      options: ["PSA >4 always means cancer", "Elevated PSA can be from BPH, prostatitis, or cancer — not specific for malignancy", "PSA is only elevated in metastatic disease", "PSA is a tumor marker for all cancers"],
      correctIndex: 1,
      rationale: "PSA is organ-specific (prostate) but not cancer-specific. BPH, prostatitis, ejaculation, digital rectal exam, and prostate biopsy can elevate PSA. Free PSA/total PSA ratio helps: lower ratio = higher cancer risk.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "enzyme assays"
    },
  {
      id: "mlt-118",
      stem: "Elevated uric acid (9.5 mg/dL) is associated with:",
      options: ["Hypothyroidism", "Gout, renal disease, tumor lysis syndrome, Lesch-Nyhan", "Liver failure", "Iron deficiency"],
      correctIndex: 1,
      rationale: "Hyperuricemia causes: decreased excretion (renal disease, thiazides), increased production (gout, tumor lysis, Lesch-Nyhan, myeloproliferative disorders). Uric acid crystals precipitate in joints (gout) and kidneys.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-119",
      stem: "A specimen collected in a plain red-top tube for potassium shows K⁺ 5.8 mEq/L. A simultaneously drawn green-top (heparin) shows K⁺ 4.2 mEq/L. Explanation:",
      options: ["The green top is hemolyzed", "Serum K⁺ is higher than plasma K⁺ due to platelet release during clotting", "The red top was contaminated", "Laboratory error"],
      correctIndex: 1,
      rationale: "During clot formation, platelets release intracellular potassium, making serum K⁺ 0.1-0.7 mEq/L higher than plasma K⁺. This is more pronounced with thrombocytosis. Plasma (heparin tube) is the more accurate specimen for potassium in patients with high platelet counts.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-120",
      stem: "Elevated GGT without other liver enzyme abnormalities suggests:",
      options: ["Acute hepatitis", "Alcohol use or enzyme-inducing drug exposure", "Bone disease", "Heart failure"],
      correctIndex: 1,
      rationale: "GGT is a sensitive but non-specific marker. Isolated GGT elevation often indicates alcohol use, enzyme-inducing medications (phenytoin, barbiturates), or early liver disease. It helps confirm liver origin of elevated ALP.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "liver function tests"
    },
  {
      id: "mlt-121",
      stem: "Ceruloplasmin <15 mg/dL with elevated 24-hour urine copper. Diagnosis:",
      options: ["Hemochromatosis", "Wilson disease", "Menkes syndrome", "Normal copper metabolism"],
      correctIndex: 1,
      rationale: "Wilson disease: autosomal recessive defect in ATP7B copper transporter → decreased ceruloplasmin, elevated free copper, copper accumulation in liver and brain. Kayser-Fleischer rings in eyes. Low ceruloplasmin is the screening test.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-122",
      stem: "Transferrin saturation >45% and elevated ferritin suggest:",
      options: ["Iron deficiency", "Hereditary hemochromatosis", "Anemia of chronic disease", "Lead poisoning"],
      correctIndex: 1,
      rationale: "Hemochromatosis: excessive iron absorption → elevated transferrin saturation (>45%) and ferritin. HFE gene testing (C282Y mutation) confirms. If untreated → cirrhosis, diabetes, cardiomyopathy, joint disease.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-123",
      stem: "A patient on lithium therapy has a level of 2.1 mEq/L (therapeutic 0.6-1.2). What symptoms might present?",
      options: ["No symptoms at this level", "Tremor, confusion, seizures, renal failure (lithium toxicity)", "Improved mood stability", "Mild sedation only"],
      correctIndex: 1,
      rationale: "Lithium toxicity occurs >1.5 mEq/L. Symptoms: tremor, ataxia, confusion, seizures, renal failure. Dehydration and NSAIDs increase toxicity risk. Requires immediate medical intervention.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-124",
      stem: "Chloride 85 mEq/L (low), HCO₃⁻ 38 mEq/L (high), pH 7.52. This represents:",
      options: ["Metabolic acidosis", "Metabolic alkalosis with hypochloremia", "Respiratory alkalosis", "Normal"],
      correctIndex: 1,
      rationale: "Metabolic alkalosis with hypochloremia = contraction alkalosis (from vomiting, diuretics, NG suction). Loss of HCl → low Cl⁻ → kidney retains HCO₃⁻ to maintain electroneutrality → alkalosis.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "electrolyte panels"
    },
  {
      id: "mlt-125",
      stem: "eGFR is 25 mL/min/1.73 m². This represents CKD stage:",
      options: ["Stage 1", "Stage 2", "Stage 3b", "Stage 4"],
      correctIndex: 3,
      rationale: "CKD stages by eGFR: 1 (≥90), 2 (60-89), 3a (45-59), 3b (30-44), 4 (15-29), 5 (<15 or dialysis). eGFR 25 = Stage 4 (severe decrease). Nephrology referral and dialysis planning needed.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "renal function tests"
    },
  {
      id: "mlt-126",
      stem: "Gestational diabetes screening: 50g glucose challenge test at 24-28 weeks. Positive threshold:",
      options: ["≥130 or ≥140 mg/dL at 1 hour (varies by institution)", "≥200 mg/dL at 1 hour", "≥100 mg/dL fasting", "≥180 mg/dL at 2 hours"],
      correctIndex: 0,
      rationale: "1-hour GCT: ≥130 (more sensitive) or ≥140 mg/dL (more specific) = positive screen → follow with 3-hour 100g OGTT for diagnosis. Non-fasting test.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "glucose testing"
    },
  {
      id: "mlt-127",
      stem: "Troponin I is slightly elevated in a patient with CKD and no chest pain. Interpretation:",
      options: ["Definite MI", "Chronic troponin elevation from renal clearance reduction — correlate clinically", "Laboratory error", "Troponin is normal in CKD"],
      correctIndex: 1,
      rationale: "CKD patients may have chronically elevated troponin (especially hs-TnT) from reduced clearance and chronic myocardial stress. For MI diagnosis, look for a rise-and-fall pattern (delta change). A stable baseline elevation without clinical symptoms is not diagnostic of acute MI.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "cardiac biomarkers"
    },
  {
      id: "mlt-128",
      stem: "HbA1c cannot reliably assess glucose control in patients with:",
      options: ["Type 2 diabetes", "Hemolytic anemia or hemoglobinopathies (altered RBC lifespan)", "Hypertension", "Obesity"],
      correctIndex: 1,
      rationale: "HbA1c depends on RBC lifespan (~120 days). Conditions altering RBC survival affect results: hemolysis (falsely low — shorter lifespan), transfusions, sickle cell disease, thalassemia. Fructosamine (2-3 week average) is alternative.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-129",
      stem: "Sodium 155 mEq/L with serum osmolality 320. Most likely cause:",
      options: ["SIADH", "Dehydration (water deficit)", "Addison disease", "Excessive IV normal saline"],
      correctIndex: 1,
      rationale: "Hypernatremia with hyperosmolality = water deficit (dehydration). Causes: inadequate water intake, diabetes insipidus, excessive water losses. Brain cells are most affected.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "electrolyte panels"
    },
  {
      id: "mlt-130",
      stem: "PT is prolonged in liver disease because the liver produces:",
      options: ["Only factor VII", "Most clotting factors (II, V, VII, IX, X, fibrinogen)", "Only fibrinogen", "Vitamin K"],
      correctIndex: 1,
      rationale: "The liver synthesizes most coagulation factors including I (fibrinogen), II, V, VII, IX, X, XI, XIII, plus proteins C, S, and antithrombin. Severe liver disease → reduced factor production → prolonged PT (VII first affected due to short half-life).",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "liver function tests"
    },
  {
      id: "mlt-131",
      stem: "Total CO₂ on a BMP is essentially the same as:",
      options: ["pCO₂", "Serum bicarbonate (HCO₃⁻)", "Dissolved CO₂", "Carbonic acid"],
      correctIndex: 1,
      rationale: "Total CO₂ on a chemistry panel = primarily bicarbonate (~95%) plus dissolved CO₂ and carbonic acid. It approximates serum HCO₃⁻ and is used as a surrogate for acid-base status on a BMP.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "electrolyte panels"
    },
  {
      id: "mlt-132",
      stem: "Vancomycin trough level is 22 µg/mL (target 15-20 for serious infections). Action:",
      options: ["Continue current dose", "Consider dose reduction — risk of nephrotoxicity", "Increase the dose", "Change to a different antibiotic"],
      correctIndex: 1,
      rationale: "Vancomycin troughs >20 µg/mL increase nephrotoxicity risk. Dose adjustment needed. AUC/MIC monitoring (target 400-600) is increasingly preferred over trough-based monitoring for efficacy and safety.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "therapeutic drug monitoring"
    },
  {
      id: "mlt-133",
      stem: "AFP (alpha-fetoprotein) is elevated in maternal serum. This can indicate:",
      options: ["Normal pregnancy", "Neural tube defect (spina bifida, anencephaly) or multiple gestation", "Down syndrome", "Gestational diabetes"],
      correctIndex: 1,
      rationale: "Elevated maternal AFP: open neural tube defects, ventral wall defects (omphalocele, gastroschisis), multiple gestation, incorrect dating. Low AFP: associated with Down syndrome and trisomy 18. Part of quad screen.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-134",
      stem: "CK isoenzymes: CK-MM source is ___; CK-MB source is ___; CK-BB source is ___:",
      options: ["Liver; heart; brain", "Skeletal muscle; cardiac muscle; brain/smooth muscle", "Brain; muscle; liver", "Heart; skeletal muscle; lung"],
      correctIndex: 1,
      rationale: "CK-MM = skeletal muscle (95-100% of serum CK). CK-MB = cardiac muscle (also small amount in skeletal). CK-BB = brain and smooth muscle (normally not in serum). CK-MB >5% of total CK suggests cardiac origin.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "enzyme assays"
    },
  {
      id: "mlt-135",
      stem: "Fasting glucose specimen preferred anticoagulant:",
      options: ["EDTA (lavender top)", "NaF/oxalate (gray top)", "Heparin (green top)", "None (red top serum)"],
      correctIndex: 1,
      rationale: "Gray top (NaF/oxalate) inhibits glycolysis by blocking enolase. Prevents glucose loss during transport. Glucose decreases ~5-7% per hour in plain tubes at room temperature.",
      difficulty: 1,
      category: "Clinical Chemistry",
      topic: "glucose testing"
    },
  {
      id: "mlt-136",
      stem: "Troponin is normal but CK is markedly elevated (15,000 U/L) with myoglobinuria. Diagnosis:",
      options: ["Acute MI", "Rhabdomyolysis", "Heart failure", "Liver disease"],
      correctIndex: 1,
      rationale: "Massively elevated CK (>10,000) with normal troponin + myoglobinuria = rhabdomyolysis (skeletal muscle destruction). Causes: crush injury, statins, seizures, extreme exercise. Risk of acute kidney injury from myoglobin.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "electrolyte panels"
    },
  {
      id: "mlt-137",
      stem: "Serum creatinine in a muscular 25-year-old bodybuilder may be:",
      options: ["Falsely low due to muscle mass", "Higher than reference range without kidney disease", "Unaffected by muscle mass", "Lower than in elderly patients"],
      correctIndex: 1,
      rationale: "Creatinine is a product of muscle creatine metabolism. More muscle = higher baseline creatinine. A muscular person may have creatinine above the reference range without kidney disease. Cystatin C is muscle-mass-independent alternative.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "renal function tests"
    },
  {
      id: "mlt-138",
      stem: "Elevated homocysteine is a risk factor for:",
      options: ["Diabetes", "Cardiovascular disease and thrombosis", "Liver disease", "Hypokalemia"],
      correctIndex: 1,
      rationale: "Elevated homocysteine is an independent risk factor for CVD, stroke, and VTE. Caused by B12 deficiency, folate deficiency, B6 deficiency, and genetic defects (MTHFR). Supplementation with B-vitamins can lower levels.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-139",
      stem: "Gram-positive cocci in clusters on Gram stain from a wound abscess. Most likely organism:",
      options: ["Streptococcus pyogenes", "Staphylococcus aureus", "Escherichia coli", "Pseudomonas aeruginosa"],
      correctIndex: 1,
      rationale: "Staph aureus = gram-positive cocci in clusters (grape-like). Streptococci form chains. S. aureus is catalase-positive and coagulase-positive, distinguishing it from coagulase-negative staphylococci.",
      difficulty: 1,
      category: "Microbiology",
      topic: "gram stain technique"
    },
  {
      id: "mlt-140",
      stem: "Gram-positive cocci in chains from a throat swab. Catalase negative, beta-hemolytic on BAP. Bacitracin sensitive. Organism:",
      options: ["Staphylococcus aureus", "Streptococcus pyogenes (Group A Strep)", "Enterococcus faecalis", "Streptococcus agalactiae"],
      correctIndex: 1,
      rationale: "GPC in chains + catalase negative = Streptococcus. Beta-hemolytic + bacitracin sensitive = Group A Strep (S. pyogenes). GBS (S. agalactiae) is bacitracin resistant. PYR test also positive for GAS.",
      difficulty: 2,
      category: "Microbiology",
      topic: "gram stain technique"
    },
  {
      id: "mlt-141",
      stem: "Gram-negative diplococci inside neutrophils from urethral discharge. Most likely:",
      options: ["Neisseria meningitidis", "Neisseria gonorrhoeae", "Moraxella catarrhalis", "Haemophilus influenzae"],
      correctIndex: 1,
      rationale: "Intracellular GN diplococci (kidney-bean shaped) in urethral PMNs = N. gonorrhoeae until proven otherwise. Oxidase positive, grows on chocolate/Thayer-Martin agar.",
      difficulty: 2,
      category: "Microbiology",
      topic: "gram stain technique"
    },
  {
      id: "mlt-142",
      stem: "A blood culture grows gram-negative rods. Oxidase positive, non-lactose fermenter on MAC, produces green pigment and grape-like odor. Organism:",
      options: ["E. coli", "Klebsiella pneumoniae", "Pseudomonas aeruginosa", "Proteus mirabilis"],
      correctIndex: 2,
      rationale: "Pseudomonas: oxidase+, non-lactose fermenter, green pigment (pyocyanin + pyoverdin), grape-like odor, obligate aerobe. Important nosocomial pathogen. Intrinsically resistant to many antibiotics.",
      difficulty: 2,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-143",
      stem: "Lactose-fermenting, mucoid colonies on MacConkey agar from a sputum culture. Organism:",
      options: ["Pseudomonas aeruginosa", "Klebsiella pneumoniae", "Proteus mirabilis", "Salmonella"],
      correctIndex: 1,
      rationale: "Klebsiella: lactose fermenter (pink on MAC), mucoid colonies (thick polysaccharide capsule), non-motile, urease positive. Common cause of UTI, pneumonia (especially in alcoholics — 'currant jelly' sputum).",
      difficulty: 2,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-144",
      stem: "A stool culture on MAC agar shows non-lactose-fermenting colonies. TSI shows alkaline slant/acid butt with H₂S (black precipitate) and no gas. Organism:",
      options: ["E. coli", "Salmonella species", "Shigella species", "Klebsiella"],
      correctIndex: 1,
      rationale: "Salmonella: NLF on MAC, TSI K/A with H₂S and no gas (usually). Shigella is also NLF but does NOT produce H₂S. Both are non-lactose fermenters, but H₂S production distinguishes Salmonella.",
      difficulty: 3,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-145",
      stem: "Swarming motility covering the entire BAP surface. Urease positive. Organism:",
      options: ["E. coli", "Proteus mirabilis", "Pseudomonas", "Klebsiella"],
      correctIndex: 1,
      rationale: "Proteus mirabilis: characteristic swarming motility on BAP (waves across plate), urease positive (rapid), H₂S positive on TSI. Common UTI pathogen. Associated with struvite kidney stones (alkaline urine from urease).",
      difficulty: 2,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-146",
      stem: "MRSA is resistant to methicillin because of:",
      options: ["Beta-lactamase production", "Altered PBP (PBP2a) encoded by mecA gene", "Efflux pumps", "Biofilm formation"],
      correctIndex: 1,
      rationale: "MRSA has mecA gene encoding PBP2a (penicillin-binding protein 2a) with low affinity for beta-lactams. Resistant to ALL beta-lactams (penicillins, cephalosporins, carbapenems). Treat with vancomycin, daptomycin, or linezolid.",
      difficulty: 3,
      category: "Microbiology",
      topic: "antimicrobial resistance"
    },
  {
      id: "mlt-147",
      stem: "ESBL-producing E. coli is resistant to:",
      options: ["Carbapenems", "Third-generation cephalosporins and penicillins", "Aminoglycosides only", "Vancomycin"],
      correctIndex: 1,
      rationale: "ESBLs (extended-spectrum beta-lactamases) hydrolyze 3rd-gen cephalosporins (ceftriaxone, ceftazidime) and aztreonam. NOT effective against carbapenems — carbapenems are treatment of choice for serious ESBL infections.",
      difficulty: 2,
      category: "Microbiology",
      topic: "antimicrobial resistance"
    },
  {
      id: "mlt-148",
      stem: "VRE (vancomycin-resistant enterococcus) has vanA gene. What does this encode?",
      options: ["Altered cell wall precursor (D-Ala-D-Lac instead of D-Ala-D-Ala)", "Beta-lactamase", "Efflux pump", "Porin mutation"],
      correctIndex: 0,
      rationale: "vanA encodes enzymes that change the cell wall peptidoglycan precursor terminal from D-Ala-D-Ala to D-Ala-D-Lac. Vancomycin normally binds D-Ala-D-Ala; the altered target has 1000-fold reduced affinity. Treatment: linezolid, daptomycin.",
      difficulty: 3,
      category: "Microbiology",
      topic: "antimicrobial resistance"
    },
  {
      id: "mlt-149",
      stem: "Optochin-sensitive, bile-soluble, alpha-hemolytic gram-positive diplococci. Organism:",
      options: ["Streptococcus pneumoniae", "Viridans group streptococci", "Enterococcus", "Staphylococcus epidermidis"],
      correctIndex: 0,
      rationale: "S. pneumoniae: alpha-hemolytic, optochin-sensitive (zone ≥14mm), bile-soluble, quellung reaction positive. Viridans strep is optochin-resistant and bile-insoluble — key differentiation.",
      difficulty: 2,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-150",
      stem: "A CSF Gram stain shows gram-positive short rods (coccobacilli) in a neonate with meningitis. Organism:",
      options: ["Streptococcus agalactiae", "Listeria monocytogenes", "Haemophilus influenzae", "E. coli"],
      correctIndex: 1,
      rationale: "Listeria: GP short rods/coccobacilli. Causes neonatal meningitis (along with GBS and E. coli). Tumbling motility at 25°C, beta-hemolytic on BAP. Key: grows at 4°C (cold enrichment). Important in immunocompromised and pregnant patients.",
      difficulty: 3,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-151",
      stem: "Acid-fast bacilli (AFB) on Ziehl-Neelsen stain from sputum. This indicates possible:",
      options: ["Staphylococcus infection", "Mycobacterium tuberculosis or non-tuberculous mycobacteria", "Streptococcus pneumoniae", "Pseudomonas aeruginosa"],
      correctIndex: 1,
      rationale: "AFB staining (carbol fuchsin, heat, acid-alcohol decolorization) identifies mycobacteria. The mycolic acid cell wall resists decolorization. AFB+ sputum = possible TB or NTM. Culture on Löwenstein-Jensen or BACTEC confirms.",
      difficulty: 2,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-152",
      stem: "KOH preparation of a skin scraping shows septate hyphae with 45° branching. Most likely:",
      options: ["Mucor (Rhizopus)", "Aspergillus species", "Candida albicans", "Cryptococcus neoformans"],
      correctIndex: 1,
      rationale: "Aspergillus: septate hyphae with acute-angle (45°/dichotomous) branching. Mucor/Rhizopus has wide, pauciseptate (few septa) hyphae with 90° branching. This distinction is clinically important.",
      difficulty: 2,
      category: "Microbiology",
      topic: "mycology"
    },
  {
      id: "mlt-153",
      stem: "India ink preparation of CSF shows encapsulated yeast. Organism:",
      options: ["Candida albicans", "Cryptococcus neoformans", "Histoplasma capsulatum", "Aspergillus"],
      correctIndex: 1,
      rationale: "Cryptococcus: encapsulated yeast visualized by India ink (capsule appears as clear halo). Causes meningitis in immunocompromised (HIV/AIDS). Cryptococcal antigen (CrAg) test is more sensitive than India ink.",
      difficulty: 2,
      category: "Microbiology",
      topic: "mycology"
    },
  {
      id: "mlt-154",
      stem: "O&P exam of stool shows oval eggs with lateral spine. Parasite:",
      options: ["Schistosoma mansoni", "Schistosoma haematobium", "Ascaris lumbricoides", "Enterobius vermicularis"],
      correctIndex: 0,
      rationale: "S. mansoni = lateral spine. S. haematobium = terminal spine (found in urine). S. japonicum = small lateral knob/no visible spine. The spine orientation is the key identification feature.",
      difficulty: 2,
      category: "Microbiology",
      topic: "parasitology"
    },
  {
      id: "mlt-155",
      stem: "Thick and thin blood films for malaria. The thick film is used for:",
      options: ["Species identification", "Detection of parasites (screening — higher sensitivity)", "Determining parasitemia percentage", "Identifying gametocytes"],
      correctIndex: 1,
      rationale: "Thick film: concentrated blood, no fixation, RBCs lysed → more blood volume examined per field → higher sensitivity for detecting parasites. Thin film: fixed, intact RBCs → species identification and parasitemia calculation.",
      difficulty: 3,
      category: "Microbiology",
      topic: "parasitology"
    },
  {
      id: "mlt-156",
      stem: "CAMP test positive, bacitracin resistant, hippurate hydrolysis positive beta-hemolytic streptococcus. Group:",
      options: ["Group A (S. pyogenes)", "Group B (S. agalactiae)", "Group D (Enterococcus)", "Viridans streptococci"],
      correctIndex: 1,
      rationale: "GBS (S. agalactiae): CAMP+, bacitracin resistant, hippurate+. Key neonatal pathogen. GAS: CAMP−, bacitracin sensitive, PYR+. CAMP test: enhanced hemolysis near S. aureus beta-lysin streak (arrowhead pattern).",
      difficulty: 2,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-157",
      stem: "An oxidase-positive gram-negative rod is isolated from a wound. Oxidase test uses which reagent?",
      options: ["Hydrogen peroxide", "Tetramethyl-p-phenylenediamine (turns purple when oxidized)", "Kovac's reagent", "Alpha-naphthol"],
      correctIndex: 1,
      rationale: "Oxidase test detects cytochrome c oxidase. Tetramethyl-p-phenylenediamine is oxidized to form a purple/dark blue color within 10-30 seconds. Pseudomonas, Neisseria, Campylobacter are oxidase+. Enterobacteriaceae are oxidase−.",
      difficulty: 2,
      category: "Microbiology",
      topic: "biochemical tests"
    },
  {
      id: "mlt-158",
      stem: "Catalase test: 3% H₂O₂ on colony produces bubbles. This distinguishes:",
      options: ["Staphylococcus (positive) from Streptococcus (negative)", "E. coli from Klebsiella", "Salmonella from Shigella", "Pseudomonas from Acinetobacter"],
      correctIndex: 0,
      rationale: "Catalase breaks H₂O₂ → O₂ + H₂O (bubbles). Staph = catalase+; Strep = catalase−. First step in GPC identification algorithm.",
      difficulty: 1,
      category: "Microbiology",
      topic: "biochemical tests"
    },
  {
      id: "mlt-159",
      stem: "Coagulase test differentiates:",
      options: ["S. aureus (positive) from coagulase-negative staphylococci", "Streptococcus from Enterococcus", "E. coli from Klebsiella", "Neisseria meningitidis from N. gonorrhoeae"],
      correctIndex: 0,
      rationale: "S. aureus is coagulase-positive (bound and free coagulase). CoNS (S. epidermidis, S. saprophyticus) are coagulase-negative. Slide coagulase (clumping factor) and tube coagulase (free coagulase) are used.",
      difficulty: 2,
      category: "Microbiology",
      topic: "biochemical tests"
    },
  {
      id: "mlt-160",
      stem: "Double zone of hemolysis (inner complete, outer partial) on BAP. Organism:",
      options: ["Streptococcus pneumoniae", "Clostridium perfringens", "Staphylococcus aureus", "Pseudomonas aeruginosa"],
      correctIndex: 1,
      rationale: "C. perfringens produces alpha-toxin (lecithinase) causing inner beta-hemolysis and theta-toxin causing outer alpha-hemolysis = double-zone. Also: large, flat, spreading colonies, non-motile, box-car shaped GP rods.",
      difficulty: 2,
      category: "Microbiology",
      topic: "colony morphology"
    },
  {
      id: "mlt-161",
      stem: "A chocolate agar culture grows small colonies requiring factors X (hemin) and V (NAD). Gram stain shows small GN coccobacilli. Organism:",
      options: ["Neisseria meningitidis", "Haemophilus influenzae", "Bordetella pertussis", "Brucella"],
      correctIndex: 1,
      rationale: "H. influenzae requires both X and V factors. Grows on chocolate agar (heated blood releases X and V) but not BAP (intact RBCs don't release V). Satelliting around S. aureus on BAP (staph produces V factor). Common respiratory pathogen.",
      difficulty: 3,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-162",
      stem: "Selective medium for isolating enteric pathogens from stool that inhibits most gram-positive organisms:",
      options: ["Blood agar plate (BAP)", "MacConkey agar", "Chocolate agar", "Sabouraud dextrose agar"],
      correctIndex: 1,
      rationale: "MacConkey agar: selective (bile salts + crystal violet inhibit GP) and differential (lactose + neutral red indicator: LF = pink colonies; NLF = colorless). Primary medium for stool culture.",
      difficulty: 2,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-163",
      stem: "Curved gram-negative rods from a stool culture grow on Campy-BAP at 42°C in microaerophilic conditions. Organism:",
      options: ["E. coli O157:H7", "Campylobacter jejuni", "Salmonella enteritidis", "Vibrio cholerae"],
      correctIndex: 1,
      rationale: "Campylobacter: curved/spiral GN rods (seagull-wing), grows at 42°C (thermophilic), microaerophilic (5% O₂, 10% CO₂). Most common bacterial cause of gastroenteritis worldwide. Oxidase+, catalase+.",
      difficulty: 3,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-164",
      stem: "Zone of inhibition interpretation in disk diffusion (Kirby-Bauer): zone ≥25 mm for a given drug/organism combination is:",
      options: ["Resistant", "Intermediate", "Susceptible", "Cannot be determined without MIC"],
      correctIndex: 2,
      rationale: "Zone diameter is compared to published breakpoint tables (CLSI). Larger zones = lower MIC = more susceptible. Zone sizes are drug-specific — 25mm might be S for one drug but I for another.",
      difficulty: 2,
      category: "Microbiology",
      topic: "antimicrobial resistance"
    },
  {
      id: "mlt-165",
      stem: "MIC (minimum inhibitory concentration) is defined as:",
      options: ["The highest concentration of antibiotic that allows growth", "The lowest concentration that prevents visible growth", "The concentration that kills all bacteria", "The concentration used for susceptibility testing"],
      correctIndex: 1,
      rationale: "MIC = lowest concentration of antibiotic that inhibits visible growth after 16-20 hours incubation. It is the gold standard for susceptibility. MBC (minimum bactericidal concentration) = lowest concentration that kills ≥99.9% of bacteria.",
      difficulty: 3,
      category: "Microbiology",
      topic: "antimicrobial resistance"
    },
  {
      id: "mlt-166",
      stem: "A urine culture shows >100,000 CFU/mL of a single organism. The organism is catalase-positive, coagulase-negative, novobiocin-resistant. Organism:",
      options: ["S. aureus", "S. epidermidis", "S. saprophyticus", "Enterococcus faecalis"],
      correctIndex: 2,
      rationale: "S. saprophyticus: CoNS, novobiocin-resistant (vs S. epidermidis which is novobiocin-susceptible). Second most common cause of UTI in young sexually active women (after E. coli).",
      difficulty: 3,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-167",
      stem: "A CSF Gram stain from a 3-month-old with meningitis shows gram-negative rods. Most likely organism:",
      options: ["S. pneumoniae", "N. meningitidis", "E. coli K1", "S. aureus"],
      correctIndex: 2,
      rationale: "Neonatal meningitis (0-3 months): GBS, E. coli K1, Listeria. GN rods in infant CSF = E. coli K1 (K1 capsular antigen). Beyond 3 months: S. pneumoniae, N. meningitidis, H. influenzae.",
      difficulty: 3,
      category: "Microbiology",
      topic: "gram stain technique"
    },
  {
      id: "mlt-168",
      stem: "Thayer-Martin agar is selective for:",
      options: ["Enteric pathogens", "Neisseria gonorrhoeae and N. meningitidis", "Mycobacteria", "Fungi"],
      correctIndex: 1,
      rationale: "Thayer-Martin = chocolate agar + VCN antibiotics (vancomycin, colistin, nystatin) to inhibit normal flora while allowing Neisseria growth. Used for urogenital, throat, and rectal specimens.",
      difficulty: 2,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-169",
      stem: "Indole-positive, lactose-fermenting, flat non-mucoid colonies on MAC. Most likely:",
      options: ["Klebsiella pneumoniae", "E. coli", "Proteus mirabilis", "Pseudomonas aeruginosa"],
      correctIndex: 1,
      rationale: "E. coli: lactose fermenter, indole positive (tryptophan → indole detected by Kovac's reagent), flat dry colonies on MAC. Klebsiella is indole negative and mucoid. Indole is the most useful single test for E. coli identification.",
      difficulty: 2,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-170",
      stem: "TSI (triple sugar iron) shows acid slant/acid butt with gas and no H₂S. This organism ferments:",
      options: ["Glucose only", "Glucose, lactose, and/or sucrose", "Neither glucose nor lactose", "Only lactose"],
      correctIndex: 1,
      rationale: "A/A = both slant and butt acid = organism ferments glucose AND lactose and/or sucrose. Gas = fermentation byproduct. No H₂S. Consistent with E. coli, Klebsiella, Enterobacter.",
      difficulty: 3,
      category: "Microbiology",
      topic: "biochemical tests"
    },
  {
      id: "mlt-171",
      stem: "Satellite colonies around Staphylococcus aureus on BAP indicate which organism?",
      options: ["Streptococcus pyogenes", "Haemophilus influenzae", "Neisseria meningitidis", "Listeria"],
      correctIndex: 1,
      rationale: "H. influenzae requires V factor (NAD), which is released by S. aureus. On BAP, H. influenzae grows as satellite colonies near the staph streak where V factor is available.",
      difficulty: 2,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-172",
      stem: "Germ tube positive yeast from a blood culture. Most likely:",
      options: ["Cryptococcus neoformans", "Candida albicans", "Candida glabrata", "Aspergillus fumigatus"],
      correctIndex: 1,
      rationale: "Germ tube test: C. albicans produces germ tubes (short hyphal projections without constriction at base) within 2-3 hours in serum at 37°C. C. dubliniensis is also germ tube positive. C. glabrata, C. krusei, C. tropicalis are negative.",
      difficulty: 3,
      category: "Microbiology",
      topic: "mycology"
    },
  {
      id: "mlt-173",
      stem: "A wound culture grows large, flat, beta-hemolytic colonies with a 'Medusa head' appearance. GP rods, non-motile, non-hemolytic in liquid media. Organism:",
      options: ["Clostridium perfringens", "Bacillus anthracis", "Bacillus cereus", "Listeria monocytogenes"],
      correctIndex: 1,
      rationale: "B. anthracis: large GP rods, non-motile (unlike B. cereus which is motile), non-hemolytic, Medusa head colonies, forms endospores. Anthrax causes cutaneous (eschar), pulmonary, or GI disease. Select agent requiring BSL-3 handling.",
      difficulty: 3,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-174",
      stem: "Blood cultures positive for gram-positive rods with tumbling motility at 25°C. The patient is a pregnant woman with fever. Organism:",
      options: ["Corynebacterium diphtheriae", "Listeria monocytogenes", "Bacillus cereus", "Clostridium difficile"],
      correctIndex: 1,
      rationale: "Listeria: GP rods, tumbling motility at 25°C (flagella), beta-hemolytic, grows at 4°C. Causes bacteremia/meningitis in neonates, pregnant women, elderly, immunosuppressed. Can cross placenta.",
      difficulty: 2,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-175",
      stem: "Forward typing: anti-A 4+, anti-B 0. Reverse typing: A1 cells 0, B cells 4+. Blood type:",
      options: ["Group A", "Group B", "Group AB", "ABO discrepancy"],
      correctIndex: 0,
      rationale: "Forward: A antigen present (anti-A+). Reverse: anti-B present (B cells+), no anti-A (A1 cells−). Forward and reverse agree = Group A.",
      difficulty: 1,
      category: "Blood Banking",
      topic: "ABO typing"
    },
  {
      id: "mlt-176",
      stem: "Forward: anti-A 4+, anti-B 4+. Reverse: A1 cells 0, B cells 0. Blood type:",
      options: ["Group A", "Group B", "Group AB", "Group O"],
      correctIndex: 2,
      rationale: "Forward: both A and B antigens. Reverse: no antibodies (AB patients lack anti-A and anti-B). Group AB = universal plasma donor, universal RBC recipient.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "ABO typing"
    },
  {
      id: "mlt-177",
      stem: "An ABO discrepancy: forward type = Group O, but reverse shows weak reaction with A1 cells. Possible cause:",
      options: ["Subgroup of A (A₂ with anti-A₁)", "Cold autoantibody", "Wharton jelly contamination", "Rouleaux"],
      correctIndex: 0,
      rationale: "A₂ subgroup may type as O on forward (weak A antigen not detected) while producing anti-A₁ in reverse (reacting with A₁ cells). Additional testing with anti-A₁ lectin and adsorption/elution resolves this.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "ABO typing"
    },
  {
      id: "mlt-178",
      stem: "The universal RBC donor type is:",
      options: ["A negative", "B negative", "AB negative", "O negative"],
      correctIndex: 3,
      rationale: "Group O has no A or B antigens, so O RBCs can be transfused to any ABO type without ABO-mediated hemolytic reaction. Rh-negative O is 'universal donor' for emergencies.",
      difficulty: 1,
      category: "Blood Banking",
      topic: "ABO typing"
    },
  {
      id: "mlt-179",
      stem: "An antibody screen (indirect antiglobulin test) is positive at 37°C AHG phase. The next step is:",
      options: ["Issue uncrossmatched blood immediately", "Perform antibody identification panel", "Repeat the screen at room temperature", "Assume it is clinically insignificant"],
      correctIndex: 1,
      rationale: "Positive IAT at 37°C/AHG = clinically significant IgG antibody likely. Must identify the antibody using a panel of reagent RBCs with known antigen profiles. Common antibodies: anti-D, anti-K, anti-Fy(a), anti-Jk(a).",
      difficulty: 2,
      category: "Blood Banking",
      topic: "antibody screening"
    },
  {
      id: "mlt-180",
      stem: "An antibody panel shows reactivity with all cells positive for the Kell antigen and no reactivity with Kell-negative cells. The antibody is:",
      options: ["Anti-D", "Anti-K (Kell)", "Anti-Fy(a)", "Anti-Jk(a)"],
      correctIndex: 1,
      rationale: "Antibody identification: match reactivity pattern to antigen profile. If all Kell+ cells react and all Kell− cells don't = anti-K. The 'rule of three' requires ≥3 positive and ≥3 negative cells for valid identification.",
      difficulty: 3,
      category: "Blood Banking",
      topic: "antibody identification"
    },
  {
      id: "mlt-181",
      stem: "Anti-Jk(a) antibodies are clinically significant because they:",
      options: ["Cause immediate intravascular hemolysis only", "Show dosage, cause delayed hemolytic reactions, and can rapidly drop to undetectable levels", "Are always benign", "Only cause HDFN"],
      correctIndex: 1,
      rationale: "Kidd antibodies (anti-Jka, anti-Jkb) are notorious for: (1) showing dosage (stronger with homozygous cells), (2) causing delayed hemolytic transfusion reactions (DHTR), (3) rapidly falling below detection → patient re-exposed → anamnestic response → hemolysis.",
      difficulty: 3,
      category: "Blood Banking",
      topic: "antibody identification"
    },
  {
      id: "mlt-182",
      stem: "An immediate-spin crossmatch is acceptable when:",
      options: ["The patient has a negative antibody screen and no history of clinically significant antibodies", "Always acceptable", "Only for trauma patients", "When no AHG reagent is available"],
      correctIndex: 0,
      rationale: "Immediate-spin crossmatch (IS) detects ABO incompatibility only. Acceptable when: (1) negative current antibody screen AND (2) no history of clinically significant antibodies. Otherwise, full crossmatch through AHG phase required.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "crossmatch procedures"
    },
  {
      id: "mlt-183",
      stem: "An electronic (computer) crossmatch can be used when:",
      options: ["Two ABO/Rh typings match, negative antibody screen, no significant antibody history, validated computer system", "Any time", "Only for autologous units", "When the blood bank is short-staffed"],
      correctIndex: 0,
      rationale: "Electronic crossmatch requires: two concordant ABO/Rh typings, negative antibody screen, no history of significant antibodies, and FDA-validated computer system. It replaces serological crossmatch, improving efficiency.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "crossmatch procedures"
    },
  {
      id: "mlt-184",
      stem: "A type and screen reveals anti-E antibody. Compatible blood for transfusion must be:",
      options: ["Any Rh-positive unit", "E-antigen negative, crossmatch compatible", "Only O negative", "Any crossmatch-compatible unit regardless of E status"],
      correctIndex: 1,
      rationale: "When a clinically significant antibody is identified, antigen-negative units must be selected. For anti-E, provide E-negative RBCs and perform AHG crossmatch to confirm compatibility.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "compatibility testing"
    },
  {
      id: "mlt-185",
      stem: "Fresh frozen plasma (FFP) contains:",
      options: ["Only fibrinogen", "All coagulation factors, including labile factors V and VIII", "Packed red blood cells", "Platelets"],
      correctIndex: 1,
      rationale: "FFP is frozen within 8 hours of collection, preserving all factors including labile V and VIII. Indications: DIC, massive transfusion, warfarin reversal, liver disease coagulopathy. Must be ABO compatible.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "component therapy"
    },
  {
      id: "mlt-186",
      stem: "Platelets should be stored at:",
      options: ["1-6°C (refrigerator)", "20-24°C with continuous agitation", "−18°C or below (frozen)", "37°C (body temperature)"],
      correctIndex: 1,
      rationale: "Platelets stored at 20-24°C with gentle agitation for 5 days (extended to 7 days with pathogen reduction). Cold temperatures activate platelets and reduce function. Bacterial contamination is the main risk (warm storage).",
      difficulty: 2,
      category: "Blood Banking",
      topic: "component therapy"
    },
  {
      id: "mlt-187",
      stem: "Cryoprecipitate contains which factors?",
      options: ["All coagulation factors", "Fibrinogen, Factor VIII, vWF, Factor XIII, fibronectin", "Only Factor VIII", "Only fibrinogen"],
      correctIndex: 1,
      rationale: "Cryo = cold-insoluble fraction of FFP. Contains concentrated fibrinogen (250mg/bag), VIII, vWF, XIII, fibronectin. Indications: low fibrinogen (<100), DIC, vWD (when DDAVP/concentrates unavailable).",
      difficulty: 1,
      category: "Blood Banking",
      topic: "component therapy"
    },
  {
      id: "mlt-188",
      stem: "Packed RBCs are stored at 1-6°C for up to:",
      options: ["7 days", "21 days in CPDA-1; up to 42 days in additive solutions (AS-1, AS-3, AS-5)", "90 days", "1 year"],
      correctIndex: 1,
      rationale: "RBC shelf life depends on preservative: CPDA-1 = 35 days; additive solutions (AS-1/AS-3/AS-5) = 42 days. Stored at 1-6°C. 2,3-DPG depletes during storage (storage lesion), regenerates post-transfusion.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "component therapy"
    },
  {
      id: "mlt-189",
      stem: "The direct antiglobulin test (DAT) detects:",
      options: ["Antibodies in patient serum", "Antibodies or complement already bound to patient's RBCs in vivo", "ABO antigens on RBCs", "Unexpected antibodies in donor units"],
      correctIndex: 1,
      rationale: "DAT: tests patient's WASHED RBCs with anti-human globulin (AHG). Detects IgG and/or C3d already on cells. Positive in: AIHA, HDFN, transfusion reaction, drug-induced hemolysis.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "direct antiglobulin test"
    },
  {
      id: "mlt-190",
      stem: "DAT positive with anti-IgG only. Most likely cause:",
      options: ["Cold agglutinin disease", "Warm autoimmune hemolytic anemia", "PNH", "DIC"],
      correctIndex: 1,
      rationale: "IgG only on DAT = warm AIHA (IgG autoantibodies bind at 37°C). Cold agglutinin disease shows C3d only (IgM activates complement then dissociates). IgG + C3d = mixed type.",
      difficulty: 3,
      category: "Blood Banking",
      topic: "direct antiglobulin test"
    },
  {
      id: "mlt-191",
      stem: "Hemoglobin requirement for whole blood donation:",
      options: ["No minimum requirement", "≥12.5 g/dL for females; ≥13.0 g/dL for males", "≥10.0 g/dL", "≥15.0 g/dL"],
      correctIndex: 1,
      rationale: "FDA/AABB: female donors ≥12.5 g/dL; male donors ≥13.0 g/dL. Hct can be used alternatively: female ≥38%; male ≥39%. Protects donor from symptomatic anemia.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "donor screening"
    },
  {
      id: "mlt-192",
      stem: "A donor had a malaria-endemic country visit 14 months ago. Can they donate?",
      options: ["Yes — no restriction", "No — must wait 3 years after travel to malaria-endemic area", "Yes — if asymptomatic for 12 months", "Only if they test negative for malaria"],
      correctIndex: 2,
      rationale: "AABB standards: defer for 12 months (US) or 3 years (some guidelines) after travel to malaria-endemic area if asymptomatic. If they had malaria, defer 3 years after becoming asymptomatic. This donor at 14 months past the 12-month deferral may be eligible.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "donor screening"
    },
  {
      id: "mlt-193",
      stem: "Irradiation of blood components prevents:",
      options: ["Bacterial contamination", "Transfusion-associated graft-versus-host disease (TA-GVHD)", "ABO hemolytic reactions", "Febrile reactions"],
      correctIndex: 1,
      rationale: "Irradiation (25 Gy minimum) inactivates donor T-lymphocytes that could engraft and attack immunocompromised recipients. Indicated for: bone marrow transplant patients, neonates, immunodeficient patients, HLA-matched/directed donations.",
      difficulty: 3,
      category: "Blood Banking",
      topic: "component therapy"
    },
  {
      id: "mlt-194",
      stem: "Leukoreduction of blood products reduces the risk of:",
      options: ["ABO incompatibility", "Febrile non-hemolytic reactions, CMV transmission, HLA alloimmunization", "Bacterial contamination", "Iron overload"],
      correctIndex: 1,
      rationale: "Leukoreduction (<5 × 10⁶ WBCs/unit) reduces: febrile reactions (from WBC cytokines), CMV transmission (CMV lives in WBCs), and HLA alloimmunization (preventing platelet refractoriness).",
      difficulty: 2,
      category: "Blood Banking",
      topic: "component therapy"
    },
  {
      id: "mlt-195",
      stem: "A patient experiences chills, fever, back pain, and hemoglobinuria during transfusion. The most critical immediate action:",
      options: ["Slow the transfusion rate", "Stop the transfusion immediately, keep IV open with saline", "Administer diphenhydramine and continue", "Draw blood for type and screen only"],
      correctIndex: 1,
      rationale: "Acute hemolytic transfusion reaction (ABO incompatibility) = medical emergency. Stop transfusion immediately, maintain IV access with saline, send post-reaction sample for DAT, visual check for hemolysis, repeat type and screen. Most caused by clerical/identification errors.",
      difficulty: 3,
      category: "Blood Banking",
      topic: "compatibility testing"
    },
  {
      id: "mlt-196",
      stem: "The most common cause of fatal hemolytic transfusion reactions is:",
      options: ["Rh incompatibility", "ABO incompatibility from clerical/identification errors", "Bacterial contamination", "Allergic reaction"],
      correctIndex: 1,
      rationale: "ABO incompatibility from patient/sample misidentification is the #1 cause. Pre-existing anti-A or anti-B (IgM) cause complement-mediated intravascular hemolysis → DIC, renal failure, death. Prevention: strict patient ID verification at collection and bedside.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "compatibility testing"
    },
  {
      id: "mlt-197",
      stem: "What antibodies does a Group O individual have?",
      options: ["Anti-A only", "Anti-B only", "Both anti-A and anti-B", "Neither"],
      correctIndex: 2,
      rationale: "Group O = no A or B antigens on RBCs, but has BOTH anti-A and anti-B in plasma (Landsteiner's rule). Group O plasma should not be given to A, B, or AB patients (contains antibodies).",
      difficulty: 2,
      category: "Blood Banking",
      topic: "ABO typing"
    },
  {
      id: "mlt-198",
      stem: "A crossmatch is incompatible at AHG phase. The antibody screen is positive. What additional testing is needed?",
      options: ["Release the unit with a comment", "Perform antibody identification, select antigen-negative units, crossmatch through AHG", "Issue O-negative uncrossmatched blood", "Repeat the crossmatch — likely lab error"],
      correctIndex: 1,
      rationale: "Incompatible crossmatch at AHG with positive screen requires: identify the antibody (panel), select antigen-negative donor units, crossmatch through AHG to confirm compatibility. Cannot release incompatible units.",
      difficulty: 3,
      category: "Blood Banking",
      topic: "crossmatch procedures"
    },
  {
      id: "mlt-199",
      stem: "A positive ANA (antinuclear antibody) by IFA with homogeneous pattern is most associated with:",
      options: ["Rheumatoid arthritis", "Systemic lupus erythematosus (SLE)", "Sjögren syndrome", "Scleroderma"],
      correctIndex: 1,
      rationale: "Homogeneous ANA pattern = anti-dsDNA or anti-histone antibodies, most associated with SLE. Anti-dsDNA is highly specific for SLE. Speckled pattern = anti-ENA (Smith, RNP, SSA, SSB).",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "ANA testing"
    },
  {
      id: "mlt-200",
      stem: "Anti-dsDNA antibodies are highly specific for:",
      options: ["Rheumatoid arthritis", "SLE — and levels correlate with disease activity/nephritis", "Hashimoto thyroiditis", "Celiac disease"],
      correctIndex: 1,
      rationale: "Anti-dsDNA: 60-70% sensitivity, >95% specificity for SLE. Rising titers correlate with lupus nephritis flares. Along with anti-Smith (anti-Sm), it is the most specific serological marker for SLE.",
      difficulty: 3,
      category: "Immunology/Serology",
      topic: "ANA testing"
    },
  {
      id: "mlt-201",
      stem: "The prozone phenomenon in serological testing occurs when:",
      options: ["Antibody concentration is too low", "Excess antibody relative to antigen gives false negative", "Antigens are degraded", "Temperature is too high"],
      correctIndex: 1,
      rationale: "Prozone = antibody excess → small, soluble immune complexes that don't produce visible agglutination/precipitation = false negative. Solution: dilute the specimen. Common in RPR/VDRL for syphilis (high-titer patients).",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "antigen-antibody reactions"
    },
  {
      id: "mlt-202",
      stem: "CH50 (total hemolytic complement) tests the function of:",
      options: ["Only the classical pathway", "The entire classical complement pathway (C1 through C9)", "The alternative pathway", "Only C3 and C4"],
      correctIndex: 1,
      rationale: "CH50 measures functional activity of ALL classical pathway components (C1-C9). If any component is absent/deficient, CH50 is low/zero. AH50 tests alternative pathway. If both low = shared component (C3-C9) deficiency.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "complement system"
    },
  {
      id: "mlt-203",
      stem: "C3 low, C4 low, CH50 low. This pattern suggests:",
      options: ["Alternative pathway activation", "Classical pathway activation (SLE, immune complex disease)", "Terminal pathway deficiency", "Normal complement levels"],
      correctIndex: 1,
      rationale: "Both C3 and C4 consumed → classical pathway activation. Most common in SLE (immune complexes activate classical pathway). Alternative pathway activation: low C3, normal C4. Terminal: normal C3/C4, low CH50.",
      difficulty: 3,
      category: "Immunology/Serology",
      topic: "complement system"
    },
  {
      id: "mlt-204",
      stem: "HBsAg positive, HBeAg positive, anti-HBc IgM positive. Interpretation:",
      options: ["Chronic hepatitis B", "Acute hepatitis B with high infectivity", "Immune from vaccination", "Past resolved infection"],
      correctIndex: 1,
      rationale: "HBsAg+ = current infection. Anti-HBc IgM+ = acute (IgM = recent). HBeAg+ = high viral replication/infectivity. This is acute HBV with high infectivity. Chronic = HBsAg+ for >6 months with anti-HBc IgG.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "hepatitis panels"
    },
  {
      id: "mlt-205",
      stem: "Anti-HBs positive only (all other markers negative). Interpretation:",
      options: ["Acute infection", "Chronic infection", "Immune from vaccination", "Window period"],
      correctIndex: 2,
      rationale: "Anti-HBs alone = immunity from vaccination (vaccine contains HBsAg only, so only anti-HBs develops). If anti-HBs + anti-HBc positive = immunity from past natural infection.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "hepatitis panels"
    },
  {
      id: "mlt-206",
      stem: "HBsAg negative, anti-HBc IgM positive, anti-HBs negative. This is the:",
      options: ["Acute infection", "Window period (between HBsAg disappearance and anti-HBs appearance)", "Chronic infection", "Immune status"],
      correctIndex: 1,
      rationale: "Window period: HBsAg has cleared but anti-HBs hasn't appeared yet. Anti-HBc IgM is the ONLY marker of acute infection during this period. Without testing for anti-HBc, infection could be missed.",
      difficulty: 3,
      category: "Immunology/Serology",
      topic: "hepatitis panels"
    },
  {
      id: "mlt-207",
      stem: "4th generation HIV test detects:",
      options: ["HIV antibodies only", "Both HIV-1/2 antibodies AND p24 antigen", "HIV RNA only", "CD4 count"],
      correctIndex: 1,
      rationale: "4th gen = combined antibody/antigen test. Detects anti-HIV-1/2 antibodies AND p24 antigen (viral capsid protein), reducing the window period to ~2 weeks. If positive → differentiation assay (HIV-1/2 antibody differentiation) → if indeterminate → NAT.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "HIV testing"
    },
  {
      id: "mlt-208",
      stem: "A reactive 4th-gen HIV screen with non-reactive HIV-1/2 differentiation assay. Next step:",
      options: ["Report as HIV negative", "HIV-1 NAT (nucleic acid test) to detect acute HIV-1 infection", "Repeat the screening test in 4 weeks", "Report as HIV positive"],
      correctIndex: 1,
      rationale: "Reactive screen + negative differentiation = possible acute HIV-1 (antibodies not yet developed but p24 antigen detected). NAT detects HIV RNA and confirms acute infection. This is the recommended CDC algorithm.",
      difficulty: 3,
      category: "Immunology/Serology",
      topic: "HIV testing"
    },
  {
      id: "mlt-209",
      stem: "Rheumatoid factor (RF) is an antibody (usually IgM) directed against:",
      options: ["DNA", "The Fc portion of IgG", "Red blood cell antigens", "Nuclear antigens"],
      correctIndex: 1,
      rationale: "RF = IgM antibody against the Fc portion of IgG. Present in ~80% of RA patients but not specific (also in SLE, Sjögren, chronic infections, elderly). Anti-CCP (cyclic citrullinated peptide) is more specific for RA.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "autoimmune markers"
    },
  {
      id: "mlt-210",
      stem: "Anti-CCP antibodies are most specific for:",
      options: ["SLE", "Rheumatoid arthritis", "Scleroderma", "Sjögren syndrome"],
      correctIndex: 1,
      rationale: "Anti-CCP: 95-98% specificity for RA (vs RF ~80%). Can be positive years before clinical RA develops. Combined with RF improves diagnostic accuracy. Also predicts more aggressive joint disease.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "autoimmune markers"
    },
  {
      id: "mlt-211",
      stem: "In a sandwich ELISA, the 'sandwich' consists of:",
      options: ["Two antigens with antibody between them", "Capture antibody + antigen + labeled detection antibody", "Antibody alone on the plate", "Enzyme and substrate only"],
      correctIndex: 1,
      rationale: "Sandwich ELISA: (1) capture antibody bound to plate, (2) patient antigen binds, (3) enzyme-labeled detection antibody binds = sandwich. Add substrate → color proportional to antigen concentration. Used for HIV, HBsAg, etc.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "EIA methodology"
    },
  {
      id: "mlt-212",
      stem: "In ELISA, the enzyme-substrate reaction produces:",
      options: ["A colored product proportional to analyte concentration", "Radioactive signal", "Fluorescent light only", "No visible change"],
      correctIndex: 0,
      rationale: "Common enzymes: HRP (horseradish peroxidase) with TMB substrate → blue/yellow color; ALP with pNPP → yellow. Absorbance read by spectrophotometer. Quantitative assays use standard curves.",
      difficulty: 1,
      category: "Immunology/Serology",
      topic: "EIA methodology"
    },
  {
      id: "mlt-213",
      stem: "Which immunoglobulin crosses the placenta?",
      options: ["IgM", "IgG", "IgA", "IgE"],
      correctIndex: 1,
      rationale: "IgG is the only immunoglobulin that crosses the placenta (via FcRn receptor), providing passive immunity to the newborn for the first 3-6 months of life. IgM is too large (pentamer) to cross.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "immunoglobulin levels"
    },
  {
      id: "mlt-214",
      stem: "The immunoglobulin found in highest concentration in serum:",
      options: ["IgA", "IgG", "IgM", "IgE"],
      correctIndex: 1,
      rationale: "Serum concentration: IgG (~75%) > IgA (~15%) > IgM (~10%) > IgD > IgE (trace). IgG: secondary immune response, opsonization, complement activation, crosses placenta.",
      difficulty: 1,
      category: "Immunology/Serology",
      topic: "immunoglobulin levels"
    },
  {
      id: "mlt-215",
      stem: "IgA is predominantly found in:",
      options: ["Serum only", "Mucosal secretions (saliva, tears, breast milk, GI/respiratory secretions)", "Mast cell surfaces", "CSF"],
      correctIndex: 1,
      rationale: "Secretory IgA (sIgA) is the predominant antibody in mucosal surfaces. Dimeric IgA with secretory component and J chain. First line of mucosal defense. IgA deficiency is the most common primary immunodeficiency.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "immunoglobulin levels"
    },
  {
      id: "mlt-216",
      stem: "RPR (rapid plasma reagin) test detects antibodies against:",
      options: ["Treponema pallidum surface proteins", "Cardiolipin (non-treponemal reagin antibodies)", "HIV antigens", "Hepatitis B surface antigen"],
      correctIndex: 1,
      rationale: "RPR/VDRL are non-treponemal tests detecting reagin antibodies (anti-cardiolipin + anti-lecithin). Screening tests — sensitive but not specific. False positives: SLE, pregnancy, infections. Confirm with treponemal test (FTA-ABS, TP-PA).",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "antigen-antibody reactions"
    },
  {
      id: "mlt-217",
      stem: "A positive RPR with negative FTA-ABS most likely represents:",
      options: ["Active syphilis", "Biological false-positive RPR", "Late latent syphilis", "Neurosyphilis"],
      correctIndex: 1,
      rationale: "Positive non-treponemal (RPR) + negative treponemal (FTA-ABS) = biological false positive. Causes: SLE, pregnancy, viral infections, IV drug use, elderly. True syphilis would show positive FTA-ABS.",
      difficulty: 3,
      category: "Immunology/Serology",
      topic: "antigen-antibody reactions"
    },
  {
      id: "mlt-218",
      stem: "A urine sediment shows hyaline casts. Their significance:",
      options: ["Always pathological — indicates renal disease", "Can be normal — formed from Tamm-Horsfall protein, increased with exercise/dehydration", "Indicates bacterial infection", "Indicates glomerulonephritis"],
      correctIndex: 1,
      rationale: "Hyaline casts are composed of Tamm-Horsfall mucoprotein (uromodulin). A few are normal. Increased with dehydration, strenuous exercise, diuretic use. Pathological casts include RBC, WBC, granular, and waxy casts.",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "microscopic sediment"
    },
  {
      id: "mlt-219",
      stem: "RBC casts in urine sediment indicate:",
      options: ["Lower urinary tract infection", "Glomerulonephritis (glomerular bleeding)", "Bladder cancer", "Kidney stones"],
      correctIndex: 1,
      rationale: "RBC casts form in renal tubules when RBCs are trapped in Tamm-Horsfall protein matrix. They indicate GLOMERULAR origin of hematuria — glomerulonephritis, lupus nephritis, IgA nephropathy. RBC casts = renal, not bladder/urethral.",
      difficulty: 3,
      category: "Urinalysis/Body Fluids",
      topic: "microscopic sediment"
    },
  {
      id: "mlt-220",
      stem: "Waxy casts represent:",
      options: ["Early renal disease", "Advanced chronic renal disease (long transit time in tubules)", "Normal finding", "Bacterial infection"],
      correctIndex: 1,
      rationale: "Waxy casts are the final degeneration stage of granular casts. They form in dilated tubules with slow flow = chronic renal failure. Broad waxy casts ('renal failure casts') indicate very poor prognosis.",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "microscopic sediment"
    },
  {
      id: "mlt-221",
      stem: "WBC casts indicate:",
      options: ["Cystitis", "Pyelonephritis or interstitial nephritis (renal parenchymal inflammation)", "Urethritis", "Normal kidney function"],
      correctIndex: 1,
      rationale: "WBC casts prove the WBCs originated in the renal tubules — pyelonephritis (upper UTI) or tubulointerstitial nephritis. Cystitis shows WBCs but NOT WBC casts (lower UTI).",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "cast identification"
    },
  {
      id: "mlt-222",
      stem: "Hexagonal crystals in acidic urine are characteristic of:",
      options: ["Calcium oxalate", "Uric acid", "Cystine — pathognomonic for cystinuria", "Triple phosphate"],
      correctIndex: 2,
      rationale: "Cystine crystals are hexagonal (flat, benzene ring-shaped), found only in acidic urine. Pathognomonic for cystinuria (autosomal recessive amino acid transport disorder). Can form cystine kidney stones.",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "crystal identification"
    },
  {
      id: "mlt-223",
      stem: "Envelope-shaped (octahedral) crystals in acidic urine are:",
      options: ["Calcium oxalate dihydrate", "Uric acid", "Triple phosphate", "Cholesterol"],
      correctIndex: 0,
      rationale: "Calcium oxalate dihydrate = envelope/octahedral shape in acidic urine. Monohydrate = oval/dumbbell. Common crystal, can be normal. Massive amounts with acute renal failure → consider ethylene glycol poisoning.",
      difficulty: 1,
      category: "Urinalysis/Body Fluids",
      topic: "crystal identification"
    },
  {
      id: "mlt-224",
      stem: "Coffin-lid shaped crystals in alkaline urine:",
      options: ["Calcium oxalate", "Uric acid", "Triple phosphate (struvite/MAP)", "Cystine"],
      correctIndex: 2,
      rationale: "Triple phosphate (magnesium ammonium phosphate/struvite) = coffin-lid shape in alkaline urine. Associated with UTI from urease-producing bacteria (Proteus). Can form staghorn calculi.",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "crystal identification"
    },
  {
      id: "mlt-225",
      stem: "CSF: WBC 850/µL (95% neutrophils), protein 250 mg/dL (high), glucose 20 mg/dL (low, serum 90). This CSF pattern suggests:",
      options: ["Viral meningitis", "Bacterial meningitis", "Normal CSF", "Multiple sclerosis"],
      correctIndex: 1,
      rationale: "Bacterial meningitis CSF: very high WBC (predominantly neutrophils), high protein, LOW glucose (<40% of serum glucose). Viral meningitis: moderate WBC (lymphocytes), mild protein elevation, normal glucose.",
      difficulty: 3,
      category: "Urinalysis/Body Fluids",
      topic: "CSF analysis"
    },
  {
      id: "mlt-226",
      stem: "CSF glucose should be compared to simultaneous serum glucose. Normal CSF/serum ratio:",
      options: ["1:1 (equal)", "60-70% of serum glucose", "25% of serum glucose", "200% of serum glucose"],
      correctIndex: 1,
      rationale: "Normal CSF glucose = 60-70% of serum (collected simultaneously). CSF glucose <40% of serum (or <40 mg/dL) = hypoglycorrhachia — bacterial/fungal/TB meningitis, carcinomatous meningitis. Viral meningitis: normal glucose.",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "CSF analysis"
    },
  {
      id: "mlt-227",
      stem: "Urine dipstick positive for blood, but microscopy shows no RBCs. Possible explanations:",
      options: ["False positive dipstick", "Hemoglobinuria (from intravascular hemolysis) or myoglobinuria", "Ascorbic acid interference", "Specimen contamination"],
      correctIndex: 1,
      rationale: "Dipstick detects heme (peroxidase activity of hemoglobin). Positive without RBCs = free hemoglobin (intravascular hemolysis → hemoglobinuria) or myoglobin (rhabdomyolysis → myoglobinuria). Both cause positive dipstick without visible RBCs.",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "microscopic sediment"
    },
  {
      id: "mlt-228",
      stem: "Bacteria in urine with positive leukocyte esterase and positive nitrite suggests:",
      options: ["Normal finding", "Urinary tract infection", "Kidney stones", "Glomerulonephritis"],
      correctIndex: 1,
      rationale: "Leukocyte esterase (from WBCs) + nitrite (bacterial conversion of dietary nitrate) + bacteria = UTI. Nitrite positive indicates gram-negative bacteria (E. coli, Klebsiella). Some bacteria don't produce nitrite (Enterococcus, Staph).",
      difficulty: 1,
      category: "Urinalysis/Body Fluids",
      topic: "microscopic sediment"
    },
  {
      id: "mlt-229",
      stem: "The guaiac-based FOBT detects occult blood by:",
      options: ["Immunological detection of human hemoglobin", "Peroxidase activity of hemoglobin oxidizing guaiac reagent → blue color", "Direct visualization of blood", "Measurement of iron in stool"],
      correctIndex: 1,
      rationale: "Guaiac FOBT: heme peroxidase oxidizes guaiac → blue. Not specific for human blood (diet interference from red meat, turnips, horseradish). FIT (fecal immunochemical test) uses antibodies specific for human hemoglobin — more specific, no diet restrictions.",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "fecal occult blood"
    },
  {
      id: "mlt-230",
      stem: "CSF oligoclonal bands present (but absent in serum). Most associated with:",
      options: ["Bacterial meningitis", "Multiple sclerosis", "Normal finding", "Guillain-Barré"],
      correctIndex: 1,
      rationale: "Oligoclonal bands in CSF (not matched in serum) = intrathecal IgG synthesis. Present in >90% of MS patients. Also elevated IgG index and IgG synthesis rate. Not diagnostic alone but strongly supportive.",
      difficulty: 3,
      category: "Urinalysis/Body Fluids",
      topic: "CSF analysis"
    },
  {
      id: "mlt-231",
      stem: "Urine specific gravity 1.030 with pH 5.0 is most consistent with:",
      options: ["Diabetes insipidus", "Dehydration (concentrated urine)", "Overhydration", "Renal tubular acidosis"],
      correctIndex: 1,
      rationale: "SG 1.030 (high) with acidic pH = concentrated specimen from dehydration. Normal SG 1.005-1.030. DI would show very dilute urine (SG <1.005). Overhydration = low SG.",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "microscopic sediment"
    },
  {
      id: "mlt-232",
      stem: "A control value falls outside ±2 SD on a Levey-Jennings chart for the first time. According to Westgard rules:",
      options: ["Reject all patient results immediately", "This is a 1-2s warning — investigate but do not reject", "Recalibrate the instrument immediately", "Discard the control lot"],
      correctIndex: 1,
      rationale: "1-2s is a WARNING rule. A single value between 2-3 SD triggers investigation (inspect reagents, controls, calibration). Do NOT reject patient results. If value exceeds 3 SD (1-3s) = reject. If two consecutive values exceed 2 SD on same side (2-2s) = reject (systematic error).",
      difficulty: 2,
      category: "Quality Assurance",
      topic: "Levey-Jennings charts"
    },
  {
      id: "mlt-233",
      stem: "Seven consecutive QC values on the same side of the mean (all above or all below) represents:",
      options: ["Random error", "A trend — possible shift indicating systematic error", "Normal variation", "Instrument failure"],
      correctIndex: 1,
      rationale: "Seven points on one side = shift (Westgard 7x rule or multirule). Indicates systematic error — calibration drift, reagent deterioration, change in reagent lot, pipette miscalibration. Requires investigation and corrective action before releasing results.",
      difficulty: 3,
      category: "Quality Assurance",
      topic: "Levey-Jennings charts"
    },
  {
      id: "mlt-234",
      stem: "Accuracy in method validation is determined by:",
      options: ["Comparing results to a reference method or certified reference material", "Repeating the same sample 20 times", "Testing at different dilutions", "Comparing two technologists' results"],
      correctIndex: 0,
      rationale: "Accuracy = closeness to true value. Determined by comparing results with accepted reference method, certified reference materials (SRMs), or proficiency testing results. Method comparison studies (Bland-Altman, regression analysis).",
      difficulty: 2,
      category: "Quality Assurance",
      topic: "method validation"
    },
  {
      id: "mlt-235",
      stem: "Precision (reproducibility) is assessed by:",
      options: ["Comparison with reference method", "Replicate testing of the same sample to determine CV (coefficient of variation)", "Correlation coefficient analysis", "Single measurement of a standard"],
      correctIndex: 1,
      rationale: "Precision = reproducibility. Measured by running the same sample multiple times (within-run and between-run) and calculating SD and CV. CV = (SD/mean) × 100. Lower CV = better precision. Typically assessed at multiple analyte levels.",
      difficulty: 2,
      category: "Quality Assurance",
      topic: "method validation"
    },
  {
      id: "mlt-236",
      stem: "A new glucose method gives results that are consistently 5 mg/dL higher than the reference method at all concentrations. This represents:",
      options: ["Random error", "Systematic error (constant bias)", "Proportional error", "Good correlation"],
      correctIndex: 1,
      rationale: "Constant difference at all levels = constant systematic bias. Proportional error would show increasing difference at higher concentrations. Systematic error can be corrected by recalibration; random error cannot.",
      difficulty: 3,
      category: "Quality Assurance",
      topic: "method validation"
    },
  {
      id: "mlt-237",
      stem: "Proficiency testing (PT) serves what purpose?",
      options: ["Internal quality control", "External assessment of laboratory accuracy by testing unknown samples", "Method development", "Staff competency only"],
      correctIndex: 1,
      rationale: "PT: external quality assessment. Labs receive unknown samples, analyze them, and submit results to the PT provider (CAP, API). Results compared to peer laboratories. Required by CLIA for continued certification. Failure requires root cause analysis and corrective action.",
      difficulty: 2,
      category: "Quality Assurance",
      topic: "accuracy assessment"
    },
  {
      id: "mlt-238",
      stem: "Calibration verification must be performed:",
      options: ["Only when the analyzer is first installed", "At least every 6 months, with new reagent lots, and after major maintenance", "Annually only", "Never — calibration doesn't drift"],
      correctIndex: 1,
      rationale: "CLIA/CAP requires calibration verification every 6 months, when changing reagent lots, after major maintenance/repair, and when QC indicates calibration drift. Performed using certified standards spanning the reportable range.",
      difficulty: 2,
      category: "Quality Assurance",
      topic: "calibration verification"
    },
  {
      id: "mlt-239",
      stem: "A delta check compares:",
      options: ["Current result with the previous result for the same patient", "Two simultaneously drawn samples", "Results from different instruments", "QC values between runs"],
      correctIndex: 0,
      rationale: "Delta checks flag results that differ significantly from the patient's previous value — indicating possible specimen mislabeling, contamination, or acute clinical change. Common for K⁺, Hgb, WBC, glucose.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "LIS operations"
    },
  {
      id: "mlt-240",
      stem: "Under CLIA, waived tests include:",
      options: ["Tests with complex procedures requiring specialized training", "Simple tests with low risk of erroneous results (dipstick urinalysis, rapid strep, glucometers)", "All chemistry panels", "Blood bank tests"],
      correctIndex: 1,
      rationale: "CLIA waived: simple, accurate methods with minimal risk. Examples: urine dipstick, fecal occult blood, rapid strep, glucometers, pregnancy tests. Certificate of waiver required. Moderate/high complexity tests require more stringent oversight.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "CLIA requirements"
    },
  {
      id: "mlt-241",
      stem: "Which regulatory body inspects and accredits clinical laboratories in the US?",
      options: ["FDA only", "CAP, COLA, Joint Commission (deemed status under CMS/CLIA)", "CDC only", "OSHA only"],
      correctIndex: 1,
      rationale: "CMS administers CLIA. Labs can be inspected directly by CMS or by accrediting organizations with deemed status: CAP, COLA, Joint Commission, AABB (blood banks). These organizations' standards meet or exceed CLIA requirements.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "CLIA requirements"
    },
  {
      id: "mlt-242",
      stem: "Chain of custody documentation for forensic specimens (drug testing) must include:",
      options: ["Patient name only", "Complete documentation of specimen handling from collection to result: collector ID, time, seals, transfers, storage", "Just the final result", "Only the collector's signature"],
      correctIndex: 1,
      rationale: "Legal chain of custody: collector identification, specimen collection time/date, tamper-evident seals, documented transfers between individuals (each signs with date/time), secure storage conditions, analysis records. Any break in chain invalidates the result.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "chain of custody"
    },
  {
      id: "mlt-243",
      stem: "Barcoding specimens provides:",
      options: ["Faster testing", "Positive patient identification reducing pre-analytical errors", "Better test accuracy", "Lower reagent costs"],
      correctIndex: 1,
      rationale: "Barcoding reduces specimen identification errors (the most common pre-analytical error). Barcode links specimen to patient through positive identification at collection, accession, and analysis. Reduces wrong-patient-on-wrong-sample events.",
      difficulty: 1,
      category: "Laboratory Operations",
      topic: "LIS operations"
    },
  {
      id: "mlt-244",
      stem: "Linearity (analytical measurement range/AMR) establishes:",
      options: ["The lowest detectable concentration", "The range over which results are directly proportional to analyte concentration", "Normal reference ranges", "Specimen stability"],
      correctIndex: 1,
      rationale: "Linearity/AMR: range where instrument output is directly proportional to analyte concentration. Tested using serial dilutions of high-concentration material or commercial linearity sets. Results outside AMR require dilution or alternative method.",
      difficulty: 2,
      category: "Quality Assurance",
      topic: "linearity studies"
    },
  {
      id: "mlt-245",
      stem: "Sensitivity of a diagnostic test is defined as:",
      options: ["True positives / (true positives + false negatives) × 100", "True negatives / (true negatives + false positives) × 100", "True positives / (true positives + false positives) × 100", "Total correct / total tested × 100"],
      correctIndex: 0,
      rationale: "Sensitivity = TP/(TP+FN) = ability to detect disease (few false negatives). High sensitivity = good negative predictive value (rule out). Specificity = TN/(TN+FP) = ability to exclude non-disease (few false positives).",
      difficulty: 3,
      category: "Quality Assurance",
      topic: "method validation"
    },
  {
      id: "mlt-246",
      stem: "Specificity of a diagnostic test is defined as:",
      options: ["TP/(TP+FN)", "TN/(TN+FP) × 100", "TP/(TP+FP)", "(TP+TN)/total"],
      correctIndex: 1,
      rationale: "Specificity = TN/(TN+FP) = ability to correctly identify those WITHOUT disease. High specificity = few false positives = good positive predictive value (rule in). Tests with high specificity are confirmatory.",
      difficulty: 2,
      category: "Quality Assurance",
      topic: "method validation"
    },
  {
      id: "mlt-247",
      stem: "In PCR, the three steps in each cycle are:",
      options: ["Lysis, extraction, precipitation", "Denaturation (95°C), annealing (55-65°C), extension (72°C)", "Hybridization, washing, detection", "Forward, reverse, amplification"],
      correctIndex: 1,
      rationale: "PCR cycle: (1) Denaturation: 95°C separates DNA strands. (2) Annealing: 55-65°C allows primers to bind complementary sequences. (3) Extension: 72°C — Taq polymerase synthesizes new strand from dNTPs. ~30 cycles = 2³⁰ copies (~1 billion-fold amplification).",
      difficulty: 2,
      category: "Molecular Diagnostics",
      topic: "PCR technique"
    },
  {
      id: "mlt-248",
      stem: "Taq polymerase used in PCR is heat-stable because it was isolated from:",
      options: ["E. coli", "Thermus aquaticus (thermophilic bacterium from hot springs)", "Human cells", "Yeast"],
      correctIndex: 1,
      rationale: "Taq DNA polymerase from Thermus aquaticus survives the 95°C denaturation step. Optimal activity at 72°C. Without heat-stable polymerase, fresh enzyme would need to be added each cycle.",
      difficulty: 1,
      category: "Molecular Diagnostics",
      topic: "PCR technique"
    },
  {
      id: "mlt-249",
      stem: "Real-time PCR (qPCR) differs from conventional PCR because it:",
      options: ["Uses different primers", "Monitors amplification in real time using fluorescent probes/dyes (quantitative)", "Does not require thermal cycling", "Uses RNA instead of DNA"],
      correctIndex: 1,
      rationale: "Real-time PCR monitors fluorescence during each cycle. Ct (cycle threshold) value = cycle where fluorescence exceeds background. Lower Ct = more starting template = higher viral load. Used for HIV, HCV, CMV viral loads and BCR-ABL monitoring.",
      difficulty: 3,
      category: "Molecular Diagnostics",
      topic: "nucleic acid amplification"
    },
  {
      id: "mlt-250",
      stem: "The purpose of DNA extraction before PCR is to:",
      options: ["Amplify the DNA first", "Isolate and purify nucleic acid from inhibitors and cellular debris", "Denature the DNA", "Add fluorescent labels"],
      correctIndex: 1,
      rationale: "DNA extraction removes proteins, lipids, RNA, and PCR inhibitors (hemoglobin, heparin, melanin) that can cause false negatives. Methods: silica column (spin columns), magnetic beads, phenol-chloroform, automated systems.",
      difficulty: 2,
      category: "Molecular Diagnostics",
      topic: "DNA extraction"
    },
  {
      id: "mlt-251",
      stem: "In gel electrophoresis, DNA migrates toward the:",
      options: ["Cathode (negative electrode)", "Anode (positive electrode) because DNA is negatively charged", "Both electrodes equally", "Neither — DNA doesn't migrate"],
      correctIndex: 1,
      rationale: "DNA has a negative charge (phosphate backbone) and migrates toward the positive electrode (anode). Smaller fragments migrate faster through the gel matrix. Size is determined by comparison to a molecular weight ladder.",
      difficulty: 2,
      category: "Molecular Diagnostics",
      topic: "gel electrophoresis"
    },
  {
      id: "mlt-252",
      stem: "Reverse transcriptase converts:",
      options: ["DNA to RNA", "RNA to complementary DNA (cDNA)", "Protein to DNA", "DNA to protein"],
      correctIndex: 1,
      rationale: "Reverse transcriptase synthesizes cDNA from RNA template. Essential for RT-PCR (testing RNA viruses like HIV, HCV, SARS-CoV-2). The cDNA is then amplified by standard PCR.",
      difficulty: 2,
      category: "Molecular Diagnostics",
      topic: "nucleic acid amplification"
    },
  {
      id: "mlt-253",
      stem: "FISH (fluorescence in situ hybridization) is used to detect:",
      options: ["Point mutations only", "Specific chromosomal abnormalities (translocations, deletions, amplifications) using fluorescent probes", "Bacterial identification", "Protein expression"],
      correctIndex: 1,
      rationale: "FISH uses fluorescent-labeled DNA probes that hybridize to complementary sequences on chromosomes/cells. Detects BCR-ABL t(9;22), HER2 amplification, trisomies, microdeletions. Results in hours (vs days for karyotype).",
      difficulty: 3,
      category: "Molecular Diagnostics",
      topic: "genotyping"
    },
  {
      id: "mlt-254",
      stem: "Next-generation sequencing (NGS) advantage over Sanger sequencing:",
      options: ["Lower cost per base", "Massively parallel sequencing of millions of fragments simultaneously", "Longer read lengths", "More accurate single reads"],
      correctIndex: 1,
      rationale: "NGS sequences millions of DNA fragments in parallel, enabling whole-genome, whole-exome, or targeted panel sequencing in hours-days at decreasing cost. Used for tumor profiling, pharmacogenomics, inherited disease panels.",
      difficulty: 2,
      category: "Molecular Diagnostics",
      topic: "genotyping"
    },
  {
      id: "mlt-255",
      stem: "A positive PCR result in a negative-control sample indicates:",
      options: ["Excellent sensitivity", "Contamination of the PCR run — results are invalid", "Normal finding", "Strong positive patient sample"],
      correctIndex: 1,
      rationale: "Positive negative control = contamination. All results from that run are invalid and must be repeated with fresh reagents and decontaminated workspace. This is why PCR labs have separate pre-amp and post-amp areas.",
      difficulty: 2,
      category: "Molecular Diagnostics",
      topic: "PCR technique"
    },
  {
      id: "mlt-256",
      stem: "Which molecular method does NOT require thermal cycling?",
      options: ["Standard PCR", "Reverse transcription PCR", "Isothermal amplification methods (LAMP, TMA, HDA)", "Real-time PCR"],
      correctIndex: 2,
      rationale: "Isothermal amplification occurs at a constant temperature. LAMP (loop-mediated), TMA (transcription-mediated), HDA (helicase-dependent) are examples. Simpler instrumentation, useful for point-of-care testing.",
      difficulty: 3,
      category: "Molecular Diagnostics",
      topic: "nucleic acid amplification"
    },
  {
      id: "mlt-257",
      stem: "Internal controls in molecular assays serve to:",
      options: ["Identify the target pathogen", "Detect PCR inhibition or extraction failure in the patient specimen", "Verify reagent lot numbers", "Monitor room temperature"],
      correctIndex: 1,
      rationale: "Internal controls (IC) are added to each specimen before extraction. If the IC amplifies but the target doesn't, the negative result is valid (no inhibition). If IC fails, the specimen may contain inhibitors — extraction must be repeated.",
      difficulty: 2,
      category: "Molecular Diagnostics",
      topic: "PCR technique"
    },
  {
      id: "mlt-258",
      stem: "Newborn screening for genetic disorders commonly uses which specimen type?",
      options: ["Venipuncture whole blood", "Dried blood spots on filter paper (Guthrie card)", "Urine", "Saliva"],
      correctIndex: 1,
      rationale: "Dried blood spots (DBS) on filter paper: heel stick → apply to Guthrie card → dry → mail to state lab. Tested for PKU, hypothyroidism, sickle cell, CF, and 30+ conditions by tandem mass spectrometry and molecular methods.",
      difficulty: 2,
      category: "Molecular Diagnostics",
      topic: "newborn screening"
    },
  {
      id: "mlt-259",
      stem: "Universal/standard precautions require treating ALL blood and body fluids as:",
      options: ["Non-infectious unless proven otherwise", "Potentially infectious", "Sterile", "Hazardous waste only"],
      correctIndex: 1,
      rationale: "Standard precautions (replacing universal precautions): treat ALL blood and body fluids as potentially infectious regardless of patient diagnosis. PPE, hand hygiene, sharps precautions apply to every specimen.",
      difficulty: 1,
      category: "Laboratory Operations",
      topic: "OSHA regulations"
    },
  {
      id: "mlt-260",
      stem: "After a needlestick injury, the FIRST action is to:",
      options: ["Fill out an incident report", "Wash the wound with soap and water, then report to supervisor", "Ignore minor injuries", "Apply a bandage only"],
      correctIndex: 1,
      rationale: "Immediate first aid: wash wound with soap and water (mucous membrane splash → flush with water). Then report to supervisor, complete incident report, seek medical evaluation for post-exposure prophylaxis (PEP for HIV within 72 hours).",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "OSHA regulations"
    },
  {
      id: "mlt-261",
      stem: "The NFPA diamond on chemical containers: the RED section represents:",
      options: ["Health hazard", "Flammability hazard", "Reactivity/instability", "Special hazards"],
      correctIndex: 1,
      rationale: "NFPA 704 diamond: RED (top) = flammability; BLUE (left) = health hazard; YELLOW (right) = reactivity/instability; WHITE (bottom) = special hazards (oxidizer, water reactive, etc.). Numbers 0-4 indicate severity.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "OSHA regulations"
    },
  {
      id: "mlt-262",
      stem: "SDS (Safety Data Sheet) provides information about:",
      options: ["Patient test results", "Chemical hazards, safe handling, storage, emergency procedures for hazardous substances", "Equipment maintenance schedules", "Quality control procedures"],
      correctIndex: 1,
      rationale: "SDS (formerly MSDS): 16 standardized sections including chemical identity, hazards, first aid, firefighting, exposure controls, physical/chemical properties, toxicology, disposal. Must be accessible to all employees who handle the chemical.",
      difficulty: 1,
      category: "Laboratory Operations",
      topic: "OSHA regulations"
    },
  {
      id: "mlt-263",
      stem: "Biological safety cabinet (BSC) Class II is used for:",
      options: ["Chemical fume removal only", "Protection of personnel, environment, AND the specimen/product", "Centrifugation", "Refrigerated storage"],
      correctIndex: 1,
      rationale: "BSC Class II: HEPA-filtered laminar airflow protects the worker (from aerosols), the product (from contamination), and the environment (from release). Used for handling BSL-2 and BSL-3 organisms. Class I protects worker/environment only. Chemical fume hood ≠ BSC.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "OSHA regulations"
    },
  {
      id: "mlt-264",
      stem: "Proper order of PPE removal to minimize contamination:",
      options: ["Gloves → gown → face shield → hand hygiene", "Gloves → face shield → gown → hand hygiene", "Face shield → gloves → gown → hand hygiene", "Gown → gloves → face shield → hand hygiene"],
      correctIndex: 0,
      rationale: "Remove in order of most contaminated: gloves first (most likely contaminated from handling), then gown (pull from neck, roll inside out), then face shield/goggles, then perform hand hygiene immediately. Gloves always first, hand hygiene always last.",
      difficulty: 1,
      category: "Laboratory Operations",
      topic: "OSHA regulations"
    },
  {
      id: "mlt-265",
      stem: "Chemical spills of formaldehyde require:",
      options: ["Paper towels only", "Neutralization and cleanup using spill kit appropriate for the chemical, with PPE", "Ignoring if small amount", "Water dilution only"],
      correctIndex: 1,
      rationale: "Formaldehyde is a carcinogen. Spill cleanup: evacuate immediate area, don appropriate PPE (gloves, goggles, respiratory protection), use formaldehyde spill kit (neutralizer), clean area, dispose as hazardous waste, document incident.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "OSHA regulations"
    },
  {
      id: "mlt-266",
      stem: "Comma-shaped gram-negative rods from a traveler with profuse watery diarrhea ('rice-water stool'). Grows on TCBS (yellow colonies). Oxidase positive. Organism:",
      options: ["E. coli", "Vibrio cholerae", "Campylobacter", "Shigella"],
      correctIndex: 1,
      rationale: "V. cholerae: curved GN rods, oxidase+, yellow colonies on TCBS agar (sucrose fermenter). Produces cholera toxin causing massive secretory diarrhea. String test positive (mucoid string when colony mixed with 0.5% sodium deoxycholate).",
      difficulty: 3,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-267",
      stem: "Gram-positive rods with subterminal spores from a patient with antibiotic-associated diarrhea. Glutamate dehydrogenase (GDH) screen positive. Organism:",
      options: ["Bacillus cereus", "Clostridium difficile", "Clostridium perfringens", "Listeria"],
      correctIndex: 1,
      rationale: "C. difficile: GP rods, subterminal spores, causes antibiotic-associated colitis/pseudomembranous colitis. GDH is sensitive screening test. Confirm with toxin A/B EIA or PCR for tcdB gene. Treatment: oral vancomycin or fidaxomicin.",
      difficulty: 2,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-268",
      stem: "Carbapenem-resistant Enterobacteriaceae (CRE) produce which enzyme?",
      options: ["ESBL only", "Carbapenemase (KPC, NDM, OXA-48)", "Penicillinase only", "Cephalosporinase only"],
      correctIndex: 1,
      rationale: "CRE produce carbapenemases that hydrolyze carbapenems (last-resort beta-lactams). KPC (K. pneumoniae carbapenemase), NDM (New Delhi metallo-beta-lactamase), OXA-48 are major types. Treatment options limited: colistin, tigecycline, ceftazidime-avibactam.",
      difficulty: 3,
      category: "Microbiology",
      topic: "antimicrobial resistance"
    },
  {
      id: "mlt-269",
      stem: "A dimorphic fungus grows as a mold at 25°C (tuberculate macroconidia) and yeast at 37°C. Endemic to Ohio/Mississippi River valleys. Organism:",
      options: ["Coccidioides immitis", "Histoplasma capsulatum", "Blastomyces dermatitidis", "Sporothrix schenckii"],
      correctIndex: 1,
      rationale: "Histoplasma: dimorphic (mold at 25°C, yeast at 37°C), tuberculate macroconidia (knobby projections), small intracellular yeast in macrophages. Endemic to Ohio/Mississippi Valley. Associated with bat/bird droppings (caves, chicken coops).",
      difficulty: 3,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-270",
      stem: "Scotch tape (cellophane tape) test is used to detect:",
      options: ["Giardia lamblia", "Enterobius vermicularis (pinworm) eggs", "Ascaris lumbricoides", "Cryptosporidium"],
      correctIndex: 1,
      rationale: "Enterobius (pinworm): female deposits eggs in perianal area at night. Clear tape applied to perianal skin in morning, placed on slide. Eggs are oval, flattened on one side. Most common helminth infection in developed countries.",
      difficulty: 2,
      category: "Microbiology",
      topic: "parasitology"
    },
  {
      id: "mlt-271",
      stem: "A dermatophyte causing ringworm is identified by:",
      options: ["Blood culture", "KOH prep showing hyphae, culture on Sabouraud dextrose agar at 25-30°C", "Gram stain", "AFB stain"],
      correctIndex: 1,
      rationale: "Dermatophytes (Trichophyton, Microsporum, Epidermophyton): KOH dissolves keratin, revealing septate hyphae. Culture on SDA at 25-30°C for up to 4 weeks. Colony morphology + microscopic conidia identification.",
      difficulty: 2,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-272",
      stem: "Urease-positive gram-negative rod associated with gastric ulcers and gastric cancer:",
      options: ["E. coli", "Helicobacter pylori", "Proteus mirabilis", "Klebsiella"],
      correctIndex: 1,
      rationale: "H. pylori: spiral GN rod, urease+ (rapidly), microaerophilic, oxidase+, catalase+. Causes peptic ulcers and gastric MALT lymphoma. Diagnosis: CLO test (rapid urease), urea breath test, stool antigen, histology.",
      difficulty: 2,
      category: "Microbiology",
      topic: "biochemical tests"
    },
  {
      id: "mlt-273",
      stem: "Gram stain procedure in correct order:",
      options: ["Crystal violet → iodine → decolorize → safranin", "Safranin → crystal violet → iodine → decolorize", "Crystal violet → decolorize → iodine → safranin", "Iodine → crystal violet → safranin → decolorize"],
      correctIndex: 0,
      rationale: "Steps: (1) Crystal violet (primary stain, 1 min), (2) Gram's iodine (mordant, fixes CV, 1 min), (3) Decolorizer (acetone-alcohol, 5-10 sec — most critical step), (4) Safranin (counterstain, 30-60 sec). GP retain violet; GN stain pink/red.",
      difficulty: 1,
      category: "Microbiology",
      topic: "gram stain technique"
    },
  {
      id: "mlt-274",
      stem: "Green metallic sheen on EMB (eosin methylene blue) agar. Organism:",
      options: ["Klebsiella", "E. coli", "Proteus", "Pseudomonas"],
      correctIndex: 1,
      rationale: "E. coli produces a characteristic green metallic sheen on EMB agar due to vigorous lactose fermentation producing acid that precipitates the dyes. EMB is selective (inhibits GP) and differential (LF vs NLF). Other LFs produce dark purple colonies without sheen.",
      difficulty: 2,
      category: "Microbiology",
      topic: "colony morphology"
    },
  {
      id: "mlt-275",
      stem: "Beta-lactamase detection (nitrocefin test) shows color change from yellow to red. This means:",
      options: ["The organism is susceptible to penicillin", "The organism produces beta-lactamase and is resistant to penicillin", "The test is invalid", "The organism is gram-positive"],
      correctIndex: 1,
      rationale: "Nitrocefin is a chromogenic cephalosporin. Beta-lactamase cleaves the beta-lactam ring → color change yellow→red. Quick test for beta-lactamase production in H. influenzae, N. gonorrhoeae, S. aureus, Moraxella.",
      difficulty: 2,
      category: "Microbiology",
      topic: "antimicrobial resistance"
    },
  {
      id: "mlt-276",
      stem: "What is the shelf life of thawed FFP?",
      options: ["5 days at 1-6°C (becomes thawed plasma after 24 hours)", "30 days frozen", "1 hour at room temperature", "14 days at 1-6°C"],
      correctIndex: 0,
      rationale: "FFP once thawed must be used within 24 hours (stored 1-6°C) for full factor activity. After 24 hours it becomes 'thawed plasma' — still has most factors but labile V and VIII decrease. Thawed plasma good for 5 days.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "component therapy"
    },
  {
      id: "mlt-277",
      stem: "Platelet refractoriness (failure to achieve expected increment) has both immune and non-immune causes. The most common cause is:",
      options: ["HLA alloimmunization", "Fever, infection, DIC, splenomegaly (non-immune causes)", "ABO incompatibility", "Bacterial contamination"],
      correctIndex: 1,
      rationale: "Non-immune causes account for ~80% of platelet refractoriness: fever, sepsis, DIC, splenomegaly, medications. HLA alloimmunization (~20%) is managed with HLA-matched or HLA-selected platelets.",
      difficulty: 3,
      category: "Blood Banking",
      topic: "component therapy"
    },
  {
      id: "mlt-278",
      stem: "A delayed hemolytic transfusion reaction (DHTR) typically occurs:",
      options: ["Within minutes of transfusion", "3-14 days after transfusion due to anamnestic antibody response", "Immediately after transfusion", "After 30 days"],
      correctIndex: 1,
      rationale: "DHTR: 3-14 days post-transfusion. Patient had prior sensitization → antibody fell below detection → transfused with antigen-positive unit → anamnestic response → IgG antibody → extravascular hemolysis. Anti-Jk(a) is the classic culprit.",
      difficulty: 3,
      category: "Blood Banking",
      topic: "compatibility testing"
    },
  {
      id: "mlt-279",
      stem: "Bombay phenotype (Oh) individuals lack which antigen?",
      options: ["A antigen only", "B antigen only", "H antigen (precursor to A and B)", "Rh antigens"],
      correctIndex: 2,
      rationale: "Bombay: homozygous for non-functional FUT1 gene → no H antigen → cannot make A or B antigens. Type as group O but have anti-H (in addition to anti-A, anti-B). Can only receive Bombay blood. Very rare (~1:10,000 in Mumbai).",
      difficulty: 3,
      category: "Blood Banking",
      topic: "ABO typing"
    },
  {
      id: "mlt-280",
      stem: "DAT is positive in a newborn. The mother is Rh-negative, baby is Rh-positive. This suggests:",
      options: ["ABO incompatibility", "Hemolytic disease of the fetus and newborn (HDFN) due to anti-D", "Normal newborn finding", "Cold autoantibody"],
      correctIndex: 1,
      rationale: "HDFN: Rh-negative mother sensitized to D antigen (prior pregnancy/transfusion) → IgG anti-D crosses placenta → coats fetal Rh-positive RBCs → positive DAT in newborn → hemolysis. RhIG (RhoGAM) prevents sensitization.",
      difficulty: 3,
      category: "Blood Banking",
      topic: "direct antiglobulin test"
    },
  {
      id: "mlt-281",
      stem: "The minimum interval between whole blood donations is:",
      options: ["2 weeks", "4 weeks", "8 weeks (56 days)", "6 months"],
      correctIndex: 2,
      rationale: "56 days (8 weeks) between whole blood donations to allow RBC regeneration. Plateletpheresis: every 7 days (up to 24 per year). Double RBC apheresis: 16 weeks.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "donor screening"
    },
  {
      id: "mlt-282",
      stem: "Washed RBCs are indicated for patients with:",
      options: ["Normal transfusion needs", "IgA deficiency with anti-IgA antibodies (to prevent anaphylaxis)", "Iron overload", "Platelet refractoriness"],
      correctIndex: 1,
      rationale: "Washing removes plasma proteins (including IgA). Patients with IgA deficiency who have anti-IgA antibodies can have anaphylactic transfusion reactions from donor plasma IgA. Washed RBCs eliminate this risk.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "component therapy"
    },
  {
      id: "mlt-283",
      stem: "The purpose of the antiglobulin test (AHG) phase in crossmatch is to detect:",
      options: ["ABO incompatibility only", "IgG antibodies coating donor RBCs (clinically significant antibodies)", "Cold agglutinins", "Platelet antibodies"],
      correctIndex: 1,
      rationale: "AHG phase detects IgG antibodies and complement (C3d) that coat donor RBCs after 37°C incubation — clinically significant antibodies (anti-D, anti-K, anti-Fy(a), anti-Jk(a)). Cannot be detected by immediate-spin methods.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "crossmatch procedures"
    },
  {
      id: "mlt-284",
      stem: "Transfusion-related acute lung injury (TRALI) is caused by:",
      options: ["Volume overload", "Donor antibodies against recipient HLA or neutrophil antigens causing pulmonary neutrophil activation", "Bacterial contamination", "Iron overload"],
      correctIndex: 1,
      rationale: "TRALI: donor anti-HLA or anti-neutrophil antibodies activate recipient pulmonary neutrophils → capillary leak → non-cardiogenic pulmonary edema. Presents within 6 hours of transfusion. Leading cause of transfusion-related mortality. Mitigated by using male-only plasma.",
      difficulty: 3,
      category: "Blood Banking",
      topic: "component therapy"
    },
  {
      id: "mlt-285",
      stem: "Anti-HCV antibody positive. Confirmatory test:",
      options: ["Repeat anti-HCV", "HCV RNA by PCR (NAT) to confirm active infection", "Liver biopsy", "HBsAg"],
      correctIndex: 1,
      rationale: "Anti-HCV = screening. Positive → HCV RNA (NAT) to confirm active infection vs resolved. Anti-HCV can persist after resolution. HCV RNA+ = active infection requiring treatment. Genotyping guides treatment selection.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "hepatitis panels"
    },
  {
      id: "mlt-286",
      stem: "Anti-centromere antibodies are most associated with:",
      options: ["SLE", "Limited scleroderma (CREST syndrome)", "Rheumatoid arthritis", "Sjögren syndrome"],
      correctIndex: 1,
      rationale: "Anti-centromere: specific for limited scleroderma (CREST: Calcinosis, Raynaud, Esophageal dysmotility, Sclerodactyly, Telangiectasia). Centromere pattern on ANA IFA. Diffuse scleroderma has anti-Scl-70 (anti-topoisomerase I).",
      difficulty: 3,
      category: "Immunology/Serology",
      topic: "autoimmune markers"
    },
  {
      id: "mlt-287",
      stem: "Anti-mitochondrial antibodies (AMA) are characteristic of:",
      options: ["SLE", "Primary biliary cholangitis (PBC)", "Rheumatoid arthritis", "Type 1 diabetes"],
      correctIndex: 1,
      rationale: "AMA (especially anti-M2/pyruvate dehydrogenase complex) is >90% specific for PBC (primary biliary cholangitis). PBC: autoimmune destruction of intrahepatic bile ducts → cholestasis → cirrhosis. AMA + elevated ALP confirms diagnosis.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "autoimmune markers"
    },
  {
      id: "mlt-288",
      stem: "C-reactive protein (CRP) is an acute-phase reactant produced by:",
      options: ["T-lymphocytes", "Liver (in response to IL-6)", "Kidney", "Bone marrow"],
      correctIndex: 1,
      rationale: "CRP synthesized by hepatocytes in response to IL-6 (from macrophages during inflammation). Rises within 6-8 hours, peaks at 48 hours. Non-specific marker of inflammation, infection, tissue injury. High-sensitivity CRP (hs-CRP) used for cardiovascular risk assessment.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "complement system"
    },
  {
      id: "mlt-289",
      stem: "Western blot separates proteins by:",
      options: ["Charge only", "Molecular weight using SDS-PAGE, then transfers to membrane for antibody detection", "Size exclusion chromatography", "Isoelectric focusing"],
      correctIndex: 1,
      rationale: "Western blot: proteins separated by SDS-PAGE (by molecular weight), transferred to nitrocellulose/PVDF membrane, probed with labeled antibodies. Previously used as confirmatory test for HIV (replaced by HIV-1/2 differentiation assay in current algorithm).",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "EIA methodology"
    },
  {
      id: "mlt-290",
      stem: "First antibody produced in a primary immune response:",
      options: ["IgG", "IgM", "IgA", "IgE"],
      correctIndex: 1,
      rationale: "IgM = first antibody in primary response (appears ~5-7 days). Pentamer with 10 antigen-binding sites — excellent agglutinator. IgG = secondary/memory response (class switching). IgM in serum suggests acute/recent infection.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "immunoglobulin levels"
    },
  {
      id: "mlt-291",
      stem: "Troponin I vs Troponin T: a key difference in renal disease:",
      options: ["No difference", "High-sensitivity TnT is more commonly elevated in CKD; TnI may be more specific for MI in CKD patients", "TnI is always elevated in CKD", "Neither is affected by renal disease"],
      correctIndex: 1,
      rationale: "hs-TnT is frequently elevated in CKD patients without ACS (from chronic myocardial stress, LVH, and possibly reduced clearance). hs-TnI may have slightly better specificity for acute MI in CKD. Serial measurements showing rise/fall are key for acute MI diagnosis regardless.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-292",
      stem: "Corrected calcium formula when albumin is low:",
      options: ["Corrected Ca = Measured Ca + 0.8 × (4.0 − albumin)", "Corrected Ca = Measured Ca × 2", "Corrected Ca = Measured Ca − albumin", "No correction needed"],
      correctIndex: 0,
      rationale: "For each 1 g/dL decrease in albumin below 4.0, total calcium decreases ~0.8 mg/dL. Correction: Ca + 0.8 × (4.0 − albumin). Ionized calcium is the definitive test as it is unaffected by albumin.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "electrolyte panels"
    },
  {
      id: "mlt-293",
      stem: "Ammonia levels are measured in patients with:",
      options: ["Diabetes", "Hepatic encephalopathy (liver failure — liver cannot convert ammonia to urea)", "Kidney disease", "Thyroid disease"],
      correctIndex: 1,
      rationale: "The liver converts ammonia to urea (urea cycle). In liver failure, ammonia accumulates → crosses blood-brain barrier → hepatic encephalopathy (confusion, asterixis, coma). Specimen must be transported on ice and analyzed immediately (ammonia increases in vitro).",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "liver function tests"
    },
  {
      id: "mlt-294",
      stem: "An arterial blood gas with pH 7.35, pCO₂ 60, HCO₃⁻ 33 represents:",
      options: ["Acute respiratory acidosis", "Chronic respiratory acidosis with metabolic compensation", "Metabolic alkalosis", "Normal"],
      correctIndex: 1,
      rationale: "pH low-normal, elevated pCO₂ (respiratory acidosis), elevated HCO₃⁻ (renal compensation). The near-normal pH despite high pCO₂ indicates chronic compensation (kidneys retain HCO₃⁻). Acute respiratory acidosis would show normal HCO₃⁻ with lower pH.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "electrolyte panels"
    },
  {
      id: "mlt-295",
      stem: "High-sensitivity troponin assays can detect MI earlier because:",
      options: ["They use a different troponin", "They can measure troponin at concentrations 10-100× lower than conventional assays", "They only measure cardiac troponin", "They are faster to run"],
      correctIndex: 1,
      rationale: "hs-Tn assays detect troponin in the ng/L (pg/mL) range vs µg/L for conventional. This allows detection of smaller rises earlier in MI course. 99th percentile URL defines the upper reference limit. Enables 0/1 or 0/3 hour rule-out protocols.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "cardiac biomarkers"
    },
  {
      id: "mlt-296",
      stem: "Glycated hemoglobin (HbA1c) formation is a _____ process:",
      options: ["Enzymatic", "Non-enzymatic (glycation — glucose binds hemoglobin without enzyme)", "Immune-mediated", "Genetic"],
      correctIndex: 1,
      rationale: "HbA1c forms by non-enzymatic glycation — glucose spontaneously binds the N-terminal valine of the beta-globin chain. Rate is proportional to average glucose concentration. The higher the average glucose, the more glycation occurs.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-297",
      stem: "Tumor markers AFP, hCG, and LDH are used together for staging:",
      options: ["Breast cancer", "Testicular germ cell tumors", "Colon cancer", "Lung cancer"],
      correctIndex: 1,
      rationale: "Testicular cancer staging uses AFP (yolk sac tumor), hCG (choriocarcinoma, embryonal), and LDH (general tumor burden). Seminomas: hCG may be mildly elevated; AFP is NOT elevated (if AFP elevated, treat as non-seminoma).",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-298",
      stem: "Diabetic ketoacidosis (DKA) lab findings:",
      options: ["Low glucose, metabolic alkalosis, low ketones", "High glucose (>250), metabolic acidosis with high anion gap, positive ketones, low HCO₃⁻", "Normal glucose, respiratory alkalosis", "Low glucose, respiratory acidosis"],
      correctIndex: 1,
      rationale: "DKA: glucose >250, pH <7.3, HCO₃⁻ <18, anion gap elevated (>12), positive serum/urine ketones. Caused by absolute insulin deficiency → lipolysis → ketone production → metabolic acidosis. Primarily in type 1 DM.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "glucose testing"
    },
  {
      id: "mlt-299",
      stem: "Specimen for potassium testing should NOT be:",
      options: ["Hemolyzed — RBC K⁺ (~150 mEq/L) falsely elevates result", "Collected in green top", "Drawn by venipuncture", "Centrifuged promptly"],
      correctIndex: 0,
      rationale: "Hemolysis is the most common pre-analytical cause of falsely elevated potassium. RBCs contain ~150 mEq/L K⁺ (vs plasma ~4). Even slight hemolysis significantly raises K⁺. Reject hemolyzed specimens for K⁺ measurement.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "electrolyte panels"
    },
  {
      id: "mlt-300",
      stem: "Oval fat bodies in urine indicate:",
      options: ["Normal finding", "Nephrotic syndrome (lipiduria from proteinuria)", "UTI", "Dehydration"],
      correctIndex: 1,
      rationale: "Oval fat bodies = renal tubular epithelial cells or macrophages that have absorbed lipid. Under polarized light, cholesterol forms 'Maltese cross' pattern. Pathognomonic for nephrotic syndrome (massive proteinuria → lipiduria).",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "microscopic sediment"
    },
  {
      id: "mlt-301",
      stem: "Normal urine pH range:",
      options: ["1.0-3.0", "4.5-8.0 (average 6.0)", "9.0-12.0", "Exactly 7.0"],
      correctIndex: 1,
      rationale: "Normal urine pH 4.5-8.0, average ~6.0 (slightly acidic). Acidic: high-protein diet, DKA, starvation. Alkaline: UTI (urease bacteria), vegetarian diet, renal tubular acidosis, old specimens (bacterial conversion of urea to ammonia).",
      difficulty: 1,
      category: "Urinalysis/Body Fluids",
      topic: "microscopic sediment"
    },
  {
      id: "mlt-302",
      stem: "Normal adult CSF cell count:",
      options: ["0-5 WBCs/µL (no RBCs)", "50-100 WBCs/µL", "500+ WBCs/µL", "No cells ever present"],
      correctIndex: 0,
      rationale: "Normal CSF: 0-5 WBCs/µL (mononuclear cells), no RBCs. Elevated WBCs (pleocytosis): bacterial meningitis (neutrophils predominate), viral meningitis (lymphocytes predominate). Correct for traumatic tap: subtract 1 WBC per 700 RBCs.",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "CSF analysis"
    },
  {
      id: "mlt-303",
      stem: "Broad waxy casts in urine sediment indicate:",
      options: ["Early kidney infection", "Advanced chronic renal failure (formed in dilated collecting ducts)", "Mild dehydration", "Normal finding with exercise"],
      correctIndex: 1,
      rationale: "Broad waxy casts form in dilated, damaged collecting ducts with slow urine flow — end-stage renal disease. Called 'renal failure casts.' The waxy appearance reflects long residence time in tubules allowing protein degeneration.",
      difficulty: 3,
      category: "Urinalysis/Body Fluids",
      topic: "microscopic sediment"
    },
  {
      id: "mlt-304",
      stem: "Needle-shaped, negatively birefringent crystals under polarized light from joint fluid:",
      options: ["Calcium pyrophosphate (CPPD)", "Monosodium urate (MSU) — gout", "Cholesterol", "Corticosteroid"],
      correctIndex: 1,
      rationale: "MSU crystals in gout: needle-shaped, strongly negatively birefringent (yellow when parallel to compensator). CPPD (pseudogout): rhomboid, weakly positively birefringent (blue parallel). Crystal identification from synovial fluid is the gold standard for gout diagnosis.",
      difficulty: 3,
      category: "Urinalysis/Body Fluids",
      topic: "crystal identification"
    },
  {
      id: "mlt-305",
      stem: "FIT (fecal immunochemical test) advantages over guaiac FOBT:",
      options: ["No dietary restrictions, specific for human hemoglobin, better for colorectal cancer screening", "Cheaper only", "Faster results only", "Detects upper GI bleeding better"],
      correctIndex: 0,
      rationale: "FIT uses antibodies specific for human globin — no false positives from diet (red meat, peroxidase-rich vegetables). More sensitive and specific than guaiac for colorectal cancer. Preferred screening method. Does not detect upper GI bleeding (globin digested in stomach).",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "fecal occult blood"
    },
  {
      id: "mlt-306",
      stem: "Urine dipstick positive for protein (primarily detects):",
      options: ["All proteins equally", "Albumin predominantly (may miss Bence Jones protein, globulins)", "Only globulins", "Only hemoglobin"],
      correctIndex: 1,
      rationale: "Dipstick protein pad uses the 'protein error of indicators' principle — primarily detects albumin. May miss Bence Jones protein (free light chains), myoglobin, and low concentrations of other proteins. Sulfosalicylic acid (SSA) detects all proteins.",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "microscopic sediment"
    },
  {
      id: "mlt-307",
      stem: "Reference range (normal range) is typically established from:",
      options: ["Random selection of 10 patients", "Testing ≥120 healthy individuals and using central 95% (mean ± 2SD or 2.5th-97.5th percentile)", "Manufacturer's package insert only", "A single calibrator value"],
      correctIndex: 1,
      rationale: "CLSI C28-A3: minimum 120 reference individuals per partition (age, sex). Calculate 2.5th and 97.5th percentiles (central 95%). Non-parametric method preferred. Labs can also verify manufacturer's ranges with 20 specimens (if ≤2/20 fall outside = verified).",
      difficulty: 2,
      category: "Quality Assurance",
      topic: "method validation"
    },
  {
      id: "mlt-308",
      stem: "The 10x Westgard rule means:",
      options: ["10 consecutive values exceed 3 SD", "10 consecutive values fall on the same side of the mean", "10 values exceed 1 SD", "10 different analytes are out of range"],
      correctIndex: 1,
      rationale: "10x rule: 10 consecutive QC values on the same side of the mean = systematic shift. Even if all values are within 2 SD, this pattern is non-random and indicates calibration drift or systematic change requiring investigation.",
      difficulty: 2,
      category: "Quality Assurance",
      topic: "Levey-Jennings charts"
    },
  {
      id: "mlt-309",
      stem: "Autoverification in the LIS means:",
      options: ["All results require manual review", "Results meeting predefined criteria are automatically released without technologist review", "Results are automatically rechecked by a second analyzer", "Only critical values are auto-released"],
      correctIndex: 1,
      rationale: "Autoverification: rules-based system that releases results meeting specific criteria (within reference/reportable range, delta check OK, QC acceptable, no instrument flags). Results failing any criterion are held for manual review. Increases efficiency.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "LIS operations"
    },
  {
      id: "mlt-310",
      stem: "CLIA-mandated competency assessment for laboratory personnel includes:",
      options: ["Written exam only", "Direct observation, record review, PT/alternative assessment, problem-solving — assessed during first year and annually thereafter", "Only at time of hire", "Every 5 years"],
      correctIndex: 1,
      rationale: "CLIA competency: 6 methods including direct observation, monitoring recording/reporting, specimen testing, written/oral skills assessment, problem-solving with unknown specimens, and checklist/evaluation. Semiannually during first year, then annually.",
      difficulty: 3,
      category: "Laboratory Operations",
      topic: "CLIA requirements"
    },
  {
      id: "mlt-311",
      stem: "In forensic drug testing, the confirmatory method after immunoassay screening is:",
      options: ["Repeat immunoassay", "GC-MS or LC-MS/MS (mass spectrometry-based confirmation)", "Lateral flow immunoassay", "Visual inspection"],
      correctIndex: 1,
      rationale: "Immunoassay screening (EMIT, CEDIA) is sensitive but cross-reactive. Positive screens must be confirmed by mass spectrometry (GC-MS or LC-MS/MS), which provides definitive identification based on mass/charge ratio. Different methodology principle eliminates false positives.",
      difficulty: 3,
      category: "Laboratory Operations",
      topic: "chain of custody"
    },
  {
      id: "mlt-312",
      stem: "Standard deviation index (SDI) in proficiency testing:",
      options: ["Measures precision of a single run", "(Lab result − group mean) / group SD — measures how far from peer group mean", "Always equals zero", "Only applies to hematology"],
      correctIndex: 1,
      rationale: "SDI = (lab value − group mean) / group SD. SDI ±2 = acceptable performance. SDI >2 = investigate positive bias. SDI <-2 = investigate negative bias. SDI helps identify systematic differences from peer group.",
      difficulty: 3,
      category: "Quality Assurance",
      topic: "calibration verification"
    },
  {
      id: "mlt-313",
      stem: "Melt curve analysis in real-time PCR is used to:",
      options: ["Quantify viral load", "Verify specificity of PCR product by its melting temperature (Tm)", "Extract DNA", "Prepare primers"],
      correctIndex: 1,
      rationale: "After SYBR Green real-time PCR, melt curve analysis confirms product specificity. Each PCR product has a characteristic Tm based on length and GC content. Multiple peaks = non-specific products or primer dimers. Single sharp peak = specific amplification.",
      difficulty: 3,
      category: "Molecular Diagnostics",
      topic: "PCR technique"
    },
  {
      id: "mlt-314",
      stem: "Pharmacogenomics testing for CYP2D6 is clinically important because:",
      options: ["CYP2D6 genotype doesn't affect drug metabolism", "CYP2D6 poor metabolizers may have toxicity or treatment failure depending on the drug", "All patients metabolize drugs identically", "CYP2D6 only affects one drug"],
      correctIndex: 1,
      rationale: "CYP2D6 metabolizes ~25% of drugs (codeine, tamoxifen, SSRIs). Poor metabolizers (PM): may have toxicity from drug accumulation or treatment failure if prodrug requires activation (codeine → morphine). Ultra-rapid metabolizers: increased adverse effects from excessive active metabolite.",
      difficulty: 2,
      category: "Molecular Diagnostics",
      topic: "genotyping"
    },
  {
      id: "mlt-315",
      stem: "Specimen types suitable for SARS-CoV-2 RT-PCR:",
      options: ["Serum only", "Nasopharyngeal swab, anterior nares swab, saliva", "Urine", "Stool only"],
      correctIndex: 1,
      rationale: "NP swab is the gold standard for respiratory virus detection. Anterior nares and saliva also validated. Upper respiratory specimens for acute diagnosis. Lower respiratory (BAL) for hospitalized patients with negative upper respiratory testing.",
      difficulty: 2,
      category: "Molecular Diagnostics",
      topic: "nucleic acid amplification"
    },
  {
      id: "mlt-316",
      stem: "HPLC in the clinical lab is used for:",
      options: ["DNA sequencing", "Hemoglobin variant identification, drug level quantification, amino acid analysis", "Cell counting", "Electrolyte measurement"],
      correctIndex: 1,
      rationale: "HPLC separates analytes by differential affinity for stationary vs mobile phase. Clinical uses: HbA1c and hemoglobin variants, therapeutic drug monitoring, amino acids (newborn screening), catecholamines, vitamin D.",
      difficulty: 2,
      category: "Molecular Diagnostics",
      topic: "HPLC methods"
    },
  {
      id: "mlt-317",
      stem: "Formaldehyde exposure limit (OSHA PEL) monitoring is required because formaldehyde is a:",
      options: ["Mild irritant only", "Known human carcinogen", "Vitamin supplement", "Fire suppressant"],
      correctIndex: 1,
      rationale: "Formaldehyde is classified as a known human carcinogen (IARC Group 1) and suspected to cause nasopharyngeal cancer and myeloid leukemia. OSHA PEL: 0.75 ppm (8-hour TWA). Labs using formalin (10% formaldehyde) must monitor exposure and provide adequate ventilation.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "OSHA regulations"
    },
  {
      id: "mlt-318",
      stem: "Sharps containers should be replaced when they are:",
      options: ["Completely full", "Two-thirds to three-quarters full", "Only when sharps protrude", "Once per year regardless of level"],
      correctIndex: 1,
      rationale: "Replace sharps containers when 2/3 to 3/4 full. Overfilling increases needlestick risk. Containers must be closable, puncture-resistant, labeled with biohazard symbol, and located at the point of use. Never reach into a sharps container.",
      difficulty: 1,
      category: "Laboratory Operations",
      topic: "OSHA regulations"
    },
  {
      id: "mlt-319",
      stem: "The correct procedure for pipetting in the laboratory:",
      options: ["Mouth pipetting is acceptable for non-toxic solutions", "Mechanical pipetting devices must always be used — never mouth pipette", "Mouth pipetting is acceptable if wearing gloves", "Mouth pipetting is acceptable for distilled water only"],
      correctIndex: 1,
      rationale: "OSHA prohibits mouth pipetting for ANY substance in the laboratory. Mechanical devices (automatic pipettors, rubber bulbs) must always be used. Even non-hazardous liquids may be contaminated with biological hazards.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "OSHA regulations"
    },
  {
      id: "mlt-320",
      stem: "Lactic acid (lactate) >4 mmol/L in a critically ill patient indicates:",
      options: ["Normal metabolism", "Tissue hypoperfusion/hypoxia — associated with increased mortality in sepsis", "Respiratory alkalosis", "Renal failure"],
      correctIndex: 1,
      rationale: "Elevated lactate = anaerobic metabolism from tissue hypoperfusion. In sepsis, lactate >4 mmol/L indicates severe sepsis/septic shock with higher mortality. Serial lactate monitoring guides resuscitation (lactate clearance). Normal <2 mmol/L.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-321",
      stem: "Digoxin toxicity is potentiated by:",
      options: ["Hyperkalemia", "Hypokalemia (K⁺ and digoxin compete for the same binding site on Na⁺/K⁺-ATPase)", "Hypermagnesemia", "Hypernatremia"],
      correctIndex: 1,
      rationale: "Digoxin binds Na⁺/K⁺-ATPase. Hypokalemia increases digoxin binding (less K⁺ competition) → toxicity at 'therapeutic' levels. Always monitor K⁺, Mg²⁺, and Ca²⁺ with digoxin therapy. Hypomagnesemia also potentiates toxicity.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "therapeutic drug monitoring"
    },
  {
      id: "mlt-322",
      stem: "The most critical step in the Gram stain procedure is:",
      options: ["Crystal violet application", "Iodine mordanting", "Decolorization (acetone-alcohol timing)", "Safranin counterstaining"],
      correctIndex: 2,
      rationale: "Decolorization is most critical — too short = GN appears GP (under-decolorized); too long = GP appears GN (over-decolorized). 5-10 seconds for acetone-alcohol or until clear runoff. Thin smears decolorize faster than thick.",
      difficulty: 2,
      category: "Microbiology",
      topic: "gram stain technique"
    },
  {
      id: "mlt-323",
      stem: "Blood cultures should be drawn:",
      options: ["After starting antibiotics", "Before starting antibiotics (2 sets from separate sites)", "From IV line only", "One set from one site is sufficient"],
      correctIndex: 1,
      rationale: "Always draw blood cultures BEFORE antibiotics to maximize detection. Two sets (aerobic + anaerobic bottles) from two separate venipuncture sites to distinguish true bacteremia from contamination. At least 20 mL total blood volume.",
      difficulty: 2,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-324",
      stem: "The correct sequence for ABO compatibility in platelet transfusion:",
      options: ["Must be identical ABO", "ABO-identical preferred; ABO-compatible acceptable; ABO-incompatible may be used with caution", "Only type O platelets", "ABO testing not required for platelets"],
      correctIndex: 1,
      rationale: "ABO-identical platelets preferred (best increment). ABO-compatible acceptable. ABO-incompatible can be used (especially apheresis with low plasma volume) but may have slightly lower increments. Major concern: donor plasma anti-A/B against recipient RBCs.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "component therapy"
    },
  {
      id: "mlt-325",
      stem: "Blood donor age requirement (AABB standards):",
      options: ["18 years or older (16-17 with parental consent in many states)", "21 and older", "No age requirement", "25 and older"],
      correctIndex: 0,
      rationale: "AABB: 16+ with parental consent (varies by state law), or 17+ without. No upper age limit if healthy. Weight ≥110 lbs for whole blood. Must pass medical history questionnaire and physical assessment (temp, BP, pulse, Hgb/Hct).",
      difficulty: 1,
      category: "Blood Banking",
      topic: "donor screening"
    },
  {
      id: "mlt-326",
      stem: "Hepatitis D (delta agent) requires co-infection with:",
      options: ["Hepatitis A", "Hepatitis B (needs HBsAg for its envelope)", "Hepatitis C", "No co-infection needed"],
      correctIndex: 1,
      rationale: "HDV is a defective RNA virus requiring HBsAg for its outer envelope. Can occur as co-infection (simultaneous HBV+HDV) or superinfection (HDV on chronic HBV). Superinfection more likely to cause fulminant hepatitis and accelerated cirrhosis.",
      difficulty: 3,
      category: "Immunology/Serology",
      topic: "hepatitis panels"
    },
  {
      id: "mlt-327",
      stem: "Anti-SSA (Ro) and anti-SSB (La) antibodies are associated with:",
      options: ["RA", "Sjögren syndrome and SLE", "Scleroderma", "Polymyositis"],
      correctIndex: 1,
      rationale: "Anti-SSA/Ro: Sjögren, SLE, neonatal lupus (crosses placenta → congenital heart block). Anti-SSB/La: more specific for Sjögren. These extractable nuclear antigens (ENA) produce speckled ANA pattern.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "autoimmune markers"
    },
  {
      id: "mlt-328",
      stem: "Squamous epithelial cells in large numbers in a urine specimen indicate:",
      options: ["Kidney disease", "Specimen contamination (improper collection technique)", "Bladder cancer", "UTI"],
      correctIndex: 1,
      rationale: "Squamous epithelial cells line the distal urethra and vagina. Large numbers = contamination from genital/perineal skin. Specimen may be unsuitable for culture. Request clean-catch midstream or catheterized specimen.",
      difficulty: 1,
      category: "Urinalysis/Body Fluids",
      topic: "microscopic sediment"
    },
  {
      id: "mlt-329",
      stem: "Muddy brown granular casts indicate:",
      options: ["Normal finding", "Acute tubular necrosis (ATN)", "Glomerulonephritis", "Pyelonephritis"],
      correctIndex: 1,
      rationale: "Muddy brown granular casts = pathognomonic for ATN (acute tubular necrosis). Formed from degenerating renal tubular epithelial cells in the tubular lumen. ATN causes: ischemia (shock, sepsis) or nephrotoxins (aminoglycosides, contrast dye, myoglobin).",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "microscopic sediment"
    },
  {
      id: "mlt-330",
      stem: "Analytical sensitivity (limit of detection/LOD) is:",
      options: ["Highest measurable concentration", "Lowest concentration that can be reliably distinguished from zero (blank)", "The reference range", "The reportable range"],
      correctIndex: 1,
      rationale: "LOD = lowest analyte concentration that can be detected (statistically different from blank). Not necessarily quantified accurately (that's LOQ/LLOQ). Determined by measuring blank samples multiple times: LOD = mean blank + 2-3 SD of blank.",
      difficulty: 2,
      category: "Quality Assurance",
      topic: "method validation"
    },
  {
      id: "mlt-331",
      stem: "What is the purpose of the annealing step in PCR?",
      options: ["Separate DNA strands", "Allow primers to bind to complementary target sequences", "Extend new DNA strands", "Denature proteins"],
      correctIndex: 1,
      rationale: "Annealing (55-65°C): temperature low enough for primers to hybridize to complementary sequences on denatured DNA template, but high enough to prevent non-specific binding. Primer design and annealing temperature determine specificity.",
      difficulty: 2,
      category: "Molecular Diagnostics",
      topic: "PCR technique"
    },
  {
      id: "mlt-332",
      stem: "Fire extinguisher type appropriate for electrical fires:",
      options: ["Class A (water)", "Class B (CO₂ or dry chemical)", "Class C (CO₂ or dry chemical)", "Class D (special powder)"],
      correctIndex: 2,
      rationale: "Class C: electrical fires — use CO₂ or dry chemical (non-conductive agents). NEVER water on electrical fires. Class A = ordinary combustibles (water/foam). Class B = flammable liquids (CO₂, dry chemical, foam). Class D = combustible metals.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "OSHA regulations"
    },
  {
      id: "mlt-333",
      stem: "A patient with sickle cell disease has WBC 18 × 10⁹/L. Which artifact may falsely elevate the WBC count?",
      options: ["EDTA-induced clumping", "Sickle cells and nucleated RBCs counted as WBCs by the analyzer", "Lipemia", "Cold agglutinins"],
      correctIndex: 1,
      rationale: "Sickle cells can be mistaken for WBCs by some analyzers, and sickle cell patients often have nucleated RBCs (from chronic hemolysis/extramedullary hematopoiesis) that are counted as WBCs. Always verify with nRBC correction and manual differential.",
      difficulty: 2,
      category: "Hematology",
      topic: "CBC interpretation"
    },
  {
      id: "mlt-334",
      stem: "Hemoglobin H inclusions (golf ball pattern) are seen with which stain?",
      options: ["Wright stain", "Supravital stain (brilliant cresyl blue)", "Prussian blue", "PAS stain"],
      correctIndex: 1,
      rationale: "HbH (β4 tetramers) in alpha-thalassemia intermedia (3-gene deletion) can be demonstrated by supravital staining with brilliant cresyl blue — multiple small inclusions create a 'golf ball' appearance. HbH is unstable and precipitates.",
      difficulty: 3,
      category: "Hematology",
      topic: "RBC morphology"
    },
  {
      id: "mlt-335",
      stem: "A mixing study shows immediate correction of aPTT but after 2-hour incubation at 37°C, the aPTT becomes prolonged again. This is characteristic of:",
      options: ["Factor XII deficiency", "Factor VIII inhibitor (time-dependent)", "Lupus anticoagulant", "Heparin effect"],
      correctIndex: 1,
      rationale: "Factor VIII inhibitors are time- and temperature-dependent — they require incubation to fully inactivate Factor VIII. Immediate mixing appears to correct, but after 1-2 hours at 37°C, the inhibitor inactivates VIII and aPTT re-prolongs. This is the Bethesda assay principle.",
      difficulty: 3,
      category: "Hematology",
      topic: "coagulation cascade"
    },
  {
      id: "mlt-336",
      stem: "Bernard-Soulier syndrome vs Glanzmann thrombasthenia: the key difference is:",
      options: ["Bernard-Soulier has absent ristocetin aggregation + giant platelets; Glanzmann has absent aggregation with all agonists EXCEPT ristocetin", "Both have the same pattern", "Bernard-Soulier affects coagulation factors", "Glanzmann has giant platelets"],
      correctIndex: 0,
      rationale: "BSS: GPIb/IX/V deficiency → absent ristocetin aggregation + giant platelets + mild thrombocytopenia. GT: GPIIb/IIIa deficiency → absent aggregation to all agonists except ristocetin + normal platelet count/size.",
      difficulty: 3,
      category: "Hematology",
      topic: "platelet disorders"
    },
  {
      id: "mlt-337",
      stem: "Philadelphia chromosome t(9;22) is found in both CML and a subset of ALL. How do they differ?",
      options: ["They are the same disease", "CML has p210 BCR-ABL1 protein; Ph+ ALL usually has p190 BCR-ABL1", "The translocation is identical in both", "Only CML has the Philadelphia chromosome"],
      correctIndex: 1,
      rationale: "CML: major breakpoint → p210 protein (larger). Ph+ ALL: minor breakpoint → p190 protein (smaller) in most cases. Both are treated with tyrosine kinase inhibitors (imatinib), but Ph+ ALL has worse prognosis and requires additional chemotherapy.",
      difficulty: 3,
      category: "Hematology",
      topic: "leukemia identification"
    },
  {
      id: "mlt-338",
      stem: "A hemolyzed specimen falsely elevates which analytes?",
      options: ["Sodium and chloride", "Potassium, LDH, AST, phosphorus, magnesium", "Glucose and albumin", "Calcium and total protein"],
      correctIndex: 1,
      rationale: "Hemolysis releases intracellular contents: K⁺ (major), LDH (very high in RBCs), AST (moderate), phosphorus, magnesium. Also falsely elevates hemoglobin measurement. Does NOT significantly affect Na⁺, Cl⁻, or glucose.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "electrolyte panels"
    },
  {
      id: "mlt-339",
      stem: "A random glucose of 220 mg/dL with polyuria, polydipsia, and unexplained weight loss. Diagnosis:",
      options: ["Normal", "Pre-diabetes", "Diabetes mellitus (symptoms + random glucose ≥200 is diagnostic without repeat)", "Needs OGTT confirmation"],
      correctIndex: 2,
      rationale: "ADA: random glucose ≥200 mg/dL WITH classic symptoms (polyuria, polydipsia, weight loss) = diabetes. No need for repeat testing. Asymptomatic: need two abnormal results on same or different occasions.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "glucose testing"
    },
  {
      id: "mlt-340",
      stem: "Creatinine clearance estimates GFR by collecting:",
      options: ["Random urine and serum creatinine", "24-hour urine and serum creatinine — CrCl = (U×V)/P × 1.73/BSA", "Blood only", "A timed 4-hour urine"],
      correctIndex: 1,
      rationale: "CrCl = (urine Cr × volume)/(serum Cr × time) corrected for BSA. 24-hour urine collection measures actual creatinine excretion. Cockroft-Gault and CKD-EPI equations estimate GFR from serum creatinine without urine collection.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "renal function tests"
    },
  {
      id: "mlt-341",
      stem: "Elevated procalcitonin (PCT) most specifically suggests:",
      options: ["Viral infection", "Bacterial infection (more specific than CRP)", "Autoimmune disease", "Malignancy"],
      correctIndex: 1,
      rationale: "Procalcitonin rises rapidly in bacterial infection (2-4 hours), remains low in viral infections and autoimmune inflammation. More specific than CRP for bacterial etiology. Used to guide antibiotic stewardship — declining PCT supports antibiotic de-escalation.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-342",
      stem: "Specimen collection for ionized calcium requires:",
      options: ["No special handling", "Anaerobic collection, no tourniquet prolongation, minimal air exposure, analyze quickly", "Room temperature storage for 24 hours", "Serum separator tube"],
      correctIndex: 1,
      rationale: "Ionized Ca²⁺ is affected by pH: loss of CO₂ (air exposure) → pH rises → more Ca²⁺ binds albumin → falsely low ionized Ca. Collect anaerobically, avoid prolonged tourniquet (causes lactic acid). Analyze within 30 minutes or use capped syringe.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "electrolyte panels"
    },
  {
      id: "mlt-343",
      stem: "5'-nucleotidase (5'NT) is elevated in:",
      options: ["Bone disease", "Liver/biliary disease (like GGT — helps confirm hepatic source of elevated ALP)", "Muscle disease", "Heart disease"],
      correctIndex: 1,
      rationale: "5'NT, like GGT, is elevated in hepatobiliary disease but NOT bone disease. If ALP is elevated and the source is unclear, 5'NT or GGT can differentiate liver (elevated) from bone (normal). 5'NT is slightly more specific than GGT.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "liver function tests"
    },
  {
      id: "mlt-344",
      stem: "ACTH stimulation test is used to diagnose:",
      options: ["Hyperthyroidism", "Adrenal insufficiency (Addison disease)", "Diabetes", "Pheochromocytoma"],
      correctIndex: 1,
      rationale: "Cosyntropin (synthetic ACTH) is administered. Normal adrenals respond with cortisol >18-20 µg/dL at 30-60 min. Failure to respond = adrenal insufficiency. Primary (Addison): high ACTH, low cortisol, failed stimulation. Secondary (pituitary): low ACTH, low cortisol.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "endocrine testing"
    },
  {
      id: "mlt-345",
      stem: "Isoelectric focusing (IEF) is the reference method for:",
      options: ["Hemoglobin electrophoresis and HbA1c", "Serum protein electrophoresis", "Lipoprotein analysis", "Glucose measurement"],
      correctIndex: 0,
      rationale: "IEF separates hemoglobin variants by isoelectric point with superior resolution compared to conventional electrophoresis. Newborn screening programs use IEF to detect hemoglobinopathies (HbS, HbC, HbE). Also used for CSF oligoclonal band detection.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-346",
      stem: "NT-proBNP vs BNP: a key difference:",
      options: ["They measure the same thing", "NT-proBNP has longer half-life, higher levels, and is cleared by kidneys; BNP is cleared by neprilysin", "BNP is more affected by renal function", "NT-proBNP is only elevated in MI"],
      correctIndex: 1,
      rationale: "ProBNP is cleaved into active BNP and inactive NT-proBNP. BNP: shorter half-life (~20 min), cleared by neprilysin. NT-proBNP: longer half-life (~120 min), renally cleared (more affected by renal function). Different cutoffs. Both diagnose/monitor heart failure.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "cardiac biomarkers"
    },
  {
      id: "mlt-347",
      stem: "Inducible clindamycin resistance in Staphylococcus is detected by:",
      options: ["Standard disk diffusion with clindamycin alone", "D-zone test (erythromycin disk near clindamycin disk — D-shaped flattening of zone)", "MIC only", "Beta-lactamase test"],
      correctIndex: 1,
      rationale: "D-zone test: erythromycin disk placed 15-26mm from clindamycin disk. If erythromycin induces clindamycin resistance via erm gene, the clindamycin zone flattens into a D-shape adjacent to erythromycin. Positive D-zone = report clindamycin resistant.",
      difficulty: 3,
      category: "Microbiology",
      topic: "antimicrobial resistance"
    },
  {
      id: "mlt-348",
      stem: "Chocolate agar is used for fastidious organisms because:",
      options: ["It contains antibiotics for selection", "Heated blood releases intracellular growth factors (X and V) and reduces inhibitory substances", "It is more nutritious than regular BAP", "It prevents gram-negative growth"],
      correctIndex: 1,
      rationale: "Chocolate agar = BAP heated to 80°C → RBCs lyse → release X factor (hemin) and V factor (NAD). Also reduces NADase that destroys V factor in regular BAP. Supports Haemophilus, Neisseria, and other fastidious organisms.",
      difficulty: 2,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-349",
      stem: "Dimorphic fungi include (choose all that apply in concept):",
      options: ["Aspergillus and Mucor", "Histoplasma, Blastomyces, Coccidioides, Paracoccidioides, Talaromyces", "Candida and Cryptococcus", "Dermatophytes"],
      correctIndex: 1,
      rationale: "Dimorphic = mold at 25°C, yeast at 37°C. The classic five: Histoplasma capsulatum, Blastomyces dermatitidis, Coccidioides immitis, Paracoccidioides brasiliensis, Talaromyces (Penicillium) marneffei. Sporothrix schenckii also dimorphic. Candida and Cryptococcus are yeasts; Aspergillus and Mucor are molds.",
      difficulty: 3,
      category: "Microbiology",
      topic: "mycology"
    },
  {
      id: "mlt-350",
      stem: "PYR test (L-pyrrolidonyl arylamidase) is positive for which organisms?",
      options: ["S. aureus and E. coli", "Group A Streptococcus and Enterococcus", "Pseudomonas and Klebsiella", "All streptococci"],
      correctIndex: 1,
      rationale: "PYR+: Group A Strep (S. pyogenes) and Enterococcus. Helps rapidly differentiate GAS from other beta-hemolytic strep. Also differentiates Enterococcus from Group D strep (non-enterococcal). Simple hydrolysis test — red color = positive.",
      difficulty: 3,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-351",
      stem: "Modified acid-fast stain (using weak decolorizer) is used to detect:",
      options: ["Mycobacterium tuberculosis", "Cryptosporidium, Isospora, Cyclospora (coccidian parasites)", "Plasmodium", "Giardia"],
      correctIndex: 1,
      rationale: "Coccidian parasites (Cryptosporidium, Cystoisospora/Isospora, Cyclospora) are modified acid-fast positive (oocysts stain pink with weak acid-alcohol decolorization). Regular AFB stain uses strong acid-alcohol. Important in immunocompromised (HIV/AIDS) diarrheal illness.",
      difficulty: 3,
      category: "Microbiology",
      topic: "parasitology"
    },
  {
      id: "mlt-352",
      stem: "A urine culture with three or more organisms and squamous epithelial cells likely represents:",
      options: ["Polymicrobial UTI", "Contaminated specimen — request clean-catch recollection", "Normal flora", "Asymptomatic bacteriuria"],
      correctIndex: 1,
      rationale: "Multiple organisms + squamous epithelial cells = contamination from improper collection (genital flora). Request properly collected midstream clean-catch or catheterized specimen. True UTI is typically single organism >100,000 CFU/mL.",
      difficulty: 2,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-353",
      stem: "Gram-variable organisms appear both pink and purple on the same smear. An example:",
      options: ["E. coli", "Gardnerella vaginalis", "Staphylococcus aureus", "Pseudomonas"],
      correctIndex: 1,
      rationale: "Gardnerella vaginalis is gram-variable (stains inconsistently). Clue cells (vaginal epithelial cells covered with Gardnerella) are diagnostic of bacterial vaginosis. Other gram-variable: some Mycobacterium species, old cultures of gram-positive organisms.",
      difficulty: 2,
      category: "Microbiology",
      topic: "gram stain technique"
    },
  {
      id: "mlt-354",
      stem: "Antibody showing dosage (stronger reactions with homozygous cells) is typical of:",
      options: ["ABO antibodies", "Kidd (Jk), Duffy (Fy), Rh (except D), MNSs system antibodies", "Lewis antibodies", "P system antibodies"],
      correctIndex: 1,
      rationale: "Dosage: antibody reacts more strongly with RBCs homozygous for the antigen (double dose) than heterozygous (single dose). Kidd and Duffy antibodies commonly show dosage. Kell and D typically do NOT show dosage. Dosage can cause weak reactions to be missed.",
      difficulty: 3,
      category: "Blood Banking",
      topic: "antibody identification"
    },
  {
      id: "mlt-355",
      stem: "In an emergency requiring immediate transfusion before crossmatch completion, which blood should be issued?",
      options: ["Wait for crossmatch", "O-negative RBCs (switch to type-specific once type confirmed)", "Any available unit", "AB-positive only"],
      correctIndex: 1,
      rationale: "Emergency: O-negative RBCs (universal donor) while type is being determined. Once ABO/Rh confirmed (takes ~5-10 min), switch to type-specific uncrossmatched blood. Crossmatched blood issued as soon as testing completed. Document emergency release.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "compatibility testing"
    },
  {
      id: "mlt-356",
      stem: "Pathogen reduction technology (PRT) for platelets:",
      options: ["Eliminates need for bacterial culture", "Inactivates pathogens (bacteria, viruses, parasites) and residual WBCs using UV light + psoralen or riboflavin", "Only removes bacteria", "Only works on plasma"],
      correctIndex: 1,
      rationale: "PRT (Intercept/MIRASOL): chemical (amotosalen/riboflavin) + UV light cross-links nucleic acids, inactivating pathogens and WBCs. Extends shelf life, replaces bacterial testing, may replace irradiation and CMV testing. Does not affect protein function significantly.",
      difficulty: 3,
      category: "Blood Banking",
      topic: "component therapy"
    },
  {
      id: "mlt-357",
      stem: "When should an ABO discrepancy NOT be resolved by the technologist alone?",
      options: ["Missing reverse typing reaction", "All discrepancies require consultation with blood bank medical director", "Extra reaction in forward type only", "Normal subgroup variation"],
      correctIndex: 1,
      rationale: "All ABO discrepancies must be resolved before transfusion. Complex cases (unexpected antibodies, subgroups, acquired B, chimera) should involve blood bank medical director/pathologist. Document investigation and resolution. Issue O RBCs if urgent and type uncertain.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "ABO typing"
    },
  {
      id: "mlt-358",
      stem: "An eluate is prepared from DAT-positive RBCs to:",
      options: ["Confirm the ABO type", "Identify the antibody that was coating the RBCs in vivo", "Test for bacterial contamination", "Determine Rh type"],
      correctIndex: 1,
      rationale: "Elution: removes antibody from DAT-positive RBCs (acid, heat, or freeze-thaw methods). The eluate is then tested against a panel of reagent RBCs to identify the antibody specificity. Essential for investigating HDFN, transfusion reactions, and AIHA.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "direct antiglobulin test"
    },
  {
      id: "mlt-359",
      stem: "A patient receives ABO-incompatible plasma in a platelet unit and develops mild hemolysis. This is an example of:",
      options: ["Febrile non-hemolytic reaction", "Minor ABO incompatibility reaction", "Major ABO incompatibility", "Bacterial contamination"],
      correctIndex: 1,
      rationale: "Minor incompatibility: donor PLASMA antibodies against recipient RBC antigens (e.g., type O platelets with anti-A/anti-B given to type A patient). Usually mild, but can cause hemolysis with high-titer donor antibodies. Group-specific or titer-tested platelets mitigate risk.",
      difficulty: 3,
      category: "Blood Banking",
      topic: "compatibility testing"
    },
  {
      id: "mlt-360",
      stem: "Anti-Scl-70 (anti-topoisomerase I) is specific for:",
      options: ["Limited scleroderma (CREST)", "Diffuse systemic sclerosis (scleroderma)", "SLE", "Mixed connective tissue disease"],
      correctIndex: 1,
      rationale: "Anti-Scl-70 = diffuse scleroderma (widespread skin/organ involvement, pulmonary fibrosis). Anti-centromere = limited scleroderma (CREST). Anti-U1-RNP = mixed connective tissue disease. These ANA patterns help classify scleroderma subtypes.",
      difficulty: 3,
      category: "Immunology/Serology",
      topic: "autoimmune markers"
    },
  {
      id: "mlt-361",
      stem: "Low C3, normal C4 suggests:",
      options: ["Classical pathway activation", "Alternative pathway activation (C3 consumed without C4 involvement)", "Terminal pathway deficiency", "No complement activation"],
      correctIndex: 1,
      rationale: "Alternative pathway bypasses C1, C2, C4 (classical). If only C3 is low with normal C4, the alternative pathway is consuming C3 directly (e.g., endotoxin activation, C3 nephritic factor in MPGN). Classical activation consumes both C3 and C4.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "complement system"
    },
  {
      id: "mlt-362",
      stem: "Hook effect (high-dose hook) in immunoassays occurs when:",
      options: ["Analyte concentration is too low to detect", "Extremely high analyte concentration saturates both capture and detection antibodies, giving falsely low result", "Temperature is too low", "Reagents are expired"],
      correctIndex: 1,
      rationale: "Hook effect: very high analyte concentration saturates antibodies independently → sandwich cannot form → signal paradoxically decreases → falsely low/normal result. Seen in: hCG (molar pregnancy), prolactin, PSA. Solution: test diluted specimen.",
      difficulty: 3,
      category: "Immunology/Serology",
      topic: "EIA methodology"
    },
  {
      id: "mlt-363",
      stem: "CD4 count <200 cells/µL defines:",
      options: ["HIV infection", "AIDS (advanced HIV disease)", "Normal immune function", "Need for prophylactic vaccination"],
      correctIndex: 1,
      rationale: "AIDS: CD4 <200 cells/µL (regardless of symptoms) OR CD4 <14% OR presence of AIDS-defining illness. Normal CD4: 500-1500. CD4 <200 = high risk for opportunistic infections (PCP, toxoplasmosis, CMV). Initiate PCP prophylaxis.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "HIV testing"
    },
  {
      id: "mlt-364",
      stem: "Coombs' control cells (check cells) are added after a negative AHG test to:",
      options: ["Confirm the test is truly negative by verifying AHG reagent was functional", "Identify the antibody", "Enhance weak reactions", "Test for complement"],
      correctIndex: 0,
      rationale: "IgG-coated check cells: after a negative AHG test, add IgG-sensitized cells. If they agglutinate, the AHG reagent was functional and the negative result is valid. If no agglutination, the AHG may have been neutralized (inadequate washing) — test is invalid, repeat.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "antigen-antibody reactions"
    },
  {
      id: "mlt-365",
      stem: "Transitional (urothelial) epithelial cells in urine originate from:",
      options: ["Vagina/external genitalia", "Renal pelvis, ureters, bladder, upper urethra", "Kidney tubules", "Blood vessels"],
      correctIndex: 1,
      rationale: "Transitional epithelial cells line the urinary tract from renal pelvis to proximal urethra. A few are normal. Large numbers or clusters may indicate urinary tract malignancy — cytology evaluation warranted. Do not confuse with squamous (contamination) or renal tubular epithelial cells (kidney damage).",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "microscopic sediment"
    },
  {
      id: "mlt-366",
      stem: "Amorphous urates in acidic urine appear as:",
      options: ["Colorless hexagonal plates", "Pink-orange granular sediment (brick dust)", "Coffin-lid shaped crystals", "Envelope-shaped crystals"],
      correctIndex: 1,
      rationale: "Amorphous urates: granular pink-orange sediment ('brick dust') in acidic urine. Non-pathological. Dissolve when warmed to 60°C. Amorphous phosphates (alkaline urine) are white/colorless and dissolve in dilute acetic acid.",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "crystal identification"
    },
  {
      id: "mlt-367",
      stem: "Xanthochromia in CSF (yellow discoloration) indicates:",
      options: ["Recent traumatic tap", "Subarachnoid hemorrhage (blood present for >2 hours — oxyhemoglobin/bilirubin from RBC lysis)", "Normal finding", "Viral meningitis"],
      correctIndex: 1,
      rationale: "Xanthochromia: yellow CSF from oxyhemoglobin (2-4 hrs) → bilirubin (12+ hrs). Distinguishes subarachnoid hemorrhage from traumatic tap (traumatic: RBCs clear in successive tubes, no xanthochromia). Spectrophotometric analysis most sensitive.",
      difficulty: 3,
      category: "Urinalysis/Body Fluids",
      topic: "CSF analysis"
    },
  {
      id: "mlt-368",
      stem: "Fecal elastase-1 is a test for:",
      options: ["Colorectal cancer", "Pancreatic exocrine insufficiency (enzyme not degraded during intestinal transit)", "Celiac disease", "IBD"],
      correctIndex: 1,
      rationale: "Pancreatic elastase-1 is a proteolytic enzyme exclusively from the pancreas. It is not degraded in the GI tract, so fecal levels reflect pancreatic output. Low levels (<200 µg/g) = pancreatic exocrine insufficiency (chronic pancreatitis, cystic fibrosis).",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "fecal occult blood"
    },
  {
      id: "mlt-369",
      stem: "The dipstick glucose test uses which enzyme?",
      options: ["Hexokinase", "Glucose oxidase", "Urease", "Lactate dehydrogenase"],
      correctIndex: 1,
      rationale: "Glucose oxidase on the pad catalyzes: glucose + O₂ → gluconic acid + H₂O₂. Peroxidase then converts H₂O₂ + chromogen → color change. Ascorbic acid (vitamin C) can cause false negative by reducing H₂O₂.",
      difficulty: 1,
      category: "Urinalysis/Body Fluids",
      topic: "microscopic sediment"
    },
  {
      id: "mlt-370",
      stem: "Ascorbic acid (vitamin C) can cause false-negative dipstick results for:",
      options: ["Protein and pH", "Glucose and blood (hemoglobin)", "Leukocyte esterase and nitrite", "Specific gravity and bilirubin"],
      correctIndex: 1,
      rationale: "Ascorbic acid is a reducing agent that interferes with oxidation reactions on the dipstick. It can cause false-negative glucose (inhibits peroxidase step) and false-negative blood (reduces H₂O₂). Some strips now include ascorbic acid neutralizer.",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "microscopic sediment"
    },
  {
      id: "mlt-371",
      stem: "Bland-Altman plot in method comparison shows:",
      options: ["Slope and intercept of linear regression", "The difference between two methods plotted against their average — assesses agreement and bias", "Only the correlation coefficient", "Precision data"],
      correctIndex: 1,
      rationale: "Bland-Altman: x-axis = average of two methods; y-axis = difference. Shows mean bias (systematic difference), limits of agreement (±1.96 SD), and whether bias varies with concentration. Better than correlation alone for assessing method agreement.",
      difficulty: 3,
      category: "Quality Assurance",
      topic: "method validation"
    },
  {
      id: "mlt-372",
      stem: "Acceptable performance in proficiency testing is determined by:",
      options: ["Always ± 10% of the target", "Target value ± defined acceptable limits (varies by analyte — some are fixed, some are % based)", "Any result within 1 SD of mean", "The laboratory director's judgment"],
      correctIndex: 1,
      rationale: "CLIA defines acceptable limits per analyte: glucose ±6 mg/dL or ±10% (whichever greater), potassium ±0.5 mEq/L, Hgb ±7%, etc. Failure to achieve acceptable performance on two of three consecutive events requires corrective action.",
      difficulty: 2,
      category: "Quality Assurance",
      topic: "accuracy assessment"
    },
  {
      id: "mlt-373",
      stem: "Waived tests require which level of personnel education?",
      options: ["Doctoral degree", "No specific education requirement under CLIA — certificate of waiver holders follow manufacturer instructions", "Bachelor's degree in laboratory science", "Associate degree"],
      correctIndex: 1,
      rationale: "CLIA waived testing: no personnel education requirements. Must follow manufacturer's instructions exactly. However, some states have more stringent requirements. The certificate of waiver must be posted, and the lab must enroll in PT if available.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "CLIA requirements"
    },
  {
      id: "mlt-374",
      stem: "Critical value (panic value) reporting requires:",
      options: ["Charting the result in the medical record only", "Verbal notification to the responsible caregiver with read-back verification, documented with time and name", "Sending an email notification", "Reporting at end of shift"],
      correctIndex: 1,
      rationale: "CLIA/CAP/Joint Commission: critical values must be verbally communicated to responsible provider. Read-back for verification. Document: value, time of notification, name of person notified, name of reporter. Failure to report is a serious compliance issue.",
      difficulty: 3,
      category: "Laboratory Operations",
      topic: "LIS operations"
    },
  {
      id: "mlt-375",
      stem: "Random error vs systematic error: random is characterized by:",
      options: ["Consistent deviation in one direction", "Unpredictable variation in both directions — affects precision (increased SD/CV)", "A shift above the mean", "A trend increasing over time"],
      correctIndex: 0,
      rationale: "Random error: unpredictable, both directions, affects precision. Causes: pipetting variability, temperature fluctuations, air bubbles. Cannot be eliminated but can be minimized. Systematic error: consistent one direction, affects accuracy. Causes: calibration drift, reagent lot change.",
      difficulty: 3,
      category: "Quality Assurance",
      topic: "Levey-Jennings charts"
    },
  {
      id: "mlt-376",
      stem: "Carry-over (sample-to-sample contamination) in automated analyzers is tested by:",
      options: ["Running patient samples only", "Analyzing high-concentration sample followed by low-concentration sample — checking if low result is falsely elevated", "Running QC daily", "Calibration verification"],
      correctIndex: 1,
      rationale: "Carry-over: analyte from previous high sample contaminates next low sample. Test by running High-High-Low-Low sequence (H1, H2, L1, L2). Carry-over = (L1 − L2)/(H2 − L2) × 100. Should be <1% for acceptable performance.",
      difficulty: 2,
      category: "Quality Assurance",
      topic: "method validation"
    },
  {
      id: "mlt-377",
      stem: "Microsatellite instability (MSI) testing is important in which cancer?",
      options: ["Lung cancer only", "Colorectal cancer — identifies Lynch syndrome/mismatch repair deficiency", "Breast cancer", "Leukemia"],
      correctIndex: 1,
      rationale: "MSI: expansion/contraction of microsatellite (short tandem repeat) sequences due to defective mismatch repair (MMR) genes. MSI-high tumors (15% of CRC): Lynch syndrome screen, predict response to immunotherapy (checkpoint inhibitors). Tested by PCR or IHC for MMR proteins.",
      difficulty: 3,
      category: "Molecular Diagnostics",
      topic: "genotyping"
    },
  {
      id: "mlt-378",
      stem: "Digital PCR (dPCR) compared to qPCR:",
      options: ["Less sensitive", "Provides absolute quantification without standard curves — partitions sample into thousands of reactions", "Requires thermal cycling at higher temperatures", "Cannot detect rare variants"],
      correctIndex: 1,
      rationale: "Digital PCR partitions sample into thousands of nanoliter reactions. Each partition has 0 or 1+ target molecules (Poisson distribution). Absolute quantification without standard curves. More precise for low-copy targets: liquid biopsy, minimal residual disease, rare mutation detection.",
      difficulty: 3,
      category: "Molecular Diagnostics",
      topic: "PCR technique"
    },
  {
      id: "mlt-379",
      stem: "Internal amplification control (IAC) in molecular assays. If IAC fails:",
      options: ["Result is valid", "Result is invalid — possible PCR inhibition in the specimen", "Only positive results are invalid", "The target is present"],
      correctIndex: 1,
      rationale: "If IAC doesn't amplify: specimen may contain PCR inhibitors (hemoglobin, heparin, melanin). The negative target result cannot be trusted — could be false negative. Re-extract specimen, dilute, or use alternative extraction method.",
      difficulty: 2,
      category: "Molecular Diagnostics",
      topic: "nucleic acid amplification"
    },
  {
      id: "mlt-380",
      stem: "BRCA1/BRCA2 mutation testing is indicated for:",
      options: ["All women over 40", "Patients with personal/family history of breast/ovarian cancer meeting genetic testing criteria", "All cancer patients", "Routine screening"],
      correctIndex: 1,
      rationale: "BRCA1/2 mutations increase lifetime risk of breast (45-72%) and ovarian (10-44%) cancer. Testing recommended when family/personal history meets NCCN criteria. Positive result guides: enhanced screening, prophylactic surgery, PARP inhibitor therapy.",
      difficulty: 2,
      category: "Molecular Diagnostics",
      topic: "genotyping"
    },
  {
      id: "mlt-381",
      stem: "Hepatitis B vaccination is:",
      options: ["Optional for laboratory workers", "Required to be offered free of charge to all employees with occupational exposure", "Only available to physicians", "Not recommended for laboratory workers"],
      correctIndex: 1,
      rationale: "OSHA Bloodborne Pathogens Standard: employers must offer HBV vaccination free to all employees with reasonably anticipated occupational exposure within 10 working days of initial assignment. Employees can decline (signed declination) but can accept later.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "OSHA regulations"
    },
  {
      id: "mlt-382",
      stem: "Biohazard symbol is required on:",
      options: ["All laboratory equipment", "Containers of regulated waste, contaminated sharps containers, refrigerators/freezers containing blood/OPIM", "Exit doors", "Fire extinguishers"],
      correctIndex: 1,
      rationale: "OSHA: biohazard symbol (fluorescent orange or orange-red) on containers of regulated waste, contaminated sharps, and refrigerators/freezers storing blood or other potentially infectious material (OPIM). Labels must be affixed.",
      difficulty: 1,
      category: "Laboratory Operations",
      topic: "OSHA regulations"
    },
  {
      id: "mlt-383",
      stem: "Centrifuge safety: tubes should be:",
      options: ["Centrifuged without caps to prevent pressure buildup", "Balanced and capped, using sealed safety cups/rotors to contain aerosols", "Centrifuged at maximum speed always", "Opened immediately after centrifugation"],
      correctIndex: 1,
      rationale: "Centrifuge safety: balance tubes (equal weight/volume opposite each other), cap tubes to prevent aerosol generation, use safety cups/sealed rotors, wait for complete stop before opening lid, do not exceed rated speed.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "OSHA regulations"
    },
  {
      id: "mlt-384",
      stem: "Order of draw for vacuum tubes (CLSI H3-A6) starting from first:",
      options: ["Lavender, blue, red, gray", "Blood cultures, blue (citrate), red/gold (serum), green (heparin), lavender (EDTA), gray (NaF)", "Red, blue, lavender, gray, green", "Any order is acceptable"],
      correctIndex: 1,
      rationale: "Order of draw prevents additive carryover: (1) Blood cultures, (2) Citrate (blue) — tissue thromboplastin from venipuncture can activate coagulation, (3) Serum (red/gold), (4) Heparin (green), (5) EDTA (lavender), (6) NaF/oxalate (gray). EDTA after green prevents EDTA contaminating chemistry tests.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "specimen collection"
    },
  {
      id: "mlt-385",
      stem: "The phlebotomy tourniquet should not be left on for more than:",
      options: ["5 minutes", "1 minute to prevent hemoconcentration and falsely elevated analytes", "10 minutes", "No time limit"],
      correctIndex: 1,
      rationale: "Tourniquet >1 minute causes hemoconcentration — falsely elevates protein-bound analytes (calcium, cholesterol), enzymes, protein, and may induce hemolysis. Potassium may decrease initially then increase. Release tourniquet as soon as blood flows.",
      difficulty: 1,
      category: "Laboratory Operations",
      topic: "specimen collection"
    },
  {
      id: "mlt-386",
      stem: "A fasting specimen requires the patient to fast for:",
      options: ["2-4 hours", "8-12 hours (water permitted)", "24 hours", "No fasting needed for any test"],
      correctIndex: 1,
      rationale: "Fasting: 8-12 hours (typically overnight). Water is allowed (maintains hydration). Required for: glucose, lipid panel, insulin. Non-fasting TG can be up to 200 mg/dL higher. Certain hormones (cortisol, growth hormone) also require fasting or timed collection.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "specimen collection"
    },
  {
      id: "mlt-387",
      stem: "Bilirubin is the breakdown product of:",
      options: ["Albumin", "Heme from hemoglobin degradation", "Creatinine metabolism", "Glucose metabolism"],
      correctIndex: 1,
      rationale: "Old RBCs → macrophage phagocytosis → heme → biliverdin → unconjugated (indirect) bilirubin. Liver conjugates with glucuronic acid → conjugated (direct) bilirubin → excreted in bile → urobilinogen in intestine.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-388",
      stem: "PTH and calcium relationship: in primary hyperparathyroidism:",
      options: ["Both PTH and calcium are low", "PTH is elevated and calcium is elevated", "PTH is low and calcium is elevated", "Both are normal"],
      correctIndex: 1,
      rationale: "Primary hyperparathyroidism: autonomous PTH secretion (adenoma) → elevated PTH + elevated calcium (+ low phosphorus, elevated urine calcium). Secondary: elevated PTH with low/normal calcium (compensatory — CKD, vitamin D deficiency).",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "endocrine testing"
    },
  {
      id: "mlt-389",
      stem: "MacConkey agar differentiates organisms by:",
      options: ["Hemolysis pattern", "Lactose fermentation (pink = LF; colorless = NLF)", "Motility", "Oxidase reaction"],
      correctIndex: 1,
      rationale: "MacConkey: lactose + neutral red indicator. Lactose fermenters produce acid → pink/red colonies (E. coli, Klebsiella). Non-lactose fermenters: colorless (Salmonella, Shigella, Pseudomonas). Bile salts + crystal violet inhibit gram-positives.",
      difficulty: 2,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-390",
      stem: "The beta-lactam ring is the active component of:",
      options: ["Aminoglycosides", "Penicillins, cephalosporins, carbapenems, monobactams", "Macrolides", "Fluoroquinolones"],
      correctIndex: 1,
      rationale: "Beta-lactam ring: 4-membered ring structure present in all beta-lactam antibiotics. It binds PBPs (penicillin-binding proteins) inhibiting cell wall synthesis. Beta-lactamases cleave this ring → resistance.",
      difficulty: 2,
      category: "Microbiology",
      topic: "antimicrobial resistance"
    },
  {
      id: "mlt-391",
      stem: "The most common adverse reaction to blood transfusion is:",
      options: ["Acute hemolytic reaction", "Febrile non-hemolytic transfusion reaction (FNHTR)", "Anaphylaxis", "TRALI"],
      correctIndex: 1,
      rationale: "FNHTR: most common reaction. Caused by recipient antibodies against donor WBC antigens or cytokines accumulated during storage. Presents with fever, chills. Treatment: antipyretics. Prevention: leukoreduced products, premedication.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "component therapy"
    },
  {
      id: "mlt-392",
      stem: "Landsteiner's rule states:",
      options: ["All blood types are compatible", "If an antigen is absent from RBCs, the corresponding antibody is present in serum (and vice versa)", "ABO type doesn't affect transfusion", "Only Rh matters"],
      correctIndex: 1,
      rationale: "Landsteiner's rule: ABO antibodies are naturally occurring — if you lack an ABO antigen, you have the corresponding antibody. Group A has anti-B; Group B has anti-A; Group O has both; Group AB has neither. Forward and reverse typing must agree.",
      difficulty: 1,
      category: "Blood Banking",
      topic: "ABO typing"
    },
  {
      id: "mlt-393",
      stem: "Lateral flow immunoassay (rapid test) principle:",
      options: ["ELISA on a plate", "Sample migrates along membrane, antibodies bind target, producing visible line at test zone", "Western blot on membrane", "Gel electrophoresis"],
      correctIndex: 1,
      rationale: "Lateral flow: sample pad → conjugate pad (labeled antibody binds analyte) → test line (capture antibody — if analyte present, sandwich forms = visible line) → control line (always visible if test worked). Used in: pregnancy tests, rapid strep, COVID rapid, HIV rapid.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "EIA methodology"
    },
  {
      id: "mlt-394",
      stem: "Hepatitis A testing: IgM anti-HAV indicates:",
      options: ["Chronic hepatitis A", "Acute/recent hepatitis A infection", "Immunity from vaccination", "Past resolved infection"],
      correctIndex: 0,
      rationale: "IgM anti-HAV: acute hepatitis A (recent infection). IgG anti-HAV: past infection or vaccination = immunity. HAV does not cause chronic infection. Fecal-oral transmission. No antiviral treatment — self-limited.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "hepatitis panels"
    },
  {
      id: "mlt-395",
      stem: "Anti-smooth muscle antibodies (ASMA) are associated with:",
      options: ["SLE", "Autoimmune hepatitis type 1", "Rheumatoid arthritis", "Primary biliary cholangitis"],
      correctIndex: 1,
      rationale: "ASMA (specifically anti-F-actin): characteristic of autoimmune hepatitis type 1. Combined with ANA and elevated IgG. Type 2 autoimmune hepatitis has anti-LKM-1 (anti-liver-kidney microsomal) antibodies.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "autoimmune markers"
    },
  {
      id: "mlt-396",
      stem: "A specimen from a patient on argatroban (direct thrombin inhibitor) shows prolonged aPTT 95 sec and prolonged PT 18 sec. Why are both prolonged?",
      options: ["Factor deficiency", "Direct thrombin inhibitors prolong both PT and aPTT by inhibiting thrombin in the common pathway", "Heparin contamination", "DIC"],
      correctIndex: 1,
      rationale: "Direct thrombin inhibitors (argatroban, bivalirudin, dabigatran) block thrombin (factor IIa) in the common pathway, prolonging both PT and aPTT. Unlike heparin, their effect is not neutralized by protamine. aPTT is more sensitive than PT.",
      difficulty: 3,
      category: "Hematology",
      topic: "CBC interpretation"
    },
  {
      id: "mlt-397",
      stem: "Pernicious anemia autoantibodies target:",
      options: ["Red blood cells", "Intrinsic factor and parietal cells", "Thyroid gland", "Liver cells"],
      correctIndex: 1,
      rationale: "Pernicious anemia: autoantibodies against intrinsic factor (blocking and binding types) and parietal cells. IF is required for B12 absorption in the terminal ileum. Most common cause of B12 deficiency in adults.",
      difficulty: 2,
      category: "Hematology",
      topic: "anemias classification"
    },
  {
      id: "mlt-398",
      stem: "Hemoglobin Bart's (γ4) indicates:",
      options: ["Beta-thalassemia", "Alpha-thalassemia — 4-gene deletion (hydrops fetalis, incompatible with life)", "Sickle cell disease", "Normal variant"],
      correctIndex: 1,
      rationale: "Hgb Bart's = 4 gamma chains. Severe alpha-thalassemia (all 4 alpha genes deleted). Very high O₂ affinity — cannot deliver O₂. Causes hydrops fetalis (massive edema) and is generally incompatible with extrauterine life.",
      difficulty: 2,
      category: "Hematology",
      topic: "hemoglobin variants"
    },
  {
      id: "mlt-399",
      stem: "Hypersegmented neutrophils (≥5 lobes or any with 6+ lobes) are seen in:",
      options: ["Bacterial infection", "Megaloblastic anemia (B12/folate deficiency)", "CML", "Iron deficiency"],
      correctIndex: 1,
      rationale: "Hypersegmented neutrophils are a hallmark of megaloblastic anemia. Finding ≥5 lobes in 5% of neutrophils or any neutrophil with 6+ lobes is significant. Caused by impaired DNA synthesis affecting nuclear division. Combined with oval macrocytes = highly suggestive.",
      difficulty: 3,
      category: "Hematology",
      topic: "WBC differential"
    },
  {
      id: "mlt-400",
      stem: "Antithrombin (AT) deficiency increases risk of:",
      options: ["Bleeding", "Venous thromboembolism", "Hemolytic anemia", "Neutropenia"],
      correctIndex: 1,
      rationale: "Antithrombin is the main inhibitor of thrombin and factor Xa. Deficiency → unchecked thrombin activity → hypercoagulability → VTE risk. Heterozygous deficiency gives 5-10× increased VTE risk. Heparin requires AT for its anticoagulant effect — heparin resistance in AT deficiency.",
      difficulty: 3,
      category: "Hematology",
      topic: "coagulation cascade"
    },
  {
      id: "mlt-401",
      stem: "TIBC (total iron-binding capacity) measures:",
      options: ["Total serum iron", "The amount of transferrin available to bind iron (reflects transferrin level)", "Ferritin level", "Hemoglobin iron content"],
      correctIndex: 1,
      rationale: "TIBC measures the maximum amount of iron that transferrin can bind. High TIBC = low iron saturation (iron deficiency — body makes more transferrin to capture iron). Low TIBC = iron overload or chronic disease.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-402",
      stem: "24-hour urine free cortisol is used to screen for:",
      options: ["Addison disease", "Cushing syndrome (hypercortisolism)", "Hypothyroidism", "Diabetes"],
      correctIndex: 1,
      rationale: "24-hour UFC measures unbound cortisol excreted over a full day, averaging out diurnal variation. Elevated in Cushing syndrome. Other screening tests: late-night salivary cortisol, overnight dexamethasone suppression test.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "endocrine testing"
    },
  {
      id: "mlt-403",
      stem: "Hyperkalemia ECG changes include:",
      options: ["U waves", "Peaked T waves, widened QRS, eventual sine wave pattern", "ST depression only", "Normal ECG"],
      correctIndex: 0,
      rationale: "Hyperkalemia (>5.5): peaked T waves → prolonged PR → widened QRS → sine wave → cardiac arrest. ECG changes may begin at K⁺ >6.0 but are variable. This is why K⁺ >6.5 is a critical value requiring immediate notification.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "electrolyte panels"
    },
  {
      id: "mlt-404",
      stem: "Normal fasting glucose range:",
      options: ["<70 mg/dL", "<100 mg/dL", "<126 mg/dL", "<140 mg/dL"],
      correctIndex: 1,
      rationale: "ADA: normal fasting glucose <100. IFG (pre-diabetes): 100-125. Diabetes: ≥126 (on two occasions). Random ≥200 with symptoms = diabetes.",
      difficulty: 1,
      category: "Clinical Chemistry",
      topic: "glucose testing"
    },
  {
      id: "mlt-405",
      stem: "GFR is best estimated by which formula in current practice?",
      options: ["Cockroft-Gault", "CKD-EPI creatinine equation (or CKD-EPI cystatin C)", "Cockcroft-Gault only", "MDRD only"],
      correctIndex: 1,
      rationale: "CKD-EPI (2021 revision, race-free) is the current recommended equation for eGFR. Uses serum creatinine, age, and sex. MDRD is older and less accurate at higher GFRs. CKD-EPI cystatin C or combined creatinine-cystatin C equations are alternatives.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "renal function tests"
    },
  {
      id: "mlt-406",
      stem: "Quellung reaction (capsular swelling) is used to identify:",
      options: ["E. coli serotypes", "Streptococcus pneumoniae serotypes", "Staphylococcus species", "Mycobacterium species"],
      correctIndex: 1,
      rationale: "Quellung: type-specific anticapsular antibody + organism → visible capsular swelling under microscope. Used for S. pneumoniae serotyping (93 serotypes). Rapid identification from positive cultures or clinical specimens.",
      difficulty: 3,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-407",
      stem: "Triple sugar iron (TSI) agar tests for:",
      options: ["Oxidase production", "Fermentation of glucose, lactose, sucrose + H₂S and gas production", "Motility and urease", "Indole production"],
      correctIndex: 1,
      rationale: "TSI: slant/butt interpretation. Glucose-only fermenter = K/A. Lactose/sucrose fermenter = A/A. Non-fermenter = K/K. Gas = cracks/bubbles. H₂S = black precipitate. K = alkaline (red), A = acid (yellow).",
      difficulty: 2,
      category: "Microbiology",
      topic: "biochemical tests"
    },
  {
      id: "mlt-408",
      stem: "XLD agar is selective/differential for:",
      options: ["Gram-positive organisms", "Enteric pathogens: Salmonella (red with black centers) and Shigella (red, no H₂S)", "Neisseria species", "Mycobacteria"],
      correctIndex: 1,
      rationale: "XLD (xylose lysine deoxycholate): Salmonella = red colonies with black centers (lysine+, H₂S+, non-lactose-fermenter). Shigella = red colonies without black centers (lysine−, H₂S−). Normal flora (E. coli) = yellow colonies (lactose fermenter).",
      difficulty: 2,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-409",
      stem: "Trophozoite with a single nucleus containing a large karyosome, found in brain tissue. Organism:",
      options: ["Giardia lamblia", "Naegleria fowleri (primary amebic meningoencephalitis)", "Entamoeba histolytica", "Plasmodium falciparum"],
      correctIndex: 1,
      rationale: "Naegleria fowleri: free-living ameba, causes rapidly fatal primary amebic meningoencephalitis (PAM). Enters through nose in warm freshwater. CSF shows: motile trophozoites, elevated WBCs, elevated protein, low glucose. Extremely high mortality.",
      difficulty: 2,
      category: "Microbiology",
      topic: "parasitology"
    },
  {
      id: "mlt-410",
      stem: "Methicillin resistance in staphylococci is detected by:",
      options: ["Penicillin disk only", "Cefoxitin disk (surrogate marker) or PCR for mecA gene", "Vancomycin disk", "Gentamicin MIC"],
      correctIndex: 1,
      rationale: "Cefoxitin disk: zone <22mm for S. aureus = MRSA (better inducer of mecA than oxacillin). PCR for mecA gene is definitive. Chromogenic MRSA media also available for screening. MRSA = resistant to ALL beta-lactams.",
      difficulty: 2,
      category: "Microbiology",
      topic: "antimicrobial resistance"
    },
  {
      id: "mlt-411",
      stem: "Volume reduction of platelet units is indicated when:",
      options: ["Routine transfusion", "Neonatal/pediatric patients or patients with fluid restriction who cannot tolerate full volume", "All platelet transfusions", "Adult ICU patients only"],
      correctIndex: 1,
      rationale: "Volume reduction removes excess plasma, decreasing transfusion volume for small patients (neonates, pediatrics) or fluid-restricted patients. Process: centrifuge → remove plasma → resuspend in reduced volume. Must be transfused within 4 hours.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "component therapy"
    },
  {
      id: "mlt-412",
      stem: "A patient types as group A with a positive autocontrol. What additional testing is needed?",
      options: ["No additional testing", "DAT, autoantibody investigation, elution to rule out underlying alloantibodies", "Only forward typing is needed", "Repeat the autocontrol"],
      correctIndex: 1,
      rationale: "Positive autocontrol = patient's serum reacts with own cells = autoantibody present. Must perform DAT (confirms in vivo coating), elution (identify the autoantibody), and adsorption studies if recently transfused (to detect masked alloantibodies). Cold vs warm auto workup.",
      difficulty: 3,
      category: "Blood Banking",
      topic: "ABO typing"
    },
  {
      id: "mlt-413",
      stem: "After a suspected transfusion reaction, the blood bank should:",
      options: ["Continue the transfusion", "Perform clerical check, DAT on post-reaction sample, visual hemolysis check, repeat ABO/Rh", "Discard the unit without investigation", "Only document the reaction"],
      correctIndex: 1,
      rationale: "Post-reaction workup: (1) clerical check (verify patient/unit ID), (2) DAT on post-reaction sample, (3) visual hemolysis check (pre- vs post-reaction), (4) repeat ABO/Rh on pre- and post-reaction samples, (5) direct antiglobulin test, (6) antibody screen on post-reaction sample.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "compatibility testing"
    },
  {
      id: "mlt-414",
      stem: "Hereditary angioedema (HAE) is caused by:",
      options: ["Complement C3 deficiency", "C1 esterase inhibitor (C1-INH) deficiency or dysfunction", "IgE-mediated allergy", "Autoimmune disease"],
      correctIndex: 1,
      rationale: "HAE: deficiency (type I) or dysfunction (type II) of C1-INH → uncontrolled C1 activation → bradykinin generation → angioedema (no urticaria). Lab: low C4 (chronically consumed by uninhibited C1s), low/dysfunctional C1-INH, normal C3. Treat with C1-INH concentrate, icatibant, or ecallantide.",
      difficulty: 3,
      category: "Immunology/Serology",
      topic: "complement system"
    },
  {
      id: "mlt-415",
      stem: "Anti-Jo-1 antibodies are associated with:",
      options: ["SLE", "Polymyositis/dermatomyositis with interstitial lung disease (antisynthetase syndrome)", "Scleroderma", "Sjögren"],
      correctIndex: 1,
      rationale: "Anti-Jo-1 (anti-histidyl-tRNA synthetase): specific for antisynthetase syndrome — polymyositis/dermatomyositis + interstitial lung disease + Raynaud's + mechanic's hands + arthritis. One of several antisynthetase antibodies.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "autoimmune markers"
    },
  {
      id: "mlt-416",
      stem: "HIV viral load (RNA quantification) is used to:",
      options: ["Diagnose HIV initially", "Monitor antiretroviral therapy response (undetectable = <50 copies/mL)", "Determine CD4 count", "Test for opportunistic infections"],
      correctIndex: 1,
      rationale: "HIV RNA viral load by qRT-PCR: monitors ART effectiveness. Goal = undetectable (<50 copies/mL = virologic suppression). Rising viral load = treatment failure or non-adherence. Viral load is NOT the primary diagnostic test (use antibody/antigen testing).",
      difficulty: 3,
      category: "Immunology/Serology",
      topic: "HIV testing"
    },
  {
      id: "mlt-417",
      stem: "Renal tubular epithelial cells in urine casts indicate:",
      options: ["Contamination", "Acute tubular injury/necrosis — renal tubular epithelial cell casts", "Normal finding", "Bladder cancer"],
      correctIndex: 1,
      rationale: "Renal tubular epithelial (RTE) cells are larger than WBCs, with a large round nucleus. RTE casts = sloughed tubular cells trapped in protein matrix. Indicates acute tubular injury: nephrotoxins (aminoglycosides, cisplatin), ischemia, transplant rejection.",
      difficulty: 3,
      category: "Urinalysis/Body Fluids",
      topic: "microscopic sediment"
    },
  {
      id: "mlt-418",
      stem: "Tyrosine crystals (fine needles in sheaves) and leucine crystals (yellow spheres with radial striations) in urine indicate:",
      options: ["Normal finding", "Severe liver disease (amino acid metabolism failure)", "UTI", "Kidney stones"],
      correctIndex: 1,
      rationale: "Tyrosine (fine needles, sheaves/rosettes) and leucine (yellow oily spheres with radial striations) are pathological crystals found in severe liver disease/hepatic failure — failure to metabolize amino acids. Also in maple syrup urine disease (leucine). Rarely seen but clinically significant.",
      difficulty: 3,
      category: "Urinalysis/Body Fluids",
      topic: "crystal identification"
    },
  {
      id: "mlt-419",
      stem: "In a 2×2 diagnostic table: PPV (positive predictive value) is:",
      options: ["TP/(TP+FN)", "TP/(TP+FP) — proportion of positive results that are truly positive", "TN/(TN+FP)", "TN/(TN+FN)"],
      correctIndex: 1,
      rationale: "PPV = TP/(TP+FP) = probability that a positive test result is truly positive. Unlike sensitivity/specificity, PPV is affected by disease prevalence — higher prevalence → higher PPV. NPV = TN/(TN+FN).",
      difficulty: 3,
      category: "Quality Assurance",
      topic: "accuracy assessment"
    },
  {
      id: "mlt-420",
      stem: "The 2-2s Westgard rule indicates:",
      options: ["Random error", "Systematic error — two consecutive values exceed 2 SD on the same side of the mean", "Warning only", "Normal variation"],
      correctIndex: 0,
      rationale: "2-2s: systematic error (shift or bias). Two consecutive controls > 2 SD on the SAME side = reject run, investigate for systematic cause (calibration drift, reagent change, temperature). If on opposite sides = likely random error (4-1s or R-4s rule).",
      difficulty: 2,
      category: "Quality Assurance",
      topic: "Levey-Jennings charts"
    },
  {
      id: "mlt-421",
      stem: "Which analyte requires the most frequent QC testing under CLIA?",
      options: ["All analytes are the same", "Analyte-specific — but blood gas and POC glucose require QC with each patient run or daily minimum", "Chemistry panels only", "Only hematology analytes"],
      correctIndex: 1,
      rationale: "CLIA: minimum QC requirements vary. Most analyzers: 2 levels QC per 24 hours or per shift. Blood gas analyzers: QC each 8 hours. POC glucometers: per manufacturer/facility policy. Some labs use equivalent QC (EQC) or IQCP plans as alternatives.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "CLIA requirements"
    },
  {
      id: "mlt-422",
      stem: "Hemolysis during phlebotomy is most commonly caused by:",
      options: ["Wrong tube order", "Using too small a needle, forceful aspiration, vigorous mixing, or prolonged tourniquet", "Patient's blood disorder", "Room temperature", ""],
      correctIndex: 1,
      rationale: "Hemolysis causes: (1) small needle bore (23-25G) with vacuum tube, (2) forceful syringe aspiration, (3) vigorous tube mixing (should invert gently 5-8 times), (4) traumatic draw with tissue fluid, (5) underfilled tubes with excess anticoagulant.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "specimen collection"
    },
  {
      id: "mlt-423",
      stem: "Reflex testing means:",
      options: ["Repeating the same test", "Automatically ordering a follow-up test based on initial result (e.g., abnormal TSH triggers free T4)", "Canceling tests", "Running QC"],
      correctIndex: 0,
      rationale: "Reflex: predefined rule — if initial result meets criteria, a follow-up test is automatically ordered. Examples: abnormal TSH → free T4; positive HBsAg → HBeAg + HBV DNA; positive urine drug screen → confirmation by GC-MS/LC-MS.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "LIS operations"
    },
  {
      id: "mlt-424",
      stem: "Sanger sequencing (dideoxy method) is considered the gold standard for:",
      options: ["Whole-genome sequencing", "Confirming specific mutations and short sequence analysis", "Rapid pathogen identification", "Quantifying viral load"],
      correctIndex: 1,
      rationale: "Sanger: uses ddNTPs (chain terminators) labeled with fluorescent dyes. Each fragment terminates at different positions → read sequence. Gold standard for confirming specific mutations. Limited throughput compared to NGS. Used for BRCA confirmatory, cystic fibrosis CFTR mutations.",
      difficulty: 3,
      category: "Molecular Diagnostics",
      topic: "genotyping"
    },
  {
      id: "mlt-425",
      stem: "Multiplex PCR amplifies:",
      options: ["A single target with one primer pair", "Multiple targets simultaneously using multiple primer pairs in one reaction", "The same target multiple times", "Only RNA targets"],
      correctIndex: 1,
      rationale: "Multiplex: multiple primer pairs in one tube → amplify several targets simultaneously. Used for: respiratory pathogen panels (detecting flu A/B, RSV, SARS-CoV-2 in one test), STI panels, blood culture pathogen identification panels. Saves time and specimen volume.",
      difficulty: 2,
      category: "Molecular Diagnostics",
      topic: "PCR technique"
    },
  {
      id: "mlt-426",
      stem: "TMA (transcription-mediated amplification) is isothermal and uses:",
      options: ["Taq polymerase only", "Reverse transcriptase + RNA polymerase to amplify RNA targets", "Restriction enzymes", "Ligase"],
      correctIndex: 1,
      rationale: "TMA: isothermal at 41°C. RT converts target RNA → cDNA, RNA polymerase transcribes cDNA → multiple RNA copies, which serve as templates for more cDNA. 100-1000 copies per cycle (vs 2 for PCR). Used in Hologic Aptima assays (CT/GC, HIV, HCV).",
      difficulty: 3,
      category: "Molecular Diagnostics",
      topic: "nucleic acid amplification"
    },
  {
      id: "mlt-427",
      stem: "Engineering controls for bloodborne pathogen exposure include:",
      options: ["Written policies only", "Self-sheathing needles, splash shields, biosafety cabinets, sharps containers", "Annual training alone", "Administrative scheduling"],
      correctIndex: 1,
      rationale: "Engineering controls: devices/equipment that isolate or remove the hazard. Sharps with engineered safety features (self-sheathing needles, retractable lancets), splash shields, BSCs, handwashing facilities, sharps containers. Preferred over PPE (work practice controls supplement engineering controls).",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "OSHA regulations"
    },
  {
      id: "mlt-428",
      stem: "For a chemical splash to the eyes:",
      options: ["Rinse with saline for 5 minutes", "Flush with water at eyewash station for at least 15 minutes", "Apply ice", "Wait for medical assistance"],
      correctIndex: 1,
      rationale: "Chemical eye splash: IMMEDIATELY flush with water at eyewash station for minimum 15 minutes (some chemicals require 30+ minutes). Remove contact lenses if present. Do not rub eyes. Seek medical evaluation after flushing. Know the location of the nearest eyewash before handling chemicals.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "OSHA regulations"
    },
  {
      id: "mlt-429",
      stem: "The GHS (Globally Harmonized System) uses which hazard communication elements?",
      options: ["Only colored labels", "Signal words (Danger/Warning), pictograms, hazard statements, precautionary statements on SDS and labels", "Verbal warnings only", "NFPA diamond only"],
      correctIndex: 1,
      rationale: "GHS standardizes chemical hazard communication globally: pictograms (skull, flame, exclamation mark, etc.), signal words (Danger = more severe; Warning = less severe), hazard statements (H-statements), precautionary statements (P-statements). Implemented via OSHA HazCom 2012.",
      difficulty: 1,
      category: "Laboratory Operations",
      topic: "OSHA regulations"
    },
  {
      id: "mlt-430",
      stem: "Hemoglobin A1c methods can be broadly classified as:",
      options: ["Only HPLC", "Methods based on charge difference (HPLC, electrophoresis) and methods based on structural difference (immunoassay, boronate affinity)", "Manual methods only", "Only enzymatic"],
      correctIndex: 1,
      rationale: "Charge-based: HPLC (ion-exchange), capillary electrophoresis — separate by charge difference between glycated and non-glycated Hgb. Structure-based: immunoassay (antibody to glycated N-terminal), boronate affinity (cis-diol binding). NGSP certifies methods for standardization.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-431",
      stem: "Osmolality is measured by:",
      options: ["Photometry", "Freezing point depression osmometer (most common in clinical labs)", "Flame photometry", "Nephelometry"],
      correctIndex: 1,
      rationale: "Freezing point depression: solute depresses freezing point proportionally to particle concentration. Each mOsm/kg depresses freezing by 1.86 × 10⁻³ °C. Vapor pressure osmometry is an alternative. Reference method for osmolality.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "special chemistry"
    },
  {
      id: "mlt-432",
      stem: "Bile esculin test positive + growth in 6.5% NaCl. This combination identifies:",
      options: ["Streptococcus pneumoniae", "Enterococcus species", "Group A Streptococcus", "Viridans streptococci"],
      correctIndex: 1,
      rationale: "Enterococcus: bile esculin + (esculin hydrolysis produces black color on bile esculin agar) AND grows in 6.5% NaCl. Group D non-enterococcal strep (S. gallolyticus): bile esculin + but does NOT grow in 6.5% NaCl. Key differentiation.",
      difficulty: 3,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-433",
      stem: "Löwenstein-Jensen (LJ) medium is used to culture:",
      options: ["Enterobacteriaceae", "Mycobacterium species", "Neisseria", "Fungi"],
      correctIndex: 1,
      rationale: "LJ: egg-based medium with malachite green (inhibits other bacteria). M. tuberculosis grows slowly (2-6 weeks) as buff, rough, non-pigmented colonies. Middlebrook 7H10/7H11 agar and liquid systems (BACTEC MGIT) are faster alternatives.",
      difficulty: 2,
      category: "Microbiology",
      topic: "culture identification"
    },
  {
      id: "mlt-434",
      stem: "Anti-A,B reagent reacts with which blood groups?",
      options: ["Only Group A", "Only Group B", "Both Group A and Group B (and AB) — monoclonal antibody recognizing common epitope", "Only Group O"],
      correctIndex: 2,
      rationale: "Anti-A,B (group O serum or monoclonal) reacts with both A and B antigens. Useful for detecting weak subgroups of A or B that may not react with standard anti-A or anti-B. Helps resolve ABO discrepancies involving weak antigens.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "ABO typing"
    },
  {
      id: "mlt-435",
      stem: "The antibody most commonly implicated in delayed hemolytic transfusion reactions is:",
      options: ["Anti-A", "Anti-D", "Anti-Jk(a) (Kidd antibodies)", "Anti-M"],
      correctIndex: 2,
      rationale: "Kidd antibodies (anti-Jka, anti-Jkb) are notorious for DHtR: (1) show dosage, (2) rapidly drop below detection level, (3) strong anamnestic response upon re-exposure. 'Kidd will kill you' — the antibody that comes back.",
      difficulty: 3,
      category: "Blood Banking",
      topic: "compatibility testing"
    },
  {
      id: "mlt-436",
      stem: "Agglutination grading: 4+ means:",
      options: ["No agglutination", "Mixed field", "One solid button of agglutinated cells (complete agglutination, clear supernatant)", "Weak agglutination"],
      correctIndex: 2,
      rationale: "Grading: 4+ = one solid button, clear supernatant; 3+ = several large clumps; 2+ = medium clumps, clear background; 1+ = small clumps, turbid background; +/- = microscopic aggregates; 0 = no agglutination. Consistent grading is essential for blood bank quality.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "antigen-antibody reactions"
    },
  {
      id: "mlt-437",
      stem: "IgE is associated with:",
      options: ["Bacterial opsonization", "Type I (immediate) hypersensitivity reactions and parasitic infections", "Complement activation", "Mucosal immunity"],
      correctIndex: 1,
      rationale: "IgE: lowest serum concentration, bound to mast cell/basophil Fc receptors. Cross-linking by allergen → degranulation → histamine release → allergic symptoms. Also elevated in parasitic helminth infections. Measured by total IgE and allergen-specific IgE (ImmunoCAP).",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "immunoglobulin levels"
    },
  {
      id: "mlt-438",
      stem: "Granular casts (coarsely and finely granular) represent:",
      options: ["Normal hydration finding", "Degeneration of cellular casts or precipitation of plasma proteins — non-specific but indicate renal pathology", "Bladder infection", "Dehydration artifact"],
      correctIndex: 1,
      rationale: "Granular casts form from degeneration of cellular casts (WBC or RTE cell) or direct protein precipitation. Coarsely granular → finely granular → waxy (progression of degeneration). Non-specific for a single disease but indicate renal parenchymal disease.",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "microscopic sediment"
    },
  {
      id: "mlt-439",
      stem: "Normal CSF protein range for adults:",
      options: ["15-45 mg/dL", "100-200 mg/dL", "500+ mg/dL", "0 mg/dL"],
      correctIndex: 0,
      rationale: "Normal adult CSF protein: 15-45 mg/dL (lumbar). Elevated in meningitis (bacterial >> viral), GBS (albuminocytologic dissociation = high protein, normal cells), spinal cord tumors. Decreased CSF protein is rare (pseudotumor cerebri, CSF leak).",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "CSF analysis"
    },
  {
      id: "mlt-440",
      stem: "Reportable range (clinically reportable range) includes:",
      options: ["Only the linear range", "The linear range extended by validated dilution protocols and concentration methods to cover clinically expected values", "The normal reference range", "Only the calibration range"],
      correctIndex: 1,
      rationale: "Reportable range = AMR (analytical measurement range) extended by validated dilutions (for high values) and concentration methods (for low values). Must cover clinically expected range. Results outside reportable range: report as >upper or <lower limit, or investigate with dilution/concentration.",
      difficulty: 2,
      category: "Quality Assurance",
      topic: "method validation"
    },
  {
      id: "mlt-441",
      stem: "Specimen labeling must include at minimum:",
      options: ["Patient name only", "Two unique patient identifiers, date/time of collection, collector's initials", "Just the room number", "Only the test ordered"],
      correctIndex: 1,
      rationale: "CLSI/CAP/TJC: minimum labeling at the time of collection: (1) patient full name, (2) unique ID number (DOB, MRN), (3) date and time of collection, (4) collector's identification. Label at bedside BEFORE leaving patient. Unlabeled specimens must be rejected.",
      difficulty: 2,
      category: "Laboratory Operations",
      topic: "specimen collection"
    },
  {
      id: "mlt-442",
      stem: "Middleware in the laboratory serves to:",
      options: ["Replace the LIS entirely", "Interface between analyzers and LIS — manages autoverification rules, QC, and result validation", "Only track specimens", "Only print labels"],
      correctIndex: 1,
      rationale: "Middleware: software layer between analyzers and LIS. Manages: autoverification rules (release results meeting criteria), QC monitoring, specimen tracking, delta checks, reflex testing, and instrument management. Reduces manual intervention and improves efficiency.",
      difficulty: 3,
      category: "Laboratory Operations",
      topic: "LIS operations"
    },
{
      id: "mlt-443",
      stem: "A CBC reveals WBC 2.1 × 10⁹/L, ANC 0.4 × 10⁹/L. The patient recently started chemotherapy. Which action is most appropriate?",
      options: ["Report as normal", "Initiate neutropenic precautions and notify physician", "Repeat specimen tomorrow", "Perform manual differential only"],
      correctIndex: 1,
      rationale: "ANC < 0.5 × 10⁹/L = severe neutropenia. Chemotherapy-induced neutropenia requires immediate neutropenic precautions (reverse isolation, monitoring for infection). Critical value must be reported immediately.",
      difficulty: 2,
      category: "Hematology",
      topic: "neutropenia"
    },
  {
      id: "mlt-444",
      stem: "Peripheral smear shows large cells with open chromatin, prominent nucleoli, and Auer rods. The most likely diagnosis is:",
      options: ["ALL", "AML (acute promyelocytic leukemia)", "CLL", "Hairy cell leukemia"],
      correctIndex: 1,
      rationale: "Auer rods are pathognomonic for AML, specifically seen in APL (M3). They are fused azurophilic granules forming rod-shaped inclusions. APL requires urgent treatment with ATRA due to DIC risk.",
      difficulty: 3,
      category: "Hematology",
      topic: "leukemia classification"
    },
  {
      id: "mlt-445",
      stem: "A patient's PT is 38 seconds (ref 11-13.5), aPTT is 62 seconds (ref 25-35). Thrombin time is prolonged. Fibrinogen is 85 mg/dL (ref 200-400). D-dimer is markedly elevated. These results suggest:",
      options: ["Hemophilia A", "Disseminated intravascular coagulation (DIC)", "Vitamin K deficiency", "Factor V Leiden"],
      correctIndex: 1,
      rationale: "Prolonged PT, aPTT, and TT with decreased fibrinogen and elevated D-dimer = classic DIC. DIC involves simultaneous activation of coagulation and fibrinolysis, consuming clotting factors and platelets.",
      difficulty: 3,
      category: "Hematology",
      topic: "coagulation disorders"
    },
  {
      id: "mlt-446",
      stem: "Flow cytometry of bone marrow shows cells positive for CD10, CD19, CD34, and TdT. This immunophenotype is consistent with:",
      options: ["T-cell ALL", "B-cell precursor ALL", "AML", "Plasma cell myeloma"],
      correctIndex: 1,
      rationale: "CD19 (B-cell marker), CD10 (CALLA), CD34 (stem cell marker), and TdT (immature lymphoid marker) = B-cell precursor ALL. Most common childhood leukemia. CD10 positivity confers better prognosis.",
      difficulty: 3,
      category: "Hematology",
      topic: "flow cytometry"
    },
  {
      id: "mlt-447",
      stem: "Reticulocyte count is 8% with Hgb 7.0 g/dL and HCT 21%. The corrected reticulocyte count is:",
      options: ["8%", "3.7%", "16%", "1.8%"],
      correctIndex: 1,
      rationale: "Corrected retic = retic% × (patient HCT / normal HCT). 8% × (21/45) = 3.7%. Correction accounts for the dilutional effect of anemia on the reticulocyte percentage. RPI further corrects for marrow stress.",
      difficulty: 2,
      category: "Hematology",
      topic: "reticulocyte calculations"
    },
  {
      id: "mlt-448",
      stem: "A patient's serum shows: sodium 128 mEq/L, glucose 850 mg/dL. The corrected sodium is approximately:",
      options: ["128 mEq/L", "139 mEq/L", "118 mEq/L", "145 mEq/L"],
      correctIndex: 1,
      rationale: "Corrected Na = measured Na + 1.6 × [(glucose - 100) / 100]. = 128 + 1.6 × (750/100) = 128 + 12 = 140 mEq/L (≈139). Hyperglycemia causes osmotic dilution of sodium — pseudohyponatremia.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "electrolyte corrections"
    },
  {
      id: "mlt-449",
      stem: "A lipemic specimen is received for potassium testing on an ISE analyzer using indirect methodology. The expected interference is:",
      options: ["Falsely elevated potassium", "Falsely decreased potassium", "No effect on ISE results", "Falsely elevated sodium"],
      correctIndex: 1,
      rationale: "Indirect ISE requires sample dilution — lipemia displaces aqueous volume, causing falsely decreased electrolytes (exclusion effect). Direct ISE measures undiluted sample and is not affected by lipemia.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "ISE methodology"
    },
  {
      id: "mlt-450",
      stem: "Serum CK-MB is 45 U/L (ref <25), CK-MB relative index is 8%. Troponin I is 12.5 ng/mL (ref <0.04). These results are most consistent with:",
      options: ["Skeletal muscle injury", "Acute myocardial infarction", "Chronic kidney disease", "Rhabdomyolysis"],
      correctIndex: 1,
      rationale: "Elevated CK-MB with relative index >5% combined with markedly elevated troponin I = acute MI. CK-MB index >5% favors cardiac over skeletal muscle origin. Troponin is the gold standard cardiac biomarker.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "cardiac biomarkers"
    },
  {
      id: "mlt-451",
      stem: "A 3-day-old neonate has total bilirubin 18.5 mg/dL with direct bilirubin 0.8 mg/dL. The primary concern is:",
      options: ["Biliary atresia", "Kernicterus from unconjugated hyperbilirubinemia", "Hepatitis", "Dubin-Johnson syndrome"],
      correctIndex: 1,
      rationale: "Neonatal indirect (unconjugated) hyperbilirubinemia at 18.5 mg/dL risks kernicterus — bilirubin crossing the blood-brain barrier causing neuronal damage. Treatment: phototherapy or exchange transfusion. Direct bilirubin elevation would suggest hepatobiliary disease.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "bilirubin metabolism"
    },
  {
      id: "mlt-452",
      stem: "A gram stain of CSF shows gram-negative diplococci in a 19-year-old college student with fever, petechial rash, and nuchal rigidity. The most likely organism is:",
      options: ["Streptococcus pneumoniae", "Neisseria meningitidis", "Haemophilus influenzae", "Listeria monocytogenes"],
      correctIndex: 1,
      rationale: "Gram-negative diplococci in CSF + petechial rash + college-age = Neisseria meningitidis (meningococcal meningitis). Close contacts require chemoprophylaxis with rifampin or ciprofloxacin. N. meningitidis grows on chocolate agar and Thayer-Martin.",
      difficulty: 2,
      category: "Microbiology",
      topic: "CSF pathogens"
    },
  {
      id: "mlt-453",
      stem: "A urine culture shows >100,000 CFU/mL of a lactose-positive, indole-positive, gram-negative rod. The most likely organism is:",
      options: ["Proteus mirabilis", "Escherichia coli", "Pseudomonas aeruginosa", "Klebsiella pneumoniae"],
      correctIndex: 1,
      rationale: "Lactose-positive (pink on MAC), indole-positive = E. coli. Most common cause of UTI (80% of community-acquired). Klebsiella is lactose-positive but indole-negative. Proteus is lactose-negative.",
      difficulty: 1,
      category: "Microbiology",
      topic: "urine culture identification"
    },
  {
      id: "mlt-454",
      stem: "Blood culture isolate is catalase-positive, coagulase-positive, beta-hemolytic, and mannitol salt agar positive. The organism is:",
      options: ["Staphylococcus epidermidis", "Staphylococcus aureus", "Streptococcus pyogenes", "Enterococcus faecalis"],
      correctIndex: 1,
      rationale: "Catalase-positive (Staphylococcus), coagulase-positive, mannitol-fermenting = S. aureus. Most virulent staphylococcal species. S. epidermidis is coagulase-negative and typically mannitol-negative.",
      difficulty: 1,
      category: "Microbiology",
      topic: "gram-positive cocci identification"
    },
  {
      id: "mlt-455",
      stem: "A patient types as group A, Rh-positive. Antibody screen is positive. Panel identifies anti-Jkᵃ. For transfusion, units must be:",
      options: ["Group A, Rh-positive only", "Group A, Rh-positive, Jk(a-negative), crossmatch compatible", "Any ABO-compatible unit", "Group O, Rh-negative"],
      correctIndex: 1,
      rationale: "Anti-Jkᵃ (Kidd) is clinically significant — causes delayed hemolytic transfusion reactions. Must provide antigen-negative (Jk(a-negative)) units confirmed by crossmatch. Kidd antibodies show dosage effect and can evanescence (disappear then reappear).",
      difficulty: 3,
      category: "Blood Banking",
      topic: "antibody identification and selection"
    },
  {
      id: "mlt-456",
      stem: "During a crossmatch, the immediate spin phase is compatible but the AHG phase is incompatible (2+). This indicates:",
      options: ["ABO incompatibility", "Clinically significant IgG antibody in patient serum", "Cold agglutinin only", "Rouleaux"],
      correctIndex: 1,
      rationale: "Compatible IS phase (no ABO issue) + incompatible AHG phase = IgG antibody detected. AHG (indirect antiglobulin test) detects IgG antibodies that coat RBCs at 37°C. Must identify antibody and provide antigen-negative units.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "crossmatch interpretation"
    },
  {
      id: "mlt-457",
      stem: "A patient has a positive DAT with anti-IgG and anti-C3d. The eluate shows anti-e specificity. This is most consistent with:",
      options: ["Cold autoimmune hemolytic anemia", "Warm autoimmune hemolytic anemia", "Drug-induced hemolytic anemia", "Alloantibody from prior transfusion"],
      correctIndex: 1,
      rationale: "Positive DAT with IgG + C3d coating, eluate showing apparent specificity (anti-e) = warm AIHA. Warm autoantibodies often show Rh-related specificity. Most common AIHA type (70-80%). Treatment: corticosteroids, rituximab.",
      difficulty: 3,
      category: "Blood Banking",
      topic: "autoimmune hemolytic anemia"
    },
  {
      id: "mlt-458",
      stem: "A Kleihauer-Betke test shows 1.2% fetal cells. Estimated fetal hemorrhage volume for a mother with a calculated blood volume of 5000 mL is:",
      options: ["30 mL", "60 mL", "120 mL", "6 mL"],
      correctIndex: 1,
      rationale: "Fetal hemorrhage = % fetal cells × maternal blood volume = 0.012 × 5000 = 60 mL. Number of RhIG vials = fetal hemorrhage / 30 mL, rounded up + 1. KB test detects fetal HbF-containing cells resistant to acid elution.",
      difficulty: 3,
      category: "Blood Banking",
      topic: "Kleihauer-Betke calculation"
    },
  {
      id: "mlt-459",
      stem: "An RPR test is reactive at 1:32. FTA-ABS is nonreactive. The most likely explanation is:",
      options: ["Primary syphilis", "Biological false positive RPR", "Tertiary syphilis", "Latent syphilis"],
      correctIndex: 1,
      rationale: "Reactive RPR with nonreactive FTA-ABS = biological false positive. BFP causes include: SLE, pregnancy, IV drug use, viral infections, malaria. Treponemal tests (FTA-ABS, TP-PA) confirm true syphilis infection.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "syphilis serology"
    },
  {
      id: "mlt-460",
      stem: "ELISA screening for HIV is reactive. The confirmatory test per current CDC algorithm is:",
      options: ["Western blot", "HIV-1/HIV-2 differentiation immunoassay", "Repeat ELISA", "p24 antigen only"],
      correctIndex: 1,
      rationale: "Current CDC algorithm: reactive 4th-gen Ag/Ab combo → HIV-1/HIV-2 differentiation immunoassay. If differentiation is indeterminate → HIV-1 NAT (nucleic acid test). Western blot is no longer recommended as confirmatory.",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "HIV testing algorithm"
    },
  {
      id: "mlt-461",
      stem: "A urine dipstick shows: protein 3+, blood 3+, but microscopy reveals 0-2 RBC/HPF. The most likely explanation for the blood discrepancy is:",
      options: ["Laboratory error", "Myoglobinuria or hemoglobinuria", "Contamination", "Highly concentrated specimen"],
      correctIndex: 1,
      rationale: "Positive dipstick blood with few RBCs on microscopy = free hemoglobin or myoglobin in urine. Dipstick detects the peroxidase activity of hemoglobin/myoglobin regardless of intact RBCs. Myoglobinuria: rhabdomyolysis. Hemoglobinuria: intravascular hemolysis.",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "dipstick discrepancies"
    },
  {
      id: "mlt-462",
      stem: "A CSF specimen shows: WBC 850/μL (95% neutrophils), glucose 22 mg/dL (serum glucose 110), protein 280 mg/dL. These findings suggest:",
      options: ["Viral meningitis", "Bacterial meningitis", "Multiple sclerosis", "Normal CSF"],
      correctIndex: 1,
      rationale: "Elevated WBC with neutrophilic predominance, markedly decreased glucose (CSF:serum ratio <0.4), and elevated protein = bacterial meningitis. Viral meningitis shows lymphocytic predominance with normal glucose.",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "CSF analysis"
    },
  {
      id: "mlt-463",
      stem: "Westgard rule 2₂s is violated when:",
      options: ["One control exceeds 3 SD", "Two consecutive controls exceed 2 SD on the same side of the mean", "Ten consecutive controls fall on one side of the mean", "Two controls within the same run exceed 2 SD on opposite sides"],
      correctIndex: 1,
      rationale: "2₂s: two consecutive controls exceed ±2 SD on the SAME side of the mean = systematic error (shift). Indicates bias in the assay. R₄s (opposite sides) = random error. 1₃s = single control >3 SD = random error.",
      difficulty: 2,
      category: "Quality Assurance",
      topic: "Westgard rules"
    },
  {
      id: "mlt-464",
      stem: "A new lot of reagent is being validated. The laboratory runs 20 patient samples on both old and new reagent lots. This study is called:",
      options: ["Proficiency testing", "Parallel testing / method comparison", "Linearity study", "Calibration verification"],
      correctIndex: 1,
      rationale: "Parallel testing (method comparison): running the same samples on old and new reagent lots to verify comparable results. Evaluate using correlation coefficient, bias, and Bland-Altman analysis. Required before switching reagent lots for critical assays.",
      difficulty: 2,
      category: "Quality Assurance",
      topic: "reagent validation"
    },
  {
      id: "mlt-465",
      stem: "PCR amplification of a target gene shows no product in the patient sample but the internal control amplifies normally. The interpretation is:",
      options: ["Inhibition of PCR", "Target gene not present in sample (true negative)", "Reagent failure", "Contamination"],
      correctIndex: 1,
      rationale: "Successful internal control amplification rules out inhibition and reagent failure. No target amplification = true negative result. If IC also failed → suspect inhibition (hemoglobin, heparin, melanin). Contamination would show unexpected positive results.",
      difficulty: 2,
      category: "Molecular Diagnostics",
      topic: "PCR result interpretation"
    },
  {
      id: "mlt-466",
      stem: "In real-time PCR, the Ct (cycle threshold) value is inversely proportional to:",
      options: ["Primer concentration", "Initial target DNA quantity", "Annealing temperature", "MgCl₂ concentration"],
      correctIndex: 1,
      rationale: "Lower Ct = more starting template. Ct is the cycle number where fluorescence crosses the threshold. High viral load = low Ct (earlier detection). Each 3.3 Ct difference ≈ 10-fold change in template quantity (for 100% efficiency).",
      difficulty: 2,
      category: "Molecular Diagnostics",
      topic: "real-time PCR quantification"
    },
  {
      id: "mlt-467",
      stem: "A laboratory worker splashes a biological specimen into their eye. The first action should be:",
      options: ["Report to supervisor immediately", "Flush the eye with water at the eyewash station for 15 minutes", "Apply antibiotic ointment", "Complete an incident report"],
      correctIndex: 1,
      rationale: "Immediate decontamination: flush eyes at eyewash station for minimum 15 minutes. Then report to supervisor and seek medical evaluation. OSHA requires eyewash stations within 10 seconds of hazardous material areas. Documentation follows initial treatment.",
      difficulty: 1,
      category: "Laboratory Safety",
      topic: "exposure response"
    },
  {
      id: "mlt-468",
      stem: "Chemical spills involving concentrated sulfuric acid should be neutralized with:",
      options: ["Water only", "Sodium bicarbonate (baking soda)", "Bleach", "Acetone"],
      correctIndex: 1,
      rationale: "Sodium bicarbonate neutralizes acid spills. For base spills, use weak acid (citric acid or acetic acid). Never use water alone on concentrated acid — exothermic reaction risk. Commercial spill kits contain appropriate neutralizers. Wear appropriate PPE during cleanup.",
      difficulty: 1,
      category: "Laboratory Safety",
      topic: "chemical spill response"
    },
  {
      id: "mlt-469",
      stem: "The NFPA diamond for a chemical shows: Health=3, Flammability=0, Reactivity=2, Special=W̶. This indicates:",
      options: ["Highly flammable, low health risk", "Serious health hazard, non-flammable, reactive with water", "Oxidizer with moderate health risk", "Radioactive material"],
      correctIndex: 1,
      rationale: "NFPA 704: Health 3 = serious/toxic, Flammability 0 = non-flammable, Reactivity 2 = unstable if heated, W̶ (W with line through) = reacts dangerously with water. Do NOT use water to extinguish or clean up.",
      difficulty: 2,
      category: "Laboratory Safety",
      topic: "NFPA hazard identification"
    },
  {
      id: "mlt-470",
      stem: "A hemoglobin electrophoresis at alkaline pH shows bands at S and A₂ positions with absent HbA. This pattern is consistent with:",
      options: ["Sickle cell trait (HbAS)", "Sickle cell disease (HbSS)", "Hemoglobin SC disease", "Beta-thalassemia minor"],
      correctIndex: 1,
      rationale: "Absent HbA with HbS and elevated HbA₂ = homozygous sickle cell disease (HbSS). Sickle trait (HbAS) shows both HbA and HbS bands. At alkaline pH, migration order: A, F, S, C (from fastest to slowest toward anode).",
      difficulty: 2,
      category: "Hematology",
      topic: "hemoglobin electrophoresis"
    },
  {
      id: "mlt-471",
      stem: "A peripheral smear shows target cells, Howell-Jolly bodies, and sickle cells in a patient with Hgb 6.8 g/dL. Howell-Jolly bodies indicate:",
      options: ["Iron deficiency", "Functional asplenia or splenectomy", "Lead poisoning", "Megaloblastic anemia"],
      correctIndex: 1,
      rationale: "Howell-Jolly bodies (nuclear remnants) indicate absent or nonfunctional spleen. In sickle cell disease, repeated splenic infarcts cause autosplenectomy. Normally the spleen pits nuclear fragments from RBCs.",
      difficulty: 2,
      category: "Hematology",
      topic: "RBC inclusions"
    },
  {
      id: "mlt-472",
      stem: "ESR is 85 mm/hr in a 70-year-old male. Which condition does NOT typically elevate ESR?",
      options: ["Multiple myeloma", "Rheumatoid arthritis", "Polycythemia vera", "Temporal arteritis"],
      correctIndex: 2,
      rationale: "Polycythemia vera (increased RBCs) DECREASES ESR because packed cells resist rouleaux formation. Elevated ESR: infection, inflammation, multiple myeloma (rouleaux from increased immunoglobulins), pregnancy, anemia.",
      difficulty: 2,
      category: "Hematology",
      topic: "ESR interpretation"
    },
  {
      id: "mlt-473",
      stem: "Serum osmolality is measured at 320 mOsm/kg. Calculated osmolality is 295 mOsm/kg. The osmolal gap of 25 suggests:",
      options: ["Normal finding", "Presence of unmeasured osmotically active substances (ethanol, methanol, ethylene glycol)", "Instrument error", "Dehydration"],
      correctIndex: 1,
      rationale: "Osmolal gap = measured - calculated. Normal gap <10 mOsm/kg. Gap >10 suggests unmeasured osmoles: ethanol, methanol, ethylene glycol, isopropanol, mannitol. Calculated osmolality = 2(Na) + glucose/18 + BUN/2.8.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "osmolality and toxicology"
    },
  {
      id: "mlt-474",
      stem: "A patient's HbA1c is 9.2%. This corresponds to an estimated average glucose of approximately:",
      options: ["126 mg/dL", "217 mg/dL", "183 mg/dL", "310 mg/dL"],
      correctIndex: 1,
      rationale: "eAG = (28.7 × HbA1c) - 46.7. For HbA1c 9.2%: (28.7 × 9.2) - 46.7 = 264.04 - 46.7 = 217.3 mg/dL. HbA1c reflects average glucose over 2-3 months (RBC lifespan ~120 days). Goal for most diabetics: <7%.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "diabetes monitoring"
    },
  {
      id: "mlt-475",
      stem: "Serum protein electrophoresis shows a monoclonal spike (M-spike) in the gamma region. Immunofixation identifies IgG kappa. This is most consistent with:",
      options: ["Polyclonal gammopathy", "Multiple myeloma or monoclonal gammopathy", "Nephrotic syndrome", "Liver cirrhosis"],
      correctIndex: 1,
      rationale: "Monoclonal spike with single heavy chain (IgG) and single light chain (kappa) = monoclonal gammopathy. May represent multiple myeloma, Waldenström's, or MGUS. SPEP shows narrow spike vs. broad band in polyclonal. Requires further workup: bone marrow biopsy, skeletal survey.",
      difficulty: 3,
      category: "Clinical Chemistry",
      topic: "protein electrophoresis"
    },
  {
      id: "mlt-476",
      stem: "A wound culture from a diabetic foot ulcer grows a gram-negative rod that is oxidase-positive, produces a blue-green pigment, and has a grape-like odor. The organism is:",
      options: ["Escherichia coli", "Pseudomonas aeruginosa", "Proteus mirabilis", "Acinetobacter baumannii"],
      correctIndex: 1,
      rationale: "Oxidase-positive, blue-green (pyocyanin) pigment, grape-like (aminoacetophenone) odor = Pseudomonas aeruginosa. Opportunistic pathogen in immunocompromised, burn patients, and diabetic wounds. Intrinsically resistant to many antibiotics.",
      difficulty: 1,
      category: "Microbiology",
      topic: "gram-negative rod identification"
    },
  {
      id: "mlt-477",
      stem: "An acid-fast stain of a sputum specimen shows red, beaded rods. The patient has a chronic cough, night sweats, and weight loss. The specimen should be cultured on:",
      options: ["Blood agar and MacConkey", "Löwenstein-Jensen medium and BACTEC MGIT", "Chocolate agar", "Sabouraud dextrose agar"],
      correctIndex: 1,
      rationale: "AFB-positive with clinical symptoms = suspected Mycobacterium tuberculosis. Culture on LJ medium (egg-based, malachite green) and/or liquid BACTEC MGIT system. Growth may take 2-8 weeks. BSL-3 precautions required for culture manipulation.",
      difficulty: 2,
      category: "Microbiology",
      topic: "mycobacteriology"
    },
  {
      id: "mlt-478",
      stem: "A stool culture on sorbitol-MacConkey agar shows colorless (sorbitol-negative) colonies. The organism is MUG-negative. The most likely pathogen is:",
      options: ["Salmonella enteritidis", "E. coli O157:H7", "Shigella sonnei", "Campylobacter jejuni"],
      correctIndex: 1,
      rationale: "Sorbitol-negative on SMAC + MUG-negative = E. coli O157:H7 (EHEC). Produces Shiga toxin causing hemorrhagic colitis and HUS. Most E. coli are sorbitol-positive. Confirm with O157 latex agglutination and Shiga toxin testing.",
      difficulty: 2,
      category: "Microbiology",
      topic: "enteric pathogens"
    },
  {
      id: "mlt-479",
      stem: "ANA testing by IFA shows a homogeneous pattern at 1:640 titer. Anti-dsDNA antibodies are positive. These results are most associated with:",
      options: ["Rheumatoid arthritis", "Systemic lupus erythematosus (SLE)", "Scleroderma", "Sjögren's syndrome"],
      correctIndex: 1,
      rationale: "Homogeneous ANA pattern + positive anti-dsDNA = highly specific for SLE (>95% specificity). Anti-dsDNA correlates with disease activity and lupus nephritis. Homogeneous pattern also seen with anti-histone (drug-induced lupus).",
      difficulty: 2,
      category: "Immunology/Serology",
      topic: "autoimmune antibody patterns"
    },
  {
      id: "mlt-480",
      stem: "Complement levels show C3 low, C4 low, CH50 low. These findings indicate:",
      options: ["Alternative pathway activation only", "Classical pathway activation (both pathways affected)", "Complement deficiency is impossible", "Normal complement levels"],
      correctIndex: 1,
      rationale: "Low C3, C4, and CH50 = classical pathway activation consuming early components (C1, C4, C2) and C3. Seen in SLE, immune complex disease, serum sickness. Alternative pathway activation: low C3, normal C4. CH50 screens total classical pathway function.",
      difficulty: 3,
      category: "Immunology/Serology",
      topic: "complement system"
    },
  {
      id: "mlt-481",
      stem: "A synovial fluid analysis shows: WBC 48,000/μL (90% neutrophils), negatively birefringent needle-shaped crystals under polarized microscopy. The diagnosis is:",
      options: ["Pseudogout", "Gout (monosodium urate crystals)", "Rheumatoid arthritis", "Septic arthritis"],
      correctIndex: 1,
      rationale: "Negatively birefringent, needle-shaped crystals = monosodium urate (gout). Pseudogout: positively birefringent, rhomboid-shaped calcium pyrophosphate dihydrate (CPPD) crystals. High WBC with neutrophils may overlap with septic arthritis — always culture.",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "crystal identification"
    },
  {
      id: "mlt-482",
      stem: "Urine microscopy shows waxy casts in a patient with chronic kidney disease and creatinine 5.2 mg/dL. Waxy casts indicate:",
      options: ["Acute infection", "Chronic renal failure with tubular stasis", "Normal finding", "Acute glomerulonephritis"],
      correctIndex: 1,
      rationale: "Waxy casts = chronic renal stasis and severe tubular degeneration. They represent the final stage of cast formation (hyaline → granular → waxy). Broad waxy casts ('renal failure casts') form in dilated, atrophic tubules.",
      difficulty: 2,
      category: "Urinalysis/Body Fluids",
      topic: "cast identification"
    },
  {
      id: "mlt-483",
      stem: "A laboratory performs proficiency testing (PT) and fails two consecutive events for glucose. The regulatory action required is:",
      options: ["No action needed", "Cease testing for glucose until root cause analysis and corrective action are completed", "Switch to a new PT provider", "Ignore if patient results are acceptable"],
      correctIndex: 1,
      rationale: "CLIA requires: failure of 2 consecutive PT events or 2 of 3 events → suspend testing for that analyte. Must investigate root cause, implement corrective action, and demonstrate acceptable performance before resuming. CMS may impose sanctions.",
      difficulty: 2,
      category: "Quality Assurance",
      topic: "proficiency testing"
    },
  {
      id: "mlt-484",
      stem: "A specimen received in the laboratory has no patient identification on the tube, only on the requisition. The correct action is:",
      options: ["Match it to the requisition and process", "Reject the specimen and request recollection", "Label it from the requisition", "Process and add a note"],
      correctIndex: 1,
      rationale: "Unlabeled specimens must be rejected. Patient safety standards (CAP/TJC) require minimum two unique identifiers on the specimen container itself. Labeling from the requisition introduces misidentification risk. Recollection required.",
      difficulty: 1,
      category: "Laboratory Operations",
      topic: "specimen acceptance criteria"
    },
  {
      id: "mlt-485",
      stem: "The FISH technique is used to detect the BCR-ABL fusion gene t(9;22). A positive result is diagnostic for:",
      options: ["Acute lymphoblastic leukemia only", "Chronic myelogenous leukemia (Philadelphia chromosome)", "Multiple myeloma", "Hodgkin lymphoma"],
      correctIndex: 1,
      rationale: "BCR-ABL fusion from t(9;22) Philadelphia chromosome = hallmark of CML (>95%). Also found in ~25% of adult ALL. FISH uses fluorescent probes to detect specific chromosomal abnormalities on interphase or metaphase cells. Treatment: tyrosine kinase inhibitors (imatinib).",
      difficulty: 2,
      category: "Molecular Diagnostics",
      topic: "FISH and cytogenetics"
    },
  {
      id: "mlt-486",
      stem: "Southern blot analysis is used for:",
      options: ["RNA detection", "DNA detection and analysis", "Protein detection", "Carbohydrate analysis"],
      correctIndex: 1,
      rationale: "Southern blot: DNA → gel electrophoresis → transfer to membrane → hybridize with labeled probe. Northern blot: RNA analysis. Western blot: protein detection. Named after Edwin Southern; Northern and Western are directional plays on the name.",
      difficulty: 1,
      category: "Molecular Diagnostics",
      topic: "blotting techniques"
    },
  {
      id: "mlt-487",
      stem: "A blood gas specimen collected in a heparinized syringe has a large air bubble that was not removed for 30 minutes. The expected effect on results is:",
      options: ["Increased pCO₂, decreased pO₂", "Decreased pCO₂, increased pO₂", "No effect", "Increased both pO₂ and pCO₂"],
      correctIndex: 1,
      rationale: "Air exposure equilibrates blood gases toward atmospheric levels: pO₂ increases toward ~150 mmHg, pCO₂ decreases toward ~0.3 mmHg (atmospheric). Net effect: falsely increased pO₂ and decreased pCO₂. Always expel air bubbles immediately.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "blood gas preanalytical errors"
    },
  {
      id: "mlt-488",
      stem: "A patient's total calcium is 8.2 mg/dL with albumin 2.0 g/dL. The corrected calcium is:",
      options: ["8.2 mg/dL", "9.8 mg/dL", "7.4 mg/dL", "10.6 mg/dL"],
      correctIndex: 1,
      rationale: "Corrected Ca = total Ca + 0.8 × (4.0 - albumin). = 8.2 + 0.8 × (4.0 - 2.0) = 8.2 + 1.6 = 9.8 mg/dL. Hypoalbuminemia causes falsely low total calcium because ~40% of calcium is albumin-bound. Ionized calcium is not affected.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "calcium corrections"
    },
  {
      id: "mlt-489",
      stem: "An organism isolated from a cystic fibrosis patient's sputum grows on Burkholderia cepacia selective agar (BCSA). The organism is oxidase-positive and resistant to polymyxin B. Identification:",
      options: ["Pseudomonas aeruginosa", "Burkholderia cepacia complex", "Stenotrophomonas maltophilia", "Achromobacter xylosoxidans"],
      correctIndex: 1,
      rationale: "Growth on BCSA + oxidase-positive + polymyxin B resistant + CF patient = Burkholderia cepacia complex. Important CF pathogen associated with rapid clinical decline ('cepacia syndrome'). Intrinsically resistant to polymyxins and aminoglycosides.",
      difficulty: 3,
      category: "Microbiology",
      topic: "cystic fibrosis pathogens"
    },
  {
      id: "mlt-490",
      stem: "A platelet count by automated counter is 45 × 10⁹/L. Peripheral smear shows platelet clumps. The most likely cause and action is:",
      options: ["True thrombocytopenia — transfuse platelets", "EDTA-induced pseudothrombocytopenia — recollect in sodium citrate", "DIC — order coagulation studies", "ITP — no action needed"],
      correctIndex: 1,
      rationale: "Platelet clumping on smear with low automated count = EDTA-induced pseudothrombocytopenia. EDTA activates platelet GP IIb/IIIa causing aggregation. Recollect in sodium citrate tube and multiply result by 1.1 (to correct for citrate dilution).",
      difficulty: 2,
      category: "Hematology",
      topic: "platelet count discrepancies"
    },
  {
      id: "mlt-491",
      stem: "A patient's mixing study corrects the prolonged aPTT immediately but shows prolongation again after 2-hour incubation at 37°C. This pattern indicates:",
      options: ["Factor deficiency", "Lupus anticoagulant", "Factor VIII inhibitor (time- and temperature-dependent)", "Heparin contamination"],
      correctIndex: 2,
      rationale: "Correction initially then prolongation after incubation = time- and temperature-dependent inhibitor, classic for Factor VIII inhibitor (acquired hemophilia). Lupus anticoagulant: no correction at all. Factor deficiency: corrects and stays corrected.",
      difficulty: 3,
      category: "Hematology",
      topic: "mixing study interpretation"
    },
  {
      id: "mlt-492",
      stem: "Which GHS pictogram represents a health hazard such as carcinogenicity, mutagenicity, or respiratory sensitization?",
      options: ["Flame pictogram", "Exclamation mark", "Health hazard (silhouette of person with starburst on chest)", "Skull and crossbones"],
      correctIndex: 2,
      rationale: "GHS health hazard pictogram (person with starburst/exploding chest): carcinogen, mutagen, reproductive toxin, respiratory sensitizer, target organ toxicity, aspiration hazard. Skull/crossbones = acute toxicity. Exclamation mark = irritant, narcotic.",
      difficulty: 1,
      category: "Laboratory Safety",
      topic: "GHS hazard communication"
    },
  {
      id: "mlt-493",
      stem: "The correct order of draw for venipuncture using evacuated tubes is:",
      options: ["Lavender, green, red, blue", "Blood culture, light blue (citrate), red/gold, green, lavender", "Red, lavender, blue, green", "Any order is acceptable"],
      correctIndex: 1,
      rationale: "CLSI order of draw: blood culture (sterile) → light blue (citrate — fill completely) → red/gold (SST) → green (heparin) → lavender (EDTA) → gray (fluoride/oxalate). Prevents additive carryover between tubes. Blue top must be filled completely for proper 9:1 ratio.",
      difficulty: 1,
      category: "Laboratory Operations",
      topic: "phlebotomy procedures"
    },
  {
      id: "mlt-494",
      stem: "During validation of a new chemistry analyzer, the laboratory compares 40 patient samples between old and new instruments. The correlation coefficient (r) is 0.998 and the slope is 1.02. This indicates:",
      options: ["Poor correlation", "Excellent correlation with minimal proportional error", "Significant random error", "The methods cannot be compared"],
      correctIndex: 1,
      rationale: "r = 0.998 (near 1.0) = excellent correlation. Slope 1.02 (near 1.0) = minimal proportional bias (2%). Ideal: r ≥ 0.975, slope 0.97-1.03, intercept near 0. Also evaluate using Bland-Altman plots for agreement at different concentration levels.",
      difficulty: 2,
      category: "Quality Assurance",
      topic: "method validation statistics"
    },
  {
      id: "mlt-495",
      stem: "Irradiated blood products are indicated to prevent:",
      options: ["Bacterial contamination", "Transfusion-associated graft-versus-host disease (TA-GVHD)", "Febrile nonhemolytic reactions", "Allergic reactions"],
      correctIndex: 1,
      rationale: "Gamma irradiation (25 Gy minimum) inactivates donor T-lymphocytes to prevent TA-GVHD. Indicated for: immunocompromised patients, directed donations from blood relatives, HLA-matched products, intrauterine transfusions, bone marrow transplant recipients.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "irradiated products"
    },
  {
      id: "mlt-496",
      stem: "A unit of RBCs has been out of monitored storage for 45 minutes. Per AABB standards, can it be returned to inventory?",
      options: ["Yes, if it looks normal", "No — RBCs out of controlled storage for >30 minutes cannot be reissued", "Yes, if temperature is checked", "Only if less than 1 hour"],
      correctIndex: 1,
      rationale: "AABB standards: RBCs must be returned to monitored refrigeration within 30 minutes of issue. After 30 minutes, the unit cannot be reissued to another patient due to uncertain temperature maintenance. Must be transfused or discarded.",
      difficulty: 2,
      category: "Blood Banking",
      topic: "blood product storage"
    },
  {
      id: "mlt-497",
      stem: "A throat culture on blood agar shows small, translucent colonies with a wide zone of beta-hemolysis. The organism is bacitracin-susceptible and PYR-positive. The identification is:",
      options: ["Staphylococcus aureus", "Streptococcus pyogenes (Group A Strep)", "Streptococcus agalactiae (Group B Strep)", "Streptococcus pneumoniae"],
      correctIndex: 1,
      rationale: "Beta-hemolytic + bacitracin-susceptible + PYR-positive = Group A Streptococcus (S. pyogenes). Group B (S. agalactiae): bacitracin-resistant, CAMP-positive, hippurate-positive. S. pneumoniae: alpha-hemolytic, optochin-susceptible.",
      difficulty: 1,
      category: "Microbiology",
      topic: "streptococcal identification"
    },
  {
      id: "mlt-498",
      stem: "A serum sample shows: AST 245 U/L, ALT 312 U/L, ALP 95 U/L, GGT 42 U/L, total bilirubin 1.8 mg/dL. This pattern suggests:",
      options: ["Obstructive biliary disease", "Hepatocellular damage (hepatitis pattern)", "Bone disease", "Normal liver function"],
      correctIndex: 1,
      rationale: "Markedly elevated AST/ALT with relatively normal ALP/GGT = hepatocellular pattern (viral hepatitis, drug toxicity). Obstructive pattern: elevated ALP/GGT with mild AST/ALT elevation. ALT is more liver-specific than AST. De Ritis ratio (AST/ALT <1) suggests viral cause.",
      difficulty: 2,
      category: "Clinical Chemistry",
      topic: "liver function panel interpretation"
    },
  {
      id: "mlt-499",
      stem: "Next-generation sequencing (NGS) differs from Sanger sequencing primarily in its ability to:",
      options: ["Sequence only one fragment at a time", "Perform massively parallel sequencing of millions of fragments simultaneously", "Use dideoxynucleotides exclusively", "Sequence RNA only"],
      correctIndex: 1,
      rationale: "NGS (massively parallel sequencing): sequences millions of DNA fragments simultaneously, enabling whole genome, exome, or targeted panel sequencing. Sanger: sequences one fragment at a time (gold standard for single gene/confirmation). NGS platforms: Illumina, Ion Torrent, PacBio.",
      difficulty: 2,
      category: "Molecular Diagnostics",
      topic: "sequencing technologies"
    },
  {
      id: "mlt-500",
      stem: "A laboratory safety officer discovers that a centrifuge rotor is corroded and unbalanced. The correct action is:",
      options: ["Continue using with caution", "Remove from service, tag as defective, and arrange repair or replacement", "Clean with bleach and continue", "Use at reduced speed only"],
      correctIndex: 1,
      rationale: "Corroded/unbalanced centrifuge rotor = safety hazard (catastrophic failure risk at high RPM). Must be immediately removed from service, tagged out (lockout/tagout), and reported for repair or replacement. Never operate damaged centrifuge equipment.",
      difficulty: 1,
      category: "Laboratory Safety",
      topic: "equipment safety"
    }
];
