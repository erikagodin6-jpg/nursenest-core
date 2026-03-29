import type { ExamQuestion } from "./types";

export const npExamBatch35Questions: ExamQuestion[] = [
  {
    q: "A 65-year-old male with type 2 diabetes on metformin 2000 mg daily has an HbA1c of 7.8%. He has established cardiovascular disease (prior MI). According to ADA 2024 guidelines, what class of medication should be added next?",
    o: ["GLP-1 receptor agonist with proven cardiovascular benefit (semaglutide or liraglutide)", "Sulfonylurea for cost-effectiveness", "DPP-4 inhibitor for weight neutrality", "Pioglitazone for insulin sensitization"],
    a: 0,
    r: "ADA Standards of Care recommend that patients with type 2 diabetes and established atherosclerotic cardiovascular disease (ASCVD) receive a GLP-1 RA or SGLT2 inhibitor with proven CV benefit, independent of baseline HbA1c or metformin use. Liraglutide (LEADER trial) and semaglutide (SUSTAIN-6) demonstrated significant reduction in major adverse cardiovascular events (MACE). This represents a paradigm shift from glucose-centric to organ-protective prescribing in diabetes management.",
    s: "Endocrine"
  },
  {
    q: "A 30-year-old female presents with amenorrhea, hirsutism, acne, and BMI of 32. Labs show total testosterone 68 ng/dL (elevated), DHEA-S normal, 17-hydroxyprogesterone normal, TSH normal, and prolactin normal. Pelvic ultrasound shows bilateral ovarian cysts greater than 12 follicles each. What diagnosis is confirmed?",
    o: ["Polycystic ovary syndrome (PCOS) meeting Rotterdam criteria (2 of 3: oligoamenorrhea, hyperandrogenism, polycystic ovaries)", "Congenital adrenal hyperplasia", "Cushing syndrome", "Prolactinoma"],
    a: 0,
    r: "PCOS diagnosis requires 2 of 3 Rotterdam criteria: 1) Oligo/anovulation (amenorrhea), 2) Clinical or biochemical hyperandrogenism (hirsutism, acne, elevated testosterone), 3) Polycystic ovaries on ultrasound (12 or more follicles or ovarian volume greater than 10 mL). This patient meets all 3. Normal 17-OHP excludes late-onset CAH, normal DHEA-S argues against adrenal androgen excess, and normal prolactin/TSH excludes other causes. PCOS is the most common endocrine disorder in reproductive-age women.",
    s: "Endocrine"
  },
  {
    q: "A 55-year-old female with type 2 diabetes on insulin glargine 40 units nightly has fasting glucoses of 90-110 mg/dL but postprandial glucoses of 240-280 mg/dL. HbA1c is 8.2%. What adjustment is most appropriate?",
    o: ["Add prandial rapid-acting insulin (lispro or aspart) before the largest meal, then titrate", "Increase basal insulin to 60 units", "Switch to NPH insulin twice daily", "Add metformin 2000 mg daily and discontinue insulin"],
    a: 0,
    r: "When fasting glucose is at goal but HbA1c remains elevated, the issue is postprandial hyperglycemia. Basal insulin controls fasting glucose but does not address meal-related glucose excursions. Adding prandial (rapid-acting) insulin at the largest meal (basal-plus strategy) addresses this. The basal-bolus approach (insulin at each meal) provides the most physiologic coverage. Increasing basal insulin further would cause fasting hypoglycemia without improving postprandial control. Alternative non-insulin options include GLP-1 RA which reduces postprandial glucose.",
    s: "Endocrine"
  },
  {
    q: "A 70-year-old female presents with fatigue and is found to have calcium of 11.8 mg/dL, phosphorus 2.2 mg/dL, and PTH 112 pg/mL. She has a history of kidney stones and osteoporosis with T-score -2.9. What is the definitive treatment?",
    o: ["Parathyroidectomy as she meets surgical criteria (calcium greater than 1 mg/dL above normal, osteoporosis, kidney stones, age less than 50, or eGFR less than 60)", "Observation with annual monitoring", "Cinacalcet as primary therapy", "Bisphosphonate therapy alone"],
    a: 0,
    r: "Primary hyperparathyroidism with symptomatic disease (kidney stones) and osteoporosis meets multiple surgical criteria per the 2014 Fourth International Workshop guidelines. Surgical criteria include: serum calcium greater than 1.0 mg/dL above upper normal, T-score -2.5 or worse at any site, vertebral fracture, eGFR less than 60, 24-hour urine calcium greater than 400 mg, nephrolithiasis or nephrocalcinosis, or age less than 50. Parathyroidectomy is curative in 95-98% of cases. Cinacalcet is for non-surgical candidates only.",
    s: "Endocrine"
  },
  {
    q: "A 45-year-old male with type 2 diabetes reports episodes of diaphoresis, tremor, and confusion occurring 3-4 hours after meals. His glucose during an episode is 52 mg/dL. He is on glipizide 10 mg twice daily and metformin 1000 mg twice daily. Which medication is most likely causing the hypoglycemia?",
    o: ["Glipizide (sulfonylurea) due to insulin secretagogue mechanism", "Metformin due to insulin sensitization", "Both medications equally contribute", "Neither medication; this is reactive hypoglycemia"],
    a: 0,
    r: "Sulfonylureas (glipizide, glyburide, glimepiride) stimulate insulin secretion from pancreatic beta cells regardless of glucose level, creating a significant hypoglycemia risk. Glipizide's duration of action (12-24 hours) can cause delayed hypoglycemia. Metformin works by reducing hepatic glucose production and improving insulin sensitivity -- it does not stimulate insulin secretion and has negligible hypoglycemia risk as monotherapy. Management: reduce or discontinue glipizide, consider switching to a non-hypoglycemia-prone agent (SGLT2i, GLP-1 RA, DPP-4i).",
    s: "Endocrine"
  },
  {
    q: "A 35-year-old female with Graves disease is 8 weeks pregnant. She is symptomatic with weight loss and tachycardia. Free T4 is 4.2 ng/dL. What is the preferred antithyroid medication in the first trimester?",
    o: ["Propylthiouracil (PTU) during the first trimester, then consider switching to methimazole after 16 weeks", "Methimazole throughout pregnancy", "Radioactive iodine ablation", "No treatment; thyrotoxicosis is normal in pregnancy"],
    a: 0,
    r: "PTU is preferred over methimazole in the first trimester due to methimazole's association with embryopathy (aplasia cutis, choanal atresia, tracheoesophageal fistula) during weeks 6-10 of gestation. After the first trimester (16 weeks), switching to methimazole is considered because PTU carries a higher risk of hepatotoxicity. Radioactive iodine is absolutely contraindicated in pregnancy (destroys fetal thyroid). Untreated thyrotoxicosis increases risk of preeclampsia, preterm delivery, and fetal growth restriction.",
    s: "Endocrine"
  },
  {
    q: "A 50-year-old male with type 2 diabetes has progressive CKD. His eGFR is now 25 mL/min. He is currently on metformin 2000 mg daily. What medication adjustment is required?",
    o: ["Discontinue metformin as it is contraindicated when eGFR falls below 30 mL/min", "Continue metformin at the current dose", "Increase metformin to 2500 mg for enhanced renal protection", "Switch to extended-release metformin without dose adjustment"],
    a: 0,
    r: "FDA guidelines recommend discontinuing metformin when eGFR falls below 30 mL/min due to increased risk of lactic acidosis from impaired renal clearance of metformin. Dose reduction to 1000 mg/day is recommended when eGFR is 30-45, and metformin should not be initiated when eGFR is below 30. Alternative agents safe in advanced CKD include certain DPP-4 inhibitors (linagliptin does not require dose adjustment), GLP-1 RAs (some approved down to eGFR 15), and insulin. SGLT2 inhibitors have renal benefit but limited glycemic efficacy at low eGFR.",
    s: "Endocrine"
  },
  {
    q: "A 28-year-old female with type 1 diabetes presents in DKA with glucose 480 mg/dL, pH 7.15, bicarbonate 8 mEq/L, and potassium 5.8 mEq/L. When should insulin be initiated?",
    o: ["Ensure potassium is below 5.3 mEq/L before starting insulin; if potassium is above 5.3, begin IV fluids and recheck potassium in 1-2 hours before insulin", "Start insulin immediately regardless of potassium level", "Wait until pH normalizes to start insulin", "Start insulin only when glucose falls below 300 mg/dL"],
    a: 0,
    r: "In DKA, insulin drives potassium intracellularly, which can cause fatal hypokalemia if the initial potassium is depleted (total body potassium is always low in DKA despite potentially elevated serum levels). ADA DKA protocol: if K is greater than 5.3, start insulin and fluids (K will drop with treatment); if K is 3.3-5.3, start insulin with K replacement; if K is less than 3.3, hold insulin and replace K first. Despite this patient's K of 5.8, insulin can be started as the level will rapidly decline with treatment, but aggressive monitoring is essential.",
    s: "Endocrine"
  },
  {
    q: "A 55-year-old male presents with a painless thyroid nodule. FNA cytology returns Bethesda category IV (follicular neoplasm). What does this result indicate?",
    o: ["Indeterminate result with 15-30% malignancy risk; molecular testing (Afirma, ThyroSeq) or diagnostic lobectomy is recommended", "Benign; no further evaluation needed", "Malignant; total thyroidectomy required", "Insufficient specimen; repeat FNA in 3 months"],
    a: 0,
    r: "Bethesda category IV (follicular neoplasm/suspicious for follicular neoplasm) is an indeterminate cytology with 15-30% malignancy risk. The distinction between follicular adenoma and follicular carcinoma requires evaluation of capsular/vascular invasion, which cannot be determined by FNA. Options include: 1) Molecular testing (ThyroSeq v3, Afirma GSC) to risk-stratify, 2) Diagnostic lobectomy for definitive histological evaluation. If molecular testing suggests benign, surveillance may be appropriate. If malignant features are found on lobectomy, completion thyroidectomy may follow.",
    s: "Endocrine"
  },
  {
    q: "A 40-year-old female with pheochromocytoma is scheduled for adrenalectomy. What preoperative medication management is essential?",
    o: ["Alpha-blockade with phenoxybenzamine starting 10-14 days before surgery, then add beta-blocker only after adequate alpha-blockade is established", "Start beta-blocker first to control heart rate", "No preoperative medication needed", "Start ACE inhibitor for blood pressure control"],
    a: 0,
    r: "Pheochromocytoma resection requires meticulous preoperative preparation: 1) Alpha-blockade FIRST (phenoxybenzamine or doxazosin) starting 10-14 days before surgery to prevent intraoperative hypertensive crisis during tumor manipulation. 2) Beta-blockade ONLY AFTER adequate alpha-blockade to prevent unopposed alpha-stimulation (which causes severe hypertension). Starting beta-blockers before alpha-blockade is dangerous. 3) Liberal salt and fluid intake to expand intravascular volume (chronically constricted). 4) Target: BP less than 130/80 seated with mild orthostasis.",
    s: "Endocrine"
  }
];
