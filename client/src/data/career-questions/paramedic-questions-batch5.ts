import type { CareerQuestion } from "./rrt-questions";

export const paramedicQuestionsBatch5: CareerQuestion[] = [
  {
    id: "para-batch-301",
    stem: "Which federal agency is primarily responsible for regulating EMS systems at the national level in the United States?",
    options: [
      "Centers for Disease Control and Prevention (CDC)",
      "National Highway Traffic Safety Administration (NHTSA)",
      "Federal Emergency Management Agency (FEMA)",
      "Occupational Safety and Health Administration (OSHA)"
    ],
    correctIndex: 1,
    rationale: "NHTSA, within the U.S. Department of Transportation, is the lead federal agency for EMS. It developed the National EMS Education Standards and the EMS Agenda for the Future. CDC focuses on disease prevention, FEMA on disaster management, and OSHA on workplace safety.",
    difficulty: 5,
    category: "Operations/EMS Systems",
    topic: "EMS System Organization"
  },
  {
    id: "para-batch-302",
    stem: "During a mass casualty incident (MCI), the START triage system classifies patients into how many categories?",
    options: [
      "Three",
      "Four",
      "Five",
      "Six"
    ],
    correctIndex: 1,
    rationale: "The START (Simple Triage and Rapid Treatment) system uses four categories: Immediate (Red), Delayed (Yellow), Minor (Green), and Deceased/Expectant (Black). This allows rapid sorting of patients based on severity and survivability.",
    difficulty: 5,
    category: "Operations/EMS Systems",
    topic: "Mass Casualty Triage"
  },
  {
    id: "para-batch-303",
    stem: "A paramedic arrives at a scene where a patient is walking and talking after a building collapse. Using START triage, this patient would be classified as:",
    options: [
      "Immediate (Red)",
      "Delayed (Yellow)",
      "Minor (Green)",
      "Expectant (Black)"
    ],
    correctIndex: 2,
    rationale: "In the START triage system, the first step is to direct all walking wounded to a designated area and classify them as Minor (Green). Patients who can walk are considered the lowest priority for treatment during an MCI.",
    difficulty: 5,
    category: "Operations/EMS Systems",
    topic: "Mass Casualty Triage"
  },
  {
    id: "para-batch-304",
    stem: "What is the primary purpose of an EMS system's medical direction?",
    options: [
      "To manage ambulance fleet maintenance schedules",
      "To provide physician oversight and quality assurance of patient care",
      "To determine billing rates for ambulance services",
      "To schedule paramedic work shifts"
    ],
    correctIndex: 1,
    rationale: "Medical direction provides physician oversight of the EMS system, including developing protocols, providing online (direct) and offline (indirect) medical control, and ensuring quality assurance of patient care. Administrative tasks like fleet management and scheduling are not part of medical direction.",
    difficulty: 5,
    category: "Operations/EMS Systems",
    topic: "Medical Direction"
  },
  {
    id: "para-batch-305",
    stem: "Which of the following best describes 'offline medical control'?",
    options: [
      "Real-time physician communication via radio or phone",
      "Standing orders, protocols, and training programs developed by the medical director",
      "A paramedic providing care without any physician oversight",
      "Telemedicine consultation during patient transport"
    ],
    correctIndex: 1,
    rationale: "Offline (indirect) medical control includes standing orders, protocols, policies, and training programs established by the medical director before patient encounters. Online (direct) medical control involves real-time communication with a physician. Paramedics always operate under some form of medical oversight.",
    difficulty: 4,
    category: "Operations/EMS Systems",
    topic: "Medical Direction"
  },
  {
    id: "para-batch-306",
    stem: "The mechanism of action of epinephrine includes all of the following EXCEPT:",
    options: [
      "Alpha-1 receptor stimulation causing vasoconstriction",
      "Beta-1 receptor stimulation increasing heart rate and contractility",
      "Beta-2 receptor stimulation causing bronchodilation",
      "Muscarinic receptor blockade causing decreased secretions"
    ],
    correctIndex: 3,
    rationale: "Epinephrine is a sympathomimetic that stimulates alpha-1 (vasoconstriction), beta-1 (increased heart rate and contractility), and beta-2 (bronchodilation) receptors. It does not block muscarinic receptors. Atropine is the drug that blocks muscarinic receptors to decrease secretions and increase heart rate.",
    difficulty: 4,
    category: "Pharmacology",
    topic: "Sympathomimetics"
  },
  {
    id: "para-batch-307",
    stem: "What is the correct dose of epinephrine 1:10,000 for an adult in cardiac arrest?",
    options: [
      "0.5 mg IV/IO every 3-5 minutes",
      "1 mg IV/IO every 3-5 minutes",
      "2 mg IV/IO every 5-10 minutes",
      "0.1 mg IV/IO every 1-2 minutes"
    ],
    correctIndex: 1,
    rationale: "The standard adult cardiac arrest dose of epinephrine is 1 mg (10 mL of 1:10,000 concentration) IV/IO every 3-5 minutes. This dose applies to all cardiac arrest rhythms including VF, pulseless VT, asystole, and PEA.",
    difficulty: 5,
    category: "Pharmacology",
    topic: "Cardiac Arrest Medications"
  },
  {
    id: "para-batch-308",
    stem: "A paramedic is setting up an incident command system (ICS) at a multi-vehicle accident. Which of the following is NOT one of the five major functional areas of ICS?",
    options: [
      "Operations",
      "Logistics",
      "Intelligence",
      "Finance/Administration"
    ],
    correctIndex: 2,
    rationale: "The five major functional areas of ICS are: Command, Operations, Planning, Logistics, and Finance/Administration. Intelligence/Investigations may be established as a sixth function in some incidents but is not one of the five core ICS sections.",
    difficulty: 4,
    category: "Operations/EMS Systems",
    topic: "Incident Command System"
  },
  {
    id: "para-batch-309",
    stem: "According to the National Incident Management System (NIMS), what is the recommended span of control for a supervisor?",
    options: [
      "1-3 subordinates",
      "3-7 subordinates",
      "10-15 subordinates",
      "15-20 subordinates"
    ],
    correctIndex: 1,
    rationale: "NIMS recommends a span of control of 3-7 subordinates per supervisor, with 5 being optimal. This ensures effective supervision and communication. Too few subordinates underutilize supervisory resources, while too many can overwhelm a supervisor's ability to manage effectively.",
    difficulty: 4,
    category: "Operations/EMS Systems",
    topic: "Incident Command System"
  },
  {
    id: "para-batch-310",
    stem: "Which medication is the first-line treatment for symptomatic bradycardia in the prehospital setting?",
    options: [
      "Dopamine",
      "Atropine",
      "Epinephrine",
      "Amiodarone"
    ],
    correctIndex: 1,
    rationale: "Atropine 0.5 mg IV is the first-line drug for symptomatic bradycardia. It works by blocking vagal (parasympathetic) stimulation at the SA and AV nodes. Dopamine and epinephrine drips are second-line options. Amiodarone is an antiarrhythmic used for tachyarrhythmias, not bradycardia.",
    difficulty: 5,
    category: "Pharmacology",
    topic: "Cardiac Medications"
  },
  {
    id: "para-batch-311",
    stem: "What is the maximum total dose of atropine for symptomatic bradycardia in an adult?",
    options: [
      "1 mg",
      "2 mg",
      "3 mg",
      "5 mg"
    ],
    correctIndex: 2,
    rationale: "The maximum total dose of atropine for symptomatic bradycardia is 3 mg (six doses of 0.5 mg). Doses less than 0.5 mg can paradoxically worsen bradycardia. Beyond 3 mg, further vagolytic effect is unlikely, and alternative interventions such as dopamine or transcutaneous pacing should be considered.",
    difficulty: 4,
    category: "Pharmacology",
    topic: "Cardiac Medications"
  },
  {
    id: "para-batch-312",
    stem: "During a hazardous materials incident, which zone is the area where patient decontamination takes place?",
    options: [
      "Hot zone (exclusion zone)",
      "Warm zone (contamination reduction zone)",
      "Cold zone (support zone)",
      "Transport zone"
    ],
    correctIndex: 1,
    rationale: "The warm zone (contamination reduction zone) is where decontamination occurs. The hot zone is the area of greatest contamination where only HazMat-trained personnel with appropriate PPE should enter. The cold zone is the clean area for command, staging, and treatment of decontaminated patients.",
    difficulty: 4,
    category: "Operations/EMS Systems",
    topic: "Hazardous Materials"
  },
  {
    id: "para-batch-313",
    stem: "A paramedic encounters a patient exposed to an unknown chemical agent with symptoms of salivation, lacrimation, urination, defecation, GI distress, and emesis (SLUDGE). The most likely class of agent is:",
    options: [
      "Vesicant (blister agent)",
      "Organophosphate/nerve agent",
      "Cyanide compound",
      "Pulmonary irritant"
    ],
    correctIndex: 1,
    rationale: "The SLUDGE mnemonic (Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis) is characteristic of cholinergic crisis caused by organophosphate or nerve agent exposure. These agents inhibit acetylcholinesterase, causing excessive parasympathetic stimulation. Vesicants cause blistering, cyanide causes cellular hypoxia, and pulmonary irritants affect airways.",
    difficulty: 4,
    category: "Operations/EMS Systems",
    topic: "Hazardous Materials"
  },
  {
    id: "para-batch-314",
    stem: "The antidote combination for organophosphate poisoning is:",
    options: [
      "Naloxone and flumazenil",
      "Atropine and pralidoxime (2-PAM)",
      "Calcium gluconate and magnesium sulfate",
      "N-acetylcysteine and activated charcoal"
    ],
    correctIndex: 1,
    rationale: "Atropine blocks the excessive muscarinic effects of acetylcholine accumulation, while pralidoxime (2-PAM) reactivates acetylcholinesterase if given early enough. Naloxone reverses opioids, flumazenil reverses benzodiazepines, N-acetylcysteine treats acetaminophen overdose.",
    difficulty: 4,
    category: "Pharmacology",
    topic: "Toxicology Antidotes"
  },
  {
    id: "para-batch-315",
    stem: "What is the primary role of the Safety Officer in the Incident Command System?",
    options: [
      "Coordinating all tactical operations at the scene",
      "Monitoring scene conditions and ensuring personnel safety",
      "Documenting all patient care activities",
      "Managing media communications"
    ],
    correctIndex: 1,
    rationale: "The Safety Officer monitors scene conditions and ensures the safety of all personnel. They have the authority to halt operations if an imminent safety hazard is identified. Operations are coordinated by the Operations Section Chief, documentation is part of Planning, and media is handled by the Public Information Officer.",
    difficulty: 5,
    category: "Operations/EMS Systems",
    topic: "Incident Command System"
  },
  {
    id: "para-batch-316",
    stem: "Adenosine is indicated for which of the following cardiac rhythms?",
    options: [
      "Ventricular fibrillation",
      "Supraventricular tachycardia (SVT)",
      "Atrial fibrillation with slow ventricular response",
      "Third-degree heart block"
    ],
    correctIndex: 1,
    rationale: "Adenosine is the first-line drug for stable supraventricular tachycardia (SVT). It works by temporarily blocking conduction through the AV node. It is not effective for ventricular fibrillation, is not indicated for slow atrial fibrillation, and would worsen third-degree heart block.",
    difficulty: 5,
    category: "Pharmacology",
    topic: "Antiarrhythmics"
  },
  {
    id: "para-batch-317",
    stem: "What is the correct initial dose of adenosine for SVT in an adult?",
    options: [
      "3 mg rapid IV push",
      "6 mg rapid IV push",
      "12 mg rapid IV push",
      "0.5 mg slow IV push"
    ],
    correctIndex: 1,
    rationale: "The initial dose of adenosine for SVT is 6 mg rapid IV push followed by a 20 mL normal saline flush. If ineffective, a second dose of 12 mg may be given. The drug must be administered as a rapid push because of its extremely short half-life (less than 10 seconds).",
    difficulty: 5,
    category: "Pharmacology",
    topic: "Antiarrhythmics"
  },
  {
    id: "para-batch-318",
    stem: "A paramedic is treating a patient with chest pain and a systolic BP of 88 mmHg. Which medication should be withheld in this scenario?",
    options: [
      "Aspirin 324 mg chewed",
      "Nitroglycerin 0.4 mg sublingual",
      "Supplemental oxygen at 4 L/min via nasal cannula",
      "Fentanyl 1 mcg/kg IV for pain control"
    ],
    correctIndex: 1,
    rationale: "Nitroglycerin causes vasodilation and can further reduce blood pressure. It should be withheld when systolic BP is below 90 mmHg to avoid worsening hypotension. Aspirin is still indicated for ACS regardless of blood pressure.",
    difficulty: 4,
    category: "Pharmacology",
    topic: "Cardiac Medications"
  },
  {
    id: "para-batch-319",
    stem: "A paramedic is transporting a critical patient when the ambulance is involved in a minor traffic collision. The first action should be:",
    options: [
      "Continue to the hospital without stopping",
      "Ensure the safety of all occupants and assess for injuries",
      "Call the supervisor to report the incident",
      "Begin documenting the collision details"
    ],
    correctIndex: 1,
    rationale: "The first priority after any ambulance collision is ensuring the safety and assessing for injuries of all occupants, including the patient, crew, and anyone in other vehicles. This follows standard scene safety principles. Documentation and reporting are important but come after ensuring safety.",
    difficulty: 5,
    category: "Operations/EMS Systems",
    topic: "Ambulance Operations"
  },
  {
    id: "para-batch-320",
    stem: "When operating an emergency vehicle, 'due regard' refers to:",
    options: [
      "The right to disregard all traffic laws during an emergency response",
      "The legal obligation to drive with reasonable care for the safety of others",
      "The requirement to use lights and sirens on every call",
      "The authority to exceed the speed limit by up to 20 mph in all zones"
    ],
    correctIndex: 1,
    rationale: "Due regard is the legal concept requiring emergency vehicle operators to drive with reasonable care for the safety of others, even when exercising emergency vehicle privileges. It does not grant the right to disregard all traffic laws or create blanket speed exemptions.",
    difficulty: 4,
    category: "Operations/EMS Systems",
    topic: "Ambulance Operations"
  },
  {
    id: "para-batch-321",
    stem: "Amiodarone is administered during cardiac arrest for which rhythm?",
    options: [
      "Asystole",
      "Pulseless electrical activity (PEA)",
      "Ventricular fibrillation/pulseless ventricular tachycardia refractory to defibrillation",
      "Sinus bradycardia"
    ],
    correctIndex: 2,
    rationale: "Amiodarone 300 mg IV/IO is indicated for shock-refractory VF/pulseless VT (after defibrillation and epinephrine have been administered). It is not indicated for asystole, PEA, or bradycardia. A second dose of 150 mg may be given if the first dose is ineffective.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Cardiac Arrest Medications"
  },
  {
    id: "para-batch-322",
    stem: "What class of medication is morphine sulfate?",
    options: [
      "Nonsteroidal anti-inflammatory drug",
      "Opioid analgesic",
      "Benzodiazepine",
      "Local anesthetic"
    ],
    correctIndex: 1,
    rationale: "Morphine sulfate is an opioid (narcotic) analgesic that binds to mu-opioid receptors in the CNS to produce analgesia and sedation. It also causes vasodilation and reduces preload, which is beneficial in acute pulmonary edema. NSAIDs include ibuprofen, benzodiazepines include midazolam.",
    difficulty: 4,
    category: "Pharmacology",
    topic: "Analgesics"
  },
  {
    id: "para-batch-323",
    stem: "Which of the following is the antidote for opioid overdose?",
    options: [
      "Flumazenil",
      "Naloxone (Narcan)",
      "Activated charcoal",
      "Glucagon"
    ],
    correctIndex: 1,
    rationale: "Naloxone (Narcan) is a competitive opioid antagonist that reverses the effects of opioid overdose, including respiratory depression, sedation, and hypotension. Flumazenil reverses benzodiazepines, activated charcoal adsorbs ingested toxins, and glucagon is used for beta-blocker overdose and hypoglycemia.",
    difficulty: 4,
    category: "Pharmacology",
    topic: "Toxicology Antidotes"
  },
  {
    id: "para-batch-324",
    stem: "A helicopter EMS (HEMS) crew is preparing for a scene flight. What is the minimum safe distance for approaching a helicopter with the rotors turning?",
    options: [
      "25 feet",
      "50 feet",
      "100 feet",
      "200 feet"
    ],
    correctIndex: 2,
    rationale: "The generally recommended minimum safe approach distance for a helicopter with rotors turning is 100 feet, and personnel should approach from the front or side (never from the rear/tail rotor area) and only when signaled by the pilot or crew. Actual distances may vary by aircraft and agency protocol.",
    difficulty: 3,
    category: "Operations/EMS Systems",
    topic: "Air Medical Operations"
  },
  {
    id: "para-batch-325",
    stem: "Which of the following is a criterion for activating a helicopter EMS response?",
    options: [
      "All patients with isolated extremity fractures",
      "Prolonged extrication time with critical patient and transport time greater than 30 minutes by ground",
      "Any patient requesting air transport",
      "Minor vehicle accidents with no injuries"
    ],
    correctIndex: 1,
    rationale: "HEMS activation is appropriate when ground transport time significantly exceeds air transport time for critically ill or injured patients, or when the patient requires a level of care not available at nearby facilities. Isolated extremity fractures, patient requests alone, and minor accidents are not indications for HEMS.",
    difficulty: 3,
    category: "Operations/EMS Systems",
    topic: "Air Medical Operations"
  },
  {
    id: "para-batch-326",
    stem: "Midazolam (Versed) belongs to which drug classification?",
    options: [
      "Opioid analgesic",
      "Benzodiazepine",
      "Barbiturate",
      "Phenothiazine"
    ],
    correctIndex: 1,
    rationale: "Midazolam (Versed) is a benzodiazepine used for sedation, anxiolysis, and seizure management. It enhances the effect of GABA at the GABA-A receptor. Opioids include morphine, barbiturates include phenobarbital, and phenothiazines include promethazine.",
    difficulty: 4,
    category: "Pharmacology",
    topic: "Sedatives"
  },
  {
    id: "para-batch-327",
    stem: "What is the reversal agent for benzodiazepine overdose?",
    options: [
      "Naloxone",
      "Flumazenil (Romazicon)",
      "Atropine",
      "Physostigmine"
    ],
    correctIndex: 1,
    rationale: "Flumazenil (Romazicon) is a competitive benzodiazepine antagonist that reverses sedation and respiratory depression caused by benzodiazepines. Naloxone reverses opioids, atropine reverses cholinergic effects, and physostigmine reverses anticholinergic toxicity. Flumazenil should be used cautiously in chronic benzodiazepine users due to seizure risk.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Toxicology Antidotes"
  },
  {
    id: "para-batch-328",
    stem: "In the EMS system, quality improvement (QI) programs are designed to:",
    options: [
      "Punish providers who make errors",
      "Systematically evaluate and improve patient care delivery",
      "Reduce costs by eliminating training programs",
      "Replace medical direction with peer review"
    ],
    correctIndex: 1,
    rationale: "Quality improvement (QI) programs systematically evaluate and improve patient care through data collection, analysis, and process improvement. QI is non-punitive and aimed at system improvement, not individual punishment. It supplements rather than replaces medical direction and supports ongoing education.",
    difficulty: 4,
    category: "Operations/EMS Systems",
    topic: "Quality Improvement"
  },
  {
    id: "para-batch-329",
    stem: "A paramedic is treating a patient with suspected acute coronary syndrome. Which medication combination is typically administered in the prehospital setting?",
    options: [
      "Aspirin, nitroglycerin, and morphine as indicated",
      "Ibuprofen, acetaminophen, and oxygen",
      "Heparin, clopidogrel, and a beta-blocker",
      "Warfarin, aspirin, and calcium channel blocker"
    ],
    correctIndex: 0,
    rationale: "The prehospital treatment for suspected ACS typically includes aspirin (antiplatelet), nitroglycerin (vasodilator to reduce preload), and morphine if pain persists and blood pressure permits. Heparin, clopidogrel, and beta-blockers are typically initiated in the hospital setting. Warfarin is not used acutely for ACS.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Cardiac Medications"
  },
  {
    id: "para-batch-330",
    stem: "The dose of aspirin given for suspected acute coronary syndrome is:",
    options: [
      "81 mg chewed",
      "162-325 mg chewed",
      "500 mg swallowed",
      "650 mg rectally"
    ],
    correctIndex: 1,
    rationale: "The recommended dose of aspirin for suspected ACS is 162-325 mg chewed (not swallowed whole) for rapid absorption. Chewing increases the onset of antiplatelet effects. The low-dose 81 mg is for daily prevention, not acute treatment.",
    difficulty: 4,
    category: "Pharmacology",
    topic: "Cardiac Medications"
  },
  {
    id: "para-batch-331",
    stem: "Which communication model is recommended for EMS handoff reports to receiving facilities?",
    options: [
      "SOAP format",
      "SBAR format (Situation, Background, Assessment, Recommendation)",
      "Narrative essay format",
      "Chronological timeline format only"
    ],
    correctIndex: 1,
    rationale: "SBAR (Situation, Background, Assessment, Recommendation) is the recommended standardized communication tool for patient handoffs. It provides a structured, concise format that ensures critical information is communicated effectively and reduces errors during transitions of care.",
    difficulty: 4,
    category: "Operations/EMS Systems",
    topic: "Communications"
  },
  {
    id: "para-batch-332",
    stem: "When transmitting a radio report to the receiving hospital, which of the following should be included?",
    options: [
      "The patient's full legal name and social security number",
      "Unit identification, patient age/sex, chief complaint, vitals, treatments given, and ETA",
      "A detailed family medical history",
      "The paramedic's personal assessment of the patient's insurance status"
    ],
    correctIndex: 1,
    rationale: "A proper radio report includes unit ID, patient demographics (age/sex), chief complaint, history of present illness, assessment findings, vital signs, interventions performed, and estimated time of arrival. Patient identifiers like full name and SSN should not be broadcast over open radio frequencies for privacy (HIPAA) reasons.",
    difficulty: 4,
    category: "Operations/EMS Systems",
    topic: "Communications"
  },
  {
    id: "para-batch-333",
    stem: "Albuterol (Ventolin) is classified as a:",
    options: [
      "Anticholinergic bronchodilator",
      "Beta-2 selective adrenergic agonist",
      "Corticosteroid",
      "Leukotriene receptor antagonist"
    ],
    correctIndex: 1,
    rationale: "Albuterol is a selective beta-2 adrenergic agonist that causes relaxation of bronchial smooth muscle, resulting in bronchodilation. Ipratropium is an anticholinergic bronchodilator, methylprednisolone is a corticosteroid, and montelukast is a leukotriene receptor antagonist.",
    difficulty: 4,
    category: "Pharmacology",
    topic: "Bronchodilators"
  },
  {
    id: "para-batch-334",
    stem: "A paramedic administers albuterol to an asthmatic patient. Which side effect should be most anticipated?",
    options: [
      "Bradycardia",
      "Tachycardia and tremors",
      "Hypoglycemia",
      "Bronchospasm"
    ],
    correctIndex: 1,
    rationale: "Common side effects of albuterol include tachycardia, tremors, nervousness, and palpitations due to some beta-1 receptor stimulation. Bradycardia would not be expected from a beta-agonist. Albuterol can cause hyperglycemia (not hypoglycemia) and is used to relieve bronchospasm.",
    difficulty: 4,
    category: "Pharmacology",
    topic: "Bronchodilators"
  },
  {
    id: "para-batch-335",
    stem: "What document outlines the scope of practice for EMS providers at each certification level?",
    options: [
      "The National EMS Education Standards",
      "The National EMS Scope of Practice Model",
      "The EMS Agenda for the Future",
      "The Ryan White Act"
    ],
    correctIndex: 1,
    rationale: "The National EMS Scope of Practice Model defines the minimum psychomotor skills and knowledge for each EMS certification level (EMR, EMT, AEMT, Paramedic). The Education Standards define curriculum content, the Agenda for the Future outlines EMS system vision, and the Ryan White Act addresses exposure notification.",
    difficulty: 3,
    category: "Operations/EMS Systems",
    topic: "EMS System Organization"
  },
  {
    id: "para-batch-336",
    stem: "A patient has a documented allergy to sulfa drugs. Which of the following medications should be avoided?",
    options: [
      "Amiodarone",
      "Furosemide (Lasix)",
      "Naloxone",
      "Epinephrine"
    ],
    correctIndex: 1,
    rationale: "Furosemide (Lasix) is a sulfonamide-derived loop diuretic that may cause cross-reactivity in patients with sulfa allergies. While the risk of true cross-reactivity is debated, caution is warranted. Amiodarone, naloxone, and epinephrine are not sulfonamide-based and are not contraindicated in sulfa allergy.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Drug Allergies"
  },
  {
    id: "para-batch-337",
    stem: "During a multiple casualty incident, a non-ambulatory patient has a respiratory rate of 32, radial pulse present, and does not follow commands. Using START triage, this patient is classified as:",
    options: [
      "Minor (Green)",
      "Delayed (Yellow)",
      "Immediate (Red)",
      "Expectant (Black)"
    ],
    correctIndex: 2,
    rationale: "In START triage: the patient is not walking (not Green), respiratory rate is present but >30 (tagged Red/Immediate). Even though radial pulse is present, the elevated respiratory rate alone classifies the patient as Immediate. Inability to follow commands would also indicate Immediate classification.",
    difficulty: 3,
    category: "Operations/EMS Systems",
    topic: "Mass Casualty Triage"
  },
  {
    id: "para-batch-338",
    stem: "Dopamine at a dose of 2-5 mcg/kg/min primarily stimulates which receptors?",
    options: [
      "Alpha-1 adrenergic receptors",
      "Dopaminergic receptors",
      "Beta-1 adrenergic receptors",
      "Muscarinic receptors"
    ],
    correctIndex: 1,
    rationale: "Dopamine has dose-dependent receptor effects: at low doses (2-5 mcg/kg/min), it primarily stimulates dopaminergic receptors causing renal and mesenteric vasodilation. At moderate doses (5-10 mcg/kg/min), beta-1 effects predominate. At high doses (>10 mcg/kg/min), alpha-1 effects predominate causing vasoconstriction.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Vasopressors"
  },
  {
    id: "para-batch-339",
    stem: "At high doses (>10 mcg/kg/min), dopamine primarily causes:",
    options: [
      "Renal vasodilation",
      "Bronchodilation",
      "Peripheral vasoconstriction",
      "Decreased cardiac contractility"
    ],
    correctIndex: 2,
    rationale: "At doses >10 mcg/kg/min, dopamine primarily stimulates alpha-1 adrenergic receptors, causing significant peripheral vasoconstriction and increased blood pressure. Renal vasodilation occurs at low doses, and beta-1 effects (increased contractility) occur at moderate doses.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Vasopressors"
  },
  {
    id: "para-batch-340",
    stem: "Which of the following best describes the 'Golden Hour' concept in trauma care?",
    options: [
      "The time required for helicopter EMS to arrive at a scene",
      "The critical time period from injury to definitive surgical care that impacts survival",
      "The minimum time required for a complete trauma assessment",
      "The standard response time for EMS dispatch"
    ],
    correctIndex: 1,
    rationale: "The Golden Hour concept emphasizes that critically injured trauma patients have improved survival when they receive definitive surgical care within approximately one hour of injury. This drives the EMS principle of minimizing on-scene time and rapid transport to appropriate trauma centers.",
    difficulty: 4,
    category: "Operations/EMS Systems",
    topic: "Trauma Systems"
  },
  {
    id: "para-batch-341",
    stem: "A patient in anaphylaxis has received epinephrine IM. The physician orders diphenhydramine (Benadryl). The mechanism of action of diphenhydramine is:",
    options: [
      "Beta-2 receptor agonism",
      "H1 histamine receptor antagonism",
      "Leukotriene receptor blockade",
      "Mast cell stabilization"
    ],
    correctIndex: 1,
    rationale: "Diphenhydramine (Benadryl) is a first-generation antihistamine that competitively blocks H1 histamine receptors, reducing allergic symptoms like urticaria, pruritus, and edema. Beta-2 agonism describes albuterol, leukotriene blockade describes montelukast, and cromolyn is a mast cell stabilizer.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Antihistamines"
  },
  {
    id: "para-batch-342",
    stem: "An EMS system implements a 'closest unit' dispatch model. This is an example of which type of system design?",
    options: [
      "Tiered response system",
      "System status management (SSM)",
      "Fixed deployment model",
      "Mutual aid agreement"
    ],
    correctIndex: 1,
    rationale: "System status management (SSM) uses dynamic deployment strategies including closest unit dispatch to optimize resource utilization and response times. A tiered response sends different levels of care, fixed deployment uses stationary positions, and mutual aid involves neighboring agencies providing assistance.",
    difficulty: 3,
    category: "Operations/EMS Systems",
    topic: "EMS System Design"
  },
  {
    id: "para-batch-343",
    stem: "Which of the following is the correct energy level for the first defibrillation attempt using a biphasic defibrillator in an adult with ventricular fibrillation?",
    options: [
      "100 joules",
      "120-200 joules (manufacturer-specific)",
      "300 joules",
      "360 joules"
    ],
    correctIndex: 1,
    rationale: "Biphasic defibrillators typically deliver 120-200 joules for the initial shock, depending on the manufacturer's recommendation. If the optimal dose is unknown, the maximum available dose should be used. 360 joules is the standard for monophasic defibrillators.",
    difficulty: 3,
    category: "Operations/EMS Systems",
    topic: "Cardiac Arrest Management"
  },
  {
    id: "para-batch-344",
    stem: "Dextrose 50% (D50) is indicated in the prehospital setting for:",
    options: [
      "Hyperglycemia",
      "Confirmed or suspected hypoglycemia with altered mental status",
      "Diabetic ketoacidosis",
      "Hyperkalemia"
    ],
    correctIndex: 1,
    rationale: "Dextrose 50% (D50W) is administered IV to treat confirmed or suspected hypoglycemia with altered mental status when the patient cannot take oral glucose. It is contraindicated in hyperglycemia and would worsen DKA. While dextrose is sometimes used with insulin for hyperkalemia, D50 alone is not the primary treatment.",
    difficulty: 1,
    category: "Pharmacology",
    topic: "Metabolic Medications"
  },
  {
    id: "para-batch-345",
    stem: "Glucagon is administered for hypoglycemia when:",
    options: [
      "The patient has a blood glucose level greater than 200 mg/dL",
      "IV access cannot be established",
      "The patient is alert and able to swallow",
      "Oral glucose has already been effective"
    ],
    correctIndex: 1,
    rationale: "Glucagon 1 mg IM/IN is given for hypoglycemia when IV access cannot be obtained and oral glucose cannot be safely administered. It stimulates glycogenolysis in the liver to raise blood glucose. It requires adequate hepatic glycogen stores to be effective, so it may be less effective in malnourished or alcoholic patients.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Metabolic Medications"
  },
  {
    id: "para-batch-346",
    stem: "A paramedic must decide whether to use lights and sirens during transport. Research has shown that the use of lights and sirens:",
    options: [
      "Significantly reduces transport time by 10-15 minutes on average",
      "Typically saves only a few minutes and increases the risk of collisions",
      "Has no effect on transport time or safety",
      "Is legally required for all ambulance transports"
    ],
    correctIndex: 1,
    rationale: "Research consistently shows that lights and sirens typically save only a few minutes of transport time while significantly increasing the risk of ambulance-involved collisions and stress on patients and crews. Evidence-based EMS practice recommends limiting L&S use to truly time-critical situations.",
    difficulty: 3,
    category: "Operations/EMS Systems",
    topic: "Ambulance Operations"
  },
  {
    id: "para-batch-347",
    stem: "Magnesium sulfate is indicated in the prehospital setting for all of the following EXCEPT:",
    options: [
      "Torsades de pointes",
      "Severe asthma refractory to beta-agonists",
      "Eclamptic seizures",
      "Supraventricular tachycardia"
    ],
    correctIndex: 3,
    rationale: "Magnesium sulfate is indicated for torsades de pointes, severe refractory asthma, and eclamptic seizures/pre-eclampsia. It is not indicated for supraventricular tachycardia; adenosine is the first-line treatment for SVT. Magnesium works by stabilizing cell membranes and relaxing smooth muscle.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Electrolyte Replacement"
  },
  {
    id: "para-batch-348",
    stem: "The Emergency Medical Treatment and Active Labor Act (EMTALA) requires hospitals to:",
    options: [
      "Provide free ambulance transport to all patients",
      "Perform a medical screening exam and stabilize any emergency condition regardless of ability to pay",
      "Accept all patients transferred from other facilities",
      "Hire only board-certified emergency physicians"
    ],
    correctIndex: 1,
    rationale: "EMTALA requires Medicare-participating hospitals with emergency departments to provide a medical screening exam to anyone who presents and to stabilize any identified emergency medical condition regardless of the patient's ability to pay or insurance status. It does not mandate free transport or require acceptance of all transfers.",
    difficulty: 3,
    category: "Operations/EMS Systems",
    topic: "EMS Legal/Regulatory"
  },
  {
    id: "para-batch-349",
    stem: "Which of the following correctly describes implied consent?",
    options: [
      "Consent given by a conscious, competent adult for treatment",
      "Consent assumed for an unconscious patient who cannot provide express consent",
      "Consent provided by a parent for a minor child",
      "A written consent form signed before surgery"
    ],
    correctIndex: 1,
    rationale: "Implied consent is the legal assumption that an unconscious, seriously ill, or mentally incapacitated patient would consent to lifesaving treatment if able to do so. Express consent is given by a conscious, competent patient. Consent for a minor by a parent is informed consent by proxy.",
    difficulty: 1,
    category: "Operations/EMS Systems",
    topic: "EMS Legal/Ethical"
  },
  {
    id: "para-batch-350",
    stem: "A competent adult patient with chest pain refuses transport against medical advice (AMA). The paramedic should:",
    options: [
      "Physically restrain the patient and transport to the hospital",
      "Explain the risks of refusal, document thoroughly, have the patient sign a refusal form, and provide instructions to call 911 if symptoms worsen",
      "Leave the scene immediately to avoid liability",
      "Contact law enforcement to force the patient to go to the hospital"
    ],
    correctIndex: 1,
    rationale: "A competent adult has the right to refuse treatment. The paramedic should explain the risks of refusal (including possible death), ensure the patient understands, document the encounter thoroughly, have the patient sign a refusal form, and instruct them to call 911 if symptoms worsen. Forcing treatment would constitute battery.",
    difficulty: 3,
    category: "Operations/EMS Systems",
    topic: "EMS Legal/Ethical"
  },
  {
    id: "para-batch-351",
    stem: "Ipratropium bromide (Atrovent) works by:",
    options: [
      "Stimulating beta-2 adrenergic receptors",
      "Blocking muscarinic acetylcholine receptors in bronchial smooth muscle",
      "Inhibiting phosphodiesterase enzymes",
      "Blocking leukotriene receptors"
    ],
    correctIndex: 1,
    rationale: "Ipratropium bromide is an anticholinergic bronchodilator that blocks muscarinic (M3) receptors on bronchial smooth muscle, preventing acetylcholine-mediated bronchoconstriction. It is often used in combination with albuterol for COPD and severe asthma exacerbations.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Bronchodilators"
  },
  {
    id: "para-batch-352",
    stem: "The paramedic is preparing to administer a medication via the intraosseous (IO) route. Which of the following is a contraindication to IO access?",
    options: [
      "Cardiac arrest",
      "Fracture of the targeted bone",
      "Pediatric patient under 5 years old",
      "Altered mental status"
    ],
    correctIndex: 1,
    rationale: "A fracture of the targeted bone is an absolute contraindication for IO access because the fluid/medication would extravasate through the fracture site rather than entering the vascular system. IO access is indicated for cardiac arrest, appropriate for all ages, and does not require patient consciousness.",
    difficulty: 3,
    category: "Operations/EMS Systems",
    topic: "Vascular Access"
  },
  {
    id: "para-batch-353",
    stem: "Which of the following EMS documentation errors could be considered falsification?",
    options: [
      "Making a spelling error in a medication name",
      "Documenting a procedure as completed when it was not performed",
      "Writing the wrong time and then correcting it with a single line through and initials",
      "Forgetting to document a normal lung sound finding"
    ],
    correctIndex: 1,
    rationale: "Documenting a procedure that was not performed constitutes falsification of a medical record, which is illegal and can result in criminal charges, loss of certification, and civil liability. Spelling errors, proper corrections, and omissions of findings are errors but not intentional falsification.",
    difficulty: 3,
    category: "Operations/EMS Systems",
    topic: "Documentation"
  },
  {
    id: "para-batch-354",
    stem: "Sodium bicarbonate administration during cardiac arrest is indicated for:",
    options: [
      "All cardiac arrest patients after 10 minutes",
      "Known or suspected pre-existing metabolic acidosis, hyperkalemia, or tricyclic antidepressant overdose",
      "Patients in respiratory acidosis",
      "Any patient with a pH above 7.35"
    ],
    correctIndex: 1,
    rationale: "Sodium bicarbonate is indicated in cardiac arrest for known pre-existing metabolic acidosis, hyperkalemia, or tricyclic antidepressant overdose. Routine use is not recommended. For respiratory acidosis, ventilation management is the primary treatment. It should not be given with a normal or alkalotic pH.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Cardiac Arrest Medications"
  },
  {
    id: "para-batch-355",
    stem: "What is the purpose of the National Incident Management System (NIMS)?",
    options: [
      "To provide a standardized approach to incident management for all levels of government and agencies",
      "To replace local EMS protocols with federal guidelines",
      "To manage hospital emergency department operations",
      "To certify EMS providers at the national level"
    ],
    correctIndex: 0,
    rationale: "NIMS provides a systematic, proactive approach to guide all levels of government, NGOs, and the private sector to work together to prevent, protect against, respond to, recover from, and mitigate the effects of incidents. It does not replace local protocols but provides a common framework for interoperability.",
    difficulty: 3,
    category: "Operations/EMS Systems",
    topic: "Incident Command System"
  },
  {
    id: "para-batch-356",
    stem: "Procainamide is used in the prehospital setting for:",
    options: [
      "Asystole",
      "Stable monomorphic ventricular tachycardia",
      "Sinus bradycardia",
      "Atrial flutter with normal ventricular rate"
    ],
    correctIndex: 1,
    rationale: "Procainamide is a Class IA antiarrhythmic used for stable monomorphic ventricular tachycardia and some supraventricular tachycardias. It is not effective for asystole, not indicated for bradycardia, and not typically used for controlled atrial flutter. It must be infused slowly and BP monitored.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Antiarrhythmics"
  },
  {
    id: "para-batch-357",
    stem: "A paramedic is called to a scene involving a confirmed active shooter. The correct EMS response is to:",
    options: [
      "Immediately enter the building to treat victims",
      "Stage in a safe location until law enforcement has secured the scene or a warm zone is established",
      "Begin triage at the entrance of the building",
      "Establish incident command inside the building"
    ],
    correctIndex: 1,
    rationale: "In an active shooter/hostile event, EMS personnel should stage in a safe area and not enter until law enforcement has cleared or secured the scene. Some agencies train for Rescue Task Force (RTF) operations where EMS enters warm zones with law enforcement escort, but never the hot zone. Scene safety is the priority.",
    difficulty: 3,
    category: "Operations/EMS Systems",
    topic: "Active Threat Response"
  },
  {
    id: "para-batch-358",
    stem: "Which CBRNE agent category includes anthrax and smallpox?",
    options: [
      "Chemical",
      "Biological",
      "Radiological",
      "Nuclear"
    ],
    correctIndex: 1,
    rationale: "CBRNE stands for Chemical, Biological, Radiological, Nuclear, and Explosive. Anthrax (Bacillus anthracis) and smallpox (variola virus) are biological agents. Biological agents include bacteria, viruses, and toxins that can be weaponized for terrorism or warfare.",
    difficulty: 1,
    category: "Operations/EMS Systems",
    topic: "WMD/CBRNE"
  },
  {
    id: "para-batch-359",
    stem: "What is the mechanism of action of nitroglycerin?",
    options: [
      "Beta-1 receptor blockade",
      "Conversion to nitric oxide causing venous and arterial vasodilation",
      "ACE inhibition reducing afterload",
      "Calcium channel blockade reducing heart rate"
    ],
    correctIndex: 1,
    rationale: "Nitroglycerin is converted to nitric oxide, which activates guanylate cyclase, increasing cGMP and causing relaxation of vascular smooth muscle. At lower doses, it primarily causes venodilation (reducing preload); at higher doses, it also causes arterial dilation (reducing afterload).",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Cardiac Medications"
  },
  {
    id: "para-batch-360",
    stem: "A paramedic arrives at a motor vehicle crash and identifies downed power lines across the vehicle. The appropriate action is to:",
    options: [
      "Attempt to move the power lines with a wooden pole",
      "Establish a safe perimeter and wait for the power company to de-energize the lines",
      "Immediately extract the patient from the vehicle",
      "Pour water on the power lines to ground them"
    ],
    correctIndex: 1,
    rationale: "Downed power lines should be considered energized until confirmed de-energized by the utility company. A safe perimeter (minimum 30 feet) should be established. Attempting to move power lines, even with wooden objects, is extremely dangerous. Patients should be advised to stay in the vehicle unless there is fire.",
    difficulty: 1,
    category: "Operations/EMS Systems",
    topic: "Scene Safety"
  },
  {
    id: "para-batch-361",
    stem: "Calcium chloride is indicated in the prehospital setting for:",
    options: [
      "Hyperkalemia with cardiac toxicity",
      "Hyponatremia",
      "Respiratory alkalosis",
      "Opioid overdose"
    ],
    correctIndex: 0,
    rationale: "Calcium chloride is indicated for hyperkalemia with cardiac toxicity (wide QRS, peaked T waves), calcium channel blocker overdose, and hypermagnesemia. It stabilizes the cardiac membrane. It is not used for hyponatremia, respiratory alkalosis, or opioid overdose.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Electrolyte Replacement"
  },
  {
    id: "para-batch-362",
    stem: "The Four Rights of medication administration include all of the following EXCEPT:",
    options: [
      "Right patient",
      "Right drug",
      "Right insurance verification",
      "Right dose"
    ],
    correctIndex: 2,
    rationale: "The traditional rights of medication administration include right patient, right drug, right dose, right route, and right time. Insurance verification is not part of the medication safety checks. Modern practice may include additional rights such as right documentation and right reason.",
    difficulty: 1,
    category: "Pharmacology",
    topic: "Medication Safety"
  },
  {
    id: "para-batch-363",
    stem: "Which of the following is the primary purpose of an after-action review (AAR) following a major incident?",
    options: [
      "To assign blame for errors that occurred",
      "To identify strengths and areas for improvement in the response",
      "To generate media press releases",
      "To determine which agency will pay for the response"
    ],
    correctIndex: 1,
    rationale: "An after-action review (AAR) is a structured debriefing that identifies what went well, what could be improved, and develops action items for future improvement. It is non-punitive and focused on system improvement. It is not used for blame assignment, media relations, or financial determinations.",
    difficulty: 2,
    category: "Operations/EMS Systems",
    topic: "Quality Improvement"
  },
  {
    id: "para-batch-364",
    stem: "Ketamine's mechanism of action involves:",
    options: [
      "GABA receptor agonism",
      "NMDA receptor antagonism producing dissociative anesthesia",
      "Opioid receptor agonism",
      "Alpha-2 adrenergic agonism"
    ],
    correctIndex: 1,
    rationale: "Ketamine is a dissociative anesthetic that works primarily by antagonizing NMDA (N-methyl-D-aspartate) glutamate receptors in the brain. This produces a state of dissociative anesthesia with analgesia, sedation, and amnesia while maintaining airway reflexes and spontaneous breathing.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Analgesics/Sedatives"
  },
  {
    id: "para-batch-365",
    stem: "In EMS, 'mutual aid' refers to:",
    options: [
      "Two paramedics working together on the same patient",
      "Agreements between agencies to provide resources and assistance to each other during emergencies",
      "The buddy system used during hazmat operations",
      "Cross-training between fire and EMS departments"
    ],
    correctIndex: 1,
    rationale: "Mutual aid agreements are formal or informal arrangements between neighboring EMS agencies, fire departments, or other emergency services to provide resources, personnel, and equipment to each other during large-scale emergencies or when resources are depleted.",
    difficulty: 1,
    category: "Operations/EMS Systems",
    topic: "EMS System Design"
  },
  {
    id: "para-batch-366",
    stem: "What is the adult dose of epinephrine 1:1,000 for anaphylaxis administered intramuscularly?",
    options: [
      "0.1 mg IM",
      "0.3-0.5 mg IM",
      "1.0 mg IM",
      "2.0 mg IM"
    ],
    correctIndex: 1,
    rationale: "The recommended adult dose of epinephrine for anaphylaxis is 0.3-0.5 mg (0.3-0.5 mL of 1:1,000 concentration) administered IM in the anterolateral thigh. The 1:10,000 concentration is reserved for IV use in cardiac arrest. The dose may be repeated every 5-15 minutes as needed.",
    difficulty: 2,
    category: "Pharmacology",
    topic: "Emergency Medications"
  },
  {
    id: "para-batch-367",
    stem: "HIPAA regulations in EMS primarily address:",
    options: [
      "Ambulance vehicle safety standards",
      "Protection of patient health information and privacy",
      "EMS provider certification requirements",
      "Insurance reimbursement rates"
    ],
    correctIndex: 1,
    rationale: "The Health Insurance Portability and Accountability Act (HIPAA) establishes federal standards for the protection of patient health information (PHI). In EMS, this applies to patient care reports, radio communications, and any handling of identifiable health information.",
    difficulty: 1,
    category: "Operations/EMS Systems",
    topic: "EMS Legal/Regulatory"
  },
  {
    id: "para-batch-368",
    stem: "A paramedic administers fentanyl to a trauma patient. Compared to morphine, fentanyl is:",
    options: [
      "Less potent but has a longer duration of action",
      "More potent with a shorter duration of action",
      "Equal in potency with the same duration",
      "Less potent with more histamine release"
    ],
    correctIndex: 1,
    rationale: "Fentanyl is approximately 80-100 times more potent than morphine with a shorter duration of action (30-60 minutes vs 3-4 hours). It also causes less histamine release than morphine, making it preferable for hemodynamically unstable patients and those with allergies.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Analgesics"
  },
  {
    id: "para-batch-369",
    stem: "Which of the following agencies is responsible for the development and maintenance of 911 systems?",
    options: [
      "Federal Communications Commission (FCC)",
      "National Highway Traffic Safety Administration (NHTSA)",
      "Local and state government agencies (PSAPs)",
      "The Joint Commission"
    ],
    correctIndex: 2,
    rationale: "Public Safety Answering Points (PSAPs) are operated by local and state government agencies and are responsible for receiving and dispatching 911 calls. The FCC regulates communications, NHTSA oversees EMS standards, and The Joint Commission accredits hospitals.",
    difficulty: 2,
    category: "Operations/EMS Systems",
    topic: "EMS System Organization"
  },
  {
    id: "para-batch-370",
    stem: "Methylprednisolone (Solu-Medrol) administered in the prehospital setting acts as a:",
    options: [
      "Beta-2 adrenergic agonist",
      "Corticosteroid with anti-inflammatory effects",
      "Antihistamine",
      "Mast cell stabilizer"
    ],
    correctIndex: 1,
    rationale: "Methylprednisolone is a synthetic corticosteroid with potent anti-inflammatory and immunosuppressive effects. In EMS, it is used for severe asthma/COPD exacerbations and severe allergic reactions. Its onset is delayed (4-6 hours for full effect), so it supplements rather than replaces acute bronchodilators and epinephrine.",
    difficulty: 2,
    category: "Pharmacology",
    topic: "Anti-inflammatory Agents"
  },
  {
    id: "para-batch-371",
    stem: "The Unified Command structure in ICS is used when:",
    options: [
      "Only one agency is responding to an incident",
      "Multiple agencies with jurisdictional authority are responding to the same incident",
      "The incident is small enough for a single officer to manage",
      "Federal agencies take over local incident command"
    ],
    correctIndex: 1,
    rationale: "Unified Command is used when multiple agencies with different jurisdictional responsibilities (e.g., fire, EMS, law enforcement, public health) respond to the same incident. It allows all agencies to manage the incident together by establishing a common set of objectives and strategies.",
    difficulty: 3,
    category: "Operations/EMS Systems",
    topic: "Incident Command System"
  },
  {
    id: "para-batch-372",
    stem: "Ondansetron (Zofran) is used in the prehospital setting as a:",
    options: [
      "Bronchodilator",
      "Antiemetic (5-HT3 receptor antagonist)",
      "Analgesic",
      "Antiarrhythmic"
    ],
    correctIndex: 1,
    rationale: "Ondansetron (Zofran) is a selective 5-HT3 (serotonin) receptor antagonist used as an antiemetic to prevent and treat nausea and vomiting. It works by blocking serotonin receptors in the chemoreceptor trigger zone and vagal nerve terminals. It does not treat pain, arrhythmias, or bronchospasm.",
    difficulty: 1,
    category: "Pharmacology",
    topic: "Antiemetics"
  },
  {
    id: "para-batch-373",
    stem: "Which of the following is a component of the EMS Emergency Preparedness cycle?",
    options: [
      "Mitigation, Preparedness, Response, Recovery",
      "Dispatch, Response, Treatment, Billing",
      "Assessment, Diagnosis, Treatment, Discharge",
      "Triage, Transport, Treatment, Transfer"
    ],
    correctIndex: 0,
    rationale: "The Emergency Preparedness cycle consists of four phases: Mitigation (reducing the impact of hazards), Preparedness (planning and training), Response (immediate actions during an emergency), and Recovery (restoring normal operations). This cycle applies to all levels of emergency management.",
    difficulty: 2,
    category: "Operations/EMS Systems",
    topic: "Emergency Preparedness"
  },
  {
    id: "para-batch-374",
    stem: "Norepinephrine (Levophed) primarily stimulates which adrenergic receptors?",
    options: [
      "Beta-2 receptors predominantly",
      "Alpha-1 and beta-1 receptors",
      "Dopaminergic receptors only",
      "Muscarinic receptors"
    ],
    correctIndex: 1,
    rationale: "Norepinephrine (Levophed) is a potent vasopressor that stimulates alpha-1 receptors (causing vasoconstriction) and beta-1 receptors (increasing cardiac contractility). It has minimal beta-2 activity. It is the first-line vasopressor for septic shock per current guidelines.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Vasopressors"
  },
  {
    id: "para-batch-375",
    stem: "Which type of EMS system uses both BLS and ALS providers responding to calls based on the severity of the emergency?",
    options: [
      "Single-tier system",
      "Tiered response system",
      "Third-service model",
      "Volunteer-only system"
    ],
    correctIndex: 1,
    rationale: "A tiered response system dispatches resources based on the type and severity of the call. BLS units respond to lower-acuity calls, while ALS (paramedic) units are dispatched for higher-acuity emergencies. This optimizes resource utilization by matching the level of care to patient needs.",
    difficulty: 1,
    category: "Operations/EMS Systems",
    topic: "EMS System Design"
  },
  {
    id: "para-batch-376",
    stem: "A paramedic is administering a medication via nebulizer. The particle size that most effectively reaches the lower airways is:",
    options: [
      "10-15 microns",
      "1-5 microns",
      "20-30 microns",
      "Greater than 50 microns"
    ],
    correctIndex: 1,
    rationale: "Particles in the 1-5 micron range are optimal for reaching the lower airways and alveoli. Particles larger than 5 microns tend to deposit in the upper airway and oropharynx. Particles smaller than 1 micron may be exhaled without depositing in the lungs.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Drug Delivery"
  },
  {
    id: "para-batch-377",
    stem: "The minimum PPE required for Standard Precautions in EMS includes:",
    options: [
      "Full hazmat suit and SCBA",
      "Gloves at minimum, with additional PPE based on anticipated exposure",
      "N95 respirator for all patient contacts",
      "Surgical gown and face shield for every call"
    ],
    correctIndex: 1,
    rationale: "Standard Precautions require gloves at minimum for all patient contacts, with additional PPE (mask, eye protection, gown) selected based on the anticipated type and extent of exposure to blood and body fluids. Full hazmat gear is for chemical exposures, and N95 respirators are for airborne precautions.",
    difficulty: 1,
    category: "Operations/EMS Systems",
    topic: "Infection Control"
  },
  {
    id: "para-batch-378",
    stem: "Vasopressin's role in cardiac arrest management is to:",
    options: [
      "Replace epinephrine as the primary vasopressor",
      "Act as a non-adrenergic vasopressor that may be used as an alternative to epinephrine",
      "Provide antiarrhythmic effects similar to amiodarone",
      "Promote diuresis to reduce pulmonary edema"
    ],
    correctIndex: 1,
    rationale: "Vasopressin (40 units IV) is a non-adrenergic vasopressor that may be used as an alternative to the first or second dose of epinephrine in cardiac arrest. It acts on V1 receptors to cause vasoconstriction. Current AHA guidelines suggest it may replace epinephrine but does not have antiarrhythmic properties.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Cardiac Arrest Medications"
  },
  {
    id: "para-batch-379",
    stem: "Which of the following is TRUE regarding an EMS provider's duty to act?",
    options: [
      "Off-duty paramedics are always legally required to stop and provide care at accident scenes",
      "On-duty EMS providers dispatched to a call have a legal duty to respond and provide care",
      "Duty to act only applies when a written contract exists between the provider and patient",
      "EMS providers can refuse to respond to any call they consider unsafe"
    ],
    correctIndex: 1,
    rationale: "On-duty EMS providers who are dispatched to a call have a legal duty to respond and provide appropriate care within their scope of practice. Failure to do so may constitute abandonment or negligence. Off-duty obligations vary by jurisdiction. While providers should consider scene safety, they cannot arbitrarily refuse dispatched calls.",
    difficulty: 2,
    category: "Operations/EMS Systems",
    topic: "EMS Legal/Ethical"
  },
  {
    id: "para-batch-380",
    stem: "The loading dose of amiodarone for pulseless VF/VT is:",
    options: [
      "150 mg IV/IO",
      "300 mg IV/IO",
      "450 mg IV/IO",
      "600 mg IV/IO"
    ],
    correctIndex: 1,
    rationale: "The initial loading dose of amiodarone for pulseless VF/VT is 300 mg IV/IO push. A second dose of 150 mg may be given if VF/VT persists. For stable wide-complex tachycardia, amiodarone is given as 150 mg IV over 10 minutes.",
    difficulty: 2,
    category: "Pharmacology",
    topic: "Cardiac Arrest Medications"
  },
  {
    id: "para-batch-381",
    stem: "Critical Incident Stress Management (CISM) in EMS is designed to:",
    options: [
      "Replace individual therapy for all EMS providers",
      "Provide structured support to help providers cope with traumatic events",
      "Diagnose PTSD in emergency responders",
      "Evaluate provider job performance after difficult calls"
    ],
    correctIndex: 1,
    rationale: "CISM is a comprehensive, multicomponent crisis intervention system that provides structured peer support and professional guidance to help EMS providers process and cope with traumatic events. It includes defusing, debriefing, and follow-up support. It does not replace professional therapy or serve as a diagnostic or evaluation tool.",
    difficulty: 2,
    category: "Operations/EMS Systems",
    topic: "Provider Wellness"
  },
  {
    id: "para-batch-382",
    stem: "Which of the following beta-blockers is most commonly used in the prehospital setting for rate control of rapid atrial fibrillation?",
    options: [
      "Atenolol",
      "Metoprolol (Lopressor)",
      "Propranolol",
      "Carvedilol"
    ],
    correctIndex: 1,
    rationale: "Metoprolol (Lopressor) is the most commonly used beta-blocker in the prehospital setting for rate control of atrial fibrillation and other supraventricular tachycardias. It is a selective beta-1 blocker given 5 mg IV over 5 minutes, which may be repeated. Atenolol, propranolol, and carvedilol are less commonly used in the field.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Beta-Blockers"
  },
  {
    id: "para-batch-383",
    stem: "What is the primary purpose of an Emergency Operations Plan (EOP)?",
    options: [
      "To document daily ambulance maintenance schedules",
      "To provide a comprehensive plan for responding to large-scale emergencies and disasters",
      "To outline employee vacation policies",
      "To manage insurance billing procedures"
    ],
    correctIndex: 1,
    rationale: "An Emergency Operations Plan (EOP) is a comprehensive document that outlines how an organization or community will respond to large-scale emergencies and disasters. It includes roles, responsibilities, resource management, communication plans, and coordination procedures for multi-agency responses.",
    difficulty: 1,
    category: "Operations/EMS Systems",
    topic: "Emergency Preparedness"
  },
  {
    id: "para-batch-384",
    stem: "Lidocaine, when used as an antiarrhythmic, works by:",
    options: [
      "Blocking calcium channels in the SA node",
      "Blocking sodium channels in ventricular myocardium, suppressing ventricular ectopy",
      "Stimulating beta-1 receptors to increase conduction velocity",
      "Blocking potassium channels to prolong the action potential"
    ],
    correctIndex: 1,
    rationale: "Lidocaine is a Class IB antiarrhythmic that blocks sodium channels in ventricular myocardium, suppressing automaticity and ventricular ectopy. It is used as an alternative to amiodarone for VF/pulseless VT. Calcium channel blockers include verapamil, and potassium channel blockers include amiodarone.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Antiarrhythmics"
  },
  {
    id: "para-batch-385",
    stem: "A paramedic discovers a controlled substance count discrepancy at the beginning of a shift. The correct action is to:",
    options: [
      "Ignore the discrepancy and continue the shift",
      "Report the discrepancy to the supervisor immediately and document the finding",
      "Add medications from personal supply to correct the count",
      "Wait until the end of the shift to report it"
    ],
    correctIndex: 1,
    rationale: "Any controlled substance discrepancy must be reported immediately to the supervisor and documented per agency policy. This protects the provider from suspicion and allows investigation. Ignoring or delaying the report violates DEA regulations and agency policy, and adding medications from other sources is illegal.",
    difficulty: 1,
    category: "Operations/EMS Systems",
    topic: "Controlled Substances"
  },
  {
    id: "para-batch-386",
    stem: "Diltiazem (Cardizem) is a calcium channel blocker used in EMS primarily for:",
    options: [
      "Converting ventricular fibrillation to sinus rhythm",
      "Rate control of atrial fibrillation and atrial flutter",
      "Treating symptomatic bradycardia",
      "Reversing opioid overdose"
    ],
    correctIndex: 1,
    rationale: "Diltiazem is a non-dihydropyridine calcium channel blocker that slows conduction through the AV node, making it effective for rate control of atrial fibrillation and atrial flutter. It is given as 0.25 mg/kg IV over 2 minutes. It is not used for VF, bradycardia, or opioid overdose.",
    difficulty: 2,
    category: "Pharmacology",
    topic: "Calcium Channel Blockers"
  },
  {
    id: "para-batch-387",
    stem: "Which of the following situations would require the paramedic to file a mandatory report?",
    options: [
      "A patient who trips and falls at home",
      "Suspected child abuse or neglect",
      "A patient who requests a specific hospital for transport",
      "A patient with a chronic medical condition"
    ],
    correctIndex: 1,
    rationale: "EMS providers are mandated reporters in all states and must report suspected child abuse or neglect to the appropriate authorities (child protective services, law enforcement). Other mandatory reporting situations may include elder abuse, domestic violence (varies by state), gunshot wounds, and certain infectious diseases.",
    difficulty: 1,
    category: "Operations/EMS Systems",
    topic: "EMS Legal/Ethical"
  },
  {
    id: "para-batch-388",
    stem: "Tranexamic acid (TXA) is administered in the prehospital setting for:",
    options: [
      "Pain management in trauma patients",
      "Inhibition of fibrinolysis to reduce hemorrhage in trauma",
      "Anticoagulation to prevent DVT during transport",
      "Treatment of bronchospasm"
    ],
    correctIndex: 1,
    rationale: "Tranexamic acid (TXA) is an antifibrinolytic agent that inhibits the breakdown of blood clots. In the prehospital setting, it is administered to hemorrhaging trauma patients within 3 hours of injury to reduce bleeding and mortality. It does not provide analgesia, anticoagulation, or bronchodilation.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Hemostatic Agents"
  },
  {
    id: "para-batch-389",
    stem: "What is the recommended compression-to-ventilation ratio for single-rescuer CPR in an adult?",
    options: [
      "15:2",
      "30:2",
      "15:1",
      "5:1"
    ],
    correctIndex: 1,
    rationale: "The recommended compression-to-ventilation ratio for single-rescuer adult CPR is 30:2 (30 compressions followed by 2 ventilations). This ratio maximizes coronary perfusion pressure by minimizing interruptions to chest compressions. The 15:2 ratio is used for two-rescuer infant and child CPR.",
    difficulty: 1,
    category: "Operations/EMS Systems",
    topic: "Cardiac Arrest Management"
  },
  {
    id: "para-batch-390",
    stem: "Etomidate is used in the prehospital setting primarily for:",
    options: [
      "Pain management",
      "Rapid sequence intubation as an induction agent",
      "Seizure management",
      "Bronchodilation"
    ],
    correctIndex: 1,
    rationale: "Etomidate is a short-acting hypnotic agent used primarily as an induction agent for rapid sequence intubation (RSI). Its advantages include hemodynamic stability, rapid onset (30-60 seconds), and short duration (3-5 minutes). It does not provide analgesia, is not typically used for seizures, and has no bronchodilator effects.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "RSI Medications"
  },
  {
    id: "para-batch-391",
    stem: "Succinylcholine, used during rapid sequence intubation, is classified as a:",
    options: [
      "Non-depolarizing neuromuscular blocker",
      "Depolarizing neuromuscular blocker",
      "Benzodiazepine",
      "Opioid"
    ],
    correctIndex: 1,
    rationale: "Succinylcholine is a depolarizing neuromuscular blocking agent that mimics acetylcholine at the neuromuscular junction, causing initial fasciculations followed by paralysis. Its rapid onset (45-60 seconds) and short duration (6-10 minutes) make it useful for RSI. It is contraindicated in hyperkalemia, burns >24 hours, and crush injuries.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "RSI Medications"
  },
  {
    id: "para-batch-392",
    stem: "Which of the following describes the correct landing zone (LZ) size for a helicopter?",
    options: [
      "50 x 50 feet minimum",
      "100 x 100 feet minimum",
      "200 x 200 feet minimum",
      "25 x 25 feet minimum"
    ],
    correctIndex: 1,
    rationale: "A helicopter landing zone should be a minimum of 100 x 100 feet (approximately 30 x 30 meters) on level ground, free of debris and obstacles. It should be marked at the corners and ideally have the wind direction indicated. Larger aircraft may require a bigger LZ.",
    difficulty: 2,
    category: "Operations/EMS Systems",
    topic: "Air Medical Operations"
  },
  {
    id: "para-batch-393",
    stem: "Rocuronium, a non-depolarizing neuromuscular blocker used for RSI, differs from succinylcholine in that it:",
    options: [
      "Has a shorter duration of action",
      "Has a longer duration of action and can be reversed with sugammadex",
      "Causes depolarization of the muscle cell membrane",
      "Has no contraindications"
    ],
    correctIndex: 1,
    rationale: "Rocuronium is a non-depolarizing neuromuscular blocker with a longer duration of action (30-60 minutes vs 6-10 minutes for succinylcholine). It can be reversed with sugammadex. It does not cause fasciculations or depolarization and is preferred when succinylcholine is contraindicated (hyperkalemia, burns).",
    difficulty: 3,
    category: "Pharmacology",
    topic: "RSI Medications"
  },
  {
    id: "para-batch-394",
    stem: "When establishing a staging area during a large incident, it should be located:",
    options: [
      "Within the hot zone for rapid access",
      "Close enough for rapid deployment but outside the hazard area",
      "At the hospital receiving patients",
      "At least 10 miles from the incident"
    ],
    correctIndex: 1,
    rationale: "The staging area should be close enough to allow rapid deployment of resources but located outside any hazard zones. It should be easily accessible, have adequate space for vehicles and personnel, and be upwind/uphill from any hazmat releases. It is managed by the Staging Area Manager under Operations.",
    difficulty: 2,
    category: "Operations/EMS Systems",
    topic: "Incident Command System"
  },
  {
    id: "para-batch-395",
    stem: "Which of the following medications is administered sublingually in the prehospital setting?",
    options: [
      "Epinephrine",
      "Nitroglycerin",
      "Amiodarone",
      "Naloxone"
    ],
    correctIndex: 1,
    rationale: "Nitroglycerin is commonly administered sublingually (under the tongue) as a tablet or spray for rapid absorption through the sublingual mucosa. This route provides rapid onset of action (1-3 minutes). Epinephrine is given IM/IV, amiodarone IV, and naloxone can be given IV/IM/IN.",
    difficulty: 1,
    category: "Pharmacology",
    topic: "Drug Delivery Routes"
  },
  {
    id: "para-batch-396",
    stem: "The concept of 'abandonment' in EMS refers to:",
    options: [
      "Leaving the ambulance unattended at the station",
      "Terminating care of a patient without transferring to an equal or higher level of care",
      "Refusing to respond to a call during off-duty hours",
      "Declining to perform a procedure outside the scope of practice"
    ],
    correctIndex: 1,
    rationale: "Abandonment occurs when an EMS provider initiates patient care and then terminates it without ensuring the patient is transferred to a provider of equal or higher training level. This can result in civil and criminal liability. Declining off-duty response or out-of-scope procedures is not abandonment.",
    difficulty: 2,
    category: "Operations/EMS Systems",
    topic: "EMS Legal/Ethical"
  },
  {
    id: "para-batch-397",
    stem: "Activated charcoal is administered for poisoning to:",
    options: [
      "Induce vomiting to remove the ingested substance",
      "Adsorb the ingested toxin in the GI tract to prevent systemic absorption",
      "Neutralize the toxic substance through a chemical reaction",
      "Stimulate hepatic metabolism of the toxin"
    ],
    correctIndex: 1,
    rationale: "Activated charcoal works by adsorbing (binding to its surface) toxins in the GI tract, preventing systemic absorption. It is most effective when given within 1-2 hours of ingestion. It is not effective for alcohols, metals, or caustics. It does not induce vomiting, neutralize chemicals, or enhance hepatic metabolism.",
    difficulty: 2,
    category: "Pharmacology",
    topic: "Toxicology"
  },
  {
    id: "para-batch-398",
    stem: "Which portable radio communication issue occurs when a transmission is blocked because another user is transmitting on the same frequency?",
    options: [
      "Dead spot",
      "Stepped on (simultaneous transmission)",
      "Frequency drift",
      "Channel bleed"
    ],
    correctIndex: 1,
    rationale: "When two users transmit simultaneously on the same frequency, their transmissions interfere with each other, a situation known as being 'stepped on.' Neither transmission is received clearly. Dead spots are areas with poor reception, frequency drift is a technical malfunction, and channel bleed is interference from adjacent frequencies.",
    difficulty: 2,
    category: "Operations/EMS Systems",
    topic: "Communications"
  },
  {
    id: "para-batch-399",
    stem: "Labetalol is unique among beta-blockers because it also:",
    options: [
      "Stimulates beta-2 receptors",
      "Blocks alpha-1 adrenergic receptors, providing vasodilation",
      "Acts as an ACE inhibitor",
      "Blocks muscarinic receptors"
    ],
    correctIndex: 1,
    rationale: "Labetalol is a combined alpha-1 and beta (non-selective) adrenergic blocker. The alpha-1 blockade provides vasodilation, while beta-blockade reduces heart rate and contractility. This combination makes it effective for acute hypertensive emergencies, including pre-eclampsia.",
    difficulty: 3,
    category: "Pharmacology",
    topic: "Antihypertensives"
  },
  {
    id: "para-batch-400",
    stem: "What is the primary purpose of the Ryan White HIV/AIDS Treatment Extension Act for EMS providers?",
    options: [
      "To require HIV testing of all EMS patients",
      "To establish a notification system for EMS providers who may have been exposed to infectious diseases",
      "To mandate that all EMS providers receive HIV vaccinations",
      "To prohibit EMS providers from treating HIV-positive patients"
    ],
    correctIndex: 1,
    rationale: "The Ryan White Act establishes a notification system that allows EMS providers to be informed if they have been exposed to potentially life-threatening infectious diseases (including HIV) during patient care. It does not mandate testing of patients, vaccinations, or limit patient care based on disease status.",
    difficulty: 2,
    category: "Operations/EMS Systems",
    topic: "EMS Legal/Regulatory"
  }
];
