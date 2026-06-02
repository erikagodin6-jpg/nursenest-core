function quiz(question: string, options: string[], correct: number, rationale: string) {
  return { question, options, correct, rationale };
}

const emsSections = {
  sceneSizeUp: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "EMS care starts before patient contact. Scene size-up protects responders, patients, bystanders, and downstream care teams. EMT and paramedic exams reward structured thinking: safety first, mechanism or nature of illness, resources, number of patients, PPE, and the decision to enter, stage, retreat, or request additional help."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Use a consistent scene-size-up sequence: body substance isolation, scene safety, mechanism of injury or nature of illness, number of patients, need for additional resources, and cervical spine or trauma considerations when indicated. A safe EMS answer does not rush into hazards. Traffic, violence, downed wires, chemical exposure, fire, unstable structures, weapons, and unknown substances require staging and specialized resources."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A crew arrives to a motor vehicle collision with leaking fluid, heavy traffic, and bystanders trying to pull a patient from the vehicle. The safest first action is not immediate patient contact. The crew must secure scene safety, request traffic/fire support if needed, use PPE, control hazards within role, and prevent unsafe movement until extrication and clinical priorities are clear."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "EMS exams commonly ask what to do first. If the scene is unsafe, the answer is scene safety, staging, PPE, or requesting appropriate resources. Patient assessment does not begin until the provider can safely access the patient."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "No patient contact is worth becoming another patient. Safety, resources, mechanism, and number of patients come before hands-on care."
    }
  ],
  primaryAssessment: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "The primary assessment finds and treats immediate life threats. EMS exams reward prioritization over comprehensive history. Airway, breathing, circulation, disability, exposure, general impression, mental status, and transport priority guide early decisions."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Start with general impression and level of consciousness. Assess airway patency, breathing adequacy, circulation, major bleeding, skin signs, pulse quality, and disability findings. Correct life threats as they are found. Severe hemorrhage may need immediate control before detailed airway work. Inadequate breathing requires ventilation support, not oxygen alone. Altered mental status, shock, respiratory failure, chest pain with instability, stroke signs, severe trauma, and sepsis clues increase transport priority."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "An unresponsive patient is breathing six times per minute with shallow respirations. The priority is ventilation support with a BVM and airway positioning or adjuncts as appropriate. Applying oxygen by nasal cannula without ventilating does not correct inadequate breathing."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Primary assessment items often hide the word inadequate. Inadequate respirations need assisted ventilation. Uncontrolled bleeding needs direct hemorrhage control. Unstable shock signs need rapid transport and protocol-based intervention. Do not get distracted by secondary assessment details before life threats are addressed."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Find life threats, treat them immediately, and decide transport priority. Primary assessment is not a full history."
    }
  ],
  airwayVentilation: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Airway and ventilation are core EMS decision points. Oxygenation places oxygen into the blood; ventilation moves air and removes carbon dioxide. EMT and paramedic exams frequently test the difference between oxygen administration and ventilatory support."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "A patent airway does not guarantee adequate ventilation. Assess rate, depth, effort, chest rise, skin signs, mental status, SpO2, and waveform capnography when available and within scope. Basic airway maneuvers include positioning, suction, OPA or NPA use when appropriate, and BVM ventilation. Advanced providers add supraglottic airways, endotracheal intubation, CPAP, ventilator support, and medication-assisted pathways according to protocol. Avoid hyperventilation because it reduces venous return and can worsen outcomes in several emergencies."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient with opioid overdose has a pulse but slow, shallow respirations and cyanosis. The immediate priority is airway positioning and assisted ventilation, with naloxone according to protocol. Waiting for naloxone to work while ventilation remains inadequate is unsafe."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Airway questions often ask whether to give oxygen, ventilate, suction, insert an adjunct, or escalate to advanced airway management. If breathing is inadequate, ventilation is the priority. If gurgling or visible secretions are present, suction comes before ventilation attempts."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Oxygen does not fix inadequate ventilation. Open the airway, suction when needed, ventilate effectively, and monitor response."
    }
  ],
  shockBleeding: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Shock is inadequate tissue perfusion. EMS clinicians must identify shock early because blood pressure can stay deceptively normal until compensation fails. Hemorrhage control, rapid transport, warming, positioning, oxygenation, and protocol-specific fluids or medications depend on shock type and scope."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "External life-threatening bleeding requires immediate control with direct pressure, wound packing when indicated, hemostatic dressing if available, and tourniquet use for severe extremity bleeding according to protocol. Shock signs include altered mental status, cool clammy skin, weak rapid pulse, delayed capillary refill, tachypnea, hypotension in later stages, and anxiety or restlessness. Treat the cause: hemorrhagic shock needs bleeding control and rapid transport; distributive shock may need protocol-specific support; obstructive shock requires recognition and rapid definitive care."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient has bright red spurting bleeding from a leg wound after machinery injury. The first priority is life-threatening hemorrhage control. A tourniquet may be indicated if direct pressure is ineffective or bleeding is severe by protocol. Checking a full SAMPLE history before controlling bleeding is unsafe."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Shock and bleeding questions test sequence. Control massive bleeding before less urgent assessment. Do not wait for hypotension to recognize shock. Do not remove an effective tourniquet casually. Prevent heat loss even in warm environments."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Treat shock early. Control major bleeding, support airway and breathing, keep the patient warm, and move toward definitive care."
    }
  ],
  cardiology: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "EMS cardiology is recognition plus time-sensitive action. Chest pain, dysrhythmias, cardiac arrest, STEMI systems, syncope, shock, and medication decisions require protocol-driven judgment. EMT and paramedic exams reward early identification, safe escalation, and minimizing scene delay when definitive care is needed."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "For chest pain, assess airway, breathing, circulation, vital signs, history, contraindications, aspirin eligibility, nitroglycerin considerations by scope and protocol, 12-lead acquisition when available, and transport to an appropriate facility. For cardiac arrest, prioritize high-quality compressions, early defibrillation for shockable rhythms, ventilation without hyperventilation, team roles, and reversible causes. For unstable tachycardia or bradycardia, paramedic-level interventions follow protocol and depend on perfusion signs."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A patient has crushing chest pressure, diaphoresis, nausea, and a 12-lead showing ST elevation. The EMS priority is STEMI-system activation and transport according to regional protocol, while providing indicated medications and monitoring. A long on-scene history should not delay reperfusion pathway activation."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Cardiology exam traps include delaying defibrillation, hyperventilating during CPR, giving nitroglycerin despite contraindications, missing inferior/right-sided caution clues, failing to acquire or transmit a 12-lead when available, and treating monitor findings without assessing perfusion."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "Assess perfusion, follow protocol, defibrillate shockable arrest early, and move STEMI patients toward reperfusion without avoidable delay."
    }
  ],
  trauma: [
    {
      id: "clinical-meaning",
      heading: "Clinical Meaning",
      kind: "clinical_meaning",
      body: "Trauma care prioritizes preventable death: airway compromise, massive hemorrhage, tension physiology, shock, traumatic brain injury, hypothermia, and delayed transport. EMS exams reward mechanism-aware assessment and rapid destination decisions."
    },
    {
      id: "core-concept",
      heading: "Core Concept",
      kind: "core_concept",
      body: "Use mechanism, primary survey, major bleeding control, airway and breathing assessment, circulation, disability, exposure, spinal motion restriction when indicated, pelvic stabilization when suspected, chest injury recognition, burn severity, and trauma-triage criteria. High-risk findings include altered mental status, hypotension, penetrating injury to head/neck/torso/proximal extremities, flail chest, major burns, crushed or mangled extremity, paralysis, and high-energy mechanisms with concerning exam findings."
    },
    {
      id: "clinical-scenario",
      heading: "Clinical Scenario",
      kind: "clinical_scenario",
      body: "A motorcycle crash patient is confused, pale, tachycardic, and has abdominal tenderness. Even if the blood pressure is initially acceptable, this pattern suggests possible internal bleeding and compensated shock. The safest EMS plan is rapid trauma assessment, shock management, early transport decision, and destination selection by trauma protocol."
    },
    {
      id: "exam-relevance",
      heading: "Exam Relevance",
      kind: "exam_relevance",
      body: "Trauma questions often test whether to stay and perform noncritical interventions or transport rapidly. Do not let splinting minor injuries delay life-threatening trauma transport. Control catastrophic bleeding, support ventilation, prevent hypothermia, and move."
    },
    {
      id: "takeaways",
      heading: "Takeaways",
      kind: "takeaways",
      body: "In major trauma, sequence matters: hemorrhage control, airway and breathing support, shock recognition, hypothermia prevention, and rapid transport to the right destination."
    }
  ]
};

export const emergencyMedicalServicesLessons = [
  {
    pathwayId: "us-allied-core",
    slug: "ems-scene-size-up-safety-and-resources",
    title: "Scene Size-Up, Safety, and Resources",
    topic: "EMS Scene Safety",
    topicSlug: "ems-scene-safety",
    system: "emergency-medical-services",
    bodySystem: "prehospital-care",
    previewSectionCount: 2,
    seoTitle: "EMT and Paramedic Scene Size-Up and Safety",
    seoDescription: "EMS lesson on scene size-up, BSI/PPE, hazards, mechanism, number of patients, staging, resources, and responder safety.",
    alliedProfessionKey: "emt",
    sections: emsSections.sceneSizeUp,
    studyTakeaways: ["Scene safety comes before patient contact.", "Request resources early when hazards exceed crew capacity.", "Mechanism and number of patients shape the first plan."],
    studyCommonTraps: ["Entering unsafe scenes", "Skipping PPE", "Starting assessment before checking hazards"],
    preTest: [quiz("An EMS crew arrives to downed wires near a patient. What is safest first?", ["Run directly to the patient", "Stage and request appropriate utility/fire resources", "Move the wires with gloves", "Ignore the wires if the patient is awake"], 1, "Downed wires are a scene hazard; EMS should stage and request specialized resources before entering.")],
    postTest: [quiz("Which scene-size-up element comes before hands-on assessment?", ["Scene safety", "Full SAMPLE history", "Detailed neuro exam", "Medication reconciliation"], 0, "Scene safety must be established before patient contact.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "ems-primary-assessment-and-transport-priority",
    title: "Primary Assessment and Transport Priority",
    topic: "EMS Assessment",
    topicSlug: "ems-primary-assessment",
    system: "emergency-medical-services",
    bodySystem: "prehospital-care",
    previewSectionCount: 2,
    seoTitle: "EMT Primary Assessment and Transport Priority",
    seoDescription: "EMT/paramedic lesson on primary assessment, ABCs, mental status, life threats, major bleeding, breathing adequacy, shock signs, and transport decisions.",
    alliedProfessionKey: "emt",
    sections: emsSections.primaryAssessment,
    studyTakeaways: ["Primary assessment finds life threats.", "Inadequate breathing requires ventilation support.", "Transport priority is based on stability and risk."],
    studyCommonTraps: ["Taking a long history before treating life threats", "Giving oxygen without ventilating inadequate breathing", "Waiting for hypotension before recognizing shock"],
    preTest: [quiz("An unresponsive patient is breathing 6/min with shallow chest rise. What is priority?", ["Nasal cannula only", "Assisted ventilation with airway support", "Full medication history", "Orthostatic vitals"], 1, "Inadequate respirations require ventilation support, not oxygen alone.")],
    postTest: [quiz("What is the purpose of the primary assessment?", ["Identify and treat immediate life threats", "Complete billing information", "Obtain every medication dose", "Decide hospital cafeteria options"], 0, "The primary assessment identifies and treats immediate life threats.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "ems-airway-oxygenation-and-ventilation-support",
    title: "Airway, Oxygenation, and Ventilation Support",
    topic: "EMS Airway",
    topicSlug: "ems-airway",
    system: "emergency-medical-services",
    bodySystem: "airway",
    previewSectionCount: 2,
    seoTitle: "EMT and Paramedic Airway Oxygenation and Ventilation",
    seoDescription: "EMS airway lesson on airway positioning, suction, OPA/NPA, BVM ventilation, oxygenation vs ventilation, opioid overdose, capnography, and avoiding hyperventilation.",
    alliedProfessionKey: "emt",
    sections: emsSections.airwayVentilation,
    studyTakeaways: ["Oxygenation and ventilation are different.", "Suction before ventilating through secretions.", "Avoid hyperventilation."],
    studyCommonTraps: ["Giving oxygen only when ventilation is inadequate", "Ignoring gurgling airway sounds", "Ventilating too fast"],
    preTest: [quiz("A patient has gurgling respirations and secretions in the airway. What should happen before BVM ventilation?", ["Suction", "Oral glucose", "Aspirin", "Splinting"], 0, "Secretions should be suctioned before ventilation attempts.")],
    postTest: [quiz("What does BVM ventilation primarily support?", ["Ventilation", "Billing", "Splinting", "Temperature measurement"], 0, "BVM ventilation moves air and supports ventilation when breathing is inadequate.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "ems-shock-hemorrhage-control-and-perfusion",
    title: "Shock, Hemorrhage Control, and Perfusion",
    topic: "EMS Shock",
    topicSlug: "ems-shock",
    system: "emergency-medical-services",
    bodySystem: "shock",
    previewSectionCount: 2,
    seoTitle: "EMS Shock and Hemorrhage Control for EMT and Paramedic Exams",
    seoDescription: "EMS lesson on shock recognition, massive bleeding, direct pressure, tourniquets, compensated shock, perfusion signs, heat loss prevention, and rapid transport.",
    alliedProfessionKey: "emt",
    sections: emsSections.shockBleeding,
    studyTakeaways: ["Control life-threatening bleeding immediately.", "Shock may exist before hypotension.", "Prevent heat loss during trauma and shock."],
    studyCommonTraps: ["Waiting for low blood pressure", "Removing an effective tourniquet casually", "Taking a long history before bleeding control"],
    preTest: [quiz("A patient has spurting extremity bleeding. What is the priority?", ["Detailed SAMPLE history", "Immediate hemorrhage control", "Routine discharge advice", "Check blood glucose first in every case"], 1, "Life-threatening bleeding must be controlled immediately.")],
    postTest: [quiz("Which sign can suggest compensated shock?", ["Cool clammy skin and tachycardia", "Warm dry skin only after exercise", "Normal mood and no symptoms", "Perfect perfusion"], 0, "Tachycardia and cool clammy skin can indicate compensation before hypotension appears.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "ems-cardiology-chest-pain-arrest-and-stemi-systems",
    title: "Cardiology: Chest Pain, Arrest, and STEMI Systems",
    topic: "EMS Cardiology",
    topicSlug: "ems-cardiology",
    system: "emergency-medical-services",
    bodySystem: "cardiology",
    previewSectionCount: 2,
    seoTitle: "EMS Cardiology Chest Pain Cardiac Arrest and STEMI",
    seoDescription: "EMT and paramedic cardiology lesson on chest pain, aspirin, nitroglycerin cautions, 12-lead acquisition, STEMI activation, CPR, defibrillation, and perfusion assessment.",
    alliedProfessionKey: "paramedic",
    sections: emsSections.cardiology,
    studyTakeaways: ["Assess perfusion, not just monitor rhythm.", "Shockable arrest needs early defibrillation.", "STEMI systems reduce reperfusion delay."],
    studyCommonTraps: ["Delaying defibrillation", "Hyperventilating during CPR", "Ignoring nitroglycerin contraindications"],
    preTest: [quiz("A pulseless patient has a shockable rhythm. What intervention is time-critical?", ["Defibrillation with high-quality CPR", "Long history", "Oral glucose", "Routine transport without CPR"], 0, "Shockable cardiac arrest requires high-quality CPR and early defibrillation.")],
    postTest: [quiz("A chest-pain patient with STEMI on 12-lead needs priority movement toward:", ["Reperfusion pathway by protocol", "Delayed transport for lengthy paperwork", "Routine nonurgent clinic follow-up", "No monitoring"], 0, "STEMI care prioritizes system activation and transport toward reperfusion-capable care by protocol.")]
  },
  {
    pathwayId: "us-allied-core",
    slug: "ems-trauma-triage-bleeding-and-rapid-transport",
    title: "Trauma Triage, Bleeding, and Rapid Transport",
    topic: "EMS Trauma",
    topicSlug: "ems-trauma",
    system: "emergency-medical-services",
    bodySystem: "trauma",
    previewSectionCount: 2,
    seoTitle: "EMS Trauma Triage Bleeding and Rapid Transport",
    seoDescription: "EMT and paramedic trauma lesson on mechanism, major bleeding, shock, spinal motion restriction, chest injury, burns, trauma destination, and rapid transport decisions.",
    alliedProfessionKey: "paramedic",
    sections: emsSections.trauma,
    studyTakeaways: ["Major trauma is time-sensitive.", "Do not let minor interventions delay critical transport.", "Prevent hypothermia and recognize shock early."],
    studyCommonTraps: ["Splinting minor injuries before life threats", "Ignoring compensated shock", "Missing high-risk mechanism plus abnormal exam"],
    preTest: [quiz("A confused motorcycle crash patient is pale, tachycardic, and has abdominal tenderness. What should this suggest?", ["Possible internal bleeding and compensated shock", "Low priority only", "No transport needed", "Only anxiety"], 0, "This pattern is concerning for internal bleeding and compensated shock after high-energy trauma.")],
    postTest: [quiz("In major trauma, which action should not delay rapid transport?", ["Splinting a minor stable finger injury", "Controlling catastrophic bleeding", "Supporting ventilation", "Preventing hypothermia"], 0, "Minor non-life-threatening interventions should not delay transport in major trauma.")]
  }
];

export default { lessons: emergencyMedicalServicesLessons };
