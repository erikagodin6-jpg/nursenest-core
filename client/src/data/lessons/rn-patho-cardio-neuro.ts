import type { LessonContent } from "./types";

export const rnPathoCardioNeuroLessons: Record<string, LessonContent> = {
  "heart-failure-rn": {
    title: "Heart Failure: RN Clinical Management",
    cellular: {
      title: "Neurohormonal Pathophysiology and Clinical Staging",
      content: "Heart failure progresses through predictable stages defined by the ACC/AHA staging system: Stage A (at risk, no structural disease), Stage B (structural disease, no symptoms), Stage C (structural disease with current or prior symptoms), and Stage D (refractory HF requiring advanced therapies). This staging system is unidirectional — patients progress forward but do not regress to earlier stages, reflecting the irreversible nature of cardiac remodeling.\n\nThe neurohormonal cascade in heart failure creates a vicious cycle: decreased cardiac output activates baroreceptors and the sympathetic nervous system, increasing heart rate and contractility through norepinephrine release. Reduced renal perfusion activates RAAS: angiotensin II causes arteriolar vasoconstriction (increasing afterload and myocardial oxygen demand), stimulates aldosterone release (causing sodium and water retention, increasing preload), and directly promotes myocardial fibrosis and hypertrophy. ADH release further increases water retention. Natriuretic peptides (ANP from atria, BNP from ventricles) attempt to counteract these effects through vasodilation and natriuresis but are overwhelmed in advanced HF.\n\nAt the cellular level, chronic sympathetic activation causes beta-1 receptor downregulation (explaining why exogenous catecholamines become less effective), myocyte apoptosis, and calcium handling abnormalities. Myocardial fibrosis from aldosterone and angiotensin II replaces functional contractile tissue with collagen, reducing compliance and contractility. Mitochondrial dysfunction impairs energy production. These changes collectively worsen ventricular function and promote arrhythmogenesis.\n\nThe cardiorenal syndrome describes the bidirectional relationship between cardiac and renal dysfunction: reduced cardiac output decreases renal perfusion pressure, activating RAAS and causing sodium/water retention (Type 1 and 2 cardiorenal syndrome). Conversely, acute or chronic kidney disease increases fluid overload and uremic toxin accumulation, worsening cardiac function (Type 3 and 4). Managing this interplay requires balancing diuresis (to relieve congestion) against maintaining adequate renal perfusion."
    },
    riskFactors: [
      "Ischemic heart disease (most common cause globally)",
      "Hypertension (chronic pressure overload)",
      "Diabetes with diabetic cardiomyopathy",
      "Atrial fibrillation (loss of atrial kick, tachycardia-mediated cardiomyopathy)",
      "Chronic kidney disease (volume overload, uremic cardiomyopathy)",
      "Cardiotoxic medications (anthracyclines, trastuzumab)",
      "Thyroid disease (both hypo- and hyperthyroidism)",
      "Sleep apnea (chronic intermittent hypoxia, sympathetic activation)"
    ],
    diagnostics: [
      "Echocardiography for EF, chamber size, wall motion, diastolic function, valvular assessment",
      "BNP/NT-proBNP for diagnosis and prognosis (serial trending during hospitalization)",
      "Chest X-ray: cardiomegaly (CTR >0.5), pulmonary edema, pleural effusions",
      "Daily weights and strict I&O monitoring",
      "BMP: electrolytes (hyponatremia, hyperkalemia), renal function (cardiorenal syndrome)",
      "CBC: anemia (high-output HF contributor), infection screen",
      "Iron studies (iron deficiency common in HF, treat even without anemia)"
    ],
    management: [
      "Volume management: IV loop diuretics for acute decompensation, oral for maintenance",
      "Optimize GDMT titration to target doses before considering advanced therapies",
      "Sodium restriction <2g/day; fluid restriction 1.5L/day if Na+ <130",
      "Activity modification: cardiac rehabilitation for stable HF",
      "Advanced therapies for Stage D: LVAD as bridge-to-transplant or destination therapy",
      "Palliative care consultation for refractory symptoms",
      "Treat precipitating factors: infection, arrhythmia, medication non-adherence, dietary indiscretion"
    ],
    nursingActions: [
      "Perform focused cardiovascular assessment: JVD, lung sounds, edema, perfusion",
      "Calculate and trend fluid balance every shift",
      "Position in high-Fowler's for acute dyspnea",
      "Monitor telemetry for arrhythmias (AF, VT are common in HF)",
      "Administer IV diuretics and monitor response (urine output, weight, symptoms)",
      "Assess for signs of worsening renal function during diuresis",
      "Educate on HF zones: green (stable), yellow (caution: weight gain, increased dyspnea), red (emergency: severe SOB, chest pain)",
      "Coordinate multidisciplinary team: dietitian, pharmacist, social work, palliative care"
    ],
    signs: {
      left: [
        "NYHA Class I: No limitation of physical activity",
        "NYHA Class II: Slight limitation; comfortable at rest",
        "Elevated BNP trending downward with treatment",
        "Improving exercise tolerance"
      ],
      right: [
        "NYHA Class III: Marked limitation; comfortable only at rest",
        "NYHA Class IV: Unable to perform any activity without symptoms; symptoms at rest",
        "Cardiorenal syndrome: rising creatinine with diuresis",
        "Refractory congestion despite maximum diuretic therapy"
      ]
    },
    medications: [
      { name: "Furosemide (Lasix)", type: "Loop Diuretic", action: "Inhibits Na-K-2Cl cotransporter in the thick ascending limb of the loop of Henle, producing potent natriuresis and diuresis", sideEffects: "Hypokalemia, hypomagnesemia, ototoxicity, dehydration, hyperuricemia", contra: "Anuria, severe hypovolemia, hepatic coma", pearl: "IV furosemide onset 5 minutes, peak 30 minutes. For acute decompensated HF, give IV dose ≥ home oral dose. Monitor potassium and magnesium. Diuretic resistance may require adding a thiazide (metolazone) for synergistic nephron blockade." },
      { name: "Empagliflozin (Jardiance)", type: "SGLT2 Inhibitor", action: "Blocks sodium-glucose cotransporter 2 in proximal tubule, promoting glycosuria, natriuresis, and osmotic diuresis", sideEffects: "Genital mycotic infections, UTI, volume depletion, euglycemic DKA (rare)", contra: "Type 1 DM (DKA risk), eGFR <20 mL/min", pearl: "Fourth pillar of HFrEF GDMT regardless of diabetes status (EMPEROR-Reduced trial). Also benefits HFpEF (EMPEROR-Preserved trial). Reduces HF hospitalizations and cardiovascular death." },
      { name: "Milrinone", type: "Phosphodiesterase-3 Inhibitor (Inodilator)", action: "Inhibits PDE-3, increasing intracellular cAMP causing positive inotropy and vasodilation", sideEffects: "Hypotension, arrhythmias (VT), thrombocytopenia", contra: "Severe aortic or pulmonic stenosis", pearl: "Used for acute decompensated HF refractory to diuretics and standard inotropes. Works independently of beta receptors — effective even in patients on beta-blockers (unlike dobutamine). Monitor closely for ventricular arrhythmias." }
    ],
    pearls: [
      "HF staging (ACC/AHA A-D) is irreversible; NYHA classification (I-IV) fluctuates with treatment",
      "Weight gain >2 lbs/day or >5 lbs/week: contact provider — indicates fluid retention",
      "Hyponatremia in HF = dilutional (too much water, not too little sodium) — treat with fluid restriction, NOT normal saline",
      "Diuretic resistance: try IV bolus + continuous infusion, add metolazone 30 min before loop diuretic, or consider ultrafiltration",
      "Common HF decompensation triggers: dietary sodium excess, medication non-adherence, infection, arrhythmia, uncontrolled HTN",
      "Carvedilol, metoprolol succinate, bisoprolol = the ONLY 3 beta-blockers with mortality benefit in HFrEF"
    ],
    quiz: [
      { question: "A patient admitted for acute decompensated HF has received IV furosemide 80 mg with minimal urine output after 2 hours. Which action should the nurse anticipate?", options: ["Switch to oral furosemide", "Add metolazone before the next furosemide dose", "Discontinue diuretic therapy", "Increase oral fluid intake"], correct: 1, rationale: "Diuretic resistance is managed by sequential nephron blockade: adding a thiazide (metolazone) 30 minutes before the loop diuretic blocks sodium reabsorption at two different sites, producing synergistic diuresis." },
      { question: "A patient with HFrEF and EF of 20% has a sodium level of 128 mEq/L. What is the appropriate nursing intervention?", options: ["Administer IV normal saline bolus", "Restrict fluid intake to 1.5 L/day", "Encourage increased sodium intake", "Administer hypertonic saline"], correct: 1, rationale: "Hyponatremia in HF is dilutional — excess free water relative to sodium. Treatment is fluid restriction (1.5 L/day), NOT sodium replacement. Normal saline would worsen volume overload." }
    ]
  },

  "coronary-artery-disease-rn": {
    title: "Coronary Artery Disease: Pathogenesis & Clinical Management",
    cellular: {
      title: "Atherosclerosis Pathogenesis and Angina Pathophysiology",
      content: "Coronary artery disease (CAD) results from progressive atherosclerosis of the coronary arteries, a chronic inflammatory process that begins with endothelial dysfunction and culminates in luminal narrowing, plaque rupture, and acute coronary syndromes. Understanding the cellular pathogenesis is essential for nurses because it explains why risk factor modification is effective, why certain medications are used, and how stable angina differs from unstable angina at the tissue level.\n\nAtherosclerosis pathogenesis follows a predictable sequence: (1) Endothelial dysfunction: Risk factors (hypertension, smoking, diabetes, hyperlipidemia) damage the endothelial cell layer lining coronary arteries, reducing nitric oxide production and increasing permeability to lipoproteins. (2) Lipid accumulation: Low-density lipoprotein (LDL) particles infiltrate the subendothelial space and become oxidized. Oxidized LDL is highly inflammatory and activates endothelial cells to express adhesion molecules (VCAM-1, ICAM-1) that recruit circulating monocytes. (3) Foam cell formation: Monocytes migrate into the intima, differentiate into macrophages, and engulf oxidized LDL via scavenger receptors (CD36, SR-A). These lipid-laden macrophages become foam cells, forming the fatty streak — the earliest visible lesion of atherosclerosis (present in some teenagers). (4) Fibrous plaque development: Smooth muscle cells migrate from the media into the intima, proliferate, and produce collagen and elastin, forming a fibrous cap over the lipid-rich necrotic core. (5) Plaque vulnerability: Thin-cap fibroatheromas with large lipid cores, thin fibrous caps (<65 micrometers), and active inflammation are vulnerable to rupture.\n\nStable angina results from fixed coronary stenosis (typically >70% luminal narrowing) that limits blood flow during increased myocardial oxygen demand (exertion, stress). The myocardium becomes ischemic but not necrotic — symptoms resolve with rest or nitroglycerin. The oxygen supply-demand mismatch is predictable and reproducible.\n\nUnstable angina results from acute plaque disruption (rupture or erosion) with non-occlusive thrombus formation. Unlike stable angina, it occurs at rest or with minimal exertion, represents new or worsening ischemia, and carries significant risk of progression to MI. The distinction between unstable angina and NSTEMI is determined by troponin levels: both have similar pathophysiology, but NSTEMI involves enough ischemia duration to cause myocyte necrosis and troponin release."
    },
    riskFactors: [
      "Non-modifiable: age (male >45, female >55), male sex, family history of premature CAD",
      "Hypertension: endothelial shear stress promotes plaque formation",
      "Dyslipidemia: elevated LDL, low HDL, elevated triglycerides",
      "Diabetes mellitus: accelerated atherosclerosis, endothelial glycation",
      "Tobacco use: direct endothelial toxicity, prothrombotic state",
      "Obesity and physical inactivity",
      "Chronic kidney disease: accelerated vascular calcification",
      "Chronic inflammatory conditions (RA, lupus, HIV)"
    ],
    diagnostics: [
      "Resting ECG: may show ST depression, T-wave inversion, or be normal in stable CAD",
      "Exercise stress test (treadmill): ST depression ≥1mm indicates ischemia",
      "Pharmacologic stress test (adenosine, dobutamine) for patients unable to exercise",
      "Coronary calcium score (CT): quantifies atherosclerotic burden for risk stratification",
      "Coronary angiography: gold standard for defining anatomy and stenosis severity",
      "Lipid panel: LDL goal <70 mg/dL for established CAD",
      "hs-CRP: marker of systemic inflammation and cardiovascular risk"
    ],
    management: [
      "High-intensity statin therapy (atorvastatin 40-80 mg or rosuvastatin 20-40 mg)",
      "Antiplatelet therapy: aspirin 81 mg daily for secondary prevention",
      "Beta-blocker for angina control (reduces HR and myocardial O2 demand)",
      "Sublingual NTG PRN for acute anginal episodes",
      "Long-acting nitrate (isosorbide mononitrate) for chronic angina prevention",
      "Calcium channel blocker (amlodipine, diltiazem) as alternative/adjunct",
      "Aggressive risk factor modification: smoking cessation, BP control, diabetes management, exercise",
      "PCI with stenting for refractory symptoms or high-risk anatomy; CABG for left main or 3-vessel disease"
    ],
    nursingActions: [
      "Assess chest pain using PQRST format and compare to previous episodes",
      "Administer sublingual NTG: one tab, reassess in 5 min; call 911 if not relieved",
      "Monitor vital signs before and after NTG (hold if SBP <90)",
      "Educate on modifiable risk factors and lifestyle modifications",
      "Teach NTG storage: dark container, replace every 6 months, tingling under tongue = potent",
      "Monitor for statin side effects: myalgias, elevated liver enzymes, rhabdomyolysis (rare)",
      "Educate on difference between stable and unstable angina patterns",
      "Promote cardiac rehabilitation participation"
    ],
    signs: {
      left: [
        "Stable angina: predictable chest discomfort with exertion, relieved by rest/NTG",
        "Typical duration 3-5 minutes",
        "ST depression on stress test (reversible with rest)",
        "Positive exercise tolerance test"
      ],
      right: [
        "Unstable angina: new-onset, crescendo, or rest angina",
        "Prolonged chest pain >20 minutes not fully relieved by NTG",
        "Dynamic ECG changes (ST depression, T-wave inversion)",
        "Progression to NSTEMI/STEMI with troponin elevation"
      ]
    },
    medications: [
      { name: "Atorvastatin (Lipitor)", type: "HMG-CoA Reductase Inhibitor (Statin)", action: "Inhibits hepatic cholesterol synthesis, upregulates LDL receptors for increased clearance, stabilizes atherosclerotic plaques, and reduces inflammation", sideEffects: "Myalgias (most common), elevated LFTs, rhabdomyolysis (rare), new-onset diabetes", contra: "Active liver disease, pregnancy (teratogenic)", pearl: "Pleiotropic effects beyond lipid lowering: plaque stabilization (thickens fibrous cap), anti-inflammatory (reduces hs-CRP), improves endothelial function. Administer at bedtime for optimal effect (peak cholesterol synthesis occurs overnight)." },
      { name: "Nitroglycerin (Sublingual)", type: "Organic Nitrate (Vasodilator)", action: "Converts to nitric oxide, activating guanylyl cyclase, increasing cGMP, causing vascular smooth muscle relaxation — primarily venodilation (reduces preload), some arterial dilation (reduces afterload), and coronary artery dilation", sideEffects: "Headache, hypotension, reflex tachycardia, flushing", contra: "SBP <90, concurrent PDE5 inhibitor (sildenafil/tadalafil within 24-48 hours), severe aortic stenosis, RV infarction", pearl: "Current AHA guidelines: take 1 tablet; if no relief in 5 minutes, call 911. Store in original dark glass container, replace every 6 months. Tingling under tongue indicates potency. Nitrate-free interval (10-12 hours/day) prevents tolerance." },
      { name: "Ranolazine (Ranexa)", type: "Late Sodium Current Inhibitor", action: "Inhibits the late sodium current in ischemic myocytes, reducing intracellular calcium overload and improving diastolic relaxation without affecting heart rate or blood pressure", sideEffects: "Dizziness, constipation, nausea, QT prolongation", contra: "Hepatic impairment, concurrent strong CYP3A4 inhibitors", pearl: "Anti-anginal that works without affecting hemodynamics — can be added when beta-blockers and CCBs are maximized. Does not reduce BP or HR, making it useful for patients already on rate-lowering agents." }
    ],
    pearls: [
      "Atherosclerosis is a chronic inflammatory disease, not just a lipid storage disease — this is why statins (anti-inflammatory) and lifestyle modification are so effective",
      "Stable angina = predictable, reproducible, relieved by rest/NTG. Unstable angina = new, worsening, or rest pain — treat as ACS",
      "LDL goal for established CAD: <70 mg/dL; consider <55 mg/dL for very high-risk patients",
      "Women and diabetic patients may present with atypical symptoms: fatigue, dyspnea, nausea, epigastric pain instead of classic chest pressure",
      "NTG teaching has changed: current AHA guideline is ONE tablet, then call 911 if no relief in 5 minutes (not the old 3-tablet protocol)",
      "Coronary calcium score of 0 has >95% negative predictive value for obstructive CAD in asymptomatic patients"
    ],
    quiz: [
      { question: "A patient reports chest pressure that occurs while climbing two flights of stairs and resolves with rest within 3 minutes. This pattern has been consistent for 6 months. What type of angina does this describe?", options: ["Unstable angina", "Stable angina", "Prinzmetal (variant) angina", "Microvascular angina"], correct: 1, rationale: "Stable angina is characterized by predictable, reproducible chest discomfort with a consistent level of exertion that resolves with rest or NTG. The 6-month stable pattern confirms this is not new-onset or worsening (unstable) angina." },
      { question: "Which finding should the nurse report as a potential complication of statin therapy?", options: ["Headache and dizziness", "Unexplained muscle pain with dark urine", "Dry cough", "Constipation"], correct: 1, rationale: "Unexplained muscle pain with dark urine (myoglobinuria) may indicate rhabdomyolysis, a rare but serious complication of statin therapy. CK levels should be checked immediately. Dark urine suggests myoglobin release from muscle breakdown, risking acute kidney injury." },
      { question: "A patient with stable angina asks why they need to take a statin when their cholesterol is 'not that high.' What is the nurse's best response?", options: ["Statins are only for people with very high cholesterol", "Statins stabilize plaque and reduce inflammation in addition to lowering cholesterol, which prevents heart attacks", "You can stop the statin once your cholesterol normalizes", "Statins are optional for patients with known coronary artery disease"], correct: 1, rationale: "Statins have pleiotropic effects beyond lipid lowering: they stabilize vulnerable plaques by thickening the fibrous cap, reduce vascular inflammation, and improve endothelial function. These benefits reduce cardiovascular events regardless of baseline cholesterol level." }
    ]
  },

  "aaa-rupture": {
    title: "Abdominal Aortic Aneurysm: Rupture Pathophysiology",
    cellular: {
      title: "Aortic Wall Degeneration and Rupture Hemodynamics",
      content: "An abdominal aortic aneurysm (AAA) is a pathological dilation of the abdominal aorta to ≥3.0 cm (normal diameter approximately 2.0 cm), most commonly occurring in the infrarenal segment. The pathophysiology of aneurysm formation involves progressive degeneration of the aortic wall through enzymatic destruction of structural proteins, chronic inflammation, and biomechanical stress.\n\nThe aortic wall has three layers: the intima (endothelial lining), media (smooth muscle cells embedded in an extracellular matrix of elastin and collagen providing structural integrity), and adventitia (connective tissue with vasa vasorum). AAA formation begins with degradation of the medial layer through multiple mechanisms: (1) Matrix metalloproteinases (MMP-2, MMP-9) are upregulated by inflammatory cells (macrophages, T-lymphocytes) that infiltrate the aortic wall, directly digesting elastin and collagen fibers. (2) Smooth muscle cell apoptosis depletes the cellular component responsible for maintaining and repairing the extracellular matrix. (3) Chronic inflammation driven by oxidized lipids, infection (controversial), and autoimmune mechanisms perpetuates tissue destruction. (4) Proteolytic enzyme-antiprotease imbalance: increased MMPs and decreased tissue inhibitors of metalloproteinases (TIMPs) favor net matrix destruction.\n\nLaplace's Law governs aneurysm expansion and rupture risk: wall tension = (pressure × radius) / (2 × wall thickness). As the aneurysm dilates, wall tension increases exponentially while the thinning wall becomes progressively weaker — creating a positive feedback loop. The annual rupture risk increases dramatically with size: <4 cm = <1%, 4-5 cm = 1-3%, 5-5.9 cm = 3-15%, 6-6.9 cm = 10-20%, >7 cm = 20-40%.\n\nRupture pathophysiology: When wall stress exceeds wall strength, the aneurysm ruptures, most commonly into the left retroperitoneal space (80% of cases, potentially contained by surrounding tissue) or freely into the peritoneal cavity (20%, uniformly fatal without immediate surgery). The resulting hemorrhagic shock follows a predictable cascade: massive blood loss causes decreased venous return, decreased cardiac output, sympathetic activation (tachycardia, vasoconstriction), tissue hypoperfusion, anaerobic metabolism, lactic acidosis, coagulopathy (from hypothermia, acidosis, and dilution = the lethal triad), and ultimately cardiovascular collapse. The classic presentation triad — sudden severe back/abdominal pain, hypotension, and pulsatile abdominal mass — is present in fewer than 50% of patients but is diagnostic when present."
    },
    riskFactors: [
      "Male sex (6:1 male-to-female ratio for AAA)",
      "Age >65 years (prevalence increases with age)",
      "Tobacco use (strongest modifiable risk factor — 90% of AAA patients are current/former smokers)",
      "Family history of AAA (first-degree relative increases risk 2-4 fold)",
      "Hypertension (increases wall stress per Laplace's Law)",
      "Atherosclerosis and hyperlipidemia",
      "Connective tissue disorders (Marfan, Ehlers-Danlos — affect younger patients)",
      "COPD (shared pathogenesis: elastin degradation from protease-antiprotease imbalance)"
    ],
    diagnostics: [
      "Abdominal ultrasound: screening and surveillance (recommended for males 65-75 who ever smoked)",
      "CT angiography: gold standard for surgical planning and rupture assessment",
      "Serial size measurements per guidelines: <4 cm = annual US, 4-5.4 cm = every 6-12 months",
      "Hemoglobin/hematocrit for blood loss assessment in rupture",
      "Type and crossmatch (prepare for massive transfusion in rupture)",
      "Lactate levels to assess tissue perfusion in hemodynamic instability",
      "Coagulation studies (PT/INR, aPTT, fibrinogen) for coagulopathy assessment"
    ],
    management: [
      "Elective repair indicated when: diameter ≥5.5 cm (men), ≥5.0 cm (women), or growth >0.5 cm/6 months",
      "Open surgical repair or endovascular aneurysm repair (EVAR) based on anatomy",
      "Rupture = immediate surgical emergency: establish 2 large-bore IVs, type and crossmatch",
      "Permissive hypotension in rupture: target SBP 70-90 mmHg to avoid disrupting clot",
      "Massive transfusion protocol: 1:1:1 ratio of PRBCs:FFP:platelets",
      "Blood pressure control in stable AAA: target SBP <120 mmHg to reduce wall stress",
      "Smoking cessation (slows growth rate by 20-30%)",
      "Beta-blocker therapy may slow aneurysm growth rate"
    ],
    nursingActions: [
      "Assess for signs of rupture: sudden severe back/abdominal pain, hypotension, pulsatile mass",
      "In suspected rupture: establish 2 large-bore IVs immediately, notify surgeon STAT",
      "Do NOT palpate the abdomen vigorously in known AAA (risk of precipitating rupture)",
      "Monitor vital signs every 15 minutes in acute presentation",
      "Prepare for emergent OR transfer and massive transfusion protocol",
      "Post-operative monitoring: distal pulses, renal function, abdominal compartment pressure",
      "Educate on surveillance schedule and symptoms requiring immediate medical attention",
      "Reinforce smoking cessation and blood pressure management"
    ],
    signs: {
      left: [
        "Asymptomatic (most common — found incidentally on imaging)",
        "Pulsatile abdominal mass on palpation",
        "Vague abdominal or back discomfort",
        "Stable vital signs with controlled blood pressure"
      ],
      right: [
        "Rupture triad: sudden tearing back/abdominal pain + hypotension + pulsatile mass",
        "Hemorrhagic shock: tachycardia, hypotension, cool/diaphoretic skin, altered mental status",
        "Grey Turner sign (flank ecchymosis) or Cullen sign (periumbilical ecchymosis) — late findings",
        "Cardiovascular collapse: SBP <70, obtundation, anuric"
      ]
    },
    medications: [
      { name: "Esmolol", type: "Ultra-Short-Acting Beta-1 Blocker", action: "Selectively blocks beta-1 receptors, reducing heart rate, contractility, and blood pressure to decrease aortic wall shear stress", sideEffects: "Bradycardia, hypotension, bronchospasm (rare at beta-1 selective doses)", contra: "Severe bradycardia, cardiogenic shock, decompensated HF", pearl: "Half-life only 9 minutes — ideal for acute aortic emergencies where precise BP control is needed. Titrate to HR <60 bpm and SBP <120 mmHg in stable AAA. Easily reversed by stopping infusion." },
      { name: "Tranexamic Acid (TXA)", type: "Antifibrinolytic", action: "Inhibits plasminogen activation, preventing fibrin clot breakdown and reducing hemorrhage", sideEffects: "Nausea, diarrhea, seizures at high doses, thromboembolism (rare)", contra: "Active intravascular clotting, subarachnoid hemorrhage", pearl: "May be used as adjunct in ruptured AAA to reduce blood loss. Give 1g IV over 10 minutes within 3 hours of hemorrhage onset. CRASH-2 trial demonstrated mortality reduction in traumatic hemorrhage." }
    ],
    pearls: [
      "Classic rupture triad (pain + hypotension + pulsatile mass) present in <50% of cases — maintain high index of suspicion in elderly male smokers with acute back pain",
      "Laplace's Law explains why rupture risk increases exponentially with size: wall tension = (pressure × radius)/(2 × wall thickness)",
      "Permissive hypotension (SBP 70-90) in rupture prevents disrupting fragile retroperitoneal clot that may be tamponading the hemorrhage",
      "NEVER delay surgery for CT scan in unstable ruptured AAA — bedside ultrasound can confirm diagnosis",
      "Post-EVAR complications: endoleak (persistent blood flow into aneurysm sac), graft migration, limb occlusion — lifelong surveillance required",
      "Screening recommendation: one-time abdominal ultrasound for all males aged 65-75 who have ever smoked (USPSTF Grade B)"
    ],
    quiz: [
      { question: "A 72-year-old male smoker presents with sudden severe tearing back pain, BP 76/42, HR 128, and a pulsatile abdominal mass. What is the nurse's FIRST priority?", options: ["Obtain CT angiography to confirm diagnosis", "Establish two large-bore IVs and prepare for emergent surgical repair", "Administer IV morphine for pain control", "Position in Trendelenburg and reassess in 15 minutes"], correct: 1, rationale: "This presentation is classic ruptured AAA with hemorrhagic shock. IV access for volume resuscitation and immediate surgical team notification are the priority. CT scan delays potentially life-saving surgery in an unstable patient. Pain management is secondary to hemodynamic stabilization." },
      { question: "Why should the nurse avoid vigorous abdominal palpation in a patient with a known 5.8 cm AAA?", options: ["It causes pain", "It may precipitate rupture by increasing wall stress on the weakened aneurysm", "It is unreliable for assessment", "It causes nausea and vomiting"], correct: 1, rationale: "Vigorous palpation can increase intraluminal pressure against an already weakened and dilated aortic wall, potentially precipitating rupture. Gentle palpation for pulsatility is acceptable, but aggressive examination should be avoided." }
    ]
  },

  "hemorrhagic-stroke-rn": {
    title: "Hemorrhagic Stroke: Intracerebral & Subarachnoid Hemorrhage",
    cellular: {
      title: "Vessel Rupture Mechanisms, Mass Effect, and Herniation Syndromes",
      content: "Hemorrhagic stroke accounts for approximately 13% of all strokes but causes 30-50% of stroke-related mortality, making it disproportionately lethal. The two major types — intracerebral hemorrhage (ICH) and subarachnoid hemorrhage (SAH) — have distinct pathophysiological mechanisms, clinical presentations, and management approaches.\n\nIntracerebral Hemorrhage (ICH): ICH results from rupture of small penetrating arteries within the brain parenchyma, most commonly due to chronic hypertension. Sustained hypertension causes lipohyalinosis (fibrinoid necrosis of arteriolar walls) and formation of Charcot-Bouchard microaneurysms in small perforating arteries of the basal ganglia, thalamus, pons, and cerebellum. When these weakened vessels rupture, blood dissects into the brain parenchyma, forming an expanding hematoma. The hematoma causes injury through two mechanisms: (1) Primary injury: direct mechanical destruction of brain tissue by the expanding blood mass. (2) Secondary injury: the hematoma compresses surrounding tissue (mass effect), increases intracranial pressure (ICP), disrupts the blood-brain barrier, and triggers an inflammatory cascade. Iron and thrombin released from the clot are directly neurotoxic, causing edema that peaks at 3-5 days and extends the zone of injury beyond the original hematoma.\n\nMass effect and herniation: As the hematoma expands, ICP rises according to the Monro-Kellie doctrine. Once compensatory mechanisms are exhausted (CSF displacement, venous compression), ICP rises exponentially. Brain herniation syndromes represent the ultimate mechanical failure: (1) Uncal herniation: medial temporal lobe herniates through the tentorial notch, compressing CN III (ipsilateral fixed dilated pupil), the posterior cerebral artery (contralateral homonymous hemianopia), and the cerebral peduncle (contralateral hemiparesis, or paradoxical ipsilateral hemiparesis — Kernohan notch phenomenon). (2) Central (transtentorial) herniation: bilateral diencephalic compression progressing to midbrain, then pontine compression — sequential loss of consciousness, bilateral fixed pupils, posturing, respiratory failure. (3) Tonsillar herniation: cerebellar tonsils herniate through the foramen magnum, compressing the medulla — causes immediate respiratory arrest.\n\nSubarachnoid Hemorrhage (SAH): SAH most commonly results from rupture of a cerebral (berry) aneurysm at arterial bifurcation points in the Circle of Willis (80% of non-traumatic SAH). Aneurysms form at points of hemodynamic stress where structural wall deficiency exists (absent internal elastic lamina and thin media). The most common locations are the anterior communicating artery (30%), posterior communicating artery (25%), and middle cerebral artery bifurcation (20%). Aneurysm rupture releases arterial blood under high pressure into the subarachnoid space, causing sudden catastrophic headache ('worst headache of my life' or 'thunderclap headache'), meningeal irritation (nuchal rigidity, photophobia), and acute rise in ICP. The Hunt-Hess scale grades SAH severity from I (minimal headache) to V (coma/posturing).\n\nSAH complications: (1) Rebleeding: highest risk in the first 24 hours (4% day 1, then 1.5%/day for 14 days without treatment). Definitive aneurysm securing (clipping or coiling) is urgent. (2) Cerebral vasospasm: delayed narrowing of cerebral arteries peaks at days 4-14 post-SAH, causing delayed cerebral ischemia (DCI) in 30% of patients. Prevented with nimodipine and treated with triple-H therapy (hypertension, hypervolemia, hemodilution) or endovascular intervention. (3) Hydrocephalus: blood in the subarachnoid space blocks CSF reabsorption at arachnoid granulations or obstructs the cerebral aqueduct, requiring external ventricular drain (EVD). (4) Hyponatremia: cerebral salt wasting (not SIADH) is the most common cause — differentiated by volume status (CSW: hypovolemic; SIADH: euvolemic/hypervolemic)."
    },
    riskFactors: [
      "Chronic uncontrolled hypertension (strongest risk factor for ICH)",
      "Anticoagulant therapy (warfarin-associated ICH has 50% mortality)",
      "Cerebral amyloid angiopathy (elderly, lobar hemorrhage pattern)",
      "Cerebral aneurysm (risk factors: smoking, hypertension, family history, polycystic kidney disease)",
      "Arteriovenous malformation (AVM — younger patients)",
      "Cocaine/amphetamine use (acute hypertensive surge)",
      "Coagulopathy and thrombocytopenia",
      "Heavy alcohol use (>2 drinks/day increases ICH risk)"
    ],
    diagnostics: [
      "Non-contrast CT head: ICH appears as hyperdense (bright white) mass; SAH appears as hyperdense blood in subarachnoid cisterns",
      "CT angiography: identify aneurysm (SAH), AVM, or spot sign (active extravasation in ICH = hematoma expansion risk)",
      "Lumbar puncture: if CT negative but SAH suspected — xanthochromia (yellowish CSF) confirms SAH",
      "GCS and NIHSS for severity assessment and trending",
      "Coagulation studies: INR (warfarin reversal urgency), aPTT, platelet count",
      "ICH Score: GCS, ICH volume, IVH, infratentorial origin, age >80 — predicts 30-day mortality",
      "Transcranial Doppler: monitor for vasospasm (increased velocities) in SAH days 4-14"
    ],
    management: [
      "ICH: BP reduction to SBP <140 within 1 hour (INTERACT2/ATACH-2 trials) — reduces hematoma expansion",
      "SAH: maintain SBP <160 until aneurysm secured; avoid hypertension AND hypotension",
      "Reverse anticoagulation immediately in anticoagulant-associated ICH (4-factor PCC, vitamin K, FFP)",
      "Nimodipine 60 mg PO/NG q4h × 21 days for vasospasm prevention in SAH",
      "Secure aneurysm early (<24 hours): surgical clipping or endovascular coiling",
      "EVD placement for hydrocephalus or IVH with ventricular dilation",
      "Seizure prophylaxis: levetiracetam preferred (avoid phenytoin in SAH — worse outcomes)",
      "HOB 30 degrees, head midline, avoid Valsalva to minimize ICP elevation"
    ],
    nursingActions: [
      "Neurological assessment every 1-2 hours: GCS, pupils, motor exam, NIHSS",
      "Maintain strict BP parameters: titrate IV antihypertensives per protocol",
      "Monitor for vasospasm signs in SAH (days 4-14): new focal deficits, confusion, decreased LOC",
      "Manage EVD: level, drainage amount, CSF appearance (clear vs bloody/cloudy), ICP monitoring",
      "Administer nimodipine ON TIME every 4 hours (do NOT skip doses — increases vasospasm risk)",
      "Implement aneurysm precautions: dim lights, quiet environment, limit visitors, stool softeners, no straining",
      "Monitor for seizure activity and maintain seizure precautions",
      "Assess for signs of herniation: unilateral fixed dilated pupil, posturing, Cushing triad"
    ],
    signs: {
      left: [
        "ICH: sudden focal neurological deficit (hemiparesis, aphasia) with headache and vomiting",
        "SAH: thunderclap headache ('worst headache of my life'), nuchal rigidity, photophobia",
        "Nausea/vomiting from increased ICP",
        "Loss of consciousness at onset (more common in hemorrhagic than ischemic stroke)"
      ],
      right: [
        "Hematoma expansion: progressive neurological decline in first 24 hours",
        "Vasospasm (SAH days 4-14): new focal deficits, confusion, decreased LOC",
        "Herniation: fixed dilated pupil, posturing, Cushing triad",
        "Hydrocephalus: acute obtundation, upgaze palsy, gait ataxia"
      ]
    },
    medications: [
      { name: "Nicardipine IV", type: "Calcium Channel Blocker (Dihydropyridine)", action: "Arterial vasodilation by blocking L-type calcium channels in vascular smooth muscle, providing titratable BP reduction", sideEffects: "Hypotension, tachycardia, headache, peripheral edema", contra: "Severe aortic stenosis, acute MI", pearl: "First-line for BP management in ICH due to smooth, titratable effect. Start at 5 mg/hr IV, increase by 2.5 mg/hr every 5-15 min to max 15 mg/hr. Target SBP <140 mmHg within 1 hour." },
      { name: "Nimodipine", type: "Calcium Channel Blocker (Cerebral-selective)", action: "Preferentially dilates cerebral arteries, reducing vasospasm incidence and improving outcomes after SAH", sideEffects: "Hypotension, headache, nausea, diarrhea", contra: "Severe hypotension", pearl: "60 mg PO/NG every 4 hours × 21 days. NEVER give IV (fatal cardiovascular collapse has been reported). If patient is hypotensive, reduce to 30 mg. Must be given ON TIME — noncompliance increases vasospasm risk." },
      { name: "4-Factor PCC (Kcentra)", type: "Prothrombin Complex Concentrate", action: "Contains factors II, VII, IX, X — rapidly reverses warfarin anticoagulation within 10-15 minutes", sideEffects: "Thromboembolism, DIC (rare), headache", contra: "Known DIC, HIT", pearl: "First-line for emergent warfarin reversal in ICH (faster than FFP, no volume overload). Dose based on INR and weight. Give with IV vitamin K 10 mg (PCC provides temporary reversal; vitamin K provides sustained reversal as factors are newly synthesized)." }
    ],
    pearls: [
      "ICH vs ischemic stroke: ICH presents with more headache, vomiting, and rapid LOC deterioration; ischemic presents with focal deficits without headache in most cases",
      "SAH thunderclap headache: 'worst headache of my life' with sudden onset reaching maximum intensity within seconds — this is SAH until proven otherwise",
      "CT sensitivity for SAH decreases over time: 98% at 12 hours, 93% at 24 hours, 50% at 1 week — LP with xanthochromia needed if CT negative but clinical suspicion high",
      "Vasospasm window: days 4-14 post-SAH is the danger zone. Monitor with transcranial Doppler; treat with triple-H therapy and nimodipine",
      "Cerebral salt wasting vs SIADH in SAH: both cause hyponatremia. CSW = hypovolemic (treat with NS), SIADH = euvolemic/hypervolemic (treat with fluid restriction). Getting this wrong is dangerous",
      "Aneurysm precautions: minimize stimulation, stool softeners (prevent Valsalva), dim lights, limit visitors, bed rest, anxiolytics PRN"
    ],
    quiz: [
      { question: "A patient with SAH is on day 7 post-aneurysm coiling. The nurse notes new left arm weakness and confusion that were not present this morning. What complication should be suspected?", options: ["Rebleeding from the coiled aneurysm", "Cerebral vasospasm causing delayed cerebral ischemia", "Medication side effects from nimodipine", "Normal post-procedural swelling"], correct: 1, rationale: "New focal neurological deficits developing days 4-14 after SAH strongly suggest cerebral vasospasm causing delayed cerebral ischemia. This is the most common preventable cause of morbidity and mortality after SAH. Immediate notification and urgent evaluation (transcranial Doppler, CTA) are required." },
      { question: "A patient presents with sudden thunderclap headache. CT head is negative for hemorrhage. What is the next diagnostic step?", options: ["Discharge home with analgesics", "Lumbar puncture to evaluate for xanthochromia", "MRI brain with contrast", "Repeat CT in 24 hours"], correct: 1, rationale: "CT sensitivity for SAH decreases over time. A negative CT with clinical suspicion of SAH requires lumbar puncture to look for xanthochromia (yellowish discoloration from bilirubin, a hemoglobin breakdown product), which confirms SAH even when CT is negative." },
      { question: "Why is nimodipine given only orally or via NG tube, NEVER intravenously, in SAH?", options: ["The IV form is not manufactured", "IV administration causes fatal cardiovascular collapse", "Oral absorption is more reliable", "IV form interacts with heparin"], correct: 1, rationale: "Nimodipine given intravenously has caused fatal cardiovascular collapse with profound hypotension and cardiac arrest. It must only be given via oral or nasogastric route. This is a critical medication safety point for NCLEX and clinical practice." }
    ]
  },

  "meningitis-patho-rn": {
    title: "Meningitis: Pathophysiology & Blood-Brain Barrier Disruption",
    cellular: {
      title: "Blood-Brain Barrier Disruption, CSF Changes, and Inflammatory Cascade",
      content: "Bacterial meningitis is a life-threatening infection of the meninges (pia mater and arachnoid mater) and subarachnoid space, causing a robust inflammatory response that can lead to cerebral edema, increased intracranial pressure, cerebral infarction, and death within hours if untreated. Understanding the pathophysiology of blood-brain barrier (BBB) disruption and the inflammatory cascade is essential for nurses because it explains the urgency of antibiotic administration, the rationale for dexamethasone, and the expected CSF findings.\n\nThe blood-brain barrier (BBB) is formed by specialized cerebral endothelial cells connected by tight junctions (occludin, claudin, ZO-1 proteins), surrounded by pericytes, and ensheathed by astrocyte end-feet. This barrier normally prevents circulating pathogens, immune cells, and large molecules from entering the CNS. Bacterial meningitis begins when pathogens breach this barrier through several mechanisms: (1) Hematogenous spread: bacteria in the bloodstream (bacteremia) attach to cerebral endothelial cells via surface adhesins, cross the endothelial layer via transcytosis or paracellular invasion, and enter the CSF. (2) Contiguous spread: from adjacent infected structures (sinusitis, otitis media, mastoiditis). (3) Direct inoculation: through skull fractures, neurosurgical procedures, or CSF shunts.\n\nOnce bacteria enter the subarachnoid space, the inflammatory cascade escalates rapidly: Bacterial cell wall components (lipopolysaccharide from gram-negative organisms, lipoteichoic acid and peptidoglycan from gram-positive organisms) activate resident microglia and meningeal macrophages via toll-like receptors (TLR-2, TLR-4). These cells release pro-inflammatory cytokines (TNF-alpha, IL-1beta, IL-6) and chemokines that recruit neutrophils from the bloodstream. Neutrophil infiltration through the disrupted BBB causes vasogenic and cytotoxic edema. Matrix metalloproteinases (MMP-8, MMP-9) released by neutrophils further degrade the BBB tight junction proteins, creating a positive feedback loop of increasing permeability and inflammation.\n\nThe inflammatory response causes three types of cerebral edema: (1) Vasogenic edema: BBB disruption allows plasma proteins and fluid to leak into the brain parenchyma. (2) Cytotoxic edema: bacterial toxins and inflammatory mediators directly damage neurons and glial cells, causing cellular swelling. (3) Interstitial edema: inflamed arachnoid granulations cannot adequately absorb CSF, and obstruction at the foramina of Luschka and Magendie (by purulent exudate) blocks CSF flow, causing obstructive hydrocephalus. All three types increase ICP.\n\nCSF changes in bacterial meningitis reflect this process: elevated opening pressure (>20 cmH2O), elevated WBC (>1000/microL, predominantly neutrophils), elevated protein (>45 mg/dL, from BBB breakdown and cell lysis), and decreased glucose (<40 mg/dL or CSF:serum ratio <0.4, because bacteria and neutrophils metabolize glucose). Gram stain is positive in 60-90% of cases. These findings differ significantly from viral meningitis (lymphocytic pleocytosis, normal glucose, mildly elevated protein) and fungal/TB meningitis (lymphocytic, low glucose, very high protein)."
    },
    riskFactors: [
      "Extremes of age (neonates, elderly >65)",
      "Immunocompromised states: HIV/AIDS, asplenia, complement deficiency, immunosuppressive therapy",
      "Close living quarters: college dormitories, military barracks, daycare centers",
      "Recent neurosurgery, head trauma, or CSF leak (basilar skull fracture)",
      "Cochlear implants (increased pneumococcal meningitis risk)",
      "Absence of vaccination (meningococcal, pneumococcal, Hib)",
      "Contiguous infection: sinusitis, otitis media, mastoiditis",
      "CSF shunt (ventriculoperitoneal shunt infection)"
    ],
    diagnostics: [
      "Lumbar puncture (LP) with CSF analysis: opening pressure, WBC with differential, protein, glucose, gram stain, culture",
      "Blood cultures (before antibiotics if possible, but do NOT delay antibiotics for LP or cultures)",
      "CT head before LP ONLY if: papilledema, focal neuro deficits, altered consciousness, immunocompromised, or seizures (risk of herniation)",
      "CBC with differential: elevated WBC with left shift (bandemia)",
      "BMP: sodium (SIADH risk in meningitis), glucose (for CSF:serum ratio)",
      "Procalcitonin: elevated in bacterial infection (helps differentiate bacterial from viral)",
      "Blood glucose at time of LP (calculate CSF:serum glucose ratio)"
    ],
    management: [
      "Empiric antibiotics IMMEDIATELY — do NOT delay for LP or imaging (mortality increases 30% per hour of delay)",
      "Empiric regimen: ceftriaxone + vancomycin ± ampicillin (for Listeria coverage if >50 years, immunocompromised, or alcoholic)",
      "Dexamethasone 0.15 mg/kg IV q6h × 4 days: give 15-20 minutes BEFORE or with first antibiotic dose (reduces mortality and hearing loss in pneumococcal meningitis)",
      "Droplet precautions until N. meningitidis is ruled out (minimum 24 hours of effective antibiotics)",
      "Prophylaxis for close contacts of meningococcal disease: ciprofloxacin or rifampin",
      "Manage increased ICP: HOB 30 degrees, osmotic therapy if needed",
      "Seizure prophylaxis if seizures occur",
      "Monitor for SIADH (hyponatremia) and DIC"
    ],
    nursingActions: [
      "Prioritize antibiotic administration — this is the most time-sensitive intervention",
      "Implement droplet precautions immediately for suspected meningococcal meningitis",
      "Perform neurological assessments every 1-2 hours: GCS, pupils, focal deficits",
      "Monitor for signs of increased ICP: headache, vomiting, altered LOC, pupil changes",
      "Maintain dim, quiet environment (photophobia and noise sensitivity are common)",
      "Assess for petechial/purpuric rash (meningococcemia — suggests N. meningitidis)",
      "Monitor strict I&O (SIADH risk causes fluid retention and hyponatremia)",
      "Provide emotional support — meningitis is terrifying for patients and families"
    ],
    signs: {
      left: [
        "Classic triad: fever, nuchal rigidity, altered mental status (present in <50% of patients)",
        "Severe headache with photophobia and phonophobia",
        "Kernig sign: resistance/pain with knee extension when hip is flexed 90°",
        "Brudzinski sign: involuntary hip/knee flexion when neck is passively flexed"
      ],
      right: [
        "Petechial/purpuric rash (meningococcemia — DIC and septic shock risk)",
        "Seizures (occur in 20-30% of bacterial meningitis cases)",
        "Cranial nerve palsies (CN III, VI, VII — from basal exudate)",
        "Waterhouse-Friderichsen syndrome: bilateral adrenal hemorrhage from meningococcal DIC — shock, DIC, adrenal crisis"
      ]
    },
    medications: [
      { name: "Ceftriaxone", type: "Third-Generation Cephalosporin", action: "Binds penicillin-binding proteins (PBPs), inhibiting bacterial cell wall synthesis. Excellent CSF penetration, active against S. pneumoniae and N. meningitidis", sideEffects: "Allergic reactions, biliary sludging, C. difficile infection", contra: "Anaphylaxis to cephalosporins, neonates receiving calcium-containing IV solutions", pearl: "First-line empiric therapy for community-acquired bacterial meningitis. Adult dose: 2g IV every 12 hours. Combine with vancomycin for pneumococcal coverage (increasing penicillin resistance) and ampicillin for Listeria coverage if indicated." },
      { name: "Dexamethasone", type: "Corticosteroid (Anti-inflammatory)", action: "Suppresses the inflammatory cascade (reduces TNF-alpha, IL-1beta, and BBB permeability), decreasing vasogenic edema and ICP", sideEffects: "Hyperglycemia, GI bleeding, immunosuppression, adrenal suppression", contra: "Give BEFORE or WITH first antibiotic dose — ineffective if started after antibiotics", pearl: "Reduces mortality and hearing loss in PNEUMOCOCCAL meningitis specifically. Must be given 15-20 min BEFORE or simultaneously with first antibiotic dose. The inflammatory surge from antibiotic-induced bacterial lysis is what dexamethasone prevents." },
      { name: "Vancomycin", type: "Glycopeptide Antibiotic", action: "Inhibits cell wall synthesis by binding D-alanyl-D-alanine terminus of peptidoglycan precursors. Added to empiric regimen for penicillin-resistant pneumococcus", sideEffects: "Nephrotoxicity, ototoxicity, Red Man syndrome (histamine-mediated with rapid infusion)", contra: "Known hypersensitivity", pearl: "Always infuse over 60 minutes minimum to prevent Red Man syndrome. Monitor trough levels (target 15-20 mcg/mL for meningitis — higher than standard dosing). CSF penetration improves with meningeal inflammation." }
    ],
    pearls: [
      "DO NOT DELAY antibiotics for LP or CT — give empiric antibiotics IMMEDIATELY if meningitis is suspected. Every hour of delay increases mortality by 30%",
      "CSF findings: bacterial = neutrophils, high protein, low glucose; viral = lymphocytes, normal glucose, mildly high protein; fungal/TB = lymphocytes, low glucose, very high protein",
      "Dexamethasone timing is critical: must be given BEFORE or WITH first antibiotic dose — it prevents the inflammatory surge from antibiotic-induced bacterial cell wall lysis",
      "Classic triad (fever + nuchal rigidity + altered MS) present in <50% of patients — maintain high suspicion even without all three",
      "Meningococcal meningitis: droplet precautions × 24 hours of antibiotics, then standard. Close contacts need chemoprophylaxis (ciprofloxacin or rifampin)",
      "Kernig and Brudzinski signs have low sensitivity (5-30%) but high specificity for meningeal irritation"
    ],
    quiz: [
      { question: "A patient with suspected bacterial meningitis arrives in the ED. CT head is pending. What is the FIRST nursing priority?", options: ["Wait for CT results before any intervention", "Administer empiric IV antibiotics immediately", "Perform lumbar puncture", "Apply airborne precautions"], correct: 1, rationale: "Empiric antibiotics must be administered immediately — mortality increases 30% for each hour of delay. CT and LP are important but should NEVER delay antibiotic administration. Blood cultures can be drawn simultaneously if possible." },
      { question: "Which CSF finding is most consistent with bacterial meningitis?", options: ["Lymphocytic pleocytosis with normal glucose", "Neutrophilic pleocytosis with decreased glucose and elevated protein", "Clear CSF with normal cell count", "Elevated RBCs with xanthochromia"], correct: 1, rationale: "Bacterial meningitis produces neutrophilic pleocytosis (>1000 WBC/microL, predominantly neutrophils), decreased glucose (<40 mg/dL or CSF:serum ratio <0.4 — bacteria and neutrophils consume glucose), and elevated protein (>45 mg/dL from BBB disruption)." },
      { question: "When must dexamethasone be administered relative to antibiotics in bacterial meningitis?", options: ["24 hours after starting antibiotics", "Only after culture results are available", "15-20 minutes BEFORE or simultaneously with the first antibiotic dose", "Only for meningococcal meningitis"], correct: 2, rationale: "Dexamethasone reduces the inflammatory surge caused by bacterial cell wall components released when antibiotics kill bacteria. It must be given before or with the first dose to be effective. Starting after antibiotics does not provide benefit." }
    ]
  },

  "parkinson-disease-rn": {
    title: "Parkinson Disease: Pathophysiology & Nursing Management",
    cellular: {
      title: "Dopaminergic Neuron Loss, Lewy Body Pathology, and Basal Ganglia Circuitry",
      content: "Parkinson disease (PD) is a progressive neurodegenerative disorder characterized by the loss of dopaminergic neurons in the substantia nigra pars compacta (SNpc) of the midbrain, resulting in dopamine deficiency in the basal ganglia and the characteristic motor symptoms: resting tremor, rigidity, bradykinesia, and postural instability (TRAP mnemonic). Understanding the cellular pathophysiology is essential for nurses because it explains the rationale for dopamine replacement therapy, anticipation of disease progression, and management of motor and non-motor complications.\n\nThe substantia nigra pars compacta normally contains approximately 400,000-600,000 dopaminergic neurons that project to the striatum (caudate nucleus and putamen) via the nigrostriatal pathway. These neurons synthesize dopamine from tyrosine (tyrosine → L-DOPA via tyrosine hydroxylase → dopamine via DOPA decarboxylase) and release it into the striatum, where it modulates basal ganglia motor circuits. Clinical symptoms of PD appear when approximately 60-80% of dopaminergic neurons are lost, indicating substantial presymptomatic neurodegeneration.\n\nLewy bodies are the pathological hallmark of PD: intracytoplasmic eosinophilic inclusions composed primarily of misfolded alpha-synuclein protein surrounded by ubiquitin and neurofilament proteins. Alpha-synuclein is normally a presynaptic protein involved in vesicle trafficking and neurotransmitter release. In PD, alpha-synuclein misfolds into beta-sheet-rich fibrils that aggregate into Lewy bodies and Lewy neurites. These aggregates are directly neurotoxic through multiple mechanisms: mitochondrial dysfunction, oxidative stress, proteasomal impairment, endoplasmic reticulum stress, and neuroinflammation. The Braak staging hypothesis proposes that alpha-synuclein pathology begins in the olfactory bulb and dorsal motor nucleus of the vagus nerve (explaining early anosmia and constipation as prodromal symptoms), then ascends through the brainstem to the substantia nigra (motor symptoms), and eventually reaches the cortex (cognitive decline and dementia).\n\nBasal ganglia circuitry: The basal ganglia regulate the initiation and execution of voluntary movement through two parallel pathways: (1) Direct pathway: striatal neurons expressing D1 dopamine receptors project to the globus pallidus interna (GPi), facilitating movement. Dopamine activates D1 receptors, promoting movement. (2) Indirect pathway: striatal neurons expressing D2 dopamine receptors project to the globus pallidus externa (GPe), ultimately inhibiting movement. Dopamine inhibits D2 receptors, reducing the brake on movement. In PD, dopamine deficiency causes underactivity of the direct pathway (less movement facilitation) and overactivity of the indirect pathway (more movement inhibition), resulting in the hypokinetic movement disorder (bradykinesia, rigidity, difficulty initiating movement)."
    },
    riskFactors: [
      "Age (strongest risk factor: rare before 50, incidence increases with each decade)",
      "Male sex (1.5:1 male-to-female ratio)",
      "Family history (5-10% have genetic forms: LRRK2, SNCA, PARK2/Parkin, PINK1, DJ-1)",
      "Pesticide/herbicide exposure (rotenone, paraquat — mitochondrial toxins)",
      "Rural living and well water consumption",
      "History of traumatic brain injury",
      "Protective factors: caffeine consumption, tobacco use (paradoxically), vigorous exercise"
    ],
    diagnostics: [
      "Clinical diagnosis based on cardinal motor features (TRAP): bradykinesia PLUS resting tremor and/or rigidity",
      "Positive response to levodopa trial supports diagnosis (symptomatic improvement)",
      "DaTscan (dopamine transporter imaging): demonstrates reduced dopaminergic uptake in striatum",
      "MRI brain: primarily to rule out other causes (normal in PD; may show midbrain atrophy in advanced disease)",
      "Assessment scales: Unified Parkinson Disease Rating Scale (UPDRS), Hoehn and Yahr staging (I-V)",
      "Screen for non-motor symptoms: depression, anxiety, REM sleep behavior disorder, constipation, anosmia, cognitive changes",
      "Evaluate for orthostatic hypotension (common autonomic dysfunction)"
    ],
    management: [
      "Carbidopa-levodopa: gold standard treatment (most effective for motor symptoms)",
      "MAO-B inhibitors (selegiline, rasagiline): mild symptomatic benefit, possible neuroprotective effect",
      "Dopamine agonists (pramipexole, ropinirole, rotigotine patch): used early or as adjunct",
      "COMT inhibitors (entacapone, opicapone): extend levodopa duration, reduce 'off' time",
      "Amantadine: for levodopa-induced dyskinesias",
      "Deep brain stimulation (DBS) of subthalamic nucleus or GPi for motor fluctuations and dyskinesias refractory to medication",
      "Exercise program: improves gait, balance, flexibility, and quality of life",
      "Multidisciplinary care: neurology, PT, OT, SLP, psychiatry, social work"
    ],
    nursingActions: [
      "Administer carbidopa-levodopa on strict schedule (timing affects motor function dramatically)",
      "Give levodopa on empty stomach for optimal absorption (high-protein meals compete for absorption)",
      "Monitor for 'on-off' phenomenon: sudden unpredictable fluctuations between mobile ('on') and immobile ('off') states",
      "Assess for dyskinesias: involuntary choreiform movements during peak levodopa effect",
      "Implement fall prevention: gait assessment, assistive devices, environmental modifications",
      "Assess swallowing function (dysphagia risk increases with progression)",
      "Monitor for orthostatic hypotension: check lying and standing BP",
      "Screen for depression and cognitive changes at each visit"
    ],
    signs: {
      left: [
        "Resting tremor: 4-6 Hz 'pill-rolling' tremor, worst at rest, improves with intentional movement",
        "Bradykinesia: slowness of movement, decreased amplitude with repetitive actions (micrographia, hypomimia/masked facies)",
        "Rigidity: 'cogwheel' (ratchety) resistance to passive movement throughout ROM",
        "Postural instability: impaired balance, retropulsion (pull test positive)"
      ],
      right: [
        "Motor fluctuations: wearing off (end-of-dose deterioration), on-off phenomenon",
        "Levodopa-induced dyskinesias: involuntary choreiform movements at peak dose",
        "Non-motor: depression, anxiety, REM sleep behavior disorder, constipation, anosmia, cognitive decline",
        "Autonomic dysfunction: orthostatic hypotension, urinary frequency, excessive sweating"
      ]
    },
    medications: [
      { name: "Carbidopa-Levodopa (Sinemet)", type: "Dopamine Precursor + Peripheral Decarboxylase Inhibitor", action: "Levodopa crosses the BBB and is converted to dopamine in remaining nigrostriatal neurons. Carbidopa prevents peripheral conversion (reducing nausea and increasing CNS availability)", sideEffects: "Nausea, orthostatic hypotension, dyskinesias, hallucinations, impulse control disorders, on-off fluctuations", contra: "Concurrent non-selective MAO inhibitor, narrow-angle glaucoma, malignant melanoma (relative)", pearl: "GOLD STANDARD for PD. Give 30 min before or 1 hour after meals (protein competes for absorption). Timing is critical — missed doses cause rapid motor decline. After 5-10 years, most patients develop motor fluctuations and dyskinesias. NEVER stop abruptly (risk of neuroleptic malignant-like syndrome)." },
      { name: "Pramipexole (Mirapex)", type: "Non-Ergot Dopamine Agonist (D2/D3 Preferring)", action: "Directly stimulates dopamine receptors in the striatum, bypassing the need for dopamine synthesis", sideEffects: "Somnolence (sudden sleep attacks — warn about driving), nausea, edema, hallucinations, impulse control disorders (gambling, hypersexuality, compulsive shopping/eating)", contra: "Known hypersensitivity", pearl: "Used as monotherapy in early PD or adjunct to levodopa. Major counseling point: impulse control disorders affect 15-20% of patients — screen at EVERY visit. Sudden sleep attacks can occur without warning — patients must be warned about driving." },
      { name: "Entacapone (Comtan)", type: "COMT Inhibitor (Peripheral)", action: "Inhibits catechol-O-methyltransferase, preventing peripheral metabolism of levodopa, extending its duration of action and plasma half-life", sideEffects: "Dyskinesias (from increased levodopa effect), nausea, urine discoloration (orange-brown), diarrhea", contra: "Concurrent non-selective MAO inhibitor, pheochromocytoma", pearl: "Given with EACH dose of levodopa (not separately). Available as Stalevo (carbidopa + levodopa + entacapone combined tablet). Reduces 'off' time by 1-2 hours/day. Warn patients about orange-brown urine discoloration (harmless)." }
    ],
    pearls: [
      "TRAP mnemonic for cardinal features: Tremor (resting, pill-rolling), Rigidity (cogwheel), Akinesia/bradykinesia, Postural instability",
      "Carbidopa-levodopa timing is critical — administer 30 min before meals. Protein competes for the same intestinal amino acid transporter used for levodopa absorption",
      "NEVER abruptly discontinue levodopa — can precipitate a life-threatening crisis resembling neuroleptic malignant syndrome (rigidity, hyperthermia, altered consciousness)",
      "Impulse control disorders (gambling, hypersexuality, compulsive shopping) affect 15-20% of patients on dopamine agonists — screen at EVERY visit",
      "Non-motor symptoms often precede motor symptoms by years: constipation, anosmia, REM sleep behavior disorder, depression",
      "Fall risk is extremely high — most dangerous motor complication. PT for gait training and balance exercises is essential"
    ],
    quiz: [
      { question: "A patient with Parkinson disease reports that their medications seem to 'wear off' before the next dose, with return of tremor and stiffness. What does this describe?", options: ["Medication toxicity", "End-of-dose wearing off (motor fluctuation)", "Disease cure requiring medication discontinuation", "Allergic reaction"], correct: 1, rationale: "End-of-dose wearing off is a motor fluctuation that develops after years of levodopa therapy. As dopaminergic neurons continue to degenerate, the brain loses its ability to store and smoothly release dopamine from levodopa. Management includes more frequent dosing, adding COMT inhibitors, or adding dopamine agonists." },
      { question: "When should carbidopa-levodopa be administered in relation to meals?", options: ["With a high-protein meal for best absorption", "30 minutes before or 1 hour after meals", "Timing does not matter", "Only at bedtime"], correct: 1, rationale: "Dietary protein (amino acids) competes with levodopa for the same intestinal and blood-brain barrier transport system. Taking levodopa 30 minutes before or 1 hour after meals optimizes absorption and CNS delivery." },
      { question: "A patient on pramipexole reports new compulsive gambling behavior. What is the most appropriate nursing action?", options: ["Reassure the patient this is a coincidence", "Report to the provider — this is a known impulse control disorder side effect", "Increase the pramipexole dose", "Refer to a gambling counselor only"], correct: 1, rationale: "Impulse control disorders (gambling, hypersexuality, compulsive shopping/eating) are a well-documented side effect of dopamine agonists (pramipexole, ropinirole), affecting 15-20% of patients. The provider must be notified for medication adjustment, typically dose reduction or switch to a different agent." }
    ]
  }
};
