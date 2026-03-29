import { pool } from "./storage";

interface TopicHub {
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

const TOPIC_HUB_PAGES: TopicHub[] = [
  {
    pageType: "topic-hub",
    exam: "RRT/TMC",
    title: "Respiratory Therapy Topics Hub: Complete Study Resource Guide",
    slug: "respiratory-therapy-topics-hub",
    metaTitle: "Respiratory Therapy Topics Hub: Study Resources | NurseNest",
    metaDescription: "Complete respiratory therapy topic hub covering ABG interpretation, ventilator management, airway management, pulmonary physiology, and oxygen therapy. Organized study resources for RRT exam prep.",
    contentHtml: `<article>
<h1>Respiratory Therapy Topics Hub: Complete Study Resource Guide</h1>
<p class="lead">This hub organizes all respiratory therapy study resources into logical topic clusters. Each subtopic links to dedicated lessons, practice questions, flashcards, and study guides to help you build comprehensive knowledge for RRT/TMC exam preparation.</p>

<section id="pulmonary-physiology">
<h2>Pulmonary Physiology & Anatomy</h2>
<p>Understanding the structure and function of the respiratory system is the foundation of respiratory therapy practice. This cluster covers the anatomy of the upper and lower airways, mechanics of ventilation including compliance and resistance, gas exchange at the alveolar-capillary membrane, ventilation-perfusion relationships and V/Q mismatch, oxygen and carbon dioxide transport in the blood, and the neural and chemical control of breathing.</p>
<p>Key concepts to master include the oxyhemoglobin dissociation curve and factors that shift it (pH, temperature, 2,3-DPG), the difference between dead space ventilation and alveolar ventilation, lung volumes and capacities measured by pulmonary function testing, and the role of surfactant in preventing alveolar collapse. These foundational concepts are tested directly on the TMC exam and underpin clinical decision-making in all respiratory care scenarios.</p>
<ul>
<li><a href="/respiratory-therapy/study-guide/pulmonary-anatomy">Pulmonary Anatomy Review</a></li>
<li><a href="/respiratory-therapy/study-guide/gas-exchange">Gas Exchange & Ventilation-Perfusion</a></li>
<li><a href="/respiratory-therapy/study-guide/lung-volumes">Lung Volumes & Pulmonary Function Testing</a></li>
<li><a href="/respiratory-therapy/study-guide/oxygen-transport">Oxygen & CO2 Transport</a></li>
</ul>
</section>

<section id="ventilator-management">
<h2>Ventilator Management</h2>
<p>Mechanical ventilation is the cornerstone of critical care respiratory therapy. This cluster covers ventilator modes (volume control, pressure control, pressure support, SIMV, APRV, PRVC), initial ventilator settings based on patient pathology, waveform analysis and interpretation, alarm troubleshooting (high pressure, low pressure, high PEEP), weaning protocols and spontaneous breathing trials, and extubation criteria assessment.</p>
<p>The Clinical Simulation Exam heavily tests ventilator management. You must be able to select appropriate initial settings, interpret patient response through waveforms and ABG results, make evidence-based adjustments, and determine readiness for weaning and extubation. Understanding lung-protective ventilation strategies for ARDS (low tidal volume, permissive hypercapnia, optimal PEEP) is a high-yield exam topic.</p>
<ul>
<li><a href="/respiratory-therapy/study-guide/ventilator-modes">Ventilator Modes Comparison</a></li>
<li><a href="/respiratory-therapy/study-guide/ventilator-waveforms">Waveform Analysis Guide</a></li>
<li><a href="/respiratory-therapy/study-guide/ventilator-troubleshooting">Alarm Troubleshooting</a></li>
<li><a href="/respiratory-therapy/study-guide/weaning-protocols">Weaning & Extubation Criteria</a></li>
</ul>
</section>

<section id="abg-interpretation">
<h2>ABG Interpretation</h2>
<p>Arterial blood gas analysis is one of the most heavily tested topics on the TMC exam and a foundational clinical skill. This cluster covers the systematic approach to ABG interpretation, identifying respiratory versus metabolic disturbances, determining compensation status (uncompensated, partially compensated, fully compensated), calculating the A-a gradient, and using ABG data to guide ventilator adjustments and oxygen therapy changes.</p>
<p>Master the ROME method (Respiratory = Opposite, Metabolic = Equal) for rapid acid-base classification. Practice interpreting complex ABGs with mixed disturbances. Understand the clinical significance of base excess, anion gap, and lactate levels in conjunction with ABG data.</p>
<ul>
<li><a href="/respiratory-therapy/study-guide/abg-basics">ABG Interpretation Fundamentals</a></li>
<li><a href="/respiratory-therapy/study-guide/acid-base-disorders">Acid-Base Disorders</a></li>
<li><a href="/respiratory-therapy/study-guide/abg-clinical-cases">ABG Clinical Case Studies</a></li>
<li><a href="/respiratory-therapy/practice-questions/abg-interpretation">ABG Practice Questions</a></li>
</ul>
</section>

<section id="airway-management">
<h2>Airway Management</h2>
<p>Advanced airway management differentiates respiratory therapists in the clinical setting. This cluster covers basic airway positioning and adjuncts (OPA, NPA), bag-valve-mask ventilation technique, supraglottic airway devices (King LT, i-gel, LMA), endotracheal intubation (direct and video laryngoscopy), tracheostomy care and management, and the difficult airway algorithm.</p>
<ul>
<li><a href="/respiratory-therapy/study-guide/airway-assessment">Airway Assessment & Planning</a></li>
<li><a href="/respiratory-therapy/study-guide/intubation">Intubation Techniques</a></li>
<li><a href="/respiratory-therapy/study-guide/tracheostomy-care">Tracheostomy Care Guide</a></li>
<li><a href="/respiratory-therapy/study-guide/difficult-airway">Difficult Airway Management</a></li>
</ul>
</section>

<section id="oxygen-therapy">
<h2>Oxygen Therapy & Delivery Devices</h2>
<p>Selecting the appropriate oxygen delivery device based on patient needs is a core respiratory therapy competency. This cluster covers low-flow systems (nasal cannula, simple mask), high-flow systems (Venturi mask, non-rebreather, HFNC), oxygen blenders and air entrainment principles, oxygen toxicity risks, and special considerations for COPD patients with chronic CO2 retention.</p>
<ul>
<li><a href="/respiratory-therapy/study-guide/oxygen-devices">Oxygen Delivery Devices Comparison</a></li>
<li><a href="/respiratory-therapy/study-guide/hfnc">High-Flow Nasal Cannula Guide</a></li>
<li><a href="/respiratory-therapy/study-guide/copd-oxygen">Oxygen Therapy in COPD</a></li>
</ul>
</section>

<section id="respiratory-pharmacology">
<h2>Respiratory Pharmacology</h2>
<p>Respiratory pharmacology covers the medications used to manage acute and chronic respiratory conditions. Topics include bronchodilators (short-acting and long-acting beta-2 agonists, anticholinergics), corticosteroids (inhaled and systemic), mucolytics and mucokinetic agents, surfactant replacement therapy, neuromuscular blocking agents, and sedation medications used in mechanically ventilated patients.</p>
<ul>
<li><a href="/respiratory-therapy/study-guide/bronchodilators">Bronchodilators Guide</a></li>
<li><a href="/respiratory-therapy/study-guide/respiratory-medications">Respiratory Medications Overview</a></li>
<li><a href="/respiratory-therapy/study-guide/aerosol-therapy">Aerosol Therapy & Delivery</a></li>
</ul>
</section>
</article>`,
    tocJson: [
      { id: "pulmonary-physiology", label: "Pulmonary Physiology", level: 2 },
      { id: "ventilator-management", label: "Ventilator Management", level: 2 },
      { id: "abg-interpretation", label: "ABG Interpretation", level: 2 },
      { id: "airway-management", label: "Airway Management", level: 2 },
      { id: "oxygen-therapy", label: "Oxygen Therapy", level: 2 },
      { id: "respiratory-pharmacology", label: "Pharmacology", level: 2 },
    ],
    faqJson: [
      { question: "What topics are tested on the TMC exam?", answer: "The TMC covers Patient Data Evaluation (26%), Equipment Troubleshooting and QC (22%), and Initiation/Modification of Interventions (52%). Key topics include ABG interpretation, ventilator management, airway management, oxygen therapy, and respiratory pharmacology." },
      { question: "How should I organize my respiratory therapy study plan?", answer: "Start with pulmonary physiology fundamentals, then progress to clinical skills (ABG interpretation, ventilator management). Practice with topic-specific questions before attempting full practice exams." },
    ],
    internalLinksJson: [
      { url: "/respiratory-therapy-exam-prep", anchor: "Respiratory Therapy Exam Prep Guide", context: "parent" },
      { url: "/respiratory-therapy/practice-questions", anchor: "RT Practice Questions", context: "practice" },
      { url: "/flashcards", anchor: "RT Flashcards", context: "practice" },
      { url: "/allied-health", anchor: "Allied Health Hub", context: "navigation" },
    ],
  },
  {
    pageType: "topic-hub",
    exam: "NREMT",
    title: "Paramedic Topics Hub: Complete Emergency Medicine Study Resources",
    slug: "paramedic-topics-hub",
    metaTitle: "Paramedic Topics Hub: EMS Study Resources | NurseNest",
    metaDescription: "Complete paramedic topic hub covering trauma assessment, cardiac emergencies, airway management, pharmacology, and medical emergencies. Organized study resources for NREMT exam prep.",
    contentHtml: `<article>
<h1>Paramedic Topics Hub: Complete Emergency Medicine Study Resources</h1>
<p class="lead">This hub organizes all paramedic study resources into topic clusters aligned with NREMT exam content domains. Each cluster links to dedicated study materials to help you build comprehensive prehospital emergency care knowledge.</p>

<section id="trauma-assessment">
<h2>Trauma Assessment & Management</h2>
<p>Trauma care is a cornerstone of paramedic practice, constituting 14-18% of the NREMT exam. This cluster covers the systematic approach to trauma assessment using the primary survey (ABCDE), mechanism of injury analysis and kinematics, hemorrhage control techniques (direct pressure, tourniquets, hemostatic agents), spinal motion restriction criteria and application, chest trauma management (tension pneumothorax, flail chest, hemothorax), and transport decisions for trauma patients.</p>
<ul>
<li><a href="/paramedic/study-guide/primary-survey">Primary Survey ABCDE Approach</a></li>
<li><a href="/paramedic/study-guide/hemorrhage-control">Hemorrhage Control Techniques</a></li>
<li><a href="/paramedic/study-guide/chest-trauma">Chest Trauma Management</a></li>
<li><a href="/paramedic/study-guide/spinal-assessment">Spinal Assessment & Motion Restriction</a></li>
<li><a href="/paramedic/study-guide/trauma-transport">Trauma Transport Decisions</a></li>
</ul>
</section>

<section id="cardiac-emergencies">
<h2>Cardiac Emergencies & ECG Interpretation</h2>
<p>Cardiac content makes up 20-24% of the NREMT exam. Master 12-lead ECG interpretation, acute coronary syndrome recognition and management, ACLS cardiac arrest algorithms, pharmacology of cardiac medications, synchronized cardioversion and defibrillation indications, and transcutaneous pacing for symptomatic bradycardia.</p>
<ul>
<li><a href="/paramedic/study-guide/ecg-interpretation">12-Lead ECG Interpretation</a></li>
<li><a href="/paramedic/study-guide/acute-coronary-syndromes">Acute Coronary Syndromes</a></li>
<li><a href="/paramedic/study-guide/acls-algorithms">ACLS Cardiac Arrest Algorithms</a></li>
<li><a href="/paramedic/study-guide/dysrhythmias">Dysrhythmia Recognition & Treatment</a></li>
<li><a href="/paramedic/practice-questions/cardiac">Cardiac Practice Questions</a></li>
</ul>
</section>

<section id="airway-ventilation">
<h2>Airway, Respiration & Ventilation</h2>
<p>Airway management constitutes 18-22% of the NREMT exam. Topics include basic airway positioning and adjuncts, bag-valve-mask ventilation, supraglottic airway devices, endotracheal intubation, surgical cricothyrotomy, waveform capnography monitoring, and management of respiratory emergencies (asthma, COPD, anaphylaxis, pulmonary edema).</p>
<ul>
<li><a href="/paramedic/study-guide/airway-management">Advanced Airway Management</a></li>
<li><a href="/paramedic/study-guide/capnography">Waveform Capnography</a></li>
<li><a href="/paramedic/study-guide/respiratory-emergencies">Respiratory Emergencies</a></li>
</ul>
</section>

<section id="medical-emergencies">
<h2>Medical & OB/GYN Emergencies</h2>
<p>Medical emergencies represent 15-19% of the NREMT exam. This cluster covers neurological emergencies (stroke, seizures, altered mental status), endocrine emergencies (diabetic emergencies, adrenal crisis), toxicological emergencies (overdose management, antidote administration), environmental emergencies (hypothermia, heat stroke), and obstetric emergencies (emergency childbirth, eclampsia, postpartum hemorrhage).</p>
<ul>
<li><a href="/paramedic/study-guide/stroke-assessment">Stroke Assessment & Management</a></li>
<li><a href="/paramedic/study-guide/diabetic-emergencies">Diabetic Emergencies</a></li>
<li><a href="/paramedic/study-guide/toxicology">Toxicology & Overdose Management</a></li>
<li><a href="/paramedic/study-guide/obstetric-emergencies">Obstetric Emergencies</a></li>
</ul>
</section>

<section id="ems-operations">
<h2>EMS Operations & Scene Management</h2>
<p>EMS operations constitute 12-16% of the NREMT exam. Topics include scene safety assessment, incident command system, multiple casualty incident triage (START triage), hazardous materials awareness, ambulance operations and safety, communication and documentation, and medical-legal considerations in prehospital care.</p>
<ul>
<li><a href="/paramedic/study-guide/scene-management">Scene Safety & Management</a></li>
<li><a href="/paramedic/study-guide/mci-triage">MCI Triage & START System</a></li>
<li><a href="/paramedic/study-guide/ems-communications">EMS Communications</a></li>
</ul>
</section>

<section id="pharmacology">
<h2>Paramedic Pharmacology</h2>
<p>Pharmacology knowledge is integrated throughout all NREMT content areas. This cluster covers cardiac medications (epinephrine, amiodarone, adenosine, atropine), analgesics (fentanyl, ketamine, morphine), respiratory medications (albuterol, ipratropium, magnesium sulfate), neurological medications (midazolam, dextrose, naloxone), and medication calculation and administration techniques.</p>
<ul>
<li><a href="/paramedic/study-guide/cardiac-medications">Cardiac Medications Guide</a></li>
<li><a href="/paramedic/study-guide/pain-management">Prehospital Pain Management</a></li>
<li><a href="/paramedic/study-guide/medication-calculations">Medication Calculations</a></li>
</ul>
</section>
</article>`,
    tocJson: [
      { id: "trauma-assessment", label: "Trauma Assessment", level: 2 },
      { id: "cardiac-emergencies", label: "Cardiac Emergencies", level: 2 },
      { id: "airway-ventilation", label: "Airway & Ventilation", level: 2 },
      { id: "medical-emergencies", label: "Medical Emergencies", level: 2 },
      { id: "ems-operations", label: "EMS Operations", level: 2 },
      { id: "pharmacology", label: "Pharmacology", level: 2 },
    ],
    faqJson: [
      { question: "What topics are tested on the NREMT Paramedic exam?", answer: "The NREMT covers five domains: Airway/Respiration (18-22%), Cardiology/Resuscitation (20-24%), Trauma (14-18%), Medical/OB (15-19%), and EMS Operations (12-16%). Questions test clinical decision-making in realistic prehospital scenarios." },
      { question: "Which NREMT topic area should I study first?", answer: "Start with cardiac emergencies and ECG interpretation since it is the highest-weighted domain. Then study airway management and trauma assessment. Build pharmacology knowledge alongside clinical topics." },
    ],
    internalLinksJson: [
      { url: "/paramedic-exam-prep", anchor: "Paramedic Exam Prep Guide", context: "parent" },
      { url: "/paramedic/practice-questions", anchor: "Paramedic Practice Questions", context: "practice" },
      { url: "/allied-health", anchor: "Allied Health Hub", context: "navigation" },
    ],
  },
  {
    pageType: "topic-hub",
    exam: "NCLEX",
    title: "NCLEX Pharmacology Hub: Complete Medication Study Guide",
    slug: "nclex-pharmacology-hub",
    metaTitle: "NCLEX Pharmacology Hub: Medication Study Guide | NurseNest",
    metaDescription: "Complete NCLEX pharmacology topic hub covering drug classifications, medication safety, dosage calculations, and high-alert medications. Organized study resources for nursing exam prep.",
    contentHtml: `<article>
<h1>NCLEX Pharmacology Hub: Complete Medication Study Guide</h1>
<p class="lead">Pharmacology is one of the most heavily tested areas on the NCLEX-RN and NCLEX-PN/REx-PN exams. This hub organizes medication study resources into logical drug class clusters to help you build systematic pharmacology knowledge for exam success and safe clinical practice.</p>

<section id="cardiovascular-meds">
<h2>Cardiovascular Medications</h2>
<p>Cardiovascular pharmacology covers the largest drug category on the NCLEX. Master ACE inhibitors (ending in -pril), ARBs (ending in -sartan), beta-blockers (ending in -olol), calcium channel blockers, antiarrhythmics, anticoagulants (heparin, warfarin, DOACs), antiplatelet agents, and vasopressors. For each class, know the mechanism of action, nursing considerations, patient education, and lab monitoring requirements.</p>
<ul>
<li><a href="/lessons/ace-inhibitors">ACE Inhibitors & ARBs</a></li>
<li><a href="/lessons/beta-blockers">Beta-Blockers Guide</a></li>
<li><a href="/lessons/anticoagulants">Anticoagulants: Heparin, Warfarin, DOACs</a></li>
<li><a href="/lessons/antiarrhythmics">Antiarrhythmic Medications</a></li>
</ul>
</section>

<section id="respiratory-meds">
<h2>Respiratory Medications</h2>
<p>Respiratory pharmacology focuses on bronchodilators (beta-2 agonists: albuterol, salmeterol; anticholinergics: ipratropium, tiotropium), corticosteroids (inhaled and systemic), leukotriene modifiers (montelukast), and mucolytics (acetylcysteine). Know the difference between rescue and controller medications, proper inhaler technique, and the importance of rinsing after inhaled corticosteroids.</p>
<ul>
<li><a href="/lessons/bronchodilators">Bronchodilators: Rescue vs Controller</a></li>
<li><a href="/lessons/inhaled-corticosteroids">Inhaled Corticosteroids</a></li>
</ul>
</section>

<section id="endocrine-meds">
<h2>Endocrine Medications</h2>
<p>Endocrine pharmacology covers insulin types (rapid, short, intermediate, long-acting), oral hypoglycemics (metformin, sulfonylureas, SGLT2 inhibitors), thyroid medications (levothyroxine, methimazole), corticosteroids (prednisone), and hormonal therapies. Insulin management is one of the most frequently tested topics on the NCLEX.</p>
<ul>
<li><a href="/lessons/insulin-types">Insulin Types & Administration</a></li>
<li><a href="/lessons/oral-hypoglycemics">Oral Hypoglycemic Agents</a></li>
<li><a href="/lessons/thyroid-medications">Thyroid Medications</a></li>
</ul>
</section>

<section id="neurological-meds">
<h2>Neurological & Psychiatric Medications</h2>
<p>This cluster covers antiepileptics (phenytoin, valproic acid, levetiracetam), antidepressants (SSRIs, SNRIs, TCAs, MAOIs), antipsychotics (typical and atypical), anxiolytics (benzodiazepines), and medications for neurodegenerative diseases (levodopa-carbidopa, cholinesterase inhibitors). Know black box warnings, serotonin syndrome signs, neuroleptic malignant syndrome, and tyramine restrictions with MAOIs.</p>
<ul>
<li><a href="/lessons/antidepressants">Antidepressants: SSRIs, SNRIs, TCAs</a></li>
<li><a href="/lessons/antiepileptics">Antiepileptic Medications</a></li>
<li><a href="/lessons/antipsychotics">Antipsychotic Medications</a></li>
</ul>
</section>

<section id="pain-management">
<h2>Pain Management & Anesthesia</h2>
<p>Pain management pharmacology covers opioid analgesics (morphine, hydromorphone, fentanyl), opioid antagonists (naloxone), NSAIDs (ibuprofen, ketorolac), acetaminophen, patient-controlled analgesia (PCA), epidural analgesia, and non-pharmacological pain management strategies. Understand equianalgesic dosing, respiratory depression monitoring, and addiction versus physical dependence.</p>
<ul>
<li><a href="/lessons/opioid-analgesics">Opioid Analgesics & Safety</a></li>
<li><a href="/lessons/nsaids">NSAIDs & Non-Opioid Analgesics</a></li>
</ul>
</section>

<section id="medication-safety">
<h2>Medication Safety & Calculations</h2>
<p>Medication safety is tested throughout the NCLEX, not just in pharmacology questions. Topics include the rights of medication administration, high-alert medications (ISMP list), look-alike/sound-alike medications, dosage calculations (weight-based, drip rates, reconstitution), medication error prevention, and safe medication storage and handling.</p>
<ul>
<li><a href="/med-math", anchor: "Dosage Calculation Practice">Dosage Calculation Practice</a></li>
<li><a href="/lessons/medication-safety">Medication Safety Principles</a></li>
<li><a href="/flashcards">Pharmacology Flashcards</a></li>
</ul>
</section>
</article>`,
    tocJson: [
      { id: "cardiovascular-meds", label: "Cardiovascular Meds", level: 2 },
      { id: "respiratory-meds", label: "Respiratory Meds", level: 2 },
      { id: "endocrine-meds", label: "Endocrine Meds", level: 2 },
      { id: "neurological-meds", label: "Neuro/Psych Meds", level: 2 },
      { id: "pain-management", label: "Pain Management", level: 2 },
      { id: "medication-safety", label: "Medication Safety", level: 2 },
    ],
    faqJson: [
      { question: "How should I study pharmacology for the NCLEX?", answer: "Study by drug class rather than individual medications. Learn the suffix patterns (-pril, -sartan, -olol, -statin) to identify drug families. Focus on nursing considerations, lab monitoring, and patient education for each class." },
      { question: "What are the most tested medication classes on the NCLEX?", answer: "Cardiovascular medications (ACE inhibitors, beta-blockers, anticoagulants), insulin types, antibiotics, psychiatric medications, and opioid analgesics are the most frequently tested drug classes." },
      { question: "How do I remember medication side effects?", answer: "Use drug class associations rather than memorizing individual drugs. For example, all ACE inhibitors can cause dry cough and hyperkalemia. Use flashcards with spaced repetition for high-yield medications." },
    ],
    internalLinksJson: [
      { url: "/question-bank", anchor: "Pharmacology Practice Questions", context: "practice" },
      { url: "/flashcards", anchor: "Pharmacology Flashcards", context: "practice" },
      { url: "/med-math", anchor: "Dosage Calculations Practice", context: "practice" },
      { url: "/exam-prep", anchor: "Exam Prep Hub", context: "navigation" },
    ],
  },
  {
    pageType: "topic-hub",
    exam: "NCLEX",
    title: "Cardiac Nursing Hub: Complete Heart & Vascular Study Guide",
    slug: "cardiac-nursing-hub",
    metaTitle: "Cardiac Nursing Hub: Heart & Vascular Study Guide | NurseNest",
    metaDescription: "Complete cardiac nursing topic hub covering heart failure, ECG interpretation, acute coronary syndromes, dysrhythmias, and hemodynamic monitoring. Organized study resources for NCLEX prep.",
    contentHtml: `<article>
<h1>Cardiac Nursing Hub: Complete Heart & Vascular Study Guide</h1>
<p class="lead">Cardiovascular nursing is one of the most heavily tested content areas on the NCLEX. This hub organizes cardiac study resources into clinical topic clusters covering assessment, conditions, interventions, and emergency management to build comprehensive cardiac nursing knowledge.</p>

<section id="cardiac-assessment">
<h2>Cardiac Assessment & Monitoring</h2>
<p>Systematic cardiac assessment is the foundation of cardiovascular nursing care. This cluster covers heart sound auscultation (S1, S2, S3, S4, murmurs), peripheral vascular assessment (pulses, capillary refill, edema grading), hemodynamic monitoring (arterial lines, CVP, PA catheter), cardiac biomarkers (troponin, BNP, CK-MB), and ECG monitoring and interpretation basics.</p>
<ul>
<li><a href="/lessons/cardiac-assessment-ecg">Cardiac Assessment & ECG Guide</a></li>
<li><a href="/lessons/heart-sounds">Heart Sound Auscultation</a></li>
<li><a href="/lessons/hemodynamic-monitoring">Hemodynamic Monitoring</a></li>
</ul>
</section>

<section id="heart-failure">
<h2>Heart Failure Management</h2>
<p>Heart failure is a priority NCLEX topic requiring understanding of left-sided vs right-sided failure, systolic (HFrEF) vs diastolic (HFpEF) dysfunction, NYHA functional classification, pharmacological management (ACE inhibitors, beta-blockers, diuretics, digoxin), fluid and sodium restriction, daily weight monitoring, and discharge teaching priorities.</p>
<ul>
<li><a href="/lessons/heart-failure">Heart Failure: Pathophysiology & Nursing</a></li>
<li><a href="/lessons/heart-failure-rn">Heart Failure: NYHA & Advanced Management</a></li>
<li><a href="/rpn/questions/heart-failure">Heart Failure Practice Questions</a></li>
</ul>
</section>

<section id="acs-management">
<h2>Acute Coronary Syndromes</h2>
<p>ACS management covers unstable angina, NSTEMI, and STEMI recognition and nursing interventions. Topics include chest pain assessment and differential diagnosis, 12-lead ECG interpretation for ischemia and infarction, troponin timing and interpretation, MONA protocol application, PCI and CABG nursing care, and post-cardiac catheterization monitoring (groin site assessment, peripheral pulses).</p>
<ul>
<li><a href="/lessons/acute-coronary-syndrome">ACS: STEMI vs NSTEMI</a></li>
<li><a href="/lessons/chest-pain-differential-rpn">Chest Pain Differentials</a></li>
<li><a href="/lessons/cardiac-catheterization">Cardiac Catheterization Nursing Care</a></li>
</ul>
</section>

<section id="dysrhythmias">
<h2>Dysrhythmias & ECG Interpretation</h2>
<p>Dysrhythmia management is essential for both NCLEX and clinical practice. This cluster covers normal sinus rhythm characteristics, atrial dysrhythmias (A-fib, A-flutter, SVT), ventricular dysrhythmias (V-tach, V-fib), heart blocks (first, second, third degree), ACLS algorithms for cardiac arrest, cardioversion vs defibrillation indications, and antiarrhythmic medications.</p>
<ul>
<li><a href="/lessons/atrial-fibrillation-rn">Atrial Fibrillation Management</a></li>
<li><a href="/lessons/vtach-management">Ventricular Tachycardia</a></li>
<li><a href="/lessons/heart-block-complete">Complete Heart Block</a></li>
<li><a href="/lessons/conduction-system">Cardiac Conduction System</a></li>
</ul>
</section>

<section id="vascular-conditions">
<h2>Vascular Conditions</h2>
<p>Peripheral vascular nursing covers hypertension management (staging, medications, lifestyle modifications), DVT prevention and assessment (Homan's sign, Wells criteria), pulmonary embolism recognition and anticoagulation therapy, peripheral artery disease (ABI measurement, claudication management), aortic aneurysm monitoring and emergency care, and venous insufficiency with compression therapy.</p>
<ul>
<li><a href="/lessons/hypertension">Hypertension Management</a></li>
<li><a href="/lessons/dvt-pe">DVT & Pulmonary Embolism</a></li>
<li><a href="/lessons/pad-claudication">PAD & Claudication</a></li>
<li><a href="/lessons/aaa-rupture">AAA Rupture Emergency</a></li>
</ul>
</section>

<section id="cardiac-surgery">
<h2>Cardiac Surgery & Procedures</h2>
<p>Pre and post-operative nursing care for cardiac procedures including coronary artery bypass grafting (CABG), valve replacement, pacemaker insertion, implantable cardioverter-defibrillator (ICD), and cardiac transplantation. Know sternal precautions, chest tube management, hemodynamic monitoring parameters, and complication recognition.</p>
<ul>
<li><a href="/lessons/pacemaker-care">Pacemaker Care</a></li>
<li><a href="/lessons/cardioversion-defib">Cardioversion vs Defibrillation</a></li>
</ul>
</section>
</article>`,
    tocJson: [
      { id: "cardiac-assessment", label: "Cardiac Assessment", level: 2 },
      { id: "heart-failure", label: "Heart Failure", level: 2 },
      { id: "acs-management", label: "Acute Coronary Syndromes", level: 2 },
      { id: "dysrhythmias", label: "Dysrhythmias & ECG", level: 2 },
      { id: "vascular-conditions", label: "Vascular Conditions", level: 2 },
      { id: "cardiac-surgery", label: "Cardiac Surgery", level: 2 },
    ],
    faqJson: [
      { question: "How many cardiac questions are on the NCLEX?", answer: "While the NCLEX does not have a fixed number per topic, cardiovascular content is among the most heavily tested areas. Expect cardiac-related questions throughout the exam, integrated with pharmacology, prioritization, and safety concepts." },
      { question: "What cardiac topics should I focus on for the NCLEX?", answer: "Focus on heart failure management, ACS recognition (STEMI vs NSTEMI), dysrhythmia identification, anticoagulation therapy, and ECG interpretation. Also know cardiac medication classes and their nursing considerations." },
    ],
    internalLinksJson: [
      { url: "/question-bank", anchor: "Cardiac Practice Questions", context: "practice" },
      { url: "/flashcards", anchor: "Cardiac Nursing Flashcards", context: "practice" },
      { url: "/exam-prep", anchor: "Exam Prep Hub", context: "navigation" },
      { url: "/study-guide/cardiac-emergencies-nursing-guide", anchor: "Cardiac Emergencies Study Guide", context: "study" },
    ],
  },
];

export async function seedTopicHubPages(): Promise<{ inserted: number; skipped: number; errors: string[] }> {
  let inserted = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const page of TOPIC_HUB_PAGES) {
    try {
      const existing = await pool.query(
        "SELECT id FROM seo_pages WHERE slug = $1 AND language_code = 'en'",
        [page.slug]
      );
      if (existing.rows.length > 0) {
        skipped++;
        continue;
      }

      await pool.query(
        `INSERT INTO seo_pages (page_type, exam, title, slug, meta_title, meta_description, content_html, toc_json, faq_json, internal_links_json, is_public, is_indexable, canonical_url, language_code)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, true, $11, 'en')`,
        [
          page.pageType,
          page.exam,
          page.title,
          page.slug,
          page.metaTitle,
          page.metaDescription,
          page.contentHtml,
          JSON.stringify(page.tocJson),
          JSON.stringify(page.faqJson),
          JSON.stringify(page.internalLinksJson),
          `https://www.nursenest.ca/${page.slug}`,
        ]
      );
      inserted++;
    } catch (err: any) {
      errors.push(`${page.slug}: ${err.message}`);
    }
  }

  console.log(`[Topic Hubs] Inserted: ${inserted}, Skipped: ${skipped}, Errors: ${errors.length}`);
  return { inserted, skipped, errors };
}
