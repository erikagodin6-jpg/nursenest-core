import type { ExamQuestion } from "./types";

export const npExamBatch43Questions: ExamQuestion[] = [
  {
    q: "A 70-year-old male with aortic stenosis has an aortic valve area of 0.8 cm2, mean gradient of 45 mmHg, and LVEF of 60%. He reports dyspnea on exertion. What severity classification and recommended intervention?",
    o: ["Severe symptomatic aortic stenosis; refer for aortic valve replacement (surgical or TAVR)", "Moderate AS; monitor annually", "Mild AS; lifestyle modifications only", "Severe but asymptomatic; defer intervention"],
    a: 0,
    r: "Severe aortic stenosis is defined by aortic valve area less than 1.0 cm2, mean gradient greater than 40 mmHg, and/or peak velocity greater than 4 m/s. This patient has severe AS with symptoms (dyspnea). Symptomatic severe AS has a 2-year mortality of 50% without intervention. Aortic valve replacement (SAVR or TAVR depending on surgical risk and anatomy) is a class I indication. TAVR has become increasingly used across all risk categories. Once symptoms develop (angina, syncope, heart failure), the prognosis deteriorates rapidly without intervention.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old male with STEMI is taken for emergent PCI. The interventionalist successfully places a drug-eluting stent in the proximal LAD. What is the minimum duration of dual antiplatelet therapy post-DES?",
    o: ["At least 12 months of aspirin plus a P2Y12 inhibitor (clopidogrel, ticagrelor, or prasugrel) for ACS indication", "1 month then aspirin alone", "6 months then P2Y12 inhibitor alone", "Lifelong dual antiplatelet therapy"],
    a: 0,
    r: "After DES placement for ACS (STEMI/NSTEMI), DAPT with aspirin plus a P2Y12 inhibitor is recommended for at least 12 months. Ticagrelor or prasugrel are preferred over clopidogrel for ACS (PLATO and TRITON-TIMI 38 trials). After 12 months, DAPT may be extended if ischemic risk outweighs bleeding risk, or shortened to 3-6 months with de-escalation to P2Y12 monotherapy if bleeding risk is high. Premature DAPT discontinuation is the strongest predictor of stent thrombosis.",
    s: "Cardiovascular"
  },
  {
    q: "A 60-year-old female with heart failure and LVEF 30% is being optimized on GDMT. Her current heart rate is 78 bpm in sinus rhythm despite carvedilol 25 mg BID. What medication can provide additional heart rate reduction and mortality benefit?",
    o: ["Ivabradine (If channel inhibitor) for patients with LVEF 35% or less, sinus rhythm, and HR 70 bpm or greater on maximally tolerated beta-blocker", "Digoxin as first-line heart rate reducer", "Diltiazem for additive rate control", "Amiodarone for rate reduction"],
    a: 0,
    r: "Ivabradine selectively inhibits the If (funny) current in the sinoatrial node, reducing heart rate without affecting contractility or blood pressure. The SHIFT trial showed significant reduction in heart failure hospitalization in patients with HFrEF (LVEF 35% or less), sinus rhythm, and resting HR 70 bpm or greater despite maximally tolerated beta-blocker. Ivabradine is contraindicated in atrial fibrillation. Diltiazem and verapamil are contraindicated in HFrEF due to negative inotropy. Digoxin reduces hospitalization but not mortality.",
    s: "Cardiovascular"
  },
  {
    q: "A 40-year-old female presents with postpartum cardiomyopathy 3 weeks after delivery. LVEF is 25%. She is breastfeeding. Which heart failure medications require modification due to breastfeeding?",
    o: ["ACE inhibitors and ARBs are generally compatible with breastfeeding; avoid atenolol; use metoprolol or carvedilol; consult LactMed database for individual medication safety", "All heart failure medications are contraindicated during breastfeeding", "Breastfeeding should be discontinued immediately to start all medications", "Only diuretics are safe during breastfeeding"],
    a: 0,
    r: "Peripartum cardiomyopathy requires GDMT for HFrEF with modifications for breastfeeding. Most first-line HF medications are compatible: ACE inhibitors (enalapril, captopril have the most safety data), ARBs, metoprolol/carvedilol, and spironolactone are generally considered safe. Atenolol achieves high concentrations in breast milk and should be avoided. LactMed (NIH database) provides evidence-based guidance on individual medications. SGLT2 inhibitors have limited lactation data. The decision to breastfeed should be shared, weighing maternal cardiac benefit of medications against infant exposure.",
    s: "Cardiovascular"
  },
  {
    q: "A 65-year-old male with atrial fibrillation and CHA2DS2-VASc score of 4 has been on warfarin for 5 years. His last 3 INR readings have been 1.6, 3.8, and 1.9 (erratic control). What is the recommended action?",
    o: ["Switch to a direct oral anticoagulant (DOAC) such as apixaban or rivaroxaban given poor INR control (time in therapeutic range likely below 65%)", "Continue warfarin and check INR more frequently", "Discontinue all anticoagulation", "Add aspirin to warfarin for better protection"],
    a: 0,
    r: "Poor INR control (time in therapeutic range below 65%) on warfarin is associated with increased stroke and bleeding risk compared to stable INR or DOAC therapy. DOACs (apixaban, rivaroxaban, edoxaban, dabigatran) provide predictable anticoagulation without routine monitoring, have fewer drug-food interactions, and have demonstrated non-inferiority or superiority to warfarin for stroke prevention in AF (RE-LY, ROCKET AF, ARISTOTLE, ENGAGE AF-TIMI 48 trials). Apixaban (ARISTOTLE) showed the lowest major bleeding rate. Switching is recommended unless the patient has a mechanical valve or moderate-severe mitral stenosis.",
    s: "Cardiovascular"
  },
  {
    q: "A 45-year-old female with type 2 diabetes presents for medication review. She is on metformin 2000 mg, empagliflozin 25 mg, and semaglutide 1 mg weekly. Her HbA1c is 6.4%. She asks if she can stop any medications. What should the NP advise?",
    o: ["Continue empagliflozin and semaglutide for their cardiovascular and renal protective benefits independent of glycemic control; consider reducing doses of glucose-lowering agents if hypoglycemia risk exists", "Discontinue empagliflozin since HbA1c is at goal", "Discontinue semaglutide since glycemic targets are met", "Stop all medications except metformin"],
    a: 0,
    r: "The paradigm in type 2 diabetes has shifted from purely glucose-centric to organ-protective prescribing. SGLT2 inhibitors and GLP-1 RAs have proven cardiovascular and renal benefits independent of glucose lowering (demonstrated in patients with and without diabetes). Discontinuing these agents solely because HbA1c is at goal would deprive the patient of their cardiorenal protective effects. If hypoglycemia is a concern (unlikely with this regimen), adjust the glucose-lowering component rather than removing protective agents.",
    s: "Endocrine"
  },
  {
    q: "A 30-year-old female with Addison disease on hydrocortisone and fludrocortisone replacement presents for sick-day management counseling. She has influenza with vomiting and cannot take oral medications. What should the NP advise?",
    o: ["Administer intramuscular hydrocortisone 100 mg from her emergency injection kit and seek emergency care; this is a potential adrenal crisis", "Skip her medications until she can tolerate oral intake", "Take her usual oral dose with small sips of water", "Double her fludrocortisone dose only"],
    a: 0,
    r: "Adrenal crisis is a life-threatening emergency in patients with primary adrenal insufficiency who cannot take their replacement corticosteroids. Sick day rules: 1) Double or triple oral hydrocortisone dose during febrile illness, 2) If vomiting prevents oral intake, administer emergency IM hydrocortisone (patients must carry an emergency injection kit and know how to use it), 3) Seek emergency medical care for parenteral steroid administration and IV fluids. Never stop or reduce glucocorticoid replacement during illness. Fludrocortisone dose does not change. MedicAlert identification is essential.",
    s: "Endocrine"
  },
  {
    q: "A 55-year-old male with type 2 diabetes develops a painless foot ulcer over the plantar surface of his first metatarsal head. He has loss of protective sensation confirmed by monofilament testing. The ulcer is 2 cm, full thickness, without bone exposure. No signs of infection. What is the Wagner classification and management?",
    o: ["Wagner grade 2 (deep ulcer to tendon or joint capsule); offloading with total contact cast, wound care, glycemic optimization, and vascular assessment", "Wagner grade 0; observation only", "Wagner grade 4; emergent amputation", "Apply topical antibiotic and weight-bearing as tolerated"],
    a: 0,
    r: "Diabetic foot ulcers are classified using the Wagner system: Grade 0 (pre-ulcerative/healed), Grade 1 (superficial), Grade 2 (deep to tendon/capsule), Grade 3 (deep with abscess/osteomyelitis), Grade 4 (partial gangrene), Grade 5 (whole foot gangrene). Management of Grade 2: offloading (total contact cast is the gold standard, reducing plantar pressure by 60-80%), moist wound care, sharp debridement of callus, glycemic optimization (HbA1c less than 8% for healing), vascular assessment (ABI, toe pressures), and monitoring for infection signs. Avoid weight-bearing on the affected foot.",
    s: "Endocrine"
  },
  {
    q: "A 25-year-old female with type 1 diabetes using a CGM has her time in range (70-180 mg/dL) at 45% and time below range (less than 70 mg/dL) at 8%. What are the recommended targets?",
    o: ["Time in range greater than 70%, time below range less than 4%, time below 54 mg/dL less than 1%, and GMI/estimated A1c less than 7%", "Time in range greater than 50% is adequate", "Time below range of 8% is acceptable", "CGM targets are not evidence-based"],
    a: 0,
    r: "The 2019 International Consensus on Time in Range established CGM targets for type 1 and type 2 diabetes: TIR (70-180) greater than 70% (approximately correlates with HbA1c less than 7%), TBR level 1 (54-69) less than 4%, TBR level 2 (less than 54) less than 1%, TAR level 1 (181-250) less than 25%, TAR level 2 (greater than 250) less than 5%, and GMI/estimated HbA1c less than 7%. Each 5% increase in TIR correlates with meaningful clinical benefit. This patient's TBR of 8% indicates significant hypoglycemia exposure requiring urgent regimen adjustment.",
    s: "Endocrine"
  },
  {
    q: "A 60-year-old male with type 2 diabetes and non-alcoholic steatohepatitis (NASH) with liver fibrosis (F2) asks about which diabetes medication may also benefit his liver disease. What should the NP recommend?",
    o: ["Pioglitazone has evidence for improving NASH histology (reduced steatosis, inflammation, and fibrosis in the PIVENS trial); semaglutide also shows promise", "Metformin is the best choice for NASH", "Insulin specifically improves liver fibrosis", "Sulfonylureas reduce hepatic fat"],
    a: 0,
    r: "Pioglitazone (thiazolidinedione) is the most studied diabetes medication for NASH, with the PIVENS trial demonstrating improvement in steatosis, lobular inflammation, and fibrosis scores. It activates PPAR-gamma in adipocytes, redirecting fat from the liver to subcutaneous tissue. Semaglutide showed significant NASH resolution in the phase 2 trial. SGLT2 inhibitors also show hepatic benefit. Metformin, despite being first-line for T2D, has NOT shown histological improvement in NASH. Weight loss (7-10% of body weight) remains the most effective non-pharmacological intervention for NASH.",
    s: "Endocrine"
  }
];
