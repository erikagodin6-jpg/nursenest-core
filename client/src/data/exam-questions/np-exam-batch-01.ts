import type { ExamQuestion } from "./types";

export const npExamBatch01Questions: ExamQuestion[] = [
  {
    q: "A 62-year-old male with a 20-year smoking history presents with exertional chest tightness and diaphoresis. ECG shows 2 mm ST depression in leads V3-V6. Troponin I is 0.02 ng/mL (normal less than 0.04). Which is the most appropriate next step?",
    o: ["Schedule exercise stress echocardiography within 72 hours", "Admit for serial troponins and heparin infusion", "Prescribe nitroglycerin sublingual PRN and follow up in 1 week", "Order coronary CT angiography as outpatient"],
    a: 0,
    r: "With borderline troponin and exertional symptoms with ST changes on resting ECG, stress testing is indicated to evaluate for inducible ischemia. Troponin is below the diagnostic threshold for acute MI, making immediate admission premature. Outpatient stress echo within 72 hours is appropriate for risk stratification of stable angina.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old female with heart failure with reduced ejection fraction (LVEF 28%) on lisinopril, carvedilol, and furosemide continues to have NYHA class III symptoms. Which medication addition has the strongest mortality benefit?",
    o: ["Spironolactone 25 mg daily", "Digoxin 0.125 mg daily", "Hydralazine 25 mg three times daily", "Ivabradine 5 mg twice daily"],
    a: 0,
    r: "Spironolactone, a mineralocorticoid receptor antagonist, has demonstrated significant mortality reduction in HFrEF patients already on optimal ACE inhibitor and beta-blocker therapy (RALES trial). Digoxin reduces hospitalizations but does not improve mortality. Hydralazine-nitrate combination is reserved for patients intolerant of ACE inhibitors or ARBs. Ivabradine is indicated for HR greater than 70 bpm on maximally tolerated beta-blocker.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old male with newly diagnosed atrial fibrillation has a CHA2DS2-VASc score of 3 and a HAS-BLED score of 2. He has normal renal function and no history of bleeding. Which anticoagulation strategy should the NP initiate?",
    o: ["Apixaban 5 mg twice daily", "Warfarin with target INR 2.0-3.0", "Aspirin 325 mg daily", "Dabigatran 150 mg twice daily with bridging heparin"],
    a: 0,
    r: "Direct oral anticoagulants (DOACs) such as apixaban are preferred over warfarin for non-valvular atrial fibrillation due to reduced risk of intracranial hemorrhage, no routine INR monitoring requirement, and comparable or superior stroke prevention. Aspirin alone is insufficient for stroke prevention at this CHA2DS2-VASc score. Bridging heparin is not required when initiating dabigatran.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old patient presents with bilateral lower extremity edema, jugular venous distension, and an S3 gallop. BNP is 890 pg/mL. Chest X-ray shows cardiomegaly with pulmonary vascular congestion. What is the priority intervention?",
    o: ["Administer IV furosemide 40 mg and reassess in 2 hours", "Start dobutamine infusion", "Order urgent cardiac catheterization", "Increase oral lisinopril dose"],
    a: 0,
    r: "This patient presents with acute decompensated heart failure with volume overload. IV loop diuretics are the first-line treatment to reduce preload and relieve congestion. Dobutamine is reserved for cardiogenic shock with low cardiac output. Cardiac catheterization is not the immediate priority. Oral medication adjustments are insufficient for acute decompensation.",
    s: "Cardiovascular"
  },
  {
    q: "A 48-year-old female presents with sudden onset tearing chest pain radiating to the back and a blood pressure of 210/120 mmHg. CT angiography confirms Stanford type B aortic dissection without malperfusion. What is the first-line management?",
    o: ["IV esmolol to target heart rate below 60 bpm and systolic BP below 120 mmHg", "Emergent surgical repair", "IV nitroprusside as sole agent", "Oral metoprolol 50 mg and observation"],
    a: 0,
    r: "Uncomplicated Stanford type B aortic dissection is managed medically with aggressive blood pressure and heart rate control. IV beta-blockers (esmolol or labetalol) are first-line to reduce aortic wall shear stress. Surgical repair is indicated for complicated type B or type A dissections. Nitroprusside alone can cause reflex tachycardia and must be used only after beta-blockade. Oral agents are inadequate for the acute phase.",
    s: "Cardiovascular"
  },
  {
    q: "A 52-year-old female with type 2 diabetes has an HbA1c of 9.1% despite maximum-dose metformin. Her eGFR is 65 mL/min and BMI is 38. She has a history of atherosclerotic cardiovascular disease. Which second-line agent provides the greatest cardiovascular and glycemic benefit?",
    o: ["Semaglutide (GLP-1 receptor agonist)", "Glipizide (sulfonylurea)", "Pioglitazone (thiazolidinedione)", "Sitagliptin (DPP-4 inhibitor)"],
    a: 0,
    r: "GLP-1 receptor agonists such as semaglutide have demonstrated cardiovascular risk reduction in patients with established ASCVD, significant HbA1c lowering, and weight loss benefits. Sulfonylureas carry hypoglycemia risk and weight gain. Pioglitazone causes fluid retention and is relatively contraindicated in heart failure. DPP-4 inhibitors provide modest glycemic control without proven cardiovascular benefit.",
    s: "Endocrine"
  },
  {
    q: "A 35-year-old female presents with fatigue, weight gain, constipation, and cold intolerance. TSH is 12.8 mIU/L (normal 0.4-4.0) and free T4 is 0.6 ng/dL (normal 0.8-1.8). Which medication and dose should the NP prescribe?",
    o: ["Levothyroxine 1.6 mcg/kg/day, taken on empty stomach 30-60 minutes before breakfast", "Liothyronine 25 mcg twice daily", "Levothyroxine 25 mcg daily regardless of weight", "Methimazole 10 mg daily"],
    a: 0,
    r: "Primary hypothyroidism is treated with levothyroxine at a weight-based dose of approximately 1.6 mcg/kg/day. It must be taken on an empty stomach 30-60 minutes before eating and separated from calcium and iron supplements by 4 hours. Liothyronine (T3) alone is not standard monotherapy. A fixed low dose of 25 mcg is used only in elderly patients or those with cardiac disease. Methimazole is an antithyroid medication used for hyperthyroidism.",
    s: "Endocrine"
  },
  {
    q: "A 28-year-old male presents with polyuria, polydipsia, and an unintentional 15-pound weight loss over 3 weeks. Random glucose is 380 mg/dL. Urinalysis shows ketones 3+. ABG shows pH 7.22, HCO3 12 mEq/L. What is the priority management?",
    o: ["Initiate IV normal saline bolus, IV regular insulin infusion, and potassium replacement", "Start subcutaneous insulin glargine 20 units at bedtime", "Begin metformin 500 mg twice daily and recheck in 1 week", "Order HbA1c and refer to endocrinology"],
    a: 0,
    r: "This presentation is consistent with diabetic ketoacidosis (DKA) requiring emergent management: aggressive IV fluid resuscitation with normal saline, continuous IV regular insulin infusion, and electrolyte monitoring with potassium replacement. Subcutaneous insulin is insufficient for DKA. Metformin is contraindicated in DKA. Outpatient referral delays critical intervention.",
    s: "Endocrine"
  },
  {
    q: "A 60-year-old female on levothyroxine 100 mcg daily has a follow-up TSH of 0.15 mIU/L (normal 0.4-4.0) and free T4 of 2.1 ng/dL (normal 0.8-1.8). She reports palpitations and tremor. What should the NP do?",
    o: ["Reduce levothyroxine dose by 12.5-25 mcg and recheck TSH in 6-8 weeks", "Discontinue levothyroxine and start methimazole", "Add propranolol for symptom control and maintain current dose", "Order thyroid ultrasound and radioactive iodine uptake scan"],
    a: 0,
    r: "Suppressed TSH with elevated free T4 on levothyroxine indicates overreplacement. The appropriate action is to reduce the dose by 12.5-25 mcg and recheck TSH in 6-8 weeks. Discontinuing levothyroxine would cause hypothyroidism. Adding a beta-blocker without dose adjustment ignores the underlying cause. Imaging is unnecessary as the etiology is iatrogenic overreplacement.",
    s: "Endocrine"
  },
  {
    q: "A 45-year-old male presents with a 2 cm thyroid nodule found incidentally on CT scan. TSH is normal. Fine needle aspiration cytology shows Bethesda category IV (follicular neoplasm). What is the appropriate next step?",
    o: ["Refer for surgical consultation for diagnostic thyroid lobectomy", "Repeat FNA in 6 months", "Start levothyroxine suppression therapy", "Order radioactive iodine ablation"],
    a: 0,
    r: "Bethesda category IV (follicular neoplasm or suspicious for follicular neoplasm) cannot distinguish between benign follicular adenoma and follicular carcinoma on cytology alone. Diagnostic surgical lobectomy is recommended for definitive diagnosis. Repeating FNA will yield the same indeterminate result. TSH suppression therapy is not indicated for diagnostic purposes. Radioactive iodine ablation is a treatment modality, not a diagnostic step.",
    s: "Endocrine"
  }
];
