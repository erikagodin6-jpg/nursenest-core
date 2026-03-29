import type { CareerQuestion } from "./rrt-questions";

export const paramedicQuestionsBatch9: CareerQuestion[] = [
  {
    id: "para-proto-001",
    stem: "A 58-year-old male presents with crushing chest pain radiating to the left arm, diaphoresis, and nausea. 12-lead ECG shows ST elevation in V1-V4. Per STEMI protocol, the paramedic should:",
    options: [
      "Transport to the nearest hospital regardless of PCI capability",
      "Activate the cardiac catheterization lab, administer aspirin, nitroglycerin (if BP permits), and transport to the nearest PCI-capable facility",
      "Administer thrombolytics in the field",
      "Wait on scene for the patient's cardiologist to be consulted"
    ],
    correctIndex: 1,
    rationale: "STEMI protocol requires early catheterization lab activation, aspirin 324 mg PO (chewed), nitroglycerin 0.4 mg SL (if SBP >90 and no RV MI/phosphodiesterase inhibitor use), and transport to a PCI-capable facility. The goal is first medical contact to balloon time <90 minutes. Bypassing a closer non-PCI hospital to reach a STEMI center is appropriate if transport time is <30 minutes additional.",
    difficulty: 3,
    category: "Protocol-Based Decision Making",
    topic: "STEMI Protocol"
  },
  {
    id: "para-proto-002",
    stem: "A patient with STEMI in leads II, III, aVF becomes hypotensive after receiving nitroglycerin. The paramedic should:",
    options: [
      "Administer a second nitroglycerin dose",
      "Stop nitroglycerin, place the patient supine, and administer a 250-500 mL normal saline bolus",
      "Administer epinephrine",
      "Begin transcutaneous pacing"
    ],
    correctIndex: 1,
    rationale: "Inferior STEMI may involve the right ventricle, which is preload-dependent. Nitroglycerin reduces preload, causing severe hypotension in RV MI patients. Treatment: discontinue nitroglycerin, place patient supine (or Trendelenburg), and administer IV fluid bolus (250-500 mL NS). Obtain a right-sided V4R lead. Morphine should also be used cautiously as it reduces preload. Avoid nitrates and diuretics in suspected RV MI.",
    difficulty: 4,
    category: "Protocol-Based Decision Making",
    topic: "STEMI Protocol"
  },
  {
    id: "para-proto-003",
    stem: "A patient presents with acute onset of unilateral facial droop, arm weakness, and slurred speech. Symptom onset was 45 minutes ago. Using the Cincinnati Prehospital Stroke Scale, how many criteria are positive?",
    options: [
      "1 of 3",
      "2 of 3",
      "All 3 of 3",
      "0 of 3"
    ],
    correctIndex: 2,
    rationale: "The Cincinnati Prehospital Stroke Scale assesses three findings: facial droop (ask patient to smile — unilateral droop is abnormal), arm drift (extend both arms — one-sided drift/fall is abnormal), and speech (repeat a sentence — slurred or inappropriate words are abnormal). This patient has all three positive: facial droop, arm weakness (drift), and slurred speech. Any one positive finding has 72% sensitivity for stroke; all three increases specificity.",
    difficulty: 2,
    category: "Protocol-Based Decision Making",
    topic: "Stroke Protocol"
  },
  {
    id: "para-proto-004",
    stem: "A patient with suspected stroke has a last known well time of 2 hours ago. Per stroke protocol, the MOST important action to facilitate thrombolytic therapy is:",
    options: [
      "Administer aspirin in the field",
      "Establish a precise last known well time, obtain blood glucose, and transport to a stroke center with pre-notification",
      "Lower the patient's blood pressure below 140/90",
      "Administer IV heparin for anticoagulation"
    ],
    correctIndex: 1,
    rationale: "For acute stroke, the paramedic's role is to establish the last known well (LKW) time (critical for thrombolytic eligibility — tPA window is 3-4.5 hours), obtain blood glucose (to rule out hypoglycemia mimicking stroke), and rapidly transport to a certified stroke center with pre-notification so the stroke team can prepare. Do NOT administer aspirin, thrombolytics, or anticoagulants in the field. Do NOT aggressively lower BP.",
    difficulty: 3,
    category: "Protocol-Based Decision Making",
    topic: "Stroke Protocol"
  },
  {
    id: "para-proto-005",
    stem: "A patient with a suspected large vessel occlusion (LVO) stroke presents with aphasia, gaze deviation, hemiplegia, and neglect. The appropriate transport destination is:",
    options: [
      "The nearest community hospital",
      "A comprehensive stroke center capable of endovascular thrombectomy",
      "The closest primary stroke center",
      "The patient's primary care physician's office"
    ],
    correctIndex: 1,
    rationale: "Large vessel occlusion (LVO) strokes benefit from endovascular thrombectomy (mechanical clot retrieval), which is only available at comprehensive stroke centers. Screening tools like RACE, LAMS, or VAN help identify LVO in the field. If a comprehensive stroke center is within a reasonable transport time, bypassing a primary stroke center may be appropriate. LVO strokes have the highest morbidity and mortality if undertreated.",
    difficulty: 4,
    category: "Protocol-Based Decision Making",
    topic: "Stroke Protocol"
  },
  {
    id: "para-proto-006",
    stem: "You are treating a patient in pulseless ventricular tachycardia (pVT). After two shocks and 2 rounds of epinephrine, the rhythm persists. Per ACLS protocol, the next medication to consider is:",
    options: [
      "Atropine 1 mg IV",
      "Amiodarone 300 mg IV push",
      "Adenosine 6 mg rapid IV push",
      "Magnesium sulfate 2 g IV"
    ],
    correctIndex: 1,
    rationale: "Per ACLS protocol, amiodarone 300 mg IV/IO is given for shock-refractory VF/pVT (after at least one dose of epinephrine and multiple shocks). A second dose of 150 mg may be given if VF/pVT persists. Alternatively, lidocaine 1-1.5 mg/kg can be used. Atropine is no longer recommended for cardiac arrest. Adenosine is for stable narrow-complex tachycardia. Magnesium is for Torsades de Pointes specifically.",
    difficulty: 3,
    category: "Protocol-Based Decision Making",
    topic: "Cardiac Arrest Protocol"
  },
  {
    id: "para-proto-007",
    stem: "During cardiac arrest resuscitation, high-quality CPR includes:",
    options: [
      "Compressions at a rate of 60-80/min with full recoil",
      "Compressions at a rate of 100-120/min, depth of at least 2 inches (5 cm), allowing full chest recoil, and minimizing interruptions",
      "Compressions at a rate of 150/min with a compression-to-ventilation ratio of 5:1",
      "Continuous compressions without ventilation for the first 20 minutes"
    ],
    correctIndex: 1,
    rationale: "High-quality CPR per AHA guidelines includes: rate of 100-120 compressions/minute, depth of at least 2 inches (5 cm) but not exceeding 2.4 inches, allowing complete chest recoil between compressions (don't lean), minimizing interruptions (<10 seconds), and a 30:2 compression-to-ventilation ratio (or continuous compressions with async ventilations with an advanced airway). Compressor fatigue occurs after 2 minutes — rotate compressors.",
    difficulty: 2,
    category: "Protocol-Based Decision Making",
    topic: "Cardiac Arrest Protocol"
  },
  {
    id: "para-proto-008",
    stem: "A patient with a known history of opioid use is found unresponsive with pinpoint pupils and a respiratory rate of 4/min. After ensuring airway patency, the FIRST pharmacological intervention is:",
    options: [
      "Epinephrine 1 mg IV",
      "Naloxone 0.4-2 mg IV/IN/IM",
      "Flumazenil 0.2 mg IV",
      "Activated charcoal 50 g PO"
    ],
    correctIndex: 1,
    rationale: "Naloxone (Narcan) is the specific opioid antagonist indicated for respiratory depression from opioid overdose. It can be given IV, IM, SC, intranasal (IN), or via nebulization. Intranasal route (2-4 mg via MAD) is increasingly used in the prehospital setting. The goal is to restore adequate respiratory effort, not necessarily full consciousness. Titrate to respiratory rate >12/min to avoid acute withdrawal.",
    difficulty: 2,
    category: "Protocol-Based Decision Making",
    topic: "Overdose Protocol"
  },
  {
    id: "para-proto-009",
    stem: "A patient presents with altered mental status and a blood glucose level of 38 mg/dL. They are unable to swallow safely. The appropriate prehospital treatment is:",
    options: [
      "Oral glucose gel placed under the tongue",
      "Dextrose 50% (D50) 25 g IV push, or glucagon 1 mg IM if no IV access",
      "Normal saline 1 L IV bolus",
      "Thiamine 100 mg IV push only"
    ],
    correctIndex: 1,
    rationale: "Symptomatic hypoglycemia (BG <60 mg/dL) with altered mental status requires IV dextrose: D50 25g (50 mL) IV push in adults. If IV access cannot be obtained, glucagon 1 mg IM/IN induces hepatic glycogenolysis (less effective in malnourished/alcoholic patients with depleted glycogen stores). Oral glucose is only for conscious patients who can swallow. In suspected alcoholism, give thiamine before dextrose to prevent Wernicke encephalopathy.",
    difficulty: 2,
    category: "Protocol-Based Decision Making",
    topic: "Diabetic Emergency Protocol"
  },
  {
    id: "para-proto-010",
    stem: "A 45-year-old patient presents with severe allergic reaction: urticaria, facial swelling, wheezing, and hypotension (BP 72/40). Per anaphylaxis protocol, the FIRST medication to administer is:",
    options: [
      "Diphenhydramine 50 mg IV",
      "Methylprednisolone 125 mg IV",
      "Epinephrine 0.3-0.5 mg (1:1,000) IM in the anterolateral thigh",
      "Albuterol 2.5 mg nebulized"
    ],
    correctIndex: 2,
    rationale: "Epinephrine is the FIRST-LINE treatment for anaphylaxis — it addresses all pathophysiology simultaneously: bronchodilation (beta-2), vasoconstriction (alpha-1), increased cardiac output (beta-1), and mast cell stabilization. Give 0.3-0.5 mg of 1:1,000 IM in the anterolateral thigh (best absorption site). Repeat every 5-15 minutes as needed. Antihistamines and steroids are adjuncts, not first-line. Delay in epinephrine increases mortality.",
    difficulty: 2,
    category: "Protocol-Based Decision Making",
    topic: "Anaphylaxis Protocol"
  },
  {
    id: "para-proto-011",
    stem: "A patient in septic shock (BP 78/46, HR 124, temp 39.8°C, lactate >4) has received 30 mL/kg of crystalloid without improvement. Per sepsis protocol, the next step is:",
    options: [
      "Administer another 30 mL/kg fluid bolus",
      "Initiate vasopressor therapy (norepinephrine) targeting MAP ≥65 mmHg",
      "Administer IV antibiotics in the field",
      "Apply MAST trousers"
    ],
    correctIndex: 1,
    rationale: "Per sepsis protocols (based on Surviving Sepsis Campaign guidelines), after initial crystalloid resuscitation (30 mL/kg within the first hour), patients who remain hypotensive require vasopressor therapy. Norepinephrine is the first-line vasopressor, targeting a mean arterial pressure (MAP) ≥65 mmHg. In the prehospital setting, push-dose epinephrine (5-20 mcg IV) may be used if norepinephrine infusion is not available.",
    difficulty: 4,
    category: "Protocol-Based Decision Making",
    topic: "Sepsis Protocol"
  },
  {
    id: "para-proto-012",
    stem: "A trauma patient has an open chest wound with a sucking sound during breathing. Per trauma protocol, the correct intervention is:",
    options: [
      "Cover the wound completely with an occlusive dressing sealed on all four sides",
      "Apply a vented chest seal or occlusive dressing taped on three sides to create a flutter valve",
      "Leave the wound open to allow air to escape",
      "Insert a chest tube at the wound site"
    ],
    correctIndex: 1,
    rationale: "An open (sucking) chest wound should be covered with a vented chest seal (preferred) or an improvised occlusive dressing taped on three sides. The vented design or three-sided taping creates a one-way valve: air can exit during exhalation but cannot enter during inhalation, preventing tension pneumothorax while sealing the wound. A four-sided seal can trap air and cause tension pneumothorax. Monitor for signs of tension PTX.",
    difficulty: 3,
    category: "Protocol-Based Decision Making",
    topic: "Trauma Protocol"
  },
  {
    id: "para-proto-013",
    stem: "A patient involved in a high-speed MVC has signs of tension pneumothorax: absent breath sounds on the left, tracheal deviation to the right, JVD, and severe hypotension. The appropriate prehospital intervention is:",
    options: [
      "Bilateral needle decompression",
      "Needle decompression of the affected (left) side at the 2nd intercostal space, midclavicular line or 4th-5th intercostal space, anterior axillary line",
      "Endotracheal intubation",
      "Pericardiocentesis"
    ],
    correctIndex: 1,
    rationale: "Tension pneumothorax is immediately life-threatening and requires emergent needle decompression on the affected side. The preferred sites are the 2nd intercostal space at the midclavicular line or the 4th-5th intercostal space at the anterior axillary line (recommended in larger patients due to chest wall thickness). Use a 14-gauge or larger catheter. A rush of air confirms decompression. This is a clinical diagnosis — do not delay for imaging.",
    difficulty: 3,
    category: "Protocol-Based Decision Making",
    topic: "Trauma Protocol"
  },
  {
    id: "para-proto-014",
    stem: "Per hemorrhage control protocol, the correct sequence for managing extremity hemorrhage is:",
    options: [
      "Tourniquet first, then direct pressure",
      "Direct pressure, then wound packing with hemostatic gauze, then tourniquet if hemorrhage continues",
      "Elevation only",
      "Pressure points first, then ice application"
    ],
    correctIndex: 1,
    rationale: "Hemorrhage control follows a stepwise approach: direct pressure first, then wound packing with hemostatic gauze (e.g., QuikClot Combat Gauze) for deep wounds, followed by tourniquet application if hemorrhage is life-threatening and uncontrolled. In tactical/active threat environments, tourniquet application may be the first step for obvious extremity hemorrhage. Tourniquets should be placed 2-3 inches above the wound, high and tight.",
    difficulty: 2,
    category: "Protocol-Based Decision Making",
    topic: "Hemorrhage Control"
  },
  {
    id: "para-proto-015",
    stem: "A patient with a GCS of 7 requires endotracheal intubation. Before the procedure, you administer midazolam and succinylcholine. This technique is called:",
    options: [
      "Nasotracheal intubation",
      "Rapid sequence intubation (RSI)",
      "Awake intubation",
      "Digital intubation"
    ],
    correctIndex: 1,
    rationale: "Rapid sequence intubation (RSI) involves the rapid administration of a sedative/induction agent and a neuromuscular blocking agent to facilitate endotracheal intubation. Standard sequence: preoxygenation, induction agent (etomidate, ketamine, or midazolam), neuromuscular blocker (succinylcholine or rocuronium), then intubation. RSI minimizes the risk of aspiration by rapidly achieving complete paralysis and unconsciousness.",
    difficulty: 3,
    category: "Protocol-Based Decision Making",
    topic: "Airway Protocol"
  },
  {
    id: "para-proto-016",
    stem: "A patient presents with symptomatic bradycardia (HR 34, BP 76/48, altered mental status). After atropine 0.5 mg IV fails to improve the heart rate, the next intervention per ACLS bradycardia algorithm is:",
    options: [
      "Amiodarone 150 mg IV",
      "Transcutaneous pacing",
      "Cardioversion",
      "Adenosine 6 mg rapid IV push"
    ],
    correctIndex: 1,
    rationale: "Per ACLS bradycardia algorithm: if atropine is ineffective for symptomatic bradycardia, transcutaneous pacing (TCP) is the next intervention. TCP is applied using external pacing pads, starting at 60 bpm with output (mA) increased until electrical capture is achieved (each pacing spike followed by a QRS). Sedation/analgesia should be provided as TCP is painful. Dopamine or epinephrine infusion are alternatives if pacing is unavailable.",
    difficulty: 3,
    category: "Protocol-Based Decision Making",
    topic: "Bradycardia Protocol"
  },
  {
    id: "para-proto-017",
    stem: "A patient presents with a stable narrow-complex tachycardia at 186 bpm (SVT). Vagal maneuvers have failed. Per protocol, the first medication to administer is:",
    options: [
      "Amiodarone 150 mg IV over 10 minutes",
      "Adenosine 6 mg rapid IV push followed by a 20 mL NS flush",
      "Verapamil 5 mg IV over 2 minutes",
      "Lidocaine 1 mg/kg IV push"
    ],
    correctIndex: 1,
    rationale: "Adenosine 6 mg rapid IV push (must be given as fast as possible through a proximal IV, followed immediately by a 20 mL NS rapid flush) is first-line for stable SVT after vagal maneuvers fail. If the first dose is ineffective, a second dose of 12 mg is given. Adenosine briefly blocks AV node conduction, interrupting reentrant circuits. Its half-life is <10 seconds. Record a rhythm strip during administration for diagnostic purposes.",
    difficulty: 2,
    category: "Protocol-Based Decision Making",
    topic: "Tachycardia Protocol"
  },
  {
    id: "para-proto-018",
    stem: "A patient with a wide-complex tachycardia of uncertain origin is hemodynamically unstable (BP 70/40, AMS). Per ACLS protocol, the immediate treatment is:",
    options: [
      "Adenosine 6 mg rapid IV push",
      "Amiodarone 150 mg IV drip over 10 minutes",
      "Synchronized cardioversion",
      "Vagal maneuvers"
    ],
    correctIndex: 2,
    rationale: "Any unstable tachycardia (hypotension, altered mental status, chest pain, acute heart failure) requires immediate synchronized cardioversion regardless of whether the rhythm is narrow or wide complex. Synchronized cardioversion delivers the shock timed to the R wave to avoid the vulnerable period (T wave). Starting energy: 100J biphasic for narrow complex, 100-200J biphasic for wide complex. Sedate if time permits.",
    difficulty: 3,
    category: "Protocol-Based Decision Making",
    topic: "Tachycardia Protocol"
  },
  {
    id: "para-proto-019",
    stem: "Per ACLS cardiac arrest protocol, the recommended interval for administering epinephrine during cardiac arrest is:",
    options: [
      "Every 1-2 minutes",
      "Every 3-5 minutes",
      "Every 10 minutes",
      "Only once during the resuscitation"
    ],
    correctIndex: 1,
    rationale: "Epinephrine 1 mg IV/IO is administered every 3-5 minutes during cardiac arrest for all rhythms (VF/pVT and PEA/asystole). For shockable rhythms (VF/pVT), the first epinephrine dose is given after the second shock. For non-shockable rhythms (PEA/asystole), epinephrine is given as soon as IV/IO access is established. The goal is to augment coronary and cerebral perfusion pressure through alpha-adrenergic vasoconstriction.",
    difficulty: 2,
    category: "Protocol-Based Decision Making",
    topic: "Cardiac Arrest Protocol"
  },
  {
    id: "para-proto-020",
    stem: "A patient is found in PEA (pulseless electrical activity) arrest. The paramedic should consider which reversible causes?",
    options: [
      "Only cardiac tamponade",
      "The H's and T's: Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/hyperkalemia, Hypothermia, Tension pneumothorax, Tamponade, Toxins, Thrombosis (PE/MI)",
      "Only hypovolemia and hypoxia",
      "PEA has no reversible causes"
    ],
    correctIndex: 1,
    rationale: "PEA arrest has identifiable, potentially reversible causes categorized as H's and T's. The H's: Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia. The T's: Tension pneumothorax, Tamponade (cardiac), Toxins (drug overdose), Thrombosis (pulmonary embolism, MI). Identifying and treating the underlying cause is essential — PEA without a treatable cause has a very poor prognosis.",
    difficulty: 3,
    category: "Protocol-Based Decision Making",
    topic: "Cardiac Arrest Protocol"
  },
  {
    id: "para-proto-021",
    stem: "A trauma patient has an estimated blood loss of 1,500 mL (Class III hemorrhage). Per hemorrhagic shock protocol, resuscitation should include:",
    options: [
      "Aggressive crystalloid infusion of 3-4 liters",
      "Permissive hypotension with crystalloid targeting SBP 80-90 mmHg (or MAP 50-65), with blood products as soon as available",
      "No IV fluids to avoid dilutional coagulopathy",
      "Hypertonic saline 250 mL IV only"
    ],
    correctIndex: 1,
    rationale: "Current hemorrhagic shock protocols favor permissive hypotension (target SBP 80-90 mmHg) to avoid disrupting clot formation and worsening dilutional coagulopathy. Excessive crystalloid (>2L) dilutes clotting factors and reduces oxygen-carrying capacity. Prehospital strategies include: TXA within 3 hours of injury, limited crystalloid, and rapid transport for blood products and surgical hemorrhage control.",
    difficulty: 4,
    category: "Protocol-Based Decision Making",
    topic: "Hemorrhagic Shock Protocol"
  },
  {
    id: "para-proto-022",
    stem: "Tranexamic acid (TXA) is indicated in trauma patients when:",
    options: [
      "Given to all trauma patients regardless of bleeding status",
      "Given within 3 hours of injury to patients with significant hemorrhage or risk of significant hemorrhage",
      "Given only to patients who have already received blood products",
      "Given 24 hours after the traumatic event"
    ],
    correctIndex: 1,
    rationale: "TXA (1 g IV over 10 minutes, followed by 1 g over 8 hours) is indicated for trauma patients with significant hemorrhage or at risk of significant hemorrhage, administered within 3 hours of injury. TXA inhibits fibrinolysis, helping to maintain blood clots. The CRASH-2 trial showed a significant reduction in mortality when given early. TXA given after 3 hours may actually increase mortality and should NOT be administered.",
    difficulty: 3,
    category: "Protocol-Based Decision Making",
    topic: "Hemorrhage Control"
  },
  {
    id: "para-neuro-001",
    stem: "A patient presents with the worst headache of their life, sudden onset, with neck stiffness and photophobia. This is most concerning for:",
    options: [
      "Tension headache",
      "Migraine with aura",
      "Subarachnoid hemorrhage",
      "Cluster headache"
    ],
    correctIndex: 2,
    rationale: "The classic presentation of subarachnoid hemorrhage (SAH) is a sudden, severe 'thunderclap' headache described as 'the worst headache of my life,' often with neck stiffness (meningismus), photophobia, nausea/vomiting, and possible altered mental status. SAH is commonly caused by a ruptured cerebral aneurysm. This is a neurosurgical emergency. Prehospital care: minimize stimulation, treat nausea, control BP per protocol, and transport rapidly.",
    difficulty: 3,
    category: "Neurological Emergencies",
    topic: "Hemorrhagic Stroke"
  },
  {
    id: "para-neuro-002",
    stem: "A patient with known epilepsy has been seizing continuously for 12 minutes. This is classified as:",
    options: [
      "Simple partial seizure",
      "Febrile seizure",
      "Status epilepticus",
      "Absence seizure"
    ],
    correctIndex: 2,
    rationale: "Status epilepticus is defined as continuous seizure activity lasting >5 minutes OR two or more seizures without return to baseline between them. It is a life-threatening emergency due to the risk of cerebral hypoxia, metabolic acidosis, hyperthermia, rhabdomyolysis, and aspiration. Treatment: benzodiazepines (midazolam 10 mg IM/IN, lorazepam 4 mg IV, or diazepam 10 mg IV/PR). Protect the airway and provide supplemental oxygen.",
    difficulty: 2,
    category: "Neurological Emergencies",
    topic: "Seizures"
  },
  {
    id: "para-neuro-003",
    stem: "A patient involved in a motorcycle crash is found with decerebrate posturing (extension of all extremities). This indicates injury at which level?",
    options: [
      "Cerebral cortex",
      "Brainstem (below the red nucleus)",
      "Spinal cord at the lumbar level",
      "Peripheral nerve damage"
    ],
    correctIndex: 1,
    rationale: "Decerebrate posturing (extension, internal rotation, and adduction of upper and lower extremities) indicates injury at or below the level of the red nucleus in the midbrain/brainstem. It carries a worse prognosis than decorticate posturing (flexion of upper extremities, extension of lower). In the GCS, decerebrate posturing scores 2 for motor response. Both types indicate severe brain injury requiring aggressive airway management and rapid neurosurgical evaluation.",
    difficulty: 4,
    category: "Neurological Emergencies",
    topic: "Traumatic Brain Injury"
  },
  {
    id: "para-neuro-004",
    stem: "A patient with a GCS of 8 after a traumatic brain injury should receive which airway intervention?",
    options: [
      "Nasal cannula at 2 LPM",
      "Non-rebreather mask at 15 LPM only",
      "Endotracheal intubation for definitive airway protection",
      "No airway intervention unless the patient stops breathing"
    ],
    correctIndex: 2,
    rationale: "A GCS of 8 or less indicates the patient cannot protect their own airway and requires definitive airway management (endotracheal intubation or supraglottic airway). The goal is to maintain SpO2 >94% and ETCO2 35-45 mmHg. Hyperventilation (ETCO2 <35) should be avoided as it causes cerebral vasoconstriction and secondary brain injury. Only brief hyperventilation is used for signs of cerebral herniation (blown pupil, Cushing triad).",
    difficulty: 3,
    category: "Neurological Emergencies",
    topic: "Traumatic Brain Injury"
  },
  {
    id: "para-neuro-005",
    stem: "Cushing's triad — hypertension, bradycardia, and irregular respirations — indicates:",
    options: [
      "Spinal shock",
      "Increased intracranial pressure with impending herniation",
      "Cardiac tamponade",
      "Tension pneumothorax"
    ],
    correctIndex: 1,
    rationale: "Cushing's triad is a late sign of critically elevated intracranial pressure (ICP) with impending brainstem herniation. Hypertension occurs as the brain attempts to maintain cerebral perfusion against rising ICP (Cushing response). Reflex bradycardia follows. Irregular respirations indicate brainstem compression affecting the respiratory center. This is a pre-terminal finding requiring immediate intervention: intubation, brief hyperventilation, and emergent neurosurgical consultation.",
    difficulty: 3,
    category: "Neurological Emergencies",
    topic: "Increased ICP"
  },
  {
    id: "para-neuro-006",
    stem: "A patient with suspected spinal cord injury at the C5 level presents with hypotension (BP 72/48) and bradycardia (HR 48). This is called:",
    options: [
      "Hypovolemic shock",
      "Neurogenic shock",
      "Cardiogenic shock",
      "Septic shock"
    ],
    correctIndex: 1,
    rationale: "Neurogenic shock results from loss of sympathetic tone due to spinal cord injury (typically above T6). This causes unopposed parasympathetic activity leading to vasodilation (hypotension), bradycardia, and warm/flushed skin below the level of injury. Treatment: IV fluids for hypotension. If fluids fail, vasopressors (norepinephrine or phenylephrine) are indicated. Atropine may be needed for symptomatic bradycardia. Distinguished from hypovolemic shock (tachycardia, cool/pale skin).",
    difficulty: 3,
    category: "Neurological Emergencies",
    topic: "Spinal Cord Injury"
  },
  {
    id: "para-proto-023",
    stem: "Per post-cardiac arrest care protocol, targeted temperature management (TTM) involves:",
    options: [
      "Warming the patient to 40°C as quickly as possible",
      "Maintaining a core temperature of 32-36°C for at least 24 hours after return of spontaneous circulation (ROSC)",
      "Cooling the patient to 25°C for 12 hours",
      "Temperature management is not part of post-arrest care"
    ],
    correctIndex: 1,
    rationale: "Targeted temperature management (TTM) for post-cardiac arrest patients involves maintaining core temperature at 32-36°C for at least 24 hours after ROSC. This reduces cerebral metabolic demand and limits reperfusion injury. Prehospital initiation can include cold IV saline infusion (4°C) and surface cooling. Actively prevent fever (>37.5°C) which worsens neurological outcomes. Current evidence supports a target of 32-36°C rather than a specific temperature.",
    difficulty: 4,
    category: "Protocol-Based Decision Making",
    topic: "Post-Cardiac Arrest Protocol"
  },
  {
    id: "para-proto-024",
    stem: "A patient with diabetic ketoacidosis (DKA) presents with Kussmaul respirations, fruity breath odor, and blood glucose of 480 mg/dL. Prehospital treatment includes:",
    options: [
      "Administer insulin 10 units IV push",
      "IV normal saline bolus (1-2 L) for dehydration, cardiac monitoring, and transport",
      "Administer oral glucose",
      "Administer sodium bicarbonate IV push"
    ],
    correctIndex: 1,
    rationale: "DKA prehospital management focuses on fluid resuscitation (patients are typically 5-10 L fluid-depleted), cardiac monitoring (for dysrhythmias from electrolyte abnormalities, especially hyperkalemia), and rapid transport. Insulin is NOT typically given in the prehospital setting because it requires close monitoring of glucose and potassium. Sodium bicarbonate is controversial and not routinely given. Kussmaul breathing is a compensatory mechanism for metabolic acidosis.",
    difficulty: 3,
    category: "Protocol-Based Decision Making",
    topic: "Diabetic Emergency Protocol"
  },
  {
    id: "para-proto-025",
    stem: "Per airway protocol, if an endotracheal intubation attempt fails twice, the paramedic should:",
    options: [
      "Continue attempting intubation until successful",
      "Place a supraglottic airway device (King LT, i-gel, or LMA) as a rescue airway",
      "Remove all airway adjuncts and bag-valve-mask ventilate only",
      "Perform a surgical cricothyrotomy immediately"
    ],
    correctIndex: 1,
    rationale: "Most EMS protocols limit intubation attempts to 2-3 before moving to a rescue airway. Supraglottic airway devices (King LT, i-gel, LMA) are effective rescue airways that can be placed quickly with less training than intubation. They provide adequate ventilation and some aspiration protection. Surgical cricothyrotomy is reserved for 'cannot intubate, cannot oxygenate' situations where all other methods have failed.",
    difficulty: 3,
    category: "Protocol-Based Decision Making",
    topic: "Airway Protocol"
  },
  {
    id: "para-proto-026",
    stem: "A field termination of resuscitation protocol typically requires which criteria to be met?",
    options: [
      "Any patient who does not respond to the first shock",
      "Unwitnessed arrest, no shockable rhythm at any time, no ROSC after 20 minutes of ALS care, and no reversible causes identified",
      "Any patient over age 80",
      "Cardiac arrest lasting more than 5 minutes"
    ],
    correctIndex: 1,
    rationale: "Field termination of resuscitation (TOR) protocols typically require ALL of the following: arrest not witnessed by EMS, no bystander CPR prior to EMS arrival, no shockable rhythm at any point, no ROSC after 20+ minutes of ALS-level resuscitation, and no reversible causes identified. These criteria identify patients with virtually no chance of survival. TOR protocols reduce unnecessary transport risks and ED resource utilization.",
    difficulty: 4,
    category: "Protocol-Based Decision Making",
    topic: "Cardiac Arrest Protocol"
  },
  {
    id: "para-proto-027",
    stem: "Per pain management protocol, the appropriate first-line analgesic for a patient with an isolated long bone fracture and a pain score of 9/10 is:",
    options: [
      "Ibuprofen 800 mg PO",
      "Fentanyl 1 mcg/kg IV/IN or morphine 0.1 mg/kg IV",
      "Acetaminophen 1000 mg PO only",
      "Toradol (ketorolac) 30 mg IV only"
    ],
    correctIndex: 1,
    rationale: "Severe pain (7-10/10) from isolated extremity fractures warrants opioid analgesia. Fentanyl (1 mcg/kg IV/IN) has rapid onset, shorter duration, and less histamine release than morphine. Morphine (0.1 mg/kg IV) is an alternative. Intranasal fentanyl via MAD device is effective when IV access is delayed. Non-pharmacological interventions (splinting, positioning) are always combined with medication. Assess and reassess pain scores during transport.",
    difficulty: 2,
    category: "Protocol-Based Decision Making",
    topic: "Pain Management Protocol"
  },
  {
    id: "para-proto-028",
    stem: "When using ETCO2 monitoring during cardiac arrest, a sudden sustained rise in ETCO2 from 12 to 38 mmHg indicates:",
    options: [
      "The ET tube is displaced",
      "Return of spontaneous circulation (ROSC)",
      "Esophageal intubation",
      "Hyperventilation by the rescuer"
    ],
    correctIndex: 1,
    rationale: "During CPR, ETCO2 typically reads 10-20 mmHg. A sudden, sustained rise in ETCO2 (usually to >35-40 mmHg) strongly suggests return of spontaneous circulation (ROSC), as improved cardiac output increases CO2 delivery to the lungs. ETCO2 is also used to confirm ET tube placement (>35 mmHg = tracheal), monitor CPR quality (aim for >10 mmHg), and prognosticate (persistently <10 mmHg after 20 min suggests poor outcome).",
    difficulty: 3,
    category: "Protocol-Based Decision Making",
    topic: "Monitoring During Resuscitation"
  },
  {
    id: "para-neuro-007",
    stem: "A patient presents with sudden onset of vertigo, ataxia, dysarthria, and diplopia. This clinical picture suggests:",
    options: [
      "Benign paroxysmal positional vertigo (BPPV)",
      "Posterior circulation (vertebrobasilar) stroke",
      "Meniere's disease",
      "Labyrinthitis"
    ],
    correctIndex: 1,
    rationale: "The combination of vertigo, ataxia (coordination loss), dysarthria (slurred speech), and diplopia (double vision) points to posterior circulation involvement — specifically a vertebrobasilar stroke. Posterior strokes are often missed because they may not show findings on standard stroke scales (CPSS/FAST). BPPV is positional and without neurological deficits. Labyrinthitis causes vertigo and hearing loss without focal neurological findings.",
    difficulty: 4,
    category: "Neurological Emergencies",
    topic: "Stroke Recognition"
  },
  {
    id: "para-neuro-008",
    stem: "A patient is postictal after a witnessed generalized tonic-clonic seizure. Blood glucose is 124 mg/dL. Temperature is 37.2°C. The appropriate management is:",
    options: [
      "Administer a benzodiazepine to prevent another seizure",
      "Position for airway protection (recovery position), monitor continuously, reassess, and transport",
      "Restrain the patient firmly in a supine position",
      "Administer IV glucose"
    ],
    correctIndex: 1,
    rationale: "Postictal care after a single self-limiting seizure includes: positioning on the side (recovery position) for airway protection, suctioning as needed, supplemental oxygen, continuous monitoring for recurrent seizures, and transport for evaluation. Benzodiazepines are reserved for prolonged seizures (>5 min) or recurrent seizures. Do not restrain — protect from injury. Reassess mental status serially; prolonged postictal state may indicate status epilepticus or other pathology.",
    difficulty: 2,
    category: "Neurological Emergencies",
    topic: "Seizures"
  },
  {
    id: "para-proto-029",
    stem: "A patient with suspected acute pulmonary embolism presents with sudden dyspnea, pleuritic chest pain, tachycardia, hypoxia (SpO2 84%), and a history of recent hip surgery. Per protocol, management includes:",
    options: [
      "Nebulized albuterol and reassessment",
      "High-flow oxygen, IV access, cardiac monitoring, consider anticoagulation if per protocol, and rapid transport",
      "Nitroglycerin 0.4 mg SL for chest pain",
      "CPAP at 10 cmH2O"
    ],
    correctIndex: 1,
    rationale: "Massive PE management includes high-flow oxygen (or intubation if needed), IV access, cardiac monitoring (right heart strain pattern on ECG), fluid resuscitation for hypotension, and rapid transport to a facility capable of advanced PE treatment (catheter-directed therapy, surgical embolectomy). Some protocols include prehospital heparin or aspirin. If cardiac arrest occurs from PE, consider prolonged resuscitation and thrombolytics (tPA 50 mg IV during arrest).",
    difficulty: 4,
    category: "Protocol-Based Decision Making",
    topic: "Pulmonary Embolism"
  },
  {
    id: "para-proto-030",
    stem: "During rapid sequence intubation (RSI), etomidate is preferred over ketamine in which situation?",
    options: [
      "Patient with status epilepticus",
      "Patient with hemodynamic instability (hypotension)",
      "Patient with isolated head injury and normal hemodynamics",
      "Patient with bronchospasm"
    ],
    correctIndex: 2,
    rationale: "Etomidate (0.3 mg/kg IV) is hemodynamically neutral (minimal effect on blood pressure and heart rate) and has a rapid onset (30-60 seconds). It is preferred for patients with normal hemodynamics, such as isolated head injuries, where maintaining cerebral perfusion pressure is critical. Ketamine is preferred for hemodynamically unstable patients (it increases catecholamine release/BP), status asthmaticus (bronchodilatory), and status epilepticus (anticonvulsant properties).",
    difficulty: 4,
    category: "Protocol-Based Decision Making",
    topic: "Airway Protocol"
  },
  {
    id: "para-proto-033",
    stem: "A patient has ingested an unknown quantity of tricyclic antidepressant (TCA). The ECG shows a QRS duration of 140 ms (widened) and the patient is hypotensive. Per toxicology protocol, the treatment is:",
    options: [
      "Activated charcoal administration",
      "Sodium bicarbonate 1-2 mEq/kg IV bolus to narrow the QRS and improve hemodynamics",
      "Flumazenil IV push",
      "Calcium chloride 1 g IV"
    ],
    correctIndex: 1,
    rationale: "TCA toxicity causes sodium channel blockade, resulting in widened QRS, hypotension, and seizures. Sodium bicarbonate is the specific antidote: the sodium load helps overcome sodium channel blockade (narrowing QRS and improving conduction), and alkalinization increases protein binding of the drug. Give 1-2 mEq/kg IV bolus; repeat until QRS narrows to <100 ms. Flumazenil is contraindicated in TCA overdose as it can precipitate seizures.",
    difficulty: 4,
    category: "Protocol-Based Decision Making",
    topic: "Toxicology Protocol"
  },
  {
    id: "para-proto-034",
    stem: "A patient presents with rapid onset confusion, tachycardia (HR 138), hyperthermia (40.5°C), diaphoresis, tremor, and bilateral lower extremity clonus. The patient takes sertraline and recently started tramadol. This presentation is most consistent with:",
    options: [
      "Neuroleptic malignant syndrome",
      "Serotonin syndrome",
      "Malignant hyperthermia",
      "Thyroid storm"
    ],
    correctIndex: 1,
    rationale: "Serotonin syndrome is caused by excess serotonergic activity, often from drug combinations (SSRIs + opioids like tramadol, MAOIs, or other serotonergic agents). The triad is: altered mental status (confusion, agitation), autonomic instability (tachycardia, hyperthermia, diaphoresis), and neuromuscular excitability (clonus, hyperreflexia, tremor, rigidity). Clonus is a key distinguishing feature. Treatment: benzodiazepines, cooling, cyproheptadine (serotonin antagonist) at the hospital. Discontinue offending agents.",
    difficulty: 4,
    category: "Protocol-Based Decision Making",
    topic: "Toxicology Protocol"
  },
  {
    id: "para-proto-035",
    stem: "Per trauma triage protocol (CDC Field Triage Guidelines), which patient should be transported directly to a Level I or II trauma center?",
    options: [
      "A patient with an isolated wrist fracture from a fall",
      "A patient with GCS <14, SBP <90, or penetrating injury to the head, neck, or torso",
      "A patient with a minor ankle sprain",
      "Any patient involved in a motor vehicle collision regardless of injury"
    ],
    correctIndex: 1,
    rationale: "The CDC Field Triage Decision Scheme uses a stepwise approach: Step 1 (physiologic criteria) — GCS <14, SBP <90, RR <10 or >29; Step 2 (anatomic criteria) — penetrating injuries to head/neck/torso, chest wall instability, two or more proximal long bone fractures, crushed/degloved/mangled extremity, amputation, pelvic fractures, open/depressed skull fracture, paralysis. Any positive criterion triggers transport to the highest level trauma center available.",
    difficulty: 3,
    category: "Protocol-Based Decision Making",
    topic: "Trauma Triage Protocol"
  },
  {
    id: "para-proto-036",
    stem: "A patient with known asthma is in severe respiratory distress unresponsive to three albuterol treatments. SpO2 is 84% and declining. The patient is becoming obtunded. Per protocol, the next escalation is:",
    options: [
      "Continue albuterol nebulization only",
      "Administer epinephrine 0.3-0.5 mg IM (1:1,000), prepare for endotracheal intubation with ketamine induction",
      "Apply a nasal cannula at 2 LPM",
      "Administer oral prednisone and transport non-emergently"
    ],
    correctIndex: 1,
    rationale: "Severe refractory asthma (status asthmaticus) with declining mental status and persistent hypoxemia despite maximal bronchodilator therapy requires escalation: IM epinephrine (powerful bronchodilator), preparation for intubation (using ketamine as the induction agent due to its bronchodilatory properties), and potentially IV magnesium sulfate. Intubating an asthmatic patient is high-risk — use low tidal volumes, slow respiratory rate, and long expiratory time to avoid air trapping and barotrauma.",
    difficulty: 4,
    category: "Protocol-Based Decision Making",
    topic: "Respiratory Emergency Protocol"
  },
  {
    id: "para-proto-037",
    stem: "After successful endotracheal intubation, the ETCO2 reading is 8 mmHg with a flat waveform. This finding indicates:",
    options: [
      "Correct tube placement with good ventilation",
      "Esophageal intubation — immediately remove the tube, preoxygenate, and reattempt",
      "The patient has hyperventilation",
      "Normal capnography reading"
    ],
    correctIndex: 1,
    rationale: "An ETCO2 reading <10 mmHg with a flat or absent waveform after intubation strongly suggests esophageal (not tracheal) placement. The stomach may release small amounts of CO2 initially (from swallowed air or prior BVM ventilation) but values will be low (<10 mmHg) and rapidly decline to zero. Tracheal placement shows sustained ETCO2 >35 mmHg with a characteristic square waveform. Immediately remove the misplaced tube, ventilate with BVM, and reattempt intubation.",
    difficulty: 3,
    category: "Protocol-Based Decision Making",
    topic: "Airway Protocol"
  },
  {
    id: "para-neuro-009",
    stem: "A patient presents with acute onset of the 'worst headache of their life,' followed by a brief loss of consciousness, and now has a GCS of 13 with nuchal rigidity. CT scan at the hospital would likely show:",
    options: [
      "Normal findings",
      "Subarachnoid hemorrhage — blood in the subarachnoid space",
      "Epidural hematoma",
      "Brain tumor"
    ],
    correctIndex: 1,
    rationale: "The classic presentation of subarachnoid hemorrhage (SAH): sudden thunderclap headache ('worst ever'), brief loss of consciousness (from acute ICP rise), nuchal rigidity (meningismus from blood irritating the meninges), and possible focal neurological deficits. Non-contrast CT detects SAH in >95% of cases within 6 hours. If CT is negative but clinical suspicion is high, lumbar puncture showing xanthochromia confirms the diagnosis. SAH from aneurysm rupture has ~50% mortality.",
    difficulty: 3,
    category: "Neurological Emergencies",
    topic: "Hemorrhagic Stroke"
  },
  {
    id: "para-neuro-010",
    stem: "A trauma patient presents with loss of motor function and pain/temperature sensation below T10, but proprioception and light touch are preserved. This pattern is consistent with:",
    options: [
      "Complete spinal cord transection",
      "Anterior cord syndrome",
      "Central cord syndrome",
      "Brown-Séquard syndrome"
    ],
    correctIndex: 1,
    rationale: "Anterior cord syndrome results from damage to the anterior two-thirds of the spinal cord (often from flexion injuries or anterior spinal artery occlusion). It causes loss of motor function (corticospinal tracts) and loss of pain/temperature sensation (spinothalamic tracts) below the level of injury, while preserving proprioception and light touch (dorsal columns, which are posteriorly located). It has the worst prognosis of incomplete cord syndromes, with only 10-20% of patients recovering functional motor control.",
    difficulty: 5,
    category: "Neurological Emergencies",
    topic: "Spinal Cord Injury"
  },
  {
    id: "para-neuro-011",
    stem: "An elderly patient presents after a fall with weakness in all four extremities, worse in the upper extremities than the lower. Sensation is relatively preserved. MRI would likely show:",
    options: [
      "Anterior cord syndrome",
      "Central cord syndrome",
      "Cauda equina syndrome",
      "Complete cord transection"
    ],
    correctIndex: 1,
    rationale: "Central cord syndrome is the most common incomplete spinal cord injury, often occurring in elderly patients with pre-existing cervical spondylosis after a hyperextension injury (fall). It presents with greater motor weakness in the upper extremities than lower (because upper extremity motor tracts are more centrally located in the cord), with variable sensory loss and bladder dysfunction. Prognosis is better than anterior cord syndrome — many patients regain some function.",
    difficulty: 4,
    category: "Neurological Emergencies",
    topic: "Spinal Cord Injury"
  },
  {
    id: "para-proto-038",
    stem: "A 72-year-old patient presents with acute abdominal pain, bloody diarrhea, and hemodynamic instability. The patient has a history of atrial fibrillation. This presentation is most concerning for:",
    options: [
      "Gastroenteritis",
      "Acute mesenteric ischemia from arterial embolism",
      "Hemorrhoids",
      "Diverticulitis"
    ],
    correctIndex: 1,
    rationale: "Acute mesenteric ischemia in a patient with atrial fibrillation suggests arterial embolism (thrombus from the fibrillating atrium embolizes to the superior mesenteric artery). It presents with severe abdominal pain 'out of proportion to exam findings,' bloody diarrhea (from mucosal ischemia), and rapid hemodynamic deterioration. Mortality exceeds 60-80% if not treated emergently. Prehospital care: IV fluids, pain management, and rapid transport for angiography/surgery.",
    difficulty: 4,
    category: "Protocol-Based Decision Making",
    topic: "Abdominal Emergency Protocol"
  },
  {
    id: "para-proto-039",
    stem: "A patient presents with a blood glucose of 42 mg/dL, but no IV access can be obtained. Intranasal glucagon is available. The correct dose is:",
    options: [
      "0.1 mg intranasal",
      "3 mg intranasal (one actuation into one nostril)",
      "1 mg intranasal split between both nostrils",
      "10 mg intranasal"
    ],
    correctIndex: 1,
    rationale: "Intranasal glucagon (Baqsimi) is administered as 3 mg in a single actuation into one nostril. It does not need to be inhaled — passive absorption through the nasal mucosa is sufficient. The patient does not need to be conscious. Onset is 10-15 minutes. Alternative if no IV access: glucagon 1 mg IM. If IV access is available, D50 25g IV (or D10 100-250 mL) is preferred for faster onset. After glucagon administration, give oral carbohydrates once the patient can swallow safely.",
    difficulty: 3,
    category: "Protocol-Based Decision Making",
    topic: "Diabetic Emergency Protocol"
  }
];
