import type { LessonContent } from "./types";

export const npRespContent: Record<string, LessonContent> = {
  "asthma-emergency-np": {
    title: "Status Asthmaticus: Advanced Mgmt",
    cellular: {
      title: "Pathophysiology of Status Asthmaticus",
      content: "Status asthmaticus is a severe, life-threatening asthma exacerbation that fails to respond to initial bronchodilator therapy and systemic corticosteroids. The pathophysiology involves severe bronchospasm (smooth muscle contraction via muscarinic and leukotriene pathways), extensive mucus plugging (goblet cell hypersecretion with inspissated mucus forming casts), and intense airway inflammation (eosinophilic and neutrophilic infiltration with mucosal edema). Progressive air trapping causes dynamic hyperinflation ('auto-PEEP'), increasing work of breathing and eventually causing respiratory muscle fatigue. As airways narrow to critical levels, airflow becomes negligible — the 'silent chest' is an ominous sign indicating near-complete airway obstruction. Severe respiratory acidosis (PaCO2 > 45 mmHg in an asthmatic) indicates impending respiratory failure, as the normal response to asthma exacerbation is hyperventilation with respiratory alkalosis. A 'normal' PaCO2 during an acute attack represents a red flag."
    },
    riskFactors: [
      "Prior intubation or ICU admission for asthma (strongest predictor of near-fatal asthma)",
      "Frequent ED visits or hospitalizations (>= 2 in past year)",
      "Current or recent oral corticosteroid use (indicates severe baseline disease)",
      "Poor perception of airflow obstruction (unable to sense severity of bronchoconstriction)",
      "Non-adherence to ICS controller therapy",
      "Excessive SABA use (> 2 canisters/month indicates uncontrolled disease)",
      "Psychosocial factors: depression, substance use, low socioeconomic status, food insecurity",
      "Allergen sensitivity with recent exposure (dust mites, mold, cockroach)"
    ],
    diagnostics: [
      "Peak expiratory flow (PEF) < 25% predicted or personal best — severe exacerbation",
      "ABG: respiratory alkalosis (early) → normal PaCO2 (ominous — fatigue) → respiratory acidosis (impending failure)",
      "SpO2 monitoring: < 92% on room air indicates severe exacerbation",
      "CXR: rule out pneumothorax, pneumomediastinum, pneumonia; hyperinflation, flattened diaphragms",
      "VBG as alternative to ABG: adequate for pH and CO2 trending",
      "Serum lactate: may be elevated from beta-agonist therapy (not necessarily tissue hypoxia)",
      "Serum potassium and magnesium: SABA therapy causes hypokalemia; hypomagnesemia worsens bronchospasm",
      "Continuous end-tidal CO2 monitoring: rising ETCO2 indicates worsening obstruction"
    ],
    management: [
      "Continuous nebulized albuterol 10-15 mg/hr (or MDI 4-8 puffs q15-20 min with spacer) + ipratropium 0.5 mg q20 min × 3 doses",
      "IV methylprednisolone 125 mg bolus then 60-80 mg q6h (or equivalent dexamethasone if preferred for shorter course)",
      "IV magnesium sulfate 2 g over 20 minutes for severe exacerbation (relaxes bronchial smooth muscle via calcium channel antagonism)",
      "Epinephrine 0.3-0.5 mg IM (1:1000) if imminent respiratory failure and unable to effectively deliver inhaled therapy",
      "Non-invasive ventilation (BiPAP) may be trialed in cooperative patients to reduce work of breathing and avoid intubation",
      "Intubation for respiratory failure: use ketamine for induction (bronchodilatory properties), low RR (8-10), prolonged expiratory time (I:E ratio 1:4-1:5), permissive hypercapnia",
      "Post-intubation: minimize auto-PEEP by allowing complete exhalation; set low tidal volumes (6-8 mL/kg); accept PaCO2 50-60 if pH > 7.20",
      "Heliox (70:30 helium:oxygen) reduces airway resistance through laminar flow in narrowed airways — temporizing measure"
    ],
    nursingActions: [
      "Continuously assess respiratory status: RR, accessory muscle use, ability to speak in sentences, breath sounds (wheeze progressing to silent chest = critical)",
      "Administer continuous nebulization and monitor for SABA side effects: tachycardia, tremor, hypokalemia",
      "Position patient upright (high Fowler's or tripod position) to optimize diaphragm mechanics",
      "Monitor ABG/VBG trending — a 'normalizing' PaCO2 in an acutely ill asthmatic is a danger sign, not improvement",
      "Prepare for intubation equipment at bedside: RSI kit, ketamine drawn up, video laryngoscope",
      "Track I&O and electrolytes: replace K+ and Mg2+ aggressively (SABA causes K+ shift intracellularly)",
      "Assess triggers and provide allergen avoidance counseling once stable",
      "Before discharge: ensure ICS controller is prescribed, provide written asthma action plan, schedule follow-up within 1 week"
    ],
    signs: {
      left: [
        "Moderate exacerbation: speaks in phrases, RR 20-30, PEF 40-60% predicted",
        "Audible expiratory wheeze with adequate air movement",
        "Responsive to initial bronchodilator therapy within 1-2 hours",
        "SpO2 > 92% on room air"
      ],
      right: [
        "Silent chest — absent wheeze despite severe respiratory distress (critical obstruction)",
        "Altered consciousness, confusion, or drowsiness (CO2 narcosis)",
        "Respiratory acidosis: PaCO2 > 45 mmHg with pH < 7.30",
        "Pneumomediastinum or pneumothorax from barotrauma"
      ]
    },
    medications: [
      {
        name: "IV Magnesium Sulfate",
        type: "Bronchial Smooth Muscle Relaxant",
        action: "Blocks calcium channels in bronchial smooth muscle causing relaxation; also inhibits mast cell degranulation and reduces acetylcholine release at neuromuscular junction",
        sideEffects: "Flushing, hypotension, muscle weakness, respiratory depression (at very high levels)",
        contra: "Heart block, myasthenia gravis, severe renal failure (accumulation risk)",
        pearl: "Give 2 g IV over 20 minutes for severe asthma exacerbation (PEF < 25% or not responding to initial therapy). Works within 15-30 minutes. Single dose is usually sufficient. Monitor deep tendon reflexes and respiratory rate as markers of magnesium level."
      },
      {
        name: "Ketamine (for RSI in status asthmaticus)",
        type: "NMDA Receptor Antagonist / Dissociative Anesthetic",
        action: "Provides sedation and analgesia while causing bronchodilation through sympathomimetic effect (catecholamine release) and direct smooth muscle relaxation; maintains spontaneous respiratory drive and hemodynamic stability",
        sideEffects: "Emergence reactions (hallucinations, agitation), hypersalivation, laryngospasm (rare), increased ICP (relative concern)",
        contra: "Acute psychosis, conditions where elevated ICP would be detrimental (relative — data is conflicting)",
        pearl: "Preferred induction agent for intubation in status asthmaticus: 1-2 mg/kg IV push. Provides bronchodilation while maintaining hemodynamics. Sub-dissociative doses (0.1-0.3 mg/kg) can be used as adjunct bronchodilator in refractory cases. Give glycopyrrolate 0.2 mg IV to reduce secretions."
      }
    ],
    pearls: [
      "A 'normal' PaCO2 (35-45 mmHg) during an acute asthma exacerbation is NOT reassuring — it indicates the patient is too fatigued to hyperventilate and is approaching respiratory failure",
      "In mechanically ventilated status asthmaticus, the biggest danger is auto-PEEP from air trapping — use low RR (8-10), prolonged I:E ratio (1:4-1:5), and accept permissive hypercapnia to prevent dynamic hyperinflation and cardiovascular collapse",
      "Every patient discharged from the ED for asthma exacerbation MUST receive an ICS prescription, a written asthma action plan, and follow-up within 1 week — this is the most impactful intervention to prevent recurrence"
    ],
    quiz: [
      {
        question: "A patient with status asthmaticus initially had PaCO2 28 mmHg on ABG. Two hours later despite continuous nebulization and IV steroids, repeat ABG shows PaCO2 42 mmHg with pH 7.36. What does this indicate?",
        options: [
          "The patient is improving — PaCO2 is normalizing",
          "The patient is deteriorating — impending respiratory failure from fatigue",
          "The treatment is working — continue current management",
          "The initial ABG was inaccurate — this is the true baseline"
        ],
        correct: 1,
        rationale: "In acute asthma, the expected respiratory response is hyperventilation with low PaCO2 (respiratory alkalosis). A 'normal' PaCO2 in the setting of clinical distress indicates respiratory muscle fatigue — the patient can no longer maintain compensatory hyperventilation. This is a pre-intubation sign requiring immediate escalation of care."
      }
    ]
  },
  "pe-recognition-np": {
    title: "PE: Wells Criteria & Thrombolysis",
    cellular: {
      title: "Pulmonary Vascular Obstruction",
      content: "Pulmonary embolism causes acute right ventricular pressure overload from mechanical vascular obstruction and vasoactive mediator release. When > 30-50% of the pulmonary vascular bed is occluded, the thin-walled RV fails to generate adequate systolic pressures against the increased afterload. RV dilation causes interventricular septal shift (D-sign), impairs LV filling, and reduces cardiac output. V/Q mismatch from perfused but non-ventilated and ventilated but non-perfused lung units causes hypoxemia. Dead space ventilation increases (high V/Q regions), producing tachypnea. The Wells criteria pre-test probability score guides diagnostic testing: low probability (< 2 points) + negative age-adjusted D-dimer safely excludes PE. CTPA is the definitive imaging test. Risk stratification (PESI/sPESI) combined with RV function assessment and biomarkers determines management intensity from outpatient anticoagulation to systemic thrombolysis."
    },
    riskFactors: [
      "Recent DVT or prior VTE history",
      "Recent surgery or immobilization > 72 hours",
      "Active malignancy (especially lung, pancreatic, brain, ovarian)",
      "Combined oral contraceptive or HRT use",
      "Pregnancy and postpartum period",
      "Obesity (BMI > 30)",
      "Long-haul travel (> 4 hours)",
      "Hereditary thrombophilia: Factor V Leiden, prothrombin mutation"
    ],
    diagnostics: [
      "Wells score: clinical DVT signs (3), PE most likely diagnosis (3), HR > 100 (1.5), immobilization/surgery (1.5), prior VTE (1.5), hemoptysis (1), malignancy (1)",
      "D-dimer with age-adjusted cutoff (age × 10 for > 50 years): rules out PE if score is low and D-dimer negative",
      "CT pulmonary angiography: gold standard; shows filling defect in pulmonary arteries; RV/LV ratio > 0.9 indicates RV strain",
      "V/Q scan for contrast allergy or severe CKD",
      "Echocardiography: RV dilation, McConnell sign, D-shaped septum, TAPSE < 16 mm",
      "Troponin and BNP elevation indicate RV strain (submassive PE)",
      "Bilateral lower extremity compression ultrasound: DVT present in ~50%",
      "sPESI score for outpatient management eligibility (sPESI 0 = low risk)"
    ],
    management: [
      "Low-risk PE (sPESI 0, normal RV, normal biomarkers): consider outpatient treatment with DOAC",
      "DOAC single-drug approach: rivaroxaban 15 mg BID × 21 days then 20 mg daily, or apixaban 10 mg BID × 7 days then 5 mg BID",
      "Submassive PE: anticoagulation + close monitoring; consider catheter-directed therapy if clinical deterioration",
      "Massive PE (SBP < 90, cardiogenic shock): systemic alteplase 100 mg IV over 2 hours + heparin infusion",
      "IV fluid resuscitation cautiously in massive PE (250-500 mL only — excessive fluids worsen RV dilation)",
      "Vasopressor support: norepinephrine preferred for RV coronary perfusion maintenance",
      "Catheter-directed therapy (reduced-dose thrombolysis or mechanical thrombectomy) for high-risk submassive or massive PE",
      "Duration: provoked PE 3 months; unprovoked PE minimum 3 months then risk-benefit assessment for indefinite therapy"
    ],
    nursingActions: [
      "Calculate Wells score systematically for all patients with dyspnea and pleuritic chest pain",
      "For suspected massive PE: establish large-bore IV, initiate heparin bolus, prepare thrombolysis",
      "Monitor hemodynamic response: serial BP, HR, SpO2, signs of RV failure",
      "Post-thrombolysis: neurological checks q1h for 24 hours (ICH risk), access site monitoring",
      "Educate on DOAC therapy: adherence, duration, bleeding precautions, drug interactions",
      "Assess for ongoing VTE risk and ensure prophylaxis plan is in place",
      "Screen for post-PE syndrome at 3-month follow-up: persistent dyspnea may indicate CTEPH",
      "Coordinate thrombophilia workup if unprovoked PE in patient < 50 years"
    ],
    signs: {
      left: [
        "Mild dyspnea and pleuritic chest pain with stable hemodynamics",
        "Small subsegmental PE with normal RV function and biomarkers",
        "sPESI score 0 — eligible for outpatient management",
        "Symptoms resolving with anticoagulation therapy"
      ],
      right: [
        "Massive PE: hypotension, syncope, obstructive shock, PEA arrest",
        "Severe RV failure with dilated RV, D-sign, elevated troponin/BNP",
        "Hemoptysis with large central PE",
        "Post-PE CTEPH with progressive exercise intolerance months later"
      ]
    },
    medications: [
      {
        name: "Alteplase (for massive PE)",
        type: "Fibrinolytic (tPA)",
        action: "Activates plasminogen to plasmin at thrombus surface, dissolving fibrin clot and reducing pulmonary vascular obstruction; restores RV function",
        sideEffects: "Intracranial hemorrhage (2-3%), major bleeding (5-10%), reperfusion arrhythmias",
        contra: "Active bleeding, hemorrhagic stroke ever, ischemic stroke < 3 months, intracranial neoplasm, recent surgery < 3 weeks",
        pearl: "100 mg IV over 2 hours for massive PE. For PE-related cardiac arrest: 50 mg IV push during CPR. Continue CPR for 60-90 min after thrombolysis. Half-dose (50 mg) may be considered for elderly or small patients. Risk-benefit must weigh certain death from massive PE against 2-3% ICH risk."
      },
      {
        name: "Rivaroxaban (Xarelto)",
        type: "Direct Factor Xa Inhibitor",
        action: "Directly inhibits factor Xa, blocking thrombin generation; single-drug approach for PE without need for heparin lead-in",
        sideEffects: "Bleeding (GI higher than warfarin), bruising, anemia",
        contra: "Active bleeding, severe hepatic disease, CrCl < 15 mL/min, pregnancy",
        pearl: "15 mg BID × 21 days then 20 mg daily with food. No heparin bridge needed. EINSTEIN-PE showed non-inferior efficacy to warfarin. Extended prevention: 10 mg daily. Take with food for optimal absorption (40% increase). Reversal: andexanet alfa."
      }
    ],
    pearls: [
      "Wells score 'PE most likely diagnosis' (3 points) is the most subjective but also the most powerful predictor — if your clinical gestalt says PE, that component alone nearly moves the patient to moderate pre-test probability",
      "In massive PE cardiac arrest, give alteplase 50 mg IV push and continue CPR for at least 60-90 minutes — thrombolysis takes time to work; premature termination of resuscitation misses salvageable patients",
      "Avoid aggressive IV fluid resuscitation in massive PE — the failing RV is already volume-overloaded; 250 mL bolus maximum, then vasopressors (norepinephrine) to maintain RV coronary perfusion"
    ],
    quiz: [
      {
        question: "A patient with Wells score 6 (moderate probability) has age-adjusted D-dimer of 850 μg/L (cutoff for age 72 = 720). What is the next step?",
        options: [
          "No further testing — D-dimer is only slightly elevated",
          "Order CTPA to confirm or exclude PE",
          "Start empiric anticoagulation and discharge",
          "Order bilateral leg ultrasound first"
        ],
        correct: 1,
        rationale: "Moderate pre-test probability with positive D-dimer (above age-adjusted cutoff) requires definitive imaging with CTPA. D-dimer is a rule-out test — any positive result at moderate-high probability demands imaging. Starting anticoagulation without confirming PE risks missing alternative diagnoses."
      }
    ]
  },
  "ards-management-np": {
    title: "ARDS: Berlin Criteria & Lung Protective Ventilation",
    cellular: {
      title: "Diffuse Alveolar Damage in ARDS",
      content: "ARDS is characterized by diffuse alveolar damage from pulmonary or extrapulmonary insults. The exudative phase (days 1-7) involves damage to the alveolar-capillary membrane: type I pneumocyte injury allows protein-rich edema fluid to flood alveoli, forming hyaline membranes. Neutrophil-mediated inflammation releases proteases and reactive oxygen species, amplifying damage. Surfactant dysfunction increases surface tension, promoting alveolar collapse. The result is bilateral pulmonary infiltrates, severe hypoxemia refractory to supplemental oxygen, and reduced lung compliance. Berlin criteria classify severity by PaO2/FiO2 ratio on PEEP >= 5: mild (200-300), moderate (100-200), severe (< 100). Lung-protective ventilation targeting low tidal volumes (6 mL/kg IBW) reduces ventilator-induced lung injury (VILI) from overdistention (volutrauma), cyclic opening/closing of atelectatic alveoli (atelectrauma), and biotrauma (cytokine release). The ARDS Network trial demonstrated a 22% mortality reduction with low Vt strategy."
    },
    riskFactors: [
      "Pneumonia (most common pulmonary cause)",
      "Sepsis (most common extrapulmonary cause)",
      "Aspiration of gastric contents",
      "Trauma with pulmonary contusion, massive transfusion (TRALI), or fat embolism",
      "Pancreatitis (severe, necrotizing)",
      "Inhalation injury (smoke, toxic gases)",
      "Near-drowning",
      "COVID-19, influenza, and other viral pneumonias"
    ],
    diagnostics: [
      "Berlin criteria: acute onset (within 1 week of insult), bilateral opacities on CXR/CT not fully explained by effusions/atelectasis, respiratory failure not fully explained by cardiac failure, PaO2/FiO2 ratio on PEEP >= 5 cmH2O",
      "P/F ratio classification: mild 200-300, moderate 100-200, severe < 100",
      "ABG: severe hypoxemia, wide A-a gradient, respiratory acidosis (or alkalosis with compensation)",
      "CXR: bilateral diffuse opacities (patchy or homogeneous, not cardiogenic pulmonary edema pattern)",
      "CT chest: ground-glass opacities, consolidation, dependent atelectasis, may show underlying cause",
      "Echocardiography: rule out cardiogenic pulmonary edema (normal LVEF, PCWP < 18 if PA catheter placed)",
      "BNP/NT-proBNP: helps distinguish cardiogenic from non-cardiogenic pulmonary edema (low in ARDS)",
      "Respiratory mechanics: reduced static compliance (< 40 mL/cmH2O), elevated plateau pressure"
    ],
    management: [
      "Lung-protective ventilation: Vt 6 mL/kg IBW (calculate IBW from height, NOT actual body weight), plateau pressure < 30 cmH2O",
      "PEEP titration: use FiO2/PEEP table (ARDSNet) or driving pressure strategy (Pplat - PEEP < 15)",
      "Driving pressure optimization: target < 15 cmH2O (best predictor of mortality in ventilated ARDS patients)",
      "Prone positioning for moderate-severe ARDS (P/F < 150): >= 16 hours/day (PROSEVA trial — 28-day mortality reduced from 33% to 16%)",
      "Conservative fluid management (FACTT trial): target CVP < 4 or PCWP < 8 once hemodynamically stable; reduces ventilator days",
      "Neuromuscular blockade (cisatracurium) for first 48 hours in severe ARDS (P/F < 150) — may improve outcomes (ACURASYS) though ROSE trial showed less clear benefit",
      "Rescue therapies for refractory hypoxemia: inhaled nitric oxide, ECMO (VV-ECMO for isolated respiratory failure, transfer to ECMO center)",
      "Treat underlying cause: antibiotics for pneumonia, source control for sepsis, drainage of abscess"
    ],
    nursingActions: [
      "Calculate ideal body weight (IBW) correctly: Males: 50 + 2.3(height in inches - 60); Females: 45.5 + 2.3(height in inches - 60) — tidal volume is based on IBW, NOT actual weight",
      "Monitor ventilator parameters: Vt 6 mL/kg IBW, Pplat < 30, driving pressure < 15, RR 20-35 to maintain pH > 7.20",
      "Implement prone positioning protocol: turn patient prone for >= 16 hours, secure all lines/tubes, pad pressure points, continue mechanical ventilation in prone position",
      "Monitor for complications of prone positioning: endotracheal tube dislodgement, pressure injuries (face, chest), line displacement",
      "Maintain conservative fluid balance: accurate I&O, daily weights, target net even or negative fluid balance once hemodynamically stable",
      "Provide deep sedation and neuromuscular blockade as ordered: ensure train-of-four monitoring, eye care, VTE prophylaxis",
      "Monitor for VILI: sudden increase in plateau pressure, new pneumothorax, subcutaneous emphysema",
      "Coordinate daily sedation awakening trials (SAT) and spontaneous breathing trials (SBT) per ABCDEF bundle when improving"
    ],
    signs: {
      left: [
        "Mild ARDS (P/F 200-300): responsive to moderate PEEP and FiO2 < 60%",
        "Improving oxygenation with lung-protective ventilation",
        "Resolving bilateral infiltrates on serial CXR",
        "Successfully weaning from mechanical ventilation"
      ],
      right: [
        "Severe ARDS (P/F < 100): refractory hypoxemia on maximum ventilator settings",
        "Pneumothorax from barotrauma (abrupt hemodynamic and respiratory deterioration)",
        "Multi-organ failure from underlying sepsis and cytokine storm",
        "Need for ECMO referral due to refractory hypoxemia (P/F < 60-80 on optimal settings)"
      ]
    },
    medications: [
      {
        name: "Cisatracurium",
        type: "Non-depolarizing Neuromuscular Blocking Agent",
        action: "Blocks nicotinic acetylcholine receptors at the neuromuscular junction, causing complete skeletal muscle paralysis; eliminates patient-ventilator dyssynchrony and reduces oxygen consumption",
        sideEffects: "Prolonged paralysis (ICU-acquired weakness), awareness without sedation (must ensure adequate sedation FIRST), corneal drying, DVT risk from immobility",
        contra: "Known myasthenia gravis, inadequate sedation, inability to secure airway",
        pearl: "Used in early severe ARDS (P/F < 150) for 48 hours. MUST provide deep sedation before and during paralysis — awareness under paralysis is torture. Use train-of-four monitoring (target 2/4 twitches). Organ-independent Hofmann elimination — safe in renal/hepatic failure. Does not cause histamine release (unlike atracurium)."
      },
      {
        name: "Inhaled Nitric Oxide (iNO)",
        type: "Pulmonary Vasodilator",
        action: "Activates guanylyl cyclase in pulmonary vascular smooth muscle, producing cGMP-mediated vasodilation; only dilates vessels in ventilated lung regions, improving V/Q matching",
        sideEffects: "Methemoglobinemia, rebound pulmonary hypertension on discontinuation, nitrogen dioxide formation",
        contra: "Severe LV dysfunction (increased pulmonary venous return may overwhelm failing LV), methemoglobinemia",
        pearl: "Rescue therapy for refractory hypoxemia in ARDS — improves oxygenation in ~60% of patients but has NOT shown mortality benefit. Start 20 ppm, wean to lowest effective dose. Monitor methemoglobin levels. Must wean gradually to avoid rebound pulmonary hypertension."
      }
    ],
    pearls: [
      "Tidal volume in ARDS is calculated from IDEAL body weight (based on height and sex), NOT actual body weight — this is one of the most common and dangerous errors in ARDS management; using actual weight in obese patients causes VILI",
      "Driving pressure (Plateau pressure - PEEP) is the best ventilator variable associated with mortality in ARDS — target < 15 cmH2O; if driving pressure is > 15, consider reducing Vt further or adjusting PEEP",
      "Prone positioning reduces mortality by ~50% in moderate-severe ARDS (PROSEVA trial) and should be initiated early (within 12-24 hours) — it is the most impactful intervention after lung-protective ventilation"
    ],
    quiz: [
      {
        question: "A mechanically ventilated patient with ARDS has the following settings: Vt 6 mL/kg IBW, PEEP 14, FiO2 80%. ABG shows PaO2 68 (P/F = 85). Plateau pressure is 32 cmH2O. What is the most appropriate next intervention?",
        options: [
          "Increase tidal volume to 8 mL/kg to improve ventilation",
          "Initiate prone positioning for >= 16 hours/day",
          "Decrease PEEP to reduce plateau pressure",
          "Start IV methylprednisolone 2 mg/kg/day"
        ],
        correct: 1,
        rationale: "P/F 85 = severe ARDS. Prone positioning is indicated for moderate-severe ARDS (P/F < 150) and should be implemented early. PROSEVA trial demonstrated 28-day mortality reduction from 33% to 16% with prone positioning >= 16 hours/day. Increasing Vt would worsen VILI. Decreasing PEEP would worsen oxygenation."
      }
    ]
  },
  "pneumonia-management-np": {
    title: "Pneumonia: CAP vs HAP Management",
    cellular: {
      title: "Pathogen-Specific Alveolar Infection",
      content: "Community-acquired pneumonia (CAP) results from pathogen entry into the lower respiratory tract overwhelming local immune defenses. S. pneumoniae remains the most common typical bacterial cause, producing lobar consolidation with inflammatory exudate filling alveoli. Atypical organisms (Mycoplasma, Chlamydophila, Legionella) cause interstitial inflammation with patchy infiltrates. Hospital-acquired pneumonia (HAP, >= 48 hours after admission) and ventilator-associated pneumonia (VAP, >= 48 hours after intubation) involve more resistant organisms: MRSA, Pseudomonas aeruginosa, Acinetobacter, extended-spectrum beta-lactamase (ESBL) producers. Risk factors for multidrug-resistant (MDR) pathogens include IV antibiotics within 90 days, > 5 days hospitalization, prior MDR colonization, structural lung disease, and immunosuppression. Severity assessment using CRB-65 (outpatient) or CURB-65 and PSI/PORT (inpatient) guides site-of-care and empiric antibiotic decisions."
    },
    riskFactors: [
      "Age >= 65 years with multiple comorbidities",
      "Chronic lung disease: COPD, bronchiectasis, CF",
      "Immunosuppression: chemotherapy, HIV, biologics, transplant, chronic steroids",
      "Aspiration risk: dysphagia, stroke, dementia, GERD, alcoholism",
      "Smoking (active or recent cessation)",
      "Recent hospitalization or long-term care residence (risk for resistant organisms)",
      "Mechanical ventilation (VAP risk increases ~1-3% per ventilator day)",
      "Poor oral hygiene (aspiration pneumonia)"
    ],
    diagnostics: [
      "CXR PA and lateral: consolidation, air bronchograms, pleural effusion, interstitial pattern",
      "CURB-65 score: Confusion, Urea > 7 mmol/L, RR >= 30, BP < 90/60, age >= 65 — score 0-1 outpatient, 2 consider admission, 3-5 ICU/high care",
      "Blood cultures × 2 before antibiotics for moderate-severe CAP and all HAP/VAP",
      "Sputum Gram stain and culture: quality specimen (> 25 PMNs, < 10 squamous/LPF)",
      "Procalcitonin: > 0.25 mcg/L supports bacterial etiology; serial levels guide antibiotic duration",
      "Legionella and pneumococcal urinary antigens for moderate-severe CAP",
      "CT chest if CXR equivocal, complicated effusion suspected, or treatment failure at 48-72 hours",
      "BAL or mini-BAL for VAP diagnosis: quantitative cultures > 10⁴ CFU/mL considered positive"
    ],
    management: [
      "Outpatient CAP (healthy, no comorbidities): amoxicillin 1 g TID × 5 days (or doxycycline if penicillin allergy)",
      "Outpatient CAP (comorbidities or recent antibiotics): amoxicillin-clavulanate 875/125 BID + azithromycin 500 mg day 1 then 250 mg × 4 days; or respiratory fluoroquinolone (moxifloxacin 400 mg daily)",
      "Inpatient CAP (non-ICU): ceftriaxone 2 g IV daily + azithromycin 500 mg IV daily; or respiratory fluoroquinolone monotherapy",
      "Inpatient CAP (ICU): ceftriaxone 2 g IV + azithromycin 500 mg IV; if Pseudomonas risk: piperacillin-tazobactam + fluoroquinolone; if MRSA risk: add vancomycin",
      "HAP (non-severe, no MDR risk): piperacillin-tazobactam or cefepime or meropenem",
      "HAP/VAP (severe or MDR risk): anti-pseudomonal beta-lactam + anti-pseudomonal fluoroquinolone/aminoglycoside + vancomycin (or linezolid) if MRSA risk",
      "Duration: CAP 5-7 days (guided by clinical stability ≥ 48 hours); HAP/VAP 7 days (shorter courses per procalcitonin)",
      "Switch from IV to oral when: clinical improvement, afebrile ≥ 48 hours, able to tolerate oral intake, no concern for complicated infection"
    ],
    nursingActions: [
      "Obtain blood cultures and sputum culture BEFORE first antibiotic dose — do not delay cultures but also do not delay antibiotics significantly",
      "Administer first antibiotic dose within 4 hours of presentation (1 hour if septic) — time to first antibiotic correlates with mortality",
      "Monitor for clinical response at 48-72 hours: defervescence, improving WBC, decreasing O2 requirement, improving CXR",
      "Assess for complications: parapneumonic effusion (consider thoracentesis if > 10 mm layering on lateral decubitus), empyema, lung abscess",
      "Implement aspiration precautions: HOB 30-45°, assess swallowing function, oral hygiene protocol",
      "Provide pneumococcal and influenza vaccination before discharge if not current",
      "Calculate CURB-65 for admission decision and communication with medical team",
      "Educate on completing antibiotic course, follow-up CXR at 6-8 weeks for smokers > 50 (rule out underlying malignancy)"
    ],
    signs: {
      left: [
        "Productive cough with purulent sputum and low-grade fever",
        "Focal crackles on lung auscultation with CXR consolidation",
        "CURB-65 score 0-1 appropriate for outpatient management",
        "Responding to empiric antibiotics within 48-72 hours"
      ],
      right: [
        "Severe sepsis from pneumonia: MAP < 65, lactate > 2, need for vasopressors",
        "Respiratory failure requiring mechanical ventilation (P/F < 300 suggests ARDS)",
        "Empyema requiring chest tube drainage (pH < 7.2, glucose < 40, positive Gram stain/culture)",
        "Multi-lobar involvement with cavitation suggesting necrotizing pneumonia"
      ]
    },
    medications: [
      {
        name: "Ceftriaxone",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs, inhibiting cell wall synthesis; broad-spectrum activity against S. pneumoniae, H. influenzae, M. catarrhalis, and most Enterobacteriaceae",
        sideEffects: "Diarrhea, C. difficile infection, biliary sludge, allergic reactions",
        contra: "Severe penicillin allergy (type I hypersensitivity), concurrent IV calcium in neonates",
        pearl: "Backbone of inpatient CAP therapy: 2 g IV daily. Always pair with atypical coverage (azithromycin or doxycycline). Does NOT cover Pseudomonas or MRSA — if these are suspected, use piperacillin-tazobactam or cefepime. Convenient once-daily dosing for OPAT."
      },
      {
        name: "Azithromycin",
        type: "Macrolide Antibiotic",
        action: "Binds 50S ribosomal subunit, inhibiting bacterial protein synthesis; covers atypical organisms (Mycoplasma, Chlamydophila, Legionella) and has immunomodulatory anti-inflammatory effects",
        sideEffects: "QT prolongation, GI upset (nausea, diarrhea), hepatotoxicity (rare), hearing loss (rare, reversible)",
        contra: "Known macrolide allergy, concurrent QT-prolonging medications, severe hepatic impairment, history of cholestatic jaundice with prior azithromycin",
        pearl: "CAP dosing: 500 mg IV/PO day 1 then 250 mg daily × 4 days. The anti-inflammatory properties may contribute to improved outcomes beyond antimicrobial activity. Monitor QTc. Check for local macrolide resistance rates (> 25% in some regions — consider fluoroquinolone alternative)."
      }
    ],
    pearls: [
      "Time to first antibiotic is a critical quality metric — administer within 4 hours of presentation for CAP and within 1 hour for severe sepsis/septic shock from pneumonia",
      "Procalcitonin-guided antibiotic duration reduces unnecessary antibiotic days without increasing mortality — if procalcitonin drops by > 80% from peak or falls below 0.25, consider stopping antibiotics (typically at day 5-7)",
      "For smokers > 50 with CAP, always arrange follow-up CXR at 6-8 weeks to confirm resolution — persistent infiltrate may represent an underlying lung malignancy that was initially obscured by the pneumonia"
    ],
    quiz: [
      {
        question: "A 70-year-old with COPD presents with productive cough, fever 39°C, RR 32, BP 85/55, BUN 28 mg/dL, and confusion. What is the CURB-65 score and disposition?",
        options: [
          "CURB-65 = 2 — admit to general ward",
          "CURB-65 = 4 — admit to ICU",
          "CURB-65 = 1 — consider outpatient treatment",
          "CURB-65 = 5 — ICU with palliative care consultation"
        ],
        correct: 3,
        rationale: "CURB-65: Confusion (1) + Urea > 7 (BUN 28 = urea ~10 mmol/L) (1) + RR >= 30 (1) + BP < 90 systolic (1) + age >= 65 (1) = 5/5. Score >= 3 requires ICU/high-dependency admission. Score 5 has 57% 30-day mortality. This patient needs emergent resuscitation, broad-spectrum antibiotics (ceftriaxone + azithromycin), and ICU care."
      }
    ]
  },
  "tb-management-np": {
    title: "Tuberculosis: RIPE Therapy & MDR-TB",
    cellular: {
      title: "Mycobacterium tuberculosis Pathogenesis",
      content: "M. tuberculosis is an aerobic, slow-growing acid-fast bacillus that establishes infection primarily in the lungs. After inhalation, bacilli are phagocytosed by alveolar macrophages but resist intracellular killing by inhibiting phagosome-lysosome fusion. Cell-mediated immunity (Th1 response) is activated after 2-8 weeks, producing granulomas that contain but do not eliminate infection. The Ghon complex (primary lung focus + draining lymph node) represents contained primary infection. Latent TB infection (LTBI) harbors dormant bacilli within granulomas — 5-10% lifetime risk of reactivation, increased to 5-15% per year in HIV with CD4 < 200. Active TB occurs when immune surveillance fails. Cavitary disease develops in the upper lobes (highest oxygen tension promotes bacillary growth), producing cough with hemoptysis, weight loss, night sweats, and high bacillary load (infectious). Drug resistance arises from spontaneous chromosomal mutations; combination therapy with RIPE prevents selection of resistant mutants."
    },
    riskFactors: [
      "Close contact with active TB case (household, congregate settings)",
      "HIV co-infection (greatest risk factor for progression — 5-15%/year if untreated)",
      "Immunosuppression: TNF-alpha inhibitors, corticosteroids > 15 mg/day, organ transplant",
      "Recent immigration from high-burden countries (India, China, Philippines, Nigeria, Indonesia)",
      "Incarceration, homelessness, IV drug use",
      "Healthcare workers with occupational exposure",
      "Diabetes mellitus (3x increased risk of active TB)",
      "Silicosis, chronic renal failure, malnutrition"
    ],
    diagnostics: [
      "CXR: upper lobe infiltrates, cavitation (reactivation); hilar lymphadenopathy, middle/lower lobe infiltrates (primary); miliary pattern (disseminated)",
      "Sputum AFB smear × 3 (induced if unable to produce): sensitivity 50-80% for pulmonary TB",
      "Sputum culture on Lowenstein-Jensen or BACTEC MGIT (gold standard): takes 2-8 weeks but provides susceptibility testing",
      "GeneXpert MTB/RIF: rapid molecular test (2 hours) detecting M. tuberculosis AND rifampin resistance — sensitivity > 95% for smear-positive, 67% for smear-negative",
      "TST (Mantoux): >= 5 mm positive in HIV, close contacts, CXR changes, immunosuppressed; >= 10 mm for high-risk groups; >= 15 mm for low-risk",
      "IGRA (QuantiFERON-TB Gold, T-SPOT): interferon-gamma release assay — no false positives from BCG vaccination; preferred for BCG-vaccinated populations",
      "Drug susceptibility testing (DST): essential for all culture-positive cases; rapid molecular DST for rifampin and isoniazid resistance",
      "HIV testing: mandatory for all TB patients (co-infection changes management significantly)"
    ],
    management: [
      "Active pulmonary TB: RIPE therapy — Rifampin 10 mg/kg (max 600 mg), Isoniazid 5 mg/kg (max 300 mg), Pyrazinamide 25 mg/kg (max 2 g), Ethambutol 15 mg/kg — all daily × 2 months (intensive phase)",
      "Continuation phase: Rifampin + Isoniazid daily × 4 months (total 6 months); extend to 9 months for cavitary disease with positive 2-month culture",
      "Pyridoxine (vitamin B6) 25-50 mg daily with isoniazid to prevent peripheral neuropathy",
      "Directly Observed Therapy (DOT): recommended for all TB treatment to ensure adherence and prevent resistance",
      "MDR-TB (resistant to INH + RIF): individualized regimen based on DST; bedaquiline + pretomanid + linezolid (BPaL regimen) is standard of care; 9-18 months duration",
      "LTBI treatment: isoniazid 300 mg daily × 9 months, OR rifampin 600 mg daily × 4 months, OR isoniazid + rifapentine weekly × 12 weeks (3HP regimen — DOT preferred)",
      "TB-HIV co-infection: start ART within 2 weeks if CD4 < 50, within 8 weeks for higher CD4; watch for IRIS",
      "Airborne isolation precautions until 3 consecutive negative AFB sputum smears and clinical improvement"
    ],
    nursingActions: [
      "Initiate airborne isolation precautions: negative pressure room, N95 respirator, door closed; maintain until 3 consecutive negative AFB smears",
      "Coordinate DOT: observe patient swallowing each dose; document completion of each treatment dose",
      "Monitor for hepatotoxicity: baseline LFTs then monthly if symptomatic or risk factors (alcohol, hepatitis, HIV); hold drugs if ALT > 3× ULN with symptoms or > 5× ULN without symptoms",
      "Assess for isoniazid peripheral neuropathy: ensure pyridoxine is prescribed; check for numbness/tingling at each visit",
      "Monitor visual acuity and color vision (monthly during ethambutol therapy — optic neuritis is dose-related and reversible if caught early)",
      "Educate on medication adherence: TB treatment requires 6-9 months; incomplete treatment leads to drug resistance and relapse",
      "Report all active TB cases to public health authorities for contact investigation",
      "Screen close contacts with TST or IGRA and CXR; treat LTBI in all contacts with positive results"
    ],
    signs: {
      left: [
        "Chronic productive cough > 3 weeks with constitutional symptoms (weight loss, night sweats, fever)",
        "Upper lobe infiltrate on CXR without cavitation",
        "Positive IGRA/TST in asymptomatic person (LTBI)",
        "Smear-positive with drug-susceptible organisms responding to RIPE"
      ],
      right: [
        "Cavitary TB with hemoptysis and high infectivity",
        "Miliary TB: diffuse bilateral miliary nodules with multi-organ involvement",
        "TB meningitis: headache, cranial nerve palsies, basilar meningeal enhancement",
        "MDR-TB or XDR-TB requiring complex treatment regimens with significant toxicity"
      ]
    },
    medications: [
      {
        name: "Rifampin (Rifampicin)",
        type: "RNA Polymerase Inhibitor",
        action: "Inhibits bacterial DNA-dependent RNA polymerase, preventing mRNA synthesis; bactericidal against actively growing and semi-dormant bacilli",
        sideEffects: "Hepatotoxicity, orange discoloration of bodily fluids, GI upset, flu-like syndrome, thrombocytopenia, induces CYP3A4/2C9 (major drug interactions)",
        contra: "Concurrent protease inhibitors (massive interaction), severe hepatic impairment, hypersensitivity",
        pearl: "Most important drug in TB regimen — kills semi-dormant bacilli, enabling 6-month treatment duration. Potent CYP inducer: reduces levels of warfarin (increase dose 2-3×), OCP (use alternative contraception), methadone, and many HIV drugs. Orange body fluids are expected — counsel patients."
      },
      {
        name: "Isoniazid (INH)",
        type: "Mycolic Acid Synthesis Inhibitor",
        action: "Prodrug activated by mycobacterial KatG catalase-peroxidase; inhibits InhA (enoyl-ACP reductase) in mycolic acid biosynthesis, disrupting cell wall integrity; bactericidal against rapidly multiplying bacilli",
        sideEffects: "Hepatotoxicity (age-related: 0.3% age 20-34, 2.6% age > 50), peripheral neuropathy (pyridoxine-preventable), drug-induced lupus, seizures (overdose)",
        contra: "Acute hepatic disease, prior INH-associated hepatitis, concurrent disulfiram use",
        pearl: "Always co-prescribe pyridoxine (B6) 25-50 mg daily to prevent neuropathy. Monthly LFT monitoring if risk factors (age > 35, alcohol, liver disease, HIV). Fast acetylators may have lower drug levels — clinical significance debated. INH monoresistance: extend RIF-based treatment to 6 months substituting a fluoroquinolone."
      }
    ],
    pearls: [
      "GeneXpert MTB/RIF provides results within 2 hours and simultaneously detects rifampin resistance — this single test can diagnose TB AND identify MDR-TB, revolutionizing initial management decisions",
      "Rifampin is a potent CYP inducer — review the ENTIRE medication list before starting TB treatment; OCP failure (use alternative contraception), warfarin (increase dose 2-3×), methadone withdrawal, and many drug interactions are common causes of treatment complications",
      "The 3HP regimen (12 weeks of weekly isoniazid + rifapentine by DOT) is the preferred LTBI treatment due to higher completion rates (82%) compared to 9 months of daily isoniazid (69%)"
    ],
    quiz: [
      {
        question: "A 45-year-old immigrant from the Philippines has a positive IGRA, normal CXR, and no symptoms. She takes warfarin for atrial fibrillation. What is the most appropriate LTBI treatment?",
        options: [
          "Isoniazid 300 mg daily × 9 months with pyridoxine",
          "Rifampin 600 mg daily × 4 months",
          "RIPE therapy × 2 months then INH + RIF × 4 months",
          "No treatment needed — monitor with annual CXR"
        ],
        correct: 0,
        rationale: "Positive IGRA with normal CXR and no symptoms = LTBI requiring treatment. Rifampin 4 months would be ideal for shorter course and better completion, but rifampin is a potent CYP inducer that dramatically reduces warfarin levels, making INR management extremely difficult. INH 9 months with pyridoxine is preferred in patients on warfarin. RIPE therapy is for active TB only."
      }
    ]
  },
  "pleural-effusion-np": {
    title: "Pleural Effusion: Exudative vs Transudative",
    cellular: {
      title: "Pleural Fluid Dynamics and Classification",
      content: "Pleural effusions result from imbalance between fluid formation and absorption in the pleural space. Transudative effusions form from increased hydrostatic pressure (CHF — most common cause, hepatic hydrothorax, nephrotic syndrome) or decreased oncotic pressure (hypoalbuminemia). The pleural membrane is intact — fluid is an ultrafiltrate of plasma. Exudative effusions result from increased capillary permeability due to inflammation (pneumonia, TB), malignancy (pleural metastases, mesothelioma), or lymphatic obstruction. Light's criteria differentiate transudative from exudative: an effusion is exudative if ANY ONE criterion is met — pleural protein/serum protein > 0.5, pleural LDH/serum LDH > 0.6, or pleural LDH > 2/3 upper limit of normal serum LDH. Light's criteria have 98% sensitivity for exudates but may misclassify transudates in patients on diuretics — apply serum-to-pleural albumin gradient (> 1.2 g/dL suggests transudate despite meeting Light's criteria)."
    },
    riskFactors: [
      "Heart failure (most common cause of transudative effusion)",
      "Pneumonia (parapneumonic effusion — most common cause of exudative effusion)",
      "Malignancy: lung cancer, breast cancer, lymphoma, mesothelioma",
      "Pulmonary embolism (exudative or transudative)",
      "Hepatic cirrhosis with ascites (hepatic hydrothorax — typically right-sided)",
      "Nephrotic syndrome (hypoalbuminemia)",
      "Tuberculosis (lymphocyte-predominant exudative effusion)",
      "Autoimmune: SLE (lupus pleuritis), rheumatoid arthritis"
    ],
    diagnostics: [
      "CXR: meniscus sign (blunting of costophrenic angle at ~300 mL), lateral decubitus film to confirm free-flowing (> 10 mm layering = safe to tap)",
      "Thoracentesis for all new unilateral effusions (except clearly bilateral in known CHF responsive to diuretics)",
      "Light's criteria: protein ratio > 0.5, LDH ratio > 0.6, or pleural LDH > 2/3 ULN serum LDH → EXUDATE",
      "Pleural fluid analysis: cell count and differential, protein, LDH, glucose, pH, Gram stain, culture, cytology",
      "Low glucose (< 60 mg/dL): empyema, rheumatoid pleurisy, TB, malignancy, lupus pleuritis, esophageal rupture",
      "Low pH (< 7.2): complicated parapneumonic effusion/empyema requiring drainage",
      "Cytology: sensitivity 60% for first sample, 70-75% with repeat; mesothelioma requires biopsy",
      "CT chest with contrast: parenchymal lesions, pleural thickening/nodularity (malignancy), mediastinal lymphadenopathy"
    ],
    management: [
      "Transudative: treat underlying cause — diuresis for CHF (goal negative 1 L/day), albumin for nephrotic syndrome, sodium restriction for hepatic hydrothorax",
      "Therapeutic thoracentesis: up to 1.5 L in single session (risk of re-expansion pulmonary edema if > 1.5 L removed; stop if chest tightness or persistent cough)",
      "Complicated parapneumonic effusion (pH < 7.2, glucose < 40, positive Gram stain/culture, or frank pus/empyema): chest tube drainage ± intrapleural tPA + DNase (MIST2 trial)",
      "Malignant pleural effusion: therapeutic thoracentesis for symptom relief; indwelling pleural catheter (IPC) for recurrent effusions; pleurodesis (talc slurry or poudrage) for ambulatory patients with expandable lung",
      "TB pleuritis: standard RIPE therapy (pleural TB responds well; thoracentesis for diagnosis, not typically needing serial drainage)",
      "Empyema: chest tube + antibiotics ± fibrinolytic therapy; VATS decortication if loculated or not responding to medical management",
      "Hepatic hydrothorax: sodium restriction (< 2 g/day), diuretics (spironolactone + furosemide), TIPS for refractory cases; chest tube is relatively contraindicated (high complication rate)",
      "Chylothorax (triglycerides > 110 mg/dL): conservative management with MCT diet or TPN; thoracic duct ligation if conservative therapy fails"
    ],
    nursingActions: [
      "Prepare for thoracentesis: position patient sitting upright leaning forward, ultrasound-guided site marking, maintain sterile technique",
      "Monitor during thoracentesis: stop if chest tightness, persistent cough, or > 1.5 L drained (re-expansion pulmonary edema risk)",
      "Post-thoracentesis: CXR to rule out pneumothorax, monitor SpO2 and respiratory status, send fluid for ordered analyses",
      "Chest tube management: maintain drainage system integrity, monitor output (color, volume), assess for air leak, encourage deep breathing",
      "Indwelling pleural catheter (IPC) care: sterile dressing changes per protocol, drainage 3× per week, educate patient/family on home drainage technique",
      "Assess response to diuretic therapy for transudative effusion: daily weights, I&O, respiratory status",
      "Document effusion characteristics: laterality, estimated size, and response to interventions",
      "Coordinate oncology referral for malignant effusion; palliative care for symptom management"
    ],
    signs: {
      left: [
        "Small effusion: mildly decreased breath sounds at base, dullness to percussion",
        "Bilateral effusions in CHF responding to diuresis",
        "Simple parapneumonic effusion (pH > 7.2, glucose > 40) resolving with antibiotics alone",
        "Stable malignant effusion managed with intermittent IPC drainage"
      ],
      right: [
        "Massive effusion causing mediastinal shift and respiratory failure",
        "Empyema with sepsis: purulent drainage, high fever, hemodynamic instability",
        "Trapped lung from malignant pleural encasement (lung does not expand after drainage)",
        "Tension hydrothorax or hemothorax with hemodynamic compromise"
      ]
    },
    medications: [
      {
        name: "Intrapleural tPA + DNase (MIST2 Protocol)",
        type: "Fibrinolytic + DNase Combination",
        action: "tPA dissolves fibrin septations within loculated effusion; DNase breaks down extracellular DNA from neutrophil extracellular traps, reducing viscosity; combination improves drainage of complicated effusions",
        sideEffects: "Chest pain during instillation, bleeding (uncommon), allergic reaction",
        contra: "Active pleural hemorrhage, bronchopleural fistula",
        pearl: "MIST2 trial protocol: tPA 10 mg + DNase 5 mg in 30 mL NS, instilled via chest tube, clamped 1 hour, then unclamped to drainage. Given BID × 3 days (6 doses total). Significantly reduces need for surgical intervention for complicated parapneumonic effusion and empyema."
      },
      {
        name: "Talc (for Pleurodesis)",
        type: "Sclerosing Agent",
        action: "Instilled as slurry through chest tube or poudrage during thoracoscopy; creates intense inflammatory reaction between visceral and parietal pleura, causing fibrosis and permanent pleural symphysis",
        sideEffects: "Chest pain (pre-medicate with lidocaine), fever, rare ARDS (use calibrated talc with particle size > 15 μm to minimize risk)",
        contra: "Trapped lung (pleural surfaces cannot appose), bronchopleural fistula, active pleural infection, very short life expectancy (IPC preferred)",
        pearl: "Talc pleurodesis success rate ~70-80% for malignant effusion. Requires expandable lung (pleural surfaces must contact). Pre-medicate with intrapleural lidocaine 3 mg/kg. Alternative to IPC for patients with good performance status. Graded talc (large particle size) has lower ARDS risk."
      }
    ],
    pearls: [
      "Light's criteria have 98% sensitivity for exudates but may misclassify transudates as exudates in diuretic-treated CHF patients — if clinical picture suggests transudate but Light's says exudate, check serum-to-pleural albumin gradient (> 1.2 g/dL = transudate)",
      "A complicated parapneumonic effusion (pH < 7.2 or glucose < 40 mg/dL or positive Gram stain) will NOT resolve with antibiotics alone and requires chest tube drainage — delayed drainage leads to empyema and need for surgical decortication",
      "Never place a chest tube for hepatic hydrothorax — it leads to massive ongoing fluid drainage, protein/electrolyte depletion, and high infection risk; treat the underlying cirrhosis with diuretics and sodium restriction, or consider TIPS"
    ],
    quiz: [
      {
        question: "Thoracentesis of a right-sided effusion in a patient with pneumonia reveals: pH 6.9, glucose 25 mg/dL, LDH 1200, positive Gram stain for gram-positive cocci. What is the most appropriate next step?",
        options: [
          "Continue IV antibiotics alone — the effusion will resolve",
          "Place chest tube for drainage and continue antibiotics",
          "Repeat thoracentesis in 48 hours to reassess",
          "Talc pleurodesis through thoracoscopy"
        ],
        correct: 1,
        rationale: "This is a complicated parapneumonic effusion / empyema (pH < 7.2, glucose < 40, positive Gram stain). It will NOT resolve with antibiotics alone — chest tube drainage is mandatory. If loculated, consider intrapleural tPA + DNase (MIST2 protocol). Delay in drainage leads to progressive loculation, empyema, and eventual need for surgical decortication."
      }
    ]
  },
  "pulmonary-hypertension-np": {
    title: "Pulmonary Hypertension: WHO Classification",
    cellular: {
      title: "Pulmonary Vascular Remodeling",
      content: "Pulmonary hypertension (PH) is defined as mean pulmonary artery pressure (mPAP) > 20 mmHg at rest by right heart catheterization (2022 updated definition, previously > 25 mmHg). The WHO classification groups PH by pathophysiology: Group 1 (PAH — pulmonary arterial hypertension) involves intrinsic pulmonary vascular remodeling with intimal proliferation, medial hypertrophy, and plexiform lesions in small pulmonary arteries; Group 2 (left heart disease) is the most common cause, from elevated PCWP transmitting backward to the pulmonary vasculature; Group 3 (lung disease/hypoxia) involves hypoxic vasoconstriction from COPD, ILD, or OSA; Group 4 (CTEPH) results from organized thrombus in pulmonary arteries after PE; Group 5 (multifactorial). Distinguishing pre-capillary PH (Groups 1,3,4 — PCWP <= 15, PVR >= 3 WU) from post-capillary PH (Group 2 — PCWP > 15) is critical because PAH-specific vasodilator therapy can worsen Group 2 PH."
    },
    riskFactors: [
      "Left heart disease: HFrEF, HFpEF, valvular disease (Group 2 — most common overall cause)",
      "Chronic lung disease: COPD, ILD, combined pulmonary fibrosis and emphysema (Group 3)",
      "Prior pulmonary embolism — CTEPH develops in 2-4% of PE survivors (Group 4)",
      "Connective tissue diseases: scleroderma (SSc — highest risk, 10-15% develop PAH), SLE, MCTD",
      "HIV infection, portal hypertension, congenital heart disease with shunt",
      "Drug/toxin-induced: methamphetamine, anorexigens (historical — fenfluramine/dexfenfluramine)",
      "Hereditary PAH: BMPR2 mutation (most common genetic cause), ALK1, ENG",
      "Obstructive sleep apnea, obesity hypoventilation syndrome"
    ],
    diagnostics: [
      "Echocardiography: estimated PASP (TR velocity + RAP estimate), RV dilation, RV dysfunction (TAPSE < 17 mm), D-shaped septum, RA dilation",
      "Right heart catheterization (RHC): MANDATORY for definitive diagnosis and classification — mPAP, PCWP, CO, PVR, vasoreactivity testing",
      "Pre-capillary PH: mPAP > 20, PCWP <= 15, PVR >= 3 WU; Post-capillary: PCWP > 15",
      "V/Q scan: screening test for CTEPH (Group 4) — mismatched perfusion defects; normal V/Q effectively excludes CTEPH",
      "PFTs + DLCO: DLCO disproportionately reduced relative to FEV1 suggests PH (especially in scleroderma screening)",
      "6-minute walk test (6MWT): functional capacity assessment and treatment response monitoring",
      "CT chest: ground-glass nodularity (pulmonary capillary hemangiomatosis), enlarged PA diameter (> ascending aorta suggests PH), parenchymal disease",
      "BNP/NT-proBNP: prognostic marker; correlates with RV dysfunction severity; used for treatment response monitoring"
    ],
    management: [
      "Group 1 (PAH) — vasodilator therapy: first-line endothelin receptor antagonist (ERA) + PDE5 inhibitor combination therapy for intermediate risk",
      "ERA: ambrisentan 10 mg daily or macitentan 10 mg daily (blocks endothelin-1 receptors causing pulmonary vasodilation)",
      "PDE5 inhibitor: sildenafil 20 mg TID or tadalafil 40 mg daily (enhances NO-mediated vasodilation)",
      "Prostacyclin pathway agents for high-risk PAH: IV epoprostenol (continuous infusion), inhaled treprostinil, oral selexipag",
      "Vasoreactivity testing positive (rare, ~10%): CCB trial (nifedipine or diltiazem) — only for true vasoreactive PAH",
      "Group 2: treat underlying left heart disease; PAH-specific therapies are CONTRAINDICATED (worsen pulmonary edema)",
      "Group 3: supplemental oxygen, treat underlying lung disease; limited role for PAH therapies",
      "Group 4 (CTEPH): pulmonary endarterectomy (PEA) is potentially curative; riociguat (sGC stimulator) for inoperable CTEPH or residual PH post-PEA"
    ],
    nursingActions: [
      "Monitor for signs of RV failure: JVD, peripheral edema, hepatomegaly, ascites, declining functional capacity",
      "Educate on proper prostacyclin infusion management (if applicable): pump operation, cassette changes, line care, emergency procedures for pump failure",
      "Monitor 6MWT distance at each visit — decline > 30 meters suggests disease progression",
      "Track BNP/NT-proBNP trends as prognostic and treatment response markers",
      "Educate on fluid restriction (< 2 L/day) and sodium restriction (< 2 g/day) for volume management",
      "Assess oxygen requirements and ensure supplemental O2 maintains SpO2 > 90%",
      "Monitor for medication side effects: ERA hepatotoxicity (monthly LFTs), PDE5 inhibitor headache/hypotension, prostacyclin jaw pain/flushing",
      "Counsel women of childbearing age: pregnancy carries 30-50% mortality risk in PAH — effective contraception is mandatory"
    ],
    signs: {
      left: [
        "Mild exertional dyspnea (WHO functional class II)",
        "Normal 6MWT distance (> 440 meters)",
        "Preserved RV function on echo with mild PH",
        "NT-proBNP < 300 pg/mL"
      ],
      right: [
        "Syncope with exertion (severe RV dysfunction — fixed cardiac output)",
        "RV failure: severe edema, ascites, hepatic congestion, declining UOP",
        "Hemoptysis from pulmonary artery rupture (rare, terminal event)",
        "Cardiac arrest from RV failure or arrhythmia"
      ]
    },
    medications: [
      {
        name: "Macitentan (Opsumit)",
        type: "Endothelin Receptor Antagonist (ERA)",
        action: "Dual ET-A and ET-B receptor antagonist; blocks endothelin-1 (potent vasoconstrictor and mitogen) in pulmonary vasculature, reducing PVR and pulmonary artery remodeling",
        sideEffects: "Anemia, nasopharyngitis, headache, hepatotoxicity (less than older ERAs), fluid retention, teratogenicity",
        contra: "Pregnancy (Category X — highly teratogenic; monthly pregnancy test required), concurrent cyclosporine, severe hepatic impairment",
        pearl: "SERAPHIN trial showed macitentan 10 mg reduced morbidity/mortality composite by 45% vs placebo. Monthly LFTs no longer mandatory but monitor if symptomatic. Must be prescribed through REMS program with pregnancy prevention measures. First-line component of combination therapy."
      },
      {
        name: "IV Epoprostenol (Flolan)",
        type: "Prostacyclin Analog",
        action: "Directly stimulates prostacyclin (IP) receptors on pulmonary vascular smooth muscle, causing vasodilation, antiproliferative effects, and platelet inhibition",
        sideEffects: "Jaw pain, flushing, headache, diarrhea, leg pain, line infections, rebound PH if abruptly discontinued (life-threatening)",
        contra: "Severe LV systolic dysfunction, pulmonary veno-occlusive disease",
        pearl: "Only PAH therapy proven to improve survival. Continuous IV infusion via central line — CANNOT be interrupted even briefly (rebound PH → death within hours). Requires patient/caregiver training in pump management. Must have backup pump available at all times. Half-life only 6 minutes."
      }
    ],
    pearls: [
      "Right heart catheterization is MANDATORY before starting PAH-specific vasodilator therapy — Group 2 PH (left heart disease) is the most common cause of PH and is WORSENED by PAH vasodilators (increased pulmonary venous return overwhelms failing LV)",
      "IV epoprostenol CANNOT be interrupted even briefly — abrupt cessation causes rebound pulmonary hypertension and can be rapidly fatal; patients must have backup pumps and emergency plans",
      "Pregnancy carries 30-50% mortality in PAH — all women of childbearing age with PAH must use reliable contraception; ERAs (macitentan, ambrisentan, bosentan) are highly teratogenic (Category X)"
    ],
    quiz: [
      {
        question: "Echocardiography suggests PH in a patient with SSc (scleroderma). PASP is estimated at 55 mmHg. What is the mandatory next step before initiating PAH-specific therapy?",
        options: [
          "Start sildenafil 20 mg TID based on echocardiographic findings",
          "Right heart catheterization to confirm diagnosis and classify PH",
          "Start supplemental oxygen and order PFTs",
          "CT chest with contrast to evaluate lung parenchyma"
        ],
        correct: 1,
        rationale: "Right heart catheterization is MANDATORY before initiating PAH-specific therapy. Echo estimates PASP but cannot definitively diagnose PAH or distinguish pre-capillary from post-capillary PH. RHC measures mPAP, PCWP, CO, and PVR — these determine PH classification and guide treatment. Starting vasodilators without RHC risks treating Group 2 PH with PAH drugs, which is harmful."
      }
    ]
  },
  "lung-cancer-staging-np": {
    title: "Lung Cancer: TNM Staging & Treatment",
    cellular: {
      title: "Pulmonary Oncology: Histology and Molecular Drivers",
      content: "Lung cancer is classified into non-small cell (NSCLC, 85%) and small cell (SCLC, 15%). NSCLC subtypes include adenocarcinoma (most common, 40%), squamous cell carcinoma (25-30%), and large cell carcinoma. Adenocarcinoma harbors actionable molecular drivers in ~60% of cases: EGFR mutations (exon 19 deletion, L858R — respond to osimertinib), ALK rearrangements (respond to alectinib), ROS1, BRAF V600E, KRAS G12C (sotorasib), and MET exon 14 skipping. PD-L1 expression (tumor proportion score) predicts response to immune checkpoint inhibitors (pembrolizumab, nivolumab). TNM staging (8th edition) guides treatment: T (tumor size and invasion), N (lymph node involvement — N0 none, N1 ipsilateral hilar, N2 ipsilateral mediastinal, N3 contralateral), M (metastases). Stage I-II: surgical resection; Stage III: multimodal (chemoradiation ± surgery ± immunotherapy); Stage IV: systemic therapy guided by molecular profiling and PD-L1."
    },
    riskFactors: [
      "Tobacco smoking (85-90% of cases; 15-30 pack-year threshold for LDCT screening)",
      "Second-hand smoke exposure (20-30% increased lung cancer risk)",
      "Radon exposure (leading cause in non-smokers; measure home radon levels)",
      "Occupational carcinogens: asbestos, arsenic, chromium, diesel exhaust, silica",
      "Prior radiation therapy to the chest",
      "Family history of lung cancer (first-degree relative)",
      "COPD and pulmonary fibrosis (independent risk factors)",
      "Air pollution (PM2.5 exposure)"
    ],
    diagnostics: [
      "Low-dose CT screening: annual for adults 50-80 years with >= 20 pack-year history who currently smoke or quit within 15 years",
      "Tissue diagnosis: CT-guided biopsy, bronchoscopy with biopsy, or surgical biopsy for pathologic confirmation",
      "Molecular profiling of NSCLC: EGFR, ALK, ROS1, BRAF, KRAS G12C, MET, RET, NTRK, HER2, PD-L1 immunohistochemistry",
      "PET-CT: staging for nodal and distant metastatic disease; SUV > 2.5 concerning for malignancy",
      "Brain MRI with contrast: staging baseline (brain metastases present in 10-20% at diagnosis)",
      "PFTs: assess surgical candidacy (FEV1 and DLCO > 40% predicted for lobectomy, > 60% for pneumonectomy)",
      "Mediastinoscopy or EBUS (endobronchial ultrasound): confirm N2/N3 disease before treatment planning",
      "SCLC staging: limited stage (one radiation field) vs extensive stage (beyond one field)"
    ],
    management: [
      "Stage I-II NSCLC: surgical lobectomy (gold standard) + mediastinal lymph node dissection; adjuvant osimertinib for 3 years if EGFR+ stage IB-IIIA (ADAURA trial)",
      "Stage III NSCLC: concurrent chemoradiation (cisplatin/etoposide or carboplatin/paclitaxel + radiation), followed by durvalumab (anti-PD-L1) for 12 months if no progression (PACIFIC trial)",
      "Stage IV NSCLC with driver mutation: targeted therapy first-line — osimertinib (EGFR), alectinib (ALK), entrectinib (ROS1), sotorasib (KRAS G12C)",
      "Stage IV NSCLC without driver mutation: pembrolizumab ± chemotherapy based on PD-L1 score — PD-L1 >= 50%: pembrolizumab monotherapy; PD-L1 < 50%: pembrolizumab + carboplatin + pemetrexed",
      "SCLC limited stage: concurrent chemoradiation (cisplatin + etoposide + thoracic RT) + prophylactic cranial irradiation (PCI) if response",
      "SCLC extensive stage: carboplatin + etoposide + atezolizumab (anti-PD-L1) — IMpower133 trial",
      "Palliative care integration from diagnosis for advanced disease",
      "Smoking cessation: improves treatment outcomes and reduces surgical complications"
    ],
    nursingActions: [
      "Coordinate LDCT screening for eligible patients and ensure follow-up of indeterminate nodules per Lung-RADS guidelines",
      "Facilitate timely molecular profiling: ensure adequate tissue is obtained for comprehensive genomic testing (not just EGFR)",
      "Educate on targeted therapy side effects: EGFR TKIs (skin rash, diarrhea, paronychia), ALK inhibitors (visual disturbances, edema), immunotherapy (immune-related adverse events)",
      "Monitor for immunotherapy irAEs: dermatitis, colitis, pneumonitis, hepatitis, endocrinopathies (thyroid, adrenal, pituitary) — early recognition is critical",
      "Manage chemotherapy side effects: antiemetics per ASCO guidelines, GCSF for neutropenia prevention, fatigue management",
      "Coordinate multidisciplinary tumor board presentation for treatment planning",
      "Smoking cessation counseling and pharmacotherapy at every visit",
      "Provide psychosocial support: anxiety, depression screening, palliative care referral"
    ],
    signs: {
      left: [
        "Incidental pulmonary nodule on imaging (< 8 mm — serial CT follow-up per guidelines)",
        "Stage IA NSCLC: resectable with excellent 5-year survival (77-92%)",
        "Maintained performance status on targeted therapy with controlled disease",
        "Complete response to chemoradiation in SCLC limited stage"
      ],
      right: [
        "Superior vena cava syndrome: facial/arm swelling, dyspnea, head fullness",
        "Pancoast tumor: shoulder pain, Horner syndrome (ptosis, miosis, anhidrosis)",
        "Brain metastases: headache, seizures, focal neurological deficits",
        "Malignant pleural effusion with severe dyspnea requiring drainage"
      ]
    },
    medications: [
      {
        name: "Osimertinib (Tagrisso)",
        type: "Third-Generation EGFR Tyrosine Kinase Inhibitor",
        action: "Irreversibly inhibits EGFR with activating mutations (exon 19 deletion, L858R) and T790M resistance mutation; crosses the blood-brain barrier providing CNS activity against brain metastases",
        sideEffects: "Diarrhea, skin rash (acneiform), paronychia, stomatitis, QTc prolongation, interstitial lung disease (1-3%), decreased LVEF",
        contra: "No actionable EGFR mutation on molecular testing, ILD history",
        pearl: "Standard of care for EGFR-mutated NSCLC in both metastatic (FLAURA trial — OS 38.6 months) and adjuvant settings (ADAURA trial — 3 years post-surgery for stage IB-IIIA). Monitor QTc and LVEF. Active against brain metastases. Do not combine with strong CYP3A4 inducers."
      },
      {
        name: "Pembrolizumab (Keytruda)",
        type: "Anti-PD-1 Immune Checkpoint Inhibitor",
        action: "Blocks PD-1 receptor on T cells, preventing PD-L1/PD-L2-mediated immune evasion by tumor cells; restores anti-tumor immune response",
        sideEffects: "Immune-related adverse events (irAEs): pneumonitis, colitis, hepatitis, dermatitis, endocrinopathies (hypothyroidism most common, adrenal insufficiency, hypophysitis), nephritis, myocarditis (rare but fatal)",
        contra: "Active autoimmune disease requiring systemic therapy, severe irAE from prior immunotherapy, organ transplant recipients",
        pearl: "First-line monotherapy for PD-L1 >= 50% NSCLC without driver mutations (KEYNOTE-024); combined with chemotherapy for PD-L1 < 50% (KEYNOTE-189). Monitor TFTs q6 weeks (hypothyroidism ~10%). irAEs can occur anytime including after discontinuation. Grade 3-4 irAEs require drug hold + high-dose steroids."
      }
    ],
    pearls: [
      "Molecular profiling is MANDATORY for ALL advanced NSCLC — never start empiric chemotherapy without knowing driver mutation status; a patient with EGFR+ NSCLC treated with chemotherapy instead of osimertinib has dramatically worse outcomes",
      "Immunotherapy irAEs can present weeks to months after starting treatment and even after discontinuation — maintain high suspicion for new symptoms; thyroid dysfunction (hypo > hyper) is the most common irAE and requires baseline and periodic TSH monitoring",
      "LDCT screening reduces lung cancer mortality by 20% (NLST trial) — the NP should proactively identify eligible patients (age 50-80, >= 20 pack-years, current or quit < 15 years) and facilitate annual screening"
    ],
    quiz: [
      {
        question: "Tissue from a stage IV lung adenocarcinoma in a 55-year-old never-smoker shows EGFR exon 19 deletion and PD-L1 expression of 80%. What is the most appropriate first-line treatment?",
        options: [
          "Pembrolizumab monotherapy (PD-L1 >= 50%)",
          "Osimertinib (EGFR-targeted therapy)",
          "Carboplatin + pemetrexed + pembrolizumab",
          "Cisplatin + etoposide (standard chemotherapy)"
        ],
        correct: 1,
        rationale: "In NSCLC with actionable driver mutations (EGFR, ALK, ROS1), targeted therapy is ALWAYS first-line regardless of PD-L1 expression. Osimertinib is the standard of care for EGFR exon 19 deletion or L858R mutation (FLAURA trial). Immunotherapy and chemotherapy are used when no driver mutation is found. Never-smokers have a higher prevalence of EGFR mutations, reinforcing the importance of molecular testing."
      }
    ]
  },
  "respiratory-failure-np": {
    title: "Respiratory Failure: Type I vs Type II",
    cellular: {
      title: "Gas Exchange Failure Mechanisms",
      content: "Type I (hypoxemic) respiratory failure is defined by PaO2 < 60 mmHg with normal or low PaCO2, caused by V/Q mismatch, shunt, diffusion impairment, or low FiO2. Common causes include pneumonia, ARDS, PE, and pulmonary edema. Type II (hypercapnic) respiratory failure involves PaCO2 > 45 mmHg (with or without hypoxemia), caused by alveolar hypoventilation from reduced respiratory drive (opioids, CNS depression), neuromuscular weakness (GBS, MG crisis, ALS), chest wall restriction (obesity hypoventilation, kyphoscoliosis), or severe airflow obstruction (COPD, asthma). The A-a gradient distinguishes between these mechanisms: normal A-a gradient (< 15 in young adults, increases with age) with hypercapnia suggests pure hypoventilation; widened A-a gradient suggests parenchymal or vascular disease. The formula PAO2 = (FiO2 × 713) - (PaCO2/0.8) calculates the expected alveolar oxygen tension for comparison with measured PaO2."
    },
    riskFactors: [
      "Type I: pneumonia, ARDS, PE, pulmonary edema, atelectasis, ILD, acute chest syndrome",
      "Type II: COPD exacerbation (most common cause), severe asthma, neuromuscular disease, opioid/sedative overdose",
      "Type II: obesity hypoventilation syndrome (BMI > 40 with daytime hypercapnia)",
      "Type II: chest wall deformity (severe kyphoscoliosis)",
      "Mixed Type I/II: severe COPD or ARDS with concurrent respiratory muscle fatigue",
      "Critical illness with diaphragmatic weakness from prolonged mechanical ventilation",
      "Cervical spinal cord injury (C3-C5 — diaphragm denervation)",
      "Massive pleural effusion, tension pneumothorax"
    ],
    diagnostics: [
      "ABG: PaO2 < 60 mmHg (Type I criterion) and/or PaCO2 > 45 mmHg (Type II criterion)",
      "A-a gradient calculation: normal (< 15 + age/4) vs widened; guides differential diagnosis",
      "SpO2 continuous monitoring: unreliable in severe anemia, carbon monoxide poisoning, poor perfusion, dark skin pigmentation (may overestimate)",
      "CXR: identifies cause — consolidation (pneumonia), bilateral infiltrates (ARDS/edema), effusion, pneumothorax",
      "PFTs (when stable): obstructive vs restrictive pattern; DLCO for diffusion impairment",
      "Capnography (ETCO2): non-invasive CO2 monitoring; useful for trending in Type II",
      "VBG as screening: pH and PCO2 correlate well with ABG values (VBG PaCO2 ~3-5 mmHg higher than arterial)",
      "Point-of-care ultrasound: pleural effusion, consolidation, B-lines (pulmonary edema), pneumothorax, diaphragm excursion"
    ],
    management: [
      "Type I: supplemental O2 to maintain SpO2 94-98% (88-92% in COPD); escalate: nasal cannula → Venturi mask → non-rebreather → HFNC → NIV → intubation",
      "High-flow nasal cannula (HFNC): 30-60 L/min with FiO2 titration; provides PEEP-like effect, reduces dead space, and improves work of breathing",
      "NIV for Type II: BiPAP (IPAP 10-20, EPAP 5-8 cmH2O) reduces work of breathing and corrects hypercapnia — first-line for COPD exacerbation with respiratory acidosis",
      "Intubation indications: failure of NIV, inability to protect airway, severe acidosis (pH < 7.20 despite NIV), hemodynamic instability, refractory hypoxemia",
      "Lung-protective ventilation for ARDS: Vt 6 mL/kg IBW, Pplat < 30, PEEP per FiO2 table, permissive hypercapnia",
      "Type II from opioid overdose: naloxone 0.4-2 mg IV (titrate to respiratory rate, not consciousness)",
      "Treat underlying cause: antibiotics for pneumonia, diuresis for pulmonary edema, bronchodilators for COPD/asthma, anticoagulation for PE",
      "Ventilator weaning: daily SBT when patient meets criteria; use ABCDEF bundle to minimize ventilator duration"
    ],
    nursingActions: [
      "Recognize signs of impending respiratory failure: RR > 30, accessory muscle use, paradoxical breathing, inability to speak in full sentences, declining SpO2 despite O2",
      "Apply O2 delivery device appropriate to severity: 1-6 L/min NC (FiO2 24-44%), Venturi mask for precise FiO2, non-rebreather for high-flow O2 (FiO2 ~80-90%), HFNC for severe hypoxemia",
      "Monitor ABG/VBG trending: rising PaCO2 with falling pH indicates worsening Type II respiratory failure",
      "NIV management: ensure proper mask fit (minimize leak), educate patient on synchronizing breathing, monitor for NIV failure (no improvement in 1-2 hours = consider intubation)",
      "Prepare for intubation: RSI medications drawn up, airway equipment checked, backup airway plan",
      "Position patient appropriately: high Fowler's (30-45°) for most; reverse Trendelenburg for obese patients",
      "Prevent VAP in intubated patients: HOB 30-45°, oral care with chlorhexidine q6h, subglottic secretion drainage, DVT prophylaxis, daily sedation vacation + SBT",
      "Coordinate SBT with respiratory therapy: assess readiness, perform 30-120 min trial on low support, evaluate tolerance criteria"
    ],
    signs: {
      left: [
        "Mild hypoxemia correctable with low-flow O2 (NC 2-4 L/min)",
        "Type II from COPD exacerbation responding to BiPAP within 1-2 hours",
        "Alert, cooperative patient tolerating NIV with improving ABG",
        "Stable hemodynamics with single-organ respiratory failure"
      ],
      right: [
        "Refractory hypoxemia despite high-flow O2 and NIV — requires intubation",
        "Severe respiratory acidosis (pH < 7.20) with declining consciousness",
        "Multi-organ failure with respiratory failure (sepsis-related ARDS)",
        "Failed extubation with need for tracheostomy for prolonged ventilation"
      ]
    },
    medications: [
      {
        name: "Naloxone",
        type: "Opioid Receptor Antagonist",
        action: "Competitively antagonizes mu, kappa, and delta opioid receptors, rapidly reversing opioid-induced respiratory depression; onset 1-2 minutes IV",
        sideEffects: "Acute opioid withdrawal (agitation, tachycardia, hypertension, vomiting, pulmonary edema), seizures (rare)",
        contra: "Known hypersensitivity (very rare); use cautiously in chronic opioid dependence (precipitates withdrawal)",
        pearl: "For opioid-induced respiratory failure: start with 0.04-0.4 mg IV, titrate to respiratory rate (not consciousness) to avoid precipitating withdrawal. Short half-life (30-90 min) vs long-acting opioids — may need repeat dosing or infusion. IV > IM > SC for reliability. Intranasal naloxone 4 mg for community use."
      },
      {
        name: "Doxapram (rarely used) / Acetazolamide (for metabolic alkalosis)",
        type: "Respiratory Stimulant / Carbonic Anhydrase Inhibitor",
        action: "Acetazolamide: induces metabolic acidosis by blocking bicarbonate reabsorption in proximal tubule; the acidosis stimulates central chemoreceptors to increase ventilation; useful for metabolic alkalosis-related hypoventilation",
        sideEffects: "Paresthesias, metabolic acidosis, nephrolithiasis, hypokalemia, fatigue",
        contra: "Severe renal failure, hepatic cirrhosis (may precipitate encephalopathy), sulfonamide allergy",
        pearl: "Acetazolamide 250 mg BID may improve ventilation in patients with metabolic alkalosis-related respiratory depression (e.g., post-diuretic metabolic alkalosis blunting respiratory drive in COPD). Not first-line — used as adjunct. Monitor electrolytes closely."
      }
    ],
    pearls: [
      "In COPD patients, target SpO2 88-92% — hypercapnic patients depend on hypoxic drive, and excessive O2 (SpO2 > 96%) causes worsening hypercapnia through the Haldane effect (O2 displaces CO2 from hemoglobin) and V/Q mismatch redistribution",
      "BiPAP is the most impactful intervention for COPD exacerbation with Type II respiratory failure — it reduces intubation rates by 60% and mortality by 50% compared to standard O2 therapy (Cochrane meta-analysis)",
      "A normal A-a gradient with hypercapnia means the lungs are normal and the problem is hypoventilation — look for CNS depression (drugs, stroke), neuromuscular disease (GBS, MG), or chest wall restriction (obesity, kyphoscoliosis)"
    ],
    quiz: [
      {
        question: "A COPD patient presents with RR 28, SpO2 84% on room air. ABG: pH 7.28, PaCO2 65, PaO2 52, HCO3 30. What is the most appropriate initial intervention?",
        options: [
          "Non-rebreather mask at 15 L/min to correct hypoxemia quickly",
          "BiPAP with IPAP 12, EPAP 5 cmH2O targeting SpO2 88-92%",
          "Immediate intubation for severe hypercapnia",
          "High-flow nasal cannula at 60 L/min with 100% FiO2"
        ],
        correct: 1,
        rationale: "This is Type II respiratory failure with chronic-on-acute hypercapnia (elevated HCO3 = chronic retention; acute acidosis = acute worsening). BiPAP is first-line — reduces work of breathing and improves CO2 clearance. Target SpO2 88-92% (not 94-98%) in COPD. High-flow or non-rebreather with excessive O2 would worsen hypercapnia. Intubation is reserved for BiPAP failure or inability to protect airway."
      }
    ]
  },
  "bronchiectasis-management-np": {
    title: "Bronchiectasis: Pathophysiology & Airway Clearance",
    cellular: {
      title: "Chronic Airway Dilation and Infection Cycle",
      content: "Bronchiectasis is characterized by permanent, abnormal dilation of bronchi due to a vicious cycle of infection, inflammation, and structural airway damage. Cole's vicious cycle hypothesis describes how impaired mucociliary clearance (from ciliary dysfunction, mucus hyperviscosity, or airway damage) allows bacterial colonization, which triggers neutrophilic inflammation and release of proteases (neutrophil elastase, matrix metalloproteinases) that damage airway walls, causing further dilation and impaired clearance. Common predisposing conditions include post-infectious damage (childhood pneumonia, pertussis, measles, TB), cystic fibrosis (CFTR mutation), primary ciliary dyskinesia (dynein arm defects), immunodeficiency (common variable immunodeficiency — CVID), allergic bronchopulmonary aspergillosis (ABPA), and autoimmune diseases (RA, inflammatory bowel disease). The most common colonizing organisms are Haemophilus influenzae, Pseudomonas aeruginosa (associated with worse prognosis), and Moraxella catarrhalis."
    },
    riskFactors: [
      "Prior severe lower respiratory tract infection (childhood pneumonia, pertussis, TB)",
      "Cystic fibrosis (most common genetic cause; newborn screening identifies most cases)",
      "Primary ciliary dyskinesia (situs inversus, chronic sinusitis, otitis media, infertility)",
      "Immunodeficiency: CVID, IgG subclass deficiency, HIV",
      "ABPA: asthma/CF patients with Aspergillus hypersensitivity causing mucoid impaction",
      "Autoimmune: RA, SLE, IBD (especially ulcerative colitis), Sjögren syndrome",
      "Alpha-1 antitrypsin deficiency",
      "Chronic aspiration (GERD, dysphagia, neurological conditions)"
    ],
    diagnostics: [
      "High-resolution CT chest (HRCT): definitive diagnostic test — bronchial dilation (signet ring sign: bronchus larger than adjacent artery), lack of bronchial tapering, bronchial wall thickening, mucus plugging, tree-in-bud opacities",
      "Sputum culture and sensitivity: identify colonizing organisms (H. influenzae, P. aeruginosa, NTM) and guide antibiotic selection",
      "PFTs: typically obstructive pattern (reduced FEV1/FVC); DLCO usually preserved",
      "Immunoglobulin levels: IgG, IgA, IgM, IgG subclasses to screen for immunodeficiency",
      "CF testing: sweat chloride test (> 60 mmol/L diagnostic) and/or CFTR genetic testing for adults < 40",
      "ABPA screening: total IgE, Aspergillus-specific IgE and IgG, CBC with eosinophil count",
      "Alpha-1 antitrypsin level",
      "Sputum for AFB and NTM cultures if clinical suspicion (MAC is common in 'Lady Windermere syndrome')"
    ],
    management: [
      "Airway clearance therapy: cornerstone of management — chest physiotherapy (postural drainage with percussion/vibration), oscillating PEP devices (Aerobika, Acapella, Flutter), high-frequency chest wall oscillation vest",
      "Regular sputum surveillance cultures every 3-6 months to detect Pseudomonas colonization early",
      "Acute exacerbation: 14-day course of antibiotics based on prior sputum cultures; amoxicillin-clavulanate or doxycycline for non-Pseudomonas; ciprofloxacin or IV anti-pseudomonal for Pseudomonas",
      "Chronic Pseudomonas: eradication attempt with inhaled tobramycin (300 mg BID × 28 days on/off cycles); if eradication fails, long-term suppressive inhaled antibiotics",
      "Macrolide therapy (azithromycin 250-500 mg 3×/week): reduces exacerbation frequency by 50-70% through anti-inflammatory and immunomodulatory effects (not just antibacterial)",
      "Bronchodilators: trial of SABA before airway clearance therapy; LABA if concurrent airflow obstruction",
      "Treat underlying cause: immunoglobulin replacement for CVID, corticosteroids + antifungals for ABPA, surgical resection for localized bronchiectasis with recurrent hemoptysis",
      "Vaccination: annual influenza, pneumococcal (PCV20 or PCV15 + PPSV23), COVID-19"
    ],
    nursingActions: [
      "Teach airway clearance techniques: demonstrate oscillating PEP device use, postural drainage positions, active cycle of breathing technique",
      "Emphasize daily airway clearance as essential maintenance — at least 20-30 minutes BID, more during exacerbations",
      "Obtain and send sputum cultures correctly: early morning specimen, mouth rinse before collection, prompt transport to lab",
      "Educate on exacerbation recognition: increased sputum volume, change in sputum color (clear → green), increased dyspnea, malaise, fever",
      "Monitor for hemoptysis: small-volume hemoptysis is common; massive hemoptysis (> 240 mL/24 hr) requires emergent bronchial artery embolization",
      "Coordinate pulmonary rehabilitation enrollment — improves exercise capacity and quality of life",
      "Ensure appropriate vaccinations are current",
      "Monitor macrolide therapy: baseline ECG for QTc, hearing assessment, sputum cultures for NTM before starting (azithromycin monotherapy promotes NTM resistance)"
    ],
    signs: {
      left: [
        "Chronic productive cough with daily mucoid sputum",
        "Mild-moderate airflow obstruction responsive to bronchodilators",
        "Infrequent exacerbations (< 3/year) without Pseudomonas colonization",
        "Stable PFTs and CT findings on serial assessment"
      ],
      right: [
        "Massive hemoptysis (> 240 mL/24 hr) requiring bronchial artery embolization",
        "Chronic Pseudomonas colonization with frequent exacerbations (>= 3/year)",
        "Progressive decline in FEV1 (> 50 mL/year) despite optimal management",
        "Respiratory failure from severe bronchiectasis with multi-lobar involvement"
      ]
    },
    medications: [
      {
        name: "Azithromycin (Chronic Suppressive)",
        type: "Macrolide (Immunomodulatory)",
        action: "At chronic low doses, exerts anti-inflammatory and immunomodulatory effects: reduces neutrophil chemotaxis, inhibits NF-kB signaling, reduces mucus hypersecretion, disrupts Pseudomonas biofilm formation — effects independent of direct antibacterial activity",
        sideEffects: "QTc prolongation, GI upset, hearing loss (reversible), hepatotoxicity, NTM resistance if NTM is present",
        contra: "QTc prolongation, concurrent QT-prolonging drugs, NTM infection (monotherapy promotes resistance), severe hepatic impairment",
        pearl: "250-500 mg 3×/week reduces exacerbation frequency by 50-70% (EMBRACE, BAT, BLESS trials). Screen sputum for NTM BEFORE starting (azithromycin monotherapy promotes NTM macrolide resistance). Check baseline ECG and hearing. Best evidence is for patients with >= 3 exacerbations/year."
      },
      {
        name: "Inhaled Tobramycin (TOBI)",
        type: "Aminoglycoside (Inhaled)",
        action: "Delivers high concentrations of tobramycin directly to airways, achieving bactericidal levels against Pseudomonas aeruginosa with minimal systemic absorption and toxicity",
        sideEffects: "Bronchospasm (pre-treat with SABA), voice changes, tinnitus, nephrotoxicity and ototoxicity (rare with inhaled route)",
        contra: "Known aminoglycoside allergy, concurrent systemic aminoglycosides",
        pearl: "300 mg nebulized BID in alternating 28-day on/off cycles for chronic Pseudomonas colonization. Pre-medicate with SABA to prevent bronchospasm. Monitor sputum cultures for resistance. First attempt eradication, then transition to suppressive therapy if eradication fails. Evidence strongest for CF-related bronchiectasis."
      }
    ],
    pearls: [
      "Airway clearance therapy is the single most important intervention in bronchiectasis management — it breaks the vicious cycle of mucus stasis → infection → inflammation → airway damage, yet is the most commonly under-prescribed treatment",
      "Before starting long-term azithromycin for bronchiectasis, ALWAYS screen sputum for NTM — azithromycin monotherapy in undiagnosed NTM infection causes macrolide resistance, making NTM treatment far more difficult",
      "Pseudomonas colonization in non-CF bronchiectasis is associated with 3× faster FEV1 decline and 3× more exacerbations — early detection through regular sputum surveillance and aggressive eradication attempts are critical"
    ],
    quiz: [
      {
        question: "A patient with non-CF bronchiectasis has 4 exacerbations per year despite optimal airway clearance and vaccination. Sputum cultures consistently grow H. influenzae. NTM cultures are negative. What additional therapy would most reduce exacerbation frequency?",
        options: [
          "Daily inhaled corticosteroid",
          "Long-term azithromycin 250 mg three times per week",
          "Continuous oral amoxicillin prophylaxis",
          "Monthly IV immunoglobulin"
        ],
        correct: 1,
        rationale: "Long-term macrolide therapy (azithromycin 250-500 mg 3×/week) is evidence-based for reducing exacerbation frequency in non-CF bronchiectasis with >= 3 exacerbations/year. The EMBRACE, BAT, and BLESS trials showed 50-70% reduction in exacerbations. NTM has been excluded (mandatory before starting). ICS has no evidence of benefit in non-CF bronchiectasis. IVIG is only for patients with documented immunodeficiency."
      }
    ]
  },
  "interstitial-lung-disease-np": {
    title: "Interstitial Lung Disease: Classification & Treatment",
    cellular: {
      title: "Pulmonary Fibrosis Pathogenesis",
      content: "Interstitial lung diseases (ILDs) are a heterogeneous group of disorders characterized by inflammation and/or fibrosis of the lung parenchyma. Idiopathic pulmonary fibrosis (IPF) is the most common and most severe ILD, characterized by usual interstitial pneumonia (UIP) pattern: patchy, peripheral, basal-predominant fibrosis with honeycombing and fibroblastic foci. The pathogenesis involves repetitive alveolar epithelial cell injury triggering aberrant wound healing — activated myofibroblasts deposit excessive extracellular matrix (collagen) causing progressive, irreversible scarring. Other ILDs include connective tissue disease-associated (CTD-ILD — especially SSc, RA, myositis), hypersensitivity pneumonitis (HP — from organic antigen exposure: bird proteins, mold, chemicals), sarcoidosis, drug-induced ILD, and pneumoconioses (asbestosis, silicosis). HRCT pattern recognition (UIP vs NSIP vs organizing pneumonia) guides diagnosis and management. PFTs show restrictive pattern with reduced DLCO, which is often the earliest abnormality."
    },
    riskFactors: [
      "IPF: male sex, age > 60, smoking history, GERD, family history (telomerase mutations — TERT, TERC)",
      "CTD-ILD: scleroderma (up to 80% develop ILD), dermatomyositis/polymyositis, RA",
      "HP: chronic exposure to birds (avian proteins), mold (thermophilic actinomycetes), chemical sensitizers",
      "Drug-induced: methotrexate, amiodarone, nitrofurantoin, bleomycin, checkpoint inhibitors",
      "Pneumoconioses: asbestos exposure (shipyards, insulation, brake repair), silica (mining, sandblasting)",
      "Radiation pneumonitis (breast cancer, lymphoma radiation)",
      "Sarcoidosis: African American descent, age 20-40",
      "Smoking-related ILD: respiratory bronchiolitis-ILD, desquamative interstitial pneumonia, Langerhans cell histiocytosis"
    ],
    diagnostics: [
      "HRCT: pattern recognition — UIP (honeycombing, traction bronchiectasis, basal-predominant), NSIP (ground-glass predominant, basal), HP (upper/mid-zone predominance, air trapping, mosaic attenuation)",
      "PFTs: restrictive pattern (reduced TLC, FVC) with reduced DLCO — DLCO < 40% predicted carries poor prognosis",
      "6MWT with SpO2 monitoring: exercise desaturation (> 4% drop) suggests significant disease; distance correlates with prognosis",
      "Autoimmune serologies: ANA, anti-CCP, RF, anti-Jo-1, anti-Scl-70, myositis panel (for CTD-ILD screening)",
      "Serum precipitins (IgG) to specific antigens for HP (bird, mold panels)",
      "BAL: lymphocytosis (HP, sarcoidosis, NSIP), eosinophilia (drug-induced, eosinophilic pneumonia), neutrophilia (IPF — poor prognosis)",
      "Surgical lung biopsy (VATS): gold standard when HRCT pattern is indeterminate; establishes histological pattern",
      "Multidisciplinary discussion (MDD): pulmonology + radiology + pathology — current gold standard for ILD diagnosis"
    ],
    management: [
      "IPF: antifibrotic therapy — pirfenidone or nintedanib (both slow FVC decline by ~50% per year; neither cures or reverses fibrosis)",
      "Pirfenidone 801 mg TID (ASCEND trial) or nintedanib 150 mg BID (INPULSIS trial) — started at diagnosis regardless of severity",
      "IPF: supplemental O2 for SpO2 < 88% at rest or with exertion; pulmonary rehabilitation",
      "IPF: lung transplant evaluation when FVC < 80% or DLCO < 40% or declining trajectory",
      "CTD-ILD: immunosuppression — mycophenolate mofetil 2 g/day (SLS II trial for SSc-ILD) or cyclophosphamide; add nintedanib for progressive phenotype",
      "HP: antigen avoidance (most critical intervention); corticosteroids for inflammatory phase; antifibrotic for fibrotic HP",
      "Sarcoidosis: observation if asymptomatic; corticosteroids (prednisone 20-40 mg/day) for symptomatic stage II-III; steroid-sparing: methotrexate, azathioprine, infliximab",
      "GERD management: PPI therapy for all IPF patients (GERD may cause microaspiration promoting fibrosis)"
    ],
    nursingActions: [
      "Monitor PFTs every 3-6 months: FVC decline > 10% absolute per year indicates progressive disease and should trigger escalation or transplant evaluation",
      "Assess oxygen needs: resting SpO2 and exertional SpO2 (6MWT) — prescribe supplemental O2 to maintain SpO2 >= 90%",
      "Educate on antifibrotic side effects: pirfenidone (photosensitivity — strict sunscreen/sun avoidance, GI upset, anorexia), nintedanib (diarrhea — manage with loperamide, hepatotoxicity)",
      "Monitor LFTs monthly for first 6 months of antifibrotic therapy, then every 3 months",
      "Coordinate pulmonary rehabilitation: improves exercise tolerance and quality of life in ILD",
      "Assess for HP exposure history thoroughly: home environment (birds, mold, humidifier), occupation, hobbies",
      "Vaccinate against influenza, pneumococcal, and COVID-19 (ILD patients are high-risk for respiratory infections)",
      "Facilitate advance care planning: IPF median survival 3-5 years without transplant; early palliative care integration improves quality of life"
    ],
    signs: {
      left: [
        "Mild exertional dyspnea with preserved FVC and DLCO",
        "Incidental ground-glass opacities on CT without functional impairment",
        "Stable PFTs over 6-12 months on antifibrotic therapy",
        "Adequate exercise tolerance on 6MWT"
      ],
      right: [
        "Acute exacerbation of IPF: rapid respiratory deterioration with new bilateral ground-glass on HRCT (50% mortality)",
        "FVC decline > 10% per year despite antifibrotic therapy (progressive fibrotic phenotype)",
        "Pulmonary hypertension complicating ILD (TR velocity > 2.8 m/s)",
        "End-stage fibrosis with respiratory failure requiring transplant or palliation"
      ]
    },
    medications: [
      {
        name: "Nintedanib (Ofev)",
        type: "Tyrosine Kinase Inhibitor (Antifibrotic)",
        action: "Triple angiokinase inhibitor targeting VEGFR, FGFR, and PDGFR; blocks fibroblast proliferation, migration, and transformation into myofibroblasts; reduces extracellular matrix deposition",
        sideEffects: "Diarrhea (most common — 60%, manage with loperamide), hepatotoxicity (monitor LFTs), nausea, weight loss, arterial thromboembolic events (rare)",
        contra: "Severe hepatic impairment, pregnancy (teratogenic), concurrent anticoagulation (increased bleeding risk)",
        pearl: "150 mg BID with food. INPULSIS trial showed 50% reduction in annual FVC decline in IPF. Also approved for SSc-ILD (SENSCIS trial) and progressive fibrosing ILD regardless of etiology (INBUILD trial). Manage diarrhea proactively with loperamide. Dose reduce to 100 mg BID if intolerant."
      },
      {
        name: "Pirfenidone (Esbriet)",
        type: "Antifibrotic (Anti-inflammatory/Anti-fibrotic)",
        action: "Reduces TGF-beta-mediated fibroblast proliferation and collagen synthesis; modulates inflammatory cytokines (TNF-alpha, IL-1beta); reduces oxidative stress",
        sideEffects: "Photosensitivity (severe — must avoid sun exposure, use SPF 50+), GI upset (nausea, anorexia, weight loss), hepatotoxicity, skin rash",
        contra: "Severe hepatic impairment, concurrent fluvoxamine (strong CYP1A2 inhibitor), pregnancy",
        pearl: "Titrate over 2 weeks: 267 mg TID × 7 days → 534 mg TID × 7 days → 801 mg TID maintenance. ALWAYS take with food to reduce GI side effects. Strict photoprotection is essential — pirfenidone causes severe photosensitivity reactions. Monitor LFTs monthly for 6 months then quarterly."
      }
    ],
    pearls: [
      "Antifibrotic therapy slows but does NOT stop or reverse IPF — it reduces FVC decline by ~50%, translating to meaningful extension of functional independence; start at diagnosis regardless of FVC value",
      "The most common mistake in HP diagnosis is failing to obtain a thorough environmental exposure history — many patients are misdiagnosed with IPF when antigen avoidance could halt disease progression",
      "An acute exacerbation of IPF (sudden worsening with new bilateral ground-glass on HRCT without identifiable cause) carries ~50% mortality — high-dose corticosteroids are given empirically but evidence of benefit is limited"
    ],
    quiz: [
      {
        question: "A 65-year-old man with IPF (diagnosed 6 months ago, FVC 72%, DLCO 48%) has FVC decline to 62% over 6 months despite pirfenidone therapy. What is the most important next step?",
        options: [
          "Switch from pirfenidone to nintedanib",
          "Refer for lung transplant evaluation",
          "Add prednisone 40 mg daily for inflammation",
          "Continue current therapy and reassess in 6 months"
        ],
        correct: 1,
        rationale: "A 10% absolute FVC decline in 6 months indicates rapidly progressive disease and triggers lung transplant evaluation per guidelines. IPF median survival is 3-5 years, and transplant should be considered when FVC < 80% or DLCO < 40% or rapid decline is demonstrated. Corticosteroids have no role in IPF (may worsen outcomes). Switching antifibrotics may be considered but does not address the urgency of transplant evaluation."
      }
    ]
  },
  "sarcoidosis-pulmonary-np": {
    title: "Sarcoidosis Pulmonary: Staging & Corticosteroid Therapy",
    cellular: {
      title: "Non-Caseating Granulomatous Inflammation",
      content: "Sarcoidosis is a systemic granulomatous disease of unknown etiology characterized by non-caseating granulomas in affected organs. The lungs are involved in > 90% of cases. The pathogenesis involves an exaggerated Th1 immune response to an unidentified antigen: macrophages present the antigen to CD4+ T cells, which release IFN-gamma and IL-2, driving granuloma formation. Granulomas consist of tightly clustered epithelioid macrophages and multinucleated giant cells surrounded by a rim of lymphocytes. Unlike TB granulomas, sarcoid granulomas are NON-caseating (no central necrosis). Staging is radiographic: Stage 0 (normal CXR), Stage I (bilateral hilar lymphadenopathy — BHL — alone), Stage II (BHL + pulmonary infiltrates), Stage III (pulmonary infiltrates without BHL), Stage IV (pulmonary fibrosis). Spontaneous remission occurs in 60-80% of Stage I, 50-60% of Stage II, but only 30% of Stage III, making staging important for prognosis and treatment decisions."
    },
    riskFactors: [
      "African American descent (3-4× higher incidence, more severe disease, more organ involvement)",
      "Age 20-40 years (peak incidence)",
      "Scandinavian descent (high prevalence in Northern Europe)",
      "Family history (genetic susceptibility — HLA-DRB1 associations)",
      "Environmental exposures (uncertain but proposed: mold, insecticides, organic dust)",
      "Female sex (slightly higher incidence; Löfgren syndrome more common in women)",
      "Occupational: firefighters (World Trade Center), agricultural workers"
    ],
    diagnostics: [
      "CXR staging: I (BHL alone), II (BHL + infiltrates), III (infiltrates alone), IV (fibrosis/honeycombing)",
      "CT chest: bilateral symmetric hilar and mediastinal lymphadenopathy, perilymphatic nodules, upper lobe predominant",
      "PFTs: may be normal (early), restrictive pattern, obstructive pattern (endobronchial sarcoid), reduced DLCO",
      "Tissue biopsy: non-caseating granulomas (essential for diagnosis — sarcoidosis is diagnosis of exclusion); transbronchial biopsy via bronchoscopy (yield 60-90%)",
      "BAL: CD4:CD8 lymphocyte ratio > 3.5 supports diagnosis (but not pathognomonic)",
      "Serum ACE level: elevated in 60% but non-specific; useful for monitoring disease activity rather than diagnosis",
      "Calcium metabolism: hypercalcemia (10-17%) from granuloma-produced 1,25-dihydroxyvitamin D; 24-hour urine calcium",
      "Screening for extrapulmonary involvement: ophthalmologic exam (uveitis 25-50%), ECG/Holter (cardiac sarcoid), LFTs, creatinine, CBC"
    ],
    management: [
      "Stage I: observation — 60-80% spontaneous remission; treatment only if symptomatic",
      "Stage II-III with progressive symptoms or PFT decline: prednisone 20-40 mg/day × 4-6 weeks, then taper over 6-12 months (total treatment 12-24 months)",
      "Steroid-sparing agents for relapsing disease or steroid side effects: methotrexate 10-15 mg/week (most common), azathioprine, leflunomide, mycophenolate",
      "Refractory or severe disease: infliximab (anti-TNF-alpha) — particularly effective for skin, CNS, and hepatic sarcoidosis",
      "Cardiac sarcoidosis: corticosteroids + ICD if LVEF < 35% or significant ventricular arrhythmias",
      "Neurosarcoidosis: high-dose IV methylprednisolone pulse then oral taper; infliximab for refractory cases",
      "Löfgren syndrome (bilateral hilar lymphadenopathy + erythema nodosum + fever + arthralgias): NSAIDs; excellent prognosis with > 90% spontaneous resolution",
      "Manage complications: supplemental O2 for hypoxemia, PH screening, osteoporosis prevention during long-term steroids"
    ],
    nursingActions: [
      "Educate on sarcoidosis course: many patients achieve remission; treatment is directed at preventing organ damage, not 'curing' the disease",
      "Monitor steroid side effects during long-term therapy: blood glucose, BP, weight gain, mood changes, osteoporosis (prescribe calcium + vitamin D + consider bisphosphonate for > 3 months steroids), cataracts",
      "Screen for extrapulmonary involvement: annual ophthalmologic exam (uveitis can be asymptomatic), ECG for conduction abnormalities, renal function",
      "Monitor serum calcium — hypercalcemia from vitamin D overproduction; counsel to avoid excessive sun exposure and calcium supplements",
      "Track PFTs and ACE levels as markers of disease activity and treatment response",
      "Educate on methotrexate side effects if prescribed: hepatotoxicity (monitor LFTs), cytopenias (monitor CBC), pneumonitis, teratogenicity (contraception required)",
      "Administer folic acid 1 mg daily with methotrexate to reduce GI and hematologic toxicity",
      "Coordinate multidisciplinary care: pulmonology, ophthalmology, cardiology (if cardiac involvement), dermatology, neurology"
    ],
    signs: {
      left: [
        "Stage I: bilateral hilar lymphadenopathy detected incidentally on CXR; asymptomatic",
        "Löfgren syndrome: bilateral hilar adenopathy + erythema nodosum + fever + arthralgias (excellent prognosis)",
        "Stable PFTs on steroid taper or observation",
        "Declining ACE levels indicating disease quiescence"
      ],
      right: [
        "Stage IV: progressive pulmonary fibrosis with declining FVC and need for supplemental O2",
        "Cardiac sarcoidosis: complete heart block, sustained VT, sudden cardiac death",
        "Neurosarcoidosis: cranial nerve palsies (especially facial nerve VII), meningitis, hypothalamic dysfunction",
        "Severe hypercalcemia causing renal failure and nephrocalcinosis"
      ]
    },
    medications: [
      {
        name: "Prednisone",
        type: "Systemic Corticosteroid",
        action: "Suppresses the Th1 granulomatous inflammatory response by inhibiting NF-kB, reducing cytokine production (TNF-alpha, IFN-gamma, IL-2), and decreasing granuloma formation and maintenance",
        sideEffects: "Weight gain, hyperglycemia, osteoporosis, cataracts, adrenal suppression, immunosuppression, mood changes, cushingoid appearance",
        contra: "Active untreated systemic infections, severe diabetes (relative), psychosis from prior steroids",
        pearl: "Start 20-40 mg/day for pulmonary sarcoidosis with progressive symptoms or PFT decline. Taper slowly (by 5 mg every 2-4 weeks). Relapse occurs in 50-70% during taper — have steroid-sparing agent ready. Protect bone: calcium 1200 mg + vitamin D 1000 IU daily + bisphosphonate if treatment > 3 months."
      },
      {
        name: "Methotrexate",
        type: "Antimetabolite / Steroid-Sparing Agent",
        action: "Inhibits dihydrofolate reductase and adenosine metabolism, suppressing lymphocyte proliferation and the granulomatous immune response; allows steroid taper while maintaining disease control",
        sideEffects: "Hepatotoxicity, cytopenias (leukopenia, thrombocytopenia), pneumonitis, GI upset, teratogenicity, immunosuppression",
        contra: "Pregnancy (Category X), severe hepatic disease, severe renal impairment (CrCl < 30), bone marrow suppression, concurrent live vaccines",
        pearl: "Most commonly used steroid-sparing agent for sarcoidosis: 10-15 mg/week (once weekly dosing). Always co-prescribe folic acid 1 mg daily. Monitor CBC and LFTs every 4-8 weeks. Takes 2-3 months for full effect — overlap with steroid taper. Avoid alcohol. Reduce dose in renal impairment."
      }
    ],
    pearls: [
      "Sarcoidosis is a diagnosis of EXCLUSION — always rule out TB, fungal infection, lymphoma, and other granulomatous diseases before diagnosing sarcoidosis; tissue biopsy showing non-caseating granulomas with negative cultures is essential",
      "Löfgren syndrome (BHL + erythema nodosum + fever + arthralgias) has such an excellent prognosis (> 90% spontaneous resolution) that treatment with corticosteroids is usually unnecessary — NSAIDs for symptom relief",
      "In sarcoidosis patients, avoid vitamin D supplementation above 400 IU daily and excessive sun exposure — granulomatous tissue produces 1,25-dihydroxyvitamin D, and exogenous vitamin D can precipitate dangerous hypercalcemia"
    ],
    quiz: [
      {
        question: "A 32-year-old African American woman presents with bilateral hilar lymphadenopathy on CXR, erythema nodosum on shins, and bilateral ankle arthritis. She has low-grade fever. What is the most likely diagnosis and management?",
        options: [
          "Lymphoma — urgent CT-guided biopsy and oncology referral",
          "Löfgren syndrome (sarcoidosis) — NSAIDs and observation with excellent prognosis",
          "Tuberculosis — start RIPE therapy empirically",
          "Sarcoidosis — start prednisone 40 mg daily immediately"
        ],
        correct: 1,
        rationale: "The classic presentation of bilateral hilar lymphadenopathy + erythema nodosum + polyarthritis + fever is Löfgren syndrome, an acute presentation of sarcoidosis with excellent prognosis (> 90% spontaneous resolution). Management is NSAIDs for symptom relief. Corticosteroids are reserved for persistent or progressive disease. While biopsy confirmation is ideal, the clinical presentation is pathognomonic enough to justify initial conservative management."
      }
    ]
  },
  "occupational-lung-disease-np": {
    title: "Occupational Lung Disease: Asbestosis & Silicosis",
    cellular: {
      title: "Pneumoconiosis Fibrotic Pathways",
      content: "Pneumoconioses are interstitial lung diseases caused by inhalation of inorganic dusts. Asbestosis results from asbestos fibers (serpentine or amphibole) deposited in distal airways and alveoli. Asbestos fibers are incompletely phagocytosed by macrophages due to their length, causing frustrated phagocytosis with persistent release of reactive oxygen species, cytokines (TNF-alpha, TGF-beta), and fibrogenic mediators, leading to progressive interstitial fibrosis. Asbestos bodies (golden-brown, dumbbell-shaped structures with iron-protein coating around asbestos fiber) are pathognomonic on histology. Silicosis results from crystalline silica (quartz) inhalation in mining, sandblasting, and stone cutting. Silica particles are highly cytotoxic to macrophages — phagocytosed silica disrupts phagolysosome membranes, activating NLRP3 inflammasome and releasing IL-1beta, driving granuloma and nodule formation with progressive massive fibrosis. Both conditions increase the risk of TB (silicosis significantly), lung cancer (asbestos), and mesothelioma (asbestos — especially amphibole fibers)."
    },
    riskFactors: [
      "Asbestos: construction workers, shipyard workers, insulation installers, brake repair, miners, demolition workers",
      "Silica: miners (quartz-containing rock), sandblasters, stone cutters, foundry workers, tunnel workers",
      "Coal mine dust: coal workers' pneumoconiosis (CWP, 'black lung')",
      "Beryllium: aerospace, nuclear, electronics workers (chronic beryllium disease — granulomatous, mimics sarcoidosis)",
      "Welding fumes: siderosis (iron), stainless steel welding (chromium, nickel)",
      "Duration and intensity of exposure (dose-response relationship)",
      "Concurrent smoking (synergistic risk with asbestos for lung cancer: 50-80× increased risk)",
      "Latency period: asbestosis typically 15-20 years, silicosis 10-30 years (acute silicosis < 5 years with massive exposure)"
    ],
    diagnostics: [
      "CXR: asbestosis — lower lobe predominant reticular opacities, pleural plaques (calcified parietal pleural thickening — hallmark of asbestos exposure); silicosis — upper lobe predominant nodular opacities, eggshell calcification of hilar lymph nodes",
      "HRCT: asbestosis — subpleural curvilinear lines, intralobular interstitial thickening, honeycombing (lower lobes); silicosis — well-defined nodules (upper > lower), progressive massive fibrosis (coalescent masses)",
      "PFTs: restrictive pattern (asbestosis) or mixed obstructive-restrictive (silicosis); reduced DLCO in both",
      "ILO classification of CXR for pneumoconiosis: standardized grading of profusion and size of opacities (used for compensation/regulatory purposes)",
      "BAL: elevated neutrophils, asbestos bodies (asbestosis); birefringent silica particles (silicosis)",
      "Detailed occupational history: job titles, exposure duration, respiratory protection used, latency period",
      "TB screening: mandatory for silicosis (3× increased TB risk; silicosis-TB has high mortality)",
      "Lung cancer screening: annual LDCT for asbestos-exposed patients meeting standard criteria"
    ],
    management: [
      "No curative treatment for established pneumoconiosis — management is preventive and supportive",
      "Prevention: primary prevention through workplace exposure controls (engineering controls, respiratory protection, dust monitoring, regulatory compliance)",
      "Smoking cessation: particularly critical in asbestos-exposed workers (synergistic lung cancer risk)",
      "Supplemental oxygen for hypoxemia (SpO2 < 88% at rest or with exertion)",
      "Pulmonary rehabilitation for functional improvement and quality of life",
      "Annual influenza and pneumococcal vaccination",
      "TB screening and LTBI treatment in silicosis (isoniazid 300 mg × 9 months recommended for positive TST/IGRA regardless of age)",
      "Lung transplant evaluation for end-stage pulmonary fibrosis",
      "Lung cancer surveillance: annual LDCT for eligible asbestos-exposed patients"
    ],
    nursingActions: [
      "Obtain thorough occupational exposure history: job titles across career, industries, specific materials handled, respiratory protection used, duration of exposure",
      "Educate on the importance of reporting occupational exposure for workers' compensation and regulatory purposes",
      "Screen for TB in silicosis patients: annual TST or IGRA; treat LTBI aggressively",
      "Facilitate smoking cessation — the combination of asbestos + smoking increases lung cancer risk 50-80 fold (multiplicative, not additive)",
      "Monitor PFTs annually to track disease progression",
      "Coordinate occupational medicine referral for exposure documentation and compensation claims",
      "Educate on ongoing risk awareness: asbestos-related mesothelioma has 20-40 year latency — ongoing surveillance needed decades after exposure ceases",
      "Screen for psychological impact: anxiety about cancer risk, financial concerns from inability to work"
    ],
    signs: {
      left: [
        "Asymptomatic pleural plaques on incidental CXR (asbestos exposure marker, not disease)",
        "Mild exertional dyspnea with early restrictive changes on PFTs",
        "Simple silicosis: small nodular opacities without functional impairment",
        "Stable disease on serial imaging and PFTs"
      ],
      right: [
        "Progressive massive fibrosis: large conglomerate masses in upper lobes (silicosis) causing severe restriction",
        "Mesothelioma: pleural effusion, chest pain, weight loss, CT showing pleural thickening (median survival 12 months)",
        "Lung cancer in asbestos-exposed smoker",
        "Acute silicosis (proteinosis): milky BAL, ground-glass opacities, rapidly progressive respiratory failure"
      ]
    },
    medications: [
      {
        name: "Isoniazid (LTBI treatment in silicosis)",
        type: "Mycolic Acid Synthesis Inhibitor",
        action: "Kills M. tuberculosis bacilli preventing reactivation TB in silicosis patients who have 3× increased TB risk due to silica-mediated macrophage dysfunction",
        sideEffects: "Hepatotoxicity, peripheral neuropathy (prevent with pyridoxine), drug-induced lupus",
        contra: "Active hepatic disease, prior INH hepatitis",
        pearl: "All silicosis patients with positive TST or IGRA should receive LTBI treatment (INH 300 mg × 9 months with pyridoxine 25-50 mg daily) regardless of age. Silica impairs macrophage function making TB more likely to reactivate AND more difficult to treat. Monitor LFTs monthly."
      },
      {
        name: "Supplemental Oxygen (home O2 therapy)",
        type: "Supportive Therapy",
        action: "Corrects chronic hypoxemia from V/Q mismatch and diffusion impairment caused by pulmonary fibrosis; reduces pulmonary hypertension progression",
        sideEffects: "Fire hazard, oxygen toxicity with high FiO2, nasal dryness, social stigma limiting adherence",
        contra: "Active smoking with O2 (fire risk; requires cessation before prescribing)",
        pearl: "Prescribe home O2 when resting PaO2 <= 55 mmHg (or SpO2 <= 88%) or PaO2 56-59 with cor pulmonale or erythrocytosis. Use >= 15 hours/day for survival benefit (NOTT trial). Portable O2 for exertional use improves exercise tolerance and quality of life."
      }
    ],
    pearls: [
      "Pleural plaques are the most common radiographic finding of asbestos exposure but do NOT indicate asbestosis (which requires parenchymal fibrosis) — plaques alone are a marker of exposure, not disease, and typically do not cause functional impairment",
      "The synergistic effect of asbestos + smoking on lung cancer risk is MULTIPLICATIVE, not additive: asbestos alone = 5× risk, smoking alone = 10× risk, both = 50-80× risk — smoking cessation in asbestos-exposed workers is one of the most impactful preventive interventions in medicine",
      "Eggshell calcification of hilar lymph nodes on CXR is virtually pathognomonic for silicosis (also rarely seen in sarcoidosis and post-radiation) — this finding in a miner or quarry worker establishes the diagnosis"
    ],
    quiz: [
      {
        question: "A 55-year-old former shipyard worker with 30 pack-year smoking history presents with dyspnea. CXR shows bilateral lower lobe reticular opacities and calcified pleural plaques. What is the most critical intervention?",
        options: [
          "Start corticosteroids for interstitial fibrosis",
          "Intensive smoking cessation counseling and pharmacotherapy",
          "Order bronchoscopy for tissue diagnosis",
          "Start inhaled bronchodilators for COPD"
        ],
        correct: 1,
        rationale: "This presentation is consistent with asbestosis (lower lobe fibrosis + calcified pleural plaques from asbestos exposure). The most critical intervention is smoking cessation — the combination of asbestos exposure and smoking creates a 50-80× increased lung cancer risk. There is no curative treatment for asbestosis. Corticosteroids have no role. Annual LDCT screening should also be initiated."
      }
    ]
  },
  "ventilator-associated-pneumonia-np": {
    title: "Ventilator-Associated Pneumonia: Prevention & Treatment",
    cellular: {
      title: "VAP Pathogenesis and Microbiology",
      content: "Ventilator-associated pneumonia (VAP) develops >= 48 hours after endotracheal intubation, with an incidence of 5-15% of mechanically ventilated patients. Pathogenesis involves aspiration of colonized oropharyngeal or gastric secretions around the ETT cuff into the lower airways. The ETT bypasses upper airway defenses (glottis, cough reflex) and creates a conduit for bacterial migration via biofilm formation on the inner tube surface. Early-onset VAP (< 5 days) is typically caused by community organisms (S. pneumoniae, H. influenzae, MSSA), while late-onset VAP (>= 5 days) involves MDR organisms: MRSA, Pseudomonas aeruginosa, Acinetobacter, Klebsiella (ESBL-producing), Stenotrophomonas. Risk factors include reintubation, supine position, sedation depth, gastric acid suppression, and transport out of ICU. Prevention bundles have reduced VAP incidence by 40-70%."
    },
    riskFactors: [
      "Duration of mechanical ventilation (risk increases ~1-3% per ventilator day)",
      "Reintubation (aspiration during intubation attempt)",
      "Supine positioning (head-of-bed flat promotes aspiration)",
      "Deep sedation (impairs cough and protective reflexes)",
      "Proton pump inhibitor or H2 blocker therapy (gastric alkalinization promotes bacterial overgrowth)",
      "Prior antibiotics within 90 days (selects resistant organisms)",
      "COPD and other chronic lung diseases",
      "Emergency intubation (higher aspiration risk than elective)"
    ],
    diagnostics: [
      "Clinical suspicion: new or worsening infiltrate on CXR + 2 of: fever > 38°C, leukocytosis > 12,000 or leukopenia < 4,000, purulent tracheal secretions",
      "Clinical Pulmonary Infection Score (CPIS) >= 6 suggests VAP (temperature, WBC, tracheal secretions, oxygenation, CXR, culture)",
      "Quantitative endotracheal aspirate (ETA): > 10⁶ CFU/mL supports VAP diagnosis",
      "BAL or mini-BAL: quantitative culture > 10⁴ CFU/mL; more specific than ETA",
      "Protected specimen brush (PSB): > 10³ CFU/mL",
      "Blood cultures: positive in 8-20% of VAP cases (if positive, associated with higher mortality)",
      "Procalcitonin: > 0.5 mcg/L supports bacterial infection; serial levels guide antibiotic duration",
      "CXR: new or progressive infiltrate (limited specificity in critically ill — may be atelectasis, edema, ARDS)"
    ],
    management: [
      "Empiric therapy for suspected VAP with MDR risk: anti-pseudomonal beta-lactam (piperacillin-tazobactam, cefepime, or meropenem) + anti-pseudomonal agent from different class (ciprofloxacin or tobramycin) + MRSA coverage (vancomycin or linezolid)",
      "Empiric therapy for early-onset VAP without MDR risk: single anti-pseudomonal agent (cefepime or piperacillin-tazobactam)",
      "De-escalate antibiotics based on culture results (narrow spectrum as soon as susceptibilities available)",
      "Duration: 7 days (shorter courses per guidelines unless immunocompromised, inadequate initial empiric therapy, or necrotizing/cavitary)",
      "Procalcitonin-guided de-escalation: discontinue antibiotics when PCT drops > 80% from peak or falls below 0.5",
      "If cultures negative at 72 hours and patient improving clinically: consider stopping antibiotics (low probability of VAP)",
      "Inhaled antibiotics (tobramycin or colistin) as adjunct for MDR gram-negative VAP (not monotherapy)",
      "Address modifiable risk factors: minimize sedation, daily SBT, elevate HOB, oral care"
    ],
    nursingActions: [
      "Implement VAP prevention bundle consistently: HOB elevation 30-45°, daily sedation vacation, daily SBT assessment, DVT prophylaxis, PUD prophylaxis (with awareness of VAP risk from PPIs)",
      "Oral care with chlorhexidine 0.12% twice daily (reduces oropharyngeal colonization)",
      "Maintain ETT cuff pressure 20-30 cmH2O (prevents aspiration of subglottic secretions while avoiding tracheal ischemia)",
      "Use ETT with subglottic secretion drainage (SSD) when available — reduces VAP incidence by 45%",
      "Avoid routine scheduled ventilator circuit changes (change only when visibly soiled or malfunctioning — frequent changes increase VAP risk)",
      "Minimize sedation depth: use Richmond Agitation-Sedation Scale (RASS) target -1 to 0 unless specific indication for deeper sedation",
      "Position patient semirecumbent for procedures and feeding to minimize aspiration",
      "Document all VAP bundle compliance elements per shift — bundle compliance tracking improves adherence"
    ],
    signs: {
      left: [
        "Mild temperature elevation with slightly increased tracheal secretions in first 48 hours of intubation (may be colonization, not infection)",
        "Early-onset VAP with susceptible organism responding to narrow-spectrum antibiotics",
        "Improving clinical trajectory with de-escalated antibiotics based on cultures",
        "Resolution of infiltrate and improving oxygenation within 72 hours of treatment"
      ],
      right: [
        "Severe sepsis from late-onset MDR VAP (Pseudomonas, Acinetobacter) with hemodynamic instability",
        "Necrotizing pneumonia with cavitation and empyema requiring drainage",
        "Treatment failure at 72 hours with worsening infiltrates and persistent fever",
        "MDR organism with limited antibiotic options requiring combination therapy including inhaled antibiotics"
      ]
    },
    medications: [
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits cell wall synthesis; tazobactam inhibits beta-lactamases including some ESBLs; covers Pseudomonas, Enterobacteriaceae, anaerobes, and many gram-positives",
        sideEffects: "Diarrhea, C. difficile, allergic reactions, neutropenia with prolonged use, hypokalemia",
        contra: "Severe penicillin allergy (type I), concurrent probenecid may increase levels",
        pearl: "VAP dosing: 4.5 g IV q6h (extended infusion over 4 hours improves pharmacokinetics and may improve outcomes in severe infections). Good anti-pseudomonal activity. NOT reliable against MRSA, AmpC-producing organisms, or many ESBL-producers. Combine with MRSA coverage and second anti-pseudomonal agent for severe VAP."
      },
      {
        name: "Linezolid",
        type: "Oxazolidinone Antibiotic",
        action: "Inhibits protein synthesis by binding 23S rRNA of the 50S ribosomal subunit, preventing formation of the 70S initiation complex; bacteriostatic against MRSA with better lung penetration than vancomycin",
        sideEffects: "Thrombocytopenia (monitor CBC weekly), serotonin syndrome (with SSRIs, MAOIs), peripheral neuropathy (prolonged use > 2 weeks), lactic acidosis",
        contra: "Concurrent serotonergic drugs (SSRIs, SNRIs, MAOIs — serotonin syndrome risk), pheochromocytoma, uncontrolled hypertension",
        pearl: "600 mg IV/PO BID. Superior lung penetration compared to vancomycin (epithelial lining fluid concentration 4-5× serum vs 15-25% for vancomycin). May be preferred for MRSA VAP (some meta-analyses suggest better outcomes). 100% oral bioavailability enables seamless IV-to-PO switch. Limit to 14 days when possible (thrombocytopenia, neuropathy)."
      }
    ],
    pearls: [
      "VAP prevention is far more effective than treatment — the VAP prevention bundle (HOB 30-45°, daily sedation vacation, daily SBT, oral care, subglottic suctioning) reduces VAP by 40-70% and is a key ICU quality metric",
      "De-escalation of antibiotics based on culture results within 48-72 hours is critical — continuing broad-spectrum empiric therapy when a specific organism is identified promotes MDR development and increases C. difficile risk",
      "ETT tubes with subglottic secretion drainage (SSD) reduce VAP incidence by ~45% and should be used for patients expected to require ventilation > 48 hours — this is an easily implemented prevention strategy"
    ],
    quiz: [
      {
        question: "A patient intubated 7 days ago develops fever 39.2°C, purulent tracheal secretions, WBC 18,000, and new RLL infiltrate on CXR. Endotracheal aspirate grows Pseudomonas aeruginosa sensitive to meropenem and tobramycin, and MRSA sensitive to vancomycin. What is the appropriate antibiotic regimen?",
        options: [
          "Meropenem alone for 14 days",
          "Meropenem + vancomycin for 7 days, then de-escalate based on clinical response",
          "Vancomycin alone for 7 days",
          "Meropenem + tobramycin + vancomycin for 21 days"
        ],
        correct: 1,
        rationale: "Late-onset VAP (day 7) with both Pseudomonas and MRSA requires coverage for both organisms: meropenem (anti-pseudomonal) + vancomycin (MRSA). Duration should be 7 days per guidelines (not 14 or 21 days — shorter courses have equivalent outcomes with less resistance). De-escalate or stop tobramycin once susceptibilities confirm meropenem sensitivity (dual anti-pseudomonal coverage not needed once susceptibility is known)."
      }
    ]
  },
  "tracheobronchial-injury-np": {
    title: "Tracheobronchial Injury: Diagnosis & Surgical Management",
    cellular: {
      title: "Airway Disruption Pathophysiology",
      content: "Tracheobronchial injury (TBI) involves disruption of the tracheobronchial tree from blunt or penetrating trauma, iatrogenic injury, or rarely, spontaneous rupture. Blunt TBI typically occurs within 2.5 cm of the carina (80% of injuries), where the bronchi are fixed and less mobile. The mechanism involves sudden anteroposterior thoracic compression increasing intraluminal pressure against a closed glottis, causing mucosal or transmural tears. Penetrating injuries can affect any level. Iatrogenic TBI from intubation typically involves the posterior membranous tracheal wall (most vulnerable). Clinical presentation ranges from subcutaneous emphysema and pneumomediastinum to massive air leak with respiratory failure. The classic sign is persistent pneumothorax that does not resolve with chest tube placement (continuous large air leak). Delayed diagnosis is common (50% diagnosed > 24 hours) because smaller tears may initially be contained by surrounding tissue."
    },
    riskFactors: [
      "Blunt thoracic trauma: motor vehicle collisions (most common), crush injuries, falls from height",
      "Penetrating chest trauma: stab wounds, gunshot wounds",
      "Iatrogenic: traumatic intubation (oversized ETT, stylet perforation), tracheostomy complications, bronchoscopy",
      "Female sex and short stature (smaller airway diameter — higher iatrogenic risk)",
      "Overinflated ETT cuff (tracheal wall ischemia and perforation)",
      "Emergency intubation (lack of controlled conditions increases injury risk)",
      "Double-lumen ETT placement (larger tube diameter, more rigid)",
      "Chronic steroid or radiation therapy (weakened tracheal wall)"
    ],
    diagnostics: [
      "Clinical signs: subcutaneous emphysema (neck, chest, face), pneumomediastinum, persistent pneumothorax with large air leak despite chest tube",
      "CXR: pneumomediastinum, subcutaneous emphysema, persistent pneumothorax, 'fallen lung sign' (collapsed lung falls peripherally rather than toward hilum — pathognomonic for complete bronchial disruption)",
      "CT chest: pneumomediastinum, airway wall discontinuity, peribronchial air, tracheal deformity",
      "Bronchoscopy: GOLD STANDARD for diagnosis — directly visualizes tear location, extent, and depth (mucosal vs transmural)",
      "Chest tube output assessment: persistent large air leak (> 5-7 days) or failure of lung to re-expand suggests TBI",
      "Clinical triad in blunt TBI: subcutaneous emphysema + pneumomediastinum + pneumothorax",
      "Serial CXR: worsening subcutaneous emphysema or persistent air leak despite chest drainage",
      "CT 3D airway reconstruction: preoperative planning for surgical repair"
    ],
    management: [
      "ABCs: secure airway (may require awake fiberoptic intubation with ETT advanced beyond the tear under bronchoscopic guidance)",
      "Conservative management for small tears (< 1/3 circumference, no respiratory distress): observation, antibiotics, minimize positive pressure ventilation",
      "Chest tube placement for pneumothorax; persistent large air leak suggests TBI requiring surgical evaluation",
      "Surgical repair (primary closure or reconstruction) for: large tears (> 1/3 circumference), complete transection, respiratory failure, mediastinitis, progressive subcutaneous emphysema",
      "Operative approach: right posterolateral thoracotomy for right mainstem and distal tracheal injuries; cervical approach for proximal tracheal injuries",
      "Minimize ventilator pressures: low Vt, low PEEP to reduce air leak through injury",
      "If intubation is needed, advance ETT beyond the injury site under bronchoscopic guidance to maintain ventilation and reduce air leak",
      "Post-repair surveillance: serial bronchoscopy at 2 weeks and 3 months for stenosis detection"
    ],
    nursingActions: [
      "Assess for subcutaneous emphysema: palpate neck, chest, and face for crepitus; mark extent and monitor for progression",
      "Monitor chest tube output and air leak: persistent air leak > 5-7 days or large continuous air leak suggests TBI",
      "Maintain secure airway: be prepared for emergent re-intubation; avoid manipulating the ETT without bronchoscopic guidance in suspected TBI",
      "Minimize positive pressure if possible: use lowest PEEP and Vt to reduce air leak through injured airway",
      "Monitor for pneumomediastinum progression: assess for chest pain, dyspnea, hemodynamic changes",
      "Post-operative monitoring: assess breath sounds, chest tube function, wound site, for signs of air leak recurrence",
      "Educate patient on potential long-term complications: tracheal or bronchial stenosis requiring surveillance bronchoscopy",
      "Document time of injury, mechanism, and progression of symptoms for trauma registry and care continuity"
    ],
    signs: {
      left: [
        "Small mucosal tear: mild subcutaneous emphysema, stable vital signs, no pneumothorax",
        "Conservative management with resolving subcutaneous emphysema and no air leak",
        "Iatrogenic posterior membranous wall tear recognized immediately and managed conservatively",
        "Minimal symptoms with small tear managed non-operatively"
      ],
      right: [
        "Complete bronchial transection: 'fallen lung sign' on CXR, massive continuous air leak, respiratory failure",
        "Tension pneumomediastinum with cardiac tamponade physiology",
        "Mediastinitis from contamination through airway disruption",
        "Delayed presentation with airway stenosis and recurrent pneumonia months after injury"
      ]
    },
    medications: [
      {
        name: "Broad-Spectrum Antibiotics (prophylactic)",
        type: "Infection Prevention",
        action: "Prevent mediastinitis from airway contamination through the tracheal or bronchial disruption; cover upper airway and skin flora",
        sideEffects: "Drug-specific (GI upset, allergic reactions, C. difficile)",
        contra: "Known drug allergy",
        pearl: "Administer prophylactic antibiotics (cefazolin or ampicillin-sulbactam) for airway injuries with mediastinal contamination or penetrating injuries. Duration typically 24-72 hours for clean injuries, longer for contaminated or infected cases. Adjust based on culture results if mediastinitis develops."
      },
      {
        name: "Analgesics (Multimodal Pain Management)",
        type: "Pain Control",
        action: "Adequate pain control enables effective coughing, deep breathing, and chest physiotherapy — essential for airway clearance and pneumonia prevention post-injury and post-surgery",
        sideEffects: "Opioid-related: respiratory depression, constipation, sedation; NSAID-related: GI bleeding, renal impairment",
        contra: "Severe respiratory depression (opioids), active GI bleeding (NSAIDs)",
        pearl: "Multimodal approach: acetaminophen scheduled + NSAIDs (if no contraindications) + low-dose opioid PRN. Regional anesthesia (thoracic epidural or paravertebral block) for thoracotomy patients. Adequate pain control is therapeutic — undertreated pain leads to atelectasis, retained secretions, and pneumonia."
      }
    ],
    pearls: [
      "Persistent pneumothorax with large continuous air leak despite properly functioning chest tube is the most common clinical presentation of tracheobronchial injury — always maintain high suspicion in trauma patients",
      "The 'fallen lung sign' on CXR (lung collapses peripherally instead of medially toward the hilum) is pathognomonic for complete bronchial transection — the lung falls away from the hilum because it is no longer connected to the bronchial tree",
      "Bronchoscopy is the GOLD STANDARD for TBI diagnosis — when clinical suspicion exists (subcutaneous emphysema + persistent air leak + pneumomediastinum), flexible bronchoscopy should be performed urgently to identify and characterize the injury"
    ],
    quiz: [
      {
        question: "Following a high-speed MVC, a 30-year-old has extensive subcutaneous emphysema, pneumomediastinum, and a right pneumothorax. A chest tube is placed but there is a continuous large air leak and the lung fails to re-expand. CXR shows the lung falling peripherally. What is the most likely diagnosis and next step?",
        options: [
          "Tension pneumothorax — place a second chest tube",
          "Right mainstem bronchial transection — urgent bronchoscopy then surgical repair",
          "Pulmonary contusion — increase PEEP for lung recruitment",
          "Esophageal rupture — order contrast swallow study"
        ],
        correct: 1,
        rationale: "The persistent air leak with failure of lung re-expansion and 'fallen lung sign' (lung collapses peripherally) is pathognomonic for complete bronchial transection. Urgent bronchoscopy confirms the diagnosis and characterizes the injury. Surgical repair (primary anastomosis) is required for complete transections. A second chest tube would not address the underlying airway disruption."
      }
    ]
  },
  "hemothorax-management-np": {
    title: "Hemothorax: Chest Tube & Surgical Intervention",
    cellular: {
      title: "Pleural Space Hemorrhage Pathophysiology",
      content: "Hemothorax is the accumulation of blood in the pleural space, most commonly from trauma (rib fractures lacerating intercostal or internal mammary arteries, lung parenchymal injury, or great vessel injury). Non-traumatic causes include malignancy, pulmonary embolism with infarction, coagulopathy/anticoagulation, ruptured aortic aneurysm, and spontaneous hemopneumothorax. The pleural space can hold 2-3 liters of blood — massive hemothorax (> 1500 mL or > 200 mL/hr for 2-4 hours) constitutes a surgical emergency. A retained hemothorax that is not evacuated within 72 hours becomes organized as fibrin deposits trap blood, forming a fibrous peel (fibrothorax) that restricts lung expansion and may become infected (empyema). The decision between chest tube drainage alone versus surgical intervention (VATS or thoracotomy) depends on the initial output and ongoing drainage rate."
    },
    riskFactors: [
      "Thoracic trauma: blunt (rib fractures, pulmonary contusion) or penetrating (stab, gunshot)",
      "Rib fractures (most common cause of traumatic hemothorax)",
      "Anticoagulation or coagulopathy (increases bleeding from minor injuries)",
      "Thoracic malignancy with pleural invasion",
      "Post-procedural: central line placement, thoracentesis, chest tube insertion, thoracic surgery",
      "Pulmonary embolism with infarction",
      "Aortic aneurysm rupture into pleural space (left-sided, massive)",
      "Catamenial hemothorax (endometriosis-related, menstrual cycle)"
    ],
    diagnostics: [
      "CXR upright: meniscus sign at costophrenic angle (300 mL detectable); large hemothorax: complete opacification of hemithorax with mediastinal shift",
      "FAST exam (eFAST): detection of pleural fluid in trauma setting; cannot reliably distinguish blood from other fluids",
      "CT chest with contrast: quantifies hemothorax, identifies source of bleeding, associated injuries (rib fractures, pulmonary contusion, aortic injury)",
      "Pleural fluid analysis: hematocrit > 50% of peripheral blood hematocrit defines hemothorax (vs bloody effusion)",
      "Chest tube output: initial drainage volume and ongoing rate determine management",
      "Massive hemothorax criteria: > 1500 mL initial drainage OR > 200 mL/hr for 2-4 consecutive hours → surgical exploration",
      "Serial hemoglobin and hemodynamic monitoring: trending Hgb drop and hemodynamic instability indicate ongoing hemorrhage",
      "CXR post-chest tube: assess adequacy of drainage, residual hemothorax, lung re-expansion"
    ],
    management: [
      "Large-bore chest tube (28-36 Fr) insertion: 5th intercostal space, mid-axillary line; connects to underwater seal drainage system",
      "Autotransfusion: collected pleural blood can be reinfused through autotransfusion device for massive hemothorax (blood is anticoagulated by contact with pleural surfaces)",
      "Massive hemothorax (> 1500 mL initial or > 200 mL/hr × 2-4 hrs): emergent thoracotomy for hemorrhage control",
      "Concurrent hemorrhagic shock management: massive transfusion protocol (1:1:1 ratio of pRBC:FFP:platelets), permissive hypotension (target SBP 80-90 until source control)",
      "VATS for retained hemothorax (> 300 mL at 72 hours despite chest tube drainage): evacuates organized clot and prevents fibrothorax/empyema",
      "Non-traumatic hemothorax: treat underlying cause — reverse anticoagulation, chemotherapy for malignancy, surgery for aortic aneurysm",
      "Serial CXR q6-12h to monitor drainage adequacy and lung re-expansion",
      "Prophylactic antibiotics: first-generation cephalosporin for 24 hours with chest tube in traumatic hemothorax (reduces empyema risk)"
    ],
    nursingActions: [
      "Prepare for chest tube insertion: gather appropriate size (28-36 Fr for hemothorax — large bore to drain blood and clots), sterile setup, underwater seal drainage system",
      "Measure and document initial chest tube output: > 1500 mL initial = massive hemothorax requiring emergent surgical consultation",
      "Monitor ongoing drainage: document hourly output; > 200 mL/hr for 2-4 hours triggers surgical exploration",
      "Maintain chest tube patency: strip/milk tubing per protocol to prevent clot obstruction; ensure drainage system is below chest level",
      "Assess for signs of ongoing hemorrhage: tachycardia, hypotension, declining Hgb, continued high chest tube output",
      "Monitor for re-expansion pulmonary edema: sudden cough, dyspnea, pink frothy sputum after large volume drainage",
      "Encourage incentive spirometry and cough after initial stabilization to promote lung re-expansion",
      "Coordinate with trauma surgery: relay chest tube output data and hemodynamic trends for operative decision-making"
    ],
    signs: {
      left: [
        "Small hemothorax (< 500 mL) on CXR with stable hemodynamics",
        "Chest tube output < 100 mL/hr and decreasing over time",
        "Complete lung re-expansion after chest tube drainage",
        "Stable hemoglobin without need for transfusion"
      ],
      right: [
        "Massive hemothorax: > 1500 mL initial drainage with hemorrhagic shock",
        "Ongoing brisk drainage > 200 mL/hr requiring emergent thoracotomy",
        "Retained hemothorax at 72 hours: loculated fluid not draining through chest tube",
        "Tension hemothorax: mediastinal shift with hemodynamic collapse"
      ]
    },
    medications: [
      {
        name: "Tranexamic Acid (TXA)",
        type: "Antifibrinolytic",
        action: "Inhibits plasminogen activation, preventing fibrin clot dissolution; reduces bleeding in trauma by stabilizing formed clots",
        sideEffects: "Nausea, diarrhea, seizures (high doses), thromboembolic events (theoretical risk)",
        contra: "Active intravascular clotting, subarachnoid hemorrhage, severe renal impairment",
        pearl: "CRASH-2 trial: TXA 1 g IV bolus then 1 g over 8 hours reduces all-cause mortality in bleeding trauma patients if given within 3 hours of injury. Benefit is time-dependent — greatest when given within 1 hour. Should be part of massive transfusion protocol for traumatic hemothorax. No benefit (and possible harm) if given > 3 hours after injury."
      },
      {
        name: "Cefazolin (Prophylactic)",
        type: "First-Generation Cephalosporin",
        action: "Provides prophylaxis against skin flora (S. aureus, streptococci) contaminating the pleural space during chest tube insertion in trauma",
        sideEffects: "Allergic reactions, diarrhea, C. difficile (rare with short course)",
        contra: "Severe penicillin allergy (type I hypersensitivity)",
        pearl: "Single dose 2 g IV at chest tube insertion, continue for 24 hours only. Meta-analyses show prophylactic antibiotics with traumatic chest tubes reduce empyema and pneumonia rates. Do not extend beyond 24 hours — prolonged courses promote resistance without additional benefit."
      }
    ],
    pearls: [
      "The threshold for emergent thoracotomy is > 1500 mL initial drainage OR > 200 mL/hr for 2-4 consecutive hours — these numbers must be communicated immediately to the surgical team",
      "Retained hemothorax (> 300 mL remaining at 72 hours despite chest tube) should be evacuated by VATS — delay beyond 72 hours leads to organization, fibrothorax, and trapped lung that requires more invasive decortication",
      "Autotransfusion of collected pleural blood is a valuable resource in massive hemothorax — blood in the pleural space is naturally anticoagulated by contact with the mesothelial surface and can be safely reinfused through autotransfusion systems"
    ],
    quiz: [
      {
        question: "A trauma patient has a left chest tube placed for hemothorax. Initial output is 1800 mL of blood. The patient's BP is 85/60 despite 2 units of pRBCs. What is the most appropriate next step?",
        options: [
          "Continue transfusion and observe chest tube output for 2 more hours",
          "Emergent left thoracotomy for hemorrhage control",
          "Place a second chest tube for better drainage",
          "Order CT angiography to localize the bleeding source"
        ],
        correct: 1,
        rationale: "Initial output > 1500 mL with hemodynamic instability despite transfusion meets criteria for emergent thoracotomy. The source of bleeding (likely intercostal artery, internal mammary, or pulmonary hilar vessel) requires operative identification and control. Delaying for imaging or observation risks exsanguination. A second chest tube does not address the bleeding source."
      }
    ]
  },
  "pneumothorax-management-np": {
    title: "Pneumothorax: Needle Decompression & Chest Tube",
    cellular: {
      title: "Pleural Space Air Accumulation",
      content: "Pneumothorax occurs when air enters the pleural space, disrupting the normal negative intrapleural pressure that maintains lung inflation. Primary spontaneous pneumothorax (PSP) occurs without underlying lung disease, typically in tall, thin young males from rupture of apical subpleural blebs. Secondary spontaneous pneumothorax (SSP) occurs in patients with underlying lung disease (COPD most common, followed by asthma, CF, Pneumocystis pneumonia, Langerhans cell histiocytosis). Traumatic pneumothorax results from penetrating or blunt chest injury. Tension pneumothorax is a life-threatening emergency: a one-way valve mechanism allows air to enter but not exit the pleural space, causing progressive accumulation, mediastinal shift, and compression of the contralateral lung and great vessels, leading to obstructive shock. Needle decompression at the 2nd intercostal space, midclavicular line (or 4th-5th ICS, anterior axillary line) converts tension to simple pneumothorax as a temporizing measure before chest tube placement."
    },
    riskFactors: [
      "PSP: tall, thin male, age 18-40, smoking (increases risk 20× in men, 9× in women)",
      "SSP: COPD (most common), CF, asthma, TB, Pneumocystis jirovecii pneumonia (HIV), Langerhans cell histiocytosis",
      "Traumatic: blunt or penetrating chest trauma, rib fractures",
      "Iatrogenic: central line insertion (subclavian > IJ), thoracentesis, lung biopsy, mechanical ventilation (barotrauma)",
      "Catamenial pneumothorax (endometriosis-related, recurrent with menses)",
      "Marfan syndrome and other connective tissue disorders",
      "Mechanical ventilation with high PEEP or high tidal volumes (barotrauma)",
      "Prior pneumothorax (recurrence rate: PSP 30% at 5 years, SSP 43% at 5 years)"
    ],
    diagnostics: [
      "CXR (upright, inspiratory): visceral pleural line visible, absent lung markings peripheral to pleural line",
      "CXR (expiratory): increases visualization of small pneumothoraces (air appears more conspicuous against partially deflated lung)",
      "Size estimation: BTS guidelines — visible rim of air at hilum on CXR; < 2 cm from lung edge = small; >= 2 cm = large",
      "CT chest: most sensitive test; identifies occult pneumothorax, blebs/bullae for surgical planning, underlying lung disease",
      "Point-of-care ultrasound (POCUS): absent lung sliding (M-mode shows 'stratosphere sign' instead of normal 'seashore sign'), absent B-lines, positive 'lung point' where sliding resumes (pathognomonic)",
      "Tension pneumothorax is a CLINICAL diagnosis — do NOT delay treatment for imaging: tracheal deviation, absent breath sounds, JVD, hypotension, tachycardia, hyperresonance",
      "ABG: may show hypoxemia and respiratory alkalosis (tachypnea) or respiratory acidosis in severe cases",
      "CXR after intervention: confirm lung re-expansion, assess chest tube position"
    ],
    management: [
      "Tension pneumothorax: IMMEDIATE needle decompression — 14-16G needle at 2nd ICS midclavicular line (or 4th-5th ICS anterior axillary line in muscular/obese patients) followed by chest tube",
      "Small PSP (< 2 cm, minimal symptoms): observation for 3-6 hours with repeat CXR; discharge if stable; supplemental O2 accelerates reabsorption by 4× (nitrogen washout)",
      "Large PSP (>= 2 cm or symptomatic): needle aspiration first-line (BTS guidelines) — 16-18G needle, aspirate air, repeat CXR; if fails → chest tube (12-16 Fr)",
      "SSP: chest tube insertion (larger bore 16-24 Fr) — SSP is more dangerous than PSP because underlying lung disease limits respiratory reserve; observe longer before removal",
      "Traumatic pneumothorax: chest tube insertion (28-32 Fr to drain potential hemothorax concomitantly)",
      "Chest tube management: connect to underwater seal drainage; resolution when no air leak for 24 hours and lung fully re-expanded on CXR → clamp 6-24 hours → repeat CXR → remove if stable",
      "Surgical pleurodesis or bullectomy (VATS): for recurrent PSP (2nd episode same side), persistent air leak > 5-7 days, bilateral simultaneous pneumothorax, or certain occupations (pilots, divers)",
      "Supplemental O2 (even normoxic patients): high-flow O2 accelerates pleural air reabsorption 4× by creating nitrogen gradient"
    ],
    nursingActions: [
      "Recognize tension pneumothorax immediately: tracheal deviation AWAY from affected side, absent breath sounds, JVD, hypotension, severe respiratory distress — this is a CLINICAL diagnosis; do NOT wait for CXR",
      "Prepare for needle decompression: 14-16G angiocatheter, 2nd ICS midclavicular line, perpendicular to chest wall, aspirate until rush of air confirms entry into pleural space",
      "Assist with chest tube insertion: position patient, prepare sterile field, 12-32 Fr tube depending on indication, connect to underwater seal drainage",
      "Monitor chest tube function: look for respiratory swing (tidaling) in water seal, monitor for air leak (persistent bubbling = ongoing air leak), ensure tube is not kinked or obstructed",
      "Document chest tube output: volume, character (serous, bloody), presence or absence of air leak",
      "Clamping protocol before removal: clamp for 6-24 hours when no air leak × 24 hours; repeat CXR; remove if no recurrence",
      "Post-removal monitoring: CXR 1-4 hours after removal; monitor for recurrence (dyspnea, decreased breath sounds)",
      "Educate on recurrence prevention: smoking cessation (most important), avoid diving/flying for 2-4 weeks after resolution, seek care immediately if symptoms recur"
    ],
    signs: {
      left: [
        "Small PSP (< 2 cm): mild pleuritic chest pain, minimal dyspnea, stable vitals",
        "PSP resolving with observation and supplemental O2",
        "Chest tube with no air leak and full lung re-expansion ready for removal",
        "Simple traumatic pneumothorax managed with chest tube with good drainage"
      ],
      right: [
        "Tension pneumothorax: severe dyspnea, tracheal deviation, JVD, hypotension, absent breath sounds — IMMEDIATE needle decompression",
        "Bilateral simultaneous pneumothorax (respiratory emergency)",
        "Persistent air leak > 5-7 days indicating bronchopleural fistula requiring surgery",
        "SSP in COPD: severe respiratory failure from baseline limited reserve"
      ]
    },
    medications: [
      {
        name: "Supplemental Oxygen (High-Flow)",
        type: "Therapeutic Gas",
        action: "Administering high-flow O2 creates a nitrogen gradient between pleural air and blood, accelerating nitrogen reabsorption from the pleural space by 4× the normal rate (1.25-1.8% per day at baseline)",
        sideEffects: "Oxygen toxicity with prolonged high FiO2, absorption atelectasis, fire risk",
        contra: "Chronic CO2 retention (COPD — use cautiously), neonates (retinopathy risk)",
        pearl: "Even in non-hypoxic patients with pneumothorax, supplemental O2 at 3-4 L/min (or higher if tolerated) accelerates resolution by 4×. This simple intervention reduces time to resolution from weeks to days for small pneumothoraces managed conservatively. Continue until CXR shows resolution."
      },
      {
        name: "Local Anesthesia for Chest Tube Insertion (Lidocaine)",
        type: "Amide Local Anesthetic",
        action: "Blocks sodium channels in sensory nerve fibers, preventing pain signal transmission; used for skin, subcutaneous tissue, periosteum, and parietal pleura infiltration before chest tube insertion",
        sideEffects: "Local reactions, systemic toxicity if overdosed (perioral numbness, tinnitus, seizures, cardiac arrest)",
        contra: "Allergy to amide local anesthetics, maximum dose 4.5 mg/kg (7 mg/kg with epinephrine)",
        pearl: "Liberal lidocaine infiltration is essential for chest tube insertion: skin → subcutaneous tissue → intercostal muscles → parietal pleura (most sensitive layer). Use 20-30 mL of 1% lidocaine (stay within max dose). The parietal pleura is extremely pain-sensitive — inadequate local anesthesia causes severe procedural pain and patient distress."
      }
    ],
    pearls: [
      "Tension pneumothorax is a CLINICAL diagnosis and a CLINICAL emergency — never delay treatment for CXR confirmation; tracheal deviation, absent breath sounds, JVD, and hemodynamic instability require immediate needle decompression followed by chest tube",
      "In obese or muscular patients, the standard 2nd ICS midclavicular line may be too short for needle decompression — the 4th-5th ICS anterior axillary line (lateral approach) has higher success rates in these patients because the chest wall is thinner",
      "Supplemental O2 accelerates pneumothorax reabsorption by 4× even in non-hypoxic patients — this is the single most effective adjunct for conservative management of small pneumothorax and should be prescribed for ALL patients being observed"
    ],
    quiz: [
      {
        question: "A 22-year-old tall, thin male presents with sudden right-sided pleuritic chest pain. CXR shows a 3 cm rim of air at the right apex with no mediastinal shift. He is mildly dyspneic but hemodynamically stable. What is the most appropriate initial management?",
        options: [
          "Immediate chest tube insertion (28 Fr)",
          "Needle aspiration with 16-18G needle followed by repeat CXR",
          "Emergency needle decompression at 2nd ICS",
          "Observation only without any intervention"
        ],
        correct: 1,
        rationale: "This is a large (>= 2 cm) primary spontaneous pneumothorax in a hemodynamically stable patient. BTS guidelines recommend needle aspiration as first-line for large PSP — less invasive than chest tube and successful in ~60% of cases. If aspiration fails (> 2.5 L aspirated or lung does not re-expand), proceed to chest tube insertion. Needle decompression is only for tension pneumothorax. Observation alone is for small PSP (< 2 cm)."
      }
    ]
  },
  "chest-drainage-system-np": {
    title: "Chest Drainage: Advanced Management & Prescribing",
    cellular: {
      title: "Chest Tube Drainage Physiology",
      content: "Chest drainage systems restore and maintain negative intrapleural pressure by evacuating air, blood, or fluid from the pleural space. The traditional three-chamber system includes: a collection chamber (collects drainage), a water seal chamber (acts as one-way valve allowing air out but not in; tidaling indicates tube patency), and a suction control chamber (regulates negative pressure, typically -20 cmH2O). Modern digital drainage systems (e.g., Thopaz) provide continuous objective measurement of air leak and pleural pressure, enabling more reliable assessment of readiness for tube removal. The water seal chamber bubbling indicates an active air leak — continuous bubbling with respiration suggests bronchopleural communication, while intermittent bubbling only with cough may represent a small, resolving leak. 'Tidaling' (fluid oscillation with respiration) confirms tube patency and communication with the pleural space. Loss of tidaling suggests tube obstruction, lung re-expansion, or tube displacement."
    },
    riskFactors: [
      "Chest tube insertion complications: bleeding (intercostal artery injury), organ injury (lung, liver, spleen, heart)",
      "Chest tube malfunction: kinking, clot obstruction, tube displacement, inadequate positioning",
      "Subcutaneous emphysema from inadequate drainage of air leak",
      "Re-expansion pulmonary edema (REPE): risk increases with duration of lung collapse > 72 hours and large-volume drainage",
      "Empyema: infection of retained pleural fluid or blood",
      "Persistent air leak: > 5-7 days suggesting bronchopleural fistula",
      "Tube dislodgement during patient movement or transport",
      "Pain and respiratory splinting limiting deep breathing and cough"
    ],
    diagnostics: [
      "CXR post-insertion: verify tube position (tip directed posteriorly and apically for pneumothorax, posteriorly and basally for effusion/hemothorax), confirm lung re-expansion, identify complications",
      "Chest tube output monitoring: volume per hour, drainage character (serous, serosanguinous, bloody, purulent, chylous)",
      "Air leak assessment: observe water seal chamber for continuous bubbling (ongoing air leak) vs intermittent (small/resolving leak) vs none (sealed)",
      "Digital drainage systems: provide objective air leak quantification (mL/min) and intrapleural pressure trends",
      "Tidaling assessment: fluid oscillation with respiration = patent tube communicating with pleural space; absent tidaling = obstruction, lung re-expansion, or malposition",
      "CT chest: for persistent air leak, retained fluid, tube malposition, or suspected complications",
      "Pleural fluid analysis: if changing character (clear to purulent suggests empyema; milky suggests chylothorax)",
      "Serial CXR: daily while tube in situ to monitor drainage adequacy and lung expansion"
    ],
    management: [
      "Standard suction: -20 cmH2O continuous suction for first 24-48 hours; may convert to water seal after initial drainage and air leak control",
      "Water seal trial before removal: disconnect from suction, observe for 4-24 hours; repeat CXR; if no pneumothorax recurrence and no air leak → remove",
      "Chest tube removal criteria: no air leak for 24 hours, drainage < 200-250 mL/day (< 150 for post-surgical), lung fully expanded on CXR",
      "Removal technique: have patient perform Valsalva or end-expiration breath hold during removal; apply occlusive petroleum gauze dressing immediately",
      "Persistent air leak management: continue chest drainage; consider ambulatory Heimlich valve for small leaks; chemical pleurodesis (talc, doxycycline) or surgical repair (VATS) if leak persists > 5-7 days",
      "Tube obstruction: attempt to clear by gentle milking/stripping; instill 20-30 mL saline via three-way stopcock; replace tube if unable to clear",
      "Retained hemothorax/effusion: if > 300 mL at 72 hours despite chest tube, consider VATS evacuation or intrapleural tPA/DNase (MIST2 protocol)",
      "Pain management: multimodal analgesia (acetaminophen + NSAID + low-dose opioid PRN); intercostal nerve block at insertion site"
    ],
    nursingActions: [
      "Maintain chest drainage system below patient chest level at all times to prevent backflow",
      "Never clamp a chest tube in a patient with an active air leak — clamping prevents air escape and can cause tension pneumothorax",
      "Monitor water seal chamber: bubbling = air leak (document timing: continuous, intermittent, only with cough); tidaling = tube patent",
      "Keep connections secure and taped; ensure all tubing is without kinks or dependent loops that trap fluid",
      "Strip/milk chest tube per institutional protocol (controversial — may generate excessive negative pressure; use gentle approach)",
      "Measure and record drainage output every shift (or hourly if active bleeding) including color and consistency",
      "Assess insertion site: look for crepitus (subcutaneous emphysema), drainage around tube (tube too small or tract leak), erythema/tenderness (infection)",
      "Prepare for tube removal: gather petroleum gauze, occlusive dressing, scissors; coach patient on breathing technique (Valsalva or end-expiration hold)",
      "Post-removal: apply occlusive dressing, observe for 1-4 hours, repeat CXR, monitor for recurrent pneumothorax (dyspnea, decreased breath sounds)",
      "If tube accidentally dislodges: apply occlusive dressing taped on three sides (creates flutter valve — allows air out but not in); prepare for replacement"
    ],
    signs: {
      left: [
        "Chest tube draining appropriately: decreasing output, no air leak, tidaling present",
        "Lung fully re-expanded on CXR with water seal trial successful",
        "Meeting removal criteria: < 200 mL/day, no air leak × 24 hours",
        "Patient comfortable with adequate analgesia and good respiratory effort"
      ],
      right: [
        "Tube obstruction: sudden cessation of drainage with increasing subcutaneous emphysema or respiratory distress",
        "Tube dislodgement: air sucking sound at insertion site, immediate respiratory compromise",
        "Persistent large air leak with failure of lung re-expansion (bronchopleural fistula)",
        "Re-expansion pulmonary edema: sudden cough, dyspnea, pink frothy sputum after large-volume drainage"
      ]
    },
    medications: [
      {
        name: "Intrapleural Fibrinolytic (tPA) for Retained Collections",
        type: "Fibrinolytic",
        action: "Dissolves fibrin septations and loculations in retained pleural fluid collections (hemothorax or complicated effusion), allowing drainage through existing chest tube without need for surgery",
        sideEffects: "Chest pain during instillation, minor bleeding, allergic reaction (rare)",
        contra: "Active pleural hemorrhage, bronchopleural fistula, recent surgery at the chest tube insertion site",
        pearl: "MIST2 protocol: tPA 10 mg + DNase 5 mg in 30 mL NS instilled via chest tube, clamped 1 hour, then unclamped. BID × 3 days. Significantly reduces need for surgical intervention for loculated collections. Order CXR before and after each treatment to assess response."
      },
      {
        name: "Petroleum Gauze (Vaseline Gauze) for Tube Removal",
        type: "Occlusive Wound Dressing",
        action: "Creates an airtight seal over the chest tube insertion site preventing air entry into the pleural space during and immediately after tube removal; petroleum impregnation makes the gauze occlusive",
        sideEffects: "Skin irritation, potential for tension pneumothorax if left too long with developing air leak (ensure follow-up CXR)",
        contra: "None for this indication",
        pearl: "Apply immediately as tube is withdrawn during Valsalva or end-expiratory breath hold. Tape on all four sides for initial 24-48 hours, then replace with standard dressing. Some protocols tape on three sides only (flutter valve effect) as a safety measure if air accumulates. Post-removal CXR in 1-4 hours to exclude pneumothorax."
      }
    ],
    pearls: [
      "NEVER clamp a chest tube in a patient with an active air leak — clamping prevents air escape from the pleural space and can rapidly create a life-threatening tension pneumothorax",
      "If a chest tube accidentally dislodges, immediately apply an occlusive dressing taped on THREE sides (not four) — this creates a flutter valve that allows air to escape during exhalation but prevents entry during inhalation, preventing tension pneumothorax while you prepare for tube replacement",
      "Digital chest drainage systems (Thopaz) provide objective, continuous measurement of air leak in mL/min — this removes the subjective interpretation of 'is it bubbling?' and reduces chest tube duration by enabling earlier, more confident tube removal decisions"
    ],
    quiz: [
      {
        question: "A patient with a chest tube for pneumothorax has had no air leak for 24 hours and CXR shows full lung expansion. The tube is placed on water seal for 6 hours and repeat CXR shows no recurrence. What are the next steps?",
        options: [
          "Continue water seal for 7 more days before removal",
          "Remove the chest tube during patient Valsalva, apply petroleum gauze dressing, and obtain CXR in 1-4 hours",
          "Increase suction to -40 cmH2O to ensure complete resolution",
          "Convert to Heimlich valve and discharge"
        ],
        correct: 1,
        rationale: "The patient meets chest tube removal criteria: no air leak × 24 hours, lung fully expanded, successful water seal trial without recurrence. Removal technique: patient performs Valsalva (or end-expiratory breath hold) while tube is swiftly withdrawn, petroleum gauze applied immediately. Post-removal CXR in 1-4 hours confirms no recurrent pneumothorax. Prolonging drainage unnecessarily increases infection risk and discomfort."
      }
    ]
  }
};
