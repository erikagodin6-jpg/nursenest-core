import type { CareerQuestion } from "./rrt-questions";

export const paramedicQuestionsBatch12: CareerQuestion[] = [
  {
    id: "para-ops-001",
    stem: "EMS crew resource management (CRM) principles emphasize which of the following during high-acuity calls?",
    options: [
      "The most experienced provider makes all decisions without input",
      "Closed-loop communication, shared situational awareness, clear role assignments, and mutual monitoring among team members",
      "Each provider works independently without coordinating",
      "Only verbal orders are acceptable — written protocols should be ignored"
    ],
    correctIndex: 1,
    rationale: "Crew Resource Management (CRM) in EMS adapts aviation safety principles to improve team performance during critical calls. Key elements include: closed-loop communication (sender states, receiver repeats, sender confirms), shared mental model (everyone understands the plan), clear role assignment, cross-monitoring (team members catch each other's errors), and assertive communication (any team member can voice concerns). CRM reduces medical errors and improves patient outcomes.",
    difficulty: 3,
    category: "EMS Operations",
    topic: "Team Communication"
  },
  {
    id: "para-ops-002",
    stem: "A paramedic is considering withholding resuscitation on a patient found in cardiac arrest. Which of the following would support this decision?",
    options: [
      "The patient appears elderly",
      "A valid, legally recognized Do Not Resuscitate (DNR) order or POLST/MOLST form is present",
      "A family member verbally states the patient would not want CPR",
      "The patient lives alone"
    ],
    correctIndex: 1,
    rationale: "Resuscitation can only be withheld based on a valid, legally recognized DNR order, POLST (Physician Orders for Life-Sustaining Treatment), or MOLST form. These must be signed by a physician and the patient/surrogate. Verbal family statements are not legally sufficient to withhold resuscitation in most jurisdictions. If no valid DNR/POLST is present and there are no obvious signs of death (rigor mortis, decomposition, dependent lividity), begin resuscitation.",
    difficulty: 3,
    category: "EMS Operations",
    topic: "End-of-Life Decisions"
  },
  {
    id: "para-ops-003",
    stem: "Helicopter EMS (HEMS) transport should be considered when:",
    options: [
      "The patient has a minor injury that could be treated at the local ED",
      "Ground transport time to an appropriate facility exceeds 30-45 minutes and the patient has a time-sensitive condition (trauma, STEMI, stroke)",
      "Weather conditions include thunderstorms and low visibility",
      "The patient requests helicopter transport for convenience"
    ],
    correctIndex: 1,
    rationale: "HEMS is indicated when ground transport time to an appropriate specialty center (trauma center, PCI facility, comprehensive stroke center) exceeds 30-45 minutes and the patient has a time-sensitive condition. HEMS should not be requested when weather/visibility is unsafe, when ground transport is comparable in time, or for non-time-sensitive conditions. Consider establishing a landing zone (100×100 feet minimum, free of debris and wires).",
    difficulty: 2,
    category: "EMS Operations",
    topic: "Transport Decisions"
  },
  {
    id: "para-ops-004",
    stem: "The concept of 'medical direction' in EMS refers to:",
    options: [
      "The paramedic's ability to practice independently without physician oversight",
      "Physician oversight of EMS practice through online (direct) and offline (indirect) medical control",
      "Hospital administrators directing ambulance routing",
      "Insurance companies determining patient care protocols"
    ],
    correctIndex: 1,
    rationale: "Medical direction provides the legal authority for paramedics to perform medical procedures and administer medications. Online (direct) medical control involves real-time physician consultation via radio or phone. Offline (indirect) medical control includes standing orders, protocols, training, and quality improvement activities developed by the EMS Medical Director. Paramedics practice as physician extenders under delegated medical authority.",
    difficulty: 2,
    category: "EMS Operations",
    topic: "Medical Direction"
  },
  {
    id: "para-ops-005",
    stem: "A paramedic arrives on scene to find a 45-year-old male who has just physically assaulted his partner. The patient has a minor laceration and is refusing treatment and transport. The paramedic should:",
    options: [
      "Force the patient onto the stretcher for treatment",
      "Assess the patient's decision-making capacity, ensure law enforcement is present, document the refusal thoroughly, and provide instructions for follow-up care",
      "Leave the scene immediately without documentation",
      "Transport the patient against his will to prevent further violence"
    ],
    correctIndex: 1,
    rationale: "A competent adult has the right to refuse treatment and transport. The paramedic must assess decision-making capacity (alert, oriented, understands the risks of refusal), ensure the scene is safe (law enforcement should be present given the domestic violence situation), thoroughly document the assessment, the refusal, and that the patient was informed of risks. Provide follow-up instructions. EMS cannot forcibly treat competent adults — this constitutes battery.",
    difficulty: 3,
    category: "EMS Operations",
    topic: "Patient Refusal"
  },
  {
    id: "para-trauma-001",
    stem: "A patient involved in a motorcycle crash presents with paradoxical chest wall movement on the left side. This is most consistent with:",
    options: [
      "Simple rib fracture",
      "Flail chest (three or more adjacent ribs fractured in two or more places)",
      "Tension pneumothorax",
      "Hemothorax"
    ],
    correctIndex: 1,
    rationale: "Flail chest occurs when three or more adjacent ribs are each fractured in two or more places, creating a free-floating segment. This segment moves paradoxically — inward during inspiration and outward during expiration. The primary concern is the underlying pulmonary contusion causing respiratory failure, not the mechanical flail itself. Treatment: positive pressure ventilation (BVM or intubation if needed), pain management, splinting (positioning on injured side), and avoiding excessive fluid resuscitation.",
    difficulty: 3,
    category: "Trauma Management",
    topic: "Chest Trauma"
  },
  {
    id: "para-trauma-002",
    stem: "Beck's triad — JVD, muffled heart sounds, and hypotension — indicates:",
    options: [
      "Tension pneumothorax",
      "Cardiac tamponade",
      "Aortic dissection",
      "Myocardial infarction"
    ],
    correctIndex: 1,
    rationale: "Beck's triad is the classic presentation of cardiac tamponade: distended neck veins (JVD — impaired venous return), muffled/distant heart sounds (fluid around the heart dampens sounds), and hypotension (decreased cardiac output from impaired filling). Pulsus paradoxus (>10 mmHg drop in SBP during inspiration) may also be present. This is a pericardiocentesis emergency. In trauma, pericardial blood accumulation from penetrating injury is the most common cause.",
    difficulty: 3,
    category: "Trauma Management",
    topic: "Chest Trauma"
  },
  {
    id: "para-trauma-003",
    stem: "The Revised Trauma Score (RTS) uses which three physiological parameters?",
    options: [
      "Heart rate, blood pressure, and temperature",
      "Glasgow Coma Scale, systolic blood pressure, and respiratory rate",
      "Pulse oximetry, ETCO2, and blood glucose",
      "Age, mechanism of injury, and GCS"
    ],
    correctIndex: 1,
    rationale: "The Revised Trauma Score (RTS) uses three coded physiological parameters: Glasgow Coma Scale (GCS), systolic blood pressure (SBP), and respiratory rate (RR). Each is assigned a coded value (0-4), and the RTS is calculated using weighted coefficients. Lower RTS scores indicate worse injuries and higher mortality. An RTS ≤11 (or any individual parameter coded ≤3) typically meets trauma center criteria.",
    difficulty: 3,
    category: "Trauma Management",
    topic: "Trauma Assessment"
  },
  {
    id: "para-trauma-004",
    stem: "In a penetrating trauma patient with evisceration (abdominal contents protruding from a wound), the paramedic should:",
    options: [
      "Push the organs back into the abdominal cavity",
      "Cover the eviscerated organs with moist sterile dressings, then cover with an occlusive dressing to prevent drying and heat loss",
      "Pack the wound tightly with dry gauze",
      "Apply direct pressure to push the organs back inside"
    ],
    correctIndex: 1,
    rationale: "Eviscerated abdominal contents should NEVER be pushed back into the abdomen (risk of contamination, increased injury, and worsening hemorrhage). Cover with moist (saline-soaked) sterile dressings to prevent desiccation (drying) and tissue death, then apply an occlusive covering to retain moisture and warmth. Position the patient with knees flexed to reduce abdominal tension. Do not remove any impaled objects. Transport rapidly.",
    difficulty: 2,
    category: "Trauma Management",
    topic: "Abdominal Trauma"
  },
  {
    id: "para-trauma-005",
    stem: "Spinal motion restriction (SMR) is indicated for a trauma patient who presents with:",
    options: [
      "An isolated ankle injury from a fall",
      "A mechanism of injury with midline spinal tenderness, neurological deficit, altered mental status, or distracting injury",
      "Any patient involved in a motor vehicle collision regardless of symptoms",
      "All patients over age 65 regardless of presentation"
    ],
    correctIndex: 1,
    rationale: "Current evidence-based guidelines (NEXUS criteria, Canadian C-spine Rule) recommend spinal motion restriction (not full immobilization) for patients with: mechanism consistent with spinal injury PLUS midline spinal tenderness, focal neurological deficit, altered mental status (GCS <15, intoxication), or significant distracting injury. Alert, sober patients with no midline tenderness, no neurological deficits, and no distracting injuries can be cleared clinically. Use a rigid collar and self-limiting movements on a padded surface.",
    difficulty: 3,
    category: "Trauma Management",
    topic: "Spinal Motion Restriction"
  },
  {
    id: "para-trauma-006",
    stem: "A patient has a pelvic fracture with signs of hemodynamic instability. The appropriate prehospital intervention is:",
    options: [
      "Log-roll the patient to assess posterior pelvis thoroughly",
      "Apply a pelvic binder or sheet to stabilize the pelvis, initiate IV fluid resuscitation, and transport rapidly",
      "Apply traction splint to both lower extremities",
      "Perform a secondary assessment before any intervention"
    ],
    correctIndex: 1,
    rationale: "Unstable pelvic fractures can cause massive retroperitoneal hemorrhage (2-6 liters of blood loss). A pelvic binder (commercial or improvised with a folded sheet) applied at the level of the greater trochanters reduces pelvic volume, tamponades bleeding, and stabilizes fracture fragments. Do NOT repeatedly palpate or rock the pelvis (increases bleeding). Initiate IV fluids (permissive hypotension in hemorrhagic shock) and transport rapidly to a trauma center for angiography or surgical intervention.",
    difficulty: 4,
    category: "Trauma Management",
    topic: "Pelvic Trauma"
  },
  {
    id: "para-trauma-007",
    stem: "An impaled object in the patient's chest should be managed by:",
    options: [
      "Removing the object in the field to control bleeding",
      "Stabilizing the object in place with bulky dressings, securing it to prevent movement, and transporting to a trauma center",
      "Shortening the object by cutting it as close to the skin as possible",
      "Pushing the object through the body to the other side"
    ],
    correctIndex: 1,
    rationale: "Impaled objects should NEVER be removed in the field (except objects through the cheek obstructing the airway, or objects preventing CPR). The object may be tamponading damaged vessels — removal can cause uncontrolled hemorrhage. Stabilize with bulky dressings (roller gauze, towels, or commercial devices) around the base, secure the object to prevent movement during transport, control bleeding around the entry site, and transport to a trauma center for surgical removal.",
    difficulty: 2,
    category: "Trauma Management",
    topic: "Penetrating Trauma"
  },
  {
    id: "para-trauma-008",
    stem: "A patient with a suspected femur fracture has pain, deformity, and shortening of the affected leg. The most appropriate splinting device is:",
    options: [
      "Rigid board splint",
      "Traction splint (Hare, Sager, or CT-6)",
      "SAM splint wrapped around the thigh",
      "Air splint"
    ],
    correctIndex: 1,
    rationale: "Traction splints are specifically designed for mid-shaft femur fractures. They apply longitudinal traction to overcome muscle spasm, reduce pain, minimize bleeding (femur fractures can bleed 1,000-1,500 mL into the thigh), and prevent further neurovascular injury from bone fragments. Contraindications: fractures near the hip or knee joint, pelvis fractures, open fractures with bone protruding, and ankle/lower leg injuries on the same extremity.",
    difficulty: 2,
    category: "Trauma Management",
    topic: "Musculoskeletal Trauma"
  },
  {
    id: "para-trauma-009",
    stem: "A patient presents with a traumatic amputation of the hand. The amputated part should be:",
    options: [
      "Placed directly on ice to preserve it",
      "Rinsed with sterile saline, wrapped in moist sterile gauze, placed in a sealed plastic bag, and that bag placed on ice (not in direct contact with ice)",
      "Discarded if more than 30 minutes have passed",
      "Submerged in saline for transport"
    ],
    correctIndex: 1,
    rationale: "Amputated parts should be: gently rinsed with sterile saline to remove gross contamination, wrapped in moist (saline-dampened) sterile gauze, placed in a sealed waterproof bag or container, and then placed on ice (indirect cooling — do NOT place the part directly on ice or in water, as this causes ice crystal formation and tissue damage). Cool ischemia time for digits is up to 12 hours; for limbs, up to 6 hours. Transport the part with the patient.",
    difficulty: 2,
    category: "Trauma Management",
    topic: "Extremity Trauma"
  },
  {
    id: "para-trauma-010",
    stem: "The 'platinum 10 minutes' in trauma management refers to:",
    options: [
      "The maximum time to administer the first IV fluid bolus",
      "The target maximum on-scene time for critical trauma patients to minimize delays to definitive surgical care",
      "The time window for TPA administration",
      "The time required for a full trauma assessment"
    ],
    correctIndex: 1,
    rationale: "The 'platinum 10 minutes' concept emphasizes limiting on-scene time for critical trauma patients to ≤10 minutes. The rationale is that interventions performed in the field for penetrating trauma and severe hemorrhagic shock have limited benefit compared to definitive surgical care at a trauma center. Only life-saving interventions should be performed on scene: airway management, hemorrhage control, and needle decompression. All other care occurs during transport ('load and go' philosophy).",
    difficulty: 2,
    category: "Trauma Management",
    topic: "Trauma Systems"
  },
  {
    id: "para-assess-001",
    stem: "During the primary assessment, the 'X' in X-ABCDE stands for:",
    options: [
      "X-ray evaluation",
      "eXsanguination — control of massive external hemorrhage",
      "eXternal examination",
      "eXtra oxygen administration"
    ],
    correctIndex: 1,
    rationale: "The updated trauma assessment sequence is X-ABCDE, where X stands for exsanguinating (massive) hemorrhage control. The 'X' was added because uncontrolled hemorrhage is the leading preventable cause of trauma death. Before addressing airway, breathing, and circulation, immediately control life-threatening external hemorrhage with direct pressure, wound packing with hemostatic agents, or tourniquet application. This reflects the MARCH algorithm and Tactical Combat Casualty Care (TCCC) principles.",
    difficulty: 3,
    category: "Patient Assessment",
    topic: "Primary Assessment"
  },
  {
    id: "para-assess-002",
    stem: "The Glasgow Coma Scale (GCS) score for a patient who opens eyes to pain, makes incomprehensible sounds, and demonstrates flexion withdrawal to pain is:",
    options: [
      "GCS 6 (E1 + V2 + M3)",
      "GCS 8 (E2 + V2 + M4)",
      "GCS 10 (E3 + V3 + M4)",
      "GCS 7 (E2 + V1 + M4)"
    ],
    correctIndex: 1,
    rationale: "GCS scoring: Eye opening — spontaneous (4), to voice (3), to pain (2), none (1). Verbal — oriented (5), confused (4), inappropriate words (3), incomprehensible sounds (2), none (1). Motor — obeys commands (6), localizes pain (5), flexion withdrawal (4), abnormal flexion/decorticate (3), extension/decerebrate (2), none (1). This patient: eyes to pain (E2) + incomprehensible sounds (V2) + flexion withdrawal (M4) = GCS 8. GCS ≤8 generally indicates the need for definitive airway management.",
    difficulty: 3,
    category: "Patient Assessment",
    topic: "Glasgow Coma Scale"
  },
  {
    id: "para-assess-003",
    stem: "OPQRST is a mnemonic used during the history-taking phase of patient assessment. The 'P' stands for:",
    options: [
      "Past medical history",
      "Provocation/Palliation — what makes it worse or better",
      "Pulse rate",
      "Pain medication taken"
    ],
    correctIndex: 1,
    rationale: "OPQRST is a pain/chief complaint assessment mnemonic: Onset (when did it start, what were you doing?), Provocation/Palliation (what makes it worse/better?), Quality (describe the pain — sharp, dull, crushing, tearing?), Region/Radiation (where does it hurt, does it go anywhere else?), Severity (rate 1-10), and Time (how long has it lasted, constant or intermittent?). This structured approach ensures a thorough symptom evaluation.",
    difficulty: 1,
    category: "Patient Assessment",
    topic: "History Taking"
  },
  {
    id: "para-assess-004",
    stem: "Orthostatic vital signs are measured to assess for:",
    options: [
      "Cardiac arrhythmias",
      "Hypovolemia or dehydration — a significant change when moving from supine to standing indicates volume depletion",
      "Neurological deficits",
      "Blood glucose abnormalities"
    ],
    correctIndex: 1,
    rationale: "Orthostatic vital signs compare BP and HR in supine and standing positions. Positive orthostatics (suggesting hypovolemia): heart rate increase ≥20 bpm, systolic BP decrease ≥20 mmHg, or diastolic BP decrease ≥10 mmHg upon standing, with symptoms (dizziness, lightheadedness). This indicates the cardiovascular system cannot compensate for gravitational pooling of blood, suggesting volume depletion of approximately 15-20% blood volume.",
    difficulty: 2,
    category: "Patient Assessment",
    topic: "Vital Signs Assessment"
  },
  {
    id: "para-assess-005",
    stem: "During the secondary assessment, the DCAP-BTLS mnemonic is used to evaluate each body region. DCAP-BTLS stands for:",
    options: [
      "Diagnosis, Circulation, Airway, Pulse, Bleeding, Tenderness, Lacerations, Swelling",
      "Deformities, Contusions, Abrasions, Punctures/Penetrations, Burns, Tenderness, Lacerations, Swelling",
      "Distal, Central, Anterior, Posterior, Bilateral, Total, Lateral, Superior",
      "Decreased, Constricted, Absent, Palpable, Bilateral, Tachycardic, Labored, Symmetrical"
    ],
    correctIndex: 1,
    rationale: "DCAP-BTLS is a systematic assessment mnemonic applied to each body region during the secondary (head-to-toe) survey: Deformities, Contusions, Abrasions, Punctures/Penetrations, Burns, Tenderness, Lacerations, Swelling. This ensures a thorough physical examination that doesn't miss injuries. Each finding should be documented with location, size, and characteristics.",
    difficulty: 1,
    category: "Patient Assessment",
    topic: "Secondary Assessment"
  },
  {
    id: "para-ethics-001",
    stem: "A paramedic encounters a situation where following a standing order protocol may not be in the patient's best interest due to unusual circumstances. The MOST appropriate action is:",
    options: [
      "Follow the protocol exactly as written regardless of the situation",
      "Contact online medical control to discuss the situation and obtain orders appropriate for the specific clinical scenario",
      "Refuse to treat the patient",
      "Make up a new treatment plan without any physician guidance"
    ],
    correctIndex: 1,
    rationale: "Protocols are guidelines for the majority of clinical situations. When unusual circumstances arise where strict protocol adherence may not serve the patient's best interest, the paramedic should contact online medical control for real-time physician guidance. This maintains the physician oversight that authorizes paramedic practice while allowing clinical flexibility. Document the communication and any orders received.",
    difficulty: 3,
    category: "EMS Operations",
    topic: "Protocol Deviation"
  },
  {
    id: "para-ethics-002",
    stem: "The principle of 'beneficence' in EMS ethics means:",
    options: [
      "First, do no harm",
      "Acting in the patient's best interest — providing benefit and promoting well-being",
      "Treating all patients equally regardless of background",
      "Respecting the patient's right to make decisions about their own care"
    ],
    correctIndex: 1,
    rationale: "Beneficence is the ethical obligation to act in the patient's best interest and promote their well-being. The four key bioethical principles in EMS are: Autonomy (respecting the patient's right to self-determination), Beneficence (doing good), Non-maleficence (do no harm — 'primum non nocere'), and Justice (treating patients fairly and equitably). These principles guide decision-making when protocols don't clearly address a situation.",
    difficulty: 2,
    category: "EMS Operations",
    topic: "Medical Ethics"
  },
  {
    id: "para-cardio-001",
    stem: "A patient with a heart rate of 180 bpm and narrow QRS complexes is hemodynamically stable. Vagal maneuvers and two doses of adenosine have failed to convert the rhythm. The next pharmacological option is:",
    options: [
      "Amiodarone 300 mg IV push",
      "Diltiazem 0.25 mg/kg IV over 2 minutes or verapamil 2.5-5 mg IV",
      "Lidocaine 1 mg/kg IV push",
      "Atropine 1 mg IV push"
    ],
    correctIndex: 1,
    rationale: "For stable narrow-complex tachycardia (SVT) unresponsive to adenosine, calcium channel blockers (diltiazem 0.25 mg/kg IV over 2 minutes, or verapamil 2.5-5 mg slow IV push) are the next-line agents. They slow AV node conduction and may terminate the reentrant circuit. Contraindications: hypotension, heart failure, concurrent beta-blocker use, and wide-complex tachycardia of uncertain origin. Monitor for hypotension and bradycardia after administration.",
    difficulty: 4,
    category: "Cardiology",
    topic: "Tachycardia Management"
  },
  {
    id: "para-cardio-002",
    stem: "A patient with atrial fibrillation and a rapid ventricular response (RVR) at 156 bpm is hemodynamically stable but symptomatic (chest discomfort, dyspnea). Per protocol, the appropriate rate control agent is:",
    options: [
      "Adenosine 6 mg rapid IV push",
      "Diltiazem 0.25 mg/kg IV over 2 minutes",
      "Epinephrine 1 mg IV push",
      "Amiodarone 300 mg IV push"
    ],
    correctIndex: 1,
    rationale: "For stable atrial fibrillation with RVR, rate control is the goal (not rhythm conversion). Diltiazem (0.25 mg/kg IV, max 20 mg, over 2 minutes) is the preferred agent for rate control. It slows AV node conduction, reducing ventricular response rate. Adenosine is NOT effective for A-fib (works only for reentrant SVT). Beta-blockers (metoprolol) are an alternative. If the patient becomes unstable, synchronized cardioversion is indicated.",
    difficulty: 3,
    category: "Cardiology",
    topic: "Atrial Fibrillation"
  },
  {
    id: "para-cardio-003",
    stem: "During synchronized cardioversion of atrial fibrillation, the energy level for the FIRST attempt with a biphasic defibrillator is:",
    options: [
      "50 joules",
      "120-200 joules (biphasic), typically starting at 120-150 joules",
      "360 joules",
      "10 joules"
    ],
    correctIndex: 1,
    rationale: "Synchronized cardioversion for atrial fibrillation typically starts at 120-200 joules biphasic (or 200 joules monophasic). For atrial flutter and SVT, lower energies may be effective (50-100 joules). For ventricular tachycardia with a pulse, start at 100 joules biphasic. Always ensure the defibrillator is in SYNC mode — look for sync markers on the R waves. Sedate the conscious patient with midazolam or etomidate before cardioversion.",
    difficulty: 3,
    category: "Cardiology",
    topic: "Cardioversion"
  },
  {
    id: "para-cardio-004",
    stem: "A patient with chronic heart failure presents with severe dyspnea, orthopnea, bilateral crackles, pink frothy sputum, and JVD. SpO2 is 82% on room air. The MOST effective initial intervention combination is:",
    options: [
      "IV fluid bolus and bronchodilators",
      "CPAP at 10 cmH2O and high-dose nitroglycerin (0.4-0.8 mg SL repeated frequently)",
      "Intubation and IV amiodarone",
      "Oxygen by nasal cannula at 4 LPM and aspirin"
    ],
    correctIndex: 1,
    rationale: "Acute cardiogenic pulmonary edema (flash pulmonary edema) is treated with CPAP (5-10 cmH2O) and aggressive nitroglycerin. CPAP reduces preload, decreases work of breathing, and improves oxygenation by recruiting collapsed alveoli with positive pressure. Nitroglycerin reduces preload (venodilation) and decreases pulmonary congestion. IV fluids worsen pulmonary edema. This combination has been shown to reduce intubation rates by ~50% compared to oxygen alone.",
    difficulty: 3,
    category: "Cardiology",
    topic: "Acute Heart Failure"
  },
  {
    id: "para-cardio-005",
    stem: "A patient with a mechanical heart valve presents with signs of a stroke. The paramedic should be aware that this patient is likely on:",
    options: [
      "No medications related to the valve",
      "Long-term anticoagulation (warfarin), which increases bleeding risk if this is a hemorrhagic stroke",
      "Daily aspirin only",
      "Beta-blockers only"
    ],
    correctIndex: 1,
    rationale: "Patients with mechanical heart valves require lifelong anticoagulation (typically warfarin, maintaining INR 2.5-3.5) to prevent thrombus formation on the valve and subsequent embolization. In the setting of stroke symptoms, this presents a diagnostic dilemma: the stroke may be ischemic (from valve thromboembolism) or hemorrhagic (from over-anticoagulation). This information is critical for hospital decision-making regarding thrombolytics.",
    difficulty: 4,
    category: "Cardiology",
    topic: "Valvular Heart Disease"
  },
  {
    id: "para-resp-001",
    stem: "A patient with suspected tension pneumothorax has diminished breath sounds on the right, tracheal deviation to the left, and JVD. If needle decompression is performed, the expected finding upon successful decompression is:",
    options: [
      "Blood return through the catheter",
      "A rush or hissing of air through the catheter, followed by clinical improvement (increased BP, decreased tachycardia)",
      "No change in patient condition",
      "Immediate return of bilateral equal breath sounds"
    ],
    correctIndex: 1,
    rationale: "Successful needle decompression of a tension pneumothorax releases the trapped air under pressure. A rush or hissing of air through the catheter confirms proper placement and decompression. Clinical improvement follows: blood pressure increases (restored venous return), tachycardia decreases, tracheal deviation resolves, and JVD decreases. The catheter should be secured in place; a chest tube will be placed at the hospital for definitive management.",
    difficulty: 3,
    category: "Medical Emergencies",
    topic: "Respiratory Emergencies"
  },
  {
    id: "para-resp-002",
    stem: "A patient with a history of asthma presents with severe respiratory distress, an initially audible wheeze that suddenly becomes silent ('silent chest'), and deteriorating mental status. This indicates:",
    options: [
      "The asthma attack is resolving",
      "Critical bronchospasm with minimal air movement — impending respiratory arrest",
      "The patient is having a panic attack",
      "Vocal cord dysfunction"
    ],
    correctIndex: 1,
    rationale: "A 'silent chest' in a patient with known asthma and respiratory distress is an ominous sign indicating such severe bronchospasm that minimal air is moving in or out of the lungs — too little airflow to generate wheezing. Combined with altered mental status (hypoxia, hypercapnia), this represents impending respiratory arrest. Immediate intervention: continuous nebulized albuterol, IM epinephrine (0.3-0.5 mg of 1:1,000), CPAP or BVM assistance, and preparation for intubation.",
    difficulty: 3,
    category: "Medical Emergencies",
    topic: "Respiratory Emergencies"
  },
  {
    id: "para-resp-003",
    stem: "Capnography waveforms during CPR showing a gradually rising ETCO2 from 8 to 12 to 18 mmHg suggest:",
    options: [
      "The endotracheal tube is in the esophagus",
      "CPR quality is improving and adequate perfusion is being generated",
      "The patient has developed a pneumothorax",
      "The ventilation rate is too fast"
    ],
    correctIndex: 1,
    rationale: "During CPR, ETCO2 directly correlates with cardiac output generated by compressions. A gradually rising ETCO2 suggests improving cardiac output from high-quality CPR. ETCO2 <10 mmHg during CPR indicates inadequate compressions — feedback to improve depth, rate, or minimize interruptions. Persistently low ETCO2 (<10 mmHg) after 20 minutes of optimized CPR is associated with very low survival and may be used to guide termination of resuscitation decisions.",
    difficulty: 4,
    category: "Airway Management",
    topic: "Capnography"
  },
  {
    id: "para-mci-041",
    stem: "During a mass casualty incident at a school, a teacher tells you that a 6-year-old child cannot walk but is breathing at 26/min, has a radial pulse, and follows commands. Using JumpSTART triage, this child is classified as:",
    options: [
      "GREEN (Minor)",
      "YELLOW (Delayed)",
      "RED (Immediate)",
      "BLACK (Expectant)"
    ],
    correctIndex: 1,
    rationale: "In JumpSTART pediatric triage: the child cannot walk (not GREEN). Breathing spontaneously (present). Respiratory rate 15-45/min (within acceptable range for JumpSTART — differs from adult START which uses <30). Perfusion: radial pulse present (pass). Mental status: follows commands (AVPU = A for Alert). All criteria pass after the respiratory check, so the child is YELLOW (Delayed). Note JumpSTART uses 15-45 as the normal respiratory range for children, compared to START's under 30 for adults.",
    difficulty: 4,
    category: "Mass Casualty Incidents",
    topic: "JumpSTART Pediatric Triage"
  },
  {
    id: "para-mci-042",
    stem: "In the NIMS (National Incident Management System), what is the recommended span of control (number of subordinates per supervisor)?",
    options: [
      "1-2 subordinates",
      "3-7 subordinates, with 5 being optimal",
      "10-15 subordinates",
      "There is no recommended limit"
    ],
    correctIndex: 1,
    rationale: "NIMS recommends a span of control of 3-7 subordinates per supervisor, with 5 being optimal. This ensures effective supervision and communication. If the span of control is exceeded, the organizational structure must expand — supervisors are added (division/group supervisors, branch directors) to maintain manageable reporting relationships. Exceeding the span of control leads to communication failures and decreased effectiveness.",
    difficulty: 3,
    category: "Mass Casualty Incidents",
    topic: "Incident Command System"
  },
  {
    id: "para-mci-043",
    stem: "A mutual aid agreement in EMS preparedness refers to:",
    options: [
      "An agreement between a hospital and an insurance company",
      "A pre-arranged agreement between neighboring jurisdictions to share resources during emergencies that exceed local capacity",
      "A contract between an ambulance company and its employees",
      "An agreement between the fire department and police department to share office space"
    ],
    correctIndex: 1,
    rationale: "Mutual aid agreements are formal, pre-arranged agreements between neighboring EMS agencies, fire departments, or jurisdictions to provide assistance during incidents that exceed local resource capacity. These agreements specify what resources can be shared, how they are requested, liability coverage, and cost reimbursement. They are essential for MCI preparedness and are activated through established channels in the emergency management system.",
    difficulty: 2,
    category: "Mass Casualty Incidents",
    topic: "MCI Preparedness"
  },
  {
    id: "para-pharm-036",
    stem: "Hydroxocobalamin (Cyanokit) is the specific antidote for:",
    options: [
      "Carbon monoxide poisoning",
      "Cyanide poisoning",
      "Methanol poisoning",
      "Lead poisoning"
    ],
    correctIndex: 1,
    rationale: "Hydroxocobalamin (vitamin B12a precursor) is the preferred antidote for cyanide poisoning. It binds directly to cyanide to form cyanocobalamin (vitamin B12), which is renally excreted. Dose: 5 g IV over 15 minutes (adults). Suspect cyanide poisoning in fire victims with altered mental status, seizures, lactic acidosis, and cardiovascular collapse. Hydroxocobalamin is preferred over the older cyanide antidote kit (amyl nitrite, sodium nitrite, sodium thiosulfate) because it doesn't cause methemoglobinemia.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Toxicology Antidotes"
  },
  {
    id: "para-pharm-037",
    stem: "The correct dose of IV magnesium sulfate for treatment of Torsades de Pointes is:",
    options: [
      "250 mg IV over 30 minutes",
      "1-2 grams IV push (if pulseless) or over 5-20 minutes (if pulse present)",
      "5 grams IV push",
      "10 mg IV push"
    ],
    correctIndex: 1,
    rationale: "For Torsades de Pointes: if pulseless, give 1-2 g magnesium sulfate IV/IO push (diluted in 10 mL D5W). If pulse present, infuse 1-2 g over 5-20 minutes. Magnesium stabilizes the myocardial membrane, suppresses early afterdepolarizations that trigger TdP, and shortens the QT interval. A maintenance infusion of 0.5-1 g/hour may follow. Unlike other forms of VT, amiodarone and procainamide (which prolong QT) should be AVOIDED in TdP.",
    difficulty: 3,
    category: "EMS Pharmacology",
    topic: "Antiarrhythmics"
  },
  {
    id: "para-pharm-038",
    stem: "A patient on a beta-blocker and calcium channel blocker concurrently is at increased risk for:",
    options: [
      "Tachycardia",
      "Severe bradycardia, hypotension, and heart block due to synergistic AV node depression",
      "Hypertension",
      "Seizures"
    ],
    correctIndex: 1,
    rationale: "Both beta-blockers and non-dihydropyridine calcium channel blockers (verapamil, diltiazem) slow AV node conduction and decrease heart rate. Together, they synergistically depress AV node function, potentially causing severe bradycardia, heart block, and hypotension. This combination requires careful monitoring. In toxicity, treatment includes atropine, calcium chloride/gluconate, glucagon, vasopressors, and potentially high-dose insulin euglycemic therapy (HIET).",
    difficulty: 4,
    category: "EMS Pharmacology",
    topic: "Drug Interactions"
  },
  {
    id: "para-ecg-031",
    stem: "An ECG shows a 'stepladder' pattern with progressively shorter R-R intervals followed by a pause (grouped beating). The PR interval does not change. This is most consistent with:",
    options: [
      "Second-degree AV block Type I (Wenckebach)",
      "Sinus arrhythmia",
      "Second-degree AV block Type II with variable conduction ratios",
      "Atrial flutter with variable block"
    ],
    correctIndex: 2,
    rationale: "Second-degree AV block Type II with variable conduction ratios (e.g., alternating 2:1, 3:1, 4:1 block) can produce grouped beating patterns. The key distinguishing feature from Wenckebach is that the PR interval remains CONSTANT in Type II — there is no progressive prolongation. Type II occurs below the AV node (His bundle or bundle branches) and is more dangerous, often requiring pacing. Grouped beating with progressive PR prolongation would indicate Type I.",
    difficulty: 5,
    category: "ECG Interpretation",
    topic: "Heart Blocks"
  },
  {
    id: "para-ecg-032",
    stem: "Pulseless electrical activity (PEA) on the monitor shows:",
    options: [
      "A flat line (asystole)",
      "Organized electrical activity (any rhythm) without a palpable pulse",
      "Ventricular fibrillation",
      "Ventricular tachycardia with a pulse"
    ],
    correctIndex: 1,
    rationale: "PEA is defined as any organized cardiac electrical activity (which may look like sinus rhythm, bradycardia, or other rhythms on the monitor) WITHOUT a palpable pulse. The heart has electrical activity but is not generating adequate mechanical contraction to produce perfusion. PEA is not shockable. Treatment: high-quality CPR, epinephrine every 3-5 minutes, and aggressive search for reversible causes (H's and T's). Narrow-complex PEA has a better prognosis than wide-complex PEA.",
    difficulty: 2,
    category: "ECG Interpretation",
    topic: "Cardiac Arrest Rhythms"
  },
  {
    id: "para-trauma-011",
    stem: "A patient with a suspected basilar skull fracture may present with:",
    options: [
      "Elevated blood pressure and bradycardia only",
      "Battle's sign (retroauricular ecchymosis), raccoon eyes (periorbital ecchymosis), CSF rhinorrhea/otorrhea, and hemotympanum",
      "Chest wall crepitus and paradoxical chest movement",
      "Abdominal rigidity and rebound tenderness"
    ],
    correctIndex: 1,
    rationale: "Basilar skull fracture signs include: Battle's sign (bruising behind the ear — mastoid ecchymosis), raccoon eyes (bilateral periorbital ecchymosis), CSF leak from the nose (rhinorrhea) or ear (otorrhea) — clear fluid that tests positive for glucose, and hemotympanum (blood behind the tympanic membrane). These signs may take hours to develop. Do NOT insert nasogastric tubes or nasopharyngeal airways in suspected basilar skull fracture — risk of intracranial penetration.",
    difficulty: 3,
    category: "Trauma Management",
    topic: "Head Trauma"
  },
  {
    id: "para-trauma-012",
    stem: "The Kendrick Extrication Device (KED) is primarily used for:",
    options: [
      "Immobilizing a fractured femur",
      "Providing spinal stabilization during extrication of a seated patient from a vehicle",
      "Applying traction to a dislocated shoulder",
      "Stabilizing a pelvic fracture"
    ],
    correctIndex: 1,
    rationale: "The KED is a semi-rigid device designed to provide inline spinal immobilization for a seated patient (typically in a vehicle) during extrication. It wraps around the torso and head, maintaining spinal alignment as the patient is rotated and moved to a long backboard. The KED is applied after a cervical collar. In unstable patients requiring immediate extrication, rapid extrication technique is used instead of the KED to minimize on-scene time.",
    difficulty: 2,
    category: "Trauma Management",
    topic: "Spinal Motion Restriction"
  },
  {
    id: "para-peds-024",
    stem: "A 4-year-old child presents with sudden onset of respiratory distress while eating grapes. The child can cough but is making a high-pitched inspiratory sound (stridor). The paramedic should:",
    options: [
      "Perform abdominal thrusts immediately",
      "Encourage the child to continue coughing — do NOT interfere with a partial obstruction where the child is still able to cough effectively",
      "Begin chest compressions",
      "Perform blind finger sweeps"
    ],
    correctIndex: 1,
    rationale: "When a child has a partial (mild) airway obstruction — able to cough, cry, or speak — the paramedic should encourage continued coughing and NOT intervene with back blows or abdominal thrusts, as these maneuvers could convert a partial obstruction to a complete one. Monitor closely. Intervene with abdominal thrusts (Heimlich) only if the obstruction becomes complete (unable to cough, cry, speak, or breathe) or if the child becomes unresponsive. Blind finger sweeps are always contraindicated in children.",
    difficulty: 2,
    category: "OB/Peds",
    topic: "Pediatric Airway Emergencies"
  },
  {
    id: "para-peds-025",
    stem: "The pediatric dose for defibrillation in a witnessed VF cardiac arrest for a child who has already received one shock at 2 J/kg is:",
    options: [
      "2 J/kg again",
      "4 J/kg",
      "1 J/kg",
      "10 J/kg"
    ],
    correctIndex: 1,
    rationale: "Pediatric defibrillation protocol: first shock at 2 J/kg. Subsequent shocks at 4 J/kg. Maximum dose is 10 J/kg or the adult dose, whichever is less. The energy is increased for subsequent shocks because the initial lower dose was ineffective at terminating the dysrhythmia. Between shocks, provide 2 minutes of high-quality CPR. Administer epinephrine (0.01 mg/kg IV/IO) after the second shock and amiodarone (5 mg/kg IV/IO) after the third shock.",
    difficulty: 3,
    category: "OB/Peds",
    topic: "Pediatric Resuscitation"
  },
  {
    id: "para-med-026",
    stem: "A patient presents with sudden onset of severe testicular pain, nausea, and a high-riding testicle on the affected side. The testicle does not transilluminate. This is most consistent with:",
    options: [
      "Epididymitis",
      "Testicular torsion",
      "Inguinal hernia",
      "Urinary tract infection"
    ],
    correctIndex: 1,
    rationale: "Testicular torsion presents with sudden, severe testicular pain (often during physical activity or sleep), nausea/vomiting, a high-riding testicle (shortened spermatic cord from twisting), and absence of the cremasteric reflex. This is a urological emergency — the testicle must be surgically detorsed within 6 hours to prevent ischemic necrosis. Unlike epididymitis, torsion pain is NOT relieved by elevation of the testicle (negative Prehn's sign).",
    difficulty: 3,
    category: "Medical Emergencies",
    topic: "Genitourinary Emergencies"
  },
  {
    id: "para-med-027",
    stem: "A patient presents with a headache that is worse in the morning, aggravated by coughing or straining, and accompanied by papilledema on fundoscopic exam. This is most concerning for:",
    options: [
      "Tension headache",
      "Increased intracranial pressure from a space-occupying lesion",
      "Migraine with aura",
      "Sinus headache"
    ],
    correctIndex: 1,
    rationale: "Headache that is worse in the morning (ICP increases during recumbent sleep position), aggravated by activities that increase ICP (coughing, straining, bending over), and accompanied by papilledema (optic disc swelling from elevated CSF pressure) is classic for increased intracranial pressure from a mass lesion (tumor, abscess, chronic subdural hematoma). Other symptoms may include nausea/vomiting, personality changes, and focal neurological deficits. Requires urgent neuroimaging.",
    difficulty: 4,
    category: "Medical Emergencies",
    topic: "Neurological Emergencies"
  },
  {
    id: "para-proto-031",
    stem: "When performing needle decompression of a suspected tension pneumothorax in a large/obese patient, the preferred site is:",
    options: [
      "2nd intercostal space, midclavicular line only",
      "4th-5th intercostal space, anterior axillary line (where the chest wall is thinner)",
      "6th intercostal space, midaxillary line",
      "Directly over the nipple"
    ],
    correctIndex: 1,
    rationale: "While the 2nd ICS MCL is the traditional site, the 4th-5th ICS at the anterior axillary line is increasingly recommended, especially for larger patients. Studies show the chest wall is significantly thinner laterally (average 4.5 cm) compared to anteriorly (average 5.5 cm at the 2nd ICS MCL). A standard 5 cm (2-inch) catheter may not reach the pleural space at the 2nd ICS in obese patients. The lateral approach also avoids the internal mammary artery. Insert the catheter over the top of the rib to avoid the neurovascular bundle.",
    difficulty: 4,
    category: "Protocol-Based Decision Making",
    topic: "Trauma Protocol"
  },
  {
    id: "para-proto-032",
    stem: "A patient in cardiac arrest has been resuscitated and has return of spontaneous circulation (ROSC). The target SpO2 range for post-ROSC care is:",
    options: [
      "100% on high-flow oxygen at all times",
      "94-99% — titrate FiO2 to avoid both hypoxemia and hyperoxemia",
      "88-92% as in COPD patients",
      "SpO2 monitoring is unnecessary after ROSC"
    ],
    correctIndex: 1,
    rationale: "Post-ROSC care targets SpO2 94-99%. Both hypoxemia (<94%) and hyperoxemia (100% sustained) are harmful. Hyperoxemia generates reactive oxygen species that cause reperfusion injury to the brain and heart. Once ROSC is achieved, titrate FiO2 down from 100% to maintain SpO2 94-99%. Also maintain ETCO2 35-45 mmHg (avoid hypo/hyperventilation), target SBP >90 mmHg, and initiate targeted temperature management (32-36°C).",
    difficulty: 3,
    category: "Protocol-Based Decision Making",
    topic: "Post-Cardiac Arrest Protocol"
  }
];
