import type { LessonContent } from "./types";

export const npPathoExpansionLessons: Record<string, LessonContent> = {
  "hematology-leukemia-np": {
    "title": "Leukemia: Classification, Molecular Pathology, and NP Management",
    "cellular": {
      "title": "Hematopoietic Malignancy and Clonal Proliferation",
      "content": "Leukemia arises from malignant clonal expansion of hematopoietic precursor cells in the bone marrow, disrupting normal hematopoiesis and leading to cytopenias. Classification is based on cell lineage (lymphoid vs myeloid) and acuity (acute vs chronic). Acute lymphoblastic leukemia (ALL) involves malignant proliferation of lymphoid precursor B-cells (85%) or T-cells (15%), most common in children aged 2-5 years. The Philadelphia chromosome t(9;22) BCR-ABL1 fusion is found in 25% of adult ALL and confers poor prognosis but is targetable by tyrosine kinase inhibitors (imatinib, dasatinib). Acute myeloid leukemia (AML) results from clonal expansion of myeloid progenitors with maturation arrest; the t(15;17) PML-RARA translocation defines acute promyelocytic leukemia (APL), uniquely responsive to all-trans retinoic acid (ATRA) and arsenic trioxide. Chronic lymphocytic leukemia (CLL) involves accumulation of mature but functionally incompetent CD5+ B-lymphocytes resistant to apoptosis due to BCL-2 overexpression; most common adult leukemia in Western countries. Chronic myeloid leukemia (CML) is defined by the Philadelphia chromosome t(9;22) producing BCR-ABL1 constitutive tyrosine kinase activity driving unregulated myeloid proliferation through three phases: chronic, accelerated, and blast crisis. The WHO 2022 classification integrates morphology, immunophenotyping, cytogenetics, and molecular markers for diagnosis and risk stratification."
    },
    "riskFactors": [
      "Prior chemotherapy or radiation therapy (therapy-related AML, typically 5-10 years post-treatment)",
      "Benzene and industrial chemical exposure (occupational AML risk)",
      "Down syndrome (20-fold increased risk of ALL in children, also increased AML risk)",
      "Family history of hematologic malignancy (first-degree relative with CLL has 6-9x risk)",
      "Age: ALL peaks at 2-5 years and again >60; AML incidence increases with age >65; CLL median diagnosis age 72",
      "Ionizing radiation exposure (atomic bomb survivors, therapeutic radiation)",
      "Genetic syndromes: Fanconi anemia, Li-Fraumeni syndrome, ataxia-telangiectasia, Bloom syndrome"
    ],
    "diagnostics": [
      "CBC with differential: leukocytosis with circulating blasts (acute), lymphocytosis >5x10^9/L (CLL), leukocytosis with left shift and basophilia (CML)",
      "Peripheral blood smear: Auer rods pathognomonic for AML (especially APL); smudge cells characteristic of CLL",
      "Bone marrow biopsy with aspirate: >= 20% blasts defines acute leukemia (WHO criteria)",
      "Flow cytometry immunophenotyping: CD10+ CD19+ CD20+ (B-ALL), CD5+ CD19+ CD23+ (CLL), myeloperoxidase+ CD13+ CD33+ (AML)",
      "Cytogenetics and FISH: t(9;22) BCR-ABL1 (CML, Ph+ ALL), t(15;17) PML-RARA (APL), t(8;21), inv(16) (favorable AML)",
      "Molecular testing: FLT3-ITD and NPM1 mutations (AML prognosis), TP53 mutation (poor prognosis CLL), IGHV mutation status (CLL prognosis)",
      "LDH, uric acid, phosphate, calcium, potassium (baseline and tumor lysis syndrome monitoring)"
    ],
    "management": [
      "ALL: induction (vincristine, daunorubicin, L-asparaginase, prednisone), consolidation, maintenance (6-MP, methotrexate), CNS prophylaxis (intrathecal methotrexate)",
      "Ph+ ALL: add tyrosine kinase inhibitor (dasatinib or imatinib) to chemotherapy backbone",
      "AML: induction with 7+3 regimen (cytarabine 7 days + daunorubicin 3 days); APL: ATRA + arsenic trioxide (cure rate >90%)",
      "CLL: watch-and-wait for early stage (Rai 0-I); treat symptomatic/progressive disease with BTK inhibitor (ibrutinib, acalabrutinib) or BCL-2 inhibitor (venetoclax) + anti-CD20 (obinutuzumab)",
      "CML: first-line TKI therapy (imatinib 400mg daily, dasatinib, nilotinib); target major molecular response (BCR-ABL1 <= 0.1%)",
      "Allogeneic stem cell transplant for high-risk or relapsed/refractory disease",
      "Tumor lysis syndrome prophylaxis: aggressive IV hydration, allopurinol or rasburicase, monitor electrolytes every 6-8 hours during induction"
    ],
    "signs": {
      "left": [
        "CLL Rai stage 0: isolated lymphocytosis >5x10^9/L, no lymphadenopathy or cytopenias, watch-and-wait appropriate",
        "CML chronic phase: leukocytosis with mature granulocytes, basophilia, splenomegaly, well-controlled on TKI",
        "ALL in remission: normal CBC, <5% bone marrow blasts, negative MRD",
        "Stable CLL with mutated IGHV and del(13q) only (favorable prognosis)"
      ],
      "right": [
        "AML with DIC (especially APL): coagulopathy, bleeding, fibrinogen <150 mg/dL (hematologic emergency)",
        "Hyperleukocytosis: WBC >100x10^9/L with leukostasis symptoms (dyspnea, confusion, retinal hemorrhage) requiring emergent leukapheresis",
        "Tumor lysis syndrome: hyperuricemia, hyperkalemia, hyperphosphatemia, hypocalcemia, acute kidney injury",
        "CML blast crisis: transformation to acute leukemia (>20% blasts), poor prognosis, consider allogeneic SCT"
      ]
    },
    "medications": [
      {
        "name": "Imatinib (Gleevec)",
        "type": "Tyrosine Kinase Inhibitor (BCR-ABL1)",
        "action": "Selectively inhibits the BCR-ABL1 constitutive tyrosine kinase by occupying the ATP-binding site, blocking phosphorylation of downstream signaling proteins (RAS, PI3K, STAT5) that drive uncontrolled myeloid proliferation in CML",
        "sideEffects": "Fluid retention and periorbital edema, nausea, muscle cramps, myelosuppression, hepatotoxicity, QT prolongation, rash",
        "contra": "Pregnancy (teratogenic), severe hepatic impairment, concurrent strong CYP3A4 inducers (reduce TKI levels)",
        "pearl": "400mg daily for CML chronic phase. IRIS trial: 10-year OS 83.3%. Monitor BCR-ABL1 transcript levels by qPCR at 3, 6, 12 months and every 6 months thereafter. Target milestones: BCR-ABL1 <= 10% at 3 months, <= 1% at 6 months, <= 0.1% (MMR) at 12 months. Failure to achieve milestones = switch to second-generation TKI (dasatinib, nilotinib). Treatment-free remission may be attempted after sustained deep molecular response for >= 2 years."
      },
      {
        "name": "Venetoclax (Venclexta)",
        "type": "BCL-2 Inhibitor",
        "action": "Selectively binds BCL-2 anti-apoptotic protein, displacing pro-apoptotic BH3-only proteins (BIM, BAX, BAK), restoring mitochondrial apoptosis pathway in CLL cells that overexpress BCL-2 for survival",
        "sideEffects": "Tumor lysis syndrome (dose-limiting, requires 5-week ramp-up), neutropenia, diarrhea, nausea, upper respiratory infections, pneumonia",
        "contra": "Concurrent strong CYP3A4 inhibitors during ramp-up (ketoconazole, clarithromycin increase venetoclax levels and TLS risk), avoid grapefruit",
        "pearl": "CRITICAL: 5-week dose ramp-up (20mg -> 50mg -> 100mg -> 200mg -> 400mg) with TLS prophylaxis (hydration + allopurinol) and monitoring (electrolytes at 6-8h and 24h after each dose escalation). In CLL, combined with obinutuzumab for fixed-duration therapy (12 months). In AML, combined with azacitidine for elderly/unfit patients. Highly effective in del(17p)/TP53 mutated CLL."
      }
    ],
    "pearls": [
      "Auer rods on peripheral smear are pathognomonic for AML - if APL (promyelocytes with heavy granulation) is suspected, the clinician must initiate ATRA immediately before confirmatory t(15;17) results because APL-associated DIC has a 10-20% early mortality if treatment is delayed; ATRA + arsenic trioxide achieves >90% cure rate",
      "Tumor lysis syndrome is the most dangerous acute complication during leukemia induction - the clinician must anticipate it in ALL and AML with high tumor burden (WBC >50x10^9/L, bulky disease, elevated LDH) by starting allopurinol or rasburicase prophylaxis and aggressive IV hydration before chemotherapy; rasburicase is preferred for established TLS (rapidly converts uric acid to allantoin)",
      "CML is a paradigm of targeted therapy - imatinib transformed CML from a fatal disease (median survival 3-5 years) to a chronic condition with near-normal life expectancy; the clinician must monitor BCR-ABL1 transcript levels at defined milestones and switch to second-generation TKI if response is suboptimal"
    ],
    "quiz": [
      {
        "question": "A 68-year-old male with newly diagnosed CML chronic phase has a WBC of 85x10^9/L with left-shifted granulocytes and basophilia. FISH confirms t(9;22) BCR-ABL1. What is the first-line treatment?",
        "options": [
          "Hydroxyurea to reduce WBC followed by allogeneic stem cell transplant",
          "Imatinib 400mg daily with BCR-ABL1 transcript monitoring at 3-month intervals",
          "Combination chemotherapy with cytarabine and daunorubicin (7+3 regimen)",
          "Watchful waiting until progression to accelerated phase"
        ],
        "correct": 1,
        "rationale": "First-line treatment for CML chronic phase is a tyrosine kinase inhibitor (imatinib, dasatinib, or nilotinib). Imatinib 400mg daily transformed CML prognosis with 10-year overall survival of 83%. Monitor BCR-ABL1 transcripts by qPCR at 3, 6, and 12 months to assess response milestones. Hydroxyurea may be used briefly for cytoreduction but is not definitive therapy. The 7+3 regimen is for AML. Watchful waiting is inappropriate for CML. Allogeneic SCT is reserved for TKI-resistant or blast crisis."
      }
    ]
  },
  "hematology-sickle-cell-np": {
    "title": "Sickle Cell Disease: Pathophysiology, Crisis Management, and Disease-Modifying Therapy",
    "cellular": {
      "title": "Hemoglobin S Polymerization and Vaso-Occlusion",
      "content": "Sickle cell disease (SCD) is an autosomal recessive hemoglobinopathy caused by a point mutation in the beta-globin gene (chromosome 11), substituting valine for glutamic acid at position 6 (HbS: beta-6 Glu->Val). Under deoxygenated conditions, HbS molecules polymerize into rigid, insoluble fibers that deform the erythrocyte into a sickled (crescent) shape. The rate of HbS polymerization depends on intracellular HbS concentration, degree of deoxygenation, pH, and 2,3-DPG levels. Sickled cells are rigid and adhesive, causing vaso-occlusion in the microvasculature through four mechanisms: (1) sickled RBC adhesion to vascular endothelium via VCAM-1, thrombospondin, and von Willebrand factor, (2) neutrophil-RBC interactions amplifying adhesion, (3) activation of the coagulation cascade with thrombin generation, and (4) endothelial dysfunction from chronic hemolysis releasing free hemoglobin that scavenges nitric oxide, producing a vasculopathy with pulmonary hypertension, stroke, and priapism. Chronic hemolysis (RBC lifespan 10-20 days vs normal 120 days) causes anemia (Hb 6-9 g/dL baseline), jaundice, pigment gallstones, and iron overload from transfusion therapy. Splenic autoinfarction by age 5 in HbSS produces functional asplenia with lifelong susceptibility to encapsulated organisms (Streptococcus pneumoniae, Haemophilus influenzae, Neisseria meningitidis)."
    },
    "riskFactors": [
      "Homozygous HbSS genotype (most severe clinical phenotype)",
      "HbSC disease (compound heterozygote: milder anemia but higher viscosity-related complications including retinopathy and AVN)",
      "HbS-beta-thalassemia (severity depends on beta-globin production: beta-zero = severe, beta-plus = milder)",
      "African, Mediterranean, Middle Eastern, South Asian, Caribbean ancestry (HbS carrier frequency 8-10% in African Americans)",
      "Dehydration, infection, cold exposure, altitude, and acidosis as VOC precipitants",
      "Pregnancy (increased maternal/fetal complications, higher VOC frequency)",
      "Surgical and anesthetic stress (perioperative crisis prevention requires Hb optimization)"
    ],
    "diagnostics": [
      "Newborn screening: hemoglobin electrophoresis or HPLC identifies HbFS pattern (SCD) at birth",
      "Hemoglobin electrophoresis: HbSS (SCD), HbSC, HbS-beta-thal patterns; confirms diagnosis and subtype",
      "CBC: chronic hemolytic anemia (Hb 6-9 g/dL), reticulocytosis (3-15%), leukocytosis, thrombocytosis",
      "Peripheral smear: sickled cells, target cells, Howell-Jolly bodies (functional asplenia), polychromasia",
      "Reticulocyte count: elevated at baseline; DECREASED reticulocyte count during aplastic crisis (parvovirus B19) is a red flag",
      "Transcranial Doppler (TCD) ultrasound annually age 2-16 for stroke risk stratification (TAMV >= 200 cm/s = high risk, initiate chronic transfusion)",
      "LDH, indirect bilirubin, haptoglobin for hemolysis markers; ferritin for iron overload monitoring in transfusion-dependent patients"
    ],
    "management": [
      "Hydroxyurea: first-line disease-modifying therapy for all SCD patients >= 9 months with HbSS or HbS-beta-zero (increases HbF production to 15-20%, reducing HbS polymerization)",
      "Chronic transfusion therapy: target HbS <30% for primary stroke prevention (TCD >= 200 cm/s) or secondary stroke prevention",
      "L-glutamine (Endari): FDA-approved adjunct that reduces oxidative stress in sickled RBCs, decreasing VOC frequency by 25%",
      "Voxelotor (Oxbryta): HbS polymerization inhibitor that increases Hb oxygen affinity, reducing sickling and improving Hb by ~1 g/dL",
      "Crizanlizumab (Adakveo): anti-P-selectin monoclonal antibody that blocks sickle cell-endothelial adhesion, reducing VOC frequency",
      "Acute VOC management: aggressive IV hydration (avoid over-hydration in ACS risk), IV opioid analgesia (PCA preferred), NSAIDs as adjunct, incentive spirometry every 2 hours (ACS prevention)",
      "Allogeneic stem cell transplant: only curative therapy; consider in children with recurrent severe VOC, stroke, or progressive organ damage with matched sibling donor"
    ],
    "signs": {
      "left": [
        "Baseline stable SCD: chronic hemolytic anemia (Hb 7-9 g/dL), mild jaundice, splenomegaly in early childhood",
        "Infrequent VOC with good response to hydroxyurea (HbF > 15%)",
        "Mild dactylitis (hand-foot syndrome) in infants as presenting feature",
        "Asymptomatic carrier (HbAS sickle cell trait): no treatment required, counsel regarding trait inheritance"
      ],
      "right": [
        "Acute chest syndrome: new pulmonary infiltrate + fever/chest pain/hypoxia (leading cause of death in adults with SCD - requires exchange transfusion if severe)",
        "Stroke: occurs in 11% of HbSS by age 20; acute ischemic stroke requires emergent exchange transfusion to HbS <30%",
        "Splenic sequestration crisis: acute splenomegaly with Hb drop >= 2 g/dL (life-threatening in children, requires urgent transfusion)",
        "Aplastic crisis: parvovirus B19 infection causing transient pure red cell aplasia (sudden Hb drop with absent reticulocytes)"
      ]
    },
    "medications": [
      {
        "name": "Hydroxyurea (Hydrea/Siklos)",
        "type": "Ribonucleotide Reductase Inhibitor / HbF Inducer",
        "action": "Inhibits ribonucleotide reductase reducing DNA synthesis, but therapeutic benefit in SCD primarily from reactivation of fetal hemoglobin (HbF) gene expression via stress erythropoiesis and nitric oxide-mediated signaling; HbF (alpha2-gamma2) cannot co-polymerize with HbS, directly inhibiting sickling",
        "sideEffects": "Myelosuppression (dose-limiting: monitor CBC every 4-8 weeks), nausea, skin hyperpigmentation, nail changes, leg ulcers, teratogenicity",
        "contra": "Pregnancy (teratogenic, effective contraception required), severe renal impairment (dose adjustment needed), severe myelosuppression",
        "pearl": "Start 15 mg/kg/day, titrate by 5 mg/kg every 8-12 weeks to maximum tolerated dose (target 25-35 mg/kg/day or ANC nadir 2.0-4.0 x10^9/L). BABY HUG trial demonstrated benefit starting at 9 months of age. MSH trial showed 44% reduction in painful crises, 58% reduction in ACS, and 40% reduction in transfusion need. Monitor CBC every 4-8 weeks during titration. Goal HbF > 15-20%. Takes 3-6 months for full clinical benefit."
      },
      {
        "name": "Crizanlizumab (Adakveo)",
        "type": "Anti-P-Selectin Monoclonal Antibody",
        "action": "Binds P-selectin on activated endothelial cells and platelets, preventing adhesion of sickled erythrocytes, leukocytes, and platelets to the vascular endothelium, thereby inhibiting the multicellular adhesion cascade that initiates vaso-occlusion",
        "sideEffects": "Infusion-related reactions, arthralgia, back pain, nausea, abdominal pain, pyrexia",
        "contra": "Known hypersensitivity to crizanlizumab, active severe infection",
        "pearl": "5 mg/kg IV at weeks 0 and 2, then every 4 weeks. SUSTAIN trial showed 45% reduction in annual VOC rate. Can be used as add-on to hydroxyurea or as alternative in patients who cannot tolerate hydroxyurea. Administer over 30 minutes. Monitor for infusion reactions during and for 1 hour after. Relatively new therapy (FDA-approved 2019) with growing real-world evidence."
      }
    ],
    "pearls": [
      "Acute chest syndrome (ACS) is the leading cause of death in adults with SCD and must be suspected in any SCD patient with fever, chest pain, cough, or hypoxia with a new pulmonary infiltrate - the clinician must initiate empiric antibiotics (ceftriaxone + azithromycin for atypical coverage), simple or exchange transfusion, supplemental oxygen, and incentive spirometry; every VOC patient must perform incentive spirometry every 2 hours to prevent ACS",
      "Transcranial Doppler screening annually from age 2-16 is the most important primary stroke prevention measure in SCD - a time-averaged mean velocity (TAMV) >= 200 cm/s in the middle cerebral or internal carotid artery identifies children at high stroke risk who benefit from chronic transfusion therapy to maintain HbS <30%",
      "Hydroxyurea is the most important disease-modifying therapy in SCD and should be offered to ALL patients with HbSS or HbS-beta-zero thalassemia beginning at 9 months of age regardless of clinical severity - it reduces VOC frequency, ACS incidence, transfusion need, and mortality; the clinician must titrate to maximum tolerated dose (not just starting dose) and allow 3-6 months for full clinical effect"
    ],
    "quiz": [
      {
        "question": "A 22-year-old male with HbSS sickle cell disease presents with fever 39.2C, chest pain, cough, and SpO2 88% on room air. He was admitted 2 days ago for a vaso-occlusive crisis affecting his lower back. CXR shows a new right lower lobe infiltrate. What is the priority management?",
        "options": [
          "Continue current IV opioid analgesia and add nebulized bronchodilators",
          "Initiate empiric antibiotics (ceftriaxone + azithromycin), supplemental oxygen, and arrange simple or exchange transfusion",
          "Discharge with oral antibiotics and outpatient follow-up in 1 week",
          "Order CT pulmonary angiography to rule out PE before any treatment"
        ],
        "correct": 1,
        "rationale": "This patient has acute chest syndrome (new pulmonary infiltrate + fever + chest pain + hypoxia during VOC admission). ACS is the leading cause of death in adult SCD. Management includes: empiric broad-spectrum antibiotics with atypical coverage (ceftriaxone + azithromycin), supplemental oxygen to maintain SpO2 > 95%, simple transfusion (target Hb 10 g/dL) or exchange transfusion if severe (SpO2 < 90%, rapidly progressive, multilobar). Incentive spirometry must continue. CTPA may be considered but should not delay treatment of ACS."
      }
    ]
  }
};
