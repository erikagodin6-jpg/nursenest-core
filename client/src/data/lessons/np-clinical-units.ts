import type { LessonContent } from "./types";

export const npClinicalUnitLessons: Record<string, LessonContent> = {
  "mens-health-ed-np": {
    "title": "Erectile Dysfunction",
    "cellular": {
      "title": "Vascular and Neurogenic ED Pathophysiology",
      "content": "Erectile dysfunction (ED) results from failure of the penile vascular and neurological mechanisms required for erection. Normal erection requires parasympathetic nerve stimulation releasing nitric oxide (NO) from cavernous nerve terminals and endothelial cells. NO activates guanylate cyclase, increasing cyclic GMP (cGMP) in corporal smooth muscle, causing relaxation and allowing blood to fill the sinusoidal spaces of the corpora cavernosa. Phosphodiesterase-5 (PDE5) degrades cGMP, terminating the erection. ED may be vasculogenic (atherosclerosis, diabetes, hypertension affecting penile blood flow), neurogenic (diabetic neuropathy, spinal cord injury, radical prostatectomy), hormonal (hypogonadism, hyperprolactinemia), psychogenic, or medication-induced (antihypertensives, SSRIs, antiandrogens). ED is an independent cardiovascular risk marker - men with ED have a 2-fold increased risk of MI and stroke within 5 years."
    },
    "riskFactors": [
      "Diabetes mellitus (35-75% of diabetic men develop ED)",
      "Cardiovascular disease and atherosclerosis",
      "Hypertension and antihypertensive medications (especially beta-blockers, thiazides)",
      "Tobacco smoking (dose-dependent risk)",
      "Obesity (BMI > 30 kg/m2)",
      "SSRI or SNRI antidepressant use",
      "Radical prostatectomy or pelvic radiation"
    ],
    "diagnostics": [
      "Validated questionnaire: International Index of Erectile Function (IIEF-5/SHIM)",
      "Fasting glucose and HbA1c to screen for diabetes",
      "Lipid panel and cardiovascular risk assessment",
      "Morning total testosterone (draw between 0700-1000)",
      "TSH and prolactin if testosterone low",
      "Consider nocturnal penile tumescence if psychogenic vs organic etiology uncertain",
      "Penile duplex Doppler ultrasound if vascular etiology suspected"
    ],
    "management": [
      "Address modifiable risk factors: smoking cessation, weight loss, exercise, optimize glucose and BP",
      "First-line: PDE5 inhibitor (sildenafil, tadalafil) after cardiovascular risk assessment",
      "Prescribe tadalafil 5mg daily for concurrent ED + BPH/LUTS",
      "If PDE5i contraindicated or ineffective: intracavernosal injection (alprostadil)",
      "Testosterone replacement only if confirmed hypogonadism (total T < 8 nmol/L on two AM samples)",
      "Screen for depression and psychogenic factors",
      "Refer to urology for penile prosthesis consideration if all pharmacotherapy fails"
    ],
    "signs": {
      "left": [
        "Occasional difficulty maintaining erection, responds to PDE5i",
        "Morning erections preserved (suggests psychogenic component)",
        "Mild cardiovascular risk factors",
        "Normal testosterone and prolactin levels"
      ],
      "right": [
        "Complete inability to achieve erection despite PDE5i trial",
        "Absent nocturnal/morning erections (organic etiology)",
        "ED as initial presentation of occult cardiovascular disease",
        "Peyronie disease with significant penile curvature"
      ]
    },
    "medications": [
      {
        "name": "Sildenafil (Viagra)",
        "type": "PDE5 Inhibitor",
        "action": "Selectively inhibits PDE5 in corporal smooth muscle preventing cGMP degradation, enhancing NO-mediated vasodilation and erection in response to sexual stimulation",
        "sideEffects": "Headache, flushing, dyspepsia, nasal congestion, visual disturbances (blue tinge), priapism (rare)",
        "contra": "Concurrent nitrate therapy (severe hypotension), recent MI or stroke (< 6 months), severe hepatic impairment, alpha-blockers (orthostatic hypotension risk)",
        "pearl": "Take 30-60 min before sexual activity on empty stomach. Not effective without sexual stimulation. Start 50mg, adjust 25-100mg. Avoid high-fat meals which delay absorption. ED is a vascular red flag - assess cardiovascular risk."
      },
      {
        "name": "Tadalafil (Cialis)",
        "type": "PDE5 Inhibitor (Long-Acting)",
        "action": "Same mechanism as sildenafil but with 36-hour duration allowing spontaneous sexual activity; also relaxes prostatic and bladder neck smooth muscle (treats LUTS/BPH)",
        "sideEffects": "Headache, back pain, myalgia, dyspepsia, nasal congestion",
        "contra": "Concurrent nitrates (absolute), concurrent alpha-blockers (relative - doxazosin contraindicated), severe renal or hepatic impairment",
        "pearl": "5mg daily for combined ED+BPH. PRN: 10-20mg, effective for up to 36 hours. Longer half-life allows flexible timing. FDA-approved for BPH/LUTS at 5mg daily dose."
      }
    ],
    "pearls": [
      "ED in men aged 40-60 is an independent cardiovascular risk marker with predictive value comparable to smoking - the clinician must screen for CVD risk factors and consider cardiology referral, not just treat the ED",
      "PDE5 inhibitors are absolutely contraindicated with nitrate therapy - there must be a 24-hour washout for sildenafil/vardenafil and 48-hour washout for tadalafil before nitrate administration",
      "Morning testosterone must be drawn between 0700-1000 and confirmed with a second sample before diagnosing hypogonadism - single low values may be due to acute illness, sleep deprivation, or diurnal variation"
    ],
    "quiz": [
      {
        "question": "A 52-year-old with type 2 diabetes and hypertension reports progressive ED over 18 months. He takes metformin, ramipril, and atorvastatin. Morning erections are absent. What should the clinician order first?",
        "options": [
          "Penile duplex Doppler ultrasound",
          "Fasting glucose, lipid panel, and morning total testosterone",
          "Nocturnal penile tumescence study",
          "Immediate urology referral for prosthesis"
        ],
        "correct": 1,
        "rationale": "ED evaluation requires metabolic and hormonal assessment before invasive testing. Fasting glucose evaluates diabetic control, lipid panel assesses cardiovascular risk, and morning testosterone screens for hypogonadism. Absent morning erections suggest organic (not psychogenic) etiology. This systematic approach guides appropriate treatment selection."
      }
    ]
  },
  "mens-health-bph-np": {
    "title": "Benign Prostatic Hyperplasia",
    "cellular": {
      "title": "Prostatic Growth and Urodynamic Obstruction",
      "content": "BPH involves hyperplasia of stromal and glandular elements in the periurethral transition zone of the prostate. Testosterone is converted to dihydrotestosterone (DHT) by 5-alpha-reductase within prostatic tissue. DHT binds androgen receptors with 5-fold greater affinity than testosterone, driving prostatic cell proliferation and gland enlargement. The enlarged prostate compresses the prostatic urethra causing bladder outlet obstruction (BOO). BOO produces both obstructive (hesitancy, weak stream, incomplete emptying, post-void dribbling) and irritative/storage symptoms (frequency, urgency, nocturia) collectively termed lower urinary tract symptoms (LUTS). Chronic BOO leads to detrusor hypertrophy, trabeculation, and eventually decompensation with overflow incontinence and urinary retention. The International Prostate Symptom Score (IPSS) quantifies severity: mild (0-7), moderate (8-19), severe (20-35)."
    },
    "riskFactors": [
      "Age > 50 years (prevalence increases with age: 50% at 60, 90% at 85)",
      "Family history of BPH or prostate cancer",
      "Obesity and metabolic syndrome",
      "Diabetes mellitus (associated with increased prostate volume)",
      "Sedentary lifestyle",
      "High-fat dietary pattern",
      "Testosterone replacement therapy (may worsen BPH/LUTS)"
    ],
    "diagnostics": [
      "IPSS questionnaire for symptom severity classification",
      "Digital rectal examination (DRE) for prostate size and consistency",
      "Serum PSA (to rule out prostate cancer, not for BPH diagnosis per se)",
      "Urinalysis to exclude UTI and hematuria",
      "Post-void residual (PVR) by ultrasound (> 200 mL significant)",
      "Serum creatinine if obstructive uropathy suspected",
      "Uroflowmetry if surgical intervention considered"
    ],
    "management": [
      "Watchful waiting for mild LUTS (IPSS 0-7) with annual reassessment",
      "Alpha-1 blocker (tamsulosin 0.4mg daily) for moderate-severe LUTS - rapid symptom relief",
      "5-alpha reductase inhibitor (finasteride 5mg or dutasteride 0.5mg) for prostate > 40g or PSA > 1.4",
      "Combination alpha-blocker + 5-ARI for large prostate with moderate-severe LUTS (MTOPS trial)",
      "Tadalafil 5mg daily for combined BPH/LUTS + ED",
      "Refer to urology if medical therapy fails, recurrent UTI, retention, or hematuria",
      "Advise fluid restriction before bedtime, caffeine/alcohol reduction for nocturia"
    ],
    "signs": {
      "left": [
        "Mild LUTS (IPSS 0-7) not affecting quality of life",
        "Prostate mildly enlarged, smooth, non-tender on DRE",
        "PVR < 100 mL",
        "Normal PSA for age"
      ],
      "right": [
        "Acute urinary retention requiring catheterization",
        "Recurrent urinary tract infections",
        "Renal insufficiency from obstructive uropathy",
        "Gross hematuria requiring investigation"
      ]
    },
    "medications": [
      {
        "name": "Tamsulosin (Flomax)",
        "type": "Alpha-1A Adrenergic Blocker",
        "action": "Selectively blocks alpha-1A receptors in prostatic smooth muscle and bladder neck, reducing urethral resistance without significant vascular alpha-1B blockade",
        "sideEffects": "Orthostatic hypotension (less than non-selective), retrograde ejaculation (10-30%), dizziness, nasal congestion, intraoperative floppy iris syndrome",
        "contra": "Concurrent PDE5 inhibitor use (relative - start at lowest dose), planned cataract surgery (inform ophthalmologist)",
        "pearl": "Take 30 minutes after same meal daily. Onset of effect within days. Retrograde ejaculation is harmless but counsel patients. Alert ophthalmologist before cataract surgery due to floppy iris syndrome."
      },
      {
        "name": "Finasteride (Proscar)",
        "type": "5-Alpha Reductase Inhibitor (Type II)",
        "action": "Blocks conversion of testosterone to DHT in prostate, reducing prostate volume by 20-30% over 6-12 months and decreasing risk of urinary retention and BPH surgery",
        "sideEffects": "Sexual dysfunction (ED, decreased libido, ejaculation disorders), gynecomastia, depression (rare), reduced PSA by approximately 50% (adjust interpretation)",
        "contra": "Pregnancy exposure (teratogenic - women of childbearing age must not handle crushed tablets), pediatric use",
        "pearl": "Takes 6-12 months for full effect. Reduces prostate volume 20-30%. Halves PSA level - must double measured PSA for cancer screening interpretation. PCPT trial showed 25% reduction in prostate cancer risk but potential increase in high-grade cancer detection."
      }
    ],
    "pearls": [
      "IPSS is essential for documenting BPH symptom severity and treatment response - a score decrease of >= 3 points indicates clinically meaningful improvement and should be documented at each follow-up",
      "Finasteride reduces PSA by approximately 50% - the clinician must double the measured PSA value for cancer screening interpretation in patients on 5-ARI therapy, or an unexpected PSA rise while on finasteride warrants further investigation",
      "Alpha-blockers provide rapid symptom relief (days to weeks) while 5-ARIs take 6-12 months to reduce prostate size - combination therapy (MTOPS trial) reduces progression risk by 66% compared to either agent alone"
    ],
    "quiz": [
      {
        "question": "A 65-year-old presents with nocturia x4, weak stream, and IPSS 22. DRE shows a 55g smooth prostate. PSA 3.2 ng/mL. PVR 120 mL. What is the most appropriate initial therapy?",
        "options": [
          "Watchful waiting with annual reassessment",
          "Tamsulosin 0.4mg daily alone",
          "Tamsulosin 0.4mg + finasteride 5mg daily (combination therapy)",
          "Immediate urology referral for TURP"
        ],
        "correct": 2,
        "rationale": "Severe LUTS (IPSS 22) with large prostate (> 40g) and elevated PSA (> 1.4) favours combination alpha-blocker + 5-ARI therapy per the MTOPS trial, which showed 66% reduction in clinical progression compared to monotherapy. PVR 120 mL is not critically elevated but supports medical therapy initiation."
      }
    ]
  },
  "womens-health-menopause-np": {
    "title": "Menopause and Hormone Therapy",
    "cellular": {
      "title": "Ovarian Senescence and Estrogen Decline",
      "content": "Menopause is defined as 12 consecutive months of amenorrhea due to permanent cessation of ovarian follicular activity, occurring at a median age of 51 years. The perimenopause (menopausal transition) begins 4-8 years before final menstrual period with fluctuating estradiol levels and irregular cycles. Declining ovarian follicle reserve leads to decreased inhibin B production, releasing FSH from negative feedback inhibition. Rising FSH levels are characteristic of perimenopause (FSH > 25 IU/L on day 2-3 of cycle). Complete follicular depletion results in sustained estradiol levels < 73 pmol/L and FSH > 40 IU/L. Estrogen deficiency produces vasomotor symptoms (hot flashes, night sweats) through thermoregulatory dysfunction in the hypothalamus, genitourinary syndrome of menopause (GSM: vaginal atrophy, dyspareunia, urinary symptoms), and accelerated bone loss (2-3% annually in the first 5-7 years post-menopause). Menopausal hormone therapy (MHT) remains the most effective treatment for vasomotor symptoms."
    },
    "riskFactors": [
      "Premature menopause (< 40 years) or early menopause (40-45 years)",
      "Surgical menopause (bilateral oophorectomy)",
      "Smoking (associated with earlier menopause by 1-2 years)",
      "Family history of early menopause",
      "Chemotherapy or pelvic radiation",
      "Autoimmune conditions (primary ovarian insufficiency)",
      "Low BMI and excessive exercise"
    ],
    "diagnostics": [
      "Clinical diagnosis in women >= 45 with 12 months amenorrhea (no labs needed)",
      "FSH level only indicated in women < 45 years or after hysterectomy",
      "Estradiol level if premature ovarian insufficiency suspected (< 73 pmol/L)",
      "TSH to rule out thyroid disease (symptoms overlap)",
      "Bone densitometry (DXA) at menopause or age 65",
      "Lipid panel and fasting glucose (cardiovascular risk increases post-menopause)"
    ],
    "management": [
      "First-line for moderate-severe VMS: systemic MHT (estrogen + progesterone if uterus intact)",
      "Transdermal estradiol 50-100 mcg/day preferred (lower VTE risk than oral)",
      "Add micronized progesterone 200mg x 12 days/month or continuous 100mg daily for endometrial protection",
      "For GSM alone: topical vaginal estrogen (estradiol cream or ring) without systemic progesterone",
      "Non-hormonal alternatives: venlafaxine 75mg, paroxetine 7.5mg, gabapentin, fezolinetant (NK3 antagonist)",
      "Initiate MHT within 10 years of menopause or before age 60 (timing hypothesis)",
      "Contraindications to MHT: breast cancer, VTE history, active liver disease, unexplained vaginal bleeding"
    ],
    "signs": {
      "left": [
        "Mild vasomotor symptoms manageable with lifestyle modifications",
        "Irregular cycles in perimenopause with no alarming bleeding patterns",
        "Mild GSM symptoms responsive to vaginal moisturizers",
        "Stable bone density on DXA"
      ],
      "right": [
        "Severe vasomotor symptoms: > 7 hot flashes/day disrupting sleep and function",
        "Severe GSM with recurrent UTIs and significant dyspareunia",
        "Rapid bone loss or fragility fracture",
        "Depression and cognitive complaints significantly impacting quality of life"
      ]
    },
    "medications": [
      {
        "name": "Estradiol transdermal patch (Estradot, Climara)",
        "type": "Bioidentical Estrogen",
        "action": "17-beta estradiol absorbed transdermally, bypassing first-pass hepatic metabolism; reduces vasomotor symptoms by restoring hypothalamic thermoregulatory function",
        "sideEffects": "Breast tenderness, headache, nausea, skin irritation at patch site, increased breast cancer risk with > 5 years use (E+P)",
        "contra": "History of breast cancer, active VTE or PE, active liver disease, unexplained vaginal bleeding, known thrombophilia",
        "pearl": "Transdermal route preferred over oral: does NOT increase VTE risk, does NOT increase triglycerides, safer hepatic profile. Start 50 mcg patch, titrate to symptom control. Rotate application sites. Must add progestogen if uterus intact."
      },
      {
        "name": "Micronized Progesterone (Prometrium)",
        "type": "Natural Progesterone",
        "action": "Progesterone receptor agonist that opposes estrogenic stimulation of endometrium, preventing endometrial hyperplasia; also has anxiolytic and sedative properties via GABA-A modulation",
        "sideEffects": "Drowsiness (take at bedtime - advantageous for insomnia), bloating, breast tenderness, mood changes",
        "contra": "Peanut allergy (capsule contains peanut oil), severe hepatic dysfunction, known breast cancer",
        "pearl": "Natural progesterone has better safety profile than synthetic progestins (MPA). Take at bedtime to use sedative effect therapeutically. 200mg x 12-14 days/month (cyclic) or 100mg continuous daily. KEEPS and E3N studies suggest lower breast cancer risk vs synthetic progestins."
      }
    ],
    "pearls": [
      "The timing hypothesis is critical for NP prescribing: MHT initiated within 10 years of menopause or before age 60 provides cardiovascular benefit, but initiation after this window may increase cardiovascular risk - the WHI results must be interpreted in this context",
      "Transdermal estradiol does NOT increase VTE risk (unlike oral estrogen) - for patients with VTE risk factors (obesity, smoking, FH), transdermal is the preferred route",
      "Vaginal estrogen therapy for GSM does not require concurrent progesterone and can be used long-term, even in breast cancer survivors (consult oncology) - systemic absorption is minimal at recommended doses"
    ],
    "quiz": [
      {
        "question": "A 53-year-old with 18 months amenorrhea reports 10 hot flashes/day disrupting sleep and work. BMI 32, hypertension, intact uterus. No personal or family history of breast cancer or VTE. What is the most appropriate treatment?",
        "options": [
          "Oral conjugated equine estrogen + medroxyprogesterone",
          "Transdermal estradiol patch + micronized progesterone",
          "Paroxetine 7.5mg daily",
          "Black cohosh supplement"
        ],
        "correct": 1,
        "rationale": "Severe vasomotor symptoms within 10 years of menopause = MHT indicated. Given obesity (VTE risk factor), transdermal estradiol is preferred over oral (no VTE risk increase). Micronized progesterone is preferred over synthetic MPA for endometrial protection (uterus intact) due to better safety profile. Non-hormonal options are second-line for this severity."
      }
    ]
  },
  "neuro-stroke-np": {
    "title": "Ischemic and Hemorrhagic Stroke",
    "cellular": {
      "title": "Cerebrovascular Pathophysiology",
      "content": "Ischemic stroke (87% of strokes) results from arterial occlusion by thrombosis or embolism, causing focal cerebral ischemia. The ischemic core becomes irreversibly damaged within minutes, but the surrounding penumbra remains viable for hours if perfusion is restored. Thrombotic stroke typically occurs in large vessels with atherosclerotic plaque rupture. Cardioembolic stroke originates from the heart (atrial fibrillation, LV thrombus, valvular disease). Lacunar stroke results from lipohyalinosis of small perforating arteries. Hemorrhagic stroke (13%) involves intracerebral hemorrhage (ICH, usually from hypertensive arteriolar rupture) or subarachnoid hemorrhage (SAH, from ruptured aneurysm). Time is brain: approximately 1.9 million neurons die per minute during untreated ischemic stroke. IV alteplase (tPA) within 4.5 hours and mechanical thrombectomy within 24 hours (large vessel occlusion with salvageable tissue) are evidence-based reperfusion strategies."
    },
    "riskFactors": [
      "Hypertension (strongest modifiable risk factor for both ischemic and hemorrhagic stroke)",
      "Atrial fibrillation (5-fold increased risk of cardioembolic stroke)",
      "Diabetes mellitus (2-fold increased risk)",
      "Dyslipidemia",
      "Tobacco smoking (2-fold risk, reversible with cessation)",
      "Carotid artery stenosis > 50%",
      "Previous TIA or stroke (highest risk for recurrence)"
    ],
    "diagnostics": [
      "Non-contrast CT head STAT (rules out hemorrhage before thrombolysis - door-to-CT < 25 min)",
      "CT angiography (CTA) of head and neck for large vessel occlusion assessment",
      "MRI with diffusion-weighted imaging (DWI) for small infarcts and posterior circulation",
      "CT perfusion to identify salvageable penumbra for thrombectomy decision",
      "ECG and telemetry for atrial fibrillation detection",
      "Echocardiogram (TTE +/- TEE) for cardioembolic source",
      "Carotid Doppler ultrasound for anterior circulation strokes"
    ],
    "management": [
      "FAST assessment: Face drooping, Arm weakness, Speech difficulty, Time to call emergency",
      "IV alteplase 0.9 mg/kg (max 90mg) within 4.5 hours of symptom onset (after CT rules out hemorrhage)",
      "Mechanical thrombectomy within 24 hours for large vessel occlusion with salvageable tissue",
      "Admit to stroke unit (reduces mortality by 20% compared to general ward)",
      "Anti-platelet therapy: ASA 160-325mg within 24-48 hours (NOT within 24h of tPA)",
      "BP management: permissive hypertension in acute ischemic stroke (< 220/120); lower in hemorrhagic",
      "Secondary prevention: anti-hypertensives, statin, anticoagulation for AF (CHADS2-VASc guided)"
    ],
    "signs": {
      "left": [
        "TIA: transient focal neurological deficit resolving within 24 hours",
        "Minor stroke with NIHSS < 5 and improving symptoms",
        "Lacunar syndrome: pure motor, pure sensory, or ataxic hemiparesis",
        "Alert with mild unilateral weakness"
      ],
      "right": [
        "NIHSS > 20: dense hemiplegia, gaze deviation, aphasia, decreased consciousness",
        "Signs of large vessel occlusion: gaze deviation, neglect, complete hemiplegia",
        "Hemorrhagic stroke: sudden severe headache, vomiting, rapid deterioration",
        "Herniation: unilateral pupil dilation, posturing, Cushing triad"
      ]
    },
    "medications": [
      {
        "name": "Alteplase (tPA)",
        "type": "Tissue Plasminogen Activator",
        "action": "Converts plasminogen to plasmin, which degrades fibrin clots, restoring cerebral blood flow in ischemic stroke",
        "sideEffects": "Intracranial hemorrhage (6-7% symptomatic ICH), systemic bleeding, angioedema (with concurrent ACE inhibitors)",
        "contra": "Active internal bleeding, recent surgery/trauma < 14 days, INR > 1.7, platelets < 100,000, BP > 185/110 despite treatment, ICH on CT",
        "pearl": "Door-to-needle time < 60 minutes is the target. 0.9 mg/kg (max 90mg): 10% bolus over 1 min, remainder over 60 min. No antiplatelet or anticoagulant for 24 hours post-tPA. Monitor q15min for 2h, then q30min for 6h, then hourly for 16h."
      },
      {
        "name": "Apixaban (Eliquis)",
        "type": "Direct Oral Anticoagulant (DOAC)",
        "action": "Selectively inhibits factor Xa preventing thrombin generation and clot formation; used for stroke prevention in non-valvular atrial fibrillation",
        "sideEffects": "Bleeding (GI, intracranial), bruising, anemia; reversal agent: andexanet alfa",
        "contra": "Active pathological bleeding, prosthetic heart valve (use warfarin), severe hepatic disease (Child-Pugh C)",
        "pearl": "5mg BID standard dose; 2.5mg BID if >= 2 of: age >= 80, weight <= 60kg, Cr >= 133 mcmol/L. ARISTOTLE trial showed superiority to warfarin: fewer strokes, less bleeding, lower mortality. No routine monitoring needed. Lower GI bleeding risk than rivaroxaban or dabigatran."
      }
    ],
    "pearls": [
      "Time is brain: every minute of untreated ischemic stroke destroys 1.9 million neurons - the clinician in primary care must recognize stroke symptoms immediately and activate emergency medical services without delay",
      "IV alteplase is effective up to 4.5 hours from symptom onset but benefit decreases with every minute of delay - the clinician should never order MRI before CT in acute stroke as CT is faster and sufficient to rule out hemorrhage",
      "CHA2DS2-VASc score guides anticoagulation for AF-related stroke prevention: score >= 2 in men or >= 3 in women = DOAC anticoagulation recommended; the clinician should calculate this for all AF patients"
    ],
    "quiz": [
      {
        "question": "A 68-year-old with atrial fibrillation presents 2 hours after sudden onset of right hemiplegia and expressive aphasia. Non-contrast CT shows no hemorrhage. BP 175/95. What is the immediate priority?",
        "options": [
          "MRI brain with diffusion-weighted imaging",
          "IV alteplase 0.9 mg/kg after lowering BP to < 185/110",
          "Start IV heparin drip",
          "Aspirin 325mg and admit to ward"
        ],
        "correct": 1,
        "rationale": "Acute ischemic stroke within 4.5-hour window with no hemorrhage on CT. BP 175/95 is below the 185/110 threshold for tPA. Immediate IV alteplase administration is the priority. Do not delay for MRI. Do not give antiplatelet or anticoagulant (wait 24h post-tPA). Door-to-needle target is < 60 minutes."
      }
    ]
  },
  "endo-diabetes-t1-t2-np": {
    "title": "Diabetes Mellitus Types 1 and 2",
    "cellular": {
      "title": "Insulin Physiology and Metabolic Derangement",
      "content": "Type 1 diabetes results from autoimmune destruction of pancreatic beta cells by CD4+ and CD8+ T lymphocytes, with autoantibodies (GAD65, IA-2, ZnT8, insulin antibodies) detectable months to years before clinical onset. This leads to absolute insulin deficiency requiring exogenous insulin for survival. Type 2 diabetes develops from progressive insulin resistance in skeletal muscle, liver, and adipose tissue, followed by beta cell dysfunction and relative insulin deficiency. The pathophysiology involves the 'ominous octet': decreased insulin secretion, increased glucagon, increased hepatic glucose output, increased lipolysis, decreased incretin effect, increased renal glucose reabsorption, neurotransmitter dysfunction, and decreased muscle glucose uptake. Chronic hyperglycemia causes microvascular complications (retinopathy, nephropathy, neuropathy) through polyol pathway activation, advanced glycation end-product (AGE) formation, protein kinase C activation, and hexosamine pathway flux. Macrovascular complications (CAD, CVD, PAD) result from accelerated atherosclerosis."
    },
    "riskFactors": [
      "T1D: family history (HLA-DR3, DR4), autoimmune conditions, Northern European descent",
      "T2D: obesity (BMI >= 30), physical inactivity, family history (first-degree relative)",
      "Gestational diabetes history (50% develop T2D within 10 years)",
      "Polycystic ovary syndrome",
      "Indigenous, South Asian, African, Hispanic ethnicity (2-6x higher T2D risk)",
      "Prediabetes (HbA1c 6.0-6.4%, FPG 6.1-6.9 mmol/L)",
      "Metabolic syndrome"
    ],
    "diagnostics": [
      "Fasting plasma glucose >= 7.0 mmol/L (confirmed on repeat)",
      "HbA1c >= 6.5% (48 mmol/mol) on two occasions",
      "2-hour OGTT plasma glucose >= 11.1 mmol/L",
      "Random plasma glucose >= 11.1 mmol/L with symptoms",
      "C-peptide level to distinguish T1D (low/absent) from T2D (normal/high initially)",
      "Autoantibody panel (GAD65, IA-2) if T1D suspected",
      "Annual screening: eGFR, uACR, dilated eye exam, foot exam, lipid panel"
    ],
    "management": [
      "T1D: basal-bolus insulin (MDI or insulin pump) with carb counting education",
      "T2D first-line: metformin + lifestyle modification (Diabetes Canada guidelines)",
      "T2D with ASCVD or high risk: add SGLT2 inhibitor (empagliflozin) or GLP-1 RA (liraglutide, semaglutide)",
      "T2D with CKD (eGFR 20-60): add SGLT2 inhibitor for nephroprotection",
      "T2D with HF: add SGLT2 inhibitor (dapagliflozin, empagliflozin - DAPA-HF, EMPEROR trials)",
      "HbA1c target: <= 7.0% for most adults; individualize for elderly/comorbid (7.1-8.5%)",
      "Diabetes self-management education and support (DSMES) referral"
    ],
    "signs": {
      "left": [
        "Well-controlled diabetes: HbA1c at target, no hypoglycemia",
        "Normal eGFR and uACR",
        "No retinopathy on dilated eye exam",
        "Intact protective sensation on monofilament testing"
      ],
      "right": [
        "DKA: hyperglycemia > 14 mmol/L, pH < 7.3, ketonemia, Kussmaul breathing (T1D emergency)",
        "Hyperosmolar hyperglycemic state: glucose > 33 mmol/L, serum osm > 320, no significant ketosis",
        "Proliferative retinopathy with vitreous hemorrhage",
        "Stage 4-5 CKD with proteinuria (diabetic nephropathy)"
      ]
    },
    "medications": [
      {
        "name": "Metformin",
        "type": "Biguanide",
        "action": "Decreases hepatic glucose production via AMPK activation, improves insulin sensitivity in skeletal muscle, reduces intestinal glucose absorption",
        "sideEffects": "GI intolerance (nausea, diarrhea, bloating - start low, titrate slowly), lactic acidosis (rare), vitamin B12 deficiency with long-term use",
        "contra": "eGFR < 30 mL/min (contraindicated), eGFR 30-45 (do not initiate, may continue at reduced dose), acute or chronic metabolic acidosis, decompensated HF",
        "pearl": "First-line for T2D (Diabetes Canada). Start 500mg daily with food, titrate to 1000mg BID over 4-6 weeks. Hold before iodinated contrast if eGFR < 45. Check B12 annually after 4 years of use."
      },
      {
        "name": "Empagliflozin (Jardiance)",
        "type": "SGLT2 Inhibitor",
        "action": "Inhibits sodium-glucose co-transporter 2 in proximal renal tubule, causing glycosuria (urinary glucose excretion 60-80g/day), reducing plasma glucose independent of insulin",
        "sideEffects": "Genital mycotic infections (candidiasis), UTI, volume depletion, euglycemic DKA (rare but serious), Fournier gangrene (very rare)",
        "contra": "eGFR < 20 (no glycemic benefit, but cardiorenal benefit may persist), T1D (DKA risk), recurrent UTI, active genital infection",
        "pearl": "EMPA-REG OUTCOME: 38% reduction in CV death. EMPEROR trials: HF benefit regardless of diabetes status. Cardiorenal protective effects independent of glucose lowering. Hold perioperatively (euglycemic DKA risk). Counsel on genital hygiene."
      }
    ],
    "pearls": [
      "SGLT2 inhibitors and GLP-1 RAs have cardiovascular and renal benefits INDEPENDENT of glucose lowering - the clinician should prescribe these agents based on comorbidities (ASCVD, HF, CKD) rather than HbA1c alone",
      "Euglycemic DKA is a rare but serious complication of SGLT2 inhibitors - glucose may be normal or mildly elevated; suspect in any SGLT2i patient with nausea, vomiting, and metabolic acidosis, and check serum ketones",
      "Diabetes Canada recommends HbA1c <= 7.0% for most adults, but the clinician must individualize targets: 7.1-8.0% for older adults with functional dependence, 8.0-8.5% for patients with limited life expectancy or hypoglycemia unawareness"
    ],
    "quiz": [
      {
        "question": "A 58-year-old with T2D, HbA1c 7.8%, BMI 34, eGFR 45, uACR 15 mg/mmol, and history of MI 2 years ago is on metformin 1000mg BID. What should the clinician add?",
        "options": [
          "Glyburide (sulfonylurea)",
          "Empagliflozin (SGLT2 inhibitor)",
          "Insulin glargine at bedtime",
          "Sitagliptin (DPP-4 inhibitor)"
        ],
        "correct": 1,
        "rationale": "This patient has established ASCVD (prior MI), CKD stage 3a (eGFR 45), and albuminuria. Diabetes Canada guidelines recommend adding an SGLT2 inhibitor for cardiovascular benefit (EMPA-REG) and nephroprotection (CREDENCE/DAPA-CKD). SGLT2i is preferred over other agents based on comorbidity profile, not just HbA1c."
      }
    ]
  },
  "endo-thyroid-np": {
    "title": "Thyroid Dysfunction",
    "cellular": {
      "title": "HPT Axis and Thyroid Hormone Metabolism",
      "content": "The hypothalamic-pituitary-thyroid (HPT) axis regulates thyroid hormone production through negative feedback. TRH from the hypothalamus stimulates TSH release from the anterior pituitary, which stimulates the thyroid gland to produce T4 (thyroxine, 80-90%) and T3 (triiodothyronine, 10-20%). T4 is the prohormone converted to active T3 by deiodinase enzymes (type 1 and 2) in peripheral tissues. T3 binds nuclear receptors regulating metabolism, thermogenesis, cardiac function, and neurodevelopment. Hypothyroidism (elevated TSH, low fT4) most commonly results from Hashimoto thyroiditis (autoimmune, anti-TPO positive) or iatrogenic causes (thyroidectomy, radioactive iodine, medications). Hyperthyroidism (suppressed TSH, elevated fT4/fT3) is most commonly caused by Graves disease (TSH receptor stimulating antibodies), toxic multinodular goitre, or toxic adenoma. Subclinical disease (abnormal TSH with normal fT4) requires careful NP decision-making regarding treatment thresholds."
    },
    "riskFactors": [
      "Female sex (5-8x higher incidence of thyroid disease)",
      "Family history of autoimmune thyroid disease",
      "Other autoimmune conditions (T1D, celiac disease, RA, vitiligo)",
      "Age > 60 years (subclinical hypothyroidism prevalence increases)",
      "Iodine excess or deficiency",
      "Previous thyroid surgery or radioactive iodine therapy",
      "Medications: amiodarone, lithium, interferon-alpha, checkpoint inhibitors"
    ],
    "diagnostics": [
      "TSH is the primary screening test (most sensitive indicator of thyroid dysfunction)",
      "Free T4 (fT4) ordered when TSH is abnormal",
      "Free T3 if hyperthyroidism suspected and fT4 is normal (T3 thyrotoxicosis)",
      "Anti-TPO antibodies for Hashimoto thyroiditis confirmation",
      "TSH receptor antibodies (TRAb) for Graves disease diagnosis",
      "Thyroid ultrasound for palpable nodules or goitre characterization",
      "Radioactive iodine uptake (RAIU) scan to differentiate hyperthyroidism causes"
    ],
    "management": [
      "Hypothyroidism: levothyroxine (LT4) 1.6 mcg/kg/day (start lower in elderly/cardiac patients)",
      "Take levothyroxine on empty stomach 30-60 min before breakfast or at bedtime",
      "Monitor TSH 6-8 weeks after dose changes, then every 6-12 months when stable",
      "Subclinical hypothyroidism: treat if TSH > 10 mIU/L or symptomatic with TSH 4.5-10",
      "Hyperthyroidism: methimazole (first-line antithyroid drug), RAI, or surgery",
      "Graves ophthalmopathy: refer to ophthalmology, smoking cessation essential",
      "Thyroid storm: ICU, PTU (blocks synthesis + peripheral conversion), beta-blocker, hydrocortisone"
    ],
    "signs": {
      "left": [
        "Subclinical hypothyroidism: mildly elevated TSH with normal fT4, minimal symptoms",
        "Subclinical hyperthyroidism: mildly suppressed TSH with normal fT4/fT3",
        "Small, non-tender goitre without obstructive symptoms",
        "Stable thyroid function on replacement therapy"
      ],
      "right": [
        "Severe hypothyroidism: myxedema, hypothermia, bradycardia, altered consciousness",
        "Thyroid storm: high fever, tachycardia > 140, delirium, jaundice, cardiovascular collapse",
        "Large goitre with compressive symptoms (dysphagia, stridor)",
        "Graves ophthalmopathy: proptosis, lid retraction, optic neuropathy"
      ]
    },
    "medications": [
      {
        "name": "Levothyroxine (Synthroid, Eltroxin)",
        "type": "Synthetic T4",
        "action": "Replaces endogenous T4 production, converted to active T3 by peripheral deiodinases; restores normal metabolic function",
        "sideEffects": "Hyperthyroidism symptoms if over-replaced (tachycardia, tremor, insomnia, bone loss), cardiac events in elderly if started at full dose",
        "contra": "Untreated adrenal insufficiency (replace cortisol first), acute MI (relative - start at very low dose)",
        "pearl": "Empty stomach, 30-60 min before food. Separate from calcium, iron, PPI by 4 hours. Full replacement: 1.6 mcg/kg/day. Start 25-50 mcg in elderly or cardiac patients. Check TSH at 6-8 weeks. Target TSH 0.5-2.5 mIU/L for most adults."
      },
      {
        "name": "Methimazole (Tapazole)",
        "type": "Thionamide Antithyroid Drug",
        "action": "Inhibits thyroid peroxidase (TPO), blocking iodine organification and coupling reactions, reducing thyroid hormone synthesis. Does NOT affect release of preformed hormones",
        "sideEffects": "Rash, GI upset, arthralgia, agranulocytosis (0.2-0.5% - EMERGENCY if fever/sore throat), hepatotoxicity, teratogenicity (first trimester)",
        "contra": "First trimester pregnancy (use PTU instead), previous methimazole-induced agranulocytosis",
        "pearl": "First-line antithyroid drug for Graves disease. Typical starting dose 10-30mg daily based on severity. Warn patients about agranulocytosis: seek immediate care for fever or sore throat. Check CBC if febrile. Takes 4-6 weeks for clinical effect as preformed hormone stores deplete."
      }
    ],
    "pearls": [
      "TSH is the single most important thyroid function test - the clinician should order TSH first and add fT4 only when TSH is abnormal; ordering fT4 with normal TSH rarely provides clinically useful information",
      "Levothyroxine absorption is significantly affected by concurrent medications and foods - the clinician must counsel patients to take it on empty stomach and separate from calcium, iron, and PPIs by at least 4 hours",
      "Agranulocytosis from methimazole is a medical emergency - the clinician must warn ALL patients on antithyroid drugs to immediately seek care for fever or sore throat and obtain urgent CBC with differential"
    ],
    "quiz": [
      {
        "question": "A 35-year-old woman presents with weight loss, palpitations, tremor, and diffuse goitre. TSH < 0.01, fT4 42 pmol/L (normal 12-22), positive TRAb. What is the first-line treatment?",
        "options": [
          "Levothyroxine",
          "Methimazole 20mg daily",
          "Immediate radioactive iodine therapy",
          "Propylthiouracil 100mg TID"
        ],
        "correct": 1,
        "rationale": "Graves disease confirmed by suppressed TSH, elevated fT4, positive TRAb, and diffuse goitre. First-line treatment is methimazole (not PTU, which is reserved for first trimester pregnancy and thyroid storm). Start 20mg daily with beta-blocker for symptomatic relief. Counsel about agranulocytosis risk. Monitor fT4 and TSH every 4-6 weeks."
      }
    ]
  },
  "msk-rheumatoid-arthritis-np": {
    "title": "Rheumatoid Arthritis",
    "cellular": {
      "title": "Autoimmune Synovial Inflammation",
      "content": "Rheumatoid arthritis (RA) is a chronic systemic autoimmune disease primarily affecting the synovial joints. Autoantibodies (rheumatoid factor and anti-citrullinated peptide antibodies/anti-CCP) form immune complexes that deposit in the synovium, activating complement and recruiting inflammatory cells. CD4+ T cells, macrophages, and fibroblast-like synoviocytes proliferate, creating the pannus - a destructive inflammatory tissue that invades cartilage and subchondral bone. Pro-inflammatory cytokines (TNF-alpha, IL-1, IL-6) drive joint destruction, while RANKL-mediated osteoclast activation causes periarticular erosions. RA characteristically presents as symmetric polyarthritis of small joints (MCP, PIP, wrist, MTP) with morning stiffness > 60 minutes. Extra-articular manifestations include rheumatoid nodules, interstitial lung disease, pericarditis, vasculitis, and Felty syndrome. Early aggressive treatment following the treat-to-target strategy (targeting remission or low disease activity) prevents irreversible joint destruction."
    },
    "riskFactors": [
      "Female sex (3:1 female to male ratio)",
      "Age 40-60 years (peak onset)",
      "First-degree relative with RA (3-5x increased risk)",
      "HLA-DR4 (shared epitope - strongest genetic risk)",
      "Cigarette smoking (strongest modifiable risk factor, also worsens disease severity)",
      "Obesity",
      "Periodontal disease (Porphyromonas gingivalis)"
    ],
    "diagnostics": [
      "RF (rheumatoid factor) - present in 60-80% of RA, but non-specific",
      "Anti-CCP antibodies - highly specific for RA (> 95%), positive early in disease",
      "ESR and CRP for inflammatory activity assessment",
      "CBC (normocytic anemia of chronic disease, thrombocytosis)",
      "Hand and foot radiographs (erosions, joint space narrowing)",
      "Ultrasound or MRI of affected joints for early synovitis detection",
      "ACR/EULAR 2010 classification criteria (score >= 6/10)"
    ],
    "management": [
      "Start DMARD within 3 months of symptom onset (early window of opportunity)",
      "Methotrexate 15-25mg weekly is first-line DMARD (CRA guidelines)",
      "Add folic acid 1mg daily (not on MTX day) to reduce MTX side effects",
      "If MTX insufficient at 3 months: add biologic DMARD (TNF inhibitor preferred first-line biologic)",
      "Treat-to-target: assess DAS28 or CDAI every 3 months, escalate until remission or low disease activity",
      "Short-term bridging: prednisone 10-15mg daily taper over 8-12 weeks",
      "Refer to rheumatology at first suspicion - do not wait for erosions"
    ],
    "signs": {
      "left": [
        "Early RA: symmetric MCP/PIP swelling and tenderness, morning stiffness > 60 min",
        "Positive squeeze test (MCP and MTP tenderness with lateral compression)",
        "Elevated CRP/ESR with positive anti-CCP",
        "Preserved joint space on radiograph (no erosions yet)"
      ],
      "right": [
        "Established RA: swan-neck and boutonniere deformities, ulnar deviation",
        "Joint erosions and subluxation on radiograph",
        "C1-C2 subluxation (atlantoaxial instability - cervical spine flexion-extension views before surgery)",
        "Extra-articular: rheumatoid nodules, ILD, scleritis, vasculitis"
      ]
    },
    "medications": [
      {
        "name": "Methotrexate",
        "type": "DMARD (Antimetabolite)",
        "action": "Inhibits dihydrofolate reductase reducing purine and pyrimidine synthesis; anti-inflammatory effects via adenosine release and inhibition of JAK/STAT signaling in immune cells",
        "sideEffects": "Hepatotoxicity, bone marrow suppression (pancytopenia), pneumonitis, GI upset, oral ulcers, teratogenicity (absolute contraindication in pregnancy)",
        "contra": "Pregnancy or planning pregnancy (stop 3 months before conception), severe hepatic or renal disease, active infection, immunodeficiency, excessive alcohol use",
        "pearl": "First-line DMARD for RA. Start 15mg weekly, titrate to 25mg. SC route has better bioavailability and fewer GI side effects than oral. Always co-prescribe folic acid 1mg daily (skip MTX day). Monitor CBC, LFTs, creatinine every 3 months."
      },
      {
        "name": "Adalimumab (Humira)",
        "type": "TNF-Alpha Inhibitor (Biologic DMARD)",
        "action": "Fully human monoclonal antibody that binds TNF-alpha, neutralizing its pro-inflammatory effects and reducing synovial inflammation, pannus formation, and bone erosion",
        "sideEffects": "Injection site reactions, increased infection risk (TB reactivation, invasive fungal infections), lymphoma risk (small increase), demyelinating disease, CHF exacerbation",
        "contra": "Active serious infection, untreated latent TB, moderate-severe CHF (NYHA III-IV), demyelinating disease, concurrent live vaccines",
        "pearl": "Screen for latent TB (TST or IGRA), hepatitis B and C before starting. 40mg SC every 2 weeks. Usually added to MTX for synergistic effect. CRA recommends biologic DMARD if MTX insufficient at 3 months. Biosimilars available at lower cost."
      }
    ],
    "pearls": [
      "The treat-to-target strategy in RA requires disease activity assessment (DAS28 or CDAI) every 3 months with therapy escalation until remission or low disease activity is achieved - the clinician must not accept moderate disease activity as adequate",
      "Anti-CCP antibody is 95% specific for RA and predicts erosive disease - a positive anti-CCP in a patient with inflammatory polyarthritis essentially confirms the diagnosis and indicates the need for aggressive early DMARD therapy",
      "Methotrexate must NEVER be prescribed without folic acid supplementation and regular monitoring (CBC, LFTs every 3 months) - the clinician should also ensure effective contraception in women of childbearing age and stop MTX 3 months before planned conception"
    ],
    "quiz": [
      {
        "question": "A 42-year-old woman presents with 3-month history of symmetric MCP and PIP joint swelling, morning stiffness lasting 2 hours, ESR 55, CRP 38, positive anti-CCP. Hand radiographs show periarticular osteopenia but no erosions. What is the most appropriate initial treatment?",
        "options": [
          "NSAIDs and reassess in 6 months",
          "Methotrexate 15mg weekly + folic acid 1mg daily",
          "Prednisone 40mg daily long-term",
          "Hydroxychloroquine monotherapy"
        ],
        "correct": 1,
        "rationale": "Early RA confirmed by symmetric inflammatory polyarthritis > 6 weeks, positive anti-CCP (highly specific), elevated inflammatory markers. CRA guidelines recommend methotrexate as first-line DMARD within 3 months of symptom onset. Folic acid must be co-prescribed. NSAIDs alone are insufficient and allow disease progression. Prednisone can be used as short-term bridge but not long-term monotherapy."
      }
    ]
  },
  "stress-hpa-axis-np": {
    "title": "HPA Axis and Stress Response",
    "cellular": {
      "title": "Neuroendocrine Stress Cascade",
      "content": "The hypothalamic-pituitary-adrenal (HPA) axis is the primary neuroendocrine stress response system. Physical or psychological stress activates paraventricular nucleus neurons in the hypothalamus to release corticotropin-releasing hormone (CRH) and arginine vasopressin (AVP). CRH stimulates corticotroph cells in the anterior pituitary to secrete adrenocorticotropic hormone (ACTH). ACTH acts on the zona fasciculata of the adrenal cortex to produce cortisol. Cortisol exerts widespread metabolic effects: gluconeogenesis (raising blood glucose), protein catabolism (muscle wasting), lipolysis (redistribution of fat), anti-inflammatory and immunosuppressive effects, and maintenance of vascular tone. Cortisol feeds back negatively on the hypothalamus and pituitary to terminate the stress response. Chronic stress disrupts this feedback, leading to sustained cortisol elevation, hippocampal neuronal damage (impairing memory), immunosuppression, metabolic syndrome, and cardiovascular disease. The clinician must recognize the clinical consequences of chronic HPA axis dysregulation."
    },
    "riskFactors": [
      "Adverse childhood experiences (ACEs) - permanent HPA axis dysregulation",
      "Chronic psychological stress (work, caregiving, financial)",
      "Post-traumatic stress disorder",
      "Chronic pain syndromes",
      "Sleep deprivation and shift work",
      "Major depressive disorder",
      "Substance use disorders"
    ],
    "diagnostics": [
      "24-hour urinary free cortisol (UFC) for suspected Cushing syndrome",
      "Late-night salivary cortisol (elevated in Cushing - loss of diurnal rhythm)",
      "1mg overnight dexamethasone suppression test (cortisol > 50 nmol/L = non-suppression)",
      "Morning serum cortisol and ACTH (low cortisol + low ACTH = secondary adrenal insufficiency)",
      "ACTH stimulation test (cosyntropin 250 mcg IV - cortisol should rise > 500 nmol/L)",
      "Screen for metabolic consequences: fasting glucose, HbA1c, lipid panel, BMI"
    ],
    "management": [
      "Identify and address chronic stressors through comprehensive psychosocial assessment",
      "Prescribe evidence-based stress reduction: CBT, mindfulness-based stress reduction (MBSR)",
      "Promote sleep hygiene to restore diurnal cortisol rhythm (7-9 hours per night)",
      "Regular physical activity 150 min/week (reduces cortisol and improves HPA axis regulation)",
      "Screen for and treat comorbid depression/anxiety (PHQ-9, GAD-7)",
      "Monitor metabolic parameters in chronic stress patients (glucose, BP, lipids, weight)",
      "Gradual corticosteroid taper for iatrogenic adrenal suppression (never abrupt discontinuation)"
    ],
    "signs": {
      "left": [
        "Appropriate acute stress response with recovery to baseline",
        "Normal diurnal cortisol pattern (high AM, low PM)",
        "Effective coping strategies and social support",
        "No metabolic or psychological complications"
      ],
      "right": [
        "Cushing syndrome: moon facies, central obesity, striae, proximal myopathy, hypertension",
        "Adrenal crisis: hypotension, hyponatremia, hyperkalemia, hypoglycemia, altered consciousness",
        "Burnout: emotional exhaustion, depersonalization, reduced accomplishment",
        "PTSD: hypervigilance, flashbacks, insomnia, exaggerated startle"
      ]
    },
    "medications": [
      {
        "name": "Hydrocortisone",
        "type": "Glucocorticoid (Physiological Replacement)",
        "action": "Replaces deficient cortisol in adrenal insufficiency; mimics physiological diurnal cortisol rhythm when given in divided doses",
        "sideEffects": "Weight gain, hyperglycemia, osteoporosis, immunosuppression, adrenal atrophy with chronic supraphysiological doses",
        "contra": "Active systemic infection without appropriate antibiotic coverage (relative), live vaccines during immunosuppressive doses",
        "pearl": "Physiological replacement: 15-25mg daily in divided doses (10mg AM, 5mg noon, 5mg evening). Stress dosing: double or triple dose during illness. Patients must carry steroid alert card and emergency injection kit. NEVER stop abruptly after chronic use."
      },
      {
        "name": "Sertraline (Zoloft)",
        "type": "Selective Serotonin Reuptake Inhibitor",
        "action": "Blocks serotonin reuptake in synaptic cleft increasing serotonergic neurotransmission; modulates HPA axis hyperactivity in depression and PTSD",
        "sideEffects": "Nausea, sexual dysfunction, insomnia/drowsiness, serotonin syndrome (with MAOIs), increased suicidal ideation in < 25 years",
        "contra": "Concurrent MAOIs (14-day washout), concurrent pimozide",
        "pearl": "First-line pharmacotherapy for PTSD and comorbid depression/anxiety. Start 50mg daily, titrate to 100-200mg. Therapeutic effect takes 4-6 weeks. Do not discontinue abruptly (taper over 2-4 weeks). Monitor for suicidal ideation in first weeks, especially in young adults."
      }
    ],
    "pearls": [
      "Chronic HPA axis activation from sustained stress leads to the same metabolic consequences as exogenous glucocorticoid therapy - central obesity, insulin resistance, hypertension, and immunosuppression - the clinician must screen chronically stressed patients for metabolic syndrome",
      "Adrenal crisis is a medical emergency that occurs when patients with adrenal insufficiency (or chronic corticosteroid users) face physiological stress without adequate cortisol replacement - the clinician must educate all patients on chronic steroids about sick-day rules and emergency injection",
      "The clinician should screen all patients with chronic pain, insomnia, or unexplained metabolic syndrome for psychosocial stressors and adverse childhood experiences (ACEs) - addressing the root cause of HPA axis dysregulation is more effective than treating individual metabolic consequences"
    ],
    "quiz": [
      {
        "question": "A patient on prednisone 20mg daily for 8 months for polymyalgia rheumatica develops gastroenteritis with vomiting and cannot take oral medications. What is the priority NP action?",
        "options": [
          "Advise to skip prednisone until vomiting resolves",
          "Administer IM/IV hydrocortisone 100mg STAT (stress dose)",
          "Switch to a different oral corticosteroid",
          "Prescribe ondansetron and continue oral prednisone"
        ],
        "correct": 1,
        "rationale": "After 8 months of prednisone, the HPA axis is suppressed. Physiological stress (gastroenteritis) increases cortisol demand but the adrenals cannot respond. Unable to take oral medication = cannot take prednisone = adrenal crisis risk. Immediate parenteral stress-dose corticosteroid (hydrocortisone 100mg IM/IV) is required to prevent cardiovascular collapse."
      }
    ]
  },
  "msk-osteoarthritis-gout-np": {
    "title": "OA, Gout, and Crystal Arthropathies",
    "cellular": {
      "title": "Degenerative",
      "content": "Osteoarthritis (OA) is the most common joint disease, resulting from progressive loss of articular cartilage with secondary bony changes. Mechanical stress and inflammatory mediators (IL-1, TNF-alpha, MMPs) cause chondrocyte apoptosis and extracellular matrix degradation. Subchondral bone sclerosis, osteophyte formation, and synovial inflammation follow. OA characteristically affects weight-bearing joints (knees, hips) and DIP/PIP joints (Heberden and Bouchard nodes). Gout is a crystal arthropathy caused by monosodium urate (MSU) crystal deposition in joints when serum uric acid exceeds the saturation threshold (> 408 mcmol/L). MSU crystals activate the NLRP3 inflammasome in macrophages, triggering IL-1-beta release and intense neutrophilic inflammation. The first MTP joint (podagra) is the most common site. Pseudogout (calcium pyrophosphate deposition disease, CPPD) presents similarly but with calcium pyrophosphate crystals, typically affecting knees and wrists."
    },
    "riskFactors": [
      "OA: age > 50, obesity, prior joint injury, repetitive occupational stress, female sex",
      "OA: malalignment (varus/valgus), genetic predisposition",
      "Gout: hyperuricemia (serum urate > 408 mcmol/L)",
      "Gout: male sex, alcohol (especially beer), high-purine diet (red meat, shellfish)",
      "Gout: thiazide or loop diuretics, low-dose ASA",
      "Gout: CKD (reduced urate excretion)",
      "CPPD: age > 60, hemochromatosis, hyperparathyroidism, hypomagnesemia"
    ],
    "diagnostics": [
      "OA: clinical diagnosis (no labs needed); XR: joint space narrowing, osteophytes, subchondral sclerosis, cysts",
      "Gout: serum uric acid (may be normal during acute attack), joint aspiration showing negatively birefringent needle-shaped MSU crystals",
      "CPPD: joint aspiration showing weakly positively birefringent rhomboid crystals; XR: chondrocalcinosis",
      "Inflammatory markers (ESR, CRP) elevated in gout/CPPD, normal in OA",
      "Renal function (eGFR) before starting urate-lowering therapy",
      "Dual-energy CT for tophaceous gout if aspiration not feasible"
    ],
    "management": [
      "OA: weight loss (5% reduction decreases knee pain by 50%), exercise, physiotherapy",
      "OA pharmacotherapy: acetaminophen first-line, topical NSAIDs (diclofenac), oral NSAIDs short-term",
      "OA refractory: intra-articular corticosteroid injection, consider joint replacement referral",
      "Acute gout: colchicine 1.2mg then 0.6mg 1 hour later (within 36h of onset) OR NSAID (naproxen, indomethacin)",
      "Acute gout if NSAID/colchicine contraindicated: prednisone 30-40mg daily x 5 days",
      "ULT: allopurinol start 100mg daily, titrate to target urate < 360 mcmol/L (or < 300 if tophi)",
      "Start ULT with colchicine 0.6mg daily prophylaxis for 6 months to prevent mobilization flares"
    ],
    "signs": {
      "left": [
        "OA: mechanical joint pain worsening with activity, improving with rest",
        "OA: brief morning stiffness < 30 minutes, bony enlargement",
        "Gout: intermittent monoarticular attacks with asymptomatic intercritical periods",
        "Mild hyperuricemia without joint symptoms"
      ],
      "right": [
        "OA: severe functional limitation requiring joint replacement consideration",
        "Gout: polyarticular attacks, tophaceous deposits, chronic gouty arthropathy",
        "Gout: urate nephropathy with CKD progression",
        "Septic arthritis: must always be excluded in acute monoarthritis (joint aspiration mandatory)"
      ]
    },
    "medications": [
      {
        "name": "Allopurinol",
        "type": "Xanthine Oxidase Inhibitor",
        "action": "Inhibits xanthine oxidase, the enzyme converting hypoxanthine to xanthine and xanthine to uric acid, reducing serum and urinary urate levels",
        "sideEffects": "Rash (including severe: SJS/TEN - check HLA-B*5801 in high-risk populations), GI upset, hepatotoxicity, allopurinol hypersensitivity syndrome (rare, fatal)",
        "contra": "Previous severe allopurinol hypersensitivity reaction, HLA-B*5801 positive (screen Southeast Asian, Korean, African American patients before prescribing)",
        "pearl": "Start LOW (100mg daily), titrate slowly (increase by 100mg every 2-4 weeks) to target urate < 360 mcmol/L. Start with colchicine prophylaxis to prevent flares. Screen HLA-B*5801 in at-risk populations before prescribing. Do NOT start during acute attack."
      },
      {
        "name": "Colchicine",
        "type": "Anti-Inflammatory (Mitotic Inhibitor)",
        "action": "Binds tubulin disrupting microtubule assembly, inhibiting neutrophil chemotaxis, adhesion, and NLRP3 inflammasome activation, reducing crystal-induced inflammation",
        "sideEffects": "Diarrhea (dose-limiting), nausea, vomiting, abdominal cramps, bone marrow suppression at high doses, myopathy/neuropathy with renal impairment",
        "contra": "Severe renal impairment (eGFR < 10 - absolute; reduce dose if eGFR < 30), concurrent strong CYP3A4 inhibitors (clarithromycin, cyclosporine), severe hepatic impairment",
        "pearl": "For acute gout: 1.2mg then 0.6mg 1h later (within 36h of onset). For ULT prophylaxis: 0.6mg once or twice daily for 6 months. Low-dose regimen is as effective and much safer than traditional high-dose protocols. Reduce dose in renal impairment and with statin co-administration (myopathy risk)."
      }
    ],
    "pearls": [
      "Serum uric acid may be NORMAL during an acute gout attack due to acute-phase response-mediated uricosuria - a normal urate during an attack does NOT exclude gout; recheck 2-4 weeks after resolution for true baseline",
      "Allopurinol must be started at low dose (100mg) and titrated slowly with colchicine prophylaxis - starting at full dose or without prophylaxis triggers mobilization flares that discourage patients from continuing essential urate-lowering therapy",
      "HLA-B*5801 screening before allopurinol is mandatory in Southeast Asian, Korean, and African American patients - positive carriers have a 5-6% risk of severe allopurinol hypersensitivity syndrome (SJS/TEN) which is potentially fatal"
    ],
    "quiz": [
      {
        "question": "A 62-year-old man presents with acute onset severe pain, redness, and swelling of the left first MTP joint. He has CKD stage 3 (eGFR 38). Serum urate is 385 mcmol/L. What is the most appropriate acute management?",
        "options": [
          "Indomethacin 50mg TID",
          "Colchicine 1.2mg then 0.6mg in 1 hour",
          "Prednisone 30mg daily x 5 days",
          "Start allopurinol 300mg daily"
        ],
        "correct": 2,
        "rationale": "Acute podagra presentation. CKD stage 3 is a relative contraindication to NSAIDs (nephrotoxic). Colchicine requires dose reduction with eGFR < 30 but can be used at eGFR 38 with the low-dose protocol. However, prednisone 30mg x 5 days is the safest option in CKD and is equally effective. Normal urate (385) during acute attack does NOT exclude gout. NEVER start allopurinol during acute attack."
      }
    ]
  },
  "mens-health-testosterone-np": {
    "title": "Testosterone Deficiency and Hypogonadism",
    "cellular": {
      "title": "Hypothalamic-Pituitary-Gonadal Axis",
      "content": "Male hypogonadism results from insufficient testosterone production due to testicular failure (primary) or hypothalamic-pituitary dysfunction (secondary). The hypothalamus secretes GnRH in pulsatile fashion, stimulating anterior pituitary gonadotrophs to release LH and FSH. LH acts on Leydig cells to produce testosterone via cholesterol conversion through the steroidogenic pathway. Testosterone exerts negative feedback on both hypothalamus and pituitary. Primary hypogonadism (hypergonadotropic) shows low testosterone with elevated LH/FSH, as seen in Klinefelter syndrome, orchitis, or testicular injury. Secondary hypogonadism (hypogonadotropic) shows low testosterone with low or inappropriately normal LH/FSH, caused by pituitary adenoma, hyperprolactinemia, obesity, opioid use, or exogenous androgen abuse. Diagnosis requires two morning fasting total testosterone samples below 8 nmol/L drawn before 1000, as testosterone exhibits diurnal variation with peak levels in early morning."
    },
    "riskFactors": [
      "Obesity (BMI > 30 kg/m2) - adipose aromatase converts testosterone to estradiol",
      "Type 2 diabetes mellitus (up to 50% prevalence of low testosterone)",
      "Chronic opioid use (suppresses GnRH pulsatility)",
      "Obstructive sleep apnea",
      "Chronic glucocorticoid therapy",
      "HIV infection and antiretroviral therapy",
      "Age > 40 years (testosterone declines approximately 1-2% per year after age 30)"
    ],
    "diagnostics": [
      "Two fasting morning (0700-1000) total testosterone levels < 8 nmol/L",
      "Free testosterone by equilibrium dialysis if total T borderline (8-12 nmol/L)",
      "LH and FSH to differentiate primary vs secondary hypogonadism",
      "Prolactin level (elevated in prolactinoma causing secondary hypogonadism)",
      "CBC (baseline before testosterone replacement - monitor hematocrit)",
      "PSA baseline before initiating testosterone replacement therapy"
    ],
    "management": [
      "Confirm diagnosis with two AM fasting testosterone samples before treatment",
      "Address reversible causes: weight loss, opioid reduction, sleep apnea treatment",
      "Testosterone replacement: topical gel (1% testosterone 5-10g daily) or IM testosterone cypionate (100-200mg every 2 weeks)",
      "Monitor testosterone level, hematocrit, and PSA at 3-6 months then annually",
      "Hold therapy if hematocrit exceeds 0.54 (polycythemia risk)",
      "Counsel on fertility: exogenous testosterone suppresses spermatogenesis - refer for sperm banking if future fertility desired",
      "Cardiovascular risk discussion: conflicting evidence on testosterone and CV events - individualize risk-benefit"
    ],
    "signs": {
      "left": [
        "Fatigue, decreased libido, mild erectile dysfunction",
        "Reduced muscle mass with increased central adiposity",
        "Depressed mood and poor concentration",
        "Decreased bone mineral density on DXA"
      ],
      "right": [
        "Severe osteoporosis with fragility fracture",
        "Hematocrit > 0.54 on testosterone replacement (polycythemia)",
        "Pituitary macroadenoma with visual field defects (secondary hypogonadism)",
        "Gynecomastia with elevated estradiol suggesting aromatization"
      ]
    },
    "medications": [
      {
        "name": "Testosterone Cypionate (Depo-Testosterone)",
        "type": "Intramuscular Androgen Replacement",
        "action": "Exogenous testosterone ester providing sustained androgen release from IM depot, restoring physiological testosterone levels and androgen receptor activation in target tissues",
        "sideEffects": "Polycythemia (dose-limiting), acne, injection site pain, gynecomastia, testicular atrophy, suppression of spermatogenesis, sleep apnea worsening",
        "contra": "Breast or prostate cancer, hematocrit > 0.54, untreated severe OSA, uncontrolled heart failure, desire for fertility (suppresses spermatogenesis)",
        "pearl": "100-200mg IM every 2 weeks. Check trough testosterone midway between injections. Monitor hematocrit at 3, 6, 12 months then annually. If hematocrit > 0.54, hold therapy or reduce dose. Counsel that exogenous testosterone is a male contraceptive."
      },
      {
        "name": "Testosterone Gel 1% (AndroGel)",
        "type": "Topical Androgen Replacement",
        "action": "Transdermal testosterone absorption through skin providing more physiological steady-state testosterone levels compared to injectable formulations",
        "sideEffects": "Skin irritation at application site, transfer risk to women and children through skin contact, acne, polycythemia",
        "contra": "Same as injectable: prostate/breast cancer, polycythemia, severe OSA, heart failure; women and children must avoid contact with application site",
        "pearl": "Apply 5-10g daily to shoulders, upper arms, or abdomen (not genitals). Allow to dry completely before skin contact with others. Wash hands thoroughly after application. Check testosterone 2-8 hours after application. More physiological levels but transfer risk is a significant concern."
      }
    ],
    "pearls": [
      "Two morning fasting testosterone samples below 8 nmol/L are required for diagnosis - a single low value may reflect acute illness, sleep deprivation, or diurnal variation and is insufficient to initiate lifelong replacement therapy",
      "Exogenous testosterone suppresses the HPG axis and abolishes spermatogenesis - the clinician must counsel all men of reproductive age about this effect and offer sperm cryopreservation before starting therapy",
      "Hematocrit monitoring is the most critical safety parameter on testosterone replacement - polycythemia (Hct > 0.54) increases thromboembolic risk and requires dose reduction or therapy discontinuation"
    ],
    "quiz": [
      {
        "question": "A 48-year-old obese man with type 2 diabetes reports fatigue, low libido, and erectile dysfunction. His morning fasting total testosterone is 7.2 nmol/L. What is the next step?",
        "options": [
          "Start testosterone cypionate 200mg IM every 2 weeks immediately",
          "Repeat fasting morning total testosterone on a separate day to confirm",
          "Order semen analysis and refer to fertility clinic",
          "Prescribe sildenafil 50mg PRN"
        ],
        "correct": 1,
        "rationale": "Diagnosis of hypogonadism requires confirmation with two separate morning fasting testosterone samples below 8 nmol/L. A single low value is insufficient due to potential confounders including acute illness, diurnal variation, and assay variability. Once confirmed, LH/FSH should be ordered to classify as primary vs secondary before initiating replacement."
      }
    ]
  },
  "mens-health-prostatitis-np": {
    "title": "Prostatitis Syndromes",
    "cellular": {
      "title": "Prostatic Inflammation",
      "content": "Prostatitis encompasses four categories: acute bacterial (Category I), chronic bacterial (Category II), chronic prostatitis/chronic pelvic pain syndrome (CP/CPPS, Category III), and asymptomatic inflammatory (Category IV). Acute bacterial prostatitis results from ascending urethral infection or hematogenous seeding, most commonly by E. coli, Klebsiella, or Pseudomonas. Bacteria colonize the prostatic ductal system, triggering neutrophilic infiltration, glandular destruction, and prostatic abscess formation in severe cases. Chronic bacterial prostatitis involves persistent bacterial biofilm within prostatic calculi or ductal epithelium, causing recurrent UTIs. CP/CPPS (90% of prostatitis cases) involves neurogenic inflammation, pelvic floor muscle dysfunction, and central pain sensitization without identifiable bacterial infection. Prostatic inflammation increases PSA levels and may mimic prostate cancer on screening."
    },
    "riskFactors": [
      "Recent urinary tract instrumentation or catheterization",
      "Sexually transmitted infections (Chlamydia, Gonorrhea in men < 35)",
      "BPH with urinary stasis",
      "Unprotected anal intercourse",
      "Chronic pelvic floor tension and stress (CP/CPPS)",
      "Previous episodes of prostatitis (recurrence rate 20-50%)"
    ],
    "diagnostics": [
      "Urinalysis and urine culture (midstream clean-catch)",
      "Pre- and post-prostatic massage urine cultures (Meares-Stamey 4-glass test or 2-glass pre/post massage)",
      "CBC with differential (leukocytosis in acute bacterial prostatitis)",
      "PSA (often elevated in acute prostatitis - defer cancer screening until resolved)",
      "Digital rectal exam: boggy, tender, warm prostate in acute; avoid vigorous massage in acute (bacteremia risk)",
      "Transrectal ultrasound if prostatic abscess suspected"
    ],
    "management": [
      "Acute bacterial: ciprofloxacin 500mg BID or TMP-SMX DS BID x 4-6 weeks (fluoroquinolone penetrates prostate well)",
      "Hospitalize if septic: IV ampicillin + gentamicin or IV fluoroquinolone",
      "Chronic bacterial: fluoroquinolone x 6-12 weeks for biofilm eradication",
      "CP/CPPS: multimodal approach - alpha-blocker (tamsulosin), NSAIDs, pelvic floor physiotherapy",
      "Trial of doxycycline 100mg BID x 4-6 weeks if atypical organism suspected",
      "Stress management and cognitive behavioural therapy for CP/CPPS",
      "Avoid prostatic massage in acute bacterial prostatitis (risk of bacteremia)"
    ],
    "signs": {
      "left": [
        "Chronic intermittent perineal or pelvic discomfort without fever",
        "Mildly tender prostate on DRE without systemic signs",
        "Recurrent positive post-massage urine cultures",
        "Pelvic floor muscle tenderness on exam (CP/CPPS)"
      ],
      "right": [
        "Acute bacterial: high fever, chills, severe perineal pain, dysuria, urinary retention",
        "Sepsis: tachycardia, hypotension, altered mental status",
        "Prostatic abscess: fluctuant mass on DRE, persistent fever despite antibiotics",
        "Urinary retention requiring catheterization"
      ]
    },
    "medications": [
      {
        "name": "Ciprofloxacin",
        "type": "Fluoroquinolone Antibiotic",
        "action": "Inhibits bacterial DNA gyrase and topoisomerase IV, disrupting DNA replication; achieves high intraprostatic concentrations due to lipophilic penetration of prostatic epithelium",
        "sideEffects": "Tendon rupture (especially Achilles, risk increased with corticosteroids and age > 60), QT prolongation, C. difficile colitis, peripheral neuropathy, aortic dissection risk",
        "contra": "Concurrent tizanidine or theophylline, myasthenia gravis (may exacerbate), history of tendon disorder with fluoroquinolone use, prolonged QT interval",
        "pearl": "500mg BID x 4-6 weeks for acute bacterial prostatitis (longer courses needed due to poor prostatic penetration of most antibiotics). Health Canada black box: reserve for infections without alternative. Check drug interactions - inhibits CYP1A2. Avoid in patients > 60, on corticosteroids, or with renal transplant."
      },
      {
        "name": "Tamsulosin (Flomax)",
        "type": "Alpha-1A Adrenergic Blocker",
        "action": "Relaxes smooth muscle in prostatic urethra and bladder neck, reducing obstructive voiding symptoms and theoretically improving prostatic duct drainage",
        "sideEffects": "Orthostatic hypotension, retrograde ejaculation, dizziness, nasal congestion, floppy iris syndrome",
        "contra": "Planned cataract surgery (inform ophthalmologist), concurrent PDE5 inhibitor use requires dose adjustment",
        "pearl": "0.4mg daily 30 minutes after a meal. Used adjunctively in prostatitis for obstructive symptom relief. Particularly beneficial in CP/CPPS where pelvic floor dysfunction and bladder neck dyssynergia contribute to symptoms. Trial of 6-12 weeks recommended before assessing efficacy."
      }
    ],
    "pearls": [
      "Never perform vigorous prostatic massage in suspected acute bacterial prostatitis - this can precipitate bacteremia and sepsis; gentle DRE is acceptable for diagnostic purposes only",
      "PSA is commonly elevated during acute prostatitis and should NOT be used for prostate cancer screening during active infection - recheck PSA 6-8 weeks after treatment completion for accurate interpretation",
      "CP/CPPS accounts for 90% of prostatitis cases and requires a multimodal approach (alpha-blocker + pelvic floor physiotherapy + stress management) rather than repeated antibiotic courses which provide no benefit in the absence of documented infection"
    ],
    "quiz": [
      {
        "question": "A 38-year-old presents with fever 39.2 degrees Celsius, severe perineal pain, dysuria, and frequency for 2 days. DRE reveals a boggy, exquisitely tender prostate. Urinalysis shows pyuria and bacteriuria. What is the most appropriate management?",
        "options": [
          "Vigorous prostatic massage to obtain expressed prostatic secretions for culture",
          "Ciprofloxacin 500mg BID for 4-6 weeks",
          "Tamsulosin 0.4mg daily alone",
          "Doxycycline 100mg BID for 7 days"
        ],
        "correct": 1,
        "rationale": "Acute bacterial prostatitis requires prolonged fluoroquinolone therapy (4-6 weeks) to penetrate prostatic tissue and eradicate infection. Ciprofloxacin achieves high intraprostatic concentrations. Vigorous prostatic massage is contraindicated in acute prostatitis due to bacteremia risk. Short-course antibiotics are insufficient for prostatic infections. Tamsulosin may be added adjunctively but is not primary treatment."
      }
    ]
  },
  "mens-health-infertility-np": {
    "title": "Male Infertility",
    "cellular": {
      "title": "Spermatogenesis Disruption",
      "content": "Spermatogenesis occurs within seminiferous tubules of the testes over a 74-day cycle, regulated by the HPG axis. FSH acts on Sertoli cells to support spermatid maturation and produce inhibin B (which provides negative feedback to FSH secretion). LH stimulates Leydig cells to produce testosterone, which is essential for spermatogenesis at high intratesticular concentrations (50-100 times serum levels). Disruption at any level impairs fertility. Pre-testicular causes include hypothalamic-pituitary disorders (hypogonadotropic hypogonadism, hyperprolactinemia), exogenous testosterone or anabolic steroid use (which suppresses FSH/LH via negative feedback, ablating spermatogenesis). Testicular causes include varicocele (present in 40% of infertile men, causing testicular hyperthermia and oxidative stress), Klinefelter syndrome (47,XXY), cryptorchidism, and gonadotoxic chemotherapy. Post-testicular causes include obstructive azoospermia from vasectomy, cystic fibrosis (congenital bilateral absence of vas deferens), or ejaculatory duct obstruction."
    },
    "riskFactors": [
      "Varicocele (most common correctable cause, present in 40% of infertile men)",
      "Exogenous testosterone or anabolic steroid use (suppresses spermatogenesis)",
      "History of cryptorchidism (even after orchiopexy)",
      "Prior chemotherapy or pelvic radiation",
      "Medications: SSRIs, sulfasalazine, calcium channel blockers, alpha-blockers (retrograde ejaculation)",
      "Chronic heat exposure to testes (hot tubs, laptops, tight clothing)",
      "Tobacco smoking and heavy alcohol use"
    ],
    "diagnostics": [
      "Semen analysis (WHO 2021): volume >= 1.5 mL, concentration >= 16 million/mL, total motility >= 42%, normal morphology >= 4%",
      "Repeat semen analysis in 2-3 months if abnormal (one cycle of spermatogenesis = 74 days)",
      "Hormonal panel: FSH, LH, total testosterone, prolactin",
      "Scrotal ultrasound (varicocele detection, testicular volume assessment)",
      "Karyotype if severe oligospermia or azoospermia (Klinefelter screening)",
      "Post-ejaculatory urinalysis if low volume (retrograde ejaculation)"
    ],
    "management": [
      "Discontinue gonadotoxic medications and exogenous testosterone (recovery may take 6-12 months)",
      "Varicocelectomy referral for clinical varicocele with abnormal semen parameters",
      "Clomiphene citrate 25-50mg daily (off-label) for hypogonadotropic hypogonadism to stimulate endogenous FSH/LH",
      "hCG injections for hypogonadotropic hypogonadism to restore intratesticular testosterone",
      "Lifestyle optimization: weight loss, smoking cessation, limit alcohol, avoid testicular heat exposure",
      "Refer to reproductive endocrinology/urology if no improvement after 6 months of intervention",
      "Discuss assisted reproductive technologies (IUI, IVF, ICSI) with partner"
    ],
    "signs": {
      "left": [
        "Mild oligospermia with normal hormonal panel",
        "Small clinical varicocele with mildly abnormal semen parameters",
        "Recent medication exposure as identifiable reversible cause",
        "Normal testicular volume (15-25 mL) and consistency"
      ],
      "right": [
        "Azoospermia (absent sperm) requiring testicular biopsy vs obstruction evaluation",
        "Elevated FSH > 2x upper limit (suggests severe spermatogenic failure)",
        "Bilateral small firm testes (< 12 mL) suggesting Klinefelter syndrome",
        "Hypogonadotropic hypogonadism with anosmia (Kallmann syndrome)"
      ]
    },
    "medications": [
      {
        "name": "Clomiphene Citrate (off-label for male infertility)",
        "type": "Selective Estrogen Receptor Modulator (SERM)",
        "action": "Blocks estrogen negative feedback at hypothalamus and pituitary, increasing GnRH pulsatility and stimulating FSH/LH release, which enhances intratesticular testosterone and spermatogenesis",
        "sideEffects": "Visual disturbances (stop if occurs), mood changes, gynecomastia, headache, weight gain",
        "contra": "Pituitary tumour, severe hepatic disease, undiagnosed abnormal uterine bleeding (in women)",
        "pearl": "25-50mg daily or every other day for male hypogonadotropic hypogonadism with infertility. Off-label but widely used in male reproductive medicine. Increases endogenous testosterone WITHOUT suppressing spermatogenesis (unlike exogenous testosterone). Monitor testosterone and semen analysis at 3-month intervals."
      },
      {
        "name": "Human Chorionic Gonadotropin (hCG)",
        "type": "LH Analogue",
        "action": "Mimics LH action on Leydig cells, stimulating intratesticular testosterone production necessary for spermatogenesis without suppressing pituitary FSH secretion",
        "sideEffects": "Injection site reactions, gynecomastia, headache, fluid retention, mood changes",
        "contra": "Androgen-dependent tumours, precocious puberty",
        "pearl": "1500-5000 IU SC 2-3 times per week. Used for hypogonadotropic hypogonadism to restore fertility while maintaining testosterone levels. May be combined with FSH (or hMG) if spermatogenesis does not recover with hCG alone after 6 months. Monitor testosterone and semen analysis quarterly."
      }
    ],
    "pearls": [
      "Exogenous testosterone is a male contraceptive - the clinician must counsel all men that testosterone replacement therapy abolishes spermatogenesis via HPG axis suppression, and offer sperm cryopreservation before initiating therapy in men who may desire future fertility",
      "Semen analysis must be repeated after 2-3 months if abnormal because a single sample may not reflect true baseline - one complete spermatogenic cycle takes 74 days, and results vary with illness, stress, and abstinence interval",
      "Varicocele is the most common correctable cause of male infertility - clinical varicocele with abnormal semen parameters warrants urology referral for varicocelectomy, which improves semen parameters in 60-70% of men"
    ],
    "quiz": [
      {
        "question": "A 32-year-old man presents for infertility evaluation. He has been using testosterone cypionate 200mg IM every 2 weeks for 18 months for low energy. Semen analysis shows azoospermia. FSH and LH are undetectable. What is the most appropriate next step?",
        "options": [
          "Increase testosterone dose to 300mg every 2 weeks",
          "Add clomiphene citrate 50mg daily to current testosterone",
          "Discontinue testosterone and initiate hCG injections",
          "Refer immediately for testicular biopsy"
        ],
        "correct": 2,
        "rationale": "Exogenous testosterone suppresses the HPG axis, causing undetectable FSH/LH and azoospermia. The testosterone must be discontinued. hCG mimics LH, restoring intratesticular testosterone production necessary for spermatogenesis without further suppressing the pituitary. Recovery of spermatogenesis typically takes 6-12 months. Adding clomiphene to ongoing testosterone would be ineffective as the exogenous testosterone continues to suppress the axis."
      }
    ]
  },
  "mens-health-prostate-screening-np": {
    "title": "Prostate Cancer Screening",
    "cellular": {
      "title": "PSA Biology and Screening Rationale",
      "content": "Prostate-specific antigen (PSA) is a serine protease produced by prostatic epithelial cells that liquefies semen. PSA is organ-specific but not cancer-specific - it is elevated in BPH, prostatitis, urinary retention, ejaculation, and prostate manipulation, in addition to prostate cancer. Prostate adenocarcinoma arises predominantly from the peripheral zone (70%) and progresses from prostatic intraepithelial neoplasia (PIN) through well-differentiated to poorly differentiated carcinoma. The Gleason grading system evaluates glandular architecture: Grade Group 1 (Gleason 3+3=6) is indolent, while Grade Group 5 (Gleason 9-10) is aggressive with high metastatic potential. Screening with PSA aims to detect clinically significant cancer (Grade Group >= 2) at a curable stage, but carries substantial risk of overdiagnosis and overtreatment of indolent disease. Shared decision-making is essential, weighing the potential mortality reduction (approximately 20% relative reduction per ERSPC trial) against risks of biopsy complications and treatment side effects."
    },
    "riskFactors": [
      "Age > 50 years (incidence increases exponentially after age 50)",
      "African descent (2-fold higher incidence and mortality)",
      "First-degree relative with prostate cancer (2-3 fold increased risk)",
      "BRCA2 mutation carrier (5-fold increased risk of aggressive prostate cancer)",
      "Obesity (associated with higher-grade disease at diagnosis)",
      "High-fat Western dietary pattern"
    ],
    "diagnostics": [
      "Serum PSA level (age-adjusted thresholds: > 2.5 ng/mL age 40-49, > 3.5 age 50-59, > 4.5 age 60-69)",
      "Digital rectal exam (DRE) for nodules, asymmetry, or induration",
      "PSA velocity (increase > 0.75 ng/mL per year raises suspicion)",
      "Free-to-total PSA ratio (< 10% favours cancer; > 25% favours BPH)",
      "Prostate Health Index (PHI) or 4Kscore for risk stratification before biopsy",
      "MRI prostate (PI-RADS scoring) before biopsy to identify targets"
    ],
    "management": [
      "Shared decision-making discussion for men aged 50-70 (or 45 for high-risk groups)",
      "Discuss benefits (potential mortality reduction) and harms (overdiagnosis, biopsy complications, treatment side effects)",
      "If PSA elevated: repeat in 4-6 weeks after excluding confounders (UTI, ejaculation, prostatitis)",
      "Risk calculator use (e.g., PCPT Risk Calculator) to estimate probability of clinically significant cancer",
      "Referral to urology for MRI and/or biopsy if PSA persistently elevated or abnormal DRE",
      "Active surveillance for low-risk cancer (Grade Group 1, PSA < 10, clinical stage T1-T2a)",
      "Discontinue screening when life expectancy < 10 years"
    ],
    "signs": {
      "left": [
        "PSA within age-adjusted normal range with stable trend",
        "Normal DRE with smooth symmetric prostate",
        "Low-risk features: PSA < 10, Grade Group 1 on biopsy",
        "Candidate for active surveillance with regular monitoring"
      ],
      "right": [
        "Rapidly rising PSA (velocity > 0.75 ng/mL/year)",
        "Hard, fixed nodule or asymmetry on DRE",
        "PSA > 20 ng/mL suggesting locally advanced disease",
        "Bone pain with elevated alkaline phosphatase (metastatic disease)"
      ]
    },
    "medications": [
      {
        "name": "5-Alpha Reductase Inhibitors (Finasteride/Dutasteride)",
        "type": "Chemoprevention Agent (off-label)",
        "action": "Reduces intraprostatic DHT, decreasing prostate volume and potentially reducing risk of low-grade prostate cancer detection by 25% (PCPT and REDUCE trials)",
        "sideEffects": "Erectile dysfunction, decreased libido, ejaculatory dysfunction, gynecomastia, potential increased detection of high-grade cancer (debated)",
        "contra": "Women of childbearing potential (teratogenic), pediatric patients",
        "pearl": "PCPT trial: finasteride reduced prostate cancer incidence by 25% but with possible increase in high-grade cancer detection (likely detection bias from smaller prostate improving biopsy sensitivity). Reduces PSA by 50% - must double measured PSA for screening interpretation. Not routinely recommended for chemoprevention by current guidelines."
      },
      {
        "name": "GnRH Agonist - Leuprolide (Lupron)",
        "type": "Androgen Deprivation Therapy",
        "action": "Continuous GnRH receptor stimulation causes initial LH/FSH surge (testosterone flare) followed by receptor downregulation and castrate testosterone levels within 2-4 weeks",
        "sideEffects": "Hot flashes, sexual dysfunction, osteoporosis, metabolic syndrome, cardiovascular risk, cognitive changes, depression, initial testosterone flare may worsen symptoms",
        "contra": "Pregnancy, hypersensitivity; relative: pre-existing osteoporosis, cardiovascular disease",
        "pearl": "Used for advanced/metastatic prostate cancer (not screening). Initial testosterone flare can cause cord compression in spinal metastases - co-administer antiandrogen (bicalutamide) for first 2-4 weeks. Monitor bone density annually. NP role: manage side effects and metabolic complications of ADT in primary care."
      }
    ],
    "pearls": [
      "PSA screening requires shared decision-making - the clinician must discuss both the potential 20% relative mortality reduction and the significant risk of overdiagnosis (up to 50% of screen-detected cancers may never cause symptoms) before ordering the test",
      "Finasteride and dutasteride reduce PSA by approximately 50% - the clinician must double the measured PSA value for cancer screening interpretation in patients on 5-ARI therapy; failure to adjust leads to missed cancers",
      "DRE alone has poor sensitivity (53%) and poor positive predictive value (28%) for prostate cancer - it should complement, not replace, PSA testing; a normal DRE does not exclude cancer as 25-35% of cancers are in the anterior or transitional zone"
    ],
    "quiz": [
      {
        "question": "A 55-year-old man with no family history of prostate cancer asks about prostate screening. He takes finasteride 5mg daily for BPH. His PSA result is 2.8 ng/mL. What is the most appropriate interpretation and action?",
        "options": [
          "PSA is within normal range - reassure and rescreen in 2 years",
          "Adjusted PSA is approximately 5.6 ng/mL - refer to urology for further evaluation",
          "Discontinue finasteride and repeat PSA in 6 months",
          "Proceed directly to transrectal ultrasound-guided biopsy"
        ],
        "correct": 1,
        "rationale": "Finasteride reduces PSA by approximately 50%, so the measured value must be doubled for accurate cancer screening interpretation. Adjusted PSA of 5.6 ng/mL exceeds the screening threshold and warrants urology referral for further risk stratification (repeat PSA, MRI, possible biopsy). Failure to adjust PSA in patients on 5-ARI therapy is a common and dangerous screening error."
      }
    ]
  },
  "womens-health-osteoporosis-np": {
    "title": "Osteoporosis in Women",
    "cellular": {
      "title": "Bone Remodeling Imbalance",
      "content": "Bone undergoes continuous remodeling through coordinated osteoclast-mediated resorption and osteoblast-mediated formation. Estrogen is a critical inhibitor of osteoclast differentiation and activity via suppression of RANKL (receptor activator of nuclear factor kappa-B ligand) on osteoblasts and promotion of osteoprotegerin (OPG), the soluble decoy receptor for RANKL. Menopausal estrogen decline removes this protective effect, dramatically increasing osteoclast activity and bone resorption. Women lose 2-3% of bone mass annually during the first 5-7 years post-menopause, with accelerated loss from trabecular-rich sites (vertebrae, distal radius). Osteoporosis is defined by DXA T-score <= -2.5 at the lumbar spine, femoral neck, or total hip. Osteopenia (T-score -1.0 to -2.5) represents intermediate risk. The FRAX tool integrates clinical risk factors with bone density to estimate 10-year fracture probability, guiding treatment thresholds. Fragility fractures (occurring from standing height or less) indicate severe osteoporosis regardless of T-score."
    },
    "riskFactors": [
      "Postmenopausal status (especially early or surgical menopause)",
      "Low body weight (BMI < 20 kg/m2)",
      "Chronic glucocorticoid use (>= 5mg prednisone equivalent for >= 3 months)",
      "Family history of hip fracture",
      "Smoking and excessive alcohol consumption (> 3 units/day)",
      "Rheumatoid arthritis and other inflammatory conditions",
      "Malabsorption (celiac disease, inflammatory bowel disease)"
    ],
    "diagnostics": [
      "DXA scan at lumbar spine, femoral neck, and total hip (gold standard)",
      "T-score interpretation: >= -1.0 normal, -1.0 to -2.5 osteopenia, <= -2.5 osteoporosis",
      "FRAX calculation: treat if 10-year hip fracture risk >= 3% or major osteoporotic fracture risk >= 20%",
      "Serum 25-hydroxyvitamin D level (target >= 75 nmol/L)",
      "Calcium, phosphate, alkaline phosphatase, PTH to exclude secondary causes",
      "CBC, TSH, serum protein electrophoresis if secondary osteoporosis suspected"
    ],
    "management": [
      "Calcium 1000-1200mg daily (dietary preferred, supplement if insufficient) + vitamin D 800-2000 IU daily",
      "Weight-bearing and resistance exercise (walking, jogging, strength training)",
      "Fall prevention strategies: home safety assessment, balance exercises, vision correction",
      "First-line pharmacotherapy: alendronate 70mg weekly or risedronate 35mg weekly (oral bisphosphonate)",
      "Alternative: denosumab 60mg SC every 6 months (RANKL inhibitor)",
      "Raloxifene 60mg daily for vertebral fracture risk reduction in postmenopausal women with breast cancer risk",
      "Monitor DXA every 2 years on treatment; consider drug holiday after 5 years of bisphosphonate if stable"
    ],
    "signs": {
      "left": [
        "Osteopenia on DXA with low FRAX score (< 20% major, < 3% hip)",
        "No fragility fractures or height loss",
        "Adequate calcium and vitamin D intake",
        "Active lifestyle with regular weight-bearing exercise"
      ],
      "right": [
        "T-score <= -2.5 with fragility fracture (severe osteoporosis)",
        "Progressive height loss > 4 cm (vertebral compression fractures)",
        "Kyphosis with chronic back pain (multiple vertebral fractures)",
        "Hip fracture with 20-30% one-year mortality in elderly women"
      ]
    },
    "medications": [
      {
        "name": "Alendronate (Fosamax)",
        "type": "Oral Bisphosphonate",
        "action": "Binds to hydroxyapatite in bone, is internalized by osteoclasts during resorption, and inhibits farnesyl pyrophosphate synthase in the mevalonate pathway, leading to osteoclast apoptosis and reduced bone resorption",
        "sideEffects": "Esophageal irritation/ulceration (take upright with full glass of water, remain upright 30 min), osteonecrosis of jaw (rare, associated with dental procedures), atypical femoral fracture (rare, with prolonged use > 5 years)",
        "contra": "Esophageal disorders (stricture, achalasia), inability to sit upright for 30 minutes, hypocalcemia (correct before starting), eGFR < 35 mL/min",
        "pearl": "70mg weekly on empty stomach with 250mL plain water, remain upright 30 min before eating. Correct vitamin D deficiency before starting. Consider drug holiday after 5 years if T-score > -2.5 and no fractures. Dental exam recommended before starting. Atypical femoral fracture risk increases after 5-7 years of continuous use."
      },
      {
        "name": "Denosumab (Prolia)",
        "type": "RANKL Inhibitor (Monoclonal Antibody)",
        "action": "Binds RANKL, preventing its interaction with RANK on osteoclast precursors, inhibiting osteoclast differentiation, function, and survival, resulting in decreased bone resorption",
        "sideEffects": "Hypocalcemia (correct before starting, supplement calcium and vitamin D), back pain, arthralgia, osteonecrosis of jaw (rare), atypical femoral fracture (rare)",
        "contra": "Hypocalcemia (must correct before each dose), pregnancy",
        "pearl": "60mg SC every 6 months. CRITICAL: Discontinuation causes rapid rebound bone loss with rebound vertebral fractures within 12-18 months. If stopping denosumab, MUST transition to oral bisphosphonate (alendronate) for at least 1-2 years to prevent rebound. Never stop denosumab without a bridging plan. Monitor calcium levels."
      }
    ],
    "pearls": [
      "FRAX score guides treatment decisions in osteopenia - pharmacotherapy is recommended when 10-year probability of major osteoporotic fracture is >= 20% or hip fracture is >= 3%, even if T-score has not reached the osteoporosis threshold",
      "Denosumab discontinuation causes rapid rebound bone loss with vertebral fracture risk within 12-18 months - the clinician must NEVER stop denosumab without transitioning to an oral bisphosphonate for at least 1-2 years as a bridging strategy",
      "Bisphosphonate drug holidays should be considered after 5 years of oral therapy (or 3 years of IV zoledronic acid) in patients who are stable (T-score > -2.5, no recent fractures) - but high-risk patients may benefit from continued therapy"
    ],
    "quiz": [
      {
        "question": "A 68-year-old postmenopausal woman on denosumab for 4 years reports she wants to discontinue treatment due to cost. DXA shows T-score -2.1 at lumbar spine. What is the most critical counselling point?",
        "options": [
          "She can safely stop denosumab since her T-score is now in the osteopenia range",
          "Stopping denosumab causes rapid rebound bone loss with vertebral fracture risk - she must transition to oral bisphosphonate before discontinuing",
          "She should switch to raloxifene as a cost-effective alternative",
          "Denosumab must be continued indefinitely and cannot be stopped"
        ],
        "correct": 1,
        "rationale": "Denosumab discontinuation causes rapid rebound bone resorption with accelerated bone loss and risk of multiple vertebral fractures within 12-18 months. The clinician must transition the patient to an oral bisphosphonate (alendronate 70mg weekly) for at least 1-2 years before stopping to consolidate bone gains. Simply stopping denosumab without a bridging plan is dangerous regardless of current T-score."
      }
    ]
  },
  "womens-health-hpo-axis-np": {
    "title": "Hypothalamic-Pituitary-Ovarian Axis",
    "cellular": {
      "title": "HPO Axis Physiology and Feedback Mechanisms",
      "content": "The HPO axis controls the menstrual cycle through coordinated hormonal signalling. The hypothalamus releases GnRH in pulsatile fashion (every 60-90 minutes), stimulating anterior pituitary gonadotrophs to secrete FSH and LH. GnRH pulse frequency determines gonadotropin ratio: slower frequency favours FSH secretion (follicular phase), while faster frequency favours LH (luteal phase). In the follicular phase, FSH recruits a cohort of ovarian follicles; the dominant follicle produces rising estradiol which initially suppresses FSH (negative feedback) and then, at a sustained threshold of approximately 200 pg/mL for 48 hours, triggers the LH surge (positive feedback) causing ovulation. After ovulation, the corpus luteum produces progesterone and estradiol, supporting the secretory endometrium. If implantation does not occur, corpus luteum regression causes progesterone withdrawal, triggering menstruation. This elegant feedback system is disrupted in conditions such as hypothalamic amenorrhea, PCOS, and premature ovarian insufficiency."
    },
    "riskFactors": [
      "Functional hypothalamic amenorrhea (excessive exercise, low body weight, psychological stress)",
      "PCOS (most common endocrine disorder in reproductive-age women, affecting 8-13%)",
      "Hyperprolactinemia (prolactinoma, medications - antipsychotics, metoclopramide)",
      "Thyroid dysfunction (hypothyroidism increases TRH which stimulates prolactin)",
      "Premature ovarian insufficiency (< 40 years, autoimmune, chromosomal, iatrogenic)",
      "Pituitary disorders (Sheehan syndrome, pituitary adenoma)"
    ],
    "diagnostics": [
      "Day 2-3 FSH and estradiol (elevated FSH > 25 IU/L suggests diminished ovarian reserve)",
      "LH level and LH:FSH ratio (> 2:1 ratio suggests PCOS)",
      "Serum progesterone day 21 of 28-day cycle (> 10 nmol/L confirms ovulation)",
      "Prolactin level (rule out hyperprolactinemia as cause of anovulation)",
      "TSH (thyroid dysfunction affects GnRH pulsatility)",
      "Anti-Mullerian hormone (AMH) as marker of ovarian reserve"
    ],
    "management": [
      "Identify and treat underlying cause of HPO axis disruption",
      "Hypothalamic amenorrhea: restore energy balance (increase caloric intake, reduce exercise intensity)",
      "Hyperprolactinemia: cabergoline (dopamine agonist) for prolactinoma",
      "PCOS anovulation: weight loss (5-10% improves ovulation rates), letrozole or clomiphene for ovulation induction",
      "Premature ovarian insufficiency: hormone replacement therapy until average age of menopause (51 years)",
      "Progesterone withdrawal challenge to assess estrogen status in amenorrhea workup",
      "Referral to reproductive endocrinology if fertility desired and first-line measures fail"
    ],
    "signs": {
      "left": [
        "Regular menstrual cycles (21-35 days) with predictable pattern",
        "Mittelschmerz (ovulation pain) and cervical mucus changes mid-cycle",
        "Biphasic basal body temperature pattern confirming ovulation",
        "Normal hormonal panel with confirmed ovulation"
      ],
      "right": [
        "Amenorrhea > 3 months in previously cycling woman",
        "Signs of estrogen deficiency: vaginal dryness, hot flashes, decreased bone density",
        "Galactorrhea with elevated prolactin (pituitary adenoma)",
        "Hyperandrogenic signs: hirsutism, acne, alopecia (PCOS or adrenal source)"
      ]
    },
    "medications": [
      {
        "name": "Letrozole (Femara)",
        "type": "Aromatase Inhibitor (Ovulation Induction)",
        "action": "Inhibits aromatase enzyme, reducing peripheral estrogen conversion, which releases hypothalamus/pituitary from estrogen negative feedback and increases FSH secretion to stimulate follicular development",
        "sideEffects": "Hot flashes, headache, fatigue, arthralgia, multiple pregnancy risk (lower than with clomiphene)",
        "contra": "Pregnancy (teratogenic - confirm negative beta-hCG before use), premenopausal women not trying to conceive",
        "pearl": "2.5-7.5mg daily on cycle days 3-7. First-line for ovulation induction in PCOS (NICHD trial showed superiority over clomiphene for live birth rate). Lower multiple pregnancy rate than clomiphene. Short half-life eliminates antiestrogenic endometrial/cervical mucus effects."
      },
      {
        "name": "Cabergoline (Dostinex)",
        "type": "Dopamine Agonist",
        "action": "Potent D2 receptor agonist that suppresses prolactin secretion from anterior pituitary lactotrophs, reducing prolactin levels and restoring GnRH pulsatility and ovulatory function",
        "sideEffects": "Nausea, dizziness, orthostatic hypotension, headache, valvular heart disease (rare, with high doses used in Parkinson disease)",
        "contra": "Uncontrolled hypertension, history of cardiac valvular disorder, hypersensitivity to ergot derivatives",
        "pearl": "0.25-0.5mg twice weekly for hyperprolactinemia. Preferred over bromocriptine due to better tolerability and twice-weekly dosing. Normalizes prolactin in > 90% of microprolactinomas. Monitor prolactin levels and MRI for macroadenomas. Restores ovulation and fertility in prolactin-induced anovulation."
      }
    ],
    "pearls": [
      "GnRH pulsatility is the master regulator of the HPO axis - slow pulses favour FSH (follicular phase) while fast pulses favour LH (luteal phase); continuous GnRH administration paradoxically suppresses the axis (basis for GnRH agonist therapy in endometriosis and precocious puberty)",
      "The LH surge requires sustained estradiol exposure above approximately 200 pg/mL for 48 hours - this positive feedback mechanism is unique in endocrinology and is the basis for ovulation induction monitoring with serial estradiol and ultrasound",
      "Functional hypothalamic amenorrhea is a diagnosis of exclusion caused by energy deficit, excessive exercise, or stress - it is reversible with lifestyle modification and does NOT require hormonal ovulation induction as first-line treatment"
    ],
    "quiz": [
      {
        "question": "A 28-year-old competitive distance runner with BMI 17.5 presents with 8 months of amenorrhea. FSH 2.1 IU/L, LH 1.0 IU/L, estradiol 55 pmol/L, prolactin normal, TSH normal, beta-hCG negative. What is the most appropriate initial management?",
        "options": [
          "Start combined oral contraceptive pill to restore menstruation",
          "Prescribe letrozole 2.5mg cycle days 3-7 for ovulation induction",
          "Counsel on increasing caloric intake and reducing exercise intensity",
          "Order MRI pituitary to rule out pituitary tumour"
        ],
        "correct": 2,
        "rationale": "Low FSH, LH, and estradiol with normal prolactin and TSH in a low-BMI athlete is classic functional hypothalamic amenorrhea from energy deficit. First-line management is restoring energy balance through increased caloric intake and reduced exercise intensity. OCP masks the problem without addressing bone health. Ovulation induction is inappropriate without addressing the underlying energy deficit. MRI is unnecessary when the clinical picture clearly indicates hypothalamic suppression."
      }
    ]
  },
  "womens-health-contraception-np": {
    "title": "Contraception Methods and Prescribing",
    "cellular": {
      "title": "Mechanisms of Hormonal",
      "content": "Hormonal contraception primarily prevents pregnancy through suppression of the HPO axis. Combined hormonal contraceptives (CHC: pill, patch, ring) contain ethinyl estradiol and a progestin; the estrogen component suppresses FSH and follicular recruitment while the progestin suppresses the LH surge, preventing ovulation. Progestin also thickens cervical mucus (impeding sperm transport), thins the endometrium (reducing receptivity), and slows tubal motility. Progestin-only methods (POP, DMPA, implant, hormonal IUD) rely primarily on cervical mucus thickening and endometrial atrophy, with variable ovulation suppression (DMPA and implant reliably suppress ovulation; POP less consistently). The copper IUD creates a sterile inflammatory reaction in the endometrium, with copper ions toxic to sperm and ova, preventing fertilization. The levonorgestrel IUD releases progestin locally, primarily acting through cervical mucus and endometrial effects. US Medical Eligibility Criteria (MEC) categorize contraindications from 1 (no restriction) to 4 (unacceptable health risk)."
    },
    "riskFactors": [
      "CHC contraindications: migraine with aura (stroke risk), history of VTE/PE, breast cancer",
      "Age >= 35 and smoking >= 15 cigarettes/day (MEC 4 for CHC)",
      "Uncontrolled hypertension (systolic >= 160 or diastolic >= 100 is MEC 4 for CHC)",
      "Active liver disease or hepatocellular adenoma",
      "History of bariatric surgery (malabsorptive procedures reduce oral contraceptive efficacy)",
      "Concurrent anticonvulsant use (enzyme-inducing AEDs reduce CHC efficacy)",
      "Postpartum period < 21 days (VTE risk with CHC)"
    ],
    "diagnostics": [
      "Blood pressure measurement before prescribing CHC (only required physical exam)",
      "BMI documentation (obesity affects DMPA bone density and patch efficacy > 90kg)",
      "Menstrual history to determine cycle regularity and current pregnancy risk",
      "Screen for MEC contraindications: migraine with aura, VTE history, breast cancer history, smoking status",
      "Beta-hCG if pregnancy cannot be reasonably excluded",
      "STI screening if indicated (contraception does not protect against STIs except condoms)"
    ],
    "management": [
      "Tier 1 (most effective): LARC methods - copper IUD (10 years), LNG-IUD (5-8 years), etonogestrel implant (3 years)",
      "Tier 2: DMPA injection 150mg IM every 12 weeks, combined OCP, patch, vaginal ring",
      "Counsel on typical-use vs perfect-use failure rates (OCP typical 7% vs perfect 0.3%)",
      "Quick-start method: start CHC same day if reasonably certain not pregnant (backup method x 7 days)",
      "DMPA: counsel on bone density loss with prolonged use (> 2 years), weight gain, delayed fertility return (up to 18 months)",
      "Emergency contraception: ulipristal 30mg (up to 120h), levonorgestrel 1.5mg (up to 72h), copper IUD (up to 7 days, most effective)",
      "Annual follow-up: BP check, satisfaction assessment, screen for new contraindications"
    ],
    "signs": {
      "left": [
        "Tolerating CHC well with no adverse effects and regular withdrawal bleeds",
        "Satisfied with LARC method with expected bleeding pattern changes",
        "No new contraindications developed since initiation",
        "Normal blood pressure on annual check"
      ],
      "right": [
        "New-onset migraine with aura on CHC (discontinue immediately - stroke risk)",
        "Calf pain, swelling, dyspnea on CHC (VTE/PE evaluation urgently)",
        "Unscheduled pregnancy on current method (method failure or adherence issue)",
        "DMPA use > 2 years with concern for bone density loss"
      ]
    },
    "medications": [
      {
        "name": "Levonorgestrel IUD (Mirena)",
        "type": "Long-Acting Reversible Contraceptive (Intrauterine Progestin)",
        "action": "Releases levonorgestrel locally, thickening cervical mucus, thinning endometrium, and partially suppressing ovulation; high efficacy with 99.8% typical-use rate",
        "sideEffects": "Irregular bleeding/spotting (first 3-6 months), amenorrhea (20% at 1 year - can be presented as benefit), hormonal side effects (headache, acne, mood changes - less than systemic methods), expulsion (2-10%)",
        "contra": "Active pelvic infection (PID), unexplained vaginal bleeding, cervical or uterine cancer, uterine anomaly distorting cavity, Wilson disease (copper IUD only)",
        "pearl": "Insert any time in cycle if reasonably certain not pregnant. Effective for 5-8 years depending on product. Also treats heavy menstrual bleeding and dysmenorrhea. Can be used in nulliparous women. Fertility returns immediately upon removal. Counsel on expected irregular bleeding in first 3-6 months."
      },
      {
        "name": "Depot Medroxyprogesterone Acetate (DMPA, Depo-Provera)",
        "type": "Injectable Progestin Contraceptive",
        "action": "Suppresses ovulation by inhibiting LH surge, thickens cervical mucus, and thins endometrium; provides 12 weeks of contraception per injection",
        "sideEffects": "Irregular bleeding progressing to amenorrhea, weight gain (average 2.3kg in first year), bone density loss (partially reversible), delayed return to fertility (median 10 months after last injection, up to 18 months)",
        "contra": "Current breast cancer (MEC 4), multiple cardiovascular risk factors if combined with age > 35, unexplained vaginal bleeding",
        "pearl": "150mg IM every 12 weeks (2-week grace period). Health Canada advisory on bone density with > 2 years use, but benefits generally outweigh risks. Amenorrhea is common and can be counselled as a benefit. Delayed fertility return distinguishes DMPA from other methods - important for family planning discussions."
      }
    ],
    "pearls": [
      "LARC methods (IUDs, implant) are first-line contraception recommendations due to highest efficacy (> 99%), user-independence, and cost-effectiveness over time - the clinician should actively offer LARC as the default recommendation during contraceptive counselling",
      "Migraine with aura is an absolute contraindication (MEC 4) to combined hormonal contraception due to 2-4 fold increased ischemic stroke risk - progestin-only methods and copper IUD are safe alternatives in these patients",
      "The copper IUD is the most effective emergency contraception method (failure rate < 0.1%) when inserted within 7 days of unprotected intercourse, and provides ongoing contraception for up to 10 years - this option is frequently under-offered"
    ],
    "quiz": [
      {
        "question": "A 32-year-old woman with a history of migraine with visual aura requests contraception. She has no other medical conditions and is a non-smoker. Which method is contraindicated?",
        "options": [
          "Levonorgestrel IUD (Mirena)",
          "Combined oral contraceptive pill",
          "Etonogestrel subdermal implant (Nexplanon)",
          "Copper IUD (Paragard)"
        ],
        "correct": 1,
        "rationale": "Migraine with aura is MEC category 4 (unacceptable health risk) for all combined hormonal contraceptives (pill, patch, ring) due to 2-4 fold increased ischemic stroke risk. Progestin-only methods (LNG-IUD, implant, POP, DMPA) and the copper IUD are safe alternatives (MEC 1-2) as the stroke risk is estrogen-mediated. The clinician must screen for migraine with aura before prescribing any CHC."
      }
    ]
  },
  "womens-health-gynecologic-np": {
    "title": "Gynecologic Conditions: Vaginitis, PID",
    "cellular": {
      "title": "Common Gynecologic Disorders",
      "content": "Vaginitis represents disruption of the vaginal microbiome or infection of the vaginal epithelium. Bacterial vaginosis (BV) results from replacement of protective Lactobacillus species with anaerobic bacteria (Gardnerella vaginalis, Prevotella, Mobiluncus), producing malodorous thin grey discharge with clue cells on wet mount and positive whiff test (KOH releases amines). Vulvovaginal candidiasis involves Candida albicans overgrowth, producing thick white curd-like discharge with KOH preparation showing pseudohyphae. Trichomoniasis, caused by the protozoan Trichomonas vaginalis, produces frothy yellow-green discharge with motile trichomonads on wet mount and strawberry cervix on exam. Pelvic inflammatory disease (PID) results from ascending cervical infection (commonly Chlamydia and Gonorrhea) causing endometritis, salpingitis, and tubo-ovarian abscess. PCOS involves ovarian hyperandrogenism with anovulation, diagnosed by Rotterdam criteria (2 of 3: oligo/anovulation, clinical/biochemical hyperandrogenism, polycystic ovarian morphology on ultrasound). Endometriosis involves ectopic endometrial tissue implants causing cyclic inflammation, adhesions, and pain."
    },
    "riskFactors": [
      "BV: vaginal douching, new or multiple sexual partners, IUD use",
      "Candidiasis: antibiotic use, diabetes, immunosuppression, pregnancy",
      "Trichomoniasis: multiple sexual partners, history of STIs",
      "PID: age < 25, multiple partners, prior STI, IUD insertion within 3 weeks",
      "PCOS: obesity, family history, insulin resistance",
      "Endometriosis: nulliparity, early menarche, short menstrual cycles, family history"
    ],
    "diagnostics": [
      "Wet mount microscopy: clue cells (BV), pseudohyphae on KOH (candida), motile trichomonads (trichomoniasis)",
      "Vaginal pH: > 4.5 (BV, trichomoniasis); normal < 4.5 (candida)",
      "Whiff test: positive with KOH in BV (fishy amine odour)",
      "NAAT for Chlamydia/Gonorrhea in PID workup",
      "CDC criteria for PID: cervical motion tenderness + uterine tenderness + adnexal tenderness (minimum criteria)",
      "Rotterdam criteria for PCOS: 2 of 3 (oligo/anovulation, hyperandrogenism, polycystic ovaries on ultrasound)"
    ],
    "management": [
      "BV: metronidazole 500mg BID x 7 days or metronidazole gel 0.75% intravaginally x 5 days",
      "Candidiasis: fluconazole 150mg single oral dose or topical azole (clotrimazole) x 3-7 days",
      "Trichomoniasis: metronidazole 2g single dose (treat partner simultaneously)",
      "PID: ceftriaxone 500mg IM once + doxycycline 100mg BID x 14 days +/- metronidazole 500mg BID x 14 days",
      "PCOS: combined OCP for cycle regulation and anti-androgen effect, metformin for insulin resistance, spironolactone for hirsutism",
      "Endometriosis: NSAIDs for pain, combined OCP continuous for suppression, GnRH agonist, laparoscopy for diagnosis/treatment",
      "Screen and treat sexual partners for STIs in trichomoniasis and PID"
    ],
    "signs": {
      "left": [
        "Thin grey discharge with fishy odour (BV - most common cause of vaginitis)",
        "Thick white curd-like discharge with pruritus (vulvovaginal candidiasis)",
        "Irregular cycles with acne and hirsutism in obese woman (PCOS)",
        "Cyclic pelvic pain worse with menstruation (endometriosis)"
      ],
      "right": [
        "Fever, cervical motion tenderness, bilateral adnexal tenderness (PID)",
        "Tubo-ovarian abscess on imaging with sepsis (complicated PID)",
        "Frothy yellow-green discharge with strawberry cervix (trichomoniasis - STI)",
        "Ruptured endometrioma (chocolate cyst) with acute surgical abdomen"
      ]
    },
    "medications": [
      {
        "name": "Metronidazole (Flagyl)",
        "type": "Nitroimidazole Antibiotic/Antiprotozoal",
        "action": "Enters bacterial/protozoal cells, is reduced by ferredoxin to cytotoxic nitroso radicals that damage DNA, disrupting nucleic acid synthesis; active against anaerobes and Trichomonas",
        "sideEffects": "Metallic taste, nausea, disulfiram-like reaction with alcohol, peripheral neuropathy (prolonged use), dark urine",
        "contra": "First trimester pregnancy (relative - weigh risks), concurrent alcohol consumption (disulfiram reaction), concurrent disulfiram use",
        "pearl": "BV: 500mg BID x 7 days. Trichomoniasis: 2g single dose. Avoid alcohol during and 48h after treatment (disulfiram-like reaction: nausea, vomiting, flushing). Treat sexual partners simultaneously for trichomoniasis. BV recurrence is common (50% within 12 months) - consider suppressive vaginal gel."
      },
      {
        "name": "Combined Oral Contraceptive (Ethinyl Estradiol/Levonorgestrel)",
        "type": "Combined Hormonal Contraceptive",
        "action": "Suppresses ovulation via HPO axis suppression; in PCOS, reduces ovarian androgen production, raises SHBG (lowering free testosterone), regulates endometrial shedding, and provides contraception",
        "sideEffects": "Nausea, breast tenderness, breakthrough bleeding, headache, VTE risk (3-4x baseline), mood changes",
        "contra": "Migraine with aura, VTE history, breast cancer, smoking >= 15/day if >= 35 years, uncontrolled hypertension",
        "pearl": "First-line for PCOS cycle regulation and hyperandrogenism management. Continuous use (skipping placebo week) reduces endometriosis pain. Protects endometrium from unopposed estrogen in anovulatory cycles. Must screen MEC criteria before prescribing. Does NOT treat insulin resistance in PCOS - add metformin if indicated."
      }
    ],
    "pearls": [
      "The wet mount is the most cost-effective point-of-care test in vaginitis evaluation - clue cells with positive whiff test diagnose BV, pseudohyphae on KOH diagnose candidiasis, and motile trichomonads diagnose trichomoniasis; each has a different treatment and partner notification requirement",
      "PID is a clinical diagnosis based on minimum criteria (cervical motion tenderness + uterine tenderness + adnexal tenderness) - the clinician should have a low threshold to treat empirically because delay increases infertility risk; negative NAAT does not exclude PID",
      "PCOS is diagnosed by Rotterdam criteria requiring 2 of 3 features - it is the most common cause of anovulatory infertility and carries long-term metabolic risks (type 2 diabetes, cardiovascular disease, endometrial cancer from unopposed estrogen)"
    ],
    "quiz": [
      {
        "question": "A 24-year-old presents with malodorous thin grey vaginal discharge. Vaginal pH is 5.2. Wet mount shows epithelial cells studded with bacteria obscuring cell borders. KOH produces a fishy odour. What is the diagnosis and treatment?",
        "options": [
          "Vulvovaginal candidiasis - fluconazole 150mg single dose",
          "Bacterial vaginosis - metronidazole 500mg BID x 7 days",
          "Trichomoniasis - metronidazole 2g single dose with partner treatment",
          "Chlamydia cervicitis - azithromycin 1g single dose"
        ],
        "correct": 1,
        "rationale": "Clue cells (epithelial cells studded with bacteria obscuring borders) with elevated pH (> 4.5), positive whiff test (KOH fishy odour), and thin grey discharge meet Amsel criteria for bacterial vaginosis. Treatment is metronidazole 500mg BID x 7 days. BV is NOT an STI and partner treatment is not indicated. Candidiasis has normal pH with pseudohyphae. Trichomoniasis shows motile trichomonads."
      }
    ]
  },
  "womens-health-amenorrhea-np": {
    "title": "Amenorrhea: Primary and Secondary",
    "cellular": {
      "title": "Pathophysiology of Menstrual Absence",
      "content": "Amenorrhea is classified as primary (absence of menarche by age 15 with normal secondary sexual characteristics, or by age 13 without secondary sexual characteristics) or secondary (absence of menstruation for >= 3 months in previously cycling women or >= 6 months in women with irregular cycles). Secondary amenorrhea is far more common and the diagnostic workup proceeds systematically. Pregnancy is the most common cause and must always be excluded first with beta-hCG. After excluding pregnancy, the clinician evaluates TSH (hypothyroidism increases TRH, which stimulates prolactin and suppresses GnRH), prolactin (hyperprolactinemia suppresses GnRH pulsatility), and FSH (elevated FSH > 40 IU/L indicates primary ovarian insufficiency; low/normal FSH suggests hypothalamic or pituitary cause). Functional hypothalamic amenorrhea results from suppression of GnRH pulsatility due to energy deficit, excessive exercise, or psychological stress. PCOS is the most common cause of anovulatory amenorrhea in reproductive-age women, characterized by hyperandrogenism and insulin resistance disrupting normal follicular development."
    },
    "riskFactors": [
      "Pregnancy (most common cause of secondary amenorrhea - always exclude first)",
      "Excessive exercise with energy deficit (female athlete triad/RED-S)",
      "Restrictive eating disorders (anorexia nervosa)",
      "Rapid weight loss or low BMI (< 18.5 kg/m2)",
      "PCOS (most common endocrine cause of anovulatory amenorrhea)",
      "Hyperprolactinemia (prolactinoma, antipsychotics, metoclopramide)",
      "Premature ovarian insufficiency (autoimmune, Turner syndrome, chemotherapy)"
    ],
    "diagnostics": [
      "Serum beta-hCG (exclude pregnancy - mandatory first step in all secondary amenorrhea)",
      "TSH (hypothyroidism is a reversible cause of amenorrhea)",
      "Prolactin level (> 100 mcg/L suggests prolactinoma - order MRI pituitary)",
      "FSH level (> 40 IU/L on two occasions = primary ovarian insufficiency; low/normal = hypothalamic/pituitary cause)",
      "Total and free testosterone, DHEA-S if hyperandrogenism suspected (PCOS workup)",
      "Progesterone withdrawal challenge: medroxyprogesterone 10mg x 10 days - withdrawal bleed suggests adequate estrogen and anovulation (PCOS); no bleed suggests estrogen deficiency or outflow obstruction"
    ],
    "management": [
      "Treat underlying cause: correct thyroid dysfunction, treat hyperprolactinemia, address energy deficit",
      "Functional hypothalamic amenorrhea: increase caloric intake, reduce exercise, stress management",
      "PCOS with amenorrhea: OCP for cycle regulation and endometrial protection, metformin for insulin resistance",
      "Premature ovarian insufficiency: hormone replacement (estradiol + progesterone) until average age of menopause (51 years)",
      "Endometrial protection: women with chronic anovulation need cyclic or continuous progesterone to prevent endometrial hyperplasia",
      "DXA for bone density assessment in prolonged amenorrhea (> 6 months of estrogen deficiency)",
      "Referral to reproductive endocrinology if fertility desired with anovulation unresponsive to first-line measures"
    ],
    "signs": {
      "left": [
        "Recent onset amenorrhea with identifiable reversible cause (stress, weight loss)",
        "Positive progesterone withdrawal bleed (adequate estrogen, anovulation)",
        "PCOS features: irregular cycles, acne, hirsutism, obesity",
        "Normal secondary sexual characteristics in primary amenorrhea evaluation"
      ],
      "right": [
        "FSH > 40 IU/L on two occasions (primary ovarian insufficiency - irreversible)",
        "Prolactin > 100 mcg/L with visual field defects (pituitary macroadenoma)",
        "Primary amenorrhea with absent secondary sexual characteristics (Turner syndrome, gonadal dysgenesis)",
        "Long-standing amenorrhea with osteoporosis and fragility fracture"
      ]
    },
    "medications": [
      {
        "name": "Medroxyprogesterone Acetate (Provera)",
        "type": "Progestin (Diagnostic and Therapeutic)",
        "action": "Synthetic progestogen that induces secretory transformation of estrogen-primed endometrium; withdrawal produces shedding (diagnostic: confirms estrogen sufficiency and patent outflow tract)",
        "sideEffects": "Breakthrough bleeding, bloating, breast tenderness, headache, mood changes, weight gain",
        "contra": "Pregnancy, active thromboembolic disease, known or suspected breast cancer, undiagnosed vaginal bleeding",
        "pearl": "Progesterone withdrawal challenge: 10mg daily x 10 days. Withdrawal bleed within 2-7 days of completion = adequate estrogen + anovulation (likely PCOS). No withdrawal bleed = estrogen deficiency (hypothalamic amenorrhea) or outflow obstruction (Asherman syndrome). This test guides the diagnostic pathway."
      },
      {
        "name": "Cabergoline (Dostinex)",
        "type": "Dopamine Agonist",
        "action": "D2 receptor agonist that inhibits prolactin secretion from anterior pituitary lactotrophs, restoring GnRH pulsatility and ovulatory menstrual cycles in hyperprolactinemia",
        "sideEffects": "Nausea, dizziness, orthostatic hypotension, fatigue, headache",
        "contra": "Uncontrolled hypertension, cardiac valvular disease, hypersensitivity to ergot alkaloids",
        "pearl": "0.25mg twice weekly, titrate to normalize prolactin. First-line for prolactinoma-induced amenorrhea. Normalizes prolactin and restores menses in > 90% of microprolactinomas. Monitor prolactin levels at 4-6 weeks. MRI pituitary for macroadenomas. Preferred over bromocriptine for better tolerability and efficacy."
      }
    ],
    "pearls": [
      "The first step in ALL secondary amenorrhea workups is beta-hCG to exclude pregnancy - this is a patient safety imperative that must never be skipped regardless of reported sexual activity or contraceptive use",
      "The progesterone withdrawal challenge is a pivotal diagnostic test: withdrawal bleed confirms adequate endogenous estrogen and anovulation (likely PCOS), while absence of bleed suggests either estrogen deficiency (hypothalamic/pituitary failure) or anatomic outflow obstruction",
      "Chronic anovulation without progesterone opposition puts the endometrium at risk for hyperplasia and endometrial cancer - the clinician must ensure endometrial protection in all amenorrheic women with intact uterus through cyclic progesterone or combined OCP"
    ],
    "quiz": [
      {
        "question": "A 26-year-old woman presents with 5 months of amenorrhea. Beta-hCG negative. TSH normal. Prolactin 8 mcg/L (normal). FSH 62 IU/L, repeated at 68 IU/L. What is the most likely diagnosis?",
        "options": [
          "Functional hypothalamic amenorrhea",
          "PCOS with anovulation",
          "Primary ovarian insufficiency",
          "Prolactinoma"
        ],
        "correct": 2,
        "rationale": "Two FSH values > 40 IU/L (62 and 68) in a woman < 40 years confirms primary ovarian insufficiency (premature ovarian failure). The elevated FSH reflects loss of negative feedback from ovarian estradiol and inhibin B on the pituitary. Hypothalamic amenorrhea would show low/normal FSH. PCOS typically shows normal or mildly elevated LH with normal FSH. Prolactin is normal, excluding prolactinoma."
      }
    ]
  },
  "neuro-seizures-np": {
    "title": "Seizure Disorders and Epilepsy",
    "cellular": {
      "title": "Neuronal Hyperexcitability",
      "content": "Seizures result from abnormal, excessive, and synchronous neuronal electrical discharge in the cerebral cortex. The balance between excitatory (glutamate/NMDA) and inhibitory (GABA) neurotransmission maintains normal cortical function. Seizures occur when this balance shifts toward excitation through increased glutamatergic transmission, decreased GABAergic inhibition, or altered intrinsic neuronal membrane properties (channelopathies affecting sodium, potassium, or calcium channels). Focal seizures originate in a localized cortical region: focal aware (consciousness preserved, formerly simple partial), focal impaired awareness (consciousness altered, formerly complex partial), and focal to bilateral tonic-clonic. Generalized seizures involve both hemispheres from onset: absence (3 Hz spike-and-wave on EEG), myoclonic, tonic, atonic, and tonic-clonic. Status epilepticus is defined as continuous seizure activity lasting >= 5 minutes or two or more seizures without full recovery of consciousness, constituting a neurological emergency with increasing neuronal death, excitotoxicity, and systemic complications (rhabdomyolysis, hyperthermia, respiratory failure)."
    },
    "riskFactors": [
      "Structural brain lesion (stroke, tumour, traumatic brain injury, cortical dysplasia)",
      "Family history of epilepsy or febrile seizures",
      "CNS infection (meningitis, encephalitis, neurocysticercosis)",
      "Metabolic derangements (hypoglycemia, hyponatremia, hypocalcemia, uremia)",
      "Alcohol withdrawal (seizures typically 12-48 hours after last drink)",
      "Medication non-adherence (most common cause of breakthrough seizure in known epilepsy)",
      "Sleep deprivation"
    ],
    "diagnostics": [
      "Electroencephalogram (EEG) - gold standard for seizure classification and epilepsy diagnosis",
      "MRI brain with epilepsy protocol (3T, thin cuts through temporal lobes) for structural cause identification",
      "Serum glucose, electrolytes (sodium, calcium, magnesium), renal function, hepatic function",
      "CBC, toxicology screen, blood alcohol level in first-time seizure",
      "Prolactin level (transiently elevated within 20 minutes of generalized tonic-clonic or focal impaired awareness seizure - helps distinguish from psychogenic non-epileptic events)",
      "AED drug levels if on therapy (valproic acid, carbamazepine, phenytoin)"
    ],
    "management": [
      "First unprovoked seizure: may defer AED treatment if normal EEG and MRI (30% recurrence risk); treat if abnormal EEG/MRI or patient preference",
      "First-line AEDs: levetiracetam (broad-spectrum, few interactions), valproic acid (broad-spectrum, teratogenic), carbamazepine (focal seizures), lamotrigine (focal and generalized, safer in pregnancy)",
      "Status epilepticus: IV lorazepam 0.1 mg/kg (max 4mg), repeat once if needed, then IV levetiracetam 60 mg/kg or fosphenytoin 20 mg PE/kg",
      "Seizure safety counselling: driving restrictions (seizure-free interval varies by province/state), avoid swimming alone, shower instead of bath",
      "Women of childbearing age: folic acid 1-5 mg daily, avoid valproic acid (NTD risk), prefer lamotrigine or levetiracetam",
      "Medication adherence counselling: missed doses are the most common cause of breakthrough seizures",
      "Referral to epileptologist if seizures persist despite two appropriate AED trials (drug-resistant epilepsy)"
    ],
    "signs": {
      "left": [
        "Single unprovoked seizure with normal EEG and MRI",
        "Well-controlled epilepsy on monotherapy with no seizures >= 12 months",
        "Focal aware seizure without loss of consciousness",
        "Normal neurological examination between events"
      ],
      "right": [
        "Status epilepticus: continuous seizure >= 5 minutes (neurological emergency)",
        "Drug-resistant epilepsy: failed two appropriate AED trials",
        "New-onset seizure with structural lesion on MRI (tumour, stroke)",
        "Todd paralysis: transient focal weakness post-seizure (concerning for structural lesion)"
      ]
    },
    "medications": [
      {
        "name": "Levetiracetam (Keppra)",
        "type": "Broad-Spectrum Antiepileptic Drug",
        "action": "Binds synaptic vesicle protein SV2A, modulating neurotransmitter release; inhibits presynaptic calcium channels and reverses inhibition of GABA and glycine-gated currents by negative allosteric modulators",
        "sideEffects": "Irritability and behavioural changes (Keppra rage), somnolence, dizziness, headache, leukopenia (rare)",
        "contra": "Known hypersensitivity; use with caution in patients with depression or suicidal ideation (monitor mood)",
        "pearl": "500mg BID, titrate to 1500mg BID. Broad-spectrum (effective for focal and generalized seizures). Minimal drug interactions (not hepatically metabolized). Renal dose adjustment needed. Safe in pregnancy (preferred AED). Keppra rage is manageable with dose reduction or addition of vitamin B6 (pyridoxine)."
      },
      {
        "name": "Valproic Acid (Depakene/Epival)",
        "type": "Broad-Spectrum Antiepileptic Drug",
        "action": "Multiple mechanisms: enhances GABA synthesis and inhibits GABA degradation, blocks voltage-gated sodium channels, and modulates T-type calcium channels; effective across all seizure types",
        "sideEffects": "Weight gain, tremor, alopecia, hepatotoxicity (monitor LFTs), pancreatitis, thrombocytopenia, teratogenicity (neural tube defects - 1-2% risk)",
        "contra": "Pregnancy or women of childbearing potential not on reliable contraception (category X for NTDs), hepatic disease, urea cycle disorders, mitochondrial disease (POLG mutation)",
        "pearl": "250mg BID, titrate to therapeutic level (350-700 mcmol/L). Most effective for generalized epilepsy (absence, myoclonic, tonic-clonic). ABSOLUTELY CONTRAINDICATED in pregnancy (1-2% NTD risk, IQ reduction in offspring). Monitor LFTs, CBC, ammonia. Drug interactions with many medications via CYP inhibition."
      }
    ],
    "pearls": [
      "After a first unprovoked seizure with normal EEG and MRI, the 2-year recurrence risk is approximately 30% - the clinician may reasonably defer AED treatment with close follow-up, but must initiate treatment after a second unprovoked seizure (60% recurrence risk)",
      "Valproic acid is absolutely contraindicated in women of childbearing potential due to 1-2% neural tube defect risk and cognitive effects on offspring - the clinician must prescribe folic acid 1-5 mg daily and use lamotrigine or levetiracetam as preferred alternatives in this population",
      "Status epilepticus is a time-sensitive emergency: IV benzodiazepine (lorazepam 0.1 mg/kg) is first-line and must be administered within 5 minutes of seizure onset - delayed treatment increases mortality and morbidity from excitotoxic neuronal injury"
    ],
    "quiz": [
      {
        "question": "A 24-year-old woman with epilepsy controlled on valproic acid presents requesting preconception counselling. She has been seizure-free for 3 years. What is the most critical intervention?",
        "options": [
          "Continue valproic acid and add folic acid 5mg daily",
          "Transition from valproic acid to lamotrigine before conception and prescribe folic acid",
          "Discontinue all AEDs since she has been seizure-free for 3 years",
          "Switch to carbamazepine as it is safer in pregnancy"
        ],
        "correct": 1,
        "rationale": "Valproic acid is the most teratogenic AED (1-2% NTD risk, cognitive effects on offspring) and must be transitioned to a safer alternative (lamotrigine or levetiracetam) before conception. Folic acid 1-5mg daily should be started at least 3 months before conception. Discontinuing all AEDs risks seizure recurrence which is also dangerous in pregnancy. Carbamazepine has lower but still significant teratogenic risk compared to lamotrigine."
      }
    ]
  },
  "neuro-headaches-np": {
    "title": "Primary Headache Disorders",
    "cellular": {
      "title": "Trigeminovascular Activation",
      "content": "Primary headache disorders involve dysfunction of pain-processing pathways without structural pathology. Migraine pathophysiology centers on trigeminovascular system activation: cortical spreading depression (a wave of neuronal depolarization followed by suppression) triggers the aura phase and activates trigeminal nerve afferents innervating meningeal blood vessels. Activated trigeminal fibres release calcitonin gene-related peptide (CGRP), substance P, and neurokinin A, causing neurogenic inflammation, vasodilation, and meningeal sensitization. Central sensitization of the trigeminal nucleus caudalis produces cutaneous allodynia. Serotonin (5-HT1B/1D) receptors on trigeminal terminals and meningeal vessels are the targets of triptans, which inhibit CGRP release and cause meningeal vasoconstriction. Tension-type headache involves peripheral myofascial nociception from pericranial muscles with central pain modulation dysfunction in chronic forms. Cluster headache involves hypothalamic activation with parasympathetic outflow through the sphenopalatine ganglion causing unilateral autonomic symptoms (lacrimation, rhinorrhea, conjunctival injection)."
    },
    "riskFactors": [
      "Family history (70% of migraine patients have first-degree relative with migraine)",
      "Female sex (migraine 3:1 female-to-male ratio, linked to estrogen fluctuations)",
      "Stress and sleep disturbances (both trigger and perpetuating factor)",
      "Medication overuse (analgesics >= 15 days/month or triptans >= 10 days/month)",
      "Obesity (associated with chronic migraine transformation)",
      "Caffeine overuse or withdrawal",
      "Smoking (risk factor for cluster headache)"
    ],
    "diagnostics": [
      "Clinical diagnosis based on ICHD-3 criteria (no routine imaging for typical primary headaches)",
      "Migraine without aura: >= 5 attacks, 4-72h duration, 2 of 4 (unilateral, pulsating, moderate-severe, aggravated by activity) + 1 of 2 (nausea/vomiting, photophobia and phonophobia)",
      "Headache diary to document frequency, duration, triggers, and medication use",
      "Neuroimaging (MRI brain) indicated only with red flags: thunderclap onset, new after age 50, neurological deficits, papilledema",
      "ESR/CRP in patients > 50 to screen for giant cell arteritis",
      "LP only if SAH suspected with negative CT or for suspected idiopathic intracranial hypertension"
    ],
    "management": [
      "Migraine acute: NSAIDs (ibuprofen 400-600mg) or triptans (sumatriptan 50-100mg PO or 6mg SC) at onset",
      "Migraine prophylaxis (>= 4 headache days/month): topiramate 25-100mg BID, propranolol 40-120mg daily, amitriptyline 10-50mg HS, or CGRP monoclonal antibodies",
      "Tension-type acute: acetaminophen 1000mg or ibuprofen 400mg",
      "Tension-type prophylaxis (chronic): amitriptyline 10-50mg at bedtime",
      "Cluster headache acute: high-flow oxygen 12-15 L/min x 15 min via non-rebreather OR sumatriptan 6mg SC",
      "Cluster prophylaxis: verapamil 240-960mg daily (monitor ECG for heart block)",
      "Medication overuse headache: gradual withdrawal of offending analgesic with bridging prophylaxis"
    ],
    "signs": {
      "left": [
        "Episodic migraine with predictable triggers and good response to acute therapy",
        "Infrequent tension-type headache responsive to OTC analgesics",
        "No neurological deficits on examination between attacks",
        "Headache frequency < 4 days/month (prophylaxis not yet indicated)"
      ],
      "right": [
        "Thunderclap headache (peak intensity within 60 seconds - SAH until proven otherwise)",
        "New daily persistent headache in patient > 50 (giant cell arteritis, mass lesion)",
        "Headache with papilledema (raised intracranial pressure - urgent imaging)",
        "Chronic daily headache with medication overuse (> 15 analgesic days/month)"
      ]
    },
    "medications": [
      {
        "name": "Sumatriptan (Imitrex)",
        "type": "Selective 5-HT1B/1D Receptor Agonist (Triptan)",
        "action": "Agonist at serotonin 5-HT1B receptors on meningeal vessels (vasoconstriction) and 5-HT1D receptors on trigeminal nerve terminals (inhibits CGRP and substance P release), aborting migraine through both vascular and neuronal mechanisms",
        "sideEffects": "Chest tightness/pressure (triptan sensation, not cardiac), tingling, flushing, dizziness, medication overuse headache if used >= 10 days/month",
        "contra": "Ischemic heart disease, uncontrolled hypertension, hemiplegic or basilar migraine, concurrent MAOI or ergotamine use, history of stroke or TIA",
        "pearl": "50-100mg PO at headache onset (can repeat in 2h, max 200mg/24h). 6mg SC for severe/rapid onset (most effective formulation). Limit to < 10 days/month to prevent medication overuse headache. Contraindicated in cardiovascular disease - assess risk before prescribing. Do NOT use within 24h of ergotamine."
      },
      {
        "name": "Topiramate (Topamax)",
        "type": "Antiepileptic / Migraine Prophylaxis",
        "action": "Multiple mechanisms: enhances GABA-A activity, blocks voltage-gated sodium and calcium channels, inhibits carbonic anhydrase, and antagonizes glutamate at AMPA/kainate receptors, reducing cortical excitability and migraine frequency",
        "sideEffects": "Cognitive impairment (word-finding difficulty - dopamax), paresthesias, weight loss, nephrolithiasis, metabolic acidosis, acute angle-closure glaucoma",
        "contra": "Pregnancy (cleft lip/palate risk - teratogenic), nephrolithiasis, metabolic acidosis, concurrent use with other carbonic anhydrase inhibitors",
        "pearl": "Start 25mg HS, titrate by 25mg weekly to 50-100mg BID. Weight loss side effect may be beneficial in obese migraine patients. Cognitive side effects are dose-related and often limit use (dopamax nickname). Teratogenic - ensure reliable contraception. Adequate hydration to prevent kidney stones. Takes 2-3 months for full efficacy."
      }
    ],
    "pearls": [
      "Thunderclap headache (maximal intensity within 60 seconds) is a neurological emergency requiring immediate non-contrast CT to rule out subarachnoid hemorrhage - if CT is negative, LP must follow to detect xanthochromia; the clinician must never attribute thunderclap headache to migraine",
      "Medication overuse headache (MOH) is the most common cause of chronic daily headache - the clinician must screen for analgesic use >= 15 days/month or triptan use >= 10 days/month and implement gradual withdrawal with prophylactic bridging therapy",
      "Cluster headache is frequently misdiagnosed as migraine despite distinct features: strictly unilateral, 15-180 minutes, circadian periodicity, ipsilateral autonomic symptoms (lacrimation, rhinorrhea, ptosis), and male predominance - high-flow oxygen and SC sumatriptan are first-line acute treatments"
    ],
    "quiz": [
      {
        "question": "A 45-year-old man presents with severe unilateral right periorbital headache lasting 90 minutes, occurring nightly at 0200 for the past 3 weeks. Associated with right-sided lacrimation, rhinorrhea, and conjunctival injection. He paces during attacks. What is the most appropriate acute treatment?",
        "options": [
          "Ibuprofen 600mg PO",
          "Sumatriptan 100mg PO",
          "High-flow oxygen 12-15 L/min via non-rebreather mask",
          "Morphine 5mg IV"
        ],
        "correct": 2,
        "rationale": "This presentation is classic cluster headache: unilateral periorbital pain, 15-180 min duration, circadian timing, ipsilateral autonomic features (lacrimation, rhinorrhea, conjunctival injection), and agitation/pacing. First-line acute treatment is high-flow oxygen 12-15 L/min x 15 min via non-rebreather mask (effective in 78% within 15 min) or sumatriptan 6mg SC (not oral - too slow for cluster). Oral analgesics and opioids are ineffective for cluster headache."
      }
    ]
  },
  "neuro-parkinsons-np": {
    "title": "Parkinson Disease",
    "cellular": {
      "title": "Dopaminergic Pathway Degeneration",
      "content": "Parkinson disease (PD) is a progressive neurodegenerative disorder characterized by loss of dopaminergic neurons in the substantia nigra pars compacta, part of the basal ganglia circuitry controlling motor planning and execution. The substantia nigra projects dopaminergic fibres to the striatum (caudate and putamen) via the nigrostriatal pathway. Dopamine modulates the direct (facilitatory, D1-mediated) and indirect (inhibitory, D2-mediated) basal ganglia pathways that regulate thalamocortical motor output. Loss of dopaminergic input disrupts this balance, resulting in excessive inhibitory output from the globus pallidus internus, suppressing thalamocortical activation and producing the cardinal motor features: bradykinesia (slowness of movement), rigidity (cogwheel or lead-pipe), resting tremor (4-6 Hz pill-rolling, asymmetric), and postural instability (late feature). Intraneuronal Lewy bodies containing misfolded alpha-synuclein are the pathological hallmark. Motor symptoms become clinically apparent when approximately 60-80% of striatal dopamine and 50% of nigral neurons are lost. Non-motor features (hyposmia, REM sleep behaviour disorder, constipation, depression) often precede motor symptoms by years."
    },
    "riskFactors": [
      "Age > 60 years (strongest risk factor, incidence increases with age)",
      "Male sex (1.5:1 male-to-female ratio)",
      "Family history (10-15% have first-degree relative with PD; LRRK2 and GBA mutations)",
      "Pesticide and herbicide exposure (paraquat, rotenone)",
      "History of traumatic brain injury",
      "Rural living and well-water consumption (environmental toxin exposure)",
      "Reduced caffeine and tobacco use (both inversely associated - not protective recommendations)"
    ],
    "diagnostics": [
      "Clinical diagnosis based on UK Brain Bank criteria: bradykinesia plus at least one of rigidity, resting tremor, or postural instability",
      "Asymmetric onset and excellent response to levodopa support the diagnosis",
      "DaTscan (dopamine transporter imaging) if diagnosis uncertain (distinguishes PD from essential tremor)",
      "MRI brain to exclude structural causes (normal in PD; abnormal in vascular parkinsonism, NPH)",
      "Assess for red flags suggesting atypical parkinsonism: early falls (PSP), early autonomic failure (MSA), symmetrical onset, poor levodopa response",
      "Cognitive screening (MoCA) for PD-associated cognitive impairment and dementia"
    ],
    "management": [
      "Early disease: may defer dopaminergic therapy if symptoms mild and not affecting function",
      "Levodopa/carbidopa (Sinemet): most effective symptomatic treatment, start 100/25mg TID and titrate",
      "Dopamine agonists (pramipexole, ropinirole): may be used as initial monotherapy in younger patients to delay levodopa motor complications",
      "MAO-B inhibitors (rasagiline 1mg daily, selegiline): mild symptomatic benefit, possible neuroprotective effects",
      "Motor complications management: wearing off (add COMT inhibitor entacapone, or increase levodopa frequency), dyskinesias (reduce levodopa dose, add amantadine)",
      "Non-motor symptom management: depression (SSRIs), REM sleep behaviour disorder (melatonin, clonazepam), constipation (PEG, fibre), orthostatic hypotension (midodrine, fludrocortisone)",
      "Refer to movement disorder specialist for advanced therapy (deep brain stimulation, levodopa-carbidopa intestinal gel)"
    ],
    "signs": {
      "left": [
        "Unilateral resting tremor with mild bradykinesia, minimal functional impact",
        "Excellent response to levodopa trial",
        "Preserved cognition and independence in ADLs",
        "Mild hyposmia and constipation (early non-motor features)"
      ],
      "right": [
        "Severe wearing-off with predictable end-of-dose deterioration",
        "Levodopa-induced dyskinesias (choreoathetoid involuntary movements)",
        "Freezing of gait with recurrent falls (increased fracture risk)",
        "PD dementia with visual hallucinations (Lewy body spectrum)"
      ]
    },
    "medications": [
      {
        "name": "Levodopa/Carbidopa (Sinemet)",
        "type": "Dopamine Precursor + Peripheral Decarboxylase Inhibitor",
        "action": "Levodopa crosses the blood-brain barrier and is converted to dopamine by aromatic L-amino acid decarboxylase in surviving nigrostriatal neurons; carbidopa inhibits peripheral decarboxylation, increasing CNS bioavailability and reducing peripheral side effects",
        "sideEffects": "Nausea (take with food, not high-protein meals), orthostatic hypotension, somnolence, hallucinations (especially in elderly), dyskinesias (with chronic use), wearing-off phenomenon",
        "contra": "Concurrent non-selective MAOI (hypertensive crisis), narrow-angle glaucoma, active GI bleeding",
        "pearl": "Start 100/25mg TID, titrate to symptom control. Most effective PD medication but chronic use leads to motor complications: wearing off (end-of-dose deterioration) in 50% at 5 years and dyskinesias in 40% at 5 years. Take 30 min before meals (protein competes for absorption via large neutral amino acid transporter). Dose fractionation helps reduce wearing off."
      },
      {
        "name": "Pramipexole (Mirapex)",
        "type": "Non-Ergot Dopamine Agonist (D2/D3 Preferring)",
        "action": "Directly stimulates postsynaptic dopamine D2 and D3 receptors in the striatum, providing dopaminergic stimulation independent of remaining nigrostriatal neurons",
        "sideEffects": "Somnolence (sleep attacks while driving), nausea, orthostatic hypotension, hallucinations, impulse control disorders (pathological gambling, hypersexuality, compulsive shopping/eating - 15-20% prevalence)",
        "contra": "Severe renal impairment (renally cleared - dose adjustment required), history of impulse control disorders",
        "pearl": "Start 0.125mg TID, titrate slowly over weeks. May be used as initial monotherapy in younger patients (< 65-70) to delay levodopa motor complications, though this strategy is debated. CRITICAL: Screen for impulse control disorders at every visit (gambling, hypersexuality, binge eating, compulsive shopping) - present in 15-20% of patients and often under-reported."
      }
    ],
    "pearls": [
      "TRAP mnemonic for Parkinson cardinal features: Tremor (resting, asymmetric, pill-rolling), Rigidity (cogwheel), Akinesia/bradykinesia (most disabling and required for diagnosis), Postural instability (late feature, indicates advanced disease with fall risk)",
      "Impulse control disorders affect 15-20% of patients on dopamine agonists (pramipexole, ropinirole) - the clinician must actively screen at every visit for pathological gambling, hypersexuality, compulsive shopping, and binge eating, as patients rarely volunteer this information",
      "Wearing-off phenomenon occurs in approximately 50% of patients after 5 years of levodopa therapy as the number of surviving dopaminergic neurons decreases, reducing the capacity to store and release dopamine - management includes adding COMT inhibitor (entacapone), increasing dosing frequency, or adding MAO-B inhibitor"
    ],
    "quiz": [
      {
        "question": "A 72-year-old man with Parkinson disease on levodopa/carbidopa 100/25mg TID for 6 years reports increasing stiffness and tremor returning 3 hours after each dose, with good symptom control for only 2 hours after taking medication. What is this phenomenon and appropriate management?",
        "options": [
          "Drug tolerance - increase levodopa to 200/50mg TID",
          "Wearing-off phenomenon - add entacapone (COMT inhibitor) or increase dosing frequency",
          "Levodopa failure - switch to dopamine agonist monotherapy",
          "Dyskinesia - reduce levodopa dose"
        ],
        "correct": 1,
        "rationale": "End-of-dose deterioration (wearing off) is a predictable motor complication after 5+ years of levodopa therapy. As dopaminergic neurons decline, the capacity to store exogenous dopamine decreases, shortening the duration of benefit. Management strategies include adding entacapone (COMT inhibitor that extends levodopa half-life), increasing dosing frequency (smaller, more frequent doses), or adding MAO-B inhibitor. Simply increasing the dose may worsen peak-dose dyskinesias."
      }
    ]
  },
  "neuro-delirium-dementia-np": {
    "title": "Delirium vs Dementia",
    "cellular": {
      "title": "Acute Encephalopathy vs Chronic",
      "content": "Delirium is an acute, fluctuating disturbance of consciousness and cognition caused by an underlying medical condition, medication, or substance. Its pathophysiology involves widespread cortical dysfunction from cholinergic deficiency, dopaminergic excess, neuroinflammation (elevated IL-6, TNF-alpha), and disruption of the blood-brain barrier. Delirium is reversible when the precipitating cause is identified and treated. Dementia, in contrast, is a chronic, progressive, irreversible decline in cognitive function affecting memory, executive function, language, and visuospatial ability. Alzheimer disease (60-80% of dementias) involves accumulation of extracellular beta-amyloid plaques and intracellular neurofibrillary tangles of hyperphosphorylated tau protein, leading to synaptic loss and neuronal death predominantly in the hippocampus and temporal cortex. Vascular dementia results from cumulative cerebrovascular ischemic injury. Delirium superimposed on dementia is common and worsens long-term cognitive trajectory."
    },
    "riskFactors": [
      "Advanced age (> 65 years, strongest risk factor for both conditions)",
      "Pre-existing dementia (greatest risk factor for delirium)",
      "Polypharmacy (especially anticholinergics, benzodiazepines, opioids)",
      "Acute infection (UTI, pneumonia are common delirium precipitants)",
      "Metabolic derangement (hyponatremia, hypoglycemia, uremia, hepatic encephalopathy)",
      "Sensory impairment (vision, hearing loss)",
      "Post-surgical state (especially hip fracture, cardiac surgery)"
    ],
    "diagnostics": [
      "Confusion Assessment Method (CAM): acute onset + fluctuating course + inattention + (disorganized thinking OR altered consciousness)",
      "Cognitive screening: Montreal Cognitive Assessment (MoCA) for dementia (score < 26/30 abnormal)",
      "CBC, electrolytes, creatinine, glucose, calcium, TSH, urinalysis, blood cultures",
      "Medication reconciliation (identify anticholinergic burden)",
      "CT head if focal neurological signs, head trauma, or anticoagulant use",
      "MRI brain with volumetry for dementia (hippocampal atrophy in Alzheimer disease)"
    ],
    "management": [
      "Delirium: identify and treat underlying cause (infection, metabolic, medication, pain, retention)",
      "Non-pharmacologic delirium management: reorientation, sleep-wake cycle preservation, mobilization, remove restraints",
      "Avoid benzodiazepines in delirium (worsen confusion) except in alcohol withdrawal",
      "Low-dose haloperidol 0.5-1mg only for severe agitation posing safety risk",
      "Alzheimer dementia: cholinesterase inhibitor (donepezil 5mg daily, increase to 10mg after 4-6 weeks)",
      "Add memantine (NMDA antagonist) for moderate-severe Alzheimer dementia",
      "Refer to geriatrics/neurology for diagnostic confirmation and management optimization"
    ],
    "signs": {
      "left": [
        "Mild delirium: inattention, disorientation to time, hypoactive presentation",
        "Early dementia: word-finding difficulty, misplacing items, intact ADLs",
        "Mini-Mental State Exam 20-24 (mild cognitive impairment)",
        "Preserved social functioning masking underlying cognitive decline"
      ],
      "right": [
        "Hyperactive delirium: agitation, hallucinations, pulling at lines/tubes",
        "Severe dementia: unable to perform basic ADLs, incontinence, non-verbal",
        "Delirium superimposed on dementia with rapid functional decline",
        "Behavioral and psychological symptoms of dementia (BPSD): aggression, wandering, sundowning"
      ]
    },
    "medications": [
      {
        "name": "Donepezil (Aricept)",
        "type": "Cholinesterase Inhibitor",
        "action": "Reversibly inhibits acetylcholinesterase in the CNS, increasing acetylcholine availability at synapses and partially compensating for cholinergic neuron loss in Alzheimer disease",
        "sideEffects": "Nausea, diarrhea, insomnia, vivid dreams, bradycardia, syncope, muscle cramps, weight loss",
        "contra": "Sick sinus syndrome or other supraventricular conduction abnormalities (without pacemaker), active GI bleeding, severe hepatic impairment",
        "pearl": "Start 5mg at bedtime for 4-6 weeks, then increase to 10mg. Provides modest symptomatic benefit (does NOT halt disease progression). Monitor for bradycardia especially with concurrent beta-blockers. GI side effects usually transient. If not tolerated, try rivastigmine patch (fewer GI effects)."
      },
      {
        "name": "Memantine (Ebixa)",
        "type": "NMDA Receptor Antagonist",
        "action": "Blocks excessive glutamate-mediated NMDA receptor activation, reducing excitotoxic neuronal damage in moderate-to-severe Alzheimer disease while preserving physiological signaling",
        "sideEffects": "Dizziness, headache, constipation, confusion, somnolence",
        "contra": "Severe renal impairment (GFR < 30 mL/min - dose reduction required), concurrent use of other NMDA antagonists (amantadine, dextromethorphan)",
        "pearl": "Start 5mg daily, titrate by 5mg weekly to 10mg BID (target 20mg/day). Can be combined with cholinesterase inhibitor for additional benefit in moderate-severe disease. Reduce dose to 5mg BID if GFR 5-29 mL/min. Better tolerated than cholinesterase inhibitors."
      }
    ],
    "pearls": [
      "The CAM tool is the gold standard for delirium screening: it requires acute onset with fluctuating course PLUS inattention PLUS either disorganized thinking OR altered level of consciousness - the clinician must apply this systematically in all acutely confused older adults",
      "Delirium is a medical emergency that indicates an underlying treatable condition - the clinician must pursue the cause (UTI, pneumonia, medications, constipation, urinary retention, pain, metabolic derangement) rather than simply medicating the confusion",
      "Cholinesterase inhibitors provide modest symptomatic improvement in Alzheimer dementia but do NOT slow disease progression - the clinician must set realistic expectations with families and reassess benefit every 6-12 months, discontinuing if no perceived benefit or significant side effects"
    ],
    "quiz": [
      {
        "question": "An 82-year-old nursing home resident with known mild Alzheimer dementia becomes acutely confused, inattentive, and agitated over 24 hours. She is pulling at her IV. Temperature 38.4 degrees Celsius, HR 102, BP 108/62. What is the priority nursing practitioner action?",
        "options": [
          "Increase donepezil dose to 23mg daily",
          "Order haloperidol 5mg IM for agitation",
          "Obtain urinalysis, blood cultures, CBC, electrolytes, and chest X-ray to identify precipitating cause",
          "Apply physical restraints for safety and order CT head"
        ],
        "correct": 2,
        "rationale": "This presentation is delirium superimposed on dementia (acute onset, fluctuating, inattention, agitation in a patient with baseline cognitive impairment). The clinician priority is identifying the underlying cause (UTI, pneumonia, sepsis given fever and tachycardia). Increasing donepezil does not treat delirium. High-dose haloperidol and restraints are inappropriate and harmful. Targeted investigation is the standard of care."
      }
    ]
  },
  "neuro-pain-physiology-np": {
    "title": "Pain Physiology and Management",
    "cellular": {
      "title": "Nociceptive and Neuropathic Pain Pathways",
      "content": "Pain signaling begins with transduction at peripheral nociceptors (A-delta fibres for sharp, localized pain; C fibres for dull, diffuse pain), followed by transmission via dorsal root ganglia to the dorsal horn of the spinal cord. In the dorsal horn, substance P and glutamate mediate synaptic transmission to second-order neurons that cross and ascend via the spinothalamic tract to the thalamus, then to somatosensory cortex for localization and limbic system for emotional processing. Descending inhibitory pathways from the periaqueductal grey and rostral ventromedial medulla modulate pain via endogenous opioids, serotonin, and norepinephrine. Neuropathic pain arises from damage to the somatosensory nervous system causing ectopic firing, central sensitization, and aberrant signaling (allodynia, hyperalgesia). Peripheral sensitization involves increased excitability of nociceptors from inflammatory mediators, while central sensitization involves wind-up and long-term potentiation in dorsal horn neurons."
    },
    "riskFactors": [
      "Diabetes mellitus (most common cause of peripheral neuropathy)",
      "Post-surgical or post-traumatic nerve injury",
      "Herpes zoster (postherpetic neuralgia risk increases with age)",
      "Cancer (tumor infiltration, chemotherapy-induced neuropathy)",
      "Chronic opioid use (opioid-induced hyperalgesia)",
      "Psychological comorbidity (depression, anxiety amplify pain perception)",
      "Fibromyalgia and central sensitization syndromes"
    ],
    "diagnostics": [
      "Validated pain assessment scales: Numeric Rating Scale (NRS 0-10), Visual Analogue Scale (VAS)",
      "Neuropathic pain screening: DN4 questionnaire (score >= 4/10 suggests neuropathic component)",
      "Nerve conduction studies and electromyography (EMG) for peripheral neuropathy",
      "HbA1c and fasting glucose (diabetic neuropathy workup)",
      "MRI spine if radiculopathy or myelopathy suspected",
      "Quantitative sensory testing for research or complex cases"
    ],
    "management": [
      "WHO analgesic ladder: Step 1 (non-opioid: acetaminophen, NSAID), Step 2 (weak opioid), Step 3 (strong opioid)",
      "Neuropathic pain first-line: gabapentin or pregabalin (calcium channel alpha-2-delta ligands)",
      "Alternative neuropathic agents: duloxetine (SNRI), amitriptyline (TCA - avoid in elderly)",
      "Multimodal analgesia: combine different mechanisms to reduce opioid requirements",
      "Non-pharmacologic: physiotherapy, cognitive-behavioral therapy, TENS, acupuncture",
      "Opioid prescribing: lowest effective dose, short duration, monitor with morphine milligram equivalents (MME), reassess regularly",
      "Referral to pain specialist for refractory cases or complex regional pain syndrome"
    ],
    "signs": {
      "left": [
        "Acute nociceptive pain: localized, proportional to tissue injury, responds to analgesics",
        "Mild neuropathic symptoms: intermittent tingling, numbness in stocking-glove distribution",
        "Pain controlled with non-opioid multimodal regimen",
        "Functional improvement with treatment (able to perform ADLs)"
      ],
      "right": [
        "Severe neuropathic pain: allodynia, hyperalgesia, burning/lancinating quality, sleep disruption",
        "Opioid-induced hyperalgesia: paradoxical pain increase with escalating opioid doses",
        "Complex regional pain syndrome: disproportionate pain, autonomic changes, trophic changes",
        "Chronic pain with significant functional impairment, depression, and social withdrawal"
      ]
    },
    "medications": [
      {
        "name": "Gabapentin (Neurontin)",
        "type": "Calcium Channel Alpha-2-Delta Ligand",
        "action": "Binds the alpha-2-delta subunit of voltage-gated calcium channels in dorsal horn neurons, reducing calcium influx and excitatory neurotransmitter release (glutamate, substance P), thereby attenuating central sensitization",
        "sideEffects": "Somnolence, dizziness, peripheral edema, weight gain, ataxia, respiratory depression (especially with opioids or in renal impairment)",
        "contra": "Severe renal impairment (dose adjustment required for GFR < 60 mL/min), concurrent CNS depressants (additive sedation), myasthenia gravis",
        "pearl": "Start 100-300mg at bedtime, titrate by 100-300mg every 3-7 days to effect (usual 900-3600mg/day in 3 divided doses). Renally cleared - dose reduction essential in renal impairment. Canadian opioid guidelines now recommend gabapentinoids as first-line for neuropathic pain before considering opioids. Monitor for misuse potential."
      },
      {
        "name": "Duloxetine (Cymbalta)",
        "type": "Serotonin-Norepinephrine Reuptake Inhibitor (SNRI)",
        "action": "Inhibits reuptake of both serotonin and norepinephrine in the descending inhibitory pain pathways, enhancing endogenous pain modulation; also effective for comorbid depression",
        "sideEffects": "Nausea (most common, usually transient), dizziness, dry mouth, constipation, insomnia, increased blood pressure, hepatotoxicity (rare), serotonin syndrome (with other serotonergic agents)",
        "contra": "Concurrent MAOI (serotonin syndrome risk), severe hepatic impairment, uncontrolled narrow-angle glaucoma, concurrent use of thioridazine",
        "pearl": "Start 30mg daily for 1-2 weeks, then increase to 60mg daily (target dose for neuropathic pain). Effective for diabetic peripheral neuropathy, fibromyalgia, and chronic musculoskeletal pain. Dual benefit when pain and depression coexist. Taper slowly to avoid discontinuation syndrome. Monitor BP periodically."
      }
    ],
    "pearls": [
      "The WHO analgesic ladder remains the framework for cancer pain management but modern practice emphasizes multimodal analgesia for non-cancer pain - the clinician should combine acetaminophen, NSAIDs, gabapentinoids, and non-pharmacologic strategies before escalating to opioids",
      "Gabapentin and pregabalin are first-line for neuropathic pain but carry significant misuse potential and cause respiratory depression when combined with opioids - the clinician must assess for substance use disorder and avoid concurrent prescribing with opioids when possible",
      "Morphine milligram equivalents (MME) guide opioid prescribing safety: the clinician should calculate total daily MME and exercise extreme caution above 50 MME/day (increased overdose risk) with reassessment and specialist referral recommended above 90 MME/day"
    ],
    "quiz": [
      {
        "question": "A 58-year-old with type 2 diabetes reports burning pain, numbness, and tingling in both feet worse at night. HbA1c 8.2%. DN4 score 6/10. Current medications include metformin and ramipril. What is the most appropriate initial pharmacotherapy for this pain?",
        "options": [
          "Oxycodone 5mg every 6 hours",
          "Gabapentin 100mg at bedtime, titrate to effect",
          "Ibuprofen 400mg three times daily",
          "Morphine sustained-release 15mg twice daily"
        ],
        "correct": 1,
        "rationale": "DN4 score >= 4 confirms neuropathic pain (diabetic peripheral neuropathy). Gabapentin is first-line for neuropathic pain per Canadian guidelines. Start low (100mg at bedtime) and titrate gradually. NSAIDs are ineffective for neuropathic pain. Opioids are not first-line for neuropathic pain and carry significant risks. Optimize glycemic control concurrently."
      }
    ]
  },
  "neuro-sleep-disorders-np": {
    "title": "Sleep Disorders",
    "cellular": {
      "title": "Sleep Architecture",
      "content": "Normal sleep architecture cycles through NREM stages (N1, N2, N3 slow-wave sleep) and REM sleep in 90-minute cycles. Sleep regulation involves the circadian system (suprachiasmatic nucleus responding to light via melatonin secretion from the pineal gland) and the homeostatic sleep drive (adenosine accumulation during wakefulness). Obstructive sleep apnea (OSA) results from pharyngeal airway collapse during sleep due to anatomic narrowing (obesity, macroglossia, tonsillar hypertrophy) combined with reduced neuromuscular tone. Repetitive apneas cause intermittent hypoxia, hypercapnia, sympathetic surges, and sleep fragmentation, leading to cardiovascular complications (hypertension, atrial fibrillation, stroke, heart failure). Insomnia involves hyperarousal of the hypothalamic-pituitary-adrenal axis and cortical activation. Restless legs syndrome involves dopaminergic dysfunction in the diencephalon and iron deficiency in the substantia nigra."
    },
    "riskFactors": [
      "Obesity (BMI > 30 kg/m2 - strongest modifiable risk for OSA)",
      "Male sex (OSA 2-3x more common in men, though post-menopausal women approach male rates)",
      "Craniofacial anatomy (retrognathia, macroglossia, large neck circumference > 43 cm)",
      "Increasing age (OSA and insomnia prevalence increase)",
      "Alcohol and sedative use (worsen OSA and impair sleep architecture)",
      "Shift work (circadian disruption)",
      "Iron deficiency (ferritin < 75 mcg/L associated with restless legs syndrome)"
    ],
    "diagnostics": [
      "Polysomnography (PSG): gold standard for OSA diagnosis (AHI >= 5 events/hour with symptoms or >= 15 regardless)",
      "Home sleep apnea testing (HSAT) for moderate-to-high pretest probability without significant comorbidities",
      "Epworth Sleepiness Scale (ESS) for subjective daytime sleepiness (score > 10 abnormal)",
      "STOP-BANG questionnaire for OSA screening (score >= 3 indicates high risk)",
      "Serum ferritin for restless legs syndrome (target > 75 mcg/L for treatment)",
      "Sleep diary and actigraphy for insomnia and circadian rhythm disorders"
    ],
    "management": [
      "OSA: CPAP therapy is first-line (titrated to eliminate apneas); adherence defined as >= 4 hours/night on >= 70% of nights",
      "OSA adjuncts: weight loss (10% weight reduction can halve AHI), positional therapy, oral appliance (mandibular advancement device) for mild-moderate OSA",
      "Insomnia: CBT-I (cognitive-behavioral therapy for insomnia) is first-line over pharmacotherapy",
      "Insomnia pharmacotherapy if CBT-I insufficient: short-term zopiclone or melatonin receptor agonist, avoid benzodiazepines in elderly",
      "RLS with iron deficiency: oral iron supplementation (ferrous sulfate 325mg with vitamin C on empty stomach) targeting ferritin > 75 mcg/L",
      "RLS pharmacotherapy: dopamine agonists (pramipexole, ropinirole) or gabapentin for moderate-severe cases",
      "Refer to sleep medicine for refractory cases, narcolepsy, or complex presentations"
    ],
    "signs": {
      "left": [
        "Mild OSA (AHI 5-15): snoring, mild daytime sleepiness, no cardiovascular sequelae",
        "Situational insomnia (< 3 months duration) with identifiable stressor",
        "Occasional RLS symptoms not affecting sleep quality",
        "ESS score 10-12 with minimal functional impairment"
      ],
      "right": [
        "Severe OSA (AHI > 30): witnessed apneas, severe somnolence, treatment-resistant hypertension",
        "Chronic insomnia (>= 3 months, >= 3 nights/week) with significant daytime impairment",
        "Severe RLS with augmentation (symptoms earlier in day, spread to upper limbs)",
        "Narcolepsy with cataplexy (sudden muscle weakness with emotion)"
      ]
    },
    "medications": [
      {
        "name": "CPAP (Continuous Positive Airway Pressure)",
        "type": "Positive Airway Pressure Device",
        "action": "Delivers continuous positive pressure via nasal or full-face mask acting as a pneumatic splint to maintain pharyngeal airway patency, eliminating obstructive apneas and hypopneas",
        "sideEffects": "Mask discomfort, nasal congestion/dryness, aerophagia (air swallowing), claustrophobia, skin irritation from mask",
        "contra": "Pneumothorax (untreated), CSF leak, recent facial/upper airway surgery, inability to protect airway (impaired consciousness)",
        "pearl": "Titrate pressure during PSG or use auto-titrating CPAP (APAP). Adherence is the major challenge: use heated humidification, proper mask fitting, ramp function. Benefits include reduced daytime sleepiness, reduced BP (2-3 mmHg), reduced cardiovascular events. Must counsel commercial drivers about mandatory treatment compliance."
      },
      {
        "name": "Pramipexole (Mirapex)",
        "type": "Non-Ergot Dopamine Agonist (D2/D3)",
        "action": "Directly stimulates D2 and D3 dopamine receptors, correcting the dopaminergic dysfunction in the diencephalon underlying restless legs syndrome",
        "sideEffects": "Nausea, somnolence, orthostatic hypotension, impulse control disorders (gambling, hypersexuality), augmentation (worsening of RLS symptoms with chronic use - earlier onset, spreading to arms)",
        "contra": "History of impulse control disorders, severe renal impairment (dose adjustment required)",
        "pearl": "For RLS: start 0.125mg 2-3 hours before bedtime, maximum 0.5mg. Use lowest effective dose to minimize augmentation risk. Augmentation is the main long-term complication of dopamine agonists in RLS (occurs in 20-70% over 10 years). If augmentation develops, taper off and switch to gabapentin or pregabalin. Always check and correct iron stores first."
      }
    ],
    "pearls": [
      "OSA is an independent cardiovascular risk factor - the clinician must screen patients with treatment-resistant hypertension, atrial fibrillation, and type 2 diabetes using the STOP-BANG questionnaire, as up to 80% of moderate-severe OSA remains undiagnosed",
      "CBT-I is first-line for chronic insomnia over pharmacotherapy - the clinician should recommend sleep restriction, stimulus control, and cognitive restructuring before prescribing hypnotics, which carry risks of dependence, falls, and cognitive impairment in elderly patients",
      "For restless legs syndrome, the clinician must check serum ferritin before prescribing dopamine agonists - iron replacement (target ferritin > 75 mcg/L) alone may resolve symptoms and avoids the risk of augmentation that occurs in 20-70% of patients on long-term dopamine agonist therapy"
    ],
    "quiz": [
      {
        "question": "A 55-year-old obese man (BMI 38 kg/m2) with hypertension on three antihypertensives and type 2 diabetes presents with excessive daytime sleepiness, witnessed apneas, and morning headaches. STOP-BANG score 7/8. What is the most appropriate next step?",
        "options": [
          "Prescribe zopiclone for sleep quality improvement",
          "Order polysomnography or home sleep apnea test",
          "Start melatonin 3mg at bedtime",
          "Refer to ENT for tonsillectomy"
        ],
        "correct": 1,
        "rationale": "STOP-BANG >= 3 indicates high OSA risk, and this patient has classic features (obesity, witnessed apneas, somnolence, treatment-resistant hypertension). PSG or HSAT is needed to confirm diagnosis and determine severity (AHI). Sedative-hypnotics would worsen OSA. Melatonin does not treat OSA. Tonsillectomy may be considered after diagnosis but is not first-line in adults."
      }
    ]
  },
  "neuro-depression-anxiety-np": {
    "title": "Depression and Anxiety Disorders",
    "cellular": {
      "title": "Monoamine Dysregulation and Neuroplasticity",
      "content": "Major depressive disorder (MDD) involves dysregulation of monoamine neurotransmitters (serotonin, norepinephrine, dopamine) in prefrontal cortex, hippocampus, and limbic structures. The monoamine hypothesis posits that depression results from deficient serotonergic and noradrenergic transmission, though current understanding encompasses neuroplasticity deficits, hypothalamic-pituitary-adrenal (HPA) axis hyperactivity with chronic cortisol elevation, neuroinflammation, and reduced brain-derived neurotrophic factor (BDNF). Chronic stress-induced cortisol elevation causes hippocampal atrophy and prefrontal cortex hypofunction. Generalized anxiety disorder (GAD) involves excessive activation of the amygdala fear circuits with insufficient prefrontal cortical inhibition. GABA (inhibitory) and glutamate (excitatory) imbalance contributes to the hyperarousal state. SSRIs increase serotonin availability by blocking presynaptic reuptake, but clinical effect takes 4-6 weeks due to required downstream neuroplastic changes including BDNF upregulation and hippocampal neurogenesis."
    },
    "riskFactors": [
      "Family history of mood or anxiety disorders (heritability 40-50% for MDD)",
      "History of adverse childhood experiences or trauma",
      "Chronic medical illness (diabetes, cardiovascular disease, cancer, chronic pain)",
      "Substance use disorder (alcohol, cannabis, stimulants)",
      "Social isolation, unemployment, relationship breakdown",
      "Female sex (2x risk of MDD compared to males)",
      "Previous depressive episodes (50% recurrence after first episode, 90% after third)"
    ],
    "diagnostics": [
      "PHQ-9 screening (score >= 10 suggests moderate depression; >= 20 severe)",
      "GAD-7 screening (score >= 10 suggests moderate anxiety; >= 15 severe)",
      "DSM-5 criteria for MDD: >= 5 symptoms for >= 2 weeks including depressed mood or anhedonia",
      "Columbia Suicide Severity Rating Scale (C-SSRS) for suicidality assessment",
      "TSH to rule out thyroid disorder mimicking depression or anxiety",
      "CBC, electrolytes, B12, folate to exclude medical causes"
    ],
    "management": [
      "Mild depression: watchful waiting, exercise prescription, psychotherapy (CBT), reassess in 2-4 weeks",
      "Moderate-severe depression: SSRI first-line (sertraline or escitalopram) + psychotherapy (CBT or IPT)",
      "GAD: SSRI or SNRI first-line; CBT is first-line psychotherapy",
      "Assess suicide risk at every visit using structured tool (C-SSRS)",
      "Adequate trial: 4-6 weeks at therapeutic dose before switching; optimize dose before changing agent",
      "If SSRI fails: switch to another SSRI, switch to SNRI, or augment (aripiprazole, lithium)",
      "Benzodiazepines only short-term (< 2-4 weeks) for acute anxiety; avoid in elderly, substance use disorder, and as monotherapy"
    ],
    "signs": {
      "left": [
        "Mild depression (PHQ-9 5-9): low mood, reduced interest, still functioning at work/home",
        "Mild anxiety: worry about multiple domains, muscle tension, manageable with coping strategies",
        "Sleep disturbance with preserved appetite and energy",
        "No suicidal ideation, no psychotic features"
      ],
      "right": [
        "Severe depression (PHQ-9 >= 20): psychomotor retardation, anhedonia, significant weight change, suicidal ideation",
        "Panic disorder: recurrent unexpected panic attacks with agoraphobia",
        "Serotonin syndrome: agitation, clonus, hyperthermia, diaphoresis (from serotonergic drug interactions)",
        "Active suicidal ideation with plan and intent requiring immediate psychiatric referral or hospitalization"
      ]
    },
    "medications": [
      {
        "name": "Sertraline (Zoloft)",
        "type": "Selective Serotonin Reuptake Inhibitor (SSRI)",
        "action": "Selectively inhibits presynaptic serotonin reuptake transporter (SERT), increasing serotonin availability in the synaptic cleft; downstream effects include BDNF upregulation and hippocampal neurogenesis over 4-6 weeks",
        "sideEffects": "Nausea, diarrhea, headache, insomnia, sexual dysfunction (delayed ejaculation, anorgasmia), weight gain (long-term), increased bleeding risk (platelet serotonin depletion)",
        "contra": "Concurrent MAOI (14-day washout required - serotonin syndrome risk), concurrent pimozide or thioridazine, known QT prolongation",
        "pearl": "Start 50mg daily (25mg if anxiety prominent to avoid initial activation). Therapeutic dose range 50-200mg. Black box warning: monitor for increased suicidality in patients < 25 years during first weeks. Allow 4-6 weeks at therapeutic dose before declaring failure. Safest SSRI in cardiac patients. Fewest drug interactions among SSRIs."
      },
      {
        "name": "Escitalopram (Cipralex)",
        "type": "Selective Serotonin Reuptake Inhibitor (SSRI)",
        "action": "Most selective SSRI; inhibits SERT with minimal off-target receptor binding, providing serotonin reuptake inhibition with the cleanest side effect profile among SSRIs",
        "sideEffects": "Nausea, headache, insomnia or somnolence, sexual dysfunction, QTc prolongation (dose-dependent, especially > 20mg)",
        "contra": "Concurrent MAOI, known QT prolongation or concurrent QT-prolonging medications, doses > 20mg/day (risk of QTc prolongation)",
        "pearl": "Start 10mg daily; maximum 20mg. S-enantiomer of citalopram with greater potency. First-line for both MDD and GAD due to efficacy and tolerability. Dose-dependent QTc prolongation (especially > 20mg) - obtain baseline ECG if risk factors. CRITICAL: FDA black box warning for suicidality risk in children, adolescents, and young adults < 25 during initial treatment."
      }
    ],
    "pearls": [
      "PHQ-9 is the standard depression screening and monitoring tool - the clinician should administer at baseline, 4-6 weeks after starting treatment, and at every follow-up; a 50% reduction in score indicates treatment response, and score < 5 indicates remission",
      "The FDA black box warning for SSRIs applies to patients under 25 years - the clinician must provide close follow-up (weekly for first 4 weeks, biweekly for next 4 weeks) and assess suicidality using the C-SSRS at each visit during the initial treatment period",
      "Serotonin syndrome is a life-threatening emergency from excessive serotonergic activity - the clinician must recognize the triad of altered mental status, autonomic instability, and neuromuscular hyperactivity (clonus, hyperreflexia) and must never combine SSRIs with MAOIs, tramadol, or linezolid"
    ],
    "quiz": [
      {
        "question": "A 22-year-old university student presents with 4 weeks of persistent low mood, anhedonia, insomnia, poor concentration, and feelings of worthlessness. PHQ-9 score 16. She denies suicidal ideation. What is the most appropriate management plan?",
        "options": [
          "Start lorazepam 1mg three times daily for anxiety",
          "Start sertraline 25-50mg daily, arrange follow-up in 1-2 weeks with suicide risk monitoring per black box warning, and refer for CBT",
          "Prescribe amitriptyline 75mg at bedtime for sleep and mood",
          "Recommend exercise and reassess in 3 months"
        ],
        "correct": 1,
        "rationale": "PHQ-9 of 16 indicates moderately severe depression warranting pharmacotherapy plus psychotherapy. Sertraline is first-line SSRI. Patient is < 25 years requiring close monitoring per FDA black box warning (increased suicidality risk in initial weeks). Benzodiazepines are not first-line for depression. TCAs are not first-line due to side effect burden. Watchful waiting alone is inappropriate for moderate-severe depression."
      }
    ]
  },
  "endo-dka-np": {
    "title": "Diabetic Ketoacidosis",
    "cellular": {
      "title": "DKA Pathophysiology: Insulin Deficiency",
      "content": "Diabetic ketoacidosis results from absolute or relative insulin deficiency combined with counter-regulatory hormone excess (glucagon, cortisol, catecholamines, growth hormone). Insulin deficiency prevents glucose uptake by peripheral tissues and fails to suppress hepatic gluconeogenesis and glycogenolysis, producing severe hyperglycemia (typically > 14 mmol/L). Without insulin, adipose tissue undergoes unrestrained lipolysis, releasing free fatty acids that undergo hepatic beta-oxidation to acetyl-CoA. Excess acetyl-CoA overwhelms the Krebs cycle and is diverted to ketogenesis, producing acetoacetate, beta-hydroxybutyrate, and acetone. These ketoacids dissociate at physiologic pH, releasing hydrogen ions and causing high anion gap metabolic acidosis (pH < 7.3, bicarbonate < 18 mmol/L). Osmotic diuresis from glycosuria causes profound dehydration (average 5-7 L deficit), electrolyte losses (especially potassium, sodium, phosphate), and prerenal azotemia. Total body potassium is severely depleted despite initial serum levels that may be normal or elevated due to acidosis-driven transcellular shift."
    },
    "riskFactors": [
      "Type 1 diabetes mellitus (most common, but DKA can occur in type 2)",
      "Insulin omission or pump failure (most common precipitant)",
      "Acute infection (pneumonia, UTI, sepsis trigger counter-regulatory hormones)",
      "New-onset diabetes (DKA as presenting feature in 25-30% of T1DM)",
      "Myocardial infarction, stroke, or major physiologic stress",
      "SGLT2 inhibitor use (euglycemic DKA with glucose < 14 mmol/L)",
      "Corticosteroid therapy, substance abuse (cocaine, alcohol)"
    ],
    "diagnostics": [
      "Blood glucose > 14 mmol/L (or euglycemic DKA if on SGLT2 inhibitor)",
      "Venous blood gas: pH < 7.3, bicarbonate < 18 mmol/L",
      "Serum ketones: beta-hydroxybutyrate > 3.0 mmol/L (preferred over urine ketones)",
      "Anion gap calculation: Na - (Cl + HCO3) > 12 mmol/L (high anion gap metabolic acidosis)",
      "Serum potassium (may be falsely normal or elevated despite total body depletion)",
      "CBC, blood cultures, urinalysis, chest X-ray (identify precipitating infection)"
    ],
    "management": [
      "Aggressive IV fluid resuscitation: 0.9% NaCl 1-1.5 L/h for first hour, then 250-500 mL/h guided by hemodynamics",
      "Potassium replacement BEFORE insulin if K+ < 3.3 mmol/L; hold insulin until K+ >= 3.3 mmol/L",
      "If K+ 3.3-5.3 mmol/L: add 20-40 mmol KCl per litre of IV fluid; monitor K+ every 1-2 hours",
      "Insulin infusion: regular insulin 0.1 units/kg/h IV (start only after K+ >= 3.3 mmol/L)",
      "When glucose < 14 mmol/L: add D5W to IV fluids and reduce insulin to 0.02-0.05 units/kg/h to prevent hypoglycemia while continuing to clear ketones",
      "Resolution criteria: pH > 7.3, bicarbonate > 18 mmol/L, anion gap < 12, patient eating",
      "Transition to subcutaneous insulin: overlap IV and SC insulin by 1-2 hours to prevent rebound DKA"
    ],
    "signs": {
      "left": [
        "Mild DKA: pH 7.25-7.30, alert, mild dehydration, glucose 14-20 mmol/L",
        "Kussmaul respirations (deep, rapid breathing compensating for acidosis)",
        "Nausea, vomiting, diffuse abdominal pain",
        "Fruity breath odor (acetone)"
      ],
      "right": [
        "Severe DKA: pH < 7.0, obtunded/comatose, profound dehydration",
        "Hypotension and tachycardia from severe volume depletion",
        "Cerebral edema (primarily in pediatric DKA - deadly complication of overly rapid correction)",
        "Hypokalemia-induced cardiac arrhythmias during insulin therapy if K+ not monitored"
      ]
    },
    "medications": [
      {
        "name": "Regular Insulin IV Infusion",
        "type": "Rapid-Acting Insulin (IV)",
        "action": "Binds insulin receptors on hepatocytes, adipocytes, and muscle cells, suppressing gluconeogenesis, inhibiting lipolysis and ketogenesis, and promoting cellular glucose uptake; IV route provides immediate onset with precise dose titration",
        "sideEffects": "Hypoglycemia (most common and dangerous), hypokalemia (insulin drives K+ intracellularly), hypophosphatemia",
        "contra": "Hypokalemia < 3.3 mmol/L (must correct K+ first - insulin will worsen hypokalemia causing fatal arrhythmia), confirmed hypoglycemia",
        "pearl": "0.1 units/kg/h continuous infusion. Target glucose decrease 3-4 mmol/L per hour. When glucose < 14 mmol/L, add D5W and reduce rate but do NOT stop insulin until ketoacidosis resolves (pH > 7.3, bicarb > 18). CRITICAL: Check K+ before starting insulin and every 1-2 hours during infusion. Replace K+ aggressively."
      },
      {
        "name": "Potassium Chloride (KCl) IV",
        "type": "Electrolyte Replacement",
        "action": "Replaces total body potassium deficit caused by osmotic diuresis, vomiting, and renal losses in DKA; prevents life-threatening hypokalemia as insulin drives potassium intracellularly",
        "sideEffects": "Hyperkalemia if infused too rapidly (cardiac arrest), phlebitis at IV site, nausea",
        "contra": "Serum K+ > 5.3 mmol/L (recheck in 1-2 hours), severe renal failure (GFR < 10 mL/min), complete heart block",
        "pearl": "If K+ < 3.3 mmol/L: give 20-40 mmol/h and HOLD insulin until K+ >= 3.3. If K+ 3.3-5.3 mmol/L: add 20-40 mmol per litre of IV fluid. If K+ > 5.3: hold K+ replacement, recheck in 2 hours. Maximum IV rate: 10-20 mmol/h via peripheral line, 40 mmol/h via central line with cardiac monitoring. Total body K+ deficit in DKA averages 3-5 mmol/kg."
      }
    ],
    "pearls": [
      "The most dangerous error in DKA management is starting insulin before checking potassium - if K+ < 3.3 mmol/L, insulin will drive potassium further intracellularly causing fatal cardiac arrhythmias; the clinician must hold insulin and replace potassium first",
      "Euglycemic DKA (glucose < 14 mmol/L with ketoacidosis) occurs with SGLT2 inhibitors (empagliflozin, dapagliflozin, canagliflozin) - the clinician must have a low threshold for checking ketones in patients on SGLT2 inhibitors presenting with nausea, vomiting, or malaise even with near-normal glucose",
      "DKA resolution is defined by normalization of pH and bicarbonate, not glucose - the clinician must continue insulin infusion after glucose normalizes (add D5W to prevent hypoglycemia) until pH > 7.3 and bicarbonate > 18 mmol/L, then overlap subcutaneous insulin for 1-2 hours before discontinuing the drip"
    ],
    "quiz": [
      {
        "question": "A 28-year-old with type 1 diabetes presents with nausea, vomiting, and abdominal pain. Blood glucose 24 mmol/L, pH 7.18, bicarbonate 10 mmol/L, serum K+ 3.0 mmol/L, beta-hydroxybutyrate 5.8 mmol/L. IV 0.9% NaCl is running. What is the clinician priority?",
        "options": [
          "Start insulin infusion at 0.1 units/kg/h immediately",
          "Administer IV sodium bicarbonate to correct acidosis",
          "Replace potassium (20-40 mmol/h IV KCl) and hold insulin until K+ >= 3.3 mmol/L",
          "Switch IV fluid to D5W to prevent hypoglycemia"
        ],
        "correct": 2,
        "rationale": "Serum K+ 3.0 mmol/L is critically low. Starting insulin with hypokalemia < 3.3 mmol/L will further drive K+ intracellularly, risking fatal cardiac arrhythmias. The absolute priority is IV potassium replacement and holding insulin until K+ is >= 3.3 mmol/L. Sodium bicarbonate is not recommended unless pH < 6.9. D5W is not needed yet as glucose is 24 mmol/L."
      }
    ]
  },
  "endo-adrenal-np": {
    "title": "Adrenal Disorders: Cushing and Addison",
    "cellular": {
      "title": "Cortisol Excess",
      "content": "The adrenal cortex produces cortisol (zona fasciculata), aldosterone (zona glomerulosa), and androgens (zona reticularis) under regulation by the hypothalamic-pituitary-adrenal (HPA) axis. Cushing syndrome results from chronic cortisol excess, most commonly from exogenous glucocorticoid administration (iatrogenic), ACTH-secreting pituitary adenoma (Cushing disease, 70% of endogenous cases), ectopic ACTH production (small cell lung cancer), or adrenal adenoma/carcinoma. Excess cortisol causes proteolysis (muscle wasting, thin skin, striae), gluconeogenesis (hyperglycemia, insulin resistance), lipogenesis (central obesity, moon facies, buffalo hump), immunosuppression, and osteoporosis. Addison disease (primary adrenal insufficiency) results from autoimmune destruction of the adrenal cortex (80% of cases in developed countries), causing deficiency of cortisol, aldosterone, and androgens. Loss of cortisol negative feedback leads to elevated ACTH and melanocyte-stimulating hormone (MSH), producing characteristic hyperpigmentation. Adrenal crisis is a life-threatening emergency from acute cortisol deficiency precipitated by stress, illness, or abrupt glucocorticoid withdrawal."
    },
    "riskFactors": [
      "Chronic exogenous glucocorticoid use (most common cause of Cushing syndrome)",
      "Pituitary adenoma (Cushing disease, most common endogenous cause)",
      "Autoimmune disease (autoimmune adrenalitis is most common cause of Addison disease)",
      "Tuberculosis (most common cause of Addison disease in developing countries)",
      "Bilateral adrenal hemorrhage (anticoagulant therapy, sepsis - Waterhouse-Friderichsen syndrome)",
      "Abrupt discontinuation of chronic glucocorticoid therapy (adrenal crisis)",
      "Other autoimmune conditions (associated autoimmune polyglandular syndromes)"
    ],
    "diagnostics": [
      "24-hour urine free cortisol (elevated in Cushing syndrome)",
      "Overnight 1mg dexamethasone suppression test (cortisol > 50 nmol/L at 0800 next morning suggests Cushing)",
      "Late-night salivary cortisol (elevated in Cushing, requires 2 elevated results)",
      "ACTH level to distinguish ACTH-dependent vs ACTH-independent Cushing syndrome",
      "Cosyntropin (ACTH) stimulation test for Addison disease (cortisol fails to rise above 500 nmol/L at 30 or 60 minutes)",
      "Morning cortisol level (< 83 nmol/L strongly suggests adrenal insufficiency)"
    ],
    "management": [
      "Cushing syndrome: identify and treat cause (taper exogenous steroids, surgical resection of pituitary/adrenal tumor)",
      "Medical therapy for Cushing: ketoconazole, metyrapone (steroidogenesis inhibitors) as bridge to surgery",
      "Addison disease: lifelong glucocorticoid replacement (hydrocortisone 15-25mg daily in 2-3 divided doses)",
      "Fludrocortisone 0.05-0.2mg daily for mineralocorticoid replacement in primary adrenal insufficiency",
      "Stress dosing: double or triple hydrocortisone during illness, fever > 38 degrees Celsius, or minor surgery",
      "Adrenal crisis: IV hydrocortisone 100mg bolus STAT, then 50mg every 6-8 hours + aggressive IV NS resuscitation",
      "All patients with Addison disease must carry medical alert identification and emergency injectable hydrocortisone"
    ],
    "signs": {
      "left": [
        "Cushing features: moon facies, central obesity, proximal muscle weakness",
        "Wide purple striae on abdomen, easy bruising, thin fragile skin",
        "Addison features: fatigue, weight loss, hyperpigmentation (skin creases, gums)",
        "Salt craving and orthostatic hypotension (aldosterone deficiency)"
      ],
      "right": [
        "Cushing complications: new-onset diabetes, osteoporotic fractures, psychosis",
        "Uncontrolled hypertension, hypokalemia (ectopic ACTH syndrome)",
        "Adrenal crisis: severe hypotension, shock, altered consciousness, hypoglycemia",
        "Hyperkalemia and hyponatremia (mineralocorticoid deficiency in Addison disease)"
      ]
    },
    "medications": [
      {
        "name": "Hydrocortisone (Cortef)",
        "type": "Glucocorticoid Replacement",
        "action": "Synthetic cortisol that replaces deficient endogenous glucocorticoid, restoring glucose homeostasis, stress response, and anti-inflammatory function; at physiologic doses mimics normal diurnal cortisol rhythm",
        "sideEffects": "Weight gain, hyperglycemia, osteoporosis, immunosuppression, adrenal suppression (at supraphysiologic doses), insomnia, mood changes",
        "contra": "Active untreated systemic fungal infections (at supraphysiologic doses), live vaccines during immunosuppressive dosing",
        "pearl": "Addison replacement: 15-25mg daily divided as 10mg AM, 5mg noon, 5mg late afternoon (mimics diurnal rhythm). CRITICAL sick-day rules: double dose for fever > 38 degrees Celsius, minor illness; triple dose for vomiting, surgery, trauma. Adrenal crisis: 100mg IV bolus, then 50mg q6-8h. All patients need MedicAlert bracelet and emergency injection kit."
      },
      {
        "name": "Fludrocortisone (Florinef)",
        "type": "Mineralocorticoid",
        "action": "Synthetic aldosterone analogue that acts on the renal collecting duct to promote sodium reabsorption and potassium excretion, restoring intravascular volume and normalizing electrolytes in primary adrenal insufficiency",
        "sideEffects": "Hypertension (excessive sodium retention), hypokalemia, peripheral edema, headache, heart failure exacerbation",
        "contra": "Systemic fungal infections, known hypersensitivity, severe heart failure (fluid retention)",
        "pearl": "0.05-0.2mg daily (most patients need 0.1mg). Only needed in PRIMARY adrenal insufficiency (secondary AI preserves aldosterone via RAAS). Monitor supine and standing BP (orthostatic improvement indicates adequate dosing), serum K+ and Na+. Dose adjustment guided by postural BP and electrolytes rather than cortisol levels."
      }
    ],
    "pearls": [
      "The most important distinction the clinician must make is ACTH-dependent (pituitary or ectopic ACTH) vs ACTH-independent (adrenal tumor or exogenous glucocorticoid) Cushing syndrome - this determines the diagnostic pathway and treatment approach",
      "Adrenal crisis is a life-threatening emergency requiring immediate IV hydrocortisone 100mg bolus - the clinician must not delay treatment to wait for lab confirmation; if adrenal crisis is suspected clinically (hypotension, altered consciousness in a patient on chronic steroids or with known Addison disease), treat first and confirm later",
      "All patients with Addison disease require sick-day education: double hydrocortisone for illness with fever > 38 degrees Celsius, triple for vomiting or inability to take oral medication (switch to IM hydrocortisone), and present to emergency department if unable to self-manage - failure to stress dose is the most common cause of preventable adrenal crisis"
    ],
    "quiz": [
      {
        "question": "A 38-year-old woman with known Addison disease on hydrocortisone 20mg/day and fludrocortisone 0.1mg daily presents to the clinic with gastroenteritis. She has been vomiting for 12 hours and unable to keep oral medications down. BP 85/50, HR 118, temperature 38.6 degrees Celsius. What is the priority action?",
        "options": [
          "Administer oral hydrocortisone 40mg and observe",
          "Order AM cortisol and ACTH stimulation test before treatment",
          "Administer IV hydrocortisone 100mg bolus STAT and begin IV 0.9% NaCl resuscitation",
          "Start IV dexamethasone 4mg and arrange outpatient follow-up"
        ],
        "correct": 2,
        "rationale": "This is impending adrenal crisis in a known Addison patient unable to take oral medications during acute illness. Priority is immediate IV hydrocortisone 100mg bolus (stress dose) and aggressive IV fluid resuscitation. Oral medication is inappropriate as she is vomiting. Lab testing should not delay treatment. Dexamethasone lacks mineralocorticoid activity and is not first-line for adrenal crisis."
      }
    ]
  },
  "endo-raas-np": {
    "title": "Renin-Angiotensin-Aldosterone System",
    "cellular": {
      "title": "RAAS Physiology and Aldosterone Excess",
      "content": "The renin-angiotensin-aldosterone system (RAAS) is the primary hormonal regulator of blood pressure, sodium balance, and potassium homeostasis. Decreased renal perfusion pressure or sympathetic stimulation triggers juxtaglomerular cells to release renin, which cleaves angiotensinogen (from the liver) to angiotensin I. Angiotensin-converting enzyme (ACE) in pulmonary endothelium converts angiotensin I to angiotensin II, which causes potent arteriolar vasoconstriction, stimulates aldosterone secretion from the zona glomerulosa, promotes ADH release, and stimulates thirst. Aldosterone acts on the distal convoluted tubule and collecting duct via mineralocorticoid receptors, upregulating epithelial sodium channels (ENaC) and Na+/K+-ATPase, increasing sodium and water reabsorption while excreting potassium and hydrogen ions. Primary aldosteronism (Conn syndrome) involves autonomous aldosterone production (usually from adrenal adenoma or bilateral hyperplasia), causing sodium retention, hypertension, hypokalemia, and metabolic alkalosis. It is the most common cause of secondary hypertension, affecting 5-13% of hypertensive patients."
    },
    "riskFactors": [
      "Treatment-resistant hypertension (requiring >= 3 antihypertensives)",
      "Hypertension with spontaneous or diuretic-induced hypokalemia",
      "Adrenal incidentaloma on imaging",
      "Hypertension with obstructive sleep apnea (high prevalence of aldosteronism)",
      "Family history of early-onset hypertension or cerebrovascular accident at young age",
      "Hypertension in a young adult (< 40 years)",
      "Atrial fibrillation with hypertension (aldosterone promotes atrial remodeling)"
    ],
    "diagnostics": [
      "Aldosterone-to-renin ratio (ARR): screening test (aldosterone > 416 pmol/L with ARR > 100 pmol/L per mIU/L)",
      "Hold interfering medications 4 weeks before ARR: spironolactone, eplerenone, amiloride; 2 weeks for ACEi, ARB, diuretics",
      "Confirmatory test: oral sodium loading test or IV saline suppression test (aldosterone fails to suppress)",
      "Adrenal CT to distinguish adenoma from bilateral hyperplasia",
      "Adrenal venous sampling (AVS) to lateralize aldosterone source before considering surgery",
      "Serum electrolytes: hypokalemia and metabolic alkalosis (though 50% of PA patients are normokalemic)"
    ],
    "management": [
      "Unilateral aldosterone-producing adenoma: laparoscopic adrenalectomy (curative in 30-60% for BP, nearly 100% for hypokalemia)",
      "Bilateral adrenal hyperplasia: mineralocorticoid receptor antagonist (spironolactone 25-100mg daily first-line)",
      "Eplerenone 25-50mg BID as alternative to spironolactone (fewer antiandrogenic side effects)",
      "Potassium supplementation as needed until spironolactone achieves full effect (4-6 weeks)",
      "Monitor serum K+ and creatinine closely after starting MRA (risk of hyperkalemia, especially with concurrent ACEi/ARB)",
      "Sodium restriction (< 2g/day) to augment BP reduction",
      "Screen all patients with treatment-resistant hypertension for primary aldosteronism"
    ],
    "signs": {
      "left": [
        "Moderate hypertension with mild hypokalemia (K+ 3.0-3.5 mmol/L)",
        "Fatigue, muscle cramps, and nocturia (polyuria from hypokalemia)",
        "Treatment-resistant hypertension requiring 3 or more medications",
        "Normokalemic primary aldosteronism (up to 50% of cases)"
      ],
      "right": [
        "Severe hypokalemia (< 2.5 mmol/L) with cardiac arrhythmias (U waves, prolonged QT)",
        "Severe hypertension with end-organ damage (LVH, retinopathy, proteinuria)",
        "Metabolic alkalosis with neuromuscular weakness and tetany",
        "Hypertensive emergency with flash pulmonary edema"
      ]
    },
    "medications": [
      {
        "name": "Spironolactone (Aldactone)",
        "type": "Mineralocorticoid Receptor Antagonist (Non-Selective)",
        "action": "Competitively blocks aldosterone at the mineralocorticoid receptor in the distal nephron, inhibiting ENaC-mediated sodium reabsorption and potassium excretion; also has antiandrogenic effects due to androgen receptor blockade",
        "sideEffects": "Hyperkalemia (most serious - monitor closely), gynecomastia and breast tenderness in males (10-30%), menstrual irregularities, decreased libido, GI upset",
        "contra": "Serum K+ > 5.0 mmol/L, severe renal insufficiency (GFR < 30 mL/min), concurrent potassium-sparing diuretics, Addison disease",
        "pearl": "Start 25mg daily, titrate to 100mg daily for primary aldosteronism. First-line medical therapy for bilateral adrenal hyperplasia. Monitor K+ and creatinine at 1 week, 1 month, then every 3 months. Gynecomastia is dose-dependent and main reason for switching to eplerenone. Also used for heart failure (RALES trial: 30% mortality reduction at 25mg)."
      },
      {
        "name": "Eplerenone (Inspra)",
        "type": "Selective Mineralocorticoid Receptor Antagonist",
        "action": "Selectively blocks mineralocorticoid receptors without significant binding to androgen or progesterone receptors, providing aldosterone blockade with fewer endocrine side effects than spironolactone",
        "sideEffects": "Hyperkalemia, dizziness, diarrhea, elevated creatinine, fatigue",
        "contra": "Serum K+ > 5.0 mmol/L, GFR < 30 mL/min, concurrent strong CYP3A4 inhibitors (ketoconazole, clarithromycin), type 2 diabetes with microalbuminuria and concurrent ACEi/ARB (hyperkalemia risk)",
        "pearl": "25-50mg once or twice daily. Approximately 60% as potent as spironolactone (may need higher doses). Preferred over spironolactone in males due to absence of gynecomastia. EPHESUS trial showed mortality benefit post-MI with LV dysfunction. More expensive than spironolactone. Same K+ monitoring requirements."
      }
    ],
    "pearls": [
      "Primary aldosteronism is far more common than previously thought (5-13% of hypertensive patients) - the clinician must screen with the aldosterone-to-renin ratio in all patients with treatment-resistant hypertension, hypertension with hypokalemia, or adrenal incidentaloma",
      "Up to 50% of patients with primary aldosteronism are normokalemic - the clinician cannot rely on the presence of hypokalemia to trigger screening; a high index of suspicion based on clinical context is essential",
      "Spironolactone causes dose-dependent gynecomastia in males (10-30%) due to androgen receptor blockade - the clinician should counsel about this expected side effect and offer eplerenone as an alternative if intolerable, recognizing that eplerenone is less potent and more expensive"
    ],
    "quiz": [
      {
        "question": "A 45-year-old male with hypertension requiring amlodipine, hydrochlorothiazide, and ramipril has serum K+ consistently 3.1-3.3 mmol/L despite oral supplementation. Aldosterone-to-renin ratio is elevated. Adrenal CT shows a 1.5 cm left adrenal adenoma. What is the next step?",
        "options": [
          "Start spironolactone 100mg daily as definitive treatment",
          "Perform adrenal venous sampling to confirm lateralization before recommending adrenalectomy",
          "Increase potassium supplementation and add a fourth antihypertensive",
          "Repeat ARR in 6 months to confirm"
        ],
        "correct": 1,
        "rationale": "With a confirmed elevated ARR and unilateral adrenal adenoma on CT, adrenal venous sampling is indicated to confirm that the adenoma is the aldosterone source before recommending curative laparoscopic adrenalectomy. CT alone cannot distinguish a functioning adenoma from a non-functioning incidentaloma. Spironolactone is appropriate for bilateral hyperplasia but surgery is curative for unilateral adenoma. Simply adding medications does not address the underlying cause."
      }
    ]
  },
  "endo-antidiabetics-np": {
    "title": "Antidiabetic Medications",
    "cellular": {
      "title": "Pharmacologic Mechanisms in Glycemic Control",
      "content": "Type 2 diabetes mellitus involves progressive beta-cell dysfunction and insulin resistance in hepatic, muscle, and adipose tissue. Metformin acts primarily by suppressing hepatic gluconeogenesis via activation of AMP-activated protein kinase (AMPK) and improving peripheral insulin sensitivity. SGLT2 inhibitors (empagliflozin, dapagliflozin, canagliflozin) block the sodium-glucose cotransporter 2 in the proximal convoluted tubule, preventing reabsorption of approximately 70-80g glucose daily, producing glycosuria and osmotic diuresis. This mechanism provides cardiovascular and renal benefits independent of glycemic control through natriuresis, reduced preload, and improved cardiac energetics. GLP-1 receptor agonists (semaglutide, liraglutide) mimic incretin hormones, stimulating glucose-dependent insulin secretion, suppressing glucagon, delaying gastric emptying, and promoting satiety via hypothalamic receptors. DPP-4 inhibitors (sitagliptin) prevent degradation of endogenous GLP-1, providing a more modest incretin effect. Insulin therapy becomes necessary when beta-cell function declines to the point where oral and injectable non-insulin agents cannot maintain glycemic targets."
    },
    "riskFactors": [
      "Progressive beta-cell dysfunction over disease duration",
      "Obesity and insulin resistance (central adiposity most predictive)",
      "Sedentary lifestyle and high-glycemic diet",
      "Family history (80% concordance in monozygotic twins for T2DM)",
      "Gestational diabetes history (50% risk of T2DM within 5-10 years)",
      "Polycystic ovary syndrome",
      "Corticosteroid therapy, atypical antipsychotics (metabolic side effects)"
    ],
    "diagnostics": [
      "HbA1c target individualized: < 7.0% (< 53 mmol/mol) general, < 8.0% in frail elderly or limited life expectancy",
      "Fasting plasma glucose and 2-hour post-prandial glucose monitoring",
      "Renal function (eGFR) before and during metformin, SGLT2 inhibitor therapy",
      "Urine albumin-to-creatinine ratio (UACR) annually for nephropathy screening",
      "Lipid panel, hepatic function, cardiovascular risk assessment",
      "Self-monitoring blood glucose (SMBG) for patients on insulin or sulfonylureas"
    ],
    "management": [
      "First-line: metformin 500mg BID with meals, titrate to maximum 2000-2550mg daily",
      "Add SGLT2 inhibitor (empagliflozin 10-25mg) if established cardiovascular disease, heart failure, or CKD (independent of HbA1c)",
      "Add GLP-1 RA (semaglutide SC weekly or oral) if cardiovascular benefit needed or weight management priority",
      "Add DPP-4 inhibitor (sitagliptin 100mg daily) if GLP-1 RA not tolerated (do not combine DPP-4i with GLP-1 RA)",
      "Insulin initiation: basal insulin (glargine 10 units or detemir) at bedtime when oral agents fail to achieve target",
      "Basal-bolus intensification with rapid-acting insulin (lispro, aspart) before meals if basal alone insufficient",
      "Hypoglycemia education for all patients on insulin or sulfonylureas: rule of 15 (15g fast-acting carbohydrate, recheck in 15 minutes)"
    ],
    "signs": {
      "left": [
        "HbA1c 7.0-8.0% on metformin monotherapy with good adherence",
        "Mild GI side effects from metformin (manageable with food, slow titration)",
        "Stable weight on GLP-1 RA with improved satiety",
        "Stable eGFR > 60 mL/min on SGLT2 inhibitor"
      ],
      "right": [
        "HbA1c > 10% or symptomatic hyperglycemia (polyuria, polydipsia, weight loss) requiring insulin initiation",
        "Lactic acidosis (rare): metformin in setting of acute kidney injury, sepsis, contrast dye",
        "Euglycemic DKA with SGLT2 inhibitor (ketoacidosis with near-normal glucose)",
        "Severe hypoglycemia (requiring third-party assistance) with sulfonylurea or insulin"
      ]
    },
    "medications": [
      {
        "name": "Empagliflozin (Jardiance)",
        "type": "SGLT2 Inhibitor",
        "action": "Blocks SGLT2 in the proximal tubule, preventing glucose and sodium reabsorption, producing glycosuria (~70g/day glucose excretion), natriuresis, and mild osmotic diuresis; cardiovascular and renal benefits are largely glucose-independent",
        "sideEffects": "Genital mycotic infections (candidiasis, especially in women), urinary tract infections, volume depletion and hypotension, euglycemic DKA, Fournier gangrene (rare necrotizing fasciitis of perineum)",
        "contra": "Type 1 diabetes (DKA risk), GFR < 20 mL/min (for glycemic benefit; may still use for cardiorenal protection per recent trials), recurrent genital infections, diabetic ketoacidosis",
        "pearl": "10-25mg daily. EMPA-REG OUTCOME trial: 38% reduction in cardiovascular death. EMPEROR trials: heart failure benefit regardless of diabetes status. EMPA-KIDNEY: renal protection in CKD. Hold perioperatively and during acute illness (DKA risk). Counsel patients about genital hygiene. Check ketones if unwell even with normal glucose."
      },
      {
        "name": "Semaglutide (Ozempic SC / Rybelsus oral)",
        "type": "GLP-1 Receptor Agonist",
        "action": "Activates GLP-1 receptors on pancreatic beta-cells (glucose-dependent insulin secretion), alpha-cells (glucagon suppression), gastric smooth muscle (delayed emptying), and hypothalamic appetite centres (satiety promotion and reduced food intake)",
        "sideEffects": "Nausea, vomiting, diarrhea (dose-dependent, usually transient), pancreatitis (rare), gallbladder disease, injection site reactions, potential thyroid C-cell tumors (animal data - boxed warning)",
        "contra": "Personal or family history of medullary thyroid carcinoma (MTC), multiple endocrine neoplasia type 2 (MEN2), history of pancreatitis, severe gastroparesis",
        "pearl": "SC: start 0.25mg weekly x 4 weeks, increase to 0.5mg, then 1.0mg, maximum 2.0mg weekly. Oral: 3mg daily x 30 days, then 7mg, then 14mg (take on empty stomach with sip of water, no food for 30 min). SUSTAIN-6 and SELECT trials: cardiovascular benefit. 5-15% weight loss. Do NOT combine with DPP-4 inhibitor (redundant mechanism)."
      }
    ],
    "pearls": [
      "SGLT2 inhibitors provide cardiovascular and renal benefits independent of glycemic control - the clinician should prescribe empagliflozin or dapagliflozin for patients with T2DM and established ASCVD, heart failure, or CKD regardless of current HbA1c level, as per Diabetes Canada 2024 guidelines",
      "Metformin requires dose adjustment or discontinuation based on eGFR: reduce dose at eGFR 30-44 mL/min, contraindicated below 30 mL/min; hold 48 hours before and after iodinated contrast or surgery (lactic acidosis risk in acute kidney injury)",
      "The clinician must never combine a DPP-4 inhibitor with a GLP-1 receptor agonist as they work on the same incretin pathway - combining them provides no additional glycemic benefit while increasing cost and potential side effects"
    ],
    "quiz": [
      {
        "question": "A 62-year-old with type 2 diabetes, HbA1c 7.8% on metformin 2000mg daily, has established coronary artery disease (prior MI) and eGFR 55 mL/min with UACR 15 mg/mmol. What is the most appropriate medication to add?",
        "options": [
          "Glyburide (sulfonylurea) 5mg daily",
          "Empagliflozin 10mg daily",
          "Sitagliptin 100mg daily",
          "Insulin glargine 10 units at bedtime"
        ],
        "correct": 1,
        "rationale": "This patient has established ASCVD and CKD with albuminuria. SGLT2 inhibitors (empagliflozin) have proven cardiovascular mortality reduction (EMPA-REG) and renal protection regardless of HbA1c. Diabetes Canada guidelines recommend SGLT2 inhibitor addition for patients with T2DM and ASCVD, HF, or CKD. Sulfonylureas carry hypoglycemia risk and no CV benefit. Sitagliptin is CV neutral. Insulin is not yet indicated."
      }
    ]
  },
  "stress-chronic-disease-np": {
    "title": "Chronic Stress and Disease",
    "cellular": {
      "title": "Allostatic Load",
      "content": "The stress response activates two primary systems: the sympathetic-adrenal-medullary (SAM) axis (rapid catecholamine release for fight-or-flight) and the hypothalamic-pituitary-adrenal (HPA) axis (cortisol release for sustained metabolic adaptation). Acute stress is adaptive, but chronic stress produces allostatic overload - the cumulative physiologic burden of repeated adaptation to stressors. Chronic HPA axis activation results in sustained cortisol elevation, which drives visceral adiposity (cortisol upregulates lipoprotein lipase in omental fat), insulin resistance (cortisol impairs GLUT4 translocation), immune dysregulation (suppression of Th1 cellular immunity, promotion of Th2 humoral response, elevated inflammatory cytokines IL-6 and CRP), endothelial dysfunction (accelerated atherosclerosis), hippocampal atrophy (impaired memory and emotional regulation), and bone resorption (osteoporosis). Allostatic load contributes to metabolic syndrome, cardiovascular disease, depression, cognitive decline, and increased susceptibility to infection and autoimmune flares."
    },
    "riskFactors": [
      "Low socioeconomic status and financial insecurity",
      "Adverse childhood experiences (ACEs score >= 4 associated with markedly increased chronic disease risk)",
      "Caregiving burden (particularly for dementia patients)",
      "Chronic pain or disability",
      "Social isolation and lack of social support networks",
      "Occupational stress (high demand, low control, effort-reward imbalance)",
      "Racial discrimination and minority stress"
    ],
    "diagnostics": [
      "Perceived Stress Scale (PSS-10): validated 10-item self-report questionnaire",
      "Screen for associated conditions: PHQ-9 for depression, GAD-7 for anxiety, Insomnia Severity Index",
      "Metabolic markers: fasting glucose, HbA1c, lipid panel, waist circumference",
      "Inflammatory markers: high-sensitivity CRP (elevated in chronic stress)",
      "Cortisol assessment: morning cortisol, 24-hour urine cortisol if Cushing syndrome suspected",
      "Cardiovascular risk assessment: Framingham Risk Score or ASCVD risk calculator"
    ],
    "management": [
      "Screen for chronic stress and ACEs using validated tools at annual comprehensive assessments",
      "Exercise prescription: 150 minutes/week moderate-intensity aerobic activity (reduces cortisol, increases BDNF, improves insulin sensitivity)",
      "Sleep hygiene education: consistent sleep-wake schedule, 7-9 hours, dark quiet environment",
      "Mindfulness-based stress reduction (MBSR): 8-week program with evidence for cortisol reduction and immune function improvement",
      "CBT for stress management and maladaptive coping patterns",
      "Aggressive management of stress-related metabolic consequences: glucose, lipids, blood pressure",
      "Refer to social work, psychology, or psychiatry when chronic stress exceeds primary care management scope"
    ],
    "signs": {
      "left": [
        "Mild chronic stress: intermittent tension headaches, insomnia, irritability",
        "PSS-10 score 14-26 (moderate perceived stress)",
        "Early metabolic changes: weight gain, borderline glucose, mildly elevated BP",
        "Responsive to lifestyle interventions and stress management techniques"
      ],
      "right": [
        "Severe allostatic overload: metabolic syndrome, treatment-resistant hypertension",
        "Burnout syndrome: emotional exhaustion, depersonalization, reduced personal accomplishment",
        "Stress-related immune dysfunction: recurrent infections, autoimmune flares",
        "Major depressive episode or anxiety disorder secondary to chronic stress"
      ]
    },
    "medications": [
      {
        "name": "Sertraline (Zoloft)",
        "type": "SSRI",
        "action": "Increases serotonin availability in stress-regulation circuits (prefrontal cortex, amygdala, hippocampus), normalizing HPA axis hyperactivity and improving stress resilience through neuroplastic changes",
        "sideEffects": "Nausea, diarrhea, insomnia, sexual dysfunction, weight gain (long-term), bleeding risk",
        "contra": "Concurrent MAOI, known QT prolongation, acute porphyria",
        "pearl": "Consider when chronic stress has progressed to comorbid MDD or GAD (PHQ-9 >= 10 or GAD-7 >= 10). Start 50mg daily. Not indicated for stress alone without psychiatric diagnosis. Lifestyle interventions and psychotherapy remain primary treatment for chronic stress. SSRI is adjunctive when mood or anxiety disorder develops."
      },
      {
        "name": "Melatonin",
        "type": "Endogenous Sleep Hormone Supplement",
        "action": "Activates MT1 and MT2 melatonin receptors in the suprachiasmatic nucleus, reinforcing circadian rhythm and promoting sleep onset; does not produce pharmacologic sedation like hypnotics",
        "sideEffects": "Daytime drowsiness, headache, vivid dreams, dizziness (generally well-tolerated)",
        "contra": "Autoimmune conditions (theoretical immunostimulatory effect), concurrent fluvoxamine (CYP1A2 inhibition increases melatonin levels), pregnancy/breastfeeding",
        "pearl": "0.5-5mg taken 30-60 minutes before desired sleep time. Most effective for circadian rhythm disorders and sleep onset insomnia. Lower doses (0.5-1mg) may be more physiologic. Not a sedative - works by reinforcing circadian sleep signal. OTC in Canada. First-choice over benzodiazepines or Z-drugs for stress-related insomnia in elderly."
      }
    ],
    "pearls": [
      "Chronic stress is a modifiable risk factor for cardiovascular disease, diabetes, and depression - the clinician must screen for psychosocial stressors (ACEs, occupational stress, caregiving burden) as part of comprehensive health assessment, not just manage downstream metabolic consequences",
      "Exercise is the single most evidence-based intervention for chronic stress - 150 minutes/week of moderate-intensity activity reduces cortisol, improves insulin sensitivity, increases BDNF (neuroplasticity), and reduces all-cause mortality; the clinician should prescribe exercise with the same specificity as medication",
      "Adverse childhood experiences (ACEs) have a dose-response relationship with adult chronic disease: ACE score >= 4 is associated with 4-12x increased risk of depression, substance abuse, and suicide attempt, and 1.4-1.6x increased risk of cardiovascular disease and diabetes - the clinician must screen and refer for trauma-informed care"
    ],
    "quiz": [
      {
        "question": "A 48-year-old nurse presents with 8 months of fatigue, weight gain (8 kg), insomnia, and recurrent tension headaches. She works 60 hours/week with rotating shifts and is primary caregiver for her mother with dementia. BP 142/88, fasting glucose 6.4 mmol/L, HbA1c 6.1%. PSS-10 score 32. PHQ-9 score 8. What is the most appropriate initial management?",
        "options": [
          "Start sertraline 50mg daily for depression",
          "Prescribe zopiclone 7.5mg nightly for insomnia",
          "Comprehensive lifestyle intervention: exercise prescription, sleep hygiene, MBSR referral, caregiver support resources, and metabolic risk factor management",
          "Reassure and follow up in 6 months"
        ],
        "correct": 2,
        "rationale": "This patient has chronic stress with allostatic load (prediabetes, hypertension, weight gain) but PHQ-9 of 8 indicates mild depression not yet meeting threshold for SSRI. PSS-10 of 32 is high perceived stress. Multimodal lifestyle intervention addresses the root cause. Exercise, sleep optimization, MBSR, and caregiver support are evidence-based. Metabolic risk factors need management. Zopiclone would mask symptoms. Follow-up in 6 months is too long given metabolic trajectory."
      }
    ]
  },
  "stress-ptsd-np": {
    "title": "Post-Traumatic Stress Disorder",
    "cellular": {
      "title": "Neurobiological Basis of Trauma Response",
      "content": "PTSD results from a failure of normal fear extinction following exposure to a traumatic event. The amygdala becomes hyperreactive, generating exaggerated fear and threat responses to trauma-associated cues. The medial prefrontal cortex (mPFC), which normally inhibits amygdala activity during fear extinction, shows hypofunction in PTSD, resulting in impaired ability to suppress conditioned fear responses. The hippocampus, critical for contextualizing memories (distinguishing past trauma from present safety), undergoes volume reduction from chronic glucocorticoid neurotoxicity, impairing memory consolidation and producing fragmented, intrusive trauma memories. The HPA axis paradoxically shows enhanced negative feedback (low basal cortisol with exaggerated cortisol suppression on dexamethasone test) and sympathetic nervous system hyperactivation (elevated norepinephrine, exaggerated startle). Noradrenergic hyperactivation from the locus coeruleus drives hyperarousal symptoms and consolidation of traumatic memories, which is why alpha-1 adrenergic blockade with prazosin can reduce trauma-related nightmares."
    },
    "riskFactors": [
      "Direct exposure to life-threatening trauma (combat, sexual assault, serious accident, natural disaster)",
      "Witnessing traumatic events or learning of trauma to close family/friends",
      "Occupational trauma exposure (first responders, military, healthcare workers)",
      "Prior psychiatric history (depression, anxiety, substance use disorder)",
      "Childhood trauma and adverse childhood experiences",
      "Lack of social support following trauma exposure",
      "Female sex (2x lifetime prevalence compared to males)"
    ],
    "diagnostics": [
      "DSM-5 criteria: exposure to trauma + intrusion symptoms + avoidance + negative cognition/mood + arousal/reactivity, lasting > 1 month",
      "PCL-5 (PTSD Checklist for DSM-5): validated 20-item self-report screening tool (score >= 33 suggests PTSD)",
      "CAPS-5 (Clinician-Administered PTSD Scale): gold standard diagnostic assessment",
      "Screen for comorbid conditions: PHQ-9 (depression), GAD-7 (anxiety), AUDIT-C (alcohol use), drug screening",
      "Suicide risk assessment (PTSD carries 6x increased suicide risk)",
      "Rule out TBI in military/accident-related trauma (overlapping symptoms)"
    ],
    "management": [
      "Trauma-informed care approach: safety, trustworthiness, choice, collaboration, empowerment",
      "First-line psychotherapy: trauma-focused CBT, prolonged exposure (PE), or cognitive processing therapy (CPT) - all have Level 1 evidence",
      "First-line pharmacotherapy: SSRIs (sertraline 50-200mg or paroxetine 20-60mg - both FDA-approved for PTSD)",
      "Prazosin 1-15mg at bedtime for trauma-related nightmares and sleep disturbance",
      "AVOID benzodiazepines in PTSD (no evidence of benefit, worsen outcomes, high addiction risk in this population)",
      "Treat comorbid substance use disorder concurrently (60-80% comorbidity rate)",
      "Refer to psychiatry for treatment-resistant PTSD or complex trauma presentations"
    ],
    "signs": {
      "left": [
        "Intrusion: occasional distressing memories or dreams of trauma, manageable with coping",
        "Mild avoidance of trauma reminders with preserved daily functioning",
        "Irritability, mild hypervigilance without functional impairment",
        "PCL-5 score 33-49 (probable PTSD, mild-moderate severity)"
      ],
      "right": [
        "Severe intrusion: flashbacks with dissociative features, acting/feeling as if trauma recurring",
        "Pervasive avoidance: unable to leave home, social withdrawal, occupational disability",
        "Severe hyperarousal: explosive anger, reckless/self-destructive behavior, severe insomnia",
        "Comorbid major depression, active suicidal ideation, or substance dependence"
      ]
    },
    "medications": [
      {
        "name": "Sertraline (Zoloft)",
        "type": "SSRI (FDA-Approved for PTSD)",
        "action": "Increases serotonergic transmission in amygdala-prefrontal circuits, enhancing fear extinction and emotional regulation; reduces hyperarousal through serotonergic modulation of noradrenergic locus coeruleus activity",
        "sideEffects": "Nausea, diarrhea, insomnia, sexual dysfunction, headache, increased bleeding risk, activation (initial anxiety worsening in first 1-2 weeks)",
        "contra": "Concurrent MAOI (14-day washout), concurrent pimozide, known QT prolongation",
        "pearl": "FDA-approved for PTSD. Start 25mg daily (low start due to activation sensitivity in PTSD patients), titrate to 50-200mg. Response takes 8-12 weeks in PTSD (longer than for depression). Continue for minimum 12 months after response. Combine with trauma-focused psychotherapy for optimal outcomes. Monitor for suicidality in patients < 25."
      },
      {
        "name": "Prazosin (Minipress)",
        "type": "Alpha-1 Adrenergic Antagonist",
        "action": "Blocks alpha-1 adrenergic receptors in the CNS, reducing norepinephrine-mediated trauma memory consolidation during sleep and decreasing the sympathetic arousal that drives trauma-related nightmares",
        "sideEffects": "First-dose orthostatic hypotension (start low at bedtime), dizziness, headache, nasal congestion, syncope",
        "contra": "Hypotension (SBP < 90 mmHg), concurrent PDE5 inhibitors (severe hypotension), known hypersensitivity",
        "pearl": "Start 1mg at bedtime, titrate by 1mg every 3-7 days to effect (usual therapeutic range 2-15mg at bedtime for nightmares). Take first dose in bed due to orthostatic hypotension risk. Not FDA-approved for PTSD but widely used off-label with supporting evidence. If nightmares unresponsive, consider clonidine 0.1mg at bedtime as alternative."
      }
    ],
    "pearls": [
      "Benzodiazepines are contraindicated in PTSD - they impair fear extinction (the therapeutic mechanism of trauma-focused psychotherapy), worsen long-term PTSD outcomes, and carry high addiction risk in a population with 60-80% substance use comorbidity; the clinician must never prescribe benzodiazepines for PTSD symptoms",
      "Sertraline and paroxetine are the only FDA-approved medications for PTSD - the clinician should start at a lower dose than for depression (sertraline 25mg) due to activation sensitivity, and must allow 8-12 weeks at adequate dose before declaring treatment failure, as PTSD responds more slowly than depression",
      "Trauma-informed care is not a treatment but a clinical framework - the clinician must ensure all interactions with PTSD patients prioritize safety (physical and emotional), trustworthiness (consistent, transparent), choice (empower patient autonomy), collaboration (not directive), and empowerment (build on patient strengths rather than focusing on deficits)"
    ],
    "quiz": [
      {
        "question": "A 34-year-old paramedic presents 6 months after witnessing a fatal pediatric trauma. He reports nightly vivid nightmares replaying the event, avoids pediatric calls, feels emotionally numb, and has an exaggerated startle response. He drinks 4-6 beers nightly to fall asleep. PCL-5 score 52. What is the clinician priority?",
        "options": [
          "Prescribe clonazepam 1mg at bedtime for sleep and anxiety",
          "Screen for suicidality (C-SSRS), initiate sertraline 25mg, refer for trauma-focused CBT, and address alcohol use concurrently",
          "Recommend he take medical leave and return in 3 months",
          "Start prazosin 15mg at bedtime for nightmares"
        ],
        "correct": 1,
        "rationale": "This patient meets DSM-5 PTSD criteria (all 4 symptom clusters > 1 month). Priority includes suicide risk assessment (PTSD has 6x suicide risk), first-line SSRI (sertraline is FDA-approved for PTSD), referral for evidence-based psychotherapy, and concurrent alcohol use disorder management. Benzodiazepines are contraindicated in PTSD. Prazosin at 15mg is too high an initial dose (start 1mg). Medical leave alone does not constitute treatment."
      }
    ]
  },
  "msk-osteoporosis-fibromyalgia-np": {
    "title": "Osteoporosis and Fibromyalgia",
    "cellular": {
      "title": "Bone Remodeling Failure",
      "content": "Osteoporosis results from an imbalance between osteoclast-mediated bone resorption and osteoblast-mediated bone formation, leading to decreased bone mineral density (BMD), microarchitectural deterioration, and increased fracture risk. Normally, the RANK/RANKL/OPG system regulates bone remodeling: RANKL (from osteoblasts) activates RANK receptors on osteoclast precursors promoting differentiation and bone resorption, while osteoprotegerin (OPG) acts as a decoy receptor for RANKL, inhibiting osteoclastogenesis. Estrogen deficiency post-menopause upregulates RANKL and suppresses OPG, accelerating bone loss at 2-3% per year in the first 5-7 years. Bisphosphonates bind hydroxyapatite crystite in bone matrix and are internalized by osteoclasts during resorption, inhibiting the mevalonate pathway enzyme farnesyl pyrophosphate synthase, inducing osteoclast apoptosis. Denosumab is a monoclonal antibody against RANKL that mimics OPG, potently suppressing osteoclast activity. Fibromyalgia involves central sensitization of the pain processing system with augmented pain facilitation and diminished pain inhibition in the CNS, producing widespread pain, fatigue, and cognitive dysfunction."
    },
    "riskFactors": [
      "Post-menopausal status (estrogen deficiency accelerates bone loss)",
      "Low BMI (< 20 kg/m2) and small body frame",
      "Chronic glucocorticoid use (>= 3 months of prednisone >= 7.5mg/day)",
      "Family history of hip fracture (first-degree relative)",
      "Smoking, excessive alcohol (> 3 units/day), sedentary lifestyle",
      "Rheumatoid arthritis, celiac disease, hyperparathyroidism",
      "Fibromyalgia risk: female sex (7:1), psychological trauma, sleep disorders, family history"
    ],
    "diagnostics": [
      "DXA scan: T-score >= -1.0 normal, -1.0 to -2.5 osteopenia, <= -2.5 osteoporosis",
      "FRAX calculation: 10-year fracture probability integrating BMD, age, sex, BMI, clinical risk factors",
      "Vertebral fracture assessment (VFA) on DXA for subclinical vertebral fractures",
      "Serum calcium, phosphate, 25-hydroxyvitamin D, PTH, alkaline phosphatase",
      "Fibromyalgia: clinical diagnosis using widespread pain index (WPI) and symptom severity scale (SSS)",
      "Rule out inflammatory arthritis, thyroid disease, vitamin D deficiency in fibromyalgia workup"
    ],
    "management": [
      "All patients: calcium 1200mg/day total (diet + supplement) + vitamin D 800-2000 IU daily",
      "Weight-bearing and resistance exercise for both osteoporosis (bone loading) and fibromyalgia (graded exercise)",
      "Osteoporosis pharmacotherapy: alendronate 70mg weekly (first-line bisphosphonate) for T-score <= -2.5 or FRAX above intervention threshold",
      "Denosumab 60mg SC every 6 months for bisphosphonate intolerance or renal impairment",
      "Fibromyalgia pharmacotherapy: duloxetine 60mg daily or pregabalin 75-225mg BID",
      "CBT for fibromyalgia pain coping, sleep hygiene, and graded return to activity",
      "Fall prevention assessment in elderly osteoporotic patients: home safety, medication review, balance training"
    ],
    "signs": {
      "left": [
        "Osteopenia (T-score -1.0 to -2.5) without fracture history, low FRAX score",
        "Adequate calcium and vitamin D intake with stable BMD on serial DXA",
        "Mild fibromyalgia: intermittent widespread pain manageable with exercise and self-care",
        "Preserved functional capacity and employment in fibromyalgia"
      ],
      "right": [
        "Severe osteoporosis: T-score <= -2.5 with fragility fracture (hip, vertebral, wrist from standing height)",
        "Multiple vertebral compression fractures with height loss > 4 cm and kyphosis",
        "Atypical femoral fracture (subtrochanteric stress fracture with long-term bisphosphonate use > 5 years)",
        "Severe fibromyalgia: widespread pain with severe fatigue, cognitive dysfunction (fibro fog), disability"
      ]
    },
    "medications": [
      {
        "name": "Alendronate (Fosamax)",
        "type": "Bisphosphonate (Nitrogen-Containing)",
        "action": "Binds to hydroxyapatite on bone resorption surfaces, is internalized by osteoclasts during resorption, and inhibits farnesyl pyrophosphate synthase in the mevalonate pathway, inducing osteoclast apoptosis and reducing bone turnover",
        "sideEffects": "Esophageal irritation/ulceration (must take upright with full glass of water, remain upright 30 min), musculoskeletal pain, atypical femoral fractures (rare, > 5 years use), osteonecrosis of the jaw (rare, mostly with IV bisphosphonates in oncology dosing)",
        "contra": "Esophageal stricture or achalasia, inability to remain upright for 30 minutes, hypocalcemia (correct first), GFR < 35 mL/min",
        "pearl": "70mg once weekly on empty stomach first thing in morning with 250 mL plain water only. No food, drink, or other medications for 30 minutes. Remain upright. Reduces hip fracture by 40-50% and vertebral fracture by 50%. Drug holiday after 5 years if low-moderate risk (reassess with DXA and FRAX). Continue 10 years if high fracture risk."
      },
      {
        "name": "Duloxetine (Cymbalta)",
        "type": "SNRI",
        "action": "Dual serotonin and norepinephrine reuptake inhibition enhances descending pain inhibitory pathways from the brainstem that are dysfunctional in fibromyalgia, reducing central sensitization and pain amplification",
        "sideEffects": "Nausea, dry mouth, constipation, dizziness, insomnia, increased blood pressure, hepatotoxicity (rare), serotonin syndrome risk with other serotonergic agents",
        "contra": "Concurrent MAOI, severe hepatic impairment, uncontrolled narrow-angle glaucoma, concurrent thioridazine",
        "pearl": "Start 30mg daily for 1-2 weeks, then increase to 60mg daily (FDA/Health Canada-approved dose for fibromyalgia). Dual benefit for pain and comorbid depression. Taper slowly over 2-4 weeks to avoid discontinuation syndrome (dizziness, nausea, headache, paresthesias). Monitor BP periodically. Alternative: pregabalin 75mg BID titrated to 150-225mg BID."
      }
    ],
    "pearls": [
      "CRITICAL: Denosumab discontinuation causes rapid rebound bone loss with vertebral fracture risk within 12-18 months of stopping - the clinician must NEVER simply discontinue denosumab without transitioning to oral bisphosphonate (alendronate for minimum 12 months) to prevent rebound vertebral fractures; this is a common and preventable prescribing error",
      "Bisphosphonate drug holidays are appropriate after 5 years of oral therapy in patients at moderate fracture risk (reassess with DXA and FRAX every 2-3 years during holiday) - but patients with prior vertebral fracture, T-score <= -2.5 at hip, or very high FRAX should continue treatment for 10 years before considering a holiday",
      "Fibromyalgia is a diagnosis of central sensitization, not inflammation - the clinician must set realistic expectations that pharmacotherapy (duloxetine, pregabalin) provides only 30% pain reduction in 50% of patients; exercise is the most effective intervention with Level 1 evidence, and CBT addresses maladaptive pain coping"
    ],
    "quiz": [
      {
        "question": "A 68-year-old post-menopausal woman on denosumab 60mg SC every 6 months for 4 years wants to stop treatment due to cost. DXA T-score hip -2.1, no fracture history. What is the appropriate NP counseling?",
        "options": [
          "Discontinue denosumab and monitor with DXA in 2 years",
          "Discontinue denosumab and start alendronate 70mg weekly to prevent rebound bone loss and vertebral fractures",
          "Reduce denosumab to every 12 months to save cost",
          "Switch to calcium and vitamin D only as she has improved to osteopenia range"
        ],
        "correct": 1,
        "rationale": "Denosumab discontinuation causes rapid rebound bone loss with multiple vertebral fracture risk within 12-18 months. The clinician must transition to oral bisphosphonate (alendronate 70mg weekly for minimum 12 months) before stopping denosumab. Simply discontinuing without transition is a dangerous prescribing error. Reducing denosumab frequency is not supported. Calcium and vitamin D alone are insufficient to prevent rebound."
      }
    ]
  }
};
