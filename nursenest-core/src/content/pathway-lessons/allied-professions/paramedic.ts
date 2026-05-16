const paramedicSections = {
  "ems_scene_size_up_and_safety": [
      { id: "clinical-meaning", heading: "Clinical Meaning", kind: "clinical_meaning", body: "Scene size-up is the first clinical intervention because it determines whether care can happen safely. The EMS learner must scan mechanism, hazards, patient count, access, egress, bystanders, weapons, fire, traffic, weather, and need for additional resources before focusing on the patient. A perfect airway plan does not matter if the crew enters an unsafe scene or misses a mass-casualty pattern." },
      { id: "core-concept", heading: "Core Concept", kind: "core_concept", body: "The first EMS decision is not diagnosis; it is whether the scene is safe enough to enter and what resources are needed. Start with body substance isolation, dispatch information, scene hazards, mechanism or nature of illness, number of patients, and need for additional units. Dynamic scenes require repeated reassessment: traffic changes, family members escalate, smoke spreads, or a initially stable patient deteriorates. Good paramedic judgment keeps crew safety, patient access, and transport strategy connected from the first minute." },
      { id: "clinical-scenario", heading: "Clinical Scenario", kind: "clinical_scenario", body: "You arrive for a fall in a parking lot and find a patient on the ground beside an idling car at night. The patient is moaning, but traffic is still moving around the scene. The correct priority is not immediately palpating a pulse while standing in traffic. The crew should position the ambulance for protection if protocol allows, request police or fire for traffic control, apply PPE, identify patient count, and move only when safe." },
      { id: "exam-relevance", heading: "Exam Relevance", kind: "exam_relevance", body: "Paramedic exam questions often hide the answer in scene details. A toxic exposure, violent scene, unstable vehicle, downed wire, or multiple-patient incident changes the first action. Do not choose an invasive intervention before securing the scene and calling appropriate resources when the scenario makes entry unsafe." },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: "Scene size-up is a clinical priority, not a formality. Protect the crew, identify hazards, count patients, request resources early, and keep reassessing safety while care continues." }
  ],
  "ems_primary_survey_abcde": [
      { id: "clinical-meaning", heading: "Clinical Meaning", kind: "clinical_meaning", body: "The primary survey is the EMS method for finding and treating immediate life threats before they become irreversible. It is not a long checklist. It is a rapid cycle: general impression, mental status, airway, breathing, circulation, disability, exposure, and transport priority. Interventions happen as threats are found." },
      { id: "core-concept", heading: "Core Concept", kind: "core_concept", body: "ABCDE keeps paramedic thinking organized under noise and time pressure. Airway asks whether the patient can maintain and protect a patent airway. Breathing asks whether ventilation and oxygenation are adequate. Circulation asks about pulse, skin, hemorrhage, perfusion, and shock. Disability screens neurologic status, glucose risk, seizure activity, and stroke clues. Exposure finds hidden trauma, bleeding, rashes, medical devices, and environmental risks while preventing hypothermia." },
      { id: "clinical-scenario", heading: "Clinical Scenario", kind: "clinical_scenario", body: "A confused trauma patient has snoring respirations, shallow breathing, pale skin, and blood pooling under a jacket. The primary survey should not jump to a full history. The airway needs positioning or adjunct consideration, breathing needs support, hemorrhage needs immediate control, and the patient is high priority for rapid transport." },
      { id: "exam-relevance", heading: "Exam Relevance", kind: "exam_relevance", body: "Exam traps include performing a detailed assessment before life threats, collecting history while the airway is obstructed, or choosing a secondary survey when shock is obvious. If the stem includes altered mental status, poor breathing, uncontrolled bleeding, or absent radial pulses, the primary survey drives the answer." },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: "ABCDE is a treatment sequence for immediate threats. Fix life threats as you find them and decide transport priority early." }
  ],
  "ems_airway_ventilation_and_oxygenation": [
      { id: "clinical-meaning", heading: "Clinical Meaning", kind: "clinical_meaning", body: "Prehospital airway management is about matching support to the patient’s actual failure: obstruction, oxygenation failure, ventilation failure, aspiration risk, fatigue, or loss of protective reflexes. The best airway plan is not always the most invasive one; it is the safest option that improves oxygen delivery and carbon dioxide clearance within scope and protocol." },
      { id: "core-concept", heading: "Core Concept", kind: "core_concept", body: "Airway patency means air can move through the upper airway. Ventilation means air is moving enough to clear carbon dioxide. Oxygenation means oxygen is reaching blood and tissues. A patient can have a patent airway but poor ventilation, such as opioid toxicity or fatigue. A patient can ventilate but oxygenate poorly from pulmonary edema, pneumonia, trauma, or shunt physiology. EMS care connects position, suction, adjuncts, bag-mask ventilation, oxygen delivery, capnography, and advanced airways to the specific problem." },
      { id: "clinical-scenario", heading: "Clinical Scenario", kind: "clinical_scenario", body: "An overdose patient is cyanotic, breathing four times per minute, and has pinpoint pupils. A non-rebreather alone will not correct the main problem because the patient is not ventilating. The paramedic should support ventilation with BVM, consider naloxone per protocol, monitor ETCO2 if available, and prepare for escalation if airway reflexes are inadequate." },
      { id: "exam-relevance", heading: "Exam Relevance", kind: "exam_relevance", body: "Common test traps include treating every low SpO2 with oxygen only, ventilating too fast, ignoring chest rise, or choosing an advanced airway before basic maneuvers. Capnography questions usually test ventilation, tube confirmation, perfusion trends, or return of spontaneous circulation clues." },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: "Separate airway, ventilation, and oxygenation. Use basic maneuvers well, ventilate at appropriate rates, reassess chest rise and ETCO2, and escalate only when the problem requires it." }
  ],
  "ems_shock_and_perfusion": [
      { id: "clinical-meaning", heading: "Clinical Meaning", kind: "clinical_meaning", body: "Shock is inadequate tissue perfusion. Blood pressure can be normal early, so paramedics must recognize compensated shock through mental status, skin signs, pulse quality, respiratory pattern, capillary refill, mechanism, and trend. Field care is about identifying the shock pattern, correcting reversible threats, and transporting before compensation fails." },
      { id: "core-concept", heading: "Core Concept", kind: "core_concept", body: "Hypovolemic shock is loss of circulating volume, commonly hemorrhage or dehydration. Distributive shock involves loss of vascular tone, as in sepsis, anaphylaxis, or neurogenic shock. Cardiogenic shock is pump failure. Obstructive shock blocks filling or output, such as tension pneumothorax or tamponade. EMS does not need a perfect diagnosis before acting, but the suspected mechanism changes priorities: hemorrhage control, oxygen/ventilation, epinephrine for anaphylaxis per protocol, cautious fluids, vasopressor pathway, or rapid transport." },
      { id: "clinical-scenario", heading: "Clinical Scenario", kind: "clinical_scenario", body: "A pale trauma patient is anxious, tachycardic, and has a radial pulse that becomes weak when sitting up. Blood pressure is still 110 systolic. This is not reassuring. The patient may be compensating for hemorrhagic shock. Control bleeding, keep warm, minimize scene time, establish transport priority, and reassess perfusion frequently." },
      { id: "exam-relevance", heading: "Exam Relevance", kind: "exam_relevance", body: "Exam questions often use a normal blood pressure to distract from early shock. Do not wait for hypotension. Shock is about perfusion, not one number. Also avoid giving large fluid volumes reflexively when cardiogenic or obstructive physiology is suggested." },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: "Recognize shock early by trend and perfusion. Treat the cause you can treat in the field, prevent hypothermia, and transport with escalation." }
  ],
  "ems_cardiac_chest_pain_and_stemi": [
      { id: "clinical-meaning", heading: "Clinical Meaning", kind: "clinical_meaning", body: "Paramedic cardiac assessment links symptoms, risk, ECG acquisition, hemodynamics, contraindications, and destination decisions. The job is not just to name chest pain. It is to detect time-sensitive acute coronary syndrome, recognize instability, apply protocol-based medications safely, and communicate early so the receiving system can activate resources." },
      { id: "core-concept", heading: "Core Concept", kind: "core_concept", body: "ACS can present with pressure, dyspnea, diaphoresis, nausea, syncope, weakness, or atypical symptoms in older adults, women, and diabetic patients. A 12-lead should be acquired early when symptoms suggest ischemia. STEMI recognition depends on ST elevation in contiguous leads with reciprocal changes, clinical context, and artifact control. Right-sided or posterior leads may be needed in certain patterns depending on protocol." },
      { id: "clinical-scenario", heading: "Clinical Scenario", kind: "clinical_scenario", body: "A diabetic patient reports sudden nausea, weakness, and mild chest pressure. Skin is cool and diaphoretic. The ECG shows inferior ST elevation with reciprocal depression. The paramedic should treat this as a high-risk ACS/STEMI pattern, follow aspirin/nitroglycerin contraindication checks, monitor for bradycardia or hypotension, notify the receiving facility, and transport to an appropriate destination." },
      { id: "exam-relevance", heading: "Exam Relevance", kind: "exam_relevance", body: "Exam traps include delaying 12-lead acquisition because symptoms are atypical, giving nitroglycerin without checking blood pressure or phosphodiesterase inhibitor use, and missing inferior STEMI hypotension risk. Always interpret ECG findings with patient condition and protocol." },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: "Chest pain care is system care: early ECG, safe medications, serial reassessment, early notification, and destination decisions." }
  ],
  "ems_arrhythmias_and_ecg_integration": [
      { id: "clinical-meaning", heading: "Clinical Meaning", kind: "clinical_meaning", body: "EMS rhythm interpretation must connect the monitor strip to the patient. A rhythm is clinically meaningful when it explains perfusion, mental status, chest pain, dyspnea, syncope, or arrest risk. The field decision is not only what the rhythm is, but whether the patient is stable, unstable, or pulseless." },
      { id: "core-concept", heading: "Core Concept", kind: "core_concept", body: "Start rhythm interpretation with rate, regularity, P waves, PR relationship, QRS width, and clinical condition. Narrow-complex tachycardias, wide-complex tachycardias, bradyarrhythmias, atrial fibrillation, ventricular fibrillation, and pulseless electrical activity require different pathways. A wide regular tachycardia in an unstable patient is treated as dangerous until proven otherwise. ECG acquisition for STEMI is separate from rhythm monitoring but both must be integrated." },
      { id: "clinical-scenario", heading: "Clinical Scenario", kind: "clinical_scenario", body: "A patient is pale, confused, hypotensive, and has a regular wide-complex tachycardia at 180. The priority is not memorizing every possible differential. The patient is unstable with a dangerous tachyarrhythmia. Follow synchronized cardioversion pathway per protocol while preparing airway support and monitoring perfusion." },
      { id: "exam-relevance", heading: "Exam Relevance", kind: "exam_relevance", body: "Exam traps include treating the monitor instead of the patient, calling PEA because a waveform is present without checking a pulse, and managing unstable tachycardia with a slow medication-first approach when electrical therapy is indicated by protocol." },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: "Read the rhythm, then read the patient. Stability determines urgency and treatment pathway." }
  ],
  "ems_stroke_and_neurologic_emergencies": [
      { id: "clinical-meaning", heading: "Clinical Meaning", kind: "clinical_meaning", body: "Prehospital neuro care is time, glucose, airway, and destination logic. Paramedics must distinguish stroke-like symptoms from mimics enough to protect the patient, document last-known-well, screen severity, and notify the correct receiving pathway without delaying transport." },
      { id: "core-concept", heading: "Core Concept", kind: "core_concept", body: "Stroke assessment starts with onset or last-known-well, neurologic screen, glucose check, airway/breathing/circulation, seizure history, anticoagulants, baseline deficits, and symptom progression. Large-vessel occlusion clues may influence destination according to local protocol. Hypoglycemia, seizure/postictal state, intoxication, migraine, infection, and trauma can mimic stroke, but suspected stroke still needs rapid system activation." },
      { id: "clinical-scenario", heading: "Clinical Scenario", kind: "clinical_scenario", body: "A patient has sudden right arm weakness, facial droop, slurred speech, and glucose of 6.2 mmol/L. Last-known-well was 45 minutes ago. The priority is stroke alert logic: protect airway if needed, document exact times and deficits, avoid unnecessary scene delay, notify the receiving facility, and transport according to stroke destination protocol." },
      { id: "exam-relevance", heading: "Exam Relevance", kind: "exam_relevance", body: "Exam traps include skipping glucose, documenting discovery time instead of last-known-well, delaying transport for repeated neuro exams, or assuming altered mental status is intoxication without screening for stroke and hypoglycemia." },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: "Stroke care depends on accurate time, glucose, deficit documentation, and early notification." }
  ],
  "ems_trauma_hemorrhage_and_spinal_motion": [
      { id: "clinical-meaning", heading: "Clinical Meaning", kind: "clinical_meaning", body: "Trauma care prioritizes threats that kill first: massive hemorrhage, airway failure, ventilation failure, shock, and preventable hypothermia. Spinal motion restriction is not a reflex for every trauma patient; it is a risk-based decision aligned with protocol, mechanism, exam, and neurologic findings." },
      { id: "core-concept", heading: "Core Concept", kind: "core_concept", body: "Major trauma assessment uses mechanism, primary survey, hemorrhage control, chest assessment, pelvic/femur concerns, neurologic status, and transport destination. Tourniquets, wound packing, pressure dressings, pelvic binders, and rapid transport can matter more than prolonged scene procedures. Hypothermia worsens coagulopathy, so exposure must be balanced with warming. Spinal precautions focus on minimizing harmful movement rather than automatically immobilizing every patient on a hard board." },
      { id: "clinical-scenario", heading: "Clinical Scenario", kind: "clinical_scenario", body: "A motorcyclist has partial amputation bleeding from the lower leg and is pale, restless, and tachycardic. The lifesaving priority is immediate hemorrhage control with a tourniquet per protocol, followed by shock management, rapid trauma transport, and reassessment. A detailed secondary exam should not delay hemorrhage control." },
      { id: "exam-relevance", heading: "Exam Relevance", kind: "exam_relevance", body: "Exam traps include delaying tourniquet use for life-threatening extremity bleeding, prioritizing spinal packaging over massive hemorrhage, or choosing a nearby low-acuity facility for a patient who meets trauma-center criteria." },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: "Stop massive bleeding, support airway/breathing/circulation, prevent hypothermia, and choose the right destination." }
  ],
  "ems_pediatric_assessment_and_dosing": [
      { id: "clinical-meaning", heading: "Clinical Meaning", kind: "clinical_meaning", body: "Pediatric EMS care is high risk because deterioration can be fast and medication errors are common. Production-ready paramedic learning must teach appearance, work of breathing, circulation to skin, weight estimation, caregiver history, developmental context, and dose-safety checks." },
      { id: "core-concept", heading: "Core Concept", kind: "core_concept", body: "The pediatric assessment triangle gives a fast impression: appearance, work of breathing, and circulation to skin. Children compensate with tachycardia and respiratory effort before sudden decompensation. Dosing must be weight-based and checked against a length-based tape, app, local chart, or protocol. Family presence can provide critical baseline and history while the crew keeps roles clear." },
      { id: "clinical-scenario", heading: "Clinical Scenario", kind: "clinical_scenario", body: "A wheezing child is sitting upright, nasal flaring, and speaking one-word answers. SpO2 is falling despite oxygen. The priority is respiratory distress management: position of comfort, bronchodilator pathway per protocol, ventilation readiness, dose verification, and early transport/escalation if fatigue appears." },
      { id: "exam-relevance", heading: "Exam Relevance", kind: "exam_relevance", body: "Exam traps include using adult doses, underestimating shock because blood pressure is normal, or dismissing a quiet child as improved when they may be tiring. Pediatric quietness with poor work of breathing can be ominous." },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: "Use pediatric-specific assessment and dosing. Children compensate, then crash." }
  ],
  "ems_ob_and_neonatal_emergencies": [
      { id: "clinical-meaning", heading: "Clinical Meaning", kind: "clinical_meaning", body: "OB and neonatal EMS care requires calm sequencing: maternal assessment, gestational age, bleeding, pain, urge to push, fetal/maternal risk clues, delivery preparation, postpartum hemorrhage recognition, and neonatal warming/resuscitation priorities." },
      { id: "core-concept", heading: "Core Concept", kind: "core_concept", body: "The mother is the first patient, but once delivery occurs the crew has two patients. Key questions include due date, contractions, rupture of membranes, bleeding, urge to push, multiple gestation, complications, and prenatal care. Delivery care emphasizes controlled delivery, cord management per protocol, newborn warming/drying/stimulation, airway positioning, ventilation if needed, APGAR documentation, and maternal bleeding/uterine tone monitoring." },
      { id: "clinical-scenario", heading: "Clinical Scenario", kind: "clinical_scenario", body: "A term patient has contractions every two minutes and feels an urge to push. Crowning is visible. Transporting immediately without preparing for delivery may be unsafe. The crew should prepare for imminent delivery, call for support if needed, protect privacy and warmth, manage the newborn, and monitor postpartum bleeding." },
      { id: "exam-relevance", heading: "Exam Relevance", kind: "exam_relevance", body: "Exam traps include forgetting neonatal heat loss, suctioning aggressively without indication, ignoring maternal hemorrhage after delivery, or failing to ventilate a newborn who is apneic despite stimulation." },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: "OB calls require two-patient thinking: safe delivery, newborn transition, maternal hemorrhage monitoring, and rapid escalation for complications." }
  ],
  "ems_toxicology_overdose_and_environmental": [
      { id: "clinical-meaning", heading: "Clinical Meaning", kind: "clinical_meaning", body: "Toxicology and environmental calls test pattern recognition, scene safety, airway/ventilation, decontamination awareness, antidote protocols, and transport decisions. The field priority is supportive care plus targeted therapy when indicated, not memorizing every substance." },
      { id: "core-concept", heading: "Core Concept", kind: "core_concept", body: "Overdose care starts with safety and toxidrome thinking: opioid, stimulant, sedative-hypnotic, cholinergic, anticholinergic, sympathomimetic, caustic, carbon monoxide, heat, and cold exposure. Airway and ventilation come before antidote fascination. Naloxone helps opioid-induced respiratory depression but does not replace BVM support. Carbon monoxide requires oxygen and removal from exposure. Heat stroke requires rapid cooling while transport is coordinated." },
      { id: "clinical-scenario", heading: "Clinical Scenario", kind: "clinical_scenario", body: "A patient is found in a garage with headache, confusion, and cherry-red skin is not required for CO poisoning. Multiple family members feel ill. The priority is scene safety, removal from exposure, high-concentration oxygen, monitoring, and destination/medical-control decisions according to protocol." },
      { id: "exam-relevance", heading: "Exam Relevance", kind: "exam_relevance", body: "Exam traps include entering a toxic scene without protection, giving naloxone while failing to ventilate, expecting classic textbook signs, or treating excited delirium/stimulant toxicity without considering hyperthermia and safety." },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: "Support ABCs, identify toxidrome clues, avoid contaminated scenes, and use antidotes as part of a broader care plan." }
  ],
  "ems_communication_handoff_and_documentation": [
      { id: "clinical-meaning", heading: "Clinical Meaning", kind: "clinical_meaning", body: "Paramedic documentation and handoff are patient-safety tools. A clear radio report, concise bedside handoff, and accurate PCR preserve clinical continuity, medical-legal integrity, QA review, and billing compliance. The point is not writing more; it is writing the right objective facts in sequence." },
      { id: "core-concept", heading: "Core Concept", kind: "core_concept", body: "Strong EMS communication includes unit identification, patient age/sex, chief concern, mental status, vital signs, primary findings, interventions, response to treatment, ETA, and special alerts. Documentation should include times, assessment findings, clinical reasoning, medications with dose/route/time, refusals with capacity assessment, destination decisions, and reassessments. Avoid judgmental language and unsupported conclusions." },
      { id: "clinical-scenario", heading: "Clinical Scenario", kind: "clinical_scenario", body: "After treating hypoglycemia, the patient refuses transport. A production-quality PCR documents initial mental status and glucose, treatment, repeat glucose, improved mentation, capacity assessment, risks explained, alternatives, witnesses, medical control if used, and return precautions according to policy." },
      { id: "exam-relevance", heading: "Exam Relevance", kind: "exam_relevance", body: "Exam traps include charting opinions instead of observations, omitting reassessment after medication, weak refusal documentation, or giving a handoff that lacks response to treatment. If it is not documented clearly, it is hard to defend clinically." },
      { id: "takeaways", heading: "Takeaways", kind: "takeaways", body: "Good EMS documentation tells what you found, what you did, how the patient responded, and why the plan was safe within policy." }
  ]
} as const;

function quiz(question: string, options: string[], correct: number, rationale: string) {
  return { question, options, correct, rationale };
}

export const paramedicLessons = [

  {
    pathwayId: "us-allied-core",
    slug: "ems-scene-size-up-and-safety",
    title: "Scene Size-Up and Safety",
    topic: "Scene Size-Up",
    topicSlug: "scene-size-up",
    system: "emergency",
    bodySystem: "prehospital",
    previewSectionCount: 2,
    seoTitle: "Scene Size-Up and Safety for Paramedic and EMT Students",
    seoDescription: "Paramedic lesson covering scene size-up, field judgment, protocol-safe sequencing, assessment priorities, exam traps, and scenario-based EMS reasoning.",
    alliedProfessionKey: "paramedic",
    sections: paramedicSections["ems_scene_size_up_and_safety"],
    studyTakeaways: ["Scene safety comes before patient contact.", "Patient count and hazards determine resource requests.", "Unsafe scenes require staging or additional support, not heroic entry."],
    studyCommonTraps: ["Starting patient care before recognizing hazards", "Ignoring multiple-patient clues", "Forgetting that scene safety is reassessed continuously"],
    preTest: [quiz("What is the first EMS priority on arrival?", ["Medication access", "Scene safety", "Detailed secondary survey", "Transport destination"], 1, "EMS care starts with a safe scene and appropriate PPE/resource decisions.")],
    postTest: [quiz("A downed wire is touching a crashed vehicle. Best first action?", ["Enter quickly and pull the patient out", "Stage and request utility/fire support", "Apply oxygen through the window", "Begin spinal motion restriction"], 1, "Electrical hazards require staging and specialized support before contact.")]
  },

  {
    pathwayId: "us-allied-core",
    slug: "ems-primary-survey-abcde",
    title: "Primary Survey: ABCDE in the Field",
    topic: "Patient Assessment",
    topicSlug: "patient-assessment",
    system: "emergency",
    bodySystem: "prehospital",
    previewSectionCount: 2,
    seoTitle: "Primary Survey: ABCDE in the Field for Paramedic and EMT Students",
    seoDescription: "Paramedic lesson covering patient assessment, field judgment, protocol-safe sequencing, assessment priorities, exam traps, and scenario-based EMS reasoning.",
    alliedProfessionKey: "paramedic",
    sections: paramedicSections["ems_primary_survey_abcde"],
    studyTakeaways: ["Primary survey treats immediate threats as they are found.", "Airway and breathing are separate decisions.", "Uncontrolled bleeding and shock override nonurgent history-taking."],
    studyCommonTraps: ["Doing SAMPLE before ABCDE", "Calling oxygenation adequate because SpO2 is normal despite poor ventilation", "Missing hidden hemorrhage because exposure was skipped"],
    preTest: [quiz("Which finding makes the patient high priority during primary survey?", ["Mild ankle pain", "Uncontrolled arterial bleeding", "Request for a blanket", "Normal skin signs"], 1, "Uncontrolled bleeding is a life threat requiring immediate action.")],
    postTest: [quiz("A patient has snoring respirations after trauma. Priority?", ["Obtain medication list", "Open/position airway per protocol", "Document refusal", "Perform detailed abdominal exam"], 1, "Snoring suggests partial airway obstruction that must be addressed during the primary survey.")]
  },

  {
    pathwayId: "us-allied-core",
    slug: "ems-airway-ventilation-and-oxygenation",
    title: "Airway, Ventilation, and Oxygenation",
    topic: "Airway Management",
    topicSlug: "airway-management",
    system: "respiratory",
    bodySystem: "prehospital",
    previewSectionCount: 2,
    seoTitle: "Airway, Ventilation, and Oxygenation for Paramedic and EMT Students",
    seoDescription: "Paramedic lesson covering airway management, field judgment, protocol-safe sequencing, assessment priorities, exam traps, and scenario-based EMS reasoning.",
    alliedProfessionKey: "paramedic",
    sections: paramedicSections["ems_airway_ventilation_and_oxygenation"],
    studyTakeaways: ["Oxygen does not replace ventilation.", "ETCO2 is a ventilation and perfusion clue.", "Good BVM technique is a high-skill intervention."],
    studyCommonTraps: ["Putting a non-rebreather on an apneic patient instead of ventilating", "Hyperventilating after advanced airway placement", "Ignoring suction when gurgling is present"],
    preTest: [quiz("Which finding most directly indicates ventilation failure?", ["Respiratory rate 4/min", "Mild fever", "Capillary refill under 2 seconds", "Equal pupils"], 0, "A very slow respiratory rate indicates inadequate ventilation.")],
    postTest: [quiz("An apneic patient with a pulse needs:", ["Nasal cannula only", "Assisted ventilation", "Oral glucose", "Immediate refusal form"], 1, "Apnea with a pulse requires ventilation support.")]
  },

  {
    pathwayId: "us-allied-core",
    slug: "ems-shock-and-perfusion",
    title: "Shock and Perfusion in EMS",
    topic: "Shock",
    topicSlug: "shock-recognition",
    system: "cardiovascular",
    bodySystem: "prehospital",
    previewSectionCount: 2,
    seoTitle: "Shock and Perfusion in EMS for Paramedic and EMT Students",
    seoDescription: "Paramedic lesson covering shock, field judgment, protocol-safe sequencing, assessment priorities, exam traps, and scenario-based EMS reasoning.",
    alliedProfessionKey: "paramedic",
    sections: paramedicSections["ems_shock_and_perfusion"],
    studyTakeaways: ["Shock can exist before hypotension.", "Skin, mentation, pulse quality, and mechanism matter.", "Different shock types need different field priorities."],
    studyCommonTraps: ["Calling a patient stable because systolic BP is normal", "Missing compensated hemorrhage", "Treating cardiogenic shock like simple dehydration"],
    preTest: [quiz("Which is an early shock clue?", ["Warm dry skin after exercise only", "Anxiety, tachycardia, pale cool skin", "Normal appetite", "Localized finger pain"], 1, "Mental status change, tachycardia, and cool pale skin can reflect poor perfusion.")],
    postTest: [quiz("Shock is best defined as:", ["Low oxygen tank pressure", "Inadequate tissue perfusion", "Any high blood pressure", "A normal response to pain"], 1, "Shock is inadequate tissue perfusion regardless of the initial BP.")]
  },

  {
    pathwayId: "us-allied-core",
    slug: "ems-cardiac-chest-pain-and-stemi",
    title: "Chest Pain, ACS, and STEMI Recognition",
    topic: "Cardiac Emergencies",
    topicSlug: "cardiac-emergencies",
    system: "cardiovascular",
    bodySystem: "prehospital",
    previewSectionCount: 2,
    seoTitle: "Chest Pain, ACS, and STEMI Recognition for Paramedic and EMT Students",
    seoDescription: "Paramedic lesson covering cardiac emergencies, field judgment, protocol-safe sequencing, assessment priorities, exam traps, and scenario-based EMS reasoning.",
    alliedProfessionKey: "paramedic",
    sections: paramedicSections["ems_cardiac_chest_pain_and_stemi"],
    studyTakeaways: ["Atypical ACS symptoms still need ECG thinking.", "Inferior STEMI can be preload-sensitive.", "Medication safety requires contraindication checks."],
    studyCommonTraps: ["Waiting for classic crushing pain", "Giving nitro without contraindication screen", "Ignoring reciprocal changes"],
    preTest: [quiz("What is a priority for suspected ACS in the field?", ["Delay ECG until hospital", "Acquire early 12-lead ECG", "Give antibiotics", "Perform full neurologic exam first"], 1, "Early 12-lead acquisition supports time-sensitive STEMI recognition.")],
    postTest: [quiz("Before nitroglycerin, check:", ["Favorite food", "Blood pressure and contraindications", "Shoe size", "Temperature only"], 1, "Nitroglycerin can worsen hypotension and has important contraindications.")]
  },

  {
    pathwayId: "us-allied-core",
    slug: "ems-arrhythmias-and-ecg-integration",
    title: "Arrhythmias and ECG Integration for EMS",
    topic: "ECG and Rhythm Recognition",
    topicSlug: "prehospital-ecg",
    system: "cardiovascular",
    bodySystem: "prehospital",
    previewSectionCount: 2,
    seoTitle: "Arrhythmias and ECG Integration for EMS for Paramedic and EMT Students",
    seoDescription: "Paramedic lesson covering ecg and rhythm recognition, field judgment, protocol-safe sequencing, assessment priorities, exam traps, and scenario-based EMS reasoning.",
    alliedProfessionKey: "paramedic",
    sections: paramedicSections["ems_arrhythmias_and_ecg_integration"],
    studyTakeaways: ["Patient stability changes rhythm management.", "Wide-complex tachycardia is high-risk in EMS.", "A displayed rhythm does not prove a pulse."],
    studyCommonTraps: ["Treating monitor findings without pulse check", "Using stable algorithms for unstable patients", "Ignoring QRS width"],
    preTest: [quiz("A pulseless patient with organized electrical activity has:", ["Sinus rhythm with normal perfusion", "PEA until proven otherwise", "Stable SVT", "A normal finding"], 1, "Organized electrical activity without a pulse is pulseless electrical activity.")],
    postTest: [quiz("Unstable regular wide-complex tachycardia usually requires:", ["Delayed transport only", "Synchronized cardioversion pathway per protocol", "Oral glucose", "No monitoring"], 1, "Unstable tachycardia is treated urgently according to cardioversion protocols.")]
  },

  {
    pathwayId: "us-allied-core",
    slug: "ems-stroke-and-neurologic-emergencies",
    title: "Stroke and Neurologic Emergencies",
    topic: "Neurologic Emergencies",
    topicSlug: "neurologic-emergencies",
    system: "neurological",
    bodySystem: "prehospital",
    previewSectionCount: 2,
    seoTitle: "Stroke and Neurologic Emergencies for Paramedic and EMT Students",
    seoDescription: "Paramedic lesson covering neurologic emergencies, field judgment, protocol-safe sequencing, assessment priorities, exam traps, and scenario-based EMS reasoning.",
    alliedProfessionKey: "paramedic",
    sections: paramedicSections["ems_stroke_and_neurologic_emergencies"],
    studyTakeaways: ["Last-known-well is critical.", "Glucose check protects against a common mimic.", "Early notification reduces treatment delays."],
    studyCommonTraps: ["Confusing found time with last-known-well", "Skipping glucose", "Assuming intoxication explains focal deficits"],
    preTest: [quiz("Which time matters most for stroke eligibility decisions?", ["Time EMS cleared previous call", "Last-known-well", "Ambulance wash time", "Medication expiry time"], 1, "Last-known-well anchors acute stroke treatment timelines.")],
    postTest: [quiz("A stroke screen should include:", ["Blood glucose check", "Only lung sounds", "Only abdominal palpation", "No time documentation"], 0, "Glucose is a key stroke mimic screen.")]
  },

  {
    pathwayId: "us-allied-core",
    slug: "ems-trauma-hemorrhage-and-spinal-motion",
    title: "Trauma, Hemorrhage, and Spinal Motion Restriction",
    topic: "Trauma",
    topicSlug: "trauma-care",
    system: "trauma",
    bodySystem: "prehospital",
    previewSectionCount: 2,
    seoTitle: "Trauma, Hemorrhage, and Spinal Motion Restriction for Paramedic and EMT Students",
    seoDescription: "Paramedic lesson covering trauma, field judgment, protocol-safe sequencing, assessment priorities, exam traps, and scenario-based EMS reasoning.",
    alliedProfessionKey: "paramedic",
    sections: paramedicSections["ems_trauma_hemorrhage_and_spinal_motion"],
    studyTakeaways: ["Massive hemorrhage is treated immediately.", "Hypothermia prevention is trauma care.", "Spinal motion restriction is risk-based and protocol-driven."],
    studyCommonTraps: ["Delaying tourniquet for uncontrolled extremity bleeding", "Over-prioritizing spine packaging before bleeding control", "Ignoring destination criteria"],
    preTest: [quiz("Life-threatening extremity bleeding should be managed with:", ["Delayed reassessment only", "Immediate hemorrhage control per protocol", "A full SAMPLE first", "Oral fluids"], 1, "Massive bleeding is an immediate primary-survey threat.")],
    postTest: [quiz("Why prevent hypothermia in trauma?", ["It improves coagulopathy risk management", "It is only for comfort", "It replaces bleeding control", "It confirms stroke"], 0, "Hypothermia worsens trauma coagulopathy and outcomes.")]
  },

  {
    pathwayId: "us-allied-core",
    slug: "ems-pediatric-assessment-and-dosing",
    title: "Pediatric Assessment and Weight-Based Dosing",
    topic: "Pediatrics",
    topicSlug: "pediatric-emergencies",
    system: "pediatric",
    bodySystem: "prehospital",
    previewSectionCount: 2,
    seoTitle: "Pediatric Assessment and Weight-Based Dosing for Paramedic and EMT Students",
    seoDescription: "Paramedic lesson covering pediatrics, field judgment, protocol-safe sequencing, assessment priorities, exam traps, and scenario-based EMS reasoning.",
    alliedProfessionKey: "paramedic",
    sections: paramedicSections["ems_pediatric_assessment_and_dosing"],
    studyTakeaways: ["Appearance and work of breathing are early clues.", "Pediatric medication safety is weight-based.", "Normal BP can hide compensated shock."],
    studyCommonTraps: ["Using adult doses", "Calling a tired quiet child improved", "Waiting for hypotension before recognizing pediatric shock"],
    preTest: [quiz("A pediatric dose should be based on:", ["Adult default dose", "Estimated/known weight per protocol", "Crew preference", "Parent height"], 1, "Pediatric medication dosing is weight-based.")],
    postTest: [quiz("Which can be ominous in pediatric respiratory distress?", ["Sudden quietness and fatigue", "Improving speech", "Pink warm skin with playfulness", "Normal work of breathing"], 0, "A tiring child may become quiet before respiratory failure.")]
  },

  {
    pathwayId: "us-allied-core",
    slug: "ems-ob-and-neonatal-emergencies",
    title: "OB and Neonatal Emergencies",
    topic: "OB and Neonatal",
    topicSlug: "ob-neonatal-emergencies",
    system: "obstetrics",
    bodySystem: "prehospital",
    previewSectionCount: 2,
    seoTitle: "OB and Neonatal Emergencies for Paramedic and EMT Students",
    seoDescription: "Paramedic lesson covering ob and neonatal, field judgment, protocol-safe sequencing, assessment priorities, exam traps, and scenario-based EMS reasoning.",
    alliedProfessionKey: "paramedic",
    sections: paramedicSections["ems_ob_and_neonatal_emergencies"],
    studyTakeaways: ["Newborn warming is a priority.", "Postpartum hemorrhage can deteriorate quickly.", "Ventilation is key when a newborn is apneic."],
    studyCommonTraps: ["Forgetting maternal reassessment after delivery", "Ignoring neonatal heat loss", "Delaying ventilation for an apneic newborn"],
    preTest: [quiz("After delivery, a newborn who is apneic after stimulation needs:", ["Ventilation support per neonatal protocol", "Oral fluids", "Delayed assessment", "Adult aspirin"], 0, "Ventilation is central in neonatal resuscitation when apnea persists.")],
    postTest: [quiz("A major maternal post-delivery concern is:", ["Postpartum hemorrhage", "Toe sprain", "Seasonal allergies", "Stable paperwork"], 0, "Postpartum bleeding can become life-threatening.")]
  },

  {
    pathwayId: "us-allied-core",
    slug: "ems-toxicology-overdose-and-environmental",
    title: "Toxicology, Overdose, and Environmental Emergencies",
    topic: "Toxicology and Environmental",
    topicSlug: "toxicology-overdose",
    system: "emergency",
    bodySystem: "prehospital",
    previewSectionCount: 2,
    seoTitle: "Toxicology, Overdose, and Environmental Emergencies for Paramedic and EMT Students",
    seoDescription: "Paramedic lesson covering toxicology and environmental, field judgment, protocol-safe sequencing, assessment priorities, exam traps, and scenario-based EMS reasoning.",
    alliedProfessionKey: "paramedic",
    sections: paramedicSections["ems_toxicology_overdose_and_environmental"],
    studyTakeaways: ["Ventilation comes before naloxone fixation.", "Multiple sick patients can signal environmental exposure.", "Heat stroke requires active cooling."],
    studyCommonTraps: ["Entering contaminated scenes", "Expecting classic signs only", "Ignoring temperature in stimulant toxicity"],
    preTest: [quiz("In opioid overdose with apnea and a pulse, first priority is:", ["Ventilation support", "Paperwork", "Oral charcoal for all cases", "Standing the patient up"], 0, "Ventilation is immediately required for apnea.")],
    postTest: [quiz("Multiple patients with headache in a home suggests:", ["Carbon monoxide possibility", "Normal anxiety only", "Isolated ankle injury", "No scene concern"], 0, "Multiple similar symptoms in a shared environment suggest exposure such as carbon monoxide.")]
  },

  {
    pathwayId: "us-allied-core",
    slug: "ems-communication-handoff-and-documentation",
    title: "EMS Communication, Handoff, and Documentation",
    topic: "Communication and Documentation",
    topicSlug: "ems-documentation",
    system: "professional",
    bodySystem: "prehospital",
    previewSectionCount: 2,
    seoTitle: "EMS Communication, Handoff, and Documentation for Paramedic and EMT Students",
    seoDescription: "Paramedic lesson covering communication and documentation, field judgment, protocol-safe sequencing, assessment priorities, exam traps, and scenario-based EMS reasoning.",
    alliedProfessionKey: "paramedic",
    sections: paramedicSections["ems_communication_handoff_and_documentation"],
    studyTakeaways: ["Objective language matters.", "Reassessments prove treatment response.", "Refusals need capacity and risk documentation."],
    studyCommonTraps: ["Omitting medication reassessment", "Using judgmental language", "Documenting refusal without capacity assessment"],
    preTest: [quiz("A strong EMS handoff includes:", ["Only the patient's first name", "Findings, interventions, response, and ETA/context", "No vital signs", "Billing code only"], 1, "Handoff should communicate the clinical story and response to treatment.")],
    postTest: [quiz("Refusal documentation should include:", ["Capacity/risk discussion per policy", "Crew opinions only", "No vitals", "A blank narrative"], 0, "Refusals require capacity, risks, alternatives, and policy-aligned documentation.")]
  }
];

export default { lessons: paramedicLessons };
