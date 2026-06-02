import type { LessonContent } from "./types";

export const npCvContent: Record<string, LessonContent> = {
  "hf-advanced-np": {
    title: "Heart Failure: Neurohormonal Blockade",
    cellular: {
      title: "Neurohormonal Pathophysiology of Heart Failure",
      content: "Heart failure triggers compensatory neurohormonal activation that becomes maladaptive over time. Reduced cardiac output activates the sympathetic nervous system (SNS), increasing norepinephrine release, heart rate, and systemic vascular resistance. Simultaneously, decreased renal perfusion activates the renin-angiotensin-aldosterone system (RAAS): renin cleaves angiotensinogen to angiotensin I, which ACE converts to angiotensin II — a potent vasoconstrictor that stimulates aldosterone secretion, promoting sodium and water retention. Angiotensin II also induces myocardial hypertrophy and fibrosis via AT1 receptor activation. Elevated aldosterone causes further myocardial collagen deposition and endothelial dysfunction. BNP and NT-proBNP are released from stretched ventricular cardiomyocytes as counter-regulatory natriuretic peptides. The four pillars of guideline-directed medical therapy (GDMT) — ARNI/ACEi/ARB, beta-blockers, MRA, and SGLT2 inhibitors — each target specific points in this neurohormonal cascade."
    },
    riskFactors: [
      "Coronary artery disease (accounts for ~60% of systolic HF cases)",
      "Longstanding uncontrolled hypertension causing LV hypertrophy and diastolic dysfunction",
      "Valvular heart disease (especially aortic stenosis and mitral regurgitation)",
      "Diabetes mellitus — diabetic cardiomyopathy via AGE accumulation and microvascular disease",
      "Cardiotoxic agents: anthracyclines (doxorubicin), trastuzumab, heavy alcohol use (> 90 g/day for > 5 years)",
      "Familial/genetic cardiomyopathy (TTN, LMNA, MYH7 mutations)",
      "Chronic tachyarrhythmias (tachycardia-mediated cardiomyopathy)",
      "Obesity (BMI > 30) with associated metabolic syndrome"
    ],
    diagnostics: [
      "NT-proBNP (> 300 pg/mL supports HF diagnosis; > 900 pg/mL in age > 75) or BNP > 100 pg/mL",
      "Transthoracic echocardiogram: LVEF, wall motion abnormalities, diastolic function (E/e'), valvular assessment",
      "12-lead ECG: Q waves (prior MI), LBBB (CRT candidacy if QRS > 150 ms), atrial fibrillation",
      "CXR: cardiomegaly (CTR > 0.5), cephalization of vessels, Kerley B lines, pleural effusions",
      "BMP: sodium (dilutional hyponatremia), potassium (RAAS therapy monitoring), creatinine/eGFR",
      "Iron studies: ferritin < 100 or ferritin 100-300 with TSAT < 20% indicates IV iron candidacy",
      "Cardiac MRI for etiology when echo is inconclusive (myocarditis, infiltrative disease, sarcoidosis)",
      "Right heart catheterization for hemodynamic assessment in advanced HF or transplant evaluation"
    ],
    management: [
      "Initiate all four GDMT pillars simultaneously or in rapid sequence: sacubitril/valsartan (or ACEi/ARB), evidence-based beta-blocker, MRA, SGLT2 inhibitor",
      "Target sacubitril/valsartan 97/103 mg BID (start 24/26 mg BID if ACEi-naive; 36-hour washout from ACEi required)",
      "Uptitrate carvedilol to 25 mg BID (50 mg BID if > 85 kg) or metoprolol succinate to 200 mg daily",
      "Add spironolactone 25-50 mg daily or eplerenone 25-50 mg daily (monitor K+ and creatinine at 1 and 4 weeks)",
      "Start dapagliflozin 10 mg or empagliflozin 10 mg daily regardless of diabetes status",
      "Prescribe IV ferric carboxymaltose if iron deficiency present (AFFIRM-AHF trial evidence)",
      "Evaluate CRT-D if LVEF <= 35%, LBBB with QRS >= 150 ms, NYHA II-IV on optimal GDMT",
      "Refer to advanced HF specialist for LVEF <= 25%, recurrent hospitalizations, or need for mechanical support/transplant evaluation"
    ],
    nursingActions: [
      "Assess volume status: daily weights, JVP, peripheral edema, lung auscultation for crackles, orthopnea",
      "Monitor hemodynamic response to GDMT uptitration: HR, BP (target SBP > 90 mmHg), symptoms",
      "Track I&O with sodium restriction (< 2 g/day) and fluid restriction (< 1.5 L/day) in hyponatremic patients",
      "Perform medication reconciliation at each visit ensuring all four GDMT pillars are prescribed and at target doses",
      "Educate patient on HF zone management: green (stable), yellow (weight gain > 2 lb overnight or > 5 lb/week), red (severe dyspnea, chest pain)",
      "Screen for depression (PHQ-9) and cognitive impairment — common HF comorbidities affecting self-care",
      "Coordinate multidisciplinary HF clinic: cardiology, pharmacy, dietitian, social work, palliative care",
      "Ensure influenza, pneumococcal, COVID-19 vaccinations are current"
    ],
    signs: {
      left: [
        "NYHA Class I-II: dyspnea with moderate exertion, no rest symptoms",
        "S3 gallop (LV volume overload), displaced PMI (cardiomegaly)",
        "Bibasilar crackles on lung auscultation",
        "Peripheral edema (1+ to 2+ pitting)"
      ],
      right: [
        "NYHA Class IV: dyspnea at rest, orthopnea, PND",
        "Cardiogenic shock: SBP < 90, altered mentation, cool extremities, lactate > 2.0",
        "Anasarca, hepatic congestion with elevated AST/ALT, ascites",
        "Cheyne-Stokes respirations indicating severe low output"
      ]
    },
    medications: [
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "Angiotensin Receptor-Neprilysin Inhibitor (ARNI)",
        action: "Sacubitril inhibits neprilysin, increasing natriuretic peptides (ANP, BNP), promoting vasodilation and natriuresis; valsartan blocks AT1 receptors reducing vasoconstriction and aldosterone",
        sideEffects: "Hypotension, hyperkalemia, angioedema (rare), dizziness, renal impairment",
        contra: "Concurrent ACEi use (36-hour washout required), history of ACEi-related angioedema, pregnancy, bilateral renal artery stenosis",
        pearl: "PARADIGM-HF showed 20% reduction in CV death and HF hospitalization vs enalapril. Start low and uptitrate every 2-4 weeks. Monitor K+ and creatinine."
      },
      {
        name: "Dapagliflozin (Forxiga) / Empagliflozin (Jardiance)",
        type: "SGLT2 Inhibitor",
        action: "Blocks sodium-glucose cotransporter 2 in proximal tubule, promoting glycosuria, natriuresis, osmotic diuresis, and reducing preload; also improves cardiac metabolism and reduces inflammation/fibrosis",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare), Fournier gangrene (rare)",
        contra: "Type 1 diabetes, eGFR < 20 mL/min (for initiation), dialysis",
        pearl: "DAPA-HF and EMPEROR-Reduced showed benefit regardless of diabetes status. Can be started even during HF hospitalization (EMPULSE trial). Fourth pillar of GDMT."
      }
    ],
    pearls: [
      "All four pillars of GDMT should be initiated simultaneously or in rapid sequence — 'start low, go slow' but don't delay any pillar waiting for target doses of another",
      "NT-proBNP is more reliable than BNP in patients on sacubitril/valsartan because neprilysin inhibition increases BNP levels but not NT-proBNP",
      "Approximately 50% of HF patients have iron deficiency even without anemia — always check ferritin and TSAT as IV iron improves symptoms and reduces hospitalizations"
    ],
    quiz: [
      {
        question: "A 68-year-old with LVEF 28% and NYHA Class III HF is currently on lisinopril 20 mg BID. The NP wants to transition to sacubitril/valsartan. What is the required step before initiating?",
        options: [
          "Reduce lisinopril dose to 10 mg daily for 1 week",
          "Discontinue lisinopril and wait 36 hours before starting sacubitril/valsartan",
          "Start sacubitril/valsartan immediately alongside lisinopril",
          "Switch directly from lisinopril to valsartan alone first"
        ],
        correct: 1,
        rationale: "A 36-hour ACEi washout is required before starting sacubitril/valsartan to prevent angioedema from concurrent ACEi and neprilysin inhibition. This is a critical safety step that cannot be skipped."
      }
    ]
  },
  "afib-management-np": {
    title: "Atrial Fibrillation: Rate vs Rhythm Control",
    cellular: {
      title: "Electrophysiology of Atrial Fibrillation",
      content: "Atrial fibrillation results from disorganized atrial electrical activity driven by triggers (often ectopic foci from pulmonary veins) and substrate (atrial fibrosis, dilation, and electrical remodeling). Structural remodeling from hypertension, valvular disease, or HF causes atrial fibrosis, creating slow conduction zones that support re-entrant wavelets. Electrical remodeling shortens atrial refractory periods ('AF begets AF'). The irregular, rapid atrial rate (350-600 bpm) is filtered by the AV node, producing irregular ventricular response. Loss of atrial contraction ('atrial kick') reduces cardiac output by 15-25%. Stasis in the left atrial appendage promotes thrombus formation, increasing stroke risk 5-fold. CHA₂DS₂-VASc score stratifies thromboembolic risk, guiding anticoagulation decisions."
    },
    riskFactors: [
      "Hypertension (most common modifiable risk factor, present in ~60% of AF patients)",
      "Heart failure — both a cause and consequence of AF; shared pathophysiology",
      "Valvular heart disease especially mitral stenosis and regurgitation",
      "Obstructive sleep apnea (intermittent hypoxia and atrial stretch)",
      "Obesity (BMI > 30 increases AF risk by 50%; epicardial fat inflammation)",
      "Hyperthyroidism — thyroid hormone increases atrial automaticity",
      "Binge alcohol consumption ('holiday heart syndrome')",
      "Age > 65 years (prevalence ~10% in those > 80)"
    ],
    diagnostics: [
      "12-lead ECG: absent P waves, irregularly irregular R-R intervals, fibrillatory baseline",
      "CHA₂DS₂-VASc score calculation for stroke risk stratification (anticoagulate if >= 2 in males, >= 3 in females)",
      "HAS-BLED score for bleeding risk assessment (does not contraindicate anticoagulation but identifies modifiable risks)",
      "Transthoracic echocardiogram: LA size, LV function, valvular disease, wall motion abnormalities",
      "TSH to rule out hyperthyroidism as reversible cause",
      "CBC, CMP, coagulation studies; BNP if HF suspected",
      "Transesophageal echocardiography (TEE) to rule out LAA thrombus before cardioversion if AF > 48 hours without adequate anticoagulation",
      "Ambulatory ECG monitoring (Holter or event recorder) for paroxysmal AF detection"
    ],
    management: [
      "Rate control first-line for most patients: target resting HR < 110 bpm (RACE II trial) or < 80 bpm if symptomatic",
      "Rate control agents: metoprolol 25-200 mg BID, diltiazem 120-360 mg daily (avoid in HFrEF), digoxin for sedentary patients",
      "Rhythm control preferred if: symptomatic despite rate control, young patients, AF with HFrEF, early AF (< 1 year), or patient preference",
      "Pharmacological cardioversion: amiodarone IV (150 mg bolus then drip) for structural heart disease; flecainide 'pill-in-pocket' for lone AF",
      "Anticoagulation with DOAC (apixaban 5 mg BID, rivaroxaban 20 mg daily, dabigatran 150 mg BID) preferred over warfarin for non-valvular AF",
      "Refer for catheter ablation (pulmonary vein isolation) for drug-refractory symptomatic AF or as first-line rhythm control",
      "Address modifiable risk factors: weight loss (10% reduces AF burden by 50%), OSA treatment, alcohol cessation, BP control",
      "LAA occlusion (Watchman device) for patients with contraindication to long-term anticoagulation"
    ],
    nursingActions: [
      "Assess hemodynamic stability: if unstable (hypotension, ACS, pulmonary edema), prepare for immediate synchronized cardioversion",
      "Monitor HR and rhythm continuously during rate/rhythm control medication titration",
      "Verify anticoagulation compliance and duration before cardioversion (minimum 3 weeks therapeutic anticoagulation or TEE to exclude LAA thrombus)",
      "Educate on stroke risk and importance of DOAC adherence — missed doses increase thromboembolic risk",
      "Teach pulse self-assessment technique for early detection of AF recurrence",
      "Screen for bleeding complications: GI bleeding, intracranial hemorrhage symptoms, easy bruising",
      "Coordinate cardiology follow-up for rhythm monitoring and medication adjustment",
      "Counsel on alcohol moderation, caffeine intake, and sleep apnea screening"
    ],
    signs: {
      left: [
        "Palpitations with irregular pulse",
        "Mild fatigue and exercise intolerance",
        "Adequate rate control (HR 60-110 at rest)",
        "Normal hemodynamics with stable BP"
      ],
      right: [
        "Rapid ventricular response (HR > 150) with hemodynamic instability",
        "Acute HF exacerbation: flash pulmonary edema, severe dyspnea",
        "Cardioembolic stroke: sudden focal neurological deficit",
        "Tachycardia-mediated cardiomyopathy (declining LVEF)"
      ]
    },
    medications: [
      {
        name: "Apixaban (Eliquis)",
        type: "Direct Oral Anticoagulant (Factor Xa Inhibitor)",
        action: "Selectively inhibits factor Xa, blocking thrombin generation and fibrin clot formation without requiring antithrombin as cofactor",
        sideEffects: "Bleeding (GI, intracranial, epistaxis), bruising, anemia",
        contra: "Active pathological bleeding, prosthetic heart valve (mechanical), severe hepatic disease, CrCl < 15 mL/min",
        pearl: "ARISTOTLE showed superiority to warfarin for stroke prevention with less bleeding. Reduce to 2.5 mg BID if 2 of 3: age >= 80, weight <= 60 kg, Cr >= 1.5 mg/dL. Reversal agent: andexanet alfa."
      },
      {
        name: "Amiodarone",
        type: "Class III Antiarrhythmic (multichannel blocker)",
        action: "Blocks potassium, sodium, and calcium channels plus beta-adrenergic receptors; prolongs action potential duration and refractory period",
        sideEffects: "Pulmonary toxicity (pneumonitis/fibrosis), thyroid dysfunction (hypo/hyper), hepatotoxicity, corneal microdeposits, photosensitivity, peripheral neuropathy",
        contra: "Severe sinus node dysfunction, 2nd/3rd degree heart block (without pacemaker), cardiogenic shock, iodine allergy",
        pearl: "Only antiarrhythmic safe in structural heart disease/HF. Requires baseline PFTs, TFTs, LFTs, eye exam with q6-month monitoring. Very long half-life (40-55 days). Multiple drug interactions via CYP3A4 and CYP2C9."
      }
    ],
    pearls: [
      "The EAST-AFNET 4 trial showed early rhythm control (within 1 year of AF diagnosis) reduces cardiovascular events by 21% compared to rate control — paradigm is shifting toward earlier intervention",
      "CHA₂DS₂-VASc score should be calculated at every visit: C-CHF(1), H-HTN(1), A₂-Age>=75(2), D-DM(1), S₂-Prior stroke/TIA(2), V-Vascular disease(1), A-Age 65-74(1), Sc-Female sex(1)",
      "DOACs do not require routine INR monitoring but renal function should be checked at baseline and at least annually — apixaban has the lowest renal clearance (~25%) making it safest in CKD"
    ],
    quiz: [
      {
        question: "A 72-year-old with hypertension, diabetes, and newly diagnosed atrial fibrillation has a CHA₂DS₂-VASc score of 4. Which anticoagulation strategy is most appropriate?",
        options: [
          "ASA 81 mg daily alone",
          "Apixaban 5 mg BID",
          "Warfarin with target INR 2-3",
          "No anticoagulation needed — use rate control only"
        ],
        correct: 1,
        rationale: "CHA₂DS₂-VASc >= 2 in males warrants anticoagulation. DOACs (apixaban) are preferred over warfarin for non-valvular AF per current guidelines due to superior efficacy, lower bleeding risk, and no INR monitoring requirement. ASA alone is insufficient for stroke prevention in AF."
      }
    ]
  },
  "hypertensive-emergency-np": {
    title: "Hypertensive Emergency: End-Organ Damage",
    cellular: {
      title: "Vascular Pathophysiology of Hypertensive Emergency",
      content: "Hypertensive emergency occurs when severe BP elevation (typically SBP > 180 and/or DBP > 120 mmHg) causes acute end-organ damage. The pathophysiology involves failure of cerebral autoregulation, endothelial injury, and fibrinoid necrosis of arterioles. Normally, cerebral blood flow remains constant across MAP 60-150 mmHg through myogenic vasoconstriction and dilation. When BP exceeds the upper autoregulatory limit, forced vasodilation occurs, causing cerebral edema (hypertensive encephalopathy) or hemorrhagic stroke. In the kidneys, afferent arteriolar damage causes thrombotic microangiopathy, acute kidney injury, and microangiopathic hemolytic anemia. Cardiac end-organ damage manifests as acute HF, pulmonary edema, or ACS from increased afterload and myocardial oxygen demand exceeding supply."
    },
    riskFactors: [
      "Non-adherence to antihypertensive medications (most common precipitant)",
      "Chronic kidney disease with fluid overload",
      "Renovascular disease (renal artery stenosis)",
      "Pheochromocytoma or other catecholamine-secreting tumors",
      "Cocaine, amphetamine, or sympathomimetic drug use",
      "Preeclampsia/eclampsia in pregnancy",
      "Abrupt clonidine or beta-blocker withdrawal (rebound hypertension)",
      "Concomitant MAOI therapy with tyramine-containing foods"
    ],
    diagnostics: [
      "Serial BP measurement in both arms (use appropriately sized cuff); intra-arterial monitoring if available",
      "Fundoscopic exam: retinal hemorrhages, exudates, papilledema (grade III-IV hypertensive retinopathy)",
      "Serum creatinine and BUN (AKI), urinalysis (proteinuria, hematuria, RBC casts)",
      "CBC with peripheral smear for schistocytes (thrombotic microangiopathy), LDH, haptoglobin",
      "Troponin I/T and 12-lead ECG (ACS, LVH with strain pattern)",
      "CT head without contrast if neurological symptoms (hemorrhagic stroke, edema)",
      "CXR for pulmonary edema; BNP if acute HF suspected",
      "Urine drug screen for cocaine/amphetamine if clinical suspicion"
    ],
    management: [
      "Admit to ICU with continuous arterial BP monitoring for hypertensive emergency",
      "Reduce MAP by no more than 25% in the first hour, then to 160/100 over next 2-6 hours to avoid watershed ischemia",
      "Nicardipine IV infusion 5-15 mg/hr — first-line for most hypertensive emergencies (predictable, titratable)",
      "Clevidipine IV 1-2 mg/hr (max 32 mg/hr) — ultra-short acting, ideal for perioperative hypertension",
      "Labetalol IV 20 mg bolus then 0.5-2 mg/min infusion for aortic dissection (target HR < 60, SBP < 120)",
      "Nitroprusside IV 0.3-10 mcg/kg/min — reserved for refractory cases (monitor cyanide/thiocyanate levels after 48 hrs)",
      "For eclampsia: IV magnesium sulfate 4-6 g bolus then 1-2 g/hr; hydralazine or labetalol for BP control",
      "Transition to oral antihypertensives once target BP achieved and stable for 6-12 hours"
    ],
    nursingActions: [
      "Establish continuous cardiac monitoring and intra-arterial BP line if available",
      "Titrate IV antihypertensive infusion per protocol with q5-15 min BP checks during active titration",
      "Perform and document serial neurological assessments (GCS, pupillary response, focal deficits)",
      "Monitor urine output (target > 0.5 mL/kg/hr) and trend creatinine for AKI progression",
      "Assess for signs of over-treatment: dizziness, confusion, worsening renal function (ischemia from too-rapid BP reduction)",
      "Obtain serial troponins q6h if ACS is suspected end-organ damage",
      "Evaluate and address underlying precipitant: medication non-adherence, substance use, renovascular disease",
      "Plan oral antihypertensive bridge before IV wean; ensure outpatient follow-up within 72 hours of discharge"
    ],
    signs: {
      left: [
        "Severe headache with BP > 180/120 but no end-organ damage (hypertensive urgency)",
        "Mild visual changes without papilledema",
        "Anxiety and mild epistaxis",
        "Elevated BP responsive to oral medications within 24-48 hours"
      ],
      right: [
        "Hypertensive encephalopathy: confusion, seizures, papilledema, cortical blindness",
        "Acute pulmonary edema with severe dyspnea and hypoxia",
        "AKI with oliguria, hematuria, rising creatinine",
        "Aortic dissection: tearing chest/back pain, BP differential between arms, widened mediastinum"
      ]
    },
    medications: [
      {
        name: "Nicardipine IV",
        type: "Dihydropyridine Calcium Channel Blocker",
        action: "Selectively blocks L-type calcium channels in vascular smooth muscle, causing arterial vasodilation and reducing SVR without significant negative inotropy or chronotropy",
        sideEffects: "Reflex tachycardia, headache, nausea, phlebitis at infusion site, peripheral edema",
        contra: "Advanced aortic stenosis; use caution in acute HF with severe systolic dysfunction",
        pearl: "Preferred first-line IV agent for most hypertensive emergencies. Onset 5-15 min, duration 4-6 hours. Does not raise ICP (safe in neurological emergencies). Infuse through central line or large-bore peripheral IV."
      },
      {
        name: "Labetalol IV",
        type: "Combined Alpha-1 and Non-selective Beta Blocker",
        action: "Blocks alpha-1 receptors (vasodilation) and beta-1/beta-2 receptors (reduces HR and contractility); alpha:beta blockade ratio is 1:7 IV",
        sideEffects: "Bradycardia, bronchospasm, heart block, orthostatic hypotension, scalp tingling",
        contra: "Asthma/severe COPD, 2nd/3rd degree heart block, cardiogenic shock, cocaine use (unopposed alpha stimulation with pure beta-blockers — labetalol is safer due to combined blockade)",
        pearl: "Drug of choice for aortic dissection (reduces both BP and dP/dt). Can give as 20 mg IV bolus doubling q10 min (max 300 mg) or continuous infusion. Safe in pregnancy (no teratogenicity). Onset 2-5 min."
      }
    ],
    pearls: [
      "Hypertensive emergency = elevated BP + acute end-organ damage; hypertensive urgency = elevated BP without end-organ damage — the distinction determines ICU admission and IV therapy vs oral medication adjustment",
      "Never reduce BP by > 25% in the first hour — overly aggressive reduction causes watershed cerebral infarction, especially in chronic hypertensives whose autoregulatory curve has shifted rightward",
      "For cocaine-induced hypertensive emergency, avoid pure beta-blockers (unopposed alpha stimulation worsens hypertension); use benzodiazepines first, then phentolamine or nicardipine"
    ],
    quiz: [
      {
        question: "A 55-year-old presents with BP 220/130, severe headache, confusion, and papilledema. Current MAP is 180 mmHg. What is the appropriate BP target in the first hour?",
        options: [
          "Reduce MAP to 100 mmHg immediately",
          "Reduce MAP by 25% (to ~135 mmHg) in the first hour",
          "Reduce SBP to < 140 mmHg within 30 minutes",
          "Administer oral nifedipine and reassess in 4 hours"
        ],
        correct: 1,
        rationale: "Guidelines recommend reducing MAP by no more than 25% in the first hour to prevent watershed ischemia. Overly aggressive BP reduction can cause cerebral hypoperfusion, especially in patients with chronic hypertension whose autoregulatory curve has shifted rightward. Sublingual nifedipine is contraindicated due to unpredictable, precipitous BP drops."
      }
    ]
  },
  "acs-management-np": {
    title: "Acute Coronary Syndrome: Risk Stratification",
    cellular: {
      title: "Plaque Rupture and Thrombosis in ACS",
      content: "ACS encompasses unstable angina, NSTEMI, and STEMI — all resulting from disruption of a vulnerable atherosclerotic plaque. Vulnerable plaques have thin fibrous caps, large lipid-rich necrotic cores, and abundant macrophages producing matrix metalloproteinases (MMPs) that weaken the cap. Plaque rupture or erosion exposes subendothelial collagen and tissue factor to flowing blood, triggering the coagulation cascade and platelet aggregation via glycoprotein IIb/IIIa receptors. In NSTEMI, a non-occlusive thrombus forms causing subendocardial ischemia with troponin elevation. In STEMI, complete thrombotic occlusion causes transmural ischemia. Troponin I or T rises within 3-6 hours of myocardial necrosis, peaks at 12-24 hours, and remains elevated for 7-14 days. High-sensitivity troponin (hs-cTn) allows earlier detection and serial measurements at 0 and 3 hours guide rule-in/rule-out algorithms."
    },
    riskFactors: [
      "Prior MI, PCI, or CABG (strongest predictor of recurrent ACS)",
      "Diabetes mellitus — accelerated atherosclerosis and diffuse coronary disease",
      "Dyslipidemia: elevated LDL-C (> 190 mg/dL), low HDL, elevated Lp(a)",
      "Hypertension — endothelial damage and plaque progression",
      "Active tobacco smoking (2-4x increased MI risk; promotes thrombosis and vasospasm)",
      "Family history of premature CAD (male < 55 or female < 65 first-degree relative)",
      "Chronic kidney disease (CKD stage 3-5 is a CAD equivalent)",
      "Cocaine/amphetamine use — coronary vasospasm and accelerated atherosclerosis"
    ],
    diagnostics: [
      "Serial high-sensitivity troponin at 0 and 3 hours (delta change > 20% suggests acute MI)",
      "12-lead ECG within 10 minutes: ST elevation >= 1 mm in 2 contiguous leads (STEMI), ST depression or T-wave inversion (NSTEMI/UA)",
      "TIMI risk score (7 variables) or GRACE score for risk stratification of NSTEMI/UA",
      "CXR to evaluate for pulmonary edema or widened mediastinum (aortic dissection mimics ACS)",
      "Point-of-care echocardiogram: regional wall motion abnormalities, LVEF estimation, mechanical complications",
      "CBC (anemia worsening ischemia), BMP (K+ for arrhythmia risk), coagulation studies, lipid panel",
      "BNP/NT-proBNP if HF suspected as complication of ACS",
      "Coronary angiography: emergent for STEMI (door-to-balloon < 90 min), early invasive for high-risk NSTEMI"
    ],
    management: [
      "STEMI: activate catheterization lab for primary PCI within 90 minutes (or 120 minutes if transfer required)",
      "STEMI fibrinolysis (tenecteplase weight-based or alteplase) if PCI not available within 120 minutes",
      "Dual antiplatelet therapy (DAPT): ASA 325 mg loading + P2Y12 inhibitor (ticagrelor 180 mg or clopidogrel 600 mg)",
      "Anticoagulation: unfractionated heparin (60 U/kg bolus, 12 U/kg/hr infusion) or enoxaparin 1 mg/kg SC q12h",
      "High-intensity statin: atorvastatin 80 mg or rosuvastatin 40 mg (start within 24 hours regardless of baseline LDL)",
      "Beta-blocker: metoprolol 25-50 mg PO within 24 hours if no cardiogenic shock, HF, or heart block",
      "ACEi/ARB: start within 24 hours for anterior STEMI, LVEF < 40%, or diabetes",
      "Manage complications: cardiogenic shock (mechanical support, vasopressors), arrhythmias (amiodarone), mechanical (VSD, papillary muscle rupture — emergent surgery)"
    ],
    nursingActions: [
      "Obtain and interpret 12-lead ECG within 10 minutes of presentation; compare to prior ECGs if available",
      "Administer MONA (morphine cautiously if severe pain, oxygen only if SpO2 < 94%, nitroglycerin SL/IV, ASA 325 mg chewed) per protocol",
      "Monitor continuous telemetry for arrhythmias: VT/VF (defibrillation), complete heart block (transcutaneous pacing)",
      "Establish large-bore IV access; draw labs including troponin, CBC, BMP, coagulation, type and screen",
      "Assess Killip classification: I (no HF), II (rales, S3), III (pulmonary edema), IV (cardiogenic shock)",
      "Prepare for emergent cardiac catheterization: consent, groin prep, NPO, medication administration",
      "Post-PCI: monitor access site for bleeding/hematoma, distal pulses, anticoagulation per protocol",
      "Initiate cardiac rehabilitation referral and secondary prevention education before discharge"
    ],
    signs: {
      left: [
        "Substernal chest pressure with radiation to left arm, jaw, or back",
        "Diaphoresis and nausea",
        "Stable hemodynamics with mild ST changes on ECG",
        "Troponin elevated but hemodynamically compensated"
      ],
      right: [
        "Cardiogenic shock: SBP < 90, tachycardia, cool/clammy extremities, altered mentation",
        "Ventricular fibrillation or sustained VT requiring defibrillation",
        "Acute mechanical complication: new systolic murmur (VSD or papillary muscle rupture)",
        "Complete heart block with inferior STEMI requiring temporary pacing"
      ]
    },
    medications: [
      {
        name: "Ticagrelor (Brilinta)",
        type: "P2Y12 Receptor Antagonist (Direct-acting)",
        action: "Reversibly binds P2Y12 ADP receptor on platelets, inhibiting ADP-mediated platelet activation and aggregation; faster onset and more potent inhibition than clopidogrel",
        sideEffects: "Dyspnea (14%, usually transient), bleeding, bradyarrhythmias (ventricular pauses), hyperuricemia",
        contra: "Active bleeding, history of intracranial hemorrhage, severe hepatic impairment, concurrent use of strong CYP3A4 inhibitors/inducers, ASA doses > 100 mg (reduces efficacy)",
        pearl: "PLATO trial showed superiority to clopidogrel in ACS with 16% reduction in CV death. Must use with ASA 81 mg only (not 325 mg). Twice-daily dosing (90 mg BID maintenance). No CYP2C19 genotype variability unlike clopidogrel."
      },
      {
        name: "Atorvastatin 80 mg",
        type: "HMG-CoA Reductase Inhibitor (High-intensity Statin)",
        action: "Inhibits HMG-CoA reductase in hepatocytes, reducing cholesterol synthesis, upregulating LDL receptors, and providing pleiotropic effects including plaque stabilization and anti-inflammatory action",
        sideEffects: "Myalgia, hepatotoxicity (rare), rhabdomyolysis (rare, higher risk with interacting drugs), new-onset diabetes",
        contra: "Active liver disease, pregnancy, concurrent strong CYP3A4 inhibitors",
        pearl: "Start high-intensity statin within 24 hours of ACS regardless of baseline LDL. PROVE-IT trial showed benefit of intensive vs moderate statin therapy in ACS. Check ALT at baseline and if symptoms arise. Target LDL < 70 mg/dL (< 55 if very high risk per ESC)."
      }
    ],
    pearls: [
      "High-sensitivity troponin allows rule-out of MI using 0/3-hour algorithm — if both values are normal and delta < 20%, ACS is very unlikely (NPV > 99%)",
      "In STEMI, every 30-minute delay in door-to-balloon time increases 1-year mortality — the NP's role in rapid ECG interpretation and cath lab activation is critical",
      "Always consider aortic dissection in the differential of severe chest pain — fibrinolysis in dissection is fatal; check BP in both arms and CXR for widened mediastinum"
    ],
    quiz: [
      {
        question: "A 62-year-old presents with 2 hours of crushing chest pain. ECG shows 3 mm ST elevation in leads II, III, aVF. The nearest PCI-capable hospital is 45 minutes away. What is the most appropriate action?",
        options: [
          "Administer fibrinolysis since PCI is not available within 120 minutes",
          "Transfer immediately for PCI since total time would be < 120 minutes",
          "Start heparin drip and observe for 6 hours before deciding",
          "Order CT coronary angiography for definitive diagnosis"
        ],
        correct: 1,
        rationale: "For STEMI, primary PCI is preferred if achievable within 120 minutes from first medical contact (including transfer time). With 45-minute transfer plus ~30 minutes for cath activation, PCI is likely achievable within 120 minutes. If transfer time would exceed 120 minutes, fibrinolysis should be administered."
      }
    ]
  },
  "cardiac-arrest-acls-np": {
    title: "Cardiac Arrest: ACLS Algorithms",
    cellular: {
      title: "Cellular Ischemia During Cardiac Arrest",
      content: "Cardiac arrest causes immediate cessation of forward blood flow, creating global cellular ischemia. Within 4-6 minutes without CPR, irreversible neuronal injury begins due to ATP depletion, calcium overload, and excitotoxic glutamate release. The four arrest rhythms are divided into shockable (VF, pulseless VT) and non-shockable (PEA, asystole). VF involves chaotic ventricular depolarization without organized contraction. PEA shows organized electrical activity on the monitor without palpable pulse, often caused by the H's and T's: Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia, Tension pneumothorax, Tamponade, Toxins, Thrombosis (coronary/pulmonary). High-quality CPR maintains coronary perfusion pressure (> 15 mmHg needed for ROSC) through chest compressions at 100-120/min, depth 2-2.4 inches, full recoil, and minimal interruptions."
    },
    riskFactors: [
      "Coronary artery disease and acute MI (most common cause of VF arrest)",
      "Structural heart disease: cardiomyopathy with LVEF < 35%",
      "Channelopathies: Long QT, Brugada, catecholaminergic polymorphic VT",
      "Electrolyte imbalances: severe hypo/hyperkalemia, hypomagnesemia",
      "Drug toxicity: digoxin, tricyclic antidepressants, cocaine, QT-prolonging medications",
      "Massive pulmonary embolism causing obstructive shock",
      "Tension pneumothorax, cardiac tamponade",
      "Severe hypoxia from drowning, airway obstruction, or respiratory failure"
    ],
    diagnostics: [
      "Continuous cardiac rhythm monitoring: identify VF/pulseless VT vs PEA/asystole",
      "Point-of-care ultrasound (POCUS) during pulse checks: cardiac activity, tamponade, pneumothorax, hypovolemia",
      "End-tidal CO2 monitoring (target > 20 mmHg with adequate CPR; ETCO2 > 40 suggests ROSC)",
      "ABG for pH, pCO2, K+, lactate during resuscitation",
      "Bedside glucose — hypoglycemia is a reversible cause",
      "12-lead ECG immediately after ROSC to evaluate for STEMI (cath lab activation)",
      "Core temperature — hypothermic arrests require prolonged resuscitation (you are not dead until you are warm and dead)",
      "Post-ROSC CT head and CT angiography as indicated"
    ],
    management: [
      "Begin high-quality CPR immediately: 100-120 compressions/min, depth 2-2.4 inches, full recoil, minimize interruptions (< 10 sec)",
      "VF/pulseless VT: defibrillate 200J biphasic → CPR 2 min → epinephrine 1 mg IV q3-5 min → defibrillate → amiodarone 300 mg IV → defibrillate → amiodarone 150 mg",
      "PEA/Asystole: CPR + epinephrine 1 mg IV q3-5 min; identify and treat reversible causes (H's and T's)",
      "Advanced airway: supraglottic airway or endotracheal intubation without interrupting compressions; 10 breaths/min asynchronous",
      "Post-ROSC: targeted temperature management (TTM) 32-36°C for 24 hours for comatose patients",
      "Post-ROSC MAP target > 65 mmHg with vasopressors (norepinephrine); avoid hypotension and hypoxia",
      "Emergent coronary angiography for STEMI post-ROSC; consider even without STEMI if no obvious non-cardiac cause",
      "Multimodal neuroprognostication at >= 72 hours post-arrest: EEG, SSEP, NSE, MRI brain"
    ],
    nursingActions: [
      "Initiate BLS immediately: confirm unresponsiveness, activate code team, begin chest compressions, apply defibrillator",
      "Ensure high-quality CPR: metronome at 110/min, rotate compressors q2 minutes, monitor ETCO2 (> 20 mmHg indicates adequate compressions)",
      "Prepare and administer ACLS medications: pre-draw epinephrine syringes, have amiodarone and calcium ready",
      "Document code events with timestamps: rhythm checks, shocks delivered, medications given, CPR quality metrics",
      "Post-ROSC: obtain 12-lead ECG within 10 minutes, initiate TTM protocol, monitor for rearrest",
      "Maintain SpO2 94-98% (avoid hyperoxia), PaCO2 35-45 mmHg, blood glucose 140-180 mg/dL post-ROSC",
      "Provide family support and communication during and after resuscitation",
      "Coordinate organ donation team consultation per institutional protocol for patients with poor neurological prognosis"
    ],
    signs: {
      left: [
        "Shockable rhythm (VF/pVT) with ETCO2 > 20 mmHg during CPR",
        "ROSC achieved: return of pulse, rising ETCO2 > 40, arterial waveform",
        "Post-ROSC: following commands, purposeful movements (good prognosis)",
        "Identified reversible cause successfully treated"
      ],
      right: [
        "Refractory VF (> 3 shocks) — consider double sequential defibrillation, esmolol, or ECMO",
        "Asystole with no ETCO2 rise despite CPR (poor prognosis indicator)",
        "Post-ROSC cardiogenic shock requiring vasopressors and mechanical support",
        "Severe anoxic brain injury: absent brainstem reflexes, myoclonus, burst suppression on EEG"
      ]
    },
    medications: [
      {
        name: "Epinephrine",
        type: "Catecholamine (alpha-1 and beta-1/2 agonist)",
        action: "Alpha-1: peripheral vasoconstriction increasing coronary and cerebral perfusion pressure during CPR; Beta-1: increases heart rate and contractility post-ROSC",
        sideEffects: "Post-ROSC tachycardia, hypertension, myocardial oxygen demand increase, arrhythmias",
        contra: "No absolute contraindications in cardiac arrest",
        pearl: "Give 1 mg IV/IO q3-5 min in all arrest rhythms. For shockable rhythms, give after 2nd shock. PARAMEDIC2 trial showed improved ROSC but not neurological outcomes. Do not delay defibrillation to give epinephrine."
      },
      {
        name: "Amiodarone",
        type: "Class III Antiarrhythmic",
        action: "Blocks potassium, sodium, calcium channels and beta receptors; stabilizes myocardial membranes and increases defibrillation threshold success",
        sideEffects: "Hypotension (from IV diluent in older formulations), bradycardia post-ROSC",
        contra: "No absolute contraindications during cardiac arrest",
        pearl: "For refractory VF/pVT: 300 mg IV bolus after 3rd shock, then 150 mg after 5th shock. Post-ROSC: 1 mg/min x 6 hr then 0.5 mg/min x 18 hr. Alternative: lidocaine 1-1.5 mg/kg if amiodarone unavailable."
      }
    ],
    pearls: [
      "CPR quality is the single most important determinant of survival — target > 80% chest compression fraction, depth 2-2.4 inches, and ETCO2 > 20 mmHg",
      "Always search for reversible causes (H's and T's) especially in PEA/asystole — treating the cause is the only way to achieve ROSC in non-shockable rhythms",
      "Post-ROSC ETCO2 of > 40 mmHg reliably indicates return of circulation; a sudden ETCO2 spike during CPR often precedes pulse return"
    ],
    quiz: [
      {
        question: "During a code, the patient is in refractory VF after 3 defibrillation attempts and 2 rounds of epinephrine. ETCO2 is 15 mmHg. What is the next best intervention?",
        options: [
          "Amiodarone 300 mg IV push and optimize CPR quality",
          "Increase epinephrine to 3 mg IV",
          "Administer sodium bicarbonate 1 mEq/kg IV",
          "Terminate resuscitation due to refractory rhythm"
        ],
        correct: 0,
        rationale: "After 3 shocks in refractory VF, amiodarone 300 mg IV is indicated per ACLS algorithm. The low ETCO2 (15 mmHg, target > 20) suggests suboptimal CPR quality — rotating compressors and optimizing technique may improve coronary perfusion pressure. Higher-dose epinephrine is not recommended. Bicarbonate is only considered in specific situations (hyperkalemia, TCA overdose)."
      }
    ]
  },
  "hfpef-np": {
    title: "Heart Failure with Preserved EF",
    cellular: {
      title: "Diastolic Dysfunction Pathophysiology",
      content: "HFpEF (LVEF >= 50%) accounts for ~50% of HF cases and is characterized by impaired ventricular relaxation and increased stiffness. The pathophysiology involves systemic microvascular endothelial inflammation driven by comorbidities (obesity, diabetes, hypertension, CKD). Endothelial dysfunction reduces nitric oxide bioavailability, decreasing cGMP-PKG signaling in cardiomyocytes, resulting in increased resting tension (titin hypophosphorylation) and concentric hypertrophy. Elevated LV filling pressures at rest or with exercise cause pulmonary congestion and exercise intolerance. Diagnosis requires symptoms + preserved LVEF + evidence of diastolic dysfunction (elevated E/e' > 14, LA enlargement, elevated NT-proBNP). The HFA-PEFF score systematically combines echocardiographic, biomarker, and exercise data for diagnosis."
    },
    riskFactors: [
      "Hypertension (present in > 75% of HFpEF patients — leading cause of concentric remodeling)",
      "Obesity (BMI > 30) — systemic inflammation and increased cardiac loading",
      "Type 2 diabetes mellitus — AGE accumulation and microvascular disease",
      "Atrial fibrillation (frequently coexists; both cause and consequence)",
      "Chronic kidney disease (shared pathophysiology, fluid retention)",
      "Female sex and age > 65 years",
      "Coronary artery disease with microvascular dysfunction",
      "Obstructive sleep apnea"
    ],
    diagnostics: [
      "Echocardiography: LVEF >= 50%, E/e' ratio > 14, LA volume index > 34 mL/m², TR velocity > 2.8 m/s",
      "NT-proBNP > 125 pg/mL (or BNP > 35 pg/mL) — may be lower in obese patients",
      "Exercise stress echocardiography or invasive hemodynamics with exercise if resting data equivocal",
      "Right heart catheterization: PCWP > 15 mmHg at rest or > 25 mmHg with exercise confirms diagnosis",
      "Cardiac MRI for myocardial characterization (fibrosis, infiltrative disease such as amyloid)",
      "HFA-PEFF diagnostic algorithm: functional, morphological, and biomarker domains",
      "Screen for cardiac amyloidosis with Tc-99m PYP scan if unexplained LVH with HFpEF",
      "Assessment of comorbidity burden: HbA1c, lipid panel, eGFR, iron studies, sleep study"
    ],
    management: [
      "SGLT2 inhibitors (empagliflozin 10 mg or dapagliflozin 10 mg) — EMPEROR-Preserved and DELIVER trials showed significant reduction in HF hospitalization",
      "Aggressive diuresis for volume overload: furosemide or bumetanide with daily weight monitoring",
      "BP control to target < 130/80 mmHg (most important modifiable intervention)",
      "Weight loss interventions: 10% weight reduction improves symptoms and exercise capacity",
      "Treat atrial fibrillation: rate or rhythm control, anticoagulation per CHA₂DS₂-VASc",
      "Exercise rehabilitation: supervised aerobic training improves peak VO2 and quality of life",
      "Screen for and treat iron deficiency (IV iron if ferritin < 100 or TSAT < 20%)",
      "Evaluate for specific etiologies: cardiac amyloidosis, constrictive pericarditis, hypertrophic cardiomyopathy"
    ],
    nursingActions: [
      "Assess volume status at each visit: weight trend, JVP, peripheral edema, dyspnea on exertion",
      "Monitor BP at home and clinic — strict hypertension control is foundational",
      "Educate on sodium restriction (< 2 g/day) and daily weight monitoring",
      "Coordinate exercise rehabilitation enrollment — key non-pharmacological intervention",
      "Screen for comorbidities that drive HFpEF: diabetes management, OSA screening, obesity counseling",
      "Monitor SGLT2 inhibitor tolerance: genital infections, volume status, ketoacidosis symptoms",
      "Assess functional capacity using 6-minute walk test at baseline and follow-up visits",
      "Coordinate geriatric assessment if multiple comorbidities and frailty are present"
    ],
    signs: {
      left: [
        "Exertional dyspnea with preserved resting hemodynamics",
        "Mild peripheral edema responsive to diuretics",
        "Exercise intolerance with normal resting echocardiogram",
        "Elevated E/e' ratio on echocardiography"
      ],
      right: [
        "Severe fluid overload resistant to oral diuretics requiring IV diuresis",
        "New-onset atrial fibrillation with rapid ventricular response",
        "Pulmonary hypertension (TR velocity > 3.4 m/s) suggesting fixed PH",
        "Progressive renal dysfunction with cardiorenal syndrome"
      ]
    },
    medications: [
      {
        name: "Empagliflozin (Jardiance) 10 mg",
        type: "SGLT2 Inhibitor",
        action: "Promotes glycosuria and natriuresis, reducing preload and interstitial congestion; improves cardiomyocyte metabolism and reduces inflammation/fibrosis independently of glycemic control",
        sideEffects: "Genital mycotic infections (more common in females), UTI, volume depletion, euglycemic DKA (rare)",
        contra: "Type 1 diabetes, eGFR < 20 for initiation, dialysis",
        pearl: "EMPEROR-Preserved was first trial to show mortality/hospitalization benefit in HFpEF. Benefit observed regardless of diabetes status or LVEF (even LVEF > 60%). Now a Class I recommendation for HFpEF."
      },
      {
        name: "Spironolactone",
        type: "Mineralocorticoid Receptor Antagonist",
        action: "Blocks aldosterone at renal collecting duct and myocardium, reducing sodium retention, volume overload, and myocardial fibrosis",
        sideEffects: "Hyperkalemia, gynecomastia (males), breast tenderness, renal impairment, menstrual irregularities",
        contra: "K+ > 5.0 mEq/L, eGFR < 30 mL/min, concurrent potassium-sparing diuretics, Addison disease",
        pearl: "TOPCAT trial showed regional variability; Americas cohort demonstrated reduced HF hospitalization with spironolactone in HFpEF. May be considered in selected HFpEF patients especially with volume overload."
      }
    ],
    pearls: [
      "SGLT2 inhibitors are now the only Class I drug therapy recommendation for HFpEF — traditional HFrEF therapies (ARNI, beta-blockers, MRA) have not shown consistent benefit in HFpEF",
      "Obesity-HFpEF phenotype is the most common subtype — weight loss of 5-10% produces meaningful hemodynamic improvement and should be a primary treatment goal",
      "If unexplained LVH is present with HFpEF, always consider cardiac amyloidosis (both AL and ATTR types) — early diagnosis changes management dramatically"
    ],
    quiz: [
      {
        question: "A 72-year-old woman with HTN, DM2, BMI 35, and LVEF 58% presents with worsening exertional dyspnea. Echo shows E/e' 16, LA volume index 38 mL/m². NT-proBNP is 450 pg/mL. Which medication has the strongest evidence for reducing HF hospitalization?",
        options: [
          "Sacubitril/valsartan",
          "Carvedilol",
          "Empagliflozin",
          "Lisinopril"
        ],
        correct: 2,
        rationale: "SGLT2 inhibitors (empagliflozin per EMPEROR-Preserved, dapagliflozin per DELIVER) are the only drug class with robust evidence for reducing HF hospitalization in HFpEF. ARNI, beta-blockers, and ACEi have not shown consistent benefit in HFpEF clinical trials."
      }
    ]
  },
  "valvular-disease-np": {
    title: "Valvular Disease: Stenosis & Regurgitation",
    cellular: {
      title: "Valvular Pathology and Hemodynamic Consequences",
      content: "Valvular heart disease produces hemodynamic burden through stenosis (obstruction to flow) or regurgitation (backward flow). Aortic stenosis (AS) is most commonly degenerative calcific disease in older adults or bicuspid aortic valve in younger patients. Progressive calcification narrows the valve orifice, creating a pressure gradient across the valve. The LV compensates with concentric hypertrophy to maintain wall stress (Laplace law), but eventually diastolic dysfunction and ultimately systolic failure develop. Mitral regurgitation (MR) causes volume overload of the LA and LV. In acute MR (papillary muscle rupture, endocarditis), sudden volume overload causes pulmonary edema because the non-compliant LA cannot accommodate the regurgitant volume. In chronic MR, LA dilation accommodates increased volume with lower pressures initially, but progressive LV dilation leads to eccentric hypertrophy and eventual systolic dysfunction."
    },
    riskFactors: [
      "Degenerative calcific disease (most common cause of AS in patients > 65)",
      "Bicuspid aortic valve (1-2% prevalence; accelerates calcification by 10-20 years)",
      "Rheumatic heart disease (most common cause of mitral stenosis globally)",
      "Myxomatous degeneration (mitral valve prolapse — Barlow disease)",
      "Infective endocarditis causing acute valvular destruction",
      "Post-MI papillary muscle dysfunction or rupture (acute MR)",
      "Radiation-associated valvular disease (prior chest radiation)",
      "Connective tissue disorders: Marfan, Ehlers-Danlos (aortic root dilation, MR)"
    ],
    diagnostics: [
      "Transthoracic echocardiography (TTE): valve morphology, severity grading, LVEF, chamber dimensions",
      "AS severity: mild (AVA > 1.5 cm², mean gradient < 20), moderate (1.0-1.5, 20-40), severe (< 1.0, > 40 mmHg)",
      "MR severity: mild (regurgitant volume < 30 mL), moderate (30-59 mL), severe (>= 60 mL, vena contracta >= 7 mm)",
      "TEE for detailed assessment before surgical planning or if TTE is suboptimal",
      "Cardiac catheterization for hemodynamic assessment when non-invasive data are inconclusive",
      "ECG: LVH with strain (AS), LA enlargement and AF (mitral disease)",
      "Exercise testing in asymptomatic severe AS: abnormal BP response, symptoms with exertion",
      "CT calcium scoring for aortic valve (> 2000 AU males, > 1200 AU females = severe AS)"
    ],
    management: [
      "Severe symptomatic AS: surgical aortic valve replacement (SAVR) or transcatheter (TAVR) — no medical therapy delays progression",
      "TAVR preferred for high/prohibitive surgical risk; SAVR for low surgical risk and younger patients (< 65)",
      "Severe chronic primary MR with symptoms or LV dysfunction (LVEF < 60% or LVESD >= 40 mm): mitral valve repair preferred over replacement",
      "Medical management of HF symptoms with diuretics and vasodilators while awaiting intervention",
      "Secondary MR (functional): optimize GDMT for HFrEF; consider MitraClip for persistent severe MR on optimal medical therapy",
      "Mitral stenosis (MVA < 1.5 cm²): percutaneous mitral balloon commissurotomy (PMBC) if anatomy favorable",
      "Endocarditis prophylaxis for prosthetic valves: amoxicillin 2 g PO 30-60 min before dental procedures",
      "Anticoagulation for mechanical prosthetic valves: warfarin (INR 2.5-3.5 for mitral, 2.0-3.0 for aortic)"
    ],
    nursingActions: [
      "Auscultate heart sounds systematically: AS (crescendo-decrescendo systolic murmur at RUSB, radiating to carotids), MR (holosystolic at apex, radiating to axilla)",
      "Monitor for symptom progression: exertional dyspnea, angina, syncope (classic AS triad — mean survival 2-3 years after symptom onset)",
      "Assess volume status and diuretic response in patients with valvular HF",
      "Post-surgical or post-TAVR monitoring: hemodynamic stability, access site, stroke assessment, paravalvular leak detection",
      "Educate on endocarditis prophylaxis for prosthetic valves: dental hygiene, antibiotic prophylaxis timing",
      "Monitor INR for mechanical valve anticoagulation: target therapeutic range, counsel on drug and food interactions",
      "Coordinate echocardiographic surveillance: annual for moderate disease, serial for severe asymptomatic disease",
      "Assess functional capacity and document symptom onset for timing of intervention"
    ],
    signs: {
      left: [
        "Asymptomatic murmur detected on routine exam",
        "Mild exercise intolerance with preserved LVEF",
        "Mild-moderate valvular lesion on echocardiography",
        "Normal chamber dimensions and hemodynamics"
      ],
      right: [
        "Syncope with exertion in severe AS (fixed output state)",
        "Flash pulmonary edema from acute severe MR (papillary muscle rupture, chordal rupture)",
        "Atrial fibrillation with rapid ventricular response and hemodynamic decompensation",
        "LV dilation with declining LVEF indicating irreversible myocardial damage"
      ]
    },
    medications: [
      {
        name: "Warfarin",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K epoxide reductase, reducing synthesis of factors II, VII, IX, X and proteins C and S",
        sideEffects: "Bleeding, skin necrosis (protein C deficiency), teratogenicity, hair loss",
        contra: "Active bleeding, pregnancy (except mechanical valve where benefit may outweigh risk), severe hepatic failure",
        pearl: "ONLY anticoagulant for mechanical heart valves — DOACs are contraindicated (RE-ALIGN trial). Target INR 2.0-3.0 for aortic mechanical valve, 2.5-3.5 for mitral. Bridge with heparin perioperatively."
      },
      {
        name: "Furosemide",
        type: "Loop Diuretic",
        action: "Inhibits Na-K-2Cl cotransporter in thick ascending limb of Henle, promoting natriuresis and reducing preload",
        sideEffects: "Hypokalemia, hypomagnesemia, metabolic alkalosis, ototoxicity, hyperuricemia, dehydration",
        contra: "Anuria, severe hypovolemia, hepatic coma, untreated hypokalemia",
        pearl: "Use for volume management in symptomatic valvular disease while awaiting intervention. Monitor electrolytes and renal function. IV:PO conversion is approximately 1:2. Ceiling dose in normal renal function ~200 mg IV."
      }
    ],
    pearls: [
      "Once symptoms develop in severe AS (dyspnea, syncope, angina), mean survival without intervention is 2-3 years — do not delay referral for valve replacement",
      "DOACs are absolutely contraindicated in mechanical heart valves — this was demonstrated in the RE-ALIGN trial which was stopped early due to excess thromboembolism with dabigatran vs warfarin",
      "In acute severe MR (post-MI papillary muscle rupture), the patient may not have a loud murmur because the large regurgitant orifice equilibrates LA and LV pressures — maintain high clinical suspicion"
    ],
    quiz: [
      {
        question: "A 78-year-old with severe symptomatic aortic stenosis (AVA 0.8 cm², mean gradient 48 mmHg) and STS score 8% is being evaluated for valve replacement. Which approach is most appropriate?",
        options: [
          "Medical management with diuretics and beta-blockers",
          "Transcatheter aortic valve replacement (TAVR)",
          "Surgical aortic valve replacement (SAVR)",
          "Balloon aortic valvuloplasty as definitive treatment"
        ],
        correct: 1,
        rationale: "STS score 8% represents high surgical risk. TAVR is preferred for high-risk and prohibitive surgical risk patients per current guidelines (PARTNER 2, CoreValve). Medical therapy does not alter the natural history of severe AS. Balloon valvuloplasty is palliative only with rapid restenosis."
      }
    ]
  },
  "pvd-advanced-np": {
    title: "Peripheral Vascular Disease: Advanced Mgmt",
    cellular: {
      title: "Atherosclerotic Peripheral Arterial Disease",
      content: "Peripheral arterial disease (PAD) results from atherosclerotic plaque narrowing of arteries supplying the lower extremities (most commonly superficial femoral artery). The pathophysiology mirrors coronary atherosclerosis: endothelial dysfunction, lipid deposition, macrophage infiltration forming foam cells, smooth muscle cell migration, and fibrous cap formation. Progressive stenosis reduces distal perfusion, initially causing intermittent claudication (muscle ischemia with exertion). Critical limb ischemia (CLI) develops when resting blood flow is insufficient, causing rest pain, non-healing wounds, or gangrene. Ankle-brachial index (ABI) quantifies severity: normal 1.0-1.3, mild 0.9-0.7, moderate 0.69-0.4, severe < 0.4. PAD is a coronary artery disease risk equivalent — these patients have 3-6x increased cardiovascular mortality."
    },
    riskFactors: [
      "Tobacco smoking (strongest risk factor — increases PAD risk 2-6x; dose-dependent)",
      "Diabetes mellitus (2-4x increased risk; accelerates tibial and peroneal artery disease)",
      "Dyslipidemia with elevated LDL-C",
      "Hypertension",
      "Chronic kidney disease (especially dialysis patients)",
      "Hyperhomocysteinemia",
      "Age > 65 years (or > 50 with diabetes or smoking history)",
      "Known atherosclerotic disease in other vascular beds (CAD, carotid stenosis)"
    ],
    diagnostics: [
      "Ankle-brachial index (ABI): normal 1.0-1.3; < 0.9 diagnostic of PAD; < 0.4 severe/CLI",
      "Toe-brachial index (TBI) if ABI falsely elevated (> 1.3 due to medial arterial calcification in diabetes/CKD)",
      "Arterial duplex ultrasound: localize stenosis, measure peak systolic velocities",
      "CT angiography (CTA) or MR angiography (MRA) for surgical/endovascular planning",
      "Segmental pressures and pulse volume recordings for multi-level disease assessment",
      "Transcutaneous oxygen tension (TcPO2 < 30 mmHg indicates poor wound healing potential)",
      "HbA1c, lipid panel, creatinine — address modifiable cardiovascular risk factors",
      "Consider screening for concomitant CAD and carotid disease (high prevalence with PAD)"
    ],
    management: [
      "Smoking cessation (single most important intervention — reduces amputation risk by 50%)",
      "Antiplatelet therapy: clopidogrel 75 mg daily preferred over ASA for PAD (CAPRIE trial); or rivaroxaban 2.5 mg BID + ASA (COMPASS trial) for high-risk PAD",
      "High-intensity statin therapy: atorvastatin 80 mg or rosuvastatin 40 mg (target LDL < 70 mg/dL)",
      "Supervised exercise therapy: structured walking program 3x/week for >= 12 weeks (increases pain-free walking distance by 50-200%)",
      "Cilostazol 100 mg BID for symptom relief of claudication (contraindicated in HF)",
      "Endovascular revascularization (angioplasty ± stent) for lifestyle-limiting claudication failing medical/exercise therapy or CLI",
      "Surgical bypass grafting for extensive disease or failed endovascular approaches",
      "Wound care for CLI: offloading, infection control, multidisciplinary limb salvage approach"
    ],
    nursingActions: [
      "Perform comprehensive vascular assessment: palpate pedal pulses (dorsalis pedis, posterior tibial), assess capillary refill, skin color, temperature, trophic changes",
      "Measure and document ABI at baseline and serially (decline > 0.15 suggests disease progression)",
      "Assess for CLI warning signs: rest pain (worse at night, relieved by dangling foot), non-healing wounds, gangrene",
      "Educate on smoking cessation resources and pharmacotherapy options",
      "Coordinate supervised exercise therapy enrollment and adherence monitoring",
      "Perform wound assessment using standardized tools (Wagner classification for diabetic ulcers)",
      "Optimize secondary prevention: medication reconciliation for statin, antiplatelet, antihypertensive compliance",
      "Post-revascularization monitoring: graft/stent patency assessment, access site complications"
    ],
    signs: {
      left: [
        "Intermittent claudication: reproducible leg pain with walking, relieved by rest",
        "Diminished but palpable pedal pulses",
        "ABI 0.7-0.9 (mild to moderate disease)",
        "Hair loss, thickened toenails, pale or cool extremities"
      ],
      right: [
        "Rest pain in forefoot (critical limb ischemia, ABI < 0.4)",
        "Non-healing ischemic ulcers (usually painful, at pressure points or between toes)",
        "Gangrene (dry or wet) requiring amputation evaluation",
        "Acute limb ischemia (6 P's: Pain, Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia)"
      ]
    },
    medications: [
      {
        name: "Clopidogrel (Plavix)",
        type: "P2Y12 Receptor Antagonist (Thienopyridine)",
        action: "Irreversibly blocks P2Y12 ADP receptor on platelets, inhibiting platelet aggregation for the lifespan of the platelet (~7-10 days)",
        sideEffects: "Bleeding, TTP (rare), neutropenia (rare), GI upset",
        contra: "Active bleeding, severe hepatic impairment (prodrug requiring CYP2C19 activation)",
        pearl: "CAPRIE trial showed clopidogrel superior to ASA in PAD subgroup for MACE reduction. CYP2C19 poor metabolizers have reduced drug effect. Consider genetic testing in non-responders."
      },
      {
        name: "Cilostazol",
        type: "Phosphodiesterase III Inhibitor",
        action: "Inhibits PDE3 in platelets and vascular smooth muscle, causing vasodilation and antiplatelet effects; increases pain-free walking distance by 40-60%",
        sideEffects: "Headache (most common), diarrhea, palpitations, dizziness",
        contra: "Heart failure of any severity (increased mortality in HF with PDE3 inhibitors), concurrent strong CYP3A4 or CYP2C19 inhibitors",
        pearl: "Only FDA-approved medication for intermittent claudication symptom relief. Take 30 min before or 2 hr after meals. Full effect at 2-4 weeks. Absolutely contraindicated in any HF."
      }
    ],
    pearls: [
      "PAD is a coronary artery disease risk equivalent — all PAD patients need aggressive cardiovascular risk factor management including high-intensity statin and antiplatelet therapy",
      "Supervised exercise therapy is as effective as endovascular intervention for claudication and should be prescribed as first-line treatment — it is grossly underutilized",
      "An ABI > 1.3 is not normal — it indicates non-compressible, calcified arteries (commonly in diabetes and CKD) and should prompt TBI measurement and further vascular assessment"
    ],
    quiz: [
      {
        question: "A 65-year-old smoker with diabetes presents with left calf pain after walking 2 blocks, relieved by rest. ABI is 0.72. What is the most important initial intervention?",
        options: [
          "Immediate referral for angioplasty and stenting",
          "Smoking cessation counseling and supervised exercise therapy",
          "Cilostazol 100 mg BID and home walking program",
          "CT angiography to map the disease extent"
        ],
        correct: 1,
        rationale: "Smoking cessation is the single most important intervention in PAD (reduces amputation risk by 50%) and supervised exercise therapy is first-line for claudication. Revascularization is reserved for lifestyle-limiting symptoms despite medical/exercise therapy or critical limb ischemia."
      }
    ]
  },
  "vte-prophylaxis-np": {
    title: "Venous Thromboembolism Prophylaxis",
    cellular: {
      title: "Virchow Triad and VTE Pathogenesis",
      content: "Venous thromboembolism (VTE) encompasses deep vein thrombosis (DVT) and pulmonary embolism (PE). Virchow's triad identifies three pathogenic factors: venous stasis (immobility, venous obstruction), endothelial injury (surgery, trauma, catheters), and hypercoagulability (inherited thrombophilia, malignancy, pregnancy, hormonal therapy). Thrombus formation begins with platelet activation at sites of endothelial disruption, followed by tissue factor-initiated coagulation cascade activation generating thrombin and fibrin clot. The fibrinolytic system (plasmin) normally prevents propagation, but when procoagulant factors overwhelm anticoagulant mechanisms, the thrombus extends proximally. DVT in the iliofemoral veins carries the highest PE risk (~50% will embolize). PE causes acute right ventricular pressure overload, V/Q mismatch, and in massive PE, obstructive shock."
    },
    riskFactors: [
      "Surgery (especially orthopedic: hip/knee replacement; abdominal/pelvic cancer surgery)",
      "Immobilization > 72 hours (hospitalization, long-haul travel, paralysis)",
      "Active malignancy (highest risk: pancreatic, lung, brain, ovarian, hematologic)",
      "Prior VTE (recurrence rate ~30% without extended anticoagulation)",
      "Inherited thrombophilia: Factor V Leiden, prothrombin G20210A mutation, protein C/S deficiency, antithrombin III deficiency",
      "Hormonal therapy: combined oral contraceptives, HRT, tamoxifen",
      "Pregnancy and postpartum period (5x increased VTE risk)",
      "Obesity (BMI > 30), central venous catheters, inflammatory bowel disease"
    ],
    diagnostics: [
      "DVT: compression ultrasound (sensitivity > 95% for proximal DVT), D-dimer with Wells score for pre-test probability",
      "PE: CT pulmonary angiography (CTPA) — gold standard; V/Q scan if contrast contraindicated",
      "Wells score for DVT and modified Wells/Geneva score for PE — determines need for D-dimer vs imaging",
      "D-dimer: age-adjusted cutoff (age × 10 μg/L for patients > 50) improves specificity",
      "Padua Prediction Score or Caprini score for VTE risk assessment in hospitalized medical patients",
      "Thrombophilia workup (if unprovoked VTE, recurrent VTE, or strong family history): Factor V Leiden, prothrombin mutation, protein C/S, antithrombin, antiphospholipid antibodies",
      "Right heart strain on echocardiography or troponin/BNP elevation — risk stratification in PE",
      "CBC, PT/INR, aPTT, renal/hepatic function — baseline before anticoagulation"
    ],
    management: [
      "Pharmacological VTE prophylaxis for all hospitalized medical patients with Padua score >= 4: enoxaparin 40 mg SC daily or heparin 5000 units SC q8-12h",
      "Post-surgical prophylaxis: enoxaparin 30-40 mg SC daily; extended prophylaxis 28-35 days for hip/knee replacement and abdominal cancer surgery",
      "Mechanical prophylaxis: intermittent pneumatic compression (IPC) devices for patients with contraindications to pharmacological prophylaxis",
      "DVT treatment: DOAC preferred (rivaroxaban 15 mg BID × 21 days then 20 mg daily, or apixaban 10 mg BID × 7 days then 5 mg BID)",
      "PE treatment: anticoagulation for hemodynamically stable; systemic thrombolysis (alteplase) for massive PE with shock",
      "Cancer-associated VTE: LMWH or DOAC (edoxaban, rivaroxaban) for minimum 3-6 months; extend as long as cancer is active",
      "Duration of anticoagulation: provoked VTE 3 months; unprovoked VTE minimum 3 months then assess risk-benefit of indefinite therapy",
      "IVC filter only if absolute contraindication to anticoagulation with acute proximal DVT or PE"
    ],
    nursingActions: [
      "Assess VTE risk on admission using validated scoring tool (Padua, Caprini) and reassess with clinical changes",
      "Ensure VTE prophylaxis is ordered and administered: verify timing, injection technique, appropriate dose for weight and renal function",
      "Apply and maintain IPC devices when pharmacological prophylaxis is contraindicated; ensure > 18 hours/day use",
      "Monitor for DVT signs: unilateral leg swelling, pain, warmth, positive Homan's sign (low sensitivity but may prompt further evaluation)",
      "Educate patients on VTE prevention: early ambulation, leg exercises, hydration, risk factor awareness",
      "Monitor anticoagulation therapy: anti-Xa levels for LMWH in renal impairment or obesity, DOAC drug interactions",
      "Assess for bleeding complications: GI bleeding, hematuria, excessive bruising, intracranial hemorrhage symptoms",
      "Post-DVT: educate on compression stockings (30-40 mmHg) for post-thrombotic syndrome prevention"
    ],
    signs: {
      left: [
        "Unilateral leg swelling and mild calf tenderness (DVT)",
        "Low-risk PE: mild dyspnea with normal hemodynamics",
        "Elevated D-dimer with low clinical probability (likely false positive)",
        "Well-appearing patient on therapeutic anticoagulation"
      ],
      right: [
        "Massive PE: hypotension, tachycardia, syncope, RV strain on echo",
        "Phlegmasia cerulea dolens (massive iliofemoral DVT with limb-threatening ischemia)",
        "Paradoxical embolism via PFO causing stroke",
        "Heparin-induced thrombocytopenia (HIT) with platelet drop > 50% and new thrombosis"
      ]
    },
    medications: [
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low-Molecular-Weight Heparin (LMWH)",
        action: "Binds antithrombin III, primarily inhibiting factor Xa with less anti-IIa activity than UFH; predictable pharmacokinetics allow weight-based dosing without routine monitoring",
        sideEffects: "Bleeding, injection site hematoma, HIT (less common than UFH), osteoporosis with prolonged use",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl < 30 — adjust to 1 mg/kg daily), severe thrombocytopenia",
        pearl: "Prophylaxis: 40 mg SC daily (30 mg BID for high-risk orthopedic). Treatment: 1 mg/kg SC q12h or 1.5 mg/kg SC daily. Check anti-Xa levels in renal impairment, obesity (> 150 kg), and pregnancy. Not fully reversed by protamine (~60% reversal)."
      },
      {
        name: "Rivaroxaban (Xarelto)",
        type: "Direct Factor Xa Inhibitor",
        action: "Directly inhibits factor Xa without antithrombin as cofactor, blocking thrombin generation; single-drug approach without heparin lead-in",
        sideEffects: "Bleeding (GI bleeding higher than warfarin), bruising, anemia, hepatotoxicity (rare)",
        contra: "Active pathological bleeding, severe hepatic disease (Child-Pugh C), CrCl < 15 mL/min, concurrent strong CYP3A4 and P-gp inhibitors",
        pearl: "DVT/PE treatment: 15 mg BID × 21 days then 20 mg daily with food (improves absorption). No heparin bridge needed. Extended secondary prevention: 10 mg daily (EINSTEIN-Extension). Reversal agent: andexanet alfa or 4-factor PCC."
      }
    ],
    pearls: [
      "VTE prophylaxis is the #1 preventable cause of hospital death — every admitted patient should have VTE risk assessment documented and appropriate prophylaxis ordered within 24 hours",
      "Age-adjusted D-dimer (age × 10 μg/L for patients > 50) reduces false positives by 30-40% in elderly patients without decreasing sensitivity for VTE",
      "Heparin-induced thrombocytopenia (HIT) should be suspected when platelet count drops > 50% from baseline 5-14 days after heparin exposure — calculate 4T score and switch to argatroban or fondaparinux immediately"
    ],
    quiz: [
      {
        question: "A 62-year-old undergoes elective total hip replacement. When should VTE prophylaxis begin and for how long?",
        options: [
          "Enoxaparin 40 mg SC starting 6-12 hours post-op for 10-14 days",
          "Aspirin 81 mg daily starting on post-op day 1 for 6 weeks",
          "Enoxaparin 40 mg SC starting 12 hours pre-op for 28-35 days",
          "Rivaroxaban 10 mg daily starting 6-10 hours post-op for 35 days"
        ],
        correct: 3,
        rationale: "Current guidelines recommend extended VTE prophylaxis (28-35 days) after total hip replacement due to persistent VTE risk beyond hospitalization. Rivaroxaban 10 mg daily is approved for post-orthopedic surgery prophylaxis, started 6-10 hours post-operatively. LMWH with extended duration is also acceptable."
      }
    ]
  },
  "brugada-syndrome-np": {
    title: "Brugada Syndrome: ECG Patterns & Risk Stratification",
    cellular: {
      title: "Sodium Channelopathy in Brugada Syndrome",
      content: "Brugada syndrome is an inherited cardiac channelopathy caused primarily by loss-of-function mutations in the SCN5A gene encoding the cardiac sodium channel Nav1.5. Reduced sodium current (INa) in the right ventricular outflow tract (RVOT) epicardium creates a transmural voltage gradient during the action potential plateau (phase 2). This gradient produces the characteristic ST elevation in leads V1-V3 and creates substrate for phase 2 re-entry, potentially triggering polymorphic VT or VF. The condition is autosomal dominant with incomplete penetrance, predominantly affecting males (8:1 ratio, possibly due to testosterone effects on ion channel expression). Arrhythmic events typically occur during rest, sleep, or fever (further reduces INa)."
    },
    riskFactors: [
      "SCN5A mutation (found in ~20-25% of clinically diagnosed cases)",
      "Male sex (8:1 male predominance in clinical presentation)",
      "Family history of sudden cardiac death, especially nocturnal or at young age",
      "Fever (unmasks Brugada pattern and increases arrhythmic risk — antipyretics critical)",
      "Sodium channel-blocking drugs: class I antiarrhythmics, TCAs, lithium, cocaine",
      "Excessive alcohol intake and large meals (vagal stimulation)",
      "Southeast Asian descent (higher prevalence in Thailand, Philippines, Japan)",
      "Electrolyte imbalances: hyperkalemia, hypercalcemia"
    ],
    diagnostics: [
      "12-lead ECG with V1-V2 placed in 2nd and 3rd intercostal spaces: Type 1 (coved ST elevation >= 2 mm with T-wave inversion — diagnostic)",
      "Type 2 (saddleback ST elevation) and Type 3 are not diagnostic alone — require provocation test",
      "Ajmaline or procainamide provocation test to unmask Type 1 pattern if baseline ECG non-diagnostic",
      "Genetic testing for SCN5A mutation (positive in ~25%; negative result does not exclude diagnosis)",
      "Electrophysiology study (EPS) with programmed ventricular stimulation — controversial for risk stratification",
      "ECG during fever episodes to detect intermittent Brugada pattern",
      "Family screening with ECG and genetic testing for first-degree relatives",
      "Rule out structural heart disease with echocardiography and cardiac MRI"
    ],
    management: [
      "ICD implantation for survivors of cardiac arrest (secondary prevention) or documented sustained VT/VF",
      "ICD implantation considered for spontaneous Type 1 ECG pattern with syncope (high-risk)",
      "Aggressive fever management with acetaminophen for all Brugada patients (fever is a major trigger)",
      "Avoid all drugs on the Brugada drugs-to-avoid list (brugadadrugs.org): class I antiarrhythmics, TCAs, lithium, propofol, cocaine",
      "Quinidine (class IA antiarrhythmic that augments Ito current) for patients with ICD and frequent shocks or as alternative when ICD is refused/contraindicated",
      "Isoproterenol IV for electrical storm in Brugada syndrome (increases ICa-L, counteracting the Ito/INa imbalance)",
      "Epicardial ablation of RVOT substrate for recurrent VF despite medications",
      "Genetic counseling for family members — autosomal dominant inheritance with variable expressivity"
    ],
    nursingActions: [
      "Educate patients on fever management: take temperature with any illness, start antipyretics early, seek medical attention if febrile",
      "Provide Brugada drug avoidance list and educate to check all new medications (including OTC) against brugadadrugs.org",
      "Teach ICD self-care: wound care, activity restrictions post-implant, how to respond to shocks, driving restrictions",
      "Screen family members: arrange ECGs and genetic counseling for first-degree relatives",
      "Monitor during any procedures requiring anesthesia — avoid propofol, use alternative agents",
      "Assess for syncope history, palpitations, and nocturnal agonal breathing in patient and family",
      "Coordinate cardiology follow-up for ICD interrogation and device management",
      "Educate on avoidance of excessive alcohol and large carbohydrate-heavy meals (vagal triggers)"
    ],
    signs: {
      left: [
        "Asymptomatic Type 1 Brugada pattern detected incidentally on ECG",
        "Drug-induced Brugada pattern that normalizes after medication discontinuation",
        "No personal or family history of syncope or sudden death",
        "Negative electrophysiology study"
      ],
      right: [
        "Aborted sudden cardiac death from VF",
        "Syncope with spontaneous Type 1 ECG pattern (high risk for SCD)",
        "Electrical storm with multiple VF episodes requiring isoproterenol",
        "Nocturnal agonal breathing reported by bed partner"
      ]
    },
    medications: [
      {
        name: "Quinidine",
        type: "Class IA Antiarrhythmic",
        action: "Blocks both INa and Ito (transient outward potassium current); restoring the transmural voltage gradient in RVOT epicardium that generates the Brugada ECG pattern",
        sideEffects: "QT prolongation (risk of torsades), GI upset (diarrhea, nausea), cinchonism (tinnitus, headache), thrombocytopenia",
        contra: "Baseline QTc prolongation, complete heart block, hypokalemia, concurrent QT-prolonging medications",
        pearl: "Only oral antiarrhythmic with evidence for Brugada syndrome. Dose 300-600 mg BID. Monitor QTc (hold if > 500 ms). Availability is limited in some regions. Used when ICD is contraindicated, refused, or for ICD storm reduction."
      },
      {
        name: "Isoproterenol",
        type: "Non-selective Beta-Adrenergic Agonist",
        action: "Stimulates beta-1 and beta-2 receptors, increasing ICa-L current which counteracts the outward current predominance (Ito > INa) causing the Brugada ECG pattern and suppresses VF",
        sideEffects: "Tachycardia, hypotension, tremor, palpitations, angina in CAD patients",
        contra: "Tachyarrhythmias from other causes, digitalis toxicity, hypertrophic obstructive cardiomyopathy",
        pearl: "Drug of choice for VF storm in Brugada syndrome. Start 1-3 mcg/min IV, titrate to suppress VF. Normalizes the Brugada ECG pattern. Temporizing measure until definitive therapy (ablation or quinidine). Not for chronic use."
      }
    ],
    pearls: [
      "Brugada syndrome is the leading cause of sudden cardiac death in young adults in Southeast Asia — maintain high suspicion in patients of Thai, Filipino, or Japanese descent with syncope or nocturnal agonal breathing",
      "Fever is the most common trigger for arrhythmic events — ALL Brugada patients must be educated to aggressively treat fever with acetaminophen and seek care for febrile illness",
      "Always check brugadadrugs.org before prescribing any medication to a Brugada patient — common offenders include class I antiarrhythmics, TCAs, lithium, propofol, and even some antiemetics"
    ],
    quiz: [
      {
        question: "A 35-year-old male from Thailand presents after a syncopal episode during sleep. ECG shows coved ST elevation in V1-V3 with T-wave inversion (Type 1 Brugada pattern). Echo is normal. What is the most appropriate next step?",
        options: [
          "Start metoprolol for arrhythmia suppression",
          "Refer for ICD implantation",
          "Prescribe flecainide for rhythm control",
          "Observe with serial ECGs every 6 months"
        ],
        correct: 1,
        rationale: "Spontaneous Type 1 Brugada pattern with syncope is a high-risk combination — ICD implantation is recommended for secondary prevention of sudden cardiac death. Beta-blockers are not effective in Brugada syndrome. Flecainide (class IC sodium channel blocker) is absolutely contraindicated as it worsens the Brugada pattern."
      }
    ]
  },
  "long-qt-syndrome-np": {
    title: "Long QT Syndrome: Genetics & Torsades de Pointes",
    cellular: {
      title: "Ion Channel Dysfunction in Long QT Syndrome",
      content: "Long QT syndrome (LQTS) results from delayed ventricular repolarization due to ion channel dysfunction, prolonging the QT interval and creating substrate for early afterdepolarizations (EADs) that trigger torsades de pointes (TdP). Congenital LQTS subtypes: LQT1 (KCNQ1 mutation, reduced IKs — events with exercise/swimming), LQT2 (KCNH2/hERG mutation, reduced IKr — events with auditory stimuli/emotional stress), LQT3 (SCN5A gain-of-function mutation, increased late INa — events at rest/sleep). Acquired LQTS results from drugs blocking IKr (hERG channel): antiarrhythmics (sotalol, dofetilide), antibiotics (azithromycin, fluoroquinolones), antipsychotics (haloperidol), and antiemetics (ondansetron). Hypokalemia and hypomagnesemia reduce IKr and increase TdP risk. QTc prolongation > 500 ms or increase > 60 ms from baseline significantly increases TdP risk."
    },
    riskFactors: [
      "Congenital mutations: KCNQ1 (LQT1), KCNH2 (LQT2), SCN5A (LQT3) — autosomal dominant (Romano-Ward) or recessive (Jervell and Lange-Nielsen with deafness)",
      "QT-prolonging medications (crediblemeds.org for comprehensive list)",
      "Electrolyte abnormalities: hypokalemia (< 3.5 mEq/L), hypomagnesemia (< 1.5 mg/dL), hypocalcemia",
      "Female sex (longer baseline QTc, higher TdP risk with drugs)",
      "Bradycardia (longer diastolic intervals increase EAD probability)",
      "Structural heart disease with reduced LVEF",
      "Hepatic or renal impairment (reduced drug metabolism/clearance)",
      "Concomitant CYP3A4 or CYP2D6 inhibitors with QT-prolonging drugs"
    ],
    diagnostics: [
      "12-lead ECG with manual QTc measurement (use Bazett formula: QTc = QT/√RR; interpret cautiously at extreme heart rates)",
      "QTc thresholds: normal < 450 ms males, < 460 ms females; prolonged > 470 ms males, > 480 ms females; high risk > 500 ms",
      "Schwartz diagnostic score for congenital LQTS (ECG criteria, clinical history, family history)",
      "Genetic testing for KCNQ1, KCNH2, SCN5A and other LQTS genes — positive in ~75% of clinical LQTS",
      "Exercise stress test: paradoxical QT prolongation during recovery suggests LQT1 or LQT2",
      "Holter monitoring for intermittent QT prolongation and T-wave morphology changes",
      "Epinephrine QT stress test if diagnosis uncertain with baseline ECG",
      "Serum electrolytes: K+, Mg2+, Ca2+ — correct deficiencies before interpreting QTc"
    ],
    management: [
      "Beta-blocker therapy for all symptomatic congenital LQTS: nadolol 1-2 mg/kg/day (preferred) or propranolol (avoid metoprolol — less effective for LQTS)",
      "Avoid all QT-prolonging medications and check crediblemeds.org before prescribing any new drug",
      "Maintain K+ > 4.0 mEq/L and Mg2+ > 2.0 mg/dL — aggressive electrolyte replacement",
      "ICD implantation for cardiac arrest survivors, syncope despite beta-blockers, or QTc > 500 ms with LQT2 or LQT3",
      "Left cardiac sympathetic denervation (LCSD) for patients with recurrent events despite beta-blockers who refuse or cannot have ICD",
      "Acute TdP management: IV magnesium 2 g bolus (even with normal Mg levels), overdrive pacing or isoproterenol to increase HR and shorten QT",
      "Genotype-specific lifestyle modifications: LQT1 avoid competitive swimming; LQT2 avoid alarm clocks and sudden auditory stimuli; LQT3 avoid sleep in complete silence",
      "Mexiletine (sodium channel blocker) for LQT3 specifically — shortens QTc by reducing late INa"
    ],
    nursingActions: [
      "Measure QTc manually on every ECG — automated measurements are frequently inaccurate",
      "Review medication list for QT-prolonging drugs at every encounter using crediblemeds.org",
      "Ensure electrolyte replacement protocols maintain K+ > 4.0 and Mg2+ > 2.0",
      "Educate patients and families on genotype-specific triggers and avoidance strategies",
      "Counsel on medication adherence with beta-blockers — abrupt cessation increases arrhythmia risk",
      "Screen first-degree family members with ECG and consider genetic testing",
      "Advise patients to carry medical alert identification noting LQTS diagnosis",
      "In hospitalized patients on QT-prolonging drugs: ECG before and after initiation, repeat if QTc increases > 60 ms"
    ],
    signs: {
      left: [
        "Asymptomatic QTc prolongation detected on routine ECG",
        "Borderline QTc (450-470 ms) with no symptoms or family history",
        "Well-controlled on beta-blocker therapy without ICD shocks",
        "Positive genetic test with normal QTc (concealed LQTS)"
      ],
      right: [
        "Torsades de pointes: polymorphic VT with 'twisting of the points' pattern",
        "Syncope or near-syncope during typical triggers (exercise, startle, sleep)",
        "Cardiac arrest from degeneration of TdP to VF",
        "Recurrent ICD shocks despite beta-blocker therapy"
      ]
    },
    medications: [
      {
        name: "Nadolol",
        type: "Non-selective Beta Blocker",
        action: "Blocks beta-1 and beta-2 receptors, reducing catecholamine-triggered EADs; reduces heart rate allowing more complete repolarization; preferred beta-blocker for LQTS",
        sideEffects: "Bradycardia, fatigue, exercise intolerance, bronchospasm, hypoglycemia masking",
        contra: "Severe sinus bradycardia, 2nd/3rd degree heart block, decompensated HF, severe asthma",
        pearl: "Nadolol is preferred over metoprolol for LQTS based on outcome data showing better event reduction. Long half-life allows once-daily dosing improving adherence. Dose 1-2 mg/kg/day. Target HR < 70 bpm."
      },
      {
        name: "IV Magnesium Sulfate",
        type: "Electrolyte/Antiarrhythmic",
        action: "Stabilizes cardiac membrane potential, blocks EADs, and terminates TdP through suppression of L-type calcium current and enhancement of outward potassium currents",
        sideEffects: "Flushing, hypotension, respiratory depression (high doses), hypermagnesemia symptoms",
        contra: "Severe renal failure (accumulation risk), heart block, respiratory depression",
        pearl: "First-line acute treatment for TdP regardless of serum magnesium level. Give 2 g IV over 2-5 minutes, may repeat. Works even when Mg2+ is normal. If TdP persists, initiate overdrive pacing to increase heart rate and shorten QT interval."
      }
    ],
    pearls: [
      "IV magnesium is the first-line acute treatment for torsades de pointes even when serum magnesium is normal — do not wait for lab results before administering",
      "Metoprolol should NOT be used for congenital LQTS — studies show it is less effective than nadolol and propranolol at preventing cardiac events in LQTS patients",
      "Congenital LQTS genotype determines triggers: LQT1 = exercise/swimming, LQT2 = auditory stimuli/emotional stress, LQT3 = rest/sleep — this is critical for patient-specific counseling"
    ],
    quiz: [
      {
        question: "A patient with known LQT2 is found to have QTc 520 ms on routine ECG. She is on nadolol and has had two syncopal episodes in the past year triggered by her alarm clock. What is the next best step?",
        options: [
          "Increase nadolol dose to maximum tolerated",
          "Refer for ICD implantation",
          "Switch to metoprolol for better tolerability",
          "Add mexiletine as adjunct therapy"
        ],
        correct: 1,
        rationale: "Recurrent syncope despite beta-blocker therapy with QTc > 500 ms in LQT2 is high-risk for sudden cardiac death. ICD implantation is indicated. Metoprolol is inferior to nadolol for LQTS. Mexiletine is specific to LQT3 (reduces late INa). Increasing nadolol may help but ICD is needed given breakthrough events."
      }
    ]
  },
  "takotsubo-cardiomyopathy-np": {
    title: "Takotsubo Cardiomyopathy: Stress-Induced",
    cellular: {
      title: "Catecholamine-Mediated Myocardial Stunning",
      content: "Takotsubo cardiomyopathy (stress cardiomyopathy, broken heart syndrome) is characterized by transient LV systolic dysfunction with apical ballooning in the absence of obstructive coronary artery disease. The pathophysiology involves catecholamine surge from emotional or physical stress causing direct myocardial toxicity. Supraphysiological catecholamine levels activate beta-2 adrenergic receptors in the apical myocardium (which has higher beta-2 receptor density) switching from Gs to Gi protein signaling, producing negative inotropy. Catecholamines also cause epicardial coronary vasospasm and microvascular dysfunction. Oxidative stress from catecholamine metabolism generates reactive oxygen species causing myocyte stunning. The condition predominantly affects postmenopausal women (90% of cases), suggesting that estrogen withdrawal removes cardioprotective effects against catecholamine toxicity."
    },
    riskFactors: [
      "Postmenopausal women (> 90% of cases; mean age 65-70 years)",
      "Acute emotional stress: bereavement, conflict, financial crisis, surprise events",
      "Acute physical stress: surgery, ICU admission, sepsis, respiratory failure, seizure",
      "Pheochromocytoma or exogenous catecholamine administration",
      "Neurological conditions: subarachnoid hemorrhage, stroke, head trauma",
      "Psychiatric disorders: anxiety, depression (increased baseline sympathetic tone)",
      "Thyrotoxicosis",
      "Concurrent critical illness or acute medical conditions"
    ],
    diagnostics: [
      "12-lead ECG: ST elevation (mimics STEMI), T-wave inversion, QTc prolongation; evolves over days",
      "Troponin elevated but disproportionately low relative to degree of wall motion abnormality (unlike STEMI)",
      "Echocardiogram: apical ballooning with basal hyperkinesis ('takotsubo' or octopus trap pattern); LVEF typically 20-40%",
      "Coronary angiography: absence of obstructive CAD (required to exclude ACS); often performed emergently due to STEMI-like presentation",
      "Left ventriculography: classic apical ballooning pattern",
      "BNP/NT-proBNP markedly elevated (often > 1000 pg/mL)",
      "Cardiac MRI: myocardial edema on T2-weighted imaging without late gadolinium enhancement (differentiates from myocarditis)",
      "InterTAK diagnostic score for clinical probability assessment"
    ],
    management: [
      "Supportive care: most patients recover LVEF within 4-8 weeks",
      "Treat HF symptoms: diuretics for pulmonary congestion, ACEi or ARB (reduce afterload and block RAAS activation)",
      "Avoid catecholamines (dobutamine, norepinephrine) if possible — may worsen condition",
      "For cardiogenic shock: mechanical circulatory support (IABP or Impella) preferred over inotropes",
      "Anticoagulation for LV thrombus prevention if severe apical akinesis (typically 3 months)",
      "Beta-blockers: role is controversial in acute phase but may be considered after recovery to prevent recurrence",
      "Monitor and treat complications: LVOT obstruction (reduce preload cautiously), arrhythmias (QTc monitoring for TdP risk), RV involvement",
      "Address and treat underlying emotional or physical trigger; refer for psychological support"
    ],
    nursingActions: [
      "Initiate continuous cardiac monitoring — TdP risk due to QTc prolongation",
      "Monitor hemodynamic status closely: many patients develop cardiogenic shock acutely",
      "Assess for dynamic LVOT obstruction: avoid volume depletion and inotropes which worsen obstruction",
      "Provide emotional support and reassure patient about expected recovery (90%+ recover full LVEF)",
      "Monitor serial troponins and echocardiography to track recovery",
      "Educate on stress management and trigger avoidance strategies",
      "Arrange follow-up echocardiography at 4-6 weeks to confirm LVEF recovery",
      "Screen for recurrence (10-15% lifetime recurrence risk)"
    ],
    signs: {
      left: [
        "Chest pain and dyspnea after emotional or physical stressor",
        "ST changes on ECG with modest troponin elevation",
        "Apical ballooning on echo with LVEF 30-40%",
        "Hemodynamically stable with mild congestion"
      ],
      right: [
        "Cardiogenic shock with severe LVEF depression requiring mechanical support",
        "LV thrombus formation in akinetic apex",
        "Dynamic LVOT obstruction causing severe hypotension (worsened by inotropes)",
        "Torsades de pointes from QTc prolongation > 500 ms"
      ]
    },
    medications: [
      {
        name: "Lisinopril/Ramipril",
        type: "ACE Inhibitor",
        action: "Blocks angiotensin-converting enzyme, reducing angiotensin II and aldosterone; decreases afterload and prevents adverse remodeling during recovery phase",
        sideEffects: "Dry cough, hyperkalemia, angioedema, hypotension, renal impairment",
        contra: "Bilateral renal artery stenosis, pregnancy, angioedema history, SBP < 90",
        pearl: "Used for afterload reduction and remodeling prevention in takotsubo. Typically continued for 3-6 months until full LVEF recovery. May reduce recurrence risk though evidence is limited."
      },
      {
        name: "Heparin (anticoagulation for LV thrombus prevention)",
        type: "Unfractionated Heparin or LMWH",
        action: "Binds antithrombin III, inhibiting thrombin and factor Xa, preventing thrombus formation in akinetic LV apex",
        sideEffects: "Bleeding, HIT, osteoporosis with prolonged use",
        contra: "Active bleeding, severe thrombocytopenia, HIT history",
        pearl: "Consider anticoagulation when severe apical akinesis is present due to LV thrombus risk (~2-5%). Screen with serial echo. If thrombus forms, anticoagulate for minimum 3 months and confirm resolution on repeat imaging."
      }
    ],
    pearls: [
      "Takotsubo can be fatal — in-hospital mortality is 4-5%, similar to STEMI, due to cardiogenic shock, arrhythmias, and mechanical complications",
      "Avoid inotropes (dobutamine, milrinone) in takotsubo cardiogenic shock — they can worsen LVOT obstruction and further increase catecholamine toxicity; mechanical support is preferred",
      "Recurrence rate is 10-15% lifetime — there is no proven pharmacological prevention, but stress management and possibly beta-blockers may reduce risk"
    ],
    quiz: [
      {
        question: "A 68-year-old woman presents with chest pain and ST elevation in V2-V6 after receiving news of a family member's death. Troponin is mildly elevated. Coronary angiography shows no obstructive disease. Echo shows apical ballooning with LVEF 25%. She is hypotensive (BP 80/50). What is the best hemodynamic support strategy?",
        options: [
          "Start dobutamine infusion at 5 mcg/kg/min",
          "Initiate norepinephrine 0.1 mcg/kg/min",
          "Place intra-aortic balloon pump (IABP) for mechanical support",
          "Bolus IV fluids 2 liters normal saline"
        ],
        correct: 2,
        rationale: "In takotsubo cardiogenic shock, catecholamines (dobutamine, norepinephrine) may worsen the condition by exacerbating the catecholamine toxicity driving the cardiomyopathy. Mechanical circulatory support (IABP or Impella) is preferred. Aggressive fluid administration can worsen pulmonary edema and may exacerbate LVOT obstruction."
      }
    ]
  },
  "infective-endocarditis-advanced-np": {
    title: "Infective Endocarditis: Duke Criteria & Surgical Indications",
    cellular: {
      title: "Vegetation Formation and Valvular Destruction",
      content: "Infective endocarditis (IE) begins with bacteremia seeding damaged or prosthetic valvular endothelium. Turbulent blood flow at damaged valve surfaces deposits platelets and fibrin, forming nonbacterial thrombotic endocarditis (NBTE). During transient bacteremia (dental procedures, IV drug use, invasive procedures), organisms adhere to NBTE via surface adhesins (e.g., S. aureus fibronectin-binding proteins, viridans streptococci dextran). Bacteria become encased in fibrin-platelet matrix forming vegetations — these are relatively protected from host immune defenses and antibiotic penetration. Vegetations cause valvular destruction (regurgitation), embolic phenomena (stroke, splenic infarcts, Janeway lesions), and immune complex deposition (glomerulonephritis, Osler nodes, Roth spots). Native valve IE is most commonly caused by viridans streptococci (subacute) or S. aureus (acute). Prosthetic valve IE within 60 days is typically coagulase-negative staphylococci."
    },
    riskFactors: [
      "Prosthetic heart valve or valve repair material",
      "Prior infective endocarditis",
      "IV drug use (S. aureus tricuspid valve IE)",
      "Congenital heart disease (especially unrepaired cyanotic CHD)",
      "Poor dental hygiene with chronic periodontitis",
      "Intracardiac devices: pacemaker, ICD leads",
      "Immunosuppression: HIV, chronic steroid use, transplant recipients",
      "Chronic hemodialysis (frequent vascular access)"
    ],
    diagnostics: [
      "Modified Duke Criteria: 2 major, 1 major + 3 minor, or 5 minor criteria for definite IE",
      "Major: positive blood cultures (2 separate cultures with typical organism) and echocardiographic evidence (vegetation, abscess, new valvular regurgitation)",
      "Minor: predisposing condition, fever > 38°C, vascular phenomena (Janeway lesions, mycotic aneurysm, intracranial hemorrhage), immunologic phenomena (Osler nodes, Roth spots, glomerulonephritis, positive RF)",
      "Blood cultures x3 sets from separate venipuncture sites before antibiotics (sensitivity ~95% for non-HACEK organisms)",
      "TTE first; TEE if TTE negative but clinical suspicion high (TEE sensitivity > 90% for vegetations)",
      "TEE mandatory for prosthetic valve IE, suspected periannular abscess, or complicated IE",
      "CT head if neurological symptoms; CT chest/abdomen for septic emboli",
      "CBC (anemia of chronic disease, leukocytosis), ESR/CRP (markedly elevated), urinalysis (hematuria from immune complex GN)"
    ],
    management: [
      "Empiric IV antibiotics after 3 sets of blood cultures: vancomycin + ceftriaxone (native valve) or vancomycin + gentamicin + rifampin (prosthetic valve)",
      "Targeted therapy based on culture: native valve viridans strep — penicillin G or ceftriaxone 4 weeks; S. aureus MSSA — nafcillin/oxacillin 6 weeks",
      "MRSA native valve IE: vancomycin IV 4-6 weeks (target trough 15-20 mcg/mL) or daptomycin 8-10 mg/kg/day",
      "Prosthetic valve IE: 6 weeks minimum of IV antibiotics; S. aureus PVE requires vancomycin + gentamicin + rifampin",
      "Surgical indications: severe valvular dysfunction with HF, paravalvular abscess, persistent bacteremia > 5-7 days on appropriate antibiotics, recurrent emboli despite antibiotics, large mobile vegetations > 10 mm",
      "IVDU with right-sided IE: may complete shorter courses (2 weeks) for uncomplicated tricuspid S. aureus IE",
      "Dental evaluation and treatment during antibiotic therapy",
      "Anticoagulation management: hold warfarin in mechanical valve IE with CNS emboli (high ICH risk); discuss risk-benefit"
    ],
    nursingActions: [
      "Obtain 3 sets of blood cultures from separate sites before any antibiotic administration",
      "Administer IV antibiotics on schedule — bactericidal activity depends on sustained drug levels above MIC",
      "Assess for embolic phenomena daily: new neurological deficits, splinter hemorrhages, Janeway lesions, Osler nodes, flank pain (splenic infarct)",
      "Monitor for HF progression: daily weights, I&O, lung sounds, JVP, new or worsening murmur",
      "Arrange PICC line or midline for prolonged IV antibiotic course; teach outpatient IV antibiotic administration if eligible for OPAT",
      "Monitor renal function with vancomycin/gentamicin: trough levels, creatinine, daily gentamicin peak and trough",
      "Educate on lifelong endocarditis prophylaxis: dental hygiene, prophylactic antibiotics before dental procedures",
      "Coordinate cardiac surgery consultation if surgical indications present"
    ],
    signs: {
      left: [
        "Low-grade fever with new or changing murmur (subacute presentation)",
        "Nonspecific symptoms: malaise, weight loss, night sweats, arthralgias",
        "Osler nodes (tender nodules on fingertips) and splinter hemorrhages",
        "Positive blood cultures with typical organism"
      ],
      right: [
        "Acute HF from severe valvular destruction (flash pulmonary edema)",
        "Septic shock with hemodynamic instability",
        "Stroke from septic embolization of cerebral vessels",
        "Periannular abscess with conduction abnormalities (new heart block on ECG)"
      ]
    },
    medications: [
      {
        name: "Ceftriaxone",
        type: "Third-Generation Cephalosporin",
        action: "Binds penicillin-binding proteins (PBPs), inhibiting cell wall synthesis; bactericidal against viridans streptococci and HACEK organisms",
        sideEffects: "Diarrhea, C. difficile infection, biliary sludge/pseudolithiasis, allergic reactions",
        contra: "Severe penicillin allergy (type I hypersensitivity), concurrent IV calcium in neonates",
        pearl: "Standard treatment for native valve viridans streptococcal IE: 2 g IV daily × 4 weeks. Can shorten to 2 weeks with added gentamicin if highly susceptible (MIC < 0.12). Convenient once-daily dosing makes it ideal for OPAT."
      },
      {
        name: "Vancomycin IV",
        type: "Glycopeptide Antibiotic",
        action: "Binds D-Ala-D-Ala terminus of peptidoglycan precursors, inhibiting cell wall synthesis; bactericidal against gram-positive organisms including MRSA",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated — slow infusion rate), ototoxicity, thrombocytopenia",
        contra: "Known vancomycin hypersensitivity",
        pearl: "IE dosing: 15-20 mg/kg IV q8-12h targeting trough 15-20 mcg/mL (or AUC/MIC 400-600). Monitor renal function and troughs. For MRSA IE, daptomycin 8-10 mg/kg is an alternative with potentially faster bactericidal activity."
      }
    ],
    pearls: [
      "Never start antibiotics before drawing blood cultures — a single dose of antibiotics can render cultures negative for days, delaying diagnosis and targeted therapy",
      "New heart block (prolongation of PR interval or new bundle branch block) in a patient with IE suggests paravalvular abscess — this is a surgical indication requiring urgent TEE and cardiac surgery consultation",
      "Modified Duke Criteria have ~80% sensitivity — a negative TTE does not exclude IE; TEE should be performed whenever clinical suspicion is moderate-to-high, especially with prosthetic valves"
    ],
    quiz: [
      {
        question: "A patient with native valve endocarditis on IV vancomycin for MRSA has persistent fever and positive blood cultures on day 7 of therapy. Echo shows a 12 mm vegetation on the mitral valve. What is the most appropriate next step?",
        options: [
          "Continue current antibiotics and repeat cultures in 3 days",
          "Switch to daptomycin and add rifampin",
          "Refer for urgent cardiac surgery consultation",
          "Add gentamicin to vancomycin for synergy"
        ],
        correct: 2,
        rationale: "Persistent bacteremia > 5-7 days on appropriate antibiotics is a surgical indication in IE. Additionally, large vegetations > 10 mm increase embolic risk. Cardiac surgery consultation is indicated for valve replacement. Gentamicin is not routinely added for native valve S. aureus IE due to nephrotoxicity without survival benefit."
      }
    ]
  },
  "marfan-cardiac-np": {
    title: "Marfan Syndrome Cardiac: Aortic Root & Valve Management",
    cellular: {
      title: "Fibrillin-1 Deficiency and Aortic Pathology",
      content: "Marfan syndrome is an autosomal dominant connective tissue disorder caused by mutations in the FBN1 gene encoding fibrillin-1, a glycoprotein essential for microfibril assembly in the extracellular matrix. Deficient fibrillin-1 leads to impaired sequestration of TGF-beta in the aortic wall, resulting in excessive TGF-beta signaling that drives smooth muscle cell apoptosis, elastin fragmentation, and cystic medial degeneration. The weakened aortic wall progressively dilates, particularly at the aortic root (sinuses of Valsalva), leading to aortic root aneurysm, aortic regurgitation, and risk of life-threatening aortic dissection (Stanford type A). Mitral valve prolapse occurs in 60-80% of patients due to myxomatous degeneration of valve leaflets from abnormal fibrillin-1."
    },
    riskFactors: [
      "FBN1 mutation (autosomal dominant; ~25% de novo mutations)",
      "Aortic root diameter > 5.0 cm (increasing dissection risk significantly)",
      "Family history of aortic dissection at small aortic diameters",
      "Rapid aortic growth rate > 0.5 cm/year",
      "Pregnancy (hemodynamic stress increases dissection risk, especially if root > 4.0 cm)",
      "Hypertension (increases aortic wall stress)",
      "Isometric exercise and heavy weightlifting (acute aortic wall stress)",
      "Associated conditions: ectopia lentis, pectus deformity, dural ectasia"
    ],
    diagnostics: [
      "Revised Ghent nosology for clinical diagnosis: aortic root Z-score >= 2 + ectopia lentis = Marfan (or FBN1 mutation + aortic Z-score >= 2)",
      "Transthoracic echocardiography: aortic root diameter at sinuses of Valsalva, mitral valve prolapse, LV dimensions",
      "CT angiography or MRA of entire aorta: assess root, ascending, descending, and abdominal aorta",
      "Annual echocardiography and periodic cross-sectional aortic imaging for surveillance",
      "Slit-lamp ophthalmological examination for ectopia lentis (lens subluxation)",
      "Genetic testing for FBN1 mutation — assists diagnosis and enables family screening",
      "Skeletal survey: arm span-to-height ratio > 1.05, reduced upper-to-lower segment ratio, wrist and thumb signs",
      "Dural ectasia assessment with MRI spine if needed for systemic score"
    ],
    management: [
      "Beta-blocker therapy: atenolol or metoprolol to reduce dP/dt (rate of aortic wall stress) and slow aortic root dilation",
      "Losartan (ARB) added or as alternative — COMPARE trial showed benefit via TGF-beta pathway blockade",
      "Prophylactic aortic root surgery when root diameter >= 5.0 cm (or >= 4.5 cm with family history of dissection, rapid growth > 0.5 cm/yr, or significant aortic regurgitation)",
      "Valve-sparing root replacement (David procedure) preferred over Bentall procedure in experienced centers",
      "Restrict isometric exercise and competitive sports; allow moderate aerobic activity",
      "Pregnancy counseling: high risk if root > 4.0 cm; close monitoring with serial echo q4-8 weeks if pregnant with root < 4.0 cm",
      "Endocarditis prophylaxis for prosthetic valve or prior IE",
      "Lifelong aortic surveillance even after root surgery (distal aorta remains at risk)"
    ],
    nursingActions: [
      "Monitor BP and HR — ensure beta-blocker therapy achieves target HR < 70 bpm at rest",
      "Educate on activity restrictions: avoid contact sports, isometric exercise, heavy lifting (> 20 lbs)",
      "Emphasize importance of annual echocardiographic surveillance and cardiac imaging adherence",
      "Counsel women of childbearing age on pregnancy risks and need for preconception counseling with cardiology/genetics",
      "Teach recognition of aortic dissection symptoms: sudden severe tearing chest/back pain — seek emergency care immediately",
      "Coordinate genetic counseling for family members (50% offspring risk)",
      "Screen for associated conditions: ophthalmology for ectopia lentis, orthopedics for scoliosis",
      "Ensure medical alert identification noting Marfan syndrome and aortic root dimensions"
    ],
    signs: {
      left: [
        "Tall stature with long limbs and arachnodactyly",
        "Mild aortic root dilation (Z-score 2-3) with no regurgitation",
        "Mitral valve prolapse with mild regurgitation",
        "Stable aortic dimensions on serial imaging"
      ],
      right: [
        "Acute aortic dissection: tearing chest pain radiating to back, BP differential between arms",
        "Severe aortic regurgitation with decompensated HF",
        "Rapid aortic root growth > 0.5 cm/year approaching surgical threshold",
        "Ectopia lentis with visual impairment"
      ]
    },
    medications: [
      {
        name: "Atenolol/Metoprolol",
        type: "Beta-1 Selective Blocker",
        action: "Reduces heart rate and dP/dt (rate of pressure rise in the aorta), decreasing cyclic mechanical stress on the weakened aortic wall; slows rate of aortic root dilation",
        sideEffects: "Fatigue, bradycardia, exercise intolerance, depression, bronchospasm (less with beta-1 selective)",
        contra: "Severe bradycardia, decompensated HF, severe asthma",
        pearl: "Cornerstone of medical therapy in Marfan — multiple studies show slower aortic root dilation. Target resting HR < 70 bpm. Start early regardless of aortic root size. Continue lifelong even after aortic surgery."
      },
      {
        name: "Losartan",
        type: "Angiotensin II Receptor Blocker",
        action: "Blocks AT1 receptor, reducing TGF-beta signaling which is the primary driver of aortic wall degeneration in Marfan syndrome; provides independent aortic protection beyond hemodynamic effects",
        sideEffects: "Hypotension, hyperkalemia, dizziness, teratogenicity",
        contra: "Pregnancy, bilateral renal artery stenosis, hyperkalemia",
        pearl: "COMPARE trial showed additive benefit when added to beta-blocker. May be used alone if beta-blocker intolerant. Theoretical advantage over other ARBs due to TGF-beta blockade. Dose 50-100 mg daily. Contraindicated in pregnancy."
      }
    ],
    pearls: [
      "Aortic dissection is the leading cause of death in Marfan syndrome — prophylactic aortic root surgery when diameter reaches 5.0 cm reduces dissection risk dramatically",
      "Pregnancy with Marfan syndrome requires preconception counseling: if aortic root > 4.0 cm, advise against pregnancy; if < 4.0 cm, monitor with echo every 4-8 weeks throughout pregnancy",
      "Even after aortic root surgery, patients remain at lifelong risk for dissection of the descending aorta — annual cross-sectional aortic imaging is mandatory"
    ],
    quiz: [
      {
        question: "A 28-year-old woman with Marfan syndrome wants to become pregnant. Her aortic root measures 4.3 cm. She is on atenolol and losartan. What is the most appropriate counseling?",
        options: [
          "Proceed with pregnancy; monitor aortic root monthly with echo",
          "Advise against pregnancy — recommend adoption or surrogacy due to elevated dissection risk",
          "Continue current medications and proceed with pregnancy",
          "Switch to amlodipine and proceed with pregnancy"
        ],
        correct: 1,
        rationale: "An aortic root > 4.0 cm in Marfan syndrome carries significant dissection risk during pregnancy (hemodynamic changes increase aortic wall stress). Guidelines recommend counseling against pregnancy when root > 4.0 cm. Additionally, losartan is teratogenic and must be stopped before conception. Prophylactic aortic root surgery before pregnancy may be considered."
      }
    ]
  },
  "constrictive-pericarditis-np": {
    title: "Constrictive Pericarditis: Differentiation & Management",
    cellular: {
      title: "Pericardial Fibrosis and Diastolic Impairment",
      content: "Constrictive pericarditis results from chronic pericardial inflammation leading to fibrosis, thickening, and sometimes calcification of the pericardium. The rigid pericardial shell restricts diastolic filling of all cardiac chambers. Early diastolic filling is rapid (pericardial recoil creates suction effect), but abruptly stops when ventricular volume reaches the constraint of the non-compliant pericardium ('dip and plateau' or 'square root sign' on hemodynamics). Ventricular interdependence is enhanced: inspiration increases RV filling but the rigid pericardium prevents total cardiac volume change, so the septum shifts leftward, reducing LV filling. This manifests as Kussmaul's sign (paradoxical rise in JVP with inspiration). The key clinical distinction is from restrictive cardiomyopathy, which has similar hemodynamics but different treatment (pericardiectomy vs medical)."
    },
    riskFactors: [
      "Prior cardiac surgery (most common cause in developed countries)",
      "Prior radiation therapy (breast cancer, Hodgkin lymphoma — latency 5-20 years)",
      "Tuberculosis (most common cause globally)",
      "Idiopathic/viral pericarditis with recurrent episodes",
      "Connective tissue diseases: SLE, rheumatoid arthritis, scleroderma",
      "Uremic pericarditis in ESRD",
      "Post-MI Dressler syndrome",
      "Trauma or hemopericardium"
    ],
    diagnostics: [
      "Physical exam: elevated JVP with prominent y descent, Kussmaul sign, pericardial knock (high-pitched early diastolic sound)",
      "Echocardiography: septal bounce (respiratory shift), preserved LVEF, medial e' velocity > lateral (annulus reversus), IVC plethora",
      "CT chest: pericardial thickening > 4 mm, pericardial calcification (absent in ~20% of constrictive cases)",
      "Cardiac MRI: pericardial thickening and enhancement, real-time cine showing septal shift with respiration",
      "Right heart catheterization: equalization of diastolic pressures (RA, RV, PA diastolic, PCWP within 5 mmHg), dip-and-plateau ('square root sign')",
      "Catheterization with simultaneous LV/RV pressures showing discordant respiratory variation (ventricular interdependence — key differentiator from restrictive)",
      "BNP typically < 200 pg/mL in constrictive (vs markedly elevated in restrictive cardiomyopathy)",
      "CBC, ESR/CRP, TSH, ANA, TB testing to identify underlying cause"
    ],
    management: [
      "Definitive treatment: pericardiectomy (complete pericardial resection) for symptomatic constrictive pericarditis",
      "Medical therapy: diuretics for volume overload (use cautiously — these patients are preload-dependent)",
      "Anti-inflammatory trial with colchicine ± corticosteroids for subacute/transient constrictive pericarditis (may resolve without surgery if recent onset < 3-6 months)",
      "Treat underlying cause: anti-TB therapy for tuberculous pericarditis, dialysis optimization for uremic",
      "Pericardiectomy carries 5-10% operative mortality; outcomes best when done before severe hepatic congestion or cardiac cachexia",
      "Post-radiation constrictive pericarditis has worst surgical outcomes (concurrent myocardial fibrosis limits benefit)",
      "Salt and fluid restriction (< 2 g sodium, < 1.5 L fluid daily)",
      "Avoid negative inotropes and vasodilators — these patients depend on tachycardia and preload to maintain output"
    ],
    nursingActions: [
      "Assess JVP at 30-45° angle — elevated JVP with prominent y descent and Kussmaul sign are hallmark findings",
      "Monitor for pericardial knock on auscultation — a high-pitched early diastolic sound distinct from S3",
      "Track daily weights and fluid balance — diuretic use must balance decongestion with preload dependence",
      "Assess hepatic congestion: hepatomegaly, ascites, elevated liver enzymes, jaundice",
      "Pre-operative preparation for pericardiectomy: nutritional optimization, coagulation assessment, transfusion planning",
      "Post-pericardiectomy: monitor for low cardiac output syndrome (may take days-weeks for heart to accommodate increased diastolic filling)",
      "Educate patient on sodium/fluid restriction and weight monitoring",
      "Screen for TB with PPD/IGRA and chest imaging if etiology is unclear"
    ],
    signs: {
      left: [
        "Fatigue and mild exercise intolerance with elevated JVP",
        "Mild peripheral edema responsive to low-dose diuretics",
        "Pericardial thickening on imaging without calcification",
        "Mild ascites with normal liver function"
      ],
      right: [
        "Severe biventricular failure: massive ascites, hepatomegaly, anasarca",
        "Cardiac cirrhosis from chronic hepatic congestion",
        "Cardiac cachexia from protein-losing enteropathy",
        "Low cardiac output with exercise despite preserved LVEF"
      ]
    },
    medications: [
      {
        name: "Colchicine",
        type: "Anti-inflammatory (microtubule inhibitor)",
        action: "Inhibits microtubule polymerization, reducing neutrophil migration and NLRP3 inflammasome activation; decreases pericardial inflammation and may allow resolution of transient constriction",
        sideEffects: "Diarrhea, nausea, vomiting, myelosuppression (rare), myopathy, rhabdomyolysis (with statin interaction)",
        contra: "Severe renal impairment (CrCl < 30 — dose reduce), severe hepatic disease, concurrent strong CYP3A4 inhibitors",
        pearl: "Trial of colchicine 0.5 mg BID for 3-6 months is appropriate for subacute constrictive pericarditis (recent onset). If hemodynamics improve, constriction may be transient and pericardiectomy can be avoided. Always check for statin interaction."
      },
      {
        name: "Furosemide (low-dose)",
        type: "Loop Diuretic",
        action: "Inhibits Na-K-2Cl transporter in ascending limb, promoting natriuresis to reduce hepatic congestion and ascites",
        sideEffects: "Hypokalemia, dehydration, metabolic alkalosis, pre-renal azotemia",
        contra: "Anuria, severe hypovolemia",
        pearl: "Use cautiously in constrictive pericarditis — excessive diuresis drops preload and can precipitate low cardiac output. Start low (20 mg daily) and titrate slowly. These patients maintain output through tachycardia and adequate preload."
      }
    ],
    pearls: [
      "Constrictive pericarditis vs restrictive cardiomyopathy: medial e' > lateral (annulus reversus) favors constriction; BNP < 200 favors constriction; discordant ventricular pressures with respiration is definitive for constriction on catheterization",
      "Not all pericardial constriction requires surgery — transient constrictive pericarditis (recent onset, elevated CRP) may resolve with anti-inflammatory therapy within 3-6 months",
      "Kussmaul's sign (JVP rises with inspiration instead of falling) is a classic but not pathognomonic finding — it is present in ~50% of constrictive pericarditis and also occurs in RV infarction and severe tricuspid regurgitation"
    ],
    quiz: [
      {
        question: "A 58-year-old with history of cardiac surgery 10 years ago presents with ascites, elevated JVP, and peripheral edema. Echo shows preserved LVEF with septal bounce. Right heart catheterization shows equalization of diastolic pressures and square root sign. BNP is 120 pg/mL. Which finding best distinguishes constrictive pericarditis from restrictive cardiomyopathy?",
        options: [
          "Preserved LVEF on echocardiogram",
          "Low BNP with equalized diastolic pressures and discordant ventricular pressure changes with respiration",
          "Elevated JVP with peripheral edema",
          "Ascites with hepatomegaly"
        ],
        correct: 1,
        rationale: "Low BNP (< 200) favors constriction over restriction. The key hemodynamic differentiator is discordant respiratory variation of LV and RV pressures (constriction: inspiration increases RV and decreases LV pressure) versus concordant changes (restriction). Preserved LVEF, elevated JVP, and ascites are seen in both conditions."
      }
    ]
  },
  "cardiac-tamponade-mgmt-np": {
    title: "Cardiac Tamponade: Pericardiocentesis & Hemodynamics",
    cellular: {
      title: "Pericardial Effusion and Hemodynamic Compromise",
      content: "Cardiac tamponade occurs when pericardial fluid accumulates to the point where intrapericardial pressure exceeds diastolic filling pressures, causing hemodynamic compromise. The pericardium has limited compliance — rapid fluid accumulation (150-200 mL from trauma, aortic dissection, cardiac perforation) causes acute tamponade, while slow accumulation (from malignancy, uremia, autoimmune) allows pericardial stretch and may tolerate > 1 L before tamponade physiology develops. As intrapericardial pressure rises, RA and RV diastolic collapse occurs first (lowest pressures), impeding venous return and reducing cardiac output. Pulsus paradoxus (> 10 mmHg drop in SBP during inspiration) results from exaggerated ventricular interdependence within the fixed pericardial space. Beck's triad (hypotension, muffled heart sounds, JVD) is the classic but late presentation of acute tamponade."
    },
    riskFactors: [
      "Malignancy — most common cause of large pericardial effusion (lung, breast, lymphoma)",
      "Uremia from ESRD (uremic pericarditis with hemorrhagic effusion)",
      "Post-cardiac surgery or catheter-based procedures (iatrogenic perforation)",
      "Trauma: penetrating chest injury, blunt cardiac injury",
      "Aortic dissection with rupture into pericardium (rapidly fatal)",
      "Autoimmune: SLE, rheumatoid arthritis",
      "Viral or bacterial pericarditis",
      "Anticoagulation therapy (hemorrhagic pericardial effusion)"
    ],
    diagnostics: [
      "Bedside echocardiography (POCUS): pericardial effusion, RA/RV diastolic collapse, IVC plethora, respiratory variation of mitral/tricuspid inflow > 25%",
      "Pulsus paradoxus measurement: SBP drop > 10 mmHg during normal inspiration (sensitivity ~80%)",
      "Beck's triad: hypotension, muffled heart sounds, JVD (classic but present in only ~30% of cases)",
      "ECG: low voltage QRS, electrical alternans (beat-to-beat QRS amplitude variation — swinging heart)",
      "CXR: enlarged cardiac silhouette (water-bottle heart) if > 250 mL effusion",
      "Right heart catheterization: equalization of diastolic pressures, prominent x descent with blunted y descent (opposite of constriction)",
      "CT chest with contrast: effusion quantification, associated masses, pericardial enhancement",
      "Pericardial fluid analysis post-pericardiocentesis: cell count, protein, LDH, glucose, cytology, cultures, adenosine deaminase (TB)"
    ],
    management: [
      "Emergent pericardiocentesis for hemodynamically significant tamponade — subxiphoid approach under echo guidance",
      "IV fluid bolus (500-1000 mL NS) as temporary bridge to raise filling pressures before pericardiocentesis",
      "Avoid positive pressure ventilation if possible — reduces venous return and worsens tamponade",
      "Pericardial drain placement for ongoing drainage if large/recurrent effusion",
      "Pericardiectomy or pericardial window for recurrent effusions (especially malignant)",
      "Treat underlying cause: chemotherapy for malignant effusion, dialysis for uremic, antibiotics for infectious",
      "Intrapericardial therapy: sclerotherapy (doxycycline, bleomycin) or intrapericardial chemotherapy for malignant effusion",
      "Post-pericardiocentesis monitoring: serial echocardiography to assess for reaccumulation"
    ],
    nursingActions: [
      "Perform rapid bedside POCUS assessment for pericardial effusion in any hemodynamically unstable patient with JVD",
      "Measure pulsus paradoxus: inflate BP cuff above systolic, slowly deflate noting first Korotkoff sound during expiration, then first sound during inspiration — difference > 10 mmHg is positive",
      "Prepare for emergent pericardiocentesis: 18G spinal needle, pericardiocentesis tray, drainage catheter, echo guidance",
      "Establish large-bore IV access and initiate IV fluid resuscitation (maintain preload)",
      "Continuous cardiac monitoring — watch for ST changes during needle advancement (myocardial contact)",
      "Post-pericardiocentesis: monitor drain output, serial vitals, repeat echo within 24 hours",
      "Assess for complications: arrhythmia, myocardial/coronary laceration, pneumothorax, hepatic injury",
      "Send pericardial fluid for appropriate analyses based on clinical context"
    ],
    signs: {
      left: [
        "Small-moderate pericardial effusion without hemodynamic compromise",
        "Mild pulsus paradoxus (10-15 mmHg) with stable vital signs",
        "Patient comfortable at rest with stable BP",
        "No echocardiographic signs of chamber collapse"
      ],
      right: [
        "Beck's triad: hypotension, JVD, muffled heart sounds (acute tamponade)",
        "Pulsus paradoxus > 20 mmHg with tachycardia and narrow pulse pressure",
        "Electrical alternans on ECG indicating large effusion with swinging heart",
        "Obstructive shock with altered mental status and end-organ malperfusion"
      ]
    },
    medications: [
      {
        name: "Normal Saline IV Bolus",
        type: "Volume Expander",
        action: "Increases intravascular volume and right-sided filling pressures, temporarily overcoming the elevated intrapericardial pressure to maintain cardiac output as a bridge to pericardiocentesis",
        sideEffects: "Volume overload if used excessively, dilutional acidosis",
        contra: "Decompensated HF (but in tamponade, volume is lifesaving even with JVD)",
        pearl: "Despite JVD, these patients are functionally hypovolemic (unable to fill). Give 500-1000 mL NS rapidly. Do NOT give diuretics — this is the opposite of HF management. Vasopressors may be needed temporarily."
      },
      {
        name: "Atropine (if bradycardic)",
        type: "Anticholinergic",
        action: "Blocks muscarinic receptors, increasing HR; may be needed to maintain cardiac output during acute tamponade when bradycardia occurs",
        sideEffects: "Tachycardia, dry mouth, urinary retention, mydriasis, delirium",
        contra: "Narrow-angle glaucoma, obstructive uropathy",
        pearl: "Atropine may be used for reflex bradycardia during tamponade or pericardiocentesis. Definitive management is drainage. Avoid vasodilators and positive pressure ventilation — both worsen tamponade hemodynamics."
      }
    ],
    pearls: [
      "In cardiac tamponade, JVD with hypotension should NOT be treated with diuretics — these patients need volume resuscitation to maintain filling pressures above intrapericardial pressure until drainage can be performed",
      "Pulsus paradoxus may be absent in three situations: ASD (equalized atrial pressures), severe aortic regurgitation (LV fills from aorta, not atria), and positive pressure ventilation (reverses respiratory hemodynamics)",
      "Electrical alternans (alternating QRS amplitude) is highly specific but only ~20% sensitive for tamponade — its presence strongly suggests large effusion with significant hemodynamic impact"
    ],
    quiz: [
      {
        question: "A patient with known metastatic lung cancer presents with progressive dyspnea, tachycardia, and BP 85/60. JVP is elevated and heart sounds are muffled. Bedside echo confirms large pericardial effusion with RV diastolic collapse. What is the immediate priority?",
        options: [
          "Start IV furosemide 40 mg for volume overload",
          "IV fluid bolus and prepare for emergent pericardiocentesis",
          "Initiate dobutamine infusion",
          "Order CT chest with contrast for staging"
        ],
        correct: 1,
        rationale: "This presentation is classic cardiac tamponade requiring emergent pericardiocentesis. IV fluid bolus raises filling pressures as a bridge. Diuretics are absolutely contraindicated — they would further reduce preload and worsen hemodynamic collapse. Dobutamine does not address the underlying mechanical problem. CT delays definitive treatment."
      }
    ]
  },
  "heart-failure-np": {
    title: "Heart Failure: NP Advanced Prescribing & Hemodynamics",
    cellular: {
      title: "Hemodynamic Assessment and Pharmacological Optimization",
      content: "Advanced HF management requires understanding of hemodynamic profiles classified by the Stevenson/Nohria 2x2 framework: warm-dry (A — compensated), warm-wet (B — congested, adequate perfusion), cold-dry (L — hypoperfused, no congestion), cold-wet (C — congested and hypoperfused). Invasive hemodynamic monitoring with a pulmonary artery catheter measures PCWP (normal < 12 mmHg, elevated in congestion), cardiac index (normal > 2.2 L/min/m², low output < 2.0), SVR (elevated in cardiogenic shock), and mixed venous O2 saturation (SvO2 < 65% indicates tissue hypoperfusion). These parameters guide pharmacological optimization: vasodilators (nitroprusside, nitroglycerin) for elevated SVR and congestion; inotropes (dobutamine, milrinone) for low output; and vasopressors (norepinephrine, vasopressin) for cardiogenic shock with severe hypotension."
    },
    riskFactors: [
      "Progressive HFrEF despite GDMT optimization (LVEF < 25%)",
      "Recurrent HF hospitalizations (>= 2 in 12 months)",
      "Intolerance to GDMT due to hypotension, renal dysfunction, or hyperkalemia",
      "Escalating diuretic requirements or diuretic resistance",
      "Declining renal function (cardiorenal syndrome)",
      "Persistent NYHA Class III-IV symptoms despite optimal medical therapy",
      "Cardiac cachexia with unintentional weight loss",
      "Frequent ICD shocks from ventricular arrhythmias"
    ],
    diagnostics: [
      "Pulmonary artery catheter: PCWP, PA pressures, cardiac index, SVR, SvO2, transpulmonary gradient",
      "Echocardiogram: LVEF, RV function (TAPSE), mitral/tricuspid regurgitation severity",
      "BNP/NT-proBNP trending for congestion assessment",
      "Cardiopulmonary exercise testing (CPET): peak VO2 < 14 mL/kg/min suggests need for advanced therapies",
      "Right heart catheterization for transplant evaluation: PVR, transpulmonary gradient, PA pulsatility index",
      "Lab panel: renal function trending (cardiorenal syndrome), liver function (congestive hepatopathy), albumin",
      "INTERMACS profile classification for LVAD candidacy (1-7 scale, 1 being cardiogenic shock)",
      "HF survival models: SHFM (Seattle Heart Failure Model) for 1-5 year survival estimation"
    ],
    management: [
      "Optimize all four GDMT pillars to maximum tolerated doses before considering advanced therapies",
      "IV diuretic strategies for refractory congestion: high-dose bolus vs continuous infusion; add metolazone 2.5-5 mg for sequential nephron blockade",
      "Inotropic support for cardiogenic shock: dobutamine 2.5-10 mcg/kg/min or milrinone 0.375-0.75 mcg/kg/min (milrinone preferred if on beta-blocker)",
      "Ultrafiltration for diuretic-refractory volume overload (removes isotonic fluid at 100-500 mL/hr)",
      "LVAD (left ventricular assist device) as bridge to transplant or destination therapy for INTERMACS 1-4",
      "Heart transplant evaluation for patients with peak VO2 < 14 mL/kg/min (or < 12 if on beta-blocker)",
      "Palliative care integration for symptom management and goals-of-care discussions in advanced HF",
      "Home inotrope infusion for Stage D HF patients not candidates for LVAD/transplant (palliative intent)"
    ],
    nursingActions: [
      "Interpret hemodynamic profiles: assess for congestion (elevated JVP, edema, orthopnea) and perfusion (warm vs cool extremities, mental status, urine output)",
      "Manage PA catheter: zero and level transducer, interpret waveforms, obtain accurate PCWP readings at end-expiration",
      "Titrate vasoactive infusions per hemodynamic targets: maintain CI > 2.2, PCWP 15-18, MAP > 65",
      "Monitor for complications of inotropic therapy: arrhythmias with dobutamine/milrinone, hypotension",
      "Coordinate diuretic regimen: track daily I&O, weights, assess diuretic response (net negative 1-2 L/day target)",
      "Provide LVAD education: driveline care, battery management, emergency procedures, anticoagulation management",
      "Facilitate goals-of-care discussions: engage palliative care, document advance directives, address ICD deactivation preferences",
      "Prepare for transplant evaluation: ensure current vaccinations, cancer screening, dental clearance, psychosocial assessment"
    ],
    signs: {
      left: [
        "Profile B (warm-wet): elevated JVP, peripheral edema, pulmonary congestion with adequate perfusion (warm, normal mentation)",
        "Compensated on oral diuretics with stable renal function",
        "Adequate response to GDMT uptitration",
        "Preserved exercise capacity on 6MWT"
      ],
      right: [
        "Profile C (cold-wet): congestion AND hypoperfusion — cool extremities, narrow pulse pressure, rising lactate, declining UOP",
        "Cardiogenic shock requiring vasopressors and inotropes (INTERMACS 1-2)",
        "Diuretic resistance with worsening renal function despite escalating doses",
        "Refractory ventricular arrhythmias with ICD storm"
      ]
    },
    medications: [
      {
        name: "Milrinone",
        type: "Phosphodiesterase III Inhibitor (Inodilator)",
        action: "Inhibits PDE3, increasing intracellular cAMP in cardiomyocytes (positive inotropy) and vascular smooth muscle (vasodilation); reduces both preload and afterload while increasing contractility",
        sideEffects: "Hypotension, arrhythmias (atrial and ventricular), thrombocytopenia",
        contra: "Severe hypotension (SBP < 80), hypovolemia, severe aortic or pulmonic stenosis",
        pearl: "Preferred inotrope in patients already on beta-blockers (cAMP mechanism bypasses beta-receptor blockade). No loading dose in decompensated HF (risk of severe hypotension). Renally cleared — reduce dose if CrCl < 50 mL/min."
      },
      {
        name: "Metolazone",
        type: "Thiazide-like Diuretic (Sequential Nephron Blockade)",
        action: "Inhibits NaCl cotransporter in distal convoluted tubule, complementing loop diuretic action; given 30 min before furosemide to overcome diuretic resistance by blocking compensatory distal sodium reabsorption",
        sideEffects: "Severe hypokalemia, hyponatremia, hypomagnesemia, dehydration, metabolic alkalosis",
        contra: "Anuria, severe electrolyte depletion, concurrent severe hyponatremia (Na < 125)",
        pearl: "Powerful diuretic synergy when combined with loop diuretics for refractory congestion. Give metolazone 2.5-5 mg PO 30 minutes before IV furosemide. Monitor electrolytes every 12-24 hours — profound K+ and Mg2+ depletion can occur rapidly."
      }
    ],
    pearls: [
      "The Stevenson/Nohria 2x2 hemodynamic profile (warm/cold × wet/dry) guides acute HF management — approximately 70% of decompensated HF patients present as warm-wet (Profile B), requiring primarily diuresis",
      "Milrinone is preferred over dobutamine in patients on chronic beta-blocker therapy because it works via PDE3 inhibition downstream of the beta-receptor, maintaining efficacy despite beta-blockade",
      "When a patient requires increasing inotrope doses or cannot be weaned from inotropes, this defines INTERMACS 3 ('dependent stability') and should trigger advanced therapy evaluation (LVAD/transplant)"
    ],
    quiz: [
      {
        question: "A patient with LVEF 15% on maximum GDMT presents with worsening dyspnea, JVP 14 cm, 3+ peripheral edema, SBP 95, cool extremities, and creatinine rising from 1.2 to 2.4. Furosemide 80 mg IV produced only 200 mL urine in 4 hours. What hemodynamic profile is this and what is the next step?",
        options: [
          "Profile B (warm-wet) — increase furosemide to 160 mg IV",
          "Profile C (cold-wet) — add milrinone inotropic support and sequential nephron blockade",
          "Profile L (cold-dry) — give IV fluids to improve renal perfusion",
          "Profile A (warm-dry) — continue current therapy and observe"
        ],
        correct: 1,
        rationale: "Cool extremities + rising creatinine = cold (hypoperfused). JVP elevation + edema = wet (congested). Profile C = cold-wet, which has the worst prognosis. Treatment requires inotropic support (milrinone or dobutamine) to improve cardiac output AND diuretic augmentation (metolazone + loop diuretic) for sequential nephron blockade. IV fluids would worsen congestion."
      }
    ]
  },
  "stemi-nstemi-algorithm-np": {
    title: "STEMI vs NSTEMI: Diagnostic Algorithm & Intervention",
    cellular: {
      title: "Transmural vs Subendocardial Ischemia",
      content: "The distinction between STEMI and NSTEMI reflects the degree and mechanism of coronary occlusion. In STEMI, complete thrombotic occlusion of an epicardial coronary artery causes transmural ischemia — the entire myocardial wall thickness supplied by that vessel is at risk. ECG shows ST elevation in the territory of the occluded artery (anterior = LAD: V1-V4; inferior = RCA: II, III, aVF; lateral = LCx: I, aVL, V5-V6). In NSTEMI, partial or intermittent occlusion causes subendocardial ischemia (the subendocardium is most vulnerable to ischemia due to higher wall stress and furthest distance from epicardial coronary blood supply). ECG shows ST depression, T-wave inversion, or may be non-diagnostic. Both produce troponin elevation from cardiomyocyte necrosis, but the time-sensitive management differs dramatically — STEMI requires emergent reperfusion within 90-120 minutes while NSTEMI follows risk-stratified timing."
    },
    riskFactors: [
      "Established coronary artery disease with prior revascularization",
      "Traditional cardiovascular risk factors: HTN, DM, dyslipidemia, smoking, family history",
      "Cocaine and stimulant use (coronary vasospasm plus prothrombotic state)",
      "ACS presentation: 70% NSTEMI/UA, 30% STEMI",
      "Dual antiplatelet non-compliance after prior PCI/stent",
      "Kawasaki disease history in young adults (coronary aneurysms)",
      "Spontaneous coronary artery dissection (SCAD) in young women",
      "Coronary artery embolism from atrial fibrillation or endocarditis"
    ],
    diagnostics: [
      "12-lead ECG within 10 minutes of first medical contact — cornerstone of STEMI vs NSTEMI differentiation",
      "STEMI ECG criteria: new ST elevation >= 1 mm in 2 contiguous limb leads or >= 2 mm in 2 contiguous precordial leads; new LBBB with clinical suspicion",
      "NSTEMI ECG: ST depression >= 0.5 mm, T-wave inversion, or normal ECG with troponin elevation",
      "High-sensitivity troponin at 0 and 3 hours (0/1-hour algorithm with hs-cTn if available)",
      "TIMI and GRACE risk scores for NSTEMI to guide timing of invasive strategy",
      "Posterior leads (V7-V9) if inferior ST depression — may reveal posterior STEMI (RCA or LCx occlusion)",
      "Right-sided leads (V3R-V6R) for inferior STEMI to assess RV involvement",
      "POCUS for wall motion abnormalities and complications (pericardial effusion, papillary muscle rupture)"
    ],
    management: [
      "STEMI: immediate cath lab activation for primary PCI (door-to-balloon < 90 min); fibrinolysis if PCI unavailable within 120 min",
      "NSTEMI: risk-stratify with GRACE/TIMI score — very high risk (ongoing ischemia, VT/VF, HF, hemodynamic instability) → immediate invasive within 2 hours",
      "NSTEMI high-risk (GRACE > 140, troponin rise/fall, dynamic ST/T changes) → early invasive within 24 hours",
      "NSTEMI low-risk → ischemia-guided strategy or invasive within 72 hours",
      "Dual antiplatelet therapy: ASA 325 mg chewed + P2Y12 inhibitor (ticagrelor 180 mg or clopidogrel 600 mg loading)",
      "Anticoagulation: UFH or enoxaparin or bivalirudin (cath lab preference)",
      "Post-PCI management: DAPT for 12 months (STEMI) or 6-12 months (NSTEMI); high-intensity statin; beta-blocker; ACEi/ARB",
      "Cardiac rehabilitation enrollment within 1-2 weeks of discharge"
    ],
    nursingActions: [
      "Obtain 12-lead ECG within 10 minutes — interpret and escalate immediately if STEMI criteria met",
      "For STEMI: initiate cath lab activation protocol, administer DAPT loading, establish IV access, prepare for transfer to cath lab",
      "Administer supplemental O2 only if SpO2 < 94% (hyperoxia may worsen outcomes per AVOID trial)",
      "Continuous telemetry monitoring: be prepared for primary VF (most common in first hour of STEMI)",
      "Obtain right-sided and posterior ECG leads when appropriate (inferior STEMI, unexplained hemodynamic instability)",
      "Monitor for mechanical complications post-MI: new murmur (VSD, papillary muscle rupture), friction rub (Dressler syndrome)",
      "Post-PCI: assess access site, monitor dual antiplatelet compliance, educate on bleeding precautions",
      "Coordinate discharge planning: cardiac rehab, medication education, follow-up cardiology appointment, lifestyle modification counseling"
    ],
    signs: {
      left: [
        "Typical chest pain with modest ECG changes (NSTEMI pattern)",
        "Hemodynamically stable with mild troponin elevation",
        "Single-vessel disease on angiography with successful PCI",
        "Preserved LVEF post-intervention"
      ],
      right: [
        "Massive anterior STEMI with cardiogenic shock (Killip IV)",
        "Acute mechanical complication: VSD (new holosystolic murmur), free wall rupture",
        "Sustained VT/VF requiring multiple defibrillations",
        "Multi-vessel CAD requiring emergent CABG"
      ]
    },
    medications: [
      {
        name: "Tenecteplase (TNKase)",
        type: "Fibrinolytic (Third-Generation tPA)",
        action: "Binds fibrin in thrombus and converts entrapped plasminogen to plasmin, dissolving the fibrin clot; more fibrin-specific than alteplase with single IV bolus dosing",
        sideEffects: "Intracranial hemorrhage (0.5-1%), major bleeding, allergic reactions, reperfusion arrhythmias",
        contra: "Active internal bleeding, history of hemorrhagic stroke, ischemic stroke within 3 months, intracranial neoplasm, known bleeding diathesis, significant head trauma within 3 months, suspected aortic dissection",
        pearl: "Weight-based single IV bolus (30-50 mg based on weight) makes it preferred fibrinolytic for STEMI when PCI unavailable. Must be given within 12 hours of symptom onset (ideal < 3 hours). Half-dose tenecteplase considered for patients >= 75 years. Transfer for angiography within 3-24 hours post-fibrinolysis (pharmacoinvasive strategy)."
      },
      {
        name: "Bivalirudin",
        type: "Direct Thrombin Inhibitor",
        action: "Directly binds thrombin (both free and clot-bound), inhibiting thrombin-mediated fibrinogen cleavage, platelet activation, and factor XIII activation",
        sideEffects: "Bleeding, back pain, nausea, headache, acute stent thrombosis (higher rate if infusion stopped abruptly)",
        contra: "Active major bleeding, severe hepatic impairment",
        pearl: "Alternative to UFH during PCI. May reduce bleeding compared to UFH + GPI. Continue infusion at reduced dose (0.25 mg/kg/hr) for 4 hours post-PCI to reduce acute stent thrombosis risk. No HIT risk (unlike heparin). Cleared renally — dose adjust for CrCl < 30."
      }
    ],
    pearls: [
      "Time is myocardium — in STEMI, every 30-minute delay in reperfusion increases mortality; the NP must be able to rapidly interpret the ECG and activate the cath lab without waiting for cardiology consultation",
      "Posterior STEMI is the 'missed MI' — always obtain posterior leads (V7-V9) when you see ST depression in V1-V3 (mirror pattern) or unexplained hemodynamic instability with inferior STEMI; ST elevation >= 0.5 mm in posterior leads confirms posterior STEMI",
      "RV infarction complicates ~40% of inferior STEMIs — obtain right-sided leads (V4R), avoid nitrates and diuretics (RV is preload-dependent), give IV fluids if hypotensive"
    ],
    quiz: [
      {
        question: "A 54-year-old presents with acute chest pain. Initial ECG shows ST depression in V1-V3 with tall R waves. Troponin is rising. What additional ECG assessment should be performed immediately?",
        options: [
          "Repeat standard 12-lead ECG in 15 minutes",
          "Obtain posterior leads V7-V9",
          "Obtain a signal-averaged ECG",
          "No additional ECG needed — this is clearly NSTEMI"
        ],
        correct: 1,
        rationale: "ST depression in V1-V3 with tall R waves is the classic 'mirror pattern' of a posterior STEMI. The posterior leads V7-V9 will show ST elevation (>= 0.5 mm) confirming posterior MI, which requires emergent reperfusion just like any other STEMI. Missing this pattern leads to delayed treatment of an acutely occluded coronary artery."
      }
    ]
  },
  "heart-transplant-rejection-np": {
    title: "Heart Transplant Rejection: Immunosuppression & Monitoring",
    cellular: {
      title: "Alloimmune Response in Cardiac Transplantation",
      content: "Heart transplant rejection occurs when the recipient's immune system recognizes donor HLA antigens as foreign. Hyperacute rejection (minutes-hours) is mediated by preformed donor-specific antibodies (DSA) causing complement activation and graft thrombosis — prevented by pre-transplant crossmatch testing. Acute cellular rejection (ACR) peaks at 3-6 months: recipient T cells recognize donor MHC molecules, triggering CD4+ helper T cell activation and CD8+ cytotoxic T cell-mediated myocyte damage. Endomyocardial biopsy (EMB) is graded using ISHLT criteria: 0R (no rejection), 1R (mild), 2R (moderate), 3R (severe). Antibody-mediated rejection (AMR) involves DSA binding to graft endothelium, activating complement and causing microvascular injury — diagnosed by C4d staining on EMB and circulating DSA. Chronic rejection manifests as cardiac allograft vasculopathy (CAV), a diffuse intimal hyperplasia of coronary arteries causing graft failure over years."
    },
    riskFactors: [
      "Immunosuppression non-adherence (leading cause of late rejection)",
      "Young recipient age (more robust immune response)",
      "Female donor heart in male recipient (H-Y antigen mismatch)",
      "HLA mismatch degree between donor and recipient",
      "Sensitized recipient (high panel reactive antibodies — prior transfusions, pregnancy, VAD)",
      "CMV donor-positive to recipient-negative (D+/R−) status",
      "Inadequate immunosuppression levels (subtherapeutic calcineurin inhibitor trough)",
      "Prior rejection episodes (strongest predictor of future rejection)"
    ],
    diagnostics: [
      "Endomyocardial biopsy (EMB): gold standard for ACR; performed per protocol (weekly × 4, biweekly × 8, monthly × 6, then q3-6 months)",
      "ISHLT grading: 0R (no rejection), 1R (mild — focal perivascular infiltrate), 2R (moderate — multifocal infiltrate with myocyte damage), 3R (severe — diffuse infiltrate with necrosis/edema/hemorrhage)",
      "Donor-specific antibodies (DSA) panel for AMR surveillance — positive DSA + C4d on biopsy = AMR",
      "Echocardiography: new LVEF decline, diastolic dysfunction, pericardial effusion, wall motion abnormalities suggest rejection",
      "Gene expression profiling (AlloMap): non-invasive blood test for low-risk monitoring after 6 months (NPV ~95% for significant ACR)",
      "Cardiac MRI: myocardial edema (T2 mapping) and fibrosis (late gadolinium enhancement) correlate with rejection",
      "Coronary angiography or IVUS annually for cardiac allograft vasculopathy (CAV) screening",
      "Drug level monitoring: tacrolimus trough, cyclosporine C0/C2 levels, mycophenolate dose, everolimus trough"
    ],
    management: [
      "Standard triple immunosuppression: calcineurin inhibitor (tacrolimus) + antimetabolite (mycophenolate mofetil) + corticosteroids (prednisone taper)",
      "Induction therapy at transplant: basiliximab (IL-2 receptor antagonist) or anti-thymocyte globulin (ATG) for high-risk recipients",
      "ACR 2R treatment: IV methylprednisolone 1 g daily × 3 days, optimize baseline immunosuppression",
      "ACR 3R treatment: pulse steroids + ATG for steroid-resistant rejection",
      "AMR treatment: plasmapheresis, IVIG, rituximab (anti-CD20), bortezomib (proteasome inhibitor to target plasma cells)",
      "CAV management: statin therapy (pravastatin or rosuvastatin), mTOR inhibitor (everolimus may slow progression), repeat revascularization; re-transplant for severe CAV",
      "CMV prophylaxis: valganciclovir for D+/R− and R+ recipients for 3-6 months post-transplant",
      "Infection prophylaxis: trimethoprim-sulfamethoxazole (PCP), nystatin (candida), hepatitis B monitoring"
    ],
    nursingActions: [
      "Monitor calcineurin inhibitor levels meticulously — tacrolimus target trough 10-15 ng/mL (early) then 5-10 ng/mL (late)",
      "Educate on medication adherence — missed immunosuppression doses are the leading cause of late rejection and graft loss",
      "Assess for rejection symptoms: fatigue, dyspnea, edema, arrhythmias, low-grade fever — many patients are asymptomatic",
      "Coordinate EMB schedule and communicate results to transplant team promptly",
      "Monitor for immunosuppression side effects: nephrotoxicity (calcineurin inhibitors), cytopenias (mycophenolate), diabetes/osteoporosis (steroids), malignancy (lymphoma, skin cancer)",
      "Educate on infection prevention: hand hygiene, food safety, avoiding sick contacts, annual vaccinations (no live vaccines)",
      "Screen for post-transplant malignancy: skin exam every 6-12 months, age-appropriate cancer screening",
      "Provide psychosocial support: adherence counseling, transplant support groups, address body image and lifestyle adjustment"
    ],
    signs: {
      left: [
        "Asymptomatic with normal EMB (0R) and stable LVEF",
        "Mild rejection (1R) on surveillance biopsy — usually no treatment needed",
        "Stable drug levels with no infection or drug side effects",
        "Normal exercise capacity on annual CPET"
      ],
      right: [
        "Moderate-severe ACR (2R-3R) with LVEF decline and hemodynamic compromise",
        "AMR with positive DSA and clinical graft dysfunction",
        "Cardiac allograft vasculopathy with progressive graft failure (no angina due to denervation)",
        "Opportunistic infection (CMV, Aspergillus, Pneumocystis) in over-immunosuppressed patient"
      ]
    },
    medications: [
      {
        name: "Tacrolimus (Prograf)",
        type: "Calcineurin Inhibitor",
        action: "Binds FKBP12, inhibiting calcineurin phosphatase which prevents nuclear factor of activated T-cells (NFAT) translocation, blocking IL-2 transcription and T-cell activation",
        sideEffects: "Nephrotoxicity (dose-dependent), neurotoxicity (tremor, headache, seizures), hyperglycemia/new-onset diabetes, hyperkalemia, hypomagnesemia, alopecia",
        contra: "Hypersensitivity to tacrolimus, concurrent cyclosporine use",
        pearl: "Cornerstone of transplant immunosuppression. Target trough 10-15 ng/mL (first 3-6 months), then 5-10 ng/mL. Narrow therapeutic index — monitor levels with every dose change and at drug interactions. Metabolized by CYP3A4 — extensive drug interactions (azoles, diltiazem, grapefruit increase levels)."
      },
      {
        name: "Mycophenolate Mofetil (CellCept)",
        type: "Antimetabolite (IMPDH Inhibitor)",
        action: "Prodrug converted to mycophenolic acid, which selectively inhibits inosine monophosphate dehydrogenase (IMPDH) type II in lymphocytes, blocking de novo purine synthesis and inhibiting T and B cell proliferation",
        sideEffects: "GI upset (diarrhea, nausea — most common), leukopenia, anemia, thrombocytopenia, CMV infection risk, teratogenicity",
        contra: "Pregnancy (FDA category D — effective contraception required), concurrent azathioprine use, hypersensitivity",
        pearl: "Dose 1-1.5 g BID. Monitor CBC every 2-4 weeks — reduce dose if WBC < 3.0 or neutrophils < 1.5. Enteric-coated formulation (Myfortic) may reduce GI side effects. Interacts with antacids and cholestyramine (reduced absorption)."
      }
    ],
    pearls: [
      "Heart transplant recipients do not experience typical angina from CAV because the transplanted heart is denervated — CAV presents with silent ischemia, HF symptoms, arrhythmias, or sudden death, making annual coronary angiography critical",
      "AlloMap gene expression profiling can replace routine EMB for low-risk surveillance after 6 months, but EMB remains necessary when clinical rejection is suspected or for AMR diagnosis (AlloMap does not detect AMR)",
      "Post-transplant patients have 5-10x increased skin cancer risk and 20x increased lymphoma risk (PTLD) — annual dermatology screening and clinical vigilance for lymphadenopathy are essential"
    ],
    quiz: [
      {
        question: "A heart transplant recipient at 4 months post-transplant presents with fatigue and mild dyspnea. Echocardiogram shows LVEF decline from 60% to 42%. EMB shows multifocal inflammatory infiltrate with myocyte damage. ISHLT grade is 2R. What is the appropriate treatment?",
        options: [
          "Observe and repeat biopsy in 2 weeks",
          "IV methylprednisolone 1 g daily for 3 days and optimize immunosuppression",
          "Start plasmapheresis and IVIG",
          "Initiate dobutamine for hemodynamic support"
        ],
        correct: 1,
        rationale: "ISHLT grade 2R (moderate ACR) with clinical evidence of graft dysfunction requires treatment with pulse IV steroids (methylprednisolone 1 g × 3 days). Baseline immunosuppression should be reviewed and optimized (check tacrolimus levels, mycophenolate dose). Plasmapheresis is for AMR. Observation alone is appropriate for asymptomatic 1R rejection."
      }
    ]
  },
  "secondary-hypertension-workup-np": {
    title: "Secondary Hypertension Workup: Renal, Endocrine & Vascular",
    cellular: {
      title: "Pathophysiology of Secondary Hypertension",
      content: "Secondary hypertension accounts for 5-10% of hypertensive patients and has identifiable, often curable causes. Renovascular hypertension (most commonly atherosclerotic renal artery stenosis or fibromuscular dysplasia) activates the RAAS through reduced renal perfusion pressure, increasing renin release from the juxtaglomerular apparatus. Primary aldosteronism (Conn syndrome) involves autonomous aldosterone production from adrenal adenoma or bilateral hyperplasia, causing sodium retention, potassium wasting, and volume-mediated hypertension. Pheochromocytoma produces episodic catecholamine excess (norepinephrine, epinephrine) causing paroxysmal hypertension with tachycardia, diaphoresis, and headache. Cushing syndrome causes hypertension through cortisol-mediated activation of mineralocorticoid receptors and increased angiotensinogen production. Obstructive sleep apnea causes hypertension through intermittent hypoxia, sympathetic activation, and RAAS stimulation."
    },
    riskFactors: [
      "Resistant hypertension (BP above goal despite 3 antihypertensives at optimal doses including a diuretic)",
      "Onset of hypertension before age 30 (especially in non-obese patients without family history)",
      "Sudden onset or worsening of hypertension after age 55",
      "Hypokalemia (unprovoked or diuretic-induced out of proportion to dose)",
      "Abdominal bruit suggesting renovascular disease",
      "Paroxysmal hypertension with classic triad: headache, palpitations, diaphoresis",
      "Cushingoid appearance: central obesity, striae, moon facies",
      "Snoring, witnessed apneas, excessive daytime sleepiness (OSA)"
    ],
    diagnostics: [
      "Primary aldosteronism screen: morning aldosterone-to-renin ratio (ARR) > 30 with aldosterone > 15 ng/dL (most common endocrine cause of secondary HTN — prevalence 5-15% of hypertensives)",
      "Confirmatory testing for PA: oral sodium loading test, fludrocortisone suppression test, or saline infusion test",
      "Renal artery duplex ultrasound or CTA/MRA for renovascular disease workup",
      "24-hour urine fractionated metanephrines and catecholamines (or plasma free metanephrines) for pheochromocytoma",
      "Overnight dexamethasone suppression test (1 mg at 11 PM, cortisol < 1.8 mcg/dL at 8 AM excludes Cushing) or 24-hour urine free cortisol",
      "TSH (both hyper- and hypothyroidism cause hypertension)",
      "Sleep study (polysomnography) for OSA evaluation",
      "BMP (hypokalemia, elevated creatinine), urinalysis (proteinuria suggesting renal parenchymal disease)"
    ],
    management: [
      "Primary aldosteronism: adrenalectomy for unilateral adenoma; spironolactone 25-100 mg daily or eplerenone for bilateral hyperplasia",
      "Renovascular HTN: medical therapy (ACEi/ARB — monitor creatinine for bilateral RAS); angioplasty/stenting for FMD or refractory cases",
      "Pheochromocytoma: alpha-blockade first (phenoxybenzamine 10 mg BID uptitrate to 20-40 mg BID for 10-14 days), THEN beta-blockade, then surgical resection",
      "Cushing syndrome: surgical resection of causative tumor (pituitary, adrenal, or ectopic ACTH source)",
      "OSA: CPAP therapy (reduces BP by 3-5 mmHg on average; greater reduction with resistant hypertension and severe OSA)",
      "Thyroid disease: treat underlying hyper- or hypothyroidism",
      "Coarctation of the aorta: surgical repair or balloon angioplasty with stenting",
      "Medication review: discontinue/substitute offenders (NSAIDs, OCPs, stimulants, steroids, decongestants)"
    ],
    nursingActions: [
      "Screen for secondary causes in all patients with resistant, early-onset, or late-onset severe hypertension",
      "Ensure correct specimen collection: morning ARR (hold interfering medications for 2-4 weeks if possible), 24-hour urine with adequate collection verification",
      "Monitor potassium closely — hypokalemia is a clue to primary aldosteronism even when mild (3.0-3.5 mEq/L)",
      "Pre-operative preparation for pheochromocytoma: verify 10-14 days of alpha-blockade with adequate volume expansion before surgery",
      "Educate on medication timing and interactions for secondary hypertension workup (ACEi/ARBs, spironolactone, beta-blockers affect ARR)",
      "Monitor renal function closely after starting ACEi/ARB (> 30% creatinine rise suggests bilateral RAS)",
      "Coordinate endocrinology, nephrology, and/or vascular surgery referrals based on workup results",
      "Document BP in both arms and assess for brachial-femoral pulse delay (coarctation screening)"
    ],
    signs: {
      left: [
        "Mildly resistant hypertension with one identifiable contributing factor (e.g., NSAID use)",
        "Borderline elevated ARR requiring confirmatory testing",
        "Mild OSA (AHI 5-15) with modest BP elevation",
        "Young patient with fibromuscular dysplasia responsive to angioplasty"
      ],
      right: [
        "Hypertensive crisis from pheochromocytoma with catecholamine storm",
        "Flash pulmonary edema with bilateral renal artery stenosis ('Pickering syndrome')",
        "Severe hypokalemia (< 2.5 mEq/L) from primary aldosteronism",
        "Cushing syndrome with uncontrolled BP, diabetes, and osteoporotic fractures"
      ]
    },
    medications: [
      {
        name: "Spironolactone",
        type: "Mineralocorticoid Receptor Antagonist",
        action: "Competitively blocks aldosterone at mineralocorticoid receptors in renal collecting duct and vasculature; promotes sodium excretion and potassium retention; particularly effective for primary aldosteronism and resistant hypertension",
        sideEffects: "Hyperkalemia, gynecomastia (dose-dependent, ~10% at 50 mg), breast tenderness, menstrual irregularity, erectile dysfunction",
        contra: "K+ > 5.5 mEq/L, eGFR < 30, Addison disease, concurrent potassium-sparing diuretics or potassium supplements",
        pearl: "Drug of choice for bilateral adrenal hyperplasia (primary aldosteronism). PATHWAY-2 trial showed spironolactone most effective add-on for resistant hypertension. Start 25 mg daily, uptitrate to 100 mg. Check K+ and creatinine at 1 and 4 weeks. Eplerenone is alternative with fewer antiandrogenic effects."
      },
      {
        name: "Phenoxybenzamine",
        type: "Irreversible Non-selective Alpha Blocker",
        action: "Irreversibly blocks alpha-1 and alpha-2 receptors, causing vasodilation and reducing peripheral resistance; prevents catecholamine-induced vasoconstriction in pheochromocytoma",
        sideEffects: "Orthostatic hypotension, reflex tachycardia, nasal congestion, miosis, ejaculatory dysfunction",
        contra: "Hypotension, conditions where a fall in BP would be dangerous",
        pearl: "Must be started 10-14 days BEFORE surgery for pheochromocytoma to allow adequate alpha-blockade and volume expansion. Start 10 mg BID, increase by 10-20 mg every 2-3 days until BP controlled. ONLY after adequate alpha-blockade should beta-blockers be added (prevents unopposed alpha stimulation and hypertensive crisis)."
      }
    ],
    pearls: [
      "Primary aldosteronism is grossly underdiagnosed — prevalence is 5-15% of hypertensives, yet most cases are never screened. Screen any patient with resistant hypertension, hypokalemia, or adrenal incidentaloma",
      "In pheochromocytoma, NEVER start beta-blockers before alpha-blockade — beta-2 receptor blockade removes catecholamine-mediated vasodilation, leaving unopposed alpha-1 vasoconstriction, which can precipitate hypertensive crisis",
      "An acute rise in creatinine > 30% after starting ACEi/ARB is a strong clue for bilateral renal artery stenosis — stop the ACEi/ARB and investigate with renal artery imaging"
    ],
    quiz: [
      {
        question: "A 45-year-old with resistant hypertension (on 3 medications) has serum K+ 3.1 mEq/L without diuretic use. Morning aldosterone is 22 ng/dL and renin activity is 0.3 ng/mL/hr. What is the most likely diagnosis and next step?",
        options: [
          "Essential hypertension — add amlodipine",
          "Primary aldosteronism — perform confirmatory testing (saline infusion or oral sodium loading test)",
          "Renovascular hypertension — order renal artery duplex",
          "Pheochromocytoma — check 24-hour urine metanephrines"
        ],
        correct: 1,
        rationale: "ARR = 22/0.3 = 73 (> 30 cutoff) with aldosterone > 15 ng/dL and spontaneous hypokalemia strongly suggests primary aldosteronism. Confirmatory testing is needed before proceeding to CT adrenals and adrenal vein sampling. The hypokalemia without diuretics is a classic clue to autonomous aldosterone production."
      }
    ]
  },
  "cardiomyopathy-differential-np": {
    title: "Cardiomyopathy Differential: Dilated, Hypertrophic, Restrictive",
    cellular: {
      title: "Structural and Functional Classification of Cardiomyopathies",
      content: "Cardiomyopathies are classified by morphological and functional phenotype. Dilated cardiomyopathy (DCM) features LV (or biventricular) dilation with systolic dysfunction (LVEF < 40%). Etiologies include idiopathic/genetic (TTN truncating variants in ~25%), post-viral myocarditis, alcohol (> 90 g/day × 5 years), peripartum, tachycardia-mediated, and drug-induced (anthracyclines, trastuzumab). Hypertrophic cardiomyopathy (HCM) is characterized by unexplained LV hypertrophy (wall thickness >= 15 mm), most commonly from sarcomeric protein mutations (MYH7, MYBPC3). Approximately 70% have LV outflow tract (LVOT) obstruction. Restrictive cardiomyopathy (RCM) features normal LV size and LVEF with impaired diastolic filling from myocardial infiltration (amyloid, sarcoid), storage diseases (hemochromatosis, Fabry), or fibrosis (radiation, scleroderma). Each phenotype has distinct hemodynamic consequences, prognosis, and management strategies."
    },
    riskFactors: [
      "Genetic mutations: sarcomeric genes (HCM), TTN, LMNA, desmoplakin (DCM), TTR amyloid (RCM)",
      "Cardiotoxic chemotherapy: anthracyclines (cumulative dose > 400 mg/m²), trastuzumab, checkpoint inhibitors",
      "Chronic alcohol excess (> 80-90 g/day for > 5 years — alcoholic DCM)",
      "Peripartum cardiomyopathy (last month of pregnancy through 5 months postpartum)",
      "Chronic uncontrolled tachyarrhythmia (AF with rapid ventricular response — tachycardia-mediated CMP)",
      "Systemic diseases: amyloidosis, sarcoidosis, hemochromatosis, Fabry disease",
      "Prior radiation therapy to the chest (breast, lymphoma — restrictive or mixed pattern)",
      "Family history of cardiomyopathy or sudden cardiac death"
    ],
    diagnostics: [
      "Echocardiography: LV dimensions, wall thickness, LVEF, diastolic function, LVOT gradient (HCM), restrictive filling pattern",
      "Cardiac MRI: gold standard for tissue characterization — LGE patterns distinguish ischemic (subendocardial) from non-ischemic (mid-wall, epicardial) and identify amyloid, sarcoid, iron",
      "Genetic testing: sarcomeric gene panel (HCM); TTN, LMNA, DES panel (DCM); TTR gene (hereditary ATTR amyloid)",
      "Tc-99m PYP nuclear scan: > Grade 2 uptake diagnostic for ATTR cardiac amyloidosis (avoids biopsy in many cases)",
      "Endomyocardial biopsy: gold standard for infiltrative diseases (amyloid, sarcoid) and myocarditis",
      "Iron studies and T2* MRI for hemochromatosis (T2* < 20 ms indicates cardiac iron overload)",
      "ECG: LVH voltage criteria (HCM), low voltage with pseudo-infarct pattern (cardiac amyloid), conduction disease (LMNA, sarcoid)",
      "BNP/NT-proBNP, troponin (chronically elevated in infiltrative CMP), renal/hepatic function"
    ],
    management: [
      "DCM: GDMT for HFrEF (ARNI/ACEi, beta-blocker, MRA, SGLT2i); CRT-D if LVEF <= 35% with LBBB; LVAD/transplant for advanced cases",
      "HCM without obstruction: beta-blocker or verapamil for symptoms; avoid vasodilators and dehydration",
      "HCM with obstruction (LVOT gradient >= 30 mmHg): mavacamten (first-in-class cardiac myosin inhibitor), beta-blocker, disopyramide; septal reduction therapy (alcohol septal ablation or surgical myectomy) for refractory cases",
      "HCM SCD risk stratification: ICD for prior arrest, sustained VT, family history SCD, massive LVH >= 30 mm, unexplained syncope, abnormal BP response to exercise",
      "Cardiac amyloidosis ATTR: tafamidis 80 mg daily (ATTR-ACT trial — reduced mortality and hospitalization); diflunisal as alternative",
      "Cardiac amyloidosis AL: chemotherapy targeting clonal plasma cell population (bortezomib-based regimen); cardiology-hematology co-management essential",
      "Cardiac sarcoidosis: corticosteroids for active inflammation; ICD for significant ventricular arrhythmias or LVEF < 35%",
      "Peripartum CMP: standard HFrEF therapy (avoid ACEi/ARB during breastfeeding — use hydralazine/nitrates); bromocriptine may improve recovery"
    ],
    nursingActions: [
      "Differentiate cardiomyopathy phenotypes on assessment: DCM (S3, displaced PMI, low LVEF), HCM (systolic murmur that increases with Valsalva, bisferiens pulse), RCM (elevated JVP, Kussmaul sign, normal LVEF)",
      "Screen for SCD risk factors in HCM: family history of SCD, syncope, massive LVH, exercise BP response, NSVT on Holter",
      "Educate HCM patients on activity restrictions: avoid competitive sports, dehydration, and drugs that reduce preload or increase obstruction",
      "Monitor for medication-specific complications: GDMT in DCM, mavacamten LVEF monitoring (hold if LVEF < 50%), tafamidis",
      "Coordinate genetic counseling and family screening for first-degree relatives",
      "Assess for systemic manifestations of infiltrative diseases: neuropathy (amyloid), lymphadenopathy/skin lesions (sarcoid), joint pain/skin findings (hemochromatosis)",
      "Support peripartum CMP patients: LVEF recovery monitoring, contraception counseling (subsequent pregnancy risk), breastfeeding medication safety",
      "Ensure advance care planning discussion for progressive/end-stage cardiomyopathies"
    ],
    signs: {
      left: [
        "Asymptomatic HCM detected by murmur or family screening ECG",
        "Mild DCM with LVEF 35-40% responding well to GDMT",
        "Early-stage amyloidosis with preserved LVEF and mild diastolic dysfunction",
        "Peripartum CMP with LVEF improving on medical therapy"
      ],
      right: [
        "End-stage DCM with LVEF < 20% requiring LVAD or transplant",
        "HCM with sudden cardiac arrest from VF",
        "Advanced cardiac amyloidosis with severe HF, renal failure, and autonomic neuropathy",
        "Cardiac sarcoidosis with complete heart block and VT requiring ICD"
      ]
    },
    medications: [
      {
        name: "Mavacamten (Camzyos)",
        type: "Cardiac Myosin Inhibitor",
        action: "Selectively inhibits cardiac myosin ATPase, reducing the number of actin-myosin cross-bridges during systole; decreases hypercontractility and LVOT obstruction in obstructive HCM",
        sideEffects: "Heart failure (excessive LVEF reduction), syncope; LVEF monitoring required",
        contra: "LVEF < 55%, NYHA IV HF, concurrent use of strong CYP2C19 inhibitors or moderate-strong CYP3A4 inhibitors",
        pearl: "First disease-modifying therapy for obstructive HCM. EXPLORER-HCM showed significant improvement in symptoms and exercise capacity. REMS program requires echocardiography before each prescription. If LVEF drops below 50%, hold drug. CYP2C19 metabolizer status affects dosing."
      },
      {
        name: "Tafamidis (Vyndamax/Vyndaqel)",
        type: "Transthyretin (TTR) Stabilizer",
        action: "Binds to thyroxine-binding sites on TTR tetramer, stabilizing the protein and preventing dissociation into monomers that misfold and aggregate as amyloid fibrils in myocardium",
        sideEffects: "Generally well-tolerated; urinary tract infection, flatulence, diarrhea reported",
        contra: "Not effective for AL amyloidosis (different protein); no benefit if initiated in advanced NYHA IV HF",
        pearl: "ATTR-ACT trial demonstrated 30% reduction in all-cause mortality and reduction in CV hospitalizations. Approved for ATTR cardiac amyloidosis (both wild-type and hereditary). Must distinguish ATTR from AL amyloidosis before starting — AL requires chemotherapy. Tc-99m PYP scan positive = ATTR."
      }
    ],
    pearls: [
      "When evaluating LVH, always consider cardiac amyloidosis if there is LVH with low-voltage ECG — this discordance is a red flag (most causes of LVH produce high ECG voltage, but amyloid infiltration causes low voltage despite thick walls)",
      "In obstructive HCM, any maneuver that decreases LV volume worsens LVOT obstruction: Valsalva (increases murmur), standing, dehydration, vasodilators — while squatting and leg elevation decrease obstruction",
      "LMNA (lamin A/C) cardiomyopathy carries very high arrhythmic risk — ICD should be considered at LVEF < 45% (lower threshold than other DCM causes) because SCD may occur before severe systolic dysfunction develops"
    ],
    quiz: [
      {
        question: "A 72-year-old man presents with HF symptoms and bilateral carpal tunnel syndrome. Echo shows concentric LVH (wall thickness 16 mm) with LVEF 55% and grade III diastolic dysfunction. ECG shows low voltage with pseudo-infarct pattern. What is the most likely diagnosis and next diagnostic test?",
        options: [
          "Hypertensive heart disease — start amlodipine",
          "HCM — order genetic testing for MYH7/MYBPC3",
          "Cardiac amyloidosis — order Tc-99m PYP scan",
          "Constrictive pericarditis — order cardiac MRI"
        ],
        correct: 2,
        rationale: "LVH with low-voltage ECG ('voltage-mass discordance') is the hallmark of cardiac amyloidosis. Bilateral carpal tunnel syndrome is a classic early manifestation of ATTR amyloidosis. Tc-99m PYP scan is the non-invasive diagnostic test for ATTR cardiac amyloidosis (grade 2-3 uptake is diagnostic). Hypertensive heart disease would show high voltage on ECG."
      }
    ]
  },
  "syncope-diagnostic-algorithm-np": {
    title: "Syncope Diagnostic Algorithm: Cardiac vs Neurogenic vs Reflex",
    cellular: {
      title: "Mechanisms of Transient Loss of Consciousness",
      content: "Syncope results from transient global cerebral hypoperfusion. Reflex (neurally mediated) syncope is the most common type (~60%): vasovagal (triggered by prolonged standing, pain, emotional stress) involves a paradoxical Bezold-Jarisch reflex where vigorous contraction of an underfilled ventricle activates C-fiber mechanoreceptors, triggering vagal efferents causing bradycardia (cardioinhibitory) and/or sympathetic withdrawal causing vasodilation (vasodepressor). Situational syncope includes cough, micturition, and defecation syncope. Carotid sinus hypersensitivity produces syncope with carotid baroreceptor stimulation. Cardiac syncope (~15%) results from arrhythmias (bradycardia, tachycardia) or structural disease (AS, HCM, massive PE) and carries the highest mortality. Orthostatic hypotension (~10%) involves failure of sympathetic vasoconstriction on standing (autonomic neuropathy, volume depletion, medications)."
    },
    riskFactors: [
      "Age > 60 years (increased prevalence of cardiac syncope and orthostatic hypotension)",
      "Known structural heart disease (HCM, AS, cardiomyopathy, prior MI)",
      "Family history of sudden cardiac death or channelopathies",
      "Medications causing orthostatic hypotension: alpha-blockers, antihypertensives, diuretics, vasodilators, nitrates",
      "Polypharmacy in elderly patients",
      "Autonomic neuropathy: diabetes, Parkinson disease, pure autonomic failure, multisystem atrophy",
      "Dehydration and inadequate fluid/salt intake",
      "Prolonged standing, hot environments, post-prandial state (vasovagal triggers)"
    ],
    diagnostics: [
      "Detailed history: prodromal symptoms (warmth, nausea, tunnel vision = vasovagal), triggers, position, duration, associated palpitations/chest pain, recovery time, witnesses",
      "12-lead ECG: arrhythmias, pre-excitation (WPW), Brugada pattern, Long QT, LBBB, pathological Q waves",
      "Orthostatic vitals: SBP drop >= 20 mmHg or DBP drop >= 10 mmHg within 3 minutes of standing (or HR increase >= 30 in POTS)",
      "Echocardiography if cardiac syncope suspected: LV function, valvular disease, HCM, RVOT",
      "Continuous cardiac monitoring: telemetry in hospital; Holter (24-72h), event recorder (2-4 weeks), implantable loop recorder (ILR) for recurrent unexplained syncope",
      "Tilt table test for suspected vasovagal syncope when diagnosis unclear from history",
      "Carotid sinus massage (under monitoring): ventricular pause > 3 sec or SBP drop > 50 mmHg = carotid sinus hypersensitivity",
      "Risk stratification: San Francisco Syncope Rule, Canadian Syncope Risk Score, or EGSYS score"
    ],
    management: [
      "Vasovagal syncope: education, trigger avoidance, hydration (2-3 L/day), increased salt intake (6-10 g/day), physical counterpressure maneuvers (leg crossing, isometric arm tensing)",
      "Pharmacotherapy for recurrent vasovagal: midodrine 5-10 mg TID, fludrocortisone 0.1-0.2 mg daily (if non-pharmacological measures fail)",
      "Orthostatic hypotension: address underlying cause, medication review, compression stockings (30-40 mmHg), abdominal binder, midodrine, droxidopa for neurogenic OH",
      "Cardiac syncope from bradyarrhythmia: permanent pacemaker implantation",
      "Cardiac syncope from tachyarrhythmia: antiarrhythmic therapy, catheter ablation, ICD as appropriate",
      "Structural cardiac syncope: treat underlying condition (aortic valve replacement for AS, septal reduction for HCM)",
      "Carotid sinus hypersensitivity with recurrent syncope: dual-chamber pacemaker for cardioinhibitory type",
      "Driving restrictions per local guidelines based on syncope etiology and recurrence risk"
    ],
    nursingActions: [
      "Perform detailed syncope history assessment: circumstances, prodrome, witnesses, injury, recovery pattern — the history is the most important diagnostic tool",
      "Measure orthostatic vitals correctly: supine for 5 minutes, then at 1 and 3 minutes of standing; document HR and BP at each position",
      "Risk-stratify syncope: red flags requiring urgent cardiac workup include syncope during exertion, palpitations before syncope, family history SCD, structural heart disease, abnormal ECG",
      "Educate on vasovagal prodrome recognition and counterpressure maneuvers (cross legs, tense arms, grip hands)",
      "Counsel on medication-related orthostatic hypotension and timing of doses",
      "Assess for injuries from syncopal falls: subdural hematoma (especially if on anticoagulants), fractures",
      "Coordinate ILR implantation and remote monitoring for recurrent unexplained syncope",
      "Provide driving restriction counseling based on syncope etiology and local regulations"
    ],
    signs: {
      left: [
        "Prodromal symptoms (warmth, nausea, tunnel vision) suggesting vasovagal",
        "Syncope in standing position with triggers (heat, crowding, pain)",
        "Rapid spontaneous recovery with no confusion (simple faint)",
        "Normal ECG and echocardiogram"
      ],
      right: [
        "Exertional syncope suggesting cardiac etiology (AS, HCM, arrhythmia)",
        "Syncope with palpitations or chest pain preceding event",
        "Syncope in supine position (arrhythmic until proven otherwise)",
        "Abnormal ECG: prolonged QT, Brugada pattern, pre-excitation, heart block"
      ]
    },
    medications: [
      {
        name: "Midodrine",
        type: "Alpha-1 Agonist",
        action: "Activates alpha-1 adrenergic receptors on arteriolar and venous smooth muscle, increasing peripheral vascular resistance and venous return; raises standing BP",
        sideEffects: "Supine hypertension (do not take within 4 hours of bedtime), urinary retention, piloerection ('goosebumps'), scalp tingling, pruritus",
        contra: "Severe organic heart disease, acute renal failure, urinary retention, pheochromocytoma, thyrotoxicosis, supine hypertension",
        pearl: "Take 2.5-10 mg TID (morning, midday, afternoon — NEVER at bedtime due to supine hypertension). First-line pharmacotherapy for both vasovagal syncope and orthostatic hypotension when non-pharmacological measures are insufficient. Check supine BP after initiation."
      },
      {
        name: "Fludrocortisone",
        type: "Synthetic Mineralocorticoid",
        action: "Activates mineralocorticoid receptors in renal collecting duct, promoting sodium and water retention, expanding intravascular volume by 10-20%",
        sideEffects: "Hypokalemia, supine hypertension, edema, headache, weight gain",
        contra: "Systemic fungal infections, CHF (volume expansion), severe hypertension",
        pearl: "Dose 0.1-0.2 mg daily. Takes 1-2 weeks for full effect. Monitor K+ (supplement if needed) and supine BP. Particularly useful in elderly patients with neurogenic orthostatic hypotension and low salt intake. Avoid in HF patients."
      }
    ],
    pearls: [
      "The history is the single most diagnostic tool in syncope evaluation — a detailed account from the patient AND witnesses can classify syncope in ~50% of cases without any further testing",
      "Syncope during exertion is cardiac until proven otherwise — always obtain echocardiography and exercise testing to evaluate for AS, HCM, coronary disease, and exercise-induced arrhythmias",
      "An implantable loop recorder (ILR) should be considered early in the workup of recurrent unexplained syncope — it has a 3-year battery life and a diagnostic yield of 35-50%"
    ],
    quiz: [
      {
        question: "A 75-year-old man with no cardiac history has two episodes of syncope while standing in church. Each time he felt warm and nauseated before losing consciousness and recovered quickly. ECG is normal. What is the most likely diagnosis and initial management?",
        options: [
          "Cardiac arrhythmia — admit for telemetry monitoring",
          "Vasovagal syncope — educate on triggers, hydration, and counterpressure maneuvers",
          "Carotid sinus hypersensitivity — perform carotid sinus massage",
          "Orthostatic hypotension — start midodrine immediately"
        ],
        correct: 1,
        rationale: "The presentation is classic for vasovagal syncope: prodromal warmth/nausea, prolonged standing trigger, rapid recovery, and normal ECG. Initial management is non-pharmacological: trigger avoidance, adequate hydration (2-3 L/day), salt intake, and physical counterpressure maneuvers. Pharmacotherapy is reserved for recurrent events despite lifestyle measures."
      }
    ]
  },
  "coronary-artery-ectasia-np": {
    title: "Coronary Artery Ectasia: Diagnosis & Anticoagulation",
    cellular: {
      title: "Coronary Artery Dilation Pathophysiology",
      content: "Coronary artery ectasia (CAE) is defined as diffuse or focal dilation of a coronary artery segment exceeding 1.5 times the diameter of the adjacent normal segment. It is found in 1-5% of patients undergoing coronary angiography. The most common association is atherosclerosis (~50% of cases), where enzymatic degradation of the media and adventitia by matrix metalloproteinases leads to vessel dilation rather than stenosis. Other causes include Kawasaki disease (leading cause in younger patients), connective tissue disorders (Marfan, Ehlers-Danlos), vasculitis (polyarteritis nodosa, Takayasu), and iatrogenic (post-PCI). The dilated segments promote blood stasis and turbulent flow, increasing thrombotic risk. Markis classification grades severity: Type I (diffuse ectasia of 2-3 vessels), Type II (diffuse ectasia of one vessel + localized of another), Type III (diffuse ectasia of one vessel), Type IV (localized/segmental ectasia)."
    },
    riskFactors: [
      "Atherosclerotic coronary artery disease (most common association)",
      "History of Kawasaki disease in childhood (coronary aneurysm formation)",
      "Connective tissue disorders: Marfan syndrome, Ehlers-Danlos syndrome",
      "Vasculitis: polyarteritis nodosa, Takayasu arteritis, Behçet disease",
      "Male sex (3:1 predominance)",
      "Post-coronary intervention (stent-adjacent ectasia)",
      "Chronic cocaine use",
      "Syphilitic aortitis (rare)"
    ],
    diagnostics: [
      "Coronary angiography: gold standard — dilation > 1.5x adjacent normal segment; classify by Markis types I-IV",
      "CT coronary angiography: non-invasive alternative for follow-up and surveillance",
      "Intravascular ultrasound (IVUS): characterizes wall structure, thrombus, and differentiates true aneurysm from pseudoaneurysm",
      "Echocardiography: may detect proximal coronary ectasia; assess LV function",
      "Inflammatory markers: ESR, CRP, ANA, ANCA if vasculitis suspected",
      "Workup for Kawasaki: childhood history, echocardiographic coronary assessment",
      "Stress testing: exercise or pharmacological stress to assess ischemic burden",
      "CBC, coagulation studies: baseline before anticoagulation"
    ],
    management: [
      "Antiplatelet therapy: aspirin for all patients with coronary ectasia",
      "Anticoagulation with warfarin (target INR 2-3) for large or giant aneurysms (> 8 mm) or documented coronary thrombosis",
      "Statin therapy for atherosclerotic ectasia (plaque stabilization and anti-inflammatory effects)",
      "Consider DAPT or antiplatelet + anticoagulant for high thrombotic risk",
      "Beta-blocker to reduce coronary wall stress",
      "Treat underlying cause: immunosuppression for active vasculitis, Kawasaki-specific therapy",
      "Avoid coronary vasodilators (nitrates may worsen flow stasis in ectatic segments)",
      "Surveillance CT angiography or echocardiography annually to monitor progression"
    ],
    nursingActions: [
      "Educate patient on chronic nature of condition and need for lifelong monitoring",
      "Monitor anticoagulation if prescribed: INR checks for warfarin, bleeding risk assessment",
      "Assess for ACS symptoms — ectatic coronary arteries can present with MI from in-situ thrombosis",
      "Coordinate follow-up imaging schedule for aneurysm surveillance",
      "Screen for associated conditions: connective tissue disease, vasculitis",
      "Counsel on cardiovascular risk factor modification: smoking cessation, lipid management",
      "Educate on bleeding precautions if on anticoagulation",
      "Document aneurysm dimensions and Markis classification for longitudinal tracking"
    ],
    signs: {
      left: [
        "Incidental finding on coronary angiography for other indications",
        "Mild focal ectasia (Type IV) without symptoms",
        "Stable dimensions on serial imaging",
        "No evidence of coronary thrombosis"
      ],
      right: [
        "Acute MI from coronary thrombosis within ectatic segment",
        "Giant coronary aneurysm (> 8 mm) with high rupture risk",
        "Progressive dilation on serial imaging",
        "Rupture (rare) with hemopericardium and tamponade"
      ]
    },
    medications: [
      {
        name: "Warfarin",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K-dependent clotting factor synthesis (II, VII, IX, X), reducing thrombotic risk in ectatic coronary segments with stasis",
        sideEffects: "Bleeding, skin necrosis, teratogenicity, drug/food interactions",
        contra: "Active bleeding, pregnancy, non-compliance with INR monitoring",
        pearl: "Reserved for large/giant coronary aneurysms (> 8 mm) or documented coronary thrombosis. Target INR 2.0-3.0. DOACs have limited evidence in this condition. Combine with low-dose ASA for maximal thrombotic protection in high-risk cases."
      },
      {
        name: "Aspirin",
        type: "Antiplatelet (COX-1 Inhibitor)",
        action: "Irreversibly acetylates COX-1, blocking thromboxane A2 synthesis and inhibiting platelet aggregation",
        sideEffects: "GI bleeding, peptic ulcer, tinnitus, Reye syndrome in children",
        contra: "Active GI bleeding, aspirin allergy, children with viral illness",
        pearl: "Low-dose ASA (81-100 mg) recommended for all patients with coronary ectasia to reduce thrombotic events. May be combined with warfarin for high-risk aneurysms. Add PPI for GI protection if dual therapy prescribed."
      }
    ],
    pearls: [
      "Nitrates should be used cautiously in coronary ectasia — vasodilation of already ectatic segments may worsen flow stasis and paradoxically increase ischemic risk",
      "Kawasaki disease is the leading cause of coronary artery ectasia/aneurysms in patients under 40 — always ask about childhood history of prolonged fever with mucocutaneous findings",
      "Giant coronary aneurysms (> 8 mm) carry significant thrombotic risk and warrant anticoagulation with warfarin in addition to antiplatelet therapy"
    ],
    quiz: [
      {
        question: "A 35-year-old presents with chest pain. Coronary angiography shows a 10 mm fusiform aneurysm of the LAD with no significant stenosis. He has a history of childhood Kawasaki disease. What is the most appropriate management?",
        options: [
          "Aspirin 81 mg daily only",
          "Aspirin plus warfarin (INR 2-3) with regular surveillance imaging",
          "Coronary artery bypass grafting",
          "Nitrate therapy for coronary vasodilation"
        ],
        correct: 1,
        rationale: "A 10 mm coronary aneurysm (giant aneurysm) from Kawasaki disease carries high thrombotic risk. Dual therapy with aspirin plus warfarin is recommended along with regular surveillance imaging. Nitrates should be avoided as they may worsen flow stasis. Surgical intervention is reserved for specific indications."
      }
    ]
  },
  "coronary-microvascular-dysfunction-np": {
    title: "Coronary Microvascular Dysfunction: Diagnosis & Treatment",
    cellular: {
      title: "Small Vessel Coronary Disease Pathophysiology",
      content: "Coronary microvascular dysfunction (CMD) involves impaired function of coronary arterioles (< 500 μm) that cannot be visualized on standard coronary angiography. The pathophysiology includes endothelial dysfunction with reduced nitric oxide bioavailability, smooth muscle dysfunction with impaired vasodilation, microvascular remodeling with increased wall-to-lumen ratio, and extravascular compressive forces. CMD is the underlying mechanism in many patients with angina and non-obstructive coronary arteries (ANOCA/INOCA), affecting up to 50% of patients referred for angiography who have no significant epicardial stenosis. The coronary flow reserve (CFR < 2.0) and index of microcirculatory resistance (IMR > 25) are invasive measures of microvascular function. CMD is associated with adverse cardiovascular outcomes including MI, HF, and CV death despite normal angiography."
    },
    riskFactors: [
      "Female sex (CMD is 2-3x more common in women — major contributor to 'women's heart disease')",
      "Traditional CV risk factors: hypertension, diabetes, dyslipidemia, smoking",
      "Obesity and metabolic syndrome",
      "Systemic inflammatory conditions: RA, SLE, vasculitis",
      "Psychological stress and depression",
      "Prior radiation therapy to the chest",
      "Takotsubo cardiomyopathy (persistent CMD after recovery)",
      "Hypertrophic cardiomyopathy (intramural coronary compression)"
    ],
    diagnostics: [
      "Invasive coronary function testing: coronary flow reserve (CFR < 2.0 abnormal), index of microvascular resistance (IMR > 25), acetylcholine provocation for epicardial/microvascular spasm",
      "Cardiac PET: gold standard non-invasive test for myocardial blood flow reserve (MBFR < 2.0 suggests CMD)",
      "Cardiac MRI: stress perfusion defects without corresponding LGE (ischemia without infarction)",
      "Coronary angiography: exclude obstructive CAD (< 50% stenosis in all epicardial vessels = ANOCA)",
      "Echocardiography with coronary flow reserve assessment in LAD using Doppler",
      "Exercise or pharmacological stress testing: may show ST depression/symptoms despite normal epicardial arteries",
      "Endothelin-1 and inflammatory markers (hsCRP) — may be elevated",
      "Screen for CV risk factors: lipid panel, HbA1c, BP assessment"
    ],
    management: [
      "Aggressive CV risk factor modification: BP < 130/80, LDL < 70, HbA1c < 7%, smoking cessation, weight loss",
      "First-line: beta-blocker (reduces myocardial oxygen demand and improves diastolic perfusion time)",
      "Calcium channel blocker (amlodipine or diltiazem) for microvascular spasm component",
      "ACEi/ARB for endothelial function improvement",
      "Ranolazine 500-1000 mg BID (reduces late sodium current, improves microvascular perfusion in some patients)",
      "Statin therapy even with normal LDL (pleiotropic anti-inflammatory and endothelial effects)",
      "Lifestyle modifications: structured exercise program (improves endothelial function and CFR)",
      "Address psychological comorbidities: depression and anxiety treatment; consider cardiac rehabilitation"
    ],
    nursingActions: [
      "Validate patient symptoms — CMD patients are often told 'nothing is wrong' after normal angiography; acknowledge that their condition is real and treatable",
      "Educate on the difference between microvascular and epicardial coronary disease",
      "Monitor symptom response to therapy using angina diary and quality-of-life measures",
      "Coordinate cardiac rehabilitation enrollment — exercise improves microvascular function",
      "Screen for depression and anxiety — high prevalence in CMD patients",
      "Monitor medication tolerance and side effects during treatment escalation",
      "Counsel on cardiovascular risk factor management",
      "Arrange appropriate follow-up for treatment response assessment"
    ],
    signs: {
      left: [
        "Angina with non-obstructive coronary arteries (ANOCA)",
        "Normal epicardial arteries on angiography with reduced CFR on invasive testing",
        "Mild exertional symptoms responsive to beta-blocker therapy",
        "Preserved LVEF with no inducible ischemia on stress testing"
      ],
      right: [
        "Persistent severe angina despite multi-drug therapy",
        "MACE events (MI, HF) from chronic microvascular ischemia",
        "Severe reduction in CFR (< 1.5) indicating extensive microvascular disease",
        "Microvascular spasm with refractory chest pain (positive acetylcholine provocation)"
      ]
    },
    medications: [
      {
        name: "Ranolazine (Ranexa)",
        type: "Late Sodium Current Inhibitor",
        action: "Selectively inhibits the late sodium current (INa-L) in cardiomyocytes, reducing intracellular sodium and calcium overload, improving diastolic relaxation and microvascular perfusion without affecting heart rate or blood pressure",
        sideEffects: "Dizziness, nausea, constipation, QT prolongation (modest), headache",
        contra: "Concurrent strong CYP3A4 inhibitors, severe hepatic impairment, QT prolongation",
        pearl: "Unique mechanism makes it ideal add-on therapy when beta-blockers and CCBs are insufficient. Does not affect HR or BP. May improve microvascular perfusion and reduce angina frequency. Start 500 mg BID, may increase to 1000 mg BID."
      },
      {
        name: "Amlodipine",
        type: "Dihydropyridine Calcium Channel Blocker",
        action: "Blocks L-type calcium channels in vascular smooth muscle causing arterial vasodilation; improves coronary microvascular blood flow and reduces afterload",
        sideEffects: "Peripheral edema (dose-dependent), headache, flushing, dizziness, gingival hyperplasia",
        contra: "Severe aortic stenosis, cardiogenic shock, unstable angina (relative)",
        pearl: "Particularly useful when microvascular spasm is a component of CMD. Long half-life allows once-daily dosing. Can combine with beta-blocker. Does not worsen HF (unlike verapamil/diltiazem). Start 5 mg, titrate to 10 mg."
      }
    ],
    pearls: [
      "CMD affects up to 50% of patients undergoing coronary angiography who have no obstructive CAD — these patients are NOT low-risk; they have 2.5% annual MACE rate and deserve active management",
      "Women are disproportionately affected by CMD, which partly explains the gender gap in ACS outcomes — women more often have ANOCA than obstructive CAD, yet are underdiagnosed and undertreated",
      "Invasive coronary function testing (CFR, IMR, acetylcholine provocation) should be performed during diagnostic angiography in ANOCA patients — it changes management in over 70% of cases"
    ],
    quiz: [
      {
        question: "A 58-year-old woman presents with recurrent exertional chest pain. Coronary angiography shows no significant stenosis. Invasive testing reveals CFR 1.6 and IMR 30. What is the diagnosis and best initial treatment?",
        options: [
          "Non-cardiac chest pain — reassurance only",
          "Coronary microvascular dysfunction — start beta-blocker and risk factor management",
          "Prinzmetal angina — start nifedipine",
          "Anxiety disorder — refer to psychiatry"
        ],
        correct: 1,
        rationale: "CFR < 2.0 and IMR > 25 confirm coronary microvascular dysfunction. This is a real cardiac condition with adverse prognostic implications, not non-cardiac chest pain. Initial treatment includes beta-blockers (reduce myocardial oxygen demand), aggressive risk factor management, and lifestyle modifications. Labeling this as non-cardiac or purely psychiatric is a common diagnostic error."
      }
    ]
  },
  "vasculitis-coronary-arteries-np": {
    title: "Vasculitis of Coronary Arteries: Kawasaki & Takayasu",
    cellular: {
      title: "Inflammatory Arteriopathy Affecting Coronary Vessels",
      content: "Kawasaki disease (KD) is an acute febrile vasculitis of medium-sized arteries primarily affecting children < 5 years. Coronary artery involvement occurs in 25% of untreated cases: inflammatory infiltrate (T cells, macrophages, neutrophils) destroys the internal elastic lamina and media, leading to coronary artery aneurysms. Giant aneurysms (> 8 mm) carry lifelong risk of thrombosis, stenosis, and MI. The pathogenesis involves superantigen-triggered immune activation in genetically susceptible individuals (higher incidence in Japanese and Korean children). Takayasu arteritis is a granulomatous large-vessel vasculitis affecting the aorta and its branches, including coronary ostia. Intimal hyperplasia and adventitial fibrosis cause stenosis and occlusion. Coronary involvement occurs in 10-30% of cases, typically affecting coronary ostia and proximal segments. Both conditions can present with ACS in young adults without traditional cardiovascular risk factors."
    },
    riskFactors: [
      "Kawasaki: age < 5 years, male sex, Asian descent, delayed treatment (> 10 days of illness)",
      "Kawasaki: incomplete/atypical presentation leading to missed diagnosis and no IVIG treatment",
      "Takayasu: female sex (9:1 F:M ratio), age 10-40 years, Asian descent",
      "Takayasu: active systemic inflammation (elevated ESR/CRP)",
      "History of childhood Kawasaki disease presenting as adult with coronary aneurysms/MI",
      "Giant coronary aneurysms from KD (lifelong thrombotic risk)",
      "Genetic susceptibility factors for vasculitis",
      "Delay in diagnosis and treatment of either condition"
    ],
    diagnostics: [
      "Kawasaki clinical criteria: fever >= 5 days + 4 of 5: bilateral conjunctival injection, oral mucosal changes, cervical lymphadenopathy, polymorphous rash, extremity changes (edema, erythema, desquamation)",
      "Echocardiography: coronary artery Z-scores for aneurysm detection and sizing (perform at diagnosis, 2 weeks, and 6-8 weeks)",
      "Kawasaki labs: elevated ESR, CRP, WBC with left shift, platelets (elevated in subacute phase), ALT, anemia, sterile pyuria, hypoalbuminemia",
      "CT/MR angiography: coronary aneurysm surveillance and aortic/branch vessel assessment in Takayasu",
      "Conventional angiography for Takayasu: coronary ostial stenosis, aortic wall thickening, branch vessel involvement",
      "PET/CT: active vessel wall inflammation in Takayasu (FDG uptake correlates with disease activity)",
      "Inflammatory markers in Takayasu: ESR, CRP, IL-6 (monitor disease activity and treatment response)",
      "Biopsy rarely performed; diagnosis is clinical with imaging support"
    ],
    management: [
      "Kawasaki acute phase: IVIG 2 g/kg single infusion within 10 days of fever onset + high-dose ASA 80-100 mg/kg/day until afebrile",
      "Kawasaki convalescent phase: low-dose ASA 3-5 mg/kg/day for 6-8 weeks (lifelong if aneurysms persist)",
      "Kawasaki IVIG-resistant (persistent fever > 36h after IVIG): second IVIG dose, IV methylprednisolone, or infliximab",
      "Giant coronary aneurysms: lifelong anticoagulation (warfarin INR 2-3) + ASA; consider coronary intervention for stenotic segments",
      "Takayasu active phase: prednisone 1 mg/kg/day (taper over months); add methotrexate, azathioprine, or tocilizumab if steroid-dependent",
      "Takayasu coronary involvement: PCI or CABG for significant coronary stenosis (surgical revascularization during quiescent disease preferred)",
      "Monitor for coronary thrombosis and MI in both conditions — maintain vigilance for ACS symptoms",
      "Long-term follow-up: serial imaging surveillance of coronary aneurysms (KD) and vascular stenoses (Takayasu)"
    ],
    nursingActions: [
      "Kawasaki: monitor temperature closely after IVIG administration; assess for IVIG reaction (fever, rigors, hypotension)",
      "Perform serial cardiac assessments including echocardiography coordination for coronary aneurysm surveillance",
      "Educate families on lifelong cardiac follow-up for children with coronary involvement",
      "Takayasu: measure BP in all four extremities — differences > 10 mmHg suggest subclavian or aortic involvement",
      "Monitor inflammatory markers to assess disease activity and treatment response",
      "Educate on importance of immunosuppression adherence in Takayasu (flares cause progressive vascular damage)",
      "Assess for ischemic symptoms: claudication (limb), angina (coronary), neurological symptoms (carotid/vertebral)",
      "Coordinate multidisciplinary care: rheumatology, cardiology, vascular surgery"
    ],
    signs: {
      left: [
        "Kawasaki: classic clinical criteria met with normal coronary arteries on echo",
        "Takayasu: constitutional symptoms (fatigue, arthralgia, fever) in early inflammatory phase",
        "Small coronary aneurysm (< 5 mm) with no thrombosis",
        "Quiescent Takayasu with stable vascular imaging"
      ],
      right: [
        "Giant coronary aneurysm (> 8 mm) with thrombosis causing acute MI",
        "Takayasu with bilateral subclavian stenosis (pulseless disease) and coronary ostial involvement",
        "Kawasaki shock syndrome (hemodynamic instability during acute phase)",
        "Coronary rupture or dissection from vasculitic weakening"
      ]
    },
    medications: [
      {
        name: "Intravenous Immunoglobulin (IVIG)",
        type: "Immunomodulatory",
        action: "Modulates immune response through multiple mechanisms: Fc receptor blockade, anti-inflammatory cytokine induction, complement inhibition, and reduction of activated T cells and endothelial inflammation",
        sideEffects: "Infusion reactions (fever, chills, hypotension), headache (aseptic meningitis rare), thrombotic events (rare), hemolysis, renal dysfunction",
        contra: "IgA deficiency with anti-IgA antibodies (anaphylaxis risk), severe renal impairment",
        pearl: "Must be given within 10 days of fever onset in Kawasaki — reduces coronary aneurysm incidence from 25% to 4%. Single dose 2 g/kg over 10-12 hours. Defer live vaccines (MMR, varicella) for 11 months after IVIG (interferes with vaccine response)."
      },
      {
        name: "Tocilizumab (Actemra)",
        type: "IL-6 Receptor Antagonist",
        action: "Blocks IL-6 signaling by binding IL-6 receptor, suppressing the acute-phase inflammatory response, T-cell activation, and antibody production driving vascular inflammation in Takayasu arteritis",
        sideEffects: "Serious infections, GI perforation, hepatotoxicity, neutropenia, hyperlipidemia, infusion reactions",
        contra: "Active infection, severe hepatic impairment, concurrent live vaccines, absolute neutrophil count < 500",
        pearl: "Effective steroid-sparing agent in Takayasu arteritis. Normalizes CRP (renders CRP unreliable for monitoring — must use imaging/IL-6 levels). Dose: 162 mg SC weekly or 8 mg/kg IV q4 weeks. Monitor CBC, LFTs, lipids. Screen for TB and hepatitis B before starting."
      }
    ],
    pearls: [
      "Kawasaki disease is the leading cause of acquired heart disease in children in developed countries — any child with prolonged fever and 4/5 clinical criteria must receive IVIG within 10 days to prevent coronary aneurysms",
      "Adults presenting with MI and coronary aneurysms should be asked about childhood history of prolonged fever — undiagnosed Kawasaki disease is an underrecognized cause of ACS in young adults",
      "In Takayasu arteritis, CRP becomes unreliable for disease activity monitoring when the patient is on tocilizumab (IL-6 blockade suppresses CRP regardless of ongoing inflammation) — rely on imaging and clinical assessment"
    ],
    quiz: [
      {
        question: "A 3-year-old boy has had 7 days of high fever, bilateral conjunctival injection, strawberry tongue, and swollen hands. Echocardiogram shows a 6 mm coronary artery aneurysm. What is the priority treatment?",
        options: [
          "Oral antibiotics for 10 days",
          "IVIG 2 g/kg infusion plus high-dose aspirin",
          "IV methylprednisolone pulse therapy alone",
          "Observation with serial echocardiography"
        ],
        correct: 1,
        rationale: "This is Kawasaki disease (fever >= 5 days + 4 clinical criteria) with coronary involvement. IVIG 2 g/kg within 10 days of fever onset reduces aneurysm progression from 25% to 4%. High-dose aspirin (80-100 mg/kg/day) is given during the acute febrile phase for anti-inflammatory effect. The coronary aneurysm (6 mm) requires close surveillance and long-term antiplatelet therapy."
      }
    ]
  },
  "infiltrative-cardiomyopathy-np": {
    title: "Infiltrative Cardiomyopathy: Amyloid, Sarcoid & Iron",
    cellular: {
      title: "Pathophysiology of Myocardial Infiltration",
      content: "Infiltrative cardiomyopathies involve deposition of abnormal substances within the myocardial interstitium, causing restrictive physiology with impaired diastolic filling. Cardiac amyloidosis is the most common, with two major types: AL (immunoglobulin light chain — produced by clonal plasma cells) and ATTR (transthyretin — wild-type in elderly or hereditary from TTR gene mutations). Misfolded protein fibrils deposit in the extracellular space, increasing wall thickness and stiffness. Cardiac sarcoidosis involves non-caseating granulomatous inflammation within the myocardium, causing patchy fibrosis, conduction system disease, and ventricular arrhythmias. It can mimic DCM (reduced LVEF) or present with heart block. Cardiac hemochromatosis results from iron overload (hereditary HFE mutations or transfusion-dependent anemia) depositing in cardiomyocytes, causing oxidative damage and both systolic and diastolic dysfunction. Each infiltrative process requires specific diagnostic and treatment approaches."
    },
    riskFactors: [
      "Cardiac amyloidosis ATTR: age > 65 (wild-type ATTR present in 13% of HFpEF patients > 60), TTR gene mutation (Val122Ile variant in 3-4% of African Americans)",
      "Cardiac amyloidosis AL: multiple myeloma, monoclonal gammopathy, Waldenström macroglobulinemia",
      "Cardiac sarcoidosis: African American descent (4x higher prevalence), age 25-60, pulmonary sarcoidosis (cardiac involvement in 5-25%)",
      "Cardiac hemochromatosis: hereditary HFE mutations (C282Y homozygosity), chronic transfusion-dependent anemias (thalassemia major, sickle cell, MDS)",
      "Red flag presentations: HFpEF with LVH + low-voltage ECG (amyloid), unexplained heart block in young patient (sarcoid), heart failure with bronze skin and diabetes (hemochromatosis)",
      "Bilateral carpal tunnel syndrome (ATTR amyloid precedes cardiac involvement by years)",
      "Spinal stenosis (ATTR amyloid deposits in ligamentum flavum)",
      "Autonomic neuropathy: orthostatic hypotension, GI dysmotility (amyloid)"
    ],
    diagnostics: [
      "Echocardiography: increased wall thickness, granular sparkling (amyloid), preserved or reduced LVEF, diastolic dysfunction, pericardial effusion",
      "Cardiac MRI: late gadolinium enhancement patterns — diffuse subendocardial (amyloid), patchy mid-wall (sarcoid), T2* < 20 ms (iron overload)",
      "Tc-99m PYP nuclear scan: Grade 2-3 uptake diagnostic for ATTR cardiac amyloidosis (must exclude AL with SPEP/UPEP/sFLC first)",
      "Serum free light chains (sFLC), SPEP, UPEP, immunofixation: screen for AL amyloidosis",
      "Endomyocardial biopsy: gold standard for amyloid (Congo red staining with apple-green birefringence) and sarcoid (non-caseating granulomas)",
      "Iron studies and T2* cardiac MRI for hemochromatosis (T2* < 10 ms = severe iron overload with high HF risk)",
      "PET/CT with FDG: active cardiac sarcoidosis shows focal myocardial FDG uptake (after dietary preparation to suppress normal glucose uptake)",
      "ECG: low voltage with pseudo-infarct pattern (amyloid), AV block or bundle branch block (sarcoid), low voltage (hemochromatosis)"
    ],
    management: [
      "ATTR cardiac amyloidosis: tafamidis 80 mg daily (TTR stabilizer — ATTR-ACT trial showed 30% mortality reduction); diflunisal as off-label alternative",
      "Hereditary ATTR: tafamidis + consider patisiran (siRNA) or inotersen (antisense oligonucleotide) for polyneuropathy component",
      "AL cardiac amyloidosis: chemotherapy targeting clonal plasma cells — bortezomib/cyclophosphamide/dexamethasone (VCd) or daratumumab-based regimens; refer to hematology urgently",
      "Cardiac sarcoidosis: prednisone 30-40 mg daily for active inflammation (taper over months); add methotrexate, azathioprine, or infliximab for steroid-sparing",
      "Cardiac sarcoid arrhythmias: ICD for LVEF < 35% or significant ventricular arrhythmias; antiarrhythmic therapy; catheter ablation for refractory VT",
      "Cardiac hemochromatosis: iron chelation — deferoxamine IV/SC, deferasirox PO, or deferiprone PO; phlebotomy for hereditary hemochromatosis without severe anemia",
      "HF management: diuretics cautiously (amyloid patients are preload-sensitive); avoid digoxin in amyloid (binds fibrils, risk of toxicity at low levels)",
      "Avoid beta-blockers in cardiac amyloidosis if possible — these patients depend on heart rate to maintain cardiac output (fixed stroke volume from non-compliant ventricle)"
    ],
    nursingActions: [
      "Screen for red flags suggesting infiltrative CMP: LVH with low-voltage ECG, bilateral carpal tunnel syndrome, autonomic neuropathy, unexplained heart block",
      "Monitor for medication-specific toxicity: chelation therapy (agranulocytosis with deferiprone, nephrotoxicity with deferasirox), immunosuppression side effects in sarcoidosis",
      "Educate on the importance of distinguishing AL from ATTR amyloidosis — AL requires urgent chemotherapy while ATTR is treated with tafamidis",
      "Monitor cardiac device function in sarcoidosis (ICD/pacemaker patients)",
      "Assess for systemic manifestations: peripheral neuropathy and orthostatic hypotension (amyloid), pulmonary disease (sarcoid), liver disease and diabetes (hemochromatosis)",
      "Coordinate multidisciplinary care: cardiology, hematology (AL amyloid), rheumatology/pulmonology (sarcoid), hepatology (hemochromatosis)",
      "Genetic counseling for hereditary ATTR and HFE-related hemochromatosis",
      "Caution with volume management — cardiac amyloidosis patients are extremely preload-sensitive; over-diuresis causes symptomatic hypotension"
    ],
    signs: {
      left: [
        "Mild diastolic dysfunction with normal wall thickness on early screening",
        "Asymptomatic bilateral carpal tunnel syndrome (early ATTR amyloid)",
        "Incidental finding of hilar lymphadenopathy and mild conduction delay (early sarcoid)",
        "Mildly elevated ferritin with normal T2* (early iron loading)"
      ],
      right: [
        "Severe HF with massive LVH, low voltage ECG, and pericardial effusion (advanced amyloid)",
        "Complete heart block with VT storm requiring ICD (cardiac sarcoid)",
        "Biventricular failure with T2* < 10 ms (severe cardiac iron overload)",
        "Multi-organ involvement: nephrotic syndrome, autonomic failure, peripheral neuropathy (systemic amyloid)"
      ]
    },
    medications: [
      {
        name: "Tafamidis (Vyndamax/Vyndaqel)",
        type: "TTR Stabilizer",
        action: "Binds to thyroxine-binding sites on TTR tetramer, preventing dissociation into monomers that misfold and deposit as amyloid fibrils in the heart, nerves, and other organs",
        sideEffects: "Generally well-tolerated; UTI, flatulence, abdominal discomfort reported",
        contra: "AL amyloidosis (different mechanism — requires chemotherapy), advanced NYHA IV HF (limited trial data for this population)",
        pearl: "ATTR-ACT trial: 30% all-cause mortality reduction. Must confirm ATTR type BEFORE starting — always exclude AL with SPEP/UPEP/sFLC first (treating AL amyloid with tafamidis alone is fatal due to untreated clonal disease). Tc-99m PYP Grade 2-3 + negative sFLC/SPEP/UPEP = diagnostic for ATTR without biopsy."
      },
      {
        name: "Deferasirox (Exjade/Jadenu)",
        type: "Oral Iron Chelator",
        action: "Binds trivalent iron (Fe3+) with high affinity, forming a soluble complex excreted in feces; removes excess iron from the myocardium, liver, and other organs",
        sideEffects: "Nephrotoxicity (proteinuria, increased Cr), hepatotoxicity, GI upset, skin rash, hearing/visual disturbances",
        contra: "CrCl < 40 mL/min, severe hepatic impairment, high-risk MDS with poor prognosis (limited benefit), platelet count < 50,000",
        pearl: "Dose 14-28 mg/kg/day (Jadenu tablets) or 20-40 mg/kg/day (Exjade dispersible tablets). Monitor renal and hepatic function monthly. Cardiac iron removal is slower than hepatic (may take 1-2 years to normalize T2*). Combination chelation (deferasirox + deferoxamine) for severe cardiac iron overload (T2* < 10 ms)."
      }
    ],
    pearls: [
      "Before starting tafamidis for suspected ATTR amyloidosis, ALWAYS exclude AL amyloidosis with serum free light chains, SPEP, and UPEP — missing AL amyloid is fatal because untreated AL cardiac disease has median survival of 6 months",
      "Digoxin should be avoided in cardiac amyloidosis — amyloid fibrils bind digoxin, increasing myocardial drug concentration and risk of toxicity even at 'therapeutic' serum levels",
      "FDG-PET for cardiac sarcoidosis requires specific dietary preparation (high fat, low carb for 12-24 hours before scan) to suppress normal myocardial glucose uptake — without preparation, false positives are very common"
    ],
    quiz: [
      {
        question: "A 75-year-old man with bilateral carpal tunnel syndrome presents with HF symptoms. Echo shows LVH (wall thickness 16 mm), LVEF 52%, and grade III diastolic dysfunction. ECG shows low voltage. Tc-99m PYP scan shows Grade 3 uptake. Serum free light chains are normal. What is the diagnosis and treatment?",
        options: [
          "AL cardiac amyloidosis — refer for chemotherapy",
          "ATTR cardiac amyloidosis — start tafamidis 80 mg daily",
          "Hypertensive heart disease — start amlodipine",
          "Hypertrophic cardiomyopathy — start metoprolol"
        ],
        correct: 1,
        rationale: "Tc-99m PYP Grade 3 uptake + normal serum free light chains = diagnostic for ATTR cardiac amyloidosis without biopsy. Bilateral carpal tunnel syndrome is a classic precursor. Tafamidis 80 mg daily is the guideline-directed treatment (ATTR-ACT trial). AL amyloidosis is excluded by normal free light chains. Low-voltage ECG with LVH is classic voltage-mass discordance of amyloid, not hypertensive heart disease (which would show high voltage)."
      }
    ]
  },
  "fibromuscular-dysplasia-np": {
    title: "Fibromuscular Dysplasia: Renal & Carotid Involvement",
    cellular: {
      title: "Non-Atherosclerotic Arteriopathy",
      content: "Fibromuscular dysplasia (FMD) is a non-atherosclerotic, non-inflammatory vascular disease causing stenosis, aneurysm, and dissection of medium-sized arteries. The most common form is medial fibroplasia, characterized by alternating areas of media thickening (fibrous ridges) and thinning (microaneurysms), producing the classic 'string-of-beads' appearance on angiography. Renal arteries are most commonly affected (60-75%), causing renovascular hypertension through RAAS activation from reduced renal perfusion. Carotid and vertebral arteries are affected in 25-30%, causing TIA, stroke, or dissection. FMD predominantly affects women (90%), typically presenting at age 25-50. Unlike atherosclerosis, FMD affects the mid-to-distal arterial segments and spares the ostium. Multi-vessel involvement is common — patients with renal FMD should be screened for cervicocephalic involvement and vice versa."
    },
    riskFactors: [
      "Female sex (90% of cases; hormonal factors suspected but not proven)",
      "Age 25-50 years at diagnosis (peak onset)",
      "Family history of FMD (heritable component suggested by familial clustering)",
      "Associated conditions: intracranial aneurysm (7-14% of FMD patients), arterial dissection",
      "Hypertension onset in young woman without traditional risk factors",
      "Pulsatile tinnitus or cervical bruit suggesting cervicocephalic involvement",
      "History of spontaneous arterial dissection (renal, carotid, vertebral, coronary)",
      "Smoking (may accelerate progression)"
    ],
    diagnostics: [
      "CTA or MRA of renal arteries: 'string-of-beads' pattern in mid-to-distal renal artery (medial fibroplasia)",
      "Catheter-based angiography: gold standard for diagnosis and treatment (angioplasty) in same session",
      "Duplex ultrasound of renal arteries: elevated peak systolic velocity > 200 cm/s suggests significant stenosis",
      "CTA or MRA head-to-pelvis: screen for multi-vessel FMD (cervicocephalic + renal + mesenteric + iliac)",
      "Intracranial MRA or CTA: screen for cerebral aneurysms (present in 7-14% of FMD patients)",
      "Plasma renin activity and aldosterone: elevated renin in unilateral renal FMD (activate RAAS)",
      "BP measurement in both arms (subclavian involvement causes asymmetry)",
      "Carotid duplex ultrasound for cervical carotid FMD screening"
    ],
    management: [
      "Renal artery FMD with hypertension: percutaneous transluminal angioplasty (PTA) — cure rate ~50-70% for HTN; improvement in additional 20%",
      "Angioplasty WITHOUT stenting (unlike atherosclerotic RAS — FMD responds well to balloon alone)",
      "Medical management: ACEi/ARB preferred first-line antihypertensive (RAAS-mediated HTN)",
      "Antiplatelet therapy: ASA 81-325 mg daily for all FMD patients",
      "Carotid/vertebral FMD: antiplatelet therapy; angioplasty for symptomatic stenosis causing TIA/stroke",
      "Intracranial aneurysm management: surgical clipping or endovascular coiling for aneurysms > 7 mm or symptomatic",
      "Screen for multi-vessel FMD: all patients with renal FMD should have cervicocephalic imaging and vice versa",
      "Smoking cessation counseling (may slow progression)"
    ],
    nursingActions: [
      "Measure BP in both arms — asymmetry suggests arterial involvement",
      "Educate on the chronic nature of FMD and need for lifelong vascular surveillance",
      "Screen for symptoms in other vascular beds: headache/tinnitus (cervicocephalic), flank pain (renal dissection), claudication (iliac)",
      "Monitor BP response after renal artery angioplasty — cure of HTN may take weeks to months",
      "Coordinate follow-up imaging: renal duplex ultrasound and CTA surveillance per protocol",
      "Assess for signs of arterial dissection: sudden onset severe headache, flank pain, or limb ischemia",
      "Provide genetic counseling — family screening with imaging may be considered",
      "Connect patients with FMD patient advocacy resources (FMDSA.org)"
    ],
    signs: {
      left: [
        "Hypertension in young woman without traditional risk factors",
        "Asymptomatic FMD detected on imaging for other indications",
        "Mild renal artery stenosis with well-controlled BP on ACEi",
        "Stable aneurysm dimensions on serial imaging"
      ],
      right: [
        "Renal artery dissection causing flank pain and renal infarction",
        "Cervicocephalic dissection causing stroke or TIA in young woman",
        "Ruptured intracranial aneurysm with subarachnoid hemorrhage",
        "Refractory hypertension despite medical therapy requiring angioplasty"
      ]
    },
    medications: [
      {
        name: "Ramipril/Perindopril",
        type: "ACE Inhibitor",
        action: "Blocks ACE, reducing angiotensin II formation and aldosterone secretion; counteracts the RAAS activation caused by renal artery stenosis from FMD",
        sideEffects: "Dry cough, hyperkalemia, angioedema, hypotension, renal function decline in bilateral RAS",
        contra: "Bilateral renal artery stenosis (can cause acute renal failure), pregnancy, angioedema history",
        pearl: "First-line antihypertensive for FMD-related HTN. Monitor creatinine 1-2 weeks after initiation — a > 30% rise suggests bilateral RAS and mandates discontinuation. In unilateral FMD, the contralateral kidney protects against significant renal function decline."
      },
      {
        name: "Aspirin",
        type: "Antiplatelet (COX-1 Inhibitor)",
        action: "Irreversibly inhibits COX-1 in platelets, reducing thromboxane A2 and platelet aggregation; reduces thrombotic risk in dysmorphic arterial segments",
        sideEffects: "GI bleeding, peptic ulcer disease, tinnitus at high doses, bruising",
        contra: "Active GI bleeding, aspirin allergy, children with viral illness (Reye syndrome)",
        pearl: "Recommended for all FMD patients (ASA 81 mg daily) due to thrombotic risk from turbulent flow through stenotic and aneurysmal segments. Particularly important after arterial dissection or angioplasty."
      }
    ],
    pearls: [
      "FMD typically affects the mid-to-distal arterial segments, while atherosclerosis affects the ostium and proximal segments — this distinction is important for differential diagnosis on imaging",
      "Angioplasty for renal FMD should be performed WITHOUT stenting (unlike atherosclerotic RAS) — the dysplastic vessel responds well to balloon dilation alone, and stent complications are higher",
      "All patients diagnosed with FMD in one vascular bed should be screened for multi-vessel involvement — up to 65% have disease in more than one territory, and 7-14% have intracranial aneurysms"
    ],
    quiz: [
      {
        question: "A 32-year-old woman presents with new-onset hypertension (BP 165/100). She is otherwise healthy with no family history of HTN. Renal artery duplex shows 'string-of-beads' pattern in the mid-right renal artery. What additional screening should be performed?",
        options: [
          "No additional screening needed — treat hypertension with amlodipine",
          "CT angiography from head to pelvis to screen for multi-vessel FMD and intracranial aneurysms",
          "Coronary angiography to rule out atherosclerosis",
          "Genetic testing for BRCA mutations"
        ],
        correct: 1,
        rationale: "All patients with renal FMD should be screened for cervicocephalic FMD (carotid, vertebral arteries) and intracranial aneurysms (present in 7-14%). CTA from head to pelvis is the recommended comprehensive screening approach. Multi-vessel FMD is found in up to 65% of patients when systematically sought."
      }
    ]
  },
  "renovascular-hypertension-np": {
    title: "Renovascular Hypertension: Screening & Intervention",
    cellular: {
      title: "RAAS Activation from Renal Artery Stenosis",
      content: "Renovascular hypertension results from renal artery stenosis (RAS) causing reduced renal perfusion pressure. The juxtaglomerular apparatus senses decreased afferent arteriolar pressure and releases renin, converting angiotensinogen to angiotensin I, which ACE converts to angiotensin II. Angiotensin II causes systemic vasoconstriction, stimulates aldosterone release (promoting sodium/water retention), and activates sympathetic nervous system — all elevating BP. In unilateral RAS, the contralateral kidney experiences hypertension-induced natriuresis ('pressure natriuresis'), partially compensating. In bilateral RAS, both kidneys retain sodium and water without compensation, causing volume-dependent hypertension with flash pulmonary edema. Atherosclerotic RAS (90% of cases) involves ostial plaque extension from the aorta, while FMD (10%) affects mid-to-distal segments."
    },
    riskFactors: [
      "Atherosclerotic risk factors: age > 55, smoking, diabetes, dyslipidemia, known PAD or CAD",
      "Resistant hypertension (uncontrolled on >= 3 medications including a diuretic)",
      "Flash pulmonary edema with bilateral RAS ('Pickering syndrome')",
      "Acute renal failure after ACEi/ARB initiation (> 30% creatinine rise)",
      "Abdominal bruit (systolic-diastolic bruit highly specific for RAS)",
      "Unilateral small kidney (> 1.5 cm size discrepancy between kidneys on ultrasound)",
      "Fibromuscular dysplasia: young woman with hypertension",
      "Atherosclerotic disease in other vascular territories (CAD, PAD, carotid)"
    ],
    diagnostics: [
      "Duplex ultrasound of renal arteries: peak systolic velocity > 200 cm/s, renal-to-aortic ratio > 3.5 (sensitivity 85-92%)",
      "CTA renal arteries: excellent anatomic detail, distinguishes atherosclerotic (ostial) from FMD (mid-distal); IV contrast required",
      "MRA with gadolinium: alternative to CTA if CKD with eGFR > 30 (avoid gadolinium if eGFR < 30 — nephrogenic systemic fibrosis risk)",
      "Captopril renal scan (renography): functional test showing delayed uptake and excretion in affected kidney; largely replaced by CTA/MRA",
      "Renal artery catheter angiography: gold standard for diagnosis and simultaneous intervention",
      "Plasma renin activity: elevated in renin-dependent RVH (may be suppressed in bilateral RAS)",
      "BMP: creatinine (renal function), potassium (hypokalemia from secondary aldosteronism)",
      "Kidney size assessment on ultrasound: < 9 cm suggests chronic ischemic nephropathy with limited revascularization benefit"
    ],
    management: [
      "Medical management first-line for atherosclerotic RAS: ACEi/ARB (unless bilateral RAS), CCB, diuretic — goal BP < 130/80",
      "Statin therapy and antiplatelet agent for atherosclerotic RAS (cardiovascular risk reduction)",
      "Monitor renal function closely after ACEi/ARB initiation — > 30% creatinine rise suggests bilateral RAS",
      "Revascularization for atherosclerotic RAS: considered only for refractory hypertension despite optimal medical therapy, recurrent flash pulmonary edema, or progressive renal failure",
      "ASTRAL and CORAL trials showed no benefit of stenting over medical therapy for most atherosclerotic RAS — medical therapy is primary approach",
      "FMD: percutaneous angioplasty WITHOUT stenting (cure rate 50-70% for HTN; improvement in additional 20%)",
      "Bilateral RAS: avoid ACEi/ARB (risk of AKI from loss of angiotensin II-mediated efferent arteriolar tone); use CCB and diuretic instead",
      "Surgical revascularization (bypass) rarely performed; reserved for complex anatomy or concurrent aortic surgery"
    ],
    nursingActions: [
      "Listen for renal artery bruit: place stethoscope over flanks and periumbilical area; systolic-diastolic bruit is highly suggestive of RAS",
      "Monitor renal function closely when starting or titrating ACEi/ARB: creatinine at baseline, 1 week, and 1 month",
      "Track BP response to medical therapy — persistent resistance on 3+ medications warrants RAS workup",
      "Educate on cardiovascular risk factor modification (RAS patients have high CVD mortality)",
      "Post-angioplasty/stenting: access site monitoring, renal function trending, BP monitoring for improvement",
      "Coordinate follow-up renal duplex ultrasound 1 month and 6 months post-intervention to assess for restenosis",
      "Assess for flash pulmonary edema history — bilateral RAS should be suspected if recurrent unexplained pulmonary edema",
      "Document kidney sizes and compare serially — progressive unilateral atrophy may indicate worsening ischemic nephropathy"
    ],
    signs: {
      left: [
        "Mild hypertension responsive to medical therapy with stable renal function",
        "Unilateral RAS with preserved kidney size and function",
        "FMD diagnosed incidentally with minimal hemodynamic impact",
        "Atherosclerotic RAS < 50% stenosis (hemodynamically insignificant)"
      ],
      right: [
        "Flash pulmonary edema ('Pickering syndrome') from bilateral RAS",
        "Progressive renal failure despite optimal medical therapy (ischemic nephropathy)",
        "Refractory hypertension on 4+ antihypertensives at maximum doses",
        "Acute kidney injury after ACEi/ARB initiation (bilateral RAS or solitary kidney)"
      ]
    },
    medications: [
      {
        name: "Ramipril",
        type: "ACE Inhibitor",
        action: "Inhibits ACE, reducing angiotensin II-mediated vasoconstriction and aldosterone secretion; counteracts RAAS-driven hypertension in unilateral RAS; provides CV risk reduction (HOPE trial)",
        sideEffects: "Dry cough, hyperkalemia, angioedema, acute renal failure in bilateral RAS",
        contra: "Bilateral renal artery stenosis, solitary kidney with RAS, pregnancy, angioedema history, K+ > 5.5",
        pearl: "First-line for unilateral RAS — effective and provides additional cardiovascular protection. CRITICAL: check creatinine at 1 week. A > 30% rise mandates discontinuation and investigation for bilateral RAS. In unilateral RAS, mild creatinine rise (10-20%) is acceptable and reflects reduced GFR in stenotic kidney."
      },
      {
        name: "Amlodipine",
        type: "Dihydropyridine CCB",
        action: "Blocks L-type calcium channels in vascular smooth muscle, reducing peripheral resistance and lowering BP without affecting renal hemodynamics; safe in bilateral RAS",
        sideEffects: "Peripheral edema, headache, flushing, dizziness, gingival hyperplasia",
        contra: "Severe aortic stenosis, cardiogenic shock",
        pearl: "Safe in bilateral RAS (does not affect RAAS axis or efferent arteriolar tone). Combined with diuretic for bilateral RAS when ACEi/ARB is contraindicated. Dose 5-10 mg daily. Long half-life with smooth 24-hour BP control."
      }
    ],
    pearls: [
      "ASTRAL and CORAL trials demonstrated that stenting for atherosclerotic RAS provides no additional benefit over optimal medical therapy for most patients — revascularization should be reserved for flash pulmonary edema, progressive renal failure, or truly refractory hypertension",
      "FMD-related RAS has much better outcomes with angioplasty than atherosclerotic RAS — cure of hypertension occurs in 50-70% of FMD patients; stenting is NOT needed for FMD",
      "Flash pulmonary edema with bilateral RAS ('Pickering syndrome') is a key indication for revascularization — ACEi/ARB cannot be used safely, and medical therapy alone often fails to prevent recurrent episodes"
    ],
    quiz: [
      {
        question: "A 68-year-old man with PAD, diabetes, and CKD stage 3 starts ramipril 5 mg for resistant hypertension. One week later, creatinine rises from 1.8 to 2.9 mg/dL. What should the NP do?",
        options: [
          "Continue ramipril — mild creatinine rise is expected and acceptable",
          "Stop ramipril immediately and order renal artery imaging",
          "Reduce ramipril dose to 2.5 mg and recheck in 1 month",
          "Add furosemide to improve renal perfusion"
        ],
        correct: 1,
        rationale: "A creatinine rise > 30% (from 1.8 to 2.9 = 61% increase) after starting ACEi strongly suggests bilateral renal artery stenosis. ACEi blocks angiotensin II-mediated efferent arteriolar vasoconstriction, which is the mechanism maintaining GFR in stenotic kidneys. The drug must be stopped immediately and renal artery imaging obtained."
      }
    ]
  },
  "peripheral-embolism-np": {
    title: "Peripheral Embolism: Arterial Thromboembolism Workup",
    cellular: {
      title: "Arterial Embolization Pathophysiology",
      content: "Peripheral arterial embolism occurs when thrombus or other material from a proximal source lodges in a distal artery, causing acute limb ischemia. The most common source is cardiac (80-90%): left atrial thrombus in AF, LV mural thrombus post-MI, valvular vegetations (endocarditis), prosthetic valve thrombus, or cardiac tumors (atrial myxoma). Non-cardiac sources include aortic atherosclerotic plaque, aortic aneurysm mural thrombus, paradoxical embolism through PFO, and iatrogenic (catheter-related). The embolus typically lodges at arterial bifurcations where vessel diameter suddenly decreases — most commonly the femoral bifurcation (35%), followed by iliac (18%), aortic bifurcation ('saddle embolus', 14%), and popliteal (11%). Ischemia duration determines tissue viability: skeletal muscle tolerates ~6 hours of warm ischemia before irreversible damage. Reperfusion injury after prolonged ischemia can cause compartment syndrome, myoglobinuria, hyperkalemia, and metabolic acidosis."
    },
    riskFactors: [
      "Atrial fibrillation (most common cardiac source, especially without anticoagulation)",
      "Recent MI with LV thrombus (anterior STEMI with apical akinesis)",
      "Prosthetic heart valve with inadequate anticoagulation",
      "Infective endocarditis (septic emboli)",
      "Aortic aneurysm with mural thrombus",
      "Patent foramen ovale (paradoxical embolism from venous system)",
      "Atrial myxoma (50% present with embolic events)",
      "Hypercoagulable states: antiphospholipid syndrome, malignancy, heparin-induced thrombocytopenia"
    ],
    diagnostics: [
      "Clinical diagnosis: 6 P's of acute limb ischemia — Pain, Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia (cold)",
      "Rutherford classification: I (viable, no sensory/motor loss), IIa (marginally threatened, salvageable with prompt treatment), IIb (immediately threatened, sensory loss + motor deficit), III (irreversible, anesthetic + paralyzed)",
      "CT angiography: localize embolic occlusion, plan intervention, identify multilevel disease",
      "Duplex ultrasound: if CTA unavailable, assess flow and localize occlusion",
      "Echocardiography (TTE ± TEE): identify cardiac source — LA thrombus, LV thrombus, valvular vegetation, myxoma, PFO with right-to-left shunt",
      "ECG and telemetry for AF detection",
      "Labs: lactate (tissue ischemia), CK/myoglobin (muscle necrosis), potassium (hyperkalemia from reperfusion), creatinine, coagulation studies",
      "Hypercoagulability workup if no clear cardiac source: antiphospholipid antibodies, lupus anticoagulant"
    ],
    management: [
      "Immediate IV heparin bolus (80 U/kg) + infusion (18 U/kg/hr) to prevent thrombus propagation",
      "Rutherford I (viable): anticoagulation and observation with serial assessment",
      "Rutherford IIa/IIb: emergent surgical thromboembolectomy (Fogarty catheter) or catheter-directed thrombolysis",
      "Catheter-directed thrombolysis (alteplase, tenecteplase) for acute-on-chronic thrombosis or distal embolization",
      "Rutherford III (irreversible ischemia > 6 hours): amputation — reperfusion of irreversibly damaged tissue causes lethal reperfusion injury (hyperkalemia, acidosis, myoglobin-induced AKI)",
      "Post-reperfusion: monitor for compartment syndrome (fasciotomy if compartment pressure > 30 mmHg or within 30 mmHg of diastolic BP)",
      "Identify and treat underlying source: anticoagulate AF, treat endocarditis, excise myxoma",
      "Long-term anticoagulation based on source: warfarin/DOAC for AF, warfarin for mechanical valve"
    ],
    nursingActions: [
      "Perform rapid neurovascular assessment: pulse check (femoral, popliteal, dorsalis pedis, posterior tibial), sensation, motor function, capillary refill, skin color/temperature",
      "Document Rutherford classification — guides urgency of intervention",
      "Administer IV heparin bolus immediately upon diagnosis — do not delay for imaging",
      "Mark distal pulse locations with Doppler and monitor hourly after diagnosis and post-intervention",
      "Prepare for emergent surgical thromboembolectomy: consent, NPO, blood type and crossmatch, anesthesia alert",
      "Post-reperfusion monitoring: serial CK, potassium, creatinine, urine output, compartment pressure checks",
      "Monitor for reperfusion syndrome: hyperkalemia (cardiac arrest risk), metabolic acidosis, myoglobinuria (dark urine), AKI",
      "Coordinate cardiac source investigation (echocardiography, telemetry) for secondary prevention"
    ],
    signs: {
      left: [
        "Acute onset unilateral limb pallor and pain with palpable femoral pulse (distal embolism)",
        "Rutherford I-IIa: mild sensory changes but preserved motor function",
        "Successful thromboembolectomy with restored distal perfusion",
        "Identified cardiac source with anticoagulation initiated"
      ],
      right: [
        "Rutherford IIb-III: paralysis, anesthesia, marble-white or mottled limb",
        "Saddle embolus at aortic bifurcation with bilateral leg ischemia",
        "Reperfusion syndrome: hyperkalemia, metabolic acidosis, acute kidney injury, compartment syndrome",
        "Septic emboli from endocarditis with multiorgan infarctions"
      ]
    },
    medications: [
      {
        name: "Unfractionated Heparin (UFH)",
        type: "Indirect Thrombin Inhibitor",
        action: "Binds antithrombin III, accelerating inhibition of thrombin and factor Xa; prevents thrombus propagation and allows endogenous fibrinolysis",
        sideEffects: "Bleeding, HIT (check platelet count day 5-14), osteoporosis with prolonged use",
        contra: "Active bleeding, HIT, severe uncontrolled hypertension, recent neurosurgery",
        pearl: "Bolus 80 U/kg + infusion 18 U/kg/hr; target aPTT 60-80 seconds (1.5-2.5x control). Start IMMEDIATELY on clinical diagnosis of acute limb ischemia — do not delay for imaging. Monitor platelets every 2-3 days for HIT. Fully reversible with protamine sulfate."
      },
      {
        name: "Alteplase (Catheter-Directed)",
        type: "Fibrinolytic (tPA)",
        action: "Activates plasminogen to plasmin at the thrombus surface, dissolving fibrin clot; catheter-directed delivery concentrates drug at the occlusion, reducing systemic bleeding risk",
        sideEffects: "Hemorrhage (major bleeding 5-10%), distal embolization of thrombus fragments, reperfusion injury",
        contra: "Active internal bleeding, recent stroke/surgery, intracranial pathology, known bleeding diathesis",
        pearl: "Catheter-directed thrombolysis is preferred for acute-on-chronic thrombosis or when embolus is in distal vessels inaccessible to Fogarty catheter. Infused 0.5-1.0 mg/hr via catheter embedded in thrombus with angiographic checks every 12-24 hours. Combine with heparin for catheter patency."
      }
    ],
    pearls: [
      "Time is limb — skeletal muscle tolerates approximately 6 hours of warm ischemia; beyond that, irreversible damage occurs and reperfusion becomes more dangerous than therapeutic",
      "Do NOT attempt reperfusion of Rutherford III limb (motor paralysis + sensory loss > 6 hours + marble-white/mottled) — reperfusion of necrotic muscle releases lethal levels of potassium, myoglobin, and acid, causing cardiac arrest and AKI",
      "After successful limb reperfusion, the most dangerous complication is compartment syndrome — monitor compartment pressures closely and perform fasciotomy if pressure > 30 mmHg or within 30 mmHg of diastolic BP"
    ],
    quiz: [
      {
        question: "A patient with AF presents with sudden onset severe right leg pain. The leg is pale, cool, and pulseless below the femoral level. There is loss of light touch sensation but motor function is preserved (can dorsiflex ankle). Rutherford classification is IIa. What is the most appropriate management?",
        options: [
          "Observe with serial neurovascular checks and oral anticoagulation",
          "Start IV heparin immediately and prepare for emergent surgical thromboembolectomy",
          "Apply warming blankets and elevate the extremity",
          "Start IV heparin and schedule elective vascular surgery in 48-72 hours"
        ],
        correct: 1,
        rationale: "Rutherford IIa (marginally threatened: sensory loss present, motor function intact) requires emergent revascularization. IV heparin is started immediately to prevent thrombus propagation. Surgical thromboembolectomy (Fogarty catheter) or catheter-directed thrombolysis should be performed urgently. Observation alone risks progression to irreversible ischemia. Delay of 48-72 hours is inappropriate for a threatened limb."
      }
    ]
  },
  "cholesterol-embolization-np": {
    title: "Cholesterol Embolization Syndrome: Blue Toe & Renal Failure",
    cellular: {
      title: "Atheroembolic Disease Pathophysiology",
      content: "Cholesterol embolization syndrome (CES) occurs when cholesterol crystals from ulcerated atherosclerotic plaques in the aorta embolize to small arteries and arterioles distally. Unlike thromboembolism (which occludes large vessels), cholesterol crystals lodge in 100-200 μm arterioles, triggering an inflammatory foreign body reaction with giant cells, intimal fibrosis, and progressive luminal narrowing. This process is often triggered by vascular procedures (catheterization, aortic surgery), anticoagulation therapy (dissolution of protective thrombus overlying the ulcerated plaque), or fibrinolytic therapy. The classic triad includes livedo reticularis, acute kidney injury, and eosinophilia. Cholesterol clefts are seen on biopsy as biconvex, needle-shaped spaces (the cholesterol dissolves during tissue processing, leaving 'clefts'). The condition is progressive and often fatal (mortality 30-80%) because ongoing embolization causes multi-organ damage."
    },
    riskFactors: [
      "Recent vascular procedure: cardiac catheterization, aortic surgery, endovascular intervention",
      "Anticoagulation therapy (particularly warfarin — dissolves protective thrombus over ulcerated plaque)",
      "Fibrinolytic therapy",
      "Severe aortic atherosclerosis (mobile, protruding atheromas on TEE)",
      "Age > 60 years with extensive atherosclerotic disease",
      "Male sex (2-3:1 predominance)",
      "Hypertension, diabetes, smoking, dyslipidemia",
      "Spontaneous CES can occur without identifiable trigger (~15% of cases)"
    ],
    diagnostics: [
      "Clinical diagnosis: blue toe syndrome (painful blue/purple toes with palpable pedal pulses), livedo reticularis (net-like purplish skin discoloration), acute renal failure post-procedure",
      "Skin biopsy: biconvex cholesterol clefts within arterioles — pathognomonic",
      "Renal biopsy: cholesterol clefts in arcuate and interlobular arteries with inflammatory reaction",
      "Retinal examination: Hollenhorst plaques (refractile cholesterol crystals at arteriolar bifurcations)",
      "Labs: eosinophilia (60-80% of cases), elevated ESR/CRP, hypocomplementemia (C3, C4), elevated LDH, declining renal function",
      "Peripheral smear: eosinophilia without other cause",
      "TEE: assess aortic atherosclerotic burden (mobile/protruding atheromas)",
      "Urinalysis: eosinophiluria (Hansel stain), proteinuria"
    ],
    management: [
      "No specific treatment — management is supportive and aimed at preventing further embolization",
      "Discontinue anticoagulation if possible (paradoxically, anticoagulation promotes CES by exposing ulcerated plaque)",
      "Statin therapy: high-dose statin for plaque stabilization and anti-inflammatory effects",
      "Antiplatelet therapy with aspirin",
      "Aggressive cardiovascular risk factor management: BP control, diabetes management, smoking cessation",
      "Supportive care: dialysis for severe AKI, wound care for ischemic digits, pain management",
      "Surgical exclusion of aortic atheroma source (rare, high-risk procedure) for recurrent severe CES",
      "Corticosteroids have been used empirically but evidence is limited and conflicting"
    ],
    nursingActions: [
      "Inspect feet and toes at each visit — blue toes with palpable pulses is classic for CES (distinguishes from large-vessel embolism where pulses are absent)",
      "Assess for livedo reticularis on lower extremities, buttocks, and flanks",
      "Monitor renal function closely — CES renal failure is typically progressive over weeks (unlike contrast nephropathy which peaks at 3-5 days)",
      "Track eosinophil count and complement levels as markers of ongoing embolization",
      "Perform fundoscopic examination to identify Hollenhorst plaques",
      "Manage pain from ischemic digits — may require multimodal approach",
      "Coordinate nephrology consultation for progressive renal failure",
      "Educate patient on the condition's chronicity and potential for multi-organ involvement"
    ],
    signs: {
      left: [
        "Single blue toe with mild pain and palpable pedal pulses",
        "Focal livedo reticularis on one extremity",
        "Mild creatinine elevation (< 50% above baseline) that stabilizes",
        "Asymptomatic Hollenhorst plaque on routine fundoscopy"
      ],
      right: [
        "Bilateral blue toes progressing to gangrene requiring amputation",
        "Progressive renal failure requiring dialysis (50% of severe CES cases)",
        "Multi-organ involvement: GI ischemia (abdominal pain, GI bleeding), pancreatitis, CNS events",
        "Systemic inflammatory response with high eosinophilia, low complement, and refractory hypertension"
      ]
    },
    medications: [
      {
        name: "Atorvastatin 80 mg",
        type: "HMG-CoA Reductase Inhibitor",
        action: "Reduces cholesterol synthesis, stabilizes atherosclerotic plaques (increases fibrous cap thickness, reduces lipid core), and provides anti-inflammatory effects that may reduce ongoing embolization",
        sideEffects: "Myalgia, hepatotoxicity (rare), rhabdomyolysis (rare), new-onset diabetes",
        contra: "Active liver disease, pregnancy, concurrent strong CYP3A4 inhibitors",
        pearl: "Cornerstone of CES management — statin therapy is associated with improved outcomes. Start high-intensity statin immediately on diagnosis. The anti-inflammatory and plaque-stabilizing effects are as important as LDL reduction in this context."
      },
      {
        name: "Aspirin 81 mg",
        type: "Antiplatelet",
        action: "Inhibits platelet aggregation via COX-1 blockade; reduces thrombotic risk at sites of atheroembolic injury without the paradoxical embolization risk of anticoagulants",
        sideEffects: "GI bleeding, peptic ulcer, tinnitus",
        contra: "Active GI bleeding, aspirin allergy, concurrent anticoagulation in CES (relative contra — risk-benefit discussion)",
        pearl: "Antiplatelet therapy is preferred over anticoagulation in CES — anticoagulants paradoxically worsen CES by dissolving the protective thrombus cap over ulcerated aortic plaque. However, if anticoagulation is absolutely needed (mechanical valve), careful risk-benefit analysis is required."
      }
    ],
    pearls: [
      "Blue toes with palpable pedal pulses is classic for cholesterol embolization — this distinguishes it from large-vessel thromboembolism (absent pulses) and critical limb ischemia (absent pulses)",
      "Anticoagulation WORSENS cholesterol embolization syndrome — warfarin dissolves the protective fibrin cap over ulcerated aortic plaque, exposing cholesterol debris; discontinue anticoagulation unless absolutely required (mechanical valve, acute DVT/PE)",
      "CES renal failure is progressive over weeks, unlike contrast-induced nephropathy which peaks at 3-5 days and resolves — this temporal distinction is important for diagnosis when CES occurs after catheterization"
    ],
    quiz: [
      {
        question: "Three weeks after cardiac catheterization, a 72-year-old on warfarin develops painful blue toes bilaterally with palpable pedal pulses. Creatinine has risen from 1.4 to 2.8 mg/dL. CBC shows 8% eosinophils. What is the most appropriate initial management?",
        options: [
          "Increase warfarin dose for better anticoagulation",
          "Start catheter-directed thrombolysis for peripheral embolism",
          "Discontinue warfarin, start statin and aspirin",
          "Start IV heparin and prepare for embolectomy"
        ],
        correct: 2,
        rationale: "This is cholesterol embolization syndrome (blue toes with palpable pulses, progressive renal failure, eosinophilia post-catheterization). Warfarin paradoxically worsens CES and should be discontinued. High-dose statin stabilizes the source plaque. Aspirin provides antiplatelet protection. Thrombolysis and heparin would worsen embolization by further disrupting atherosclerotic plaque."
      }
    ]
  },
  "effusive-constrictive-pericarditis-np": {
    title: "Effusive-Constrictive Pericarditis: Hemodynamics & Management",
    cellular: {
      title: "Combined Effusion and Constriction Pathophysiology",
      content: "Effusive-constrictive pericarditis (ECP) is a condition where pericardial effusion and visceral pericardial constriction coexist. After pericardiocentesis removes the effusion, constrictive hemodynamics persist because the visceral pericardium (epicardium) is thickened and fibrotic, restricting diastolic filling. This distinguishes ECP from simple effusion (where hemodynamics normalize after drainage) and from pure constrictive pericarditis (which has no significant effusion). The hallmark diagnostic finding is elevated right atrial pressure that fails to decrease by at least 50% after pericardiocentesis. ECP is most commonly caused by tuberculosis (most common globally), idiopathic/viral pericarditis, malignancy, and radiation. It represents a transition phase between acute effusive pericarditis and chronic constrictive pericarditis."
    },
    riskFactors: [
      "Tuberculosis (most common cause worldwide; high prevalence in endemic regions)",
      "Radiation therapy to the chest (breast cancer, lymphoma)",
      "Malignancy: lung cancer, breast cancer, lymphoma, mesothelioma",
      "Prior pericarditis (viral or idiopathic) with recurrent episodes",
      "Post-cardiac surgery pericardial inflammation",
      "Uremia from ESRD",
      "Connective tissue diseases: SLE, rheumatoid arthritis",
      "Bacterial pericarditis"
    ],
    diagnostics: [
      "Pericardiocentesis with hemodynamic monitoring: RA pressure fails to normalize (drops < 50%) after complete fluid removal — diagnostic of ECP",
      "Pre-drainage echocardiography: pericardial effusion with signs of tamponade (RA/RV diastolic collapse)",
      "Post-drainage echocardiography: persistent diastolic dysfunction with septal bounce despite effusion removal",
      "Pericardial biopsy during surgical window or pericardiectomy: identifies etiology (granulomas for TB, malignant cells, fibrosis)",
      "CT/MRI: combined effusion and pericardial thickening; visceral pericardial enhancement suggests active inflammation",
      "Right heart catheterization before and after pericardiocentesis: demonstrate persistent constrictive hemodynamics (elevated RA pressure, dip-and-plateau)",
      "TB workup: AFB smear/culture of pericardial fluid, adenosine deaminase (ADA > 40 U/L suggests TB), interferon-gamma",
      "Pericardial fluid analysis: cell count, protein, LDH, glucose, cytology, cultures, ADA"
    ],
    management: [
      "Pericardiocentesis for initial effusion drainage and hemodynamic assessment",
      "Anti-inflammatory therapy: colchicine 0.5 mg BID ± NSAIDs (ibuprofen 600 mg TID) for inflammatory/viral ECP",
      "Corticosteroids (prednisone 0.25-0.5 mg/kg/day) for recurrent or autoimmune ECP; taper slowly over 3-6 months",
      "Anti-TB therapy (RIPE regimen) for tuberculous ECP — concurrent prednisone may reduce fibrosis progression",
      "Pericardiectomy for progressive constriction despite medical therapy (surgical removal of visceral and parietal pericardium)",
      "Treat underlying malignancy if cancer-associated (systemic chemotherapy, intrapericardial agents)",
      "Serial echocardiography and hemodynamic monitoring to track transition to pure constriction vs resolution",
      "Diuretics cautiously for volume overload (preload-dependent physiology)"
    ],
    nursingActions: [
      "Monitor RA pressure before and after pericardiocentesis — failure to normalize is diagnostic of ECP",
      "Assess for persistent hemodynamic compromise after effusion drainage (persistent JVD, low cardiac output despite dry pericardium)",
      "Coordinate serial echocardiography to track effusion reaccumulation and diastolic function",
      "Administer and monitor anti-inflammatory therapy: GI protection with NSAIDs, metabolic effects of steroids",
      "Ensure TB screening is completed and anti-TB therapy initiated if indicated",
      "Educate on the transitional nature of ECP — may resolve with anti-inflammatory treatment or progress to surgical constriction",
      "Monitor for pericardial drain complications: infection, bleeding, re-accumulation",
      "Prepare for potential pericardiectomy: nutritional optimization, preoperative assessment"
    ],
    signs: {
      left: [
        "Moderate pericardial effusion with mild hemodynamic compromise",
        "Post-drainage RA pressure drops partially but remains mildly elevated",
        "Symptoms improve with anti-inflammatory therapy",
        "Transient constrictive physiology resolving over weeks-months"
      ],
      right: [
        "Persistent RA pressure elevation > 15 mmHg after complete drainage",
        "Progressive constrictive physiology requiring pericardiectomy",
        "Recurrent large effusion despite drainage and medical therapy",
        "TB-related ECP with cardiac cachexia and hepatic congestion"
      ]
    },
    medications: [
      {
        name: "Colchicine",
        type: "Anti-inflammatory",
        action: "Inhibits microtubule polymerization, reducing neutrophil chemotaxis, inflammasome activation, and pericardial inflammation; prevents fibrotic progression of pericarditis",
        sideEffects: "Diarrhea, nausea, myelosuppression (rare), myopathy with statin interaction",
        contra: "Severe renal impairment (dose reduce), severe hepatic disease, concurrent strong CYP3A4 inhibitors",
        pearl: "Colchicine 0.5 mg BID for 3-6 months may prevent progression of ECP to pure constriction. COPE and CORP trials demonstrated benefit in reducing recurrent pericarditis. Monitor CBC and renal function. Statin interaction — check for rhabdomyolysis risk."
      },
      {
        name: "Ibuprofen",
        type: "NSAID (COX Inhibitor)",
        action: "Non-selectively inhibits cyclooxygenase-1 and -2, reducing prostaglandin synthesis, pericardial inflammation, and effusion formation",
        sideEffects: "GI bleeding, peptic ulcer, renal impairment, cardiovascular events (prolonged use), platelet dysfunction",
        contra: "Active GI bleeding, severe renal impairment, CABG within 14 days, third trimester pregnancy",
        pearl: "First-line NSAID for pericarditis: 600-800 mg TID × 1-2 weeks then taper over 4-6 weeks. Always co-prescribe PPI for GI protection. Preferred over indomethacin (better tolerated) and over aspirin (more anti-inflammatory at standard doses). Combine with colchicine for optimal outcomes."
      }
    ],
    pearls: [
      "The diagnostic hallmark of ECP is persistent elevated RA pressure after complete pericardiocentesis — if RA pressure normalizes fully, the diagnosis is simple effusion, not ECP",
      "Tuberculous pericarditis is the most common cause of ECP globally — always perform ADA testing and AFB cultures on pericardial fluid, especially in patients from endemic regions",
      "ECP may be 'transient' (resolves with anti-inflammatory therapy over 3-6 months) or 'permanent' (progresses to pure constrictive pericarditis requiring pericardiectomy) — serial assessment guides the decision"
    ],
    quiz: [
      {
        question: "After pericardiocentesis removes 800 mL of exudative pericardial fluid, a patient's RA pressure only decreases from 22 to 16 mmHg (baseline normal < 8 mmHg). What does this finding indicate?",
        options: [
          "Incomplete drainage — more fluid needs to be removed",
          "Effusive-constrictive pericarditis — visceral pericardial constriction persists despite effusion removal",
          "Cardiac tamponade from pericardial reaccumulation",
          "Normal post-pericardiocentesis hemodynamics"
        ],
        correct: 1,
        rationale: "Persistent elevated RA pressure (16 mmHg, normal < 8) after complete effusion drainage indicates effusive-constrictive pericarditis. The visceral pericardium (epicardium) is fibrotic and restricts diastolic filling even without the effusion. In simple effusive tamponade, RA pressure would normalize after drainage. This finding guides further management toward anti-inflammatory therapy or pericardiectomy."
      }
    ]
  },
  "libman-sacks-endocarditis-np": {
    title: "Libman-Sacks Endocarditis: SLE-Associated Valve Disease",
    cellular: {
      title: "Autoimmune Valvular Vegetations",
      content: "Libman-Sacks endocarditis is a non-infectious form of endocarditis occurring in systemic lupus erythematosus (SLE) and antiphospholipid syndrome (APS). Sterile vegetations composed of fibrin, immune complexes, and inflammatory debris deposit on both surfaces of valve leaflets (characteristically on the ventricular side, unlike infective endocarditis which is on the atrial side). The vegetations are typically small (1-4 mm), broad-based, and located near the leaflet edge. The mitral valve is most commonly affected (50-60%), followed by the aortic valve. Pathogenesis involves anti-phospholipid antibody-mediated endothelial injury, complement activation, and local thrombosis. Chronic inflammation leads to valve thickening, fibrosis, and regurgitation. Vegetations can embolize, causing stroke, TIA, or peripheral embolism. The condition is found in 10-50% of SLE patients on echocardiography, though many are subclinical."
    },
    riskFactors: [
      "Systemic lupus erythematosus (SLE) — particularly with high disease activity",
      "Antiphospholipid syndrome (primary or SLE-associated)",
      "Positive antiphospholipid antibodies: lupus anticoagulant, anti-cardiolipin, anti-beta2 glycoprotein I",
      "Duration of SLE > 5 years",
      "Higher disease activity (anti-dsDNA, low complement, active nephritis)",
      "Prior thromboembolic events",
      "Concurrent valvular heart disease from other causes",
      "Glucocorticoid therapy (may accelerate fibrotic changes)"
    ],
    diagnostics: [
      "Transthoracic echocardiography: vegetations (typically small, broad-based, on ventricular surface of mitral/aortic valves), valve thickening, regurgitation",
      "TEE: higher sensitivity for small vegetations and detailed valve assessment",
      "Blood cultures: NEGATIVE (critical distinction from infective endocarditis — must obtain to exclude infection)",
      "Antiphospholipid antibody panel: lupus anticoagulant, anti-cardiolipin IgG/IgM, anti-beta2 glycoprotein I IgG/IgM",
      "SLE serology: ANA, anti-dsDNA, complement (C3, C4), anti-Smith antibody",
      "CBC (cytopenias from SLE), renal function (lupus nephritis), urinalysis (proteinuria, hematuria)",
      "ESR, CRP (elevated with SLE flare)",
      "Brain MRI if neurological symptoms (embolic stroke risk)"
    ],
    management: [
      "Treat underlying SLE with immunosuppressive therapy: hydroxychloroquine (cornerstone), corticosteroids, mycophenolate, azathioprine",
      "Anticoagulation with warfarin (INR 2-3) for APS-associated Libman-Sacks with thrombotic events",
      "Antiplatelet therapy (aspirin 81 mg) for incidental vegetations without thrombotic history",
      "Hydroxychloroquine for all SLE patients — antithrombotic properties reduce embolic risk and stabilize vegetations",
      "Valve surgery for severe regurgitation causing HF — valve repair preferred over replacement when feasible",
      "DO NOT treat with antibiotics unless infective endocarditis cannot be excluded",
      "Monitor for embolic events: stroke, TIA, peripheral embolism, renal infarction",
      "Serial echocardiography to monitor vegetation size and valvular function"
    ],
    nursingActions: [
      "Ensure blood cultures are obtained before any empiric antibiotics to distinguish from infective endocarditis",
      "Assess for embolic phenomena: stroke symptoms, visual changes, splenic infarction, limb ischemia",
      "Monitor SLE disease activity with serological markers and clinical assessment",
      "Educate on the importance of hydroxychloroquine adherence — reduces thrombotic and cardiac events",
      "Monitor anticoagulation if prescribed (INR for warfarin, bleeding assessment)",
      "Coordinate rheumatology and cardiology care for comprehensive management",
      "Screen for other cardiac manifestations of SLE: pericarditis, myocarditis, coronary arteritis",
      "Assess functional status and valve-related symptoms at each visit"
    ],
    signs: {
      left: [
        "Asymptomatic small vegetations detected incidentally on echocardiography",
        "Mild mitral regurgitation without hemodynamic significance",
        "SLE well-controlled on hydroxychloroquine with stable valve findings",
        "No history of thromboembolic events"
      ],
      right: [
        "Cardioembolic stroke from vegetation embolization",
        "Severe mitral or aortic regurgitation causing symptomatic HF",
        "Large mobile vegetations (> 10 mm) with high embolic risk",
        "Concurrent APS with recurrent thrombotic events despite anticoagulation"
      ]
    },
    medications: [
      {
        name: "Hydroxychloroquine (Plaquenil)",
        type: "Antimalarial / Immunomodulator",
        action: "Inhibits toll-like receptor signaling, reduces cytokine production (IL-1, IL-6, TNF-alpha), interferes with antigen processing; additionally has antithrombotic properties (reduces platelet activation and antiphospholipid antibody binding)",
        sideEffects: "Retinal toxicity (irreversible maculopathy with prolonged use), QT prolongation, nausea, skin hyperpigmentation, myopathy",
        contra: "Pre-existing retinal disease, known hypersensitivity, QT prolongation with concurrent QT drugs",
        pearl: "Should be prescribed to ALL SLE patients unless contraindicated — reduces flares, thrombotic events, and mortality. Maximum dose 5 mg/kg/day real body weight. Annual ophthalmologic screening after 5 years (or sooner with renal impairment). The antithrombotic effect is particularly relevant in Libman-Sacks endocarditis."
      },
      {
        name: "Warfarin",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K-dependent clotting factor synthesis; prevents thromboembolism from valvular vegetations in APS-associated Libman-Sacks",
        sideEffects: "Bleeding, skin necrosis, teratogenicity, drug-food interactions",
        contra: "Active bleeding, pregnancy (teratogenic), severe hepatic failure",
        pearl: "Preferred anticoagulant for APS (DOACs are inferior for APS — TRAPS trial showed higher thrombotic events with rivaroxaban vs warfarin in triple-positive APS). Target INR 2.0-3.0 for APS with venous events; 3.0-4.0 for recurrent arterial events despite INR 2-3. Lifelong anticoagulation for APS with thrombosis."
      }
    ],
    pearls: [
      "Libman-Sacks vegetations are on the VENTRICULAR surface of the valve and affect BOTH sides of the leaflet — this is pathognomonic and distinguishes them from infective endocarditis vegetations (atrial surface only)",
      "DOACs should NOT be used for antiphospholipid syndrome — the TRAPS trial demonstrated higher thrombotic event rates with rivaroxaban compared to warfarin in triple-positive APS patients",
      "Hydroxychloroquine is the single most important medication for all SLE patients — it reduces mortality, prevents flares, and has antithrombotic properties that specifically protect against Libman-Sacks complications"
    ],
    quiz: [
      {
        question: "A 28-year-old woman with SLE and positive lupus anticoagulant has a 4 mm vegetation on the mitral valve with mild MR. Blood cultures are negative. She had a TIA 3 months ago. What is the most appropriate long-term treatment?",
        options: [
          "Rivaroxaban 20 mg daily",
          "Aspirin 81 mg daily alone",
          "Warfarin with target INR 2.0-3.0 plus hydroxychloroquine",
          "IV antibiotics for 6 weeks"
        ],
        correct: 2,
        rationale: "Libman-Sacks endocarditis with APS (positive lupus anticoagulant) and prior TIA requires warfarin anticoagulation (DOACs are inferior in APS — TRAPS trial). Hydroxychloroquine should be prescribed for all SLE patients. Blood cultures are negative, confirming non-infectious etiology — antibiotics are not indicated."
      }
    ]
  },
  "endomyocardial-fibrosis-np": {
    title: "Endomyocardial Fibrosis: Tropical Cardiomyopathy",
    cellular: {
      title: "Fibrotic Restrictive Cardiomyopathy in Tropical Regions",
      content: "Endomyocardial fibrosis (EMF) is a restrictive cardiomyopathy characterized by dense fibrotic thickening of the endocardium, primarily affecting the apices and inflow tracts of one or both ventricles. It is the most common restrictive cardiomyopathy in tropical and subtropical regions (sub-Saharan Africa, India, Brazil). The pathogenesis is multifactorial: eosinophilic infiltration (early inflammatory phase), followed by progressive fibrosis and endocardial thickening. Proposed triggers include hypereosinophilia (parasitic infections, malnutrition), environmental factors (cerium exposure from soil), infectious agents, and genetic susceptibility. The fibrotic process obliterates the ventricular apex, causing restrictive physiology with impaired diastolic filling. AV valve involvement (tethering of leaflets by fibrosis) causes mitral and/or tricuspid regurgitation. Three patterns: left-sided (25%), right-sided (25%), and biventricular (50%)."
    },
    riskFactors: [
      "Residence in tropical/subtropical regions: sub-Saharan Africa, India, Southeast Asia, Brazil",
      "Low socioeconomic status with malnutrition",
      "Parasitic infections causing eosinophilia (filariasis, schistosomiasis, hookworm)",
      "Environmental exposure to cerium and other rare earth elements in soil",
      "Hypereosinophilic syndrome (idiopathic or secondary)",
      "Young age (children and young adults predominantly affected)",
      "Poverty with associated poor nutrition and healthcare access",
      "Cassava consumption (hypothesized dietary factor)"
    ],
    diagnostics: [
      "Echocardiography: apical obliteration (echogenic fibrotic tissue filling ventricular apex), preserved systolic function, dilated atria, AV valve regurgitation, restrictive filling pattern",
      "Cardiac MRI: fibrotic endocardial thickening (late gadolinium enhancement of endocardium), apical obliteration, small ventricular cavities",
      "CT scan: endocardial calcification (may be visible), pericardial effusion",
      "Right heart catheterization: elevated filling pressures, dip-and-plateau pattern, restrictive physiology",
      "CBC: eosinophilia may be present (especially in early inflammatory phase)",
      "Endomyocardial biopsy: fibrotic endocardial thickening (definitive diagnosis but technically difficult and risky)",
      "ECG: low voltage, ST-T changes, atrial fibrillation, P-mitrale or P-pulmonale",
      "CXR: cardiomegaly with prominent atria, pericardial effusion, pulmonary congestion"
    ],
    management: [
      "Medical management: diuretics for volume overload (used cautiously — restrictive physiology is preload-dependent)",
      "Anticoagulation for atrial fibrillation and intracardiac thrombus (common in fibrotic apices)",
      "ACEi/ARB for afterload reduction and neurohumoral blockade",
      "Surgical endocardiectomy (fibrosis resection) with valve repair/replacement for severe cases",
      "Heart transplant evaluation for end-stage EMF refractory to surgery",
      "Treat underlying eosinophilia: antiparasitic therapy, corticosteroids for hypereosinophilic syndrome",
      "Corticosteroids during early inflammatory (eosinophilic) phase may reduce fibrosis progression",
      "Nutritional rehabilitation and treatment of concurrent infections"
    ],
    nursingActions: [
      "Assess for signs of restrictive cardiomyopathy: elevated JVP, hepatomegaly, ascites, peripheral edema with preserved LVEF",
      "Monitor fluid balance carefully — these patients are preload-sensitive; avoid both over- and under-diuresis",
      "Screen for atrial fibrillation and intracardiac thrombus (common complications requiring anticoagulation)",
      "Monitor for eosinophilia and treat underlying parasitic infections",
      "Provide nutritional assessment and support (malnutrition is often a contributing factor)",
      "Educate on anticoagulation adherence and monitoring",
      "Post-surgical care for endocardiectomy: hemodynamic monitoring, wound care, rehabilitation",
      "Coordinate multidisciplinary care: cardiology, infectious disease, nutrition, social services"
    ],
    signs: {
      left: [
        "Mild exercise intolerance with early diastolic dysfunction",
        "Small pericardial effusion without hemodynamic compromise",
        "Preserved LVEF with mild apical fibrosis on imaging",
        "Eosinophilia with early EMF changes responding to treatment"
      ],
      right: [
        "Massive ascites and hepatomegaly from right-sided EMF with severe TR",
        "Severe biventricular failure with refractory volume overload",
        "Intracardiac thrombus with embolic stroke",
        "End-stage EMF requiring transplant evaluation"
      ]
    },
    medications: [
      {
        name: "Furosemide",
        type: "Loop Diuretic",
        action: "Inhibits Na-K-2Cl cotransporter, promoting natriuresis and reducing volume overload in restrictive cardiomyopathy",
        sideEffects: "Hypokalemia, dehydration, metabolic alkalosis, ototoxicity",
        contra: "Anuria, severe hypovolemia",
        pearl: "Use cautiously in EMF — these patients are preload-dependent with small, non-compliant ventricles. Start low (20-40 mg) and titrate slowly. Monitor for signs of over-diuresis (hypotension, rising creatinine). Goal is symptom relief not aggressive volume removal."
      },
      {
        name: "Warfarin",
        type: "Vitamin K Antagonist",
        action: "Reduces thrombotic risk in obliterated ventricular apices where blood stasis promotes clot formation",
        sideEffects: "Bleeding, drug interactions, need for INR monitoring",
        contra: "Active bleeding, severe hepatic disease, pregnancy",
        pearl: "Anticoagulation is essential for EMF with atrial fibrillation or intracardiac thrombus. The fibrotic, obliterated ventricular apex creates blood stasis with high thrombotic potential. Target INR 2.0-3.0. Limited evidence for DOACs in this condition."
      }
    ],
    pearls: [
      "EMF is the most common restrictive cardiomyopathy worldwide but is under-recognized outside of tropical regions — consider the diagnosis in immigrants from endemic areas presenting with unexplained restrictive cardiomyopathy",
      "The disease has two phases: an early inflammatory/eosinophilic phase (potentially reversible with corticosteroids and antiparasitic therapy) and a late fibrotic phase (irreversible, requiring surgical intervention)",
      "Right-sided EMF presents with massive ascites disproportionate to peripheral edema — this pattern should trigger suspicion for EMF, constrictive pericarditis, or hepatic vein thrombosis (Budd-Chiari)"
    ],
    quiz: [
      {
        question: "A 25-year-old immigrant from Nigeria presents with massive ascites, hepatomegaly, and peripheral edema. Echocardiogram shows apical obliteration of the right ventricle with severe tricuspid regurgitation and LVEF 55%. What is the most likely diagnosis?",
        options: [
          "Dilated cardiomyopathy",
          "Endomyocardial fibrosis",
          "Constrictive pericarditis",
          "Tricuspid valve endocarditis"
        ],
        correct: 1,
        rationale: "Apical obliteration of the RV with preserved LVEF in a young patient from sub-Saharan Africa is classic for endomyocardial fibrosis. The massive ascites and severe TR result from fibrotic restriction of RV filling and TR from leaflet tethering. Constrictive pericarditis shows septal bounce and pericardial thickening but not apical obliteration."
      }
    ]
  },
  "culture-negative-ie-np": {
    title: "Culture-Negative Infective Endocarditis: Diagnostic Approach",
    cellular: {
      title: "Blood Culture-Negative Endocarditis Organisms",
      content: "Culture-negative infective endocarditis (CNIE) accounts for 2-31% of all IE cases. The most common cause is prior antibiotic administration before blood cultures are obtained. Fastidious organisms that do not grow on standard media include HACEK group (Haemophilus, Aggregatibacter, Cardiobacterium, Eikenella, Kingella), Coxiella burnetii (Q fever — the most common cause of true CNIE in many series), Bartonella species (cat scratch, homeless/louse exposure), Tropheryma whipplei (Whipple disease), Brucella, and Legionella. Fungi (Aspergillus, Candida) may produce negative standard blood cultures but grow on fungal media or are detected by beta-D-glucan. Non-infectious causes mimicking CNIE include Libman-Sacks (SLE), marantic endocarditis (malignancy-associated), and antiphospholipid syndrome. Specialized testing including serology, PCR of blood or valve tissue, and prolonged culture incubation are essential for diagnosis."
    },
    riskFactors: [
      "Prior antibiotic use before blood culture collection (most common cause of culture-negative IE)",
      "Exposure to farm animals, unpasteurized dairy (Coxiella burnetii, Brucella)",
      "Cat exposure (Bartonella henselae), lice/flea exposure (Bartonella quintana)",
      "Prosthetic heart valve (higher risk for fastidious organisms and fungi)",
      "Homelessness or poor hygiene (Bartonella quintana from body lice)",
      "Immunocompromised status (fungal endocarditis)",
      "Travel to endemic areas for Brucella or Q fever",
      "IV drug use with contaminated equipment (fungal IE)"
    ],
    diagnostics: [
      "Obtain blood cultures before any antibiotic administration (3 sets from separate sites — cannot be overemphasized)",
      "Extended culture incubation (21 days) for HACEK and other slow-growing organisms",
      "Coxiella burnetii serology: Phase I IgG >= 1:800 is a major Duke criterion for Q fever endocarditis",
      "Bartonella serology: IgG >= 1:800 supports diagnosis; PCR of blood or valve tissue if available",
      "Brucella agglutination test and PCR",
      "Tropheryma whipplei PCR (blood, valve tissue) — PAS-positive macrophages on biopsy",
      "Fungal markers: beta-D-glucan (Candida, Aspergillus), galactomannan (Aspergillus), fungal blood cultures",
      "Valve tissue PCR (16S rRNA universal bacterial PCR, 18S rRNA fungal PCR) if surgery performed — highest diagnostic yield",
      "Autoimmune workup if non-infectious cause suspected: ANA, antiphospholipid antibodies, malignancy screening"
    ],
    management: [
      "If prior antibiotics likely cause: hold antibiotics 48-72 hours if clinically stable, repeat blood cultures, then restart empiric therapy",
      "Empiric therapy for CNIE: vancomycin + ceftriaxone + gentamicin (covers staph, strep, HACEK, enterococcus)",
      "Q fever endocarditis (Coxiella): doxycycline 100 mg BID + hydroxychloroquine 200 mg TID × 18 months minimum (lifelong in some cases)",
      "Bartonella endocarditis: ceftriaxone 2 g IV × 6 weeks + gentamicin 3 mg/kg IV × 2 weeks; then oral doxycycline",
      "Brucella endocarditis: doxycycline + gentamicin + rifampin; surgical valve replacement often required",
      "Fungal endocarditis: surgical valve replacement + prolonged antifungal therapy (amphotericin B → oral azole lifelong suppression)",
      "Whipple endocarditis: ceftriaxone 2 g IV × 2 weeks then TMP-SMX PO × 1 year",
      "Surgical valve replacement if severe valvular destruction, large vegetations, or refractory to medical therapy"
    ],
    nursingActions: [
      "Prioritize obtaining 3 sets of blood cultures from separate venipuncture sites before ANY antibiotic dose",
      "Document complete exposure history: animal contacts, travel, occupational exposure, dental procedures, prior antibiotics",
      "Administer antibiotics on strict schedule — bactericidal activity depends on sustained levels",
      "Monitor for embolic complications: daily neurological assessment, skin exam, renal function",
      "Coordinate specialized serological and PCR testing with microbiology laboratory",
      "Ensure prolonged incubation is requested on blood culture orders (21 days for HACEK)",
      "Monitor aminoglycoside levels and renal function (gentamicin — ototoxicity and nephrotoxicity)",
      "Educate on long-term antibiotic therapy for Q fever (18+ months) and importance of adherence"
    ],
    signs: {
      left: [
        "Fever of unknown origin with new or changing murmur and negative blood cultures",
        "Vegetation detected on echocardiography with negative standard cultures",
        "Constitutional symptoms: weight loss, fatigue, night sweats",
        "Mild embolic phenomena: splinter hemorrhages, mild hematuria"
      ],
      right: [
        "Severe valvular destruction requiring emergent surgery despite no organism identified",
        "Major embolic stroke from undiagnosed CNIE",
        "Fungal endocarditis with large vegetations and multiorgan embolic disease",
        "Q fever endocarditis with hepatitis and renal failure (chronic systemic infection)"
      ]
    },
    medications: [
      {
        name: "Doxycycline",
        type: "Tetracycline Antibiotic",
        action: "Inhibits bacterial protein synthesis by binding 30S ribosomal subunit; bacteriostatic but effective against intracellular organisms (Coxiella, Bartonella, Brucella) that cause CNIE",
        sideEffects: "Photosensitivity, GI upset, esophageal ulceration, tooth discoloration in children, hepatotoxicity (rare)",
        contra: "Pregnancy, children < 8 years, severe hepatic disease",
        pearl: "Key component of Q fever IE treatment (with hydroxychloroquine for 18+ months). For Bartonella, combine with ceftriaxone and gentamicin initially. Take with water and remain upright 30 min to prevent esophageal ulcers. Therapeutic drug monitoring not required."
      },
      {
        name: "Hydroxychloroquine (with Doxycycline for Q Fever IE)",
        type: "Antimalarial/Alkalinizing Agent",
        action: "Raises phagolysosomal pH, enhancing doxycycline's bactericidal activity against Coxiella burnetii (which thrives in acidic environment of phagolysosomes); essential for doxycycline efficacy against Q fever",
        sideEffects: "Retinal toxicity, QT prolongation, GI upset, skin pigmentation changes",
        contra: "Retinal disease, QT prolongation, G6PD deficiency (relative), concurrent QT-prolonging drugs",
        pearl: "Q fever endocarditis requires doxycycline + hydroxychloroquine for minimum 18 months. Hydroxychloroquine dose 200 mg TID (higher than lupus dosing). Monitor Coxiella Phase I antibody titers — treatment continues until Phase I IgG < 1:200 and IgA < 1:50. Annual ophthalmology exams for retinal toxicity."
      }
    ],
    pearls: [
      "The single most common cause of 'culture-negative' endocarditis is prior antibiotic administration before blood cultures — this is why the cardinal rule of IE is ALWAYS obtain cultures before antibiotics",
      "Coxiella burnetii (Q fever) is the most common cause of true culture-negative endocarditis in many series — always order Phase I and Phase II antibody titers in CNIE, especially with animal exposure history",
      "Valve tissue PCR (16S rRNA) at the time of surgical valve replacement is the highest-yield diagnostic test for identifying the causative organism in CNIE — always request this when surgery is performed"
    ],
    quiz: [
      {
        question: "A farmer presents with persistent fever, weight loss, and a new mitral regurgitation murmur. Three sets of blood cultures are negative after 7 days. TEE shows a 6 mm vegetation. He works with sheep and goats. What is the most likely organism and diagnostic test?",
        options: [
          "MRSA — repeat blood cultures with prolonged incubation",
          "Coxiella burnetii — order Phase I and Phase II serology",
          "Viridans streptococcus — the cultures must be contaminated",
          "Bartonella henselae — order cat scratch serology"
        ],
        correct: 1,
        rationale: "Occupation with livestock (sheep, goats) exposure combined with culture-negative endocarditis strongly suggests Coxiella burnetii (Q fever). Phase I IgG >= 1:800 is a major Duke criterion for Q fever IE. Coxiella is an obligate intracellular organism that does not grow on standard blood culture media. Treatment requires prolonged doxycycline + hydroxychloroquine for minimum 18 months."
      }
    ]
  },
  "cardiac-tamponade-np": {
    title: "Cardiac Tamponade: Pericardiocentesis & Advanced Management",
    cellular: {
      title: "Tamponade Physiology and Emergency Management",
      content: "Cardiac tamponade represents a clinical spectrum from subclinical effusion to obstructive shock based on the rate of fluid accumulation relative to pericardial compliance. The critical concept is that intrapericardial pressure is determined by both the volume of fluid AND the rate of accumulation. The pericardium has a steep pressure-volume curve — once the elastic limit is exceeded, small additional fluid volumes cause large pressure increases. In tamponade physiology, equal diastolic pressures develop across all chambers (RA = RV diastolic = PCWP = PA diastolic). Enhanced ventricular interdependence within the fixed pericardial space creates respiratory hemodynamic variation: inspiration increases RV filling at the expense of LV filling (septal shift), producing pulsus paradoxus. Cardiac output is maintained by tachycardia (compensatory SNS activation) until decompensation occurs with bradycardia and PEA arrest."
    },
    riskFactors: [
      "Malignancy (most common cause of large pericardial effusion in developed countries)",
      "Uremic pericarditis in ESRD patients",
      "Iatrogenic: cardiac catheterization, pacemaker insertion, CABG, cardiac biopsy",
      "Trauma: penetrating chest injury, blunt cardiac injury",
      "Aortic dissection with pericardial rupture",
      "Coagulopathy or anticoagulation with hemorrhagic effusion",
      "Autoimmune pericarditis: SLE, RA",
      "Hypothyroidism with myxedema (slowly accumulating effusion)"
    ],
    diagnostics: [
      "Bedside echocardiography: pericardial effusion size, RA diastolic collapse (earliest sign), RV diastolic collapse (more specific), IVC plethora (> 2.1 cm without respiratory variation), respiratory variation of mitral/tricuspid inflow > 25-30%",
      "Pulsus paradoxus > 10 mmHg (measured with manual sphygmomanometry)",
      "ECG: sinus tachycardia, low voltage QRS (< 5 mm limb leads, < 10 mm precordial), electrical alternans",
      "CXR: enlarged cardiac silhouette ('water-bottle heart'), clear lung fields",
      "Right heart catheterization: equalization of diastolic pressures, prominent x descent, absent y descent",
      "CT chest: effusion size, pericardial masses, lymphadenopathy (malignant etiology)",
      "Labs: BNP (may be normal or mildly elevated despite severe hemodynamic compromise), troponin, CBC, renal function",
      "Pericardial fluid analysis after drainage: cell count, protein, LDH, glucose, cytology, bacterial/fungal/AFB cultures, adenosine deaminase"
    ],
    management: [
      "Immediate pericardiocentesis for hemodynamically significant tamponade — subxiphoid or apical approach under echo/fluoroscopic guidance",
      "IV fluid resuscitation (500-1000 mL bolus) as temporizing measure to maintain preload",
      "Avoid positive pressure ventilation — reduces venous return and worsens hemodynamics",
      "Avoid vasodilators and diuretics — both reduce preload and worsen tamponade",
      "Inotropes/vasopressors (norepinephrine, dobutamine) only as temporary bridge to drainage",
      "Leave pericardial drain catheter for 24-48 hours if ongoing drainage needed",
      "Pericardial window or pericardiectomy for recurrent effusion (especially malignant)",
      "Intrapericardial sclerosing agents (tetracycline, bleomycin) for malignant effusion prevention"
    ],
    nursingActions: [
      "Recognize Beck's triad immediately: hypotension + JVD + muffled heart sounds — activate emergency response",
      "Perform and interpret bedside POCUS: identify effusion, assess for RA/RV collapse",
      "Measure pulsus paradoxus accurately: inflate cuff above systolic, deflate slowly — note difference between first Korotkoff sounds during expiration vs inspiration",
      "Prepare emergency pericardiocentesis equipment: 18G spinal needle, 60 mL syringe, three-way stopcock, guidewire, drainage catheter",
      "Maintain IV access with crystalloid running — volume resuscitation is the bridge to drainage",
      "Monitor continuously during and after pericardiocentesis: ECG (ST elevation = myocardial contact), BP, HR, drain output",
      "Post-procedure: monitor drain output q1-2h, serial echo, vital signs, assess for reaccumulation",
      "Send pericardial fluid specimens: cytology, cell count, chemistry, cultures (bacterial, fungal, AFB), ADA"
    ],
    signs: {
      left: [
        "Small effusion detected incidentally on echocardiography",
        "Mild pulsus paradoxus (10-12 mmHg) with stable vital signs",
        "Patient comfortable with no hemodynamic compromise",
        "Chronic effusion with slow accumulation tolerating > 500 mL"
      ],
      right: [
        "Acute tamponade: Beck's triad with obstructive shock",
        "Pulsus paradoxus > 20 mmHg with tachycardia and narrow pulse pressure",
        "PEA arrest from tamponade — emergent pericardiocentesis required during CPR",
        "Traumatic tamponade from penetrating injury requiring emergent thoracotomy"
      ]
    },
    medications: [
      {
        name: "IV Normal Saline Bolus",
        type: "Volume Expansion",
        action: "Temporarily increases right-sided filling pressures to exceed intrapericardial pressure, maintaining some cardiac output as a bridge to definitive drainage",
        sideEffects: "Volume overload in non-tamponade conditions, dilutional acidosis",
        contra: "None in tamponade — volume is the immediate lifesaving intervention despite JVD",
        pearl: "Give 500-1000 mL bolus rapidly. Despite JVD suggesting 'volume overload,' tamponade patients are functionally hypovolemic (the heart cannot fill). Volume is the bridge. Do NOT give diuretics. Do NOT initiate positive pressure ventilation without drainage."
      },
      {
        name: "Norepinephrine (if hemodynamically unstable)",
        type: "Alpha-1 and Beta-1 Agonist Vasopressor",
        action: "Alpha-1: increases SVR maintaining coronary and cerebral perfusion; Beta-1: increases contractility and heart rate to maintain cardiac output",
        sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis from extravasation",
        contra: "Mesenteric or peripheral vascular thrombosis (relative)",
        pearl: "Only a temporizing measure — the definitive treatment is pericardiocentesis. Start at 0.1 mcg/kg/min and titrate to MAP > 65. Vasopressors without drainage have limited efficacy because the underlying problem is mechanical obstruction, not vasoplegia."
      }
    ],
    pearls: [
      "Rate of fluid accumulation matters more than volume: 200 mL of acute blood causes tamponade (aortic dissection, trauma), while > 1 L can accumulate chronically without hemodynamic compromise (malignant effusion) due to pericardial stretch",
      "Three classic situations where pulsus paradoxus is ABSENT in tamponade: ASD (equalized atrial pressures), severe AI (LV fills from aorta not atria), and positive pressure ventilation (reverses normal respiratory hemodynamics)",
      "Pericardiocentesis should be performed during CPR if tamponade is suspected as the cause of PEA arrest — removal of even 50 mL can dramatically improve cardiac output and restore ROSC"
    ],
    quiz: [
      {
        question: "A patient with known pericardial effusion becomes acutely hypotensive (BP 70/50), tachycardic (HR 120), and confused. Bedside echo shows large effusion with RV diastolic collapse. The team is preparing for pericardiocentesis. What should be done immediately?",
        options: [
          "Start IV furosemide 80 mg to reduce fluid overload",
          "Intubate and start mechanical ventilation for respiratory support",
          "Bolus 1L normal saline IV and continue preparation for pericardiocentesis",
          "Start IV nitroprusside for afterload reduction"
        ],
        correct: 2,
        rationale: "IV fluid bolus is the immediate bridge intervention — it raises filling pressures to exceed intrapericardial pressure, temporarily maintaining some cardiac output. Furosemide would be catastrophic (drops preload further). Intubation with positive pressure ventilation worsens tamponade hemodynamics (reduces venous return). Nitroprusside drops preload and SVR. Pericardiocentesis remains the definitive treatment."
      }
    ]
  },
  "aortic-dissection-np": {
    title: "Aortic Dissection: Stanford Classification & Prescribing",
    cellular: {
      title: "Aortic Wall Tear and Propagation",
      content: "Aortic dissection occurs when an intimal tear allows blood to enter the media, creating a false lumen that propagates along the aortic wall. The Stanford classification divides dissections into Type A (involves ascending aorta regardless of origin — surgical emergency) and Type B (descending aorta only, distal to left subclavian — typically managed medically). The DeBakey classification further subdivides: I (ascending + descending), II (ascending only), III (descending only). The medial layer is weakened by cystic medial degeneration (loss of elastic fibers and smooth muscle cells), accelerated by hypertension, connective tissue disorders (Marfan, Ehlers-Danlos, Loeys-Dietz), and bicuspid aortic valve. Propagation is driven by shear stress (dP/dt) — the rate of pressure rise during systole. This is why both HR and BP must be reduced emergently. Complications include aortic rupture (most common cause of death), coronary malperfusion (MI), cerebral malperfusion (stroke), mesenteric ischemia, renal ischemia, and limb ischemia."
    },
    riskFactors: [
      "Hypertension (present in 70-80% of cases — most important modifiable risk factor)",
      "Connective tissue disorders: Marfan syndrome (FBN1), Loeys-Dietz (TGFBR1/2), Ehlers-Danlos type IV (COL3A1)",
      "Bicuspid aortic valve (associated with ascending aortic aneurysm and dissection)",
      "Pre-existing aortic aneurysm (diameter > 5.5 cm significantly increases dissection risk)",
      "Cocaine/stimulant use (acute catecholamine surge and chronic hypertension)",
      "Pregnancy (third trimester and postpartum — Marfan patients at highest risk)",
      "Prior cardiac surgery or aortic instrumentation",
      "Age > 60 years, male sex (3:1 M:F)"
    ],
    diagnostics: [
      "CT angiography (CTA) of chest/abdomen/pelvis: gold standard — sensitivity/specificity > 98%; identifies intimal flap, true and false lumen, extent of dissection, branch vessel involvement",
      "TEE: excellent sensitivity (98%) for ascending aortic dissection; can be performed at bedside in unstable patients; identifies aortic regurgitation, pericardial effusion",
      "CXR: widened mediastinum (62%), abnormal aortic contour (50%), pleural effusion (left-sided); may be normal in 10-20%",
      "ECG: may show LVH (hypertension), inferior STEMI (RCA involvement), new Q waves, or be normal",
      "D-dimer: very high sensitivity if < 500 ng/mL within 24 hours (NPV > 95%); but very non-specific",
      "BP in both arms: differential > 20 mmHg suggests arch/subclavian involvement",
      "Point-of-care echo: pericardial effusion (Type A complication), aortic root dilation, aortic regurgitation",
      "Labs: troponin (coronary malperfusion), lactate (mesenteric ischemia), creatinine (renal malperfusion), hemoglobin (hemorrhage)"
    ],
    management: [
      "Immediate medical therapy for ALL aortic dissections: reduce HR to < 60 bpm AND SBP to 100-120 mmHg to reduce aortic wall shear stress",
      "IV esmolol (500 mcg/kg bolus then 50-200 mcg/kg/min) or labetalol (20 mg bolus then 1-2 mg/min infusion) — FIRST-LINE: must reduce HR before BP",
      "Add IV nicardipine (5-15 mg/hr) or nitroprusside ONLY AFTER adequate beta-blockade (vasodilators alone cause reflex tachycardia which increases shear stress)",
      "Type A (ascending): EMERGENT surgical repair (mortality increases ~1-2% per hour without surgery; operative mortality 15-20%)",
      "Type B uncomplicated: medical management (anti-impulse therapy) with close surveillance; 30-day mortality 10% with medical therapy",
      "Type B complicated (malperfusion, rupture, refractory pain, rapid expansion): thoracic endovascular aortic repair (TEVAR)",
      "Pain management: IV morphine (also reduces sympathetic drive); adequate analgesia is therapeutic",
      "Avoid anticoagulation unless specific indication (contraindicated if rupture or hemorrhage)"
    ],
    nursingActions: [
      "Recognize aortic dissection presentation: sudden tearing/ripping chest or back pain (maximal at onset), BP differential between arms, pulse deficits",
      "Establish bilateral IV access and arterial line for continuous BP monitoring",
      "Administer IV beta-blocker FIRST — reducing HR before BP prevents reflex tachycardia which increases dP/dt",
      "Target HR < 60 bpm AND SBP 100-120 mmHg — titrate infusions q5 min during active management",
      "Monitor for malperfusion syndromes: neurological changes (stroke), abdominal pain (mesenteric), oliguria (renal), limb pallor/pain (peripheral)",
      "Keep patient NPO — Type A requires emergent surgery; Type B may require urgent TEVAR",
      "Serial bilateral arm BP checks and pulse assessments (radial, femoral, pedal) — new deficits suggest propagation",
      "Coordinate emergent cardiothoracic surgery consultation for Type A dissection"
    ],
    signs: {
      left: [
        "Uncomplicated Type B dissection: controlled pain, stable BP on oral meds, no malperfusion",
        "Chronic dissection (> 14 days): stable false lumen, no expansion on serial imaging",
        "Intramural hematoma (dissection variant): wall thickening without intimal flap",
        "Well-controlled post-surgical repair with stable imaging"
      ],
      right: [
        "Type A dissection with aortic rupture into pericardium (tamponade — often fatal)",
        "Coronary malperfusion causing acute STEMI (usually RCA involvement with inferior changes)",
        "Mesenteric malperfusion: severe abdominal pain, lactic acidosis, bowel ischemia",
        "Bilateral limb ischemia from aortic bifurcation involvement"
      ]
    },
    medications: [
      {
        name: "Esmolol",
        type: "Ultra-short-acting Beta-1 Selective Blocker",
        action: "Selectively blocks beta-1 receptors, reducing HR, contractility, and dP/dt (rate of aortic pressure rise) — directly reduces shear stress on the dissection flap",
        sideEffects: "Hypotension, bradycardia, bronchospasm (less than non-selective), injection site irritation",
        contra: "Severe sinus bradycardia, 2nd/3rd degree heart block, decompensated HF, cocaine use (relative — labetalol preferred)",
        pearl: "First-line for aortic dissection due to ultra-short half-life (9 min) — allows rapid titration. Bolus 500 mcg/kg then 50-200 mcg/kg/min. If inadequate response, can add nicardipine for additional BP reduction AFTER HR is controlled. Can quickly stop infusion if complications arise."
      },
      {
        name: "Nicardipine IV",
        type: "Dihydropyridine CCB",
        action: "Selective arterial vasodilation reducing afterload and systolic BP; added AFTER beta-blocker to avoid reflex tachycardia",
        sideEffects: "Reflex tachycardia (must be given WITH beta-blocker), headache, flushing, phlebitis",
        contra: "Must not be given before beta-blocker in dissection — reflex tachycardia increases dP/dt and shear stress",
        pearl: "Second-line after adequate beta-blockade. Start 5 mg/hr, titrate by 2.5 mg/hr q5 min (max 15 mg/hr). Predictable dose-response relationship. Continue both esmolol and nicardipine until HR < 60 and SBP 100-120 are achieved and maintained."
      }
    ],
    pearls: [
      "ALWAYS reduce heart rate BEFORE reducing blood pressure in aortic dissection — vasodilators without beta-blockade cause reflex tachycardia which increases dP/dt (aortic wall shear stress), potentially worsening dissection propagation",
      "Type A aortic dissection has 1-2% mortality PER HOUR without surgical repair — this is one of the true surgical emergencies in medicine; once diagnosed, the patient goes directly to the operating room",
      "Aortic dissection can mimic STEMI (coronary malperfusion) — giving fibrinolysis or anticoagulation for suspected STEMI in a patient who actually has dissection is catastrophic; always consider dissection in the differential of severe chest pain and check BP in both arms"
    ],
    quiz: [
      {
        question: "A 62-year-old presents with sudden severe tearing chest pain radiating to the back. BP is 195/110 in the right arm and 165/90 in the left arm. HR is 95. What is the correct sequence of initial medical management?",
        options: [
          "IV nicardipine first, then add esmolol once BP is controlled",
          "IV esmolol to control HR < 60, then add nicardipine to reduce SBP to 100-120",
          "IV nitroprusside to rapidly lower BP, then add metoprolol",
          "IV heparin bolus and prepare for emergent catheterization (suspected STEMI)"
        ],
        correct: 1,
        rationale: "In aortic dissection, HR reduction must come FIRST (esmolol) to decrease dP/dt. Only after adequate beta-blockade (HR < 60) should vasodilators (nicardipine) be added for BP control (target SBP 100-120). Starting with vasodilators alone causes reflex tachycardia which increases aortic wall shear stress. Heparin is contraindicated in dissection."
      }
    ]
  },
  "pulmonary-embolism-np": {
    title: "Pulmonary Embolism: Wells Criteria & Thrombolysis",
    cellular: {
      title: "Pulmonary Vascular Obstruction and RV Failure",
      content: "Pulmonary embolism occurs when thrombus (usually from lower extremity DVT) lodges in the pulmonary arterial vasculature. Mechanical obstruction plus vasoactive mediator release (serotonin, thromboxane A2) from platelets causes acute increase in pulmonary vascular resistance (PVR). The thin-walled RV cannot generate systolic pressures > 40-50 mmHg acutely, so a large clot burden rapidly leads to RV dilation, dysfunction, and failure. RV dilation shifts the interventricular septum leftward (D-sign on echo), impairing LV filling and reducing cardiac output. This ventricular interdependence creates a death spiral: reduced CO → reduced coronary perfusion → RV ischemia → further RV failure. Risk stratification categorizes PE as massive (with sustained hypotension), submassive (normotensive but with RV dysfunction/elevated biomarkers), or low-risk (normotensive, no RV dysfunction). This classification drives treatment decisions regarding systemic thrombolysis, catheter-directed therapy, or anticoagulation alone."
    },
    riskFactors: [
      "Recent DVT (most PEs originate from iliofemoral DVT)",
      "Recent surgery or immobilization (orthopedic, abdominal, pelvic surgery — highest risk)",
      "Active malignancy (especially pancreatic, lung, brain, ovarian)",
      "Hormonal therapy: combined OCP, HRT, pregnancy/postpartum",
      "Prior VTE (30% recurrence without extended anticoagulation)",
      "Inherited thrombophilia: Factor V Leiden, prothrombin G20210A, protein C/S deficiency",
      "Long-haul travel (> 4 hours with immobility)",
      "Central venous catheter, obesity, acute medical illness with immobility"
    ],
    diagnostics: [
      "Wells score for pre-test probability: clinical signs of DVT (3), no alternative diagnosis (3), HR > 100 (1.5), immobilization/surgery in 4 weeks (1.5), previous DVT/PE (1.5), hemoptysis (1), malignancy (1)",
      "D-dimer with age-adjusted cutoff (age × 10 for patients > 50): high sensitivity, moderate specificity; useful to rule out PE with low pre-test probability",
      "CT pulmonary angiography (CTPA): gold standard imaging; identifies clot location and RV/LV ratio for risk stratification",
      "V/Q scan: for patients with contrast allergy or severe CKD; interpreted as normal, low, intermediate, or high probability",
      "Echocardiography: RV dilation, hypokinesis, D-sign (septal bowing), McConnell sign (RV free wall hypokinesis with apical sparing), elevated PASP, RA/RV thrombus",
      "Troponin and BNP: elevated in submassive PE (prognostic markers, not diagnostic)",
      "Compression ultrasound of lower extremities: concurrent DVT found in 50% of PE cases",
      "PESI or sPESI score for mortality risk stratification"
    ],
    management: [
      "Anticoagulation for ALL hemodynamically stable PE: DOAC preferred (rivaroxaban 15 mg BID × 21 days then 20 mg daily, or apixaban 10 mg BID × 7 days then 5 mg BID)",
      "Massive PE (hypotension SBP < 90 for > 15 min or requiring vasopressors): systemic thrombolysis — alteplase 100 mg IV over 2 hours (or 50 mg if > 75 years or high bleeding risk)",
      "Submassive PE (normotensive + RV dysfunction + elevated troponin/BNP): individualized — consider catheter-directed therapy or close monitoring with rescue thrombolysis if deterioration",
      "IV heparin bolus (80 U/kg) + infusion (18 U/kg/hr) for massive PE or when thrombolysis is planned",
      "RV support in massive PE: IV fluids cautiously (250-500 mL bolus — over-resuscitation worsens RV dilation), norepinephrine for RV perfusion, avoid intubation if possible",
      "Catheter-directed therapy (CDT): catheter-directed thrombolysis or mechanical thrombectomy for massive/high-risk submassive PE — lower bleeding risk than systemic lysis",
      "Surgical embolectomy for massive PE when thrombolysis is contraindicated or has failed",
      "IVC filter only for acute PE with absolute contraindication to anticoagulation"
    ],
    nursingActions: [
      "Calculate Wells score or use clinical gestalt to determine PE probability and guide testing",
      "Obtain CTPA urgently for moderate-to-high probability PE; D-dimer for low probability",
      "For massive PE: establish large-bore IV access, initiate heparin immediately, prepare for thrombolysis or CDT, place on continuous monitoring",
      "Administer supplemental oxygen to maintain SpO2 > 94%; prepare for intubation if respiratory failure (use ketamine for induction — hemodynamic stability)",
      "Monitor RV function: serial echocardiography, troponin trending, hemodynamic parameters",
      "Post-thrombolysis monitoring: frequent neurological checks (intracranial hemorrhage risk), access site assessment, serial hemoglobin",
      "Educate on anticoagulation: DOAC compliance, duration (provoked 3 months, unprovoked indefinite), bleeding precautions",
      "Assess for post-PE syndrome: persistent dyspnea may indicate chronic thromboembolic pulmonary hypertension (CTEPH) — refer if symptoms persist > 3 months"
    ],
    signs: {
      left: [
        "Low-risk PE: mild dyspnea and tachycardia, normal BP, normal RV function, sPESI 0",
        "Normal troponin and BNP with small segmental/subsegmental PE",
        "Hemodynamically stable on oral anticoagulation",
        "Resolution of symptoms with appropriate anticoagulation"
      ],
      right: [
        "Massive PE: hypotension (SBP < 90), syncope, obstructive shock requiring vasopressors",
        "RV failure: dilated RV with D-sign, elevated troponin and BNP, shock index > 1",
        "Cardiac arrest from PE (PEA most common rhythm)",
        "Post-PE CTEPH: progressive dyspnea months after PE despite anticoagulation"
      ]
    },
    medications: [
      {
        name: "Alteplase (tPA) for PE",
        type: "Fibrinolytic",
        action: "Activates plasminogen to plasmin, dissolving fibrin clot in pulmonary arteries; rapidly reduces clot burden and PVR, allowing RV recovery",
        sideEffects: "Intracranial hemorrhage (2-3% in massive PE), major systemic bleeding (5-10%)",
        contra: "Active internal bleeding, hemorrhagic stroke ever, ischemic stroke within 3 months, intracranial neoplasm, recent surgery (3 weeks), known bleeding diathesis, aortic dissection",
        pearl: "For massive PE: 100 mg IV over 2 hours (standard dose) or 50 mg IV over 15 minutes (accelerated dose for cardiac arrest). Can give during CPR for PE-related cardiac arrest. Continue heparin infusion during alteplase administration. Consider half-dose (50 mg) for patients > 75 years or weight < 65 kg to reduce bleeding risk."
      },
      {
        name: "Apixaban (Eliquis)",
        type: "Direct Factor Xa Inhibitor",
        action: "Directly inhibits factor Xa, blocking thrombin generation; prevents clot propagation and allows endogenous fibrinolysis to resolve existing PE",
        sideEffects: "Bleeding, bruising, anemia",
        contra: "Active pathological bleeding, severe hepatic disease, prosthetic heart valve, CrCl < 15",
        pearl: "Single-drug approach for PE treatment: 10 mg BID × 7 days loading, then 5 mg BID maintenance. No heparin lead-in required (unlike warfarin, edoxaban, dabigatran). AMPLIFY trial showed similar efficacy to warfarin with 69% less major bleeding. For extended treatment (> 6 months), 2.5 mg BID is approved."
      }
    ],
    pearls: [
      "In massive PE with cardiac arrest, thrombolysis should be administered during CPR — alteplase 50 mg IV push; continue CPR for 60-90 minutes before terminating resuscitation (thrombolysis needs time to work)",
      "Avoid aggressive IV fluid resuscitation in massive PE — the failing RV is already volume-overloaded, and additional volume worsens RV dilation, increases septal shift, and further impairs LV output; small boluses (250 mL) are safer",
      "If intubation is required for massive PE, use ketamine for induction — it maintains SVR and sympathetic tone unlike propofol (which causes vasodilation and cardiac depression that can be fatal in massive PE)"
    ],
    quiz: [
      {
        question: "A 55-year-old presents with acute dyspnea and is found to have bilateral PE on CTPA. BP is 80/50 despite 500 mL NS bolus. HR is 120. Echo shows severely dilated RV with D-sign. Troponin is 2.4 ng/mL. What is the most appropriate treatment?",
        options: [
          "Start apixaban 10 mg BID and admit for monitoring",
          "Systemic alteplase 100 mg IV over 2 hours with IV heparin",
          "Start heparin drip and arrange outpatient follow-up in 48 hours",
          "Give 2 L IV fluids to increase preload and improve cardiac output"
        ],
        correct: 1,
        rationale: "This is massive PE (hypotension despite fluids, RV failure, elevated troponin). Systemic thrombolysis with alteplase is the treatment of choice for massive PE to rapidly reduce clot burden and restore RV function. Oral anticoagulation alone is insufficient for massive PE. Aggressive IV fluids (2 L) would worsen RV dilation and further impair cardiac output."
      }
    ]
  },
  "fat-embolism-np": {
    title: "Fat Embolism: Gurd's Criteria & ARDS Management",
    cellular: {
      title: "Fat Embolism Syndrome Pathophysiology",
      content: "Fat embolism syndrome (FES) occurs when fat globules enter the venous circulation, typically after long bone or pelvic fractures, and cause systemic inflammatory response. Two mechanisms are proposed: the mechanical theory states that fat from disrupted bone marrow enters torn medullary venous sinusoids and embolizes to the lungs and, through intracardiac shunts or by traversing pulmonary capillaries, to the brain and other organs. The biochemical theory proposes that free fatty acids released by lipolysis of neutral fat (triggered by lipase activation from stress response) are directly toxic to pulmonary endothelium and pneumocytes, causing ARDS. Fat globules cause platelet aggregation, fibrin deposition, and complement activation in pulmonary microvasculature. The classic triad of FES is respiratory distress (most common and earliest), neurological deterioration (cerebral fat emboli), and petechial rash (conjunctival, axillary, anterior chest — 50-60% of cases). Gurd's criteria define major and minor features for diagnosis."
    },
    riskFactors: [
      "Long bone fractures (femur, tibia — highest risk; bilateral fractures increase risk 10-fold)",
      "Pelvic fractures with significant marrow disruption",
      "Orthopedic surgery: intramedullary nailing, hip/knee arthroplasty",
      "Multiple fractures and polytrauma",
      "Delayed fracture fixation (> 24 hours increases FES risk)",
      "Liposuction (direct fat entry into venous circulation)",
      "Pancreatitis (lipase-mediated fat necrosis)",
      "Bone marrow biopsy, sickle cell crisis with bone marrow infarction"
    ],
    diagnostics: [
      "Gurd's criteria: requires 1 major + 4 minor + fat macroglobulinemia; Major: petechial rash, respiratory distress, cerebral signs; Minor: tachycardia > 110, pyrexia > 38.5°C, retinal emboli, fat in urine/sputum, platelet drop > 50%, increased ESR, anemia drop > 20%",
      "Clinical diagnosis: classic triad of respiratory distress (12-72 hours post-injury) + neurological changes + petechiae",
      "CXR/CT chest: bilateral diffuse infiltrates (ARDS pattern), 'snowstorm' appearance",
      "ABG: hypoxemia (PaO2/FiO2 < 300 defines ARDS) with respiratory alkalosis initially",
      "CT/MRI brain: multiple small high-signal foci on DWI/FLAIR ('starfield' pattern) — cerebral fat emboli",
      "Fundoscopy: retinal fat emboli (cotton-wool spots, hemorrhages — Purtscher-like retinopathy)",
      "Labs: thrombocytopenia, anemia, elevated lipase, fat in urine (Sudan stain), elevated ESR, coagulopathy",
      "Bronchoalveolar lavage (BAL): fat-laden macrophages (oil red O staining) — supportive but not pathognomonic"
    ],
    management: [
      "Prevention: early fracture fixation (< 24 hours) reduces FES incidence significantly — 'damage control orthopedics'",
      "Supportive care is mainstay — no specific pharmacological treatment for FES",
      "Respiratory support: supplemental O2 → high-flow nasal cannula → non-invasive ventilation → intubation and mechanical ventilation for ARDS",
      "Lung-protective ventilation for ARDS: tidal volume 6 mL/kg IBW, plateau pressure < 30 cmH2O, PEEP titrated per FiO2/PEEP table, permissive hypercapnia",
      "Fluid management: conservative fluid strategy once hemodynamically stable (FACTT trial — less positive fluid balance improves outcomes in ARDS)",
      "Prone positioning for moderate-severe ARDS (P/F < 150) for >= 16 hours/day (PROSEVA trial — 28-day mortality benefit)",
      "Methylprednisolone has been used empirically for FES (limited evidence; may reduce inflammatory cascade)",
      "Thromboprophylaxis with LMWH (FES patients are also at high VTE risk from immobility and fractures)"
    ],
    nursingActions: [
      "Monitor all fracture patients closely for 72 hours post-injury — FES typically presents 12-72 hours after fracture",
      "Assess for classic triad: respiratory distress (earliest and most common), neurological changes (confusion, agitation, coma), petechial rash (conjunctivae, axillae, anterior chest — transient, may disappear within hours)",
      "Continuous SpO2 monitoring and serial ABGs in suspected FES",
      "Inspect skin carefully for petechiae — they are often subtle, transient, and easily missed; check conjunctivae, axillary folds, and anterior chest",
      "If mechanically ventilated: implement lung-protective strategy, monitor plateau pressures, manage PEEP titration",
      "Perform prone positioning per protocol for moderate-severe ARDS: secure lines and tubes, pressure point padding, monitor for complications",
      "Maintain strict I&O and conservative fluid balance (avoid positive fluid balance in ARDS)",
      "Coordinate with orthopedic surgery for early definitive fracture fixation if not already done"
    ],
    signs: {
      left: [
        "Mild hypoxemia 24-48 hours post-fracture responsive to supplemental O2",
        "Scattered petechiae on anterior chest without hemodynamic compromise",
        "Mild confusion clearing with supportive care",
        "Mild thrombocytopenia without clinical bleeding"
      ],
      right: [
        "Fulminant ARDS with P/F ratio < 100 requiring mechanical ventilation",
        "Severe cerebral fat embolism with coma and diffuse brain injury on MRI",
        "DIC with significant bleeding and multi-organ failure",
        "Cardiac failure from massive pulmonary fat embolization (rare, fulminant FES)"
      ]
    },
    medications: [
      {
        name: "Methylprednisolone (for FES prophylaxis/treatment)",
        type: "Systemic Corticosteroid",
        action: "Reduces inflammatory cascade triggered by fat emboli: inhibits phospholipase A2, stabilizes lysosomal membranes, reduces capillary permeability, and decreases complement activation",
        sideEffects: "Hyperglycemia, immunosuppression, GI bleeding, adrenal suppression, wound healing impairment",
        contra: "Active systemic infection, uncontrolled diabetes, GI bleeding",
        pearl: "Prophylactic methylprednisolone (1.5 mg/kg q8h × 3 days) may reduce FES incidence in high-risk fracture patients (meta-analyses suggest benefit, but evidence is moderate quality). Not universally recommended. If used, start within 6 hours of injury. Monitor blood glucose closely."
      },
      {
        name: "Enoxaparin (VTE prophylaxis in fracture patients)",
        type: "LMWH",
        action: "Prevents VTE through antithrombin III-mediated factor Xa and thrombin inhibition; fracture patients are at extremely high VTE risk from immobility and endothelial injury",
        sideEffects: "Bleeding, HIT, injection site hematoma",
        contra: "Active bleeding, HIT, severe thrombocytopenia, renal failure (CrCl < 30 — use UFH instead)",
        pearl: "Start VTE prophylaxis (enoxaparin 40 mg SC daily or 30 mg SC BID for high-risk orthopedic) as soon as hemostasis is achieved. FES and VTE are separate entities — preventing VTE does not prevent FES. Mechanical prophylaxis (IPC devices) should be used in addition."
      }
    ],
    pearls: [
      "FES is a clinical diagnosis — no single laboratory test confirms it; Gurd's criteria or the Schonfeld score provide diagnostic frameworks but clinical suspicion in the right context (long bone fracture + respiratory/neuro/petechiae within 72 hours) is most important",
      "Petechiae in FES are pathognomonic when present but transient (may disappear within hours) — actively inspect conjunctivae, axillae, and anterior chest in any post-fracture patient with unexplained hypoxemia or confusion",
      "Early fracture fixation (< 24 hours) is the single most effective intervention to prevent FES — this is a key quality metric in trauma care and should be communicated to the orthopedic team"
    ],
    quiz: [
      {
        question: "A 28-year-old with bilateral femur fractures develops confusion, tachypnea, and SpO2 85% on day 2 post-injury. Chest exam reveals bilateral crackles. You notice a petechial rash across the anterior chest and conjunctivae. CXR shows bilateral infiltrates. What is the most likely diagnosis and initial management?",
        options: [
          "Pulmonary embolism — start heparin and order CTPA",
          "Fat embolism syndrome — supportive care with supplemental O2 and lung-protective ventilation",
          "Hospital-acquired pneumonia — start broad-spectrum antibiotics",
          "Transfusion-related acute lung injury — stop blood products"
        ],
        correct: 1,
        rationale: "The classic triad of respiratory distress, neurological changes (confusion), and petechial rash 24-72 hours after long bone fractures is pathognomonic for fat embolism syndrome. Management is primarily supportive with oxygen therapy and lung-protective mechanical ventilation if ARDS develops. There is no specific antidote. Early fracture fixation (if not already done) may prevent further fat embolization."
      }
    ]
  }
};
