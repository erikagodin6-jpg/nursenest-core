import type { ExamQuestion } from "./types";

export const npExamBatch30Questions: ExamQuestion[] = [
  {
    q: "A patient with heart failure and LVEF 25% has persistent NYHA class III symptoms despite optimal GDMT. QRS is 140 ms with LBBB. Heart rate is 58 bpm in sinus rhythm. What device therapy is most appropriate?",
    o: ["Cardiac resynchronization therapy with defibrillator (CRT-D)", "Single-chamber ICD only", "Dual-chamber pacemaker without defibrillator", "Loop recorder for monitoring only"],
    a: 0,
    r: "CRT-D is indicated for HFrEF (LVEF 35% or less), NYHA II-IV on optimal medical therapy, QRS 150 ms or greater with LBBB (strongest indication). This patient has LVEF 25%, NYHA III, and QRS 140 ms with LBBB. While the strongest evidence is for QRS 150 ms or greater, QRS 130-149 ms with LBBB is a IIa recommendation. CRT-D provides both resynchronization (improving hemodynamics) and defibrillation protection.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old male presents with chest pain and elevated troponin. Coronary angiography shows 90% stenosis of the mid-left anterior descending artery. His LVEF is 45%. He also has diabetes and 70% stenosis of the proximal right coronary artery. What revascularization strategy does the evidence support?",
    o: ["CABG based on the FREEDOM trial showing superiority over PCI in diabetic patients with multivessel disease", "PCI with drug-eluting stents to both lesions", "Medical therapy alone without revascularization", "PCI to the LAD only and medical management of the RCA"],
    a: 0,
    r: "The FREEDOM trial demonstrated that CABG was superior to PCI in diabetic patients with multivessel coronary disease, with lower rates of death and MI at 5 years. The SYNTAX trial also showed CABG superiority for complex multivessel disease. Guidelines recommend CABG for diabetic patients with multivessel disease, particularly when the LAD is involved.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old female on rivaroxaban for atrial fibrillation is scheduled for elective hip replacement. When should rivaroxaban be held before surgery?",
    o: ["Hold rivaroxaban for at least 24-48 hours before surgery depending on renal function; no bridging anticoagulation is needed for DOACs", "Hold for 5 days and bridge with LMWH", "Continue rivaroxaban through the procedure", "Switch to warfarin 2 weeks before surgery"],
    a: 0,
    r: "DOACs (rivaroxaban, apixaban) have short half-lives (5-13 hours) and predictable pharmacokinetics, allowing simple perioperative management. For high-bleeding-risk procedures, rivaroxaban should be held 48 hours before surgery (longer if CrCl less than 30). The PAUSE trial demonstrated that a simple stop-and-start approach WITHOUT bridging anticoagulation is safe and effective for DOACs, with low rates of both bleeding and thromboembolism.",
    s: "Cardiovascular"
  },
  {
    q: "A 45-year-old male presents with new-onset heart failure and LVEF 20%. He has no coronary artery disease on angiography. He consumed 6-8 beers daily for 15 years. What is the most likely etiology and what is the potential for recovery?",
    o: ["Alcoholic cardiomyopathy; LVEF can significantly improve with complete alcohol abstinence combined with guideline-directed medical therapy", "Idiopathic dilated cardiomyopathy; minimal recovery expected", "Hypertrophic cardiomyopathy; genetic testing indicated", "Stress-induced cardiomyopathy; spontaneous recovery expected"],
    a: 0,
    r: "Alcoholic cardiomyopathy is a form of dilated cardiomyopathy resulting from chronic heavy alcohol consumption. Unlike many other cardiomyopathies, it has significant potential for recovery. Complete alcohol abstinence combined with GDMT can result in substantial LVEF improvement, sometimes to near-normal. Partial recovery occurs in 30-50% of patients who achieve abstinence. Continued alcohol consumption leads to progressive decline and death.",
    s: "Cardiovascular"
  },
  {
    q: "A 30-year-old female presents with positional chest pain relieved by leaning forward. ECG shows diffuse ST elevation with PR depression. Troponin is mildly elevated. CRP is 45 mg/L. What is the diagnosis and management?",
    o: ["Acute pericarditis; colchicine 0.5 mg twice daily plus ibuprofen 600 mg three times daily for 2 weeks with taper", "Acute STEMI; activate cath lab", "Myocarditis; admit for monitoring and cardiac MRI", "Costochondritis; reassure and prescribe acetaminophen"],
    a: 0,
    r: "Positional pleuritic chest pain (worse supine, better leaning forward), diffuse ST elevation, PR depression, and elevated inflammatory markers are diagnostic of acute pericarditis. First-line treatment is colchicine (reduces recurrence by 50% per COPE and CORP trials) plus an NSAID (ibuprofen preferred). STEMI shows focal ST elevation in a coronary distribution with reciprocal changes. Myocarditis may coexist but lacks the positional chest pain and PR depression pattern.",
    s: "Cardiovascular"
  },
  {
    q: "A 75-year-old male with permanent atrial fibrillation has a ventricular rate of 52 bpm with symptomatic pauses on Holter monitor despite holding his rate-control medications. He has lightheadedness and near-syncope. What should the NP recommend?",
    o: ["Permanent pacemaker implantation for symptomatic bradycardia with tachy-brady syndrome", "Increase digoxin dose for rate control", "Start amiodarone for rhythm control", "Prescribe isoproterenol for chronotropic support"],
    a: 0,
    r: "Symptomatic bradycardia with pauses in the setting of atrial fibrillation (tachy-brady syndrome) is a Class I indication for permanent pacemaker implantation. The pacemaker provides rate support during bradycardic episodes while allowing use of rate-control medications for tachycardia. Increasing rate-control medications would worsen bradycardia. Amiodarone also has rate-slowing properties. Isoproterenol is a temporary measure only.",
    s: "Cardiovascular"
  },
  {
    q: "A 35-year-old male with type 1 diabetes on multiple daily insulin injections has an HbA1c of 8.8% with wide glycemic variability (time in range 35%). He has frequent nocturnal hypoglycemia and dawn phenomenon. Which technology upgrade would most comprehensively address his challenges?",
    o: ["Hybrid closed-loop insulin pump system (automated insulin delivery) with continuous glucose monitoring", "Flash glucose monitoring alone", "Smart insulin pen with dose calculator", "Increase basal insulin dose to address dawn phenomenon"],
    a: 0,
    r: "Hybrid closed-loop systems (automated insulin delivery) combine an insulin pump with CGM and an algorithm that automatically adjusts basal insulin delivery based on sensor glucose trends. This addresses both nocturnal hypoglycemia (reducing insulin delivery when glucose trends low) and dawn phenomenon (increasing delivery when glucose rises). Clinical trials show significant improvement in time in range and HbA1c reduction with decreased hypoglycemia. This represents the most comprehensive technology solution for his complex glycemic challenges.",
    s: "Endocrine"
  },
  {
    q: "A 60-year-old female on chronic prednisone 15 mg daily for rheumatoid arthritis for 3 years presents with vertebral compression fracture. DEXA T-score is -2.8. What medication should the NP prioritize for glucocorticoid-induced osteoporosis?",
    o: ["Teriparatide (anabolic agent) given the fracture and continued glucocorticoid use; or bisphosphonate if teriparatide is not available", "Calcium and vitamin D supplementation alone", "Denosumab as first-line without considering anabolic therapy", "Raloxifene for its anti-resorptive properties"],
    a: 0,
    r: "Glucocorticoid-induced osteoporosis (GIO) with fracture represents severe disease. ACR guidelines recommend teriparatide (anabolic therapy promoting bone formation) over bisphosphonates for severe GIO, as glucocorticoids primarily suppress bone formation (the mechanism teriparatide counteracts). If teriparatide is unavailable, bisphosphonates are second-line. Calcium/vitamin D alone are insufficient. Raloxifene has limited data in GIO. Glucocorticoid dose should be minimized when possible.",
    s: "Endocrine"
  },
  {
    q: "A 55-year-old female with type 2 diabetes on basal-bolus insulin presents with recurrent severe hypoglycemia (glucose below 54 mg/dL) requiring assistance from others. She has had 3 episodes in the past 6 months. What is the priority intervention?",
    o: ["Prescribe a glucagon emergency kit (intranasal or auto-injector) for the patient and caregivers; reassess insulin regimen and evaluate for hypoglycemia unawareness", "Increase her insulin dose to prevent rebound hyperglycemia", "Add an oral sulfonylurea for smoother glycemic control", "Recommend carrying orange juice at all times as sole intervention"],
    a: 0,
    r: "Level 3 hypoglycemia (requiring assistance) is a medical emergency. Every patient on insulin or sulfonylureas with a history of severe hypoglycemia must have a glucagon emergency kit. Intranasal glucagon (Baqsimi) and glucagon auto-injectors (Gvoke) are easier to administer than traditional reconstitution kits. The insulin regimen must be reassessed (reduce doses, consider CGM). Hypoglycemia unawareness evaluation is critical. Adding sulfonylurea would increase hypoglycemia risk.",
    s: "Endocrine"
  },
  {
    q: "A 50-year-old male with newly diagnosed type 2 diabetes has HbA1c of 11.2%, fasting glucose 340 mg/dL, and moderate symptoms (polydipsia, polyuria, 10-lb weight loss). Which initial therapy is most appropriate?",
    o: ["Initiate insulin (basal or basal-bolus) plus metformin to rapidly achieve glycemic control; transition to oral-only regimen once glucose toxicity resolves", "Start metformin alone and titrate over 3 months", "Prescribe lifestyle modifications only for 6 months", "Start a GLP-1 receptor agonist as monotherapy"],
    a: 0,
    r: "ADA guidelines recommend initiating insulin therapy when HbA1c is 10% or greater or when significant hyperglycemic symptoms are present. This patient has symptomatic hyperglycemia with glucose toxicity (which impairs both insulin secretion and action). Insulin rapidly resolves glucose toxicity. Once glucose normalizes, beta-cell function often recovers sufficiently to allow transition to oral agents. Metformin alone is insufficient for this degree of hyperglycemia. Lifestyle modifications cannot address acute glucose toxicity.",
    s: "Endocrine"
  }
];
