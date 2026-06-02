import type { ExamQuestion } from "./types";

export const npExamBatch05Questions: ExamQuestion[] = [
  {
    q: "A 32-year-old female presents for contraception counseling. She has a history of migraine with aura and a BMI of 36. She smokes 10 cigarettes daily. Which contraceptive method is most appropriate?",
    o: ["Levonorgestrel intrauterine device (IUD)", "Combined oral contraceptive pill", "Transdermal contraceptive patch", "Combined vaginal ring"],
    a: 0,
    r: "This patient has multiple contraindications to estrogen-containing contraceptives: migraine with aura (stroke risk), obesity (VTE risk), and smoking (cardiovascular risk). The levonorgestrel IUD is a highly effective progestin-only method that avoids estrogen-related risks. Combined methods (pill, patch, ring) are CDC MEC Category 4 (unacceptable risk) with migraine with aura.",
    s: "Women's Health"
  },
  {
    q: "A 28-year-old female presents with dysmenorrhea, dyspareunia, and chronic pelvic pain. She has been trying to conceive for 14 months without success. Pelvic ultrasound shows a 4 cm left ovarian endometrioma. What is the most appropriate next step?",
    o: ["Refer to reproductive endocrinology for laparoscopic evaluation and fertility assessment", "Prescribe combined oral contraceptives for 6 months", "Start leuprolide depot injections", "Order CA-125 and repeat ultrasound in 3 months"],
    a: 0,
    r: "Endometriosis with infertility and a significant endometrioma warrants referral to a reproductive specialist for laparoscopic evaluation, which is both diagnostic and therapeutic. Hormonal suppression (OCPs, GnRH agonists) is contraindicated when the patient is actively trying to conceive. CA-125 is nonspecific and does not change management. Watchful waiting delays fertility intervention.",
    s: "Women's Health"
  },
  {
    q: "A 52-year-old female in menopause presents with moderate-to-severe vasomotor symptoms significantly impacting quality of life. She underwent hysterectomy 5 years ago for benign disease. She has no history of breast cancer or VTE. What is the recommended first-line therapy?",
    o: ["Estrogen-only therapy (conjugated equine estrogen or estradiol)", "Combined estrogen-progestin therapy", "Paroxetine 7.5 mg daily", "Black cohosh supplementation"],
    a: 0,
    r: "In women with prior hysterectomy, estrogen-only therapy is the standard for vasomotor symptoms as progestin is not needed for endometrial protection. Combined therapy carries higher breast cancer risk and is unnecessary after hysterectomy. Paroxetine is an alternative for women with contraindications to HRT. Black cohosh has insufficient evidence for efficacy.",
    s: "Women's Health"
  },
  {
    q: "A 25-year-old female presents with malodorous vaginal discharge with a fishy odor. Wet mount shows clue cells and positive whiff test. pH is 5.0. She is not pregnant. What is the recommended treatment?",
    o: ["Metronidazole 500 mg orally twice daily for 7 days", "Fluconazole 150 mg single oral dose", "Azithromycin 1 g single oral dose", "Topical clotrimazole for 7 days"],
    a: 0,
    r: "Bacterial vaginosis is diagnosed by Amsel criteria (3 of 4: thin gray discharge, clue cells, positive whiff test, pH greater than 4.5). First-line treatment is metronidazole 500 mg orally twice daily for 7 days or metronidazole gel intravaginally. Fluconazole treats vulvovaginal candidiasis. Azithromycin treats chlamydia. Clotrimazole is an antifungal inappropriate for BV.",
    s: "Women's Health"
  },
  {
    q: "A 45-year-old female has an abnormal Pap smear showing HSIL (high-grade squamous intraepithelial lesion). HPV testing is positive for type 16. What is the appropriate next step?",
    o: ["Immediate colposcopy with directed biopsy", "Repeat Pap smear in 12 months", "HPV vaccination and repeat testing in 3 years", "Prescribe topical imiquimod and follow up in 6 months"],
    a: 0,
    r: "HSIL on Pap smear with high-risk HPV (type 16) requires immediate colposcopy with directed biopsy for histological confirmation and to rule out invasive cervical cancer. Delayed repeat testing risks missing CIN 2/3 or early cancer. HPV vaccination does not treat existing infection. Topical imiquimod is used for external genital warts, not cervical dysplasia.",
    s: "Women's Health"
  },
  {
    q: "A 34-year-old female presents with depressed mood, anhedonia, insomnia, poor concentration, and feelings of worthlessness for 5 weeks. PHQ-9 score is 18 (moderately severe). She has no suicidal ideation and no prior psychiatric history. What is the most appropriate initial treatment?",
    o: ["Initiate SSRI (sertraline or escitalopram) and schedule follow-up in 2-4 weeks", "Start bupropion XL 450 mg daily", "Prescribe alprazolam 0.5 mg three times daily", "Refer for inpatient psychiatric admission"],
    a: 0,
    r: "Moderately severe major depressive disorder without suicidal ideation is appropriately managed with an SSRI as first-line pharmacotherapy. Sertraline and escitalopram have favorable side effect profiles. Bupropion 450 mg is the maximum dose, not the starting dose. Benzodiazepines are not appropriate for primary depression treatment. Inpatient admission is for acute safety concerns.",
    s: "Psychiatry"
  },
  {
    q: "A 42-year-old male on lithium 900 mg daily for bipolar I disorder presents with tremor, nausea, and diarrhea. Lithium level is 1.8 mEq/L (therapeutic range 0.6-1.2). Creatinine is 1.4 mg/dL. What is the priority intervention?",
    o: ["Hold lithium, initiate IV normal saline, monitor serial lithium levels and renal function", "Reduce lithium dose by 50% and recheck levels in 1 week", "Administer activated charcoal", "Continue current dose and add an antiemetic"],
    a: 0,
    r: "Lithium level of 1.8 mEq/L with symptoms (tremor, GI distress) indicates lithium toxicity. The priority is to hold lithium and initiate aggressive IV hydration with normal saline to enhance renal clearance. Serial lithium levels and renal function monitoring are essential. Activated charcoal does not effectively bind lithium. Continuing the current dose with symptoms of toxicity is dangerous. Hemodialysis may be needed if levels exceed 2.5 mEq/L or neurological symptoms develop.",
    s: "Psychiatry"
  },
  {
    q: "A 19-year-old female presents with a BMI of 16.5, amenorrhea for 6 months, intense fear of weight gain, and distorted body image. She reports restricting food intake to 500 calories daily. Vital signs show HR 48, BP 90/58, temperature 35.8 C. What is the most appropriate initial management?",
    o: ["Hospitalize for medical stabilization, cardiac monitoring, and supervised refeeding with monitoring for refeeding syndrome", "Prescribe mirtazapine for appetite stimulation and outpatient follow-up", "Start fluoxetine 20 mg daily and refer to a dietitian", "Begin cognitive behavioral therapy as outpatient"],
    a: 0,
    r: "This patient has severe anorexia nervosa with medical instability (bradycardia, hypotension, hypothermia, BMI below 17). Hospitalization is indicated for medical stabilization. Refeeding must be slow and carefully monitored to prevent refeeding syndrome (potentially fatal hypophosphatemia, hypokalemia, and cardiac arrhythmias). Outpatient management is unsafe at this level of medical compromise. Medications should be deferred until nutritionally stabilized.",
    s: "Psychiatry"
  },
  {
    q: "A 28-year-old male with schizophrenia on risperidone 4 mg daily presents with elevated prolactin (82 ng/mL), gynecomastia, and sexual dysfunction. His psychotic symptoms are well controlled. What is the appropriate management?",
    o: ["Switch to aripiprazole, which has prolactin-sparing properties as a partial dopamine agonist", "Increase risperidone to overcome the side effect", "Add bromocriptine to lower prolactin", "Discontinue all antipsychotic medication"],
    a: 0,
    r: "Risperidone commonly causes hyperprolactinemia due to strong D2 blockade. Aripiprazole is a partial dopamine agonist that can lower prolactin levels while maintaining antipsychotic efficacy. Increasing risperidone would worsen hyperprolactinemia. Adding bromocriptine (dopamine agonist) could counteract antipsychotic effects. Discontinuing antipsychotics risks psychotic relapse.",
    s: "Psychiatry"
  },
  {
    q: "A 65-year-old male presents with his wife who reports he has had progressive memory loss, executive function decline, and behavioral changes over 2 years. He gets lost driving to familiar locations. MMSE score is 19/30. What initial workup should the NP order?",
    o: ["CBC, CMP, TSH, vitamin B12, folate, RPR, urinalysis, and brain MRI without contrast", "Brain biopsy for definitive diagnosis", "PET scan as initial imaging study", "Start donepezil immediately without further workup"],
    a: 0,
    r: "Dementia evaluation requires ruling out reversible causes: hypothyroidism (TSH), B12 deficiency, neurosyphilis (RPR), metabolic derangements (CMP), infection (UA), and structural pathology (brain MRI). Brain biopsy is not indicated for routine dementia evaluation. PET scan may be useful adjunctively but is not the initial study. Cholinesterase inhibitors should be started after completing the diagnostic workup.",
    s: "Psychiatry"
  }
];
