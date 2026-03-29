export interface ParamedicFlashcard {
  front: string;
  back: string;
  rationale?: string;
}

export interface ParamedicDeck {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  cards: ParamedicFlashcard[];
}

export const paramedicDecks: ParamedicDeck[] = [
  {
    title: "Airway Management",
    slug: "paramedic-airway-management",
    description: "Essential airway assessment and management concepts for paramedic certification, including basic and advanced airway techniques.",
    tags: ["paramedic", "airway", "NREMT", "BVM", "intubation"],
    cards: [
      {
        front: "What is the recommended rate of ventilation for an adult patient using a BVM?",
        back: "10–12 breaths per minute (one breath every 5–6 seconds).",
        rationale: "Over-ventilation increases intrathoracic pressure, reduces venous return, and worsens outcomes in cardiac arrest."
      },
      {
        front: "What is the maximum size OPA appropriate for an adult?",
        back: "Size 5 (100 mm). OPA sizing is measured from the corner of the mouth to the earlobe or angle of the jaw.",
        rationale: "An improperly sized OPA can push the tongue posteriorly and worsen obstruction."
      },
      {
        front: "When is a nasopharyngeal airway (NPA) contraindicated?",
        back: "Suspected basilar skull fracture (signs include raccoon eyes, Battle sign, CSF rhinorrhea/otorrhea).",
        rationale: "An NPA could enter the cranial vault through a fractured cribriform plate."
      },
      {
        front: "What is the proper NPA sizing technique?",
        back: "Measure from the tip of the nose to the earlobe. Diameter should approximate the patient's little finger.",
        rationale: "Correct sizing prevents mucosal trauma and ensures effective airway patency."
      },
      {
        front: "What tidal volume should be delivered with each BVM ventilation in an adult?",
        back: "Approximately 500–600 mL (enough to produce visible chest rise).",
        rationale: "Excessive volumes cause gastric distension and increase aspiration risk."
      },
      {
        front: "What is the Sellick maneuver and when is it used?",
        back: "Cricoid pressure applied during ventilation to occlude the esophagus and reduce gastric insufflation. Used during intubation attempts to improve visualization.",
        rationale: "Current evidence is mixed; some protocols have moved away from routine Sellick maneuver use."
      },
      {
        front: "What are the indications for endotracheal intubation in the prehospital setting?",
        back: "Inability to maintain a patent airway, inability to protect against aspiration, need for prolonged ventilatory support, cardiac arrest, and GCS ≤ 8.",
        rationale: "ETI provides the most definitive airway but requires ongoing competency maintenance."
      },
      {
        front: "Name three methods to confirm correct endotracheal tube placement.",
        back: "1) Waveform capnography (gold standard), 2) auscultation of bilateral breath sounds and absence of epigastric sounds, 3) visualization of tube passing through cords.",
        rationale: "Unrecognized esophageal intubation is a preventable cause of death."
      },
      {
        front: "What is the normal adult ETCO2 range?",
        back: "35–45 mmHg.",
        rationale: "ETCO2 below 10 mmHg during CPR suggests poor perfusion; a sudden rise above 20 mmHg may indicate ROSC."
      },
      {
        front: "What is a supraglottic airway device? Give two examples.",
        back: "A device placed above the glottis to maintain an airway without direct visualization of the vocal cords. Examples: King LT (laryngeal tube) and i-gel.",
        rationale: "Supraglottic devices are first-line advanced airways in many EMS systems due to ease of placement."
      },
      {
        front: "What is the jaw-thrust maneuver and when should it be used?",
        back: "Lifting the mandible anteriorly without extending the neck. Used for patients with suspected cervical spine injury.",
        rationale: "The head-tilt chin-lift should be avoided in trauma patients to prevent worsening a potential spinal cord injury."
      },
      {
        front: "What SpO2 value indicates the need for supplemental oxygen?",
        back: "SpO2 < 94% in most patients. Target 94–99% in general; 88–92% in COPD patients.",
        rationale: "High-flow oxygen in COPD patients may suppress hypoxic drive, though hypoxia should never be tolerated."
      },
      {
        front: "What is rapid sequence intubation (RSI)?",
        back: "Administration of a sedative and a neuromuscular blocker in rapid succession to facilitate endotracheal intubation while minimizing aspiration risk.",
        rationale: "RSI requires advanced paramedic training and protocol authorization. Common agents: etomidate (sedative) + succinylcholine or rocuronium (paralytic)."
      }
    ]
  },
  {
    title: "Trauma Assessment",
    slug: "paramedic-trauma-assessment",
    description: "Trauma assessment principles including primary survey, secondary survey, and critical trauma interventions for paramedics.",
    tags: ["paramedic", "trauma", "NREMT", "assessment", "ITLS"],
    cards: [
      {
        front: "What are the components of the primary survey (ABCDE)?",
        back: "A = Airway (with C-spine protection), B = Breathing, C = Circulation (hemorrhage control), D = Disability (neurological status), E = Exposure/Environment.",
        rationale: "The primary survey identifies and treats immediately life-threatening conditions in order of priority."
      },
      {
        front: "What is the lethal triad of trauma?",
        back: "Hypothermia, acidosis, and coagulopathy.",
        rationale: "Each element worsens the others, creating a vicious cycle that increases mortality. Prevention of hypothermia is a key prehospital intervention."
      },
      {
        front: "What are the signs of a tension pneumothorax?",
        back: "Severe dyspnea, absent breath sounds on the affected side, tracheal deviation (late sign), jugular venous distension, hypotension, and tachycardia.",
        rationale: "Tension pneumothorax requires immediate needle decompression — do not wait for X-ray confirmation in the field."
      },
      {
        front: "Where is needle decompression performed for a tension pneumothorax?",
        back: "2nd intercostal space, midclavicular line on the affected side (or 4th–5th intercostal space, anterior axillary line).",
        rationale: "Insert over the top of the rib to avoid the intercostal neurovascular bundle running along the inferior border."
      },
      {
        front: "What is the Cushing triad and what does it indicate?",
        back: "Hypertension, bradycardia, and irregular respirations. It indicates increased intracranial pressure (ICP).",
        rationale: "This is a late and ominous finding suggesting brainstem herniation. Rapid transport is critical."
      },
      {
        front: "What are the indications for spinal motion restriction (SMR)?",
        back: "Mechanism of injury suggesting spinal trauma PLUS altered mental status, midline spinal tenderness, neurological deficit, or distracting injury.",
        rationale: "Modern protocols use selective SMR criteria rather than immobilizing all trauma patients."
      },
      {
        front: "What is the difference between a flail chest and a simple rib fracture?",
        back: "Flail chest involves ≥ 2 adjacent ribs fractured in ≥ 2 places each, creating a free-floating segment that moves paradoxically during respiration.",
        rationale: "The primary concern with flail chest is the underlying pulmonary contusion, not the mechanical instability."
      },
      {
        front: "What are the signs of cardiac tamponade (Beck triad)?",
        back: "Hypotension, muffled heart sounds, and jugular venous distension (JVD).",
        rationale: "Caused by fluid accumulation in the pericardial sac compressing the heart. Requires emergent pericardiocentesis in the ED."
      },
      {
        front: "What is the Glasgow Coma Scale (GCS) range and what score indicates severe brain injury?",
        back: "GCS ranges from 3 to 15. A score of ≤ 8 indicates severe brain injury and the need for definitive airway management.",
        rationale: "GCS 9–12 = moderate injury, GCS 13–15 = mild injury. Serial GCS monitoring is essential."
      },
      {
        front: "How much blood can be lost into the following compartments: chest, abdomen, pelvis, femur?",
        back: "Chest: up to 3 L per hemithorax. Abdomen: entire blood volume. Pelvis: up to 3 L. Femur: 1–1.5 L per femur.",
        rationale: "Internal hemorrhage in these spaces can be massive and occult. Maintain high index of suspicion."
      },
      {
        front: "What is the purpose of a pelvic binder?",
        back: "To reduce pelvic volume, stabilize fracture fragments, and control hemorrhage from disrupted pelvic vasculature.",
        rationale: "Applied at the level of the greater trochanters. Do not remove in the field once applied."
      },
      {
        front: "What is a hemothorax and how is it managed prehospitally?",
        back: "Blood accumulation in the pleural space. Prehospital management includes high-flow oxygen, IV access, fluid resuscitation, and rapid transport.",
        rationale: "Massive hemothorax (>1500 mL) requires surgical intervention. Decreased breath sounds and dullness to percussion on the affected side."
      },
      {
        front: "What is permissive hypotension in trauma?",
        back: "Targeting a systolic BP of 80–90 mmHg (or palpable radial pulse) to maintain minimal perfusion without disrupting clot formation.",
        rationale: "Aggressive fluid resuscitation can worsen hemorrhage by increasing pressure and diluting clotting factors."
      }
    ]
  },
  {
    title: "Cardiology & ACLS",
    slug: "paramedic-cardiology-acls",
    description: "Cardiac assessment, ECG interpretation, and Advanced Cardiac Life Support protocols for paramedic practice.",
    tags: ["paramedic", "cardiology", "ACLS", "NREMT", "ECG", "cardiac arrest"],
    cards: [
      {
        front: "What are the shockable cardiac arrest rhythms?",
        back: "Ventricular fibrillation (VF) and pulseless ventricular tachycardia (pVT).",
        rationale: "Defibrillation is the definitive treatment. Early defibrillation improves survival by approximately 10% per minute."
      },
      {
        front: "What are the non-shockable cardiac arrest rhythms?",
        back: "Asystole and pulseless electrical activity (PEA).",
        rationale: "Treatment focuses on high-quality CPR, epinephrine, and identifying/treating reversible causes (H's and T's)."
      },
      {
        front: "List the H's and T's (reversible causes of cardiac arrest).",
        back: "H's: Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia. T's: Tension pneumothorax, Tamponade (cardiac), Toxins, Thrombosis (pulmonary/coronary).",
        rationale: "Identifying and treating reversible causes is essential for ROSC, especially in PEA arrest."
      },
      {
        front: "What is the recommended defibrillation energy for a biphasic defibrillator in VF/pVT?",
        back: "120–200 J for the initial shock (manufacturer-specific); if unknown, use maximum available energy.",
        rationale: "Biphasic defibrillators are more effective at lower energy levels compared to monophasic devices."
      },
      {
        front: "What is the epinephrine dose and interval for cardiac arrest?",
        back: "1 mg IV/IO every 3–5 minutes.",
        rationale: "Epinephrine is given for all cardiac arrest rhythms. In VF/pVT, give after the second shock."
      },
      {
        front: "What is the amiodarone dose for refractory VF/pVT?",
        back: "First dose: 300 mg IV/IO bolus. Second dose: 150 mg IV/IO.",
        rationale: "Amiodarone is given after the third shock if VF/pVT persists despite CPR and defibrillation."
      },
      {
        front: "What are the characteristics of a STEMI on a 12-lead ECG?",
        back: "ST-segment elevation ≥ 1 mm in two or more contiguous leads (≥ 2 mm in leads V1–V3).",
        rationale: "STEMI requires rapid activation of the cardiac catheterization lab. Door-to-balloon time goal is < 90 minutes."
      },
      {
        front: "What is the treatment for symptomatic bradycardia?",
        back: "Atropine 0.5 mg IV every 3–5 minutes (max 3 mg). If atropine fails: transcutaneous pacing or dopamine/epinephrine infusion.",
        rationale: "Symptomatic bradycardia includes hypotension, altered mental status, chest pain, or signs of shock."
      },
      {
        front: "What is the first-line treatment for stable narrow-complex SVT?",
        back: "Vagal maneuvers (Valsalva, carotid massage), followed by adenosine 6 mg rapid IV push. If ineffective, adenosine 12 mg IV push.",
        rationale: "Adenosine must be given as a rapid push followed by a 20 mL NS flush due to its extremely short half-life (< 10 seconds)."
      },
      {
        front: "When is synchronized cardioversion indicated?",
        back: "Unstable tachycardia with a pulse — SVT, atrial fibrillation, atrial flutter, or monomorphic VT with signs of hemodynamic instability.",
        rationale: "Sync mode delivers the shock during the R wave to avoid the relative refractory period and reduce the risk of triggering VF."
      },
      {
        front: "What is the compression-to-ventilation ratio for adult CPR?",
        back: "30:2 for one or two rescuers without an advanced airway. With an advanced airway: continuous compressions at 100–120/min with 1 breath every 6 seconds.",
        rationale: "Compression depth should be at least 2 inches (5 cm) with full chest recoil between compressions."
      },
      {
        front: "What is pulseless electrical activity (PEA)?",
        back: "An organized electrical rhythm on the monitor without a palpable pulse. It is NOT a specific rhythm but a clinical scenario.",
        rationale: "PEA has a potentially treatable underlying cause. Focus on the H's and T's while performing high-quality CPR."
      },
      {
        front: "What are the signs of right ventricular MI?",
        back: "Hypotension, JVD, and clear lung sounds in the setting of an inferior STEMI. ST elevation in V4R confirms.",
        rationale: "Avoid nitroglycerin and aggressive diuresis in right ventricular MI — the patient is preload-dependent. Give fluid bolus."
      },
      {
        front: "What is the target compression fraction during CPR?",
        back: "At least 60%, ideally > 80%. Compression fraction is the percentage of time during cardiac arrest in which compressions are being performed.",
        rationale: "Minimizing interruptions in compressions is one of the strongest predictors of survival."
      }
    ]
  },
  {
    title: "Pharmacology",
    slug: "paramedic-pharmacology",
    description: "Key medications, dosages, and pharmacological principles for paramedic certification and prehospital care.",
    tags: ["paramedic", "pharmacology", "NREMT", "medications", "drug dosing"],
    cards: [
      {
        front: "What is the dose of epinephrine for adult anaphylaxis?",
        back: "0.3–0.5 mg IM (1:1,000 concentration / 1 mg/mL) into the anterolateral thigh. May repeat every 5–15 minutes.",
        rationale: "IM route is preferred over IV for anaphylaxis. IV epinephrine requires careful titration and is reserved for refractory anaphylaxis or cardiac arrest."
      },
      {
        front: "What is the pediatric dose of epinephrine for anaphylaxis?",
        back: "0.01 mg/kg IM (max 0.3 mg) of 1:1,000 (1 mg/mL) concentration.",
        rationale: "Epinephrine is the ONLY first-line treatment for anaphylaxis. Delay increases mortality."
      },
      {
        front: "What is the standard adult dose of naloxone for opioid overdose?",
        back: "0.4–2 mg IV/IM/IN. May repeat every 2–3 minutes. Intranasal dose is typically 4 mg.",
        rationale: "Titrate to adequate respiratory effort, not full consciousness. Naloxone has a shorter half-life than most opioids — monitor for re-sedation."
      },
      {
        front: "What is the dose of aspirin for suspected acute coronary syndrome?",
        back: "160–325 mg chewed (non-enteric-coated preferred).",
        rationale: "Chewing provides faster absorption. Aspirin inhibits platelet aggregation via COX-1 inhibition."
      },
      {
        front: "What is the dose of nitroglycerin for chest pain?",
        back: "0.4 mg sublingual every 5 minutes, up to 3 doses. Ensure systolic BP > 90 mmHg before each dose.",
        rationale: "Contraindicated in right ventricular infarction, recent phosphodiesterase inhibitor use (sildenafil within 24 hours, tadalafil within 48 hours), and hypotension."
      },
      {
        front: "What are the two concentrations of epinephrine and their uses?",
        back: "1:1,000 (1 mg/mL): IM for anaphylaxis and croup. 1:10,000 (0.1 mg/mL): IV/IO for cardiac arrest.",
        rationale: "Never give 1:1,000 IV push — it can cause fatal hypertension and dysrhythmias."
      },
      {
        front: "What is the dose of dextrose for adult hypoglycemia?",
        back: "25 g IV (D50W = 50 mL). Pediatric: 0.5–1 g/kg (D25W for children, D10W for neonates).",
        rationale: "Check blood glucose before administration. Target glucose > 60 mg/dL. If no IV access, give glucagon 1 mg IM."
      },
      {
        front: "What is the dose of midazolam for active seizures?",
        back: "IM: 10 mg (adults). IV: 5 mg. Intranasal: 5 mg per nostril.",
        rationale: "Benzodiazepines are first-line for active seizures. Monitor for respiratory depression."
      },
      {
        front: "What is the dose and route for ipratropium bromide?",
        back: "0.5 mg via nebulizer, often combined with albuterol for bronchospasm.",
        rationale: "Ipratropium is an anticholinergic bronchodilator. It has a slower onset than albuterol but provides additive benefit."
      },
      {
        front: "What is the dose of albuterol for bronchospasm?",
        back: "2.5 mg via nebulizer or 4–8 puffs via MDI with spacer. May repeat as needed.",
        rationale: "Albuterol is a beta-2 agonist that relaxes bronchial smooth muscle. Side effects include tachycardia and tremor."
      },
      {
        front: "What is the dose of diphenhydramine for allergic reactions?",
        back: "25–50 mg IV/IM.",
        rationale: "Diphenhydramine is an H1 antihistamine. It is a second-line adjunct in anaphylaxis — epinephrine is always first."
      },
      {
        front: "What is the dose of ondansetron (Zofran) for nausea/vomiting?",
        back: "4 mg IV/IM or 4 mg ODT (orally disintegrating tablet).",
        rationale: "Ondansetron is a 5-HT3 receptor antagonist. Useful for nausea prevention, especially post-medication administration."
      },
      {
        front: "What is the dose of fentanyl for prehospital pain management?",
        back: "1–2 mcg/kg IV/IM/IN (typical adult dose: 50–100 mcg). Intranasal: up to 2 mcg/kg.",
        rationale: "Fentanyl has rapid onset and short duration. It causes less histamine release and hypotension than morphine."
      }
    ]
  },
  {
    title: "Respiratory Emergencies",
    slug: "paramedic-respiratory-emergencies",
    description: "Assessment and management of respiratory emergencies including asthma, COPD, pneumothorax, and pulmonary embolism.",
    tags: ["paramedic", "respiratory", "NREMT", "dyspnea", "asthma", "COPD"],
    cards: [
      {
        front: "What are the classic signs of an asthma exacerbation?",
        back: "Wheezing (expiratory), dyspnea, tachypnea, accessory muscle use, prolonged expiratory phase, and decreased air movement.",
        rationale: "A silent chest in a known asthmatic is an ominous sign indicating severe bronchospasm with minimal air movement."
      },
      {
        front: "What is the CPAP indication for prehospital use?",
        back: "Acute pulmonary edema (CHF), COPD exacerbation, and severe asthma (in some protocols). Patient must be conscious and able to maintain own airway.",
        rationale: "CPAP reduces the work of breathing and improves oxygenation. Standard pressure is 5–10 cmH2O."
      },
      {
        front: "What are the differences between asthma and COPD?",
        back: "Asthma: reversible airway obstruction, younger onset, episodic. COPD: chronic irreversible obstruction, older onset (smoking history), progressive baseline decline.",
        rationale: "Acute management is similar (bronchodilators, oxygen), but COPD patients may have chronic CO2 retention."
      },
      {
        front: "What are the signs of a pulmonary embolism?",
        back: "Sudden-onset dyspnea, pleuritic chest pain, tachycardia, tachypnea, hypoxia disproportionate to exam findings, and possible unilateral leg swelling.",
        rationale: "Risk factors: recent surgery, immobilization, DVT, oral contraceptive use, malignancy."
      },
      {
        front: "What oxygen delivery device provides the highest FiO2?",
        back: "Non-rebreather mask (NRB) at 15 L/min delivers approximately 90–95% FiO2.",
        rationale: "Bag must remain inflated. If higher FiO2 is needed, BVM with reservoir connected to 15 L/min oxygen can deliver near 100%."
      },
      {
        front: "What is the tripod position and what does it indicate?",
        back: "Patient sits upright, leans forward, and supports the upper body with hands on knees. It indicates severe respiratory distress.",
        rationale: "This position optimizes diaphragm excursion and accessory muscle use. Never force a patient in tripod position to lie supine."
      },
      {
        front: "What is the target SpO2 for a COPD patient?",
        back: "88–92%.",
        rationale: "Some COPD patients rely on hypoxic drive for respiratory stimulation. High-flow oxygen may suppress this drive, but never withhold oxygen from a hypoxic patient."
      },
      {
        front: "What is the difference between stridor and wheezing?",
        back: "Stridor: high-pitched inspiratory sound indicating upper airway obstruction. Wheezing: high-pitched expiratory sound indicating lower airway narrowing.",
        rationale: "Stridor is an emergency suggesting potential complete airway obstruction. Wheezing may be bilateral (asthma/COPD) or unilateral (foreign body)."
      },
      {
        front: "What is the prehospital treatment for severe croup?",
        back: "Nebulized racemic epinephrine (0.5 mL of 2.25% solution in 3 mL NS) and dexamethasone 0.6 mg/kg IM/PO.",
        rationale: "Cool mist and calm positioning may help. Monitor for rebound symptoms after racemic epinephrine (2–3 hours)."
      },
      {
        front: "What is an open pneumothorax and how is it managed?",
        back: "A chest wall defect allowing air to enter the pleural space. Apply a vented chest seal (or three-sided occlusive dressing) and monitor for tension pneumothorax.",
        rationale: "A completely occlusive dressing may convert an open pneumothorax to a tension pneumothorax."
      },
      {
        front: "What is capnography and what does it measure?",
        back: "Capnography measures the concentration of CO2 in exhaled air (ETCO2). Normal range: 35–45 mmHg.",
        rationale: "Waveform capnography is the gold standard for ETT placement confirmation and monitors ventilation adequacy, perfusion, and metabolism."
      },
      {
        front: "What ETCO2 reading during CPR suggests the need for improved chest compressions?",
        back: "ETCO2 consistently < 10 mmHg suggests inadequate perfusion from compressions.",
        rationale: "ETCO2 is a real-time indicator of cardiac output during CPR. A sudden increase to > 40 mmHg may indicate ROSC."
      }
    ]
  },
  {
    title: "Medical Emergencies",
    slug: "paramedic-medical-emergencies",
    description: "Assessment and management of common medical emergencies including diabetic crises, stroke, seizures, and poisoning.",
    tags: ["paramedic", "medical", "NREMT", "stroke", "diabetes", "seizure"],
    cards: [
      {
        front: "What is the Cincinnati Prehospital Stroke Scale?",
        back: "Three components: 1) Facial droop (smile), 2) Arm drift (hold arms out), 3) Speech abnormality (repeat a sentence). Any abnormality suggests stroke.",
        rationale: "Time of symptom onset is critical. Last known well time determines eligibility for thrombolytics (within 4.5 hours)."
      },
      {
        front: "What is the blood glucose level that defines hypoglycemia?",
        back: "< 60 mg/dL (some references use < 70 mg/dL).",
        rationale: "Hypoglycemia can mimic stroke, intoxication, and psychiatric emergencies. Always check glucose in altered mental status."
      },
      {
        front: "What is diabetic ketoacidosis (DKA) and how does it present?",
        back: "A life-threatening complication of type 1 diabetes. Signs: Kussmaul respirations, fruity breath odor, polyuria, polydipsia, abdominal pain, dehydration, altered mental status, blood glucose typically > 300 mg/dL.",
        rationale: "Prehospital treatment: IV fluid resuscitation (NS bolus), airway management, and rapid transport. Insulin is an ED intervention."
      },
      {
        front: "What is the difference between DKA and HHS (Hyperosmolar Hyperglycemic State)?",
        back: "DKA: Type 1, rapid onset, ketones present, glucose 300–800 mg/dL, Kussmaul breathing. HHS: Type 2, gradual onset, no significant ketones, glucose often > 600 mg/dL, severe dehydration.",
        rationale: "HHS has higher mortality than DKA due to severe dehydration and hyperviscosity."
      },
      {
        front: "What are the phases of a generalized tonic-clonic seizure?",
        back: "Tonic phase (sustained muscle rigidity, 10–30 sec) → Clonic phase (rhythmic jerking, 30–60 sec) → Postictal phase (confusion, drowsiness, gradual recovery).",
        rationale: "Protect the patient from injury. Do not restrain or place anything in the mouth."
      },
      {
        front: "What defines status epilepticus?",
        back: "A seizure lasting > 5 minutes or two or more seizures without return to baseline consciousness between them.",
        rationale: "Status epilepticus is a life-threatening emergency. Treat with benzodiazepines: midazolam IM/IN or diazepam IV/rectal."
      },
      {
        front: "What are the four classic signs of anaphylaxis?",
        back: "1) Urticaria/angioedema, 2) Bronchospasm/stridor, 3) Hypotension, 4) GI symptoms (nausea, vomiting, cramping).",
        rationale: "Anaphylaxis involves ≥ 2 organ systems. Epinephrine IM is the first and most important intervention."
      },
      {
        front: "What is the antidote for organophosphate poisoning?",
        back: "Atropine 2–4 mg IV (repeat every 5 minutes until secretions dry) AND pralidoxime (2-PAM) 1–2 g IV.",
        rationale: "SLUDGE/DUMBELS mnemonics: Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis / Diarrhea, Urination, Miosis, Bradycardia, Bronchospasm, Emesis, Lacrimation, Salivation."
      },
      {
        front: "What does OPQRST stand for in the history of present illness?",
        back: "O = Onset, P = Provocation/Palliation, Q = Quality, R = Radiation, S = Severity, T = Time.",
        rationale: "A systematic approach to characterizing the chief complaint. Used alongside SAMPLE history."
      },
      {
        front: "What does SAMPLE stand for?",
        back: "S = Signs/Symptoms, A = Allergies, M = Medications, P = Past medical history, L = Last oral intake, E = Events leading to the emergency.",
        rationale: "SAMPLE provides essential background information for hospital staff and guides field treatment decisions."
      },
      {
        front: "What are the signs of a heat stroke vs heat exhaustion?",
        back: "Heat stroke: core temp > 104°F (40°C), altered mental status, hot dry OR moist skin, tachycardia. Heat exhaustion: temp < 104°F, heavy sweating, weakness, normal mental status.",
        rationale: "Heat stroke is a life-threatening emergency requiring aggressive cooling. Heat exhaustion is managed with rest, cooling, and oral/IV fluids."
      },
      {
        front: "What is the treatment for suspected cyanide poisoning?",
        back: "Hydroxocobalamin (Cyanokit) 5 g IV over 15 minutes. Alternative: amyl nitrite inhalant + sodium nitrite + sodium thiosulfate.",
        rationale: "Suspect cyanide poisoning in smoke inhalation victims with altered mental status and metabolic acidosis despite oxygen therapy."
      },
      {
        front: "What are the signs of carbon monoxide poisoning?",
        back: "Headache, nausea, confusion, cherry-red skin (late/unreliable), syncope, and seizures. SpO2 may read falsely normal.",
        rationale: "Pulse oximetry cannot differentiate carboxyhemoglobin from oxyhemoglobin. Treat with 100% oxygen via NRB or BVM."
      }
    ]
  },
  {
    title: "Pediatric & PALS",
    slug: "paramedic-pediatric-pals",
    description: "Pediatric assessment, vital sign norms, and Pediatric Advanced Life Support protocols for prehospital providers.",
    tags: ["paramedic", "pediatric", "PALS", "NREMT", "neonatal"],
    cards: [
      {
        front: "What is the most common cause of cardiac arrest in pediatric patients?",
        back: "Respiratory failure/arrest (unlike adults where cardiac causes predominate).",
        rationale: "Aggressive airway management and ventilation can prevent pediatric cardiac arrest. By the time a child arrests, the prognosis is poor."
      },
      {
        front: "How do you calculate normal systolic BP for a child aged 1–10 years?",
        back: "Minimum normal systolic BP = 70 + (2 × age in years). Example: 5-year-old = 70 + 10 = 80 mmHg.",
        rationale: "Below this value, the child is hypotensive and likely in decompensated shock."
      },
      {
        front: "What is the pediatric dose of epinephrine for cardiac arrest?",
        back: "0.01 mg/kg IV/IO (1:10,000 concentration). Max single dose: 1 mg. Repeat every 3–5 minutes.",
        rationale: "If no IV/IO access, can give 0.1 mg/kg via endotracheal tube (1:1,000), though this route is least preferred."
      },
      {
        front: "What is the formula for selecting an uncuffed endotracheal tube size in a child?",
        back: "ETT size (mm) = (age in years / 4) + 4. Cuffed tube: (age / 4) + 3.5.",
        rationale: "Always have one size smaller and one size larger available. Cuffed tubes are now preferred in many systems."
      },
      {
        front: "What is the normal heart rate range for a newborn?",
        back: "120–160 bpm.",
        rationale: "Infant: 100–160. Toddler: 90–150. School age: 70–120. Adolescent: 60–100."
      },
      {
        front: "What is the normal respiratory rate for a newborn?",
        back: "30–60 breaths per minute.",
        rationale: "Infant: 25–50. Toddler: 20–30. School age: 15–25. Adolescent: 12–20."
      },
      {
        front: "What is the Pediatric Assessment Triangle (PAT)?",
        back: "A rapid across-the-room assessment tool evaluating: 1) Appearance (TICLS: Tone, Interactiveness, Consolability, Look/Gaze, Speech/Cry), 2) Work of Breathing, 3) Circulation to Skin.",
        rationale: "The PAT provides a 15–30 second general impression before hands-on assessment."
      },
      {
        front: "What is the initial fluid bolus for pediatric shock?",
        back: "20 mL/kg isotonic crystalloid (NS or LR). Reassess after each bolus. May repeat up to 60 mL/kg total.",
        rationale: "Give bolus over 5–20 minutes depending on severity. Reassess for signs of improvement or fluid overload."
      },
      {
        front: "What is the defibrillation energy for pediatric VF/pVT?",
        back: "First shock: 2 J/kg. Second shock: 4 J/kg. Subsequent: 4–10 J/kg (max 10 J/kg or adult dose).",
        rationale: "Use pediatric pads/dose attenuator for children < 8 years or < 25 kg if available."
      },
      {
        front: "What is the compression-to-ventilation ratio for infant CPR?",
        back: "Single rescuer: 30:2. Two healthcare providers: 15:2. Compress at a rate of 100–120/min.",
        rationale: "Infant compression technique: 2-finger technique (single rescuer) or 2-thumb encircling technique (two rescuers, preferred)."
      },
      {
        front: "What are the signs of compensated vs decompensated shock in children?",
        back: "Compensated: tachycardia, cool extremities, delayed cap refill, normal BP. Decompensated: all of above PLUS hypotension, altered mental status, weak central pulses.",
        rationale: "Children compensate for shock longer than adults. Hypotension is a late and ominous sign."
      },
      {
        front: "What is the dose of glucose for neonatal hypoglycemia?",
        back: "D10W: 2–5 mL/kg IV. Do NOT use D50W in neonates due to hyperosmolality risk.",
        rationale: "Neonatal hypoglycemia: glucose < 40 mg/dL. Risk factors: prematurity, low birth weight, maternal diabetes."
      },
      {
        front: "What are the signs of epiglottitis in a child?",
        back: "Acute onset high fever, sore throat, drooling, muffled voice, tripod/sniffing position, and stridor. Classic 4 D's: Drooling, Dysphagia, Dysphonia, Distress.",
        rationale: "Do NOT examine the throat or agitate the child. Maintain position of comfort and prepare for potential complete airway obstruction."
      }
    ]
  },
  {
    title: "EMS Operations",
    slug: "paramedic-ems-operations",
    description: "EMS operational concepts including scene safety, triage, incident command, and legal/ethical considerations.",
    tags: ["paramedic", "EMS", "NREMT", "operations", "triage", "ICS"],
    cards: [
      {
        front: "What are the components of scene size-up?",
        back: "Scene safety, BSI/PPE, mechanism of injury/nature of illness, number of patients, need for additional resources.",
        rationale: "Scene safety is ALWAYS the first priority. A provider who becomes a patient cannot help anyone."
      },
      {
        front: "What is the START triage system?",
        back: "Simple Triage And Rapid Treatment. Assess: ambulation → respirations → perfusion → mental status. Categories: Green (minor), Yellow (delayed), Red (immediate), Black (deceased/expectant).",
        rationale: "Each patient should be triaged in < 60 seconds. Walking wounded are tagged green immediately."
      },
      {
        front: "In START triage, what respiratory rate makes a patient immediate (red)?",
        back: "> 30 breaths per minute (or < 10, or apneic after repositioning airway).",
        rationale: "If not breathing after airway repositioning → Black tag. If breathing after repositioning → Red tag."
      },
      {
        front: "What is the JumpSTART triage system?",
        back: "A pediatric modification of START triage for children ages 1–8. Key difference: apneic children receive 5 rescue breaths before being tagged black.",
        rationale: "Pediatric cardiac arrest is usually respiratory in origin, so brief ventilation may restore breathing."
      },
      {
        front: "What are the components of the Incident Command System (ICS)?",
        back: "Command, Operations, Planning, Logistics, and Finance/Administration.",
        rationale: "ICS provides a standardized management structure for emergency response. The first arriving unit establishes Incident Command."
      },
      {
        front: "What does the NIMS acronym stand for?",
        back: "National Incident Management System. It provides a systematic, proactive approach to guide all levels of government, NGOs, and the private sector in incident management.",
        rationale: "NIMS integrates ICS, multiagency coordination, and public information into a unified framework."
      },
      {
        front: "What are the zones in a hazmat incident?",
        back: "Hot zone (contamination area — hazmat team only), Warm zone (decontamination corridor), Cold zone (safe area — patient treatment, command post).",
        rationale: "EMS should stage in the Cold zone and treat patients ONLY after decontamination."
      },
      {
        front: "What is implied consent?",
        back: "Legal concept allowing treatment of an unconscious or mentally incompetent patient based on the assumption that a reasonable person would consent to lifesaving treatment.",
        rationale: "Implied consent applies when a patient cannot give informed consent due to altered mental status, unconsciousness, or age (minors without guardians)."
      },
      {
        front: "What must be present for a competent adult to refuse care (informed refusal)?",
        back: "The patient must be: alert and oriented, have decision-making capacity, understand the risks of refusal, and not be under the influence of substances impairing judgment.",
        rationale: "Document the refusal thoroughly: assessment findings, risks explained, patient's statements, and witnesses."
      },
      {
        front: "What is the difference between abandonment and negligence?",
        back: "Abandonment: terminating patient care without transferring to equal or higher level of care. Negligence: failure to provide the standard of care resulting in harm (requires duty, breach, causation, damages).",
        rationale: "Both are grounds for legal action. Once patient contact is initiated, care must continue until proper transfer."
      },
      {
        front: "What is a mandatory reporter obligation for EMS?",
        back: "Paramedics are legally required to report suspected child abuse, elder abuse, sexual assault, and certain communicable diseases to appropriate authorities.",
        rationale: "Reporting requirements vary by jurisdiction. Document findings objectively without making accusations."
      },
      {
        front: "What is the minimum safe distance from a vehicle crash involving downed power lines?",
        back: "At least 100 feet (30 meters) from the downed line or energized equipment.",
        rationale: "Electricity can arc or travel through the ground. Do not approach until the power company confirms the line is de-energized."
      },
      {
        front: "What is the correct landing zone (LZ) size for a helicopter?",
        back: "Minimum 100 × 100 feet (approximately 30 × 30 meters) on flat terrain, clear of debris and obstructions.",
        rationale: "Mark corners with cones or vehicle headlights. Approach the aircraft from the front or sides, never from the rear near the tail rotor."
      }
    ]
  }
];
