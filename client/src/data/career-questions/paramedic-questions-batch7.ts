import type { CareerQuestion } from "./rrt-questions";

export const paramedicQuestionsBatch7: CareerQuestion[] = [
  {
    id: "para-mci-001",
    stem: "You arrive first at a bus rollover with approximately 40 passengers. Using the START triage system, what is your FIRST action?",
    options: [
      "Begin treating the most critically injured patient",
      "Direct all walking wounded to a designated area and tag them GREEN",
      "Request additional resources and establish command",
      "Begin assessing non-ambulatory patients nearest to you"
    ],
    correctIndex: 1,
    rationale: "In START triage, the first step is to direct all ambulatory (walking) patients to a designated collection area and classify them as Minor (GREEN). This rapidly sorts the largest group and allows responders to focus assessment on non-ambulatory patients who are more likely to need immediate intervention. While requesting resources is important, the triage sorting process begins with the walking wounded.",
    difficulty: 2,
    category: "Mass Casualty Incidents",
    topic: "START Triage"
  },
  {
    id: "para-mci-002",
    stem: "During START triage, you encounter a non-ambulatory patient who is not breathing. After opening the airway, the patient begins breathing at 22 breaths per minute. This patient is tagged:",
    options: [
      "GREEN (Minor)",
      "YELLOW (Delayed)",
      "RED (Immediate)",
      "BLACK (Expectant/Deceased)"
    ],
    correctIndex: 2,
    rationale: "In START triage, if a patient is not breathing but starts breathing after a simple airway maneuver (head-tilt chin-lift or jaw thrust), they are tagged RED (Immediate). The need for an airway intervention to maintain breathing indicates a life-threatening condition requiring immediate care. If they did not resume breathing after the maneuver, they would be tagged BLACK.",
    difficulty: 3,
    category: "Mass Casualty Incidents",
    topic: "START Triage"
  },
  {
    id: "para-mci-003",
    stem: "In START triage, a non-ambulatory patient has spontaneous respirations at 14/min, a radial pulse present, and follows commands. This patient is classified as:",
    options: [
      "RED (Immediate)",
      "YELLOW (Delayed)",
      "GREEN (Minor)",
      "BLACK (Expectant)"
    ],
    correctIndex: 1,
    rationale: "In START triage, after confirming respirations are present and under 30/min, checking perfusion (radial pulse present = adequate), and assessing mental status (follows commands = intact), the patient is classified YELLOW (Delayed). They have injuries requiring treatment but can wait. RED requires failed criteria at any step; GREEN is for walking wounded.",
    difficulty: 3,
    category: "Mass Casualty Incidents",
    topic: "START Triage"
  },
  {
    id: "para-mci-004",
    stem: "During a mass casualty incident, a non-ambulatory patient has a respiratory rate of 36 breaths per minute. According to START triage, this patient is classified as:",
    options: [
      "GREEN (Minor)",
      "YELLOW (Delayed)",
      "RED (Immediate)",
      "BLACK (Expectant)"
    ],
    correctIndex: 2,
    rationale: "In START triage, a respiratory rate greater than 30 breaths per minute automatically classifies a patient as RED (Immediate) regardless of other findings. Tachypnea above 30/min suggests significant physiological compromise such as shock, respiratory failure, or severe pain requiring immediate intervention.",
    difficulty: 2,
    category: "Mass Casualty Incidents",
    topic: "START Triage"
  },
  {
    id: "para-mci-005",
    stem: "At a mass casualty incident, you are assigned as the Triage Officer. A bystander is performing CPR on a patient. Using START triage principles, you should:",
    options: [
      "Allow CPR to continue and tag the patient RED",
      "Take over CPR and call for ALS backup",
      "Stop CPR, tag the patient BLACK, and move to the next patient",
      "Assess the patient for a shockable rhythm with an AED"
    ],
    correctIndex: 2,
    rationale: "In an MCI with limited resources, patients in cardiac arrest are tagged BLACK (Expectant/Deceased) because performing CPR on one patient prevents triage and treatment of multiple salvageable patients. The fundamental MCI principle is 'the greatest good for the greatest number.' Resources spent on a single arrest patient could save several RED-tagged patients.",
    difficulty: 4,
    category: "Mass Casualty Incidents",
    topic: "START Triage"
  },
  {
    id: "para-mci-006",
    stem: "The JumpSTART triage system differs from adult START triage primarily in that it:",
    options: [
      "Uses five triage categories instead of four",
      "Includes a step for providing five rescue breaths to apneic children with a pulse",
      "Does not include a walking filter as the first step",
      "Uses blood pressure as the perfusion assessment instead of radial pulse"
    ],
    correctIndex: 1,
    rationale: "JumpSTART, designed for pediatric patients (ages 1-8), modifies START triage by adding a step: if a child is apneic but has a palpable pulse, the rescuer provides 5 rescue breaths. If breathing resumes, tag RED; if not, tag BLACK. This accounts for the fact that pediatric cardiac arrest is usually respiratory in origin and may respond to brief ventilation. The same four color categories are used.",
    difficulty: 4,
    category: "Mass Casualty Incidents",
    topic: "JumpSTART Pediatric Triage"
  },
  {
    id: "para-mci-007",
    stem: "In the Incident Command System (ICS), which section is responsible for tracking resources, personnel, and maintaining the incident action plan?",
    options: [
      "Operations Section",
      "Planning Section",
      "Logistics Section",
      "Finance/Administration Section"
    ],
    correctIndex: 1,
    rationale: "The Planning Section is responsible for collecting, evaluating, and disseminating incident situation information, preparing the Incident Action Plan, and tracking resources and personnel. Operations manages tactical operations, Logistics provides resources and services, and Finance/Administration handles cost accounting and procurement.",
    difficulty: 3,
    category: "Mass Casualty Incidents",
    topic: "Incident Command System"
  },
  {
    id: "para-mci-008",
    stem: "During an MCI, you are designated as the Medical Branch Director. A paramedic on scene wants to perform a cricothyrotomy on a RED-tagged patient. Your role is to:",
    options: [
      "Perform the procedure yourself as the most senior provider",
      "Authorize or deny the procedure based on available resources and number of patients remaining",
      "Defer all medical decisions to the Incident Commander",
      "Instruct the paramedic to transport the patient before performing any procedures"
    ],
    correctIndex: 1,
    rationale: "The Medical Branch Director oversees all medical operations at the MCI including treatment decisions. In an MCI, resource allocation decisions must consider the overall patient load. An invasive procedure like cricothyrotomy ties up a provider and resources that might benefit multiple patients. The Medical Branch Director makes these allocation decisions, not the Incident Commander who handles overall scene management.",
    difficulty: 4,
    category: "Mass Casualty Incidents",
    topic: "Incident Command System"
  },
  {
    id: "para-mci-009",
    stem: "A chemical plant explosion has occurred with an unknown chemical release. As the first arriving EMS unit, you should:",
    options: [
      "Immediately enter the facility to begin patient triage",
      "Stage upwind and uphill, establish command, request HazMat team, and deny entry to the hot zone",
      "Begin decontamination of patients as they self-evacuate",
      "Wait for law enforcement to secure the scene before approaching"
    ],
    correctIndex: 1,
    rationale: "Scene safety is paramount in HazMat incidents. First responders should stage upwind and uphill to avoid chemical exposure, establish incident command, request specialized HazMat resources, and establish a perimeter. Entering the hot zone without proper PPE risks becoming additional patients. Decontamination requires HazMat personnel and proper equipment. EMS does not wait for law enforcement for HazMat — they manage their own safety.",
    difficulty: 3,
    category: "Scene Safety & Triage",
    topic: "HazMat Scene Management"
  },
  {
    id: "para-mci-010",
    stem: "During a mass casualty incident, patients are moved through treatment areas. The correct order of patient flow is:",
    options: [
      "Triage → Treatment → Transport",
      "Treatment → Triage → Transport",
      "Transport → Triage → Treatment",
      "Triage → Transport → Treatment"
    ],
    correctIndex: 0,
    rationale: "The standard MCI patient flow is Triage → Treatment → Transport. Patients are first triaged (sorted by severity), then moved to treatment areas organized by acuity (RED/YELLOW/GREEN), and finally transported to appropriate receiving facilities. This systematic flow ensures the most critical patients are identified and treated first while maintaining organized scene management.",
    difficulty: 2,
    category: "Mass Casualty Incidents",
    topic: "MCI Operations"
  },
  {
    id: "para-mci-011",
    stem: "At a building collapse MCI, you have 3 RED patients, 8 YELLOW patients, and 15 GREEN patients. Two ambulances are available. Which patients should be transported first?",
    options: [
      "GREEN patients because there are the most of them",
      "RED patients to the nearest appropriate facility",
      "YELLOW patients because they outnumber RED patients",
      "All patients simultaneously using both ambulances"
    ],
    correctIndex: 1,
    rationale: "RED (Immediate) patients have the highest transport priority because they have life-threatening conditions that require immediate hospital intervention. They should go to the nearest appropriate facility (typically the closest trauma center). YELLOW patients are stable enough to wait. GREEN patients have minor injuries. Transport priority follows the triage categories: RED first, then YELLOW, then GREEN.",
    difficulty: 2,
    category: "Mass Casualty Incidents",
    topic: "MCI Transport"
  },
  {
    id: "para-mci-012",
    stem: "The SALT triage system (Sort, Assess, Lifesaving interventions, Treatment/Transport) adds which category not found in standard START triage?",
    options: [
      "GRAY (Unknown)",
      "ORANGE (Urgent)",
      "EXPECTANT (likely to die given available resources)",
      "BLUE (Psychiatric)"
    ],
    correctIndex: 2,
    rationale: "SALT triage adds an EXPECTANT category (gray tag in some systems) separate from DEAD. EXPECTANT patients are alive but have injuries incompatible with survival given the current resources. This differs from START where BLACK includes both dead and expectant. SALT also allows brief lifesaving interventions (controlling hemorrhage, opening airways) during the assessment phase.",
    difficulty: 4,
    category: "Mass Casualty Incidents",
    topic: "SALT Triage"
  },
  {
    id: "para-mci-013",
    stem: "You respond to a shooting at a public venue. Law enforcement has not yet secured the scene. As EMS, you should:",
    options: [
      "Enter the scene wearing body armor to begin treating victims",
      "Stage in a safe location until law enforcement declares the scene secure, then move to a warm zone for casualty collection",
      "Begin treating patients in the parking lot only",
      "Refuse to respond until a SWAT team is deployed"
    ],
    correctIndex: 1,
    rationale: "In active shooter/hostile events, EMS stages in a safe location until law enforcement secures the area or establishes warm zones. Under Rescue Task Force (RTF) concepts, EMS may enter warm zones with law enforcement escort wearing ballistic protection to provide hemorrhage control and rapid extraction. EMS never enters unsecured hot zones. Staging is proactive positioning, not refusal to respond.",
    difficulty: 3,
    category: "Scene Safety & Triage",
    topic: "Active Shooter/Hostile Events"
  },
  {
    id: "para-mci-014",
    stem: "In a Rescue Task Force (RTF) operation during an active threat event, the primary medical intervention performed is:",
    options: [
      "Full patient assessment and IV fluid resuscitation",
      "Hemorrhage control with tourniquets and wound packing, followed by rapid extraction",
      "Endotracheal intubation and advanced airway management",
      "Cardiac monitoring and 12-lead ECG interpretation"
    ],
    correctIndex: 1,
    rationale: "RTF operations prioritize rapid hemorrhage control (tourniquets, wound packing, chest seals) and immediate extraction to the cold zone for further treatment. The MARCH algorithm (Massive hemorrhage, Airway, Respirations, Circulation, Hypothermia) guides care. Extended assessment and advanced interventions are deferred until patients reach the treatment area in the cold zone.",
    difficulty: 3,
    category: "Scene Safety & Triage",
    topic: "Tactical EMS"
  },
  {
    id: "para-mci-015",
    stem: "During a structural collapse, a rescue team reports the building is unstable and secondary collapse is imminent. The Incident Commander should:",
    options: [
      "Order all personnel to continue rescue operations quickly",
      "Withdraw all personnel from the collapse zone and reassess structural stability",
      "Send additional teams to speed up the rescue effort",
      "Allow only paramedics to remain in the structure"
    ],
    correctIndex: 1,
    rationale: "When secondary collapse is imminent, the Incident Commander must prioritize rescuer safety by withdrawing all personnel from the danger zone. Rescuer safety always takes precedence — dead rescuers cannot help anyone. The structure must be reassessed by structural engineers or technical rescue specialists before operations resume. Sending more people into a collapsing structure compounds the disaster.",
    difficulty: 3,
    category: "Scene Safety & Triage",
    topic: "Structural Collapse Safety"
  },
  {
    id: "para-mci-016",
    stem: "An MCI has been declared at a train derailment. The first-arriving paramedic should assume which ICS role?",
    options: [
      "Operations Section Chief",
      "Incident Commander until relieved by a higher authority",
      "Safety Officer",
      "Triage Officer"
    ],
    correctIndex: 1,
    rationale: "The first-arriving emergency responder at any incident automatically assumes the role of Incident Commander until formally relieved by someone of higher authority or more training through the transfer of command process. This ensures there is always someone in charge. The IC then assigns additional roles (Safety, Operations, Triage) as resources arrive.",
    difficulty: 2,
    category: "Mass Casualty Incidents",
    topic: "Incident Command System"
  },
  {
    id: "para-mci-017",
    stem: "During triage at a multi-vehicle collision, a patient has no radial pulse but has a carotid pulse. Using START triage, this indicates:",
    options: [
      "The patient should be tagged GREEN",
      "The patient should be tagged YELLOW",
      "The patient should be tagged RED due to perfusion compromise",
      "The patient should be tagged BLACK"
    ],
    correctIndex: 2,
    rationale: "In START triage, the perfusion step uses the presence or absence of a radial pulse (or capillary refill >2 seconds in some versions). Absent radial pulse with present carotid pulse indicates significant hypotension (SBP approximately <80 mmHg), classifying the patient as RED (Immediate) regardless of respiratory rate or mental status findings.",
    difficulty: 3,
    category: "Mass Casualty Incidents",
    topic: "START Triage"
  },
  {
    id: "para-mci-018",
    stem: "Which of the following is a secondary device concern at a bombing incident that should influence EMS staging?",
    options: [
      "The possibility of a second explosive device targeting first responders",
      "The risk of structural collapse from the initial blast",
      "The presence of shrapnel in the blast zone",
      "The potential for chemical contamination from building materials"
    ],
    correctIndex: 0,
    rationale: "A secondary device is an additional explosive specifically placed to target first responders who arrive after the initial blast. This is a deliberate tactic used in terrorist attacks. EMS must stage at a safe distance, approach cautiously, and work with law enforcement bomb disposal units. While structural collapse and contamination are valid concerns, the secondary device threat specifically targets rescuers.",
    difficulty: 4,
    category: "Scene Safety & Triage",
    topic: "Bombing/Blast Incidents"
  },
  {
    id: "para-mci-019",
    stem: "During an MCI, the term 'surge capacity' refers to:",
    options: [
      "The maximum speed at which ambulances can respond",
      "The ability of healthcare systems to expand beyond normal capacity to handle a sudden influx of patients",
      "The electrical capacity of backup generators at hospitals",
      "The number of trauma surgeons available on any given day"
    ],
    correctIndex: 1,
    rationale: "Surge capacity is the ability of a healthcare system to rapidly expand beyond its normal operating capacity to meet a sudden, unexpected increase in patient volume. This includes expanding bed capacity, calling in additional staff, opening overflow treatment areas, and coordinating patient distribution across multiple facilities. Effective surge planning is critical for MCI preparedness.",
    difficulty: 3,
    category: "Mass Casualty Incidents",
    topic: "MCI Preparedness"
  },
  {
    id: "para-mci-020",
    stem: "A paramedic arrives at a scene where a delivery truck has overturned, and a placard with a number '1017' and a green diamond is visible. This indicates:",
    options: [
      "Flammable liquid",
      "Non-flammable compressed gas (chlorine)",
      "Radioactive material",
      "Oxidizer"
    ],
    correctIndex: 1,
    rationale: "UN number 1017 identifies chlorine gas. The green diamond placard indicates non-flammable gas (Class 2.2), though chlorine is actually toxic and corrosive. Paramedics should reference the Emergency Response Guidebook (ERG) for specific hazard information, recommended isolation distances, and protective actions. Chlorine is a pulmonary irritant that can cause severe respiratory injury.",
    difficulty: 4,
    category: "Scene Safety & Triage",
    topic: "HazMat Identification"
  },
  {
    id: "para-mci-021",
    stem: "The Emergency Response Guidebook (ERG) is used by first responders to:",
    options: [
      "Determine the specific chemical composition of unknown substances",
      "Identify hazardous materials and determine initial isolation and protective action distances",
      "Provide definitive decontamination protocols for all chemicals",
      "Replace the need for HazMat team response"
    ],
    correctIndex: 1,
    rationale: "The ERG is designed for first responder use during the initial phase of a HazMat incident. It helps identify substances by UN number, placard, or container shape and provides initial isolation distances and protective action recommendations. It does not provide definitive chemical identification or replace specialized HazMat teams — it guides initial response actions only.",
    difficulty: 2,
    category: "Scene Safety & Triage",
    topic: "HazMat Identification"
  },
  {
    id: "para-mci-022",
    stem: "You are triaging patients after a tornado. A 7-year-old child is not walking, has respirations at 24/min, a palpable radial pulse, but does not follow commands (only withdraws to pain). Using START triage, this patient is tagged:",
    options: [
      "GREEN",
      "YELLOW",
      "RED",
      "BLACK"
    ],
    correctIndex: 2,
    rationale: "Following START triage: respirations are present and under 30 (pass), perfusion shows a radial pulse present (pass), but mental status assessment shows the patient does not follow simple commands (fail). Any failed step results in a RED tag. The inability to follow commands indicates altered mental status requiring immediate medical attention.",
    difficulty: 3,
    category: "Mass Casualty Incidents",
    topic: "START Triage"
  },
  {
    id: "para-mci-023",
    stem: "In an MCI, the process of distributing patients across multiple hospitals based on each facility's capacity and capabilities is called:",
    options: [
      "Patient tracking",
      "Hospital notification",
      "Patient distribution (destination determination)",
      "Medical surge activation"
    ],
    correctIndex: 2,
    rationale: "Patient distribution involves sending patients to appropriate receiving facilities based on injury type, severity, hospital capacity, and specialty capabilities. Overwhelming a single hospital ('convergence') degrades care for everyone. The Transport Officer coordinates with hospitals and the local emergency management system to balance patient loads across the healthcare system.",
    difficulty: 3,
    category: "Mass Casualty Incidents",
    topic: "MCI Transport"
  },
  {
    id: "para-mci-024",
    stem: "When establishing a decontamination corridor at a HazMat incident, the corridor should be positioned:",
    options: [
      "Inside the hot zone for immediate access",
      "Between the hot zone and cold zone (in the warm zone), with runoff collection",
      "In the cold zone near the ambulances",
      "Downwind from the release to catch airborne contaminants"
    ],
    correctIndex: 1,
    rationale: "The decontamination corridor is established in the warm zone (contamination reduction zone), positioned between the hot zone and cold zone. It must include runoff collection to prevent environmental contamination. Patients move through decon before entering the clean cold zone. Positioning downwind would expose decon personnel to airborne contaminants.",
    difficulty: 3,
    category: "Scene Safety & Triage",
    topic: "HazMat Decontamination"
  },
  {
    id: "para-mci-025",
    stem: "A paramedic on a HazMat team is donning Level A PPE. This level of protection is characterized by:",
    options: [
      "Splash-resistant suit with air-purifying respirator",
      "Fully encapsulated, vapor-tight suit with self-contained breathing apparatus (SCBA)",
      "Structural firefighting gear with SCBA",
      "Standard uniform with N95 respirator and gloves"
    ],
    correctIndex: 1,
    rationale: "Level A PPE provides the highest level of protection: a fully encapsulated, vapor-tight chemical-resistant suit with self-contained breathing apparatus (SCBA). It protects against unknown or highly toxic chemical vapors, gases, and particles. Level B has SCBA but splash-only suit. Level C uses air-purifying respirators. Level D is standard work uniform.",
    difficulty: 3,
    category: "Scene Safety & Triage",
    topic: "Personal Protective Equipment"
  },
  {
    id: "para-mci-026",
    stem: "You respond to a report of multiple patients with sudden onset of pinpoint pupils, excessive secretions, muscle fasciculations, and seizures at a subway station. You should suspect:",
    options: [
      "Carbon monoxide exposure",
      "Nerve agent (organophosphate) attack",
      "Opioid mass overdose",
      "Chlorine gas release"
    ],
    correctIndex: 1,
    rationale: "The combination of miosis (pinpoint pupils), excessive secretions (SLUDGE: Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis), fasciculations, and seizures in multiple patients at a public venue strongly suggests a nerve agent (organophosphate) attack. Opioids cause miosis and respiratory depression but not fasciculations or excessive secretions. CO causes headache and AMS. Chlorine causes respiratory irritation.",
    difficulty: 4,
    category: "Scene Safety & Triage",
    topic: "WMD/CBRNE"
  },
  {
    id: "para-mci-027",
    stem: "The Mark I or DuoDote autoinjector kit used for nerve agent exposure contains:",
    options: [
      "Epinephrine and diphenhydramine",
      "Atropine and pralidoxime (2-PAM)",
      "Naloxone and flumazenil",
      "Diazepam and midazolam"
    ],
    correctIndex: 1,
    rationale: "The DuoDote (previously Mark I kit) contains atropine (blocks muscarinic effects of acetylcholine accumulation — secretions, bradycardia, bronchospasm) and pralidoxime/2-PAM (reactivates acetylcholinesterase if administered before the enzyme 'ages'). Diazepam is carried separately for seizure control. This combination is the standard antidote for nerve agent/organophosphate exposure.",
    difficulty: 3,
    category: "Scene Safety & Triage",
    topic: "WMD/CBRNE"
  },
  {
    id: "para-mci-028",
    stem: "During a biological agent exposure incident, the incubation period for most biological weapons means that:",
    options: [
      "All exposed patients will present to EMS within the first hour",
      "Patients may not show symptoms for days to weeks after exposure, making initial detection difficult",
      "Decontamination is unnecessary since biological agents are not contagious",
      "Standard PPE is sufficient for all biological agents"
    ],
    correctIndex: 1,
    rationale: "Biological agents (anthrax, smallpox, plague, botulism) have incubation periods ranging from days to weeks. Unlike chemical attacks with immediate symptoms, biological attacks may not be recognized until multiple patients present to emergency departments with similar unusual illness patterns. This delayed presentation makes initial detection extremely challenging. Some agents are contagious (smallpox, plague) requiring enhanced PPE.",
    difficulty: 4,
    category: "Scene Safety & Triage",
    topic: "WMD/CBRNE"
  },
  {
    id: "para-mci-029",
    stem: "At a mass casualty incident involving 20+ patients, a single paramedic should spend no more than how long assessing each patient during initial triage?",
    options: [
      "30 seconds",
      "60 seconds",
      "5 minutes",
      "10 minutes"
    ],
    correctIndex: 0,
    rationale: "During START triage, each patient assessment should take no more than 30 seconds. The entire process involves checking breathing (open airway if needed), perfusion (radial pulse or capillary refill), and mental status (follows commands). This rapid assessment enables one responder to triage many patients quickly, which is the fundamental purpose of MCI triage systems.",
    difficulty: 2,
    category: "Mass Casualty Incidents",
    topic: "START Triage"
  },
  {
    id: "para-mci-030",
    stem: "In a mass casualty incident, 'walking wounded' patients tagged GREEN should be:",
    options: [
      "Ignored until all RED and YELLOW patients are treated and transported",
      "Directed to a designated minor treatment area, reassessed periodically, and transported last",
      "Released from the scene without medical evaluation",
      "Transported to the hospital immediately to clear the scene"
    ],
    correctIndex: 1,
    rationale: "GREEN-tagged patients have minor injuries but still require medical evaluation, periodic reassessment (conditions can deteriorate), and eventual transport. They should be directed to a designated minor treatment area where they can be monitored. They should not be ignored entirely (injuries may worsen) or released without evaluation (missed injuries, medicolegal concerns). They are transported after RED and YELLOW patients.",
    difficulty: 2,
    category: "Mass Casualty Incidents",
    topic: "MCI Operations"
  },
  {
    id: "para-mci-031",
    stem: "A paramedic is operating at an MCI and identifies that an arriving crew is self-dispatching without checking in. The appropriate action is to:",
    options: [
      "Allow them to begin treating patients immediately",
      "Direct them to check in with the Staging Area Manager for accountability and assignment",
      "Send them to the closest hospital to prepare for patient arrivals",
      "Assign them as the new Incident Commander"
    ],
    correctIndex: 1,
    rationale: "All arriving resources must check in at the staging area for accountability and receive assignments through the ICS structure. Self-dispatching crews who bypass check-in create accountability gaps (we don't know they're on scene), may duplicate efforts, and can compromise scene safety. The Staging Area Manager controls resource deployment under the Operations Section.",
    difficulty: 3,
    category: "Mass Casualty Incidents",
    topic: "Incident Command System"
  },
  {
    id: "para-mci-032",
    stem: "You respond to a highway incident where a tanker truck has overturned. No placard is visible, but a strong chemical odor is present and multiple bystanders are coughing and have watery eyes. The minimum initial isolation distance according to the ERG for an unknown substance is:",
    options: [
      "100 feet (30 meters)",
      "330 feet (100 meters)",
      "1,000 feet (300 meters)",
      "1 mile (1.6 km)"
    ],
    correctIndex: 1,
    rationale: "The Emergency Response Guidebook recommends an initial isolation distance of at least 330 feet (100 meters) in all directions for unknown hazardous materials. This distance should be increased based on the specific material identified, wind conditions, and topography. When the substance is unknown and symptomatic patients are present, err on the side of greater distance until the material is identified.",
    difficulty: 3,
    category: "Scene Safety & Triage",
    topic: "HazMat Scene Management"
  },
  {
    id: "para-mci-033",
    stem: "The 'all-hazards' approach to emergency preparedness means:",
    options: [
      "Only preparing for the most common type of disaster in your area",
      "Developing a single comprehensive plan that can be adapted to any type of emergency or disaster",
      "Having separate, unrelated plans for each possible hazard",
      "Focusing exclusively on natural disasters"
    ],
    correctIndex: 1,
    rationale: "The all-hazards approach develops a core emergency plan with common elements (incident command, communication, resource management, patient care) that can be adapted to any incident type — natural disasters, technological accidents, terrorism, or disease outbreaks. This is more efficient than maintaining separate plans and ensures baseline competency for any event.",
    difficulty: 2,
    category: "Mass Casualty Incidents",
    topic: "MCI Preparedness"
  },
  {
    id: "para-mci-034",
    stem: "During a radiation exposure incident, the principle of ALARA refers to:",
    options: [
      "A type of radiation detection equipment",
      "As Low As Reasonably Achievable — minimizing radiation exposure through time, distance, and shielding",
      "A specific decontamination protocol for irradiated patients",
      "A radiation dose threshold requiring immediate medical treatment"
    ],
    correctIndex: 1,
    rationale: "ALARA (As Low As Reasonably Achievable) is the guiding principle for radiation safety. Exposure is minimized through three strategies: reducing TIME near the source, increasing DISTANCE from the source, and using SHIELDING (lead, concrete). Rescuers should limit exposure time, work at maximum practical distance, and use available shielding materials.",
    difficulty: 3,
    category: "Scene Safety & Triage",
    topic: "Radiation Emergencies"
  },
  {
    id: "para-mci-035",
    stem: "When treating a patient with external radioactive contamination (radioactive material on skin/clothing), the paramedic should:",
    options: [
      "Refuse to treat the patient until a radiation specialist arrives",
      "Remove the patient's clothing (removes ~90% of contamination), double-bag it, and provide standard medical care with universal precautions",
      "Delay all medical treatment until decontamination is complete",
      "Transport the patient without any decontamination"
    ],
    correctIndex: 1,
    rationale: "External contamination is managed by removing clothing (which eliminates approximately 90% of surface contamination), placing contaminated items in sealed bags, and providing normal medical care using universal precautions (gloves, gown). Externally contaminated patients do NOT pose a significant radiation risk to providers with standard PPE. Life-saving treatment should never be delayed for decontamination.",
    difficulty: 4,
    category: "Scene Safety & Triage",
    topic: "Radiation Emergencies"
  },
  {
    id: "para-mci-036",
    stem: "You arrive at a scene where a patient is trapped in a vehicle with downed power lines across the car. The patient appears conscious. You should:",
    options: [
      "Use rubber gloves to move the power lines off the vehicle",
      "Instruct the patient to stay in the vehicle, establish a safe perimeter, and wait for the power company to de-energize the lines",
      "Use a wooden pole to push the power lines away",
      "Have the patient jump from the vehicle while you watch"
    ],
    correctIndex: 1,
    rationale: "Downed power lines create an extreme electrocution hazard. The ground around the vehicle may be energized. The correct action is to establish a perimeter (at least 35 feet), instruct the patient to remain in the vehicle (they are safe inside the Faraday cage), and wait for the power company to confirm de-energization. No improvised tools (wood, rubber) are safe for moving high-voltage lines.",
    difficulty: 2,
    category: "Scene Safety & Triage",
    topic: "Electrical Hazards"
  },
  {
    id: "para-mci-037",
    stem: "In a multiple-patient incident, the concept of 'undertriage' means:",
    options: [
      "Assigning a patient a lower triage category than their actual condition warrants",
      "Assigning a patient a higher triage category than their actual condition warrants",
      "Not having enough triage tags available",
      "Triaging patients too quickly"
    ],
    correctIndex: 0,
    rationale: "Undertriage means classifying a patient as less severe than they actually are (e.g., tagging a RED patient as YELLOW). This is dangerous because the patient may not receive timely treatment. Overtriage (assigning a higher category than needed) wastes resources but is considered safer than undertriage. An acceptable overtriage rate is up to 50%, while undertriage should be less than 5%.",
    difficulty: 3,
    category: "Mass Casualty Incidents",
    topic: "Triage Principles"
  },
  {
    id: "para-mci-038",
    stem: "A paramedic responding to a domestic disturbance is met at the door by an aggressive individual holding a weapon. The MOST appropriate action is:",
    options: [
      "Attempt to disarm the individual using defensive tactics",
      "Retreat to a safe position and request law enforcement assistance",
      "Enter the home to check on the reported patient",
      "Use verbal de-escalation while moving closer to assess the patient"
    ],
    correctIndex: 1,
    rationale: "Scene safety is the first priority. When faced with an armed, aggressive individual, the paramedic must retreat to a safe position (behind the ambulance or other cover) and request law enforcement. EMS providers are not trained or equipped for weapons encounters. Entering the scene or approaching the individual puts the paramedic at risk of becoming an additional patient.",
    difficulty: 2,
    category: "Scene Safety & Triage",
    topic: "Scene Safety"
  },
  {
    id: "para-mci-039",
    stem: "The Unified Command structure in ICS is used when:",
    options: [
      "Only one agency responds to an incident",
      "Multiple agencies with jurisdictional authority share incident management responsibilities",
      "The Incident Commander needs a deputy",
      "The incident is small enough for a single command structure"
    ],
    correctIndex: 1,
    rationale: "Unified Command is established when multiple agencies have jurisdictional authority or functional responsibility for the incident (e.g., fire, EMS, law enforcement at a mass casualty event with a criminal component). Agency representatives work together to establish common objectives, strategies, and a single Incident Action Plan while maintaining their agency's authority.",
    difficulty: 3,
    category: "Mass Casualty Incidents",
    topic: "Incident Command System"
  },
  {
    id: "para-mci-040",
    stem: "During a pandemic response, 'crisis standards of care' allow EMS to:",
    options: [
      "Provide care identical to normal operations regardless of resource availability",
      "Modify treatment protocols and transport decisions when resources are overwhelmed, focusing on saving the most lives possible",
      "Refuse to respond to any calls",
      "Only treat patients with confirmed diagnoses"
    ],
    correctIndex: 1,
    rationale: "Crisis standards of care are activated when healthcare resources are overwhelmed during disasters or pandemics. They permit modifications to normal care standards — such as altered triage criteria, adjusted transport protocols, and modified treatment guidelines — to maximize the number of lives saved with limited resources. These decisions are made at the system level, not by individual providers.",
    difficulty: 4,
    category: "Mass Casualty Incidents",
    topic: "Disaster Medicine"
  },
  {
    id: "para-ecg-001",
    stem: "A 12-lead ECG shows ST elevation in leads V1-V4. This pattern is most consistent with:",
    options: [
      "Inferior wall STEMI",
      "Anterior wall STEMI",
      "Lateral wall STEMI",
      "Posterior wall STEMI"
    ],
    correctIndex: 1,
    rationale: "ST elevation in leads V1-V4 (precordial leads) indicates an anterior wall STEMI, typically caused by occlusion of the left anterior descending (LAD) artery. Inferior STEMI shows changes in II, III, aVF. Lateral STEMI shows changes in I, aVL, V5-V6. Posterior MI shows ST depression in V1-V3 with ST elevation in V7-V9.",
    difficulty: 2,
    category: "ECG Interpretation",
    topic: "STEMI Recognition"
  },
  {
    id: "para-ecg-002",
    stem: "A patient's ECG shows a regular rhythm at 150 bpm with no discernible P waves and narrow QRS complexes. The most likely rhythm is:",
    options: [
      "Sinus tachycardia",
      "Atrial flutter with 2:1 conduction",
      "Ventricular tachycardia",
      "Atrial fibrillation"
    ],
    correctIndex: 1,
    rationale: "A regular narrow-complex tachycardia at exactly 150 bpm should always raise suspicion for atrial flutter with 2:1 conduction block. The atrial rate in flutter is typically 300/min, and with 2:1 block, the ventricular rate is 150. Flutter waves (sawtooth pattern) may be hidden in the QRS or T waves. Sinus tachycardia would show P waves. VT has wide QRS. A-fib is irregularly irregular.",
    difficulty: 3,
    category: "ECG Interpretation",
    topic: "Atrial Dysrhythmias"
  },
  {
    id: "para-ecg-003",
    stem: "A patient's ECG shows an irregularly irregular rhythm with no discernible P waves, varying R-R intervals, and narrow QRS complexes. The rate is approximately 110 bpm. This rhythm is:",
    options: [
      "Multifocal atrial tachycardia",
      "Atrial fibrillation with rapid ventricular response",
      "Atrial flutter with variable block",
      "Wandering atrial pacemaker"
    ],
    correctIndex: 1,
    rationale: "Atrial fibrillation is characterized by an irregularly irregular rhythm with no identifiable P waves (replaced by fibrillatory waves), variable R-R intervals, and typically narrow QRS complexes. A rate >100 bpm constitutes rapid ventricular response (RVR). MAT has at least 3 different P-wave morphologies. Flutter has a sawtooth pattern. Wandering pacemaker has a rate <100.",
    difficulty: 2,
    category: "ECG Interpretation",
    topic: "Atrial Dysrhythmias"
  },
  {
    id: "para-ecg-004",
    stem: "An ECG shows a wide-complex tachycardia at 180 bpm with AV dissociation. This rhythm is most likely:",
    options: [
      "SVT with aberrant conduction",
      "Atrial fibrillation with WPW",
      "Ventricular tachycardia",
      "Torsades de Pointes"
    ],
    correctIndex: 2,
    rationale: "AV dissociation (P waves and QRS complexes occurring independently) is a hallmark finding of ventricular tachycardia. Other VT indicators include capture beats, fusion beats, concordance in precordial leads, and QRS >0.14 seconds. SVT with aberrancy maintains 1:1 AV relationship. Torsades has a characteristic undulating axis. When in doubt, treat wide-complex tachycardia as VT.",
    difficulty: 4,
    category: "ECG Interpretation",
    topic: "Ventricular Dysrhythmias"
  },
  {
    id: "para-ecg-005",
    stem: "A patient's ECG shows a regular rhythm at 40 bpm. P waves are present but bear no consistent relationship to QRS complexes. The QRS is wide (0.16 seconds). This is:",
    options: [
      "First-degree AV block",
      "Second-degree AV block Type I (Wenckebach)",
      "Second-degree AV block Type II",
      "Third-degree (complete) AV block"
    ],
    correctIndex: 3,
    rationale: "Third-degree (complete) heart block shows complete AV dissociation: P waves fire at one rate (atrial rate) and QRS complexes fire independently at a slower rate (ventricular escape rate). No P waves are conducted to the ventricles. A wide QRS (>0.12s) suggests the escape rhythm originates below the Bundle of His (ventricular escape at 20-40 bpm), which is less reliable and more dangerous than a junctional escape.",
    difficulty: 3,
    category: "ECG Interpretation",
    topic: "Heart Blocks"
  },
  {
    id: "para-ecg-006",
    stem: "An ECG shows progressively lengthening PR intervals until a QRS complex is dropped, then the pattern repeats. This rhythm is:",
    options: [
      "First-degree AV block",
      "Second-degree AV block Type I (Wenckebach)",
      "Second-degree AV block Type II (Mobitz II)",
      "Third-degree AV block"
    ],
    correctIndex: 1,
    rationale: "Second-degree AV block Type I (Wenckebach) is characterized by progressive PR interval prolongation until a P wave is not conducted (dropped QRS), followed by a shorter PR interval and repetition of the cycle. It typically occurs at the level of the AV node and is usually benign. Type II shows constant PR intervals with sudden dropped beats and is more dangerous.",
    difficulty: 2,
    category: "ECG Interpretation",
    topic: "Heart Blocks"
  },
  {
    id: "para-ecg-007",
    stem: "On a 12-lead ECG, reciprocal changes are defined as:",
    options: [
      "ST elevation in all 12 leads",
      "ST depression in leads opposite (electrically) to those showing ST elevation",
      "Identical ST changes in all leads",
      "T-wave inversion in all precordial leads"
    ],
    correctIndex: 1,
    rationale: "Reciprocal changes are ST depression in leads that view the heart from the opposite side of the infarction. For example, an inferior STEMI (ST elevation in II, III, aVF) typically shows reciprocal ST depression in the lateral leads (I, aVL). Reciprocal changes increase the diagnostic specificity for acute MI and help differentiate STEMI from other causes of ST elevation such as pericarditis.",
    difficulty: 3,
    category: "ECG Interpretation",
    topic: "STEMI Recognition"
  },
  {
    id: "para-ecg-008",
    stem: "A patient presents with chest pain and an ECG showing diffuse ST elevation in multiple vascular territories with PR depression. This pattern is most consistent with:",
    options: [
      "Multi-vessel STEMI",
      "Acute pericarditis",
      "Left ventricular hypertrophy",
      "Brugada syndrome"
    ],
    correctIndex: 1,
    rationale: "Diffuse (non-territorial) ST elevation with PR segment depression is the hallmark ECG pattern of acute pericarditis. STEMI shows ST elevation in a specific vascular territory with reciprocal changes. Pericarditis affects the entire pericardium, producing widespread changes. PR depression occurs due to atrial inflammation. LVH causes ST changes in lateral leads. Brugada shows a specific pattern in V1-V3.",
    difficulty: 4,
    category: "ECG Interpretation",
    topic: "ST Segment Analysis"
  },
  {
    id: "para-ecg-009",
    stem: "A patient's ECG shows tall, peaked, symmetrical T waves in precordial leads with a narrow base. The QRS appears slightly widened. You should suspect:",
    options: [
      "Acute anterior MI",
      "Hyperkalemia",
      "Hypothermia",
      "Digitalis effect"
    ],
    correctIndex: 1,
    rationale: "Tall, peaked, symmetrical T waves (often called 'tented T waves') with QRS widening are classic early ECG signs of hyperkalemia. As potassium levels rise further, P waves flatten, PR prolongs, QRS widens further, and eventually a sine wave pattern develops before cardiac arrest. Hyperacute T waves in MI are broader. Hypothermia shows Osborn (J) waves. Digitalis causes 'scooped' ST segments.",
    difficulty: 3,
    category: "ECG Interpretation",
    topic: "Electrolyte Abnormalities"
  },
  {
    id: "para-ecg-010",
    stem: "Torsades de Pointes on ECG is characterized by:",
    options: [
      "Regular wide-complex tachycardia with uniform QRS morphology",
      "Polymorphic ventricular tachycardia with QRS complexes that appear to twist around the baseline, associated with prolonged QT interval",
      "Narrow-complex tachycardia with saw-tooth pattern",
      "Complete absence of organized electrical activity"
    ],
    correctIndex: 1,
    rationale: "Torsades de Pointes ('twisting of the points') is a specific form of polymorphic VT associated with a prolonged QT interval. The QRS complexes gradually change in amplitude and axis, creating a characteristic undulating or 'twisting' appearance. Treatment is IV magnesium sulfate 1-2g. Unlike monomorphic VT, amiodarone and procainamide (which prolong QT) should be avoided.",
    difficulty: 3,
    category: "ECG Interpretation",
    topic: "Ventricular Dysrhythmias"
  },
  {
    id: "para-ecg-011",
    stem: "An ECG shows ST elevation in leads II, III, and aVF with ST depression in lead I and aVL. Which coronary artery is most likely occluded?",
    options: [
      "Left anterior descending (LAD)",
      "Left circumflex (LCx)",
      "Right coronary artery (RCA)",
      "Left main coronary artery"
    ],
    correctIndex: 2,
    rationale: "ST elevation in inferior leads (II, III, aVF) with reciprocal depression in lateral leads (I, aVL) indicates inferior STEMI, most commonly caused by right coronary artery (RCA) occlusion (~85% of cases). The RCA supplies the inferior wall in most patients. LAD occlusion causes anterior MI. LCx can cause inferior MI in left-dominant circulation (~15% of cases).",
    difficulty: 3,
    category: "ECG Interpretation",
    topic: "Coronary Artery Anatomy"
  },
  {
    id: "para-ecg-012",
    stem: "A 12-lead ECG shows ST elevation in I, aVL, V5, and V6. This pattern indicates:",
    options: [
      "Anterior STEMI",
      "Inferior STEMI",
      "Lateral STEMI",
      "Right ventricular MI"
    ],
    correctIndex: 2,
    rationale: "ST elevation in leads I, aVL, V5, and V6 represents a lateral wall STEMI, typically caused by occlusion of the left circumflex artery or a diagonal branch of the LAD. The lateral wall is viewed by these leads. Anterior = V1-V4, Inferior = II, III, aVF, RV MI = right-sided precordial leads (V4R).",
    difficulty: 2,
    category: "ECG Interpretation",
    topic: "STEMI Recognition"
  },
  {
    id: "para-ecg-013",
    stem: "When a patient with an inferior STEMI becomes bradycardic and hypotensive, the paramedic should also obtain which additional lead?",
    options: [
      "V7 (posterior lead)",
      "V4R (right-sided lead)",
      "Lead aVR",
      "Modified Lewis lead"
    ],
    correctIndex: 1,
    rationale: "Inferior STEMI with bradycardia and hypotension suggests right ventricular involvement. A right-sided V4R lead should be obtained — ST elevation ≥1mm in V4R is highly specific for RV MI. This is clinically important because RV MI patients are preload-dependent: nitroglycerin and morphine (which reduce preload) can cause severe hypotension. Treatment is IV fluid bolus.",
    difficulty: 4,
    category: "ECG Interpretation",
    topic: "Right Ventricular MI"
  },
  {
    id: "para-ecg-014",
    stem: "A patient's ECG shows a regular rhythm at 72 bpm with a PR interval of 0.28 seconds. All P waves are followed by QRS complexes. This represents:",
    options: [
      "Normal sinus rhythm",
      "First-degree AV block",
      "Second-degree AV block Type I",
      "Junctional rhythm"
    ],
    correctIndex: 1,
    rationale: "First-degree AV block is defined by a PR interval >0.20 seconds (>5 small boxes) with all P waves conducted to the ventricles (1:1 relationship). The rhythm and rate are otherwise normal. At 0.28 seconds, this PR interval is prolonged, indicating delayed conduction through the AV node. First-degree block is usually benign and may not require treatment.",
    difficulty: 1,
    category: "ECG Interpretation",
    topic: "Heart Blocks"
  },
  {
    id: "para-ecg-015",
    stem: "A patient presents with palpitations. The ECG shows a regular narrow-complex tachycardia at 200 bpm with retrograde P waves visible after the QRS complex. This is most likely:",
    options: [
      "Sinus tachycardia",
      "Atrial flutter",
      "AV nodal reentrant tachycardia (AVNRT)",
      "Ventricular tachycardia"
    ],
    correctIndex: 2,
    rationale: "AVNRT is the most common cause of paroxysmal SVT. It is characterized by a regular, narrow-complex tachycardia (typically 150-250 bpm) with retrograde P waves (inverted in inferior leads) occurring just after or buried within the QRS complex. A reentrant circuit within or near the AV node sustains the tachycardia. Treatment: vagal maneuvers, then adenosine.",
    difficulty: 4,
    category: "ECG Interpretation",
    topic: "Supraventricular Tachycardia"
  },
  {
    id: "para-ecg-016",
    stem: "Wellens syndrome on ECG is characterized by:",
    options: [
      "ST elevation in V1-V3 with right bundle branch block pattern",
      "Deep, symmetrical T-wave inversions or biphasic T waves in V2-V3 during a pain-free interval",
      "Peaked T waves with widened QRS",
      "Diffuse ST depression with ST elevation in aVR"
    ],
    correctIndex: 1,
    rationale: "Wellens syndrome indicates critical stenosis of the proximal LAD artery. It shows deep, symmetrical T-wave inversions (Type A) or biphasic T waves with initial positivity then deep inversion (Type B) in V2-V3, typically during a pain-free interval. These patients are at very high risk for anterior wall MI and need urgent cardiac catheterization. Stress testing is contraindicated.",
    difficulty: 5,
    category: "ECG Interpretation",
    topic: "Critical ECG Patterns"
  },
  {
    id: "para-ecg-017",
    stem: "A patient with a pacemaker has an ECG showing pacer spikes not followed by QRS complexes. This is called:",
    options: [
      "Failure to sense",
      "Failure to capture",
      "Failure to pace",
      "Normal pacemaker function"
    ],
    correctIndex: 1,
    rationale: "Failure to capture occurs when the pacemaker fires (visible pacing spike) but fails to depolarize the myocardium (no QRS following the spike). Causes include lead displacement, increased pacing threshold, battery depletion, or electrolyte imbalances. Failure to sense means the pacemaker doesn't detect intrinsic cardiac activity. Failure to pace means no spikes are generated.",
    difficulty: 3,
    category: "ECG Interpretation",
    topic: "Pacemaker Rhythms"
  },
  {
    id: "para-ecg-018",
    stem: "An ECG shows a rhythm with no P waves, a narrow QRS complex, and a regular rate of 50 bpm. This is most likely:",
    options: [
      "Sinus bradycardia",
      "Junctional escape rhythm",
      "Idioventricular rhythm",
      "Second-degree AV block"
    ],
    correctIndex: 1,
    rationale: "A junctional escape rhythm originates from the AV junction and has a rate of 40-60 bpm, narrow QRS complexes, and absent or retrograde P waves (inverted in inferior leads, may be before, during, or after QRS). The AV junction takes over as pacemaker when the SA node fails. Sinus brady would show upright P waves. Idioventricular rhythm has wide QRS at 20-40 bpm.",
    difficulty: 2,
    category: "ECG Interpretation",
    topic: "Junctional Rhythms"
  },
  {
    id: "para-ecg-019",
    stem: "A patient's ECG shows a wide QRS complex (>0.12 seconds) with an RSR' pattern in V1 and a wide S wave in leads I and V6. This represents:",
    options: [
      "Left bundle branch block (LBBB)",
      "Right bundle branch block (RBBB)",
      "Ventricular pre-excitation (WPW)",
      "Left ventricular hypertrophy"
    ],
    correctIndex: 1,
    rationale: "RBBB is characterized by a widened QRS (>0.12s) with an RSR' ('rabbit ears') pattern in V1-V2 and a wide, slurred S wave in leads I and V6. The mnemonic 'WiLLiaM MaRRoW' helps: LBBB shows a W in V1 and M in V6; RBBB shows an M in V1 and W in V6. RBBB can occur from right heart strain, PE, or conduction disease.",
    difficulty: 3,
    category: "ECG Interpretation",
    topic: "Bundle Branch Blocks"
  },
  {
    id: "para-ecg-020",
    stem: "A 12-lead ECG shows new left bundle branch block (LBBB) in a patient with acute chest pain. This finding:",
    options: [
      "Rules out myocardial infarction",
      "Is considered a STEMI equivalent requiring emergent cardiac catheterization",
      "Is a normal variant and requires no action",
      "Only occurs in patients with chronic heart failure"
    ],
    correctIndex: 1,
    rationale: "A new or presumably new LBBB in the setting of acute ischemic symptoms is considered a STEMI equivalent and warrants emergent cardiac catheterization per AHA/ACC guidelines. LBBB alters ventricular depolarization patterns, making traditional STEMI criteria unreliable. The Sgarbossa criteria can help identify MI in the presence of LBBB but should not delay catheterization if clinical suspicion is high.",
    difficulty: 4,
    category: "ECG Interpretation",
    topic: "STEMI Equivalents"
  },
  {
    id: "para-ecg-021",
    stem: "A patient in cardiac arrest has a flat line on the monitor. Before declaring asystole, the paramedic should:",
    options: [
      "Defibrillate immediately",
      "Confirm in at least two leads, check connections, increase gain, and ensure the rhythm is truly asystole and not fine VF",
      "Begin transcutaneous pacing",
      "Administer atropine"
    ],
    correctIndex: 1,
    rationale: "Asystole must be confirmed in at least two leads to rule out fine ventricular fibrillation (which is shockable) or technical issues (loose leads, low gain setting). Check lead connections, increase the gain/amplitude, and verify in a second lead. If confirmed as asystole, treatment is high-quality CPR and epinephrine every 3-5 minutes. Asystole is not shockable.",
    difficulty: 2,
    category: "ECG Interpretation",
    topic: "Cardiac Arrest Rhythms"
  },
  {
    id: "para-ecg-022",
    stem: "An ECG from a hypothermic patient shows a characteristic positive deflection at the J point (junction of QRS and ST segment). This finding is called:",
    options: [
      "Delta wave",
      "Osborn wave (J wave)",
      "U wave",
      "Epsilon wave"
    ],
    correctIndex: 1,
    rationale: "The Osborn wave (J wave) is a characteristic positive deflection at the J point seen in hypothermia. Its amplitude correlates with the degree of hypothermia. Other hypothermic ECG findings include bradycardia, prolonged intervals (PR, QRS, QT), atrial fibrillation, and muscle tremor artifact. Delta waves are seen in WPW. U waves may indicate hypokalemia. Epsilon waves suggest ARVC.",
    difficulty: 4,
    category: "ECG Interpretation",
    topic: "Environmental ECG Changes"
  },
  {
    id: "para-ecg-023",
    stem: "A patient's ECG shows a short PR interval (<0.12 seconds) with a delta wave (slurred upstroke of QRS) and wide QRS. This pattern indicates:",
    options: [
      "Left bundle branch block",
      "Wolff-Parkinson-White (WPW) syndrome",
      "First-degree AV block",
      "Hyperkalemia"
    ],
    correctIndex: 1,
    rationale: "WPW syndrome is characterized by a short PR interval (<0.12s), a delta wave (slurred initial upstroke of QRS due to ventricular pre-excitation via an accessory pathway), and a wide QRS complex. Patients with WPW are at risk for re-entrant tachycardias. AV nodal blocking agents (adenosine, verapamil, digoxin) are dangerous if the patient develops atrial fibrillation with WPW.",
    difficulty: 4,
    category: "ECG Interpretation",
    topic: "Pre-excitation Syndromes"
  },
  {
    id: "para-ecg-024",
    stem: "What is the significance of ST elevation in lead aVR with diffuse ST depression in other leads?",
    options: [
      "Normal variant, no clinical significance",
      "Suggests left main coronary artery occlusion or severe three-vessel disease",
      "Indicates pericarditis",
      "Represents benign early repolarization"
    ],
    correctIndex: 1,
    rationale: "ST elevation in aVR with diffuse ST depression in other leads (especially >1mm in 6+ leads) is an ominous pattern suggesting left main coronary artery occlusion or severe multi-vessel disease. It indicates diffuse subendocardial ischemia. This is a high-mortality pattern requiring emergent cardiac catheterization. It may also be seen in severe aortic stenosis or large PE.",
    difficulty: 5,
    category: "ECG Interpretation",
    topic: "Critical ECG Patterns"
  },
  {
    id: "para-ecg-025",
    stem: "When interpreting a 12-lead ECG, the normal QRS axis falls between:",
    options: [
      "-30 to +90 degrees",
      "0 to +180 degrees",
      "-90 to -30 degrees",
      "+90 to +180 degrees"
    ],
    correctIndex: 0,
    rationale: "The normal QRS axis is between -30 and +90 degrees. Left axis deviation (-30 to -90) may indicate left anterior fascicular block, LVH, or inferior MI. Right axis deviation (+90 to +180) may indicate right ventricular hypertrophy, PE, or left posterior fascicular block. Extreme axis deviation (-90 to +/-180) suggests ventricular rhythms or severe conduction disease.",
    difficulty: 3,
    category: "ECG Interpretation",
    topic: "ECG Axis"
  },
  {
    id: "para-ecg-026",
    stem: "A patient with chest pain has an ECG showing ST depression in V1-V3. To evaluate for posterior MI, the paramedic should:",
    options: [
      "Repeat the standard 12-lead ECG",
      "Obtain posterior leads V7-V9 looking for ST elevation",
      "Perform a right-sided ECG only",
      "No additional leads are needed"
    ],
    correctIndex: 1,
    rationale: "ST depression in V1-V3 may represent a reciprocal change of a posterior STEMI. Posterior leads V7-V9 (placed on the patient's back at the level of V6) should be obtained. ST elevation ≥0.5mm in V7-V9 confirms posterior MI. Posterior MI is often missed because standard 12-lead ECG does not directly view the posterior wall. It commonly occurs with inferior MI from RCA or LCx occlusion.",
    difficulty: 4,
    category: "ECG Interpretation",
    topic: "Posterior MI"
  },
  {
    id: "para-ecg-027",
    stem: "Second-degree AV block Type II (Mobitz II) is characterized by:",
    options: [
      "Progressive PR prolongation with eventual dropped QRS",
      "Constant PR intervals with intermittent dropped QRS complexes (not preceded by PR prolongation)",
      "Complete AV dissociation",
      "Shortened PR interval with delta wave"
    ],
    correctIndex: 1,
    rationale: "Mobitz Type II shows constant PR intervals with sudden, unexpected dropped QRS complexes. Unlike Type I (Wenckebach), there is no progressive PR lengthening before the dropped beat. Type II typically occurs below the AV node (at the Bundle of His or bundle branches) and is more dangerous than Type I because it can progress suddenly to complete heart block. It often requires pacing.",
    difficulty: 3,
    category: "ECG Interpretation",
    topic: "Heart Blocks"
  },
  {
    id: "para-ecg-028",
    stem: "Electrical alternans (alternating QRS amplitude) on ECG, combined with sinus tachycardia and low voltage, suggests:",
    options: [
      "Atrial fibrillation",
      "Large pericardial effusion with possible tamponade",
      "Acute MI",
      "Hyperkalemia"
    ],
    correctIndex: 1,
    rationale: "Electrical alternans — beat-to-beat variation in QRS amplitude — combined with sinus tachycardia and low voltage is highly suggestive of a large pericardial effusion, often with tamponade physiology. The alternating amplitude occurs because the heart swings back and forth within the fluid-filled pericardium. This finding requires urgent evaluation for pericardiocentesis.",
    difficulty: 5,
    category: "ECG Interpretation",
    topic: "Critical ECG Patterns"
  },
  {
    id: "para-ecg-029",
    stem: "A patient presents with syncope. ECG shows a prolonged QT interval (QTc >500ms). This patient is at increased risk for:",
    options: [
      "Atrial fibrillation",
      "Torsades de Pointes",
      "First-degree AV block",
      "Sinus bradycardia"
    ],
    correctIndex: 1,
    rationale: "Prolonged QT interval (QTc >500ms) significantly increases the risk of Torsades de Pointes, a potentially fatal polymorphic ventricular tachycardia. QT prolongation can be congenital (Long QT Syndrome) or acquired (medications like amiodarone, sotalol, certain antibiotics, or electrolyte imbalances such as hypokalemia and hypomagnesemia). Treatment of Torsades is IV magnesium sulfate.",
    difficulty: 3,
    category: "ECG Interpretation",
    topic: "QT Interval Abnormalities"
  },
  {
    id: "para-ecg-030",
    stem: "Sinus arrhythmia on ECG is characterized by:",
    options: [
      "Regular rhythm with P waves occurring after QRS complexes",
      "Irregular rhythm with rate variation that corresponds to the respiratory cycle, with normal P waves and PR intervals",
      "Absent P waves with regular QRS complexes",
      "Rapid, chaotic atrial activity"
    ],
    correctIndex: 1,
    rationale: "Sinus arrhythmia is a normal variant where the heart rate increases with inspiration and decreases with expiration due to changes in vagal tone. The rhythm is irregular but all other criteria for normal sinus rhythm are met (upright P waves in II, normal PR interval, narrow QRS). It is most common in young, healthy individuals and athletes. No treatment is required.",
    difficulty: 1,
    category: "ECG Interpretation",
    topic: "Sinus Rhythms"
  }
];
