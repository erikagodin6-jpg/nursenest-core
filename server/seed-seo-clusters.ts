import { Pool } from "pg";

interface ClusterHub {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  pageType: "pillar";
  exam: string;
  contentHtml: string;
  toc: { id: string; label: string; level: number }[];
  faq: { question: string; answer: string }[];
  internalLinks: { url: string; anchor: string; context: string }[];
  children: ClusterChild[];
}

interface ClusterChild {
  slug: string;
  lessonId: string;
  anchor: string;
}

const clusters: ClusterHub[] = [
  {
    slug: "electrolytes-acid-base-nursing-guide",
    title: "Electrolytes & Acid-Base Balance: Complete Nursing Study Guide",
    metaTitle: "Electrolytes & Acid-Base Nursing Guide (NCLEX & REx-PN Prep) | NurseNest",
    metaDescription: "Master electrolyte imbalances, ABG interpretation, and acid-base balance. Comprehensive nursing study guide with Na, K, Ca, Mg disorders and IV fluids.",
    pageType: "pillar",
    exam: "NCLEX-RN",
    contentHtml: `<article>
<h1>Electrolytes & Acid-Base Balance: Complete Nursing Study Guide</h1>
<p class="lead">Electrolyte imbalances and acid-base disorders are among the most heavily tested topics on the NCLEX-RN and REX-PN exams. This comprehensive hub page links you to detailed lessons on each electrolyte, ABG interpretation, IV fluid therapy, and clinical decision-making frameworks.</p>

<section id="sodium-disorders">
<h2>Sodium Disorders (Na⁺)</h2>
<p>Sodium is the most abundant extracellular cation (normal: 135-145 mEq/L) and the primary determinant of serum osmolality. Understanding hyponatremia and hypernatremia is essential for safe IV fluid management and recognizing neurological emergencies.</p>
<p><strong>Key concepts:</strong> SIADH vs. diabetes insipidus, correction rate limits (osmotic demyelination), hypertonic saline indications, and fluid restriction protocols.</p>
<div class="exam-trap"><strong>Exam Trap:</strong> Don't confuse dilutional hyponatremia (fluid overload) with depletional hyponatremia (sodium loss). Treatment differs significantly — fluid restriction vs. saline replacement.</div>
</section>

<section id="potassium-disorders">
<h2>Potassium Disorders (K⁺)</h2>
<p>Potassium (normal: 3.5-5.0 mEq/L) is critical for cardiac rhythm and neuromuscular function. Both hypokalemia and hyperkalemia can cause life-threatening dysrhythmias. Recognizing ECG changes is a priority nursing competency.</p>
<p><strong>Key ECG patterns:</strong> Hypokalemia → flattened T waves, U waves. Hyperkalemia → tall peaked T waves, widened QRS, sine wave.</p>
<div class="exam-trap"><strong>Exam Trap:</strong> Never give IV potassium by push. Maximum infusion rate is 10-20 mEq/hour with cardiac monitoring. This is a common NCLEX safety question.</div>
</section>

<section id="calcium-magnesium">
<h2>Calcium & Magnesium Disorders</h2>
<p>Calcium (normal: 8.5-10.5 mg/dL) and magnesium (normal: 1.5-2.5 mEq/L) imbalances frequently coexist. Trousseau's and Chvostek's signs are hallmark assessment findings for hypocalcemia. Magnesium sulfate is a critical medication in preeclampsia management.</p>
<p><strong>Clinical pearl:</strong> You must correct hypomagnesemia before hypokalemia will correct. Always check magnesium levels when potassium is persistently low.</p>
</section>

<section id="abg-interpretation">
<h2>ABG Interpretation</h2>
<p>Arterial blood gas analysis is a foundational skill for determining acid-base status. Use the ROME method: Respiratory = Opposite (pH and CO2), Metabolic = Equal (pH and HCO3). Understanding compensation mechanisms (respiratory vs. metabolic) is essential.</p>
<p><strong>Normal values:</strong> pH 7.35-7.45 | PaCO2 35-45 mmHg | HCO3 22-26 mEq/L | PaO2 80-100 mmHg</p>
</section>

<section id="iv-fluids">
<h2>IV Fluid Therapy</h2>
<p>Selecting the correct IV fluid requires understanding tonicity: isotonic (0.9% NS, LR), hypotonic (0.45% NS, D5W), and hypertonic (3% saline). Each has specific indications and contraindications that the NCLEX tests frequently.</p>
<div class="exam-trap"><strong>Exam Trap:</strong> D5W is isotonic in the bag but becomes hypotonic once the dextrose is metabolized. Never use hypotonic solutions for patients with increased ICP.</div>
</section>

<section id="practice-questions">
<h2>Practice Questions & Flashcards</h2>
<p>Test your knowledge with our electrolyte-focused flashcard decks and practice questions. Each deck uses spaced repetition to reinforce weak areas.</p>
</section>
</article>`,
    toc: [
      { id: "sodium-disorders", label: "Sodium Disorders", level: 2 },
      { id: "potassium-disorders", label: "Potassium Disorders", level: 2 },
      { id: "calcium-magnesium", label: "Calcium & Magnesium", level: 2 },
      { id: "abg-interpretation", label: "ABG Interpretation", level: 2 },
      { id: "iv-fluids", label: "IV Fluid Therapy", level: 2 },
      { id: "practice-questions", label: "Practice Questions", level: 2 },
    ],
    faq: [
      { question: "What are the most common electrolyte imbalances on NCLEX?", answer: "Hypokalemia, hyperkalemia, hyponatremia, and hypocalcemia are the most frequently tested electrolyte disorders on the NCLEX. Focus on ECG changes for potassium and neuromuscular signs for calcium." },
      { question: "How do I remember ABG interpretation?", answer: "Use the ROME method: Respiratory = Opposite (pH and PaCO2 move in opposite directions), Metabolic = Equal (pH and HCO3 move in the same direction). Then check for compensation." },
      { question: "What is the difference between respiratory and metabolic acidosis?", answer: "Respiratory acidosis is caused by CO2 retention (COPD, respiratory depression). Metabolic acidosis is caused by bicarbonate loss or acid accumulation (DKA, renal failure, diarrhea)." },
      { question: "Why can't you give IV potassium by push?", answer: "IV potassium push can cause fatal cardiac arrest. It must be diluted and infused slowly (max 10-20 mEq/hour) with cardiac monitoring. This is a critical patient safety principle." },
      { question: "When do you use hypertonic vs hypotonic IV fluids?", answer: "Hypertonic (3% saline) is used for severe symptomatic hyponatremia. Hypotonic (0.45% NS) is used for hypernatremia. Never use hypotonic solutions in increased ICP or burns." },
    ],
    internalLinks: [
      { url: "/lessons/hyponatremia", anchor: "Hyponatremia nursing guide", context: "electrolytes" },
      { url: "/lessons/hypernatremia", anchor: "Hypernatremia assessment & management", context: "electrolytes" },
      { url: "/lessons/hypokalemia", anchor: "Hypokalemia signs & ECG changes", context: "electrolytes" },
      { url: "/lessons/hyperkalemia", anchor: "Hyperkalemia emergency treatment", context: "electrolytes" },
      { url: "/lessons/hypocalcemia", anchor: "Hypocalcemia: Trousseau's & Chvostek's", context: "electrolytes" },
      { url: "/lessons/hypercalcemia", anchor: "Hypercalcemia nursing interventions", context: "electrolytes" },
      { url: "/lessons/hypomagnesemia", anchor: "Hypomagnesemia clinical management", context: "electrolytes" },
      { url: "/lessons/metabolic-acidosis", anchor: "Metabolic acidosis causes & treatment", context: "acid-base" },
      { url: "/lessons/metabolic-alkalosis", anchor: "Metabolic alkalosis nursing care", context: "acid-base" },
      { url: "/lessons/respiratory-acidosis", anchor: "Respiratory acidosis interventions", context: "acid-base" },
      { url: "/lessons/respiratory-alkalosis", anchor: "Respiratory alkalosis management", context: "acid-base" },
      { url: "/flashcards?view=decks", anchor: "Electrolyte flashcard decks", context: "practice" },
    ],
    children: [],
  },
  {
    slug: "cardiac-emergencies-nursing-guide",
    title: "Cardiac Emergencies: Complete Nursing Study Guide",
    metaTitle: "Cardiac Emergencies Nursing Guide | NCLEX Prep",
    metaDescription: "Master cardiac emergencies including MI, heart failure, dysrhythmias, and cardiac arrest. NCLEX-focused nursing interventions, ECG patterns, and priority actions.",
    pageType: "pillar",
    exam: "NCLEX-RN",
    contentHtml: `<article>
<h1>Cardiac Emergencies: Complete Nursing Study Guide</h1>
<p class="lead">Cardiac emergencies are among the highest-priority NCLEX topics. This hub connects you to detailed lessons on acute coronary syndromes, heart failure, lethal dysrhythmias, and cardiac arrest management with evidence-based nursing interventions.</p>

<section id="acute-coronary-syndromes">
<h2>Acute Coronary Syndromes (ACS)</h2>
<p>ACS includes unstable angina, NSTEMI, and STEMI. Recognition of chest pain patterns, 12-lead ECG interpretation, and rapid intervention with MONA (Morphine, Oxygen, Nitroglycerin, Aspirin) are essential nursing competencies.</p>
<p><strong>STEMI indicators:</strong> ST elevation in contiguous leads, troponin elevation, chest pain >20 minutes unrelieved by rest or nitroglycerin.</p>
<div class="exam-trap"><strong>Exam Trap:</strong> Nitroglycerin is contraindicated if systolic BP is below 90 mmHg or if the patient has taken PDE5 inhibitors (sildenafil) within 24-48 hours.</div>
</section>

<section id="heart-failure">
<h2>Heart Failure</h2>
<p>Heart failure is classified as HFrEF (systolic, EF <40%) and HFpEF (diastolic, preserved EF). Recognize left-sided (pulmonary congestion) vs. right-sided (systemic congestion) symptoms. Key medications: ACE inhibitors, beta-blockers, diuretics.</p>
<p><strong>Assessment mnemonic:</strong> Left = Lung (crackles, dyspnea, orthopnea). Right = Rest of body (JVD, hepatomegaly, peripheral edema).</p>
</section>

<section id="dysrhythmias">
<h2>Dysrhythmias & ECG Interpretation</h2>
<p>Lethal rhythms requiring immediate intervention: ventricular fibrillation, pulseless ventricular tachycardia, asystole, and PEA. Know the difference between shockable and non-shockable rhythms for ACLS protocols.</p>
<p><strong>Key distinction:</strong> Atrial fibrillation is the most common sustained dysrhythmia — anticoagulation for stroke prevention is a critical nursing consideration.</p>
</section>

<section id="cardiac-arrest">
<h2>Cardiac Arrest & ACLS</h2>
<p>Cardiac arrest management follows the AHA Chain of Survival: early recognition, CPR, defibrillation, advanced care, and post-arrest care. High-quality CPR with minimal interruptions is the single most important intervention.</p>
</section>

<section id="hypertensive-crisis">
<h2>Hypertensive Crisis</h2>
<p>Hypertensive urgency (>180/120 without organ damage) vs. hypertensive emergency (with organ damage). Emergency management includes IV antihypertensives with controlled BP reduction — never reduce more than 25% in the first hour.</p>
</section>
</article>`,
    toc: [
      { id: "acute-coronary-syndromes", label: "Acute Coronary Syndromes", level: 2 },
      { id: "heart-failure", label: "Heart Failure", level: 2 },
      { id: "dysrhythmias", label: "Dysrhythmias & ECG", level: 2 },
      { id: "cardiac-arrest", label: "Cardiac Arrest", level: 2 },
      { id: "hypertensive-crisis", label: "Hypertensive Crisis", level: 2 },
    ],
    faq: [
      { question: "What is the first nursing action for chest pain?", answer: "Assess vital signs, obtain a 12-lead ECG, administer aspirin (if not contraindicated), and notify the provider. Remember MONA: Morphine, Oxygen (if SpO2 <94%), Nitroglycerin, Aspirin." },
      { question: "What is the difference between STEMI and NSTEMI?", answer: "STEMI shows ST segment elevation on ECG and indicates complete coronary artery occlusion requiring emergent PCI within 90 minutes. NSTEMI shows troponin elevation without ST elevation and indicates partial occlusion." },
      { question: "What are the shockable cardiac arrest rhythms?", answer: "Ventricular fibrillation (V-fib) and pulseless ventricular tachycardia (V-tach) are shockable rhythms. Asystole and PEA (pulseless electrical activity) are non-shockable — treat with CPR and epinephrine." },
      { question: "What are signs of left-sided vs right-sided heart failure?", answer: "Left-sided: pulmonary edema, crackles, dyspnea, orthopnea, pink frothy sputum. Right-sided: JVD, hepatomegaly, ascites, peripheral edema, weight gain." },
    ],
    internalLinks: [
      { url: "/lessons/myocardial-infarction", anchor: "Myocardial infarction nursing care", context: "cardiac" },
      { url: "/lessons/heart-failure", anchor: "Heart failure assessment & management", context: "cardiac" },
      { url: "/lessons/atrial-fibrillation", anchor: "Atrial fibrillation nursing guide", context: "cardiac" },
      { url: "/lessons/hypertension", anchor: "Hypertension nursing interventions", context: "cardiac" },
      { url: "/lessons/angina", anchor: "Angina assessment & treatment", context: "cardiac" },
      { url: "/lessons/cardiogenic-shock", anchor: "Cardiogenic shock management", context: "cardiac" },
      { url: "/lessons/cardiac-catheterization", anchor: "Cardiac catheterization nursing care", context: "cardiac" },
      { url: "/study-guide/electrolytes-acid-base-nursing-guide", anchor: "Electrolytes & acid-base balance", context: "related" },
    ],
    children: [],
  },
  {
    slug: "respiratory-emergencies-nursing-guide",
    title: "Respiratory Emergencies: Complete Nursing Study Guide",
    metaTitle: "Respiratory Emergencies Nursing Guide | NCLEX Prep",
    metaDescription: "Master respiratory emergencies including PE, pneumothorax, ARDS, status asthmaticus, and airway management. NCLEX-focused nursing interventions and priority actions.",
    pageType: "pillar",
    exam: "NCLEX-RN",
    contentHtml: `<article>
<h1>Respiratory Emergencies: Complete Nursing Study Guide</h1>
<p class="lead">Respiratory emergencies require rapid assessment and intervention. This hub covers airway management, oxygen therapy, mechanical ventilation, and critical conditions like PE, pneumothorax, and ARDS with evidence-based nursing interventions.</p>

<section id="airway-management">
<h2>Airway Management & Oxygen Therapy</h2>
<p>Airway patency is always the first priority (ABCs). Understand oxygen delivery devices: nasal cannula (1-6 L/min, 24-44%), simple mask (5-8 L/min, 40-60%), non-rebreather (10-15 L/min, 80-95%), and high-flow nasal cannula.</p>
<div class="exam-trap"><strong>Exam Trap:</strong> For COPD patients, use low-flow oxygen (1-2 L/min) targeting SpO2 88-92%. High-flow oxygen can eliminate hypoxic drive and suppress respiratory effort.</div>
</section>

<section id="pulmonary-embolism">
<h2>Pulmonary Embolism (PE)</h2>
<p>PE is a life-threatening emergency. Classic triad: sudden dyspnea, chest pain (pleuritic), and tachycardia. Diagnosis: CT pulmonary angiography. Treatment: anticoagulation with heparin, then warfarin or DOACs. Massive PE may require thrombolytics or embolectomy.</p>
<p><strong>Virchow's triad:</strong> Venous stasis + Endothelial injury + Hypercoagulability → DVT → PE</p>
</section>

<section id="pneumothorax">
<h2>Pneumothorax</h2>
<p>Tension pneumothorax is a medical emergency: tracheal deviation away from affected side, absent breath sounds, JVD, and hemodynamic instability. Treatment: immediate needle decompression followed by chest tube insertion.</p>
</section>

<section id="ards">
<h2>Acute Respiratory Distress Syndrome (ARDS)</h2>
<p>ARDS is characterized by bilateral pulmonary infiltrates, PaO2/FiO2 ratio <300, and refractory hypoxemia. Management: low tidal volume ventilation (6 mL/kg), PEEP, prone positioning, and treating the underlying cause.</p>
</section>

<section id="asthma-copd">
<h2>Asthma & COPD Exacerbations</h2>
<p>Status asthmaticus is a life-threatening asthma attack unresponsive to initial bronchodilator therapy. Management: continuous nebulized albuterol, IV corticosteroids, IV magnesium sulfate, and possible intubation.</p>
</section>
</article>`,
    toc: [
      { id: "airway-management", label: "Airway & Oxygen Therapy", level: 2 },
      { id: "pulmonary-embolism", label: "Pulmonary Embolism", level: 2 },
      { id: "pneumothorax", label: "Pneumothorax", level: 2 },
      { id: "ards", label: "ARDS", level: 2 },
      { id: "asthma-copd", label: "Asthma & COPD", level: 2 },
    ],
    faq: [
      { question: "What is the first nursing action for a suspected pneumothorax?", answer: "Assess breath sounds bilaterally. For tension pneumothorax with hemodynamic instability, prepare for immediate needle decompression at the 2nd intercostal space, midclavicular line, followed by chest tube insertion." },
      { question: "How do you differentiate PE from MI?", answer: "PE typically presents with sudden pleuritic chest pain, dyspnea, and tachycardia, often with a history of DVT risk factors. MI presents with crushing substernal chest pain, diaphoresis, and ECG changes (ST changes)." },
      { question: "What oxygen level is safe for COPD patients?", answer: "Target SpO2 88-92% using low-flow oxygen (1-2 L/min via nasal cannula). Higher oxygen levels can suppress the hypoxic respiratory drive in chronic CO2 retainers." },
      { question: "What are the hallmarks of ARDS?", answer: "Bilateral white-out on chest X-ray, PaO2/FiO2 ratio below 300, refractory hypoxemia not improved by oxygen alone, and non-cardiogenic pulmonary edema developing within 1 week of a known insult." },
    ],
    internalLinks: [
      { url: "/lessons/pneumonia", anchor: "Pneumonia nursing assessment & care", context: "respiratory" },
      { url: "/lessons/copd", anchor: "COPD management & nursing interventions", context: "respiratory" },
      { url: "/lessons/asthma", anchor: "Asthma nursing care plan", context: "respiratory" },
      { url: "/lessons/pulmonary-embolism", anchor: "Pulmonary embolism emergency care", context: "respiratory" },
      { url: "/lessons/pneumothorax", anchor: "Pneumothorax assessment & treatment", context: "respiratory" },
      { url: "/lessons/tuberculosis", anchor: "Tuberculosis isolation & treatment", context: "respiratory" },
      { url: "/lessons/mechanical-ventilation", anchor: "Mechanical ventilation nursing care", context: "respiratory" },
    ],
    children: [],
  },
  {
    slug: "sepsis-shock-nursing-guide",
    title: "Sepsis & Shock: Complete Nursing Study Guide",
    metaTitle: "Sepsis & Shock Nursing Guide | NCLEX Prep",
    metaDescription: "Master sepsis recognition, shock management, and critical care nursing. Covers distributive, cardiogenic, hypovolemic, and obstructive shock with NCLEX-focused interventions.",
    pageType: "pillar",
    exam: "NCLEX-RN",
    contentHtml: `<article>
<h1>Sepsis & Shock: Complete Nursing Study Guide</h1>
<p class="lead">Sepsis is the leading cause of death in hospitalized patients and a top NCLEX priority topic. This hub covers early sepsis recognition, the Sepsis-3 criteria, all four types of shock, and evidence-based nursing interventions including the 1-hour sepsis bundle.</p>

<section id="sepsis-recognition">
<h2>Sepsis Recognition & Screening</h2>
<p>Sepsis is a life-threatening organ dysfunction caused by a dysregulated host response to infection. The qSOFA score (altered mental status, SBP ≤100, RR ≥22) provides rapid bedside screening. SIRS criteria (temp, HR, RR, WBC) are still used for initial screening.</p>
<p><strong>1-Hour Sepsis Bundle:</strong> Measure lactate, obtain blood cultures, administer broad-spectrum antibiotics, begin IV fluid resuscitation (30 mL/kg crystalloid), apply vasopressors if hypotensive despite fluids.</p>
</section>

<section id="types-of-shock">
<h2>Types of Shock</h2>
<p><strong>Distributive (vasodilatory):</strong> Septic, anaphylactic, neurogenic. Massive vasodilation → warm skin (early septic), low SVR.<br/>
<strong>Cardiogenic:</strong> Pump failure (MI, HF). Low CO, high SVR, pulmonary edema.<br/>
<strong>Hypovolemic:</strong> Volume loss (hemorrhage, burns, dehydration). Low preload, tachycardia, cool skin.<br/>
<strong>Obstructive:</strong> Physical obstruction (tension pneumo, cardiac tamponade, massive PE).</p>
</section>

<section id="fluid-resuscitation">
<h2>Fluid Resuscitation & Vasopressors</h2>
<p>Initial fluid challenge: 30 mL/kg isotonic crystalloid within the first 3 hours. Monitor for fluid responsiveness using passive leg raise, dynamic preload assessment. First-line vasopressor: norepinephrine. Add vasopressin as second agent if needed.</p>
</section>

<section id="nursing-priorities">
<h2>Nursing Priorities in Shock</h2>
<p>Monitor: MAP (target ≥65 mmHg), urine output (≥0.5 mL/kg/hr), mental status, lactate clearance, central venous pressure. Position: modified Trendelenburg (legs elevated 20°). Prevent complications: DIC, MODS, acute kidney injury.</p>
</section>
</article>`,
    toc: [
      { id: "sepsis-recognition", label: "Sepsis Recognition", level: 2 },
      { id: "types-of-shock", label: "Types of Shock", level: 2 },
      { id: "fluid-resuscitation", label: "Fluid Resuscitation", level: 2 },
      { id: "nursing-priorities", label: "Nursing Priorities", level: 2 },
    ],
    faq: [
      { question: "What are the early signs of sepsis?", answer: "Temperature >38.3°C or <36°C, heart rate >90, respiratory rate >20, altered mental status, elevated lactate (>2 mmol/L), and signs of organ dysfunction. Use qSOFA and SIRS criteria for systematic screening." },
      { question: "What is the difference between sepsis and septic shock?", answer: "Sepsis is infection with organ dysfunction (SOFA score ≥2). Septic shock is sepsis with persistent hypotension requiring vasopressors to maintain MAP ≥65 AND lactate >2 mmol/L despite adequate fluid resuscitation." },
      { question: "What is the first-line vasopressor for septic shock?", answer: "Norepinephrine (Levophed) is the first-line vasopressor. It provides potent vasoconstriction with some cardiac stimulation. Vasopressin is added as a second agent if BP remains low." },
      { question: "How do you differentiate types of shock by skin assessment?", answer: "Early septic/anaphylactic: warm, flushed skin (vasodilation). Hypovolemic/cardiogenic: cool, clammy, pale skin (vasoconstriction). Neurogenic: warm below injury, cool above." },
    ],
    internalLinks: [
      { url: "/lessons/sepsis", anchor: "Sepsis nursing care plan", context: "sepsis" },
      { url: "/lessons/shock", anchor: "Shock types & management", context: "shock" },
      { url: "/lessons/anaphylaxis", anchor: "Anaphylaxis emergency response", context: "shock" },
      { url: "/lessons/disseminated-intravascular-coagulation", anchor: "DIC nursing management", context: "sepsis" },
      { url: "/lessons/burns", anchor: "Burns & fluid resuscitation", context: "shock" },
      { url: "/study-guide/cardiac-emergencies-nursing-guide", anchor: "Cardiac emergencies study guide", context: "related" },
      { url: "/study-guide/electrolytes-acid-base-nursing-guide", anchor: "Electrolytes & acid-base balance", context: "related" },
    ],
    children: [],
  },
  {
    slug: "ob-emergencies-nursing-guide",
    title: "OB & Maternity Emergencies: Complete Nursing Study Guide",
    metaTitle: "OB Emergencies Nursing Guide | NCLEX Prep",
    metaDescription: "Master obstetric emergencies including preeclampsia, eclampsia, placenta previa, placental abruption, and postpartum hemorrhage with NCLEX nursing interventions.",
    pageType: "pillar",
    exam: "NCLEX-RN",
    contentHtml: `<article>
<h1>OB & Maternity Emergencies: Complete Nursing Study Guide</h1>
<p class="lead">Obstetric emergencies require rapid recognition and intervention to protect both mother and fetus. This hub covers the most critical maternity complications tested on the NCLEX, from antepartum to postpartum emergencies.</p>

<section id="preeclampsia">
<h2>Preeclampsia & Eclampsia</h2>
<p>Preeclampsia is hypertension (≥140/90) with proteinuria or end-organ damage after 20 weeks gestation. Severe features include BP ≥160/110, thrombocytopenia, elevated liver enzymes, and visual disturbances. Eclampsia = preeclampsia + seizures.</p>
<p><strong>Priority treatment:</strong> Magnesium sulfate for seizure prophylaxis (therapeutic range: 4-7 mEq/L). Monitor DTRs, respiratory rate >12, urine output >30 mL/hr. Antidote: calcium gluconate.</p>
<div class="exam-trap"><strong>Exam Trap:</strong> HELLP syndrome (Hemolysis, Elevated Liver enzymes, Low Platelets) is a severe variant of preeclampsia. It can occur without classic hypertension, making it easy to miss.</div>
</section>

<section id="hemorrhage">
<h2>Antepartum & Postpartum Hemorrhage</h2>
<p><strong>Placenta previa:</strong> painless, bright red vaginal bleeding. NO vaginal exams. <strong>Placental abruption:</strong> painful, dark red bleeding with rigid/board-like abdomen. <strong>Postpartum hemorrhage:</strong> blood loss >500 mL (vaginal) or >1000 mL (C-section). Four Ts: Tone (atony), Trauma, Tissue (retained), Thrombin (coagulopathy).</p>
</section>

<section id="fetal-monitoring">
<h2>Fetal Heart Rate Monitoring</h2>
<p>Normal FHR: 110-160 bpm. Accelerations are reassuring. Late decelerations (uteroplacental insufficiency) and variable decelerations (cord compression) require intervention. Category III tracings are an emergency.</p>
</section>

<section id="emergency-delivery">
<h2>Emergency Delivery Complications</h2>
<p>Shoulder dystocia, cord prolapse, uterine rupture, and amniotic fluid embolism are rare but high-stakes emergencies. Cord prolapse: position mother in knee-chest or Trendelenburg, keep presenting part off cord, prepare for emergency C-section.</p>
</section>
</article>`,
    toc: [
      { id: "preeclampsia", label: "Preeclampsia & Eclampsia", level: 2 },
      { id: "hemorrhage", label: "Hemorrhage", level: 2 },
      { id: "fetal-monitoring", label: "Fetal Monitoring", level: 2 },
      { id: "emergency-delivery", label: "Emergency Delivery", level: 2 },
    ],
    faq: [
      { question: "What is the first nursing action for eclamptic seizures?", answer: "Protect the airway, turn patient on left side, do NOT restrain, administer magnesium sulfate loading dose (4-6g IV over 20 minutes), prepare for emergency delivery after stabilization." },
      { question: "How do you differentiate placenta previa from placental abruption?", answer: "Placenta previa: painless, bright red bleeding, soft uterus. Placental abruption: painful, dark red bleeding, rigid/tender uterus, possible fetal distress. NEVER perform vaginal exam with suspected previa." },
      { question: "What are signs of magnesium sulfate toxicity?", answer: "Loss of deep tendon reflexes (first sign), respiratory depression (<12 breaths/min), decreased urine output (<30 mL/hr), cardiac arrest. Antidote: calcium gluconate 1g IV." },
      { question: "What causes postpartum hemorrhage?", answer: "The 4 Ts: Tone (uterine atony — most common, 70-80%), Trauma (lacerations, hematoma), Tissue (retained placenta), Thrombin (coagulopathy). Fundal massage is the first intervention for atony." },
    ],
    internalLinks: [
      { url: "/lessons/preeclampsia", anchor: "Preeclampsia nursing management", context: "OB" },
      { url: "/lessons/placenta-previa", anchor: "Placenta previa assessment", context: "OB" },
      { url: "/lessons/placental-abruption", anchor: "Placental abruption emergency care", context: "OB" },
      { url: "/lessons/gestational-diabetes", anchor: "Gestational diabetes management", context: "OB" },
      { url: "/lessons/postpartum-hemorrhage", anchor: "Postpartum hemorrhage interventions", context: "OB" },
      { url: "/study-guide/electrolytes-acid-base-nursing-guide", anchor: "Electrolytes & acid-base guide", context: "related" },
    ],
    children: [],
  },
  {
    slug: "pre-nursing-foundations-study-guide",
    title: "Pre-Nursing Foundations: Complete Study Guide",
    metaTitle: "Pre-Nursing Study Guide | A&P, Biology & Chemistry",
    metaDescription: "Essential pre-nursing foundations: cell biology, medical terminology, homeostasis, pH & buffers, and vital signs. Start your nursing journey with strong fundamentals.",
    pageType: "pillar",
    exam: "Pre-Nursing",
    contentHtml: `<article>
<h1>Pre-Nursing Foundations: Complete Study Guide</h1>
<p class="lead">Building a strong foundation is the key to nursing school success. This comprehensive hub covers the prerequisite science concepts you need to master before starting your nursing program — from cell biology and medical terminology to homeostasis and vital signs.</p>

<section id="medical-terminology">
<h2>Medical Terminology</h2>
<p>Medical terminology is the language of healthcare. Understanding root words, prefixes, and suffixes allows you to decode unfamiliar terms. For example: "tachycardia" = tachy (fast) + cardia (heart) = fast heart rate.</p>
<p><strong>Essential prefixes:</strong> hyper- (above), hypo- (below), tachy- (fast), brady- (slow), poly- (many), dys- (difficult/painful)</p>
</section>

<section id="cell-biology">
<h2>Cell Biology</h2>
<p>Understanding cell structure and function is the foundation of pathophysiology. Key concepts include the cell membrane (selective permeability), organelles (mitochondria, nucleus, ER), and cellular transport (osmosis, diffusion, active transport).</p>
</section>

<section id="homeostasis">
<h2>Homeostasis & Vital Signs</h2>
<p>Homeostasis is the body's ability to maintain internal stability. Vital signs are the primary indicators of homeostatic balance: temperature, heart rate, blood pressure, respiratory rate, and oxygen saturation.</p>
</section>

<section id="chemistry">
<h2>pH, Buffers & Acid-Base</h2>
<p>Understanding pH and buffer systems is essential for grasping acid-base balance in clinical practice. The bicarbonate buffer system, respiratory regulation (CO2), and renal regulation (HCO3) work together to maintain blood pH at 7.35-7.45.</p>
</section>

<section id="study-resources">
<h2>Study Resources & Flashcards</h2>
<p>Use our pre-nursing flashcard decks to reinforce foundational concepts through spaced repetition. Start with Medical Terminology, then progress to Cell Biology and Vital Signs.</p>
</section>
</article>`,
    toc: [
      { id: "medical-terminology", label: "Medical Terminology", level: 2 },
      { id: "cell-biology", label: "Cell Biology", level: 2 },
      { id: "homeostasis", label: "Homeostasis & Vital Signs", level: 2 },
      { id: "chemistry", label: "pH & Acid-Base Basics", level: 2 },
      { id: "study-resources", label: "Study Resources", level: 2 },
    ],
    faq: [
      { question: "What are the prerequisites for nursing school?", answer: "Most nursing programs require Anatomy & Physiology I & II, Microbiology, Chemistry, English Composition, Psychology, and Statistics. Some also require Nutrition and Developmental Psychology." },
      { question: "How do I learn medical terminology quickly?", answer: "Focus on learning root words, prefixes, and suffixes rather than memorizing individual terms. Understanding that 'cardi' = heart, '-itis' = inflammation, and 'tachy-' = fast lets you decode 'tachycardia' and 'carditis' without memorization." },
      { question: "Why is anatomy and physiology important for nursing?", answer: "A&P provides the foundation for understanding disease processes (pathophysiology), medication actions (pharmacology), and patient assessment. Every nursing concept builds on anatomical and physiological knowledge." },
      { question: "What is the best way to study for nursing prerequisites?", answer: "Use active learning: flashcards with spaced repetition, practice questions, concept mapping, and teaching concepts to others. Passive reading alone is insufficient for the depth required in nursing school." },
    ],
    internalLinks: [
      { url: "/pre-nursing", anchor: "Pre-nursing program overview", context: "pre-nursing" },
      { url: "/flashcards?view=decks", anchor: "Pre-nursing flashcard decks", context: "practice" },
      { url: "/study-guide/electrolytes-acid-base-nursing-guide", anchor: "Electrolytes & acid-base guide", context: "related" },
      { url: "/anatomy/skeletal", anchor: "Skeletal system anatomy", context: "A&P" },
      { url: "/anatomy/muscular", anchor: "Muscular system anatomy", context: "A&P" },
      { url: "/anatomy/cardiovascular", anchor: "Cardiovascular anatomy", context: "A&P" },
      { url: "/anatomy/respiratory", anchor: "Respiratory anatomy", context: "A&P" },
      { url: "/anatomy/nervous", anchor: "Nervous system anatomy", context: "A&P" },
    ],
    children: [],
  },
  {
    slug: "anatomy-physiology-nursing-guide",
    title: "Anatomy & Physiology: Complete Nursing Study Guide",
    metaTitle: "A&P Nursing Study Guide | All Body Systems",
    metaDescription: "Master all body systems with our comprehensive A&P nursing study guide. Cardiovascular, respiratory, renal, neuro, endocrine, and GI anatomy & physiology.",
    pageType: "pillar",
    exam: "NCLEX-RN",
    contentHtml: `<article>
<h1>Anatomy & Physiology: Complete Nursing Study Guide</h1>
<p class="lead">A thorough understanding of anatomy and physiology is the foundation of all nursing practice. This hub connects you to detailed guides for every major body system, linking structure to clinical function and pathology.</p>

<section id="cardiovascular">
<h2>Cardiovascular System</h2>
<p>Heart chambers, valves, blood flow pathway, cardiac conduction system, cardiac output, and hemodynamic monitoring. Understanding preload, afterload, and contractility is essential for managing heart failure and shock.</p>
</section>

<section id="respiratory">
<h2>Respiratory System</h2>
<p>Airway anatomy, gas exchange mechanics, lung volumes, oxyhemoglobin dissociation curve, and ventilation-perfusion matching. These concepts underpin all respiratory assessment and intervention.</p>
</section>

<section id="renal">
<h2>Renal System</h2>
<p>Nephron structure, GFR, RAAS system, ADH, aldosterone, and fluid-electrolyte balance. The kidneys regulate volume, electrolytes, acid-base, and blood pressure — making renal physiology central to nursing practice.</p>
</section>

<section id="nervous">
<h2>Nervous System</h2>
<p>CNS and PNS, meninges, cranial nerves, autonomic nervous system (sympathetic vs. parasympathetic), GCS, and intracranial pressure. Neurological assessment is a core nursing competency.</p>
</section>

<section id="endocrine">
<h2>Endocrine System</h2>
<p>Hormones, feedback loops, thyroid disorders, adrenal disorders (Addison's vs. Cushing's), diabetes mellitus, and pituitary function. Endocrine pathology accounts for many NCLEX questions.</p>
</section>

<section id="gastrointestinal">
<h2>Gastrointestinal System</h2>
<p>GI tract anatomy, digestive enzymes, liver function, pancreatic function, nutrient absorption, and common GI assessments including bowel sounds and abdominal quadrants.</p>
</section>
</article>`,
    toc: [
      { id: "cardiovascular", label: "Cardiovascular", level: 2 },
      { id: "respiratory", label: "Respiratory", level: 2 },
      { id: "renal", label: "Renal", level: 2 },
      { id: "nervous", label: "Nervous System", level: 2 },
      { id: "endocrine", label: "Endocrine", level: 2 },
      { id: "gastrointestinal", label: "GI System", level: 2 },
    ],
    faq: [
      { question: "What is the most important A&P topic for NCLEX?", answer: "The cardiovascular and renal systems are the most heavily tested A&P topics on NCLEX. Understanding cardiac output, heart failure pathophysiology, fluid balance, and electrolyte regulation is essential." },
      { question: "How are A&P concepts tested on NCLEX?", answer: "NCLEX doesn't test pure anatomy recall. Instead, it tests your ability to apply A&P knowledge to clinical scenarios — e.g., knowing that loop diuretics act on the Loop of Henle explains why they cause potassium loss." },
      { question: "What is the best order to study body systems?", answer: "Start with cardiovascular (foundation for hemodynamics), then respiratory (gas exchange), renal (fluid balance), neuro (assessment), endocrine (hormonal regulation), and GI (nutrition/medication absorption)." },
    ],
    internalLinks: [
      { url: "/anatomy/cardiovascular", anchor: "Cardiovascular anatomy detail", context: "A&P" },
      { url: "/anatomy/respiratory", anchor: "Respiratory anatomy detail", context: "A&P" },
      { url: "/anatomy/renal", anchor: "Renal anatomy detail", context: "A&P" },
      { url: "/anatomy/nervous", anchor: "Nervous system anatomy", context: "A&P" },
      { url: "/anatomy/endocrine", anchor: "Endocrine anatomy detail", context: "A&P" },
      { url: "/anatomy/digestive", anchor: "GI system anatomy", context: "A&P" },
      { url: "/study-guide/pre-nursing-foundations-study-guide", anchor: "Pre-nursing foundations", context: "related" },
      { url: "/study-guide/electrolytes-acid-base-nursing-guide", anchor: "Electrolytes & acid-base guide", context: "related" },
      { url: "/flashcards?view=decks", anchor: "A&P flashcard decks", context: "practice" },
    ],
    children: [],
  },
  {
    slug: "pharmacology-high-yield-nursing-guide",
    title: "Pharmacology High-Yield: Complete Nursing Study Guide",
    metaTitle: "Pharmacology Nursing Guide | High-Yield NCLEX Drugs",
    metaDescription: "Master high-yield pharmacology for NCLEX. Drug classifications, mechanisms, side effects, nursing considerations, and medication safety for nursing students.",
    pageType: "pillar",
    exam: "NCLEX-RN",
    contentHtml: `<article>
<h1>Pharmacology High-Yield: Complete Nursing Study Guide</h1>
<p class="lead">Pharmacology questions make up a significant portion of the NCLEX. This hub focuses on the highest-yield drug classes, dangerous drug interactions, medication safety principles, and the nursing considerations you need to know.</p>

<section id="cardiac-drugs">
<h2>Cardiovascular Medications</h2>
<p>ACE inhibitors (-pril), ARBs (-sartan), beta-blockers (-lol), calcium channel blockers (-dipine), digoxin, antiarrhythmics, and anticoagulants. Know mechanism, key side effects, and nursing monitoring for each class.</p>
<div class="exam-trap"><strong>Exam Trap:</strong> Hold beta-blockers if HR <60 and digoxin if HR <60. Always check apical pulse for full minute before administration. Monitor potassium with digoxin — hypokalemia increases toxicity.</div>
</section>

<section id="anticoagulants">
<h2>Anticoagulants & Thrombolytics</h2>
<p>Heparin (monitor aPTT), warfarin (monitor INR/PT), enoxaparin (no monitoring needed), DOACs (dabigatran, rivaroxaban, apixaban). Reversal agents: protamine for heparin, vitamin K for warfarin, idarucizumab for dabigatran.</p>
</section>

<section id="antibiotics">
<h2>Antibiotics</h2>
<p>Penicillins, cephalosporins, fluoroquinolones, aminoglycosides, vancomycin. Key concepts: peak/trough levels, nephrotoxicity, ototoxicity, C. diff risk, and cross-allergy between penicillins and cephalosporins.</p>
</section>

<section id="diabetes-meds">
<h2>Diabetes Medications</h2>
<p>Insulin types (rapid: lispro/aspart onset 15 min; short: regular onset 30 min; intermediate: NPH; long: glargine/detemir), oral hypoglycemics (metformin, sulfonylureas, SGLT2 inhibitors). Always teach hypoglycemia recognition.</p>
</section>

<section id="med-safety">
<h2>Medication Safety & Rights</h2>
<p>10 Rights of Medication Administration: right patient, drug, dose, route, time, documentation, reason, response, refusal, education. High-alert medications require independent double-checks.</p>
</section>
</article>`,
    toc: [
      { id: "cardiac-drugs", label: "Cardiovascular Meds", level: 2 },
      { id: "anticoagulants", label: "Anticoagulants", level: 2 },
      { id: "antibiotics", label: "Antibiotics", level: 2 },
      { id: "diabetes-meds", label: "Diabetes Meds", level: 2 },
      { id: "med-safety", label: "Medication Safety", level: 2 },
    ],
    faq: [
      { question: "What pharmacology is most tested on NCLEX?", answer: "Cardiovascular drugs (ACE inhibitors, beta-blockers, digoxin), anticoagulants (heparin, warfarin), insulin, and antibiotics are the most frequently tested drug classes on NCLEX." },
      { question: "How do I remember drug classifications?", answer: "Use stem-based learning: -pril = ACE inhibitor, -sartan = ARB, -lol = beta-blocker, -dipine = calcium channel blocker, -statin = cholesterol-lowering, -prazole = proton pump inhibitor." },
      { question: "What are the most dangerous drug interactions for nurses to know?", answer: "ACE inhibitors + potassium supplements (hyperkalemia), warfarin + NSAIDs (bleeding), MAOIs + tyramine-containing foods (hypertensive crisis), digoxin + hypokalemia (toxicity)." },
      { question: "What is the difference between heparin and warfarin monitoring?", answer: "Heparin: monitor aPTT (therapeutic: 1.5-2x normal). Warfarin: monitor INR/PT (therapeutic: 2-3 for most conditions). Heparin acts immediately; warfarin takes 3-5 days for full effect." },
    ],
    internalLinks: [
      { url: "/medication-mastery", anchor: "Medication mastery training", context: "pharmacology" },
      { url: "/lessons/anticoagulants", anchor: "Anticoagulant therapy guide", context: "pharmacology" },
      { url: "/lessons/insulin", anchor: "Insulin types & administration", context: "pharmacology" },
      { url: "/lessons/antihypertensives", anchor: "Antihypertensive medications", context: "pharmacology" },
      { url: "/lessons/antibiotics", anchor: "Antibiotic therapy guide", context: "pharmacology" },
      { url: "/study-guide/cardiac-emergencies-nursing-guide", anchor: "Cardiac emergencies guide", context: "related" },
      { url: "/study-guide/electrolytes-acid-base-nursing-guide", anchor: "Electrolytes guide", context: "related" },
    ],
    children: [],
  },
  {
    slug: "hyperkalemia-effects-on-heart-nursing",
    title: "Hyperkalemia Effects on the Heart: NCLEX & REx-PN Exam Review",
    metaTitle: "Hyperkalemia Effects on the Heart (NCLEX & REx-PN Review) | NurseNest",
    metaDescription: "Learn how hyperkalemia affects the heart, why burns cause hyperkalemia, ECG changes from peaked T waves to sine wave, and emergency nursing interventions for the NCLEX and REx-PN.",
    pageType: "pillar",
    exam: "NCLEX-RN",
    contentHtml: `<article>
<h1>Hyperkalemia Effects on the Heart: NCLEX & REx-PN Exam Review</h1>
<p class="lead">Hyperkalemia (serum K⁺ >5.0 mEq/L) is one of the most dangerous electrolyte emergencies tested on nursing exams. Its effects on cardiac conduction can progress from subtle ECG changes to fatal cardiac arrest within minutes. This guide covers exactly how elevated potassium disrupts heart function — a must-know topic for NCLEX-RN, NCLEX-PN, and REx-PN.</p>

<section id="how-hyperkalemia-affects-heart">
<h2>How Does Hyperkalemia Affect the Heart?</h2>
<p>Potassium is the primary intracellular cation responsible for maintaining the resting membrane potential of cardiac myocytes (~-90 mV). When extracellular K⁺ rises, the resting membrane potential becomes less negative (partially depolarized). This has two critical consequences:</p>
<p><strong>1. Decreased conduction velocity:</strong> Partial depolarization inactivates sodium channels, slowing Phase 0 of the cardiac action potential. This manifests as widened QRS complexes on ECG.</p>
<p><strong>2. Altered repolarization:</strong> Elevated K⁺ increases membrane permeability to potassium, accelerating Phase 3 repolarization. This produces the hallmark tall, peaked T waves — the earliest ECG sign of hyperkalemia.</p>
<div class="clinical-pearl"><strong>Clinical Pearl:</strong> The heart becomes progressively more irritable as K⁺ rises. Above 6.5 mEq/L, life-threatening dysrhythmias can occur at any moment. Above 8.0 mEq/L, cardiac arrest is imminent.</div>
</section>

<section id="hyperkalemia-hypokalemia-heart">
<h2>Hyperkalemia and Hypokalemia Effects on the Heart</h2>
<p>Both extremes of potassium disrupt cardiac conduction, but through opposite mechanisms:</p>
<p><strong>Hyperkalemia (K⁺ >5.0 mEq/L):</strong> Depolarizes the resting membrane → slowed conduction → peaked T waves → widened QRS → sine wave → V-fib/asystole.</p>
<p><strong>Hypokalemia (K⁺ <3.5 mEq/L):</strong> Hyperpolarizes the resting membrane → prolonged repolarization → flattened T waves → prominent U waves → ST depression → torsades de pointes.</p>
<div class="exam-trap"><strong>Exam Trap:</strong> Both hypokalemia AND hyperkalemia increase the risk of digoxin toxicity. Always check potassium levels before administering digoxin. Hold digoxin if K⁺ is <3.5 mEq/L.</div>
</section>

<section id="ecg-progression">
<h2>ECG Changes in Hyperkalemia: Step-by-Step Progression</h2>
<p>Memorize this sequence — it appears frequently on NCLEX and REx-PN exams:</p>
<p><strong>Mild (5.5-6.0 mEq/L):</strong> Tall, peaked, narrow-based T waves (earliest sign). The T wave becomes taller than normal and "tented."</p>
<p><strong>Moderate (6.0-7.0 mEq/L):</strong> Prolonged PR interval, flattened P waves, widened QRS complex. AV conduction begins to slow.</p>
<p><strong>Severe (7.0-8.0 mEq/L):</strong> Loss of P waves (atrial standstill), markedly widened QRS that merges with T waves → classic "sine wave" pattern.</p>
<p><strong>Critical (>8.0 mEq/L):</strong> Ventricular fibrillation, asystole, and cardiac arrest.</p>
<div class="clinical-pearl"><strong>Clinical Pearl:</strong> The speed of K⁺ rise matters more than the absolute level. A patient whose K⁺ jumps from 4.0 to 6.5 rapidly is at higher risk than someone who has been chronically at 5.8 mEq/L.</div>
</section>

<section id="why-burns-cause-hyperkalemia">
<h2>Why Do Burns Cause Hyperkalemia?</h2>
<p>Burns are one of the most common causes of acute hyperkalemia tested on nursing exams. There are three mechanisms:</p>
<p><strong>1. Massive cellular destruction:</strong> Thermal injury destroys cells, releasing intracellular potassium into the bloodstream. Since cells contain ~150 mEq/L of K⁺ (compared to 3.5-5.0 mEq/L in serum), even moderate cell death dramatically raises serum potassium.</p>
<p><strong>2. Rhabdomyolysis:</strong> Muscle tissue breakdown from deep burns releases potassium, myoglobin, and creatine kinase (CK) into circulation. This is especially significant in electrical burns and deep thermal burns.</p>
<p><strong>3. Metabolic acidosis:</strong> Burns trigger a systemic inflammatory response with lactic acidosis. In acidosis, hydrogen ions (H⁺) move into cells while potassium moves out to maintain electroneutrality — this transcellular shift raises serum K⁺ by approximately 0.6 mEq/L for each 0.1 decrease in pH.</p>
<div class="exam-trap"><strong>Exam Trap:</strong> In the first 24-48 hours post-burn, hyperkalemia is the primary electrolyte concern. After 48 hours, as fluid shifts reverse and diuresis begins, hypokalemia becomes the risk. Know this timeline for NCLEX prioritization questions.</div>
</section>

<section id="how-burns-cause-hyperkalemia">
<h2>How Does Burns Cause Hyperkalemia?</h2>
<p>The pathophysiology follows a clear sequence that nursing students must understand:</p>
<p><strong>Step 1 — Thermal injury:</strong> Heat denatures cell membrane proteins, creating pores that allow potassium to leak out of damaged cells.</p>
<p><strong>Step 2 — Inflammatory cascade:</strong> Burn injury triggers a massive inflammatory response. Cytokines and reactive oxygen species cause additional cellular damage beyond the initial burn zone (the "zone of stasis").</p>
<p><strong>Step 3 — Fluid shifts:</strong> Capillary permeability increases dramatically in the first 24 hours. Plasma shifts to the interstitium (third-spacing), concentrating electrolytes in the remaining intravascular volume.</p>
<p><strong>Step 4 — Renal impairment:</strong> Hypovolemia from fluid loss reduces renal perfusion, impairing the kidneys' ability to excrete excess potassium. If myoglobin from rhabdomyolysis clogs renal tubules, acute kidney injury (AKI) further worsens potassium clearance.</p>
<div class="clinical-pearl"><strong>Clinical Pearl:</strong> Monitor potassium levels every 4-6 hours in major burn patients during the first 48 hours. Continuous cardiac monitoring is mandatory. Have calcium gluconate and insulin/dextrose at bedside for emergency treatment.</div>
</section>

<section id="emergency-treatment">
<h2>Hyperkalemia Emergency Treatment: Nursing Priority Actions</h2>
<p>The treatment protocol follows three priorities — <strong>Stabilize → Shift → Remove:</strong></p>
<p><strong>1. Stabilize the heart:</strong> IV calcium gluconate (10 mL of 10%) over 2-3 minutes. This does NOT lower K⁺ but protects the myocardium by stabilizing the cardiac membrane. Effect lasts 30-60 minutes.</p>
<p><strong>2. Shift K⁺ into cells:</strong> Regular insulin (10 units IV) with D50W (to prevent hypoglycemia). Also: sodium bicarbonate (if acidotic), inhaled albuterol (beta-2 agonist stimulates Na⁺/K⁺-ATPase).</p>
<p><strong>3. Remove K⁺ from body:</strong> Kayexalate (sodium polystyrene sulfonate) orally or rectally, loop diuretics (furosemide), or hemodialysis for severe/refractory cases.</p>
<div class="exam-trap"><strong>Exam Trap:</strong> Calcium gluconate is the FIRST medication given — not to lower potassium, but to protect the heart. NCLEX loves to test this priority.</div>
</section>

<section id="nursing-question-bank">
<h2>Practice Questions: Hyperkalemia</h2>
<p>Test your knowledge with NCLEX-style practice questions on hyperkalemia, ECG interpretation, and emergency management. Our question bank includes rationales for every option.</p>
</section>
</article>`,
    toc: [
      { id: "how-hyperkalemia-affects-heart", label: "How Hyperkalemia Affects the Heart", level: 2 },
      { id: "hyperkalemia-hypokalemia-heart", label: "Hyperkalemia vs Hypokalemia", level: 2 },
      { id: "ecg-progression", label: "ECG Changes Progression", level: 2 },
      { id: "why-burns-cause-hyperkalemia", label: "Why Burns Cause Hyperkalemia", level: 2 },
      { id: "how-burns-cause-hyperkalemia", label: "How Burns Cause Hyperkalemia", level: 2 },
      { id: "emergency-treatment", label: "Emergency Treatment", level: 2 },
      { id: "nursing-question-bank", label: "Practice Questions", level: 2 },
    ],
    faq: [
      { question: "How does hyperkalemia affect the heart?", answer: "Hyperkalemia raises the resting membrane potential of cardiac cells, slowing conduction velocity and altering repolarization. This causes peaked T waves, widened QRS, loss of P waves, and eventually sine wave pattern leading to V-fib or asystole." },
      { question: "Why do burns cause hyperkalemia?", answer: "Burns cause massive cellular destruction that releases intracellular potassium into the bloodstream. Additional mechanisms include rhabdomyolysis from deep tissue damage and metabolic acidosis that shifts potassium out of cells. Renal impairment from hypovolemia further prevents potassium excretion." },
      { question: "How does burns cause hyperkalemia?", answer: "Thermal injury denatures cell membranes, releasing stored potassium. The inflammatory cascade damages additional cells, fluid shifts concentrate electrolytes, and reduced renal perfusion impairs K⁺ clearance. Acidosis causes further transcellular K⁺ shift out of cells." },
      { question: "What is the first medication given for hyperkalemia?", answer: "Calcium gluconate is the first medication administered. It does not lower potassium levels but stabilizes the cardiac membrane to prevent lethal dysrhythmias. Onset is 1-3 minutes, duration 30-60 minutes." },
      { question: "What are the ECG changes in hyperkalemia?", answer: "Progressive ECG changes: peaked T waves (earliest, at K⁺ 5.5-6.0), prolonged PR interval, flattened P waves, widened QRS (K⁺ 6.0-7.0), sine wave pattern (K⁺ >7.0), and ventricular fibrillation or asystole (K⁺ >8.0)." },
      { question: "Why does hyperkalemia cause peaked T waves?", answer: "Elevated extracellular potassium increases membrane permeability to K⁺ ions, accelerating Phase 3 repolarization of the cardiac action potential. This faster repolarization creates taller, narrower, peaked T waves on the ECG." },
      { question: "What is the hyperkalemia physiology of the heart?", answer: "Elevated K⁺ partially depolarizes the cardiac cell resting membrane potential (from -90 mV toward -80 mV). This inactivates fast sodium channels, slowing conduction (widened QRS), while increased K⁺ conductance accelerates repolarization (peaked T waves). At critically high levels, conduction fails completely." },
      { question: "Does hyperkalemia or hypokalemia cause peaked T waves?", answer: "Hyperkalemia causes tall, peaked, narrow-based T waves. Hypokalemia causes the opposite: flattened T waves, prominent U waves, and ST segment depression. This distinction is a common NCLEX question." },
    ],
    internalLinks: [
      { url: "/lessons/hyperkalemia", anchor: "Hyperkalemia detailed nursing guide", context: "electrolytes" },
      { url: "/lessons/hypokalemia", anchor: "Hypokalemia signs & management", context: "electrolytes" },
      { url: "/lessons/burns", anchor: "Burns nursing assessment & care", context: "related" },
      { url: "/study-guide/electrolytes-acid-base-nursing-guide", anchor: "Complete electrolytes study guide", context: "related" },
      { url: "/study-guide/cardiac-emergencies-nursing-guide", anchor: "Cardiac emergencies guide", context: "related" },
      { url: "/flashcards?view=decks", anchor: "Electrolyte flashcard decks", context: "practice" },
    ],
    children: [],
  },
  {
    slug: "copd-barrel-chest-nursing-exam",
    title: "Why COPD Causes Barrel Chest: Nursing Exam Explanation",
    metaTitle: "Why COPD Causes Barrel Chest (NCLEX & REx-PN Exam Explanation) | NurseNest",
    metaDescription: "Understand why COPD causes barrel chest, the pathophysiology of air trapping and hyperinflation, assessment findings, and nursing interventions for NCLEX and REx-PN exams.",
    pageType: "pillar",
    exam: "NCLEX-RN",
    contentHtml: `<article>
<h1>Why COPD Causes Barrel Chest: Nursing Exam Explanation</h1>
<p class="lead">Barrel chest is one of the most recognizable physical assessment findings in advanced COPD. Understanding the pathophysiology behind this structural change — from cellular destruction to thoracic remodeling — is essential for NCLEX-RN, NCLEX-PN, and REx-PN exams. This guide explains the mechanism clearly and covers the assessment skills you need.</p>

<section id="what-is-barrel-chest">
<h2>What Is Barrel Chest?</h2>
<p>Barrel chest describes an increased anteroposterior (AP) diameter of the thorax, making it appear rounded or "barrel-shaped." In a normal adult, the AP diameter is approximately half the transverse (lateral) diameter, giving a ratio of about 1:2. In barrel chest, this ratio approaches 1:1.</p>
<p><strong>Assessment finding:</strong> When you observe the patient from the side, the chest appears as deep as it is wide. The ribs become more horizontal (instead of their normal downward slope), and the sternum pushes forward.</p>
<div class="clinical-pearl"><strong>Clinical Pearl:</strong> Barrel chest is a late finding in COPD — it develops over years of chronic air trapping. Its presence on an exam question signals advanced/severe COPD. It can also be a normal finding in elderly patients due to age-related skeletal changes.</div>
</section>

<section id="why-copd-causes-barrel-chest">
<h2>Why Does COPD Cause Barrel Chest?</h2>
<p>The mechanism follows a clear pathophysiological sequence that nursing students must understand:</p>
<p><strong>Step 1 — Alveolar destruction (Emphysema):</strong> Chronic exposure to irritants (primarily cigarette smoke) triggers an imbalance between proteases (neutrophil elastase) and antiproteases (alpha-1 antitrypsin). Elastase destroys alveolar walls, creating enlarged, non-functional air spaces called blebs or bullae.</p>
<p><strong>Step 2 — Loss of elastic recoil:</strong> Normal lungs snap back during exhalation like a stretched rubber band. When elastin fibers are destroyed, the lungs lose their ability to passively recoil, making exhalation incomplete and requiring active muscular effort.</p>
<p><strong>Step 3 — Air trapping:</strong> During exhalation, small airways (bronchioles) collapse prematurely because they've lost the structural support from surrounding alveoli. Air becomes trapped in the distal lung, increasing residual volume (RV) and functional residual capacity (FRC).</p>
<p><strong>Step 4 — Chronic hyperinflation:</strong> Over months and years, persistently trapped air keeps the lungs in a state of hyperinflation. The diaphragm flattens from its normal dome shape, and the thoracic cage gradually remodels to accommodate the expanded lungs.</p>
<p><strong>Step 5 — Barrel chest:</strong> The ribs become fixed in an inspiratory position (more horizontal), the AP diameter increases, and the sternum pushes anteriorly. This structural change is irreversible.</p>
<div class="exam-trap"><strong>Exam Trap:</strong> Barrel chest is characteristic of emphysema (a type of COPD), NOT chronic bronchitis. If an NCLEX question describes a "pink puffer" with barrel chest, it's pointing to emphysema. "Blue bloater" with chronic productive cough points to chronic bronchitis.</div>
</section>

<section id="barrel-chest-in-copd">
<h2>Barrel Chest in COPD: Clinical Assessment</h2>
<p>When assessing a patient with suspected barrel chest:</p>
<p><strong>Inspection:</strong> Increased AP diameter (1:1 ratio), use of accessory muscles (sternocleidomastoid, intercostals), pursed-lip breathing, tripod position, and prolonged expiratory phase.</p>
<p><strong>Palpation:</strong> Decreased tactile fremitus (vibrations are dampened by trapped air). Reduced chest expansion bilaterally.</p>
<p><strong>Percussion:</strong> Hyperresonance throughout lung fields (trapped air creates a hollow, drum-like sound). Diaphragm excursion is diminished.</p>
<p><strong>Auscultation:</strong> Diminished breath sounds, distant heart sounds, prolonged expiratory phase. Wheezing may be present during exacerbations.</p>
<div class="clinical-pearl"><strong>Clinical Pearl:</strong> If an exam question asks you to differentiate barrel chest from other causes of increased AP diameter (kyphosis, normal aging), look for the combination of barrel chest + diminished breath sounds + hyperresonance + smoking history = COPD/emphysema.</div>
</section>

<section id="copd-nursing-interventions">
<h2>COPD Nursing Interventions for Barrel Chest Patients</h2>
<p><strong>Oxygen therapy:</strong> Low-flow oxygen targeting SpO2 88-92%. COPD patients with chronic CO2 retention rely on hypoxic drive — high-flow O2 can suppress respiratory effort.</p>
<p><strong>Breathing techniques:</strong> Teach pursed-lip breathing (extends exhalation time, prevents airway collapse, improves gas exchange) and diaphragmatic breathing.</p>
<p><strong>Positioning:</strong> High Fowler's or tripod position to maximize lung expansion. Leaning forward reduces the work of accessory muscles.</p>
<p><strong>Medications:</strong> Bronchodilators (albuterol, ipratropium), inhaled corticosteroids for maintenance, and anticholinergics. Teach proper inhaler technique with spacer.</p>
<p><strong>Nutrition:</strong> High-calorie, high-protein, small frequent meals. Avoid gas-producing foods that can distend the abdomen and impair diaphragm movement.</p>
<div class="exam-trap"><strong>Exam Trap:</strong> For a COPD patient with barrel chest and acute exacerbation, the priority nursing intervention is positioning (high Fowler's) and administering prescribed bronchodilators — NOT high-flow oxygen. Oxygen is titrated carefully to 88-92% SpO2.</div>
</section>

<section id="practice-questions-copd">
<h2>Practice Questions: COPD & Barrel Chest</h2>
<p>Test your knowledge with NCLEX-style practice questions on COPD assessment, pathophysiology, and nursing interventions. Our question bank includes detailed rationales for every answer option.</p>
</section>
</article>`,
    toc: [
      { id: "what-is-barrel-chest", label: "What Is Barrel Chest?", level: 2 },
      { id: "why-copd-causes-barrel-chest", label: "Why COPD Causes Barrel Chest", level: 2 },
      { id: "barrel-chest-in-copd", label: "Clinical Assessment", level: 2 },
      { id: "copd-nursing-interventions", label: "Nursing Interventions", level: 2 },
      { id: "practice-questions-copd", label: "Practice Questions", level: 2 },
    ],
    faq: [
      { question: "What is barrel chest in COPD?", answer: "Barrel chest is an increase in the anteroposterior diameter of the thorax (approaching a 1:1 ratio with transverse diameter) caused by chronic air trapping and lung hyperinflation in advanced COPD/emphysema. The ribs become more horizontal and the sternum pushes forward." },
      { question: "Why does COPD cause barrel chest?", answer: "COPD (specifically emphysema) destroys alveolar walls and elastin fibers, causing loss of elastic recoil. This leads to air trapping during exhalation, chronic lung hyperinflation, and gradual remodeling of the thoracic cage into a barrel shape over years." },
      { question: "How does COPD cause barrel chest?", answer: "The sequence is: alveolar destruction → loss of elastic recoil → incomplete exhalation → air trapping → chronic hyperinflation → diaphragm flattening → thoracic cage remodeling → increased AP diameter (barrel chest). This process takes years of progressive disease." },
      { question: "Is barrel chest reversible in COPD?", answer: "No. Barrel chest represents permanent structural remodeling of the thoracic cage. While bronchodilators and pulmonary rehabilitation can improve airflow and symptoms, the skeletal changes are irreversible. This is why COPD prevention (smoking cessation) is so critical." },
      { question: "What is the normal AP to transverse chest ratio?", answer: "The normal AP:transverse ratio is approximately 1:2 in adults. In barrel chest from COPD, this ratio approaches 1:1 as the AP diameter increases. Note: newborns normally have a 1:1 ratio, and elderly patients may develop increased AP diameter from kyphosis." },
      { question: "What is the difference between barrel chest and normal aging?", answer: "Barrel chest from COPD presents with hyperresonance on percussion, diminished breath sounds, smoking history, and dyspnea. Age-related AP diameter increase shows normal breath sounds, normal resonance, and may be associated with kyphosis. COPD barrel chest has accompanying respiratory symptoms." },
      { question: "What oxygen level should COPD patients with barrel chest receive?", answer: "Target SpO2 88-92% using low-flow oxygen (1-2 L/min nasal cannula). COPD patients with chronic CO2 retention depend on hypoxic drive for breathing. High-flow oxygen can suppress this drive and cause respiratory depression — a critical safety concept for NCLEX." },
      { question: "Is barrel chest seen in emphysema or chronic bronchitis?", answer: "Barrel chest is characteristic of emphysema, not chronic bronchitis. Emphysema causes alveolar destruction and air trapping. Chronic bronchitis causes excess mucus production and airway inflammation without the same degree of air trapping and thoracic remodeling." },
    ],
    internalLinks: [
      { url: "/lessons/copd", anchor: "COPD comprehensive nursing guide", context: "respiratory" },
      { url: "/lessons/emphysema", anchor: "Emphysema pathophysiology", context: "respiratory" },
      { url: "/study-guide/respiratory-emergencies-nursing-guide", anchor: "Respiratory emergencies guide", context: "related" },
      { url: "/study-guide/electrolytes-acid-base-nursing-guide", anchor: "Electrolytes & acid-base guide", context: "related" },
      { url: "/flashcards?view=decks", anchor: "Respiratory flashcard decks", context: "practice" },
    ],
    children: [],
  },
  {
    slug: "nursing-question-bank-free-practice",
    title: "Nursing Question Bank: Free NCLEX & REx-PN Practice Questions",
    metaTitle: "Nursing Question Bank – Free NCLEX & REx-PN Practice Questions | NurseNest",
    metaDescription: "Access free nursing exam practice questions for NCLEX-RN, NCLEX-PN, and REx-PN. Includes multiple-choice, select-all-that-apply, and clinical judgment questions with detailed rationales.",
    pageType: "pillar",
    exam: "NCLEX-RN",
    contentHtml: `<article>
<h1>Nursing Question Bank: Free NCLEX & REx-PN Practice Questions</h1>
<p class="lead">NurseNest's question bank provides exam-style practice questions designed by nursing educators. Practice with multiple-choice, select-all-that-apply (SATA), ordered response, and Next Generation NCLEX (NGN) question types — all with detailed rationales explaining why each option is correct or incorrect.</p>

<section id="question-bank-nursing">
<h2>Question Bank Nursing: What's Included</h2>
<p>Our nursing question bank covers every major content area tested on NCLEX-RN, NCLEX-PN, and REx-PN exams. Questions are written at application and analysis levels — the same cognitive levels used on the actual exams.</p>
<p><strong>Content areas:</strong> Medical-surgical nursing, pharmacology, maternal-newborn, pediatrics, mental health, leadership & management, fundamentals, and community health.</p>
<p><strong>Question types:</strong> Traditional multiple-choice (4 options), SATA (select all that apply), ordered response (drag-and-drop priority), hot spot, fill-in-the-blank calculations, and NGN case studies.</p>
</section>

<section id="nclex-question-bank">
<h2>NCLEX Question Bank</h2>
<p>Our NCLEX question bank aligns with the current NCSBN test plan and incorporates Next Generation NCLEX (NGN) item types. Every question is mapped to the Clinical Judgment Measurement Model (CJMM) framework used in the actual exam.</p>
<p><strong>Key features:</strong> Questions are stratified by difficulty (easy, moderate, hard), tagged by clinical system, and include comprehensive rationales that explain the nursing process behind each correct answer.</p>
<div class="clinical-pearl"><strong>Clinical Pearl:</strong> The real NCLEX uses Computer Adaptive Testing (CAT), meaning question difficulty adjusts based on your performance. Our question bank simulates this by offering mixed-difficulty sets that mirror actual exam conditions.</div>
</section>

<section id="rexpn-question-bank">
<h2>REx-PN Question Bank Canada</h2>
<p>Preparing for the Regulatory Exam for Practical Nurses (REx-PN)? Our Canadian-focused question bank uses Canadian terminology (RPN, CNO standards), metric units (°C, kg, mmol/L), and reflects the RPN scope of practice defined by the College of Nurses of Ontario.</p>
<p><strong>Canadian-specific content:</strong> SI units for lab values, Canadian drug names, provincial scope of practice, IPAC protocols, and patient safety frameworks aligned with Canadian nursing standards.</p>
</section>

<section id="how-to-use">
<h2>How to Use the Question Bank Effectively</h2>
<p><strong>1. Content review first:</strong> Study the topic using our study guides before attempting questions. This builds the foundation for clinical reasoning.</p>
<p><strong>2. Timed practice:</strong> Set a timer for ~1.5 minutes per question to simulate exam pacing. The real NCLEX allows approximately 1 minute per question.</p>
<p><strong>3. Review rationales:</strong> Always read the rationale for EVERY option — including the ones you got right. Understanding why wrong answers are wrong builds deeper clinical judgment.</p>
<p><strong>4. Track weak areas:</strong> Use our analytics to identify content areas where you score below 65% and focus your review there.</p>
</section>

<section id="free-practice">
<h2>Free NCLEX Practice Questions</h2>
<p>Start with our free practice questions to experience the format and difficulty level. Each free question includes a full rationale and maps to specific nursing content areas. Upgrade to premium for unlimited access to the complete question bank.</p>
</section>
</article>`,
    toc: [
      { id: "question-bank-nursing", label: "What's Included", level: 2 },
      { id: "nclex-question-bank", label: "NCLEX Question Bank", level: 2 },
      { id: "rexpn-question-bank", label: "REx-PN Question Bank", level: 2 },
      { id: "how-to-use", label: "How to Use Effectively", level: 2 },
      { id: "free-practice", label: "Free Practice Questions", level: 2 },
    ],
    faq: [
      { question: "How many questions are in the nursing question bank?", answer: "NurseNest's question bank contains over 1,000 exam-style questions across all major nursing content areas. New questions are added regularly, and each includes detailed rationales for every option." },
      { question: "Is the question bank aligned with NCLEX or REx-PN?", answer: "Yes. Questions are aligned with both the NCSBN NCLEX test plan (US) and the REx-PN blueprint (Canada). Canadian-specific questions use metric units, SI lab values, and reflect RPN scope of practice." },
      { question: "Are there free nursing practice questions?", answer: "Yes. NurseNest offers free practice questions across multiple content areas. Free users can access a limited number of questions daily, with full rationales. Premium subscribers get unlimited access to the complete question bank." },
      { question: "What question types are included?", answer: "Multiple-choice (4 options), select-all-that-apply (SATA), ordered response (prioritization), fill-in-the-blank calculations, and Next Generation NCLEX (NGN) case studies with clinical judgment items." },
      { question: "How do I use the question bank to study for NCLEX?", answer: "Study the content area first, then practice questions in timed mode (1-1.5 minutes per question). Always read all rationales, track your weak areas, and focus review on topics where you score below 65%. Aim for 75%+ consistently before your exam date." },
      { question: "Can I use this for NCLEX-PN preparation?", answer: "Yes. The question bank includes questions at the LPN/LVN scope of practice level. Filter by exam type to see only NCLEX-PN relevant questions covering fundamental nursing care, data collection, and medication administration within LPN scope." },
    ],
    internalLinks: [
      { url: "/flashcards?view=decks", anchor: "Free nursing flashcard decks", context: "practice" },
      { url: "/study-guide/electrolytes-acid-base-nursing-guide", anchor: "Electrolytes study guide", context: "related" },
      { url: "/study-guide/cardiac-emergencies-nursing-guide", anchor: "Cardiac emergencies guide", context: "related" },
      { url: "/study-guide/respiratory-emergencies-nursing-guide", anchor: "Respiratory emergencies guide", context: "related" },
      { url: "/shop", anchor: "NurseNest marketplace", context: "commercial" },
    ],
    children: [],
  },
];

export async function seedSEOClusters(pool: Pool) {
  try {
    const clusterSlugs = clusters.map(c => c.slug);
    const existingCount = await pool.query(
      `SELECT COUNT(*)::int AS cnt FROM seo_pages WHERE slug = ANY($1)`,
      [clusterSlugs]
    );
    if (existingCount.rows[0].cnt >= clusters.length) {
      console.log(`[SEO] Fast-path: all ${existingCount.rows[0].cnt} cluster hubs exist, skipping`);
      return;
    }

    for (const cluster of clusters) {
      const existing = await pool.query(`SELECT id FROM seo_pages WHERE slug = $1`, [cluster.slug]);
      if (existing.rows.length > 0) {
        console.log(`[SEO] Cluster hub already exists: ${cluster.slug}`);
        continue;
      }

      await pool.query(
        `INSERT INTO seo_pages (id, page_type, exam, language_code, title, slug, meta_title, meta_description, content_html, toc_json, faq_json, internal_links_json, is_public, is_indexable, translation_status, last_updated)
         VALUES (gen_random_uuid(), $1, $2, 'en', $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb, $10::jsonb, true, true, 'en_source', NOW())`,
        [
          cluster.pageType,
          cluster.exam,
          cluster.title,
          cluster.slug,
          cluster.metaTitle,
          cluster.metaDescription,
          cluster.contentHtml,
          JSON.stringify(cluster.toc),
          JSON.stringify(cluster.faq),
          JSON.stringify(cluster.internalLinks),
        ]
      );
      console.log(`[SEO] Created cluster hub: ${cluster.title}`);
    }

    console.log(`[SEO] Cluster hub seeding complete. ${clusters.length} hubs processed.`);
  } catch (error: any) {
    console.error("[SEO] Error seeding cluster hubs:", error.message);
  }
}
