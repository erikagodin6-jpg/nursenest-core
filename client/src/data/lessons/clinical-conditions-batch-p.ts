import type { LessonContent } from "./types";

export const clinicalConditionsBatchPLessons: Record<string, LessonContent> = {
  "hpa-axis-stress-rpn": {
    title: "HPA Axis & Cortisol Stress Response",
    cellular: {
      title: "Stress System Physiology",
      content: "Stress is a biological state in which homeostasis is threatened, triggering coordinated activation of the hypothalamic-pituitary-adrenal (HPA) axis and the sympathetic-adrenomedullary (SAM) system. The hypothalamus releases corticotropin-releasing hormone (CRH), which stimulates pituitary secretion of adrenocorticotropic hormone (ACTH). ACTH acts on the adrenal cortex zona fasciculata to produce cortisol. Cortisol is a steroid hormone that crosses cell membranes, binds intracellular glucocorticoid receptors, and alters gene transcription to regulate metabolism, immune function, and cardiovascular tone. Negative feedback from cortisol normally limits HPA activation, but chronic or excessive stress can dysregulate this loop. The nurse monitors vital signs, reports signs of stress-related complications such as hyperglycemia or hypertension, and supports patient comfort and stress-reduction strategies as directed."
    },
    riskFactors: [
      "Chronic psychological stress or trauma history",
      "Adverse childhood experiences (ACEs)",
      "Chronic illness or pain syndromes",
      "Sleep deprivation or shift work",
      "Obesity and metabolic syndrome",
      "Substance use disorders",
      "Social isolation or caregiver burden",
      "Long-term corticosteroid therapy"
    ],
    diagnostics: [
      "Monitor vital signs and report sustained hypertension or tachycardia",
      "Monitor blood glucose levels as ordered and report hyperglycemia",
      "Report signs of Cushing-like features: weight gain, moon face, striae",
      "Document sleep patterns and report persistent insomnia",
      "Report mood changes, anxiety, or agitation to the RN",
      "Monitor intake and output as directed"
    ],
    management: [
      "Administer medications as ordered including corticosteroids per tapering schedule",
      "Maintain a calm, low-stimulus environment as directed",
      "Assist with relaxation techniques such as guided breathing",
      "Encourage regular sleep-wake schedules as part of care plan",
      "Administer antihypertensives or glucose-lowering agents as ordered",
      "Follow activity and dietary restrictions as directed"
    ],
    nursingActions: [
      "Assess and document vital signs with attention to blood pressure and heart rate trends",
      "Report signs of adrenal insufficiency: hypotension, weakness, nausea, confusion",
      "Monitor for signs of cortisol excess: hyperglycemia, fluid retention, weight gain",
      "Educate patient on importance of medication adherence, especially steroid tapering",
      "Report mood disturbances, sleep disruption, or anxiety to the RN",
      "Provide emotional support and a therapeutic environment"
    ],
    signs: {
      left: [
        "Elevated blood pressure",
        "Tachycardia",
        "Hyperglycemia",
        "Insomnia and restlessness",
        "Anxiety and irritability",
        "Weight gain (central distribution)"
      ],
      right: [
        "Hypotension (adrenal insufficiency)",
        "Fatigue and weakness",
        "Hypoglycemia",
        "Nausea and vomiting",
        "Confusion or altered LOC",
        "Electrolyte imbalance (hyponatremia, hyperkalemia)"
      ]
    },
    medications: [
      { name: "Hydrocortisone", type: "Glucocorticoid replacement", action: "Replaces physiologic cortisol in adrenal insufficiency; mimics endogenous cortisol actions on metabolism and immune function", sideEffects: "Hyperglycemia, fluid retention, immunosuppression, osteoporosis with chronic use", contra: "Systemic fungal infections, live vaccines during high-dose therapy", pearl: "Stress dosing (doubling or tripling the dose) may be required during illness, surgery, or physiologic stress. Never stop abruptly after chronic use." },
      { name: "Prednisone", type: "Synthetic glucocorticoid", action: "Suppresses inflammation and immune responses by inhibiting NF-kB and pro-inflammatory cytokine production", sideEffects: "Cushing features, hyperglycemia, osteoporosis, adrenal suppression, GI irritation", contra: "Active untreated infections, live vaccines", pearl: "Must be tapered gradually after prolonged use to prevent adrenal crisis. Administer with food to reduce GI effects." },
      { name: "Fludrocortisone", type: "Mineralocorticoid", action: "Replaces aldosterone function, promoting sodium retention and potassium excretion in the distal tubule", sideEffects: "Hypertension, edema, hypokalemia, headache", contra: "Severe hypertension, heart failure", pearl: "Used in primary adrenal insufficiency (Addison disease) alongside hydrocortisone. Monitor blood pressure and potassium closely." },
      { name: "Metyrapone", type: "Cortisol synthesis inhibitor", action: "Inhibits 11-beta-hydroxylase enzyme, blocking the final step of cortisol synthesis in the adrenal cortex", sideEffects: "Adrenal insufficiency, dizziness, nausea, hirsutism", contra: "Primary adrenal insufficiency", pearl: "Used diagnostically to test ACTH reserve and therapeutically in Cushing syndrome to reduce cortisol levels." }
    ],
    pearls: [
      "Cortisol follows a circadian rhythm: highest in early morning, lowest at midnight; disruption suggests HPA axis pathology",
      "Abrupt discontinuation of chronic corticosteroid therapy can precipitate adrenal crisis, a life-threatening emergency",
      "Signs of adrenal crisis include severe hypotension, hypoglycemia, and altered consciousness requiring IV hydrocortisone",
      "Chronic stress increases allostatic load, contributing to cardiovascular disease, metabolic syndrome, and immune dysfunction",
      "Stress hyperglycemia in hospitalized patients must be distinguished from new-onset diabetes"
    ],
    quiz: [
      { question: "Which assessment finding should the nurse report immediately in a patient abruptly taken off long-term prednisone?", options: ["Blood pressure of 142/88 mmHg", "Severe hypotension with confusion and weakness", "Mild ankle edema", "Fasting glucose of 110 mg/dL"], correct: 1, rationale: "Abrupt withdrawal of chronic corticosteroids can cause adrenal crisis due to suppressed HPA axis. Severe hypotension with confusion indicates adrenal crisis requiring emergent treatment." },
      { question: "The nurse notes a patient on chronic prednisone has developed a round face, central weight gain, and elevated blood glucose. What does this suggest?", options: ["Addison disease", "Cushing syndrome features from exogenous steroids", "Hypothyroidism", "Metabolic alkalosis"], correct: 1, rationale: "Moon face, central obesity, and hyperglycemia are classic features of Cushing syndrome caused by chronic exogenous glucocorticoid use." },
      { question: "What is the priority nursing action when a patient on hydrocortisone replacement develops a fever of 39°C?", options: ["Hold the hydrocortisone to prevent immunosuppression", "Report to the nurse for possible stress dose adjustment", "Administer acetaminophen only", "Decrease the hydrocortisone dose"], correct: 1, rationale: "During physiologic stress such as fever or illness, patients on cortisol replacement require stress dosing (increased dose). The nurse should report to the nurse for adjustment." }
    ]
  },

  "hpa-axis-stress-np": {
    title: "HPA Axis & Cortisol Stress Response",
    cellular: {
      title: "Advanced HPA Axis Pathophysiology",
      content: "The HPA axis operates through a neuroendocrine cascade: hypothalamic paraventricular nucleus (PVN) neurons secrete CRH and AVP into the hypophyseal portal circulation, stimulating anterior pituitary corticotrophs via CRH-R1 and V1b receptors respectively. ACTH, cleaved from pro-opiomelanocortin (POMC), drives adrenocortical steroidogenesis through the cholesterol side-chain cleavage enzyme and subsequent zona fasciculata enzymes (17-alpha-hydroxylase, 11-beta-hydroxylase) to produce cortisol. Cortisol acts through genomic mechanisms (glucocorticoid receptor-mediated transcription) and non-genomic pathways (rapid membrane effects). Negative feedback occurs at both hypothalamic (suppressing CRH/AVP) and pituitary (suppressing POMC/ACTH) levels. The SAM axis provides rapid catecholaminergic responses through preganglionic sympathetic fibers activating adrenal medullary chromaffin cells. Chronic HPA dysregulation manifests as either hypercortisolism (Cushing syndrome) or hypocortisolism (adrenal insufficiency), each with distinct diagnostic algorithms and management strategies. Modern stress science recognizes allostatic load as the cumulative physiologic toll of chronic stress, contributing to cardiometabolic disease, immune dysfunction, neurodegeneration, and accelerated cellular aging. The clinician must order and interpret dynamic endocrine testing, prescribe replacement or suppressive therapy, manage complications, and integrate stress reduction into comprehensive treatment plans."
    },
    riskFactors: [
      "Exogenous glucocorticoid use (most common cause of Cushing syndrome)",
      "Pituitary adenoma (Cushing disease)",
      "Ectopic ACTH production (small cell lung cancer, carcinoid)",
      "Autoimmune adrenalitis (most common cause of primary adrenal insufficiency)",
      "Pituitary surgery or radiation causing secondary adrenal insufficiency",
      "Chronic opioid use (suppresses HPA axis)",
      "Critical illness with HPA axis suppression",
      "PTSD and chronic trauma exposure"
    ],
    diagnostics: [
      "Order morning serum cortisol and ACTH to screen for adrenal dysfunction",
      "Order 24-hour urinary free cortisol (UFC >3x upper limit suggests Cushing)",
      "Order overnight 1mg dexamethasone suppression test (cortisol >1.8 mcg/dL at 8AM is abnormal)",
      "Order late-night salivary cortisol (elevated in Cushing syndrome)",
      "Order ACTH stimulation test (cosyntropin test): cortisol <18 mcg/dL at 60 min confirms adrenal insufficiency",
      "Order high-dose dexamethasone suppression test to differentiate pituitary from ectopic ACTH",
      "Order pituitary MRI for suspected Cushing disease or secondary adrenal insufficiency",
      "Interpret CMP for electrolyte patterns: hyponatremia/hyperkalemia (Addison) vs hypokalemia (Cushing)"
    ],
    management: [
      "Prescribe physiologic hydrocortisone replacement (15-25 mg/day divided: 10-15mg AM, 5-10mg PM) for adrenal insufficiency",
      "Prescribe fludrocortisone 0.05-0.2 mg/day for primary adrenal insufficiency with mineralocorticoid deficiency",
      "Develop individualized stress-dosing protocols: double dose for minor illness, triple for major stress, IV 100mg hydrocortisone for crisis",
      "Order cortisol synthesis inhibitors (ketoconazole, metyrapone) as bridge therapy for Cushing syndrome",
      "Refer for transsphenoidal surgery for pituitary Cushing disease",
      "Manage complications: osteoporosis screening with DEXA, glucose monitoring, cardiovascular risk assessment",
      "Prescribe bone-protective therapy (calcium, vitamin D, bisphosphonates) for chronic steroid use",
      "Integrate evidence-based stress reduction: CBT referral, exercise prescription, sleep hygiene counseling"
    ],
    nursingActions: [
      "Order and interpret dynamic endocrine tests including cosyntropin stimulation and dexamethasone suppression",
      "Classify adrenal insufficiency as primary, secondary, or tertiary based on ACTH and cortisol patterns",
      "Assess for iatrogenic Cushing syndrome in patients on chronic glucocorticoids",
      "Develop steroid tapering protocols accounting for duration of use and HPA axis recovery time",
      "Screen for PTSD using validated tools (PCL-5) and assess for paradoxical HPA patterns",
      "Evaluate metabolic consequences: glucose tolerance, lipid panel, bone density",
      "Coordinate multidisciplinary care: endocrinology, psychiatry, nutrition, physical therapy",
      "Prescribe and manage stress-dose steroid protocols for surgical and medical emergencies"
    ],
    signs: {
      left: [
        "Cushing syndrome: truncal obesity, moon face, buffalo hump, purple striae >1cm",
        "Hypertension resistant to standard therapy",
        "Steroid-induced diabetes (fasting hyperglycemia, insulin resistance)",
        "Proximal myopathy (difficulty rising from chair)",
        "Osteoporosis with vertebral compression fractures",
        "Immunosuppression with opportunistic infections",
        "Psychiatric manifestations: depression, psychosis, cognitive impairment"
      ],
      right: [
        "Adrenal insufficiency: orthostatic hypotension, postural tachycardia",
        "Hyperpigmentation of creases, buccal mucosa, scars (primary only)",
        "Hyponatremia with hyperkalemia and metabolic acidosis",
        "Hypoglycemia especially during fasting or illness",
        "Adrenal crisis: refractory hypotension, cardiovascular collapse",
        "Fatigue, anorexia, weight loss, salt craving",
        "Eosinophilia and lymphocytosis on CBC"
      ]
    },
    medications: [
      { name: "Hydrocortisone", type: "Physiologic glucocorticoid", action: "Binds intracellular glucocorticoid receptors, modulating transcription of genes involved in gluconeogenesis, anti-inflammatory pathways, and immune regulation", sideEffects: "Hyperglycemia, weight gain, osteoporosis, adrenal suppression, immunosuppression, mood changes", contra: "Systemic fungal infections, concurrent live vaccines at immunosuppressive doses", pearl: "Physiologic replacement mimics circadian rhythm. Crisis protocol: 100mg IV bolus, then 50mg IV q8h, tapering over days. HPA axis recovery after chronic steroids may take 6-12 months." },
      { name: "Dexamethasone", type: "Synthetic long-acting glucocorticoid", action: "30x potency of cortisol with minimal mineralocorticoid effect; potent anti-inflammatory and immunosuppressive via NF-kB inhibition", sideEffects: "Severe HPA suppression, psychosis, hyperglycemia, avascular necrosis of femoral head, peptic ulcer", contra: "Systemic fungal infections, active GI bleeding", pearl: "Overnight 1mg DST: cortisol >1.8 mcg/dL at 8AM suggests Cushing. High-dose 8mg DST: >50% suppression suggests pituitary source; no suppression suggests ectopic ACTH or adrenal tumor." },
      { name: "Ketoconazole", type: "Steroidogenesis inhibitor", action: "Inhibits CYP11A1, CYP17A1, and CYP11B1 enzymes blocking cortisol synthesis at multiple steps", sideEffects: "Hepatotoxicity (monitor LFTs), nausea, adrenal insufficiency, gynecomastia (anti-androgen effect)", contra: "Hepatic impairment, concurrent QT-prolonging drugs", pearl: "First-line medical therapy for Cushing syndrome when surgery is delayed or contraindicated. Start 200mg BID, titrate to normalize UFC. Monitor LFTs every 2 weeks initially." },
      { name: "Pasireotide", type: "Somatostatin receptor ligand", action: "Binds somatostatin receptor subtype 5 on pituitary corticotroph adenoma cells, suppressing ACTH secretion", sideEffects: "Hyperglycemia (up to 73% of patients), GI upset, cholelithiasis, QT prolongation", contra: "Uncontrolled diabetes, severe hepatic impairment", pearl: "FDA-approved for Cushing disease when surgery fails. Significant hyperglycemia risk requires proactive glucose monitoring. May normalize UFC in 25-30% of patients." }
    ],
    pearls: [
      "The cosyntropin (ACTH stimulation) test is the gold standard for diagnosing adrenal insufficiency: cortisol <18 mcg/dL at 30 or 60 minutes is diagnostic",
      "HPA axis recovery after chronic steroid use follows a predictable sequence: CRH recovers first, then ACTH, then cortisol production (may take 6-12 months)",
      "In PTSD, the HPA axis paradoxically shows low basal cortisol with enhanced negative feedback sensitivity (upregulated glucocorticoid receptors)",
      "Stress hyperglycemia of critical illness differs from diabetes: cortisol drives hepatic gluconeogenesis and peripheral insulin resistance acutely",
      "Allostatic load scoring (using biomarkers like cortisol, catecholamines, inflammatory markers, metabolic parameters) quantifies cumulative stress burden"
    ],
    quiz: [
      { question: "A cosyntropin stimulation test shows a baseline cortisol of 3 mcg/dL and a 60-minute cortisol of 12 mcg/dL. How should the clinician interpret this?", options: ["Normal adrenal function", "Adrenal insufficiency confirmed (cortisol <18 mcg/dL at 60 min)", "Cushing syndrome", "Pheochromocytoma"], correct: 1, rationale: "A stimulated cortisol <18 mcg/dL at 60 minutes on cosyntropin test confirms adrenal insufficiency. The next step is measuring ACTH to differentiate primary from secondary causes." },
      { question: "Which finding on overnight dexamethasone suppression test suggests Cushing syndrome?", options: ["8AM cortisol of 1.2 mcg/dL", "8AM cortisol of 5.4 mcg/dL", "ACTH of 5 pg/mL", "24-hour UFC within normal limits"], correct: 1, rationale: "After 1mg dexamethasone at 11PM, an 8AM cortisol >1.8 mcg/dL indicates failure to suppress, suggesting autonomous cortisol production (Cushing syndrome). A cortisol of 5.4 mcg/dL is clearly abnormal." },
      { question: "An NP is managing a patient who has been on prednisone 40mg daily for 3 months. What is the most important consideration when discontinuing?", options: ["Stop immediately and switch to hydrocortisone", "Gradual taper over weeks to months allowing HPA axis recovery", "Switch to dexamethasone for faster discontinuation", "No taper needed if the patient feels well"], correct: 1, rationale: "Chronic glucocorticoid use suppresses the HPA axis. Abrupt discontinuation can cause adrenal crisis. A gradual taper is essential, reducing by 5-10mg every 1-2 weeks, with possible transition to physiologic hydrocortisone doses during recovery." }
    ]
  },

  "male-infertility-rpn": {
    title: "Male Infertility",
    cellular: {
      title: "Spermatogenesis and Reproductive Physiology",
      content: "Male fertility depends on intact spermatogenesis regulated by the hypothalamic-pituitary-gonadal (HPG) axis. Gonadotropin-releasing hormone (GnRH) from the hypothalamus stimulates pituitary release of luteinizing hormone (LH) and follicle-stimulating hormone (FSH). LH acts on Leydig cells to produce testosterone, while FSH acts on Sertoli cells to support sperm maturation within seminiferous tubules. Male infertility results from abnormalities in sperm production (testicular failure, hormonal dysregulation), sperm function (motility or morphology defects), or sperm delivery (obstructive causes, ejaculatory disorders). Varicocele is the most common correctable cause, impairing spermatogenesis through elevated testicular temperature and oxidative stress. The nurse assists with specimen collection instructions, monitors for medication side effects, provides emotional support, and reports relevant findings to the nursing team."
    },
    riskFactors: [
      "Varicocele (present in 35-40% of infertile males)",
      "History of cryptorchidism (undescended testes)",
      "Hormonal imbalances (hypogonadism, hyperprolactinemia)",
      "Prior chemotherapy or radiation therapy",
      "Chronic illness (diabetes, renal failure, liver disease)",
      "Medications (testosterone, anabolic steroids, opioids)",
      "Environmental exposures (heat, toxins, pesticides)",
      "Genetic factors (Klinefelter syndrome, Y-chromosome microdeletions)"
    ],
    diagnostics: [
      "Assist with specimen collection instructions for semen analysis as directed",
      "Document abstinence period (2-5 days recommended before collection)",
      "Report patient concerns about medication effects on fertility",
      "Monitor vital signs and testicular exam findings as directed",
      "Report signs of hormonal imbalance: gynecomastia, decreased body hair, fatigue"
    ],
    management: [
      "Administer medications as ordered (clomiphene, gonadotropins)",
      "Educate on lifestyle modifications: avoid heat exposure, limit alcohol, stop smoking",
      "Provide emotional support acknowledging the psychological impact of infertility",
      "Assist with referral coordination to urology or reproductive medicine",
      "Reinforce medication instructions and timing as directed",
      "Report side effects of fertility medications to the RN"
    ],
    nursingActions: [
      "Educate patient on proper semen specimen collection technique and timing",
      "Assess and document testicular size and consistency as directed",
      "Report signs of hypogonadism: decreased libido, fatigue, mood changes",
      "Monitor for medication side effects: hot flashes, visual changes (clomiphene), injection site reactions",
      "Provide culturally sensitive education about infertility evaluation",
      "Document sexual and reproductive history as directed"
    ],
    signs: {
      left: [
        "Decreased libido and sexual dysfunction",
        "Small, soft testes (testicular atrophy)",
        "Gynecomastia",
        "Decreased body and facial hair",
        "Fatigue and mood changes",
        "Varicocele (bag of worms sensation on palpation)"
      ],
      right: [
        "Abnormal semen analysis findings",
        "Absent or reduced ejaculate volume",
        "Pain or swelling in testicular area",
        "History of recurrent infections",
        "Galactorrhea (with hyperprolactinemia)",
        "Anosmia (Kallmann syndrome association)"
      ]
    },
    medications: [
      { name: "Clomiphene Citrate", type: "Selective estrogen receptor modulator (SERM)", action: "Blocks estrogen receptors at hypothalamus and pituitary, reducing negative feedback and increasing GnRH, LH, and FSH secretion to stimulate testosterone and spermatogenesis", sideEffects: "Hot flashes, visual disturbances, mood swings, headache", contra: "Liver disease, undiagnosed abnormal uterine bleeding (in female use), pituitary tumor", pearl: "Off-label use in males. Takes 3-6 months to see improvement in semen parameters due to the 72-day spermatogenesis cycle. Administer as ordered." },
      { name: "Human Chorionic Gonadotropin (hCG)", type: "LH analog", action: "Mimics LH action on Leydig cells, stimulating intratesticular testosterone production to support spermatogenesis", sideEffects: "Injection site reactions, gynecomastia, headache, mood changes", contra: "Prostate cancer, precocious puberty", pearl: "Used in hypogonadotropic hypogonadism to restore fertility. Unlike exogenous testosterone, hCG maintains intratesticular testosterone needed for sperm production." }
    ],
    pearls: [
      "Exogenous testosterone suppresses the HPG axis and impairs spermatogenesis; it is contraindicated in men seeking fertility",
      "Spermatogenesis takes approximately 72 days; treatment effects require 3-6 months to assess",
      "Varicocele repair can improve semen parameters in 60-70% of men",
      "Report any visual changes in patients on clomiphene, as this may indicate retinal toxicity"
    ],
    quiz: [
      { question: "A male patient asks the nurse if taking testosterone supplements will help him conceive. What is the best response?", options: ["Yes, higher testosterone improves sperm production", "No, exogenous testosterone actually suppresses sperm production", "It depends on the dose being used", "Testosterone supplements have no effect on fertility"], correct: 1, rationale: "Exogenous testosterone suppresses the HPG axis, reducing GnRH, LH, and FSH, which decreases intratesticular testosterone and impairs spermatogenesis. It is contraindicated in men trying to conceive." },
      { question: "How long should a patient wait before expecting improvement in semen analysis after starting fertility treatment?", options: ["1-2 weeks", "1 month", "3-6 months", "1 year minimum"], correct: 2, rationale: "Spermatogenesis takes approximately 72 days from stem cell to mature sperm. A full treatment cycle requires at least 3-6 months before semen analysis improvement can be assessed." }
    ]
  },

  "male-infertility-rn": {
    title: "Male Infertility",
    cellular: {
      title: "Pathophysiology of Male Infertility",
      content: "Male infertility involves disruption of spermatogenesis, sperm transport, or sperm function. The HPG axis governs reproductive function: GnRH stimulates LH and FSH release; LH drives Leydig cell testosterone synthesis; FSH activates Sertoli cells to support spermatogenesis within the seminiferous tubules. Sertoli cells form the blood-testis barrier and secrete androgen-binding protein and inhibin (which provides negative feedback on FSH). Testosterone is converted to dihydrotestosterone (DHT) by 5-alpha reductase in target tissues, and to estradiol by aromatase. Pre-testicular causes include hypothalamic-pituitary dysfunction (hypogonadotropic hypogonadism, hyperprolactinemia). Testicular causes include Klinefelter syndrome, cryptorchidism, varicocele, chemotherapy-induced gonadotoxicity, and infection (orchitis). Post-testicular causes include obstructive azoospermia (vasectomy, congenital bilateral absence of vas deferens), ejaculatory dysfunction, and immunologic factors. The nurse performs comprehensive reproductive health assessment, coordinates diagnostic workup, manages medication protocols, and provides education and psychosocial support throughout the evaluation process."
    },
    riskFactors: [
      "Varicocele (most common correctable cause)",
      "Cryptorchidism (even after correction, increased risk persists)",
      "Klinefelter syndrome (47,XXY) and Y-chromosome microdeletions",
      "Prior gonadotoxic therapy (alkylating agents, radiation)",
      "Infections: mumps orchitis, STIs causing obstruction",
      "Exogenous androgens or anabolic steroid use",
      "Chronic medical conditions: diabetes, CKD, cirrhosis",
      "Medications: SSRIs, alpha-blockers, 5-alpha reductase inhibitors, opioids"
    ],
    diagnostics: [
      "Coordinate two semen analyses at least 4 weeks apart per WHO criteria",
      "Evaluate semen parameters: volume (>1.5 mL), concentration (>15 million/mL), motility (>40%), morphology (>4% normal forms)",
      "Assess hormonal panel: total testosterone, FSH, LH, prolactin, estradiol",
      "Differentiate obstructive vs non-obstructive azoospermia: FSH elevated in non-obstructive, normal in obstructive",
      "Coordinate scrotal ultrasound for varicocele assessment and testicular measurement",
      "Assess for retrograde ejaculation with post-ejaculation urinalysis",
      "Coordinate genetic testing: karyotype and Y-chromosome microdeletion analysis when indicated"
    ],
    management: [
      "Discontinue offending medications (testosterone, anabolic steroids) and document timeline for recovery",
      "Administer gonadotropin therapy (hCG ± FSH) for hypogonadotropic hypogonadism as prescribed",
      "Coordinate referral for varicocelectomy when clinically indicated",
      "Manage hyperprolactinemia treatment (cabergoline) and monitor prolactin levels",
      "Educate on lifestyle optimization: maintain testicular temperature, balanced nutrition, exercise, stress reduction",
      "Coordinate with reproductive endocrinology for assisted reproductive technologies (IUI, IVF/ICSI)",
      "Implement infection treatment protocols for reproductive tract infections",
      "Provide cryopreservation counseling before gonadotoxic therapy"
    ],
    nursingActions: [
      "Perform comprehensive reproductive health history including sexual function, prior surgeries, medications, and environmental exposures",
      "Assess testicular examination findings: size, consistency, presence of vas deferens, varicocele",
      "Monitor hormone levels and correlate with clinical findings",
      "Educate on semen analysis collection requirements: abstinence 2-5 days, specimen to lab within 60 minutes",
      "Assess psychosocial impact of infertility on patient and partner relationship",
      "Coordinate care between urology, endocrinology, and reproductive medicine",
      "Monitor for medication side effects and treatment response over 3-6 month cycles",
      "Provide evidence-based counseling on prognosis based on underlying etiology"
    ],
    signs: {
      left: [
        "Small testes (<15 mL by orchidometry suggests impaired spermatogenesis)",
        "Absent vas deferens on palpation (CFTR mutation association)",
        "Varicocele: dilated pampiniform plexus, increases with Valsalva",
        "Gynecomastia (suggests estrogen-testosterone imbalance)",
        "Eunuchoid body habitus (long limbs relative to trunk in hypogonadism)",
        "Decreased secondary sexual characteristics"
      ],
      right: [
        "Oligospermia (low count) or azoospermia (no sperm)",
        "Asthenospermia (poor motility) or teratospermia (abnormal morphology)",
        "Elevated FSH (indicates primary testicular failure)",
        "Low testosterone with low LH/FSH (secondary hypogonadism)",
        "Elevated prolactin (pituitary cause)",
        "Retrograde ejaculation (sperm in post-ejaculation urine)"
      ]
    },
    medications: [
      { name: "Clomiphene Citrate", type: "SERM", action: "Competitively blocks estrogen receptors at hypothalamus, disrupting negative feedback, increasing pulsatile GnRH and subsequent LH/FSH to stimulate endogenous testosterone and spermatogenesis", sideEffects: "Hot flashes, visual changes, mood alterations, gynecomastia", contra: "Hepatic dysfunction, pituitary tumor, primary testicular failure (elevated FSH)", pearl: "25-50mg daily or every other day off-label for male infertility. Monitor testosterone, FSH, and semen analysis at 3-6 month intervals. Visual changes require immediate discontinuation." },
      { name: "Human Chorionic Gonadotropin (hCG)", type: "LH analog", action: "Binds LH receptors on Leydig cells, stimulating intratesticular testosterone production to support spermatogenesis without suppressing the HPG axis", sideEffects: "Injection site pain, gynecomastia, headache, acne, polycythemia", contra: "Androgen-dependent tumors, precocious puberty", pearl: "1500-3000 IU SC 2-3 times weekly for hypogonadotropic hypogonadism. May take 6-12 months with FSH supplementation to achieve adequate spermatogenesis." },
      { name: "Recombinant FSH (Follitropin)", type: "Gonadotropin", action: "Directly stimulates Sertoli cells to support spermatogenesis, used when hCG alone fails to restore sperm production", sideEffects: "Injection site reactions, ovarian hyperstimulation (female), headache", contra: "FSH-secreting pituitary tumors, primary testicular failure", pearl: "Added to hCG when spermatogenesis fails to recover with hCG alone after 6 months. 75-150 IU SC 3 times weekly. Response monitored with serial semen analyses." },
      { name: "Cabergoline", type: "Dopamine agonist", action: "Inhibits prolactin secretion from pituitary lactotrophs, restoring GnRH pulsatility and HPG axis function", sideEffects: "Nausea, dizziness, orthostatic hypotension, headache, cardiac valve fibrosis (high doses)", contra: "Uncontrolled hypertension, hypersensitivity to ergot derivatives", pearl: "First-line for hyperprolactinemia-induced infertility. 0.25mg twice weekly, titrated based on prolactin levels. Can restore fertility in >80% of prolactinoma cases." }
    ],
    pearls: [
      "WHO 2021 semen analysis reference values: volume ≥1.5 mL, concentration ≥16 million/mL, total motility ≥42%, normal morphology ≥4%",
      "Elevated FSH with small testes and azoospermia indicates primary testicular failure with poor prognosis for natural conception",
      "Exogenous testosterone takes 3-6 months after discontinuation to allow HPG axis recovery and return of spermatogenesis",
      "Congenital bilateral absence of vas deferens is associated with CFTR gene mutations; partner should be screened for cystic fibrosis carrier status",
      "Varicocelectomy improves semen parameters in approximately 60-70% of men and results in pregnancy rates of 30-50%"
    ],
    quiz: [
      { question: "A patient's semen analysis shows azoospermia. FSH is 28 mIU/mL (elevated) and testes are 8 mL bilaterally. What does this indicate?", options: ["Obstructive azoospermia with good prognosis", "Non-obstructive azoospermia due to primary testicular failure", "Hypogonadotropic hypogonadism", "Normal variant requiring repeat analysis"], correct: 1, rationale: "Elevated FSH with small testes and azoospermia indicates primary testicular failure (non-obstructive azoospermia). The elevated FSH reflects loss of negative feedback from impaired spermatogenesis." },
      { question: "Which medication is appropriate for a patient with infertility due to hypogonadotropic hypogonadism?", options: ["Exogenous testosterone", "hCG with or without recombinant FSH", "5-alpha reductase inhibitor", "GnRH antagonist"], correct: 1, rationale: "hCG (mimicking LH) stimulates intratesticular testosterone to support spermatogenesis. Recombinant FSH may be added if hCG alone is insufficient. Exogenous testosterone would further suppress the HPG axis." },
      { question: "A patient on clomiphene for infertility reports visual disturbances. What is the priority action?", options: ["Continue medication and monitor", "Reduce the dose by half", "Discontinue immediately and notify the provider", "Switch to a different SERM"], correct: 2, rationale: "Visual disturbances on clomiphene may indicate retinal toxicity and require immediate discontinuation. The nurse should stop the medication and notify the prescriber for ophthalmologic evaluation." }
    ]
  },

  "male-infertility-np": {
    title: "Male Infertility",
    cellular: {
      title: "Advanced Reproductive Endocrinology",
      content: "Male infertility evaluation requires systematic assessment of the hypothalamic-pituitary-gonadal axis, testicular function, and reproductive tract integrity. Spermatogenesis occurs within seminiferous tubules over a 72-day cycle, orchestrated by Sertoli cells (FSH-dependent) and supported by intratesticular testosterone produced by Leydig cells (LH-dependent). The blood-testis barrier formed by Sertoli cell tight junctions creates an immunologically privileged environment essential for meiotic progression. Testosterone undergoes conversion to DHT (by 5-alpha reductase) and estradiol (by aromatase CYP19A1 in adipose tissue, brain, testes, and bone). The ratio of testosterone to estradiol modulates hypothalamic feedback and influences spermatogenesis. Pre-testicular causes (hypogonadotropic hypogonadism from pituitary tumors, Kallmann syndrome, functional suppression from obesity, opioids, or exogenous androgens) are potentially reversible with hormonal stimulation. Testicular causes (Klinefelter syndrome, Y-microdeletions, gonadotoxic exposure, varicocele-induced oxidative stress) have variable prognosis. Post-testicular causes (CBAVD, ejaculatory duct obstruction, retrograde ejaculation) may be amenable to surgical correction or sperm retrieval. The clinician must order and interpret hormonal panels and semen analyses, prescribe pharmacotherapy targeting the specific pathophysiology, coordinate surgical referrals, and counsel on prognosis and assisted reproductive technology options."
    },
    riskFactors: [
      "Varicocele with progressive decline in semen parameters",
      "Klinefelter syndrome (47,XXY) — most common genetic cause",
      "Y-chromosome microdeletions (AZFa, AZFb, AZFc regions)",
      "Prior gonadotoxic therapy: alkylating agents, platinum-based chemotherapy, pelvic radiation",
      "Exogenous androgens: testosterone, anabolic steroids, DHEA supplements",
      "Medications: finasteride, SSRIs, alpha-blockers (retrograde ejaculation), chronic opioids",
      "Systemic conditions: diabetes (autonomic neuropathy), CKD (uremia), cirrhosis (hyperestrogenism)",
      "Congenital bilateral absence of vas deferens (CFTR mutations)"
    ],
    diagnostics: [
      "Order two semen analyses at least 2-4 weeks apart with 2-5 days abstinence per WHO 2021 criteria",
      "Order complete hormonal profile: total and free testosterone (morning, fasting), FSH, LH, prolactin, estradiol, SHBG",
      "Interpret FSH patterns: elevated (>12 mIU/mL) suggests primary testicular failure; low/normal with low testosterone suggests central cause",
      "Order karyotype for severe oligospermia (<5 million/mL) or non-obstructive azoospermia to rule out Klinefelter",
      "Order Y-chromosome microdeletion analysis: AZFa/AZFb deletions have very poor prognosis; AZFc may allow sperm retrieval",
      "Order scrotal ultrasound with Doppler for varicocele grading and testicular volume measurement",
      "Order transrectal ultrasound for suspected ejaculatory duct obstruction when low-volume azoospermia is present",
      "Order post-ejaculation urinalysis to diagnose retrograde ejaculation"
    ],
    management: [
      "Prescribe clomiphene 25-50mg daily or every other day for idiopathic oligospermia with normal/low-normal gonadotropins",
      "Prescribe hCG 1500-3000 IU SC 2-3x weekly for hypogonadotropic hypogonadism; add rFSH 75-150 IU SC 3x weekly if no response at 6 months",
      "Prescribe cabergoline 0.25-1mg twice weekly for hyperprolactinemia-induced infertility",
      "Refer for microsurgical varicocelectomy for clinical varicocele with abnormal semen parameters",
      "Discontinue exogenous testosterone and initiate clomiphene or hCG as bridge to HPG axis recovery",
      "Prescribe anastrozole 1mg daily off-label when testosterone/estradiol ratio is low due to peripheral aromatization in obese men",
      "Refer for surgical sperm extraction (micro-TESE) in non-obstructive azoospermia with favorable genetics",
      "Counsel on cryopreservation before gonadotoxic therapy and on assisted reproductive technology options"
    ],
    nursingActions: [
      "Develop comprehensive infertility evaluation protocol based on semen analysis results and hormonal patterns",
      "Classify infertility etiology as pre-testicular, testicular, or post-testicular based on diagnostic workup",
      "Prescribe and titrate hormonal therapy with serial semen analysis monitoring every 3-6 months",
      "Interpret genetic testing results and provide genetic counseling referral",
      "Manage metabolic contributors: weight optimization for obese hypogonadal patients, diabetes management",
      "Coordinate multidisciplinary care: urology, reproductive endocrinology, genetics, psychosocial support",
      "Prescribe lifestyle interventions: antioxidant supplementation (vitamin E, CoQ10, zinc, selenium), scrotal cooling",
      "Develop long-term management plans integrating natural conception attempts, ART timeline, and partner evaluation"
    ],
    signs: {
      left: [
        "Testicular atrophy (<12 mL) suggesting spermatogenic failure",
        "Absent vas deferens (CBAVD — CFTR mutation screening indicated)",
        "Clinical varicocele: bag of worms, increases with standing/Valsalva",
        "Gynecomastia (estrogen-testosterone imbalance from aromatase excess)",
        "Eunuchoid proportions (arm span exceeds height by >5 cm in hypogonadism)",
        "Anosmia with delayed puberty (Kallmann syndrome)"
      ],
      right: [
        "Severe oligospermia (<5 million/mL): genetic testing mandatory",
        "Non-obstructive azoospermia: elevated FSH, small testes",
        "Obstructive azoospermia: normal FSH, normal testes, surgically correctable",
        "Low-volume azoospermia: suggests ejaculatory duct obstruction or retrograde ejaculation",
        "Elevated prolactin with low testosterone: MRI pituitary indicated",
        "Low testosterone with low/normal LH/FSH: central hypogonadism, evaluate pituitary"
      ]
    },
    medications: [
      { name: "Clomiphene Citrate", type: "SERM", action: "Competitively antagonizes estrogen receptors at hypothalamic-pituitary level, disrupting negative feedback, increasing GnRH pulsatility, LH and FSH secretion, and endogenous testosterone production", sideEffects: "Visual disturbances (retinal toxicity), hot flashes, mood swings, gynecomastia, elevated hematocrit", contra: "Primary testicular failure (will not respond), hepatic disease, retinal disease", pearl: "Most cost-effective first-line for idiopathic male infertility. 25mg daily or 50mg QOD. Monitor testosterone, estradiol, and semen analysis at 3-month intervals. Discontinue immediately if visual changes occur." },
      { name: "Anastrozole", type: "Aromatase inhibitor", action: "Reversibly inhibits CYP19A1 (aromatase), reducing peripheral conversion of testosterone to estradiol, improving T/E2 ratio and reducing hypothalamic estrogen-mediated feedback", sideEffects: "Musculoskeletal pain, decreased bone density with chronic use, hot flashes, headache", contra: "Severe osteoporosis, hepatic impairment", pearl: "Off-label 1mg daily for obese men with low T/E2 ratio. Particularly useful when BMI >30 and aromatase activity in adipose tissue is driving estrogen excess. Monitor bone density with prolonged use." },
      { name: "Human Chorionic Gonadotropin (hCG)", type: "LH analog", action: "Binds LH/CG receptors on Leydig cells, stimulating steroidogenesis to produce intratesticular testosterone (50-100x serum levels) required for spermatogenesis", sideEffects: "Gynecomastia (from peripheral aromatization), injection site reactions, acne, polycythemia", contra: "Androgen-dependent malignancy, precocious puberty, primary testicular failure", pearl: "1500-3000 IU SC 2-3x/week is standard. Spermatogenesis takes 6-12 months to establish. If no sperm at 6 months, add rFSH 75-150 IU 3x/week. Combined therapy achieves spermatogenesis in >80% of hypogonadotropic men." },
      { name: "Recombinant FSH (Follitropin alfa)", type: "Gonadotropin", action: "Directly activates FSH receptors on Sertoli cells, stimulating production of androgen-binding protein, inhibin, and supporting spermatogonial maturation through meiosis", sideEffects: "Injection site reactions, headache, gynecomastia, rare: testicular enlargement", contra: "Primary testicular failure, pituitary tumors, elevated basal FSH", pearl: "Used in combination with hCG for complete hypogonadotropic hypogonadism. 75-150 IU SC 3x/week. Pre-treatment testicular volume >4 mL and prior testosterone exposure predict better outcomes." }
    ],
    pearls: [
      "Intratesticular testosterone concentration is 50-100x higher than serum levels and is essential for spermatogenesis; exogenous testosterone cannot replicate this gradient",
      "Y-chromosome microdeletion testing is mandatory for men with sperm concentration <5 million/mL: AZFa and AZFb deletions preclude sperm retrieval; AZFc may allow micro-TESE",
      "CBAVD is present in ~2% of infertile men and is associated with CFTR mutations; screening the female partner for CF carrier status is mandatory before ART",
      "Anastrozole is particularly useful in obese men where excess adipose aromatase activity converts testosterone to estradiol, suppressing the HPG axis",
      "Micro-TESE success rates in non-obstructive azoospermia range from 40-60% and are highest when performed by experienced microsurgeons"
    ],
    quiz: [
      { question: "A 28-year-old man presents with azoospermia, FSH of 2 mIU/mL, LH of 1.5 mIU/mL, and testosterone of 120 ng/dL. What is the most likely diagnosis?", options: ["Primary testicular failure", "Hypogonadotropic hypogonadism", "Obstructive azoospermia", "Varicocele-induced infertility"], correct: 1, rationale: "Low FSH, low LH, and low testosterone indicate hypogonadotropic hypogonadism (pre-testicular cause). This is potentially treatable with hCG ± FSH to stimulate endogenous spermatogenesis." },
      { question: "An obese man (BMI 38) has testosterone of 250 ng/dL, estradiol of 55 pg/mL, and oligospermia. Which medication addresses the underlying pathophysiology?", options: ["Exogenous testosterone", "Anastrozole", "Finasteride", "GnRH antagonist"], correct: 1, rationale: "Elevated estradiol from excess adipose aromatase activity suppresses the HPG axis. Anastrozole inhibits aromatase, reducing estrogen, improving the T/E2 ratio, and restoring gonadotropin-driven spermatogenesis." },
      { question: "A patient on exogenous testosterone for 2 years wants to conceive. What is the NP's first step?", options: ["Add hCG to the testosterone regimen", "Discontinue testosterone and initiate clomiphene or hCG as bridge therapy", "Increase the testosterone dose", "Refer immediately for IVF"], correct: 1, rationale: "Exogenous testosterone suppresses the HPG axis and spermatogenesis. The first step is discontinuation with transition to clomiphene or hCG to stimulate endogenous production while the axis recovers over 3-6 months." }
    ]
  },

  "bph-turp-rpn": {
    title: "BPH/TURP",
    cellular: {
      title: "Prostatic Hyperplasia Pathophysiology",
      content: "Benign prostatic hyperplasia (BPH) results from nonmalignant proliferation of stromal and epithelial cells within the prostate transition zone, driven primarily by dihydrotestosterone (DHT) signaling through androgen receptors. DHT is converted from testosterone by the enzyme 5-alpha reductase. Prostatic enlargement causes bladder outlet obstruction through static (tissue mass compressing urethra) and dynamic (alpha-adrenergic smooth muscle tone) mechanisms. Chronic obstruction leads to detrusor hypertrophy, decreased compliance, and eventually decompensation. Transurethral resection of the prostate (TURP) is the gold-standard surgical treatment for refractory BPH. The nurse monitors vital signs, fluid balance, catheter output, and reports complications such as bleeding or signs of TURP syndrome to the nursing team."
    },
    riskFactors: [
      "Age >50 years (prevalence increases with age)",
      "Family history of BPH",
      "Obesity and metabolic syndrome",
      "Diabetes mellitus",
      "Sedentary lifestyle",
      "Elevated DHT levels",
      "Dietary factors (high fat intake)",
      "Race/ethnicity (higher prevalence in Black men)"
    ],
    diagnostics: [
      "Monitor and record voiding patterns and urine output",
      "Report urinary retention or inability to void",
      "Monitor post-void residual volume as directed",
      "Report hematuria or changes in urine color",
      "Monitor vital signs post-TURP for signs of hemorrhage or TURP syndrome",
      "Monitor catheter drainage: color, amount, presence of clots"
    ],
    management: [
      "Administer alpha-blockers (tamsulosin) and 5-alpha reductase inhibitors (finasteride) as ordered",
      "Maintain continuous bladder irrigation (CBI) post-TURP as ordered",
      "Monitor catheter traction and drainage post-operatively",
      "Administer stool softeners as ordered to prevent straining",
      "Encourage adequate fluid intake unless restricted",
      "Report signs of TURP syndrome: confusion, nausea, hypertension, visual changes"
    ],
    nursingActions: [
      "Assess and document urinary symptoms: frequency, urgency, nocturia, weak stream",
      "Monitor CBI flow rate to keep drainage pink to clear post-TURP",
      "Report clot obstruction: distended bladder, decreased output, patient discomfort",
      "Monitor vital signs every 15 minutes post-TURP initially, then per protocol",
      "Report signs of hemorrhage: bright red drainage with clots, tachycardia, hypotension",
      "Assess for TURP syndrome symptoms: confusion, nausea, bradycardia, hyponatremia"
    ],
    signs: {
      left: [
        "Weak or slow urinary stream",
        "Urinary hesitancy and straining",
        "Sensation of incomplete bladder emptying",
        "Increased daytime urinary frequency",
        "Nocturia (waking >2 times to void)",
        "Urgency or urge incontinence"
      ],
      right: [
        "Post-void dribbling",
        "Acute urinary retention",
        "Recurrent urinary tract infections",
        "Hematuria",
        "Overflow incontinence",
        "Hydronephrosis (advanced obstruction)"
      ]
    },
    medications: [
      { name: "Tamsulosin", type: "Alpha-1 adrenergic antagonist", action: "Selectively blocks alpha-1A adrenergic receptors on prostatic and bladder neck smooth muscle, reducing dynamic obstruction and improving urine flow", sideEffects: "Dizziness, orthostatic hypotension, rhinitis, abnormal ejaculation, headache", contra: "Concurrent use with other alpha-blockers, severe hepatic impairment", pearl: "Take 30 minutes after the same meal each day. First-dose hypotension risk is lower than non-selective alpha-blockers. Report syncope or priapism. Administer as ordered." },
      { name: "Finasteride", type: "5-alpha reductase inhibitor", action: "Inhibits type II 5-alpha reductase, preventing conversion of testosterone to DHT, reducing prostate volume by 20-30% over 6-12 months", sideEffects: "Decreased libido, erectile dysfunction, decreased ejaculatory volume, gynecomastia, depression", contra: "Pregnancy exposure (teratogenic to male fetus), women of childbearing potential", pearl: "Takes 6-12 months for full effect on prostate size. Reduces PSA by approximately 50%; PSA values must be doubled for accurate cancer screening interpretation." }
    ],
    pearls: [
      "TURP syndrome is caused by absorption of hypotonic irrigation fluid into the bloodstream, causing dilutional hyponatremia — report confusion, nausea, or visual changes immediately",
      "Post-TURP catheter irrigation should run fast enough to keep drainage light pink; bright red with clots requires immediate reporting",
      "Patients should avoid straining, heavy lifting, and sexual activity for 4-6 weeks post-TURP",
      "Finasteride reduces PSA by 50%; the provider must double the measured PSA value for accurate cancer screening"
    ],
    quiz: [
      { question: "Following TURP, the nurse notes the patient is confused, nauseated, and the blood pressure is elevated. What should be suspected?", options: ["Expected post-operative pain response", "TURP syndrome from irrigation fluid absorption", "Allergic reaction to anesthesia", "Urinary tract infection"], correct: 1, rationale: "TURP syndrome results from absorption of hypotonic irrigation fluid into the bloodstream, causing dilutional hyponatremia. Symptoms include confusion, nausea, hypertension, bradycardia, and visual changes. Report immediately." },
      { question: "The nurse observes bright red drainage with large clots in the catheter bag 4 hours post-TURP. What is the priority action?", options: ["Document and continue monitoring", "Increase the CBI flow rate and report to the RN", "Clamp the catheter to allow clots to dissolve", "Encourage the patient to drink more fluids"], correct: 1, rationale: "Bright red drainage with large clots suggests active bleeding and possible clot obstruction. Increasing CBI flow helps clear clots while reporting to the nurse ensures timely intervention." }
    ]
  },

  "bph-turp-rn": {
    title: "BPH/TURP",
    cellular: {
      title: "BPH Pathophysiology and Surgical Management",
      content: "BPH involves hyperplasia of both glandular and stromal elements in the prostate transition zone, driven by DHT-mediated androgen receptor signaling. DHT activates paracrine stromal-epithelial interactions promoting cell proliferation, reduced apoptosis, extracellular matrix remodeling, and glandular enlargement. Growth factors (FGF, KGF, IGF-1) favor proliferation while TGF-beta provides antiproliferative signals; the balance determines disease progression. Bladder outlet obstruction produces both voiding symptoms (from increased urethral resistance) and storage symptoms (from detrusor instability and increased residual volumes). Alpha-1 adrenergic receptor-mediated smooth muscle tone contributes dynamic obstruction, explaining the rapid benefit of alpha-blockers. TURP removes obstructing prostatic tissue via resectoscope using monopolar or bipolar electrocautery. The nurse manages pre- and post-operative care, continuous bladder irrigation, hemorrhage prevention, and early detection of TURP syndrome (dilutional hyponatremia from hypotonic irrigation fluid absorption). Bipolar TURP using normal saline irrigation has significantly reduced TURP syndrome incidence."
    },
    riskFactors: [
      "Age >50 years (histologic BPH present in 50% of men by age 50)",
      "Androgen exposure (intact HPG axis required for BPH development)",
      "Family history (first-degree relative increases risk 4-6 fold)",
      "Obesity and metabolic syndrome (insulin resistance promotes prostatic growth)",
      "Diabetes mellitus (autonomic neuropathy worsens bladder dysfunction)",
      "Physical inactivity",
      "Chronic inflammation of the prostate",
      "Medications: anticholinergics, decongestants (may precipitate retention)"
    ],
    diagnostics: [
      "Administer and score IPSS (International Prostate Symptom Score) questionnaire",
      "Assess digital rectal exam findings: prostate size, consistency, symmetry, nodularity",
      "Evaluate uroflowmetry results: peak flow rate <10 mL/s indicates significant obstruction",
      "Assess post-void residual volume by bladder scan: >200 mL indicates significant retention",
      "Monitor PSA levels and adjust interpretation for 5-alpha reductase inhibitor use (double the value)",
      "Evaluate renal function (creatinine, BUN) for obstructive nephropathy",
      "Monitor CBC post-TURP for hemorrhage assessment",
      "Evaluate serum sodium levels for TURP syndrome detection"
    ],
    management: [
      "Initiate alpha-blocker therapy for moderate-severe LUTS per protocol",
      "Initiate combination therapy (alpha-blocker + 5-ARI) for large prostates (>30-40g) with moderate-severe symptoms",
      "Manage continuous bladder irrigation post-TURP: titrate flow to maintain light pink drainage",
      "Implement clot evacuation protocol if catheter obstruction occurs",
      "Manage TURP syndrome: stop irrigation, obtain stat sodium, administer hypertonic saline as ordered for symptomatic hyponatremia",
      "Coordinate pre-operative medication management: hold anticoagulants per protocol",
      "Implement post-operative activity restrictions and discharge education",
      "Monitor for delayed complications: urethral stricture, retrograde ejaculation, urinary incontinence"
    ],
    nursingActions: [
      "Perform comprehensive urological assessment including IPSS scoring and focused physical exam",
      "Manage post-TURP CBI: maintain patent catheter, adjust flow rate, monitor input-output balance",
      "Assess for hemorrhage: monitor drainage color, vital signs, hemoglobin trends",
      "Perform bladder irrigation with manual hand irrigation if clot obstruction suspected",
      "Assess for TURP syndrome every 15 minutes post-operatively: mental status, nausea, vital signs",
      "Implement DVT prophylaxis and early mobilization post-operatively",
      "Educate patient on post-discharge care: avoid straining, heavy lifting, sexual activity for 4-6 weeks",
      "Educate on medication adherence and follow-up PSA monitoring requirements"
    ],
    signs: {
      left: [
        "Voiding symptoms: weak stream, hesitancy, intermittency, straining, incomplete emptying",
        "Storage symptoms: frequency, urgency, nocturia, urge incontinence",
        "Elevated post-void residual (>100 mL concerning, >200 mL significant)",
        "Reduced peak flow rate on uroflowmetry (<10 mL/s)",
        "Enlarged, smooth, symmetric prostate on DRE",
        "Elevated IPSS score (>7 moderate, >19 severe)"
      ],
      right: [
        "Acute urinary retention (painful inability to void)",
        "Recurrent UTI from stasis",
        "Bladder stones from chronic residual urine",
        "Hematuria (from dilated prostatic vessels)",
        "Bilateral hydronephrosis (advanced obstruction)",
        "TURP syndrome: hyponatremia, confusion, seizures, bradycardia"
      ]
    },
    medications: [
      { name: "Tamsulosin", type: "Selective alpha-1A antagonist", action: "Competitively blocks alpha-1A adrenergic receptors on prostatic smooth muscle, inhibiting the PLC-IP3-calcium signaling cascade that drives smooth muscle contraction, thereby reducing dynamic obstruction", sideEffects: "Orthostatic hypotension, dizziness, retrograde ejaculation, rhinitis, intraoperative floppy iris syndrome", contra: "Concurrent strong CYP3A4 inhibitors, planned cataract surgery (notify ophthalmologist)", pearl: "0.4mg daily 30 minutes after a meal. Uroselective with less hypotension than non-selective alpha-blockers. Abnormal ejaculation occurs in up to 18% of patients." },
      { name: "Finasteride", type: "Type II 5-alpha reductase inhibitor", action: "Blocks conversion of testosterone to DHT in prostate tissue, causing epithelial and stromal involution, reducing prostate volume 20-30% over 6-12 months", sideEffects: "Erectile dysfunction, decreased libido, decreased ejaculatory volume, gynecomastia, post-finasteride syndrome (rare)", contra: "Women who are or may become pregnant (FDA Category X — DHT is essential for male fetal development)", pearl: "MTOPS trial showed combination with alpha-blocker reduces clinical progression by 67%. PSA is reduced by ~50%; multiply measured PSA by 2 for cancer screening. Takes 6-12 months for clinical benefit." },
      { name: "Dutasteride", type: "Dual 5-alpha reductase inhibitor (types I and II)", action: "Inhibits both type I and type II 5-alpha reductase isoenzymes, producing greater DHT suppression (>90%) than finasteride alone", sideEffects: "Similar to finasteride: sexual dysfunction, gynecomastia, mood changes, long half-life (5 weeks)", contra: "Pregnancy exposure, hepatic impairment, blood donation within 6 months of use", pearl: "Greater DHT suppression may benefit larger prostates. CombAT trial showed dutasteride + tamsulosin superior to monotherapy for moderate-severe BPH with large prostate (>30g)." },
      { name: "Tadalafil", type: "PDE5 inhibitor", action: "Inhibits phosphodiesterase type 5 in prostatic smooth muscle and bladder, increasing cGMP-mediated smooth muscle relaxation and improving lower urinary tract symptoms", sideEffects: "Headache, dyspepsia, back pain, nasal congestion, flushing", contra: "Concurrent nitrates, recent stroke or MI, severe hepatic/renal impairment", pearl: "5mg daily is FDA-approved for BPH/LUTS with or without concurrent ED. Only PDE5 inhibitor with this indication. Cannot combine with alpha-blockers due to additive hypotension risk." }
    ],
    pearls: [
      "IPSS score guides treatment: mild (0-7) = watchful waiting; moderate (8-19) = pharmacotherapy; severe (20-35) = consider surgical intervention",
      "TURP syndrome occurs from absorption of hypotonic (glycine-based) irrigation fluid causing dilutional hyponatremia (<120 mEq/L), cerebral edema, and cardiovascular instability",
      "Bipolar TURP uses normal saline irrigation, virtually eliminating TURP syndrome risk",
      "Retrograde ejaculation is the most common long-term complication of TURP, occurring in 65-75% of patients",
      "Medications that can precipitate acute retention in BPH: anticholinergics, first-generation antihistamines, oral decongestants (alpha-adrenergic agonists)"
    ],
    quiz: [
      { question: "A post-TURP patient develops confusion, nausea, and a serum sodium of 118 mEq/L. What is the priority intervention?", options: ["Increase CBI flow rate", "Stop irrigation, notify provider, anticipate hypertonic saline administration", "Administer a fluid bolus of normal saline", "Administer furosemide to reduce fluid overload"], correct: 1, rationale: "Serum sodium of 118 mEq/L with confusion indicates severe TURP syndrome. Priority actions are stopping irrigation, notifying the provider, and preparing for hypertonic saline (3% NaCl) administration to correct symptomatic hyponatremia." },
      { question: "Which combination therapy has the strongest evidence for reducing clinical progression of BPH?", options: ["Two different alpha-blockers", "Alpha-blocker plus 5-alpha reductase inhibitor", "5-alpha reductase inhibitor plus anticholinergic", "PDE5 inhibitor plus beta-blocker"], correct: 1, rationale: "The MTOPS trial demonstrated that combination of alpha-blocker (doxazosin) plus 5-alpha reductase inhibitor (finasteride) reduced clinical progression by 67%, superior to either agent alone." },
      { question: "Why must PSA values be adjusted in patients taking finasteride?", options: ["Finasteride falsely elevates PSA", "Finasteride reduces PSA by approximately 50%, masking potential prostate cancer", "Finasteride has no effect on PSA levels", "Finasteride causes PSA fluctuations making any reading unreliable"], correct: 1, rationale: "Finasteride reduces PSA by approximately 50% by shrinking prostate tissue. Measured PSA must be multiplied by 2 to estimate the true value for accurate prostate cancer screening." }
    ]
  },

  "bph-turp-np": {
    title: "BPH/TURP",
    cellular: {
      title: "Molecular Mechanisms of Prostatic Growth",
      content: "BPH pathogenesis centers on DHT-mediated androgen receptor signaling within the prostate transition zone. Testosterone enters prostatic cells and is converted to DHT by 5-alpha reductase (type II predominates in prostate). DHT binds androgen receptors, forming homodimers that translocate to the nucleus and activate transcription of genes promoting growth (PSA, cell survival, proliferation pathways). Stromal-epithelial paracrine signaling involving FGF, KGF, and IGF-1 further drives hyperplasia, while TGF-beta provides counterbalancing antiproliferative signals. The dynamic component involves alpha-1A adrenergic receptor-mediated smooth muscle contraction: epinephrine activates PLC, generating IP3 and DAG, triggering intracellular calcium release from the sarcoplasmic reticulum and extracellular calcium entry, culminating in actin-myosin cross-bridge formation and urethral smooth muscle contraction. Alpha-blockers competitively inhibit this sequence. PDE5 inhibitors increase cGMP in prostatic smooth muscle, promoting relaxation through a distinct pathway. Surgical interventions (TURP, laser enucleation, prostatic urethral lift, water vapor thermal therapy) address refractory cases. The clinician must select pharmacotherapy based on prostate size, symptom severity, and comorbidities, manage surgical referral timing, and handle post-operative complications."
    },
    riskFactors: [
      "Age-related DHT-driven prostatic growth (histologic BPH in >80% of men by age 80)",
      "Intact HPG axis (castrated men do not develop BPH)",
      "Genetic predisposition (hereditary BPH has autosomal dominant pattern)",
      "Metabolic syndrome (hyperinsulinemia stimulates prostatic growth via IGF-1 pathway)",
      "Chronic prostatic inflammation (inflammatory cytokines promote stromal remodeling)",
      "Obesity (aromatization of testosterone to estradiol may sensitize prostate to androgens)",
      "Physical inactivity and dietary factors",
      "Concurrent lower urinary tract pathology complicating symptom assessment"
    ],
    diagnostics: [
      "Order and interpret IPSS with quality of life (QoL) score for symptom classification",
      "Perform or order DRE: estimate prostate size, assess for asymmetry or nodularity (cancer screening)",
      "Order PSA with age-specific reference ranges; adjust for 5-ARI use (multiply by 2)",
      "Order uroflowmetry: Qmax <10 mL/s indicates significant obstruction requiring intervention",
      "Order bladder diary (3-day frequency-volume chart) to characterize storage symptoms",
      "Order renal ultrasound for patients with elevated creatinine, hematuria, or recurrent UTI",
      "Order urodynamic studies for complex cases (neurogenic bladder coexistence, prior pelvic surgery)",
      "Order cystoscopy for hematuria evaluation or before planned surgical intervention"
    ],
    management: [
      "Prescribe tamsulosin 0.4mg daily for moderate LUTS; consider doxazosin or alfuzosin as alternatives",
      "Prescribe finasteride 5mg or dutasteride 0.5mg daily for prostates >30-40g with moderate-severe symptoms",
      "Prescribe combination therapy (alpha-blocker + 5-ARI) for large prostates with progressive symptoms",
      "Prescribe tadalafil 5mg daily for BPH/LUTS with concurrent ED (avoid combining with alpha-blockers)",
      "Refer for TURP or laser enucleation for refractory symptoms, recurrent retention, recurrent UTI, bladder stones, or renal impairment",
      "Manage anticoagulation perioperatively: hold anticoagulants/antiplatelets per surgical protocol",
      "Prescribe antimuscarinic or beta-3 agonist (mirabegron) for persistent storage symptoms after adequate outlet treatment",
      "Manage post-TURP complications: TURP syndrome (hypertonic saline), hemorrhage (CBI, possible return to OR), urethral stricture (dilation)"
    ],
    nursingActions: [
      "Develop individualized treatment algorithms based on IPSS, prostate size, PSA, uroflowmetry, and patient goals",
      "Prescribe and titrate pharmacotherapy with systematic follow-up at 4-6 weeks for alpha-blockers, 6-12 months for 5-ARIs",
      "Evaluate surgical candidacy using AUA/CUA guidelines: absolute indications include recurrent retention, renal insufficiency, bladder stones, recurrent UTI",
      "Manage medication interactions: alpha-blockers + PDE5 inhibitors (additive hypotension), 5-ARIs + pregnancy exposure risk",
      "Order and interpret PSA velocity to screen for concurrent prostate cancer (increase >0.75 ng/mL/year is concerning)",
      "Coordinate informed consent discussions including risk of retrograde ejaculation (65-75% post-TURP), ED (5-10%), and incontinence (1-3%)",
      "Prescribe post-operative protocols: CBI management, catheter removal timing (1-3 days), activity restrictions",
      "Assess for newer minimally invasive options: UroLift, Rezum, Aquablation based on prostate anatomy and patient preference"
    ],
    signs: {
      left: [
        "Progressive LUTS with declining Qmax despite pharmacotherapy",
        "Elevated post-void residual (>200 mL) with recurrent UTI",
        "Bladder decompensation: detrusor underactivity on urodynamics",
        "Renal function decline from bilateral hydronephrosis",
        "Prostate >80g (may require open prostatectomy or laser enucleation rather than TURP)",
        "IPSS >19 with significant QoL impairment despite medical therapy"
      ],
      right: [
        "TURP syndrome: acute hyponatremia (<120 mEq/L), cerebral edema, seizures",
        "Post-TURP hemorrhage: bright red CBI output, clot retention, hemodynamic instability",
        "Urethral stricture (delayed complication): recurrent obstructive symptoms weeks to months post-op",
        "Retrograde ejaculation (expected in 65-75% post-TURP)",
        "Post-operative UTI from catheterization",
        "Acute urinary retention post-catheter removal (5-10%)"
      ]
    },
    medications: [
      { name: "Tamsulosin", type: "Alpha-1A selective antagonist", action: "Competitively inhibits alpha-1A adrenergic receptors in prostatic smooth muscle, blocking PLC-IP3-calcium signaling cascade, reducing dynamic urethral obstruction within 48 hours", sideEffects: "Orthostatic hypotension, abnormal ejaculation (up to 18%), dizziness, rhinitis, IFIS (intraoperative floppy iris syndrome)", contra: "Concurrent potent CYP3A4 inhibitors, planned cataract surgery (inform ophthalmologist of prior use)", pearl: "Most uroselective alpha-blocker. 0.4mg daily 30 min after a meal. Onset of action within days. Warn patients about first-dose dizziness and IFIS risk. Does not reduce prostate size." },
      { name: "Dutasteride", type: "Dual 5-alpha reductase inhibitor", action: "Inhibits both type I and type II 5-alpha reductase, achieving >93% serum DHT suppression versus ~70% with finasteride, resulting in greater prostate volume reduction", sideEffects: "Sexual dysfunction (decreased libido, ED), gynecomastia, mood changes, extremely long half-life (5 weeks affecting blood donation)", contra: "Women who are or may become pregnant, hepatic disease, blood donation within 6 months", pearl: "CombAT trial: dutasteride + tamsulosin superior to monotherapy for reducing progression in men with prostate >30g. 0.5mg daily. Takes 6-12 months for maximum effect. PSA reduction ~50%." },
      { name: "Tadalafil", type: "PDE5 inhibitor", action: "Inhibits PDE5 in prostatic, bladder neck, and urethral smooth muscle, increasing cGMP-mediated relaxation via nitric oxide pathway, improving both LUTS and erectile function", sideEffects: "Headache, dyspepsia, back pain, myalgia, flushing, nasal congestion", contra: "Concurrent nitrate use, alpha-blocker use (additive hypotension), recent MI or stroke, severe hepatic impairment", pearl: "5mg daily is the only PDE5 inhibitor FDA-approved for BPH/LUTS. Ideal for patients with concurrent ED. Cannot combine with alpha-blockers. Onset of LUTS improvement within 1-2 weeks." },
      { name: "Mirabegron", type: "Beta-3 adrenergic agonist", action: "Activates beta-3 receptors on detrusor smooth muscle, promoting relaxation during filling phase, reducing urgency and frequency without anticholinergic side effects", sideEffects: "Hypertension, UTI, headache, nasopharyngitis", contra: "Uncontrolled hypertension, severe hepatic impairment, end-stage renal disease", pearl: "Added to alpha-blocker for persistent storage symptoms (OAB) after addressing outlet obstruction. 25-50mg daily. Monitor blood pressure. Preferred over antimuscarinics in elderly due to lower cognitive risk." }
    ],
    pearls: [
      "The four pillars of BPH pharmacotherapy target distinct mechanisms: alpha-blockers (dynamic obstruction), 5-ARIs (static obstruction), PDE5 inhibitors (smooth muscle relaxation + ED), and beta-3 agonists (storage symptoms)",
      "Absolute indications for surgical intervention: recurrent urinary retention despite trial without catheter, renal insufficiency from obstruction, recurrent UTI, bladder stones, recurrent gross hematuria",
      "Prostate size determines surgical approach: <80g TURP, >80g open prostatectomy or HoLEP (holmium laser enucleation)",
      "Post-finasteride syndrome (persistent sexual/psychological symptoms after discontinuation) is rare but recognized; counsel patients during informed consent",
      "New minimally invasive therapies: UroLift (prostatic urethral lift) preserves ejaculatory function, Rezum (water vapor thermal therapy) can be done in-office under local anesthesia"
    ],
    quiz: [
      { question: "Which patient is the best candidate for combination alpha-blocker plus 5-alpha reductase inhibitor therapy?", options: ["30-year-old with mild LUTS and 20g prostate", "65-year-old with moderate-severe LUTS, IPSS 22, and 45g prostate", "55-year-old with ED and mild LUTS", "70-year-old with bladder stones requiring surgery"], correct: 1, rationale: "Combination therapy is most beneficial for men with moderate-severe symptoms AND enlarged prostate (>30-40g). The MTOPS and CombAT trials demonstrated superiority over monotherapy in this population for reducing progression." },
      { question: "An NP prescribes tadalafil 5mg daily for BPH. Which concurrent medication is contraindicated?", options: ["Finasteride", "Tamsulosin", "Metformin", "Lisinopril"], correct: 1, rationale: "Tadalafil (PDE5 inhibitor) combined with alpha-blockers (tamsulosin) causes additive hypotension. Tadalafil 5mg daily for BPH should be used as monotherapy or combined with 5-ARIs but not alpha-blockers." },
      { question: "A patient requests a procedure that preserves ejaculatory function. Which option should the clinician discuss?", options: ["Standard monopolar TURP", "Prostatic urethral lift (UroLift)", "Open prostatectomy", "Bipolar TURP"], correct: 1, rationale: "UroLift (prostatic urethral lift) mechanically compresses prostatic lobes without tissue removal, preserving ejaculatory function. TURP causes retrograde ejaculation in 65-75% of cases." }
    ]
  },

  "hearing-loss-differential-rpn": {
    title: "Hearing Loss — Conductive vs Sensorineural",
    cellular: {
      title: "Auditory Physiology and Hearing Loss",
      content: "Hearing depends on sound wave transmission through the external ear canal to the tympanic membrane, amplification by the ossicular chain (malleus, incus, stapes) in the middle ear, and transduction by hair cells of the organ of Corti in the cochlea. The cochlea converts mechanical vibration into neural signals transmitted via the vestibulocochlear nerve (CN VIII) to the auditory cortex. Conductive hearing loss results from impaired sound transmission through the external or middle ear due to cerumen impaction, otitis media, tympanic membrane perforation, otosclerosis, or cholesteatoma. Sensorineural hearing loss (SNHL) results from damage to the cochlear hair cells or auditory nerve from noise exposure, aging (presbycusis), ototoxic medications, Meniere disease, or congenital causes. The nurse assists with hearing assessments as directed, communicates effectively with hearing-impaired patients, administers medications as ordered, and reports changes in auditory function to the nursing team."
    },
    riskFactors: [
      "Chronic noise exposure (occupational, recreational)",
      "Aging (presbycusis — most common cause of SNHL)",
      "Ototoxic medications (aminoglycosides, loop diuretics, cisplatin, high-dose aspirin)",
      "Chronic otitis media or effusion",
      "Cerumen impaction (most common cause of reversible conductive loss)",
      "Family history of hearing loss",
      "Diabetes mellitus (microvascular cochlear damage)",
      "Congenital infections (rubella, CMV) and prematurity"
    ],
    diagnostics: [
      "Assist with otoscopic examination as directed: report cerumen impaction, TM perforation, fluid behind TM",
      "Report patient complaints of hearing difficulty, tinnitus, or aural fullness",
      "Assist with whisper test or finger rub screening as directed",
      "Monitor for medication side effects: report new hearing changes in patients on aminoglycosides or loop diuretics",
      "Document communication difficulties and strategies used"
    ],
    management: [
      "Administer ear drops or cerumenolytics as ordered",
      "Assist with cerumen removal as directed by the nurse or provider",
      "Administer ototoxic medications as ordered with awareness of hearing monitoring requirements",
      "Use communication strategies: face the patient, speak clearly, reduce background noise",
      "Administer antibiotics for otitis media as ordered",
      "Report sudden hearing loss immediately as it may be a medical emergency"
    ],
    nursingActions: [
      "Assess hearing status using basic bedside techniques as directed",
      "Implement communication accommodations: written instructions, hearing amplifier devices",
      "Monitor patients on ototoxic medications for hearing changes and report immediately",
      "Educate patients on hearing protection in noisy environments",
      "Report sudden unilateral hearing loss immediately (potential sensorineural emergency)",
      "Assist with hearing aid use and care as directed"
    ],
    signs: {
      left: [
        "Conductive loss: diminished hearing with soft speaking voice",
        "Often hears better in noisy environments (paracusis of Willis)",
        "Ear pain, drainage, or fullness with otitis media",
        "Visible cerumen impaction or TM abnormality",
        "Conductive hearing loss typically unilateral",
        "Tuning fork: Weber lateralizes to affected ear, Rinne negative (BC > AC)"
      ],
      right: [
        "Sensorineural loss: difficulty hearing in noisy environments",
        "Gradual onset (presbycusis) or sudden (vascular, viral)",
        "Tinnitus (ringing, buzzing) common accompaniment",
        "May be associated with vertigo (Meniere disease)",
        "Often bilateral and symmetric in age-related loss",
        "Tuning fork: Weber lateralizes to unaffected ear, Rinne positive (AC > BC)"
      ]
    },
    medications: [
      { name: "Ciprofloxacin/Dexamethasone Otic", type: "Antibiotic/steroid combination", action: "Ciprofloxacin provides broad-spectrum antibacterial activity against common otic pathogens; dexamethasone reduces inflammation and edema in the ear canal", sideEffects: "Ear discomfort, pruritis, superinfection", contra: "Perforated tympanic membrane (for some formulations), viral or fungal otitis", pearl: "Warm drops to body temperature before instilling to reduce vertigo. Pull auricle up and back in adults to straighten ear canal. Administer as ordered." },
      { name: "Carbamide Peroxide (Debrox)", type: "Cerumenolytic", action: "Releases oxygen on contact with cerumen, mechanically softening and loosening impacted earwax", sideEffects: "Temporary fizzing sensation, mild irritation", contra: "Ear drainage, TM perforation, ear tubes, recent ear surgery", pearl: "Instill 5-10 drops into affected ear, allow to remain for several minutes, then irrigate with warm water. Avoid in perforated TM. Administer as directed." }
    ],
    pearls: [
      "Sudden sensorineural hearing loss is a medical emergency requiring urgent ENT referral and possible steroid treatment within 72 hours",
      "Cerumen impaction is the most common reversible cause of hearing loss and can reduce hearing by up to 10 decibels",
      "Weber and Rinne tuning fork tests help differentiate conductive from sensorineural loss at the bedside",
      "Patients on aminoglycosides should have baseline and serial audiometry to detect ototoxicity early"
    ],
    quiz: [
      { question: "A patient on IV gentamicin reports new bilateral tinnitus and difficulty hearing. What should the nurse do?", options: ["Document and reassess at the next shift", "Report immediately to the nurse as this may indicate ototoxicity", "Irrigate both ears with warm water", "Administer an additional dose of gentamicin"], correct: 1, rationale: "Tinnitus and hearing loss in a patient on aminoglycosides suggest ototoxicity, which can be irreversible. The nurse must report immediately for possible medication hold and audiometric evaluation." },
      { question: "Which type of hearing loss is associated with hearing better in noisy environments?", options: ["Sensorineural hearing loss", "Conductive hearing loss", "Central auditory processing disorder", "Noise-induced hearing loss"], correct: 1, rationale: "In conductive hearing loss, patients often hear better in noisy environments (paracusis of Willis) because others raise their voices and the affected ear is relatively shielded from ambient noise competing with speech." }
    ]
  },

  "hearing-loss-differential-rn": {
    title: "Hearing Loss — Conductive vs Sensorineural",
    cellular: {
      title: "Pathophysiology of Auditory Dysfunction",
      content: "The auditory system involves sound collection (auricle), transmission (external auditory canal, tympanic membrane, ossicular chain), transduction (cochlear hair cells in the organ of Corti), and neural processing (spiral ganglion neurons, CN VIII, brainstem auditory nuclei, auditory cortex). Conductive hearing loss (CHL) results from any impediment in the external or middle ear preventing efficient sound energy transfer to the cochlea. Common causes include cerumen impaction, foreign bodies, otitis media with effusion, TM perforation, otosclerosis (fixation of stapes footplate), and cholesteatoma. Sensorineural hearing loss (SNHL) results from damage to cochlear hair cells (sensory) or the auditory nerve (neural). Presbycusis involves progressive loss of outer hair cells starting at the cochlear base (high-frequency loss). Noise-induced hearing loss involves mechanical destruction and metabolic exhaustion of hair cells, particularly at 4000 Hz. Ototoxic drugs (aminoglycosides inhibit mitochondrial protein synthesis in hair cells; cisplatin generates reactive oxygen species; loop diuretics alter endolymphatic potassium homeostasis). Mixed hearing loss involves both conductive and sensorineural components. The nurse performs comprehensive auditory assessment, interprets tuning fork tests, manages ototoxicity monitoring protocols, coordinates audiology referrals, and provides patient education on hearing protection and rehabilitation."
    },
    riskFactors: [
      "Occupational noise exposure (>85 dB without protection)",
      "Aging (presbycusis affects 30-35% of adults 65-75 years)",
      "Ototoxic medications: aminoglycosides, cisplatin, loop diuretics, high-dose aspirin/NSAIDs",
      "Chronic/recurrent otitis media",
      "Otosclerosis (autosomal dominant, most common in white females)",
      "Meniere disease (endolymphatic hydrops)",
      "Congenital: genetic (connexin 26 mutations), TORCH infections, prematurity",
      "Diabetes, cardiovascular disease (microvascular cochlear compromise)"
    ],
    diagnostics: [
      "Perform otoscopic examination: assess canal, TM integrity, effusion, cerumen status",
      "Perform Weber test (512 Hz tuning fork on vertex): lateralizes to affected ear in CHL, unaffected ear in SNHL",
      "Perform Rinne test: BC > AC (negative Rinne) = CHL; AC > BC (positive Rinne) = normal or SNHL",
      "Coordinate formal audiometric testing: pure tone audiometry, speech discrimination scores",
      "Assess tympanometry results: flat (Type B) = effusion/perforation; peaked (Type A) = normal compliance",
      "Monitor ototoxicity: coordinate baseline and serial audiometry for patients on aminoglycosides or cisplatin",
      "Evaluate for retrocochlear pathology (acoustic neuroma) when asymmetric SNHL is present"
    ],
    management: [
      "Manage cerumen impaction: irrigation with warm water (body temperature), curette removal, or cerumenolytic drops",
      "Treat otitis media per protocol: antibiotics for bacterial, watchful waiting for viral",
      "Implement ototoxicity monitoring protocol: baseline audiometry, high-frequency monitoring during treatment",
      "Coordinate urgent ENT referral for sudden SNHL (treatment within 72 hours with steroids improves outcomes)",
      "Coordinate audiology referral for hearing aid fitting when indicated",
      "Manage vertigo and tinnitus associated with hearing loss (Meniere disease)",
      "Implement communication strategies: assistive listening devices, speech-reading, environmental modifications",
      "Educate on hearing protection: earplugs/muffs in noisy environments, limiting headphone volume"
    ],
    nursingActions: [
      "Perform comprehensive hearing assessment including tuning fork tests and otoscopic examination",
      "Interpret Weber and Rinne results to differentiate CHL from SNHL at the bedside",
      "Monitor patients on ototoxic medications with baseline and serial hearing assessments",
      "Implement fall prevention for patients with hearing loss (associated with balance and spatial awareness impairment)",
      "Assess impact of hearing loss on daily functioning, safety, and psychosocial well-being",
      "Coordinate multidisciplinary care: audiology, ENT, speech-language pathology",
      "Educate patients and families on communication strategies and hearing rehabilitation options",
      "Document hearing status and communication needs in care plan"
    ],
    signs: {
      left: [
        "CHL: Weber lateralizes to affected side; negative Rinne (BC > AC)",
        "Visible pathology on otoscopy: cerumen, TM perforation, effusion, retraction",
        "Tympanometry Type B (flat) indicating effusion or perforation",
        "Air-bone gap on audiometry (bone conduction better than air conduction)",
        "Usually unilateral; speech discrimination typically preserved",
        "Paracusis of Willis (hearing better in noise)"
      ],
      right: [
        "SNHL: Weber lateralizes to unaffected side; positive Rinne (AC > BC)",
        "High-frequency hearing loss on audiometry (classic 4 kHz notch in noise-induced)",
        "Poor speech discrimination scores (disproportionate to degree of pure tone loss)",
        "Tinnitus (subjective ringing or buzzing)",
        "Often bilateral and symmetric (presbycusis, ototoxicity)",
        "May associate with vertigo or balance disturbance"
      ]
    },
    medications: [
      { name: "Oral Prednisone", type: "Systemic corticosteroid", action: "Reduces inflammation and immune-mediated damage in the cochlea; restores microcirculation and reduces endolymphatic pressure in sudden SNHL", sideEffects: "Hyperglycemia, insomnia, mood changes, GI upset, immunosuppression", contra: "Active systemic infection, uncontrolled diabetes, psychosis", pearl: "Standard treatment for sudden SNHL: 60mg daily for 7-14 days with taper. Must be initiated within 72 hours of onset for best outcomes. If contraindicated, intratympanic dexamethasone is an alternative." },
      { name: "Intratympanic Dexamethasone", type: "Local corticosteroid", action: "Direct delivery of high-concentration steroid to the round window membrane for cochlear absorption, reducing inflammation with minimal systemic effects", sideEffects: "Transient vertigo, ear pain, TM perforation risk, temporary taste disturbance", contra: "Active middle ear infection, TM perforation (relative)", pearl: "Used as salvage therapy for sudden SNHL failing oral steroids, or as primary therapy when systemic steroids are contraindicated. Administered by ENT specialist." },
      { name: "Ciprofloxacin/Dexamethasone Otic", type: "Topical antibiotic/steroid", action: "Ciprofloxacin provides bactericidal activity against Pseudomonas and Staphylococcus; dexamethasone reduces canal and middle ear inflammation", sideEffects: "Ear discomfort, superinfection, allergic reaction", contra: "Viral otitis, fungal infections (may require antifungal treatment)", pearl: "First-line for otitis externa. Warm drops before instilling. Tragal pumping after instillation improves distribution. Wick placement may be needed if canal is severely edematous." },
      { name: "Amoxicillin", type: "Beta-lactam antibiotic", action: "Inhibits bacterial cell wall synthesis by binding penicillin-binding proteins, bactericidal against common middle ear pathogens (S. pneumoniae, H. influenzae)", sideEffects: "Diarrhea, rash, allergic reaction, rare: anaphylaxis", contra: "Penicillin allergy, infectious mononucleosis (increased rash risk)", pearl: "First-line for acute otitis media when antibiotics are indicated. 80-90 mg/kg/day in children, 500mg TID in adults. High-dose amoxicillin overcomes intermediate pneumococcal resistance." }
    ],
    pearls: [
      "Weber and Rinne tests together can differentiate CHL from SNHL at the bedside: Weber lateralizing to affected ear + negative Rinne = CHL; Weber to unaffected ear + positive Rinne = SNHL",
      "Sudden SNHL (>30 dB over 3 consecutive frequencies within 72 hours) is a medical emergency; initiate oral prednisone within 72 hours for best recovery",
      "Ototoxicity from aminoglycosides is dose-dependent and often irreversible; once-daily dosing and peak/trough monitoring reduce risk",
      "Asymmetric SNHL should raise suspicion for acoustic neuroma (vestibular schwannoma) and warrants MRI with contrast",
      "Hearing loss is independently associated with cognitive decline, dementia, depression, and social isolation; early intervention improves outcomes"
    ],
    quiz: [
      { question: "On Weber test, sound lateralizes to the left ear. Rinne test shows bone conduction greater than air conduction on the left. What type of hearing loss does the left ear have?", options: ["Sensorineural hearing loss", "Conductive hearing loss", "Mixed hearing loss", "Central hearing loss"], correct: 1, rationale: "Weber lateralizing to the affected ear combined with negative Rinne (BC > AC) on that same ear indicates conductive hearing loss. Sound is heard better through bone because the conductive pathway is impaired." },
      { question: "A 45-year-old presents with sudden unilateral hearing loss, tinnitus, and aural fullness that started 24 hours ago. What is the priority action?", options: ["Reassure and schedule follow-up in 2 weeks", "Perform cerumen irrigation", "Initiate oral prednisone and urgent ENT referral", "Order CT scan of the head"], correct: 2, rationale: "Sudden sensorineural hearing loss is a medical emergency. Oral steroids should be initiated within 72 hours, and urgent ENT referral is needed for audiometric confirmation and possible intratympanic steroid injection." },
      { question: "Which medication class requires baseline audiometry before starting treatment?", options: ["Beta-lactam antibiotics", "Aminoglycosides", "ACE inhibitors", "Proton pump inhibitors"], correct: 1, rationale: "Aminoglycosides are ototoxic, causing irreversible cochlear hair cell damage. Baseline and serial audiometry is recommended to detect early high-frequency hearing loss before it progresses to clinically significant impairment." }
    ]
  },

  "hearing-loss-differential-np": {
    title: "Hearing Loss — Conductive vs Sensorineural",
    cellular: {
      title: "Auditory Pathophysiology",
      content: "Hearing loss classification requires understanding of the anatomic site of pathology. Conductive hearing loss (CHL) involves the external ear canal, tympanic membrane, ossicular chain, or middle ear space. Otosclerosis involves abnormal bone remodeling at the oval window with stapes footplate fixation, creating a mechanical impedance to sound transmission. Cholesteatoma is a keratinizing squamous epithelium in the middle ear that erodes ossicles and can extend into the mastoid. Sensorineural hearing loss (SNHL) involves cochlear or retrocochlear pathology. Presbycusis reflects age-related loss of outer hair cells, stria vascularis atrophy, and spiral ganglion degeneration, typically producing bilateral symmetric high-frequency loss. Noise-induced hearing loss involves mechanical destruction of stereocilia and metabolic exhaustion of hair cells, characteristically producing a 4 kHz audiometric notch. Aminoglycoside ototoxicity targets cochlear outer hair cells via mitochondrial dysfunction and reactive oxygen species generation; damage begins at the cochlear base (high frequencies) and progresses apically. Cisplatin generates ROS in stria vascularis and outer hair cells. Loop diuretics alter the endocochlear potential by disrupting potassium recycling in the stria vascularis. Mixed hearing loss involves both conductive and sensorineural components. The clinician must order and interpret audiometric data, prescribe targeted treatments, manage ototoxicity protocols, differentiate peripheral from central causes, and coordinate surgical and rehabilitation referrals."
    },
    riskFactors: [
      "Occupational noise exposure >85 dB (construction, military, music industry)",
      "Ototoxic medication use: aminoglycosides (dose-dependent, irreversible), cisplatin, loop diuretics (usually reversible), high-dose salicylates",
      "Presbycusis: universal with aging, accelerated by noise exposure and cardiovascular risk factors",
      "Otosclerosis: autosomal dominant with variable penetrance, most common in Caucasian females",
      "Meniere disease: endolymphatic hydrops causing fluctuating low-frequency SNHL",
      "Acoustic neuroma (vestibular schwannoma): unilateral progressive SNHL with poor speech discrimination",
      "Genetic: connexin 26 (GJB2) mutations — most common cause of congenital non-syndromic SNHL",
      "Autoimmune inner ear disease: bilateral progressive SNHL responsive to corticosteroids"
    ],
    diagnostics: [
      "Order comprehensive audiometric evaluation: pure tone audiometry (air and bone conduction), speech reception threshold (SRT), word recognition score (WRS)",
      "Interpret audiogram patterns: flat loss (Meniere), high-frequency sloping (presbycusis), 4 kHz notch (noise-induced), low-frequency loss (early Meniere)",
      "Order tympanometry: Type A (normal), Type B (effusion/perforation), Type C (eustachian tube dysfunction), Type As (otosclerosis — reduced compliance)",
      "Order acoustic reflex testing: absent ipsilateral reflex with CHL; absent contralateral reflex raises retrocochlear concern",
      "Order MRI with gadolinium of internal auditory canals for asymmetric SNHL (rule out acoustic neuroma)",
      "Order CT temporal bones for suspected cholesteatoma, otosclerosis, or traumatic injury",
      "Order otoacoustic emissions (OAE) testing to differentiate cochlear from retrocochlear pathology",
      "Order ABR (auditory brainstem response) for suspected retrocochlear lesion or in patients who cannot perform behavioral audiometry"
    ],
    management: [
      "Prescribe oral prednisone 60mg daily x 7-14 days with taper for sudden SNHL (within 72 hours of onset)",
      "Order intratympanic dexamethasone (10-24 mg/mL) as salvage for sudden SNHL failing oral steroids",
      "Prescribe appropriate antibiotics for acute otitis media: high-dose amoxicillin 80-90 mg/kg/day first-line",
      "Prescribe topical otic preparations for otitis externa: ciprofloxacin/dexamethasone, ofloxacin",
      "Refer for stapedotomy for confirmed otosclerosis with significant conductive hearing loss",
      "Refer for cochlear implant evaluation when bilateral severe-to-profound SNHL shows limited benefit from hearing aids (WRS <50%)",
      "Implement ototoxicity monitoring protocol: baseline audiometry, extended high-frequency monitoring, monthly assessment during treatment",
      "Prescribe hearing aids through audiology referral for stable mild-to-moderate hearing loss"
    ],
    nursingActions: [
      "Develop systematic differential diagnosis approach using history, otoscopy, tuning fork tests, and audiometric data",
      "Interpret complete audiometric profiles including pure tone thresholds, speech testing, tympanometry, and acoustic reflexes",
      "Prescribe and manage steroid protocols for sudden SNHL and autoimmune inner ear disease",
      "Order and interpret imaging (MRI, CT) for concerning audiometric patterns",
      "Manage ototoxicity prevention: once-daily aminoglycoside dosing, peak/trough monitoring, drug level-guided adjustments",
      "Coordinate ENT referral for surgical candidates: stapedotomy, tympanoplasty, cholesteatoma excision, cochlear implantation",
      "Screen for cognitive decline and depression in elderly patients with hearing loss",
      "Prescribe vestibular rehabilitation for patients with hearing loss and concurrent vestibular dysfunction"
    ],
    signs: {
      left: [
        "CHL audiogram: air-bone gap >10 dB with normal bone conduction",
        "Otosclerosis: Carhart notch (dip at 2 kHz on bone conduction), Type As tympanogram",
        "Cholesteatoma: pearly white mass behind retracted TM, may have foul-smelling drainage",
        "TM perforation: visible defect, conductive loss proportional to perforation size",
        "Otitis media with effusion: amber or bluish TM, air-fluid level, Type B tympanogram",
        "CHL typically preserves speech discrimination (WRS near 100%)"
      ],
      right: [
        "SNHL audiogram: no air-bone gap, both air and bone thresholds equally depressed",
        "Presbycusis: bilateral symmetric high-frequency sloping loss",
        "Noise-induced: classic 4 kHz notch with recovery at 8 kHz",
        "Acoustic neuroma: unilateral progressive SNHL with disproportionately poor WRS (rollover phenomenon)",
        "Meniere: unilateral fluctuating low-frequency SNHL with aural fullness and episodic vertigo",
        "Ototoxicity: bilateral symmetric high-frequency loss, may progress to include speech frequencies"
      ]
    },
    medications: [
      { name: "Prednisone (Oral)", type: "Systemic corticosteroid", action: "Reduces cochlear inflammation, restores microcirculation, and modulates immune-mediated damage in sudden SNHL and autoimmune inner ear disease", sideEffects: "Hyperglycemia, insomnia, mood lability, GI upset, adrenal suppression with prolonged use", contra: "Active systemic fungal infection, uncontrolled diabetes, active peptic ulcer", pearl: "Standard sudden SNHL protocol: 60mg daily (or 1mg/kg) x 7 days, then taper over 7 days. Must begin within 72 hours. Recovery rate ~65% with treatment vs ~30% spontaneous. Consider intratympanic if systemic steroids are contraindicated." },
      { name: "Intratympanic Dexamethasone", type: "Local corticosteroid injection", action: "Delivers high-concentration steroid directly to the round window membrane for cochlear absorption via aquaporin channels, achieving high perilymphatic concentration with minimal systemic effects", sideEffects: "Transient vertigo, otalgia, tympanic membrane perforation (1-2%), temporary taste disturbance", contra: "Active middle ear infection, patient unable to remain supine for 30 minutes post-injection", pearl: "0.4-0.5 mL of 10-24 mg/mL dexamethasone injected through TM. Three to four sessions over 2 weeks. Primary salvage therapy for sudden SNHL. Also used as primary therapy in patients with diabetes or other steroid contraindications." },
      { name: "Sodium Fluoride", type: "Bone metabolism modifier", action: "Inhibits otospongiotic bone remodeling in otosclerosis by replacing hydroxyl ions in hydroxyapatite crystals, stabilizing bone structure around the oval window", sideEffects: "GI upset, arthralgia, skeletal fluorosis with chronic high-dose use", contra: "Pregnancy, renal insufficiency, known fluoride hypersensitivity", pearl: "20mg daily for otosclerosis may slow disease progression. Evidence is limited but supported by some case series. Primarily used as adjunct when surgery is declined or contraindicated. Monitor for GI effects." },
      { name: "Betahistine", type: "Histamine analog", action: "Weak H1 agonist and strong H3 antagonist; improves inner ear microcirculation, reduces endolymphatic pressure, and modulates vestibular nerve firing", sideEffects: "Headache, nausea, GI upset, rare: skin reactions", contra: "Pheochromocytoma, active peptic ulcer disease", pearl: "16-24mg TID for Meniere disease with hearing loss and vertigo. May stabilize hearing fluctuations by reducing endolymphatic hydrops. Available in Canada (not FDA-approved in US). Titrate to response." }
    ],
    pearls: [
      "Asymmetric SNHL (>15 dB difference between ears at 2+ frequencies) warrants MRI to rule out acoustic neuroma; incidence is 1 per 100,000 but consequences of missed diagnosis are significant",
      "The Carhart notch (apparent bone conduction dip at 2 kHz) in otosclerosis is an artifact that resolves after successful stapedotomy",
      "Cochlear implant candidacy: bilateral severe-to-profound SNHL with WRS <50% in best-aided condition; no age upper limit; assessment by implant team required",
      "Aminoglycoside ototoxicity: once-daily dosing with peak/trough monitoring reduces risk compared to traditional divided dosing; damage is cumulative and irreversible",
      "Hearing loss is the third most common chronic condition in older adults and is independently associated with a 30-40% accelerated rate of cognitive decline (Lancet Commission on Dementia)"
    ],
    quiz: [
      { question: "An audiogram shows bilateral symmetric hearing loss with air-bone gap, Type As tympanograms, and a dip at 2 kHz on bone conduction. What is the most likely diagnosis?", options: ["Presbycusis", "Otosclerosis", "Acoustic neuroma", "Noise-induced hearing loss"], correct: 1, rationale: "Bilateral conductive hearing loss with reduced tympanometric compliance (Type As) and Carhart notch at 2 kHz is classic for otosclerosis (stapes fixation). Stapedotomy is the definitive treatment." },
      { question: "A patient presents with sudden unilateral hearing loss, vertigo, and poor word recognition score (WRS 28%). What imaging study is most appropriate?", options: ["CT head without contrast", "MRI of internal auditory canals with gadolinium", "Carotid duplex ultrasound", "PET scan"], correct: 1, rationale: "Sudden unilateral SNHL with disproportionately poor word recognition raises concern for retrocochlear pathology (acoustic neuroma/vestibular schwannoma). MRI with gadolinium of the internal auditory canals is the gold standard for evaluation." },
      { question: "Which ototoxicity monitoring approach is most effective for patients on aminoglycosides?", options: ["Annual audiometry after treatment completion", "Baseline audiometry before treatment, then serial extended high-frequency monitoring during treatment", "Whisper test before each dose", "No monitoring needed if treatment is less than 14 days"], correct: 1, rationale: "Ototoxicity monitoring requires baseline audiometry and serial extended high-frequency testing (>8 kHz) during treatment, as damage begins at frequencies above the standard speech range and can be detected early before progressing to clinically significant hearing loss." }
    ]
  }
};
