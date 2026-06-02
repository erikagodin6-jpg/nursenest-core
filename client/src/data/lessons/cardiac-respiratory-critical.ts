import type { LessonContent } from "./types";

export const cardiacRespiratoryCriticalLessons: Record<string, LessonContent> = {
  "cardiac-critical-patterns": {
    title: "Cardiac Critical Patterns",
    cellular: {
      title: "Cardiac Electrophysiology",
      content:
        "Cardiac myocytes generate and conduct electrical impulses through specialized ion channels that control depolarization and repolarization. In STEMI, complete coronary occlusion causes transmural ischemia visible as ST-segment elevation on ECG, with reciprocal ST depression in opposite leads confirming the diagnosis. Arrhythmias arise from disturbances in automaticity, re-entry circuits, or triggered activity within the conduction system. Heart blocks occur when conduction through the AV node or His-Purkinje system is delayed or interrupted, ranging from benign first-degree block to life-threatening third-degree complete heart block requiring emergent pacing."
    },
    riskFactors: [
      "Coronary artery disease and atherosclerosis",
      "Hypertension and left ventricular hypertrophy",
      "Diabetes mellitus and metabolic syndrome",
      "Smoking and sedentary lifestyle",
      "Electrolyte imbalances (hypokalemia, hypomagnesemia)",
      "Family history of sudden cardiac death",
      "Prior myocardial infarction or heart failure",
      "Illicit drug use (cocaine, amphetamines)"
    ],
    diagnostics: [
      "12-lead ECG: ST elevation >=1mm in limb leads or >=2mm in precordial leads in 2+ contiguous leads",
      "Serial troponin I or T levels (rise within 3-6 hours, peak 12-24 hours)",
      "Continuous cardiac monitoring for arrhythmia detection",
      "Echocardiography for wall motion abnormalities and ejection fraction",
      "Chest X-ray for cardiomegaly and pulmonary congestion",
      "Electrolyte panel (potassium, magnesium, calcium)",
      "Coronary angiography for definitive STEMI management"
    ],
    management: [
      "Activate STEMI protocol: door-to-balloon time less than 90 minutes",
      "Dual antiplatelet therapy: aspirin 325mg + P2Y12 inhibitor",
      "Anticoagulation with heparin during PCI",
      "Atrial fibrillation: rate control with beta-blockers or calcium channel blockers",
      "Unstable VT/VF: immediate defibrillation per ACLS algorithm",
      "Symptomatic bradycardia: atropine 0.5mg IV, transcutaneous pacing if unresponsive",
      "Third-degree heart block: emergent transvenous pacemaker",
      "Cardiogenic shock: vasopressors, inotropes, mechanical circulatory support"
    ],
    nursingActions: [
      "Obtain 12-lead ECG within 10 minutes of chest pain onset",
      "Establish two large-bore IV access sites",
      "Administer oxygen only if SpO2 less than 94%",
      "Continuous telemetry monitoring with alarm parameters set",
      "Monitor vital signs every 5-15 minutes during acute phase",
      "Prepare defibrillator and emergency medications at bedside",
      "Document rhythm strips and report changes immediately",
      "Maintain NPO status pending possible catheterization"
    ],
    assessmentFindings: [
      "Chest pain radiating to left arm, jaw, or back",
      "Diaphoresis and pallor",
      "Irregular pulse or bradycardia/tachycardia",
      "Hypotension with signs of poor perfusion",
      "Jugular venous distension in right ventricular involvement",
      "New onset dyspnea or orthopnea",
      "Altered level of consciousness",
      "Cool, clammy extremities"
    ],
    signs: {
      left: [
        "ST elevation in contiguous leads on 12-lead ECG",
        "Reciprocal ST depression in opposite leads",
        "New left bundle branch block pattern",
        "Prolonged PR interval (first-degree block >0.20 seconds)",
        "Progressive PR prolongation with dropped beats (Wenckebach)",
        "Wide QRS with dropped beats (Mobitz Type II)",
        "Complete AV dissociation with escape rhythm (third-degree block)"
      ],
      right: [
        "Ventricular fibrillation: chaotic, disorganized waveform",
        "Ventricular tachycardia: wide QRS complexes >0.12 seconds at rapid rate",
        "Atrial fibrillation: irregularly irregular rhythm with absent P waves",
        "Atrial flutter: sawtooth pattern with regular atrial rate ~300/min",
        "SVT: narrow QRS tachycardia with rate 150-250/min",
        "Asystole: flat line with no electrical activity",
        "PEA: organized electrical activity without palpable pulse"
      ]
    },
    medications: [
      {
        name: "Amiodarone",
        type: "Class III Antiarrhythmic",
        action: "Blocks potassium, sodium, and calcium channels; prolongs action potential duration and refractory period across all cardiac tissue",
        sideEffects: "Pulmonary toxicity, thyroid dysfunction (hypo or hyper), hepatotoxicity, corneal microdeposits, photosensitivity, peripheral neuropathy",
        contra: "Severe sinus node dysfunction, second or third-degree heart block without pacemaker, cardiogenic shock, iodine hypersensitivity",
        pearl: "Amiodarone has an extremely long half-life (40-55 days); effects persist weeks after discontinuation. Monitor thyroid and pulmonary function tests regularly."
      },
      {
        name: "Atropine",
        type: "Anticholinergic",
        action: "Blocks vagal (parasympathetic) stimulation at the SA and AV nodes, increasing heart rate and conduction velocity",
        sideEffects: "Tachycardia, dry mouth, urinary retention, blurred vision, mydriasis, hyperthermia",
        contra: "Narrow-angle glaucoma, obstructive uropathy, myasthenia gravis, tachyarrhythmias",
        pearl: "Dose for symptomatic bradycardia is 0.5mg IV every 3-5 minutes (max 3mg). Doses below 0.5mg may paradoxically worsen bradycardia."
      },
      {
        name: "Aspirin",
        type: "Antiplatelet",
        action: "Irreversibly inhibits cyclooxygenase-1, preventing thromboxane A2 synthesis and platelet aggregation",
        sideEffects: "GI bleeding, tinnitus, bronchospasm in aspirin-sensitive asthma, Reye syndrome in children",
        contra: "Active GI hemorrhage, aspirin allergy, bleeding disorders, children with viral illness",
        pearl: "In suspected STEMI, administer 325mg chewable aspirin immediately. Chewing accelerates absorption by 50% compared to swallowing whole."
      }
    ],
    pearls: [
      "Door-to-balloon time for STEMI must be less than 90 minutes; every 30-minute delay increases mortality by approximately 7.5%.",
      "In Wenckebach (Type I second-degree block), the PR interval progressively lengthens until a QRS is dropped; this is generally benign and often does not require pacing.",
      "Mobitz Type II second-degree block is dangerous because it can progress suddenly to complete heart block without warning; pacemaker is typically indicated.",
      "Atrial fibrillation with rapid ventricular response in Wolff-Parkinson-White syndrome must NOT be treated with AV nodal blocking agents (adenosine, verapamil, digoxin) as this may trigger ventricular fibrillation.",
      "PEA (pulseless electrical activity) requires identification and treatment of reversible causes using the H's and T's mnemonic.",
      "Right ventricular infarction presents with hypotension, clear lungs, and JVD; avoid nitroglycerin and morphine as they reduce preload."
    ],
    lifespan: {
      title: "Age-Related Cardiac Considerations",
      content: "Older adults may present with atypical STEMI symptoms such as dyspnea, confusion, or syncope rather than classic chest pain, leading to delayed recognition. Pediatric arrhythmias are more commonly SVT rather than ventricular arrhythmias. Age-related fibrosis of the conduction system increases susceptibility to heart blocks in elderly patients."
    },
    quiz: [
      {
        question: "A patient presents with acute chest pain. The 12-lead ECG shows ST elevation in leads II, III, and aVF with reciprocal ST depression in leads I and aVL. Which coronary artery is most likely occluded?",
        options: [
          "Left anterior descending artery",
          "Right coronary artery",
          "Left circumflex artery",
          "Left main coronary artery"
        ],
        correct: 1,
        rationale: "ST elevation in leads II, III, and aVF indicates an inferior STEMI, which is most commonly caused by occlusion of the right coronary artery. The left anterior descending supplies the anterior wall, and the circumflex supplies the lateral wall."
      },
      {
        question: "A patient on telemetry shows progressive lengthening of the PR interval followed by a dropped QRS complex. This pattern then repeats. Which type of heart block does this represent?",
        options: [
          "First-degree AV block",
          "Second-degree AV block Type I (Wenckebach)",
          "Second-degree AV block Type II (Mobitz)",
          "Third-degree (complete) AV block"
        ],
        correct: 1,
        rationale: "Progressive PR prolongation followed by a dropped QRS that repeats in a cyclical pattern is the hallmark of second-degree AV block Type I (Wenckebach). This is usually a benign rhythm that often resolves without pacemaker intervention."
      },
      {
        question: "During a cardiac arrest, the monitor shows a flat line in multiple leads. The nurse confirms lead placement and checks in two leads. What is the priority intervention?",
        options: [
          "Defibrillation at 200 joules biphasic",
          "Administer amiodarone 300mg IV push",
          "Begin high-quality CPR and administer epinephrine 1mg IV",
          "Perform synchronized cardioversion at 100 joules"
        ],
        correct: 2,
        rationale: "Asystole is a non-shockable rhythm. The priority is high-quality CPR and epinephrine administration per ACLS protocol. Defibrillation and cardioversion are not indicated for asystole. Amiodarone is used for refractory VF/pulseless VT."
      }
    ]
  },

  "respiratory-critical-patterns": {
    title: "Respiratory Critical Patterns",
    cellular: {
      title: "Pulmonary Pathophysiology in Critical Illness",
      content:
        "Gas exchange occurs at the alveolar-capillary membrane where oxygen diffuses into pulmonary capillary blood and carbon dioxide is eliminated. In pulmonary embolism, thrombus lodges in pulmonary vasculature creating dead space ventilation where alveoli are ventilated but not perfused, causing acute ventilation-perfusion mismatch. ARDS involves diffuse alveolar damage with inflammatory exudate flooding the alveoli, impairing surfactant function and causing refractory hypoxemia. In tension pneumothorax, air accumulates under pressure in the pleural space, compressing the lung and shifting mediastinal structures, obstructing venous return and causing cardiovascular collapse."
    },
    riskFactors: [
      "Deep vein thrombosis and immobility (PE risk)",
      "Sepsis, aspiration, and pneumonia (ARDS triggers)",
      "Prolonged smoking history (COPD)",
      "Known asthma with poor medication adherence",
      "Recent surgery or trauma",
      "Central line placement or mechanical ventilation (pneumothorax risk)",
      "Obesity and hypercoagulable states",
      "History of prior PE or DVT"
    ],
    diagnostics: [
      "Wells criteria scoring for PE probability assessment",
      "D-dimer: high negative predictive value to rule out PE in low-probability patients",
      "CT pulmonary angiography (CTPA): gold standard for PE diagnosis",
      "Arterial blood gas: hypoxemia with respiratory alkalosis (PE), refractory hypoxemia (ARDS)",
      "Berlin criteria for ARDS: acute onset, bilateral opacities on CXR, PaO2/FiO2 ratio classification",
      "Chest X-ray: hyperinflation (COPD), whiteout (ARDS), absent lung markings (pneumothorax)",
      "Peak expiratory flow rate for asthma severity assessment",
      "Bedside ultrasound for pneumothorax and right heart strain"
    ],
    management: [
      "PE: anticoagulation with heparin; massive PE with hemodynamic instability receives systemic tPA",
      "ARDS: lung-protective ventilation with tidal volume 6mL/kg ideal body weight",
      "ARDS: PEEP titration to maintain oxygenation while avoiding barotrauma",
      "ARDS: prone positioning for 12-16 hours daily in moderate-severe cases",
      "COPD exacerbation: inhaled bronchodilators (SABA + ipratropium), systemic corticosteroids, antibiotics if purulent sputum",
      "COPD: NIV/BiPAP for hypercapnic respiratory failure; titrate O2 to SpO2 88-92%",
      "Status asthmaticus: continuous nebulization, IV magnesium sulfate 2g over 20 minutes",
      "Tension pneumothorax: immediate needle decompression at second intercostal space midclavicular line, followed by chest tube"
    ],
    nursingActions: [
      "Monitor respiratory rate, depth, and pattern every 15 minutes during acute decompensation",
      "Apply continuous pulse oximetry and capnography if available",
      "Position patient upright or in tripod position for respiratory distress",
      "Prepare intubation equipment at bedside for impending respiratory failure",
      "Administer prescribed bronchodilators and assess response",
      "Monitor for silent chest in severe asthma as an ominous sign of minimal air movement",
      "Assess bilateral breath sounds after any central line insertion",
      "Document ventilator settings and report plateau pressures above 30 cmH2O"
    ],
    assessmentFindings: [
      "Sudden onset dyspnea with pleuritic chest pain (PE)",
      "Tachypnea, tachycardia, and hypoxemia refractory to supplemental oxygen (ARDS)",
      "Accessory muscle use, pursed-lip breathing, and barrel chest (COPD)",
      "Wheezing progressing to silent chest (severe asthma emergency)",
      "Tracheal deviation away from affected side (tension pneumothorax)",
      "Absent breath sounds on affected side with hyperresonance to percussion",
      "Jugular venous distension with hypotension (obstructive shock from tension pneumothorax)",
      "Cyanosis and altered level of consciousness in late-stage respiratory failure"
    ],
    signs: {
      left: [
        "Acute onset dyspnea with clear lung fields on auscultation (PE)",
        "Bilateral crackles with refractory hypoxemia (ARDS)",
        "Diminished breath sounds with prolonged expiratory phase (COPD)",
        "Diffuse expiratory wheezing progressing to silent chest (asthma)",
        "PaO2/FiO2 ratio less than 300 (mild ARDS), less than 200 (moderate), less than 100 (severe)",
        "Elevated D-dimer with high clinical probability on Wells score"
      ],
      right: [
        "Tracheal deviation to contralateral side (tension pneumothorax)",
        "Absent breath sounds unilaterally with hyperresonance",
        "Subcutaneous emphysema (crepitus) around the neck and chest wall",
        "Hypotension with distended neck veins (obstructive shock)",
        "Hemoptysis with pleuritic chest pain (pulmonary embolism)",
        "Paradoxical breathing pattern indicating diaphragmatic fatigue"
      ]
    },
    medications: [
      {
        name: "Alteplase (tPA)",
        type: "Thrombolytic / Fibrinolytic",
        action: "Converts plasminogen to plasmin, which degrades fibrin clots; used for massive PE with hemodynamic instability",
        sideEffects: "Major hemorrhage including intracranial bleeding, angioedema, reperfusion arrhythmias",
        contra: "Active internal bleeding, recent intracranial surgery or stroke within 3 months, known intracranial neoplasm, uncontrolled hypertension",
        pearl: "For massive PE, alteplase is given as 100mg IV over 2 hours. The decision to use thrombolytics in PE requires documented hemodynamic instability (systolic BP less than 90mmHg)."
      },
      {
        name: "Ipratropium Bromide",
        type: "Anticholinergic Bronchodilator",
        action: "Blocks muscarinic receptors in bronchial smooth muscle, reducing bronchoconstriction and mucus secretion",
        sideEffects: "Dry mouth, urinary retention, blurred vision, paradoxical bronchospasm (rare)",
        contra: "Hypersensitivity to atropine or its derivatives, soy or peanut allergy (some formulations contain soy lecithin)",
        pearl: "In COPD exacerbation, ipratropium is combined with a short-acting beta-2 agonist (albuterol) for synergistic bronchodilation. It has slower onset than albuterol but longer duration."
      },
      {
        name: "Magnesium Sulfate",
        type: "Electrolyte / Bronchodilator Adjunct",
        action: "Relaxes bronchial smooth muscle by inhibiting calcium-mediated contraction; also stabilizes mast cells to reduce mediator release",
        sideEffects: "Hypotension, flushing, muscle weakness, respiratory depression at toxic levels, loss of deep tendon reflexes",
        contra: "Hypermagnesemia, myasthenia gravis, severe renal failure, heart block",
        pearl: "IV magnesium sulfate 2g over 20 minutes is used in severe/life-threatening asthma not responding to initial bronchodilator therapy. Monitor deep tendon reflexes and respiratory rate during infusion."
      }
    ],
    pearls: [
      "In COPD patients, titrate oxygen to SpO2 88-92%; excessive oxygen can suppress hypoxic drive and worsen hypercapnia.",
      "A silent chest in an asthma patient indicates critically reduced airflow and is an ominous sign of impending respiratory arrest; it should never be mistaken for improvement.",
      "Tension pneumothorax is a clinical diagnosis; do not delay treatment for chest X-ray confirmation. Needle decompression is performed at the second intercostal space, midclavicular line.",
      "Wells criteria help stratify PE probability: scores above 4 indicate PE is likely and warrant CTPA; scores of 4 or below with negative D-dimer can effectively rule out PE.",
      "ARDS requires lung-protective ventilation: tidal volume of 6mL/kg ideal body weight and plateau pressure below 30 cmH2O to prevent ventilator-induced lung injury.",
      "Prone positioning in ARDS improves oxygenation by redistributing perfusion to ventilated lung regions and reducing atelectasis in dependent zones."
    ],
    lifespan: {
      title: "Age-Related Respiratory Considerations",
      content: "Elderly patients have reduced respiratory reserve due to decreased chest wall compliance and diminished cough reflex, making them more vulnerable to rapid decompensation. Pediatric patients have smaller airways that are more susceptible to obstruction from edema and secretions. Neonates are obligate nose breathers, so nasal congestion alone can cause significant respiratory distress."
    },
    quiz: [
      {
        question: "A patient with a COPD exacerbation is placed on supplemental oxygen. The nurse should titrate the oxygen to maintain SpO2 at which target range?",
        options: [
          "94-98%",
          "92-96%",
          "88-92%",
          "85-88%"
        ],
        correct: 2,
        rationale: "In COPD patients, the oxygen saturation target is 88-92%. These patients may rely on hypoxic drive for ventilation, and excessive oxygen supplementation can suppress respiratory drive, leading to CO2 retention and worsening respiratory acidosis."
      },
      {
        question: "A patient with severe asthma who was previously wheezing now has a silent chest and appears increasingly lethargic. What is the priority nursing action?",
        options: [
          "Discontinue bronchodilator therapy as wheezing has resolved",
          "Document improvement in respiratory status",
          "Prepare for emergency intubation and notify the physician immediately",
          "Reduce supplemental oxygen to prevent oxygen toxicity"
        ],
        correct: 2,
        rationale: "A silent chest in a previously wheezing asthma patient indicates critically reduced airflow and impending respiratory arrest. This is an ominous deterioration, not improvement. The nurse must prepare for emergency intubation and escalate care immediately."
      },
      {
        question: "A patient develops sudden-onset dyspnea, hypotension, tracheal deviation to the left, absent breath sounds on the right, and distended neck veins after central line placement. What is the priority intervention?",
        options: [
          "Obtain a stat chest X-ray",
          "Administer IV normal saline bolus",
          "Perform needle decompression of the right chest",
          "Position the patient in left lateral decubitus position"
        ],
        correct: 2,
        rationale: "This presentation is classic for right-sided tension pneumothorax (absent breath sounds on right, tracheal deviation to left, hypotension, JVD). Needle decompression at the second intercostal space, midclavicular line on the affected side is the immediate life-saving intervention. Do not delay for imaging."
      }
    ]
  },

  "cardiopulm-critical-np": {
    title: "Cardiopulmonary Critical Patterns",
    cellular: {
      title: "Cardiopulmonary Pathophysiology",
      content:
        "Acute coronary syndrome encompasses a spectrum from unstable angina to NSTEMI and STEMI, differentiated by the degree of coronary occlusion and resultant myocardial injury. In STEMI, complete thrombotic occlusion requires emergent reperfusion through PCI or fibrinolysis, while NSTEMI management involves risk stratification using TIMI or GRACE scores to determine timing of invasive strategy. Atrial fibrillation results from multiple re-entrant wavelets or focal triggers in the pulmonary veins, leading to atrial electrical disorganization and loss of coordinated atrial contraction, which increases thromboembolic risk proportional to CHA2DS2-VASc score. Heart failure exacerbations involve neurohormonal activation with increased RAAS and sympathetic tone causing sodium and water retention, elevated filling pressures, and end-organ hypoperfusion that requires careful hemodynamic-guided management."
    },
    riskFactors: [
      "Established coronary artery disease with prior ACS events",
      "Uncontrolled atrial fibrillation with inadequate anticoagulation",
      "Reduced ejection fraction heart failure (HFrEF) with NYHA Class III-IV symptoms",
      "Recurrent venous thromboembolism despite anticoagulation",
      "COPD with frequent exacerbations (GOLD Group E)",
      "Severe persistent asthma with oral corticosteroid dependence",
      "Multiple comorbidities including diabetes, CKD, and obesity",
      "Medication non-adherence to guideline-directed medical therapy"
    ],
    diagnostics: [
      "High-sensitivity troponin with serial measurements for ACS risk stratification",
      "TIMI and GRACE scores for NSTEMI risk assessment and invasive strategy timing",
      "CHA2DS2-VASc score for stroke risk stratification in atrial fibrillation",
      "BNP or NT-proBNP for heart failure diagnosis and prognostication",
      "Echocardiography for ejection fraction, valvular assessment, and hemodynamic parameters",
      "sPESI score for PE risk stratification and outpatient management eligibility",
      "CT pulmonary angiography with RV/LV ratio for submassive PE identification",
      "Spirometry with bronchodilator reversibility for COPD staging per GOLD criteria",
      "FeNO (fractional exhaled nitric oxide) for eosinophilic asthma phenotyping"
    ],
    management: [
      "STEMI: primary PCI preferred over fibrinolysis when available within 120 minutes of first medical contact",
      "STEMI: fibrinolysis with tenecteplase if PCI not available within 120 minutes; transfer for rescue PCI if failed reperfusion",
      "Dual antiplatelet therapy: aspirin plus ticagrelor or prasugrel for 12 months post-ACS",
      "Beta-blocker initiation within 24 hours if hemodynamically stable post-MI; avoid in cardiogenic shock",
      "ACE inhibitor or ARB initiation within 24 hours for anterior STEMI or EF less than 40%",
      "High-intensity statin loading: atorvastatin 80mg regardless of baseline lipid levels",
      "AF rate control: target resting heart rate less than 110 bpm with beta-blocker or diltiazem; rhythm control with amiodarone or cardioversion if symptomatic",
      "AF anticoagulation: DOAC preferred over warfarin (apixaban, rivaroxaban, dabigatran, edoxaban) based on CHA2DS2-VASc score of 2 or greater",
      "HF exacerbation: IV furosemide at 1-2x home oral dose; add metolazone for diuretic resistance",
      "HF discharge optimization: GDMT with beta-blocker, ACEi/ARB/ARNI, MRA, and SGLT2 inhibitor",
      "Submassive PE: systemic anticoagulation with monitoring; consider catheter-directed therapy for RV dysfunction",
      "COPD: stepwise inhaler therapy per GOLD (LABA + LAMA, add ICS if eosinophils >300)",
      "Asthma stepwise management per GINA: assess biologic eligibility for severe eosinophilic or allergic phenotypes"
    ],
    nursingActions: [
      "Perform comprehensive hemodynamic assessment including cardiac output parameters",
      "Monitor for reperfusion indicators post-PCI or fibrinolysis (pain resolution, ST-segment normalization, reperfusion arrhythmias)",
      "Titrate IV nitroglycerin and vasodilators based on blood pressure and symptom response",
      "Assess daily weights and strict intake/output for heart failure volume status",
      "Educate patient on DOAC adherence including missed dose protocols",
      "Monitor INR if patient on warfarin; educate on dietary vitamin K consistency",
      "Coordinate multidisciplinary discharge planning including cardiac rehabilitation referral",
      "Educate on inhaler technique and provide spacer for metered-dose inhalers"
    ],
    assessmentFindings: [
      "Persistent chest pain at rest with dynamic ECG changes (ACS)",
      "Irregularly irregular pulse with variable heart rate (atrial fibrillation)",
      "Bilateral crackles, S3 gallop, elevated JVP, and peripheral edema (HF exacerbation)",
      "Dyspnea with tachycardia disproportionate to clinical picture (PE)",
      "Increased sputum production with purulence and worsening dyspnea (COPD exacerbation)",
      "Nocturnal awakenings, exercise limitation, and rescue inhaler overuse (uncontrolled asthma)"
    ],
    signs: {
      left: [
        "Dynamic ST-segment and T-wave changes on serial ECGs (NSTEMI)",
        "Elevated troponin with rise and fall pattern indicating myocardial injury",
        "Irregularly irregular rhythm with fibrillatory baseline on ECG (AF)",
        "CHA2DS2-VASc score of 2 or greater indicating need for anticoagulation",
        "Elevated BNP greater than 400 pg/mL supporting acute HF diagnosis",
        "Reduced ejection fraction below 40% on echocardiography"
      ],
      right: [
        "RV dilation with RV/LV ratio greater than 0.9 on CT indicating submassive PE",
        "sPESI score of 0 qualifying for potential outpatient PE management",
        "FEV1/FVC ratio less than 0.70 post-bronchodilator confirming COPD diagnosis",
        "GOLD classification determining stepwise inhaler therapy approach",
        "Elevated FeNO suggesting eosinophilic airway inflammation in asthma",
        "GINA step 4-5 therapy with ongoing symptoms suggesting biologic eligibility"
      ]
    },
    medications: [
      {
        name: "Apixaban",
        type: "Direct Oral Anticoagulant (Factor Xa Inhibitor)",
        action: "Selectively and reversibly inhibits free and clot-bound factor Xa, interrupting the coagulation cascade and preventing thrombin generation",
        sideEffects: "Bleeding (GI, intracranial), anemia, bruising, hepatotoxicity (rare)",
        contra: "Active pathological bleeding, severe hepatic disease with coagulopathy, prosthetic heart valves, triple-positive antiphospholipid syndrome",
        pearl: "Apixaban has the lowest GI bleeding risk among DOACs and does not require dose adjustment for renal function until CrCl is less than 25 mL/min. It is reversed with andexanet alfa."
      },
      {
        name: "Sacubitril/Valsartan (ARNI)",
        type: "Angiotensin Receptor-Neprilysin Inhibitor",
        action: "Sacubitril inhibits neprilysin, increasing natriuretic peptides that promote vasodilation and natriuresis; valsartan blocks AT1 receptors, reducing aldosterone secretion and vasoconstriction",
        sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment, dizziness",
        contra: "History of angioedema with ACEi or ARB, concurrent ACEi use (36-hour washout required), pregnancy, severe hepatic impairment",
        pearl: "ARNI replaces ACEi/ARB in HFrEF and reduces cardiovascular mortality by 20% compared to enalapril (PARADIGM-HF trial). A 36-hour washout from ACEi is mandatory before initiation to prevent angioedema."
      },
      {
        name: "Ticagrelor",
        type: "P2Y12 Receptor Antagonist (Antiplatelet)",
        action: "Reversibly binds and inhibits the P2Y12 ADP receptor on platelets, preventing platelet activation and aggregation",
        sideEffects: "Bleeding, dyspnea (common, usually self-limiting), bradyarrhythmias, elevated uric acid",
        contra: "Active bleeding, history of intracranial hemorrhage, severe hepatic impairment, concurrent strong CYP3A4 inhibitors",
        pearl: "Ticagrelor requires twice-daily dosing unlike clopidogrel. Aspirin dose must not exceed 100mg daily when combined with ticagrelor, as higher aspirin doses reduce its effectiveness."
      },
      {
        name: "Dapagliflozin",
        type: "SGLT2 Inhibitor",
        action: "Inhibits sodium-glucose cotransporter 2 in the proximal tubule, reducing glucose reabsorption and causing osmotic diuresis; provides cardioprotective and renoprotective effects independent of glucose lowering",
        sideEffects: "Genital mycotic infections, urinary tract infections, volume depletion, euglycemic diabetic ketoacidosis (rare), Fournier gangrene (rare)",
        contra: "Type 1 diabetes, severe renal impairment (eGFR less than 20 for HF indication varies by guideline), dialysis, history of DKA",
        pearl: "SGLT2 inhibitors are now a pillar of HFrEF management regardless of diabetes status, reducing HF hospitalizations by approximately 25%. Hold before major surgery and during acute illness to prevent euglycemic DKA."
      }
    ],
    pearls: [
      "PCI is preferred over fibrinolysis for STEMI when available within 120 minutes of first medical contact; fibrinolysis is the fallback when transfer time exceeds this window.",
      "CHA2DS2-VASc scoring guides anticoagulation in AF: scores of 0 in males or 1 in females may not require anticoagulation; scores of 2 or greater warrant DOAC therapy.",
      "In HFrEF, the four pillars of GDMT are beta-blocker, ACEi/ARB/ARNI, MRA (spironolactone/eplerenone), and SGLT2 inhibitor; all should be initiated and titrated to target doses.",
      "sPESI score of 0 identifies low-risk PE patients who may be candidates for outpatient management with anticoagulation alone.",
      "GOLD Group E (formerly C and D) exacerbators benefit from LABA + LAMA combination; add ICS only if blood eosinophils exceed 300 cells/microL.",
      "GINA Step 5 includes biologic add-on therapy: anti-IgE (omalizumab) for allergic asthma, anti-IL5 (mepolizumab, benralizumab) for eosinophilic asthma."
    ],
    lifespan: {
      title: "Advanced Practice Across the Lifespan",
      content: "Elderly patients with ACS require careful dose adjustment of antiplatelet and anticoagulant medications due to increased bleeding risk. DOAC selection in older adults should account for renal function decline; apixaban is often preferred due to its favorable bleeding profile. Heart failure management in geriatric patients must balance GDMT optimization with fall risk from hypotension. COPD and asthma management in older adults is complicated by comorbid cardiovascular disease that may limit beta-agonist use."
    },
    quiz: [
      {
        question: "A patient with atrial fibrillation has a CHA2DS2-VASc score of 3. The clinician is selecting an anticoagulant. Which factor most strongly favors apixaban over other DOACs in this patient?",
        options: [
          "The patient has a history of mechanical heart valve replacement",
          "The patient has a history of significant GI bleeding",
          "The patient is currently on dual antiplatelet therapy",
          "The patient has moderate hepatic impairment with coagulopathy"
        ],
        correct: 1,
        rationale: "Apixaban has the lowest GI bleeding risk among DOACs based on clinical trial data, making it the preferred choice in patients with GI bleeding history. Mechanical valves are a contraindication to all DOACs. Severe hepatic impairment with coagulopathy contraindicates DOACs."
      },
      {
        question: "An NP is initiating sacubitril/valsartan (ARNI) for a patient with HFrEF who was previously on enalapril. What is the required washout period before starting the ARNI?",
        options: [
          "12 hours",
          "24 hours",
          "36 hours",
          "72 hours"
        ],
        correct: 2,
        rationale: "A 36-hour washout period from ACE inhibitors is required before initiating sacubitril/valsartan to reduce the risk of angioedema. Concurrent use of ARNI and ACEi is contraindicated because neprilysin inhibition combined with ACE inhibition significantly increases bradykinin levels."
      },
      {
        question: "A patient presents with acute PE. CT angiography shows RV/LV ratio of 1.2 and the patient is hemodynamically stable with systolic BP of 105 mmHg. How should this PE be classified and managed?",
        options: [
          "Massive PE requiring systemic thrombolysis with tPA",
          "Submassive PE requiring systemic anticoagulation with consideration of catheter-directed therapy",
          "Low-risk PE eligible for outpatient anticoagulation management",
          "Chronic thromboembolic PE requiring pulmonary endarterectomy"
        ],
        correct: 1,
        rationale: "An RV/LV ratio greater than 0.9 with hemodynamic stability defines submassive PE. Management includes systemic anticoagulation with close monitoring and consideration of catheter-directed therapy for RV dysfunction. Massive PE requires hemodynamic instability (SBP less than 90). sPESI of 0 without RV strain would qualify as low-risk."
      }
    ]
  }
};
