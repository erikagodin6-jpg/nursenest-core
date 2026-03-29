export interface ParamedicSeoPage {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  pageType: string;
  exam: string;
  contentHtml: string;
  tocJson: { id: string; label: string; level: number }[];
  faqJson: { question: string; answer: string }[];
  internalLinksJson: { url: string; anchor: string; context: string }[];
}

export const categoryPages: ParamedicSeoPage[] = [
  {
    slug: "paramedic-airway-management",
    title: "Airway Management for Paramedics",
    metaTitle: "Paramedic Airway Management Study Guide | NurseNest",
    metaDescription: "Master prehospital airway management including BVM ventilation, OPA/NPA insertion, supraglottic airways, and endotracheal intubation for paramedic exam prep.",
    pageType: "category",
    exam: "NREMT",
    contentHtml: `<article><h1>Airway Management for Paramedics</h1>
<p class="lead">Airway management is the single most critical skill in prehospital care. Without a patent airway, no other intervention matters. This category covers everything from basic maneuvers to advanced airway devices, equipping you with the knowledge and decision-making frameworks needed for both the field and your certification exam.</p>
<section id="overview"><h2>Category Overview</h2>
<p>Prehospital airway management spans a continuum from simple positioning to surgical airways. Paramedics must master each level and know when to escalate. The decision to move from basic to advanced airway management depends on the patient's level of consciousness, the ability to maintain oxygenation with basic techniques, and the clinical scenario.</p>
<p>Key competencies include: manual airway maneuvers (head-tilt chin-lift, jaw thrust), suctioning, oropharyngeal and nasopharyngeal airway insertion, bag-valve-mask ventilation, supraglottic airway placement (King LT, i-gel), endotracheal intubation, video laryngoscopy, rapid sequence intubation pharmacology, and surgical cricothyrotomy.</p></section>
<section id="mastery"><h2>What Learners Need to Master</h2>
<p>Successful paramedics approach airway management systematically. You must be able to assess airway patency within seconds, select the appropriate device for the clinical scenario, and execute the technique under pressure. Waveform capnography confirmation is mandatory after any advanced airway placement — this is a non-negotiable standard of care and a frequent exam topic.</p>
<p>Understanding the anatomy of the upper and lower airway, recognizing difficult airway predictors (LEMON assessment), and having a failed airway algorithm are essential. The NREMT and Canadian provincial exams test not just knowledge of devices, but clinical judgment about when to use each one.</p></section>
<section id="topics"><h2>Topic Clusters</h2>
<p>This category includes lessons on: basic airway maneuvers, OPA vs NPA selection, bag-valve-mask technique, oxygen delivery systems, supraglottic airways, endotracheal intubation, RSI pharmacology, waveform capnography, difficult airway management, pediatric airway considerations, and surgical airway access.</p></section>
<section id="exam-themes"><h2>Common Exam Themes</h2>
<p>Expect questions on: indications and contraindications for OPA vs NPA, proper BVM technique with single-rescuer vs two-rescuer approach, ETT confirmation methods (waveform capnography is gold standard), RSI medication sequencing, failed airway management, and pediatric airway sizing formulas.</p>
<div class="exam-trap"><strong>Exam Trap:</strong> NPA is contraindicated in suspected basilar skull fracture — look for Battle's sign, raccoon eyes, or CSF rhinorrhea/otorrhea.</div></section></article>`,
    tocJson: [
      { id: "overview", label: "Category Overview", level: 2 },
      { id: "mastery", label: "What Learners Need to Master", level: 2 },
      { id: "topics", label: "Topic Clusters", level: 2 },
      { id: "exam-themes", label: "Common Exam Themes", level: 2 },
    ],
    faqJson: [
      { question: "What is the most important airway skill for paramedics?", answer: "Bag-valve-mask ventilation is the most critical airway skill. Studies show that BVM ventilation, when performed correctly with proper mask seal and technique, can maintain oxygenation in the vast majority of patients. It is the foundation upon which all other airway management builds." },
      { question: "When should a paramedic intubate vs use a supraglottic airway?", answer: "Supraglottic airways (King LT, i-gel) are first-line for cardiac arrest and when intubation is not feasible. Endotracheal intubation is preferred when aspiration risk is high, prolonged ventilation is needed, or the patient requires precise ventilatory control. Many EMS systems now use supraglottic airways as the primary advanced airway." },
      { question: "How do you confirm correct ETT placement?", answer: "Waveform capnography is the gold standard for ETT confirmation. Additionally: auscultate bilateral breath sounds and epigastrium, observe for chest rise, check tube depth at the teeth (typically 22 cm for adult males, 20 cm for females), and note condensation in the tube. Esophageal detector devices provide secondary confirmation." },
      { question: "What size OPA should I use for an adult?", answer: "Measure from the corner of the mouth to the earlobe (or angle of the jaw). For adults, sizes typically range from 80-100 mm. An incorrectly sized OPA can push the tongue posteriorly and worsen obstruction." },
      { question: "Is NPA safe in patients with facial trauma?", answer: "NPA is contraindicated in suspected basilar skull fracture due to risk of intracranial placement. Signs include Battle's sign, raccoon eyes, CSF rhinorrhea or otorrhea, and hemotympanum. In other facial trauma without these signs, NPA can be used cautiously." },
    ],
    internalLinksJson: [
      { url: "/paramedic/lessons/airway-management-fundamentals", anchor: "Airway Management Fundamentals", context: "paramedic" },
      { url: "/paramedic/lessons/bag-valve-mask-ventilation", anchor: "BVM Ventilation Technique", context: "paramedic" },
      { url: "/paramedic/lessons/opa-vs-npa", anchor: "OPA vs NPA Selection", context: "paramedic" },
    ],
  },
  {
    slug: "paramedic-trauma",
    title: "Trauma Assessment & Management for Paramedics",
    metaTitle: "Paramedic Trauma Assessment Guide | NurseNest",
    metaDescription: "Comprehensive paramedic trauma guide covering primary survey (XABCDE), hemorrhage control, spinal motion restriction, and field triage decisions for NREMT exam prep.",
    pageType: "category",
    exam: "NREMT",
    contentHtml: `<article><h1>Trauma Assessment & Management for Paramedics</h1>
<p class="lead">Trauma is the leading cause of death in people under 45 and represents the highest-acuity calls paramedics respond to. Systematic trauma assessment using XABCDE, rapid hemorrhage control, and timely transport decisions are the pillars of prehospital trauma care.</p>
<section id="overview"><h2>Category Overview</h2>
<p>Prehospital trauma management has evolved significantly with the adoption of military-derived hemorrhage control techniques and evidence-based transport protocols. The modern approach prioritizes controlling life-threatening bleeding before airway management (X before A), permissive hypotension in penetrating trauma, and minimizing scene time for critical patients.</p>
<p>Core topics include: mechanism of injury assessment, XABCDE primary survey, hemorrhage control (tourniquets, wound packing, hemostatic agents), airway management in trauma, tension pneumothorax recognition and needle decompression, pelvic binder application, spinal motion restriction, traumatic brain injury management, and field triage criteria.</p></section>
<section id="mastery"><h2>What Learners Need to Master</h2>
<p>Every trauma assessment must be systematic and time-critical. The primary survey should be completed in under 90 seconds. You must develop the ability to simultaneously assess and treat — controlling hemorrhage while evaluating the airway, for example. Transport decisions (destination, mode) must be made rapidly using validated triage criteria.</p></section>
<section id="exam-themes"><h2>Common Exam Themes</h2>
<p>NREMT and provincial exams heavily test: XABCDE sequence and priority setting, tourniquet indications and application, tension pneumothorax recognition (JVD + absent breath sounds + tracheal deviation + hypotension), GCS calculation and significance, permissive hypotension targets, TXA administration criteria, and trauma center triage guidelines.</p></section></article>`,
    tocJson: [
      { id: "overview", label: "Category Overview", level: 2 },
      { id: "mastery", label: "What Learners Need to Master", level: 2 },
      { id: "exam-themes", label: "Common Exam Themes", level: 2 },
    ],
    faqJson: [
      { question: "What is XABCDE in trauma assessment?", answer: "XABCDE stands for: X = eXsanguinating hemorrhage control, A = Airway with C-spine protection, B = Breathing and ventilation, C = Circulation with hemorrhage control, D = Disability (neurological status), E = Exposure and environmental control. The X was added to reflect that massive hemorrhage kills faster than airway compromise." },
      { question: "When should a tourniquet be applied?", answer: "Apply a tourniquet for life-threatening extremity hemorrhage that cannot be controlled with direct pressure. Apply high and tight on the extremity, proximal to the wound. Tighten until bleeding stops. Note the time of application. Do not remove in the field once applied." },
      { question: "What is permissive hypotension?", answer: "Permissive hypotension targets a systolic blood pressure of 80-90 mmHg in penetrating trauma patients with hemorrhagic shock. This maintains minimum organ perfusion while avoiding aggressive fluid resuscitation that can disrupt clot formation. It is NOT used in traumatic brain injury." },
      { question: "How long should scene time be for critical trauma?", answer: "The platinum 10 minutes — critical trauma patients should have scene time of 10 minutes or less. Perform only life-saving interventions on scene (hemorrhage control, airway, needle decompression) and treat everything else en route to the trauma center." },
      { question: "What are the indications for TXA in trauma?", answer: "Tranexamic acid (TXA) 1g IV over 10 minutes is indicated for hemorrhagic shock when given within 3 hours of injury. The CRASH-2 trial showed mortality reduction. After 3 hours, TXA may increase mortality and is not recommended." },
    ],
    internalLinksJson: [
      { url: "/paramedic/lessons/trauma-primary-survey", anchor: "Trauma Primary Survey", context: "paramedic" },
      { url: "/paramedic/lessons/rapid-trauma-assessment", anchor: "Rapid Trauma Assessment", context: "paramedic" },
      { url: "/paramedic/lessons/spinal-motion-restriction", anchor: "Spinal Motion Restriction", context: "paramedic" },
    ],
  },
  {
    slug: "paramedic-cardiology",
    title: "Cardiology & ACLS for Paramedics",
    metaTitle: "Paramedic Cardiology & ACLS Study Guide | NurseNest",
    metaDescription: "Master cardiac arrest management, ECG interpretation, ACLS algorithms, and prehospital cardiac pharmacology for paramedic certification exam preparation.",
    pageType: "category",
    exam: "NREMT",
    contentHtml: `<article><h1>Cardiology & ACLS for Paramedics</h1>
<p class="lead">Cardiac emergencies are among the most time-critical calls in EMS. Paramedics must recognize lethal rhythms, execute ACLS algorithms, interpret 12-lead ECGs, and make rapid treatment decisions that directly impact survival.</p>
<section id="overview"><h2>Category Overview</h2>
<p>This category covers the full spectrum of prehospital cardiac care: ECG rhythm recognition (sinus rhythms, atrial dysrhythmias, junctional rhythms, ventricular dysrhythmias, heart blocks), 12-lead ECG acquisition and STEMI recognition, cardiac arrest management (VF/pVT, PEA, asystole), post-ROSC care, acute coronary syndrome assessment, and cardiogenic shock management.</p>
<p>ACLS pharmacology is a core competency: epinephrine, amiodarone, lidocaine, adenosine, atropine, calcium chloride, and vasopressor infusions must be known cold — indications, doses, routes, contraindications, and side effects.</p></section>
<section id="mastery"><h2>What Learners Need to Master</h2>
<p>You must be able to identify any cardiac rhythm within seconds and initiate the correct algorithm. High-quality CPR with minimal interruptions is the single most important intervention in cardiac arrest. Understand the difference between shockable (VF/pVT) and non-shockable (PEA/asystole) rhythms. Master 12-lead interpretation for STEMI recognition — time to reperfusion directly correlates with myocardial salvage.</p></section>
<section id="exam-themes"><h2>Common Exam Themes</h2>
<p>Exams test: rhythm identification, ACLS drug dosing and timing, shockable vs non-shockable algorithm steps, adenosine administration technique, synchronized cardioversion vs defibrillation indications, STEMI recognition criteria, and reversible causes of cardiac arrest (Hs and Ts).</p></section></article>`,
    tocJson: [
      { id: "overview", label: "Category Overview", level: 2 },
      { id: "mastery", label: "What Learners Need to Master", level: 2 },
      { id: "exam-themes", label: "Common Exam Themes", level: 2 },
    ],
    faqJson: [
      { question: "What are the shockable cardiac arrest rhythms?", answer: "Ventricular fibrillation (VF) and pulseless ventricular tachycardia (pVT) are shockable. Asystole and pulseless electrical activity (PEA) are non-shockable — treat with CPR and epinephrine. Rhythm check every 2 minutes." },
      { question: "What is the correct epinephrine dose in cardiac arrest?", answer: "Epinephrine 1 mg IV/IO every 3-5 minutes for all cardiac arrest rhythms. For shockable rhythms, give after the second shock. For non-shockable rhythms, give as soon as IV/IO access is established." },
      { question: "How do you differentiate SVT from VT on ECG?", answer: "SVT typically has narrow QRS complexes (<0.12 sec), regular rate 150-250 bpm. VT has wide QRS complexes (>0.12 sec), rate 100-250 bpm. When in doubt, treat wide-complex tachycardia as VT — it is safer." },
      { question: "What are the Hs and Ts of reversible cardiac arrest?", answer: "Hs: Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia. Ts: Tension pneumothorax, Tamponade (cardiac), Toxins, Thrombosis (pulmonary or coronary). Identifying and treating these improves ROSC rates." },
      { question: "When do you use synchronized cardioversion vs defibrillation?", answer: "Synchronized cardioversion is for unstable tachycardia WITH a pulse (SVT, atrial flutter, stable VT). Defibrillation is for pulseless VF/VT. Synchronization delivers the shock at the R wave to avoid triggering VF." },
    ],
    internalLinksJson: [
      { url: "/paramedic/lessons/cardiac-arrest-recognition", anchor: "Cardiac Arrest Recognition", context: "paramedic" },
      { url: "/paramedic/lessons/chest-pain-assessment", anchor: "Chest Pain Assessment", context: "paramedic" },
      { url: "/paramedic/lessons/prehospital-ecg-basics", anchor: "Prehospital ECG Basics", context: "paramedic" },
    ],
  },
  {
    slug: "paramedic-pharmacology",
    title: "Pharmacology for Paramedics",
    metaTitle: "Paramedic Pharmacology Study Guide | NurseNest",
    metaDescription: "Master prehospital pharmacology including ACLS drugs, RSI medications, analgesics, and emergency drug calculations for paramedic exam preparation.",
    pageType: "category",
    exam: "NREMT",
    contentHtml: `<article><h1>Pharmacology for Paramedics</h1>
<p class="lead">Prehospital pharmacology demands rapid, accurate drug selection, dose calculation, and administration under the most challenging conditions. Paramedics carry and administer over 40 medications spanning cardiac, respiratory, neurological, and toxicological emergencies.</p>
<section id="overview"><h2>Category Overview</h2>
<p>This category covers drug classifications, mechanisms of action, indications, contraindications, doses, routes, and side effects for all medications in the paramedic scope of practice. Key drug groups include: sympathomimetics, parasympatholytics, antiarrhythmics, analgesics, sedatives, neuromuscular blockers, bronchodilators, vasopressors, antihypertensives, antiepileptics, and toxicology antidotes.</p></section>
<section id="mastery"><h2>What Learners Need to Master</h2>
<p>You must know every drug by generic name, classification, mechanism of action, indication, dose, route, onset, peak, duration, contraindications, and key side effects. Weight-based dosing calculations must be accurate under pressure. Understanding drug interactions and the pharmacological basis for contraindications is essential for clinical decision-making.</p></section>
<section id="exam-themes"><h2>Common Exam Themes</h2>
<p>Exams test: ACLS drug protocols (epinephrine, amiodarone, adenosine, atropine), RSI drug sequencing, analgesic selection, pediatric weight-based calculations, medication errors and safety, route selection (IV vs IO vs IM vs IN), and toxicology antidotes (naloxone, flumazenil, calcium chloride, sodium bicarbonate).</p></section></article>`,
    tocJson: [
      { id: "overview", label: "Category Overview", level: 2 },
      { id: "mastery", label: "What Learners Need to Master", level: 2 },
      { id: "exam-themes", label: "Common Exam Themes", level: 2 },
    ],
    faqJson: [
      { question: "What are the most important drugs for paramedics to know?", answer: "The essential drugs include: epinephrine (cardiac arrest, anaphylaxis), amiodarone (refractory VF/VT), adenosine (SVT), atropine (bradycardia), midazolam (seizures), fentanyl/morphine (pain), ketamine (analgesia/RSI), albuterol (bronchospasm), nitroglycerin (chest pain), naloxone (opioid overdose), dextrose (hypoglycemia), and diphenhydramine (allergic reactions)." },
      { question: "How do you calculate pediatric drug doses?", answer: "Most pediatric drugs are weight-based (mg/kg). Use the Broselow tape for estimated weight if actual weight is unavailable. Always double-check calculations. Common formula: Dose (mg) = Weight (kg) × mg/kg dose. For drip rates: mcg/min = (desired dose in mcg/kg/min × weight in kg)." },
      { question: "What is the difference between IO and IV access?", answer: "IV (intravenous) is the standard route. IO (intraosseous) is used when IV access cannot be established within 2 attempts or 90 seconds in critical patients. IO provides rapid vascular access through the bone marrow. Common sites: proximal tibia, humeral head. All IV medications can be given IO." },
      { question: "What is rapid sequence intubation (RSI)?", answer: "RSI involves administering a sedative (ketamine 1-2 mg/kg or etomidate 0.3 mg/kg) followed immediately by a neuromuscular blocker (succinylcholine 1-2 mg/kg or rocuronium 1 mg/kg) to facilitate endotracheal intubation. Preoxygenation for 3-5 minutes is essential before induction." },
    ],
    internalLinksJson: [
      { url: "/paramedic/lessons/paramedic-pharmacology-basics", anchor: "Pharmacology Basics", context: "paramedic" },
    ],
  },
  {
    slug: "paramedic-respiratory-emergencies",
    title: "Respiratory Emergencies for Paramedics",
    metaTitle: "Paramedic Respiratory Emergencies Guide | NurseNest",
    metaDescription: "Master prehospital respiratory emergency assessment and management including asthma, COPD, pneumothorax, and pulmonary edema for paramedic certification.",
    pageType: "category",
    exam: "NREMT",
    contentHtml: `<article><h1>Respiratory Emergencies for Paramedics</h1>
<p class="lead">Respiratory distress and failure are among the most common reasons for EMS activation. Paramedics must rapidly differentiate between causes of dyspnea and initiate targeted treatment while maintaining oxygenation and ventilation.</p>
<section id="overview"><h2>Category Overview</h2>
<p>This category covers assessment and management of: asthma and status asthmaticus, COPD exacerbation, pneumonia, pulmonary edema, tension pneumothorax, pulmonary embolism, anaphylaxis-related bronchospasm, croup, epiglottitis, foreign body airway obstruction, and near-drowning. Key assessment tools include pulse oximetry, waveform capnography, lung auscultation, and work of breathing evaluation.</p></section>
<section id="mastery"><h2>What Learners Need to Master</h2>
<p>Differentiate upper vs lower airway obstruction by sound (stridor vs wheezing). Recognize the progression from respiratory distress to respiratory failure to respiratory arrest. Understand CPAP indications (acute pulmonary edema, COPD exacerbation), nebulizer medication administration, and when basic interventions fail requiring advanced airway management.</p></section>
<section id="exam-themes"><h2>Common Exam Themes</h2>
<p>Expect questions on: oxygen delivery device selection, CPAP indications and contraindications, albuterol and ipratropium dosing, capnography waveform interpretation, tension pneumothorax treatment, distinguishing cardiac vs pulmonary causes of dyspnea, and pediatric respiratory distress recognition.</p></section></article>`,
    tocJson: [
      { id: "overview", label: "Category Overview", level: 2 },
      { id: "mastery", label: "What Learners Need to Master", level: 2 },
      { id: "exam-themes", label: "Common Exam Themes", level: 2 },
    ],
    faqJson: [
      { question: "When should CPAP be used in the prehospital setting?", answer: "CPAP is indicated for acute pulmonary edema (CHF exacerbation) and COPD exacerbation with adequate respiratory drive. Contraindications include: GCS < 10, inability to maintain airway, systolic BP < 90 mmHg, active vomiting, pneumothorax, and facial trauma preventing mask seal." },
      { question: "How do you differentiate asthma from COPD in the field?", answer: "Asthma typically presents in younger patients with acute-onset wheezing, triggered by allergens or exercise. COPD presents in older patients (>40) with a smoking history, chronic dyspnea with acute worsening, and may have both wheezing and diminished breath sounds. Treatment overlap: both get bronchodilators." },
      { question: "What are the signs of impending respiratory failure?", answer: "Altered mental status, inability to speak in full sentences, tripod positioning, accessory muscle use, paradoxical breathing, SpO2 < 90% on supplemental O2, rising ETCO2 > 50 mmHg, bradycardia (in children — a late ominous sign), and silent chest (in severe asthma)." },
      { question: "What is the correct albuterol dose for adults?", answer: "Albuterol 2.5 mg via nebulizer every 15-20 minutes for up to 3 doses, or continuous nebulization for severe bronchospasm. MDI: 4-8 puffs via spacer. Often combined with ipratropium bromide 0.5 mg for the first treatment." },
    ],
    internalLinksJson: [
      { url: "/paramedic/lessons/oxygen-delivery-devices", anchor: "Oxygen Delivery Devices", context: "paramedic" },
      { url: "/paramedic/lessons/pediatric-respiratory-distress", anchor: "Pediatric Respiratory Distress", context: "paramedic" },
    ],
  },
  {
    slug: "paramedic-medical-emergencies",
    title: "Medical Emergencies for Paramedics",
    metaTitle: "Paramedic Medical Emergencies Study Guide | NurseNest",
    metaDescription: "Comprehensive guide to prehospital medical emergencies including diabetic emergencies, anaphylaxis, seizures, and toxicological emergencies for paramedic exam prep.",
    pageType: "category",
    exam: "NREMT",
    contentHtml: `<article><h1>Medical Emergencies for Paramedics</h1>
<p class="lead">Medical emergencies encompass a vast range of conditions from diabetic crises to toxicological emergencies. Paramedics must rapidly assess, differentiate, and treat these patients using systematic assessment frameworks and evidence-based protocols.</p>
<section id="overview"><h2>Category Overview</h2>
<p>This category covers: diabetic emergencies (hypoglycemia, DKA, HHS), anaphylaxis, seizures and status epilepticus, stroke recognition and management, sepsis, toxicological emergencies (opioid overdose, organophosphate poisoning, carbon monoxide), environmental emergencies (hypothermia, heat stroke, drowning), abdominal emergencies, and altered mental status assessment.</p></section>
<section id="mastery"><h2>What Learners Need to Master</h2>
<p>The medical patient requires a thorough history and focused physical exam. Master the OPQRST and SAMPLE history frameworks. Develop a systematic approach to altered mental status using the mnemonic AEIOU-TIPS (Alcohol, Epilepsy, Insulin, Overdose, Uremia, Trauma, Infection, Psychiatric, Stroke). Point-of-care glucose measurement should be performed on every patient with altered mental status.</p></section>
<section id="exam-themes"><h2>Common Exam Themes</h2>
<p>Exams frequently test: blood glucose management, naloxone dosing and indications, epinephrine for anaphylaxis, stroke assessment scales (Cincinnati, LAMS), seizure management with benzodiazepines, and organophosphate poisoning treatment (atropine + pralidoxime).</p></section></article>`,
    tocJson: [
      { id: "overview", label: "Category Overview", level: 2 },
      { id: "mastery", label: "What Learners Need to Master", level: 2 },
      { id: "exam-themes", label: "Common Exam Themes", level: 2 },
    ],
    faqJson: [
      { question: "What is the most common cause of altered mental status that paramedics should check first?", answer: "Hypoglycemia. A point-of-care blood glucose should be obtained on every patient with altered mental status. Hypoglycemia is rapidly reversible with dextrose (D10W preferred, 25g IV) or glucagon (1mg IM). Failure to check glucose can result in missed diagnosis and poor outcomes." },
      { question: "How do you differentiate DKA from HHS?", answer: "DKA: Type 1 diabetes, blood glucose 300-800 mg/dL, Kussmaul respirations, fruity breath odor, acute onset over hours. HHS: Type 2 diabetes, blood glucose often >600 mg/dL, no Kussmaul breathing, no fruity odor, gradual onset over days, more severe dehydration and altered mental status." },
      { question: "What is the correct naloxone dose for opioid overdose?", answer: "Start with 0.4-2 mg IV/IO/IM/IN. For suspected opioid-dependent patients, start with smaller doses (0.04-0.1 mg) titrated to respiratory effort to avoid precipitating severe withdrawal. Intranasal: 4 mg via mucosal atomization device. May repeat every 2-3 minutes." },
      { question: "What are the signs of anaphylaxis vs a simple allergic reaction?", answer: "Anaphylaxis involves multiple organ systems: respiratory (stridor, wheezing, dyspnea), cardiovascular (hypotension, tachycardia), skin (urticaria, flushing, angioedema), and GI (nausea, vomiting). A simple allergic reaction is usually limited to skin findings (hives, itching) without systemic involvement." },
    ],
    internalLinksJson: [
      { url: "/paramedic/lessons/anaphylaxis-management", anchor: "Anaphylaxis Management", context: "paramedic" },
      { url: "/paramedic/lessons/diabetic-emergencies", anchor: "Diabetic Emergencies", context: "paramedic" },
      { url: "/paramedic/lessons/seizure-assessment", anchor: "Seizure Assessment", context: "paramedic" },
    ],
  },
  {
    slug: "paramedic-neurology",
    title: "Neurology for Paramedics",
    metaTitle: "Paramedic Neurology Study Guide | NurseNest",
    metaDescription: "Master prehospital neurological assessment including stroke recognition, seizure management, GCS scoring, and TBI management for paramedic certification exams.",
    pageType: "category",
    exam: "NREMT",
    contentHtml: `<article><h1>Neurology for Paramedics</h1>
<p class="lead">Neurological emergencies require rapid recognition and time-sensitive interventions. From stroke to seizures to traumatic brain injury, the paramedic's assessment and treatment decisions in the first minutes directly impact neurological outcomes.</p>
<section id="overview"><h2>Category Overview</h2>
<p>This category covers: stroke recognition and prehospital stroke scales, seizure types and management, traumatic brain injury assessment and neuroprotection, altered mental status evaluation, meningitis recognition, headache assessment, and Glasgow Coma Scale application. Special focus on time-critical stroke pathways and the importance of last known well time documentation.</p></section>
<section id="mastery"><h2>What Learners Need to Master</h2>
<p>Master the Cincinnati Prehospital Stroke Scale (facial droop, arm drift, speech abnormality) and understand large vessel occlusion screening tools (LAMS, RACE). Know the critical importance of documenting last known well time for thrombolytic eligibility. GCS scoring must be accurate and reproducible. Understand neuroprotective strategies for TBI patients: maintain SBP > 90 mmHg, SpO2 > 94%, avoid hyperventilation unless herniation signs present.</p></section>
<section id="exam-themes"><h2>Common Exam Themes</h2>
<p>Expect questions on: stroke scale application, GCS component scoring, seizure management with midazolam, TBI management priorities, differentiation of stroke mimics (hypoglycemia, Todd's paralysis), and time windows for stroke intervention.</p></section></article>`,
    tocJson: [
      { id: "overview", label: "Category Overview", level: 2 },
      { id: "mastery", label: "What Learners Need to Master", level: 2 },
      { id: "exam-themes", label: "Common Exam Themes", level: 2 },
    ],
    faqJson: [
      { question: "What is the most important thing a paramedic can do for a stroke patient?", answer: "Document the last known well time accurately. This determines eligibility for thrombolytic therapy (tPA within 4.5 hours) and mechanical thrombectomy (up to 24 hours for select patients). Rapid transport to a designated stroke center is the second priority." },
      { question: "How is GCS scored?", answer: "GCS has three components: Eye Opening (1-4), Verbal Response (1-5), Motor Response (1-6). Total range 3-15. GCS 13-15 = mild injury, 9-12 = moderate, 3-8 = severe (intubation indicated). Best motor response is the most prognostically significant component." },
      { question: "What is the first-line treatment for active seizures?", answer: "Benzodiazepines: midazolam 10 mg IM (or 5 mg IV) or diazepam 5-10 mg IV. Midazolam IM is preferred when IV access is not established because onset is rapid via IM route. Protect the patient from injury, position laterally if possible, and suction as needed." },
      { question: "How do you manage a TBI patient in the field?", answer: "Maintain SBP > 90 mmHg (a single episode of hypotension doubles mortality in TBI), SpO2 > 94%, ETCO2 35-45 mmHg. Avoid hyperventilation unless signs of herniation (unilateral pupil dilation, posturing). Elevate head of stretcher 30 degrees if spinal clearance allows." },
    ],
    internalLinksJson: [
      { url: "/paramedic/lessons/stroke-recognition", anchor: "Stroke Recognition", context: "paramedic" },
      { url: "/paramedic/lessons/seizure-assessment", anchor: "Seizure Assessment", context: "paramedic" },
      { url: "/paramedic/lessons/glasgow-coma-scale", anchor: "Glasgow Coma Scale", context: "paramedic" },
    ],
  },
  {
    slug: "paramedic-pediatrics",
    title: "Pediatric Emergencies for Paramedics",
    metaTitle: "Paramedic Pediatric Emergencies Guide | NurseNest",
    metaDescription: "Master pediatric assessment, airway management, and emergency treatment for paramedics. Covers PALS algorithms, pediatric vital signs, and weight-based dosing.",
    pageType: "category",
    exam: "NREMT",
    contentHtml: `<article><h1>Pediatric Emergencies for Paramedics</h1>
<p class="lead">Pediatric patients are not small adults. They have unique anatomical, physiological, and psychological characteristics that demand modified assessment and treatment approaches. Paramedics must be comfortable with age-specific vital sign ranges, equipment sizing, and weight-based drug dosing.</p>
<section id="overview"><h2>Category Overview</h2>
<p>This category covers: pediatric assessment triangle (PAT), age-specific vital signs, pediatric airway management (anatomical differences), respiratory emergencies (croup, bronchiolitis, asthma, foreign body), pediatric cardiac arrest and PALS algorithms, pediatric trauma considerations, child abuse recognition, neonatal resuscitation basics, and pediatric medication calculations using Broselow tape.</p></section>
<section id="mastery"><h2>What Learners Need to Master</h2>
<p>The Pediatric Assessment Triangle (appearance, work of breathing, circulation to skin) provides a rapid across-the-room assessment. Know normal vital sign ranges by age. Understand that bradycardia in children is usually caused by hypoxia — treat the cause. Pediatric equipment sizing: ETT size = (age/4) + 4 for uncuffed. Weight estimation: (age in years × 2) + 8 kg.</p></section>
<section id="exam-themes"><h2>Common Exam Themes</h2>
<p>Exams test: pediatric assessment triangle application, age-appropriate vital signs, weight-based epinephrine dosing (0.01 mg/kg), pediatric airway differences, febrile seizure management, croup vs epiglottitis differentiation, and newborn resuscitation steps.</p></section></article>`,
    tocJson: [
      { id: "overview", label: "Category Overview", level: 2 },
      { id: "mastery", label: "What Learners Need to Master", level: 2 },
      { id: "exam-themes", label: "Common Exam Themes", level: 2 },
    ],
    faqJson: [
      { question: "What is the Pediatric Assessment Triangle?", answer: "The PAT evaluates three components from across the room: Appearance (tone, interactivity, consolability, gaze, speech/cry), Work of Breathing (abnormal sounds, positioning, retractions, nasal flaring), and Circulation to Skin (pallor, mottling, cyanosis). It takes 30 seconds and categorizes the child's acuity." },
      { question: "What is the most common cause of cardiac arrest in children?", answer: "Respiratory failure. Unlike adults where cardiac arrest is usually primarily cardiac, pediatric arrest almost always results from progressive respiratory failure or shock. This is why maintaining oxygenation and ventilation is the highest priority in pediatric emergencies." },
      { question: "How do you calculate pediatric drug doses in the field?", answer: "Use the Broselow tape to estimate weight based on length. Then calculate: Dose (mg) = Weight (kg) × mg/kg dose. For epinephrine in cardiac arrest: 0.01 mg/kg of 1:10,000 (0.1 mL/kg). Always double-check calculations and use precalculated dose reference charts." },
      { question: "What are the key anatomical differences in pediatric airways?", answer: "Larger tongue relative to mouth, higher and more anterior larynx, omega-shaped epiglottis, narrowest point at cricoid ring (vs glottic opening in adults), shorter trachea (risk of right mainstem intubation), and obligate nose breathers in infants. These differences affect airway management technique and equipment selection." },
    ],
    internalLinksJson: [
      { url: "/paramedic/lessons/pediatric-respiratory-distress", anchor: "Pediatric Respiratory Distress", context: "paramedic" },
    ],
  },
  {
    slug: "paramedic-obstetrics",
    title: "Obstetric Emergencies for Paramedics",
    metaTitle: "Paramedic OB Emergencies Study Guide | NurseNest",
    metaDescription: "Master prehospital obstetric emergencies including normal delivery, breech presentation, cord prolapse, eclampsia, and postpartum hemorrhage for paramedic exams.",
    pageType: "category",
    exam: "NREMT",
    contentHtml: `<article><h1>Obstetric Emergencies for Paramedics</h1>
<p class="lead">Prehospital obstetric emergencies involve two patients simultaneously — the mother and the fetus. Paramedics must be prepared to manage normal and abnormal deliveries, maternal medical emergencies, and neonatal resuscitation in the field.</p>
<section id="overview"><h2>Category Overview</h2>
<p>This category covers: normal labor and delivery stages, abnormal presentations (breech, shoulder dystocia, cord prolapse), maternal emergencies (eclampsia, placenta previa, placental abruption, postpartum hemorrhage, ectopic pregnancy), physiological changes of pregnancy affecting assessment, and neonatal assessment and resuscitation. Supine hypotension syndrome and left lateral positioning are essential concepts.</p></section>
<section id="mastery"><h2>What Learners Need to Master</h2>
<p>Know the stages of labor. Recognize when delivery is imminent (crowning, contractions < 2 minutes apart, urge to push). Understand normal delivery technique and immediate newborn care. Recognize life-threatening complications: nuchal cord management, meconium-stained amniotic fluid, postpartum hemorrhage (fundal massage, oxytocin), and eclamptic seizures (magnesium sulfate).</p></section>
<section id="exam-themes"><h2>Common Exam Themes</h2>
<p>Exams test: stages of labor, breech delivery management, cord prolapse positioning (knee-chest), eclampsia treatment with magnesium sulfate, postpartum hemorrhage interventions, APGAR scoring, and newborn resuscitation algorithm.</p></section></article>`,
    tocJson: [
      { id: "overview", label: "Category Overview", level: 2 },
      { id: "mastery", label: "What Learners Need to Master", level: 2 },
      { id: "exam-themes", label: "Common Exam Themes", level: 2 },
    ],
    faqJson: [
      { question: "What is the first action for a prolapsed umbilical cord?", answer: "Position the mother in knee-chest position (or Trendelenburg with hips elevated). Insert a gloved hand into the vagina and gently push the presenting part off the cord. Do NOT attempt to push the cord back in. Cover the exposed cord with saline-moistened dressing. Rapid transport for emergency cesarean section." },
      { question: "How do you manage eclamptic seizures in the field?", answer: "Magnesium sulfate 4-6 g IV over 15-20 minutes is the first-line treatment. Protect the airway, position laterally, administer high-flow oxygen, and transport emergently. If magnesium is unavailable, benzodiazepines (midazolam, diazepam) can be used as an alternative." },
      { question: "When should you NOT transport a pregnant patient and deliver on scene?", answer: "Deliver on scene when: crowning is visible, delivery is imminent (< 5 minutes), contractions are < 2 minutes apart with urge to push, and transport time exceeds time to delivery. Always prepare for delivery during transport if possible, but do not delay transport for complicated presentations." },
      { question: "What is a normal APGAR score?", answer: "APGAR is assessed at 1 and 5 minutes after birth. Scores range 0-10: Appearance (color), Pulse, Grimace (reflex), Activity (muscle tone), Respiration. Score 7-10 is normal, 4-6 needs stimulation and possible intervention, 0-3 requires immediate resuscitation." },
    ],
    internalLinksJson: [],
  },
  {
    slug: "paramedic-ems-operations",
    title: "EMS Operations for Paramedics",
    metaTitle: "EMS Operations Study Guide | NurseNest",
    metaDescription: "Master EMS operations including scene safety, MCI triage, incident command, ambulance operations, hazmat awareness, and communication for paramedic certification.",
    pageType: "category",
    exam: "NREMT",
    contentHtml: `<article><h1>EMS Operations for Paramedics</h1>
<p class="lead">EMS operations encompass everything beyond direct patient care: scene safety, triage, incident command, vehicle operations, communication, documentation, and the legal and ethical framework of prehospital care. These competencies are essential for safe and effective paramedic practice.</p>
<section id="overview"><h2>Category Overview</h2>
<p>This category covers: scene safety and hazard assessment, mass casualty incident (MCI) triage using START and JumpSTART, incident command system (ICS/NIMS), ambulance operations and driving safety, hazardous materials awareness, landing zone operations, communication and documentation, legal considerations (consent, refusal, advance directives, mandatory reporting), medical ethics, and crew resource management.</p></section>
<section id="mastery"><h2>What Learners Need to Master</h2>
<p>Scene safety is always the first priority — you cannot help anyone if you become a patient. Know the START triage algorithm cold: RPM (Respirations, Perfusion, Mental status) for rapidly categorizing patients as Immediate (red), Delayed (yellow), Minor (green), or Deceased (black). Understand ICS structure and your role within it. Know legal requirements for consent, implied consent, refusal documentation, and mandatory reporting.</p></section>
<section id="exam-themes"><h2>Common Exam Themes</h2>
<p>Exams test: START triage algorithm application, ICS roles (IC, triage, treatment, transport), scene safety priorities, consent types, refusal documentation requirements, HIPAA basics, mandatory reporting situations, and crew resource management principles.</p></section></article>`,
    tocJson: [
      { id: "overview", label: "Category Overview", level: 2 },
      { id: "mastery", label: "What Learners Need to Master", level: 2 },
      { id: "exam-themes", label: "Common Exam Themes", level: 2 },
    ],
    faqJson: [
      { question: "How does START triage work?", answer: "START (Simple Triage and Rapid Treatment) uses RPM: First, can they walk? If yes → Minor (green). If not, assess: Respirations (>30 or absent after repositioning = Immediate/red), Perfusion (cap refill > 2 sec or no radial pulse = Immediate/red), Mental status (cannot follow commands = Immediate/red). Otherwise → Delayed (yellow). No respirations after airway opening → Deceased (black)." },
      { question: "What is implied consent?", answer: "Implied consent allows paramedics to treat patients who are unable to provide expressed consent due to altered mental status, unconsciousness, or being a minor without a parent present. It assumes that a reasonable person would want life-saving treatment. It applies to emergency situations where the patient cannot make informed decisions." },
      { question: "What are mandatory reporting requirements for paramedics?", answer: "Paramedics must report: suspected child abuse or neglect, suspected elder abuse, certain communicable diseases, gunshot wounds, stab wounds (jurisdiction-dependent), animal bites, and suspected human trafficking. Requirements vary by state/province. Failure to report can result in legal consequences." },
      { question: "What is the role of the Incident Commander at an MCI?", answer: "The Incident Commander (IC) has overall authority for the incident. Responsibilities include: establishing command, determining objectives, managing resources, ensuring safety, coordinating with other agencies, and transferring command when a higher authority arrives. The IC does not perform patient care — they manage the scene." },
    ],
    internalLinksJson: [
      { url: "/paramedic/lessons/scene-safety", anchor: "Scene Safety", context: "paramedic" },
    ],
  },
];

export const topicPages: ParamedicSeoPage[] = [
  {
    slug: "paramedic-airway-management-fundamentals",
    title: "Airway Management Fundamentals for Paramedics",
    metaTitle: "Airway Management Fundamentals | Paramedic Study Guide | NurseNest",
    metaDescription: "Learn prehospital airway management fundamentals including assessment, manual maneuvers, adjuncts, and the airway management escalation algorithm for paramedic certification.",
    pageType: "topic",
    exam: "NREMT",
    contentHtml: `<article><h1>Airway Management Fundamentals for Paramedics</h1>
<p class="lead">Every prehospital emergency begins with the airway. A systematic approach to airway assessment and management — from basic maneuvers to advanced interventions — is the foundation of paramedic practice. This lesson covers the complete airway management continuum.</p>
<section id="assessment"><h2>Airway Assessment</h2>
<p>Airway assessment begins with look, listen, and feel. Look for chest rise, accessory muscle use, cyanosis, and foreign bodies. Listen for stridor (upper airway obstruction), gurgling (fluid), snoring (tongue obstruction), and absent sounds. Feel for air movement at the nose and mouth.</p>
<p>The LEMON assessment predicts difficult intubation: Look externally (facial trauma, obesity, short neck), Evaluate 3-3-2 rule (3 finger mouth opening, 3 finger hyomental distance, 2 finger thyromental distance), Mallampati score (visualization of oropharynx), Obstruction (blood, vomitus, edema), Neck mobility (C-spine immobilization limits extension).</p></section>
<section id="manual"><h2>Manual Airway Maneuvers</h2>
<p>Head-tilt chin-lift is the standard technique for opening the airway in patients without suspected cervical spine injury. Place one hand on the forehead and tilt posteriorly while lifting the chin with the fingertips of the other hand. This lifts the tongue off the posterior pharynx.</p>
<p>Jaw thrust without head extension is used when C-spine injury is suspected. Place fingers behind the angles of the mandible bilaterally and displace the jaw anteriorly. This opens the airway without extending the neck. It can be performed with one or two rescuers.</p></section>
<section id="suctioning"><h2>Suctioning</h2>
<p>Suction immediately if blood, vomitus, or secretions are present. Use rigid (Yankauer) suction for the oropharynx — insert along the cheek and activate on withdrawal. Suction for no more than 10 seconds in adults, 5 seconds in pediatric patients to avoid hypoxia. Preoxygenate before suctioning if possible. Flexible suction catheters are used for endotracheal tube suctioning — insert to the length of the ETT without applying suction, then apply suction on withdrawal.</p></section>
<section id="adjuncts"><h2>Airway Adjuncts</h2>
<p>Oropharyngeal airway (OPA): Indicated for unconscious patients without a gag reflex. Measure from the corner of the mouth to the earlobe. Insert with the tip pointing toward the palate, then rotate 180 degrees as it passes over the tongue (adult technique). In pediatric patients, insert with the tip pointing toward the tongue using a tongue depressor — do NOT rotate.</p>
<p>Nasopharyngeal airway (NPA): Indicated for semiconscious patients or when OPA triggers gagging. Measure from the nostril to the earlobe. Lubricate and insert with the bevel toward the septum along the floor of the nasal passage. Contraindicated in suspected basilar skull fracture.</p></section>
<section id="bvm"><h2>Bag-Valve-Mask Ventilation</h2>
<p>BVM ventilation is the most critical airway skill. Connect to high-flow oxygen (15 L/min) with a reservoir. Create an airtight seal using the C-E clamp technique — C shape with thumb and index finger on the mask, E shape with remaining fingers lifting the jaw. Squeeze the bag over 1 second to deliver 500-600 mL (visible chest rise). Two-rescuer BVM is significantly more effective than single-rescuer. Ventilate at 10-12 breaths per minute for adults, 12-20 for pediatric patients.</p></section>
<section id="advanced"><h2>Advanced Airway Overview</h2>
<p>When BVM ventilation is inadequate or the patient requires definitive airway protection, advanced airway placement is indicated. Options include supraglottic airways (King LT, i-gel, LMA) and endotracheal intubation. Supraglottic airways are increasingly used as first-line in cardiac arrest due to ease of placement and comparable outcomes. All advanced airway placements must be confirmed with waveform capnography — this is the gold standard and a non-negotiable requirement.</p></section>
<section id="pearls"><h2>Exam Pearls</h2>
<div class="exam-trap"><strong>Exam Trap:</strong> The most common cause of BVM ventilation failure is inadequate mask seal, not inadequate ventilation volume. Focus on mask seal technique before increasing bag squeeze force.</div>
<div class="exam-trap"><strong>Exam Trap:</strong> Hyperventilation during cardiac arrest is harmful — it increases intrathoracic pressure, decreases venous return, and reduces coronary and cerebral perfusion. Maintain rate of 10 breaths per minute.</div></section></article>`,
    tocJson: [
      { id: "assessment", label: "Airway Assessment", level: 2 },
      { id: "manual", label: "Manual Airway Maneuvers", level: 2 },
      { id: "suctioning", label: "Suctioning", level: 2 },
      { id: "adjuncts", label: "Airway Adjuncts", level: 2 },
      { id: "bvm", label: "Bag-Valve-Mask Ventilation", level: 2 },
      { id: "advanced", label: "Advanced Airway Overview", level: 2 },
      { id: "pearls", label: "Exam Pearls", level: 2 },
    ],
    faqJson: [
      { question: "What is the most important airway management skill?", answer: "BVM ventilation is the most critical skill. A properly executed BVM can maintain oxygenation in the vast majority of patients and is the fallback when advanced airways fail." },
      { question: "When should you attempt intubation vs place a supraglottic airway?", answer: "Supraglottic airways are preferred in cardiac arrest and when rapid airway securing is needed. Intubation is preferred for patients with high aspiration risk, those needing prolonged ventilation, or when precise ventilatory control is required." },
      { question: "How do you confirm advanced airway placement?", answer: "Waveform capnography is the gold standard. Also: bilateral breath sounds, absence of epigastric sounds, visible chest rise, and esophageal detector device. Continuous capnography monitoring is required during transport." },
      { question: "What is the BVM ventilation rate during CPR?", answer: "8-10 breaths per minute (one breath every 6-8 seconds) when an advanced airway is in place. Without an advanced airway, deliver 2 breaths after every 30 compressions (30:2 ratio)." },
    ],
    internalLinksJson: [
      { url: "/paramedic/lessons/bag-valve-mask-ventilation", anchor: "BVM Ventilation Details", context: "paramedic" },
      { url: "/paramedic/lessons/opa-vs-npa", anchor: "OPA vs NPA Selection", context: "paramedic" },
    ],
  },
  {
    slug: "paramedic-bag-valve-mask-ventilation",
    title: "Bag-Valve-Mask (BVM) Ventilation for Paramedics",
    metaTitle: "BVM Ventilation Technique | Paramedic Guide | NurseNest",
    metaDescription: "Master bag-valve-mask ventilation technique including single and two-rescuer methods, troubleshooting, and pediatric considerations for paramedic certification exams.",
    pageType: "topic",
    exam: "NREMT",
    contentHtml: `<article><h1>Bag-Valve-Mask (BVM) Ventilation for Paramedics</h1>
<p class="lead">BVM ventilation is the most essential airway management skill in prehospital care. It serves as both a primary ventilation technique and the critical backup when advanced airway attempts fail. Mastering BVM technique is non-negotiable for every paramedic.</p>
<section id="equipment"><h2>Equipment Setup</h2>
<p>Select the appropriate mask size: the mask should cover the bridge of the nose to the cleft of the chin without covering the eyes or extending past the chin. Connect the BVM to high-flow oxygen at 15 L/min with an oxygen reservoir bag attached. Without the reservoir, an adult BVM delivers approximately 21% oxygen (room air). With reservoir on 15 L/min, it delivers approximately 90-100% FiO2.</p>
<p>Check the bag for proper function: squeeze and release — the bag should reinflate immediately. Check the pop-off valve (if present) and consider disabling it in adult patients who require higher pressures.</p></section>
<section id="technique"><h2>Ventilation Technique</h2>
<p>The C-E clamp technique is fundamental. With the non-dominant hand: place the thumb and index finger in a C shape around the mask connector, pressing the mask against the face. The remaining three fingers form an E shape under the mandible, lifting the jaw into the mask. This creates the seal AND maintains airway opening simultaneously.</p>
<p>Squeeze the bag with the dominant hand. Deliver each breath over 1 second. The goal is visible chest rise — approximately 500-600 mL for adults. Do NOT over-ventilate. Excessive volume and rate increase gastric inflation, raising aspiration risk and decreasing venous return.</p>
<p>Ventilation rates: Adults 10-12 breaths/min. During CPR with advanced airway: 10 breaths/min (1 every 6 seconds). Without advanced airway during CPR: 30:2 ratio (2 breaths after every 30 compressions).</p></section>
<section id="two-rescuer"><h2>Two-Rescuer BVM</h2>
<p>Two-rescuer BVM is significantly more effective than single-rescuer and should be used whenever possible. One rescuer uses both hands to maintain the mask seal and jaw lift using bilateral C-E clamp technique. The second rescuer squeezes the bag. This dramatically improves tidal volume delivery by ensuring an airtight seal.</p></section>
<section id="troubleshooting"><h2>Troubleshooting</h2>
<p>Common problems and solutions: air leaking around mask (reposition, try two-rescuer technique, use different size mask), inability to ventilate (reposition head, consider airway adjunct, check for foreign body, suction), gastric distillation (reduce volume and rate, apply cricoid pressure cautiously), and fogging mask without chest rise (obstruction — reposition, adjunct, suction).</p></section>
<section id="pediatric"><h2>Pediatric BVM Considerations</h2>
<p>Use an appropriately sized pediatric BVM and mask. Infant masks are round; child and adult masks are triangular. Avoid overextension of the infant neck — a neutral or slight sniffing position is optimal. Ventilation rate: 12-20 breaths/min for infants and children. Use only enough volume for visible chest rise — pediatric lungs are small and barotrauma risk is higher.</p></section>
<section id="pearls"><h2>Exam Pearls</h2>
<div class="exam-trap"><strong>Exam Trap:</strong> The most common cause of ineffective BVM ventilation is a poor mask seal, not insufficient squeeze force. Always troubleshoot the seal first.</div>
<div class="exam-trap"><strong>Exam Trap:</strong> Hyperventilation during cardiac arrest increases intrathoracic pressure, decreases venous return, and reduces coronary perfusion pressure. Maintain exactly 10 breaths per minute with an advanced airway.</div></section></article>`,
    tocJson: [
      { id: "equipment", label: "Equipment Setup", level: 2 },
      { id: "technique", label: "Ventilation Technique", level: 2 },
      { id: "two-rescuer", label: "Two-Rescuer BVM", level: 2 },
      { id: "troubleshooting", label: "Troubleshooting", level: 2 },
      { id: "pediatric", label: "Pediatric Considerations", level: 2 },
      { id: "pearls", label: "Exam Pearls", level: 2 },
    ],
    faqJson: [
      { question: "What FiO2 does a BVM deliver?", answer: "Without oxygen reservoir: approximately 21% (room air). With reservoir on 15 L/min oxygen: approximately 90-100% FiO2. Always use a reservoir bag connected to high-flow oxygen for maximum oxygen delivery." },
      { question: "How much volume should each BVM squeeze deliver?", answer: "500-600 mL for adults — enough for visible chest rise. Each breath should be delivered over 1 second. Do not forcefully squeeze the entire bag; this over-ventilates and causes gastric inflation." },
      { question: "Why is two-rescuer BVM better?", answer: "Two-rescuer technique allows one person to use both hands for mask seal and jaw lift while the other squeezes the bag. Studies show significantly better tidal volumes and mask seal with two rescuers. Use this technique whenever an additional provider is available." },
      { question: "When should you switch from BVM to an advanced airway?", answer: "Consider advanced airway when: BVM cannot maintain adequate oxygenation (SpO2 < 90%), the patient requires prolonged ventilation, aspiration risk is high, or during cardiac arrest (after initial BVM ventilation with CPR)." },
    ],
    internalLinksJson: [
      { url: "/paramedic/lessons/airway-management-fundamentals", anchor: "Airway Fundamentals", context: "paramedic" },
      { url: "/paramedic/lessons/opa-vs-npa", anchor: "OPA vs NPA", context: "paramedic" },
    ],
  },
  {
    slug: "paramedic-opa-vs-npa",
    title: "OPA vs NPA: Selecting the Right Airway Adjunct",
    metaTitle: "OPA vs NPA Airway Adjunct Selection | Paramedic Guide | NurseNest",
    metaDescription: "Learn when to use an oropharyngeal airway (OPA) vs nasopharyngeal airway (NPA) including indications, contraindications, sizing, and insertion technique for paramedics.",
    pageType: "topic",
    exam: "NREMT",
    contentHtml: `<article><h1>OPA vs NPA: Selecting the Right Airway Adjunct</h1>
<p class="lead">Airway adjuncts maintain airway patency by preventing tongue obstruction. Choosing between an oropharyngeal airway (OPA) and nasopharyngeal airway (NPA) depends on the patient's level of consciousness, gag reflex, and clinical scenario. This is a high-yield exam topic.</p>
<section id="opa"><h2>Oropharyngeal Airway (OPA)</h2>
<p>The OPA is a rigid plastic device that sits in the oropharynx, preventing the tongue from occluding the airway. It is indicated for unconscious patients without a gag reflex. If the patient gags on insertion, remove it immediately — it can cause vomiting and aspiration.</p>
<p><strong>Sizing:</strong> Measure from the corner of the mouth to the earlobe (or angle of the jaw). An incorrectly sized OPA either fails to displace the tongue (too small) or pushes the epiglottis over the glottic opening (too large), worsening obstruction.</p>
<p><strong>Insertion (adult):</strong> Open the mouth. Insert with the tip pointing toward the palate (upside down). Advance halfway, then rotate 180 degrees so the tip follows the curvature of the tongue into the oropharynx. <strong>Insertion (pediatric):</strong> Insert with the tip pointing toward the tongue (right-side up), using a tongue depressor to displace the tongue. Do NOT rotate — the softer pediatric tissue is more susceptible to trauma.</p></section>
<section id="npa"><h2>Nasopharyngeal Airway (NPA)</h2>
<p>The NPA is a soft rubber or silicone tube inserted through the nostril into the posterior nasopharynx. It is better tolerated than the OPA and can be used in semiconscious patients, patients with an intact gag reflex, patients with trismus (clenched jaw), or those with oral trauma.</p>
<p><strong>Sizing:</strong> Measure from the tip of the nose to the earlobe. Diameter should approximate the patient's little finger or nostril size. Available in French sizes (typically 24-34 Fr for adults).</p>
<p><strong>Insertion:</strong> Lubricate with water-soluble lubricant. Insert into the larger nostril with the bevel facing the septum. Advance along the floor of the nasal passage (not upward toward the brain) with gentle steady pressure. If resistance is met, try the other nostril.</p>
<p><strong>Contraindications:</strong> Suspected basilar skull fracture (signs: Battle's sign, raccoon eyes, CSF rhinorrhea or otorrhea, hemotympanum). There is a theoretical risk of intracranial placement through a fractured cribriform plate, though documented cases are extremely rare.</p></section>
<section id="comparison"><h2>Quick Comparison</h2>
<p>OPA: unconscious only, no gag reflex required, rigid plastic, measured mouth-to-ear, rotated on insertion in adults. NPA: semiconscious or unconscious, tolerates intact gag, soft rubber, measured nose-to-ear, never in basilar skull fracture.</p></section>
<section id="pearls"><h2>Exam Pearls</h2>
<div class="exam-trap"><strong>Exam Trap:</strong> An OPA does NOT protect the airway from aspiration. It only prevents tongue obstruction. The patient still needs suctioning and monitoring for vomiting.</div>
<div class="exam-trap"><strong>Exam Trap:</strong> If an unconscious patient gags on OPA insertion, remove it and try an NPA instead. Gagging on an OPA means the patient has some protective reflexes and the OPA is inappropriate.</div></section></article>`,
    tocJson: [
      { id: "opa", label: "Oropharyngeal Airway (OPA)", level: 2 },
      { id: "npa", label: "Nasopharyngeal Airway (NPA)", level: 2 },
      { id: "comparison", label: "Quick Comparison", level: 2 },
      { id: "pearls", label: "Exam Pearls", level: 2 },
    ],
    faqJson: [
      { question: "Can you use an NPA and OPA at the same time?", answer: "Yes. In deeply unconscious patients, using both an NPA and OPA simultaneously can provide optimal airway patency. This combination is often used when BVM ventilation is difficult with a single adjunct." },
      { question: "Is NPA really contraindicated in basilar skull fracture?", answer: "The traditional teaching is yes — due to theoretical risk of intracranial placement through a fractured cribriform plate. While documented cases are extremely rare, it remains a standard contraindication on certification exams and in most protocols. Look for Battle's sign, raccoon eyes, and CSF leak." },
      { question: "What if the patient gags on the OPA?", answer: "Remove it immediately. Gagging indicates the patient has protective airway reflexes and the OPA is contraindicated. Consider using an NPA instead, which is better tolerated in patients with some consciousness." },
      { question: "How do you know if the OPA is the right size?", answer: "Measure from the corner of the mouth to the earlobe or angle of the jaw. If properly sized, the flange should rest on the patient's lips and the tip should sit in the posterior pharynx. An OPA that is too small will push the tongue back; too large will push the epiglottis over the glottis." },
    ],
    internalLinksJson: [
      { url: "/paramedic/lessons/airway-management-fundamentals", anchor: "Airway Fundamentals", context: "paramedic" },
      { url: "/paramedic/lessons/bag-valve-mask-ventilation", anchor: "BVM Ventilation", context: "paramedic" },
    ],
  },
  {
    slug: "paramedic-cardiac-arrest-recognition",
    title: "Cardiac Arrest Recognition & Initial Management",
    metaTitle: "Cardiac Arrest Recognition | Paramedic Guide | NurseNest",
    metaDescription: "Learn to rapidly recognize cardiac arrest, differentiate shockable from non-shockable rhythms, and initiate high-quality CPR with ACLS algorithms for paramedic certification.",
    pageType: "topic",
    exam: "NREMT",
    contentHtml: `<article><h1>Cardiac Arrest Recognition & Initial Management</h1>
<p class="lead">Cardiac arrest is the cessation of effective cardiac mechanical activity. Survival depends on early recognition, immediate high-quality CPR, and rapid defibrillation for shockable rhythms. Every second counts — brain death begins within 4-6 minutes without circulation.</p>
<section id="recognition"><h2>Recognizing Cardiac Arrest</h2>
<p>Cardiac arrest is identified by: unresponsiveness, absent or abnormal breathing (agonal gasps are NOT adequate breathing), and absent pulse. Pulse check should take no more than 10 seconds — if you are unsure whether a pulse is present, begin CPR. Agonal respirations occur in up to 40% of cardiac arrest patients and are frequently misinterpreted as adequate breathing, leading to delayed CPR.</p></section>
<section id="rhythms"><h2>Cardiac Arrest Rhythms</h2>
<p><strong>Shockable rhythms:</strong> Ventricular fibrillation (VF) — disorganized electrical activity with no effective contraction, appears as chaotic waveform. Pulseless ventricular tachycardia (pVT) — organized wide-complex rhythm but no pulse generated. Both are treated with defibrillation.</p>
<p><strong>Non-shockable rhythms:</strong> Asystole — no electrical activity (flat line; confirm in multiple leads to rule out fine VF or lead disconnect). Pulseless electrical activity (PEA) — organized rhythm on the monitor but no palpable pulse, indicating the heart has electrical activity but cannot generate effective mechanical contraction. Both are treated with CPR and epinephrine while searching for reversible causes.</p></section>
<section id="cpr"><h2>High-Quality CPR</h2>
<p>Compressions: push hard and fast at a rate of 100-120/min, depth of at least 2 inches (5 cm) in adults. Allow full chest recoil between compressions. Minimize interruptions — aim for chest compression fraction greater than 80%. Rotate compressors every 2 minutes to prevent fatigue-related quality decline. Compression-to-ventilation ratio without advanced airway: 30:2. With advanced airway: continuous compressions with 1 breath every 6 seconds.</p></section>
<section id="defibrillation"><h2>Early Defibrillation</h2>
<p>For witnessed VF/pVT: defibrillate immediately. For unwitnessed arrest: begin CPR while attaching the defibrillator. Biphasic energy: 120-200 J for first shock (device-specific; use maximum if unknown). Monophasic: 360 J. Resume CPR immediately after shock — do NOT check pulse until the next rhythm check at 2 minutes. Each minute of delay in defibrillation reduces survival by 7-10%.</p></section>
<section id="algorithm"><h2>ACLS Algorithm Overview</h2>
<p>Shockable (VF/pVT): CPR → Shock → CPR 2 min → Rhythm check → Epinephrine after 2nd shock → Amiodarone after 3rd shock → Continue cycle. Non-shockable (PEA/Asystole): CPR → Epinephrine ASAP → CPR 2 min → Rhythm check → Search for Hs and Ts → Continue cycle. Throughout: high-quality CPR, waveform capnography (ETCO2 > 10 mmHg indicates adequate CPR), IV/IO access, advanced airway when appropriate.</p></section>
<section id="pearls"><h2>Exam Pearls</h2>
<div class="exam-trap"><strong>Exam Trap:</strong> ETCO2 is the best indicator of CPR quality. Target ETCO2 > 10 mmHg during CPR. A sudden rise in ETCO2 (> 40 mmHg) often indicates ROSC before a pulse is detectable.</div></section></article>`,
    tocJson: [
      { id: "recognition", label: "Recognizing Cardiac Arrest", level: 2 },
      { id: "rhythms", label: "Cardiac Arrest Rhythms", level: 2 },
      { id: "cpr", label: "High-Quality CPR", level: 2 },
      { id: "defibrillation", label: "Early Defibrillation", level: 2 },
      { id: "algorithm", label: "ACLS Algorithm Overview", level: 2 },
      { id: "pearls", label: "Exam Pearls", level: 2 },
    ],
    faqJson: [
      { question: "What is the compression rate and depth for adult CPR?", answer: "Rate: 100-120 compressions per minute. Depth: at least 2 inches (5 cm) but not more than 2.4 inches (6 cm). Allow full chest recoil. Minimize interruptions to maintain chest compression fraction > 80%." },
      { question: "How often should you give epinephrine in cardiac arrest?", answer: "Every 3-5 minutes. For shockable rhythms (VF/pVT), give after the second shock. For non-shockable rhythms (PEA/asystole), give as soon as IV/IO access is established." },
      { question: "What are agonal respirations?", answer: "Agonal respirations are irregular, gasping breaths that occur in up to 40% of cardiac arrest patients. They are NOT adequate breathing. Patients with agonal respirations should be treated as being in cardiac arrest — begin CPR immediately." },
      { question: "When should you stop CPR?", answer: "Consider termination of resuscitation when: ROSC is achieved, care is transferred to a higher level, the rescuer is exhausted or unsafe conditions develop, or termination criteria are met (unwitnessed arrest, no shockable rhythm, no ROSC after 20+ minutes of ACLS in normothermic patients, per local protocol)." },
    ],
    internalLinksJson: [
      { url: "/paramedic/lessons/prehospital-ecg-basics", anchor: "ECG Basics", context: "paramedic" },
      { url: "/paramedic/lessons/chest-pain-assessment", anchor: "Chest Pain Assessment", context: "paramedic" },
    ],
  },
  {
    slug: "paramedic-shock-assessment",
    title: "Shock Assessment & Management for Paramedics",
    metaTitle: "Shock Assessment Guide | Paramedic Study Guide | NurseNest",
    metaDescription: "Learn to identify and manage all types of shock in the prehospital setting including hypovolemic, cardiogenic, distributive, and obstructive shock for paramedic exams.",
    pageType: "topic",
    exam: "NREMT",
    contentHtml: `<article><h1>Shock Assessment & Management for Paramedics</h1>
<p class="lead">Shock is inadequate tissue perfusion resulting in cellular hypoxia. Early recognition and aggressive treatment are essential — shock is progressive and once compensatory mechanisms fail, mortality increases dramatically. Paramedics must identify the type of shock and initiate type-specific treatment.</p>
<section id="types"><h2>Types of Shock</h2>
<p><strong>Hypovolemic:</strong> Caused by volume loss (hemorrhage, dehydration, burns). Most common type in trauma. Signs: tachycardia, hypotension, cool/pale/diaphoretic skin, narrowed pulse pressure, delayed capillary refill.</p>
<p><strong>Cardiogenic:</strong> Caused by pump failure (MI, cardiomyopathy, valve failure). Signs: hypotension with JVD, pulmonary edema (crackles), tachycardia, and cool extremities.</p>
<p><strong>Distributive:</strong> Caused by vasodilation — includes anaphylactic, septic, and neurogenic shock. Anaphylactic: urticaria, wheezing, angioedema, hypotension. Septic: warm flushed skin initially, tachycardia, fever. Neurogenic: bradycardia (paradoxical), hypotension, warm dry skin below the lesion level.</p>
<p><strong>Obstructive:</strong> Mechanical obstruction to blood flow. Includes tension pneumothorax (JVD, absent breath sounds, tracheal deviation), cardiac tamponade (Beck's triad: JVD, hypotension, muffled heart sounds), and massive PE.</p></section>
<section id="assessment"><h2>Assessment Findings</h2>
<p>Compensated shock: tachycardia is the earliest sign. Blood pressure may be maintained through vasoconstriction. Look for: anxiety, restlessness, tachycardia, cool pale skin, delayed capillary refill (> 2 sec), narrowed pulse pressure, slight tachypnea.</p>
<p>Decompensated shock: compensatory mechanisms failing. Hypotension (SBP < 90 mmHg), altered mental status, marked tachycardia, mottled or cyanotic skin, weak thready pulses, significant tachypnea, decreasing urine output.</p>
<p>Irreversible shock: cellular death and organ failure. Profound hypotension unresponsive to treatment, bradycardia (terminal), agonal breathing, unresponsiveness. This stage has very high mortality regardless of intervention.</p></section>
<section id="management"><h2>Type-Specific Management</h2>
<p>Hypovolemic: control hemorrhage, IV fluid resuscitation (permissive hypotension SBP 80-90 for penetrating trauma), TXA within 3 hours, keep warm. Cardiogenic: cautious fluid (250 mL bolus, reassess), vasopressors if needed, treat underlying cause (STEMI → cath lab). Anaphylactic: epinephrine 0.3-0.5 mg IM, IV fluids, diphenhydramine, albuterol for bronchospasm. Neurogenic: IV fluids, vasopressors for refractory hypotension, atropine for symptomatic bradycardia. Obstructive: treat the cause (needle decompression for tension pneumothorax, pericardiocentesis for tamponade).</p></section></article>`,
    tocJson: [
      { id: "types", label: "Types of Shock", level: 2 },
      { id: "assessment", label: "Assessment Findings", level: 2 },
      { id: "management", label: "Type-Specific Management", level: 2 },
    ],
    faqJson: [
      { question: "What is the earliest sign of shock?", answer: "Tachycardia is the earliest reliable sign of shock. The body increases heart rate to compensate for decreased cardiac output or volume. Note: neurogenic shock is the exception — it presents with bradycardia due to loss of sympathetic tone." },
      { question: "How do you differentiate cardiogenic from hypovolemic shock?", answer: "Both have hypotension and tachycardia, but cardiogenic shock has JVD and pulmonary edema (crackles), while hypovolemic has flat neck veins and clear lungs. Cardiogenic = pump failure (fluid backed up). Hypovolemic = volume loss (not enough fluid)." },
      { question: "What is the Shock Index and how is it used?", answer: "Shock Index = Heart Rate / Systolic BP. Normal is 0.5-0.7. SI > 1.0 suggests significant shock even if individual vital signs appear normal. It can detect compensated shock before traditional vital sign abnormalities become apparent." },
      { question: "Why is neurogenic shock different from other types?", answer: "Neurogenic shock is caused by spinal cord injury disrupting sympathetic nervous system control. Unlike other shock types, it presents with bradycardia (loss of sympathetic tone to the heart) and warm, dry skin below the injury level (loss of vasoconstriction). Treatment includes fluids and vasopressors." },
    ],
    internalLinksJson: [],
  },
  {
    slug: "paramedic-trauma-primary-survey",
    title: "Trauma Primary Survey (XABCDE) for Paramedics",
    metaTitle: "XABCDE Trauma Primary Survey | Paramedic Guide | NurseNest",
    metaDescription: "Master the XABCDE trauma primary survey sequence including hemorrhage control, airway management, breathing assessment, and rapid transport decisions for paramedic exams.",
    pageType: "topic",
    exam: "NREMT",
    contentHtml: `<article><h1>Trauma Primary Survey (XABCDE) for Paramedics</h1>
<p class="lead">The primary survey is a systematic, rapid assessment designed to identify and treat immediately life-threatening conditions. The XABCDE framework ensures nothing critical is missed and interventions are prioritized correctly. Complete the primary survey in under 90 seconds.</p>
<section id="x"><h2>X — Exsanguinating Hemorrhage</h2>
<p>Control massive external bleeding before anything else. Apply direct pressure or tourniquet to life-threatening extremity hemorrhage. Pack junctional wounds (neck, axilla, groin) with hemostatic gauze and apply pressure. The Hartford Consensus established that exsanguinating hemorrhage kills faster than airway obstruction in penetrating trauma.</p></section>
<section id="a"><h2>A — Airway with C-Spine Protection</h2>
<p>Assess airway patency while maintaining inline cervical stabilization. Look for blood, vomitus, foreign bodies, facial trauma, expanding neck hematoma. Use jaw thrust (not head-tilt) for suspected C-spine injury. Insert OPA or NPA as needed. If airway is not maintainable with basic techniques, proceed to advanced airway.</p></section>
<section id="b"><h2>B — Breathing and Ventilation</h2>
<p>Expose and inspect the chest. Assess rate, depth, and effort. Auscultate bilateral lung sounds. Palpate for crepitus, flail segments, subcutaneous emphysema. Identify and treat: tension pneumothorax (needle decompression), open pneumothorax (vented chest seal), flail chest (positive pressure ventilation if respiratory failure), massive hemothorax (IV access, rapid transport).</p></section>
<section id="c"><h2>C — Circulation</h2>
<p>Assess pulse rate and quality. Skin assessment (color, temperature, moisture). Control all remaining hemorrhage. Establish IV/IO access (two large-bore 14-16G IVs). Apply pelvic binder for suspected pelvic fracture. Initiate fluid resuscitation with permissive hypotension strategy (target SBP 80-90 in penetrating trauma). Administer TXA 1g IV over 10 min within 3 hours of injury.</p></section>
<section id="d"><h2>D — Disability</h2>
<p>Glasgow Coma Scale: Eye (1-4) + Verbal (1-5) + Motor (1-6) = 3-15. GCS ≤ 8 indicates severe TBI requiring intubation. Check pupils bilaterally for size and reactivity. Assess for lateralizing signs. Blood glucose to rule out hypoglycemia mimicking altered mental status.</p></section>
<section id="e"><h2>E — Exposure and Environment</h2>
<p>Fully expose the patient to identify all injuries, then immediately cover to prevent hypothermia. The lethal triad (hypothermia + acidosis + coagulopathy) is the enemy in trauma. Use warm blankets, heated IV fluids, minimize exposure time. Log-roll to inspect the posterior body.</p></section></article>`,
    tocJson: [
      { id: "x", label: "X — Hemorrhage Control", level: 2 },
      { id: "a", label: "A — Airway", level: 2 },
      { id: "b", label: "B — Breathing", level: 2 },
      { id: "c", label: "C — Circulation", level: 2 },
      { id: "d", label: "D — Disability", level: 2 },
      { id: "e", label: "E — Exposure", level: 2 },
    ],
    faqJson: [
      { question: "Why is X before A in the trauma primary survey?", answer: "Because massive external hemorrhage can kill faster than airway compromise. The Hartford Consensus and military experience showed that uncontrolled extremity bleeding from penetrating trauma can cause death in minutes, faster than airway obstruction. Tourniquet application takes seconds and can be life-saving." },
      { question: "How long should the primary survey take?", answer: "The primary survey should be completed in under 90 seconds. Life-threatening conditions are identified and treated simultaneously as they are found. The goal is to identify what will kill the patient in the next few minutes and intervene immediately." },
      { question: "What is the lethal triad in trauma?", answer: "Hypothermia, acidosis, and coagulopathy. These three conditions reinforce each other in a deadly cycle. Hypothermia impairs clotting, acidosis worsens coagulopathy and cardiac function, and ongoing hemorrhage causes both hypothermia and acidosis. Preventing hypothermia from the first minutes is critical." },
      { question: "What vital sign findings suggest significant hemorrhage?", answer: "Tachycardia (earliest sign), narrowed pulse pressure, delayed capillary refill > 2 seconds, cool pale diaphoretic skin, and eventually hypotension (SBP < 90 mmHg). A healthy adult can lose 30-40% of blood volume before becoming hypotensive due to compensatory vasoconstriction." },
    ],
    internalLinksJson: [],
  },
  {
    slug: "paramedic-spinal-motion-restriction",
    title: "Spinal Motion Restriction for Paramedics",
    metaTitle: "Spinal Motion Restriction | Paramedic Guide | NurseNest",
    metaDescription: "Learn evidence-based spinal motion restriction including assessment criteria, techniques, and selective immobilization protocols for prehospital paramedic practice.",
    pageType: "topic",
    exam: "NREMT",
    contentHtml: `<article><h1>Spinal Motion Restriction for Paramedics</h1>
<p class="lead">Spinal motion restriction (SMR) has evolved significantly from the era of universal backboard immobilization. Current evidence supports selective SMR based on validated assessment criteria, with a shift from long backboards to vacuum mattresses and self-extrication when appropriate.</p>
<section id="indications"><h2>Indications for SMR</h2>
<p>Apply SMR when a mechanism of injury suggests potential spinal injury AND any of the following are present: midline spinal tenderness, neurological deficit (weakness, numbness, tingling), altered mental status (GCS < 15, intoxication), distracting injury that prevents reliable assessment. Use validated criteria (NEXUS or Canadian C-Spine Rule) to guide decisions.</p>
<p><strong>NEXUS criteria (clearance if ALL five met):</strong> No midline cervical tenderness, no focal neurological deficit, normal alertness, no intoxication, no painful distracting injury.</p>
<p><strong>Canadian C-Spine Rule:</strong> Any high-risk factor (age > 65, dangerous mechanism, paresthesias) mandates immobilization. If no high-risk factor, low-risk factors allow safe assessment of range of motion. If the patient can actively rotate the neck 45 degrees left and right, clearance is appropriate.</p></section>
<section id="techniques"><h2>SMR Techniques</h2>
<p>Cervical collar: size appropriately (measure from the trapezius to the angle of the jaw). A poorly fitted collar can cause harm — too tight restricts venous drainage increasing ICP, too loose provides no stabilization. Apply with inline stabilization maintained until the collar is secured.</p>
<p>Long backboard: increasingly being replaced by vacuum mattresses due to evidence of complications (pressure ulcers, pain, respiratory restriction). If used, limit time on the board. Use for extrication and transfer, then move to a vacuum mattress or hospital stretcher as soon as feasible.</p>
<p>Vacuum mattress: conforms to the patient's body, provides better comfort and immobilization than a rigid board. Becoming the standard for prehospital spinal immobilization in many systems.</p></section>
<section id="pearls"><h2>Exam Pearls</h2>
<div class="exam-trap"><strong>Exam Trap:</strong> Penetrating trauma to the head, neck, or torso does NOT automatically require spinal immobilization unless neurological deficits are present. Studies show immobilization in penetrating trauma can delay care and worsen outcomes.</div></section></article>`,
    tocJson: [
      { id: "indications", label: "Indications for SMR", level: 2 },
      { id: "techniques", label: "SMR Techniques", level: 2 },
      { id: "pearls", label: "Exam Pearls", level: 2 },
    ],
    faqJson: [
      { question: "Is backboard immobilization still standard of care?", answer: "No. Current evidence favors selective spinal motion restriction using cervical collars and vacuum mattresses. Long backboards are used for extrication but patients should be removed from the board as soon as possible to prevent complications (pressure ulcers, pain, respiratory restriction)." },
      { question: "When can you clear the C-spine in the field?", answer: "Using NEXUS or Canadian C-Spine Rule criteria. If the patient is alert, not intoxicated, has no midline tenderness, no neurological deficits, and no distracting injuries, the paramedic can determine that SMR is not indicated (per local protocol)." },
      { question: "Should penetrating trauma patients be immobilized?", answer: "Generally no, unless neurological deficits are present. Research shows that spinal immobilization in isolated penetrating trauma delays care without benefit. Check your local protocol — this is a shift from traditional teaching." },
      { question: "How do you properly size a cervical collar?", answer: "Measure from the top of the trapezius muscle to the angle of the mandible. Use this measurement to select the correct collar size. The collar should limit flexion and extension while allowing the patient to open their mouth for suctioning." },
    ],
    internalLinksJson: [],
  },
  {
    slug: "paramedic-chest-pain-assessment",
    title: "Chest Pain Assessment for Paramedics",
    metaTitle: "Chest Pain Assessment | Paramedic Guide | NurseNest",
    metaDescription: "Learn systematic prehospital chest pain assessment including OPQRST history, 12-lead ECG interpretation, STEMI recognition, and differential diagnosis for paramedic exams.",
    pageType: "topic",
    exam: "NREMT",
    contentHtml: `<article><h1>Chest Pain Assessment for Paramedics</h1>
<p class="lead">Chest pain is one of the most common reasons for EMS activation and can represent conditions ranging from benign musculoskeletal pain to immediately life-threatening acute coronary syndrome, pulmonary embolism, aortic dissection, or tension pneumothorax. Systematic assessment is essential.</p>
<section id="history"><h2>OPQRST History</h2>
<p>Onset: sudden vs gradual, activity at onset. Provocation/Palliation: worse with exertion, breathing, movement, palpation. Quality: crushing/pressure (cardiac), sharp/pleuritic (PE, pneumothorax, pericarditis), tearing (dissection). Region/Radiation: substernal radiating to jaw/left arm (ACS), back (dissection), shoulder (pericarditis). Severity: 0-10 scale, compare to previous episodes. Time: duration, constant vs intermittent, has it happened before.</p></section>
<section id="differential"><h2>Life-Threatening Differential</h2>
<p>Acute coronary syndrome: crushing substernal chest pain, diaphoresis, nausea, dyspnea, radiation to jaw/arm. Pulmonary embolism: sudden pleuritic chest pain, dyspnea, tachycardia, risk factors (immobilization, surgery, DVT). Aortic dissection: sudden tearing chest/back pain, unequal blood pressures between arms, new aortic regurgitation murmur. Tension pneumothorax: pleuritic pain, dyspnea, absent breath sounds, JVD, hypotension. Cardiac tamponade: Beck's triad (JVD, hypotension, muffled heart sounds).</p></section>
<section id="ecg"><h2>12-Lead ECG</h2>
<p>Acquire a 12-lead ECG within 10 minutes of patient contact for all chest pain patients. Look for: ST elevation (STEMI — activate cath lab), ST depression and T-wave inversion (ischemia/NSTEMI), new bundle branch block, dysrhythmias. STEMI criteria: ≥1 mm ST elevation in 2 or more contiguous leads (limb leads), or ≥2 mm in precordial leads. Transmit the 12-lead to the receiving facility for early cath lab activation.</p></section>
<section id="management"><h2>Prehospital Management</h2>
<p>For suspected ACS: aspirin 324 mg (chewed), nitroglycerin 0.4 mg SL every 5 min up to 3 doses (hold if SBP < 90 or PDE5 inhibitor use within 24-48 hours), morphine or fentanyl for pain unrelieved by nitroglycerin, oxygen only if SpO2 < 94%. Rapid transport to a PCI-capable facility for STEMI. Continuous cardiac monitoring and serial 12-lead ECGs.</p></section></article>`,
    tocJson: [
      { id: "history", label: "OPQRST History", level: 2 },
      { id: "differential", label: "Life-Threatening Differential", level: 2 },
      { id: "ecg", label: "12-Lead ECG", level: 2 },
      { id: "management", label: "Prehospital Management", level: 2 },
    ],
    faqJson: [
      { question: "When is nitroglycerin contraindicated for chest pain?", answer: "NTG is contraindicated when: SBP < 90 mmHg, patient has taken PDE5 inhibitors (sildenafil/tadalafil) within 24-48 hours, suspected right ventricular MI (ST elevation in V4R), or known severe aortic stenosis. These conditions can cause dangerous hypotension." },
      { question: "Should all chest pain patients receive oxygen?", answer: "No. Current guidelines recommend oxygen only if SpO2 < 94%. Hyperoxia in ACS patients may cause coronary vasoconstriction and increase infarct size. Monitor SpO2 and titrate oxygen to maintain 94-99%." },
      { question: "What defines a STEMI on 12-lead ECG?", answer: "ST elevation of ≥1 mm in two or more contiguous limb leads, or ≥2 mm in two or more contiguous precordial leads, in the clinical context of chest pain. New left bundle branch block with symptoms may also be treated as STEMI equivalent." },
      { question: "What is the aspirin dose for suspected ACS?", answer: "Aspirin 162-325 mg (commonly 324 mg — four 81 mg baby aspirin) chewed for rapid absorption. Aspirin inhibits platelet aggregation via COX-1 inhibition. It should be given as early as possible unless true aspirin allergy exists." },
    ],
    internalLinksJson: [],
  },
  {
    slug: "paramedic-stroke-recognition",
    title: "Stroke Recognition & Prehospital Management",
    metaTitle: "Stroke Recognition | Paramedic Guide | NurseNest",
    metaDescription: "Master prehospital stroke recognition using FAST and Cincinnati scales, large vessel occlusion screening, last known well time documentation, and rapid transport protocols.",
    pageType: "topic",
    exam: "NREMT",
    contentHtml: `<article><h1>Stroke Recognition & Prehospital Management</h1>
<p class="lead">Stroke is a time-critical emergency where every minute of delay results in approximately 1.9 million neurons lost. Paramedics play a pivotal role in early recognition, accurate stroke scale assessment, last known well time documentation, and rapid transport to an appropriate stroke center.</p>
<section id="types"><h2>Stroke Types</h2>
<p><strong>Ischemic stroke (87%):</strong> caused by arterial occlusion (thrombus or embolus). Treatment: tPA within 4.5 hours, mechanical thrombectomy up to 24 hours for large vessel occlusion. <strong>Hemorrhagic stroke (13%):</strong> intracerebral hemorrhage or subarachnoid hemorrhage. Treatment: blood pressure control, neurosurgical consultation. Prehospital differentiation is not possible — both present with sudden focal neurological deficits.</p></section>
<section id="assessment"><h2>Stroke Assessment Scales</h2>
<p><strong>Cincinnati Prehospital Stroke Scale:</strong> Facial droop (have the patient smile — one side doesn't move), Arm drift (eyes closed, arms extended — one arm drifts down), Speech (repeat a sentence — slurred or unable). Any single abnormality suggests stroke with 72% sensitivity.</p>
<p><strong>Large Vessel Occlusion Screening (LAMS):</strong> Facial droop (0-1), Arm drift (0-2), Grip strength (0-2). Score ≥ 4 suggests LVO and the patient should be transported to a comprehensive stroke center for potential thrombectomy.</p></section>
<section id="lkw"><h2>Last Known Well Time</h2>
<p>The last known well (LKW) time is the most critical piece of information for stroke treatment decisions. It determines eligibility for thrombolytic therapy (tPA within 4.5 hours) and mechanical thrombectomy. Ask family, bystanders, or check when the patient was last seen normal. If the patient woke up with symptoms (wake-up stroke), the LKW is when they went to sleep or were last seen normal.</p></section>
<section id="management"><h2>Prehospital Management</h2>
<p>Maintain airway, breathing, circulation. Check blood glucose (hypoglycemia can mimic stroke). Do NOT lower blood pressure in the field unless SBP > 220 mmHg (per local protocol) — hypertension is often compensatory to maintain cerebral perfusion. Position head of stretcher at 30 degrees. Establish IV access (but do NOT give dextrose-containing fluids unless hypoglycemic). Rapid transport to designated stroke center. Pre-notify hospital with stroke alert including LKW time, stroke scale findings, and ETA.</p></section></article>`,
    tocJson: [
      { id: "types", label: "Stroke Types", level: 2 },
      { id: "assessment", label: "Stroke Assessment Scales", level: 2 },
      { id: "lkw", label: "Last Known Well Time", level: 2 },
      { id: "management", label: "Prehospital Management", level: 2 },
    ],
    faqJson: [
      { question: "Why is last known well time so important?", answer: "It determines eligibility for time-sensitive treatments: tPA within 4.5 hours, mechanical thrombectomy up to 24 hours for select patients. Without an accurate LKW time, the patient may be excluded from potentially life-saving interventions." },
      { question: "Should paramedics lower blood pressure in stroke patients?", answer: "Generally no. Hypertension in acute stroke is often compensatory to maintain cerebral perfusion around the ischemic area. Lowering BP can worsen ischemia. Only treat if SBP > 220 mmHg per local protocol. The hospital will manage blood pressure after imaging determines stroke type." },
      { question: "What are common stroke mimics?", answer: "Hypoglycemia (always check glucose), Todd's paralysis (post-seizure weakness), migraine with aura, conversion disorder, brain tumor, and drug intoxication. Glucose check is the most important field test to rule out the most common mimic." },
      { question: "What is the difference between a stroke center and a comprehensive stroke center?", answer: "Primary stroke centers can administer tPA and provide acute stroke care. Comprehensive stroke centers additionally offer mechanical thrombectomy, neurosurgical capability, and advanced neuroimaging. Patients with suspected LVO (LAMS ≥ 4) should be transported to a comprehensive center when feasible." },
    ],
    internalLinksJson: [],
  },
  {
    slug: "paramedic-seizure-assessment",
    title: "Seizure Assessment & Management for Paramedics",
    metaTitle: "Seizure Assessment | Paramedic Guide | NurseNest",
    metaDescription: "Master prehospital seizure assessment and management including status epilepticus treatment, benzodiazepine dosing, and post-ictal care for paramedic certification.",
    pageType: "topic",
    exam: "NREMT",
    contentHtml: `<article><h1>Seizure Assessment & Management for Paramedics</h1>
<p class="lead">Seizures result from abnormal electrical activity in the brain and range from brief absence episodes to life-threatening status epilepticus. Paramedics must protect the patient during the seizure, identify treatable causes, terminate prolonged seizures, and manage the post-ictal phase.</p>
<section id="types"><h2>Seizure Types</h2>
<p><strong>Generalized tonic-clonic:</strong> the classic "grand mal" seizure — tonic phase (sustained contraction, rigid posture) followed by clonic phase (rhythmic jerking). Loss of consciousness throughout. Most common type encountered in EMS.</p>
<p><strong>Focal (partial):</strong> limited to one area of the brain. May present as isolated limb jerking, sensory changes, or behavioral changes. Can secondarily generalize to tonic-clonic.</p>
<p><strong>Absence:</strong> brief staring episodes (5-15 seconds), usually in children. No post-ictal phase. Rarely encountered by EMS.</p>
<p><strong>Status epilepticus:</strong> continuous seizure activity lasting > 5 minutes OR two or more seizures without return to baseline consciousness between them. This is a medical emergency requiring immediate benzodiazepine therapy.</p></section>
<section id="management"><h2>Prehospital Management</h2>
<p>During active seizure: protect from injury (move objects away, do NOT restrain or insert anything in the mouth), position laterally if possible, suction if needed, time the seizure duration, administer high-flow oxygen. Monitor SpO2 and ETCO2.</p>
<p>For status epilepticus or seizures > 5 minutes: midazolam 10 mg IM (preferred if no IV access) or 5 mg IV, or diazepam 5-10 mg IV slow push (0.5 mg/kg rectal for pediatric if no IV). May repeat once. If refractory, consider second-line agents per local protocol.</p>
<p>Post-ictal care: maintain airway (lateral position for secretion management), reassess mental status frequently, check blood glucose (give dextrose if < 60 mg/dL), obtain history (known seizure disorder? Medications? Compliance?), look for injuries sustained during seizure, transport for evaluation.</p></section>
<section id="causes"><h2>Common Causes to Assess</h2>
<p>Epilepsy (most common in known seizure patients — check medication compliance), hypoglycemia, electrolyte abnormalities, fever (febrile seizures in children 6 months-5 years), head trauma, stroke, toxin exposure, eclampsia (pregnancy), and CNS infection.</p></section></article>`,
    tocJson: [
      { id: "types", label: "Seizure Types", level: 2 },
      { id: "management", label: "Prehospital Management", level: 2 },
      { id: "causes", label: "Common Causes", level: 2 },
    ],
    faqJson: [
      { question: "What defines status epilepticus?", answer: "Continuous seizure activity lasting more than 5 minutes, or two or more seizures without return to baseline consciousness between them. It is a medical emergency requiring immediate benzodiazepine therapy to prevent brain damage." },
      { question: "Why is midazolam IM preferred over diazepam IV for seizures?", answer: "Midazolam IM has faster time to seizure cessation than diazepam IV because it eliminates the delay of establishing IV access during an active seizure. The RAMPART trial showed midazolam IM was non-inferior to diazepam IV and resulted in faster treatment." },
      { question: "Should you put anything in a seizing patient's mouth?", answer: "Absolutely not. Do not insert bite blocks, oral airways, fingers, or any objects. The patient cannot swallow their tongue. Inserting objects risks dental damage, aspiration of broken pieces, or injury to the rescuer. Protect the patient from their environment instead." },
      { question: "How do you manage febrile seizures in children?", answer: "Most febrile seizures are self-limiting (< 5 minutes). Cool the child gradually (remove excess clothing, tepid sponging). Do not give antipyretics during the seizure. If the seizure lasts > 5 minutes, treat as status epilepticus with benzodiazepines. Transport for evaluation." },
    ],
    internalLinksJson: [],
  },
  {
    slug: "paramedic-anaphylaxis-management",
    title: "Anaphylaxis Management for Paramedics",
    metaTitle: "Anaphylaxis Management | Paramedic Guide | NurseNest",
    metaDescription: "Learn prehospital anaphylaxis recognition and management including epinephrine dosing, airway management, and fluid resuscitation for paramedic certification exams.",
    pageType: "topic",
    exam: "NREMT",
    contentHtml: `<article><h1>Anaphylaxis Management for Paramedics</h1>
<p class="lead">Anaphylaxis is a severe, potentially fatal systemic allergic reaction involving multiple organ systems. Epinephrine is the first-line, life-saving treatment. Delay in epinephrine administration is the most common cause of anaphylaxis-related death.</p>
<section id="recognition"><h2>Recognition</h2>
<p>Anaphylaxis is a clinical diagnosis based on multisystem involvement after allergen exposure: skin (urticaria, flushing, angioedema — present in 80-90%), respiratory (stridor, wheezing, dyspnea, throat tightness), cardiovascular (hypotension, tachycardia, dizziness, syncope), GI (nausea, vomiting, abdominal cramping, diarrhea). Onset typically within minutes of exposure but can be delayed up to several hours.</p>
<p>Common triggers: foods (peanuts, tree nuts, shellfish, milk, eggs), insect stings (Hymenoptera — bees, wasps, hornets), medications (antibiotics, NSAIDs), latex, and exercise.</p></section>
<section id="treatment"><h2>Treatment: Epinephrine First</h2>
<p>Epinephrine 0.3-0.5 mg IM (1:1000 or 1 mg/mL concentration) into the anterolateral thigh. This is the FIRST intervention. Do not delay epinephrine for any other treatment. May repeat every 5-15 minutes if symptoms persist or recur. Pediatric dose: 0.01 mg/kg IM (max 0.3 mg). Epinephrine reverses bronchospasm (beta-2), increases blood pressure (alpha-1), and stabilizes mast cells to prevent further mediator release.</p>
<p>If cardiovascular collapse: epinephrine 0.1 mg IV (1:10,000 or 0.1 mg/mL) or epinephrine infusion 2-10 mcg/min. IV epinephrine carries higher risk of adverse effects and should be given slowly with cardiac monitoring.</p></section>
<section id="adjuncts"><h2>Adjunct Treatments</h2>
<p>After epinephrine: aggressive IV fluid resuscitation (1-2 L NS bolus for hypotension — anaphylaxis can cause massive fluid shifts), albuterol 2.5 mg nebulized for persistent bronchospasm, diphenhydramine 25-50 mg IV/IM (H1 blocker — treats urticaria, does NOT treat airway or cardiovascular compromise), famotidine 20 mg IV (H2 blocker), methylprednisolone 125 mg IV or dexamethasone (may reduce biphasic reaction risk but onset too slow for acute management).</p></section></article>`,
    tocJson: [
      { id: "recognition", label: "Recognition", level: 2 },
      { id: "treatment", label: "Epinephrine Treatment", level: 2 },
      { id: "adjuncts", label: "Adjunct Treatments", level: 2 },
    ],
    faqJson: [
      { question: "What is the epinephrine dose for anaphylaxis?", answer: "0.3-0.5 mg IM of 1:1000 (1 mg/mL) concentration into the anterolateral thigh. May repeat every 5-15 minutes. Pediatric: 0.01 mg/kg IM (max 0.3 mg). Use the 1:10,000 concentration ONLY for IV administration in cardiovascular collapse." },
      { question: "Can you give too much epinephrine for anaphylaxis?", answer: "The risk of NOT giving epinephrine far outweighs the risk of giving it. Side effects of IM epinephrine (palpitations, tremor, anxiety) are transient and manageable. Deaths from anaphylaxis are almost always associated with delayed or absent epinephrine administration." },
      { question: "What is biphasic anaphylaxis?", answer: "A recurrence of anaphylactic symptoms hours after the initial reaction has resolved, even without re-exposure to the allergen. Occurs in approximately 5-20% of cases. Patients should be observed for at least 4-6 hours after treatment, and longer if the reaction was severe." },
      { question: "Why shouldn't antihistamines be given instead of epinephrine?", answer: "Antihistamines (diphenhydramine) only treat skin symptoms (urticaria, itching). They do NOT reverse bronchospasm, do NOT increase blood pressure, and do NOT stabilize mast cells. They have slow onset and are adjuncts only. Epinephrine is the only drug that treats all life-threatening components of anaphylaxis." },
    ],
    internalLinksJson: [],
  },
  {
    slug: "paramedic-diabetic-emergencies",
    title: "Diabetic Emergencies for Paramedics",
    metaTitle: "Diabetic Emergencies | Paramedic Guide | NurseNest",
    metaDescription: "Master prehospital diabetic emergency management including hypoglycemia, DKA, and HHS assessment, treatment, and differentiation for paramedic certification exams.",
    pageType: "topic",
    exam: "NREMT",
    contentHtml: `<article><h1>Diabetic Emergencies for Paramedics</h1>
<p class="lead">Diabetic emergencies are among the most common medical calls in EMS. Hypoglycemia is immediately life-threatening and rapidly reversible. Diabetic ketoacidosis and hyperosmolar hyperglycemic state require recognition and supportive management during transport.</p>
<section id="hypoglycemia"><h2>Hypoglycemia</h2>
<p>Blood glucose < 70 mg/dL (< 3.9 mmol/L). Symptoms progress with severity: mild (tremor, diaphoresis, tachycardia, anxiety, hunger), moderate (confusion, combativeness, slurred speech, incoordination), severe (seizures, unconsciousness, focal deficits mimicking stroke). Treatment: conscious patient — oral glucose 15-20g. Unconscious or unable to swallow — dextrose 10% (D10W) 25g IV (250 mL) or glucagon 1 mg IM if no IV access. Recheck glucose in 5-10 minutes and repeat treatment if still < 70 mg/dL.</p></section>
<section id="dka"><h2>Diabetic Ketoacidosis (DKA)</h2>
<p>Primarily Type 1 diabetes. Blood glucose typically 300-800 mg/dL. Caused by absolute insulin deficiency leading to uncontrolled lipolysis and ketone production. Signs: Kussmaul respirations (deep, rapid breathing to compensate for metabolic acidosis), fruity breath odor (acetone), polyuria, polydipsia, nausea/vomiting, abdominal pain, dehydration, altered mental status. Onset: hours to days.</p>
<p>Prehospital management: IV NS bolus 500 mL-1 L (these patients are severely dehydrated — average fluid deficit 5-7 L). Cardiac monitoring (hyperkalemia risk). Do NOT give insulin in the field. Monitor for complications: cardiac dysrhythmias from potassium shifts, aspiration risk with vomiting.</p></section>
<section id="hhs"><h2>Hyperosmolar Hyperglycemic State (HHS)</h2>
<p>Primarily Type 2 diabetes in elderly patients. Blood glucose often > 600 mg/dL (can exceed 1000 mg/dL). Extreme dehydration (fluid deficit 8-12 L). No ketoacidosis (enough insulin to prevent ketogenesis). More severe altered mental status than DKA. Higher mortality rate than DKA. Treatment: aggressive IV fluid resuscitation, cardiac monitoring, airway protection.</p></section></article>`,
    tocJson: [
      { id: "hypoglycemia", label: "Hypoglycemia", level: 2 },
      { id: "dka", label: "DKA", level: 2 },
      { id: "hhs", label: "HHS", level: 2 },
    ],
    faqJson: [
      { question: "What is the most important initial test for altered mental status?", answer: "Point-of-care blood glucose. Hypoglycemia is the most common reversible cause of altered mental status and can mimic stroke, seizure, intoxication, and psychiatric emergencies. Every patient with AMS should have glucose checked immediately." },
      { question: "Should you give D50 or D10 for hypoglycemia?", answer: "D10W (10% dextrose) is increasingly preferred over D50 (50% dextrose). D10 is less hypertonic, causes less tissue damage if extravasation occurs, and provides a more controlled glucose correction. Typical dose: 25g (250 mL of D10W) IV." },
      { question: "How do you differentiate DKA from HHS?", answer: "DKA: Type 1, glucose 300-800, Kussmaul breathing, fruity odor, acute onset. HHS: Type 2 (elderly), glucose often > 600, no Kussmaul breathing, no fruity odor, more severe dehydration and AMS, gradual onset over days. Both need fluids; neither gets insulin in the field." },
      { question: "Can glucagon be given for hypoglycemia when there is no IV access?", answer: "Yes. Glucagon 1 mg IM is indicated when IV access cannot be established. It works by stimulating glycogenolysis in the liver. Response takes 10-20 minutes. It may be ineffective in patients with depleted glycogen stores (chronic alcoholism, malnutrition, liver disease)." },
    ],
    internalLinksJson: [],
  },
  {
    slug: "paramedic-pediatric-respiratory-distress",
    title: "Pediatric Respiratory Distress for Paramedics",
    metaTitle: "Pediatric Respiratory Distress | Paramedic Guide | NurseNest",
    metaDescription: "Master pediatric respiratory distress assessment and management including croup, bronchiolitis, asthma, and foreign body airway obstruction for paramedic certification.",
    pageType: "topic",
    exam: "NREMT",
    contentHtml: `<article><h1>Pediatric Respiratory Distress for Paramedics</h1>
<p class="lead">Respiratory distress is the most common pediatric emergency. Children decompensate rapidly from respiratory distress to failure to arrest. Early recognition and intervention are critical — respiratory failure is the leading cause of pediatric cardiac arrest.</p>
<section id="assessment"><h2>Assessment</h2>
<p>Use the Pediatric Assessment Triangle: Appearance (TICLS: tone, interactivity, consolability, look/gaze, speech/cry), Work of Breathing (nasal flaring, retractions — suprasternal, intercostal, subcostal — head bobbing, grunting, seesaw breathing), Circulation to Skin (pallor, mottling, cyanosis).</p>
<p>Age-appropriate respiratory rates: newborn 30-60, infant 25-50, toddler 20-30, school-age 15-25, adolescent 12-20. Bradypnea or irregular respirations in a child with respiratory distress is an ominous sign of impending respiratory arrest.</p></section>
<section id="conditions"><h2>Common Conditions</h2>
<p><strong>Croup:</strong> viral (parainfluenza), ages 6 months-3 years. Barking cough, inspiratory stridor, hoarse voice. Worse at night. Treatment: cool mist or nebulized epinephrine for severe cases, dexamethasone.</p>
<p><strong>Bronchiolitis:</strong> viral (RSV), ages < 2 years. Wheezing, crackles, tachypnea, nasal flaring, poor feeding. Treatment: supportive (suctioning, oxygen, positioning). Albuterol is generally NOT effective.</p>
<p><strong>Asthma:</strong> wheezing, prolonged expiratory phase, accessory muscle use. Treatment: albuterol 2.5 mg nebulized, ipratropium 0.25-0.5 mg (first dose), epinephrine IM for severe refractory cases.</p>
<p><strong>Foreign body:</strong> sudden onset, choking history, unilateral wheezing. Conscious: back blows and chest thrusts (infant), abdominal thrusts (child > 1 year). Unconscious: CPR with jaw lift to look for visible object before each breath.</p></section></article>`,
    tocJson: [
      { id: "assessment", label: "Assessment", level: 2 },
      { id: "conditions", label: "Common Conditions", level: 2 },
    ],
    faqJson: [
      { question: "What is the most ominous sign in a child with respiratory distress?", answer: "Bradycardia. In children, bradycardia is almost always caused by hypoxia and indicates imminent respiratory and cardiac arrest. Other late signs: altered mental status, bradypnea, cyanosis, and a quiet or silent chest in asthma (no air movement)." },
      { question: "How do you differentiate croup from epiglottitis?", answer: "Croup: gradual onset, barking cough, hoarseness, low-grade fever, ages 6 months-3 years. Epiglottitis: rapid onset, drooling, dysphagia, high fever, tripod positioning, muffled voice, ages 2-7 years (rare with Hib vaccine). Epiglottitis is a true emergency — do NOT examine the throat or agitate the child." },
      { question: "What is the pediatric albuterol dose?", answer: "Albuterol 2.5 mg via nebulizer for children < 20 kg, 5 mg for children > 20 kg. Can repeat every 15-20 minutes for up to 3 doses, or give continuous nebulization for severe bronchospasm. Add ipratropium 0.25-0.5 mg for the first treatment." },
      { question: "When should you provide blow-by oxygen vs a mask for children?", answer: "Use blow-by (oxygen tubing held near the face) when the child is anxious and will not tolerate a mask. A calm child tolerates more aggressive oxygen delivery. Never fight with a child over a mask — the distress caused can worsen respiratory status. A parent holding the tubing near the child's face is often the most effective approach." },
    ],
    internalLinksJson: [],
  },
  {
    slug: "paramedic-prehospital-ecg-basics",
    title: "Prehospital ECG Basics for Paramedics",
    metaTitle: "Prehospital ECG Basics | Paramedic Guide | NurseNest",
    metaDescription: "Learn 12-lead ECG acquisition, rhythm interpretation, STEMI recognition, and cardiac monitoring essentials for prehospital paramedic practice and certification exams.",
    pageType: "topic",
    exam: "NREMT",
    contentHtml: `<article><h1>Prehospital ECG Basics for Paramedics</h1>
<p class="lead">ECG interpretation is a core paramedic competency. From rhythm identification during cardiac arrest to 12-lead STEMI recognition during chest pain calls, the ability to accurately read and act on ECG findings directly impacts patient outcomes.</p>
<section id="lead-placement"><h2>12-Lead ECG Acquisition</h2>
<p>Limb leads: RA (right arm), LA (left arm), RL (right leg), LL (left leg). Precordial leads: V1 (4th ICS right sternal border), V2 (4th ICS left sternal border), V3 (between V2 and V4), V4 (5th ICS midclavicular), V5 (5th ICS anterior axillary), V6 (5th ICS midaxillary). Acquire within 10 minutes of patient contact. Clean skin and remove hair for optimal electrode contact.</p></section>
<section id="interpretation"><h2>Systematic Interpretation</h2>
<p>Rate: count R-R intervals. Regular rhythm: 300 ÷ (# of large boxes between R-R). Irregular rhythm: count complexes in 6-second strip × 10. Rhythm: regular or irregular? P waves present and consistent? PR interval normal (0.12-0.20 sec)? QRS narrow (< 0.12 sec) or wide? ST segments: elevation, depression, or normal? T waves: upright, inverted, peaked?</p></section>
<section id="stemi"><h2>STEMI Recognition</h2>
<p>STEMI criteria: ≥1 mm ST elevation in 2 or more contiguous limb leads, or ≥2 mm in 2 or more contiguous precordial leads. Contiguous lead groups: Inferior (II, III, aVF — RCA territory), Anterior (V1-V4 — LAD territory), Lateral (I, aVL, V5-V6 — LCx territory). New LBBB with symptoms may be treated as STEMI equivalent. Transmit the 12-lead to the hospital for early cath lab activation.</p></section>
<section id="common-rhythms"><h2>Must-Know Rhythms</h2>
<p>Normal sinus rhythm, sinus tachycardia, sinus bradycardia, atrial fibrillation, atrial flutter, SVT, ventricular tachycardia, ventricular fibrillation, asystole, PEA, 1st degree AV block, 2nd degree Type I (Wenckebach), 2nd degree Type II, 3rd degree (complete) heart block. Each rhythm has specific assessment findings and treatment algorithms that must be memorized.</p></section></article>`,
    tocJson: [
      { id: "lead-placement", label: "12-Lead Acquisition", level: 2 },
      { id: "interpretation", label: "Systematic Interpretation", level: 2 },
      { id: "stemi", label: "STEMI Recognition", level: 2 },
      { id: "common-rhythms", label: "Must-Know Rhythms", level: 2 },
    ],
    faqJson: [
      { question: "How quickly should a 12-lead ECG be obtained?", answer: "Within 10 minutes of patient contact for all chest pain patients. For STEMI recognition, the sooner the better — early 12-lead acquisition and transmission to the receiving facility allows pre-activation of the cardiac catheterization lab, reducing door-to-balloon time." },
      { question: "What are contiguous leads on a 12-lead ECG?", answer: "Contiguous leads look at the same area of the heart: Inferior (II, III, aVF), Anterior (V1-V4), Lateral (I, aVL, V5-V6), Septal (V1-V2). STEMI requires ST elevation in 2 or more contiguous leads to identify the infarct territory." },
      { question: "How do you calculate heart rate from an ECG strip?", answer: "For regular rhythms: 300 divided by the number of large boxes between two consecutive R waves. Or count the R waves in a 6-second strip and multiply by 10 (works for both regular and irregular rhythms)." },
      { question: "What is the normal PR interval?", answer: "0.12-0.20 seconds (3-5 small boxes). Shortened PR (< 0.12s) may indicate WPW or junctional rhythm. Prolonged PR (> 0.20s) indicates 1st degree AV block. Progressively lengthening PR followed by a dropped QRS indicates 2nd degree Type I (Wenckebach)." },
    ],
    internalLinksJson: [],
  },
  {
    slug: "paramedic-oxygen-delivery-devices",
    title: "Oxygen Delivery Devices for Paramedics",
    metaTitle: "Oxygen Delivery Devices | Paramedic Guide | NurseNest",
    metaDescription: "Master prehospital oxygen delivery systems including nasal cannula, simple mask, non-rebreather, CPAP, and BVM with flow rates and FiO2 delivery for paramedic exams.",
    pageType: "topic",
    exam: "NREMT",
    contentHtml: `<article><h1>Oxygen Delivery Devices for Paramedics</h1>
<p class="lead">Selecting the appropriate oxygen delivery device is a fundamental paramedic skill. Each device delivers a different FiO2 at specific flow rates. Understanding the capabilities and limitations of each device ensures optimal oxygenation without the risks of over- or under-oxygenation.</p>
<section id="devices"><h2>Device Overview</h2>
<p><strong>Nasal cannula:</strong> 1-6 L/min, delivers 24-44% FiO2. Low-flow, comfortable, allows eating and talking. Appropriate for mild hypoxia. Each liter adds approximately 4% FiO2.</p>
<p><strong>Simple face mask:</strong> 5-8 L/min (minimum 5 L to prevent CO2 rebreathing), delivers 40-60% FiO2. Used for moderate hypoxia.</p>
<p><strong>Non-rebreather mask (NRB):</strong> 10-15 L/min, delivers 80-95% FiO2 with all valves intact. Reservoir bag must remain inflated. Standard for high-flow oxygen in emergencies. Not a sealed system — some room air entrainment occurs.</p>
<p><strong>CPAP:</strong> 5-10 cmH2O pressure, delivers up to 100% FiO2 depending on system. Indicated for pulmonary edema and COPD exacerbation. Provides positive pressure to splint airways open and improve gas exchange.</p>
<p><strong>BVM with reservoir:</strong> 15 L/min, delivers approximately 90-100% FiO2. Used for apneic patients or those requiring assisted ventilation. Connected to oxygen with reservoir bag.</p></section>
<section id="selection"><h2>Device Selection Guidelines</h2>
<p>Target SpO2 94-99% for most patients. COPD patients: target SpO2 88-92% (use nasal cannula at 1-2 L/min to start). Cardiac arrest: 100% oxygen via BVM. ACS: oxygen only if SpO2 < 94%. Severe respiratory distress with adequate drive: CPAP. Respiratory failure/apnea: BVM with reservoir.</p></section></article>`,
    tocJson: [
      { id: "devices", label: "Device Overview", level: 2 },
      { id: "selection", label: "Selection Guidelines", level: 2 },
    ],
    faqJson: [
      { question: "Why is the minimum flow for a simple mask 5 L/min?", answer: "Below 5 L/min, exhaled CO2 accumulates in the mask and is rebreathed, causing hypercarbia. The 5 L/min minimum ensures adequate flushing of exhaled gas. If the patient needs less than 5 L/min, switch to a nasal cannula." },
      { question: "What SpO2 target should COPD patients have?", answer: "88-92%. COPD patients may have chronic CO2 retention, and their respiratory drive can be partly dependent on hypoxic drive. High-flow oxygen can suppress this drive, leading to hypoventilation and CO2 narcosis. Start with nasal cannula at 1-2 L/min and titrate carefully." },
      { question: "When should CPAP be used vs BVM?", answer: "CPAP is for patients with adequate respiratory drive who need pressure support (pulmonary edema, COPD). BVM is for patients who are apneic or have inadequate respiratory effort. CPAP requires the patient to breathe spontaneously; BVM provides ventilation for patients who cannot breathe adequately on their own." },
      { question: "How much FiO2 does a nasal cannula deliver at 4 L/min?", answer: "Approximately 36% FiO2. Each liter per minute of oxygen flow adds roughly 4% to the baseline 21% room air: 1 L = 24%, 2 L = 28%, 3 L = 32%, 4 L = 36%, 5 L = 40%, 6 L = 44%. Flows above 6 L/min cause nasal mucosal drying without significant FiO2 increase." },
    ],
    internalLinksJson: [],
  },
  {
    slug: "paramedic-rapid-trauma-assessment",
    title: "Rapid Trauma Assessment for Paramedics",
    metaTitle: "Rapid Trauma Assessment | Paramedic Guide | NurseNest",
    metaDescription: "Master the rapid trauma assessment including DCAP-BTLS, mechanism of injury evaluation, and secondary survey techniques for prehospital paramedic practice.",
    pageType: "topic",
    exam: "NREMT",
    contentHtml: `<article><h1>Rapid Trauma Assessment for Paramedics</h1>
<p class="lead">The rapid trauma assessment is a focused head-to-toe examination performed on patients with significant mechanism of injury. It follows the primary survey and identifies injuries requiring intervention during transport. DCAP-BTLS is the systematic framework applied to each body region.</p>
<section id="dcap"><h2>DCAP-BTLS Framework</h2>
<p>At each body region, assess for: <strong>D</strong>eformities, <strong>C</strong>ontusions, <strong>A</strong>brasions, <strong>P</strong>enetrations/Punctures, <strong>B</strong>urns, <strong>T</strong>enderness, <strong>L</strong>acerations, <strong>S</strong>welling. This systematic mnemonic ensures no finding is missed during the rapid assessment.</p></section>
<section id="sequence"><h2>Assessment Sequence</h2>
<p>Head: inspect and palpate skull, face, pupils (PERRL). Neck: JVD, tracheal position, subcutaneous emphysema, cervical tenderness. Chest: symmetry, paradoxical movement, breath sounds, crepitus. Abdomen: rigidity, distension, guarding, tenderness in all four quadrants. Pelvis: gentle compression (once only) for stability. Extremities: pulses, motor, sensation distally, deformities. Posterior: log-roll to inspect back for wounds, step-off deformities of the spine.</p></section>
<section id="vitals"><h2>Vital Signs and Monitoring</h2>
<p>Obtain baseline vitals: HR, BP, RR, SpO2, ETCO2, GCS, blood glucose, temperature (if relevant). Reassess every 5 minutes for critical patients, every 15 minutes for stable patients. Trending is more valuable than any single measurement — a heart rate rising from 90 to 120 over 10 minutes tells a different story than a stable rate of 100.</p></section></article>`,
    tocJson: [
      { id: "dcap", label: "DCAP-BTLS Framework", level: 2 },
      { id: "sequence", label: "Assessment Sequence", level: 2 },
      { id: "vitals", label: "Vital Signs and Monitoring", level: 2 },
    ],
    faqJson: [
      { question: "What does DCAP-BTLS stand for?", answer: "Deformities, Contusions, Abrasions, Penetrations/Punctures, Burns, Tenderness, Lacerations, Swelling. It is a systematic mnemonic applied to each body region during the rapid trauma assessment to ensure thorough evaluation." },
      { question: "When should the rapid trauma assessment be performed?", answer: "After completing the primary survey (XABCDE) in patients with significant mechanism of injury. It is typically performed en route to the hospital for critical patients. For non-critical patients, it may be performed on scene before transport." },
      { question: "How often should vital signs be reassessed in trauma?", answer: "Every 5 minutes for critical/unstable patients. Every 15 minutes for stable patients. The trend of vital signs over time is more clinically significant than any single measurement. Document each set accurately with the time." },
      { question: "Why do you only compress the pelvis once?", answer: "Repeated pelvic compression can disrupt a clot forming in a pelvic fracture, worsening hemorrhage. Assess pelvic stability with a single gentle compression. If instability is found, apply a pelvic binder immediately and do not reassess by compression." },
    ],
    internalLinksJson: [],
  },
  {
    slug: "paramedic-scene-safety",
    title: "Scene Safety for Paramedics",
    metaTitle: "Scene Safety | Paramedic Guide | NurseNest",
    metaDescription: "Learn prehospital scene safety assessment including hazard identification, BSI/PPE, scene size-up, and dynamic threat assessment for paramedic certification exams.",
    pageType: "topic",
    exam: "NREMT",
    contentHtml: `<article><h1>Scene Safety for Paramedics</h1>
<p class="lead">Scene safety is the absolute first priority on every EMS call. An injured or incapacitated provider cannot help anyone and creates an additional patient requiring rescue. Scene safety assessment is continuous — threats can emerge at any time during the call.</p>
<section id="assessment"><h2>Scene Size-Up Components</h2>
<p>BSI/PPE: don appropriate personal protective equipment before approaching. At minimum: gloves. Add mask and eye protection for potential splash/spray. N95 for suspected airborne disease. Full SCBA for hazmat. Scene safety: assess for hazards before entering — traffic, fire, hazardous materials, structural instability, downed power lines, water/ice, violent persons, animals. Mechanism of injury/nature of illness: determines assessment approach (trauma vs medical). Number of patients: request additional resources early if multiple patients identified. Additional resources: law enforcement, fire, hazmat, air medical.</p></section>
<section id="hazards"><h2>Common Hazards</h2>
<p>Traffic: position apparatus to protect the scene, wear high-visibility gear, be aware of approaching vehicles. Violence: if the scene is not safe, stage away and wait for law enforcement. Re-approach with caution even after police declare the scene safe. Hazmat: identify from a distance using binoculars, placards, and shipping papers. Do not enter the hot zone without proper training and equipment. Utilities: gas leaks, downed power lines (treat all wires as energized), water main breaks. Environmental: ice, extreme heat, flooding, unstable terrain.</p></section>
<section id="dynamic"><h2>Dynamic Safety</h2>
<p>Scene safety is not a one-time assessment — it is continuous. Situations change: a medical patient may become combative, bystanders may become hostile, weather may deteriorate, structures may become unstable. Always have an exit plan. Position yourself between the patient and the exit. Use situational awareness to identify threats as they develop.</p></section></article>`,
    tocJson: [
      { id: "assessment", label: "Scene Size-Up Components", level: 2 },
      { id: "hazards", label: "Common Hazards", level: 2 },
      { id: "dynamic", label: "Dynamic Safety", level: 2 },
    ],
    faqJson: [
      { question: "What is the first action on any EMS call?", answer: "Scene safety assessment and BSI/PPE. Before approaching any patient, ensure the scene is safe and you have appropriate protective equipment. This is the first step of every patient encounter on every certification exam." },
      { question: "What should you do if a scene becomes unsafe?", answer: "Withdraw immediately. Move yourself and your partner to a safe location. Request appropriate resources (law enforcement, fire, hazmat). Do not re-enter until the scene has been secured. Your safety comes first — you cannot help the patient if you become a victim." },
      { question: "What PPE is minimum for all patient contacts?", answer: "Gloves. Add eye protection and mask for potential body fluid exposure (blood, vomit, sputum). N95 respirator for suspected airborne diseases (TB, COVID-19, measles). Gown for extensive fluid exposure. Full SCBA for hazmat incidents (with specialized training)." },
      { question: "How do you identify a hazmat incident from a distance?", answer: "Look for DOT placards on vehicles (diamond-shaped signs with color coding and 4-digit UN numbers), NFPA diamonds on fixed facilities, shipping papers/bills of lading, visible vapors or unusual odors, and multiple patients with similar unexplained symptoms. Stay upwind and uphill. Use the Emergency Response Guidebook for initial isolation distances." },
    ],
    internalLinksJson: [],
  },
  {
    slug: "paramedic-glasgow-coma-scale",
    title: "Glasgow Coma Scale (GCS) for Paramedics",
    metaTitle: "Glasgow Coma Scale Guide | Paramedic Guide | NurseNest",
    metaDescription: "Master GCS scoring including eye opening, verbal response, and motor response components, clinical significance, and application in trauma and medical patients.",
    pageType: "topic",
    exam: "NREMT",
    contentHtml: `<article><h1>Glasgow Coma Scale (GCS) for Paramedics</h1>
<p class="lead">The Glasgow Coma Scale is the universal tool for assessing and communicating level of consciousness. Accurate GCS scoring guides critical decisions including intubation, transport destination, and neurosurgical mobilization. It is tested heavily on every paramedic certification exam.</p>
<section id="components"><h2>GCS Components</h2>
<p><strong>Eye Opening (E): 1-4.</strong> 4 = Spontaneous, 3 = To voice/command, 2 = To pain, 1 = None.</p>
<p><strong>Verbal Response (V): 1-5.</strong> 5 = Oriented (knows who, where, when), 4 = Confused (speaks but disoriented), 3 = Inappropriate words (random words, no conversation), 2 = Incomprehensible sounds (moaning, groaning), 1 = None.</p>
<p><strong>Motor Response (M): 1-6.</strong> 6 = Obeys commands, 5 = Localizes pain (reaches toward and attempts to remove pain stimulus), 4 = Withdrawal (pulls away from pain), 3 = Abnormal flexion (decorticate — arms flexed, legs extended), 2 = Extension (decerebrate — arms and legs extended), 1 = None.</p>
<p>Total GCS range: 3-15. Always report individual components (E3V4M5 = GCS 12) not just the total, as this provides more clinical information.</p></section>
<section id="significance"><h2>Clinical Significance</h2>
<p>GCS 13-15: Mild brain injury. GCS 9-12: Moderate brain injury. GCS 3-8: Severe brain injury — intubation indicated for airway protection. GCS < 9 with declining trend requires immediate advanced airway management and rapid transport to a trauma center with neurosurgical capability. Motor response is the most prognostically significant component.</p></section>
<section id="application"><h2>Application Tips</h2>
<p>Apply a standardized pain stimulus: trapezius squeeze or nail bed pressure. Score the BEST response observed. If eyes are swollen shut, score E1 and note "C" (closed). If the patient is intubated, score V1 and note "T" (tube). Reassess GCS every 5 minutes for critical patients — a drop of 2+ points indicates deterioration requiring immediate intervention.</p></section></article>`,
    tocJson: [
      { id: "components", label: "GCS Components", level: 2 },
      { id: "significance", label: "Clinical Significance", level: 2 },
      { id: "application", label: "Application Tips", level: 2 },
    ],
    faqJson: [
      { question: "What GCS score indicates need for intubation?", answer: "GCS ≤ 8 (severe brain injury) is the traditional threshold for intubation to protect the airway. The patient cannot reliably protect their airway from aspiration at this level of consciousness." },
      { question: "What is the most important GCS component prognostically?", answer: "Motor response (M). The best motor response is the single strongest predictor of neurological outcome. Always report individual component scores (e.g., E3V4M5) rather than just the total, as this provides critical clinical information." },
      { question: "How do you score GCS for an intubated patient?", answer: "Score Eye Opening and Motor Response normally. For Verbal Response, score as V1T (1 with T notation indicating tube). Report as E_V1T_M_ with the total calculated using V1. This prevents an artificially low GCS from affecting triage decisions." },
      { question: "What pain stimulus should be used for GCS?", answer: "Trapezius squeeze or nail bed pressure are standard central pain stimuli. Sternal rub is discouraged due to potential for bruising and unreliable results. Apply the stimulus for at least 10 seconds and score the best response observed." },
    ],
    internalLinksJson: [],
  },
  {
    slug: "paramedic-vital-signs-interpretation",
    title: "Vital Signs Interpretation for Paramedics",
    metaTitle: "Vital Signs Interpretation | Paramedic Guide | NurseNest",
    metaDescription: "Master prehospital vital signs interpretation including blood pressure, heart rate, respiratory rate, SpO2, ETCO2, and temperature assessment for paramedic certification.",
    pageType: "topic",
    exam: "NREMT",
    contentHtml: `<article><h1>Vital Signs Interpretation for Paramedics</h1>
<p class="lead">Vital signs are the objective measurements that guide clinical decision-making. More importantly, vital sign TRENDS tell the clinical story. A single normal blood pressure means little if it is dropping rapidly. Paramedics must master not just measurement technique but clinical interpretation.</p>
<section id="bp"><h2>Blood Pressure</h2>
<p>Normal adult: < 120/80 mmHg. Hypertension stage 1: 130-139/80-89. Hypertensive crisis: > 180/120. Hypotension: SBP < 90 mmHg (contextual — a young fit adult may be normotensive at 100; an elderly hypertensive patient may be in shock at 100). Pulse pressure = SBP - DBP (normal 30-40 mmHg). Widened pulse pressure: increased ICP, aortic regurgitation. Narrowed pulse pressure: hypovolemic shock, cardiac tamponade.</p></section>
<section id="hr"><h2>Heart Rate</h2>
<p>Normal adult: 60-100 bpm. Tachycardia (> 100): pain, anxiety, fever, hypovolemia, hypoxia, shock, cardiac dysrhythmia. Bradycardia (< 60): may be normal in athletes, also seen in increased ICP, beta-blocker/calcium channel blocker overdose, inferior MI, and hypothermia. In children, bradycardia is almost always caused by hypoxia.</p></section>
<section id="rr"><h2>Respiratory Rate</h2>
<p>Normal adult: 12-20 breaths/min. Tachypnea (> 20): hypoxia, pain, anxiety, metabolic acidosis (Kussmaul), fever, PE. Bradypnea (< 12): CNS depression (opioids, head injury), hypothermia, fatigue in severe respiratory distress (ominous sign). Depth and pattern matter as much as rate.</p></section>
<section id="spo2"><h2>Pulse Oximetry (SpO2)</h2>
<p>Normal: 95-100%. Concerning: < 94%. Critical: < 90%. Limitations: inaccurate in carbon monoxide poisoning (falsely normal), severe anemia, hypothermia, peripheral vasoconstriction, dark nail polish, and poor perfusion states (shock). SpO2 is a LATE indicator of hypoxia — PaO2 can drop significantly before SpO2 falls due to the oxyhemoglobin dissociation curve.</p></section>
<section id="etco2"><h2>End-Tidal CO2 (ETCO2)</h2>
<p>Normal: 35-45 mmHg. ETCO2 reflects adequacy of ventilation and perfusion. High ETCO2 (> 45): hypoventilation, COPD, fever, sepsis. Low ETCO2 (< 35): hyperventilation, PE (dead space), cardiac arrest (low perfusion). During CPR: ETCO2 > 10 mmHg indicates adequate compressions. Sudden ETCO2 rise > 40 mmHg may indicate ROSC.</p></section>
<section id="temp"><h2>Temperature</h2>
<p>Normal: 36.1-37.2°C (97-99°F). Fever: ≥ 38°C (100.4°F). Hypothermia: < 35°C (95°F). Temperature affects drug metabolism, coagulation, and cardiac rhythm. Severe hypothermia (< 30°C) causes J waves on ECG, bradycardia, and VF risk.</p></section></article>`,
    tocJson: [
      { id: "bp", label: "Blood Pressure", level: 2 },
      { id: "hr", label: "Heart Rate", level: 2 },
      { id: "rr", label: "Respiratory Rate", level: 2 },
      { id: "spo2", label: "Pulse Oximetry", level: 2 },
      { id: "etco2", label: "End-Tidal CO2", level: 2 },
      { id: "temp", label: "Temperature", level: 2 },
    ],
    faqJson: [
      { question: "Why is trending vital signs more important than a single reading?", answer: "A single vital sign reading only provides a snapshot. Trending reveals direction and rate of change. A heart rate of 100 bpm is concerning if it was 80 ten minutes ago (compensating for blood loss) but less concerning if it has been stable at 100 for the past hour. Always compare current vitals to previous readings." },
      { question: "When is SpO2 unreliable?", answer: "Carbon monoxide poisoning (reads falsely normal), severe anemia, hypothermia, poor perfusion/shock, methemoglobinemia, dark nail polish, and excessive motion. In these situations, rely on clinical assessment and ETCO2 rather than SpO2 alone." },
      { question: "What does ETCO2 tell you during CPR?", answer: "ETCO2 > 10 mmHg indicates compressions are generating adequate circulation. ETCO2 < 10 mmHg suggests compressions are ineffective — switch compressors or improve technique. A sudden sustained rise in ETCO2 > 40 mmHg often indicates return of spontaneous circulation (ROSC) before a pulse is palpable." },
      { question: "What is the significance of a narrowed pulse pressure?", answer: "Narrowed pulse pressure (SBP-DBP < 25 mmHg) indicates decreased stroke volume, often seen in hypovolemic shock, cardiac tamponade, and tension pneumothorax. It is an earlier indicator of shock than hypotension alone." },
    ],
    internalLinksJson: [],
  },
  {
    slug: "paramedic-pharmacology-basics",
    title: "Paramedic Pharmacology Basics",
    metaTitle: "Pharmacology Basics | Paramedic Guide | NurseNest",
    metaDescription: "Learn essential pharmacology concepts for paramedics including drug classifications, routes of administration, dosage calculations, and key prehospital medications.",
    pageType: "topic",
    exam: "NREMT",
    contentHtml: `<article><h1>Paramedic Pharmacology Basics</h1>
<p class="lead">Pharmacology is the study of how drugs affect the body and how the body affects drugs. Paramedics must understand drug classifications, mechanisms of action, indications, contraindications, doses, routes, and potential adverse effects for every medication in their formulary.</p>
<section id="concepts"><h2>Core Pharmacology Concepts</h2>
<p><strong>Pharmacokinetics</strong> (what the body does to the drug): Absorption (how the drug enters the bloodstream — affected by route), Distribution (how the drug travels through the body), Metabolism (how the drug is broken down — primarily in the liver), Excretion (how the drug is eliminated — primarily through kidneys).</p>
<p><strong>Pharmacodynamics</strong> (what the drug does to the body): Agonists activate receptors, antagonists block receptors. Affinity = how strongly a drug binds. Efficacy = the maximum effect a drug can produce. Therapeutic index = ratio of toxic dose to therapeutic dose (narrow therapeutic index drugs like digoxin and lithium require careful dosing).</p></section>
<section id="routes"><h2>Routes of Administration</h2>
<p>IV: fastest onset (seconds), most controllable, requires vascular access. IO: equivalent to IV, used when IV access fails. IM: moderate onset (10-20 minutes), reliable absorption (epinephrine for anaphylaxis, midazolam for seizures). SL: rapid absorption through mucous membranes (nitroglycerin). IN: intranasal via mucosal atomizer (naloxone, midazolam). Nebulized: inhaled directly to lungs (albuterol). Rectal: when other routes unavailable (diazepam in pediatric seizures). ET: endotracheal (NAVEL drugs — naloxone, atropine, vasopressin, epinephrine, lidocaine — last resort, unpredictable absorption).</p></section>
<section id="key-drugs"><h2>Essential Prehospital Medications</h2>
<p>Every paramedic must know these medications cold: Epinephrine (cardiac arrest, anaphylaxis, severe asthma), Amiodarone (refractory VF/VT), Adenosine (SVT), Atropine (bradycardia), Midazolam (seizures, sedation), Fentanyl (pain), Ketamine (pain, RSI), Albuterol (bronchospasm), Nitroglycerin (chest pain, pulmonary edema), Naloxone (opioid overdose), Dextrose/Glucagon (hypoglycemia), Aspirin (ACS), Ondansetron (nausea), Diphenhydramine (allergic reactions).</p></section>
<section id="calculations"><h2>Dosage Calculations</h2>
<p>Weight-based: Dose (mg) = Weight (kg) × mg/kg dose. Concentration: mg/mL = total mg ÷ total mL. Infusion rate: mL/hr = (desired dose in mcg/min × 60 × weight in kg) ÷ (concentration in mcg/mL). Always double-check calculations, especially for pediatric patients and high-risk medications.</p></section></article>`,
    tocJson: [
      { id: "concepts", label: "Core Concepts", level: 2 },
      { id: "routes", label: "Routes of Administration", level: 2 },
      { id: "key-drugs", label: "Essential Medications", level: 2 },
      { id: "calculations", label: "Dosage Calculations", level: 2 },
    ],
    faqJson: [
      { question: "What are the NAVEL drugs for endotracheal administration?", answer: "Naloxone, Atropine, Vasopressin, Epinephrine, Lidocaine. These can be given via the endotracheal tube when IV/IO access is unavailable. However, ET administration provides unpredictable absorption and is considered a last resort. IO access is preferred over ET route." },
      { question: "What is the difference between an agonist and antagonist?", answer: "An agonist binds to a receptor and activates it (e.g., albuterol activates beta-2 receptors causing bronchodilation). An antagonist binds to a receptor and blocks it without activating it (e.g., naloxone blocks opioid receptors, reversing opioid effects)." },
      { question: "Why is IO access equivalent to IV?", answer: "The bone marrow cavity has a rich venous network that does not collapse in shock. All IV medications, fluids, and blood products can be given IO at the same doses. Onset of action is comparable to IV. IO is the recommended alternative when IV access cannot be rapidly established." },
      { question: "How do you calculate a weight-based drug dose?", answer: "Dose (mg) = Patient weight (kg) × prescribed dose (mg/kg). Example: Midazolam 0.1 mg/kg for a 70 kg patient = 70 × 0.1 = 7 mg. For pediatric patients, always use kg weight (from Broselow tape if needed) and double-check all calculations." },
    ],
    internalLinksJson: [],
  },
];

export const glossaryPages: ParamedicSeoPage[] = [
  { slug: "paramedic-glossary-gcs", title: "Glasgow Coma Scale (GCS)", metaTitle: "GCS Definition | Paramedic Glossary | NurseNest", metaDescription: "Glasgow Coma Scale definition, scoring components, clinical significance, and prehospital application for paramedic exam preparation.", pageType: "glossary", exam: "NREMT",
    contentHtml: `<article><h1>Glasgow Coma Scale (GCS)</h1><p>The Glasgow Coma Scale is a standardized neurological assessment tool that quantifies level of consciousness on a 3-15 point scale. Developed in 1974 by Teasdale and Jennett, it evaluates three components: Eye Opening (1-4), Verbal Response (1-5), and Motor Response (1-6). GCS 13-15 indicates mild injury, 9-12 moderate, and 3-8 severe (intubation threshold). The motor component is the single strongest predictor of neurological outcome. In prehospital care, GCS guides intubation decisions, transport destination, and trauma center activation. Always report individual component scores (E_V_M_) rather than total alone. Exam relevance: GCS scoring appears on virtually every paramedic certification exam, often as scenario-based questions requiring rapid calculation.</p></article>`,
    tocJson: [], faqJson: [{ question: "What is the lowest possible GCS?", answer: "3 (E1V1M1) — no eye opening, no verbal response, no motor response. A GCS of 3 indicates deep coma or brain death." }, { question: "What GCS requires intubation?", answer: "GCS ≤ 8 is the standard threshold for intubation to protect the airway." }], internalLinksJson: [] },
  { slug: "paramedic-glossary-bvm", title: "Bag-Valve-Mask (BVM)", metaTitle: "BVM Definition | Paramedic Glossary | NurseNest", metaDescription: "Bag-valve-mask definition, technique, clinical use, and exam relevance for paramedic certification preparation.", pageType: "glossary", exam: "NREMT",
    contentHtml: `<article><h1>Bag-Valve-Mask (BVM)</h1><p>A bag-valve-mask is a handheld manual resuscitation device consisting of a self-inflating bag, a one-way valve, and a face mask used to deliver positive pressure ventilation. Connected to oxygen at 15 L/min with a reservoir, it delivers approximately 90-100% FiO2. The C-E clamp technique is used for mask seal. Two-rescuer BVM is significantly more effective than single-rescuer. Proper BVM technique is the most critical airway skill for paramedics — it is the primary ventilation device and the backup when advanced airways fail. Adult ventilation rate: 10-12 breaths/min; during CPR with advanced airway: 10/min. Each breath is delivered over 1 second with just enough volume for visible chest rise (500-600 mL). Hyperventilation must be avoided during CPR as it increases intrathoracic pressure and reduces venous return.</p></article>`,
    tocJson: [], faqJson: [{ question: "What oxygen percentage does a BVM deliver?", answer: "Without reservoir: 21% (room air). With reservoir on 15 L/min: approximately 90-100% FiO2." }, { question: "What is the ventilation rate during CPR?", answer: "10 breaths per minute (1 every 6 seconds) with an advanced airway. Without advanced airway: 2 breaths after every 30 compressions." }], internalLinksJson: [] },
  { slug: "paramedic-glossary-opa", title: "Oropharyngeal Airway (OPA)", metaTitle: "OPA Definition | Paramedic Glossary | NurseNest", metaDescription: "Oropharyngeal airway definition, indications, sizing, insertion technique, and exam relevance for paramedic certification.", pageType: "glossary", exam: "NREMT",
    contentHtml: `<article><h1>Oropharyngeal Airway (OPA)</h1><p>An oropharyngeal airway is a rigid plastic airway adjunct inserted into the mouth to prevent the tongue from obstructing the airway. It is indicated for unconscious patients without a gag reflex. Sizing: measure from the corner of the mouth to the earlobe or angle of the jaw. Adult insertion: insert with tip toward palate, then rotate 180 degrees. Pediatric insertion: insert with tip toward tongue using a tongue depressor (no rotation). If the patient gags on insertion, remove immediately — gagging indicates protective reflexes and the OPA is contraindicated. An OPA does NOT protect against aspiration. It is frequently used in conjunction with BVM ventilation to maintain airway patency during assisted ventilation.</p></article>`,
    tocJson: [], faqJson: [{ question: "Who should NOT receive an OPA?", answer: "Patients with an intact gag reflex. If the patient gags on insertion, remove the OPA immediately and consider an NPA instead." }, { question: "How is pediatric OPA insertion different?", answer: "In children, insert with the tip pointing toward the tongue (right-side up), using a tongue depressor to hold the tongue down. Do NOT rotate as in adults — pediatric tissue is more susceptible to trauma." }], internalLinksJson: [] },
  { slug: "paramedic-glossary-npa", title: "Nasopharyngeal Airway (NPA)", metaTitle: "NPA Definition | Paramedic Glossary | NurseNest", metaDescription: "Nasopharyngeal airway definition, indications, contraindications, insertion, and exam relevance for paramedic certification.", pageType: "glossary", exam: "NREMT",
    contentHtml: `<article><h1>Nasopharyngeal Airway (NPA)</h1><p>A nasopharyngeal airway is a soft rubber or silicone tube inserted through the nostril into the posterior nasopharynx to maintain airway patency. Unlike the OPA, the NPA is tolerated by semiconscious patients and those with an intact gag reflex. It is also useful for patients with trismus (clenched jaw) or oral trauma. Sizing: measure from the tip of the nose to the earlobe. Insertion: lubricate with water-soluble lubricant, insert into the larger nostril with the bevel toward the septum, advance along the floor of the nasal cavity. Key contraindication: suspected basilar skull fracture (signs include Battle's sign, raccoon eyes, CSF rhinorrhea/otorrhea). This is one of the most frequently tested contraindications on paramedic certification exams.</p></article>`,
    tocJson: [], faqJson: [{ question: "Why is NPA contraindicated in basilar skull fracture?", answer: "There is a theoretical risk of the NPA passing through a fractured cribriform plate into the brain. While extremely rare, this remains a standard contraindication on certification exams." }, { question: "Which nostril should you use?", answer: "The larger, more patent nostril. If resistance is met during insertion, try the other nostril. Never force the NPA — this can cause epistaxis." }], internalLinksJson: [] },
  { slug: "paramedic-glossary-spo2", title: "SpO2 (Pulse Oximetry)", metaTitle: "SpO2 Definition | Paramedic Glossary | NurseNest", metaDescription: "Pulse oximetry definition, normal values, clinical significance, limitations, and exam relevance for paramedic certification.", pageType: "glossary", exam: "NREMT",
    contentHtml: `<article><h1>SpO2 (Pulse Oximetry)</h1><p>SpO2 (peripheral oxygen saturation) is a non-invasive measurement of the percentage of hemoglobin saturated with oxygen, measured by a pulse oximeter. Normal: 95-100%. Target for most patients: 94-99%. Target for COPD patients: 88-92%. SpO2 < 90% indicates significant hypoxemia requiring intervention. Important limitations: falsely normal in carbon monoxide poisoning (carboxyhemoglobin absorbs light similarly to oxyhemoglobin), unreliable in poor perfusion, hypothermia, severe anemia, methemoglobinemia, and with dark nail polish. SpO2 is a LATE indicator of hypoxia due to the sigmoid shape of the oxyhemoglobin dissociation curve — PaO2 can drop substantially before SpO2 falls significantly. ETCO2 may detect respiratory compromise earlier than SpO2 in many clinical situations.</p></article>`,
    tocJson: [], faqJson: [{ question: "Why is SpO2 unreliable in CO poisoning?", answer: "Pulse oximeters cannot distinguish between oxyhemoglobin and carboxyhemoglobin — both absorb light similarly. A CO-poisoned patient can have a SpO2 reading of 99% while severely hypoxic." }, { question: "What SpO2 target for COPD patients?", answer: "88-92%. COPD patients may rely on hypoxic respiratory drive, and excessive oxygen can suppress ventilation." }], internalLinksJson: [] },
  { slug: "paramedic-glossary-capnography", title: "Capnography (ETCO2)", metaTitle: "Capnography Definition | Paramedic Glossary | NurseNest", metaDescription: "Capnography and ETCO2 definition, normal values, waveform interpretation, and prehospital clinical applications for paramedic certification.", pageType: "glossary", exam: "NREMT",
    contentHtml: `<article><h1>Capnography (ETCO2)</h1><p>Capnography is the continuous monitoring of carbon dioxide concentration in exhaled air. End-tidal CO2 (ETCO2) is the CO2 level measured at the end of exhalation, reflecting the adequacy of ventilation and perfusion. Normal ETCO2: 35-45 mmHg. Waveform capnography displays a characteristic rectangular waveform with four phases. Clinical applications in prehospital care: ETT placement confirmation (gold standard — presence of persistent waveform confirms tracheal placement), CPR quality monitoring (ETCO2 > 10 mmHg indicates adequate compressions), ROSC detection (sudden sustained rise above 40 mmHg), ventilation rate monitoring, status asthmaticus assessment (shark fin waveform indicates bronchospasm), and metabolic status (elevated ETCO2 in DKA/sepsis). Capnography is considered the standard of care for all intubated patients.</p></article>`,
    tocJson: [], faqJson: [{ question: "How does ETCO2 detect ROSC?", answer: "When ROSC occurs, cardiac output suddenly increases, delivering more CO2 to the lungs. This causes a dramatic sustained rise in ETCO2, often above 40 mmHg, frequently before a pulse is palpable." }, { question: "What does a shark-fin waveform mean?", answer: "A slanted upstroke on the capnography waveform (resembling a shark fin) indicates bronchospasm — the narrowed airways cause uneven emptying. Seen in asthma and COPD exacerbations." }], internalLinksJson: [] },
  { slug: "paramedic-glossary-tachycardia", title: "Tachycardia", metaTitle: "Tachycardia Definition | Paramedic Glossary | NurseNest", metaDescription: "Tachycardia definition, types, causes, clinical significance, and prehospital management for paramedic certification exam preparation.", pageType: "glossary", exam: "NREMT",
    contentHtml: `<article><h1>Tachycardia</h1><p>Tachycardia is a heart rate exceeding 100 beats per minute in adults. It is a sign, not a diagnosis — always identify and treat the underlying cause. Sinus tachycardia is the most common type and represents a physiological response to pain, anxiety, fever, hypovolemia, hypoxia, or exertion. Pathological tachycardias include supraventricular tachycardia (SVT, rate 150-250 bpm, narrow QRS), atrial fibrillation with rapid ventricular response, atrial flutter, ventricular tachycardia (wide QRS), and multifocal atrial tachycardia. Clinical significance: tachycardia is the earliest sign of shock, particularly hypovolemic shock. Prehospital management depends on the type and hemodynamic stability: stable narrow-complex → vagal maneuvers then adenosine; stable wide-complex → amiodarone; unstable with pulse → synchronized cardioversion.</p></article>`,
    tocJson: [], faqJson: [{ question: "When is tachycardia dangerous?", answer: "When it causes hemodynamic instability (hypotension, altered mental status, chest pain, acute heart failure signs) or when the rate is so fast (>150 bpm) that cardiac filling time is compromised, reducing cardiac output." }, { question: "What is the first treatment for unstable tachycardia?", answer: "Synchronized cardioversion. If the patient has a pulse but is hemodynamically unstable due to tachycardia, electrical cardioversion is the priority treatment regardless of rhythm type." }], internalLinksJson: [] },
  { slug: "paramedic-glossary-bradycardia", title: "Bradycardia", metaTitle: "Bradycardia Definition | Paramedic Glossary | NurseNest", metaDescription: "Bradycardia definition, types, causes, clinical significance, and prehospital management for paramedic certification exam preparation.", pageType: "glossary", exam: "NREMT",
    contentHtml: `<article><h1>Bradycardia</h1><p>Bradycardia is a heart rate below 60 beats per minute. It may be physiologically normal in well-conditioned athletes. Pathological causes include: increased vagal tone, inferior MI (RCA supplies the SA and AV nodes), increased intracranial pressure (Cushing's response), hypothermia, beta-blocker or calcium channel blocker toxicity, organophosphate poisoning, and high-degree AV blocks (Mobitz Type II, 3rd degree). In children, bradycardia is almost always caused by hypoxia and is a pre-arrest rhythm. Symptomatic bradycardia (hypotension, altered mental status, chest pain, acute heart failure) requires treatment: atropine 1 mg IV every 3-5 minutes (max 3 mg), transcutaneous pacing, or dopamine/epinephrine infusion. Atropine is ineffective for infranodal blocks (Mobitz II, 3rd degree) — these require pacing.</p></article>`,
    tocJson: [], faqJson: [{ question: "When does bradycardia require treatment?", answer: "When it causes symptoms: hypotension, altered mental status, chest pain, or signs of heart failure. Asymptomatic bradycardia (common in athletes) does not require treatment." }, { question: "Why is atropine ineffective for Mobitz Type II and 3rd degree blocks?", answer: "Atropine works by blocking vagal input at the SA and AV nodes. Mobitz II and 3rd degree blocks involve the His-Purkinje system below the AV node, which has minimal vagal innervation. These blocks require transcutaneous or transvenous pacing." }], internalLinksJson: [] },
  { slug: "paramedic-glossary-hypoxia", title: "Hypoxia", metaTitle: "Hypoxia Definition | Paramedic Glossary | NurseNest", metaDescription: "Hypoxia definition, types, causes, signs and symptoms, and prehospital management for paramedic certification exam preparation.", pageType: "glossary", exam: "NREMT",
    contentHtml: `<article><h1>Hypoxia</h1><p>Hypoxia is inadequate oxygen delivery to tissues to meet metabolic demands. Types: hypoxemic (low PaO2 in blood — altitude, V/Q mismatch, shunt), anemic (reduced oxygen-carrying capacity — hemorrhage, CO poisoning), stagnant (inadequate blood flow — shock, cardiac failure), histotoxic (cells cannot utilize oxygen — cyanide poisoning). Early signs: restlessness, anxiety, tachycardia, tachypnea. Late signs: cyanosis, confusion, bradycardia, altered mental status, loss of consciousness. SpO2 < 94% warrants supplemental oxygen. SpO2 < 90% requires aggressive intervention. In children, hypoxia is the most common cause of bradycardia and cardiac arrest. Prehospital management: address the cause (airway management, oxygen therapy, ventilation support, hemorrhage control for anemic hypoxia, circulation support for stagnant hypoxia).</p></article>`,
    tocJson: [], faqJson: [{ question: "What are early vs late signs of hypoxia?", answer: "Early: restlessness, anxiety, tachycardia, tachypnea, confusion. Late: cyanosis (a very late sign), bradycardia, altered mental status, loss of consciousness. Cyanosis requires approximately 5g/dL of desaturated hemoglobin to be visible." }, { question: "Why is cyanosis a late sign?", answer: "Cyanosis requires about 5 g/dL of desaturated hemoglobin. In anemic patients, there may not be enough hemoglobin to produce visible cyanosis even with severe hypoxemia. By the time cyanosis appears, hypoxia is significant." }], internalLinksJson: [] },
  { slug: "paramedic-glossary-anaphylaxis", title: "Anaphylaxis", metaTitle: "Anaphylaxis Definition | Paramedic Glossary | NurseNest", metaDescription: "Anaphylaxis definition, pathophysiology, clinical presentation, and emergency management for paramedic certification exam preparation.", pageType: "glossary", exam: "NREMT",
    contentHtml: `<article><h1>Anaphylaxis</h1><p>Anaphylaxis is a severe, potentially fatal systemic hypersensitivity reaction involving multiple organ systems. It is an IgE-mediated Type I hypersensitivity response causing massive mast cell and basophil degranulation, releasing histamine, leukotrienes, and prostaglandins. This causes: bronchospasm (airway compromise), vasodilation and capillary permeability (hypotension and edema), and urticaria/angioedema. Common triggers: foods, insect stings, medications, latex. Onset is typically minutes after exposure. Epinephrine 0.3-0.5 mg IM is the first-line, life-saving treatment — it reverses bronchospasm, increases blood pressure, and stabilizes mast cells. Delay in epinephrine is the most common cause of anaphylaxis-related death. Adjuncts include IV fluids, antihistamines, bronchodilators, and corticosteroids. Monitor for biphasic reaction (symptom recurrence hours later).</p></article>`,
    tocJson: [], faqJson: [{ question: "What makes anaphylaxis different from a simple allergic reaction?", answer: "Anaphylaxis involves multiple organ systems (skin, respiratory, cardiovascular, GI) and carries risk of death from airway compromise or cardiovascular collapse. A simple allergic reaction is limited to one system (usually skin) and is not life-threatening." }, { question: "Why IM epinephrine and not IV for anaphylaxis?", answer: "IM injection into the anterolateral thigh provides rapid, reliable absorption without the risks of IV bolus (dysrhythmias, hypertensive crisis). IV epinephrine is reserved for cardiovascular collapse and requires careful dose adjustment and cardiac monitoring." }], internalLinksJson: [] },
  { slug: "paramedic-glossary-hypovolemia", title: "Hypovolemia", metaTitle: "Hypovolemia Definition | Paramedic Glossary | NurseNest", metaDescription: "Hypovolemia definition, causes, classification, assessment findings, and prehospital management for paramedic certification.", pageType: "glossary", exam: "NREMT",
    contentHtml: `<article><h1>Hypovolemia</h1><p>Hypovolemia is a decrease in intravascular blood volume, the most common cause of shock in trauma. Hemorrhagic hypovolemia is classified by estimated blood loss: Class I (< 750 mL, < 15%) — minimal symptoms, normal vitals; Class II (750-1500 mL, 15-30%) — tachycardia, narrowed pulse pressure, anxiety; Class III (1500-2000 mL, 30-40%) — tachycardia, hypotension, confusion, tachypnea; Class IV (> 2000 mL, > 40%) — severe tachycardia, profound hypotension, lethargy or unconsciousness. Non-hemorrhagic causes include dehydration, burns, and third-spacing. Prehospital treatment: control hemorrhage, IV fluid resuscitation (permissive hypotension SBP 80-90 for penetrating trauma), TXA within 3 hours, keep warm. Key point: a healthy young adult can compensate for 30%+ blood loss before becoming hypotensive — tachycardia is the earliest sign.</p></article>`,
    tocJson: [], faqJson: [{ question: "How much blood can an adult lose before becoming hypotensive?", answer: "Up to 30-40% (1500-2000 mL). Young healthy adults compensate effectively through vasoconstriction and tachycardia. Elderly patients and those on beta-blockers may decompensate earlier." }, { question: "What is the target blood pressure in hemorrhagic shock?", answer: "Permissive hypotension targets SBP 80-90 mmHg in penetrating trauma. This maintains minimum perfusion without disrupting clot formation. This strategy is NOT used in TBI or in blunt trauma with suspected TBI." }], internalLinksJson: [] },
  { slug: "paramedic-glossary-cardioversion", title: "Cardioversion", metaTitle: "Cardioversion Definition | Paramedic Glossary | NurseNest", metaDescription: "Synchronized cardioversion definition, indications, energy levels, and technique for paramedic certification exam preparation.", pageType: "glossary", exam: "NREMT",
    contentHtml: `<article><h1>Cardioversion</h1><p>Synchronized cardioversion is the delivery of an electrical shock timed to the R wave of the QRS complex to terminate tachyarrhythmias in patients WITH a pulse. Synchronization prevents shock delivery during the relative refractory period (T wave), which could induce ventricular fibrillation. Indications: hemodynamically unstable tachycardia with a pulse (SVT, atrial fibrillation, atrial flutter, stable VT with symptoms). Energy levels vary by rhythm and device: narrow regular (SVT, flutter): 50-100 J; narrow irregular (atrial fibrillation): 120-200 J biphasic; wide regular (VT with pulse): 100 J. Sedation (midazolam, etomidate, ketamine) should be provided if the patient is conscious and time allows. Key distinction from defibrillation: cardioversion is synchronized (with the R wave), for patients WITH a pulse. Defibrillation is unsynchronized, for pulseless VF/VT.</p></article>`,
    tocJson: [], faqJson: [{ question: "What is the difference between cardioversion and defibrillation?", answer: "Cardioversion is synchronized (shock delivered on the R wave), used for tachyarrhythmias WITH a pulse. Defibrillation is unsynchronized (random timing), used for pulseless VF/VT. Synchronization prevents the shock from landing on the T wave, which could trigger VF." }, { question: "Should you sedate before cardioversion?", answer: "Yes, if the patient is conscious and time allows. Cardioversion is painful. Use short-acting sedation (midazolam 2-5 mg IV, etomidate 0.3 mg/kg IV, or ketamine). In true hemodynamic emergency, do not delay cardioversion for sedation." }], internalLinksJson: [] },
  { slug: "paramedic-glossary-defibrillation", title: "Defibrillation", metaTitle: "Defibrillation Definition | Paramedic Glossary | NurseNest", metaDescription: "Defibrillation definition, indications, energy levels, and technique for paramedic certification exam preparation.", pageType: "glossary", exam: "NREMT",
    contentHtml: `<article><h1>Defibrillation</h1><p>Defibrillation is the delivery of an unsynchronized electrical shock to terminate ventricular fibrillation (VF) or pulseless ventricular tachycardia (pVT). It depolarizes the entire myocardium simultaneously, allowing the heart's natural pacemaker to resume organized rhythm. It is the single most effective treatment for VF/pVT — each minute of delay reduces survival by 7-10%. Energy: biphasic 120-200 J (use maximum if unknown); monophasic 360 J. Immediately resume CPR after shock delivery without checking pulse (check rhythm at next 2-minute interval). Pad placement: anterior-lateral (right infraclavicular, left midaxillary at the nipple line) or anterior-posterior. Safety: ensure no one is touching the patient, remove oxygen source from near the chest, announce "I'm clear, you're clear, everybody's clear" before delivering shock.</p></article>`,
    tocJson: [], faqJson: [{ question: "Why resume CPR immediately after defibrillation?", answer: "After defibrillation, the heart usually cannot generate effective circulation immediately — it needs CPR to maintain perfusion while it recovers. Checking a pulse wastes critical time. Resume CPR immediately and check rhythm at the next 2-minute cycle." }, { question: "What energy should be used for the first defibrillation?", answer: "Biphasic: 120-200 J (device-specific; use maximum if the specific dose is unknown). Monophasic: 360 J. Subsequent shocks can be escalated if the first dose is not at maximum." }], internalLinksJson: [] },
  { slug: "paramedic-glossary-triage", title: "Triage", metaTitle: "Triage Definition | Paramedic Glossary | NurseNest", metaDescription: "Triage definition, START algorithm, triage categories, and mass casualty incident application for paramedic certification exam preparation.", pageType: "glossary", exam: "NREMT",
    contentHtml: `<article><h1>Triage</h1><p>Triage is the process of sorting patients by severity and treatment priority, particularly during mass casualty incidents (MCI). The START (Simple Triage and Rapid Treatment) algorithm is the most widely used prehospital MCI triage system. It uses RPM: can they walk? (Yes = Minor/Green). Not walking: assess Respirations (> 30/min or absent after repositioning = Immediate/Red), Perfusion (cap refill > 2 sec or no radial pulse = Immediate/Red), Mental status (cannot follow commands = Immediate/Red). If none of these triggers are met = Delayed/Yellow. No respirations after airway opening = Deceased/Black. JumpSTART is the pediatric version (ages 1-8). Categories: Immediate (Red) — life-threatening but survivable with immediate intervention; Delayed (Yellow) — serious but can wait; Minor (Green) — walking wounded; Deceased/Expectant (Black) — dead or unsurvivable. Triage takes 30-60 seconds per patient.</p></article>`,
    tocJson: [], faqJson: [{ question: "How long should triage take per patient?", answer: "30-60 seconds maximum. Triage is a rapid sorting process, not a thorough assessment. The goal is to categorize as many patients as possible in the shortest time to direct resources to those who will benefit most." }, { question: "What is the first step in START triage?", answer: "Ask all patients to walk to a designated area. Those who can walk are tagged Minor (Green). This instantly sorts the least critical patients. Then systematically assess remaining patients using RPM (Respirations, Perfusion, Mental status)." }], internalLinksJson: [] },
  { slug: "paramedic-glossary-tourniquet", title: "Tourniquet", metaTitle: "Tourniquet Definition | Paramedic Glossary | NurseNest", metaDescription: "Tourniquet definition, application technique, indications, and prehospital hemorrhage control for paramedic certification exam preparation.", pageType: "glossary", exam: "NREMT",
    contentHtml: `<article><h1>Tourniquet</h1><p>A tourniquet is a constricting device applied to an extremity to control life-threatening hemorrhage by occluding arterial blood flow distal to the device. Modern EMS tourniquets (CAT, SOFTT-W, SAM XT) are designed for rapid single-handed application. Indication: life-threatening extremity hemorrhage that cannot be controlled with direct pressure. Application: place 2-3 inches proximal to the wound (high and tight), tighten until bleeding stops, secure the windlass, note the time. Do NOT remove in the prehospital setting once applied. Studies from military and civilian trauma show that early tourniquet application significantly reduces mortality from extremity hemorrhage. Safe application time is at least 2 hours with minimal risk of complications. The Hartford Consensus recommends tourniquet application as the first intervention in active hemorrhage, even before airway management (the X in XABCDE).</p></article>`,
    tocJson: [], faqJson: [{ question: "How long can a tourniquet stay on?", answer: "At least 2 hours with minimal risk of complications. Extended application beyond 6 hours increases the risk of nerve damage and limb ischemia. In the prehospital setting, the benefit of hemorrhage control almost always outweighs the risks." }, { question: "Should you apply two tourniquets?", answer: "Yes, if bleeding is not controlled with one tourniquet, apply a second tourniquet proximal to the first. Large extremities (thighs) may require two tourniquets. Always reassess after application to ensure bleeding has stopped." }], internalLinksJson: [] },
  { slug: "paramedic-glossary-rosc", title: "ROSC (Return of Spontaneous Circulation)", metaTitle: "ROSC Definition | Paramedic Glossary | NurseNest", metaDescription: "Return of spontaneous circulation definition, recognition signs, post-ROSC care, and clinical significance for paramedic certification exam preparation.", pageType: "glossary", exam: "NREMT",
    contentHtml: `<article><h1>ROSC (Return of Spontaneous Circulation)</h1><p>Return of spontaneous circulation (ROSC) is the resumption of sustained cardiac mechanical activity sufficient to generate a palpable pulse after cardiac arrest. Signs of ROSC include: palpable pulse, sudden sustained rise in ETCO2 above 40 mmHg (often the earliest indicator, detected before pulse), purposeful movement, spontaneous breathing, and measurable blood pressure. Post-ROSC care is critical and includes: optimize oxygenation (SpO2 94-99%, avoid hyperoxia), maintain blood pressure (SBP > 90 mmHg, vasopressors if needed), obtain 12-lead ECG (treat STEMI with emergent PCI), avoid hyperventilation (target ETCO2 35-45 mmHg), targeted temperature management (32-36°C per protocol), and continuous cardiac monitoring. The post-arrest syndrome involves myocardial stunning, systemic inflammation, and ongoing brain injury — all requiring careful management during transport.</p></article>`,
    tocJson: [], faqJson: [{ question: "What is the earliest sign of ROSC?", answer: "A sudden sustained rise in ETCO2 above 40 mmHg during CPR. This occurs because restored cardiac output delivers CO2 to the lungs. ETCO2 often rises before a pulse becomes palpable." }, { question: "What is targeted temperature management after ROSC?", answer: "Maintaining core body temperature at 32-36°C for 24 hours after ROSC to reduce brain injury. In the prehospital setting, avoid active warming and consider cold saline if protocol allows. Do not actively cool below 32°C." }], internalLinksJson: [] },
  { slug: "paramedic-glossary-pneumothorax", title: "Pneumothorax", metaTitle: "Pneumothorax Definition | Paramedic Glossary | NurseNest", metaDescription: "Pneumothorax definition, types, recognition, and prehospital management including needle decompression for paramedic certification exam preparation.", pageType: "glossary", exam: "NREMT",
    contentHtml: `<article><h1>Pneumothorax</h1><p>A pneumothorax is the presence of air in the pleural space causing partial or complete lung collapse. Types: simple pneumothorax (air leak without tension — chest pain, dyspnea, decreased breath sounds unilaterally), tension pneumothorax (one-way valve effect, air accumulates with each breath — progressively worsening dyspnea, hypotension, JVD, tracheal deviation away from affected side, absent breath sounds, cyanosis), and open pneumothorax (sucking chest wound — air enters through chest wall defect). Tension pneumothorax is immediately life-threatening and requires needle decompression: 14-gauge IV catheter at the 2nd intercostal space midclavicular line (or 5th ICS anterior axillary line), inserted over the top of the rib to avoid the neurovascular bundle. Open pneumothorax: apply a vented chest seal (commercial device or three-sided occlusive dressing) allowing air out but not in. Monitor for tension pneumothorax development after sealing.</p></article>`,
    tocJson: [], faqJson: [{ question: "What are the classic signs of tension pneumothorax?", answer: "JVD, absent breath sounds on the affected side, tracheal deviation AWAY from the affected side (late sign), hypotension, tachycardia, and severe respiratory distress. Tracheal deviation is often a late finding — do not wait for it to treat." }, { question: "What gauge needle is used for decompression?", answer: "14-gauge (or larger) IV catheter, at least 3.25 inches (8 cm) long. Insert at the 2nd intercostal space, midclavicular line, above the rib to avoid intercostal vessels and nerves that run along the inferior border of each rib." }], internalLinksJson: [] },
  { slug: "paramedic-glossary-sepsis", title: "Sepsis", metaTitle: "Sepsis Definition | Paramedic Glossary | NurseNest", metaDescription: "Sepsis definition, recognition criteria, prehospital assessment, and early management for paramedic certification exam preparation.", pageType: "glossary", exam: "NREMT",
    contentHtml: `<article><h1>Sepsis</h1><p>Sepsis is a life-threatening organ dysfunction caused by a dysregulated host response to infection. It progresses through a continuum: infection → sepsis → severe sepsis → septic shock. Prehospital recognition criteria (qSOFA): respiratory rate ≥ 22, altered mental status, systolic blood pressure ≤ 100 mmHg — two or more criteria suggest sepsis. Common sources: pneumonia, urinary tract infection, abdominal infection, skin/soft tissue infection. Presentation varies: early sepsis may have warm flushed skin (vasodilation), tachycardia, fever, and tachypnea. Late/septic shock has cold mottled skin, hypotension refractory to fluid boluses, and altered mental status. Prehospital management: high-flow oxygen, IV fluid resuscitation (30 mL/kg NS bolus for hypotension), obtain blood glucose, maintain warmth, rapid transport. Early recognition and hospital notification significantly improve survival — sepsis mortality increases approximately 8% for each hour of delayed antibiotic administration.</p></article>`,
    tocJson: [], faqJson: [{ question: "What is the difference between sepsis and septic shock?", answer: "Sepsis is organ dysfunction from infection. Septic shock is sepsis with persistent hypotension requiring vasopressors despite adequate fluid resuscitation, and lactate > 2 mmol/L. Septic shock has mortality rates of 40-50%." }, { question: "What are the qSOFA criteria?", answer: "Quick Sequential Organ Failure Assessment: RR ≥ 22, altered mental status (GCS < 15), SBP ≤ 100 mmHg. Two or more criteria in a patient with suspected infection suggests sepsis and warrants aggressive treatment and rapid transport." }], internalLinksJson: [] },
];

export const comparisonPages: ParamedicSeoPage[] = [
  { slug: "paramedic-opa-vs-npa-comparison", title: "OPA vs NPA: Complete Comparison for Paramedics", metaTitle: "OPA vs NPA Comparison | Paramedic Guide | NurseNest", metaDescription: "Detailed comparison of oropharyngeal vs nasopharyngeal airways including indications, contraindications, sizing, and insertion techniques for paramedic certification.", pageType: "comparison", exam: "NREMT",
    contentHtml: `<article><h1>OPA vs NPA: Complete Comparison</h1>
<section id="quick-diff"><h2>Quick Differences</h2><p>OPA: rigid plastic, unconscious patients only, no gag reflex, measured mouth-to-ear, rotated on insertion in adults. NPA: soft rubber, tolerated in semiconscious patients, gag reflex okay, measured nose-to-ear, contraindicated in basilar skull fracture.</p></section>
<section id="table"><h2>Comparison Table</h2>
<table><tr><th>Feature</th><th>OPA</th><th>NPA</th></tr>
<tr><td>Material</td><td>Rigid plastic</td><td>Soft rubber/silicone</td></tr>
<tr><td>Consciousness</td><td>Unconscious only</td><td>Semiconscious or unconscious</td></tr>
<tr><td>Gag reflex</td><td>Must be absent</td><td>Can be intact</td></tr>
<tr><td>Sizing</td><td>Corner of mouth to earlobe</td><td>Tip of nose to earlobe</td></tr>
<tr><td>Insertion</td><td>Rotate 180° in adults</td><td>Bevel toward septum, along nasal floor</td></tr>
<tr><td>Contraindication</td><td>Intact gag reflex</td><td>Basilar skull fracture</td></tr>
<tr><td>Pediatric difference</td><td>No rotation — insert tongue-side down with depressor</td><td>Same technique as adult, smaller sizes</td></tr></table></section>
<section id="assessment"><h2>Assessment Differences</h2><p>Before placing an OPA, check for gag reflex by gently depressing the tongue — if the patient gags, use an NPA instead. Before placing an NPA, assess for signs of basilar skull fracture: Battle's sign (mastoid bruising), raccoon eyes (periorbital bruising), CSF rhinorrhea or otorrhea, and hemotympanum. Both devices prevent tongue obstruction but neither protects against aspiration.</p></section>
<section id="treatment"><h2>Treatment Differences</h2><p>OPA is faster to insert and provides a more rigid airway channel, making it better for BVM ventilation in deeply unconscious patients. NPA is better tolerated, can be used in trismus (clenched jaw) or oral trauma, and works well for patients who are semiconscious. Both devices can be used simultaneously for optimal airway patency.</p></section>
<section id="exam"><h2>Exam Trick Points</h2><p>The most common exam trick: OPA in a patient who gags = wrong answer. NPA in suspected basilar skull fracture = wrong answer. Using both together in a deeply unconscious patient = acceptable and often tested as a correct answer. Pediatric OPA insertion without rotation = must know.</p></section></article>`,
    tocJson: [{ id: "quick-diff", label: "Quick Differences", level: 2 }, { id: "table", label: "Comparison Table", level: 2 }, { id: "assessment", label: "Assessment Differences", level: 2 }, { id: "treatment", label: "Treatment Differences", level: 2 }, { id: "exam", label: "Exam Trick Points", level: 2 }],
    faqJson: [{ question: "Can you use OPA and NPA together?", answer: "Yes. In deeply unconscious patients, using both can provide optimal airway patency and improve BVM ventilation effectiveness." }, { question: "Which is used more commonly in EMS?", answer: "NPA is generally more commonly used because it is better tolerated across a wider range of consciousness levels and has fewer contraindications in practice." }, { question: "What happens if an OPA is too big?", answer: "A too-large OPA can push the epiglottis over the glottic opening, actually worsening airway obstruction. Always measure carefully before insertion." }, { question: "Can NPA cause nosebleeds?", answer: "Yes. Epistaxis is a common complication of NPA insertion. Lubricate well and advance gently along the floor of the nasal cavity. If significant bleeding occurs, consider using the other nostril or switching to an OPA if appropriate." }],
    internalLinksJson: [] },
  { slug: "paramedic-hypovolemic-vs-cardiogenic-shock", title: "Hypovolemic vs Cardiogenic Shock: Paramedic Comparison", metaTitle: "Hypovolemic vs Cardiogenic Shock | Paramedic Guide | NurseNest", metaDescription: "Compare hypovolemic and cardiogenic shock assessment findings, pathophysiology, and prehospital management for paramedic certification exam preparation.", pageType: "comparison", exam: "NREMT",
    contentHtml: `<article><h1>Hypovolemic vs Cardiogenic Shock</h1>
<section id="quick-diff"><h2>Quick Differences</h2><p>Hypovolemic: volume loss (hemorrhage, dehydration), flat neck veins, clear lungs, tachycardia, responds to fluid. Cardiogenic: pump failure (MI, cardiomyopathy), JVD, pulmonary edema (crackles), tachycardia, may worsen with excessive fluid.</p></section>
<section id="table"><h2>Comparison Table</h2>
<table><tr><th>Feature</th><th>Hypovolemic</th><th>Cardiogenic</th></tr>
<tr><td>Cause</td><td>Volume loss</td><td>Pump failure</td></tr>
<tr><td>JVD</td><td>Flat neck veins</td><td>Distended (JVD present)</td></tr>
<tr><td>Lungs</td><td>Clear</td><td>Crackles/rales (pulmonary edema)</td></tr>
<tr><td>Skin</td><td>Cool, pale, diaphoretic</td><td>Cool, pale, diaphoretic</td></tr>
<tr><td>Heart Rate</td><td>Tachycardia</td><td>Tachycardia (may be bradycardia in MI)</td></tr>
<tr><td>Fluid response</td><td>Improves with fluids</td><td>May worsen with fluids</td></tr>
<tr><td>Primary treatment</td><td>Hemorrhage control + IV fluids</td><td>Vasopressors, treat underlying cause</td></tr></table></section>
<section id="assessment"><h2>Assessment Differences</h2><p>The key differentiating findings: neck veins and lung sounds. Hypovolemic shock has flat neck veins (not enough volume to distend them) and clear lungs. Cardiogenic shock has JVD (blood backing up behind the failing pump) and crackles (pulmonary edema from left heart failure). Both present with hypotension, tachycardia, and cool pale skin.</p></section>
<section id="treatment"><h2>Treatment Differences</h2><p>Hypovolemic: control hemorrhage, IV NS bolus 500 mL-1 L (permissive hypotension in penetrating trauma), TXA within 3 hours, keep warm. Cardiogenic: cautious fluid (small 250 mL bolus, reassess for worsening pulmonary edema), vasopressor support (dopamine or norepinephrine), treat underlying cause (STEMI → rapid transport to PCI). Giving large fluid volumes to a cardiogenic shock patient worsens pulmonary edema.</p></section>
<section id="exam"><h2>Exam Trick Points</h2><p>Classic exam scenario: hypotensive patient after chest pain — look for JVD and lung crackles to identify cardiogenic shock. Hypotensive trauma patient with flat neck veins = hypovolemic. The exception: tension pneumothorax has JVD but is obstructive shock, not cardiogenic — differentiate by absent breath sounds unilaterally.</p></section></article>`,
    tocJson: [{ id: "quick-diff", label: "Quick Differences", level: 2 }, { id: "table", label: "Comparison Table", level: 2 }, { id: "assessment", label: "Assessment Differences", level: 2 }, { id: "treatment", label: "Treatment Differences", level: 2 }, { id: "exam", label: "Exam Trick Points", level: 2 }],
    faqJson: [{ question: "What is the most important differentiating sign?", answer: "Jugular venous distension (JVD). Flat neck veins = not enough volume (hypovolemic). Distended neck veins = fluid backing up (cardiogenic or obstructive). Combined with lung sounds: crackles = cardiogenic, clear = hypovolemic." }, { question: "Can a patient have both types simultaneously?", answer: "Yes. For example, a patient with an MI (cardiogenic) who is also on anticoagulants and develops GI bleeding (hypovolemic) would have mixed shock. Treatment must address both causes." }, { question: "Why can fluids worsen cardiogenic shock?", answer: "The heart is already failing as a pump. Adding more fluid increases preload, worsening pulmonary edema and further stretching the failing ventricle (past the benefit of the Frank-Starling mechanism)." }, { question: "What vasopressor is used for cardiogenic shock?", answer: "Dopamine 5-20 mcg/kg/min or norepinephrine 0.1-0.5 mcg/kg/min. These increase blood pressure through vasoconstriction and improve cardiac contractility. Dobutamine may be added for inotropic support if blood pressure is adequate." }],
    internalLinksJson: [] },
  { slug: "paramedic-svt-vs-vt", title: "SVT vs VT: Paramedic ECG Comparison", metaTitle: "SVT vs VT Comparison | Paramedic Guide | NurseNest", metaDescription: "Compare supraventricular tachycardia and ventricular tachycardia ECG findings, assessment, and prehospital management for paramedic certification exams.", pageType: "comparison", exam: "NREMT",
    contentHtml: `<article><h1>SVT vs VT: ECG Comparison for Paramedics</h1>
<section id="quick-diff"><h2>Quick Differences</h2><p>SVT: narrow QRS (< 0.12 sec), regular, rate 150-250 bpm, usually hemodynamically stable initially, treat with adenosine. VT: wide QRS (> 0.12 sec), may be regular or irregular, rate 100-250 bpm, higher risk of instability, treat with amiodarone or cardioversion.</p></section>
<section id="table"><h2>Comparison Table</h2>
<table><tr><th>Feature</th><th>SVT</th><th>VT</th></tr>
<tr><td>QRS Width</td><td>Narrow (< 0.12 sec)</td><td>Wide (> 0.12 sec)</td></tr>
<tr><td>Rate</td><td>150-250 bpm</td><td>100-250 bpm</td></tr>
<tr><td>P Waves</td><td>Usually not visible (buried in QRS/T)</td><td>AV dissociation (P waves march independently)</td></tr>
<tr><td>Regularity</td><td>Regular</td><td>Usually regular (monomorphic) or irregular (polymorphic)</td></tr>
<tr><td>Stability</td><td>Often hemodynamically stable</td><td>Higher risk of instability or arrest</td></tr>
<tr><td>1st Line Treatment</td><td>Vagal maneuvers → Adenosine</td><td>Amiodarone (stable) or Cardioversion (unstable)</td></tr></table></section>
<section id="critical"><h2>Critical Rule</h2><p>When in doubt whether a wide-complex tachycardia is SVT with aberrancy or VT, treat as VT. This is safer — treating VT as SVT (giving adenosine for what is actually VT) can cause deterioration. Treating SVT as VT (amiodarone or cardioversion) is less likely to cause harm.</p></section>
<section id="treatment"><h2>Treatment Differences</h2><p>Stable narrow-complex SVT: vagal maneuvers first (Valsalva, modified Valsalva, carotid sinus massage), then adenosine 6 mg rapid IV push with 20 mL flush, then 12 mg if needed. Stable wide-complex (presumed VT): amiodarone 150 mg IV over 10 minutes. Unstable (either type): synchronized cardioversion — 50-100 J for narrow regular, 100 J for wide regular.</p></section></article>`,
    tocJson: [{ id: "quick-diff", label: "Quick Differences", level: 2 }, { id: "table", label: "Comparison Table", level: 2 }, { id: "critical", label: "Critical Rule", level: 2 }, { id: "treatment", label: "Treatment Differences", level: 2 }],
    faqJson: [{ question: "What is the safest approach to wide-complex tachycardia?", answer: "Treat it as VT until proven otherwise. VT is more dangerous and more common than SVT with aberrancy. Treating as VT (amiodarone, cardioversion) is safer than mistakenly giving adenosine for actual VT." }, { question: "Can adenosine be given for wide-complex tachycardia?", answer: "It can be considered for regular wide-complex tachycardia if the rhythm is strongly suspected to be SVT with aberrant conduction (known bundle branch block). However, this should only be done by experienced providers with defibrillation immediately available." }, { question: "What are vagal maneuvers?", answer: "Techniques that stimulate the vagus nerve to slow AV conduction: Valsalva maneuver (bearing down against a closed glottis), modified Valsalva (strain then leg elevation), and carotid sinus massage (contraindicated with carotid bruit). These can terminate reentrant SVT by briefly blocking AV node conduction." }, { question: "What happens if SVT does not respond to adenosine?", answer: "Consider the diagnosis may be wrong (could be atrial flutter, atrial tachycardia, or VT). Ensure adenosine was given rapidly through a proximal IV with a large flush. If confirmed SVT and 2 doses of 12 mg fail, consider calcium channel blockers (diltiazem) or synchronized cardioversion." }],
    internalLinksJson: [] },
  { slug: "paramedic-bls-vs-advanced-airway", title: "BLS vs Advanced Airway: Paramedic Comparison", metaTitle: "BLS vs Advanced Airway | Paramedic Guide | NurseNest", metaDescription: "Compare basic life support airway techniques with advanced airway management including indications, outcomes, and decision-making for paramedic certification.", pageType: "comparison", exam: "NREMT",
    contentHtml: `<article><h1>BLS vs Advanced Airway Management</h1>
<section id="quick-diff"><h2>Quick Differences</h2><p>BLS airway: manual maneuvers, OPA/NPA, BVM — available immediately, no medications needed, any provider can perform. Advanced airway: supraglottic devices, ETT, surgical airway — requires equipment, training, often medications, and carries higher complication risk.</p></section>
<section id="table"><h2>Comparison Table</h2>
<table><tr><th>Feature</th><th>BLS Airway</th><th>Advanced Airway</th></tr>
<tr><td>Techniques</td><td>Head-tilt chin-lift, jaw thrust, OPA, NPA, BVM</td><td>King LT, i-gel, LMA, ETT, cricothyrotomy</td></tr>
<tr><td>Aspiration protection</td><td>No</td><td>ETT provides aspiration protection; SGAs provide some</td></tr>
<tr><td>Setup time</td><td>Immediate</td><td>30-60 seconds for SGA; 60+ seconds for ETT</td></tr>
<tr><td>Skill level</td><td>EMT and above</td><td>AEMT/Paramedic</td></tr>
<tr><td>Confirmation</td><td>Visual chest rise, auscultation</td><td>Waveform capnography (mandatory)</td></tr>
<tr><td>Complications</td><td>Gastric distension, air leak</td><td>Esophageal intubation, right mainstem, trauma</td></tr></table></section>
<section id="when"><h2>When to Escalate</h2><p>Escalate from BLS to advanced airway when: BVM cannot maintain oxygenation (SpO2 < 90%), the patient cannot protect their own airway (GCS ≤ 8), prolonged ventilation is anticipated, or high aspiration risk is present. However, BVM ventilation should never be abandoned — it is always the fallback when advanced airway attempts fail.</p></section>
<section id="evidence"><h2>Current Evidence</h2><p>Recent evidence (PART trial, AIRWAYS-2) suggests that supraglottic airways provide outcomes comparable to ETT in out-of-hospital cardiac arrest, with higher first-pass success rates. Many EMS systems now use SGAs as the primary advanced airway for cardiac arrest. ETT remains preferred for cases requiring precise ventilatory control or high aspiration risk.</p></section></article>`,
    tocJson: [{ id: "quick-diff", label: "Quick Differences", level: 2 }, { id: "table", label: "Comparison Table", level: 2 }, { id: "when", label: "When to Escalate", level: 2 }, { id: "evidence", label: "Current Evidence", level: 2 }],
    faqJson: [{ question: "Is BVM ventilation sufficient for most patients?", answer: "Yes. Properly performed BVM ventilation, especially two-rescuer technique, can maintain adequate oxygenation and ventilation for the vast majority of patients. It should never be skipped in favor of advanced airway placement." }, { question: "Are supraglottic airways replacing ETT in EMS?", answer: "In many systems, yes, particularly for cardiac arrest. SGAs have higher first-pass success rates, require less training to maintain competency, and recent evidence shows comparable patient outcomes. ETT remains important for specific situations requiring definitive airway control." }, { question: "What is the biggest risk of advanced airway placement?", answer: "Unrecognized esophageal intubation — placing an ETT in the esophagus instead of the trachea. This is why waveform capnography confirmation is mandatory. Without confirmation, an unrecognized esophageal intubation is fatal." }, { question: "When is a surgical airway (cricothyrotomy) indicated?", answer: "Only when all other airway management techniques have failed (cannot intubate, cannot ventilate with BVM or SGA). This is a rare, last-resort procedure. Common scenarios: massive facial trauma, severe angioedema, or complete upper airway obstruction." }],
    internalLinksJson: [] },
  { slug: "paramedic-stable-vs-unstable-tachycardia", title: "Stable vs Unstable Tachycardia: Paramedic Comparison", metaTitle: "Stable vs Unstable Tachycardia | Paramedic Guide | NurseNest", metaDescription: "Compare stable and unstable tachycardia assessment, clinical significance, and prehospital treatment protocols for paramedic certification exams.", pageType: "comparison", exam: "NREMT",
    contentHtml: `<article><h1>Stable vs Unstable Tachycardia</h1>
<section id="quick-diff"><h2>Quick Differences</h2><p>Stable tachycardia: patient is awake, adequate blood pressure, no signs of poor perfusion — treat with medications and monitoring. Unstable tachycardia: signs of hemodynamic compromise directly caused by the tachycardia — treat immediately with synchronized cardioversion.</p></section>
<section id="table"><h2>Comparison Table</h2>
<table><tr><th>Feature</th><th>Stable</th><th>Unstable</th></tr>
<tr><td>Mental Status</td><td>Alert, oriented</td><td>Altered, confused, or unresponsive</td></tr>
<tr><td>Blood Pressure</td><td>Adequate</td><td>Hypotensive (SBP < 90 mmHg)</td></tr>
<tr><td>Chest Pain</td><td>None or mild</td><td>Ischemic chest pain present</td></tr>
<tr><td>Heart Failure Signs</td><td>None</td><td>Acute pulmonary edema, JVD</td></tr>
<tr><td>Treatment Approach</td><td>Medication-first (adenosine, amiodarone)</td><td>Synchronized cardioversion immediately</td></tr></table></section>
<section id="assessment"><h2>Assessment: How to Determine Stability</h2><p>Four signs that indicate the tachycardia is unstable: (1) Hypotension or shock, (2) Acute altered mental status, (3) Signs of acute heart failure (pulmonary edema), (4) Ischemic chest pain. The key question is: are these signs caused BY the tachycardia, or does the patient simply have tachycardia alongside another condition? Sinus tachycardia from sepsis, for example, does not benefit from cardioversion.</p></section>
<section id="treatment"><h2>Treatment Pathways</h2><p>Stable narrow regular: vagal maneuvers → adenosine 6 mg → 12 mg → cardioversion if refractory. Stable narrow irregular (AF/flutter): rate control (diltiazem, beta-blockers). Stable wide regular (presumed VT): amiodarone 150 mg IV over 10 min. Unstable (any type with pulse): immediate synchronized cardioversion with sedation if time allows.</p></section></article>`,
    tocJson: [{ id: "quick-diff", label: "Quick Differences", level: 2 }, { id: "table", label: "Comparison Table", level: 2 }, { id: "assessment", label: "Stability Assessment", level: 2 }, { id: "treatment", label: "Treatment Pathways", level: 2 }],
    faqJson: [{ question: "What makes tachycardia 'unstable'?", answer: "Four signs: hypotension, altered mental status, signs of acute heart failure (pulmonary edema), and ischemic chest pain. These must be CAUSED BY the tachycardia, not just coincidentally present." }, { question: "Should you always cardiovert unstable tachycardia?", answer: "Yes — for tachyarrhythmias causing instability. However, sinus tachycardia should NOT be cardioverted as it is a compensatory response (to pain, hypovolemia, sepsis, etc.). Treat the underlying cause instead." }, { question: "Do you sedate before cardioversion?", answer: "If the patient is conscious and time allows, provide sedation (midazolam, etomidate, or ketamine). Cardioversion is painful. However, in true hemodynamic emergency, do not delay cardioversion for sedation — the shock takes priority." }, { question: "What energy level for synchronized cardioversion?", answer: "Narrow regular (SVT): 50-100 J. Narrow irregular (A-fib): 120-200 J biphasic. Wide regular (VT): 100 J. If initial dose fails, escalate energy. Always ensure the sync button is activated — accidental unsynchronized shock can trigger VF." }],
    internalLinksJson: [] },
  { slug: "paramedic-compensated-vs-decompensated-shock", title: "Compensated vs Decompensated Shock: Paramedic Comparison", metaTitle: "Compensated vs Decompensated Shock | Paramedic Guide | NurseNest", metaDescription: "Compare compensated and decompensated shock assessment findings, significance, and prehospital management for paramedic certification exam preparation.", pageType: "comparison", exam: "NREMT",
    contentHtml: `<article><h1>Compensated vs Decompensated Shock</h1>
<section id="quick-diff"><h2>Quick Differences</h2><p>Compensated: the body is maintaining blood pressure through sympathetic activation — tachycardia and vasoconstriction mask the volume loss. Blood pressure may appear normal. Decompensated: compensatory mechanisms are failing — hypotension, altered mental status, and organ dysfunction appear. Mortality increases dramatically.</p></section>
<section id="table"><h2>Comparison Table</h2>
<table><tr><th>Feature</th><th>Compensated Shock</th><th>Decompensated Shock</th></tr>
<tr><td>Blood Pressure</td><td>Normal or slightly low</td><td>Hypotensive (SBP < 90 mmHg)</td></tr>
<tr><td>Heart Rate</td><td>Tachycardia (earliest sign)</td><td>Tachycardia or bradycardia (terminal)</td></tr>
<tr><td>Mental Status</td><td>Anxious, restless</td><td>Confused, lethargic, unresponsive</td></tr>
<tr><td>Skin</td><td>Cool, pale, slight diaphoresis</td><td>Mottled, cyanotic, profusely diaphoretic</td></tr>
<tr><td>Capillary Refill</td><td>Slightly delayed (2-4 sec)</td><td>Markedly delayed (> 4 sec) or absent</td></tr>
<tr><td>Urine Output</td><td>Decreased</td><td>Minimal or absent</td></tr>
<tr><td>Pulse Pressure</td><td>Narrowed</td><td>Very narrow or undetectable</td></tr></table></section>
<section id="significance"><h2>Clinical Significance</h2><p>Recognizing compensated shock is the key paramedic skill — once decompensation occurs, mortality increases significantly. A patient with normal blood pressure but tachycardia, cool pale skin, and anxiety may have lost 15-30% of blood volume. Wait for hypotension and you have waited too long. The Shock Index (HR/SBP) > 1.0 can detect compensated shock before traditional vital signs become abnormal.</p></section>
<section id="management"><h2>Management Priorities</h2><p>Compensated shock: treat NOW to prevent decompensation — control hemorrhage, establish IV access, fluid resuscitation, keep warm, rapid transport. Do not be reassured by a normal blood pressure. Decompensated shock: aggressive intervention — maximum hemorrhage control, bilateral large-bore IVs, rapid fluid boluses, vasopressors if fluid-refractory, rapid transport to definitive care. Consider blood products if available.</p></section></article>`,
    tocJson: [{ id: "quick-diff", label: "Quick Differences", level: 2 }, { id: "table", label: "Comparison Table", level: 2 }, { id: "significance", label: "Clinical Significance", level: 2 }, { id: "management", label: "Management Priorities", level: 2 }],
    faqJson: [{ question: "How do you detect compensated shock?", answer: "Look for subtle signs: unexplained tachycardia, narrowed pulse pressure, cool pale skin, anxiety/restlessness, and delayed capillary refill. The Shock Index (HR/SBP > 1.0) is a useful tool. Do not wait for hypotension — that means decompensation has already occurred." }, { question: "Can blood pressure be normal in shock?", answer: "Yes — in compensated shock, vasoconstriction and tachycardia maintain blood pressure despite significant volume loss. A healthy young adult can lose 30% of blood volume before becoming hypotensive. This is why tachycardia and clinical assessment are more important than BP alone." }, { question: "What happens in irreversible shock?", answer: "Beyond decompensation, irreversible shock involves widespread cellular death and organ failure. Blood pressure is profoundly low and unresponsive to treatment, metabolic acidosis is severe, and multiorgan failure develops. Mortality approaches 100% regardless of intervention." }, { question: "Is compensated shock in children different?", answer: "Children compensate more effectively than adults and can maintain blood pressure with up to 40% blood loss. However, they decompensate suddenly and catastrophically. Tachycardia and behavioral changes (irritability, drowsiness) are the earliest signs in pediatric patients." }],
    internalLinksJson: [] },
];

export const studyGuidePages: ParamedicSeoPage[] = [
  { slug: "paramedic-airway-management-study-guide", title: "Paramedic Airway Management: Complete Study Guide", metaTitle: "Airway Management Study Guide | Paramedic Exam Prep | NurseNest", metaDescription: "Comprehensive paramedic airway management study guide with assessment checklists, intervention pathways, device comparisons, and exam tips for NREMT and provincial exams.", pageType: "study-guide", exam: "NREMT",
    contentHtml: `<article><h1>Paramedic Airway Management: Complete Study Guide</h1>
<section id="summary"><h2>High-Yield Summary</h2><p>Airway management is the most tested topic in paramedic certification exams. Master these core concepts: LEMON assessment for difficult airway prediction, OPA vs NPA selection criteria, BVM technique (C-E clamp, 500-600 mL, 1-second breath), supraglottic airway as first-line advanced airway in cardiac arrest, ETT confirmation with waveform capnography (gold standard), RSI pharmacology (induction agents + paralytics), and the failed airway algorithm.</p></section>
<section id="checklist"><h2>Assessment Checklist</h2><p>1. Is the airway patent? (Look, listen, feel). 2. Are there immediate threats? (Blood, vomitus, foreign body, edema). 3. Can the patient maintain their own airway? (GCS, gag reflex). 4. Is the airway predicted to be difficult? (LEMON assessment). 5. What level of airway management is needed? (Basic maneuver → adjunct → BVM → advanced → surgical). 6. Is confirmation in place? (Capnography for all advanced airways).</p></section>
<section id="pathways"><h2>Intervention Pathways</h2><p>Conscious, maintaining airway → positioning + supplemental O2. Unconscious, no gag → OPA + BVM. Semiconscious, intact gag → NPA + supplemental O2. Cardiac arrest → BVM initially → supraglottic airway or ETT with continuous CPR. Failed BVM → supraglottic airway. Failed SGA → ETT. Failed ETT → surgical cricothyrotomy (cannot intubate, cannot ventilate).</p></section>
<section id="self-test"><h2>Quick Self-Test</h2><p>1. What is the contraindication for NPA? (Basilar skull fracture) 2. What is the gold standard for ETT confirmation? (Waveform capnography) 3. What BVM rate during CPR with advanced airway? (10/min) 4. What is the OPA sizing landmark? (Corner of mouth to earlobe) 5. Name two RSI induction agents. (Ketamine 1-2 mg/kg, etomidate 0.3 mg/kg) 6. When do you perform a surgical airway? (Cannot intubate, cannot ventilate)</p></section>
<section id="tips"><h2>Practical Exam Tips</h2><p>On practical exams: always verbalize BSI/scene safety first. Size and confirm adjuncts before insertion. During BVM skill, demonstrate two-rescuer technique if given the option. For intubation: preoxygenate, confirm placement with capnography, and secure the tube. State chest rise observed. Note tube depth at teeth. Always have suction ready and accessible.</p></section></article>`,
    tocJson: [{ id: "summary", label: "High-Yield Summary", level: 2 }, { id: "checklist", label: "Assessment Checklist", level: 2 }, { id: "pathways", label: "Intervention Pathways", level: 2 }, { id: "self-test", label: "Quick Self-Test", level: 2 }, { id: "tips", label: "Practical Exam Tips", level: 2 }],
    faqJson: [{ question: "What is the single most important airway skill to master?", answer: "BVM ventilation. It is the most frequently used ventilation technique, the foundation for all other airway management, and the fallback when advanced airways fail. Two-rescuer technique with proper mask seal is essential." }, { question: "How do you prepare for the NREMT airway practical?", answer: "Practice the full sequence: BSI, scene safety, assess airway, select and size adjunct, demonstrate proper insertion, connect BVM to O2, show proper seal technique, ventilate at correct rate, verbalize assessment of effectiveness. Time management is critical." }, { question: "What are the most commonly missed points on airway skills testing?", answer: "Failing to verbalize BSI/scene safety, incorrect adjunct sizing, not demonstrating capnography confirmation after advanced airway, hyperventilating during CPR, and failing to state the assessment of effectiveness (chest rise, SpO2, ETCO2)." }, { question: "How often should airway skills be practiced?", answer: "Monthly practice with manikins is recommended to maintain proficiency. Intubation skills degrade rapidly without practice — studies show that paramedics need at least 10-12 successful intubations per year to maintain competency." }],
    internalLinksJson: [] },
  { slug: "paramedic-trauma-assessment-study-guide", title: "Paramedic Trauma Assessment: Complete Study Guide", metaTitle: "Trauma Assessment Study Guide | Paramedic Exam Prep | NurseNest", metaDescription: "Comprehensive paramedic trauma assessment study guide covering XABCDE, hemorrhage control, field triage, and critical transport decisions for certification exams.", pageType: "study-guide", exam: "NREMT",
    contentHtml: `<article><h1>Paramedic Trauma Assessment: Complete Study Guide</h1>
<section id="summary"><h2>High-Yield Summary</h2><p>Trauma assessment follows XABCDE. X (exsanguinating hemorrhage) before A (airway) reflects that massive bleeding kills faster than airway compromise. Primary survey under 90 seconds. Scene time under 10 minutes for critical patients. Permissive hypotension (SBP 80-90) for penetrating trauma. TXA within 3 hours. Prevent the lethal triad (hypothermia + acidosis + coagulopathy). Rapid transport to the highest appropriate trauma center.</p></section>
<section id="checklist"><h2>Assessment Checklist</h2><p>Scene: BSI, scene safety, MOI, number of patients, resources needed. X: massive hemorrhage → tourniquet or hemostatic packing. A: airway + C-spine → jaw thrust, OPA/NPA, suction. B: expose chest, auscultate, assess for pneumothorax/hemothorax. C: pulse quality, skin assessment, hemorrhage control, IV access, fluids. D: GCS (E+V+M), pupils, glucose. E: expose, assess all injuries, prevent hypothermia. Secondary: DCAP-BTLS head to toe. Vitals: q5min critical, q15min stable.</p></section>
<section id="pathways"><h2>Intervention Pathways</h2><p>Massive external hemorrhage → tourniquet (extremity) or hemostatic packing + pressure (junctional). Tension pneumothorax → needle decompression 2nd ICS MCL. Open pneumothorax → vented chest seal. Hemorrhagic shock → 2 large-bore IVs, NS bolus, TXA, permissive hypotension. Pelvic fracture → pelvic binder. TBI with herniation → intubation, maintain SBP > 90, ETCO2 35-45, controlled hyperventilation only if signs of herniation.</p></section>
<section id="self-test"><h2>Quick Self-Test</h2><p>1. What does the X in XABCDE stand for? (eXsanguinating hemorrhage) 2. What is the target SBP for permissive hypotension? (80-90 mmHg) 3. When must TXA be given? (Within 3 hours of injury) 4. What is the lethal triad? (Hypothermia, acidosis, coagulopathy) 5. How do you estimate SBP by pulse location? (Radial ~80, femoral ~70, carotid ~60) 6. What GCS indicates severe TBI? (≤ 8)</p></section></article>`,
    tocJson: [{ id: "summary", label: "High-Yield Summary", level: 2 }, { id: "checklist", label: "Assessment Checklist", level: 2 }, { id: "pathways", label: "Intervention Pathways", level: 2 }, { id: "self-test", label: "Quick Self-Test", level: 2 }],
    faqJson: [{ question: "What is the most important concept in prehospital trauma?", answer: "Minimize scene time and get the patient to definitive surgical care. Most life-threatening trauma injuries require surgical intervention that cannot be provided in the field. Perform only life-saving interventions on scene and treat en route." }, { question: "How do you study trauma algorithms effectively?", answer: "Walk through XABCDE step by step on every practice scenario. Use clinical simulation if available. Draw out the decision tree for each step. Practice tourniquet application until it's muscle memory. Review field triage criteria until you can apply them without thinking." }, { question: "What trauma topics are most heavily tested on NREMT?", answer: "XABCDE sequence and priority, tourniquet application, tension pneumothorax recognition and treatment, GCS calculation, hemorrhagic shock classification, TXA indications, and field triage decision-making. Scenario-based questions are common." }, { question: "How do you practice trauma skills?", answer: "Clinical simulation with high-fidelity manikins, scenario-based drills with partners, and reviewing real case studies. Focus on systematic approach and time management — speed with accuracy is the goal." }],
    internalLinksJson: [] },
  { slug: "paramedic-pharmacology-study-guide", title: "Paramedic Pharmacology: Complete Study Guide", metaTitle: "Pharmacology Study Guide | Paramedic Exam Prep | NurseNest", metaDescription: "Comprehensive paramedic pharmacology study guide covering ACLS drugs, RSI medications, analgesics, and dosage calculations for NREMT and provincial certification exams.", pageType: "study-guide", exam: "NREMT",
    contentHtml: `<article><h1>Paramedic Pharmacology: Complete Study Guide</h1>
<section id="summary"><h2>High-Yield Summary</h2><p>Essential drugs: Epinephrine (arrest: 1mg IV q3-5min; anaphylaxis: 0.3-0.5mg IM), Amiodarone (300mg then 150mg for refractory VF), Adenosine (6mg then 12mg rapid IV push for SVT), Atropine (1mg IV q3-5min max 3mg for bradycardia), Midazolam (10mg IM for seizures), Naloxone (0.4-2mg IV/IM/IN for opioid OD), Dextrose (25g D10W IV for hypoglycemia), Nitroglycerin (0.4mg SL q5min for chest pain), Aspirin (324mg chewed for ACS).</p></section>
<section id="drug-cards"><h2>Drug Quick Cards</h2><p>Epinephrine — class: sympathomimetic — MOA: alpha-1 vasoconstriction + beta-1 inotropy/chronotropy + beta-2 bronchodilation — arrest: 1mg IV q3-5min — anaphylaxis: 0.3-0.5mg IM — infusion: 2-10 mcg/min. Amiodarone — class: antiarrhythmic (class III) — MOA: Na/K/Ca channel blocker — arrest: 300mg IV first, 150mg second — stable VT: 150mg IV over 10 min — SE: hypotension, bradycardia. Adenosine — class: antiarrhythmic — MOA: AV node blocker — dose: 6mg rapid IV push + 20mL flush, then 12mg — must use proximal IV — half-life < 10 sec. Midazolam — class: benzodiazepine — MOA: GABA agonist — seizures: 10mg IM or 5mg IV — sedation: 1-2mg IV titrated. Naloxone — class: opioid antagonist — dose: 0.4-2mg IV/IM or 4mg IN — titrate to respiratory effort in dependent patients.</p></section>
<section id="calculations"><h2>Dosage Calculation Framework</h2><p>Weight-based: dose (mg) = weight (kg) × mg/kg. Concentration: mg/mL = total mg ÷ total mL. Volume to give: mL = desired dose (mg) ÷ concentration (mg/mL). Infusion rate: mL/hr = (desired mcg/min × 60) ÷ (concentration mcg/mL). Example: epinephrine infusion 5 mcg/min, concentration 4mg/250mL = 16 mcg/mL. mL/hr = (5 × 60) ÷ 16 = 18.75 mL/hr.</p></section>
<section id="self-test"><h2>Quick Self-Test</h2><p>1. Epinephrine dose in cardiac arrest? (1mg IV q3-5min) 2. Adenosine administration technique? (6mg rapid IV push proximal vein + 20mL flush) 3. Why is atropine ineffective for Mobitz II? (His-Purkinje has minimal vagal innervation) 4. Naloxone dose for opioid overdose? (0.4-2mg IV/IM/IN, titrate to RR) 5. When is NTG contraindicated? (SBP < 90, PDE5 inhibitor use, right ventricular MI) 6. What is the epinephrine concentration for anaphylaxis? (1:1000 or 1 mg/mL IM)</p></section></article>`,
    tocJson: [{ id: "summary", label: "High-Yield Summary", level: 2 }, { id: "drug-cards", label: "Drug Quick Cards", level: 2 }, { id: "calculations", label: "Calculation Framework", level: 2 }, { id: "self-test", label: "Quick Self-Test", level: 2 }],
    faqJson: [{ question: "What is the best way to memorize drug doses?", answer: "Create flashcards with drug name, class, MOA, dose, route, and key contraindications. Review daily using spaced repetition. Focus on the drugs you will use most frequently: epinephrine, amiodarone, adenosine, atropine, midazolam, naloxone." }, { question: "How do you avoid medication errors in the field?", answer: "Follow the 5 Rights: right patient, right drug, right dose, right route, right time. Double-check weight-based calculations. Read the label three times. Have your partner verify high-risk medications. Use pre-calculated dosing charts for pediatric patients." }, { question: "What pharmacology topics are most tested?", answer: "ACLS drug protocols (epinephrine, amiodarone, adenosine timing), RSI medication sequence, pediatric dosing, naloxone administration, nitroglycerin contraindications, and dosage calculations (especially infusion rate problems)." }, { question: "How do you approach dosage calculation problems on exams?", answer: "Write out the formula first, plug in known values, solve step by step. Check units — they should cancel out correctly. Common formulas: dose = weight × mg/kg; volume = dose ÷ concentration; drip rate = (dose × 60) ÷ concentration. Always double-check your answer." }],
    internalLinksJson: [] },
  { slug: "paramedic-pcp-exam-canada", title: "PCP Exam Canada: Complete Study Guide", metaTitle: "PCP Exam Canada Study Guide | Paramedic Exam Prep | NurseNest", metaDescription: "Comprehensive Primary Care Paramedic exam preparation guide for Canadian provincial certification covering NOCP competencies, scope of practice, and exam strategies.", pageType: "study-guide", exam: "COPR",
    contentHtml: `<article><h1>PCP Exam Canada: Complete Study Guide</h1>
<section id="summary"><h2>High-Yield Summary</h2><p>The Canadian Primary Care Paramedic (PCP) exam tests competencies defined by the National Occupational Competency Profile (NOCP). Focus areas: patient assessment (primary and secondary survey), airway management (BVM, OPA, NPA — PCPs typically do not intubate), medical and trauma emergencies, pharmacology within PCP scope, and professional responsibilities. Provincial variations exist — review your specific provincial scope of practice.</p></section>
<section id="scope"><h2>PCP Scope of Practice Highlights</h2><p>PCP scope typically includes: patient assessment (vital signs, GCS, stroke scales), BLS airway management (OPA, NPA, BVM, suctioning), oxygen therapy, CPR and AED use, spinal motion restriction, hemorrhage control and wound care, limited medication administration (epinephrine auto-injector for anaphylaxis, ASA for ACS, salbutamol for bronchospasm, glucagon for hypoglycemia, nitroglycerin assist for cardiac chest pain). Provincial protocols may expand or restrict this scope.</p></section>
<section id="exam-format"><h2>Exam Format & Strategy</h2><p>Most provincial PCP exams include a written (multiple choice) and practical (skills demonstration) component. Written: scenario-based questions testing clinical judgment, not memorization. Read the ENTIRE question, identify what is being asked, eliminate obviously wrong answers, choose the BEST answer (not just a correct one). Practical: demonstrate systematic approach, verbalize BSI/scene safety, perform skills to standard, manage time effectively.</p></section>
<section id="key-topics"><h2>Must-Know Topics</h2><p>Patient assessment framework, normal vital signs by age, shock recognition and treatment within PCP scope, cardiac arrest management (BLS), respiratory distress management, diabetic emergency management (glucose check, glucagon), allergic reaction and anaphylaxis management, OB emergencies (normal delivery), pediatric assessment differences, scene safety and MCI triage (START), documentation and legal considerations (consent, refusal, mandatory reporting).</p></section></article>`,
    tocJson: [{ id: "summary", label: "High-Yield Summary", level: 2 }, { id: "scope", label: "PCP Scope of Practice", level: 2 }, { id: "exam-format", label: "Exam Format & Strategy", level: 2 }, { id: "key-topics", label: "Must-Know Topics", level: 2 }],
    faqJson: [{ question: "What is the difference between PCP and ACP scope?", answer: "PCPs perform BLS-level airway management, limited medication administration, and basic patient care. ACPs additionally perform endotracheal intubation, IV/IO access, advanced pharmacology (30+ medications), cardiac monitoring and 12-lead interpretation, synchronized cardioversion, and RSI." }, { question: "How should I study for the PCP exam?", answer: "Review NOCP competencies systematically, practice scenario-based questions, use flashcards for pharmacology and vital signs, practice all practical skills regularly, and study your provincial scope of practice document carefully. Focus on clinical decision-making rather than rote memorization." }, { question: "Are Canadian paramedic exams different from NREMT?", answer: "Yes. Canadian exams are based on the NOCP (National Occupational Competency Profile) rather than the NREMT curriculum. Scope of practice, medication lists, and protocols differ. Canadian exams use metric units and Canadian clinical guidelines. However, core medical knowledge overlaps significantly." }, { question: "What are the most commonly failed areas on PCP exams?", answer: "Patient assessment (not systematic enough), pharmacology (incorrect doses or indications), cardiac arrest management (BLS errors), pediatric vital signs (not knowing age-appropriate normals), and practical skills (not verbalizing BSI/scene safety, poor time management)." }],
    internalLinksJson: [] },
  { slug: "paramedic-acp-exam-review", title: "ACP Exam Review: Complete Study Guide", metaTitle: "ACP Exam Review Study Guide | Paramedic Exam Prep | NurseNest", metaDescription: "Advanced Care Paramedic exam review guide covering ACLS, advanced airway, pharmacology, 12-lead ECG, and ACP-specific competencies for Canadian certification.", pageType: "study-guide", exam: "COPR",
    contentHtml: `<article><h1>ACP Exam Review: Complete Study Guide</h1>
<section id="summary"><h2>High-Yield Summary</h2><p>The Advanced Care Paramedic (ACP) exam covers everything in PCP scope PLUS: advanced airway management (ETT, RSI, surgical airway), IV/IO vascular access, expanded pharmacology (30+ medications), cardiac monitoring and 12-lead ECG interpretation, ACLS and PALS algorithms, synchronized cardioversion and transcutaneous pacing, needle decompression, and advanced patient assessment including differential diagnosis. The ACP must demonstrate clinical judgment in complex, time-critical scenarios.</p></section>
<section id="advanced-skills"><h2>Advanced Skills Focus</h2><p>RSI: preoxygenate → induction (ketamine 1-2 mg/kg or etomidate 0.3 mg/kg) → paralytic (succinylcholine 1-2 mg/kg or rocuronium 1 mg/kg) → intubate → confirm with capnography. 12-Lead ECG: systematic interpretation, STEMI recognition, contiguous leads, axis determination. ACLS: VF/pVT algorithm, PEA/asystole algorithm, tachycardia algorithm, bradycardia algorithm, post-ROSC care. Needle decompression: 2nd ICS MCL or 5th ICS AAL for tension pneumothorax.</p></section>
<section id="pharmacology"><h2>ACP Pharmacology Quick Reference</h2><p>Know cold: Epinephrine, Amiodarone, Lidocaine, Adenosine, Atropine, Dopamine, Norepinephrine, Midazolam, Diazepam, Ketamine, Etomidate, Succinylcholine, Rocuronium, Fentanyl, Morphine, Ketorolac, Naloxone, Flumazenil, Dextrose D10, Glucagon, Nitroglycerin, ASA, Albuterol, Ipratropium, Magnesium Sulfate, Calcium Chloride, Sodium Bicarbonate, TXA, Ondansetron, Diphenhydramine, Methylprednisolone.</p></section>
<section id="self-test"><h2>Quick Self-Test</h2><p>1. RSI induction agent doses? (Ketamine 1-2 mg/kg, etomidate 0.3 mg/kg) 2. Succinylcholine contraindications? (Hyperkalemia, burns > 24h, crush injury, neuromuscular disease) 3. STEMI criteria? (≥ 1mm ST elevation in 2+ contiguous limb leads, ≥ 2mm in precordial) 4. Amiodarone dose for stable VT? (150mg IV over 10 min) 5. Needle decompression landmarks? (2nd ICS MCL or 5th ICS AAL) 6. Post-ROSC target temperature? (32-36°C targeted temperature management)</p></section></article>`,
    tocJson: [{ id: "summary", label: "High-Yield Summary", level: 2 }, { id: "advanced-skills", label: "Advanced Skills Focus", level: 2 }, { id: "pharmacology", label: "Pharmacology Quick Reference", level: 2 }, { id: "self-test", label: "Quick Self-Test", level: 2 }],
    faqJson: [{ question: "What is the biggest difference between PCP and ACP exams?", answer: "Depth and scope. ACP exams test advanced decision-making including 12-lead interpretation, ACLS algorithms, RSI pharmacology, and the ability to manage multiple simultaneous interventions. Questions are more complex with multiple correct options where you must choose the BEST one." }, { question: "How do I prepare for ACP practical exams?", answer: "Practice integrated scenarios that combine multiple skills (airway + cardiac + pharmacology). Use high-fidelity simulation if available. Practice verbalizing your clinical reasoning. Master RSI sequence and ACLS algorithms until they are automatic." }, { question: "What ACP topics are most heavily tested?", answer: "12-lead ECG interpretation (especially STEMI recognition), ACLS algorithms (all four), RSI pharmacology and procedure, advanced airway management with confirmation, cardiac pharmacology (doses, indications, contraindications), and complex patient scenarios requiring differential diagnosis." }, { question: "Should I study NREMT material for Canadian ACP?", answer: "NREMT material covers many of the same clinical topics and can be excellent study material. However, Canadian protocols, medication lists, and scope of practice differ. Use NREMT resources for clinical knowledge but always verify against your provincial scope and the NOCP." }],
    internalLinksJson: [] },
  { slug: "paramedic-nremt-quick-review", title: "NREMT Paramedic: Quick Review Study Guide", metaTitle: "NREMT Paramedic Quick Review | Exam Prep | NurseNest", metaDescription: "Fast-track NREMT paramedic exam review covering high-yield topics, test-taking strategies, and the most commonly tested concepts for certification success.", pageType: "study-guide", exam: "NREMT",
    contentHtml: `<article><h1>NREMT Paramedic: Quick Review Study Guide</h1>
<section id="summary"><h2>High-Yield Summary</h2><p>The NREMT paramedic exam is a computer-adaptive test (CAT) that adjusts difficulty based on your performance. It covers: airway management, cardiology, trauma, medical emergencies, OB/GYN/pediatrics, and EMS operations. Focus on clinical decision-making and prioritization rather than rote memorization. The test asks "what do you do FIRST" and "what is the MOST important" — prioritization is key.</p></section>
<section id="top-topics"><h2>Most Tested Topics</h2><p>1. Airway management (BVM, adjuncts, advanced airways, capnography). 2. Cardiac arrest (ACLS algorithms, drug dosing, CPR quality). 3. Trauma assessment (XABCDE, hemorrhage control, transport decisions). 4. Medical emergencies (hypoglycemia, anaphylaxis, stroke, seizures). 5. Pharmacology (ACLS drugs, analgesics, RSI meds). 6. Pediatric emergencies (PAT, vital signs, airway differences). 7. ECG interpretation (rhythm ID, STEMI recognition). 8. Shock (types, assessment, treatment). 9. OB emergencies (delivery, cord prolapse, eclampsia). 10. Operations (START triage, ICS, legal concepts).</p></section>
<section id="strategies"><h2>Test-Taking Strategies</h2><p>Read the entire question including all options before answering. Identify what is being asked — usually "first action" or "priority." Eliminate obviously wrong answers. Choose the BEST answer, not just a correct one. For prioritization: life threats before comfort, assessment before intervention (unless the finding is immediately lethal), airway before breathing before circulation. Time management: don't spend > 2 minutes on any question. Trust your first instinct unless you find a clear reason to change.</p></section>
<section id="pearls"><h2>Last-Minute Exam Pearls</h2><p>Scene safety is ALWAYS first. Check glucose on every AMS patient. Waveform capnography confirms ETT placement. Epinephrine IM for anaphylaxis (NOT IV unless cardiovascular collapse). Permissive hypotension for penetrating trauma (NOT for TBI). NPA contraindicated in basilar skull fracture. Atropine does not work for Mobitz II or 3rd degree block. Adenosine must be rapid push through proximal IV. Two-rescuer BVM is better than single. ETCO2 > 10 during CPR = adequate compressions. Tachycardia is the earliest sign of shock.</p></section></article>`,
    tocJson: [{ id: "summary", label: "High-Yield Summary", level: 2 }, { id: "top-topics", label: "Most Tested Topics", level: 2 }, { id: "strategies", label: "Test-Taking Strategies", level: 2 }, { id: "pearls", label: "Last-Minute Exam Pearls", level: 2 }],
    faqJson: [{ question: "How many questions is the NREMT paramedic exam?", answer: "The CAT ranges from 80 to 150 questions. The test ends when the algorithm determines your competency level with sufficient confidence. Finishing in fewer questions does not mean you failed or passed — it depends on the difficulty of questions answered correctly." }, { question: "What is the best study strategy for NREMT?", answer: "Practice scenario-based questions rather than memorizing facts. Understand the WHY behind each intervention. Focus on prioritization — the exam tests clinical judgment more than knowledge recall. Use multiple question banks and review rationales for both correct and incorrect answers." }, { question: "What if I fail the NREMT?", answer: "You can retake it after a 15-day waiting period for the first two attempts, 30 days for the third, and progressively longer for subsequent attempts. After three failed attempts, you must complete remedial education. Use the topic breakdown from your score report to focus your studying." }, { question: "How is the CAT format different from a standard test?", answer: "Computer Adaptive Testing adjusts question difficulty based on your performance. If you answer correctly, the next question is harder. If you answer incorrectly, the next one is easier. The algorithm determines your competency level, not a simple pass/fail percentage. You cannot go back to previous questions." }],
    internalLinksJson: [] },
];
