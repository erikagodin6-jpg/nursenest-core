import type { LessonContent } from "./types";

export const rnRespiratoryRenalExpansionLessons: Record<string, LessonContent> = {
  "pulmonary-hypertension-rn": {
    title: "Pulmonary Hypertension",
    cellular: {
      title: "Pathophysiology of Pulmonary Hypertension",
      content: "Pulmonary hypertension (PH) is defined as a mean pulmonary artery pressure (mPAP) greater than 20 mmHg at rest, measured by right heart catheterization. The pathological process involves progressive remodeling of the pulmonary vasculature through three key mechanisms: vasoconstriction, vascular wall proliferation (intimal fibrosis and medial hypertrophy), and in-situ thrombosis. Endothelial dysfunction leads to an imbalance between vasodilators (nitric oxide, prostacyclin) and vasoconstrictors (endothelin-1, thromboxane A2). Plexiform lesions develop in advanced disease, representing disorganized endothelial cell proliferation that obliterates the vessel lumen. The increased pulmonary vascular resistance (PVR) forces the right ventricle to generate higher pressures, leading to RV hypertrophy, dilation, and eventually right heart failure (cor pulmonale). WHO classifies PH into 5 groups: Group 1 (pulmonary arterial hypertension/PAH), Group 2 (left heart disease), Group 3 (lung disease/hypoxia), Group 4 (chronic thromboembolic), and Group 5 (multifactorial/unclear mechanisms)."
    },
    riskFactors: [
      "Connective tissue diseases (scleroderma, SLE) - most common associated condition in Group 1 PAH",
      "Congenital heart disease with left-to-right shunts (Eisenmenger syndrome)",
      "Portal hypertension (portopulmonary hypertension)",
      "HIV infection",
      "Drug/toxin exposure (methamphetamine, appetite suppressants such as fenfluramine)",
      "Family history with BMPR2 gene mutations (heritable PAH)",
      "Chronic thromboembolic disease (Group 4)",
      "Chronic hypoxic lung disease (COPD, interstitial lung disease - Group 3)",
      "Left heart disease with elevated left atrial pressures (Group 2)",
      "Female sex (2:1 female predominance in idiopathic PAH)"
    ],
    diagnostics: [
      "Right heart catheterization (RHC) - gold standard: mPAP >20 mmHg, PVR >2 Wood units",
      "Echocardiogram - estimated RVSP, RV dilation, tricuspid regurgitation, interventricular septum bowing",
      "6-minute walk test (6MWT) - functional capacity assessment, distance <300m indicates severe disease",
      "BNP/NT-proBNP - elevated with RV strain and failure",
      "CT pulmonary angiography - rule out chronic thromboembolic disease (Group 4)",
      "V/Q scan - more sensitive than CTPA for chronic thromboembolic PH",
      "Pulmonary function tests - assess for underlying lung disease",
      "Vasoreactivity testing during RHC - identifies responders to calcium channel blockers (only ~10% of PAH patients)"
    ],
    management: [
      "WHO FC II-III PAH: initiate combination therapy with ERA (ambrisentan, bosentan) + PDE5 inhibitor (sildenafil, tadalafil)",
      "WHO FC IV PAH: IV prostacyclin (epoprostenol) is first-line for severe/rapidly progressive disease",
      "Calcium channel blockers only for vasoreactive patients (positive acute vasoreactivity test)",
      "Anticoagulation with warfarin for idiopathic PAH and chronic thromboembolic PH",
      "Supplemental oxygen to maintain SpO2 >90% (hypoxia worsens pulmonary vasoconstriction)",
      "Diuretics for volume overload and right heart failure symptom management",
      "Avoid pregnancy - carries 30-50% maternal mortality risk in severe PAH",
      "Lung transplantation referral for patients failing maximal medical therapy"
    ],
    assessmentFindings: [
      "Exertional dyspnea progressing to dyspnea at rest (most common presenting symptom)",
      "Exertional syncope or presyncope (indicates severely reduced cardiac output)",
      "Chest pain (RV ischemia from increased wall stress)",
      "Loud P2 (pulmonic component of S2) - reflects elevated PA pressure",
      "Right-sided S3 gallop, tricuspid regurgitation murmur",
      "Jugular venous distension with prominent a-waves",
      "Hepatomegaly, ascites, peripheral edema (right heart failure signs)",
      "Cyanosis (central) from right-to-left shunting or severe hypoxemia"
    ],
    signs: {
      left: [
        "Loud P2 on auscultation",
        "RV heave (parasternal lift)",
        "Tricuspid regurgitation murmur",
        "Right-sided S3 or S4",
        "Exertional dyspnea and syncope",
        "Chest pain with exertion"
      ],
      right: [
        "JVD with elevated CVP",
        "Hepatomegaly and hepatojugular reflux",
        "Peripheral edema and ascites",
        "Cyanosis (late finding)",
        "Digital clubbing",
        "Weight gain from fluid retention"
      ]
    },
    nursingActions: [
      "Monitor continuous pulse oximetry - maintain SpO2 >90%, administer O2 as ordered",
      "Strict I&O monitoring and daily weights - report weight gain >2 lbs/day",
      "Administer IV prostacyclin (epoprostenol) via dedicated central line - NEVER interrupt infusion (rebound PH crisis)",
      "Monitor for epoprostenol side effects: jaw pain, headache, flushing, diarrhea, leg pain",
      "Assess for signs of right heart failure progression: increasing JVD, worsening edema, hepatomegaly",
      "Activity restriction with gradual cardiac rehabilitation as tolerated",
      "Educate on avoidance of pregnancy, high altitude, and NSAIDs",
      "Monitor liver function tests for patients on endothelin receptor antagonists (bosentan is hepatotoxic)",
      "Ensure backup IV prostacyclin pump and supplies available at all times"
    ],
    medications: [
      { name: "Epoprostenol (Flolan)", type: "Prostacyclin analog", action: "Potent pulmonary vasodilator and antiproliferative agent via continuous IV infusion", sideEffects: "Jaw pain, flushing, headache, diarrhea, musculoskeletal pain", contra: "Abrupt discontinuation (causes fatal rebound PH)", pearl: "Half-life only 3-5 minutes - NEVER stop infusion abruptly; requires ice packing and reconstitution every 8-12 hours" },
      { name: "Sildenafil (Revatio)", type: "PDE5 inhibitor", action: "Enhances nitric oxide-mediated vasodilation in pulmonary vasculature", sideEffects: "Headache, flushing, dyspepsia, visual disturbances", contra: "Concurrent nitrate use (severe hypotension)", pearl: "Dose for PH (20mg TID) differs from erectile dysfunction dose; do not confuse" },
      { name: "Bosentan (Tracleer)", type: "Endothelin receptor antagonist (ERA)", action: "Blocks endothelin-1 receptors to reduce vasoconstriction and vascular remodeling", sideEffects: "Hepatotoxicity, anemia, peripheral edema, teratogenicity", contra: "Pregnancy (Category X), significant hepatic impairment", pearl: "Requires monthly LFTs - hold if transaminases >5x ULN; strong CYP inducer with many drug interactions" },
      { name: "Treprostinil (Remodulin)", type: "Prostacyclin analog", action: "Pulmonary vasodilation via subcutaneous, IV, inhaled, or oral routes", sideEffects: "Injection site pain (SC), headache, diarrhea, jaw pain", contra: "Same as epoprostenol but longer half-life (4 hours) allows more stability", pearl: "SC infusion causes significant site pain; can also be given inhaled (Tyvaso) as adjunct therapy" }
    ],
    pearls: [
      "Epoprostenol infusion must NEVER be abruptly discontinued - rebound pulmonary hypertension can be fatal within minutes",
      "WHO Functional Class (I-IV) guides treatment intensity - similar to NYHA heart failure classification",
      "A positive vasoreactivity test (drop in mPAP by at least 10 mmHg to <40 mmHg) identifies the small subset of patients who respond to calcium channel blockers",
      "Pregnancy is contraindicated in PAH - maternal mortality 30-50%; ensure reliable contraception",
      "6-minute walk distance is the most commonly used endpoint in clinical trials and correlates with prognosis",
      "Syncope in PH indicates severely reduced cardiac output and warrants urgent escalation of therapy",
      "Group 2 PH (left heart disease) should NOT receive PAH-specific vasodilator therapy - treat the underlying cardiac condition"
    ],
    quiz: [
      { question: "A patient with pulmonary arterial hypertension on continuous IV epoprostenol reports the pump has stopped working. What is the nurse's PRIORITY action?", options: ["Restart the pump immediately or switch to backup pump", "Notify the provider and wait for new orders", "Administer sublingual nitroglycerin as a bridge", "Monitor vital signs and reassess in 15 minutes"], correct: 0, rationale: "Epoprostenol has a half-life of only 3-5 minutes. Abrupt discontinuation causes fatal rebound pulmonary hypertension. The nurse must immediately restart the pump or switch to the backup pump. Waiting or using alternative medications would result in a potentially fatal PH crisis." },
      { question: "Which diagnostic test is the GOLD STANDARD for confirming pulmonary hypertension?", options: ["Echocardiogram", "CT pulmonary angiography", "Right heart catheterization", "6-minute walk test"], correct: 2, rationale: "Right heart catheterization (RHC) directly measures pulmonary artery pressures, pulmonary vascular resistance, and cardiac output. It is the definitive diagnostic test. Echocardiogram is used for screening but can over- or underestimate pressures. CTPA evaluates for thromboembolic disease. 6MWT assesses functional capacity." },
      { question: "A patient with WHO Group 1 PAH undergoes vasoreactivity testing during right heart catheterization. The mPAP drops from 48 to 32 mmHg. What medication class does the nurse anticipate?", options: ["Endothelin receptor antagonist", "Prostacyclin analog", "Calcium channel blocker", "PDE5 inhibitor"], correct: 2, rationale: "A positive vasoreactivity test (mPAP drop >10 mmHg to <40 mmHg) identifies patients who may respond to calcium channel blockers (nifedipine, diltiazem, amlodipine). Only about 10% of PAH patients are vasoreactive. Non-responders receive combination therapy with ERAs and PDE5 inhibitors." }
    ]
  },

  "ards-pathophysiology-rn": {
    title: "Impaired Gas Exchange & ARDS Pathophysiology",
    cellular: {
      title: "ARDS: Alveolar-Capillary Membrane Damage",
      content: "Acute Respiratory Distress Syndrome (ARDS) results from diffuse alveolar damage (DAD) to the alveolar-capillary membrane, leading to non-cardiogenic pulmonary edema and refractory hypoxemia. The pathological process occurs in three phases: (1) Exudative phase (days 1-7): An inciting event triggers a massive inflammatory cascade with neutrophil activation, releasing proteases, reactive oxygen species, and pro-inflammatory cytokines (IL-1, IL-6, IL-8, TNF-alpha). Damage to type I alveolar epithelial cells and pulmonary capillary endothelium increases permeability, allowing protein-rich fluid to flood the alveoli. Surfactant-producing type II pneumocytes are damaged, causing surfactant deficiency, increased surface tension, and alveolar collapse (atelectasis). Hyaline membranes form along the alveolar walls. (2) Proliferative phase (days 7-21): Type II pneumocytes proliferate to restore the alveolar epithelium, fibroblasts begin collagen deposition. (3) Fibrotic phase (after day 21): Some patients develop pulmonary fibrosis with irreversible changes. The Berlin criteria classify severity by PaO2/FiO2 ratio on PEEP >=5 cmH2O: mild (200-300), moderate (100-200), severe (<100)."
    },
    riskFactors: [
      "Sepsis - most common cause of ARDS (40% of cases)",
      "Pneumonia (bacterial, viral including COVID-19, fungal)",
      "Aspiration of gastric contents",
      "Major trauma with pulmonary contusion",
      "Massive blood transfusion (TRALI - transfusion-related acute lung injury)",
      "Pancreatitis (systemic inflammatory response)",
      "Near-drowning",
      "Smoke/toxic inhalation injury",
      "Fat embolism syndrome (long bone fractures)",
      "Drug overdose (opioids, salicylates)"
    ],
    diagnostics: [
      "ABG: severe hypoxemia (PaO2 <60 mmHg) refractory to supplemental oxygen, initially respiratory alkalosis progressing to respiratory acidosis",
      "PaO2/FiO2 ratio: mild 200-300, moderate 100-200, severe <100 (Berlin criteria)",
      "Chest X-ray: bilateral diffuse infiltrates ('white-out') not fully explained by effusions or atelectasis",
      "CT chest: ground-glass opacities with dependent consolidation",
      "PCWP (if measured): <18 mmHg (distinguishes from cardiogenic pulmonary edema)",
      "BNP: low or normal (helps differentiate from heart failure-related pulmonary edema)",
      "Lactate: may be elevated indicating tissue hypoperfusion",
      "CBC: leukocytosis with left shift if infectious etiology"
    ],
    management: [
      "Lung-protective ventilation: low tidal volume 6 mL/kg ideal body weight (ARDSNet protocol)",
      "Plateau pressure target <30 cmH2O to prevent ventilator-induced lung injury (VILI)",
      "PEEP titration to optimize alveolar recruitment while avoiding overdistension",
      "Prone positioning for 12-16 hours/day in moderate-severe ARDS (PaO2/FiO2 <150) - PROSEVA trial showed mortality benefit",
      "Conservative fluid management after initial resuscitation (FACTT trial) - target CVP <4 or PCWP <8",
      "Neuromuscular blockade (cisatracurium) in early severe ARDS for 48 hours to improve ventilator synchrony",
      "Treat underlying cause (antibiotics for sepsis/pneumonia, source control)",
      "ECMO consideration for refractory hypoxemia despite maximal conventional therapy"
    ],
    assessmentFindings: [
      "Acute onset of severe dyspnea and tachypnea (RR often >30)",
      "Refractory hypoxemia - SpO2 remains low despite high-flow oxygen",
      "Bilateral crackles on auscultation (diffuse, not dependent)",
      "Use of accessory muscles, intercostal retractions",
      "Tachycardia (compensatory)",
      "Restlessness, anxiety, confusion (cerebral hypoxemia)",
      "Cyanosis (late finding)",
      "Symptoms typically develop within 12-48 hours of the inciting event"
    ],
    signs: {
      left: [
        "Severe dyspnea and tachypnea",
        "Refractory hypoxemia despite high FiO2",
        "Bilateral crackles on auscultation",
        "Accessory muscle use and nasal flaring",
        "Cyanosis (central and peripheral)",
        "Progressive respiratory failure"
      ],
      right: [
        "Tachycardia (compensatory)",
        "Hypotension (if sepsis-related)",
        "Restlessness and agitation",
        "Altered mental status (late)",
        "Bilateral infiltrates on CXR",
        "Decreased lung compliance"
      ]
    },
    nursingActions: [
      "Maintain lung-protective ventilation: verify tidal volume 6 mL/kg IBW and plateau pressure <30 cmH2O",
      "Monitor ABGs frequently - report worsening PaO2/FiO2 ratio",
      "Implement prone positioning protocol: coordinate with team for safe turning, protect pressure points and ET tube",
      "Sedation assessment using RASS or Richmond scale - target light sedation when possible",
      "Strict I&O monitoring with goal of negative or even fluid balance after initial resuscitation",
      "Monitor for ventilator-associated complications: pneumothorax (sudden desaturation, absent breath sounds), VAP",
      "Implement DVT prophylaxis, stress ulcer prophylaxis, and HOB elevation 30-45 degrees",
      "Provide oral care every 2 hours with chlorhexidine to prevent VAP",
      "Nutritional support via enteral feeding within 24-48 hours of ICU admission"
    ],
    medications: [
      { name: "Cisatracurium (Nimbex)", type: "Neuromuscular blocking agent", action: "Paralyzes skeletal muscles to improve ventilator synchrony and reduce oxygen consumption in severe ARDS", sideEffects: "Prolonged paralysis, ICU-acquired weakness, corneal abrasion risk", contra: "Must have adequate sedation and analgesia BEFORE paralysis (patient is aware but cannot move)", pearl: "Use train-of-four monitoring; target 1-2 twitches out of 4; limit to 48 hours when possible" },
      { name: "Propofol", type: "IV anesthetic/sedative", action: "GABA-mediated sedation for mechanically ventilated patients", sideEffects: "Hypotension, bradycardia, propofol infusion syndrome (with prolonged high doses)", contra: "Egg/soy allergy (contains egg lecithin and soybean oil)", pearl: "Monitor triglycerides every 48-72 hours; lipid-based formulation contributes significant calories" },
      { name: "Fentanyl", type: "Opioid analgesic", action: "Pain control and comfort for ventilated patients, minimal histamine release", sideEffects: "Respiratory depression (less relevant on ventilator), constipation, chest wall rigidity at high doses", contra: "MAO inhibitor use within 14 days", pearl: "Preferred over morphine in hemodynamically unstable patients; no histamine release means less hypotension" }
    ],
    pearls: [
      "ARDS is a clinical syndrome, not a disease - always identify and treat the underlying cause",
      "The hallmark of ARDS is refractory hypoxemia: PaO2 does not improve proportionally with increasing FiO2",
      "Lung-protective ventilation with 6 mL/kg IBW reduced mortality by 22% (ARDSNet trial) - this is NON-NEGOTIABLE",
      "Prone positioning improves V/Q matching by redistributing perfusion to better-ventilated anterior lung regions",
      "Distinguish ARDS from cardiogenic pulmonary edema: ARDS has normal/low PCWP (<18), bilateral infiltrates, and a known risk factor",
      "Higher PEEP recruits collapsed alveoli but excessive PEEP can cause overdistension and hemodynamic compromise",
      "Calculate ideal body weight for tidal volume using height, NOT actual body weight (obese patients are commonly over-ventilated)"
    ],
    quiz: [
      { question: "A patient with ARDS has PaO2 75 mmHg on FiO2 0.80 with PEEP 12 cmH2O. What is the PaO2/FiO2 ratio and ARDS severity classification?", options: ["94; severe ARDS", "94; moderate ARDS", "150; mild ARDS", "75; severe ARDS"], correct: 0, rationale: "PaO2/FiO2 = 75/0.80 = 93.75, rounded to 94. Per Berlin criteria, <100 is severe ARDS. Mild is 200-300, moderate is 100-200, and severe is <100. This patient qualifies for prone positioning and consideration of neuromuscular blockade." },
      { question: "The nurse caring for a prone-positioned ARDS patient notes sudden oxygen desaturation from 94% to 78% with absent breath sounds on the left. What does the nurse suspect?", options: ["Mucus plugging of the ETT", "Left-sided tension pneumothorax", "ET tube displacement into right mainstem bronchus", "Worsening ARDS"], correct: 1, rationale: "Sudden desaturation with unilateral absent breath sounds in a mechanically ventilated patient on high PEEP strongly suggests pneumothorax. Positive pressure ventilation with PEEP increases risk of barotrauma. This is a life-threatening emergency requiring immediate needle decompression." },
      { question: "Which ventilator parameter is MOST important for preventing ventilator-induced lung injury in ARDS?", options: ["FiO2 <60%", "Tidal volume 6 mL/kg ideal body weight", "Respiratory rate <20 breaths/min", "PEEP >10 cmH2O"], correct: 1, rationale: "Low tidal volume ventilation (6 mL/kg ideal body weight) is the cornerstone of lung-protective ventilation in ARDS. The ARDSNet trial demonstrated a 22% mortality reduction. High tidal volumes cause volutrauma and biotrauma. Plateau pressure should also be maintained <30 cmH2O." }
    ]
  },

  "copd-pathophysiology-rn": {
    title: "COPD Pathophysiology: Emphysema vs Chronic Bronchitis",
    cellular: {
      title: "COPD: Airway Obstruction Mechanisms",
      content: "Chronic Obstructive Pulmonary Disease encompasses two overlapping conditions: emphysema and chronic bronchitis. In emphysema, proteolytic destruction of alveolar walls by neutrophil elastase (amplified by alpha-1 antitrypsin deficiency or smoking-induced protease-antiprotease imbalance) destroys the elastic recoil of the lung parenchyma. Loss of alveolar septa reduces the surface area for gas exchange and eliminates the tethering effect that normally holds small airways open, causing expiratory airway collapse (air trapping). This creates enlarged airspaces distal to the terminal bronchioles with increased residual volume and total lung capacity (hyperinflation). In chronic bronchitis (defined clinically as productive cough for at least 3 months per year for 2 consecutive years), the pathology centers on airway inflammation with mucous gland hypertrophy (Reid index >50%), goblet cell hyperplasia, and excessive mucus production. Chronic inflammation causes bronchial wall thickening and smooth muscle hypertrophy, narrowing the airway lumen. Both processes contribute to V/Q mismatch: emphysema creates dead space (ventilation without perfusion - destroyed capillary bed), while chronic bronchitis and mucus plugging create shunt physiology (perfusion without ventilation). Chronic hypercapnia develops as the disease progresses, shifting the respiratory drive from CO2-mediated (central chemoreceptors) to hypoxia-mediated (peripheral chemoreceptors in the carotid and aortic bodies)."
    },
    riskFactors: [
      "Cigarette smoking - accounts for 85-90% of COPD cases (pack-year history correlates with severity)",
      "Alpha-1 antitrypsin deficiency (genetic - suspect in young non-smokers with panacinar emphysema)",
      "Occupational dust and chemical exposure (coal mining, grain, cotton)",
      "Indoor air pollution from biomass fuel burning (developing countries)",
      "Chronic asthma with airway remodeling (asthma-COPD overlap syndrome/ACOS)",
      "Recurrent childhood respiratory infections",
      "Secondhand smoke exposure",
      "Aging (normal decline in FEV1 accelerated by risk factors)"
    ],
    diagnostics: [
      "Spirometry (PFTs): FEV1/FVC ratio <0.70 confirms obstruction; FEV1 determines GOLD stage (I: >=80%, II: 50-79%, III: 30-49%, IV: <30%)",
      "Post-bronchodilator testing: incomplete reversibility differentiates COPD from asthma",
      "ABG: chronic respiratory acidosis with metabolic compensation (elevated HCO3), PaCO2 elevated, PaO2 decreased",
      "Chest X-ray: hyperinflation, flattened diaphragm, increased AP diameter, bullae in emphysema",
      "CT chest: emphysematous changes (centrilobular in smokers, panacinar in A1AT deficiency)",
      "Alpha-1 antitrypsin level: screen all COPD patients at least once",
      "CBC: polycythemia (elevated hematocrit from chronic hypoxemia - compensatory erythrocytosis)",
      "BNP: helps differentiate dyspnea from COPD exacerbation vs heart failure"
    ],
    management: [
      "Smoking cessation - ONLY intervention proven to slow FEV1 decline and reduce mortality",
      "GOLD Group A: short-acting bronchodilator PRN (SABA or SAMA)",
      "GOLD Group B: long-acting bronchodilator (LABA or LAMA) as maintenance",
      "GOLD Group E (exacerbator): LABA + LAMA; add ICS if eosinophils >300",
      "Oxygen therapy: indicated when PaO2 <55 mmHg or SpO2 <88% (long-term O2 improves survival); target SpO2 88-92%",
      "Pulmonary rehabilitation: exercise training, education, self-management (reduces dyspnea, improves QoL)",
      "Annual influenza and pneumococcal vaccination",
      "Acute exacerbation: short-course systemic corticosteroids (prednisone 40mg x 5 days), antibiotics if purulent sputum, increased bronchodilator frequency"
    ],
    assessmentFindings: [
      "Progressive exertional dyspnea (most common symptom)",
      "Chronic productive cough (chronic bronchitis phenotype)",
      "Barrel chest (increased AP diameter from air trapping)",
      "Pursed-lip breathing (creates auto-PEEP to prevent airway collapse)",
      "Prolonged expiratory phase, expiratory wheezing",
      "Diminished breath sounds (especially in emphysema)",
      "Use of accessory muscles (tripod positioning)",
      "Digital clubbing is NOT typical of COPD - its presence should prompt investigation for lung cancer or bronchiectasis"
    ],
    signs: {
      left: [
        "Barrel chest (increased AP diameter)",
        "Pursed-lip breathing",
        "Prolonged expiratory phase",
        "Diminished breath sounds (emphysema)",
        "Wheezing and rhonchi (bronchitis)",
        "Accessory muscle use and tripod positioning"
      ],
      right: [
        "Chronic productive cough",
        "Weight loss and muscle wasting (emphysema - 'pink puffer')",
        "Cyanosis and edema (bronchitis - 'blue bloater')",
        "Cor pulmonale signs: JVD, hepatomegaly, edema",
        "Polycythemia (ruddy complexion)",
        "Anxiety and dyspnea with activity"
      ]
    },
    nursingActions: [
      "Administer low-flow oxygen (1-2 L/min via nasal cannula) - target SpO2 88-92%, NOT 100%",
      "Monitor for CO2 narcosis: somnolence, confusion, headache with high-flow O2 administration",
      "Teach and assess proper inhaler technique (MDI with spacer, DPI technique)",
      "Encourage pursed-lip breathing and diaphragmatic breathing techniques",
      "Position in high Fowler's or tripod position to optimize diaphragm excursion",
      "Assess sputum color, quantity, and consistency - purulent sputum indicates infection",
      "Encourage adequate hydration (2-3 L/day unless fluid restricted) to thin secretions",
      "Monitor for acute exacerbation: worsening dyspnea, increased sputum volume/purulence, fever",
      "Teach energy conservation techniques: pace activities, use assistive devices"
    ],
    medications: [
      { name: "Albuterol (Ventolin)", type: "Short-acting beta-2 agonist (SABA)", action: "Relaxes bronchial smooth muscle for rapid bronchodilation (rescue inhaler)", sideEffects: "Tachycardia, tremor, hypokalemia, nervousness", contra: "Use with caution in cardiac patients", pearl: "If using >2 times per week, COPD is not well-controlled; reassess maintenance therapy" },
      { name: "Tiotropium (Spiriva)", type: "Long-acting muscarinic antagonist (LAMA)", action: "Blocks acetylcholine at M3 receptors in airway smooth muscle for sustained bronchodilation (24-hour)", sideEffects: "Dry mouth, urinary retention, constipation, blurred vision", contra: "Narrow-angle glaucoma, urinary retention/BPH", pearl: "First-line maintenance therapy in GOLD Group B; available as HandiHaler (capsule) or Respimat (soft mist); do NOT swallow capsule" },
      { name: "Fluticasone/Salmeterol (Advair)", type: "ICS/LABA combination", action: "Inhaled corticosteroid reduces airway inflammation; LABA provides sustained bronchodilation", sideEffects: "Oral candidiasis, dysphonia, pneumonia risk with ICS, adrenal suppression", contra: "Monotherapy LABA without ICS in asthma (not applicable in COPD); acute bronchospasm", pearl: "Rinse mouth after use to prevent oral thrush; ICS added only for frequent exacerbators or eosinophils >300" },
      { name: "Roflumilast (Daliresp)", type: "PDE4 inhibitor", action: "Reduces inflammation by increasing intracellular cAMP in inflammatory cells", sideEffects: "Diarrhea, nausea, weight loss, headache, psychiatric symptoms (depression, suicidal ideation)", contra: "Moderate-severe liver impairment", pearl: "Added as adjunct for severe COPD with chronic bronchitis phenotype and frequent exacerbations; monitor weight and mental health" }
    ],
    pearls: [
      "NEVER administer high-flow oxygen to COPD patients with chronic CO2 retention - target SpO2 88-92%",
      "Classic teaching: 'Pink puffer' = emphysema (thin, dyspneic, not cyanotic); 'Blue bloater' = chronic bronchitis (cyanotic, edematous, productive cough)",
      "FEV1/FVC <0.70 after bronchodilator confirms COPD; complete reversibility suggests asthma instead",
      "Smoking cessation is the ONLY intervention that changes the natural history of COPD",
      "Cor pulmonale (right heart failure from chronic pulmonary disease) develops in advanced COPD from chronic hypoxic pulmonary vasoconstriction",
      "Alpha-1 antitrypsin deficiency causes panacinar emphysema predominantly in the lung bases (vs smoking-related centrilobular emphysema in upper lobes)",
      "Acute exacerbation triad: increased dyspnea + increased sputum volume + increased sputum purulence"
    ],
    quiz: [
      { question: "A COPD patient on 2L nasal cannula has SpO2 86%. The nurse increases O2 to 6L via simple mask. Twenty minutes later, the patient becomes drowsy with ABG showing pH 7.22, PaCO2 88 mmHg. What happened?", options: ["Pulmonary embolism", "Suppression of hypoxic respiratory drive causing CO2 narcosis", "Oxygen toxicity", "Worsening COPD exacerbation"], correct: 1, rationale: "In COPD patients with chronic CO2 retention, the respiratory drive shifts to hypoxia-mediated. High-flow oxygen eliminates the hypoxic stimulus, reducing respiratory drive and causing CO2 retention (CO2 narcosis). Target SpO2 is 88-92%, not normal values." },
      { question: "Which finding differentiates emphysema from chronic bronchitis?", options: ["Productive cough for 3+ months/year for 2 years = chronic bronchitis", "Barrel chest and diminished breath sounds = emphysema", "Both A and B are correct differentiating features", "Neither - they are the same disease"], correct: 2, rationale: "Chronic bronchitis is defined clinically by chronic productive cough. Emphysema is characterized by destruction of alveolar walls causing air trapping, barrel chest, and diminished breath sounds. Most COPD patients have features of both." },
      { question: "A COPD patient's spirometry shows FEV1/FVC 0.62 and FEV1 42% predicted. What GOLD stage is this?", options: ["GOLD I - Mild", "GOLD II - Moderate", "GOLD III - Severe", "GOLD IV - Very Severe"], correct: 2, rationale: "FEV1/FVC <0.70 confirms obstruction. GOLD staging by FEV1 % predicted: I >=80%, II 50-79%, III 30-49%, IV <30%. FEV1 42% falls in GOLD III (Severe)." }
    ]
  },

  "asthma-pathophysiology-rn": {
    title: "Asthma Pathophysiology: Airway Hyperresponsiveness",
    cellular: {
      title: "Asthma: Inflammatory Cascade and Bronchospasm",
      content: "Asthma is a chronic inflammatory disorder of the airways characterized by reversible bronchoconstriction, airway inflammation, and airway hyperresponsiveness (AHR). The inflammatory process involves two phases: (1) Early-phase response (minutes): Allergen cross-links IgE on mast cell surfaces, triggering immediate degranulation and release of preformed mediators - histamine (bronchoconstriction, vasodilation), tryptase, and newly synthesized leukotrienes (LTC4, LTD4, LTE4 - potent bronchoconstrictors 1000x more potent than histamine) and prostaglandins. This produces acute bronchospasm. (2) Late-phase response (4-8 hours): Chemotactic factors attract eosinophils, neutrophils, T-helper 2 (Th2) lymphocytes, and basophils to the airways. Eosinophils release major basic protein (MBP) and eosinophil cationic protein, which are directly toxic to airway epithelium, causing epithelial shedding and exposure of sensory nerve endings (contributing to AHR). Chronic inflammation leads to structural airway remodeling: subepithelial fibrosis, smooth muscle hypertrophy, mucous gland hyperplasia, angiogenesis, and irreversible airway narrowing. Status asthmaticus is a severe, prolonged asthma attack unresponsive to standard bronchodilator therapy, representing a medical emergency with risk of respiratory arrest."
    },
    riskFactors: [
      "Atopic triad: asthma, allergic rhinitis, and atopic dermatitis (strongest predictor)",
      "Family history of asthma or atopy (genetic predisposition)",
      "Environmental allergen exposure (dust mites, cockroach, pet dander, mold)",
      "Respiratory viral infections in early childhood (RSV, rhinovirus)",
      "Tobacco smoke exposure (active or passive)",
      "Occupational sensitizers (isocyanates, flour dust, latex, animal proteins)",
      "Obesity (mechanical and inflammatory contribution)",
      "Exercise-induced bronchoconstriction (EIB)",
      "NSAID/aspirin sensitivity (aspirin-exacerbated respiratory disease/AERD - Samter triad)",
      "GERD (microaspiration and vagal nerve-mediated bronchoconstriction)"
    ],
    diagnostics: [
      "Spirometry: reduced FEV1/FVC during exacerbation; >12% and >200mL improvement in FEV1 after bronchodilator confirms reversibility",
      "Peak expiratory flow (PEF) monitoring: variability >20% suggests asthma; used for daily self-monitoring",
      "Methacholine challenge test: provokes bronchoconstriction in hyperresponsive airways (positive if PC20 <4 mg/mL)",
      "Exhaled nitric oxide (FeNO): elevated >25 ppb suggests eosinophilic airway inflammation",
      "Allergy testing (skin prick or serum IgE): identifies specific triggers",
      "CBC: eosinophilia suggests allergic/eosinophilic phenotype",
      "ABG in acute severe asthma: initially respiratory alkalosis (hyperventilation); normalizing or rising PaCO2 is OMINOUS (impending respiratory failure)",
      "Chest X-ray: hyperinflation during acute attack; rule out pneumothorax, pneumonia"
    ],
    management: [
      "Stepwise approach: GINA guidelines escalate/de-escalate therapy based on symptom control",
      "Step 1: PRN low-dose ICS-formoterol (preferred) or PRN SABA with ICS whenever SABA used",
      "Step 2: Daily low-dose ICS + PRN SABA or PRN low-dose ICS-formoterol",
      "Step 3: Low-dose ICS-LABA maintenance + PRN",
      "Step 4: Medium-dose ICS-LABA; consider add-on LAMA (tiotropium)",
      "Step 5: High-dose ICS-LABA + add-on therapy; refer for biologic therapy (omalizumab for allergic, mepolizumab/benralizumab for eosinophilic)",
      "Status asthmaticus: continuous nebulized albuterol + ipratropium, IV corticosteroids (methylprednisolone), IV magnesium sulfate (2g), prepare for intubation if refractory",
      "Avoid and control triggers: allergen avoidance, smoking cessation, manage GERD"
    ],
    assessmentFindings: [
      "Episodic wheezing, dyspnea, chest tightness, and cough (often worse at night/early morning)",
      "Expiratory wheezing on auscultation (hallmark finding)",
      "Prolonged expiratory phase",
      "Tachypnea and tachycardia during exacerbation",
      "Accessory muscle use, nasal flaring, intercostal retractions (moderate-severe attack)",
      "Pulsus paradoxus >10 mmHg (severe attack - indicates significant intrathoracic pressure swings)",
      "SILENT CHEST: absence of wheezing in severe attack is OMINOUS - indicates minimal air movement",
      "Inability to speak in full sentences indicates severe attack"
    ],
    signs: {
      left: [
        "Expiratory wheezing (hallmark)",
        "Prolonged expiratory phase",
        "Intercostal retractions",
        "Accessory muscle use",
        "Silent chest (ominous - no air movement)",
        "Pulsus paradoxus >10 mmHg"
      ],
      right: [
        "Tachypnea and tachycardia",
        "Diaphoresis and anxiety",
        "Inability to speak in sentences",
        "Peak flow <50% personal best (severe)",
        "Cyanosis (late sign)",
        "Tripod positioning"
      ]
    },
    nursingActions: [
      "Administer rescue bronchodilator immediately (albuterol nebulizer or MDI with spacer q20min x3)",
      "Position upright (high Fowler's) to maximize lung expansion",
      "Apply continuous pulse oximetry - maintain SpO2 >90%",
      "Assess peak flow before and after bronchodilator - document response",
      "Monitor for silent chest: worsening obstruction with decreasing wheezing is dangerous",
      "Administer systemic corticosteroids early in exacerbation (oral prednisone or IV methylprednisolone)",
      "Monitor ABG for normalizing or rising PaCO2 - this indicates fatigue and impending respiratory failure",
      "Prepare for intubation if patient shows signs of respiratory failure (altered mental status, rising PaCO2, severe hypoxemia)",
      "Teach proper inhaler technique and provide spacer for MDI use",
      "Develop and review asthma action plan with patient: green (well-controlled), yellow (caution), red (emergency)"
    ],
    medications: [
      { name: "Albuterol", type: "SABA (short-acting beta-2 agonist)", action: "Rapid bronchial smooth muscle relaxation via beta-2 receptor stimulation; onset 5-15 minutes", sideEffects: "Tremor, tachycardia, palpitations, hypokalemia, nervousness", contra: "Use with caution in cardiac disease; frequent use indicates poor control", pearl: "If using rescue inhaler >2 days/week, step up controller therapy; in status asthmaticus, give continuous nebulization" },
      { name: "Ipratropium (Atrovent)", type: "SAMA (short-acting muscarinic antagonist)", action: "Blocks parasympathetic bronchoconstriction; additive effect with SABA in acute exacerbation", sideEffects: "Dry mouth, metallic taste, cough", contra: "Peanut/soy allergy (some formulations contain soy lecithin)", pearl: "Always used WITH albuterol in acute exacerbation, not as monotherapy; not for maintenance" },
      { name: "Montelukast (Singulair)", type: "Leukotriene receptor antagonist (LTRA)", action: "Blocks cysteinyl leukotriene receptors, reducing bronchoconstriction and inflammation", sideEffects: "Headache; FDA boxed warning for neuropsychiatric effects (suicidal ideation, depression, agitation)", contra: "Not for acute bronchospasm; discuss neuropsychiatric risk with patient/family", pearl: "Particularly effective for exercise-induced bronchospasm and aspirin-sensitive asthma; take in the evening" },
      { name: "IV Magnesium Sulfate", type: "Smooth muscle relaxant", action: "Inhibits calcium-mediated smooth muscle contraction causing bronchodilation in refractory bronchospasm", sideEffects: "Hypotension, flushing, muscle weakness, respiratory depression at toxic levels", contra: "Renal failure (magnesium excreted renally), heart block", pearl: "2g IV over 20 min for status asthmaticus refractory to beta-agonists and steroids; monitor DTRs and respiratory rate" }
    ],
    pearls: [
      "A SILENT CHEST during an asthma attack is a medical emergency - it means air movement is so poor that wheezing cannot be generated",
      "Normalizing PaCO2 in a severe asthma attack is OMINOUS - the patient should be hyperventilating (low PaCO2); normal CO2 means they are tiring",
      "Asthma is REVERSIBLE obstruction (>12% FEV1 improvement with bronchodilator) vs COPD which is IRREVERSIBLE",
      "Samter triad (aspirin-exacerbated respiratory disease): asthma + nasal polyps + aspirin/NSAID sensitivity",
      "Leukotriene modifiers carry an FDA boxed warning for neuropsychiatric events - monitor mood changes",
      "ICS is the MOST effective long-term controller medication for persistent asthma",
      "Rinse mouth after ICS use to prevent oral candidiasis (thrush)"
    ],
    quiz: [
      { question: "During a severe asthma exacerbation, a patient's wheezing suddenly disappears and the patient becomes drowsy. ABG shows pH 7.30, PaCO2 52 mmHg. What does this indicate?", options: ["The bronchodilator is working and the patient is improving", "Impending respiratory failure requiring immediate intubation", "The patient has developed a pneumothorax", "Metabolic acidosis from lactic acid production"], correct: 1, rationale: "Disappearing wheezing (silent chest) with rising PaCO2 and drowsiness indicates severe airway obstruction with respiratory muscle fatigue. The patient is no longer able to generate enough airflow to wheeze. This is a pre-arrest situation requiring immediate intubation and mechanical ventilation." },
      { question: "Which finding on spirometry differentiates asthma from COPD?", options: [">12% improvement in FEV1 after bronchodilator", "Elevated total lung capacity", "Reduced diffusing capacity (DLCO)", "FEV1/FVC ratio <0.70"], correct: 0, rationale: "Significant bronchodilator reversibility (>12% and >200mL improvement in FEV1) is characteristic of asthma. COPD shows minimal or incomplete reversibility. Reduced DLCO is seen in emphysema. Both conditions can have reduced FEV1/FVC ratio." },
      { question: "A patient with asthma uses an albuterol rescue inhaler 5 times per week. What does the nurse recommend?", options: ["Continue current therapy since the inhaler is working", "Add or increase an inhaled corticosteroid controller medication", "Switch to ipratropium bromide as the rescue inhaler", "Start oral prednisone as daily maintenance therapy"], correct: 1, rationale: "Using a rescue SABA >2 days per week indicates uncontrolled asthma requiring step-up of controller therapy. ICS is the cornerstone of persistent asthma management. Ipratropium is not used as a rescue inhaler for asthma. Oral steroids are not appropriate for maintenance." }
    ]
  },

  "pe-pathophysiology-rn": {
    title: "Pulmonary Embolism: Virchow Triad & Clinical Classification",
    cellular: {
      title: "Pulmonary Embolism Pathophysiology",
      content: "Pulmonary embolism (PE) occurs when a thrombus (most commonly from the deep veins of the legs - DVT) dislodges and travels to the pulmonary arterial system, causing partial or complete obstruction. Virchow triad describes the three factors predisposing to thrombosis: (1) Venous stasis (immobility, prolonged bed rest, long flights), (2) Endothelial injury (surgery, trauma, central line placement), and (3) Hypercoagulability (malignancy, pregnancy, oral contraceptives, Factor V Leiden, antiphospholipid syndrome). The hemodynamic impact depends on the degree of obstruction: a massive PE (>50% of pulmonary vasculature) causes acute right ventricular pressure overload, leading to RV dilation, interventricular septum bowing into the LV, decreased LV filling, and ultimately cardiogenic shock. V/Q mismatch occurs as blood flow is redirected away from the obstructed segment while alveolar ventilation is preserved (dead space ventilation), causing hypoxemia and increased A-a gradient. Classification: submassive PE involves RV dysfunction without systemic hypotension (BP >90 systolic), while massive PE causes hemodynamic instability (systolic BP <90 for 15+ minutes)."
    },
    riskFactors: [
      "Recent surgery (especially orthopedic - hip/knee replacement carries highest risk)",
      "Prolonged immobility (bed rest >3 days, long-distance travel >4 hours)",
      "Active malignancy (Trousseau syndrome - migratory thrombophlebitis)",
      "History of prior DVT/PE (strongest predictor of recurrence)",
      "Oral contraceptives/hormone replacement therapy",
      "Pregnancy and postpartum period (hypercoagulable state peaks postpartum)",
      "Obesity (BMI >30)",
      "Inherited thrombophilias (Factor V Leiden, prothrombin G20210A mutation, protein C/S deficiency)",
      "Central venous catheter placement",
      "Trauma, especially lower extremity fractures"
    ],
    diagnostics: [
      "CT pulmonary angiography (CTPA) - gold standard imaging; directly visualizes thrombus in pulmonary arteries",
      "D-dimer: highly sensitive but not specific; negative D-dimer in low-probability patient effectively rules out PE",
      "V/Q scan: used when CTPA contraindicated (contrast allergy, renal insufficiency); reported as normal/low/intermediate/high probability",
      "Echocardiogram: RV dilation, RV hypokinesis, McConnell sign (RV free wall akinesis with preserved apical contractility), TR with elevated RVSP",
      "Troponin: elevated in submassive/massive PE indicating RV myocardial injury",
      "BNP: elevated from RV strain; correlates with severity",
      "ABG: hypoxemia, hypocapnia (respiratory alkalosis from hyperventilation), increased A-a gradient",
      "Lower extremity ultrasound: identifies DVT as source (positive in ~50% of PE cases)",
      "Wells criteria or Geneva score: clinical probability assessment before testing"
    ],
    management: [
      "Anticoagulation: unfractionated heparin (UFH) IV bolus + infusion for massive PE; LMWH (enoxaparin) or DOACs (rivaroxaban, apixaban) for hemodynamically stable PE",
      "Systemic thrombolysis (tPA/alteplase) for massive PE with hemodynamic instability",
      "Catheter-directed therapy for submassive PE with RV dysfunction when systemic thrombolysis is contraindicated",
      "Surgical embolectomy for massive PE when thrombolysis fails or is contraindicated",
      "IVC filter placement: indicated when anticoagulation is contraindicated or PE recurs despite adequate anticoagulation",
      "Transition to long-term anticoagulation: DOACs preferred; warfarin with INR target 2-3; minimum 3 months for provoked PE, indefinite for unprovoked or recurrent PE",
      "Hemodynamic support: IV fluids cautiously (avoid overloading the failing RV), vasopressors (norepinephrine) for shock"
    ],
    assessmentFindings: [
      "Sudden onset dyspnea (most common symptom - present in ~80% of cases)",
      "Pleuritic chest pain (sharp, worsens with inspiration)",
      "Tachycardia (often out of proportion to clinical findings)",
      "Tachypnea",
      "Hypoxemia (may be absent in small PE)",
      "Hemoptysis (suggests pulmonary infarction)",
      "Unilateral leg swelling, warmth, erythema (concomitant DVT)",
      "Massive PE: syncope, hypotension, signs of cardiogenic shock (cool/clammy skin, altered mental status)",
      "Distended neck veins and new loud P2"
    ],
    signs: {
      left: [
        "Sudden dyspnea (most common)",
        "Pleuritic chest pain",
        "Tachypnea (RR often >20)",
        "Tachycardia",
        "Hemoptysis",
        "Hypoxemia on pulse oximetry"
      ],
      right: [
        "Unilateral leg swelling (DVT)",
        "Syncope (massive PE)",
        "Hypotension and shock (massive PE)",
        "JVD (right heart strain)",
        "Loud P2 (elevated PA pressure)",
        "Low-grade fever"
      ]
    },
    nursingActions: [
      "Administer high-flow oxygen immediately - maintain SpO2 >90%",
      "Establish large-bore IV access and initiate anticoagulation as ordered (heparin bolus + drip)",
      "Continuous cardiac monitoring - monitor for right heart strain patterns (S1Q3T3, new RBBB)",
      "Monitor aPTT every 6 hours for UFH titration (therapeutic range 60-80 seconds or 1.5-2.5x control)",
      "Strict bed rest during acute phase to prevent further embolization",
      "Maintain IV access and prepare for emergency thrombolysis if hemodynamic deterioration occurs",
      "Monitor for signs of bleeding with anticoagulation: hematuria, melena, epistaxis, ecchymosis",
      "Assess bilateral lower extremities for signs of DVT",
      "Patient education on anticoagulation therapy: compliance, dietary considerations (warfarin), fall prevention",
      "Apply SCDs (sequential compression devices) to unaffected extremity if applicable"
    ],
    medications: [
      { name: "Heparin (UFH)", type: "Anticoagulant", action: "Activates antithrombin III to inhibit thrombin and factor Xa; prevents clot propagation", sideEffects: "Bleeding, HIT (heparin-induced thrombocytopenia), osteoporosis with prolonged use", contra: "Active bleeding, severe thrombocytopenia, HIT history", pearl: "Monitor aPTT q6h; antidote is protamine sulfate (1mg per 100 units heparin); monitor platelet count for HIT" },
      { name: "Enoxaparin (Lovenox)", type: "LMWH anticoagulant", action: "Preferentially inhibits factor Xa with more predictable dosing than UFH", sideEffects: "Bleeding, injection site ecchymosis, HIT (lower risk than UFH)", contra: "CrCl <30 mL/min (requires dose adjustment or switch to UFH), active major bleeding", pearl: "Give subcutaneously in abdomen; do not rub injection site; bridge to warfarin or transition to DOAC" },
      { name: "Rivaroxaban (Xarelto)", type: "Direct oral anticoagulant (DOAC) - factor Xa inhibitor", action: "Directly inhibits factor Xa without need for antithrombin cofactor", sideEffects: "Bleeding, GI upset", contra: "Severe renal/hepatic impairment, active bleeding", pearl: "No routine lab monitoring needed; can be used as single-drug approach (15mg BID x 21 days then 20mg daily); reversal agent: andexanet alfa" },
      { name: "Alteplase (tPA)", type: "Thrombolytic", action: "Converts plasminogen to plasmin, directly dissolving the clot in massive PE", sideEffects: "Major hemorrhage (intracranial hemorrhage most feared - 2-3% risk)", contra: "Active internal bleeding, recent surgery (<3 weeks), history of hemorrhagic stroke, intracranial neoplasm", pearl: "Reserved for massive PE with hemodynamic instability; 100mg IV over 2 hours; monitor neuro status closely" }
    ],
    pearls: [
      "Virchow triad: Stasis + Endothelial injury + Hypercoagulability = thrombosis risk",
      "A negative D-dimer in a low-probability patient effectively rules out PE (high negative predictive value)",
      "The classic S1Q3T3 ECG pattern is specific but insensitive - sinus tachycardia is the most common ECG finding",
      "Massive PE = hemodynamic instability (SBP <90 for >15 min); submassive PE = RV dysfunction without hypotension",
      "Do NOT delay anticoagulation while waiting for imaging if clinical suspicion is high",
      "Hemoptysis in PE suggests pulmonary infarction (lung tissue death from vascular occlusion)",
      "McConnell sign on echo (akinetic RV free wall with preserved apical motion) is highly specific for PE"
    ],
    quiz: [
      { question: "A patient post-hip replacement surgery suddenly develops severe dyspnea, tachycardia (HR 128), SpO2 84%, and BP 78/50. What is the nurse's PRIORITY action?", options: ["Obtain a D-dimer level", "Administer high-flow oxygen and notify the rapid response team", "Apply SCDs to both lower extremities", "Encourage deep breathing and coughing exercises"], correct: 1, rationale: "This presentation is classic for massive PE: post-orthopedic surgery, sudden dyspnea, tachycardia, hypoxemia, and hypotension. This is a medical emergency. High-flow oxygen and activating the rapid response team for emergent evaluation and possible thrombolysis takes priority over diagnostic testing." },
      { question: "A patient on heparin for PE has an aPTT of 120 seconds (therapeutic range 60-80). What should the nurse do?", options: ["Continue the infusion at the current rate", "Stop the infusion and notify the provider per protocol", "Administer protamine sulfate immediately", "Decrease the rate by 25% and recheck in 4 hours"], correct: 1, rationale: "An aPTT of 120 seconds is significantly supratherapeutic, placing the patient at high bleeding risk. Per heparin nomograms, the infusion should be stopped and the provider notified. The heparin will usually be restarted at a lower rate after a specified hold time. Protamine is reserved for active bleeding." },
      { question: "Which component of Virchow triad is MOST relevant for a patient on prolonged bed rest following surgery?", options: ["Endothelial injury", "Venous stasis", "Hypercoagulability", "All components equally"], correct: 1, rationale: "Prolonged immobility/bed rest primarily contributes to venous stasis, allowing blood to pool in the deep veins of the lower extremities and increasing DVT/PE risk. While surgery also causes endothelial injury and a hypercoagulable state, immobility is the component most directly addressed by nursing interventions (early ambulation, SCDs)." }
    ]
  },

  "pneumonia-comprehensive-rn": {
    title: "Pneumonia: CAP vs HAP Pathophysiology",
    cellular: {
      title: "Pneumonia: Infection and Consolidation",
      content: "Pneumonia is an infection of the lung parenchyma causing inflammation, alveolar exudate accumulation, and consolidation. The pathological pattern differs by type: (1) Lobar pneumonia (typically Streptococcus pneumoniae) involves consolidation of an entire lobe, progressing through four stages - congestion (vascular engorgement, serous exudate), red hepatization (RBCs and neutrophils fill alveoli, lung resembles liver), gray hepatization (fibrin and degrading neutrophils), and resolution (enzymatic digestion of exudate). (2) Bronchopneumonia (patchy, multifocal) involves inflammation centered around bronchioles spreading to adjacent alveoli, commonly caused by Staphylococcus aureus, Haemophilus influenzae, and gram-negative organisms. Classification by setting: Community-acquired pneumonia (CAP) develops outside healthcare settings or within 48 hours of admission; Hospital-acquired pneumonia (HAP) develops >=48 hours after admission; Ventilator-associated pneumonia (VAP) develops >=48 hours after intubation. HAP/VAP pathogens are typically more resistant (MRSA, Pseudomonas, Acinetobacter) requiring broader-spectrum empiric coverage."
    },
    riskFactors: [
      "Age >65 years or <2 years (extremes of age)",
      "Smoking (impairs mucociliary clearance and alveolar macrophage function)",
      "Chronic lung disease (COPD, asthma, bronchiectasis)",
      "Immunosuppression (HIV/AIDS, chemotherapy, organ transplant, chronic steroids)",
      "Aspiration risk (dysphagia, altered consciousness, NG tube, GERD)",
      "Recent hospitalization or antibiotic use (risk for resistant organisms)",
      "Mechanical ventilation (VAP risk increases 1-3% per day of intubation)",
      "Poor oral hygiene (oral pathogens can be aspirated)",
      "Malnutrition and chronic illness",
      "Post-operative status (especially thoracic/abdominal surgery with splinting)"
    ],
    diagnostics: [
      "Chest X-ray: infiltrates, consolidation (air bronchograms), or bilateral patchy opacities",
      "CBC: leukocytosis with left shift (bandemia); leukopenia in severe sepsis or immunosuppression",
      "Blood cultures (x2 from separate sites): obtain BEFORE antibiotics if possible; positive in 5-14% of CAP",
      "Sputum culture and Gram stain: guide targeted antibiotic therapy; expectorate before antibiotics",
      "Procalcitonin: helps distinguish bacterial (elevated) from viral (low/normal) pneumonia",
      "Lactate: elevated suggests sepsis/severe infection",
      "CT chest: more sensitive for cavitation, empyema, or atypical patterns",
      "Legionella and pneumococcal urinary antigen tests: rapid identification of specific pathogens",
      "ABG: hypoxemia, possible respiratory alkalosis or acidosis depending on severity"
    ],
    management: [
      "CAP (outpatient): amoxicillin or doxycycline for healthy adults; respiratory fluoroquinolone or beta-lactam + macrolide for comorbidities",
      "CAP (inpatient non-ICU): respiratory fluoroquinolone (levofloxacin) OR beta-lactam (ceftriaxone) + macrolide (azithromycin)",
      "CAP (ICU): beta-lactam (ceftriaxone/ampicillin-sulbactam) + macrolide (azithromycin); add anti-MRSA and anti-Pseudomonal if risk factors present",
      "HAP/VAP: piperacillin-tazobactam or cefepime or meropenem +/- vancomycin or linezolid for MRSA coverage",
      "Supplemental oxygen to maintain SpO2 >92% (>88% in COPD)",
      "Adequate hydration (2-3 L/day unless fluid restricted) to thin secretions",
      "Incentive spirometry 10 breaths every 1-2 hours while awake",
      "VAP prevention bundle: HOB 30-45 degrees, daily sedation vacation, oral care q2h with chlorhexidine, DVT and PUD prophylaxis"
    ],
    assessmentFindings: [
      "Fever and chills (may be absent in elderly - afebrile pneumonia is common in geriatric patients)",
      "Productive cough (purulent sputum: yellow/green; rust-colored sputum classic for S. pneumoniae)",
      "Dyspnea and tachypnea",
      "Pleuritic chest pain (sharp, worsens with inspiration)",
      "Crackles (rales) over affected area on auscultation",
      "Bronchial breath sounds over consolidation (normally heard only over trachea)",
      "Egophony (E-to-A change) and increased tactile fremitus over consolidation",
      "Dullness to percussion over consolidated area",
      "In elderly: confusion or altered mental status may be the presenting sign"
    ],
    signs: {
      left: [
        "Fever, chills, rigors (may be absent in elderly)",
        "Productive cough with purulent sputum",
        "Crackles/rales on auscultation",
        "Bronchial breath sounds over consolidation",
        "Egophony (E-to-A change)",
        "Increased tactile fremitus"
      ],
      right: [
        "Tachypnea and tachycardia",
        "Pleuritic chest pain",
        "Dyspnea and hypoxemia",
        "Dullness to percussion",
        "Diaphoresis",
        "Altered mental status (elderly)"
      ]
    },
    nursingActions: [
      "Obtain sputum and blood cultures BEFORE initiating antibiotics (time-sensitive - do not delay antibiotics >1 hour for sepsis)",
      "Administer antibiotics within 1 hour of diagnosis (sepsis protocol) or per facility timeline",
      "Monitor respiratory status: breath sounds, SpO2, RR, work of breathing q2-4 hours",
      "Encourage incentive spirometry 10 breaths q1-2h while awake to prevent atelectasis",
      "Maintain adequate hydration (oral or IV) to thin secretions unless fluid restricted",
      "Implement aspiration precautions for at-risk patients: elevate HOB, thickened liquids, swallow evaluation",
      "Implement isolation precautions based on pathogen (airborne for TB/measles, droplet for influenza/pertussis)",
      "Monitor for complications: empyema, lung abscess, sepsis, ARDS, respiratory failure",
      "Encourage early ambulation when hemodynamically stable",
      "Pneumococcal and influenza vaccination at discharge for eligible patients"
    ],
    medications: [
      { name: "Ceftriaxone (Rocephin)", type: "Third-generation cephalosporin", action: "Broad-spectrum beta-lactam covering S. pneumoniae, H. influenzae, and many gram-negatives", sideEffects: "Diarrhea, rash, biliary sludging, C. difficile infection", contra: "Severe penicillin allergy (cross-reactivity ~1-2%); do not mix with calcium-containing solutions in neonates", pearl: "First-line for CAP inpatient therapy when combined with azithromycin; once-daily dosing (1-2g IV)" },
      { name: "Azithromycin (Zithromax)", type: "Macrolide antibiotic", action: "Covers atypical organisms (Mycoplasma, Chlamydophila, Legionella) and has anti-inflammatory properties", sideEffects: "GI upset, QT prolongation, hepatotoxicity", contra: "History of cholestatic jaundice with prior azithromycin use; caution with QT-prolonging drugs", pearl: "Used in combination with beta-lactam for CAP; covers atypical pathogens not covered by cephalosporins" },
      { name: "Levofloxacin (Levaquin)", type: "Respiratory fluoroquinolone", action: "Broad-spectrum coverage including typical and atypical CAP pathogens", sideEffects: "Tendon rupture (Achilles), QT prolongation, C. difficile, peripheral neuropathy, aortic dissection risk", contra: "Myasthenia gravis (exacerbates weakness), children/adolescents (cartilage damage)", pearl: "Can be used as monotherapy for CAP; FDA boxed warning for tendon rupture - avoid in patients on corticosteroids or >60 years" },
      { name: "Vancomycin", type: "Glycopeptide antibiotic", action: "Cell wall synthesis inhibitor active against MRSA and other gram-positive organisms", sideEffects: "Red man syndrome (histamine-mediated with rapid infusion), nephrotoxicity, ototoxicity", contra: "Must monitor trough levels (target AUC/MIC-based dosing); infuse over at least 60 minutes", pearl: "Added to HAP/VAP regimen when MRSA risk factors present; slow infusion prevents red man syndrome (not an allergy)" }
    ],
    pearls: [
      "In elderly patients, altered mental status may be the ONLY presenting sign of pneumonia - fever may be absent",
      "Rust-colored sputum is classic for Streptococcus pneumoniae (pneumococcal pneumonia)",
      "Currant jelly sputum is associated with Klebsiella pneumoniae (common in alcoholics)",
      "Consolidation findings on exam: bronchial breath sounds, egophony (E-to-A change), increased tactile fremitus, dullness to percussion",
      "Blood cultures should be obtained BEFORE antibiotics but should NOT delay antibiotic administration",
      "VAP prevention bundle is a nursing priority: HOB 30-45 degrees, oral care q2h, daily sedation vacation, DVT/PUD prophylaxis",
      "CURB-65 score determines need for hospitalization: Confusion, Urea >20, RR >30, BP <90/60, age >65"
    ],
    quiz: [
      { question: "An 82-year-old nursing home resident is brought to the ED with new-onset confusion. Temperature is 37.1C, RR 24, SpO2 91%. Chest X-ray shows right lower lobe consolidation. What type of pneumonia is this?", options: ["Community-acquired pneumonia (CAP)", "Hospital-acquired pneumonia (HAP)", "Healthcare-associated pneumonia", "Ventilator-associated pneumonia"], correct: 0, rationale: "Despite being from a nursing home, current guidelines classify this as CAP since the patient was not hospitalized in the past 48 hours. The elderly presentation with confusion and minimal fever is characteristic. The HAP/VAP classification requires onset >=48 hours after hospital admission or intubation." },
      { question: "A nurse auscultates bronchial breath sounds over the right lower lobe of a patient with pneumonia. What does this finding indicate?", options: ["Normal finding in this area", "Lung consolidation (solid tissue transmits sound better)", "Pleural effusion", "Pneumothorax"], correct: 1, rationale: "Bronchial breath sounds are normally heard only over the trachea and mainstem bronchi. When heard over the lung periphery, they indicate consolidation - the solid, fluid-filled lung tissue transmits sound from the large airways more effectively than air-filled alveoli. This is accompanied by egophony and increased tactile fremitus." },
      { question: "Which element of the VAP prevention bundle is the NURSE's direct responsibility to implement?", options: ["Prescribing prophylactic antibiotics", "Oral care with chlorhexidine every 2 hours", "Ordering daily sedation vacations", "Selecting the appropriate ventilator mode"], correct: 1, rationale: "Oral care with chlorhexidine every 2 hours is a direct nursing intervention in the VAP prevention bundle. It reduces oropharyngeal colonization that can be aspirated into the lungs. Other bundle elements include HOB 30-45 degrees (nursing), but prescribing and ventilator mode selection are provider responsibilities." }
    ]
  },

  "aki-pathophysiology-rn": {
    title: "Acute Kidney Injury: Classification & Management",
    cellular: {
      title: "AKI: Prerenal, Intrarenal, and Postrenal Mechanisms",
      content: "Acute Kidney Injury (AKI) is defined by a rapid decline in glomerular filtration rate (GFR) over hours to days, resulting in retention of nitrogenous waste products (azotemia) and dysregulation of fluid, electrolyte, and acid-base balance. The KDIGO criteria define AKI as: increase in serum creatinine by >=0.3 mg/dL within 48 hours, OR increase to >=1.5x baseline within 7 days, OR urine output <0.5 mL/kg/hr for 6 hours. AKI is classified by etiology: (1) Prerenal AKI (55-60% of cases): decreased renal perfusion from hypovolemia, heart failure, sepsis, or renal artery stenosis. The kidney is structurally intact but underperfused. BUN/creatinine ratio is >20:1 because the kidney reabsorbs urea in response to decreased perfusion. (2) Intrarenal/intrinsic AKI (35-40%): direct damage to the nephron structures. Acute tubular necrosis (ATN) is the most common cause, resulting from ischemia (prolonged prerenal state) or nephrotoxins (aminoglycosides, contrast dye, myoglobin from rhabdomyolysis). Muddy brown granular casts in urinalysis are pathognomonic for ATN. (3) Postrenal AKI (5-10%): mechanical obstruction to urine outflow - BPH, kidney stones, tumors, or blood clots. Bilateral obstruction (or unilateral in a single kidney) is required to cause AKI."
    },
    riskFactors: [
      "Pre-existing chronic kidney disease (strongest risk factor for AKI)",
      "Advanced age (>65 years - reduced nephron mass and GFR reserve)",
      "Diabetes mellitus (diabetic nephropathy, vascular disease)",
      "Heart failure (cardiorenal syndrome - poor cardiac output reduces renal perfusion)",
      "Sepsis and critical illness (most common cause of AKI in ICU)",
      "Nephrotoxic medications: aminoglycosides, vancomycin, NSAIDs, ACE inhibitors, IV contrast dye",
      "Major surgery (especially cardiac surgery with bypass)",
      "Volume depletion: hemorrhage, dehydration, excessive diuresis",
      "Rhabdomyolysis (myoglobin causes tubular obstruction and direct toxicity)",
      "Multiple myeloma (light chain cast nephropathy)"
    ],
    diagnostics: [
      "Serum creatinine: rising trend (baseline comparison essential); creatinine lags behind actual GFR decline by 24-48 hours",
      "BUN: elevated; BUN/Cr ratio >20:1 suggests prerenal, <15:1 suggests intrarenal",
      "Urinalysis: muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Urine sodium: <20 mEq/L in prerenal (kidney retains sodium); >40 mEq/L in intrarenal (damaged tubules cannot reabsorb sodium)",
      "Fractional excretion of sodium (FENa): <1% = prerenal; >2% = intrarenal",
      "Renal ultrasound: first-line imaging to evaluate for obstruction (hydronephrosis = postrenal) and kidney size",
      "Serum potassium: monitor closely - hyperkalemia is the most life-threatening electrolyte abnormality in AKI",
      "ABG/serum bicarbonate: metabolic acidosis develops as kidneys cannot excrete hydrogen ions",
      "CBC: anemia may develop; eosinophilia suggests allergic interstitial nephritis"
    ],
    management: [
      "Prerenal AKI: restore intravascular volume (IV crystalloid bolus), optimize cardiac output, hold nephrotoxic drugs",
      "Intrarenal AKI (ATN): supportive care, maintain euvolemia, avoid further nephrotoxic insults, monitor for recovery",
      "Postrenal AKI: relieve obstruction (Foley catheter for BPH, ureteral stent for stones, nephrostomy tube)",
      "Discontinue all nephrotoxic medications (NSAIDs, aminoglycosides, ACEi/ARBs in acute setting)",
      "Manage hyperkalemia: calcium gluconate (cardiac membrane stabilizer), insulin + glucose, sodium bicarbonate, kayexalate, emergent dialysis if refractory",
      "Fluid management: if oliguric with volume overload, may need furosemide or dialysis; if hypovolemic, give fluids",
      "Renal replacement therapy (dialysis) indications: refractory hyperkalemia, severe metabolic acidosis, volume overload unresponsive to diuretics, uremic symptoms (pericarditis, encephalopathy), severe electrolyte abnormalities",
      "Nutrition: adequate calories to prevent catabolism; restrict potassium, phosphorus, and protein if not on dialysis"
    ],
    assessmentFindings: [
      "Oliguria (<400 mL/day) or anuria (<100 mL/day) - most common presenting sign; nonoliguric AKI also occurs",
      "Elevated serum creatinine and BUN on laboratory values",
      "Fluid overload: peripheral edema, pulmonary crackles, JVD, weight gain, hypertension",
      "Hyperkalemia: peaked T waves, widened QRS, muscle weakness, cardiac arrhythmias",
      "Metabolic acidosis: Kussmaul respirations (deep, rapid breathing to compensate)",
      "Uremia (late): nausea/vomiting, anorexia, lethargy, confusion, pruritus, uremic frost (rare), pericardial friction rub",
      "Fatigue and malaise",
      "Flank pain (postrenal obstruction or renal infarction)"
    ],
    signs: {
      left: [
        "Oliguria or anuria",
        "Rising creatinine and BUN",
        "Fluid overload (edema, crackles)",
        "Hypertension from volume overload",
        "Metabolic acidosis (Kussmaul breathing)",
        "Uremic symptoms (nausea, confusion)"
      ],
      right: [
        "Hyperkalemia (peaked T waves, arrhythmias)",
        "Weight gain (fluid retention)",
        "Decreased urine specific gravity (intrarenal)",
        "Concentrated urine with high SG (prerenal)",
        "Pericardial friction rub (uremic pericarditis)",
        "Pruritus (uremia)"
      ]
    },
    nursingActions: [
      "Strict I&O monitoring - hourly urine output measurement via Foley catheter; report <0.5 mL/kg/hr",
      "Daily weights at same time, same scale, same clothing - most reliable indicator of fluid balance",
      "Monitor serum potassium every 4-6 hours - hyperkalemia is the most dangerous complication",
      "Continuous cardiac monitoring if potassium >5.5 mEq/L (watch for peaked T waves, widened QRS)",
      "Review all medications for nephrotoxicity - advocate for discontinuation of NSAIDs, aminoglycosides, contrast dye",
      "Monitor fluid balance: assess for edema, lung sounds, JVD (overload) vs orthostatic hypotension, skin turgor (depletion)",
      "Administer IV fluids cautiously in prerenal AKI - reassess volume status frequently",
      "Implement fall precautions (uremic patients are confused and weak)",
      "Educate patient on dietary restrictions: low potassium, low phosphorus, low sodium",
      "Prepare for dialysis if indicated - assess and protect vascular access"
    ],
    medications: [
      { name: "Calcium Gluconate", type: "Cardiac membrane stabilizer", action: "Stabilizes cardiac cell membranes against hyperkalemia-induced arrhythmias; does NOT lower potassium", sideEffects: "Bradycardia with rapid administration, tissue necrosis with extravasation", contra: "Digoxin use (calcium potentiates digoxin toxicity)", pearl: "First-line EMERGENCY treatment for hyperkalemia with ECG changes; onset 1-3 minutes; provides time while other K+-lowering treatments take effect" },
      { name: "Regular Insulin + Dextrose 50%", type: "Potassium-shifting agent", action: "Insulin drives potassium intracellularly; dextrose prevents hypoglycemia", sideEffects: "Hypoglycemia (monitor glucose q30min for 4 hours), hypokalemia rebound", contra: "Must give dextrose with insulin in non-diabetic patients", pearl: "10 units regular insulin IV + 25g D50W; onset 15-30 minutes; shifts K+ temporarily - does not remove it from the body" },
      { name: "Sodium Polystyrene Sulfonate (Kayexalate)", type: "Cation exchange resin", action: "Exchanges sodium for potassium in the GI tract for elimination", sideEffects: "Constipation, intestinal necrosis (rare but serious), hypernatremia", contra: "Bowel obstruction, postoperative patients (risk of intestinal necrosis)", pearl: "Onset 1-2 hours (PO) to 30 min (rectal); actually removes K+ from the body unlike shifting agents; can cause hyponatremia" },
      { name: "Furosemide (Lasix)", type: "Loop diuretic", action: "Inhibits sodium-potassium-chloride cotransporter in loop of Henle; promotes fluid and potassium excretion", sideEffects: "Hypokalemia, hyponatremia, ototoxicity (high doses), dehydration", contra: "Anuria, severe hypovolemia, sulfa allergy (cross-reactivity possible)", pearl: "Used for volume overload in AKI; higher doses often needed (80-200mg IV) as damaged kidneys respond poorly; ineffective if GFR <5" }
    ],
    pearls: [
      "BUN/Creatinine ratio >20:1 = prerenal; <15:1 = intrarenal; helps differentiate the cause",
      "FENa <1% = prerenal (kidney appropriately retaining sodium); FENa >2% = intrarenal (tubular damage)",
      "Muddy brown granular casts on urinalysis are pathognomonic for acute tubular necrosis (ATN)",
      "Hyperkalemia is the most immediately life-threatening complication of AKI - can cause fatal arrhythmias",
      "Calcium gluconate does NOT lower potassium - it stabilizes the heart while other treatments work",
      "Dialysis indications (mnemonic AEIOU): Acidosis refractory, Electrolytes (hyperK), Ingestion (toxic), Overload (fluid), Uremia symptoms",
      "Creatinine is a lagging indicator - it may not rise until GFR has already declined by 50%"
    ],
    quiz: [
      { question: "A patient with AKI has serum potassium of 6.8 mEq/L and the ECG shows peaked T waves and widened QRS. What medication should the nurse administer FIRST?", options: ["Regular insulin 10 units IV", "Sodium polystyrene sulfonate (Kayexalate) PO", "Calcium gluconate 10% IV", "Furosemide 40 mg IV"], correct: 2, rationale: "Calcium gluconate is the FIRST medication given for severe hyperkalemia with ECG changes because it immediately stabilizes cardiac cell membranes, preventing fatal arrhythmias. It works within 1-3 minutes. Insulin/glucose shifts K+ intracellularly but takes 15-30 minutes. Kayexalate removes K+ but takes hours. Furosemide promotes K+ excretion but is slower." },
      { question: "A post-surgical patient has urine output of 15 mL/hr, BUN 42 mg/dL, creatinine 2.8 mg/dL (baseline 0.9), BUN/Cr ratio 15:1, urine sodium 52 mEq/L, and muddy brown casts on urinalysis. What type of AKI is this?", options: ["Prerenal AKI", "Intrarenal AKI (acute tubular necrosis)", "Postrenal AKI", "Chronic kidney disease"], correct: 1, rationale: "Intrarenal AKI (ATN) is indicated by: BUN/Cr ratio <20:1, urine sodium >40 mEq/L (damaged tubules cannot reabsorb sodium), and muddy brown granular casts (pathognomonic for ATN). Prerenal would show BUN/Cr >20:1, urine Na <20, and no casts." },
      { question: "A patient with prerenal AKI from dehydration receives 2L of IV normal saline. Which finding indicates the treatment is effective?", options: ["Urine output increases to 60 mL/hr", "BUN/Creatinine ratio increases to 25:1", "Serum potassium rises to 5.5 mEq/L", "Blood pressure drops to 90/60 mmHg"], correct: 0, rationale: "Increased urine output indicates improved renal perfusion and recovery from prerenal AKI. The hallmark of prerenal AKI is reduced perfusion - restoring volume should improve GFR and urine output. An increasing BUN/Cr ratio would indicate worsening. Rising potassium and falling BP are adverse findings." }
    ]
  },

  "ckd-pathophysiology-rn": {
    title: "Chronic Kidney Disease: Staging & Complications",
    cellular: {
      title: "CKD: Progressive Nephron Loss",
      content: "Chronic Kidney Disease (CKD) is defined as kidney damage or GFR <60 mL/min/1.73m2 for >=3 months. Progressive nephron loss leads to a cascade of pathophysiological consequences: (1) Decreased GFR causes accumulation of uremic toxins (urea, creatinine, phosphate, organic acids) and inability to regulate fluid/electrolyte/acid-base balance. (2) Erythropoietin (EPO) deficiency develops because the damaged kidneys cannot produce adequate EPO, leading to normocytic normochromic anemia. (3) Phosphate-calcium imbalance: failing kidneys cannot excrete phosphate (hyperphosphatemia), which binds calcium causing hypocalcemia. Hypocalcemia stimulates parathyroid hormone (PTH) secretion (secondary hyperparathyroidism), leading to renal osteodystrophy (bone resorption to release calcium). Additionally, the kidneys cannot convert 25-hydroxyvitamin D to active 1,25-dihydroxyvitamin D (calcitriol), further reducing calcium absorption. (4) Metabolic acidosis from inability to excrete hydrogen ions and regenerate bicarbonate. (5) Uremia causes dysfunction in virtually every organ system. CKD stages by GFR: G1 (>=90, with kidney damage), G2 (60-89), G3a (45-59), G3b (30-44), G4 (15-29), G5 (<15 - kidney failure, dialysis indicated)."
    },
    riskFactors: [
      "Diabetes mellitus - #1 cause of CKD and ESRD (diabetic nephropathy from glomerular damage)",
      "Hypertension - #2 cause (nephrosclerosis from chronic elevated pressure on glomeruli)",
      "Glomerulonephritis (immune-mediated glomerular damage)",
      "Polycystic kidney disease (autosomal dominant - ADPKD)",
      "Recurrent kidney infections/pyelonephritis",
      "Prolonged NSAID use (analgesic nephropathy)",
      "Obstructive uropathy (chronic obstruction causes pressure-mediated damage)",
      "African American race (higher rates of hypertensive nephrosclerosis)",
      "Family history of kidney disease",
      "Obesity and metabolic syndrome"
    ],
    diagnostics: [
      "GFR calculation (CKD-EPI equation): staging basis; <60 for 3+ months confirms CKD",
      "Serum creatinine: elevated (inversely proportional to GFR); small increases represent large GFR changes",
      "BUN: elevated (uremia); >100 mg/dL associated with uremic symptoms",
      "Urinalysis: proteinuria (albuminuria indicates glomerular damage); casts",
      "Albumin-to-creatinine ratio (ACR): >30 mg/g indicates albuminuria; >300 mg/g = severe albuminuria",
      "Serum electrolytes: hyperkalemia, hyperphosphatemia, hypocalcemia, metabolic acidosis",
      "CBC: normocytic normochromic anemia (EPO deficiency)",
      "PTH: elevated (secondary hyperparathyroidism)",
      "Vitamin D (25-OH and 1,25-diOH): deficient active form",
      "Renal ultrasound: small, echogenic kidneys in advanced CKD (except ADPKD which shows enlarged kidneys)"
    ],
    management: [
      "Blood pressure control: target <130/80 mmHg; ACEi or ARB is first-line (reduces proteinuria and slows progression)",
      "Glycemic control in diabetic CKD: target A1C <7% (adjust medications for reduced GFR)",
      "Anemia management: erythropoiesis-stimulating agents (ESAs: epoetin alfa, darbepoetin) when Hgb <10 g/dL; iron supplementation to maintain iron stores",
      "Phosphate management: dietary phosphorus restriction + phosphate binders (sevelamer, calcium acetate) with meals",
      "Calcium and vitamin D: calcitriol or active vitamin D analog supplementation; correct hypocalcemia",
      "Metabolic acidosis: oral sodium bicarbonate supplementation when serum HCO3 <22 mEq/L",
      "Dietary modifications: sodium restriction (<2g/day), potassium restriction (GFR <30), protein restriction (0.6-0.8 g/kg/day in non-dialysis CKD)",
      "Dialysis preparation: referral when GFR <30; AV fistula creation 6 months before anticipated need",
      "Kidney transplant evaluation: preferred treatment for ESRD when feasible"
    ],
    assessmentFindings: [
      "Fatigue and weakness (anemia, uremia)",
      "Nausea, vomiting, anorexia (uremic toxin accumulation)",
      "Peripheral edema and weight gain (fluid retention)",
      "Hypertension (volume overload and RAAS activation)",
      "Pruritus (phosphate crystal deposition in skin, uremic toxins)",
      "Pallor and easy bruising (anemia and platelet dysfunction)",
      "Bone pain and fractures (renal osteodystrophy)",
      "Muscle cramps and restless leg syndrome",
      "Cognitive changes, difficulty concentrating (uremic encephalopathy)",
      "Ammonia breath (uremic fetor) and metallic taste"
    ],
    signs: {
      left: [
        "Fatigue and pallor (anemia)",
        "Peripheral edema (fluid retention)",
        "Hypertension",
        "Nausea and anorexia (uremia)",
        "Pruritus",
        "Bone pain (osteodystrophy)"
      ],
      right: [
        "Ammonia breath (uremic fetor)",
        "Muscle cramps and weakness",
        "Cognitive impairment",
        "Easy bruising (platelet dysfunction)",
        "Kussmaul breathing (metabolic acidosis)",
        "Decreased urine output (late stage)"
      ]
    },
    nursingActions: [
      "Monitor I&O and daily weights - fluid restriction often necessary in advanced CKD",
      "Monitor serum potassium - teach patient about high-potassium foods to avoid (bananas, oranges, potatoes, tomatoes)",
      "Administer phosphate binders WITH meals (must be taken with food to bind dietary phosphorus in the GI tract)",
      "Administer ESAs (epoetin alfa) subcutaneously - monitor hemoglobin (target 10-11.5 g/dL; do not exceed 12)",
      "Monitor blood pressure and administer antihypertensives as ordered; teach self-monitoring",
      "Assess for signs of fluid overload: daily weights, lung sounds, peripheral edema, JVD",
      "Protect vascular access for dialysis: no BP, blood draws, or IVs in the access arm",
      "Assess AV fistula/graft: check for thrill (palpable vibration) and bruit (auscultated turbulent flow) every shift",
      "Provide dietary counseling: low sodium, low potassium, low phosphorus, controlled protein",
      "Monitor for uremic complications: pericarditis (friction rub), encephalopathy (confusion), peripheral neuropathy"
    ],
    medications: [
      { name: "Epoetin Alfa (Epogen/Procrit)", type: "Erythropoiesis-stimulating agent (ESA)", action: "Replaces deficient erythropoietin to stimulate RBC production in bone marrow", sideEffects: "Hypertension (most common), headache, pure red cell aplasia (rare), thrombosis", contra: "Uncontrolled hypertension; FDA black box warning: increased cardiovascular events and tumor progression when Hgb >11 g/dL", pearl: "Target Hgb 10-11.5 g/dL (do NOT normalize); ensure adequate iron stores before initiating (ferritin >200, TSAT >20%)" },
      { name: "Sevelamer (Renagel/Renvela)", type: "Non-calcium phosphate binder", action: "Binds dietary phosphorus in the GI tract, preventing absorption", sideEffects: "Nausea, constipation, abdominal pain", contra: "Bowel obstruction, ileus", pearl: "MUST be taken WITH meals to work; preferred over calcium-based binders to avoid hypercalcemia and vascular calcification" },
      { name: "Calcitriol (Rocaltrol)", type: "Active vitamin D (1,25-dihydroxyvitamin D)", action: "Increases calcium absorption from gut, suppresses PTH secretion", sideEffects: "Hypercalcemia, hyperphosphatemia (if given without phosphate control)", contra: "Hypercalcemia, vitamin D toxicity", pearl: "CKD kidneys cannot activate vitamin D; must give active form (calcitriol) rather than cholecalciferol" },
      { name: "Sodium Bicarbonate", type: "Alkalinizing agent", action: "Buffers metabolic acidosis in CKD when serum HCO3 <22 mEq/L", sideEffects: "Sodium and fluid retention, metabolic alkalosis if over-corrected", contra: "Severe CHF (sodium load), hypernatremia", pearl: "Oral supplementation can slow CKD progression and preserve muscle mass; monitor sodium intake carefully" }
    ],
    pearls: [
      "Diabetes (#1) and hypertension (#2) cause the majority of CKD cases - controlling both is the most important intervention",
      "ACEi/ARBs are renoprotective: they reduce glomerular pressure and proteinuria, slowing CKD progression",
      "Phosphate binders MUST be taken WITH meals - taking them on an empty stomach is ineffective",
      "AV fistula is the preferred dialysis access: lowest infection rate; needs 6-8 weeks to mature before use",
      "Assess AV fistula: feel for THRILL (vibration), listen for BRUIT (whooshing sound); absence indicates thrombosis - EMERGENCY",
      "NEVER take blood pressure, draw blood, or place IVs in the arm with a fistula or graft",
      "ESAs carry an FDA boxed warning: targeting hemoglobin >11 g/dL increases cardiovascular events and mortality",
      "CKD-Mineral Bone Disease (CKD-MBD): hyperphosphatemia leads to hypocalcemia leads to secondary hyperparathyroidism leads to renal osteodystrophy"
    ],
    quiz: [
      { question: "A CKD patient's labs show: calcium 7.8 mg/dL, phosphorus 7.2 mg/dL, PTH 450 pg/mL. What is the pathophysiological sequence?", options: ["Low calcium causes high phosphorus causes high PTH", "High phosphorus binds calcium (hypocalcemia) which stimulates PTH release", "High PTH causes both low calcium and high phosphorus", "Low vitamin D causes all three abnormalities independently"], correct: 1, rationale: "In CKD, failing kidneys cannot excrete phosphate (hyperphosphatemia). Excess phosphate binds calcium, causing hypocalcemia. Low calcium stimulates the parathyroid glands to secrete more PTH (secondary hyperparathyroidism), which pulls calcium from bones (renal osteodystrophy). This is the CKD-MBD cascade." },
      { question: "The nurse palpates an AV fistula in a dialysis patient's left arm and does NOT feel a thrill. What is the PRIORITY action?", options: ["Document the finding and reassess next shift", "Elevate the arm above heart level", "Notify the provider immediately - the fistula may be clotted", "Apply a warm compress and recheck in 30 minutes"], correct: 2, rationale: "Absence of a thrill (and bruit) in an AV fistula indicates thrombosis until proven otherwise. This is a time-sensitive emergency because delayed intervention can result in permanent loss of the access. The provider must be notified immediately for emergent evaluation and possible thrombectomy." },
      { question: "When should a nurse administer sevelamer (Renagel) to a CKD patient?", options: ["On an empty stomach first thing in the morning", "At bedtime with a full glass of water", "With meals (breakfast, lunch, and dinner)", "Only when serum phosphorus exceeds 6.0 mg/dL"], correct: 2, rationale: "Phosphate binders like sevelamer must be taken WITH meals because they work by binding dietary phosphorus in the GI tract, preventing its absorption. Taking them on an empty stomach provides no benefit as there is no phosphorus to bind." }
    ]
  },

  "glomerulonephritis-rn": {
    title: "Renal System Dysfunction: Glomerulonephritis & Nephrotic vs Nephritic Syndrome",
    cellular: {
      title: "Glomerular Disease Mechanisms",
      content: "Glomerular diseases are classified by their clinical presentation into nephritic and nephrotic syndromes. Nephritic syndrome results from inflammation of the glomerular capillaries (glomerulonephritis), causing disruption of the glomerular basement membrane (GBM). Inflammatory cells infiltrate the glomerulus, allowing red blood cells and some protein to pass into the urine. The hallmark is hematuria (often with RBC casts indicating glomerular origin). The inflammatory process reduces GFR, causing oliguria, azotemia, hypertension, and mild-moderate proteinuria (<3.5 g/day). Classic causes include post-streptococcal GN (immune complex deposition 1-3 weeks after group A strep pharyngitis), IgA nephropathy (most common worldwide), and rapidly progressive GN (RPGN - crescentic GN with rapid loss of kidney function). Nephrotic syndrome results from increased glomerular permeability to proteins without significant inflammation. Massive proteinuria (>3.5 g/day) causes hypoalbuminemia, which reduces plasma oncotic pressure and leads to generalized edema (anasarca). Loss of antithrombin III and immunoglobulins increases risk of thromboembolism and infection. Hyperlipidemia develops as the liver increases lipoprotein synthesis in response to low albumin. Key causes include minimal change disease (most common in children), membranous nephropathy, focal segmental glomerulosclerosis (FSGS), and diabetic nephropathy."
    },
    riskFactors: [
      "Recent streptococcal infection (pharyngitis or impetigo) - post-streptococcal GN develops 1-3 weeks later",
      "IgA nephropathy: upper respiratory infection or GI infection triggering IgA deposition",
      "Systemic autoimmune diseases (SLE - lupus nephritis, Goodpasture syndrome, ANCA-associated vasculitis)",
      "Diabetes mellitus (diabetic nephropathy - leading cause of nephrotic syndrome in adults)",
      "Hepatitis B and C (membranous nephropathy, MPGN)",
      "HIV infection (FSGS - collapsing variant)",
      "NSAIDs and certain medications (minimal change disease, interstitial nephritis)",
      "Amyloidosis (nephrotic syndrome from amyloid deposition)",
      "Malignancy (paraneoplastic membranous nephropathy)",
      "African American race (higher risk for FSGS)"
    ],
    diagnostics: [
      "Urinalysis: hematuria with RBC casts (nephritic), heavy proteinuria with lipid/oval fat bodies/fatty casts (nephrotic)",
      "24-hour urine protein or spot urine protein-to-creatinine ratio: <3.5 g/day (nephritic) vs >3.5 g/day (nephrotic)",
      "Serum albumin: low in nephrotic syndrome (<3 g/dL, often <2.5)",
      "Lipid panel: hypercholesterolemia in nephrotic syndrome",
      "Complement levels (C3, C4): low in post-strep GN, lupus nephritis, MPGN",
      "ASO titer and anti-DNase B: elevated in post-streptococcal GN",
      "ANA, anti-dsDNA: positive in lupus nephritis",
      "Anti-GBM antibodies: positive in Goodpasture syndrome",
      "ANCA (p-ANCA, c-ANCA): positive in ANCA-associated vasculitis/GN",
      "Renal biopsy: definitive diagnosis - determines specific glomerular pathology and guides treatment"
    ],
    management: [
      "Nephritic syndrome: treat underlying cause; supportive care with sodium/fluid restriction, antihypertensives (ACEi/ARB), loop diuretics for edema",
      "Post-streptococcal GN: supportive care (most cases self-resolve in children); antibiotics if active strep infection",
      "RPGN: aggressive immunosuppression (pulse methylprednisolone + cyclophosphamide); plasmapheresis for anti-GBM disease and severe ANCA vasculitis",
      "Nephrotic syndrome: ACEi/ARB (reduces proteinuria), sodium restriction, diuretics for edema, statins for hyperlipidemia",
      "Minimal change disease: responds dramatically to corticosteroids (prednisone)",
      "Membranous nephropathy: observation if mild; rituximab or calcineurin inhibitors for moderate-severe",
      "FSGS: corticosteroids +/- calcineurin inhibitors; recurs in transplanted kidney in 30%",
      "DVT prophylaxis in nephrotic syndrome (loss of antithrombin III creates hypercoagulable state)"
    ],
    assessmentFindings: [
      "Nephritic: cola/tea-colored urine (hematuria), oliguria, hypertension, periorbital edema (morning)",
      "Nephrotic: massive peripheral edema/anasarca, weight gain, foamy urine (heavy proteinuria), ascites",
      "Both: fatigue, malaise, decreased urine output",
      "Nephrotic: increased infection susceptibility (immunoglobulin loss in urine)",
      "Nephrotic: signs of DVT/PE (hypercoagulable state - especially renal vein thrombosis)",
      "Post-strep GN: history of sore throat or skin infection 1-3 weeks prior",
      "IgA nephropathy: gross hematuria coinciding with URI (synpharyngitic hematuria)"
    ],
    signs: {
      left: [
        "Cola/tea-colored urine (nephritic)",
        "Foamy urine (nephrotic - proteinuria)",
        "Periorbital edema (morning, nephritic)",
        "Anasarca/massive edema (nephrotic)",
        "Hypertension",
        "Oliguria"
      ],
      right: [
        "Weight gain from fluid retention",
        "Ascites (nephrotic)",
        "Fatigue and malaise",
        "Hyperlipidemia (nephrotic)",
        "DVT/PE risk (nephrotic)",
        "Recurrent infections (nephrotic)"
      ]
    },
    nursingActions: [
      "Monitor I&O and daily weights - report weight gain >1 kg/day",
      "Strict sodium restriction (often <2g/day) and possible fluid restriction",
      "Monitor blood pressure q4h - administer antihypertensives as ordered",
      "Assess edema: measure abdominal girth daily, grade peripheral edema, assess lung sounds",
      "Monitor urine for color changes (hematuria) and foaming (proteinuria)",
      "Collect 24-hour urine specimen accurately for protein quantification",
      "Monitor serum albumin and lipid levels",
      "Implement DVT prevention in nephrotic syndrome: SCDs, anticoagulation if albumin <2.5",
      "Protect against infection in nephrotic patients (immunoglobulin loss); teach handwashing, avoid sick contacts",
      "Administer corticosteroids as ordered; monitor for steroid side effects (glucose elevation, mood changes, GI irritation)"
    ],
    medications: [
      { name: "Prednisone", type: "Corticosteroid", action: "Suppresses immune-mediated glomerular inflammation; first-line for minimal change disease", sideEffects: "Hyperglycemia, weight gain, osteoporosis, mood changes, immunosuppression, cushingoid appearance", contra: "Active infection (relative); monitor glucose closely in diabetics", pearl: "Minimal change disease responds dramatically to steroids (90% remission); other glomerular diseases may require additional immunosuppression" },
      { name: "Cyclophosphamide", type: "Alkylating agent/immunosuppressant", action: "Potent immunosuppression for severe/rapidly progressive GN (RPGN, lupus nephritis)", sideEffects: "Bone marrow suppression, hemorrhagic cystitis, gonadal toxicity, infection risk", contra: "Pregnancy (teratogenic), active infection, bone marrow failure", pearl: "Aggressive hydration and mesna (uroprotectant) required to prevent hemorrhagic cystitis; monitor CBC weekly" },
      { name: "Lisinopril (ACEi)", type: "ACE inhibitor", action: "Reduces intraglomerular pressure and proteinuria by dilating efferent arteriole", sideEffects: "Hyperkalemia, cough, angioedema, acute kidney injury (monitor creatinine after initiation)", contra: "Bilateral renal artery stenosis, pregnancy, angioedema history", pearl: "Cornerstone of proteinuria reduction in both nephritic and nephrotic syndromes; expect 20-30% creatinine rise initially (acceptable if <30%)" }
    ],
    pearls: [
      "Nephritic = inflammation (hematuria, RBC casts, HTN, mild proteinuria) vs Nephrotic = permeability (massive proteinuria, hypoalbuminemia, edema, hyperlipidemia)",
      "RBC casts in urine = glomerular origin of hematuria (pathognomonic for glomerulonephritis)",
      "Post-streptococcal GN: look for history of strep pharyngitis 1-3 weeks prior + low C3 + elevated ASO titer",
      "IgA nephropathy: hematuria DURING or immediately after URI (synpharyngitic) vs post-strep which is 1-3 weeks AFTER",
      "Nephrotic syndrome increases thrombosis risk due to urinary loss of antithrombin III",
      "Nephrotic syndrome increases infection risk due to urinary loss of immunoglobulins (IgG)",
      "ACEi/ARBs reduce proteinuria by 30-50% independently of blood pressure effect"
    ],
    quiz: [
      { question: "A child presents 2 weeks after strep pharyngitis with cola-colored urine, periorbital edema, and BP 148/92. Labs show low C3, elevated ASO titer, and RBC casts on urinalysis. What is the diagnosis?", options: ["Nephrotic syndrome", "Post-streptococcal glomerulonephritis (nephritic syndrome)", "IgA nephropathy", "Minimal change disease"], correct: 1, rationale: "Classic post-strep GN presentation: 1-3 weeks after strep infection, cola-colored urine (hematuria), periorbital edema, hypertension, low complement (C3), elevated ASO titer, and RBC casts (glomerular inflammation). This is a nephritic pattern, not nephrotic." },
      { question: "Which finding BEST differentiates nephrotic syndrome from nephritic syndrome?", options: ["Hypertension", "Proteinuria >3.5 g/day with hypoalbuminemia", "Hematuria", "Elevated creatinine"], correct: 1, rationale: "Massive proteinuria (>3.5 g/day) with resultant hypoalbuminemia is the defining feature of nephrotic syndrome. Both conditions can have some proteinuria, hypertension, and elevated creatinine, but the degree of protein loss distinguishes them. Hematuria with RBC casts is more characteristic of nephritic syndrome." },
      { question: "A patient with nephrotic syndrome (albumin 1.8 g/dL) develops sudden pleuritic chest pain and dyspnea. What complication should the nurse suspect?", options: ["Pneumonia from immunoglobulin loss", "Pulmonary embolism from hypercoagulable state", "Pleural effusion from low oncotic pressure", "Spontaneous pneumothorax"], correct: 1, rationale: "Nephrotic syndrome with severe hypoalbuminemia leads to loss of antithrombin III in urine, creating a hypercoagulable state. PE and renal vein thrombosis are serious complications. Sudden pleuritic chest pain and dyspnea are classic PE symptoms. While infection risk is increased, the acute presentation is more consistent with thromboembolism." }
    ]
  },

  "fluid-volume-imbalances-rn": {
    title: "Fluid Volume Imbalances: Deficit, Excess & Third-Spacing",
    cellular: {
      title: "Fluid Balance Physiology",
      content: "Body fluid homeostasis depends on the balance between fluid intake and output, regulated by ADH (antidiuretic hormone), the RAAS (renin-angiotensin-aldosterone system), and atrial natriuretic peptide (ANP). Total body water is approximately 60% of body weight in adults, distributed between intracellular fluid (ICF, 40%) and extracellular fluid (ECF, 20% - composed of intravascular/plasma 5% and interstitial 15%). Fluid Volume Deficit (FVD/hypovolemia) results from loss of both water and sodium (isotonic loss from hemorrhage, vomiting, diarrhea, excessive diuresis) or water loss exceeding sodium loss (hypotonic loss from DI, sweating). Fluid Volume Excess (FVE/hypervolemia) results from excessive sodium and water retention (heart failure, kidney disease, excessive IV fluids, cirrhosis) or excessive water retention (SIADH). Third-spacing is the shift of fluid from the intravascular space into non-functional compartments (peritoneal cavity = ascites, pleural space = effusion, interstitial space = edema, pericardial space = effusion). Despite total body fluid excess, the patient may be intravascularly depleted. Edema formation depends on Starling forces: increased capillary hydrostatic pressure (HF, fluid overload), decreased plasma oncotic pressure (hypoalbuminemia from liver failure, nephrotic syndrome), increased capillary permeability (sepsis, burns, inflammation), and lymphatic obstruction."
    },
    riskFactors: [
      "FVD: hemorrhage, severe vomiting/diarrhea, excessive diuretic use, burns (massive third-spacing), DKA osmotic diuresis, diabetes insipidus, inadequate fluid intake (elderly, altered consciousness)",
      "FVE: heart failure (reduced cardiac output activates RAAS), kidney disease (impaired sodium/water excretion), cirrhosis (portal hypertension and hypoalbuminemia), excessive IV fluid administration, corticosteroid therapy (sodium retention), SIADH (water retention without sodium)",
      "Third-spacing: post-surgical patients (especially abdominal surgery), burns (first 24-48 hours), sepsis/SIRS (increased capillary permeability), pancreatitis, liver failure with ascites, hypoalbuminemia from any cause"
    ],
    diagnostics: [
      "FVD: elevated BUN/Cr ratio (>20:1, prerenal azotemia), elevated hematocrit (hemoconcentration), elevated urine specific gravity (>1.030), low urine sodium (<20 mEq/L), orthostatic hypotension",
      "FVE: decreased hematocrit (hemodilution), low BUN, low urine specific gravity, chest X-ray showing pulmonary edema/pleural effusion, elevated BNP in heart failure",
      "Serum sodium: may be normal (isotonic imbalance), low (dilutional hyponatremia in FVE), or high (water loss > sodium loss)",
      "Serum osmolality: elevated in dehydration (>295), low in FVE with dilution (<275)",
      "Central venous pressure (CVP): low in FVD (<2 mmHg), elevated in FVE (>8 mmHg)",
      "Daily weights: most reliable indicator of fluid balance (1 kg = 1 liter of fluid)"
    ],
    management: [
      "FVD: IV isotonic crystalloid (0.9% NS or lactated Ringer's) for volume resuscitation; colloids (albumin) for severe hypoalbuminemia",
      "FVD with hemorrhage: blood product replacement (PRBCs, massive transfusion protocol if indicated)",
      "FVE: sodium restriction (<2g/day), fluid restriction (1-1.5 L/day), loop diuretics (furosemide)",
      "FVE with heart failure: optimize cardiac output (afterload reducers, inotropes), diuretics, monitor BNP",
      "Third-spacing: cautious fluid resuscitation (may need IV fluids despite total body excess), albumin to increase oncotic pressure, treat underlying cause",
      "Diuretic-resistant edema: combination diuretic therapy (loop + thiazide = sequential nephron blockade)",
      "Monitor electrolytes closely with any fluid management strategy"
    ],
    assessmentFindings: [
      "FVD: thirst (early), dry mucous membranes, poor skin turgor (tenting), tachycardia, hypotension, orthostatic changes, flat neck veins, decreased urine output, altered mental status (late)",
      "FVE: weight gain, peripheral edema (dependent - ankles/sacrum), pulmonary crackles, dyspnea, orthopnea, JVD, bounding pulse, S3 heart sound, ascites",
      "Third-spacing: signs of both - intravascular depletion (tachycardia, hypotension) despite visible edema, ascites, or effusions"
    ],
    signs: {
      left: [
        "FVD: tachycardia, hypotension",
        "FVD: poor skin turgor, dry membranes",
        "FVD: flat neck veins, thirst",
        "FVD: decreased urine output",
        "FVD: weight loss",
        "FVD: orthostatic hypotension"
      ],
      right: [
        "FVE: bounding pulse, HTN",
        "FVE: JVD, S3 heart sound",
        "FVE: pulmonary crackles, dyspnea",
        "FVE: peripheral edema, ascites",
        "FVE: weight gain",
        "FVE: increased urine output (unless renal cause)"
      ]
    },
    nursingActions: [
      "Daily weights at same time, scale, and clothing - most accurate measure of fluid status (1 kg = 1 L fluid)",
      "Strict I&O: record all intake (IV, PO, tube feeds, flushes) and output (urine, emesis, drains, diarrhea, wounds)",
      "Assess vital signs for orthostatic changes (FVD): BP drop >20 systolic and/or HR increase >20 upon standing",
      "Assess skin turgor (clavicle/forehead in elderly - avoid hand dorsum due to age-related changes)",
      "Assess mucous membranes, tongue furrows, and thirst (FVD indicators)",
      "Auscultate lung sounds every 4 hours - crackles indicate FVE/pulmonary edema",
      "Measure abdominal girth daily for ascites assessment (mark level with pen for consistency)",
      "Administer IV fluids at prescribed rate - use IV pump; monitor for fluid overload in elderly/cardiac patients",
      "Implement fluid restriction if ordered: distribute fluid intake across meals and shifts, offer ice chips (count as half volume)",
      "Elevate edematous extremities; assess for pitting edema and document grade (1+ to 4+)"
    ],
    medications: [
      { name: "0.9% Normal Saline", type: "Isotonic crystalloid", action: "Expands intravascular volume; replaces both sodium and water in isotonic depletion", sideEffects: "Hyperchloremic metabolic acidosis with large volumes, fluid overload", contra: "Heart failure (use cautiously), hypernatremia", pearl: "Isotonic - stays in extravascular space; only 25% remains intravascular after 1 hour; large volumes can cause dilutional acidosis" },
      { name: "Lactated Ringer's (LR)", type: "Isotonic balanced crystalloid", action: "Volume expansion with more physiologic electrolyte composition than NS; contains lactate (metabolized to bicarbonate)", sideEffects: "Hyperkalemia (contains 4 mEq/L K+), metabolic alkalosis", contra: "Hyperkalemia, severe liver disease (cannot metabolize lactate)", pearl: "Preferred over NS for large-volume resuscitation (less acidosis); NEVER use with blood products (calcium in LR causes clotting)" },
      { name: "Furosemide (Lasix)", type: "Loop diuretic", action: "Blocks Na-K-2Cl cotransporter in ascending loop of Henle; potent diuresis", sideEffects: "Hypokalemia, hyponatremia, ototoxicity (rapid IV push), dehydration, metabolic alkalosis", contra: "Anuria, severe hypovolemia, sulfa allergy (possible cross-reactivity)", pearl: "Onset IV 5 min, PO 30-60 min; monitor K+ and replace as needed; IV push should be given no faster than 20mg/min to prevent ototoxicity" },
      { name: "25% Albumin", type: "Colloid", action: "Increases plasma oncotic pressure, drawing fluid from interstitial space into intravascular compartment", sideEffects: "Fluid overload (pulls fluid intravascularly), allergic reaction", contra: "Severe heart failure, anemia (hemodilution)", pearl: "Used for third-spacing with hypoalbuminemia; 25% is hyperoncotic (use when you want to pull fluid INTO the vessels); 5% is iso-oncotic (volume expander)" }
    ],
    pearls: [
      "Daily weight is the MOST reliable indicator of fluid status - 1 kg weight change = 1 liter of fluid",
      "Orthostatic vital signs: significant if SBP drops >20 mmHg or HR increases >20 bpm upon standing",
      "Third-spacing: patient may look edematous but be intravascularly depleted - treat the circulation, not the edema",
      "Never use LR with blood products - calcium in LR can cause clotting in the transfusion line",
      "Skin turgor should be assessed on the clavicle or forehead in elderly patients (poor turgor on hand dorsum is normal aging)",
      "IV furosemide must be pushed slowly (no faster than 20 mg/min) to prevent ototoxicity",
      "In FVE, fluid restriction should be distributed: 50% day shift, 25% evening, 25% night"
    ],
    quiz: [
      { question: "A patient post-abdominal surgery has BP 92/60, HR 118, edematous extremities, and a distended abdomen. What fluid imbalance does this represent?", options: ["Simple fluid volume deficit", "Simple fluid volume excess", "Third-spacing (intravascular depletion despite extravascular excess)", "Dehydration"], correct: 2, rationale: "Third-spacing occurs when fluid shifts from the intravascular space into non-functional compartments (peritoneal cavity, interstitial space). The patient shows signs of intravascular depletion (hypotension, tachycardia) despite visible edema and abdominal distension (ascites). Treatment requires cautious IV fluid resuscitation despite the edema." },
      { question: "Which assessment finding BEST indicates fluid volume deficit?", options: ["Bounding pulse", "Orthostatic hypotension with flat neck veins", "JVD and peripheral edema", "Weight gain of 2 kg overnight"], correct: 1, rationale: "Orthostatic hypotension (BP drop upon standing) with flat neck veins indicates reduced intravascular volume. Bounding pulse, JVD, edema, and weight gain are signs of fluid volume excess. The combination of low filling pressures and positional BP changes is specific for hypovolemia." },
      { question: "A nurse is managing fluid restriction of 1200 mL/day. How should this be distributed?", options: ["Give all 1200 mL in the morning when the patient is most thirsty", "600 mL day shift, 300 mL evening, 300 mL night", "400 mL each shift equally", "No specific distribution - just track total intake"], correct: 1, rationale: "Fluid restriction is typically distributed with 50% during the day shift (when most meals and medications occur), 25% during the evening shift, and 25% during the night shift. This ensures adequate fluid for medication administration and meals while maintaining the restriction." }
    ]
  },

  "sodium-imbalances-rn": {
    title: "Sodium Imbalances: Hyponatremia & Hypernatremia",
    cellular: {
      title: "Sodium Balance and Osmolality",
      content: "Sodium (Na+) is the primary extracellular cation (normal 135-145 mEq/L) and the major determinant of serum osmolality. Sodium imbalances are fundamentally water balance disorders. Hyponatremia (<135 mEq/L) occurs when there is excess water relative to sodium. In dilutional hyponatremia (most common), total body water increases while sodium may be normal or even elevated. SIADH (syndrome of inappropriate ADH) is a classic cause - excessive ADH causes water retention, diluting sodium while maintaining euvolemia or mild hypervolemia. Other causes: heart failure (low effective circulating volume triggers ADH), cirrhosis, hypothyroidism, and polydipsia. Cerebral effects are critical: as serum osmolality drops, water moves into brain cells by osmosis, causing cerebral edema. Acute hyponatremia (<48 hours) is more dangerous than chronic because the brain has not had time to adapt (lose intracellular solutes). Hypernatremia (>145 mEq/L) occurs when water loss exceeds sodium loss or sodium intake exceeds water. Diabetes insipidus (central or nephrogenic) produces dilute urine despite high serum osmolality due to absent or ineffective ADH. Water moves OUT of brain cells, causing cellular shrinkage, tearing of bridging veins, and potential intracranial hemorrhage. Correction of either condition must be gradual: overly rapid correction of chronic hyponatremia causes osmotic demyelination syndrome (ODS/central pontine myelinolysis), while overly rapid correction of hypernatremia causes cerebral edema."
    },
    riskFactors: [
      "Hyponatremia: SIADH (lung cancer, CNS disorders, medications - SSRIs, carbamazepine), heart failure, cirrhosis, thiazide diuretics, excessive hypotonic IV fluids, psychogenic polydipsia, marathon running (exercise-associated hyponatremia), adrenal insufficiency, hypothyroidism",
      "Hypernatremia: diabetes insipidus (central or nephrogenic), inadequate water intake (elderly with impaired thirst, altered consciousness), excessive sodium intake (hypertonic saline, sodium bicarbonate), osmotic diuresis (hyperglycemia, mannitol), watery diarrhea, fever with insensible losses, burns"
    ],
    diagnostics: [
      "Serum sodium: <135 (hyponatremia), >145 (hypernatremia); <120 or >160 = severe/life-threatening",
      "Serum osmolality: <275 (hypoosmolar - true hyponatremia), >295 (hyperosmolar - hypernatremia or pseudohyponatremia)",
      "Urine osmolality: helps differentiate causes; >100 in SIADH (concentrated urine despite dilute serum)",
      "Urine sodium: >40 mEq/L in SIADH and renal sodium wasting; <20 in heart failure, cirrhosis",
      "Water deprivation test: differentiates central from nephrogenic DI; central DI concentrates urine after desmopressin",
      "ADH level: elevated in SIADH, low/absent in central DI",
      "CT/MRI brain: for severe hyponatremia to assess cerebral edema; for central DI to evaluate pituitary",
      "TSH and cortisol: rule out hypothyroidism and adrenal insufficiency as causes of hyponatremia"
    ],
    management: [
      "Mild chronic hyponatremia (>125): fluid restriction 1-1.5 L/day, sodium supplementation, treat cause",
      "Severe symptomatic hyponatremia (<120 with seizures/altered MS): 3% hypertonic saline (100-150 mL bolus); correct no faster than 8-10 mEq/L per 24 hours",
      "SIADH: fluid restriction (first-line), demeclocycline or tolvaptan (vasopressin antagonist) for chronic SIADH",
      "Hypernatremia: replace free water deficit with hypotonic fluids (D5W or 0.45% NS); correct no faster than 10-12 mEq/L per 24 hours",
      "Central DI: desmopressin (DDAVP) - synthetic ADH replacement",
      "Nephrogenic DI: thiazide diuretics (paradoxically reduce urine output), NSAIDs, low-sodium diet, adequate water intake",
      "Monitor sodium levels every 2-4 hours during active correction"
    ],
    assessmentFindings: [
      "Hyponatremia: headache, nausea/vomiting, confusion, lethargy, seizures, coma (severe <120 mEq/L)",
      "Hyponatremia: muscle cramps, weakness, decreased deep tendon reflexes",
      "Hypernatremia: intense thirst (if conscious), restlessness, agitation, confusion, lethargy, coma (severe >160)",
      "Hypernatremia: dry sticky mucous membranes, flushed skin, oliguria (if not DI), fever",
      "DI-related hypernatremia: massive dilute urine output (5-20 L/day), intense thirst, low urine specific gravity (<1.005)"
    ],
    signs: {
      left: [
        "Hyponatremia: headache, nausea, confusion",
        "Hyponatremia: seizures (severe, <120)",
        "Hyponatremia: muscle cramps, weakness",
        "Hyponatremia: decreased DTRs",
        "Hyponatremia: lethargy progressing to coma",
        "Hyponatremia: weight gain (dilutional)"
      ],
      right: [
        "Hypernatremia: intense thirst",
        "Hypernatremia: restlessness, agitation",
        "Hypernatremia: dry mucous membranes",
        "Hypernatremia: confusion, lethargy",
        "Hypernatremia: increased DTRs",
        "Hypernatremia: fever, flushed skin"
      ]
    },
    nursingActions: [
      "Monitor sodium levels every 2-4 hours during active correction - correction rate is critical",
      "Implement seizure precautions for severe hyponatremia (<120 mEq/L)",
      "Administer 3% hypertonic saline via IV pump through a central line when ordered; never give as a rapid bolus (risk of ODS)",
      "Monitor neurological status q1-2h: LOC, orientation, pupil response, motor function",
      "Implement fluid restriction for SIADH: educate patient, distribute fluids across shifts, offer ice chips",
      "For DI patients: ensure free access to water, accurate I&O (urine output may exceed 200 mL/hr)",
      "Administer desmopressin as ordered for central DI; monitor urine output response",
      "Assess for overcorrection: if sodium corrects too fast (>10-12 mEq/L in 24h for hyponatremia), alert provider immediately",
      "Monitor for osmotic demyelination syndrome: dysarthria, dysphagia, quadriparesis developing 2-6 days after rapid correction"
    ],
    medications: [
      { name: "3% Hypertonic Saline", type: "Concentrated sodium solution", action: "Rapidly raises serum sodium in severe symptomatic hyponatremia by drawing water out of cells via osmosis", sideEffects: "Osmotic demyelination syndrome if corrected too rapidly, volume overload, phlebitis", contra: "Asymptomatic hyponatremia (use fluid restriction instead)", pearl: "Must give via IV pump through central line; correct sodium no faster than 8-10 mEq/L in first 24 hours; check sodium q2h" },
      { name: "Desmopressin (DDAVP)", type: "Synthetic ADH analog", action: "Acts on V2 receptors in collecting ducts to increase water reabsorption; treats central DI", sideEffects: "Water retention, hyponatremia (overcorrection), headache", contra: "Type IIB von Willebrand disease, habitual polydipsia (risk of water intoxication)", pearl: "Available IV, SC, intranasal, PO; monitor urine output and serum sodium closely; patients with central DI should have a medical alert bracelet" },
      { name: "Tolvaptan (Samsca)", type: "Vasopressin V2 receptor antagonist (vaptan)", action: "Blocks ADH action on collecting ducts, causing aquaresis (water excretion without sodium loss)", sideEffects: "Thirst, dry mouth, polyuria, hypernatremia, hepatotoxicity (FDA boxed warning)", contra: "Hypovolemic hyponatremia, inability to sense or respond to thirst, use >30 days (hepatotoxicity)", pearl: "Used for euvolemic/hypervolemic hyponatremia (SIADH, HF); must be initiated in hospital with sodium monitoring q6-8h; do NOT use with fluid restriction (risk of overcorrection)" },
      { name: "Demeclocycline", type: "Tetracycline antibiotic", action: "Induces partial nephrogenic DI by reducing renal response to ADH; used for chronic SIADH", sideEffects: "Photosensitivity, nephrotoxicity, nausea, dental staining", contra: "Children <8, pregnancy, renal impairment", pearl: "Takes 3-5 days to achieve effect; used when fluid restriction alone fails for chronic SIADH; being replaced by tolvaptan" }
    ],
    pearls: [
      "Hyponatremia is a WATER problem, not a sodium problem - there is too much water relative to sodium",
      "Correction rate for chronic hyponatremia: no more than 8-10 mEq/L in 24 hours to prevent osmotic demyelination syndrome (ODS)",
      "ODS presents 2-6 days after overly rapid correction: locked-in syndrome, quadriparesis, dysphagia, dysarthria",
      "SIADH vs DI are opposites: SIADH = too much ADH (dilute serum, concentrated urine); DI = too little ADH (concentrated serum, dilute urine)",
      "In SIADH the patient is euvolemic/mildly hypervolemic - there is no edema (ADH causes proportional water retention)",
      "Central DI responds to desmopressin; nephrogenic DI does not (the kidneys do not respond to ADH)",
      "Seizures in hyponatremia occur because brain cell swelling from osmotic water influx increases intracranial pressure"
    ],
    quiz: [
      { question: "A post-neurosurgery patient produces 800 mL of dilute urine in 2 hours. Serum sodium is 152 mEq/L, urine specific gravity 1.002. What condition does the nurse suspect?", options: ["SIADH", "Central diabetes insipidus", "Osmotic diuresis from hyperglycemia", "Normal postoperative diuresis"], correct: 1, rationale: "Central DI commonly occurs after pituitary/neurosurgery. It presents with massive dilute urine output (low specific gravity <1.005), hypernatremia (water loss exceeds sodium), and dehydration. SIADH would cause concentrated urine and hyponatremia. Osmotic diuresis would show normal or elevated urine specific gravity." },
      { question: "A patient with chronic SIADH has sodium 118 mEq/L. The provider orders 3% hypertonic saline. Over 24 hours, sodium corrects from 118 to 130 mEq/L. What complication should the nurse monitor for?", options: ["Seizures from persistent hyponatremia", "Osmotic demyelination syndrome from too-rapid correction", "Hyperkalemia", "Acute kidney injury"], correct: 1, rationale: "Correction of 12 mEq/L in 24 hours exceeds the safe rate of 8-10 mEq/L per 24 hours for chronic hyponatremia. This places the patient at risk for osmotic demyelination syndrome (central pontine myelinolysis), which presents 2-6 days later with dysarthria, dysphagia, and quadriparesis." },
      { question: "Which laboratory finding differentiates SIADH from diabetes insipidus?", options: ["Serum glucose level", "Urine osmolality: high in SIADH, low in DI", "BUN/creatinine ratio", "Serum calcium level"], correct: 1, rationale: "In SIADH, excess ADH causes water retention with concentrated urine (high urine osmolality >100) despite dilute serum. In DI, absent/ineffective ADH causes dilute urine (low urine osmolality <200) despite concentrated serum. Both conditions alter sodium but in opposite directions." }
    ]
  },

  "potassium-imbalances-rn": {
    title: "Potassium Imbalances: Hypokalemia & Hyperkalemia",
    cellular: {
      title: "Potassium Homeostasis and Cardiac Effects",
      content: "Potassium (K+) is the primary intracellular cation (normal serum 3.5-5.0 mEq/L), with 98% residing inside cells. This steep concentration gradient across cell membranes is maintained by the Na+/K+-ATPase pump and is essential for maintaining resting membrane potential, which governs cardiac conduction, skeletal muscle contraction, and nerve impulse transmission. Hypokalemia (<3.5 mEq/L) causes hyperpolarization of cells, making them harder to depolarize. In the heart, this manifests as flattened T waves, prominent U waves, ST depression, and risk of ventricular arrhythmias (PVCs, V-tach, torsades de pointes). Skeletal muscle effects include weakness, cramping, and paralytic ileus. Hypokalemia also impairs insulin release and concentrating ability of the kidneys. Hyperkalemia (>5.0 mEq/L) causes partial depolarization of cells, disrupting normal cardiac conduction. ECG changes progress with severity: peaked (tall, narrow) T waves (5.5-6.5), PR prolongation and P wave flattening (6.5-7.5), widened QRS (7.0-8.0), sine wave pattern (>8.0), ventricular fibrillation or asystole. The insulin-glucose mechanism is used therapeutically: insulin activates Na+/K+-ATPase, driving K+ from serum into cells, temporarily lowering serum K+."
    },
    riskFactors: [
      "Hypokalemia: loop diuretics (furosemide - most common cause), thiazide diuretics, vomiting/NG suction (metabolic alkalosis shifts K+ intracellularly), diarrhea (direct GI K+ loss), alkalosis (H+/K+ exchange), insulin administration, beta-2 agonists (albuterol), corticosteroids, hypomagnesemia (prevents K+ correction)",
      "Hyperkalemia: acute/chronic kidney disease (most common cause - impaired K+ excretion), potassium-sparing diuretics (spironolactone), ACE inhibitors/ARBs, NSAIDs, acidosis (H+/K+ exchange - K+ moves out of cells), rhabdomyolysis (massive K+ release from damaged muscle), hemolysis, tissue necrosis/burns, excessive K+ supplementation, succinylcholine"
    ],
    diagnostics: [
      "Serum potassium: <3.5 hypokalemia, >5.0 hyperkalemia; <2.5 or >6.5 = life-threatening",
      "ECG: hypokalemia shows flattened T waves, U waves, ST depression, prolonged QT; hyperkalemia shows peaked T waves, widened QRS, absent P waves, sine wave",
      "Serum magnesium: must be checked and corrected in hypokalemia (hypomagnesemia prevents K+ correction)",
      "ABG: alkalosis shifts K+ intracellularly (each 0.1 pH increase lowers K+ by ~0.3-0.5 mEq/L); acidosis shifts K+ extracellularly",
      "Serum creatinine/GFR: assess renal function (kidneys are primary K+ excretion route)",
      "Digoxin level: hypokalemia potentiates digoxin toxicity (both compete for Na+/K+-ATPase)",
      "Urine potassium: >20 mEq/L suggests renal K+ wasting; <20 suggests extrarenal losses"
    ],
    management: [
      "Mild hypokalemia (3.0-3.5): oral potassium supplementation (KCl 40-80 mEq/day in divided doses with food)",
      "Severe hypokalemia (<3.0) or symptomatic: IV potassium (10-20 mEq/hr via peripheral line, up to 40 mEq/hr via central line with cardiac monitoring); NEVER give IV push",
      "Correct hypomagnesemia first - hypokalemia is refractory to K+ replacement until magnesium is corrected",
      "Hyperkalemia emergency (ECG changes or K+ >6.5): calcium gluconate IV (cardiac protection) -> insulin + glucose (K+ shifting) -> sodium bicarbonate if acidotic -> kayexalate or patiromer (K+ elimination) -> dialysis if refractory",
      "Hyperkalemia without ECG changes: kayexalate/patiromer, loop diuretic, dietary K+ restriction, discontinue offending drugs",
      "Remove potassium from IV fluids and diet when hyperkalemic",
      "Address underlying cause in both conditions"
    ],
    assessmentFindings: [
      "Hypokalemia: muscle weakness (especially legs), cramping, fatigue, decreased reflexes, paralytic ileus (abdominal distension, absent bowel sounds), cardiac arrhythmias",
      "Hypokalemia: polyuria and polydipsia (kidney concentrating defect)",
      "Hyperkalemia: muscle weakness progressing to flaccid paralysis, paresthesias (tingling), abdominal cramping, diarrhea",
      "Hyperkalemia: cardiac arrhythmias (the most dangerous manifestation - can be fatal)",
      "Hyperkalemia: bradycardia progressing to heart block and cardiac arrest"
    ],
    signs: {
      left: [
        "Hypokalemia: flattened T waves on ECG",
        "Hypokalemia: U waves (pathognomonic)",
        "Hypokalemia: ST depression",
        "Hypokalemia: prolonged QT interval",
        "Hypokalemia: muscle weakness, cramps",
        "Hypokalemia: decreased bowel sounds (ileus)"
      ],
      right: [
        "Hyperkalemia: peaked (tall, narrow) T waves",
        "Hyperkalemia: widened QRS complex",
        "Hyperkalemia: absent P waves",
        "Hyperkalemia: sine wave pattern (pre-arrest)",
        "Hyperkalemia: muscle weakness, paresthesias",
        "Hyperkalemia: bradycardia, heart block"
      ]
    },
    nursingActions: [
      "NEVER give IV potassium as a bolus or IV push - always dilute and infuse via pump (risk of fatal cardiac arrest)",
      "Maximum peripheral IV K+ rate: 10-20 mEq/hr; central line: up to 40 mEq/hr with continuous cardiac monitoring",
      "Place patient on continuous cardiac monitor if K+ <3.0 or >5.5 mEq/L",
      "Administer oral potassium with food or large glass of water to prevent GI irritation",
      "Assess for hypomagnesemia - replace magnesium before potassium (refractory hypokalemia if Mg2+ is low)",
      "Monitor digoxin patients closely: hypokalemia increases digoxin toxicity risk",
      "For hyperkalemia: have emergency medications at bedside (calcium gluconate, insulin, D50W)",
      "Assess neuromuscular function: muscle strength, DTRs, bowel sounds (hypokalemia causes ileus)",
      "Review medication list for K+-altering drugs: diuretics, ACEi, ARBs, spironolactone, NSAIDs",
      "Dietary teaching: high-K+ foods (bananas, oranges, potatoes, tomatoes, avocados, spinach) for hypokalemia; restrict these for hyperkalemia"
    ],
    medications: [
      { name: "Potassium Chloride (KCl) IV", type: "Electrolyte replacement", action: "Directly replaces potassium deficit; KCl preferred because chloride corrects concurrent metabolic alkalosis", sideEffects: "Cardiac arrest if given too fast (bolus is FATAL), phlebitis (peripheral IV), GI irritation (PO)", contra: "Hyperkalemia, renal failure without monitoring", pearl: "NEVER give IV push; always dilute (max 40 mEq/L peripheral, 80 mEq/L central); maximum 10-20 mEq/hr peripheral; requires cardiac monitoring if rate >10 mEq/hr" },
      { name: "Calcium Gluconate 10%", type: "Cardiac membrane stabilizer", action: "Directly antagonizes K+ effect on cardiac membrane potential; restores normal threshold; does NOT lower K+", sideEffects: "Bradycardia, tissue necrosis with extravasation, digoxin toxicity potentiation", contra: "Digoxin use (give with extreme caution - may precipitate fatal arrhythmia)", pearl: "First drug in hyperkalemia emergency; onset 1-3 minutes, duration 30-60 minutes; provides a safety window while other treatments lower K+" },
      { name: "Regular Insulin + D50W", type: "Potassium-shifting agent", action: "Insulin activates Na+/K+-ATPase pump, driving K+ from extracellular to intracellular space", sideEffects: "Hypoglycemia (monitor glucose q30min for 4 hours), temporary effect only (4-6 hours)", contra: "None in emergency (benefits outweigh risks)", pearl: "Give 10 units regular insulin IV + 25g D50W; lowers K+ by 0.5-1.2 mEq/L in 15-30 minutes; TEMPORARY - must follow with K+ elimination strategies" },
      { name: "Sodium Polystyrene Sulfonate (Kayexalate)", type: "Cation exchange resin", action: "Binds K+ in the GI tract in exchange for sodium; excretes K+ in stool", sideEffects: "Hypernatremia, intestinal necrosis (rare, serious), constipation", contra: "Ileus, bowel obstruction, post-surgical patients", pearl: "One of few treatments that actually removes K+ from the body; onset 1-2 hours; often given with sorbitol to promote bowel movement; newer agent patiromer (Veltassa) has fewer GI side effects" }
    ],
    pearls: [
      "IV potassium KILLS if given too fast - NEVER give as IV push or undiluted bolus",
      "U waves on ECG are pathognomonic for hypokalemia",
      "Peaked T waves are the earliest ECG sign of hyperkalemia",
      "Correct magnesium BEFORE potassium - hypokalemia is refractory to replacement if Mg2+ is depleted",
      "Alkalosis causes hypokalemia (K+ shifts into cells); acidosis causes hyperkalemia (K+ shifts out of cells) - pH and K+ move in opposite directions",
      "Each 0.1 pH change alters serum K+ by ~0.3-0.5 mEq/L in the opposite direction",
      "Hypokalemia potentiates digoxin toxicity - monitor K+ closely in patients on digoxin",
      "In hyperkalemia, calcium gluconate is FIRST because it works in 1-3 minutes to stabilize the heart; insulin/glucose is SECOND to shift K+ into cells"
    ],
    quiz: [
      { question: "A patient on furosemide has K+ 2.8 mEq/L. The ECG shows flattened T waves and prominent U waves. IV KCl is ordered. What is the maximum safe infusion rate via peripheral IV?", options: ["5 mEq/hr", "10-20 mEq/hr", "40 mEq/hr", "80 mEq/hr IV push"], correct: 1, rationale: "Maximum peripheral IV potassium infusion rate is 10-20 mEq/hr. Higher rates (up to 40 mEq/hr) require central line access and continuous cardiac monitoring. IV push potassium is NEVER given - it causes fatal cardiac arrest. Always use an IV pump for potassium infusions." },
      { question: "A patient with K+ 7.2 mEq/L has peaked T waves and a widened QRS on the monitor. The nurse has administered calcium gluconate. Which medication should be given NEXT?", options: ["Kayexalate PO", "Regular insulin 10 units IV with D50W", "Oral potassium restriction", "Furosemide 40 mg IV"], correct: 1, rationale: "After calcium gluconate stabilizes the heart (works in minutes), insulin + D50W is the next priority because it rapidly shifts K+ into cells within 15-30 minutes. Kayexalate removes K+ from the body but takes hours. Dietary restriction and furosemide are important but slower-acting." },
      { question: "A patient with hypokalemia is not responding to potassium replacement. Serum magnesium is 1.2 mEq/L (low). What should the nurse do?", options: ["Increase the potassium infusion rate", "Request magnesium replacement - hypokalemia is refractory without correcting hypomagnesemia", "Switch from KCl to potassium bicarbonate", "Administer potassium via nasogastric tube"], correct: 1, rationale: "Hypomagnesemia must be corrected before hypokalemia will respond to K+ replacement. Magnesium is required for proper Na+/K+-ATPase pump function. Without adequate magnesium, potassium leaks out of cells through ROMK channels, making replacement futile. This is a commonly tested concept." }
    ]
  },

  "calcium-phosphate-imbalances-rn": {
    title: "Calcium & Phosphate Imbalances",
    cellular: {
      title: "Calcium-Phosphate-PTH Axis",
      content: "Calcium (Ca2+, normal total 8.5-10.5 mg/dL, ionized 4.5-5.5 mg/dL) is essential for muscle contraction, cardiac conduction, blood clotting, and nerve impulse transmission. Only ionized (free) calcium is physiologically active; approximately 40% is bound to albumin. The calcium-phosphate-PTH axis maintains homeostasis: when calcium drops, parathyroid hormone (PTH) is released, which (1) increases osteoclastic bone resorption (releases Ca2+ and PO4 from bone), (2) increases renal calcium reabsorption and phosphate excretion, and (3) activates vitamin D (calcitriol) in the kidneys, increasing intestinal calcium absorption. Calcium and phosphate have an inverse relationship: when one rises, the other falls. Hypocalcemia (<8.5 mg/dL) increases neuromuscular excitability because low extracellular Ca2+ lowers the threshold for nerve depolarization, causing tetany, paresthesias, and Chvostek/Trousseau signs. Hypercalcemia (>10.5 mg/dL) decreases neuromuscular excitability, causing muscle weakness, constipation, and cardiac conduction abnormalities (shortened QT). Severe hypercalcemia (>14 mg/dL) is a medical emergency with risk of cardiac arrest. Always correct calcium for albumin level: corrected Ca = measured Ca + 0.8 x (4.0 - albumin)."
    },
    riskFactors: [
      "Hypocalcemia: hypoparathyroidism (post-thyroidectomy most common cause), vitamin D deficiency, chronic kidney disease (cannot activate vitamin D), hypomagnesemia (impairs PTH secretion), acute pancreatitis (saponification - calcium binds to fatty acids), massive blood transfusion (citrate binds calcium), malabsorption syndromes",
      "Hypercalcemia: primary hyperparathyroidism (#1 outpatient cause - PTH adenoma), malignancy (#1 inpatient cause - PTHrP, bone metastases, myeloma), excessive vitamin D intake, thiazide diuretics (reduce renal Ca2+ excretion), prolonged immobility (bone resorption), granulomatous diseases (sarcoidosis - ectopic vitamin D production), milk-alkali syndrome",
      "Hyperphosphatemia: CKD (cannot excrete PO4), hypoparathyroidism, rhabdomyolysis, tumor lysis syndrome",
      "Hypophosphatemia: refeeding syndrome (insulin drives PO4 into cells), alcoholism, vitamin D deficiency, hyperparathyroidism"
    ],
    diagnostics: [
      "Serum calcium (total and ionized): ionized is more accurate as it is unaffected by albumin levels",
      "Corrected calcium = measured Ca + 0.8 x (4.0 - albumin) when albumin is low",
      "Serum phosphorus: inverse relationship with calcium (normal 2.5-4.5 mg/dL)",
      "PTH level: elevated in hyperparathyroidism and secondary hyperparathyroidism (CKD); low in hypoparathyroidism",
      "Vitamin D levels (25-OH and 1,25-diOH): deficiency causes hypocalcemia",
      "Serum magnesium: must be checked with hypocalcemia (Mg2+ required for PTH secretion and action)",
      "ECG: hypocalcemia shows prolonged QT interval; hypercalcemia shows shortened QT, widened T wave, possible heart block",
      "Chvostek sign: facial twitching when tapping facial nerve anterior to ear (hypocalcemia)",
      "Trousseau sign: carpal spasm when BP cuff inflated above systolic for 3 minutes (more specific for hypocalcemia)"
    ],
    management: [
      "Acute symptomatic hypocalcemia: IV calcium gluconate 10% (preferred peripheral; calcium chloride central line only - very irritating); monitor ECG",
      "Chronic hypocalcemia: oral calcium + vitamin D supplementation; calcitriol if renal disease",
      "Post-thyroidectomy: monitor calcium q6-12h for 24-48 hours; have IV calcium at bedside",
      "Mild hypercalcemia (10.5-12): hydration + treat cause; avoid thiazide diuretics",
      "Moderate-severe hypercalcemia (>12): aggressive IV NS hydration (200-300 mL/hr) + furosemide (after volume repletion) + calcitonin + bisphosphonate (zoledronic acid) + treat underlying cause",
      "Hypercalcemia of malignancy: bisphosphonates (zoledronic acid IV) or denosumab; treat the cancer",
      "Hyperphosphatemia: dietary restriction + phosphate binders with meals (sevelamer, calcium acetate)",
      "Hypophosphatemia: oral or IV phosphate replacement; correct slowly to avoid precipitation of calcium-phosphate"
    ],
    assessmentFindings: [
      "Hypocalcemia: numbness/tingling (perioral, fingers, toes), muscle cramps and spasms, hyperactive DTRs, positive Chvostek and Trousseau signs, laryngospasm (life-threatening), seizures, prolonged QT on ECG",
      "Hypercalcemia: 'Bones, stones, groans, and psychiatric overtones' - bone pain, kidney stones, constipation/abdominal pain, confusion/lethargy/psychosis",
      "Hypercalcemia: muscle weakness, decreased DTRs, polyuria/polydipsia, nausea/vomiting, shortened QT",
      "Hyperphosphatemia: symptoms of the associated hypocalcemia (tetany, paresthesias); calcification of soft tissues with chronic elevation",
      "Hypophosphatemia: severe muscle weakness (including respiratory muscles), rhabdomyolysis, hemolytic anemia, confusion"
    ],
    signs: {
      left: [
        "Hypocalcemia: Chvostek sign (facial twitch)",
        "Hypocalcemia: Trousseau sign (carpal spasm)",
        "Hypocalcemia: hyperactive DTRs, tetany",
        "Hypocalcemia: prolonged QT interval",
        "Hypocalcemia: laryngospasm, stridor",
        "Hypocalcemia: seizures"
      ],
      right: [
        "Hypercalcemia: muscle weakness",
        "Hypercalcemia: decreased DTRs",
        "Hypercalcemia: shortened QT interval",
        "Hypercalcemia: constipation, abdominal pain",
        "Hypercalcemia: confusion, lethargy",
        "Hypercalcemia: polyuria, kidney stones"
      ]
    },
    nursingActions: [
      "Post-thyroidectomy: have IV calcium gluconate at bedside; check Chvostek/Trousseau signs; monitor for stridor/laryngospasm",
      "Administer IV calcium gluconate slowly (over 10-20 minutes) on a pump with cardiac monitoring",
      "Assess Chvostek sign: tap facial nerve in front of ear - positive = ipsilateral facial twitching",
      "Assess Trousseau sign: inflate BP cuff above systolic for 3 minutes - positive = carpal spasm (hand flexion)",
      "Monitor ECG continuously for severe calcium imbalances (prolonged QT in hypocalcemia, shortened QT in hypercalcemia)",
      "For hypercalcemia: encourage ambulation (prevents further bone resorption), maintain IV fluid hydration 200-300 mL/hr",
      "Monitor for digitalis toxicity in hypercalcemia (calcium potentiates digoxin effect, similar to hypokalemia)",
      "Administer phosphate binders WITH meals in hyperphosphatemia",
      "Seizure precautions for severe hypocalcemia (Ca <7.0 mg/dL)",
      "Keep tracheostomy tray at bedside for post-thyroidectomy patients (risk of laryngospasm from hypocalcemia)"
    ],
    medications: [
      { name: "Calcium Gluconate 10%", type: "Calcium supplement (IV)", action: "Replaces calcium deficit; contains 93 mg elemental calcium per 10 mL ampule", sideEffects: "Bradycardia (infuse slowly), hypotension, tissue irritation (extravasation)", contra: "Digoxin use (calcium enhances digoxin toxicity); hypercalcemia", pearl: "PREFERRED for peripheral IV use (less irritating than calcium chloride); infuse slowly over 10-20 min; monitor ECG during infusion" },
      { name: "Calcium Chloride 10%", type: "Calcium supplement (IV)", action: "Contains 3x more elemental calcium than gluconate (272 mg per 10 mL); faster onset", sideEffects: "Severe tissue necrosis if extravasated, bradycardia, cardiac arrest with rapid infusion", contra: "Must be given via CENTRAL LINE only (caustic to peripheral veins); digoxin use", pearl: "Reserved for life-threatening hypocalcemia or cardiac arrest; 3x more potent than calcium gluconate; central line ONLY" },
      { name: "Calcitonin (Miacalcin)", type: "Hormone", action: "Inhibits osteoclast activity, reduces bone resorption, and increases renal calcium excretion", sideEffects: "Nausea, flushing, nasal congestion (nasal spray form), tachyphylaxis (becomes less effective over 48h)", contra: "Fish allergy (derived from salmon calcitonin)", pearl: "Rapid onset (hours) for hypercalcemia but tachyphylaxis develops in 48 hours; used as bridge while waiting for bisphosphonate to take effect (2-4 days)" },
      { name: "Zoledronic Acid (Zometa)", type: "IV bisphosphonate", action: "Potent osteoclast inhibitor; reduces bone resorption and serum calcium over 2-4 days", sideEffects: "Osteonecrosis of the jaw (dental exam before starting), renal toxicity (monitor GFR), flu-like symptoms, hypocalcemia", contra: "GFR <35 mL/min, pregnancy", pearl: "Single IV infusion lasts 4-6 weeks; onset 2-4 days (use calcitonin as bridge); most effective agent for hypercalcemia of malignancy" }
    ],
    pearls: [
      "Chvostek (tap Cheek) and Trousseau (BP cuff on arm) are classic bedside tests for hypocalcemia",
      "Trousseau sign is MORE specific than Chvostek sign for hypocalcemia",
      "Always correct calcium for albumin: Corrected Ca = measured Ca + 0.8 x (4.0 - albumin)",
      "Calcium and phosphate have an INVERSE relationship - when one goes up, the other goes down",
      "Hypercalcemia mnemonic: 'Bones, Stones, Groans, and Psychiatric overtones'",
      "Post-thyroidectomy hypocalcemia: laryngospasm is the most dangerous complication - keep tracheostomy tray at bedside",
      "Both hypokalemia and hypercalcemia potentiate digoxin toxicity",
      "Citrate in banked blood binds calcium - massive transfusion can cause hypocalcemia"
    ],
    quiz: [
      { question: "A patient 12 hours post-thyroidectomy reports numbness and tingling around the mouth. The nurse taps the facial nerve and observes facial twitching. What is this sign and what does it indicate?", options: ["Kernig sign - meningeal irritation", "Chvostek sign - hypocalcemia", "Babinski sign - upper motor neuron lesion", "Murphy sign - cholecystitis"], correct: 1, rationale: "Chvostek sign (facial twitching when tapping the facial nerve anterior to the ear) indicates hypocalcemia. Post-thyroidectomy hypocalcemia occurs from inadvertent damage to the parathyroid glands. The nurse should check serum calcium, monitor for worsening symptoms (laryngospasm, tetany), and have IV calcium gluconate ready." },
      { question: "A patient with severe hypercalcemia (Ca 15.2 mg/dL) is lethargic with nausea. What is the nurse's PRIORITY intervention?", options: ["Administer oral calcium supplements", "Initiate aggressive IV normal saline hydration at 200-300 mL/hr", "Restrict fluids to prevent volume overload", "Encourage increased dietary calcium"], correct: 1, rationale: "Aggressive IV hydration with normal saline is the first-line treatment for severe hypercalcemia. It dilutes serum calcium and promotes renal calcium excretion. After adequate hydration, furosemide can be added to further promote calciuresis. Calcitonin and bisphosphonates are added for definitive treatment." },
      { question: "Why must the nurse correct hypomagnesemia before treating hypocalcemia?", options: ["Magnesium competes with calcium for absorption", "Hypomagnesemia impairs PTH secretion and PTH receptor responsiveness", "Magnesium causes calcium to bind to albumin", "There is no relationship between magnesium and calcium"], correct: 1, rationale: "Magnesium is required for both PTH secretion from the parathyroid glands and PTH action on target organs. With hypomagnesemia, PTH release is impaired and its receptors are resistant, making hypocalcemia refractory to calcium supplementation alone. Magnesium must be repleted first." }
    ]
  },

  "metabolic-acidosis-rn": {
    title: "Metabolic Acidosis: Anion Gap & Non-Anion Gap",
    cellular: {
      title: "Metabolic Acidosis Pathophysiology",
      content: "Metabolic acidosis is characterized by a primary decrease in serum bicarbonate (HCO3- <22 mEq/L) with a compensatory decrease in PaCO2 (respiratory compensation - Kussmaul breathing). It is classified by the anion gap (AG = Na+ - (Cl- + HCO3-), normal 8-12 mEq/L). Anion gap metabolic acidosis (AGMA) results from accumulation of unmeasured acids: the excess acid is buffered by bicarbonate (consuming HCO3-) while an unmeasured anion accumulates in the serum, widening the gap. The mnemonic MUDPILES identifies causes: Methanol, Uremia, Diabetic ketoacidosis, Propylene glycol/Paraldehyde, Isoniazid/Iron, Lactic acidosis (shock, sepsis, liver failure), Ethylene glycol, Salicylates. Non-anion gap metabolic acidosis (NAGMA, also called hyperchloremic metabolic acidosis) results from direct loss of bicarbonate (diarrhea - most common cause, RTA type 2) or failure to excrete hydrogen ions (RTA type 1, type 4). In NAGMA, chloride rises to replace lost bicarbonate, maintaining electrical neutrality and a normal anion gap. The kidneys compensate by excreting more acid and generating new bicarbonate, while the lungs compensate by hyperventilation (blowing off CO2). Kussmaul breathing (deep, rapid respirations) is the respiratory compensation for metabolic acidosis, particularly prominent in DKA."
    },
    riskFactors: [
      "DKA: type 1 diabetes (most common), missed insulin doses, infection, illness",
      "Lactic acidosis: sepsis/shock (most common cause), cardiac arrest, severe hypoxemia, liver failure, metformin in renal failure",
      "Renal failure: accumulation of sulfuric and phosphoric acids (unmeasured anions)",
      "Toxic ingestion: methanol, ethylene glycol, salicylate overdose",
      "Severe diarrhea: loss of bicarbonate-rich intestinal secretions (non-anion gap)",
      "Renal tubular acidosis: type 1 (distal - unable to secrete H+), type 2 (proximal - unable to reabsorb HCO3-), type 4 (hypoaldosteronism - hyperkalemia)",
      "Ureterosigmoidostomy: colon absorbs urinary chloride and excretes bicarbonate"
    ],
    diagnostics: [
      "ABG: pH <7.35, HCO3- <22 mEq/L, compensatory low PaCO2 (Winter formula: expected PaCO2 = 1.5 x HCO3- + 8 +/- 2)",
      "Anion gap: Na+ - (Cl- + HCO3-); >12 suggests anion gap acidosis",
      "Delta-delta ratio: (change in AG)/(change in HCO3-); helps identify mixed acid-base disorders",
      "Serum lactate: >2 mmol/L suggests lactic acidosis; >4 associated with poor prognosis in sepsis",
      "Serum ketones: positive in DKA and starvation ketoacidosis",
      "Serum glucose: markedly elevated in DKA (>250 mg/dL with metabolic acidosis + ketonemia)",
      "BUN/creatinine: elevated in renal failure as cause of AG acidosis",
      "Osmolar gap: elevated in methanol/ethylene glycol ingestion (measured - calculated osmolality >10)",
      "Urine pH: inappropriately alkaline (>5.5) in renal tubular acidosis type 1 (cannot acidify urine)"
    ],
    management: [
      "Treat the underlying cause (this is the most important intervention)",
      "DKA: IV insulin drip + aggressive IV hydration + K+ monitoring/replacement (insulin drives K+ into cells)",
      "Lactic acidosis: treat shock (fluids, vasopressors, antibiotics for sepsis), restore tissue perfusion",
      "Toxic ingestion: specific antidotes (fomepizole for methanol/ethylene glycol), hemodialysis for severe cases",
      "Sodium bicarbonate: controversial; generally reserved for pH <7.1 or HCO3 <8-10; risk of overcorrection, hypokalemia, and paradoxical CSF acidosis",
      "Diarrhea-induced NAGMA: replace bicarbonate losses with IV fluids containing bicarbonate or IV NS with sodium bicarbonate; address fluid/electrolyte losses",
      "Renal failure acidosis: oral sodium bicarbonate supplementation chronically; dialysis for acute severe acidosis",
      "Monitor potassium closely: acidosis shifts K+ out of cells (may mask true total body K+ deficit)"
    ],
    assessmentFindings: [
      "Kussmaul breathing: deep, rapid respirations (respiratory compensation to blow off CO2)",
      "Fruity breath odor (acetone) in DKA",
      "Headache, confusion, drowsiness progressing to coma in severe acidosis (pH <7.1)",
      "Nausea, vomiting, abdominal pain (especially DKA)",
      "Warm, flushed skin (vasodilation from acidosis)",
      "Hypotension and tachycardia (acidosis reduces cardiac contractility and causes vasodilation)",
      "Hyperkalemia (potassium shifts out of cells in exchange for hydrogen ions)",
      "Cardiac arrhythmias (from both acidosis and hyperkalemia)"
    ],
    signs: {
      left: [
        "Kussmaul breathing (deep, rapid)",
        "Fruity breath (DKA - acetone)",
        "Nausea, vomiting, abdominal pain",
        "Warm, flushed skin",
        "Headache, confusion",
        "pH <7.35 on ABG"
      ],
      right: [
        "Tachycardia and hypotension",
        "Hyperkalemia (K+ shifts out of cells)",
        "Peaked T waves on ECG",
        "Decreased cardiac contractility",
        "Drowsiness progressing to coma",
        "Low HCO3-, low PaCO2 (compensatory)"
      ]
    },
    nursingActions: [
      "Monitor ABG values and report trends; calculate anion gap to classify the acidosis",
      "Assess respiratory pattern: Kussmaul breathing is compensatory and should NOT be suppressed",
      "Monitor potassium closely: acidosis causes hyperkalemia but treating acidosis (insulin in DKA) drives K+ back into cells, potentially causing dangerous hypokalemia",
      "Continuous cardiac monitoring for arrhythmias related to both acidosis and potassium shifts",
      "Administer IV insulin and fluids per DKA protocol if applicable; monitor glucose q1h",
      "Administer sodium bicarbonate cautiously if ordered (usually pH <7.1): infuse slowly, monitor for overcorrection and rebound alkalosis",
      "Monitor lactate levels in sepsis/shock - trending is more useful than single values",
      "Assess neurological status q1-2h: LOC changes indicate severity progression",
      "Maintain IV access and prepare for possible dialysis in severe renal failure or toxic ingestion",
      "Do NOT sedate or intubate unnecessarily - Kussmaul breathing is compensating for the acidosis; suppressing it worsens acidosis"
    ],
    medications: [
      { name: "Regular Insulin IV", type: "Hormone", action: "Inhibits lipolysis and ketogenesis in DKA; shifts glucose and potassium into cells", sideEffects: "Hypoglycemia, hypokalemia (monitor K+ every 1-2 hours)", contra: "K+ <3.3 mEq/L (replace potassium BEFORE starting insulin to prevent fatal hypokalemia)", pearl: "In DKA: do NOT give insulin until K+ is >=3.3; switch to SQ insulin only after anion gap closes and patient can eat" },
      { name: "Sodium Bicarbonate IV", type: "Buffer/alkalinizing agent", action: "Directly neutralizes acid by providing bicarbonate; raises serum pH", sideEffects: "Metabolic alkalosis, hypokalemia (alkalosis shifts K+ intracellularly), hypernatremia, paradoxical CSF acidosis", contra: "pH >7.1 (generally not indicated), metabolic alkalosis", pearl: "Controversial in DKA - insulin and fluids are preferred; may be used if pH <6.9-7.1 or significant hemodynamic instability from acidosis" },
      { name: "Fomepizole (Antizol)", type: "Alcohol dehydrogenase inhibitor", action: "Blocks metabolism of methanol and ethylene glycol to their toxic metabolites (formic acid, oxalic acid)", sideEffects: "Headache, nausea, dizziness", contra: "Known hypersensitivity", pearl: "Give immediately on suspicion of toxic alcohol ingestion - do not wait for levels; prevents formation of toxic metabolites that cause blindness (methanol) or renal failure (ethylene glycol)" }
    ],
    pearls: [
      "MUDPILES mnemonic for anion gap metabolic acidosis: Methanol, Uremia, DKA, Propylene glycol, Isoniazid/Iron, Lactic acidosis, Ethylene glycol, Salicylates",
      "Kussmaul breathing is the body's attempt to compensate - deep rapid breaths blow off CO2 (volatile acid) to raise pH",
      "In DKA, do NOT start insulin until K+ is >=3.3 mEq/L (insulin will drive K+ further down, risking cardiac arrest)",
      "Diarrhea causes non-anion gap metabolic acidosis (hyperchloremic) because bicarbonate is lost in stool",
      "Winter formula predicts expected PaCO2 in metabolic acidosis: PaCO2 = 1.5(HCO3) + 8 (+/-2); if actual PaCO2 differs, a mixed disorder exists",
      "Lactic acidosis in sepsis (>4 mmol/L) is associated with mortality >40% and indicates tissue hypoperfusion",
      "Paradoxical CSF acidosis with sodium bicarbonate: CO2 from bicarbonate crosses the blood-brain barrier faster than HCO3-, temporarily worsening brain pH"
    ],
    quiz: [
      { question: "ABG: pH 7.18, PaCO2 24, HCO3 8, Na 140, Cl 102, K 6.1. The patient has deep rapid respirations and fruity breath. What is the acid-base disorder and likely cause?", options: ["Respiratory acidosis from COPD", "Anion gap metabolic acidosis from DKA", "Non-anion gap metabolic acidosis from diarrhea", "Respiratory alkalosis from anxiety"], correct: 1, rationale: "pH 7.18 (acidotic), low HCO3 (8 - metabolic acidosis), low PaCO2 (24 - respiratory compensation/Kussmaul). Anion gap = 140 - (102 + 8) = 30 (elevated, normal 8-12). Fruity breath + deep rapid breathing + elevated AG = classic DKA. The hyperkalemia is from acidosis shifting K+ out of cells." },
      { question: "In DKA management, when should the nurse administer the initial insulin bolus?", options: ["Immediately upon diagnosis regardless of potassium level", "Only after serum potassium is confirmed >=3.3 mEq/L", "After the blood glucose drops below 250 mg/dL", "Only after IV fluids have been infusing for 24 hours"], correct: 1, rationale: "Insulin must NOT be started until K+ is >=3.3 mEq/L because insulin drives potassium intracellularly, and starting insulin with low potassium can cause fatal hypokalemia and cardiac arrest. K+ must be replaced first if <3.3, even though the serum K+ may appear normal or elevated due to acidosis shifting K+ out of cells." },
      { question: "Which type of metabolic acidosis would a patient with severe diarrhea develop?", options: ["Anion gap metabolic acidosis", "Non-anion gap (hyperchloremic) metabolic acidosis", "Respiratory acidosis", "Metabolic alkalosis"], correct: 1, rationale: "Diarrhea causes non-anion gap (hyperchloremic) metabolic acidosis because bicarbonate-rich intestinal secretions are lost. The body compensates by retaining chloride to maintain electrical neutrality, resulting in normal anion gap with elevated chloride (hyperchloremic)." }
    ]
  },

  "metabolic-alkalosis-rn": {
    title: "Metabolic Alkalosis: Chloride-Responsive vs Resistant",
    cellular: {
      title: "Metabolic Alkalosis Mechanisms",
      content: "Metabolic alkalosis is characterized by a primary increase in serum bicarbonate (HCO3- >26 mEq/L) with a compensatory increase in PaCO2 (hypoventilation - the lungs retain CO2 to lower pH). Two mechanisms generate metabolic alkalosis: (1) Loss of hydrogen ions (H+) - vomiting/NG suction loses HCl from the stomach, leaving excess bicarbonate; (2) Gain of bicarbonate - excessive NaHCO3 administration, contraction alkalosis. Contraction alkalosis occurs when ECF volume contracts (dehydration from diuretics) and bicarbonate becomes more concentrated because the kidneys preferentially reabsorb sodium over bicarbonate to maintain volume. Classification by chloride responsiveness guides treatment: Chloride-responsive (urine Cl- <20 mEq/L): caused by vomiting, NG suction, diuretics (thiazide/loop), post-hypercapnia. Treatment: IV normal saline (chloride replacement allows kidneys to excrete excess bicarbonate). Chloride-resistant (urine Cl- >20 mEq/L): caused by primary hyperaldosteronism (Conn syndrome), Cushing syndrome, severe hypokalemia, Bartter/Gitelman syndromes. Treatment: address the underlying hormone excess or potassium deficit; saline alone is ineffective."
    },
    riskFactors: [
      "Vomiting or NG suction - most common cause (loss of HCl from stomach)",
      "Loop and thiazide diuretics (volume contraction + K+ and H+ loss)",
      "Excessive sodium bicarbonate administration (antacid overuse, IV NaHCO3)",
      "Severe hypokalemia (K+ depletion causes renal H+ excretion to retain K+)",
      "Primary hyperaldosteronism (Conn syndrome - aldosterone promotes H+ and K+ excretion)",
      "Cushing syndrome (cortisol excess has mineralocorticoid effects)",
      "Massive blood transfusion (citrate metabolized to bicarbonate)",
      "Posthypercapnic alkalosis (after mechanical ventilation in chronic CO2 retainer)"
    ],
    diagnostics: [
      "ABG: pH >7.45, HCO3- >26 mEq/L, compensatory elevated PaCO2 (hypoventilation)",
      "Serum electrolytes: hypokalemia (almost always present), hypochloremia",
      "Urine chloride: <20 mEq/L (chloride-responsive - most common) vs >20 mEq/L (chloride-resistant)",
      "Serum chloride: decreased (hypochloremia) in chloride-responsive type",
      "BMP: elevated HCO3-, decreased K+, decreased Cl-",
      "Aldosterone and renin levels: if chloride-resistant alkalosis suspected (high aldosterone + low renin = Conn syndrome)",
      "Volume status assessment: dehydration signs suggest chloride-responsive type"
    ],
    management: [
      "Chloride-responsive (urine Cl- <20): IV 0.9% normal saline - provides chloride for renal bicarbonate excretion",
      "Replace potassium (KCl) - potassium replacement is essential to allow renal H+ retention instead of K+ retention",
      "Stop NG suction if possible; administer proton pump inhibitor to reduce H+ loss if NG must continue",
      "Discontinue or reduce diuretics if contributing to alkalosis",
      "Chloride-resistant (urine Cl- >20): treat the underlying cause (spironolactone for hyperaldosteronism, surgical adenoma removal)",
      "Severe alkalosis (pH >7.60): consider acetazolamide (carbonic anhydrase inhibitor) to promote renal bicarbonate excretion",
      "Severe refractory alkalosis: IV hydrochloric acid via central line (rare, ICU setting only)",
      "Correct hypokalemia aggressively - alkalosis cannot be corrected while K+ is depleted"
    ],
    assessmentFindings: [
      "Hypoventilation/shallow breathing (compensatory - retaining CO2 to lower pH; limited because hypoxemia prevents severe hypoventilation)",
      "Muscle weakness and cramping (from associated hypokalemia and hypocalcemia)",
      "Tetany and paresthesias (alkalosis increases calcium binding to albumin, reducing ionized calcium)",
      "Confusion, irritability, seizures (severe alkalosis)",
      "Cardiac arrhythmias (from combined alkalosis and hypokalemia)",
      "Decreased bowel motility, nausea (hypokalemia-related ileus)",
      "Hand and foot tingling (carpopedal spasm from decreased ionized calcium)"
    ],
    signs: {
      left: [
        "Shallow, slow respirations (compensatory)",
        "Muscle weakness and cramps",
        "Tetany and paresthesias",
        "Positive Chvostek/Trousseau (low ionized Ca)",
        "Confusion, irritability",
        "pH >7.45 on ABG"
      ],
      right: [
        "Hypokalemia (almost always concurrent)",
        "Cardiac arrhythmias",
        "Decreased bowel sounds (ileus)",
        "Hypotension (if volume depleted)",
        "Elevated HCO3-",
        "Elevated PaCO2 (compensatory)"
      ]
    },
    nursingActions: [
      "Monitor ABG values and electrolytes (K+, Cl-, Ca2+) every 4-6 hours during active treatment",
      "Administer IV NS as ordered for chloride-responsive alkalosis - monitor for fluid overload",
      "Replace potassium aggressively - KCl is preferred (provides both K+ and Cl-)",
      "Monitor cardiac rhythm continuously - alkalosis + hypokalemia increases arrhythmia risk",
      "Assess respiratory pattern: shallow breathing is compensatory; do NOT stimulate deep breathing",
      "Monitor for tetany signs (Chvostek, Trousseau) - alkalosis reduces ionized calcium by increasing albumin binding",
      "Administer antiemetics and PPI/H2 blocker to reduce ongoing H+ losses from vomiting/NG suction",
      "Accurate I&O and daily weights - guide fluid replacement",
      "Review medication list: discontinue or reduce contributing drugs (thiazides, loop diuretics)",
      "Educate patients on antacid overuse risks (milk-alkali syndrome)"
    ],
    medications: [
      { name: "0.9% Normal Saline", type: "Isotonic crystalloid", action: "Provides chloride to replace losses; allows kidneys to excrete excess bicarbonate", sideEffects: "Fluid overload, hyperchloremic acidosis (overcorrection)", contra: "Heart failure (use cautiously)", pearl: "First-line for chloride-responsive metabolic alkalosis; the chloride is the key therapeutic component" },
      { name: "Potassium Chloride (KCl)", type: "Electrolyte replacement", action: "Replaces potassium and chloride deficits simultaneously; essential for alkalosis correction", sideEffects: "Cardiac arrest if given too fast, GI irritation (PO), phlebitis (IV)", contra: "Hyperkalemia, renal failure without monitoring", pearl: "KCl is preferred over other potassium salts in alkalosis because it provides the chloride needed for correction" },
      { name: "Acetazolamide (Diamox)", type: "Carbonic anhydrase inhibitor", action: "Causes renal bicarbonate wasting (bicarbonaturia) to reduce serum HCO3-", sideEffects: "Metabolic acidosis (overcorrection), hypokalemia, kidney stones, paresthesias", contra: "Severe hypokalemia (worsens K+ loss), sulfa allergy, hepatic insufficiency", pearl: "Used for refractory metabolic alkalosis; also used for altitude sickness and glaucoma; corrects alkalosis by promoting renal bicarbonate excretion" },
      { name: "Spironolactone (Aldactone)", type: "Aldosterone antagonist/K+-sparing diuretic", action: "Blocks aldosterone receptors; treats chloride-resistant alkalosis from hyperaldosteronism", sideEffects: "Hyperkalemia, gynecomastia, menstrual irregularities", contra: "Hyperkalemia, severe renal impairment, concurrent ACEi/ARB (increased hyperkalemia risk)", pearl: "Specifically indicated for metabolic alkalosis from primary hyperaldosteronism (Conn syndrome); blocks the K+/H+ wasting effect of aldosterone" }
    ],
    pearls: [
      "Vomiting/NG suction is the most common cause of metabolic alkalosis (loss of HCl from stomach)",
      "Chloride-responsive (urine Cl- <20) vs chloride-resistant (urine Cl- >20) determines treatment approach",
      "Alkalosis cannot be corrected while hypokalemia persists - K+ and alkalosis are linked",
      "Alkalosis decreases ionized calcium by increasing calcium-albumin binding - watch for tetany",
      "Respiratory compensation for metabolic alkalosis is limited because the body will not hypoventilate to the point of hypoxemia",
      "Contraction alkalosis: diuresis reduces ECF volume, concentrating the remaining bicarbonate",
      "KCl is the preferred potassium salt in metabolic alkalosis because it provides both potassium AND chloride"
    ],
    quiz: [
      { question: "A patient with prolonged NG suction has pH 7.52, PaCO2 48, HCO3 38, K+ 2.9, Cl- 88. What is the acid-base disorder and expected treatment?", options: ["Metabolic acidosis - administer sodium bicarbonate", "Chloride-responsive metabolic alkalosis - administer IV NS and KCl", "Respiratory alkalosis - reduce respiratory rate", "Chloride-resistant metabolic alkalosis - administer spironolactone"], correct: 1, rationale: "pH >7.45 with elevated HCO3 = metabolic alkalosis. Elevated PaCO2 = respiratory compensation. NG suction causes chloride-responsive metabolic alkalosis (loss of HCl). Treatment: IV NS (provides chloride) + KCl (corrects hypokalemia and provides additional chloride). Cannot be chloride-resistant since there is a clear cause of H+/Cl- loss." },
      { question: "Why does metabolic alkalosis cause tetany similar to hypocalcemia?", options: ["Alkalosis directly destroys calcium in the blood", "Alkalosis increases calcium binding to albumin, reducing ionized (active) calcium", "Alkalosis causes excessive renal calcium excretion", "Alkalosis has no effect on calcium"], correct: 1, rationale: "In alkalosis, hydrogen ions dissociate from albumin, making more binding sites available for calcium. This increases calcium-albumin binding, reducing the ionized (physiologically active) calcium fraction. Although total calcium may be normal, the decreased ionized calcium causes the same neuromuscular effects as true hypocalcemia (tetany, Chvostek/Trousseau signs)." }
    ]
  },

  "respiratory-acidosis-alkalosis-rn": {
    title: "Respiratory Acidosis & Alkalosis",
    cellular: {
      title: "CO2 as Volatile Acid",
      content: "Respiratory acid-base disorders result from abnormalities in CO2 elimination by the lungs. CO2 is a volatile acid that combines with water to form carbonic acid (H2CO3), which dissociates into H+ and HCO3-. Respiratory acidosis (pH <7.35, PaCO2 >45 mmHg) occurs when CO2 retention exceeds elimination - any condition causing hypoventilation or impaired gas exchange. Acute respiratory acidosis develops rapidly (hours) with minimal renal compensation (HCO3 rises ~1 mEq/L per 10 mmHg PaCO2 increase). Chronic respiratory acidosis (COPD) allows full renal compensation (HCO3 rises ~3.5 mEq/L per 10 mmHg PaCO2 increase), bringing pH near normal. Respiratory alkalosis (pH >7.45, PaCO2 <35 mmHg) occurs when CO2 elimination exceeds production - hyperventilation from any cause. Acute compensation: HCO3 drops ~2 mEq/L per 10 mmHg PaCO2 decrease. Chronic compensation: HCO3 drops ~5 mEq/L per 10 mmHg PaCO2 decrease. The key nursing concept: respiratory acidosis = hypoventilation (too little CO2 blown off); respiratory alkalosis = hyperventilation (too much CO2 blown off)."
    },
    riskFactors: [
      "Respiratory acidosis: COPD (most common chronic cause), severe asthma/status asthmaticus, drug overdose (opioids, benzodiazepines, alcohol - respiratory depression), neuromuscular disease (Guillain-Barre, myasthenia gravis, ALS), chest wall deformity (kyphoscoliosis), obesity hypoventilation syndrome (Pickwickian), pneumothorax, severe pneumonia, ARDS",
      "Respiratory alkalosis: anxiety/hyperventilation syndrome (most common acute cause), pain, fever, early sepsis, high altitude, pulmonary embolism, early salicylate toxicity, pregnancy (progesterone effect), hepatic encephalopathy, CNS lesions affecting respiratory center, mechanical ventilation (excessive rate/tidal volume)"
    ],
    diagnostics: [
      "ABG is the definitive diagnostic test for respiratory acid-base disorders",
      "Respiratory acidosis: pH <7.35, PaCO2 >45, HCO3 normal (acute) or elevated (chronic compensation)",
      "Respiratory alkalosis: pH >7.45, PaCO2 <35, HCO3 normal (acute) or decreased (chronic compensation)",
      "Expected compensation: acute respiratory acidosis HCO3 increases 1 per 10 PaCO2; chronic increases 3.5 per 10",
      "Expected compensation: acute respiratory alkalosis HCO3 decreases 2 per 10 PaCO2; chronic decreases 5 per 10",
      "If HCO3 does not match expected compensation, a mixed disorder exists",
      "Chest X-ray: evaluate for underlying pulmonary cause",
      "Serum electrolytes: hypokalemia with alkalosis, hyperkalemia with acidosis"
    ],
    management: [
      "Respiratory acidosis: treat underlying cause; support ventilation",
      "Acute respiratory acidosis: supplemental O2, bronchodilators (if bronchospasm), BiPAP/CPAP for non-invasive support, intubation/mechanical ventilation if severe (pH <7.25)",
      "Opioid-induced respiratory acidosis: naloxone (Narcan) to reverse respiratory depression",
      "Chronic respiratory acidosis (COPD): low-flow O2 (target SpO2 88-92%), bronchodilators, treat exacerbation trigger",
      "NEVER rapidly lower PaCO2 in chronic hypercapnia - it causes posthypercapnic metabolic alkalosis and seizures",
      "Respiratory alkalosis: treat underlying cause; reduce hyperventilation",
      "Anxiety-induced hyperventilation: coaching to slow breathing, rebreathing into paper bag (use cautiously - can worsen hypoxemia), anxiolytic medication",
      "Ventilator-induced alkalosis: decrease respiratory rate or tidal volume on ventilator settings"
    ],
    assessmentFindings: [
      "Respiratory acidosis: hypoventilation (decreased RR, shallow breathing), somnolence, confusion, headache (CO2 is a cerebral vasodilator), warm flushed skin, diaphoresis, tachycardia, asterixis (flapping tremor), coma (severe)",
      "Respiratory alkalosis: hyperventilation (rapid deep breathing), lightheadedness, dizziness, circumoral and extremity paresthesias/tingling, carpopedal spasm, chest tightness, palpitations, anxiety, confusion, syncope (severe)"
    ],
    signs: {
      left: [
        "Resp acidosis: hypoventilation, somnolence",
        "Resp acidosis: headache (CO2 vasodilation)",
        "Resp acidosis: confusion, asterixis",
        "Resp acidosis: warm flushed skin",
        "Resp acidosis: PaCO2 >45, pH <7.35",
        "Resp acidosis: tachycardia"
      ],
      right: [
        "Resp alkalosis: hyperventilation (rapid, deep)",
        "Resp alkalosis: dizziness, lightheadedness",
        "Resp alkalosis: paresthesias (perioral, fingers)",
        "Resp alkalosis: carpopedal spasm",
        "Resp alkalosis: PaCO2 <35, pH >7.45",
        "Resp alkalosis: chest tightness, palpitations"
      ]
    },
    nursingActions: [
      "Monitor ABG values and report trends; identify acute vs chronic based on degree of compensation",
      "Respiratory acidosis: assess respiratory rate, depth, and effort; monitor SpO2 continuously",
      "Respiratory acidosis: position in semi-Fowler's to high Fowler's to optimize ventilation",
      "Respiratory acidosis: have resuscitation equipment available; prepare for non-invasive ventilation or intubation",
      "Respiratory acidosis from opioids: administer naloxone; assess for recurrence (naloxone duration shorter than many opioids)",
      "Chronic respiratory acidosis: do NOT aggressively ventilate to normalize PaCO2 (kidneys have compensated; rapid correction causes alkalosis and seizures)",
      "Respiratory alkalosis: identify and address the underlying cause (anxiety, pain, fever, PE)",
      "Respiratory alkalosis from anxiety: encourage slow, controlled breathing; provide calm reassurance",
      "Monitor potassium: alkalosis causes hypokalemia; acidosis causes hyperkalemia",
      "Monitor neurological status: both extremes of pH affect cerebral function"
    ],
    medications: [
      { name: "Naloxone (Narcan)", type: "Opioid antagonist", action: "Competitively blocks opioid receptors; reverses respiratory depression from opioid overdose", sideEffects: "Acute opioid withdrawal (pain, nausea, tachycardia), re-sedation (naloxone duration 30-90 min may be shorter than opioid)", contra: "Must be redosed if long-acting opioid (methadone, fentanyl patch) since effect wears off before opioid", pearl: "Titrate to respiratory rate >12, NOT to full consciousness (prevents acute withdrawal); may need repeated doses or IV drip for long-acting opioids" },
      { name: "BiPAP", type: "Non-invasive positive pressure ventilation", action: "Provides inspiratory pressure support (IPAP) to augment tidal volume and expiratory pressure (EPAP) to prevent alveolar collapse", sideEffects: "Mask discomfort, skin breakdown, aerophagia, aspiration risk, claustrophobia", contra: "Unresponsive patient (cannot protect airway), facial trauma, vomiting, severe respiratory failure requiring intubation", pearl: "First-line for acute COPD exacerbation with respiratory acidosis (pH 7.25-7.35); reduces intubation rate by 50%" },
      { name: "Lorazepam (Ativan)", type: "Benzodiazepine", action: "Anxiolytic that reduces anxiety-driven hyperventilation causing respiratory alkalosis", sideEffects: "Respiratory depression (can worsen acidosis if given for wrong diagnosis), sedation, dependence", contra: "Ensure hyperventilation is truly from anxiety and not PE, sepsis, or metabolic acidosis compensation (giving a sedative would be dangerous)", pearl: "Only use for anxiety-induced hyperventilation AFTER ruling out organic causes of tachypnea; never sedate a patient who is hyperventilating to compensate for metabolic acidosis" }
    ],
    pearls: [
      "Simple rule: Respiratory ACIDOSIS = too MUCH CO2 (hypoventilation); Respiratory ALKALOSIS = too LITTLE CO2 (hyperventilation)",
      "Respiratory compensation is rapid (minutes to hours) but renal compensation takes 3-5 days",
      "In chronic COPD: do NOT normalize PaCO2 rapidly - posthypercapnic alkalosis causes seizures",
      "Naloxone must be titrated to respiratory rate, NOT consciousness - preventing withdrawal reduces complications",
      "Anxiety-induced hyperventilation causes tingling and carpopedal spasm because alkalosis reduces ionized calcium",
      "NEVER assume tachypnea is anxiety-driven without ruling out PE, pneumonia, sepsis, or metabolic acidosis compensation",
      "If a patient with metabolic acidosis is hyperventilating (Kussmaul), this is COMPENSATION - do NOT suppress their breathing"
    ],
    quiz: [
      { question: "ABG: pH 7.28, PaCO2 68, HCO3 30. Is this acute or chronic respiratory acidosis?", options: ["Acute - the HCO3 has not risen enough for chronic compensation", "Chronic - the elevated HCO3 indicates full renal compensation", "Neither - this is metabolic acidosis", "Cannot be determined from ABG alone"], correct: 1, rationale: "In chronic respiratory acidosis, renal compensation raises HCO3 by 3.5 per 10 mmHg PaCO2 increase above 40. Expected: 24 + 3.5 x (68-40)/10 = 24 + 9.8 = ~34. Actual HCO3 is 30, close to expected chronic compensation. In acute, HCO3 would only be ~27 (1 per 10). The elevated HCO3 with incompletely corrected pH is consistent with chronic (partially compensated) respiratory acidosis, typical of COPD." },
      { question: "A patient with anxiety is hyperventilating (RR 32) with tingling in the hands and feet. ABG shows pH 7.52, PaCO2 28, HCO3 23. What is the priority nursing intervention?", options: ["Administer sodium bicarbonate", "Increase supplemental oxygen to 100% FiO2", "Coach slow breathing techniques and provide reassurance", "Administer IV calcium gluconate"], correct: 2, rationale: "This is acute respiratory alkalosis from hyperventilation (anxiety). The priority is to address the cause by coaching slow, controlled breathing and providing reassurance to reduce respiratory rate. The tingling is from decreased ionized calcium due to alkalosis. Sodium bicarbonate would worsen alkalosis. High-flow O2 is unnecessary. IV calcium is not indicated for this mild presentation." }
    ]
  },

  "mixed-acid-base-disorders-rn": {
    title: "Mixed Acid-Base Disorders: ABG Systematic Interpretation",
    cellular: {
      title: "Systematic ABG Interpretation",
      content: "Mixed acid-base disorders occur when two or more primary acid-base disturbances coexist simultaneously. A systematic approach to ABG interpretation is essential: Step 1: Assess pH (<7.35 = acidemia, >7.45 = alkalemia, 7.35-7.45 = normal or compensated). Step 2: Identify the primary disorder by matching pH direction with the abnormal component (if pH is low and PaCO2 is high = respiratory acidosis; if pH is low and HCO3 is low = metabolic acidosis). Step 3: Assess compensation - respiratory compensation for metabolic disorders is rapid (hours); renal compensation for respiratory disorders takes 3-5 days. Step 4: Calculate anion gap if metabolic acidosis is present (Na - Cl - HCO3; normal 8-12). Step 5: Calculate delta-delta if anion gap is elevated: Delta ratio = (change in AG)/(change in HCO3). If delta ratio >2: concurrent metabolic alkalosis; if <1: concurrent non-anion gap metabolic acidosis. Step 6: Apply compensation formulas to detect mixed disorders: if actual compensation differs significantly from expected, a second primary disorder is present. Common mixed disorders include: metabolic acidosis + respiratory acidosis (cardiac arrest), metabolic acidosis + metabolic alkalosis (DKA + vomiting), metabolic acidosis + respiratory alkalosis (salicylate toxicity - unique mixed pattern)."
    },
    riskFactors: [
      "Critically ill ICU patients (sepsis, multi-organ failure, complex medication regimens)",
      "DKA with concurrent vomiting (metabolic acidosis + metabolic alkalosis)",
      "COPD patient with sepsis (chronic respiratory acidosis + metabolic acidosis from lactic acid)",
      "Salicylate overdose (directly stimulates respiratory center causing respiratory alkalosis AND causes metabolic acidosis)",
      "Cardiac arrest (respiratory acidosis from apnea + metabolic acidosis from lactic acid)",
      "Hepatorenal syndrome (respiratory alkalosis from hepatic encephalopathy + metabolic acidosis from renal failure)",
      "Post-operative patients with multiple comorbidities"
    ],
    diagnostics: [
      "ABG with simultaneous BMP (Na, K, Cl, HCO3, BUN, Cr, glucose) - must interpret together",
      "Anion gap calculation: AG = Na - (Cl + HCO3); normal 8-12; elevated indicates unmeasured acid accumulation",
      "Delta-delta ratio: (AG - 12)/(24 - HCO3); >2 suggests concurrent metabolic alkalosis; <1 suggests concurrent NAGMA",
      "Winter formula for expected respiratory compensation in metabolic acidosis: PaCO2 = 1.5(HCO3) + 8 (+/- 2)",
      "Expected compensation for metabolic alkalosis: PaCO2 = 0.7(HCO3) + 21 (+/- 2)",
      "Lactate, ketones, osmolar gap, toxicology screen as guided by clinical scenario",
      "Venous blood gas (VBG) can be used for screening (venous pH ~0.03-0.05 lower than arterial)"
    ],
    management: [
      "Identify and treat EACH primary disorder separately",
      "Prioritize the most life-threatening component",
      "Metabolic acidosis: treat underlying cause (insulin for DKA, fluids/antibiotics for sepsis)",
      "Respiratory acidosis: support ventilation (BiPAP, intubation if needed)",
      "Metabolic alkalosis: NS + KCl for chloride-responsive type",
      "Respiratory alkalosis: treat underlying cause (pain control, anxiolytics, adjust ventilator)",
      "Monitor ABGs frequently (every 1-4 hours) during acute management",
      "Be cautious with sodium bicarbonate in mixed disorders - may worsen a coexisting alkalosis"
    ],
    assessmentFindings: [
      "Clinical picture may be confusing because opposing disorders partially cancel each other's effects on pH",
      "Normal pH does NOT mean normal acid-base status - two opposing disorders can produce a normal pH",
      "Mixed acidosis (metabolic + respiratory): severely depressed pH, cardiovascular collapse",
      "Salicylate toxicity: tinnitus, hyperventilation, confusion, nausea, elevated AG, mixed picture",
      "COPD exacerbation with sepsis: confusion, tachypnea, hypotension (features of both disorders)",
      "Severity of symptoms correlates with degree of pH deviation from normal"
    ],
    signs: [
      "Mixed disorders may have surprisingly normal pH despite severe underlying disturbances",
      "Symptoms from each individual disorder may coexist",
      "Cardiovascular instability when both disorders drive pH in the same direction",
      "Electrolyte abnormalities may be complex (both hypo- and hyperkalemia risk)",
      "Mental status changes are common (CNS is sensitive to pH changes)",
      "Response to treatment may be unpredictable if only one disorder is treated"
    ],
    nursingActions: [
      "Perform systematic ABG interpretation using the 6-step approach every time",
      "Always calculate anion gap when metabolic acidosis is identified",
      "Monitor ABGs frequently (q1-4h) during active management of mixed disorders",
      "Communicate ABG results to the healthcare team using a systematic framework",
      "Monitor for complications of treatment: correcting one disorder may unmask or worsen another",
      "Maintain continuous cardiac monitoring - pH changes affect cardiac conduction",
      "Monitor electrolytes (K+, Ca2+, Cl-) concurrently - they shift with acid-base changes",
      "Document and trend ABG results to identify patterns and treatment response",
      "Assess mental status frequently - CNS sensitivity to pH changes makes neuro checks essential",
      "Be prepared for rapid changes in clinical status - mixed disorders can decompensate quickly"
    ],
    medications: [
      { name: "Sodium Bicarbonate", type: "Buffer/alkalinizing agent", action: "Raises pH by providing bicarbonate to buffer acid", sideEffects: "May worsen coexisting metabolic alkalosis in mixed disorders; hypernatremia, hypokalemia", contra: "Mixed metabolic acidosis + metabolic alkalosis (could worsen the alkalosis component)", pearl: "In mixed disorders, bicarbonate administration requires extreme caution - always consider the impact on BOTH primary disorders" },
      { name: "Activated Charcoal", type: "GI decontaminant", action: "Adsorbs ingested toxins in the GI tract; used for salicylate and other toxic ingestions causing mixed acid-base disorders", sideEffects: "Aspiration pneumonitis (if given to obtunded patient without airway protection), constipation, vomiting", contra: "Unprotected airway, caustic ingestion, ileus", pearl: "Most effective within 1 hour of ingestion; for salicylates, alkalinize urine with sodium bicarbonate to enhance renal excretion (target urine pH 7.5-8.0)" }
    ],
    pearls: [
      "A normal pH does NOT mean normal acid-base status - two opposing disorders can cancel out",
      "ALWAYS calculate the anion gap in metabolic acidosis - it identifies the cause and detects mixed disorders",
      "The delta-delta ratio detects hidden second metabolic disorders when anion gap is elevated",
      "Salicylate overdose uniquely causes BOTH respiratory alkalosis (central stimulation) AND metabolic acidosis (lactic acid, ketoacids)",
      "In cardiac arrest: combined respiratory acidosis (no ventilation) + metabolic acidosis (lactic acid from no perfusion) = profoundly low pH",
      "If measured compensation does not match expected compensation, a mixed disorder exists",
      "Winter formula: PaCO2 = 1.5(HCO3) + 8 (+/-2); if actual PaCO2 is higher than expected, there is a concurrent respiratory acidosis; if lower, concurrent respiratory alkalosis",
      "Step-by-step approach: pH -> primary disorder -> compensation -> anion gap -> delta-delta -> clinical correlation"
    ],
    quiz: [
      { question: "ABG: pH 7.40, PaCO2 24, HCO3 14, Na 142, Cl 100. Is this a normal acid-base status?", options: ["Yes - the pH is normal so there is no disorder", "No - the low PaCO2 and low HCO3 suggest opposing metabolic acidosis and respiratory alkalosis creating a falsely normal pH", "Yes - the normal pH means the body has fully compensated", "No - this is uncompensated metabolic alkalosis"], correct: 1, rationale: "Despite a normal pH, the abnormal PaCO2 (24) and HCO3 (14) reveal two opposing disorders: metabolic acidosis (low HCO3) and respiratory alkalosis (low PaCO2). Anion gap = 142 - (100 + 14) = 28 (elevated), confirming anion gap metabolic acidosis. This is classic for salicylate overdose (mixed respiratory alkalosis + AG metabolic acidosis)." },
      { question: "A COPD patient (baseline ABG: pH 7.36, PaCO2 55, HCO3 30) presents with sepsis. Current ABG: pH 7.18, PaCO2 58, HCO3 20, lactate 6.2. What is the mixed acid-base disorder?", options: ["Simple respiratory acidosis", "Chronic respiratory acidosis + acute metabolic acidosis (lactic acidosis)", "Simple metabolic acidosis", "Metabolic alkalosis + respiratory acidosis"], correct: 1, rationale: "The patient has a chronic respiratory acidosis baseline (compensated with elevated HCO3 of 30). Now the HCO3 has dropped to 20 (loss of 10 from baseline, not from the expected 30) with an elevated lactate, indicating a superimposed metabolic acidosis from sepsis-related lactic acidosis. The PaCO2 is near baseline (chronic lung disease), so this is chronic respiratory acidosis + new acute metabolic acidosis." },
      { question: "A patient has DKA and has been vomiting. ABG: pH 7.32, PaCO2 28, HCO3 14, Na 140, Cl 102. Anion gap = 24 (elevated). Delta-delta = (24-12)/(24-14) = 1.2. What does the delta-delta ratio indicate?", options: ["Pure anion gap metabolic acidosis with appropriate compensation", "Concurrent anion gap metabolic acidosis AND metabolic alkalosis", "Concurrent anion gap metabolic acidosis AND non-anion gap metabolic acidosis", "The delta-delta is not useful in this case"], correct: 0, rationale: "Delta-delta ratio of 1.2 falls in the normal range (1-2), indicating that the anion gap elevation is proportional to the bicarbonate decrease - this is a pure anion gap metabolic acidosis. If >2, the HCO3 is higher than expected (hidden metabolic alkalosis from vomiting). If <1, the HCO3 is lower than expected (concurrent non-AG acidosis). In this case, despite vomiting, the alkalosis effect has not significantly altered the delta-delta ratio." }
    ]
  }
};
