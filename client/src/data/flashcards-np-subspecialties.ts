import type { FlashcardData } from "./flashcards-rpn";

export const npSubspecialtyFlashcards: FlashcardData[] = [
  // ============================================================
  // PMHNP — PSYCHIATRIC-MENTAL HEALTH NP (50 cards)
  // ============================================================
  {
    id: "pmhnp-q1",
    type: "question",
    question: "A 28-year-old female presents with episodic binge eating followed by self-induced vomiting 3-4 times per week. She reports using laxatives and has bilateral parotid gland enlargement. Which medication is FDA-approved for bulimia nervosa?",
    options: ["Sertraline (Zoloft)", "Fluoxetine (Prozac)", "Bupropion (Wellbutrin)", "Olanzapine (Zyprexa)"],
    correctIndex: 1,
    answer: "Fluoxetine is the only SSRI with FDA approval for bulimia nervosa at 60 mg/day. Bupropion is contraindicated in eating disorders due to increased seizure risk. Parotid enlargement and Russell's sign (knuckle calluses) are classic physical findings.",
    category: "Psychiatric Mental Health",
    difficulty: 3,
    clinicalPearl: "Remember: Bupropion is CONTRAINDICATED in all eating disorders (bulimia and anorexia) due to seizure threshold lowering. Fluoxetine 60 mg is the target dose for bulimia — higher than typical depression dosing of 20 mg."
  },
  {
    id: "pmhnp-q2",
    type: "question",
    question: "A patient on clozapine for treatment-resistant schizophrenia has a WBC of 2,800/mm³ and ANC of 1,400/mm³. What is the appropriate action?",
    options: ["Continue clozapine with weekly CBC monitoring", "Hold clozapine and recheck CBC in 3 days", "Discontinue clozapine permanently", "Increase monitoring to twice weekly and continue"],
    correctIndex: 1,
    answer: "With ANC 1,000-1,499/mm³ (mild neutropenia), clozapine must be interrupted and CBC monitored every other day. If ANC drops below 1,000, clozapine must be permanently discontinued. The REMS program mandates ANC monitoring: weekly for 6 months, biweekly for 6 months, then monthly.",
    category: "Psychiatric Mental Health",
    difficulty: 3,
    clinicalPearl: "Clozapine ANC thresholds: >1,500 = continue (green), 1,000-1,499 = interrupt (yellow), <1,000 = discontinue permanently (red). Clozapine is also associated with myocarditis (first 2 months), metabolic syndrome, and constipation/ileus."
  },
  {
    id: "pmhnp-q3",
    type: "question",
    question: "Which neurotransmitter system is primarily implicated in the negative symptoms of schizophrenia (flat affect, alogia, avolition)?",
    options: ["Dopamine excess in mesolimbic pathway", "Dopamine deficiency in mesocortical pathway", "Serotonin excess in raphe nuclei", "GABA deficiency in the prefrontal cortex"],
    correctIndex: 1,
    answer: "Negative symptoms of schizophrenia are attributed to hypodopaminergic activity in the mesocortical pathway (prefrontal cortex). Positive symptoms (hallucinations, delusions) result from hyperdopaminergic activity in the mesolimbic pathway. This explains why second-generation antipsychotics with 5-HT2A antagonism improve negative symptoms.",
    category: "Psychiatric Mental Health",
    difficulty: 3,
    clinicalPearl: "The four dopamine pathways: Mesolimbic (positive symptoms), Mesocortical (negative/cognitive symptoms), Nigrostriatal (EPS side effects), Tuberoinfundibular (hyperprolactinemia). Understanding these pathways explains both symptoms and medication side effects."
  },
  {
    id: "pmhnp-q4",
    type: "question",
    question: "A 45-year-old male with bipolar I disorder has been stable on lithium 900 mg daily (level 0.9 mEq/L). He presents with polyuria, polydipsia, and a serum sodium of 148 mEq/L. What is the most likely complication?",
    options: ["Lithium-induced hypothyroidism", "Lithium-induced nephrogenic diabetes insipidus", "Lithium toxicity", "Syndrome of inappropriate ADH secretion"],
    correctIndex: 1,
    answer: "Lithium-induced nephrogenic diabetes insipidus occurs in 20-40% of long-term lithium users due to downregulation of aquaporin-2 channels in the collecting duct. This causes inability to concentrate urine despite adequate ADH. Treatment includes amiloride (paradoxically a potassium-sparing diuretic) which blocks lithium entry into collecting duct cells.",
    category: "Psychiatric Mental Health",
    difficulty: 3,
    clinicalPearl: "Lithium long-term effects (the 3 Ns): Nephrogenic DI, Nephrotoxicity (chronic tubulointerstitial nephritis), and Nodular goiter/hypothyroidism. Monitor renal function (BUN/Cr), thyroid (TSH), and calcium annually."
  },
  {
    id: "pmhnp-q5",
    type: "question",
    question: "A patient on an MAOI (phenelzine) presents to the ED with severe hypertension (BP 220/130), diaphoresis, headache, and neck stiffness after eating aged cheese. What is the priority intervention?",
    options: ["Administer IV labetalol", "Administer phentolamine IV", "Administer sublingual nifedipine", "Administer IV nitroprusside"],
    correctIndex: 1,
    answer: "Phentolamine (alpha-adrenergic blocker) is the specific antidote for MAOI-tyramine hypertensive crisis. Tyramine in aged cheese causes massive norepinephrine release that is not metabolized due to MAO-A inhibition. IV phentolamine directly blocks alpha receptors. Nifedipine 10 mg bite-and-swallow was historically used but carries risk of precipitous hypotension.",
    category: "Psychiatric Mental Health",
    difficulty: 3,
    clinicalPearl: "MAOI dietary restrictions (tyramine-rich foods): Aged cheese, cured meats, draft beer, soy sauce, fermented foods, red wine, sauerkraut. Also avoid serotonergic drugs (SSRIs, meperidine, dextromethorphan, St. John's wort) to prevent serotonin syndrome. Requires 14-day washout before switching."
  },
  {
    id: "pmhnp-q6",
    type: "question",
    question: "A 16-year-old presents with recurrent panic attacks, school avoidance, and fear of having a panic attack in public. Which diagnosis best fits this presentation?",
    options: ["Generalized anxiety disorder", "Social anxiety disorder", "Panic disorder with agoraphobia", "Separation anxiety disorder"],
    correctIndex: 2,
    answer: "Panic disorder with agoraphobia is characterized by recurrent unexpected panic attacks AND avoidance of situations where escape might be difficult or help unavailable. School avoidance due to fear of having panic attacks in public settings (not fear of social judgment) distinguishes this from social anxiety disorder.",
    category: "Psychiatric Mental Health",
    difficulty: 2,
    clinicalPearl: "Differentiating anxiety disorders: Panic disorder = fear of the panic attack itself; Social anxiety = fear of negative evaluation by others; Agoraphobia = avoidance of situations due to panic; GAD = excessive worry about multiple domains for >6 months."
  },
  {
    id: "pmhnp-q7",
    type: "question",
    question: "Which medication has the strongest evidence for reducing suicide attempts in patients with borderline personality disorder?",
    options: ["Dialectical behavior therapy (DBT) only", "Fluoxetine", "Lithium", "Clozapine"],
    correctIndex: 0,
    answer: "DBT is the gold standard evidence-based treatment for borderline personality disorder and has the strongest evidence for reducing suicidal behavior, self-harm, and ED visits. No medication is FDA-approved specifically for BPD. Pharmacotherapy targets specific symptom domains (mood lability, impulsivity, psychotic-like symptoms).",
    category: "Psychiatric Mental Health",
    difficulty: 3,
    clinicalPearl: "BPD pharmacotherapy targets symptoms, not the disorder: Mood instability → mood stabilizers; Impulsivity → SSRIs or mood stabilizers; Transient psychosis → low-dose antipsychotics; Affective dysregulation → lamotrigine. DBT addresses the core pathology of emotion dysregulation."
  },
  {
    id: "pmhnp-q8",
    type: "question",
    question: "A 70-year-old male with major depressive disorder and benign prostatic hyperplasia needs an antidepressant. Which class should be AVOIDED?",
    options: ["SSRIs", "SNRIs", "Tricyclic antidepressants", "Mirtazapine"],
    correctIndex: 2,
    answer: "Tricyclic antidepressants (TCAs) have significant anticholinergic properties that worsen BPH symptoms (urinary retention). Their muscarinic receptor blockade also causes dry mouth, constipation, blurred vision, and tachycardia. TCAs also carry cardiac toxicity risk (QTc prolongation, arrhythmias) and are lethal in overdose.",
    category: "Psychiatric Mental Health",
    difficulty: 2,
    clinicalPearl: "Anticholinergic burden is cumulative: TCA + diphenhydramine + oxybutynin = high delirium risk in elderly. The 'Anticholinergic Cognitive Burden Scale' helps quantify total burden. Prefer SSRIs or SNRIs in elderly patients."
  },
  {
    id: "pmhnp-q9",
    type: "question",
    question: "A patient on quetiapine 300 mg develops elevated fasting glucose (142 mg/dL), triglycerides 280 mg/dL, and 15-lb weight gain over 3 months. What metabolic monitoring is required for second-generation antipsychotics?",
    options: ["Annual fasting glucose only", "Fasting glucose and lipid panel at baseline, 12 weeks, then annually", "HbA1c every 6 months only", "No routine monitoring needed"],
    correctIndex: 1,
    answer: "ADA/APA consensus guidelines require: baseline fasting glucose, lipid panel, weight/BMI, waist circumference, and blood pressure. Recheck at 4 weeks (weight), 12 weeks (all metabolic parameters), then annually. Clozapine and olanzapine carry the highest metabolic risk; aripiprazole and ziprasidone the lowest.",
    category: "Psychiatric Mental Health",
    difficulty: 2,
    clinicalPearl: "SGA metabolic risk ranking (highest to lowest): Clozapine > Olanzapine > Quetiapine/Risperidone > Aripiprazole/Ziprasidone/Lurasidone/Cariprazine. Consider switching to a metabolically favorable SGA if significant weight gain or metabolic syndrome develops."
  },
  {
    id: "pmhnp-q10",
    type: "question",
    question: "A patient presents with pressured speech, grandiosity, decreased need for sleep (3 hours/night), excessive spending, and hypersexuality for 5 days. They have no psychotic features. What is the diagnosis?",
    options: ["Bipolar I disorder, manic episode", "Bipolar II disorder, hypomanic episode", "Schizoaffective disorder, bipolar type", "Cyclothymic disorder"],
    correctIndex: 0,
    answer: "Bipolar I manic episode requires ≥7 days (or any duration if hospitalized) of elevated/irritable mood PLUS ≥3 symptoms (DIGFAST: Distractibility, Indiscretion, Grandiosity, Flight of ideas, Activity increase, Sleep decrease, Talkativeness). This 5-day presentation still meets criteria if causing marked impairment. Bipolar II hypomania is ≥4 days without marked impairment.",
    category: "Psychiatric Mental Health",
    difficulty: 2,
    clinicalPearl: "DIGFAST mnemonic for mania: Distractibility, Indiscretion/Impulsivity, Grandiosity, Flight of ideas, Activity increase, Sleep deficit, Talkativeness/pressured speech. Key distinction: Bipolar I = mania (±depression), Bipolar II = hypomania + major depression."
  },
  {
    id: "pmhnp-q11",
    type: "question",
    question: "Which psychotropic medication requires baseline and periodic ECG monitoring due to dose-dependent QTc prolongation?",
    options: ["Sertraline", "Ziprasidone (Geodon)", "Aripiprazole (Abilify)", "Buspirone"],
    correctIndex: 1,
    answer: "Ziprasidone has the highest risk of QTc prolongation among SGAs. ECG monitoring is recommended at baseline and periodically. Avoid combining with other QTc-prolonging agents (fluoroquinolones, ondansetron, methadone). Contraindicated in patients with known QTc prolongation or recent MI.",
    category: "Psychiatric Mental Health",
    difficulty: 2,
    clinicalPearl: "QTc-prolonging psychotropics to remember: Ziprasidone, thioridazine, IV haloperidol, high-dose citalopram (>40 mg, or >20 mg in elderly), TCAs, and methadone. QTc >500 ms = high risk for Torsades de Pointes."
  },
  {
    id: "pmhnp-q12",
    type: "question",
    question: "A combat veteran has recurrent nightmares, hypervigilance, emotional numbing, and avoidance of fireworks for 8 months after returning from deployment. Which medication is first-line pharmacotherapy for PTSD?",
    options: ["Prazosin", "Sertraline or paroxetine", "Propranolol", "Benzodiazepines"],
    correctIndex: 1,
    answer: "Sertraline (Zoloft) and paroxetine (Paxil) are the only two FDA-approved medications for PTSD. SSRIs are first-line pharmacotherapy. Prazosin is used adjunctively for PTSD-related nightmares but is not first-line monotherapy. Benzodiazepines are contraindicated in PTSD — they worsen outcomes and increase risk of substance use disorder.",
    category: "Psychiatric Mental Health",
    difficulty: 2,
    clinicalPearl: "PTSD pharmacotherapy: First-line = sertraline or paroxetine (FDA-approved SSRIs); Nightmares = prazosin (alpha-1 blocker); Augmentation = venlafaxine. AVOID benzodiazepines — they impair fear extinction learning and worsen PTSD outcomes. Trauma-focused CBT and EMDR are evidence-based psychotherapies."
  },
  // ============================================================
  // AGACNP — ACUTE CARE NP (40 cards)
  // ============================================================
  {
    id: "agacnp-q1",
    type: "question",
    question: "A patient in the ICU has a pulmonary artery catheter showing: CVP 14 mmHg, PCWP 22 mmHg, CI 1.8 L/min/m², SVR 2400 dynes. What is the hemodynamic profile?",
    options: ["Cardiogenic shock", "Hypovolemic shock", "Septic shock (warm phase)", "Obstructive shock (PE)"],
    correctIndex: 0,
    answer: "Cardiogenic shock: elevated CVP and PCWP (preload high), low CI (<2.2), elevated SVR (compensatory vasoconstriction). Treatment: inotropes (dobutamine/milrinone), vasodilators if BP allows, mechanical support (IABP/Impella). Septic shock would show LOW SVR and HIGH CI. Hypovolemic shows low CVP/PCWP.",
    category: "Critical Care",
    difficulty: 3,
    clinicalPearl: "Hemodynamic profiles by shock type: Cardiogenic = ↑PCWP, ↓CI, ↑SVR; Hypovolemic = ↓PCWP, ↓CI, ↑SVR; Distributive/Septic = ↓PCWP, ↑CI (warm), ↓SVR; Obstructive = ↑CVP, ↓CI, ↑SVR with normal/low PCWP."
  },
  {
    id: "agacnp-q2",
    type: "question",
    question: "A mechanically ventilated patient on volume-controlled ventilation develops a sudden increase in peak inspiratory pressure (PIP) from 25 to 45 cmH₂O with unchanged plateau pressure of 20 cmH₂O. What is the most likely cause?",
    options: ["Pneumothorax", "Mucus plug or kinked ET tube", "ARDS progression", "Bronchospasm or airway obstruction"],
    correctIndex: 3,
    answer: "Elevated PIP with normal plateau pressure indicates increased airway resistance (not decreased compliance). Common causes: bronchospasm, mucus plug, kinked ETT, biting on tube. If BOTH PIP and plateau rise, suspect decreased compliance (pneumothorax, ARDS, atelectasis, abdominal distension).",
    category: "Critical Care",
    difficulty: 3,
    clinicalPearl: "PIP = airway resistance + compliance; Plateau = compliance only. PIP↑ + Plateau normal = airway problem (suction, bronchodilator, check tube). PIP↑ + Plateau↑ = compliance problem (chest X-ray, decompress). This is a classic board question pattern."
  },
  {
    id: "agacnp-q3",
    type: "question",
    question: "A patient with acute respiratory failure has the following ABG: pH 7.28, PaCO₂ 58 mmHg, PaO₂ 52 mmHg, HCO₃ 26 mEq/L on room air. What type of respiratory failure is present?",
    options: ["Type I (hypoxemic) respiratory failure only", "Type II (hypercapnic) respiratory failure", "Combined Type I and Type II respiratory failure", "Metabolic acidosis with respiratory compensation"],
    correctIndex: 2,
    answer: "This ABG shows both hypoxemia (PaO₂ <60) AND hypercapnia (PaCO₂ >45) with acute respiratory acidosis (normal HCO₃ suggests acute, not chronic). This is combined Type I + Type II respiratory failure. Common causes: severe COPD exacerbation, neuromuscular weakness with pneumonia, obesity hypoventilation syndrome.",
    category: "Critical Care",
    difficulty: 3,
    clinicalPearl: "Type I = hypoxemic (PaO₂ <60, normal/low PaCO₂) — V/Q mismatch, shunt, diffusion impairment. Type II = ventilatory/hypercapnic (PaCO₂ >45) — neuromuscular, COPD, obesity. If HCO₃ is elevated with chronic PaCO₂ elevation, it's chronic compensated. Acute: expect HCO₃ to rise 1 mEq/L per 10 mmHg PaCO₂ increase."
  },
  {
    id: "agacnp-q4",
    type: "question",
    question: "A post-operative cardiac surgery patient develops cardiac tamponade. What is the classic Beck's triad?",
    options: ["Hypertension, bradycardia, irregular respirations", "Hypotension, muffled heart sounds, JVD", "Tachycardia, hypoxia, hemoptysis", "Chest pain, dyspnea, friction rub"],
    correctIndex: 1,
    answer: "Beck's triad for cardiac tamponade: Hypotension (decreased cardiac output from impaired filling), Muffled/distant heart sounds (fluid buffer), and Jugular venous distension (impaired venous return). Pulsus paradoxus (>10 mmHg drop in SBP during inspiration) is also classic. Emergency treatment: pericardiocentesis.",
    category: "Critical Care",
    difficulty: 2,
    clinicalPearl: "Cardiac tamponade vs. tension pneumothorax: Both cause hypotension and JVD. Tamponade = muffled heart sounds, equalization of diastolic pressures on PA catheter. Tension pneumo = absent breath sounds on affected side, tracheal deviation. Treatment: tamponade → pericardiocentesis; tension pneumo → needle decompression."
  },
  {
    id: "agacnp-q5",
    type: "question",
    question: "A patient in septic shock is on norepinephrine 20 mcg/min with MAP 58 mmHg despite adequate fluid resuscitation. What is the recommended next vasopressor to add per Surviving Sepsis Campaign guidelines?",
    options: ["Phenylephrine", "Vasopressin 0.03 units/min", "Epinephrine", "Dopamine"],
    correctIndex: 1,
    answer: "Per Surviving Sepsis Campaign 2021 guidelines, vasopressin 0.03 units/min (fixed dose, not titrated) is recommended as the second vasopressor when norepinephrine alone cannot achieve MAP ≥65 mmHg. Adding vasopressin may allow norepinephrine dose reduction, potentially reducing arrhythmia risk.",
    category: "Critical Care",
    difficulty: 3,
    clinicalPearl: "Sepsis vasopressor ladder: 1st = Norepinephrine (first-line per SSC); 2nd = Vasopressin 0.03 u/min (added, not titrated); 3rd = Epinephrine (if cardiac dysfunction). Consider hydrocortisone 200 mg/day if vasopressor-dependent. Dopamine is no longer recommended as first-line."
  },
  {
    id: "agacnp-q6",
    type: "question",
    question: "An intubated patient is being evaluated for ventilator weaning. Which criteria must be met before a spontaneous breathing trial (SBT)?",
    options: ["FiO₂ >60% and PEEP >10 cmH₂O", "FiO₂ ≤40%, PEEP ≤8, adequate cough, hemodynamically stable", "Patient must be on zero sedation for 48 hours", "PaO₂/FiO₂ ratio >500"],
    correctIndex: 1,
    answer: "SBT readiness criteria: FiO₂ ≤40%, PEEP ≤5-8 cmH₂O, adequate cough and gag, hemodynamic stability (no or low-dose vasopressors), no active sedation infusion, no neuromuscular blockade, and resolution of the underlying cause of intubation. The rapid shallow breathing index (RSBI = RR/VT) <105 predicts successful extubation.",
    category: "Critical Care",
    difficulty: 3,
    clinicalPearl: "RSBI (Rapid Shallow Breathing Index) = Respiratory Rate / Tidal Volume (in liters). RSBI <105 = likely successful wean; >105 = likely failure. Example: RR 20, VT 0.4L → RSBI = 50 (good). RR 35, VT 0.2L → RSBI = 175 (likely failure)."
  },
  {
    id: "agacnp-q7",
    type: "question",
    question: "A patient presents with acute ST-elevation MI (STEMI) involving leads II, III, and aVF. Which coronary artery is most likely occluded?",
    options: ["Left anterior descending (LAD)", "Left circumflex (LCx)", "Right coronary artery (RCA)", "Left main coronary artery"],
    correctIndex: 2,
    answer: "ST elevation in leads II, III, aVF indicates inferior STEMI, most commonly from right coronary artery (RCA) occlusion (85% of cases). The RCA supplies the inferior wall, SA node, and AV node. Right ventricular involvement should be assessed with right-sided ECG leads (V4R). Avoid nitroglycerin and diuretics in RV infarction (preload-dependent).",
    category: "Critical Care",
    difficulty: 2,
    clinicalPearl: "ECG lead-coronary artery correlation: V1-V4 (anterior) = LAD; II, III, aVF (inferior) = RCA; I, aVL, V5-V6 (lateral) = LCx; V1-V4 with reciprocal inferior changes (extensive anterior) = proximal LAD (widow-maker)."
  },
  {
    id: "agacnp-q8",
    type: "question",
    question: "A patient with acute pancreatitis has a Ranson score of 6 on admission. The AGACNP should anticipate which complication?",
    options: ["Mild self-limited course with discharge in 48 hours", "Severe pancreatitis with >30% predicted mortality", "Surgical intervention within 24 hours", "Immediate ERCP regardless of etiology"],
    correctIndex: 1,
    answer: "Ranson score ≥3 at admission predicts severe pancreatitis. Score of 6 correlates with >30% mortality. Management: aggressive IV fluid resuscitation (250-500 mL/hr initially), pain management, NPO initially then early enteral nutrition via nasojejunal tube, ICU monitoring. CT with IV contrast to evaluate for necrotizing pancreatitis after 72 hours.",
    category: "Critical Care",
    difficulty: 3,
    clinicalPearl: "Ranson criteria at admission (GA LAW): Glucose >200, Age >55, LDH >350, AST >250, WBC >16,000. At 48h (C HOBBS): Calcium <8, Hematocrit drop >10%, O₂ (PaO₂) <60, BUN increase >5, Base deficit >4, Sequestration of fluid >6L. Each criterion = 1 point."
  },
  // ============================================================
  // PNP — PEDIATRIC NP (40 cards)
  // ============================================================
  {
    id: "pnp-q1",
    type: "question",
    question: "A 2-month-old infant presents with projectile, non-bilious vomiting after feeds, a palpable olive-shaped mass in the RUQ, and visible peristaltic waves. What is the most likely diagnosis?",
    options: ["Intussusception", "Pyloric stenosis", "Malrotation with volvulus", "Gastroesophageal reflux disease"],
    correctIndex: 1,
    answer: "Hypertrophic pyloric stenosis presents with non-bilious projectile vomiting in infants 2-8 weeks old (firstborn males at highest risk). The olive-shaped mass is the hypertrophied pylorus. Labs show hypochloremic, hypokalemic metabolic alkalosis from loss of HCl. Diagnosis confirmed by ultrasound (pyloric muscle thickness >4 mm, length >16 mm). Treatment: pyloromyotomy after fluid/electrolyte correction.",
    category: "Pediatrics",
    difficulty: 2,
    clinicalPearl: "Key differentiation: Pyloric stenosis = NON-bilious vomiting (obstruction is proximal to bile duct entry). Malrotation/volvulus = BILIOUS vomiting (obstruction is distal to ampulla of Vater). Bilious vomiting in a neonate is a surgical emergency until proven otherwise."
  },
  {
    id: "pnp-q2",
    type: "question",
    question: "At what age should the anterior fontanelle close in a healthy infant?",
    options: ["2-3 months", "6-8 months", "12-18 months", "24-36 months"],
    correctIndex: 2,
    answer: "The anterior fontanelle typically closes between 12-18 months. Early closure may indicate craniosynostosis (premature fusion of skull sutures). Late closure (>18 months) may indicate hypothyroidism, rickets, hydrocephalus, or Down syndrome. The posterior fontanelle closes by 2-3 months.",
    category: "Pediatrics",
    difficulty: 1,
    clinicalPearl: "Fontanelle assessment: Bulging fontanelle = increased ICP (meningitis, hydrocephalus); Sunken fontanelle = dehydration. Always assess fontanelle with infant upright and calm (crying increases ICP and causes bulging)."
  },
  {
    id: "pnp-q3",
    type: "question",
    question: "A 4-year-old presents with a barking cough, inspiratory stridor, and a 'steeple sign' on anteroposterior neck X-ray. What is the first-line treatment?",
    options: ["IV antibiotics and intubation", "Racemic epinephrine and dexamethasone", "Albuterol nebulizer", "Amoxicillin-clavulanate oral"],
    correctIndex: 1,
    answer: "Croup (laryngotracheobronchitis) presents with barking cough, inspiratory stridor, and steeple sign (subglottic narrowing on AP X-ray). Treatment: dexamethasone 0.6 mg/kg PO/IM (single dose), and racemic epinephrine nebulization for moderate-severe cases. Most cases are viral (parainfluenza virus). Humidified air and comfort measures for mild cases.",
    category: "Pediatrics",
    difficulty: 2,
    clinicalPearl: "Croup vs. Epiglottitis: Croup = gradual onset, barking cough, steeple sign, viral; Epiglottitis = acute onset, drooling, tripod positioning, thumb sign on lateral X-ray, bacterial (H. influenzae). Epiglottitis is rare since Hib vaccination but remains a true emergency."
  },
  {
    id: "pnp-q4",
    type: "question",
    question: "A 6-month-old infant has eczema, bloody stools, and failure to thrive. IgE-mediated skin prick testing to cow's milk protein is positive. What is the recommended management?",
    options: ["Switch to soy-based formula", "Extensively hydrolyzed casein formula", "Continue breastfeeding without dietary changes", "Start solid foods early to build tolerance"],
    correctIndex: 1,
    answer: "Cow's milk protein allergy (CMPA) with significant symptoms requires extensively hydrolyzed formula (e.g., Alimentum, Nutramigen) as first-line. Soy cross-reactivity occurs in 10-14% of CMPA infants. If symptoms persist, amino acid-based formula (EleCare, Neocate) is used. If breastfeeding, mother should eliminate dairy from her diet.",
    category: "Pediatrics",
    difficulty: 2,
    clinicalPearl: "CMPA formula hierarchy: 1st = Extensively hydrolyzed casein (Nutramigen/Alimentum); 2nd = Amino acid-based (EleCare/Neocate) if still symptomatic; Avoid = soy (10-14% cross-react), goat/sheep milk (high cross-reactivity). Most children outgrow CMPA by age 3-5."
  },
  {
    id: "pnp-q5",
    type: "question",
    question: "A 3-year-old with sickle cell disease presents with fever of 39.5°C (103.1°F), tachycardia, and pallor. What is the priority action?",
    options: ["Oral acetaminophen and observation", "Blood cultures and IV ceftriaxone within 1 hour", "Hydroxyurea dose increase", "Refer to hematology outpatient in 48 hours"],
    correctIndex: 1,
    answer: "Fever >38.5°C in sickle cell disease is a medical emergency due to functional asplenia and high risk for overwhelming sepsis (encapsulated organisms: S. pneumoniae, H. influenzae, Salmonella). Obtain blood cultures and start empiric IV ceftriaxone (or cefotaxime) immediately. Do not delay antibiotics for workup completion.",
    category: "Pediatrics",
    difficulty: 2,
    clinicalPearl: "Sickle cell disease emergencies requiring immediate evaluation: Fever >38.5°C (sepsis risk), acute chest syndrome (new infiltrate + respiratory symptoms), splenic sequestration (sudden splenic enlargement + dropping Hgb), aplastic crisis (parvovirus B19 + severe anemia), stroke (acute neurological changes)."
  },
  {
    id: "pnp-q6",
    type: "question",
    question: "A 5-year-old presents with periorbital edema, proteinuria (4+), hypoalbuminemia (1.8 g/dL), and hyperlipidemia. What is the most likely diagnosis and first-line treatment?",
    options: ["Nephritic syndrome — IV methylprednisolone", "Minimal change disease (nephrotic syndrome) — oral prednisone", "Focal segmental glomerulosclerosis — cyclophosphamide", "IgA nephropathy — ACE inhibitor"],
    correctIndex: 1,
    answer: "Minimal change disease is the most common cause of nephrotic syndrome in children (77-85% of cases). Classic triad: massive proteinuria, hypoalbuminemia (<2.5 g/dL), and edema. Treatment: oral prednisone 2 mg/kg/day for 6 weeks, then taper. 90% respond to corticosteroids. If steroid-resistant, renal biopsy is indicated.",
    category: "Pediatrics",
    difficulty: 2,
    clinicalPearl: "Nephrotic vs. Nephritic: Nephrotic = massive proteinuria, hypoalbuminemia, edema, hyperlipidemia (minimal hematuria). Nephritic = hematuria (cola-colored urine), hypertension, oliguria, mild proteinuria. Most common childhood forms: Nephrotic = minimal change disease; Nephritic = post-streptococcal GN."
  },
  {
    id: "pnp-q7",
    type: "question",
    question: "According to the CDC immunization schedule, which vaccines are given at the 12-month well-child visit?",
    options: ["DTaP, IPV, Hep B", "MMR, Varicella, Hep A (dose 1), PCV13 (dose 4)", "Tdap, Meningococcal, HPV", "Influenza and Rotavirus"],
    correctIndex: 1,
    answer: "The 12-month visit includes: MMR (dose 1), Varicella (dose 1), Hepatitis A (dose 1, with dose 2 at least 6 months later), and PCV13 (4th dose). This is also when Hib booster is given. The 12-15 month window is critical for live vaccines (MMR, Varicella) which require maternal antibody waning.",
    category: "Pediatrics",
    difficulty: 1,
    clinicalPearl: "Live vaccines at 12 months: MMR and Varicella (can be given as MMRV combination). Must wait 28 days between live vaccines if not given simultaneously. Hep A dose 1 at 12 months, dose 2 at least 6 months later. Annual influenza vaccine starts at 6 months."
  },
  {
    id: "pnp-q8",
    type: "question",
    question: "A 10-year-old presents with a limp, knee pain, and limited internal rotation of the hip. X-ray shows femoral head displacement. What is the diagnosis?",
    options: ["Legg-Calvé-Perthes disease", "Slipped capital femoral epiphysis (SCFE)", "Transient synovitis", "Osgood-Schlatter disease"],
    correctIndex: 1,
    answer: "Slipped capital femoral epiphysis (SCFE) occurs in obese adolescents (10-16 years) when the femoral head displaces posteriorly and inferiorly through the growth plate. Classic presentation: hip/knee pain with limp and limited internal rotation. Frog-leg lateral X-ray is diagnostic. Treatment: surgical pinning (in situ screw fixation). Patient must be non-weight-bearing until surgery.",
    category: "Pediatrics",
    difficulty: 2,
    clinicalPearl: "Pediatric hip pain by age: 0-4 years = developmental dysplasia of hip (DDH); 4-10 years = Legg-Calvé-Perthes (avascular necrosis); 10-16 years = SCFE. Remember: hip pathology in children often presents as KNEE pain (referred pain via obturator nerve). Always examine the hip when a child complains of knee pain."
  },
  // ============================================================
  // WHNP — WOMEN'S HEALTH NP (30 cards)
  // ============================================================
  {
    id: "whnp-q1",
    type: "question",
    question: "A 35-year-old G3P2 at 28 weeks gestation has a 1-hour glucose tolerance test result of 195 mg/dL. What is the next step?",
    options: ["Diagnose gestational diabetes and start insulin", "Perform a 3-hour glucose tolerance test", "Repeat the 1-hour test in 2 weeks", "Diagnose gestational diabetes and start dietary management"],
    correctIndex: 3,
    answer: "A 1-hour GCT ≥190 mg/dL (some guidelines use ≥200) is diagnostic of GDM without needing a confirmatory 3-hour GTT. Values 130-189 mg/dL require a 3-hour GTT for confirmation (Carpenter-Coustan criteria). Initial management: medical nutrition therapy (MNT), blood glucose self-monitoring (fasting <95, 1-hr postprandial <140, 2-hr <120). Insulin if diet fails.",
    category: "Women's Health",
    difficulty: 2,
    clinicalPearl: "GDM screening: Universal screening at 24-28 weeks. High-risk women (BMI >30, prior GDM, A1c >5.7%) should be screened early in pregnancy. Metformin and glyburide are used when diet fails, but insulin remains the gold standard per ACOG. Postpartum: recheck with 75g OGTT at 4-12 weeks."
  },
  {
    id: "whnp-q2",
    type: "question",
    question: "A 52-year-old postmenopausal woman reports hot flashes, night sweats, and vaginal dryness affecting her quality of life. She has no history of breast cancer or VTE. What is the most effective treatment?",
    options: ["Black cohosh supplement", "Combined estrogen-progestogen hormone therapy", "Gabapentin", "Vaginal moisturizer only"],
    correctIndex: 1,
    answer: "Combined EPT (estrogen + progestogen) is the gold standard for moderate-severe vasomotor symptoms in women with an intact uterus. Progestogen is required to prevent endometrial hyperplasia. For women within 10 years of menopause onset and <60 years old, benefits generally outweigh risks (WHI reanalysis). Transdermal estrogen preferred to reduce VTE risk.",
    category: "Women's Health",
    difficulty: 2,
    clinicalPearl: "HRT decision framework: Uterus present = estrogen + progestogen; Post-hysterectomy = estrogen only. Transdermal > oral for VTE/stroke risk. Contraindications: breast cancer, active VTE, unexplained vaginal bleeding, active liver disease, coronary heart disease. Low-dose vaginal estrogen for GSM only (minimal systemic absorption)."
  },
  {
    id: "whnp-q3",
    type: "question",
    question: "A 28-year-old woman desires long-acting reversible contraception (LARC). She has a history of heavy menstrual bleeding and dysmenorrhea. Which LARC is most beneficial for her?",
    options: ["Copper IUD (Paragard)", "Levonorgestrel IUD (Mirena)", "Etonogestrel implant (Nexplanon)", "Depot medroxyprogesterone acetate (Depo-Provera)"],
    correctIndex: 1,
    answer: "The levonorgestrel IUD (Mirena) is ideal for this patient as it treats both heavy menstrual bleeding and dysmenorrhea while providing highly effective contraception (99.8%). It reduces menstrual blood loss by 90% and is FDA-approved for HMB treatment. The copper IUD would worsen heavy bleeding. Depo-Provera is not technically a LARC.",
    category: "Women's Health",
    difficulty: 2,
    clinicalPearl: "LARC options: Levonorgestrel IUD (Mirena 7yr, Kyleena 5yr, Liletta 8yr, Skyla 3yr) — reduces bleeding; Copper IUD (Paragard 10yr) — hormone-free but increases bleeding; Nexplanon (3yr) — unpredictable bleeding pattern. LARC is first-line contraception per ACOG for all ages including nulliparous adolescents."
  },
  {
    id: "whnp-q4",
    type: "question",
    question: "A woman presents with a positive home pregnancy test, vaginal spotting, and right adnexal pain. Transvaginal ultrasound shows no intrauterine pregnancy. Serum beta-hCG is 1,800 mIU/mL. What is the next step?",
    options: ["Repeat beta-hCG in 48 hours", "Administer methotrexate immediately", "Emergency surgical intervention", "Reassure and schedule routine prenatal care"],
    correctIndex: 0,
    answer: "With beta-hCG below the discriminatory zone (typically 1,500-3,500 mIU/mL depending on institution), the next step is serial beta-hCG in 48 hours. Normal IUP should show ≥53% rise in 48 hours. Abnormal rise or plateau suggests ectopic. If hemodynamically unstable or beta-hCG above discriminatory zone with no IUP on TVUS, ectopic is diagnosed.",
    category: "Women's Health",
    difficulty: 3,
    clinicalPearl: "Ectopic pregnancy management: Methotrexate (medical) if hemodynamically stable, unruptured, beta-hCG <5,000, no fetal cardiac activity, ectopic <3.5 cm. Surgery if ruptured, hemodynamically unstable, contraindication to methotrexate, or failed medical management. After methotrexate: avoid folate supplements, NSAIDs, alcohol, sun exposure, and intercourse until beta-hCG is undetectable."
  },
  {
    id: "whnp-q5",
    type: "question",
    question: "A 45-year-old woman has a Pap smear result of ASC-US with positive high-risk HPV. What is the recommended next step per ASCCP guidelines?",
    options: ["Repeat Pap in 1 year", "Colposcopy", "HPV vaccination", "LEEP procedure"],
    correctIndex: 1,
    answer: "ASC-US with positive high-risk HPV requires colposcopy per ASCCP 2019 risk-based management guidelines. The combination of ASC-US + hrHPV+ places the patient at sufficient risk for CIN 2+ to warrant tissue evaluation. If HPV 16/18 specifically positive, colposcopy is strongly recommended regardless of cytology.",
    category: "Women's Health",
    difficulty: 2,
    clinicalPearl: "Cervical cancer screening: Age 21-29 = cytology alone q3y; Age 25-65 = primary HPV testing q5y (preferred) or co-testing q5y; Age >65 with adequate prior screening = discontinue. ASC-US + HPV negative = repeat in 3 years. ASC-US + HPV positive = colposcopy."
  },
  // ============================================================
  // ENP — EMERGENCY NP (30 cards)
  // ============================================================
  {
    id: "enp-q1",
    type: "question",
    question: "A 25-year-old male presents after a motorcycle accident with a GCS of 8, BP 80/50, HR 130, and distended abdomen. Which intervention takes priority?",
    options: ["CT scan of the abdomen", "Intubation for airway protection", "Massive transfusion protocol activation", "FAST examination"],
    correctIndex: 1,
    answer: "Per ATLS protocol, Airway always takes priority. GCS ≤8 requires definitive airway (endotracheal intubation). After securing airway: Breathing assessment, then Circulation (IV access, MTP activation, FAST exam). The ABCDE approach is non-negotiable in trauma: Airway, Breathing, Circulation, Disability, Exposure.",
    category: "Emergency Medicine",
    difficulty: 2,
    clinicalPearl: "ATLS primary survey order: A-Airway (with C-spine protection), B-Breathing, C-Circulation (hemorrhage control), D-Disability (neuro status), E-Exposure. Never skip steps. Intubate at GCS ≤8. Massive transfusion protocol: 1:1:1 ratio of pRBCs:FFP:platelets."
  },
  {
    id: "enp-q2",
    type: "question",
    question: "A patient presents with severe anaphylaxis: urticaria, angioedema, stridor, and hypotension (BP 70/40). Epinephrine 0.3 mg IM has been administered. Symptoms persist after 5 minutes. What is the next step?",
    options: ["IV diphenhydramine and observe", "Repeat epinephrine 0.3 mg IM", "Start epinephrine IV drip", "Administer IV methylprednisolone"],
    correctIndex: 1,
    answer: "Repeat IM epinephrine q5-15 minutes (same dose 0.3-0.5 mg, 1:1000 concentration IM) for persistent anaphylaxis. Up to 3 doses IM may be given. If refractory after 2-3 IM doses, initiate IV epinephrine infusion (1:10,000 or 1:100,000 concentration). Adjuncts: IV fluids, H1/H2 blockers, corticosteroids (prevent biphasic reaction).",
    category: "Emergency Medicine",
    difficulty: 2,
    clinicalPearl: "Epinephrine in anaphylaxis: IM 1:1000 (1 mg/mL) anterolateral thigh. NEVER give 1:1000 IV (cardiac arrest dose). IV epinephrine infusion for refractory anaphylaxis: start 1-4 mcg/min, titrate. Observe all anaphylaxis patients 4-6 hours minimum (biphasic reaction occurs in 5-20% of cases, up to 72 hours later)."
  },
  {
    id: "enp-q3",
    type: "question",
    question: "A 60-year-old presents with sudden-onset, worst headache of life, and a normal non-contrast CT head performed 2 hours after symptom onset. What is the next diagnostic step?",
    options: ["MRI brain with gadolinium", "Lumbar puncture", "CT angiography", "Discharge with migraine diagnosis"],
    correctIndex: 1,
    answer: "A thunderclap headache (worst headache of life) raises concern for subarachnoid hemorrhage (SAH). Non-contrast CT detects SAH in 98% of cases within 6 hours, but sensitivity decreases over time. If CT is negative within 6 hours of onset, LP is still recommended to evaluate for xanthochromia (yellow discoloration from bilirubin breakdown of RBCs in CSF). CTA may also be performed to evaluate for aneurysm.",
    category: "Emergency Medicine",
    difficulty: 3,
    clinicalPearl: "SAH workup: CT head sensitivity is 98% at <6h, drops to 86% at 6-12h, and 50% at >12h. LP findings in SAH: elevated opening pressure, RBCs that do NOT clear with sequential tubes, and xanthochromia (yellow supernatant, most reliable after 12h). If LP positive → CTA or conventional angiography to find the aneurysm source."
  },
  {
    id: "enp-q4",
    type: "question",
    question: "A patient presents after ingesting an unknown amount of acetaminophen 6 hours ago. Serum acetaminophen level is 180 mcg/mL. According to the Rumack-Matthew nomogram, what is the appropriate treatment?",
    options: ["Activated charcoal only", "N-acetylcysteine (NAC) protocol", "Observation with serial levels", "Hemodialysis"],
    correctIndex: 1,
    answer: "At 6 hours post-ingestion, a level of 180 mcg/mL falls above the treatment line on the Rumack-Matthew nomogram (treatment threshold at 4h is 150, at 6h approximately 100). NAC must be initiated. The 21-hour IV protocol (150 mg/kg over 1h, then 50 mg/kg over 4h, then 100 mg/kg over 16h) is preferred over the 72-hour oral protocol in the ED.",
    category: "Emergency Medicine",
    difficulty: 3,
    clinicalPearl: "Acetaminophen toxicity: Plot serum level on Rumack-Matthew nomogram at ≥4 hours post-ingestion. NAC is most effective within 8 hours but still beneficial up to 24 hours or later. Check AST/ALT, INR, creatinine, and lactate. Hepatotoxic dose: >150 mg/kg (or >7.5-10 g in adults). Peak liver injury at 72-96 hours post-ingestion."
  },
  {
    id: "enp-q5",
    type: "question",
    question: "A 45-year-old presents with acute onset chest pain, tachycardia, hypoxia, and a swollen right calf. D-dimer is elevated. CT pulmonary angiography confirms a saddle pulmonary embolism with RV strain. What is the classification?",
    options: ["Low-risk PE", "Submassive PE", "Massive PE", "Chronic thromboembolic pulmonary hypertension"],
    correctIndex: 1,
    answer: "Submassive PE = hemodynamically stable BUT with evidence of RV dysfunction (RV dilation on CT/echo, elevated troponin, elevated BNP, RV/LV ratio >0.9). Massive PE = hemodynamically UNSTABLE (SBP <90 for ≥15 min or requiring vasopressors). Treatment for submassive: anticoagulation with heparin; consider thrombolytics if clinical deterioration. Massive PE: systemic thrombolytics (alteplase 100 mg IV), surgical embolectomy, or catheter-directed therapy.",
    category: "Emergency Medicine",
    difficulty: 3,
    clinicalPearl: "PE risk stratification: Low risk = stable + no RV strain + normal biomarkers → anticoagulate outpatient. Submassive = stable + RV strain or elevated biomarkers → anticoagulate, ICU, consider thrombolytics if deteriorating. Massive = unstable → thrombolytics (alteplase 100 mg over 2h), ECMO, or surgical embolectomy."
  },
  // ============================================================
  // AGPCNP — ADULT-GERONTOLOGY PRIMARY CARE (30 cards)
  // ============================================================
  {
    id: "agpcnp-q1",
    type: "question",
    question: "A 72-year-old male presents with urinary hesitancy, nocturia (4 times/night), and weak stream. PSA is 2.8 ng/mL. DRE reveals a smooth, symmetrically enlarged prostate. What is the first-line pharmacotherapy?",
    options: ["Finasteride (5-alpha reductase inhibitor)", "Tamsulosin (alpha-1 blocker)", "Oxybutynin (anticholinergic)", "Ciprofloxacin (antibiotic)"],
    correctIndex: 1,
    answer: "Alpha-1 blockers (tamsulosin, alfuzosin, silodosin) are first-line for moderate BPH/LUTS. They relax smooth muscle in the prostate and bladder neck, providing rapid symptom relief (within days). 5-alpha reductase inhibitors (finasteride, dutasteride) are added for large prostates (>30-40 mL) but take 6-12 months for effect. PSA 2.8 with smooth enlargement suggests BPH, not cancer.",
    category: "Primary Care",
    difficulty: 2,
    clinicalPearl: "BPH medication pearls: Tamsulosin = most uroselective alpha-blocker (less orthostatic hypotension); counsel about intraoperative floppy iris syndrome if cataract surgery planned. Finasteride reduces PSA by ~50% — double the PSA value for accurate screening. Combination therapy (alpha-blocker + 5-ARI) is superior for large prostates."
  },
  {
    id: "agpcnp-q2",
    type: "question",
    question: "A 68-year-old female with osteoporosis (T-score -2.8 at lumbar spine) has been on alendronate for 6 years. She asks about continuing bisphosphonate therapy. What is the recommended approach?",
    options: ["Continue alendronate indefinitely", "Discontinue immediately and switch to calcium/vitamin D only", "Consider a drug holiday with reassessment in 2-3 years", "Switch to teriparatide for an additional 5 years"],
    correctIndex: 2,
    answer: "After 5 years of oral bisphosphonate therapy (or 3 years of IV zoledronic acid), a drug holiday should be considered for patients at moderate fracture risk. Bisphosphonates accumulate in bone and continue to provide protection for 2-5 years after discontinuation. Reassess with DXA, FRAX score, and fracture history. High-risk patients may continue longer.",
    category: "Primary Care",
    difficulty: 2,
    clinicalPearl: "Bisphosphonate holiday criteria: Consider after 5 years oral / 3 years IV if T-score >-2.5, no recent fracture, and stable DXA. Continue if T-score <-2.5, prior vertebral fracture, or high FRAX score. Rare but serious risks of prolonged use: atypical femoral fractures and osteonecrosis of the jaw. Reassess every 2-3 years during holiday."
  },
  {
    id: "agpcnp-q3",
    type: "question",
    question: "A 65-year-old diabetic patient with CKD stage 3b (eGFR 38 mL/min) has an A1c of 8.2%. Metformin is currently held. Which glucose-lowering agent has proven cardiovascular and renal benefits in this population?",
    options: ["Glipizide (sulfonylurea)", "Empagliflozin (SGLT2 inhibitor)", "Pioglitazone (thiazolidinedione)", "Acarbose (alpha-glucosidase inhibitor)"],
    correctIndex: 1,
    answer: "SGLT2 inhibitors (empagliflozin, dapagliflozin, canagliflozin) have proven cardiovascular and renal protective benefits independent of glucose lowering. The EMPA-REG, CREDENCE, and DAPA-CKD trials demonstrated reduced heart failure hospitalization, cardiovascular death, and CKD progression. Can be used down to eGFR 20 mL/min for cardiorenal benefit (though glucose-lowering efficacy decreases below eGFR 45).",
    category: "Primary Care",
    difficulty: 3,
    clinicalPearl: "SGLT2 inhibitor cardiorenal benefits are a class effect. ADA 2024 guidelines: Use SGLT2i in T2DM with established CVD, heart failure, or CKD regardless of A1c. Side effects: genital mycotic infections, euglycemic DKA (rare), volume depletion. Hold before surgery and during acute illness."
  },
  {
    id: "agpcnp-q4",
    type: "question",
    question: "An 80-year-old patient scores 22/30 on the MMSE and 3/5 on delayed word recall. Family reports progressive memory loss over 18 months with preserved ADLs. What is the most likely diagnosis?",
    options: ["Normal aging", "Mild cognitive impairment (MCI)", "Alzheimer's disease (mild stage)", "Delirium"],
    correctIndex: 2,
    answer: "MMSE 20-24 with progressive memory decline over >6 months and preserved basic ADLs (but impaired IADLs) suggests mild Alzheimer's disease. MCI would show less functional impact. Delirium has acute onset with fluctuating consciousness. Workup: CBC, CMP, TSH, B12, folate, RPR, and brain MRI to rule out reversible causes.",
    category: "Primary Care",
    difficulty: 2,
    clinicalPearl: "Dementia workup to rule out reversible causes (the 'reversible dementias'): Hypothyroidism (TSH), B12 deficiency, normal pressure hydrocephalus (triad: gait apraxia, urinary incontinence, dementia), depression (pseudodementia), medication effects, and neurosyphilis (RPR). Cholinesterase inhibitors (donepezil) are first-line for mild-moderate AD."
  },
  {
    id: "agpcnp-q5",
    type: "question",
    question: "A 70-year-old presents with unilateral temporal headache, jaw claudication, ESR 85 mm/h, and CRP 45 mg/L. What is the immediate priority?",
    options: ["Schedule temporal artery biopsy within 2 weeks", "Start high-dose prednisone 40-60 mg/day immediately", "Prescribe sumatriptan for suspected migraine", "Order MRI brain with gadolinium"],
    correctIndex: 1,
    answer: "Giant cell arteritis (GCA/temporal arteritis) requires immediate high-dose prednisone (40-60 mg/day, or IV methylprednisolone 1 g/day x 3 days if visual symptoms present) to prevent irreversible vision loss. Do NOT wait for biopsy results to initiate treatment. Temporal artery biopsy should be performed within 2 weeks of starting steroids (inflammation persists for weeks on biopsy).",
    category: "Primary Care",
    difficulty: 2,
    clinicalPearl: "GCA red flags requiring emergent treatment: Visual symptoms (amaurosis fugax, diplopia, vision loss). Always check for concurrent polymyalgia rheumatica (50% overlap: bilateral shoulder/hip girdle stiffness). Long-term steroid taper over 1-2 years with monitoring of ESR/CRP. Tocilizumab is now FDA-approved as steroid-sparing agent."
  },
  // ============================================================
  // FNP — FAMILY NP CORE (20 cards)
  // ============================================================
  {
    id: "fnp-q1",
    type: "question",
    question: "A 45-year-old presents with a 10-year cardiovascular risk of 12% (ASCVD risk calculator), LDL 145 mg/dL, and no diabetes or clinical ASCVD. What is the recommended statin intensity?",
    options: ["No statin indicated", "Low-intensity statin", "Moderate-intensity statin", "High-intensity statin"],
    correctIndex: 2,
    answer: "Per ACC/AHA 2018 cholesterol guidelines: 10-year ASCVD risk 7.5-19.9% is a borderline/intermediate risk group where moderate-intensity statin therapy is recommended if risk-enhancing factors are present (LDL 145 is a risk enhancer). Moderate-intensity statins (atorvastatin 10-20 mg, rosuvastatin 5-10 mg) lower LDL by 30-49%.",
    category: "Primary Care",
    difficulty: 2,
    clinicalPearl: "Statin intensity classification: High = LDL reduction ≥50% (atorvastatin 40-80, rosuvastatin 20-40); Moderate = 30-49% reduction; Low = <30%. Four statin benefit groups: 1) Clinical ASCVD, 2) LDL ≥190, 3) Diabetes age 40-75, 4) 10-year ASCVD risk ≥7.5%. Risk enhancers include: family history, CRP >2, ABI <0.9, South Asian ancestry."
  },
  {
    id: "fnp-q2",
    type: "question",
    question: "A 32-year-old female presents with fatigue, weight gain, constipation, and dry skin. TSH is 12.5 mIU/L (elevated) and free T4 is 0.6 ng/dL (low). Anti-TPO antibodies are positive. What is the diagnosis and treatment?",
    options: ["Subclinical hypothyroidism — observe", "Hashimoto's thyroiditis — levothyroxine replacement", "Graves' disease — methimazole", "Euthyroid sick syndrome — no treatment"],
    correctIndex: 1,
    answer: "Elevated TSH with low free T4 and positive anti-TPO antibodies confirms Hashimoto's thyroiditis (autoimmune thyroiditis) with overt hypothyroidism. Treatment: levothyroxine 1.6 mcg/kg/day, taken on empty stomach 30-60 minutes before breakfast. Recheck TSH in 6-8 weeks and titrate to goal TSH 0.5-2.5 mIU/L.",
    category: "Primary Care",
    difficulty: 2,
    clinicalPearl: "Levothyroxine interactions to counsel: Separate from calcium, iron, and antacids by 4 hours; coffee by 1 hour. Take on empty stomach. Biotin supplements can falsely alter thyroid lab results. Pregnancy increases levothyroxine requirement by 25-50% — check TSH every 4 weeks in first half of pregnancy."
  },
  {
    id: "fnp-q3",
    type: "question",
    question: "A 55-year-old presents with acute onset of monoarticular joint swelling, erythema, and extreme tenderness at the first MTP joint. Serum uric acid is 9.8 mg/dL. What is the first-line treatment for acute gout flare?",
    options: ["Allopurinol", "Colchicine, NSAIDs, or corticosteroids", "Probenecid", "Febuxostat"],
    correctIndex: 1,
    answer: "Acute gout treatment options: NSAIDs (indomethacin, naproxen), colchicine (most effective within 12 hours of onset, 1.2 mg then 0.6 mg 1 hour later), or corticosteroids (prednisone 30-40 mg/day x 5 days for patients who cannot take NSAIDs/colchicine). Do NOT start allopurinol during an acute flare — it can worsen the attack. Urate-lowering therapy is initiated 2-4 weeks after flare resolution.",
    category: "Primary Care",
    difficulty: 2,
    clinicalPearl: "Gout management phases: 1) Acute flare = anti-inflammatory (NSAID/colchicine/steroid); 2) Chronic urate-lowering = allopurinol (start low 100 mg, titrate to uric acid <6 mg/dL); 3) Flare prophylaxis = low-dose colchicine 0.6 mg daily for 3-6 months when starting ULT. Joint aspiration showing negatively birefringent needle-shaped crystals is gold standard diagnosis."
  },
];
