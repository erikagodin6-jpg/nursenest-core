export interface CategoryHubTopic {
  slug: string;
  title: string;
  description: string;
  category: string;
  color: string;
  iconName: string;
}

export interface CategoryHubFAQ {
  question: string;
  answer: string;
}

export interface CategoryHub {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  color: string;
  colorAccent: string;
  iconName: string;
  introduction: string;
  whyItMatters: string;
  topics: CategoryHubTopic[];
  faqs: CategoryHubFAQ[];
  relatedHubSlugs: string[];
}

export const CATEGORY_HUBS: CategoryHub[] = [
  {
    slug: "cardiology-nursing",
    title: "Cardiology Nursing",
    metaTitle: "Cardiology Nursing Hub | Cardiac Assessment, Rhythms & Interventions | NurseNest",
    metaDescription: "Comprehensive cardiology nursing hub covering cardiac rhythm interpretation, hemodynamic monitoring, ECG analysis, electrolyte effects on the heart, and evidence-based cardiac nursing interventions.",
    keywords: "cardiology nursing, cardiac nursing, heart rhythm nursing, ECG interpretation nursing, cardiac assessment, hemodynamic monitoring, NCLEX cardiology",
    color: "#DC2626",
    colorAccent: "#FEE2E2",
    iconName: "Heart",
    introduction: "Cardiovascular conditions are among the most commonly encountered in clinical nursing and the most heavily tested topics on nursing licensure exams. From interpreting cardiac rhythms and managing hemodynamic instability to understanding how electrolyte imbalances affect the heart, cardiology nursing requires a deep understanding of cardiac anatomy, physiology, and pharmacology.",
    whyItMatters: "Cardiac emergencies are time-sensitive — early recognition and intervention directly impact patient survival. Nurses who understand cardiac rhythm interpretation, hemodynamic monitoring, and the physiological effects of electrolyte imbalances on cardiac conduction are better equipped to detect subtle changes, anticipate complications, and implement life-saving interventions. Cardiology content appears across multiple NCLEX domains including physiological integrity, pharmacology, and reduction of risk potential.",
    topics: [
      { slug: "cardiac-rhythm-interpretation-nursing", title: "Cardiac Rhythm Interpretation", description: "Master ECG rhythm identification, normal and abnormal rhythms, and the systematic approach to cardiac rhythm interpretation for clinical nursing practice.", category: "Cardiovascular", color: "#DC2626", iconName: "Activity" },
      { slug: "hemodynamic-monitoring-nursing", title: "Hemodynamic Monitoring", description: "Learn arterial line monitoring, CVP interpretation, cardiac output assessment, and nursing management of hemodynamically unstable patients.", category: "Critical Care", color: "#7C3AED", iconName: "Activity" },
      { slug: "hyperkalemia-effects-on-heart", title: "Hyperkalemia Effects on the Heart", description: "Understand the progressive ECG changes of hyperkalemia from peaked T waves to sine wave pattern, and rapid nursing interventions to prevent cardiac arrest.", category: "Electrolytes & Cardiac", color: "#DC2626", iconName: "Heart" },
      { slug: "hyperkalemia-vs-hypokalemia-cardiac", title: "Hyperkalemia vs Hypokalemia Cardiac Effects", description: "Side-by-side comparison of how high and low potassium produce opposite but equally dangerous cardiac dysrhythmias and ECG changes.", category: "Electrolytes & Cardiac", color: "#7C3AED", iconName: "Heart" },
      { slug: "qrs-complex-explained-for-nurses", title: "QRS Complex Explained for Nurses", description: "Master QRS morphology, normal duration, bundle branch blocks, and the clinical significance of QRS width abnormalities in nursing assessment.", category: "Cardiac & ECG", color: "#E11D48", iconName: "Activity" },
      { slug: "potassium-effects-on-cardiac-conduction", title: "Potassium Effects on Cardiac Conduction", description: "Learn how potassium governs every phase of the cardiac action potential and understand ECG changes at each potassium level.", category: "Electrolytes & Cardiac", color: "#DC2626", iconName: "Heart" },
      { slug: "sepsis-nursing-interventions", title: "Sepsis Nursing Interventions", description: "Early recognition, Hour-1 Bundle implementation, and hemodynamic management in sepsis — a critical cardiovascular emergency in nursing.", category: "Critical Care", color: "#DC2626", iconName: "Stethoscope" },
    ],
    faqs: [
      { question: "What are the most important cardiac rhythms nurses must recognize?", answer: "Nurses must be able to identify normal sinus rhythm, sinus bradycardia, sinus tachycardia, atrial fibrillation, atrial flutter, SVT, ventricular tachycardia, ventricular fibrillation, asystole, and heart blocks (first, second, and third degree). Recognition of lethal rhythms (V-tach, V-fib, asystole) and rhythms requiring immediate intervention is especially critical." },
      { question: "How do electrolyte imbalances affect the heart?", answer: "Potassium, calcium, and magnesium directly affect cardiac conduction. Hyperkalemia causes peaked T waves, widened QRS, and can progress to cardiac arrest. Hypokalemia produces flattened T waves, U waves, and predisposes to dangerous dysrhythmias. Hypocalcemia prolongs the QT interval, while hypercalcemia shortens it. Hypomagnesemia increases the risk of torsades de pointes." },
      { question: "What hemodynamic parameters should nurses monitor?", answer: "Key hemodynamic parameters include heart rate, blood pressure (MAP target ≥65 mmHg), central venous pressure (CVP), cardiac output/cardiac index, systemic vascular resistance, and pulmonary artery pressures when available. Trends are more important than single values — nurses should document and report significant changes." },
      { question: "How is cardiology tested on the NCLEX?", answer: "Cardiology appears across multiple NCLEX test plan areas. Questions test ECG interpretation, medication management (antiarrhythmics, anticoagulants, vasopressors), prioritization of cardiac emergencies, patient education, and clinical judgment in deteriorating cardiac patients. Expect scenario-based questions requiring you to integrate assessment findings with intervention selection." },
      { question: "What cardiac medications should nurses know for the NCLEX?", answer: "Essential cardiac medications include: antiarrhythmics (amiodarone, adenosine), anticoagulants (heparin, warfarin, DOACs), antihypertensives (ACE inhibitors, beta-blockers, calcium channel blockers), vasopressors (norepinephrine, dopamine), nitrates, digoxin, and thrombolytics. Know indications, contraindications, monitoring parameters, and nursing considerations for each class." },
    ],
    relatedHubSlugs: ["electrolytes-nursing", "respiratory-nursing", "pharmacology-nursing"],
  },
  {
    slug: "respiratory-nursing",
    title: "Respiratory Nursing",
    metaTitle: "Respiratory Nursing Hub | Assessment, Ventilators & Respiratory Care | NurseNest",
    metaDescription: "Comprehensive respiratory nursing hub covering respiratory assessment, ventilator management, COPD nursing, oxygen therapy, ABG interpretation, and evidence-based respiratory interventions.",
    keywords: "respiratory nursing, respiratory assessment, ventilator management nursing, COPD nursing, oxygen therapy, ABG interpretation, NCLEX respiratory",
    color: "#0891B2",
    colorAccent: "#CFFAFE",
    iconName: "Stethoscope",
    introduction: "Respiratory conditions are a cornerstone of clinical nursing and a high-yield area on nursing licensure exams. From performing systematic respiratory assessments and managing ventilators to understanding the pathophysiology of COPD and interpreting ABGs, respiratory nursing demands both strong assessment skills and critical thinking ability.",
    whyItMatters: "Respiratory compromise is one of the earliest signs of clinical deterioration. Nurses who can perform thorough respiratory assessments, recognize abnormal findings, and intervene promptly are essential to patient safety. Understanding ventilator management, oxygen delivery systems, and acid-base balance enables nurses to provide complex respiratory care across all clinical settings — from medical-surgical floors to critical care units.",
    topics: [
      { slug: "ventilator-management-nursing", title: "Ventilator Management Nursing", description: "Comprehensive guide to ventilator modes, settings, waveform interpretation, alarm troubleshooting, weaning protocols, and VAP prevention for nurses.", category: "Critical Care", color: "#2563EB", iconName: "Activity" },
      { slug: "barrel-chest-copd", title: "Barrel Chest in COPD", description: "Understand how chronic air trapping in emphysema causes barrel chest and its implications for respiratory nursing assessment and patient care.", category: "Respiratory", color: "#0891B2", iconName: "Stethoscope" },
      { slug: "respiratory-assessment-nursing", title: "Respiratory Assessment Nursing", description: "Master the systematic respiratory assessment including inspection, palpation, percussion, auscultation, and integration with diagnostic findings.", category: "Respiratory", color: "#0891B2", iconName: "Stethoscope" },
      { slug: "acid-base-balance-nursing", title: "Acid-Base Balance Nursing", description: "Learn ABG interpretation, compensatory mechanisms, and nursing management of respiratory and metabolic acid-base disorders.", category: "Renal/Fluid Balance", color: "#7C3AED", iconName: "Stethoscope" },
      { slug: "metabolic-acidosis-in-aki", title: "Metabolic Acidosis in AKI", description: "Explore the pathophysiology of renal metabolic acidosis, ABG interpretation, and nursing management of acid-base imbalance in acute kidney injury.", category: "Renal & Acid-Base", color: "#7C3AED", iconName: "Stethoscope" },
    ],
    faqs: [
      { question: "What are the key components of a respiratory assessment?", answer: "A systematic respiratory assessment includes: inspection (respiratory rate, pattern, depth, use of accessory muscles, chest symmetry, skin color), palpation (chest expansion, tactile fremitus, subcutaneous emphysema), percussion (resonance, hyperresonance, dullness), and auscultation (breath sounds in all lobes — normal vesicular, bronchovesicular, and bronchial; adventitious sounds including crackles, wheezes, rhonchi, and stridor). Integrate findings with SpO2, ABG results, and chest X-ray when available." },
      { question: "What ventilator modes should nurses understand?", answer: "Essential ventilator modes include: AC (Assist-Control) — delivers a set volume or pressure with every breath; SIMV (Synchronized Intermittent Mandatory Ventilation) — delivers mandatory breaths synchronized with patient effort; PSV (Pressure Support Ventilation) — augments spontaneous breaths with set pressure; CPAP — continuous positive airway pressure for spontaneously breathing patients; and APRV/BiLevel — alternating high and low pressure for ARDS. Understanding when each mode is used and how to troubleshoot alarms is critical." },
      { question: "How do nurses interpret ABG results?", answer: "ABG interpretation follows a systematic approach: (1) Assess pH — acidosis (<7.35) or alkalosis (>7.45); (2) Evaluate PaCO2 — respiratory component (normal 35-45 mmHg); (3) Evaluate HCO3 — metabolic component (normal 22-26 mEq/L); (4) Determine primary disorder — which value matches the pH direction; (5) Assess compensation — partial, full, or uncompensated. Clinical correlation with patient presentation is essential." },
      { question: "What are the most common respiratory medications?", answer: "Key respiratory medications include: bronchodilators (albuterol, ipratropium), inhaled corticosteroids (fluticasone, budesonide), systemic corticosteroids (methylprednisolone), leukotriene modifiers (montelukast), mucolytics (acetylcysteine), supplemental oxygen, and antibiotics for respiratory infections. Know the difference between rescue and maintenance inhalers, and proper inhaler technique education for patients." },
      { question: "How is respiratory content tested on the NCLEX?", answer: "Respiratory questions appear frequently on the NCLEX, testing: assessment findings and their significance, oxygen therapy management, ventilator care and troubleshooting, medication administration (especially inhaler technique), ABG interpretation, prioritization of respiratory emergencies, and patient education for chronic respiratory conditions. Expect scenario-based questions requiring clinical judgment." },
    ],
    relatedHubSlugs: ["cardiology-nursing", "electrolytes-nursing", "pharmacology-nursing"],
  },
  {
    slug: "endocrine-nursing",
    title: "Endocrine Nursing",
    metaTitle: "Endocrine Nursing Hub | Diabetes, Thyroid & Hormonal Disorders | NurseNest",
    metaDescription: "Comprehensive endocrine nursing hub covering diabetes management, thyroid disorders, adrenal conditions, insulin therapy, and evidence-based endocrine nursing interventions for exam prep.",
    keywords: "endocrine nursing, diabetes nursing management, thyroid disorders nursing, insulin therapy, DKA nursing, endocrine assessment, NCLEX endocrine",
    color: "#D97706",
    colorAccent: "#FEF3C7",
    iconName: "Zap",
    introduction: "Endocrine disorders — particularly diabetes mellitus — are among the most prevalent conditions nurses encounter across all clinical settings. Understanding hormonal regulation, glucose management, thyroid dysfunction, and adrenal disorders is essential for providing safe, evidence-based nursing care. Endocrine content is heavily tested on the NCLEX and other nursing licensure examinations.",
    whyItMatters: "Endocrine disorders affect virtually every organ system and significantly impact how patients respond to illness, surgery, and medications. A nurse who understands the pathophysiology of diabetic ketoacidosis, the differences between hyperthyroidism and hypothyroidism, or the signs of adrenal crisis can recognize life-threatening complications early and intervene appropriately. Diabetes alone affects millions of patients, making glucose monitoring, insulin administration, and patient education fundamental nursing competencies.",
    topics: [
      { slug: "diabetes-nursing-management", title: "Diabetes Nursing Management", description: "Complete guide to diabetes nursing including type 1 vs type 2 pathophysiology, insulin therapy, oral hypoglycemics, DKA vs HHS, and patient education strategies.", category: "Endocrine", color: "#D97706", iconName: "Zap" },
    ],
    faqs: [
      { question: "What is the difference between DKA and HHS?", answer: "Diabetic ketoacidosis (DKA) occurs primarily in Type 1 diabetes with severe insulin deficiency, causing hyperglycemia (>250 mg/dL), metabolic acidosis (pH <7.30), ketone production, and Kussmaul respirations. Hyperosmolar hyperglycemic state (HHS) occurs in Type 2 diabetes with extreme hyperglycemia (>600 mg/dL), severe dehydration, hyperosmolality, but minimal or no ketosis. DKA develops rapidly (hours); HHS develops gradually (days to weeks). Both require IV fluid resuscitation and insulin therapy." },
      { question: "What are the key nursing considerations for insulin therapy?", answer: "Critical nursing considerations include: verifying insulin type and dose (insulin is a high-alert medication), proper injection technique and site rotation, understanding onset/peak/duration for each insulin type (rapid: lispro/aspart — onset 15 min, peak 1-2 hr; regular: onset 30 min, peak 2-4 hr; NPH: onset 1-2 hr, peak 4-12 hr; long-acting: glargine/detemir — no peak), monitoring for hypoglycemia, and never omitting basal insulin without an order." },
      { question: "How do thyroid disorders present in nursing assessment?", answer: "Hypothyroidism presents with fatigue, weight gain, cold intolerance, constipation, dry skin, bradycardia, and depression. Hyperthyroidism presents with the opposite: weight loss, heat intolerance, diarrhea, tachycardia, anxiety, tremor, and exophthalmos (Graves disease). Thyroid storm is a life-threatening emergency with extreme tachycardia, fever, and altered mental status requiring immediate intervention." },
      { question: "What endocrine emergencies should nurses recognize?", answer: "Critical endocrine emergencies include: DKA (fruity breath, Kussmaul respirations, altered LOC), HHS (extreme dehydration, neurological changes), thyroid storm (fever, tachycardia >140, altered mental status), myxedema coma (hypothermia, bradycardia, altered LOC), and adrenal crisis (hypotension, hyponatremia, hyperkalemia). All require rapid recognition and immediate treatment." },
      { question: "How is endocrine content tested on the NCLEX?", answer: "Endocrine questions on the NCLEX commonly test: insulin administration and management, recognition of hypo/hyperglycemia, DKA vs HHS differentiation, thyroid disorder assessment, medication management (levothyroxine, methimazole, insulin types), patient education for diabetes self-management, and prioritization during endocrine emergencies. Expect questions requiring integration of lab values with clinical presentation." },
    ],
    relatedHubSlugs: ["electrolytes-nursing", "pharmacology-nursing", "cardiology-nursing"],
  },
  {
    slug: "neurology-nursing",
    title: "Neurology Nursing",
    metaTitle: "Neurology Nursing Hub | Neurological Assessment & Interventions | NurseNest",
    metaDescription: "Comprehensive neurology nursing hub covering neurological assessment, stroke care, seizure management, ICP monitoring, and evidence-based neurological nursing interventions for exam prep.",
    keywords: "neurology nursing, neurological assessment nursing, stroke nursing, seizure management, ICP monitoring, Glasgow Coma Scale, NCLEX neurology",
    color: "#7C3AED",
    colorAccent: "#EDE9FE",
    iconName: "Brain",
    introduction: "Neurological nursing encompasses the assessment and management of conditions affecting the brain, spinal cord, and peripheral nervous system. From performing systematic neurological assessments and recognizing stroke symptoms to managing increased intracranial pressure and seizure precautions, neurology nursing requires keen observation skills and rapid clinical decision-making.",
    whyItMatters: "Neurological changes are often the earliest indicator of patient deterioration. A nurse who can perform a thorough neurological assessment, interpret Glasgow Coma Scale scores, recognize signs of increased intracranial pressure, and implement stroke protocols can mean the difference between recovery and permanent disability. Neurology content on the NCLEX tests clinical judgment, prioritization, and the ability to integrate complex assessment findings.",
    topics: [
      { slug: "neurological-assessment-nursing", title: "Neurological Assessment Nursing", description: "Master the systematic neurological assessment including level of consciousness, pupil response, motor and sensory function, cranial nerve assessment, and Glasgow Coma Scale scoring.", category: "Neurological", color: "#7C3AED", iconName: "Brain" },
    ],
    faqs: [
      { question: "What are the components of a neurological assessment?", answer: "A complete neurological assessment includes: level of consciousness (GCS scoring), orientation (person, place, time, situation), pupil assessment (size, shape, reactivity, accommodation), motor function (strength, symmetry, abnormal posturing — decorticate vs decerebrate), sensory function (light touch, pain, proprioception), cranial nerve assessment (I-XII), deep tendon reflexes, cerebellar function (coordination, gait), and vital sign patterns (Cushing triad for ICP)." },
      { question: "What is the Glasgow Coma Scale and how is it scored?", answer: "The Glasgow Coma Scale (GCS) assesses level of consciousness using three components: Eye Opening (4=spontaneous, 3=to voice, 2=to pain, 1=none), Verbal Response (5=oriented, 4=confused, 3=inappropriate words, 2=incomprehensible sounds, 1=none), and Motor Response (6=obeys commands, 5=localizes pain, 4=withdraws, 3=abnormal flexion/decorticate, 2=extension/decerebrate, 1=none). Total score ranges from 3-15; a score ≤8 indicates severe brain injury and typically requires intubation." },
      { question: "What are the signs of increased intracranial pressure?", answer: "Early signs of increased ICP include: headache (especially morning), nausea/vomiting (often projectile), altered level of consciousness, restlessness, and papilledema. Late signs include Cushing triad (hypertension with widening pulse pressure, bradycardia, irregular respirations), unilateral or bilateral pupil dilation, and abnormal posturing (decorticate → decerebrate → flaccid). Late signs indicate impending herniation and require emergency intervention." },
      { question: "How does the NCLEX test neurology content?", answer: "Neurology questions on the NCLEX commonly test: neurological assessment techniques and findings, stroke recognition (FAST) and acute management, seizure precautions and post-ictal care, ICP management and positioning, medication management (anticonvulsants, osmotic diuretics, thrombolytics for stroke), prioritization of neurological emergencies, and patient/family education for chronic neurological conditions." },
      { question: "What are the key nursing interventions for stroke?", answer: "For ischemic stroke: activate stroke protocol, document 'last known well' time, facilitate rapid CT scan, prepare for potential tPA administration (within 4.5 hours of symptom onset), monitor neurological status q15min, maintain head of bed flat (or per protocol), manage blood pressure per protocol, and initiate fall and aspiration precautions. For hemorrhagic stroke: maintain strict blood pressure control, elevate HOB 30 degrees, minimize stimulation, and prepare for potential surgical intervention." },
    ],
    relatedHubSlugs: ["cardiology-nursing", "pharmacology-nursing", "respiratory-nursing"],
  },
  {
    slug: "electrolytes-nursing",
    title: "Electrolytes & Fluid Balance Nursing",
    metaTitle: "Electrolytes & Fluid Balance Nursing Hub | Imbalances, Labs & Interventions | NurseNest",
    metaDescription: "Comprehensive electrolytes and fluid balance nursing hub covering potassium, sodium, calcium imbalances, acid-base disorders, IV fluid therapy, and evidence-based nursing interventions.",
    keywords: "electrolyte imbalance nursing, fluid balance nursing, hyperkalemia nursing, hyponatremia nursing, acid-base balance, IV fluids nursing, NCLEX electrolytes",
    color: "#059669",
    colorAccent: "#D1FAE5",
    iconName: "Beaker",
    introduction: "Electrolyte and fluid balance management is one of the most critical and frequently tested areas in nursing. From understanding how potassium affects cardiac conduction to recognizing the signs of fluid volume deficit or overload, nurses must be able to interpret lab values, correlate findings with clinical presentation, and implement evidence-based interventions to prevent life-threatening complications.",
    whyItMatters: "Electrolyte imbalances can cause cardiac dysrhythmias, seizures, respiratory failure, and death. Fluid imbalances affect perfusion, organ function, and medication effectiveness. Nurses who understand the physiology of electrolyte and fluid regulation can anticipate which patients are at risk, recognize early signs of imbalance, interpret lab values in clinical context, and intervene before critical complications develop. This topic is heavily weighted on the NCLEX across multiple content areas.",
    topics: [
      { slug: "fluid-electrolyte-imbalance-nursing", title: "Fluid & Electrolyte Imbalance Nursing", description: "Comprehensive guide to recognizing and managing fluid and electrolyte imbalances including hyponatremia, hypernatremia, hypokalemia, hyperkalemia, and fluid volume disorders.", category: "Renal/Fluid Balance", color: "#059669", iconName: "Beaker" },
      { slug: "why-burns-cause-hyperkalemia", title: "Why Burns Cause Hyperkalemia", description: "Understand how massive cellular destruction in burn injuries releases intracellular potassium, creating life-threatening electrolyte emergencies.", category: "Electrolytes & Burns", color: "#EA580C", iconName: "Zap" },
      { slug: "potassium-effects-on-cardiac-conduction", title: "Potassium Effects on Cardiac Conduction", description: "Learn how potassium governs every phase of the cardiac action potential and the ECG changes at each potassium level.", category: "Electrolytes & Cardiac", color: "#DC2626", iconName: "Heart" },
      { slug: "hyperkalemia-effects-on-heart", title: "Hyperkalemia Effects on the Heart", description: "Understand the progressive ECG changes of hyperkalemia and rapid nursing interventions to prevent cardiac arrest.", category: "Electrolytes & Cardiac", color: "#DC2626", iconName: "Heart" },
      { slug: "hyperkalemia-vs-hypokalemia-cardiac", title: "Hyperkalemia vs Hypokalemia Cardiac Effects", description: "Side-by-side comparison of how high and low potassium produce opposite but equally dangerous cardiac dysrhythmias.", category: "Electrolytes & Cardiac", color: "#7C3AED", iconName: "Heart" },
      { slug: "acid-base-balance-nursing", title: "Acid-Base Balance Nursing", description: "Master ABG interpretation, compensatory mechanisms, and nursing management of respiratory and metabolic acid-base disorders.", category: "Renal/Fluid Balance", color: "#7C3AED", iconName: "Stethoscope" },
      { slug: "metabolic-acidosis-in-aki", title: "Metabolic Acidosis in AKI", description: "Explore the pathophysiology of renal metabolic acidosis, ABG interpretation, and nursing management of acid-base imbalance in acute kidney injury.", category: "Renal & Acid-Base", color: "#7C3AED", iconName: "Beaker" },
      { slug: "pyloric-stenosis-metabolic-alkalosis", title: "Pyloric Stenosis & Metabolic Alkalosis", description: "Discover why pyloric stenosis causes the classic hypochloremic, hypokalemic metabolic alkalosis and how to manage it before surgery.", category: "Pediatric & Acid-Base", color: "#0891B2", iconName: "Activity" },
      { slug: "fluid-status-assessment", title: "Fluid Status Assessment", description: "Master fluid balance assessment including signs of dehydration and fluid overload, I&O monitoring, daily weights, and hemodynamic indicators.", category: "Clinical Skills", color: "#0284C7", iconName: "Activity" },
    ],
    faqs: [
      { question: "What are the most dangerous electrolyte imbalances?", answer: "The most immediately dangerous electrolyte imbalances include: hyperkalemia (>6.0 mEq/L) — causes cardiac dysrhythmias and arrest; severe hyponatremia (<120 mEq/L) — causes cerebral edema and seizures; severe hypercalcemia (>14 mg/dL) — causes cardiac arrest; and severe hypomagnesemia — predisposes to fatal cardiac dysrhythmias (torsades de pointes). Any electrolyte imbalance affecting cardiac conduction requires urgent intervention." },
      { question: "How do nurses assess fluid balance?", answer: "Fluid balance assessment includes: daily weights (most accurate measure — 1 kg = 1 L fluid), strict I&O monitoring, vital signs and orthostatic blood pressure, skin turgor and mucous membrane moisture, jugular venous distension, peripheral edema assessment, lung auscultation for crackles (fluid overload), urine specific gravity, and lab values (BUN/creatinine ratio, serum sodium, hematocrit). Trends over time are more meaningful than single measurements." },
      { question: "What is the nursing priority for hyperkalemia?", answer: "Nursing priorities for hyperkalemia include: (1) Obtain stat ECG to assess cardiac effects; (2) Administer IV calcium gluconate to stabilize cardiac membranes (does not lower K+); (3) Administer insulin with dextrose to shift K+ intracellularly; (4) Administer sodium bicarbonate if acidotic; (5) Administer kayexalate or patiromer to remove K+ from body; (6) Prepare for potential emergent dialysis if refractory; (7) Continuous cardiac monitoring; (8) Restrict dietary potassium." },
      { question: "How are electrolytes tested on the NCLEX?", answer: "Electrolyte questions on the NCLEX test: recognition of imbalance signs and symptoms, lab value interpretation, medication-induced imbalances (diuretics, ACE inhibitors), dietary teaching, IV fluid selection, priority nursing interventions for critical imbalances, and integration of electrolyte values with clinical presentation. Expect questions requiring you to identify which electrolyte imbalance matches a set of symptoms and lab values." },
      { question: "What IV fluids are used for different clinical situations?", answer: "Isotonic fluids (NS 0.9%, LR) are used for volume resuscitation and dehydration. Hypotonic fluids (0.45% NS, D5W) are used for cellular dehydration and hypernatremia. Hypertonic fluids (3% NS) are used for severe hyponatremia with seizures — administered via central line with close monitoring. D5W is isotonic in the bag but becomes hypotonic in the body. LR is preferred over NS for large-volume resuscitation to avoid hyperchloremic acidosis." },
    ],
    relatedHubSlugs: ["cardiology-nursing", "respiratory-nursing", "endocrine-nursing"],
  },
  {
    slug: "pharmacology-nursing",
    title: "Pharmacology for Nurses",
    metaTitle: "Pharmacology Nursing Hub | Drug Classes, Safety & Nursing Considerations | NurseNest",
    metaDescription: "Comprehensive pharmacology nursing hub covering medication administration safety, drug classifications, nursing considerations, dosage calculations, and evidence-based pharmacology for exam prep.",
    keywords: "pharmacology nursing, medication administration nursing, drug classes nursing, nursing considerations pharmacology, NCLEX pharmacology, medication safety nursing",
    color: "#059669",
    colorAccent: "#D1FAE5",
    iconName: "Pill",
    introduction: "Pharmacology is the backbone of safe nursing practice. From understanding drug mechanisms and classifications to administering medications safely and educating patients, pharmacological knowledge directly impacts patient outcomes. This hub brings together essential pharmacology topics for nursing students and practicing nurses preparing for licensure exams.",
    whyItMatters: "Medication errors are among the leading causes of patient harm in healthcare. Nurses who understand pharmacokinetics, drug interactions, and nursing considerations for each drug class can prevent adverse events, recognize side effects early, and provide effective patient education. Pharmacology content typically comprises 12-17% of the NCLEX test plan and appears across all clinical content areas.",
    topics: [
      { slug: "pharmacology-basics-nursing", title: "Pharmacology Basics for Nursing", description: "Foundational pharmacology concepts including pharmacokinetics, pharmacodynamics, drug classifications, and the rights of medication administration.", category: "Pharmacology", color: "#059669", iconName: "Pill" },
      { slug: "medication-administration-safety-nursing", title: "Medication Administration Safety", description: "Evidence-based medication administration practices including the rights of medication administration, high-alert medications, error prevention strategies, and patient identification.", category: "Safety/Infection Control", color: "#059669", iconName: "Shield" },
      { slug: "medication-mastery-nursing", title: "Medication Mastery for Nursing", description: "Advanced pharmacology review covering drug class comparisons, common drug interactions, therapeutic monitoring, and NCLEX-style pharmacology questions.", category: "Pharmacology", color: "#2563EB", iconName: "Pill" },
    ],
    faqs: [
      { question: "What are the rights of medication administration?", answer: "The traditional '5 Rights' are: Right Patient, Right Drug, Right Dose, Right Route, and Right Time. Many institutions now include additional rights: Right Documentation, Right Reason, Right Response, Right to Refuse, and Right Education. Following these rights consistently is the primary defense against medication errors." },
      { question: "What are high-alert medications in nursing?", answer: "High-alert medications include: insulin, anticoagulants (heparin, warfarin), opioids, IV potassium chloride, chemotherapy agents, neuromuscular blocking agents, and concentrated electrolyte solutions. These medications have the highest risk of causing significant patient harm when used in error. Most institutions require independent double-checks for high-alert medications." },
      { question: "How should nurses handle drug allergies?", answer: "Nurses must: (1) Verify allergies at every encounter and document in the medical record; (2) Distinguish between true allergies (immune-mediated reactions) and intolerances/side effects; (3) Apply allergy alert bands; (4) Check cross-reactivity (e.g., penicillin and cephalosporins); (5) Have emergency medications available when administering first-time medications; (6) Monitor patients for 15-30 minutes after administering new medications." },
      { question: "How is pharmacology tested on the NCLEX?", answer: "Pharmacology comprises approximately 12-17% of NCLEX content. Questions test: medication classification and indications, nursing considerations (what to assess before and after administration), patient education, adverse effects and when to hold medications, drug-drug and drug-food interactions, dosage calculations, and clinical judgment in medication administration scenarios. Questions are integrated throughout clinical content areas rather than tested in isolation." },
      { question: "What pharmacology study strategies work best for nursing exams?", answer: "Effective pharmacology study strategies include: studying drugs by class rather than individually, creating comparison charts for similar drug classes, focusing on nursing considerations and patient teaching rather than memorizing every side effect, using mnemonics for drug suffixes (-olol = beta-blockers, -pril = ACE inhibitors, -sartan = ARBs), practicing dosage calculations daily, and reviewing high-alert medications and their safety protocols." },
    ],
    relatedHubSlugs: ["cardiology-nursing", "endocrine-nursing", "electrolytes-nursing"],
  },
];

export function getCategoryHubBySlug(slug: string): CategoryHub | undefined {
  return CATEGORY_HUBS.find(h => h.slug === slug);
}

export function getTopicSlugsForHub(hubSlug: string): string[] {
  const hub = getCategoryHubBySlug(hubSlug);
  if (!hub) return [];
  return hub.topics.map(t => t.slug);
}

const PARENT_CATEGORY_TO_HUB: Record<string, string> = {
  "nclex-rn-cardiovascular": "cardiology-nursing",
  "nclex-rn-respiratory": "respiratory-nursing",
  "nclex-rn-endocrine": "endocrine-nursing",
  "nclex-rn-neurological": "neurology-nursing",
  "nclex-rn-electrolyte": "electrolytes-nursing",
  "nclex-rn-pharmacology": "pharmacology-nursing",
};

export function getHubSlugForParentCategory(parentCategorySlug: string): string | undefined {
  return PARENT_CATEGORY_TO_HUB[parentCategorySlug];
}

export function findParentHubForTopic(topicSlug: string): CategoryHub | undefined {
  return CATEGORY_HUBS.find(h => h.topics.some(t => t.slug === topicSlug));
}

export function findPrimaryHubForTopic(topicSlug: string, parentCategorySlug?: string): CategoryHub | undefined {
  if (parentCategorySlug) {
    const hubSlug = PARENT_CATEGORY_TO_HUB[parentCategorySlug];
    if (hubSlug) {
      const hub = getCategoryHubBySlug(hubSlug);
      if (hub) return hub;
    }
  }
  return findParentHubForTopic(topicSlug);
}
