import type { LessonContent } from "./types";

export const rnContentBatch007Lessons: Record<string, LessonContent> = {
  "all-aml-leukemia-rn": {
    title: "ALL and AML: Acute Leukemia RN Management",
    cellular: {
      title: "Malignant Hematopoietic Stem Cell Proliferation",
      content: "Acute leukemias are clonal malignancies of hematopoietic progenitor cells characterized by uncontrolled proliferation of immature blast cells (>20% blasts in bone marrow) that crowd out normal hematopoiesis. Acute lymphoblastic leukemia (ALL) arises from lymphoid precursors (B-cell or T-cell lineage) and is the most common childhood malignancy (peak age 2-5 years). ALL blasts accumulate due to arrested differentiation and impaired apoptosis, often driven by chromosomal translocations (e.g., Philadelphia chromosome t(9;22) in adult ALL, t(12;21) TEL-AML1 in pediatric ALL). Acute myeloid leukemia (AML) originates from myeloid precursors and is more common in adults (median age 68). AML is classified by WHO criteria based on genetic abnormalities, including t(8;21), t(15;17) in acute promyelocytic leukemia (APL), and FLT3 mutations. The massive proliferation of nonfunctional blasts causes bone marrow failure: anemia (decreased RBCs), thrombocytopenia (decreased platelets), and neutropenia (decreased functional WBCs). Leukemic cells can infiltrate the CNS, liver, spleen, lymph nodes, and gingiva. Tumor lysis syndrome (TLS) occurs when rapid cell death during treatment releases intracellular contents (potassium, phosphorus, uric acid, nucleic acids), causing hyperkalemia, hyperphosphatemia, hypocalcemia, hyperuricemia, and acute kidney injury."
    },
    riskFactors: [
      "ALL: age 2-5 years (peak incidence), Down syndrome (20-fold increased risk), prior radiation exposure, genetic syndromes (Bloom syndrome, ataxia-telangiectasia)",
      "AML: age >65, prior chemotherapy or radiation (secondary AML), myelodysplastic syndrome, benzene exposure, Down syndrome (AMKL subtype)",
      "Both: ionizing radiation exposure, smoking (AML), certain genetic disorders"
    ],
    diagnostics: [
      "CBC with peripheral smear: pancytopenia with circulating blasts; WBC may be very high (hyperleukocytosis >100,000) or low",
      "Bone marrow biopsy: >20% blasts confirms acute leukemia; morphology, immunophenotyping, and cytogenetics classify subtype",
      "Flow cytometry: identifies cell lineage markers (CD19, CD20 for B-ALL; CD3 for T-ALL; CD13, CD33, CD117 for AML)",
      "Cytogenetics and molecular testing: Philadelphia chromosome, FLT3-ITD, NPM1, t(15;17) for APL—guide prognosis and targeted therapy",
      "Lumbar puncture: evaluate for CNS involvement (especially in ALL)",
      "Chemistry panel: LDH, uric acid, phosphorus, potassium, calcium (baseline for tumor lysis risk), coagulation studies (DIC common in APL)"
    ],
    management: [
      "Induction chemotherapy: goal is complete remission (<5% blasts in marrow). ALL: multi-agent regimen (vincristine, prednisone, asparaginase, anthracycline). AML: 7+3 protocol (cytarabine x 7 days + daunorubicin x 3 days)",
      "Consolidation/maintenance: ALL requires 2-3 years of maintenance therapy; AML consolidation with high-dose cytarabine or stem cell transplant for high-risk",
      "CNS prophylaxis: intrathecal methotrexate (mandatory in ALL; selective in AML)",
      "APL (APML): all-trans retinoic acid (ATRA) + arsenic trioxide (ATO) revolutionized treatment—cure rates >90%",
      "Stem cell transplant (SCT): allogeneic for high-risk or relapsed disease",
      "Supportive care: transfusions, growth factors (G-CSF), infection prevention, tumor lysis syndrome prophylaxis"
    ],
    nursingActions: [
      "Monitor for tumor lysis syndrome: assess electrolytes (K+, PO4, Ca2+, uric acid) every 6-8 hours during induction; administer allopurinol or rasburicase prophylactically; aggressive IV hydration 200-250 mL/hr",
      "Implement neutropenic precautions when ANC <500: private room, hand hygiene, no fresh flowers/fruits, no rectal temperatures, low-microbial diet",
      "Monitor for signs of infection: fever is often the ONLY sign in neutropenic patients (no pus formation without neutrophils); report temperature >100.4°F immediately",
      "Administer blood products as ordered: packed RBCs for Hgb <7-8, platelets for count <10,000 or active bleeding; use leukocyte-reduced and irradiated products to prevent transfusion reactions and GvHD",
      "Assess for bleeding: petechiae, ecchymoses, gum bleeding, epistaxis, melena, hematuria; hold pressure for 5+ minutes at puncture sites",
      "Prevent infection at central line sites: sterile dressing changes, assess for erythema/drainage/tenderness",
      "Assess for leukostasis in hyperleukocytosis (WBC >100,000): headache, dyspnea, visual changes, confusion—medical emergency requiring leukapheresis",
      "Provide emotional support and education about treatment timeline, side effects, and long-term follow-up"
    ],
    assessmentFindings: [
      "Anemia symptoms: fatigue, pallor, dyspnea on exertion, tachycardia",
      "Thrombocytopenia: petechiae, purpura, gingival bleeding, easy bruising, menorrhagia",
      "Neutropenia: fever, infections (oral candidiasis, cellulitis, pneumonia, perianal abscess), sepsis",
      "Bone pain from marrow expansion (common presenting symptom in children)",
      "Lymphadenopathy, hepatosplenomegaly (more common in ALL)",
      "Gingival hypertrophy and skin infiltration (monocytic AML subtypes)",
      "DIC with bleeding and thrombosis (especially in APL)"
    ],
    signs: {
      left: [
        "Fatigue, pallor (anemia)",
        "Petechiae, bruising, bleeding (thrombocytopenia)",
        "Fever, recurrent infections (neutropenia)",
        "Bone pain (marrow expansion)"
      ],
      right: [
        "Lymphadenopathy and hepatosplenomegaly",
        "Gingival hypertrophy (monocytic AML)",
        "DIC with hemorrhage (APL)",
        "CNS involvement: headache, cranial nerve palsies"
      ]
    },
    medications: [
      { name: "Allopurinol", type: "Xanthine Oxidase Inhibitor", action: "Inhibits xanthine oxidase, preventing conversion of hypoxanthine and xanthine to uric acid. Used prophylactically before chemotherapy induction to prevent tumor lysis syndrome-associated hyperuricemia and uric acid nephropathy", sideEffects: "Rash (discontinue if severe—can progress to Stevens-Johnson syndrome), GI upset, elevated LFTs", contra: "Prior severe hypersensitivity reaction, concurrent azathioprine or mercaptopurine (allopurinol inhibits their metabolism, requiring 75% dose reduction)", pearl: "Start 1-2 days before induction chemotherapy. For established TLS with renal impairment, rasburicase (recombinant urate oxidase) is preferred—it converts uric acid to allantoin which is more soluble and rapidly excreted. Rasburicase is contraindicated in G6PD deficiency (causes hemolytic anemia)." },
      { name: "Filgrastim (Neupogen/G-CSF)", type: "Granulocyte Colony-Stimulating Factor", action: "Stimulates neutrophil precursor proliferation, differentiation, and activation in the bone marrow. Reduces the duration and severity of chemotherapy-induced neutropenia, decreasing infection risk and enabling dose-dense chemotherapy schedules", sideEffects: "Bone pain (most common—from marrow expansion; treat with acetaminophen or NSAIDs), splenic enlargement/rupture (rare), leukocytosis, allergic reactions", contra: "Known hypersensitivity to E. coli-derived proteins; do not administer within 24 hours before or after chemotherapy", pearl: "Administer SC daily starting 24-72 hours after chemotherapy completion; continue until ANC recovery >1000-1500/mm3 after nadir. Bone pain occurs in 20-30% of patients and can be severe—reassure that it indicates the medication is working. Pegfilgrastim (Neulasta) is a long-acting form given once per chemotherapy cycle." }
    ],
    pearls: [
      "Fever in a neutropenic patient (ANC <500) is a medical emergency—obtain blood cultures and start empiric broad-spectrum antibiotics (piperacillin-tazobactam or cefepime) within 60 minutes",
      "Tumor lysis syndrome prevention: aggressive hydration, allopurinol or rasburicase, monitor electrolytes q6-8h, avoid potassium and phosphorus in IV fluids",
      "APL (t(15;17)) is a medical emergency due to DIC risk—ATRA should be started immediately upon suspicion without waiting for confirmatory testing",
      "Children with ALL have an 85-90% cure rate with modern multi-agent chemotherapy—one of the great successes of oncology",
      "No rectal temperatures, suppositories, or enemas in neutropenic patients—risk of perianal abscess and bacteremia"
    ],
    quiz: [
      { question: "A patient undergoing induction chemotherapy for AML develops potassium 6.8 mEq/L, phosphorus 8.2 mg/dL, calcium 6.4 mg/dL, and uric acid 14 mg/dL. What complication has occurred?", options: ["Septic shock", "Tumor lysis syndrome", "DIC", "Adrenal crisis"], correct: 1, rationale: "This constellation of hyperkalemia, hyperphosphatemia, hypocalcemia, and hyperuricemia is classic for tumor lysis syndrome—massive release of intracellular contents during rapid tumor cell death. Treatment: aggressive hydration, rasburicase for uric acid, sodium polystyrene for hyperkalemia, and monitoring for cardiac arrhythmias." },
      { question: "A neutropenic patient (ANC 200) develops a temperature of 100.8°F. What is the priority nursing action?", options: ["Administer acetaminophen and recheck in 1 hour", "Obtain blood cultures and notify provider for stat broad-spectrum antibiotics", "Apply cooling blankets and monitor", "Administer the scheduled dose of filgrastim"], correct: 1, rationale: "Febrile neutropenia is a medical emergency. Fever may be the ONLY sign of infection because neutropenic patients cannot mount a normal inflammatory response (no pus, no erythema). Blood cultures must be obtained and empiric antibiotics started within 60 minutes to prevent sepsis and death." },
      { question: "Which precaution is essential for a patient with an ANC of 300?", options: ["Contact precautions with gown and gloves", "No fresh flowers or raw fruits/vegetables in the room", "Droplet precautions with surgical mask", "No visitors allowed at any time"], correct: 1, rationale: "Neutropenic precautions include: private room, strict hand hygiene, no fresh flowers/plants (harbor Aspergillus), low-microbial diet (no raw fruits, vegetables, undercooked meats), no rectal temperatures. Selected visitors are allowed with hand hygiene and health screening." },
      { question: "A child with newly diagnosed ALL complains of severe bone pain, especially in the legs. The nurse explains this is caused by:", options: ["Side effects of chemotherapy", "Leukemic cell expansion in the bone marrow causing pressure on the periosteum", "Calcium deficiency from poor nutrition", "Normal growing pains in children"], correct: 1, rationale: "Bone pain is a common presenting symptom of acute leukemia in children, caused by rapid proliferation of leukemic blasts in the bone marrow cavity, expanding the marrow space and stretching the richly innervated periosteum." }
    ]
  },

  "neutropenia-neutropenic-precautions-rn": {
    title: "Neutropenia and Neutropenic Precautions: RN Management",
    cellular: {
      title: "Neutrophil Function and Consequences of Deficiency",
      content: "Neutrophils are the most abundant white blood cells (60-70% of circulating WBCs) and serve as the primary defense against bacterial and fungal infections. They are produced in the bone marrow from myeloid stem cells through granulopoiesis, taking approximately 14 days from stem cell to mature neutrophil release. The absolute neutrophil count (ANC) is calculated as: WBC × (% neutrophils + % bands). Neutropenia is defined as ANC <1500/mm³; severe neutropenia as ANC <500/mm³; profound neutropenia as ANC <100/mm³. The risk of life-threatening infection increases exponentially as ANC decreases below 500 and correlates with the duration of neutropenia. Without adequate neutrophils, bacterial infections spread unchecked—classic inflammatory signs (erythema, purulence, swelling) may be absent because these responses depend on neutrophil infiltration. Fever may be the only sign of serious infection. Causes of neutropenia include: chemotherapy (most common in oncology nursing), bone marrow failure syndromes, drug-induced (carbamazepine, methimazole, clozapine), autoimmune neutropenia, and severe sepsis with marrow exhaustion. Febrile neutropenia (temperature >100.4°F/38°C or >100.0°F/38.0°C sustained for 1 hour with ANC <500) is a medical emergency requiring empiric broad-spectrum antibiotics within 60 minutes."
    },
    riskFactors: [
      "Myelosuppressive chemotherapy (most common cause; nadir typically 7-14 days post-treatment)",
      "Radiation therapy to large areas of bone marrow (pelvis, spine, sternum)",
      "Bone marrow transplantation (engraftment period with profound neutropenia)",
      "Hematologic malignancies crowding out normal hematopoiesis",
      "Drug-induced: clozapine, methimazole, carbamazepine, sulfasalazine, trimethoprim-sulfamethoxazole",
      "Aplastic anemia, myelodysplastic syndrome",
      "Severe infection/sepsis with bone marrow suppression or peripheral destruction"
    ],
    diagnostics: [
      "ANC calculation: WBC × (% segs + % bands) / 100; ANC <500 = severe, <100 = profound",
      "CBC with differential: monitor WBC trend, absolute neutrophil count, hemoglobin, platelets",
      "Blood cultures (peripheral and central line if present) immediately with fever onset—before antibiotics if possible",
      "Urinalysis and urine culture (pyuria may be absent in neutropenia)",
      "Chest X-ray for respiratory symptoms (infiltrates may be absent or minimal without neutrophils)",
      "Procalcitonin and CRP: inflammatory markers that may help identify bacterial infection",
      "Fungal markers (beta-D-glucan, galactomannan) if neutropenia persists >7 days with fever"
    ],
    management: [
      "Febrile neutropenia: empiric broad-spectrum antibiotics within 60 minutes—cefepime, piperacillin-tazobactam, or meropenem",
      "Add vancomycin if: suspected MRSA, catheter-related infection, hemodynamic instability, or mucositis",
      "Antifungal therapy: empiric addition if fever persists >4-7 days on antibiotics (caspofungin, voriconazole, or liposomal amphotericin B)",
      "G-CSF (filgrastim/pegfilgrastim): may be used therapeutically or prophylactically to shorten neutropenia duration",
      "Continue antibiotics until ANC >500 and afebrile for 48 hours minimum",
      "Antimicrobial prophylaxis in high-risk patients: levofloxacin for bacterial prophylaxis, fluconazole or posaconazole for fungal prophylaxis"
    ],
    nursingActions: [
      "Calculate ANC with each CBC result; notify provider when ANC <500",
      "Implement neutropenic precautions: private room, meticulous hand hygiene (single most important intervention), mask for patient when leaving room",
      "No fresh flowers, plants, standing water, or raw/undercooked foods (potential sources of bacteria and fungi)",
      "No rectal temperatures, suppositories, or enemas (risk of mucosal breakdown and perianal abscess)",
      "Assess oral mucosa every shift for mucositis; provide gentle oral care with soft toothbrush and non-alcohol mouthwash",
      "Inspect all skin surfaces and catheter sites for signs of infection; in neutropenia, absence of pus does NOT mean absence of infection",
      "Take temperature every 4 hours; instruct patient to report any subjective fever, chills, or malaise immediately",
      "Educate patient and family: hand hygiene, avoid crowds and sick contacts, importance of reporting fever promptly"
    ],
    assessmentFindings: [
      "Fever may be the ONLY sign of infection (no pus, minimal erythema, absent infiltrates on CXR without neutrophils)",
      "Oral mucositis: painful erythema and ulceration of oral mucosa from chemotherapy-induced epithelial damage",
      "Perianal tenderness or pain (perianal abscess—common site of infection in neutropenic patients)",
      "Catheter site erythema, tenderness, or drainage (central line-associated bloodstream infection)",
      "Tachycardia, hypotension, altered mental status (sepsis/septic shock)",
      "Fatigue and malaise as early indicators of developing infection"
    ],
    signs: {
      left: [
        "Temperature >100.4°F (38°C) in neutropenic patient",
        "Oral mucositis with painful ulcerations",
        "Perianal tenderness without visible abscess",
        "Catheter site changes (erythema, tenderness)"
      ],
      right: [
        "Sepsis: tachycardia, hypotension, altered mental status",
        "Absence of classic infection signs (no pus, no infiltrates)",
        "Rigors and chills indicating bacteremia",
        "Fungal infection: persistent fever despite antibiotics"
      ]
    },
    medications: [
      { name: "Cefepime", type: "Fourth-generation Cephalosporin", action: "Broad-spectrum bactericidal antibiotic covering Gram-positive organisms (streptococci, MSSA), Gram-negative organisms including Pseudomonas aeruginosa, and anaerobes. First-line monotherapy for febrile neutropenia providing empiric coverage while awaiting culture results", sideEffects: "Neurotoxicity (seizures, encephalopathy—especially with renal impairment), allergic reactions, C. difficile-associated diarrhea, cytopenias", contra: "History of severe penicillin/cephalosporin allergy (anaphylaxis); dose adjust for renal impairment", pearl: "Standard febrile neutropenia dose: 2g IV q8h. Must be started within 60 minutes of fever onset in neutropenic patients. Monitor for cefepime-induced neurotoxicity (confusion, myoclonus, seizures), especially in elderly and renal impairment—reduce dose for CrCl <60 mL/min." },
      { name: "Posaconazole", type: "Triazole Antifungal", action: "Inhibits lanosterol 14-alpha-demethylase (CYP51), blocking ergosterol synthesis essential for fungal cell membrane integrity. Broad-spectrum coverage against Candida, Aspergillus, and Mucorales species. Used for primary prophylaxis in high-risk neutropenic patients", sideEffects: "QT prolongation, hepatotoxicity, nausea, headache, drug interactions (CYP3A4 inhibitor)", contra: "Concurrent use with sirolimus, ergot alkaloids, or other strong CYP3A4 substrates; severe hepatic impairment", pearl: "Preferred fungal prophylaxis in AML induction and allogeneic SCT (superior to fluconazole for mold coverage). Delayed-release tablet preferred over oral suspension (better bioavailability, no food requirement). Monitor LFTs weekly and ECG for QT prolongation." }
    ],
    pearls: [
      "Hand hygiene is the single most important intervention to prevent infection in neutropenic patients—enforce with all healthcare workers and visitors",
      "Fever may be the ONLY sign of life-threatening infection—classic inflammatory signs require neutrophils that are absent",
      "60-minute rule: antibiotics must be administered within 60 minutes of fever onset in neutropenic patients; every hour of delay increases mortality",
      "Calculate ANC yourself from the CBC—don't wait for it to be reported: WBC × (% segs + % bands) / 100",
      "No rectal anything (temperatures, suppositories, enemas) in neutropenic patients—rectal manipulation can cause bacteremia through damaged mucosa"
    ],
    quiz: [
      { question: "A patient has WBC 1,200/mm³ with 40% neutrophils and 5% bands. What is the ANC and is it neutropenic?", options: ["ANC 540; yes, severe neutropenia", "ANC 480; yes, severe neutropenia", "ANC 1200; no, normal", "ANC 680; yes, mild neutropenia"], correct: 0, rationale: "ANC = WBC × (% neutrophils + % bands) / 100 = 1200 × (40 + 5) / 100 = 1200 × 0.45 = 540. ANC 500-1000 is moderate neutropenia; however, 540 is very close to 500 and requires neutropenic precautions. ANC <500 is severe." },
      { question: "A neutropenic patient (ANC 100) has a temperature of 101°F. The nurse should FIRST:", options: ["Administer acetaminophen and recheck in 30 minutes", "Obtain blood cultures from peripheral and central line, then notify provider for stat antibiotics", "Apply cooling measures and encourage oral fluids", "Administer the next scheduled dose of chemotherapy"], correct: 1, rationale: "Febrile neutropenia is a medical emergency. Blood cultures (peripheral and central line) should be obtained immediately, and empiric broad-spectrum antibiotics must be started within 60 minutes. Antipyretics may mask ongoing infection and should not delay antibiotic administration." },
      { question: "Which food is safe for a patient on neutropenic precautions?", options: ["Raw sushi", "Fresh garden salad", "Well-cooked chicken breast", "Soft-ripened cheese (Brie)"], correct: 2, rationale: "The neutropenic diet restricts raw/undercooked foods that may harbor bacteria: no raw meats, raw vegetables/fruits (unless thick-skinned and peeled), unpasteurized dairy, soft-ripened cheeses, or well water. Well-cooked foods are safe." }
    ]
  },

  "sickle-cell-disease-comprehensive-rn": {
    title: "Sickle Cell Disease: Comprehensive RN Management",
    cellular: {
      title: "Hemoglobin S Polymerization and Vaso-occlusive Pathophysiology",
      content: "Sickle cell disease (SCD) is an autosomal recessive hemoglobinopathy caused by a single nucleotide substitution (GAG→GTG) in the beta-globin gene on chromosome 11, resulting in hemoglobin S (HbS) where valine replaces glutamic acid at position 6. Under conditions of hypoxia, acidosis, dehydration, or temperature extremes, HbS molecules polymerize into rigid rod-like structures that distort the erythrocyte into a sickle (crescent) shape. Sickled cells are rigid and adhesive, causing vaso-occlusion in the microcirculation. Vaso-occlusion triggers an ischemia-reperfusion cascade with endothelial activation, free hemoglobin-mediated nitric oxide scavenging (causing vasoconstriction), inflammatory cytokine release, and platelet activation. This creates a vicious cycle of ongoing sickling and tissue ischemia. Chronic hemolysis (sickled cells have a lifespan of 10-20 days vs normal 120 days) causes anemia, elevated bilirubin (jaundice and cholelithiasis), elevated LDH, and reticulocytosis. The spleen undergoes autoinfarction from repeated vaso-occlusion by age 5 (functional asplenia), making patients highly susceptible to encapsulated organisms (S. pneumoniae, H. influenzae, N. meningitidis)."
    },
    riskFactors: [
      "African descent (1 in 365 African American births), Mediterranean, Middle Eastern, South Asian, Latin American heritage",
      "Both parents must carry the sickle cell trait (HbAS) for a 25% chance of SCD (HbSS) per pregnancy",
      "Crisis precipitants: hypoxia, dehydration, infection, cold exposure, stress, high altitude, strenuous exercise, acidosis"
    ],
    diagnostics: [
      "Hemoglobin electrophoresis: gold standard for diagnosis; HbSS (sickle cell disease), HbSC (mild variant), HbS-beta thalassemia",
      "Newborn screening: mandated in all 50 US states; hemoglobin electrophoresis on heel-stick blood sample",
      "CBC: chronic hemolytic anemia (Hgb 6-9 g/dL typical baseline), elevated reticulocyte count (compensatory production), WBC often elevated at baseline",
      "Peripheral smear: sickled cells, target cells, Howell-Jolly bodies (indicating functional asplenia)",
      "Hemolysis labs: elevated LDH, elevated indirect bilirubin, decreased haptoglobin",
      "Transcranial Doppler ultrasound (TCD): annual screening starting age 2 for stroke risk (velocities >200 cm/s indicate high risk)"
    ],
    management: [
      "Vaso-occlusive crisis (pain crisis): aggressive hydration (IV NS 1.5x maintenance), multimodal analgesia (IV opioids within 30 minutes of presentation + NSAIDs + adjuvants), supplemental oxygen if SpO2 <95%",
      "Hydroxyurea: disease-modifying therapy that increases fetal hemoglobin (HbF) which inhibits HbS polymerization; reduces crisis frequency by 50%, reduces acute chest syndrome, reduces need for transfusions",
      "Chronic transfusion therapy: for stroke prevention (target HbS <30%), severe recurrent ACS, and symptomatic anemia; exchange transfusion preferred to reduce iron overload",
      "Hematopoietic stem cell transplant: only curative therapy; best outcomes in children with HLA-matched sibling donor",
      "Acute chest syndrome treatment: supplemental oxygen, antibiotics (ceftriaxone + azithromycin), simple or exchange transfusion, incentive spirometry",
      "Prevention: penicillin prophylaxis from birth to age 5, pneumococcal vaccination, annual influenza vaccine, folic acid supplementation"
    ],
    nursingActions: [
      "Pain management is the priority during vaso-occlusive crisis: administer analgesics within 30 minutes; do not undertreat—SCD pain is severe and often undertreated due to bias",
      "Maintain aggressive hydration: IV NS or D5 0.45% NS at 1.5x maintenance to reduce blood viscosity and promote rehydration of sickled cells",
      "Monitor for acute chest syndrome: fever, chest pain, new pulmonary infiltrate, hypoxemia—this is the leading cause of death in SCD",
      "Incentive spirometry every 2 hours while awake during hospitalization to prevent atelectasis and acute chest syndrome",
      "Monitor for stroke: sudden severe headache, hemiparesis, speech difficulty, altered consciousness—medical emergency requiring exchange transfusion",
      "Monitor for splenic sequestration in children <5: sudden splenomegaly, pallor, tachycardia, falling hemoglobin—can cause hypovolemic shock",
      "Educate on crisis prevention: adequate hydration (8-10 glasses water daily), avoid temperature extremes, avoid high altitude, prompt treatment of infections",
      "For patients on chronic transfusions: monitor for iron overload (ferritin levels), administer chelation therapy (deferasirox) as prescribed"
    ],
    assessmentFindings: [
      "Vaso-occlusive crisis: severe pain in bones, joints, chest, abdomen (pain location varies by age and individual)",
      "Chronic hemolytic anemia: pallor, jaundice (scleral icterus), fatigue, exercise intolerance",
      "Functional asplenia: increased susceptibility to encapsulated organisms; Howell-Jolly bodies on smear",
      "Acute chest syndrome: fever, chest pain, hypoxemia, tachypnea, new pulmonary infiltrate",
      "Stroke: sudden neurological deficits, altered consciousness",
      "Priapism: prolonged painful erection requiring urgent treatment (children and adults)",
      "Dactylitis (hand-foot syndrome): painful swelling of hands and feet in infants—often the first manifestation of SCD"
    ],
    signs: {
      left: [
        "Severe bone/joint pain (vaso-occlusive crisis)",
        "Chronic anemia with jaundice and fatigue",
        "Dactylitis in infants (swollen hands/feet)",
        "Cholelithiasis from chronic hemolysis"
      ],
      right: [
        "Acute chest syndrome: fever, chest pain, hypoxemia",
        "Stroke: sudden hemiparesis, speech changes",
        "Splenic sequestration: sudden splenomegaly, shock",
        "Priapism requiring urgent intervention"
      ]
    },
    medications: [
      { name: "Hydroxyurea (Droxia)", type: "Antineoplastic / Disease-Modifying Agent", action: "Increases fetal hemoglobin (HbF) production, which inhibits HbS polymerization and sickling. Also reduces WBC and platelet counts (decreasing adhesion), increases RBC water content (improving deformability), and acts as a nitric oxide donor (promoting vasodilation). Reduces vaso-occlusive crises by 50%", sideEffects: "Myelosuppression (monitor CBC every 2-4 weeks initially), teratogenicity, GI symptoms, skin hyperpigmentation, nail changes", contra: "Pregnancy (teratogenic—effective contraception required), severe myelosuppression, severe renal or hepatic impairment", pearl: "Only disease-modifying oral therapy for SCD. Start at 15mg/kg/day, titrate to maximum tolerated dose (max 35mg/kg/day). Monitor CBC every 2-4 weeks during titration; hold if ANC <2000 or platelets <80,000. Target HbF >20%. Benefits take 3-6 months to manifest. Approved for children as young as 9 months." },
      { name: "Deferasirox (Exjade/Jadenu)", type: "Oral Iron Chelator", action: "Binds excess iron (trivalent iron Fe3+) in the blood forming a complex that is excreted in the feces, reducing iron overload from chronic transfusion therapy. Each unit of pRBCs contains approximately 200-250mg of iron that cannot be physiologically excreted", sideEffects: "Renal toxicity (monitor creatinine monthly), hepatotoxicity (monitor LFTs monthly), GI disturbance (nausea, diarrhea, abdominal pain), rash, hearing/vision changes", contra: "CrCl <40 mL/min, poor performance status, high-risk MDS, platelet count <50,000", pearl: "Indicated when serum ferritin consistently >1000 ng/mL from transfusion-related iron overload. Jadenu (film-coated tablet) can be taken with meals and is preferred over Exjade (dispersible tablet, take on empty stomach). Monitor renal function monthly, hepatic function monthly, and audiometry/ophthalmology annually." }
    ],
    pearls: [
      "SCD pain crises are real and severe—never assume drug-seeking behavior; undertreatment of pain is a major healthcare disparity",
      "Acute chest syndrome is the #1 cause of death in SCD—any fever + chest pain + respiratory symptoms requires urgent evaluation and treatment",
      "Incentive spirometry every 2 hours while awake prevents atelectasis and acute chest syndrome in hospitalized SCD patients",
      "Functional asplenia by age 5: penicillin prophylaxis from birth to age 5 and pneumococcal vaccination are lifesaving",
      "Hydroxyurea is underutilized despite strong evidence—reduces crises by 50% and is approved for children ≥9 months"
    ],
    quiz: [
      { question: "A patient with sickle cell disease presents with fever 102°F, chest pain, cough, and SpO2 89%. CXR shows a new left lower lobe infiltrate. What complication should the nurse suspect?", options: ["Pneumonia only", "Acute chest syndrome", "Pulmonary embolism", "Pleural effusion"], correct: 1, rationale: "Fever, chest pain, respiratory distress, hypoxemia, and new pulmonary infiltrate in a SCD patient define acute chest syndrome—the leading cause of death in SCD. Treatment includes supplemental oxygen, antibiotics, simple or exchange transfusion, and incentive spirometry." },
      { question: "What is the priority nursing intervention for a sickle cell patient in vaso-occlusive crisis?", options: ["Apply cold compresses to painful areas", "Administer IV analgesics within 30 minutes and initiate IV hydration", "Restrict fluids to prevent pulmonary edema", "Encourage ambulation to improve circulation"], correct: 1, rationale: "Pain management within 30 minutes is the priority. IV opioids (morphine or hydromorphone) plus NSAIDs provide multimodal analgesia. Aggressive IV hydration reduces blood viscosity and promotes rehydration of sickled cells. Cold compresses worsen sickling; heat application is preferred." },
      { question: "A 3-year-old with sickle cell disease becomes suddenly pale with rapid heart rate and a rapidly enlarging spleen. What emergency does the nurse suspect?", options: ["Vaso-occlusive crisis", "Splenic sequestration crisis", "Aplastic crisis", "Hemolytic crisis"], correct: 1, rationale: "Acute splenic sequestration involves trapping of large volumes of blood in the spleen, causing rapid splenomegaly, severe anemia, hypovolemia, and potentially cardiovascular collapse. This is a medical emergency requiring immediate fluid resuscitation and transfusion. Most common in children <5 years." },
      { question: "Which medication reduces the frequency of sickle cell crises by increasing fetal hemoglobin?", options: ["Deferasirox", "Hydroxyurea", "Folic acid", "Iron supplements"], correct: 1, rationale: "Hydroxyurea increases fetal hemoglobin (HbF) production, which inhibits HbS polymerization and reduces sickling. It decreases vaso-occlusive crises by approximately 50%, reduces acute chest syndrome episodes, and decreases transfusion requirements." }
    ]
  },

  "rheumatoid-arthritis-rn": {
    title: "Rheumatoid Arthritis: RN Assessment and Management",
    cellular: {
      title: "Autoimmune Synovial Inflammation and Joint Destruction",
      content: "Rheumatoid arthritis (RA) is a chronic, systemic autoimmune disorder characterized by inflammation of the synovial membrane (synovitis) in multiple joints, leading to progressive joint destruction. The pathogenesis involves loss of immune tolerance, with T cells and B cells recognizing self-antigens in the synovium. CD4+ T cells activate macrophages and B cells, which produce rheumatoid factor (RF, an IgM antibody against the Fc portion of IgG) and anti-cyclic citrullinated peptide (anti-CCP) antibodies. The inflamed synovium proliferates into an aggressive tissue called pannus, which invades and destroys articular cartilage and subchondral bone through metalloproteinase and osteoclast activity. Pro-inflammatory cytokines (TNF-alpha, IL-1, IL-6) perpetuate the inflammatory cascade and cause systemic manifestations. Unlike osteoarthritis, RA is a symmetric polyarthritis primarily affecting small joints of the hands and feet, with characteristic morning stiffness lasting >60 minutes. Extra-articular manifestations include rheumatoid nodules, interstitial lung disease, pericarditis, scleritis, Felty syndrome (RA + splenomegaly + neutropenia), and accelerated atherosclerosis."
    },
    riskFactors: [
      "Female sex (3:1 female-to-male ratio)",
      "Age 40-60 years (peak onset)",
      "Genetic: HLA-DR4 (shared epitope) is the strongest genetic risk factor",
      "Smoking: strongest environmental risk factor; increases severity and anti-CCP positivity",
      "Family history of RA or other autoimmune diseases",
      "Periodontal disease (Porphyromonas gingivalis may trigger citrullination and anti-CCP production)"
    ],
    diagnostics: [
      "Rheumatoid factor (RF): positive in 70-80% of RA; not specific (also positive in hepatitis C, SLE, Sjögren, endocarditis, elderly)",
      "Anti-CCP (anti-cyclic citrullinated peptide): more specific than RF (>95% specificity); positive early in disease",
      "ESR and CRP: elevated, indicating active inflammation; used to monitor disease activity and treatment response",
      "CBC: may show anemia of chronic disease, thrombocytosis (inflammation), leukopenia (Felty syndrome)",
      "X-ray of hands/feet: periarticular osteopenia, joint space narrowing, marginal erosions (later stages); MRI is more sensitive for early erosive changes",
      "Synovial fluid analysis: inflammatory (WBC 2,000-75,000 with neutrophil predominance), turbid, decreased viscosity, negative for crystals"
    ],
    management: [
      "Treat-to-target strategy: early aggressive treatment within 3-6 months of diagnosis (window of opportunity) to prevent irreversible joint damage",
      "First-line DMARD: methotrexate 15-25mg weekly (oral or SC) with folic acid 1mg daily to reduce side effects",
      "Biologic DMARDs added if inadequate response to methotrexate: TNF inhibitors (adalimumab, etanercept, infliximab), IL-6 inhibitors (tocilizumab), T-cell co-stimulation blocker (abatacept), anti-CD20 (rituximab), JAK inhibitors (tofacitinib)",
      "Low-dose prednisone (≤10mg/day) as bridge therapy while waiting for DMARDs to take effect (onset 6-12 weeks for methotrexate)",
      "NSAIDs for symptom relief (do not prevent joint damage); avoid chronic NSAID use if possible",
      "Joint protection strategies, physical and occupational therapy, assistive devices"
    ],
    nursingActions: [
      "Assess joint involvement: symmetric distribution, swelling, warmth, tenderness, morning stiffness duration (>60 min suggests active RA)",
      "Administer methotrexate on the same day each week; ensure folic acid supplementation is prescribed",
      "Monitor for methotrexate toxicity: CBC with differential (myelosuppression), LFTs (hepatotoxicity), creatinine (nephrotoxicity), pulmonary symptoms (pneumonitis)",
      "Monitor for infection with biologic DMARDs: screen for TB (PPD/IGRA) before initiating TNF inhibitors; hold biologics during active infection",
      "Educate on joint protection: use large joints instead of small, avoid prolonged static positions, use assistive devices, rest during flares",
      "Encourage exercise during remission: range of motion, low-impact aerobic, water therapy to maintain joint flexibility and muscle strength",
      "Apply warm compresses during morning stiffness; cool compresses during acute inflammation for comfort",
      "Screen for extra-articular manifestations: rheumatoid nodules, dry eyes (Sjögren overlap), pulmonary symptoms, cardiac symptoms"
    ],
    assessmentFindings: [
      "Symmetric polyarthritis primarily affecting MCP and PIP joints, wrists, and MTP joints (spares DIP—differentiates from OA)",
      "Morning stiffness lasting >60 minutes (improves with activity)",
      "Boutonniere deformity: flexion of PIP with hyperextension of DIP",
      "Swan-neck deformity: hyperextension of PIP with flexion of DIP",
      "Ulnar deviation of fingers at MCP joints",
      "Rheumatoid nodules: firm subcutaneous nodules on extensor surfaces (elbows, forearms, fingers)",
      "Systemic symptoms: fatigue, malaise, low-grade fever during flares"
    ],
    signs: {
      left: [
        "Symmetric joint swelling (MCP, PIP, wrists)",
        "Morning stiffness >60 minutes",
        "Warmth and tenderness of affected joints",
        "Rheumatoid nodules on extensor surfaces"
      ],
      right: [
        "Swan-neck and boutonniere deformities (late)",
        "Ulnar deviation of fingers",
        "Extra-articular: Sjögren, interstitial lung disease",
        "Felty syndrome: RA + splenomegaly + neutropenia"
      ]
    },
    medications: [
      { name: "Methotrexate", type: "DMARD (Disease-Modifying Antirheumatic Drug)", action: "Inhibits dihydrofolate reductase and other folate-dependent enzymes, reducing purine and pyrimidine synthesis. At low doses used in RA, the primary mechanism is anti-inflammatory through adenosine release and suppression of pro-inflammatory cytokines. Slows radiographic progression and prevents joint destruction", sideEffects: "Hepatotoxicity (monitor LFTs every 4-8 weeks), myelosuppression (monitor CBC), oral ulcers, nausea, pneumonitis (rare but serious), teratogenicity", contra: "Pregnancy (category X—teratogenic; effective contraception required for men and women), significant hepatic disease, significant renal impairment (CrCl <30), active infection, immunodeficiency", pearl: "Anchor drug for RA treatment. Given weekly (NOT daily). Always supplement with folic acid 1mg daily (reduces mouth ulcers, nausea, and hepatotoxicity without reducing efficacy). Onset of action 6-12 weeks—bridge with low-dose prednisone while waiting. Alcohol must be limited. Hold for WBC <3000, platelets <100,000, or liver enzymes >2x upper limit. Interacts with trimethoprim-sulfamethoxazole (increased myelosuppression)." },
      { name: "Adalimumab (Humira)", type: "TNF-alpha Inhibitor (Biologic DMARD)", action: "Monoclonal antibody that binds and neutralizes TNF-alpha, a key pro-inflammatory cytokine driving RA synovitis and joint destruction. Rapid symptom improvement and halting of radiographic progression when combined with methotrexate", sideEffects: "Serious infections (TB reactivation, invasive fungal infections, opportunistic infections), injection site reactions, demyelinating disease (rare), heart failure exacerbation, malignancy risk (lymphoma), lupus-like syndrome", contra: "Active serious infection, active TB, moderate-to-severe heart failure (NYHA III-IV), concurrent live vaccines, demyelinating disease", pearl: "Screen for latent TB (PPD/IGRA) and hepatitis B before initiating—TNF inhibition can reactivate both. Monitor for signs of infection at every visit. Hold 2-3 half-lives before any surgery. Do not give live vaccines during therapy. Refrigerate; allow to reach room temperature before injection." }
    ],
    pearls: [
      "RA affects small joints symmetrically and spares the DIP joints—DIP involvement suggests osteoarthritis, not RA",
      "Morning stiffness >60 minutes = inflammatory arthritis (RA); <30 minutes = mechanical (OA)",
      "Methotrexate is given WEEKLY, not daily—daily methotrexate dosing is a common and potentially fatal medication error",
      "Screen for TB before starting any TNF inhibitor—reactivation can be fatal",
      "Treat-to-target: early aggressive treatment within the 'window of opportunity' (first 3-6 months) prevents irreversible joint damage"
    ],
    quiz: [
      { question: "A patient with RA reports morning stiffness lasting 2 hours that improves with activity. Examination shows symmetric swelling of the MCP and PIP joints. The DIP joints are unaffected. These findings are most consistent with:", options: ["Osteoarthritis", "Rheumatoid arthritis", "Gout", "Psoriatic arthritis"], correct: 1, rationale: "Symmetric small joint involvement (MCP, PIP) with prolonged morning stiffness (>60 minutes) that improves with activity, and DIP sparing, is classic for RA. OA affects DIP and large weight-bearing joints with brief morning stiffness. Gout is typically monoarticular. Psoriatic arthritis can affect DIPs." },
      { question: "A nurse is administering methotrexate to an RA patient. Which action is essential?", options: ["Administer the dose daily as prescribed", "Verify the dose is prescribed weekly, not daily", "Give with a high-protein meal for absorption", "Administer concurrently with trimethoprim-sulfamethoxazole for infection prevention"], correct: 1, rationale: "Methotrexate for RA is a WEEKLY dose. Daily methotrexate administration is a common and potentially fatal medication error that can cause severe pancytopenia and mucositis. Always verify the frequency. TMP-SMX interacts with methotrexate and should be avoided." },
      { question: "Before starting adalimumab (Humira), which screening test is essential?", options: ["Hemoglobin A1C", "PPD or IGRA for tuberculosis", "Thyroid function tests", "Bone densitometry"], correct: 1, rationale: "TNF inhibitors can reactivate latent tuberculosis, which can be fatal. Screening with PPD skin test or interferon-gamma release assay (IGRA) is mandatory before initiation. If positive, treatment for latent TB must be started before beginning the biologic." },
      { question: "Which supplement should be taken concurrently with weekly methotrexate?", options: ["Vitamin D", "Iron", "Folic acid 1mg daily", "Calcium"], correct: 2, rationale: "Folic acid 1mg daily is taken on all days (some protocols skip methotrexate day) to reduce side effects of methotrexate including oral ulcers, nausea, and hepatotoxicity without reducing the drug's efficacy in treating RA." }
    ]
  },

  "rhabdomyolysis-rn": {
    title: "Rhabdomyolysis: RN Assessment and Emergency Management",
    cellular: {
      title: "Skeletal Muscle Necrosis and Myoglobin-Induced Renal Injury",
      content: "Rhabdomyolysis is the breakdown of skeletal muscle fibers with release of intracellular contents—myoglobin, creatine kinase (CK), potassium, phosphorus, uric acid, and lactate dehydrogenase—into the circulation. The muscle cell membrane (sarcolemma) is disrupted when intracellular calcium rises uncontrollably due to ATP depletion (ischemic causes) or direct membrane injury (traumatic/toxic causes). Elevated intracellular calcium activates proteases, lipases, and phospholipases that destroy the cell from within. The released myoglobin is freely filtered by the glomerulus, but in the acidic environment of the renal tubules, myoglobin precipitates into casts that obstruct tubular flow. Myoglobin also generates reactive oxygen species through its iron (Fe2+) moiety, causing direct tubular epithelial cell injury via lipid peroxidation. The combination of tubular obstruction, direct cytotoxicity, and renal vasoconstriction (from nitric oxide scavenging by free myoglobin) causes acute kidney injury (AKI) in 15-33% of cases. Additionally, massive potassium release can cause life-threatening hyperkalemia and cardiac arrhythmias, while calcium-phosphorus product elevation can cause hypocalcemia and metastatic calcification."
    },
    riskFactors: [
      "Crush injury and compartment syndrome (most common traumatic cause; earthquakes, prolonged immobilization)",
      "Severe exertion: military training, marathon running, CrossFit, seizures (prolonged tonic-clonic activity)",
      "Medications/toxins: statins (especially with fibrates or CYP3A4 inhibitors), alcohol, cocaine, amphetamines, neuroleptic malignant syndrome, malignant hyperthermia",
      "Hyperthermia: heat stroke, neuroleptic malignant syndrome, malignant hyperthermia",
      "Electrolyte abnormalities: severe hypokalemia, hypophosphatemia, hyponatremia",
      "Prolonged immobilization: found down, intra-operative positioning, restraint use",
      "Infections: influenza, legionella, HIV, coxsackievirus"
    ],
    diagnostics: [
      "Creatine kinase (CK): diagnostic hallmark; >5x upper normal limit (typically >1000 IU/L, often >10,000 IU/L); peaks 24-72 hours after muscle injury",
      "Urinalysis: positive for blood on dipstick but NO red blood cells on microscopy (dipstick detects myoglobin heme group, misidentified as hemoglobin)",
      "Serum myoglobin: elevated but clears rapidly (half-life 2-3 hours); less useful than CK for monitoring",
      "BMP: hyperkalemia (potentially lethal), hyperphosphatemia, hypocalcemia, metabolic acidosis, elevated BUN/creatinine (AKI)",
      "Urine myoglobin: elevated; dark brown/tea-colored urine is characteristic",
      "Coagulation studies: evaluate for DIC which can complicate severe rhabdomyolysis"
    ],
    management: [
      "Aggressive IV fluid resuscitation: the cornerstone of treatment; isotonic saline 200-1000 mL/hr initially, targeting urine output 200-300 mL/hr (3 mL/kg/hr)",
      "Fluid volumes of 10-12 L/day may be needed in the first 24 hours to maintain adequate urine output and prevent myoglobin precipitation",
      "Alkalinization of urine: sodium bicarbonate infusion to maintain urine pH >6.5 (prevents myoglobin precipitation in tubules); controversial but widely used",
      "Treat hyperkalemia aggressively: calcium gluconate for cardiac membrane stabilization, insulin/dextrose, sodium polystyrene sulfonate, hemodialysis if refractory",
      "Avoid calcium replacement for hypocalcemia unless symptomatic (tetany, arrhythmias)—calcium deposits in injured muscle during recovery phase",
      "Continuous renal replacement therapy (CRRT) or hemodialysis for severe AKI, refractory hyperkalemia, or fluid overload"
    ],
    nursingActions: [
      "Initiate and maintain aggressive IV hydration as ordered; target urine output 200-300 mL/hr",
      "Monitor urine color: dark brown/tea/cola-colored urine indicates myoglobinuria; clearing indicates treatment response",
      "Strict intake and output with hourly urine measurement; report urine output <0.5 mL/kg/hr immediately",
      "Monitor serial CK levels every 6-12 hours initially; trending downward indicates resolving muscle breakdown",
      "Continuous cardiac monitoring for hyperkalemia-related arrhythmias: peaked T waves, widened QRS, sine wave pattern",
      "Monitor BMP every 4-6 hours initially: K+, Ca2+, PO4, BUN/creatinine, bicarbonate",
      "Assess affected extremities for compartment syndrome: pain out of proportion, pain with passive stretch, paresthesias, pressure (tenseness on palpation)",
      "Prevent further muscle injury: repositioning, padding, early mobilization when safe"
    ],
    assessmentFindings: [
      "Muscle pain, tenderness, and weakness (may be localized or diffuse depending on cause)",
      "Dark brown or cola-colored urine (myoglobinuria)",
      "Swelling of affected muscle groups",
      "Decreased urine output as AKI develops",
      "Nausea, vomiting, and malaise",
      "Signs of hyperkalemia: palpitations, muscle weakness, ECG changes",
      "Compartment syndrome: tense swelling, severe pain disproportionate to injury, pain with passive stretch"
    ],
    signs: {
      left: [
        "Muscle pain, tenderness, and weakness",
        "Dark brown (tea/cola-colored) urine",
        "Swelling of affected muscle groups",
        "Malaise, nausea, vomiting"
      ],
      right: [
        "Oliguria progressing to anuria (AKI)",
        "ECG changes from hyperkalemia",
        "Compartment syndrome: 5 P's",
        "DIC with bleeding complications (severe cases)"
      ]
    },
    medications: [
      { name: "Normal Saline (0.9% NaCl)", type: "Isotonic Crystalloid", action: "Aggressive volume expansion is the cornerstone of rhabdomyolysis treatment. Increases renal perfusion and glomerular filtration rate, dilutes myoglobin concentration in tubular fluid, prevents myoglobin precipitation, and corrects hypovolemia from third-spacing into injured muscle", sideEffects: "Fluid overload (monitor for pulmonary edema, JVD, peripheral edema), hyperchloremic metabolic acidosis with massive volumes, dilutional hyponatremia", contra: "Decompensated heart failure (requires careful monitoring), severe hypernatremia, anuria from established renal failure (risk of fluid overload)", pearl: "Initial bolus 1-2 L, then 200-1000 mL/hr to achieve urine output 200-300 mL/hr (3 mL/kg/hr). Total volumes of 10-12 L/day may be needed. Early aggressive hydration within 6 hours of injury onset is the single most important intervention to prevent AKI. Monitor for fluid overload with invasive monitoring if needed." },
      { name: "Calcium Gluconate (for Hyperkalemia)", type: "Cardiac Membrane Stabilizer", action: "Does not lower serum potassium but directly antagonizes the effects of hyperkalemia on the cardiac membrane by increasing the threshold potential, reducing the risk of fatal arrhythmias. Provides temporary cardiac protection (30-60 minutes) while other potassium-lowering treatments take effect", sideEffects: "Bradycardia with rapid IV push, tissue necrosis with extravasation, hypercalcemia with excessive dosing", contra: "Digitalis toxicity (calcium can potentiate digoxin toxicity and cause asystole); caution with concomitant digoxin use", pearl: "10 mL of 10% calcium gluconate IV over 2-3 minutes; onset 1-3 minutes, duration 30-60 minutes. If no ECG improvement, may repeat in 5 minutes. This is a temporizing measure only—follow with insulin/dextrose, sodium bicarbonate, and potassium-lowering agents. Always use calcium gluconate (not calcium chloride) via peripheral IV—calcium chloride causes severe tissue necrosis if it extravasates." }
    ],
    pearls: [
      "Positive urine dipstick for blood with NO RBCs on microscopy = myoglobinuria until proven otherwise",
      "Aggressive IV hydration within 6 hours of injury onset is the single most important intervention to prevent AKI in rhabdomyolysis",
      "Do NOT correct hypocalcemia unless the patient is symptomatic (tetany, seizures, arrhythmias)—calcium deposited in damaged muscle will be released during recovery, causing rebound hypercalcemia",
      "Statin-induced rhabdomyolysis risk increases dramatically when combined with fibrates or CYP3A4 inhibitors (erythromycin, azole antifungals, grapefruit juice)",
      "Compartment syndrome and rhabdomyolysis often coexist—assess the 5 P's and measure compartment pressures if suspected"
    ],
    quiz: [
      { question: "A patient is admitted after being found unresponsive on the floor for approximately 12 hours. CK is 45,000 IU/L and urine is dark brown. What is the priority nursing intervention?", options: ["Obtain a urine culture and administer antibiotics", "Initiate aggressive IV normal saline infusion targeting urine output 200-300 mL/hr", "Administer IV calcium chloride for expected hypocalcemia", "Apply ice packs to all extremities"], correct: 1, rationale: "Aggressive IV hydration is the cornerstone of rhabdomyolysis treatment. It increases renal perfusion, dilutes myoglobin in the tubular fluid, and prevents precipitation and AKI. Target urine output is 200-300 mL/hr. Early intervention within 6 hours dramatically reduces AKI risk." },
      { question: "A nurse checking labs on a rhabdomyolysis patient notes potassium 7.1 mEq/L with peaked T waves on the cardiac monitor. What is the MOST urgent intervention?", options: ["Administer oral sodium polystyrene sulfonate", "Administer IV calcium gluconate 10 mL over 2-3 minutes", "Initiate hemodialysis", "Restrict dietary potassium intake"], correct: 1, rationale: "With K+ >7.0 and ECG changes, IV calcium gluconate is given immediately to stabilize the cardiac membrane and prevent fatal arrhythmias. It works within minutes. Sodium polystyrene, while potassium-lowering, is too slow for this emergency. Insulin/dextrose and hemodialysis are also needed but cardiac stabilization comes first." },
      { question: "Which urine finding is characteristic of rhabdomyolysis?", options: ["Urine dipstick positive for blood with RBCs present on microscopy", "Urine dipstick positive for blood with NO RBCs on microscopy", "Urine dipstick negative for blood with white blood cells present", "Crystal formation on urine microscopy"], correct: 1, rationale: "The urine dipstick detects the heme group in both hemoglobin and myoglobin, reading positive for 'blood.' However, microscopy shows no red blood cells because the positive result is from filtered myoglobin, not hemoglobin from lysed RBCs. This discrepancy is a diagnostic clue for myoglobinuria." }
    ]
  },

  "osteomyelitis-septic-arthritis-rn": {
    title: "Osteomyelitis and Septic Arthritis: RN Assessment and Management",
    cellular: {
      title: "Bone and Joint Infection Pathophysiology",
      content: "Osteomyelitis is infection of the bone, most commonly caused by Staphylococcus aureus (including MRSA) reaching bone through hematogenous spread (children), contiguous spread from adjacent soft tissue infection (adults, diabetic foot), or direct inoculation (open fractures, surgical hardware). Once established in the medullary cavity, bacteria form biofilms on bone surfaces—complex polysaccharide matrices that shield organisms from antibiotics and immune cells. The infection triggers an intense inflammatory response: PMN infiltration, abscess formation, increased intraosseous pressure compromising blood supply, and bone necrosis. Necrotic bone fragments (sequestra) become avascular refuges for bacteria, perpetuating infection. The periosteum responds by laying down new reactive bone (involucrum) around the infected area. Septic arthritis is infection of the joint space, also most commonly caused by S. aureus (or N. gonorrhoeae in sexually active young adults). Bacteria in the synovial fluid trigger cytokine release, neutrophil infiltration, and release of proteolytic enzymes that destroy articular cartilage within hours. Untreated septic arthritis causes permanent joint destruction within 24-48 hours, making it an orthopedic emergency."
    },
    riskFactors: [
      "Diabetes mellitus with peripheral neuropathy and peripheral vascular disease (most common risk factor for adult osteomyelitis)",
      "Open fractures and orthopedic hardware (direct inoculation of bacteria)",
      "IV drug use (hematogenous spread; unusual organisms including Pseudomonas and Candida)",
      "Immunosuppression: HIV, chronic corticosteroid therapy, chemotherapy, organ transplant recipients",
      "Peripheral vascular disease with chronic wounds",
      "Sickle cell disease (Salmonella osteomyelitis is classically associated with SCD)",
      "Prosthetic joints (biofilm formation on hardware)"
    ],
    diagnostics: [
      "Blood cultures: positive in 50-60% of hematogenous osteomyelitis; obtain before starting antibiotics",
      "ESR and CRP: elevated; CRP normalizes faster than ESR and is better for monitoring treatment response",
      "MRI with gadolinium: most sensitive and specific imaging for osteomyelitis (90-100% sensitivity)",
      "Bone biopsy with culture and histology: gold standard for definitive diagnosis and organism identification",
      "X-ray: initial imaging but findings may not appear for 10-14 days (periosteal elevation, cortical irregularity, sequestrum/involucrum)",
      "Septic arthritis: joint aspiration (arthrocentesis) is MANDATORY—purulent fluid with WBC >50,000 (predominantly neutrophils), positive Gram stain/culture, low glucose",
      "Probe-to-bone test in diabetic foot ulcers: if a sterile probe reaches bone through the ulcer, positive predictive value for osteomyelitis is >90%"
    ],
    management: [
      "Osteomyelitis: prolonged IV antibiotics 4-6 weeks minimum; empiric coverage for S. aureus (vancomycin + ceftriaxone) then narrow based on culture",
      "Surgical debridement for chronic osteomyelitis with sequestrum, abscess, or necrotic tissue; hardware removal if prosthetic joint infection",
      "Diabetic foot osteomyelitis: may require amputation if vascular supply is inadequate for healing",
      "Septic arthritis: SURGICAL EMERGENCY requiring emergent joint aspiration/lavage (arthrocentesis or arthroscopic washout) PLUS IV antibiotics",
      "Septic arthritis empiric antibiotics: vancomycin (MRSA coverage) + ceftriaxone (Gram-negative coverage); add ceftriaxone for gonococcal arthritis in young sexually active patients",
      "Gonococcal septic arthritis: IV ceftriaxone 1g daily; also treat for chlamydia empirically"
    ],
    nursingActions: [
      "Administer IV antibiotics on schedule; ensure PICC line or midline catheter care for prolonged IV therapy",
      "Monitor IV access site for phlebitis, infiltration, and catheter-related bloodstream infection",
      "Assess affected extremity: warmth, erythema, swelling, tenderness, range of motion limitation, and drainage",
      "Maintain proper immobilization and positioning of affected limb as prescribed",
      "Perform wound care for open wounds/surgical sites per protocol; note drainage character and amount",
      "Monitor inflammatory markers (CRP, ESR) to evaluate treatment response; CRP should decline within 48-72 hours of appropriate antibiotics",
      "Assess for complications: pathological fracture, chronic osteomyelitis, adjacent joint involvement, sepsis",
      "Diabetic foot: perform comprehensive foot assessment, educate on daily foot inspection, proper footwear, and avoiding barefoot walking",
      "Pain management: assess pain regularly and administer analgesics as prescribed; immobilization reduces pain"
    ],
    assessmentFindings: [
      "Osteomyelitis: localized bone pain, tenderness, warmth, erythema, and swelling over affected area; fever; limited use of affected extremity",
      "Chronic osteomyelitis: draining sinus tract, chronic pain, intermittent fever, failure to heal",
      "Septic arthritis: acute onset of severe joint pain (monoarticular in 80-90%), swelling, warmth, erythema, inability to bear weight or move the joint",
      "Septic arthritis of the hip in children: held in flexion, externally rotated, abducted; any passive movement causes severe pain",
      "Systemic signs: fever (may be absent in immunosuppressed or elderly), tachycardia, elevated WBC"
    ],
    signs: {
      left: [
        "Bone pain, tenderness, and swelling (osteomyelitis)",
        "Severe monoarticular joint pain with effusion (septic arthritis)",
        "Fever and localized warmth/erythema",
        "Limited range of motion and weight-bearing ability"
      ],
      right: [
        "Draining sinus tract (chronic osteomyelitis)",
        "Joint held in flexion and externally rotated (hip septic arthritis)",
        "Periosteal elevation on X-ray after 10-14 days",
        "Pathological fracture through infected bone"
      ]
    },
    medications: [
      { name: "Vancomycin", type: "Glycopeptide Antibiotic", action: "Inhibits cell wall synthesis by binding to D-Ala-D-Ala terminus of peptidoglycan precursors, preventing cross-linking. Bactericidal against Gram-positive organisms including MRSA, the most common cause of osteomyelitis and septic arthritis. Requires therapeutic drug monitoring", sideEffects: "Nephrotoxicity (monitor trough levels, target 15-20 mcg/mL for bone/joint infections), ototoxicity, Red Man syndrome (histamine-mediated flushing from rapid infusion—not a true allergy), thrombocytopenia", contra: "Known hypersensitivity; use with caution in renal impairment (dose adjust per CrCl and trough levels)", pearl: "Infuse over at least 60 minutes (1g/hour) to prevent Red Man syndrome. If Red Man occurs: slow or stop infusion, administer diphenhydramine, restart at slower rate. This is a rate-related histamine release, NOT an allergy—do not label as vancomycin allergy. Trough levels drawn 30 minutes before 4th or 5th dose; target 15-20 for bone/joint infections. Area under the curve (AUC)-guided dosing is increasingly preferred." },
      { name: "Ceftriaxone", type: "Third-generation Cephalosporin", action: "Bactericidal; inhibits cell wall synthesis by binding PBPs. Broad Gram-negative coverage and some Gram-positive activity. Once-daily dosing and excellent bone penetration make it ideal for outpatient parenteral antibiotic therapy (OPAT) in osteomyelitis", sideEffects: "Biliary sludging (pseudocholelithiasis), C. difficile-associated diarrhea, hypersensitivity reactions", contra: "Neonates with hyperbilirubinemia; concurrent IV calcium in neonates (precipitation risk)", pearl: "2g IV once daily for bone/joint infections. Excellent choice for gonococcal septic arthritis. Can be given IM when IV access is difficult. Once-daily dosing facilitates OPAT (outpatient parenteral antibiotic therapy), allowing patients to complete 4-6 week courses at home with PICC line." }
    ],
    pearls: [
      "Septic arthritis is an orthopedic emergency—articular cartilage can be irreversibly destroyed within 24-48 hours; joint aspiration must not be delayed",
      "Red Man syndrome from vancomycin is NOT an allergy—it is a rate-related histamine release that is managed by slowing the infusion, not by avoiding vancomycin",
      "In sickle cell disease, S. aureus is still the most common cause of osteomyelitis, but Salmonella is a classic board-answer association",
      "Probe-to-bone test: if a sterile probe inserted into a diabetic foot ulcer touches bone, assume osteomyelitis until proven otherwise",
      "CRP is a better monitor of treatment response than ESR—it normalizes within days, while ESR takes weeks to normalize"
    ],
    quiz: [
      { question: "A patient presents with acute onset of right knee pain, swelling, warmth, and inability to bear weight. Temperature is 101.5°F. Which diagnostic procedure is the priority?", options: ["X-ray of the right knee", "MRI of the right knee", "Arthrocentesis of the right knee for synovial fluid analysis and culture", "Blood cultures and empiric antibiotics without joint aspiration"], correct: 2, rationale: "Acute monoarticular joint pain with effusion and fever is septic arthritis until proven otherwise. Arthrocentesis is the priority for definitive diagnosis (WBC, Gram stain, culture) and therapeutic benefit (drainage). Joint aspiration should not be delayed for imaging." },
      { question: "During vancomycin infusion, a patient develops flushing of the face, neck, and upper trunk with pruritis. What should the nurse do?", options: ["Stop the infusion permanently and document vancomycin allergy", "Slow or stop the infusion, administer diphenhydramine, and restart at a slower rate", "Administer epinephrine for anaphylaxis", "Continue the infusion at the same rate"], correct: 1, rationale: "Red Man syndrome is a rate-related histamine release, NOT a true allergy. Management: slow or stop the infusion, administer diphenhydramine, and restart at a slower rate (minimum 60 minutes per gram). Do not label this as an allergy—vancomycin may be the only effective antibiotic for MRSA infections." },
      { question: "A diabetic patient has a foot ulcer with exposed bone visible at the base. What does this finding indicate?", options: ["Normal wound healing process", "Probable osteomyelitis requiring further evaluation", "Need for immediate amputation", "Superficial wound only"], correct: 1, rationale: "Exposed bone or a positive probe-to-bone test in a diabetic foot ulcer has a >90% positive predictive value for osteomyelitis. Further evaluation with MRI and bone biopsy is needed. Prolonged antibiotic therapy and possibly surgical debridement are required." }
    ]
  },

  "thalassemia-comprehensive-rn": {
    title: "Thalassemia: Alpha and Beta Variants — RN Management",
    cellular: {
      title: "Defective Globin Chain Synthesis",
      content: "Thalassemias are inherited hemoglobin disorders caused by reduced or absent production of one or more globin chains (alpha or beta). Normal adult hemoglobin (HbA) consists of two alpha and two beta globin chains. Alpha thalassemia results from gene deletions on chromosome 16 (4 alpha genes total; severity depends on number deleted). Beta thalassemia results from point mutations on chromosome 11 reducing or abolishing beta chain synthesis.\n\nUnpaired globin chains precipitate within RBC precursors, causing ineffective erythropoiesis and intramedullary hemolysis. The bone marrow expands dramatically to compensate, causing skeletal deformities (frontal bossing, maxillary hyperplasia, 'chipmunk facies,' 'hair-on-end' skull x-ray). Extramedullary hematopoiesis causes hepatosplenomegaly.\n\nAlpha thalassemia spectrum: silent carrier (1 gene deleted, asymptomatic), alpha thalassemia trait (2 genes deleted, mild microcytic anemia), HbH disease (3 genes deleted, moderate hemolytic anemia with HbH inclusions), and Hb Bart hydrops fetalis (4 genes deleted, incompatible with life without in-utero transfusion).\n\nBeta thalassemia spectrum: beta thalassemia minor/trait (one mutant gene, mild anemia, often asymptomatic), beta thalassemia intermedia (moderate anemia, variable transfusion needs), and beta thalassemia major (Cooley anemia—both genes affected, severe transfusion-dependent anemia presenting at 6-12 months when fetal hemoglobin declines)."
    },
    riskFactors: [
      "Mediterranean, Middle Eastern, Southeast Asian, African descent (beta thalassemia most common in Mediterranean populations)",
      "Family history of thalassemia or carrier state",
      "Consanguineous marriage increases homozygous risk",
      "Alpha thalassemia most prevalent in Southeast Asian and African populations",
      "Co-inheritance of alpha and beta thalassemia can modify phenotype"
    ],
    diagnostics: [
      "CBC: microcytic hypochromic anemia (low MCV <70), target cells, basophilic stippling on peripheral smear",
      "Hemoglobin electrophoresis: elevated HbA2 (>3.5%) and HbF in beta thalassemia; decreased HbA in beta thal major",
      "Iron studies: normal to elevated ferritin and iron (distinguishes from iron deficiency—do NOT give iron for microcytic anemia until thalassemia is ruled out)",
      "Reticulocyte count: elevated (compensatory erythropoiesis)",
      "Peripheral smear: target cells, teardrop cells, nucleated RBCs, Howell-Jolly bodies (if splenectomized)",
      "DNA analysis: definitive for alpha thalassemia (gene deletion mapping)",
      "Mentzer index: MCV/RBC count—<13 suggests thalassemia, >13 suggests iron deficiency"
    ],
    management: [
      "Beta thalassemia major: chronic transfusion program to maintain Hb 9-10.5 g/dL, suppress ineffective erythropoiesis, and prevent skeletal deformities",
      "Iron chelation therapy required for all chronically transfused patients (deferoxamine SC/IV, deferasirox PO, or deferiprone PO)",
      "Target ferritin <1000 ng/mL to prevent iron overload complications",
      "Folic acid supplementation (increased demand from chronic hemolysis)",
      "Splenectomy considered if transfusion requirements exceed 200-220 mL/kg/year (hypersplenism)",
      "Post-splenectomy: pneumococcal, meningococcal, H. influenzae type b vaccines; daily penicillin prophylaxis",
      "Hydroxyurea may increase HbF production in beta thalassemia intermedia",
      "Allogeneic hematopoietic stem cell transplantation: only curative option; best outcomes in young patients with HLA-matched sibling donor",
      "Gene therapy: emerging curative approach (betibeglogene autotemcel approved for transfusion-dependent beta thalassemia)"
    ],
    nursingActions: [
      "Monitor pre-transfusion hemoglobin levels and maintain transfusion schedule strictly",
      "Administer chelation therapy as ordered; teach subcutaneous deferoxamine pump technique (8-12 hour infusions, 5-7 nights/week)",
      "Monitor for transfusion reactions during every unit of blood",
      "Assess for iron overload signs: bronze skin discoloration, hepatomegaly, heart failure symptoms, endocrine dysfunction",
      "Monitor cardiac function (annual echocardiogram and cardiac MRI T2* for iron loading)",
      "Monitor liver iron concentration (MRI or liver biopsy)",
      "Monitor growth and development in pediatric patients (delayed puberty is common from iron-induced endocrinopathy)",
      "Provide genetic counseling referral for family planning",
      "Psychosocial support for chronic disease management burden"
    ],
    assessmentFindings: [
      "Pallor, fatigue, exercise intolerance (chronic anemia)",
      "Jaundice and dark urine (hemolysis)",
      "Hepatosplenomegaly (extramedullary hematopoiesis and iron deposition)",
      "Frontal bossing, maxillary hyperplasia (skeletal expansion from marrow hyperplasia in undertreated patients)",
      "Growth retardation and delayed puberty",
      "Pathological fractures (osteoporosis from marrow expansion)",
      "Bronze or slate-gray skin discoloration (iron overload)",
      "Heart failure symptoms (iron cardiomyopathy—leading cause of death)"
    ],
    signs: {
      left: ["Microcytic hypochromic anemia", "Target cells on smear", "Elevated HbA2/HbF", "Hepatosplenomegaly", "Skeletal deformities", "Growth retardation"],
      right: ["Ferritin >1000 (iron overload)", "Cardiac T2* <20ms (cardiac iron)", "Liver iron concentration >7 mg/g", "Endocrine dysfunction", "Osteoporosis", "Bronze skin"]
    },
    medications: [
      { name: "Deferoxamine (Desferal)", type: "Iron Chelator (parenteral)", action: "Binds free iron forming ferrioxamine excreted in urine and stool", sideEffects: ["Injection site reactions", "Ototoxicity (high-frequency hearing loss)", "Retinal toxicity", "Growth retardation at high doses"], contra: ["Severe renal disease", "Anuria"], pearl: "Urine turns reddish-orange (normal finding); annual audiology and ophthalmology exams required" },
      { name: "Deferasirox (Exjade/Jadenu)", type: "Iron Chelator (oral)", action: "Once-daily oral iron chelator; binds iron for fecal excretion", sideEffects: ["GI disturbance (nausea, diarrhea, abdominal pain)", "Hepatotoxicity", "Renal toxicity (rising creatinine)", "GI hemorrhage (rare but serious)"], contra: ["CrCl <40 mL/min", "Advanced hepatic disease", "High-risk MDS"], pearl: "Monitor serum creatinine monthly and LFTs monthly; Jadenu formulation can be taken with meals (better tolerated)" },
      { name: "Deferiprone (Ferriprox)", type: "Iron Chelator (oral)", action: "Bidentate chelator especially effective at removing cardiac iron", sideEffects: ["Agranulocytosis (1-2%—potentially fatal)", "Neutropenia", "GI symptoms", "Arthropathy"], contra: ["Bone marrow failure syndromes"], pearl: "Weekly ANC monitoring mandatory; best chelator for cardiac iron; often used in combination with deferoxamine for severe iron overload" },
      { name: "Hydroxyurea", type: "HbF Inducer", action: "Increases fetal hemoglobin production, reducing severity of ineffective erythropoiesis", sideEffects: ["Myelosuppression", "Mucocutaneous reactions", "Teratogenicity"], contra: ["Pregnancy", "Severe myelosuppression"], pearl: "Most useful in thalassemia intermedia; monitor CBC every 2 weeks during dose titration, then monthly" }
    ],
    pearls: [
      "Thalassemia trait causes microcytic anemia that does NOT respond to iron—giving iron to a thalassemia patient causes iron overload",
      "The Mentzer index (MCV/RBC) helps differentiate: <13 = thalassemia (low MCV but high RBC count); >13 = iron deficiency",
      "Iron overload cardiomyopathy is the leading cause of death in thalassemia major—cardiac MRI T2* monitoring is essential",
      "Deferiprone has the best cardiac iron chelation but requires weekly CBC monitoring for agranulocytosis",
      "Children with thalassemia major appear normal at birth because fetal hemoglobin (HbF) predominates; symptoms appear at 6-12 months as HbF declines",
      "Post-splenectomy patients are at lifelong risk for overwhelming post-splenectomy infection (OPSI)—teach patients to seek immediate care for any fever"
    ],
    quiz: [
      { question: "A patient with microcytic anemia has been taking iron supplements for 3 months with no improvement. Ferritin is elevated. What should the nurse suspect?", options: ["Medication nonadherence", "Thalassemia trait or disease", "Chronic kidney disease", "Lead poisoning"], correct: 1, rationale: "Microcytic anemia unresponsive to iron with elevated ferritin strongly suggests thalassemia. Iron deficiency would show low ferritin and response to supplementation. Giving iron to thalassemia patients worsens iron overload." },
      { question: "Which chelation therapy requires weekly absolute neutrophil count monitoring?", options: ["Deferoxamine", "Deferasirox", "Deferiprone", "None require monitoring"], correct: 2, rationale: "Deferiprone carries a 1-2% risk of agranulocytosis—a potentially fatal complication. Weekly ANC monitoring is mandatory. Patients must be instructed to report fever, sore throat, or signs of infection immediately." },
      { question: "The leading cause of death in beta thalassemia major is:", options: ["Infection", "Iron overload cardiomyopathy", "Hepatic failure", "Hemorrhage"], correct: 1, rationale: "Iron overload cardiomyopathy from chronic transfusions is the leading cause of death. Cardiac MRI T2* values <20ms indicate significant cardiac iron loading. Consistent chelation therapy is the primary prevention strategy." }
    ]
  }
};
