import type { ExamQuestion } from "./types";

export const npExamBatch14Questions: ExamQuestion[] = [
  {
    q: "A 75-year-old female with symptomatic aortic stenosis (valve area 0.8 cm2) has progressive dyspnea on exertion and an episode of syncope. Echocardiogram shows a mean gradient of 48 mmHg. What is the definitive management?",
    o: ["Referral for surgical aortic valve replacement or transcatheter aortic valve replacement (TAVR)", "Medical management with diuretics and vasodilators", "Balloon valvuloplasty as definitive treatment", "Start digoxin and beta-blocker therapy"],
    a: 0,
    r: "Severe symptomatic aortic stenosis (valve area less than 1.0 cm2 with symptoms of heart failure, syncope, or angina) has a poor prognosis without valve replacement. SAVR or TAVR are definitive. Medical therapy does not alter the natural history. Balloon valvuloplasty provides only temporary palliation. Vasodilators may worsen hemodynamics in severe AS.",
    s: "Cardiovascular"
  },
  {
    q: "A 50-year-old male with hypertrophic cardiomyopathy presents with exertional dyspnea. Echocardiogram shows septal thickness of 22 mm and a resting LVOT gradient of 55 mmHg. Which medication is first-line?",
    o: ["Non-dihydropyridine calcium channel blocker (verapamil) or beta-blocker", "ACE inhibitor", "Digoxin", "Nitrates"],
    a: 0,
    r: "HCM with dynamic LVOT obstruction is managed with negative inotropic agents (beta-blockers or non-dihydropyridine CCBs) to reduce heart rate, prolong diastolic filling, and decrease LVOT gradient. ACE inhibitors can worsen obstruction through afterload reduction. Digoxin increases contractility and worsens obstruction. Nitrates reduce preload and exacerbate obstruction.",
    s: "Cardiovascular"
  },
  {
    q: "A 63-year-old male with an implanted AICD for ischemic cardiomyopathy presents reporting three ICD shocks in the past 24 hours. He denies chest pain and is hemodynamically stable. What is the immediate priority?",
    o: ["Obtain 12-lead ECG, interrogate the device, and evaluate for reversible causes of arrhythmia", "Reassure the patient that appropriate shocks indicate the device is working correctly", "Deactivate the ICD and observe", "Start amiodarone 400 mg daily without further evaluation"],
    a: 0,
    r: "ICD storm (3 or more shocks in 24 hours) requires urgent evaluation. ECG determines the rhythm being shocked. Device interrogation confirms whether shocks were appropriate (VT/VF) or inappropriate (SVT, lead malfunction, oversensing). Reversible causes (electrolyte abnormalities, ischemia, medication changes) must be identified. Reassurance alone misses potentially life-threatening triggers.",
    s: "Cardiovascular"
  },
  {
    q: "A 42-year-old female presents with progressive lower extremity edema, dyspnea, and hepatomegaly. JVP is elevated with a prominent y descent. Echocardiogram shows pericardial thickening with normal systolic function. What is the most likely diagnosis?",
    o: ["Constrictive pericarditis", "Dilated cardiomyopathy", "Cardiac tamponade", "Restrictive cardiomyopathy"],
    a: 0,
    r: "Constrictive pericarditis presents with signs of right-sided heart failure (elevated JVP, hepatomegaly, edema) with pericardial thickening and preserved systolic function. The prominent y descent is characteristic (vs prominent x descent in tamponade). Dilated cardiomyopathy has reduced systolic function. Tamponade has pulsus paradoxus and equalization of diastolic pressures. Restrictive cardiomyopathy can be difficult to distinguish but lacks pericardial thickening.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old male presents with exertional chest pain and a positive exercise stress test. Coronary angiography reveals 80% stenosis of the left anterior descending artery. LVEF is 55%. What is the recommended management?",
    o: ["Percutaneous coronary intervention with drug-eluting stent placement plus optimal medical therapy", "Coronary artery bypass grafting", "Medical therapy alone with aspirin, statin, and beta-blocker", "Repeat stress test in 6 months"],
    a: 0,
    r: "Single-vessel LAD disease with significant stenosis and positive stress test is appropriately managed with PCI and drug-eluting stent plus guideline-directed medical therapy (DAPT, statin, beta-blocker, ACE inhibitor). CABG is preferred for left main disease or multivessel disease with diabetes. Medical therapy alone may be considered but PCI provides symptom relief in this scenario.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old female on warfarin for mechanical mitral valve presents with INR of 4.8 and epistaxis that has been ongoing for 45 minutes. What is the appropriate management?",
    o: ["Hold warfarin, administer low-dose IV vitamin K (1-2.5 mg), apply direct nasal pressure, and monitor INR closely", "Continue warfarin and apply nasal packing only", "Administer prothrombin complex concentrate and transition to a DOAC", "Give fresh frozen plasma and discontinue anticoagulation permanently"],
    a: 0,
    r: "Supratherapeutic INR with minor bleeding (epistaxis) in a patient with a mechanical valve requires warfarin reversal with low-dose IV vitamin K while maintaining the ability to re-anticoagulate. Direct pressure controls the nosebleed. DOACs are contraindicated with mechanical valves. PCC is reserved for major or life-threatening bleeding. Permanent anticoagulation discontinuation in a mechanical valve patient risks catastrophic valve thrombosis.",
    s: "Cardiovascular"
  },
  {
    q: "A 35-year-old previously healthy female presents with acute onset chest pain and ST elevation in leads I, aVL, V5, and V6. Troponin is elevated. She is 6 weeks postpartum and has no traditional cardiac risk factors. What is a likely diagnosis?",
    o: ["Spontaneous coronary artery dissection (SCAD)", "Atherosclerotic myocardial infarction", "Takotsubo cardiomyopathy", "Myocarditis"],
    a: 0,
    r: "SCAD is the most common cause of MI in young women, particularly in the peripartum period. It accounts for up to 25% of MI in women under 50. Risk factors include peripartum state, fibromuscular dysplasia, and connective tissue disorders. Atherosclerotic MI is unlikely in a young woman without risk factors. Takotsubo typically has apical ballooning without coronary occlusion. Myocarditis presents differently.",
    s: "Cardiovascular"
  },
  {
    q: "A 60-year-old male with CHF (LVEF 30%) and NYHA III symptoms on maximum tolerated GDMT has a QRS duration of 155 ms with LBBB morphology on ECG. What device therapy should the NP discuss?",
    o: ["Cardiac resynchronization therapy with defibrillator (CRT-D)", "ICD only without CRT", "Permanent pacemaker", "No device therapy is indicated"],
    a: 0,
    r: "CRT-D is indicated for patients with HFrEF (LVEF 35% or less), NYHA II-IV symptoms despite optimal medical therapy, and wide QRS (150 ms or greater) with LBBB morphology. CRT resynchronizes ventricular contraction, improving symptoms and mortality. LBBB with QRS 150 ms or greater has the strongest evidence for CRT benefit. ICD alone misses the resynchronization benefit. A permanent pacemaker does not provide defibrillation.",
    s: "Cardiovascular"
  },
  {
    q: "A 48-year-old female with a history of rheumatic fever presents with atrial fibrillation and symptoms of mitral stenosis. Echocardiogram shows a mitral valve area of 1.2 cm2 and mean gradient of 12 mmHg. She wants to become pregnant. What should the NP counsel regarding anticoagulation?",
    o: ["Discuss the high thromboembolic risk with mitral stenosis and AF; anticoagulation with LMWH or dose-adjusted unfractionated heparin is preferred over warfarin in the first trimester", "Warfarin is safe throughout pregnancy", "Aspirin alone is sufficient for stroke prevention", "Discontinue all anticoagulation during pregnancy"],
    a: 0,
    r: "Mitral stenosis with atrial fibrillation carries high thromboembolic risk requiring anticoagulation during pregnancy. Warfarin crosses the placenta and is teratogenic (especially weeks 6-12). LMWH or dose-adjusted UFH is recommended during the first trimester and near delivery. Warfarin may be considered in the second trimester in some cases. Aspirin alone is insufficient. Discontinuing anticoagulation risks stroke.",
    s: "Cardiovascular"
  },
  {
    q: "A 72-year-old male presents with bilateral leg heaviness, varicose veins, and skin changes including hemosiderin staining and lipodermatosclerosis at the medial ankles. There is no active ulceration. What is the primary management?",
    o: ["Graduated compression stockings (20-30 mmHg), leg elevation, and exercise; vascular referral for possible intervention", "Start aspirin and clopidogrel", "Prescribe a loop diuretic", "Order arterial duplex ultrasound"],
    a: 0,
    r: "Chronic venous insufficiency with skin changes (C4 disease per CEAP classification) is managed with graduated compression therapy, leg elevation, exercise, and skin care. Vascular referral for venous ablation or sclerotherapy may be indicated. Antiplatelet therapy treats arterial disease, not venous. Diuretics do not address the underlying venous hypertension. Venous (not arterial) duplex is the appropriate study.",
    s: "Cardiovascular"
  }
];
