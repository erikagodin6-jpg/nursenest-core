export interface ConditionFAQ {
  question: string;
  answer: string;
}

export interface ConditionPracticeQuestion {
  question: string;
  options: string[];
  correct: number;
  rationale: string;
}

export interface ConditionPageData {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  keywords: string;
  bodySystem: string;
  icdCode: string;
  overview: string;
  pathophysiology: string;
  clinicalPresentation: {
    earlySignsSymptoms: string[];
    lateSignsSymptoms: string[];
  };
  riskFactors: string[];
  diagnostics: string[];
  medications: {
    name: string;
    drugClass: string;
    mechanism: string;
    sideEffects: string;
    nursingConsiderations: string;
  }[];
  nursingInterventions: string[];
  practiceQuestions: ConditionPracticeQuestion[];
  faq: ConditionFAQ[];
  relatedConditions: string[];
  relatedLessonSlugs: string[];
}

export const seoConditions: ConditionPageData[] = [
  {
    slug: "hypertension",
    name: "Hypertension",
    title: "Hypertension (High Blood Pressure) - Nursing Study Guide",
    metaDescription: "Comprehensive nursing study guide on hypertension: pathophysiology, clinical presentation, diagnostics, medications, nursing interventions, and NCLEX practice questions.",
    keywords: "hypertension nursing, high blood pressure nursing care, HTN pathophysiology, antihypertensive medications, NCLEX hypertension questions",
    bodySystem: "Cardiovascular",
    icdCode: "I10",
    overview: "Hypertension (HTN) is a chronic elevation of systemic arterial blood pressure defined as a sustained systolic blood pressure of 130 mmHg or higher, or a diastolic blood pressure of 80 mmHg or higher (ACC/AHA 2017 guidelines). Often called the 'silent killer,' hypertension is the most prevalent modifiable cardiovascular risk factor worldwide, affecting approximately 1 in 3 adults. Primary (essential) hypertension accounts for 90-95% of cases and has no identifiable cause, while secondary hypertension results from an underlying condition such as renal artery stenosis, pheochromocytoma, or Cushing syndrome.",
    pathophysiology: "Chronic elevation of systemic vascular resistance damages the endothelial lining of arteries, promoting atherosclerosis. Sustained pressure overload forces the left ventricle to hypertrophy concentrically, eventually leading to diastolic dysfunction and heart failure. The renin-angiotensin-aldosterone system (RAAS) plays a central role: juxtaglomerular cells in the kidney release renin in response to decreased renal perfusion, which converts angiotensinogen to angiotensin I. Angiotensin-converting enzyme (ACE) in the lungs converts angiotensin I to angiotensin II, a potent vasoconstrictor that also stimulates aldosterone secretion, promoting sodium and water retention. Over time, elevated pressures cause arteriolar sclerosis, glomerular damage, retinal vessel changes, and accelerated atherosclerosis in coronary and cerebral vessels.",
    clinicalPresentation: {
      earlySignsSymptoms: ["Often asymptomatic (silent killer)", "Mild headache (occipital, morning)", "Fatigue", "Elevated BP readings on routine screening"],
      lateSignsSymptoms: ["Severe headache with visual changes", "Epistaxis (severe)", "Chest pain or dyspnea", "Altered mental status (hypertensive encephalopathy)", "Papilledema on fundoscopic exam"]
    },
    riskFactors: ["Family history of hypertension", "High sodium diet", "Obesity", "Sedentary lifestyle", "Smoking", "Excessive alcohol intake", "Age >55 years", "African American descent", "Diabetes mellitus", "Chronic kidney disease"],
    diagnostics: ["Serial blood pressure measurements to confirm diagnosis (at least 2 readings on 2 separate occasions)", "Basic metabolic panel for renal function (BUN, creatinine)", "Lipid panel", "ECG to assess for left ventricular hypertrophy", "Urinalysis for proteinuria", "Retinal examination for hypertensive retinopathy", "Echocardiogram if heart failure suspected"],
    medications: [
      { name: "Amlodipine", drugClass: "Calcium Channel Blocker", mechanism: "Relaxes vascular smooth muscle to reduce peripheral resistance", sideEffects: "Peripheral edema, dizziness, flushing", nursingConsiderations: "No grapefruit juice; does not require potassium monitoring. Monitor BP and heart rate." },
      { name: "Hydrochlorothiazide", drugClass: "Thiazide Diuretic", mechanism: "Inhibits sodium reabsorption in distal tubule to reduce blood volume", sideEffects: "Hypokalemia, hyperglycemia, hyperuricemia", nursingConsiderations: "Give in morning to avoid nocturia; first-line for uncomplicated HTN. Monitor potassium levels." },
      { name: "Lisinopril", drugClass: "ACE Inhibitor", mechanism: "Blocks conversion of angiotensin I to angiotensin II, reducing vasoconstriction and aldosterone secretion", sideEffects: "Dry cough, hyperkalemia, angioedema", nursingConsiderations: "Monitor potassium and renal function. Contraindicated in pregnancy. Report persistent dry cough." },
      { name: "Metoprolol", drugClass: "Beta-Blocker", mechanism: "Decreases heart rate and cardiac output by blocking beta-1 receptors", sideEffects: "Bradycardia, fatigue, bronchospasm", nursingConsiderations: "Check apical pulse before administration; hold if HR < 60. Never stop abruptly (rebound hypertension/tachycardia)." }
    ],
    nursingInterventions: [
      "Assess blood pressure in both arms at initial visit using correct cuff size",
      "Educate patient on medication adherence and importance of not skipping doses",
      "Teach patient to rise slowly from sitting/lying positions (orthostatic precautions)",
      "Monitor for signs of hypertensive crisis (severe headache, visual changes, chest pain)",
      "Educate about avoiding OTC decongestants and NSAIDs that can elevate BP",
      "Encourage DASH diet (fruits, vegetables, low-fat dairy, reduced sodium)",
      "Promote regular aerobic exercise (150 minutes/week)",
      "Educate on sodium restriction (<2g/day)",
      "Encourage home blood pressure monitoring and log keeping",
      "Assess for end-organ damage symptoms at each visit"
    ],
    practiceQuestions: [
      { question: "A patient on hydrochlorothiazide reports muscle cramps and weakness. What lab should the nurse anticipate?", options: ["Serum calcium", "Serum potassium", "Serum sodium", "Blood glucose"], correct: 1, rationale: "Thiazide diuretics cause potassium wasting. Muscle cramps and weakness are classic signs of hypokalemia." },
      { question: "Which blood pressure classification indicates Stage 1 hypertension per ACC/AHA guidelines?", options: ["120-129/<80 mmHg", "130-139/80-89 mmHg", "140-159/90-99 mmHg", ">180/>120 mmHg"], correct: 1, rationale: "Per the 2017 ACC/AHA guidelines, Stage 1 hypertension is defined as systolic 130-139 mmHg or diastolic 80-89 mmHg." },
      { question: "A patient taking lisinopril develops a persistent dry cough. What should the nurse anticipate?", options: ["Increase the dose", "Switch to an ARB", "Add a cough suppressant", "Discontinue all antihypertensives"], correct: 1, rationale: "Dry cough is a common side effect of ACE inhibitors due to bradykinin accumulation. Switching to an ARB (angiotensin receptor blocker) eliminates this side effect while maintaining RAAS blockade." }
    ],
    faq: [
      { question: "Why is hypertension called the 'silent killer'?", answer: "Most patients with hypertension are completely asymptomatic until significant organ damage has occurred. Damage to the heart, kidneys, brain, and blood vessels can progress silently for years, which is why regular blood pressure screening is essential." },
      { question: "What is the target blood pressure for most adults?", answer: "Per current ACC/AHA guidelines, the blood pressure goal for most adults is less than 130/80 mmHg. For older adults with significant comorbidities, the target may be individualized by the provider." },
      { question: "Can hypertension be cured?", answer: "Primary (essential) hypertension cannot be cured but can be effectively managed through lifestyle modifications and medications. Secondary hypertension may resolve if the underlying cause is treated." },
      { question: "What lifestyle changes help lower blood pressure?", answer: "Key lifestyle modifications include following the DASH diet, reducing sodium intake to less than 2,300 mg/day (ideally <1,500 mg), regular aerobic exercise (at least 150 minutes/week), maintaining a healthy weight, limiting alcohol consumption, and smoking cessation." }
    ],
    relatedConditions: ["heart-failure", "diabetes"],
    relatedLessonSlugs: ["hypertension", "cardiac-cycle-hemodynamics", "mi-management"]
  },
  {
    slug: "diabetes",
    name: "Diabetes Mellitus",
    title: "Diabetes Mellitus - Nursing Study Guide",
    metaDescription: "Complete nursing study guide on diabetes mellitus: Type 1 vs Type 2, DKA, HHS, insulin management, nursing interventions, and NCLEX practice questions.",
    keywords: "diabetes nursing, DKA nursing care, insulin administration, type 1 type 2 diabetes, NCLEX diabetes questions, blood glucose management",
    bodySystem: "Endocrine",
    icdCode: "E11",
    overview: "Diabetes mellitus is a group of metabolic diseases characterized by chronic hyperglycemia resulting from defects in insulin secretion, insulin action, or both. Type 1 diabetes mellitus (T1DM) is an autoimmune destruction of pancreatic beta cells resulting in absolute insulin deficiency, typically presenting in childhood or adolescence. Type 2 diabetes mellitus (T2DM) is characterized by insulin resistance and progressive beta-cell dysfunction, accounting for approximately 90-95% of all diabetes cases. Gestational diabetes occurs during pregnancy. Uncontrolled diabetes leads to microvascular complications (retinopathy, nephropathy, neuropathy) and macrovascular complications (coronary artery disease, peripheral vascular disease, cerebrovascular disease).",
    pathophysiology: "In Type 1 diabetes, autoimmune destruction of pancreatic beta cells in the islets of Langerhans results in absolute insulin deficiency. Without insulin, glucose cannot enter cells, leading to hyperglycemia while cells starve. The body shifts to fat metabolism, producing ketone bodies that cause diabetic ketoacidosis (DKA). In Type 2 diabetes, peripheral insulin resistance (primarily in skeletal muscle, liver, and adipose tissue) prevents normal glucose uptake despite initially elevated insulin levels. Over time, beta cells become exhausted and insulin production declines. Chronic hyperglycemia causes glycosylation of proteins and osmotic damage to blood vessels and nerves, leading to the characteristic microvascular and macrovascular complications.",
    clinicalPresentation: {
      earlySignsSymptoms: ["Polyuria (osmotic diuresis from hyperglycemia)", "Polydipsia (excessive thirst)", "Polyphagia (excessive hunger)", "Unexplained weight loss (Type 1)", "Fatigue and weakness", "Blurred vision"],
      lateSignsSymptoms: ["Peripheral neuropathy (numbness, tingling in extremities)", "Recurrent infections (UTI, candidiasis)", "Slow wound healing", "Retinopathy with vision changes", "Nephropathy (proteinuria, declining GFR)", "Diabetic foot ulcers"]
    },
    riskFactors: ["Family history of diabetes", "Obesity (BMI >30)", "Sedentary lifestyle", "Age >45 years", "Gestational diabetes history", "Polycystic ovary syndrome (PCOS)", "Hypertension", "Dyslipidemia", "African American, Hispanic, or Native American descent", "Prediabetes (A1C 5.7-6.4%)"],
    diagnostics: ["Fasting blood glucose (FBG >126 mg/dL on two occasions)", "Hemoglobin A1C (>6.5% diagnostic)", "Oral glucose tolerance test (OGTT >200 mg/dL at 2 hours)", "Random blood glucose (>200 mg/dL with symptoms)", "Fasting lipid panel", "Serum creatinine and BUN for renal function", "Urinalysis for proteinuria and ketonuria", "Annual dilated eye exam for retinopathy screening"],
    medications: [
      { name: "Metformin", drugClass: "Biguanide", mechanism: "Decreases hepatic glucose production and increases insulin sensitivity in peripheral tissues", sideEffects: "GI upset, lactic acidosis (rare), vitamin B12 deficiency", nursingConsiderations: "Hold before contrast dye procedures. Monitor renal function. Contraindicated in eGFR <30. First-line for Type 2 diabetes." },
      { name: "Insulin (Regular)", drugClass: "Short-acting Insulin", mechanism: "Facilitates glucose uptake into cells by binding to insulin receptors", sideEffects: "Hypoglycemia, weight gain, lipodystrophy at injection sites", nursingConsiderations: "Onset 30 minutes, peak 2-4 hours, duration 6-8 hours. Only insulin type given IV. Draw up regular (clear) before NPH (cloudy)." },
      { name: "Insulin Glargine (Lantus)", drugClass: "Long-acting Insulin", mechanism: "Provides basal insulin coverage with steady release over 24 hours", sideEffects: "Hypoglycemia, injection site reactions", nursingConsiderations: "No peak (peakless). Give at same time daily. Do NOT mix with other insulins. Clear solution." },
      { name: "Glipizide", drugClass: "Sulfonylurea", mechanism: "Stimulates pancreatic beta cells to release more insulin", sideEffects: "Hypoglycemia, weight gain", nursingConsiderations: "Take 30 minutes before meals. Monitor blood glucose closely. Requires functioning beta cells (not for Type 1)." }
    ],
    nursingInterventions: [
      "Monitor blood glucose levels as ordered (before meals and at bedtime)",
      "Assess for signs and symptoms of hypoglycemia (tremors, diaphoresis, confusion, HR changes)",
      "Assess for signs of hyperglycemia (polyuria, polydipsia, Kussmaul respirations in DKA)",
      "Administer insulin using proper technique (rotate injection sites, correct timing)",
      "Educate on carbohydrate counting and consistent meal planning",
      "Perform comprehensive foot assessments (inspect for ulcers, test sensation with monofilament)",
      "Educate on sick day management (never skip insulin, monitor glucose more frequently)",
      "Teach patient to carry fast-acting glucose source at all times",
      "Educate on proper blood glucose monitoring technique",
      "Coordinate annual screenings (eye exam, renal function, lipid panel, foot exam)"
    ],
    practiceQuestions: [
      { question: "A diabetic patient is diaphoretic, tremulous, and confused with a blood glucose of 52 mg/dL. What is the priority intervention?", options: ["Administer regular insulin", "Give 15g of fast-acting carbohydrate", "Call the provider", "Recheck blood glucose in 15 minutes"], correct: 1, rationale: "Hypoglycemia is treated with the 'Rule of 15': give 15 grams of fast-acting carbohydrate (4 oz juice, glucose tablets), wait 15 minutes, then recheck. For unconscious patients, give glucagon IM or dextrose IV." },
      { question: "Which finding differentiates DKA from HHS?", options: ["Hyperglycemia", "Dehydration", "Kussmaul respirations and fruity breath", "Altered mental status"], correct: 2, rationale: "Kussmaul respirations (deep, rapid breathing) and fruity acetone breath odor indicate ketoacidosis, which occurs in DKA but not in HHS. Both conditions present with hyperglycemia, dehydration, and potential altered mental status." },
      { question: "A nurse is drawing up insulin. Which should be drawn into the syringe first?", options: ["NPH insulin", "Regular insulin", "Insulin glargine", "It does not matter"], correct: 1, rationale: "When mixing insulins, always draw up Regular (clear) before NPH (cloudy) to prevent contamination of the regular insulin vial. Remember: 'Clear before cloudy.' Glargine should never be mixed." }
    ],
    faq: [
      { question: "What is the difference between Type 1 and Type 2 diabetes?", answer: "Type 1 diabetes is an autoimmune disease that destroys insulin-producing beta cells, requiring lifelong insulin therapy. It typically presents in childhood. Type 2 diabetes involves insulin resistance and progressive beta-cell dysfunction, is more common in adults, and can often be managed initially with lifestyle modifications and oral medications." },
      { question: "What is HbA1C and what does it measure?", answer: "Hemoglobin A1C (HbA1C) measures the percentage of hemoglobin that is glycosylated, reflecting average blood glucose control over the past 2-3 months. A normal A1C is below 5.7%, prediabetes is 5.7-6.4%, and diabetes is diagnosed at 6.5% or above. The target for most diabetic patients is below 7%." },
      { question: "What are the signs of diabetic ketoacidosis (DKA)?", answer: "DKA signs include Kussmaul respirations (deep, rapid breathing), fruity acetone breath odor, nausea and vomiting, abdominal pain, dehydration, altered mental status, blood glucose typically >250 mg/dL, serum pH <7.35, and positive serum ketones. DKA is a medical emergency requiring IV fluids, insulin drip, and electrolyte monitoring." }
    ],
    relatedConditions: ["hypertension", "heart-failure"],
    relatedLessonSlugs: ["siadh-di", "dka-hhns", "diabetes-lifespan"]
  },
  {
    slug: "asthma",
    name: "Asthma",
    title: "Asthma - Nursing Study Guide",
    metaDescription: "Comprehensive nursing study guide on asthma: pathophysiology, triggers, status asthmaticus, medications, nursing interventions, and NCLEX practice questions.",
    keywords: "asthma nursing, status asthmaticus, bronchodilators nursing, asthma pathophysiology, NCLEX asthma questions, respiratory nursing",
    bodySystem: "Respiratory",
    icdCode: "J45",
    overview: "Asthma is a chronic inflammatory disorder of the airways characterized by variable airflow obstruction, bronchial hyperresponsiveness, and underlying airway inflammation. It affects approximately 25 million Americans and is the most common chronic disease of childhood. Asthma severity ranges from intermittent to severe persistent, and acute exacerbations can range from mild to life-threatening status asthmaticus. Status asthmaticus is a severe, prolonged asthma attack refractory to standard bronchodilator therapy that constitutes a medical emergency.",
    pathophysiology: "In allergic asthma, inhaled allergens are captured by dendritic cells and presented to CD4+ T-helper lymphocytes, driving Th2 differentiation. Th2 cells release IL-4 (stimulates IgE production), IL-5 (recruits eosinophils), and IL-13 (promotes mucus hypersecretion and airway remodeling). Allergen-specific IgE binds to mast cells, and re-exposure triggers mast cell degranulation, releasing histamine, leukotrienes, and prostaglandins. Three pathological processes converge to limit airflow: bronchoconstriction (smooth muscle spasm), airway edema (inflammatory exudate), and mucus plugging (goblet cell hypersecretion). Chronic inflammation leads to airway remodeling with subepithelial fibrosis, smooth muscle hypertrophy, and basement membrane thickening.",
    clinicalPresentation: {
      earlySignsSymptoms: ["Expiratory wheezing", "Chest tightness", "Dyspnea (especially on exertion)", "Cough (often worse at night)", "Tachypnea", "Accessory muscle use"],
      lateSignsSymptoms: ["Silent chest (no air movement, imminent respiratory arrest)", "Paradoxical breathing", "Inability to speak in full sentences", "Severe respiratory acidosis", "Cyanosis", "Altered mental status"]
    },
    riskFactors: ["Family history of asthma/atopy", "Allergies (eczema, allergic rhinitis)", "Respiratory infections in early childhood", "Environmental tobacco smoke exposure", "Air pollution", "Obesity", "Occupational irritants", "Exercise in cold/dry air", "GERD", "Stress and strong emotions"],
    diagnostics: ["Peak expiratory flow rate (PEFR) monitoring", "Pulmonary function tests (FEV1/FVC ratio <70% indicates obstruction)", "Oxygen saturation monitoring", "ABG in severe exacerbation (respiratory acidosis)", "Chest X-ray to rule out pneumonia or pneumothorax", "CBC if infection suspected", "Allergy testing (skin prick or serum IgE)"],
    medications: [
      { name: "Albuterol", drugClass: "Short-acting Beta-2 Agonist (SABA)", mechanism: "Rapid bronchodilation by relaxing airway smooth muscle", sideEffects: "Tachycardia, tremors, hypokalemia", nursingConsiderations: "Rescue inhaler for acute symptoms. If using >2 days/week, asthma is not well-controlled. Shake well before use." },
      { name: "Fluticasone", drugClass: "Inhaled Corticosteroid (ICS)", mechanism: "Reduces airway inflammation and mucus production", sideEffects: "Oral thrush (candidiasis), hoarseness, dysphonia", nursingConsiderations: "Rinse mouth after each use to prevent thrush. Maintenance medication, not for acute attacks. Takes days to weeks for full effect." },
      { name: "Montelukast", drugClass: "Leukotriene Receptor Antagonist", mechanism: "Blocks leukotriene-mediated bronchoconstriction and inflammation", sideEffects: "Headache, mood changes, suicidal ideation (FDA black box warning)", nursingConsiderations: "Take in the evening. Monitor for behavioral/mood changes. Used for maintenance therapy and exercise-induced bronchospasm." },
      { name: "Methylprednisolone", drugClass: "Systemic Corticosteroid", mechanism: "Potent anti-inflammatory that reduces airway inflammation", sideEffects: "Hyperglycemia, immunosuppression, adrenal suppression", nursingConsiderations: "Used for acute exacerbations. Takes hours to work; not a rescue medication. Taper if used >5-7 days to prevent adrenal crisis." }
    ],
    nursingInterventions: [
      "Monitor respiratory status continuously during exacerbation (rate, effort, SpO2)",
      "Report silent chest or inability to speak immediately (impending respiratory arrest)",
      "Assess breath sounds before and after bronchodilator treatments",
      "Monitor and document peak flow readings and trends",
      "Position in high-Fowler's or tripod position for breathing ease",
      "Provide calm environment to reduce anxiety (anxiety worsens bronchospasm)",
      "Educate on proper inhaler technique and spacer use",
      "Teach difference between rescue (SABA) and controller (ICS) medications",
      "Educate on trigger identification and avoidance strategies",
      "Ensure patient has an asthma action plan (green/yellow/red zones)"
    ],
    practiceQuestions: [
      { question: "What is the most critical finding during an asthma attack?", options: ["Loud wheezing", "Silent chest", "Productive cough", "Heart rate of 100"], correct: 1, rationale: "A silent chest means NO air is moving through the airways, signaling imminent respiratory failure. This is more dangerous than loud wheezing, which at least indicates some air movement." },
      { question: "A patient uses an albuterol inhaler and a fluticasone inhaler. Which should be used first?", options: ["Fluticasone (corticosteroid)", "Albuterol (bronchodilator)", "Either can be first", "They should not be used together"], correct: 1, rationale: "The bronchodilator (albuterol) should be used first to open the airways, allowing the corticosteroid (fluticasone) to penetrate deeper into the lungs for better anti-inflammatory effect." },
      { question: "What is the priority nursing action after a patient uses an inhaled corticosteroid?", options: ["Check peak flow", "Instruct patient to rinse mouth", "Auscultate breath sounds", "Document the time of administration"], correct: 1, rationale: "Rinsing the mouth after inhaled corticosteroid use prevents oral thrush (candidiasis), a common side effect caused by steroid deposition in the oropharynx." }
    ],
    faq: [
      { question: "What is the difference between a rescue inhaler and a controller medication?", answer: "A rescue inhaler (e.g., albuterol) is a short-acting beta-2 agonist used for immediate relief of acute bronchospasm. A controller medication (e.g., fluticasone) is used daily to prevent inflammation and reduce the frequency of asthma attacks. Using a rescue inhaler more than 2 days per week indicates poorly controlled asthma." },
      { question: "What is status asthmaticus?", answer: "Status asthmaticus is a severe, life-threatening asthma attack that does not respond to standard bronchodilator therapy. It is characterized by progressive respiratory distress, silent chest, and respiratory acidosis. It requires emergency intervention including continuous nebulized bronchodilators, IV corticosteroids, magnesium sulfate, and preparation for possible intubation." },
      { question: "What is peak flow monitoring and why is it important?", answer: "Peak flow monitoring measures the maximum speed of air expulsion from the lungs. It helps patients objectively assess their airway function. Green zone (80-100% of personal best) means good control, yellow zone (50-80%) means caution and medication adjustment needed, and red zone (<50%) means a medical emergency." }
    ],
    relatedConditions: ["copd", "pneumonia"],
    relatedLessonSlugs: ["asthma-emergency", "copd-exacerbation"]
  },
  {
    slug: "copd",
    name: "Chronic Obstructive Pulmonary Disease (COPD)",
    title: "COPD - Nursing Study Guide",
    metaDescription: "Complete nursing study guide on COPD: chronic bronchitis, emphysema, pathophysiology, oxygen therapy, medications, nursing interventions, and NCLEX questions.",
    keywords: "COPD nursing, emphysema nursing care, chronic bronchitis, oxygen therapy COPD, NCLEX COPD questions, respiratory nursing",
    bodySystem: "Respiratory",
    icdCode: "J44",
    overview: "Chronic Obstructive Pulmonary Disease (COPD) is a progressive, largely irreversible obstructive airway disease characterized by persistent airflow limitation due to chronic inflammation of the airways and lung parenchyma. COPD encompasses two overlapping pathological processes: chronic bronchitis (productive cough for at least 3 months in 2 consecutive years) and emphysema (destruction of alveolar walls with air trapping). Smoking is the primary cause, responsible for more than 80% of cases. COPD is the third leading cause of death worldwide and a major cause of chronic disability.",
    pathophysiology: "The pathogenesis begins with chronic exposure to noxious particles and gases, most commonly cigarette smoke containing over 4,700 chemical compounds. Inhaled irritants activate alveolar macrophages and airway epithelial cells, releasing chemotactic factors (IL-8, LTB4, TNF-alpha) that recruit neutrophils and CD8+ T-lymphocytes. Unlike asthma (eosinophilic, CD4+), COPD inflammation is primarily neutrophilic (CD8+) and responds poorly to corticosteroids. Activated neutrophils release elastase, which degrades elastin fibers in alveolar walls (protease-antiprotease imbalance). In emphysema, alveolar wall destruction causes air trapping and loss of elastic recoil. In chronic bronchitis, goblet cell hyperplasia and mucus gland hypertrophy cause excessive mucus production with chronic airway obstruction.",
    clinicalPresentation: {
      earlySignsSymptoms: ["Chronic productive cough (chronic bronchitis)", "Dyspnea on exertion progressing to rest", "Barrel chest (emphysema)", "Pursed-lip breathing", "Prolonged expiratory phase", "Wheezing"],
      lateSignsSymptoms: ["Respiratory acidosis with CO2 retention", "Hypoxemic drive failure", "Confusion/CO2 narcosis", "Clubbing of fingers", "Right heart failure (cor pulmonale)", "Silent chest (emergency)"]
    },
    riskFactors: ["Smoking (primary cause, >80% of cases)", "Alpha-1 antitrypsin deficiency", "Occupational dust/chemical exposure", "Indoor air pollution (biomass fuel)", "Chronic asthma", "Age > 40 years", "Recurrent respiratory infections", "Low socioeconomic status"],
    diagnostics: ["Pulmonary function tests (gold standard: FEV1/FVC ratio <70%)", "Oxygen saturation monitoring (target 88-92% for chronic retainers)", "ABG to assess CO2 retention and respiratory acidosis", "Chest X-ray (hyperinflation, flattened diaphragm)", "CBC (polycythemia from chronic hypoxia)", "Alpha-1 antitrypsin level", "Sputum culture during exacerbation"],
    medications: [
      { name: "Albuterol", drugClass: "Short-acting Beta-2 Agonist (SABA)", mechanism: "Rapid bronchodilation by relaxing airway smooth muscle", sideEffects: "Tachycardia, tremors", nursingConsiderations: "Rescue inhaler only. Used for acute symptom relief during exacerbations." },
      { name: "Ipratropium (Atrovent)", drugClass: "Short-acting Anticholinergic", mechanism: "Blocks parasympathetic bronchoconstriction by antagonizing acetylcholine at muscarinic receptors", sideEffects: "Dry mouth, urinary retention", nursingConsiderations: "Contraindicated in glaucoma (due to pupil dilation risk). Often combined with albuterol (DuoNeb)." },
      { name: "Tiotropium (Spiriva)", drugClass: "Long-acting Anticholinergic (LAMA)", mechanism: "Sustained bronchodilation through prolonged muscarinic receptor blockade", sideEffects: "Dry mouth, constipation, urinary retention", nursingConsiderations: "Maintenance therapy, not for acute relief. Use HandiHaler device. Contraindicated in narrow-angle glaucoma." },
      { name: "Prednisone", drugClass: "Systemic Corticosteroid", mechanism: "Reduces airway inflammation during acute exacerbation", sideEffects: "Hyperglycemia, immunosuppression, osteoporosis with long-term use", nursingConsiderations: "Short courses (5-7 days) for exacerbations. Monitor blood glucose. Taper if used >7 days." }
    ],
    nursingInterventions: [
      "Maintain oxygen saturation between 88-92% (avoid over-oxygenation in chronic CO2 retainers)",
      "Position in high-Fowler's or tripod position for optimal breathing",
      "Administer low-flow oxygen as ordered (1-2 L/min via nasal cannula)",
      "Encourage pursed-lip breathing technique",
      "Maintain adequate hydration to thin secretions",
      "Monitor respiratory rate, depth, and oxygen saturation frequently",
      "Report O2 sat <88% or signs of CO2 narcosis immediately",
      "Assess breath sounds every shift and report changes",
      "Monitor sputum color, amount, and consistency",
      "Educate on smoking cessation (most important intervention)",
      "Teach energy conservation techniques for ADLs",
      "Educate on proper inhaler technique"
    ],
    practiceQuestions: [
      { question: "What is the target O2 saturation for a COPD patient?", options: ["98-100%", "88-92%", "94-96%", "Over 95%"], correct: 1, rationale: "COPD patients with chronic CO2 retention often rely on a hypoxic drive to breathe. Over-oxygenation (>92%) can suppress their respiratory drive, leading to respiratory failure. The target is 88-92%." },
      { question: "A COPD patient on 2L O2 via nasal cannula becomes increasingly drowsy with SpO2 of 96%. What should the nurse suspect?", options: ["Improvement in condition", "CO2 narcosis from over-oxygenation", "Normal response to treatment", "Sleep deprivation"], correct: 1, rationale: "In a COPD patient who chronically retains CO2, an SpO2 of 96% is too high and suggests over-oxygenation. The resulting suppression of the hypoxic drive leads to CO2 retention, causing confusion and drowsiness (CO2 narcosis). The nurse should reduce the oxygen flow rate and notify the provider." },
      { question: "Which breathing technique should a nurse teach a COPD patient?", options: ["Deep rapid breathing", "Pursed-lip breathing", "Breath holding", "Panting"], correct: 1, rationale: "Pursed-lip breathing creates back-pressure that keeps airways open longer during exhalation, prevents air trapping, and promotes CO2 exhalation. It is the most effective self-management breathing technique for COPD." }
    ],
    faq: [
      { question: "Why do COPD patients have a lower oxygen target?", answer: "Many COPD patients develop chronic CO2 retention, causing their respiratory drive to shift from responding to CO2 levels (normal) to responding to low oxygen levels (hypoxic drive). Giving too much oxygen removes this drive to breathe, potentially causing respiratory failure. The safe target is 88-92%." },
      { question: "What is the difference between chronic bronchitis and emphysema?", answer: "Chronic bronchitis involves inflammation and excessive mucus production in the bronchial tubes, characterized by a productive cough for at least 3 months in 2 consecutive years. Emphysema involves destruction of alveolar walls, causing air trapping and loss of elastic recoil. Most COPD patients have features of both." },
      { question: "Is COPD reversible?", answer: "COPD is a progressive and largely irreversible disease. While treatment (bronchodilators, smoking cessation, pulmonary rehabilitation) can improve symptoms and slow progression, the structural damage to the lungs cannot be reversed. Smoking cessation is the single most important intervention to slow disease progression." }
    ],
    relatedConditions: ["asthma", "pneumonia", "heart-failure"],
    relatedLessonSlugs: ["copd-exacerbation", "ards-management"]
  },
  {
    slug: "heart-failure",
    name: "Heart Failure",
    title: "Heart Failure (HF) - Nursing Study Guide",
    metaDescription: "Comprehensive nursing study guide on heart failure: left vs right HF, pathophysiology, medications, fluid management, nursing interventions, and NCLEX questions.",
    keywords: "heart failure nursing, left-sided heart failure, right-sided heart failure, HF nursing care, NCLEX heart failure questions, cardiac nursing",
    bodySystem: "Cardiovascular",
    icdCode: "I50",
    overview: "Heart failure (HF) is a complex clinical syndrome in which the heart is unable to pump sufficient blood to meet the metabolic demands of the body, or can only do so at elevated filling pressures. It affects approximately 6.2 million Americans and is the leading cause of hospitalization in adults over 65. HF can be classified as left-sided (systolic/HFrEF or diastolic/HFpEF), right-sided, or biventricular. Heart failure with reduced ejection fraction (HFrEF, EF <40%) involves impaired contractility, while heart failure with preserved ejection fraction (HFpEF, EF >50%) involves impaired relaxation and filling.",
    pathophysiology: "Heart failure involves progressive structural and functional deterioration at the cellular level. In HFrEF, myocyte loss (from ischemia, infarction, or cardiomyopathy) triggers compensatory mechanisms: the Frank-Starling mechanism (increased preload stretches remaining myocytes for stronger contraction), neurohormonal activation (RAAS and sympathetic nervous system), and ventricular remodeling (chamber dilation and wall thinning). Initially compensatory, these mechanisms eventually become maladaptive. Chronic RAAS activation causes sodium and water retention (volume overload), vasoconstriction (increased afterload), and myocardial fibrosis. Left-sided failure causes pulmonary congestion (crackles, dyspnea, orthopnea) as blood backs up into pulmonary vasculature. Right-sided failure causes systemic venous congestion (JVD, peripheral edema, hepatomegaly, ascites).",
    clinicalPresentation: {
      earlySignsSymptoms: ["Dyspnea on exertion", "Fatigue and exercise intolerance", "Orthopnea (dyspnea when lying flat)", "Paroxysmal nocturnal dyspnea (PND)", "Mild peripheral edema", "Nocturia"],
      lateSignsSymptoms: ["Crackles and frothy sputum (left-sided)", "Jugular venous distention (right-sided)", "Hepatomegaly and ascites (right-sided)", "S3 gallop (volume overload)", "Weight gain >3 lbs in 2 days", "Pink frothy sputum (pulmonary edema)"]
    },
    riskFactors: ["Coronary artery disease (most common cause)", "Hypertension", "Valvular heart disease", "Diabetes mellitus", "Obesity", "Sleep apnea", "Alcohol abuse (alcoholic cardiomyopathy)", "Viral myocarditis", "Chemotherapy (doxorubicin cardiotoxicity)", "Family history of cardiomyopathy"],
    diagnostics: ["BNP or NT-proBNP levels (elevated in HF)", "Daily weights (most sensitive indicator of fluid status)", "Chest X-ray (cardiomegaly, pulmonary congestion, pleural effusions)", "Echocardiogram (ejection fraction, wall motion, valve function)", "Basic metabolic panel (electrolytes, renal function)", "CBC", "Continuous pulse oximetry", "Strict intake and output monitoring"],
    medications: [
      { name: "Furosemide (Lasix)", drugClass: "Loop Diuretic", mechanism: "Inhibits sodium and chloride reabsorption in the loop of Henle, reducing preload through diuresis", sideEffects: "Hypokalemia, hyponatremia, ototoxicity, dehydration", nursingConsiderations: "Monitor potassium closely (supplement as ordered). Weigh daily. Give in morning to avoid nocturia. Monitor for orthostatic hypotension." },
      { name: "Lisinopril/Enalapril", drugClass: "ACE Inhibitor", mechanism: "Blocks RAAS, reducing afterload and preventing ventricular remodeling", sideEffects: "Dry cough, hyperkalemia, angioedema", nursingConsiderations: "First-line therapy for systolic HF (HFrEF). Monitor potassium and renal function. Hold if SBP <90." },
      { name: "Carvedilol/Metoprolol", drugClass: "Beta-Blocker", mechanism: "Reduces heart rate and myocardial oxygen demand, prevents adverse remodeling", sideEffects: "Bradycardia, hypotension, fatigue, bronchospasm", nursingConsiderations: "Start low and titrate slowly. Hold if HR <60 or SBP <90. Do not stop abruptly. Cornerstone of HFrEF therapy." },
      { name: "Spironolactone", drugClass: "Aldosterone Antagonist (Potassium-sparing Diuretic)", mechanism: "Blocks aldosterone, reducing sodium retention and myocardial fibrosis", sideEffects: "Hyperkalemia, gynecomastia", nursingConsiderations: "Monitor potassium closely (risk of hyperkalemia, especially with ACE inhibitors). Reduces mortality in severe HF." }
    ],
    nursingInterventions: [
      "Weigh patient daily at same time on same scale (most sensitive indicator)",
      "Report weight gain >2 lbs in 24 hours or >3 lbs in 2 days",
      "Enforce sodium restriction (<2-3 g/day) as ordered",
      "Enforce fluid restriction as ordered (typically 1.5-2 L/day)",
      "Position in high-Fowler's for breathing ease",
      "Assess lung sounds for crackles every shift",
      "Monitor edema (peripheral and sacral) and document",
      "Measure and document strict intake and output",
      "Monitor vital signs and oxygen saturation regularly",
      "Educate on sodium and fluid restrictions for home management",
      "Teach patient to weigh daily at home and report gains",
      "Administer oxygen as ordered for dyspnea"
    ],
    practiceQuestions: [
      { question: "What is the most sensitive indicator of fluid status in a heart failure patient?", options: ["Blood pressure", "Daily weight", "Urine output", "BNP level"], correct: 1, rationale: "Daily weights are the most sensitive and earliest indicator of fluid retention in heart failure. A weight gain of 2-3 lbs can represent 1 liter of fluid retention before edema becomes clinically apparent." },
      { question: "A nurse hears crackles in the lung bases, S3 gallop, and the patient reports PND. Which type of heart failure is most likely?", options: ["Right-sided heart failure", "Left-sided heart failure", "Cor pulmonale", "Cardiac tamponade"], correct: 1, rationale: "Crackles (pulmonary congestion), S3 gallop (volume overload), and PND are hallmark signs of left-sided heart failure. Blood backs up into the pulmonary vasculature when the left ventricle cannot effectively pump. Right-sided failure presents with JVD, peripheral edema, and hepatomegaly." },
      { question: "What is the priority teaching for heart failure home care?", options: ["Eat more salt for energy", "Report 3 lb weight gain in 2 days", "Drink 4L of water daily", "Only take medications when symptomatic"], correct: 1, rationale: "Rapid weight gain (>3 lbs in 2 days or >2 lbs in 24 hours) indicates fluid overload and requires prompt medical attention. Patients must weigh themselves daily and understand when to contact their provider." }
    ],
    faq: [
      { question: "What is the difference between left-sided and right-sided heart failure?", answer: "Left-sided heart failure causes blood to back up into the pulmonary vasculature, resulting in pulmonary symptoms: crackles, dyspnea, orthopnea, PND, and pink frothy sputum. Right-sided heart failure causes blood to back up into the systemic venous system, resulting in jugular venous distention (JVD), peripheral edema, hepatomegaly, ascites, and weight gain. Left-sided failure is the most common cause of right-sided failure." },
      { question: "Why are daily weights so important in heart failure?", answer: "Daily weights are the earliest and most sensitive indicator of fluid retention. A gain of 1 kg (2.2 lbs) represents approximately 1 liter of retained fluid. Weight changes can detect fluid accumulation before clinical signs (edema, crackles) become apparent, allowing for earlier intervention." },
      { question: "What is BNP and what does it indicate?", answer: "B-type Natriuretic Peptide (BNP) is a hormone released by ventricular myocytes in response to volume overload and increased wall stress. Elevated BNP levels (>100 pg/mL) support a diagnosis of heart failure and help differentiate cardiac from pulmonary causes of dyspnea. BNP levels correlate with HF severity and are used to guide treatment response." }
    ],
    relatedConditions: ["hypertension", "copd", "diabetes"],
    relatedLessonSlugs: ["hf-advanced", "mi-management", "dysrhythmias"]
  },
  {
    slug: "sepsis",
    name: "Sepsis",
    title: "Sepsis and Septic Shock - Nursing Study Guide",
    metaDescription: "Complete nursing study guide on sepsis: pathophysiology, SIRS criteria, Sepsis-3 definitions, early recognition, sepsis bundles, nursing interventions, and NCLEX questions.",
    keywords: "sepsis nursing, septic shock, SIRS criteria, sepsis bundle, qSOFA, NCLEX sepsis questions, critical care nursing",
    bodySystem: "Multisystem",
    icdCode: "A41",
    overview: "Sepsis is a life-threatening organ dysfunction caused by a dysregulated host response to infection (Sepsis-3 definition, 2016). It represents a clinical continuum from infection to sepsis to septic shock, with mortality rates increasing at each stage. Sepsis affects approximately 1.7 million adults in the US annually and is the leading cause of death in hospitals. Early recognition and aggressive treatment within the first hour (the 'golden hour') significantly improve survival. Septic shock is defined as sepsis with persistent hypotension requiring vasopressors to maintain MAP >65 mmHg and a serum lactate >2 mmol/L despite adequate fluid resuscitation.",
    pathophysiology: "Sepsis begins with an infection that triggers a massive, dysregulated inflammatory response. Pathogen-associated molecular patterns (PAMPs) from bacteria, viruses, or fungi activate innate immune cells (macrophages, neutrophils) via pattern recognition receptors (toll-like receptors). This triggers a cytokine storm: pro-inflammatory mediators (TNF-alpha, IL-1, IL-6) cause widespread endothelial damage, increased vascular permeability, and vasodilation. The coagulation cascade is simultaneously activated, causing disseminated intravascular coagulation (DIC) with microthrombi formation in small vessels, leading to tissue hypoperfusion and organ failure. The resulting distributive shock is characterized by low systemic vascular resistance (SVR), decreased blood pressure, and initially increased cardiac output (warm/hyperdynamic shock), progressing to decreased cardiac output (cold/hypodynamic shock) as the heart fails.",
    clinicalPresentation: {
      earlySignsSymptoms: ["Temperature >38.3C (100.9F) or <36C (96.8F)", "Heart rate >90 bpm", "Respiratory rate >20 breaths/min", "Altered mental status (confusion, agitation)", "Warm, flushed skin (early/warm shock)", "Decreased urine output"],
      lateSignsSymptoms: ["Hypotension (SBP <90 or MAP <65 mmHg)", "Cool, mottled, cyanotic extremities (cold shock)", "Oliguria/anuria", "Elevated serum lactate (>2 mmol/L)", "Coagulopathy (DIC signs: petechiae, bleeding)", "Multi-organ dysfunction"]
    },
    riskFactors: ["Age >65 or neonates", "Immunocompromised state (HIV, chemotherapy, transplant)", "Chronic disease (diabetes, liver disease, kidney disease)", "Invasive devices (central lines, urinary catheters, ventilators)", "Recent surgery or hospitalization", "Burns or major trauma", "Malnutrition", "IV drug use"],
    diagnostics: ["Blood cultures (at least 2 sets from different sites BEFORE antibiotics)", "Serum lactate level (>2 mmol/L indicates tissue hypoperfusion)", "CBC with differential", "Comprehensive metabolic panel (renal and liver function)", "Coagulation studies (PT, INR, fibrinogen for DIC)", "Procalcitonin (bacterial infection biomarker)", "Urinalysis and urine culture", "Chest X-ray", "qSOFA score (altered mentation, SBP <100, RR >22)"],
    medications: [
      { name: "Broad-spectrum Antibiotics", drugClass: "Antimicrobials", mechanism: "Target suspected causative organisms; empiric coverage until culture results available", sideEffects: "Allergic reactions, C. difficile, nephrotoxicity/ototoxicity (aminoglycosides)", nursingConsiderations: "Administer within 1 hour of sepsis recognition (each hour delay increases mortality 7-8%). Obtain blood cultures BEFORE administration." },
      { name: "Norepinephrine", drugClass: "Alpha/Beta Agonist (Vasopressor)", mechanism: "Increases systemic vascular resistance and MAP through alpha-1 vasoconstriction", sideEffects: "Tissue necrosis with extravasation, peripheral ischemia", nursingConsiderations: "First-line vasopressor in septic shock. Give via central line when possible. Titrate to MAP >65 mmHg. Monitor for extravasation." },
      { name: "IV Crystalloid (Normal Saline/Lactated Ringer's)", drugClass: "Volume Resuscitation", mechanism: "Restores intravascular volume lost through capillary leak and vasodilation", sideEffects: "Volume overload, hyperchloremic acidosis (with NS)", nursingConsiderations: "30 mL/kg bolus within first 3 hours of sepsis recognition. Monitor for fluid overload (crackles, JVD). Reassess frequently." },
      { name: "Hydrocortisone", drugClass: "Corticosteroid", mechanism: "Addresses relative adrenal insufficiency in refractory septic shock", sideEffects: "Hyperglycemia, immunosuppression", nursingConsiderations: "Reserved for vasopressor-refractory shock. Monitor blood glucose closely. Given as continuous infusion or Q6H." }
    ],
    nursingInterventions: [
      "Screen for sepsis using qSOFA or institutional screening tools",
      "Obtain blood cultures from 2 separate sites BEFORE antibiotic administration",
      "Administer broad-spectrum antibiotics within 1 hour of sepsis recognition",
      "Initiate IV crystalloid bolus (30 mL/kg) within first 3 hours",
      "Monitor MAP and titrate vasopressors to maintain MAP >65 mmHg",
      "Monitor serum lactate levels and trend clearance",
      "Measure urine output hourly (target >0.5 mL/kg/hr)",
      "Monitor vital signs continuously (heart rate, blood pressure, temperature)",
      "Assess mental status and level of consciousness frequently",
      "Monitor for signs of DIC (petechiae, oozing from lines, bleeding gums)",
      "Reassess fluid status frequently (avoid fluid overload)",
      "Maintain strict aseptic technique for all invasive devices"
    ],
    practiceQuestions: [
      { question: "A patient with suspected sepsis has a temperature of 38.9C, HR 110, RR 24, and BP 82/50. What is the priority nursing action?", options: ["Administer acetaminophen for fever", "Obtain blood cultures and administer antibiotics within 1 hour", "Apply cooling blankets", "Call a rapid response for respiratory distress"], correct: 1, rationale: "The SEP-1 sepsis bundle mandates obtaining blood cultures and administering broad-spectrum antibiotics within 1 hour of sepsis recognition. Each hour of delay in antibiotic administration increases mortality by approximately 7-8%." },
      { question: "What is the initial fluid resuscitation target for a septic patient?", options: ["10 mL/kg over 1 hour", "30 mL/kg within 3 hours", "500 mL over 4 hours", "As needed based on urine output"], correct: 1, rationale: "The Surviving Sepsis Campaign guidelines recommend an initial crystalloid bolus of 30 mL/kg within the first 3 hours for patients with sepsis-induced hypoperfusion or septic shock." },
      { question: "What is the first-line vasopressor for septic shock?", options: ["Dopamine", "Norepinephrine", "Epinephrine", "Vasopressin"], correct: 1, rationale: "Norepinephrine is the first-line vasopressor for septic shock. It provides potent alpha-1 vasoconstriction to counteract the pathological vasodilation while also providing modest beta-1 support to maintain cardiac output." }
    ],
    faq: [
      { question: "What is the difference between sepsis and septic shock?", answer: "Sepsis is life-threatening organ dysfunction caused by a dysregulated response to infection. Septic shock is a subset of sepsis with profound circulatory and metabolic abnormalities: persistent hypotension requiring vasopressors to maintain MAP >65 mmHg and serum lactate >2 mmol/L despite adequate fluid resuscitation. Septic shock carries a mortality rate of approximately 40%." },
      { question: "What is the qSOFA score?", answer: "The quick Sequential Organ Failure Assessment (qSOFA) is a bedside screening tool for sepsis using three criteria: altered mental status (GCS <15), systolic blood pressure <100 mmHg, and respiratory rate >22 breaths/min. A score of 2 or more suggests sepsis and warrants further assessment and aggressive intervention." },
      { question: "Why must blood cultures be drawn before antibiotics?", answer: "Blood cultures drawn before antibiotic administration have a much higher yield for identifying the causative organism. Once antibiotics are given, they begin killing bacteria in the bloodstream, which can cause false-negative culture results. Identifying the specific organism allows for targeted antibiotic therapy (de-escalation), reducing the risk of antibiotic resistance and adverse effects." }
    ],
    relatedConditions: ["pneumonia", "heart-failure"],
    relatedLessonSlugs: ["cardiac-cycle-hemodynamics"]
  },
  {
    slug: "pneumonia",
    name: "Pneumonia",
    title: "Pneumonia - Nursing Study Guide",
    metaDescription: "Complete nursing study guide on pneumonia: community-acquired, hospital-acquired, pathophysiology, antibiotics, nursing interventions, and NCLEX practice questions.",
    keywords: "pneumonia nursing, community-acquired pneumonia, hospital-acquired pneumonia, pneumonia pathophysiology, NCLEX pneumonia questions, respiratory nursing",
    bodySystem: "Respiratory",
    icdCode: "J18",
    overview: "Pneumonia is an acute infection of the lung parenchyma (alveoli and surrounding tissue) caused by bacteria, viruses, fungi, or aspiration of gastric contents. It is classified by setting of acquisition: community-acquired pneumonia (CAP), hospital-acquired pneumonia (HAP, onset >48 hours after admission), and ventilator-associated pneumonia (VAP). Pneumonia is the leading cause of death from infectious disease worldwide and a major cause of sepsis. Streptococcus pneumoniae is the most common bacterial cause of CAP. Risk factors include advanced age, immunosuppression, chronic lung disease, and impaired cough or gag reflexes.",
    pathophysiology: "Pneumonia develops when pathogens overwhelm the lung's defense mechanisms (mucociliary clearance, alveolar macrophages, cough reflex, and IgA). Once pathogens reach the alveoli, they trigger an inflammatory response. Alveolar macrophages release cytokines (IL-1, TNF-alpha, IL-8) that recruit neutrophils to the site of infection. The inflammatory exudate (neutrophils, fluid, fibrin, and cellular debris) fills the alveoli, a process called consolidation. This consolidated lung tissue cannot participate in gas exchange, creating a ventilation-perfusion (V/Q) mismatch and resulting in hypoxemia. In severe cases, the inflammatory response becomes systemic, potentially leading to acute respiratory distress syndrome (ARDS) or sepsis.",
    clinicalPresentation: {
      earlySignsSymptoms: ["Fever and chills (may be absent in elderly)", "Productive cough with purulent sputum", "Tachypnea", "Pleuritic chest pain (sharp, worsens with inspiration)", "Crackles on auscultation", "Increased work of breathing"],
      lateSignsSymptoms: ["Hypoxemia (SpO2 <90%)", "Cyanosis", "Altered mental status (especially in elderly)", "Signs of sepsis (tachycardia, hypotension)", "Respiratory failure", "Pleural effusion"]
    },
    riskFactors: ["Age >65 or <2 years", "Chronic lung disease (COPD, asthma)", "Immunosuppression (HIV, chemotherapy, corticosteroids)", "Smoking", "Aspiration risk (dysphagia, impaired consciousness, tube feeding)", "Recent hospitalization", "Mechanical ventilation", "Chronic disease (heart failure, diabetes, liver disease)", "Poor nutritional status", "Immobility"],
    diagnostics: ["Chest X-ray (infiltrates, consolidation, air bronchograms)", "Sputum culture and Gram stain (obtain before antibiotics when possible)", "Blood cultures (especially if sepsis suspected)", "CBC with differential (leukocytosis with left shift)", "Procalcitonin (helps differentiate bacterial from viral)", "ABG if respiratory distress (may show hypoxemia, respiratory alkalosis initially)", "Pulse oximetry monitoring", "BUN (elevated BUN is a prognostic indicator in CURB-65 scoring)"],
    medications: [
      { name: "Azithromycin", drugClass: "Macrolide Antibiotic", mechanism: "Inhibits bacterial protein synthesis by binding to 50S ribosomal subunit", sideEffects: "GI upset, QT prolongation, hepatotoxicity", nursingConsiderations: "First-line for outpatient CAP. Complete the full course even if feeling better. Monitor for cardiac arrhythmias in patients with QT prolongation risk." },
      { name: "Ceftriaxone", drugClass: "Third-generation Cephalosporin", mechanism: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins", sideEffects: "Allergic reaction, diarrhea, C. difficile", nursingConsiderations: "Often combined with azithromycin for inpatient CAP. Cross-reactivity with penicillin allergy is low (<2%) but assess allergy history. Do not mix with calcium-containing solutions." },
      { name: "Piperacillin-Tazobactam (Zosyn)", drugClass: "Extended-spectrum Penicillin/Beta-lactamase Inhibitor", mechanism: "Broad-spectrum bactericidal activity against gram-positive, gram-negative, and anaerobes", sideEffects: "Diarrhea, rash, electrolyte imbalances", nursingConsiderations: "Used for hospital-acquired and ventilator-associated pneumonia. Monitor renal function. Assess for penicillin allergy." },
      { name: "Oseltamivir (Tamiflu)", drugClass: "Neuraminidase Inhibitor", mechanism: "Inhibits viral neuraminidase enzyme, preventing viral release from infected cells", sideEffects: "Nausea, vomiting, headache", nursingConsiderations: "For influenza pneumonia. Most effective when started within 48 hours of symptom onset. Can be used for prophylaxis in exposed individuals." }
    ],
    nursingInterventions: [
      "Monitor respiratory status (rate, depth, SpO2, work of breathing) every 1-4 hours",
      "Administer oxygen as ordered to maintain SpO2 >94% (88-92% in COPD patients)",
      "Obtain sputum specimen for culture before antibiotic administration when possible",
      "Administer antibiotics as ordered within appropriate timeframe",
      "Encourage incentive spirometry every 1-2 hours while awake",
      "Position in semi-Fowler's or high-Fowler's to optimize lung expansion",
      "Encourage adequate fluid intake (2-3 L/day unless fluid restricted) to thin secretions",
      "Assist with coughing and deep breathing exercises",
      "Monitor temperature trends and administer antipyretics as ordered",
      "Implement aspiration precautions for at-risk patients (elevate HOB 30-45 degrees)",
      "Maintain oral hygiene (reduces oropharyngeal colonization)",
      "Educate on pneumococcal and influenza vaccination"
    ],
    practiceQuestions: [
      { question: "A nurse is caring for an elderly patient who is suddenly confused with a temperature of 37.8C. What should the nurse suspect?", options: ["Normal age-related confusion", "Urinary tract infection only", "Pneumonia (elderly may present atypically)", "Medication side effects"], correct: 2, rationale: "Elderly patients with pneumonia often present atypically: they may have minimal or no fever, and confusion/altered mental status may be the first or only sign. Classic symptoms (high fever, productive cough) may be absent in older adults." },
      { question: "What intervention is most important to prevent ventilator-associated pneumonia (VAP)?", options: ["Administering prophylactic antibiotics", "Elevating the head of bed 30-45 degrees", "Suctioning every hour", "Keeping the endotracheal tube cuff deflated"], correct: 1, rationale: "Elevating the head of bed 30-45 degrees is a key evidence-based intervention in the VAP prevention bundle. It reduces aspiration of gastric contents and oropharyngeal secretions into the lower airways. Other VAP bundle elements include oral care with chlorhexidine, daily sedation vacations, and daily assessment of readiness to extubate." },
      { question: "Which sputum finding indicates a quality specimen for culture?", options: [">25 squamous epithelial cells per low-power field", "<10 squamous epithelial cells and >25 WBCs per low-power field", "Clear and watery appearance", "Specimen collected after antibiotic administration"], correct: 1, rationale: "A quality sputum specimen should have fewer than 10 squamous epithelial cells (which indicate oral contamination) and more than 25 white blood cells per low-power field (indicating a lower respiratory tract source). Specimens should be collected before antibiotics when possible." }
    ],
    faq: [
      { question: "What is the difference between community-acquired and hospital-acquired pneumonia?", answer: "Community-acquired pneumonia (CAP) develops outside the hospital or within 48 hours of admission. The most common cause is Streptococcus pneumoniae. Hospital-acquired pneumonia (HAP) develops 48 hours or more after hospital admission and is often caused by more resistant organisms like MRSA, Pseudomonas, or Klebsiella. HAP generally requires broader-spectrum antibiotics and carries higher mortality." },
      { question: "Why do elderly patients present differently with pneumonia?", answer: "Elderly patients often have a blunted immune response (immunosenescence), which means they may not mount a high fever or produce purulent sputum. The most common initial presentation in the elderly is acute confusion or altered mental status, functional decline, falls, or decreased appetite. This atypical presentation can delay diagnosis and treatment." },
      { question: "How can pneumonia be prevented?", answer: "Key prevention strategies include pneumococcal vaccination (PCV13 and PPSV23 for adults >65 and high-risk individuals), annual influenza vaccination, smoking cessation, aspiration precautions (elevating HOB, swallow evaluation before oral intake), oral hygiene, incentive spirometry post-operatively, early mobilization, and hand hygiene to prevent healthcare-associated infections." }
    ],
    relatedConditions: ["sepsis", "copd", "asthma"],
    relatedLessonSlugs: ["copd-exacerbation", "ards-management"]
  }
];

export function getConditionBySlug(slug: string): ConditionPageData | undefined {
  return seoConditions.find(c => c.slug === slug);
}

export function getAllConditionSlugs(): string[] {
  return seoConditions.map(c => c.slug);
}
