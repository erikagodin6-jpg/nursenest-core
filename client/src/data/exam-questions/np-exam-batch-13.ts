import type { ExamQuestion } from "./types";

export const npExamBatch13Questions: ExamQuestion[] = [
  {
    q: "A 45-year-old male with treatment-resistant depression (failed 2 adequate SSRI trials and 1 SNRI trial) presents for medication management. He denies suicidal ideation. PHQ-9 is 20. What is the most appropriate next pharmacological step?",
    o: ["Augment current antidepressant with aripiprazole or lithium, or consider switching to a different class", "Increase current SSRI to maximum dose", "Prescribe benzodiazepine for anxiety component", "Discontinue all medications and start psychotherapy alone"],
    a: 0,
    r: "Treatment-resistant depression (failed 2 or more adequate antidepressant trials) warrants augmentation strategies. Atypical antipsychotic augmentation (aripiprazole, quetiapine, brexpiprazole) has the strongest evidence. Lithium augmentation is also well-supported. Alternatively, switching to a different class (bupropion, mirtazapine) may be effective. Increasing a failed SSRI is unlikely to help. Benzodiazepines do not treat depression. Psychotherapy should complement, not replace, pharmacotherapy in severe TRD.",
    s: "Psychiatry"
  },
  {
    q: "A 70-year-old female recently started on an SSRI develops hyponatremia (sodium 126 mEq/L), confusion, and unsteady gait. What is the most likely cause and appropriate intervention?",
    o: ["SIADH secondary to SSRI; hold the SSRI, fluid restrict, and monitor sodium closely", "Dehydration; administer IV normal saline bolus", "Addison disease; order cortisol level and ACTH stimulation test", "Hypothyroidism; check TSH"],
    a: 0,
    r: "SSRIs can cause syndrome of inappropriate antidiuretic hormone secretion (SIADH), particularly in elderly patients. SIADH presents with euvolemic hyponatremia. Management includes discontinuing the causative agent, fluid restriction (800-1000 mL/day), and close sodium monitoring. Correction should not exceed 8-10 mEq/L in 24 hours to prevent osmotic demyelination syndrome. IV normal saline can worsen dilutional hyponatremia in SIADH.",
    s: "Psychiatry"
  },
  {
    q: "A 55-year-old male with a 25-pack-year smoking history quit smoking 5 years ago. He asks about lung cancer screening. What is the appropriate recommendation based on current USPSTF guidelines?",
    o: ["Annual low-dose CT scan is recommended as he meets criteria: age 50-80, 20 or more pack-year history, quit within past 15 years", "No screening indicated since he quit smoking", "Chest X-ray annually for 5 more years", "Screening only for active smokers over age 65"],
    a: 0,
    r: "USPSTF recommends annual LDCT for adults aged 50-80 with 20 or more pack-year history who currently smoke or have quit within the past 15 years. This patient meets all criteria (age 55, 25 pack-years, quit 5 years ago). Smoking cessation does not negate screening eligibility within the 15-year window. Chest X-ray lacks sensitivity for early-stage lung cancer.",
    s: "Preventive Medicine"
  },
  {
    q: "A 65-year-old female asks about osteoporosis screening. She has no prior fractures and no significant risk factors beyond age and postmenopausal status. What screening is recommended?",
    o: ["DEXA scan of the hip and lumbar spine", "DEXA scan only if she has a fracture", "Quantitative CT of the wrist", "No screening until age 70"],
    a: 0,
    r: "USPSTF recommends osteoporosis screening with DEXA for all women aged 65 and older. For younger postmenopausal women, screening is recommended if the FRAX score indicates equivalent 10-year fracture risk to a 65-year-old white woman. DEXA of the hip and lumbar spine are the standard sites. Screening should not be delayed until fracture occurs. Quantitative CT is not the standard screening modality.",
    s: "Preventive Medicine"
  },
  {
    q: "A 50-year-old female with a family history of ovarian cancer in her mother (diagnosed at age 58) asks about genetic testing for BRCA mutations. She is of Ashkenazi Jewish descent. What should the NP recommend?",
    o: ["Refer for genetic counseling and BRCA testing given Ashkenazi Jewish descent and first-degree relative with ovarian cancer", "Reassure that genetic testing is only for women with breast cancer", "Order CA-125 annually as screening", "No referral needed until she reaches age 60"],
    a: 0,
    r: "Ashkenazi Jewish descent with a first-degree relative with ovarian cancer significantly increases the likelihood of carrying a BRCA mutation (1 in 40 in Ashkenazi women vs 1 in 400 in general population). USPSTF recommends genetic counseling and BRCA testing for women with family history suggesting hereditary breast/ovarian cancer syndrome. CA-125 is not recommended for ovarian cancer screening in the general population. Genetic counseling should precede testing.",
    s: "Preventive Medicine"
  },
  {
    q: "A 45-year-old male presents for routine health maintenance. He has a BMI of 29, blood pressure of 128/82, and no family history of diabetes. Fasting glucose is 105 mg/dL. What is the appropriate next step?",
    o: ["Screen for prediabetes with HbA1c; counsel on lifestyle modifications including weight loss and increased physical activity", "No action needed until fasting glucose exceeds 126", "Start metformin prophylactically", "Order oral glucose tolerance test urgently"],
    a: 0,
    r: "Impaired fasting glucose (100-125 mg/dL) with overweight (BMI 29) warrants prediabetes evaluation with HbA1c. Lifestyle modifications (structured weight loss of 5-7% body weight and 150 minutes of moderate exercise per week) reduce diabetes progression by 58% (DPP study). Metformin is considered for high-risk prediabetes but lifestyle is first-line. OGTT can be done but is not urgent.",
    s: "Preventive Medicine"
  }
];
