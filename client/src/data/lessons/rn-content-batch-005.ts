import type { LessonContent } from "./types";

export const rnContentBatch005Lessons: Record<string, LessonContent> = {
  "myocardial-infarction-comprehensive-rn": {
    title: "Myocardial Infarction: Comprehensive RN Management",
    cellular: {
      title: "Coronary Occlusion and Myocardial Cell Death",
      content: "Myocardial infarction (MI) occurs when coronary artery blood flow is abruptly reduced or ceased, most often due to rupture of an atherosclerotic plaque with superimposed thrombus formation. The ischemic cascade begins within seconds: ATP depletion halts the Na+/K+-ATPase pump, causing intracellular sodium and water accumulation (cellular edema). Anaerobic glycolysis produces lactate, lowering intracellular pH and impairing enzyme function. Within 20-40 minutes of sustained ischemia, irreversible injury begins with mitochondrial swelling, membrane disruption, and release of intracellular contents including troponin, CK-MB, and myoglobin into the bloodstream. The wavefront phenomenon describes necrosis progressing from the subendocardium (most vulnerable due to highest oxygen demand and lowest perfusion pressure) outward toward the epicardium. ST-elevation MI (STEMI) indicates transmural ischemia with complete occlusion, while non-ST-elevation MI (NSTEMI) reflects partial occlusion with subendocardial injury. Reperfusion injury can paradoxically worsen damage through reactive oxygen species, calcium overload, and inflammatory cell infiltration."
    },
    riskFactors: [
      "Modifiable: hypertension, hyperlipidemia (elevated LDL >130 mg/dL), diabetes mellitus, smoking, obesity, sedentary lifestyle",
      "Non-modifiable: age (men >45, women >55), male sex, family history of premature CAD (first-degree relative before age 55 in men, 65 in women)",
      "Cocaine and methamphetamine use causing coronary vasospasm and demand ischemia",
      "Metabolic syndrome with insulin resistance and pro-inflammatory state",
      "Chronic kidney disease with accelerated atherosclerosis",
      "History of preeclampsia in women increasing lifetime cardiovascular risk"
    ],
    diagnostics: [
      "12-lead ECG within 10 minutes of arrival: ST elevation ≥1mm in two contiguous leads (STEMI), ST depression or T-wave inversion (NSTEMI/unstable angina)",
      "Serial troponin I or T levels: initial draw then at 3-6 hours; high-sensitivity troponin detects smaller infarctions earlier",
      "CK-MB rises 4-6 hours, peaks 12-24 hours, normalizes 48-72 hours (useful for detecting reinfarction)",
      "Echocardiography to evaluate regional wall motion abnormalities and ejection fraction",
      "Coronary angiography: gold standard for identifying culprit lesion and planning intervention",
      "BNP/NT-proBNP if heart failure suspected as MI complication"
    ],
    management: [
      "STEMI: activate cardiac catheterization lab for primary PCI within 90 minutes of first medical contact (door-to-balloon time)",
      "If PCI unavailable within 120 minutes: administer fibrinolytics (alteplase, tenecteplase) within 30 minutes (door-to-needle time)",
      "Dual antiplatelet therapy: aspirin 162-325mg chewed immediately plus P2Y12 inhibitor (clopidogrel, ticagrelor, or prasugrel)",
      "Anticoagulation: unfractionated heparin bolus and drip, or enoxaparin per protocol",
      "Beta-blocker within first 24 hours if no contraindications (carvedilol, metoprolol) to reduce myocardial oxygen demand",
      "ACE inhibitor or ARB within 24 hours for anterior MI, EF <40%, or heart failure symptoms",
      "High-intensity statin therapy (atorvastatin 80mg or rosuvastatin 20-40mg) regardless of baseline LDL"
    ],
    nursingActions: [
      "Obtain 12-lead ECG within 10 minutes of chest pain onset and with each recurrence",
      "Establish two large-bore IV lines (18-gauge or larger) for medication administration and potential volume resuscitation",
      "Administer supplemental oxygen only if SpO2 <94%; routine oxygen does not improve outcomes and may cause coronary vasoconstriction",
      "Administer morphine cautiously for refractory pain after nitroglycerin (avoid in NSTEMI per current guidelines due to possible increased mortality)",
      "Monitor continuous telemetry for reperfusion arrhythmias: accelerated idioventricular rhythm (AIVR) is a marker of successful reperfusion",
      "Assess vital signs every 15 minutes during acute phase; watch for cardiogenic shock signs (BP <90 systolic, tachycardia, altered mental status)",
      "Enforce bed rest during first 12-24 hours to reduce myocardial oxygen demand",
      "Document pain using 0-10 scale with PQRST characteristics before and after interventions"
    ],
    assessmentFindings: [
      "Chest pain: substernal pressure, squeezing, or tightness radiating to left arm, jaw, neck, or back; may be atypical in women, elderly, and diabetics (dyspnea, fatigue, nausea)",
      "Diaphoresis with cool, clammy skin from sympathetic nervous system activation",
      "Nausea and vomiting, especially with inferior MI (vagal response)",
      "Tachycardia as compensatory mechanism or bradycardia with inferior MI involving the right coronary artery",
      "S4 gallop from decreased ventricular compliance; S3 gallop if acute heart failure develops",
      "Crackles if left ventricular failure develops; JVD if right ventricular involvement"
    ],
    signs: {
      left: [
        "Substernal chest pressure radiating to left arm or jaw",
        "Diaphoresis with pallor and cool skin",
        "Nausea and vomiting (especially inferior MI)",
        "New S4 gallop indicating decreased compliance"
      ],
      right: [
        "Hypotension with JVD in right ventricular MI",
        "Cardiogenic shock: BP <90, altered LOC, oliguria",
        "New systolic murmur suggesting papillary muscle rupture or VSD",
        "Pericardial friction rub 2-3 days post-MI (Dressler syndrome)"
      ]
    },
    medications: [
      { name: "Aspirin", type: "Antiplatelet", action: "Irreversibly inhibits cyclooxygenase-1 (COX-1) in platelets, blocking thromboxane A2 synthesis and reducing platelet aggregation at the site of plaque rupture", sideEffects: "GI bleeding, tinnitus at high doses, bronchospasm in aspirin-sensitive asthma", contra: "Active GI hemorrhage, true aspirin allergy (not GI intolerance), severe bleeding disorder", pearl: "Give 162-325mg chewed (not swallowed whole) for rapid buccal absorption. Non-enteric-coated preferred in acute setting. Aspirin reduces MI mortality by 23% when given within 24 hours." },
      { name: "Nitroglycerin", type: "Vasodilator", action: "Releases nitric oxide causing venous dilation (reduces preload) and coronary artery dilation, decreasing myocardial oxygen demand and improving coronary blood flow", sideEffects: "Hypotension, headache (most common), reflex tachycardia, syncope", contra: "Systolic BP <90 mmHg, recent PDE-5 inhibitor use (sildenafil within 24 hours, tadalafil within 48 hours), right ventricular infarction, severe aortic stenosis", pearl: "SL tabs: 0.4mg every 5 minutes x3 max. If pain unrelieved after first dose, call 911. IV drip titrated to chest pain and BP. Right ventricular MI patients are preload-dependent—NTG can cause profound hypotension." },
      { name: "Heparin (Unfractionated)", type: "Anticoagulant", action: "Binds antithrombin III, accelerating inactivation of thrombin (factor IIa) and factor Xa by 1000-fold, preventing clot propagation at the site of coronary occlusion", sideEffects: "Bleeding, heparin-induced thrombocytopenia (HIT), osteoporosis with prolonged use", contra: "Active uncontrolled bleeding, HIT history, severe thrombocytopenia", pearl: "Monitor aPTT every 6 hours and adjust per weight-based protocol (therapeutic range 60-80 seconds). Antidote is protamine sulfate (1mg per 100 units heparin). Check platelets at baseline and every 2-3 days for HIT." }
    ],
    pearls: [
      "Time is muscle: every 30-minute delay in reperfusion increases mortality; door-to-balloon <90 minutes, door-to-needle <30 minutes",
      "Right ventricular MI (inferior STEMI with ST elevation in V4R) is preload-dependent—avoid nitrates and diuretics; give IV fluids to maintain preload",
      "Reperfusion arrhythmias (especially AIVR) are generally benign and indicate successful reperfusion—do not treat unless hemodynamically unstable",
      "Women, elderly, and diabetics often present with atypical symptoms: dyspnea, fatigue, nausea, jaw or back pain without classic chest pressure",
      "Post-MI complications timeline: arrhythmias (0-48 hours), heart failure (24-72 hours), pericarditis (2-3 days), ventricular aneurysm (weeks), Dressler syndrome (2-10 weeks)"
    ],
    quiz: [
      { question: "A 58-year-old male presents with crushing substernal chest pain radiating to his left arm for 45 minutes. ECG shows 3mm ST elevation in leads V1-V4. What is the priority intervention?", options: ["Administer sublingual nitroglycerin x3", "Activate the cardiac catheterization lab for primary PCI", "Obtain serial troponin levels every 6 hours", "Administer IV morphine 4mg for pain control"], correct: 1, rationale: "ST elevation in V1-V4 indicates anterior STEMI requiring emergent reperfusion. Primary PCI within 90 minutes of first medical contact is the gold standard. While NTG and pain management are part of care, they should not delay reperfusion therapy." },
      { question: "A nurse caring for a post-MI patient notices an accelerated idioventricular rhythm (AIVR) at 75 bpm on telemetry shortly after PCI. The patient is hemodynamically stable. What is the appropriate nursing action?", options: ["Prepare for immediate cardioversion", "Administer amiodarone 150mg IV", "Continue monitoring; AIVR is a reperfusion arrhythmia", "Administer atropine 0.5mg IV"], correct: 2, rationale: "AIVR is a common, benign reperfusion arrhythmia that indicates successful restoration of coronary blood flow. It typically resolves spontaneously and does not require treatment in hemodynamically stable patients." },
      { question: "A patient with an inferior STEMI has ST elevation in leads II, III, aVF and V4R. BP is 82/50 and the patient has JVD. Which intervention should the nurse avoid?", options: ["IV normal saline bolus", "Dobutamine infusion", "Sublingual nitroglycerin", "Right-sided ECG leads"], correct: 2, rationale: "ST elevation in V4R indicates right ventricular involvement. RV infarction patients are preload-dependent. Nitroglycerin causes venodilation, reducing preload and potentially causing severe hypotension. IV fluids are the appropriate intervention to maintain preload." },
      { question: "A patient prescribed aspirin 325mg for acute STEMI states she is allergic to aspirin. The nurse should first:", options: ["Administer the aspirin with diphenhydramine", "Clarify the nature of the allergy reaction", "Substitute clopidogrel for aspirin", "Hold the aspirin and document the allergy"], correct: 1, rationale: "The nurse must first clarify the nature of the allergy. GI upset is not a true allergy. If the reaction was anaphylaxis or angioedema, aspirin is contraindicated and clopidogrel should be substituted. Many reported 'allergies' are actually intolerances that do not preclude use in a life-threatening situation." },
      { question: "Which troponin result pattern confirms acute myocardial infarction?", options: ["Single elevated troponin with no repeat measurement", "Rising troponin with at least one value above the 99th percentile upper reference limit", "Normal troponin at presentation and 6 hours later", "Chronically elevated troponin without change"], correct: 1, rationale: "Acute MI diagnosis requires a rise and/or fall of troponin with at least one value above the 99th percentile URL, plus clinical evidence of ischemia. A single elevated value could be chronic (renal failure). Stable elevated levels suggest chronic myocardial injury rather than acute MI." }
    ]
  },

  "heart-failure-systolic-diastolic-rn": {
    title: "Heart Failure: HFrEF vs HFpEF Comprehensive Management",
    cellular: {
      title: "Pathophysiology of Systolic vs Diastolic Heart Failure",
      content: "Heart failure (HF) is classified by ejection fraction (EF) into heart failure with reduced ejection fraction (HFrEF, EF ≤40%, systolic failure) and heart failure with preserved ejection fraction (HFpEF, EF ≥50%, diastolic failure). In HFrEF, myocyte loss (post-MI necrosis, viral myocarditis, alcohol toxicity) reduces contractile mass. The remaining myocytes undergo eccentric hypertrophy (sarcomeres added in series), causing ventricular dilation. Reduced stroke volume activates the renin-angiotensin-aldosterone system (RAAS), increasing sodium/water retention, and the sympathetic nervous system (SNS), increasing heart rate and contractility—initially compensatory but eventually maladaptive. Chronic neurohormonal activation causes progressive fibrosis, further dilation, and worsening function. In HFpEF, the ventricle maintains contractile force but develops concentric hypertrophy (sarcomeres added in parallel) from chronic pressure overload (hypertension, aortic stenosis). The thickened, stiff ventricle has impaired relaxation and reduced compliance, requiring elevated filling pressures. Diastolic dysfunction causes pulmonary congestion despite normal EF. Natriuretic peptides (BNP, ANP) are released by myocardial stretch, promoting vasodilation and natriuresis as a counter-regulatory mechanism."
    },
    riskFactors: [
      "Coronary artery disease and prior myocardial infarction (leading cause of HFrEF)",
      "Chronic uncontrolled hypertension (leading cause of HFpEF)",
      "Diabetes mellitus with diabetic cardiomyopathy",
      "Valvular heart disease (aortic stenosis, mitral regurgitation)",
      "Alcohol-induced cardiomyopathy (chronic heavy use >90g/day)",
      "Viral myocarditis (Coxsackievirus B, adenovirus, parvovirus B19)",
      "Chemotherapy-induced cardiomyopathy (doxorubicin, trastuzumab)",
      "Peripartum cardiomyopathy in the last month of pregnancy or within 5 months postpartum"
    ],
    diagnostics: [
      "BNP >100 pg/mL or NT-proBNP >300 pg/mL supports HF diagnosis; levels correlate with severity and guide treatment",
      "Echocardiography: EF <40% confirms HFrEF; EF ≥50% with diastolic filling abnormalities confirms HFpEF",
      "Chest X-ray: cardiomegaly, cephalization of pulmonary vessels, Kerley B lines, pleural effusions",
      "12-lead ECG for underlying rhythm, ischemic changes, bundle branch block, LVH",
      "Basic metabolic panel: electrolytes (K+, Na+, Mg2+), renal function (BUN/creatinine for cardiorenal syndrome)",
      "Iron studies and CBC to evaluate for anemia as an exacerbating factor"
    ],
    management: [
      "HFrEF guideline-directed medical therapy (GDMT): ACE inhibitor/ARB/ARNI + beta-blocker + aldosterone antagonist + SGLT2 inhibitor (four-pillar therapy)",
      "Sacubitril/valsartan (Entresto) replaces ACE inhibitor when patient is stable; requires 36-hour washout from ACEi to prevent angioedema",
      "Loop diuretics (furosemide, bumetanide) for volume overload; titrate to euvolemia based on daily weights and symptoms",
      "Cardiac resynchronization therapy (CRT) for EF ≤35% with LBBB and QRS ≥150ms",
      "ICD implantation for EF ≤35% after optimal medical therapy for primary prevention of sudden cardiac death",
      "HFpEF: manage underlying conditions (BP control, rate control in AFib), diuretics for congestion, SGLT2 inhibitors (empagliflozin/dapagliflozin)"
    ],
    nursingActions: [
      "Obtain daily weights at the same time, same scale, same clothing; report gain >2 lbs/day or >5 lbs/week",
      "Monitor strict intake and output; typical fluid restriction 1.5-2 L/day in decompensated HF",
      "Assess lung sounds every shift for crackles indicating pulmonary congestion",
      "Monitor electrolytes closely: K+ and Mg2+ with diuretics, K+ with ACEi/ARB/aldosterone antagonists",
      "Evaluate BNP trends to assess treatment response (declining levels indicate improvement)",
      "Educate on sodium restriction (<2g/day), medication adherence, and daily weight monitoring",
      "Assess for signs of low cardiac output: fatigue, decreased urine output, cool extremities, altered mentation",
      "Apply compression stockings and elevate legs to reduce peripheral edema"
    ],
    assessmentFindings: [
      "Left-sided failure: dyspnea on exertion, orthopnea, paroxysmal nocturnal dyspnea, crackles, S3 gallop, tachycardia",
      "Right-sided failure: peripheral edema, hepatomegaly, ascites, JVD, weight gain from fluid retention",
      "NYHA Class I: no limitation of physical activity",
      "NYHA Class II: slight limitation; comfortable at rest, symptomatic with ordinary activity",
      "NYHA Class III: marked limitation; comfortable at rest, symptomatic with less than ordinary activity",
      "NYHA Class IV: symptoms at rest; unable to carry out any physical activity without discomfort"
    ],
    signs: {
      left: [
        "Dyspnea on exertion progressing to orthopnea",
        "Paroxysmal nocturnal dyspnea (PND)",
        "Bibasilar crackles on lung auscultation",
        "S3 gallop indicating volume overload"
      ],
      right: [
        "Peripheral edema (pitting, dependent)",
        "Jugular venous distension (JVD)",
        "Hepatomegaly with hepatojugular reflux",
        "Ascites and weight gain from fluid retention"
      ]
    },
    medications: [
      { name: "Sacubitril/Valsartan (Entresto)", type: "ARNI (Angiotensin Receptor-Neprilysin Inhibitor)", action: "Sacubitril inhibits neprilysin, preventing breakdown of BNP and ANP, enhancing vasodilation and natriuresis. Valsartan blocks AT1 receptors, reducing vasoconstriction, aldosterone release, and cardiac remodeling. Reduces mortality 20% vs ACEi alone in HFrEF", sideEffects: "Hypotension (most common), hyperkalemia, renal impairment, angioedema (rare)", contra: "History of angioedema with ACEi, concurrent ACEi use (36-hour washout required), pregnancy, severe hepatic impairment", pearl: "Must discontinue ACE inhibitor for 36 hours before starting to prevent life-threatening angioedema. Monitor BP closely when initiating. Start at lowest dose and titrate every 2-4 weeks. Superior to ACEi/ARB alone for mortality reduction in HFrEF." },
      { name: "Carvedilol", type: "Non-selective Beta-blocker with Alpha-1 Blocking Activity", action: "Blocks beta-1 (reduces heart rate, contractility, and renin release), beta-2 (prevents bronchospasm but causes peripheral vasoconstriction), and alpha-1 (reduces afterload) receptors. Reduces mortality 65% in severe HF. Reverses maladaptive cardiac remodeling over months", sideEffects: "Bradycardia, hypotension, fatigue, weight gain, bronchospasm, hyperglycemia masking", contra: "Acute decompensated HF requiring inotropic support, cardiogenic shock, severe bradycardia, second/third-degree heart block without pacemaker, severe reactive airway disease", pearl: "Start low (3.125mg BID) and titrate slowly every 2 weeks. Initial worsening of symptoms may occur but long-term benefits are profound. Must be on stable GDMT before initiation. Take with food to reduce orthostatic hypotension." },
      { name: "Furosemide", type: "Loop Diuretic", action: "Inhibits Na+/K+/2Cl- cotransporter in the thick ascending limb of the loop of Henle, causing rapid and potent diuresis. Reduces preload and pulmonary congestion within minutes when given IV", sideEffects: "Hypokalemia, hypomagnesemia, hyponatremia, dehydration, ototoxicity, hyperuricemia", contra: "Anuria, hepatic coma, severe electrolyte depletion, hypersensitivity to sulfonamides (cross-reactivity rare)", pearl: "IV onset 5 minutes vs PO 30-60 minutes. Doses above 80mg IV should be given as infusion to reduce ototoxicity. Monitor K+ and replace aggressively (target K+ 4.0-5.0 mEq/L in HF). Diuretic resistance may require adding thiazide diuretic (metolazone) 30 minutes before furosemide." }
    ],
    pearls: [
      "S3 gallop = volume overload = HFrEF; S4 gallop = stiff ventricle = HFpEF/hypertensive heart disease",
      "Weight is the most sensitive indicator of fluid status in HF—more reliable than I&O tracking",
      "Beta-blockers may temporarily worsen symptoms when initiated in HF but dramatically improve long-term survival—start low, go slow",
      "Never start sacubitril/valsartan without a 36-hour washout from ACE inhibitor—angioedema risk is life-threatening",
      "Common decompensation triggers: dietary sodium indiscretion, medication non-adherence, infection, arrhythmia (especially new AFib), renal deterioration"
    ],
    quiz: [
      { question: "A patient with HFrEF (EF 25%) is on lisinopril, carvedilol, and furosemide. The provider wants to switch to sacubitril/valsartan. When should the nurse administer the first dose of sacubitril/valsartan?", options: ["Immediately after the last dose of lisinopril", "24 hours after the last dose of lisinopril", "At least 36 hours after the last dose of lisinopril", "7 days after the last dose of lisinopril"], correct: 2, rationale: "A 36-hour washout period is required between the last ACEi dose and the first ARNI dose to prevent angioedema. Dual inhibition of the renin-angiotensin system and neprilysin increases bradykinin levels, which can cause life-threatening angioedema." },
      { question: "A nurse is assessing a patient with heart failure. Which finding differentiates left-sided from right-sided failure?", options: ["Peripheral edema and JVD indicate left-sided failure", "Crackles and paroxysmal nocturnal dyspnea indicate left-sided failure", "Hepatomegaly indicates left-sided failure", "Ascites indicates left-sided failure"], correct: 1, rationale: "Left-sided heart failure causes pulmonary congestion leading to crackles, dyspnea on exertion, orthopnea, and PND. Right-sided failure causes systemic venous congestion leading to JVD, peripheral edema, hepatomegaly, and ascites." },
      { question: "A patient with HF reports a weight gain of 4 pounds overnight. Which action should the nurse take first?", options: ["Restrict the patient's sodium to 1g/day", "Assess lung sounds and check for edema", "Administer an extra dose of furosemide per protocol", "Notify the healthcare provider immediately"], correct: 1, rationale: "A 4-pound weight gain overnight suggests significant fluid retention. The nurse should first assess for signs of decompensation (crackles, edema, JVD, dyspnea) to provide a comprehensive report before contacting the provider. Assessment always precedes intervention." },
      { question: "Which BNP level most strongly suggests decompensated heart failure in a patient presenting with dyspnea?", options: ["BNP 45 pg/mL", "BNP 98 pg/mL", "BNP 850 pg/mL", "BNP 105 pg/mL"], correct: 2, rationale: "BNP >100 pg/mL supports HF diagnosis, but BNP 850 pg/mL strongly suggests decompensated HF. Higher BNP correlates with greater severity and worse prognosis. BNP <100 makes HF unlikely as the cause of dyspnea." },
      { question: "A patient with chronic HF is started on carvedilol 3.125mg twice daily. After 3 days, the patient reports increased fatigue and mild worsening of dyspnea. What should the nurse advise?", options: ["Stop the medication immediately and call the provider", "This initial worsening is expected; continue the medication and report severe symptoms", "Double the dose to achieve therapeutic effect faster", "Switch to a different beta-blocker class"], correct: 1, rationale: "Mild initial worsening of symptoms is expected when starting beta-blockers in HF due to the negative inotropic effect. Long-term benefits far outweigh short-term discomfort. The medication should be continued unless severe decompensation occurs. Start low and titrate slowly every 2 weeks." }
    ]
  },

  "abdominal-aortic-aneurysm-rn": {
    title: "Abdominal Aortic Aneurysm: RN Assessment and Emergency Management",
    cellular: {
      title: "Arterial Wall Degeneration and Aneurysm Formation",
      content: "An abdominal aortic aneurysm (AAA) is a pathological dilation of the aorta to ≥3.0 cm (normal infrarenal diameter 1.5-2.5 cm) resulting from degeneration of the elastic media layer. The pathophysiology involves a complex interplay of atherosclerosis, chronic inflammation, and matrix metalloproteinase (MMP) overactivity. Atherosclerotic plaques cause intimal injury and chronic transmural inflammation with macrophage and T-lymphocyte infiltration. These inflammatory cells release MMP-2 and MMP-9, which degrade elastin and collagen in the media, weakening the arterial wall. Simultaneously, vascular smooth muscle cells undergo apoptosis, reducing the wall's ability to repair and maintain structural integrity. The aortic wall progressively thins and dilates according to Laplace's law: wall tension = (pressure × radius) / (2 × wall thickness). As the radius increases, wall tension rises disproportionately, creating a positive feedback loop that accelerates expansion. Rupture occurs when wall stress exceeds tensile strength, typically at the posterolateral wall where the aorta is unsupported."
    },
    riskFactors: [
      "Male sex (6:1 male-to-female ratio for AAA >4cm)",
      "Age >65 years with progressive arterial degeneration",
      "Current or former smoking (strongest modifiable risk factor; 5-fold increased risk)",
      "Family history of AAA in first-degree relative (genetic component in MMP expression)",
      "Hypertension increasing wall stress via elevated intraluminal pressure",
      "Atherosclerotic disease (peripheral arterial disease, coronary artery disease)",
      "Connective tissue disorders: Marfan syndrome, Ehlers-Danlos type IV (vascular type)"
    ],
    diagnostics: [
      "Abdominal ultrasound: screening tool of choice; USPSTF recommends one-time screening for men aged 65-75 who have ever smoked",
      "CT angiography with contrast: gold standard for surgical planning; defines exact size, location, relationship to renal arteries, and presence of thrombus",
      "Serial monitoring based on size: <4cm annually, 4-5.4cm every 6-12 months, ≥5.5cm consider surgical repair",
      "Complete blood count, coagulation studies, type and crossmatch in preparation for potential rupture or repair",
      "Renal function assessment before contrast studies and to evaluate suprarenal extension"
    ],
    management: [
      "Asymptomatic AAA <5.5cm: surveillance with aggressive risk factor modification (smoking cessation, BP <130/80, statin therapy)",
      "Surgical repair indicated: symptomatic AAA of any size, diameter ≥5.5cm, growth rate >0.5cm/6 months",
      "Endovascular aneurysm repair (EVAR): minimally invasive stent graft placement via femoral arteries; shorter recovery, lower perioperative mortality",
      "Open surgical repair: laparotomy with synthetic graft placement; indicated when anatomy is unsuitable for EVAR",
      "Ruptured AAA: emergency surgical intervention is the only definitive treatment; permissive hypotension (SBP 70-80) until aortic clamping to avoid clot disruption"
    ],
    nursingActions: [
      "Assess for pulsatile abdominal mass (palpate gently; do not press deeply on known aneurysm)",
      "Monitor bilateral lower extremity pulses, temperature, color, and sensation (baseline and post-procedure)",
      "Assess for signs of rupture: sudden severe abdominal or back pain, hypotension, tachycardia, diaphoresis, Grey Turner sign (flank ecchymosis), Cullen sign (periumbilical ecchymosis)",
      "Post-EVAR: monitor femoral access site for hematoma or pseudoaneurysm; assess pedal pulses every 15 minutes x4, then every 30 minutes x4",
      "Post-open repair: monitor for graft occlusion (cold pulseless extremities), renal failure (urine output <30mL/hr), bowel ischemia (abdominal distension, bloody stools), and spinal cord ischemia (lower extremity weakness)",
      "Administer antihypertensives as prescribed to maintain SBP <130 mmHg to reduce wall stress",
      "Strict hemodynamic monitoring in suspected rupture; prepare for massive transfusion protocol"
    ],
    assessmentFindings: [
      "Most AAAs are asymptomatic and found incidentally on imaging",
      "Pulsatile, non-tender abdominal mass on palpation (may be obscured by obesity)",
      "Abdominal bruit on auscultation",
      "Symptomatic/expanding: dull, steady abdominal or back pain",
      "Ruptured: classic triad of sudden severe abdominal/back pain, hypotension, and pulsatile abdominal mass (present in only 50% of cases)",
      "Hemodynamic instability with signs of hypovolemic shock if ruptured"
    ],
    signs: {
      left: [
        "Pulsatile abdominal mass on palpation",
        "Abdominal bruit on auscultation",
        "Dull steady abdominal or lower back pain",
        "Lower extremity pulse asymmetry from thrombus embolization"
      ],
      right: [
        "Sudden severe tearing abdominal/back pain (rupture)",
        "Hypotension, tachycardia, diaphoresis (hemorrhagic shock)",
        "Grey Turner sign: flank ecchymosis (retroperitoneal bleed)",
        "Cullen sign: periumbilical ecchymosis"
      ]
    },
    medications: [
      { name: "Esmolol", type: "Ultra-short-acting Beta-1 Selective Blocker", action: "Selectively blocks cardiac beta-1 receptors, reducing heart rate and blood pressure. Decreases aortic wall shear stress by reducing the rate of rise of aortic pressure (dP/dt). Used acutely in symptomatic or rapidly expanding AAA to prevent rupture", sideEffects: "Hypotension, bradycardia, bronchospasm (rare at selective doses), injection site irritation", contra: "Severe bradycardia, second/third-degree heart block, cardiogenic shock, decompensated HF", pearl: "Half-life of 9 minutes makes it ideal for acute titration. Target HR <60 bpm and SBP <120 mmHg. Can be rapidly discontinued if adverse effects occur. Used while preparing for surgical intervention." },
      { name: "Labetalol", type: "Combined Alpha-1 and Non-selective Beta Blocker", action: "Dual alpha and beta blockade reduces both heart rate and peripheral vascular resistance. Provides smoother BP reduction than pure vasodilators without reflex tachycardia, reducing aortic wall stress", sideEffects: "Orthostatic hypotension, scalp tingling, hepatotoxicity (rare), bronchospasm", contra: "Cardiogenic shock, severe bradycardia, greater than first-degree heart block, severe bronchospastic disease", pearl: "IV bolus 20mg over 2 minutes, may repeat with escalating doses. Preferred in aortic emergencies because it does not cause reflex tachycardia. Always reduce heart rate before adding vasodilators to prevent reflex tachycardia." }
    ],
    pearls: [
      "Ruptured AAA has 80-90% overall mortality and 50% operative mortality—early recognition is critical for survival",
      "Never deeply palpate a known or suspected AAA—gentle palpation only to avoid precipitating rupture",
      "The classic triad of ruptured AAA (pain + hypotension + pulsatile mass) is present in only 50% of cases; maintain high index of suspicion",
      "Post-operative lower extremity weakness after AAA repair may indicate spinal cord ischemia from interruption of the artery of Adamkiewicz—report immediately",
      "Screening saves lives: one-time ultrasound screening reduces AAA-related mortality by 50% in men 65-75 who have ever smoked"
    ],
    quiz: [
      { question: "A 72-year-old male smoker presents with sudden severe tearing back pain. Assessment reveals a pulsatile abdominal mass, BP 78/42, HR 132. What is the nurse's priority action?", options: ["Administer IV morphine for pain control", "Obtain a CT scan to confirm rupture", "Establish two large-bore IV lines and prepare for emergency surgery", "Place the patient in Trendelenburg position"], correct: 2, rationale: "These findings indicate a ruptured AAA—a surgical emergency with extremely high mortality. The priority is establishing IV access for volume resuscitation and preparing for immediate surgical intervention. CT imaging delays treatment in hemodynamically unstable patients." },
      { question: "A nurse is caring for a patient 4 hours post-EVAR. The patient's right pedal pulse, previously 2+, is now absent. The right foot is cool and pale. What should the nurse do?", options: ["Document the finding and recheck in 1 hour", "Apply warm blankets to the right foot", "Notify the surgeon immediately", "Elevate the right leg above heart level"], correct: 2, rationale: "Loss of a previously palpable pedal pulse after EVAR indicates possible graft occlusion, distal embolization, or femoral artery thrombosis at the access site. This is a vascular emergency requiring immediate surgical evaluation. Delay can result in limb loss." },
      { question: "A patient with a known 4.8cm AAA asks when surgery will be needed. The nurse's best response is:", options: ["Surgery is needed immediately for any aneurysm over 4cm", "Monitoring continues with imaging every 6-12 months; surgery is usually recommended when it reaches 5.5cm or grows rapidly", "You will never need surgery with an aneurysm this small", "Surgery is only done if the aneurysm ruptures"], correct: 1, rationale: "Current guidelines recommend elective repair when AAA reaches 5.5cm in men (5.0cm in women) or grows >0.5cm in 6 months. An aneurysm of 4.8cm requires close surveillance. Waiting for rupture has an 80-90% mortality rate." },
      { question: "Which screening recommendation should the nurse communicate regarding AAA?", options: ["All adults over 50 should be screened annually", "One-time ultrasound screening for men aged 65-75 who have ever smoked", "CT angiography screening for all patients with hypertension", "No screening is recommended; AAA is always found incidentally"], correct: 1, rationale: "The USPSTF recommends a one-time abdominal ultrasound screening for men aged 65-75 who have ever smoked. This targeted screening has been shown to reduce AAA-related mortality by approximately 50%." }
    ]
  },

  "kawasaki-disease-rn": {
    title: "Kawasaki Disease: RN Pediatric Assessment and Management",
    cellular: {
      title: "Systemic Vasculitis and Coronary Artery Involvement",
      content: "Kawasaki disease (KD) is an acute, self-limited systemic vasculitis of unknown etiology that predominantly affects children under 5 years. The pathogenesis involves an aberrant immune response, likely triggered by an infectious agent in genetically susceptible individuals. The inflammatory cascade begins with activation of the innate immune system, with neutrophils and macrophages infiltrating medium-sized arterial walls. This is followed by an adaptive immune response with T cells and IgA-producing plasma cells. The inflammation targets the vasa vasorum (tiny blood vessels supplying the arterial wall), causing necrotizing arteritis that destroys the internal elastic lamina and media of coronary arteries. This destruction leads to coronary artery aneurysm formation in 25% of untreated children. Aneurysm formation creates areas of blood stasis, promoting thrombus formation that can cause MI or sudden cardiac death. Myocarditis with inflammatory infiltration of the myocardium occurs in the acute phase, contributing to cardiac dysfunction. The inflammatory markers (ESR, CRP, WBC) are markedly elevated, and thrombocytosis typically appears in the subacute phase (days 10-25), further increasing thrombotic risk."
    },
    riskFactors: [
      "Age <5 years (80% of cases; peak incidence 18-24 months)",
      "Male sex (1.5:1 male-to-female ratio)",
      "Asian/Pacific Islander descent (highest incidence: 240/100,000 in Japan)",
      "Winter and spring seasonality suggesting infectious trigger",
      "Siblings of affected children (10-fold increased risk)",
      "Age <1 year or >5 years associated with higher risk of coronary complications (atypical presentations, delayed diagnosis)"
    ],
    diagnostics: [
      "Clinical diagnosis based on fever ≥5 days PLUS ≥4 of 5 principal features (CRASH: Conjunctivitis, Rash, Adenopathy, Strawberry tongue, Hand/foot changes)",
      "Bilateral non-exudative conjunctival injection (limbal-sparing)",
      "Polymorphous exanthem (maculopapular, erythema multiforme-like, or scarlatiniform; never vesicular)",
      "Cervical lymphadenopathy ≥1.5cm (usually unilateral)",
      "Oral mucosal changes: strawberry tongue, cracked fissured lips, pharyngeal erythema",
      "Extremity changes: erythema and edema of palms/soles (acute), periungual desquamation (subacute)",
      "Echocardiography at diagnosis, 2 weeks, and 6-8 weeks: evaluates for coronary artery aneurysms (Z-score system)",
      "Lab findings: elevated ESR, CRP, WBC with left shift; sterile pyuria; elevated transaminases; thrombocytosis (subacute phase)"
    ],
    management: [
      "IVIG 2g/kg single infusion over 10-12 hours within the first 10 days of illness (reduces coronary aneurysm risk from 25% to <5%)",
      "High-dose aspirin 80-100mg/kg/day divided q6h during febrile phase (anti-inflammatory dose); reduce to 3-5mg/kg/day after afebrile for 48-72 hours (antiplatelet dose)",
      "Low-dose aspirin continued for 6-8 weeks if no coronary abnormalities; indefinitely if coronary aneurysms present",
      "IVIG-resistant KD (persistent/recurrent fever >36 hours after IVIG): second IVIG dose, IV methylprednisolone, or infliximab",
      "Follow-up echocardiography: repeat at 2 weeks and 6-8 weeks; if abnormal, serial imaging and cardiology follow-up",
      "Coronary aneurysm management: anticoagulation (warfarin + aspirin) for giant aneurysms (>8mm or Z-score >10)"
    ],
    nursingActions: [
      "Monitor temperature continuously; fever duration is a key marker for IVIG response",
      "Perform thorough skin assessment documenting rash distribution, extremity changes, and peeling",
      "Monitor I&O strictly; IVIG infusion can cause fluid overload in children with myocarditis",
      "During IVIG infusion: start slowly (0.5mL/kg/hr), monitor for infusion reactions (fever, chills, hypotension, rash) every 15 minutes x1 hour, then hourly",
      "Assess cardiac status: heart rate, rhythm, murmur, respiratory effort, peripheral perfusion",
      "Handle irritable child gently; extreme irritability is a hallmark of KD that distinguishes it from other febrile illnesses",
      "Monitor for signs of coronary artery involvement: chest pain, tachycardia out of proportion to fever, signs of heart failure",
      "Educate parents on aspirin therapy duration and avoiding live vaccines for 11 months after IVIG (impaired immune response)"
    ],
    assessmentFindings: [
      "Fever ≥5 days, often >39.5°C (103°F), unresponsive to antipyretics",
      "Bilateral conjunctival injection without exudate (limbal-sparing pattern differentiates from bacterial conjunctivitis)",
      "Strawberry tongue with bright red, swollen, cracked lips",
      "Polymorphous rash (not vesicular) often accentuated in the perineal area",
      "Erythema and indurative edema of hands and feet progressing to periungual desquamation in subacute phase",
      "Marked irritability disproportionate to clinical findings (hallmark behavioral feature)"
    ],
    signs: {
      left: [
        "High fever ≥5 days unresponsive to antipyretics",
        "Bilateral conjunctival injection (limbal-sparing)",
        "Strawberry tongue with cracked red lips",
        "Polymorphous rash (accentuated in perineum)"
      ],
      right: [
        "Unilateral cervical lymphadenopathy ≥1.5cm",
        "Erythema/edema of palms and soles",
        "Periungual desquamation in subacute phase",
        "Marked irritability disproportionate to illness"
      ]
    },
    medications: [
      { name: "Intravenous Immunoglobulin (IVIG)", type: "Immunomodulator", action: "Exact mechanism unknown; likely modulates immune response through Fc receptor blockade, anti-idiotypic antibody activity, and cytokine modulation. Reduces coronary artery aneurysm risk from 25% to <5% when given within first 10 days of illness", sideEffects: "Infusion reactions (fever, chills, hypotension, nausea), headache, aseptic meningitis, hemolytic anemia (blood type mismatch), fluid overload", contra: "Selective IgA deficiency (risk of anaphylaxis from anti-IgA antibodies), volume overload with decompensated heart failure", pearl: "2g/kg single infusion over 10-12 hours. Pre-treat with acetaminophen and diphenhydramine. Live vaccines (MMR, varicella) must be delayed 11 months post-IVIG as passive antibodies impair vaccine immunogenicity. Monitor for hemolysis in non-O blood types." },
      { name: "Aspirin (High-dose then Low-dose)", type: "Anti-inflammatory / Antiplatelet", action: "High-dose (80-100mg/kg/day) provides anti-inflammatory effect through COX inhibition and reduced prostaglandin synthesis during the febrile phase. Low-dose (3-5mg/kg/day) provides antiplatelet effect by irreversibly inhibiting COX-1 in platelets, reducing thromboxane A2 and thrombotic risk", sideEffects: "GI irritation, tinnitus (salicylism), Reye syndrome risk if concurrent viral illness (varicella, influenza), bleeding", contra: "Active bleeding, viral infection with risk of Reye syndrome (influenza, varicella), aspirin allergy", pearl: "This is ONE of the rare situations where aspirin is used in children. If the child develops varicella or influenza during aspirin therapy, switch to clopidogrel or dipyridamole temporarily. Monitor salicylate levels if concern for toxicity. Transition from high-dose to low-dose when afebrile for 48-72 hours." }
    ],
    pearls: [
      "CRASH mnemonic for Kawasaki diagnostic criteria: Conjunctivitis (bilateral non-exudative), Rash (polymorphous), Adenopathy (cervical ≥1.5cm, usually unilateral), Strawberry tongue/lip changes, Hand/foot changes",
      "IVIG within 10 days of fever onset reduces coronary aneurysm risk from 25% to <5%—timing is critical",
      "Kawasaki disease is the leading cause of acquired heart disease in children in developed countries",
      "Incomplete Kawasaki (fewer than 4 criteria but with fever ≥5 days and laboratory/echocardiographic findings) must still be treated—it carries the same coronary risk",
      "Live vaccines must be delayed 11 months after IVIG administration—ensure parents understand this at discharge"
    ],
    quiz: [
      { question: "A 3-year-old has had a fever of 104°F for 6 days. Assessment reveals bilateral conjunctival injection without exudate, a polymorphous rash, swollen red hands and feet, and a strawberry tongue. Which diagnosis should the nurse suspect?", options: ["Scarlet fever", "Kawasaki disease", "Measles", "Stevens-Johnson syndrome"], correct: 1, rationale: "This child meets the clinical criteria for Kawasaki disease: fever ≥5 days plus 4 of 5 principal features (conjunctivitis, rash, extremity changes, oral changes). Scarlet fever has exudative pharyngitis. Measles has cough/coryza/conjunctivitis plus Koplik spots. SJS has target lesions and mucosal erosions." },
      { question: "A child with Kawasaki disease is receiving IVIG. The nurse should report which finding?", options: ["Temperature of 37.8°C during infusion", "Urine output of 2mL/kg/hr", "Sudden drop in blood pressure with hives and difficulty breathing", "Mild headache responsive to acetaminophen"], correct: 2, rationale: "Hypotension with hives and respiratory difficulty indicates an anaphylactic infusion reaction requiring immediate intervention: stop the infusion, maintain airway, administer epinephrine. Low-grade fever and mild headache are common, manageable side effects." },
      { question: "A parent asks why their child with Kawasaki disease needs aspirin when they were told never to give aspirin to children. The nurse's best response is:", options: ["Aspirin is safe in all children over age 2", "Kawasaki disease is one of the rare exceptions where aspirin is essential to prevent coronary artery complications", "The aspirin dose is too low to cause any problems", "It is only given for one day and then stopped"], correct: 1, rationale: "Kawasaki disease is one of the few pediatric conditions where aspirin is indicated. The anti-inflammatory and antiplatelet properties are essential for reducing coronary artery aneurysm risk. The nurse should also educate about switching if varicella or influenza occurs (Reye syndrome risk)." },
      { question: "What is the most serious complication of Kawasaki disease that the nurse should monitor for?", options: ["Renal failure", "Hepatic encephalopathy", "Coronary artery aneurysm", "Pulmonary fibrosis"], correct: 2, rationale: "Coronary artery aneurysms occur in 25% of untreated children and can cause MI, sudden death, or long-term ischemic heart disease. Echocardiography at diagnosis, 2 weeks, and 6-8 weeks monitors for this complication. IVIG reduces the risk to <5%." }
    ]
  }
};
