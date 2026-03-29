import type { LessonContent } from "./types";

export const rpnPathoStressMetabolismLessons: Record<string, LessonContent> = {
  "rpn-hpa-axis": {
    title: "HPA Axis (Hypothalamic-Pituitary-Adrenal Axis)",
    cellular: {
      title: "Neuroendocrine Stress Response Pathway",
      content: "The hypothalamic-pituitary-adrenal (HPA) axis is the primary neuroendocrine stress response system, coordinating the body's physiological adaptation to physical and psychological stressors. Understanding this axis is fundamental to nursing care because its dysregulation underlies numerous clinical conditions. The cascade begins in the hypothalamus, where paraventricular nucleus (PVN) neurons detect stress signals from multiple inputs: ascending brainstem pathways (physical stressors like pain, hypoglycemia, hemorrhage), limbic system inputs (emotional stressors mediated by the amygdala and hippocampus), and circulating inflammatory cytokines (infection-related stress). In response, PVN neurons secrete corticotropin-releasing hormone (CRH) and arginine vasopressin (AVP) into the hypophyseal portal system — a specialized capillary network connecting the hypothalamus to the anterior pituitary gland. CRH binds to CRH-R1 receptors on corticotroph cells of the anterior pituitary, activating a Gs-protein-adenylate cyclase-cAMP-PKA signaling cascade. PKA phosphorylates the transcription factor CREB, which drives transcription of proopiomelanocortin (POMC), the precursor protein that is proteolytically cleaved to produce adrenocorticotropic hormone (ACTH, also called corticotropin) and beta-endorphin. ACTH enters the systemic circulation and binds to melanocortin-2 receptors (MC2R) on cells of the adrenal cortex zona fasciculata, stimulating cholesterol uptake (via StAR protein), cholesterol transport into mitochondria, and sequential enzymatic conversion through the steroidogenic pathway to produce cortisol. Cortisol — the primary glucocorticoid in humans — then acts on virtually every tissue by binding intracellular glucocorticoid receptors (GRs), which translocate to the nucleus and modulate transcription of hundreds of genes. Critically, cortisol exerts negative feedback at both the hypothalamus (suppressing CRH) and pituitary (suppressing ACTH), completing the feedback loop. The HPA axis also follows a circadian rhythm: cortisol peaks in the early morning (6-8 AM, preparing the body for the day's demands) and reaches its nadir around midnight. Chronic stress disrupts this elegant system — sustained CRH/ACTH/cortisol elevation leads to HPA axis dysregulation with loss of circadian rhythm, altered feedback sensitivity, and the multisystem effects of chronic cortisol excess seen in conditions ranging from metabolic syndrome to depression."
    },
    riskFactors: [
      "Chronic psychological stress (workplace stress, caregiving, PTSD)",
      "Chronic pain conditions",
      "Sleep deprivation or shift work (disrupts circadian cortisol rhythm)",
      "Childhood adversity (ACEs — adverse childhood experiences permanently alter HPA axis programming)",
      "Depression and anxiety disorders",
      "Chronic inflammatory conditions",
      "Exogenous steroid administration (suppresses axis function)",
      "Critical illness (altered cortisol metabolism and receptor sensitivity)"
    ],
    diagnostics: [
      "Morning cortisol level (8 AM — should be at circadian peak; low suggests adrenal insufficiency)",
      "ACTH level (differentiates primary adrenal failure from pituitary/hypothalamic causes)",
      "24-hour urine free cortisol (assesses overall cortisol production)",
      "Late-night salivary cortisol (elevated suggests loss of circadian rhythm — Cushing screening)",
      "ACTH stimulation test (cosyntropin test — evaluates adrenal reserve)",
      "Dexamethasone suppression test (evaluates feedback integrity — used in Cushing screening)"
    ],
    management: [
      "Stress management interventions: mindfulness, cognitive behavioral therapy, relaxation techniques",
      "Sleep hygiene education and circadian rhythm restoration",
      "If HPA suppression from chronic steroids: gradual taper, stress dosing education",
      "Cortisol replacement if adrenal insufficiency confirmed (hydrocortisone, mimicking circadian pattern)",
      "Treatment of underlying conditions driving HPA dysregulation",
      "Exercise (moderate — improves HPA axis regulation; excessive exercise can dysregulate it)"
    ],
    nursingActions: [
      "Assess for signs of cortisol excess (Cushing features) or deficiency (Addison features)",
      "Monitor blood glucose (cortisol raises glucose through gluconeogenesis)",
      "Educate patients on chronic steroids about HPA suppression and stress dosing",
      "Implement stress reduction strategies: provide calm environment, therapeutic communication, pain management",
      "Assess sleep patterns and educate on sleep hygiene",
      "Monitor blood pressure (cortisol affects vascular tone and sodium retention)",
      "Educate on the physiological basis of stress symptoms — understanding reduces anxiety",
      "For critically ill patients: assess for relative adrenal insufficiency (refractory hypotension despite fluids/vasopressors)"
    ],
    assessmentFindings: [
      "Cortisol excess: hyperglycemia, hypertension, weight gain (central), moon facies, fragile skin, muscle weakness, immunosuppression",
      "Cortisol deficiency: hypotension, hypoglycemia, fatigue, weakness, weight loss, hyperpigmentation (if ACTH elevated)",
      "Chronic stress: fatigue, sleep disturbance, cognitive impairment, mood changes, frequent illness",
      "Loss of circadian cortisol rhythm: insomnia, daytime fatigue, difficulty waking"
    ],
    signs: {
      left: ["Excess: hyperglycemia", "Excess: hypertension", "Excess: central obesity", "Excess: immunosuppression"],
      right: ["Deficiency: hypotension", "Deficiency: hypoglycemia", "Deficiency: fatigue", "Deficiency: hyperpigmentation"]
    },
    medications: [
      { name: "Hydrocortisone (Cortef)", type: "Glucocorticoid Replacement", action: "Physiological cortisol replacement mimicking natural circadian rhythm — highest dose in morning, lower in afternoon", sideEffects: "Cushingoid features if over-replaced, hyperglycemia, osteoporosis with long-term use", contra: "Untreated systemic infection", pearl: "For adrenal insufficiency: give 2/3 of daily dose in AM and 1/3 in early afternoon to mimic circadian pattern. STRESS DOSING: double or triple during illness/surgery — the suppressed adrenals cannot mount a stress response." },
      { name: "Prednisone", type: "Synthetic Glucocorticoid", action: "Potent anti-inflammatory and immunosuppressive; suppresses HPA axis with chronic use through negative feedback", sideEffects: "HPA axis suppression, osteoporosis, hyperglycemia, immunosuppression, cushingoid features, mood changes", contra: "Active untreated infections, live vaccines", pearl: "Chronic use (>2-3 weeks) SUPPRESSES the HPA axis — adrenals atrophy. NEVER stop abruptly — must taper. Patients need medical alert identification and stress dosing education." }
    ],
    pearls: [
      "The HPA axis is the body's 'stress thermostat' — CRH → ACTH → cortisol → negative feedback loop",
      "Morning cortisol (8 AM) is the single best screening test for HPA axis function — low morning cortisol = concerning",
      "Chronic steroid use suppresses the HPA axis — the adrenals ATROPHY. Abrupt discontinuation = adrenal crisis",
      "Adverse childhood experiences (ACEs) permanently alter HPA axis programming, increasing lifelong disease risk",
      "Cortisol follows a circadian rhythm: peaks at 6-8 AM, nadir at midnight — loss of this rhythm is pathological",
      "Stress dosing means doubling or tripling cortisol replacement during physiological stress — teach this to every patient with adrenal insufficiency"
    ],
    quiz: [
      { question: "A client has been taking prednisone 20 mg daily for 6 months. Why is abrupt discontinuation dangerous?", options: ["Prednisone causes physical dependence like opioids", "Chronic exogenous steroids suppress the HPA axis — the atrophied adrenals cannot produce adequate cortisol when the drug is stopped, risking adrenal crisis", "The underlying condition will return immediately", "There are no risks to stopping prednisone abruptly"], correct: 1, rationale: "Chronic exogenous glucocorticoid administration provides negative feedback to the hypothalamus and pituitary, suppressing CRH and ACTH secretion. Without ACTH stimulation, the adrenal cortex atrophies. If the exogenous steroid is stopped abruptly, the atrophied adrenals cannot produce adequate cortisol, resulting in acute adrenal insufficiency (adrenal crisis) — a life-threatening emergency." },
      { question: "At what time of day should a nurse expect the cortisol level to be highest in a healthy person?", options: ["Midnight", "Early morning (6-8 AM)", "Late afternoon", "After lunch"], correct: 1, rationale: "Cortisol follows a circadian rhythm with peak levels in the early morning (6-8 AM), preparing the body for the metabolic demands of the waking day. Levels gradually decline throughout the day, reaching their lowest point (nadir) around midnight. Loss of this circadian pattern is seen in Cushing syndrome and chronic stress." }
    ]
  },

  "rpn-chronic-stress-response": {
    title: "Chronic Stress Response",
    cellular: {
      title: "Allostatic Overload and Systemic Disease",
      content: "The chronic stress response represents a state of sustained physiological activation where the body's adaptive stress systems — designed for acute, time-limited threats — become maladaptive when chronically activated, leading to progressive multisystem damage termed allostatic overload. The concept of allostasis (stability through change) describes how the body adapts to stressors by activating the HPA axis, sympathetic nervous system (SNS), and immune system. Allostatic load is the cumulative physiological cost of this adaptation over time. Allostatic overload occurs when the allostatic load exceeds the body's capacity to cope, causing tissue damage and disease. Chronic stress produces sustained elevation of cortisol and catecholamines (norepinephrine, epinephrine). Chronically elevated cortisol has widespread pathological effects: in the cardiovascular system, it promotes endothelial dysfunction, accelerates atherosclerosis, causes hypertension through sodium retention and increased vascular reactivity to catecholamines; in metabolism, it promotes visceral fat deposition (cortisol preferentially activates lipoprotein lipase in visceral adipocytes), insulin resistance, and hepatic gluconeogenesis, contributing to metabolic syndrome and type 2 diabetes; in the immune system, chronic cortisol initially suppresses inflammatory responses but paradoxically leads to glucocorticoid resistance (immune cells downregulate GR expression), resulting in chronic low-grade inflammation with elevated IL-6, TNF-α, and CRP; in the brain, chronic cortisol causes hippocampal dendritic atrophy (impairing memory and further disrupting HPA feedback), amygdala hypertrophy (increasing fear and anxiety responses), and prefrontal cortex thinning (reducing executive function and emotional regulation). The sympathetic nervous system remains chronically activated, maintaining elevated heart rate, blood pressure, and a prothrombotic state. At the cellular level, chronic stress accelerates biological aging through telomere shortening — telomerase activity is reduced by chronic cortisol exposure, and oxidative stress from chronic inflammation damages telomeric DNA. This molecular mechanism explains why chronic stress is associated with premature aging and age-related diseases."
    },
    riskFactors: [
      "Chronic psychosocial stress (poverty, discrimination, workplace bullying, caregiving burden)",
      "Adverse childhood experiences (ACEs) — dose-response relationship with adult disease",
      "Post-traumatic stress disorder (PTSD)",
      "Social isolation and loneliness",
      "Shift work and chronic sleep deprivation",
      "Chronic pain syndromes",
      "Food insecurity and socioeconomic disadvantage",
      "Minority stress (discrimination-related chronic stress)"
    ],
    diagnostics: [
      "Cortisol awakening response (CAR) — blunted in chronic stress",
      "Diurnal cortisol pattern (loss of circadian variation suggests chronic HPA dysregulation)",
      "Inflammatory markers: CRP, IL-6 (chronically elevated in chronic stress)",
      "HbA1c and fasting glucose (insulin resistance screening)",
      "Lipid panel (dyslipidemia from cortisol-mediated metabolic changes)",
      "Blood pressure monitoring (chronic stress-related hypertension)",
      "Validated stress and mental health screening tools (PHQ-9, GAD-7, perceived stress scale)"
    ],
    management: [
      "Cognitive behavioral therapy (CBT) — strongest evidence base for stress management",
      "Mindfulness-based stress reduction (MBSR) — demonstrated cortisol reduction in studies",
      "Regular moderate exercise (150 min/week) — normalizes HPA axis, reduces inflammatory markers",
      "Sleep optimization: sleep hygiene education, treat sleep disorders",
      "Social support strengthening — strong social connections buffer stress effects",
      "Address modifiable social determinants of health",
      "Treat comorbid conditions: depression, anxiety, metabolic syndrome",
      "Relaxation techniques: deep breathing, progressive muscle relaxation, guided imagery"
    ],
    nursingActions: [
      "Assess for chronic stress using validated screening tools and therapeutic communication",
      "Screen for ACEs and social determinants of health — upstream factors driving chronic stress",
      "Teach evidence-based stress reduction techniques: deep breathing, progressive muscle relaxation",
      "Educate on the physiological effects of chronic stress — understanding empowers patients to take action",
      "Encourage regular physical activity — tailor recommendations to patient's abilities and preferences",
      "Assess sleep patterns and teach sleep hygiene strategies",
      "Monitor for stress-related conditions: hypertension, hyperglycemia, depression, frequent infections",
      "Refer to appropriate resources: counseling, social services, support groups",
      "Model and practice therapeutic communication — the nurse-patient interaction itself can reduce stress"
    ],
    assessmentFindings: [
      "Cardiovascular: hypertension, tachycardia, increased cardiovascular disease risk",
      "Metabolic: weight gain (particularly visceral/abdominal), insulin resistance, dyslipidemia",
      "Immune: frequent infections, slow wound healing, chronic inflammatory conditions",
      "Neurological: insomnia, impaired concentration and memory, headaches",
      "Psychological: anxiety, depression, irritability, emotional exhaustion",
      "Musculoskeletal: chronic tension, pain, fibromyalgia-like symptoms",
      "GI: irritable bowel symptoms, appetite changes"
    ],
    signs: {
      left: ["Hypertension", "Central obesity", "Insomnia", "Frequent illness"],
      right: ["Depression/anxiety", "Cognitive impairment", "Chronic pain", "Elevated CRP/IL-6"]
    },
    medications: [
      { name: "Sertraline (SSRI)", type: "Selective Serotonin Reuptake Inhibitor", action: "Increases serotonin availability in synaptic cleft; normalizes HPA axis reactivity and reduces stress-related anxiety and depression", sideEffects: "GI upset, sexual dysfunction, insomnia or somnolence, serotonin syndrome risk", contra: "Concurrent MAOIs, QT prolongation", pearl: "SSRIs help normalize HPA axis dysfunction associated with chronic stress and are first-line for stress-related depression/anxiety. Takes 4-6 weeks for full effect. Do not stop abruptly — taper to avoid discontinuation syndrome." },
      { name: "Melatonin", type: "Circadian Rhythm Regulator", action: "Exogenous melatonin helps restore circadian rhythm disrupted by chronic stress, improving sleep onset and sleep quality", sideEffects: "Drowsiness, headache, dizziness", contra: "Autoimmune conditions (theoretical immunostimulatory effect)", pearl: "Take 30-60 minutes before desired bedtime. Helps restore sleep in stress-disrupted circadian rhythm. Lower doses (0.5-3 mg) are often more effective than higher doses." }
    ],
    pearls: [
      "Chronic stress is not just 'in your head' — it produces measurable physiological damage through HPA/SNS dysregulation and chronic inflammation",
      "ACEs (adverse childhood experiences) have a DOSE-RESPONSE relationship with adult disease — more ACEs = higher risk of heart disease, diabetes, depression, substance use",
      "Chronic stress accelerates biological aging through telomere shortening — stressed individuals have telomere lengths 9-17 years older than chronological age",
      "Exercise is a POWERFUL stress intervention — normalizes cortisol, reduces inflammation, improves sleep, and boosts neuroplasticity",
      "Social support is one of the strongest buffers against chronic stress effects — isolation is a major risk factor",
      "Nursing itself is a high-stress profession — nurses must practice self-care to avoid burnout and secondary traumatic stress"
    ],
    quiz: [
      { question: "A client reports chronic work stress, weight gain around the middle, difficulty sleeping, and frequent colds. These findings are most consistent with:", options: ["Acute stress reaction", "Chronic stress-related allostatic overload with HPA axis dysregulation", "Normal aging", "Hypothyroidism"], correct: 1, rationale: "This constellation of symptoms — central obesity (cortisol-driven visceral fat deposition), insomnia (HPA axis disruption of circadian rhythm), and frequent infections (cortisol-mediated immunosuppression) — is classic for chronic stress-related allostatic overload. While hypothyroidism shares some features, the stress history and specific pattern points to chronic HPA axis activation." }
    ]
  },

  "rpn-metabolic-syndrome": {
    title: "Metabolic Syndrome",
    cellular: {
      title: "Insulin Resistance and Cardiometabolic Risk Clustering",
      content: "Metabolic syndrome is a cluster of interconnected cardiometabolic risk factors that together dramatically increase the risk of cardiovascular disease (2-3 fold), type 2 diabetes (5-fold), and all-cause mortality. The diagnosis requires at least 3 of 5 criteria: elevated waist circumference (≥102 cm men, ≥88 cm women), elevated triglycerides (≥1.7 mmol/L), reduced HDL cholesterol (<1.0 mmol/L men, <1.3 mmol/L women), elevated blood pressure (≥130/85 mmHg), and elevated fasting glucose (≥5.6 mmol/L). The unifying pathophysiological mechanism is insulin resistance, driven primarily by visceral adiposity. Visceral (intra-abdominal) adipose tissue is metabolically distinct from subcutaneous fat — it is highly lipolytic, draining free fatty acids (FFAs) directly into the portal circulation to the liver, and it functions as an endocrine organ producing adipokines that promote inflammation and insulin resistance. Specifically, visceral adipocytes produce excess TNF-α and IL-6 (promoting systemic inflammation), resistin (increasing insulin resistance), and reduced adiponectin (which normally enhances insulin sensitivity and has anti-inflammatory properties). The excess FFAs delivered to the liver promote hepatic insulin resistance, increase very-low-density lipoprotein (VLDL) production (elevating triglycerides), decrease HDL production, and promote hepatic glucose output (contributing to hyperglycemia). In skeletal muscle, FFAs accumulate as intramyocellular lipids that activate protein kinase C and IKK-β, which serine-phosphorylate IRS-1, blocking insulin signaling and GLUT4 translocation — the molecular basis of peripheral insulin resistance. The chronic low-grade inflammation (elevated CRP, IL-6, TNF-α) promotes endothelial dysfunction, accelerated atherosclerosis, and a prothrombotic state (elevated PAI-1 and fibrinogen). Hypertension results from multiple mechanisms: insulin-mediated sodium retention, sympathetic nervous system activation, endothelial dysfunction (reduced nitric oxide bioavailability), and RAAS activation. This clustering of metabolic abnormalities creates a 'perfect storm' for cardiovascular events."
    },
    riskFactors: [
      "Visceral (abdominal) obesity (STRONGEST predictor)",
      "Physical inactivity",
      "High-calorie, high-refined-carbohydrate diet",
      "Genetics (family history of T2DM, CVD)",
      "Age >40 years",
      "Ethnicity (higher prevalence in Indigenous, South Asian, Hispanic populations)",
      "Polycystic ovary syndrome (PCOS)",
      "Chronic stress (cortisol promotes visceral fat deposition)",
      "Sleep apnea and chronic sleep deprivation",
      "Smoking"
    ],
    diagnostics: [
      "Waist circumference measurement (most practical screening tool — tape at iliac crest level)",
      "Fasting lipid panel: triglycerides ≥1.7 mmol/L, HDL <1.0 (men)/<1.3 (women) mmol/L",
      "Fasting plasma glucose: ≥5.6 mmol/L (or HbA1c ≥5.7%)",
      "Blood pressure measurement: ≥130/85 mmHg",
      "BMI and body composition assessment",
      "Fasting insulin and HOMA-IR (Homeostatic Model Assessment of Insulin Resistance) — research/specialty use",
      "CRP (marker of chronic inflammation associated with metabolic syndrome)"
    ],
    management: [
      "Lifestyle modification is FIRST-LINE and MOST EFFECTIVE: diet, exercise, weight loss",
      "Weight loss of 5-10% significantly improves ALL metabolic syndrome components",
      "Diet: Mediterranean or DASH diet, limit refined carbohydrates and added sugars, increase fiber",
      "Exercise: 150 min/week moderate-intensity aerobic + resistance training 2-3 days/week",
      "Treat individual components: statins for dyslipidemia, antihypertensives for BP, metformin for prediabetes/T2DM",
      "Smoking cessation",
      "Screen for and treat obstructive sleep apnea (common comorbidity)",
      "Address psychosocial factors: stress, depression, disordered eating"
    ],
    nursingActions: [
      "Measure waist circumference correctly (at iliac crest, end of normal expiration, tape parallel to floor)",
      "Assess ALL five metabolic syndrome criteria at health assessments",
      "Provide lifestyle counseling: realistic goals for diet, exercise, and weight loss",
      "Teach about the relationship between visceral fat and health risks — waist circumference is more important than BMI",
      "Monitor blood pressure, blood glucose, and lipid levels as prescribed",
      "Encourage referral to dietitian for individualized meal planning",
      "Support behavior change using motivational interviewing techniques",
      "Screen for depression and disordered eating (common comorbidities that undermine lifestyle changes)"
    ],
    assessmentFindings: [
      "Increased waist circumference (apple-shaped body habitus)",
      "Elevated blood pressure (≥130/85 mmHg)",
      "Acanthosis nigricans (dark velvety skin patches — marker of insulin resistance)",
      "Skin tags (associated with insulin resistance)",
      "Elevated triglycerides and low HDL on lipid panel",
      "Elevated fasting glucose or HbA1c in prediabetic range"
    ],
    signs: {
      left: ["Increased waist circumference", "Elevated BP (≥130/85)", "Elevated triglycerides", "Low HDL"],
      right: ["Elevated fasting glucose", "Acanthosis nigricans", "Skin tags", "Central/visceral obesity"]
    },
    medications: [
      { name: "Metformin", type: "Biguanide (Diabetes Prevention/Treatment)", action: "Reduces hepatic glucose production, improves insulin sensitivity, decreases intestinal glucose absorption", sideEffects: "GI upset, lactic acidosis (rare), vitamin B12 deficiency", contra: "eGFR <30, liver disease, conditions predisposing to lactic acidosis", pearl: "Indicated for prediabetes with metabolic syndrome when lifestyle changes insufficient. Reduces progression from prediabetes to T2DM by 31%. Does NOT cause hypoglycemia alone." },
      { name: "Rosuvastatin", type: "HMG-CoA Reductase Inhibitor (Statin)", action: "Inhibits hepatic cholesterol synthesis, upregulates LDL receptors, reduces LDL and triglycerides, modestly raises HDL", sideEffects: "Myalgia, elevated liver enzymes, rhabdomyolysis (rare), new-onset diabetes (modest risk)", contra: "Active liver disease, pregnancy", pearl: "Most potent statin for LDL and triglyceride reduction. The cardiovascular risk reduction from statins is greater than the modest increase in diabetes risk — net benefit is overwhelmingly positive." }
    ],
    pearls: [
      "Metabolic syndrome is diagnosed by ANY 3 of 5 criteria — no single component defines it",
      "Waist circumference is a BETTER predictor of metabolic risk than BMI — a 'normal' BMI person can have metabolic syndrome if visceral fat is excessive",
      "5-10% weight loss improves ALL components of metabolic syndrome — set realistic goals",
      "Lifestyle modification is MORE effective than any single medication for metabolic syndrome",
      "Acanthosis nigricans (dark velvety patches in skin folds) is a clinical marker of insulin resistance — always investigate metabolically",
      "Metabolic syndrome increases cardiovascular risk MORE than the sum of its individual components — the clustering creates synergistic risk"
    ],
    quiz: [
      { question: "A client has a waist circumference of 108 cm, triglycerides 2.1 mmol/L, HDL 0.9 mmol/L, BP 142/88, and fasting glucose 4.8 mmol/L. Does this client meet criteria for metabolic syndrome?", options: ["No — fasting glucose is normal", "Yes — 4 of 5 criteria are met (elevated waist, elevated TG, low HDL, elevated BP)", "Not enough information", "Only if the client is also diabetic"], correct: 1, rationale: "Metabolic syndrome requires 3 of 5 criteria. This client meets 4: elevated waist circumference (≥102 cm for men), elevated triglycerides (≥1.7 mmol/L), reduced HDL (<1.0 mmol/L for men), and elevated BP (≥130/85 mmHg). The normal fasting glucose does not prevent diagnosis when 3+ other criteria are met." }
    ]
  },

  "rpn-obesity-pathophysiology": {
    title: "Obesity Pathophysiology",
    cellular: {
      title: "Energy Imbalance, Adipocyte Biology, and Systemic Inflammation",
      content: "Obesity is a complex chronic disease characterized by excessive adipose tissue accumulation that impairs health, driven by interactions between genetic, environmental, behavioral, and neurohormonal factors far more complex than simple caloric excess. The pathophysiology involves disruption of the body's sophisticated energy homeostasis systems. Energy balance is regulated by the hypothalamic appetite centers (arcuate nucleus) through two opposing neuronal populations: orexigenic neurons producing neuropeptide Y (NPY) and agouti-related peptide (AgRP) that stimulate hunger, and anorexigenic neurons producing pro-opiomelanocortin (POMC) and cocaine-amphetamine-regulated transcript (CART) that promote satiety. These neurons integrate signals from peripheral hormones: leptin (produced by adipocytes in proportion to fat mass — signals energy sufficiency and suppresses appetite by activating POMC neurons and inhibiting NPY/AgRP neurons), ghrelin (produced by the stomach — the 'hunger hormone' that stimulates appetite by activating NPY/AgRP neurons), insulin (signals energy availability), GLP-1 and PYY (gut-derived satiety signals from the ileum and colon after meals), and cholecystokinin (CCK, released from the duodenum in response to fat and protein). In obesity, this regulatory system fails. Despite high circulating leptin levels (produced by abundant fat tissue), leptin resistance develops — the hypothalamus becomes unresponsive to leptin's satiety signal, likely due to impaired leptin receptor signaling and reduced blood-brain barrier transport. This leptin resistance creates a state where the brain perceives starvation despite massive energy excess, driving continued food intake. Adipose tissue in obesity is not inert storage — it becomes inflamed and dysfunctional. Hypertrophied adipocytes (enlarged beyond optimal size) become hypoxic, secrete pro-inflammatory chemokines that recruit macrophages (forming crown-like structures around dying adipocytes), and shift their adipokine profile from anti-inflammatory (reduced adiponectin) to pro-inflammatory (increased TNF-α, IL-6, resistin, MCP-1). This chronic low-grade adipose tissue inflammation is the key link between obesity and its metabolic complications: insulin resistance, type 2 diabetes, cardiovascular disease, non-alcoholic fatty liver disease (NAFLD), and certain cancers. Obesity also creates a state of chronic oxidative stress, endoplasmic reticulum stress, and altered gut microbiome composition, all of which contribute to metabolic dysfunction."
    },
    riskFactors: [
      "Genetic predisposition (heritability of BMI is 40-70% — over 100 genetic loci identified)",
      "Obesogenic environment (highly processed food availability, large portion sizes, food marketing)",
      "Physical inactivity and sedentary behavior",
      "Sleep deprivation (<7 hours — disrupts ghrelin/leptin balance)",
      "Medications: corticosteroids, antipsychotics (olanzapine, clozapine), antidepressants (mirtazapine), anticonvulsants (valproic acid), insulin, sulfonylureas",
      "Endocrine disorders: hypothyroidism, Cushing syndrome, PCOS",
      "Socioeconomic factors: food insecurity, limited access to healthy food and safe exercise spaces",
      "Psychological factors: emotional eating, binge eating disorder, depression, childhood trauma"
    ],
    diagnostics: [
      "BMI calculation: weight (kg) / height (m²) — overweight 25-29.9, obesity class I 30-34.9, class II 35-39.9, class III ≥40",
      "Waist circumference (assesses visceral adiposity — more metabolically relevant than BMI)",
      "Fasting glucose and HbA1c (diabetes screening)",
      "Lipid panel (dyslipidemia screening)",
      "Liver function tests and liver ultrasound (NAFLD screening)",
      "TSH (exclude hypothyroidism as contributing factor)",
      "Sleep study if symptoms suggest obstructive sleep apnea",
      "Screening for depression, binge eating disorder"
    ],
    management: [
      "Comprehensive lifestyle intervention (FIRST-LINE): dietary modification + physical activity + behavioral counseling",
      "Dietary approaches: caloric deficit of 500-750 kcal/day for sustainable weight loss of 0.5-1 kg/week",
      "Physical activity: 150-300 min/week moderate intensity for weight maintenance, >300 min/week for weight loss",
      "Behavioral strategies: self-monitoring, stimulus control, stress management, cognitive restructuring",
      "Anti-obesity medications: semaglutide (GLP-1 RA), liraglutide, orlistat, naltrexone-bupropion for BMI ≥30 or ≥27 with comorbidities",
      "Bariatric surgery: for BMI ≥40 or ≥35 with comorbidities when other approaches have failed",
      "Treat comorbidities: diabetes, hypertension, dyslipidemia, sleep apnea, depression",
      "Address social determinants: food security, access to healthy food, safe exercise environments"
    ],
    nursingActions: [
      "Approach obesity with compassion and without stigma — weight bias in healthcare worsens outcomes",
      "Assess readiness for change using motivational interviewing techniques",
      "Calculate and discuss BMI and waist circumference — but emphasize health metrics over number on the scale",
      "Set realistic goals: 5-10% initial weight loss has significant health benefits",
      "Educate on evidence-based dietary patterns (not restrictive fad diets)",
      "Encourage physical activity that the patient enjoys and can sustain",
      "Screen for eating disorders (binge eating disorder is common and must be treated concurrently)",
      "Monitor for medication-induced weight gain and advocate for weight-neutral alternatives when possible",
      "Assess for and manage comorbidities: diabetes, hypertension, sleep apnea, depression, GERD, OA",
      "Pre/post-bariatric surgery care: nutritional counseling, supplement adherence, complication monitoring"
    ],
    assessmentFindings: [
      "BMI ≥30 kg/m² (obesity), ≥25 (overweight)",
      "Elevated waist circumference (visceral adiposity)",
      "Acanthosis nigricans (insulin resistance marker)",
      "Obstructive sleep apnea symptoms: snoring, daytime somnolence, witnessed apneas",
      "Joint pain (particularly knees, hips — mechanical stress)",
      "GERD symptoms (increased abdominal pressure)",
      "Depression, anxiety, poor body image",
      "Metabolic syndrome components"
    ],
    signs: {
      left: ["BMI ≥30", "Elevated waist circumference", "Acanthosis nigricans", "Sleep apnea symptoms"],
      right: ["Metabolic syndrome features", "Joint pain", "GERD", "Depression/anxiety"]
    },
    medications: [
      { name: "Semaglutide (Wegovy)", type: "GLP-1 Receptor Agonist", action: "Mimics GLP-1 incretin hormone: slows gastric emptying, enhances satiety through hypothalamic appetite centers, promotes insulin secretion and inhibits glucagon", sideEffects: "Nausea (most common — dose-dependent, usually improves with time), vomiting, diarrhea, constipation, pancreatitis (rare), gallstones, thyroid C-cell tumors (in animal studies)", contra: "Personal or family history of medullary thyroid cancer or MEN2 syndrome, history of pancreatitis", pearl: "Achieves 15-17% weight loss in clinical trials — most effective anti-obesity medication available. Start low and titrate slowly to minimize GI side effects. Weekly subcutaneous injection." },
      { name: "Orlistat (Xenical/Alli)", type: "Lipase Inhibitor", action: "Inhibits pancreatic and gastric lipases in the GI tract, preventing hydrolysis and absorption of approximately 30% of dietary fat", sideEffects: "Steatorrhea (oily/fatty stools), fecal urgency, flatulence with discharge, fat-soluble vitamin malabsorption (A, D, E, K)", contra: "Cholestasis, chronic malabsorption syndrome", pearl: "GI side effects are dose-proportional to dietary fat intake — serves as behavioral reinforcement for a low-fat diet. Supplement fat-soluble vitamins. Available OTC as Alli (lower dose)." }
    ],
    pearls: [
      "Obesity is a CHRONIC DISEASE with neurohormonal, genetic, and environmental drivers — NOT simply a lack of willpower",
      "Weight bias in healthcare is harmful — patients who experience weight stigma have WORSE health outcomes, avoid healthcare, and are less likely to engage in healthy behaviors",
      "5-10% weight loss dramatically improves metabolic health: reduces diabetes risk by 58%, improves BP, lipids, inflammation, and joint pain",
      "Leptin resistance explains why obese individuals continue to eat despite abundant fat stores — the brain perceives starvation",
      "Bariatric surgery is the most effective long-term treatment for severe obesity — it also remits type 2 diabetes in 60-80% of cases",
      "Screen for binge eating disorder BEFORE initiating weight management — untreated BED undermines all weight loss efforts"
    ],
    quiz: [
      { question: "A client with BMI of 34 and type 2 diabetes asks about semaglutide. Which response is most appropriate?", options: ["Semaglutide is only for diabetes, not weight management", "Semaglutide is a GLP-1 receptor agonist that can help with both weight loss and glucose control — it achieves significant weight loss by reducing appetite through brain satiety centers", "Diet and exercise are the only appropriate interventions", "Semaglutide replaces the need for lifestyle changes"], correct: 1, rationale: "Semaglutide (Wegovy for obesity, Ozempic for diabetes) is a GLP-1 receptor agonist approved for both weight management and T2DM. It achieves 15-17% weight loss by enhancing hypothalamic satiety signals and slowing gastric emptying. It works best in combination with lifestyle modification, not as a replacement." },
      { question: "Why is addressing weight stigma important in nursing care for patients with obesity?", options: ["Weight stigma motivates patients to lose weight faster", "Weight stigma has no effect on health outcomes", "Weight stigma causes patients to avoid healthcare, reduces treatment adherence, and worsens mental and physical health outcomes", "Only patients who are morbidly obese experience weight stigma"], correct: 2, rationale: "Research consistently shows that weight stigma in healthcare leads to delayed care-seeking, avoidance of preventive screenings, reduced physical activity, increased disordered eating, elevated cortisol (paradoxically promoting weight gain), and worse overall health outcomes. Compassionate, person-centered care improves engagement and results." }
    ]
  }
};
