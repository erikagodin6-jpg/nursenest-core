export interface ParamedicScenario {
  title: string;
  slug: string;
  contentDomain: string;
  professionTrack: string;
  region: string;
  visibilityTier: string;
  difficulty: number;
  examRelevance: string;
  category: string;
  dispatchInfo: string;
  sceneDescription: string;
  sceneSafety: string;
  primaryAssessment: string;
  secondaryAssessment: string;
  vitalSigns: {
    hr: number;
    bp: string;
    rr: number;
    spo2: number;
    temp?: number;
    gcs: number;
    etco2?: number;
    glucose?: number;
  };
  history: {
    signs: string;
    allergies: string;
    medications: string;
    pastHistory: string;
    lastMeal: string;
    events: string;
  };
  decisionPoints: {
    prompt: string;
    options: { text: string; isCorrect: boolean; feedback: string }[];
  }[];
  correctInterventions: string[];
  commonErrors: string[];
  debrief: string;
  learningObjectives: string[];
  relatedLessonSlugs: string[];
  status: string;
}

export const paramedicScenarios: ParamedicScenario[] = [
  {
    title: "Multi-Vehicle MVC with Entrapped Driver",
    slug: "mvc-entrapped-driver",
    contentDomain: "paramedic",
    professionTrack: "PCP",
    region: "BOTH",
    visibilityTier: "free",
    difficulty: 4,
    examRelevance: "high",
    category: "Trauma",
    dispatchInfo: "Dispatched Code 3 to a multi-vehicle collision on a divided highway. Report of at least two vehicles involved with one driver possibly entrapped. Fire department is en route. No further details available.",
    sceneDescription: "You arrive to find a two-car head-on collision. Vehicle 1 is a sedan with significant frontal damage and the driver's door is jammed. The driver, a 42-year-old male, is conscious but complaining of severe chest and abdominal pain. He is restrained by his seatbelt and the steering column appears to have shifted toward his lap. Vehicle 2 has moderate damage and its occupants are ambulatory with minor injuries being assessed by a second unit.",
    sceneSafety: "The scene is on a busy highway. Ensure traffic control is in place with flares or cones. Check for fluid leaks, deployed airbags, and electrical hazards. Stabilize the vehicle before patient contact. Wear high-visibility PPE. Coordinate with fire for extrication. Ensure a safe working zone before approaching the vehicle.",
    primaryAssessment: "General impression: A 42-year-old male, alert and in obvious distress. Airway is patent with clear speech. Breathing is rapid and shallow at 28 breaths per minute with diminished breath sounds on the left side. Circulation shows a rapid, weak radial pulse at 120 bpm. Skin is pale, cool, and diaphoretic. The patient is alert and oriented to person, place, time, and event but appears anxious. No external hemorrhage is visible.",
    secondaryAssessment: "Head: No visible trauma, pupils equal and reactive. Neck: Trachea midline, no JVD, cervical tenderness noted. Chest: Tenderness and crepitus over left ribs 4-7, decreased breath sounds on left. Abdomen: Rigid and tender in the left upper quadrant with guarding. Pelvis: Stable on compression. Extremities: Left femur appears shortened and externally rotated with significant thigh swelling. Deformity of the left wrist with good distal pulses. Back: No step-offs or tenderness on log-roll.",
    vitalSigns: {
      hr: 120,
      bp: "88/60",
      rr: 28,
      spo2: 92,
      gcs: 14,
      etco2: 30,
      temp: 36.2
    },
    history: {
      signs: "Severe left-sided chest pain worse with breathing, abdominal pain in LUQ, left thigh pain with inability to move the leg, left wrist pain",
      allergies: "Penicillin",
      medications: "Lisinopril 10 mg daily for hypertension",
      pastHistory: "Hypertension, appendectomy 10 years ago",
      lastMeal: "Lunch approximately 2 hours ago",
      events: "Head-on collision at estimated 60 km/h. Patient was the restrained driver. Airbag deployed. No loss of consciousness reported but is unable to recall the moment of impact."
    },
    decisionPoints: [
      {
        prompt: "The patient is entrapped. What is your immediate priority while waiting for extrication?",
        options: [
          { text: "Begin a detailed secondary assessment from head to toe", isCorrect: false, feedback: "A detailed secondary survey is important but not the first priority. Focus on life threats first while the patient is still entrapped." },
          { text: "Apply high-flow oxygen, manage the cervical spine, control any hemorrhage, and establish IV access", isCorrect: true, feedback: "Correct. While entrapped, focus on addressing life threats: secure the airway with c-spine precautions, provide high-flow O2 for the low SpO2 and tachypnea, and establish IV access for fluid resuscitation given signs of shock." },
          { text: "Administer pain medication to keep the patient comfortable", isCorrect: false, feedback: "Pain management is appropriate later, but not the immediate priority in a hemodynamically unstable trauma patient who may need volume resuscitation first." },
          { text: "Wait for complete extrication before beginning any treatment", isCorrect: false, feedback: "Delaying treatment until extrication is complete can worsen the patient's condition. Begin interventions that can be performed while entrapped." }
        ]
      },
      {
        prompt: "After extrication, the patient's SpO2 drops to 88% and breath sounds are absent on the left. What do you suspect and how do you manage it?",
        options: [
          { text: "Suspect a simple pneumothorax and continue monitoring", isCorrect: false, feedback: "Given the hemodynamic instability and worsening respiratory status, a simple pneumothorax would not fully explain the clinical picture. Consider tension physiology." },
          { text: "Suspect tension pneumothorax and perform needle decompression on the left side", isCorrect: true, feedback: "Correct. Absent breath sounds, tachycardia, hypotension, and dropping SpO2 after blunt chest trauma strongly suggest tension pneumothorax. Needle decompression at the 2nd intercostal space, midclavicular line (or 4th-5th ICS, anterior axillary line) is the immediate intervention." },
          { text: "Suspect cardiac tamponade and prepare for pericardiocentesis", isCorrect: false, feedback: "Cardiac tamponade would present with JVD and muffled heart sounds (Beck's triad). This patient has absent breath sounds and chest wall crepitus, pointing more toward pneumothorax." },
          { text: "Increase the oxygen flow rate and reassess in 5 minutes", isCorrect: false, feedback: "Simply increasing oxygen will not resolve the underlying mechanical problem of a tension pneumothorax. Definitive decompression is needed." }
        ]
      },
      {
        prompt: "The patient's blood pressure remains 86/58 after needle decompression and 500 mL of normal saline. What is your transport decision?",
        options: [
          { text: "Continue aggressive fluid resuscitation on scene until blood pressure normalizes", isCorrect: false, feedback: "In hemorrhagic shock from trauma, prolonged scene time to normalize blood pressure is harmful. The patient needs surgical intervention that cannot be provided in the field." },
          { text: "Initiate permissive hypotension strategy, apply a pelvic binder and traction splint, and transport emergently to the nearest trauma center", isCorrect: true, feedback: "Correct. This patient has hemorrhagic shock likely from splenic injury and femur fracture. Permissive hypotension (target SBP 80-90 mmHg), hemorrhage control with splinting, and rapid transport to a trauma center is the standard of care." },
          { text: "Transport to the nearest community hospital for stabilization", isCorrect: false, feedback: "This patient meets trauma center criteria with multisystem injuries and hemodynamic instability. Bypassing a community hospital for a trauma center, if within a reasonable distance, improves outcomes." },
          { text: "Request air medical transport and continue treatment on scene", isCorrect: false, feedback: "If a trauma center is within 30 minutes by ground, waiting for air transport may delay definitive care. Ground transport with continued resuscitation is often faster." }
        ]
      }
    ],
    correctInterventions: [
      "Cervical spine immobilization during extrication",
      "High-flow oxygen via non-rebreather mask at 15 L/min",
      "Two large-bore IV lines with normal saline",
      "Needle decompression of left chest for tension pneumothorax",
      "Traction splint for left femur fracture",
      "Splint left wrist fracture",
      "Pelvic binder if pelvic instability suspected",
      "Permissive hypotension targeting SBP 80-90 mmHg",
      "Pain management with appropriate analgesic",
      "Rapid transport to trauma center with pre-notification",
      "Continuous monitoring of vital signs and SpO2"
    ],
    commonErrors: [
      "Failing to perform needle decompression when tension pneumothorax signs are present",
      "Over-resuscitating with IV fluids in hemorrhagic shock",
      "Spending excessive time on scene attempting to stabilize",
      "Forgetting to apply a traction splint for the femur fracture",
      "Not considering splenic injury with LUQ tenderness and signs of shock",
      "Transporting to the nearest facility instead of a trauma center"
    ],
    debrief: "This scenario involves a multi-system trauma patient with a tension pneumothorax, suspected splenic injury, femur fracture, and wrist fracture. Key learning points include recognizing and treating tension pneumothorax in the field, understanding permissive hypotension in hemorrhagic shock, applying appropriate splinting for long bone fractures, and making transport decisions based on trauma center criteria. The presence of an entrapped patient requires the ability to prioritize interventions that can be performed in a confined space while coordinating with fire for extrication. Time is the critical variable in trauma, and the goal is to minimize scene time while addressing immediately life-threatening conditions.",
    learningObjectives: [
      "Identify signs and symptoms of tension pneumothorax in blunt chest trauma",
      "Perform needle decompression at the correct anatomical landmark",
      "Apply permissive hypotension principles in hemorrhagic shock",
      "Demonstrate appropriate splinting techniques for femur and wrist fractures",
      "Make appropriate transport destination decisions for multi-system trauma"
    ],
    relatedLessonSlugs: ["trauma-primary-survey", "shock-assessment", "rapid-trauma-assessment"],
    status: "published"
  },
  {
    title: "Acute STEMI with Cardiogenic Shock",
    slug: "stemi-cardiogenic-shock",
    contentDomain: "paramedic",
    professionTrack: "ACP",
    region: "BOTH",
    visibilityTier: "free",
    difficulty: 5,
    examRelevance: "high",
    category: "Cardiac",
    dispatchInfo: "Dispatched to a 58-year-old male with severe chest pain and difficulty breathing at a restaurant. Bystanders report the patient is diaphoretic and appears very ill. First responders are on scene.",
    sceneDescription: "You arrive at a busy restaurant to find a 58-year-old male seated in a chair, leaning forward, clutching his chest. He is pale, diaphoretic, and in obvious distress. First responders have placed him on oxygen via nasal cannula at 4 L/min. The patient states the pain started approximately 45 minutes ago and describes it as a crushing pressure radiating to his left arm and jaw.",
    sceneSafety: "Indoor scene with no hazards. Ensure adequate space to work around the patient. Request additional resources if not already en route. No environmental threats identified.",
    primaryAssessment: "General impression: A 58-year-old male in acute distress with a life-threatening cardiac presentation. Airway is patent. Breathing is labored at 24 breaths per minute with bilateral crackles heard in the lower lung fields. Circulation reveals a weak, irregular radial pulse at 110 bpm. Skin is pale, cool, and diaphoretic. The patient is alert and oriented but anxious. No external hemorrhage.",
    secondaryAssessment: "Head: Unremarkable. Neck: JVD present, no tracheal deviation. Chest: Bilateral basilar crackles, no chest wall tenderness. Cardiac: Irregular rhythm, S3 gallop noted. Abdomen: Soft, non-tender. Extremities: 2+ pitting edema bilateral ankles, weak pedal pulses. 12-lead ECG shows ST elevation in leads II, III, aVF with reciprocal ST depression in I and aVL, consistent with an inferior STEMI. Right-sided ECG (V4R) shows ST elevation.",
    vitalSigns: {
      hr: 110,
      bp: "78/50",
      rr: 24,
      spo2: 89,
      gcs: 15,
      etco2: 28,
      temp: 36.8
    },
    history: {
      signs: "Crushing substernal chest pain rated 9/10, radiating to left arm and jaw, onset 45 minutes ago, associated with nausea, diaphoresis, and shortness of breath",
      allergies: "No known drug allergies",
      medications: "Metformin 1000 mg BID, atorvastatin 40 mg daily, aspirin 81 mg daily",
      pastHistory: "Type 2 diabetes mellitus, hyperlipidemia, 30-pack-year smoking history (quit 2 years ago), family history of MI (father at age 52)",
      lastMeal: "Currently eating dinner when symptoms began",
      events: "Was eating dinner when he suddenly developed crushing chest pressure. Tried antacids without relief. Pain progressively worsened over 30 minutes before calling 911."
    },
    decisionPoints: [
      {
        prompt: "Your 12-lead ECG confirms an inferior STEMI with right ventricular involvement. The patient's BP is 78/50. What is your fluid management strategy?",
        options: [
          { text: "Administer furosemide 40 mg IV for the pulmonary edema", isCorrect: false, feedback: "Diuretics are contraindicated in right ventricular MI as they reduce preload, which the failing right ventricle depends on. This would worsen hypotension." },
          { text: "Administer a 250 mL normal saline fluid bolus and reassess blood pressure", isCorrect: true, feedback: "Correct. Right ventricular infarction is preload-dependent. A cautious fluid challenge of 250 mL boluses with reassessment is appropriate. Avoid large-volume boluses without monitoring for worsening pulmonary edema." },
          { text: "Start a dopamine infusion immediately without fluids", isCorrect: false, feedback: "Vasopressors may be needed, but initial management of RV infarction should include a fluid trial first. The right ventricle needs adequate preload to maintain cardiac output." },
          { text: "Withhold all fluids because of the bilateral crackles", isCorrect: false, feedback: "While crackles are present, the hypotension in the setting of RV infarction requires careful fluid resuscitation. Completely withholding fluids will worsen cardiogenic shock." }
        ]
      },
      {
        prompt: "The patient has received aspirin 324 mg and the first fluid bolus. BP is now 84/56. Should you administer nitroglycerin?",
        options: [
          { text: "Yes, administer sublingual nitroglycerin for chest pain relief", isCorrect: false, feedback: "Nitroglycerin is contraindicated in right ventricular infarction because it reduces preload, which can cause severe, refractory hypotension. This is a critical NREMT test point." },
          { text: "No, nitroglycerin is contraindicated due to right ventricular involvement and hypotension", isCorrect: true, feedback: "Correct. Nitroglycerin is absolutely contraindicated with inferior STEMI with RV involvement because it reduces preload. The hypotensive patient with RV infarction depends on adequate preload. Provide pain management with fentanyl or morphine instead." },
          { text: "Yes, but use IV nitroglycerin instead of sublingual for better control", isCorrect: false, feedback: "The route does not matter. All forms of nitroglycerin reduce preload and are contraindicated in RV infarction with hypotension." },
          { text: "Give a test dose and monitor blood pressure closely", isCorrect: false, feedback: "Even a test dose of nitroglycerin can cause precipitous hypotension in RV infarction. It should not be administered in any dose." }
        ]
      },
      {
        prompt: "After fluid resuscitation and aspirin, BP is 86/58. What is your transport priority?",
        options: [
          { text: "Transport to the nearest emergency department", isCorrect: false, feedback: "A STEMI patient needs percutaneous coronary intervention (PCI). Transport to the nearest PCI-capable facility, even if it is slightly farther, is the standard of care." },
          { text: "Activate the cardiac catheterization lab at the nearest PCI-capable facility and transport emergently", isCorrect: true, feedback: "Correct. Early cath lab activation with a target door-to-balloon time of less than 90 minutes is critical. Pre-hospital cath lab activation reduces time to reperfusion and improves survival." },
          { text: "Stay on scene to stabilize the patient's blood pressure before transport", isCorrect: false, feedback: "Definitive treatment is PCI, not field stabilization. Continued scene time delays reperfusion and worsens outcomes. Treat en route." },
          { text: "Request air medical transport for the fastest transfer", isCorrect: false, feedback: "If a PCI facility is within reasonable ground transport distance (typically under 60 minutes), ground transport with pre-notification is usually faster than waiting for air medical." }
        ]
      }
    ],
    correctInterventions: [
      "12-lead ECG acquisition within 5 minutes of patient contact",
      "Right-sided ECG (V4R) to confirm RV involvement",
      "Aspirin 324 mg chewed",
      "Cautious IV fluid boluses of 250 mL NS with reassessment",
      "Withhold nitroglycerin due to RV infarction and hypotension",
      "Pain management with fentanyl 25-50 mcg IV titrated",
      "Cardiac catheterization lab activation",
      "Continuous 12-lead monitoring for dysrhythmia",
      "Prepare for potential external pacing (inferior STEMI risk of bradycardia)",
      "Rapid transport to PCI-capable facility"
    ],
    commonErrors: [
      "Administering nitroglycerin in right ventricular infarction",
      "Giving furosemide or other diuretics that reduce preload",
      "Failing to obtain a right-sided ECG in inferior STEMI",
      "Not recognizing signs of cardiogenic shock",
      "Delaying transport to stabilize blood pressure on scene",
      "Transporting to a non-PCI-capable facility",
      "Failing to activate the cath lab from the field"
    ],
    debrief: "This scenario highlights the management of an inferior STEMI with right ventricular involvement complicated by cardiogenic shock. The critical teaching points include the importance of right-sided ECG interpretation, understanding that nitroglycerin and diuretics are contraindicated in RV infarction because they reduce preload, and the value of early cath lab activation. Inferior STEMIs carry a risk of heart block, so preparation for transcutaneous pacing is also important. The balance between cautious fluid resuscitation and avoiding fluid overload requires careful clinical judgment. This is one of the most commonly tested scenarios on the NREMT and Canadian paramedic exams.",
    learningObjectives: [
      "Identify inferior STEMI on 12-lead ECG",
      "Recognize the significance of right ventricular involvement",
      "Explain why nitroglycerin is contraindicated in RV infarction",
      "Demonstrate appropriate fluid management in cardiogenic shock with RV failure",
      "Describe the process for prehospital cath lab activation"
    ],
    relatedLessonSlugs: ["chest-pain-assessment", "prehospital-ecg-basics", "cardiac-arrest-recognition"],
    status: "published"
  },
  {
    title: "Pediatric Febrile Seizure with Status Epilepticus",
    slug: "pediatric-febrile-status-epilepticus",
    contentDomain: "paramedic",
    professionTrack: "PCP",
    region: "BOTH",
    visibilityTier: "free",
    difficulty: 4,
    examRelevance: "high",
    category: "Pediatric",
    dispatchInfo: "Dispatched to a residence for a 3-year-old child who is having a seizure. The caller is the mother, who reports the child has been sick with a fever and began shaking approximately 8 minutes ago. The child has not stopped seizing.",
    sceneDescription: "You arrive at a single-family home. The mother meets you at the door, visibly panicked. She leads you to the living room where a 3-year-old male is lying on the carpet. The child is actively seizing with generalized tonic-clonic activity involving all four extremities. The mother reports the child had a fever of 39.4°C (103°F) and had been sick with an upper respiratory infection for two days.",
    sceneSafety: "Residential scene with no hazards. The child is on a soft carpet. Remove nearby furniture to prevent injury. Scene is safe to proceed.",
    primaryAssessment: "General impression: A 3-year-old male in active generalized tonic-clonic seizure. Airway is at risk due to secretions and the seizure. Breathing is irregular and shallow with sonorous respirations during brief pauses in tonic activity. Circulation shows a rapid, strong radial pulse. Skin is flushed and hot to the touch. The child is unresponsive to verbal and painful stimuli during the seizure. Weight estimated at 15 kg using a length-based tape.",
    secondaryAssessment: "Head: No signs of trauma, anterior fontanelle closed (age-appropriate). Eyes: Pupils are dilated and non-reactive during seizure activity. Ears: Right tympanic membrane appears erythematous. Neck: No nuchal rigidity appreciated (limited assessment during seizure). Chest: Difficult to assess during seizure, no retractions noted between tonic phases. Abdomen: Appears non-distended. Extremities: No rashes, petechiae, or signs of trauma. Generalized tonic-clonic movement of all extremities. Seizure has now been ongoing for approximately 12 minutes.",
    vitalSigns: {
      hr: 160,
      bp: "90/60",
      rr: 30,
      spo2: 88,
      gcs: 3,
      temp: 39.8
    },
    history: {
      signs: "Generalized tonic-clonic seizure ongoing for 12+ minutes, fever for 2 days, runny nose, cough, decreased oral intake",
      allergies: "No known allergies",
      medications: "Acetaminophen given 4 hours ago",
      pastHistory: "Born full-term, no previous seizures, immunizations up to date, no developmental concerns",
      lastMeal: "Small amount of soup about 3 hours ago",
      events: "Child had an upper respiratory infection for 2 days with fever up to 39.4°C. Mother gave acetaminophen this afternoon. Child was lying on the couch watching television when he suddenly became rigid and then began shaking. Mother placed him on the floor and called 911."
    },
    decisionPoints: [
      {
        prompt: "The child has been seizing for 12 minutes. This meets the definition of status epilepticus. What is your first pharmacological intervention?",
        options: [
          { text: "Administer IV lorazepam 0.1 mg/kg", isCorrect: false, feedback: "IV benzodiazepines are appropriate, but establishing IV access during active seizure in a 3-year-old is difficult. Consider a route that does not require IV access first." },
          { text: "Administer intranasal or rectal midazolam at the weight-appropriate dose", isCorrect: true, feedback: "Correct. Midazolam via intranasal (0.2 mg/kg) or intramuscular (0.1-0.2 mg/kg) route is preferred when IV access is not established. For a 15 kg child, intranasal midazolam 3 mg (using the 5 mg/mL concentration) is appropriate. This avoids delays from IV attempts during active seizure." },
          { text: "Administer rectal acetaminophen to reduce the fever causing the seizure", isCorrect: false, feedback: "While fever reduction is important, it will not stop an active seizure. Benzodiazepines are the first-line treatment for status epilepticus." },
          { text: "Apply cold packs to the groin and axillae to rapidly reduce the fever", isCorrect: false, feedback: "Cooling measures may be helpful adjunctively, but they will not stop the seizure and should not delay benzodiazepine administration." }
        ]
      },
      {
        prompt: "After midazolam administration, the seizure stops after 2 minutes. The child is now postictal and breathing at 12 breaths per minute with an SpO2 of 91%. What is your airway management priority?",
        options: [
          { text: "Immediately intubate to protect the airway", isCorrect: false, feedback: "Intubation is not indicated at this point. The child has stopped seizing and is breathing, although slowly. Support ventilation with BVM if respiratory rate or tidal volume is inadequate." },
          { text: "Position the child in the recovery position, suction secretions, provide high-flow oxygen, and monitor respiratory rate closely", isCorrect: true, feedback: "Correct. The postictal state with benzodiazepine administration can cause respiratory depression. Position for airway protection, suction as needed, apply high-flow oxygen, and be prepared to assist ventilations with BVM if rate drops below 12 or SpO2 does not improve." },
          { text: "Insert a nasopharyngeal airway and begin bag-valve-mask ventilation immediately", isCorrect: false, feedback: "If the child is breathing adequately (even if slowly), supportive positioning and oxygen are preferred. BVM-assisted ventilation is reserved for inadequate respiratory effort." },
          { text: "No airway intervention is needed since the seizure has stopped", isCorrect: false, feedback: "Postictal respiratory depression compounded by benzodiazepine sedation requires close monitoring and intervention-readiness. Ignoring airway management at this stage is dangerous." }
        ]
      },
      {
        prompt: "The child's SpO2 improves to 96% on oxygen. Temperature remains 39.8°C. Should you administer antipyretics?",
        options: [
          { text: "Yes, administer weight-appropriate acetaminophen or ibuprofen rectally", isCorrect: true, feedback: "Correct. Antipyretic therapy is appropriate to reduce fever and patient discomfort. Rectal acetaminophen (15 mg/kg) is a reasonable choice in the postictal child who cannot take oral medications. While antipyretics may not prevent recurrence, they address the underlying fever." },
          { text: "No, antipyretics are ineffective and should not be given", isCorrect: false, feedback: "Antipyretics are appropriate for fever reduction and patient comfort. While they may not prevent febrile seizure recurrence, treating the fever is still standard care." },
          { text: "Apply ice water immersion to rapidly reduce the temperature", isCorrect: false, feedback: "Ice water immersion is not appropriate for febrile illness in pediatric patients. This can cause shivering (which increases metabolic demand), hypothermia, and significant distress." },
          { text: "Wait until arrival at the emergency department", isCorrect: false, feedback: "Initiating antipyretic therapy in the field is appropriate and should not be delayed. The high fever contributes to patient discomfort and metabolic demand." }
        ]
      }
    ],
    correctInterventions: [
      "Ensure scene safety and protect the child from injury during seizure",
      "Note seizure start time and characteristics",
      "Suction airway as needed",
      "Administer intranasal or IM midazolam at weight-appropriate dose",
      "Apply high-flow oxygen via blow-by or non-rebreather",
      "Obtain blood glucose to rule out hypoglycemia",
      "Monitor respiratory status closely for benzodiazepine-induced depression",
      "Administer weight-appropriate antipyretic for fever",
      "Place in recovery position once seizure resolves",
      "Transport with continuous monitoring",
      "Reassure the parent and provide clear communication"
    ],
    commonErrors: [
      "Attempting to restrain the child or place objects in the mouth during the seizure",
      "Delaying benzodiazepine administration while attempting IV access",
      "Failing to check blood glucose",
      "Not monitoring for respiratory depression after benzodiazepine administration",
      "Administering adult doses of medications",
      "Not using a length-based tape for weight estimation",
      "Failing to reassure and communicate with the panicked parent"
    ],
    debrief: "This scenario addresses pediatric febrile seizures progressing to status epilepticus (seizure lasting greater than 5 minutes). Key points include the importance of route selection for benzodiazepines (intranasal or IM when IV access is not available), weight-based dosing using a length-based tape, and the need for vigilant respiratory monitoring after benzodiazepine administration. Febrile seizures are common in children aged 6 months to 5 years and are generally benign, but status epilepticus requires aggressive treatment. Always check blood glucose, as hypoglycemia can both cause and prolong seizures. Communication with a frightened parent is a critical skill that is often overlooked in the emergency setting.",
    learningObjectives: [
      "Define status epilepticus and its treatment thresholds",
      "Select appropriate benzodiazepine route and dose for pediatric seizures",
      "Use length-based equipment for pediatric weight estimation and drug dosing",
      "Monitor for and manage post-benzodiazepine respiratory depression",
      "Differentiate febrile seizures from other pediatric seizure etiologies"
    ],
    relatedLessonSlugs: ["seizure-assessment", "pediatric-respiratory-distress", "vital-signs-interpretation"],
    status: "published"
  },
  {
    title: "Severe Anaphylaxis from Bee Sting",
    slug: "severe-anaphylaxis-bee-sting",
    contentDomain: "paramedic",
    professionTrack: "PCP",
    region: "BOTH",
    visibilityTier: "free",
    difficulty: 3,
    examRelevance: "high",
    category: "Medical Emergencies",
    dispatchInfo: "Dispatched to a park for a 34-year-old female with difficulty breathing after being stung by a bee. The caller reports the patient's face is swelling and she is having trouble speaking.",
    sceneDescription: "You arrive at a public park to find a 34-year-old female sitting on a bench, leaning forward. She has visible angioedema of the lips, tongue, and periorbital area. Hives are present across her chest, arms, and neck. She is speaking in short phrases between labored breaths. A friend is with her and reports the patient was stung on her right forearm approximately 10 minutes ago.",
    sceneSafety: "Outdoor scene at a park. No active threat from bees at the patient's current location. Scene is safe.",
    primaryAssessment: "General impression: A 34-year-old female in severe respiratory distress with signs of anaphylaxis. Airway is compromised with audible stridor and tongue swelling. Breathing is labored at 32 breaths per minute with bilateral wheezing and use of accessory muscles. Circulation shows a rapid, weak radial pulse at 130 bpm. Skin shows diffuse urticaria, flushed and warm. Patient is alert but anxious and can only speak in 2-3 word phrases.",
    secondaryAssessment: "Head: Significant periorbital and lip edema, tongue visibly swollen. Neck: Mild stridor heard without a stethoscope. Chest: Bilateral inspiratory and expiratory wheezing, poor air movement. Abdomen: Reports nausea and cramping. Extremities: Bee sting site on right forearm with local swelling, diffuse urticaria. No rashes suggestive of alternative diagnosis.",
    vitalSigns: {
      hr: 130,
      bp: "82/50",
      rr: 32,
      spo2: 88,
      gcs: 15,
      temp: 37.0
    },
    history: {
      signs: "Difficulty breathing, throat tightness, facial and tongue swelling, diffuse hives, nausea, abdominal cramping, lightheadedness",
      allergies: "Known bee allergy (previous mild reaction treated with diphenhydramine, no prior epinephrine use)",
      medications: "Oral contraceptive pill",
      pastHistory: "Previous mild allergic reaction to bee sting 3 years ago. No asthma or other medical history.",
      lastMeal: "Lunch about 1 hour ago",
      events: "Stung by a bee on the right forearm while walking in the park. Symptoms began within 5 minutes of the sting and have been rapidly progressing. The patient did not have an EpiPen with her."
    },
    decisionPoints: [
      {
        prompt: "This patient presents with stridor, wheezing, urticaria, and hypotension after a bee sting. What is the first and most critical medication to administer?",
        options: [
          { text: "Diphenhydramine 50 mg IV", isCorrect: false, feedback: "Diphenhydramine is an adjunct treatment but is NOT the first-line medication for anaphylaxis. It does not reverse bronchospasm, laryngeal edema, or hypotension." },
          { text: "Epinephrine 0.3-0.5 mg IM in the lateral thigh", isCorrect: true, feedback: "Correct. Intramuscular epinephrine (1:1,000, 0.3-0.5 mg) in the lateral thigh is the FIRST-LINE treatment for anaphylaxis. It addresses bronchospasm, laryngeal edema, and hypotension through its alpha and beta adrenergic effects. Do not delay this medication." },
          { text: "Albuterol 2.5 mg via nebulizer for the wheezing", isCorrect: false, feedback: "Albuterol is useful as an adjunct for bronchospasm, but it does not address the systemic anaphylactic response (hypotension, angioedema). Epinephrine must come first." },
          { text: "Methylprednisolone 125 mg IV to prevent biphasic reaction", isCorrect: false, feedback: "Corticosteroids may help prevent biphasic reactions but take hours to work. They are adjunct therapy and should never replace or precede epinephrine." }
        ]
      },
      {
        prompt: "After IM epinephrine, the patient's wheezing has slightly improved but BP remains 84/52 and stridor persists. What is your next step?",
        options: [
          { text: "Repeat IM epinephrine in 5 minutes if no improvement", isCorrect: true, feedback: "Correct. IM epinephrine can be repeated every 5-15 minutes. Additionally, establish IV access for fluid resuscitation (1-2 L NS bolus for hypotension), administer nebulized albuterol for persistent bronchospasm, and consider diphenhydramine and methylprednisolone as adjuncts." },
          { text: "Switch to IV epinephrine drip at a high rate", isCorrect: false, feedback: "IV epinephrine infusion may be considered for refractory anaphylaxis, but the next appropriate step is to repeat IM epinephrine and initiate aggressive IV fluid resuscitation. IV epinephrine carries significant risk of dysrhythmia." },
          { text: "Administer only diphenhydramine and observe", isCorrect: false, feedback: "The patient remains hemodynamically unstable. Diphenhydramine alone is insufficient. Repeat epinephrine and initiate fluid resuscitation." },
          { text: "Perform emergent cricothyrotomy for the stridor", isCorrect: false, feedback: "Cricothyrotomy is a last resort for complete airway obstruction when other methods fail. The patient is still moving air. Repeat epinephrine to address laryngeal edema first." }
        ]
      }
    ],
    correctInterventions: [
      "Immediate IM epinephrine 0.3-0.5 mg (1:1,000) in lateral thigh",
      "High-flow oxygen via non-rebreather mask at 15 L/min",
      "Establish IV access with large-bore catheter",
      "IV normal saline bolus 1-2 liters for hypotension",
      "Repeat IM epinephrine every 5-15 minutes as needed",
      "Nebulized albuterol 2.5 mg for persistent wheezing",
      "Diphenhydramine 25-50 mg IV as adjunct",
      "Methylprednisolone 125 mg IV to reduce biphasic risk",
      "Continuous cardiac monitoring",
      "Prepare advanced airway equipment in case of complete obstruction",
      "Rapid transport with continuous reassessment"
    ],
    commonErrors: [
      "Delaying epinephrine administration in favor of antihistamines",
      "Administering epinephrine subcutaneously instead of intramuscularly",
      "Using the wrong concentration of epinephrine (1:10,000 IV push instead of 1:1,000 IM)",
      "Failing to repeat epinephrine when the first dose is ineffective",
      "Not initiating IV fluid resuscitation for anaphylactic shock",
      "Relying on diphenhydramine as the primary treatment",
      "Not preparing for advanced airway management with progressive stridor"
    ],
    debrief: "Anaphylaxis is a true medical emergency that requires immediate recognition and treatment. The cornerstone of anaphylaxis management is IM epinephrine, and it should never be withheld or delayed. This scenario demonstrates the progression from moderate to severe anaphylaxis and the need for repeated epinephrine doses, aggressive fluid resuscitation, and adjunctive medications. Always be prepared for airway deterioration, as laryngeal edema can progress to complete obstruction. This is one of the most commonly tested emergency scenarios on paramedic certification exams across both Canada and the United States.",
    learningObjectives: [
      "Recognize the clinical criteria for anaphylaxis diagnosis",
      "Administer IM epinephrine as the first-line treatment",
      "Manage refractory anaphylaxis with repeat dosing and adjuncts",
      "Initiate appropriate fluid resuscitation for anaphylactic shock",
      "Prepare for advanced airway management in progressive angioedema"
    ],
    relatedLessonSlugs: ["anaphylaxis-management", "shock-assessment", "oxygen-delivery-devices"],
    status: "published"
  },
  {
    title: "Diabetic Ketoacidosis in a Young Adult",
    slug: "diabetic-ketoacidosis-young-adult",
    contentDomain: "paramedic",
    professionTrack: "PCP",
    region: "BOTH",
    visibilityTier: "free",
    difficulty: 3,
    examRelevance: "high",
    category: "Medical Emergencies",
    dispatchInfo: "Dispatched to a university dormitory for a 22-year-old female found confused by her roommate. The caller reports the patient is a known diabetic and appears very unwell.",
    sceneDescription: "You arrive at a university dormitory room to find a 22-year-old female lying on her bed. She is confused and responds slowly to questions. Her roommate reports the patient has been sick for 2 days with a stomach flu and has not been eating or taking her insulin regularly. The room has a distinct fruity odor.",
    sceneSafety: "Indoor residential scene with no hazards. Scene is safe.",
    primaryAssessment: "General impression: A 22-year-old female who is lethargic and confused. Airway is patent. Breathing is deep and rapid (Kussmaul respirations) at 28 breaths per minute. Fruity (acetone) odor noted on the patient's breath. Circulation shows a rapid, thready radial pulse at 118 bpm. Skin is warm, dry, and with poor turgor. The patient is confused, oriented only to person, and responds sluggishly.",
    secondaryAssessment: "Head: No trauma. Eyes: Sunken appearance, pupils equal and reactive. Mouth: Dry mucous membranes, fruity breath odor. Neck: No JVD, no meningismus. Chest: Clear bilaterally with deep, rapid respirations. Abdomen: Diffuse tenderness without guarding or rigidity. Extremities: No edema, poor skin turgor, dry skin. Neurological: GCS 13 (E3V4M6), confused but follows commands. Blood glucose reading is HIGH (above meter limit of 500 mg/dL or 27.8 mmol/L).",
    vitalSigns: {
      hr: 118,
      bp: "96/64",
      rr: 28,
      spo2: 98,
      gcs: 13,
      etco2: 18,
      glucose: 550,
      temp: 37.4
    },
    history: {
      signs: "Confusion progressing over 12 hours, nausea, vomiting for 2 days, abdominal pain, excessive thirst, frequent urination before becoming ill, weakness",
      allergies: "No known allergies",
      medications: "Insulin glargine 22 units at bedtime, insulin lispro with meals (has not taken either for 2 days due to vomiting)",
      pastHistory: "Type 1 diabetes mellitus diagnosed at age 14, one prior DKA admission at age 16",
      lastMeal: "Unable to keep food down for 2 days, last attempted to eat crackers yesterday afternoon",
      events: "Developed nausea and vomiting 2 days ago, assumed it was a stomach flu. Stopped taking insulin because she was not eating. Became increasingly confused over the past 12 hours. Roommate found her confused and not making sense this morning and called 911."
    },
    decisionPoints: [
      {
        prompt: "Blood glucose reads HIGH (>500 mg/dL). The patient has Kussmaul respirations, fruity breath, and is a known Type 1 diabetic who stopped taking insulin. What is the most likely diagnosis?",
        options: [
          { text: "Hyperosmolar hyperglycemic state (HHS)", isCorrect: false, feedback: "HHS typically occurs in Type 2 diabetics, presents with extreme hyperglycemia (often >600 mg/dL), and does NOT typically have Kussmaul respirations or fruity breath because significant ketosis is usually absent." },
          { text: "Diabetic ketoacidosis (DKA)", isCorrect: true, feedback: "Correct. The classic triad of DKA: hyperglycemia, Kussmaul respirations (compensating for metabolic acidosis), and fruity/acetone breath (from ketone production). This Type 1 diabetic stopped insulin, which triggered ketoacidosis." },
          { text: "Hypoglycemia with altered mental status", isCorrect: false, feedback: "The blood glucose is critically HIGH, not low. Hypoglycemia would present with glucose below 70 mg/dL (3.9 mmol/L)." },
          { text: "Alcohol intoxication with a coincidental high glucose", isCorrect: false, feedback: "The clinical presentation with Kussmaul respirations, fruity breath, dehydration, and known Type 1 diabetes without insulin use is classic DKA. Do not dismiss the finding." }
        ]
      },
      {
        prompt: "What is the appropriate prehospital fluid management for this DKA patient?",
        options: [
          { text: "Administer D50W to raise glucose levels", isCorrect: false, feedback: "The patient's glucose is already critically high. Dextrose would worsen hyperglycemia and is absolutely contraindicated." },
          { text: "Initiate a normal saline infusion at 500 mL/hour", isCorrect: true, feedback: "Correct. IV normal saline is the primary prehospital treatment for DKA. These patients are profoundly dehydrated (often 5-10 liters deficit). A bolus of 1 liter over the first hour, then 500 mL/hour, is appropriate. Insulin administration is typically reserved for the emergency department." },
          { text: "Administer insulin 10 units IV to lower the glucose", isCorrect: false, feedback: "Prehospital insulin administration for DKA is generally not recommended. It requires careful potassium monitoring and titration that is best done in the ED. Fluid resuscitation alone will begin to lower glucose." },
          { text: "Restrict fluids due to risk of cerebral edema", isCorrect: false, feedback: "Cerebral edema from rapid fluid administration is primarily a concern in pediatric DKA. Adult DKA patients are severely dehydrated and require aggressive fluid resuscitation." }
        ]
      }
    ],
    correctInterventions: [
      "Obtain blood glucose reading",
      "Establish IV access with large-bore catheter",
      "Initiate normal saline infusion (1 L bolus, then 500 mL/hr)",
      "Continuous cardiac monitoring (risk of hyperkalemia-related dysrhythmias)",
      "Supplemental oxygen if SpO2 is low or to support respiratory effort",
      "Monitor level of consciousness closely",
      "Position for comfort and aspiration prevention",
      "Transport to emergency department for insulin therapy and electrolyte management",
      "Obtain 12-lead ECG to assess for hyperkalemia changes"
    ],
    commonErrors: [
      "Administering insulin in the prehospital setting without electrolyte monitoring",
      "Administering dextrose for a critically high blood glucose",
      "Failing to recognize Kussmaul respirations as compensation for metabolic acidosis",
      "Not initiating aggressive IV fluid resuscitation",
      "Mistaking DKA for alcohol intoxication",
      "Not monitoring cardiac rhythm for hyperkalemia signs"
    ],
    debrief: "DKA is a life-threatening emergency most common in Type 1 diabetics who discontinue insulin. The metabolic derangement produces significant acidosis, dehydration, and electrolyte imbalances. Prehospital management focuses on fluid resuscitation with normal saline and monitoring. The low EtCO2 of 18 mmHg reflects respiratory compensation for metabolic acidosis and should not be treated by slowing respirations. Kussmaul respirations are the body's attempt to blow off CO2 to compensate for the severe metabolic acidosis. Key exam points include differentiating DKA from HHS and understanding why prehospital insulin is not standard practice.",
    learningObjectives: [
      "Recognize the classic presentation of diabetic ketoacidosis",
      "Differentiate DKA from HHS based on clinical features",
      "Explain the pathophysiology behind Kussmaul respirations in DKA",
      "Initiate appropriate prehospital fluid resuscitation",
      "Identify the risk of cardiac dysrhythmias from electrolyte imbalances in DKA"
    ],
    relatedLessonSlugs: ["diabetic-emergencies", "vital-signs-interpretation", "glasgow-coma-scale"],
    status: "published"
  },
  {
    title: "Acute Opioid Overdose with Respiratory Arrest",
    slug: "opioid-overdose-respiratory-arrest",
    contentDomain: "paramedic",
    professionTrack: "PCP",
    region: "BOTH",
    visibilityTier: "free",
    difficulty: 3,
    examRelevance: "high",
    category: "Toxicology",
    dispatchInfo: "Dispatched to a public restroom for an unconscious person. The caller is a bystander who found the person unresponsive in a restroom stall. Possible drug use suspected.",
    sceneDescription: "You arrive at a public restroom in a shopping center. Security has unlocked the stall. A 28-year-old male is found slumped on the floor, unresponsive. A syringe and tourniquet are on the floor beside him. His lips are cyanotic. There is no visible bleeding.",
    sceneSafety: "Exercise caution for sharps (needles, syringes). Wear gloves and eye protection. Check for additional hazards such as powdered substances (potential fentanyl exposure). Do not handle unknown substances. Scene is otherwise safe. Request law enforcement if not already on scene.",
    primaryAssessment: "General impression: A 28-year-old male who is unresponsive and cyanotic. Airway is patent but unprotected with sonorous respirations. Breathing is agonal at 4 breaths per minute, shallow and ineffective. Circulation shows a weak, bradycardic pulse at 48 bpm. Skin is cyanotic, cool, and clammy. The patient is unresponsive to verbal stimuli, withdraws slightly to deep painful stimuli. Pupils are pinpoint bilaterally.",
    secondaryAssessment: "Head: No trauma. Eyes: Pupils pinpoint bilaterally (classic opioid toxicity). Neck: No JVD, no trauma. Chest: Minimal air movement bilaterally, agonal effort. Abdomen: Unremarkable. Extremities: Fresh injection track marks on bilateral antecubital fossae. No edema. Skin: Cyanotic, especially lips and nail beds.",
    vitalSigns: {
      hr: 48,
      bp: "76/44",
      rr: 4,
      spo2: 68,
      gcs: 5,
      etco2: 72,
      temp: 36.0
    },
    history: {
      signs: "Unresponsive, agonal breathing, pinpoint pupils, cyanosis, track marks indicating IV drug use",
      allergies: "Unknown",
      medications: "Unknown",
      pastHistory: "Unknown, track marks suggest history of IV drug use",
      lastMeal: "Unknown",
      events: "Found unresponsive in a restroom stall by a bystander approximately 10 minutes ago. Syringe and tourniquet found nearby. Unknown time of drug administration."
    },
    decisionPoints: [
      {
        prompt: "The patient has agonal respirations at 4/min, pinpoint pupils, and cyanosis with drug paraphernalia nearby. What is your immediate first action?",
        options: [
          { text: "Administer naloxone 2 mg intranasal immediately", isCorrect: false, feedback: "Naloxone is essential, but the FIRST priority in a patient with agonal respirations and an SpO2 of 68% is to ventilate. Begin BVM ventilations to oxygenate the patient, then administer naloxone." },
          { text: "Begin bag-valve-mask ventilations with high-flow oxygen", isCorrect: true, feedback: "Correct. The immediate life threat is respiratory failure with profound hypoxia. Open the airway, insert an OPA or NPA, and begin BVM ventilations with 100% oxygen. Naloxone should be given simultaneously or immediately after initiating ventilation, but oxygenation comes first." },
          { text: "Start chest compressions as the patient may be in cardiac arrest", isCorrect: false, feedback: "The patient has a pulse (48 bpm). This is not cardiac arrest. The primary problem is respiratory depression from opioid toxicity. Ventilation and naloxone are the priorities." },
          { text: "Establish IV access and administer normal saline", isCorrect: false, feedback: "IV access is important but secondary to the immediate need for ventilation. This patient is dying from respiratory failure, not hypovolemia." }
        ]
      },
      {
        prompt: "You have begun BVM ventilations and the SpO2 is rising. How do you administer naloxone?",
        options: [
          { text: "Naloxone 2 mg IV push, one dose only", isCorrect: false, feedback: "While IV is effective, if IV access is not immediately available, do not delay naloxone for IV placement. Also, with potent synthetic opioids like fentanyl, higher or repeated doses may be needed." },
          { text: "Naloxone 0.4-2 mg via the most available route (IN, IM, or IV) and titrate to adequate respiratory effort", isCorrect: true, feedback: "Correct. Give naloxone via the fastest available route. Intranasal (2 mg per nostril), IM (0.4-2 mg), or IV (0.4-2 mg) are all acceptable. Titrate to restore adequate respiratory drive (RR > 12), not necessarily full consciousness. Be prepared to repeat doses every 2-3 minutes, especially with fentanyl or carfentanil." },
          { text: "Naloxone 0.1 mg IV to avoid precipitating withdrawal", isCorrect: false, feedback: "In a patient with agonal respirations and critical hypoxia, the priority is reversing the respiratory depression. Under-dosing naloxone can be fatal. Titrate to adequate ventilation." },
          { text: "Withhold naloxone and continue BVM ventilations only", isCorrect: false, feedback: "While BVM alone can support the patient, naloxone reverses the underlying opioid toxicity and restores spontaneous breathing. It should be administered." }
        ]
      },
      {
        prompt: "After 4 mg of naloxone, the patient begins breathing at 14/min and becomes agitated. He wants to refuse transport. How do you manage this?",
        options: [
          { text: "Allow him to refuse and sign an AMA form", isCorrect: false, feedback: "Naloxone has a shorter half-life than most opioids (30-90 minutes vs hours). The patient is at high risk for re-narcotization and death if the naloxone wears off. This must be explained clearly." },
          { text: "Explain the risk of re-narcotization, strongly encourage transport, and document a thorough informed refusal if he insists on refusing", isCorrect: true, feedback: "Correct. The patient must understand that naloxone wears off before the opioid does, and respiratory arrest can recur. Strongly encourage transport, involve medical control if available, and if the patient still refuses, document a thorough informed refusal with competency assessment." },
          { text: "Physically restrain him and transport against his will", isCorrect: false, feedback: "If the patient is alert, oriented, and has decision-making capacity, you cannot force transport. Clearly explain the risks and document appropriately." },
          { text: "Administer more naloxone to keep him awake longer", isCorrect: false, feedback: "Administering more naloxone than needed to maintain adequate respirations will precipitate severe withdrawal (agitation, vomiting, seizures) and may drive the patient to refuse care." }
        ]
      }
    ],
    correctInterventions: [
      "BSI precautions with gloves and eye protection",
      "Open airway with head-tilt chin-lift or jaw thrust",
      "Insert NPA or OPA for airway maintenance",
      "Begin BVM ventilations with 100% oxygen",
      "Administer naloxone via available route (IN, IM, or IV)",
      "Titrate naloxone to adequate respiratory effort",
      "Establish IV access",
      "Continuous cardiac monitoring",
      "Monitor for re-narcotization during transport",
      "Provide clear risk communication if patient considers AMA",
      "Transport to emergency department for observation period"
    ],
    commonErrors: [
      "Administering naloxone before initiating ventilatory support",
      "Failing to ventilate a patient with agonal respirations",
      "Under-dosing naloxone with fentanyl or synthetic opioid overdoses",
      "Allowing immediate AMA without explaining re-narcotization risk",
      "Not wearing appropriate PPE around drug paraphernalia",
      "Over-dosing naloxone causing severe withdrawal",
      "Failing to monitor for re-narcotization during transport"
    ],
    debrief: "Opioid overdose is one of the most common toxicological emergencies encountered in EMS. The clinical triad of opioid toxicity is respiratory depression, altered consciousness, and pinpoint pupils. The immediate priority is always ventilation and oxygenation, followed by naloxone administration. Modern opioid overdoses frequently involve fentanyl and its analogs, which may require higher and repeated doses of naloxone. The critical post-resuscitation concern is re-narcotization: naloxone has a shorter duration of action than most opioids. Always strongly encourage transport and thoroughly document any refusal of care.",
    learningObjectives: [
      "Recognize the classic opioid toxicity triad",
      "Prioritize BVM ventilation before naloxone administration",
      "Select appropriate naloxone route, dose, and titration endpoints",
      "Explain re-narcotization risk and manage AMA scenarios",
      "Demonstrate appropriate scene safety around drug paraphernalia"
    ],
    relatedLessonSlugs: ["airway-management-fundamentals", "bag-valve-mask-ventilation", "opa-vs-npa"],
    status: "published"
  },
  {
    title: "Obstetric Emergency: Prolapsed Umbilical Cord",
    slug: "obstetric-prolapsed-cord",
    contentDomain: "paramedic",
    professionTrack: "PCP",
    region: "BOTH",
    visibilityTier: "free",
    difficulty: 5,
    examRelevance: "high",
    category: "Obstetrics",
    dispatchInfo: "Dispatched emergent to a residence for a 30-year-old female, 36 weeks pregnant, with ruptured membranes and something coming out of the vagina. The caller is very distraught.",
    sceneDescription: "You arrive at a home to find a 30-year-old female, G3P2, lying on the living room floor on her left side. She reports her water broke about 15 minutes ago and she can feel something protruding from the vagina. She states the baby is not due for another 4 weeks. Visual inspection reveals the umbilical cord is visible at the vaginal introitus. The cord is pulsating.",
    sceneSafety: "Indoor residential scene. No hazards. Scene is safe.",
    primaryAssessment: "General impression: A 30-year-old female at 36 weeks gestation in obvious distress with a prolapsed umbilical cord. Airway is patent with clear speech. Breathing is rapid at 26 breaths per minute but unlabored. Circulation shows a regular radial pulse at 110 bpm. Skin is warm and moist. The patient is alert, anxious, and tearful. The umbilical cord is visible and pulsating, indicating fetal viability.",
    secondaryAssessment: "Obstetric assessment: Fundal height consistent with 36 weeks. Contractions are occurring every 3-4 minutes. Umbilical cord is visible at the introitus and pulsating. No active vaginal hemorrhage noted. The patient reports feeling pressure but denies the urge to push. Fetal presentation cannot be fully assessed in the field. General assessment: Abdomen is gravid with no tenderness aside from contractions. Extremities show trace edema bilaterally. No signs of pre-eclampsia (no headache, visual changes, or hyperreflexia noted).",
    vitalSigns: {
      hr: 110,
      bp: "128/82",
      rr: 26,
      spo2: 99,
      gcs: 15,
      temp: 37.2
    },
    history: {
      signs: "Spontaneous rupture of membranes 15 minutes ago, visible cord prolapse, regular contractions every 3-4 minutes, pelvic pressure",
      allergies: "No known allergies",
      medications: "Prenatal vitamins",
      pastHistory: "G3P2, two previous uncomplicated vaginal deliveries at term. No history of preterm labor. No gestational diabetes or hypertension during this pregnancy.",
      lastMeal: "Dinner approximately 1 hour ago",
      events: "Patient was sitting on the couch when she felt a gush of fluid (rupture of membranes). Shortly after, she felt something between her legs and saw the cord when she looked. She immediately laid down on her left side and called 911."
    },
    decisionPoints: [
      {
        prompt: "You have confirmed a prolapsed umbilical cord with a pulsating cord visible at the vaginal introitus. What is your immediate intervention?",
        options: [
          { text: "Gently attempt to push the cord back into the uterus", isCorrect: false, feedback: "Never attempt to push the cord back in. This can cause vasospasm of the cord vessels and further compromise fetal blood flow." },
          { text: "With a gloved hand, insert two fingers into the vagina and elevate the presenting part off the cord to relieve compression", isCorrect: true, feedback: "Correct. The critical intervention is to relieve pressure on the cord. Insert two gloved fingers into the vagina and push the presenting part (usually the fetal head) upward, away from the cord. Maintain this position continuously until surgical delivery. Cover the exposed cord with warm, moist sterile dressings." },
          { text: "Clamp and cut the cord to prevent further compression", isCorrect: false, feedback: "Cutting a pulsating cord would immediately cut off fetal blood supply. The cord is the fetus's lifeline and must be protected, not severed." },
          { text: "Place the patient in a sitting position and prepare for imminent delivery", isCorrect: false, feedback: "A sitting or standing position increases gravitational pressure on the cord. The patient should be placed in Trendelenburg or knee-chest position to reduce cord compression." }
        ]
      },
      {
        prompt: "You are maintaining manual elevation of the presenting part. What position should the patient be placed in during transport?",
        options: [
          { text: "Supine with legs elevated", isCorrect: false, feedback: "Supine positioning in late pregnancy can cause supine hypotension syndrome from aortocaval compression. A modified position is needed." },
          { text: "Knee-chest position or Trendelenburg with left lateral tilt", isCorrect: true, feedback: "Correct. Knee-chest position uses gravity to pull the fetus away from the cord. If knee-chest is not feasible during transport, Trendelenburg with left lateral tilt is the alternative. These positions minimize cord compression and avoid aortocaval compression." },
          { text: "Left lateral recumbent position (flat)", isCorrect: false, feedback: "While left lateral is appropriate for most obstetric patients, a prolapsed cord requires additional elevation of the hips above the shoulders (Trendelenburg) to use gravity to reduce cord compression." },
          { text: "Sitting upright for the patient's comfort", isCorrect: false, feedback: "Upright positioning increases gravitational pressure on the cord and worsens compression. The patient's position should prioritize fetal well-being." }
        ]
      }
    ],
    correctInterventions: [
      "Do not attempt to push the cord back into the vagina",
      "With a sterile gloved hand, elevate the presenting part off the cord",
      "Cover the exposed cord with warm, moist sterile dressings to prevent vasospasm",
      "Place patient in knee-chest position or Trendelenburg with left lateral tilt",
      "Administer high-flow oxygen to the mother",
      "Establish IV access with normal saline",
      "Maintain manual elevation of presenting part continuously",
      "Transport emergently to the nearest facility with operative delivery capability",
      "Provide pre-arrival notification for emergency cesarean section",
      "Reassure the patient and explain the interventions"
    ],
    commonErrors: [
      "Attempting to push the cord back into the uterus",
      "Clamping or cutting the pulsating cord",
      "Placing the patient in a position that increases cord compression",
      "Failing to keep the exposed cord warm and moist",
      "Releasing manual elevation of the presenting part during transport",
      "Transporting to a facility without surgical capability",
      "Attempting vaginal delivery with a prolapsed cord"
    ],
    debrief: "Prolapsed umbilical cord is a true obstetric emergency with a high risk of fetal mortality if not managed correctly. The key intervention is continuous manual elevation of the presenting part off the cord until emergency cesarean section can be performed. The cord must be kept warm and moist to prevent vasospasm. Patient positioning using Trendelenburg or knee-chest helps use gravity to reduce cord compression. This scenario requires immediate recognition, decisive action, and rapid transport to a facility with surgical capability. The paramedic must maintain manual elevation continuously and coordinate effectively with the receiving facility for immediate operative delivery.",
    learningObjectives: [
      "Recognize a prolapsed umbilical cord and its implications for fetal survival",
      "Perform manual elevation of the presenting part to relieve cord compression",
      "Position the patient appropriately to minimize cord compression",
      "Protect the exposed cord from drying and vasospasm",
      "Coordinate emergent transport to a facility with cesarean section capability"
    ],
    relatedLessonSlugs: ["scene-safety", "vital-signs-interpretation"],
    status: "published"
  },
  {
    title: "Acute Stroke with Large Vessel Occlusion",
    slug: "acute-stroke-lvo",
    contentDomain: "paramedic",
    professionTrack: "PCP",
    region: "BOTH",
    visibilityTier: "free",
    difficulty: 3,
    examRelevance: "high",
    category: "Neurology",
    dispatchInfo: "Dispatched to a residence for a 67-year-old male with sudden onset of weakness on the right side and difficulty speaking. The caller is the patient's wife who reports symptoms started approximately 30 minutes ago.",
    sceneDescription: "You arrive at a well-kept home to find a 67-year-old male sitting in a recliner. His wife reports he was watching television when he suddenly dropped his coffee cup with his right hand, began slurring his words, and complained of a headache. He appears alert but is having significant difficulty speaking.",
    sceneSafety: "Indoor residential scene. No hazards identified. Scene is safe.",
    primaryAssessment: "General impression: A 67-year-old male with acute onset of focal neurological deficits consistent with stroke. Airway is patent. Breathing is regular at 18 breaths per minute with adequate tidal volume. Circulation shows a regular, strong radial pulse at 88 bpm. Skin is warm, dry, and pink. The patient is alert and attempts to communicate but produces garbled, nonsensical speech (Wernicke's aphasia). He follows some commands inconsistently.",
    secondaryAssessment: "Stroke assessment: Facial droop present on the right side. Right arm drift with inability to maintain against gravity. Speech is fluent but incomprehensible (receptive aphasia). Right leg weakness noted with inability to bear weight. FAST assessment is positive. Cincinnati Stroke Scale: 3/3 positive. Gaze preference to the left. NIHSS estimated at 14-16 (suggestive of large vessel occlusion). Last known well time: 30 minutes ago (witnessed onset). Blood glucose: 142 mg/dL (within normal limits).",
    vitalSigns: {
      hr: 88,
      bp: "178/96",
      rr: 18,
      spo2: 97,
      gcs: 12,
      glucose: 142
    },
    history: {
      signs: "Sudden right-sided weakness (face, arm, and leg), garbled speech (receptive aphasia), mild headache, right-sided neglect",
      allergies: "Sulfa drugs",
      medications: "Amlodipine 10 mg daily, warfarin 5 mg daily, metoprolol 50 mg BID",
      pastHistory: "Atrial fibrillation (on warfarin), hypertension, hyperlipidemia, hip replacement 3 years ago",
      lastMeal: "Dinner about 2 hours ago",
      events: "Witnessed onset 30 minutes ago. Was watching television when the wife noticed him drop his coffee cup, start slurring his words, and appear confused. Symptoms have not improved or worsened since onset."
    },
    decisionPoints: [
      {
        prompt: "This patient has a positive FAST assessment and high NIHSS score suggestive of large vessel occlusion. He takes warfarin for atrial fibrillation. Where should you transport?",
        options: [
          { text: "Transport to the nearest emergency department", isCorrect: false, feedback: "Not all emergency departments have stroke capabilities. A patient with suspected large vessel occlusion (LVO) needs a comprehensive stroke center with thrombectomy capability, if available within a reasonable transport time." },
          { text: "Transport to the nearest comprehensive stroke center with thrombectomy capability", isCorrect: true, feedback: "Correct. A high NIHSS score (>6) with dense focal deficits and gaze preference suggests large vessel occlusion. These patients benefit from endovascular thrombectomy, which is only available at comprehensive stroke centers. Even if a primary stroke center is closer, bypassing to a comprehensive center can improve outcomes if transport time is reasonable." },
          { text: "Transport to the patient's preferred hospital where his physician practices", isCorrect: false, feedback: "Patient preference is secondary to clinical need in a time-critical emergency. Stroke treatment is time-dependent, and the appropriate destination is based on capability, not preference." },
          { text: "Stay on scene to perform more assessments before deciding on destination", isCorrect: false, feedback: "In stroke, time is brain. Prolonged scene time delays definitive treatment. Perform assessments en route. The goal scene time should be under 15 minutes." }
        ]
      },
      {
        prompt: "The patient's blood pressure is 178/96. Should you treat the hypertension?",
        options: [
          { text: "Yes, administer labetalol to lower BP below 140/90", isCorrect: false, feedback: "Aggressive blood pressure reduction in acute stroke can worsen ischemia by reducing perfusion to the ischemic penumbra. The brain is using elevated BP to maintain blood flow around the clot." },
          { text: "No, do not treat hypertension in the prehospital setting unless BP exceeds 220/120", isCorrect: true, feedback: "Correct. Current guidelines recommend permissive hypertension in acute ischemic stroke. Do not lower blood pressure unless it exceeds 220/120 mmHg (or 185/110 if the patient will receive thrombolytics, which is a hospital decision). The elevated BP helps maintain perfusion to the ischemic penumbra." },
          { text: "Administer sublingual nitroglycerin for gradual BP reduction", isCorrect: false, feedback: "Nitroglycerin is not indicated for blood pressure management in acute stroke. Unpredictable BP drops can worsen cerebral ischemia." },
          { text: "Elevate the head of the stretcher to 90 degrees to lower intracranial pressure", isCorrect: false, feedback: "Head of bed elevation to 30 degrees is appropriate for comfort, but 90 degrees is excessive and may reduce cerebral perfusion. Position does not substitute for guideline-based BP management." }
        ]
      }
    ],
    correctInterventions: [
      "Perform and document FAST or Cincinnati Stroke Scale assessment",
      "Obtain blood glucose to rule out hypoglycemia mimicking stroke",
      "Establish the last known well time precisely",
      "Establish IV access (do not delay transport for IV)",
      "Continuous cardiac monitoring (atrial fibrillation)",
      "Maintain SpO2 above 94%",
      "Do not treat hypertension unless BP exceeds 220/120",
      "Position head of stretcher at 30 degrees",
      "Transport to comprehensive stroke center with pre-notification",
      "Relay NIHSS or severity scale score and last known well time to receiving facility",
      "Obtain 12-lead ECG to document rhythm"
    ],
    commonErrors: [
      "Treating hypertension aggressively in acute ischemic stroke",
      "Failing to establish or document last known well time",
      "Transporting to a facility without stroke intervention capability",
      "Delaying transport for extensive on-scene assessments",
      "Not checking blood glucose (hypoglycemia can mimic stroke)",
      "Failing to recognize signs of large vessel occlusion",
      "Not providing pre-arrival notification to the stroke center"
    ],
    debrief: "This scenario illustrates the prehospital management of acute ischemic stroke with suspected large vessel occlusion. Key learning points include the importance of rapid stroke recognition using validated scales, documenting the exact last known well time (critical for thrombolytic eligibility), understanding destination decisions for LVO patients, and the concept of permissive hypertension in acute stroke. The patient's atrial fibrillation and warfarin use are important for the receiving team to know, as they affect treatment decisions (warfarin may be a contraindication to tPA). Time is the most critical factor in stroke outcomes. Every 15-minute delay in reperfusion reduces the probability of a good outcome.",
    learningObjectives: [
      "Perform prehospital stroke assessment using validated scales",
      "Establish and document last known well time accurately",
      "Recognize signs suggestive of large vessel occlusion",
      "Apply permissive hypertension guidelines in acute stroke",
      "Make appropriate transport destination decisions for stroke patients"
    ],
    relatedLessonSlugs: ["stroke-recognition", "glasgow-coma-scale", "vital-signs-interpretation"],
    status: "published"
  },
  {
    title: "Tension Pneumothorax from Penetrating Chest Trauma",
    slug: "tension-pneumothorax-penetrating-trauma",
    contentDomain: "paramedic",
    professionTrack: "ACP",
    region: "BOTH",
    visibilityTier: "free",
    difficulty: 4,
    examRelevance: "high",
    category: "Trauma",
    dispatchInfo: "Dispatched Code 3 for a stabbing. A 25-year-old male has been stabbed in the left chest. Police are on scene and the scene is secured. The patient is conscious and breathing.",
    sceneDescription: "You arrive to find police on scene with the area secured. The patient, a 25-year-old male, is lying supine on the sidewalk. He has a single stab wound to the left anterior chest, approximately 4 cm in length, at the level of the 5th intercostal space in the anterior axillary line. A bystander is holding a cloth over the wound. The patient is in obvious respiratory distress.",
    sceneSafety: "Police have secured the scene and the assailant has fled. Ensure the scene remains safe. Approach cautiously. Wear appropriate PPE including gloves and eye protection for blood exposure.",
    primaryAssessment: "General impression: A 25-year-old male with a penetrating chest wound in significant respiratory distress. Airway is patent with clear speech in short phrases. Breathing is rapid and labored at 34 breaths per minute with decreased breath sounds on the left and subcutaneous emphysema palpated around the wound. Circulation shows a rapid, weak pulse at 132 bpm. Skin is pale, cool, and diaphoretic. Neck veins appear distended. Trachea is midline at present. The patient is alert but anxious.",
    secondaryAssessment: "Head: No injury. Neck: JVD present, trachea midline currently. Chest: Single penetrating wound to left chest at 5th ICS anterior axillary line. Sucking sound heard during inspiration (open pneumothorax). Subcutaneous emphysema palpable around the wound. Breath sounds absent on the left, present on the right. Abdomen: Soft, non-tender. Back: Log-roll reveals no exit wound. Extremities: No injuries, pulses present but weak.",
    vitalSigns: {
      hr: 132,
      bp: "84/56",
      rr: 34,
      spo2: 82,
      gcs: 14,
      etco2: 25
    },
    history: {
      signs: "Difficulty breathing, left chest pain, wound making a sucking sound, anxious and lightheaded",
      allergies: "No known allergies",
      medications: "None",
      pastHistory: "No significant medical history",
      lastMeal: "Ate approximately 3 hours ago",
      events: "Altercation with a known individual. Stabbed once in the left chest with a knife. No loss of consciousness. Bystanders called 911 immediately."
    },
    decisionPoints: [
      {
        prompt: "You identify an open pneumothorax (sucking chest wound) with decreasing breath sounds on the left. What is your immediate intervention?",
        options: [
          { text: "Pack the wound with hemostatic gauze", isCorrect: false, feedback: "Hemostatic gauze is for hemorrhage control, not for open pneumothorax. Packing the wound could trap air and worsen the situation." },
          { text: "Apply a vented chest seal (or three-sided occlusive dressing) over the wound", isCorrect: true, feedback: "Correct. An open pneumothorax requires sealing the wound to prevent further air entry. A commercial vented chest seal is preferred as it allows air to escape during exhalation while preventing entry during inhalation. If unavailable, a three-sided occlusive dressing achieves a similar effect." },
          { text: "Apply a fully occlusive dressing taped on all four sides", isCorrect: false, feedback: "A fully occlusive dressing (taped on all sides) can convert an open pneumothorax into a tension pneumothorax by trapping air with no escape route. Always use a vented seal or three-sided dressing." },
          { text: "Leave the wound open and provide oxygen only", isCorrect: false, feedback: "Leaving the wound open allows continued air entry into the pleural space, which will worsen the pneumothorax and respiratory failure." }
        ]
      },
      {
        prompt: "After applying a vented chest seal, the patient's condition rapidly deteriorates. BP drops to 72/40, trachea deviates to the right, and JVD increases. What has occurred?",
        options: [
          { text: "The chest seal has failed and needs to be replaced", isCorrect: false, feedback: "While the seal should be checked, the clinical picture of tracheal deviation away from the injury, increasing JVD, and worsening hypotension indicates tension pneumothorax, not seal failure." },
          { text: "Tension pneumothorax has developed and requires immediate needle decompression", isCorrect: true, feedback: "Correct. The classic signs of tension pneumothorax are present: absent breath sounds on the affected side, tracheal deviation away from the injury, JVD from impaired venous return, hypotension, and tachycardia. Needle decompression at the 2nd ICS midclavicular line or 4th-5th ICS anterior axillary line on the left side is immediately indicated." },
          { text: "Cardiac tamponade from a cardiac injury", isCorrect: false, feedback: "While the wound location makes cardiac injury possible, tracheal deviation is characteristic of tension pneumothorax, not tamponade. Tamponade presents with muffled heart sounds, JVD, and hypotension (Beck's triad) without tracheal deviation." },
          { text: "Hemorrhagic shock from internal bleeding", isCorrect: false, feedback: "Hemorrhagic shock alone would not cause tracheal deviation and JVD. The combination of these findings with absent breath sounds points to tension pneumothorax." }
        ]
      }
    ],
    correctInterventions: [
      "Apply a vented chest seal or three-sided occlusive dressing to the wound",
      "High-flow oxygen via non-rebreather mask at 15 L/min",
      "Establish two large-bore IV lines",
      "Needle decompression when tension pneumothorax develops",
      "Reassess breath sounds after decompression",
      "Fluid resuscitation with normal saline (permissive hypotension strategy)",
      "Continuous cardiac monitoring",
      "Log-roll to check for exit wounds",
      "Rapid transport to a trauma center",
      "Keep the patient warm to prevent hypothermia"
    ],
    commonErrors: [
      "Applying a fully occlusive four-sided dressing, risking tension pneumothorax",
      "Failing to recognize the progression from open to tension pneumothorax",
      "Delaying needle decompression when tension pneumothorax signs are present",
      "Not checking for exit wounds",
      "Over-resuscitating with IV fluids in penetrating trauma",
      "Not maintaining scene safety awareness in a violent incident"
    ],
    debrief: "Penetrating chest trauma requires rapid assessment and decisive intervention. This scenario progresses from an open pneumothorax to a tension pneumothorax, which is a common exam scenario. The key teaching points are: (1) open pneumothorax requires a vented chest seal or three-sided dressing, never a four-sided occlusive dressing; (2) tension pneumothorax can develop despite appropriate treatment; (3) needle decompression is the definitive prehospital intervention for tension pneumothorax; (4) always check for exit wounds in penetrating trauma. The lethal triad of trauma (hypothermia, acidosis, coagulopathy) should be prevented by keeping the patient warm and transporting rapidly for surgical intervention.",
    learningObjectives: [
      "Differentiate open pneumothorax from tension pneumothorax",
      "Apply appropriate chest seal for open pneumothorax",
      "Recognize the clinical signs of developing tension pneumothorax",
      "Perform needle decompression at the correct anatomical landmark",
      "Apply permissive hypotension principles in penetrating trauma"
    ],
    relatedLessonSlugs: ["trauma-primary-survey", "rapid-trauma-assessment", "shock-assessment"],
    status: "published"
  },
  {
    title: "Carbon Monoxide Poisoning in a Family",
    slug: "carbon-monoxide-poisoning-family",
    contentDomain: "paramedic",
    professionTrack: "PCP",
    region: "BOTH",
    visibilityTier: "free",
    difficulty: 3,
    examRelevance: "medium",
    category: "Toxicology",
    dispatchInfo: "Dispatched to a single-family home for multiple patients with headache, nausea, and dizziness. The caller reports all four family members are feeling ill. Fire department has been dispatched for possible hazmat.",
    sceneDescription: "You arrive at a single-family home in winter. Fire department is on scene and has detected elevated carbon monoxide levels (200 ppm) inside the home. All occupants have been evacuated to the front yard. Four patients: a 45-year-old father (worst symptoms), 42-year-old mother, 14-year-old daughter, and 6-year-old son. The father is sitting on the ground, confused and unsteady. The furnace was recently serviced and may be malfunctioning.",
    sceneSafety: "Do NOT enter the structure until fire department clears the scene. Work with patients in the fresh air. The scene outside is safe. Ensure the home is ventilated before allowing re-entry. Multiple patients require triage and additional resources.",
    primaryAssessment: "Focusing on the most symptomatic patient (45-year-old father): General impression: A middle-aged male who is confused and lethargic. Airway is patent. Breathing is slightly rapid at 22 breaths per minute. Circulation shows a regular pulse at 104 bpm. Skin has a flushed appearance. The patient is confused, oriented only to person, and has difficulty answering questions. Note: SpO2 reading of 97% may be falsely normal due to CO binding to hemoglobin.",
    secondaryAssessment: "Father (45M): Confused, severe headache, nausea, vomiting, dizziness, unsteady gait. Cherry-red skin color noted. SpO2 reads 97% but is unreliable (CO poisoning). CO level via CO-oximetry (if available): 35%. Mother (42F): Headache, nausea, oriented. CO-ox: 22%. Daughter (14F): Mild headache, oriented. CO-ox: 18%. Son (6M): Headache, says he feels dizzy. CO-ox: 24% (higher concern due to pediatric vulnerability). No cardiac history in any family member.",
    vitalSigns: {
      hr: 104,
      bp: "136/84",
      rr: 22,
      spo2: 97,
      gcs: 13,
      temp: 37.0
    },
    history: {
      signs: "Father: severe headache, confusion, nausea, vomiting, dizziness. Family: headache, nausea, dizziness (varying severity). All awoke with symptoms this morning.",
      allergies: "Father: No known allergies. Others: None reported.",
      medications: "Father: Metformin 500 mg BID. Others: None.",
      pastHistory: "Father: Type 2 diabetes. Others: No significant history.",
      lastMeal: "Family had dinner together last night.",
      events: "Family went to sleep last night feeling fine. All awoke this morning with headaches and nausea. Father has the worst symptoms. The furnace had been running all night during a cold snap. Fire department identified CO levels of 200 ppm inside the home."
    },
    decisionPoints: [
      {
        prompt: "The father's pulse oximetry reads 97%. Can you rely on this reading?",
        options: [
          { text: "Yes, SpO2 of 97% is reassuring", isCorrect: false, feedback: "Standard pulse oximetry cannot differentiate between oxyhemoglobin and carboxyhemoglobin. It reads CO-bound hemoglobin as oxygenated, giving a falsely normal reading. This is a critical exam point." },
          { text: "No, standard pulse oximetry is unreliable in CO poisoning because it cannot distinguish carboxyhemoglobin from oxyhemoglobin", isCorrect: true, feedback: "Correct. Standard pulse oximetry measures all forms of hemoglobin that absorb light at similar wavelengths. Carboxyhemoglobin (COHb) is read as oxyhemoglobin, producing a falsely normal SpO2. CO-oximetry or arterial blood gas with co-oximetry is needed for accurate assessment." },
          { text: "Partially reliable, subtract the estimated CO level from the SpO2", isCorrect: false, feedback: "You cannot mathematically correct a standard SpO2 reading for CO poisoning. The reading is fundamentally flawed due to the way light absorption works with carboxyhemoglobin." },
          { text: "It depends on the brand of pulse oximeter used", isCorrect: false, feedback: "All standard pulse oximeters have this limitation. Only specialized CO-oximeters can differentiate carboxyhemoglobin from oxyhemoglobin." }
        ]
      },
      {
        prompt: "What is the primary prehospital treatment for all four CO-exposed patients?",
        options: [
          { text: "Remove from the exposure and monitor in fresh air", isCorrect: false, feedback: "Removing patients from the exposure is essential, but monitoring alone is insufficient. Active treatment with high-flow oxygen is needed to accelerate CO elimination." },
          { text: "High-flow 100% oxygen via non-rebreather mask for all patients", isCorrect: true, feedback: "Correct. High-flow 100% oxygen is the definitive prehospital treatment for CO poisoning. It reduces the half-life of carboxyhemoglobin from approximately 5 hours on room air to 60-90 minutes on 100% oxygen. All exposed patients should receive high-flow O2 regardless of symptoms." },
          { text: "Oxygen titrated to maintain SpO2 above 94%", isCorrect: false, feedback: "Titrating oxygen based on SpO2 is inappropriate because SpO2 is unreliable in CO poisoning. All patients need maximum oxygen regardless of what the pulse oximeter reads." },
          { text: "Oxygen only for symptomatic patients", isCorrect: false, feedback: "All exposed patients should receive high-flow oxygen, including those with mild or no symptoms, because CO levels may not correlate perfectly with symptom severity and delayed neurological effects can occur." }
        ]
      },
      {
        prompt: "The 6-year-old son has a CO level of 24% and the father has a level of 35% with altered mental status. Who should be prioritized for hyperbaric oxygen referral?",
        options: [
          { text: "Only the father because he has the highest CO level", isCorrect: false, feedback: "While the father's altered mental status is a clear indication, the 6-year-old should also be considered. Children are more vulnerable to CO effects, and a CO level of 24% in a child is significant." },
          { text: "Both the father (altered mental status) and the son (pediatric patient with significant CO level) should be referred for hyperbaric oxygen evaluation", isCorrect: true, feedback: "Correct. Indications for hyperbaric oxygen (HBO) consideration include: altered mental status, CO levels above 25%, loss of consciousness, cardiac symptoms, and pregnancy. Children are at higher risk for delayed neurological effects. Both the father and son meet referral criteria." },
          { text: "All four patients regardless of symptoms", isCorrect: false, feedback: "While all should be treated with high-flow oxygen, HBO referral is typically prioritized for patients meeting specific criteria (altered mental status, high CO levels, pregnancy, cardiac symptoms). The mother and daughter may not meet criteria." },
          { text: "None of them, as high-flow oxygen is sufficient treatment", isCorrect: false, feedback: "High-flow oxygen is the standard prehospital treatment, but patients meeting specific criteria benefit from hyperbaric oxygen therapy, which reduces the risk of delayed neurological sequelae." }
        ]
      }
    ],
    correctInterventions: [
      "Ensure all patients are removed from the CO-contaminated environment",
      "Apply high-flow 100% oxygen via non-rebreather mask to all patients",
      "Do not rely on standard pulse oximetry readings",
      "Use CO-oximetry if available to measure carboxyhemoglobin levels",
      "Establish IV access on the most symptomatic patient",
      "Continuous cardiac monitoring (CO can cause cardiac ischemia)",
      "Obtain 12-lead ECG on the father (risk of CO-related cardiac injury)",
      "Request additional units for multiple patients",
      "Transport to a facility with hyperbaric oxygen capability if indicated",
      "Monitor the pediatric patient closely due to increased vulnerability"
    ],
    commonErrors: [
      "Relying on standard pulse oximetry for CO-poisoned patients",
      "Not providing high-flow oxygen to all exposed patients",
      "Titrating oxygen to SpO2 instead of providing maximum FiO2",
      "Entering a CO-contaminated structure without breathing apparatus",
      "Failing to recognize that children are more vulnerable to CO effects",
      "Not obtaining a 12-lead ECG to screen for cardiac ischemia",
      "Failing to consider hyperbaric oxygen referral for qualifying patients"
    ],
    debrief: "Carbon monoxide poisoning is a frequently tested topic that challenges the paramedic's understanding of pulse oximetry limitations. The key teaching points include: (1) standard pulse oximetry is falsely normal in CO poisoning; (2) high-flow 100% oxygen is the treatment for all exposed patients; (3) children and patients with altered mental status are at highest risk; (4) hyperbaric oxygen referral should be considered for patients meeting criteria. The half-life of carboxyhemoglobin is approximately 5 hours on room air, 60-90 minutes on 100% oxygen via NRB, and 20-30 minutes on hyperbaric oxygen. Always consider CO poisoning when multiple patients in the same location present with similar symptoms, especially during cold weather when heating systems are in use.",
    learningObjectives: [
      "Explain why standard pulse oximetry is unreliable in CO poisoning",
      "Describe the prehospital treatment of carbon monoxide poisoning",
      "Identify indications for hyperbaric oxygen therapy referral",
      "Recognize the increased vulnerability of pediatric patients to CO",
      "Apply appropriate scene safety procedures for CO incidents"
    ],
    relatedLessonSlugs: ["scene-safety", "oxygen-delivery-devices", "vital-signs-interpretation"],
    status: "published"
  },
  {
    title: "Respiratory Distress: Acute Asthma Exacerbation",
    slug: "acute-asthma-exacerbation",
    contentDomain: "paramedic",
    professionTrack: "PCP",
    region: "BOTH",
    visibilityTier: "free",
    difficulty: 2,
    examRelevance: "high",
    category: "Respiratory",
    dispatchInfo: "Dispatched to a workplace for a 28-year-old female with difficulty breathing. The caller reports the patient is wheezing and cannot catch her breath. She has a history of asthma.",
    sceneDescription: "You arrive at an office building to find a 28-year-old female sitting upright in a chair, leaning forward in the tripod position. She is speaking in 1-2 word phrases between labored breaths. Coworkers report she began wheezing after exposure to a cleaning product used in the office approximately 20 minutes ago. She used her rescue inhaler twice without significant relief.",
    sceneSafety: "Ensure the area is ventilated and the offending cleaning product is removed. No ongoing chemical exposure threat. Scene is safe.",
    primaryAssessment: "General impression: A 28-year-old female in severe respiratory distress. Airway is patent but she is unable to speak in full sentences. Breathing is labored at 36 breaths per minute with diffuse expiratory wheezing, use of accessory muscles (sternocleidomastoid and intercostal retractions), and nasal flaring. Circulation shows a regular, rapid radial pulse at 124 bpm. Skin is pale and diaphoretic. The patient is alert, anxious, and sitting upright refusing to lie down.",
    secondaryAssessment: "Head: No cyanosis of lips. Neck: Accessory muscle use prominent, no JVD. Chest: Bilateral diffuse expiratory wheezing with prolonged expiratory phase, intercostal retractions. Poor air movement despite visible respiratory effort. Abdomen: Unremarkable. Extremities: No cyanosis, mild tremor in hands (likely from albuterol self-administration). Peak flow (if obtainable): Estimated at 30-40% of predicted, indicating severe obstruction.",
    vitalSigns: {
      hr: 124,
      bp: "138/84",
      rr: 36,
      spo2: 90,
      gcs: 15,
      etco2: 45
    },
    history: {
      signs: "Progressive difficulty breathing, wheezing, chest tightness, unable to speak in full sentences, used rescue inhaler twice without relief",
      allergies: "No drug allergies, allergen trigger: chemical fumes",
      medications: "Albuterol MDI (rescue inhaler), fluticasone/salmeterol (controller inhaler, reports inconsistent use)",
      pastHistory: "Asthma since childhood, one prior ICU admission for status asthmaticus at age 19, no intubation history",
      lastMeal: "Lunch about 2 hours ago",
      events: "A cleaning product with strong chemical fumes was used in her office area approximately 20 minutes ago. She developed wheezing within minutes. She used her albuterol MDI twice (2 puffs each time) without significant improvement. Coworkers called 911 when her breathing worsened."
    },
    decisionPoints: [
      {
        prompt: "The patient has severe bronchospasm unresponsive to her rescue inhaler. Her EtCO2 is 45 mmHg. What does this EtCO2 value indicate in the context of an acute asthma attack?",
        options: [
          { text: "It is normal and reassuring", isCorrect: false, feedback: "A normal EtCO2 in a severely tachypneic asthma patient is actually concerning. The patient should be hyperventilating (blowing off CO2), which would produce a LOW EtCO2. A normalizing or rising EtCO2 indicates fatigue and impending respiratory failure." },
          { text: "The patient is tiring and at risk for respiratory failure; the EtCO2 should be low given her respiratory rate", isCorrect: true, feedback: "Correct. In severe asthma, tachypnea normally produces a LOW EtCO2 (below 35). A normal (35-45) or rising EtCO2 in a tachypneic asthma patient means the patient is no longer effectively ventilating, the bronchospasm is so severe air movement is minimal, or respiratory muscle fatigue is occurring. This is a pre-arrest warning sign." },
          { text: "It indicates the patient is hyperventilating", isCorrect: false, feedback: "Hyperventilation would produce a LOW EtCO2, not a normal or elevated one. An EtCO2 of 45 with a respiratory rate of 36 means air trapping is preventing effective ventilation." },
          { text: "It is elevated and indicates a pulmonary embolism rather than asthma", isCorrect: false, feedback: "While elevated EtCO2 can be seen in some conditions, the clinical picture here clearly indicates an asthma exacerbation triggered by chemical exposure. The EtCO2 reflects air trapping and impending ventilatory failure." }
        ]
      },
      {
        prompt: "What is the most appropriate medication management for this patient?",
        options: [
          { text: "Continue with her own albuterol MDI, 2 puffs every 15 minutes", isCorrect: false, feedback: "The patient's MDI has already been ineffective. Nebulized albuterol provides more effective drug delivery in severe bronchospasm. Additionally, combination therapy with ipratropium is indicated for severe attacks." },
          { text: "Continuous nebulized albuterol with ipratropium bromide, and consider IM epinephrine if no improvement", isCorrect: true, feedback: "Correct. Continuous or back-to-back nebulized albuterol (2.5-5 mg) with ipratropium bromide (0.5 mg) is the standard treatment for severe asthma. If nebulized bronchodilators are ineffective, IM epinephrine (0.3-0.5 mg of 1:1,000) is indicated for severe, life-threatening bronchospasm. IV/IM corticosteroids (methylprednisolone) should also be considered." },
          { text: "Administer only oxygen and transport without bronchodilators", isCorrect: false, feedback: "This patient has life-threatening bronchospasm requiring aggressive pharmacological management. Oxygen alone will not address the underlying bronchospasm." },
          { text: "Intubate immediately to secure the airway", isCorrect: false, feedback: "Intubation should be a last resort in status asthmaticus as it is extremely high-risk. Aggressive medical management should be attempted first. Only intubate for actual respiratory arrest or complete failure to ventilate." }
        ]
      }
    ],
    correctInterventions: [
      "Remove from the triggering environment",
      "Position patient upright (allow to maintain tripod position)",
      "Continuous nebulized albuterol 2.5-5 mg",
      "Ipratropium bromide 0.5 mg via nebulizer (first 2-3 doses)",
      "Supplemental oxygen to maintain SpO2 above 94%",
      "Establish IV access",
      "Consider IM epinephrine for refractory severe bronchospasm",
      "Methylprednisolone 125 mg IV or equivalent corticosteroid",
      "Continuous EtCO2 and SpO2 monitoring",
      "Prepare for BVM-assisted ventilation if respiratory failure occurs",
      "Transport with continuous monitoring and treatment"
    ],
    commonErrors: [
      "Not recognizing a normalizing EtCO2 as a sign of impending respiratory failure",
      "Under-treating severe bronchospasm with insufficient bronchodilator doses",
      "Forcing the patient to lie supine (allow them to maintain position of comfort)",
      "Delaying epinephrine in life-threatening bronchospasm unresponsive to nebulizers",
      "Interpreting a quiet chest as improvement (may indicate critical air trapping)",
      "Premature intubation without exhausting pharmacological options"
    ],
    debrief: "Severe asthma exacerbation is a common and potentially life-threatening respiratory emergency. The key teaching points include understanding EtCO2 trends in asthma (a rising or normal EtCO2 in a tachypneic patient indicates impending failure), the importance of aggressive combination bronchodilator therapy, and the role of IM epinephrine as a rescue medication. A silent chest in a previously wheezing patient is ominous and indicates near-complete airway obstruction. Always monitor the trend of EtCO2 as your most reliable indicator of ventilatory adequacy in asthma.",
    learningObjectives: [
      "Interpret EtCO2 trends in the context of acute bronchospasm",
      "Administer appropriate bronchodilator therapy for severe asthma",
      "Recognize signs of impending respiratory failure in status asthmaticus",
      "Identify when IM epinephrine is indicated for refractory bronchospasm",
      "Differentiate between improving and deteriorating asthma based on clinical signs"
    ],
    relatedLessonSlugs: ["oxygen-delivery-devices", "vital-signs-interpretation", "airway-management-fundamentals"],
    status: "published"
  },
  {
    title: "Drowning with Hypothermia",
    slug: "drowning-with-hypothermia",
    contentDomain: "paramedic",
    professionTrack: "PCP",
    region: "BOTH",
    visibilityTier: "free",
    difficulty: 4,
    examRelevance: "medium",
    category: "Medical Emergencies",
    dispatchInfo: "Dispatched to a lake for a drowning. Bystanders have pulled a 35-year-old male from the water. He is not breathing. CPR has been started by a bystander.",
    sceneDescription: "You arrive at a lakeside beach in late autumn. Bystanders have pulled a 35-year-old male from the cold water (estimated water temperature 8°C / 46°F). He was submerged for an estimated 8-10 minutes. A bystander trained in CPR is performing chest compressions. The patient is not breathing and there is no palpable pulse. The patient is cold to the touch.",
    sceneSafety: "Water rescue has been completed by bystanders. No need for water entry. Ensure footing is safe on the wet ground. Scene is safe for patient care. Protect the patient and crew from environmental exposure.",
    primaryAssessment: "General impression: A 35-year-old male who is unresponsive, apneic, and pulseless. Airway contains water but no visible foreign body obstruction. No spontaneous respirations. No palpable carotid pulse after 10 seconds of assessment. Skin is cyanotic, cold, and wet. Pupils are dilated and fixed. ECG monitor shows a slow, irregular rhythm consistent with severe bradycardia or possible ventricular fibrillation with a low amplitude waveform.",
    secondaryAssessment: "Head: No signs of trauma. Neck: No cervical tenderness (mechanism does not suggest diving injury). Chest: No chest wall injury, bilateral crackles when ventilations are delivered. Abdomen: Distended (likely from swallowed water). Extremities: No injuries. Core temperature (tympanic or rectal): 28°C (82.4°F) — severe hypothermia. Cardiac rhythm on closer analysis: ventricular fibrillation.",
    vitalSigns: {
      hr: 0,
      bp: "0/0",
      rr: 0,
      spo2: 0,
      gcs: 3,
      temp: 28.0
    },
    history: {
      signs: "Found submerged in cold water, unresponsive, pulseless, apneic, severely hypothermic",
      allergies: "Unknown",
      medications: "Unknown",
      pastHistory: "Per a friend on scene: healthy, no significant medical history, good swimmer",
      lastMeal: "Had been at a barbecue, last ate about 1 hour before entering the water",
      events: "Patient was swimming in the lake when he reportedly got a cramp and went under. Bystanders noticed him submerged after approximately 5 minutes and pulled him to shore. CPR was initiated within 2 minutes of water extraction. Total submersion time estimated at 8-10 minutes. Water temperature approximately 8°C."
    },
    decisionPoints: [
      {
        prompt: "The monitor shows ventricular fibrillation. The patient's core temperature is 28°C. Should you defibrillate?",
        options: [
          { text: "No, hypothermic hearts do not respond to defibrillation", isCorrect: false, feedback: "Current guidelines recommend attempting defibrillation in hypothermic patients in VF. While the hypothermic myocardium may be less responsive, defibrillation should still be attempted." },
          { text: "Yes, deliver one shock. If unsuccessful, continue CPR and defer additional shocks until the core temperature is above 30°C", isCorrect: true, feedback: "Correct. AHA and ILCOR guidelines recommend delivering one shock for VF in severe hypothermia (<30°C). If the first shock is unsuccessful, continue CPR and active rewarming. Additional defibrillation attempts and medication administration may be deferred or given at extended intervals until core temperature rises above 30°C." },
          { text: "Yes, follow the standard ACLS protocol with shocks every 2 minutes", isCorrect: false, feedback: "Standard ACLS intervals may not be appropriate below 30°C. The hypothermic heart is resistant to electrical and pharmacological therapy. One shock attempt with continued CPR and rewarming is the initial approach." },
          { text: "Only defibrillate once the patient is rewarmed to 35°C", isCorrect: false, feedback: "Waiting until 35°C to defibrillate is too conservative. Guidelines recommend attempting defibrillation even in severe hypothermia, with the understanding that the myocardium may not respond until rewarming occurs." }
        ]
      },
      {
        prompt: "What rewarming strategies should you initiate in the field for this severely hypothermic patient?",
        options: [
          { text: "Passive rewarming only (remove wet clothing, wrap in blankets)", isCorrect: false, feedback: "Passive rewarming alone is insufficient for severe hypothermia (below 30°C) in a cardiac arrest patient. Active external rewarming should be initiated." },
          { text: "Remove wet clothing, apply warm blankets, administer warmed IV fluids (if available), and apply heat packs to the axillae, groin, and neck", isCorrect: true, feedback: "Correct. Active external rewarming includes removing all wet clothing, insulating with warm blankets, applying chemical heat packs to areas of high blood flow (axillae, groin, neck, thorax), and administering warmed IV normal saline (40-42°C) if available. Continue high-quality CPR throughout." },
          { text: "Immerse the patient in warm water at the scene", isCorrect: false, feedback: "Warm water immersion is not practical in the prehospital setting and makes CPR impossible. This is a hospital-based intervention." },
          { text: "Do not attempt rewarming in the field; focus only on CPR", isCorrect: false, feedback: "Rewarming should begin in the field. The principle is 'no one is dead until they are warm and dead.' Active rewarming concurrent with CPR improves the chance of successful resuscitation." }
        ]
      }
    ],
    correctInterventions: [
      "Confirm pulselessness with a 10-second pulse check (pulses may be difficult to detect in hypothermia)",
      "Continue high-quality CPR with 30:2 ratio",
      "Provide BVM ventilations with 100% oxygen",
      "Apply cardiac monitor and identify rhythm",
      "Attempt one defibrillation for VF",
      "Remove all wet clothing",
      "Apply warm blankets and heat packs to core areas",
      "Administer warmed IV normal saline if available",
      "Establish advanced airway (consider supraglottic or endotracheal)",
      "Transport to a facility with internal rewarming capability",
      "Continue CPR throughout transport — do not terminate in hypothermia"
    ],
    commonErrors: [
      "Pronouncing the patient dead in the field without rewarming",
      "Performing rough handling that can trigger VF in a hypothermic heart",
      "Repeated defibrillation attempts below 30°C without rewarming",
      "Standard-dose epinephrine at standard intervals in severe hypothermia",
      "Failing to remove wet clothing before insulating",
      "Not checking for a pulse long enough (hypothermic patients may have very slow, weak pulses)",
      "Terminating resuscitation before rewarming"
    ],
    debrief: "Drowning with hypothermia is a unique resuscitation scenario governed by the principle: 'No one is dead until they are warm and dead.' Cold water submersion activates the mammalian diving reflex and cold-mediated neuroprotection, meaning patients have survived prolonged submersion in cold water with good neurological outcomes. Key points include: (1) attempt one defibrillation in VF but defer repeated attempts until temperature rises above 30°C; (2) ACLS medications may be withheld or given at extended intervals below 30°C; (3) begin active external rewarming immediately; (4) never terminate resuscitation in the hypothermic patient in the field. Transport to a facility capable of extracorporeal rewarming (ECMO, cardiopulmonary bypass) is ideal for severe hypothermic cardiac arrest.",
    learningObjectives: [
      "Apply modified ACLS protocols for hypothermic cardiac arrest",
      "Initiate appropriate prehospital active rewarming measures",
      "Understand the concept of cold-mediated neuroprotection in drowning",
      "Recognize that defibrillation may be ineffective below 30°C",
      "Describe the principle that hypothermic patients should not be declared dead in the field"
    ],
    relatedLessonSlugs: ["cardiac-arrest-recognition", "airway-management-fundamentals", "scene-safety"],
    status: "published"
  },
  {
    title: "Excited Delirium with Agitated Patient",
    slug: "excited-delirium-agitated-patient",
    contentDomain: "paramedic",
    professionTrack: "ACP",
    region: "BOTH",
    visibilityTier: "free",
    difficulty: 4,
    examRelevance: "medium",
    category: "Medical Emergencies",
    dispatchInfo: "Dispatched with law enforcement to a convenience store for a combative person. The caller reports a male who is acting erratically, has removed his clothing, and is destroying property. The person appears to be extremely agitated and is sweating profusely.",
    sceneDescription: "You arrive to find law enforcement on scene attempting to contain a 32-year-old male who is naked, diaphoretic, and extremely agitated. He is screaming incoherently, throwing merchandise, and appears to have superhuman strength (per law enforcement). He does not respond to verbal commands. The store has been evacuated. Law enforcement requests EMS assistance for chemical sedation.",
    sceneSafety: "Do NOT approach the patient until law enforcement has established a safe perimeter. This patient is at extremely high risk for sudden cardiac arrest. Prepare medications and equipment from a safe distance. Only approach when law enforcement indicates it is safe. Be prepared for rapid clinical deterioration.",
    primaryAssessment: "General impression (assessed from a safe distance initially): A 32-year-old male with extreme psychomotor agitation, diaphoresis, and apparent hyperthermia. After law enforcement restraint, the patient is prone on the ground. Airway is patent with continuous screaming and grunting. Breathing is rapid and labored at 38 breaths per minute. Circulation shows a rapid, bounding pulse at 168 bpm. Skin is extremely hot, flushed, and drenched in sweat. The patient is agitated, combative, and not oriented. GCS is difficult to assess due to agitation.",
    secondaryAssessment: "Head: Pupils dilated bilaterally. No signs of head trauma. Mouth: Dry despite diaphoresis (suggesting stimulant use). Neck: No JVD. Chest: Tachypneic but clear bilaterally. Abdomen: Unable to assess due to agitation. Extremities: Remarkable muscle rigidity. Temperature (tympanic): 40.6°C (105.1°F) — severe hyperthermia. Blood glucose: 58 mg/dL. No obvious injuries from the altercation. No track marks visible.",
    vitalSigns: {
      hr: 168,
      bp: "198/112",
      rr: 38,
      spo2: 94,
      gcs: 8,
      temp: 40.6,
      glucose: 58
    },
    history: {
      signs: "Extreme agitation, nudity, diaphoresis, hyperthermia, apparent superhuman strength, insensitivity to pain, incoherent screaming",
      allergies: "Unknown",
      medications: "Unknown",
      pastHistory: "Unknown. Store employees report he is not a regular customer and appeared to be under the influence of something.",
      lastMeal: "Unknown",
      events: "The patient entered the store approximately 20 minutes ago acting erratically. He began removing his clothing, sweating profusely, and throwing items. He became combative when store employees tried to intervene. No known ingestion witnessed."
    },
    decisionPoints: [
      {
        prompt: "Law enforcement has physically restrained the patient and is requesting sedation. What is the appropriate pharmacological intervention?",
        options: [
          { text: "Administer haloperidol 10 mg IM for psychotic agitation", isCorrect: false, feedback: "First-generation antipsychotics like haloperidol can lower the seizure threshold and worsen hyperthermia. In suspected excited delirium with hyperthermia, benzodiazepines are preferred for initial sedation." },
          { text: "Administer ketamine 4 mg/kg IM for rapid sedation", isCorrect: true, feedback: "Correct. Ketamine at 4-5 mg/kg IM provides rapid, reliable dissociative sedation. It has a rapid onset (3-5 minutes IM), maintains respiratory drive better than benzodiazepines alone, and provides effective sedation for extremely agitated patients. Midazolam 5-10 mg IM is an acceptable alternative if ketamine is not available." },
          { text: "Administer oral diazepam 10 mg", isCorrect: false, feedback: "An oral medication is not feasible in a combative, uncooperative patient. The IM or IN route must be used for rapid onset in this clinical scenario." },
          { text: "Apply physical restraints only without chemical sedation", isCorrect: false, feedback: "Physical restraints alone increase metabolic demand, worsen hyperthermia, and elevate the risk of sudden cardiac arrest in excited delirium. Chemical sedation is essential to reduce the hypermetabolic state." }
        ]
      },
      {
        prompt: "After sedation, the patient becomes calm but remains hyperthermic at 40.6°C with a glucose of 58 mg/dL. What are your priorities?",
        options: [
          { text: "Transport only, no further interventions needed since the patient is calm", isCorrect: false, feedback: "Excited delirium patients are at extremely high risk for sudden cardiac arrest even after sedation. Hyperthermia and hypoglycemia both require active treatment." },
          { text: "Initiate active cooling measures, administer IV dextrose for hypoglycemia, establish continuous cardiac monitoring, and transport emergently", isCorrect: true, feedback: "Correct. This patient has multiple life threats: severe hyperthermia (risk of multi-organ failure), hypoglycemia (altered mental status), and risk of cardiac arrest. Begin active cooling (remove clothing, apply cold packs to groin/axillae/neck, cold IV fluids if available), treat hypoglycemia with D10W or D50W IV, monitor cardiac rhythm continuously, and transport emergently." },
          { text: "Focus only on cooling and defer glucose treatment", isCorrect: false, feedback: "Both hyperthermia and hypoglycemia require simultaneous treatment. Hypoglycemia can cause seizures and cardiac arrest independently and must be corrected." },
          { text: "Administer more sedation to ensure the patient stays calm", isCorrect: false, feedback: "Additional sedation without addressing the underlying metabolic emergencies (hyperthermia, hypoglycemia) increases the risk of respiratory depression and cardiac arrest." }
        ]
      }
    ],
    correctInterventions: [
      "Ensure scene safety before approaching the patient",
      "Administer ketamine 4-5 mg/kg IM for chemical sedation",
      "Continuously monitor cardiac rhythm (high risk of sudden arrest)",
      "Begin active cooling: remove clothing, apply cold packs, cool IV fluids",
      "Establish IV access",
      "Administer D10W or D50W IV for hypoglycemia (glucose 58 mg/dL)",
      "Monitor respiratory status closely after sedation",
      "Avoid prone positioning once patient is sedated (positional asphyxia risk)",
      "Turn patient to lateral or supine position as soon as safe",
      "Transport emergently with continuous monitoring",
      "Pre-notify receiving facility of excited delirium with hyperthermia"
    ],
    commonErrors: [
      "Approaching the patient before the scene is secured",
      "Using physical restraints alone without chemical sedation",
      "Maintaining prone restraint after sedation (positional asphyxia)",
      "Failing to recognize and treat hyperthermia aggressively",
      "Not checking or treating blood glucose",
      "Not anticipating sudden cardiac arrest after sedation",
      "Under-dosing sedation medication resulting in incomplete sedation"
    ],
    debrief: "Excited delirium syndrome is a medical emergency with a significant mortality rate. It is characterized by extreme agitation, hyperthermia, diaphoresis, unusual strength, and insensitivity to pain. The exact pathophysiology involves catecholamine surge (often from stimulant drugs) leading to a hypermetabolic state that can result in sudden cardiac arrest. The priorities are: (1) scene safety coordination with law enforcement; (2) rapid chemical sedation to reduce metabolic demand; (3) aggressive cooling for hyperthermia; (4) correction of metabolic derangements (hypoglycemia); (5) continuous cardiac monitoring; (6) avoid prone positioning after restraint. The highest risk period for cardiac arrest is during or immediately after physical restraint, making rapid chemical sedation critical.",
    learningObjectives: [
      "Recognize the clinical features of excited delirium syndrome",
      "Coordinate safely with law enforcement for patient management",
      "Select appropriate chemical sedation agents and dosing",
      "Initiate prehospital cooling for severe hyperthermia",
      "Identify the risk of sudden cardiac arrest in excited delirium"
    ],
    relatedLessonSlugs: ["scene-safety", "vital-signs-interpretation", "glasgow-coma-scale"],
    status: "published"
  },
  {
    title: "Geriatric Fall with Hip Fracture and Anticoagulation",
    slug: "geriatric-fall-hip-fracture-anticoagulant",
    contentDomain: "paramedic",
    professionTrack: "PCP",
    region: "BOTH",
    visibilityTier: "free",
    difficulty: 2,
    examRelevance: "medium",
    category: "Trauma",
    dispatchInfo: "Dispatched to a residential care facility for an 82-year-old female who has fallen. Staff reports the patient fell in the hallway and is unable to stand. She is alert and complaining of hip pain.",
    sceneDescription: "You arrive at a long-term care facility. An 82-year-old female is lying on the hallway floor where she fell approximately 15 minutes ago. She is alert and oriented but in pain. The nursing staff reports she tripped over her walker and fell onto her left side. She has been unable to get up. Her left leg appears shortened and externally rotated.",
    sceneSafety: "Indoor facility. No hazards. Scene is safe.",
    primaryAssessment: "General impression: An elderly female lying on the floor, alert and in moderate pain. Airway is patent with clear speech. Breathing is normal at 18 breaths per minute, clear bilaterally. Circulation shows a regular radial pulse at 84 bpm. Skin is warm, dry, and slightly pale. The patient is alert and oriented to person, place, time, and event. She rates her pain as 7/10 in her left hip.",
    secondaryAssessment: "Head: No visible injury or signs of head strike (patient denies hitting her head). Neck: No cervical tenderness. Chest: Clear, no tenderness. Abdomen: Soft, non-tender. Pelvis: Tenderness over the left hip with any attempted movement. Left lower extremity: Shortened and externally rotated (classic hip fracture presentation), distal pulses present, sensation intact. Right lower extremity: Normal. Back: Unable to fully assess while on the floor. Skin: Multiple ecchymoses on forearms (consistent with anticoagulant use).",
    vitalSigns: {
      hr: 84,
      bp: "148/88",
      rr: 18,
      spo2: 96,
      gcs: 15,
      temp: 36.6
    },
    history: {
      signs: "Left hip pain rated 7/10, unable to bear weight, no headache, no dizziness, no loss of consciousness, no chest pain",
      allergies: "Codeine (causes nausea)",
      medications: "Rivaroxaban 20 mg daily, amlodipine 5 mg daily, metoprolol 25 mg BID, calcium with vitamin D, levothyroxine 75 mcg daily, acetaminophen PRN",
      pastHistory: "Atrial fibrillation (on rivaroxaban), hypertension, hypothyroidism, osteoporosis, previous right knee replacement 5 years ago",
      lastMeal: "Breakfast approximately 2 hours ago",
      events: "Patient was walking to the dining room using her walker when she tripped over the front wheel of the walker and fell to her left side. She landed directly on her left hip. She denies any dizziness, syncope, or other symptoms before the fall. No head strike reported. She has been unable to stand since the fall."
    },
    decisionPoints: [
      {
        prompt: "The patient takes rivaroxaban (a direct oral anticoagulant). How does this affect your assessment and management?",
        options: [
          { text: "It has no impact on care for a hip fracture", isCorrect: false, feedback: "Anticoagulant use significantly affects the management of trauma patients. These patients are at higher risk for internal bleeding, even from seemingly minor mechanisms." },
          { text: "It increases bleeding risk; monitor closely for signs of occult hemorrhage and ensure the receiving facility is aware of the anticoagulant use", isCorrect: true, feedback: "Correct. Rivaroxaban (and other DOACs) increase bleeding risk significantly. A hip fracture can cause substantial blood loss into the thigh, and anticoagulated patients may hemorrhage more than expected. Relay the anticoagulant use to the receiving facility, as they may need to consider reversal agents. Also assess for any signs of intracranial hemorrhage if there is any possibility of a head strike." },
          { text: "You should administer vitamin K to reverse the anticoagulant in the field", isCorrect: false, feedback: "Vitamin K reverses warfarin, not rivaroxaban. Rivaroxaban is reversed with andexanet alfa or prothrombin complex concentrate (PCC), which are hospital-based interventions." },
          { text: "Hold the patient's next dose of rivaroxaban", isCorrect: false, feedback: "Medication management decisions are for the physician, not the paramedic. Your role is to document what the patient takes and relay this to the receiving team." }
        ]
      },
      {
        prompt: "The patient rates her pain at 7/10. She is allergic to codeine. How do you manage her pain?",
        options: [
          { text: "Administer morphine 4 mg IV slowly", isCorrect: false, feedback: "While morphine is commonly used for pain management, codeine allergy requires caution. Codeine and morphine are both natural opiates, and cross-reactivity is possible. A synthetic opioid like fentanyl is safer in patients with codeine allergy." },
          { text: "Administer fentanyl 25-50 mcg IV, titrated to effect, as it is a synthetic opioid with low cross-reactivity to codeine", isCorrect: true, feedback: "Correct. Fentanyl is a synthetic opioid that has a different chemical structure from natural opiates (codeine, morphine). It has minimal cross-reactivity with codeine allergy and is safe to use. Start with 25 mcg IV in elderly patients and titrate carefully. Additionally, splinting the injury provides significant pain relief." },
          { text: "Provide acetaminophen only and defer stronger pain medication to the hospital", isCorrect: false, feedback: "A pain rating of 7/10 from a hip fracture warrants stronger analgesia. Withholding appropriate pain management from elderly patients with fractures is not best practice and increases cardiovascular stress." },
          { text: "Apply cold packs only, no medications", isCorrect: false, feedback: "Cold packs may provide mild comfort but are insufficient for a hip fracture. Appropriate pharmacological and non-pharmacological pain management should be provided." }
        ]
      }
    ],
    correctInterventions: [
      "Perform a thorough head-to-toe assessment before moving the patient",
      "Rule out syncope or medical cause for the fall",
      "Splint the affected hip/leg in the position found",
      "Provide appropriate pain management (fentanyl for codeine-allergic patient)",
      "Move the patient carefully using a scoop stretcher or log-roll technique",
      "Apply padding to bony prominences for elderly skin protection",
      "Monitor vital signs for signs of occult hemorrhage",
      "Document all medications, especially anticoagulants",
      "Communicate anticoagulant use to the receiving facility",
      "Transport gently with continuous monitoring",
      "Keep the patient warm (elderly are prone to hypothermia)"
    ],
    commonErrors: [
      "Administering morphine to a patient with codeine allergy without recognizing cross-reactivity risk",
      "Failing to consider internal hemorrhage in an anticoagulated patient with a hip fracture",
      "Moving the patient without adequate splinting or pain management",
      "Not investigating the cause of the fall (syncope, orthostatic hypotension, medication effect)",
      "Under-treating pain in elderly patients",
      "Rough handling during transfer (risk of worsening fracture or causing skin tears)",
      "Not relaying the anticoagulant use to the receiving facility"
    ],
    debrief: "Geriatric falls with hip fractures are among the most common EMS calls. This scenario highlights several important considerations: (1) anticoagulant medications significantly increase bleeding risk and must be communicated to the receiving facility; (2) pain management in elderly patients requires careful titration with appropriate drug selection (fentanyl is safer than morphine in codeine-allergic patients); (3) always investigate the cause of the fall (was it mechanical, or did a medical event cause the fall?); (4) gentle patient handling is essential to prevent further injury. Hip fractures in elderly patients carry a significant mortality rate (approximately 20-30% at one year), making appropriate prehospital care an important factor in outcomes.",
    learningObjectives: [
      "Recognize classic hip fracture presentation in geriatric patients",
      "Identify the impact of anticoagulant medications on trauma management",
      "Select appropriate analgesics in patients with opioid cross-reactivity concerns",
      "Investigate medical causes of falls in elderly patients",
      "Demonstrate gentle handling and splinting techniques for hip fractures"
    ],
    relatedLessonSlugs: ["vital-signs-interpretation", "paramedic-pharmacology-basics", "scene-safety"],
    status: "published"
  }
];
