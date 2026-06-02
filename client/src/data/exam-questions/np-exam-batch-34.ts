import type { ExamQuestion } from "./types";

export const npExamBatch34Questions: ExamQuestion[] = [
  {
    q: "A 65-year-old female with prosthetic mitral valve presents with fever, new murmur, and splinter hemorrhages. Blood cultures are drawn. What is the empiric antibiotic regimen for prosthetic valve endocarditis pending culture results?",
    o: ["Vancomycin plus gentamicin plus rifampin", "Ceftriaxone monotherapy", "Amoxicillin oral for 14 days", "Daptomycin monotherapy"],
    a: 0,
    r: "Prosthetic valve endocarditis (PVE) empiric therapy must cover MRSA, enterococci, and HACEK organisms. The AHA recommends vancomycin (covers MRSA and resistant enterococci) plus gentamicin (synergistic killing) plus rifampin (penetrates biofilm on prosthetic material). Rifampin is specifically added for PVE because of its ability to eradicate organisms in biofilm. This triple therapy should continue until culture and susceptibility results guide de-escalation.",
    s: "Cardiovascular"
  },
  {
    q: "A 48-year-old male presents with sharp substernal chest pain that worsens with deep breathing and lying flat. ECG shows diffuse ST elevation with PR depression in multiple leads. Troponin is mildly elevated. What is the most appropriate initial treatment?",
    o: ["Ibuprofen 600 mg three times daily plus colchicine 0.5 mg twice daily", "Thrombolytic therapy with alteplase", "Heparin drip and urgent cardiac catheterization", "Nitroglycerin infusion"],
    a: 0,
    r: "The presentation of pleuritic chest pain worse when supine, diffuse ST elevation with PR depression, and mild troponin elevation is classic for acute pericarditis with myopericarditis. Treatment is NSAIDs (ibuprofen preferred for cardiac safety profile) plus colchicine (COPE trial showed 50% reduction in recurrence). Thrombolytics and anticoagulation are contraindicated due to risk of hemorrhagic pericardial effusion. This ECG pattern differs from STEMI which shows focal ST changes with reciprocal depression.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old female on warfarin for mechanical aortic valve has an INR of 8.5 without bleeding. She is asymptomatic. What is the appropriate management?",
    o: ["Hold warfarin, administer oral vitamin K 2.5-5 mg, recheck INR in 24 hours", "Administer IV 4-factor PCC immediately", "Continue warfarin at the same dose", "Administer fresh frozen plasma"],
    a: 0,
    r: "Supratherapeutic INR of 4.5-10 without bleeding is managed by holding warfarin and administering low-dose oral vitamin K (2.5-5 mg). This approach reduces INR within 24-48 hours without over-correcting (which increases thromboembolic risk with mechanical valves). IV PCC and FFP are reserved for major bleeding. Higher doses of vitamin K can cause warfarin resistance for days. INR should be rechecked in 24 hours and warfarin resumed at a reduced dose once INR is in range.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old male with ischemic cardiomyopathy (LVEF 30%) is on carvedilol 25 mg BID, sacubitril-valsartan 97/103 mg BID, spironolactone 25 mg daily, and dapagliflozin 10 mg daily. His potassium is 4.8 mEq/L and creatinine is 1.4 mg/dL. What is this four-drug regimen called?",
    o: ["Guideline-directed medical therapy (GDMT) with the four pillars of HFrEF management", "Triple therapy for heart failure", "Maximum antihypertensive therapy", "Combination immunosuppressive therapy"],
    a: 0,
    r: "The four pillars of HFrEF GDMT are: 1) Beta-blocker (carvedilol, metoprolol succinate, or bisoprolol), 2) ARNI (sacubitril-valsartan) or ACEi/ARB, 3) MRA (spironolactone or eplerenone), and 4) SGLT2 inhibitor (dapagliflozin or empagliflozin). Each class independently reduces mortality, and together they provide additive benefit. The 2022 AHA/ACC/HFSA guidelines recommend initiating all four classes as rapidly as possible, even before full titration, to maximize the mortality benefit window.",
    s: "Cardiovascular"
  },
  {
    q: "A 35-year-old female with no cardiac history presents with acute onset severe tearing chest pain radiating to the back. BP is 200/110 mmHg in the right arm and 160/90 mmHg in the left arm. CXR shows widened mediastinum. What is the most likely diagnosis?",
    o: ["Type A aortic dissection", "Acute myocardial infarction", "Pulmonary embolism", "Tension pneumothorax"],
    a: 0,
    r: "Sudden severe tearing chest/back pain, blood pressure differential between arms (greater than 20 mmHg systolic), and widened mediastinum on CXR constitute the classic triad for aortic dissection. Type A involves the ascending aorta and is a surgical emergency. Immediate management includes IV esmolol (target HR less than 60, SBP less than 120) BEFORE vasodilators, and urgent CT angiography or TEE for confirmation. Thrombolytics and anticoagulation are contraindicated. Mortality increases 1-2% per hour without surgery.",
    s: "Cardiovascular"
  },
  {
    q: "A 60-year-old male with a pacemaker presents with dizziness. Pacemaker interrogation shows battery voltage at ERI (elective replacement indicator). The pacing mode has automatically changed from DDD to VVI. What does this indicate?",
    o: ["Battery depletion requiring generator replacement; the mode switch is a power-conservation feature", "Lead fracture requiring lead replacement", "Oversensing requiring sensitivity adjustment", "Electromagnetic interference requiring device reset"],
    a: 0,
    r: "When a pacemaker battery reaches ERI (elective replacement indicator), the device automatically switches to a simpler, power-conserving mode (typically VVI from DDD). This extends remaining battery life while maintaining basic life-sustaining pacing. This is NOT a malfunction but a designed safety feature indicating the generator needs replacement within a few months. Generator replacement is an elective procedure before the battery reaches EOL (end of life), at which point pacing becomes unreliable.",
    s: "Cardiovascular"
  },
  {
    q: "A 45-year-old female presents with dyspnea, leg edema, and abdominal distension. Echocardiogram shows severe tricuspid regurgitation, dilated right ventricle with preserved LVEF. JVP shows prominent V waves. She has a history of IV drug use 10 years ago. What is the most likely etiology?",
    o: ["Endocarditis-related tricuspid valve damage from prior IV drug use", "Rheumatic heart disease", "Left-sided heart failure", "Congenital Ebstein anomaly"],
    a: 0,
    r: "Right-sided heart failure signs (leg edema, ascites, elevated JVP with prominent V waves from tricuspid regurgitation) with a history of IV drug use strongly suggest prior tricuspid valve endocarditis with residual valvular damage. IV drug use-related endocarditis predominantly affects the tricuspid valve (right-sided) due to venous injection delivering organisms directly to the right heart. S. aureus is the most common pathogen. Severe TR can be tolerated for years before RV failure develops.",
    s: "Cardiovascular"
  },
  {
    q: "A 58-year-old male with heart failure and LVEF 25% has an ICD. He receives 3 appropriate shocks in one hour for sustained ventricular tachycardia. He is hemodynamically stable between episodes. What is this called and what is the management?",
    o: ["Electrical storm; administer IV amiodarone, beta-blocker optimization, and consider catheter ablation", "Normal ICD function; no intervention needed", "ICD malfunction; schedule device replacement", "Electromagnetic interference; remove external sources"],
    a: 0,
    r: "Electrical storm is defined as 3 or more sustained VT/VF episodes or appropriate ICD shocks within 24 hours. Management: IV amiodarone (loading dose then infusion) to suppress arrhythmia, optimize beta-blockade (IV esmolol if needed), correct electrolytes, and anxiolysis. If refractory, catheter ablation is indicated. Repeated ICD shocks are traumatic and increase mortality. VT storm may indicate worsening heart failure, ischemia, or electrolyte disturbance that must be identified and treated.",
    s: "Cardiovascular"
  },
  {
    q: "A 50-year-old male with newly diagnosed dilated cardiomyopathy (LVEF 20%) asks about his prognosis and whether his heart function can improve. He has no coronary artery disease. What should the NP counsel?",
    o: ["LVEF may improve significantly with GDMT in non-ischemic cardiomyopathy; reassess in 3-6 months after medication optimization before making definitive prognostic statements", "LVEF will not improve regardless of treatment", "He will need a heart transplant within 1 year", "Only exercise will improve LVEF"],
    a: 0,
    r: "Non-ischemic dilated cardiomyopathy has a significant potential for LVEF recovery with GDMT. Studies show 30-40% of patients with newly diagnosed non-ischemic DCM will have substantial LVEF improvement (greater than 10% increase) within 6-12 months of optimized GDMT. Some patients achieve near-complete recovery. This is why ICD implantation for primary prevention is generally deferred for 3-6 months in newly diagnosed non-ischemic DCM to allow for potential LVEF recovery with medical therapy.",
    s: "Cardiovascular"
  },
  {
    q: "A 42-year-old female on combined oral contraceptive pills presents with acute onset left calf pain and swelling during a long car trip. Wells score is 6 (high probability). D-dimer is 2,400 ng/mL. What is the next step?",
    o: ["Compression ultrasound of the left lower extremity; initiate anticoagulation immediately if DVT confirmed", "Wait for ultrasound results before starting any treatment", "Order a CT pulmonary angiogram first", "Prescribe aspirin and recheck in 1 week"],
    a: 0,
    r: "High Wells score (6 or greater) with elevated D-dimer has a very high pretest probability for DVT. Compression ultrasound is the diagnostic test of choice (sensitivity 94%, specificity 98% for proximal DVT). In high-probability cases, anticoagulation should be initiated even before imaging if there will be a delay. Risk factors here include OCP use (3-4x VTE risk increase) and prolonged immobility. The patient should discontinue OCPs and switch to a non-estrogen contraceptive method.",
    s: "Cardiovascular"
  }
];
