import type { LessonContent } from "./types";

export const rpnPathoCardiovascularLessons: Record<string, LessonContent> = {
  "rpn-myocardial-infarction": {
    title: "Myocardial Infarction (MI)",
    cellular: {
      title: "Coronary Occlusion and Myocardial Necrosis",
      content: "Myocardial infarction (MI) occurs when blood flow through a coronary artery is abruptly reduced or completely occluded, causing irreversible ischemic injury and necrosis of cardiac muscle (myocytes). The pathophysiology begins with atherosclerotic plaque formation within the coronary arterial wall. Over years, lipid-laden macrophages (foam cells) accumulate within the tunica intima, forming a fibrous cap overlying a necrotic lipid core. When this fibrous cap ruptures, the exposed thrombogenic core activates the coagulation cascade and platelet aggregation, forming an occlusive thrombus. Within 20 minutes of complete occlusion, the affected myocytes shift from aerobic to anaerobic metabolism, depleting ATP reserves. Without ATP, the sodium-potassium ATPase pump fails, causing intracellular sodium and water accumulation (cellular edema) and potassium efflux into the extracellular space (contributing to dysrhythmias). By 30-40 minutes, irreversible injury begins as mitochondrial membranes rupture, intracellular calcium floods the cytoplasm activating destructive proteases and phospholipases, and cell membrane integrity is lost. Cardiac troponin I and T, structural proteins anchoring the contractile apparatus to the Z-disc, leak into the bloodstream — forming the basis for the primary biomarker used to diagnose MI. The wavefront phenomenon describes how necrosis progresses from the subendocardium (most vulnerable to ischemia because it has the highest metabolic demand and is furthest from the epicardial blood supply) outward toward the epicardium over 3-6 hours. This time-dependent progression underlies the clinical urgency of 'time is muscle' and the therapeutic window for reperfusion therapy. STEMI (ST-elevation MI) represents complete transmural ischemia with total coronary occlusion, while NSTEMI involves partial occlusion with subendocardial injury. Post-infarction, the infarcted tissue undergoes coagulative necrosis, followed by an inflammatory response (neutrophil infiltration within 12-24 hours, macrophage cleanup by day 3-7), granulation tissue formation (days 7-28), and ultimately dense scar formation by 6-8 weeks. This scar tissue is electrically inert and non-contractile, reducing overall cardiac output and potentially creating re-entrant circuits for ventricular dysrhythmias."
    },
    riskFactors: [
      "Coronary artery disease (atherosclerosis)",
      "Hypertension",
      "Hyperlipidemia (elevated LDL, low HDL)",
      "Diabetes mellitus",
      "Smoking history",
      "Family history of premature CAD (male <55, female <65)",
      "Obesity and sedentary lifestyle",
      "Cocaine use (coronary vasospasm)"
    ],
    diagnostics: [
      "12-lead ECG within 10 minutes of arrival (ST elevation, T-wave inversion, pathological Q waves)",
      "Serial cardiac troponin I or T levels (rise within 3-6 hours, peak 12-24 hours)",
      "CK-MB levels for reinfarction detection",
      "Continuous cardiac monitoring for dysrhythmias",
      "Chest X-ray to assess for pulmonary congestion",
      "Echocardiography to evaluate wall motion abnormalities"
    ],
    management: [
      "Activate STEMI protocol for ST-elevation MI (door-to-balloon time <90 minutes)",
      "Administer oxygen only if SpO2 <94%",
      "Establish IV access and continuous cardiac monitoring",
      "Administer MONA protocol as ordered: Morphine (if pain unrelieved), Oxygen (if hypoxic), Nitroglycerin (sublingual), Aspirin (162-325 mg chewed)",
      "Prepare for emergent PCI (percutaneous coronary intervention) or fibrinolytic therapy",
      "Maintain bed rest during acute phase",
      "Monitor for complications: cardiogenic shock, heart failure, dysrhythmias, cardiac rupture"
    ],
    nursingActions: [
      "Assess pain using validated scale — document location, character, radiation, severity, and response to treatment",
      "Obtain and interpret 12-lead ECG within 10 minutes; report ST changes immediately",
      "Monitor vital signs every 15 minutes during acute phase",
      "Administer prescribed medications promptly (aspirin, nitroglycerin, heparin, beta-blockers)",
      "Maintain continuous telemetry and report dysrhythmias immediately",
      "Monitor I&O and assess for signs of heart failure (crackles, JVD, edema)",
      "Provide emotional support — MI is terrifying; reassure and explain interventions calmly",
      "Educate on cardiac rehabilitation, medication adherence, and lifestyle modification before discharge"
    ],
    assessmentFindings: [
      "Crushing substernal chest pain radiating to left arm, jaw, or back",
      "Diaphoresis, nausea, vomiting",
      "Dyspnea and anxiety ('sense of impending doom')",
      "Tachycardia or bradycardia depending on location of infarction",
      "Hypotension if significant myocardial damage",
      "Atypical presentations in women, elderly, diabetics: fatigue, indigestion, back pain"
    ],
    signs: {
      left: ["Substernal chest pain (>20 min)", "Diaphoresis", "Nausea/Vomiting", "ST-elevation on ECG"],
      right: ["Dyspnea", "Anxiety", "Elevated troponin", "New-onset dysrhythmias"]
    },
    medications: [
      { name: "Aspirin", type: "Antiplatelet", action: "Inhibits cyclooxygenase, blocking thromboxane A2-mediated platelet aggregation", sideEffects: "GI bleeding, tinnitus", contra: "Active GI hemorrhage, aspirin allergy", pearl: "Give 162-325 mg CHEWED immediately — chewing accelerates absorption by 50%." },
      { name: "Nitroglycerin", type: "Vasodilator", action: "Releases nitric oxide causing venous and coronary vasodilation, reducing preload and myocardial oxygen demand", sideEffects: "Headache, hypotension, reflex tachycardia", contra: "Systolic BP <90 mmHg, phosphodiesterase-5 inhibitor use within 24-48 hours, right ventricular infarction", pearl: "Give SL q5min x3 doses. Hold if SBP <90. Right ventricular MI = NO nitro (preload dependent)." },
      { name: "Morphine Sulfate", type: "Opioid Analgesic", action: "Reduces pain and anxiety, decreases preload through venodilation, reduces myocardial oxygen demand", sideEffects: "Respiratory depression, hypotension, nausea", contra: "Respiratory depression, hypotension", pearl: "Give only if pain unrelieved by nitroglycerin. Have naloxone at bedside." },
      { name: "Metoprolol", type: "Beta-1 Blocker", action: "Reduces heart rate, contractility, and myocardial oxygen demand by blocking beta-1 adrenergic receptors", sideEffects: "Bradycardia, hypotension, fatigue, bronchospasm", contra: "Heart rate <60, SBP <100, heart block, acute decompensated HF, severe asthma", pearl: "Check HR and BP before each dose. Hold for HR <60 or SBP <100." }
    ],
    pearls: [
      "TIME IS MUSCLE: Every 30-minute delay in reperfusion increases mortality — door-to-balloon <90 min for STEMI",
      "Aspirin should be CHEWED not swallowed — faster onset by buccal absorption",
      "Right ventricular MI = NO nitroglycerin, NO morphine, NO diuretics — these patients are preload dependent; give IV fluids instead",
      "Women, elderly, and diabetics often present atypically — do not dismiss vague symptoms",
      "Serial troponins are essential — a single negative result does not rule out MI",
      "Post-MI complications by timeline: dysrhythmias (first 24h), heart failure (days 1-3), ventricular rupture (days 3-7), Dressler syndrome (weeks 2-10)"
    ],
    quiz: [
      { question: "A client presents with crushing substernal chest pain, diaphoresis, and ST-elevation in leads II, III, and aVF. Which coronary artery is most likely occluded?", options: ["Left anterior descending", "Right coronary artery", "Left circumflex", "Left main coronary"], correct: 1, rationale: "ST-elevation in leads II, III, and aVF indicates an inferior wall MI, which is most commonly caused by right coronary artery (RCA) occlusion. The RCA supplies the inferior wall of the left ventricle and typically the SA and AV nodes." },
      { question: "Which medication should the nurse withhold in a client with a confirmed right ventricular infarction?", options: ["Aspirin", "Heparin", "Nitroglycerin", "Metoprolol"], correct: 2, rationale: "Nitroglycerin causes venodilation, reducing preload. Right ventricular infarction makes the right ventricle preload-dependent, so reducing preload can cause profound hypotension and cardiovascular collapse." },
      { question: "Why is aspirin ordered to be chewed rather than swallowed whole during an acute MI?", options: ["To reduce the dose needed", "To prevent nausea", "To achieve faster antiplatelet effect through buccal absorption", "To bypass liver metabolism"], correct: 2, rationale: "Chewing aspirin achieves effective antiplatelet levels within 15 minutes versus 60+ minutes if swallowed whole. Faster platelet inhibition reduces ongoing thrombus formation during the critical early minutes of MI treatment." }
    ]
  },

  "rpn-heart-failure-standalone": {
    title: "Heart Failure (RPN Pathophysiology)",
    cellular: {
      title: "Ventricular Dysfunction and Neurohormonal Compensation",
      content: "Heart failure (HF) is a complex clinical syndrome in which the heart is unable to pump sufficient blood to meet the metabolic demands of the body, or can do so only at elevated filling pressures. The pathophysiology involves a cascade of maladaptive compensatory mechanisms that initially maintain cardiac output but ultimately worsen ventricular function over time. The two primary phenotypes are heart failure with reduced ejection fraction (HFrEF, EF ≤40%, systolic failure) and heart failure with preserved ejection fraction (HFpEF, EF ≥50%, diastolic failure). In HFrEF, the ventricular myocardium loses contractile force due to myocyte death (from MI), chronic pressure overload (from hypertension), or volume overload (from valvular regurgitation). The surviving myocytes hypertrophy eccentrically, and the ventricle dilates to maintain stroke volume through the Frank-Starling mechanism. However, excessive dilation stretches sarcomeres beyond their optimal length, reducing contractile efficiency. In HFpEF, the ventricular wall thickens concentrically (from chronic hypertension or hypertrophic cardiomyopathy), reducing chamber compliance. The stiff ventricle resists filling during diastole, elevating left atrial and pulmonary venous pressures. When cardiac output falls, the body activates three major neurohormonal compensatory systems. First, the sympathetic nervous system releases catecholamines (norepinephrine and epinephrine) that increase heart rate and contractility but also increase myocardial oxygen demand and cause vasoconstriction, increasing afterload. Second, the renin-angiotensin-aldosterone system (RAAS) is activated by reduced renal perfusion: renin converts angiotensinogen to angiotensin I, which ACE converts to angiotensin II, a potent vasoconstrictor that stimulates aldosterone secretion, causing sodium and water retention. Third, ADH (vasopressin) secretion increases, further promoting water retention. While these mechanisms temporarily sustain blood pressure and perfusion, chronic activation leads to progressive fluid overload, ventricular remodeling (fibrosis and further dilation), and worsening HF — creating a vicious cycle. Left-sided HF causes pulmonary congestion (dyspnea, orthopnea, crackles, pink frothy sputum in severe cases). Right-sided HF (often secondary to left-sided HF) causes systemic venous congestion (JVD, hepatomegaly, dependent edema, ascites)."
    },
    riskFactors: [
      "Coronary artery disease/prior MI (most common cause of HFrEF)",
      "Chronic hypertension (most common cause of HFpEF)",
      "Valvular heart disease",
      "Diabetes mellitus",
      "Obesity",
      "Excessive alcohol use (alcoholic cardiomyopathy)",
      "Cardiotoxic medications (doxorubicin, trastuzumab)",
      "Age >65 years"
    ],
    diagnostics: [
      "BNP or NT-proBNP levels (elevated with ventricular wall stress — BNP >100 pg/mL suggestive)",
      "Echocardiography to measure ejection fraction and assess wall motion",
      "Chest X-ray for cardiomegaly and pulmonary congestion",
      "Daily weight monitoring (most reliable indicator of fluid status)",
      "Strict intake and output monitoring",
      "Electrolyte panel (especially potassium and sodium)",
      "Renal function (BUN and creatinine — cardiorenal syndrome)"
    ],
    management: [
      "Implement sodium restriction (usually <2 g/day) as ordered",
      "Enforce fluid restriction if ordered (typically 1.5-2 L/day in severe HF)",
      "Administer prescribed medications: ACE inhibitors/ARBs, beta-blockers, diuretics, aldosterone antagonists",
      "Daily weight at same time, same scale, same clothing — report gain >1 kg/day or >2 kg/week",
      "Elevate head of bed for dyspnea management",
      "Activity as tolerated with rest periods; avoid overexertion",
      "Cardiac rehabilitation referral as ordered"
    ],
    nursingActions: [
      "Weigh patient daily at the same time on the same scale — report weight gain >1 kg in 24 hours",
      "Monitor I&O strictly with attention to fluid balance",
      "Assess respiratory status: auscultate lung sounds for crackles, monitor SpO2, assess for orthopnea and PND",
      "Monitor for right-sided HF signs: JVD, hepatomegaly, dependent edema, ascites",
      "Administer diuretics in the morning to prevent nocturia",
      "Monitor potassium levels with diuretic use — hypokalemia increases dysrhythmia risk",
      "Assess for medication side effects: hypotension (ACE inhibitors), bradycardia (beta-blockers), electrolyte imbalance (diuretics)",
      "Educate on sodium restriction, daily weights, fluid restriction, medication adherence, and when to seek emergency care"
    ],
    assessmentFindings: [
      "Dyspnea on exertion progressing to dyspnea at rest",
      "Orthopnea (how many pillows?) and paroxysmal nocturnal dyspnea (PND)",
      "Bilateral crackles on auscultation",
      "JVD, hepatojugular reflux",
      "Peripheral edema (assess sacral edema in bedbound patients)",
      "Weight gain from fluid retention",
      "Fatigue and exercise intolerance",
      "S3 gallop (ventricular gallop — hallmark of HFrEF)"
    ],
    signs: {
      left: ["Dyspnea/Orthopnea", "Pulmonary crackles", "Pink frothy sputum (severe)", "S3 gallop"],
      right: ["JVD", "Hepatomegaly", "Dependent edema", "Ascites"]
    },
    medications: [
      { name: "Furosemide (Lasix)", type: "Loop Diuretic", action: "Inhibits sodium-potassium-2-chloride cotransporter in ascending loop of Henle, producing rapid diuresis", sideEffects: "Hypokalemia, hyponatremia, dehydration, ototoxicity at high doses", contra: "Anuria, severe hypovolemia", pearl: "Monitor potassium closely — hypokalemia + digoxin = lethal dysrhythmias. Give in AM to prevent nocturia." },
      { name: "Enalapril (ACE Inhibitor)", type: "RAAS Inhibitor", action: "Blocks angiotensin-converting enzyme, reducing angiotensin II formation, decreasing afterload and aldosterone secretion", sideEffects: "Persistent dry cough, hyperkalemia, hypotension, angioedema (rare but emergent)", contra: "Bilateral renal artery stenosis, pregnancy, history of angioedema", pearl: "Dry cough is class effect — switch to ARB if intolerable. Monitor potassium and renal function." },
      { name: "Carvedilol", type: "Beta-Blocker", action: "Blocks beta-1 receptors reducing HR and contractility; also has alpha-1 blocking effect for vasodilation", sideEffects: "Bradycardia, hypotension, fatigue, dizziness, bronchospasm", contra: "HR <60, decompensated HF, severe asthma, AV block", pearl: "Start LOW, go SLOW. Do NOT start during acute decompensation — only when patient is stable and euvolemic." },
      { name: "Spironolactone", type: "Aldosterone Antagonist/K+-Sparing Diuretic", action: "Blocks aldosterone in the distal nephron, reducing sodium reabsorption and potassium excretion; reduces myocardial fibrosis", sideEffects: "Hyperkalemia, gynecomastia, GI upset", contra: "K+ >5.0, severe renal impairment (CrCl <30)", pearl: "Monitor potassium closely when combined with ACE inhibitors — risk of life-threatening hyperkalemia." }
    ],
    pearls: [
      "Daily weight is the BEST indicator of fluid status — more reliable than I&O",
      "Left-sided HF = LUNGS (dyspnea, crackles, orthopnea). Right-sided HF = BODY (JVD, edema, hepatomegaly)",
      "Never start beta-blockers during acute decompensation — wait until patient is stable and euvolemic",
      "ACE inhibitor cough is DRY and persistent — caused by bradykinin accumulation, not an allergy",
      "Teach patients the warning signs: weight gain >1 kg/day, increasing dyspnea, worsening edema — call provider immediately",
      "BNP rises with age; a BNP <100 makes HF unlikely, while >400 is highly suggestive"
    ],
    quiz: [
      { question: "Which assessment finding is the most reliable early indicator of worsening heart failure?", options: ["Increasing peripheral edema", "Daily weight gain of 1.5 kg", "New onset of fatigue", "Heart rate of 88 bpm"], correct: 1, rationale: "Daily weight is the most reliable and earliest indicator of fluid retention in heart failure. A gain >1 kg in 24 hours suggests approximately 1 litre of fluid retention and requires prompt reporting for diuretic adjustment." },
      { question: "A client with HFrEF is on enalapril and furosemide. The potassium level is 3.1 mEq/L. Which concern takes priority?", options: ["The enalapril may need to be discontinued", "Hypokalemia increases risk for fatal dysrhythmias, especially with concurrent digoxin", "The furosemide should be doubled to increase diuresis", "This potassium level is within normal limits"], correct: 1, rationale: "Potassium of 3.1 mEq/L is below normal (3.5-5.0) and creates risk for life-threatening ventricular dysrhythmias. Loop diuretics cause potassium wasting. This must be corrected promptly." },
      { question: "Why should the nurse hold carvedilol if the client's heart rate is 54 bpm?", options: ["Carvedilol only works at higher heart rates", "Beta-blockers decrease heart rate further, risking symptomatic bradycardia or heart block", "The medication needs to be given with food instead", "The dose should be doubled to achieve better control"], correct: 1, rationale: "Carvedilol is a beta-blocker that reduces heart rate. Administering it when HR is already <60 bpm risks symptomatic bradycardia, hypotension, or heart block. The nurse should hold the dose and notify the provider." }
    ]
  },

  "rpn-coronary-artery-disease": {
    title: "Coronary Artery Disease (CAD)",
    cellular: {
      title: "Atherosclerotic Plaque Formation and Progression",
      content: "Coronary artery disease (CAD) is a chronic progressive condition resulting from atherosclerosis — the accumulation of lipid-rich plaques within the intimal layer of the coronary arteries. The process begins with endothelial injury or dysfunction caused by risk factors such as hypertension (shear stress on vessel walls), hyperglycemia (glycosylation of endothelial proteins), smoking (direct endothelial toxicity), and hyperlipidemia (oxidized LDL infiltration). When endothelial cells are damaged, they express adhesion molecules (VCAM-1, ICAM-1) that attract circulating monocytes. These monocytes migrate into the subendothelial space and differentiate into macrophages, which engulf oxidized LDL cholesterol via scavenger receptors, becoming lipid-laden foam cells. The accumulation of foam cells forms a fatty streak — the earliest visible lesion of atherosclerosis, detectable even in adolescents. Over decades, smooth muscle cells migrate from the tunica media into the intima, proliferating and depositing extracellular matrix (collagen, elastin) to form a fibrous cap over the growing lipid core. The mature atherosclerotic plaque consists of a necrotic lipid core (dead foam cells, cholesterol crystals, cellular debris) covered by this fibrous cap. The plaque progressively narrows the coronary lumen, reducing blood flow. When luminal narrowing exceeds 70%, blood flow becomes insufficient to meet myocardial oxygen demand during exertion, producing stable angina pectoris (predictable chest pain with activity, relieved by rest or nitroglycerin). Plaque vulnerability determines clinical outcome: stable plaques have thick fibrous caps and small lipid cores, while vulnerable (unstable) plaques have thin fibrous caps, large lipid cores, and active inflammation. When a vulnerable plaque ruptures, the exposed lipid core triggers platelet aggregation and thrombus formation, leading to unstable angina (rest pain without troponin elevation) or MI (with troponin elevation and myocyte necrosis)."
    },
    riskFactors: [
      "Non-modifiable: age (male >45, female >55), male sex, family history of premature CAD",
      "Hyperlipidemia (elevated LDL >3.5 mmol/L, low HDL <1.0 mmol/L)",
      "Hypertension (>130/80 mmHg)",
      "Diabetes mellitus",
      "Smoking (doubles CAD risk; secondhand smoke also harmful)",
      "Obesity (BMI >30) and physical inactivity",
      "Metabolic syndrome",
      "Chronic kidney disease"
    ],
    diagnostics: [
      "Fasting lipid panel (LDL, HDL, total cholesterol, triglycerides)",
      "Resting 12-lead ECG (may show ST changes, Q waves from prior MI)",
      "Blood pressure monitoring",
      "Blood glucose and HbA1c for diabetes screening",
      "Stress testing (exercise or pharmacological) as ordered",
      "Coronary angiography for definitive assessment of stenosis"
    ],
    management: [
      "Lifestyle modification: smoking cessation, heart-healthy diet (Mediterranean, DASH), regular exercise 150 min/week",
      "Administer prescribed statin therapy for LDL reduction",
      "Administer antiplatelet therapy (aspirin) as ordered",
      "Blood pressure control with prescribed antihypertensives",
      "Blood glucose management in diabetic patients",
      "Nitroglycerin PRN for anginal episodes — teach proper SL administration",
      "Prepare for revascularization (PCI or CABG) if indicated"
    ],
    nursingActions: [
      "Assess and document chest pain characteristics using PQRST format",
      "Teach nitroglycerin use: 1 tablet SL q5min x3, call 911 if no relief after first dose",
      "Monitor vital signs before and after activity — document activity tolerance",
      "Educate on modifiable risk factor reduction and medication adherence",
      "Administer and monitor statin therapy — check liver function, assess for myopathy",
      "Teach about heart-healthy diet and encourage cardiac rehabilitation participation",
      "Monitor for progression: increasing anginal frequency, decreased exercise tolerance"
    ],
    assessmentFindings: [
      "Stable angina: substernal chest pressure with exertion, relieved by rest or NTG",
      "May be asymptomatic until significant stenosis develops (>70%)",
      "Dyspnea on exertion",
      "Fatigue with decreased exercise tolerance",
      "ECG may show ST depression during ischemic episodes"
    ],
    signs: {
      left: ["Exertional chest pain/pressure", "Predictable anginal pattern", "Dyspnea on exertion", "ST depression during stress test"],
      right: ["Relieved by rest/NTG", "Risk factor clustering", "May be asymptomatic", "Progressive exercise intolerance"]
    },
    medications: [
      { name: "Atorvastatin", type: "HMG-CoA Reductase Inhibitor (Statin)", action: "Inhibits cholesterol synthesis in the liver, reducing LDL production and increasing hepatic LDL receptor expression for enhanced clearance", sideEffects: "Myalgia, elevated liver enzymes, rhabdomyolysis (rare)", contra: "Active liver disease, pregnancy", pearl: "Report unexplained muscle pain or weakness immediately — could indicate rhabdomyolysis. Take at bedtime for optimal effect." },
      { name: "Nitroglycerin SL", type: "Vasodilator", action: "Converts to nitric oxide, causing venodilation (reduces preload) and coronary vasodilation (increases myocardial blood flow)", sideEffects: "Headache, hypotension, dizziness", contra: "SBP <90, PDE-5 inhibitor use, right ventricular MI", pearl: "1 tablet SL q5min x3 max. Sit or lie down. Call EMS if no relief after first dose. Store in dark glass container; expires 6 months after opening." },
      { name: "ASA (Aspirin) 81 mg", type: "Antiplatelet", action: "Irreversibly inhibits COX-1 in platelets, preventing thromboxane A2 production and platelet aggregation", sideEffects: "GI irritation, bleeding risk", contra: "Active bleeding, aspirin allergy, children <18 (Reye syndrome)", pearl: "Low-dose daily aspirin for secondary prevention. Take with food to reduce GI irritation." }
    ],
    pearls: [
      "Stable angina = predictable pattern with exertion, relieved by rest/NTG. Unstable angina = new onset, changing pattern, or at rest — MEDICAL EMERGENCY",
      "Most MIs occur from rupture of SMALL plaques (<50% stenosis) that are vulnerable, not from large stable plaques",
      "Nitroglycerin causes a headache — this is expected and indicates the drug is active. Absence of headache may suggest expired medication",
      "Statin therapy is the cornerstone of CAD management — reducing LDL by 1 mmol/L reduces cardiovascular events by 22%",
      "Women may present with atypical symptoms: fatigue, jaw pain, nausea rather than classic chest pain",
      "Mediterranean and DASH diets have demonstrated mortality reduction in CAD patients"
    ],
    quiz: [
      { question: "A client reports chest pressure that occurs predictably when climbing two flights of stairs and resolves within 5 minutes of rest. What does this pattern describe?", options: ["Unstable angina", "Stable angina pectoris", "Prinzmetal angina", "Myocardial infarction"], correct: 1, rationale: "Stable angina presents with predictable chest pain triggered by exertion that is relieved by rest or nitroglycerin. The pattern is consistent and does not occur at rest or with increasing frequency." },
      { question: "A client on atorvastatin reports new-onset generalized muscle aches and dark-colored urine. What should the nurse do?", options: ["Reassure the client this is a common harmless side effect", "Hold the statin and report immediately — suspect rhabdomyolysis", "Advise increased fluid intake only", "Document and continue as prescribed"], correct: 1, rationale: "Myalgia with dark urine (myoglobinuria) suggests rhabdomyolysis — a serious statin side effect involving skeletal muscle breakdown. This requires immediate reporting, statin discontinuation, CK level measurement, and aggressive hydration to prevent acute kidney injury." }
    ]
  },

  "rpn-cardiogenic-shock": {
    title: "Cardiogenic Shock",
    cellular: {
      title: "Pump Failure and Tissue Hypoperfusion",
      content: "Cardiogenic shock is a state of critical end-organ hypoperfusion caused by severe impairment of cardiac pump function, most commonly following a large acute myocardial infarction affecting ≥40% of the left ventricular myocardium. It represents the most lethal form of shock, with mortality rates of 40-50% even with optimal treatment. The pathophysiology involves a devastating positive feedback loop: massive myocardial damage reduces stroke volume and cardiac output, causing systemic hypotension. Reduced coronary perfusion pressure further worsens myocardial ischemia, extending the infarct zone and further reducing contractility. Meanwhile, compensatory vasoconstriction (sympathetic activation) increases afterload (systemic vascular resistance), forcing the failing ventricle to work harder against greater resistance, further depleting ATP and worsening pump failure. At the cellular level, cardiomyocytes in the border zone between infarcted and viable tissue become stunned (reversibly dysfunctional from ischemia-reperfusion injury) or hibernating (chronically underperfused but viable). These cells retain the potential for recovery if perfusion is restored. As cardiac output falls below 2.2 L/min/m² (cardiac index), end-organ hypoperfusion produces oliguria (renal), altered mental status (cerebral), cool clammy extremities (peripheral), elevated lactate (anaerobic metabolism), and metabolic acidosis. Pulmonary capillary wedge pressure (PCWP) rises >18 mmHg as the failing left ventricle cannot eject blood effectively, causing backward congestion into the pulmonary vasculature and resulting in pulmonary edema. The combination of low cardiac output, high SVR, and high PCWP distinguishes cardiogenic shock from other shock types (hypovolemic: low PCWP; distributive/septic: low SVR)."
    },
    riskFactors: [
      "Large anterior MI (>40% LV myocardium affected)",
      "Prior MI with existing LV dysfunction",
      "Advanced age",
      "Diabetes mellitus",
      "Severe multivessel coronary artery disease",
      "Mechanical complications: papillary muscle rupture, ventricular septal rupture, free wall rupture",
      "Acute myocarditis",
      "Massive pulmonary embolism (right-sided cardiogenic shock)"
    ],
    diagnostics: [
      "Continuous hemodynamic monitoring (arterial line, central venous catheter)",
      "Pulmonary artery catheter readings: elevated PCWP (>18 mmHg), low cardiac index (<2.2 L/min/m²), elevated SVR",
      "Lactate levels (elevated indicates tissue hypoperfusion and anaerobic metabolism)",
      "Arterial blood gas for acidosis assessment",
      "Continuous ECG monitoring",
      "Echocardiography for wall motion, EF, and mechanical complications",
      "Urine output monitoring (target >0.5 mL/kg/hr)"
    ],
    management: [
      "Emergency reperfusion therapy (PCI or CABG) — definitive treatment",
      "Inotropic support: dobutamine (increases contractility) as ordered",
      "Vasopressor support: norepinephrine for MAP maintenance >65 mmHg as ordered",
      "Intra-aortic balloon pump (IABP) or mechanical circulatory support as ordered",
      "Cautious IV fluid challenge only if no pulmonary congestion (most cardiogenic shock patients are volume overloaded)",
      "Avoid aggressive diuresis if hypotensive — balance is critical",
      "Transfer to ICU or critical care unit"
    ],
    nursingActions: [
      "Monitor vital signs continuously — arterial line BP, HR, SpO2, MAP",
      "Monitor urine output hourly — report <0.5 mL/kg/hr",
      "Assess level of consciousness frequently — altered mentation indicates cerebral hypoperfusion",
      "Assess peripheral perfusion: skin color, temperature, capillary refill, peripheral pulses",
      "Monitor IV infusion rates of vasoactive medications precisely — use infusion pumps",
      "Assess lung sounds for worsening pulmonary edema",
      "Maintain bed rest in position of comfort (usually semi-Fowler's)",
      "Provide emotional support to patient and family — explain interventions and prognosis sensitively"
    ],
    assessmentFindings: [
      "Hypotension: SBP <90 mmHg or MAP <65 mmHg unresponsive to fluids",
      "Tachycardia (compensatory sympathetic response)",
      "Cool, clammy, mottled extremities with prolonged capillary refill >3 seconds",
      "Oliguria (<0.5 mL/kg/hr)",
      "Altered mental status: confusion, agitation, lethargy",
      "Pulmonary congestion: crackles, dyspnea, pink frothy sputum",
      "Elevated lactate (>2 mmol/L) and metabolic acidosis"
    ],
    signs: {
      left: ["Hypotension (SBP <90)", "Tachycardia", "Oliguria", "Altered mental status"],
      right: ["Cool/clammy/mottled skin", "Pulmonary edema", "Elevated lactate", "Metabolic acidosis"]
    },
    medications: [
      { name: "Dobutamine", type: "Inotrope (Beta-1 Agonist)", action: "Increases myocardial contractility and cardiac output by stimulating beta-1 receptors; mild vasodilation reduces afterload", sideEffects: "Tachycardia, dysrhythmias, increased myocardial oxygen demand", contra: "Hypertrophic obstructive cardiomyopathy, idiopathic hypertrophic subaortic stenosis", pearl: "First-line inotrope for cardiogenic shock. Monitor HR — tachycardia increases myocardial oxygen demand and can extend infarction." },
      { name: "Norepinephrine", type: "Vasopressor (Alpha-1 + Beta-1 Agonist)", action: "Potent vasoconstriction (alpha-1) raises SVR and BP; mild beta-1 effect increases contractility", sideEffects: "Peripheral ischemia, tissue necrosis with extravasation, hypertension, reflex bradycardia", contra: "Mesenteric or peripheral vascular occlusion", pearl: "Preferred vasopressor in cardiogenic shock. Administer via central line. Check IV site frequently — extravasation causes tissue necrosis. Have phentolamine available." },
      { name: "Milrinone", type: "Phosphodiesterase-3 Inhibitor (Inodilator)", action: "Increases contractility by raising intracellular cAMP; vasodilation reduces preload and afterload", sideEffects: "Hypotension (from vasodilation), ventricular dysrhythmias, thrombocytopenia", contra: "Severe aortic stenosis", pearl: "Used when dobutamine alone is insufficient. Causes significant vasodilation — often requires concurrent vasopressor." }
    ],
    pearls: [
      "Cardiogenic shock = pump failure. Think: LOW output, HIGH pressures, HIGH SVR",
      "Unlike hypovolemic shock, IV fluid boluses may WORSEN cardiogenic shock by increasing pulmonary congestion",
      "Definitive treatment is emergency revascularization (PCI/CABG) — inotropes and vasopressors are bridges",
      "Cool, clammy skin differentiates cardiogenic from distributive (warm) shock",
      "Monitor lactate trends — rising lactate despite treatment indicates worsening tissue perfusion",
      "IABP counterpulsation improves coronary perfusion (inflates during diastole) and reduces afterload (deflates before systole)"
    ],
    quiz: [
      { question: "Which hemodynamic profile is characteristic of cardiogenic shock?", options: ["Low PCWP, low SVR, high cardiac output", "High PCWP, high SVR, low cardiac output", "Normal PCWP, high SVR, normal cardiac output", "Low PCWP, high SVR, low cardiac output"], correct: 1, rationale: "Cardiogenic shock is characterized by elevated PCWP (backward failure with pulmonary congestion), elevated SVR (compensatory vasoconstriction), and low cardiac output (pump failure). This triad distinguishes it from hypovolemic (low PCWP) and septic (low SVR) shock." },
      { question: "Why should IV fluid boluses be avoided in most patients with cardiogenic shock?", options: ["Fluids dilute vasoactive medications", "The failing ventricle cannot handle additional volume, worsening pulmonary edema", "IV fluids cause bradycardia", "Fluid overload is not a concern in shock"], correct: 1, rationale: "In cardiogenic shock, the failing left ventricle cannot effectively eject the blood it receives. Adding more volume increases preload, raises PCWP further, and worsens pulmonary edema without improving cardiac output." }
    ]
  },

  "rpn-aortic-aneurysm": {
    title: "Abdominal Aortic Aneurysm (AAA)",
    cellular: {
      title: "Aortic Wall Degeneration and Rupture Risk",
      content: "An abdominal aortic aneurysm (AAA) is a pathological dilation of the abdominal aorta to ≥3 cm (normal diameter approximately 2 cm), most commonly occurring in the infrarenal segment between the renal arteries and the aortic bifurcation. The pathophysiology involves progressive degradation of the aortic wall's structural integrity. The normal aorta is composed of three layers: the tunica intima (endothelial lining), tunica media (smooth muscle and elastic lamellae providing tensile strength), and tunica adventitia (collagen-rich outer layer providing structural support). In AAA, chronic inflammation driven by atherosclerosis, oxidative stress, and biomechanical wall stress leads to infiltration of macrophages, lymphocytes, and neutrophils into the aortic wall. These inflammatory cells secrete matrix metalloproteinases (MMPs, particularly MMP-2 and MMP-9) and other proteases that degrade elastin and collagen — the two proteins responsible for aortic wall strength and elasticity. As elastin is destroyed, the aortic wall loses its ability to recoil, and as collagen degrades, it loses tensile strength. Smooth muscle cell apoptosis further weakens the media. According to Laplace's law (wall tension = pressure × radius / wall thickness), as the aneurysm dilates, the wall tension increases proportionally while the wall thickness decreases, creating a self-perpetuating cycle where enlargement begets further enlargement. The annual risk of rupture increases dramatically with diameter: <4 cm (~0%), 4-5 cm (~1%), 5-6 cm (~5-10%), 6-7 cm (~10-20%), >7 cm (~20-40%). Rupture causes catastrophic hemorrhage into the retroperitoneal space or peritoneal cavity, with mortality rates of 80-90% for ruptured AAA (and up to 50% even with emergency surgical repair). Clinical presentation depends on whether the AAA is intact (often asymptomatic, found incidentally) or ruptured (classic triad of sudden severe abdominal or back pain, hypotension, and pulsatile abdominal mass — though all three present in only 50% of cases)."
    },
    riskFactors: [
      "Male sex (6:1 male to female ratio)",
      "Age >65 years",
      "Smoking (strongest modifiable risk factor — present in >90% of AAA cases)",
      "Hypertension",
      "Family history of AAA (first-degree relative)",
      "Atherosclerosis/peripheral vascular disease",
      "Connective tissue disorders (Marfan syndrome, Ehlers-Danlos)",
      "COPD"
    ],
    diagnostics: [
      "Abdominal ultrasound (screening tool of choice — non-invasive, highly sensitive)",
      "CT angiography for preoperative planning and accurate sizing",
      "Abdominal palpation may reveal pulsatile mass (do NOT palpate repeatedly if suspected)",
      "Monitor serial ultrasounds for growth rate in small aneurysms",
      "Blood pressure monitoring and control"
    ],
    management: [
      "Surveillance: <5 cm, monitor with serial ultrasound every 6-12 months",
      "Surgical repair indicated at ≥5.5 cm or growth rate >0.5 cm in 6 months",
      "Endovascular aneurysm repair (EVAR) or open surgical repair as indicated",
      "Aggressive blood pressure control to reduce wall stress",
      "Smoking cessation (essential — smoking accelerates growth)",
      "Statin therapy for atherosclerosis management",
      "If ruptured: EMERGENT surgical repair, massive transfusion protocol, hemodynamic resuscitation"
    ],
    nursingActions: [
      "Monitor blood pressure closely — maintain prescribed target to reduce wall stress",
      "Assess for sudden onset severe abdominal or back pain (may indicate expansion or impending rupture)",
      "Do NOT palpate abdomen aggressively if AAA is known or suspected",
      "Post-operative: monitor peripheral pulses, urine output, and signs of graft complications",
      "Post-operative: assess for signs of retroperitoneal bleeding (flank ecchymosis, hypotension, decreasing Hgb)",
      "Educate on smoking cessation, BP control, and importance of follow-up ultrasounds",
      "Post-EVAR: monitor for endoleak (continued blood flow into aneurysm sac around the graft)"
    ],
    assessmentFindings: [
      "Often ASYMPTOMATIC until expansion or rupture",
      "Pulsatile abdominal mass (may be palpable on exam)",
      "Dull abdominal or low back pain (suggests expansion)",
      "Ruptured AAA: sudden severe tearing abdominal/back pain, hypotension, tachycardia, diaphoresis, altered LOC"
    ],
    signs: {
      left: ["Pulsatile abdominal mass", "Dull abdominal/back pain", "Often asymptomatic", "Bruit on auscultation"],
      right: ["RUPTURE: Severe tearing pain", "Hypotension/tachycardia", "Diaphoresis", "Altered consciousness/shock"]
    },
    medications: [
      { name: "Amlodipine", type: "Calcium Channel Blocker", action: "Blocks L-type calcium channels in vascular smooth muscle, causing vasodilation and reducing blood pressure and aortic wall stress", sideEffects: "Peripheral edema, dizziness, headache, flushing", contra: "Severe aortic stenosis, cardiogenic shock", pearl: "Smooth, sustained BP reduction without reflex tachycardia. Monitor for ankle edema." },
      { name: "Metoprolol", type: "Beta-1 Blocker", action: "Reduces heart rate and force of contraction, decreasing both blood pressure and the rate of aortic pressure change (dP/dt), reducing wall stress", sideEffects: "Bradycardia, fatigue, hypotension, bronchospasm", contra: "HR <60, severe asthma, decompensated HF", pearl: "Beta-blockers reduce aortic wall stress by lowering both BP and heart rate — first-line for AAA BP management." },
      { name: "Atorvastatin", type: "Statin", action: "Reduces LDL cholesterol and stabilizes atherosclerotic plaques; anti-inflammatory properties may slow aneurysm growth", sideEffects: "Myalgia, elevated liver enzymes", contra: "Active liver disease", pearl: "May slow AAA growth rate through anti-inflammatory and plaque-stabilizing effects beyond cholesterol reduction." }
    ],
    pearls: [
      "Most AAAs are ASYMPTOMATIC until rupture — screening saves lives (one-time ultrasound for men 65-75 who have ever smoked)",
      "NEVER palpate a known or suspected AAA vigorously — gentle palpation only",
      "Ruptured AAA triad: sudden severe pain + hypotension + pulsatile mass — but all three present in only ~50% of cases",
      "Smoking is the strongest modifiable risk factor — cessation is essential at every encounter",
      "Laplace's law explains why larger aneurysms grow faster and rupture more easily — wall tension increases with radius",
      "Post-EVAR, lifetime surveillance imaging is required to monitor for endoleaks"
    ],
    quiz: [
      { question: "Which client should the nurse prioritize for AAA screening based on current guidelines?", options: ["A 55-year-old female with diabetes", "A 68-year-old male with a 40 pack-year smoking history", "A 72-year-old female who never smoked", "A 45-year-old male with hypertension"], correct: 1, rationale: "Guidelines recommend one-time abdominal ultrasound screening for men aged 65-75 who have ever smoked. Smoking is the strongest risk factor for AAA, and male sex carries 6 times the risk compared to females." },
      { question: "A client with a known 4.8 cm AAA suddenly reports severe tearing back pain with diaphoresis. BP is 82/50 and HR is 118. What is the priority nursing action?", options: ["Position the client flat and elevate the legs", "Activate emergency response — this presentation suggests AAA rupture requiring emergent surgical intervention", "Administer oral antihypertensive to reduce aortic wall stress", "Recheck blood pressure in 15 minutes"], correct: 1, rationale: "Sudden severe pain with hemodynamic instability in a patient with known AAA strongly suggests rupture. This is a surgical emergency with >80% mortality without intervention. Immediate emergency activation, large-bore IV access, and preparation for emergent surgery are critical." }
    ]
  }
};
