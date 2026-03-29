import type { ExamQuestion } from "./types";

export const npExamBatch15Questions: ExamQuestion[] = [
  {
    q: "A 45-year-old female presents with episodes of sweating, palpitations, headache, and severe hypertension (220/130 mmHg). 24-hour urine metanephrines are markedly elevated. CT abdomen shows a 3.5 cm right adrenal mass. What is the management sequence?",
    o: ["Alpha-blockade with phenoxybenzamine for 10-14 days before surgery, then add beta-blocker if needed, followed by surgical adrenalectomy", "Immediate surgical resection without medical preparation", "Start beta-blocker first for heart rate control", "Initiate calcium channel blocker and observe"],
    a: 0,
    r: "Pheochromocytoma requires preoperative alpha-blockade (phenoxybenzamine or doxazosin) for 10-14 days before surgery to prevent intraoperative hypertensive crisis. Beta-blockers are added ONLY after adequate alpha-blockade to prevent unopposed alpha-stimulation and hypertensive crisis. Surgery without preparation risks fatal hypertensive crisis. Observation is inappropriate for a functional adrenal tumor.",
    s: "Endocrine"
  },
  {
    q: "A 68-year-old male with type 2 diabetes has an eGFR of 28 mL/min (CKD stage 4). His HbA1c is 8.5% on metformin 1000 mg twice daily and sitagliptin 100 mg daily. Which medication adjustment is necessary?",
    o: ["Discontinue metformin (contraindicated below eGFR 30), reduce sitagliptin to 50 mg or switch to an insulin-based regimen", "Continue current medications without change", "Add a sulfonylurea for additional glycemic control", "Switch to an SGLT2 inhibitor"],
    a: 0,
    r: "Metformin is contraindicated when eGFR falls below 30 mL/min due to lactic acidosis risk. Sitagliptin requires dose reduction (50 mg for eGFR 30-45, 25 mg for eGFR less than 30). Insulin is often necessary at this stage of CKD. Some SGLT2 inhibitors (dapagliflozin) may be continued for renoprotection at lower eGFR but glycemic efficacy diminishes. Sulfonylureas increase hypoglycemia risk in CKD due to impaired renal clearance.",
    s: "Endocrine"
  },
  {
    q: "A 52-year-old female presents with fatigue, bone pain, and kidney stones. Calcium is 11.8 mg/dL, PTH is 128 pg/mL (elevated), phosphorus is 2.1 mg/dL (low), and 24-hour urine calcium is elevated. What is the most likely diagnosis and definitive treatment?",
    o: ["Primary hyperparathyroidism; parathyroidectomy", "Secondary hyperparathyroidism due to CKD; phosphate binders", "Hypercalcemia of malignancy; IV bisphosphonate", "Familial hypocalciuric hypercalcemia; observation"],
    a: 0,
    r: "Elevated calcium with inappropriately elevated PTH and elevated urinary calcium confirms primary hyperparathyroidism (PHPT). This patient has indications for surgery (symptomatic disease with kidney stones and bone pain). Parathyroidectomy is curative. Secondary hyperparathyroidism has low calcium. Malignancy-associated hypercalcemia has suppressed PTH. FHH has low urinary calcium excretion.",
    s: "Endocrine"
  },
  {
    q: "A 25-year-old female presents with oligomenorrhea, BMI 34, and acanthosis nigricans. Fasting insulin is elevated at 38 mIU/L. She is not currently trying to conceive. What is the appropriate management of insulin resistance?",
    o: ["Lifestyle modifications (caloric restriction, 150 min/week exercise targeting 5-7% weight loss) and consider metformin as adjunct", "Start insulin glargine for insulin resistance", "Prescribe thiazolidinedione as first-line", "No treatment needed for insulin resistance"],
    a: 0,
    r: "Insulin resistance with metabolic syndrome features (obesity, acanthosis nigricans, oligomenorrhea suggesting PCOS) is primarily managed with lifestyle modifications. Weight loss of 5-7% significantly improves insulin sensitivity. Metformin is an evidence-based adjunct for insulin resistance. Exogenous insulin is inappropriate for insulin resistance (the problem is not insulin deficiency). TZDs have significant side effects. Ignoring insulin resistance allows progression to type 2 diabetes.",
    s: "Endocrine"
  },
  {
    q: "A 60-year-old male with type 2 diabetes and ASCVD (prior MI) is on metformin 2000 mg daily with HbA1c 8.2%. His cardiologist recommends cardiovascular risk reduction. Which second-line agent has proven cardiovascular mortality benefit?",
    o: ["Empagliflozin (SGLT2 inhibitor) or liraglutide (GLP-1 RA)", "Glipizide (sulfonylurea)", "Acarbose (alpha-glucosidase inhibitor)", "Saxagliptin (DPP-4 inhibitor)"],
    a: 0,
    r: "EMPA-REG OUTCOME trial demonstrated cardiovascular mortality reduction with empagliflozin. LEADER trial showed cardiovascular benefit with liraglutide. ADA/EASD consensus recommends GLP-1 RA or SGLT2 inhibitor as second-line after metformin in patients with established ASCVD regardless of HbA1c. Sulfonylureas lack CV benefit. DPP-4 inhibitors have neutral CV effects (saxagliptin may increase heart failure risk per SAVOR-TIMI trial).",
    s: "Endocrine"
  },
  {
    q: "A 32-year-old male with type 1 diabetes on basal-bolus insulin presents with HbA1c of 8.6% and frequent hypoglycemic episodes (glucose below 54 mg/dL several times weekly). He has hypoglycemia unawareness. What technology should the NP recommend?",
    o: ["Continuous glucose monitoring (CGM) with or without insulin pump with predictive low-glucose suspend feature", "Increase basal insulin dose", "Switch to premixed insulin twice daily", "Add metformin to insulin regimen"],
    a: 0,
    r: "Hypoglycemia unawareness with frequent severe hypoglycemia is a strong indication for CGM technology. CGM with real-time glucose alerts helps detect impending hypoglycemia before it becomes severe. Insulin pump with predictive low-glucose suspend further reduces hypoglycemia. Increasing basal insulin worsens hypoglycemia. Premixed insulin offers less flexibility. Metformin is not standard in type 1 diabetes.",
    s: "Endocrine"
  },
  {
    q: "A 70-year-old female with osteoporosis (T-score -3.5) has been on alendronate for 7 years and now presents with atypical femur fracture (subtrochanteric, transverse pattern). What should the NP do?",
    o: ["Discontinue bisphosphonate, evaluate for surgical fixation of the fracture, and consider transition to anabolic therapy (teriparatide)", "Continue alendronate and add calcium supplementation", "Switch to a different bisphosphonate", "Start denosumab immediately"],
    a: 0,
    r: "Atypical femur fractures are a recognized complication of prolonged bisphosphonate therapy (typically greater than 5 years). The bisphosphonate should be discontinued. The fracture requires orthopedic evaluation for fixation. Transition to anabolic therapy (teriparatide) promotes bone formation and healing. Continuing or switching bisphosphonates perpetuates the risk. Denosumab is also an antiresorptive and does not address the need for bone formation.",
    s: "Endocrine"
  },
  {
    q: "A 40-year-old male presents with galactorrhea, decreased libido, and visual field deficits. Prolactin is 380 ng/mL (normal less than 20). MRI shows a 2.5 cm pituitary macroadenoma. What is the first-line treatment?",
    o: ["Dopamine agonist (cabergoline) to shrink the tumor and normalize prolactin", "Immediate transsphenoidal surgery", "Radiation therapy", "Observation with repeat MRI in 6 months"],
    a: 0,
    r: "Prolactinomas, even macroprolactinomas, are treated first-line with dopamine agonists (cabergoline preferred over bromocriptine for efficacy and tolerability). Cabergoline normalizes prolactin in 85-90% of patients and significantly shrinks tumors. Surgery is reserved for medication intolerance, resistance, or complications. Radiation is adjunctive for refractory cases. Observation is inappropriate given symptoms and visual field deficits.",
    s: "Endocrine"
  },
  {
    q: "A 55-year-old male is diagnosed with Graves disease presenting with thyrotoxicosis (free T4 4.2, TSH undetectable), diffuse goiter, and mild ophthalmopathy. He prefers definitive treatment. What are the options and considerations?",
    o: ["Radioactive iodine ablation (after achieving euthyroid state with thionamide) or thyroidectomy; avoid RAI if moderate-severe ophthalmopathy", "Methimazole lifelong as definitive therapy", "Propranolol alone for symptom control", "Lithium for thyroid suppression"],
    a: 0,
    r: "Definitive treatment options for Graves disease include RAI ablation and thyroidectomy. RAI is most commonly chosen in the US but should be avoided or used with caution in moderate-severe Graves ophthalmopathy (can worsen eye disease; corticosteroid cover may be needed). Methimazole achieves remission in only 30-50% of cases. Beta-blockers provide symptomatic relief but do not treat the underlying condition. Lithium is not standard thyroid therapy.",
    s: "Endocrine"
  },
  {
    q: "A patient with type 2 diabetes on insulin glargine 40 units at bedtime has fasting glucose values consistently 80-110 mg/dL but HbA1c remains 8.1%. What is the most likely explanation and appropriate intervention?",
    o: ["Postprandial hyperglycemia is inadequately controlled; add rapid-acting insulin before meals or a GLP-1 RA", "Increase basal insulin further to lower fasting glucose", "The HbA1c result is inaccurate; repeat in 3 months", "Switch to a premixed insulin regimen once daily"],
    a: 0,
    r: "When fasting glucose is at goal but HbA1c remains elevated, postprandial hyperglycemia is the culprit. HbA1c reflects average glucose over 2-3 months and postprandial spikes significantly contribute when above 7.5%. Adding prandial rapid-acting insulin (basal-bolus) or a GLP-1 RA (which reduces postprandial glucose) addresses this. Increasing basal insulin further risks nocturnal hypoglycemia without addressing postprandial excursions.",
    s: "Endocrine"
  }
];
