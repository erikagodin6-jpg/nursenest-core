import type { ExamQuestion } from "./types";

export const cnpleBatch03Questions: ExamQuestion[] = [
  {
    q: "A 32-year-old female (G2P1) at 28 weeks gestation presents for routine prenatal care. Her 1-hour 50 g glucose challenge test result is 10.8 mmol/L (threshold 7.8 mmol/L). What is the next step?",
    o: ["Order a 2-hour 75 g oral glucose tolerance test to confirm the diagnosis of gestational diabetes mellitus", "Diagnose gestational diabetes based on the GCT result alone and start insulin", "Repeat the 50 g GCT in 2 weeks for confirmation", "No further testing is needed as the result may be a false positive"],
    a: 0,
    r: "Per Diabetes Canada and SOGC guidelines, a 1-hour GCT ≥7.8 but <11.1 mmol/L requires a confirmatory 2-hour 75 g OGTT for GDM diagnosis (a result ≥11.1 mmol/L on the GCT is diagnostic without OGTT). The OGTT diagnostic thresholds are: fasting ≥5.3, 1-hour ≥10.6, or 2-hour ≥9.0 mmol/L (one abnormal value is sufficient for diagnosis). Starting insulin before confirmed diagnosis is premature. Repeating the screening test delays diagnosis. Ignoring a significantly elevated result risks maternal and fetal complications.",
    s: "Maternal"
  },
  {
    q: "A 34-year-old female is diagnosed with gestational diabetes at 28 weeks. Her fasting glucose is 5.8 mmol/L and 2-hour postprandial readings are 8.5-9.2 mmol/L on dietary management after 2 weeks. What is the most appropriate next step?",
    o: ["Initiate insulin therapy as blood glucose targets are not being met despite nutritional therapy; metformin may be considered as an alternative with informed consent", "Continue dietary management for another 4 weeks before reassessing", "Start glyburide as first-line pharmacotherapy", "Induce labour at 34 weeks due to uncontrolled GDM"],
    a: 0,
    r: "GDM glucose targets per Diabetes Canada are: fasting <5.3 mmol/L, 1-hour postprandial <7.8 mmol/L, or 2-hour postprandial <6.7 mmol/L. This patient exceeds all targets after 2 weeks of nutritional therapy. Insulin is the first-line pharmacotherapy for GDM in Canada. Metformin is an acceptable alternative when patients decline insulin, with counselling about placental transfer. Prolonging inadequate control increases risks (macrosomia, birth trauma, neonatal hypoglycaemia). Glyburide has fallen out of favour due to higher rates of macrosomia and neonatal hypoglycaemia compared to insulin. Induction at 34 weeks for glucose management alone is premature.",
    s: "Maternal"
  },
  {
    q: "A 26-year-old female (G1P0) at 36 weeks gestation presents with BP of 148/96 on two readings 4 hours apart. She has no proteinuria, headache, visual changes, or epigastric pain. Labs including CBC, creatinine, LFTs, and LDH are normal. She had normal blood pressures throughout her pregnancy until now. What is the diagnosis?",
    o: ["Gestational hypertension, defined as new-onset hypertension after 20 weeks gestation without proteinuria or end-organ dysfunction", "Preeclampsia requiring immediate delivery", "Chronic hypertension", "Preeclampsia with severe features"],
    a: 0,
    r: "Gestational hypertension is defined as new-onset hypertension (SBP ≥140 or DBP ≥90 on two occasions ≥4 hours apart) developing after 20 weeks gestation in a previously normotensive woman, without proteinuria or signs of end-organ dysfunction. This patient has no proteinuria, no symptoms of preeclampsia (headache, visual changes, epigastric pain), and normal labs. Preeclampsia requires hypertension PLUS proteinuria or end-organ dysfunction. Chronic hypertension is diagnosed before 20 weeks or pre-pregnancy. However, gestational hypertension requires close monitoring as 15-25% progress to preeclampsia. Delivery is not immediately indicated at 36 weeks with uncomplicated gestational hypertension.",
    s: "Maternal"
  },
  {
    q: "A postpartum woman at day 3 reports breast engorgement, nipple pain, and difficulty with infant latch. She is breastfeeding and wants to continue. The NP examines and finds bilateral firm, warm, tender breasts without erythematous streaking or fluctuance. Temperature is 37.4°C. What is the most appropriate management?",
    o: ["Provide breastfeeding support including frequent feeding, proper latch assessment, warm compresses before feeding, cold compresses between feeds, and referral to a lactation consultant", "Prescribe oral antibiotics for mastitis", "Recommend discontinuing breastfeeding and using formula", "Prescribe cabergoline to suppress lactation"],
    a: 0,
    r: "This is normal postpartum engorgement, not mastitis (which presents with unilateral erythema, systemic fever >38.5°C, and flu-like symptoms). Management includes frequent feeding (8-12 times per 24 hours), proper latch assessment and correction, warm compresses or shower before feeding to facilitate letdown, cold compresses between feeds to reduce swelling, and gentle breast massage. Referral to a lactation consultant is appropriate for latch difficulties. Antibiotics are not indicated without signs of infection. Stopping breastfeeding would worsen engorgement and is contrary to the mother's wishes. Lactation suppression is not appropriate when the mother wishes to breastfeed.",
    s: "Maternal"
  },
  {
    q: "A 15-month-old male is brought for a well-child visit. He is not yet walking independently but cruises along furniture. He says 3 words, points to objects of interest, and waves bye-bye. He drinks from a cup with assistance and feeds himself finger foods. Parents are concerned about the delayed walking. What is the most appropriate response?",
    o: ["Reassure the parents that walking independently typically develops between 9-18 months, and this child's motor and language development are within normal limits; plan reassessment at 18 months", "Refer immediately to a paediatric neurologist for gait assessment", "Order hip X-rays to rule out developmental dysplasia", "Diagnose gross motor delay and initiate physiotherapy"],
    a: 0,
    r: "Independent walking typically develops between 9-18 months, with the average being 12 months. Cruising at 15 months is within the normal range. This child also demonstrates appropriate fine motor skills (finger feeding, cup with assistance), language development (3 words, pointing, waving), and social development (communicative gestures). Red flags for motor delay would include inability to bear weight on legs, absence of cruising, or regression of skills. Reassurance with planned reassessment at 18 months (if not yet walking) is appropriate. Neurology referral, imaging, and physiotherapy are premature given normal developmental trajectory.",
    s: "Pediatric"
  },
  {
    q: "A 2-year-old female is brought to the clinic with a 3-day history of barking cough, hoarseness, and inspiratory stridor that worsens at night. She had a runny nose for 2 days before the cough started. She is alert, playful, and has mild subcostal retractions. SpO2 is 96%. Temperature is 38.2°C. What is the most appropriate treatment?",
    o: ["Single dose of oral dexamethasone 0.6 mg/kg, as this is moderate croup (barking cough, stridor at rest, mild retractions) and corticosteroids reduce airway inflammation and hospitalisation", "Inhaled salbutamol for bronchospasm", "Oral amoxicillin for 10 days to treat presumed bacterial infection", "Nebulised hypertonic saline as first-line treatment"],
    a: 0,
    r: "This is croup (laryngotracheobronchitis) presenting with the classic triad of barking cough, hoarseness, and inspiratory stridor, preceded by a viral prodrome. Stridor at rest with mild retractions indicates moderate severity. Oral dexamethasone 0.6 mg/kg (single dose) is the standard treatment for all severities of croup per CPS guidelines, reducing symptom severity, return visits, and hospitalisation. Nebulised epinephrine is added for severe croup (significant distress, marked retractions). Salbutamol is ineffective as the obstruction is supraglottic, not bronchospasm. Antibiotics are not indicated for this viral illness. Hypertonic saline is used for bronchiolitis, not croup.",
    s: "Pediatric"
  },
  {
    q: "A 10-year-old male presents with a 3-month history of difficulty concentrating in school, fidgeting, frequently leaving his seat, talking excessively, and difficulty waiting his turn. His teacher reports similar behaviours in the classroom affecting his academic performance. Symptoms began before age 12. His parents report these behaviours at home and in social settings. What is the most appropriate diagnostic approach?",
    o: ["Comprehensive clinical assessment including history from parents and teachers, use of validated rating scales (Conners, Vanderbilt), and assessment for comorbid conditions to diagnose ADHD", "Brain MRI to identify structural abnormalities", "EEG to rule out absence seizures before diagnosis", "Neuropsychological testing as the sole diagnostic criterion"],
    a: 0,
    r: "ADHD is a clinical diagnosis based on DSM-5 criteria: ≥6 symptoms of inattention and/or hyperactivity-impulsivity for ≥6 months, present before age 12, in ≥2 settings (home, school), with functional impairment. This child meets criteria (school + home + social settings, onset before 12). Diagnosis requires comprehensive clinical assessment with parent and teacher input, validated rating scales (Conners, Vanderbilt, SNAP-IV), developmental history, and screening for comorbidities (anxiety, depression, learning disabilities, ODD). Brain MRI is not indicated unless focal neurological signs are present. EEG is considered only if absence seizures are clinically suspected. Neuropsychological testing is helpful but not required for diagnosis.",
    s: "Mental Health"
  },
  {
    q: "A 10-year-old male is diagnosed with ADHD, combined presentation. His symptoms significantly affect academic performance and peer relationships. Non-pharmacological strategies (behavioural therapy, classroom accommodations) have been implemented for 3 months with limited improvement. What is the first-line pharmacotherapy?",
    o: ["Methylphenidate (long-acting formulation preferred for school-day coverage), starting at the lowest dose and titrating based on response and side effects", "Atomoxetine as the first choice over stimulants", "Guanfacine extended-release as monotherapy", "Fluoxetine to address the concentration difficulties"],
    a: 0,
    r: "Stimulant medications (methylphenidate or amphetamine salts) are first-line pharmacotherapy for ADHD in children per CADDRA and AAP guidelines when behavioural strategies are insufficient. Long-acting formulations (Concerta, Biphentin) are preferred for consistent school-day coverage with reduced rebound effects. Start at the lowest dose and titrate every 1-2 weeks based on symptom response and side effect monitoring (appetite, sleep, heart rate, blood pressure, growth). Atomoxetine is a non-stimulant second-line option when stimulants are ineffective or contraindicated. Guanfacine ER is adjunctive or second-line. Fluoxetine is an SSRI for depression/anxiety, not ADHD.",
    s: "Mental Health"
  },
  {
    q: "A 17-year-old female presents with a 4-month history of restricting food intake, fear of weight gain, and excessive exercise. Her BMI is 16.5 (underweight). She has amenorrhoea for 3 months. HR is 48 bpm, BP 90/58. She denies purging behaviours. What is the most important initial assessment?",
    o: ["Medical stability assessment including ECG (QTc prolongation, bradycardia), electrolytes (potassium, phosphate, magnesium), glucose, CBC, and renal function to identify life-threatening complications", "Psychiatric interview only without physical assessment", "Order a brain MRI to rule out a hypothalamic tumour", "Start nutritional rehabilitation immediately without medical assessment"],
    a: 0,
    r: "Anorexia nervosa is the psychiatric disorder with the highest mortality rate. This patient has concerning vital signs (bradycardia, hypotension) indicating cardiac compromise. Immediate medical stability assessment is priority: ECG for arrhythmia risk (QTc prolongation predisposes to torsades de pointes), electrolytes (hypokalaemia, hypophosphataemia, hypomagnesaemia can be fatal), glucose (hypoglycaemia risk), and renal function. These results determine whether inpatient medical stabilisation is needed before or concurrent with psychiatric treatment. Psychiatric assessment is essential but medical safety comes first. Brain MRI is not first-line. Nutritional rehabilitation without medical assessment risks refeeding syndrome.",
    s: "Mental Health"
  },
  {
    q: "A 78-year-old male presents with his daughter who reports progressive memory loss over 2 years, difficulty managing finances, getting lost in familiar places, and word-finding difficulties. He is independent in basic ADLs (bathing, dressing, eating) but needs help with IADLs (cooking, driving, medications). Mini-Mental State Examination score is 20/30. What is the most appropriate initial workup?",
    o: ["CBC, TSH, vitamin B12, calcium, glucose, renal function, and liver function to exclude reversible causes, plus CT or MRI head to rule out structural pathology", "Prescribe donepezil immediately based on clinical presentation alone", "Refer for PET scan as the initial diagnostic investigation", "Lumbar puncture for cerebrospinal fluid biomarkers"],
    a: 0,
    r: "The initial workup for suspected dementia aims to exclude reversible causes: hypothyroidism (TSH), B12 deficiency, hypercalcaemia, hepatic encephalopathy, renal failure, and infections. Neuroimaging (CT or MRI) is recommended to exclude structural causes (subdural haematoma, normal pressure hydrocephalus, tumour, vascular disease). This follows CCCDTD and CCS guidelines. Once reversible causes are excluded and the clinical picture supports Alzheimer disease (progressive memory loss, executive dysfunction, MMSE 20/30 suggesting mild-moderate stage), pharmacotherapy can be considered. Starting donepezil without basic workup risks missing treatable conditions. PET scan and CSF biomarkers are not first-line investigations.",
    s: "Geriatric"
  },
  {
    q: "A 78-year-old male is diagnosed with probable Alzheimer disease (MMSE 20/30, mild-moderate stage). Reversible causes have been excluded. What is the most appropriate pharmacotherapy?",
    o: ["Cholinesterase inhibitor (donepezil, rivastigmine, or galantamine) as first-line treatment for mild-moderate Alzheimer disease", "Memantine as first-line monotherapy", "Combination donepezil plus memantine as initial therapy", "No pharmacotherapy is effective and only supportive care should be offered"],
    a: 0,
    r: "Cholinesterase inhibitors (donepezil, rivastigmine, galantamine) are first-line pharmacotherapy for mild-moderate Alzheimer disease per CCCDTD guidelines. They modestly improve or stabilise cognitive function, behaviour, and function for 6-12 months by inhibiting acetylcholinesterase and increasing acetylcholine in the synaptic cleft. Donepezil is most commonly used (once daily, well tolerated). Memantine (NMDA receptor antagonist) is approved for moderate-severe Alzheimer disease, not as first-line for mild-moderate stage. Combination therapy may be considered in moderate-severe disease. While benefits are modest, pharmacotherapy combined with non-pharmacological interventions and caregiver support provides meaningful clinical benefit.",
    s: "Geriatric"
  },
  {
    q: "An 82-year-old female with mild dementia living alone has a fall at home. She reports right hip pain and inability to bear weight. X-ray confirms a displaced femoral neck fracture. She takes no medications and has no prior fraceoporosis assessment. Postoperatively, what is the most important intervention to prevent future fractures?",
    o: ["Initiate osteoporosis treatment with an antiresorptive agent (e.g., alendronate, denosumab, or zoledronic acid) along with calcium and vitamin D supplementation and falls prevention strategies", "Calcium and vitamin D supplementation only", "Refer to a physiotherapist only without pharmacological intervention", "No intervention as osteoporosis treatment is not beneficial in patients over 80"],
    a: 0,
    r: "A fragility hip fracture is diagnostic of osteoporosis and warrants immediate pharmacological treatment without the need for DXA confirmation. Post-hip fracture mortality at 1 year is 20-30%, and re-fracture risk is highest in the first 2 years. Antiresorptive therapy (bisphosphonates or denosumab) reduces subsequent fracture risk by 40-70%. Zoledronic acid IV annually may improve adherence. Calcium (1200 mg/day) and vitamin D (800-2000 IU/day) are essential adjuncts. Falls prevention (exercise, home safety assessment, medication review) is equally important. Calcium/vitamin D alone is insufficient to prevent fractures. Age alone is not a contraindication to osteoporosis treatment.",
    s: "Geriatric"
  },
  {
    q: "A 45-year-old perimenopausal female presents with hot flushes occurring 10-12 times daily, significantly disrupting her sleep and daily functioning. She has tried lifestyle modifications (layered clothing, avoiding triggers, exercise) without adequate relief. She has no personal or family history of breast cancer, VTE, or cardiovascular disease. What is the most effective treatment?",
    o: ["Menopausal hormone therapy (systemic estrogen plus progesterone for women with an intact uterus) as it is the most effective treatment for vasomotor symptoms", "SSRI as first-line treatment for hot flushes", "Black cohosh supplementation", "Gabapentin 300 mg three times daily"],
    a: 0,
    r: "Menopausal hormone therapy (MHT) is the most effective treatment for vasomotor symptoms per SOGC and NAMS guidelines. For women under 60 or within 10 years of menopause without contraindications (breast cancer, active VTE, CVD, liver disease), the benefits outweigh risks. Women with an intact uterus require combined estrogen-progesterone to prevent endometrial hyperplasia. SSRIs/SNRIs (paroxetine, venlafaxine) are effective alternatives for women who cannot take MHT but are second-line. Black cohosh has inconsistent evidence and potential hepatotoxicity. Gabapentin may be considered as third-line.",
    s: "Reproductive"
  },
  {
    q: "A 28-year-old female presents with severe dysmenorrhoea, deep dyspareunia, chronic pelvic pain, and dyschezia (painful bowel movements during menstruation). Symptoms have worsened over 3 years. She has been trying to conceive for 18 months without success. Pelvic examination reveals a fixed, retroverted uterus with uterosacral nodularity. What is the most likely diagnosis?",
    o: ["Endometriosis, suggested by the triad of dysmenorrhoea, dyspareunia, and dyschezia with infertility and examination findings of uterosacral nodularity", "Irritable bowel syndrome", "Pelvic inflammatory disease", "Uterine fibroids"],
    a: 0,
    r: "The classic triad of endometriosis includes dysmenorrhoea, dyspareunia, and infertility. Additional features include dyschezia (cyclic painful defecation suggesting rectovaginal endometriosis), chronic pelvic pain, and examination findings of uterosacral nodularity and fixed retroverted uterus (adhesions). Endometriosis affects 6-10% of reproductive-age women and is found in 25-50% of infertile women. Definitive diagnosis requires laparoscopy with histological confirmation, though clinical diagnosis is increasingly accepted. IBS does not cause dyspareunia or infertility. PID causes acute symptoms with cervical motion tenderness and fever. Fibroids cause menorrhagia and bulk symptoms but not typically dyschezia or uterosacral nodularity.",
    s: "Reproductive"
  },
  {
    q: "A 55-year-old postmenopausal female presents with a 3-month history of postmenopausal bleeding. She has a BMI of 34, hypertension, type 2 diabetes, and nulliparity. Transvaginal ultrasound shows an endometrial thickness of 8 mm. What is the most appropriate next step?",
    o: ["Endometrial biopsy to evaluate for endometrial hyperplasia or carcinoma, given the postmenopausal bleeding and multiple risk factors", "Repeat ultrasound in 6 months to assess for change", "Prescribe cyclical progestin without tissue sampling", "Reassure that postmenopausal bleeding is common and benign"],
    a: 0,
    r: "Postmenopausal bleeding requires endometrial evaluation to exclude endometrial cancer until proven otherwise. This patient has multiple risk factors for endometrial cancer: obesity (increased peripheral estrogen conversion), diabetes, hypertension, and nulliparity. An endometrial thickness >4-5 mm on transvaginal ultrasound in a postmenopausal woman with bleeding warrants tissue sampling. Endometrial biopsy (Pipelle) is the initial tissue sampling method. If inadequate, hysteroscopy with directed biopsy follows. Waiting 6 months delays diagnosis of potential malignancy. Progestin without tissue diagnosis may mask cancer. All postmenopausal bleeding requires investigation regardless of perceived likelihood.",
    s: "Reproductive"
  },
  {
    q: "A 16-year-old male presents with a 2-week history of persistent sadness, loss of interest in activities he previously enjoyed, fatigue, difficulty concentrating in school, and statements to his parents that he feels like a burden. He denies substance use. He has withdrawn from his peer group. What is the priority assessment?",
    o: ["Direct, compassionate suicide risk assessment including asking about suicidal ideation, intent, plan, means access, and protective factors", "Prescribe fluoxetine immediately without further assessment", "Reassure parents that this is normal adolescent behaviour", "Refer to a therapist in 4-6 weeks for cognitive behavioural therapy"],
    a: 0,
    r: "Statements like feeling like a burden are a significant suicide risk factor in adolescents. Direct suicide risk assessment is the immediate priority — asking about suicidal thoughts does NOT increase risk and may be lifesaving. The assessment should include ideation (passive vs active), intent, specific plan, access to means (firearms, medications), and protective factors (family support, reasons for living). Based on risk level, a safety plan should be created. This is not normal adolescent behaviour; he meets criteria for major depressive episode. Medication may be appropriate but requires assessment first. Fluoxetine (the only SSRI with strong evidence in adolescent depression) requires careful monitoring. A 4-6 week wait for therapy is inappropriate given the acuity.",
    s: "Mental Health"
  },
  {
    q: "A 68-year-old male with Parkinson disease managed with carbidopa-levodopa presents with increasing falls, postural instability, and episodes of freezing of gait. His levodopa dose was recently increased. He reports vivid dreams and occasional visual hallucinations of animals in his home. What is the most likely cause of the hallucinations?",
    o: ["Dopaminergic medication side effect, as visual hallucinations are common with levodopa therapy, particularly at higher doses and in the context of Parkinson disease dementia", "Delirium from an underlying infection", "Schizophrenia with late onset", "Charles Bonnet syndrome from visual impairment"],
    a: 0,
    r: "Visual hallucinations in Parkinson disease are most commonly caused by dopaminergic medications (levodopa, dopamine agonists), occurring in 20-40% of patients, especially after dose increases. They typically begin with vivid dreams and progress to formed visual hallucinations (people, animals) with preserved insight initially. Risk factors include advanced disease, cognitive impairment, sleep disturbance, and polypharmacy. Management involves reducing dopaminergic medication (starting with most recently added/increased), treating contributing factors, and considering pimavanserin or quetiapine if reduction is insufficient. Delirium should be excluded but the temporal relationship to dose increase suggests medication effect. Late-onset schizophrenia is extremely rare. Charles Bonnet syndrome requires significant visual loss.",
    s: "Neurological"
  },
  {
    q: "A 5-year-old male presents with a 2-day history of facial oedema, cola-coloured urine, and decreased urine output. He had impetigo (confirmed group A Streptococcal skin infection) 3 weeks ago. BP is 128/82 (elevated for age). Urinalysis shows 3+ blood, 1+ protein, and red cell casts. Serum C3 complement is low. What is the most likely diagnosis?",
    o: ["Post-streptococcal glomerulonephritis, presenting with nephritic syndrome 1-3 weeks after a streptococcal skin infection", "Minimal change disease", "IgA nephropathy", "Henoch-Schonlein purpura nephritis"],
    a: 0,
    r: "This is classic post-streptococcal glomerulonephritis (PSGN): nephritic syndrome (haematuria with RBC casts, mild proteinuria, oedema, hypertension, oliguria) developing 3-6 weeks after a streptococcal skin infection or 1-2 weeks after pharyngitis. Low C3 complement is characteristic (consumed via the alternative pathway). Anti-streptolysin O (ASO) or anti-DNase B titres confirm recent streptococcal infection. PSGN is typically self-limiting in children with supportive management. Minimal change disease presents as nephrotic syndrome without haematuria. IgA nephropathy causes episodic gross haematuria but with normal complement. HSP nephritis occurs with purpuric rash and abdominal pain.",
    s: "Pediatric"
  },
  {
    q: "A 3-month-old male is brought by his parents for a well-baby visit. They report he is exclusively breastfed and producing 6-8 wet diapers daily. He smiles socially, coos, and follows objects past midline. His weight is tracking along the 50th percentile. What immunisations should be administered at this visit according to the Canadian immunisation schedule?",
    o: ["DTaP-IPV-Hib, pneumococcal conjugate (PCV13), and rotavirus vaccines at this 2-month visit (if not yet given) or at the 4-month visit schedule", "No immunisations are needed until 6 months of age", "MMR and varicella vaccines", "Influenza vaccine only"],
    a: 0,
    r: "According to the Canadian publicly funded immunisation schedule, vaccines at the 2-month visit include DTaP-IPV-Hib (diphtheria, tetanus, pertussis, polio, Haemophilus influenzae type b), pneumococcal conjugate vaccine (PCV13), and rotavirus vaccine (oral). These are repeated at 4 months with additional doses at 6 months. If this child is 3 months and has not yet received 2-month vaccines, they should be administered. If already received, the 4-month doses would be due at the next visit. MMR and varicella are given at 12-15 months. Influenza vaccine is recommended starting at 6 months. Delaying to 6 months leaves the infant unprotected during a vulnerable period.",
    s: "Pediatric"
  },
  {
    q: "A 14-year-old female presents with a 4-month history of excessive thirst, polyuria, fatigue, and 6 kg unintentional weight loss. Random blood glucose is 22 mmol/L. Urine dipstick shows 3+ glucose and moderate ketones. She has a family history of type 1 diabetes (mother). What is the immediate management priority?",
    o: ["Assess for diabetic ketoacidosis with venous blood gas, electrolytes, and serum ketones; initiate IV insulin and fluid resuscitation if DKA is confirmed", "Start oral metformin 500 mg daily and follow up in 1 week", "Prescribe subcutaneous insulin glargine and send home with glucose monitoring supplies", "Order HbA1c and refer to endocrinology in 4-6 weeks"],
    a: 0,
    r: "New-onset type 1 diabetes with significant hyperglycaemia (22 mmol/L) and ketonuria requires urgent assessment for DKA, which is present at diagnosis in 15-70% of paediatric T1D cases. Venous blood gas (pH, bicarbonate), electrolytes (potassium, sodium), serum ketones (beta-hydroxybutyrate), and creatinine should be obtained urgently. If DKA is confirmed (pH <7.3, bicarbonate <18, ketonaemia), IV insulin infusion and fluid resuscitation per protocol are required. Metformin is for type 2 diabetes and does not address insulin deficiency. Sending home without ruling out DKA risks fatal metabolic decompensation. Delayed referral in 4-6 weeks is inappropriate for this acute presentation.",
    s: "Pediatric"
  },
  {
    q: "A 35-year-old female presents with a 6-week history of depressed mood that began 4 weeks after the birth of her first child. She reports persistent sadness, inability to bond with her baby, intrusive thoughts of accidentally harming the baby, guilt, insomnia (beyond normal newborn-related sleep disruption), and appetite loss. She is breastfeeding. PHQ-9 score is 16. What is the most appropriate management?",
    o: ["Diagnose postpartum depression and initiate sertraline (compatible with breastfeeding), combined with psychotherapy referral, ensuring infant safety assessment and close follow-up", "Reassure that baby blues are normal and will resolve spontaneously", "Prescribe paroxetine as first-line SSRI during breastfeeding", "Discontinue breastfeeding before starting any antidepressant"],
    a: 0,
    r: "Postpartum depression (onset within 4 weeks to 12 months postpartum) with a PHQ-9 of 16 (moderately severe) and intrusive ego-dystonic thoughts (unwanted, distressing thoughts of harm, NOT desire to harm) requires treatment. Sertraline is preferred during breastfeeding due to low breast milk transfer and extensive safety data. Psychotherapy (CBT, IPT) should be combined with pharmacotherapy for moderate-severe PPD. Infant safety assessment is essential. Baby blues typically resolve by 2 weeks postpartum; 6 weeks of symptoms with this severity is PPD. Paroxetine has higher breast milk transfer and is not first-line during lactation. Breastfeeding does not need to be discontinued for sertraline therapy.",
    s: "Mental Health"
  },
  {
    q: "A 75-year-old male with benign prostatic hyperplasia on tamsulosin presents with acute urinary retention. A Foley catheter is inserted with 900 mL drained. Over the next 6 hours, his urine output is 450 mL/hour. Serum creatinine is 220 µmol/L (baseline 110). What complication is occurring?",
    o: ["Post-obstructive diuresis, a potentially dangerous polyuria that can cause dehydration and electrolyte imbalances if fluid replacement is inadequate", "Normal urine output after catheterisation", "Acute tubular necrosis requiring dialysis", "Overflow incontinence requiring catheter removal"],
    a: 0,
    r: "Post-obstructive diuresis occurs after relief of urinary obstruction, characterised by urine output >200 mL/hour or >3 L/day. It results from accumulated solute (urea) acting as an osmotic diuretic, impaired concentrating ability of the renal tubules, and ANP release. This can lead to severe dehydration, hyponatraemia, hypokalaemia, and haemodynamic instability if not managed. Management includes IV fluid replacement (typically 0.45% NaCl, replacing 50-75% of urine output), frequent electrolyte monitoring (q4-6h), and close haemodynamic monitoring. Output of 450 mL/hour is significantly above normal. ATN would not cause this polyuria. The catheter must remain in place.",
    s: "Renal"
  },
  {
    q: "A 50-year-old male with a history of alcohol use disorder presents with spider angiomata, palmar erythema, jaundice, and ascites. Labs show AST 85 U/L, ALT 42 U/L (AST:ALT >2:1), albumin 26 g/L, INR 1.8, bilirubin 68 µmol/L, and platelets 78 × 10⁹/L. What is the most important prognostic assessment tool?",
    o: ["Child-Pugh score or MELD score to classify the severity of cirrhosis and guide prognosis, transplant evaluation, and management decisions", "Liver biopsy to confirm the diagnosis", "CT abdomen for hepatocellular carcinoma screening only", "Repeating liver enzymes in 2 weeks"],
    a: 0,
    r: "This patient has decompensated alcoholic cirrhosis (ascites, coagulopathy, hypoalbuminaemia, thrombocytopenia from portal hypertension). Child-Pugh score (using albumin, bilirubin, INR, ascites, encephalopathy) classifies cirrhosis severity (A/B/C) and guides prognosis. MELD score (bilirubin, INR, creatinine) is used for transplant listing prioritisation. This patient's values suggest Child-Pugh C (severe). Liver biopsy is not always needed when clinical and laboratory findings are diagnostic. HCC screening with ultrasound is important but does not assess cirrhosis severity. Repeating enzymes adds no prognostic information when cirrhosis is already decompensated.",
    s: "GI"
  },
  {
    q: "A 38-year-old female with systemic lupus erythematosus on hydroxychloroquine 400 mg daily presents for routine monitoring. She has been on hydroxychloroquine for 6 years. What screening is essential based on the duration of therapy?",
    o: ["Annual comprehensive ophthalmological examination including OCT and visual field testing to screen for hydroxychloroquine retinal toxicity, recommended after 5 years of use", "Annual chest X-ray for pulmonary toxicity", "Quarterly liver function tests for hepatotoxicity", "Monthly CBC for bone marrow suppression"],
    a: 0,
    r: "Hydroxychloroquine retinal toxicity (bull's-eye maculopathy) is an irreversible, sight-threatening complication that increases significantly after 5 years of use and with cumulative dose >1,000 g. AAO/CRA/COphS guidelines recommend baseline ophthalmological exam within the first year, then annual screening after 5 years using OCT (optical coherence tomography) and automated visual field testing (10-2). Risk factors include duration >5 years, renal impairment, tamoxifen use, and higher doses (>5 mg/kg/day). Early detection allows drug discontinuation before symptomatic vision loss. Hydroxychloroquine does not cause significant pulmonary toxicity, hepatotoxicity, or bone marrow suppression at standard doses.",
    s: "Pharmacology"
  },
  {
    q: "A 62-year-old female presents with acute onset of left-sided facial droop, left arm weakness (4/5 power), and slurred speech. Symptom onset was 90 minutes ago. CT head shows no haemorrhage. Blood glucose is 6.8 mmol/L. BP is 182/96. What is the most time-critical intervention?",
    o: ["IV alteplase (tPA) administration within the 4.5-hour window for acute ischaemic stroke, following the Canadian Stroke Best Practice Guidelines", "Oral ASA 325 mg and admission for observation", "IV labetalol to lower BP to below 140/90 before any other intervention", "MRI brain to confirm the diagnosis before any treatment"],
    a: 0,
    r: "Acute ischaemic stroke confirmed by CT (no haemorrhage) within the 4.5-hour treatment window is an indication for IV alteplase (0.9 mg/kg, max 90 mg). Canadian Stroke Best Practice Guidelines emphasize door-to-needle time <60 minutes. Blood pressure should be lowered to <185/110 before tPA (not to normal range), and the current BP of 182/96 is below this threshold. ASA alone is inadequate when thrombolysis is available within the window. Aggressive BP lowering may worsen ischaemia. MRI is more sensitive but would delay treatment; CT is sufficient to exclude haemorrhage and initiate thrombolysis. Every minute of delay results in ~1.9 million neurons lost.",
    s: "Neurological"
  },
  {
    q: "A 42-year-old male presents with a 2-day history of right great toe pain, swelling, and erythema. He cannot bear weight on the right foot. He has a history of hypertension treated with hydrochlorothiazide. Serum uric acid is 480 µmol/L during the acute episode. Synovial fluid analysis shows negatively birefringent needle-shaped crystals. What medication should be reviewed as a potential contributor to this episode?",
    o: ["Hydrochlorothiazide, as thiazide diuretics reduce renal uric acid excretion and are a well-known precipitant of gout", "Amlodipine, which increases uric acid levels", "ACE inhibitors, which impair urate handling", "Metformin, which interferes with purine metabolism"],
    a: 0,
    r: "Thiazide diuretics (hydrochlorothiazide, chlorthalidone) reduce renal uric acid excretion by competing for the organic anion transporter in the proximal tubule, leading to hyperuricaemia and increased gout risk. This is a well-established adverse effect. The diagnosis of gout is confirmed by negatively birefringent needle-shaped monosodium urate crystals under polarised light microscopy. Management includes treating the acute flare and considering switching the thiazide to an alternative antihypertensive (losartan, which has mild uricosuric properties, may be beneficial). Amlodipine, ACE inhibitors, and metformin do not significantly affect uric acid levels.",
    s: "Pharmacology"
  },
  {
    q: "A 55-year-old female with a history of chronic low back pain has been on oxycodone 10 mg QID for 3 years prescribed by a previous provider. She requests a refill. She reports her pain is 6/10 despite the opioid and she has not tried other modalities. What approach aligns with Canadian opioid prescribing guidelines?",
    o: ["Discuss opioid risks, assess for opioid use disorder, explore multimodal pain management (physiotherapy, CBT, non-opioid analgesics), and consider a gradual taper if risks outweigh benefits", "Continue the prescription as is since she has been stable for 3 years", "Increase to oxycodone 20 mg QID for better pain control", "Abruptly discontinue the opioid at this visit"],
    a: 0,
    r: "Canadian opioid prescribing guidelines (2017 Canadian Guideline for Opioids for Chronic Non-Cancer Pain) recommend against doses >90 mg morphine equivalent daily for chronic non-cancer pain. Oxycodone 40 mg/day = ~60 mg MED, which is within range but requires reassessment. A comprehensive approach includes: assessing for opioid use disorder (OUD screening), reviewing pain and function, exploring multimodal alternatives (physiotherapy, psychology, non-opioid medications), and discussing risks (falls, overdose, OUD). If benefits do not outweigh risks, a slow taper (10% every 1-4 weeks) should be initiated with patient agreement. Continuing unchanged ignores guidelines. Dose escalation is contraindicated for chronic pain without clear benefit. Abrupt discontinuation risks withdrawal and is unsafe.",
    s: "Pharmacology"
  }
];
