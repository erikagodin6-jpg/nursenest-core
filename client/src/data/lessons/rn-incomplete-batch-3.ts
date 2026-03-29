import type { LessonContent } from "./types";

export const rnIncompleteBatch3Lessons: Record<string, LessonContent> = {
  "cushing-syndrome": {
    title: "Cushing Syndrome",
    cellular: { title: "Pathophysiology of Cushing Syndrome", content: "Cushing syndrome results from prolonged exposure to excess glucocorticoids (cortisol), either from exogenous administration (most common cause — iatrogenic from prednisone, dexamethasone) or endogenous overproduction. Endogenous causes include Cushing disease (ACTH-secreting pituitary adenoma, 70% of endogenous cases), ectopic ACTH syndrome (small cell lung cancer, carcinoid tumors, 15%), and adrenal tumors (adenoma or carcinoma, 15%). Excess cortisol causes widespread metabolic effects: gluconeogenesis and insulin resistance produce hyperglycemia; protein catabolism causes muscle wasting (proximal myopathy), skin thinning, easy bruising, and poor wound healing; fat redistribution creates central obesity, moon facies, dorsocervical fat pad (buffalo hump), and supraclavicular fat pads. Mineralocorticoid effects cause sodium and water retention (hypertension, edema) and potassium wasting (hypokalemia). Immune suppression increases infection risk. Cortisol excess also causes osteoporosis (osteoblast inhibition and calcium malabsorption), psychiatric manifestations (depression, psychosis, emotional lability), and menstrual irregularities. In adrenal Cushing syndrome, ACTH is suppressed (negative feedback). In pituitary or ectopic ACTH sources, ACTH is elevated. The RN monitors for metabolic complications, infection risk, and emotional changes while supporting diagnostic workup and treatment." },
    riskFactors: [
      "Chronic exogenous glucocorticoid therapy (most common cause — prednisone, dexamethasone, inhaled/topical steroids)",
      "Pituitary adenoma (Cushing disease — 70% of endogenous cases)",
      "Small cell lung cancer or bronchial carcinoid (ectopic ACTH production)",
      "Adrenal adenoma or adrenal carcinoma",
      "Multiple endocrine neoplasia type 1 (MEN1 — associated with pituitary adenomas)",
      "Female sex (Cushing disease is 5–8 times more common in women)",
      "Chronic alcohol use (pseudo-Cushing syndrome)"
    ],
    diagnostics: [
      "24-hour urinary free cortisol (elevated > 3× upper limit of normal is diagnostic)",
      "Late-night salivary cortisol (loss of normal diurnal variation — cortisol should be lowest at midnight)",
      "Low-dose dexamethasone suppression test (1 mg at 11 PM, check 8 AM cortisol — failure to suppress < 1.8 mcg/dL suggests Cushing syndrome)",
      "ACTH level: Low = adrenal source; High = pituitary or ectopic source",
      "High-dose dexamethasone suppression test: Suppression suggests pituitary adenoma (Cushing disease); no suppression suggests ectopic ACTH",
      "MRI of the pituitary (sella turcica) for pituitary adenoma identification",
      "CT of the adrenal glands for adrenal masses; CT chest for ectopic ACTH sources"
    ],
    management: [
      "Iatrogenic Cushing: Gradual corticosteroid taper (never abrupt discontinuation — risk of adrenal crisis); use lowest effective dose",
      "Cushing disease (pituitary adenoma): Transsphenoidal surgery (first-line, 65–90% cure rate)",
      "Adrenal adenoma/carcinoma: Adrenalectomy (laparoscopic for benign; open for carcinoma)",
      "Ectopic ACTH: Treat the primary tumor (surgical resection, chemotherapy for SCLC)",
      "Medical therapy for cortisol reduction: Ketoconazole, metyrapone, or mifepristone (RU-486, cortisol receptor blocker)",
      "Monitor and manage metabolic complications: Blood glucose control (insulin may be needed), treat hypertension, replace potassium",
      "Osteoporosis prevention and treatment: Calcium, vitamin D, bisphosphonates; DEXA scan for bone density monitoring"
    ],
    nursingActions: [
      "Monitor blood glucose every 4–6 hours (cortisol-induced insulin resistance causes hyperglycemia); administer insulin as prescribed",
      "Monitor blood pressure at least every 4 hours; administer antihypertensives as prescribed",
      "Assess for signs of infection (cortisol suppresses immune function and masks inflammatory signs — fever may be absent)",
      "Implement fall precautions due to proximal muscle weakness, osteoporosis risk, and potential fractures",
      "Protect fragile skin: Avoid adhesive tape when possible, handle extremities gently, assess for bruising and skin tears",
      "Monitor intake and output, daily weight; assess for edema from sodium and water retention",
      "Provide psychosocial support for body image changes (moon facies, truncal obesity, striae, hirsutism) and mood disturbances"
    ],
    assessmentFindings: [
      "Characteristic body habitus: Central/truncal obesity, moon facies, buffalo hump, supraclavicular fat pads with thin extremities (muscle wasting)",
      "Purple/violaceous striae (stretch marks) > 1 cm wide on abdomen, thighs, breasts (distinguished from normal striae by purple color and width)",
      "Easy bruising, thin fragile skin, poor wound healing",
      "Proximal muscle weakness (difficulty rising from chair, climbing stairs)",
      "Hypertension, peripheral edema, weight gain",
      "Hirsutism, acne, and menstrual irregularities in women",
      "Emotional lability, depression, insomnia, or psychosis"
    ],
    signs: {
      left: [
        "Mild cushingoid features from low-dose chronic steroid therapy",
        "Mild hyperglycemia responsive to dietary modification",
        "Early osteopenia on DEXA scan without fractures",
        "Mild proximal weakness without functional limitation",
        "Stable mood with mild emotional lability"
      ],
      right: [
        "Severe Cushing syndrome with uncontrolled diabetes, hypertension, and active infections",
        "Pathologic fractures from severe osteoporosis",
        "Acute psychosis or suicidal ideation from cortisol excess",
        "Adrenal carcinoma with virilization and rapid onset",
        "Cushing syndrome with hypokalemia and metabolic alkalosis from ectopic ACTH"
      ]
    },
    medications: [
      {
        name: "Ketoconazole",
        type: "Azole antifungal / steroidogenesis inhibitor",
        action: "Inhibits cytochrome P450 enzymes involved in cortisol synthesis (particularly 11β-hydroxylase and 17,20-lyase), reducing cortisol production from the adrenal glands",
        sideEffects: "Hepatotoxicity (monitor LFTs every 2 weeks initially), nausea, vomiting, gynecomastia (inhibits testosterone synthesis), adrenal insufficiency (if cortisol suppressed too much)",
        contra: "Liver disease or elevated liver enzymes, concurrent use with drugs metabolized by CYP3A4 (multiple drug interactions), pregnancy (teratogenic)",
        pearl: "Used as medical therapy to reduce cortisol levels in Cushing syndrome when surgery is not feasible or as a bridge to surgery; typical dose 200–400 mg BID; monitor LFTs every 2 weeks for the first 2 months; check morning cortisol to avoid over-suppression"
      }
    ],
    pearls: [
      "Exogenous (iatrogenic) glucocorticoid therapy is the MOST common cause of Cushing syndrome — always ask about ALL steroid use including inhalers, topical creams, and joint injections",
      "Purple striae > 1 cm wide are highly specific for Cushing syndrome and distinguish it from normal stretch marks (which are typically white or pink and narrower)",
      "Never abruptly discontinue chronic corticosteroids — the suppressed HPA axis cannot respond to stress, and adrenal crisis (acute adrenal insufficiency) can be fatal",
      "Late-night salivary cortisol is the most convenient screening test — normal cortisol has a diurnal pattern with the lowest levels at midnight; loss of this pattern is an early finding",
      "Cushing syndrome causes immunosuppression — patients are at high risk for opportunistic infections, and classic inflammatory signs (fever, redness, swelling) may be blunted or absent",
      "Post-operative (after tumor removal): Monitor for acute adrenal insufficiency — the contralateral adrenal gland may be suppressed and take months to recover; patients need stress-dose steroids"
    ],
    quiz: [
      {
        question: "A patient taking prednisone 40 mg daily for 3 months develops moon facies, truncal obesity, and purple abdominal striae. The patient wants to stop the medication immediately. What should the RN teach?",
        options: ["It is safe to stop prednisone abruptly since the cause is identified", "The prednisone must be tapered gradually to prevent adrenal crisis from HPA axis suppression", "Switch to an equivalent dose of hydrocortisone immediately", "Stop the prednisone and start ketoconazole as a replacement"],
        correct: 1,
        rationale: "Chronic exogenous corticosteroid use suppresses the hypothalamic-pituitary-adrenal (HPA) axis. Abrupt discontinuation can cause adrenal crisis (acute adrenal insufficiency) with cardiovascular collapse. The dose must be gradually tapered over weeks to allow the adrenal glands to resume normal cortisol production."
      },
      {
        question: "Which assessment finding is MOST specific to Cushing syndrome and distinguishes it from simple obesity?",
        options: ["Elevated BMI > 30 kg/m²", "Wide purple striae > 1 cm on the abdomen", "Elevated fasting blood glucose", "Hypertension"],
        correct: 1,
        rationale: "Wide (> 1 cm) purple/violaceous striae are highly specific for Cushing syndrome. They result from cortisol-induced protein catabolism that thins the skin and allows underlying blood vessels to show through the weakened connective tissue. Simple obesity produces narrower, white or pink stretch marks. Elevated BMI, hyperglycemia, and hypertension are nonspecific."
      },
      {
        question: "A patient with Cushing syndrome has a wound that is not healing. The patient asks why this is happening. What is the BEST explanation?",
        options: ["Excess cortisol breaks down protein and suppresses the immune system, which impairs the body's ability to heal wounds", "The wound is likely infected because of diabetes", "Poor nutrition from the disease is causing delayed healing", "The medications used to treat Cushing syndrome slow wound healing"],
        correct: 0,
        rationale: "Excess cortisol causes protein catabolism (breaking down tissue proteins needed for wound repair), thins the skin, and suppresses the inflammatory response necessary for wound healing. The immune suppression also increases infection risk, further impeding healing. This is a direct effect of hypercortisolism."
      }
    ]
  },
  "acute-chest-syndrome-in-sickle-cell-rn": {
    title: "Acute Chest Syndrome in Sickle Cell Disease for Registered Nurses",
    cellular: { title: "Pathophysiology of Acute Chest Syndrome", content: "Acute chest syndrome (ACS) is a life-threatening complication of sickle cell disease (SCD) defined by a new pulmonary infiltrate on chest X-ray involving at least one complete lung segment, accompanied by one or more of: chest pain, fever (≥ 38.5°C), or respiratory symptoms (cough, tachypnea, dyspnea, wheezing, hypoxemia). ACS is the leading cause of death and the second most common reason for hospitalization in SCD. The pathophysiology involves a vicious cycle: sickling of red blood cells in the pulmonary vasculature causes vaso-occlusion, leading to regional hypoxia, inflammation, and further sickling. Three main mechanisms contribute: (1) pulmonary fat embolism from infarcted bone marrow (most common cause in adults — bone marrow necrosis releases fat droplets into the venous circulation that lodge in pulmonary capillaries), (2) infection (most common cause in children — Streptococcus pneumoniae, Mycoplasma pneumoniae, Chlamydia pneumoniae, respiratory viruses), and (3) in situ thrombosis from sickling in pulmonary vessels. The inflammatory cascade releases phospholipase A2, which converts lecithin in fat emboli to free fatty acids that are directly toxic to the pulmonary endothelium. This causes increased vascular permeability, pulmonary edema, and ARDS-like pathology. Hypoventilation from chest wall pain (rib infarction, splinting) contributes by causing atelectasis, which worsens V/Q mismatch and hypoxemia, promoting further sickling in a self-perpetuating cycle." },
    riskFactors: [
      "Sickle cell disease (HbSS genotype has highest risk; HbSC and HbSβ-thalassemia also at risk)",
      "History of previous ACS episodes (strongest predictor of recurrence)",
      "Vaso-occlusive pain crisis (ACS develops in 10–20% of patients hospitalized for VOC, often 2–3 days after admission)",
      "Post-operative patients with SCD (especially after abdominal or orthopedic surgery)",
      "Respiratory infections: pneumonia, influenza, RSV, Mycoplasma",
      "Higher baseline hemoglobin and lower HbF levels (increased sickling tendency)",
      "Asthma (coexisting asthma increases ACS risk and severity)"
    ],
    diagnostics: [
      "Chest X-ray: New pulmonary infiltrate involving at least one complete lung segment (lower lobes most common; multilobar involvement indicates severe ACS)",
      "Arterial blood gas or pulse oximetry: Assess oxygenation (PaO2 < 60 mmHg or SpO2 < 92% indicates severe hypoxemia)",
      "Complete blood count: Evaluate for hemoglobin drop (> 2 g/dL decrease from baseline suggests hemolysis or sequestration), reticulocyte count, platelet count",
      "Blood cultures and sputum culture: Identify infectious cause",
      "Serum phospholipase A2 (sPLA2): Elevated levels predict ACS development up to 48 hours before radiographic changes",
      "LDH, bilirubin, reticulocyte count: Hemolysis markers (elevated LDH and bilirubin with reticulocytosis indicate active hemolysis)",
      "CT angiography if pulmonary embolism is suspected (ACS and PE can coexist)"
    ],
    management: [
      "Supplemental oxygen to maintain SpO2 ≥ 95% (nasal cannula, face mask, HFNC, or mechanical ventilation as needed)",
      "Incentive spirometry every 1–2 hours while awake (CRITICAL — prevents atelectasis that triggers the sickling cycle; 10 breaths per session)",
      "Simple or exchange transfusion: Simple transfusion to raise Hgb to 10 g/dL (do NOT exceed 10 g/dL — viscosity increases); exchange transfusion for severe ACS (target HbS < 30%)",
      "Empiric antibiotics covering typical and atypical organisms: ceftriaxone + azithromycin (or fluoroquinolone)",
      "Pain management: Multimodal approach — IV opioids (morphine or hydromorphone) with scheduled dosing; avoid meperidine (lowers seizure threshold); NSAID adjunct (ketorolac); PCA if needed",
      "IV fluid hydration at maintenance rate (avoid overhydration — excess fluids worsen pulmonary edema); 1–1.5× maintenance rate",
      "Bronchodilators (albuterol) if wheezing is present; consider inhaled corticosteroids but avoid systemic steroids (may trigger rebound VOC)"
    ],
    nursingActions: [
      "Monitor respiratory status every 1–2 hours: respiratory rate, depth, effort, breath sounds, SpO2; report SpO2 < 92% or worsening respiratory status immediately",
      "Implement aggressive incentive spirometry: instruct patient to perform 10 breaths every 1–2 hours while awake; document compliance (this is the single most effective preventive intervention)",
      "Administer oxygen to maintain SpO2 ≥ 95%; titrate delivery method as needed (NC → mask → HFNC → NIV → intubation)",
      "Manage pain aggressively while monitoring respiratory status: pain from chest wall infarction causes splinting and shallow breathing, which worsens atelectasis; balance analgesia with respiratory drive",
      "Monitor hemoglobin levels every 6–12 hours: report drop > 1 g/dL; prepare for transfusion when ordered; follow institutional protocol for SCD transfusion matching (extended antigen matching to prevent alloimmunization)",
      "Administer IV fluids at prescribed rate: monitor for fluid overload (crackles, JVD, weight gain) — avoid overhydration which worsens pulmonary edema",
      "Monitor for clinical deterioration: increasing oxygen requirements, multilobar infiltrates on CXR, need for ICU transfer"
    ],
    assessmentFindings: [
      "Chest pain (pleuritic, often bilateral), cough, tachypnea, dyspnea",
      "Fever ≥ 38.5°C (may indicate infectious etiology)",
      "Hypoxemia: SpO2 < 95% or declining from baseline",
      "Decreased breath sounds, crackles, or wheezing on auscultation",
      "New pulmonary infiltrate on chest X-ray (often lower lobes)",
      "Hemoglobin drop from baseline (active hemolysis or splenic sequestration)",
      "Tachycardia and increased work of breathing indicating respiratory distress"
    ],
    signs: {
      left: [
        "Single lobe infiltrate with mild hypoxemia responding to NC oxygen",
        "Fever with productive cough and stable hemoglobin",
        "Pain controlled with oral analgesics and IS compliance maintained",
        "SpO2 93–95% on 2–4 L/min NC",
        "Improving clinically within 24–48 hours of treatment"
      ],
      right: [
        "Multilobar infiltrates with severe hypoxemia (SpO2 < 85% on high-flow oxygen)",
        "Rapid hemoglobin drop requiring emergent exchange transfusion",
        "Respiratory failure requiring intubation and mechanical ventilation",
        "ARDS-like picture with bilateral white-out on CXR",
        "Multi-organ failure: ACS + hepatic sequestration crisis + AKI"
      ]
    },
    medications: [
      {
        name: "Hydroxyurea",
        type: "Antimetabolite (ribonucleotide reductase inhibitor)",
        action: "Increases fetal hemoglobin (HbF) production, which inhibits HbS polymerization and sickling; reduces WBC and platelet counts (decreasing adhesion and vaso-occlusion); increases NO production improving blood flow",
        sideEffects: "Myelosuppression (neutropenia, thrombocytopenia, anemia — monitor CBC every 4–8 weeks), teratogenicity, leg ulcers (rare), skin hyperpigmentation, nail changes",
        contra: "Pregnancy (teratogenic), severe myelosuppression, severe renal impairment (dose adjust), unwillingness to use contraception",
        pearl: "First-line disease-modifying therapy for SCD to prevent ACS recurrence; starting dose 15 mg/kg/day, titrate to maximum tolerated dose (target MCV rise indicates HbF increase); reduces ACS episodes by 50%; monitor CBC every 4–8 weeks during dose adjustment"
      }
    ],
    pearls: [
      "Incentive spirometry is the SINGLE most important preventive nursing intervention for ACS — 10 breaths every 1–2 hours while awake dramatically reduces atelectasis and prevents the sickling cascade",
      "ACS often develops 2–3 days AFTER admission for a vaso-occlusive crisis — maintain vigilance throughout the hospitalization, not just at admission",
      "Do NOT transfuse hemoglobin above 10 g/dL in SCD — higher hemoglobin increases blood viscosity, worsening vaso-occlusion and increasing stroke risk",
      "Avoid meperidine (Demerol) in SCD patients — the metabolite normeperidine accumulates and lowers the seizure threshold; use morphine or hydromorphone instead",
      "Fat embolism from bone marrow necrosis is the most common cause of ACS in adults — it causes a 24–72 hour lag between VOC onset and ACS development",
      "Exchange transfusion (rather than simple transfusion) is preferred for severe ACS because it rapidly reduces HbS percentage without increasing viscosity; target HbS < 30%"
    ],
    quiz: [
      {
        question: "A patient with sickle cell disease is admitted for a vaso-occlusive crisis. On hospital day 3, the patient develops fever, cough, and new left lower lobe infiltrate on chest X-ray with SpO2 of 90%. What does the RN recognize?",
        options: ["Expected progression of vaso-occlusive crisis", "Acute chest syndrome requiring immediate intervention", "Community-acquired pneumonia unrelated to SCD", "Atelectasis from bed rest requiring incentive spirometry only"],
        correct: 1,
        rationale: "New pulmonary infiltrate + respiratory symptoms (cough) + fever + hypoxemia in a SCD patient = acute chest syndrome. ACS commonly develops 2–3 days after admission for VOC. This requires immediate intervention: oxygen, empiric antibiotics, transfusion evaluation, pain management, and aggressive incentive spirometry."
      },
      {
        question: "A patient with ACS has hemoglobin of 6.2 g/dL (baseline 8.5 g/dL). What is the appropriate transfusion target?",
        options: ["Transfuse to hemoglobin 12 g/dL", "Transfuse to hemoglobin 10 g/dL", "Do not exceed hemoglobin 10 g/dL to avoid hyperviscosity", "Transfuse only packed RBCs without matching"],
        correct: 2,
        rationale: "In SCD, hemoglobin should NOT exceed 10 g/dL because higher levels increase blood viscosity, worsening vaso-occlusion and increasing stroke risk. Extended antigen-matched RBCs should be used to prevent alloimmunization (SCD patients frequently receive transfusions and are at high risk for developing antibodies)."
      },
      {
        question: "Which nursing intervention is MOST effective in preventing acute chest syndrome in a hospitalized SCD patient?",
        options: ["Strict bed rest to conserve energy", "Aggressive incentive spirometry every 1–2 hours while awake", "Prophylactic blood transfusion on admission", "Continuous oxygen therapy via non-rebreather mask"],
        correct: 1,
        rationale: "Incentive spirometry is the most effective nursing intervention for preventing ACS. It prevents atelectasis, which causes regional hypoxia and triggers the sickling cascade. Studies show that aggressive IS use (10 breaths every 1–2 hours) significantly reduces ACS development in patients hospitalized for VOC."
      }
    ]
  },
  "acute-hemolytic-transfusion-reaction-for-registered-rn": {
    title: "Acute Hemolytic Transfusion Reaction for Registered Nurses",
    cellular: { title: "Pathophysiology of Acute Hemolytic Transfusion Reaction", content: "An acute hemolytic transfusion reaction (AHTR) is a life-threatening immunologic emergency caused by the rapid destruction of transfused red blood cells by preformed recipient antibodies, most commonly due to ABO incompatibility (the most dangerous and preventable transfusion error). When ABO-incompatible RBCs enter the recipient's circulation, naturally occurring IgM anti-A or anti-B antibodies immediately bind to the incompatible antigens on the transfused cells, activating the classical complement cascade (C1-C9). Complement activation leads to formation of the membrane attack complex (MAC, C5b-C9) on the transfused RBC surface, causing intravascular hemolysis — the direct lysis of RBCs within the bloodstream, releasing free hemoglobin, potassium, and cellular debris. Free hemoglobin saturates haptoglobin binding capacity and is filtered by the kidneys, causing hemoglobinuria (dark/red/brown urine) and acute tubular necrosis from hemoglobin cast deposition. The massive complement activation also triggers a systemic inflammatory response with cytokine release (IL-1, IL-6, TNF-alpha), causing fever, hypotension, and activation of the coagulation cascade leading to disseminated intravascular coagulation (DIC). DIC consumes clotting factors and platelets, causing simultaneous thrombosis and hemorrhage. Renal failure results from both hemoglobin-induced tubular toxicity and hypotension-related ischemia. Death can occur from cardiovascular collapse, DIC, acute renal failure, or multi-organ dysfunction. As few as 10–15 mL of incompatible blood can trigger a fatal reaction." },
    riskFactors: [
      "ABO blood type mismatch (most common cause — usually from identification or labeling errors)",
      "Failure to properly identify the patient before transfusion (wrong patient receives wrong blood)",
      "Mislabeled blood samples sent to the blood bank",
      "Inadequate crossmatch or clerical errors in the blood bank",
      "Multiple previous transfusions with alloantibody development",
      "Sickle cell disease patients with multiple alloantibodies from frequent transfusions",
      "Emergency situations where verification procedures may be rushed"
    ],
    diagnostics: [
      "Immediate: Stop the transfusion, maintain IV access with normal saline, save the blood bag and tubing",
      "Direct antiglobulin test (direct Coombs test): Positive — detects antibodies coating the transfused RBCs",
      "Repeat ABO/Rh typing and crossmatch on both the patient sample and the blood unit",
      "Serum free hemoglobin (elevated from intravascular hemolysis)",
      "Urinalysis: Hemoglobinuria (red/brown urine positive for blood but no RBCs on microscopy)",
      "DIC panel: PT, PTT, fibrinogen (decreased), D-dimer (elevated), platelet count (decreased)",
      "Renal function: BUN, creatinine (monitor for acute kidney injury); serum potassium (hyperkalemia from RBC lysis)",
      "Serum LDH (markedly elevated), indirect bilirubin (elevated), haptoglobin (undetectable)"
    ],
    management: [
      "STOP THE TRANSFUSION IMMEDIATELY upon first suspicion of a hemolytic reaction",
      "Maintain IV access with 0.9% NS (do NOT use LR or dextrose solutions through the same line used for blood)",
      "Aggressive IV fluid resuscitation (200–300 mL/hr NS) to maintain urine output > 100 mL/hr and prevent renal failure from hemoglobin deposition",
      "Administer IV furosemide if ordered to maintain urine output; mannitol may be used for renal protection",
      "Monitor for and manage DIC: Administer fresh frozen plasma, cryoprecipitate, and platelet transfusions as needed",
      "Vasopressor support (norepinephrine) for refractory hypotension",
      "Dialysis for oliguric renal failure unresponsive to fluid resuscitation"
    ],
    nursingActions: [
      "STOP THE TRANSFUSION at the first sign of a reaction: disconnect the blood product from the IV line; keep the IV line open with NS",
      "Verify patient identification against the blood product label at the bedside (most AHTRs result from patient/sample identification errors)",
      "Notify the physician and blood bank IMMEDIATELY; send the blood bag, tubing, and post-reaction blood and urine samples to the lab",
      "Monitor vital signs every 5–15 minutes: temperature, blood pressure, heart rate, respiratory rate, SpO2",
      "Assess urine output and color hourly: Insert Foley catheter; hemoglobinuria (dark red/brown urine) confirms intravascular hemolysis; target output > 100 mL/hr",
      "Monitor for DIC: Assess for bleeding from IV sites, mucous membranes, surgical sites; monitor coagulation studies",
      "Document the transfusion reaction: Volume infused, time of reaction onset, signs and symptoms, interventions performed, patient response, all physician notifications"
    ],
    assessmentFindings: [
      "Fever and chills (often the FIRST symptom — temperature rise > 1°C during or shortly after transfusion)",
      "Low back pain or flank pain (from renal capsule distension as hemoglobin is filtered)",
      "Chest tightness, dyspnea, tachycardia, hypotension (cardiovascular collapse in severe reactions)",
      "Hemoglobinuria: Dark red, brown, or cola-colored urine",
      "Burning or pain at the IV infusion site",
      "Anxiety, feeling of 'impending doom'",
      "In anesthetized patients: Unexplained hypotension, tachycardia, hemoglobinuria, and diffuse oozing from surgical sites (DIC) may be the only signs"
    ],
    signs: {
      left: [
        "Mild fever (< 1°C rise) with no other symptoms (may be febrile non-hemolytic reaction rather than AHTR — still requires stopping transfusion and investigation)",
        "Transient chills without hemodynamic instability",
        "Urticaria without systemic symptoms (allergic reaction, not hemolytic)"
      ],
      right: [
        "Fever with rigors, back pain, hypotension, and dark urine (classic AHTR presentation)",
        "Cardiovascular collapse with refractory hypotension requiring vasopressors",
        "DIC with bleeding from multiple sites",
        "Acute oliguric renal failure requiring dialysis",
        "Cardiac arrest from hyperkalemia (massive intravascular hemolysis releases potassium)"
      ]
    },
    medications: [
      {
        name: "Furosemide",
        type: "Loop diuretic",
        action: "Promotes rapid diuresis to flush hemoglobin from renal tubules and prevent acute tubular necrosis; maintains urine output > 100 mL/hr",
        sideEffects: "Hypokalemia, hypomagnesemia, hypotension (in already hemodynamically compromised patient), metabolic alkalosis, dehydration",
        contra: "Anuria (if kidneys have already shut down, diuretics are ineffective), severe hypovolemia (must fluid resuscitate first)",
        pearl: "Given as part of aggressive renal protection strategy after adequate IV fluid resuscitation is initiated; typical dose 40–80 mg IV; goal urine output > 100 mL/hr to prevent hemoglobin cast formation; always replace potassium during forced diuresis; mannitol (25 g IV) is an alternative osmotic diuretic"
      }
    ],
    pearls: [
      "The MOST important prevention strategy is proper patient identification: verify patient identity with TWO identifiers (name and DOB or MRN) against the blood product label with a second nurse at the bedside BEFORE starting the transfusion",
      "As little as 10–15 mL of incompatible blood can trigger a fatal hemolytic reaction — stop the transfusion at the FIRST sign of a reaction",
      "Back/flank pain during a transfusion is a RED FLAG for AHTR — it occurs from renal capsule distension as hemoglobin precipitates in the tubules",
      "Stay with the patient for the first 15 minutes of any blood transfusion — most severe reactions occur within the first 50 mL (first 15 minutes)",
      "Hemoglobinuria (red/brown urine positive for blood on dipstick but no intact RBCs on microscopy) distinguishes intravascular hemolysis from hematuria",
      "In anesthetized patients, AHTR presents atypically: unexplained hypotension, tachycardia, hemoglobinuria, and diffuse oozing from the surgical field (DIC onset)"
    ],
    quiz: [
      {
        question: "Ten minutes after starting a packed RBC transfusion, a patient develops fever, chills, low back pain, and hypotension. What is the RN's FIRST action?",
        options: ["Slow the transfusion rate and administer diphenhydramine", "Stop the transfusion immediately, maintain IV access with NS, and notify the physician", "Administer acetaminophen for the fever and continue monitoring", "Increase the IV fluid rate through the same line as the blood product"],
        correct: 1,
        rationale: "These symptoms (fever, chills, back pain, hypotension) are classic for AHTR. The first action is to STOP the transfusion immediately to prevent further introduction of incompatible blood. Maintain IV access with NS (new tubing — not through the blood tubing). Never slow a transfusion rate for a suspected hemolytic reaction — stop it completely."
      },
      {
        question: "After stopping a blood transfusion for a suspected hemolytic reaction, which action is essential for the investigation?",
        options: ["Discard the blood bag in biohazard waste immediately", "Send the blood bag, tubing, and post-reaction blood and urine samples to the blood bank", "Restart the transfusion at a slower rate after 30 minutes", "Administer the next unit of blood that was already crossmatched"],
        correct: 1,
        rationale: "The blood bag, all attached tubing, and post-reaction patient samples (blood for repeat type and crossmatch, direct Coombs test, and a urine sample) must be sent to the blood bank for investigation. The blood bank will verify the unit identity, repeat the crossmatch, and perform serologic testing to confirm the reaction type."
      },
      {
        question: "Why is maintaining urine output > 100 mL/hr critical after an acute hemolytic transfusion reaction?",
        options: ["To monitor for urinary tract infection", "To flush free hemoglobin from the renal tubules and prevent acute tubular necrosis", "To assess for blood type antibodies in the urine", "To prevent hypernatremia from IV fluid administration"],
        correct: 1,
        rationale: "Intravascular hemolysis releases free hemoglobin that is filtered by the kidneys and can precipitate in the renal tubules, forming hemoglobin casts that obstruct flow and cause acute tubular necrosis (ATN). High urine output (> 100 mL/hr) maintained by aggressive IV fluids and diuretics flushes hemoglobin through the tubules before it can precipitate and cause damage."
      }
    ]
  },
  "disseminated-intravascular-coagulation-advanced-rn": {
    title: "Disseminated Intravascular Coagulation (Advanced)",
    cellular: { title: "Pathophysiology of DIC", content: "Disseminated intravascular coagulation (DIC) is a life-threatening consumptive coagulopathy characterized by the simultaneous activation of coagulation and fibrinolysis, leading to paradoxical bleeding and thrombosis. DIC is ALWAYS secondary to an underlying condition — it is never a primary disease. The most common triggers include sepsis (most common cause in adults), obstetric emergencies (placental abruption, amniotic fluid embolism, eclampsia), malignancy (acute promyelocytic leukemia, mucin-secreting adenocarcinomas), massive trauma, and transfusion reactions. The pathophysiology begins with systemic activation of the coagulation cascade by tissue factor (TF) release from damaged endothelium, activated monocytes, or tumor cells. Tissue factor binds factor VII, triggering the extrinsic pathway and generating massive thrombin production. Thrombin converts fibrinogen to fibrin, which deposits as microthrombi throughout the microvasculature, causing ischemic organ damage (kidneys, brain, liver, lungs). Simultaneously, the consumption of clotting factors (I, V, VIII, X, XIII), platelets, and natural anticoagulants (protein C, antithrombin) depletes the coagulation system, causing hemorrhage. Secondary fibrinolysis activates plasmin, which degrades fibrin clots into fibrin degradation products (FDPs) and D-dimers. These FDPs further inhibit coagulation by interfering with fibrin polymerization and platelet function, worsening the bleeding diathesis. The net result is a vicious cycle of microthrombi formation with end-organ ischemia and simultaneous hemorrhage from clotting factor depletion." },
    riskFactors: [
      "Sepsis and severe infection (most common cause of DIC in adults — bacterial endotoxins trigger TF release)",
      "Obstetric emergencies: placental abruption, amniotic fluid embolism, eclampsia, HELLP syndrome, retained products of conception",
      "Malignancy: Acute promyelocytic leukemia (APL — DIC at diagnosis in 80%), mucin-secreting adenocarcinomas (pancreatic, ovarian, gastric)",
      "Massive trauma with extensive tissue injury and crush injuries",
      "ABO-incompatible transfusion reaction",
      "Burns covering > 30% total body surface area",
      "Envenomation (certain snake bites) and heatstroke"
    ],
    diagnostics: [
      "Platelet count: Decreased (< 100,000) from consumption — serial counts showing downward trend are especially concerning",
      "PT/INR and aPTT: Prolonged from clotting factor consumption",
      "Fibrinogen level: Decreased (< 150 mg/dL in acute DIC; may be normal early due to acute phase response)",
      "D-dimer: Markedly elevated (reflects ongoing fibrin degradation); most sensitive marker",
      "Fibrin degradation products (FDPs): Elevated",
      "Peripheral blood smear: Schistocytes (fragmented RBCs) from microangiopathic hemolytic anemia — RBCs sheared by fibrin strands in microvasculature",
      "ISTH DIC scoring system: Platelet count, D-dimer, PT prolongation, fibrinogen — score ≥ 5 indicates overt DIC"
    ],
    management: [
      "TREAT THE UNDERLYING CAUSE — this is the most critical intervention (antibiotics for sepsis, delivery for obstetric DIC, chemotherapy for malignancy, ATRA for APL)",
      "Replace consumed blood products: Fresh frozen plasma (FFP) for clotting factor replacement (PT/INR > 1.5), cryoprecipitate for fibrinogen < 100 mg/dL (each unit raises fibrinogen ~5–10 mg/dL), platelet transfusion for platelets < 20,000 or < 50,000 with active bleeding",
      "Packed RBC transfusion for hemoglobin < 7 g/dL or active hemorrhage with hemodynamic instability",
      "Heparin anticoagulation: Considered ONLY in specific DIC presentations (chronic DIC, thrombosis-predominant DIC, solid tumor DIC); contraindicated in acute hemorrhagic DIC",
      "Antithrombin III concentrate may be considered in sepsis-associated DIC with very low AT levels",
      "Supportive care: Hemodynamic stabilization with IV fluids and vasopressors, oxygen supplementation, organ-specific support (dialysis for AKI, ventilatory support for ARDS)",
      "Tranexamic acid (antifibrinolytic) only if fibrinolysis predominates — use with extreme caution (may worsen thrombosis)"
    ],
    nursingActions: [
      "Monitor for BOTH bleeding AND thrombosis simultaneously — DIC causes paradoxical presentation of both",
      "Assess all body surfaces for bleeding: IV sites, wound sites, gum bleeding, epistaxis, petechiae, purpura, ecchymoses, hematuria, melena, hematemesis",
      "Assess for thrombotic complications: altered mental status (cerebral microthrombi), oliguria (renal microthrombi), acrocyanosis (peripheral microthrombi in digits), dyspnea (pulmonary microthrombi)",
      "Minimize invasive procedures: avoid IM injections, rectal temperatures, unnecessary venipunctures; use smallest gauge needles possible; apply pressure to puncture sites for 5+ minutes",
      "Monitor serial coagulation studies every 4–6 hours: platelet count, PT/INR, aPTT, fibrinogen, D-dimer; report trends to the healthcare team",
      "Administer blood products as prescribed: FFP for factor replacement, cryoprecipitate for fibrinogen < 100 mg/dL, platelets for thrombocytopenia with bleeding",
      "Maintain hemodynamic monitoring: arterial line for continuous BP, strict I&O, assess urine for hematuria, monitor for signs of organ failure"
    ],
    assessmentFindings: [
      "Bleeding from multiple sites simultaneously: IV sites, wound sites, mucosal surfaces (gums, nose, GI tract, urinary tract)",
      "Petechiae, purpura, and ecchymoses (skin manifestations of thrombocytopenia and coagulopathy)",
      "Acrocyanosis: Cyanosis and ischemia of fingers, toes, ears, and nose from microthrombi",
      "Altered mental status from cerebral microthrombi or hemorrhage",
      "Oliguria or anuria from renal microthrombi and ischemia",
      "Dyspnea and hypoxemia from pulmonary microthrombi",
      "Hemodynamic instability: tachycardia, hypotension, signs of hypovolemic shock from hemorrhage"
    ],
    signs: {
      left: [
        "Mildly elevated D-dimer with normal platelet count and fibrinogen (early or compensated DIC)",
        "Minor oozing from IV sites without hemodynamic compromise",
        "Chronic DIC with slowly declining platelet count in stable malignancy patient",
        "Laboratory abnormalities improving with treatment of underlying cause"
      ],
      right: [
        "Massive hemorrhage from multiple sites with hemodynamic collapse",
        "ISTH DIC score ≥ 5 with rapidly declining platelet count and fibrinogen",
        "Multi-organ failure: AKI, ARDS, hepatic failure from microthrombi",
        "Acrocyanosis with gangrenous changes in digits (purpura fulminans)",
        "Obstetric DIC with postpartum hemorrhage unresponsive to uterotonics"
      ]
    },
    medications: [
      {
        name: "Cryoprecipitate",
        type: "Blood product (concentrated fibrinogen and factor VIII)",
        action: "Provides concentrated fibrinogen (150–250 mg per unit), factor VIII, von Willebrand factor, factor XIII, and fibronectin to replace consumed coagulation proteins",
        sideEffects: "Allergic reactions, febrile reactions, transfusion-transmitted infections (extremely rare with current screening), volume overload",
        contra: "No absolute contraindications in life-threatening DIC with fibrinogen < 100 mg/dL; use ABO-compatible products when possible",
        pearl: "Indicated when fibrinogen < 100 mg/dL (or < 150 mg/dL with active bleeding); typical dose 10 units (pooled) raises fibrinogen by approximately 50–100 mg/dL; administer through a blood filter; recheck fibrinogen 30–60 minutes after infusion; target fibrinogen > 150 mg/dL"
      }
    ],
    pearls: [
      "DIC is ALWAYS secondary to an underlying cause — treating the underlying condition is the MOST important intervention; component therapy buys time but does not fix the problem",
      "The classic DIC paradox: the patient bleeds AND clots simultaneously — assess for BOTH hemorrhagic and thrombotic manifestations",
      "D-dimer is the most sensitive laboratory marker for DIC but is not specific (elevated in many conditions); the ISTH scoring system (platelets, D-dimer, PT, fibrinogen) provides standardized diagnosis",
      "Schistocytes on peripheral blood smear indicate microangiopathic hemolytic anemia — RBCs are mechanically sheared by fibrin strands in the microvasculature",
      "In obstetric DIC, delivery of the fetus and placenta is the definitive treatment — the DIC typically resolves rapidly once the inciting cause is removed",
      "Heparin is CONTRAINDICATED in acute hemorrhagic DIC — it may be considered only in chronic DIC with thrombosis-predominant presentation (e.g., Trousseau syndrome in malignancy)"
    ],
    quiz: [
      {
        question: "A septic patient develops petechiae, bleeding from IV sites, and a laboratory panel showing platelets 42,000, PT 22 seconds (elevated), fibrinogen 68 mg/dL (low), and D-dimer > 20,000 (markedly elevated). What is the MOST important intervention?",
        options: ["Administer heparin to prevent further microthrombi formation", "Treat the underlying sepsis with antibiotics and hemodynamic support while replacing blood products", "Administer tranexamic acid to stop the bleeding", "Perform an emergency splenectomy"],
        correct: 1,
        rationale: "Treating the underlying cause (sepsis) is the most critical intervention in DIC. Antibiotics, source control, and hemodynamic support address the trigger. Blood product replacement (FFP for clotting factors, cryoprecipitate for low fibrinogen, platelets) provides supportive care while the underlying cause is treated. Heparin is contraindicated in acute hemorrhagic DIC."
      },
      {
        question: "The nurse is monitoring a patient with DIC. Which combination of findings indicates worsening DIC?",
        options: ["Increasing platelet count, decreasing D-dimer, and rising fibrinogen", "Decreasing platelet count, increasing D-dimer, prolonging PT, and falling fibrinogen", "Stable platelet count with decreasing D-dimer", "Improving PT/INR with stable hemoglobin"],
        correct: 1,
        rationale: "Worsening DIC shows a downward trend in platelets and fibrinogen (consumption) with increasing D-dimer (ongoing fibrinolysis) and prolonging PT (clotting factor depletion). The nurse must monitor these trends every 4–6 hours and report deteriorating values to the healthcare team for escalation of therapy."
      },
      {
        question: "When caring for a patient with DIC, which nursing intervention helps minimize bleeding complications?",
        options: ["Administer IM injections for faster medication absorption", "Avoid IM injections, use smallest gauge needles, apply prolonged pressure to puncture sites, and avoid rectal temperatures", "Encourage vigorous oral care with a firm toothbrush", "Perform frequent venipunctures for serial lab monitoring"],
        correct: 1,
        rationale: "Minimizing invasive procedures reduces bleeding risk in DIC patients with severe coagulopathy. Avoid IM injections (risk of hematoma), use the smallest gauge needles possible, apply pressure for 5+ minutes after puncture, use soft toothbrushes or swabs for oral care, avoid rectal temperatures, and consolidate blood draws to minimize venipunctures."
      }
    ]
  },
  "cervical-cerclage": {
    title: "Cervical Cerclage",
    cellular: { title: "Pathophysiology of Cervical Cerclage", content: "Cervical cerclage is a surgical procedure in which a suture or band is placed around the cervix to reinforce it and prevent premature dilation and effacement in patients with cervical insufficiency (also called cervical incompetence). Cervical insufficiency is characterized by painless cervical dilation in the second trimester (typically 16–24 weeks) without contractions, leading to recurrent pregnancy loss or preterm birth. The normal cervix maintains its competence through a complex structure of collagen fibers (predominantly types I and III), elastin, smooth muscle, and extracellular matrix components. In cervical insufficiency, the cervical tissue has abnormal collagen composition, reduced collagen cross-linking, or structural weakness from prior trauma. As the pregnancy progresses and the weight of the uterine contents increases, the incompetent cervix cannot resist the growing pressure and begins to dilate painlessly. The membranes may prolapse through the dilating cervix and eventually rupture, resulting in preterm delivery or second-trimester pregnancy loss. Cerclage placement reinforces the mechanical strength of the cervix. Three types exist: (1) History-indicated (prophylactic, McDonald or Shirodkar technique, placed at 12–14 weeks based on obstetric history), (2) Ultrasound-indicated (rescue, placed when transvaginal ultrasound shows cervical length < 25 mm before 24 weeks), and (3) Physical exam-indicated (emergent, placed when cervical dilation is found on exam). The cerclage is typically removed at 36–37 weeks to allow vaginal delivery or left in place for planned cesarean delivery." },
    riskFactors: [
      "History of cervical insufficiency with second-trimester pregnancy loss",
      "Previous cervical surgery: cone biopsy (LEEP/LLETZ), cold-knife conization, cervical amputation",
      "Diethylstilbestrol (DES) exposure in utero (causes cervical hypoplasia)",
      "Short cervix on transvaginal ultrasound (< 25 mm before 24 weeks)",
      "History of preterm premature rupture of membranes (PPROM) in prior pregnancy",
      "Multiple gestation (increased uterine distension)",
      "Uterine anomalies (bicornuate uterus, septate uterus)"
    ],
    diagnostics: [
      "Transvaginal ultrasound: Cervical length measurement (< 25 mm before 24 weeks indicates short cervix; < 15 mm is critically short)",
      "Serial cervical length monitoring every 2 weeks from 16–24 weeks in high-risk patients",
      "Sterile speculum examination to assess for cervical dilation, membrane prolapse, or signs of infection",
      "Fetal fibronectin (fFN) test: Negative fFN has high negative predictive value for preterm delivery within 2 weeks",
      "Vaginal cultures: GBS, gonorrhea, chlamydia (infection must be treated before or concurrent with cerclage placement)",
      "Urinalysis and urine culture to rule out UTI as a cause of preterm labor",
      "Complete blood count to rule out infection (elevated WBC) before cerclage placement"
    ],
    management: [
      "History-indicated cerclage: Place at 12–14 weeks gestation in patients with history of ≥ 3 second-trimester losses or prior cervical insufficiency",
      "Ultrasound-indicated cerclage: Place when cervical length < 25 mm on transvaginal ultrasound before 24 weeks with history of prior preterm birth",
      "Physical exam-indicated (emergent) cerclage: Considered when cervical dilation 1–4 cm is found on exam before 24 weeks without contractions or infection",
      "McDonald cerclage: Purse-string suture placed at the cervicovaginal junction (most common technique; easier to place and remove)",
      "Shirodkar cerclage: Higher placement at the internal os with submucosal dissection (may require cesarean delivery for removal)",
      "Perioperative management: Prophylactic antibiotics, tocolysis (indomethacin or nifedipine for 24–48 hours), progesterone supplementation",
      "Cerclage removal at 36–37 weeks or earlier if preterm labor, PPROM, chorioamnionitis, or fetal distress develops"
    ],
    nursingActions: [
      "Pre-operative education: Explain the procedure, expected activity restrictions, warning signs to report, and follow-up schedule",
      "Post-operative monitoring: Vital signs every 15 min × 1 hour, then every 4 hours; continuous fetal monitoring for contractions and FHR; assess for vaginal bleeding, fluid leakage, or cramping",
      "Monitor for signs of preterm labor: Regular uterine contractions, pelvic pressure, low back pain, change in vaginal discharge",
      "Assess for complications: Signs of infection (fever, foul-smelling discharge, elevated WBC), cervical laceration (heavy bleeding), premature rupture of membranes (gush of clear fluid)",
      "Educate on activity modification: Avoid heavy lifting, prolonged standing, and sexual intercourse as directed by the provider",
      "Reinforce the importance of reporting danger signs: Fever, vaginal bleeding, leaking fluid, regular contractions, pelvic pressure",
      "Administer prescribed medications: Progesterone supplementation (vaginal or IM), prophylactic antibiotics, tocolytics as ordered"
    ],
    assessmentFindings: [
      "History of painless cervical dilation in the second trimester without contractions (classic cervical insufficiency)",
      "Short cervix (< 25 mm) on transvaginal ultrasound with funneling of the internal os",
      "Pelvic pressure or sense of 'heaviness' without painful contractions",
      "Vaginal discharge changes: increased mucoid discharge (cervical mucus changes with cervical dilation)",
      "Post-cerclage: Mild spotting and cramping are expected for 24–48 hours; heavy bleeding or persistent cramping is abnormal",
      "Signs of successful cerclage: Cervical length stabilizes or improves on serial ultrasound; pregnancy progresses to term"
    ],
    signs: {
      left: [
        "Post-cerclage with minimal spotting, no contractions, and stable cervical length",
        "Mild cramping resolving within 24 hours post-procedure",
        "Normal fetal heart rate tracing with no uterine activity",
        "Cervical length > 25 mm on follow-up ultrasound after cerclage",
        "Patient understanding of activity restrictions and warning signs"
      ],
      right: [
        "Cervical dilation > 4 cm with membranes bulging through the cervix (late for cerclage placement)",
        "Signs of chorioamnionitis: Fever > 38°C, uterine tenderness, foul-smelling discharge, maternal/fetal tachycardia (cerclage contraindicated)",
        "Premature rupture of membranes after cerclage placement (requires cerclage removal)",
        "Preterm labor with regular contractions despite cerclage (may need tocolysis or cerclage removal)",
        "Cervical laceration or hemorrhage from cerclage suture cutting through cervical tissue"
      ]
    },
    medications: [
      {
        name: "Progesterone (17-alpha-hydroxyprogesterone caproate or vaginal progesterone)",
        type: "Progestin hormone",
        action: "Maintains uterine quiescence by suppressing myometrial contractility, inhibiting prostaglandin production, and modulating immune response at the maternal-fetal interface",
        sideEffects: "Injection site reactions (IM 17-OHPC: pain, swelling, nodule), vaginal irritation (vaginal progesterone), drowsiness, breast tenderness, headache",
        contra: "Known or suspected breast cancer, active thromboembolism, undiagnosed vaginal bleeding, liver disease",
        pearl: "17-OHPC (Makena) 250 mg IM weekly from 16–20 weeks through 36 weeks for women with history of prior spontaneous preterm birth; vaginal progesterone 200 mg nightly is an alternative, especially for patients with short cervix; begin as early as possible in the second trimester"
      }
    ],
    pearls: [
      "Cervical insufficiency is characterized by PAINLESS cervical dilation in the second trimester — if the patient is having painful contractions, the diagnosis is preterm labor, not cervical insufficiency",
      "Cerclage is CONTRAINDICATED in the presence of active infection (chorioamnionitis), ruptured membranes, active vaginal bleeding, or cervical dilation > 4 cm",
      "Emergency (physical exam-indicated) cerclage has the lowest success rate but may still be attempted when dilation is discovered before 24 weeks without infection",
      "Cerclage is typically removed at 36–37 weeks; if PPROM occurs with cerclage in place, the cerclage must be REMOVED to prevent ascending infection (the suture traps bacteria)",
      "Activity modification after cerclage varies by provider: most recommend avoiding heavy lifting, strenuous activity, and sexual intercourse; strict bed rest is NOT routinely recommended",
      "Serial transvaginal cervical length measurement (every 1–2 weeks from 16–24 weeks) is the standard surveillance for women with prior preterm birth"
    ],
    quiz: [
      {
        question: "A patient at 18 weeks gestation has a transvaginal ultrasound showing cervical length of 18 mm with funneling. She has a history of a second-trimester pregnancy loss at 20 weeks. What intervention does the RN anticipate?",
        options: ["Strict bed rest and weekly office visits", "Placement of an ultrasound-indicated cervical cerclage", "Immediate cesarean delivery", "Tocolytic therapy with magnesium sulfate"],
        correct: 1,
        rationale: "This patient has a short cervix (< 25 mm) with a history of prior preterm birth/second-trimester loss. She meets criteria for an ultrasound-indicated cerclage. The cerclage reinforces the cervix to prevent further shortening and dilation, prolonging the pregnancy."
      },
      {
        question: "A patient with a cervical cerclage at 22 weeks presents with fever of 38.8°C, uterine tenderness, and foul-smelling vaginal discharge. What should the RN anticipate?",
        options: ["Continue monitoring and administer antipyretics", "Emergent cerclage removal, IV antibiotics, and assessment for delivery", "Tighten the cerclage suture and administer tocolytics", "Administer corticosteroids and observe for 48 hours"],
        correct: 1,
        rationale: "This presentation is consistent with chorioamnionitis (intra-amniotic infection). The cerclage must be removed because it prevents drainage and traps infection, worsening the ascending infection. IV antibiotics should be started, and the patient must be evaluated for delivery. Leaving the cerclage in place with active infection risks maternal sepsis."
      },
      {
        question: "The RN is providing post-cerclage education. Which statement by the patient indicates understanding?",
        options: ["I can resume all normal activities, including exercise, as soon as the cramping stops", "I need to report any fever, vaginal bleeding, leaking fluid, or regular contractions right away", "I will need a cesarean delivery since the cerclage cannot be removed", "I should take aspirin daily to prevent blood clots after the procedure"],
        correct: 1,
        rationale: "The patient demonstrates understanding by identifying danger signs that require immediate reporting: fever (infection), vaginal bleeding (cervical trauma or preterm labor), leaking fluid (PPROM), and regular contractions (preterm labor). The cerclage will be removed at 36–37 weeks to allow vaginal delivery."
      }
    ]
  }
};
