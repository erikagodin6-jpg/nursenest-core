import type { LessonContent } from "./types";

export const rpnPathoHematologyEndocrineLessons: Record<string, LessonContent> = {
  "rpn-neutropenia": {
    title: "Neutropenia",
    cellular: {
      title: "Neutrophil Deficiency and Infection Risk",
      content: "Neutropenia is defined as an absolute neutrophil count (ANC) less than 1,500 cells/µL, with severe neutropenia below 500 cells/µL and profound neutropenia below 100 cells/µL. Neutrophils are the most abundant white blood cells and form the first line of innate immune defense against bacterial and fungal pathogens. They are produced in the bone marrow from myeloid progenitor cells through a process called granulopoiesis, regulated by granulocyte colony-stimulating factor (G-CSF) and granulocyte-macrophage CSF (GM-CSF). Mature neutrophils have a lifespan of only 6-8 hours in circulation before migrating into tissues. The bone marrow maintains a reserve pool approximately 10 times the circulating neutrophil count, which can be mobilized rapidly during infection (demargination). When neutrophils encounter pathogens, they employ three killing mechanisms: phagocytosis (engulfing and digesting microbes in phagolysosomes using reactive oxygen species from the respiratory burst and proteolytic enzymes), degranulation (releasing antimicrobial peptides and enzymes from intracellular granules), and NETosis (extruding chromatin fibers studded with antimicrobial proteins to trap and kill extracellular pathogens). In neutropenia, this critical defense barrier is severely compromised. The most common cause in clinical practice is chemotherapy-induced myelosuppression, where cytotoxic drugs damage rapidly dividing bone marrow precursors. The nadir (lowest ANC) typically occurs 7-14 days after chemotherapy. Without adequate neutrophils, even normal flora bacteria can cause overwhelming sepsis. Critically, neutropenic patients may not mount a normal inflammatory response — they may not develop pus, may have minimal redness or swelling at infection sites, and their only sign of infection may be FEVER. This is why fever in a neutropenic patient (febrile neutropenia: ANC <500 + temperature ≥38.3°C once or ≥38.0°C sustained for 1 hour) is a medical emergency requiring immediate empiric broad-spectrum antibiotic therapy."
    },
    riskFactors: [
      "Chemotherapy (most common cause — particularly alkylating agents, antimetabolites)",
      "Radiation therapy to bone marrow-producing sites",
      "Hematologic malignancies (leukemia, lymphoma, myelodysplastic syndrome)",
      "Aplastic anemia",
      "Severe sepsis (neutrophil consumption exceeds production)",
      "Medications: clozapine, carbamazepine, methimazole, sulfasalazine",
      "Autoimmune disorders (SLE, rheumatoid arthritis — autoimmune neutropenia)",
      "Nutritional deficiencies (severe vitamin B12 or folate deficiency)"
    ],
    diagnostics: [
      "Complete blood count with differential — calculate ANC (% neutrophils + % bands × WBC)",
      "Monitor ANC trends post-chemotherapy (expect nadir 7-14 days post-treatment)",
      "Blood cultures (minimum 2 sets from different sites) before starting antibiotics if febrile",
      "Urinalysis and urine culture",
      "Chest X-ray if respiratory symptoms present",
      "Monitor temperature q4h or more frequently — fever may be the ONLY sign of infection"
    ],
    management: [
      "Neutropenic precautions: private room, limit visitors, strict hand hygiene, no fresh flowers or standing water",
      "Administer G-CSF (filgrastim) as prescribed to stimulate neutrophil production",
      "Febrile neutropenia: initiate empiric broad-spectrum antibiotics WITHIN 1 HOUR of fever onset",
      "Avoid rectal temperatures, rectal medications, suppositories (risk of perirectal abscess)",
      "No raw or undercooked foods (neutropenic diet)",
      "Avoid intramuscular injections when possible",
      "Monitor for signs of infection at all potential sites: mouth, lungs, skin, perineum, IV sites"
    ],
    nursingActions: [
      "Monitor temperature q4h — report fever ≥38.3°C immediately as medical emergency",
      "Implement strict neutropenic precautions: hand hygiene, protective isolation, limit visitors",
      "Assess oral mucosa for stomatitis/mucositis (common infection site in neutropenia)",
      "Perform meticulous skin and IV site assessment — redness without pus is significant",
      "Administer antibiotics within 1 hour of fever onset in febrile neutropenia — delay increases mortality",
      "Avoid invasive procedures: no rectal temps, no unnecessary venipunctures, no urinary catheterization unless essential",
      "Teach patient and family about infection prevention: hand hygiene, avoiding crowds, avoiding sick contacts",
      "Administer G-CSF as prescribed — monitor for bone pain (most common side effect)"
    ],
    assessmentFindings: [
      "May be ASYMPTOMATIC until infection develops",
      "Fever may be the ONLY sign of infection (absent pus, minimal inflammation)",
      "Stomatitis/oral mucositis (painful mouth ulcers)",
      "Fatigue and malaise",
      "Signs of sepsis: fever, tachycardia, hypotension, altered mental status"
    ],
    signs: {
      left: ["ANC <1,500 cells/µL", "Fever (may be only sign)", "Stomatitis/mucositis", "Fatigue"],
      right: ["Absent pus formation", "Minimal inflammatory response", "Infection at any site", "Sepsis risk"]
    },
    medications: [
      { name: "Filgrastim (G-CSF)", type: "Colony-Stimulating Factor", action: "Stimulates bone marrow to produce neutrophils, shortening duration and severity of neutropenia", sideEffects: "Bone pain (most common — from marrow expansion), injection site reactions, splenic enlargement", contra: "Hypersensitivity to E. coli-derived proteins", pearl: "Bone pain is expected and treated with acetaminophen or NSAIDs. Do NOT administer within 24 hours of chemotherapy — can damage rapidly dividing precursors." },
      { name: "Piperacillin-Tazobactam", type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor", action: "Empiric broad-spectrum coverage for febrile neutropenia covering gram-positive, gram-negative, and anaerobic organisms", sideEffects: "Diarrhea, hypersensitivity, thrombocytopenia", contra: "Penicillin allergy", pearl: "First-line empiric monotherapy for febrile neutropenia. Must be started within 1 HOUR of fever onset." }
    ],
    pearls: [
      "Fever + Neutropenia = MEDICAL EMERGENCY — antibiotics within 1 HOUR saves lives",
      "ANC <500 = severe neutropenia. Calculate ANC: (% neutrophils + % bands) × WBC count",
      "Neutropenic patients may NOT produce pus — absence of pus does NOT mean absence of infection",
      "NEVER take rectal temperatures in neutropenic patients — risk of perirectal abscess and bacteremia",
      "Chemotherapy nadir is typically 7-14 days post-treatment — anticipate and prepare",
      "Hand hygiene is the SINGLE most important infection prevention measure"
    ],
    quiz: [
      { question: "A client receiving chemotherapy has an ANC of 420 cells/µL and a temperature of 38.5°C. What is the priority nursing action?", options: ["Apply a cooling blanket and recheck temperature in 1 hour", "Obtain blood cultures and initiate empiric antibiotics within 1 hour", "Encourage oral fluids and monitor", "Administer acetaminophen and reassess"], correct: 1, rationale: "This client has febrile neutropenia (ANC <500 + temp ≥38.3°C), which is a medical emergency. Blood cultures should be drawn and empiric broad-spectrum antibiotics started within 1 hour — delay increases mortality from overwhelming sepsis." },
      { question: "Why are rectal temperatures contraindicated in neutropenic patients?", options: ["Rectal temperatures are less accurate", "The thermometer may introduce bacteria through damaged mucosa, causing perirectal abscess and bacteremia", "Rectal temperatures read artificially high", "It is uncomfortable for the patient"], correct: 1, rationale: "Neutropenic patients have impaired mucosal integrity from chemotherapy. Rectal instrumentation can introduce bacteria through micro-tears, leading to perirectal abscess and life-threatening bacteremia in a patient who cannot mount an adequate immune response." }
    ]
  },

  "rpn-dic": {
    title: "Disseminated Intravascular Coagulation (DIC)",
    cellular: {
      title: "Simultaneous Clotting and Bleeding Cascade",
      content: "Disseminated intravascular coagulation (DIC) is a life-threatening acquired coagulopathy characterized by the paradoxical simultaneous activation of both coagulation and fibrinolysis throughout the microvasculature. DIC is always secondary to an underlying condition — it is never a primary diagnosis. The pathophysiology begins when a triggering event (sepsis, massive trauma, obstetric complications, malignancy) causes widespread exposure of tissue factor (TF) to the bloodstream or massive release of procoagulant substances. Tissue factor activates the extrinsic coagulation pathway, generating thrombin. In DIC, this thrombin generation is massive and uncontrolled. Thrombin converts fibrinogen to fibrin, and fibrin strands deposit throughout the microvasculature, forming thousands of small thrombi in capillaries and arterioles of virtually every organ. This microvascular thrombosis causes ischemic end-organ damage: renal failure, hepatic dysfunction, ARDS, digital ischemia, and cerebral infarction. Simultaneously, the massive consumption of coagulation factors (I, II, V, VIII, and fibrinogen) and platelets depletes the body's clotting reserves — hence the term 'consumptive coagulopathy.' With clotting factors and platelets exhausted, the patient develops severe bleeding from every site: venipuncture sites, surgical wounds, mucous membranes, and internal organs. Compounding this, the fibrinolytic system activates to break down the deposited fibrin, generating fibrin degradation products (FDPs) and D-dimers. These FDPs have anticoagulant properties, further impairing hemostasis and worsening bleeding. The clinical paradox of DIC is simultaneous thrombosis (causing organ damage) and hemorrhage (from factor/platelet consumption). Laboratory hallmarks include elevated D-dimer, elevated PT/INR and aPTT, decreased fibrinogen, decreased platelets, and the presence of schistocytes (fragmented red blood cells) on peripheral smear from mechanical shearing as RBCs pass through fibrin-occluded microvessels."
    },
    riskFactors: [
      "Sepsis (most common trigger — particularly gram-negative bacteremia)",
      "Obstetric complications: placental abruption, amniotic fluid embolism, eclampsia, retained products of conception",
      "Massive trauma or burns",
      "Malignancy (particularly acute promyelocytic leukemia, pancreatic cancer)",
      "Transfusion reactions (ABO incompatibility)",
      "Snake envenomation",
      "Liver failure (impaired clotting factor synthesis)"
    ],
    diagnostics: [
      "D-dimer: ELEVATED (most sensitive marker — fibrin degradation product)",
      "Fibrinogen: DECREASED (<200 mg/dL — consumed in clot formation)",
      "Platelets: DECREASED (consumed in microvascular thrombi)",
      "PT/INR and aPTT: PROLONGED (clotting factors consumed)",
      "Peripheral blood smear: schistocytes (fragmented RBCs)",
      "Monitor for signs of both bleeding AND thrombosis simultaneously"
    ],
    management: [
      "TREAT THE UNDERLYING CAUSE — this is the ONLY definitive treatment",
      "Replace depleted blood products as ordered: platelets, fresh frozen plasma (FFP), cryoprecipitate (fibrinogen)",
      "Heparin therapy may be ordered in thrombosis-predominant DIC (controversial — consult physician)",
      "Supportive care: hemodynamic stabilization, organ support",
      "Transfuse packed red blood cells for significant hemorrhage",
      "Monitor for end-organ damage: renal failure, ARDS, hepatic failure"
    ],
    nursingActions: [
      "Monitor for signs of bleeding: petechiae, purpura, oozing from IV sites, hematuria, melena, hematemesis",
      "Monitor for signs of thrombosis: mottled extremities, altered LOC, decreased urine output, dyspnea",
      "Minimize venipunctures and invasive procedures — apply prolonged pressure to all puncture sites",
      "Use gentle care: soft toothbrush, electric razor only, avoid IM injections",
      "Monitor laboratory values frequently: platelets, PT/INR, aPTT, fibrinogen, D-dimer",
      "Administer blood products as ordered — monitor for transfusion reactions",
      "Assess for signs of shock: tachycardia, hypotension, altered mental status",
      "Protect skin integrity — avoid tape, use padded side rails"
    ],
    assessmentFindings: [
      "Bleeding from multiple sites simultaneously (IV sites, mucous membranes, surgical wounds)",
      "Petechiae, purpura, ecchymoses",
      "Oozing from venipuncture sites that does not stop with pressure",
      "Signs of organ ischemia: oliguria, altered LOC, dyspnea, mottled extremities",
      "Hemodynamic instability from blood loss"
    ],
    signs: {
      left: ["Bleeding from multiple sites", "Petechiae/purpura/ecchymoses", "Oozing from IV sites", "Hematuria/melena"],
      right: ["Mottled extremities (thrombosis)", "Altered LOC", "Oliguria", "Elevated D-dimer, low fibrinogen"]
    },
    medications: [
      { name: "Cryoprecipitate", type: "Blood Product (Fibrinogen Source)", action: "Replaces consumed fibrinogen (factor I) and factor VIII", sideEffects: "Transfusion reactions, volume overload", contra: "Must be ABO compatible", pearl: "Given when fibrinogen <100-150 mg/dL. Each unit raises fibrinogen by approximately 5-10 mg/dL." },
      { name: "Fresh Frozen Plasma (FFP)", type: "Blood Product (Clotting Factor Source)", action: "Replaces all consumed coagulation factors", sideEffects: "Volume overload, TRALI, allergic reactions", contra: "Must be ABO compatible", pearl: "Given to correct prolonged PT/INR and aPTT. Contains ALL clotting factors." },
      { name: "Platelet Transfusion", type: "Blood Product", action: "Replaces consumed platelets to support hemostasis", sideEffects: "Febrile reactions, alloimmunization", contra: "HIT (heparin-induced thrombocytopenia)", pearl: "Transfuse for active bleeding with platelets <50,000 or prophylactically if <10,000." }
    ],
    pearls: [
      "DIC is ALWAYS secondary — find and treat the underlying cause or the patient will not survive",
      "The paradox of DIC: simultaneous CLOTTING (organ ischemia) and BLEEDING (factor/platelet consumption)",
      "Lab pattern: everything that should be UP is DOWN (platelets, fibrinogen) and everything that should be DOWN is UP (D-dimer, PT, aPTT)",
      "Schistocytes on peripheral smear = mechanical RBC fragmentation through fibrin-clogged microvessels",
      "Oozing from venipuncture sites that does not stop is a classic early clinical sign",
      "Sepsis is the most common trigger — always consider DIC in deteriorating septic patients"
    ],
    quiz: [
      { question: "Which laboratory finding is MOST consistent with DIC?", options: ["Elevated platelets and decreased D-dimer", "Decreased platelets, prolonged PT/INR, elevated D-dimer, and decreased fibrinogen", "Normal coagulation studies with isolated thrombocytopenia", "Elevated fibrinogen with normal PT/INR"], correct: 1, rationale: "DIC is characterized by consumption of clotting factors (prolonged PT/INR), consumption of platelets (thrombocytopenia), consumption of fibrinogen (low), and activation of fibrinolysis (elevated D-dimer). This pattern reflects simultaneous coagulation activation and factor/platelet consumption." },
      { question: "What is the definitive treatment for DIC?", options: ["Heparin infusion", "Platelet transfusion", "Treatment of the underlying cause", "Vitamin K administration"], correct: 2, rationale: "DIC is always secondary to an underlying condition. The only definitive treatment is identifying and treating the trigger (antibiotics for sepsis, delivery for obstetric complications, treatment of malignancy). Blood product replacement is supportive but will not resolve DIC if the trigger persists." }
    ]
  },

  "rpn-iron-deficiency-anemia": {
    title: "Iron-Deficiency Anemia",
    cellular: {
      title: "Impaired Hemoglobin Synthesis from Iron Depletion",
      content: "Iron-deficiency anemia (IDA) is the most common type of anemia worldwide, resulting from insufficient iron stores to support adequate hemoglobin synthesis. Iron is an essential component of the heme molecule within hemoglobin, and each hemoglobin molecule contains four heme groups, each requiring one iron atom (Fe²⁺) to bind oxygen. Without adequate iron, bone marrow erythroblasts cannot produce sufficient hemoglobin, resulting in microcytic (small), hypochromic (pale) red blood cells with reduced oxygen-carrying capacity. Iron metabolism is a tightly regulated closed system with no physiological excretion mechanism — iron is lost only through bleeding, desquamation of skin and mucosal cells, and menstruation. Dietary iron is absorbed primarily in the duodenum and proximal jejunum. Heme iron (from animal sources) is absorbed more efficiently (15-35%) than non-heme iron (from plant sources, 2-20%). Non-heme iron absorption requires an acidic environment (gastric acid converts Fe³⁺ to the more absorbable Fe²⁺), which is why proton pump inhibitors and antacids can impair iron absorption. Absorbed iron binds to transferrin in the plasma for transport to the bone marrow (for hemoglobin synthesis) or to the liver and reticuloendothelial macrophages (for storage as ferritin and hemosiderin). Hepcidin, a hepatic peptide hormone, is the master regulator of iron homeostasis: it inhibits ferroportin (the iron export protein on enterocytes and macrophages), reducing iron absorption and release when stores are adequate, and decreasing when iron is needed. In IDA, iron depletion progresses through three stages: Stage 1 — decreased ferritin (depleted iron stores) with normal hemoglobin; Stage 2 — decreased serum iron, increased TIBC (total iron-binding capacity, reflecting increased transferrin production by iron-starved hepatocytes), decreased transferrin saturation (<20%); Stage 3 — frank anemia with decreased hemoglobin and hematocrit, microcytic hypochromic RBCs on peripheral smear, and elevated RDW (red cell distribution width, reflecting size variation)."
    },
    riskFactors: [
      "Chronic blood loss (GI bleeding from ulcers, colon cancer, heavy menstruation — most common causes in adults)",
      "Inadequate dietary intake (vegetarians/vegans, elderly with poor nutrition, restrictive diets)",
      "Malabsorption (celiac disease, gastric bypass surgery, inflammatory bowel disease, chronic PPI use)",
      "Increased iron demands (pregnancy, infancy, adolescent growth spurt)",
      "Frequent blood donation",
      "Chronic kidney disease (reduced erythropoietin)"
    ],
    diagnostics: [
      "CBC: decreased Hgb/Hct, low MCV (microcytic), low MCH/MCHC (hypochromic), elevated RDW",
      "Serum ferritin: DECREASED (most sensitive early marker of iron depletion, <12 ng/mL diagnostic)",
      "Serum iron: DECREASED",
      "TIBC: INCREASED (reflects increased transferrin production)",
      "Transferrin saturation: DECREASED (<20%)",
      "Peripheral smear: microcytic hypochromic RBCs, target cells, pencil cells",
      "Stool guaiac (occult blood) to evaluate for GI bleeding source"
    ],
    management: [
      "Identify and treat the underlying cause (most important — especially GI bleeding source)",
      "Oral iron supplementation as prescribed (ferrous sulfate 325 mg 1-3 times daily)",
      "Take iron on empty stomach with vitamin C to enhance absorption",
      "Separate iron from calcium, antacids, PPIs, tetracyclines, and dairy by 2 hours",
      "IV iron (iron sucrose, ferric carboxymaltose) for malabsorption or intolerance of oral iron",
      "RBC transfusion for severe symptomatic anemia (Hgb <7 g/dL with symptoms)"
    ],
    nursingActions: [
      "Administer oral iron as prescribed — educate on proper timing and interactions",
      "Teach to take iron on empty stomach 1 hour before or 2 hours after meals (if tolerated) with vitamin C (orange juice)",
      "Warn that iron causes BLACK STOOLS (normal, not blood) and may cause constipation, nausea, GI upset",
      "If GI side effects are severe, may take with small amount of food (reduces absorption but improves tolerance)",
      "For liquid iron: use a straw and rinse mouth after to prevent tooth staining",
      "Monitor Hgb/Hct trends — expect improvement within 2-3 weeks, full correction in 2-3 months",
      "Assess for ongoing blood loss sources (stool guaiac, menstrual history)",
      "Educate on iron-rich foods: red meat, dark leafy greens, fortified cereals, beans, dried fruits"
    ],
    assessmentFindings: [
      "Fatigue, weakness, exercise intolerance (most common symptoms)",
      "Pallor (conjunctival, palmar, nail bed)",
      "Tachycardia (compensatory — heart works harder to deliver oxygen)",
      "Dyspnea on exertion",
      "Pica (craving non-food items: ice, clay, starch — pathognomonic for IDA)",
      "Koilonychia (spoon-shaped nails)",
      "Angular cheilitis (cracking at corners of mouth)",
      "Glossitis (smooth, red, painful tongue)"
    ],
    signs: {
      left: ["Fatigue/weakness", "Pallor", "Tachycardia", "Dyspnea on exertion"],
      right: ["Pica (ice, clay, starch cravings)", "Koilonychia (spoon nails)", "Glossitis", "Low MCV, low ferritin"]
    },
    medications: [
      { name: "Ferrous Sulfate", type: "Oral Iron Supplement", action: "Provides elemental iron for hemoglobin synthesis in the bone marrow", sideEffects: "Black/tarry stools (normal), constipation, nausea, GI upset, tooth staining (liquid)", contra: "Iron overload, hemochromatosis, hemolytic anemias", pearl: "Take on empty stomach with vitamin C. Separate from dairy, calcium, antacids, PPIs by 2 hours. Black stools are NORMAL. Treatment continues 3-6 months AFTER Hgb normalizes to replenish stores." },
      { name: "Iron Sucrose (Venofer) IV", type: "Parenteral Iron", action: "Delivers iron directly to transferrin and storage sites, bypassing GI absorption", sideEffects: "Hypotension during infusion, headache, nausea, injection site reactions, rare anaphylaxis", contra: "Iron overload, active infection (iron feeds bacteria)", pearl: "Used when oral iron is not tolerated or not absorbed (celiac, post-gastric bypass). Infuse SLOWLY. Monitor for hypotension and anaphylaxis during and 30 min after infusion." }
    ],
    pearls: [
      "Ferritin is the FIRST lab to drop and the BEST single test for IDA — low ferritin is diagnostic",
      "PICA (craving ice, clay, or starch) is almost pathognomonic for iron deficiency — always ask about it",
      "Black stools from iron are NORMAL and expected — distinguish from melena (which is sticky and foul-smelling)",
      "Continue iron therapy 3-6 months AFTER hemoglobin normalizes — the goal is to replenish iron stores, not just fix the Hgb",
      "In men and postmenopausal women, IDA = GI bleeding source until proven otherwise (colonoscopy indicated)",
      "Vitamin C enhances iron absorption; calcium, tannins (tea/coffee), and antacids inhibit it"
    ],
    quiz: [
      { question: "Which finding is most specific to iron-deficiency anemia compared to other anemias?", options: ["Fatigue", "Pallor", "Pica (craving ice or non-food substances)", "Tachycardia"], correct: 2, rationale: "Pica — craving non-nutritive substances like ice (pagophagia), clay (geophagia), or starch (amylophagia) — is highly specific to iron deficiency anemia. Fatigue, pallor, and tachycardia occur with any anemia type." },
      { question: "A client is taking ferrous sulfate for IDA. Which instruction is correct?", options: ["Take with milk to reduce stomach upset", "Take on empty stomach with orange juice for best absorption", "Take with an antacid to prevent GI irritation", "Take at bedtime with a calcium supplement"], correct: 1, rationale: "Iron is best absorbed on an empty stomach in an acidic environment. Vitamin C (ascorbic acid in orange juice) enhances non-heme iron absorption by converting Fe³⁺ to the more absorbable Fe²⁺ form. Milk, calcium, and antacids all inhibit iron absorption." }
    ]
  },

  "rpn-diabetes-type2": {
    title: "Type 2 Diabetes Mellitus",
    cellular: {
      title: "Insulin Resistance and Progressive Beta-Cell Dysfunction",
      content: "Type 2 diabetes mellitus (T2DM) is a chronic metabolic disorder characterized by insulin resistance in peripheral tissues and progressive pancreatic beta-cell dysfunction, resulting in hyperglycemia. Unlike type 1 diabetes (autoimmune beta-cell destruction), T2DM involves a gradual pathological process that unfolds over years. The pathophysiology centers on two interrelated defects. First, insulin resistance: target cells in skeletal muscle, adipose tissue, and the liver become less responsive to insulin's signaling. Normally, insulin binds to the insulin receptor (a receptor tyrosine kinase) on cell surfaces, triggering autophosphorylation and activation of intracellular signaling cascades, particularly the PI3K-Akt pathway. This pathway promotes translocation of GLUT4 glucose transporters to the cell surface in muscle and adipose tissue, allowing glucose uptake. In T2DM, chronic caloric excess, visceral adiposity, and physical inactivity cause intracellular lipid accumulation, chronic low-grade inflammation (elevated TNF-α, IL-6), and endoplasmic reticulum stress, all of which impair insulin receptor signaling through serine phosphorylation of insulin receptor substrate-1 (IRS-1), effectively downregulating the glucose transport pathway. Second, progressive beta-cell dysfunction: initially, pancreatic beta-cells compensate for insulin resistance by producing more insulin (compensatory hyperinsulinemia), maintaining near-normal blood glucose for years (prediabetes). Over time, the beta-cells become exhausted from chronic overstimulation, and toxic effects of chronic hyperglycemia (glucotoxicity) and elevated free fatty acids (lipotoxicity) further damage beta-cells through oxidative stress and amyloid deposition. Beta-cell mass may decrease by 50-65% by the time of T2DM diagnosis. Chronic hyperglycemia damages the vascular endothelium through four major mechanisms: increased polyol pathway flux, advanced glycation end-product (AGE) formation, protein kinase C (PKC) activation, and hexosamine pathway activation. These mechanisms cause microvascular complications (retinopathy, nephropathy, neuropathy) and accelerate macrovascular disease (MI, stroke, peripheral arterial disease)."
    },
    riskFactors: [
      "Obesity (BMI ≥30, particularly visceral/abdominal adiposity)",
      "Physical inactivity",
      "Family history of T2DM (first-degree relative)",
      "Ethnicity (Indigenous, African, Hispanic, South Asian, Pacific Islander)",
      "Gestational diabetes history",
      "Prediabetes (fasting glucose 6.1-6.9 mmol/L or HbA1c 6.0-6.4%)",
      "Polycystic ovary syndrome (PCOS)",
      "Hypertension, dyslipidemia, metabolic syndrome"
    ],
    diagnostics: [
      "Fasting plasma glucose (≥7.0 mmol/L diagnostic)",
      "HbA1c (≥6.5% diagnostic; target usually <7.0% for most adults)",
      "Random plasma glucose (≥11.1 mmol/L with symptoms diagnostic)",
      "75 g oral glucose tolerance test (2-hour glucose ≥11.1 mmol/L diagnostic)",
      "Monitor blood glucose per protocol (fasting, pre-meal, 2-hour postprandial, bedtime)",
      "Lipid panel, renal function, urine albumin-to-creatinine ratio annually",
      "Dilated eye exam annually for retinopathy screening"
    ],
    management: [
      "Lifestyle modification is FIRST-LINE: medical nutrition therapy, 150 min/week moderate exercise, weight loss 5-10%",
      "Metformin as first-line pharmacotherapy",
      "Administer prescribed oral hypoglycemics and/or insulin as disease progresses",
      "Blood glucose monitoring as prescribed",
      "Foot care education and assessment at every visit",
      "Annual screening for complications: eyes, kidneys, feet, cardiovascular risk",
      "Smoking cessation, blood pressure control, statin therapy as indicated"
    ],
    nursingActions: [
      "Monitor blood glucose levels as prescribed — report hypoglycemia (<4.0 mmol/L) and hyperglycemia (>14 mmol/L) promptly",
      "Teach self-monitoring of blood glucose (SMBG) technique and documentation",
      "Administer oral hypoglycemics and insulin as prescribed — verify dose, route, timing",
      "Educate on recognition and treatment of hypoglycemia: Rule of 15 (15 g fast-acting carb, recheck in 15 min)",
      "Perform comprehensive foot assessment: pulses, sensation (monofilament test), skin integrity, nail care",
      "Educate on sick day management: monitor glucose more frequently, continue medications, stay hydrated",
      "Teach carbohydrate counting and meal planning principles",
      "Assess injection sites for lipodystrophy if on insulin — rotate sites systematically"
    ],
    assessmentFindings: [
      "May be asymptomatic for years (diagnosed on routine bloodwork)",
      "Classic triad: polyuria (osmotic diuresis), polydipsia (thirst from dehydration), polyphagia (cellular starvation despite hyperglycemia)",
      "Weight loss (more common in severe/uncontrolled disease)",
      "Fatigue, blurred vision",
      "Slow wound healing, frequent infections (yeast infections common)",
      "Acanthosis nigricans (dark velvety patches — marker of insulin resistance)"
    ],
    signs: {
      left: ["Polyuria", "Polydipsia", "Polyphagia", "Fatigue"],
      right: ["Acanthosis nigricans", "Slow wound healing", "Frequent infections", "HbA1c ≥6.5%"]
    },
    medications: [
      { name: "Metformin", type: "Biguanide", action: "Decreases hepatic glucose production, increases insulin sensitivity in peripheral tissues, decreases intestinal glucose absorption", sideEffects: "GI upset (nausea, diarrhea, metallic taste), vitamin B12 deficiency with long-term use, lactic acidosis (rare but serious)", contra: "eGFR <30, active liver disease, excessive alcohol use, conditions predisposing to lactic acidosis", pearl: "FIRST-LINE for T2DM. Take with meals to reduce GI side effects. HOLD 48 hours before and after IV contrast dye. Does NOT cause hypoglycemia when used alone." },
      { name: "Gliclazide (Sulfonylurea)", type: "Insulin Secretagogue", action: "Stimulates pancreatic beta-cells to release insulin by blocking K-ATP channels, depolarizing the cell, and opening voltage-gated Ca²⁺ channels", sideEffects: "HYPOGLYCEMIA (most important), weight gain", contra: "Type 1 diabetes, DKA, severe renal/hepatic impairment", pearl: "CAN cause hypoglycemia — especially in elderly, skipped meals, or with alcohol. Teach patient to always carry fast-acting glucose." },
      { name: "Insulin Glargine (Lantus)", type: "Long-Acting Basal Insulin", action: "Forms microprecipitates in subcutaneous tissue providing slow, steady insulin release over 24 hours without a pronounced peak", sideEffects: "Hypoglycemia, weight gain, injection site reactions, lipodystrophy", contra: "Hypoglycemia episodes", pearl: "Give at the SAME TIME daily. Do NOT mix with other insulins. CLEAR solution (unlike NPH which is cloudy). Rotate injection sites to prevent lipodystrophy." }
    ],
    pearls: [
      "Metformin is FIRST-LINE and does NOT cause hypoglycemia when used alone — it reduces hepatic glucose output",
      "HbA1c reflects average blood glucose over 2-3 months (RBC lifespan) — target <7.0% for most adults",
      "Rule of 15 for hypoglycemia: 15 g fast-acting carb → wait 15 min → recheck → repeat if still <4.0 mmol/L",
      "Acanthosis nigricans (dark velvety skin in axillae, neck) = insulin resistance marker — often precedes T2DM diagnosis",
      "HOLD metformin 48 hours before and after IV contrast dye — risk of contrast-induced nephropathy potentiating lactic acidosis",
      "Foot complications are the #1 cause of non-traumatic lower extremity amputation — inspect feet at EVERY visit"
    ],
    quiz: [
      { question: "A client on metformin and gliclazide has a blood glucose of 3.5 mmol/L with tremor and diaphoresis. Which medication is most likely responsible?", options: ["Metformin", "Gliclazide", "Both medications equally", "Neither — this is not medication-related"], correct: 1, rationale: "Gliclazide (a sulfonylurea) stimulates insulin secretion regardless of blood glucose levels, creating risk for hypoglycemia. Metformin alone does not cause hypoglycemia because it works by reducing hepatic glucose output and improving insulin sensitivity rather than stimulating insulin release." },
      { question: "Why should metformin be held before a procedure using IV contrast dye?", options: ["Contrast dye inactivates metformin", "Contrast dye can impair renal function, and metformin accumulation in renal impairment increases lactic acidosis risk", "Metformin interferes with imaging quality", "To prevent hyperglycemia during the procedure"], correct: 1, rationale: "IV contrast dye can cause contrast-induced nephropathy (temporary renal impairment). If renal function declines while the patient is taking metformin, metformin accumulates because it is renally cleared, increasing the risk of the rare but potentially fatal complication of lactic acidosis." }
    ]
  },

  "rpn-dka": {
    title: "Diabetic Ketoacidosis (DKA)",
    cellular: {
      title: "Absolute or Relative Insulin Deficiency and Ketone Production",
      content: "Diabetic ketoacidosis (DKA) is a life-threatening metabolic emergency resulting from absolute or severe relative insulin deficiency, most commonly in type 1 diabetes but also occurring in type 2 diabetes during severe physiological stress. The pathophysiology represents unrestrained counter-regulatory hormone activity in the absence of insulin. Without insulin, cells cannot uptake glucose, despite profound hyperglycemia (often >14 mmol/L). The liver, receiving counter-regulatory hormone signals (glucagon, cortisol, catecholamines, growth hormone), increases gluconeogenesis and glycogenolysis, further elevating blood glucose. Simultaneously, the absence of insulin removes the brake on lipolysis: hormone-sensitive lipase in adipocytes (normally suppressed by insulin) becomes maximally active, releasing massive quantities of free fatty acids (FFAs) into the bloodstream. These FFAs are transported to the liver where they undergo beta-oxidation in the mitochondria. However, the rate of FFA oxidation overwhelms the TCA cycle, and the excess acetyl-CoA is diverted into ketogenesis, producing three ketone bodies: acetoacetate, beta-hydroxybutyrate (the predominant and most clinically significant), and acetone (volatile, responsible for the fruity breath odor). These ketone bodies are organic acids that dissociate hydrogen ions, causing high-anion-gap metabolic acidosis (pH <7.30, bicarbonate <18 mmol/L). The body attempts to compensate through Kussmaul respirations (deep, rapid breathing to blow off CO₂ and reduce acid load). Meanwhile, hyperglycemia causes osmotic diuresis: glucose exceeds the renal threshold (~10 mmol/L), spilling into the urine and dragging water and electrolytes with it. This produces massive fluid losses (often 5-9 liters), dehydration, hypotension, and electrolyte depletion — particularly potassium. Total body potassium is ALWAYS depleted in DKA (from osmotic diuresis, vomiting, and acidosis-driven cellular potassium shift), even though serum potassium may appear normal or elevated initially because acidosis causes potassium to shift extracellularly. When insulin is administered, potassium shifts back into cells, and serum potassium can plummet dangerously — making potassium monitoring critical during treatment."
    },
    riskFactors: [
      "Type 1 diabetes (most common), can occur in type 2 during severe stress",
      "Missed or inadequate insulin doses (most common precipitant)",
      "Infection or illness (increased counter-regulatory hormones)",
      "New-onset diabetes (DKA may be the presenting diagnosis)",
      "Myocardial infarction, stroke, or major trauma",
      "Medications: corticosteroids, SGLT2 inhibitors (euglycemic DKA)",
      "Substance abuse (cocaine, alcohol)",
      "Insulin pump malfunction"
    ],
    diagnostics: [
      "Blood glucose: typically >14 mmol/L (>250 mg/dL) — but can be lower in euglycemic DKA",
      "Arterial blood gas: pH <7.30, bicarbonate <18 mmol/L — metabolic acidosis",
      "Serum ketones (beta-hydroxybutyrate): ELEVATED",
      "Anion gap: ELEVATED (anion gap = Na - (Cl + HCO3), normal 8-12, elevated >12 in DKA)",
      "Serum potassium: may be high, normal, or low — ALWAYS depleted total body K+ regardless of serum level",
      "BUN/creatinine: elevated from dehydration",
      "Serum osmolality: elevated",
      "Urine ketones: positive"
    ],
    management: [
      "Aggressive IV fluid resuscitation: NS 1-1.5 L/hr initially, then adjust based on hemodynamic status",
      "Continuous IV regular insulin infusion (0.1-0.14 units/kg/hr) — do NOT start until K+ is confirmed ≥3.3 mEq/L",
      "Potassium replacement: if K+ <5.3 mEq/L, add 20-40 mEq KCl per litre of IV fluids",
      "When glucose falls to ~14 mmol/L, add D5 to IV fluids (to prevent hypoglycemia while continuing insulin to clear ketones)",
      "Monitor glucose hourly, electrolytes every 2-4 hours, ABG as ordered",
      "Identify and treat the precipitating cause (infection, missed insulin, MI)",
      "Transition to subcutaneous insulin when patient is eating and anion gap is closed"
    ],
    nursingActions: [
      "Monitor blood glucose HOURLY during insulin infusion — goal is glucose reduction of 3-4 mmol/L per hour",
      "Monitor potassium closely — check BEFORE starting insulin. If K+ <3.3, replace potassium FIRST",
      "Maintain continuous cardiac monitoring (dysrhythmia risk from potassium shifts)",
      "Monitor I&O strictly — expect large urine volumes initially from osmotic diuresis",
      "Assess neurological status frequently — cerebral edema is rare but devastating complication",
      "Monitor IV insulin infusion rate precisely — use infusion pump",
      "Document ABG results and assess for resolution: pH normalizing, anion gap closing, bicarbonate rising",
      "Report any sudden neurological changes (headache, confusion, vomiting) — may indicate cerebral edema"
    ],
    assessmentFindings: [
      "Kussmaul respirations (deep, rapid breathing — compensatory respiratory alkalosis attempt)",
      "Fruity/acetone breath odor (from volatile acetone ketone)",
      "Dehydration: dry mucous membranes, poor skin turgor, sunken eyes, tachycardia, hypotension",
      "Abdominal pain, nausea, vomiting (can mimic surgical abdomen)",
      "Altered LOC: confusion progressing to coma",
      "Polyuria and polydipsia (preceding presentation)"
    ],
    signs: {
      left: ["Kussmaul respirations", "Fruity breath", "Dehydration", "Abdominal pain/nausea"],
      right: ["Blood glucose >14 mmol/L", "pH <7.30", "Elevated ketones", "Altered LOC"]
    },
    medications: [
      { name: "Regular Insulin IV", type: "Rapid-Acting Insulin (Continuous Infusion)", action: "Promotes glucose uptake into cells, suppresses lipolysis and ketogenesis, and corrects metabolic acidosis", sideEffects: "Hypoglycemia, hypokalemia (potassium shifts intracellularly with insulin)", contra: "Do NOT start if K+ <3.3 mEq/L — hypokalemia must be corrected first", pearl: "Only REGULAR insulin is used IV. Do NOT bolus — start continuous infusion. When glucose reaches ~14 mmol/L, do NOT stop insulin — add D5 to IV and continue insulin to clear ketones." },
      { name: "Potassium Chloride IV", type: "Electrolyte Replacement", action: "Replaces total body potassium depleted by osmotic diuresis and prevents life-threatening hypokalemia during insulin therapy", sideEffects: "Hyperkalemia if given too fast, cardiac arrest, IV site burning/phlebitis", contra: "K+ >5.3 mEq/L (hold replacement), anuria", pearl: "ALWAYS check K+ before starting insulin. K+ <3.3 = replace FIRST, hold insulin. K+ 3.3-5.3 = add 20-40 mEq per litre of fluids. K+ >5.3 = hold K+ replacement. IV rate should NOT exceed 10-20 mEq/hr without cardiac monitoring." },
      { name: "Normal Saline (0.9% NaCl)", type: "Isotonic Crystalloid", action: "Restores intravascular volume and corrects dehydration (patients may be 5-9 L fluid depleted)", sideEffects: "Volume overload, hyperchloremic metabolic acidosis with large volumes", contra: "Caution in heart failure, renal failure", pearl: "First priority in DKA treatment — give 1-1.5 L in first hour, then adjust. Switch to 0.45% NS when corrected sodium is normal or high." }
    ],
    pearls: [
      "DKA treatment priority: Fluids FIRST, then potassium, then insulin — NEVER give insulin before checking potassium",
      "Serum potassium may look NORMAL or HIGH initially but total body potassium is ALWAYS depleted — it will PLUMMET when insulin drives K+ into cells",
      "Do NOT stop insulin when glucose normalizes — continue insulin infusion and add D5 to IV until ketones clear and anion gap closes",
      "Kussmaul respirations + fruity breath + dehydration + hyperglycemia = classic DKA presentation",
      "Cerebral edema is the most feared complication in pediatric DKA — occurs with too-rapid fluid or glucose correction",
      "Abdominal pain in DKA can mimic a surgical abdomen — it usually resolves with DKA treatment"
    ],
    quiz: [
      { question: "A client in DKA has a serum potassium of 3.0 mEq/L. The insulin infusion order is ready. What should the nurse do?", options: ["Start the insulin infusion as ordered", "Hold insulin and replace potassium FIRST — insulin with K+ <3.3 can cause fatal hypokalemia", "Give potassium and insulin simultaneously", "Administer a potassium-sparing diuretic"], correct: 1, rationale: "Insulin drives potassium into cells. Starting insulin when potassium is already critically low (<3.3 mEq/L) can cause life-threatening hypokalemia leading to cardiac arrest. The standard of care is to replace potassium to ≥3.3 mEq/L BEFORE initiating insulin infusion." },
      { question: "During DKA treatment, the blood glucose has decreased from 28 to 14 mmol/L. The nurse should expect which order?", options: ["Discontinue the insulin infusion", "Add dextrose 5% (D5) to the IV fluids and continue insulin infusion", "Switch to subcutaneous insulin", "Administer an IV bolus of 50% dextrose"], correct: 1, rationale: "When glucose reaches ~14 mmol/L, dextrose is added to IV fluids to prevent hypoglycemia while continuing the insulin infusion. Insulin must continue until ketones are cleared and the anion gap closes — stopping insulin early allows ketogenesis to resume." }
    ]
  },

  "rpn-hyperthyroidism": {
    title: "Hyperthyroidism (Graves Disease)",
    cellular: {
      title: "Thyroid Hormone Excess and Hypermetabolic State",
      content: "Hyperthyroidism is a clinical syndrome resulting from excessive production and release of thyroid hormones (T3 and T4), producing a hypermetabolic state affecting virtually every organ system. Graves disease is the most common cause (60-80% of cases) and is an autoimmune disorder in which thyroid-stimulating immunoglobulins (TSI) — autoantibodies of the IgG class — bind to and activate TSH receptors on thyroid follicular cells, stimulating unregulated thyroid hormone synthesis and release independent of normal HPT axis feedback. Unlike TSH, these autoantibodies are not subject to negative feedback inhibition by elevated T3/T4, so thyroid hormone production continues unchecked. At the cellular level, excess T3 enters target cells and binds to nuclear thyroid hormone receptors (TRs), forming TR-T3 complexes that bind to thyroid response elements (TREs) on DNA, dramatically upregulating transcription of genes involved in energy metabolism. This increases cellular production of Na⁺/K⁺ ATPase (consuming ATP and generating heat), mitochondrial uncoupling proteins (increasing basal metabolic rate), and beta-adrenergic receptors (increasing sensitivity to catecholamines, explaining the sympathomimetic symptoms). The cardiovascular system is profoundly affected: increased beta-receptor density on cardiomyocytes amplifies the cardiac response to catecholamines, producing tachycardia, increased contractility, and widened pulse pressure. Atrial fibrillation develops in 10-20% of hyperthyroid patients from shortened atrial refractory period. Thyroid storm (thyrotoxic crisis) is the most dangerous complication — a rare but life-threatening exaggeration of hyperthyroidism triggered by surgery, infection, trauma, or abrupt medication discontinuation, characterized by fever >40°C, severe tachycardia (>140 bpm), delirium, and multiorgan failure with mortality rates of 20-30% even with treatment."
    },
    riskFactors: [
      "Female sex (5-10:1 female-to-male ratio)",
      "Family history of autoimmune thyroid disease",
      "Other autoimmune conditions (type 1 diabetes, rheumatoid arthritis, pernicious anemia)",
      "Smoking (increases risk of Graves ophthalmopathy specifically)",
      "Excessive iodine intake (supplements, amiodarone, IV contrast)",
      "Recent pregnancy or postpartum period",
      "Toxic multinodular goiter or toxic adenoma (other causes)"
    ],
    diagnostics: [
      "TSH: SUPPRESSED (very low or undetectable — most sensitive screening test)",
      "Free T4: ELEVATED (confirms hyperthyroidism)",
      "Free T3: ELEVATED (may be elevated even with normal T4 in T3 thyrotoxicosis)",
      "TSI (thyroid-stimulating immunoglobulins): positive in Graves disease",
      "Radioactive iodine uptake (RAIU): diffusely elevated in Graves, focal in toxic nodule",
      "Monitor heart rate and rhythm (assess for atrial fibrillation)",
      "Monitor weight trends (progressive weight loss expected)"
    ],
    management: [
      "Antithyroid medications: methimazole (first-line) or propylthiouracil (PTU, preferred in first trimester pregnancy and thyroid storm)",
      "Beta-blockers for symptomatic relief of tachycardia, tremor, anxiety",
      "Radioactive iodine (RAI) ablation for definitive treatment",
      "Thyroidectomy for large goiters, ophthalmopathy, or medication intolerance",
      "Monitor for thyroid storm triggers: stress, surgery, infection, medication non-adherence",
      "Eye care for Graves ophthalmopathy: lubricating eye drops, sunglasses, elevated HOB"
    ],
    nursingActions: [
      "Monitor vital signs closely — especially heart rate and temperature",
      "Weigh patient daily and monitor nutritional status (increased caloric needs)",
      "Assess for signs of thyroid storm: fever >40°C, tachycardia >140, delirium, cardiovascular collapse",
      "Administer antithyroid medications as prescribed — monitor for agranulocytosis (sore throat, fever = REPORT IMMEDIATELY)",
      "Provide a cool, quiet environment — patients are heat intolerant and restless",
      "Offer high-calorie diet to compensate for hypermetabolic state",
      "Assess for eye involvement in Graves: proptosis, lid lag, diplopia, eye pain",
      "Educate on medication compliance — abrupt discontinuation can trigger thyroid storm"
    ],
    assessmentFindings: [
      "Tachycardia, palpitations, atrial fibrillation",
      "Weight loss despite increased appetite",
      "Heat intolerance, excessive sweating, warm moist skin",
      "Tremor (fine hand tremor), anxiety, irritability, emotional lability",
      "Exophthalmos (proptosis — bulging eyes, specific to Graves disease)",
      "Diffuse goiter (thyroid enlargement)",
      "Diarrhea, hyperactive bowel sounds",
      "Muscle weakness, fatigue despite restlessness"
    ],
    signs: {
      left: ["Tachycardia/palpitations", "Weight loss", "Heat intolerance", "Tremor/anxiety"],
      right: ["Exophthalmos (Graves)", "Goiter", "Diarrhea", "Warm, moist skin"]
    },
    medications: [
      { name: "Methimazole (Tapazole)", type: "Thionamide Antithyroid", action: "Inhibits thyroid peroxidase (TPO), blocking iodine organification and coupling reactions, thereby reducing T3/T4 synthesis", sideEffects: "Agranulocytosis (rare but life-threatening — report sore throat and fever IMMEDIATELY), rash, hepatotoxicity", contra: "First trimester pregnancy (teratogenic — use PTU instead)", pearl: "TEACH: Any sore throat, mouth sores, or fever requires IMMEDIATE CBC with differential — agranulocytosis can be fatal if not caught early." },
      { name: "Propranolol", type: "Non-selective Beta-Blocker", action: "Blocks beta-1 and beta-2 adrenergic receptors, reducing tachycardia, tremor, anxiety, and diaphoresis; also inhibits peripheral T4-to-T3 conversion", sideEffects: "Bradycardia, hypotension, bronchospasm, fatigue", contra: "Asthma, severe bradycardia, decompensated HF, AV block", pearl: "Provides rapid symptomatic relief while antithyroid drugs take 4-8 weeks to reduce hormone levels. Also blocks peripheral T4→T3 conversion — useful in thyroid storm." },
      { name: "Propylthiouracil (PTU)", type: "Thionamide Antithyroid", action: "Inhibits TPO and also blocks peripheral T4-to-T3 conversion (unique mechanism not shared by methimazole)", sideEffects: "Hepatotoxicity (can be fulminant), agranulocytosis, vasculitis", contra: "Liver disease", pearl: "PREFERRED in thyroid storm (blocks peripheral conversion) and in first trimester pregnancy. Higher hepatotoxicity risk than methimazole — reserved for specific indications." }
    ],
    pearls: [
      "Hyperthyroidism = everything is FAST and HOT: tachycardia, weight loss, heat intolerance, diarrhea, anxiety",
      "Hypothyroidism = everything is SLOW and COLD: bradycardia, weight gain, cold intolerance, constipation, fatigue",
      "THYROID STORM is a medical emergency: fever >40°C, HR >140, delirium — treat with PTU + propranolol + hydrocortisone + cooling measures",
      "Agranulocytosis from methimazole/PTU: TEACH patients that sore throat + fever = EMERGENCY — needs immediate CBC",
      "Exophthalmos (bulging eyes) is specific to Graves disease and may not improve even after thyroid levels normalize",
      "After RAI treatment, most patients become HYPOthyroid and require lifelong levothyroxine — educate about this expected outcome"
    ],
    quiz: [
      { question: "A client on methimazole calls reporting a severe sore throat and fever of 38.8°C. What should the nurse instruct?", options: ["Take acetaminophen and rest", "This is an expected side effect — continue the medication", "Seek IMMEDIATE medical evaluation including CBC with differential — suspect agranulocytosis", "Gargle with warm salt water and call back if not improved in 48 hours"], correct: 2, rationale: "Sore throat and fever in a patient taking methimazole requires immediate evaluation for agranulocytosis (severe neutropenia), a rare but potentially fatal side effect. A CBC with differential is needed urgently. If agranulocytosis is confirmed, the drug must be stopped immediately." },
      { question: "Which finding in a hyperthyroid client suggests progression to thyroid storm?", options: ["Heart rate of 88 bpm", "Temperature of 41°C with tachycardia of 148 bpm and altered mental status", "Weight loss of 2 kg over 2 weeks", "Fine hand tremor"], correct: 1, rationale: "Thyroid storm is characterized by extreme manifestations: high fever (>40°C), severe tachycardia (>140 bpm), delirium or altered LOC, nausea/vomiting, and potential cardiovascular collapse. Moderate symptoms (tremor, mild weight loss, mild tachycardia) represent uncomplicated hyperthyroidism, not storm." }
    ]
  },

  "rpn-cushing-syndrome": {
    title: "Cushing Syndrome",
    cellular: {
      title: "Chronic Cortisol Excess and Systemic Effects",
      content: "Cushing syndrome is a clinical disorder resulting from chronic exposure to excess glucocorticoids (cortisol), either from endogenous overproduction or exogenous administration. The most common cause overall is iatrogenic — prolonged use of exogenous corticosteroids (prednisone, dexamethasone) for inflammatory and autoimmune conditions. Endogenous Cushing syndrome is most commonly caused by a pituitary adenoma secreting excess ACTH (Cushing disease, ~70% of endogenous cases), followed by ectopic ACTH secretion (small cell lung cancer, carcinoid tumors), and adrenal tumors (adenomas or carcinomas producing cortisol autonomously). Cortisol is a steroid hormone synthesized from cholesterol in the zona fasciculata of the adrenal cortex. It acts by diffusing through cell membranes and binding to intracellular glucocorticoid receptors (GRs) in the cytoplasm. The cortisol-GR complex translocates to the nucleus, binds to glucocorticoid response elements (GREs) on DNA, and modulates transcription of hundreds of target genes. The systemic effects of chronic cortisol excess are profound and predictable from cortisol's normal physiological actions amplified to pathological levels. Metabolic effects: cortisol promotes gluconeogenesis and insulin resistance, causing hyperglycemia (secondary diabetes in 20-50% of patients). It stimulates protein catabolism in skeletal muscle (causing proximal muscle weakness and muscle wasting) and redistribution of fat from extremities to central locations (truncal obesity, moon facies, dorsocervical fat pad or 'buffalo hump'). Connective tissue effects: cortisol inhibits collagen synthesis and fibroblast proliferation, causing thin fragile skin, easy bruising, poor wound healing, and wide purple striae (>1 cm, unlike normal stretch marks). Bone effects: cortisol inhibits osteoblast function, promotes osteoclast activity, decreases intestinal calcium absorption, and increases renal calcium excretion — causing osteoporosis and pathological fractures. Immune effects: cortisol suppresses inflammatory and immune responses by inhibiting NF-κB (blocking cytokine production), reducing lymphocyte proliferation, and impairing neutrophil migration — increasing susceptibility to infections. Cardiovascular effects: cortisol potentiates catecholamine action and has intrinsic mineralocorticoid activity at high levels, causing hypertension, sodium and water retention, and hypokalemia."
    },
    riskFactors: [
      "Chronic exogenous corticosteroid use (MOST COMMON cause overall — prednisone, dexamethasone, inhaled steroids at high doses)",
      "Pituitary adenoma (Cushing disease — most common endogenous cause)",
      "Ectopic ACTH-producing tumors (small cell lung cancer, carcinoid)",
      "Adrenal tumors (adenoma or carcinoma)",
      "Female sex (endogenous Cushing disease more common in women)"
    ],
    diagnostics: [
      "24-hour urine free cortisol: ELEVATED (>3x upper normal is highly suggestive)",
      "Late-night salivary cortisol: ELEVATED (loss of normal diurnal variation)",
      "Dexamethasone suppression test: cortisol NOT suppressed after overnight 1 mg dexamethasone (normal response is suppression)",
      "Plasma ACTH level: high in pituitary/ectopic causes, suppressed in adrenal tumors",
      "Monitor blood glucose (hyperglycemia common)",
      "Bone density scan (osteoporosis screening)",
      "MRI of pituitary if Cushing disease suspected, CT of adrenals/chest if adrenal tumor or ectopic ACTH suspected"
    ],
    management: [
      "If iatrogenic: gradual tapering of exogenous steroids (NEVER stop abruptly — risk of adrenal crisis)",
      "Surgical resection of pituitary adenoma (transsphenoidal surgery) or adrenal tumor",
      "Radiation therapy for residual pituitary tumors",
      "Adrenal enzyme inhibitors (ketoconazole) if surgery not possible",
      "Blood glucose management for secondary diabetes",
      "Osteoporosis prevention: calcium, vitamin D, bisphosphonates as indicated",
      "Infection prevention measures (immunosuppressed state)"
    ],
    nursingActions: [
      "Monitor blood glucose closely — cortisol excess causes insulin resistance and hyperglycemia",
      "Assess skin integrity: thin skin bruises easily, wounds heal poorly — handle gently, minimize tape use",
      "Monitor blood pressure (hypertension is common from sodium/water retention)",
      "Assess for signs of infection — cortisol suppresses immune response, masking typical infection signs",
      "Implement fall prevention — osteoporosis + proximal muscle weakness = high fracture risk",
      "Monitor electrolytes — hypokalemia and metabolic alkalosis from cortisol's mineralocorticoid effects",
      "Educate on steroid tapering importance — NEVER stop abruptly if on chronic steroids",
      "Assess emotional status — mood changes (depression, psychosis, euphoria) are common with cortisol excess"
    ],
    assessmentFindings: [
      "Central obesity with thin extremities (truncal fat redistribution)",
      "Moon facies (round, full face) and buffalo hump (dorsocervical fat pad)",
      "Wide purple striae (>1 cm) on abdomen, thighs, breasts",
      "Thin, fragile skin with easy bruising",
      "Proximal muscle weakness (difficulty rising from chair, climbing stairs)",
      "Hypertension, hyperglycemia, hypokalemia",
      "Hirsutism and acne in women (from adrenal androgen excess)",
      "Emotional lability, depression, psychosis"
    ],
    signs: {
      left: ["Moon facies", "Buffalo hump", "Truncal obesity", "Purple striae"],
      right: ["Thin fragile skin", "Easy bruising", "Muscle weakness", "Hypertension/hyperglycemia"]
    },
    medications: [
      { name: "Ketoconazole", type: "Adrenal Enzyme Inhibitor", action: "Inhibits multiple cytochrome P450 enzymes in the adrenal cortex, blocking cortisol synthesis", sideEffects: "Hepatotoxicity (monitor LFTs), nausea, adrenal insufficiency if over-treated, gynecomastia", contra: "Liver disease, concomitant use with certain medications metabolized by CYP3A4", pearl: "Used as bridging therapy or when surgery is not possible. Monitor liver function tests regularly. Adrenal insufficiency can develop — teach signs of cortisol deficiency." },
      { name: "Hydrocortisone (post-surgical replacement)", type: "Glucocorticoid Replacement", action: "Replaces cortisol after surgical removal of cortisol-producing tumor — the contralateral adrenal is suppressed and cannot produce cortisol immediately", sideEffects: "Cushingoid features if over-replaced", contra: "Active untreated infections", pearl: "After tumor removal, the remaining adrenal gland may take 6-18 months to recover normal cortisol production. Patients need stress dosing during illness until recovery." }
    ],
    pearls: [
      "Cushing = cortisol EXCESS (opposite of Addison's which is cortisol DEFICIENCY)",
      "MOST COMMON cause overall is iatrogenic (exogenous steroid use) — always ask about steroid medications",
      "NEVER stop chronic steroids abruptly — the suppressed HPA axis cannot respond, causing life-threatening adrenal crisis",
      "Purple striae in Cushing are WIDE (>1 cm) and violaceous — normal stretch marks are narrow, pink/white",
      "Cushing syndrome increases infection risk AND masks infection signs — fever and inflammation may be blunted",
      "Think 'opposite of Addison's': Cushing = hypertension, hyperglycemia, hypokalemia, weight gain vs Addison's = hypotension, hypoglycemia, hyperkalemia, weight loss"
    ],
    quiz: [
      { question: "Which finding best differentiates Cushing syndrome from simple obesity?", options: ["Elevated BMI", "Wide purple striae, proximal muscle weakness, and thin fragile skin", "Hypertension", "Elevated blood glucose"], correct: 1, rationale: "While obesity, hypertension, and hyperglycemia can occur with simple obesity, the combination of wide purple striae (from collagen breakdown), proximal muscle weakness (from protein catabolism), and thin fragile skin with easy bruising is specific to cortisol excess and distinguishes Cushing syndrome from metabolic syndrome/obesity." },
      { question: "A client has been taking prednisone 40 mg daily for 8 months and wants to stop the medication because they feel better. What should the nurse teach?", options: ["They can stop immediately since they feel well", "The prednisone must be tapered gradually — abrupt discontinuation can cause life-threatening adrenal crisis", "They should switch to an over-the-counter anti-inflammatory", "They should double the dose for one week then stop"], correct: 1, rationale: "After 8 months of exogenous steroid use, the HPA axis is suppressed — the adrenal glands have atrophied from lack of ACTH stimulation. Abruptly stopping steroids removes cortisol replacement without a functioning adrenal response, causing adrenal crisis (severe hypotension, shock, death). Gradual tapering allows the HPA axis to recover." }
    ]
  }
};
