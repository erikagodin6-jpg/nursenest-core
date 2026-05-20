import { pool } from "./storage";

interface StudyGuide {
  pageType: string;
  exam: string;
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  contentHtml: string;
  tocJson: { id: string; label: string; level: number }[];
  faqJson: { question: string; answer: string }[];
  internalLinksJson: { url: string; anchor: string; context: string }[];
}

const LONG_FORM_STUDY_GUIDES: StudyGuide[] = [
  {
    pageType: "long-form-guide",
    exam: "NCLEX",
    title: "NCLEX Pharmacology Study Guide: Complete Drug Classification Review",
    slug: "nclex-pharmacology-study-guide",
    metaTitle: "NCLEX Pharmacology Study Guide: Drug Review | NurseNest",
    metaDescription: "Comprehensive NCLEX pharmacology study guide covering all major drug classifications, medication safety, dosage calculations, and nursing considerations. 2000+ word in-depth review.",
    contentHtml: `<article>
<h1>NCLEX Pharmacology Study Guide: Complete Drug Classification Review</h1>
<p class="lead">Pharmacology is woven throughout the NCLEX examination, appearing in nearly every clinical scenario. This comprehensive study guide reviews all major drug classifications tested on the NCLEX-RN and NCLEX-PN/REx-PN, with emphasis on nursing considerations, patient education, lab monitoring, and medication safety principles that form the core of safe nursing practice.</p>

<section id="approach">
<h2>The Drug Classification Approach to Pharmacology</h2>
<p>The most efficient way to learn pharmacology for the NCLEX is by drug class rather than individual medications. When you understand how a drug class works, you can apply that knowledge to any medication within that class. This approach is particularly powerful because the NCLEX tests application and clinical judgment, not memorization of brand names.</p>
<p>For each drug class, focus on four key areas: (1) mechanism of action — how the drug works at the cellular or receptor level, (2) therapeutic effects — what clinical improvements you expect to see, (3) adverse effects and nursing considerations — what you monitor for and what safety measures to implement, and (4) patient education — what the patient needs to know for safe self-administration. Drug name suffixes are your best friend: medications ending in -pril are ACE inhibitors, -sartan are ARBs, -olol are beta-blockers, -statin are HMG-CoA reductase inhibitors, and -pam or -lam are benzodiazepines.</p>
</section>

<section id="cardiovascular">
<h2>Cardiovascular Medications</h2>
<p><strong>ACE Inhibitors (-pril):</strong> Lisinopril, enalapril, captopril, and ramipril block the conversion of angiotensin I to angiotensin II, reducing vasoconstriction and aldosterone secretion. This lowers blood pressure and reduces cardiac workload, making ACE inhibitors first-line for hypertension, heart failure, and diabetic nephropathy. The hallmark side effect is a persistent dry cough caused by bradykinin accumulation. Monitor for hyperkalemia (potassium levels >5.0 mEq/L), first-dose hypotension, and angioedema (swelling of the face, lips, or tongue — a medical emergency requiring immediate discontinuation). ACE inhibitors are contraindicated in pregnancy due to teratogenic effects. Teach patients to rise slowly from sitting or lying positions and to avoid potassium supplements or salt substitutes containing potassium.</p>
<p><strong>Beta-Blockers (-olol):</strong> Metoprolol, atenolol, propranolol, and carvedilol block beta-adrenergic receptors, reducing heart rate, blood pressure, and myocardial oxygen demand. Cardioselective beta-blockers (metoprolol, atenolol) primarily affect beta-1 receptors in the heart, while non-selective agents (propranolol) also block beta-2 receptors in the lungs and may trigger bronchospasm in patients with asthma or COPD. Always check the apical heart rate for 60 seconds before administration — hold if below 60 bpm and notify the provider. Never abruptly discontinue beta-blockers, as rebound tachycardia and hypertensive crisis can result. Beta-blockers may mask hypoglycemia symptoms in diabetic patients, so teach patients to monitor blood glucose rather than relying on symptoms alone.</p>
<p><strong>Anticoagulants:</strong> Heparin (unfractionated and LMWH), warfarin, and direct oral anticoagulants (DOACs: apixaban, rivarelbaan, dabigatran) prevent clot formation through different mechanisms. Heparin works immediately and is monitored with aPTT (goal 1.5-2.5 times normal); antidote is protamine sulfate. Warfarin takes 3-5 days to reach therapeutic effect and is monitored with PT/INR (goal INR 2.0-3.0 for most indications); antidote is vitamin K (phytonadione). DOACs do not require routine monitoring but lack specific reversal agents for most (except idarucizumab for dabigatran). Teach warfarin patients about consistent vitamin K intake, drug interactions, and signs of bleeding. Never give heparin and warfarin doses simultaneously through the same IV line.</p>
<p><strong>Antiarrhythmics:</strong> Amiodarone is the most commonly used class III antiarrhythmic, used for life-threatening ventricular dysrhythmias and atrial fibrillation. It has an extremely long half-life (40-55 days) and causes pulmonary toxicity (baseline and periodic chest X-rays), thyroid dysfunction (contains iodine), hepatotoxicity (monitor LFTs), corneal microdeposits (annual eye exams), and photosensitivity (sunscreen and protective clothing). Digoxin is used in atrial fibrillation and heart failure. Check apical pulse for 60 seconds before each dose; hold if <60 bpm. Monitor digoxin levels (therapeutic: 0.5-2.0 ng/mL) and potassium (hypokalemia increases toxicity risk). Signs of toxicity include nausea, vomiting, visual disturbances (yellow-green halos), and bradycardia.</p>
</section>

<section id="endocrine">
<h2>Endocrine Medications</h2>
<p><strong>Insulin:</strong> Understanding insulin types is essential for NCLEX success. Rapid-acting insulin (lispro, aspart) has onset in 15 minutes, peak at 1-2 hours, and duration of 3-4 hours — given immediately before or after meals. Short-acting insulin (regular) has onset in 30-60 minutes, peak at 2-4 hours, and duration of 6-8 hours — the only insulin that can be given IV. Intermediate-acting insulin (NPH) has onset in 1-2 hours, peak at 4-12 hours, and duration of 12-18 hours — given once or twice daily. Long-acting insulin (glargine, detemir) has onset in 1-2 hours, no peak (steady state), and duration of 24 hours — never mixed with other insulins. When mixing insulin, always draw clear (regular) before cloudy (NPH) to prevent contamination.</p>
<p><strong>Oral Hypoglycemics:</strong> Metformin is first-line for type 2 diabetes. It decreases hepatic glucose production and increases insulin sensitivity without causing hypoglycemia when used alone. Hold metformin 48 hours before and after contrast dye procedures (risk of lactic acidosis). Monitor renal function. GI side effects (nausea, diarrhea) are common initially. Sulfonylureas (glipizide, glyburide) stimulate insulin secretion and CAN cause hypoglycemia — teach patients to carry glucose tablets. SGLT2 inhibitors (ending in -gliflozin) cause glucose excretion in urine and increase UTI and yeast infection risk.</p>
<p><strong>Thyroid Medications:</strong> Levothyroxine replaces thyroid hormone in hypothyroidism. Take on an empty stomach, 30-60 minutes before breakfast, with water only (no calcium, iron, or antacids within 4 hours as they reduce absorption). Monitor TSH levels — decreased TSH indicates overreplacement. Methimazole is used for hyperthyroidism, blocking thyroid hormone synthesis. Monitor for agranulocytosis (sore throat, fever, mouth sores — report immediately). PTU (propylthiouracil) is preferred in the first trimester of pregnancy.</p>
</section>

<section id="neurological">
<h2>Neurological & Psychiatric Medications</h2>
<p><strong>Antidepressants:</strong> SSRIs (fluoxetine, sertraline, escitalopram) are first-line for depression. They take 2-6 weeks to reach therapeutic effect — educate patients about this delay. Monitor for suicidal ideation, especially in the first 2-4 weeks and in adolescents. Serotonin syndrome is a potentially fatal drug interaction (confusion, agitation, tachycardia, hyperthermia, myoclonus) that occurs when serotonergic drugs are combined. Never combine SSRIs with MAOIs — at least 14 days washout period required. MAOIs (phenelzine, tranylcypromine) require strict dietary restrictions: avoid tyramine-rich foods (aged cheese, cured meats, red wine, soy sauce) to prevent hypertensive crisis.</p>
<p><strong>Antipsychotics:</strong> Typical antipsychotics (haloperidol, chlorpromazine) block dopamine receptors and are associated with extrapyramidal symptoms (EPS): acute dystonia (treat with benztropine or diphenhydramine), akathisia (restlessness), and tardive dyskinesia (involuntary facial movements — often irreversible). Neuroleptic malignant syndrome (NMS) is a life-threatening reaction: high fever, muscle rigidity, altered mental status, autonomic dysfunction — discontinue medication immediately. Atypical antipsychotics (olanzapine, quetiapine, risperidone) have lower EPS risk but cause metabolic syndrome (weight gain, hyperglycemia, dyslipidemia) — monitor fasting glucose and lipid panels.</p>
<p><strong>Antiepileptics:</strong> Phenytoin has a narrow therapeutic index (10-20 mcg/mL). Monitor levels regularly. Side effects include gingival hyperplasia (dental hygiene education), hirsutism, and ataxia. IV phenytoin requires slow infusion with cardiac monitoring. Valproic acid requires hepatic function monitoring. Carbamazepine can cause aplastic anemia — monitor CBC. All antiepileptics carry risk of Stevens-Johnson syndrome (rash — discontinue immediately). Never abruptly stop antiepileptics — taper gradually to prevent status epilepticus.</p>
</section>

<section id="analgesics">
<h2>Analgesics & Pain Management</h2>
<p><strong>Opioid Analgesics:</strong> Morphine, hydromorphone, fentanyl, and oxycodone provide potent pain relief by binding mu-opioid receptors. Always assess respiratory rate before administration — hold for RR below 12 and administer naloxone (Narcan) for respiratory depression. Constipation is the most common side effect and does not develop tolerance — always order a bowel regimen with opioid therapy. Assess pain using validated scales. Patient-controlled analgesia (PCA) pumps should only be activated by the patient, never by family members or nurses (demand dosing). Equianalgesic dosing charts guide medication conversions.</p>
<p><strong>NSAIDs:</strong> Ibuprofen, naproxen, and ketorolac provide anti-inflammatory, analgesic, and antipyretic effects by inhibiting cyclooxygenase (COX). Administer with food to reduce GI irritation. Monitor for GI bleeding, renal impairment, and cardiovascular events with long-term use. Contraindicated in active GI bleeding, renal insufficiency, and the third trimester of pregnancy. Ketorolac IV/IM should not exceed 5 days due to bleeding risk.</p>
<p><strong>Acetaminophen:</strong> Effective analgesic and antipyretic without anti-inflammatory properties. Maximum daily dose is 3,000-4,000 mg for adults (lower in elderly and hepatic impairment). Hepatotoxicity is the primary concern — teach patients to check all medications for hidden acetaminophen content. Antidote for overdose is N-acetylcysteine (Mucomyst), most effective within 8 hours of ingestion.</p>
</section>

<section id="antimicrobials">
<h2>Antimicrobials & Anti-Infectives</h2>
<p><strong>Antibiotics:</strong> Penicillins and cephalosporins share a beta-lactam ring structure — cross-sensitivity is possible. Always assess allergy history. Aminoglycosides (gentamicin, tobramycin) are nephrotoxic and ototoxic — monitor peak and trough levels, creatinine, and assess for hearing changes. Vancomycin requires trough level monitoring (15-20 mcg/mL for serious infections) and can cause Red Man Syndrome if infused too rapidly (slow infusion over 60 minutes minimum). Fluoroquinolones (ciprofloxacin, levofloxacin) carry black box warnings for tendon rupture and peripheral neuropathy. Complete the full course of antibiotics — stopping early promotes resistance.</p>
<p><strong>Antifungals:</strong> Amphotericin B is used for severe systemic fungal infections but causes nephrotoxicity (monitor BUN, creatinine) and infusion reactions (premedicate with acetaminophen and diphenhydramine). Fluconazole is commonly used for candidiasis and has fewer side effects. Antituberculars follow the RIPE protocol: Rifampin (turns body fluids orange-red), Isoniazid (monitor hepatic function, supplement vitamin B6), Pyrazinamide, and Ethambutol (visual acuity monitoring).</p>
</section>

<section id="medication-safety">
<h2>Medication Safety Principles</h2>
<p>The NCLEX tests medication safety throughout the exam. Key principles include: verify patient identity using two identifiers before every medication administration; perform independent double-checks for high-alert medications; never crush extended-release, enteric-coated, or sublingual formulations; report all medication errors and near-misses; use tall-man lettering to differentiate look-alike drug names; and document medications immediately after administration, never before.</p>
<p>Dosage calculations on the NCLEX require proficiency in weight-based dosing (mg/kg), IV flow rate calculations (gtts/min), and concentration-based calculations. Always use dimensional analysis or ratio-proportion methods and verify your calculations with a second nurse for high-alert medications. Know that pediatric and geriatric patients require dose adjustments based on weight, organ function, and pharmacokinetic changes associated with age.</p>
</section>
</article>`,
    tocJson: [
      { id: "approach", label: "Drug Classification Approach", level: 2 },
      { id: "cardiovascular", label: "Cardiovascular Meds", level: 2 },
      { id: "endocrine", label: "Endocrine Meds", level: 2 },
      { id: "neurological", label: "Neurological & Psych", level: 2 },
      { id: "analgesics", label: "Analgesics", level: 2 },
      { id: "antimicrobials", label: "Antimicrobials", level: 2 },
      { id: "medication-safety", label: "Medication Safety", level: 2 },
    ],
    faqJson: [
      { question: "How should I study pharmacology for the NCLEX?", answer: "Study by drug class using suffix patterns (-pril, -olol, -statin). Focus on mechanism of action, nursing considerations, lab monitoring, and patient education rather than memorizing individual drug names. Use flashcards with spaced repetition for retention." },
      { question: "What are the most commonly tested medications on the NCLEX?", answer: "ACE inhibitors, beta-blockers, anticoagulants (heparin, warfarin), insulin types, digoxin, opioid analgesics, SSRIs, antiepileptics, and aminoglycosides are among the most frequently tested medications." },
      { question: "How many pharmacology questions are on the NCLEX?", answer: "Pharmacology is integrated throughout the NCLEX rather than being a separate section. Expect medication-related content in approximately 30-40% of questions, often combined with clinical scenarios requiring prioritization and safety decisions." },
      { question: "What medication calculations should I know for the NCLEX?", answer: "Master weight-based dosing (mg/kg), IV flow rate calculations (gtts/min and mL/hr), and reconstitution calculations. Use dimensional analysis consistently and always verify high-alert medication calculations with a second nurse." },
    ],
    internalLinksJson: [
      { url: "/question-bank", anchor: "Pharmacology Practice Questions", context: "practice" },
      { url: "/flashcards", anchor: "Drug Classification Flashcards", context: "practice" },
      { url: "/med-math", anchor: "Dosage Calculation Practice", context: "practice" },
      { url: "/nclex-pharmacology-hub", anchor: "Pharmacology Topic Hub", context: "hub" },
      { url: "/lessons", anchor: "Browse Pharmacology Lessons", context: "lessons" },
    ],
  },
  {
    pageType: "long-form-guide",
    exam: "NCLEX",
    title: "ABG Interpretation: Complete Step-by-Step Study Guide for Nursing Students",
    slug: "abg-interpretation-study-guide",
    metaTitle: "ABG Interpretation Study Guide: Step-by-Step | NurseNest",
    metaDescription: "Comprehensive ABG interpretation study guide for nursing students. Step-by-step analysis method, acid-base disorders, compensation, and clinical application with practice examples.",
    contentHtml: `<article>
<h1>ABG Interpretation: Complete Step-by-Step Study Guide for Nursing Students</h1>
<p class="lead">Arterial blood gas (ABG) interpretation is a critical clinical skill tested on every nursing certification exam and used daily in clinical practice. This comprehensive study guide teaches you a systematic approach to ABG analysis, covers all four primary acid-base disturbances, explains compensation mechanisms, and provides clinical examples to reinforce your understanding.</p>

<section id="normal-values">
<h2>Normal ABG Values</h2>
<p>Before interpreting any ABG, you must know the normal ranges:</p>
<table>
<tr><th>Parameter</th><th>Normal Range</th><th>Clinical Significance</th></tr>
<tr><td><strong>pH</strong></td><td>7.35 – 7.45</td><td>Reflects overall acid-base status. Below 7.35 = acidosis. Above 7.45 = alkalosis.</td></tr>
<tr><td><strong>PaCO2</strong></td><td>35 – 45 mmHg</td><td>Respiratory component. Regulated by the lungs through ventilation rate and depth.</td></tr>
<tr><td><strong>HCO3</strong></td><td>22 – 26 mEq/L</td><td>Metabolic component. Regulated by the kidneys through bicarbonate reabsorption and excretion.</td></tr>
<tr><td><strong>PaO2</strong></td><td>80 – 100 mmHg</td><td>Oxygenation status. Below 60 mmHg indicates respiratory failure.</td></tr>
<tr><td><strong>SaO2</strong></td><td>95 – 100%</td><td>Oxygen saturation. Correlates with PaO2 on the oxyhemoglobin dissociation curve.</td></tr>
<tr><td><strong>Base Excess</strong></td><td>-2 to +2 mEq/L</td><td>Metabolic component indicator. Negative = metabolic acidosis. Positive = metabolic alkalosis.</td></tr>
</table>
</section>

<section id="step-by-step">
<h2>Step-by-Step ABG Interpretation Method</h2>
<p><strong>Step 1: Evaluate the pH.</strong> Is the patient acidotic (pH < 7.35) or alkalotic (pH > 7.45)? If the pH is within normal range, the patient may be compensated or normal. The pH tells you the direction of the primary disturbance — this is your starting point.</p>
<p><strong>Step 2: Evaluate the PaCO2.</strong> Is the CO2 normal (35-45), elevated (>45), or decreased (<35)? Remember that CO2 is an acid — elevated CO2 causes acidosis, and decreased CO2 causes alkalosis. CO2 is the respiratory component, regulated by ventilation.</p>
<p><strong>Step 3: Evaluate the HCO3.</strong> Is the bicarbonate normal (22-26), elevated (>26), or decreased (<22)? Bicarbonate is a base — elevated HCO3 causes alkalosis, and decreased HCO3 causes acidosis. HCO3 is the metabolic component, regulated by the kidneys.</p>
<p><strong>Step 4: Identify the primary disturbance.</strong> Use the ROME method: Respiratory = Opposite (pH and PaCO2 move in opposite directions), Metabolic = Equal (pH and HCO3 move in the same direction). Which component matches the pH direction? That is your primary disturbance.</p>
<p><strong>Step 5: Determine compensation.</strong> Check the other component (the one that is NOT the primary cause). Is it normal (uncompensated), moving in the direction to correct the pH (partially compensated), or has it returned the pH to near normal (fully compensated)?</p>
<p><strong>Step 6: Assess oxygenation.</strong> Evaluate PaO2 and SaO2. Is the patient hypoxemic (PaO2 < 80)? PaO2 below 60 mmHg indicates respiratory failure and requires immediate intervention. Oxygenation is assessed independently from acid-base status.</p>
</section>

<section id="respiratory-acidosis">
<h2>Respiratory Acidosis</h2>
<p><strong>Definition:</strong> pH < 7.35 with PaCO2 > 45 mmHg. Caused by CO2 retention due to inadequate ventilation (hypoventilation).</p>
<p><strong>Common causes:</strong> COPD exacerbation, opioid or sedative overdose, neuromuscular diseases (myasthenia gravis, Guillain-Barré), severe asthma, pneumothorax, obesity hypoventilation syndrome, and respiratory muscle fatigue.</p>
<p><strong>Clinical signs:</strong> Dyspnea, confusion, drowsiness, headache (from cerebral vasodilation), tachycardia, and potentially decreased level of consciousness progressing to respiratory arrest.</p>
<p><strong>Nursing interventions:</strong> Improve ventilation — position patient upright, administer bronchodilators, assist with non-invasive ventilation (BiPAP) or mechanical ventilation if needed. For opioid overdose, administer naloxone. Monitor respiratory rate, depth, and pattern. Administer supplemental oxygen cautiously in COPD patients (target SpO2 88-92% to avoid suppressing hypoxic drive).</p>
<p><strong>Compensation:</strong> The kidneys compensate by retaining HCO3 (bicarbonate will be elevated >26 mEq/L). Renal compensation takes 24-48 hours to begin, so acute respiratory acidosis shows normal HCO3 while chronic shows elevated HCO3.</p>
<p><strong>Example:</strong> pH 7.28, PaCO2 58, HCO3 24 → Uncompensated respiratory acidosis (kidneys have not yet compensated — this is acute).</p>
</section>

<section id="respiratory-alkalosis">
<h2>Respiratory Alkalosis</h2>
<p><strong>Definition:</strong> pH > 7.45 with PaCO2 < 35 mmHg. Caused by excessive CO2 elimination due to hyperventilation.</p>
<p><strong>Common causes:</strong> Anxiety and panic attacks, pain, fever, early sepsis, salicylate poisoning (early stage), pulmonary embolism, high altitude, and mechanical overventilation.</p>
<p><strong>Clinical signs:</strong> Lightheadedness, tingling in fingers and around mouth (perioral paresthesia), muscle spasms, palpitations, and chest tightness.</p>
<p><strong>Nursing interventions:</strong> Address the underlying cause. For anxiety-related hyperventilation, coach slow, deep breathing (avoid paper bag rebreathing due to hypoxia risk). For mechanical ventilation, decrease respiratory rate or tidal volume. Treat fever, pain, or other triggers.</p>
<p><strong>Compensation:</strong> Kidneys excrete HCO3, so bicarbonate drops below 22 mEq/L. Takes 24-48 hours for renal compensation to take effect.</p>
<p><strong>Example:</strong> pH 7.52, PaCO2 28, HCO3 24 → Uncompensated respiratory alkalosis (acute, no renal compensation yet).</p>
</section>

<section id="metabolic-acidosis">
<h2>Metabolic Acidosis</h2>
<p><strong>Definition:</strong> pH < 7.35 with HCO3 < 22 mEq/L. Caused by either excess acid production/ingestion or bicarbonate loss.</p>
<p><strong>Common causes:</strong> Diabetic ketoacidosis (DKA), lactic acidosis (shock, sepsis), renal failure, severe diarrhea (bicarbonate loss), salicylate poisoning (late stage), methanol or ethylene glycol ingestion.</p>
<p><strong>Anion Gap:</strong> Calculate the anion gap (Na - [Cl + HCO3], normal 8-12) to narrow the differential. Elevated anion gap suggests acid production (DKA, lactic acidosis, toxic ingestions — mnemonic MUDPILES). Normal anion gap suggests bicarbonate loss (diarrhea, renal tubular acidosis).</p>
<p><strong>Clinical signs:</strong> Kussmaul respirations (deep, rapid breathing — the body trying to blow off CO2 to compensate), nausea, vomiting, abdominal pain, confusion, fruity breath odor (DKA), and potentially cardiovascular collapse in severe acidosis.</p>
<p><strong>Nursing interventions:</strong> Treat the underlying cause. For DKA, administer insulin and IV fluids. For lactic acidosis, restore tissue perfusion. Administer sodium bicarbonate only for severe acidosis (pH < 7.1) as ordered. Monitor potassium (acidosis causes hyperkalemia as H+ moves into cells and K+ moves out).</p>
<p><strong>Compensation:</strong> The lungs compensate by hyperventilating to blow off CO2 (PaCO2 drops below 35 mmHg). Respiratory compensation begins within minutes — this is faster than renal compensation.</p>
</section>

<section id="metabolic-alkalosis">
<h2>Metabolic Alkalosis</h2>
<p><strong>Definition:</strong> pH > 7.45 with HCO3 > 26 mEq/L. Caused by excess bicarbonate or loss of acid.</p>
<p><strong>Common causes:</strong> Prolonged vomiting or NG tube suctioning (loss of HCl), excessive antacid use, loop diuretic therapy (volume contraction alkalosis), hypokalemia (kidneys retain H+ to conserve K+), and excessive sodium bicarbonate administration.</p>
<p><strong>Clinical signs:</strong> Confusion, muscle twitching, numbness and tingling, cardiac dysrhythmias (associated hypokalemia), and potentially seizures in severe cases.</p>
<p><strong>Nursing interventions:</strong> Treat the underlying cause. Replace chloride and potassium as ordered. For vomiting, administer antiemetics. Discontinue or reduce diuretic therapy if applicable. Monitor cardiac rhythm for dysrhythmias related to electrolyte imbalances.</p>
<p><strong>Compensation:</strong> The lungs compensate by hypoventilating to retain CO2 (PaCO2 rises above 45 mmHg). However, respiratory compensation for metabolic alkalosis is limited because the body will not hypoventilate to the point of dangerous hypoxemia.</p>
</section>

<section id="clinical-application">
<h2>Clinical Application & Practice Cases</h2>
<p><strong>Case 1:</strong> Patient with COPD exacerbation. ABG: pH 7.32, PaCO2 55, HCO3 30, PaO2 58. Analysis: Partially compensated respiratory acidosis with hypoxemia. The elevated PaCO2 causes acidosis (respiratory cause). The elevated HCO3 shows renal compensation (kidneys retaining bicarb), but pH is still acidotic (partial compensation). This pattern is typical of chronic COPD with acute exacerbation.</p>
<p><strong>Case 2:</strong> Patient with DKA. ABG: pH 7.18, PaCO2 20, HCO3 10, PaO2 95. Analysis: Partially compensated metabolic acidosis. The decreased HCO3 causes acidosis (metabolic cause). The decreased PaCO2 shows respiratory compensation (Kussmaul breathing — lungs blowing off CO2), but pH remains severely acidotic. Priority: insulin, IV fluids, potassium monitoring.</p>
<p><strong>Case 3:</strong> Patient with anxiety attack. ABG: pH 7.50, PaCO2 28, HCO3 24, PaO2 100. Analysis: Uncompensated respiratory alkalosis. The decreased PaCO2 causes alkalosis (respiratory cause from hyperventilation). HCO3 is normal (kidneys have not yet compensated — acute episode). Priority: address anxiety, coach slow breathing.</p>
<p><strong>Case 4:</strong> Patient with prolonged NG suction. ABG: pH 7.48, PaCO2 46, HCO3 32, PaO2 90. Analysis: Partially compensated metabolic alkalosis. The elevated HCO3 causes alkalosis (metabolic cause from HCl loss through NG suction). The slightly elevated PaCO2 shows limited respiratory compensation. Priority: replace chloride and potassium, reassess need for NG suction.</p>
</section>

<section id="exam-tips">
<h2>NCLEX Exam Tips for ABG Questions</h2>
<p>The NCLEX tests ABG interpretation through clinical scenarios that require you to both interpret the values and select the appropriate nursing intervention. Remember these exam strategies:</p>
<ol>
<li>Always identify the primary disturbance before considering compensation</li>
<li>Match the acid-base disturbance with the most likely clinical cause given in the scenario</li>
<li>Select interventions that address the underlying cause, not just the numbers</li>
<li>Remember that oxygenation (PaO2) is assessed independently from acid-base status</li>
<li>In NCLEX priority questions, respiratory acidosis with hypoxemia requires immediate airway intervention</li>
</ol>
</section>
</article>`,
    tocJson: [
      { id: "normal-values", label: "Normal ABG Values", level: 2 },
      { id: "step-by-step", label: "Step-by-Step Method", level: 2 },
      { id: "respiratory-acidosis", label: "Respiratory Acidosis", level: 2 },
      { id: "respiratory-alkalosis", label: "Respiratory Alkalosis", level: 2 },
      { id: "metabolic-acidosis", label: "Metabolic Acidosis", level: 2 },
      { id: "metabolic-alkalosis", label: "Metabolic Alkalosis", level: 2 },
      { id: "clinical-application", label: "Clinical Cases", level: 2 },
      { id: "exam-tips", label: "Exam Tips", level: 2 },
    ],
    faqJson: [
      { question: "What is the easiest way to interpret ABGs?", answer: "Use the step-by-step method: (1) Check pH for acidosis or alkalosis, (2) Check PaCO2 for respiratory cause, (3) Check HCO3 for metabolic cause, (4) Use ROME to identify primary disturbance, (5) Check the other component for compensation, (6) Assess PaO2 for oxygenation." },
      { question: "What does it mean when an ABG is compensated?", answer: "Compensation means the body is attempting to correct the pH. The opposite system (lungs or kidneys) adjusts to bring pH back toward normal. Partial compensation means the pH is still abnormal. Full compensation means the pH has returned to near-normal range despite abnormal PaCO2 and HCO3 values." },
      { question: "How do I know if it is respiratory or metabolic?", answer: "Use the ROME method: Respiratory = Opposite (pH and PaCO2 move in opposite directions — if pH is down and PaCO2 is up, it is respiratory acidosis). Metabolic = Equal (pH and HCO3 move in the same direction — if both are down, it is metabolic acidosis)." },
      { question: "What are the most common ABG questions on the NCLEX?", answer: "NCLEX frequently tests ABG interpretation in clinical scenarios involving COPD exacerbation, DKA, hyperventilation, prolonged vomiting, and mechanical ventilation adjustments. Focus on interpreting values AND selecting the priority nursing intervention." },
    ],
    internalLinksJson: [
      { url: "/lessons/abg-basics", anchor: "ABG Interpretation Lesson", context: "lesson" },
      { url: "/electrolyte-abg-simulator", anchor: "ABG Interpretation Simulator", context: "practice" },
      { url: "/question-bank", anchor: "ABG Practice Questions", context: "practice" },
      { url: "/flashcards", anchor: "ABG Flashcard Deck", context: "practice" },
      { url: "/study-guide/electrolytes-acid-base-nursing-guide", anchor: "Electrolytes & Acid-Base Guide", context: "related" },
    ],
  },
  {
    pageType: "long-form-guide",
    exam: "NCLEX",
    title: "New Grad Nurse Survival Guide: Your Complete First Year Handbook",
    slug: "new-grad-nurse-survival-guide",
    metaTitle: "New Grad Nurse Survival Guide: First Year Handbook | NurseNest",
    metaDescription: "Complete new graduate nurse survival guide covering orientation, time management, clinical skills, communication, and building confidence in your first year of nursing practice.",
    contentHtml: `<article>
<h1>New Grad Nurse Survival Guide: Your Complete First Year Handbook</h1>
<p class="lead">The transition from nursing student to practicing nurse is one of the most challenging and transformative experiences in your professional life. This comprehensive survival guide addresses every aspect of your first year, from navigating orientation to building clinical confidence, managing multiple patients, communicating with physicians, handling your first emergency, and developing the resilience needed for a sustainable nursing career.</p>

<section id="orientation">
<h2>Navigating Your Orientation Period</h2>
<p>Your orientation period, typically 8-12 weeks on most units, is your protected learning time. This is when you develop unit-specific skills under the guidance of a preceptor before taking on independent patient assignments. Approach orientation with a growth mindset: every challenging situation is a learning opportunity, and asking questions is a sign of professional maturity, not weakness.</p>
<p>During orientation, focus on learning the physical layout of your unit (supply rooms, medication rooms, emergency equipment locations), mastering the electronic health record system, understanding unit-specific protocols and order sets, building relationships with your preceptor and nursing team, and establishing your clinical routine. Keep a small notebook to write down tips, common medication doses, and unit-specific policies that you will reference frequently during your first few months.</p>
<p>Your preceptor is your most valuable resource. Communicate openly about your learning goals, ask for feedback regularly, and discuss clinical decisions in real-time rather than assuming you should already know the answer. The best preceptor-preceptee relationships are built on mutual respect, honest communication, and a shared commitment to patient safety.</p>
</section>

<section id="time-management">
<h2>Time Management & Organization</h2>
<p>Managing 4-6 patients simultaneously is one of the biggest adjustments for new graduate nurses. The key is developing a consistent system that keeps you organized and ensures nothing falls through the cracks. Start each shift with a structured approach to receiving report and planning your care.</p>
<p><strong>Brain Sheet Strategy:</strong> Create a personal brain sheet (nursing worksheet) that captures essential information for each patient: room number, name, diagnosis, code status, allergies, IV access and fluids, diet, activity level, scheduled medications (with times), pending labs or procedures, and notes from report. Review and update your brain sheet throughout the shift.</p>
<p><strong>Time-Blocking:</strong> Cluster your care activities to maximize efficiency. Round on all patients within the first hour to perform assessments, check IVs, and identify urgent needs. Group medication administration times when possible. Schedule dressing changes and procedures during slower periods. Always leave buffer time for unexpected events — they will happen every shift.</p>
<p><strong>Prioritization Framework:</strong> When everything feels urgent, use this hierarchy: (1) Airway, Breathing, Circulation threats — immediate action required; (2) Pain management and time-critical medications; (3) Assessments and documentation; (4) Routine care and patient education; (5) Administrative tasks. Delegate appropriately to CNAs and other team members.</p>
</section>

<section id="clinical-skills">
<h2>Building Clinical Competence</h2>
<p>Clinical confidence develops through repetition and reflection. In your first year, focus on mastering these foundational skills:</p>
<p><strong>Assessment:</strong> Develop a systematic head-to-toe assessment routine that you perform consistently on every patient. Practice until your assessment takes 5-7 minutes per patient. Learn to recognize subtle changes that indicate deterioration: a rising heart rate, a change in level of consciousness, new confusion in an elderly patient, or a slight decrease in oxygen saturation that trends downward over hours.</p>
<p><strong>Medication Administration:</strong> Follow the rights of medication administration religiously. Develop a routine for medication passes that includes scanning barcodes, checking allergies, verifying doses, and educating patients about what they are receiving. When you encounter an unfamiliar medication, look it up before administering — this is a professional responsibility, not a knowledge gap to be embarrassed about.</p>
<p><strong>IV Skills:</strong> IV insertion, IV medication administration, and IV site assessment are skills that improve with practice. Ask experienced nurses to observe your IV starts and provide technique feedback. Learn to troubleshoot IV pump alarms efficiently. Know the signs of infiltration, phlebitis, and extravasation and the appropriate nursing responses for each.</p>
<p><strong>Documentation:</strong> Chart in real-time whenever possible rather than batching documentation at the end of the shift. Real-time charting is more accurate, reduces the risk of forgetting important details, and is legally stronger if records are ever reviewed. Use objective language, document assessment findings before and after interventions, and never chart for someone else.</p>
</section>

<section id="communication">
<h2>Communication & Professional Relationships</h2>
<p><strong>SBAR Communication:</strong> When calling a physician or reporting to your charge nurse, use the SBAR framework: Situation (why you are calling), Background (relevant medical history and current treatment), Assessment (your clinical findings and concerns), and Recommendation (what you think should be done). Prepare your SBAR before making the call — have vital signs, relevant lab values, and the patient's chart available.</p>
<p><strong>Physician Communication:</strong> Many new nurses feel intimidated calling physicians, especially at night. Remember that you are the patient's advocate and the physician needs your assessment data to make clinical decisions. Be clear, concise, and confident. If a physician gives an order you are uncomfortable with, it is your professional duty to question it respectfully and escalate through the chain of command if needed.</p>
<p><strong>Team Dynamics:</strong> Building positive relationships with your nursing team, CNAs, unit clerks, and allied health professionals makes your shifts run more smoothly. Help others when your patient load allows it, express appreciation for assistance, and communicate clearly about task delegation and patient status changes. Avoid gossip, workplace politics, and the temptation to compare yourself to more experienced nurses.</p>
</section>

<section id="emergencies">
<h2>Handling Your First Emergency</h2>
<p>Every new nurse dreads their first code blue or rapid response, but preparation reduces panic. Know the location of the crash cart, AED, and emergency equipment on your unit. Review BLS and ACLS algorithms regularly. When an emergency occurs, call for help immediately (never try to manage it alone), start CPR if indicated, and communicate clearly with the code team.</p>
<p>After your first emergency, request a debriefing with your charge nurse or preceptor. Process the experience rather than internalizing it. Most new nurses describe feeling that they "froze" during their first code — this is normal and improves with each subsequent experience. Participate in mock code drills offered by your unit or hospital to build muscle memory.</p>
<p>Recognize early warning signs of deterioration before a patient codes: rising NEWS score, increasing oxygen requirements, hypotension not responding to position changes, new-onset confusion, and oliguria. Activating a rapid response team early is always preferable to managing a full cardiac arrest. Trust your instincts — if something feels wrong, it probably is.</p>
</section>

<section id="self-care">
<h2>Self-Care & Resilience</h2>
<p>Nursing is physically and emotionally demanding. Sustainable career longevity requires intentional self-care strategies from day one. Prioritize sleep, especially when adjusting to shift work — invest in blackout curtains, maintain a consistent sleep routine even on days off, and avoid caffeine within 6 hours of your intended sleep time.</p>
<p>Develop healthy coping mechanisms for the emotional weight of patient care. It is normal to be affected by patient suffering, deaths, and difficult family interactions. What is not normal is ignoring these feelings. Talk to trusted colleagues, utilize your employee assistance program, and consider journaling as a processing tool. Compassion fatigue and burnout are real professional hazards that develop when self-care is neglected.</p>
<p>Set boundaries between work and personal life. Avoid taking on extra shifts during your first 6 months unless absolutely necessary. Maintain relationships and activities outside of nursing. Exercise regularly — even 20-30 minutes of walking on your days off has significant benefits for physical and mental health. Remember that taking care of yourself is not selfish — it is essential for providing safe, compassionate patient care.</p>
</section>
</article>`,
    tocJson: [
      { id: "orientation", label: "Navigating Orientation", level: 2 },
      { id: "time-management", label: "Time Management", level: 2 },
      { id: "clinical-skills", label: "Building Clinical Skills", level: 2 },
      { id: "communication", label: "Communication", level: 2 },
      { id: "emergencies", label: "Handling Emergencies", level: 2 },
      { id: "self-care", label: "Self-Care & Resilience", level: 2 },
    ],
    faqJson: [
      { question: "How long does it take to feel confident as a new nurse?", answer: "Most new graduates report significant improvement in confidence between 6-12 months. The first 3 months are the most challenging. By 6 months, basic skills feel more automatic. By 12 months, most new nurses feel comfortable with routine patient care and are developing specialty knowledge." },
      { question: "What should I do if I make a medication error?", answer: "Report the error immediately to your charge nurse and follow your facility's incident reporting protocol. Assess the patient, notify the prescriber, document the event accurately, and monitor for adverse effects. Medication errors are learning opportunities — the healthcare system improves through honest reporting." },
      { question: "How do I handle being assigned too many patients?", answer: "If you feel your patient assignment is unsafe, communicate your concerns to your charge nurse using objective data (patient acuity, number of admissions/discharges, skill mix). Document your concern in writing if needed. Your license and patient safety are your responsibility." },
      { question: "Is it normal to cry after a shift?", answer: "Yes, this is very common among new nurses, especially after difficult patient situations, deaths, or particularly stressful shifts. It is a healthy emotional response. If you find yourself persistently unable to cope, overwhelmed, or dreading every shift, reach out to your employee assistance program or a counselor." },
    ],
    internalLinksJson: [
      { url: "/new-grad", anchor: "New Graduate Hub", context: "navigation" },
      { url: "/new-grad/clinical-skills/giving-report-sbar", anchor: "SBAR Communication Guide", context: "related" },
      { url: "/new-grad/clinical-skills/managing-multiple-patients", anchor: "Managing Multiple Patients", context: "related" },
      { url: "/new-grad/clinical-skills/handling-emergencies", anchor: "Handling Emergencies Guide", context: "related" },
      { url: "/question-bank", anchor: "Practice Questions", context: "practice" },
    ],
  },
];

export async function seedLongFormStudyGuides(): Promise<{ inserted: number; skipped: number; errors: string[] }> {
  let inserted = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const guide of LONG_FORM_STUDY_GUIDES) {
    try {
      const existing = await pool.query(
        "SELECT id FROM seo_pages WHERE slug = $1 AND language_code = 'en'",
        [guide.slug]
      );
      if (existing.rows.length > 0) {
        skipped++;
        continue;
      }

      await pool.query(
        `INSERT INTO seo_pages (page_type, exam, title, slug, meta_title, meta_description, content_html, toc_json, faq_json, internal_links_json, is_public, is_indexable, canonical_url, language_code)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, true, $11, 'en')`,
        [
          guide.pageType,
          guide.exam,
          guide.title,
          guide.slug,
          guide.metaTitle,
          guide.metaDescription,
          guide.contentHtml,
          JSON.stringify(guide.tocJson),
          JSON.stringify(guide.faqJson),
          JSON.stringify(guide.internalLinksJson),
          `https://www.nursenest.ca/${guide.slug}`,
        ]
      );
      inserted++;
    } catch (err: any) {
      errors.push(`${guide.slug}: ${err.message}`);
    }
  }

  console.log(`[Long-Form Guides] Inserted: ${inserted}, Skipped: ${skipped}, Errors: ${errors.length}`);
  return { inserted, skipped, errors };
}
