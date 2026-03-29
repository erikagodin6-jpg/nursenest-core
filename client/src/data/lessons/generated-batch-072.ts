import type { LessonContent } from "./types";

export const generatedBatch072Lessons: Record<string, LessonContent> = {  "pca-pumps-rpn": {
    title: "Patient-Controlled Analgesia Pumps",
    cellular: { title: "How PCA Pumps Work", content: "A PCA pump is a computerized device that delivers pain medication (usually an opioid like morphine or hydromorphone) through an IV line when the patient presses a button. The pump has safety settings including a lockout interval that prevents overdosing by not delivering another dose until enough time has passed. The medication works by blocking pain signals in the brain and spinal cord. The most important safety rule is that ONLY the patient should press the button — if they are too sleepy to press it themselves, they are too sleepy for more medication." },
    riskFactors: ["Patients who are very sleepy or sedated", "Patients with breathing problems (COPD, sleep apnea)", "Elderly patients", "Family members pressing the button for the patient", "Patients receiving other sedating medications"],
    diagnostics: ["Count respiratory rate every 1-2 hours", "Check oxygen saturation with pulse oximeter", "Assess how alert or sleepy the patient is", "Ask patient to rate their pain on a 0-10 scale", "Check the PCA pump display for total medication delivered"],
    management: ["Ensure pump is programmed correctly per orders", "Keep side rails up and call bell within reach", "Keep naloxone (Narcan) at the bedside", "Provide non-drug pain relief measures (repositioning, ice/heat)", "Report pain not controlled by PCA to the nurse in charge"],
    nursingActions: ["Check breathing rate and alertness every 1-2 hours", "Remind patient and family that ONLY patient presses the button", "Report respiratory rate below 10 or excessive sleepiness immediately", "Document pain scores before and after PCA use", "Monitor IV site for redness, swelling, or infiltration", "Report nausea, vomiting, or itching to the nurse"],
    assessmentFindings: ["Respiratory rate and depth", "Level of alertness (awake, drowsy, difficult to arouse)", "Pain score on 0-10 scale", "IV site condition", "Bowel sounds and last bowel movement (constipation risk)"],
    signs: {
      left: ["Patient reports pain relief", "Respiratory rate 12-20 breaths/min", "Patient alert between doses", "IV site clean without redness"],
      right: ["Respiratory rate below 10/min", "Patient very difficult to wake up", "Blue color around lips (cyanosis)", "Oxygen saturation dropping below 92%"]
    },
    medications: [{
      name: "Morphine",
      type: "Opioid pain medication",
      action: "Blocks pain signals in the brain and spinal cord",
      sideEffects: "Sleepiness, nausea, constipation, itching, slow breathing",
      contra: "Severe breathing problems, allergy to morphine",
      pearl: "The patient MUST be the only one pressing the PCA button — this is the key safety feature"
    }],
    pearls: ["ONLY the patient presses the PCA button — never family or visitors", "Slow breathing is the most dangerous side effect of PCA opioids", "Constipation is expected — offer stool softeners as ordered", "Report excessive sleepiness BEFORE breathing problems develop", "Keep naloxone (Narcan) at bedside for emergencies"],
    quiz: [
      {
        question: "A patient's family member is pressing the PCA button because the patient is sleeping. What should the RPN do?",
        options: ["Allow it since the patient needs pain relief", "Educate the family that ONLY the patient should press the button", "Increase the lockout interval", "Disconnect the PCA pump"],
        correct: 1,
        rationale: "PCA by proxy (someone other than the patient pressing the button) is dangerous because the safety mechanism relies on the patient being alert enough to press the button. A sleeping patient may receive too much medication and stop breathing."
      },
      {
        question: "Which finding should be reported immediately in a patient using a PCA pump?",
        options: ["Pain rated 3/10", "Respiratory rate of 8 breaths per minute", "Mild nausea after pressing the button", "Requesting a stool softener"],
        correct: 1,
        rationale: "A respiratory rate of 8 is dangerously low and indicates opioid-induced respiratory depression, which is a life-threatening emergency requiring immediate intervention."
      },
      {
        question: "What is the purpose of the lockout interval on a PCA pump?",
        options: ["To save medication", "To prevent the patient from receiving too much medication too quickly", "To remind the patient to press the button", "To track how much pain the patient has"],
        correct: 1,
        rationale: "The lockout interval is a safety feature that prevents the pump from delivering another dose until enough time has passed for the previous dose to take effect, preventing overdose."
      }
    ]
  },
  "pcos-core-np": {
    title: "PCOS Core Management",
    cellular: { title: "PCOS Pathophysiology & Core Management", content: "Polycystic ovary syndrome (PCOS) is a complex endocrine disorder driven by hypothalamic-pituitary dysfunction resulting in elevated GnRH pulsatility, increased LH-to-FSH ratio, and thecal cell hyperandrogenism. Insulin resistance, present in 50-70% of affected women regardless of BMI, amplifies ovarian androgen production by stimulating thecal cells and suppressing hepatic sex hormone-binding globulin (SHBG) synthesis. The resulting hyperandrogenism disrupts follicular maturation, causing anovulation and the characteristic polycystic ovarian morphology with multiple small antral follicles arrested at 2-9 mm." },
    riskFactors: ["Family history of PCOS (strong genetic component)", "Insulin resistance or type 2 diabetes", "Obesity (especially central adiposity)", "Sedentary lifestyle", "Premature adrenarche", "Exposure to endocrine disruptors", "South Asian, Hispanic, or Indigenous heritage (higher prevalence)"],
    diagnostics: ["Total and free testosterone levels (elevated in hyperandrogenism)", "DHEA-S level (to rule out adrenal source)", "LH:FSH ratio (often > 2:1)", "Fasting glucose, insulin, and HbA1c", "Lipid panel (dyslipidemia screening)", "17-hydroxyprogesterone (rule out congenital adrenal hyperplasia)", "TSH and prolactin (exclude thyroid disease and prolactinoma)", "Pelvic ultrasound (≥ 12 follicles per ovary or ovarian volume > 10 mL)"],
    management: ["Combined oral contraceptives as first-line for menstrual regulation and anti-androgen effects", "Metformin for insulin resistance (especially if glucose intolerance present)", "Spironolactone for hirsutism and acne (contraindicated in pregnancy)", "Lifestyle modification: 5-10% weight loss improves ovulation and metabolic parameters", "Letrozole as first-line ovulation induction (superior to clomiphene)", "Screen for metabolic syndrome, depression, and obstructive sleep apnea", "Endometrial protection with cyclic progestin if not on OCP"],
    nursingActions: ["Coordinate metabolic screening (glucose tolerance, lipids, blood pressure)", "Provide education on long-term cardiovascular and endometrial cancer risks", "Counsel on contraception and teratogenic medications (spironolactone)", "Support lifestyle modification with nutrition and exercise referrals", "Screen for depression and anxiety (prevalence 40% in PCOS)", "Monitor for metformin GI side effects and vitamin B12 deficiency"],
    assessmentFindings: ["Hirsutism (excess terminal hair on face, chest, abdomen — Ferriman-Gallwey score)", "Acne (hormonal pattern: jawline, chin)", "Acanthosis nigricans (velvety hyperpigmentation at neck, axillae — insulin resistance marker)", "Oligomenorrhea or amenorrhea", "Central obesity with elevated waist circumference", "Androgenic alopecia (temporal thinning)"],
    signs: {
      left: ["Irregular menstrual cycles", "Mild hirsutism or acne", "Polycystic ovarian morphology on ultrasound", "Elevated BMI with central adiposity"],
      right: ["Severe hirsutism and virilization", "Acanthosis nigricans", "Prolonged amenorrhea with endometrial thickening", "Metabolic syndrome (HTN, dyslipidemia, hyperglycemia)"]
    },
    medications: [
      { name: "Metformin", type: "Biguanide/insulin sensitizer", action: "Decreases hepatic glucose production and increases peripheral insulin sensitivity, lowering circulating insulin which reduces ovarian androgen production", sideEffects: "GI upset (nausea, diarrhea, bloating), B12 deficiency with long-term use, rare lactic acidosis", contra: "eGFR < 30, acute/decompensated heart failure, hepatic impairment, contrast dye procedures", pearl: "Start low (500 mg daily) and titrate slowly to reduce GI effects; extended-release formulation better tolerated" },
      { name: "Spironolactone", type: "Aldosterone antagonist/anti-androgen", action: "Blocks androgen receptors and inhibits 5-alpha reductase, reducing hirsutism and acne", sideEffects: "Hyperkalemia, menstrual irregularity, breast tenderness, orthostatic hypotension", contra: "Pregnancy (Category X — feminization of male fetus), renal failure, hyperkalemia", pearl: "Takes 6+ months for visible hirsutism improvement; MUST use reliable contraception concurrently" }
    ],
    pearls: ["PCOS is diagnosed clinically using Rotterdam criteria — you do NOT need ultrasound if hyperandrogenism + oligo/anovulation are present", "5-10% weight loss can restore ovulation in overweight patients", "Letrozole is now first-line for ovulation induction, NOT clomiphene", "Unopposed estrogen from chronic anovulation increases endometrial cancer risk — always provide progestin protection", "Screen every PCOS patient for depression, diabetes, and cardiovascular risk factors", "Spironolactone is Category X — always confirm negative pregnancy test and reliable contraception"],
    quiz: [
      {
        question: "A 25-year-old with PCOS has amenorrhea for 8 months and is not trying to conceive. What is the most important concern?",
        options: ["Ovarian torsion", "Endometrial hyperplasia from unopposed estrogen", "Premature ovarian failure", "Cervical dysplasia"],
        correct: 1,
        rationale: "Chronic anovulation leads to continuous estrogen exposure without progesterone, causing endometrial hyperplasia and increasing endometrial cancer risk. Cyclic progestin or OCP therapy provides necessary endometrial protection."
      },
      {
        question: "Which medication is first-line for ovulation induction in PCOS?",
        options: ["Clomiphene citrate", "Metformin", "Letrozole", "Gonadotropins"],
        correct: 2,
        rationale: "Letrozole (an aromatase inhibitor) has been shown to be superior to clomiphene for ovulation induction and live birth rates in PCOS, with lower multiple pregnancy rates."
      },
      {
        question: "A patient on spironolactone for PCOS-related hirsutism reports a positive home pregnancy test. What is the priority action?",
        options: ["Continue spironolactone and add folic acid", "Discontinue spironolactone immediately and refer to OB", "Switch to finasteride", "Reassure that spironolactone is safe in pregnancy"],
        correct: 1,
        rationale: "Spironolactone is Category X and causes feminization of a male fetus. It must be stopped immediately, and the patient needs urgent obstetric referral for monitoring."
      }
    ]
  },
  "pcos-pathophysiology-np": {
    title: "PCOS Pathophysiology",
    cellular: { title: "PCOS Endocrine Pathophysiology", content: "PCOS pathophysiology centers on disrupted hypothalamic GnRH pulsatility producing a persistently elevated LH:FSH ratio. Elevated LH overstimulates ovarian thecal cells to produce excess androgens (testosterone, androstenedione), while relatively low FSH fails to support follicular maturation past the antral stage, causing follicular arrest and anovulation. Concurrently, hyperinsulinemia from peripheral insulin resistance directly stimulates thecal androgen production via insulin and IGF-1 receptors, and suppresses hepatic SHBG synthesis, increasing free testosterone bioavailability. This creates a self-perpetuating cycle: hyperandrogenism disrupts follicular development, preventing the estrogen surge needed for ovulation, while adipose tissue aromatizes excess androgens to estrone, providing continuous (rather than cyclic) estrogen that further suppresses FSH through negative feedback." },
    riskFactors: ["First-degree relative with PCOS", "Insulin resistance or metabolic syndrome", "Obesity (amplifies insulin resistance and hyperandrogenism)", "Premature adrenarche in childhood", "Low birth weight or intrauterine growth restriction", "Valproic acid use (increases testosterone and polycystic morphology)"],
    diagnostics: ["Total testosterone and free testosterone (hyperandrogenism confirmation)", "SHBG level (low in insulin resistance)", "LH and FSH levels (LH:FSH ratio often > 2:1)", "2-hour oral glucose tolerance test (more sensitive than fasting glucose alone)", "Fasting insulin level with HOMA-IR calculation", "Anti-Mullerian hormone (AMH — elevated reflects increased antral follicle count)", "17-hydroxyprogesterone (rule out non-classic CAH)", "24-hour urinary free cortisol or overnight dexamethasone suppression test (rule out Cushing syndrome)"],
    management: ["Target insulin resistance as central pathogenic driver with metformin and lifestyle modification", "Combined OCP with anti-androgenic progestin (drospirenone, cyproterone) for hyperandrogenism", "Inositol supplementation (myo-inositol and D-chiro-inositol) as insulin-sensitizing adjunct", "Weight loss of 5-10% to break hyperinsulinemia-hyperandrogenism cycle", "GLP-1 receptor agonists (liraglutide) for PCOS with obesity when metformin insufficient", "Referral to reproductive endocrinology for fertility management"],
    nursingActions: ["Educate patient on the insulin-androgen connection driving their symptoms", "Coordinate comprehensive metabolic workup at diagnosis and annually", "Screen for obstructive sleep apnea (prevalence increased in PCOS)", "Monitor metformin adherence and GI tolerance", "Provide anticipatory guidance about long-term cardiovascular and endometrial risks", "Assess mental health (depression, anxiety, body image concerns)"],
    assessmentFindings: ["Hirsutism scored by modified Ferriman-Gallwey scale (≥ 4-6 is significant)", "Acne distribution pattern (hormonal: jawline, chin, lower face)", "Acanthosis nigricans at neck folds, axillae, groin", "Central adiposity with waist circumference > 88 cm", "Oligomenorrhea (< 9 cycles/year) or secondary amenorrhea", "Temporal hair thinning (androgenic alopecia pattern)"],
    signs: {
      left: ["Oligomenorrhea with cycles every 35-90 days", "Mild hirsutism (Ferriman-Gallwey 4-8)", "Elevated BMI with normal glucose tolerance", "Polycystic morphology on ultrasound"],
      right: ["Secondary amenorrhea > 6 months", "Severe hirsutism or signs of virilization (clitoromegaly, voice deepening)", "Acanthosis nigricans with impaired glucose tolerance", "Endometrial stripe > 7 mm on ultrasound"]
    },
    medications: [
      { name: "Metformin", type: "Biguanide/insulin sensitizer", action: "Activates AMP-kinase pathway, reducing hepatic gluconeogenesis and increasing peripheral glucose uptake, thereby lowering insulin levels and indirectly reducing ovarian androgen production", sideEffects: "Nausea, diarrhea, abdominal cramping, B12 malabsorption, lactic acidosis (rare)", contra: "eGFR < 30 mL/min, acute illness with risk of tissue hypoxia, heavy alcohol use", pearl: "Extended-release formulation significantly reduces GI side effects; check B12 annually with long-term use" },
      { name: "Combined OCP (Drospirenone/EE)", type: "Hormonal contraceptive with anti-androgen", action: "Suppresses LH-driven androgen production, raises SHBG to bind free testosterone, provides cyclic progestin for endometrial protection", sideEffects: "VTE risk, headache, breast tenderness, mood changes, hypertension", contra: "Migraine with aura, personal history of VTE, uncontrolled hypertension, smoking > 35 years old, breast cancer", pearl: "Drospirenone has anti-androgenic and anti-mineralocorticoid properties making it preferred in PCOS; monitor potassium if used with spironolactone" }
    ],
    pearls: ["Insulin resistance drives hyperandrogenism in PCOS — treating insulin resistance often improves all symptoms", "AMH is elevated in PCOS and correlates with disease severity — may replace ultrasound in diagnosis", "LH:FSH ratio > 2:1 supports PCOS but is not required for diagnosis", "Valproic acid can induce a PCOS-like phenotype — consider alternative anticonvulsants in reproductive-age women", "Anovulatory cycles produce estrone (weak estrogen) continuously without progesterone, driving endometrial proliferation", "OGTT is more sensitive than fasting glucose for detecting glucose intolerance in PCOS — do not rely on HbA1c alone"],
    quiz: [
      {
        question: "Which mechanism best explains why insulin resistance worsens hyperandrogenism in PCOS?",
        options: ["Insulin directly converts estrogen to testosterone", "Hyperinsulinemia stimulates ovarian thecal cell androgen production and suppresses hepatic SHBG", "Insulin resistance increases FSH, causing follicular overproduction", "High insulin levels convert androgens to estrogen in adipose tissue"],
        correct: 1,
        rationale: "Hyperinsulinemia directly stimulates thecal cell androgen synthesis via insulin/IGF-1 receptors and simultaneously suppresses SHBG production by the liver, increasing bioavailable free testosterone."
      },
      {
        question: "Why do follicles in PCOS fail to ovulate despite being present in large numbers?",
        options: ["Excess progesterone inhibits follicular growth", "Relatively low FSH cannot support follicular maturation past the antral stage", "LH destroys developing follicles", "Elevated AMH causes premature follicular atresia"],
        correct: 1,
        rationale: "The high LH:FSH ratio means FSH is insufficient to drive dominant follicle selection and maturation. Follicles arrest at the antral stage (2-9 mm), creating the characteristic polycystic morphology."
      },
      {
        question: "A patient with PCOS on valproic acid for epilepsy reports worsening hirsutism and irregular periods. What should the NP consider?",
        options: ["Increase the valproic acid dose", "Recognize that valproic acid can worsen PCOS and discuss alternative anticonvulsants", "Add metformin without changing the anticonvulsant", "Reassure that this is expected with any anticonvulsant"],
        correct: 1,
        rationale: "Valproic acid increases testosterone levels, promotes weight gain, and can induce polycystic ovarian morphology. Switching to an alternative anticonvulsant (such as lamotrigine) should be discussed with the prescribing neurologist."
      }
    ]
  },
  "pcos-rotterdam-criteria-np": {
    title: "PCOS Rotterdam Criteria",
    cellular: { title: "Rotterdam Diagnostic Framework", content: "The Rotterdam criteria (2003) require the presence of at least 2 of 3 features for PCOS diagnosis: (1) oligo-ovulation or anovulation, (2) clinical and/or biochemical hyperandrogenism, and (3) polycystic ovarian morphology on ultrasound (≥ 12 follicles measuring 2-9 mm per ovary or ovarian volume > 10 mL), after exclusion of other etiologies. This creates four phenotypic presentations: Phenotype A (all three criteria — classic, most metabolically severe), Phenotype B (hyperandrogenism + anovulation without polycystic morphology), Phenotype C (hyperandrogenism + polycystic morphology with regular cycles — ovulatory PCOS), and Phenotype D (anovulation + polycystic morphology without hyperandrogenism — mildest metabolic profile). All phenotypes require exclusion of thyroid disease, hyperprolactinemia, non-classic CAH, Cushing syndrome, and androgen-secreting tumors." },
    riskFactors: ["First-degree relative with PCOS (heritability 60-70%)", "Metabolic syndrome components", "Childhood obesity or premature adrenarche", "South Asian or Hispanic ethnicity", "History of gestational diabetes", "Polycystic morphology detected incidentally"],
    diagnostics: ["Clinical hyperandrogenism assessment: modified Ferriman-Gallwey score for hirsutism, acne severity grading", "Biochemical hyperandrogenism: total testosterone, free testosterone, DHEA-S", "Ovulatory status: menstrual cycle history, day-21 progesterone level", "Pelvic ultrasound: antral follicle count, ovarian volume (transvaginal preferred)", "Exclusion labs: TSH, prolactin, 17-OHP, cortisol screening", "Metabolic assessment: fasting lipids, OGTT, fasting insulin"],
    management: ["Apply Rotterdam criteria systematically — document which 2 of 3 criteria are met", "Identify phenotype (A, B, C, or D) to guide metabolic risk counseling", "Complete exclusionary workup before confirming PCOS diagnosis", "Counsel on phenotype-specific metabolic risk (Phenotype A highest, D lowest)", "Initiate treatment based on presenting concerns (fertility, hirsutism, metabolic)", "Annual metabolic monitoring regardless of phenotype"],
    nursingActions: ["Obtain thorough menstrual history including cycle length, regularity, and duration", "Perform standardized hirsutism scoring (Ferriman-Gallwey scale)", "Coordinate complete exclusionary laboratory panel", "Educate patient on diagnostic criteria and their specific phenotype", "Assess psychosocial impact of diagnosis (body image, fertility anxiety)", "Document phenotype classification in medical record"],
    assessmentFindings: ["Menstrual pattern documentation (cycle length, regularity, amenorrhea duration)", "Ferriman-Gallwey score for hirsutism distribution and severity", "Acne location and severity", "Body habitus (BMI, waist circumference, waist-to-hip ratio)", "Signs of insulin resistance (acanthosis nigricans)", "Signs of virilization requiring exclusion of androgen-secreting tumor"],
    signs: {
      left: ["Irregular cycles (35+ days between periods)", "Mild facial hirsutism", "Elevated total testosterone", "Polycystic ovarian morphology on ultrasound"],
      right: ["Rapidly progressive virilization (suggests tumor, not PCOS)", "Total testosterone > 200 ng/dL (tumor workup needed)", "Galactorrhea (prolactinoma exclusion needed)", "Cushingoid features (cortisol screening needed)"]
    },
    medications: [
      { name: "Levonorgestrel/Ethinyl Estradiol", type: "Combined oral contraceptive", action: "Suppresses gonadotropin secretion reducing LH-driven androgen production; increases SHBG binding of free testosterone; provides cyclic progesterone for endometrial protection", sideEffects: "VTE risk, headache, nausea, mood changes, breakthrough bleeding", contra: "Smoking > 35 years old, history of VTE, migraine with aura, breast cancer, uncontrolled hypertension", pearl: "Any combined OCP addresses anovulation and endometrial protection; anti-androgenic progestins (drospirenone, norgestimate) preferred for hirsutism/acne" }
    ],
    pearls: ["Rotterdam criteria require 2 of 3 features PLUS exclusion of other causes — exclusion is mandatory", "Phenotype A (classic PCOS with all three criteria) carries the highest metabolic and cardiovascular risk", "Polycystic morphology alone does NOT diagnose PCOS — up to 25% of normal women have polycystic ovaries on ultrasound", "PCOS is a diagnosis of exclusion — always rule out thyroid disease, CAH, Cushing, prolactinoma, and androgen-secreting tumors first", "Adolescents require modified criteria: ultrasound morphology alone is unreliable due to normal multifollicular ovaries in puberty", "Total testosterone > 200 ng/dL or DHEA-S > 700 mcg/dL warrants tumor evaluation — these levels exceed typical PCOS"],
    quiz: [
      {
        question: "A patient has oligomenorrhea and polycystic ovarian morphology on ultrasound but normal testosterone levels. Which PCOS phenotype is this?",
        options: ["Phenotype A (classic)", "Phenotype B (anovulatory hyperandrogenic)", "Phenotype C (ovulatory hyperandrogenic)", "Phenotype D (non-hyperandrogenic)"],
        correct: 3,
        rationale: "Phenotype D has anovulation + polycystic morphology WITHOUT hyperandrogenism. This is the mildest metabolic phenotype but still requires monitoring and treatment of anovulation."
      },
      {
        question: "Which condition must be excluded FIRST when evaluating a patient for PCOS?",
        options: ["Iron deficiency anemia", "Hypothyroidism", "Vitamin D deficiency", "Osteoporosis"],
        correct: 1,
        rationale: "Hypothyroidism can cause menstrual irregularity, anovulation, and weight gain that mimics PCOS. TSH is a mandatory exclusion test in the Rotterdam diagnostic workup."
      },
      {
        question: "A 16-year-old has irregular periods and hirsutism. Ultrasound shows multifollicular ovaries. Can you diagnose PCOS?",
        options: ["Yes — she meets Rotterdam criteria", "No — ultrasound morphology is unreliable in adolescents and menstrual irregularity is common in the first 2 years after menarche", "Yes — if testosterone is elevated", "No — PCOS cannot be diagnosed under age 18"],
        correct: 1,
        rationale: "In adolescents, multifollicular ovaries are a normal variant and irregular cycles are common for 2 years post-menarche. PCOS diagnosis in adolescents requires both hyperandrogenism AND persistent oligomenorrhea (>2 years post-menarche)."
      }
    ]
  },
  "pdmp-usage-np": {
    title: "PDMP Usage",
    cellular: { title: "PDMP Purpose & Legal Framework", content: "Prescription Drug Monitoring Programs (PDMPs) are state-managed electronic databases that track controlled substance prescriptions dispensed to patients. PDMPs collect data at the point of dispensing, including patient identifiers, prescriber information, drug name, quantity, days supply, and date filled. The clinical rationale centers on identifying patients at risk for opioid use disorder, detecting doctor/pharmacy shopping, preventing dangerous drug combinations (opioid + benzodiazepine coprescribing), and supporting safe prescribing decisions. Most states mandate PDMP checks before prescribing Schedule II-IV controlled substances, with penalties for non-compliance." },
    riskFactors: ["Patients requesting early refills of controlled substances", "Multiple prescribers or pharmacies for same controlled substance class", "Concurrent opioid and benzodiazepine prescriptions", "Dose escalation without clinical justification", "History of substance use disorder", "Lost or stolen prescription reports", "Cash payment for controlled substances (avoiding insurance tracking)"],
    diagnostics: ["Query PDMP before every new controlled substance prescription", "Review complete dispensing history (all controlled substances, all prescribers, all pharmacies)", "Calculate total morphine milligram equivalents (MME) from all opioid sources", "Identify concurrent benzodiazepine, gabapentinoid, or muscle relaxant prescriptions", "Screen for inconsistencies between patient report and PDMP data", "Perform urine drug screen to confirm compliance with prescribed medications"],
    management: ["Integrate PDMP review into standard prescribing workflow", "Discuss PDMP findings with the patient in a non-judgmental manner", "Develop tapering plan when cumulative MME exceeds 90 MME/day", "Prescribe naloxone for patients with total MME > 50/day or concurrent benzodiazepine use", "Refer for substance use disorder treatment when PDMP reveals concerning patterns", "Document PDMP query results in the medical record"],
    nursingActions: ["Verify PDMP query completion before controlled substance prescriptions are sent", "Assist with calculating total MME from all opioid sources", "Educate patients on PDMP purpose as a safety tool, not punishment", "Coordinate urine drug screening as part of controlled substance monitoring", "Document PDMP review dates and findings in patient chart", "Facilitate referral to addiction medicine when indicated"],
    assessmentFindings: ["Number of controlled substance prescribers in past 12 months", "Number of pharmacies dispensing controlled substances", "Total daily MME from all opioid prescriptions", "Concurrent CNS depressant prescriptions identified", "Discrepancies between patient-reported medication use and PDMP data", "Patterns of early refill requests or dose escalation"],
    signs: {
      left: ["Single prescriber and pharmacy for controlled substances", "Consistent refill intervals matching days supply", "Total MME < 50/day", "PDMP data consistent with patient report"],
      right: ["Multiple prescribers for same drug class (doctor shopping)", "Multiple pharmacies in short time frame", "Total MME > 90/day without cancer or palliative care", "Concurrent opioid + benzodiazepine from different prescribers"]
    },
    medications: [
      { name: "Naloxone (Take-Home)", type: "Opioid antagonist", action: "Reverses opioid-induced respiratory depression in overdose emergencies", sideEffects: "Acute opioid withdrawal symptoms (pain, agitation, nausea, vomiting)", contra: "No absolute contraindications in overdose emergency", pearl: "Prescribe naloxone for ALL patients receiving > 50 MME/day or concurrent benzodiazepines — intranasal formulation (Narcan) preferred for layperson use" }
    ],
    pearls: ["Most states mandate PDMP checks before prescribing Schedule II-IV substances — know your state law", "Total MME > 90/day dramatically increases overdose risk — evaluate need for dose reduction", "The combination of opioids + benzodiazepines is the most common drug combination found in overdose deaths", "PDMP is a clinical safety tool — frame it positively for patients, not as surveillance", "Urine drug screens complement PDMP data — PDMP shows what was prescribed, UDS shows what was taken", "Document every PDMP query in the medical record including date, findings, and clinical decision"],
    quiz: [
      {
        question: "The PDMP shows a patient is receiving oxycodone from two different prescribers and filling at three different pharmacies. What is the most appropriate action?",
        options: ["Refuse to prescribe and dismiss the patient", "Discuss findings with the patient, coordinate with other prescribers, and develop a single-prescriber plan", "Report the patient to law enforcement", "Continue prescribing without addressing the findings"],
        correct: 1,
        rationale: "A non-judgmental discussion with the patient and coordination with other prescribers to consolidate care under one prescriber and one pharmacy is the safest, most ethical approach. This addresses the safety concern while maintaining the therapeutic relationship."
      },
      {
        question: "When is a PDMP query REQUIRED before prescribing?",
        options: ["Only for Schedule II opioids", "Only for new patients", "Before every new controlled substance prescription (Schedule II-IV) as mandated by most state laws", "Only when the prescriber suspects misuse"],
        correct: 2,
        rationale: "Most state laws mandate PDMP queries before every new controlled substance prescription, not just when abuse is suspected. It is a universal safety check similar to verifying drug allergies."
      },
      {
        question: "A patient's total MME from all sources is 120 mg/day. What risk mitigation strategy is essential?",
        options: ["No action needed if the patient reports good pain control", "Prescribe naloxone, discuss overdose risk, and develop a tapering plan", "Switch to a different opioid at equivalent dose", "Increase the dose to achieve better pain control"],
        correct: 1,
        rationale: "MME > 90/day significantly increases overdose death risk. CDC guidelines recommend prescribing naloxone for rescue, discussing risks, and developing a plan to reduce the total dose when possible."
      }
    ]
  },
  "peak-flow-monitoring-rpn": {
    title: "Peak Flow Monitoring",
    cellular: { title: "Peak Expiratory Flow Basics", content: "Peak expiratory flow rate (PEFR) measures the fastest speed at which a patient can blow air out of their lungs, reflecting large airway function. In asthma, airway inflammation and bronchospasm narrow the airways, reducing the peak flow reading. Patients use a handheld peak flow meter daily to track their PEFR against their personal best value. Results are compared using a traffic light zone system: Green (80-100% of personal best = well-controlled), Yellow (50-79% = caution, use rescue inhaler), Red (<50% = medical emergency)." },
    riskFactors: ["Asthma diagnosis (primary indication for peak flow monitoring)", "History of severe asthma exacerbations or ICU admissions", "Poor perception of airway obstruction (poor symptom awareness)", "Frequent use of rescue inhaler (> 2 days/week)", "Exposure to known triggers (allergens, cold air, exercise)"],
    diagnostics: ["Perform peak flow measurement daily, preferably in the morning before medications", "Record personal best PEFR when asthma is well-controlled for 2 weeks", "Calculate zone values: Green ≥ 80%, Yellow 50-79%, Red < 50% of personal best", "Compare daily readings to personal best value", "Track trends over time to detect gradual decline"],
    management: ["Follow asthma action plan based on peak flow zone", "Green zone: continue regular controller medications", "Yellow zone: use rescue inhaler, may increase controller medication per action plan", "Red zone: use rescue inhaler immediately and seek emergency care", "Bring peak flow log to all clinic appointments"],
    nursingActions: ["Teach proper peak flow technique: stand up, take deep breath, blow hard and fast", "Help patient establish personal best value", "Provide written asthma action plan with zone-based instructions", "Ensure patient can correctly use and clean the peak flow meter", "Document peak flow readings and trends", "Report yellow or red zone readings to the nurse in charge"],
    assessmentFindings: ["Current PEFR value and percentage of personal best", "Respiratory rate and effort", "Presence of wheezing, cough, or chest tightness", "Rescue inhaler use frequency", "Ability to perform peak flow technique correctly"],
    signs: {
      left: ["PEFR 80-100% of personal best (green zone)", "No wheezing or shortness of breath", "Sleeping through the night without symptoms", "Using rescue inhaler ≤ 2 days/week"],
      right: ["PEFR < 50% of personal best (red zone)", "Severe shortness of breath at rest", "Unable to speak in full sentences", "Rescue inhaler not providing relief"]
    },
    medications: [{
      name: "Albuterol (Salbutamol)",
      type: "Short-acting beta-2 agonist (SABA)",
      action: "Relaxes bronchial smooth muscle to open narrowed airways quickly",
      sideEffects: "Tremor, tachycardia, nervousness, headache",
      contra: "Use with caution in cardiac arrhythmias, hypertension",
      pearl: "Rescue inhaler for yellow/red zone — if no improvement after 2-3 treatments, seek emergency care"
    }],
    pearls: ["Personal best is the highest peak flow achieved over 2 weeks when asthma is well-controlled", "Morning peak flow is typically lowest (morning dip) — consistent measurements at same time daily are key", "Technique matters: must stand, take full breath, and blow as hard and fast as possible", "Green zone (≥80%) = good control; Yellow (50-79%) = caution; Red (<50%) = emergency", "Bring the peak flow diary to every clinic visit for provider review"],
    quiz: [
      {
        question: "A patient's peak flow reading is 45% of their personal best. What zone is this?",
        options: ["Green zone", "Yellow zone", "Red zone", "Normal — no action needed"],
        correct: 2,
        rationale: "A reading less than 50% of personal best is in the red zone, indicating a severe asthma exacerbation requiring immediate rescue inhaler use and emergency medical care."
      },
      {
        question: "When should a patient measure their peak flow to establish a personal best?",
        options: ["During an asthma attack", "When asthma has been well-controlled for at least 2 weeks", "Only at the doctor's office", "Right after exercising"],
        correct: 1,
        rationale: "Personal best is the highest peak flow reading achieved over 2 weeks when asthma is well-controlled. It serves as the baseline for calculating zone percentages."
      },
      {
        question: "A patient's peak flow is 60% of personal best and they have mild wheezing. What should they do according to the action plan?",
        options: ["Nothing — this is normal variation", "Use rescue inhaler and follow yellow zone instructions", "Call 911 immediately", "Take an extra dose of controller medication only"],
        correct: 1,
        rationale: "60% of personal best falls in the yellow zone (50-79%), indicating the patient should use their rescue inhaler and follow their yellow zone action plan, which may include temporarily increasing controller medications."
      }
    ]
  },
  "pe-basics-np": {
    title: "PE Basics",
    cellular: { title: "Pulmonary Embolism Pathophysiology", content: "Pulmonary embolism (PE) occurs when a thrombus, most commonly originating from deep veins of the lower extremities (DVT), embolizes to the pulmonary arterial vasculature. Virchow's triad (venous stasis, endothelial injury, hypercoagulability) underlies thrombus formation. The embolus lodges in pulmonary arteries, creating dead space ventilation (ventilated but unperfused alveoli), increasing V/Q mismatch, and causing hypoxemia. In massive PE, acute right ventricular (RV) pressure overload occurs as pulmonary vascular resistance rises abruptly, leading to RV dilation, septal bowing into the left ventricle (reducing LV filling), and obstructive shock." },
    riskFactors: ["Recent surgery or immobilization (> 3 days)", "Active malignancy (especially lung, pancreatic, brain, ovarian)", "Prior VTE history", "Hormonal therapy (OCP, HRT) or pregnancy", "Obesity (BMI > 30)", "Long-distance travel (> 4 hours)", "Thrombophilia (Factor V Leiden, prothrombin mutation, antiphospholipid syndrome)", "Central venous catheter placement", "Heart failure or chronic lung disease"],
    diagnostics: ["Apply Wells criteria to stratify pre-test probability (low, moderate, high)", "D-dimer for low-probability patients (high negative predictive value)", "CT pulmonary angiography (CTPA) — gold standard confirmatory imaging", "RV strain markers: elevated troponin and BNP", "ECG findings: sinus tachycardia (most common), S1Q3T3, right axis deviation, new RBBB", "ABG: respiratory alkalosis with hypoxemia and elevated A-a gradient", "Echocardiography for hemodynamically unstable patients (RV dilation, McConnell sign)"],
    management: ["Anticoagulation with unfractionated heparin or LMWH for confirmed PE", "Transition to DOAC (rivaroxaban, apixaban) or warfarin for ongoing therapy", "Systemic thrombolysis (alteplase) for massive PE with hemodynamic instability", "Catheter-directed therapy or surgical embolectomy when thrombolysis contraindicated", "IVC filter for patients with absolute contraindication to anticoagulation", "Minimum 3 months anticoagulation; indefinite for unprovoked PE or recurrent VTE", "Risk-stratify using sPESI or PESI to determine outpatient vs inpatient management"],
    nursingActions: ["Initiate continuous cardiac monitoring and pulse oximetry", "Administer heparin per protocol with aPTT monitoring every 6 hours initially", "Monitor for signs of hemodynamic deterioration (tachycardia, hypotension)", "Assess for bleeding complications of anticoagulation therapy", "Maintain bed rest during initial treatment phase", "Educate on long-term anticoagulation, drug-food interactions, and bleeding precautions"],
    assessmentFindings: ["Sudden-onset dyspnea (most common symptom)", "Pleuritic chest pain", "Tachycardia and tachypnea", "Hemoptysis (suggests pulmonary infarction)", "Unilateral leg swelling suggesting concurrent DVT", "Hypotension and JVD in massive PE"],
    signs: {
      left: ["Mild dyspnea with exertion", "Pleuritic chest pain", "Tachycardia (> 100 bpm)", "Unilateral calf swelling/tenderness (DVT source)"],
      right: ["Acute-onset severe dyspnea at rest", "Hypotension (SBP < 90) with obstructive shock", "Jugular venous distension (RV failure)", "Syncope or cardiac arrest"]
    },
    medications: [
      { name: "Enoxaparin (Lovenox)", type: "Low-molecular-weight heparin", action: "Binds antithrombin III enhancing factor Xa inhibition, preventing clot propagation", sideEffects: "Bleeding, injection site bruising, thrombocytopenia (HIT — less common than UFH)", contra: "Active major bleeding, HIT, severe renal impairment (CrCl < 30 use UFH instead)", pearl: "Dose 1 mg/kg SubQ every 12 hours for treatment; no routine aPTT monitoring needed; check anti-Xa levels in obesity and renal impairment" },
      { name: "Alteplase (tPA)", type: "Thrombolytic/fibrinolytic", action: "Converts plasminogen to plasmin, directly dissolving the pulmonary thrombus", sideEffects: "Major hemorrhage (intracranial hemorrhage is most feared), reperfusion arrhythmias", contra: "Recent surgery (< 3 weeks), active bleeding, hemorrhagic stroke, intracranial neoplasm", pearl: "Reserved for massive PE with hemodynamic instability; 100 mg IV over 2 hours; reduces mortality but carries 2-3% risk of intracranial hemorrhage" }
    ],
    pearls: ["Sinus tachycardia is the most common ECG finding in PE — S1Q3T3 is classic but uncommon", "D-dimer is useful to RULE OUT PE in low-probability patients only — it cannot confirm PE", "CT pulmonary angiography is the gold standard for PE diagnosis", "Right heart strain (elevated troponin/BNP, RV dilation on echo) indicates submassive PE requiring close monitoring", "Massive PE = hemodynamic instability — consider thrombolysis", "Wells score ≥ 7 = high probability — go directly to CTPA, skip D-dimer"],
    quiz: [
      {
        question: "A patient with Wells score of 2 (low probability) has a negative D-dimer. What is the next step?",
        options: ["Order CTPA to confirm", "PE is effectively ruled out — no further imaging needed", "Administer heparin empirically", "Order a V/Q scan"],
        correct: 1,
        rationale: "In a low-probability patient, a negative D-dimer has a > 99% negative predictive value, effectively ruling out PE without the need for imaging."
      },
      {
        question: "A patient with confirmed PE has a blood pressure of 78/50 mmHg and RV dilation on echocardiogram. What classification is this PE?",
        options: ["Low-risk PE", "Submassive PE", "Massive PE", "Chronic PE"],
        correct: 2,
        rationale: "Massive PE is defined by hemodynamic instability (SBP < 90 mmHg). Combined with RV dilation, this patient requires consideration of systemic thrombolysis or surgical embolectomy."
      },
      {
        question: "Which anticoagulant should be used in PE with severe renal impairment (CrCl < 30)?",
        options: ["Enoxaparin", "Rivaroxaban", "Unfractionated heparin (UFH)", "Apixaban"],
        correct: 2,
        rationale: "UFH is preferred in severe renal impairment because it is cleared by the reticuloendothelial system, not the kidneys. Enoxaparin and DOACs accumulate with renal dysfunction, increasing bleeding risk."
      }
    ]
  },
  "pe-diagnostic-criteria-np": {
    title: "PE: Wells Criteria & D-Dimer Interpretation",
    cellular: { title: "Wells Score & D-Dimer Diagnostic Algorithm", content: "The Wells criteria is a validated clinical decision rule that stratifies the pre-test probability of PE using seven weighted variables: clinical signs/symptoms of DVT (3 points), PE as likely or more likely than alternative diagnosis (3 points), heart rate > 100 (1.5 points), immobilization > 3 days or surgery within 4 weeks (1.5 points), previous PE/DVT (1.5 points), hemoptysis (1 point), and active cancer (1 point). Using a two-tier model: score ≤ 4 = PE unlikely (proceed to D-dimer), score > 4 = PE likely (proceed directly to CTPA). D-dimer is a fibrin degradation product with high sensitivity (>95%) but low specificity — it reliably excludes PE when negative in low-probability patients but is elevated in many other conditions (infection, surgery, pregnancy, malignancy, aging)." },
    riskFactors: ["Recent surgery or prolonged immobilization", "Active malignancy within 6 months", "Prior DVT or PE", "Hormonal contraception or HRT use", "Pregnancy or postpartum period", "Obesity", "Known thrombophilia", "Long-haul travel", "Central venous catheter"],
    diagnostics: ["Calculate Wells score using all 7 criteria with correct point values", "D-dimer quantitative assay for PE-unlikely group (Wells ≤ 4)", "Apply age-adjusted D-dimer cutoff: age × 10 mcg/L for patients > 50 years", "CTPA as definitive imaging for PE-likely (Wells > 4) or positive D-dimer", "V/Q scan when CTPA contraindicated (contrast allergy, renal insufficiency, pregnancy)", "Compression ultrasound of lower extremities if DVT symptoms present", "Point-of-care echocardiography for unstable patients unable to travel to CT scanner"],
    management: ["Apply structured diagnostic algorithm — do not skip directly to CTPA for all patients", "Use age-adjusted D-dimer cutoffs to reduce false positives in elderly patients", "Initiate empiric anticoagulation if clinical suspicion is high while awaiting imaging", "Risk-stratify confirmed PE using PESI or sPESI for disposition planning", "Low-risk PE (sPESI = 0) may be managed as outpatient with DOAC", "Submassive PE requires ICU monitoring; massive PE requires thrombolysis consideration"],
    nursingActions: ["Gather Wells criteria variables from history and assessment", "Ensure D-dimer is drawn BEFORE anticoagulation is initiated (treatment can alter results)", "Coordinate rapid CTPA for Wells > 4 or positive D-dimer patients", "Monitor hemodynamic status while awaiting diagnostic confirmation", "Administer empiric anticoagulation per protocol for high-probability cases", "Document Wells score calculation and diagnostic rationale in chart"],
    assessmentFindings: ["Tachycardia > 100 bpm (Wells criteria component)", "Clinical DVT signs: unilateral leg swelling, tenderness, warmth, Homans sign (unreliable)", "Hemoptysis (Wells criteria component)", "Active cancer or recent surgery history", "Dyspnea severity and onset pattern (sudden = higher suspicion)", "Vital sign stability for risk stratification"],
    signs: {
      left: ["Wells ≤ 4 with negative D-dimer (PE effectively ruled out)", "Stable vitals with pleuritic chest pain", "Low PESI/sPESI score", "Alternative diagnosis more likely"],
      right: ["Wells > 4 (PE likely — CTPA indicated)", "Positive D-dimer with low Wells score", "Hemodynamic instability requiring emergent workup", "RV strain signs on bedside echo"]
    },
    medications: [
      { name: "Rivaroxaban", type: "Direct oral anticoagulant (factor Xa inhibitor)", action: "Directly inhibits factor Xa without requiring antithrombin as cofactor, interrupting both intrinsic and extrinsic coagulation pathways", sideEffects: "Bleeding, GI upset, elevated liver enzymes", contra: "CrCl < 15 mL/min, active pathological bleeding, concomitant strong dual CYP3A4/P-gp inhibitors", pearl: "Can be used as single-agent for PE treatment: 15 mg BID × 21 days then 20 mg daily; must take with food for adequate absorption at 15 mg dose" }
    ],
    pearls: ["Wells criteria: the 3-point items are most heavily weighted — clinical DVT signs and 'PE most likely diagnosis'", "D-dimer is a RULE-OUT test only — a positive D-dimer does NOT confirm PE", "Age-adjusted D-dimer cutoff (age × 10 mcg/L) for patients > 50 reduces unnecessary CTPA by 11-12%", "NEVER delay anticoagulation in a high-probability patient just because CTPA is not immediately available", "The most common Wells pitfall is applying D-dimer to high-probability (>4) patients — these go straight to CTPA", "PERC rule can be used in very low-risk ED patients to avoid D-dimer testing entirely"],
    quiz: [
      {
        question: "A 65-year-old patient has a Wells score of 3 (PE unlikely). Their D-dimer cutoff using age-adjusted criteria would be:",
        options: ["500 mcg/L (standard cutoff)", "650 mcg/L (age × 10)", "1000 mcg/L", "Age adjustment is not validated for D-dimer"],
        correct: 1,
        rationale: "The age-adjusted D-dimer cutoff for patients > 50 is calculated as age × 10 mcg/L. For a 65-year-old, the cutoff is 650 mcg/L rather than the standard 500 mcg/L, reducing false positives."
      },
      {
        question: "A patient has a Wells score of 6. What is the appropriate next diagnostic step?",
        options: ["D-dimer testing", "CTPA directly — skip D-dimer", "Compression ultrasound", "Chest X-ray"],
        correct: 1,
        rationale: "Wells > 4 classifies the patient as PE-likely. D-dimer is insufficiently specific in this group and should be skipped. CTPA is the appropriate next step for definitive diagnosis."
      },
      {
        question: "Which Wells criteria variable carries the highest point value?",
        options: ["Heart rate > 100 (1.5 points)", "Clinical signs of DVT (3 points)", "Hemoptysis (1 point)", "Previous DVT/PE (1.5 points)"],
        correct: 1,
        rationale: "Clinical signs/symptoms of DVT and 'PE as likely or more likely than alternative diagnosis' each carry 3 points — the highest-weighted variables in the Wells criteria."
      }
    ]
  },
  "pediatric-diagnostic-criteria-np": {
    title: "Otitis Media: Bulging TM Requirement",
    cellular: { title: "AOM Diagnostic Pathophysiology", content: "Acute otitis media (AOM) develops when eustachian tube dysfunction (shorter, more horizontal, and more compliant in children) leads to negative middle ear pressure and fluid accumulation (effusion). Bacterial colonization of this effusion by Streptococcus pneumoniae, non-typeable Haemophilus influenzae, or Moraxella catarrhalis triggers an acute inflammatory response. The 2013 AAP guidelines require a bulging tympanic membrane (TM) for definitive AOM diagnosis, distinguishing true AOM from otitis media with effusion (OME), which does not require antibiotics. Moderate-to-severe bulging has a 98% positive predictive value for bacterial AOM, while TM erythema alone has poor diagnostic specificity (often caused by crying or fever)." },
    riskFactors: ["Age 6-24 months (peak incidence)", "Daycare attendance (increased pathogen exposure)", "Lack of breastfeeding (reduced passive immunity)", "Supine bottle-feeding (milk pooling near eustachian tube)", "Pacifier use after 6 months", "Exposure to secondhand smoke", "Craniofacial anomalies (cleft palate, Down syndrome)", "Prior episodes of AOM", "Family history of recurrent AOM"],
    diagnostics: ["Pneumatic otoscopy — the single most important diagnostic tool for AOM", "Assess TM position (bulging = AOM), color (yellow/white = purulent effusion), mobility (decreased = effusion), and translucency (opacification)", "Tympanometry (flat Type B curve confirms effusion)", "Distinguish AOM (bulging TM with acute symptoms) from OME (retracted/neutral TM, no acute symptoms)", "Document laterality (unilateral vs bilateral) and severity (mild, moderate, severe)"],
    management: ["Immediate antibiotics for: age < 6 months, bilateral AOM in 6-23 months, severe symptoms (fever ≥ 39°C, severe otalgia, > 48 hours symptoms)", "Observation option for: unilateral AOM in 6-23 months with mild symptoms, any AOM in ≥ 24 months with mild symptoms", "First-line: amoxicillin 80-90 mg/kg/day divided BID", "Second-line (treatment failure at 48-72 hours): amoxicillin-clavulanate 90 mg/kg/day", "Third-line: IM ceftriaxone × 3 days or tympanocentesis", "Refer for tympanostomy tubes after 3 episodes in 6 months or 4 in 12 months"],
    nursingActions: ["Educate parents on watchful waiting when appropriate and safety net instructions", "Provide pain management as priority (regardless of antibiotic decision)", "Educate on antibiotic completion and signs requiring return visit", "Counsel on risk reduction (breastfeeding, smoke-free environment, upright feeding position)", "Schedule 48-72 hour follow-up for observation option patients", "Administer pneumococcal vaccine per schedule (reduces AOM incidence)"],
    assessmentFindings: ["Ear pain (otalgia) — infants pull/tug at ears", "Irritability and poor feeding in infants", "Fever (variable, may be absent)", "Hearing difficulty or muffled hearing", "Purulent otorrhea if TM perforates", "Bulging, opacified TM with decreased mobility on pneumatic otoscopy"],
    signs: {
      left: ["Unilateral ear tugging with mild fussiness", "Mild TM erythema with normal mobility", "Low-grade fever < 39°C", "Clear middle ear effusion (OME, not AOM)"],
      right: ["Full or moderate TM bulging with purulent effusion", "Bilateral AOM in infant < 24 months", "Fever ≥ 39°C with severe otalgia > 48 hours", "Purulent otorrhea from TM perforation"]
    },
    medications: [
      { name: "Amoxicillin (high-dose)", type: "Aminopenicillin antibiotic", action: "Inhibits bacterial cell wall synthesis; high dose (80-90 mg/kg/day) overcomes intermediate S. pneumoniae resistance", sideEffects: "Diarrhea, rash (10%), nausea, diaper dermatitis", contra: "Penicillin anaphylaxis; maculopapular rash during EBV infection (not a true allergy)", pearl: "HIGH-dose (80-90 mg/kg/day BID) is standard for AOM — NOT standard dose (25-45 mg/kg/day); overcomes pneumococcal resistance" },
      { name: "Amoxicillin-Clavulanate", type: "Beta-lactam/beta-lactamase inhibitor", action: "Clavulanate protects amoxicillin from beta-lactamase-producing H. influenzae and M. catarrhalis", sideEffects: "Diarrhea (more common than amoxicillin alone), nausea, diaper candidiasis", contra: "Penicillin anaphylaxis, cholestatic jaundice with prior use", pearl: "Use 14:1 formulation (ES-600) for high-dose amoxicillin component with lower clavulanate to minimize diarrhea" }
    ],
    pearls: ["A BULGING TM is required for definitive AOM diagnosis — redness alone is NOT enough (kids cry and get red TMs)", "Pain management is the FIRST priority regardless of antibiotic decision", "Observation (watchful waiting) is appropriate for mild unilateral AOM in children ≥ 6 months with reliable follow-up", "High-dose amoxicillin (80-90 mg/kg/day) is standard — NOT regular dose", "OME (effusion without acute symptoms) does NOT need antibiotics — it usually resolves spontaneously in 3 months", "Refer for tympanostomy tubes after 3 AOM episodes in 6 months or 4 in 12 months"],
    quiz: [
      {
        question: "A 15-month-old has bilateral AOM with fever of 39.5°C. Is watchful waiting appropriate?",
        options: ["Yes — observation is always appropriate for AOM", "No — bilateral AOM in a child under 24 months with high fever requires immediate antibiotics", "Yes — if parents are reliable for follow-up", "No — because the child is too young for any antibiotics"],
        correct: 1,
        rationale: "Bilateral AOM in a child aged 6-23 months AND severe symptoms (fever ≥ 39°C) both independently meet criteria for immediate antibiotic therapy. Watchful waiting is not appropriate here."
      },
      {
        question: "Why is high-dose amoxicillin (80-90 mg/kg/day) used instead of standard dose for AOM?",
        options: ["Children need more medication per kilogram than adults", "To overcome intermediate-resistant Streptococcus pneumoniae, the most common AOM pathogen", "Higher doses treat viral infections more effectively", "It reduces the treatment duration from 10 days to 5 days"],
        correct: 1,
        rationale: "High-dose amoxicillin achieves middle ear concentrations above the MIC for intermediately resistant S. pneumoniae, the most common and most pathogenic AOM organism."
      },
      {
        question: "A toddler's TM appears red but has normal mobility on pneumatic otoscopy and no bulging. What is the most likely assessment?",
        options: ["Acute otitis media requiring antibiotics", "Otitis media with effusion", "TM erythema from crying/fever — NOT diagnostic of AOM", "TM perforation"],
        correct: 2,
        rationale: "TM redness alone without bulging or decreased mobility does not meet the 2013 AAP diagnostic criteria for AOM. Crying and fever commonly cause TM erythema without infection."
      }
    ]
  },
  "pediatric-dosing-logic-np": {
    title: "Pediatric Weight-Based Dosing",
    cellular: { title: "Pediatric Pharmacokinetic Differences", content: "Pediatric drug dosing differs fundamentally from adult dosing because children are not 'small adults' — they have distinct pharmacokinetic profiles that change with developmental stage. Neonates have higher body water content (70-80% vs 60% in adults), lower plasma protein binding (less albumin), immature hepatic enzyme systems (CYP450 enzymes mature at different rates, with CYP3A7 dominant at birth transitioning to CYP3A4), and immature renal function (GFR reaches adult levels by age 1-2 years). These differences affect drug distribution, metabolism, and excretion, making weight-based (mg/kg) dosing essential. Critically, the calculated dose must never exceed the maximum adult dose regardless of the child's weight." },
    riskFactors: ["Dosing errors are the most common medication errors in pediatrics", "Weight recorded in pounds instead of kilograms (2.2× overdose risk)", "Decimal point errors in dose calculation", "Formulation confusion (infant drops vs children's liquid — different concentrations)", "Off-label medication use (limited pediatric-specific data)", "Neonates and premature infants (most variable pharmacokinetics)"],
    diagnostics: ["Verify weight in KILOGRAMS at every visit (never use estimated or parental-reported weight for dosing)", "Calculate dose: weight (kg) × dose (mg/kg) = total dose (mg)", "Compare calculated dose against maximum adult dose — use whichever is lower", "Verify correct formulation and concentration before dispensing/administering", "Calculate volume for liquid medications: dose (mg) / concentration (mg/mL) = volume (mL)", "Review age-specific dosing references for each medication"],
    management: ["Always use mg/kg dosing for pediatric prescriptions", "Round doses appropriately for available formulations", "Specify concentration on prescription (125 mg/5 mL vs 250 mg/5 mL)", "Include mg/kg dose, calculated dose, AND concentration on every prescription", "Use electronic prescribing with pediatric dosing support when available", "Independent double-check for all high-alert medications"],
    nursingActions: ["Weigh child in KILOGRAMS using calibrated scale — do not rely on parental estimate", "Independently calculate and verify dose before administration", "Verify formulation concentration matches the prescription", "Use oral syringe (not household spoon) for measuring liquid medications", "Educate caregivers on correct measurement using oral syringe", "Report any dose that seems unusually high or low before administering"],
    assessmentFindings: ["Accurate weight in kilograms", "Medication dose calculated correctly (mg/kg × weight)", "Dose does not exceed maximum adult dose", "Correct formulation and concentration identified", "Appropriate route and frequency verified"],
    signs: {
      left: ["Dose within expected mg/kg range for medication", "Weight measured in kilograms on calibrated scale", "Correct concentration formulation selected", "Calculated dose below maximum adult dose"],
      right: ["Dose exceeding maximum adult dose for medication", "Weight recorded in pounds used for kg calculation (2.2× error)", "Tenfold dosing error (decimal point misplacement)", "Wrong formulation concentration dispensed"]
    },
    medications: [
      { name: "Amoxicillin", type: "Aminopenicillin antibiotic", action: "Inhibits bacterial cell wall synthesis by binding penicillin-binding proteins", sideEffects: "Diarrhea, rash, nausea, diaper dermatitis", contra: "Penicillin anaphylaxis", pearl: "Standard dose 25 mg/kg/day, high-dose 80-90 mg/kg/day; max 3 g/day; available as 125 mg/5 mL, 250 mg/5 mL, 400 mg/5 mL — ALWAYS specify concentration" },
      { name: "Ibuprofen", type: "NSAID", action: "Inhibits COX-1 and COX-2, reducing prostaglandin synthesis for antipyretic and analgesic effects", sideEffects: "GI irritation, renal impairment with dehydration, rare bleeding", contra: "Age < 6 months, renal impairment, dehydration, active GI bleeding", pearl: "Dose 5-10 mg/kg every 6-8 hours; max 40 mg/kg/day; can alternate with acetaminophen for fever; do NOT use in dehydrated children" }
    ],
    pearls: ["The #1 pediatric dosing error is using pounds instead of kilograms — ALWAYS weigh in kg", "NEVER exceed the maximum adult dose regardless of the child's weight", "Infant drops and children's liquid are DIFFERENT concentrations — verify formulation", "Include mg/kg dose, calculated total dose, AND concentration on every pediatric prescription", "Tenfold errors (decimal point mistakes) are common and potentially fatal — always double-check", "Use oral syringes, never household spoons, for measuring liquid medications"],
    quiz: [
      {
        question: "A 22-kg child needs amoxicillin at 80 mg/kg/day divided BID. The max adult dose is 3 g/day. What is the correct daily dose?",
        options: ["1760 mg/day", "3000 mg/day (max adult dose)", "880 mg/day", "1760 mg/day (below max, so this is correct)"],
        correct: 3,
        rationale: "80 mg/kg × 22 kg = 1760 mg/day. Since 1760 mg is below the 3000 mg/day maximum adult dose, 1760 mg/day is correct, given as 880 mg BID."
      },
      {
        question: "A nurse notices a child's weight is charted as 44 (unit not specified) and a medication was dosed at 44 kg. The child appears to weigh about 44 lbs. What error likely occurred?",
        options: ["Underdosing", "A 2.2-times overdose (44 lbs = 20 kg, not 44 kg)", "The dose is correct", "A tenfold overdose"],
        correct: 1,
        rationale: "If the child weighs 44 pounds (20 kg) but was dosed as 44 kg, the dose is 2.2 times too high. This pounds-to-kilograms conversion error is the most common pediatric dosing mistake."
      },
      {
        question: "Which step is MOST critical before administering a liquid medication to a pediatric patient?",
        options: ["Checking the child's temperature", "Verifying the concentration matches the prescribed formulation", "Asking the parent what dose they give at home", "Checking if the child has eaten recently"],
        correct: 1,
        rationale: "Different formulations (infant drops vs children's liquid) have different concentrations. Using the wrong concentration with the correct volume results in a significant dosing error."
      }
    ]
  },
  "pediatric-early-warning-rn": {
    title: "Pediatric Early Warning Score",
    cellular: { title: "PEWS Physiologic Rationale", content: "Pediatric Early Warning Score (PEWS) systems provide a standardized framework for recognizing clinical deterioration in hospitalized children. Children compensate for physiologic stress differently than adults — they maintain blood pressure through tachycardia and increased systemic vascular resistance until late decompensation, at which point deterioration is sudden and catastrophic. PEWS assigns numerical scores to parameters including behavior/neurologic status, cardiovascular status (heart rate, capillary refill, skin color), and respiratory status (respiratory rate, effort, oxygen requirement). Rising PEWS scores trigger escalation protocols, enabling early intervention before cardiopulmonary arrest occurs." },
    riskFactors: ["Children with chronic complex conditions (multiple comorbidities)", "Post-operative patients (risk of hemorrhage, respiratory depression)", "Children with respiratory infections (bronchiolitis, pneumonia, asthma)", "Patients receiving sedating medications (opioids, benzodiazepines)", "Immunocompromised patients (sepsis risk)", "Age < 1 year (limited physiologic reserve)", "Children recently transferred from ICU"],
    diagnostics: ["Calculate PEWS score using validated tool at prescribed intervals (every 4 hours minimum)", "Assess behavior: alert/playful (0), sleeping (1), irritable (2), lethargic/unresponsive (3)", "Assess cardiovascular: heart rate, capillary refill, skin color/temperature", "Assess respiratory: rate, effort (nasal flaring, retractions, grunting), oxygen needs", "Document scores and trends — a RISING trend is as important as a single high score", "Apply age-appropriate normal vital sign ranges (differs significantly by age group)"],
    management: ["PEWS 0-2: Continue routine monitoring per unit protocol", "PEWS 3-4: Increase monitoring frequency to every 1-2 hours, notify charge nurse", "PEWS 5-6: Notify physician/NP, prepare for possible transfer to higher level of care", "PEWS ≥ 7: Activate rapid response team", "Any single score of 3 in any category: immediate physician notification regardless of total score", "Document escalation actions and provider response"],
    nursingActions: ["Calculate PEWS at admission and per prescribed intervals", "Use age-appropriate vital sign reference ranges for scoring", "Report rising PEWS trends even if individual scores are moderate", "Communicate PEWS findings using SBAR to receiving provider", "Activate rapid response team per hospital protocol when PEWS threshold met", "Document all PEWS scores, trends, escalation actions, and responses"],
    assessmentFindings: ["Level of consciousness and interactivity (most sensitive behavioral indicator)", "Heart rate compared to age-appropriate norms", "Capillary refill time (central, > 3 seconds is concerning)", "Respiratory rate, work of breathing (nasal flaring, intercostal/subcostal retractions, grunting)", "Oxygen saturation and supplemental oxygen requirement", "Skin color and temperature (pallor, mottling, cyanosis)"],
    signs: {
      left: ["PEWS 0-2: Alert, age-appropriate vitals", "Normal capillary refill (< 2 seconds)", "No respiratory distress", "Interactive and feeding well"],
      right: ["PEWS ≥ 7: Rapid response activation needed", "Lethargy or poor responsiveness", "Mottling, pallor, or prolonged capillary refill > 4 seconds", "Grunting, severe retractions, or apnea"]
    },
    medications: [{
      name: "Normal Saline (0.9% NaCl)",
      type: "Isotonic crystalloid fluid",
      action: "Volume resuscitation to restore intravascular volume and improve perfusion in pediatric shock",
      sideEffects: "Fluid overload, hyperchloremic metabolic acidosis with large volumes",
      contra: "Caution in heart failure and conditions with fluid overload risk",
      pearl: "Pediatric fluid bolus: 20 mL/kg IV push over 5-20 minutes; may repeat up to 60 mL/kg total; reassess after each bolus"
    }],
    pearls: ["Children compensate until they DON'T — hypotension is a LATE and ominous sign in pediatrics", "A rising PEWS trend is as important as a single elevated score — track trends", "Behavior change (lethargy, irritability) is often the earliest sign of deterioration", "Age-appropriate vital sign ranges are ESSENTIAL — a heart rate of 150 is normal in an infant but tachycardic in a 10-year-old", "Grunting is a sign of severe respiratory distress in children — it represents auto-PEEP to maintain functional residual capacity", "Trust nursing assessment — if the child 'doesn't look right,' escalate regardless of the PEWS score"],
    quiz: [
      {
        question: "A 2-year-old has a PEWS of 5 that has risen from 2 over the past 4 hours. What is the priority action?",
        options: ["Continue monitoring and reassess in 4 hours", "Notify the physician/NP and prepare for possible transfer to higher level of care", "Administer acetaminophen for fever", "Ask the parent if this behavior is normal"],
        correct: 1,
        rationale: "A PEWS of 5 with a rising trend from 2 indicates significant clinical deterioration. The physician must be notified for evaluation and the team should prepare for potential transfer to a higher level of care."
      },
      {
        question: "Why is hypotension a particularly dangerous finding in a pediatric patient?",
        options: ["Children normally have lower blood pressure than adults", "Hypotension occurs early in pediatric illness", "Hypotension is a LATE sign in children, indicating cardiovascular compensation has failed", "Hypotension only occurs with dehydration in children"],
        correct: 2,
        rationale: "Children maintain blood pressure through tachycardia and vasoconstriction until their compensatory mechanisms are exhausted. When blood pressure drops, decompensation is imminent, and arrest may follow rapidly."
      },
      {
        question: "Which finding on PEWS assessment is often the earliest indicator of clinical deterioration in children?",
        options: ["Elevated blood pressure", "Behavior change (increased irritability or lethargy)", "Decreased urine output", "Bradycardia"],
        correct: 1,
        rationale: "Changes in behavior and responsiveness (irritability, lethargy, decreased interaction) are often the earliest and most sensitive indicators of deterioration in children, preceding vital sign changes."
      }
    ]
  },
  "pediatric-growth-disorders-np": {
    title: "Pediatric Growth Disorders",
    cellular: { title: "Growth Hormone Axis & Failure to Thrive", content: "Normal linear growth is regulated by the GH-IGF-1 axis: hypothalamic GHRH stimulates anterior pituitary growth hormone (GH) release, which acts on hepatocytes to produce insulin-like growth factor 1 (IGF-1). IGF-1 mediates long bone growth by stimulating chondrocyte proliferation at the epiphyseal growth plate. Growth hormone deficiency (GHD) results from pituitary pathology (tumors, surgery, radiation, congenital hypopituitarism) and presents with proportionate short stature, delayed bone age, and characteristic facial features (frontal bossing, midface hypoplasia). Failure to thrive (FTT) is weight < 5th percentile or crossing downward across two major percentile lines, most commonly caused by inadequate caloric intake rather than organic disease." },
    riskFactors: ["Family history of short stature or constitutional growth delay", "History of cranial irradiation or CNS tumors", "Congenital midline defects (septo-optic dysplasia)", "Chronic disease (celiac, IBD, renal failure, cystic fibrosis)", "Psychosocial deprivation or neglect", "Prematurity or intrauterine growth restriction (IUGR/SGA)", "Turner syndrome (45,X) in females", "Hypothyroidism"],
    diagnostics: ["Plot serial growth measurements on age/sex-appropriate growth charts (WHO for < 2 years, CDC for 2-20)", "Calculate growth velocity (cm/year) — more important than single measurements", "Bone age radiograph (left hand/wrist) — delayed bone age suggests GHD or constitutional delay", "IGF-1 and IGFBP-3 levels (screening for GH deficiency)", "GH stimulation testing (arginine, glucagon, clonidine) if IGF-1 low — confirms GHD", "Thyroid function tests (hypothyroidism stunts growth)", "Celiac screening (tTG-IgA)", "Karyotype in short females (Turner syndrome)"],
    management: ["Recombinant human growth hormone (rhGH) daily subcutaneous injection for confirmed GHD", "Treat underlying cause (levothyroxine for hypothyroidism, gluten-free diet for celiac)", "Nutritional rehabilitation for FTT (increase caloric density, feeding therapy)", "Monitor growth velocity, IGF-1 levels, and bone age during GH therapy", "Screening for GH-related side effects: scoliosis progression, slipped capital femoral epiphysis (SCFE), pseudotumor cerebri", "Refer to pediatric endocrinology for GH stimulation testing and treatment initiation"],
    nursingActions: ["Measure height/length accurately using stadiometer (standing) or infantometer (supine for < 2 years)", "Plot all growth parameters at every visit and identify percentile crossing", "Coordinate referral to pediatric endocrinology for growth failure workup", "Educate families on GH injection technique, site rotation, and storage (refrigeration)", "Monitor for GH side effects at each visit (joint pain, headache, limp)", "Assess nutritional intake with 3-day food recall for FTT evaluation"],
    assessmentFindings: ["Height/length below 3rd percentile or crossing downward across two major percentile lines", "Growth velocity below normal for age (< 5 cm/year after age 4 is concerning)", "Proportionate short stature (normal body proportions) in GHD", "Delayed bone age on wrist X-ray", "Weight-for-height ratio (normal in GHD, low in FTT)", "Micropenis or midline defects in congenital GHD"],
    signs: {
      left: ["Short stature tracking below but parallel to growth curve (familial short stature)", "Constitutional delay: bone age delayed, predicted adult height normal", "Weight-for-height ratio appropriate", "Normal growth velocity for bone age"],
      right: ["Crossing downward across two major percentile lines", "Growth velocity < 4 cm/year after age 4", "Bone age delayed > 2 standard deviations", "Associated symptoms: headache, visual changes (pituitary tumor)"]
    },
    medications: [
      { name: "Somatropin (rhGH)", type: "Recombinant growth hormone", action: "Replaces deficient growth hormone, stimulating IGF-1 production, chondrocyte proliferation at growth plates, and linear growth", sideEffects: "Injection site reactions, arthralgia, headache, slipped capital femoral epiphysis (SCFE), pseudotumor cerebri, scoliosis progression", contra: "Active malignancy, closed epiphyses, Prader-Willi syndrome with severe obesity/respiratory impairment, acute critical illness", pearl: "Given as daily subcutaneous injection at bedtime (mimics physiologic nocturnal GH surge); treatment continues until near-final height or growth plates close; monitor IGF-1 to guide dosing" }
    ],
    pearls: ["Growth VELOCITY is more important than a single height measurement — plot serial data on growth curves", "Bone age delayed vs chronological age distinguishes GHD and constitutional delay from familial short stature", "FTT is most commonly caused by inadequate caloric intake, NOT organic disease", "In girls with unexplained short stature, always order a karyotype to rule out Turner syndrome (45,X)", "GH injection at bedtime mimics the physiologic nocturnal GH surge", "Report limping or hip/knee pain in a child on GH — may indicate slipped capital femoral epiphysis (SCFE)"],
    quiz: [
      {
        question: "A 7-year-old boy is at the 2nd percentile for height with a bone age of 4 years and low IGF-1 level. What is the most likely diagnosis?",
        options: ["Familial short stature", "Constitutional growth delay", "Growth hormone deficiency", "Turner syndrome"],
        correct: 2,
        rationale: "Short stature with significantly delayed bone age AND low IGF-1 strongly suggests growth hormone deficiency. GH stimulation testing would be the next confirmatory step."
      },
      {
        question: "A child on growth hormone therapy reports a new limp and knee pain. What complication should be suspected?",
        options: ["Normal growing pains", "Osgood-Schlatter disease", "Slipped capital femoral epiphysis (SCFE)", "Injection site reaction"],
        correct: 2,
        rationale: "GH therapy increases the risk of SCFE (slipped capital femoral epiphysis) due to rapid growth. Hip/knee pain with a limp requires urgent orthopedic evaluation."
      },
      {
        question: "Which screening test should be ordered for all short girls with unexplained growth failure?",
        options: ["Celiac panel", "Karyotype", "Cortisol level", "Echocardiogram"],
        correct: 1,
        rationale: "Turner syndrome (45,X) is a common cause of short stature in girls and may present without other obvious features. Karyotype should be obtained in all girls with unexplained short stature."
      }
    ]
  },
  "pediatric-obesity-management-np": {
    title: "Pediatric Obesity Management",
    cellular: { title: "Pediatric Obesity Pathophysiology", content: "Pediatric obesity results from chronic energy imbalance, but the pathophysiology extends beyond simple caloric excess. Adipocyte hypertrophy and hyperplasia create a pro-inflammatory state with elevated IL-6, TNF-alpha, and leptin resistance, driving insulin resistance even before frank type 2 diabetes develops. In children, obesity during critical periods of adipocyte development (ages 5-7 and adolescence) programs persistent adiposity through epigenetic mechanisms. Unlike adults, BMI is age- and sex-specific in children: overweight = BMI 85th-94th percentile, obesity = BMI ≥ 95th percentile, severe obesity = BMI ≥ 120% of 95th percentile. Pediatric obesity carries unique complications including slipped capital femoral epiphysis, Blount disease (tibia vara), pseudotumor cerebri, and earlier onset of type 2 diabetes with more aggressive beta-cell decline than adult-onset T2DM." },
    riskFactors: ["Parental obesity (strongest predictor)", "Sedentary behavior (> 2 hours screen time/day)", "Sugar-sweetened beverage consumption", "Food insecurity (paradoxical — energy-dense/nutrient-poor food choices)", "Sleep deprivation (< 8-10 hours — disrupts ghrelin/leptin regulation)", "Psychosocial stressors and adverse childhood experiences", "Endocrine disorders (hypothyroidism, Cushing syndrome — uncommon)", "Medications (corticosteroids, atypical antipsychotics)"],
    diagnostics: ["BMI calculation and percentile plotting on CDC growth chart (age 2-20)", "Fasting lipid panel (dyslipidemia screening)", "Fasting glucose and HbA1c (or OGTT if high risk for T2DM)", "ALT (NAFLD screening — elevated in up to 40% of obese children)", "TSH (thyroid screening to exclude endocrine cause)", "Blood pressure with age/sex/height-appropriate percentile interpretation", "Assess for comorbidities: sleep apnea symptoms, orthopedic symptoms, depression screening"],
    management: ["Stage 1 (Prevention Plus): Structured family lifestyle modification for 3-6 months", "Stage 2 (Structured Weight Management): Planned diet, exercise prescription, monthly monitoring", "Stage 3 (Comprehensive Multidisciplinary): Behavioral therapy, dietitian, exercise specialist", "Stage 4 (Tertiary): Consider pharmacotherapy (ages ≥ 12) or bariatric surgery (ages ≥ 13 with severe obesity)", "5-2-1-0 recommendations: ≥ 5 fruits/vegetables, ≤ 2 hours screen time, ≥ 1 hour physical activity, 0 sugar-sweetened beverages", "Pharmacotherapy options: GLP-1 agonists (semaglutide, liraglutide) FDA-approved for ages ≥ 12"],
    nursingActions: ["Calculate BMI and plot on CDC growth chart at every visit", "Use motivational interviewing techniques — avoid blame and stigma", "Assess family readiness for change and identify barriers", "Screen for depression, bullying, and disordered eating", "Coordinate multidisciplinary referrals (dietitian, psychology, exercise physiologist)", "Provide culturally appropriate dietary guidance"],
    assessmentFindings: ["BMI ≥ 95th percentile for age and sex (obesity)", "Acanthosis nigricans (insulin resistance marker)", "Elevated blood pressure for age/sex/height percentile", "Hip or knee pain (SCFE screening)", "Striae, headache, visual changes (pseudotumor cerebri screening)", "Snoring, daytime somnolence (OSA screening)"],
    signs: {
      left: ["BMI 85th-94th percentile (overweight)", "Normal blood pressure for age", "No acanthosis nigricans", "Active, no orthopedic complaints"],
      right: ["BMI ≥ 120% of 95th percentile (severe obesity)", "Acanthosis nigricans (insulin resistance)", "Elevated ALT (NAFLD)", "Hip/knee pain with limp (SCFE), or headaches with visual changes (pseudotumor cerebri)"]
    },
    medications: [
      { name: "Semaglutide", type: "GLP-1 receptor agonist", action: "Mimics incretin hormone GLP-1, enhancing satiety signaling in hypothalamus, slowing gastric emptying, and improving insulin sensitivity", sideEffects: "Nausea, vomiting, diarrhea, constipation, injection site reactions; rare: pancreatitis, gallbladder disease", contra: "Personal or family history of medullary thyroid carcinoma (MTC) or MEN2, pregnancy", pearl: "FDA-approved for ages ≥ 12 with BMI ≥ 95th percentile; start at lowest dose and titrate slowly to minimize GI side effects; effective weight reduction of 15-17% in adolescent trials" }
    ],
    pearls: ["In children, BMI must be interpreted using age- and sex-specific percentiles, NOT adult BMI cutoffs", "Acanthosis nigricans = insulin resistance until proven otherwise — screen for T2DM", "Always screen for depression and bullying in obese children before and during treatment", "5-2-1-0 is an easy family counseling tool: 5 fruits/veggies, ≤2 hours screen, 1 hour activity, 0 sugary drinks", "Pediatric T2DM from obesity is more aggressive than adult-onset with faster beta-cell decline", "Motivational interviewing is more effective than directive counseling — meet families where they are"],
    quiz: [
      {
        question: "A 14-year-old with BMI at the 97th percentile has dark, velvety skin at the neck. What does this finding indicate?",
        options: ["Poor hygiene", "Fungal infection", "Insulin resistance (acanthosis nigricans) — screen for type 2 diabetes", "Normal skin variation during puberty"],
        correct: 2,
        rationale: "Acanthosis nigricans is a clinical marker of insulin resistance commonly seen in obese children. It warrants screening for type 2 diabetes with fasting glucose, HbA1c, or OGTT."
      },
      {
        question: "Which screening test should be performed for all obese children to evaluate for non-alcoholic fatty liver disease?",
        options: ["Abdominal ultrasound", "ALT (alanine aminotransferase)", "GGT (gamma-glutamyl transferase)", "Liver biopsy"],
        correct: 1,
        rationale: "ALT is the recommended screening test for NAFLD in obese children. It is elevated in up to 40% of obese pediatric patients. Ultrasound is used for further evaluation if ALT is elevated."
      },
      {
        question: "At what age can GLP-1 receptor agonists (semaglutide) be prescribed for pediatric obesity?",
        options: ["Any age", "Age ≥ 6 years", "Age ≥ 12 years", "Age ≥ 18 years (adults only)"],
        correct: 2,
        rationale: "Semaglutide is FDA-approved for chronic weight management in adolescents aged 12 and older with BMI ≥ 95th percentile who have not responded to lifestyle modification alone."
      }
    ]
  },
  "pediatric-pain-rpn": {
    title: "Pediatric Pain Assessment",
    cellular: { title: "Pediatric Pain Processing", content: "Children experience and express pain differently based on developmental stage. Neonates and infants have fully functional pain pathways but limited ability to communicate — they express pain through crying, facial grimacing, body rigidity, and changes in vital signs. Descending inhibitory pain pathways are immature in neonates, meaning they may experience pain more intensely than older children and adults. Age-appropriate pain assessment tools are essential: FLACC scale (Face, Legs, Activity, Cry, Consolability) for ages 0-7 or nonverbal patients, Wong-Baker FACES scale for ages 3-7 (self-report using facial expressions), and numeric rating scale (NRS 0-10) for children ≥ 8 years who understand number concepts." },
    riskFactors: ["Infants and neonates (immature pain inhibitory pathways)", "Nonverbal patients (cognitive impairment, intubated)", "Children with chronic pain conditions", "Post-operative patients", "Children undergoing repeated painful procedures", "Cultural factors affecting pain expression", "History of inadequate pain management"],
    diagnostics: ["Select age-appropriate pain assessment tool", "FLACC scale: 0-10 score for ages 0-7 or nonverbal (Face, Legs, Activity, Cry, Consolability)", "Wong-Baker FACES: self-report for ages 3-7 using 6 faces from no hurt to worst hurt", "Numeric Rating Scale (NRS 0-10): self-report for ages ≥ 8", "NIPS (Neonatal Infant Pain Scale) for premature and full-term neonates", "Assess pain before, during, and after interventions", "Observe behavioral cues: facial grimacing, guarding, decreased activity"],
    management: ["Administer ordered pain medications on time, not just PRN", "Use non-pharmacological methods: distraction, positioning, swaddling, sucrose for neonates", "Apply topical anesthetic (EMLA cream) before painful procedures (apply 60 min before)", "Position for comfort (knee-to-chest for abdominal pain, elevation for extremity injury)", "Involve parents/caregivers in comfort measures", "Report uncontrolled pain (score ≥ 4) to the nurse"],
    nursingActions: ["Assess pain using age-appropriate tool at regular intervals and after interventions", "Document pain scores with location, quality, and interventions used", "Administer prescribed medications and reassess within 30-60 minutes", "Use FLACC for nonverbal children, FACES for young children, NRS for older children", "Apply non-pharmacological comfort measures before and during procedures", "Teach parents to recognize pain cues in their child"],
    assessmentFindings: ["Pain score using age-appropriate tool", "Behavioral indicators: crying, facial grimacing, body guarding, decreased mobility", "Physiological indicators: tachycardia, tachypnea, elevated blood pressure, diaphoresis", "Location, onset, and quality of pain (if child can verbalize)", "Effect of pain on function (eating, sleeping, playing, interacting)"],
    signs: {
      left: ["Pain score 0-3 (mild, managed)", "Child playing and interacting normally", "Eating and sleeping without difficulty", "Relaxed body posture and facial expression"],
      right: ["Pain score ≥ 7 (severe)", "Inconsolable crying or withdrawal", "Refusing to eat, drink, or move", "Tachycardia and diaphoresis with pain"]
    },
    medications: [{
      name: "Acetaminophen",
      type: "Non-opioid analgesic/antipyretic",
      action: "Inhibits central COX enzymes reducing prostaglandin synthesis for pain relief and fever reduction",
      sideEffects: "Hepatotoxicity at supratherapeutic doses, rare allergic reactions",
      contra: "Severe liver disease, concurrent acetaminophen-containing products",
      pearl: "Dose 10-15 mg/kg every 4-6 hours (max 75 mg/kg/day); infant drops and children's liquid are DIFFERENT concentrations — always verify"
    }],
    pearls: ["Use the RIGHT tool for the RIGHT age: FLACC for nonverbal/infants, FACES for 3-7, NRS for ≥ 8", "Neonates feel pain — they have fully functional pain pathways and deserve pain management", "A child who is quiet and withdrawn may be in severe pain — silence does NOT mean comfort", "Non-pharmacological methods (distraction, swaddling, sucrose) are essential adjuncts to medications", "Always reassess pain after intervention to evaluate effectiveness", "Sucrose on a pacifier is an evidence-based pain reliever for neonatal procedures"],
    quiz: [
      {
        question: "Which pain assessment tool is most appropriate for a 2-year-old child?",
        options: ["Numeric Rating Scale (0-10)", "Wong-Baker FACES scale", "FLACC scale", "Visual Analog Scale"],
        correct: 2,
        rationale: "The FLACC scale (Face, Legs, Activity, Cry, Consolability) is designed for children ages 0-7 and nonverbal patients. A 2-year-old cannot reliably self-report pain using FACES or numeric scales."
      },
      {
        question: "A 4-year-old is lying still in bed, not crying, but refuses to eat or play. What should the RPN consider?",
        options: ["The child is not in pain because they are not crying", "The child may be in significant pain — silence and withdrawal can indicate severe pain in children", "The child is just tired and should be left alone", "Pain assessment is not needed since the child is quiet"],
        correct: 1,
        rationale: "Children in severe pain may become quiet and withdrawn rather than crying. A child who refuses to eat, play, or interact needs a formal pain assessment using an age-appropriate tool."
      },
      {
        question: "What non-pharmacological intervention is evidence-based for reducing procedural pain in neonates?",
        options: ["Asking the infant to take deep breaths", "Oral sucrose solution on a pacifier", "Applying ice to the injection site", "Playing loud music for distraction"],
        correct: 1,
        rationale: "Oral sucrose on a pacifier activates endogenous opioid pathways in neonates and is an evidence-based intervention for reducing pain during minor procedures like heel sticks and immunizations."
      }
    ]
  }
};
