import type { LessonContent } from "./types";

export const generatedBatch108Lessons: Record<string, LessonContent> = {
  "ace-inhibitors": {
    title: "ACE Inhibitors",
    cellular: {
      title: "Mechanism of Action: ACE Inhibitors",
      content: "Angiotensin-converting enzyme (ACE) inhibitors block the conversion of angiotensin I to angiotensin II by inhibiting the ACE enzyme located primarily in the pulmonary vascular endothelium. Angiotensin II is a potent vasoconstrictor that also stimulates aldosterone secretion from the adrenal cortex. By blocking its formation, ACE inhibitors produce vasodilation, reduce peripheral vascular resistance, and decrease aldosterone-mediated sodium and water retention.\n\nACE inhibitors also prevent the degradation of bradykinin, a vasodilatory peptide. Elevated bradykinin levels contribute to the therapeutic vasodilation but are also responsible for the characteristic dry cough seen in 5-20% of patients. At the cellular level, ACE inhibitors reduce cardiac remodeling by decreasing angiotensin II-mediated cardiac fibrosis and myocyte hypertrophy, making them essential in heart failure management.\n\nIn the kidneys, ACE inhibitors preferentially dilate the efferent arteriole of the glomerulus, reducing intraglomerular pressure and providing renoprotective effects. This mechanism explains their use in diabetic nephropathy. However, this same mechanism can precipitate acute kidney injury in patients with bilateral renal artery stenosis, where glomerular filtration is dependent on efferent arteriolar tone."
    },
    riskFactors: [
      "History of angioedema with ACE inhibitor use",
      "Bilateral renal artery stenosis",
      "Hyperkalemia or concurrent potassium-sparing diuretics",
      "Pregnancy (teratogenic - category X)",
      "Severe aortic stenosis or hypertrophic cardiomyopathy"
    ],
    diagnostics: [
      "Baseline and periodic serum creatinine and BUN monitoring",
      "Serum potassium levels before and within 1 week of initiation",
      "Blood pressure monitoring including orthostatic measurements",
      "Urinalysis for proteinuria in diabetic patients"
    ],
    management: [
      "Start at low doses and titrate gradually based on blood pressure response",
      "Hold medication if potassium >5.5 mEq/L or creatinine rises >30% from baseline",
      "Discontinue immediately if angioedema occurs and manage airway",
      "Switch to ARB if persistent dry cough develops"
    ],
    nursingActions: [
      "Monitor blood pressure before each dose; hold if systolic <90 mmHg",
      "Assess for dry cough, facial swelling, or lip/tongue edema",
      "Teach patient to avoid potassium supplements and salt substitutes",
      "Educate on importance of contraception for women of childbearing age",
      "Monitor serum potassium and renal function labs regularly"
    ],
    signs: {
      left: [
        "Dry, nonproductive cough (bradykinin accumulation)",
        "First-dose hypotension, especially with volume depletion",
        "Hyperkalemia (decreased aldosterone secretion)",
        "Dizziness and lightheadedness"
      ],
      right: [
        "Angioedema (swelling of face, lips, tongue, larynx)",
        "Elevated serum creatinine (efferent arteriole dilation)",
        "Dysgeusia (altered taste sensation)",
        "Fatigue and headache"
      ]
    },
    medications: [
      {
        name: "Lisinopril",
        type: "ACE Inhibitor",
        action: "Blocks ACE enzyme, preventing conversion of angiotensin I to angiotensin II; reduces aldosterone secretion and increases bradykinin",
        sideEffects: "Dry cough, hyperkalemia, hypotension, dizziness, angioedema",
        contra: "Pregnancy, bilateral renal artery stenosis, history of ACE inhibitor-related angioedema",
        pearl: "Most commonly prescribed ACE inhibitor; once-daily dosing improves adherence. Remember '-pril' suffix for all ACE inhibitors."
      },
      {
        name: "Enalapril",
        type: "ACE Inhibitor (Prodrug)",
        action: "Converted to active enalaprilat in the liver; inhibits ACE to reduce angiotensin II formation and aldosterone release",
        sideEffects: "Hypotension, cough, hyperkalemia, headache, renal impairment",
        contra: "Pregnancy, angioedema history, concurrent use with aliskiren in diabetic patients",
        pearl: "Available in IV form (enalaprilat) for hypertensive emergencies when oral route is not feasible."
      }
    ],
    pearls: [
      "All ACE inhibitors end in '-pril' - easy identification on exams",
      "Dry cough from ACE inhibitors is due to bradykinin accumulation, NOT angioedema",
      "Angioedema can occur at any time during therapy, even after years of use",
      "ACE inhibitors are first-line for hypertension with diabetes or heart failure",
      "Monitor potassium closely when combined with potassium-sparing diuretics or NSAIDs"
    ],
    quiz: [
      {
        question: "A patient taking lisinopril develops swelling of the tongue and difficulty breathing. What is the priority nursing action?",
        options: [
          "Discontinue the medication and prepare for emergency airway management",
          "Administer an antihistamine and monitor for 30 minutes",
          "Elevate the head of bed and apply ice to the swollen area",
          "Reassure the patient that mild swelling is a common side effect"
        ],
        correct: 0,
        rationale: "Angioedema with airway compromise is a life-threatening emergency. The nurse must immediately discontinue the ACE inhibitor and prepare for emergency airway management including possible intubation or epinephrine administration."
      },
      {
        question: "Which laboratory value should the nurse monitor most closely when a patient begins ACE inhibitor therapy?",
        options: [
          "Serum sodium level",
          "Serum potassium level",
          "Serum calcium level",
          "Serum magnesium level"
        ],
        correct: 1,
        rationale: "ACE inhibitors decrease aldosterone secretion, which leads to potassium retention. Hyperkalemia is a significant adverse effect, and potassium levels should be monitored closely, especially within the first week of therapy."
      }
    ]
  },

  "arb-medications": {
    title: "ARB Medications",
    cellular: {
      title: "Mechanism of Action: Angiotensin II Receptor",
      content: "Angiotensin II receptor blockers (ARBs) selectively block the angiotensin II type 1 (AT1) receptor, preventing the downstream effects of angiotensin II regardless of its source of production. Unlike ACE inhibitors, ARBs do not inhibit the ACE enzyme itself, which means they do not affect bradykinin metabolism. This distinction is clinically important because ARBs do not cause the dry cough associated with ACE inhibitors.\n\nBy blocking the AT1 receptor, ARBs prevent angiotensin II from causing vasoconstriction, aldosterone release, sympathetic nervous system activation, and cellular growth and proliferation. The result is reduced peripheral vascular resistance, decreased blood volume through reduced aldosterone-mediated sodium retention, and prevention of pathological cardiac and vascular remodeling.\n\nARBs provide similar renoprotective effects as ACE inhibitors by reducing intraglomerular pressure through efferent arteriolar dilation. They are particularly valuable in patients who develop cough with ACE inhibitors but still require renin-angiotensin-aldosterone system (RAAS) blockade. However, ARBs carry the same risks of hyperkalemia, hypotension, and teratogenicity as ACE inhibitors, and dual RAAS blockade (combining ACE inhibitors with ARBs) is generally contraindicated due to increased risk of renal failure and hyperkalemia."
    },
    riskFactors: [
      "Pregnancy (teratogenic - absolutely contraindicated)",
      "Bilateral renal artery stenosis",
      "Volume depletion or concurrent diuretic use",
      "Hyperkalemia or renal impairment",
      "Concurrent use with ACE inhibitors (dual RAAS blockade)"
    ],
    diagnostics: [
      "Baseline and periodic serum potassium and creatinine levels",
      "Blood pressure monitoring including orthostatic checks",
      "Renal function assessment before and after initiation",
      "CBC monitoring for rare anemia or leukopenia"
    ],
    management: [
      "Initiate at low dose and titrate based on blood pressure and tolerance",
      "Correct volume depletion before starting ARB therapy",
      "Avoid concurrent use with ACE inhibitors or direct renin inhibitors",
      "Discontinue if serum creatinine rises significantly or hyperkalemia develops"
    ],
    nursingActions: [
      "Monitor blood pressure for hypotension, especially after first dose",
      "Assess potassium levels regularly; educate patient to avoid potassium supplements",
      "Verify pregnancy status and counsel on effective contraception",
      "Educate patient that ARBs do NOT cause dry cough like ACE inhibitors",
      "Report any facial or throat swelling immediately (rare angioedema)"
    ],
    signs: {
      left: [
        "Hypotension and dizziness (vasodilation)",
        "Hyperkalemia (reduced aldosterone)",
        "Headache and fatigue",
        "Upper respiratory infection symptoms"
      ],
      right: [
        "Elevated BUN and creatinine (renal effects)",
        "Back pain and muscle cramps",
        "Rare angioedema (less common than with ACE inhibitors)",
        "Diarrhea and GI discomfort"
      ]
    },
    medications: [
      {
        name: "Losartan",
        type: "Angiotensin II Receptor Blocker",
        action: "Selectively blocks AT1 receptors, preventing angiotensin II-mediated vasoconstriction and aldosterone release",
        sideEffects: "Dizziness, hyperkalemia, hypotension, fatigue, diarrhea",
        contra: "Pregnancy, concurrent ACE inhibitor use, bilateral renal artery stenosis",
        pearl: "Also has uricosuric properties - may lower uric acid levels. Only ARB with this effect; beneficial in patients with gout."
      },
      {
        name: "Valsartan",
        type: "Angiotensin II Receptor Blocker",
        action: "Blocks AT1 receptor to produce vasodilation and reduce aldosterone secretion; decreases cardiac afterload and preload",
        sideEffects: "Hypotension, hyperkalemia, headache, dizziness, renal impairment",
        contra: "Pregnancy, severe hepatic impairment, concurrent aliskiren in diabetic patients",
        pearl: "FDA-approved for post-MI heart failure in patients intolerant to ACE inhibitors. Available in combination with sacubitril (Entresto) for HFrEF."
      }
    ],
    pearls: [
      "All ARBs end in '-sartan' - easy exam identification",
      "ARBs are the primary alternative when ACE inhibitor cough occurs",
      "Do NOT combine ACE inhibitors with ARBs - increased risk of renal failure and hyperkalemia",
      "Angioedema risk with ARBs is much lower but not zero",
      "Same teratogenicity risk as ACE inhibitors - contraindicated in pregnancy"
    ],
    quiz: [
      {
        question: "A patient reports developing a persistent dry cough while taking enalapril. The provider switches to losartan. What should the nurse explain to the patient?",
        options: [
          "Losartan works the same way but does not affect bradykinin, so cough is unlikely",
          "Losartan is less effective than enalapril but has fewer side effects",
          "The cough will likely continue since both medications block angiotensin",
          "Losartan requires weekly blood pressure monitoring at the clinic"
        ],
        correct: 0,
        rationale: "ACE inhibitor cough is caused by bradykinin accumulation. ARBs block the AT1 receptor directly without affecting ACE or bradykinin metabolism, so the cough typically resolves when switching to an ARB."
      },
      {
        question: "Which teaching point is most important for a patient prescribed valsartan?",
        options: [
          "Take the medication with food to reduce GI upset",
          "Avoid salt substitutes as they contain potassium",
          "Expect a dry cough that will resolve over time",
          "Take a potassium supplement to prevent hypokalemia"
        ],
        correct: 1,
        rationale: "ARBs reduce aldosterone secretion, leading to potassium retention. Salt substitutes typically contain potassium chloride, which could exacerbate hyperkalemia. Patients should be taught to avoid potassium supplements and salt substitutes."
      }
    ]
  },

  "beta-blockers-pharmacology": {
    title: "Beta Blockers Pharmacology",
    cellular: {
      title: "Mechanism of Action: Beta-Adrenergic Blockers",
      content: "Beta-adrenergic blockers competitively antagonize catecholamine binding at beta-adrenergic receptors. Beta-1 receptors are primarily located in the heart, where their stimulation increases heart rate (chronotropy), conduction velocity (dromotropy), contractility (inotropy), and automaticity. Beta-2 receptors are found in bronchial smooth muscle, vascular smooth muscle, and the liver, where they mediate bronchodilation, vasodilation, and glycogenolysis.\n\nCardioselective beta blockers (beta-1 selective) such as metoprolol and atenolol preferentially block beta-1 receptors at therapeutic doses, reducing heart rate, contractility, and blood pressure while having less effect on bronchial smooth muscle. However, selectivity is dose-dependent and may be lost at higher doses. Non-selective beta blockers like propranolol block both beta-1 and beta-2 receptors, which can cause bronchoconstriction and mask hypoglycemia symptoms.\n\nIn heart failure, beta blockers reduce the chronic sympathetic overstimulation that drives progressive myocardial damage. They decrease myocardial oxygen demand, prevent catecholamine-induced toxicity, and reverse pathological remodeling over time. Carvedilol additionally blocks alpha-1 receptors, providing vasodilation and further afterload reduction. Beta blockers also suppress renin release from juxtaglomerular cells (a beta-1 mediated process), contributing to RAAS inhibition."
    },
    riskFactors: [
      "Asthma or reactive airway disease (especially non-selective agents)",
      "Severe bradycardia or heart block (second or third degree)",
      "Decompensated heart failure (acute exacerbation)",
      "Diabetes mellitus (masking of hypoglycemia symptoms)",
      "Peripheral vascular disease (beta-2 blockade worsens vasoconstriction)"
    ],
    diagnostics: [
      "Continuous heart rate and rhythm monitoring during initiation",
      "Blood pressure assessment before and after each dose",
      "Blood glucose monitoring in diabetic patients",
      "ECG to assess PR interval and conduction abnormalities"
    ],
    management: [
      "Start low and titrate slowly, especially in heart failure ('start low, go slow')",
      "Never abruptly discontinue - taper over 1-2 weeks to prevent rebound tachycardia",
      "Hold for heart rate <60 bpm or systolic BP <90 mmHg",
      "Use cardioselective agents in patients with mild COPD or diabetes"
    ],
    nursingActions: [
      "Check apical pulse for 1 full minute before administration; hold if <60 bpm",
      "Monitor for signs of heart failure exacerbation (weight gain, edema, dyspnea)",
      "Educate diabetic patients that beta blockers mask tachycardia during hypoglycemia",
      "Teach patients to rise slowly to prevent orthostatic hypotension",
      "Emphasize no abrupt discontinuation - risk of rebound hypertension and angina"
    ],
    signs: {
      left: [
        "Bradycardia (decreased SA node firing rate)",
        "Hypotension (reduced cardiac output)",
        "Fatigue and exercise intolerance",
        "Cold extremities (peripheral vasoconstriction)"
      ],
      right: [
        "Bronchospasm (beta-2 blockade in non-selective agents)",
        "Masked hypoglycemia (impaired glycogenolysis)",
        "Depression and sleep disturbances",
        "Sexual dysfunction (erectile dysfunction)"
      ]
    },
    medications: [
      {
        name: "Metoprolol (Lopressor/Toprol-XL)",
        type: "Cardioselective Beta-1 Blocker",
        action: "Selectively blocks beta-1 receptors in the heart to decrease heart rate, contractility, and blood pressure; reduces myocardial oxygen demand",
        sideEffects: "Bradycardia, hypotension, fatigue, dizziness, depression, cold extremities",
        contra: "Severe bradycardia, cardiogenic shock, decompensated heart failure, second/third-degree heart block",
        pearl: "Tartrate form (Lopressor) given 2-3 times daily; succinate form (Toprol-XL) is extended-release once daily. IV form used in acute MI."
      },
      {
        name: "Carvedilol (Coreg)",
        type: "Non-selective Beta Blocker with Alpha-1 Blockade",
        action: "Blocks beta-1, beta-2, and alpha-1 receptors; reduces heart rate, contractility, and peripheral vascular resistance simultaneously",
        sideEffects: "Hypotension, dizziness, bradycardia, weight gain, hyperglycemia",
        contra: "Severe bradycardia, bronchial asthma, decompensated HF, severe hepatic impairment",
        pearl: "Must be taken with food to slow absorption and reduce orthostatic hypotension risk. First-line for systolic heart failure with reduced EF."
      }
    ],
    pearls: [
      "Beta blockers ending in '-olol' are beta-1 selective; those ending in '-alol' or '-ilol' may have additional receptor activity",
      "NEVER stop beta blockers abruptly - can cause rebound tachycardia, hypertension, and acute MI",
      "Carvedilol must be taken with food; metoprolol tartrate can be taken without food",
      "Beta blockers are first-line for rate control in atrial fibrillation",
      "In heart failure, initiate only when patient is euvolemic (stable, not acutely decompensated)"
    ],
    quiz: [
      {
        question: "A nurse is about to administer metoprolol. The patient's apical pulse is 54 bpm. What should the nurse do?",
        options: [
          "Administer the medication and recheck the pulse in 1 hour",
          "Hold the medication and notify the healthcare provider",
          "Administer half the prescribed dose",
          "Give the medication with a glass of orange juice"
        ],
        correct: 1,
        rationale: "Beta blockers should be held for heart rate below 60 bpm. A pulse of 54 bpm indicates bradycardia, and administering metoprolol could further decrease heart rate to dangerous levels. The nurse should hold the dose and notify the provider."
      },
      {
        question: "Which patient should the nurse question before administering propranolol (a non-selective beta blocker)?",
        options: [
          "A patient with a history of migraines",
          "A patient with a history of asthma",
          "A patient with a history of hypertension",
          "A patient with a history of atrial fibrillation"
        ],
        correct: 1,
        rationale: "Propranolol is a non-selective beta blocker that blocks beta-2 receptors in the lungs, causing bronchoconstriction. It is contraindicated in patients with asthma or reactive airway disease. A cardioselective beta blocker would be safer."
      }
    ]
  },


  "loop-diuretics": {
    title: "Loop Diuretics",
    cellular: {
      title: "Mechanism of Action: Loop Diuretics",
      content: "Loop diuretics inhibit the sodium-potassium-2 chloride (Na+/K+/2Cl-) cotransporter in the thick ascending limb of the loop of Henle, the most powerful site for sodium reabsorption in the nephron. By blocking this transporter, loop diuretics prevent approximately 25% of filtered sodium from being reabsorbed, resulting in profound natriuresis and diuresis. This is significantly more potent than thiazide diuretics, which act on the distal convoluted tubule where only 5-8% of sodium reabsorption occurs.\n\nThe inhibition of the Na+/K+/2Cl- cotransporter also disrupts the normal positive lumen potential in the thick ascending limb, which normally drives passive paracellular reabsorption of calcium and magnesium. This explains why loop diuretics cause significant urinary losses of calcium, magnesium, and potassium in addition to sodium. The loss of potassium is further enhanced by increased sodium delivery to the collecting duct, where it is exchanged for potassium via the epithelial sodium channel-aldosterone mechanism.\n\nLoop diuretics also stimulate prostaglandin synthesis in the kidneys, contributing to renal vasodilation and increased renal blood flow. This prostaglandin-mediated effect is blocked by NSAIDs, which is why concurrent NSAID use can reduce loop diuretic efficacy. IV furosemide produces venodilation within 5 minutes, reducing preload before the diuretic effect begins, making it invaluable in acute pulmonary edema."
    },
    riskFactors: [
      "Volume depletion or dehydration",
      "Electrolyte imbalances (hypokalemia, hypomagnesemia, hypocalcemia)",
      "Gout (loop diuretics increase uric acid levels)",
      "Ototoxicity risk with high IV doses or concurrent aminoglycosides",
      "Sulfonamide allergy (furosemide and bumetanide contain sulfa moiety)"
    ],
    diagnostics: [
      "Serum electrolytes: potassium, sodium, magnesium, calcium",
      "BUN and creatinine to monitor renal function",
      "Daily weights and strict intake/output monitoring",
      "Blood glucose monitoring (can cause hyperglycemia)",
      "Uric acid levels in patients with gout history"
    ],
    management: [
      "Administer IV push slowly (no faster than 4 mg/min for furosemide) to prevent ototoxicity",
      "Replace potassium as needed - keep K+ >4.0 mEq/L in cardiac patients",
      "Administer in the morning to prevent nocturia",
      "Monitor for signs of dehydration and orthostatic hypotension"
    ],
    nursingActions: [
      "Monitor daily weights (1 kg = 1 liter of fluid); report gain >1 kg/day",
      "Assess serum potassium before and during therapy; watch for hypokalemia signs",
      "Monitor hearing acuity - ototoxicity is dose-related and usually reversible",
      "Teach patients potassium-rich foods: bananas, oranges, potatoes, spinach",
      "Administer early in the day to avoid sleep disruption from nocturia"
    ],
    signs: {
      left: [
        "Hypokalemia (muscle weakness, cramping, dysrhythmias)",
        "Dehydration (thirst, poor skin turgor, dry mucous membranes)",
        "Orthostatic hypotension (dizziness on standing)",
        "Hypomagnesemia (tremors, tetany)"
      ],
      right: [
        "Ototoxicity (tinnitus, hearing loss with high IV doses)",
        "Hyperuricemia and gout exacerbation",
        "Hyperglycemia (impaired insulin release)",
        "Metabolic alkalosis (loss of hydrogen ions)"
      ]
    },
    medications: [
      {
        name: "Furosemide (Lasix)",
        type: "Loop Diuretic",
        action: "Inhibits Na+/K+/2Cl- cotransporter in the thick ascending loop of Henle; produces potent diuresis and venodilation",
        sideEffects: "Hypokalemia, dehydration, ototoxicity, hyperuricemia, hypotension, metabolic alkalosis",
        contra: "Anuria, severe electrolyte depletion, hepatic coma, sulfonamide hypersensitivity",
        pearl: "IV onset 5 minutes, peak 30 minutes. Oral onset 30-60 minutes. 'Lasix lasts 6 hours.' Administer IV no faster than 4 mg/min."
      },
      {
        name: "Bumetanide (Bumex)",
        type: "Loop Diuretic",
        action: "Blocks Na+/K+/2Cl- cotransporter; 40 times more potent than furosemide on a milligram basis",
        sideEffects: "Hypokalemia, dehydration, ototoxicity, muscle cramps, hyperuricemia",
        contra: "Anuria, hepatic coma, severe electrolyte depletion, sulfonamide allergy",
        pearl: "1 mg bumetanide = 40 mg furosemide. Used when patients develop furosemide resistance. Better oral bioavailability than furosemide."
      }
    ],
    pearls: [
      "Furosemide memory aid: 'Lasix = Lasts 6 hours'",
      "Loop diuretics waste potassium, calcium, and magnesium - monitor all three",
      "IV furosemide causes venodilation BEFORE diuresis - immediate preload reduction in pulmonary edema",
      "NSAIDs reduce loop diuretic effectiveness by blocking prostaglandin-mediated renal vasodilation",
      "Check potassium before giving digoxin to patients on loop diuretics - hypokalemia increases digoxin toxicity"
    ],
    quiz: [
      {
        question: "A patient receiving IV furosemide has a potassium level of 3.1 mEq/L and is also taking digoxin. What is the nurse's priority action?",
        options: [
          "Continue the furosemide and monitor potassium in 24 hours",
          "Hold the digoxin and notify the provider about the potassium level",
          "Administer the digoxin with extra fluids",
          "Increase dietary potassium and recheck in 1 week"
        ],
        correct: 1,
        rationale: "Hypokalemia (K+ <3.5 mEq/L) increases the risk of digoxin toxicity by enhancing digoxin binding to the Na+/K+ ATPase pump. The nurse should hold digoxin and notify the provider for potassium replacement before resuming digoxin."
      },
      {
        question: "The nurse is administering IV furosemide 80 mg. What is the maximum rate of administration?",
        options: [
          "Over 1 minute by IV push",
          "Over 5 minutes (4 mg/min maximum rate)",
          "Over 20 minutes (4 mg/min maximum rate)",
          "Over 60 minutes as a slow infusion"
        ],
        correct: 2,
        rationale: "IV furosemide should be administered no faster than 4 mg/min to prevent ototoxicity. An 80 mg dose at 4 mg/min = 20 minutes minimum administration time."
      }
    ]
  },

  "potassium-sparing-diuretics": {
    title: "Potassium-Sparing Diuretics",
    cellular: {
      title: "Mechanism of Action: Potassium-Sparing",
      content: "Potassium-sparing diuretics work in the collecting duct and distal convoluted tubule to promote sodium excretion while retaining potassium. There are two distinct mechanisms within this class: aldosterone antagonists (spironolactone, eplerenone) and epithelial sodium channel (ENaC) blockers (amiloride, triamterene).\n\nAldosterone antagonists competitively bind to the mineralocorticoid receptor in the principal cells of the collecting duct, preventing aldosterone from upregulating sodium channel and Na+/K+ ATPase expression. Aldosterone normally promotes sodium reabsorption and potassium secretion, so blocking its effects results in mild natriuresis and potassium retention. Spironolactone also binds to androgen and progesterone receptors, causing anti-androgenic side effects such as gynecomastia. Eplerenone is more selective for the mineralocorticoid receptor with fewer hormonal side effects.\n\nENaC blockers directly inhibit the epithelial sodium channel on the luminal membrane of the collecting duct principal cells, preventing sodium entry into the cell and reducing the electrochemical gradient that drives potassium secretion. These are weak diuretics on their own (affecting only 1-2% of filtered sodium) and are most commonly used in combination with loop or thiazide diuretics to offset potassium losses. Spironolactone has proven mortality benefit in heart failure (RALES trial) by blocking aldosterone-mediated cardiac fibrosis and myocardial remodeling."
    },
    riskFactors: [
      "Hyperkalemia (most dangerous adverse effect)",
      "Renal insufficiency (reduced potassium excretion capacity)",
      "Concurrent ACE inhibitor or ARB use (additive potassium retention)",
      "Concurrent potassium supplementation",
      "Addison's disease (aldosterone deficiency)"
    ],
    diagnostics: [
      "Serum potassium levels - baseline and within 48-72 hours of initiation",
      "Serum creatinine and BUN to assess renal function",
      "ECG monitoring for signs of hyperkalemia (peaked T waves, widened QRS)",
      "Blood pressure monitoring"
    ],
    management: [
      "Monitor potassium closely; discontinue if K+ >5.5 mEq/L",
      "Avoid concurrent potassium supplements and potassium-containing salt substitutes",
      "Use with caution alongside ACE inhibitors or ARBs",
      "Treat hyperkalemia emergently with calcium gluconate, insulin/glucose, and sodium polystyrene"
    ],
    nursingActions: [
      "Monitor serum potassium frequently - hyperkalemia is the primary concern",
      "Teach patients to avoid potassium-rich foods in excess, salt substitutes, and OTC potassium",
      "Assess for signs of hyperkalemia: muscle weakness, paresthesias, bradycardia, ECG changes",
      "For spironolactone: monitor for gynecomastia, menstrual irregularities, and impotence",
      "Assess renal function regularly; impaired kidneys cannot excrete excess potassium"
    ],
    signs: {
      left: [
        "Hyperkalemia (peaked T waves, cardiac dysrhythmias)",
        "Gynecomastia (spironolactone - anti-androgenic effect)",
        "Menstrual irregularities in women (spironolactone)",
        "Mild natriuresis and decreased blood pressure"
      ],
      right: [
        "Muscle weakness and fatigue (hyperkalemia)",
        "GI upset: nausea, vomiting, diarrhea",
        "Headache and dizziness",
        "Impotence and decreased libido (spironolactone)"
      ]
    },
    medications: [
      {
        name: "Spironolactone (Aldactone)",
        type: "Aldosterone Antagonist / Potassium-Sparing Diuretic",
        action: "Competitively blocks aldosterone at the mineralocorticoid receptor in the collecting duct; promotes sodium excretion and potassium retention; reduces cardiac fibrosis",
        sideEffects: "Hyperkalemia, gynecomastia, menstrual irregularities, GI upset, impotence",
        contra: "Hyperkalemia (K+ >5.5 mEq/L), severe renal failure, Addison's disease, concurrent K+ supplements",
        pearl: "Proven mortality reduction in heart failure (RALES trial). Anti-androgenic effects limit use in males - eplerenone is the alternative. Also used for ascites in liver cirrhosis."
      },
      {
        name: "Eplerenone (Inspra)",
        type: "Selective Aldosterone Antagonist",
        action: "Selectively blocks mineralocorticoid receptors without significant binding to androgen or progesterone receptors; reduces sodium retention and potassium excretion",
        sideEffects: "Hyperkalemia, dizziness, diarrhea, fatigue",
        contra: "Hyperkalemia, severe renal impairment (CrCl <30), concurrent strong CYP3A4 inhibitors",
        pearl: "Fewer endocrine side effects than spironolactone (no gynecomastia). Preferred in male patients with heart failure."
      }
    ],
    pearls: [
      "Potassium-sparing diuretics + ACE inhibitors + potassium supplements = 'triple threat' for hyperkalemia",
      "Spironolactone causes gynecomastia due to anti-androgenic activity; eplerenone does not",
      "These are WEAK diuretics alone - usually combined with loop or thiazide diuretics",
      "ECG signs of hyperkalemia: peaked T waves, flattened P waves, widened QRS, sine wave pattern",
      "Spironolactone has a mortality benefit in HFrEF independent of its diuretic effect"
    ],
    quiz: [
      {
        question: "A patient taking spironolactone and lisinopril has a serum potassium of 5.8 mEq/L. What is the priority nursing action?",
        options: [
          "Encourage increased fluid intake to dilute the potassium",
          "Hold both medications and notify the provider immediately",
          "Administer a potassium supplement and recheck in 4 hours",
          "Continue medications and recheck potassium in the morning"
        ],
        correct: 1,
        rationale: "A potassium level of 5.8 mEq/L is dangerously elevated and can cause fatal cardiac dysrhythmias. Both spironolactone (potassium-sparing diuretic) and lisinopril (ACE inhibitor) contribute to hyperkalemia. Both should be held and the provider notified immediately for emergent treatment."
      },
      {
        question: "Which side effect is unique to spironolactone compared to eplerenone?",
        options: [
          "Hyperkalemia",
          "Gynecomastia",
          "Hypotension",
          "Dehydration"
        ],
        correct: 1,
        rationale: "Spironolactone binds to androgen and progesterone receptors in addition to mineralocorticoid receptors, causing anti-androgenic effects such as gynecomastia, menstrual irregularities, and impotence. Eplerenone is selective for the mineralocorticoid receptor and does not cause these endocrine side effects."
      }
    ]
  },

  "antiplatelet-agents": {
    title: "Antiplatelet Agents",
    cellular: {
      title: "Mechanism of Action: Antiplatelet Agents",
      content: "Antiplatelet agents inhibit various steps in platelet activation and aggregation, preventing the formation of arterial thrombi. Platelets are activated when exposed to collagen from damaged endothelium or by chemical mediators such as thromboxane A2 (TXA2), adenosine diphosphate (ADP), and thrombin. Each class of antiplatelet drugs targets a different step in this process.\n\nAspirin irreversibly inhibits cyclooxygenase-1 (COX-1) in platelets, blocking the conversion of arachidonic acid to thromboxane A2. Since TXA2 is a potent platelet aggregator and vasoconstrictor, aspirin effectively prevents platelet clumping. This inhibition is irreversible and lasts for the 7-10 day lifespan of the platelet, because platelets lack nuclei and cannot synthesize new COX-1 enzyme. Low-dose aspirin (81-325 mg) is sufficient for antiplatelet effects.\n\nP2Y12 receptor inhibitors (clopidogrel, prasugrel, ticagrelor) block the ADP receptor on the platelet surface. ADP binding to its P2Y12 receptor normally activates the glycoprotein IIb/IIIa receptor, which is the final common pathway for platelet aggregation via fibrinogen cross-linking. Clopidogrel is a prodrug requiring hepatic CYP2C19 activation and has variable response. Ticagrelor is a direct-acting reversible inhibitor with more predictable pharmacokinetics but requires twice-daily dosing. Dual antiplatelet therapy (DAPT) with aspirin plus a P2Y12 inhibitor is standard after acute coronary syndrome and coronary stent placement."
    },
    riskFactors: [
      "Active bleeding or bleeding disorders",
      "History of hemorrhagic stroke",
      "Upcoming surgery within 5-7 days",
      "Concurrent anticoagulant therapy (increased bleeding risk)",
      "Peptic ulcer disease or GI bleeding history"
    ],
    diagnostics: [
      "Platelet count and bleeding time",
      "Hemoglobin and hematocrit for occult bleeding",
      "Stool guaiac test for GI bleeding",
      "CYP2C19 genotyping for clopidogrel (poor metabolizers have reduced efficacy)"
    ],
    management: [
      "Discontinue aspirin 7 days and clopidogrel 5 days before elective surgery",
      "Use proton pump inhibitors concurrently for GI protection (avoid omeprazole with clopidogrel)",
      "Maintain dual antiplatelet therapy for minimum 12 months after drug-eluting stent",
      "Monitor for signs of bleeding: bruising, petechiae, dark stools, hematuria"
    ],
    nursingActions: [
      "Assess for bleeding: check stools for occult blood, monitor for bruising",
      "Educate patient to use soft toothbrush and electric razor",
      "Teach patient to avoid NSAIDs and other medications that increase bleeding risk",
      "Instruct patient to carry medical alert identification",
      "Emphasize importance of NOT discontinuing antiplatelet therapy without provider guidance after stent placement"
    ],
    signs: {
      left: [
        "Bleeding (most common adverse effect)",
        "Bruising and petechiae",
        "GI bleeding (melena, hematemesis)",
        "Prolonged bleeding time"
      ],
      right: [
        "Thrombotic thrombocytopenic purpura (TTP) - rare with clopidogrel",
        "Dyspnea (ticagrelor-specific side effect)",
        "Rash and pruritus",
        "Neutropenia (rare with clopidogrel)"
      ]
    },
    medications: [
      {
        name: "Aspirin (ASA)",
        type: "COX-1 Inhibitor / Antiplatelet",
        action: "Irreversibly inhibits COX-1, blocking thromboxane A2 synthesis; prevents platelet aggregation for the entire platelet lifespan (7-10 days)",
        sideEffects: "GI bleeding, tinnitus, Reye syndrome in children, bruising, allergic reactions",
        contra: "Active bleeding, children with viral illness (Reye syndrome), aspirin allergy, severe liver disease",
        pearl: "Low-dose (81 mg) for antiplatelet effect; high-dose (650 mg+) for anti-inflammatory effect. Aspirin is the single most important medication in acute MI."
      },
      {
        name: "Clopidogrel (Plavix)",
        type: "P2Y12 ADP Receptor Inhibitor",
        action: "Irreversibly blocks the P2Y12 ADP receptor on platelets, preventing ADP-mediated activation of glycoprotein IIb/IIIa and platelet aggregation",
        sideEffects: "Bleeding, bruising, GI upset, rash, TTP (rare), neutropenia",
        contra: "Active pathological bleeding, severe hepatic impairment",
        pearl: "Prodrug activated by CYP2C19 - avoid omeprazole (CYP2C19 inhibitor); pantoprazole is preferred PPI. 'Poor metabolizers' may not respond - genetic testing available."
      }
    ],
    pearls: [
      "Aspirin is irreversible; clopidogrel is irreversible; ticagrelor is reversible - important for surgical timing",
      "Never discontinue DAPT after stent placement without provider approval - risk of stent thrombosis",
      "Omeprazole inhibits CYP2C19 and reduces clopidogrel effectiveness; use pantoprazole instead",
      "Ticagrelor causes dyspnea as a unique side effect - not a sign of heart failure",
      "Aspirin at ANY dose can cause GI bleeding - concurrent PPI recommended for high-risk patients"
    ],
    quiz: [
      {
        question: "A patient with a drug-eluting stent placed 3 months ago wants to stop clopidogrel due to bruising. What is the nurse's best response?",
        options: [
          "Stopping clopidogrel early after stent placement can cause a life-threatening stent thrombosis",
          "Bruising is abnormal and the medication should be discontinued",
          "The patient can switch to aspirin alone since they have had the stent for 3 months",
          "Applying ice to bruises will resolve the issue and the medication can be stopped"
        ],
        correct: 0,
        rationale: "Drug-eluting stents require a minimum of 12 months of DAPT (aspirin + P2Y12 inhibitor) to prevent stent thrombosis, which can cause acute MI and death. Bruising is an expected side effect. Early discontinuation is the leading cause of stent thrombosis."
      },
      {
        question: "Which PPI should be avoided in a patient taking clopidogrel?",
        options: [
          "Pantoprazole",
          "Omeprazole",
          "Lansoprazole",
          "Esomeprazole"
        ],
        correct: 1,
        rationale: "Omeprazole is a potent inhibitor of CYP2C19, the enzyme required to convert clopidogrel (a prodrug) to its active form. This interaction reduces clopidogrel's antiplatelet effectiveness. Pantoprazole has the least CYP2C19 inhibition and is the preferred PPI."
      }
    ]
  },

  "thrombolytic-therapy": {
    title: "Thrombolytic Therapy",
    cellular: {
      title: "Mechanism of Action: Thrombolytic",
      content: "Thrombolytic agents activate the fibrinolytic system by converting plasminogen to plasmin, a serine protease that degrades fibrin clots. Fibrin is the structural protein that stabilizes blood clots by forming a cross-linked mesh. By dissolving fibrin, thrombolytics restore blood flow through occluded vessels. This process is fundamentally different from anticoagulation (which prevents clot formation) or antiplatelet therapy (which prevents platelet aggregation).\n\nTissue plasminogen activator (tPA/alteplase) is a recombinant form of the naturally occurring enzyme produced by endothelial cells. It preferentially activates plasminogen that is bound to fibrin within clots (fibrin-specific), theoretically limiting systemic fibrinolysis. However, at therapeutic doses, some systemic fibrinolysis still occurs, leading to bleeding risk. Tenecteplase is a modified tPA with longer half-life allowing single bolus dosing.\n\nThe clinical window for thrombolytics is critically time-dependent. In acute STEMI, thrombolytics should be administered within 12 hours of symptom onset (ideal <30 minutes from hospital arrival). In ischemic stroke, tPA must be given within 3-4.5 hours of symptom onset ('time is brain'). For pulmonary embolism, thrombolytics are reserved for massive PE with hemodynamic instability. The primary risk is hemorrhage, particularly intracranial hemorrhage (ICH), which occurs in approximately 0.5-1% of patients and carries high mortality."
    },
    riskFactors: [
      "Active internal bleeding or bleeding diathesis",
      "Recent surgery or trauma within 2-3 weeks",
      "History of hemorrhagic stroke at any time",
      "Uncontrolled severe hypertension (>185/110 mmHg)",
      "Intracranial neoplasm, AVM, or aneurysm",
      "Recent lumbar puncture or arterial puncture at non-compressible site"
    ],
    diagnostics: [
      "Baseline coagulation studies: PT/INR, aPTT, fibrinogen",
      "CBC with platelet count",
      "Type and crossmatch (in case of hemorrhage requiring transfusion)",
      "CT scan of head (stroke) or ECG/troponin (MI) to confirm diagnosis before administration",
      "Serial neurological assessments (NIH Stroke Scale for stroke)"
    ],
    management: [
      "Administer within the therapeutic time window (3-4.5 hours for stroke, 12 hours for STEMI)",
      "Control blood pressure to <185/110 before tPA for stroke",
      "Avoid invasive procedures, IM injections, and venipunctures during and after infusion",
      "Have aminocaproic acid (Amicar) or tranexamic acid available as antidote for fibrinolysis"
    ],
    nursingActions: [
      "Verify absolute and relative contraindications before administration",
      "Perform baseline and serial neurological assessments q15 minutes during infusion",
      "Monitor for signs of bleeding: neuro changes, hypotension, hematuria, guaiac-positive stools",
      "Maintain strict bed rest during infusion and for 24 hours after",
      "Avoid all unnecessary needle sticks, rectal temperatures, and invasive procedures",
      "Apply pressure to all venipuncture sites for at least 20 minutes"
    ],
    signs: {
      left: [
        "Major bleeding (intracranial hemorrhage, GI bleeding)",
        "Minor bleeding (oozing from IV sites, gum bleeding)",
        "Reperfusion dysrhythmias (sign of successful clot lysis)",
        "Hypotension from blood loss"
      ],
      right: [
        "Allergic reaction (rare, more common with streptokinase)",
        "Reocclusion of the vessel",
        "Angioedema (orolingual edema with tPA in stroke)",
        "Fever and nausea"
      ]
    },
    medications: [
      {
        name: "Alteplase (tPA, Activase)",
        type: "Tissue Plasminogen Activator / Thrombolytic",
        action: "Converts fibrin-bound plasminogen to plasmin, which degrades fibrin clots; restores blood flow in occluded vessels",
        sideEffects: "Intracranial hemorrhage, systemic bleeding, reperfusion arrhythmias, angioedema, allergic reactions",
        contra: "Active internal bleeding, recent surgery/trauma, hemorrhagic stroke history, uncontrolled HTN, intracranial pathology",
        pearl: "For stroke: 0.9 mg/kg (max 90 mg), 10% as IV bolus, remainder over 60 minutes. Time window: 3-4.5 hours from symptom onset."
      },
      {
        name: "Tenecteplase (TNKase)",
        type: "Modified Tissue Plasminogen Activator",
        action: "Single-bolus fibrinolytic with enhanced fibrin specificity and longer half-life than alteplase; activates plasminogen to plasmin at the clot surface",
        sideEffects: "Bleeding, intracranial hemorrhage, reperfusion arrhythmias, nausea",
        contra: "Same absolute contraindications as alteplase",
        pearl: "Given as a single IV bolus based on weight - simpler administration than alteplase. Primarily used for STEMI when PCI is not available within 120 minutes."
      }
    ],
    pearls: [
      "'Time is brain' - every minute of ischemic stroke destroys 1.9 million neurons",
      "Aminocaproic acid (Amicar) is the antidote for fibrinolytic-related bleeding",
      "Reperfusion arrhythmias (PVCs, AIVR) after thrombolytic therapy are a GOOD sign - indicates clot lysis",
      "BP must be <185/110 before tPA for stroke; <180/105 during and 24 hours after",
      "Do NOT give aspirin, heparin, or anticoagulants for 24 hours after tPA for stroke"
    ],
    quiz: [
      {
        question: "A patient receiving alteplase for acute ischemic stroke develops sudden onset headache, vomiting, and decreased level of consciousness. What is the nurse's priority action?",
        options: [
          "Increase the IV fluid rate and reassess in 15 minutes",
          "Stop the infusion immediately and prepare for emergent CT scan",
          "Continue the infusion and administer an antiemetic",
          "Lower the head of bed and check blood glucose"
        ],
        correct: 1,
        rationale: "Sudden headache, vomiting, and decreased consciousness during tPA infusion are classic signs of intracranial hemorrhage, the most serious complication. The nurse must stop the infusion immediately and prepare for emergent CT to confirm hemorrhagic conversion. Aminocaproic acid or cryoprecipitate may be needed."
      },
      {
        question: "Which patient is eligible to receive tPA for acute ischemic stroke?",
        options: [
          "A patient whose symptoms started 2 hours ago with blood pressure 170/95 mmHg",
          "A patient whose symptoms started 6 hours ago with blood pressure 150/80 mmHg",
          "A patient whose symptoms started 1 hour ago with blood pressure 200/120 mmHg",
          "A patient whose symptoms started 3 hours ago who had GI surgery 1 week ago"
        ],
        correct: 0,
        rationale: "tPA for ischemic stroke must be given within 3-4.5 hours of symptom onset with BP <185/110. The patient with 2-hour onset and BP 170/95 meets both criteria. The 6-hour patient is outside the window, the 200/120 BP patient needs BP control first, and recent surgery is a contraindication."
      }
    ]
  },

  "oral-hypoglycemics": {
    title: "Oral Hypoglycemics",
    cellular: {
      title: "Mechanism of Action: Oral Hypoglycemic Agents",
      content: "Oral hypoglycemic agents lower blood glucose through various mechanisms targeting different aspects of glucose metabolism. Metformin, the first-line agent for type 2 diabetes, works primarily by activating AMP-activated protein kinase (AMPK) in hepatocytes, which decreases hepatic glucose production (gluconeogenesis) and increases peripheral insulin sensitivity. Unlike sulfonylureas, metformin does NOT stimulate insulin secretion and therefore does not cause hypoglycemia when used alone.\n\nSulfonylureas (glipizide, glyburide, glimepiride) bind to the SUR1 subunit of the ATP-sensitive potassium channel on pancreatic beta cells. This closes the potassium channel, depolarizes the cell membrane, opens voltage-gated calcium channels, and triggers insulin exocytosis from secretory granules. They require functioning beta cells and are ineffective in type 1 diabetes. Because they stimulate insulin release regardless of blood glucose levels, sulfonylureas carry significant hypoglycemia risk.\n\nSGLT2 inhibitors (empagliflozin, dapagliflozin, canagliflozin) represent a newer class that blocks sodium-glucose cotransporter 2 in the proximal renal tubule, preventing glucose reabsorption and causing glucosuria. They lower blood glucose independently of insulin, promote weight loss, and have demonstrated cardiovascular and renal protective benefits. DPP-4 inhibitors (sitagliptin, saxagliptin) prevent degradation of incretin hormones (GLP-1 and GIP), which enhance glucose-dependent insulin secretion and suppress glucagon release."
    },
    riskFactors: [
      "Renal impairment (metformin contraindication for lactic acidosis, dose adjustment for others)",
      "Hepatic disease (impaired drug metabolism and gluconeogenesis)",
      "Heart failure (metformin historically cautioned; SGLT2 inhibitors are beneficial)",
      "History of diabetic ketoacidosis (sulfonylureas ineffective in type 1 DM)",
      "Contrast dye procedures (hold metformin 48 hours before and after)"
    ],
    diagnostics: [
      "Hemoglobin A1C every 3-6 months (target <7% for most adults)",
      "Fasting blood glucose and self-monitoring of blood glucose",
      "Renal function (BUN, creatinine, eGFR) before and during metformin therapy",
      "Liver function tests for hepatically metabolized agents",
      "Serum B12 levels periodically with long-term metformin use"
    ],
    management: [
      "Start metformin as first-line therapy; add second agent if A1C remains above target",
      "Hold metformin 48 hours before and after iodinated contrast procedures",
      "Add SGLT2 inhibitor for patients with heart failure or chronic kidney disease",
      "Educate on signs and symptoms of hypoglycemia and appropriate treatment"
    ],
    nursingActions: [
      "Teach patients to take metformin with food to reduce GI side effects",
      "Monitor blood glucose regularly; educate on hypoglycemia recognition and treatment",
      "Assess renal function before initiating metformin (contraindicated if eGFR <30)",
      "For SGLT2 inhibitors: educate about genital yeast infections and UTI risk",
      "Teach patients on sulfonylureas to always carry a fast-acting glucose source"
    ],
    signs: {
      left: [
        "Hypoglycemia (sulfonylureas): tremor, diaphoresis, tachycardia, confusion",
        "GI disturbances (metformin): nausea, diarrhea, metallic taste",
        "Weight gain (sulfonylureas, thiazolidinediones)",
        "Lactic acidosis (metformin - rare but life-threatening)"
      ],
      right: [
        "Genital mycotic infections (SGLT2 inhibitors - glucosuria)",
        "Urinary tract infections (SGLT2 inhibitors)",
        "Vitamin B12 deficiency (long-term metformin)",
        "Euglycemic DKA (SGLT2 inhibitors - rare)"
      ]
    },
    medications: [
      {
        name: "Metformin (Glucophage)",
        type: "Biguanide",
        action: "Activates AMPK to decrease hepatic gluconeogenesis, increases peripheral insulin sensitivity, and reduces intestinal glucose absorption; does NOT stimulate insulin secretion",
        sideEffects: "GI upset (nausea, diarrhea, metallic taste), lactic acidosis (rare), vitamin B12 deficiency",
        contra: "eGFR <30, metabolic acidosis, severe hepatic disease, active alcohol abuse, within 48 hours of IV contrast",
        pearl: "First-line for type 2 DM. Does NOT cause hypoglycemia when used alone. Weight-neutral to slight weight loss. Hold before contrast dye."
      },
      {
        name: "Glipizide (Glucotrol)",
        type: "Second-generation Sulfonylurea",
        action: "Binds SUR1 subunit on pancreatic beta cell K-ATP channels, causing depolarization and insulin release independent of glucose levels",
        sideEffects: "Hypoglycemia, weight gain, GI upset, disulfiram-like reaction with alcohol",
        contra: "Type 1 diabetes, DKA, severe renal or hepatic impairment, sulfonamide allergy (cross-reactivity debated)",
        pearl: "Take 30 minutes before meals for optimal effect. Shorter-acting than glyburide with lower hypoglycemia risk. Requires functioning beta cells."
      },
      {
        name: "Empagliflozin (Jardiance)",
        type: "SGLT2 Inhibitor",
        action: "Blocks SGLT2 in the proximal tubule, preventing glucose reabsorption and causing glycosuria; reduces blood glucose independently of insulin",
        sideEffects: "Genital yeast infections, UTIs, dehydration, hypotension, euglycemic DKA (rare)",
        contra: "Severe renal impairment (reduced efficacy), type 1 diabetes, history of DKA",
        pearl: "Proven cardiovascular mortality benefit (EMPA-REG trial). Promotes weight loss and blood pressure reduction. Monitor for Fournier gangrene (rare necrotizing fasciitis)."
      }
    ],
    pearls: [
      "Metformin does NOT cause hypoglycemia alone - it's the safest first-line agent",
      "Hold metformin 48 hours before AND after contrast dye - risk of lactic acidosis",
      "Sulfonylureas are the oral agents MOST likely to cause hypoglycemia",
      "SGLT2 inhibitors cause glucose in urine - patients may test positive for glucosuria (this is the mechanism, not an adverse effect)",
      "Rule of 15: treat hypoglycemia with 15g fast-acting carbs, wait 15 minutes, recheck glucose"
    ],
    quiz: [
      {
        question: "A patient taking metformin is scheduled for a CT scan with IV contrast. What instruction should the nurse provide?",
        options: [
          "Continue metformin as usual before and after the procedure",
          "Hold metformin for 48 hours before and after the contrast procedure",
          "Take an extra dose of metformin the morning of the procedure",
          "Switch to insulin for one week around the procedure"
        ],
        correct: 1,
        rationale: "Metformin must be held 48 hours before and after iodinated contrast dye procedures because contrast can impair renal function, and metformin accumulation in the setting of renal impairment increases the risk of lactic acidosis, a rare but life-threatening complication."
      },
      {
        question: "Which oral hypoglycemic carries the highest risk of hypoglycemia?",
        options: [
          "Metformin",
          "Sitagliptin",
          "Glyburide",
          "Empagliflozin"
        ],
        correct: 2,
        rationale: "Sulfonylureas (glyburide, glipizide, glimepiride) stimulate insulin release from pancreatic beta cells regardless of blood glucose levels, making them the oral agents with the highest risk of hypoglycemia. Glyburide has the longest duration and highest hypoglycemia risk among sulfonylureas."
      }
    ]
  },

  "opioid-analgesics-comparison": {
    title: "Opioid Analgesics Comparison",
    cellular: {
      title: "Mechanism of Action: Opioid Analgesics",
      content: "Opioid analgesics exert their effects by binding to opioid receptors (mu, kappa, and delta) in the central and peripheral nervous system. The mu receptor is the primary target for analgesic effects and is densely concentrated in the periaqueductal gray matter, rostral ventromedial medulla, and dorsal horn of the spinal cord. When an opioid agonist binds to the mu receptor (a G-protein coupled receptor), it activates inhibitory G-proteins that close voltage-gated calcium channels and open potassium channels, hyperpolarizing the neuron and inhibiting neurotransmitter release.\n\nThis molecular mechanism prevents the transmission of nociceptive (pain) signals at multiple levels: peripherally at nociceptor terminals, at the spinal cord dorsal horn (presynaptic inhibition of substance P and glutamate release), and supraspinally in the brain (activation of descending inhibitory pathways). Mu receptor activation also produces euphoria (nucleus accumbens), respiratory depression (brainstem respiratory centers), cough suppression (medullary cough center), miosis (Edinger-Westphal nucleus), and decreased GI motility (enteric nervous system).\n\nOpioids vary in their receptor binding profiles, potency, and pharmacokinetics. Morphine is the reference standard for equianalgesic dosing. Fentanyl is 50-100 times more potent than morphine due to its high lipophilicity and rapid CNS penetration. Hydromorphone is 5-7 times more potent than morphine. Understanding equianalgesic dosing is critical for safe dose conversion when switching between opioids. Opioid tolerance develops through receptor desensitization and downregulation with chronic use."
    },
    riskFactors: [
      "Respiratory depression (dose-related, most dangerous adverse effect)",
      "History of substance use disorder (high abuse potential)",
      "Concurrent CNS depressant use (benzodiazepines, alcohol - additive respiratory depression)",
      "Hepatic or renal impairment (altered metabolism and excretion)",
      "Elderly patients (increased sensitivity, reduced clearance)",
      "Obstructive sleep apnea (baseline respiratory compromise)"
    ],
    diagnostics: [
      "Pain assessment using validated scales (numeric, FACES, FLACC for nonverbal)",
      "Respiratory rate, depth, and oxygen saturation monitoring",
      "Level of sedation assessment (Pasero Opioid Sedation Scale)",
      "Bowel function assessment (constipation is universal with chronic use)",
      "Urine drug screening when indicated"
    ],
    management: [
      "Use the lowest effective dose for the shortest duration",
      "Implement multimodal analgesia to reduce opioid requirements",
      "Initiate bowel regimen (stimulant laxative + stool softener) with all chronic opioid orders",
      "Have naloxone readily available for respiratory depression",
      "Use equianalgesic tables for safe opioid rotation"
    ],
    nursingActions: [
      "Assess respiratory rate before each dose; hold if RR <12/min and notify provider",
      "Monitor sedation level - excessive sedation precedes respiratory depression",
      "Assess pain level before and 30-60 minutes after administration",
      "Implement fall precautions due to sedation, dizziness, and orthostatic hypotension",
      "Educate patients on constipation prevention and avoiding alcohol/CNS depressants"
    ],
    signs: {
      left: [
        "Respiratory depression (most serious adverse effect)",
        "Sedation and drowsiness",
        "Constipation (most common chronic side effect)",
        "Nausea and vomiting (CTZ stimulation)"
      ],
      right: [
        "Miosis (pinpoint pupils - diagnostic sign of opioid use)",
        "Urinary retention (smooth muscle relaxation)",
        "Pruritus (histamine release, especially morphine)",
        "Hypotension and bradycardia"
      ]
    },
    medications: [
      {
        name: "Morphine",
        type: "Full Mu Opioid Agonist (Reference Standard)",
        action: "Binds mu opioid receptors in the CNS and peripheral nervous system; inhibits pain signal transmission, produces analgesia, sedation, and euphoria",
        sideEffects: "Respiratory depression, constipation, nausea, sedation, pruritus, hypotension, urinary retention",
        contra: "Severe respiratory depression, acute or severe asthma, GI obstruction, concurrent MAO inhibitor use",
        pearl: "Reference standard for equianalgesic dosing (10 mg IV = 30 mg PO). Releases histamine - may cause hypotension and pruritus. Avoid in renal failure (active metabolite accumulates)."
      },
      {
        name: "Fentanyl",
        type: "Synthetic Full Mu Opioid Agonist",
        action: "Highly lipophilic mu receptor agonist with rapid onset; 50-100 times more potent than morphine on a microgram basis",
        sideEffects: "Respiratory depression, bradycardia, muscle rigidity (IV), sedation, constipation",
        contra: "Severe respiratory depression, acute or severe asthma, opioid-naive patients (for transdermal patch)",
        pearl: "Transdermal patch takes 12-24 hours to reach peak effect - NOT for acute pain. IV onset 1-2 minutes. Chest wall rigidity can occur with rapid IV push."
      },
      {
        name: "Naloxone (Narcan)",
        type: "Opioid Antagonist (Antidote)",
        action: "Competitively binds to and displaces opioids from mu, kappa, and delta receptors; reverses respiratory depression, sedation, and analgesia",
        sideEffects: "Acute opioid withdrawal symptoms, pain (reversal of analgesia), tachycardia, hypertension, pulmonary edema",
        contra: "Use cautiously in opioid-dependent patients (precipitates withdrawal)",
        pearl: "Duration shorter than most opioids (30-90 minutes) - patient may re-sedate after naloxone wears off. Must monitor for renarcotization. Titrate to respiratory rate, not consciousness."
      }
    ],
    pearls: [
      "Naloxone lasts 30-90 minutes; most opioids last 3-6 hours - ALWAYS monitor for renarcotization",
      "Constipation is the ONE opioid side effect to which patients do NOT develop tolerance",
      "Sedation precedes respiratory depression - monitor sedation levels as early warning",
      "Morphine 10 mg IV = 30 mg PO = fentanyl 100 mcg IV (equianalgesic reference)",
      "Fentanyl patch is for chronic pain ONLY - never for opioid-naive patients or acute pain"
    ],
    quiz: [
      {
        question: "A patient receiving IV morphine has a respiratory rate of 8 breaths/min and is difficult to arouse. After administering naloxone, the patient becomes alert with RR 16. What is the MOST important nursing action?",
        options: [
          "Document the event and discontinue all opioid orders",
          "Continue monitoring closely because naloxone has a shorter duration than morphine",
          "Administer another dose of naloxone to prevent recurrence",
          "Resume morphine at a lower dose in 30 minutes"
        ],
        correct: 1,
        rationale: "Naloxone has a shorter duration of action (30-90 minutes) than morphine (3-6 hours). The patient is at risk for renarcotization (return of respiratory depression) once naloxone wears off. Continuous monitoring is the priority."
      },
      {
        question: "Which opioid side effect requires prophylactic treatment initiation with the first dose?",
        options: [
          "Nausea",
          "Sedation",
          "Constipation",
          "Pruritus"
        ],
        correct: 2,
        rationale: "Constipation is the most common chronic opioid side effect and the only one to which patients do NOT develop tolerance. A bowel regimen (stimulant laxative + stool softener) should be initiated when chronic opioid therapy begins, not after constipation develops."
      }
    ]
  },

  "corticosteroid-therapy": {
    title: "Corticosteroid Therapy",
    cellular: {
      title: "Mechanism of Action: Corticosteroids",
      content: "Corticosteroids are synthetic analogs of cortisol, the primary glucocorticoid produced by the adrenal cortex under hypothalamic-pituitary-adrenal (HPA) axis regulation. At the cellular level, corticosteroids cross the cell membrane and bind to the glucocorticoid receptor (GR) in the cytoplasm. The activated GR-steroid complex translocates to the nucleus, where it acts as a transcription factor, upregulating anti-inflammatory proteins (lipocortin-1, IL-10) and downregulating pro-inflammatory mediators (cytokines, prostaglandins, leukotrienes, histamine).\n\nLipocortin-1 (annexin A1) inhibits phospholipase A2, preventing the release of arachidonic acid from cell membrane phospholipids. This blocks BOTH the cyclooxygenase (COX) and lipoxygenase pathways simultaneously, which is why corticosteroids are more potent anti-inflammatory agents than NSAIDs (which only block COX). Corticosteroids also suppress lymphocyte proliferation, reduce antibody production, inhibit macrophage antigen presentation, and decrease migration of inflammatory cells to sites of injury.\n\nChronic exogenous corticosteroid use suppresses the HPA axis through negative feedback, reducing endogenous ACTH and cortisol production. Abrupt discontinuation can precipitate adrenal crisis (acute adrenal insufficiency), which presents with hypotension, shock, hyperkalemia, hyponatremia, and hypoglycemia. This is why corticosteroids must be tapered gradually. Corticosteroids also affect multiple metabolic processes: increasing gluconeogenesis (hyperglycemia), promoting protein catabolism, redistributing fat (Cushingoid features), and increasing calcium excretion (osteoporosis risk)."
    },
    riskFactors: [
      "Immunosuppression and increased infection susceptibility",
      "Peptic ulcer disease (reduced mucosal protection)",
      "Diabetes mellitus (steroid-induced hyperglycemia)",
      "Osteoporosis (calcium wasting and bone matrix breakdown)",
      "Psychiatric disturbances (steroid psychosis, mood changes)",
      "Adrenal suppression with chronic use (>2 weeks)"
    ],
    diagnostics: [
      "Blood glucose monitoring (steroid-induced hyperglycemia)",
      "WBC count (corticosteroids cause leukocytosis without infection)",
      "Bone density screening (DEXA scan) for chronic use",
      "Serum potassium and sodium levels",
      "Cortisol levels and ACTH stimulation test if adrenal insufficiency suspected"
    ],
    management: [
      "Use the lowest effective dose for the shortest duration",
      "Taper gradually after >2 weeks of use to prevent adrenal crisis",
      "Supplement calcium and vitamin D for bone protection during chronic use",
      "Monitor blood glucose and adjust diabetic medications accordingly",
      "Administer with food or PPI for GI protection"
    ],
    nursingActions: [
      "NEVER abruptly discontinue corticosteroids after chronic use - must taper",
      "Monitor blood glucose every 4-6 hours, especially in diabetic patients",
      "Assess for signs of infection (may be masked by immunosuppression)",
      "Educate patient to avoid live vaccines during therapy",
      "Monitor for Cushingoid signs: moon face, buffalo hump, striae, weight gain",
      "Teach patient to carry steroid emergency card"
    ],
    signs: {
      left: [
        "Hyperglycemia (increased gluconeogenesis)",
        "Immunosuppression (increased infection risk)",
        "Weight gain and fluid retention",
        "Mood changes (euphoria, insomnia, psychosis)"
      ],
      right: [
        "Cushingoid features (moon face, buffalo hump, truncal obesity)",
        "Osteoporosis and pathological fractures",
        "GI bleeding (decreased prostaglandin-mediated mucosal protection)",
        "Adrenal suppression (with chronic use)"
      ]
    },
    medications: [
      {
        name: "Prednisone",
        type: "Intermediate-acting Glucocorticoid (Oral)",
        action: "Binds glucocorticoid receptors to suppress inflammatory and immune responses; inhibits phospholipase A2 via lipocortin-1 induction; blocks COX and LOX pathways",
        sideEffects: "Hyperglycemia, weight gain, osteoporosis, immunosuppression, Cushingoid features, mood changes, GI irritation",
        contra: "Systemic fungal infections, live vaccine administration, active untreated infections",
        pearl: "Prodrug converted to prednisolone by the liver. Must taper if used >2 weeks. Give in the morning to mimic normal cortisol rhythm and minimize insomnia."
      },
      {
        name: "Methylprednisolone (Solu-Medrol)",
        type: "Intermediate-acting Glucocorticoid (IV/IM)",
        action: "Potent anti-inflammatory and immunosuppressive effects via glucocorticoid receptor activation; used for acute exacerbations requiring rapid onset",
        sideEffects: "Hyperglycemia, infection risk, GI bleeding, fluid retention, insomnia, psychosis",
        contra: "Systemic fungal infections, IM route in patients on anticoagulants",
        pearl: "IV form used for acute asthma exacerbation, COPD exacerbation, MS flares, and transplant rejection. 4 mg methylprednisolone = 5 mg prednisone (equianalgesic)."
      }
    ],
    pearls: [
      "NEVER stop corticosteroids abruptly after >2 weeks of use - risk of life-threatening adrenal crisis",
      "Corticosteroids mask infection signs (fever, inflammation) - the patient may appear well despite active infection",
      "Steroid-induced hyperglycemia may require insulin therapy even in non-diabetic patients",
      "Give oral corticosteroids in the MORNING to mimic the body's natural cortisol peak",
      "WBC elevation from steroids is from demargination of neutrophils, NOT infection"
    ],
    quiz: [
      {
        question: "A patient who has been taking prednisone 40 mg daily for 3 weeks asks if they can stop the medication. What is the nurse's best response?",
        options: [
          "Yes, you can stop it today since the course is complete",
          "No, prednisone must be tapered gradually to prevent adrenal crisis",
          "You can stop it if you feel well and have no symptoms",
          "Switch to an over-the-counter anti-inflammatory instead"
        ],
        correct: 1,
        rationale: "After more than 2 weeks of exogenous corticosteroid therapy, the HPA axis is suppressed and the adrenal glands are not producing adequate cortisol. Abrupt discontinuation can cause adrenal crisis with hypotension, shock, and death. The dose must be gradually tapered to allow adrenal recovery."
      },
      {
        question: "Which nursing assessment is MOST important for a diabetic patient starting prednisone?",
        options: [
          "Daily weight measurements",
          "Blood glucose monitoring every 4-6 hours",
          "Skin assessment for rashes",
          "Lung auscultation for adventitious sounds"
        ],
        correct: 1,
        rationale: "Corticosteroids increase hepatic gluconeogenesis and decrease peripheral glucose utilization, causing significant hyperglycemia. Diabetic patients are at high risk for dangerously elevated blood glucose levels and may require insulin dose adjustments or supplemental insulin."
      }
    ]
  },

  "bronchodilator-therapy": {
    title: "Bronchodilator Therapy",
    cellular: {
      title: "Mechanism of Action: Bronchodilators",
      content: "Bronchodilators relax bronchial smooth muscle to increase airway diameter and airflow. There are two primary classes: beta-2 adrenergic agonists and anticholinergics (antimuscarinics), each targeting different receptors on bronchial smooth muscle cells.\n\nBeta-2 agonists (albuterol, salmeterol, formoterol) bind to beta-2 adrenergic receptors on bronchial smooth muscle cells. This activates adenylyl cyclase via stimulatory G-proteins, increasing intracellular cyclic AMP (cAMP). Elevated cAMP activates protein kinase A, which phosphorylates myosin light chain kinase, preventing it from facilitating actin-myosin cross-bridge formation. The result is smooth muscle relaxation and bronchodilation. Short-acting beta-2 agonists (SABAs) like albuterol provide rapid relief within 5-15 minutes and last 4-6 hours. Long-acting beta-2 agonists (LABAs) like salmeterol have slower onset but last 12 hours.\n\nAnticholinergic bronchodilators (ipratropium, tiotropium) block muscarinic M3 receptors on bronchial smooth muscle, preventing acetylcholine-mediated bronchoconstriction. The parasympathetic nervous system normally maintains a baseline bronchomotor tone through vagal stimulation of M3 receptors, which increases intracellular calcium and causes contraction. By blocking this pathway, anticholinergics reduce bronchoconstriction, particularly in COPD where parasympathetic tone is increased. Tiotropium is a long-acting agent (24-hour duration) that is first-line maintenance therapy for COPD."
    },
    riskFactors: [
      "Tachycardia and cardiac dysrhythmias (beta-2 agonists - cross-reactivity with beta-1)",
      "Hypokalemia (beta-2 agonists drive potassium intracellularly)",
      "Tremor and nervousness (beta-2 stimulation of skeletal muscle)",
      "Glaucoma (anticholinergics - increased intraocular pressure)",
      "Urinary retention (anticholinergics - bladder smooth muscle relaxation)"
    ],
    diagnostics: [
      "Peak expiratory flow (PEF) measurements before and after treatment",
      "Pulse oximetry and ABG analysis",
      "Pulmonary function tests (spirometry - FEV1 response to bronchodilator)",
      "Heart rate and rhythm monitoring during administration",
      "Serum potassium levels with frequent beta-2 agonist use"
    ],
    management: [
      "SABAs (albuterol) for acute rescue; LABAs (salmeterol) for maintenance only",
      "Never use a LABA as monotherapy in asthma - must combine with inhaled corticosteroid",
      "Anticholinergics are first-line maintenance for COPD; secondary role in asthma",
      "Teach proper inhaler technique - 80% of patients use inhalers incorrectly"
    ],
    nursingActions: [
      "Assess breath sounds before and after administration",
      "Monitor heart rate and report tachycardia >120 bpm",
      "Teach proper MDI technique: shake, exhale, inhale slowly, hold breath 10 seconds",
      "When using multiple inhalers: bronchodilator FIRST, then corticosteroid (opens airways for steroid delivery)",
      "Instruct patient to rinse mouth after inhaled corticosteroids (prevent oral candidiasis)",
      "Educate that rescue inhaler use >2 times/week indicates uncontrolled asthma"
    ],
    signs: {
      left: [
        "Tachycardia (beta-2 agonists cross-reacting with cardiac beta-1 receptors)",
        "Tremor of hands and fingers (skeletal muscle beta-2 stimulation)",
        "Nervousness and restlessness",
        "Hypokalemia with frequent use"
      ],
      right: [
        "Dry mouth (anticholinergics)",
        "Urinary retention (anticholinergics)",
        "Paradoxical bronchospasm (rare, with MDI use)",
        "Palpitations and arrhythmias"
      ]
    },
    medications: [
      {
        name: "Albuterol (Ventolin, ProAir)",
        type: "Short-Acting Beta-2 Agonist (SABA) / Rescue Inhaler",
        action: "Selectively stimulates beta-2 receptors on bronchial smooth muscle, increasing cAMP and producing rapid bronchodilation; onset 5-15 minutes, duration 4-6 hours",
        sideEffects: "Tachycardia, tremor, nervousness, hypokalemia, palpitations",
        contra: "Hypersensitivity to albuterol, use with caution in cardiovascular disease",
        pearl: "First-line rescue medication for acute bronchospasm. Using rescue inhaler >2 days/week means asthma is NOT controlled and maintenance therapy needs adjustment."
      },
      {
        name: "Tiotropium (Spiriva)",
        type: "Long-Acting Anticholinergic (Muscarinic Antagonist - LAMA)",
        action: "Blocks M3 muscarinic receptors on bronchial smooth muscle, preventing parasympathetic-mediated bronchoconstriction; 24-hour duration allows once-daily dosing",
        sideEffects: "Dry mouth, constipation, urinary retention, blurred vision, glaucoma exacerbation",
        contra: "Narrow-angle glaucoma, urinary retention, hypersensitivity to atropine derivatives",
        pearl: "First-line maintenance therapy for COPD. Inhaled - minimal systemic anticholinergic effects. Do NOT use for acute rescue; too slow in onset."
      }
    ],
    pearls: [
      "Albuterol = RESCUE; Salmeterol = MAINTENANCE. Never use a LABA for acute attacks",
      "When using bronchodilator + inhaled steroid: use BRONCHODILATOR FIRST to open airways",
      "LABA monotherapy in asthma is associated with increased asthma-related death - always combine with ICS",
      "Anticholinergics are preferred for COPD; beta-2 agonists are preferred for asthma",
      "Teach inhaler technique at every visit - shake, exhale fully, slow deep breath, hold 10 seconds"
    ],
    quiz: [
      {
        question: "A patient with asthma is prescribed both albuterol and fluticasone inhalers. Which should the nurse instruct the patient to use first?",
        options: [
          "Fluticasone first, then albuterol 5 minutes later",
          "Albuterol first, then fluticasone 1-2 minutes later",
          "Both can be used simultaneously through a nebulizer",
          "Either can be used first; the order does not matter"
        ],
        correct: 1,
        rationale: "The bronchodilator (albuterol) should be used FIRST to open the airways, followed by the inhaled corticosteroid (fluticasone) 1-2 minutes later. This allows the steroid to reach deeper into the airways for maximum anti-inflammatory effect."
      },
      {
        question: "A patient uses their albuterol rescue inhaler 5 times per week. What does this indicate?",
        options: [
          "The patient is using the inhaler appropriately for symptom relief",
          "The patient's asthma is not adequately controlled and maintenance therapy needs adjustment",
          "The albuterol dose should be increased to prevent symptoms",
          "The patient should switch from albuterol to a long-acting beta agonist for rescue"
        ],
        correct: 1,
        rationale: "Using a rescue inhaler more than 2 days per week is a sign of uncontrolled asthma according to NAEPP guidelines. This indicates the patient needs step-up therapy with an inhaled corticosteroid or adjustment of current maintenance therapy, not just continued rescue inhaler use."
      }
    ]
  },

  "antidepressant-classes": {
    title: "Antidepressant Classes",
    cellular: {
      title: "Mechanism of Action: Antidepressant",
      content: "Antidepressant medications primarily work by modulating monoamine neurotransmitter levels (serotonin, norepinephrine, and dopamine) in the synaptic cleft of CNS neurons. The monoamine hypothesis of depression proposes that depression results from deficient monoaminergic neurotransmission, and antidepressants correct this by increasing neurotransmitter availability.\n\nSelective serotonin reuptake inhibitors (SSRIs) - fluoxetine, sertraline, paroxetine, escitalopram - selectively block the serotonin transporter (SERT) on the presynaptic neuron, preventing reuptake of serotonin from the synaptic cleft. This increases serotonin concentration and enhances serotonergic neurotransmission. SSRIs have minimal effect on norepinephrine and dopamine transporters, which accounts for their more favorable side effect profile compared to older antidepressants. However, therapeutic effects take 2-6 weeks to manifest due to gradual downregulation of presynaptic autoreceptors.\n\nSerotonin-norepinephrine reuptake inhibitors (SNRIs) - venlafaxine, duloxetine - block both SERT and the norepinephrine transporter (NET), increasing levels of both serotonin and norepinephrine. This dual action may provide additional benefit for patients with comorbid pain syndromes. Tricyclic antidepressants (TCAs) - amitriptyline, nortriptyline - also block serotonin and norepinephrine reuptake but additionally block histamine (H1), alpha-1 adrenergic, and muscarinic cholinergic receptors, causing significant side effects. MAO inhibitors prevent the enzymatic breakdown of monoamines but require strict dietary tyramine restrictions due to risk of hypertensive crisis."
    },
    riskFactors: [
      "Suicidal ideation (FDA black box warning for ages <25, especially during first weeks)",
      "Serotonin syndrome risk with multiple serotonergic agents",
      "Seizure risk with some agents (bupropion at high doses)",
      "QT prolongation (TCAs, some SSRIs at high doses)",
      "Hypertensive crisis with MAOIs and tyramine-containing foods"
    ],
    diagnostics: [
      "Baseline ECG for patients starting TCAs (QT prolongation risk)",
      "Serum sodium monitoring (SSRIs can cause SIADH/hyponatremia, especially in elderly)",
      "Liver function tests for hepatically metabolized agents",
      "PHQ-9 or similar validated depression screening tool for treatment response",
      "TCA serum levels for toxicity monitoring"
    ],
    management: [
      "Allow 2-6 weeks for therapeutic effect before adjusting dose",
      "Monitor for increased suicidality in first 1-4 weeks of treatment",
      "Taper antidepressants gradually to prevent discontinuation syndrome",
      "Avoid combining serotonergic medications (SSRI + SNRI, SSRI + MAOI) - serotonin syndrome risk",
      "Wait 14 days after stopping MAOI before starting SSRI (washout period)"
    ],
    nursingActions: [
      "Assess for suicidal ideation at each visit, especially during first weeks of therapy",
      "Educate that therapeutic effects take 2-6 weeks - do not discontinue early",
      "Monitor for serotonin syndrome: agitation, hyperthermia, clonus, diaphoresis, tremor",
      "For MAOIs: teach strict tyramine avoidance (aged cheeses, cured meats, draft beer, soy sauce)",
      "Educate about discontinuation syndrome if medication is stopped abruptly (flu-like symptoms, brain zaps)"
    ],
    signs: {
      left: [
        "Serotonin syndrome: hyperthermia, agitation, clonus, diaphoresis, tremor",
        "Sexual dysfunction (SSRIs - decreased libido, anorgasmia)",
        "GI effects: nausea, diarrhea (SSRIs), constipation (TCAs)",
        "Increased suicidal ideation (first 1-4 weeks, FDA black box warning)"
      ],
      right: [
        "Weight gain (TCAs, mirtazapine, paroxetine)",
        "Anticholinergic effects (TCAs: dry mouth, urinary retention, constipation, blurred vision)",
        "Orthostatic hypotension (TCAs, MAOIs)",
        "Hypertensive crisis (MAOIs with tyramine - severe headache, stiff neck, diaphoresis)"
      ]
    },
    medications: [
      {
        name: "Sertraline (Zoloft)",
        type: "Selective Serotonin Reuptake Inhibitor (SSRI)",
        action: "Selectively blocks serotonin reuptake transporter (SERT), increasing serotonin availability in the synaptic cleft",
        sideEffects: "Nausea, diarrhea, sexual dysfunction, insomnia, headache, weight changes",
        contra: "Concurrent MAOI use (14-day washout required), concurrent pimozide, disulfiram (oral concentrate contains alcohol)",
        pearl: "Most commonly prescribed antidepressant. Safe in pregnancy (most studied SSRI). Also FDA-approved for OCD, PTSD, panic disorder, and social anxiety disorder."
      },
      {
        name: "Venlafaxine (Effexor XR)",
        type: "Serotonin-Norepinephrine Reuptake Inhibitor (SNRI)",
        action: "Blocks both serotonin and norepinephrine reuptake; at low doses primarily serotonergic, dual action at higher doses",
        sideEffects: "Nausea, headache, dizziness, hypertension (dose-related), sexual dysfunction, discontinuation syndrome",
        contra: "Concurrent MAOI use, uncontrolled hypertension",
        pearl: "Dose-related blood pressure elevation - monitor BP. Has the most severe discontinuation syndrome of all antidepressants ('brain zaps'). Never stop abruptly."
      },
      {
        name: "Amitriptyline (Elavil)",
        type: "Tricyclic Antidepressant (TCA)",
        action: "Blocks reuptake of serotonin and norepinephrine; also blocks histamine H1, alpha-1, and muscarinic receptors causing sedation, hypotension, and anticholinergic effects",
        sideEffects: "Sedation, weight gain, orthostatic hypotension, anticholinergic effects (dry mouth, constipation, urinary retention, blurred vision), cardiac conduction delays",
        contra: "Recent MI, concurrent MAOIs, narrow-angle glaucoma, urinary retention",
        pearl: "Lethal in overdose (cardiac toxicity - widened QRS, arrhythmias). Treat TCA overdose with sodium bicarbonate. Also used for neuropathic pain and migraine prophylaxis."
      }
    ],
    pearls: [
      "SSRIs are first-line for depression due to safety profile - TCAs are lethal in overdose",
      "Serotonin syndrome triad: altered mental status + autonomic instability + neuromuscular excitability",
      "FDA BLACK BOX WARNING: all antidepressants increase suicidal ideation in patients <25 years old",
      "MAOIs require 14-day washout before starting any serotonergic medication",
      "TCA overdose treatment: IV sodium bicarbonate for cardiac toxicity (widened QRS)"
    ],
    quiz: [
      {
        question: "A patient taking sertraline is prescribed tramadol for pain. What should the nurse be most concerned about?",
        options: [
          "Increased sedation",
          "Serotonin syndrome",
          "Decreased antidepressant efficacy",
          "Liver toxicity"
        ],
        correct: 1,
        rationale: "Tramadol has serotonergic activity in addition to its opioid effects. Combining it with an SSRI (sertraline) increases the risk of serotonin syndrome, characterized by hyperthermia, agitation, clonus, diaphoresis, and potentially fatal autonomic instability."
      },
      {
        question: "A patient started on an SSRI 5 days ago reports improved energy but continues to feel hopeless. The nurse notes the patient is now more alert and active. What is the nurse's priority concern?",
        options: [
          "The medication is not working and should be changed",
          "The patient may now have enough energy to act on suicidal thoughts",
          "The patient is experiencing a manic episode",
          "The SSRI dose is too high and should be reduced"
        ],
        correct: 1,
        rationale: "In the early weeks of antidepressant therapy, energy and motivation may improve before mood fully lifts. This creates a dangerous window where a previously too depressed to act patient now has enough energy to potentially act on persistent suicidal ideation. Close monitoring is essential."
      }
    ]
  },

  "mood-stabilizers": {
    title: "Mood Stabilizers",
    cellular: {
      title: "Mechanism of Action: Mood Stabilizers",
      content: "Mood stabilizers are used primarily in bipolar disorder to prevent and treat manic and depressive episodes. Lithium, the gold standard mood stabilizer, has a complex mechanism that is not fully understood. It is believed to modulate multiple intracellular signaling pathways: inhibiting inositol monophosphatase (reducing phosphatidylinositol signaling), inhibiting glycogen synthase kinase-3 beta (GSK-3B), and modulating neurotransmitter release and receptor sensitivity.\n\nAt the cellular level, lithium substitutes for sodium in neuronal ion channels due to its similar ionic radius, but it is not efficiently pumped out by the Na+/K+ ATPase pump, leading to intracellular accumulation. This affects membrane potential stability and neuronal excitability. Lithium also increases serotonergic neurotransmission and has neuroprotective properties by promoting brain-derived neurotrophic factor (BDNF) expression. The therapeutic index of lithium is extremely narrow (0.6-1.2 mEq/L therapeutic; >1.5 mEq/L toxic), making careful monitoring essential.\n\nAnticonvulsants used as mood stabilizers (valproic acid, carbamazepine, lamotrigine) stabilize neuronal membranes through various mechanisms. Valproic acid increases GABA levels by inhibiting GABA transaminase and blocking voltage-gated sodium channels. Carbamazepine blocks sodium channels and reduces glutamate release. Lamotrigine primarily blocks voltage-sensitive sodium channels and inhibits release of excitatory amino acids (glutamate), and is particularly effective for bipolar depression prevention."
    },
    riskFactors: [
      "Narrow therapeutic index (lithium toxicity at levels >1.5 mEq/L)",
      "Renal impairment (lithium is exclusively renally excreted)",
      "Dehydration and sodium depletion (concentrate lithium and increase toxicity)",
      "Drug interactions: NSAIDs, ACE inhibitors, diuretics increase lithium levels",
      "Pregnancy (lithium: Ebstein anomaly; valproic acid: neural tube defects)"
    ],
    diagnostics: [
      "Lithium serum levels every 5-7 days during initiation, then monthly (therapeutic: 0.6-1.2 mEq/L)",
      "Renal function (BUN, creatinine) - lithium is nephrotoxic with chronic use",
      "Thyroid function tests (lithium causes hypothyroidism in 20-30% of patients)",
      "CBC and liver function tests for valproic acid",
      "Pregnancy testing before starting valproic acid (teratogenic - neural tube defects)"
    ],
    management: [
      "Draw lithium levels 12 hours after last dose (trough level)",
      "Maintain adequate sodium and fluid intake to prevent lithium toxicity",
      "Avoid NSAIDs, thiazide diuretics, and ACE inhibitors (increase lithium levels)",
      "Monitor for signs of lithium toxicity: tremor, nausea, diarrhea, confusion, ataxia"
    ],
    nursingActions: [
      "Monitor lithium levels closely; therapeutic range 0.6-1.2 mEq/L",
      "Teach patient to maintain consistent sodium and fluid intake",
      "Assess for early signs of toxicity: fine tremor, GI symptoms, polyuria, polydipsia",
      "Educate about drug interactions that increase lithium levels (NSAIDs, diuretics, ACE inhibitors)",
      "Monitor thyroid and renal function regularly with chronic lithium use",
      "For valproic acid: monitor liver function and CBC; assess for hepatotoxicity"
    ],
    signs: {
      left: [
        "Early lithium toxicity (1.5-2.0 mEq/L): coarse tremor, nausea, vomiting, diarrhea",
        "Moderate toxicity (2.0-2.5 mEq/L): confusion, ataxia, blurred vision, tinnitus",
        "Severe toxicity (>2.5 mEq/L): seizures, coma, cardiovascular collapse",
        "Nephrogenic diabetes insipidus (polyuria, polydipsia)"
      ],
      right: [
        "Hypothyroidism (lithium - goiter, fatigue, weight gain)",
        "Hepatotoxicity (valproic acid)",
        "Stevens-Johnson syndrome (lamotrigine - especially with rapid titration)",
        "Fine hand tremor (therapeutic levels - benign)"
      ]
    },
    medications: [
      {
        name: "Lithium (Lithobid)",
        type: "Mood Stabilizer (Alkali Metal)",
        action: "Modulates intracellular signaling (inhibits inositol monophosphatase and GSK-3B), stabilizes neuronal membranes, enhances serotonergic transmission, and provides neuroprotection",
        sideEffects: "Fine tremor, polyuria, polydipsia, weight gain, hypothyroidism, GI upset, nephrogenic DI",
        contra: "Severe renal impairment, severe cardiovascular disease, severe dehydration or sodium depletion",
        pearl: "Narrowest therapeutic index in psychiatry (0.6-1.2 mEq/L). Draw levels 12 hours after last dose. Dehydration and low sodium INCREASE lithium levels. Only mood stabilizer proven to reduce suicide risk."
      },
      {
        name: "Valproic Acid (Depakote)",
        type: "Anticonvulsant / Mood Stabilizer",
        action: "Increases GABA concentration by inhibiting GABA transaminase; blocks voltage-gated sodium channels to stabilize neuronal membranes",
        sideEffects: "GI upset, weight gain, tremor, hair loss, hepatotoxicity, thrombocytopenia, pancreatitis",
        contra: "Hepatic disease, pregnancy (neural tube defects - category X), urea cycle disorders, mitochondrial disorders",
        pearl: "Therapeutic level 50-125 mcg/mL. Most effective for acute mania and rapid cycling bipolar. Black box warnings for hepatotoxicity, pancreatitis, and teratogenicity."
      }
    ],
    pearls: [
      "Lithium therapeutic range: 0.6-1.2 mEq/L; toxic >1.5 mEq/L - VERY narrow margin",
      "Anything that depletes sodium or dehydrates the patient will INCREASE lithium levels",
      "NSAIDs reduce lithium excretion - use acetaminophen for pain instead",
      "Lithium is the ONLY psychiatric medication proven to reduce suicide risk",
      "Lamotrigine must be titrated very slowly to prevent Stevens-Johnson syndrome (life-threatening rash)"
    ],
    quiz: [
      {
        question: "A patient taking lithium presents with coarse tremor, persistent vomiting, and confusion. The lithium level is 2.1 mEq/L. What is the priority nursing action?",
        options: [
          "Hold lithium and administer the next dose at a lower amount",
          "Hold lithium, initiate IV normal saline, and notify the provider immediately",
          "Continue lithium and recheck the level in 12 hours",
          "Administer an antiemetic and monitor for improvement"
        ],
        correct: 1,
        rationale: "A lithium level of 2.1 mEq/L with neurological symptoms (confusion, coarse tremor) indicates moderate lithium toxicity. The nurse must hold the medication, hydrate with IV normal saline (lithium is excreted by the kidneys and follows sodium), and notify the provider. Severe toxicity may require hemodialysis."
      },
      {
        question: "A patient on lithium therapy begins taking ibuprofen for joint pain. What should the nurse teach the patient?",
        options: [
          "Ibuprofen is safe to take with lithium for short-term use",
          "NSAIDs decrease lithium excretion and can cause toxicity; use acetaminophen instead",
          "Take ibuprofen with food to prevent interaction with lithium",
          "Ibuprofen will decrease lithium effectiveness"
        ],
        correct: 1,
        rationale: "NSAIDs (including ibuprofen) inhibit renal prostaglandins, reducing renal blood flow and lithium excretion. This can raise lithium levels to toxic ranges. Patients should use acetaminophen for pain and avoid all NSAIDs unless specifically approved by their provider."
      }
    ]
  },

  "anticonvulsant-medications": {
    title: "Anticonvulsant Medications",
    cellular: {
      title: "Mechanism of Action: Anticonvulsant",
      content: "Anticonvulsant (antiepileptic) medications prevent seizures by targeting the abnormal neuronal hyperexcitability that characterizes epilepsy. Seizures result from excessive synchronous firing of neurons due to an imbalance between excitatory (glutamate) and inhibitory (GABA) neurotransmission. Anticonvulsants restore this balance through several mechanisms.\n\nSodium channel blockers (phenytoin, carbamazepine, lamotrigine) bind to voltage-gated sodium channels in their inactivated state, prolonging the refractory period and preventing rapid repetitive firing of neurons. This is called use-dependent blockade because the drug has greater affinity for channels that are frequently opening (as in seizure activity) compared to normally functioning channels. Phenytoin specifically binds to and stabilizes the inactivated conformation of the sodium channel, making it unavailable for the next depolarization cycle.\n\nGABA enhancers work by potentiating the inhibitory effects of gamma-aminobutyric acid. Benzodiazepines (diazepam, lorazepam) increase the frequency of GABA-A receptor chloride channel opening, while barbiturates (phenobarbital) increase the duration of chloride channel opening. Valproic acid inhibits GABA transaminase (the enzyme that breaks down GABA) and also blocks sodium channels. Newer agents like levetiracetam bind to synaptic vesicle protein 2A (SV2A), modulating neurotransmitter release. Understanding these mechanisms helps predict side effects: sodium channel blockers can cause ataxia and diplopia, while GABA enhancers cause sedation and cognitive slowing."
    },
    riskFactors: [
      "Drug interactions (enzyme inducers: phenytoin, carbamazepine; inhibitors: valproate)",
      "Teratogenicity (valproate, phenytoin, carbamazepine - neural tube defects, cleft palate)",
      "Hepatotoxicity (valproate, carbamazepine - hepatic metabolism)",
      "Stevens-Johnson syndrome (lamotrigine, carbamazepine, phenytoin)",
      "Bone marrow suppression (carbamazepine - aplastic anemia, agranulocytosis)"
    ],
    diagnostics: [
      "Serum drug levels for narrow therapeutic index agents (phenytoin: 10-20 mcg/mL, valproate: 50-125 mcg/mL, carbamazepine: 4-12 mcg/mL)",
      "CBC with differential (carbamazepine - bone marrow suppression)",
      "Liver function tests (valproate, carbamazepine hepatotoxicity)",
      "Free phenytoin level in hypoalbuminemia (phenytoin is highly protein-bound)",
      "EEG monitoring for seizure activity and treatment response"
    ],
    management: [
      "Maintain consistent drug levels through regular dosing schedules",
      "Monitor for breakthrough seizures when adjusting doses or adding interacting medications",
      "Supplement folic acid in women of childbearing age (reduces neural tube defect risk)",
      "Implement seizure precautions: padded side rails, suction at bedside, oxygen available",
      "Never abruptly discontinue anticonvulsants - risk of status epilepticus"
    ],
    nursingActions: [
      "Monitor serum drug levels as ordered; report subtherapeutic or toxic levels",
      "Assess for signs of toxicity: nystagmus, ataxia, lethargy, slurred speech",
      "Implement seizure precautions for all patients on anticonvulsant therapy",
      "Educate on importance of medication adherence - missed doses can trigger seizures",
      "Assess for rash (Stevens-Johnson syndrome) especially with lamotrigine and carbamazepine",
      "Monitor CBC and liver function tests as ordered"
    ],
    signs: {
      left: [
        "CNS depression: drowsiness, ataxia, dizziness, cognitive slowing",
        "Phenytoin toxicity: nystagmus (first sign), ataxia, slurred speech, confusion",
        "Gingival hyperplasia (phenytoin-specific)",
        "GI upset: nausea, vomiting (common across class)"
      ],
      right: [
        "Stevens-Johnson syndrome: fever, mucosal lesions, widespread blistering rash",
        "Hepatotoxicity: jaundice, elevated LFTs (valproate, carbamazepine)",
        "Bone marrow suppression (carbamazepine: aplastic anemia)",
        "Teratogenic effects: neural tube defects, cleft palate"
      ]
    },
    medications: [
      {
        name: "Phenytoin (Dilantin)",
        type: "Hydantoin Anticonvulsant / Sodium Channel Blocker",
        action: "Stabilizes neuronal membranes by binding to inactivated voltage-gated sodium channels; prolongs refractory period and prevents repetitive firing",
        sideEffects: "Gingival hyperplasia, hirsutism, nystagmus, ataxia, osteomalacia, folate deficiency, teratogenicity",
        contra: "Sinus bradycardia, SA and AV block, Adams-Stokes syndrome, pregnancy",
        pearl: "Zero-order kinetics - small dose increases can cause disproportionate level increases. Nystagmus is the FIRST sign of toxicity. IV must be given in normal saline only (precipitates in dextrose). Therapeutic level: 10-20 mcg/mL."
      },
      {
        name: "Levetiracetam (Keppra)",
        type: "SV2A Modulator Anticonvulsant",
        action: "Binds to synaptic vesicle protein 2A (SV2A), modulating neurotransmitter vesicle fusion and release; exact mechanism not fully understood",
        sideEffects: "Drowsiness, irritability, behavioral changes, dizziness, headache",
        contra: "Hypersensitivity to levetiracetam",
        pearl: "Fewer drug interactions than traditional anticonvulsants (not hepatically metabolized). Does NOT require routine serum level monitoring. Behavioral side effects (irritability, aggression) are the main concern."
      },
      {
        name: "Carbamazepine (Tegretol)",
        type: "Iminodibenzyl Anticonvulsant / Sodium Channel Blocker",
        action: "Blocks voltage-gated sodium channels, reducing high-frequency repetitive neuronal firing; also reduces glutamate release",
        sideEffects: "Aplastic anemia, agranulocytosis, SIADH, hepatotoxicity, Stevens-Johnson syndrome, dizziness, diplopia",
        contra: "Bone marrow depression, concurrent MAOI use, hepatic porphyria",
        pearl: "Potent CYP450 inducer - decreases levels of many drugs including oral contraceptives. HLA-B*1502 genetic test recommended in Asian patients before starting (SJS risk). Also used for trigeminal neuralgia."
      }
    ],
    pearls: [
      "Phenytoin has zero-order kinetics: small dose changes can cause toxic levels - monitor closely",
      "Nystagmus is the FIRST sign of phenytoin toxicity; ataxia and lethargy follow",
      "NEVER abruptly stop anticonvulsants - can trigger status epilepticus",
      "IV phenytoin must be mixed in normal saline only (precipitates in dextrose solutions)",
      "Lamotrigine must be titrated very slowly when added to valproate (valproate inhibits lamotrigine metabolism, doubling levels)"
    ],
    quiz: [
      {
        question: "A patient taking phenytoin has a serum level of 22 mcg/mL and exhibits nystagmus and unsteady gait. What is the nurse's priority action?",
        options: [
          "Continue the current dose and recheck the level in one week",
          "Hold the medication and notify the provider of the toxic level and symptoms",
          "Administer an additional dose to prevent seizure breakthrough",
          "Give the medication with food to reduce absorption"
        ],
        correct: 1,
        rationale: "The therapeutic range for phenytoin is 10-20 mcg/mL. A level of 22 mcg/mL with nystagmus and ataxia indicates toxicity. The nurse should hold the medication and notify the provider. Phenytoin has zero-order kinetics, meaning even small increases can cause disproportionate toxicity."
      },
      {
        question: "Which anticonvulsant side effect requires immediate discontinuation and emergency treatment?",
        options: [
          "Mild drowsiness and fatigue",
          "Gingival hyperplasia",
          "Fever with widespread blistering skin rash and mucosal involvement",
          "Weight gain and hair thinning"
        ],
        correct: 2,
        rationale: "Fever with widespread blistering rash and mucosal involvement describes Stevens-Johnson syndrome (SJS) / toxic epidermal necrolysis (TEN), a life-threatening dermatologic emergency. The causative medication must be discontinued immediately and the patient requires emergency management. SJS is associated with lamotrigine, carbamazepine, and phenytoin."
      }
    ]
  }
};
