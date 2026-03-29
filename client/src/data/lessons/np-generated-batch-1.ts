import type { LessonContent } from "./types";

export const npGeneratedBatch1: Record<string, LessonContent> = {
  "hf-advanced-np": {
    title: "Heart Failure: Neurohormonal Blockade",
    cellular: {
      title: "Pathophysiology of Heart Failure",
      content: "Heart Failure: Neurohormonal Blockade centers on progressive myocardial dysfunction. In systolic HF (HFrEF, EF <=40%), cardiomyocyte loss from ischemia, toxins, or genetic causes reduces contractile force. Compensatory neurohormonal activation (RAAS, sympathetic nervous system, natriuretic peptides) initially maintains cardiac output but chronically causes adverse remodeling: ventricular dilation, interstitial fibrosis, and further myocyte apoptosis. Elevated angiotensin II promotes vasoconstriction, aldosterone-mediated sodium/water retention, and myocardial fibrosis. Sustained sympathetic activation causes beta-receptor downregulation and direct myocyte toxicity. B-type natriuretic peptide (BNP) is released from stretched ventricular myocytes."
    },
    riskFactors: [
      "Coronary artery disease (most common cause, ~60-70% of HF cases)",
      "Hypertension with chronic pressure overload causing concentric hypertrophy",
      "Diabetes mellitus with direct myocardial metabolic injury",
      "Valvular heart disease (aortic stenosis, mitral regurgitation)",
      "Cardiotoxic agents: alcohol, doxorubicin, trastuzumab, cocaine",
      "Familial dilated cardiomyopathy (genetic variants in TTN, LMNA, MYH7)",
      "Obesity (BMI >30) with increased plasma volume and cardiac workload"
    ],
    diagnostics: [
      "BNP >100 pg/mL or NT-proBNP >300 pg/mL supports diagnosis (age-adjusted cutoffs)",
      "Transthoracic echocardiography for EF, chamber dimensions, wall motion, valvular function",
      "12-lead ECG for Q waves, LBBB, arrhythmia, LVH (present in ~90% of HF)",
      "Chest X-ray: cardiomegaly (CTR >0.5), cephalization, Kerley B lines, pleural effusions",
      "BMP including sodium (dilutional hyponatremia = poor prognosis), potassium, creatinine",
      "Iron studies (iron deficiency present in ~50% of HF patients)",
      "Coronary angiography or stress testing to evaluate ischemic etiology"
    ],
    management: [
      "GDMT quadruple therapy: ACEi/ARB/ARNI + beta-blocker + MRA + SGLT2i for HFrEF",
      "Start sacubitril/valsartan (ARNI) after tolerating ACEi; do NOT use within 36h of ACEi",
      "Titrate carvedilol or metoprolol succinate to target doses (not heart rate-guided)",
      "Add spironolactone 25-50mg if EF <=35% and eGFR >30 (monitor K+ within 1 week)",
      "Dapagliflozin or empagliflozin 10mg daily regardless of diabetes status",
      "Loop diuretics (furosemide, bumetanide) for volume management - titrate to euvolemia",
      "IV iron (ferric carboxymaltose) if ferritin <100 or ferritin 100-300 with TSAT <20%"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea on exertion (most sensitive symptom)",
        "Orthopnea requiring 2+ pillows",
        "Paroxysmal nocturnal dyspnea (PND)",
        "S3 gallop (volume overload)"
      ],
      right: [
        "Elevated JVP >8 cmH2O",
        "Hepatojugular reflux positive",
        "Bilateral lower extremity pitting edema",
        "Ascites and hepatomegaly in right-sided failure"
      ]
    },
    medications: [
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "ARNI",
        action: "Sacubitril inhibits neprilysin increasing natriuretic peptides; valsartan blocks AT1 receptors reducing RAAS activation",
        sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment",
        contra: "History of angioedema with ACEi, concurrent ACEi use (36h washout required), pregnancy",
        pearl: "PARADIGM-HF showed 20% reduction in CV death vs enalapril. Start at 24/26mg BID, titrate to 97/103mg BID."
      },
      {
        name: "Carvedilol (Coreg)",
        type: "Non-selective beta-blocker with alpha-1 blockade",
        action: "Blocks beta-1, beta-2, and alpha-1 receptors; reduces mortality by counteracting chronic sympathetic activation",
        sideEffects: "Bradycardia, hypotension, fatigue, weight gain, bronchospasm",
        contra: "Decompensated HF, HR <60, SBP <90, 2nd/3rd degree heart block, severe asthma",
        pearl: "Start 3.125mg BID, double every 2 weeks to target 25mg BID. COPERNICUS trial: 35% mortality reduction in severe HF."
      }
    ],
    pearls: [
      "Quadruple therapy (ARNI + BB + MRA + SGLT2i) is now standard GDMT for HFrEF",
      "BNP levels can be falsely low in obesity due to reduced natriuretic peptide production by adipocytes",
      "Sodium restriction to <2g/day and daily weight monitoring remain cornerstones of self-management"
    ],
    quiz: [
      {
        question: "A 62-year-old with HFrEF (EF 30%) is on lisinopril, carvedilol, and furosemide. K+ 4.2, Cr 1.3, eGFR 55. Which medication should be added next?",
        options: [
          "Digoxin 0.125mg daily",
          "Spironolactone 25mg daily",
          "Hydralazine/isosorbide dinitrate",
          "Ivabradine 5mg BID"
        ],
        correct: 1,
        rationale: "Spironolactone (MRA) is part of GDMT quadruple therapy for HFrEF. With EF <=35%, eGFR >30, and K+ <5.0, spironolactone should be added."
      }
    ]
  },
  "afib-management-np": {
    title: "Atrial Fibrillation: Rate vs Rhythm Control",
    cellular: {
      title: "Pathophysiology of Atrial Fibrillation",
      content: "Atrial Fibrillation involves disorganized electrical activity from multiple re-entrant wavelets and ectopic foci from pulmonary vein ostia. Atrial myocytes undergo electrical remodeling with shortened action potential duration. Structural remodeling includes atrial fibrosis creating substrate for re-entry. Loss of atrial kick reduces cardiac output by 15-25% and causes left atrial appendage stasis increasing thromboembolic risk. CHA2DS2-VASc score guides anticoagulation."
    },
    riskFactors: [
      "Age >65 (prevalence 10% in >80y)",
      "Hypertension (present in ~70%)",
      "Heart failure",
      "Valvular heart disease (especially mitral stenosis)",
      "Obesity",
      "Obstructive sleep apnea (2-4x increased risk)",
      "Hyperthyroidism and alcohol (holiday heart)"
    ],
    diagnostics: [
      "12-lead ECG: irregularly irregular rhythm, absent P waves",
      "CHA2DS2-VASc score for stroke risk",
      "HAS-BLED score for bleeding risk",
      "Echocardiography: LA size, LV function, valvular disease",
      "TSH to exclude hyperthyroidism",
      "Holter or event monitor for paroxysmal AF",
      "BMP including K+, Mg2+"
    ],
    management: [
      "Rate control target HR <110 bpm (RACE II) with beta-blocker or CCB",
      "Rhythm control for symptomatic patients (EAST-AFNET 4)",
      "DOAC anticoagulation (apixaban, rivaroxaban) preferred over warfarin",
      "Cardioversion after TEE or 3 weeks anticoagulation",
      "Catheter ablation for refractory symptomatic paroxysmal AF",
      "Address reversible causes: thyroid, alcohol, sleep apnea",
      "LAA occlusion (Watchman) if anticoagulation contraindicated"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Palpitations (70%)",
        "Dyspnea on exertion",
        "Fatigue and exercise intolerance",
        "Dizziness"
      ],
      right: [
        "Irregularly irregular pulse",
        "Variable S1 intensity",
        "Pulse deficit",
        "Hemodynamic compromise if RVR >150"
      ]
    },
    medications: [
      {
        name: "Apixaban (Eliquis)",
        type: "Factor Xa Inhibitor",
        action: "Selectively inhibits Factor Xa preventing thrombin generation",
        sideEffects: "Bleeding (GI, intracranial); reversal: andexanet alfa",
        contra: "Active bleeding, prosthetic heart valve, severe hepatic disease",
        pearl: "ARISTOTLE: superior to warfarin. 5mg BID standard; 2.5mg BID if >=2 of: age >=80, weight <=60kg, Cr >=1.5."
      },
      {
        name: "Metoprolol succinate",
        type: "Beta-1 Selective Blocker",
        action: "Blocks cardiac beta-1 receptors reducing AV node conduction velocity",
        sideEffects: "Bradycardia, fatigue, depression, bronchospasm",
        contra: "Severe bradycardia, sick sinus, decompensated HF, severe asthma",
        pearl: "Start 25-50mg daily, titrate to HR <110. Do NOT use in pre-excited AF (WPW)."
      }
    ],
    pearls: [
      "CHA2DS2-VASc >=2 (men) or >=3 (women) requires anticoagulation with DOACs preferred",
      "EAST-AFNET 4: early rhythm control reduces CV outcomes",
      "Never use AV nodal blockers in pre-excited AF (WPW) - can cause VF"
    ],
    quiz: [
      {
        question: "A 68-year-old with new AF, HTN, DM (CHA2DS2-VASc 4), HR 124. Best initial management?",
        options: [
          "Immediate cardioversion",
          "Metoprolol IV + initiate apixaban",
          "Flecainide",
          "Aspirin 325mg daily"
        ],
        correct: 1,
        rationale: "Rate control with IV metoprolol and anticoagulation with apixaban is appropriate for stable AF with CHA2DS2-VASc 4."
      }
    ]
  },
  "hypertensive-emergency-np": {
    title: "Hypertensive Emergency: End-Organ Damage",
    cellular: {
      title: "Pathophysiology of Hypertensive Emergency",
      content: "Hypertensive Emergency: End-Organ Damage involves specific alterations in hypertensive emergency physiology. The pathophysiology of Hypertensive Emergency encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of hypertensive emergency."
    },
    riskFactors: [
      "Diabetes mellitus type 2 with HbA1c >7%",
      "Heavy alcohol use (>14 drinks/week males, >7 females)",
      "Obstructive sleep apnea (AHI >15 events/hr)",
      "Prior stroke or TIA with residual neurological deficit",
      "Left ventricular hypertrophy on ECG or echo",
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Chronic inflammatory conditions (RA, SLE, psoriasis)"
    ],
    diagnostics: [
      "BNP >100 pg/mL or NT-proBNP >300 pg/mL for volume overload assessment",
      "Coagulation studies: PT/INR, aPTT, D-dimer",
      "Cardiac catheterization: coronary anatomy, hemodynamic measurements",
      "Holter or event monitor for intermittent arrhythmia detection",
      "CRP and ESR for inflammatory/infectious cardiac conditions",
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "Chest X-ray: cardiac silhouette, pulmonary vascularity, effusions"
    ],
    management: [
      "Antiplatelet therapy: aspirin 81mg daily for established ASCVD",
      "Anticoagulation: DOACs preferred over warfarin for non-valvular AF",
      "Cardiac rehabilitation referral (Phase I-III) for functional recovery",
      "Sodium restriction <2g/day for volume-sensitive conditions",
      "Structured exercise program: 150 min/week moderate-intensity aerobic",
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "CRT for EF <=35% with LBBB and QRS >=150ms"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Chest pain or pressure",
        "Dyspnea on exertion or at rest",
        "Palpitations or irregular heartbeat",
        "Syncope or near-syncope"
      ],
      right: [
        "Jugular venous distension",
        "Bilateral lower extremity edema",
        "Hepatomegaly with hepatojugular reflux",
        "Abnormal heart sounds (murmur, gallop, rub)"
      ]
    },
    medications: [
      {
        name: "Amlodipine (Norvasc)",
        type: "Dihydropyridine CCB",
        action: "Blocks L-type calcium channels in vascular smooth muscle causing vasodilation",
        sideEffects: "Peripheral edema (dose-dependent), flushing, headache, gingival hyperplasia",
        contra: "Severe aortic stenosis, cardiogenic shock, unstable angina (use with caution)",
        pearl: "Start 5mg daily, max 10mg. Safe in HFpEF. Edema is dose-related, not allergic."
      },
      {
        name: "Furosemide (Lasix)",
        type: "Loop Diuretic",
        action: "Inhibits Na-K-2Cl cotransporter in thick ascending limb of Henle reducing sodium and water reabsorption",
        sideEffects: "Hypokalemia, hyponatremia, ototoxicity, hyperuricemia, dehydration",
        contra: "Anuria, hepatic coma, severe electrolyte depletion",
        pearl: "IV:PO ratio 1:2 (40mg IV = 80mg PO). Ceiling dose 160-200mg IV. Monitor K+ and Mg2+."
      }
    ],
    pearls: [
      "Beta-blockers reduce mortality in HFrEF but NOT in HFpEF",
      "DOACs preferred over warfarin for non-valvular AF; warfarin still required for mechanical valves",
      "BNP can be falsely low in obesity; use NT-proBNP cutoffs adjusted for age and BMI"
    ],
    quiz: [
      {
        question: "Which diagnostic finding is most specific for acute decompensation in hypertensive emergency?",
        options: [
          "Normal chest X-ray",
          "BNP 50 pg/mL",
          "Elevated troponin with ECG changes",
          "Normal echocardiogram"
        ],
        correct: 2,
        rationale: "Elevated troponin with ECG changes indicates myocardial injury requiring urgent evaluation in the context of hypertensive emergency."
      }
    ]
  },
  "acs-management-np": {
    title: "Acute Coronary Syndrome: Risk Stratification",
    cellular: {
      title: "Pathophysiology of Acute Coronary Syndrome",
      content: "Acute Coronary Syndrome: Risk Stratification involves specific alterations in acute coronary syndrome physiology. The pathophysiology of Acute Coronary Syndrome encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of acute coronary syndrome."
    },
    riskFactors: [
      "Tobacco use (pack-year dependent risk calculation)",
      "Chronic inflammatory conditions (RA, SLE, psoriasis)",
      "Prior stroke or TIA with residual neurological deficit",
      "Heavy alcohol use (>14 drinks/week males, >7 females)",
      "Coronary artery disease with prior MI or PCI",
      "Hypercoagulable states (Factor V Leiden, antiphospholipid)",
      "Sedentary lifestyle with deconditioning"
    ],
    diagnostics: [
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "Chest X-ray: cardiac silhouette, pulmonary vascularity, effusions",
      "Holter or event monitor for intermittent arrhythmia detection",
      "Coagulation studies: PT/INR, aPTT, D-dimer",
      "Troponin I or T serial measurements (0h, 3h, 6h) for myocardial injury",
      "Ambulatory blood pressure monitoring for white coat vs masked HTN",
      "Ankle-brachial index for peripheral vascular disease screening"
    ],
    management: [
      "Beta-blocker titration to resting HR 60-70 bpm",
      "CRT for EF <=35% with LBBB and QRS >=150ms",
      "Sodium restriction <2g/day for volume-sensitive conditions",
      "Anticoagulation: DOACs preferred over warfarin for non-valvular AF",
      "Blood pressure target <130/80 mmHg (ACC/AHA 2017 guidelines)",
      "Referral for surgical intervention when medical therapy insufficient",
      "Fluid restriction 1.5-2L/day for hyponatremia or severe HF"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Substernal chest tightness radiating to arm/jaw",
        "Progressive exercise intolerance",
        "Orthopnea requiring elevated sleeping position",
        "Diaphoresis with exertional symptoms"
      ],
      right: [
        "Peripheral cyanosis or pallor",
        "Blood pressure asymmetry",
        "Altered peripheral pulses",
        "New cardiac murmur or changed murmur character"
      ]
    },
    medications: [
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "ARNI",
        action: "Dual inhibition: sacubitril inhibits neprilysin (increases natriuretic peptides); valsartan blocks AT1 receptors",
        sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment, dizziness",
        contra: "ACEi angioedema history, concurrent ACEi (36h washout), pregnancy",
        pearl: "PARADIGM-HF: 20% CV death reduction. Start 24/26mg BID, titrate to 97/103mg BID over 2-4 weeks."
      },
      {
        name: "Apixaban (Eliquis)",
        type: "Direct Factor Xa Inhibitor",
        action: "Selectively and reversibly inhibits Factor Xa preventing thrombin generation and clot formation",
        sideEffects: "Bleeding (major GI, intracranial); reversal agent: andexanet alfa",
        contra: "Active pathological bleeding, prosthetic mechanical heart valve, severe hepatic impairment",
        pearl: "Standard: 5mg BID. Reduce to 2.5mg BID if >=2 of: age >=80, weight <=60kg, Cr >=1.5 mg/dL."
      }
    ],
    pearls: [
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status",
      "Avoid NSAIDs in heart failure (fluid retention) and post-ACS (increased CV events)",
      "Troponin elevation without ACS: consider PE, myocarditis, Takotsubo, renal failure, sepsis"
    ],
    quiz: [
      {
        question: "A 65-year-old with acute coronary syndrome presents with dyspnea, JVD, and bilateral crackles. BNP 850 pg/mL. Which initial intervention is most appropriate?",
        options: [
          "IV furosemide 40mg and continuous monitoring",
          "Immediate cardiac catheterization",
          "Start amiodarone drip",
          "Discharge with PCP follow-up in 2 weeks"
        ],
        correct: 0,
        rationale: "IV furosemide addresses acute volume overload in acute coronary syndrome with continuous monitoring for response."
      }
    ]
  },
  "cardiac-arrest-acls-np": {
    title: "Cardiac Arrest: ACLS Algorithms",
    cellular: {
      title: "Pathophysiology of Cardiac Arrest",
      content: "Cardiac Arrest: ACLS Algorithms involves specific alterations in cardiac arrest physiology. The pathophysiology of Cardiac Arrest encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of cardiac arrest."
    },
    riskFactors: [
      "Sedentary lifestyle with deconditioning",
      "Obesity (BMI >30) with metabolic syndrome",
      "Diabetes mellitus type 2 with HbA1c >7%",
      "Tobacco use (pack-year dependent risk calculation)",
      "Heavy alcohol use (>14 drinks/week males, >7 females)",
      "Chronic kidney disease (eGFR <60 mL/min)",
      "Obstructive sleep apnea (AHI >15 events/hr)"
    ],
    diagnostics: [
      "Ankle-brachial index for peripheral vascular disease screening",
      "CT angiography of chest for aortic or pulmonary vascular pathology",
      "BNP >100 pg/mL or NT-proBNP >300 pg/mL for volume overload assessment",
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "Coagulation studies: PT/INR, aPTT, D-dimer",
      "Cardiac MRI for tissue characterization (edema, fibrosis, infiltration)",
      "Cardiac catheterization: coronary anatomy, hemodynamic measurements"
    ],
    management: [
      "Fluid restriction 1.5-2L/day for hyponatremia or severe HF",
      "SGLT2 inhibitor for HF regardless of diabetes status",
      "Antiplatelet therapy: aspirin 81mg daily for established ASCVD",
      "Beta-blocker titration to resting HR 60-70 bpm",
      "Anticoagulation: DOACs preferred over warfarin for non-valvular AF",
      "Loop diuretics titrated to euvolemia based on daily weights",
      "Cardiac rehabilitation referral (Phase I-III) for functional recovery"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Substernal chest tightness radiating to arm/jaw",
        "Progressive exercise intolerance",
        "Orthopnea requiring elevated sleeping position",
        "Diaphoresis with exertional symptoms"
      ],
      right: [
        "Peripheral cyanosis or pallor",
        "Blood pressure asymmetry",
        "Altered peripheral pulses",
        "New cardiac murmur or changed murmur character"
      ]
    },
    medications: [
      {
        name: "Carvedilol (Coreg)",
        type: "Non-selective Beta + Alpha-1 Blocker",
        action: "Blocks beta-1, beta-2, and alpha-1 adrenergic receptors; antioxidant properties",
        sideEffects: "Bradycardia, hypotension, dizziness, weight gain, bronchospasm, fatigue",
        contra: "Decompensated HF, SBP <90, HR <55, 2nd/3rd degree AV block, severe asthma/COPD",
        pearl: "HF dose: start 3.125mg BID, target 25mg BID. COPERNICUS: 35% mortality reduction. Take with food."
      },
      {
        name: "Spironolactone (Aldactone)",
        type: "Mineralocorticoid Receptor Antagonist",
        action: "Competitively blocks aldosterone at collecting duct; reduces sodium retention, fibrosis, and remodeling",
        sideEffects: "Hyperkalemia, gynecomastia, breast tenderness, menstrual irregularity",
        contra: "K+ >5.0 mEq/L, eGFR <30, concurrent K+-sparing diuretics, Addison disease",
        pearl: "HF: 25mg daily. RALES: 30% mortality reduction. Check K+ at 3 days and 1 week. Switch to eplerenone if gynecomastia."
      }
    ],
    pearls: [
      "Right-sided MI: volume-dependent; avoid nitrates and diuretics, give IV fluids",
      "Target LDL <70 mg/dL for established ASCVD (consider <55 for very high risk)",
      "Beta-blockers reduce mortality in HFrEF but NOT in HFpEF"
    ],
    quiz: [
      {
        question: "A 58-year-old with cardiac arrest has LDL 145, diabetes, and HTN. Best lipid management?",
        options: [
          "Lifestyle modification only for 6 months",
          "Moderate-intensity statin",
          "High-intensity statin (atorvastatin 40-80mg)",
          "Ezetimibe monotherapy"
        ],
        correct: 2,
        rationale: "With multiple ASCVD risk factors and cardiac arrest, high-intensity statin therapy is indicated per ACC/AHA guidelines."
      }
    ]
  },
  "hfpef-np": {
    title: "Heart Failure with Preserved EF",
    cellular: {
      title: "Pathophysiology of Heart Failure with Preserved EF",
      content: "Heart Failure with Preserved Ejection Fraction (HFpEF, EF >=50%) represents ~50% of HF cases driven by diastolic dysfunction from myocardial stiffness and impaired relaxation. Microvascular endothelial inflammation reduces nitric oxide bioavailability, decreasing cGMP and PKG activity. This leads to unphosphorylated titin increasing passive myocardial stiffness. Concurrent cardiomyocyte hypertrophy and interstitial fibrosis further impair diastolic filling. The H2FPEF score helps diagnose HFpEF."
    },
    riskFactors: [
      "Age >65 years",
      "Female sex (60-65% of HFpEF patients)",
      "Hypertension (present in 60-90%)",
      "Obesity (BMI >30, drives systemic inflammation)",
      "Diabetes mellitus",
      "Atrial fibrillation",
      "Chronic kidney disease"
    ],
    diagnostics: [
      "Echocardiography: EF >=50%, diastolic dysfunction (E/e' >14, elevated LA volume)",
      "BNP >35 pg/mL or NT-proBNP >125 pg/mL",
      "H2FPEF score >=6 or HFA-PEFF algorithm",
      "Exercise stress echocardiography if resting echo non-diagnostic",
      "Right heart catheterization: PCWP >15 mmHg at rest (gold standard)",
      "ECG: LVH, atrial fibrillation",
      "BMP for renal function, glucose, electrolytes"
    ],
    management: [
      "SGLT2 inhibitor (empagliflozin or dapagliflozin) - only class with proven benefit in HFpEF",
      "Diuretics for volume management",
      "Aggressive BP control targeting <130/80 mmHg",
      "Weight management and exercise training",
      "Rate or rhythm control for atrial fibrillation",
      "Treat underlying comorbidities",
      "Spironolactone may reduce HF hospitalizations (TOPCAT)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Exertional dyspnea",
        "Exercise intolerance and fatigue",
        "Pulmonary congestion with preserved EF",
        "Elevated E/e' ratio >14"
      ],
      right: [
        "Lower extremity edema",
        "Elevated JVP",
        "Preserved systolic function on echo (EF >=50%)",
        "Diastolic dysfunction patterns on echo"
      ]
    },
    medications: [
      {
        name: "Empagliflozin (Jardiance)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule causing glycosuria, osmotic diuresis, natriuresis; reduces preload and myocardial inflammation",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "Type 1 diabetes, eGFR <20 for HF initiation",
        pearl: "EMPEROR-Preserved: 21% reduction in CV death/HF hospitalization. Start 10mg daily regardless of diabetes status."
      },
      {
        name: "Spironolactone",
        type: "MRA",
        action: "Blocks aldosterone reducing sodium retention, myocardial fibrosis, and vascular inflammation",
        sideEffects: "Hyperkalemia, gynecomastia, breast tenderness",
        contra: "K+ >5.0, eGFR <30, concurrent K+-sparing diuretics",
        pearl: "TOPCAT showed benefit in Americas cohort. Start 12.5-25mg daily. Monitor K+ at 3 days, 1 week."
      }
    ],
    pearls: [
      "SGLT2 inhibitors are the only medication class with proven benefit in HFpEF",
      "HFpEF is a clinical syndrome, not just diastolic dysfunction",
      "Even 5-10% weight loss can significantly improve symptoms"
    ],
    quiz: [
      {
        question: "A 72-year-old obese woman with HTN, DM, and exertional dyspnea has EF 58%, E/e' 16. BNP 180. Best pharmacotherapy?",
        options: [
          "Sacubitril/valsartan",
          "Carvedilol",
          "Empagliflozin 10mg daily",
          "Digoxin"
        ],
        correct: 2,
        rationale: "EMPEROR-Preserved demonstrated that empagliflozin reduces CV death and HF hospitalization in HFpEF."
      }
    ]
  },
  "valvular-disease-np": {
    title: "Valvular Disease: Stenosis & Regurgitation",
    cellular: {
      title: "Pathophysiology of Valvular Disease",
      content: "Valvular Disease: Stenosis & Regurgitation involves specific alterations in valvular disease physiology. The pathophysiology of Valvular Disease encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of valvular disease."
    },
    riskFactors: [
      "Tobacco use (pack-year dependent risk calculation)",
      "Chronic inflammatory conditions (RA, SLE, psoriasis)",
      "Prior stroke or TIA with residual neurological deficit",
      "Heavy alcohol use (>14 drinks/week males, >7 females)",
      "Coronary artery disease with prior MI or PCI",
      "Hypercoagulable states (Factor V Leiden, antiphospholipid)",
      "Sedentary lifestyle with deconditioning"
    ],
    diagnostics: [
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "Chest X-ray: cardiac silhouette, pulmonary vascularity, effusions",
      "Holter or event monitor for intermittent arrhythmia detection",
      "Coagulation studies: PT/INR, aPTT, D-dimer",
      "Troponin I or T serial measurements (0h, 3h, 6h) for myocardial injury",
      "Ambulatory blood pressure monitoring for white coat vs masked HTN",
      "Ankle-brachial index for peripheral vascular disease screening"
    ],
    management: [
      "Beta-blocker titration to resting HR 60-70 bpm",
      "CRT for EF <=35% with LBBB and QRS >=150ms",
      "Sodium restriction <2g/day for volume-sensitive conditions",
      "Anticoagulation: DOACs preferred over warfarin for non-valvular AF",
      "Blood pressure target <130/80 mmHg (ACC/AHA 2017 guidelines)",
      "Referral for surgical intervention when medical therapy insufficient",
      "Fluid restriction 1.5-2L/day for hyponatremia or severe HF"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Chest pain or pressure",
        "Dyspnea on exertion or at rest",
        "Palpitations or irregular heartbeat",
        "Syncope or near-syncope"
      ],
      right: [
        "Jugular venous distension",
        "Bilateral lower extremity edema",
        "Hepatomegaly with hepatojugular reflux",
        "Abnormal heart sounds (murmur, gallop, rub)"
      ]
    },
    medications: [
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "ARNI",
        action: "Dual inhibition: sacubitril inhibits neprilysin (increases natriuretic peptides); valsartan blocks AT1 receptors",
        sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment, dizziness",
        contra: "ACEi angioedema history, concurrent ACEi (36h washout), pregnancy",
        pearl: "PARADIGM-HF: 20% CV death reduction. Start 24/26mg BID, titrate to 97/103mg BID over 2-4 weeks."
      },
      {
        name: "Apixaban (Eliquis)",
        type: "Direct Factor Xa Inhibitor",
        action: "Selectively and reversibly inhibits Factor Xa preventing thrombin generation and clot formation",
        sideEffects: "Bleeding (major GI, intracranial); reversal agent: andexanet alfa",
        contra: "Active pathological bleeding, prosthetic mechanical heart valve, severe hepatic impairment",
        pearl: "Standard: 5mg BID. Reduce to 2.5mg BID if >=2 of: age >=80, weight <=60kg, Cr >=1.5 mg/dL."
      }
    ],
    pearls: [
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status",
      "Avoid NSAIDs in heart failure (fluid retention) and post-ACS (increased CV events)",
      "Troponin elevation without ACS: consider PE, myocarditis, Takotsubo, renal failure, sepsis"
    ],
    quiz: [
      {
        question: "A 65-year-old with valvular disease presents with dyspnea, JVD, and bilateral crackles. BNP 850 pg/mL. Which initial intervention is most appropriate?",
        options: [
          "IV furosemide 40mg and continuous monitoring",
          "Immediate cardiac catheterization",
          "Start amiodarone drip",
          "Discharge with PCP follow-up in 2 weeks"
        ],
        correct: 0,
        rationale: "IV furosemide addresses acute volume overload in valvular disease with continuous monitoring for response."
      }
    ]
  },
  "pvd-advanced-np": {
    title: "Peripheral Vascular Disease: Advanced Mgmt",
    cellular: {
      title: "Pathophysiology of Peripheral Vascular Disease",
      content: "Peripheral Vascular Disease: Advanced Mgmt involves specific alterations in peripheral vascular disease physiology. The pathophysiology of Peripheral Vascular Disease encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of peripheral vascular disease."
    },
    riskFactors: [
      "Family history of premature CVD (<55 males, <65 females)",
      "Hypercoagulable states (Factor V Leiden, antiphospholipid)",
      "Peripheral artery disease (ABI <0.9)",
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Age >65 with cardiovascular degeneration",
      "Sedentary lifestyle with deconditioning",
      "History of preeclampsia or gestational hypertension"
    ],
    diagnostics: [
      "Lipid panel: total cholesterol, LDL, HDL, triglycerides",
      "Ambulatory blood pressure monitoring for white coat vs masked HTN",
      "TEE for valvular vegetation, intracardiac thrombus, PFO assessment",
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions",
      "Ankle-brachial index for peripheral vascular disease screening",
      "HbA1c for glycemic control assessment in diabetic patients"
    ],
    management: [
      "ACEi/ARB for patients with HFrEF, post-MI, or diabetic nephropathy",
      "Referral for surgical intervention when medical therapy insufficient",
      "Rate vs rhythm control strategy for atrial fibrillation management",
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)",
      "Fluid restriction 1.5-2L/day for hyponatremia or severe HF",
      "Weight monitoring: report gain >2 lbs/day or >5 lbs/week"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Chest pain or pressure",
        "Dyspnea on exertion or at rest",
        "Palpitations or irregular heartbeat",
        "Syncope or near-syncope"
      ],
      right: [
        "Jugular venous distension",
        "Bilateral lower extremity edema",
        "Hepatomegaly with hepatojugular reflux",
        "Abnormal heart sounds (murmur, gallop, rub)"
      ]
    },
    medications: [
      {
        name: "Apixaban (Eliquis)",
        type: "Direct Factor Xa Inhibitor",
        action: "Selectively and reversibly inhibits Factor Xa preventing thrombin generation and clot formation",
        sideEffects: "Bleeding (major GI, intracranial); reversal agent: andexanet alfa",
        contra: "Active pathological bleeding, prosthetic mechanical heart valve, severe hepatic impairment",
        pearl: "Standard: 5mg BID. Reduce to 2.5mg BID if >=2 of: age >=80, weight <=60kg, Cr >=1.5 mg/dL."
      },
      {
        name: "Carvedilol (Coreg)",
        type: "Non-selective Beta + Alpha-1 Blocker",
        action: "Blocks beta-1, beta-2, and alpha-1 adrenergic receptors; antioxidant properties",
        sideEffects: "Bradycardia, hypotension, dizziness, weight gain, bronchospasm, fatigue",
        contra: "Decompensated HF, SBP <90, HR <55, 2nd/3rd degree AV block, severe asthma/COPD",
        pearl: "HF dose: start 3.125mg BID, target 25mg BID. COPERNICUS: 35% mortality reduction. Take with food."
      }
    ],
    pearls: [
      "Avoid NSAIDs in heart failure (fluid retention) and post-ACS (increased CV events)",
      "Right-sided MI: volume-dependent; avoid nitrates and diuretics, give IV fluids",
      "New LBBB + chest pain: treat as STEMI equivalent until proven otherwise"
    ],
    quiz: [
      {
        question: "A patient with history of peripheral vascular disease has HR 52, BP 88/54 on metoprolol 100mg BID. Best next step?",
        options: [
          "Increase metoprolol dose",
          "Hold metoprolol and reassess hemodynamics",
          "Add digoxin",
          "Start dobutamine drip"
        ],
        correct: 1,
        rationale: "Symptomatic bradycardia and hypotension suggest beta-blocker excess. Hold the medication and reassess before adjusting."
      }
    ]
  },
  "vte-prophylaxis-np": {
    title: "Venous Thromboembolism Prophylaxis",
    cellular: {
      title: "Pathophysiology of Venous Thromboembolism Prophylaxis",
      content: "Venous Thromboembolism Prophylaxis involves specific alterations in venous thromboembolism prophylaxis physiology. The pathophysiology of Venous Thromboembolism Prophylaxis encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of venous thromboembolism prophylaxis."
    },
    riskFactors: [
      "Hypercoagulable states (Factor V Leiden, antiphospholipid)",
      "Family history of premature CVD (<55 males, <65 females)",
      "Age >65 with cardiovascular degeneration",
      "Dyslipidemia (LDL >130 despite lifestyle modification)",
      "Peripheral artery disease (ABI <0.9)",
      "Obesity (BMI >30) with metabolic syndrome",
      "Chronic kidney disease (eGFR <60 mL/min)"
    ],
    diagnostics: [
      "Ambulatory blood pressure monitoring for white coat vs masked HTN",
      "Lipid panel: total cholesterol, LDL, HDL, triglycerides",
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions",
      "CBC with differential (anemia worsens cardiac ischemia)",
      "TEE for valvular vegetation, intracardiac thrombus, PFO assessment",
      "CT angiography of chest for aortic or pulmonary vascular pathology",
      "Cardiac MRI for tissue characterization (edema, fibrosis, infiltration)"
    ],
    management: [
      "Referral for surgical intervention when medical therapy insufficient",
      "ACEi/ARB for patients with HFrEF, post-MI, or diabetic nephropathy",
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)",
      "Dual antiplatelet therapy (DAPT) post-ACS or PCI for 6-12 months",
      "Rate vs rhythm control strategy for atrial fibrillation management",
      "SGLT2 inhibitor for HF regardless of diabetes status",
      "Loop diuretics titrated to euvolemia based on daily weights"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Substernal chest tightness radiating to arm/jaw",
        "Progressive exercise intolerance",
        "Orthopnea requiring elevated sleeping position",
        "Diaphoresis with exertional symptoms"
      ],
      right: [
        "Peripheral cyanosis or pallor",
        "Blood pressure asymmetry",
        "Altered peripheral pulses",
        "New cardiac murmur or changed murmur character"
      ]
    },
    medications: [
      {
        name: "Apixaban (Eliquis)",
        type: "Direct Factor Xa Inhibitor",
        action: "Selectively and reversibly inhibits Factor Xa preventing thrombin generation and clot formation",
        sideEffects: "Bleeding (major GI, intracranial); reversal agent: andexanet alfa",
        contra: "Active pathological bleeding, prosthetic mechanical heart valve, severe hepatic impairment",
        pearl: "Standard: 5mg BID. Reduce to 2.5mg BID if >=2 of: age >=80, weight <=60kg, Cr >=1.5 mg/dL."
      },
      {
        name: "Carvedilol (Coreg)",
        type: "Non-selective Beta + Alpha-1 Blocker",
        action: "Blocks beta-1, beta-2, and alpha-1 adrenergic receptors; antioxidant properties",
        sideEffects: "Bradycardia, hypotension, dizziness, weight gain, bronchospasm, fatigue",
        contra: "Decompensated HF, SBP <90, HR <55, 2nd/3rd degree AV block, severe asthma/COPD",
        pearl: "HF dose: start 3.125mg BID, target 25mg BID. COPERNICUS: 35% mortality reduction. Take with food."
      }
    ],
    pearls: [
      "Avoid NSAIDs in heart failure (fluid retention) and post-ACS (increased CV events)",
      "Right-sided MI: volume-dependent; avoid nitrates and diuretics, give IV fluids",
      "New LBBB + chest pain: treat as STEMI equivalent until proven otherwise"
    ],
    quiz: [
      {
        question: "A patient with history of venous thromboembolism prophylaxis has HR 52, BP 88/54 on metoprolol 100mg BID. Best next step?",
        options: [
          "Increase metoprolol dose",
          "Hold metoprolol and reassess hemodynamics",
          "Add digoxin",
          "Start dobutamine drip"
        ],
        correct: 1,
        rationale: "Symptomatic bradycardia and hypotension suggest beta-blocker excess. Hold the medication and reassess before adjusting."
      }
    ]
  },
  "brugada-syndrome-np": {
    title: "Brugada Syndrome: ECG Patterns",
    cellular: {
      title: "Pathophysiology of Brugada Syndrome",
      content: "Brugada Syndrome: ECG Patterns involves specific alterations in brugada syndrome physiology. The pathophysiology of Brugada Syndrome encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of brugada syndrome."
    },
    riskFactors: [
      "Left ventricular hypertrophy on ECG or echo",
      "Obstructive sleep apnea (AHI >15 events/hr)",
      "Tobacco use (pack-year dependent risk calculation)",
      "Obesity (BMI >30) with metabolic syndrome",
      "Chronic inflammatory conditions (RA, SLE, psoriasis)",
      "Atrial fibrillation or flutter with rapid ventricular rate",
      "Prior stroke or TIA with residual neurological deficit"
    ],
    diagnostics: [
      "CRP and ESR for inflammatory/infectious cardiac conditions",
      "Cardiac catheterization: coronary anatomy, hemodynamic measurements",
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "CT angiography of chest for aortic or pulmonary vascular pathology",
      "Chest X-ray: cardiac silhouette, pulmonary vascularity, effusions",
      "Stress testing (exercise or pharmacologic) with nuclear or echo imaging",
      "Holter or event monitor for intermittent arrhythmia detection"
    ],
    management: [
      "Structured exercise program: 150 min/week moderate-intensity aerobic",
      "Cardiac rehabilitation referral (Phase I-III) for functional recovery",
      "Beta-blocker titration to resting HR 60-70 bpm",
      "SGLT2 inhibitor for HF regardless of diabetes status",
      "CRT for EF <=35% with LBBB and QRS >=150ms",
      "Smoking cessation: varenicline or NRT plus behavioral counseling",
      "Sodium restriction <2g/day for volume-sensitive conditions"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Chest pain or pressure",
        "Dyspnea on exertion or at rest",
        "Palpitations or irregular heartbeat",
        "Syncope or near-syncope"
      ],
      right: [
        "Jugular venous distension",
        "Bilateral lower extremity edema",
        "Hepatomegaly with hepatojugular reflux",
        "Abnormal heart sounds (murmur, gallop, rub)"
      ]
    },
    medications: [
      {
        name: "Nitroglycerin (NTG)",
        type: "Organic Nitrate",
        action: "Releases NO causing venodilation (reduces preload) and coronary vasodilation",
        sideEffects: "Headache, hypotension, reflex tachycardia, tolerance with continuous use",
        contra: "SBP <90, RV infarction, concurrent PDE5 inhibitor (sildenafil within 24h, tadalafil within 48h)",
        pearl: "SL: 0.4mg q5min x3 for angina. IV: start 5mcg/min, titrate by 5mcg q3-5min. Nitrate-free interval 10-14h."
      },
      {
        name: "Metoprolol Succinate (Toprol-XL)",
        type: "Beta-1 Selective Blocker",
        action: "Selectively blocks cardiac beta-1 receptors reducing heart rate, contractility, and myocardial oxygen demand",
        sideEffects: "Bradycardia, hypotension, fatigue, depression, bronchospasm",
        contra: "Severe bradycardia <50 bpm, decompensated HF, cardiogenic shock, 2nd/3rd degree AV block",
        pearl: "Start 25mg daily, titrate every 2 weeks. Target 200mg daily. Do NOT discontinue abruptly."
      }
    ],
    pearls: [
      "BNP can be falsely low in obesity; use NT-proBNP cutoffs adjusted for age and BMI",
      "ACC/AHA guidelines recommend ASCVD risk calculator for primary prevention decisions",
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status"
    ],
    quiz: [
      {
        question: "A patient with brugada syndrome on lisinopril develops dry cough. K+ 4.8, Cr 1.1. Best alternative?",
        options: [
          "Losartan 50mg daily",
          "Double lisinopril dose",
          "Add hydrochlorothiazide",
          "Switch to spironolactone"
        ],
        correct: 0,
        rationale: "ARBs (losartan) are first-line alternatives for ACEi-induced cough. They block AT1 receptors without increasing bradykinin."
      }
    ]
  },
  "long-qt-syndrome-np": {
    title: "Long QT Syndrome: Genetics",
    cellular: {
      title: "Pathophysiology of Long QT Syndrome",
      content: "Long QT Syndrome: Genetics involves specific alterations in long qt syndrome physiology. The pathophysiology of Long QT Syndrome encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of long qt syndrome."
    },
    riskFactors: [
      "Family history of premature CVD (<55 males, <65 females)",
      "Hypercoagulable states (Factor V Leiden, antiphospholipid)",
      "Peripheral artery disease (ABI <0.9)",
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Age >65 with cardiovascular degeneration",
      "Sedentary lifestyle with deconditioning",
      "History of preeclampsia or gestational hypertension"
    ],
    diagnostics: [
      "Lipid panel: total cholesterol, LDL, HDL, triglycerides",
      "Ambulatory blood pressure monitoring for white coat vs masked HTN",
      "TEE for valvular vegetation, intracardiac thrombus, PFO assessment",
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions",
      "Ankle-brachial index for peripheral vascular disease screening",
      "HbA1c for glycemic control assessment in diabetic patients"
    ],
    management: [
      "ACEi/ARB for patients with HFrEF, post-MI, or diabetic nephropathy",
      "Referral for surgical intervention when medical therapy insufficient",
      "Rate vs rhythm control strategy for atrial fibrillation management",
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)",
      "Fluid restriction 1.5-2L/day for hyponatremia or severe HF",
      "Weight monitoring: report gain >2 lbs/day or >5 lbs/week"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Substernal chest tightness radiating to arm/jaw",
        "Progressive exercise intolerance",
        "Orthopnea requiring elevated sleeping position",
        "Diaphoresis with exertional symptoms"
      ],
      right: [
        "Peripheral cyanosis or pallor",
        "Blood pressure asymmetry",
        "Altered peripheral pulses",
        "New cardiac murmur or changed murmur character"
      ]
    },
    medications: [
      {
        name: "Apixaban (Eliquis)",
        type: "Direct Factor Xa Inhibitor",
        action: "Selectively and reversibly inhibits Factor Xa preventing thrombin generation and clot formation",
        sideEffects: "Bleeding (major GI, intracranial); reversal agent: andexanet alfa",
        contra: "Active pathological bleeding, prosthetic mechanical heart valve, severe hepatic impairment",
        pearl: "Standard: 5mg BID. Reduce to 2.5mg BID if >=2 of: age >=80, weight <=60kg, Cr >=1.5 mg/dL."
      },
      {
        name: "Carvedilol (Coreg)",
        type: "Non-selective Beta + Alpha-1 Blocker",
        action: "Blocks beta-1, beta-2, and alpha-1 adrenergic receptors; antioxidant properties",
        sideEffects: "Bradycardia, hypotension, dizziness, weight gain, bronchospasm, fatigue",
        contra: "Decompensated HF, SBP <90, HR <55, 2nd/3rd degree AV block, severe asthma/COPD",
        pearl: "HF dose: start 3.125mg BID, target 25mg BID. COPERNICUS: 35% mortality reduction. Take with food."
      }
    ],
    pearls: [
      "Avoid NSAIDs in heart failure (fluid retention) and post-ACS (increased CV events)",
      "Right-sided MI: volume-dependent; avoid nitrates and diuretics, give IV fluids",
      "New LBBB + chest pain: treat as STEMI equivalent until proven otherwise"
    ],
    quiz: [
      {
        question: "A patient with history of long qt syndrome has HR 52, BP 88/54 on metoprolol 100mg BID. Best next step?",
        options: [
          "Increase metoprolol dose",
          "Hold metoprolol and reassess hemodynamics",
          "Add digoxin",
          "Start dobutamine drip"
        ],
        correct: 1,
        rationale: "Symptomatic bradycardia and hypotension suggest beta-blocker excess. Hold the medication and reassess before adjusting."
      }
    ]
  },
  "takotsubo-cardiomyopathy-np": {
    title: "Takotsubo Cardiomyopathy: Stress-Induced",
    cellular: {
      title: "Pathophysiology of Takotsubo Cardiomyopathy",
      content: "Takotsubo Cardiomyopathy: Stress-Induced involves specific alterations in takotsubo cardiomyopathy physiology. The pathophysiology of Takotsubo Cardiomyopathy encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of takotsubo cardiomyopathy."
    },
    riskFactors: [
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Dyslipidemia (LDL >130 despite lifestyle modification)",
      "Chronic hypertension with end-organ damage",
      "Age >65 with cardiovascular degeneration",
      "Atrial fibrillation or flutter with rapid ventricular rate",
      "Tobacco use (pack-year dependent risk calculation)",
      "Family history of premature CVD (<55 males, <65 females)"
    ],
    diagnostics: [
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "CBC with differential (anemia worsens cardiac ischemia)",
      "12-lead ECG: assess rhythm, intervals, ST-T changes, axis deviation",
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions",
      "Stress testing (exercise or pharmacologic) with nuclear or echo imaging",
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "Lipid panel: total cholesterol, LDL, HDL, triglycerides"
    ],
    management: [
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "Dual antiplatelet therapy (DAPT) post-ACS or PCI for 6-12 months",
      "Guideline-directed medical therapy per ACC/AHA recommendations",
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)",
      "Smoking cessation: varenicline or NRT plus behavioral counseling",
      "Beta-blocker titration to resting HR 60-70 bpm",
      "ACEi/ARB for patients with HFrEF, post-MI, or diabetic nephropathy"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Acute onset severe chest pain",
        "Dyspnea with hemoptysis",
        "Pre-syncope with positional changes",
        "Fatigue disproportionate to activity level"
      ],
      right: [
        "Tachycardia with narrow or wide complex",
        "New S3 or S4 heart sounds",
        "Bilateral crackles on auscultation",
        "Elevated JVP with Kussmaul sign"
      ]
    },
    medications: [
      {
        name: "Furosemide (Lasix)",
        type: "Loop Diuretic",
        action: "Inhibits Na-K-2Cl cotransporter in thick ascending limb of Henle reducing sodium and water reabsorption",
        sideEffects: "Hypokalemia, hyponatremia, ototoxicity, hyperuricemia, dehydration",
        contra: "Anuria, hepatic coma, severe electrolyte depletion",
        pearl: "IV:PO ratio 1:2 (40mg IV = 80mg PO). Ceiling dose 160-200mg IV. Monitor K+ and Mg2+."
      },
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "ARNI",
        action: "Dual inhibition: sacubitril inhibits neprilysin (increases natriuretic peptides); valsartan blocks AT1 receptors",
        sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment, dizziness",
        contra: "ACEi angioedema history, concurrent ACEi (36h washout), pregnancy",
        pearl: "PARADIGM-HF: 20% CV death reduction. Start 24/26mg BID, titrate to 97/103mg BID over 2-4 weeks."
      }
    ],
    pearls: [
      "DOACs preferred over warfarin for non-valvular AF; warfarin still required for mechanical valves",
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status",
      "ACC/AHA guidelines recommend ASCVD risk calculator for primary prevention decisions"
    ],
    quiz: [
      {
        question: "A patient with takotsubo cardiomyopathy on lisinopril develops dry cough. K+ 4.8, Cr 1.1. Best alternative?",
        options: [
          "Losartan 50mg daily",
          "Double lisinopril dose",
          "Add hydrochlorothiazide",
          "Switch to spironolactone"
        ],
        correct: 0,
        rationale: "ARBs (losartan) are first-line alternatives for ACEi-induced cough. They block AT1 receptors without increasing bradykinin."
      }
    ]
  },
  "infective-endocarditis-advanced-np": {
    title: "Infective Endocarditis: Duke Criteria",
    cellular: {
      title: "Pathophysiology of Infective Endocarditis",
      content: "Infective Endocarditis: Duke Criteria involves specific alterations in infective endocarditis physiology. The pathophysiology of Infective Endocarditis encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of infective endocarditis."
    },
    riskFactors: [
      "Peripheral artery disease (ABI <0.9)",
      "Age >65 with cardiovascular degeneration",
      "History of preeclampsia or gestational hypertension",
      "Chronic hypertension with end-organ damage",
      "Chronic kidney disease (eGFR <60 mL/min)",
      "Diabetes mellitus type 2 with HbA1c >7%",
      "Dyslipidemia (LDL >130 despite lifestyle modification)"
    ],
    diagnostics: [
      "TEE for valvular vegetation, intracardiac thrombus, PFO assessment",
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions",
      "HbA1c for glycemic control assessment in diabetic patients",
      "12-lead ECG: assess rhythm, intervals, ST-T changes, axis deviation",
      "Cardiac MRI for tissue characterization (edema, fibrosis, infiltration)",
      "BNP >100 pg/mL or NT-proBNP >300 pg/mL for volume overload assessment",
      "CBC with differential (anemia worsens cardiac ischemia)"
    ],
    management: [
      "Rate vs rhythm control strategy for atrial fibrillation management",
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)",
      "Weight monitoring: report gain >2 lbs/day or >5 lbs/week",
      "Guideline-directed medical therapy per ACC/AHA recommendations",
      "Loop diuretics titrated to euvolemia based on daily weights",
      "Antiplatelet therapy: aspirin 81mg daily for established ASCVD",
      "Dual antiplatelet therapy (DAPT) post-ACS or PCI for 6-12 months"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Acute onset severe chest pain",
        "Dyspnea with hemoptysis",
        "Pre-syncope with positional changes",
        "Fatigue disproportionate to activity level"
      ],
      right: [
        "Tachycardia with narrow or wide complex",
        "New S3 or S4 heart sounds",
        "Bilateral crackles on auscultation",
        "Elevated JVP with Kussmaul sign"
      ]
    },
    medications: [
      {
        name: "Atorvastatin (Lipitor)",
        type: "HMG-CoA Reductase Inhibitor",
        action: "Inhibits cholesterol synthesis, upregulates LDL receptors; pleiotropic anti-inflammatory and plaque-stabilizing effects",
        sideEffects: "Myalgia, elevated transaminases, new-onset diabetes",
        contra: "Active liver disease, pregnancy, unexplained persistent LFT elevation",
        pearl: "High-intensity: 40-80mg daily. Reduces LDL by 50%. Check CK only if symptomatic myopathy."
      },
      {
        name: "Amlodipine (Norvasc)",
        type: "Dihydropyridine CCB",
        action: "Blocks L-type calcium channels in vascular smooth muscle causing vasodilation",
        sideEffects: "Peripheral edema (dose-dependent), flushing, headache, gingival hyperplasia",
        contra: "Severe aortic stenosis, cardiogenic shock, unstable angina (use with caution)",
        pearl: "Start 5mg daily, max 10mg. Safe in HFpEF. Edema is dose-related, not allergic."
      }
    ],
    pearls: [
      "New LBBB + chest pain: treat as STEMI equivalent until proven otherwise",
      "Beta-blockers reduce mortality in HFrEF but NOT in HFpEF",
      "Target LDL <70 mg/dL for established ASCVD (consider <55 for very high risk)"
    ],
    quiz: [
      {
        question: "A 58-year-old with infective endocarditis has LDL 145, diabetes, and HTN. Best lipid management?",
        options: [
          "Lifestyle modification only for 6 months",
          "Moderate-intensity statin",
          "High-intensity statin (atorvastatin 40-80mg)",
          "Ezetimibe monotherapy"
        ],
        correct: 2,
        rationale: "With multiple ASCVD risk factors and infective endocarditis, high-intensity statin therapy is indicated per ACC/AHA guidelines."
      }
    ]
  },
  "marfan-cardiac-np": {
    title: "Marfan Syndrome Cardiac: Aortic Root",
    cellular: {
      title: "Pathophysiology of Marfan Syndrome Cardiac",
      content: "Marfan Syndrome Cardiac: Aortic Root involves specific alterations in marfan syndrome cardiac physiology. The pathophysiology of Marfan Syndrome Cardiac encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of marfan syndrome cardiac."
    },
    riskFactors: [
      "Obstructive sleep apnea (AHI >15 events/hr)",
      "Left ventricular hypertrophy on ECG or echo",
      "Chronic inflammatory conditions (RA, SLE, psoriasis)",
      "Sedentary lifestyle with deconditioning",
      "Tobacco use (pack-year dependent risk calculation)",
      "Chronic hypertension with end-organ damage",
      "Coronary artery disease with prior MI or PCI"
    ],
    diagnostics: [
      "Cardiac catheterization: coronary anatomy, hemodynamic measurements",
      "CRP and ESR for inflammatory/infectious cardiac conditions",
      "Chest X-ray: cardiac silhouette, pulmonary vascularity, effusions",
      "Ankle-brachial index for peripheral vascular disease screening",
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "12-lead ECG: assess rhythm, intervals, ST-T changes, axis deviation",
      "Troponin I or T serial measurements (0h, 3h, 6h) for myocardial injury"
    ],
    management: [
      "Cardiac rehabilitation referral (Phase I-III) for functional recovery",
      "Structured exercise program: 150 min/week moderate-intensity aerobic",
      "CRT for EF <=35% with LBBB and QRS >=150ms",
      "Fluid restriction 1.5-2L/day for hyponatremia or severe HF",
      "Beta-blocker titration to resting HR 60-70 bpm",
      "Guideline-directed medical therapy per ACC/AHA recommendations",
      "Blood pressure target <130/80 mmHg (ACC/AHA 2017 guidelines)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Substernal chest tightness radiating to arm/jaw",
        "Progressive exercise intolerance",
        "Orthopnea requiring elevated sleeping position",
        "Diaphoresis with exertional symptoms"
      ],
      right: [
        "Peripheral cyanosis or pallor",
        "Blood pressure asymmetry",
        "Altered peripheral pulses",
        "New cardiac murmur or changed murmur character"
      ]
    },
    medications: [
      {
        name: "Nitroglycerin (NTG)",
        type: "Organic Nitrate",
        action: "Releases NO causing venodilation (reduces preload) and coronary vasodilation",
        sideEffects: "Headache, hypotension, reflex tachycardia, tolerance with continuous use",
        contra: "SBP <90, RV infarction, concurrent PDE5 inhibitor (sildenafil within 24h, tadalafil within 48h)",
        pearl: "SL: 0.4mg q5min x3 for angina. IV: start 5mcg/min, titrate by 5mcg q3-5min. Nitrate-free interval 10-14h."
      },
      {
        name: "Metoprolol Succinate (Toprol-XL)",
        type: "Beta-1 Selective Blocker",
        action: "Selectively blocks cardiac beta-1 receptors reducing heart rate, contractility, and myocardial oxygen demand",
        sideEffects: "Bradycardia, hypotension, fatigue, depression, bronchospasm",
        contra: "Severe bradycardia <50 bpm, decompensated HF, cardiogenic shock, 2nd/3rd degree AV block",
        pearl: "Start 25mg daily, titrate every 2 weeks. Target 200mg daily. Do NOT discontinue abruptly."
      }
    ],
    pearls: [
      "BNP can be falsely low in obesity; use NT-proBNP cutoffs adjusted for age and BMI",
      "ACC/AHA guidelines recommend ASCVD risk calculator for primary prevention decisions",
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status"
    ],
    quiz: [
      {
        question: "A patient with marfan syndrome cardiac on lisinopril develops dry cough. K+ 4.8, Cr 1.1. Best alternative?",
        options: [
          "Losartan 50mg daily",
          "Double lisinopril dose",
          "Add hydrochlorothiazide",
          "Switch to spironolactone"
        ],
        correct: 0,
        rationale: "ARBs (losartan) are first-line alternatives for ACEi-induced cough. They block AT1 receptors without increasing bradykinin."
      }
    ]
  },
  "constrictive-pericarditis-np": {
    title: "Constrictive Pericarditis: Differentiation",
    cellular: {
      title: "Pathophysiology of Constrictive Pericarditis",
      content: "Constrictive Pericarditis: Differentiation involves specific alterations in constrictive pericarditis physiology. The pathophysiology of Constrictive Pericarditis encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of constrictive pericarditis."
    },
    riskFactors: [
      "Tobacco use (pack-year dependent risk calculation)",
      "Chronic inflammatory conditions (RA, SLE, psoriasis)",
      "Prior stroke or TIA with residual neurological deficit",
      "Heavy alcohol use (>14 drinks/week males, >7 females)",
      "Coronary artery disease with prior MI or PCI",
      "Hypercoagulable states (Factor V Leiden, antiphospholipid)",
      "Sedentary lifestyle with deconditioning"
    ],
    diagnostics: [
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "Chest X-ray: cardiac silhouette, pulmonary vascularity, effusions",
      "Holter or event monitor for intermittent arrhythmia detection",
      "Coagulation studies: PT/INR, aPTT, D-dimer",
      "Troponin I or T serial measurements (0h, 3h, 6h) for myocardial injury",
      "Ambulatory blood pressure monitoring for white coat vs masked HTN",
      "Ankle-brachial index for peripheral vascular disease screening"
    ],
    management: [
      "Beta-blocker titration to resting HR 60-70 bpm",
      "CRT for EF <=35% with LBBB and QRS >=150ms",
      "Sodium restriction <2g/day for volume-sensitive conditions",
      "Anticoagulation: DOACs preferred over warfarin for non-valvular AF",
      "Blood pressure target <130/80 mmHg (ACC/AHA 2017 guidelines)",
      "Referral for surgical intervention when medical therapy insufficient",
      "Fluid restriction 1.5-2L/day for hyponatremia or severe HF"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Substernal chest tightness radiating to arm/jaw",
        "Progressive exercise intolerance",
        "Orthopnea requiring elevated sleeping position",
        "Diaphoresis with exertional symptoms"
      ],
      right: [
        "Peripheral cyanosis or pallor",
        "Blood pressure asymmetry",
        "Altered peripheral pulses",
        "New cardiac murmur or changed murmur character"
      ]
    },
    medications: [
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "ARNI",
        action: "Dual inhibition: sacubitril inhibits neprilysin (increases natriuretic peptides); valsartan blocks AT1 receptors",
        sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment, dizziness",
        contra: "ACEi angioedema history, concurrent ACEi (36h washout), pregnancy",
        pearl: "PARADIGM-HF: 20% CV death reduction. Start 24/26mg BID, titrate to 97/103mg BID over 2-4 weeks."
      },
      {
        name: "Apixaban (Eliquis)",
        type: "Direct Factor Xa Inhibitor",
        action: "Selectively and reversibly inhibits Factor Xa preventing thrombin generation and clot formation",
        sideEffects: "Bleeding (major GI, intracranial); reversal agent: andexanet alfa",
        contra: "Active pathological bleeding, prosthetic mechanical heart valve, severe hepatic impairment",
        pearl: "Standard: 5mg BID. Reduce to 2.5mg BID if >=2 of: age >=80, weight <=60kg, Cr >=1.5 mg/dL."
      }
    ],
    pearls: [
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status",
      "Avoid NSAIDs in heart failure (fluid retention) and post-ACS (increased CV events)",
      "Troponin elevation without ACS: consider PE, myocarditis, Takotsubo, renal failure, sepsis"
    ],
    quiz: [
      {
        question: "A 65-year-old with constrictive pericarditis presents with dyspnea, JVD, and bilateral crackles. BNP 850 pg/mL. Which initial intervention is most appropriate?",
        options: [
          "IV furosemide 40mg and continuous monitoring",
          "Immediate cardiac catheterization",
          "Start amiodarone drip",
          "Discharge with PCP follow-up in 2 weeks"
        ],
        correct: 0,
        rationale: "IV furosemide addresses acute volume overload in constrictive pericarditis with continuous monitoring for response."
      }
    ]
  },
  "cardiac-tamponade-mgmt-np": {
    title: "Cardiac Tamponade: Pericardiocentesis",
    cellular: {
      title: "Pathophysiology of Cardiac Tamponade",
      content: "Cardiac Tamponade: Pericardiocentesis involves specific alterations in cardiac tamponade physiology. The pathophysiology of Cardiac Tamponade encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of cardiac tamponade."
    },
    riskFactors: [
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Dyslipidemia (LDL >130 despite lifestyle modification)",
      "Chronic hypertension with end-organ damage",
      "Age >65 with cardiovascular degeneration",
      "Atrial fibrillation or flutter with rapid ventricular rate",
      "Tobacco use (pack-year dependent risk calculation)",
      "Family history of premature CVD (<55 males, <65 females)"
    ],
    diagnostics: [
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "CBC with differential (anemia worsens cardiac ischemia)",
      "12-lead ECG: assess rhythm, intervals, ST-T changes, axis deviation",
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions",
      "Stress testing (exercise or pharmacologic) with nuclear or echo imaging",
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "Lipid panel: total cholesterol, LDL, HDL, triglycerides"
    ],
    management: [
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "Dual antiplatelet therapy (DAPT) post-ACS or PCI for 6-12 months",
      "Guideline-directed medical therapy per ACC/AHA recommendations",
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)",
      "Smoking cessation: varenicline or NRT plus behavioral counseling",
      "Beta-blocker titration to resting HR 60-70 bpm",
      "ACEi/ARB for patients with HFrEF, post-MI, or diabetic nephropathy"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Chest pain or pressure",
        "Dyspnea on exertion or at rest",
        "Palpitations or irregular heartbeat",
        "Syncope or near-syncope"
      ],
      right: [
        "Jugular venous distension",
        "Bilateral lower extremity edema",
        "Hepatomegaly with hepatojugular reflux",
        "Abnormal heart sounds (murmur, gallop, rub)"
      ]
    },
    medications: [
      {
        name: "Furosemide (Lasix)",
        type: "Loop Diuretic",
        action: "Inhibits Na-K-2Cl cotransporter in thick ascending limb of Henle reducing sodium and water reabsorption",
        sideEffects: "Hypokalemia, hyponatremia, ototoxicity, hyperuricemia, dehydration",
        contra: "Anuria, hepatic coma, severe electrolyte depletion",
        pearl: "IV:PO ratio 1:2 (40mg IV = 80mg PO). Ceiling dose 160-200mg IV. Monitor K+ and Mg2+."
      },
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "ARNI",
        action: "Dual inhibition: sacubitril inhibits neprilysin (increases natriuretic peptides); valsartan blocks AT1 receptors",
        sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment, dizziness",
        contra: "ACEi angioedema history, concurrent ACEi (36h washout), pregnancy",
        pearl: "PARADIGM-HF: 20% CV death reduction. Start 24/26mg BID, titrate to 97/103mg BID over 2-4 weeks."
      }
    ],
    pearls: [
      "DOACs preferred over warfarin for non-valvular AF; warfarin still required for mechanical valves",
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status",
      "ACC/AHA guidelines recommend ASCVD risk calculator for primary prevention decisions"
    ],
    quiz: [
      {
        question: "A patient with cardiac tamponade on lisinopril develops dry cough. K+ 4.8, Cr 1.1. Best alternative?",
        options: [
          "Losartan 50mg daily",
          "Double lisinopril dose",
          "Add hydrochlorothiazide",
          "Switch to spironolactone"
        ],
        correct: 0,
        rationale: "ARBs (losartan) are first-line alternatives for ACEi-induced cough. They block AT1 receptors without increasing bradykinin."
      }
    ]
  },
  "heart-failure-np": {
    title: "Heart Failure",
    cellular: {
      title: "Pathophysiology of Heart Failure",
      content: "Heart Failure centers on progressive myocardial dysfunction. In systolic HF (HFrEF, EF <=40%), cardiomyocyte loss from ischemia, toxins, or genetic causes reduces contractile force. Compensatory neurohormonal activation (RAAS, sympathetic nervous system, natriuretic peptides) initially maintains cardiac output but chronically causes adverse remodeling: ventricular dilation, interstitial fibrosis, and further myocyte apoptosis. Elevated angiotensin II promotes vasoconstriction, aldosterone-mediated sodium/water retention, and myocardial fibrosis. Sustained sympathetic activation causes beta-receptor downregulation and direct myocyte toxicity. B-type natriuretic peptide (BNP) is released from stretched ventricular myocytes."
    },
    riskFactors: [
      "Coronary artery disease (most common cause, ~60-70% of HF cases)",
      "Hypertension with chronic pressure overload causing concentric hypertrophy",
      "Diabetes mellitus with direct myocardial metabolic injury",
      "Valvular heart disease (aortic stenosis, mitral regurgitation)",
      "Cardiotoxic agents: alcohol, doxorubicin, trastuzumab, cocaine",
      "Familial dilated cardiomyopathy (genetic variants in TTN, LMNA, MYH7)",
      "Obesity (BMI >30) with increased plasma volume and cardiac workload"
    ],
    diagnostics: [
      "BNP >100 pg/mL or NT-proBNP >300 pg/mL supports diagnosis (age-adjusted cutoffs)",
      "Transthoracic echocardiography for EF, chamber dimensions, wall motion, valvular function",
      "12-lead ECG for Q waves, LBBB, arrhythmia, LVH (present in ~90% of HF)",
      "Chest X-ray: cardiomegaly (CTR >0.5), cephalization, Kerley B lines, pleural effusions",
      "BMP including sodium (dilutional hyponatremia = poor prognosis), potassium, creatinine",
      "Iron studies (iron deficiency present in ~50% of HF patients)",
      "Coronary angiography or stress testing to evaluate ischemic etiology"
    ],
    management: [
      "GDMT quadruple therapy: ACEi/ARB/ARNI + beta-blocker + MRA + SGLT2i for HFrEF",
      "Start sacubitril/valsartan (ARNI) after tolerating ACEi; do NOT use within 36h of ACEi",
      "Titrate carvedilol or metoprolol succinate to target doses (not heart rate-guided)",
      "Add spironolactone 25-50mg if EF <=35% and eGFR >30 (monitor K+ within 1 week)",
      "Dapagliflozin or empagliflozin 10mg daily regardless of diabetes status",
      "Loop diuretics (furosemide, bumetanide) for volume management - titrate to euvolemia",
      "IV iron (ferric carboxymaltose) if ferritin <100 or ferritin 100-300 with TSAT <20%"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea on exertion (most sensitive symptom)",
        "Orthopnea requiring 2+ pillows",
        "Paroxysmal nocturnal dyspnea (PND)",
        "S3 gallop (volume overload)"
      ],
      right: [
        "Elevated JVP >8 cmH2O",
        "Hepatojugular reflux positive",
        "Bilateral lower extremity pitting edema",
        "Ascites and hepatomegaly in right-sided failure"
      ]
    },
    medications: [
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "ARNI",
        action: "Sacubitril inhibits neprilysin increasing natriuretic peptides; valsartan blocks AT1 receptors reducing RAAS activation",
        sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment",
        contra: "History of angioedema with ACEi, concurrent ACEi use (36h washout required), pregnancy",
        pearl: "PARADIGM-HF showed 20% reduction in CV death vs enalapril. Start at 24/26mg BID, titrate to 97/103mg BID."
      },
      {
        name: "Carvedilol (Coreg)",
        type: "Non-selective beta-blocker with alpha-1 blockade",
        action: "Blocks beta-1, beta-2, and alpha-1 receptors; reduces mortality by counteracting chronic sympathetic activation",
        sideEffects: "Bradycardia, hypotension, fatigue, weight gain, bronchospasm",
        contra: "Decompensated HF, HR <60, SBP <90, 2nd/3rd degree heart block, severe asthma",
        pearl: "Start 3.125mg BID, double every 2 weeks to target 25mg BID. COPERNICUS trial: 35% mortality reduction in severe HF."
      }
    ],
    pearls: [
      "Quadruple therapy (ARNI + BB + MRA + SGLT2i) is now standard GDMT for HFrEF",
      "BNP levels can be falsely low in obesity due to reduced natriuretic peptide production by adipocytes",
      "Sodium restriction to <2g/day and daily weight monitoring remain cornerstones of self-management"
    ],
    quiz: [
      {
        question: "A 62-year-old with HFrEF (EF 30%) is on lisinopril, carvedilol, and furosemide. K+ 4.2, Cr 1.3, eGFR 55. Which medication should be added next?",
        options: [
          "Digoxin 0.125mg daily",
          "Spironolactone 25mg daily",
          "Hydralazine/isosorbide dinitrate",
          "Ivabradine 5mg BID"
        ],
        correct: 1,
        rationale: "Spironolactone (MRA) is part of GDMT quadruple therapy for HFrEF. With EF <=35%, eGFR >30, and K+ <5.0, spironolactone should be added."
      }
    ]
  },
  "stemi-nstemi-algorithm-np": {
    title: "STEMI vs NSTEMI: Diagnostic Algorithm",
    cellular: {
      title: "Pathophysiology of STEMI vs NSTEMI",
      content: "STEMI vs NSTEMI: Diagnostic Algorithm involves specific alterations in stemi vs nstemi physiology. The pathophysiology of STEMI vs NSTEMI encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of stemi vs nstemi."
    },
    riskFactors: [
      "Diabetes mellitus type 2 with HbA1c >7%",
      "Heavy alcohol use (>14 drinks/week males, >7 females)",
      "Obstructive sleep apnea (AHI >15 events/hr)",
      "Prior stroke or TIA with residual neurological deficit",
      "Left ventricular hypertrophy on ECG or echo",
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Chronic inflammatory conditions (RA, SLE, psoriasis)"
    ],
    diagnostics: [
      "BNP >100 pg/mL or NT-proBNP >300 pg/mL for volume overload assessment",
      "Coagulation studies: PT/INR, aPTT, D-dimer",
      "Cardiac catheterization: coronary anatomy, hemodynamic measurements",
      "Holter or event monitor for intermittent arrhythmia detection",
      "CRP and ESR for inflammatory/infectious cardiac conditions",
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "Chest X-ray: cardiac silhouette, pulmonary vascularity, effusions"
    ],
    management: [
      "Antiplatelet therapy: aspirin 81mg daily for established ASCVD",
      "Anticoagulation: DOACs preferred over warfarin for non-valvular AF",
      "Cardiac rehabilitation referral (Phase I-III) for functional recovery",
      "Sodium restriction <2g/day for volume-sensitive conditions",
      "Structured exercise program: 150 min/week moderate-intensity aerobic",
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "CRT for EF <=35% with LBBB and QRS >=150ms"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Substernal chest tightness radiating to arm/jaw",
        "Progressive exercise intolerance",
        "Orthopnea requiring elevated sleeping position",
        "Diaphoresis with exertional symptoms"
      ],
      right: [
        "Peripheral cyanosis or pallor",
        "Blood pressure asymmetry",
        "Altered peripheral pulses",
        "New cardiac murmur or changed murmur character"
      ]
    },
    medications: [
      {
        name: "Amlodipine (Norvasc)",
        type: "Dihydropyridine CCB",
        action: "Blocks L-type calcium channels in vascular smooth muscle causing vasodilation",
        sideEffects: "Peripheral edema (dose-dependent), flushing, headache, gingival hyperplasia",
        contra: "Severe aortic stenosis, cardiogenic shock, unstable angina (use with caution)",
        pearl: "Start 5mg daily, max 10mg. Safe in HFpEF. Edema is dose-related, not allergic."
      },
      {
        name: "Furosemide (Lasix)",
        type: "Loop Diuretic",
        action: "Inhibits Na-K-2Cl cotransporter in thick ascending limb of Henle reducing sodium and water reabsorption",
        sideEffects: "Hypokalemia, hyponatremia, ototoxicity, hyperuricemia, dehydration",
        contra: "Anuria, hepatic coma, severe electrolyte depletion",
        pearl: "IV:PO ratio 1:2 (40mg IV = 80mg PO). Ceiling dose 160-200mg IV. Monitor K+ and Mg2+."
      }
    ],
    pearls: [
      "Beta-blockers reduce mortality in HFrEF but NOT in HFpEF",
      "DOACs preferred over warfarin for non-valvular AF; warfarin still required for mechanical valves",
      "BNP can be falsely low in obesity; use NT-proBNP cutoffs adjusted for age and BMI"
    ],
    quiz: [
      {
        question: "Which diagnostic finding is most specific for acute decompensation in stemi vs nstemi?",
        options: [
          "Normal chest X-ray",
          "BNP 50 pg/mL",
          "Elevated troponin with ECG changes",
          "Normal echocardiogram"
        ],
        correct: 2,
        rationale: "Elevated troponin with ECG changes indicates myocardial injury requiring urgent evaluation in the context of stemi vs nstemi."
      }
    ]
  },
  "heart-transplant-rejection-np": {
    title: "Heart Transplant Rejection: Immunosuppression",
    cellular: {
      title: "Pathophysiology of Heart Transplant Rejection",
      content: "Heart Transplant Rejection: Immunosuppression involves dysregulation of innate or adaptive immune responses leading to tissue injury or immunodeficiency in heart transplant rejection."
    },
    riskFactors: [
      "Environmental allergen sensitization",
      "Immunosuppressive therapy increasing infection susceptibility",
      "Genetic variants in HLA, complement, or immune pathways",
      "Occupational chemical/biological exposure",
      "Nutritional deficiencies (zinc, vitamin D) affecting immunity",
      "Stress and sleep deprivation impairing immune function",
      "Family history of autoimmune disease or immunodeficiency"
    ],
    diagnostics: [
      "Tryptase level (elevated in mast cell activation, anaphylaxis)",
      "Specific IgE testing or skin prick testing for allergen identification",
      "Lymphocyte proliferation assays for cellular immunity",
      "Vaccine response titers to assess humoral immune function",
      "HIV testing (4th gen Ag/Ab combo, confirmatory Western blot)",
      "Genetic testing for primary immunodeficiency disorders",
      "Complete blood count with differential (lymphocyte subsets)"
    ],
    management: [
      "Evidence-based immunomodulatory therapy specific to heart transplant rejection",
      "Allergen avoidance and environmental modification",
      "Immunosuppressive agents when indicated (corticosteroids, calcineurin inhibitors)",
      "Biologic agents targeting specific immune pathways",
      "Vaccination update per immunocompromised guidelines",
      "Infection surveillance and prophylaxis",
      "Allergy/immunology consultation for complex immune dysregulation"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urticaria, angioedema, anaphylaxis symptoms",
        "Recurrent or opportunistic infections",
        "Fever of unknown origin",
        "Fatigue and constitutional symptoms"
      ],
      right: [
        "Lymphadenopathy or organomegaly",
        "Skin findings (rash, vasculitis, photosensitivity)",
        "Laboratory evidence of immune dysfunction",
        "Multi-organ involvement suggesting systemic process"
      ]
    },
    medications: [
      {
        name: "Epinephrine (EpiPen)",
        type: "Alpha/Beta Agonist",
        action: "Alpha-1: vasoconstriction reverses hypotension; Beta-1: positive inotropy/chronotropy; Beta-2: bronchodilation and mast cell stabilization",
        sideEffects: "Tachycardia, anxiety, tremor, hypertension",
        contra: "No absolute contraindications in anaphylaxis",
        pearl: "IM anterolateral thigh: 0.3-0.5mg adults, 0.01mg/kg peds. Auto-injector: carry 2. Can repeat q5-15min. First-line for anaphylaxis - NEVER delay."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces T-cell activation, decreases cytokine production",
        sideEffects: "Hyperglycemia, weight gain, osteoporosis, immunosuppression, adrenal suppression",
        contra: "Active untreated infection; caution with diabetes, osteoporosis, peptic ulcer",
        pearl: "Anaphylaxis: 50mg PO to prevent biphasic reaction. Autoimmune: 1mg/kg then taper. Taper if >2 weeks use to prevent adrenal crisis."
      }
    ],
    pearls: [
      "Anaphylaxis: epinephrine IM is FIRST-LINE - antihistamines and steroids are adjunctive only",
      "Distinguish IgE-mediated (Type I) from other hypersensitivity mechanisms for proper management",
      "Heart Transplant Rejection requires systematic immune workup including immunoglobulins, complement, and lymphocyte subsets"
    ],
    quiz: [
      {
        question: "A patient develops acute symptoms consistent with heart transplant rejection with hypotension and respiratory distress. Priority intervention?",
        options: [
          "IV diphenhydramine 50mg",
          "IM epinephrine 0.3mg into anterolateral thigh",
          "Oral prednisone 50mg",
          "Nebulized albuterol only"
        ],
        correct: 1,
        rationale: "IM epinephrine is the first-line treatment for severe allergic/immune reactions with hemodynamic instability or respiratory compromise."
      }
    ]
  },
  "secondary-hypertension-workup-np": {
    title: "Secondary Hypertension Workup: Renal",
    cellular: {
      title: "Pathophysiology of Secondary Hypertension Workup",
      content: "Secondary Hypertension Workup: Renal involves specific alterations in secondary hypertension workup physiology. The pathophysiology of Secondary Hypertension Workup encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of secondary hypertension workup."
    },
    riskFactors: [
      "History of preeclampsia or gestational hypertension",
      "Chronic kidney disease (eGFR <60 mL/min)",
      "Dyslipidemia (LDL >130 despite lifestyle modification)",
      "Family history of premature CVD (<55 males, <65 females)",
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Obstructive sleep apnea (AHI >15 events/hr)",
      "Atrial fibrillation or flutter with rapid ventricular rate"
    ],
    diagnostics: [
      "HbA1c for glycemic control assessment in diabetic patients",
      "Cardiac MRI for tissue characterization (edema, fibrosis, infiltration)",
      "CBC with differential (anemia worsens cardiac ischemia)",
      "Lipid panel: total cholesterol, LDL, HDL, triglycerides",
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "Cardiac catheterization: coronary anatomy, hemodynamic measurements",
      "Stress testing (exercise or pharmacologic) with nuclear or echo imaging"
    ],
    management: [
      "Weight monitoring: report gain >2 lbs/day or >5 lbs/week",
      "Loop diuretics titrated to euvolemia based on daily weights",
      "Dual antiplatelet therapy (DAPT) post-ACS or PCI for 6-12 months",
      "ACEi/ARB for patients with HFrEF, post-MI, or diabetic nephropathy",
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "Cardiac rehabilitation referral (Phase I-III) for functional recovery",
      "Smoking cessation: varenicline or NRT plus behavioral counseling"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Substernal chest tightness radiating to arm/jaw",
        "Progressive exercise intolerance",
        "Orthopnea requiring elevated sleeping position",
        "Diaphoresis with exertional symptoms"
      ],
      right: [
        "Peripheral cyanosis or pallor",
        "Blood pressure asymmetry",
        "Altered peripheral pulses",
        "New cardiac murmur or changed murmur character"
      ]
    },
    medications: [
      {
        name: "Spironolactone (Aldactone)",
        type: "Mineralocorticoid Receptor Antagonist",
        action: "Competitively blocks aldosterone at collecting duct; reduces sodium retention, fibrosis, and remodeling",
        sideEffects: "Hyperkalemia, gynecomastia, breast tenderness, menstrual irregularity",
        contra: "K+ >5.0 mEq/L, eGFR <30, concurrent K+-sparing diuretics, Addison disease",
        pearl: "HF: 25mg daily. RALES: 30% mortality reduction. Check K+ at 3 days and 1 week. Switch to eplerenone if gynecomastia."
      },
      {
        name: "Nitroglycerin (NTG)",
        type: "Organic Nitrate",
        action: "Releases NO causing venodilation (reduces preload) and coronary vasodilation",
        sideEffects: "Headache, hypotension, reflex tachycardia, tolerance with continuous use",
        contra: "SBP <90, RV infarction, concurrent PDE5 inhibitor (sildenafil within 24h, tadalafil within 48h)",
        pearl: "SL: 0.4mg q5min x3 for angina. IV: start 5mcg/min, titrate by 5mcg q3-5min. Nitrate-free interval 10-14h."
      }
    ],
    pearls: [
      "Target LDL <70 mg/dL for established ASCVD (consider <55 for very high risk)",
      "BNP can be falsely low in obesity; use NT-proBNP cutoffs adjusted for age and BMI",
      "DOACs preferred over warfarin for non-valvular AF; warfarin still required for mechanical valves"
    ],
    quiz: [
      {
        question: "Which diagnostic finding is most specific for acute decompensation in secondary hypertension workup?",
        options: [
          "Normal chest X-ray",
          "BNP 50 pg/mL",
          "Elevated troponin with ECG changes",
          "Normal echocardiogram"
        ],
        correct: 2,
        rationale: "Elevated troponin with ECG changes indicates myocardial injury requiring urgent evaluation in the context of secondary hypertension workup."
      }
    ]
  },
  "cardiomyopathy-differential-np": {
    title: "Cardiomyopathy Differential: Dilated",
    cellular: {
      title: "Pathophysiology of Cardiomyopathy Differential",
      content: "Cardiomyopathy Differential: Dilated involves specific alterations in cardiomyopathy differential physiology. The pathophysiology of Cardiomyopathy Differential encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of cardiomyopathy differential."
    },
    riskFactors: [
      "Diabetes mellitus type 2 with HbA1c >7%",
      "Heavy alcohol use (>14 drinks/week males, >7 females)",
      "Obstructive sleep apnea (AHI >15 events/hr)",
      "Prior stroke or TIA with residual neurological deficit",
      "Left ventricular hypertrophy on ECG or echo",
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Chronic inflammatory conditions (RA, SLE, psoriasis)"
    ],
    diagnostics: [
      "BNP >100 pg/mL or NT-proBNP >300 pg/mL for volume overload assessment",
      "Coagulation studies: PT/INR, aPTT, D-dimer",
      "Cardiac catheterization: coronary anatomy, hemodynamic measurements",
      "Holter or event monitor for intermittent arrhythmia detection",
      "CRP and ESR for inflammatory/infectious cardiac conditions",
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "Chest X-ray: cardiac silhouette, pulmonary vascularity, effusions"
    ],
    management: [
      "Antiplatelet therapy: aspirin 81mg daily for established ASCVD",
      "Anticoagulation: DOACs preferred over warfarin for non-valvular AF",
      "Cardiac rehabilitation referral (Phase I-III) for functional recovery",
      "Sodium restriction <2g/day for volume-sensitive conditions",
      "Structured exercise program: 150 min/week moderate-intensity aerobic",
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "CRT for EF <=35% with LBBB and QRS >=150ms"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Acute onset severe chest pain",
        "Dyspnea with hemoptysis",
        "Pre-syncope with positional changes",
        "Fatigue disproportionate to activity level"
      ],
      right: [
        "Tachycardia with narrow or wide complex",
        "New S3 or S4 heart sounds",
        "Bilateral crackles on auscultation",
        "Elevated JVP with Kussmaul sign"
      ]
    },
    medications: [
      {
        name: "Amlodipine (Norvasc)",
        type: "Dihydropyridine CCB",
        action: "Blocks L-type calcium channels in vascular smooth muscle causing vasodilation",
        sideEffects: "Peripheral edema (dose-dependent), flushing, headache, gingival hyperplasia",
        contra: "Severe aortic stenosis, cardiogenic shock, unstable angina (use with caution)",
        pearl: "Start 5mg daily, max 10mg. Safe in HFpEF. Edema is dose-related, not allergic."
      },
      {
        name: "Furosemide (Lasix)",
        type: "Loop Diuretic",
        action: "Inhibits Na-K-2Cl cotransporter in thick ascending limb of Henle reducing sodium and water reabsorption",
        sideEffects: "Hypokalemia, hyponatremia, ototoxicity, hyperuricemia, dehydration",
        contra: "Anuria, hepatic coma, severe electrolyte depletion",
        pearl: "IV:PO ratio 1:2 (40mg IV = 80mg PO). Ceiling dose 160-200mg IV. Monitor K+ and Mg2+."
      }
    ],
    pearls: [
      "Beta-blockers reduce mortality in HFrEF but NOT in HFpEF",
      "DOACs preferred over warfarin for non-valvular AF; warfarin still required for mechanical valves",
      "BNP can be falsely low in obesity; use NT-proBNP cutoffs adjusted for age and BMI"
    ],
    quiz: [
      {
        question: "Which diagnostic finding is most specific for acute decompensation in cardiomyopathy differential?",
        options: [
          "Normal chest X-ray",
          "BNP 50 pg/mL",
          "Elevated troponin with ECG changes",
          "Normal echocardiogram"
        ],
        correct: 2,
        rationale: "Elevated troponin with ECG changes indicates myocardial injury requiring urgent evaluation in the context of cardiomyopathy differential."
      }
    ]
  },
  "syncope-diagnostic-algorithm-np": {
    title: "Syncope Diagnostic Algorithm: Cardiac vs",
    cellular: {
      title: "Pathophysiology of Syncope Diagnostic Algorithm",
      content: "Syncope Diagnostic Algorithm: Cardiac vs involves specific alterations in syncope diagnostic algorithm physiology. The pathophysiology of Syncope Diagnostic Algorithm encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of syncope diagnostic algorithm."
    },
    riskFactors: [
      "Prior stroke or TIA with residual neurological deficit",
      "Coronary artery disease with prior MI or PCI",
      "Sedentary lifestyle with deconditioning",
      "Left ventricular hypertrophy on ECG or echo",
      "Obesity (BMI >30) with metabolic syndrome",
      "Age >65 with cardiovascular degeneration",
      "Diabetes mellitus type 2 with HbA1c >7%"
    ],
    diagnostics: [
      "Holter or event monitor for intermittent arrhythmia detection",
      "Troponin I or T serial measurements (0h, 3h, 6h) for myocardial injury",
      "Ankle-brachial index for peripheral vascular disease screening",
      "CRP and ESR for inflammatory/infectious cardiac conditions",
      "CT angiography of chest for aortic or pulmonary vascular pathology",
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions",
      "BNP >100 pg/mL or NT-proBNP >300 pg/mL for volume overload assessment"
    ],
    management: [
      "Sodium restriction <2g/day for volume-sensitive conditions",
      "Blood pressure target <130/80 mmHg (ACC/AHA 2017 guidelines)",
      "Fluid restriction 1.5-2L/day for hyponatremia or severe HF",
      "Structured exercise program: 150 min/week moderate-intensity aerobic",
      "SGLT2 inhibitor for HF regardless of diabetes status",
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)",
      "Antiplatelet therapy: aspirin 81mg daily for established ASCVD"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Substernal chest tightness radiating to arm/jaw",
        "Progressive exercise intolerance",
        "Orthopnea requiring elevated sleeping position",
        "Diaphoresis with exertional symptoms"
      ],
      right: [
        "Peripheral cyanosis or pallor",
        "Blood pressure asymmetry",
        "Altered peripheral pulses",
        "New cardiac murmur or changed murmur character"
      ]
    },
    medications: [
      {
        name: "Lisinopril (Zestril/Prinivil)",
        type: "ACE Inhibitor",
        action: "Inhibits ACE converting angiotensin I to II; reduces preload, afterload, and cardiac remodeling",
        sideEffects: "Dry cough (10-15%), hyperkalemia, angioedema (0.1-0.7%), acute kidney injury",
        contra: "History of ACEi angioedema, bilateral renal artery stenosis, pregnancy",
        pearl: "Start 5-10mg daily, titrate to 20-40mg. Check K+ and Cr within 1-2 weeks of initiation."
      },
      {
        name: "Atorvastatin (Lipitor)",
        type: "HMG-CoA Reductase Inhibitor",
        action: "Inhibits cholesterol synthesis, upregulates LDL receptors; pleiotropic anti-inflammatory and plaque-stabilizing effects",
        sideEffects: "Myalgia, elevated transaminases, new-onset diabetes",
        contra: "Active liver disease, pregnancy, unexplained persistent LFT elevation",
        pearl: "High-intensity: 40-80mg daily. Reduces LDL by 50%. Check CK only if symptomatic myopathy."
      }
    ],
    pearls: [
      "Troponin elevation without ACS: consider PE, myocarditis, Takotsubo, renal failure, sepsis",
      "New LBBB + chest pain: treat as STEMI equivalent until proven otherwise",
      "Right-sided MI: volume-dependent; avoid nitrates and diuretics, give IV fluids"
    ],
    quiz: [
      {
        question: "A patient with history of syncope diagnostic algorithm has HR 52, BP 88/54 on metoprolol 100mg BID. Best next step?",
        options: [
          "Increase metoprolol dose",
          "Hold metoprolol and reassess hemodynamics",
          "Add digoxin",
          "Start dobutamine drip"
        ],
        correct: 1,
        rationale: "Symptomatic bradycardia and hypotension suggest beta-blocker excess. Hold the medication and reassess before adjusting."
      }
    ]
  },
  "coronary-artery-ectasia-np": {
    title: "Coronary Artery Ectasia: Diagnosis",
    cellular: {
      title: "Pathophysiology of Coronary Artery Ectasia",
      content: "Coronary Artery Ectasia: Diagnosis involves specific alterations in coronary artery ectasia physiology. The pathophysiology of Coronary Artery Ectasia encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of coronary artery ectasia."
    },
    riskFactors: [
      "Chronic inflammatory conditions (RA, SLE, psoriasis)",
      "Tobacco use (pack-year dependent risk calculation)",
      "Coronary artery disease with prior MI or PCI",
      "Diabetes mellitus type 2 with HbA1c >7%",
      "Prior stroke or TIA with residual neurological deficit",
      "Family history of premature CVD (<55 males, <65 females)",
      "Obesity (BMI >30) with metabolic syndrome"
    ],
    diagnostics: [
      "Chest X-ray: cardiac silhouette, pulmonary vascularity, effusions",
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "Troponin I or T serial measurements (0h, 3h, 6h) for myocardial injury",
      "BNP >100 pg/mL or NT-proBNP >300 pg/mL for volume overload assessment",
      "Holter or event monitor for intermittent arrhythmia detection",
      "Lipid panel: total cholesterol, LDL, HDL, triglycerides",
      "CT angiography of chest for aortic or pulmonary vascular pathology"
    ],
    management: [
      "CRT for EF <=35% with LBBB and QRS >=150ms",
      "Beta-blocker titration to resting HR 60-70 bpm",
      "Blood pressure target <130/80 mmHg (ACC/AHA 2017 guidelines)",
      "Antiplatelet therapy: aspirin 81mg daily for established ASCVD",
      "Sodium restriction <2g/day for volume-sensitive conditions",
      "ACEi/ARB for patients with HFrEF, post-MI, or diabetic nephropathy",
      "SGLT2 inhibitor for HF regardless of diabetes status"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Acute onset severe chest pain",
        "Dyspnea with hemoptysis",
        "Pre-syncope with positional changes",
        "Fatigue disproportionate to activity level"
      ],
      right: [
        "Tachycardia with narrow or wide complex",
        "New S3 or S4 heart sounds",
        "Bilateral crackles on auscultation",
        "Elevated JVP with Kussmaul sign"
      ]
    },
    medications: [
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "ARNI",
        action: "Dual inhibition: sacubitril inhibits neprilysin (increases natriuretic peptides); valsartan blocks AT1 receptors",
        sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment, dizziness",
        contra: "ACEi angioedema history, concurrent ACEi (36h washout), pregnancy",
        pearl: "PARADIGM-HF: 20% CV death reduction. Start 24/26mg BID, titrate to 97/103mg BID over 2-4 weeks."
      },
      {
        name: "Apixaban (Eliquis)",
        type: "Direct Factor Xa Inhibitor",
        action: "Selectively and reversibly inhibits Factor Xa preventing thrombin generation and clot formation",
        sideEffects: "Bleeding (major GI, intracranial); reversal agent: andexanet alfa",
        contra: "Active pathological bleeding, prosthetic mechanical heart valve, severe hepatic impairment",
        pearl: "Standard: 5mg BID. Reduce to 2.5mg BID if >=2 of: age >=80, weight <=60kg, Cr >=1.5 mg/dL."
      }
    ],
    pearls: [
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status",
      "Avoid NSAIDs in heart failure (fluid retention) and post-ACS (increased CV events)",
      "Troponin elevation without ACS: consider PE, myocarditis, Takotsubo, renal failure, sepsis"
    ],
    quiz: [
      {
        question: "A 65-year-old with coronary artery ectasia presents with dyspnea, JVD, and bilateral crackles. BNP 850 pg/mL. Which initial intervention is most appropriate?",
        options: [
          "IV furosemide 40mg and continuous monitoring",
          "Immediate cardiac catheterization",
          "Start amiodarone drip",
          "Discharge with PCP follow-up in 2 weeks"
        ],
        correct: 0,
        rationale: "IV furosemide addresses acute volume overload in coronary artery ectasia with continuous monitoring for response."
      }
    ]
  },
  "coronary-microvascular-dysfunction-np": {
    title: "Coronary Microvascular Dysfunction: Diagnosis",
    cellular: {
      title: "Pathophysiology of Coronary Microvascular Dysfunction",
      content: "Coronary Microvascular Dysfunction: Diagnosis involves specific alterations in coronary microvascular dysfunction physiology. The pathophysiology of Coronary Microvascular Dysfunction encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of coronary microvascular dysfunction."
    },
    riskFactors: [
      "Left ventricular hypertrophy on ECG or echo",
      "Obstructive sleep apnea (AHI >15 events/hr)",
      "Tobacco use (pack-year dependent risk calculation)",
      "Obesity (BMI >30) with metabolic syndrome",
      "Chronic inflammatory conditions (RA, SLE, psoriasis)",
      "Atrial fibrillation or flutter with rapid ventricular rate",
      "Prior stroke or TIA with residual neurological deficit"
    ],
    diagnostics: [
      "CRP and ESR for inflammatory/infectious cardiac conditions",
      "Cardiac catheterization: coronary anatomy, hemodynamic measurements",
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "CT angiography of chest for aortic or pulmonary vascular pathology",
      "Chest X-ray: cardiac silhouette, pulmonary vascularity, effusions",
      "Stress testing (exercise or pharmacologic) with nuclear or echo imaging",
      "Holter or event monitor for intermittent arrhythmia detection"
    ],
    management: [
      "Structured exercise program: 150 min/week moderate-intensity aerobic",
      "Cardiac rehabilitation referral (Phase I-III) for functional recovery",
      "Beta-blocker titration to resting HR 60-70 bpm",
      "SGLT2 inhibitor for HF regardless of diabetes status",
      "CRT for EF <=35% with LBBB and QRS >=150ms",
      "Smoking cessation: varenicline or NRT plus behavioral counseling",
      "Sodium restriction <2g/day for volume-sensitive conditions"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Substernal chest tightness radiating to arm/jaw",
        "Progressive exercise intolerance",
        "Orthopnea requiring elevated sleeping position",
        "Diaphoresis with exertional symptoms"
      ],
      right: [
        "Peripheral cyanosis or pallor",
        "Blood pressure asymmetry",
        "Altered peripheral pulses",
        "New cardiac murmur or changed murmur character"
      ]
    },
    medications: [
      {
        name: "Nitroglycerin (NTG)",
        type: "Organic Nitrate",
        action: "Releases NO causing venodilation (reduces preload) and coronary vasodilation",
        sideEffects: "Headache, hypotension, reflex tachycardia, tolerance with continuous use",
        contra: "SBP <90, RV infarction, concurrent PDE5 inhibitor (sildenafil within 24h, tadalafil within 48h)",
        pearl: "SL: 0.4mg q5min x3 for angina. IV: start 5mcg/min, titrate by 5mcg q3-5min. Nitrate-free interval 10-14h."
      },
      {
        name: "Metoprolol Succinate (Toprol-XL)",
        type: "Beta-1 Selective Blocker",
        action: "Selectively blocks cardiac beta-1 receptors reducing heart rate, contractility, and myocardial oxygen demand",
        sideEffects: "Bradycardia, hypotension, fatigue, depression, bronchospasm",
        contra: "Severe bradycardia <50 bpm, decompensated HF, cardiogenic shock, 2nd/3rd degree AV block",
        pearl: "Start 25mg daily, titrate every 2 weeks. Target 200mg daily. Do NOT discontinue abruptly."
      }
    ],
    pearls: [
      "BNP can be falsely low in obesity; use NT-proBNP cutoffs adjusted for age and BMI",
      "ACC/AHA guidelines recommend ASCVD risk calculator for primary prevention decisions",
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status"
    ],
    quiz: [
      {
        question: "A patient with coronary microvascular dysfunction on lisinopril develops dry cough. K+ 4.8, Cr 1.1. Best alternative?",
        options: [
          "Losartan 50mg daily",
          "Double lisinopril dose",
          "Add hydrochlorothiazide",
          "Switch to spironolactone"
        ],
        correct: 0,
        rationale: "ARBs (losartan) are first-line alternatives for ACEi-induced cough. They block AT1 receptors without increasing bradykinin."
      }
    ]
  },
  "vasculitis-coronary-arteries-np": {
    title: "Vasculitis of Coronary Arteries: Kawasaki",
    cellular: {
      title: "Pathophysiology of Vasculitis of Coronary Arteries",
      content: "Vasculitis of Coronary Arteries: Kawasaki involves specific alterations in vasculitis of coronary arteries physiology. The pathophysiology of Vasculitis of Coronary Arteries encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of vasculitis of coronary arteries."
    },
    riskFactors: [
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Dyslipidemia (LDL >130 despite lifestyle modification)",
      "Chronic hypertension with end-organ damage",
      "Age >65 with cardiovascular degeneration",
      "Atrial fibrillation or flutter with rapid ventricular rate",
      "Tobacco use (pack-year dependent risk calculation)",
      "Family history of premature CVD (<55 males, <65 females)"
    ],
    diagnostics: [
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "CBC with differential (anemia worsens cardiac ischemia)",
      "12-lead ECG: assess rhythm, intervals, ST-T changes, axis deviation",
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions",
      "Stress testing (exercise or pharmacologic) with nuclear or echo imaging",
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "Lipid panel: total cholesterol, LDL, HDL, triglycerides"
    ],
    management: [
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "Dual antiplatelet therapy (DAPT) post-ACS or PCI for 6-12 months",
      "Guideline-directed medical therapy per ACC/AHA recommendations",
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)",
      "Smoking cessation: varenicline or NRT plus behavioral counseling",
      "Beta-blocker titration to resting HR 60-70 bpm",
      "ACEi/ARB for patients with HFrEF, post-MI, or diabetic nephropathy"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Substernal chest tightness radiating to arm/jaw",
        "Progressive exercise intolerance",
        "Orthopnea requiring elevated sleeping position",
        "Diaphoresis with exertional symptoms"
      ],
      right: [
        "Peripheral cyanosis or pallor",
        "Blood pressure asymmetry",
        "Altered peripheral pulses",
        "New cardiac murmur or changed murmur character"
      ]
    },
    medications: [
      {
        name: "Furosemide (Lasix)",
        type: "Loop Diuretic",
        action: "Inhibits Na-K-2Cl cotransporter in thick ascending limb of Henle reducing sodium and water reabsorption",
        sideEffects: "Hypokalemia, hyponatremia, ototoxicity, hyperuricemia, dehydration",
        contra: "Anuria, hepatic coma, severe electrolyte depletion",
        pearl: "IV:PO ratio 1:2 (40mg IV = 80mg PO). Ceiling dose 160-200mg IV. Monitor K+ and Mg2+."
      },
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "ARNI",
        action: "Dual inhibition: sacubitril inhibits neprilysin (increases natriuretic peptides); valsartan blocks AT1 receptors",
        sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment, dizziness",
        contra: "ACEi angioedema history, concurrent ACEi (36h washout), pregnancy",
        pearl: "PARADIGM-HF: 20% CV death reduction. Start 24/26mg BID, titrate to 97/103mg BID over 2-4 weeks."
      }
    ],
    pearls: [
      "DOACs preferred over warfarin for non-valvular AF; warfarin still required for mechanical valves",
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status",
      "ACC/AHA guidelines recommend ASCVD risk calculator for primary prevention decisions"
    ],
    quiz: [
      {
        question: "A patient with vasculitis of coronary arteries on lisinopril develops dry cough. K+ 4.8, Cr 1.1. Best alternative?",
        options: [
          "Losartan 50mg daily",
          "Double lisinopril dose",
          "Add hydrochlorothiazide",
          "Switch to spironolactone"
        ],
        correct: 0,
        rationale: "ARBs (losartan) are first-line alternatives for ACEi-induced cough. They block AT1 receptors without increasing bradykinin."
      }
    ]
  },
  "infiltrative-cardiomyopathy-np": {
    title: "Infiltrative Cardiomyopathy: Amyloid, Sarcoid",
    cellular: {
      title: "Pathophysiology of Infiltrative Cardiomyopathy",
      content: "Infiltrative Cardiomyopathy: Amyloid, Sarcoid involves specific alterations in infiltrative cardiomyopathy physiology. The pathophysiology of Infiltrative Cardiomyopathy encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of infiltrative cardiomyopathy."
    },
    riskFactors: [
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Dyslipidemia (LDL >130 despite lifestyle modification)",
      "Chronic hypertension with end-organ damage",
      "Age >65 with cardiovascular degeneration",
      "Atrial fibrillation or flutter with rapid ventricular rate",
      "Tobacco use (pack-year dependent risk calculation)",
      "Family history of premature CVD (<55 males, <65 females)"
    ],
    diagnostics: [
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "CBC with differential (anemia worsens cardiac ischemia)",
      "12-lead ECG: assess rhythm, intervals, ST-T changes, axis deviation",
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions",
      "Stress testing (exercise or pharmacologic) with nuclear or echo imaging",
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "Lipid panel: total cholesterol, LDL, HDL, triglycerides"
    ],
    management: [
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "Dual antiplatelet therapy (DAPT) post-ACS or PCI for 6-12 months",
      "Guideline-directed medical therapy per ACC/AHA recommendations",
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)",
      "Smoking cessation: varenicline or NRT plus behavioral counseling",
      "Beta-blocker titration to resting HR 60-70 bpm",
      "ACEi/ARB for patients with HFrEF, post-MI, or diabetic nephropathy"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Substernal chest tightness radiating to arm/jaw",
        "Progressive exercise intolerance",
        "Orthopnea requiring elevated sleeping position",
        "Diaphoresis with exertional symptoms"
      ],
      right: [
        "Peripheral cyanosis or pallor",
        "Blood pressure asymmetry",
        "Altered peripheral pulses",
        "New cardiac murmur or changed murmur character"
      ]
    },
    medications: [
      {
        name: "Furosemide (Lasix)",
        type: "Loop Diuretic",
        action: "Inhibits Na-K-2Cl cotransporter in thick ascending limb of Henle reducing sodium and water reabsorption",
        sideEffects: "Hypokalemia, hyponatremia, ototoxicity, hyperuricemia, dehydration",
        contra: "Anuria, hepatic coma, severe electrolyte depletion",
        pearl: "IV:PO ratio 1:2 (40mg IV = 80mg PO). Ceiling dose 160-200mg IV. Monitor K+ and Mg2+."
      },
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "ARNI",
        action: "Dual inhibition: sacubitril inhibits neprilysin (increases natriuretic peptides); valsartan blocks AT1 receptors",
        sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment, dizziness",
        contra: "ACEi angioedema history, concurrent ACEi (36h washout), pregnancy",
        pearl: "PARADIGM-HF: 20% CV death reduction. Start 24/26mg BID, titrate to 97/103mg BID over 2-4 weeks."
      }
    ],
    pearls: [
      "DOACs preferred over warfarin for non-valvular AF; warfarin still required for mechanical valves",
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status",
      "ACC/AHA guidelines recommend ASCVD risk calculator for primary prevention decisions"
    ],
    quiz: [
      {
        question: "A patient with infiltrative cardiomyopathy on lisinopril develops dry cough. K+ 4.8, Cr 1.1. Best alternative?",
        options: [
          "Losartan 50mg daily",
          "Double lisinopril dose",
          "Add hydrochlorothiazide",
          "Switch to spironolactone"
        ],
        correct: 0,
        rationale: "ARBs (losartan) are first-line alternatives for ACEi-induced cough. They block AT1 receptors without increasing bradykinin."
      }
    ]
  },
  "fibromuscular-dysplasia-np": {
    title: "Fibromuscular Dysplasia: Renal",
    cellular: {
      title: "Pathophysiology of Fibromuscular Dysplasia",
      content: "Fibromuscular Dysplasia: Renal involves specific alterations in fibromuscular dysplasia physiology. The pathophysiology of Fibromuscular Dysplasia encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of fibromuscular dysplasia."
    },
    riskFactors: [
      "Hypercoagulable states (Factor V Leiden, antiphospholipid)",
      "Family history of premature CVD (<55 males, <65 females)",
      "Age >65 with cardiovascular degeneration",
      "Dyslipidemia (LDL >130 despite lifestyle modification)",
      "Peripheral artery disease (ABI <0.9)",
      "Obesity (BMI >30) with metabolic syndrome",
      "Chronic kidney disease (eGFR <60 mL/min)"
    ],
    diagnostics: [
      "Ambulatory blood pressure monitoring for white coat vs masked HTN",
      "Lipid panel: total cholesterol, LDL, HDL, triglycerides",
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions",
      "CBC with differential (anemia worsens cardiac ischemia)",
      "TEE for valvular vegetation, intracardiac thrombus, PFO assessment",
      "CT angiography of chest for aortic or pulmonary vascular pathology",
      "Cardiac MRI for tissue characterization (edema, fibrosis, infiltration)"
    ],
    management: [
      "Referral for surgical intervention when medical therapy insufficient",
      "ACEi/ARB for patients with HFrEF, post-MI, or diabetic nephropathy",
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)",
      "Dual antiplatelet therapy (DAPT) post-ACS or PCI for 6-12 months",
      "Rate vs rhythm control strategy for atrial fibrillation management",
      "SGLT2 inhibitor for HF regardless of diabetes status",
      "Loop diuretics titrated to euvolemia based on daily weights"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Substernal chest tightness radiating to arm/jaw",
        "Progressive exercise intolerance",
        "Orthopnea requiring elevated sleeping position",
        "Diaphoresis with exertional symptoms"
      ],
      right: [
        "Peripheral cyanosis or pallor",
        "Blood pressure asymmetry",
        "Altered peripheral pulses",
        "New cardiac murmur or changed murmur character"
      ]
    },
    medications: [
      {
        name: "Apixaban (Eliquis)",
        type: "Direct Factor Xa Inhibitor",
        action: "Selectively and reversibly inhibits Factor Xa preventing thrombin generation and clot formation",
        sideEffects: "Bleeding (major GI, intracranial); reversal agent: andexanet alfa",
        contra: "Active pathological bleeding, prosthetic mechanical heart valve, severe hepatic impairment",
        pearl: "Standard: 5mg BID. Reduce to 2.5mg BID if >=2 of: age >=80, weight <=60kg, Cr >=1.5 mg/dL."
      },
      {
        name: "Carvedilol (Coreg)",
        type: "Non-selective Beta + Alpha-1 Blocker",
        action: "Blocks beta-1, beta-2, and alpha-1 adrenergic receptors; antioxidant properties",
        sideEffects: "Bradycardia, hypotension, dizziness, weight gain, bronchospasm, fatigue",
        contra: "Decompensated HF, SBP <90, HR <55, 2nd/3rd degree AV block, severe asthma/COPD",
        pearl: "HF dose: start 3.125mg BID, target 25mg BID. COPERNICUS: 35% mortality reduction. Take with food."
      }
    ],
    pearls: [
      "Avoid NSAIDs in heart failure (fluid retention) and post-ACS (increased CV events)",
      "Right-sided MI: volume-dependent; avoid nitrates and diuretics, give IV fluids",
      "New LBBB + chest pain: treat as STEMI equivalent until proven otherwise"
    ],
    quiz: [
      {
        question: "A patient with history of fibromuscular dysplasia has HR 52, BP 88/54 on metoprolol 100mg BID. Best next step?",
        options: [
          "Increase metoprolol dose",
          "Hold metoprolol and reassess hemodynamics",
          "Add digoxin",
          "Start dobutamine drip"
        ],
        correct: 1,
        rationale: "Symptomatic bradycardia and hypotension suggest beta-blocker excess. Hold the medication and reassess before adjusting."
      }
    ]
  },
  "renovascular-hypertension-np": {
    title: "Renovascular Hypertension: Screening",
    cellular: {
      title: "Pathophysiology of Renovascular Hypertension",
      content: "Renovascular Hypertension: Screening involves specific alterations in renovascular hypertension physiology. The pathophysiology of Renovascular Hypertension encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of renovascular hypertension."
    },
    riskFactors: [
      "Coronary artery disease with prior MI or PCI",
      "Prior stroke or TIA with residual neurological deficit",
      "Obesity (BMI >30) with metabolic syndrome",
      "Obstructive sleep apnea (AHI >15 events/hr)",
      "Sedentary lifestyle with deconditioning",
      "Peripheral artery disease (ABI <0.9)",
      "Heavy alcohol use (>14 drinks/week males, >7 females)"
    ],
    diagnostics: [
      "Troponin I or T serial measurements (0h, 3h, 6h) for myocardial injury",
      "Holter or event monitor for intermittent arrhythmia detection",
      "CT angiography of chest for aortic or pulmonary vascular pathology",
      "Cardiac catheterization: coronary anatomy, hemodynamic measurements",
      "Ankle-brachial index for peripheral vascular disease screening",
      "TEE for valvular vegetation, intracardiac thrombus, PFO assessment",
      "Coagulation studies: PT/INR, aPTT, D-dimer"
    ],
    management: [
      "Blood pressure target <130/80 mmHg (ACC/AHA 2017 guidelines)",
      "Sodium restriction <2g/day for volume-sensitive conditions",
      "SGLT2 inhibitor for HF regardless of diabetes status",
      "Cardiac rehabilitation referral (Phase I-III) for functional recovery",
      "Fluid restriction 1.5-2L/day for hyponatremia or severe HF",
      "Rate vs rhythm control strategy for atrial fibrillation management",
      "Anticoagulation: DOACs preferred over warfarin for non-valvular AF"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Acute onset severe chest pain",
        "Dyspnea with hemoptysis",
        "Pre-syncope with positional changes",
        "Fatigue disproportionate to activity level"
      ],
      right: [
        "Tachycardia with narrow or wide complex",
        "New S3 or S4 heart sounds",
        "Bilateral crackles on auscultation",
        "Elevated JVP with Kussmaul sign"
      ]
    },
    medications: [
      {
        name: "Lisinopril (Zestril/Prinivil)",
        type: "ACE Inhibitor",
        action: "Inhibits ACE converting angiotensin I to II; reduces preload, afterload, and cardiac remodeling",
        sideEffects: "Dry cough (10-15%), hyperkalemia, angioedema (0.1-0.7%), acute kidney injury",
        contra: "History of ACEi angioedema, bilateral renal artery stenosis, pregnancy",
        pearl: "Start 5-10mg daily, titrate to 20-40mg. Check K+ and Cr within 1-2 weeks of initiation."
      },
      {
        name: "Atorvastatin (Lipitor)",
        type: "HMG-CoA Reductase Inhibitor",
        action: "Inhibits cholesterol synthesis, upregulates LDL receptors; pleiotropic anti-inflammatory and plaque-stabilizing effects",
        sideEffects: "Myalgia, elevated transaminases, new-onset diabetes",
        contra: "Active liver disease, pregnancy, unexplained persistent LFT elevation",
        pearl: "High-intensity: 40-80mg daily. Reduces LDL by 50%. Check CK only if symptomatic myopathy."
      }
    ],
    pearls: [
      "Troponin elevation without ACS: consider PE, myocarditis, Takotsubo, renal failure, sepsis",
      "New LBBB + chest pain: treat as STEMI equivalent until proven otherwise",
      "Right-sided MI: volume-dependent; avoid nitrates and diuretics, give IV fluids"
    ],
    quiz: [
      {
        question: "A patient with history of renovascular hypertension has HR 52, BP 88/54 on metoprolol 100mg BID. Best next step?",
        options: [
          "Increase metoprolol dose",
          "Hold metoprolol and reassess hemodynamics",
          "Add digoxin",
          "Start dobutamine drip"
        ],
        correct: 1,
        rationale: "Symptomatic bradycardia and hypotension suggest beta-blocker excess. Hold the medication and reassess before adjusting."
      }
    ]
  },
  "peripheral-embolism-np": {
    title: "Peripheral Embolism: Arterial Thromboembolism",
    cellular: {
      title: "Pathophysiology of Peripheral Embolism",
      content: "Peripheral Embolism: Arterial Thromboembolism involves specific alterations in peripheral embolism physiology. The pathophysiology of Peripheral Embolism encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of peripheral embolism."
    },
    riskFactors: [
      "Sedentary lifestyle with deconditioning",
      "Obesity (BMI >30) with metabolic syndrome",
      "Diabetes mellitus type 2 with HbA1c >7%",
      "Tobacco use (pack-year dependent risk calculation)",
      "Heavy alcohol use (>14 drinks/week males, >7 females)",
      "Chronic kidney disease (eGFR <60 mL/min)",
      "Obstructive sleep apnea (AHI >15 events/hr)"
    ],
    diagnostics: [
      "Ankle-brachial index for peripheral vascular disease screening",
      "CT angiography of chest for aortic or pulmonary vascular pathology",
      "BNP >100 pg/mL or NT-proBNP >300 pg/mL for volume overload assessment",
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "Coagulation studies: PT/INR, aPTT, D-dimer",
      "Cardiac MRI for tissue characterization (edema, fibrosis, infiltration)",
      "Cardiac catheterization: coronary anatomy, hemodynamic measurements"
    ],
    management: [
      "Fluid restriction 1.5-2L/day for hyponatremia or severe HF",
      "SGLT2 inhibitor for HF regardless of diabetes status",
      "Antiplatelet therapy: aspirin 81mg daily for established ASCVD",
      "Beta-blocker titration to resting HR 60-70 bpm",
      "Anticoagulation: DOACs preferred over warfarin for non-valvular AF",
      "Loop diuretics titrated to euvolemia based on daily weights",
      "Cardiac rehabilitation referral (Phase I-III) for functional recovery"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Chest pain or pressure",
        "Dyspnea on exertion or at rest",
        "Palpitations or irregular heartbeat",
        "Syncope or near-syncope"
      ],
      right: [
        "Jugular venous distension",
        "Bilateral lower extremity edema",
        "Hepatomegaly with hepatojugular reflux",
        "Abnormal heart sounds (murmur, gallop, rub)"
      ]
    },
    medications: [
      {
        name: "Carvedilol (Coreg)",
        type: "Non-selective Beta + Alpha-1 Blocker",
        action: "Blocks beta-1, beta-2, and alpha-1 adrenergic receptors; antioxidant properties",
        sideEffects: "Bradycardia, hypotension, dizziness, weight gain, bronchospasm, fatigue",
        contra: "Decompensated HF, SBP <90, HR <55, 2nd/3rd degree AV block, severe asthma/COPD",
        pearl: "HF dose: start 3.125mg BID, target 25mg BID. COPERNICUS: 35% mortality reduction. Take with food."
      },
      {
        name: "Spironolactone (Aldactone)",
        type: "Mineralocorticoid Receptor Antagonist",
        action: "Competitively blocks aldosterone at collecting duct; reduces sodium retention, fibrosis, and remodeling",
        sideEffects: "Hyperkalemia, gynecomastia, breast tenderness, menstrual irregularity",
        contra: "K+ >5.0 mEq/L, eGFR <30, concurrent K+-sparing diuretics, Addison disease",
        pearl: "HF: 25mg daily. RALES: 30% mortality reduction. Check K+ at 3 days and 1 week. Switch to eplerenone if gynecomastia."
      }
    ],
    pearls: [
      "Right-sided MI: volume-dependent; avoid nitrates and diuretics, give IV fluids",
      "Target LDL <70 mg/dL for established ASCVD (consider <55 for very high risk)",
      "Beta-blockers reduce mortality in HFrEF but NOT in HFpEF"
    ],
    quiz: [
      {
        question: "A 58-year-old with peripheral embolism has LDL 145, diabetes, and HTN. Best lipid management?",
        options: [
          "Lifestyle modification only for 6 months",
          "Moderate-intensity statin",
          "High-intensity statin (atorvastatin 40-80mg)",
          "Ezetimibe monotherapy"
        ],
        correct: 2,
        rationale: "With multiple ASCVD risk factors and peripheral embolism, high-intensity statin therapy is indicated per ACC/AHA guidelines."
      }
    ]
  },
  "cholesterol-embolization-np": {
    title: "Cholesterol Embolization Syndrome: Blue Toe",
    cellular: {
      title: "Pathophysiology of Cholesterol Embolization Syndrome",
      content: "Cholesterol Embolization Syndrome: Blue Toe involves specific alterations in cholesterol embolization syndrome physiology. The pathophysiology of Cholesterol Embolization Syndrome encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of cholesterol embolization syndrome."
    },
    riskFactors: [
      "Chronic kidney disease (eGFR <60 mL/min)",
      "History of preeclampsia or gestational hypertension",
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Hypercoagulable states (Factor V Leiden, antiphospholipid)",
      "Dyslipidemia (LDL >130 despite lifestyle modification)",
      "Left ventricular hypertrophy on ECG or echo",
      "Chronic hypertension with end-organ damage"
    ],
    diagnostics: [
      "Cardiac MRI for tissue characterization (edema, fibrosis, infiltration)",
      "HbA1c for glycemic control assessment in diabetic patients",
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "Ambulatory blood pressure monitoring for white coat vs masked HTN",
      "CBC with differential (anemia worsens cardiac ischemia)",
      "CRP and ESR for inflammatory/infectious cardiac conditions",
      "12-lead ECG: assess rhythm, intervals, ST-T changes, axis deviation"
    ],
    management: [
      "Loop diuretics titrated to euvolemia based on daily weights",
      "Weight monitoring: report gain >2 lbs/day or >5 lbs/week",
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "Referral for surgical intervention when medical therapy insufficient",
      "Dual antiplatelet therapy (DAPT) post-ACS or PCI for 6-12 months",
      "Structured exercise program: 150 min/week moderate-intensity aerobic",
      "Guideline-directed medical therapy per ACC/AHA recommendations"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Chest pain or pressure",
        "Dyspnea on exertion or at rest",
        "Palpitations or irregular heartbeat",
        "Syncope or near-syncope"
      ],
      right: [
        "Jugular venous distension",
        "Bilateral lower extremity edema",
        "Hepatomegaly with hepatojugular reflux",
        "Abnormal heart sounds (murmur, gallop, rub)"
      ]
    },
    medications: [
      {
        name: "Spironolactone (Aldactone)",
        type: "Mineralocorticoid Receptor Antagonist",
        action: "Competitively blocks aldosterone at collecting duct; reduces sodium retention, fibrosis, and remodeling",
        sideEffects: "Hyperkalemia, gynecomastia, breast tenderness, menstrual irregularity",
        contra: "K+ >5.0 mEq/L, eGFR <30, concurrent K+-sparing diuretics, Addison disease",
        pearl: "HF: 25mg daily. RALES: 30% mortality reduction. Check K+ at 3 days and 1 week. Switch to eplerenone if gynecomastia."
      },
      {
        name: "Nitroglycerin (NTG)",
        type: "Organic Nitrate",
        action: "Releases NO causing venodilation (reduces preload) and coronary vasodilation",
        sideEffects: "Headache, hypotension, reflex tachycardia, tolerance with continuous use",
        contra: "SBP <90, RV infarction, concurrent PDE5 inhibitor (sildenafil within 24h, tadalafil within 48h)",
        pearl: "SL: 0.4mg q5min x3 for angina. IV: start 5mcg/min, titrate by 5mcg q3-5min. Nitrate-free interval 10-14h."
      }
    ],
    pearls: [
      "Target LDL <70 mg/dL for established ASCVD (consider <55 for very high risk)",
      "BNP can be falsely low in obesity; use NT-proBNP cutoffs adjusted for age and BMI",
      "DOACs preferred over warfarin for non-valvular AF; warfarin still required for mechanical valves"
    ],
    quiz: [
      {
        question: "Which diagnostic finding is most specific for acute decompensation in cholesterol embolization syndrome?",
        options: [
          "Normal chest X-ray",
          "BNP 50 pg/mL",
          "Elevated troponin with ECG changes",
          "Normal echocardiogram"
        ],
        correct: 2,
        rationale: "Elevated troponin with ECG changes indicates myocardial injury requiring urgent evaluation in the context of cholesterol embolization syndrome."
      }
    ]
  },
  "effusive-constrictive-pericarditis-np": {
    title: "Effusive-Constrictive Pericarditis",
    cellular: {
      title: "Pathophysiology of Effusive-Constrictive Pericarditis",
      content: "Effusive-Constrictive Pericarditis involves specific alterations in effusive-constrictive pericarditis physiology. The pathophysiology of Effusive-Constrictive Pericarditis encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of effusive-constrictive pericarditis."
    },
    riskFactors: [
      "Dyslipidemia (LDL >130 despite lifestyle modification)",
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Atrial fibrillation or flutter with rapid ventricular rate",
      "Peripheral artery disease (ABI <0.9)",
      "Chronic hypertension with end-organ damage",
      "Chronic inflammatory conditions (RA, SLE, psoriasis)",
      "Hypercoagulable states (Factor V Leiden, antiphospholipid)"
    ],
    diagnostics: [
      "CBC with differential (anemia worsens cardiac ischemia)",
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "Stress testing (exercise or pharmacologic) with nuclear or echo imaging",
      "TEE for valvular vegetation, intracardiac thrombus, PFO assessment",
      "12-lead ECG: assess rhythm, intervals, ST-T changes, axis deviation",
      "Chest X-ray: cardiac silhouette, pulmonary vascularity, effusions",
      "Ambulatory blood pressure monitoring for white coat vs masked HTN"
    ],
    management: [
      "Dual antiplatelet therapy (DAPT) post-ACS or PCI for 6-12 months",
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "Smoking cessation: varenicline or NRT plus behavioral counseling",
      "Rate vs rhythm control strategy for atrial fibrillation management",
      "Guideline-directed medical therapy per ACC/AHA recommendations",
      "CRT for EF <=35% with LBBB and QRS >=150ms",
      "Referral for surgical intervention when medical therapy insufficient"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Acute onset severe chest pain",
        "Dyspnea with hemoptysis",
        "Pre-syncope with positional changes",
        "Fatigue disproportionate to activity level"
      ],
      right: [
        "Tachycardia with narrow or wide complex",
        "New S3 or S4 heart sounds",
        "Bilateral crackles on auscultation",
        "Elevated JVP with Kussmaul sign"
      ]
    },
    medications: [
      {
        name: "Furosemide (Lasix)",
        type: "Loop Diuretic",
        action: "Inhibits Na-K-2Cl cotransporter in thick ascending limb of Henle reducing sodium and water reabsorption",
        sideEffects: "Hypokalemia, hyponatremia, ototoxicity, hyperuricemia, dehydration",
        contra: "Anuria, hepatic coma, severe electrolyte depletion",
        pearl: "IV:PO ratio 1:2 (40mg IV = 80mg PO). Ceiling dose 160-200mg IV. Monitor K+ and Mg2+."
      },
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "ARNI",
        action: "Dual inhibition: sacubitril inhibits neprilysin (increases natriuretic peptides); valsartan blocks AT1 receptors",
        sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment, dizziness",
        contra: "ACEi angioedema history, concurrent ACEi (36h washout), pregnancy",
        pearl: "PARADIGM-HF: 20% CV death reduction. Start 24/26mg BID, titrate to 97/103mg BID over 2-4 weeks."
      }
    ],
    pearls: [
      "DOACs preferred over warfarin for non-valvular AF; warfarin still required for mechanical valves",
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status",
      "ACC/AHA guidelines recommend ASCVD risk calculator for primary prevention decisions"
    ],
    quiz: [
      {
        question: "A patient with effusive-constrictive pericarditis on lisinopril develops dry cough. K+ 4.8, Cr 1.1. Best alternative?",
        options: [
          "Losartan 50mg daily",
          "Double lisinopril dose",
          "Add hydrochlorothiazide",
          "Switch to spironolactone"
        ],
        correct: 0,
        rationale: "ARBs (losartan) are first-line alternatives for ACEi-induced cough. They block AT1 receptors without increasing bradykinin."
      }
    ]
  },
  "libman-sacks-endocarditis-np": {
    title: "Libman-Sacks Endocarditis: SLE-Associated",
    cellular: {
      title: "Pathophysiology of Libman-Sacks Endocarditis",
      content: "Libman-Sacks Endocarditis: SLE-Associated involves specific alterations in libman-sacks endocarditis physiology. The pathophysiology of Libman-Sacks Endocarditis encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of libman-sacks endocarditis."
    },
    riskFactors: [
      "Heavy alcohol use (>14 drinks/week males, >7 females)",
      "Diabetes mellitus type 2 with HbA1c >7%",
      "Left ventricular hypertrophy on ECG or echo",
      "Coronary artery disease with prior MI or PCI",
      "Obstructive sleep apnea (AHI >15 events/hr)",
      "Dyslipidemia (LDL >130 despite lifestyle modification)",
      "Tobacco use (pack-year dependent risk calculation)"
    ],
    diagnostics: [
      "Coagulation studies: PT/INR, aPTT, D-dimer",
      "BNP >100 pg/mL or NT-proBNP >300 pg/mL for volume overload assessment",
      "CRP and ESR for inflammatory/infectious cardiac conditions",
      "Troponin I or T serial measurements (0h, 3h, 6h) for myocardial injury",
      "Cardiac catheterization: coronary anatomy, hemodynamic measurements",
      "CBC with differential (anemia worsens cardiac ischemia)",
      "BMP including potassium, magnesium, calcium for arrhythmia workup"
    ],
    management: [
      "Anticoagulation: DOACs preferred over warfarin for non-valvular AF",
      "Antiplatelet therapy: aspirin 81mg daily for established ASCVD",
      "Structured exercise program: 150 min/week moderate-intensity aerobic",
      "Blood pressure target <130/80 mmHg (ACC/AHA 2017 guidelines)",
      "Cardiac rehabilitation referral (Phase I-III) for functional recovery",
      "Dual antiplatelet therapy (DAPT) post-ACS or PCI for 6-12 months",
      "Beta-blocker titration to resting HR 60-70 bpm"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Substernal chest tightness radiating to arm/jaw",
        "Progressive exercise intolerance",
        "Orthopnea requiring elevated sleeping position",
        "Diaphoresis with exertional symptoms"
      ],
      right: [
        "Peripheral cyanosis or pallor",
        "Blood pressure asymmetry",
        "Altered peripheral pulses",
        "New cardiac murmur or changed murmur character"
      ]
    },
    medications: [
      {
        name: "Amlodipine (Norvasc)",
        type: "Dihydropyridine CCB",
        action: "Blocks L-type calcium channels in vascular smooth muscle causing vasodilation",
        sideEffects: "Peripheral edema (dose-dependent), flushing, headache, gingival hyperplasia",
        contra: "Severe aortic stenosis, cardiogenic shock, unstable angina (use with caution)",
        pearl: "Start 5mg daily, max 10mg. Safe in HFpEF. Edema is dose-related, not allergic."
      },
      {
        name: "Furosemide (Lasix)",
        type: "Loop Diuretic",
        action: "Inhibits Na-K-2Cl cotransporter in thick ascending limb of Henle reducing sodium and water reabsorption",
        sideEffects: "Hypokalemia, hyponatremia, ototoxicity, hyperuricemia, dehydration",
        contra: "Anuria, hepatic coma, severe electrolyte depletion",
        pearl: "IV:PO ratio 1:2 (40mg IV = 80mg PO). Ceiling dose 160-200mg IV. Monitor K+ and Mg2+."
      }
    ],
    pearls: [
      "Beta-blockers reduce mortality in HFrEF but NOT in HFpEF",
      "DOACs preferred over warfarin for non-valvular AF; warfarin still required for mechanical valves",
      "BNP can be falsely low in obesity; use NT-proBNP cutoffs adjusted for age and BMI"
    ],
    quiz: [
      {
        question: "Which diagnostic finding is most specific for acute decompensation in libman-sacks endocarditis?",
        options: [
          "Normal chest X-ray",
          "BNP 50 pg/mL",
          "Elevated troponin with ECG changes",
          "Normal echocardiogram"
        ],
        correct: 2,
        rationale: "Elevated troponin with ECG changes indicates myocardial injury requiring urgent evaluation in the context of libman-sacks endocarditis."
      }
    ]
  },
  "endomyocardial-fibrosis-np": {
    title: "Endomyocardial Fibrosis: Tropical",
    cellular: {
      title: "Pathophysiology of Endomyocardial Fibrosis",
      content: "Endomyocardial Fibrosis: Tropical involves specific alterations in endomyocardial fibrosis physiology. The pathophysiology of Endomyocardial Fibrosis encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of endomyocardial fibrosis."
    },
    riskFactors: [
      "Atrial fibrillation or flutter with rapid ventricular rate",
      "Chronic hypertension with end-organ damage",
      "Hypercoagulable states (Factor V Leiden, antiphospholipid)",
      "History of preeclampsia or gestational hypertension",
      "Family history of premature CVD (<55 males, <65 females)",
      "Coronary artery disease with prior MI or PCI",
      "Age >65 with cardiovascular degeneration"
    ],
    diagnostics: [
      "Stress testing (exercise or pharmacologic) with nuclear or echo imaging",
      "12-lead ECG: assess rhythm, intervals, ST-T changes, axis deviation",
      "Ambulatory blood pressure monitoring for white coat vs masked HTN",
      "HbA1c for glycemic control assessment in diabetic patients",
      "Lipid panel: total cholesterol, LDL, HDL, triglycerides",
      "Troponin I or T serial measurements (0h, 3h, 6h) for myocardial injury",
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions"
    ],
    management: [
      "Smoking cessation: varenicline or NRT plus behavioral counseling",
      "Guideline-directed medical therapy per ACC/AHA recommendations",
      "Referral for surgical intervention when medical therapy insufficient",
      "Weight monitoring: report gain >2 lbs/day or >5 lbs/week",
      "ACEi/ARB for patients with HFrEF, post-MI, or diabetic nephropathy",
      "Blood pressure target <130/80 mmHg (ACC/AHA 2017 guidelines)",
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Chest pain or pressure",
        "Dyspnea on exertion or at rest",
        "Palpitations or irregular heartbeat",
        "Syncope or near-syncope"
      ],
      right: [
        "Jugular venous distension",
        "Bilateral lower extremity edema",
        "Hepatomegaly with hepatojugular reflux",
        "Abnormal heart sounds (murmur, gallop, rub)"
      ]
    },
    medications: [
      {
        name: "Metoprolol Succinate (Toprol-XL)",
        type: "Beta-1 Selective Blocker",
        action: "Selectively blocks cardiac beta-1 receptors reducing heart rate, contractility, and myocardial oxygen demand",
        sideEffects: "Bradycardia, hypotension, fatigue, depression, bronchospasm",
        contra: "Severe bradycardia <50 bpm, decompensated HF, cardiogenic shock, 2nd/3rd degree AV block",
        pearl: "Start 25mg daily, titrate every 2 weeks. Target 200mg daily. Do NOT discontinue abruptly."
      },
      {
        name: "Lisinopril (Zestril/Prinivil)",
        type: "ACE Inhibitor",
        action: "Inhibits ACE converting angiotensin I to II; reduces preload, afterload, and cardiac remodeling",
        sideEffects: "Dry cough (10-15%), hyperkalemia, angioedema (0.1-0.7%), acute kidney injury",
        contra: "History of ACEi angioedema, bilateral renal artery stenosis, pregnancy",
        pearl: "Start 5-10mg daily, titrate to 20-40mg. Check K+ and Cr within 1-2 weeks of initiation."
      }
    ],
    pearls: [
      "ACC/AHA guidelines recommend ASCVD risk calculator for primary prevention decisions",
      "Troponin elevation without ACS: consider PE, myocarditis, Takotsubo, renal failure, sepsis",
      "Avoid NSAIDs in heart failure (fluid retention) and post-ACS (increased CV events)"
    ],
    quiz: [
      {
        question: "A 65-year-old with endomyocardial fibrosis presents with dyspnea, JVD, and bilateral crackles. BNP 850 pg/mL. Which initial intervention is most appropriate?",
        options: [
          "IV furosemide 40mg and continuous monitoring",
          "Immediate cardiac catheterization",
          "Start amiodarone drip",
          "Discharge with PCP follow-up in 2 weeks"
        ],
        correct: 0,
        rationale: "IV furosemide addresses acute volume overload in endomyocardial fibrosis with continuous monitoring for response."
      }
    ]
  },
  "culture-negative-ie-np": {
    title: "Culture-Negative Infective Endocarditis",
    cellular: {
      title: "Pathophysiology of Culture-Negative Infective Endocarditis",
      content: "Culture-Negative Infective Endocarditis involves specific alterations in culture-negative infective endocarditis physiology. The pathophysiology of Culture-Negative Infective Endocarditis encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of culture-negative infective endocarditis."
    },
    riskFactors: [
      "Family history of premature CVD (<55 males, <65 females)",
      "Hypercoagulable states (Factor V Leiden, antiphospholipid)",
      "Peripheral artery disease (ABI <0.9)",
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Age >65 with cardiovascular degeneration",
      "Sedentary lifestyle with deconditioning",
      "History of preeclampsia or gestational hypertension"
    ],
    diagnostics: [
      "Lipid panel: total cholesterol, LDL, HDL, triglycerides",
      "Ambulatory blood pressure monitoring for white coat vs masked HTN",
      "TEE for valvular vegetation, intracardiac thrombus, PFO assessment",
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions",
      "Ankle-brachial index for peripheral vascular disease screening",
      "HbA1c for glycemic control assessment in diabetic patients"
    ],
    management: [
      "ACEi/ARB for patients with HFrEF, post-MI, or diabetic nephropathy",
      "Referral for surgical intervention when medical therapy insufficient",
      "Rate vs rhythm control strategy for atrial fibrillation management",
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)",
      "Fluid restriction 1.5-2L/day for hyponatremia or severe HF",
      "Weight monitoring: report gain >2 lbs/day or >5 lbs/week"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Substernal chest tightness radiating to arm/jaw",
        "Progressive exercise intolerance",
        "Orthopnea requiring elevated sleeping position",
        "Diaphoresis with exertional symptoms"
      ],
      right: [
        "Peripheral cyanosis or pallor",
        "Blood pressure asymmetry",
        "Altered peripheral pulses",
        "New cardiac murmur or changed murmur character"
      ]
    },
    medications: [
      {
        name: "Apixaban (Eliquis)",
        type: "Direct Factor Xa Inhibitor",
        action: "Selectively and reversibly inhibits Factor Xa preventing thrombin generation and clot formation",
        sideEffects: "Bleeding (major GI, intracranial); reversal agent: andexanet alfa",
        contra: "Active pathological bleeding, prosthetic mechanical heart valve, severe hepatic impairment",
        pearl: "Standard: 5mg BID. Reduce to 2.5mg BID if >=2 of: age >=80, weight <=60kg, Cr >=1.5 mg/dL."
      },
      {
        name: "Carvedilol (Coreg)",
        type: "Non-selective Beta + Alpha-1 Blocker",
        action: "Blocks beta-1, beta-2, and alpha-1 adrenergic receptors; antioxidant properties",
        sideEffects: "Bradycardia, hypotension, dizziness, weight gain, bronchospasm, fatigue",
        contra: "Decompensated HF, SBP <90, HR <55, 2nd/3rd degree AV block, severe asthma/COPD",
        pearl: "HF dose: start 3.125mg BID, target 25mg BID. COPERNICUS: 35% mortality reduction. Take with food."
      }
    ],
    pearls: [
      "Avoid NSAIDs in heart failure (fluid retention) and post-ACS (increased CV events)",
      "Right-sided MI: volume-dependent; avoid nitrates and diuretics, give IV fluids",
      "New LBBB + chest pain: treat as STEMI equivalent until proven otherwise"
    ],
    quiz: [
      {
        question: "A patient with history of culture-negative infective endocarditis has HR 52, BP 88/54 on metoprolol 100mg BID. Best next step?",
        options: [
          "Increase metoprolol dose",
          "Hold metoprolol and reassess hemodynamics",
          "Add digoxin",
          "Start dobutamine drip"
        ],
        correct: 1,
        rationale: "Symptomatic bradycardia and hypotension suggest beta-blocker excess. Hold the medication and reassess before adjusting."
      }
    ]
  },
  "cardiac-tamponade-np": {
    title: "Cardiac Tamponade: Pericardiocentesis",
    cellular: {
      title: "Pathophysiology of Cardiac Tamponade",
      content: "Cardiac Tamponade: Pericardiocentesis involves specific alterations in cardiac tamponade physiology. The pathophysiology of Cardiac Tamponade encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of cardiac tamponade."
    },
    riskFactors: [
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Dyslipidemia (LDL >130 despite lifestyle modification)",
      "Chronic hypertension with end-organ damage",
      "Age >65 with cardiovascular degeneration",
      "Atrial fibrillation or flutter with rapid ventricular rate",
      "Tobacco use (pack-year dependent risk calculation)",
      "Family history of premature CVD (<55 males, <65 females)"
    ],
    diagnostics: [
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "CBC with differential (anemia worsens cardiac ischemia)",
      "12-lead ECG: assess rhythm, intervals, ST-T changes, axis deviation",
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions",
      "Stress testing (exercise or pharmacologic) with nuclear or echo imaging",
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "Lipid panel: total cholesterol, LDL, HDL, triglycerides"
    ],
    management: [
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "Dual antiplatelet therapy (DAPT) post-ACS or PCI for 6-12 months",
      "Guideline-directed medical therapy per ACC/AHA recommendations",
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)",
      "Smoking cessation: varenicline or NRT plus behavioral counseling",
      "Beta-blocker titration to resting HR 60-70 bpm",
      "ACEi/ARB for patients with HFrEF, post-MI, or diabetic nephropathy"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Chest pain or pressure",
        "Dyspnea on exertion or at rest",
        "Palpitations or irregular heartbeat",
        "Syncope or near-syncope"
      ],
      right: [
        "Jugular venous distension",
        "Bilateral lower extremity edema",
        "Hepatomegaly with hepatojugular reflux",
        "Abnormal heart sounds (murmur, gallop, rub)"
      ]
    },
    medications: [
      {
        name: "Furosemide (Lasix)",
        type: "Loop Diuretic",
        action: "Inhibits Na-K-2Cl cotransporter in thick ascending limb of Henle reducing sodium and water reabsorption",
        sideEffects: "Hypokalemia, hyponatremia, ototoxicity, hyperuricemia, dehydration",
        contra: "Anuria, hepatic coma, severe electrolyte depletion",
        pearl: "IV:PO ratio 1:2 (40mg IV = 80mg PO). Ceiling dose 160-200mg IV. Monitor K+ and Mg2+."
      },
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "ARNI",
        action: "Dual inhibition: sacubitril inhibits neprilysin (increases natriuretic peptides); valsartan blocks AT1 receptors",
        sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment, dizziness",
        contra: "ACEi angioedema history, concurrent ACEi (36h washout), pregnancy",
        pearl: "PARADIGM-HF: 20% CV death reduction. Start 24/26mg BID, titrate to 97/103mg BID over 2-4 weeks."
      }
    ],
    pearls: [
      "DOACs preferred over warfarin for non-valvular AF; warfarin still required for mechanical valves",
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status",
      "ACC/AHA guidelines recommend ASCVD risk calculator for primary prevention decisions"
    ],
    quiz: [
      {
        question: "A patient with cardiac tamponade on lisinopril develops dry cough. K+ 4.8, Cr 1.1. Best alternative?",
        options: [
          "Losartan 50mg daily",
          "Double lisinopril dose",
          "Add hydrochlorothiazide",
          "Switch to spironolactone"
        ],
        correct: 0,
        rationale: "ARBs (losartan) are first-line alternatives for ACEi-induced cough. They block AT1 receptors without increasing bradykinin."
      }
    ]
  },
  "aortic-dissection-np": {
    title: "Aortic Dissection: Stanford Classification",
    cellular: {
      title: "Pathophysiology of Aortic Dissection",
      content: "Aortic Dissection: Stanford Classification involves specific alterations in aortic dissection physiology. The pathophysiology of Aortic Dissection encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of aortic dissection."
    },
    riskFactors: [
      "Age >65 with cardiovascular degeneration",
      "Peripheral artery disease (ABI <0.9)",
      "Chronic kidney disease (eGFR <60 mL/min)",
      "Atrial fibrillation or flutter with rapid ventricular rate",
      "History of preeclampsia or gestational hypertension",
      "Heavy alcohol use (>14 drinks/week males, >7 females)",
      "Cocaine or amphetamine use causing coronary vasospasm"
    ],
    diagnostics: [
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions",
      "TEE for valvular vegetation, intracardiac thrombus, PFO assessment",
      "Cardiac MRI for tissue characterization (edema, fibrosis, infiltration)",
      "Stress testing (exercise or pharmacologic) with nuclear or echo imaging",
      "HbA1c for glycemic control assessment in diabetic patients",
      "Coagulation studies: PT/INR, aPTT, D-dimer",
      "Thyroid function tests (hyperthyroidism causes high-output states)"
    ],
    management: [
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)",
      "Rate vs rhythm control strategy for atrial fibrillation management",
      "Loop diuretics titrated to euvolemia based on daily weights",
      "Smoking cessation: varenicline or NRT plus behavioral counseling",
      "Weight monitoring: report gain >2 lbs/day or >5 lbs/week",
      "Anticoagulation: DOACs preferred over warfarin for non-valvular AF",
      "ICD placement for EF <=35% despite 3 months optimal medical therapy"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Acute onset severe chest pain",
        "Dyspnea with hemoptysis",
        "Pre-syncope with positional changes",
        "Fatigue disproportionate to activity level"
      ],
      right: [
        "Tachycardia with narrow or wide complex",
        "New S3 or S4 heart sounds",
        "Bilateral crackles on auscultation",
        "Elevated JVP with Kussmaul sign"
      ]
    },
    medications: [
      {
        name: "Atorvastatin (Lipitor)",
        type: "HMG-CoA Reductase Inhibitor",
        action: "Inhibits cholesterol synthesis, upregulates LDL receptors; pleiotropic anti-inflammatory and plaque-stabilizing effects",
        sideEffects: "Myalgia, elevated transaminases, new-onset diabetes",
        contra: "Active liver disease, pregnancy, unexplained persistent LFT elevation",
        pearl: "High-intensity: 40-80mg daily. Reduces LDL by 50%. Check CK only if symptomatic myopathy."
      },
      {
        name: "Amlodipine (Norvasc)",
        type: "Dihydropyridine CCB",
        action: "Blocks L-type calcium channels in vascular smooth muscle causing vasodilation",
        sideEffects: "Peripheral edema (dose-dependent), flushing, headache, gingival hyperplasia",
        contra: "Severe aortic stenosis, cardiogenic shock, unstable angina (use with caution)",
        pearl: "Start 5mg daily, max 10mg. Safe in HFpEF. Edema is dose-related, not allergic."
      }
    ],
    pearls: [
      "New LBBB + chest pain: treat as STEMI equivalent until proven otherwise",
      "Beta-blockers reduce mortality in HFrEF but NOT in HFpEF",
      "Target LDL <70 mg/dL for established ASCVD (consider <55 for very high risk)"
    ],
    quiz: [
      {
        question: "A 58-year-old with aortic dissection has LDL 145, diabetes, and HTN. Best lipid management?",
        options: [
          "Lifestyle modification only for 6 months",
          "Moderate-intensity statin",
          "High-intensity statin (atorvastatin 40-80mg)",
          "Ezetimibe monotherapy"
        ],
        correct: 2,
        rationale: "With multiple ASCVD risk factors and aortic dissection, high-intensity statin therapy is indicated per ACC/AHA guidelines."
      }
    ]
  },
  "pulmonary-embolism-np": {
    title: "Pulmonary Embolism: Wells Criteria",
    cellular: {
      title: "Pathophysiology of Pulmonary Embolism",
      content: "Pulmonary Embolism: Wells Criteria involves specific alterations in pulmonary embolism physiology. The pathophysiology of Pulmonary Embolism encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of pulmonary embolism."
    },
    riskFactors: [
      "Obstructive sleep apnea (AHI >15 events/hr)",
      "Left ventricular hypertrophy on ECG or echo",
      "Chronic inflammatory conditions (RA, SLE, psoriasis)",
      "Sedentary lifestyle with deconditioning",
      "Tobacco use (pack-year dependent risk calculation)",
      "Chronic hypertension with end-organ damage",
      "Coronary artery disease with prior MI or PCI"
    ],
    diagnostics: [
      "Cardiac catheterization: coronary anatomy, hemodynamic measurements",
      "CRP and ESR for inflammatory/infectious cardiac conditions",
      "Chest X-ray: cardiac silhouette, pulmonary vascularity, effusions",
      "Ankle-brachial index for peripheral vascular disease screening",
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "12-lead ECG: assess rhythm, intervals, ST-T changes, axis deviation",
      "Troponin I or T serial measurements (0h, 3h, 6h) for myocardial injury"
    ],
    management: [
      "Cardiac rehabilitation referral (Phase I-III) for functional recovery",
      "Structured exercise program: 150 min/week moderate-intensity aerobic",
      "CRT for EF <=35% with LBBB and QRS >=150ms",
      "Fluid restriction 1.5-2L/day for hyponatremia or severe HF",
      "Beta-blocker titration to resting HR 60-70 bpm",
      "Guideline-directed medical therapy per ACC/AHA recommendations",
      "Blood pressure target <130/80 mmHg (ACC/AHA 2017 guidelines)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Chest pain or pressure",
        "Dyspnea on exertion or at rest",
        "Palpitations or irregular heartbeat",
        "Syncope or near-syncope"
      ],
      right: [
        "Jugular venous distension",
        "Bilateral lower extremity edema",
        "Hepatomegaly with hepatojugular reflux",
        "Abnormal heart sounds (murmur, gallop, rub)"
      ]
    },
    medications: [
      {
        name: "Nitroglycerin (NTG)",
        type: "Organic Nitrate",
        action: "Releases NO causing venodilation (reduces preload) and coronary vasodilation",
        sideEffects: "Headache, hypotension, reflex tachycardia, tolerance with continuous use",
        contra: "SBP <90, RV infarction, concurrent PDE5 inhibitor (sildenafil within 24h, tadalafil within 48h)",
        pearl: "SL: 0.4mg q5min x3 for angina. IV: start 5mcg/min, titrate by 5mcg q3-5min. Nitrate-free interval 10-14h."
      },
      {
        name: "Metoprolol Succinate (Toprol-XL)",
        type: "Beta-1 Selective Blocker",
        action: "Selectively blocks cardiac beta-1 receptors reducing heart rate, contractility, and myocardial oxygen demand",
        sideEffects: "Bradycardia, hypotension, fatigue, depression, bronchospasm",
        contra: "Severe bradycardia <50 bpm, decompensated HF, cardiogenic shock, 2nd/3rd degree AV block",
        pearl: "Start 25mg daily, titrate every 2 weeks. Target 200mg daily. Do NOT discontinue abruptly."
      }
    ],
    pearls: [
      "BNP can be falsely low in obesity; use NT-proBNP cutoffs adjusted for age and BMI",
      "ACC/AHA guidelines recommend ASCVD risk calculator for primary prevention decisions",
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status"
    ],
    quiz: [
      {
        question: "A patient with pulmonary embolism on lisinopril develops dry cough. K+ 4.8, Cr 1.1. Best alternative?",
        options: [
          "Losartan 50mg daily",
          "Double lisinopril dose",
          "Add hydrochlorothiazide",
          "Switch to spironolactone"
        ],
        correct: 0,
        rationale: "ARBs (losartan) are first-line alternatives for ACEi-induced cough. They block AT1 receptors without increasing bradykinin."
      }
    ]
  },
  "fat-embolism-np": {
    title: "Fat Embolism: Gurd's Criteria",
    cellular: {
      title: "Pathophysiology of Fat Embolism",
      content: "Fat Embolism: Gurd's Criteria involves specific alterations in fat embolism physiology. The pathophysiology of Fat Embolism encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of fat embolism."
    },
    riskFactors: [
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Dyslipidemia (LDL >130 despite lifestyle modification)",
      "Chronic hypertension with end-organ damage",
      "Age >65 with cardiovascular degeneration",
      "Atrial fibrillation or flutter with rapid ventricular rate",
      "Tobacco use (pack-year dependent risk calculation)",
      "Family history of premature CVD (<55 males, <65 females)"
    ],
    diagnostics: [
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "CBC with differential (anemia worsens cardiac ischemia)",
      "12-lead ECG: assess rhythm, intervals, ST-T changes, axis deviation",
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions",
      "Stress testing (exercise or pharmacologic) with nuclear or echo imaging",
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "Lipid panel: total cholesterol, LDL, HDL, triglycerides"
    ],
    management: [
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "Dual antiplatelet therapy (DAPT) post-ACS or PCI for 6-12 months",
      "Guideline-directed medical therapy per ACC/AHA recommendations",
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)",
      "Smoking cessation: varenicline or NRT plus behavioral counseling",
      "Beta-blocker titration to resting HR 60-70 bpm",
      "ACEi/ARB for patients with HFrEF, post-MI, or diabetic nephropathy"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Acute onset severe chest pain",
        "Dyspnea with hemoptysis",
        "Pre-syncope with positional changes",
        "Fatigue disproportionate to activity level"
      ],
      right: [
        "Tachycardia with narrow or wide complex",
        "New S3 or S4 heart sounds",
        "Bilateral crackles on auscultation",
        "Elevated JVP with Kussmaul sign"
      ]
    },
    medications: [
      {
        name: "Furosemide (Lasix)",
        type: "Loop Diuretic",
        action: "Inhibits Na-K-2Cl cotransporter in thick ascending limb of Henle reducing sodium and water reabsorption",
        sideEffects: "Hypokalemia, hyponatremia, ototoxicity, hyperuricemia, dehydration",
        contra: "Anuria, hepatic coma, severe electrolyte depletion",
        pearl: "IV:PO ratio 1:2 (40mg IV = 80mg PO). Ceiling dose 160-200mg IV. Monitor K+ and Mg2+."
      },
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "ARNI",
        action: "Dual inhibition: sacubitril inhibits neprilysin (increases natriuretic peptides); valsartan blocks AT1 receptors",
        sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment, dizziness",
        contra: "ACEi angioedema history, concurrent ACEi (36h washout), pregnancy",
        pearl: "PARADIGM-HF: 20% CV death reduction. Start 24/26mg BID, titrate to 97/103mg BID over 2-4 weeks."
      }
    ],
    pearls: [
      "DOACs preferred over warfarin for non-valvular AF; warfarin still required for mechanical valves",
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status",
      "ACC/AHA guidelines recommend ASCVD risk calculator for primary prevention decisions"
    ],
    quiz: [
      {
        question: "A patient with fat embolism on lisinopril develops dry cough. K+ 4.8, Cr 1.1. Best alternative?",
        options: [
          "Losartan 50mg daily",
          "Double lisinopril dose",
          "Add hydrochlorothiazide",
          "Switch to spironolactone"
        ],
        correct: 0,
        rationale: "ARBs (losartan) are first-line alternatives for ACEi-induced cough. They block AT1 receptors without increasing bradykinin."
      }
    ]
  },
  "asthma-emergency-np": {
    title: "Status Asthmaticus: Advanced Mgmt",
    cellular: {
      title: "Pathophysiology of Status Asthmaticus",
      content: "Asthma is chronic inflammatory disease driven by Th2 immune response producing IL-4 (IgE switching), IL-5 (eosinophil recruitment), IL-13 (mucus, hyperresponsiveness). IgE cross-linking triggers mast cell degranulation. Stepwise therapy: Step 1-2 = PRN ICS-formoterol; Step 3 = low-dose ICS-LABA; Step 4-5 = medium-high ICS-LABA +/- LAMA +/- biologic."
    },
    riskFactors: [
      "Immunocompromised state increasing pneumonia susceptibility",
      "Occupational dust/chemical exposure (asbestos, silica, coal)",
      "Indoor air pollution and biomass fuel exposure",
      "GERD with chronic microaspiration",
      "Age >65 with declining mucociliary clearance",
      "Cystic fibrosis genotype (CFTR mutations)",
      "Environmental allergen sensitization (dust mites, mold, pollen)"
    ],
    diagnostics: [
      "Sputum culture, Gram stain, and AFB stain",
      "ABG: pH, PaCO2, PaO2, HCO3, A-a gradient calculation",
      "Chest X-ray PA and lateral (infiltrates, hyperinflation, effusions)",
      "D-dimer (high sensitivity, low specificity for PE)",
      "Peak expiratory flow rate monitoring for asthma",
      "Procalcitonin for bacterial vs viral pneumonia differentiation",
      "Bronchoscopy with BAL for diagnostic sampling"
    ],
    management: [
      "Non-invasive ventilation (BiPAP) for COPD exacerbation with respiratory acidosis",
      "Albuterol nebulizer 2.5mg q4-6h PRN for bronchospasm",
      "ICS/LABA combination (fluticasone/salmeterol) for persistent asthma",
      "Pulmonary rehabilitation for COPD (GOLD B-D) and post-hospitalization",
      "Mechanical ventilation with lung-protective strategy (Vt 6-8 mL/kg IBW, Pplat <30)",
      "Annual influenza and pneumococcal vaccination",
      "Chest tube placement for pneumothorax or empyema drainage"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Fluticasone/Salmeterol (Advair)",
        type: "ICS/LABA Combination",
        action: "Fluticasone suppresses airway inflammation; salmeterol provides sustained bronchodilation via beta-2 agonism",
        sideEffects: "Oral candidiasis, dysphonia, adrenal suppression, pneumonia risk in COPD",
        contra: "Acute bronchospasm (not a rescue inhaler), severe milk protein allergy (Diskus)",
        pearl: "Rinse mouth after use to prevent thrush. LABA monotherapy contraindicated in asthma (BLACK BOX resolved with ICS combination)."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces eosinophilic infiltration and mucus production",
        sideEffects: "Hyperglycemia, insomnia, mood changes, osteoporosis, adrenal suppression, weight gain",
        contra: "Active untreated infection, live vaccines during therapy",
        pearl: "COPD exacerbation: 40mg x 5 days (REDUCE trial). Asthma exacerbation: 40-60mg x 5-7 days. Taper if >14 days use."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Status Asthmaticus management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with status asthmaticus develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for status asthmaticus."
      }
    ]
  },
  "pe-recognition-np": {
    title: "PE: Wells Criteria & Thrombolysis",
    cellular: {
      title: "Pathophysiology of PE",
      content: "PE: Wells Criteria & Thrombolysis involves specific alterations in pe physiology. The pathophysiology of PE encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of pe."
    },
    riskFactors: [
      "Dyslipidemia (LDL >130 despite lifestyle modification)",
      "Cocaine or amphetamine use causing coronary vasospasm",
      "Atrial fibrillation or flutter with rapid ventricular rate",
      "Peripheral artery disease (ABI <0.9)",
      "Chronic hypertension with end-organ damage",
      "Chronic inflammatory conditions (RA, SLE, psoriasis)",
      "Hypercoagulable states (Factor V Leiden, antiphospholipid)"
    ],
    diagnostics: [
      "CBC with differential (anemia worsens cardiac ischemia)",
      "Thyroid function tests (hyperthyroidism causes high-output states)",
      "Stress testing (exercise or pharmacologic) with nuclear or echo imaging",
      "TEE for valvular vegetation, intracardiac thrombus, PFO assessment",
      "12-lead ECG: assess rhythm, intervals, ST-T changes, axis deviation",
      "Chest X-ray: cardiac silhouette, pulmonary vascularity, effusions",
      "Ambulatory blood pressure monitoring for white coat vs masked HTN"
    ],
    management: [
      "Dual antiplatelet therapy (DAPT) post-ACS or PCI for 6-12 months",
      "ICD placement for EF <=35% despite 3 months optimal medical therapy",
      "Smoking cessation: varenicline or NRT plus behavioral counseling",
      "Rate vs rhythm control strategy for atrial fibrillation management",
      "Guideline-directed medical therapy per ACC/AHA recommendations",
      "CRT for EF <=35% with LBBB and QRS >=150ms",
      "Referral for surgical intervention when medical therapy insufficient"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Substernal chest tightness radiating to arm/jaw",
        "Progressive exercise intolerance",
        "Orthopnea requiring elevated sleeping position",
        "Diaphoresis with exertional symptoms"
      ],
      right: [
        "Peripheral cyanosis or pallor",
        "Blood pressure asymmetry",
        "Altered peripheral pulses",
        "New cardiac murmur or changed murmur character"
      ]
    },
    medications: [
      {
        name: "Furosemide (Lasix)",
        type: "Loop Diuretic",
        action: "Inhibits Na-K-2Cl cotransporter in thick ascending limb of Henle reducing sodium and water reabsorption",
        sideEffects: "Hypokalemia, hyponatremia, ototoxicity, hyperuricemia, dehydration",
        contra: "Anuria, hepatic coma, severe electrolyte depletion",
        pearl: "IV:PO ratio 1:2 (40mg IV = 80mg PO). Ceiling dose 160-200mg IV. Monitor K+ and Mg2+."
      },
      {
        name: "Sacubitril/Valsartan (Entresto)",
        type: "ARNI",
        action: "Dual inhibition: sacubitril inhibits neprilysin (increases natriuretic peptides); valsartan blocks AT1 receptors",
        sideEffects: "Hypotension, hyperkalemia, angioedema, renal impairment, dizziness",
        contra: "ACEi angioedema history, concurrent ACEi (36h washout), pregnancy",
        pearl: "PARADIGM-HF: 20% CV death reduction. Start 24/26mg BID, titrate to 97/103mg BID over 2-4 weeks."
      }
    ],
    pearls: [
      "DOACs preferred over warfarin for non-valvular AF; warfarin still required for mechanical valves",
      "SGLT2 inhibitors reduce HF hospitalization regardless of diabetes status",
      "ACC/AHA guidelines recommend ASCVD risk calculator for primary prevention decisions"
    ],
    quiz: [
      {
        question: "A patient with pe on lisinopril develops dry cough. K+ 4.8, Cr 1.1. Best alternative?",
        options: [
          "Losartan 50mg daily",
          "Double lisinopril dose",
          "Add hydrochlorothiazide",
          "Switch to spironolactone"
        ],
        correct: 0,
        rationale: "ARBs (losartan) are first-line alternatives for ACEi-induced cough. They block AT1 receptors without increasing bradykinin."
      }
    ]
  },
  "ards-management-np": {
    title: "ARDS: Berlin Criteria",
    cellular: {
      title: "Pathophysiology of ARDS",
      content: "ARDS: Berlin Criteria involves alterations in airway structure, gas exchange, or pulmonary vascular function. ARDS pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Occupational dust/chemical exposure (asbestos, silica, coal)",
      "Cystic fibrosis genotype (CFTR mutations)",
      "Prematurity with bronchopulmonary dysplasia history",
      "Childhood asthma with persistent airway hyperreactivity",
      "Indoor air pollution and biomass fuel exposure",
      "Immunocompromised state increasing pneumonia susceptibility",
      "Family history of alpha-1 antitrypsin deficiency"
    ],
    diagnostics: [
      "ABG: pH, PaCO2, PaO2, HCO3, A-a gradient calculation",
      "Procalcitonin for bacterial vs viral pneumonia differentiation",
      "Thoracentesis with Light criteria for pleural effusion classification",
      "CT pulmonary angiography for PE evaluation",
      "Chest X-ray PA and lateral (infiltrates, hyperinflation, effusions)",
      "Sputum culture, Gram stain, and AFB stain",
      "CT chest high-resolution for interstitial/parenchymal disease"
    ],
    management: [
      "Albuterol nebulizer 2.5mg q4-6h PRN for bronchospasm",
      "Annual influenza and pneumococcal vaccination",
      "Inhaler technique assessment and spacer use education",
      "Systemic corticosteroids: prednisone 40mg x5 days for COPD exacerbation",
      "ICS/LABA combination (fluticasone/salmeterol) for persistent asthma",
      "Non-invasive ventilation (BiPAP) for COPD exacerbation with respiratory acidosis",
      "LAMA (tiotropium 18mcg daily) for COPD maintenance"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces eosinophilic infiltration and mucus production",
        sideEffects: "Hyperglycemia, insomnia, mood changes, osteoporosis, adrenal suppression, weight gain",
        contra: "Active untreated infection, live vaccines during therapy",
        pearl: "COPD exacerbation: 40mg x 5 days (REDUCE trial). Asthma exacerbation: 40-60mg x 5-7 days. Taper if >14 days use."
      },
      {
        name: "Fluticasone/Salmeterol (Advair)",
        type: "ICS/LABA Combination",
        action: "Fluticasone suppresses airway inflammation; salmeterol provides sustained bronchodilation via beta-2 agonism",
        sideEffects: "Oral candidiasis, dysphonia, adrenal suppression, pneumonia risk in COPD",
        contra: "Acute bronchospasm (not a rescue inhaler), severe milk protein allergy (Diskus)",
        pearl: "Rinse mouth after use to prevent thrush. LABA monotherapy contraindicated in asthma (BLACK BOX resolved with ICS combination)."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "ARDS management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with ards develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for ards."
      }
    ]
  },
  "pneumonia-management-np": {
    title: "Pneumonia: CAP vs HAP Management",
    cellular: {
      title: "Pathophysiology of Pneumonia",
      content: "Pneumonia involves alveolar consolidation from infection. CAP: S. pneumoniae most common. CURB-65 guides disposition: 0-1 outpatient, 2 consider admission, >=3 ICU. Outpatient: amoxicillin or doxycycline (healthy) or FQ/beta-lactam+macrolide (comorbidities). Procalcitonin <0.25 suggests viral."
    },
    riskFactors: [
      "GERD with chronic microaspiration",
      "Childhood asthma with persistent airway hyperreactivity",
      "Obesity with restrictive physiology and OSA",
      "Prematurity with bronchopulmonary dysplasia history",
      "Prior TB exposure or latent TB infection",
      "Radiation therapy to chest",
      "Cystic fibrosis genotype (CFTR mutations)"
    ],
    diagnostics: [
      "D-dimer (high sensitivity, low specificity for PE)",
      "CT pulmonary angiography for PE evaluation",
      "Pulse oximetry and continuous SpO2 monitoring",
      "Thoracentesis with Light criteria for pleural effusion classification",
      "Polysomnography for sleep-disordered breathing",
      "Methacholine challenge for suspected asthma with normal spirometry",
      "Procalcitonin for bacterial vs viral pneumonia differentiation"
    ],
    management: [
      "Pulmonary rehabilitation for COPD (GOLD B-D) and post-hospitalization",
      "Systemic corticosteroids: prednisone 40mg x5 days for COPD exacerbation",
      "Antibiotic therapy based on local resistance patterns and severity scoring",
      "Inhaler technique assessment and spacer use education",
      "Smoking cessation: varenicline + counseling (most effective combination)",
      "Biologics (omalizumab, mepolizumab, dupilumab) for severe uncontrolled asthma",
      "Annual influenza and pneumococcal vaccination"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Fluticasone/Salmeterol (Advair)",
        type: "ICS/LABA Combination",
        action: "Fluticasone suppresses airway inflammation; salmeterol provides sustained bronchodilation via beta-2 agonism",
        sideEffects: "Oral candidiasis, dysphonia, adrenal suppression, pneumonia risk in COPD",
        contra: "Acute bronchospasm (not a rescue inhaler), severe milk protein allergy (Diskus)",
        pearl: "Rinse mouth after use to prevent thrush. LABA monotherapy contraindicated in asthma (BLACK BOX resolved with ICS combination)."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces eosinophilic infiltration and mucus production",
        sideEffects: "Hyperglycemia, insomnia, mood changes, osteoporosis, adrenal suppression, weight gain",
        contra: "Active untreated infection, live vaccines during therapy",
        pearl: "COPD exacerbation: 40mg x 5 days (REDUCE trial). Asthma exacerbation: 40-60mg x 5-7 days. Taper if >14 days use."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Pneumonia management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with pneumonia develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for pneumonia."
      }
    ]
  },
  "tb-management-np": {
    title: "Tuberculosis: RIPE Therapy & MDR-TB",
    cellular: {
      title: "Pathophysiology of Tuberculosis",
      content: "Tuberculosis: RIPE Therapy & MDR-TB involves alterations in airway structure, gas exchange, or pulmonary vascular function. Tuberculosis pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Childhood asthma with persistent airway hyperreactivity",
      "Radiation therapy to chest",
      "Current or former tobacco use (pack-year calculation)",
      "Age >65 with declining mucociliary clearance",
      "Obesity with restrictive physiology and OSA",
      "GERD with chronic microaspiration",
      "Immunocompromised state increasing pneumonia susceptibility"
    ],
    diagnostics: [
      "CT pulmonary angiography for PE evaluation",
      "Methacholine challenge for suspected asthma with normal spirometry",
      "Pulmonary function tests: FEV1, FVC, FEV1/FVC ratio, DLCO",
      "Peak expiratory flow rate monitoring for asthma",
      "Pulse oximetry and continuous SpO2 monitoring",
      "D-dimer (high sensitivity, low specificity for PE)",
      "Sputum culture, Gram stain, and AFB stain"
    ],
    management: [
      "Systemic corticosteroids: prednisone 40mg x5 days for COPD exacerbation",
      "Biologics (omalizumab, mepolizumab, dupilumab) for severe uncontrolled asthma",
      "Oxygen therapy titrated to SpO2 92-96% (88-92% in COPD with CO2 retention)",
      "Mechanical ventilation with lung-protective strategy (Vt 6-8 mL/kg IBW, Pplat <30)",
      "Antibiotic therapy based on local resistance patterns and severity scoring",
      "Pulmonary rehabilitation for COPD (GOLD B-D) and post-hospitalization",
      "Non-invasive ventilation (BiPAP) for COPD exacerbation with respiratory acidosis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Fluticasone/Salmeterol (Advair)",
        type: "ICS/LABA Combination",
        action: "Fluticasone suppresses airway inflammation; salmeterol provides sustained bronchodilation via beta-2 agonism",
        sideEffects: "Oral candidiasis, dysphonia, adrenal suppression, pneumonia risk in COPD",
        contra: "Acute bronchospasm (not a rescue inhaler), severe milk protein allergy (Diskus)",
        pearl: "Rinse mouth after use to prevent thrush. LABA monotherapy contraindicated in asthma (BLACK BOX resolved with ICS combination)."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces eosinophilic infiltration and mucus production",
        sideEffects: "Hyperglycemia, insomnia, mood changes, osteoporosis, adrenal suppression, weight gain",
        contra: "Active untreated infection, live vaccines during therapy",
        pearl: "COPD exacerbation: 40mg x 5 days (REDUCE trial). Asthma exacerbation: 40-60mg x 5-7 days. Taper if >14 days use."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Tuberculosis management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with tuberculosis develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for tuberculosis."
      }
    ]
  },
  "pleural-effusion-np": {
    title: "Pleural Effusion: Exudative vs Transudative",
    cellular: {
      title: "Pathophysiology of Pleural Effusion",
      content: "Pleural effusion results from imbalance in Starling forces or lymphatic drainage. Light criteria differentiate transudative (CHF, cirrhosis, nephrotic) from exudative (infection, malignancy, PE): exudative if any of protein ratio >0.5, LDH ratio >0.6, or LDH >2/3 upper normal. Diagnostic thoracentesis for all new effusions unless bilateral and clinical CHF."
    },
    riskFactors: [
      "Obesity with restrictive physiology and OSA",
      "Current or former tobacco use (pack-year calculation)",
      "Occupational dust/chemical exposure (asbestos, silica, coal)",
      "Environmental allergen sensitization (dust mites, mold, pollen)",
      "Immunocompromised state increasing pneumonia susceptibility",
      "Prior TB exposure or latent TB infection",
      "Age >65 with declining mucociliary clearance"
    ],
    diagnostics: [
      "Pulse oximetry and continuous SpO2 monitoring",
      "Pulmonary function tests: FEV1, FVC, FEV1/FVC ratio, DLCO",
      "ABG: pH, PaCO2, PaO2, HCO3, A-a gradient calculation",
      "Bronchoscopy with BAL for diagnostic sampling",
      "Sputum culture, Gram stain, and AFB stain",
      "Polysomnography for sleep-disordered breathing",
      "Peak expiratory flow rate monitoring for asthma"
    ],
    management: [
      "Antibiotic therapy based on local resistance patterns and severity scoring",
      "Oxygen therapy titrated to SpO2 92-96% (88-92% in COPD with CO2 retention)",
      "Albuterol nebulizer 2.5mg q4-6h PRN for bronchospasm",
      "Chest tube placement for pneumothorax or empyema drainage",
      "Non-invasive ventilation (BiPAP) for COPD exacerbation with respiratory acidosis",
      "Smoking cessation: varenicline + counseling (most effective combination)",
      "Mechanical ventilation with lung-protective strategy (Vt 6-8 mL/kg IBW, Pplat <30)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Tiotropium (Spiriva)",
        type: "Long-Acting Muscarinic Antagonist",
        action: "Blocks M3 muscarinic receptors in bronchial smooth muscle preventing acetylcholine-mediated bronchoconstriction",
        sideEffects: "Dry mouth, constipation, urinary retention, tachycardia (rare)",
        contra: "Hypersensitivity to tiotropium or ipratropium, narrow-angle glaucoma",
        pearl: "HandiHaler 18mcg daily or Respimat 2.5mcg 2 puffs daily. Foundation of COPD maintenance. UPLIFT trial: sustained bronchodilation."
      },
      {
        name: "Albuterol (ProAir/Ventolin)",
        type: "Short-Acting Beta-2 Agonist",
        action: "Activates beta-2 receptors on bronchial smooth muscle causing relaxation via cAMP pathway",
        sideEffects: "Tremor, tachycardia, hypokalemia, palpitations",
        contra: "Hypersensitivity; use caution with cardiac arrhythmias",
        pearl: "MDI: 2 puffs q4-6h PRN. Nebulizer: 2.5mg q4-6h. >2 canisters/month suggests uncontrolled asthma needing step-up."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Pleural Effusion management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with pleural effusion develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for pleural effusion."
      }
    ]
  },
  "pulmonary-hypertension-np": {
    title: "Pulmonary Hypertension: WHO Classification",
    cellular: {
      title: "Pathophysiology of Pulmonary Hypertension",
      content: "Pulmonary Hypertension: WHO Classification involves specific alterations in pulmonary hypertension physiology. The pathophysiology of Pulmonary Hypertension encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of pulmonary hypertension."
    },
    riskFactors: [
      "Sedentary lifestyle with deconditioning",
      "Obesity (BMI >30) with metabolic syndrome",
      "Diabetes mellitus type 2 with HbA1c >7%",
      "Tobacco use (pack-year dependent risk calculation)",
      "Heavy alcohol use (>14 drinks/week males, >7 females)",
      "Chronic kidney disease (eGFR <60 mL/min)",
      "Obstructive sleep apnea (AHI >15 events/hr)"
    ],
    diagnostics: [
      "Ankle-brachial index for peripheral vascular disease screening",
      "CT angiography of chest for aortic or pulmonary vascular pathology",
      "BNP >100 pg/mL or NT-proBNP >300 pg/mL for volume overload assessment",
      "BMP including potassium, magnesium, calcium for arrhythmia workup",
      "Coagulation studies: PT/INR, aPTT, D-dimer",
      "Cardiac MRI for tissue characterization (edema, fibrosis, infiltration)",
      "Cardiac catheterization: coronary anatomy, hemodynamic measurements"
    ],
    management: [
      "Fluid restriction 1.5-2L/day for hyponatremia or severe HF",
      "SGLT2 inhibitor for HF regardless of diabetes status",
      "Antiplatelet therapy: aspirin 81mg daily for established ASCVD",
      "Beta-blocker titration to resting HR 60-70 bpm",
      "Anticoagulation: DOACs preferred over warfarin for non-valvular AF",
      "Loop diuretics titrated to euvolemia based on daily weights",
      "Cardiac rehabilitation referral (Phase I-III) for functional recovery"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Chest pain or pressure",
        "Dyspnea on exertion or at rest",
        "Palpitations or irregular heartbeat",
        "Syncope or near-syncope"
      ],
      right: [
        "Jugular venous distension",
        "Bilateral lower extremity edema",
        "Hepatomegaly with hepatojugular reflux",
        "Abnormal heart sounds (murmur, gallop, rub)"
      ]
    },
    medications: [
      {
        name: "Carvedilol (Coreg)",
        type: "Non-selective Beta + Alpha-1 Blocker",
        action: "Blocks beta-1, beta-2, and alpha-1 adrenergic receptors; antioxidant properties",
        sideEffects: "Bradycardia, hypotension, dizziness, weight gain, bronchospasm, fatigue",
        contra: "Decompensated HF, SBP <90, HR <55, 2nd/3rd degree AV block, severe asthma/COPD",
        pearl: "HF dose: start 3.125mg BID, target 25mg BID. COPERNICUS: 35% mortality reduction. Take with food."
      },
      {
        name: "Spironolactone (Aldactone)",
        type: "Mineralocorticoid Receptor Antagonist",
        action: "Competitively blocks aldosterone at collecting duct; reduces sodium retention, fibrosis, and remodeling",
        sideEffects: "Hyperkalemia, gynecomastia, breast tenderness, menstrual irregularity",
        contra: "K+ >5.0 mEq/L, eGFR <30, concurrent K+-sparing diuretics, Addison disease",
        pearl: "HF: 25mg daily. RALES: 30% mortality reduction. Check K+ at 3 days and 1 week. Switch to eplerenone if gynecomastia."
      }
    ],
    pearls: [
      "Right-sided MI: volume-dependent; avoid nitrates and diuretics, give IV fluids",
      "Target LDL <70 mg/dL for established ASCVD (consider <55 for very high risk)",
      "Beta-blockers reduce mortality in HFrEF but NOT in HFpEF"
    ],
    quiz: [
      {
        question: "A 58-year-old with pulmonary hypertension has LDL 145, diabetes, and HTN. Best lipid management?",
        options: [
          "Lifestyle modification only for 6 months",
          "Moderate-intensity statin",
          "High-intensity statin (atorvastatin 40-80mg)",
          "Ezetimibe monotherapy"
        ],
        correct: 2,
        rationale: "With multiple ASCVD risk factors and pulmonary hypertension, high-intensity statin therapy is indicated per ACC/AHA guidelines."
      }
    ]
  },
  "lung-cancer-staging-np": {
    title: "Lung Cancer: TNM Staging & Treatment",
    cellular: {
      title: "Pathophysiology of Lung Cancer",
      content: "Lung Cancer: TNM Staging & Treatment involves alterations in airway structure, gas exchange, or pulmonary vascular function. Lung Cancer pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Age >65 with declining mucociliary clearance",
      "Indoor air pollution and biomass fuel exposure",
      "Family history of alpha-1 antitrypsin deficiency",
      "Prior TB exposure or latent TB infection",
      "Environmental allergen sensitization (dust mites, mold, pollen)",
      "Prematurity with bronchopulmonary dysplasia history",
      "GERD with chronic microaspiration"
    ],
    diagnostics: [
      "Peak expiratory flow rate monitoring for asthma",
      "Chest X-ray PA and lateral (infiltrates, hyperinflation, effusions)",
      "CT chest high-resolution for interstitial/parenchymal disease",
      "Polysomnography for sleep-disordered breathing",
      "Bronchoscopy with BAL for diagnostic sampling",
      "Thoracentesis with Light criteria for pleural effusion classification",
      "D-dimer (high sensitivity, low specificity for PE)"
    ],
    management: [
      "Mechanical ventilation with lung-protective strategy (Vt 6-8 mL/kg IBW, Pplat <30)",
      "ICS/LABA combination (fluticasone/salmeterol) for persistent asthma",
      "LAMA (tiotropium 18mcg daily) for COPD maintenance",
      "Smoking cessation: varenicline + counseling (most effective combination)",
      "Chest tube placement for pneumothorax or empyema drainage",
      "Inhaler technique assessment and spacer use education",
      "Pulmonary rehabilitation for COPD (GOLD B-D) and post-hospitalization"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Albuterol (ProAir/Ventolin)",
        type: "Short-Acting Beta-2 Agonist",
        action: "Activates beta-2 receptors on bronchial smooth muscle causing relaxation via cAMP pathway",
        sideEffects: "Tremor, tachycardia, hypokalemia, palpitations",
        contra: "Hypersensitivity; use caution with cardiac arrhythmias",
        pearl: "MDI: 2 puffs q4-6h PRN. Nebulizer: 2.5mg q4-6h. >2 canisters/month suggests uncontrolled asthma needing step-up."
      },
      {
        name: "Tiotropium (Spiriva)",
        type: "Long-Acting Muscarinic Antagonist",
        action: "Blocks M3 muscarinic receptors in bronchial smooth muscle preventing acetylcholine-mediated bronchoconstriction",
        sideEffects: "Dry mouth, constipation, urinary retention, tachycardia (rare)",
        contra: "Hypersensitivity to tiotropium or ipratropium, narrow-angle glaucoma",
        pearl: "HandiHaler 18mcg daily or Respimat 2.5mcg 2 puffs daily. Foundation of COPD maintenance. UPLIFT trial: sustained bronchodilation."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Lung Cancer management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with lung cancer develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for lung cancer."
      }
    ]
  },
  "respiratory-failure-np": {
    title: "Respiratory Failure: Type I vs Type II",
    cellular: {
      title: "Pathophysiology of Respiratory Failure",
      content: "Respiratory Failure: Type I vs Type II involves alterations in airway structure, gas exchange, or pulmonary vascular function. Respiratory Failure pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Prematurity with bronchopulmonary dysplasia history",
      "Age >65 with declining mucociliary clearance",
      "Environmental allergen sensitization (dust mites, mold, pollen)",
      "Current or former tobacco use (pack-year calculation)",
      "Connective tissue disease with ILD predisposition",
      "Indoor air pollution and biomass fuel exposure",
      "Radiation therapy to chest"
    ],
    diagnostics: [
      "Thoracentesis with Light criteria for pleural effusion classification",
      "Peak expiratory flow rate monitoring for asthma",
      "Bronchoscopy with BAL for diagnostic sampling",
      "Pulmonary function tests: FEV1, FVC, FEV1/FVC ratio, DLCO",
      "6-minute walk test for functional capacity assessment",
      "Chest X-ray PA and lateral (infiltrates, hyperinflation, effusions)",
      "Methacholine challenge for suspected asthma with normal spirometry"
    ],
    management: [
      "Inhaler technique assessment and spacer use education",
      "Mechanical ventilation with lung-protective strategy (Vt 6-8 mL/kg IBW, Pplat <30)",
      "Chest tube placement for pneumothorax or empyema drainage",
      "Oxygen therapy titrated to SpO2 92-96% (88-92% in COPD with CO2 retention)",
      "Step-up/step-down approach based on asthma control assessment",
      "ICS/LABA combination (fluticasone/salmeterol) for persistent asthma",
      "Biologics (omalizumab, mepolizumab, dupilumab) for severe uncontrolled asthma"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Tiotropium (Spiriva)",
        type: "Long-Acting Muscarinic Antagonist",
        action: "Blocks M3 muscarinic receptors in bronchial smooth muscle preventing acetylcholine-mediated bronchoconstriction",
        sideEffects: "Dry mouth, constipation, urinary retention, tachycardia (rare)",
        contra: "Hypersensitivity to tiotropium or ipratropium, narrow-angle glaucoma",
        pearl: "HandiHaler 18mcg daily or Respimat 2.5mcg 2 puffs daily. Foundation of COPD maintenance. UPLIFT trial: sustained bronchodilation."
      },
      {
        name: "Albuterol (ProAir/Ventolin)",
        type: "Short-Acting Beta-2 Agonist",
        action: "Activates beta-2 receptors on bronchial smooth muscle causing relaxation via cAMP pathway",
        sideEffects: "Tremor, tachycardia, hypokalemia, palpitations",
        contra: "Hypersensitivity; use caution with cardiac arrhythmias",
        pearl: "MDI: 2 puffs q4-6h PRN. Nebulizer: 2.5mg q4-6h. >2 canisters/month suggests uncontrolled asthma needing step-up."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Respiratory Failure management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with respiratory failure develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for respiratory failure."
      }
    ]
  },
  "bronchiectasis-management-np": {
    title: "Bronchiectasis: Pathophysiology",
    cellular: {
      title: "Pathophysiology of Bronchiectasis",
      content: "Bronchiectasis: Pathophysiology involves alterations in airway structure, gas exchange, or pulmonary vascular function. Bronchiectasis pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Environmental allergen sensitization (dust mites, mold, pollen)",
      "Family history of alpha-1 antitrypsin deficiency",
      "Childhood asthma with persistent airway hyperreactivity",
      "Cystic fibrosis genotype (CFTR mutations)",
      "GERD with chronic microaspiration",
      "Connective tissue disease with ILD predisposition",
      "Prior TB exposure or latent TB infection"
    ],
    diagnostics: [
      "Bronchoscopy with BAL for diagnostic sampling",
      "CT chest high-resolution for interstitial/parenchymal disease",
      "CT pulmonary angiography for PE evaluation",
      "Procalcitonin for bacterial vs viral pneumonia differentiation",
      "D-dimer (high sensitivity, low specificity for PE)",
      "6-minute walk test for functional capacity assessment",
      "Polysomnography for sleep-disordered breathing"
    ],
    management: [
      "Chest tube placement for pneumothorax or empyema drainage",
      "LAMA (tiotropium 18mcg daily) for COPD maintenance",
      "Systemic corticosteroids: prednisone 40mg x5 days for COPD exacerbation",
      "Annual influenza and pneumococcal vaccination",
      "Pulmonary rehabilitation for COPD (GOLD B-D) and post-hospitalization",
      "Step-up/step-down approach based on asthma control assessment",
      "Smoking cessation: varenicline + counseling (most effective combination)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Albuterol (ProAir/Ventolin)",
        type: "Short-Acting Beta-2 Agonist",
        action: "Activates beta-2 receptors on bronchial smooth muscle causing relaxation via cAMP pathway",
        sideEffects: "Tremor, tachycardia, hypokalemia, palpitations",
        contra: "Hypersensitivity; use caution with cardiac arrhythmias",
        pearl: "MDI: 2 puffs q4-6h PRN. Nebulizer: 2.5mg q4-6h. >2 canisters/month suggests uncontrolled asthma needing step-up."
      },
      {
        name: "Tiotropium (Spiriva)",
        type: "Long-Acting Muscarinic Antagonist",
        action: "Blocks M3 muscarinic receptors in bronchial smooth muscle preventing acetylcholine-mediated bronchoconstriction",
        sideEffects: "Dry mouth, constipation, urinary retention, tachycardia (rare)",
        contra: "Hypersensitivity to tiotropium or ipratropium, narrow-angle glaucoma",
        pearl: "HandiHaler 18mcg daily or Respimat 2.5mcg 2 puffs daily. Foundation of COPD maintenance. UPLIFT trial: sustained bronchodilation."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Bronchiectasis management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with bronchiectasis develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for bronchiectasis."
      }
    ]
  },
  "interstitial-lung-disease-np": {
    title: "Interstitial Lung Disease: Classification",
    cellular: {
      title: "Pathophysiology of Interstitial Lung Disease",
      content: "Interstitial Lung Disease: Classification involves alterations in airway structure, gas exchange, or pulmonary vascular function. Interstitial Lung Disease pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Childhood asthma with persistent airway hyperreactivity",
      "Radiation therapy to chest",
      "Current or former tobacco use (pack-year calculation)",
      "Age >65 with declining mucociliary clearance",
      "Obesity with restrictive physiology and OSA",
      "GERD with chronic microaspiration",
      "Immunocompromised state increasing pneumonia susceptibility"
    ],
    diagnostics: [
      "CT pulmonary angiography for PE evaluation",
      "Methacholine challenge for suspected asthma with normal spirometry",
      "Pulmonary function tests: FEV1, FVC, FEV1/FVC ratio, DLCO",
      "Peak expiratory flow rate monitoring for asthma",
      "Pulse oximetry and continuous SpO2 monitoring",
      "D-dimer (high sensitivity, low specificity for PE)",
      "Sputum culture, Gram stain, and AFB stain"
    ],
    management: [
      "Systemic corticosteroids: prednisone 40mg x5 days for COPD exacerbation",
      "Biologics (omalizumab, mepolizumab, dupilumab) for severe uncontrolled asthma",
      "Oxygen therapy titrated to SpO2 92-96% (88-92% in COPD with CO2 retention)",
      "Mechanical ventilation with lung-protective strategy (Vt 6-8 mL/kg IBW, Pplat <30)",
      "Antibiotic therapy based on local resistance patterns and severity scoring",
      "Pulmonary rehabilitation for COPD (GOLD B-D) and post-hospitalization",
      "Non-invasive ventilation (BiPAP) for COPD exacerbation with respiratory acidosis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Tiotropium (Spiriva)",
        type: "Long-Acting Muscarinic Antagonist",
        action: "Blocks M3 muscarinic receptors in bronchial smooth muscle preventing acetylcholine-mediated bronchoconstriction",
        sideEffects: "Dry mouth, constipation, urinary retention, tachycardia (rare)",
        contra: "Hypersensitivity to tiotropium or ipratropium, narrow-angle glaucoma",
        pearl: "HandiHaler 18mcg daily or Respimat 2.5mcg 2 puffs daily. Foundation of COPD maintenance. UPLIFT trial: sustained bronchodilation."
      },
      {
        name: "Albuterol (ProAir/Ventolin)",
        type: "Short-Acting Beta-2 Agonist",
        action: "Activates beta-2 receptors on bronchial smooth muscle causing relaxation via cAMP pathway",
        sideEffects: "Tremor, tachycardia, hypokalemia, palpitations",
        contra: "Hypersensitivity; use caution with cardiac arrhythmias",
        pearl: "MDI: 2 puffs q4-6h PRN. Nebulizer: 2.5mg q4-6h. >2 canisters/month suggests uncontrolled asthma needing step-up."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Interstitial Lung Disease management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with interstitial lung disease develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for interstitial lung disease."
      }
    ]
  },
  "sarcoidosis-pulmonary-np": {
    title: "Sarcoidosis Pulmonary: Staging",
    cellular: {
      title: "Pathophysiology of Sarcoidosis Pulmonary",
      content: "Sarcoidosis Pulmonary: Staging involves alterations in airway structure, gas exchange, or pulmonary vascular function. Sarcoidosis Pulmonary pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Prematurity with bronchopulmonary dysplasia history",
      "Age >65 with declining mucociliary clearance",
      "Environmental allergen sensitization (dust mites, mold, pollen)",
      "Current or former tobacco use (pack-year calculation)",
      "Connective tissue disease with ILD predisposition",
      "Indoor air pollution and biomass fuel exposure",
      "Radiation therapy to chest"
    ],
    diagnostics: [
      "Thoracentesis with Light criteria for pleural effusion classification",
      "Peak expiratory flow rate monitoring for asthma",
      "Bronchoscopy with BAL for diagnostic sampling",
      "Pulmonary function tests: FEV1, FVC, FEV1/FVC ratio, DLCO",
      "6-minute walk test for functional capacity assessment",
      "Chest X-ray PA and lateral (infiltrates, hyperinflation, effusions)",
      "Methacholine challenge for suspected asthma with normal spirometry"
    ],
    management: [
      "Inhaler technique assessment and spacer use education",
      "Mechanical ventilation with lung-protective strategy (Vt 6-8 mL/kg IBW, Pplat <30)",
      "Chest tube placement for pneumothorax or empyema drainage",
      "Oxygen therapy titrated to SpO2 92-96% (88-92% in COPD with CO2 retention)",
      "Step-up/step-down approach based on asthma control assessment",
      "ICS/LABA combination (fluticasone/salmeterol) for persistent asthma",
      "Biologics (omalizumab, mepolizumab, dupilumab) for severe uncontrolled asthma"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces eosinophilic infiltration and mucus production",
        sideEffects: "Hyperglycemia, insomnia, mood changes, osteoporosis, adrenal suppression, weight gain",
        contra: "Active untreated infection, live vaccines during therapy",
        pearl: "COPD exacerbation: 40mg x 5 days (REDUCE trial). Asthma exacerbation: 40-60mg x 5-7 days. Taper if >14 days use."
      },
      {
        name: "Fluticasone/Salmeterol (Advair)",
        type: "ICS/LABA Combination",
        action: "Fluticasone suppresses airway inflammation; salmeterol provides sustained bronchodilation via beta-2 agonism",
        sideEffects: "Oral candidiasis, dysphonia, adrenal suppression, pneumonia risk in COPD",
        contra: "Acute bronchospasm (not a rescue inhaler), severe milk protein allergy (Diskus)",
        pearl: "Rinse mouth after use to prevent thrush. LABA monotherapy contraindicated in asthma (BLACK BOX resolved with ICS combination)."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Sarcoidosis Pulmonary management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with sarcoidosis pulmonary develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for sarcoidosis pulmonary."
      }
    ]
  },
  "occupational-lung-disease-np": {
    title: "Occupational Lung Disease: Asbestosis",
    cellular: {
      title: "Pathophysiology of Occupational Lung Disease",
      content: "Occupational Lung Disease: Asbestosis involves alterations in airway structure, gas exchange, or pulmonary vascular function. Occupational Lung Disease pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Connective tissue disease with ILD predisposition",
      "Environmental allergen sensitization (dust mites, mold, pollen)",
      "GERD with chronic microaspiration",
      "Occupational dust/chemical exposure (asbestos, silica, coal)",
      "Radiation therapy to chest",
      "Family history of alpha-1 antitrypsin deficiency",
      "Current or former tobacco use (pack-year calculation)"
    ],
    diagnostics: [
      "6-minute walk test for functional capacity assessment",
      "Bronchoscopy with BAL for diagnostic sampling",
      "D-dimer (high sensitivity, low specificity for PE)",
      "ABG: pH, PaCO2, PaO2, HCO3, A-a gradient calculation",
      "Methacholine challenge for suspected asthma with normal spirometry",
      "CT chest high-resolution for interstitial/parenchymal disease",
      "Pulmonary function tests: FEV1, FVC, FEV1/FVC ratio, DLCO"
    ],
    management: [
      "Step-up/step-down approach based on asthma control assessment",
      "Chest tube placement for pneumothorax or empyema drainage",
      "Pulmonary rehabilitation for COPD (GOLD B-D) and post-hospitalization",
      "Albuterol nebulizer 2.5mg q4-6h PRN for bronchospasm",
      "Biologics (omalizumab, mepolizumab, dupilumab) for severe uncontrolled asthma",
      "LAMA (tiotropium 18mcg daily) for COPD maintenance",
      "Oxygen therapy titrated to SpO2 92-96% (88-92% in COPD with CO2 retention)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Tiotropium (Spiriva)",
        type: "Long-Acting Muscarinic Antagonist",
        action: "Blocks M3 muscarinic receptors in bronchial smooth muscle preventing acetylcholine-mediated bronchoconstriction",
        sideEffects: "Dry mouth, constipation, urinary retention, tachycardia (rare)",
        contra: "Hypersensitivity to tiotropium or ipratropium, narrow-angle glaucoma",
        pearl: "HandiHaler 18mcg daily or Respimat 2.5mcg 2 puffs daily. Foundation of COPD maintenance. UPLIFT trial: sustained bronchodilation."
      },
      {
        name: "Albuterol (ProAir/Ventolin)",
        type: "Short-Acting Beta-2 Agonist",
        action: "Activates beta-2 receptors on bronchial smooth muscle causing relaxation via cAMP pathway",
        sideEffects: "Tremor, tachycardia, hypokalemia, palpitations",
        contra: "Hypersensitivity; use caution with cardiac arrhythmias",
        pearl: "MDI: 2 puffs q4-6h PRN. Nebulizer: 2.5mg q4-6h. >2 canisters/month suggests uncontrolled asthma needing step-up."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Occupational Lung Disease management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with occupational lung disease develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for occupational lung disease."
      }
    ]
  },
  "ventilator-associated-pneumonia-np": {
    title: "Ventilator-Associated Pneumonia: Prevention",
    cellular: {
      title: "Pathophysiology of Ventilator-Associated Pneumonia",
      content: "Pneumonia involves alveolar consolidation from infection. CAP: S. pneumoniae most common. CURB-65 guides disposition: 0-1 outpatient, 2 consider admission, >=3 ICU. Outpatient: amoxicillin or doxycycline (healthy) or FQ/beta-lactam+macrolide (comorbidities). Procalcitonin <0.25 suggests viral."
    },
    riskFactors: [
      "Cystic fibrosis genotype (CFTR mutations)",
      "Immunocompromised state increasing pneumonia susceptibility",
      "Age >65 with declining mucociliary clearance",
      "Radiation therapy to chest",
      "Prematurity with bronchopulmonary dysplasia history",
      "Occupational dust/chemical exposure (asbestos, silica, coal)",
      "Connective tissue disease with ILD predisposition"
    ],
    diagnostics: [
      "Procalcitonin for bacterial vs viral pneumonia differentiation",
      "Sputum culture, Gram stain, and AFB stain",
      "Peak expiratory flow rate monitoring for asthma",
      "Methacholine challenge for suspected asthma with normal spirometry",
      "Thoracentesis with Light criteria for pleural effusion classification",
      "ABG: pH, PaCO2, PaO2, HCO3, A-a gradient calculation",
      "6-minute walk test for functional capacity assessment"
    ],
    management: [
      "Annual influenza and pneumococcal vaccination",
      "Non-invasive ventilation (BiPAP) for COPD exacerbation with respiratory acidosis",
      "Mechanical ventilation with lung-protective strategy (Vt 6-8 mL/kg IBW, Pplat <30)",
      "Biologics (omalizumab, mepolizumab, dupilumab) for severe uncontrolled asthma",
      "Inhaler technique assessment and spacer use education",
      "Albuterol nebulizer 2.5mg q4-6h PRN for bronchospasm",
      "Step-up/step-down approach based on asthma control assessment"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Fluticasone/Salmeterol (Advair)",
        type: "ICS/LABA Combination",
        action: "Fluticasone suppresses airway inflammation; salmeterol provides sustained bronchodilation via beta-2 agonism",
        sideEffects: "Oral candidiasis, dysphonia, adrenal suppression, pneumonia risk in COPD",
        contra: "Acute bronchospasm (not a rescue inhaler), severe milk protein allergy (Diskus)",
        pearl: "Rinse mouth after use to prevent thrush. LABA monotherapy contraindicated in asthma (BLACK BOX resolved with ICS combination)."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces eosinophilic infiltration and mucus production",
        sideEffects: "Hyperglycemia, insomnia, mood changes, osteoporosis, adrenal suppression, weight gain",
        contra: "Active untreated infection, live vaccines during therapy",
        pearl: "COPD exacerbation: 40mg x 5 days (REDUCE trial). Asthma exacerbation: 40-60mg x 5-7 days. Taper if >14 days use."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Ventilator-Associated Pneumonia management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with ventilator-associated pneumonia develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for ventilator-associated pneumonia."
      }
    ]
  },
  "tracheobronchial-injury-np": {
    title: "Tracheobronchial Injury: Diagnosis",
    cellular: {
      title: "Pathophysiology of Tracheobronchial Injury",
      content: "Tracheobronchial Injury: Diagnosis involves alterations in airway structure, gas exchange, or pulmonary vascular function. Tracheobronchial Injury pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Indoor air pollution and biomass fuel exposure",
      "Prematurity with bronchopulmonary dysplasia history",
      "Connective tissue disease with ILD predisposition",
      "Obesity with restrictive physiology and OSA",
      "Family history of alpha-1 antitrypsin deficiency",
      "Age >65 with declining mucociliary clearance",
      "Childhood asthma with persistent airway hyperreactivity"
    ],
    diagnostics: [
      "Chest X-ray PA and lateral (infiltrates, hyperinflation, effusions)",
      "Thoracentesis with Light criteria for pleural effusion classification",
      "6-minute walk test for functional capacity assessment",
      "Pulse oximetry and continuous SpO2 monitoring",
      "CT chest high-resolution for interstitial/parenchymal disease",
      "Peak expiratory flow rate monitoring for asthma",
      "CT pulmonary angiography for PE evaluation"
    ],
    management: [
      "ICS/LABA combination (fluticasone/salmeterol) for persistent asthma",
      "Inhaler technique assessment and spacer use education",
      "Step-up/step-down approach based on asthma control assessment",
      "Antibiotic therapy based on local resistance patterns and severity scoring",
      "LAMA (tiotropium 18mcg daily) for COPD maintenance",
      "Mechanical ventilation with lung-protective strategy (Vt 6-8 mL/kg IBW, Pplat <30)",
      "Systemic corticosteroids: prednisone 40mg x5 days for COPD exacerbation"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Tiotropium (Spiriva)",
        type: "Long-Acting Muscarinic Antagonist",
        action: "Blocks M3 muscarinic receptors in bronchial smooth muscle preventing acetylcholine-mediated bronchoconstriction",
        sideEffects: "Dry mouth, constipation, urinary retention, tachycardia (rare)",
        contra: "Hypersensitivity to tiotropium or ipratropium, narrow-angle glaucoma",
        pearl: "HandiHaler 18mcg daily or Respimat 2.5mcg 2 puffs daily. Foundation of COPD maintenance. UPLIFT trial: sustained bronchodilation."
      },
      {
        name: "Albuterol (ProAir/Ventolin)",
        type: "Short-Acting Beta-2 Agonist",
        action: "Activates beta-2 receptors on bronchial smooth muscle causing relaxation via cAMP pathway",
        sideEffects: "Tremor, tachycardia, hypokalemia, palpitations",
        contra: "Hypersensitivity; use caution with cardiac arrhythmias",
        pearl: "MDI: 2 puffs q4-6h PRN. Nebulizer: 2.5mg q4-6h. >2 canisters/month suggests uncontrolled asthma needing step-up."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Tracheobronchial Injury management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with tracheobronchial injury develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for tracheobronchial injury."
      }
    ]
  },
  "hemothorax-management-np": {
    title: "Hemothorax: Chest Tube",
    cellular: {
      title: "Pathophysiology of Hemothorax",
      content: "Hemothorax involves blood accumulation in the pleural space from intercostal vessel, pulmonary parenchymal, or great vessel injury. Massive hemothorax: >1500mL or >200mL/hr for 2-4h. Chest tube (32-36Fr) insertion at 4th-5th intercostal space, anterior axillary line. Autotransfusion for massive hemothorax. Thoracotomy indications: >1500mL initial output, >200mL/hr for 2-4h, hemodynamic instability despite resuscitation."
    },
    riskFactors: [
      "Condition-specific predisposing factors for hemothorax",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for hemothorax",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for hemothorax",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of hemothorax",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to hemothorax",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of hemothorax",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for hemothorax. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Hemothorax requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of hemothorax"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with hemothorax. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for hemothorax."
      }
    ]
  },
  "pneumothorax-management-np": {
    title: "Pneumothorax: Needle Decompression",
    cellular: {
      title: "Pathophysiology of Pneumothorax",
      content: "Pneumothorax: Needle Decompression involves alterations in airway structure, gas exchange, or pulmonary vascular function. Pneumothorax pathophysiology includes changes in ventilation-perfusion matching, airway resistance, and pulmonary compliance."
    },
    riskFactors: [
      "Cystic fibrosis genotype (CFTR mutations)",
      "Immunocompromised state increasing pneumonia susceptibility",
      "Age >65 with declining mucociliary clearance",
      "Radiation therapy to chest",
      "Prematurity with bronchopulmonary dysplasia history",
      "Occupational dust/chemical exposure (asbestos, silica, coal)",
      "Connective tissue disease with ILD predisposition"
    ],
    diagnostics: [
      "Procalcitonin for bacterial vs viral pneumonia differentiation",
      "Sputum culture, Gram stain, and AFB stain",
      "Peak expiratory flow rate monitoring for asthma",
      "Methacholine challenge for suspected asthma with normal spirometry",
      "Thoracentesis with Light criteria for pleural effusion classification",
      "ABG: pH, PaCO2, PaO2, HCO3, A-a gradient calculation",
      "6-minute walk test for functional capacity assessment"
    ],
    management: [
      "Annual influenza and pneumococcal vaccination",
      "Non-invasive ventilation (BiPAP) for COPD exacerbation with respiratory acidosis",
      "Mechanical ventilation with lung-protective strategy (Vt 6-8 mL/kg IBW, Pplat <30)",
      "Biologics (omalizumab, mepolizumab, dupilumab) for severe uncontrolled asthma",
      "Inhaler technique assessment and spacer use education",
      "Albuterol nebulizer 2.5mg q4-6h PRN for bronchospasm",
      "Step-up/step-down approach based on asthma control assessment"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Dyspnea (exertional, orthopnea, paroxysmal nocturnal)",
        "Cough (productive vs dry, duration, hemoptysis)",
        "Wheezing or stridor",
        "Chest tightness or pleuritic pain"
      ],
      right: [
        "Tachypnea, accessory muscle use, tripod positioning",
        "Decreased breath sounds, crackles, rhonchi, pleural rub",
        "Hypoxemia (SpO2 <90%) or cyanosis",
        "Respiratory failure signs: AMS, paradoxical breathing, diaphoresis"
      ]
    },
    medications: [
      {
        name: "Albuterol (ProAir/Ventolin)",
        type: "Short-Acting Beta-2 Agonist",
        action: "Activates beta-2 receptors on bronchial smooth muscle causing relaxation via cAMP pathway",
        sideEffects: "Tremor, tachycardia, hypokalemia, palpitations",
        contra: "Hypersensitivity; use caution with cardiac arrhythmias",
        pearl: "MDI: 2 puffs q4-6h PRN. Nebulizer: 2.5mg q4-6h. >2 canisters/month suggests uncontrolled asthma needing step-up."
      },
      {
        name: "Tiotropium (Spiriva)",
        type: "Long-Acting Muscarinic Antagonist",
        action: "Blocks M3 muscarinic receptors in bronchial smooth muscle preventing acetylcholine-mediated bronchoconstriction",
        sideEffects: "Dry mouth, constipation, urinary retention, tachycardia (rare)",
        contra: "Hypersensitivity to tiotropium or ipratropium, narrow-angle glaucoma",
        pearl: "HandiHaler 18mcg daily or Respimat 2.5mcg 2 puffs daily. Foundation of COPD maintenance. UPLIFT trial: sustained bronchodilation."
      }
    ],
    pearls: [
      "FEV1/FVC <0.7 post-bronchodilator confirms obstructive disease; DLCO differentiates emphysema from asthma",
      "Pneumothorax management follows evidence-based stepwise guidelines with regular reassessment",
      "Oxygen targets: 88-92% for COPD with CO2 retention; 94-98% for most other conditions"
    ],
    quiz: [
      {
        question: "A patient with pneumothorax develops worsening respiratory distress. Most urgent finding requiring immediate intervention?",
        options: [
          "SpO2 95% on room air with mild dyspnea",
          "Mild expiratory wheeze without distress",
          "SpO2 85% with accessory muscle use and altered mental status",
          "Productive cough without hemoptysis"
        ],
        correct: 2,
        rationale: "SpO2 85% with accessory muscle use and altered mental status indicates impending respiratory failure requiring immediate intervention for pneumothorax."
      }
    ]
  },
  "chest-drainage-system-np": {
    title: "Chest Drainage: Advanced Management",
    cellular: {
      title: "Pathophysiology of Chest Drainage",
      content: "Chest Drainage involves blood accumulation in the pleural space from intercostal vessel, pulmonary parenchymal, or great vessel injury. Massive hemothorax: >1500mL or >200mL/hr for 2-4h. Chest tube (32-36Fr) insertion at 4th-5th intercostal space, anterior axillary line. Autotransfusion for massive hemothorax. Thoracotomy indications: >1500mL initial output, >200mL/hr for 2-4h, hemodynamic instability despite resuscitation."
    },
    riskFactors: [
      "Condition-specific predisposing factors for chest drainage",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for chest drainage",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for chest drainage",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of chest drainage",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to chest drainage",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of chest drainage",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for chest drainage. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Chest Drainage requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of chest drainage"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with chest drainage. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for chest drainage."
      }
    ]
  },
  "malignant-hyperthermia-np": {
    title: "Malignant Hyperthermia: Dantrolene Protocol",
    cellular: {
      title: "Pathophysiology of Malignant Hyperthermia",
      content: "Malignant Hyperthermia: Dantrolene Protocol involves malignant transformation through accumulation of genetic mutations (oncogene activation, tumor suppressor loss) driving uncontrolled proliferation. The hallmarks of cancer include sustained proliferative signaling, evading growth suppressors, resisting cell death, enabling replicative immortality, inducing angiogenesis, and activating invasion/metastasis. TNM staging guides prognosis and treatment decisions."
    },
    riskFactors: [
      "Age (strongest risk factor for most cancers)",
      "Tobacco use (dose-dependent carcinogenic exposure)",
      "Family history and inherited cancer syndromes (BRCA, Lynch)",
      "Chronic inflammation or infection (H. pylori, HBV/HCV, HPV)",
      "Environmental carcinogen exposure (asbestos, radiation, benzene)",
      "Immunosuppression (transplant, HIV)",
      "Obesity (associated with 13 cancer types)"
    ],
    diagnostics: [
      "Tissue biopsy with histopathological examination (gold standard)",
      "CT chest/abdomen/pelvis for staging",
      "PET-CT for metabolic activity and metastatic survey",
      "Tumor markers (CEA, PSA, CA-125, AFP, LDH)",
      "Molecular profiling and genomic testing (BRCA, MSI, PD-L1, TMB)",
      "CBC, CMP, LDH for baseline and tumor burden",
      "Age-appropriate cancer screening per USPSTF/ACS guidelines"
    ],
    management: [
      "Evidence-based first-line therapy for malignant hyperthermia per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Unexplained weight loss >10% in 6 months",
        "Persistent fatigue unresponsive to rest",
        "Pain (new onset, progressive)",
        "New mass or lymphadenopathy"
      ],
      right: [
        "B symptoms: fever, night sweats, weight loss",
        "Performance status assessment (ECOG/Karnofsky)",
        "Paraneoplastic syndromes",
        "Evidence of metastatic disease"
      ]
    },
    medications: [
      {
        name: "Pembrolizumab (Keytruda)",
        type: "Anti-PD-1 Checkpoint Inhibitor",
        action: "Blocks PD-1 receptor on T cells restoring anti-tumor immune surveillance",
        sideEffects: "Immune-related adverse events: colitis, hepatitis, pneumonitis, thyroiditis, dermatitis",
        contra: "Autoimmune disease (relative), organ transplant",
        pearl: "First-line for PD-L1 high (>=50%) NSCLC, MSI-H/dMMR tumors. Monitor thyroid function, LFTs. Manage irAEs with corticosteroids."
      },
      {
        name: "Ondansetron (Zofran)",
        type: "5-HT3 Receptor Antagonist",
        action: "Blocks serotonin 5-HT3 receptors in CTZ and vagal afferents preventing chemotherapy-induced emesis",
        sideEffects: "Headache, constipation, QT prolongation (dose-dependent)",
        contra: "Concomitant apomorphine, congenital long QT syndrome",
        pearl: "4-8mg IV/PO q8h. Combine with dexamethasone +/- NK1 antagonist (aprepitant) for highly emetogenic chemo. ECG for QT if multiple doses."
      }
    ],
    pearls: [
      "Malignant Hyperthermia requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Malignant Hyperthermia management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with malignant hyperthermia. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of malignant hyperthermia."
      }
    ]
  },
  "wound-irrigation-np": {
    title: "Wound Irrigation: Advanced Wound Management",
    cellular: {
      title: "Pathophysiology of Wound Irrigation",
      content: "Wound Irrigation: Advanced Wound Management involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Wound Irrigation pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for wound irrigation",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for wound irrigation",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for wound irrigation",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of wound irrigation",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to wound irrigation",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of wound irrigation",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for wound irrigation. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Wound Irrigation requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of wound irrigation"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with wound irrigation. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for wound irrigation."
      }
    ]
  },
  "stroke-advanced-np": {
    title: "Stroke: Penumbra & Reperfusion",
    cellular: {
      title: "Pathophysiology of Stroke",
      content: "Ischemic stroke results from cerebral artery occlusion (thrombotic or embolic) causing neuronal death from ATP depletion. The ischemic penumbra (tissue at risk surrounding the core infarct) is salvageable with reperfusion. IV alteplase within 4.5 hours (NINDS, ECASS III) or mechanical thrombectomy within 24 hours for large vessel occlusion (DAWN, DEFUSE 3). NIHSS quantifies severity. Door-to-needle time target <60 minutes."
    },
    riskFactors: [
      "Diabetes with peripheral and autonomic neuropathy",
      "Age >65 with progressive neurodegenerative risk",
      "Hypertension (leading modifiable risk for stroke)",
      "Sleep deprivation or circadian rhythm disruption",
      "Tobacco use with cerebrovascular disease risk",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)",
      "Atrial fibrillation with cardioembolic stroke risk"
    ],
    diagnostics: [
      "EMG/NCS for peripheral neuropathy, radiculopathy, myopathy evaluation",
      "CT head without contrast (acute hemorrhage, mass effect, midline shift)",
      "MRI brain with/without gadolinium (ischemia, demyelination, tumors)",
      "Carotid duplex ultrasound for extracranial stenosis",
      "NIH Stroke Scale (NIHSS) for stroke severity quantification",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening",
      "Glasgow Coma Scale (GCS) for consciousness level assessment"
    ],
    management: [
      "Cholinesterase inhibitors (donepezil) for Alzheimer's cognitive decline",
      "tPA within 4.5 hours of ischemic stroke onset (NINDS criteria)",
      "Mechanical thrombectomy within 24 hours for large vessel occlusion (DAWN/DEFUSE 3)",
      "Migraine prevention: CGRP monoclonal antibodies, topiramate, or propranolol",
      "Dopaminergic therapy (carbidopa-levodopa) for Parkinson disease motor symptoms",
      "Rehabilitation: PT, OT, speech therapy for functional recovery",
      "Disease-modifying therapy for MS (ocrelizumab, natalizumab, fingolimod)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Donepezil (Aricept)",
        type: "Cholinesterase Inhibitor",
        action: "Reversibly inhibits acetylcholinesterase increasing ACh availability at synaptic cleft",
        sideEffects: "Nausea, diarrhea, insomnia, bradycardia, vivid dreams",
        contra: "Sick sinus syndrome without pacemaker, GI obstruction",
        pearl: "Start 5mg QHS, increase to 10mg after 4-6 weeks. Modest cognitive benefit. Consider memantine addition for moderate-severe AD."
      },
      {
        name: "Levetiracetam (Keppra)",
        type: "Antiepileptic (SV2A modulator)",
        action: "Binds synaptic vesicle protein 2A (SV2A) modulating neurotransmitter release",
        sideEffects: "Behavioral changes (irritability, aggression), somnolence, dizziness",
        contra: "Known hypersensitivity; dose-adjust for renal impairment",
        pearl: "First-line for many seizure types. Start 500mg BID, titrate to 1500mg BID. No hepatic metabolism. Keppra rage: consider brivaracetam."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Stroke requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with stroke. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for stroke."
      }
    ]
  },
  "seizure-safety-np": {
    title: "Status Epilepticus: Refractory Mgmt",
    cellular: {
      title: "Pathophysiology of Status Epilepticus",
      content: "Seizures result from excitatory/inhibitory neurotransmission imbalance. Status epilepticus: continuous seizure >=5 min. First-line: IV lorazepam 0.1mg/kg (max 4mg), repeat once. Second-line: IV fosphenytoin or levetiracetam. AEDs: sodium channel blockade (phenytoin, carbamazepine, lamotrigine), GABA enhancement (benzodiazepines, phenobarbital), SV2A binding (levetiracetam)."
    },
    riskFactors: [
      "Atrial fibrillation with cardioembolic stroke risk",
      "Family history of neurological disease (first-degree relative)",
      "Prior head trauma or TBI history",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)",
      "Sleep deprivation or circadian rhythm disruption",
      "Chronic migraine with aura (increased stroke risk in women on OCPs)",
      "Autoimmune conditions (MS, myasthenia gravis predisposition)"
    ],
    diagnostics: [
      "Glasgow Coma Scale (GCS) for consciousness level assessment",
      "CT angiography of head and neck (vessel occlusion, aneurysm, dissection)",
      "Lumbar puncture with CSF analysis (cell count, protein, glucose, cultures, oligoclonal bands)",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening",
      "Carotid duplex ultrasound for extracranial stenosis",
      "Visual field testing and fundoscopic exam for papilledema",
      "MRA or CTA for intracranial vascular evaluation"
    ],
    management: [
      "Disease-modifying therapy for MS (ocrelizumab, natalizumab, fingolimod)",
      "Antiepileptic drug monotherapy: levetiracetam, lamotrigine, or valproate",
      "Blood pressure management per AHA stroke guidelines",
      "Rehabilitation: PT, OT, speech therapy for functional recovery",
      "Migraine prevention: CGRP monoclonal antibodies, topiramate, or propranolol",
      "Neurosurgical consultation for mass lesions, hemorrhage, or hydrocephalus",
      "DVT prophylaxis with SCDs and pharmacologic when safe"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Carbidopa-Levodopa (Sinemet)",
        type: "Dopamine Precursor",
        action: "Levodopa crosses BBB and converts to dopamine; carbidopa prevents peripheral decarboxylation",
        sideEffects: "Dyskinesias, wearing-off, orthostatic hypotension, hallucinations, impulse control disorders",
        contra: "Concurrent non-selective MAOi, narrow-angle glaucoma",
        pearl: "Start 25/100mg TID. Protein competes for absorption. Watch for wearing-off at 3-5 years (honeymoon period)."
      },
      {
        name: "Alteplase (tPA/Activase)",
        type: "Tissue Plasminogen Activator",
        action: "Converts plasminogen to plasmin dissolving fibrin clots and restoring cerebral perfusion",
        sideEffects: "Intracranial hemorrhage (6.4%), systemic bleeding, angioedema",
        contra: "Active bleeding, recent surgery <14 days, INR >1.7, platelets <100K, BP >185/110 despite treatment",
        pearl: "Dose: 0.9mg/kg (max 90mg), 10% bolus + 60min infusion. Door-to-needle <60 min. Tenecteplase emerging alternative."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Status Epilepticus requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with status epilepticus. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for status epilepticus."
      }
    ]
  },
  "tbi-management-np": {
    title: "TBI: Classification & Neuroprotection",
    cellular: {
      title: "Pathophysiology of TBI",
      content: "Traumatic brain injury classification: Mild (GCS 13-15), Moderate (GCS 9-12), Severe (GCS 3-8). Primary injury: mechanical disruption. Secondary injury: cerebral edema, ischemia, excitotoxicity, inflammation. Management: prevent secondary injury with normothermia, normoglycemia, normocarbia (PaCO2 35-40), ICP monitoring (goal <22 mmHg), CPP maintenance (60-70 mmHg). Hyperosmolar therapy: mannitol 0.25-1g/kg or hypertonic saline 3% (preferred). Surgical decompression for refractory ICP elevation."
    },
    riskFactors: [
      "Condition-specific predisposing factors for tbi",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for tbi",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for tbi",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of tbi",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to tbi",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of tbi",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for tbi. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "TBI requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of tbi"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with tbi. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for tbi."
      }
    ]
  },
  "sah-management-np": {
    title: "Subarachnoid Hemorrhage: Hunt-Hess",
    cellular: {
      title: "Pathophysiology of Subarachnoid Hemorrhage",
      content: "Subarachnoid hemorrhage: 85% from ruptured cerebral aneurysm. Sudden onset 'worst headache of life.' Hunt-Hess grading: I (minimal headache) to V (coma). CT head sensitivity: 95% at 12h, 50% at 7 days. If CT negative with high suspicion: LP showing xanthochromia. CTA or DSA for aneurysm identification. Complications: rebleeding (highest risk first 24h), vasospasm (peak days 4-14, monitor with TCD, treat with nimodipine 60mg q4h), hydrocephalus, hyponatremia (SIADH vs cerebral salt wasting). Secure aneurysm within 24h (coiling or clipping)."
    },
    riskFactors: [
      "Condition-specific predisposing factors for subarachnoid hemorrhage",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for subarachnoid hemorrhage",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for subarachnoid hemorrhage",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of subarachnoid hemorrhage",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to subarachnoid hemorrhage",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of subarachnoid hemorrhage",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for subarachnoid hemorrhage. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Subarachnoid Hemorrhage requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of subarachnoid hemorrhage"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with subarachnoid hemorrhage. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for subarachnoid hemorrhage."
      }
    ]
  },
  "sci-management-np": {
    title: "Spinal Cord Injury: ASIA Classification",
    cellular: {
      title: "Pathophysiology of Spinal Cord Injury",
      content: "Spinal Cord Injury: ASIA Classification involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Spinal Cord Injury pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Autoimmune conditions (MS, myasthenia gravis predisposition)",
      "Chronic alcohol use with neurotoxicity",
      "Diabetes with peripheral and autonomic neuropathy",
      "Chronic migraine with aura (increased stroke risk in women on OCPs)",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)",
      "Prior CNS infection (increased seizure risk)",
      "Occupational toxin exposure (heavy metals, organophosphates)"
    ],
    diagnostics: [
      "MRA or CTA for intracranial vascular evaluation",
      "EEG for seizure characterization and localization",
      "EMG/NCS for peripheral neuropathy, radiculopathy, myopathy evaluation",
      "Visual field testing and fundoscopic exam for papilledema",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening",
      "Genetic testing when hereditary neurological condition suspected",
      "Specific autoantibody panels (AChR, anti-MOG, anti-NMDA receptor)"
    ],
    management: [
      "DVT prophylaxis with SCDs and pharmacologic when safe",
      "Osmotic therapy (mannitol 20% or hypertonic saline 3%) for cerebral edema",
      "Cholinesterase inhibitors (donepezil) for Alzheimer's cognitive decline",
      "Neurosurgical consultation for mass lesions, hemorrhage, or hydrocephalus",
      "Rehabilitation: PT, OT, speech therapy for functional recovery",
      "Palliative care and goals of care discussion for progressive diseases",
      "Seizure precautions and driving restriction counseling"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Levetiracetam (Keppra)",
        type: "Antiepileptic (SV2A modulator)",
        action: "Binds synaptic vesicle protein 2A (SV2A) modulating neurotransmitter release",
        sideEffects: "Behavioral changes (irritability, aggression), somnolence, dizziness",
        contra: "Known hypersensitivity; dose-adjust for renal impairment",
        pearl: "First-line for many seizure types. Start 500mg BID, titrate to 1500mg BID. No hepatic metabolism. Keppra rage: consider brivaracetam."
      },
      {
        name: "Donepezil (Aricept)",
        type: "Cholinesterase Inhibitor",
        action: "Reversibly inhibits acetylcholinesterase increasing ACh availability at synaptic cleft",
        sideEffects: "Nausea, diarrhea, insomnia, bradycardia, vivid dreams",
        contra: "Sick sinus syndrome without pacemaker, GI obstruction",
        pearl: "Start 5mg QHS, increase to 10mg after 4-6 weeks. Modest cognitive benefit. Consider memantine addition for moderate-severe AD."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Spinal Cord Injury requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with spinal cord injury. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for spinal cord injury."
      }
    ]
  },
  "multiple-sclerosis-np": {
    title: "Multiple Sclerosis: DMT & Relapse Management",
    cellular: {
      title: "Pathophysiology of Multiple Sclerosis",
      content: "Multiple Sclerosis: DMT & Relapse Management involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Multiple Sclerosis pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Prior head trauma or TBI history",
      "Obesity and metabolic syndrome with neuroinflammation",
      "Prior CNS infection (increased seizure risk)",
      "Tobacco use with cerebrovascular disease risk",
      "Chronic alcohol use with neurotoxicity",
      "Sleep deprivation or circadian rhythm disruption",
      "Diabetes with peripheral and autonomic neuropathy"
    ],
    diagnostics: [
      "Lumbar puncture with CSF analysis (cell count, protein, glucose, cultures, oligoclonal bands)",
      "Neuropsychological testing for cognitive domain assessment",
      "Genetic testing when hereditary neurological condition suspected",
      "NIH Stroke Scale (NIHSS) for stroke severity quantification",
      "EEG for seizure characterization and localization",
      "Carotid duplex ultrasound for extracranial stenosis",
      "EMG/NCS for peripheral neuropathy, radiculopathy, myopathy evaluation"
    ],
    management: [
      "Blood pressure management per AHA stroke guidelines",
      "Supportive care: HOB elevation 30 degrees, normothermia, euglycemia",
      "Palliative care and goals of care discussion for progressive diseases",
      "Dopaminergic therapy (carbidopa-levodopa) for Parkinson disease motor symptoms",
      "Osmotic therapy (mannitol 20% or hypertonic saline 3%) for cerebral edema",
      "Migraine prevention: CGRP monoclonal antibodies, topiramate, or propranolol",
      "Cholinesterase inhibitors (donepezil) for Alzheimer's cognitive decline"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Alteplase (tPA/Activase)",
        type: "Tissue Plasminogen Activator",
        action: "Converts plasminogen to plasmin dissolving fibrin clots and restoring cerebral perfusion",
        sideEffects: "Intracranial hemorrhage (6.4%), systemic bleeding, angioedema",
        contra: "Active bleeding, recent surgery <14 days, INR >1.7, platelets <100K, BP >185/110 despite treatment",
        pearl: "Dose: 0.9mg/kg (max 90mg), 10% bolus + 60min infusion. Door-to-needle <60 min. Tenecteplase emerging alternative."
      },
      {
        name: "Carbidopa-Levodopa (Sinemet)",
        type: "Dopamine Precursor",
        action: "Levodopa crosses BBB and converts to dopamine; carbidopa prevents peripheral decarboxylation",
        sideEffects: "Dyskinesias, wearing-off, orthostatic hypotension, hallucinations, impulse control disorders",
        contra: "Concurrent non-selective MAOi, narrow-angle glaucoma",
        pearl: "Start 25/100mg TID. Protein competes for absorption. Watch for wearing-off at 3-5 years (honeymoon period)."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Multiple Sclerosis requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with multiple sclerosis. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for multiple sclerosis."
      }
    ]
  },
  "als-management-np": {
    title: "ALS: Disease Progression & Supportive Care",
    cellular: {
      title: "Pathophysiology of ALS",
      content: "ALS is progressive motor neuron disease affecting both upper and lower motor neurons. Presents with asymmetric limb weakness, fasciculations, atrophy (LMN signs) combined with hyperreflexia, spasticity (UMN signs). El Escorial criteria for diagnosis. Riluzole (glutamate antagonist) extends survival by 2-3 months. Edaravone (free radical scavenger) may slow functional decline. Multidisciplinary care: respiratory support (NIV when FVC <50%), nutritional support (PEG tube), speech therapy, palliative care discussions early."
    },
    riskFactors: [
      "Condition-specific predisposing factors for als",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for als",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for als",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of als",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to als",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of als",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for als. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "ALS requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of als"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with als. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for als."
      }
    ]
  },
  "parkinsons-advanced-np": {
    title: "Parkinson's: Dopaminergic Pharmacology",
    cellular: {
      title: "Pharmacology of Parkinson's",
      content: "Parkinson's: Dopaminergic Pharmacology encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to parkinson's."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Parkinson's management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to parkinson's. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "dementia-management-np": {
    title: "Dementia: Differential",
    cellular: {
      title: "Pathophysiology of Dementia",
      content: "Dementia: Differential involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Dementia pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Prior CNS infection (increased seizure risk)",
      "Autoimmune conditions (MS, myasthenia gravis predisposition)",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)",
      "Family history of neurological disease (first-degree relative)",
      "Age >65 with progressive neurodegenerative risk",
      "Chronic alcohol use with neurotoxicity",
      "Hypertension (leading modifiable risk for stroke)"
    ],
    diagnostics: [
      "Genetic testing when hereditary neurological condition suspected",
      "MRA or CTA for intracranial vascular evaluation",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening",
      "CT angiography of head and neck (vessel occlusion, aneurysm, dissection)",
      "CT head without contrast (acute hemorrhage, mass effect, midline shift)",
      "EEG for seizure characterization and localization",
      "MRI brain with/without gadolinium (ischemia, demyelination, tumors)"
    ],
    management: [
      "Palliative care and goals of care discussion for progressive diseases",
      "DVT prophylaxis with SCDs and pharmacologic when safe",
      "Rehabilitation: PT, OT, speech therapy for functional recovery",
      "Antiepileptic drug monotherapy: levetiracetam, lamotrigine, or valproate",
      "tPA within 4.5 hours of ischemic stroke onset (NINDS criteria)",
      "Osmotic therapy (mannitol 20% or hypertonic saline 3%) for cerebral edema",
      "Mechanical thrombectomy within 24 hours for large vessel occlusion (DAWN/DEFUSE 3)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Levetiracetam (Keppra)",
        type: "Antiepileptic (SV2A modulator)",
        action: "Binds synaptic vesicle protein 2A (SV2A) modulating neurotransmitter release",
        sideEffects: "Behavioral changes (irritability, aggression), somnolence, dizziness",
        contra: "Known hypersensitivity; dose-adjust for renal impairment",
        pearl: "First-line for many seizure types. Start 500mg BID, titrate to 1500mg BID. No hepatic metabolism. Keppra rage: consider brivaracetam."
      },
      {
        name: "Donepezil (Aricept)",
        type: "Cholinesterase Inhibitor",
        action: "Reversibly inhibits acetylcholinesterase increasing ACh availability at synaptic cleft",
        sideEffects: "Nausea, diarrhea, insomnia, bradycardia, vivid dreams",
        contra: "Sick sinus syndrome without pacemaker, GI obstruction",
        pearl: "Start 5mg QHS, increase to 10mg after 4-6 weeks. Modest cognitive benefit. Consider memantine addition for moderate-severe AD."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Dementia requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with dementia. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for dementia."
      }
    ]
  },
  "headache-management-np": {
    title: "Headache: Primary vs Secondary Differential",
    cellular: {
      title: "Pathophysiology of Headache",
      content: "Headache: Primary vs Secondary Differential involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Headache pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Chronic migraine with aura (increased stroke risk in women on OCPs)",
      "Atrial fibrillation with cardioembolic stroke risk",
      "Sleep deprivation or circadian rhythm disruption",
      "Age >65 with progressive neurodegenerative risk",
      "Obesity and metabolic syndrome with neuroinflammation",
      "Family history of neurological disease (first-degree relative)",
      "Prior CNS infection (increased seizure risk)"
    ],
    diagnostics: [
      "Visual field testing and fundoscopic exam for papilledema",
      "Glasgow Coma Scale (GCS) for consciousness level assessment",
      "Carotid duplex ultrasound for extracranial stenosis",
      "CT head without contrast (acute hemorrhage, mass effect, midline shift)",
      "Neuropsychological testing for cognitive domain assessment",
      "CT angiography of head and neck (vessel occlusion, aneurysm, dissection)",
      "Genetic testing when hereditary neurological condition suspected"
    ],
    management: [
      "Neurosurgical consultation for mass lesions, hemorrhage, or hydrocephalus",
      "Disease-modifying therapy for MS (ocrelizumab, natalizumab, fingolimod)",
      "Migraine prevention: CGRP monoclonal antibodies, topiramate, or propranolol",
      "tPA within 4.5 hours of ischemic stroke onset (NINDS criteria)",
      "Supportive care: HOB elevation 30 degrees, normothermia, euglycemia",
      "Antiepileptic drug monotherapy: levetiracetam, lamotrigine, or valproate",
      "Palliative care and goals of care discussion for progressive diseases"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Alteplase (tPA/Activase)",
        type: "Tissue Plasminogen Activator",
        action: "Converts plasminogen to plasmin dissolving fibrin clots and restoring cerebral perfusion",
        sideEffects: "Intracranial hemorrhage (6.4%), systemic bleeding, angioedema",
        contra: "Active bleeding, recent surgery <14 days, INR >1.7, platelets <100K, BP >185/110 despite treatment",
        pearl: "Dose: 0.9mg/kg (max 90mg), 10% bolus + 60min infusion. Door-to-needle <60 min. Tenecteplase emerging alternative."
      },
      {
        name: "Carbidopa-Levodopa (Sinemet)",
        type: "Dopamine Precursor",
        action: "Levodopa crosses BBB and converts to dopamine; carbidopa prevents peripheral decarboxylation",
        sideEffects: "Dyskinesias, wearing-off, orthostatic hypotension, hallucinations, impulse control disorders",
        contra: "Concurrent non-selective MAOi, narrow-angle glaucoma",
        pearl: "Start 25/100mg TID. Protein competes for absorption. Watch for wearing-off at 3-5 years (honeymoon period)."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Headache requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with headache. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for headache."
      }
    ]
  },
  "myasthenia-gravis-crisis-np": {
    title: "Myasthenia Gravis Crisis: Plasmapheresis",
    cellular: {
      title: "Pathophysiology of Myasthenia Gravis Crisis",
      content: "Myasthenia Gravis Crisis: Plasmapheresis involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Myasthenia Gravis Crisis pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Diabetes with peripheral and autonomic neuropathy",
      "Age >65 with progressive neurodegenerative risk",
      "Hypertension (leading modifiable risk for stroke)",
      "Sleep deprivation or circadian rhythm disruption",
      "Tobacco use with cerebrovascular disease risk",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)",
      "Atrial fibrillation with cardioembolic stroke risk"
    ],
    diagnostics: [
      "EMG/NCS for peripheral neuropathy, radiculopathy, myopathy evaluation",
      "CT head without contrast (acute hemorrhage, mass effect, midline shift)",
      "MRI brain with/without gadolinium (ischemia, demyelination, tumors)",
      "Carotid duplex ultrasound for extracranial stenosis",
      "NIH Stroke Scale (NIHSS) for stroke severity quantification",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening",
      "Glasgow Coma Scale (GCS) for consciousness level assessment"
    ],
    management: [
      "Cholinesterase inhibitors (donepezil) for Alzheimer's cognitive decline",
      "tPA within 4.5 hours of ischemic stroke onset (NINDS criteria)",
      "Mechanical thrombectomy within 24 hours for large vessel occlusion (DAWN/DEFUSE 3)",
      "Migraine prevention: CGRP monoclonal antibodies, topiramate, or propranolol",
      "Dopaminergic therapy (carbidopa-levodopa) for Parkinson disease motor symptoms",
      "Rehabilitation: PT, OT, speech therapy for functional recovery",
      "Disease-modifying therapy for MS (ocrelizumab, natalizumab, fingolimod)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Carbidopa-Levodopa (Sinemet)",
        type: "Dopamine Precursor",
        action: "Levodopa crosses BBB and converts to dopamine; carbidopa prevents peripheral decarboxylation",
        sideEffects: "Dyskinesias, wearing-off, orthostatic hypotension, hallucinations, impulse control disorders",
        contra: "Concurrent non-selective MAOi, narrow-angle glaucoma",
        pearl: "Start 25/100mg TID. Protein competes for absorption. Watch for wearing-off at 3-5 years (honeymoon period)."
      },
      {
        name: "Alteplase (tPA/Activase)",
        type: "Tissue Plasminogen Activator",
        action: "Converts plasminogen to plasmin dissolving fibrin clots and restoring cerebral perfusion",
        sideEffects: "Intracranial hemorrhage (6.4%), systemic bleeding, angioedema",
        contra: "Active bleeding, recent surgery <14 days, INR >1.7, platelets <100K, BP >185/110 despite treatment",
        pearl: "Dose: 0.9mg/kg (max 90mg), 10% bolus + 60min infusion. Door-to-needle <60 min. Tenecteplase emerging alternative."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Myasthenia Gravis Crisis requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with myasthenia gravis crisis. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for myasthenia gravis crisis."
      }
    ]
  },
  "huntington-disease-np": {
    title: "Huntington Disease: Genetic Counseling",
    cellular: {
      title: "Pathophysiology of Huntington Disease",
      content: "Huntington disease is autosomal dominant neurodegenerative disorder caused by CAG trinucleotide repeat expansion (>=36 repeats) in the HTT gene on chromosome 4. Mutant huntingtin protein causes selective loss of medium spiny neurons in the caudate and putamen. Clinical triad: chorea, cognitive decline, psychiatric symptoms. Genetic testing confirms diagnosis. Tetrabenazine or deutetrabenazine for chorea management. Genetic counseling is essential for family members."
    },
    riskFactors: [
      "Autoimmune conditions (MS, myasthenia gravis predisposition)",
      "Chronic alcohol use with neurotoxicity",
      "Diabetes with peripheral and autonomic neuropathy",
      "Chronic migraine with aura (increased stroke risk in women on OCPs)",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)",
      "Prior CNS infection (increased seizure risk)",
      "Occupational toxin exposure (heavy metals, organophosphates)"
    ],
    diagnostics: [
      "MRA or CTA for intracranial vascular evaluation",
      "EEG for seizure characterization and localization",
      "EMG/NCS for peripheral neuropathy, radiculopathy, myopathy evaluation",
      "Visual field testing and fundoscopic exam for papilledema",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening",
      "Genetic testing when hereditary neurological condition suspected",
      "Specific autoantibody panels (AChR, anti-MOG, anti-NMDA receptor)"
    ],
    management: [
      "DVT prophylaxis with SCDs and pharmacologic when safe",
      "Osmotic therapy (mannitol 20% or hypertonic saline 3%) for cerebral edema",
      "Cholinesterase inhibitors (donepezil) for Alzheimer's cognitive decline",
      "Neurosurgical consultation for mass lesions, hemorrhage, or hydrocephalus",
      "Rehabilitation: PT, OT, speech therapy for functional recovery",
      "Palliative care and goals of care discussion for progressive diseases",
      "Seizure precautions and driving restriction counseling"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Donepezil (Aricept)",
        type: "Cholinesterase Inhibitor",
        action: "Reversibly inhibits acetylcholinesterase increasing ACh availability at synaptic cleft",
        sideEffects: "Nausea, diarrhea, insomnia, bradycardia, vivid dreams",
        contra: "Sick sinus syndrome without pacemaker, GI obstruction",
        pearl: "Start 5mg QHS, increase to 10mg after 4-6 weeks. Modest cognitive benefit. Consider memantine addition for moderate-severe AD."
      },
      {
        name: "Levetiracetam (Keppra)",
        type: "Antiepileptic (SV2A modulator)",
        action: "Binds synaptic vesicle protein 2A (SV2A) modulating neurotransmitter release",
        sideEffects: "Behavioral changes (irritability, aggression), somnolence, dizziness",
        contra: "Known hypersensitivity; dose-adjust for renal impairment",
        pearl: "First-line for many seizure types. Start 500mg BID, titrate to 1500mg BID. No hepatic metabolism. Keppra rage: consider brivaracetam."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Huntington Disease requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with huntington disease. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for huntington disease."
      }
    ]
  },
  "normal-pressure-hydrocephalus-np": {
    title: "Normal Pressure Hydrocephalus: Triad",
    cellular: {
      title: "Pathophysiology of Normal Pressure Hydrocephalus",
      content: "Normal pressure hydrocephalus (NPH) is characterized by the classic triad of gait disturbance (magnetic gait), urinary incontinence, and dementia (wet, wobbly, wacky). Diagnosis: ventriculomegaly on imaging disproportionate to sulcal atrophy. Evans index >0.3 suggests NPH. CSF tap test (30-50mL removal) with gait improvement supports diagnosis. Treatment: VP shunt placement. Gait improvement has highest likelihood of response to shunting."
    },
    riskFactors: [
      "Autoimmune conditions (MS, myasthenia gravis predisposition)",
      "Chronic alcohol use with neurotoxicity",
      "Diabetes with peripheral and autonomic neuropathy",
      "Chronic migraine with aura (increased stroke risk in women on OCPs)",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)",
      "Prior CNS infection (increased seizure risk)",
      "Occupational toxin exposure (heavy metals, organophosphates)"
    ],
    diagnostics: [
      "MRA or CTA for intracranial vascular evaluation",
      "EEG for seizure characterization and localization",
      "EMG/NCS for peripheral neuropathy, radiculopathy, myopathy evaluation",
      "Visual field testing and fundoscopic exam for papilledema",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening",
      "Genetic testing when hereditary neurological condition suspected",
      "Specific autoantibody panels (AChR, anti-MOG, anti-NMDA receptor)"
    ],
    management: [
      "DVT prophylaxis with SCDs and pharmacologic when safe",
      "Osmotic therapy (mannitol 20% or hypertonic saline 3%) for cerebral edema",
      "Cholinesterase inhibitors (donepezil) for Alzheimer's cognitive decline",
      "Neurosurgical consultation for mass lesions, hemorrhage, or hydrocephalus",
      "Rehabilitation: PT, OT, speech therapy for functional recovery",
      "Palliative care and goals of care discussion for progressive diseases",
      "Seizure precautions and driving restriction counseling"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Carbidopa-Levodopa (Sinemet)",
        type: "Dopamine Precursor",
        action: "Levodopa crosses BBB and converts to dopamine; carbidopa prevents peripheral decarboxylation",
        sideEffects: "Dyskinesias, wearing-off, orthostatic hypotension, hallucinations, impulse control disorders",
        contra: "Concurrent non-selective MAOi, narrow-angle glaucoma",
        pearl: "Start 25/100mg TID. Protein competes for absorption. Watch for wearing-off at 3-5 years (honeymoon period)."
      },
      {
        name: "Alteplase (tPA/Activase)",
        type: "Tissue Plasminogen Activator",
        action: "Converts plasminogen to plasmin dissolving fibrin clots and restoring cerebral perfusion",
        sideEffects: "Intracranial hemorrhage (6.4%), systemic bleeding, angioedema",
        contra: "Active bleeding, recent surgery <14 days, INR >1.7, platelets <100K, BP >185/110 despite treatment",
        pearl: "Dose: 0.9mg/kg (max 90mg), 10% bolus + 60min infusion. Door-to-needle <60 min. Tenecteplase emerging alternative."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Normal Pressure Hydrocephalus requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with normal pressure hydrocephalus. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for normal pressure hydrocephalus."
      }
    ]
  },
  "central-pontine-myelinolysis-np": {
    title: "Central Pontine Myelinolysis: Osmotic",
    cellular: {
      title: "Pathophysiology of Central Pontine Myelinolysis",
      content: "Central pontine myelinolysis (osmotic demyelination syndrome) results from overly rapid correction of chronic hyponatremia (>8-10 mEq/L/24h). Osmotic stress causes oligodendrocyte apoptosis with demyelination in the central pons and extrapontine structures. Prevention: limit sodium correction to <=8 mEq/L/day. Treatment is supportive. PRES (posterior reversible encephalopathy syndrome) involves vasogenic edema from endothelial dysfunction due to severe hypertension, eclampsia, or immunosuppressive agents. MRI shows bilateral white matter edema in parieto-occipital regions. Management: aggressive blood pressure control and removal of inciting agent."
    },
    riskFactors: [
      "Family history of neurological disease (first-degree relative)",
      "Chronic migraine with aura (increased stroke risk in women on OCPs)",
      "Obesity and metabolic syndrome with neuroinflammation",
      "Diabetes with peripheral and autonomic neuropathy",
      "Prior head trauma or TBI history",
      "Atrial fibrillation with cardioembolic stroke risk",
      "Chronic alcohol use with neurotoxicity"
    ],
    diagnostics: [
      "CT angiography of head and neck (vessel occlusion, aneurysm, dissection)",
      "Visual field testing and fundoscopic exam for papilledema",
      "Neuropsychological testing for cognitive domain assessment",
      "EMG/NCS for peripheral neuropathy, radiculopathy, myopathy evaluation",
      "Lumbar puncture with CSF analysis (cell count, protein, glucose, cultures, oligoclonal bands)",
      "Glasgow Coma Scale (GCS) for consciousness level assessment",
      "EEG for seizure characterization and localization"
    ],
    management: [
      "Antiepileptic drug monotherapy: levetiracetam, lamotrigine, or valproate",
      "Neurosurgical consultation for mass lesions, hemorrhage, or hydrocephalus",
      "Supportive care: HOB elevation 30 degrees, normothermia, euglycemia",
      "Cholinesterase inhibitors (donepezil) for Alzheimer's cognitive decline",
      "Blood pressure management per AHA stroke guidelines",
      "Disease-modifying therapy for MS (ocrelizumab, natalizumab, fingolimod)",
      "Osmotic therapy (mannitol 20% or hypertonic saline 3%) for cerebral edema"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Alteplase (tPA/Activase)",
        type: "Tissue Plasminogen Activator",
        action: "Converts plasminogen to plasmin dissolving fibrin clots and restoring cerebral perfusion",
        sideEffects: "Intracranial hemorrhage (6.4%), systemic bleeding, angioedema",
        contra: "Active bleeding, recent surgery <14 days, INR >1.7, platelets <100K, BP >185/110 despite treatment",
        pearl: "Dose: 0.9mg/kg (max 90mg), 10% bolus + 60min infusion. Door-to-needle <60 min. Tenecteplase emerging alternative."
      },
      {
        name: "Carbidopa-Levodopa (Sinemet)",
        type: "Dopamine Precursor",
        action: "Levodopa crosses BBB and converts to dopamine; carbidopa prevents peripheral decarboxylation",
        sideEffects: "Dyskinesias, wearing-off, orthostatic hypotension, hallucinations, impulse control disorders",
        contra: "Concurrent non-selective MAOi, narrow-angle glaucoma",
        pearl: "Start 25/100mg TID. Protein competes for absorption. Watch for wearing-off at 3-5 years (honeymoon period)."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Central Pontine Myelinolysis requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with central pontine myelinolysis. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for central pontine myelinolysis."
      }
    ]
  },
  "pres-np": {
    title: "Posterior Reversible Encephalopathy (PRES)",
    cellular: {
      title: "Pathophysiology of Posterior Reversible Encephalopathy (PRES)",
      content: "Posterior Reversible Encephalopathy (PRES) involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Posterior Reversible Encephalopathy (PRES) pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for posterior reversible encephalopathy (pres)",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for posterior reversible encephalopathy (pres)",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for posterior reversible encephalopathy (pres)",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of posterior reversible encephalopathy (pres)",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to posterior reversible encephalopathy (pres)",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of posterior reversible encephalopathy (pres)",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for posterior reversible encephalopathy (pres). Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Posterior Reversible Encephalopathy (PRES) requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of posterior reversible encephalopathy (pres)"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with posterior reversible encephalopathy (pres). What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for posterior reversible encephalopathy (pres)."
      }
    ]
  },
  "cavernous-sinus-thrombosis-np": {
    title: "Cavernous Sinus Thrombosis: Diagnosis",
    cellular: {
      title: "Pathophysiology of Cavernous Sinus Thrombosis",
      content: "Cavernous Sinus Thrombosis: Diagnosis involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Cavernous Sinus Thrombosis pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for cavernous sinus thrombosis",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for cavernous sinus thrombosis",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for cavernous sinus thrombosis",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of cavernous sinus thrombosis",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to cavernous sinus thrombosis",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of cavernous sinus thrombosis",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for cavernous sinus thrombosis. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Cavernous Sinus Thrombosis requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of cavernous sinus thrombosis"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with cavernous sinus thrombosis. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for cavernous sinus thrombosis."
      }
    ]
  },
  "cerebral-venous-sinus-thrombosis-np": {
    title: "Cerebral Venous Sinus Thrombosis: Risk",
    cellular: {
      title: "Pathophysiology of Cerebral Venous Sinus Thrombosis",
      content: "Cerebral Venous Sinus Thrombosis: Risk involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Cerebral Venous Sinus Thrombosis pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Prior CNS infection (increased seizure risk)",
      "Autoimmune conditions (MS, myasthenia gravis predisposition)",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)",
      "Family history of neurological disease (first-degree relative)",
      "Age >65 with progressive neurodegenerative risk",
      "Chronic alcohol use with neurotoxicity",
      "Hypertension (leading modifiable risk for stroke)"
    ],
    diagnostics: [
      "Genetic testing when hereditary neurological condition suspected",
      "MRA or CTA for intracranial vascular evaluation",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening",
      "CT angiography of head and neck (vessel occlusion, aneurysm, dissection)",
      "CT head without contrast (acute hemorrhage, mass effect, midline shift)",
      "EEG for seizure characterization and localization",
      "MRI brain with/without gadolinium (ischemia, demyelination, tumors)"
    ],
    management: [
      "Palliative care and goals of care discussion for progressive diseases",
      "DVT prophylaxis with SCDs and pharmacologic when safe",
      "Rehabilitation: PT, OT, speech therapy for functional recovery",
      "Antiepileptic drug monotherapy: levetiracetam, lamotrigine, or valproate",
      "tPA within 4.5 hours of ischemic stroke onset (NINDS criteria)",
      "Osmotic therapy (mannitol 20% or hypertonic saline 3%) for cerebral edema",
      "Mechanical thrombectomy within 24 hours for large vessel occlusion (DAWN/DEFUSE 3)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Carbidopa-Levodopa (Sinemet)",
        type: "Dopamine Precursor",
        action: "Levodopa crosses BBB and converts to dopamine; carbidopa prevents peripheral decarboxylation",
        sideEffects: "Dyskinesias, wearing-off, orthostatic hypotension, hallucinations, impulse control disorders",
        contra: "Concurrent non-selective MAOi, narrow-angle glaucoma",
        pearl: "Start 25/100mg TID. Protein competes for absorption. Watch for wearing-off at 3-5 years (honeymoon period)."
      },
      {
        name: "Alteplase (tPA/Activase)",
        type: "Tissue Plasminogen Activator",
        action: "Converts plasminogen to plasmin dissolving fibrin clots and restoring cerebral perfusion",
        sideEffects: "Intracranial hemorrhage (6.4%), systemic bleeding, angioedema",
        contra: "Active bleeding, recent surgery <14 days, INR >1.7, platelets <100K, BP >185/110 despite treatment",
        pearl: "Dose: 0.9mg/kg (max 90mg), 10% bolus + 60min infusion. Door-to-needle <60 min. Tenecteplase emerging alternative."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Cerebral Venous Sinus Thrombosis requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with cerebral venous sinus thrombosis. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for cerebral venous sinus thrombosis."
      }
    ]
  },
  "brown-sequard-syndrome-np": {
    title: "Brown-Séquard Syndrome: Hemisection Patterns",
    cellular: {
      title: "Pathophysiology of Brown-Séquard Syndrome",
      content: "Brown-Sequard syndrome results from lateral hemisection of the spinal cord. Ipsilateral motor paralysis (corticospinal tract), ipsilateral loss of proprioception and vibration (dorsal columns), and contralateral loss of pain and temperature (spinothalamic tract) 1-2 levels below the lesion. Most commonly caused by penetrating trauma. This pattern has the best prognosis of all incomplete cord syndromes."
    },
    riskFactors: [
      "Chronic alcohol use with neurotoxicity",
      "Prior CNS infection (increased seizure risk)",
      "Age >65 with progressive neurodegenerative risk",
      "Atrial fibrillation with cardioembolic stroke risk",
      "Diabetes with peripheral and autonomic neuropathy",
      "Autoimmune conditions (MS, myasthenia gravis predisposition)",
      "Tobacco use with cerebrovascular disease risk"
    ],
    diagnostics: [
      "EEG for seizure characterization and localization",
      "Genetic testing when hereditary neurological condition suspected",
      "CT head without contrast (acute hemorrhage, mass effect, midline shift)",
      "Glasgow Coma Scale (GCS) for consciousness level assessment",
      "EMG/NCS for peripheral neuropathy, radiculopathy, myopathy evaluation",
      "MRA or CTA for intracranial vascular evaluation",
      "NIH Stroke Scale (NIHSS) for stroke severity quantification"
    ],
    management: [
      "Osmotic therapy (mannitol 20% or hypertonic saline 3%) for cerebral edema",
      "Palliative care and goals of care discussion for progressive diseases",
      "tPA within 4.5 hours of ischemic stroke onset (NINDS criteria)",
      "Disease-modifying therapy for MS (ocrelizumab, natalizumab, fingolimod)",
      "Cholinesterase inhibitors (donepezil) for Alzheimer's cognitive decline",
      "DVT prophylaxis with SCDs and pharmacologic when safe",
      "Dopaminergic therapy (carbidopa-levodopa) for Parkinson disease motor symptoms"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Levetiracetam (Keppra)",
        type: "Antiepileptic (SV2A modulator)",
        action: "Binds synaptic vesicle protein 2A (SV2A) modulating neurotransmitter release",
        sideEffects: "Behavioral changes (irritability, aggression), somnolence, dizziness",
        contra: "Known hypersensitivity; dose-adjust for renal impairment",
        pearl: "First-line for many seizure types. Start 500mg BID, titrate to 1500mg BID. No hepatic metabolism. Keppra rage: consider brivaracetam."
      },
      {
        name: "Donepezil (Aricept)",
        type: "Cholinesterase Inhibitor",
        action: "Reversibly inhibits acetylcholinesterase increasing ACh availability at synaptic cleft",
        sideEffects: "Nausea, diarrhea, insomnia, bradycardia, vivid dreams",
        contra: "Sick sinus syndrome without pacemaker, GI obstruction",
        pearl: "Start 5mg QHS, increase to 10mg after 4-6 weeks. Modest cognitive benefit. Consider memantine addition for moderate-severe AD."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Brown-Séquard Syndrome requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with brown-séquard syndrome. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for brown-séquard syndrome."
      }
    ]
  },
  "locked-in-syndrome-np": {
    title: "Locked-In Syndrome: Assessment",
    cellular: {
      title: "Pathophysiology of Locked-In Syndrome",
      content: "Locked-In Syndrome: Assessment involves systematic clinical evaluation skills essential for NP practice. Locked-In Syndrome requires integration of subjective data (patient history), objective findings (physical examination), and clinical reasoning to formulate accurate diagnoses and evidence-based management plans."
    },
    riskFactors: [
      "Incomplete history leading to missed diagnoses",
      "Anchoring bias in differential diagnosis formulation",
      "Premature closure without considering alternatives",
      "Inadequate physical examination technique",
      "Failure to recognize red flag symptoms",
      "Over-reliance on testing without clinical correlation",
      "Communication barriers affecting history accuracy",
      "Time pressure leading to abbreviated assessment",
      "Cognitive biases (availability, confirmation) affecting clinical reasoning",
      "Insufficient follow-up on abnormal findings"
    ],
    diagnostics: [
      "Comprehensive health history (HPI, PMH, FH, SH, ROS)",
      "Systematic physical examination with documentation",
      "Validated clinical decision tools and scoring systems",
      "Point-of-care testing for rapid clinical decisions",
      "Laboratory studies targeted to clinical presentation",
      "Imaging studies selected by clinical indication",
      "Specialist-specific examination techniques"
    ],
    management: [
      "Evidence-based first-line therapy for locked-in syndrome per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Subjective findings from patient history",
        "Pain assessment using validated scales",
        "Functional status evaluation",
        "Symptom characterization (onset, duration, severity, quality)"
      ],
      right: [
        "Objective physical examination findings",
        "Vital sign abnormalities and trending",
        "Laboratory and imaging results",
        "Clinical scoring tool calculations"
      ]
    },
    medications: [
      {
        name: "Clinical Assessment Tools",
        type: "Diagnostic",
        action: "Standardized scoring systems quantify clinical findings for decision-making",
        sideEffects: "Over-reliance without clinical correlation",
        contra: "Use as sole diagnostic criterion without clinical judgment",
        pearl: "Common tools: NIHSS (stroke), Wells (PE/DVT), CURB-65 (pneumonia), HEART (chest pain), qSOFA (sepsis), GCS (consciousness), MMSE/MoCA (cognition)."
      },
      {
        name: "Evidence-Based Practice Framework",
        type: "Clinical Decision Support",
        action: "Integrates best available evidence with clinical expertise and patient preferences",
        sideEffects: "Guideline rigidity without individualization",
        contra: "Applying population-level evidence without patient-specific consideration",
        pearl: "PICO framework guides clinical questions. Use UpToDate, PubMed, Cochrane for evidence. US Preventive Services Task Force (USPSTF) grades preventive recommendations."
      }
    ],
    pearls: [
      "Locked-In Syndrome requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Locked-In Syndrome management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with locked-in syndrome. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of locked-in syndrome."
      }
    ]
  },
  "alzheimer-disease-np": {
    title: "Alzheimer Disease",
    cellular: {
      title: "Pathophysiology of Alzheimer Disease",
      content: "Alzheimer Disease involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Alzheimer Disease pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Age >65 with progressive neurodegenerative risk",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)",
      "Occupational toxin exposure (heavy metals, organophosphates)",
      "Prior head trauma or TBI history",
      "Hypertension (leading modifiable risk for stroke)",
      "Diabetes with peripheral and autonomic neuropathy",
      "Family history of neurological disease (first-degree relative)"
    ],
    diagnostics: [
      "CT head without contrast (acute hemorrhage, mass effect, midline shift)",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening",
      "Specific autoantibody panels (AChR, anti-MOG, anti-NMDA receptor)",
      "Lumbar puncture with CSF analysis (cell count, protein, glucose, cultures, oligoclonal bands)",
      "MRI brain with/without gadolinium (ischemia, demyelination, tumors)",
      "EMG/NCS for peripheral neuropathy, radiculopathy, myopathy evaluation",
      "CT angiography of head and neck (vessel occlusion, aneurysm, dissection)"
    ],
    management: [
      "tPA within 4.5 hours of ischemic stroke onset (NINDS criteria)",
      "Rehabilitation: PT, OT, speech therapy for functional recovery",
      "Seizure precautions and driving restriction counseling",
      "Blood pressure management per AHA stroke guidelines",
      "Mechanical thrombectomy within 24 hours for large vessel occlusion (DAWN/DEFUSE 3)",
      "Cholinesterase inhibitors (donepezil) for Alzheimer's cognitive decline",
      "Antiepileptic drug monotherapy: levetiracetam, lamotrigine, or valproate"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Alteplase (tPA/Activase)",
        type: "Tissue Plasminogen Activator",
        action: "Converts plasminogen to plasmin dissolving fibrin clots and restoring cerebral perfusion",
        sideEffects: "Intracranial hemorrhage (6.4%), systemic bleeding, angioedema",
        contra: "Active bleeding, recent surgery <14 days, INR >1.7, platelets <100K, BP >185/110 despite treatment",
        pearl: "Dose: 0.9mg/kg (max 90mg), 10% bolus + 60min infusion. Door-to-needle <60 min. Tenecteplase emerging alternative."
      },
      {
        name: "Carbidopa-Levodopa (Sinemet)",
        type: "Dopamine Precursor",
        action: "Levodopa crosses BBB and converts to dopamine; carbidopa prevents peripheral decarboxylation",
        sideEffects: "Dyskinesias, wearing-off, orthostatic hypotension, hallucinations, impulse control disorders",
        contra: "Concurrent non-selective MAOi, narrow-angle glaucoma",
        pearl: "Start 25/100mg TID. Protein competes for absorption. Watch for wearing-off at 3-5 years (honeymoon period)."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Alzheimer Disease requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with alzheimer disease. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for alzheimer disease."
      }
    ]
  },
  "guillain-barre-np": {
    title: "Guillain-Barre Syndrome",
    cellular: {
      title: "Pathophysiology of Guillain-Barre Syndrome",
      content: "Guillain-Barre Syndrome involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Guillain-Barre Syndrome pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Diabetes with peripheral and autonomic neuropathy",
      "Age >65 with progressive neurodegenerative risk",
      "Hypertension (leading modifiable risk for stroke)",
      "Sleep deprivation or circadian rhythm disruption",
      "Tobacco use with cerebrovascular disease risk",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)",
      "Atrial fibrillation with cardioembolic stroke risk"
    ],
    diagnostics: [
      "EMG/NCS for peripheral neuropathy, radiculopathy, myopathy evaluation",
      "CT head without contrast (acute hemorrhage, mass effect, midline shift)",
      "MRI brain with/without gadolinium (ischemia, demyelination, tumors)",
      "Carotid duplex ultrasound for extracranial stenosis",
      "NIH Stroke Scale (NIHSS) for stroke severity quantification",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening",
      "Glasgow Coma Scale (GCS) for consciousness level assessment"
    ],
    management: [
      "Cholinesterase inhibitors (donepezil) for Alzheimer's cognitive decline",
      "tPA within 4.5 hours of ischemic stroke onset (NINDS criteria)",
      "Mechanical thrombectomy within 24 hours for large vessel occlusion (DAWN/DEFUSE 3)",
      "Migraine prevention: CGRP monoclonal antibodies, topiramate, or propranolol",
      "Dopaminergic therapy (carbidopa-levodopa) for Parkinson disease motor symptoms",
      "Rehabilitation: PT, OT, speech therapy for functional recovery",
      "Disease-modifying therapy for MS (ocrelizumab, natalizumab, fingolimod)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Carbidopa-Levodopa (Sinemet)",
        type: "Dopamine Precursor",
        action: "Levodopa crosses BBB and converts to dopamine; carbidopa prevents peripheral decarboxylation",
        sideEffects: "Dyskinesias, wearing-off, orthostatic hypotension, hallucinations, impulse control disorders",
        contra: "Concurrent non-selective MAOi, narrow-angle glaucoma",
        pearl: "Start 25/100mg TID. Protein competes for absorption. Watch for wearing-off at 3-5 years (honeymoon period)."
      },
      {
        name: "Alteplase (tPA/Activase)",
        type: "Tissue Plasminogen Activator",
        action: "Converts plasminogen to plasmin dissolving fibrin clots and restoring cerebral perfusion",
        sideEffects: "Intracranial hemorrhage (6.4%), systemic bleeding, angioedema",
        contra: "Active bleeding, recent surgery <14 days, INR >1.7, platelets <100K, BP >185/110 despite treatment",
        pearl: "Dose: 0.9mg/kg (max 90mg), 10% bolus + 60min infusion. Door-to-needle <60 min. Tenecteplase emerging alternative."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Guillain-Barre Syndrome requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with guillain-barre syndrome. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for guillain-barre syndrome."
      }
    ]
  },
  "myasthenia-gravis-np": {
    title: "Myasthenia Gravis",
    cellular: {
      title: "Pathophysiology of Myasthenia Gravis",
      content: "Myasthenia Gravis involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Myasthenia Gravis pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Autoimmune conditions (MS, myasthenia gravis predisposition)",
      "Chronic alcohol use with neurotoxicity",
      "Diabetes with peripheral and autonomic neuropathy",
      "Chronic migraine with aura (increased stroke risk in women on OCPs)",
      "Genetic mutations (Huntington HTT, APOE4 for Alzheimer's)",
      "Prior CNS infection (increased seizure risk)",
      "Occupational toxin exposure (heavy metals, organophosphates)"
    ],
    diagnostics: [
      "MRA or CTA for intracranial vascular evaluation",
      "EEG for seizure characterization and localization",
      "EMG/NCS for peripheral neuropathy, radiculopathy, myopathy evaluation",
      "Visual field testing and fundoscopic exam for papilledema",
      "Mini-Mental State Exam (MMSE) or MoCA for cognitive screening",
      "Genetic testing when hereditary neurological condition suspected",
      "Specific autoantibody panels (AChR, anti-MOG, anti-NMDA receptor)"
    ],
    management: [
      "DVT prophylaxis with SCDs and pharmacologic when safe",
      "Osmotic therapy (mannitol 20% or hypertonic saline 3%) for cerebral edema",
      "Cholinesterase inhibitors (donepezil) for Alzheimer's cognitive decline",
      "Neurosurgical consultation for mass lesions, hemorrhage, or hydrocephalus",
      "Rehabilitation: PT, OT, speech therapy for functional recovery",
      "Palliative care and goals of care discussion for progressive diseases",
      "Seizure precautions and driving restriction counseling"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Alteplase (tPA/Activase)",
        type: "Tissue Plasminogen Activator",
        action: "Converts plasminogen to plasmin dissolving fibrin clots and restoring cerebral perfusion",
        sideEffects: "Intracranial hemorrhage (6.4%), systemic bleeding, angioedema",
        contra: "Active bleeding, recent surgery <14 days, INR >1.7, platelets <100K, BP >185/110 despite treatment",
        pearl: "Dose: 0.9mg/kg (max 90mg), 10% bolus + 60min infusion. Door-to-needle <60 min. Tenecteplase emerging alternative."
      },
      {
        name: "Carbidopa-Levodopa (Sinemet)",
        type: "Dopamine Precursor",
        action: "Levodopa crosses BBB and converts to dopamine; carbidopa prevents peripheral decarboxylation",
        sideEffects: "Dyskinesias, wearing-off, orthostatic hypotension, hallucinations, impulse control disorders",
        contra: "Concurrent non-selective MAOi, narrow-angle glaucoma",
        pearl: "Start 25/100mg TID. Protein competes for absorption. Watch for wearing-off at 3-5 years (honeymoon period)."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Myasthenia Gravis requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with myasthenia gravis. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for myasthenia gravis."
      }
    ]
  },
  "thyroid-storm-np": {
    title: "Thyroid Storm: Receptor Blockade",
    cellular: {
      title: "Pathophysiology of Thyroid Storm",
      content: "Thyroid disorders involve HPT axis dysregulation. Hashimoto (anti-TPO antibodies) causes hypothyroidism through lymphocytic infiltration and follicular destruction. Graves (TSI/TRAb) causes hyperthyroidism via TSH receptor stimulation. TSH is the best screening test. Levothyroxine 1.6 mcg/kg/day for hypothyroidism; check TSH at 6-8 weeks after dose changes. Toxic multinodular goiter develops from autonomous nodules producing excess thyroid hormone independently of TSH."
    },
    riskFactors: [
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "Age-related hormonal decline (menopause, andropause)",
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "MEN syndrome family history"
    ],
    diagnostics: [
      "Prolactin level for pituitary evaluation",
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis",
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "IGF-1 for growth hormone excess or deficiency screening",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "24-hour urine free cortisol for Cushing confirmation"
    ],
    management: [
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM",
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Diabetes self-management education and support (DSMES)",
      "Bisphosphonate therapy for osteoporosis with DEXA monitoring"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Thyroid Storm management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected thyroid storm. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for thyroid storm",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for thyroid storm while being cost-effective."
      }
    ]
  },
  "adrenal-crisis-np": {
    title: "Adrenal Crisis: Acute Management",
    cellular: {
      title: "Pathophysiology of Adrenal Crisis",
      content: "Adrenal Crisis: Acute Management involves dysregulation of hormonal signaling pathways, feedback mechanisms, and metabolic homeostasis affecting adrenal crisis physiology."
    },
    riskFactors: [
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Prior radiation to head/neck affecting thyroid or pituitary",
      "Iodine deficiency or excess affecting thyroid function",
      "Eating disorders with hypothalamic amenorrhea",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency"
    ],
    diagnostics: [
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "Dexamethasone suppression test (1mg overnight) for Cushing screening",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Plasma metanephrines for pheochromocytoma screening",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "TSH (most sensitive for primary thyroid dysfunction)",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)"
    ],
    management: [
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Medical nutrition therapy with carbohydrate counting",
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM",
      "Diabetes self-management education and support (DSMES)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      },
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Adrenal Crisis management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected adrenal crisis. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for adrenal crisis",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for adrenal crisis while being cost-effective."
      }
    ]
  },
  "cushing-syndrome-np": {
    title: "Cushing Syndrome: Diagnosis & Etiology",
    cellular: {
      title: "Pathophysiology of Cushing Syndrome",
      content: "Cushing syndrome results from chronic glucocorticoid excess. Exogenous (most common: iatrogenic steroids) or endogenous (ACTH-dependent: pituitary adenoma 70%, ectopic ACTH 15%; ACTH-independent: adrenal adenoma/carcinoma 15%). Screening: 24h urine free cortisol, late-night salivary cortisol, 1mg overnight dexamethasone suppression test. Clinical features: central obesity, moon face, buffalo hump, striae, proximal weakness, glucose intolerance."
    },
    riskFactors: [
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Eating disorders with hypothalamic amenorrhea",
      "Prior radiation to head/neck affecting thyroid or pituitary",
      "Age-related hormonal decline (menopause, andropause)",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Chronic corticosteroid use with HPA axis suppression"
    ],
    diagnostics: [
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Plasma metanephrines for pheochromocytoma screening",
      "Dexamethasone suppression test (1mg overnight) for Cushing screening",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis",
      "Prolactin level for pituitary evaluation",
      "Morning cortisol (8 AM) and ACTH for adrenal function"
    ],
    management: [
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Diabetes self-management education and support (DSMES)",
      "Medical nutrition therapy with carbohydrate counting",
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "SGLT2 inhibitor or GLP-1 RA for T2DM with CV disease or CKD"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Cushing Syndrome management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected cushing syndrome. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for cushing syndrome",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for cushing syndrome while being cost-effective."
      }
    ]
  },
  "hyperaldosteronism-np": {
    title: "Hyperaldosteronism: Conn Syndrome & Screening",
    cellular: {
      title: "Pathophysiology of Hyperaldosteronism",
      content: "Hyperaldosteronism: Conn Syndrome & Screening involves dysregulation of hormonal signaling pathways, feedback mechanisms, and metabolic homeostasis affecting hyperaldosteronism physiology."
    },
    riskFactors: [
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)",
      "Eating disorders with hypothalamic amenorrhea",
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "Sleep deprivation disrupting cortisol and growth hormone secretion"
    ],
    diagnostics: [
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Prolactin level for pituitary evaluation",
      "IGF-1 for growth hormone excess or deficiency screening",
      "TSH (most sensitive for primary thyroid dysfunction)",
      "Plasma metanephrines for pheochromocytoma screening",
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "Pituitary MRI for sellar/suprasellar mass evaluation"
    ],
    management: [
      "Diabetes self-management education and support (DSMES)",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM",
      "Medical nutrition therapy with carbohydrate counting",
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Hyperaldosteronism management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected hyperaldosteronism. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for hyperaldosteronism",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for hyperaldosteronism while being cost-effective."
      }
    ]
  },
  "pheochromocytoma-np": {
    title: "Pheochromocytoma: Catecholamine Crisis",
    cellular: {
      title: "Pathophysiology of Pheochromocytoma",
      content: "Pheochromocytoma: Catecholamine Crisis involves dysregulation of hormonal signaling pathways, feedback mechanisms, and metabolic homeostasis affecting pheochromocytoma physiology."
    },
    riskFactors: [
      "Obesity (BMI >30) with insulin resistance",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Chronic corticosteroid use with HPA axis suppression",
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "Iodine deficiency or excess affecting thyroid function",
      "Age-related hormonal decline (menopause, andropause)"
    ],
    diagnostics: [
      "Free T4 and Free T3 for thyroid hormone assessment",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Morning cortisol (8 AM) and ACTH for adrenal function",
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis"
    ],
    management: [
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Diabetes self-management education and support (DSMES)",
      "SGLT2 inhibitor or GLP-1 RA for T2DM with CV disease or CKD",
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Pheochromocytoma management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected pheochromocytoma. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for pheochromocytoma",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for pheochromocytoma while being cost-effective."
      }
    ]
  },
  "hypercalcemia-malignancy-np": {
    title: "Hypercalcemia of Malignancy: PTHrP",
    cellular: {
      title: "Pathophysiology of Hypercalcemia of Malignancy",
      content: "Hypercalcemia of Malignancy: PTHrP involves dysregulation of hormonal signaling pathways, feedback mechanisms, and metabolic homeostasis affecting hypercalcemia of malignancy physiology."
    },
    riskFactors: [
      "Iodine deficiency or excess affecting thyroid function",
      "Obesity (BMI >30) with insulin resistance",
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "MEN syndrome family history",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)"
    ],
    diagnostics: [
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "24-hour urine free cortisol for Cushing confirmation",
      "Prolactin level for pituitary evaluation",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "IGF-1 for growth hormone excess or deficiency screening"
    ],
    management: [
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Bisphosphonate therapy for osteoporosis with DEXA monitoring",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Calcium + vitamin D supplementation for hypoparathyroidism"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Hypercalcemia of Malignancy management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected hypercalcemia of malignancy. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for hypercalcemia of malignancy",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for hypercalcemia of malignancy while being cost-effective."
      }
    ]
  },
  "hyponatremia-correction-np": {
    title: "Hyponatremia: Osmotic Demyelination",
    cellular: {
      title: "Pathophysiology of Hyponatremia",
      content: "Hyponatremia: Osmotic Demyelination involves dysregulation of hormonal signaling pathways, feedback mechanisms, and metabolic homeostasis affecting hyponatremia physiology."
    },
    riskFactors: [
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Iodine deficiency or excess affecting thyroid function",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Sleep deprivation disrupting cortisol and growth hormone secretion",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Obesity (BMI >30) with insulin resistance",
      "Eating disorders with hypothalamic amenorrhea"
    ],
    diagnostics: [
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Prolactin level for pituitary evaluation",
      "Pituitary MRI for sellar/suprasellar mass evaluation",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "Plasma metanephrines for pheochromocytoma screening"
    ],
    management: [
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)",
      "Diabetes self-management education and support (DSMES)",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Medical nutrition therapy with carbohydrate counting"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      },
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Hyponatremia management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected hyponatremia. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for hyponatremia",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for hyponatremia while being cost-effective."
      }
    ]
  },
  "men-syndromes-np": {
    title: "MEN Syndromes: Type 1, 2A & 2B Classification",
    cellular: {
      title: "Pathophysiology of MEN Syndromes",
      content: "Multiple Endocrine Neoplasia syndromes: MEN1 (3 P's: Parathyroid hyperplasia, Pituitary tumors, Pancreatic neuroendocrine tumors; menin gene mutation on chromosome 11). MEN2A (Medullary thyroid carcinoma, Pheochromocytoma, Primary hyperparathyroidism; RET proto-oncogene mutation). MEN2B (MTC, pheochromocytoma, mucosal neuromas, marfanoid habitus; RET mutation). Prophylactic thyroidectomy recommended in MEN2 carriers."
    },
    riskFactors: [
      "Eating disorders with hypothalamic amenorrhea",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "MEN syndrome family history",
      "Obesity (BMI >30) with insulin resistance",
      "Sleep deprivation disrupting cortisol and growth hormone secretion",
      "Age-related hormonal decline (menopause, andropause)",
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)"
    ],
    diagnostics: [
      "Plasma metanephrines for pheochromocytoma screening",
      "IGF-1 for growth hormone excess or deficiency screening",
      "24-hour urine free cortisol for Cushing confirmation",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "Pituitary MRI for sellar/suprasellar mass evaluation",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis",
      "TSH (most sensitive for primary thyroid dysfunction)"
    ],
    management: [
      "Medical nutrition therapy with carbohydrate counting",
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Bisphosphonate therapy for osteoporosis with DEXA monitoring",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM",
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Decreases hepatic glucose production, increases insulin sensitivity, reduces intestinal glucose absorption",
        sideEffects: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)",
        contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate), acute/chronic metabolic acidosis",
        pearl: "Start 500mg with dinner, increase by 500mg weekly. Extended-release reduces GI side effects. Hold for iodinated contrast if eGFR <45."
      },
      {
        name: "Semaglutide (Ozempic/Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics incretin GLP-1: stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety",
        sideEffects: "Nausea (dose-dependent), vomiting, diarrhea, pancreatitis risk, injection site reactions",
        contra: "Personal/family history of medullary thyroid carcinoma, MEN2 syndrome",
        pearl: "Start 0.25mg SC weekly x4 weeks, titrate monthly. SUSTAIN-6: 26% MACE reduction. Wegovy approved for weight management."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "MEN Syndromes management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected men syndromes. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for men syndromes",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for men syndromes while being cost-effective."
      }
    ]
  },
  "carcinoid-syndrome-np": {
    title: "Carcinoid Syndrome: Serotonin & 5-HIAA",
    cellular: {
      title: "Pathophysiology of Carcinoid Syndrome",
      content: "Carcinoid syndrome occurs when neuroendocrine tumors secrete serotonin (5-HT) and other vasoactive substances that bypass hepatic metabolism (hepatic metastases or primary extra-GI tumors). Clinical features: flushing, diarrhea, wheezing, right-sided heart valvular disease (endocardial fibrosis from serotonin). Diagnosis: 24-hour urine 5-HIAA (>25 mg/24h diagnostic). Chromogranin A is a general neuroendocrine tumor marker. Treatment: octreotide (somatostatin analog) for symptom control."
    },
    riskFactors: [
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Iodine deficiency or excess affecting thyroid function",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Sleep deprivation disrupting cortisol and growth hormone secretion",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Obesity (BMI >30) with insulin resistance",
      "Eating disorders with hypothalamic amenorrhea"
    ],
    diagnostics: [
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Prolactin level for pituitary evaluation",
      "Pituitary MRI for sellar/suprasellar mass evaluation",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "Plasma metanephrines for pheochromocytoma screening"
    ],
    management: [
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)",
      "Diabetes self-management education and support (DSMES)",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Medical nutrition therapy with carbohydrate counting"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      },
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Carcinoid Syndrome management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected carcinoid syndrome. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for carcinoid syndrome",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for carcinoid syndrome while being cost-effective."
      }
    ]
  },
  "insulinoma-np": {
    title: "Insulinoma: Whipple Triad",
    cellular: {
      title: "Pathophysiology of Insulinoma",
      content: "Insulinoma: Whipple Triad involves dysregulation of hormonal signaling pathways, feedback mechanisms, and metabolic homeostasis affecting insulinoma physiology."
    },
    riskFactors: [
      "Prior radiation to head/neck affecting thyroid or pituitary",
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)",
      "Obesity (BMI >30) with insulin resistance",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "Iodine deficiency or excess affecting thyroid function",
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)"
    ],
    diagnostics: [
      "Dexamethasone suppression test (1mg overnight) for Cushing screening",
      "TSH (most sensitive for primary thyroid dysfunction)",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "IGF-1 for growth hormone excess or deficiency screening",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "Prolactin level for pituitary evaluation"
    ],
    management: [
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)",
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Decreases hepatic glucose production, increases insulin sensitivity, reduces intestinal glucose absorption",
        sideEffects: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)",
        contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate), acute/chronic metabolic acidosis",
        pearl: "Start 500mg with dinner, increase by 500mg weekly. Extended-release reduces GI side effects. Hold for iodinated contrast if eGFR <45."
      },
      {
        name: "Semaglutide (Ozempic/Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics incretin GLP-1: stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety",
        sideEffects: "Nausea (dose-dependent), vomiting, diarrhea, pancreatitis risk, injection site reactions",
        contra: "Personal/family history of medullary thyroid carcinoma, MEN2 syndrome",
        pearl: "Start 0.25mg SC weekly x4 weeks, titrate monthly. SUSTAIN-6: 26% MACE reduction. Wegovy approved for weight management."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Insulinoma management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected insulinoma. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for insulinoma",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for insulinoma while being cost-effective."
      }
    ]
  },
  "conn-syndrome-np": {
    title: "Conn Syndrome: Primary Aldosteronism & ARR",
    cellular: {
      title: "Pathophysiology of Conn Syndrome",
      content: "Conn Syndrome: Primary Aldosteronism & ARR involves dysregulation of hormonal signaling pathways, feedback mechanisms, and metabolic homeostasis affecting conn syndrome physiology."
    },
    riskFactors: [
      "Iodine deficiency or excess affecting thyroid function",
      "Obesity (BMI >30) with insulin resistance",
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "MEN syndrome family history",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)"
    ],
    diagnostics: [
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "24-hour urine free cortisol for Cushing confirmation",
      "Prolactin level for pituitary evaluation",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "IGF-1 for growth hormone excess or deficiency screening"
    ],
    management: [
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Bisphosphonate therapy for osteoporosis with DEXA monitoring",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Calcium + vitamin D supplementation for hypoparathyroidism"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Semaglutide (Ozempic/Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics incretin GLP-1: stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety",
        sideEffects: "Nausea (dose-dependent), vomiting, diarrhea, pancreatitis risk, injection site reactions",
        contra: "Personal/family history of medullary thyroid carcinoma, MEN2 syndrome",
        pearl: "Start 0.25mg SC weekly x4 weeks, titrate monthly. SUSTAIN-6: 26% MACE reduction. Wegovy approved for weight management."
      },
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Decreases hepatic glucose production, increases insulin sensitivity, reduces intestinal glucose absorption",
        sideEffects: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)",
        contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate), acute/chronic metabolic acidosis",
        pearl: "Start 500mg with dinner, increase by 500mg weekly. Extended-release reduces GI side effects. Hold for iodinated contrast if eGFR <45."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Conn Syndrome management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected conn syndrome. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for conn syndrome",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for conn syndrome while being cost-effective."
      }
    ]
  },
  "myxedema-coma-np": {
    title: "Myxedema Coma: Emergency Thyroid Replacement",
    cellular: {
      title: "Pathophysiology of Myxedema Coma",
      content: "Thyroid disorders involve HPT axis dysregulation. Hashimoto (anti-TPO antibodies) causes hypothyroidism through lymphocytic infiltration and follicular destruction. Graves (TSI/TRAb) causes hyperthyroidism via TSH receptor stimulation. TSH is the best screening test. Levothyroxine 1.6 mcg/kg/day for hypothyroidism; check TSH at 6-8 weeks after dose changes. Toxic multinodular goiter develops from autonomous nodules producing excess thyroid hormone independently of TSH."
    },
    riskFactors: [
      "Obesity (BMI >30) with insulin resistance",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Chronic corticosteroid use with HPA axis suppression",
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "Iodine deficiency or excess affecting thyroid function",
      "Age-related hormonal decline (menopause, andropause)"
    ],
    diagnostics: [
      "Free T4 and Free T3 for thyroid hormone assessment",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Morning cortisol (8 AM) and ACTH for adrenal function",
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis"
    ],
    management: [
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Diabetes self-management education and support (DSMES)",
      "SGLT2 inhibitor or GLP-1 RA for T2DM with CV disease or CKD",
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Decreases hepatic glucose production, increases insulin sensitivity, reduces intestinal glucose absorption",
        sideEffects: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)",
        contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate), acute/chronic metabolic acidosis",
        pearl: "Start 500mg with dinner, increase by 500mg weekly. Extended-release reduces GI side effects. Hold for iodinated contrast if eGFR <45."
      },
      {
        name: "Semaglutide (Ozempic/Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics incretin GLP-1: stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety",
        sideEffects: "Nausea (dose-dependent), vomiting, diarrhea, pancreatitis risk, injection site reactions",
        contra: "Personal/family history of medullary thyroid carcinoma, MEN2 syndrome",
        pearl: "Start 0.25mg SC weekly x4 weeks, titrate monthly. SUSTAIN-6: 26% MACE reduction. Wegovy approved for weight management."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Myxedema Coma management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected myxedema coma. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for myxedema coma",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for myxedema coma while being cost-effective."
      }
    ]
  },
  "androgen-insensitivity-np": {
    title: "Androgen Insensitivity Syndrome: AR Gene",
    cellular: {
      title: "Pathophysiology of Androgen Insensitivity Syndrome",
      content: "Androgen Insensitivity Syndrome: AR Gene involves systematic interpretation of laboratory values, imaging studies, and diagnostic procedures essential for clinical decision-making in androgen insensitivity syndrome. Understanding sensitivity, specificity, positive and negative predictive values guides test selection and result interpretation."
    },
    riskFactors: [
      "Pre-analytical errors (specimen handling, timing, patient preparation)",
      "Interfering substances (hemolysis, lipemia, medications)",
      "Reference range variations by age, sex, and ethnicity",
      "Test selection bias and overtesting",
      "Failure to correlate results with clinical context",
      "Delayed specimen processing affecting accuracy",
      "Patient factors: fasting status, hydration, circadian variation"
    ],
    diagnostics: [
      "Appropriate test selection based on pre-test probability",
      "Proper specimen collection and handling protocols",
      "Reference range application with patient-specific adjustments",
      "Serial trending of values for clinical significance",
      "Sensitivity/specificity consideration for screening vs confirmatory tests",
      "Correlation of laboratory results with clinical presentation",
      "Critical value identification and urgent communication"
    ],
    management: [
      "Evidence-based first-line therapy for androgen insensitivity syndrome per current guidelines",
      "Non-pharmacological interventions as adjunct therapy",
      "Medication titration based on clinical response and monitoring",
      "Multidisciplinary care team coordination",
      "Patient-centered treatment plan with shared decision-making",
      "Complication monitoring and adverse effect surveillance",
      "Appropriate follow-up schedule and outcome measurement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Normal vs abnormal value identification",
        "Trending analysis over time",
        "Clinical correlation with symptoms",
        "Pre-test probability assessment"
      ],
      right: [
        "Critical value recognition and response",
        "Sensitivity and specificity interpretation",
        "False positive and false negative consideration",
        "Cost-effective test ordering strategy"
      ]
    },
    medications: [
      {
        name: "Laboratory Test Interpretation Framework",
        type: "Diagnostic Tool",
        action: "Systematic approach to interpreting lab values within clinical context including pre-analytical, analytical, and post-analytical phases",
        sideEffects: "Over-reliance on lab values without clinical correlation",
        contra: "Treating lab numbers in isolation from clinical presentation",
        pearl: "Always correlate labs with clinical picture. Know common interferences: hemolysis (falsely elevated K+, LDH), biotin (falsely decreased troponin, TSH), lipemia (falsely decreased sodium)."
      },
      {
        name: "Imaging Selection Guidelines",
        type: "Diagnostic Decision Support",
        action: "Evidence-based imaging selection using ACR Appropriateness Criteria to guide modality choice by clinical scenario",
        sideEffects: "Radiation exposure concerns with CT studies",
        contra: "Contrast administration in severe renal impairment or allergy without premedication",
        pearl: "ACR Appropriateness Criteria guide imaging selection. CT with contrast: hold metformin 48h if eGFR <30. MRI: screen for metallic implants. Ultrasound: no radiation, excellent for pregnant patients. Choose wisely: avoid unnecessary imaging."
      }
    ],
    pearls: [
      "Androgen Insensitivity Syndrome requires systematic evaluation with integration of clinical findings, laboratory data, and imaging before initiating treatment",
      "Evidence-based clinical practice guidelines should direct management decisions - stay current with guideline updates",
      "Androgen Insensitivity Syndrome management often requires individualized approach considering patient comorbidities, preferences, and treatment goals"
    ],
    quiz: [
      {
        question: "A patient presents with clinical findings consistent with androgen insensitivity syndrome. Which approach to initial evaluation is most appropriate?",
        options: [
          "Empiric treatment without diagnostic evaluation",
          "Systematic assessment with targeted history, examination, and appropriate diagnostic studies",
          "Immediate specialist referral without initial workup",
          "Serial observation without intervention or diagnostic testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation including focused history, physical examination, and appropriate diagnostic studies provides essential information for diagnosis, risk stratification, and evidence-based management of androgen insensitivity syndrome."
      }
    ]
  },
  "diabetes-pregnancy-np": {
    title: "Diabetes Management in Pregnancy: Glycemic",
    cellular: {
      title: "Pathophysiology of Diabetes Management in Pregnancy",
      content: "T2DM features insulin resistance and progressive beta-cell dysfunction. Insulin resistance from TNF-alpha, IL-6, free fatty acids impairs IRS phosphorylation. Beta-cell compensation fails through glucotoxicity and lipotoxicity. First-line: metformin + lifestyle. Second-line based on comorbidities: SGLT2i or GLP-1RA for ASCVD, HF, CKD."
    },
    riskFactors: [
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)",
      "Eating disorders with hypothalamic amenorrhea",
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "Sleep deprivation disrupting cortisol and growth hormone secretion"
    ],
    diagnostics: [
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Prolactin level for pituitary evaluation",
      "IGF-1 for growth hormone excess or deficiency screening",
      "TSH (most sensitive for primary thyroid dysfunction)",
      "Plasma metanephrines for pheochromocytoma screening",
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "Pituitary MRI for sellar/suprasellar mass evaluation"
    ],
    management: [
      "Diabetes self-management education and support (DSMES)",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM",
      "Medical nutrition therapy with carbohydrate counting",
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Diabetes Management in Pregnancy management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected diabetes management in pregnancy. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for diabetes management in pregnancy",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for diabetes management in pregnancy while being cost-effective."
      }
    ]
  },
  "hyperprolactinemia-workup-np": {
    title: "Hyperprolactinemia Workup: Prolactinoma",
    cellular: {
      title: "Pathophysiology of Hyperprolactinemia Workup",
      content: "Hyperprolactinemia results from pituitary prolactinoma (most common pituitary tumor), stalk effect (any sellar mass disrupting dopamine inhibition), or medications (antipsychotics, metoclopramide). Prolactin >200 ng/mL strongly suggests macroprolactinoma. Clinical effects: galactorrhea, amenorrhea/oligomenorrhea, infertility, decreased libido. Treatment: dopamine agonists (cabergoline preferred over bromocriptine) shrink prolactinomas in >80% of cases."
    },
    riskFactors: [
      "Eating disorders with hypothalamic amenorrhea",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "MEN syndrome family history",
      "Obesity (BMI >30) with insulin resistance",
      "Sleep deprivation disrupting cortisol and growth hormone secretion",
      "Age-related hormonal decline (menopause, andropause)",
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)"
    ],
    diagnostics: [
      "Plasma metanephrines for pheochromocytoma screening",
      "IGF-1 for growth hormone excess or deficiency screening",
      "24-hour urine free cortisol for Cushing confirmation",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "Pituitary MRI for sellar/suprasellar mass evaluation",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis",
      "TSH (most sensitive for primary thyroid dysfunction)"
    ],
    management: [
      "Medical nutrition therapy with carbohydrate counting",
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Bisphosphonate therapy for osteoporosis with DEXA monitoring",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM",
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      },
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Hyperprolactinemia Workup management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected hyperprolactinemia workup. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for hyperprolactinemia workup",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for hyperprolactinemia workup while being cost-effective."
      }
    ]
  },
  "adrenal-incidentaloma-np": {
    title: "Adrenal Incidentaloma Evaluation: Imaging",
    cellular: {
      title: "Pathophysiology of Adrenal Incidentaloma Evaluation",
      content: "Adrenal Incidentaloma Evaluation: Imaging involves dysregulation of hormonal signaling pathways, feedback mechanisms, and metabolic homeostasis affecting adrenal incidentaloma evaluation physiology."
    },
    riskFactors: [
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "Age-related hormonal decline (menopause, andropause)",
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "MEN syndrome family history"
    ],
    diagnostics: [
      "Prolactin level for pituitary evaluation",
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis",
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "IGF-1 for growth hormone excess or deficiency screening",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "24-hour urine free cortisol for Cushing confirmation"
    ],
    management: [
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM",
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Diabetes self-management education and support (DSMES)",
      "Bisphosphonate therapy for osteoporosis with DEXA monitoring"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Adrenal Incidentaloma Evaluation management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected adrenal incidentaloma evaluation. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for adrenal incidentaloma evaluation",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for adrenal incidentaloma evaluation while being cost-effective."
      }
    ]
  },
  "hypocalcemia-algorithm-np": {
    title: "Hypocalcemia Algorithm: PTH, Vitamin D",
    cellular: {
      title: "Pathophysiology of Hypocalcemia Algorithm",
      content: "Hypocalcemia Algorithm: PTH, Vitamin D involves dysregulation of hormonal signaling pathways, feedback mechanisms, and metabolic homeostasis affecting hypocalcemia algorithm physiology."
    },
    riskFactors: [
      "Obesity (BMI >30) with insulin resistance",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Chronic corticosteroid use with HPA axis suppression",
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "Iodine deficiency or excess affecting thyroid function",
      "Age-related hormonal decline (menopause, andropause)"
    ],
    diagnostics: [
      "Free T4 and Free T3 for thyroid hormone assessment",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Morning cortisol (8 AM) and ACTH for adrenal function",
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis"
    ],
    management: [
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Diabetes self-management education and support (DSMES)",
      "SGLT2 inhibitor or GLP-1 RA for T2DM with CV disease or CKD",
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Decreases hepatic glucose production, increases insulin sensitivity, reduces intestinal glucose absorption",
        sideEffects: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)",
        contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate), acute/chronic metabolic acidosis",
        pearl: "Start 500mg with dinner, increase by 500mg weekly. Extended-release reduces GI side effects. Hold for iodinated contrast if eGFR <45."
      },
      {
        name: "Semaglutide (Ozempic/Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics incretin GLP-1: stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety",
        sideEffects: "Nausea (dose-dependent), vomiting, diarrhea, pancreatitis risk, injection site reactions",
        contra: "Personal/family history of medullary thyroid carcinoma, MEN2 syndrome",
        pearl: "Start 0.25mg SC weekly x4 weeks, titrate monthly. SUSTAIN-6: 26% MACE reduction. Wegovy approved for weight management."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Hypocalcemia Algorithm management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected hypocalcemia algorithm. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for hypocalcemia algorithm",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for hypocalcemia algorithm while being cost-effective."
      }
    ]
  },
  "glucagonoma-np": {
    title: "Glucagonoma: 4D Syndrome & Diagnosis",
    cellular: {
      title: "Pathophysiology of Glucagonoma",
      content: "Glucagonoma is a rare pancreatic alpha-cell neuroendocrine tumor producing excess glucagon. 4D syndrome: Dermatitis (necrolytic migratory erythema - pathognomonic), Diabetes, DVT (hypercoagulability), Depression. Diagnosis: glucagon level >500 pg/mL (normal <150), CT/MRI pancreas. Most are malignant at diagnosis. Treatment: surgical resection; octreotide for symptom control if unresectable."
    },
    riskFactors: [
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Iodine deficiency or excess affecting thyroid function",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Sleep deprivation disrupting cortisol and growth hormone secretion",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Obesity (BMI >30) with insulin resistance",
      "Eating disorders with hypothalamic amenorrhea"
    ],
    diagnostics: [
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Prolactin level for pituitary evaluation",
      "Pituitary MRI for sellar/suprasellar mass evaluation",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "Plasma metanephrines for pheochromocytoma screening"
    ],
    management: [
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)",
      "Diabetes self-management education and support (DSMES)",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Medical nutrition therapy with carbohydrate counting"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Glucagonoma management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected glucagonoma. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for glucagonoma",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for glucagonoma while being cost-effective."
      }
    ]
  },
  "vipoma-np": {
    title: "VIPoma: Watery Diarrhea Syndrome",
    cellular: {
      title: "Pathophysiology of VIPoma",
      content: "VIPoma: Watery Diarrhea Syndrome involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. VIPoma pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "NSAID use >2 weeks without gastroprotection",
      "History of C. difficile infection (recurrence risk 20%)",
      "Prior abdominal surgery with adhesion formation",
      "Diabetes with gastroparesis and motility dysfunction",
      "Hepatitis B/C viral infection with cirrhosis progression",
      "Immunosuppression increasing infectious GI complications",
      "High-fat diet with cholelithiasis predisposition"
    ],
    diagnostics: [
      "Colonoscopy with polypectomy for lower GI assessment",
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "Capsule endoscopy for obscure small bowel bleeding",
      "H. pylori testing: urea breath test, stool antigen, or biopsy",
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin",
      "MRCP for biliary and pancreatic duct evaluation",
      "Lipase (preferred over amylase for pancreatic evaluation)"
    ],
    management: [
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days",
      "TIPS procedure for refractory variceal bleeding or ascites",
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP",
      "Ursodiol 13-15mg/kg/day for primary biliary cholangitis",
      "Bowel rest with IV fluids for acute pancreatitis",
      "Anti-TNF therapy (infliximab, adalimumab) for moderate-severe IBD",
      "Lactulose 15-30mL BID-TID for hepatic encephalopathy"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to vipoma)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      },
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      }
    ],
    pearls: [
      "VIPoma evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of vipoma"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with vipoma. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for vipoma."
      }
    ]
  },
  "hypogonadism-np": {
    title: "Hypogonadism: Primary vs Secondary",
    cellular: {
      title: "Pathophysiology of Hypogonadism",
      content: "Hypogonadism: Primary vs Secondary involves male reproductive, urological, or andrological pathophysiology specific to hypogonadism."
    },
    riskFactors: [
      "Age >50 for prostatic disease",
      "Diabetes mellitus (erectile dysfunction, balanitis)",
      "Medications affecting sexual function (SSRIs, beta-blockers, 5-ARIs)",
      "Sickle cell disease (priapism)",
      "Uncircumcised status (balanitis, phimosis)",
      "Testosterone deficiency (hypogonadism)",
      "History of undescended testis or testicular trauma"
    ],
    diagnostics: [
      "Focused genitourinary examination",
      "PSA and DRE for prostate evaluation",
      "Urinalysis and urine culture",
      "Scrotal ultrasound with Doppler flow assessment",
      "Testosterone (total and free, morning draw)",
      "FSH, LH for gonadal axis evaluation",
      "Semen analysis (2 specimens, 2-7 days abstinence)"
    ],
    management: [
      "Condition-specific pharmacotherapy for hypogonadism",
      "Alpha-blockers (tamsulosin) for BPH/LUTS",
      "PDE5 inhibitors (sildenafil, tadalafil) for erectile dysfunction",
      "Testosterone replacement for confirmed hypogonadism",
      "Surgical referral for anatomic or refractory conditions",
      "Urology consultation for complex presentations",
      "Sexual health counseling and partner involvement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urinary symptoms (frequency, urgency, hesitancy, weak stream)",
        "Erectile dysfunction or ejaculatory problems",
        "Testicular pain, swelling, or mass",
        "Infertility or decreased libido"
      ],
      right: [
        "Prostatic enlargement on DRE",
        "Testicular atrophy or asymmetry",
        "Varicocele (bag of worms on palpation)",
        "Gynecomastia or decreased secondary sexual characteristics"
      ]
    },
    medications: [
      {
        name: "Tamsulosin (Flomax)",
        type: "Alpha-1A Selective Blocker",
        action: "Selectively blocks alpha-1A receptors in prostate and bladder neck reducing smooth muscle tone",
        sideEffects: "Orthostatic hypotension, dizziness, retrograde ejaculation, intraoperative floppy iris syndrome",
        contra: "Concurrent PDE5 inhibitor (additive hypotension), cataract surgery (inform ophthalmologist)",
        pearl: "0.4mg daily 30 min after same meal. Most uroselective alpha-blocker. Warn about ejaculatory dysfunction. Effect within days."
      },
      {
        name: "Finasteride (Proscar)",
        type: "5-Alpha Reductase Inhibitor (Type II)",
        action: "Blocks conversion of testosterone to DHT reducing prostate volume by 20-30% over 6 months",
        sideEffects: "Decreased libido, erectile dysfunction, gynecomastia, depression, PSA reduction by ~50%",
        contra: "Pregnancy exposure (teratogenic: Category X), women of childbearing age handling crushed tablets",
        pearl: "5mg daily for BPH (or 1mg as Propecia for hair loss). Takes 6-12 months for full effect. Adjust PSA by doubling value. MTOPS trial: combination with alpha-blocker superior."
      }
    ],
    pearls: [
      "PSA should be doubled in patients on 5-ARIs for accurate cancer screening interpretation",
      "Testicular torsion: urologic emergency; negative Prehn sign, absent cremasteric reflex, high-riding testis. Surgery within 6h for salvage",
      "Hypogonadism evaluation requires sensitive, non-judgmental approach with thorough history and focused examination"
    ],
    quiz: [
      {
        question: "A patient with hypogonadism presents for evaluation. Most important initial step?",
        options: [
          "Empiric testosterone replacement",
          "Focused history, examination, and targeted diagnostic evaluation",
          "Immediate surgical referral without workup",
          "Observation only with annual follow-up"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides appropriate management for hypogonadism."
      }
    ]
  },
  "panhypopituitarism-np": {
    title: "Panhypopituitarism: Multi-Hormone Deficiency",
    cellular: {
      title: "Pathophysiology of Panhypopituitarism",
      content: "Panhypopituitarism: Multi-Hormone Deficiency involves dysregulation of hormonal signaling pathways, feedback mechanisms, and metabolic homeostasis affecting panhypopituitarism physiology."
    },
    riskFactors: [
      "Prior radiation to head/neck affecting thyroid or pituitary",
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)",
      "Obesity (BMI >30) with insulin resistance",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "Iodine deficiency or excess affecting thyroid function",
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)"
    ],
    diagnostics: [
      "Dexamethasone suppression test (1mg overnight) for Cushing screening",
      "TSH (most sensitive for primary thyroid dysfunction)",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "IGF-1 for growth hormone excess or deficiency screening",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "Prolactin level for pituitary evaluation"
    ],
    management: [
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)",
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Panhypopituitarism management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected panhypopituitarism. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for panhypopituitarism",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for panhypopituitarism while being cost-effective."
      }
    ]
  },
  "craniopharyngioma-np": {
    title: "Craniopharyngioma: Sellar Mass Workup",
    cellular: {
      title: "Pathophysiology of Craniopharyngioma",
      content: "Craniopharyngioma: Sellar Mass Workup involves pathology of the ear, nose, throat, or vestibular system requiring systematic evaluation of anatomic and functional components."
    },
    riskFactors: [
      "Age-related hearing/vestibular degeneration",
      "Chronic or occupational noise exposure",
      "URI preceding vestibular symptoms",
      "Head trauma affecting temporal bone",
      "Ototoxic medications (aminoglycosides, loop diuretics, cisplatin)",
      "Allergic rhinitis and chronic sinusitis",
      "Autoimmune inner ear conditions"
    ],
    diagnostics: [
      "Dix-Hallpike test for posterior canal BPPV",
      "Pure tone audiometry for hearing threshold assessment",
      "Tympanometry for middle ear compliance evaluation",
      "Weber and Rinne tuning fork tests (conductive vs sensorineural)",
      "CT temporal bones if structural pathology suspected",
      "MRI internal auditory canals if retrocochlear pathology suspected",
      "Caloric testing and videonystagmography (VNG) for vestibular evaluation"
    ],
    management: [
      "Canalith repositioning (Epley maneuver) for BPPV",
      "Vestibular rehabilitation exercises (Brandt-Daroff)",
      "Meclizine 25mg q6-8h PRN for acute vertigo (short-term only)",
      "Antibiotics for bacterial sinusitis/otitis (amoxicillin first-line)",
      "Surgical referral for structural ENT conditions",
      "Hearing aid evaluation for sensorineural hearing loss",
      "Antivirals + corticosteroids for Ramsay-Hunt syndrome"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vertigo (distinguish from lightheadedness and disequilibrium)",
        "Hearing loss (conductive vs sensorineural)",
        "Tinnitus (pulsatile vs continuous)",
        "Aural fullness or pressure"
      ],
      right: [
        "Nystagmus patterns (direction, fatigability)",
        "Positive Dix-Hallpike or head impulse test",
        "Otoscopic findings (TM perforation, effusion, cholesteatoma)",
        "Facial nerve weakness (House-Brackmann grading)"
      ]
    },
    medications: [
      {
        name: "Meclizine (Antivert)",
        type: "Vestibular Suppressant",
        action: "Blocks H1 and muscarinic receptors in vestibular nuclei suppressing vestibular input",
        sideEffects: "Drowsiness, dry mouth, urinary retention",
        contra: "Angle-closure glaucoma, urinary retention",
        pearl: "Short-term only for acute vertigo. Not effective for BPPV (Epley is treatment). Beers Criteria: avoid in elderly."
      },
      {
        name: "Amoxicillin",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis via PBP binding",
        sideEffects: "Diarrhea, nausea, rash (especially with EBV)",
        contra: "Penicillin allergy, concurrent EBV infection (rash risk)",
        pearl: "First-line for acute bacterial sinusitis (500mg TID x5-7d) and AOM. Wait 7-10 days before antibiotics for uncomplicated sinusitis."
      }
    ],
    pearls: [
      "BPPV: diagnosed clinically with Dix-Hallpike, treated with Epley maneuver - no imaging needed",
      "HINTS exam (Head Impulse, Nystagmus, Test of Skew) differentiates peripheral from central vertigo with >95% sensitivity",
      "Most acute sinusitis is viral - antibiotics only after 10 days without improvement"
    ],
    quiz: [
      {
        question: "A patient with episodic vertigo presents for evaluation. Best initial diagnostic approach?",
        options: [
          "Immediate CT head without examination",
          "Bedside vestibular exam including Dix-Hallpike and HINTS assessment",
          "Empiric antibiotics",
          "MRI brain without clinical exam"
        ],
        correct: 1,
        rationale: "Bedside vestibular examination differentiates peripheral from central causes of vertigo with high sensitivity and guides management."
      }
    ]
  },
  "ectopic-acth-np": {
    title: "Ectopic ACTH Syndrome: Paraneoplastic Cushing",
    cellular: {
      title: "Pathophysiology of Ectopic ACTH Syndrome",
      content: "Cushing syndrome results from chronic glucocorticoid excess. Exogenous (most common: iatrogenic steroids) or endogenous (ACTH-dependent: pituitary adenoma 70%, ectopic ACTH 15%; ACTH-independent: adrenal adenoma/carcinoma 15%). Screening: 24h urine free cortisol, late-night salivary cortisol, 1mg overnight dexamethasone suppression test. Clinical features: central obesity, moon face, buffalo hump, striae, proximal weakness, glucose intolerance."
    },
    riskFactors: [
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Iodine deficiency or excess affecting thyroid function",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Sleep deprivation disrupting cortisol and growth hormone secretion",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Obesity (BMI >30) with insulin resistance",
      "Eating disorders with hypothalamic amenorrhea"
    ],
    diagnostics: [
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Prolactin level for pituitary evaluation",
      "Pituitary MRI for sellar/suprasellar mass evaluation",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "Plasma metanephrines for pheochromocytoma screening"
    ],
    management: [
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)",
      "Diabetes self-management education and support (DSMES)",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Medical nutrition therapy with carbohydrate counting"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Ectopic ACTH Syndrome management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected ectopic acth syndrome. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for ectopic acth syndrome",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for ectopic acth syndrome while being cost-effective."
      }
    ]
  },
  "hyperparathyroid-crisis-np": {
    title: "Hyperparathyroid Crisis: Severe Hypercalcemia",
    cellular: {
      title: "Pathophysiology of Hyperparathyroid Crisis",
      content: "Thyroid disorders involve HPT axis dysregulation. Hashimoto (anti-TPO antibodies) causes hypothyroidism through lymphocytic infiltration and follicular destruction. Graves (TSI/TRAb) causes hyperthyroidism via TSH receptor stimulation. TSH is the best screening test. Levothyroxine 1.6 mcg/kg/day for hypothyroidism; check TSH at 6-8 weeks after dose changes. Toxic multinodular goiter develops from autonomous nodules producing excess thyroid hormone independently of TSH."
    },
    riskFactors: [
      "Prior radiation to head/neck affecting thyroid or pituitary",
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)",
      "Obesity (BMI >30) with insulin resistance",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "Iodine deficiency or excess affecting thyroid function",
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)"
    ],
    diagnostics: [
      "Dexamethasone suppression test (1mg overnight) for Cushing screening",
      "TSH (most sensitive for primary thyroid dysfunction)",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "IGF-1 for growth hormone excess or deficiency screening",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "Prolactin level for pituitary evaluation"
    ],
    management: [
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)",
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Hyperparathyroid Crisis management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected hyperparathyroid crisis. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for hyperparathyroid crisis",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for hyperparathyroid crisis while being cost-effective."
      }
    ]
  },
  "toxic-multinodular-goiter-np": {
    title: "Toxic Multinodular Goiter: Diagnosis",
    cellular: {
      title: "Pathophysiology of Toxic Multinodular Goiter",
      content: "Thyroid disorders involve HPT axis dysregulation. Hashimoto (anti-TPO antibodies) causes hypothyroidism through lymphocytic infiltration and follicular destruction. Graves (TSI/TRAb) causes hyperthyroidism via TSH receptor stimulation. TSH is the best screening test. Levothyroxine 1.6 mcg/kg/day for hypothyroidism; check TSH at 6-8 weeks after dose changes. Toxic multinodular goiter develops from autonomous nodules producing excess thyroid hormone independently of TSH."
    },
    riskFactors: [
      "Age-related hormonal decline (menopause, andropause)",
      "Eating disorders with hypothalamic amenorrhea",
      "Sleep deprivation disrupting cortisol and growth hormone secretion",
      "Iodine deficiency or excess affecting thyroid function",
      "Chronic corticosteroid use with HPA axis suppression",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "Prior radiation to head/neck affecting thyroid or pituitary"
    ],
    diagnostics: [
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis",
      "Plasma metanephrines for pheochromocytoma screening",
      "Pituitary MRI for sellar/suprasellar mass evaluation",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Morning cortisol (8 AM) and ACTH for adrenal function",
      "IGF-1 for growth hormone excess or deficiency screening",
      "Dexamethasone suppression test (1mg overnight) for Cushing screening"
    ],
    management: [
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM",
      "Medical nutrition therapy with carbohydrate counting",
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "SGLT2 inhibitor or GLP-1 RA for T2DM with CV disease or CKD",
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Semaglutide (Ozempic/Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics incretin GLP-1: stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety",
        sideEffects: "Nausea (dose-dependent), vomiting, diarrhea, pancreatitis risk, injection site reactions",
        contra: "Personal/family history of medullary thyroid carcinoma, MEN2 syndrome",
        pearl: "Start 0.25mg SC weekly x4 weeks, titrate monthly. SUSTAIN-6: 26% MACE reduction. Wegovy approved for weight management."
      },
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Decreases hepatic glucose production, increases insulin sensitivity, reduces intestinal glucose absorption",
        sideEffects: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)",
        contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate), acute/chronic metabolic acidosis",
        pearl: "Start 500mg with dinner, increase by 500mg weekly. Extended-release reduces GI side effects. Hold for iodinated contrast if eGFR <45."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Toxic Multinodular Goiter management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected toxic multinodular goiter. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for toxic multinodular goiter",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for toxic multinodular goiter while being cost-effective."
      }
    ]
  },
  "thyroid-nodule-malignancy-np": {
    title: "Thyroid Nodule Malignancy: Bethesda System",
    cellular: {
      title: "Pathophysiology of Thyroid Nodule Malignancy",
      content: "Thyroid disorders involve HPT axis dysregulation. Hashimoto (anti-TPO antibodies) causes hypothyroidism through lymphocytic infiltration and follicular destruction. Graves (TSI/TRAb) causes hyperthyroidism via TSH receptor stimulation. TSH is the best screening test. Levothyroxine 1.6 mcg/kg/day for hypothyroidism; check TSH at 6-8 weeks after dose changes. Toxic multinodular goiter develops from autonomous nodules producing excess thyroid hormone independently of TSH."
    },
    riskFactors: [
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Iodine deficiency or excess affecting thyroid function",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Sleep deprivation disrupting cortisol and growth hormone secretion",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Obesity (BMI >30) with insulin resistance",
      "Eating disorders with hypothalamic amenorrhea"
    ],
    diagnostics: [
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Prolactin level for pituitary evaluation",
      "Pituitary MRI for sellar/suprasellar mass evaluation",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "Plasma metanephrines for pheochromocytoma screening"
    ],
    management: [
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)",
      "Diabetes self-management education and support (DSMES)",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Medical nutrition therapy with carbohydrate counting"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Semaglutide (Ozempic/Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics incretin GLP-1: stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety",
        sideEffects: "Nausea (dose-dependent), vomiting, diarrhea, pancreatitis risk, injection site reactions",
        contra: "Personal/family history of medullary thyroid carcinoma, MEN2 syndrome",
        pearl: "Start 0.25mg SC weekly x4 weeks, titrate monthly. SUSTAIN-6: 26% MACE reduction. Wegovy approved for weight management."
      },
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Decreases hepatic glucose production, increases insulin sensitivity, reduces intestinal glucose absorption",
        sideEffects: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)",
        contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate), acute/chronic metabolic acidosis",
        pearl: "Start 500mg with dinner, increase by 500mg weekly. Extended-release reduces GI side effects. Hold for iodinated contrast if eGFR <45."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Thyroid Nodule Malignancy management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected thyroid nodule malignancy. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for thyroid nodule malignancy",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for thyroid nodule malignancy while being cost-effective."
      }
    ]
  },
  "hypercalcemia-workup-np": {
    title: "Hypercalcemia Workup: PTH-Mediated vs Non-PTH",
    cellular: {
      title: "Pathophysiology of Hypercalcemia Workup",
      content: "Hypercalcemia Workup: PTH-Mediated vs Non-PTH involves dysregulation of hormonal signaling pathways, feedback mechanisms, and metabolic homeostasis affecting hypercalcemia workup physiology."
    },
    riskFactors: [
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Prior radiation to head/neck affecting thyroid or pituitary",
      "Iodine deficiency or excess affecting thyroid function",
      "Eating disorders with hypothalamic amenorrhea",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency"
    ],
    diagnostics: [
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "Dexamethasone suppression test (1mg overnight) for Cushing screening",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Plasma metanephrines for pheochromocytoma screening",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "TSH (most sensitive for primary thyroid dysfunction)",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)"
    ],
    management: [
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Medical nutrition therapy with carbohydrate counting",
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM",
      "Diabetes self-management education and support (DSMES)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Decreases hepatic glucose production, increases insulin sensitivity, reduces intestinal glucose absorption",
        sideEffects: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)",
        contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate), acute/chronic metabolic acidosis",
        pearl: "Start 500mg with dinner, increase by 500mg weekly. Extended-release reduces GI side effects. Hold for iodinated contrast if eGFR <45."
      },
      {
        name: "Semaglutide (Ozempic/Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics incretin GLP-1: stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety",
        sideEffects: "Nausea (dose-dependent), vomiting, diarrhea, pancreatitis risk, injection site reactions",
        contra: "Personal/family history of medullary thyroid carcinoma, MEN2 syndrome",
        pearl: "Start 0.25mg SC weekly x4 weeks, titrate monthly. SUSTAIN-6: 26% MACE reduction. Wegovy approved for weight management."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Hypercalcemia Workup management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected hypercalcemia workup. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for hypercalcemia workup",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for hypercalcemia workup while being cost-effective."
      }
    ]
  },
  "diabetes-technology-np": {
    title: "Diabetes Technology: CGM, Insulin Pumps",
    cellular: {
      title: "Pathophysiology of Diabetes Technology",
      content: "T2DM features insulin resistance and progressive beta-cell dysfunction. Insulin resistance from TNF-alpha, IL-6, free fatty acids impairs IRS phosphorylation. Beta-cell compensation fails through glucotoxicity and lipotoxicity. First-line: metformin + lifestyle. Second-line based on comorbidities: SGLT2i or GLP-1RA for ASCVD, HF, CKD."
    },
    riskFactors: [
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Iodine deficiency or excess affecting thyroid function",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Sleep deprivation disrupting cortisol and growth hormone secretion",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Obesity (BMI >30) with insulin resistance",
      "Eating disorders with hypothalamic amenorrhea"
    ],
    diagnostics: [
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Prolactin level for pituitary evaluation",
      "Pituitary MRI for sellar/suprasellar mass evaluation",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "Plasma metanephrines for pheochromocytoma screening"
    ],
    management: [
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)",
      "Diabetes self-management education and support (DSMES)",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Medical nutrition therapy with carbohydrate counting"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      },
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Diabetes Technology management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected diabetes technology. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for diabetes technology",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for diabetes technology while being cost-effective."
      }
    ]
  },
  "gestational-diabetes-screening-np": {
    title: "Gestational Diabetes Screening: OGTT",
    cellular: {
      title: "Pathophysiology of Gestational Diabetes Screening",
      content: "T2DM features insulin resistance and progressive beta-cell dysfunction. Insulin resistance from TNF-alpha, IL-6, free fatty acids impairs IRS phosphorylation. Beta-cell compensation fails through glucotoxicity and lipotoxicity. First-line: metformin + lifestyle. Second-line based on comorbidities: SGLT2i or GLP-1RA for ASCVD, HF, CKD."
    },
    riskFactors: [
      "Sleep deprivation disrupting cortisol and growth hormone secretion",
      "MEN syndrome family history",
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)",
      "Chronic corticosteroid use with HPA axis suppression",
      "Obesity (BMI >30) with insulin resistance"
    ],
    diagnostics: [
      "Pituitary MRI for sellar/suprasellar mass evaluation",
      "24-hour urine free cortisol for Cushing confirmation",
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "TSH (most sensitive for primary thyroid dysfunction)",
      "Morning cortisol (8 AM) and ACTH for adrenal function",
      "Free T4 and Free T3 for thyroid hormone assessment"
    ],
    management: [
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)",
      "Bisphosphonate therapy for osteoporosis with DEXA monitoring",
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM",
      "SGLT2 inhibitor or GLP-1 RA for T2DM with CV disease or CKD",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Semaglutide (Ozempic/Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics incretin GLP-1: stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety",
        sideEffects: "Nausea (dose-dependent), vomiting, diarrhea, pancreatitis risk, injection site reactions",
        contra: "Personal/family history of medullary thyroid carcinoma, MEN2 syndrome",
        pearl: "Start 0.25mg SC weekly x4 weeks, titrate monthly. SUSTAIN-6: 26% MACE reduction. Wegovy approved for weight management."
      },
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Decreases hepatic glucose production, increases insulin sensitivity, reduces intestinal glucose absorption",
        sideEffects: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)",
        contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate), acute/chronic metabolic acidosis",
        pearl: "Start 500mg with dinner, increase by 500mg weekly. Extended-release reduces GI side effects. Hold for iodinated contrast if eGFR <45."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Gestational Diabetes Screening management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected gestational diabetes screening. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for gestational diabetes screening",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for gestational diabetes screening while being cost-effective."
      }
    ]
  },
  "thyroid-cancer-surveillance-np": {
    title: "Thyroid Cancer Surveillance: Thyroglobulin",
    cellular: {
      title: "Pathophysiology of Thyroid Cancer Surveillance",
      content: "Thyroid disorders involve HPT axis dysregulation. Hashimoto (anti-TPO antibodies) causes hypothyroidism through lymphocytic infiltration and follicular destruction. Graves (TSI/TRAb) causes hyperthyroidism via TSH receptor stimulation. TSH is the best screening test. Levothyroxine 1.6 mcg/kg/day for hypothyroidism; check TSH at 6-8 weeks after dose changes. Toxic multinodular goiter develops from autonomous nodules producing excess thyroid hormone independently of TSH."
    },
    riskFactors: [
      "Chronic corticosteroid use with HPA axis suppression",
      "Sleep deprivation disrupting cortisol and growth hormone secretion",
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Prior radiation to head/neck affecting thyroid or pituitary",
      "MEN syndrome family history",
      "Iodine deficiency or excess affecting thyroid function"
    ],
    diagnostics: [
      "Morning cortisol (8 AM) and ACTH for adrenal function",
      "Pituitary MRI for sellar/suprasellar mass evaluation",
      "TSH (most sensitive for primary thyroid dysfunction)",
      "Prolactin level for pituitary evaluation",
      "Dexamethasone suppression test (1mg overnight) for Cushing screening",
      "24-hour urine free cortisol for Cushing confirmation",
      "Cosyntropin stimulation test for adrenal insufficiency"
    ],
    management: [
      "SGLT2 inhibitor or GLP-1 RA for T2DM with CV disease or CKD",
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)",
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)",
      "Bisphosphonate therapy for osteoporosis with DEXA monitoring",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Semaglutide (Ozempic/Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics incretin GLP-1: stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety",
        sideEffects: "Nausea (dose-dependent), vomiting, diarrhea, pancreatitis risk, injection site reactions",
        contra: "Personal/family history of medullary thyroid carcinoma, MEN2 syndrome",
        pearl: "Start 0.25mg SC weekly x4 weeks, titrate monthly. SUSTAIN-6: 26% MACE reduction. Wegovy approved for weight management."
      },
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Decreases hepatic glucose production, increases insulin sensitivity, reduces intestinal glucose absorption",
        sideEffects: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)",
        contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate), acute/chronic metabolic acidosis",
        pearl: "Start 500mg with dinner, increase by 500mg weekly. Extended-release reduces GI side effects. Hold for iodinated contrast if eGFR <45."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Thyroid Cancer Surveillance management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected thyroid cancer surveillance. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for thyroid cancer surveillance",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for thyroid cancer surveillance while being cost-effective."
      }
    ]
  },
  "dka-management-np": {
    title: "DKA: Anion Gap, Insulin Protocol",
    cellular: {
      title: "Pathophysiology of DKA",
      content: "DKA: absolute/relative insulin deficiency causing lipolysis, ketogenesis. Triad: glucose >250, pH <7.3, bicarb <18, ketonemia. HHS: extreme hyperglycemia (>600), hyperosmolality (>320) without significant ketosis. DKA treatment: NS 15-20 mL/kg/hr, insulin drip 0.1-0.14 U/kg/hr, K+ replacement when <5.3. Transition to SC insulin when glucose <200, bicarb >=15, pH >7.3, AG closed."
    },
    riskFactors: [
      "MEN syndrome family history",
      "Chronic corticosteroid use with HPA axis suppression",
      "Prior radiation to head/neck affecting thyroid or pituitary",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Sleep deprivation disrupting cortisol and growth hormone secretion",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis"
    ],
    diagnostics: [
      "24-hour urine free cortisol for Cushing confirmation",
      "Morning cortisol (8 AM) and ACTH for adrenal function",
      "Dexamethasone suppression test (1mg overnight) for Cushing screening",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "Pituitary MRI for sellar/suprasellar mass evaluation",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)"
    ],
    management: [
      "Bisphosphonate therapy for osteoporosis with DEXA monitoring",
      "SGLT2 inhibitor or GLP-1 RA for T2DM with CV disease or CKD",
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)",
      "Diabetes self-management education and support (DSMES)",
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)",
      "Continuous glucose monitoring for insulin-dependent diabetes"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "DKA management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected dka. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for dka",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for dka while being cost-effective."
      }
    ]
  },
  "hpa-axis-stress-np": {
    title: "HPA Axis: Cortisol Dysregulation",
    cellular: {
      title: "Pathophysiology of HPA Axis",
      content: "The HPA axis regulates cortisol secretion through CRH (hypothalamus) stimulating ACTH (anterior pituitary) stimulating cortisol (adrenal cortex) with negative feedback. Chronic stress dysregulates the axis causing sustained cortisol elevation, immune suppression, metabolic derangements, and psychiatric effects. Exogenous glucocorticoid use >2-3 weeks suppresses the HPA axis requiring gradual taper to prevent adrenal crisis."
    },
    riskFactors: [
      "Obesity (BMI >30) with insulin resistance",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Chronic corticosteroid use with HPA axis suppression",
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "Iodine deficiency or excess affecting thyroid function",
      "Age-related hormonal decline (menopause, andropause)"
    ],
    diagnostics: [
      "Free T4 and Free T3 for thyroid hormone assessment",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Morning cortisol (8 AM) and ACTH for adrenal function",
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis"
    ],
    management: [
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Diabetes self-management education and support (DSMES)",
      "SGLT2 inhibitor or GLP-1 RA for T2DM with CV disease or CKD",
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      },
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "HPA Axis management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected hpa axis. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for hpa axis",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for hpa axis while being cost-effective."
      }
    ]
  },
  "electrolyte-safety-np": {
    title: "Advanced Electrolyte Correction",
    cellular: {
      title: "Pathophysiology of Advanced Electrolyte Correction",
      content: "Advanced Electrolyte Correction involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to advanced electrolyte correction."
    },
    riskFactors: [
      "Rhabdomyolysis from trauma, statins, or extreme exertion",
      "Recurrent UTIs or urinary tract obstruction",
      "Multiple myeloma with cast nephropathy",
      "Autoimmune disease (SLE lupus nephritis, ANCA vasculitis)",
      "Sickle cell disease with papillary necrosis",
      "IV contrast administration (contrast-induced nephropathy)",
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)"
    ],
    diagnostics: [
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI",
      "24-hour urine collection for proteinuria quantification and CrCl",
      "PTH and vitamin D levels for renal osteodystrophy assessment",
      "Fractional excretion of sodium (FENa): <1% prerenal, >2% intrinsic renal",
      "Complement levels (C3, C4) for glomerulonephritis workup",
      "Comprehensive metabolic panel (electrolytes, calcium, phosphorus, bicarbonate)",
      "CBC for anemia of CKD evaluation"
    ],
    management: [
      "Blood pressure target <130/80 with ACEi/ARB as first-line",
      "Dialysis initiation for refractory hyperkalemia, volume overload, uremic symptoms",
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5",
      "ESA therapy (epoetin alfa) for anemia of CKD (target Hgb 10-11.5 g/dL)",
      "Nephrology referral when eGFR <30 or rapidly declining",
      "Potassium management: kayexalate, patiromer, or sodium zirconium cyclosilicate",
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      },
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Advanced Electrolyte Correction management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with advanced electrolyte correction has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "ckd-staging-np": {
    title: "CKD: KDIGO Staging & Progression Management",
    cellular: {
      title: "Pathophysiology of CKD",
      content: "CKD staging by eGFR (CKD-EPI): G1 (>=90 with albuminuria), G2 (60-89), G3a (45-59), G3b (30-44), G4 (15-29), G5 (<15). Albuminuria staging: A1 (<30), A2 (30-300), A3 (>300 mg/g). Progressive nephron loss activates RAAS increasing intraglomerular pressure. SGLT2 inhibitors reduce hyperfiltration via tubuloglomerular feedback. Complications: anemia (decreased EPO), CKD-MBD (secondary hyperparathyroidism), metabolic acidosis, hyperkalemia."
    },
    riskFactors: [
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)",
      "Age >60 with age-related GFR decline",
      "Family history of polycystic kidney disease or Alport syndrome",
      "Hypertension (second leading cause of CKD)",
      "NSAID use >7 days (prostaglandin-mediated afferent arteriolar constriction)",
      "Rhabdomyolysis from trauma, statins, or extreme exertion",
      "Multiple myeloma with cast nephropathy"
    ],
    diagnostics: [
      "CBC for anemia of CKD evaluation",
      "Urinalysis with microscopy (casts, crystals, cells)",
      "Renal ultrasound for size, echogenicity, obstruction, masses",
      "BUN/Creatinine ratio (>20:1 suggests prerenal etiology)",
      "Urine albumin-to-creatinine ratio (UACR >30 mg/g = albuminuria)",
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI",
      "PTH and vitamin D levels for renal osteodystrophy assessment"
    ],
    management: [
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)",
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)",
      "Phosphorus restriction and phosphate binders (sevelamer, calcium acetate)",
      "Discontinue nephrotoxins (NSAIDs, aminoglycosides, contrast)",
      "SGLT2 inhibitor for CKD with or without diabetes (DAPA-CKD, CREDENCE trials)",
      "Blood pressure target <130/80 with ACEi/ARB as first-line",
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      },
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "CKD management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with ckd has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "nephrotic-syndrome-np": {
    title: "Nephrotic Syndrome: Proteinuria",
    cellular: {
      title: "Pathophysiology of Nephrotic Syndrome",
      content: "Nephrotic syndrome: massive proteinuria (>3.5g/day), hypoalbuminemia (<3.5), hyperlipidemia, lipiduria, edema. Primary causes: minimal change disease (children), membranous nephropathy (adults, anti-PLA2R antibodies), FSGS. Secondary: diabetic nephropathy, SLE, amyloidosis. Hypercoagulable state from antithrombin III loss. Treatment: ACEi/ARB for proteinuria reduction, statins, edema management, treat underlying cause."
    },
    riskFactors: [
      "Family history of polycystic kidney disease or Alport syndrome",
      "NSAID use >7 days (prostaglandin-mediated afferent arteriolar constriction)",
      "Autoimmune disease (SLE lupus nephritis, ANCA vasculitis)",
      "Age >60 with age-related GFR decline",
      "IV contrast administration (contrast-induced nephropathy)",
      "Multiple myeloma with cast nephropathy",
      "Diabetes mellitus (leading cause of CKD, 44% of new ESRD)"
    ],
    diagnostics: [
      "Renal ultrasound for size, echogenicity, obstruction, masses",
      "Urine albumin-to-creatinine ratio (UACR >30 mg/g = albuminuria)",
      "Fractional excretion of sodium (FENa): <1% prerenal, >2% intrinsic renal",
      "Urinalysis with microscopy (casts, crystals, cells)",
      "Comprehensive metabolic panel (electrolytes, calcium, phosphorus, bicarbonate)",
      "PTH and vitamin D levels for renal osteodystrophy assessment",
      "Serum creatinine with eGFR calculation (CKD-EPI equation)"
    ],
    management: [
      "Phosphorus restriction and phosphate binders (sevelamer, calcium acetate)",
      "SGLT2 inhibitor for CKD with or without diabetes (DAPA-CKD, CREDENCE trials)",
      "ESA therapy (epoetin alfa) for anemia of CKD (target Hgb 10-11.5 g/dL)",
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)",
      "Potassium management: kayexalate, patiromer, or sodium zirconium cyclosilicate",
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5",
      "Volume resuscitation with isotonic crystalloid for prerenal AKI"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      },
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Nephrotic Syndrome management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with nephrotic syndrome has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "renal-replacement-np": {
    title: "Renal Replacement Therapy: HD vs CRRT vs PD",
    cellular: {
      title: "Pathophysiology of Renal Replacement Therapy",
      content: "Renal Replacement Therapy: HD vs CRRT vs PD involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to renal replacement therapy."
    },
    riskFactors: [
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)",
      "Age >60 with age-related GFR decline",
      "Family history of polycystic kidney disease or Alport syndrome",
      "Hypertension (second leading cause of CKD)",
      "NSAID use >7 days (prostaglandin-mediated afferent arteriolar constriction)",
      "Rhabdomyolysis from trauma, statins, or extreme exertion",
      "Multiple myeloma with cast nephropathy"
    ],
    diagnostics: [
      "CBC for anemia of CKD evaluation",
      "Urinalysis with microscopy (casts, crystals, cells)",
      "Renal ultrasound for size, echogenicity, obstruction, masses",
      "BUN/Creatinine ratio (>20:1 suggests prerenal etiology)",
      "Urine albumin-to-creatinine ratio (UACR >30 mg/g = albuminuria)",
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI",
      "PTH and vitamin D levels for renal osteodystrophy assessment"
    ],
    management: [
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)",
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)",
      "Phosphorus restriction and phosphate binders (sevelamer, calcium acetate)",
      "Discontinue nephrotoxins (NSAIDs, aminoglycosides, contrast)",
      "SGLT2 inhibitor for CKD with or without diabetes (DAPA-CKD, CREDENCE trials)",
      "Blood pressure target <130/80 with ACEi/ARB as first-line",
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      },
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Renal Replacement Therapy management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with renal replacement therapy has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "contrast-nephropathy-np": {
    title: "Contrast Nephropathy: Prevention Strategies",
    cellular: {
      title: "Pathophysiology of Contrast Nephropathy",
      content: "Contrast Nephropathy: Prevention Strategies involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to contrast nephropathy."
    },
    riskFactors: [
      "IV contrast administration (contrast-induced nephropathy)",
      "Hypertension (second leading cause of CKD)",
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)",
      "Diabetes mellitus (leading cause of CKD, 44% of new ESRD)",
      "Age >60 with age-related GFR decline",
      "Volume depletion from any cause",
      "Rhabdomyolysis from trauma, statins, or extreme exertion"
    ],
    diagnostics: [
      "Comprehensive metabolic panel (electrolytes, calcium, phosphorus, bicarbonate)",
      "BUN/Creatinine ratio (>20:1 suggests prerenal etiology)",
      "CBC for anemia of CKD evaluation",
      "Serum creatinine with eGFR calculation (CKD-EPI equation)",
      "Urinalysis with microscopy (casts, crystals, cells)",
      "ANCA, anti-GBM, anti-dsDNA for autoimmune renal disease",
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI"
    ],
    management: [
      "Potassium management: kayexalate, patiromer, or sodium zirconium cyclosilicate",
      "Discontinue nephrotoxins (NSAIDs, aminoglycosides, contrast)",
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)",
      "Volume resuscitation with isotonic crystalloid for prerenal AKI",
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)",
      "Renal replacement therapy planning: HD vs PD vs transplant evaluation",
      "Blood pressure target <130/80 with ACEi/ARB as first-line"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      },
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Contrast Nephropathy management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with contrast nephropathy has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "hyperkalemia-emergency-np": {
    title: "Hyperkalemia Emergency: ECG Changes",
    cellular: {
      title: "Pathophysiology of Hyperkalemia Emergency",
      content: "Hyperkalemia Emergency: ECG Changes involves multi-system pathophysiology requiring integration of knowledge across organ systems for hyperkalemia emergency."
    },
    riskFactors: [
      "Polytrauma with multi-organ involvement",
      "Critical illness with systemic inflammatory response",
      "Extremes of age with limited physiologic reserve",
      "Comorbid conditions complicating clinical course",
      "Environmental exposure (heat, cold, altitude, pressure)",
      "Delayed presentation or recognition of emergency",
      "Medication-related complications or toxicity"
    ],
    diagnostics: [
      "Focused primary and secondary survey for trauma",
      "Point-of-care labs (ABG, lactate, glucose, electrolytes)",
      "Bedside ultrasound (FAST, cardiac, lung)",
      "CT imaging for definitive injury characterization",
      "Continuous cardiorespiratory monitoring",
      "Glasgow Coma Scale and pupillary assessment",
      "Toxicology screening when indicated"
    ],
    management: [
      "ABCDE systematic assessment and stabilization",
      "Damage control resuscitation for hemorrhagic shock",
      "Targeted temperature management protocols",
      "Pain management (multimodal, regional anesthesia when possible)",
      "Early mobility and rehabilitation initiation",
      "ICU-level monitoring and organ support",
      "Multidisciplinary team approach for complex patients"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Hemodynamic instability (hypotension, tachycardia)",
        "Respiratory compromise",
        "Altered level of consciousness",
        "Pain disproportionate to apparent injury"
      ],
      right: [
        "Multi-organ dysfunction indicators",
        "Coagulopathy (DIC screening)",
        "Rhabdomyolysis signs (dark urine, elevated CK)",
        "Compartment pressure elevation"
      ]
    },
    medications: [
      {
        name: "Norepinephrine (Levophed)",
        type: "Alpha-1 > Beta-1 Agonist (Vasopressor)",
        action: "Potent alpha-1 vasoconstriction with moderate beta-1 inotropy increasing MAP",
        sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis with extravasation",
        contra: "Hypovolemia (correct volume first), mesenteric ischemia",
        pearl: "First-line vasopressor for septic shock (Surviving Sepsis 2021). Start 0.1-0.5 mcg/kg/min, titrate to MAP >=65. Central line preferred but can start peripherally in emergency. Phentolamine for extravasation."
      },
      {
        name: "Ketamine",
        type: "NMDA Receptor Antagonist",
        action: "Dissociative anesthetic providing analgesia, amnesia, and sedation while maintaining airway reflexes and hemodynamics",
        sideEffects: "Emergence reactions, laryngospasm (rare), hypertension, increased secretions",
        contra: "Severe hypertension, elevated ICP (controversial), psychiatric instability",
        pearl: "Pain: 0.1-0.3mg/kg IV. Procedural sedation: 1-2mg/kg IV. RSI: 1.5-2mg/kg IV. Maintains hemodynamics - ideal for hypotensive patients. Pretreat with midazolam 0.03mg/kg to reduce emergence reactions."
      }
    ],
    pearls: [
      "ABCDE approach: Airway, Breathing, Circulation, Disability, Exposure - systematic assessment saves lives",
      "Damage control resuscitation: permissive hypotension (MAP 50-65 until surgical control), balanced transfusion (1:1:1 PRBC:FFP:platelets), minimize crystalloid",
      "Hyperkalemia Emergency management requires rapid assessment, stabilization, and definitive treatment coordination"
    ],
    quiz: [
      {
        question: "A patient with hyperkalemia emergency arrives with unstable vital signs. Priority intervention?",
        options: [
          "Complete head-to-toe assessment before any intervention",
          "Systematic ABCDE assessment with simultaneous stabilization of life threats",
          "Obtain complete labs before treatment decisions",
          "Transfer to operating room without assessment"
        ],
        correct: 1,
        rationale: "Systematic ABCDE assessment with simultaneous stabilization of identified life threats ensures the most critical issues are addressed first for hyperkalemia emergency."
      }
    ]
  },
  "acute-glomerulonephritis-np": {
    title: "Acute Glomerulonephritis: Immunopathology",
    cellular: {
      title: "Pathophysiology of Acute Glomerulonephritis",
      content: "Acute Glomerulonephritis: Immunopathology involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to acute glomerulonephritis."
    },
    riskFactors: [
      "Rhabdomyolysis from trauma, statins, or extreme exertion",
      "Recurrent UTIs or urinary tract obstruction",
      "Multiple myeloma with cast nephropathy",
      "Autoimmune disease (SLE lupus nephritis, ANCA vasculitis)",
      "Sickle cell disease with papillary necrosis",
      "IV contrast administration (contrast-induced nephropathy)",
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)"
    ],
    diagnostics: [
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI",
      "24-hour urine collection for proteinuria quantification and CrCl",
      "PTH and vitamin D levels for renal osteodystrophy assessment",
      "Fractional excretion of sodium (FENa): <1% prerenal, >2% intrinsic renal",
      "Complement levels (C3, C4) for glomerulonephritis workup",
      "Comprehensive metabolic panel (electrolytes, calcium, phosphorus, bicarbonate)",
      "CBC for anemia of CKD evaluation"
    ],
    management: [
      "Blood pressure target <130/80 with ACEi/ARB as first-line",
      "Dialysis initiation for refractory hyperkalemia, volume overload, uremic symptoms",
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5",
      "ESA therapy (epoetin alfa) for anemia of CKD (target Hgb 10-11.5 g/dL)",
      "Nephrology referral when eGFR <30 or rapidly declining",
      "Potassium management: kayexalate, patiromer, or sodium zirconium cyclosilicate",
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      },
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Acute Glomerulonephritis management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with acute glomerulonephritis has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "nephrogenic-di-np": {
    title: "Nephrogenic Diabetes Insipidus",
    cellular: {
      title: "Pathophysiology of Nephrogenic Diabetes Insipidus",
      content: "Nephrogenic Diabetes Insipidus involves dysregulation of hormonal signaling pathways, feedback mechanisms, and metabolic homeostasis affecting nephrogenic diabetes insipidus physiology."
    },
    riskFactors: [
      "Prior radiation to head/neck affecting thyroid or pituitary",
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)",
      "Obesity (BMI >30) with insulin resistance",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "Iodine deficiency or excess affecting thyroid function",
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)"
    ],
    diagnostics: [
      "Dexamethasone suppression test (1mg overnight) for Cushing screening",
      "TSH (most sensitive for primary thyroid dysfunction)",
      "Free T4 and Free T3 for thyroid hormone assessment",
      "IGF-1 for growth hormone excess or deficiency screening",
      "Cosyntropin stimulation test for adrenal insufficiency",
      "PTH with calcium and phosphorus for parathyroid evaluation",
      "Prolactin level for pituitary evaluation"
    ],
    management: [
      "Hydrocortisone replacement for adrenal insufficiency (15-25mg/day in divided doses)",
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM",
      "Levothyroxine replacement for hypothyroidism (1.6 mcg/kg/day, titrate by TSH q6-8 weeks)",
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Stress dose steroids: hydrocortisone 100mg IV q8h for adrenal crisis",
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      },
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Nephrogenic Diabetes Insipidus management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected nephrogenic diabetes insipidus. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for nephrogenic diabetes insipidus",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for nephrogenic diabetes insipidus while being cost-effective."
      }
    ]
  },
  "siadh-deep-pathophysiology-np": {
    title: "SIADH Deep Pathophysiology: ADH Signaling",
    cellular: {
      title: "Pathophysiology of SIADH Deep Pathophysiology",
      content: "SIADH Deep Pathophysiology: ADH Signaling involves dysregulation of hormonal signaling pathways, feedback mechanisms, and metabolic homeostasis affecting siadh deep pathophysiology physiology."
    },
    riskFactors: [
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "Age-related hormonal decline (menopause, andropause)",
      "Chronic corticosteroid use with HPA axis suppression",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "MEN syndrome family history",
      "Eating disorders with hypothalamic amenorrhea",
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)"
    ],
    diagnostics: [
      "IGF-1 for growth hormone excess or deficiency screening",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis",
      "Morning cortisol (8 AM) and ACTH for adrenal function",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "24-hour urine free cortisol for Cushing confirmation",
      "Plasma metanephrines for pheochromocytoma screening",
      "PTH with calcium and phosphorus for parathyroid evaluation"
    ],
    management: [
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM",
      "SGLT2 inhibitor or GLP-1 RA for T2DM with CV disease or CKD",
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Bisphosphonate therapy for osteoporosis with DEXA monitoring",
      "Medical nutrition therapy with carbohydrate counting",
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Levothyroxine (Synthroid)",
        type: "Synthetic T4",
        action: "Replaces endogenous thyroxine; peripherally converted to active T3 by deiodinases",
        sideEffects: "Palpitations, tachycardia, tremor, weight loss, osteoporosis (if over-replaced)",
        contra: "Uncorrected adrenal insufficiency (must replace cortisol first), acute MI (start low dose)",
        pearl: "Take on empty stomach 30-60 min before breakfast. Separate from calcium, iron by 4h. Goal TSH 0.5-2.5 in most adults."
      },
      {
        name: "Insulin Glargine (Lantus/Basaglar)",
        type: "Long-Acting Basal Insulin",
        action: "Forms microprecipitates in subcutaneous tissue providing steady insulin release over ~24 hours",
        sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites",
        contra: "During hypoglycemic episodes",
        pearl: "Start 10 units or 0.1-0.2 U/kg at bedtime. Titrate by 2 units every 3 days to fasting glucose <130. Cannot be mixed with other insulins."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "SIADH Deep Pathophysiology management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected siadh deep pathophysiology. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for siadh deep pathophysiology",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for siadh deep pathophysiology while being cost-effective."
      }
    ]
  },
  "anion-gap-metabolic-acidosis-np": {
    title: "Anion Gap Metabolic Acidosis: MUDPILES",
    cellular: {
      title: "Pathophysiology of Anion Gap Metabolic Acidosis",
      content: "Anion Gap Metabolic Acidosis: MUDPILES involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to anion gap metabolic acidosis."
    },
    riskFactors: [
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)",
      "Age >60 with age-related GFR decline",
      "Family history of polycystic kidney disease or Alport syndrome",
      "Hypertension (second leading cause of CKD)",
      "NSAID use >7 days (prostaglandin-mediated afferent arteriolar constriction)",
      "Rhabdomyolysis from trauma, statins, or extreme exertion",
      "Multiple myeloma with cast nephropathy"
    ],
    diagnostics: [
      "CBC for anemia of CKD evaluation",
      "Urinalysis with microscopy (casts, crystals, cells)",
      "Renal ultrasound for size, echogenicity, obstruction, masses",
      "BUN/Creatinine ratio (>20:1 suggests prerenal etiology)",
      "Urine albumin-to-creatinine ratio (UACR >30 mg/g = albuminuria)",
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI",
      "PTH and vitamin D levels for renal osteodystrophy assessment"
    ],
    management: [
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)",
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)",
      "Phosphorus restriction and phosphate binders (sevelamer, calcium acetate)",
      "Discontinue nephrotoxins (NSAIDs, aminoglycosides, contrast)",
      "SGLT2 inhibitor for CKD with or without diabetes (DAPA-CKD, CREDENCE trials)",
      "Blood pressure target <130/80 with ACEi/ARB as first-line",
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      },
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Anion Gap Metabolic Acidosis management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with anion gap metabolic acidosis has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "hhs-deep-dive-np": {
    title: "HHS Deep Dive: Extreme Hyperosmolarity",
    cellular: {
      title: "Pathophysiology of HHS Deep Dive",
      content: "DKA: absolute/relative insulin deficiency causing lipolysis, ketogenesis. Triad: glucose >250, pH <7.3, bicarb <18, ketonemia. HHS: extreme hyperglycemia (>600), hyperosmolality (>320) without significant ketosis. DKA treatment: NS 15-20 mL/kg/hr, insulin drip 0.1-0.14 U/kg/hr, K+ replacement when <5.3. Transition to SC insulin when glucose <200, bicarb >=15, pH >7.3, AG closed."
    },
    riskFactors: [
      "Pituitary adenoma causing hormonal hypersecretion or deficiency",
      "Metabolic syndrome (waist circumference, triglycerides, HDL, BP, glucose)",
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "Family history of endocrine disorders (autoimmune thyroid, T2DM)",
      "Eating disorders with hypothalamic amenorrhea",
      "Autoimmune disease predisposition (Type 1 DM, Hashimoto's, Addison's)",
      "Sleep deprivation disrupting cortisol and growth hormone secretion"
    ],
    diagnostics: [
      "Fine needle aspiration biopsy of thyroid nodules (Bethesda classification)",
      "Prolactin level for pituitary evaluation",
      "IGF-1 for growth hormone excess or deficiency screening",
      "TSH (most sensitive for primary thyroid dysfunction)",
      "Plasma metanephrines for pheochromocytoma screening",
      "HbA1c for 3-month glycemic control (target <7% for most adults)",
      "Pituitary MRI for sellar/suprasellar mass evaluation"
    ],
    management: [
      "Diabetes self-management education and support (DSMES)",
      "Cabergoline for prolactinoma (first-line, shrinks tumor in >80%)",
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Metformin 500mg BID titrated to 1000mg BID as first-line for T2DM",
      "Medical nutrition therapy with carbohydrate counting",
      "Methimazole for hyperthyroidism (start 5-30mg daily based on severity)",
      "Annual diabetic complication screening (retinal, renal, neuropathy, foot)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Semaglutide (Ozempic/Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics incretin GLP-1: stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety",
        sideEffects: "Nausea (dose-dependent), vomiting, diarrhea, pancreatitis risk, injection site reactions",
        contra: "Personal/family history of medullary thyroid carcinoma, MEN2 syndrome",
        pearl: "Start 0.25mg SC weekly x4 weeks, titrate monthly. SUSTAIN-6: 26% MACE reduction. Wegovy approved for weight management."
      },
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Decreases hepatic glucose production, increases insulin sensitivity, reduces intestinal glucose absorption",
        sideEffects: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)",
        contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate), acute/chronic metabolic acidosis",
        pearl: "Start 500mg with dinner, increase by 500mg weekly. Extended-release reduces GI side effects. Hold for iodinated contrast if eGFR <45."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "HHS Deep Dive management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected hhs deep dive. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for hhs deep dive",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for hhs deep dive while being cost-effective."
      }
    ]
  },
  "renal-tubular-acidosis-np": {
    title: "Renal Tubular Acidosis: Types I–IV",
    cellular: {
      title: "Pathophysiology of Renal Tubular Acidosis",
      content: "Renal Tubular Acidosis: Types I–IV involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to renal tubular acidosis."
    },
    riskFactors: [
      "Sickle cell disease with papillary necrosis",
      "Family history of polycystic kidney disease or Alport syndrome",
      "Volume depletion from any cause",
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)",
      "Autoimmune disease (SLE lupus nephritis, ANCA vasculitis)",
      "Age >60 with age-related GFR decline",
      "NSAID use >7 days (prostaglandin-mediated afferent arteriolar constriction)"
    ],
    diagnostics: [
      "Complement levels (C3, C4) for glomerulonephritis workup",
      "Renal ultrasound for size, echogenicity, obstruction, masses",
      "ANCA, anti-GBM, anti-dsDNA for autoimmune renal disease",
      "CBC for anemia of CKD evaluation",
      "Fractional excretion of sodium (FENa): <1% prerenal, >2% intrinsic renal",
      "Urinalysis with microscopy (casts, crystals, cells)",
      "Urine albumin-to-creatinine ratio (UACR >30 mg/g = albuminuria)"
    ],
    management: [
      "Nephrology referral when eGFR <30 or rapidly declining",
      "Phosphorus restriction and phosphate binders (sevelamer, calcium acetate)",
      "Renal replacement therapy planning: HD vs PD vs transplant evaluation",
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)",
      "ESA therapy (epoetin alfa) for anemia of CKD (target Hgb 10-11.5 g/dL)",
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)",
      "SGLT2 inhibitor for CKD with or without diabetes (DAPA-CKD, CREDENCE trials)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      },
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Renal Tubular Acidosis management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with renal tubular acidosis has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "nephrolithiasis-prevention-np": {
    title: "Nephrolithiasis Prevention: 24-Hour Urine",
    cellular: {
      title: "Pathophysiology of Nephrolithiasis Prevention",
      content: "Nephrolithiasis Prevention: 24-Hour Urine involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to nephrolithiasis prevention."
    },
    riskFactors: [
      "Age >60 with age-related GFR decline",
      "Multiple myeloma with cast nephropathy",
      "NSAID use >7 days (prostaglandin-mediated afferent arteriolar constriction)",
      "Rhabdomyolysis from trauma, statins, or extreme exertion",
      "Diabetes mellitus (leading cause of CKD, 44% of new ESRD)",
      "Recurrent UTIs or urinary tract obstruction",
      "Sickle cell disease with papillary necrosis"
    ],
    diagnostics: [
      "Urinalysis with microscopy (casts, crystals, cells)",
      "PTH and vitamin D levels for renal osteodystrophy assessment",
      "Urine albumin-to-creatinine ratio (UACR >30 mg/g = albuminuria)",
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI",
      "Serum creatinine with eGFR calculation (CKD-EPI equation)",
      "24-hour urine collection for proteinuria quantification and CrCl",
      "Complement levels (C3, C4) for glomerulonephritis workup"
    ],
    management: [
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)",
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5",
      "SGLT2 inhibitor for CKD with or without diabetes (DAPA-CKD, CREDENCE trials)",
      "Blood pressure target <130/80 with ACEi/ARB as first-line",
      "Volume resuscitation with isotonic crystalloid for prerenal AKI",
      "Dialysis initiation for refractory hyperkalemia, volume overload, uremic symptoms",
      "Nephrology referral when eGFR <30 or rapidly declining"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      },
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Nephrolithiasis Prevention management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with nephrolithiasis prevention has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "polycystic-kidney-management-np": {
    title: "Polycystic Kidney Disease: Tolvaptan",
    cellular: {
      title: "Pathophysiology of Polycystic Kidney Disease",
      content: "Polycystic Kidney Disease: Tolvaptan involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to polycystic kidney disease."
    },
    riskFactors: [
      "Diabetes mellitus (leading cause of CKD, 44% of new ESRD)",
      "Volume depletion from any cause",
      "Hypertension (second leading cause of CKD)",
      "Sickle cell disease with papillary necrosis",
      "Rhabdomyolysis from trauma, statins, or extreme exertion",
      "Family history of polycystic kidney disease or Alport syndrome",
      "Autoimmune disease (SLE lupus nephritis, ANCA vasculitis)"
    ],
    diagnostics: [
      "Serum creatinine with eGFR calculation (CKD-EPI equation)",
      "ANCA, anti-GBM, anti-dsDNA for autoimmune renal disease",
      "BUN/Creatinine ratio (>20:1 suggests prerenal etiology)",
      "Complement levels (C3, C4) for glomerulonephritis workup",
      "Renal biopsy for unexplained proteinuria, hematuria, or AKI",
      "Renal ultrasound for size, echogenicity, obstruction, masses",
      "Fractional excretion of sodium (FENa): <1% prerenal, >2% intrinsic renal"
    ],
    management: [
      "Volume resuscitation with isotonic crystalloid for prerenal AKI",
      "Renal replacement therapy planning: HD vs PD vs transplant evaluation",
      "Discontinue nephrotoxins (NSAIDs, aminoglycosides, contrast)",
      "Nephrology referral when eGFR <30 or rapidly declining",
      "Blood pressure target <130/80 with ACEi/ARB as first-line",
      "Phosphorus restriction and phosphate binders (sevelamer, calcium acetate)",
      "ESA therapy (epoetin alfa) for anemia of CKD (target Hgb 10-11.5 g/dL)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      },
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Polycystic Kidney Disease management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with polycystic kidney disease has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "tls-renal-injury-np": {
    title: "Tumor Lysis Syndrome Renal Injury: Urate",
    cellular: {
      title: "Pathophysiology of Tumor Lysis Syndrome Renal Injury",
      content: "Tumor Lysis Syndrome Renal Injury: Urate involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to tumor lysis syndrome renal injury."
    },
    riskFactors: [
      "Family history of polycystic kidney disease or Alport syndrome",
      "NSAID use >7 days (prostaglandin-mediated afferent arteriolar constriction)",
      "Autoimmune disease (SLE lupus nephritis, ANCA vasculitis)",
      "Age >60 with age-related GFR decline",
      "IV contrast administration (contrast-induced nephropathy)",
      "Multiple myeloma with cast nephropathy",
      "Diabetes mellitus (leading cause of CKD, 44% of new ESRD)"
    ],
    diagnostics: [
      "Renal ultrasound for size, echogenicity, obstruction, masses",
      "Urine albumin-to-creatinine ratio (UACR >30 mg/g = albuminuria)",
      "Fractional excretion of sodium (FENa): <1% prerenal, >2% intrinsic renal",
      "Urinalysis with microscopy (casts, crystals, cells)",
      "Comprehensive metabolic panel (electrolytes, calcium, phosphorus, bicarbonate)",
      "PTH and vitamin D levels for renal osteodystrophy assessment",
      "Serum creatinine with eGFR calculation (CKD-EPI equation)"
    ],
    management: [
      "Phosphorus restriction and phosphate binders (sevelamer, calcium acetate)",
      "SGLT2 inhibitor for CKD with or without diabetes (DAPA-CKD, CREDENCE trials)",
      "ESA therapy (epoetin alfa) for anemia of CKD (target Hgb 10-11.5 g/dL)",
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)",
      "Potassium management: kayexalate, patiromer, or sodium zirconium cyclosilicate",
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5",
      "Volume resuscitation with isotonic crystalloid for prerenal AKI"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      },
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Tumor Lysis Syndrome Renal Injury management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with tumor lysis syndrome renal injury has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "chronic-kidney-disease-np": {
    title: "Chronic Kidney Disease",
    cellular: {
      title: "Pathophysiology of Chronic Kidney Disease",
      content: "CKD staging by eGFR (CKD-EPI): G1 (>=90 with albuminuria), G2 (60-89), G3a (45-59), G3b (30-44), G4 (15-29), G5 (<15). Albuminuria staging: A1 (<30), A2 (30-300), A3 (>300 mg/g). Progressive nephron loss activates RAAS increasing intraglomerular pressure. SGLT2 inhibitors reduce hyperfiltration via tubuloglomerular feedback. Complications: anemia (decreased EPO), CKD-MBD (secondary hyperparathyroidism), metabolic acidosis, hyperkalemia."
    },
    riskFactors: [
      "Multiple myeloma with cast nephropathy",
      "Sickle cell disease with papillary necrosis",
      "Diabetes mellitus (leading cause of CKD, 44% of new ESRD)",
      "Recurrent UTIs or urinary tract obstruction",
      "Volume depletion from any cause",
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)",
      "Family history of polycystic kidney disease or Alport syndrome"
    ],
    diagnostics: [
      "PTH and vitamin D levels for renal osteodystrophy assessment",
      "Complement levels (C3, C4) for glomerulonephritis workup",
      "Serum creatinine with eGFR calculation (CKD-EPI equation)",
      "24-hour urine collection for proteinuria quantification and CrCl",
      "ANCA, anti-GBM, anti-dsDNA for autoimmune renal disease",
      "CBC for anemia of CKD evaluation",
      "Renal ultrasound for size, echogenicity, obstruction, masses"
    ],
    management: [
      "Dietary protein restriction (0.8 g/kg/day) for CKD stages 3-5",
      "Nephrology referral when eGFR <30 or rapidly declining",
      "Volume resuscitation with isotonic crystalloid for prerenal AKI",
      "Dialysis initiation for refractory hyperkalemia, volume overload, uremic symptoms",
      "Renal replacement therapy planning: HD vs PD vs transplant evaluation",
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)",
      "Phosphorus restriction and phosphate binders (sevelamer, calcium acetate)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      },
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Chronic Kidney Disease management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with chronic kidney disease has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "male-infertility-np": {
    title: "Male Infertility: Workup & Treatment",
    cellular: {
      title: "Pathophysiology of Male Infertility",
      content: "Male infertility contributes to ~50% of infertile couples. Evaluation: semen analysis (WHO criteria: volume >1.5mL, concentration >15M/mL, motility >40%, morphology >4% normal). Common causes: varicocele (35-40%, most correctable cause), hypogonadism, genetic (Klinefelter 47,XXY, Y-microdeletion), obstructive (CBAVD associated with CFTR mutations). Workup: 2 semen analyses, FSH/LH/testosterone, scrotal ultrasound. Varicocele repair improves semen parameters in 60-70%."
    },
    riskFactors: [
      "Age >50 for prostatic disease",
      "Diabetes mellitus (erectile dysfunction, balanitis)",
      "Medications affecting sexual function (SSRIs, beta-blockers, 5-ARIs)",
      "Sickle cell disease (priapism)",
      "Uncircumcised status (balanitis, phimosis)",
      "Testosterone deficiency (hypogonadism)",
      "History of undescended testis or testicular trauma"
    ],
    diagnostics: [
      "Focused genitourinary examination",
      "PSA and DRE for prostate evaluation",
      "Urinalysis and urine culture",
      "Scrotal ultrasound with Doppler flow assessment",
      "Testosterone (total and free, morning draw)",
      "FSH, LH for gonadal axis evaluation",
      "Semen analysis (2 specimens, 2-7 days abstinence)"
    ],
    management: [
      "Condition-specific pharmacotherapy for male infertility",
      "Alpha-blockers (tamsulosin) for BPH/LUTS",
      "PDE5 inhibitors (sildenafil, tadalafil) for erectile dysfunction",
      "Testosterone replacement for confirmed hypogonadism",
      "Surgical referral for anatomic or refractory conditions",
      "Urology consultation for complex presentations",
      "Sexual health counseling and partner involvement"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urinary symptoms (frequency, urgency, hesitancy, weak stream)",
        "Erectile dysfunction or ejaculatory problems",
        "Testicular pain, swelling, or mass",
        "Infertility or decreased libido"
      ],
      right: [
        "Prostatic enlargement on DRE",
        "Testicular atrophy or asymmetry",
        "Varicocele (bag of worms on palpation)",
        "Gynecomastia or decreased secondary sexual characteristics"
      ]
    },
    medications: [
      {
        name: "Tamsulosin (Flomax)",
        type: "Alpha-1A Selective Blocker",
        action: "Selectively blocks alpha-1A receptors in prostate and bladder neck reducing smooth muscle tone",
        sideEffects: "Orthostatic hypotension, dizziness, retrograde ejaculation, intraoperative floppy iris syndrome",
        contra: "Concurrent PDE5 inhibitor (additive hypotension), cataract surgery (inform ophthalmologist)",
        pearl: "0.4mg daily 30 min after same meal. Most uroselective alpha-blocker. Warn about ejaculatory dysfunction. Effect within days."
      },
      {
        name: "Finasteride (Proscar)",
        type: "5-Alpha Reductase Inhibitor (Type II)",
        action: "Blocks conversion of testosterone to DHT reducing prostate volume by 20-30% over 6 months",
        sideEffects: "Decreased libido, erectile dysfunction, gynecomastia, depression, PSA reduction by ~50%",
        contra: "Pregnancy exposure (teratogenic: Category X), women of childbearing age handling crushed tablets",
        pearl: "5mg daily for BPH (or 1mg as Propecia for hair loss). Takes 6-12 months for full effect. Adjust PSA by doubling value. MTOPS trial: combination with alpha-blocker superior."
      }
    ],
    pearls: [
      "PSA should be doubled in patients on 5-ARIs for accurate cancer screening interpretation",
      "Testicular torsion: urologic emergency; negative Prehn sign, absent cremasteric reflex, high-riding testis. Surgery within 6h for salvage",
      "Male Infertility evaluation requires sensitive, non-judgmental approach with thorough history and focused examination"
    ],
    quiz: [
      {
        question: "A patient with male infertility presents for evaluation. Most important initial step?",
        options: [
          "Empiric testosterone replacement",
          "Focused history, examination, and targeted diagnostic evaluation",
          "Immediate surgical referral without workup",
          "Observation only with annual follow-up"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides appropriate management for male infertility."
      }
    ]
  },
  "bph-turp-np": {
    title: "BPH/TURP: Pharmacology",
    cellular: {
      title: "Pharmacology of BPH/TURP",
      content: "BPH/TURP: Pharmacology encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to bph/turp."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "BPH/TURP management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to bph/turp. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "continuous-bladder-irrigation-np": {
    title: "Continuous Bladder Irrigation: Ordering",
    cellular: {
      title: "Pathophysiology of Continuous Bladder Irrigation",
      content: "Continuous Bladder Irrigation: Ordering involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to continuous bladder irrigation."
    },
    riskFactors: [
      "Recurrent UTIs or urinary tract obstruction",
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)",
      "Sickle cell disease with papillary necrosis",
      "IV contrast administration (contrast-induced nephropathy)",
      "Family history of polycystic kidney disease or Alport syndrome",
      "Hypertension (second leading cause of CKD)",
      "Age >60 with age-related GFR decline"
    ],
    diagnostics: [
      "24-hour urine collection for proteinuria quantification and CrCl",
      "CBC for anemia of CKD evaluation",
      "Complement levels (C3, C4) for glomerulonephritis workup",
      "Comprehensive metabolic panel (electrolytes, calcium, phosphorus, bicarbonate)",
      "Renal ultrasound for size, echogenicity, obstruction, masses",
      "BUN/Creatinine ratio (>20:1 suggests prerenal etiology)",
      "Urinalysis with microscopy (casts, crystals, cells)"
    ],
    management: [
      "Dialysis initiation for refractory hyperkalemia, volume overload, uremic symptoms",
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)",
      "Nephrology referral when eGFR <30 or rapidly declining",
      "Potassium management: kayexalate, patiromer, or sodium zirconium cyclosilicate",
      "Phosphorus restriction and phosphate binders (sevelamer, calcium acetate)",
      "Discontinue nephrotoxins (NSAIDs, aminoglycosides, contrast)",
      "ACEi/ARB for proteinuric CKD (reduce intraglomerular pressure)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Sevelamer (Renagel/Renvela)",
        type: "Non-Calcium Phosphate Binder",
        action: "Binds dietary phosphorus in GI tract preventing absorption; does not contain calcium",
        sideEffects: "GI upset, constipation, metabolic acidosis (HCl form)",
        contra: "Bowel obstruction, ileus",
        pearl: "Preferred over calcium-based binders in CKD with hypercalcemia or vascular calcification. Take with meals. 800mg TID initial."
      },
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Continuous Bladder Irrigation management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with continuous bladder irrigation has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "dic-management-np": {
    title: "DIC: Coagulation Cascade",
    cellular: {
      title: "Pathophysiology of DIC",
      content: "DIC involves systemic activation of coagulation with simultaneous consumption of clotting factors and platelets causing both microvascular thrombosis and hemorrhage. Triggers: sepsis, trauma, malignancy, obstetric complications. Labs: prolonged PT/aPTT, low fibrinogen (<100), elevated D-dimer, thrombocytopenia, schistocytes on smear. Treatment: treat underlying cause, replace with FFP/cryo/platelets if bleeding, heparin only if thrombosis predominates."
    },
    riskFactors: [
      "Liver disease with coagulopathy and thrombocytopenia",
      "Family history of hereditary hematologic conditions (sickle cell, thalassemia)",
      "Splenomegaly with hypersplenism",
      "Malignancy with bone marrow infiltration or DIC",
      "Chemotherapy-induced myelosuppression",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Chronic kidney disease with decreased erythropoietin"
    ],
    diagnostics: [
      "Haptoglobin (decreased in hemolysis), LDH (elevated in hemolysis)",
      "Fibrinogen level for DIC or consumption coagulopathy",
      "Hemoglobin electrophoresis for hemoglobinopathy screening",
      "D-dimer for DIC screening or fibrinolysis assessment",
      "Peripheral smear morphology (schistocytes, spherocytes, target cells)",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "B12 and folate levels (methylmalonic acid if B12 borderline)"
    ],
    management: [
      "IVIG for severe ITP with active bleeding or preprocedural",
      "Anticoagulation management: warfarin (INR 2-3), DOACs, or heparin bridging",
      "Hydroxyurea for sickle cell disease (reduces HbS polymerization)",
      "Type and screen before anticipated transfusion; crossmatch for surgical procedures",
      "Platelet transfusion for count <10K (prophylactic) or <50K with active bleeding",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Folate supplementation: 1mg PO daily"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      },
      {
        name: "Warfarin (Coumadin)",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K epoxide reductase blocking synthesis of factors II, VII, IX, X and proteins C & S",
        sideEffects: "Bleeding, skin necrosis (protein C deficiency), teratogenicity, drug/food interactions",
        contra: "Pregnancy (first trimester), active bleeding, severe hepatic disease, non-adherent patients",
        pearl: "Bridge with heparin for 5 days (protein C depleted before clotting factors). INR goal 2-3 for most indications; 2.5-3.5 for mechanical mitral valve."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "DIC management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with dic presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of dic."
      }
    ]
  },
  "hit-np": {
    title: "Heparin-Induced Thrombocytopenia (HIT): 4T",
    cellular: {
      title: "Pathophysiology of Heparin-Induced Thrombocytopenia (HIT)",
      content: "Immune thrombocytopenia (ITP) involves autoantibody-mediated platelet destruction (anti-GPIIb/IIIa) and impaired megakaryopoiesis. Diagnosis of exclusion: isolated thrombocytopenia without other causes. Treatment: observation if platelets >30K and asymptomatic. First-line: corticosteroids (dexamethasone 40mg x4 days or prednisone 1mg/kg). IVIG for rapid count increase. Second-line: TPO-RA (eltrombopag, romiplostim), rituximab, splenectomy."
    },
    riskFactors: [
      "Chronic disease states causing anemia of inflammation",
      "Recent surgery or trauma with blood loss",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Splenomegaly with hypersplenism",
      "Antiphospholipid syndrome with thrombotic risk",
      "Chemotherapy-induced myelosuppression",
      "Autoimmune conditions (ITP, AIHA, TTP-HUS)"
    ],
    diagnostics: [
      "Reticulocyte count (production index) for bone marrow response",
      "Bone marrow biopsy for unexplained cytopenias or suspected malignancy",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "Hemoglobin electrophoresis for hemoglobinopathy screening",
      "Flow cytometry for leukemia/lymphoma immunophenotyping",
      "Peripheral smear morphology (schistocytes, spherocytes, target cells)",
      "Direct antiglobulin test (Coombs) for autoimmune hemolytic anemia"
    ],
    management: [
      "IV iron (ferric carboxymaltose or iron sucrose) for oral intolerance or malabsorption",
      "FFP or PCC for urgent warfarin reversal with active bleeding",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Hydroxyurea for sickle cell disease (reduces HbS polymerization)",
      "Hematology referral for unexplained cytopenias or suspected malignancy",
      "Platelet transfusion for count <10K (prophylactic) or <50K with active bleeding",
      "Steroids (prednisone 1mg/kg) for autoimmune cytopenias (ITP, AIHA)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Warfarin (Coumadin)",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K epoxide reductase blocking synthesis of factors II, VII, IX, X and proteins C & S",
        sideEffects: "Bleeding, skin necrosis (protein C deficiency), teratogenicity, drug/food interactions",
        contra: "Pregnancy (first trimester), active bleeding, severe hepatic disease, non-adherent patients",
        pearl: "Bridge with heparin for 5 days (protein C depleted before clotting factors). INR goal 2-3 for most indications; 2.5-3.5 for mechanical mitral valve."
      },
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Heparin-Induced Thrombocytopenia (HIT) management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with heparin-induced thrombocytopenia (hit) presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of heparin-induced thrombocytopenia (hit)."
      }
    ]
  },
  "ttp-np": {
    title: "Thrombotic Thrombocytopenic Purpura (TTP)",
    cellular: {
      title: "Pathophysiology of Thrombotic Thrombocytopenic Purpura (TTP)",
      content: "Thrombotic Thrombocytopenic Purpura (TTP) involves alterations in hematopoiesis, hemoglobin function, coagulation, or fibrinolysis relevant to thrombotic thrombocytopenic purpura (ttp)."
    },
    riskFactors: [
      "Family history of hereditary hematologic conditions (sickle cell, thalassemia)",
      "Chronic kidney disease with decreased erythropoietin",
      "Chemotherapy-induced myelosuppression",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Anticoagulant or antiplatelet therapy increasing bleeding risk",
      "Antiphospholipid syndrome with thrombotic risk",
      "Iron deficiency (most common cause of anemia worldwide)"
    ],
    diagnostics: [
      "Fibrinogen level for DIC or consumption coagulopathy",
      "B12 and folate levels (methylmalonic acid if B12 borderline)",
      "Peripheral smear morphology (schistocytes, spherocytes, target cells)",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "PT/INR and aPTT for coagulation pathway assessment",
      "Flow cytometry for leukemia/lymphoma immunophenotyping",
      "CBC with differential and peripheral blood smear review"
    ],
    management: [
      "Anticoagulation management: warfarin (INR 2-3), DOACs, or heparin bridging",
      "Folate supplementation: 1mg PO daily",
      "Platelet transfusion for count <10K (prophylactic) or <50K with active bleeding",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Transfusion threshold: Hgb <7 g/dL (restrictive) or <8 with active cardiac disease",
      "Hematology referral for unexplained cytopenias or suspected malignancy",
      "Oral iron replacement: ferrous sulfate 325mg (65mg elemental) daily on empty stomach"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      },
      {
        name: "Warfarin (Coumadin)",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K epoxide reductase blocking synthesis of factors II, VII, IX, X and proteins C & S",
        sideEffects: "Bleeding, skin necrosis (protein C deficiency), teratogenicity, drug/food interactions",
        contra: "Pregnancy (first trimester), active bleeding, severe hepatic disease, non-adherent patients",
        pearl: "Bridge with heparin for 5 days (protein C depleted before clotting factors). INR goal 2-3 for most indications; 2.5-3.5 for mechanical mitral valve."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Thrombotic Thrombocytopenic Purpura (TTP) management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with thrombotic thrombocytopenic purpura (ttp) presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of thrombotic thrombocytopenic purpura (ttp)."
      }
    ]
  },
  "hus-np": {
    title: "Hemolytic Uremic Syndrome (HUS): Shiga Toxin",
    cellular: {
      title: "Pathophysiology of Hemolytic Uremic Syndrome (HUS)",
      content: "Hemolytic Uremic Syndrome (HUS): Shiga Toxin involves alterations in hematopoiesis, hemoglobin function, coagulation, or fibrinolysis relevant to hemolytic uremic syndrome (hus)."
    },
    riskFactors: [
      "Chronic kidney disease with decreased erythropoietin",
      "Iron deficiency (most common cause of anemia worldwide)",
      "Anticoagulant or antiplatelet therapy increasing bleeding risk",
      "Antiphospholipid syndrome with thrombotic risk",
      "Chronic disease states causing anemia of inflammation",
      "Liver disease with coagulopathy and thrombocytopenia",
      "Splenomegaly with hypersplenism"
    ],
    diagnostics: [
      "B12 and folate levels (methylmalonic acid if B12 borderline)",
      "CBC with differential and peripheral blood smear review",
      "PT/INR and aPTT for coagulation pathway assessment",
      "Flow cytometry for leukemia/lymphoma immunophenotyping",
      "Reticulocyte count (production index) for bone marrow response",
      "Haptoglobin (decreased in hemolysis), LDH (elevated in hemolysis)",
      "Hemoglobin electrophoresis for hemoglobinopathy screening"
    ],
    management: [
      "Folate supplementation: 1mg PO daily",
      "Oral iron replacement: ferrous sulfate 325mg (65mg elemental) daily on empty stomach",
      "Transfusion threshold: Hgb <7 g/dL (restrictive) or <8 with active cardiac disease",
      "Hematology referral for unexplained cytopenias or suspected malignancy",
      "IV iron (ferric carboxymaltose or iron sucrose) for oral intolerance or malabsorption",
      "IVIG for severe ITP with active bleeding or preprocedural",
      "Hydroxyurea for sickle cell disease (reduces HbS polymerization)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Warfarin (Coumadin)",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K epoxide reductase blocking synthesis of factors II, VII, IX, X and proteins C & S",
        sideEffects: "Bleeding, skin necrosis (protein C deficiency), teratogenicity, drug/food interactions",
        contra: "Pregnancy (first trimester), active bleeding, severe hepatic disease, non-adherent patients",
        pearl: "Bridge with heparin for 5 days (protein C depleted before clotting factors). INR goal 2-3 for most indications; 2.5-3.5 for mechanical mitral valve."
      },
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Hemolytic Uremic Syndrome (HUS) management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with hemolytic uremic syndrome (hus) presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of hemolytic uremic syndrome (hus)."
      }
    ]
  },
  "hellp-vs-ttp-np": {
    title: "HELLP vs TTP Differentiation: Diagnostic",
    cellular: {
      title: "Pathophysiology of HELLP vs TTP Differentiation",
      content: "HELLP vs TTP Differentiation: Diagnostic involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to hellp vs ttp differentiation."
    },
    riskFactors: [
      "Recent travel to endemic areas (malaria, dengue, typhoid)",
      "Splenectomy with encapsulated organism susceptibility",
      "Immunocompromised state (HIV CD4 <200, transplant, chemotherapy)",
      "IV drug use with bacteremia risk",
      "Chronic liver disease with impaired immune function",
      "Age extremes (<2 and >65 years with immature/declining immunity)",
      "Malnutrition with impaired immune cell production"
    ],
    diagnostics: [
      "Sensitivity testing for targeted antimicrobial therapy",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)",
      "Blood cultures x2 sets (before antibiotics) from separate sites",
      "CT with contrast for abscess, collection, or source identification",
      "Nucleic acid amplification testing (NAAT) for STIs, TB, viral loads",
      "Wound/tissue/fluid cultures with Gram stain",
      "Urinalysis with urine culture and sensitivity"
    ],
    management: [
      "Immunization update for preventable infections",
      "Repeat cultures at 48-72h to document clearance",
      "Empiric broad-spectrum antibiotics within 1 hour for sepsis",
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "Infectious disease consultation for complex or resistant infections",
      "Isolation precautions: contact, droplet, or airborne based on pathogen",
      "Vancomycin for MRSA coverage (trough goal 15-20 or AUC/MIC 400-600)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors; bactericidal against gram-positive organisms",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated), ototoxicity, thrombocytopenia",
        contra: "Known hypersensitivity (can desensitize if necessary)",
        pearl: "AUC/MIC-guided dosing replacing trough-based monitoring. Target AUC 400-600 for MRSA. Load 25-30mg/kg, then 15-20mg/kg q8-12h."
      },
      {
        name: "Piperacillin-Tazobactam (Zosyn)",
        type: "Extended-Spectrum Penicillin + Beta-Lactamase Inhibitor",
        action: "Piperacillin inhibits PBP cell wall synthesis; tazobactam inhibits beta-lactamases extending gram-negative spectrum",
        sideEffects: "Diarrhea, C. diff risk, rash, hematological abnormalities, seizures (high dose)",
        contra: "Penicillin allergy (cross-reactivity ~2% with cephalosporins)",
        pearl: "3.375g IV q6h (extended infusion over 4h improves PK/PD). Covers Pseudomonas. Combines with vancomycin for broad empiric coverage."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "HELLP vs TTP Differentiation management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected hellp vs ttp differentiation has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "myelodysplastic-syndromes-np": {
    title: "Myelodysplastic Syndromes: Classification",
    cellular: {
      title: "Pathophysiology of Myelodysplastic Syndromes",
      content: "Myelodysplastic Syndromes: Classification involves host-pathogen interaction, immune response, and tissue-specific infectious pathology related to myelodysplastic syndromes."
    },
    riskFactors: [
      "IV drug use with bacteremia risk",
      "Age extremes (<2 and >65 years with immature/declining immunity)",
      "Splenectomy with encapsulated organism susceptibility",
      "Broad-spectrum antibiotic exposure (C. diff risk factor)",
      "Malnutrition with impaired immune cell production",
      "Diabetes mellitus with impaired neutrophil function",
      "Indwelling medical devices (central lines, urinary catheters, prosthetic joints)"
    ],
    diagnostics: [
      "CT with contrast for abscess, collection, or source identification",
      "Wound/tissue/fluid cultures with Gram stain",
      "Rapid antigen testing (strep, influenza, COVID-19, RSV)",
      "CRP and ESR for inflammatory response quantification",
      "Urinalysis with urine culture and sensitivity",
      "CBC with differential (left shift, leukocytosis, lymphopenia)",
      "Procalcitonin for bacterial infection likelihood"
    ],
    management: [
      "Antiviral therapy: oseltamivir for influenza, acyclovir for HSV/VZV",
      "Isolation precautions: contact, droplet, or airborne based on pathogen",
      "Repeat cultures at 48-72h to document clearance",
      "Antibiotic stewardship: shortest effective duration, IV to PO conversion",
      "Vancomycin for MRSA coverage (trough goal 15-20 or AUC/MIC 400-600)",
      "Source control: drainage, debridement, device removal",
      "IV fluid resuscitation: 30 mL/kg crystalloid for sepsis-induced hypoperfusion"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fever, chills, rigors",
        "Site-specific symptoms (cough, dysuria, wound drainage)",
        "Fatigue, malaise, myalgias",
        "Altered mental status in severe infection"
      ],
      right: [
        "Tachycardia, tachypnea, hypotension (sepsis)",
        "Localized erythema, warmth, swelling, tenderness",
        "Leukocytosis with left shift or leukopenia",
        "Elevated lactate, procalcitonin, CRP"
      ]
    },
    medications: [
      {
        name: "Ceftriaxone (Rocephin)",
        type: "Third-Generation Cephalosporin",
        action: "Binds PBPs inhibiting bacterial cell wall synthesis; broad gram-negative and some gram-positive coverage",
        sideEffects: "Diarrhea, rash, biliary sludging, C. diff, cross-reactivity with penicillin allergy (~2%)",
        contra: "Neonates on calcium-containing IV solutions, anaphylaxis to cephalosporins",
        pearl: "1-2g IV daily. Community-acquired pneumonia: ceftriaxone + azithromycin. Meningitis: 2g IV q12h. Do NOT mix with calcium IV."
      },
      {
        name: "Vancomycin",
        type: "Glycopeptide Antibiotic",
        action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala peptidoglycan precursors; bactericidal against gram-positive organisms",
        sideEffects: "Nephrotoxicity, red man syndrome (histamine-mediated), ototoxicity, thrombocytopenia",
        contra: "Known hypersensitivity (can desensitize if necessary)",
        pearl: "AUC/MIC-guided dosing replacing trough-based monitoring. Target AUC 400-600 for MRSA. Load 25-30mg/kg, then 15-20mg/kg q8-12h."
      }
    ],
    pearls: [
      "Blood cultures x2 BEFORE antibiotics; do not delay antibiotics for cultures in sepsis",
      "Source control (drainage, debridement, device removal) is as important as antibiotics",
      "Myelodysplastic Syndromes management requires culture-directed therapy with de-escalation when sensitivities available"
    ],
    quiz: [
      {
        question: "A patient with suspected myelodysplastic syndromes has temp 39.2C, HR 112, BP 88/54. Priority intervention?",
        options: [
          "Await culture results before treatment",
          "Blood cultures then immediate IV antibiotics and 30 mL/kg crystalloid resuscitation",
          "Oral antibiotics and outpatient follow-up",
          "CT scan before any treatment"
        ],
        correct: 1,
        rationale: "Sepsis management requires immediate cultures followed by broad-spectrum IV antibiotics and aggressive fluid resuscitation within the first hour."
      }
    ]
  },
  "antiphospholipid-syndrome-np": {
    title: "Antiphospholipid Syndrome: Thrombosis",
    cellular: {
      title: "Pathophysiology of Antiphospholipid Syndrome",
      content: "Antiphospholipid Syndrome: Thrombosis involves disruption of renal filtration, tubular function, electrolyte homeostasis, or acid-base balance specific to antiphospholipid syndrome."
    },
    riskFactors: [
      "Autoimmune disease (SLE lupus nephritis, ANCA vasculitis)",
      "IV contrast administration (contrast-induced nephropathy)",
      "Recurrent UTIs or urinary tract obstruction",
      "NSAID use >7 days (prostaglandin-mediated afferent arteriolar constriction)",
      "Nephrotoxic medications (aminoglycosides, vancomycin, amphotericin B)",
      "Diabetes mellitus (leading cause of CKD, 44% of new ESRD)",
      "Hypertension (second leading cause of CKD)"
    ],
    diagnostics: [
      "Fractional excretion of sodium (FENa): <1% prerenal, >2% intrinsic renal",
      "Comprehensive metabolic panel (electrolytes, calcium, phosphorus, bicarbonate)",
      "24-hour urine collection for proteinuria quantification and CrCl",
      "Urine albumin-to-creatinine ratio (UACR >30 mg/g = albuminuria)",
      "CBC for anemia of CKD evaluation",
      "Serum creatinine with eGFR calculation (CKD-EPI equation)",
      "BUN/Creatinine ratio (>20:1 suggests prerenal etiology)"
    ],
    management: [
      "ESA therapy (epoetin alfa) for anemia of CKD (target Hgb 10-11.5 g/dL)",
      "Potassium management: kayexalate, patiromer, or sodium zirconium cyclosilicate",
      "Dialysis initiation for refractory hyperkalemia, volume overload, uremic symptoms",
      "SGLT2 inhibitor for CKD with or without diabetes (DAPA-CKD, CREDENCE trials)",
      "Bicarbonate supplementation for metabolic acidosis (target HCO3 >22)",
      "Volume resuscitation with isotonic crystalloid for prerenal AKI",
      "Discontinue nephrotoxins (NSAIDs, aminoglycosides, contrast)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Oliguria (<400 mL/day) or anuria",
        "Peripheral edema and weight gain",
        "Uremic symptoms: nausea, anorexia, pruritus, encephalopathy",
        "Electrolyte-related symptoms (muscle cramps, weakness, paresthesias)"
      ],
      right: [
        "Elevated and trending creatinine",
        "Hyperkalemia (peaked T waves, widened QRS on ECG)",
        "Metabolic acidosis (Kussmaul respirations)",
        "Hypertension and fluid overload signs"
      ]
    },
    medications: [
      {
        name: "Epoetin Alfa (Epogen/Procrit)",
        type: "Erythropoiesis-Stimulating Agent",
        action: "Recombinant erythropoietin stimulating erythroid progenitor cells in bone marrow",
        sideEffects: "Hypertension, thromboembolic events, pure red cell aplasia (rare)",
        contra: "Uncontrolled hypertension, Hgb >11 g/dL (increased MACE risk)",
        pearl: "Target Hgb 10-11.5 g/dL (not >13). Check iron stores first (ferritin >100, TSAT >20%). SC preferred over IV for non-HD patients."
      },
      {
        name: "Dapagliflozin (Farxiga)",
        type: "SGLT2 Inhibitor",
        action: "Inhibits SGLT2 in proximal tubule reducing glucose reabsorption, activating tubuloglomerular feedback to reduce intraglomerular pressure",
        sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)",
        contra: "eGFR <20 for initiation (can continue if already on therapy), Type 1 DM, dialysis",
        pearl: "DAPA-CKD: 39% reduction in kidney composite endpoint regardless of diabetes. Start 10mg daily."
      }
    ],
    pearls: [
      "FENa <1% with oliguria suggests prerenal AKI; >2% suggests intrinsic renal disease",
      "Muddy brown granular casts = ATN; RBC casts = glomerulonephritis; WBC casts = interstitial nephritis",
      "Antiphospholipid Syndrome management requires close monitoring of fluid balance, electrolytes, and renal function trends"
    ],
    quiz: [
      {
        question: "A patient with antiphospholipid syndrome has rising creatinine and K+ 6.2 mEq/L with peaked T waves. Priority intervention?",
        options: [
          "Repeat labs in 24 hours",
          "IV calcium gluconate, insulin/dextrose, and continuous monitoring",
          "Oral potassium supplementation",
          "Discharge with dietary counseling"
        ],
        correct: 1,
        rationale: "Hyperkalemia >6.0 with ECG changes requires immediate IV calcium gluconate for cardiac membrane stabilization followed by potassium-lowering measures."
      }
    ]
  },
  "factor-v-leiden-np": {
    title: "Factor V Leiden: Thrombophilia Screening",
    cellular: {
      title: "Pathophysiology of Factor V Leiden",
      content: "Factor V Leiden is the most common inherited thrombophilia (5% of Caucasians). Point mutation (R506Q) renders Factor V resistant to inactivation by activated protein C. Heterozygous: 3-8x increased VTE risk. Homozygous: 80x increased risk. Other thrombophilias: prothrombin G20210A, antithrombin III deficiency, protein C/S deficiency. Screening indicated for unprovoked VTE <50, recurrent VTE, unusual site thrombosis, or strong family history."
    },
    riskFactors: [
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Antiphospholipid syndrome with thrombotic risk",
      "Chronic kidney disease with decreased erythropoietin",
      "Recent surgery or trauma with blood loss",
      "Iron deficiency (most common cause of anemia worldwide)",
      "Autoimmune conditions (ITP, AIHA, TTP-HUS)",
      "Liver disease with coagulopathy and thrombocytopenia"
    ],
    diagnostics: [
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "Flow cytometry for leukemia/lymphoma immunophenotyping",
      "B12 and folate levels (methylmalonic acid if B12 borderline)",
      "Bone marrow biopsy for unexplained cytopenias or suspected malignancy",
      "CBC with differential and peripheral blood smear review",
      "Direct antiglobulin test (Coombs) for autoimmune hemolytic anemia",
      "Haptoglobin (decreased in hemolysis), LDH (elevated in hemolysis)"
    ],
    management: [
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Hematology referral for unexplained cytopenias or suspected malignancy",
      "Folate supplementation: 1mg PO daily",
      "FFP or PCC for urgent warfarin reversal with active bleeding",
      "Oral iron replacement: ferrous sulfate 325mg (65mg elemental) daily on empty stomach",
      "Steroids (prednisone 1mg/kg) for autoimmune cytopenias (ITP, AIHA)",
      "IVIG for severe ITP with active bleeding or preprocedural"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      },
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Factor V Leiden management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with factor v leiden presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of factor v leiden."
      }
    ]
  },
  "febrile-neutropenia-np": {
    title: "Febrile Neutropenia: Risk Stratification",
    cellular: {
      title: "Pathophysiology of Febrile Neutropenia",
      content: "Febrile Neutropenia: Risk Stratification involves alterations in hematopoiesis, hemoglobin function, coagulation, or fibrinolysis relevant to febrile neutropenia."
    },
    riskFactors: [
      "Liver disease with coagulopathy and thrombocytopenia",
      "Family history of hereditary hematologic conditions (sickle cell, thalassemia)",
      "Splenomegaly with hypersplenism",
      "Malignancy with bone marrow infiltration or DIC",
      "Chemotherapy-induced myelosuppression",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Chronic kidney disease with decreased erythropoietin"
    ],
    diagnostics: [
      "Haptoglobin (decreased in hemolysis), LDH (elevated in hemolysis)",
      "Fibrinogen level for DIC or consumption coagulopathy",
      "Hemoglobin electrophoresis for hemoglobinopathy screening",
      "D-dimer for DIC screening or fibrinolysis assessment",
      "Peripheral smear morphology (schistocytes, spherocytes, target cells)",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "B12 and folate levels (methylmalonic acid if B12 borderline)"
    ],
    management: [
      "IVIG for severe ITP with active bleeding or preprocedural",
      "Anticoagulation management: warfarin (INR 2-3), DOACs, or heparin bridging",
      "Hydroxyurea for sickle cell disease (reduces HbS polymerization)",
      "Type and screen before anticipated transfusion; crossmatch for surgical procedures",
      "Platelet transfusion for count <10K (prophylactic) or <50K with active bleeding",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Folate supplementation: 1mg PO daily"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Warfarin (Coumadin)",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K epoxide reductase blocking synthesis of factors II, VII, IX, X and proteins C & S",
        sideEffects: "Bleeding, skin necrosis (protein C deficiency), teratogenicity, drug/food interactions",
        contra: "Pregnancy (first trimester), active bleeding, severe hepatic disease, non-adherent patients",
        pearl: "Bridge with heparin for 5 days (protein C depleted before clotting factors). INR goal 2-3 for most indications; 2.5-3.5 for mechanical mitral valve."
      },
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Febrile Neutropenia management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with febrile neutropenia presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of febrile neutropenia."
      }
    ]
  },
  "cml-management-np": {
    title: "CML: BCR-ABL & Tyrosine Kinase Inhibitors",
    cellular: {
      title: "Pathophysiology of CML",
      content: "CML: BCR-ABL & Tyrosine Kinase Inhibitors involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. CML pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for cml",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for cml",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for cml",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of cml",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to cml",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of cml",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for cml. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "CML requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of cml"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with cml. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for cml."
      }
    ]
  },
  "lymphoma-workup-np": {
    title: "Lymphoma Workup: Hodgkin vs Non-Hodgkin",
    cellular: {
      title: "Pathophysiology of Lymphoma Workup",
      content: "Lymphoma Workup: Hodgkin vs Non-Hodgkin involves alterations in hematopoiesis, hemoglobin function, coagulation, or fibrinolysis relevant to lymphoma workup."
    },
    riskFactors: [
      "Chronic disease states causing anemia of inflammation",
      "Recent surgery or trauma with blood loss",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Splenomegaly with hypersplenism",
      "Antiphospholipid syndrome with thrombotic risk",
      "Chemotherapy-induced myelosuppression",
      "Autoimmune conditions (ITP, AIHA, TTP-HUS)"
    ],
    diagnostics: [
      "Reticulocyte count (production index) for bone marrow response",
      "Bone marrow biopsy for unexplained cytopenias or suspected malignancy",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "Hemoglobin electrophoresis for hemoglobinopathy screening",
      "Flow cytometry for leukemia/lymphoma immunophenotyping",
      "Peripheral smear morphology (schistocytes, spherocytes, target cells)",
      "Direct antiglobulin test (Coombs) for autoimmune hemolytic anemia"
    ],
    management: [
      "IV iron (ferric carboxymaltose or iron sucrose) for oral intolerance or malabsorption",
      "FFP or PCC for urgent warfarin reversal with active bleeding",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Hydroxyurea for sickle cell disease (reduces HbS polymerization)",
      "Hematology referral for unexplained cytopenias or suspected malignancy",
      "Platelet transfusion for count <10K (prophylactic) or <50K with active bleeding",
      "Steroids (prednisone 1mg/kg) for autoimmune cytopenias (ITP, AIHA)"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Warfarin (Coumadin)",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K epoxide reductase blocking synthesis of factors II, VII, IX, X and proteins C & S",
        sideEffects: "Bleeding, skin necrosis (protein C deficiency), teratogenicity, drug/food interactions",
        contra: "Pregnancy (first trimester), active bleeding, severe hepatic disease, non-adherent patients",
        pearl: "Bridge with heparin for 5 days (protein C depleted before clotting factors). INR goal 2-3 for most indications; 2.5-3.5 for mechanical mitral valve."
      },
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Lymphoma Workup management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with lymphoma workup presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of lymphoma workup."
      }
    ]
  },
  "iron-deficiency-anemia-np": {
    title: "Iron Deficiency Anemia: Differential",
    cellular: {
      title: "Pathophysiology of Iron Deficiency Anemia",
      content: "Iron Deficiency Anemia: Differential involves alterations in hematopoiesis, hemoglobin function, coagulation, or fibrinolysis relevant to iron deficiency anemia."
    },
    riskFactors: [
      "Recent surgery or trauma with blood loss",
      "Autoimmune conditions (ITP, AIHA, TTP-HUS)",
      "Antiphospholipid syndrome with thrombotic risk",
      "Chemotherapy-induced myelosuppression",
      "Liver disease with coagulopathy and thrombocytopenia",
      "Anticoagulant or antiplatelet therapy increasing bleeding risk",
      "Malignancy with bone marrow infiltration or DIC"
    ],
    diagnostics: [
      "Bone marrow biopsy for unexplained cytopenias or suspected malignancy",
      "Direct antiglobulin test (Coombs) for autoimmune hemolytic anemia",
      "Flow cytometry for leukemia/lymphoma immunophenotyping",
      "Peripheral smear morphology (schistocytes, spherocytes, target cells)",
      "Haptoglobin (decreased in hemolysis), LDH (elevated in hemolysis)",
      "PT/INR and aPTT for coagulation pathway assessment",
      "D-dimer for DIC screening or fibrinolysis assessment"
    ],
    management: [
      "FFP or PCC for urgent warfarin reversal with active bleeding",
      "Steroids (prednisone 1mg/kg) for autoimmune cytopenias (ITP, AIHA)",
      "Hematology referral for unexplained cytopenias or suspected malignancy",
      "Platelet transfusion for count <10K (prophylactic) or <50K with active bleeding",
      "IVIG for severe ITP with active bleeding or preprocedural",
      "Transfusion threshold: Hgb <7 g/dL (restrictive) or <8 with active cardiac disease",
      "Type and screen before anticipated transfusion; crossmatch for surgical procedures"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      },
      {
        name: "Warfarin (Coumadin)",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K epoxide reductase blocking synthesis of factors II, VII, IX, X and proteins C & S",
        sideEffects: "Bleeding, skin necrosis (protein C deficiency), teratogenicity, drug/food interactions",
        contra: "Pregnancy (first trimester), active bleeding, severe hepatic disease, non-adherent patients",
        pearl: "Bridge with heparin for 5 days (protein C depleted before clotting factors). INR goal 2-3 for most indications; 2.5-3.5 for mechanical mitral valve."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Iron Deficiency Anemia management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with iron deficiency anemia presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of iron deficiency anemia."
      }
    ]
  },
  "sickle-cell-crisis-np": {
    title: "Sickle Cell Crisis: Disease-Modifying",
    cellular: {
      title: "Pathophysiology of Sickle Cell Crisis",
      content: "Sickle cell disease results from HbS (glutamic acid to valine at position 6 of beta-globin). Deoxygenated HbS polymerizes causing RBC sickling, hemolytic anemia, and vaso-occlusion. Complications: acute chest syndrome, stroke, splenic sequestration, avascular necrosis. Hydroxyurea increases HbF reducing sickling. Voxelotor inhibits HbS polymerization. L-glutamine reduces oxidative stress."
    },
    riskFactors: [
      "Autoimmune conditions (ITP, AIHA, TTP-HUS)",
      "Malignancy with bone marrow infiltration or DIC",
      "Liver disease with coagulopathy and thrombocytopenia",
      "Anticoagulant or antiplatelet therapy increasing bleeding risk",
      "Family history of hereditary hematologic conditions (sickle cell, thalassemia)",
      "Chronic disease states causing anemia of inflammation",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)"
    ],
    diagnostics: [
      "Direct antiglobulin test (Coombs) for autoimmune hemolytic anemia",
      "D-dimer for DIC screening or fibrinolysis assessment",
      "Haptoglobin (decreased in hemolysis), LDH (elevated in hemolysis)",
      "PT/INR and aPTT for coagulation pathway assessment",
      "Fibrinogen level for DIC or consumption coagulopathy",
      "Reticulocyte count (production index) for bone marrow response",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation"
    ],
    management: [
      "Steroids (prednisone 1mg/kg) for autoimmune cytopenias (ITP, AIHA)",
      "Type and screen before anticipated transfusion; crossmatch for surgical procedures",
      "IVIG for severe ITP with active bleeding or preprocedural",
      "Transfusion threshold: Hgb <7 g/dL (restrictive) or <8 with active cardiac disease",
      "Anticoagulation management: warfarin (INR 2-3), DOACs, or heparin bridging",
      "IV iron (ferric carboxymaltose or iron sucrose) for oral intolerance or malabsorption",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      },
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Sickle Cell Crisis management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with sickle cell crisis presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of sickle cell crisis."
      }
    ]
  },
  "uterine-rupture-np": {
    title: "Uterine Rupture: Risk Factors",
    cellular: {
      title: "Pathophysiology of Uterine Rupture",
      content: "Uterine Rupture: Risk Factors involves reproductive, obstetric, or gynecologic pathophysiology specific to uterine rupture."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for uterine rupture",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Uterine Rupture management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with uterine rupture. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for uterine rupture."
      }
    ]
  },
  "cervical-insufficiency-np": {
    title: "Cervical Insufficiency: Cerclage",
    cellular: {
      title: "Pathophysiology of Cervical Insufficiency",
      content: "Cervical Insufficiency: Cerclage involves reproductive, obstetric, or gynecologic pathophysiology specific to cervical insufficiency."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for cervical insufficiency",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Cervical Insufficiency management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with cervical insufficiency. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for cervical insufficiency."
      }
    ]
  },
  "chorioamnionitis-np": {
    title: "Chorioamnionitis: Intra-Amniotic Infection",
    cellular: {
      title: "Pathophysiology of Chorioamnionitis",
      content: "Chorioamnionitis (intraamniotic infection) is ascending polymicrobial infection of amniotic fluid and membranes. Most common organisms: GBS, E. coli, anaerobes. Risk factors: prolonged ROM (>18h), multiple vaginal exams, GBS colonization. Diagnosis: maternal fever >=39C or 38-38.9C with one of: fetal tachycardia, purulent amniotic fluid, maternal leukocytosis. Treatment: ampicillin 2g IV q6h + gentamicin 5mg/kg IV daily. Delivery should not be delayed for antibiotics."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for chorioamnionitis",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Chorioamnionitis management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with chorioamnionitis. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for chorioamnionitis."
      }
    ]
  },
  "vbac-management-np": {
    title: "VBAC Management: Risk Stratification",
    cellular: {
      title: "Pathophysiology of VBAC Management",
      content: "VBAC Management: Risk Stratification involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. VBAC Management pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for vbac management",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for vbac management",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for vbac management",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of vbac management",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to vbac management",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of vbac management",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for vbac management. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "VBAC Management requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of vbac management"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with vbac management. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for vbac management."
      }
    ]
  },
  "twin-to-twin-transfusion-np": {
    title: "Twin-to-Twin Transfusion Syndrome: Staging",
    cellular: {
      title: "Pathophysiology of Twin-to-Twin Transfusion Syndrome",
      content: "Twin-to-Twin Transfusion Syndrome: Staging involves alterations in hematopoiesis, hemoglobin function, coagulation, or fibrinolysis relevant to twin-to-twin transfusion syndrome."
    },
    riskFactors: [
      "Liver disease with coagulopathy and thrombocytopenia",
      "Family history of hereditary hematologic conditions (sickle cell, thalassemia)",
      "Splenomegaly with hypersplenism",
      "Malignancy with bone marrow infiltration or DIC",
      "Chemotherapy-induced myelosuppression",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Chronic kidney disease with decreased erythropoietin"
    ],
    diagnostics: [
      "Haptoglobin (decreased in hemolysis), LDH (elevated in hemolysis)",
      "Fibrinogen level for DIC or consumption coagulopathy",
      "Hemoglobin electrophoresis for hemoglobinopathy screening",
      "D-dimer for DIC screening or fibrinolysis assessment",
      "Peripheral smear morphology (schistocytes, spherocytes, target cells)",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "B12 and folate levels (methylmalonic acid if B12 borderline)"
    ],
    management: [
      "IVIG for severe ITP with active bleeding or preprocedural",
      "Anticoagulation management: warfarin (INR 2-3), DOACs, or heparin bridging",
      "Hydroxyurea for sickle cell disease (reduces HbS polymerization)",
      "Type and screen before anticipated transfusion; crossmatch for surgical procedures",
      "Platelet transfusion for count <10K (prophylactic) or <50K with active bleeding",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Folate supplementation: 1mg PO daily"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      },
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Twin-to-Twin Transfusion Syndrome management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with twin-to-twin transfusion syndrome presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of twin-to-twin transfusion syndrome."
      }
    ]
  },
  "cord-prolapse-management-np": {
    title: "Cord Prolapse Management: Emergency Delivery",
    cellular: {
      title: "Pathophysiology of Cord Prolapse Management",
      content: "Cord Prolapse Management: Emergency Delivery involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Cord Prolapse Management pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "Alcohol use disorder with chronic mucosal injury",
      "Immunosuppression increasing infectious GI complications",
      "Chronic liver disease with portal hypertension",
      "Chronic PPI use >8 weeks without reassessment",
      "Pancreatic insufficiency with malabsorption",
      "High-fat diet with cholelithiasis predisposition",
      "Chronic constipation with diverticular disease risk"
    ],
    diagnostics: [
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin",
      "Capsule endoscopy for obscure small bowel bleeding",
      "Abdominal X-ray: obstruction, free air, calcifications",
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology",
      "Lipase (preferred over amylase for pancreatic evaluation)",
      "RUQ ultrasound for gallbladder and hepatic assessment",
      "H. pylori testing: urea breath test, stool antigen, or biopsy"
    ],
    management: [
      "Bowel rest with IV fluids for acute pancreatitis",
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP",
      "Surgical consultation for acute abdomen with peritoneal signs",
      "Mesalamine (5-ASA) for mild-moderate ulcerative colitis",
      "Lactulose 15-30mL BID-TID for hepatic encephalopathy",
      "Octreotide 50mcg IV bolus then 50mcg/hr for variceal bleeding",
      "Ursodiol 13-15mg/kg/day for primary biliary cholangitis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to cord prolapse management)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia Reducer",
        action: "Colonic bacteria metabolize to organic acids trapping ammonia as NH4+ for fecal excretion",
        sideEffects: "Bloating, flatulence, diarrhea, electrolyte imbalance",
        contra: "Galactosemia",
        pearl: "Titrate to 2-3 soft stools/day. Add rifaximin 550mg BID for lactulose non-responders in hepatic encephalopathy."
      },
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+-ATPase on parietal cell, reducing gastric acid secretion by >95%",
        sideEffects: "C. diff risk, hypomagnesemia, B12 deficiency, bone fractures with chronic use",
        contra: "Known PPI hypersensitivity, concurrent rilpivirine",
        pearl: "Take 30-60 min before meals. Reassess need at 8 weeks. Long-term risks: hip fracture, C. diff, kidney disease."
      }
    ],
    pearls: [
      "Cord Prolapse Management evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of cord prolapse management"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with cord prolapse management. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for cord prolapse management."
      }
    ]
  },
  "dic-obstetrics-np": {
    title: "DIC in Obstetrics: Etiology",
    cellular: {
      title: "Pathophysiology of DIC in Obstetrics",
      content: "DIC involves systemic activation of coagulation with simultaneous consumption of clotting factors and platelets causing both microvascular thrombosis and hemorrhage. Triggers: sepsis, trauma, malignancy, obstetric complications. Labs: prolonged PT/aPTT, low fibrinogen (<100), elevated D-dimer, thrombocytopenia, schistocytes on smear. Treatment: treat underlying cause, replace with FFP/cryo/platelets if bleeding, heparin only if thrombosis predominates."
    },
    riskFactors: [
      "Autoimmune conditions (ITP, AIHA, TTP-HUS)",
      "Malignancy with bone marrow infiltration or DIC",
      "Liver disease with coagulopathy and thrombocytopenia",
      "Anticoagulant or antiplatelet therapy increasing bleeding risk",
      "Family history of hereditary hematologic conditions (sickle cell, thalassemia)",
      "Chronic disease states causing anemia of inflammation",
      "B12 or folate deficiency (vegans, malabsorption, metformin use)"
    ],
    diagnostics: [
      "Direct antiglobulin test (Coombs) for autoimmune hemolytic anemia",
      "D-dimer for DIC screening or fibrinolysis assessment",
      "Haptoglobin (decreased in hemolysis), LDH (elevated in hemolysis)",
      "PT/INR and aPTT for coagulation pathway assessment",
      "Fibrinogen level for DIC or consumption coagulopathy",
      "Reticulocyte count (production index) for bone marrow response",
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation"
    ],
    management: [
      "Steroids (prednisone 1mg/kg) for autoimmune cytopenias (ITP, AIHA)",
      "Type and screen before anticipated transfusion; crossmatch for surgical procedures",
      "IVIG for severe ITP with active bleeding or preprocedural",
      "Transfusion threshold: Hgb <7 g/dL (restrictive) or <8 with active cardiac disease",
      "Anticoagulation management: warfarin (INR 2-3), DOACs, or heparin bridging",
      "IV iron (ferric carboxymaltose or iron sucrose) for oral intolerance or malabsorption",
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Hydroxyurea (Hydrea)",
        type: "Antimetabolite / Ribonucleotide Reductase Inhibitor",
        action: "Inhibits ribonucleotide reductase; increases fetal hemoglobin (HbF) reducing HbS polymerization in sickle cell",
        sideEffects: "Myelosuppression, GI upset, skin hyperpigmentation, leg ulcers",
        contra: "Severe myelosuppression, pregnancy",
        pearl: "Sickle cell: start 15mg/kg daily, titrate to max tolerated dose. Monitor CBC q4 weeks during titration. Only disease-modifying therapy widely available."
      },
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "DIC in Obstetrics management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with dic in obstetrics presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of dic in obstetrics."
      }
    ]
  },
  "vaginal-hematoma-np": {
    title: "Vaginal Hematoma: Surgical Management",
    cellular: {
      title: "Pathophysiology of Vaginal Hematoma",
      content: "Vaginal Hematoma: Surgical Management involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Vaginal Hematoma pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for vaginal hematoma",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for vaginal hematoma",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for vaginal hematoma",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of vaginal hematoma",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to vaginal hematoma",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of vaginal hematoma",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for vaginal hematoma. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Vaginal Hematoma requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of vaginal hematoma"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with vaginal hematoma. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for vaginal hematoma."
      }
    ]
  },
  "placenta-previa-management-np": {
    title: "Placenta Previa",
    cellular: {
      title: "Pathophysiology of Placenta Previa",
      content: "Placenta Previa involves reproductive, obstetric, or gynecologic pathophysiology specific to placenta previa."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for placenta previa",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Placenta Previa management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with placenta previa. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for placenta previa."
      }
    ]
  },
  "umbilical-cord-prolapse-np": {
    title: "Umbilical Cord Prolapse",
    cellular: {
      title: "Pathophysiology of Umbilical Cord Prolapse",
      content: "Umbilical Cord Prolapse involves reproductive, obstetric, or gynecologic pathophysiology specific to umbilical cord prolapse."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for umbilical cord prolapse",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Umbilical Cord Prolapse management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with umbilical cord prolapse. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for umbilical cord prolapse."
      }
    ]
  },
  "hyperemesis-gravidarum-np": {
    title: "Hyperemesis Gravidarum",
    cellular: {
      title: "Pathophysiology of Hyperemesis Gravidarum",
      content: "Hyperemesis gravidarum is severe pregnancy nausea/vomiting causing >5% weight loss, dehydration, ketonuria, and electrolyte imbalances. Distinguished from normal morning sickness by severity and metabolic derangements. Associated with high hCG levels (molar pregnancy must be excluded). Treatment ladder: dietary modification, ginger, doxylamine-pyridoxine (Diclegis), ondansetron, methylprednisolone for refractory cases. Monitor for Wernicke encephalopathy (thiamine deficiency)."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for hyperemesis gravidarum",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Hyperemesis Gravidarum management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with hyperemesis gravidarum. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for hyperemesis gravidarum."
      }
    ]
  },
  "rh-alloimmunization-np": {
    title: "Rh Alloimmunization",
    cellular: {
      title: "Pathophysiology of Rh Alloimmunization",
      content: "Rh alloimmunization occurs when Rh-negative mother develops anti-D antibodies after exposure to Rh-positive fetal blood. Subsequent Rh-positive pregnancies at risk for hemolytic disease of the fetus/newborn (HDFN). Prevention: RhoGAM (anti-D immunoglobulin) 300mcg IM at 28 weeks and within 72h of delivery, miscarriage, amniocentesis, or trauma. Monitor with indirect Coombs test; if positive, serial MCA Doppler to assess fetal anemia."
    },
    riskFactors: [
      "Nulliparity or advanced maternal age",
      "Prior pregnancy complications (preeclampsia, GDM, preterm birth)",
      "Obesity (BMI >30)",
      "Chronic hypertension or renal disease",
      "Autoimmune conditions (SLE, antiphospholipid syndrome)",
      "Family history of reproductive conditions",
      "Substance use during pregnancy"
    ],
    diagnostics: [
      "Focused obstetric or gynecologic history",
      "Physical exam including pelvic examination",
      "Quantitative beta-hCG and progesterone levels",
      "Transvaginal ultrasound for dating and structural assessment",
      "CBC, type and screen, rubella immunity, STI screening",
      "Urinalysis and urine culture",
      "Condition-specific labs (protein:creatinine ratio, glucose tolerance, thyroid)"
    ],
    management: [
      "Evidence-based management per ACOG guidelines for rh alloimmunization",
      "Fetal monitoring as indicated (NST, BPP, growth ultrasound)",
      "Blood pressure management with labetalol or nifedipine if indicated",
      "Antenatal corticosteroids for fetal lung maturity if preterm delivery anticipated",
      "Delivery planning based on maternal-fetal risk assessment",
      "Postpartum monitoring and follow-up",
      "Contraceptive counseling and family planning"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vaginal bleeding (amount, timing, associations)",
        "Abdominal/pelvic pain (location, quality, severity)",
        "Hypertension (>=140/90 in pregnancy)",
        "Abnormal vaginal discharge"
      ],
      right: [
        "Edema (generalized vs lower extremity)",
        "Fetal heart rate abnormalities",
        "Uterine tenderness or contractions",
        "Visual changes, headache, RUQ pain (preeclampsia severe features)"
      ]
    },
    medications: [
      {
        name: "Magnesium Sulfate",
        type: "Anticonvulsant / Tocolytic",
        action: "Blocks NMDA receptors and reduces acetylcholine release at NMJ; vasodilation via calcium antagonism",
        sideEffects: "Flushing, hypotension, respiratory depression, loss of DTRs (toxicity sign)",
        contra: "Myasthenia gravis, severe renal impairment without dose adjustment",
        pearl: "Preeclampsia seizure prophylaxis: 4-6g IV loading then 1-2g/hr. Therapeutic range 4-7 mEq/L. Monitor DTRs, RR, UOP hourly. Antidote: calcium gluconate 1g IV."
      },
      {
        name: "Labetalol",
        type: "Combined Alpha/Beta Blocker",
        action: "Blocks alpha-1 (vasodilation) and beta-1/2 (reduces HR, contractility) adrenergic receptors",
        sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm",
        contra: "Asthma, severe bradycardia, heart block, decompensated HF",
        pearl: "First-line for acute severe HTN in pregnancy. IV: 20mg, then 40mg, then 80mg q10min (max 300mg). PO: 200-2400mg/day divided BID-TID."
      }
    ],
    pearls: [
      "Preeclampsia: magnesium sulfate for seizure prevention; antihypertensives for severe-range BP (>=160/110)",
      "ACOG recommends low-dose aspirin 81mg starting 12-28 weeks for preeclampsia prevention in high-risk women",
      "Rh Alloimmunization management requires close maternal-fetal monitoring with timely intervention"
    ],
    quiz: [
      {
        question: "A 32-week pregnant patient develops findings consistent with rh alloimmunization. Best initial management?",
        options: [
          "Immediate cesarean delivery without assessment",
          "Maternal-fetal assessment, labs, and management per ACOG guidelines",
          "Discharge with outpatient follow-up in 1 week",
          "Expectant management without monitoring"
        ],
        correct: 1,
        rationale: "Systematic maternal-fetal assessment with appropriate labs and management per ACOG guidelines ensures optimal outcomes for rh alloimmunization."
      }
    ]
  },
  "trisomy-21-management-np": {
    title: "Trisomy 21 (Down Syndrome)",
    cellular: {
      title: "Pathophysiology of Trisomy 21 (Down Syndrome)",
      content: "Trisomy 21 (Down Syndrome) involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Trisomy 21 (Down Syndrome) pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for trisomy 21 (down syndrome)",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for trisomy 21 (down syndrome)",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for trisomy 21 (down syndrome)",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of trisomy 21 (down syndrome)",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to trisomy 21 (down syndrome)",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of trisomy 21 (down syndrome)",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for trisomy 21 (down syndrome). Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Trisomy 21 (Down Syndrome) requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of trisomy 21 (down syndrome)"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with trisomy 21 (down syndrome). What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for trisomy 21 (down syndrome)."
      }
    ]
  },
  "hypospadias-management-np": {
    title: "Hypospadias",
    cellular: {
      title: "Pathophysiology of Hypospadias",
      content: "Hypospadias involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Hypospadias pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for hypospadias",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for hypospadias",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for hypospadias",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of hypospadias",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to hypospadias",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of hypospadias",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for hypospadias. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Hypospadias requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of hypospadias"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with hypospadias. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for hypospadias."
      }
    ]
  },
  "duchenne-md-management-np": {
    title: "Duchenne Muscular Dystrophy",
    cellular: {
      title: "Pathophysiology of Duchenne Muscular Dystrophy",
      content: "Duchenne Muscular Dystrophy involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. Duchenne Muscular Dystrophy pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for duchenne muscular dystrophy",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for duchenne muscular dystrophy",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for duchenne muscular dystrophy",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of duchenne muscular dystrophy",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to duchenne muscular dystrophy",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of duchenne muscular dystrophy",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for duchenne muscular dystrophy. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Duchenne Muscular Dystrophy requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of duchenne muscular dystrophy"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with duchenne muscular dystrophy. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for duchenne muscular dystrophy."
      }
    ]
  },
  "vp-shunt-management-np": {
    title: "VP Shunt Management",
    cellular: {
      title: "Pathophysiology of VP Shunt Management",
      content: "VP Shunt Management involves specific pathophysiological mechanisms requiring systematic evaluation by the nurse practitioner. VP Shunt Management pathophysiology includes disruption of normal cellular function, tissue homeostasis, and organ-specific processes that drive the clinical presentation and guide evidence-based management decisions."
    },
    riskFactors: [
      "Condition-specific predisposing factors for vp shunt management",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for vp shunt management",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for vp shunt management",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of vp shunt management",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to vp shunt management",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of vp shunt management",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for vp shunt management. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "VP Shunt Management requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of vp shunt management"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with vp shunt management. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for vp shunt management."
      }
    ]
  },
  "tonsillectomy-care-np": {
    title: "Tonsillectomy Care",
    cellular: {
      title: "Pathophysiology of Tonsillectomy Care",
      content: "Tonsillectomy Care involves pathology of the ear, nose, throat, or vestibular system requiring systematic evaluation of anatomic and functional components."
    },
    riskFactors: [
      "Age-related hearing/vestibular degeneration",
      "Chronic or occupational noise exposure",
      "URI preceding vestibular symptoms",
      "Head trauma affecting temporal bone",
      "Ototoxic medications (aminoglycosides, loop diuretics, cisplatin)",
      "Allergic rhinitis and chronic sinusitis",
      "Autoimmune inner ear conditions"
    ],
    diagnostics: [
      "Dix-Hallpike test for posterior canal BPPV",
      "Pure tone audiometry for hearing threshold assessment",
      "Tympanometry for middle ear compliance evaluation",
      "Weber and Rinne tuning fork tests (conductive vs sensorineural)",
      "CT temporal bones if structural pathology suspected",
      "MRI internal auditory canals if retrocochlear pathology suspected",
      "Caloric testing and videonystagmography (VNG) for vestibular evaluation"
    ],
    management: [
      "Canalith repositioning (Epley maneuver) for BPPV",
      "Vestibular rehabilitation exercises (Brandt-Daroff)",
      "Meclizine 25mg q6-8h PRN for acute vertigo (short-term only)",
      "Antibiotics for bacterial sinusitis/otitis (amoxicillin first-line)",
      "Surgical referral for structural ENT conditions",
      "Hearing aid evaluation for sensorineural hearing loss",
      "Antivirals + corticosteroids for Ramsay-Hunt syndrome"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Vertigo (distinguish from lightheadedness and disequilibrium)",
        "Hearing loss (conductive vs sensorineural)",
        "Tinnitus (pulsatile vs continuous)",
        "Aural fullness or pressure"
      ],
      right: [
        "Nystagmus patterns (direction, fatigability)",
        "Positive Dix-Hallpike or head impulse test",
        "Otoscopic findings (TM perforation, effusion, cholesteatoma)",
        "Facial nerve weakness (House-Brackmann grading)"
      ]
    },
    medications: [
      {
        name: "Meclizine (Antivert)",
        type: "Vestibular Suppressant",
        action: "Blocks H1 and muscarinic receptors in vestibular nuclei suppressing vestibular input",
        sideEffects: "Drowsiness, dry mouth, urinary retention",
        contra: "Angle-closure glaucoma, urinary retention",
        pearl: "Short-term only for acute vertigo. Not effective for BPPV (Epley is treatment). Beers Criteria: avoid in elderly."
      },
      {
        name: "Amoxicillin",
        type: "Aminopenicillin",
        action: "Inhibits bacterial cell wall synthesis via PBP binding",
        sideEffects: "Diarrhea, nausea, rash (especially with EBV)",
        contra: "Penicillin allergy, concurrent EBV infection (rash risk)",
        pearl: "First-line for acute bacterial sinusitis (500mg TID x5-7d) and AOM. Wait 7-10 days before antibiotics for uncomplicated sinusitis."
      }
    ],
    pearls: [
      "BPPV: diagnosed clinically with Dix-Hallpike, treated with Epley maneuver - no imaging needed",
      "HINTS exam (Head Impulse, Nystagmus, Test of Skew) differentiates peripheral from central vertigo with >95% sensitivity",
      "Most acute sinusitis is viral - antibiotics only after 10 days without improvement"
    ],
    quiz: [
      {
        question: "A patient with episodic vertigo presents for evaluation. Best initial diagnostic approach?",
        options: [
          "Immediate CT head without examination",
          "Bedside vestibular exam including Dix-Hallpike and HINTS assessment",
          "Empiric antibiotics",
          "MRI brain without clinical exam"
        ],
        correct: 1,
        rationale: "Bedside vestibular examination differentiates peripheral from central causes of vertigo with high sensitivity and guides management."
      }
    ]
  },
  "newborn-diabetic-mother-np": {
    title: "Newborn of Diabetic Mother",
    cellular: {
      title: "Pathophysiology of Newborn of Diabetic Mother",
      content: "T2DM features insulin resistance and progressive beta-cell dysfunction. Insulin resistance from TNF-alpha, IL-6, free fatty acids impairs IRS phosphorylation. Beta-cell compensation fails through glucotoxicity and lipotoxicity. First-line: metformin + lifestyle. Second-line based on comorbidities: SGLT2i or GLP-1RA for ASCVD, HF, CKD."
    },
    riskFactors: [
      "Pregnancy altering hormonal milieu (gestational DM, thyroiditis)",
      "Age-related hormonal decline (menopause, andropause)",
      "Chronic corticosteroid use with HPA axis suppression",
      "Chronic kidney disease affecting calcium-phosphorus-PTH axis",
      "MEN syndrome family history",
      "Eating disorders with hypothalamic amenorrhea",
      "Medication-induced endocrinopathy (lithium-thyroid, statin-DM)"
    ],
    diagnostics: [
      "IGF-1 for growth hormone excess or deficiency screening",
      "Fasting glucose and 2-hour OGTT for diabetes diagnosis",
      "Morning cortisol (8 AM) and ACTH for adrenal function",
      "Thyroid ultrasound for nodule characterization (TI-RADS scoring)",
      "24-hour urine free cortisol for Cushing confirmation",
      "Plasma metanephrines for pheochromocytoma screening",
      "PTH with calcium and phosphorus for parathyroid evaluation"
    ],
    management: [
      "Calcium + vitamin D supplementation for hypoparathyroidism",
      "Insulin therapy: basal (glargine) + bolus (lispro) for type 1 DM",
      "SGLT2 inhibitor or GLP-1 RA for T2DM with CV disease or CKD",
      "Continuous glucose monitoring for insulin-dependent diabetes",
      "Bisphosphonate therapy for osteoporosis with DEXA monitoring",
      "Medical nutrition therapy with carbohydrate counting",
      "Thyroidectomy for large goiter, suspicious nodules, or refractory Graves"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Weight changes (gain or loss) related to metabolic dysfunction",
        "Fatigue, heat or cold intolerance",
        "Polyuria, polydipsia, polyphagia (diabetic triad)",
        "Menstrual irregularity or sexual dysfunction"
      ],
      right: [
        "Goiter, thyroid nodules on palpation",
        "Exophthalmos, lid lag (Graves disease)",
        "Skin changes (acanthosis nigricans, striae, hyperpigmentation)",
        "Vital sign abnormalities (tachycardia, hypertension, orthostasis)"
      ]
    },
    medications: [
      {
        name: "Semaglutide (Ozempic/Wegovy)",
        type: "GLP-1 Receptor Agonist",
        action: "Mimics incretin GLP-1: stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, promotes satiety",
        sideEffects: "Nausea (dose-dependent), vomiting, diarrhea, pancreatitis risk, injection site reactions",
        contra: "Personal/family history of medullary thyroid carcinoma, MEN2 syndrome",
        pearl: "Start 0.25mg SC weekly x4 weeks, titrate monthly. SUSTAIN-6: 26% MACE reduction. Wegovy approved for weight management."
      },
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Decreases hepatic glucose production, increases insulin sensitivity, reduces intestinal glucose absorption",
        sideEffects: "GI upset (diarrhea, nausea), B12 deficiency, lactic acidosis (rare)",
        contra: "eGFR <30 (contraindicated), eGFR 30-45 (do not initiate), acute/chronic metabolic acidosis",
        pearl: "Start 500mg with dinner, increase by 500mg weekly. Extended-release reduces GI side effects. Hold for iodinated contrast if eGFR <45."
      }
    ],
    pearls: [
      "Always assess upstream regulators first (TSH before T4, ACTH before cortisol) for endocrine evaluation",
      "Replace cortisol BEFORE thyroid hormone in suspected combined adrenal/thyroid insufficiency",
      "Newborn of Diabetic Mother management requires individualized targets with regular monitoring and dose titration"
    ],
    quiz: [
      {
        question: "A patient is evaluated for suspected newborn of diabetic mother. Which initial diagnostic approach is most appropriate?",
        options: [
          "Random glucose only",
          "Comprehensive endocrine panel without clinical focus",
          "Targeted screening test based on clinical suspicion for newborn of diabetic mother",
          "No testing - begin empiric treatment"
        ],
        correct: 2,
        rationale: "Appropriate targeted screening test based on clinical suspicion provides essential diagnostic information for newborn of diabetic mother while being cost-effective."
      }
    ]
  },
  "autoimmune-np": {
    title: "Autoimmune Pathophysiology: Molecular",
    cellular: {
      title: "Pathophysiology of Autoimmune Pathophysiology",
      content: "Autoimmune Pathophysiology: Molecular involves dysregulation of innate or adaptive immune responses leading to tissue injury or immunodeficiency in autoimmune pathophysiology."
    },
    riskFactors: [
      "Occupational chemical/biological exposure",
      "Organ transplant with rejection risk",
      "Stress and sleep deprivation impairing immune function",
      "Genetic variants in HLA, complement, or immune pathways",
      "Age-related immune senescence (immunosenescence)",
      "Nutritional deficiencies (zinc, vitamin D) affecting immunity",
      "Prior allergic reactions or anaphylaxis history"
    ],
    diagnostics: [
      "Vaccine response titers to assess humoral immune function",
      "ANA panel with specific autoantibodies",
      "Genetic testing for primary immunodeficiency disorders",
      "Lymphocyte proliferation assays for cellular immunity",
      "Tissue biopsy for immune complex deposition or granulomatous inflammation",
      "HIV testing (4th gen Ag/Ab combo, confirmatory Western blot)",
      "Quantitative immunoglobulins (IgG, IgA, IgM, IgE)"
    ],
    management: [
      "Evidence-based immunomodulatory therapy specific to autoimmune pathophysiology",
      "Allergen avoidance and environmental modification",
      "Immunosuppressive agents when indicated (corticosteroids, calcineurin inhibitors)",
      "Biologic agents targeting specific immune pathways",
      "Vaccination update per immunocompromised guidelines",
      "Infection surveillance and prophylaxis",
      "Allergy/immunology consultation for complex immune dysregulation"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urticaria, angioedema, anaphylaxis symptoms",
        "Recurrent or opportunistic infections",
        "Fever of unknown origin",
        "Fatigue and constitutional symptoms"
      ],
      right: [
        "Lymphadenopathy or organomegaly",
        "Skin findings (rash, vasculitis, photosensitivity)",
        "Laboratory evidence of immune dysfunction",
        "Multi-organ involvement suggesting systemic process"
      ]
    },
    medications: [
      {
        name: "Epinephrine (EpiPen)",
        type: "Alpha/Beta Agonist",
        action: "Alpha-1: vasoconstriction reverses hypotension; Beta-1: positive inotropy/chronotropy; Beta-2: bronchodilation and mast cell stabilization",
        sideEffects: "Tachycardia, anxiety, tremor, hypertension",
        contra: "No absolute contraindications in anaphylaxis",
        pearl: "IM anterolateral thigh: 0.3-0.5mg adults, 0.01mg/kg peds. Auto-injector: carry 2. Can repeat q5-15min. First-line for anaphylaxis - NEVER delay."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces T-cell activation, decreases cytokine production",
        sideEffects: "Hyperglycemia, weight gain, osteoporosis, immunosuppression, adrenal suppression",
        contra: "Active untreated infection; caution with diabetes, osteoporosis, peptic ulcer",
        pearl: "Anaphylaxis: 50mg PO to prevent biphasic reaction. Autoimmune: 1mg/kg then taper. Taper if >2 weeks use to prevent adrenal crisis."
      }
    ],
    pearls: [
      "Anaphylaxis: epinephrine IM is FIRST-LINE - antihistamines and steroids are adjunctive only",
      "Distinguish IgE-mediated (Type I) from other hypersensitivity mechanisms for proper management",
      "Autoimmune Pathophysiology requires systematic immune workup including immunoglobulins, complement, and lymphocyte subsets"
    ],
    quiz: [
      {
        question: "A patient develops acute symptoms consistent with autoimmune pathophysiology with hypotension and respiratory distress. Priority intervention?",
        options: [
          "IV diphenhydramine 50mg",
          "IM epinephrine 0.3mg into anterolateral thigh",
          "Oral prednisone 50mg",
          "Nebulized albuterol only"
        ],
        correct: 1,
        rationale: "IM epinephrine is the first-line treatment for severe allergic/immune reactions with hemodynamic instability or respiratory compromise."
      }
    ]
  },
  "immunodeficiency-np": {
    title: "Immunodeficiency Syndromes",
    cellular: {
      title: "Pathophysiology of Immunodeficiency Syndromes",
      content: "Immunodeficiency Syndromes involves dysregulation of innate or adaptive immune responses leading to tissue injury or immunodeficiency in immunodeficiency syndromes."
    },
    riskFactors: [
      "Immunosuppressive therapy increasing infection susceptibility",
      "Medication exposure triggering immune-mediated reactions",
      "Environmental allergen sensitization",
      "Organ transplant with rejection risk",
      "Genetic variants in HLA, complement, or immune pathways",
      "Occupational chemical/biological exposure",
      "Nutritional deficiencies (zinc, vitamin D) affecting immunity"
    ],
    diagnostics: [
      "Specific IgE testing or skin prick testing for allergen identification",
      "Complement levels (C3, C4, CH50, AH50)",
      "Tryptase level (elevated in mast cell activation, anaphylaxis)",
      "ANA panel with specific autoantibodies",
      "Lymphocyte proliferation assays for cellular immunity",
      "Vaccine response titers to assess humoral immune function",
      "HIV testing (4th gen Ag/Ab combo, confirmatory Western blot)"
    ],
    management: [
      "Evidence-based immunomodulatory therapy specific to immunodeficiency syndromes",
      "Allergen avoidance and environmental modification",
      "Immunosuppressive agents when indicated (corticosteroids, calcineurin inhibitors)",
      "Biologic agents targeting specific immune pathways",
      "Vaccination update per immunocompromised guidelines",
      "Infection surveillance and prophylaxis",
      "Allergy/immunology consultation for complex immune dysregulation"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urticaria, angioedema, anaphylaxis symptoms",
        "Recurrent or opportunistic infections",
        "Fever of unknown origin",
        "Fatigue and constitutional symptoms"
      ],
      right: [
        "Lymphadenopathy or organomegaly",
        "Skin findings (rash, vasculitis, photosensitivity)",
        "Laboratory evidence of immune dysfunction",
        "Multi-organ involvement suggesting systemic process"
      ]
    },
    medications: [
      {
        name: "Epinephrine (EpiPen)",
        type: "Alpha/Beta Agonist",
        action: "Alpha-1: vasoconstriction reverses hypotension; Beta-1: positive inotropy/chronotropy; Beta-2: bronchodilation and mast cell stabilization",
        sideEffects: "Tachycardia, anxiety, tremor, hypertension",
        contra: "No absolute contraindications in anaphylaxis",
        pearl: "IM anterolateral thigh: 0.3-0.5mg adults, 0.01mg/kg peds. Auto-injector: carry 2. Can repeat q5-15min. First-line for anaphylaxis - NEVER delay."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces T-cell activation, decreases cytokine production",
        sideEffects: "Hyperglycemia, weight gain, osteoporosis, immunosuppression, adrenal suppression",
        contra: "Active untreated infection; caution with diabetes, osteoporosis, peptic ulcer",
        pearl: "Anaphylaxis: 50mg PO to prevent biphasic reaction. Autoimmune: 1mg/kg then taper. Taper if >2 weeks use to prevent adrenal crisis."
      }
    ],
    pearls: [
      "Anaphylaxis: epinephrine IM is FIRST-LINE - antihistamines and steroids are adjunctive only",
      "Distinguish IgE-mediated (Type I) from other hypersensitivity mechanisms for proper management",
      "Immunodeficiency Syndromes requires systematic immune workup including immunoglobulins, complement, and lymphocyte subsets"
    ],
    quiz: [
      {
        question: "A patient develops acute symptoms consistent with immunodeficiency syndromes with hypotension and respiratory distress. Priority intervention?",
        options: [
          "IV diphenhydramine 50mg",
          "IM epinephrine 0.3mg into anterolateral thigh",
          "Oral prednisone 50mg",
          "Nebulized albuterol only"
        ],
        correct: 1,
        rationale: "IM epinephrine is the first-line treatment for severe allergic/immune reactions with hemodynamic instability or respiratory compromise."
      }
    ]
  },
  "transplant-rejection-np": {
    title: "Transplant Rejection: T-Cell Mediated",
    cellular: {
      title: "Pathophysiology of Transplant Rejection",
      content: "Transplant Rejection: T-Cell Mediated involves dysregulation of innate or adaptive immune responses leading to tissue injury or immunodeficiency in transplant rejection."
    },
    riskFactors: [
      "Medication exposure triggering immune-mediated reactions",
      "Family history of autoimmune disease or immunodeficiency",
      "Immunosuppressive therapy increasing infection susceptibility",
      "Chronic inflammatory conditions",
      "Environmental allergen sensitization",
      "Organ transplant with rejection risk",
      "Genetic variants in HLA, complement, or immune pathways"
    ],
    diagnostics: [
      "Complement levels (C3, C4, CH50, AH50)",
      "Complete blood count with differential (lymphocyte subsets)",
      "Specific IgE testing or skin prick testing for allergen identification",
      "Flow cytometry for lymphocyte subpopulations (CD4, CD8, CD19, CD56)",
      "Tryptase level (elevated in mast cell activation, anaphylaxis)",
      "ANA panel with specific autoantibodies",
      "Lymphocyte proliferation assays for cellular immunity"
    ],
    management: [
      "Evidence-based immunomodulatory therapy specific to transplant rejection",
      "Allergen avoidance and environmental modification",
      "Immunosuppressive agents when indicated (corticosteroids, calcineurin inhibitors)",
      "Biologic agents targeting specific immune pathways",
      "Vaccination update per immunocompromised guidelines",
      "Infection surveillance and prophylaxis",
      "Allergy/immunology consultation for complex immune dysregulation"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urticaria, angioedema, anaphylaxis symptoms",
        "Recurrent or opportunistic infections",
        "Fever of unknown origin",
        "Fatigue and constitutional symptoms"
      ],
      right: [
        "Lymphadenopathy or organomegaly",
        "Skin findings (rash, vasculitis, photosensitivity)",
        "Laboratory evidence of immune dysfunction",
        "Multi-organ involvement suggesting systemic process"
      ]
    },
    medications: [
      {
        name: "Epinephrine (EpiPen)",
        type: "Alpha/Beta Agonist",
        action: "Alpha-1: vasoconstriction reverses hypotension; Beta-1: positive inotropy/chronotropy; Beta-2: bronchodilation and mast cell stabilization",
        sideEffects: "Tachycardia, anxiety, tremor, hypertension",
        contra: "No absolute contraindications in anaphylaxis",
        pearl: "IM anterolateral thigh: 0.3-0.5mg adults, 0.01mg/kg peds. Auto-injector: carry 2. Can repeat q5-15min. First-line for anaphylaxis - NEVER delay."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces T-cell activation, decreases cytokine production",
        sideEffects: "Hyperglycemia, weight gain, osteoporosis, immunosuppression, adrenal suppression",
        contra: "Active untreated infection; caution with diabetes, osteoporosis, peptic ulcer",
        pearl: "Anaphylaxis: 50mg PO to prevent biphasic reaction. Autoimmune: 1mg/kg then taper. Taper if >2 weeks use to prevent adrenal crisis."
      }
    ],
    pearls: [
      "Anaphylaxis: epinephrine IM is FIRST-LINE - antihistamines and steroids are adjunctive only",
      "Distinguish IgE-mediated (Type I) from other hypersensitivity mechanisms for proper management",
      "Transplant Rejection requires systematic immune workup including immunoglobulins, complement, and lymphocyte subsets"
    ],
    quiz: [
      {
        question: "A patient develops acute symptoms consistent with transplant rejection with hypotension and respiratory distress. Priority intervention?",
        options: [
          "IV diphenhydramine 50mg",
          "IM epinephrine 0.3mg into anterolateral thigh",
          "Oral prednisone 50mg",
          "Nebulized albuterol only"
        ],
        correct: 1,
        rationale: "IM epinephrine is the first-line treatment for severe allergic/immune reactions with hemodynamic instability or respiratory compromise."
      }
    ]
  },
  "cytokine-cascade-np": {
    title: "Cytokine Cascade and SIRS",
    cellular: {
      title: "Pathophysiology of Cytokine Cascade and SIRS",
      content: "Cytokine cascade in SIRS involves excessive release of pro-inflammatory mediators (TNF-alpha, IL-1, IL-6, IL-8) from activated macrophages and neutrophils. SIRS criteria: 2 of 4 (temp >38 or <36, HR >90, RR >20 or PaCO2 <32, WBC >12K or <4K or >10% bands). Progresses to sepsis with infection, severe sepsis with organ dysfunction, and septic shock with refractory hypotension. Anti-inflammatory counterregulation (IL-10, TGF-beta) can cause immunoparalysis."
    },
    riskFactors: [
      "Nutritional deficiencies (zinc, vitamin D) affecting immunity",
      "Genetic variants in HLA, complement, or immune pathways",
      "Family history of autoimmune disease or immunodeficiency",
      "Age-related immune senescence (immunosenescence)",
      "Medication exposure triggering immune-mediated reactions",
      "Prior allergic reactions or anaphylaxis history",
      "Immunosuppressive therapy increasing infection susceptibility"
    ],
    diagnostics: [
      "HIV testing (4th gen Ag/Ab combo, confirmatory Western blot)",
      "Lymphocyte proliferation assays for cellular immunity",
      "Complete blood count with differential (lymphocyte subsets)",
      "Tissue biopsy for immune complex deposition or granulomatous inflammation",
      "Complement levels (C3, C4, CH50, AH50)",
      "Quantitative immunoglobulins (IgG, IgA, IgM, IgE)",
      "Specific IgE testing or skin prick testing for allergen identification"
    ],
    management: [
      "Evidence-based immunomodulatory therapy specific to cytokine cascade and sirs",
      "Allergen avoidance and environmental modification",
      "Immunosuppressive agents when indicated (corticosteroids, calcineurin inhibitors)",
      "Biologic agents targeting specific immune pathways",
      "Vaccination update per immunocompromised guidelines",
      "Infection surveillance and prophylaxis",
      "Allergy/immunology consultation for complex immune dysregulation"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urticaria, angioedema, anaphylaxis symptoms",
        "Recurrent or opportunistic infections",
        "Fever of unknown origin",
        "Fatigue and constitutional symptoms"
      ],
      right: [
        "Lymphadenopathy or organomegaly",
        "Skin findings (rash, vasculitis, photosensitivity)",
        "Laboratory evidence of immune dysfunction",
        "Multi-organ involvement suggesting systemic process"
      ]
    },
    medications: [
      {
        name: "Epinephrine (EpiPen)",
        type: "Alpha/Beta Agonist",
        action: "Alpha-1: vasoconstriction reverses hypotension; Beta-1: positive inotropy/chronotropy; Beta-2: bronchodilation and mast cell stabilization",
        sideEffects: "Tachycardia, anxiety, tremor, hypertension",
        contra: "No absolute contraindications in anaphylaxis",
        pearl: "IM anterolateral thigh: 0.3-0.5mg adults, 0.01mg/kg peds. Auto-injector: carry 2. Can repeat q5-15min. First-line for anaphylaxis - NEVER delay."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces T-cell activation, decreases cytokine production",
        sideEffects: "Hyperglycemia, weight gain, osteoporosis, immunosuppression, adrenal suppression",
        contra: "Active untreated infection; caution with diabetes, osteoporosis, peptic ulcer",
        pearl: "Anaphylaxis: 50mg PO to prevent biphasic reaction. Autoimmune: 1mg/kg then taper. Taper if >2 weeks use to prevent adrenal crisis."
      }
    ],
    pearls: [
      "Anaphylaxis: epinephrine IM is FIRST-LINE - antihistamines and steroids are adjunctive only",
      "Distinguish IgE-mediated (Type I) from other hypersensitivity mechanisms for proper management",
      "Cytokine Cascade and SIRS requires systematic immune workup including immunoglobulins, complement, and lymphocyte subsets"
    ],
    quiz: [
      {
        question: "A patient develops acute symptoms consistent with cytokine cascade and sirs with hypotension and respiratory distress. Priority intervention?",
        options: [
          "IV diphenhydramine 50mg",
          "IM epinephrine 0.3mg into anterolateral thigh",
          "Oral prednisone 50mg",
          "Nebulized albuterol only"
        ],
        correct: 1,
        rationale: "IM epinephrine is the first-line treatment for severe allergic/immune reactions with hemodynamic instability or respiratory compromise."
      }
    ]
  },
  "anaphylaxis-advanced-np": {
    title: "Anaphylaxis Advanced: Biphasic Reactions",
    cellular: {
      title: "Pathophysiology of Anaphylaxis Advanced",
      content: "Anaphylaxis is IgE-mediated Type I hypersensitivity. Allergen cross-links IgE on mast cells and basophils triggering degranulation releasing histamine, tryptase, prostaglandins, leukotrienes. Biphasic reaction in 5-20%. IM epinephrine 0.3-0.5mg anterolateral thigh is first-line. Do NOT delay for IV access."
    },
    riskFactors: [
      "Occupational chemical/biological exposure",
      "Organ transplant with rejection risk",
      "Stress and sleep deprivation impairing immune function",
      "Genetic variants in HLA, complement, or immune pathways",
      "Age-related immune senescence (immunosenescence)",
      "Nutritional deficiencies (zinc, vitamin D) affecting immunity",
      "Prior allergic reactions or anaphylaxis history"
    ],
    diagnostics: [
      "Vaccine response titers to assess humoral immune function",
      "ANA panel with specific autoantibodies",
      "Genetic testing for primary immunodeficiency disorders",
      "Lymphocyte proliferation assays for cellular immunity",
      "Tissue biopsy for immune complex deposition or granulomatous inflammation",
      "HIV testing (4th gen Ag/Ab combo, confirmatory Western blot)",
      "Quantitative immunoglobulins (IgG, IgA, IgM, IgE)"
    ],
    management: [
      "Evidence-based immunomodulatory therapy specific to anaphylaxis advanced",
      "Allergen avoidance and environmental modification",
      "Immunosuppressive agents when indicated (corticosteroids, calcineurin inhibitors)",
      "Biologic agents targeting specific immune pathways",
      "Vaccination update per immunocompromised guidelines",
      "Infection surveillance and prophylaxis",
      "Allergy/immunology consultation for complex immune dysregulation"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urticaria, angioedema, anaphylaxis symptoms",
        "Recurrent or opportunistic infections",
        "Fever of unknown origin",
        "Fatigue and constitutional symptoms"
      ],
      right: [
        "Lymphadenopathy or organomegaly",
        "Skin findings (rash, vasculitis, photosensitivity)",
        "Laboratory evidence of immune dysfunction",
        "Multi-organ involvement suggesting systemic process"
      ]
    },
    medications: [
      {
        name: "Epinephrine (EpiPen)",
        type: "Alpha/Beta Agonist",
        action: "Alpha-1: vasoconstriction reverses hypotension; Beta-1: positive inotropy/chronotropy; Beta-2: bronchodilation and mast cell stabilization",
        sideEffects: "Tachycardia, anxiety, tremor, hypertension",
        contra: "No absolute contraindications in anaphylaxis",
        pearl: "IM anterolateral thigh: 0.3-0.5mg adults, 0.01mg/kg peds. Auto-injector: carry 2. Can repeat q5-15min. First-line for anaphylaxis - NEVER delay."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces T-cell activation, decreases cytokine production",
        sideEffects: "Hyperglycemia, weight gain, osteoporosis, immunosuppression, adrenal suppression",
        contra: "Active untreated infection; caution with diabetes, osteoporosis, peptic ulcer",
        pearl: "Anaphylaxis: 50mg PO to prevent biphasic reaction. Autoimmune: 1mg/kg then taper. Taper if >2 weeks use to prevent adrenal crisis."
      }
    ],
    pearls: [
      "Anaphylaxis: epinephrine IM is FIRST-LINE - antihistamines and steroids are adjunctive only",
      "Distinguish IgE-mediated (Type I) from other hypersensitivity mechanisms for proper management",
      "Anaphylaxis Advanced requires systematic immune workup including immunoglobulins, complement, and lymphocyte subsets"
    ],
    quiz: [
      {
        question: "A patient develops acute symptoms consistent with anaphylaxis advanced with hypotension and respiratory distress. Priority intervention?",
        options: [
          "IV diphenhydramine 50mg",
          "IM epinephrine 0.3mg into anterolateral thigh",
          "Oral prednisone 50mg",
          "Nebulized albuterol only"
        ],
        correct: 1,
        rationale: "IM epinephrine is the first-line treatment for severe allergic/immune reactions with hemodynamic instability or respiratory compromise."
      }
    ]
  },
  "angioedema-np": {
    title: "Angioedema: ACE Inhibitor",
    cellular: {
      title: "Pathophysiology of Angioedema",
      content: "ACE inhibitor-induced angioedema occurs in 0.1-0.7% of users, more common in African Americans (4-5x risk). Mechanism: bradykinin accumulation due to ACE inhibition (ACE normally degrades bradykinin). Can occur at any time during therapy (even after years). Presents with non-pitting edema of face, lips, tongue, larynx without urticaria. Treatment: discontinue ACEi permanently, airway management, fresh frozen plasma, icatibant. Switch to ARB with caution (cross-reactivity rare but possible)."
    },
    riskFactors: [
      "Stress and sleep deprivation impairing immune function",
      "Occupational chemical/biological exposure",
      "Age-related immune senescence (immunosenescence)",
      "Nutritional deficiencies (zinc, vitamin D) affecting immunity",
      "Prior allergic reactions or anaphylaxis history",
      "Family history of autoimmune disease or immunodeficiency",
      "Chronic inflammatory conditions"
    ],
    diagnostics: [
      "Genetic testing for primary immunodeficiency disorders",
      "Vaccine response titers to assess humoral immune function",
      "Tissue biopsy for immune complex deposition or granulomatous inflammation",
      "HIV testing (4th gen Ag/Ab combo, confirmatory Western blot)",
      "Quantitative immunoglobulins (IgG, IgA, IgM, IgE)",
      "Complete blood count with differential (lymphocyte subsets)",
      "Flow cytometry for lymphocyte subpopulations (CD4, CD8, CD19, CD56)"
    ],
    management: [
      "Evidence-based immunomodulatory therapy specific to angioedema",
      "Allergen avoidance and environmental modification",
      "Immunosuppressive agents when indicated (corticosteroids, calcineurin inhibitors)",
      "Biologic agents targeting specific immune pathways",
      "Vaccination update per immunocompromised guidelines",
      "Infection surveillance and prophylaxis",
      "Allergy/immunology consultation for complex immune dysregulation"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urticaria, angioedema, anaphylaxis symptoms",
        "Recurrent or opportunistic infections",
        "Fever of unknown origin",
        "Fatigue and constitutional symptoms"
      ],
      right: [
        "Lymphadenopathy or organomegaly",
        "Skin findings (rash, vasculitis, photosensitivity)",
        "Laboratory evidence of immune dysfunction",
        "Multi-organ involvement suggesting systemic process"
      ]
    },
    medications: [
      {
        name: "Epinephrine (EpiPen)",
        type: "Alpha/Beta Agonist",
        action: "Alpha-1: vasoconstriction reverses hypotension; Beta-1: positive inotropy/chronotropy; Beta-2: bronchodilation and mast cell stabilization",
        sideEffects: "Tachycardia, anxiety, tremor, hypertension",
        contra: "No absolute contraindications in anaphylaxis",
        pearl: "IM anterolateral thigh: 0.3-0.5mg adults, 0.01mg/kg peds. Auto-injector: carry 2. Can repeat q5-15min. First-line for anaphylaxis - NEVER delay."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces T-cell activation, decreases cytokine production",
        sideEffects: "Hyperglycemia, weight gain, osteoporosis, immunosuppression, adrenal suppression",
        contra: "Active untreated infection; caution with diabetes, osteoporosis, peptic ulcer",
        pearl: "Anaphylaxis: 50mg PO to prevent biphasic reaction. Autoimmune: 1mg/kg then taper. Taper if >2 weeks use to prevent adrenal crisis."
      }
    ],
    pearls: [
      "Anaphylaxis: epinephrine IM is FIRST-LINE - antihistamines and steroids are adjunctive only",
      "Distinguish IgE-mediated (Type I) from other hypersensitivity mechanisms for proper management",
      "Angioedema requires systematic immune workup including immunoglobulins, complement, and lymphocyte subsets"
    ],
    quiz: [
      {
        question: "A patient develops acute symptoms consistent with angioedema with hypotension and respiratory distress. Priority intervention?",
        options: [
          "IV diphenhydramine 50mg",
          "IM epinephrine 0.3mg into anterolateral thigh",
          "Oral prednisone 50mg",
          "Nebulized albuterol only"
        ],
        correct: 1,
        rationale: "IM epinephrine is the first-line treatment for severe allergic/immune reactions with hemodynamic instability or respiratory compromise."
      }
    ]
  },
  "hereditary-angioedema-np": {
    title: "Hereditary Angioedema: C1 Esterase Inhibitor",
    cellular: {
      title: "Pathophysiology of Hereditary Angioedema",
      content: "Hereditary angioedema (HAE) results from C1 esterase inhibitor (C1-INH) deficiency (Type 1: low quantity, 85%) or dysfunction (Type 2: normal quantity, dysfunctional, 15%). Unregulated complement and contact system activation generates excess bradykinin causing non-histaminergic angioedema. Labs: low C4 (screening), low/dysfunctional C1-INH. Does NOT respond to epinephrine, antihistamines, or steroids. Acute: IV C1-INH concentrate, icatibant (bradykinin B2 antagonist), or ecallantide (kallikrein inhibitor). Prophylaxis: lanadelumab (anti-kallikrein monoclonal antibody)."
    },
    riskFactors: [
      "Occupational chemical/biological exposure",
      "Organ transplant with rejection risk",
      "Stress and sleep deprivation impairing immune function",
      "Genetic variants in HLA, complement, or immune pathways",
      "Age-related immune senescence (immunosenescence)",
      "Nutritional deficiencies (zinc, vitamin D) affecting immunity",
      "Prior allergic reactions or anaphylaxis history"
    ],
    diagnostics: [
      "Vaccine response titers to assess humoral immune function",
      "ANA panel with specific autoantibodies",
      "Genetic testing for primary immunodeficiency disorders",
      "Lymphocyte proliferation assays for cellular immunity",
      "Tissue biopsy for immune complex deposition or granulomatous inflammation",
      "HIV testing (4th gen Ag/Ab combo, confirmatory Western blot)",
      "Quantitative immunoglobulins (IgG, IgA, IgM, IgE)"
    ],
    management: [
      "Evidence-based immunomodulatory therapy specific to hereditary angioedema",
      "Allergen avoidance and environmental modification",
      "Immunosuppressive agents when indicated (corticosteroids, calcineurin inhibitors)",
      "Biologic agents targeting specific immune pathways",
      "Vaccination update per immunocompromised guidelines",
      "Infection surveillance and prophylaxis",
      "Allergy/immunology consultation for complex immune dysregulation"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urticaria, angioedema, anaphylaxis symptoms",
        "Recurrent or opportunistic infections",
        "Fever of unknown origin",
        "Fatigue and constitutional symptoms"
      ],
      right: [
        "Lymphadenopathy or organomegaly",
        "Skin findings (rash, vasculitis, photosensitivity)",
        "Laboratory evidence of immune dysfunction",
        "Multi-organ involvement suggesting systemic process"
      ]
    },
    medications: [
      {
        name: "Epinephrine (EpiPen)",
        type: "Alpha/Beta Agonist",
        action: "Alpha-1: vasoconstriction reverses hypotension; Beta-1: positive inotropy/chronotropy; Beta-2: bronchodilation and mast cell stabilization",
        sideEffects: "Tachycardia, anxiety, tremor, hypertension",
        contra: "No absolute contraindications in anaphylaxis",
        pearl: "IM anterolateral thigh: 0.3-0.5mg adults, 0.01mg/kg peds. Auto-injector: carry 2. Can repeat q5-15min. First-line for anaphylaxis - NEVER delay."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces T-cell activation, decreases cytokine production",
        sideEffects: "Hyperglycemia, weight gain, osteoporosis, immunosuppression, adrenal suppression",
        contra: "Active untreated infection; caution with diabetes, osteoporosis, peptic ulcer",
        pearl: "Anaphylaxis: 50mg PO to prevent biphasic reaction. Autoimmune: 1mg/kg then taper. Taper if >2 weeks use to prevent adrenal crisis."
      }
    ],
    pearls: [
      "Anaphylaxis: epinephrine IM is FIRST-LINE - antihistamines and steroids are adjunctive only",
      "Distinguish IgE-mediated (Type I) from other hypersensitivity mechanisms for proper management",
      "Hereditary Angioedema requires systematic immune workup including immunoglobulins, complement, and lymphocyte subsets"
    ],
    quiz: [
      {
        question: "A patient develops acute symptoms consistent with hereditary angioedema with hypotension and respiratory distress. Priority intervention?",
        options: [
          "IV diphenhydramine 50mg",
          "IM epinephrine 0.3mg into anterolateral thigh",
          "Oral prednisone 50mg",
          "Nebulized albuterol only"
        ],
        correct: 1,
        rationale: "IM epinephrine is the first-line treatment for severe allergic/immune reactions with hemodynamic instability or respiratory compromise."
      }
    ]
  },
  "mast-cell-activation-np": {
    title: "Mast Cell Activation Syndrome: Tryptase",
    cellular: {
      title: "Pathophysiology of Mast Cell Activation Syndrome",
      content: "Mast cell activation syndrome (MCAS) involves episodic mast cell mediator release causing recurrent episodes of urticaria, flushing, GI symptoms, and hypotension. Diagnosis requires: recurrent symptoms in >=2 organ systems, elevated tryptase (>20% above baseline + 2 ng/mL during episode), and symptom improvement with anti-mediator therapy. Distinguish from systemic mastocytosis (KIT D816V mutation, elevated baseline tryptase). Treatment: H1 + H2 antihistamines, cromolyn sodium, leukotriene antagonists, omalizumab for refractory cases."
    },
    riskFactors: [
      "Medication exposure triggering immune-mediated reactions",
      "Family history of autoimmune disease or immunodeficiency",
      "Immunosuppressive therapy increasing infection susceptibility",
      "Chronic inflammatory conditions",
      "Environmental allergen sensitization",
      "Organ transplant with rejection risk",
      "Genetic variants in HLA, complement, or immune pathways"
    ],
    diagnostics: [
      "Complement levels (C3, C4, CH50, AH50)",
      "Complete blood count with differential (lymphocyte subsets)",
      "Specific IgE testing or skin prick testing for allergen identification",
      "Flow cytometry for lymphocyte subpopulations (CD4, CD8, CD19, CD56)",
      "Tryptase level (elevated in mast cell activation, anaphylaxis)",
      "ANA panel with specific autoantibodies",
      "Lymphocyte proliferation assays for cellular immunity"
    ],
    management: [
      "Evidence-based immunomodulatory therapy specific to mast cell activation syndrome",
      "Allergen avoidance and environmental modification",
      "Immunosuppressive agents when indicated (corticosteroids, calcineurin inhibitors)",
      "Biologic agents targeting specific immune pathways",
      "Vaccination update per immunocompromised guidelines",
      "Infection surveillance and prophylaxis",
      "Allergy/immunology consultation for complex immune dysregulation"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urticaria, angioedema, anaphylaxis symptoms",
        "Recurrent or opportunistic infections",
        "Fever of unknown origin",
        "Fatigue and constitutional symptoms"
      ],
      right: [
        "Lymphadenopathy or organomegaly",
        "Skin findings (rash, vasculitis, photosensitivity)",
        "Laboratory evidence of immune dysfunction",
        "Multi-organ involvement suggesting systemic process"
      ]
    },
    medications: [
      {
        name: "Epinephrine (EpiPen)",
        type: "Alpha/Beta Agonist",
        action: "Alpha-1: vasoconstriction reverses hypotension; Beta-1: positive inotropy/chronotropy; Beta-2: bronchodilation and mast cell stabilization",
        sideEffects: "Tachycardia, anxiety, tremor, hypertension",
        contra: "No absolute contraindications in anaphylaxis",
        pearl: "IM anterolateral thigh: 0.3-0.5mg adults, 0.01mg/kg peds. Auto-injector: carry 2. Can repeat q5-15min. First-line for anaphylaxis - NEVER delay."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces T-cell activation, decreases cytokine production",
        sideEffects: "Hyperglycemia, weight gain, osteoporosis, immunosuppression, adrenal suppression",
        contra: "Active untreated infection; caution with diabetes, osteoporosis, peptic ulcer",
        pearl: "Anaphylaxis: 50mg PO to prevent biphasic reaction. Autoimmune: 1mg/kg then taper. Taper if >2 weeks use to prevent adrenal crisis."
      }
    ],
    pearls: [
      "Anaphylaxis: epinephrine IM is FIRST-LINE - antihistamines and steroids are adjunctive only",
      "Distinguish IgE-mediated (Type I) from other hypersensitivity mechanisms for proper management",
      "Mast Cell Activation Syndrome requires systematic immune workup including immunoglobulins, complement, and lymphocyte subsets"
    ],
    quiz: [
      {
        question: "A patient develops acute symptoms consistent with mast cell activation syndrome with hypotension and respiratory distress. Priority intervention?",
        options: [
          "IV diphenhydramine 50mg",
          "IM epinephrine 0.3mg into anterolateral thigh",
          "Oral prednisone 50mg",
          "Nebulized albuterol only"
        ],
        correct: 1,
        rationale: "IM epinephrine is the first-line treatment for severe allergic/immune reactions with hemodynamic instability or respiratory compromise."
      }
    ]
  },
  "drug-hypersensitivity-np": {
    title: "Drug Hypersensitivity Reactions: Gell-Coombs",
    cellular: {
      title: "Pathophysiology of Drug Hypersensitivity Reactions",
      content: "Drug Hypersensitivity Reactions: Gell-Coombs involves dysregulation of innate or adaptive immune responses leading to tissue injury or immunodeficiency in drug hypersensitivity reactions."
    },
    riskFactors: [
      "Prior allergic reactions or anaphylaxis history",
      "Age-related immune senescence (immunosenescence)",
      "Chronic inflammatory conditions",
      "Medication exposure triggering immune-mediated reactions",
      "Organ transplant with rejection risk",
      "Immunosuppressive therapy increasing infection susceptibility",
      "Occupational chemical/biological exposure"
    ],
    diagnostics: [
      "Quantitative immunoglobulins (IgG, IgA, IgM, IgE)",
      "Tissue biopsy for immune complex deposition or granulomatous inflammation",
      "Flow cytometry for lymphocyte subpopulations (CD4, CD8, CD19, CD56)",
      "Complement levels (C3, C4, CH50, AH50)",
      "ANA panel with specific autoantibodies",
      "Specific IgE testing or skin prick testing for allergen identification",
      "Vaccine response titers to assess humoral immune function"
    ],
    management: [
      "Evidence-based immunomodulatory therapy specific to drug hypersensitivity reactions",
      "Allergen avoidance and environmental modification",
      "Immunosuppressive agents when indicated (corticosteroids, calcineurin inhibitors)",
      "Biologic agents targeting specific immune pathways",
      "Vaccination update per immunocompromised guidelines",
      "Infection surveillance and prophylaxis",
      "Allergy/immunology consultation for complex immune dysregulation"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urticaria, angioedema, anaphylaxis symptoms",
        "Recurrent or opportunistic infections",
        "Fever of unknown origin",
        "Fatigue and constitutional symptoms"
      ],
      right: [
        "Lymphadenopathy or organomegaly",
        "Skin findings (rash, vasculitis, photosensitivity)",
        "Laboratory evidence of immune dysfunction",
        "Multi-organ involvement suggesting systemic process"
      ]
    },
    medications: [
      {
        name: "Epinephrine (EpiPen)",
        type: "Alpha/Beta Agonist",
        action: "Alpha-1: vasoconstriction reverses hypotension; Beta-1: positive inotropy/chronotropy; Beta-2: bronchodilation and mast cell stabilization",
        sideEffects: "Tachycardia, anxiety, tremor, hypertension",
        contra: "No absolute contraindications in anaphylaxis",
        pearl: "IM anterolateral thigh: 0.3-0.5mg adults, 0.01mg/kg peds. Auto-injector: carry 2. Can repeat q5-15min. First-line for anaphylaxis - NEVER delay."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces T-cell activation, decreases cytokine production",
        sideEffects: "Hyperglycemia, weight gain, osteoporosis, immunosuppression, adrenal suppression",
        contra: "Active untreated infection; caution with diabetes, osteoporosis, peptic ulcer",
        pearl: "Anaphylaxis: 50mg PO to prevent biphasic reaction. Autoimmune: 1mg/kg then taper. Taper if >2 weeks use to prevent adrenal crisis."
      }
    ],
    pearls: [
      "Anaphylaxis: epinephrine IM is FIRST-LINE - antihistamines and steroids are adjunctive only",
      "Distinguish IgE-mediated (Type I) from other hypersensitivity mechanisms for proper management",
      "Drug Hypersensitivity Reactions requires systematic immune workup including immunoglobulins, complement, and lymphocyte subsets"
    ],
    quiz: [
      {
        question: "A patient develops acute symptoms consistent with drug hypersensitivity reactions with hypotension and respiratory distress. Priority intervention?",
        options: [
          "IV diphenhydramine 50mg",
          "IM epinephrine 0.3mg into anterolateral thigh",
          "Oral prednisone 50mg",
          "Nebulized albuterol only"
        ],
        correct: 1,
        rationale: "IM epinephrine is the first-line treatment for severe allergic/immune reactions with hemodynamic instability or respiratory compromise."
      }
    ]
  },
  "serum-sickness-np": {
    title: "Serum Sickness: Type III Hypersensitivity",
    cellular: {
      title: "Pathophysiology of Serum Sickness",
      content: "Serum Sickness: Type III Hypersensitivity involves dysregulation of innate or adaptive immune responses leading to tissue injury or immunodeficiency in serum sickness."
    },
    riskFactors: [
      "Occupational chemical/biological exposure",
      "Organ transplant with rejection risk",
      "Stress and sleep deprivation impairing immune function",
      "Genetic variants in HLA, complement, or immune pathways",
      "Age-related immune senescence (immunosenescence)",
      "Nutritional deficiencies (zinc, vitamin D) affecting immunity",
      "Prior allergic reactions or anaphylaxis history"
    ],
    diagnostics: [
      "Vaccine response titers to assess humoral immune function",
      "ANA panel with specific autoantibodies",
      "Genetic testing for primary immunodeficiency disorders",
      "Lymphocyte proliferation assays for cellular immunity",
      "Tissue biopsy for immune complex deposition or granulomatous inflammation",
      "HIV testing (4th gen Ag/Ab combo, confirmatory Western blot)",
      "Quantitative immunoglobulins (IgG, IgA, IgM, IgE)"
    ],
    management: [
      "Evidence-based immunomodulatory therapy specific to serum sickness",
      "Allergen avoidance and environmental modification",
      "Immunosuppressive agents when indicated (corticosteroids, calcineurin inhibitors)",
      "Biologic agents targeting specific immune pathways",
      "Vaccination update per immunocompromised guidelines",
      "Infection surveillance and prophylaxis",
      "Allergy/immunology consultation for complex immune dysregulation"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urticaria, angioedema, anaphylaxis symptoms",
        "Recurrent or opportunistic infections",
        "Fever of unknown origin",
        "Fatigue and constitutional symptoms"
      ],
      right: [
        "Lymphadenopathy or organomegaly",
        "Skin findings (rash, vasculitis, photosensitivity)",
        "Laboratory evidence of immune dysfunction",
        "Multi-organ involvement suggesting systemic process"
      ]
    },
    medications: [
      {
        name: "Epinephrine (EpiPen)",
        type: "Alpha/Beta Agonist",
        action: "Alpha-1: vasoconstriction reverses hypotension; Beta-1: positive inotropy/chronotropy; Beta-2: bronchodilation and mast cell stabilization",
        sideEffects: "Tachycardia, anxiety, tremor, hypertension",
        contra: "No absolute contraindications in anaphylaxis",
        pearl: "IM anterolateral thigh: 0.3-0.5mg adults, 0.01mg/kg peds. Auto-injector: carry 2. Can repeat q5-15min. First-line for anaphylaxis - NEVER delay."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces T-cell activation, decreases cytokine production",
        sideEffects: "Hyperglycemia, weight gain, osteoporosis, immunosuppression, adrenal suppression",
        contra: "Active untreated infection; caution with diabetes, osteoporosis, peptic ulcer",
        pearl: "Anaphylaxis: 50mg PO to prevent biphasic reaction. Autoimmune: 1mg/kg then taper. Taper if >2 weeks use to prevent adrenal crisis."
      }
    ],
    pearls: [
      "Anaphylaxis: epinephrine IM is FIRST-LINE - antihistamines and steroids are adjunctive only",
      "Distinguish IgE-mediated (Type I) from other hypersensitivity mechanisms for proper management",
      "Serum Sickness requires systematic immune workup including immunoglobulins, complement, and lymphocyte subsets"
    ],
    quiz: [
      {
        question: "A patient develops acute symptoms consistent with serum sickness with hypotension and respiratory distress. Priority intervention?",
        options: [
          "IV diphenhydramine 50mg",
          "IM epinephrine 0.3mg into anterolateral thigh",
          "Oral prednisone 50mg",
          "Nebulized albuterol only"
        ],
        correct: 1,
        rationale: "IM epinephrine is the first-line treatment for severe allergic/immune reactions with hemodynamic instability or respiratory compromise."
      }
    ]
  },
  "graft-vs-host-disease-np": {
    title: "Graft-Versus-Host Disease: Acute",
    cellular: {
      title: "Pathophysiology of Graft-Versus-Host Disease",
      content: "Graft-versus-host disease (GVHD) occurs when donor T cells recognize and attack host tissues after allogeneic stem cell transplant. Acute GVHD (<100 days): skin (maculopapular rash), liver (cholestatic hepatitis), GI (diarrhea, nausea, vomiting). Chronic GVHD (>100 days): resembles autoimmune disease (scleroderma-like skin, sicca syndrome, bronchiolitis obliterans). Treatment: corticosteroids first-line; ruxolitinib (JAK1/2 inhibitor) for steroid-refractory acute GVHD. Prevention: post-transplant cyclophosphamide, calcineurin inhibitors."
    },
    riskFactors: [
      "Family history of autoimmune disease or immunodeficiency",
      "Nutritional deficiencies (zinc, vitamin D) affecting immunity",
      "Medication exposure triggering immune-mediated reactions",
      "Prior allergic reactions or anaphylaxis history",
      "Immunosuppressive therapy increasing infection susceptibility",
      "Chronic inflammatory conditions",
      "Environmental allergen sensitization"
    ],
    diagnostics: [
      "Complete blood count with differential (lymphocyte subsets)",
      "HIV testing (4th gen Ag/Ab combo, confirmatory Western blot)",
      "Complement levels (C3, C4, CH50, AH50)",
      "Quantitative immunoglobulins (IgG, IgA, IgM, IgE)",
      "Specific IgE testing or skin prick testing for allergen identification",
      "Flow cytometry for lymphocyte subpopulations (CD4, CD8, CD19, CD56)",
      "Tryptase level (elevated in mast cell activation, anaphylaxis)"
    ],
    management: [
      "Evidence-based immunomodulatory therapy specific to graft-versus-host disease",
      "Allergen avoidance and environmental modification",
      "Immunosuppressive agents when indicated (corticosteroids, calcineurin inhibitors)",
      "Biologic agents targeting specific immune pathways",
      "Vaccination update per immunocompromised guidelines",
      "Infection surveillance and prophylaxis",
      "Allergy/immunology consultation for complex immune dysregulation"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Urticaria, angioedema, anaphylaxis symptoms",
        "Recurrent or opportunistic infections",
        "Fever of unknown origin",
        "Fatigue and constitutional symptoms"
      ],
      right: [
        "Lymphadenopathy or organomegaly",
        "Skin findings (rash, vasculitis, photosensitivity)",
        "Laboratory evidence of immune dysfunction",
        "Multi-organ involvement suggesting systemic process"
      ]
    },
    medications: [
      {
        name: "Epinephrine (EpiPen)",
        type: "Alpha/Beta Agonist",
        action: "Alpha-1: vasoconstriction reverses hypotension; Beta-1: positive inotropy/chronotropy; Beta-2: bronchodilation and mast cell stabilization",
        sideEffects: "Tachycardia, anxiety, tremor, hypertension",
        contra: "No absolute contraindications in anaphylaxis",
        pearl: "IM anterolateral thigh: 0.3-0.5mg adults, 0.01mg/kg peds. Auto-injector: carry 2. Can repeat q5-15min. First-line for anaphylaxis - NEVER delay."
      },
      {
        name: "Prednisone",
        type: "Systemic Glucocorticoid",
        action: "Suppresses inflammatory gene transcription, reduces T-cell activation, decreases cytokine production",
        sideEffects: "Hyperglycemia, weight gain, osteoporosis, immunosuppression, adrenal suppression",
        contra: "Active untreated infection; caution with diabetes, osteoporosis, peptic ulcer",
        pearl: "Anaphylaxis: 50mg PO to prevent biphasic reaction. Autoimmune: 1mg/kg then taper. Taper if >2 weeks use to prevent adrenal crisis."
      }
    ],
    pearls: [
      "Anaphylaxis: epinephrine IM is FIRST-LINE - antihistamines and steroids are adjunctive only",
      "Distinguish IgE-mediated (Type I) from other hypersensitivity mechanisms for proper management",
      "Graft-Versus-Host Disease requires systematic immune workup including immunoglobulins, complement, and lymphocyte subsets"
    ],
    quiz: [
      {
        question: "A patient develops acute symptoms consistent with graft-versus-host disease with hypotension and respiratory distress. Priority intervention?",
        options: [
          "IV diphenhydramine 50mg",
          "IM epinephrine 0.3mg into anterolateral thigh",
          "Oral prednisone 50mg",
          "Nebulized albuterol only"
        ],
        correct: 1,
        rationale: "IM epinephrine is the first-line treatment for severe allergic/immune reactions with hemodynamic instability or respiratory compromise."
      }
    ]
  },
  "vasopressors-np": {
    title: "Vasopressors: Receptor Pharmacology",
    cellular: {
      title: "Pharmacology of Vasopressors",
      content: "Vasopressors: Receptor Pharmacology encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to vasopressors."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Vasopressors management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to vasopressors. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "sedation-np": {
    title: "ICU Sedation: RASS & Protocols",
    cellular: {
      title: "Pathophysiology of ICU Sedation",
      content: "ICU sedation uses Richmond Agitation-Sedation Scale (RASS): +4 combative to -5 unarrousable, target 0 to -2 for most patients. Daily sedation interruption (wake-up trial) paired with spontaneous breathing trial reduces ventilator days and ICU mortality. Propofol: rapid onset/offset, preferred for short-term sedation; monitor for propofol infusion syndrome (>48h, >4mg/kg/hr). Dexmedetomidine: alpha-2 agonist, maintains arousability, less delirium than benzodiazepines. Avoid benzodiazepines (increased delirium). CAM-ICU for delirium screening."
    },
    riskFactors: [
      "Polytrauma with multi-organ involvement",
      "Critical illness with systemic inflammatory response",
      "Extremes of age with limited physiologic reserve",
      "Comorbid conditions complicating clinical course",
      "Environmental exposure (heat, cold, altitude, pressure)",
      "Delayed presentation or recognition of emergency",
      "Medication-related complications or toxicity"
    ],
    diagnostics: [
      "Focused primary and secondary survey for trauma",
      "Point-of-care labs (ABG, lactate, glucose, electrolytes)",
      "Bedside ultrasound (FAST, cardiac, lung)",
      "CT imaging for definitive injury characterization",
      "Continuous cardiorespiratory monitoring",
      "Glasgow Coma Scale and pupillary assessment",
      "Toxicology screening when indicated"
    ],
    management: [
      "ABCDE systematic assessment and stabilization",
      "Damage control resuscitation for hemorrhagic shock",
      "Targeted temperature management protocols",
      "Pain management (multimodal, regional anesthesia when possible)",
      "Early mobility and rehabilitation initiation",
      "ICU-level monitoring and organ support",
      "Multidisciplinary team approach for complex patients"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Hemodynamic instability (hypotension, tachycardia)",
        "Respiratory compromise",
        "Altered level of consciousness",
        "Pain disproportionate to apparent injury"
      ],
      right: [
        "Multi-organ dysfunction indicators",
        "Coagulopathy (DIC screening)",
        "Rhabdomyolysis signs (dark urine, elevated CK)",
        "Compartment pressure elevation"
      ]
    },
    medications: [
      {
        name: "Norepinephrine (Levophed)",
        type: "Alpha-1 > Beta-1 Agonist (Vasopressor)",
        action: "Potent alpha-1 vasoconstriction with moderate beta-1 inotropy increasing MAP",
        sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis with extravasation",
        contra: "Hypovolemia (correct volume first), mesenteric ischemia",
        pearl: "First-line vasopressor for septic shock (Surviving Sepsis 2021). Start 0.1-0.5 mcg/kg/min, titrate to MAP >=65. Central line preferred but can start peripherally in emergency. Phentolamine for extravasation."
      },
      {
        name: "Ketamine",
        type: "NMDA Receptor Antagonist",
        action: "Dissociative anesthetic providing analgesia, amnesia, and sedation while maintaining airway reflexes and hemodynamics",
        sideEffects: "Emergence reactions, laryngospasm (rare), hypertension, increased secretions",
        contra: "Severe hypertension, elevated ICP (controversial), psychiatric instability",
        pearl: "Pain: 0.1-0.3mg/kg IV. Procedural sedation: 1-2mg/kg IV. RSI: 1.5-2mg/kg IV. Maintains hemodynamics - ideal for hypotensive patients. Pretreat with midazolam 0.03mg/kg to reduce emergence reactions."
      }
    ],
    pearls: [
      "ABCDE approach: Airway, Breathing, Circulation, Disability, Exposure - systematic assessment saves lives",
      "Damage control resuscitation: permissive hypotension (MAP 50-65 until surgical control), balanced transfusion (1:1:1 PRBC:FFP:platelets), minimize crystalloid",
      "ICU Sedation management requires rapid assessment, stabilization, and definitive treatment coordination"
    ],
    quiz: [
      {
        question: "A patient with icu sedation arrives with unstable vital signs. Priority intervention?",
        options: [
          "Complete head-to-toe assessment before any intervention",
          "Systematic ABCDE assessment with simultaneous stabilization of life threats",
          "Obtain complete labs before treatment decisions",
          "Transfer to operating room without assessment"
        ],
        correct: 1,
        rationale: "Systematic ABCDE assessment with simultaneous stabilization of identified life threats ensures the most critical issues are addressed first for icu sedation."
      }
    ]
  },
  "paralytic-agents-np": {
    title: "Neuromuscular Blocking Agents",
    cellular: {
      title: "Pathophysiology of Neuromuscular Blocking Agents",
      content: "Neuromuscular Blocking Agents involves multi-system pathophysiology requiring integration of knowledge across organ systems for neuromuscular blocking agents."
    },
    riskFactors: [
      "Polytrauma with multi-organ involvement",
      "Critical illness with systemic inflammatory response",
      "Extremes of age with limited physiologic reserve",
      "Comorbid conditions complicating clinical course",
      "Environmental exposure (heat, cold, altitude, pressure)",
      "Delayed presentation or recognition of emergency",
      "Medication-related complications or toxicity"
    ],
    diagnostics: [
      "Focused primary and secondary survey for trauma",
      "Point-of-care labs (ABG, lactate, glucose, electrolytes)",
      "Bedside ultrasound (FAST, cardiac, lung)",
      "CT imaging for definitive injury characterization",
      "Continuous cardiorespiratory monitoring",
      "Glasgow Coma Scale and pupillary assessment",
      "Toxicology screening when indicated"
    ],
    management: [
      "ABCDE systematic assessment and stabilization",
      "Damage control resuscitation for hemorrhagic shock",
      "Targeted temperature management protocols",
      "Pain management (multimodal, regional anesthesia when possible)",
      "Early mobility and rehabilitation initiation",
      "ICU-level monitoring and organ support",
      "Multidisciplinary team approach for complex patients"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Hemodynamic instability (hypotension, tachycardia)",
        "Respiratory compromise",
        "Altered level of consciousness",
        "Pain disproportionate to apparent injury"
      ],
      right: [
        "Multi-organ dysfunction indicators",
        "Coagulopathy (DIC screening)",
        "Rhabdomyolysis signs (dark urine, elevated CK)",
        "Compartment pressure elevation"
      ]
    },
    medications: [
      {
        name: "Norepinephrine (Levophed)",
        type: "Alpha-1 > Beta-1 Agonist (Vasopressor)",
        action: "Potent alpha-1 vasoconstriction with moderate beta-1 inotropy increasing MAP",
        sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis with extravasation",
        contra: "Hypovolemia (correct volume first), mesenteric ischemia",
        pearl: "First-line vasopressor for septic shock (Surviving Sepsis 2021). Start 0.1-0.5 mcg/kg/min, titrate to MAP >=65. Central line preferred but can start peripherally in emergency. Phentolamine for extravasation."
      },
      {
        name: "Ketamine",
        type: "NMDA Receptor Antagonist",
        action: "Dissociative anesthetic providing analgesia, amnesia, and sedation while maintaining airway reflexes and hemodynamics",
        sideEffects: "Emergence reactions, laryngospasm (rare), hypertension, increased secretions",
        contra: "Severe hypertension, elevated ICP (controversial), psychiatric instability",
        pearl: "Pain: 0.1-0.3mg/kg IV. Procedural sedation: 1-2mg/kg IV. RSI: 1.5-2mg/kg IV. Maintains hemodynamics - ideal for hypotensive patients. Pretreat with midazolam 0.03mg/kg to reduce emergence reactions."
      }
    ],
    pearls: [
      "ABCDE approach: Airway, Breathing, Circulation, Disability, Exposure - systematic assessment saves lives",
      "Damage control resuscitation: permissive hypotension (MAP 50-65 until surgical control), balanced transfusion (1:1:1 PRBC:FFP:platelets), minimize crystalloid",
      "Neuromuscular Blocking Agents management requires rapid assessment, stabilization, and definitive treatment coordination"
    ],
    quiz: [
      {
        question: "A patient with neuromuscular blocking agents arrives with unstable vital signs. Priority intervention?",
        options: [
          "Complete head-to-toe assessment before any intervention",
          "Systematic ABCDE assessment with simultaneous stabilization of life threats",
          "Obtain complete labs before treatment decisions",
          "Transfer to operating room without assessment"
        ],
        correct: 1,
        rationale: "Systematic ABCDE assessment with simultaneous stabilization of identified life threats ensures the most critical issues are addressed first for neuromuscular blocking agents."
      }
    ]
  },
  "thrombolytics-np": {
    title: "Thrombolytics: Fibrinolytic Pathway",
    cellular: {
      title: "Pathophysiology of Thrombolytics",
      content: "Thrombolytics: Fibrinolytic Pathway involves specific alterations in thrombolytics physiology. The pathophysiology of Thrombolytics encompasses changes in myocardial contractility, cardiac conduction, vascular resistance, endothelial function, or structural integrity depending on the primary mechanism involved. Key cellular processes include ion channel dysfunction, inflammatory mediator activation, oxidative stress, fibrotic remodeling, and neurohormonal dysregulation that drive the clinical manifestations of thrombolytics."
    },
    riskFactors: [
      "Prior stroke or TIA with residual neurological deficit",
      "Coronary artery disease with prior MI or PCI",
      "Sedentary lifestyle with deconditioning",
      "Left ventricular hypertrophy on ECG or echo",
      "Obesity (BMI >30) with metabolic syndrome",
      "Age >65 with cardiovascular degeneration",
      "Diabetes mellitus type 2 with HbA1c >7%"
    ],
    diagnostics: [
      "Holter or event monitor for intermittent arrhythmia detection",
      "Troponin I or T serial measurements (0h, 3h, 6h) for myocardial injury",
      "Ankle-brachial index for peripheral vascular disease screening",
      "CRP and ESR for inflammatory/infectious cardiac conditions",
      "CT angiography of chest for aortic or pulmonary vascular pathology",
      "Echocardiography: EF, wall motion, valvular function, chamber dimensions",
      "BNP >100 pg/mL or NT-proBNP >300 pg/mL for volume overload assessment"
    ],
    management: [
      "Sodium restriction <2g/day for volume-sensitive conditions",
      "Blood pressure target <130/80 mmHg (ACC/AHA 2017 guidelines)",
      "Fluid restriction 1.5-2L/day for hyponatremia or severe HF",
      "Structured exercise program: 150 min/week moderate-intensity aerobic",
      "SGLT2 inhibitor for HF regardless of diabetes status",
      "High-intensity statin therapy (atorvastatin 40-80mg or rosuvastatin 20-40mg)",
      "Antiplatelet therapy: aspirin 81mg daily for established ASCVD"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Chest pain or pressure",
        "Dyspnea on exertion or at rest",
        "Palpitations or irregular heartbeat",
        "Syncope or near-syncope"
      ],
      right: [
        "Jugular venous distension",
        "Bilateral lower extremity edema",
        "Hepatomegaly with hepatojugular reflux",
        "Abnormal heart sounds (murmur, gallop, rub)"
      ]
    },
    medications: [
      {
        name: "Lisinopril (Zestril/Prinivil)",
        type: "ACE Inhibitor",
        action: "Inhibits ACE converting angiotensin I to II; reduces preload, afterload, and cardiac remodeling",
        sideEffects: "Dry cough (10-15%), hyperkalemia, angioedema (0.1-0.7%), acute kidney injury",
        contra: "History of ACEi angioedema, bilateral renal artery stenosis, pregnancy",
        pearl: "Start 5-10mg daily, titrate to 20-40mg. Check K+ and Cr within 1-2 weeks of initiation."
      },
      {
        name: "Atorvastatin (Lipitor)",
        type: "HMG-CoA Reductase Inhibitor",
        action: "Inhibits cholesterol synthesis, upregulates LDL receptors; pleiotropic anti-inflammatory and plaque-stabilizing effects",
        sideEffects: "Myalgia, elevated transaminases, new-onset diabetes",
        contra: "Active liver disease, pregnancy, unexplained persistent LFT elevation",
        pearl: "High-intensity: 40-80mg daily. Reduces LDL by 50%. Check CK only if symptomatic myopathy."
      }
    ],
    pearls: [
      "Troponin elevation without ACS: consider PE, myocarditis, Takotsubo, renal failure, sepsis",
      "New LBBB + chest pain: treat as STEMI equivalent until proven otherwise",
      "Right-sided MI: volume-dependent; avoid nitrates and diuretics, give IV fluids"
    ],
    quiz: [
      {
        question: "A patient with history of thrombolytics has HR 52, BP 88/54 on metoprolol 100mg BID. Best next step?",
        options: [
          "Increase metoprolol dose",
          "Hold metoprolol and reassess hemodynamics",
          "Add digoxin",
          "Start dobutamine drip"
        ],
        correct: 1,
        rationale: "Symptomatic bradycardia and hypotension suggest beta-blocker excess. Hold the medication and reassess before adjusting."
      }
    ]
  },
  "methotrexate-safety-np": {
    title: "Methotrexate: Molecular Pharmacology",
    cellular: {
      title: "Pharmacology of Methotrexate",
      content: "Methotrexate: Molecular Pharmacology encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to methotrexate."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Methotrexate management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to methotrexate. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "vancomycin-therapy-np": {
    title: "Vancomycin: AUC-Guided Dosing",
    cellular: {
      title: "Pharmacology of Vancomycin",
      content: "Vancomycin: AUC-Guided Dosing encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to vancomycin."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Vancomycin management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to vancomycin. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "insulin-pump-management-np": {
    title: "Insulin Pump: Prescribing",
    cellular: {
      title: "Pharmacology of Insulin Pump",
      content: "Insulin Pump: Prescribing encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to insulin pump."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Insulin Pump management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to insulin pump. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "anticoagulation-therapy-np": {
    title: "Anticoagulation: DOAC Prescribing",
    cellular: {
      title: "Pharmacology of Anticoagulation",
      content: "DOAC reversal: Dabigatran (direct thrombin inhibitor) reversal: idarucizumab (Praxbind) 5g IV. Factor Xa inhibitor (rivaroxaban, apixaban, edoxaban) reversal: andexanet alfa (Andexxa) or 4-factor PCC (Kcentra) 25-50 units/kg if andexanet unavailable. Indications for reversal: life-threatening bleeding, need for emergency surgery. DOACs have predictable pharmacokinetics allowing fixed dosing without routine monitoring. Renal function assessment essential: dabigatran most renally cleared (80%), avoid if CrCl <30."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Anticoagulation management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to anticoagulation. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "opioid-management-np": {
    title: "Opioid Prescribing: MME Calculations",
    cellular: {
      title: "Pharmacology of Opioid Prescribing",
      content: "Opioid Prescribing: MME Calculations encompasses prescriptive authority principles, pharmacokinetic/pharmacodynamic considerations, and safety monitoring specific to opioid prescribing."
    },
    riskFactors: [
      "Polypharmacy (>=5 medications) with drug interaction risk",
      "Renal or hepatic impairment affecting drug metabolism/clearance",
      "Extremes of age (pediatric weight-based dosing, geriatric Beers Criteria)",
      "Pregnancy and lactation (FDA pregnancy categories)",
      "Genetic polymorphisms affecting drug metabolism (CYP2D6, CYP2C19)",
      "Non-adherence to medication regimen",
      "History of adverse drug reactions or drug allergies"
    ],
    diagnostics: [
      "Comprehensive medication reconciliation",
      "Drug level monitoring for narrow therapeutic index medications",
      "Renal function (CrCl/eGFR) for dose adjustments",
      "Hepatic function (Child-Pugh score) for metabolism assessment",
      "CYP enzyme genotyping when pharmacogenomic guidance available",
      "ECG for QTc-prolonging medications",
      "Drug interaction screening with clinical decision support tools"
    ],
    management: [
      "Start low, go slow (especially in elderly and renal/hepatic impairment)",
      "Monitor drug levels for narrow therapeutic index agents (lithium, digoxin, vancomycin, aminoglycosides)",
      "Evidence-based prescribing per current clinical guidelines",
      "Medication reconciliation at every visit and transition of care",
      "Patient education on indication, administration, side effects, and warning signs",
      "Prescription Drug Monitoring Program (PDMP) check for controlled substances",
      "Regular medication review for deprescribing opportunities"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Therapeutic effect assessment",
        "Adverse drug reaction signs",
        "Drug interaction symptoms",
        "Medication non-adherence indicators"
      ],
      right: [
        "Drug level monitoring results",
        "Organ function changes affecting drug handling",
        "ECG changes (QTc prolongation, conduction delays)",
        "Allergic vs pharmacologic adverse reactions"
      ]
    },
    medications: [
      {
        name: "N-Acetylcysteine (Mucomyst/Acetadote)",
        type: "Glutathione Precursor / Antidote",
        action: "Replenishes hepatic glutathione stores, enhancing NAPQI conjugation and detoxification",
        sideEffects: "Nausea, vomiting (oral), anaphylactoid reactions (IV - 10-20%)",
        contra: "No absolute contraindications for acetaminophen toxicity",
        pearl: "IV: 150mg/kg over 1h, 50mg/kg over 4h, 100mg/kg over 16h. Most effective within 8h but give anytime if suspected toxicity. Oral: 140mg/kg loading then 70mg/kg q4h x17 doses."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist",
        action: "Competitive antagonist at mu, kappa, and delta opioid receptors reversing respiratory depression",
        sideEffects: "Acute opioid withdrawal (vomiting, agitation, tachycardia, pulmonary edema), short duration (30-90 min vs opioid)",
        contra: "No absolute contraindications in suspected opioid overdose",
        pearl: "0.4-2mg IV/IM/SC, repeat q2-3min to max 10mg. Intranasal: 4mg per nostril. Duration shorter than most opioids - observe 4h+ and may need repeat dosing or infusion."
      }
    ],
    pearls: [
      "Narrow therapeutic index drugs requiring monitoring: lithium, digoxin, warfarin, vancomycin, aminoglycosides, phenytoin, theophylline",
      "CYP2D6 poor metabolizers: risk of toxicity with codeine (reduced conversion to morphine) and TCAs",
      "Opioid Prescribing management requires understanding of pharmacokinetics, drug interactions, and patient-specific factors"
    ],
    quiz: [
      {
        question: "A patient on multiple medications presents with symptoms suggesting drug toxicity related to opioid prescribing. Priority intervention?",
        options: [
          "Continue all medications and observe",
          "Identify the offending agent, check drug levels, and provide supportive/antidotal care",
          "Add another medication to counteract symptoms",
          "Discharge without medication review"
        ],
        correct: 1,
        rationale: "Identifying the offending agent, checking drug levels when available, and providing appropriate supportive or antidotal care is the priority for suspected drug toxicity."
      }
    ]
  },
  "compartment-np": {
    title: "Compartment Syndrome: Fasciotomy",
    cellular: {
      title: "Pathophysiology of Compartment Syndrome",
      content: "Compartment syndrome occurs when pressure within a closed fascial compartment exceeds perfusion pressure, causing tissue ischemia. Most common: anterior compartment of the lower leg. 6 P's: Pain (out of proportion, with passive stretch), Pressure (tense compartment), Paresthesias, Paralysis (late), Pulselessness (very late), Pallor. Diagnosis: clinical (compartment pressure >30 mmHg or within 30 mmHg of diastolic). Treatment: emergent fasciotomy - delay >6h increases amputation risk and rhabdomyolysis."
    },
    riskFactors: [
      "Polytrauma with multi-organ involvement",
      "Critical illness with systemic inflammatory response",
      "Extremes of age with limited physiologic reserve",
      "Comorbid conditions complicating clinical course",
      "Environmental exposure (heat, cold, altitude, pressure)",
      "Delayed presentation or recognition of emergency",
      "Medication-related complications or toxicity"
    ],
    diagnostics: [
      "Focused primary and secondary survey for trauma",
      "Point-of-care labs (ABG, lactate, glucose, electrolytes)",
      "Bedside ultrasound (FAST, cardiac, lung)",
      "CT imaging for definitive injury characterization",
      "Continuous cardiorespiratory monitoring",
      "Glasgow Coma Scale and pupillary assessment",
      "Toxicology screening when indicated"
    ],
    management: [
      "ABCDE systematic assessment and stabilization",
      "Damage control resuscitation for hemorrhagic shock",
      "Targeted temperature management protocols",
      "Pain management (multimodal, regional anesthesia when possible)",
      "Early mobility and rehabilitation initiation",
      "ICU-level monitoring and organ support",
      "Multidisciplinary team approach for complex patients"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Hemodynamic instability (hypotension, tachycardia)",
        "Respiratory compromise",
        "Altered level of consciousness",
        "Pain disproportionate to apparent injury"
      ],
      right: [
        "Multi-organ dysfunction indicators",
        "Coagulopathy (DIC screening)",
        "Rhabdomyolysis signs (dark urine, elevated CK)",
        "Compartment pressure elevation"
      ]
    },
    medications: [
      {
        name: "Norepinephrine (Levophed)",
        type: "Alpha-1 > Beta-1 Agonist (Vasopressor)",
        action: "Potent alpha-1 vasoconstriction with moderate beta-1 inotropy increasing MAP",
        sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis with extravasation",
        contra: "Hypovolemia (correct volume first), mesenteric ischemia",
        pearl: "First-line vasopressor for septic shock (Surviving Sepsis 2021). Start 0.1-0.5 mcg/kg/min, titrate to MAP >=65. Central line preferred but can start peripherally in emergency. Phentolamine for extravasation."
      },
      {
        name: "Ketamine",
        type: "NMDA Receptor Antagonist",
        action: "Dissociative anesthetic providing analgesia, amnesia, and sedation while maintaining airway reflexes and hemodynamics",
        sideEffects: "Emergence reactions, laryngospasm (rare), hypertension, increased secretions",
        contra: "Severe hypertension, elevated ICP (controversial), psychiatric instability",
        pearl: "Pain: 0.1-0.3mg/kg IV. Procedural sedation: 1-2mg/kg IV. RSI: 1.5-2mg/kg IV. Maintains hemodynamics - ideal for hypotensive patients. Pretreat with midazolam 0.03mg/kg to reduce emergence reactions."
      }
    ],
    pearls: [
      "ABCDE approach: Airway, Breathing, Circulation, Disability, Exposure - systematic assessment saves lives",
      "Damage control resuscitation: permissive hypotension (MAP 50-65 until surgical control), balanced transfusion (1:1:1 PRBC:FFP:platelets), minimize crystalloid",
      "Compartment Syndrome management requires rapid assessment, stabilization, and definitive treatment coordination"
    ],
    quiz: [
      {
        question: "A patient with compartment syndrome arrives with unstable vital signs. Priority intervention?",
        options: [
          "Complete head-to-toe assessment before any intervention",
          "Systematic ABCDE assessment with simultaneous stabilization of life threats",
          "Obtain complete labs before treatment decisions",
          "Transfer to operating room without assessment"
        ],
        correct: 1,
        rationale: "Systematic ABCDE assessment with simultaneous stabilization of identified life threats ensures the most critical issues are addressed first for compartment syndrome."
      }
    ]
  },
  "spinal-cord-injury-np": {
    title: "Spinal Cord Injury: Autonomic Dysreflexia",
    cellular: {
      title: "Pathophysiology of Spinal Cord Injury",
      content: "Spinal Cord Injury: Autonomic Dysreflexia involves disruption of neuronal signaling, neurotransmitter balance, or structural integrity within the central or peripheral nervous system. Spinal Cord Injury pathophysiology encompasses mechanisms including excitotoxicity, demyelination, ischemic injury, and neurodegeneration."
    },
    riskFactors: [
      "Hypertension (leading modifiable risk for stroke)",
      "Occupational toxin exposure (heavy metals, organophosphates)",
      "Chronic migraine with aura (increased stroke risk in women on OCPs)",
      "Chronic alcohol use with neurotoxicity",
      "Family history of neurological disease (first-degree relative)",
      "Tobacco use with cerebrovascular disease risk",
      "Prior head trauma or TBI history"
    ],
    diagnostics: [
      "MRI brain with/without gadolinium (ischemia, demyelination, tumors)",
      "Specific autoantibody panels (AChR, anti-MOG, anti-NMDA receptor)",
      "Visual field testing and fundoscopic exam for papilledema",
      "EEG for seizure characterization and localization",
      "CT angiography of head and neck (vessel occlusion, aneurysm, dissection)",
      "NIH Stroke Scale (NIHSS) for stroke severity quantification",
      "Lumbar puncture with CSF analysis (cell count, protein, glucose, cultures, oligoclonal bands)"
    ],
    management: [
      "Mechanical thrombectomy within 24 hours for large vessel occlusion (DAWN/DEFUSE 3)",
      "Seizure precautions and driving restriction counseling",
      "Neurosurgical consultation for mass lesions, hemorrhage, or hydrocephalus",
      "Osmotic therapy (mannitol 20% or hypertonic saline 3%) for cerebral edema",
      "Antiepileptic drug monotherapy: levetiracetam, lamotrigine, or valproate",
      "Dopaminergic therapy (carbidopa-levodopa) for Parkinson disease motor symptoms",
      "Blood pressure management per AHA stroke guidelines"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Headache (characterize quality, location, temporal pattern)",
        "Altered consciousness or cognition",
        "Focal motor or sensory deficits",
        "Visual changes or diplopia"
      ],
      right: [
        "Pupil abnormalities (size, reactivity, anisocoria)",
        "Motor findings: weakness, spasticity, rigidity, tremor, ataxia",
        "Sensory findings: numbness, paresthesias, proprioceptive loss",
        "Upper motor neuron signs: hyperreflexia, Babinski, clonus"
      ]
    },
    medications: [
      {
        name: "Carbidopa-Levodopa (Sinemet)",
        type: "Dopamine Precursor",
        action: "Levodopa crosses BBB and converts to dopamine; carbidopa prevents peripheral decarboxylation",
        sideEffects: "Dyskinesias, wearing-off, orthostatic hypotension, hallucinations, impulse control disorders",
        contra: "Concurrent non-selective MAOi, narrow-angle glaucoma",
        pearl: "Start 25/100mg TID. Protein competes for absorption. Watch for wearing-off at 3-5 years (honeymoon period)."
      },
      {
        name: "Alteplase (tPA/Activase)",
        type: "Tissue Plasminogen Activator",
        action: "Converts plasminogen to plasmin dissolving fibrin clots and restoring cerebral perfusion",
        sideEffects: "Intracranial hemorrhage (6.4%), systemic bleeding, angioedema",
        contra: "Active bleeding, recent surgery <14 days, INR >1.7, platelets <100K, BP >185/110 despite treatment",
        pearl: "Dose: 0.9mg/kg (max 90mg), 10% bolus + 60min infusion. Door-to-needle <60 min. Tenecteplase emerging alternative."
      }
    ],
    pearls: [
      "Systematic neurological exam includes cranial nerves, motor, sensory, reflexes, coordination, gait assessment",
      "Time-sensitive neurological emergencies: stroke (<4.5h tPA), status epilepticus, bacterial meningitis, cord compression",
      "Spinal Cord Injury requires integration of history, exam, and targeted diagnostic studies for accurate management"
    ],
    quiz: [
      {
        question: "A patient presents with acute neurological symptoms consistent with spinal cord injury. Most critical initial action?",
        options: [
          "Schedule outpatient neurology follow-up",
          "Rapid neurological assessment with emergent imaging",
          "Start empiric anticonvulsant without evaluation",
          "Discharge with symptom monitoring instructions"
        ],
        correct: 1,
        rationale: "Acute neurological symptoms require immediate assessment and imaging to identify time-sensitive conditions and guide management for spinal cord injury."
      }
    ]
  },
  "rib-fractures-np": {
    title: "Rib Fractures: Flail Chest",
    cellular: {
      title: "Pathophysiology of Rib Fractures",
      content: "Rib fractures: most common thoracic injury. Complications: pneumothorax, hemothorax, pulmonary contusion, splenic/hepatic laceration. Flail chest: >=3 contiguous ribs fractured in >=2 places creating paradoxical chest wall motion. Management: multimodal analgesia (regional anesthesia preferred: paravertebral or epidural block), incentive spirometry q1h, early mobilization. Avoid over-sedation. Surgical rib fixation for flail chest improves outcomes (shorter ventilator days, decreased pneumonia, mortality)."
    },
    riskFactors: [
      "Polytrauma with multi-organ involvement",
      "Critical illness with systemic inflammatory response",
      "Extremes of age with limited physiologic reserve",
      "Comorbid conditions complicating clinical course",
      "Environmental exposure (heat, cold, altitude, pressure)",
      "Delayed presentation or recognition of emergency",
      "Medication-related complications or toxicity"
    ],
    diagnostics: [
      "Focused primary and secondary survey for trauma",
      "Point-of-care labs (ABG, lactate, glucose, electrolytes)",
      "Bedside ultrasound (FAST, cardiac, lung)",
      "CT imaging for definitive injury characterization",
      "Continuous cardiorespiratory monitoring",
      "Glasgow Coma Scale and pupillary assessment",
      "Toxicology screening when indicated"
    ],
    management: [
      "ABCDE systematic assessment and stabilization",
      "Damage control resuscitation for hemorrhagic shock",
      "Targeted temperature management protocols",
      "Pain management (multimodal, regional anesthesia when possible)",
      "Early mobility and rehabilitation initiation",
      "ICU-level monitoring and organ support",
      "Multidisciplinary team approach for complex patients"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Hemodynamic instability (hypotension, tachycardia)",
        "Respiratory compromise",
        "Altered level of consciousness",
        "Pain disproportionate to apparent injury"
      ],
      right: [
        "Multi-organ dysfunction indicators",
        "Coagulopathy (DIC screening)",
        "Rhabdomyolysis signs (dark urine, elevated CK)",
        "Compartment pressure elevation"
      ]
    },
    medications: [
      {
        name: "Norepinephrine (Levophed)",
        type: "Alpha-1 > Beta-1 Agonist (Vasopressor)",
        action: "Potent alpha-1 vasoconstriction with moderate beta-1 inotropy increasing MAP",
        sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis with extravasation",
        contra: "Hypovolemia (correct volume first), mesenteric ischemia",
        pearl: "First-line vasopressor for septic shock (Surviving Sepsis 2021). Start 0.1-0.5 mcg/kg/min, titrate to MAP >=65. Central line preferred but can start peripherally in emergency. Phentolamine for extravasation."
      },
      {
        name: "Ketamine",
        type: "NMDA Receptor Antagonist",
        action: "Dissociative anesthetic providing analgesia, amnesia, and sedation while maintaining airway reflexes and hemodynamics",
        sideEffects: "Emergence reactions, laryngospasm (rare), hypertension, increased secretions",
        contra: "Severe hypertension, elevated ICP (controversial), psychiatric instability",
        pearl: "Pain: 0.1-0.3mg/kg IV. Procedural sedation: 1-2mg/kg IV. RSI: 1.5-2mg/kg IV. Maintains hemodynamics - ideal for hypotensive patients. Pretreat with midazolam 0.03mg/kg to reduce emergence reactions."
      }
    ],
    pearls: [
      "ABCDE approach: Airway, Breathing, Circulation, Disability, Exposure - systematic assessment saves lives",
      "Damage control resuscitation: permissive hypotension (MAP 50-65 until surgical control), balanced transfusion (1:1:1 PRBC:FFP:platelets), minimize crystalloid",
      "Rib Fractures management requires rapid assessment, stabilization, and definitive treatment coordination"
    ],
    quiz: [
      {
        question: "A patient with rib fractures arrives with unstable vital signs. Priority intervention?",
        options: [
          "Complete head-to-toe assessment before any intervention",
          "Systematic ABCDE assessment with simultaneous stabilization of life threats",
          "Obtain complete labs before treatment decisions",
          "Transfer to operating room without assessment"
        ],
        correct: 1,
        rationale: "Systematic ABCDE assessment with simultaneous stabilization of identified life threats ensures the most critical issues are addressed first for rib fractures."
      }
    ]
  },
  "gout-management-np": {
    title: "Gout",
    cellular: {
      title: "Pathophysiology of Gout",
      content: "Gout results from MSU crystal deposition when urate >6.8 mg/dL. NLRP3 inflammasome activation triggers IL-1-beta release causing intense inflammatory response. Acute: colchicine within 36h, NSAIDs, or corticosteroids. ULT with allopurinol (start 100mg, titrate to target urate <6 mg/dL) with colchicine prophylaxis for 3-6 months during initiation."
    },
    riskFactors: [
      "Obesity with mechanical joint stress and inflammatory adipokines",
      "Environmental triggers (silica exposure, infections, UV light)",
      "Chronic infections triggering reactive arthritis",
      "Prior joint trauma or overuse",
      "Vitamin D deficiency associated with autoimmune disease risk",
      "Medication-induced lupus (hydralazine, procainamide, isoniazid)",
      "Genetic predisposition (HLA-B27 for AS, HLA-DR4 for RA)"
    ],
    diagnostics: [
      "Rheumatoid factor and anti-CCP antibodies for RA",
      "Uric acid level (not diagnostic during acute gout flare)",
      "ESR and CRP for inflammatory activity monitoring",
      "ANCA panel (c-ANCA/PR3, p-ANCA/MPO) for vasculitis evaluation",
      "Dual-energy CT for tophaceous gout diagnosis",
      "X-ray of affected joints (erosions, joint space narrowing, calcifications)",
      "MRI for early erosive disease detection before X-ray changes"
    ],
    management: [
      "Hydroxychloroquine 200-400mg daily for SLE (retinal screening annually)",
      "Regular monitoring: CBC, LFTs, Cr for DMARD toxicity",
      "Colchicine 0.6mg BID for acute gout (within 36h of onset)",
      "Cyclophosphamide for severe lupus nephritis (class III/IV) or vasculitis",
      "Bone density screening for chronic corticosteroid use",
      "Physical therapy and joint protection strategies",
      "Belimumab or mycophenolate for lupus nephritis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Joint pain, swelling, morning stiffness >30 minutes",
        "Symmetric polyarthritis (RA) vs asymmetric monoarthritis (gout, septic)",
        "Skin manifestations (malar rash, purpura, rheumatoid nodules)",
        "Fatigue and constitutional symptoms"
      ],
      right: [
        "Extra-articular features (lung, kidney, eye involvement)",
        "Joint deformities (swan neck, boutonniere, ulnar deviation)",
        "Elevated inflammatory markers (ESR, CRP)",
        "Positive autoantibodies (ANA, RF, anti-CCP, ANCA)"
      ]
    },
    medications: [
      {
        name: "Adalimumab (Humira)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and transmembrane TNF-alpha blocking inflammatory signaling cascade",
        sideEffects: "Injection site reactions, serious infections, TB reactivation, demyelination, lymphoma",
        contra: "Active serious infection, untreated latent TB, decompensated HF (NYHA III/IV)",
        pearl: "40mg SC every 2 weeks. Screen for TB (QuantiFERON), Hep B, C before starting. Often combined with methotrexate for enhanced efficacy."
      },
      {
        name: "Colchicine (Colcrys)",
        type: "Anti-inflammatory (Tubulin Inhibitor)",
        action: "Inhibits tubulin polymerization disrupting inflammasome assembly, neutrophil chemotaxis, and IL-1beta release",
        sideEffects: "Diarrhea, nausea, vomiting, myelosuppression (rare, dose-related)",
        contra: "Severe renal (reduce dose) or hepatic impairment with concurrent CYP3A4/P-gp inhibitors",
        pearl: "Acute gout: 1.2mg then 0.6mg 1h later (within 36h onset). Prophylaxis: 0.6mg daily-BID. Low-dose is as effective and better tolerated than high-dose."
      }
    ],
    pearls: [
      "Morning stiffness >30-60 min = inflammatory arthritis vs OA (<30 min, improves with activity)",
      "Methotrexate requires folic acid co-prescription, CBC/LFT monitoring, and contraception counseling",
      "Gout diagnosis requires integration of clinical presentation, labs, imaging, and often rheumatology consultation"
    ],
    quiz: [
      {
        question: "A patient with suspected gout has joint pain and swelling. Most important next step?",
        options: [
          "Start empiric NSAIDs only",
          "Joint aspiration with synovial fluid analysis plus targeted serologic workup",
          "Immediate high-dose steroids without diagnosis",
          "CT scan of all joints"
        ],
        correct: 1,
        rationale: "Joint aspiration with synovial fluid analysis differentiates infectious, crystal, and inflammatory arthropathies, while targeted serology helps confirm the specific diagnosis of gout."
      }
    ]
  },
  "osteoporosis-management-np": {
    title: "Osteoporosis",
    cellular: {
      title: "Pathophysiology of Osteoporosis",
      content: "Osteoporosis involves imbalanced bone remodeling with osteoclast resorption exceeding osteoblast formation. DEXA T-score: normal (>-1), osteopenia (-1 to -2.5), osteoporosis (=<-2.5). FRAX calculator estimates 10-year fracture probability. Treatment threshold: T-score =<-2.5 or FRAX hip fracture >=3% or major osteoporotic fracture >=20%. First-line: oral bisphosphonates (alendronate 70mg weekly, risedronate 35mg weekly). Alternative: denosumab (RANKL inhibitor) 60mg SC q6 months. Teriparatide (PTH analog) for severe osteoporosis or bisphosphonate failure. Calcium 1200mg + vitamin D 800-1000 IU daily. Fall prevention strategies."
    },
    riskFactors: [
      "Condition-specific predisposing factors for osteoporosis",
      "Genetic and hereditary disease predisposition",
      "Age-related physiological changes",
      "Comorbid conditions affecting disease course",
      "Environmental and occupational exposures",
      "Medication-related complications",
      "Psychosocial factors and health disparities"
    ],
    diagnostics: [
      "Focused history and examination for osteoporosis",
      "Condition-specific laboratory studies",
      "Imaging appropriate to clinical presentation",
      "Validated clinical decision tools and scoring systems",
      "Specialty consultation when indicated",
      "Genetic testing for hereditary conditions",
      "Monitoring studies for treatment response assessment"
    ],
    management: [
      "Evidence-based first-line therapy for osteoporosis",
      "Guideline-concordant management approach",
      "Patient education and self-management support",
      "Monitoring and follow-up plan",
      "Specialist referral when complexity exceeds primary care scope",
      "Comorbidity management and risk factor modification",
      "Care coordination across healthcare settings"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Primary presenting symptoms of osteoporosis",
        "Associated symptom constellation",
        "Functional impact assessment",
        "Symptom progression timeline"
      ],
      right: [
        "Physical examination findings specific to osteoporosis",
        "Vital sign changes",
        "Laboratory abnormalities",
        "Imaging or diagnostic test findings"
      ]
    },
    medications: [
      {
        name: "Condition-Specific First-Line Agent",
        type: "Pharmacotherapy",
        action: "Evidence-based mechanism targeting primary pathophysiology of osteoporosis",
        sideEffects: "Class-specific adverse effects requiring monitoring",
        contra: "Absolute and relative contraindications per drug labeling",
        pearl: "Follow current clinical guidelines for osteoporosis. Start low, go slow in elderly. Monitor renal and hepatic function. Check for drug interactions."
      },
      {
        name: "Adjunctive Therapy",
        type: "Supportive Care",
        action: "Complementary mechanism addressing secondary pathophysiology or symptom management",
        sideEffects: "Additive side effects with primary therapy",
        contra: "Drug interactions with first-line agent",
        pearl: "Multimodal approach often provides better outcomes than monotherapy. Consider non-pharmacologic interventions: physical therapy, lifestyle modification, psychological support."
      }
    ],
    pearls: [
      "Osteoporosis requires thorough evaluation including history, examination, and targeted diagnostic testing",
      "Evidence-based guidelines should direct management with individualized patient considerations",
      "Multidisciplinary approach optimizes outcomes for complex presentations of osteoporosis"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with osteoporosis. What is the most important initial step?",
        options: [
          "Empiric treatment without evaluation",
          "Systematic history, examination, and targeted diagnostic evaluation",
          "Immediate specialist referral without assessment",
          "Observation only with no follow-up plan"
        ],
        correct: 1,
        rationale: "Systematic evaluation with focused history, examination, and targeted diagnostics guides accurate diagnosis and evidence-based management for osteoporosis."
      }
    ]
  },
  "compartment-syndrome-np": {
    title: "Compartment Syndrome",
    cellular: {
      title: "Pathophysiology of Compartment Syndrome",
      content: "Compartment syndrome occurs when pressure within a closed fascial compartment exceeds perfusion pressure, causing tissue ischemia. Most common: anterior compartment of the lower leg. 6 P's: Pain (out of proportion, with passive stretch), Pressure (tense compartment), Paresthesias, Paralysis (late), Pulselessness (very late), Pallor. Diagnosis: clinical (compartment pressure >30 mmHg or within 30 mmHg of diastolic). Treatment: emergent fasciotomy - delay >6h increases amputation risk and rhabdomyolysis."
    },
    riskFactors: [
      "Polytrauma with multi-organ involvement",
      "Critical illness with systemic inflammatory response",
      "Extremes of age with limited physiologic reserve",
      "Comorbid conditions complicating clinical course",
      "Environmental exposure (heat, cold, altitude, pressure)",
      "Delayed presentation or recognition of emergency",
      "Medication-related complications or toxicity"
    ],
    diagnostics: [
      "Focused primary and secondary survey for trauma",
      "Point-of-care labs (ABG, lactate, glucose, electrolytes)",
      "Bedside ultrasound (FAST, cardiac, lung)",
      "CT imaging for definitive injury characterization",
      "Continuous cardiorespiratory monitoring",
      "Glasgow Coma Scale and pupillary assessment",
      "Toxicology screening when indicated"
    ],
    management: [
      "ABCDE systematic assessment and stabilization",
      "Damage control resuscitation for hemorrhagic shock",
      "Targeted temperature management protocols",
      "Pain management (multimodal, regional anesthesia when possible)",
      "Early mobility and rehabilitation initiation",
      "ICU-level monitoring and organ support",
      "Multidisciplinary team approach for complex patients"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Hemodynamic instability (hypotension, tachycardia)",
        "Respiratory compromise",
        "Altered level of consciousness",
        "Pain disproportionate to apparent injury"
      ],
      right: [
        "Multi-organ dysfunction indicators",
        "Coagulopathy (DIC screening)",
        "Rhabdomyolysis signs (dark urine, elevated CK)",
        "Compartment pressure elevation"
      ]
    },
    medications: [
      {
        name: "Norepinephrine (Levophed)",
        type: "Alpha-1 > Beta-1 Agonist (Vasopressor)",
        action: "Potent alpha-1 vasoconstriction with moderate beta-1 inotropy increasing MAP",
        sideEffects: "Peripheral ischemia, arrhythmias, tissue necrosis with extravasation",
        contra: "Hypovolemia (correct volume first), mesenteric ischemia",
        pearl: "First-line vasopressor for septic shock (Surviving Sepsis 2021). Start 0.1-0.5 mcg/kg/min, titrate to MAP >=65. Central line preferred but can start peripherally in emergency. Phentolamine for extravasation."
      },
      {
        name: "Ketamine",
        type: "NMDA Receptor Antagonist",
        action: "Dissociative anesthetic providing analgesia, amnesia, and sedation while maintaining airway reflexes and hemodynamics",
        sideEffects: "Emergence reactions, laryngospasm (rare), hypertension, increased secretions",
        contra: "Severe hypertension, elevated ICP (controversial), psychiatric instability",
        pearl: "Pain: 0.1-0.3mg/kg IV. Procedural sedation: 1-2mg/kg IV. RSI: 1.5-2mg/kg IV. Maintains hemodynamics - ideal for hypotensive patients. Pretreat with midazolam 0.03mg/kg to reduce emergence reactions."
      }
    ],
    pearls: [
      "ABCDE approach: Airway, Breathing, Circulation, Disability, Exposure - systematic assessment saves lives",
      "Damage control resuscitation: permissive hypotension (MAP 50-65 until surgical control), balanced transfusion (1:1:1 PRBC:FFP:platelets), minimize crystalloid",
      "Compartment Syndrome management requires rapid assessment, stabilization, and definitive treatment coordination"
    ],
    quiz: [
      {
        question: "A patient with compartment syndrome arrives with unstable vital signs. Priority intervention?",
        options: [
          "Complete head-to-toe assessment before any intervention",
          "Systematic ABCDE assessment with simultaneous stabilization of life threats",
          "Obtain complete labs before treatment decisions",
          "Transfer to operating room without assessment"
        ],
        correct: 1,
        rationale: "Systematic ABCDE assessment with simultaneous stabilization of identified life threats ensures the most critical issues are addressed first for compartment syndrome."
      }
    ]
  },
  "rheumatoid-arthritis-np": {
    title: "Rheumatoid Arthritis",
    cellular: {
      title: "Pathophysiology of Rheumatoid Arthritis",
      content: "RA is chronic symmetric polyarthritis driven by anti-citrullinated protein antibodies (anti-CCP) and RF. TNF-alpha, IL-1, IL-6 drive synovial inflammation and pannus formation causing cartilage and bone erosion. Early DMARD initiation (methotrexate first-line within 3 months of symptom onset) prevents erosive damage. Treat-to-target strategy aims for remission or low disease activity."
    },
    riskFactors: [
      "Age 30-50 for RA onset; 15-45 for SLE onset",
      "Smoking (strongest environmental risk for RA, dose-dependent)",
      "Prior joint trauma or overuse",
      "Obesity with mechanical joint stress and inflammatory adipokines",
      "Medication-induced lupus (hydralazine, procainamide, isoniazid)",
      "Chronic infections triggering reactive arthritis",
      "Female sex (SLE, RA, Sjogren: 9:1 female predominance)"
    ],
    diagnostics: [
      "CBC (cytopenias in SLE), CMP, urinalysis (lupus nephritis)",
      "ANA with reflex to specific antibodies (anti-dsDNA, anti-Smith, anti-SSA/SSB)",
      "Complement levels (C3, C4: decreased in active SLE)",
      "Dual-energy CT for tophaceous gout diagnosis",
      "Rheumatoid factor and anti-CCP antibodies for RA",
      "Synovial fluid analysis: WBC count, culture, crystal examination",
      "ANCA panel (c-ANCA/PR3, p-ANCA/MPO) for vasculitis evaluation"
    ],
    management: [
      "Allopurinol for chronic gout (target uric acid <6 mg/dL)",
      "Methotrexate as anchor DMARD for RA (start 15mg/week, max 25mg/week)",
      "Prednisone for acute flares with rapid taper (bridge to DMARD effect)",
      "Bone density screening for chronic corticosteroid use",
      "Hydroxychloroquine 200-400mg daily for SLE (retinal screening annually)",
      "Rituximab for refractory RA or ANCA vasculitis",
      "Cyclophosphamide for severe lupus nephritis (class III/IV) or vasculitis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Joint pain, swelling, morning stiffness >30 minutes",
        "Symmetric polyarthritis (RA) vs asymmetric monoarthritis (gout, septic)",
        "Skin manifestations (malar rash, purpura, rheumatoid nodules)",
        "Fatigue and constitutional symptoms"
      ],
      right: [
        "Extra-articular features (lung, kidney, eye involvement)",
        "Joint deformities (swan neck, boutonniere, ulnar deviation)",
        "Elevated inflammatory markers (ESR, CRP)",
        "Positive autoantibodies (ANA, RF, anti-CCP, ANCA)"
      ]
    },
    medications: [
      {
        name: "Methotrexate",
        type: "Conventional DMARD (Folate Antagonist)",
        action: "Inhibits dihydrofolate reductase and AICAR transformylase; anti-inflammatory via adenosine pathway",
        sideEffects: "Hepatotoxicity, myelosuppression, stomatitis, pneumonitis, teratogenicity",
        contra: "Pregnancy (category X), severe hepatic/renal disease, immunodeficiency, pre-existing blood dyscrasias",
        pearl: "Start 15mg PO/SC weekly with folic acid 1mg daily (reduces side effects). Check CBC, LFTs at baseline, 4 weeks, then q3 months. Takes 6-12 weeks for full effect."
      },
      {
        name: "Adalimumab (Humira)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and transmembrane TNF-alpha blocking inflammatory signaling cascade",
        sideEffects: "Injection site reactions, serious infections, TB reactivation, demyelination, lymphoma",
        contra: "Active serious infection, untreated latent TB, decompensated HF (NYHA III/IV)",
        pearl: "40mg SC every 2 weeks. Screen for TB (QuantiFERON), Hep B, C before starting. Often combined with methotrexate for enhanced efficacy."
      }
    ],
    pearls: [
      "Morning stiffness >30-60 min = inflammatory arthritis vs OA (<30 min, improves with activity)",
      "Methotrexate requires folic acid co-prescription, CBC/LFT monitoring, and contraception counseling",
      "Rheumatoid Arthritis diagnosis requires integration of clinical presentation, labs, imaging, and often rheumatology consultation"
    ],
    quiz: [
      {
        question: "A patient with suspected rheumatoid arthritis has joint pain and swelling. Most important next step?",
        options: [
          "Start empiric NSAIDs only",
          "Joint aspiration with synovial fluid analysis plus targeted serologic workup",
          "Immediate high-dose steroids without diagnosis",
          "CT scan of all joints"
        ],
        correct: 1,
        rationale: "Joint aspiration with synovial fluid analysis differentiates infectious, crystal, and inflammatory arthropathies, while targeted serology helps confirm the specific diagnosis of rheumatoid arthritis."
      }
    ]
  },
  "cirrhosis-management-np": {
    title: "Cirrhosis: Child-Pugh & MELD Scoring",
    cellular: {
      title: "Pathophysiology of Cirrhosis",
      content: "Cirrhosis: Child-Pugh & MELD Scoring involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Cirrhosis pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "Celiac disease genetic predisposition (HLA-DQ2/DQ8)",
      "Family history of GI malignancy (first-degree relative)",
      "Alcohol use disorder with chronic mucosal injury",
      "Age >65 with declining mucosal defenses",
      "Immunosuppression increasing infectious GI complications",
      "Prior abdominal surgery with adhesion formation",
      "Chronic liver disease with portal hypertension"
    ],
    diagnostics: [
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "MRCP for biliary and pancreatic duct evaluation",
      "RUQ ultrasound for gallbladder and hepatic assessment",
      "ERCP for therapeutic biliary/pancreatic duct intervention",
      "Capsule endoscopy for obscure small bowel bleeding",
      "Colonoscopy with polypectomy for lower GI assessment",
      "Abdominal X-ray: obstruction, free air, calcifications"
    ],
    management: [
      "TIPS procedure for refractory variceal bleeding or ascites",
      "Anti-TNF therapy (infliximab, adalimumab) for moderate-severe IBD",
      "Octreotide 50mcg IV bolus then 50mcg/hr for variceal bleeding",
      "Nutritional support: enteral preferred over parenteral when feasible",
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days",
      "Surgical consultation for acute abdomen with peritoneal signs"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to cirrhosis)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+-ATPase on parietal cell, reducing gastric acid secretion by >95%",
        sideEffects: "C. diff risk, hypomagnesemia, B12 deficiency, bone fractures with chronic use",
        contra: "Known PPI hypersensitivity, concurrent rilpivirine",
        pearl: "Take 30-60 min before meals. Reassess need at 8 weeks. Long-term risks: hip fracture, C. diff, kidney disease."
      },
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia Reducer",
        action: "Colonic bacteria metabolize to organic acids trapping ammonia as NH4+ for fecal excretion",
        sideEffects: "Bloating, flatulence, diarrhea, electrolyte imbalance",
        contra: "Galactosemia",
        pearl: "Titrate to 2-3 soft stools/day. Add rifaximin 550mg BID for lactulose non-responders in hepatic encephalopathy."
      }
    ],
    pearls: [
      "Cirrhosis evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of cirrhosis"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with cirrhosis. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for cirrhosis."
      }
    ]
  },
  "hepatic-encephalopathy-np": {
    title: "Hepatic Encephalopathy: Ammonia & Lactulose",
    cellular: {
      title: "Pathophysiology of Hepatic Encephalopathy",
      content: "Hepatic Encephalopathy: Ammonia & Lactulose involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Hepatic Encephalopathy pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "IBD family history (10-25% have affected first-degree relative)",
      "Obesity (BMI >30) increasing intra-abdominal pressure",
      "NSAID use >2 weeks without gastroprotection",
      "Tobacco use (impairs mucosal healing)",
      "History of C. difficile infection (recurrence risk 20%)",
      "Family history of GI malignancy (first-degree relative)",
      "Prior abdominal surgery with adhesion formation"
    ],
    diagnostics: [
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology",
      "MRCP for biliary and pancreatic duct evaluation",
      "Abdominal X-ray: obstruction, free air, calcifications",
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "EGD with biopsy for upper GI pathology evaluation",
      "Capsule endoscopy for obscure small bowel bleeding"
    ],
    management: [
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "Mesalamine (5-ASA) for mild-moderate ulcerative colitis",
      "Anti-TNF therapy (infliximab, adalimumab) for moderate-severe IBD",
      "Surgical consultation for acute abdomen with peritoneal signs",
      "TIPS procedure for refractory variceal bleeding or ascites",
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to hepatic encephalopathy)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      },
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      }
    ],
    pearls: [
      "Hepatic Encephalopathy evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of hepatic encephalopathy"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with hepatic encephalopathy. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for hepatic encephalopathy."
      }
    ]
  },
  "gi-bleed-management-np": {
    title: "GI Bleed: Upper vs Lower & Resuscitation",
    cellular: {
      title: "Pathophysiology of GI Bleed",
      content: "GI Bleed: Upper vs Lower & Resuscitation involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. GI Bleed pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "High-fat diet with cholelithiasis predisposition",
      "Tobacco use (impairs mucosal healing)",
      "Radiation therapy to abdomen causing enteritis",
      "NSAID use >2 weeks without gastroprotection",
      "Diabetes with gastroparesis and motility dysfunction",
      "Age >65 with declining mucosal defenses",
      "Obesity (BMI >30) increasing intra-abdominal pressure"
    ],
    diagnostics: [
      "Lipase (preferred over amylase for pancreatic evaluation)",
      "Abdominal X-ray: obstruction, free air, calcifications",
      "ERCP for therapeutic biliary/pancreatic duct intervention",
      "MRCP for biliary and pancreatic duct evaluation",
      "H. pylori testing: urea breath test, stool antigen, or biopsy",
      "Stool studies: calprotectin, C. diff toxin, O&P, culture",
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology"
    ],
    management: [
      "Lactulose 15-30mL BID-TID for hepatic encephalopathy",
      "Surgical consultation for acute abdomen with peritoneal signs",
      "Nutritional support: enteral preferred over parenteral when feasible",
      "Anti-TNF therapy (infliximab, adalimumab) for moderate-severe IBD",
      "Ursodiol 13-15mg/kg/day for primary biliary cholangitis",
      "Gluten-free diet (lifelong) for confirmed celiac disease",
      "Mesalamine (5-ASA) for mild-moderate ulcerative colitis"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to gi bleed)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      },
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      }
    ],
    pearls: [
      "GI Bleed evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of gi bleed"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with gi bleed. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for gi bleed."
      }
    ]
  },
  "ibd-advanced-np": {
    title: "IBD: Crohn's vs UC Advanced Management",
    cellular: {
      title: "Pathophysiology of IBD",
      content: "Crohn disease involves transmural granulomatous inflammation affecting any GI segment (terminal ileum most common). Skip lesions, cobblestone mucosa, and non-caseating granulomas are characteristic. Driven by Th1/Th17 cytokine imbalance (TNF-alpha, IL-12, IL-23). Complications: strictures, fistulae, abscesses. Treat with corticosteroids for induction, then maintenance with immunomodulators (azathioprine) or biologics (anti-TNF, anti-IL-12/23)."
    },
    riskFactors: [
      "Diabetes with gastroparesis and motility dysfunction",
      "Radiation therapy to abdomen causing enteritis",
      "IBD family history (10-25% have affected first-degree relative)",
      "Hepatitis B/C viral infection with cirrhosis progression",
      "Obesity (BMI >30) increasing intra-abdominal pressure",
      "H. pylori infection (most common cause of PUD worldwide)",
      "NSAID use >2 weeks without gastroprotection"
    ],
    diagnostics: [
      "Anti-tTG IgA with total IgA for celiac disease screening",
      "H. pylori testing: urea breath test, stool antigen, or biopsy",
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology",
      "Capsule endoscopy for obscure small bowel bleeding",
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "ERCP for therapeutic biliary/pancreatic duct intervention",
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)"
    ],
    management: [
      "Cholecystectomy for symptomatic cholelithiasis",
      "Ursodiol 13-15mg/kg/day for primary biliary cholangitis",
      "Mesalamine (5-ASA) for mild-moderate ulcerative colitis",
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "Nutritional support: enteral preferred over parenteral when feasible",
      "TIPS procedure for refractory variceal bleeding or ascites"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to ibd)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      },
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      }
    ],
    pearls: [
      "IBD evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of ibd"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with ibd. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for ibd."
      }
    ]
  },
  "cholecystitis-np": {
    title: "Cholecystitis",
    cellular: {
      title: "Pathophysiology of Cholecystitis",
      content: "Cholecystitis involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Cholecystitis pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "High-fat diet with cholelithiasis predisposition",
      "Tobacco use (impairs mucosal healing)",
      "Radiation therapy to abdomen causing enteritis",
      "NSAID use >2 weeks without gastroprotection",
      "Diabetes with gastroparesis and motility dysfunction",
      "Age >65 with declining mucosal defenses",
      "Obesity (BMI >30) increasing intra-abdominal pressure"
    ],
    diagnostics: [
      "Abdominal X-ray: obstruction, free air, calcifications",
      "Stool studies: calprotectin, C. diff toxin, O&P, culture",
      "Anti-tTG IgA with total IgA for celiac disease screening",
      "Colonoscopy with polypectomy for lower GI assessment",
      "ERCP for therapeutic biliary/pancreatic duct intervention",
      "Lipase (preferred over amylase for pancreatic evaluation)",
      "EGD with biopsy for upper GI pathology evaluation"
    ],
    management: [
      "Surgical consultation for acute abdomen with peritoneal signs",
      "Gluten-free diet (lifelong) for confirmed celiac disease",
      "Cholecystectomy for symptomatic cholelithiasis",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days",
      "Nutritional support: enteral preferred over parenteral when feasible",
      "Lactulose 15-30mL BID-TID for hepatic encephalopathy",
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to cholecystitis)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      },
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      }
    ],
    pearls: [
      "Cholecystitis evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of cholecystitis"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with cholecystitis. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for cholecystitis."
      }
    ]
  },
  "appendicitis-np": {
    title: "Appendicitis",
    cellular: {
      title: "Pathophysiology of Appendicitis",
      content: "DIC involves systemic activation of coagulation with simultaneous consumption of clotting factors and platelets causing both microvascular thrombosis and hemorrhage. Triggers: sepsis, trauma, malignancy, obstetric complications. Labs: prolonged PT/aPTT, low fibrinogen (<100), elevated D-dimer, thrombocytopenia, schistocytes on smear. Treatment: treat underlying cause, replace with FFP/cryo/platelets if bleeding, heparin only if thrombosis predominates."
    },
    riskFactors: [
      "B12 or folate deficiency (vegans, malabsorption, metformin use)",
      "Antiphospholipid syndrome with thrombotic risk",
      "Chronic kidney disease with decreased erythropoietin",
      "Recent surgery or trauma with blood loss",
      "Iron deficiency (most common cause of anemia worldwide)",
      "Autoimmune conditions (ITP, AIHA, TTP-HUS)",
      "Liver disease with coagulopathy and thrombocytopenia"
    ],
    diagnostics: [
      "Iron studies: serum iron, TIBC, ferritin, transferrin saturation",
      "Flow cytometry for leukemia/lymphoma immunophenotyping",
      "B12 and folate levels (methylmalonic acid if B12 borderline)",
      "Bone marrow biopsy for unexplained cytopenias or suspected malignancy",
      "CBC with differential and peripheral blood smear review",
      "Direct antiglobulin test (Coombs) for autoimmune hemolytic anemia",
      "Haptoglobin (decreased in hemolysis), LDH (elevated in hemolysis)"
    ],
    management: [
      "B12 supplementation: 1000mcg IM monthly or 1000-2000mcg PO daily",
      "Hematology referral for unexplained cytopenias or suspected malignancy",
      "Folate supplementation: 1mg PO daily",
      "FFP or PCC for urgent warfarin reversal with active bleeding",
      "Oral iron replacement: ferrous sulfate 325mg (65mg elemental) daily on empty stomach",
      "Steroids (prednisone 1mg/kg) for autoimmune cytopenias (ITP, AIHA)",
      "IVIG for severe ITP with active bleeding or preprocedural"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Fatigue, weakness, exercise intolerance, pallor",
        "Easy bruising and petechiae",
        "Bleeding (mucosal, GI, menorrhagia)",
        "Exertional dyspnea and tachycardia"
      ],
      right: [
        "Microcytic anemia: MCV <80 (iron deficiency, thalassemia)",
        "Macrocytic anemia: MCV >100 (B12/folate, MDS)",
        "Elevated INR or aPTT on coagulation studies",
        "Pancytopenia suggesting marrow failure or infiltration"
      ]
    },
    medications: [
      {
        name: "Enoxaparin (Lovenox)",
        type: "Low Molecular Weight Heparin",
        action: "Inhibits Factor Xa (and IIa to lesser extent) via antithrombin III potentiation",
        sideEffects: "Bleeding, HIT (less common than UFH), injection site bruising",
        contra: "Active major bleeding, HIT, severe renal impairment (CrCl <30: dose reduce)",
        pearl: "DVT treatment: 1mg/kg SC q12h. DVT prophylaxis: 40mg SC daily. Anti-Xa monitoring for obesity, renal impairment, pregnancy."
      },
      {
        name: "Warfarin (Coumadin)",
        type: "Vitamin K Antagonist",
        action: "Inhibits vitamin K epoxide reductase blocking synthesis of factors II, VII, IX, X and proteins C & S",
        sideEffects: "Bleeding, skin necrosis (protein C deficiency), teratogenicity, drug/food interactions",
        contra: "Pregnancy (first trimester), active bleeding, severe hepatic disease, non-adherent patients",
        pearl: "Bridge with heparin for 5 days (protein C depleted before clotting factors). INR goal 2-3 for most indications; 2.5-3.5 for mechanical mitral valve."
      }
    ],
    pearls: [
      "Reticulocyte count differentiates production problems (low) from destruction/bleeding (elevated)",
      "Peripheral smear morphology is essential: schistocytes (TMA), spherocytes (autoimmune hemolysis), target cells (thalassemia)",
      "Appendicitis management requires accurate diagnosis before initiating specific therapy"
    ],
    quiz: [
      {
        question: "A patient with appendicitis presents with Hgb 6.2 g/dL and symptomatic anemia. Best initial management?",
        options: [
          "Oral iron supplementation only",
          "Type and crossmatch with transfusion of packed RBCs",
          "B12 injection",
          "Observation with repeat CBC in 1 week"
        ],
        correct: 1,
        rationale: "Symptomatic anemia with Hgb <7 g/dL (or <8 in cardiac disease) requires transfusion while investigating the underlying cause of appendicitis."
      }
    ]
  },
  "bowel-obstruction-np": {
    title: "Bowel Obstruction",
    cellular: {
      title: "Pathophysiology of Bowel Obstruction",
      content: "Bowel Obstruction involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Bowel Obstruction pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "Tobacco use (impairs mucosal healing)",
      "High-fat diet with cholelithiasis predisposition",
      "Diabetes with gastroparesis and motility dysfunction",
      "History of C. difficile infection (recurrence risk 20%)",
      "Radiation therapy to abdomen causing enteritis",
      "Chronic constipation with diverticular disease risk",
      "IBD family history (10-25% have affected first-degree relative)"
    ],
    diagnostics: [
      "Abdominal X-ray: obstruction, free air, calcifications",
      "Stool studies: calprotectin, C. diff toxin, O&P, culture",
      "Anti-tTG IgA with total IgA for celiac disease screening",
      "Colonoscopy with polypectomy for lower GI assessment",
      "ERCP for therapeutic biliary/pancreatic duct intervention",
      "Lipase (preferred over amylase for pancreatic evaluation)",
      "EGD with biopsy for upper GI pathology evaluation"
    ],
    management: [
      "Surgical consultation for acute abdomen with peritoneal signs",
      "Gluten-free diet (lifelong) for confirmed celiac disease",
      "Cholecystectomy for symptomatic cholelithiasis",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days",
      "Nutritional support: enteral preferred over parenteral when feasible",
      "Lactulose 15-30mL BID-TID for hepatic encephalopathy",
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to bowel obstruction)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      },
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      }
    ],
    pearls: [
      "Bowel Obstruction evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of bowel obstruction"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with bowel obstruction. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for bowel obstruction."
      }
    ]
  },
  "acute-abdomen-np": {
    title: "Acute Abdomen: Differential Diagnosis",
    cellular: {
      title: "Pathophysiology of Acute Abdomen",
      content: "Acute abdomen requires rapid systematic evaluation to distinguish surgical from medical emergencies. Critical differentials: appendicitis (McBurney point, Rovsing sign), perforation (rigid abdomen, free air under diaphragm), bowel obstruction (dilated loops, air-fluid levels), mesenteric ischemia (pain out of proportion, lactate elevation), ruptured AAA (pulsatile mass, hypotension). CT abdomen/pelvis with IV contrast is the gold-standard imaging."
    },
    riskFactors: [
      "Age >65 with declining mucosal defenses",
      "Chronic constipation with diverticular disease risk",
      "Chronic PPI use >8 weeks without reassessment",
      "Immunosuppression increasing infectious GI complications",
      "H. pylori infection (most common cause of PUD worldwide)",
      "IBD family history (10-25% have affected first-degree relative)",
      "Celiac disease genetic predisposition (HLA-DQ2/DQ8)"
    ],
    diagnostics: [
      "ERCP for therapeutic biliary/pancreatic duct intervention",
      "Anti-tTG IgA with total IgA for celiac disease screening",
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "Hepatic function panel: AST, ALT, ALP, bilirubin, albumin",
      "EGD with biopsy for upper GI pathology evaluation",
      "H. pylori testing: urea breath test, stool antigen, or biopsy",
      "Colonoscopy with polypectomy for lower GI assessment"
    ],
    management: [
      "Nutritional support: enteral preferred over parenteral when feasible",
      "Cholecystectomy for symptomatic cholelithiasis",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "Bowel rest with IV fluids for acute pancreatitis",
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "Ursodiol 13-15mg/kg/day for primary biliary cholangitis",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to acute abdomen)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Omeprazole (Prilosec)",
        type: "Proton Pump Inhibitor",
        action: "Irreversibly inhibits H+/K+-ATPase on parietal cell, reducing gastric acid secretion by >95%",
        sideEffects: "C. diff risk, hypomagnesemia, B12 deficiency, bone fractures with chronic use",
        contra: "Known PPI hypersensitivity, concurrent rilpivirine",
        pearl: "Take 30-60 min before meals. Reassess need at 8 weeks. Long-term risks: hip fracture, C. diff, kidney disease."
      },
      {
        name: "Lactulose",
        type: "Osmotic Laxative / Ammonia Reducer",
        action: "Colonic bacteria metabolize to organic acids trapping ammonia as NH4+ for fecal excretion",
        sideEffects: "Bloating, flatulence, diarrhea, electrolyte imbalance",
        contra: "Galactosemia",
        pearl: "Titrate to 2-3 soft stools/day. Add rifaximin 550mg BID for lactulose non-responders in hepatic encephalopathy."
      }
    ],
    pearls: [
      "Acute Abdomen evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of acute abdomen"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with acute abdomen. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for acute abdomen."
      }
    ]
  },
  "pancreatitis-advanced-np": {
    title: "Pancreatitis: Ranson Criteria & Necrotizing",
    cellular: {
      title: "Pathophysiology of Pancreatitis",
      content: "Acute pancreatitis results from premature trypsinogen activation within acinar cells, triggering autodigestive cascade. Gallstones (40%) and alcohol (40%) are most common causes. Severity: Revised Atlanta classification (mild, moderate-severe, severe). Ranson criteria and BISAP score predict severity. Management: aggressive IV fluids (LR preferred, 250-500 mL/hr initially), pain control, NPO then early enteral feeding."
    },
    riskFactors: [
      "History of C. difficile infection (recurrence risk 20%)",
      "NSAID use >2 weeks without gastroprotection",
      "Hepatitis B/C viral infection with cirrhosis progression",
      "Radiation therapy to abdomen causing enteritis",
      "Prior abdominal surgery with adhesion formation",
      "Alcohol use disorder with chronic mucosal injury",
      "Tobacco use (impairs mucosal healing)"
    ],
    diagnostics: [
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)",
      "MRCP for biliary and pancreatic duct evaluation",
      "RUQ ultrasound for gallbladder and hepatic assessment",
      "ERCP for therapeutic biliary/pancreatic duct intervention",
      "Capsule endoscopy for obscure small bowel bleeding",
      "Colonoscopy with polypectomy for lower GI assessment",
      "Abdominal X-ray: obstruction, free air, calcifications"
    ],
    management: [
      "TIPS procedure for refractory variceal bleeding or ascites",
      "Anti-TNF therapy (infliximab, adalimumab) for moderate-severe IBD",
      "Octreotide 50mcg IV bolus then 50mcg/hr for variceal bleeding",
      "Nutritional support: enteral preferred over parenteral when feasible",
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days",
      "Surgical consultation for acute abdomen with peritoneal signs"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to pancreatitis)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      },
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      }
    ],
    pearls: [
      "Pancreatitis evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of pancreatitis"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with pancreatitis. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for pancreatitis."
      }
    ]
  },
  "cholangitis-np": {
    title: "Cholangitis: Charcot & Reynolds Pentad",
    cellular: {
      title: "Pathophysiology of Cholangitis",
      content: "Acute cholangitis is bacterial infection of the biliary tract due to obstruction (choledocholithiasis most common). Charcot triad: fever, RUQ pain, jaundice (50-70% sensitivity). Reynolds pentad adds AMS and hypotension (septic cholangitis). Diagnosis: elevated WBC, bilirubin, ALP, lipase, blood cultures. ERCP with biliary drainage is both diagnostic and therapeutic. IV antibiotics covering gram-negatives and anaerobes."
    },
    riskFactors: [
      "IBD family history (10-25% have affected first-degree relative)",
      "Obesity (BMI >30) increasing intra-abdominal pressure",
      "NSAID use >2 weeks without gastroprotection",
      "Tobacco use (impairs mucosal healing)",
      "History of C. difficile infection (recurrence risk 20%)",
      "Family history of GI malignancy (first-degree relative)",
      "Prior abdominal surgery with adhesion formation"
    ],
    diagnostics: [
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology",
      "EGD with biopsy for upper GI pathology evaluation",
      "Colonoscopy with polypectomy for lower GI assessment",
      "Stool studies: calprotectin, C. diff toxin, O&P, culture",
      "MRCP for biliary and pancreatic duct evaluation",
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "RUQ ultrasound for gallbladder and hepatic assessment"
    ],
    management: [
      "Mesalamine (5-ASA) for mild-moderate ulcerative colitis",
      "PPI therapy (omeprazole 20-40mg daily) for acid-related disorders",
      "H. pylori triple therapy: PPI + clarithromycin + amoxicillin x14 days",
      "Gluten-free diet (lifelong) for confirmed celiac disease",
      "Anti-TNF therapy (infliximab, adalimumab) for moderate-severe IBD",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "Octreotide 50mcg IV bolus then 50mcg/hr for variceal bleeding"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to cholangitis)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      },
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      }
    ],
    pearls: [
      "Cholangitis evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of cholangitis"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with cholangitis. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for cholangitis."
      }
    ]
  },
  "hepatorenal-syndrome-np": {
    title: "Hepatorenal Syndrome: Pathophysiology",
    cellular: {
      title: "Pathophysiology of Hepatorenal Syndrome",
      content: "Hepatorenal Syndrome: Pathophysiology involves pathological processes affecting GI mucosal integrity, motility, secretion, absorption, or hepatobiliary function. Hepatorenal Syndrome pathophysiology includes epithelial barrier disruption, inflammatory cascades (TNF-alpha, IL-1, IL-6), microbiome dysbiosis, and enteric nervous system dysfunction."
    },
    riskFactors: [
      "Radiation therapy to abdomen causing enteritis",
      "Diabetes with gastroparesis and motility dysfunction",
      "Obesity (BMI >30) increasing intra-abdominal pressure",
      "Prior abdominal surgery with adhesion formation",
      "IBD family history (10-25% have affected first-degree relative)",
      "Chronic PPI use >8 weeks without reassessment",
      "History of C. difficile infection (recurrence risk 20%)"
    ],
    diagnostics: [
      "Anti-tTG IgA with total IgA for celiac disease screening",
      "H. pylori testing: urea breath test, stool antigen, or biopsy",
      "CT abdomen/pelvis with IV contrast for acute abdominal pathology",
      "Capsule endoscopy for obscure small bowel bleeding",
      "FibroScan or FIB-4 score for hepatic fibrosis staging",
      "ERCP for therapeutic biliary/pancreatic duct intervention",
      "HIDA scan for acute cholecystitis (ejection fraction <35% abnormal)"
    ],
    management: [
      "Cholecystectomy for symptomatic cholelithiasis",
      "Ursodiol 13-15mg/kg/day for primary biliary cholangitis",
      "Mesalamine (5-ASA) for mild-moderate ulcerative colitis",
      "Albumin 1.5g/kg on day 1, 1g/kg on day 3 for SBP",
      "Oral vancomycin 125mg QID x10 days for C. difficile infection",
      "Nutritional support: enteral preferred over parenteral when feasible",
      "TIPS procedure for refractory variceal bleeding or ascites"
    ],
    nursingActions: [],
    signs: {
      left: [
        "Abdominal pain (location, quality, timing specific to hepatorenal syndrome)",
        "Nausea, vomiting, dysphagia",
        "Bowel habit changes (diarrhea, constipation, melena)",
        "Weight loss or nutritional deficiency"
      ],
      right: [
        "Jaundice, scleral icterus, pruritus",
        "Hepatomegaly, splenomegaly, ascites",
        "Elevated liver enzymes or bilirubin",
        "GI hemorrhage signs"
      ]
    },
    medications: [
      {
        name: "Metoclopramide (Reglan)",
        type: "Prokinetic / Dopamine Antagonist",
        action: "Blocks D2 receptors in CTZ (antiemetic) and enhances gastric motility via acetylcholine release",
        sideEffects: "Tardive dyskinesia (BLACK BOX >12 weeks), EPS, drowsiness, QT prolongation",
        contra: "GI obstruction, perforation, pheochromocytoma, seizure disorder",
        pearl: "Max use 12 weeks due to tardive dyskinesia risk. 10mg PO 30 min before meals and at bedtime."
      },
      {
        name: "Infliximab (Remicade)",
        type: "Anti-TNF Monoclonal Antibody",
        action: "Binds soluble and membrane-bound TNF-alpha neutralizing inflammatory cascade in IBD",
        sideEffects: "Infusion reactions, serious infections, TB reactivation, lymphoma risk",
        contra: "Active serious infection, untreated latent TB, NYHA class III/IV HF",
        pearl: "Check TB (QuantiFERON), Hep B before starting. Induction: 5mg/kg at 0, 2, 6 weeks. Maintenance q8 weeks."
      }
    ],
    pearls: [
      "Hepatorenal Syndrome evaluation requires focused history, labs, imaging, and endoscopy as indicated",
      "Red flag GI symptoms: weight loss >5%, GI bleeding, dysphagia, persistent vomiting, new onset >50y",
      "Current ACG/AGA guidelines direct evidence-based management of hepatorenal syndrome"
    ],
    quiz: [
      {
        question: "A patient presents with findings consistent with hepatorenal syndrome. Best initial diagnostic approach?",
        options: [
          "Empiric treatment only",
          "Labs, imaging, and endoscopy as indicated by clinical presentation",
          "Immediate surgical referral without workup",
          "Observation without testing"
        ],
        correct: 1,
        rationale: "Systematic evaluation with labs, imaging, and potentially endoscopy establishes diagnosis and guides management for hepatorenal syndrome."
      }
    ]
  }
};
