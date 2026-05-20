import type { PerioperativeQuestion } from "./types";

export const emergencySituationsQuestions: PerioperativeQuestion[] = [
  {
    stem: "During a total hip arthroplasty under general anesthesia, the anesthesiologist reports rapidly rising end-tidal CO2, masseter muscle rigidity, and the patient's temperature has increased from 36.5°C to 38.8°C over the past 20 minutes. Heart rate is 140 bpm and the arterial blood gas shows mixed respiratory and metabolic acidosis. What is the FIRST medication the nurse should prepare?",
    options: [
      "Succinylcholine to manage the muscle rigidity",
      "Dantrolene sodium 2.5 mg/kg IV, reconstituted with sterile water for injection",
      "Propofol 2 mg/kg IV for rapid sequence intubation",
      "Calcium chloride 10 mg/kg IV for cardiac stabilization"
    ],
    correctAnswer: 1,
    rationaleLong: "This clinical presentation is classic for malignant hyperthermia (MH), a pharmacogenetic disorder triggered by volatile anesthetic agents and/or succinylcholine. The hallmark findings include: rapidly rising ETCO2 (the earliest and most sensitive sign), muscle rigidity (particularly masseter spasm), tachycardia, rapidly rising body temperature, mixed acidosis, and dark-colored urine (from myoglobinuria secondary to rhabdomyolysis). Dantrolene sodium is the ONLY specific treatment for MH and must be administered as early as possible. The initial dose is 2.5 mg/kg IV, repeated every 5-10 minutes until symptoms resolve, with no upper dose limit (though most cases respond to less than 10 mg/kg total). Dantrolene works by inhibiting calcium release from the sarcoplasmic reticulum, directly addressing the underlying pathophysiology of MH (uncontrolled intracellular calcium release in skeletal muscle). The reconstitution of dantrolene requires sterile water for injection — NOT normal saline, dextrose solutions, or bacteriostatic water, as these can cause precipitation or hemolysis. Traditional dantrolene (Dantrium) requires 60 mL of sterile water per 20 mg vial and must be vigorously shaken, making reconstitution time-consuming (36 vials needed for a 70 kg patient). Newer formulations (Ryanodex) require only 5 mL per 250 mg vial, dramatically reducing preparation time. Additional measures include: discontinuing all volatile agents, hyperventilating with 100% oxygen at high flows, cooling the patient, treating hyperkalemia, and obtaining serial ABGs, CK, and myoglobin levels.",
    learningObjective: "Recognize malignant hyperthermia and initiate dantrolene sodium as the first-line pharmacologic intervention",
    blueprintCategory: "Emergency Situations",
    subtopic: "malignant hyperthermia",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Succinylcholine TRIGGERS MH — never administer it to treat MH. Dantrolene must be reconstituted with STERILE WATER, not normal saline.",
    clinicalPearls: [
      "Dantrolene 2.5 mg/kg IV is the ONLY specific treatment for MH — reconstitute with sterile water only",
      "Earliest sign of MH: rapidly rising ETCO2, often before temperature elevation",
      "MH triggers: succinylcholine and all volatile anesthetic agents (sevoflurane, desflurane, isoflurane)"
    ],
    safetyNote: "Every OR suite must have a minimum of 36 vials of dantrolene (or equivalent) immediately available — verify daily",
    distractorRationales: [
      "Succinylcholine is a MH trigger and absolutely contraindicated — it would worsen the crisis",
      "Propofol is not a treatment for MH — while it does not trigger MH, it does not address the pathophysiology",
      "Calcium chloride is contraindicated because it would worsen the hypercalcemia that drives MH pathophysiology"
    ]
  },
  {
    stem: "A surgical fire erupts on the patient's chest during an ENT procedure. Supplemental oxygen is being delivered via nasal cannula at 4 L/min. What is the CORRECT sequence of actions per the surgical fire response protocol?",
    options: [
      "Evacuate the room, activate the fire alarm, attempt to extinguish the fire, then stop the flow of oxygen",
      "Stop the flow of oxidizing gases (oxygen), remove the burning material from the patient, extinguish the fire on the patient, then care for the patient and activate the fire alarm if the fire is not contained",
      "Activate the fire alarm first, then attempt to extinguish the fire with a CO2 extinguisher while continuing oxygen delivery",
      "Cover the fire with sterile wet towels, maintain oxygen flow to prevent hypoxia, and call for help"
    ],
    correctAnswer: 1,
    rationaleLong: "The surgical fire response follows a specific protocol designed to minimize patient injury. When a fire occurs ON the patient (as opposed to a fire elsewhere in the OR), the priority sequence is: (1) STOP the flow of all oxidizing gases (oxygen, nitrous oxide, air) — supplemental oxygen feeds and intensifies the fire, and removing the oxidizer is the single most effective action to suppress the fire; (2) REMOVE the burning material from the patient — pull away drapes, sponges, and any burning items from the patient's body; (3) EXTINGUISH the fire — use saline, water, smothering (wet towels), or a fire extinguisher on the burning materials that have been removed from the patient (avoid spraying CO2 extinguisher directly on the patient as it can cause frostbite and tissue injury); (4) CARE for the patient — assess for burns, airway injury (especially with fires near the face/airway), and provide appropriate treatment; (5) If the fire is not immediately contained, activate the fire alarm, close the OR door, and consider evacuation. The acronym used by AORN is 'RACE' for fires away from the patient (Rescue, Alarm, Contain, Extinguish/Evacuate), but for fires ON the patient, the priority is to stop oxygen flow first. Maintaining oxygen during an active fire is extremely dangerous and will intensify the flame. The ECRI Institute identifies the operating room as one of the highest-risk environments for fires due to the simultaneous presence of all three fire triangle components.",
    learningObjective: "Implement the correct sequence of actions for a surgical fire occurring on the patient, prioritizing removal of oxidizing gases",
    blueprintCategory: "Emergency Situations",
    subtopic: "surgical fire response",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "For fires ON the patient: Stop O2 FIRST, remove burning material, extinguish, care for patient. Do NOT continue O2 flow during an active fire.",
    clinicalPearls: [
      "Fire ON patient priority: stop O2 → remove burning material → extinguish → care for patient",
      "Supplemental oxygen is the single greatest accelerant in OR fires — stopping it is the most important first action",
      "Avoid spraying CO2 extinguisher directly on the patient — frostbite and tissue injury risk"
    ],
    safetyNote: "Practice OR fire drills regularly — the response sequence must be automatic when a fire occurs",
    distractorRationales: [
      "Evacuating first delays critical interventions on the patient who is on fire",
      "Activating the alarm first is appropriate for fires AWAY from the patient, not fires ON the patient",
      "Maintaining oxygen flow feeds the fire and dramatically worsens the situation"
    ]
  },
  {
    stem: "During a cesarean section, the patient develops sudden onset of cardiovascular collapse with hypotension (BP 60/30), tachycardia (HR 148), severe dyspnea, and SPO2 of 78%. The anesthesiologist notes disseminated intravascular coagulation (DIC) on laboratory studies and the patient has a generalized seizure. What is the MOST likely diagnosis?",
    options: [
      "Eclamptic seizure with HELLP syndrome",
      "Amniotic fluid embolism (AFE) — a catastrophic obstetric emergency with high mortality",
      "Massive pulmonary embolism from deep vein thrombosis",
      "Anaphylaxis from IV antibiotic administration"
    ],
    correctAnswer: 1,
    rationaleLong: "Amniotic fluid embolism (AFE) is a rare but catastrophic obstetric emergency with a mortality rate of 20-60%. It occurs when amniotic fluid components (fetal cells, hair, vernix, meconium, and prostaglandins) enter the maternal circulation, typically through disrupted uterine veins during cesarean section, vaginal delivery, or amniotomy. The classic triad of AFE is: (1) sudden cardiovascular collapse (hypotension, cardiac arrest), (2) respiratory failure (severe hypoxia, pulmonary edema, ARDS), and (3) disseminated intravascular coagulation (DIC) with massive hemorrhage. Seizures occur in approximately 10-20% of cases. The pathophysiology involves an anaphylactoid-type inflammatory response triggered by the amniotic fluid components, causing massive pulmonary vasoconstriction, right heart failure, left ventricular dysfunction, and activation of the coagulation cascade. Treatment is entirely supportive: aggressive fluid resuscitation, vasopressors, inotropic support, intubation and mechanical ventilation, blood product replacement for DIC (packed RBCs, FFP, cryoprecipitate, platelets), and preparation for possible perimortem cesarean section if the fetus has not been delivered. The perioperative nurse must immediately assist with CPR if cardiac arrest occurs, prepare massive transfusion protocol blood products, ensure the crash cart is at bedside, and support the anesthesia and obstetric teams in managing this crisis.",
    learningObjective: "Recognize the classic triad of amniotic fluid embolism and initiate appropriate supportive care for this catastrophic obstetric emergency",
    blueprintCategory: "Emergency Situations",
    subtopic: "amniotic fluid embolism",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "AFE classic triad: sudden cardiovascular collapse + respiratory failure + DIC. The presence of DIC distinguishes AFE from simple PE or anaphylaxis.",
    clinicalPearls: [
      "AFE triad: cardiovascular collapse, respiratory failure, DIC — mortality 20-60%",
      "Treatment is entirely supportive — no specific antidote exists",
      "DIC is the key distinguishing feature from PE and eclampsia"
    ],
    safetyNote: "Activate massive transfusion protocol immediately when AFE is suspected — DIC causes rapid, massive hemorrhage",
    distractorRationales: [
      "Eclampsia can cause seizures but does not typically present with sudden cardiovascular collapse and DIC simultaneously",
      "Massive PE causes cardiovascular collapse but typically does not cause DIC",
      "Anaphylaxis presents with urticaria and bronchospasm — DIC is not a feature of anaphylaxis"
    ]
  },
  {
    stem: "A patient under general anesthesia for an abdominal procedure develops sudden onset of increased peak airway pressures (from 22 to 45 cmH2O), absent breath sounds on the right chest, tracheal deviation to the left, hypotension, and tachycardia. What is the PRIORITY intervention?",
    options: [
      "Order an emergent chest X-ray to confirm the diagnosis",
      "Perform immediate needle decompression with a 14-gauge angiocatheter at the second intercostal space, midclavicular line on the right side",
      "Increase the tidal volume on the ventilator to overcome the increased airway resistance",
      "Administer IV epinephrine 1 mg for suspected anaphylaxis"
    ],
    correctAnswer: 1,
    rationaleLong: "This presentation is classic for a tension pneumothorax — a life-threatening surgical emergency that requires immediate intervention without waiting for radiographic confirmation. The findings include: dramatically increased peak airway pressures (indicating increased intrathoracic pressure preventing lung expansion), absent breath sounds on the affected side (collapsed lung), tracheal deviation away from the affected side (the expanding tension pushes the mediastinum to the opposite side), hypotension (the increased intrathoracic pressure compresses the superior and inferior vena cava, reducing venous return and cardiac output), and tachycardia (compensatory response to decreased cardiac output). Tension pneumothorax can occur intraoperatively from: positive pressure ventilation with barotrauma, central line placement, surgical dissection near the pleura, or extension of a simple pneumothorax. The priority intervention is immediate needle decompression — inserting a 14-gauge (or larger) angiocatheter at the second intercostal space in the midclavicular line on the affected side. This converts the tension pneumothorax to a simple pneumothorax by releasing the trapped air, immediately relieving the hemodynamic compromise. This is followed by chest tube placement for definitive management. Waiting for an X-ray delays a life-saving intervention — tension pneumothorax is a clinical diagnosis. The circulating nurse should prepare the needle decompression supplies and chest tube tray.",
    learningObjective: "Recognize intraoperative tension pneumothorax and facilitate immediate needle decompression without waiting for radiographic confirmation",
    blueprintCategory: "Emergency Situations",
    subtopic: "tension pneumothorax",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Tension pneumothorax is a CLINICAL diagnosis — do NOT wait for X-ray confirmation. Needle decompression: 14-gauge at 2nd intercostal space, midclavicular line, AFFECTED side.",
    clinicalPearls: [
      "Tension pneumothorax: absent breath sounds, tracheal deviation AWAY from affected side, hypotension, increased airway pressures",
      "Clinical diagnosis — treat immediately with needle decompression, do not wait for X-ray",
      "Follow needle decompression with definitive chest tube placement"
    ],
    safetyNote: "Tension pneumothorax causes obstructive shock and cardiac arrest if not immediately treated — every second of delay increases mortality",
    distractorRationales: [
      "Waiting for X-ray delays life-saving treatment — tension pneumothorax is treated based on clinical findings",
      "Increasing tidal volume against a tension pneumothorax worsens the situation by adding more pressure to the affected side",
      "The clinical presentation is not consistent with anaphylaxis — absent unilateral breath sounds and tracheal deviation point to pneumothorax"
    ]
  },
  {
    stem: "During a spinal fusion procedure, the surgical team estimates blood loss of 2,500 mL. The patient's preoperative hemoglobin was 14 g/dL and current hemoglobin is 7.2 g/dL. The patient's blood pressure is 88/52 mmHg and heart rate is 118 bpm. The circulating nurse should prepare for which intervention?",
    options: [
      "Administer crystalloid fluid bolus only, as transfusion is not indicated until hemoglobin falls below 6 g/dL",
      "Activate the massive transfusion protocol to provide packed red blood cells, fresh frozen plasma, and platelets in a balanced ratio",
      "Administer a single unit of packed red blood cells and reassess hemoglobin in 4 hours",
      "Administer IV iron and erythropoietin to stimulate red blood cell production"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with hemorrhagic shock class III-IV based on the estimated blood loss of 2,500 mL (approximately 50% of blood volume in a 70 kg adult), hemodynamic instability (hypotension and tachycardia), and a significant drop in hemoglobin from 14 to 7.2 g/dL. The massive transfusion protocol (MTP) should be activated. MTP is triggered when a patient is expected to require 10 or more units of packed red blood cells (PRBCs) in 24 hours, or when ongoing hemorrhage with hemodynamic instability is present. Current evidence-based massive transfusion guidelines recommend a balanced ratio of blood products, typically 1:1:1 ratio of PRBCs to fresh frozen plasma (FFP) to platelets (platelet pheresis unit), based on findings from the PROPPR trial. This balanced approach addresses not only the oxygen-carrying capacity (PRBCs) but also the coagulopathy that develops from hemorrhage and dilution (FFP provides clotting factors, platelets provide hemostatic function). The circulating nurse should: activate the MTP per institutional protocol, ensure large-bore IV access and a rapid infusion device are available, prepare a blood warmer (cold blood products can cause hypothermia-induced coagulopathy), draw serial labs including hemoglobin, platelets, PT/INR, fibrinogen, and assist with monitoring and resuscitation. The 'lethal triad' of trauma is hypothermia, acidosis, and coagulopathy — all three must be addressed simultaneously during massive hemorrhage.",
    learningObjective: "Recognize indications for massive transfusion protocol activation and implement balanced blood product resuscitation",
    blueprintCategory: "Emergency Situations",
    subtopic: "massive hemorrhage",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Massive transfusion uses a balanced 1:1:1 ratio (PRBCs:FFP:platelets). A single unit and reassess approach is too conservative for a hemodynamically unstable patient with 2,500 mL blood loss.",
    clinicalPearls: [
      "MTP: 1:1:1 ratio of PRBCs:FFP:platelets based on PROPPR trial evidence",
      "Lethal triad: hypothermia, acidosis, coagulopathy — all must be addressed simultaneously",
      "Use blood warmer and rapid infusion device during massive transfusion"
    ],
    safetyNote: "Verify patient blood type and crossmatch — if uncrossmatched blood is needed emergently, use O-negative (or O-positive for males)",
    distractorRationales: [
      "Crystalloid alone cannot restore oxygen-carrying capacity and will worsen dilutional coagulopathy",
      "A single unit and reassess approach is appropriate for stable patients, not for hemorrhagic shock",
      "IV iron and erythropoietin act over days to weeks and have no role in acute hemorrhage management"
    ]
  },
  {
    stem: "During a laparoscopic procedure under general anesthesia, the patient develops sudden hypotension (BP 65/40), oxygen saturation drops to 82%, and the ETCO2 drops to 12 mmHg. The ECG shows sinus tachycardia at 140 bpm progressing to pulseless electrical activity (PEA). What is the MOST likely cause?",
    options: [
      "Vagal response from peritoneal stretching during insufflation",
      "Massive venous gas embolism causing right heart outflow obstruction",
      "Myocardial infarction from coronary artery disease",
      "Medication error with overdose of the volatile anesthetic agent"
    ],
    correctAnswer: 1,
    rationaleLong: "The sudden onset of profound hypotension, desaturation, and dramatic drop in ETCO2 (from normal to 12 mmHg) progressing to PEA during a laparoscopic procedure is most consistent with a massive venous gas (CO2) embolism. During laparoscopy, CO2 is insufflated into the peritoneal (or retroperitoneal) cavity, and if a large vessel is inadvertently cannulated by the Veress needle or trocar, or if CO2 enters open venous channels, a massive gas embolism can result. A large bolus of gas in the venous system creates a gas lock in the right heart, obstructing blood flow through the pulmonary vasculature. This causes: sudden cardiovascular collapse (the right heart cannot pump effectively against the gas lock), dramatic decrease in ETCO2 (no blood reaching the lungs for gas exchange = no CO2 being exhaled), rapid desaturation (no pulmonary blood flow = no oxygenation), and progression to cardiac arrest (PEA or asystole). Treatment includes: immediately stop insufflation and desufflate the abdomen, place the patient in left lateral decubitus position with head down (Durant maneuver — to trap the air in the apex of the right ventricle away from the outflow tract), administer 100% oxygen, initiate CPR if pulseless, and consider central line aspiration of the gas lock. The ETCO2 initially spikes (as absorbed CO2 reaches the lungs) then drops precipitously (as cardiac output fails) — the dramatic DROP in ETCO2 is the critical indicator of cardiovascular collapse.",
    learningObjective: "Recognize massive venous gas embolism during laparoscopy and implement immediate treatment including the Durant maneuver",
    blueprintCategory: "Emergency Situations",
    subtopic: "gas embolism",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "ETCO2 DROP to near-zero during laparoscopy = cardiovascular collapse from gas embolism. Durant maneuver: left lateral decubitus, head down, to trap gas in RV apex.",
    clinicalPearls: [
      "Massive gas embolism: sudden hypotension, desaturation, ETCO2 drop, mill wheel murmur, PEA/arrest",
      "Durant maneuver: left lateral decubitus + Trendelenburg to trap gas in RV apex",
      "Stop insufflation immediately and desufflate the abdomen"
    ],
    safetyNote: "Have the CO2 insufflator pressure limited to <15 mmHg and monitor for signs of gas embolism throughout all laparoscopic procedures",
    distractorRationales: [
      "Vagal response causes bradycardia and hypotension but not desaturation and PEA with ETCO2 of 12",
      "MI can cause hemodynamic compromise but the dramatic ETCO2 drop and relationship to laparoscopy points to gas embolism",
      "Anesthetic overdose causes gradual hemodynamic depression, not the sudden catastrophic presentation described"
    ]
  },
  {
    stem: "A patient in the PACU develops laryngospasm immediately after extubation. The patient is making high-pitched crowing sounds and demonstrating use of accessory muscles. SpO2 is dropping from 96% to 88%. What is the FIRST intervention?",
    options: [
      "Reintubate the patient immediately with a larger endotracheal tube",
      "Apply continuous positive pressure with 100% oxygen via face mask with jaw thrust, and suction the oropharynx to remove secretions that may be triggering the spasm",
      "Administer IV dexamethasone 10 mg to reduce airway edema",
      "Place the patient in a prone position to facilitate drainage of secretions"
    ],
    correctAnswer: 1,
    rationaleLong: "Laryngospasm is a reflex closure of the vocal cords that partially or completely obstructs the airway. It is one of the most common airway emergencies in the immediate postoperative period, particularly in pediatric patients, after airway surgery, and after procedures with significant secretions or blood in the pharynx. The first-line intervention for laryngospasm is a combination of: (1) Apply firm, continuous positive airway pressure (CPAP) using a tight-fitting face mask with 100% oxygen — the positive pressure helps to 'break' the laryngospasm by pushing against the closed vocal cords; (2) Perform a jaw thrust maneuver — lifting the mandible anteriorly opens the airway and may stimulate reflex opening of the vocal cords through the Larson maneuver (applying firm pressure in the 'laryngospasm notch' behind the earlobe between the mastoid process and the ascending ramus of the mandible); (3) Suction the oropharynx — secretions, blood, or mucus in the pharynx are common triggers for laryngospasm, and removing them can facilitate resolution. If these maneuvers fail and the spasm is complete (no air movement despite positive pressure), a small dose of IV succinylcholine (0.1-0.5 mg/kg) may be administered to paralyze the vocal cord muscles and break the spasm, followed by ventilation and possible re-intubation. Immediate re-intubation without attempting positive pressure and jaw thrust is premature and unnecessary for most cases of laryngospasm.",
    learningObjective: "Implement first-line interventions for post-extubation laryngospasm including positive pressure ventilation and jaw thrust",
    blueprintCategory: "Emergency Situations",
    subtopic: "airway emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Laryngospasm first line: CPAP with 100% O2 + jaw thrust + suction. Succinylcholine (0.1-0.5 mg/kg) is reserved for refractory complete spasm.",
    clinicalPearls: [
      "First line: CPAP + jaw thrust + suction; second line: succinylcholine for refractory complete spasm",
      "Larson maneuver: firm pressure in the laryngospasm notch behind the earlobe can break the spasm",
      "Common triggers: blood/secretions in pharynx, light anesthesia during extubation, airway manipulation"
    ],
    safetyNote: "Have succinylcholine and intubation equipment immediately available in PACU for managing refractory laryngospasm",
    distractorRationales: [
      "Immediate reintubation is premature — most laryngospasm responds to positive pressure and jaw thrust",
      "Dexamethasone treats edema but does not address the acute muscular spasm of the vocal cords",
      "Prone positioning is not indicated for laryngospasm management and delays definitive airway intervention"
    ]
  },
  {
    stem: "A patient develops anaphylaxis during induction of anesthesia. Urticaria, bronchospasm, and severe hypotension (BP 55/30) develop within minutes of IV antibiotic administration. What is the FIRST-LINE medication?",
    options: [
      "Diphenhydramine 50 mg IV for histamine blockade",
      "Epinephrine — for intraoperative anaphylaxis, administer 10-100 mcg IV (titrated doses) for cardiovascular support and bronchodilation",
      "Methylprednisolone 125 mg IV to prevent a biphasic reaction",
      "Albuterol nebulizer for bronchospasm management"
    ],
    correctAnswer: 1,
    rationaleLong: "Epinephrine is the FIRST-LINE medication for anaphylaxis in any setting, including the intraoperative environment. It is the only medication that addresses all components of the anaphylactic response: (1) alpha-1 adrenergic effects cause vasoconstriction, raising blood pressure and reducing mucosal edema; (2) beta-1 effects increase heart rate and contractility, supporting cardiac output; (3) beta-2 effects cause bronchodilation, reversing bronchospasm; and (4) it inhibits further mast cell and basophil degranulation, reducing the release of additional histamine and inflammatory mediators. In the intraoperative setting, where the patient has IV access and continuous monitoring, epinephrine is administered IV in titrated doses of 10-100 mcg (0.01-0.1 mg), which is different from the IM dose of 0.3-0.5 mg used in non-monitored settings. The IV titration approach allows the anesthesiologist to titrate to effect while monitoring the hemodynamic response. An epinephrine infusion may be needed for sustained hypotension. While diphenhydramine (H1 blocker), corticosteroids, and bronchodilators are all part of anaphylaxis management, they are ADJUNCTIVE therapies. Diphenhydramine blocks histamine receptors but does not address vasodilation, bronchospasm, or ongoing mediator release as effectively as epinephrine. Corticosteroids take hours to have an effect and prevent biphasic reactions but do not treat the acute event. Albuterol treats bronchospasm but does not address the cardiovascular collapse.",
    learningObjective: "Identify epinephrine as the first-line treatment for intraoperative anaphylaxis and understand the IV dosing approach",
    blueprintCategory: "Emergency Situations",
    subtopic: "anaphylaxis management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Intraoperative anaphylaxis: epinephrine IV 10-100 mcg titrated (NOT 0.3 mg IM as in outpatient settings). Diphenhydramine is adjunctive, not first-line.",
    clinicalPearls: [
      "Epinephrine is the ONLY first-line treatment for anaphylaxis — it addresses all components of the reaction",
      "IV anaphylaxis dosing: 10-100 mcg titrated (not the 0.3-0.5 mg IM dose used outside the OR)",
      "Common intraoperative triggers: neuromuscular blocking agents, antibiotics, latex, blood products"
    ],
    safetyNote: "Delay in epinephrine administration is the primary factor associated with fatal anaphylaxis — administer immediately when anaphylaxis is recognized",
    distractorRationales: [
      "Diphenhydramine blocks histamine but does not address vasodilation, bronchospasm, or ongoing mediator release",
      "Corticosteroids take hours to work and do not treat the acute hemodynamic collapse",
      "Albuterol treats bronchospasm but does not address the cardiovascular collapse"
    ]
  },
  {
    stem: "During a cardiac catheterization, the patient develops sustained ventricular tachycardia with a pulse. Blood pressure is 82/50 mmHg and the patient is becoming increasingly altered. What is the appropriate intervention?",
    options: [
      "Administer amiodarone 150 mg IV over 10 minutes and monitor",
      "Perform synchronized cardioversion at 100 joules, as the patient has hemodynamically unstable ventricular tachycardia with a pulse",
      "Initiate CPR and defibrillate at 200 joules biphasic",
      "Administer adenosine 6 mg IV rapid push"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has hemodynamically unstable ventricular tachycardia (VT) with a pulse — evidenced by hypotension (BP 82/50) and altered mental status despite having a palpable pulse. According to ACLS guidelines, hemodynamically unstable tachycardia with a pulse requires immediate synchronized cardioversion. Synchronized cardioversion delivers the electrical shock timed to the R wave of the QRS complex, which avoids delivering the shock during the vulnerable period of the cardiac cycle (relative refractory period) where it could degenerate the rhythm to ventricular fibrillation. Initial energy for synchronized cardioversion of monomorphic VT is typically 100 joules (biphasic), increasing in a stepwise fashion if unsuccessful. Key points for the perioperative nurse: ensure the defibrillator is in SYNCHRONIZED mode (indicated by sync markers on the QRS complexes), apply adhesive electrode pads in the anterior-lateral or anterior-posterior position, sedate the patient if time allows and the patient is conscious (but do not delay cardioversion for sedation if the patient is decompensating), and clear all personnel from contact with the patient before delivering the shock. If the patient becomes pulseless at any point, switch to defibrillation mode (unsynchronized) and follow the VF/pVT algorithm. Amiodarone is appropriate for stable VT, not unstable VT. CPR and defibrillation are for pulseless rhythms. Adenosine is for supraventricular tachycardia, not ventricular tachycardia.",
    learningObjective: "Differentiate between synchronized cardioversion for unstable VT with a pulse and defibrillation for pulseless VT/VF",
    blueprintCategory: "Emergency Situations",
    subtopic: "cardiac emergencies",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Unstable VT WITH a pulse = synchronized cardioversion. Pulseless VT/VF = unsynchronized defibrillation. Ensure the defibrillator is in SYNC mode.",
    clinicalPearls: [
      "Unstable tachycardia with pulse = synchronized cardioversion; pulseless = defibrillation (unsynchronized)",
      "Synchronized mode times the shock to the R wave to avoid triggering VF",
      "If patient becomes pulseless during cardioversion attempt, switch to defibrillation mode"
    ],
    safetyNote: "Always verify the defibrillator is in SYNCHRONIZED mode before cardioversion — unsynchronized shock on VT with a pulse could cause VF",
    distractorRationales: [
      "Amiodarone is for hemodynamically STABLE VT — unstable VT requires immediate electrical cardioversion",
      "CPR and defibrillation are for pulseless rhythms — this patient has a pulse",
      "Adenosine is for SVT with a narrow complex — it is not effective for ventricular tachycardia"
    ]
  },
  {
    stem: "A patient in the lateral decubitus position for a thoracotomy develops sudden cardiovascular collapse with hemodynamic instability. The surgeon discovers massive hemorrhage from a pulmonary artery tear. What is the circulating nurse's PRIORITY action?",
    options: [
      "Call for additional sutures for the surgeon to repair the tear",
      "Activate the massive transfusion protocol, ensure large-bore IV access, and prepare the rapid infusion device while communicating the emergency to the charge nurse for additional support",
      "Prepare to reposition the patient to supine for better CPR access",
      "Page the hospital chaplain for family notification"
    ],
    correctAnswer: 1,
    rationaleLong: "When a major vascular injury causes massive hemorrhage during surgery, the circulating nurse's priority is to support the resuscitation effort by ensuring adequate vascular access, blood product availability, and team communication. The immediate priorities are: (1) Activate the massive transfusion protocol (MTP) — this alerts the blood bank to begin preparing blood products in balanced ratios (typically 1:1:1 PRBCs:FFP:platelets) and mobilizes the institutional resources needed for massive transfusion; (2) Ensure large-bore IV access — at least two large-bore (14-16 gauge) peripheral IVs or a rapid infusion catheter should be in place; (3) Set up the rapid infusion device — this specialized device can warm and deliver blood products at rates of 500-1,500 mL/min, far exceeding standard IV pump capabilities; (4) Communicate the emergency — notify the charge nurse for additional personnel (additional nurses, anesthesia support, perfusion if available), and ensure the team has all needed resources. The surgeon's immediate priority is to achieve hemorrhage control (clamping, suturing, or packing the vascular injury). While the nurse should anticipate the need for sutures and vascular clamps, the first priority is ensuring the resuscitative infrastructure is in place. Repositioning during active hemorrhage is dangerous and delays the surgeon's repair effort. Family notification is important but not the priority during active resuscitation.",
    learningObjective: "Implement the circulating nurse's role in managing massive intraoperative hemorrhage through MTP activation and resuscitative support",
    blueprintCategory: "Emergency Situations",
    subtopic: "massive intraoperative hemorrhage",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The circulating nurse's priority in massive hemorrhage is RESUSCITATIVE INFRASTRUCTURE: MTP activation, IV access, rapid infuser, blood warmer, and communication.",
    clinicalPearls: [
      "MTP provides blood products in balanced ratios — activate early when massive hemorrhage is identified",
      "Rapid infusion devices can deliver 500-1,500 mL/min of warmed blood products",
      "Communicate the emergency to mobilize additional personnel and resources"
    ],
    safetyNote: "Hypothermia worsens coagulopathy during massive transfusion — always use a blood warmer for rapid blood product administration",
    distractorRationales: [
      "Sutures are needed but ensuring blood product availability and resuscitative infrastructure is the higher priority",
      "Repositioning during active hemorrhage is dangerous and delays surgical repair",
      "Family notification is important but is not the priority during active resuscitation"
    ]
  }
];
