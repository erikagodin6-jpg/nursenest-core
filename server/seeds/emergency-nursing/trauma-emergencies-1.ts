import { EmergencyNursingQuestion } from "./types";

export const traumaEmergency1Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 24-year-old male arrives by EMS after a motorcycle collision at 60 mph. He has a GCS of 8, bilateral raccoon eyes, otorrhea from the left ear, and Battle's sign behind the left ear. What should the emergency nurse avoid?",
    options: [
      "Inserting a nasogastric tube for gastric decompression",
      "Performing oral suctioning to maintain airway patency",
      "Applying cervical spine immobilization",
      "Establishing two large-bore IV access sites"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with classic signs of a basilar skull fracture: raccoon eyes (bilateral periorbital ecchymosis), Battle's sign (mastoid ecchymosis), and otorrhea (CSF leaking from the ear). In patients with suspected basilar skull fracture, nasogastric (NG) tube insertion is absolutely contraindicated because the tube can inadvertently pass through the fractured cribriform plate into the brain, causing meningitis, brain abscess, or direct brain injury. The cribriform plate is a thin, perforated bone at the base of the anterior cranial fossa through which olfactory nerve fibers pass. A basilar skull fracture can disrupt this plate, creating a direct communication between the nasal cavity and the intracranial space. If gastric decompression is needed, an orogastric (OG) tube should be used instead, as it bypasses the nasal passage entirely. Similarly, nasotracheal intubation is also contraindicated in basilar skull fracture for the same reason - oral endotracheal intubation should be performed instead. Other clinical signs of basilar skull fracture include hemotympanum (blood behind the tympanic membrane), CSF rhinorrhea (clear fluid from the nose), and cranial nerve palsies (particularly CN VII facial nerve palsy). The emergency nurse should test any clear fluid from the nose or ears for the 'halo sign' or 'ring sign' on gauze (a clear ring surrounding a central blood spot suggests CSF). Beta-2 transferrin testing of the fluid provides definitive confirmation of CSF. All other interventions listed are appropriate: oral suctioning maintains airway patency, cervical spine immobilization is essential in trauma, and large-bore IV access is needed for potential resuscitation.",
    learningObjective: "Recognize basilar skull fracture signs and contraindications including nasogastric tube and nasotracheal intubation",
    blueprintCategory: "Trauma Emergencies",
    subtopic: "Head Trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Raccoon eyes + Battle's sign + otorrhea = basilar skull fracture = NO nasogastric tube or nasotracheal intubation",
    clinicalPearls: [
      "Basilar skull fracture signs: raccoon eyes, Battle's sign, otorrhea/rhinorrhea, hemotympanum",
      "Use orogastric tube instead of nasogastric in suspected basilar skull fracture",
      "Halo sign on gauze: clear ring around blood spot suggests CSF leak",
      "Beta-2 transferrin is the definitive test to confirm CSF in nasal/ear drainage"
    ],
    safetyNote: "NG tube through a fractured cribriform plate can enter the brain - ALWAYS use orogastric route with basilar skull fracture",
    distractorRationales: [
      "NG tube insertion is contraindicated due to risk of intracranial passage through fractured cribriform plate",
      "Oral suctioning is safe and appropriate for airway management",
      "Cervical spine immobilization is essential in trauma until cleared",
      "Large-bore IV access is critical for potential resuscitation"
    ],
    lessonLink: "/emergency/lessons/head-trauma"
  },
  {
    stem: "A 35-year-old male sustains a stab wound to the left chest at the 5th intercostal space, midclavicular line. BP is 72/40 mmHg, HR 138 bpm, JVD is present, and heart sounds are muffled. Which intervention is most time-critical?",
    options: [
      "Left chest tube insertion for hemothorax drainage",
      "Emergent resuscitative thoracotomy in the ED",
      "Ultrasound-guided pericardiocentesis for cardiac tamponade",
      "Massive transfusion protocol activation with bilateral chest tubes"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with penetrating cardiac trauma (stab wound at the 5th intercostal space, midclavicular line - directly over the heart) with Beck's triad (hypotension, JVD, muffled heart sounds) indicating cardiac tamponade. In penetrating thoracic trauma with cardiac tamponade and hemodynamic instability, emergent resuscitative thoracotomy (ERT) in the ED is the most time-critical intervention. The 2023 EAST guidelines recommend ERT for penetrating thoracic injuries with signs of life within the preceding 15 minutes, with survival rates of 10-35% for penetrating cardiac injuries. ERT allows direct access to the heart for: (1) relief of tamponade by opening the pericardium, (2) control of cardiac hemorrhage by direct suture repair or digital pressure, (3) internal cardiac massage if the patient arrests, and (4) cross-clamping of the aorta to redirect blood flow to the brain and heart. While pericardiocentesis can temporize tamponade from medical causes, it is often inadequate for traumatic hemopericardium because the blood clots rapidly and cannot be aspirated through a needle. The tamponade will quickly reaccumulate from the actively bleeding cardiac wound. A chest tube addresses hemothorax or pneumothorax but does not address the cardiac injury causing tamponade. Massive transfusion is important supportively but does not address the source of hemorrhage. The emergency nurse should prepare the thoracotomy tray, ensure adequate blood products are available, and assist with the procedure while maintaining hemodynamic support.",
    learningObjective: "Recognize indications for emergent resuscitative thoracotomy in penetrating cardiac trauma with tamponade",
    blueprintCategory: "Trauma Emergencies",
    subtopic: "Penetrating Chest Trauma",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Pericardiocentesis is often inadequate for traumatic tamponade because clotted blood cannot be aspirated through a needle",
    clinicalPearls: [
      "Stab wound near the heart + Beck's triad = penetrating cardiac injury with tamponade",
      "ERT survival for penetrating cardiac injuries: 10-35%",
      "Pericardiocentesis is a temporizing measure but often inadequate for traumatic hemopericardium",
      "The 'cardiac box' extends from the clavicles to the costal margins, between the midclavicular lines"
    ],
    safetyNote: "ERT is a last-resort procedure with significant risk - only performed when the patient is in extremis or peri-arrest",
    distractorRationales: [
      "Chest tube addresses hemothorax but not the cardiac injury causing tamponade",
      "ERT provides definitive access to the heart for hemorrhage control and tamponade relief",
      "Pericardiocentesis is often inadequate for traumatic clotted hemopericardium",
      "Massive transfusion is supportive but does not address the hemorrhage source"
    ],
    lessonLink: "/emergency/lessons/penetrating-chest-trauma"
  },
  {
    stem: "A 42-year-old female is a restrained driver in a high-speed frontal collision. She complains of severe abdominal pain. FAST exam shows free fluid in Morrison's pouch and the splenorenal recess. BP is 88/54 mmHg after 2 liters of crystalloid. HR 128 bpm. What is the next step?",
    options: [
      "CT abdomen/pelvis with IV contrast for definitive injury identification",
      "Emergent exploratory laparotomy for surgical hemorrhage control",
      "Additional 2 liters of crystalloid with vasopressor initiation",
      "Diagnostic peritoneal lavage for confirmation of intraperitoneal hemorrhage"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with blunt abdominal trauma with hemodynamic instability (persistent hypotension and tachycardia) despite initial fluid resuscitation (2 liters crystalloid), combined with a positive FAST exam showing free intraperitoneal fluid in multiple locations (Morrison's pouch and splenorenal recess). This combination indicates significant intra-abdominal hemorrhage requiring emergent operative intervention. The critical decision point in trauma resuscitation is: if a patient with intra-abdominal free fluid remains hemodynamically unstable after initial resuscitation, they need emergent surgical exploration - not more imaging or fluids. CT scan is the gold standard for identifying specific organ injuries in STABLE trauma patients, but sending an unstable patient to the CT scanner is dangerous because: (1) the CT scanner is away from the resuscitation area, (2) contrast administration may worsen hemodynamic instability, and (3) the time spent on imaging delays definitive hemorrhage control. The principle is 'the CT scanner is no place for an unstable trauma patient.' Additional crystalloid beyond the initial 1-2 liters can worsen outcomes through dilutional coagulopathy, hypothermia, and the 'lethal triad' of trauma (hypothermia, acidosis, coagulopathy). Current damage control resuscitation emphasizes limiting crystalloid and using balanced blood product transfusion (1:1:1 ratio of packed RBCs, FFP, and platelets). Diagnostic peritoneal lavage (DPL) has largely been replaced by the FAST exam and is rarely performed in modern trauma care. The emergency nurse should activate the massive transfusion protocol, prepare the patient for the OR, and ensure blood products are available.",
    learningObjective: "Identify hemodynamically unstable trauma patients with positive FAST as requiring emergent surgical intervention, not CT imaging",
    blueprintCategory: "Trauma Emergencies",
    subtopic: "Abdominal Trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Never send a hemodynamically unstable trauma patient to CT - positive FAST + hemodynamic instability = OR",
    clinicalPearls: [
      "Unstable + positive FAST = emergent laparotomy, not CT scan",
      "FAST evaluates: Morrison's pouch, splenorenal recess, pelvis, pericardium",
      "Lethal triad of trauma: hypothermia, acidosis, coagulopathy",
      "Damage control resuscitation: limit crystalloid, use 1:1:1 blood products"
    ],
    safetyNote: "The CT scanner is no place for an unstable trauma patient - hemorrhage control takes priority over definitive imaging",
    distractorRationales: [
      "CT is for stable patients - this patient is hemodynamically unstable despite resuscitation",
      "Emergent laparotomy is indicated for unstable patients with positive FAST",
      "Additional crystalloid can worsen coagulopathy and does not address the hemorrhage source",
      "DPL has been replaced by FAST exam in modern trauma care"
    ],
    lessonLink: "/emergency/lessons/abdominal-trauma"
  },
  {
    stem: "A 19-year-old male is brought to the ED after a diving accident in shallow water. He is immobilized on a backboard. He has no sensation or motor function below the nipple line (T4 level). BP is 72/44 mmHg, HR 52 bpm. What type of shock is this patient most likely experiencing?",
    options: [
      "Hypovolemic shock from occult internal hemorrhage",
      "Neurogenic shock from spinal cord injury causing loss of sympathetic tone",
      "Spinal shock causing temporary loss of all spinal cord function",
      "Obstructive shock from tension pneumothorax"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with neurogenic shock following acute spinal cord injury (SCI) at the T4 level from a diving accident. Neurogenic shock is characterized by the triad of hypotension, bradycardia, and peripheral vasodilation (warm, dry skin), resulting from the loss of sympathetic nervous system tone below the level of injury. In normal physiology, the sympathetic nervous system maintains vascular tone and heart rate through thoracolumbar sympathetic outflow (T1-L2). When the spinal cord is injured above T6, there is complete loss of sympathetic innervation to the splanchnic vascular bed (the largest capacitance bed in the body), causing massive vasodilation and blood pooling. The unopposed vagal (parasympathetic) tone causes bradycardia. This is distinctly different from other types of shock: hypovolemic shock presents with tachycardia (not bradycardia) as a compensatory mechanism, cold/clammy skin, and is associated with blood loss. While this patient may also have hemorrhage, the bradycardia makes neurogenic shock the primary diagnosis. Spinal shock is a different entity - it refers to the temporary loss of spinal cord reflexes below the injury level (flaccid paralysis, absent reflexes) and is a neurological finding, not a hemodynamic state. Spinal shock does not necessarily cause hypotension. Obstructive shock from tension pneumothorax would show absent breath sounds and tracheal deviation. Treatment of neurogenic shock includes IV fluid resuscitation (cautious, as the heart cannot compensate with tachycardia), vasopressors (norepinephrine or phenylephrine to restore vascular tone), and atropine for symptomatic bradycardia. The emergency nurse should also maintain spinal immobilization, monitor for respiratory compromise (injuries above C4 can cause respiratory failure), and prevent hypothermia.",
    learningObjective: "Differentiate neurogenic shock from other shock types based on the hallmark triad of hypotension, bradycardia, and warm skin",
    blueprintCategory: "Trauma Emergencies",
    subtopic: "Spinal Cord Injury",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Neurogenic shock = hypotension + BRADYCARDIA; hypovolemic shock = hypotension + TACHYCARDIA",
    clinicalPearls: [
      "Neurogenic shock triad: hypotension, bradycardia, warm/dry skin (vasodilation)",
      "Occurs with SCI above T6 due to loss of sympathetic outflow",
      "Spinal shock ≠ neurogenic shock: spinal shock is loss of reflexes, neurogenic shock is hemodynamic",
      "Treatment: cautious IV fluids + vasopressors (norepinephrine) + atropine for bradycardia"
    ],
    safetyNote: "SCI above C4 can cause respiratory failure from loss of diaphragm innervation (phrenic nerve C3-C5) - monitor closely",
    distractorRationales: [
      "Hypovolemic shock would present with tachycardia, not bradycardia",
      "Neurogenic shock from loss of sympathetic tone explains the hypotension with bradycardia",
      "Spinal shock is neurological (loss of reflexes), not hemodynamic",
      "Tension pneumothorax would show absent breath sounds and tracheal deviation"
    ],
    lessonLink: "/emergency/lessons/spinal-cord-injury"
  },
  {
    stem: "A 28-year-old male arrives with a gunshot wound to the right upper quadrant of the abdomen. He is alert, HR 112 bpm, BP 104/68 mmHg. The entrance wound is anterior and there is no exit wound. What principle should guide the emergency nurse's assessment?",
    options: [
      "A single entrance wound without exit wound indicates a low-velocity injury with limited damage",
      "The bullet may have traveled an unpredictable trajectory; assess for injuries to all body regions",
      "The liver is the only organ at risk given the wound location in the right upper quadrant",
      "Since the patient is hemodynamically stable, CT scan can be deferred for 4-6 hours"
    ],
    correctAnswer: 1,
    rationaleLong: "A fundamental principle in penetrating trauma assessment is that bullets do not always travel in straight lines. After entering the body, a bullet can ricochet off bones, fragment, change direction, and damage structures far from the expected trajectory. A gunshot wound to the right upper quadrant without an exit wound means the bullet is still in the body and could have traveled to any location. The emergency nurse must assess for potential injuries to ALL body regions, not just the quadrant of entry. A bullet entering the RUQ could potentially injure the liver, right kidney, diaphragm (and then enter the right chest causing pneumothorax or hemothorax), inferior vena cava, duodenum, colon, or even the spine. The assessment should include: (1) complete primary and secondary trauma survey, (2) chest X-ray to evaluate for diaphragm penetration and hemopneumothorax, (3) FAST exam for free fluid, (4) foley catheter to check for hematuria (renal/bladder injury), (5) rectal exam for blood (GI injury), and (6) CT scan of the chest, abdomen, and pelvis with IV contrast when the patient is stable. The absence of an exit wound does not indicate low velocity - the bullet may have fragmented or been absorbed by tissue. Hemodynamic stability at presentation does not mean the patient is safe - compensated shock can rapidly decompensate. Serial reassessment is critical. Delaying imaging for 4-6 hours is dangerous as occult injuries can progress rapidly. While the liver is the most commonly injured organ in RUQ penetrating trauma, it is not the only organ at risk.",
    learningObjective: "Understand that bullet trajectories are unpredictable and assess for injuries beyond the apparent wound trajectory",
    blueprintCategory: "Trauma Emergencies",
    subtopic: "Penetrating Abdominal Trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Bullets don't travel in straight lines - assess for injuries in ALL body regions regardless of wound location",
    clinicalPearls: [
      "No exit wound means the bullet is retained and could be anywhere",
      "Bullets can ricochet off bones and fragment, causing unpredictable injuries",
      "Always get a chest X-ray with abdominal GSW - bullet may have traversed the diaphragm",
      "Serial assessments are critical - compensated shock can rapidly decompensate"
    ],
    safetyNote: "Never assume hemodynamic stability means the patient is safe - penetrating trauma patients need serial reassessment every 15 minutes",
    distractorRationales: [
      "Absence of exit wound does not indicate low velocity or limited damage",
      "Bullets travel unpredictably and all body regions must be assessed for injury",
      "Multiple organs beyond the liver can be injured from an RUQ entry wound",
      "Delaying imaging in penetrating trauma is dangerous - occult injuries can progress rapidly"
    ],
    lessonLink: "/emergency/lessons/penetrating-abdominal-trauma"
  },
  {
    stem: "A 55-year-old female falls from a 12-foot ladder onto concrete. She has an open fracture of the left tibia with exposed bone and active bleeding. Peripheral pulses are absent distal to the fracture. What is the emergency nurse's priority?",
    options: [
      "Apply a sterile saline-moistened dressing to the exposed bone and splint the extremity",
      "Realign the extremity to restore distal perfusion and then splint in the corrected position",
      "Apply a tourniquet proximal to the fracture to control hemorrhage",
      "Administer IV antibiotics and prepare for emergent surgical fixation"
    ],
    correctAnswer: 1,
    rationaleLong: "The absence of distal pulses in the setting of a displaced fracture indicates vascular compromise from either direct vessel injury or mechanical compression/kinking of the artery by displaced bone fragments. This represents a limb-threatening emergency. The priority intervention is gentle realignment (traction and reduction) of the extremity to restore distal perfusion. When a displaced fracture compresses or kinks the popliteal or tibial arteries, restoring anatomic alignment often immediately restores blood flow. The emergency nurse should: (1) apply gentle longitudinal traction to the extremity, (2) realign the fracture to an anatomic position while monitoring distal pulses, (3) reassess distal pulses, sensation, and motor function after realignment, (4) splint the extremity in the corrected position to maintain alignment. If pulses do not return after realignment, the patient needs emergent vascular surgery evaluation for possible arterial repair. While covering the exposed bone with a moist sterile dressing is important for infection prevention, it does not address the limb-threatening vascular compromise. A tourniquet controls hemorrhage but further compromises an already ischemic limb. IV antibiotics are important for open fractures (cefazolin within 1 hour) but are not the immediate priority when perfusion is absent. The golden rule for open fractures is: irrigate with normal saline, cover with sterile moist dressing, splint, and administer antibiotics - but vascular compromise supersedes all of these. An ischemic limb has approximately 6 hours before irreversible damage occurs.",
    learningObjective: "Prioritize fracture realignment to restore distal perfusion in a pulseless extremity with displaced fracture",
    blueprintCategory: "Trauma Emergencies",
    subtopic: "Orthopedic Emergencies",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Absent distal pulses with a displaced fracture = realign first to restore perfusion, then address other concerns",
    clinicalPearls: [
      "Absent distal pulses after fracture = vascular emergency requiring immediate realignment",
      "Open fracture management: irrigate, moist sterile dressing, splint, antibiotics within 1 hour",
      "6-hour window for limb salvage when arterial perfusion is compromised",
      "Reassess neurovascular status after every manipulation or splint application"
    ],
    safetyNote: "Always reassess and document distal neurovascular status (pulses, sensation, motor, capillary refill) before AND after any fracture manipulation",
    distractorRationales: [
      "Wound care is important but vascular compromise is the immediate life-threatening issue",
      "Realignment to restore distal perfusion is the correct priority for a pulseless extremity",
      "A tourniquet would worsen ischemia in an already pulseless limb",
      "Antibiotics are important within 1 hour but do not address the vascular emergency"
    ],
    lessonLink: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 30-year-old male is brought in after an explosion. He has bilateral tympanic membrane rupture, blast lung injury with bilateral pulmonary contusions, and abdominal pain. His SpO2 is 89% on 15L non-rebreather. Which blast injury category describes the lung injury?",
    options: [
      "Primary blast injury from direct pressure wave effects",
      "Secondary blast injury from projectile fragments",
      "Tertiary blast injury from body displacement",
      "Quaternary blast injury from burns and inhalation"
    ],
    correctAnswer: 0,
    rationaleLong: "Blast lung injury is classified as a primary blast injury, caused by the direct effect of the blast overpressure wave on gas-containing organs. Primary blast injuries are unique to explosions and result from the interaction of the blast wave with body tissues. Gas-containing organs (lungs, ears, bowels) are most susceptible because the pressure wave causes rapid compression and expansion of gas within these organs, leading to tissue disruption at air-tissue interfaces. In the lungs, this causes alveolar hemorrhage, pulmonary contusion, pneumothorax, and air embolism. In the ears, it causes tympanic membrane rupture (the most common blast injury overall). In the GI tract, it can cause bowel perforation and mesenteric hemorrhage. Blast lung is the most common fatal primary blast injury and presents with dyspnea, cough, hemoptysis, and hypoxemia. The four categories of blast injury are: Primary - direct pressure wave effects on gas-containing organs (lungs, ears, GI); Secondary - injuries from projectile fragments and debris propelled by the blast; Tertiary - injuries from the body being thrown by the blast wind (blunt trauma, fractures, traumatic amputations); Quaternary - all other injuries including burns, crush injuries, inhalation injury, and exacerbation of chronic diseases. Management of blast lung includes: supplemental oxygen (target SpO2 > 94%), cautious positive pressure ventilation (risk of tension pneumothorax and air embolism), chest tube placement if pneumothorax develops, and supportive care. The emergency nurse should place all blast victims on continuous monitoring and have chest tubes readily available. Positive pressure ventilation should be used cautiously because it can worsen air leaks and potentially cause systemic air embolism through disrupted alveolar-capillary membranes.",
    learningObjective: "Classify blast injuries by mechanism and recognize blast lung as a primary blast injury affecting gas-containing organs",
    blueprintCategory: "Trauma Emergencies",
    subtopic: "Blast Injuries",
    difficulty: 3,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Primary blast injuries affect gas-containing organs (lungs, ears, bowels) - the only category unique to explosions",
    clinicalPearls: [
      "Primary blast injury: pressure wave → gas-containing organs (lungs, ears, bowels)",
      "Tympanic membrane rupture is the most common blast injury (screening marker)",
      "Blast lung is the most common fatal primary blast injury",
      "Use positive pressure ventilation cautiously in blast lung - risk of air embolism"
    ],
    safetyNote: "Blast lung patients can develop tension pneumothorax rapidly with positive pressure ventilation - have chest tubes immediately available",
    distractorRationales: [
      "Primary blast injury correctly describes direct pressure wave effects on gas-containing organs",
      "Secondary blast injuries are caused by projectile fragments, not pressure waves",
      "Tertiary blast injuries result from body displacement, not direct pressure effects",
      "Quaternary blast injuries include burns and inhalation but not direct pressure wave effects"
    ],
    lessonLink: "/emergency/lessons/blast-injuries"
  },
  {
    stem: "A 45-year-old female presents after a motor vehicle collision. CT scan reveals a grade IV splenic laceration with active extravasation. She received 4 units of PRBCs and 4 units of FFP. Her temperature is 34.8°C, INR is 2.1, pH is 7.22, and lactate is 6.8 mmol/L. What surgical approach should the emergency nurse prepare for?",
    options: [
      "Definitive splenectomy with thorough abdominal exploration",
      "Damage control surgery with splenic packing and temporary abdominal closure",
      "Interventional radiology for splenic artery embolization",
      "Nonoperative management with ICU admission and serial CT scans"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is developing the 'lethal triad' of trauma: hypothermia (34.8°C), coagulopathy (INR 2.1), and acidosis (pH 7.22, elevated lactate). When these three conditions coexist, the mortality rate approaches 90% without immediate correction. The appropriate surgical approach in this scenario is damage control surgery (DCS), also known as abbreviated laparotomy. DCS is a staged approach designed to address the lethal triad by: Stage 1 - abbreviated surgery to control hemorrhage and contamination only (packing the spleen or performing rapid splenectomy, without extensive exploration), followed by temporary abdominal closure using a negative pressure wound therapy device or Bogota bag. Stage 2 - ICU resuscitation focusing on correcting hypothermia (warming blankets, warm IV fluids, warm blood products), coagulopathy (massive transfusion with 1:1:1 products, calcium replacement, tranexamic acid), and acidosis (volume resuscitation, correcting the underlying hemorrhage). Stage 3 - planned return to the OR in 24-72 hours for definitive repair, pack removal, and formal abdominal closure once the patient is physiologically optimized. A definitive splenectomy with thorough exploration takes too long and the patient will continue to deteriorate from the lethal triad during the prolonged surgery. Interventional radiology is for hemodynamically stable patients with contained splenic injuries. Nonoperative management requires hemodynamic stability, which this patient does not have. The emergency nurse plays a critical role by: (1) initiating aggressive warming measures, (2) ensuring massive transfusion products are available, (3) administering calcium (counteracts citrate-induced hypocalcemia from blood products), and (4) preparing for rapid OR transport.",
    learningObjective: "Recognize the lethal triad of trauma and prepare for damage control surgery as the appropriate surgical approach",
    blueprintCategory: "Trauma Emergencies",
    subtopic: "Damage Control Resuscitation",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "The lethal triad (hypothermia + coagulopathy + acidosis) requires abbreviated surgery, not definitive repair",
    clinicalPearls: [
      "Lethal triad: hypothermia + coagulopathy + acidosis → mortality approaches 90%",
      "Damage control surgery: control hemorrhage → ICU resuscitation → planned re-exploration",
      "1:1:1 transfusion ratio (PRBCs:FFP:platelets) is standard in damage control resuscitation",
      "Give calcium (calcium chloride 1g IV) for every 4 units of blood products to prevent citrate toxicity"
    ],
    safetyNote: "Citrate in stored blood products chelates calcium - replace calcium aggressively during massive transfusion to prevent cardiac arrest",
    distractorRationales: [
      "Definitive surgery takes too long and the lethal triad will worsen during prolonged operation",
      "Damage control surgery addresses the hemorrhage quickly while allowing ICU correction of the lethal triad",
      "IR embolization requires hemodynamic stability, which this patient does not have",
      "Nonoperative management requires hemodynamic stability and is inappropriate for active extravasation"
    ],
    lessonLink: "/emergency/lessons/damage-control-resuscitation"
  },
  {
    stem: "A 6-year-old child is brought in after being struck by a car while riding a bicycle. He is wearing a helmet but was knocked unconscious for approximately 2 minutes. He is now crying and moving all extremities. GCS is 14 (E3V5M6). CT head shows no acute intracranial hemorrhage. Which assessment finding would require ICU admission and repeat imaging?",
    options: [
      "A 2-cm frontal scalp hematoma with swelling",
      "Persistent vomiting and worsening headache over the next 4 hours",
      "A linear non-displaced skull fracture on CT",
      "A brief episode of post-traumatic amnesia lasting 5 minutes"
    ],
    correctAnswer: 1,
    rationaleLong: "Persistent vomiting and worsening headache over several hours after head trauma are concerning signs of evolving intracranial pathology and represent a deteriorating neurological examination. While the initial CT was negative, delayed intracranial hemorrhage (particularly epidural hematoma) can develop hours after the initial injury, especially in children. The 'talk and die' phenomenon occurs when a patient appears lucid initially but then deteriorates due to expanding intracranial hemorrhage - this is classically associated with epidural hematoma from middle meningeal artery bleeding. Progressive symptoms (worsening headache, persistent vomiting, decreasing GCS, new focal deficits, or increasing lethargy) indicate the need for: (1) ICU admission for close neurological monitoring with GCS checks every 1-2 hours, (2) repeat CT imaging to evaluate for delayed hemorrhage, and (3) neurosurgical consultation. The PECARN (Pediatric Emergency Care Applied Research Network) guidelines for pediatric head trauma help identify children at risk for clinically important traumatic brain injury. While a frontal scalp hematoma is a risk factor for intracranial injury in children under 2 years, a 2-cm hematoma in a 6-year-old with a negative CT is a minor finding. A linear non-displaced skull fracture without intracranial hemorrhage can typically be managed with observation. Brief post-traumatic amnesia lasting 5 minutes is common after concussion and does not independently warrant ICU admission. The emergency nurse should perform serial neurological assessments documenting GCS, pupil reactivity, motor function, and symptoms at regular intervals.",
    learningObjective: "Identify deteriorating neurological signs that warrant ICU admission and repeat imaging after initially negative head CT",
    blueprintCategory: "Trauma Emergencies",
    subtopic: "Pediatric Head Trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "A negative initial CT does not rule out delayed hemorrhage - watch for progressive symptoms over 4-6 hours",
    clinicalPearls: [
      "Talk and die phenomenon: lucid interval followed by deterioration = epidural hematoma",
      "PECARN criteria help risk-stratify pediatric head trauma for CT imaging",
      "Repeat CT if: worsening headache, persistent vomiting, decreasing GCS, new focal deficits",
      "Epidural hematoma may not be visible on initial CT if obtained very early"
    ],
    safetyNote: "Perform and document serial GCS assessments every 1-2 hours after pediatric head trauma - any decline warrants immediate repeat imaging",
    distractorRationales: [
      "Frontal scalp hematoma in a 6-year-old with negative CT is a minor finding",
      "Progressive vomiting and worsening headache suggest evolving intracranial pathology",
      "Linear non-displaced skull fracture without hemorrhage can be observed without ICU",
      "Brief post-traumatic amnesia is common after concussion and not independently concerning"
    ],
    lessonLink: "/emergency/lessons/pediatric-head-trauma"
  },
  {
    stem: "A 32-year-old male sustains bilateral femur fractures in a motorcycle crash. Estimated blood loss is 2-3 liters based on fracture patterns. Massive transfusion protocol is activated. After receiving 6 units of PRBCs, the patient develops tingling around the lips, prolonged QT on the monitor, and muscle cramping. What electrolyte disturbance should the nurse suspect?",
    options: [
      "Hyperkalemia from hemolyzed stored blood cells",
      "Hypocalcemia from citrate toxicity in transfused blood products",
      "Hypomagnesemia from massive fluid shifts",
      "Hyponatremia from dilution with large volume resuscitation"
    ],
    correctAnswer: 1,
    rationaleLong: "The clinical presentation of perioral tingling, prolonged QT interval, and muscle cramping after massive blood transfusion is classic for hypocalcemia from citrate toxicity. Citrate (specifically citrate-phosphate-dextrose or CPD) is used as an anticoagulant preservative in stored blood products. When large volumes of blood products are transfused rapidly, the citrate load overwhelms the liver's capacity to metabolize it. Citrate chelates (binds) ionized calcium in the blood, causing acute hypocalcemia. Each unit of PRBCs contains approximately 3 grams of citrate, and FFP contains even higher concentrations. With 6 units of PRBCs transfused rapidly, the cumulative citrate load is approximately 18 grams, which is far beyond the liver's metabolic capacity in the setting of hemorrhagic shock (where hepatic perfusion is already compromised). Clinical signs of citrate-induced hypocalcemia include: perioral and extremity paresthesias (tingling), Chvostek's sign (facial twitching with tapping), Trousseau's sign (carpopedal spasm with BP cuff inflation), prolonged QT interval on ECG, muscle cramping, and in severe cases, cardiac arrest. The treatment is IV calcium replacement: calcium chloride 1 gram (10 mL of 10% solution) IV over 5-10 minutes, repeated as needed. A general guideline is to administer 1 gram of calcium chloride for every 4-6 units of blood products transfused. While hyperkalemia can occur with massive transfusion (from potassium leaking from stored RBCs), the specific symptoms described are more consistent with hypocalcemia. The emergency nurse should monitor ionized calcium levels during massive transfusion and proactively administer calcium replacement.",
    learningObjective: "Recognize citrate-induced hypocalcemia during massive transfusion and administer calcium replacement",
    blueprintCategory: "Trauma Emergencies",
    subtopic: "Massive Transfusion",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Perioral tingling + prolonged QT + muscle cramps during massive transfusion = hypocalcemia from citrate toxicity",
    clinicalPearls: [
      "Citrate in blood products chelates ionized calcium → hypocalcemia",
      "Give 1 gram calcium chloride IV for every 4-6 units of blood products",
      "Calcium chloride provides 3x more elemental calcium than calcium gluconate",
      "Monitor ionized calcium (not total calcium) during massive transfusion"
    ],
    safetyNote: "Severe hypocalcemia from citrate toxicity can cause cardiac arrest - proactively replace calcium during massive transfusion",
    distractorRationales: [
      "Hyperkalemia causes peaked T waves and widened QRS, not perioral tingling and prolonged QT",
      "Hypocalcemia from citrate toxicity best explains the symptoms of tingling, QT prolongation, and cramping",
      "Hypomagnesemia can cause similar symptoms but citrate toxicity is the primary concern during massive transfusion",
      "Hyponatremia presents with confusion and seizures, not perioral tingling and muscle cramps"
    ],
    lessonLink: "/emergency/lessons/massive-transfusion"
  },
  {
    stem: "A 22-year-old male presents with a large knife still embedded in his left lateral neck (Zone II). He is alert, speaking clearly, and hemodynamically stable. What is the correct management of the embedded object?",
    options: [
      "Remove the knife immediately in the ED to assess the wound depth",
      "Leave the knife in place, stabilize it, and prepare for surgical removal in the OR",
      "Apply gentle traction to partially withdraw the knife for wound exploration",
      "Obtain CT angiography of the neck first, then remove the knife based on findings"
    ],
    correctAnswer: 1,
    rationaleLong: "The fundamental principle of embedded/impaled object management in trauma is to leave the object in place and stabilize it until it can be removed in a controlled surgical environment. Embedded objects, particularly in the neck, may be tamponading major vascular structures (carotid artery, jugular vein, subclavian vessels) or may be adjacent to vital structures (trachea, esophagus, spinal cord). Removing the object in the ED can release the tamponade effect and cause massive, uncontrollable hemorrhage. The neck contains the carotid arteries, jugular veins, vertebral arteries, trachea, esophagus, recurrent laryngeal nerves, and spinal cord - all in a compact space. Zone II of the neck (between the cricoid cartilage and the angle of the mandible) contains the carotid bifurcation and is the most commonly injured zone. Management includes: (1) stabilize the object using bulky dressings, towels, or commercial devices to prevent movement, (2) do NOT shorten, manipulate, or remove the object, (3) obtain imaging as appropriate (CT angiography can often be performed with the object in place), (4) prepare for surgical removal in the OR where vascular control can be obtained before the object is withdrawn. The OR provides: direct visualization, vascular clamps ready for hemorrhage control, blood products available, and the ability to perform immediate surgical repair. The only exception to this rule is if the object is obstructing the airway - in that case, it must be removed to secure the airway, with preparations for immediate hemorrhage control.",
    learningObjective: "Apply the principle of leaving impaled objects in place and stabilizing for controlled surgical removal",
    blueprintCategory: "Trauma Emergencies",
    subtopic: "Penetrating Neck Trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER remove an impaled object in the ED (except for airway obstruction) - it may be tamponading a major vessel",
    clinicalPearls: [
      "Leave impaled objects in place - they may be tamponading major hemorrhage",
      "Stabilize embedded objects with bulky dressings to prevent movement",
      "Neck Zone II: cricoid to angle of mandible - contains carotid bifurcation",
      "Only remove in OR with vascular control and blood products available"
    ],
    safetyNote: "Removing an impaled neck object in the ED can cause fatal, uncontrollable hemorrhage from the carotid artery",
    distractorRationales: [
      "Removing the knife in the ED risks uncontrollable hemorrhage from tamponaded vessels",
      "Leaving the object in place with stabilization and OR removal is the correct approach",
      "Partial withdrawal is equally dangerous and provides no benefit",
      "CT can be obtained with the object in place, but imaging should not delay surgical planning"
    ],
    lessonLink: "/emergency/lessons/penetrating-neck-trauma"
  },
  {
    stem: "A 40-year-old male presents with burns to his face, neck, and both arms after a house fire. He has singed nasal hairs, carbonaceous sputum, and a hoarse voice. SpO2 is 97% on room air. What is the emergency nurse's priority?",
    options: [
      "Calculate the total body surface area burned using the Rule of Nines",
      "Prepare for early endotracheal intubation before airway edema progresses",
      "Start fluid resuscitation using the Parkland formula based on burn percentage",
      "Apply silver sulfadiazine cream to all burned areas"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with classic signs of inhalation injury: facial burns, singed nasal hairs, carbonaceous (sooty) sputum, and hoarse voice. These findings indicate thermal and chemical injury to the upper airway, which will progress to significant airway edema over the next several hours. Early endotracheal intubation is the priority because airway edema can develop rapidly and completely obstruct the airway, making delayed intubation extremely difficult or impossible. The progression from hoarseness to complete airway obstruction can occur within 1-4 hours as the thermal injury causes progressive mucosal edema in the oropharynx, supraglottis, and glottis. The principle is 'intubate early when you can, not late when you must.' Once significant edema develops, the glottic opening may be too swollen for tube passage, requiring a surgical airway. Key indicators for early intubation in burn patients include: facial burns, singed nasal hairs or eyebrows, carbonaceous sputum, hoarseness or stridor, full-thickness circumferential neck burns, altered mental status, and large total body surface area burns (>40% TBSA). While TBSA calculation (Rule of Nines: head 9%, each arm 9%, anterior trunk 18%, posterior trunk 18%, each leg 18%, perineum 1%) and fluid resuscitation are important, they are secondary to securing the airway. Silver sulfadiazine should not be applied to facial burns. The current SpO2 of 97% is falsely reassuring because pulse oximetry cannot distinguish between oxyhemoglobin and carboxyhemoglobin - the patient may have significant carbon monoxide poisoning with a normal-appearing SpO2.",
    learningObjective: "Recognize signs of inhalation injury and prioritize early intubation before airway edema progresses",
    blueprintCategory: "Trauma Emergencies",
    subtopic: "Burn Injuries",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "SpO2 can be falsely normal in CO poisoning - pulse oximetry cannot distinguish carboxyhemoglobin from oxyhemoglobin",
    clinicalPearls: [
      "Signs of inhalation injury: facial burns, singed hairs, carbonaceous sputum, hoarseness, stridor",
      "Intubate early when you can, not late when you must - edema worsens over 1-4 hours",
      "Pulse oximetry is unreliable in CO poisoning - use co-oximetry for carboxyhemoglobin level",
      "Rule of Nines for adults: head 9%, each arm 9%, each leg 18%, trunk 36%, perineum 1%"
    ],
    safetyNote: "Never rely on SpO2 in fire victims - obtain carboxyhemoglobin level; normal SpO2 with smoke inhalation does not rule out CO poisoning",
    distractorRationales: [
      "TBSA calculation is important but secondary to airway management",
      "Early intubation is the priority to prevent airway loss from progressive edema",
      "Fluid resuscitation follows airway management in burn care priorities",
      "Silver sulfadiazine is contraindicated on the face and is not an acute priority"
    ],
    lessonLink: "/emergency/lessons/burn-injuries"
  },
  {
    stem: "A 48-year-old male presents after a crush injury when a concrete wall fell on his legs for approximately 45 minutes before rescue. His legs are severely swollen but he has palpable pedal pulses. He is alert with BP 130/82 mmHg and HR 92 bpm. Serum potassium is 5.8 mEq/L and CK is 42,000 U/L. What is the most critical complication the emergency nurse should anticipate?",
    options: [
      "Acute compartment syndrome requiring emergent fasciotomy",
      "Cardiac arrest from hyperkalemia when the crush pressure is released (reperfusion syndrome)",
      "Acute kidney injury from rhabdomyolysis requiring aggressive IV fluid resuscitation",
      "Fat embolism syndrome from long bone fractures"
    ],
    correctAnswer: 2,
    rationaleLong: "This patient has already been extricated (crush released) and presents with rhabdomyolysis (CK 42,000 U/L, normal < 200) and hyperkalemia (5.8 mEq/L). The most critical complication to anticipate is acute kidney injury (AKI) from rhabdomyolysis. When skeletal muscle is crushed and then reperfused, massive amounts of intracellular contents are released into the circulation, including myoglobin, potassium, phosphate, and creatine kinase. Myoglobin is directly nephrotoxic - it is freely filtered by the glomerulus and precipitates in the renal tubules, causing tubular obstruction and oxidative injury. This process is accelerated by acidic urine and volume depletion. The incidence of AKI in severe rhabdomyolysis approaches 33-50%, and it can lead to permanent renal failure requiring dialysis. The cornerstone of treatment is aggressive IV fluid resuscitation with normal saline at a rate of 1-1.5 liters/hour to maintain a urine output of 200-300 mL/hour. This high-volume diuresis helps flush myoglobin from the renal tubules before it can precipitate. Sodium bicarbonate may be added to alkalinize the urine (target pH > 6.5), which reduces myoglobin precipitation. While hyperkalemia is already present and dangerous, the crush has already been released - reperfusion syndrome would have occurred at the time of extrication. The existing hyperkalemia needs treatment (calcium gluconate, insulin/dextrose, continuous monitoring). Compartment syndrome may develop but the presence of palpable pulses suggests it has not occurred yet. Fat embolism is associated with long bone fractures, not crush injuries.",
    learningObjective: "Prioritize aggressive fluid resuscitation to prevent acute kidney injury from rhabdomyolysis after crush injury",
    blueprintCategory: "Trauma Emergencies",
    subtopic: "Crush Injury and Rhabdomyolysis",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Normal CK is < 200 U/L; CK > 5,000 indicates high risk for AKI; CK > 15,000 very high risk",
    clinicalPearls: [
      "Rhabdomyolysis treatment: aggressive NS at 1-1.5 L/hr targeting UOP 200-300 mL/hr",
      "Myoglobin turns urine dark brown (tea-colored) - dipstick positive for blood without RBCs on microscopy",
      "Sodium bicarbonate alkalinizes urine to prevent myoglobin precipitation (target urine pH > 6.5)",
      "Monitor potassium closely - release of intracellular potassium can cause fatal arrhythmias"
    ],
    safetyNote: "Start IV fluids BEFORE extrication in anticipated crush injuries to dilute the impending potassium and myoglobin surge",
    distractorRationales: [
      "Compartment syndrome is possible but palpable pulses suggest it hasn't occurred yet",
      "Reperfusion syndrome occurs at the time of extrication - this patient has already been freed",
      "AKI from rhabdomyolysis is the most critical ongoing complication requiring aggressive fluids",
      "Fat embolism is associated with long bone fractures, not crush injuries"
    ],
    lessonLink: "/emergency/lessons/crush-injury-rhabdomyolysis"
  },
  {
    stem: "A 25-year-old male presents with an isolated stab wound to the left anterior chest at the 3rd intercostal space. Initial chest tube drains 400 mL of blood. Over the next hour, the chest tube output totals 1,200 mL. BP is 98/60 mmHg despite 2 units of PRBCs. What intervention is indicated?",
    options: [
      "Insert a second chest tube on the same side for improved drainage",
      "Emergent thoracotomy for surgical hemorrhage control",
      "Autotransfusion of the collected chest tube blood",
      "Clamp the chest tube to create tamponade effect on the bleeding"
    ],
    correctAnswer: 1,
    rationaleLong: "The indications for emergent thoracotomy in hemothorax include: (1) initial chest tube output > 1,500 mL, or (2) ongoing chest tube output > 200 mL/hour for 2-4 consecutive hours, or (3) persistent hemodynamic instability despite resuscitation. This patient meets the criteria with 1,200 mL output in the first hour (well exceeding the 200 mL/hour threshold) AND continued hemodynamic instability despite blood transfusion. These criteria suggest an injury to a major vessel (intercostal artery, internal mammary artery, or pulmonary hilar vessel) or cardiac injury that requires surgical repair. The chest tube is providing drainage and decompression but cannot control the source of hemorrhage. Inserting a second chest tube would not address the bleeding source. Autotransfusion of collected hemothorax blood is a valuable technique during resuscitation (the collected blood can be reinfused through a cell saver or autotransfusion system), but it is a supportive measure, not definitive treatment for ongoing hemorrhage. Clamping the chest tube is DANGEROUS because it prevents drainage of ongoing hemorrhage, which can lead to tension hemothorax (blood accumulating under pressure in the pleural space, compressing the heart and great vessels similar to tension pneumothorax). A clamped chest tube in the setting of ongoing hemorrhage can rapidly cause cardiovascular collapse. The emergency nurse should prepare the thoracotomy tray, ensure adequate blood products (at least 6 units PRBCs crossmatched), notify the surgical team, and continue resuscitation during preparation.",
    learningObjective: "Apply chest tube output criteria for emergent thoracotomy in traumatic hemothorax",
    blueprintCategory: "Trauma Emergencies",
    subtopic: "Thoracic Trauma",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER clamp a chest tube draining a hemothorax - can cause tension hemothorax and cardiovascular collapse",
    clinicalPearls: [
      "Thoracotomy criteria: initial output > 1,500 mL OR ongoing > 200 mL/hr for 2-4 hours",
      "Persistent hemodynamic instability despite resuscitation is also an indication for thoracotomy",
      "Autotransfusion of hemothorax blood is a valuable adjunct during resuscitation",
      "Never clamp a chest tube that is actively draining blood"
    ],
    safetyNote: "Clamping a chest tube in an actively bleeding patient can cause tension hemothorax - a rapidly fatal condition",
    distractorRationales: [
      "A second chest tube provides drainage but does not control the hemorrhage source",
      "Emergent thoracotomy is indicated by the output exceeding 200 mL/hour with hemodynamic instability",
      "Autotransfusion is supportive but not definitive treatment for ongoing hemorrhage",
      "Clamping the chest tube is dangerous and can cause tension hemothorax"
    ],
    lessonLink: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "A 60-year-old female falls and lands on her outstretched right hand. She presents with a painful, deformed right wrist. X-ray shows a dorsally displaced distal radius fracture. The emergency nurse notes that the patient's median nerve function should be assessed. Which finding tests median nerve motor function?",
    options: [
      "Opposition of the thumb to the small finger",
      "Spreading the fingers apart against resistance",
      "Wrist extension against resistance",
      "Sensation on the dorsal aspect of the hand between thumb and index finger"
    ],
    correctAnswer: 0,
    rationaleLong: "The median nerve is the nerve most at risk in distal radius fractures (Colles fracture) due to its anatomic position running through the carpal tunnel directly adjacent to the distal radius. Median nerve motor function is tested by assessing thenar muscle function - specifically, opposition of the thumb to the small (5th) finger. Opposition is the unique ability to bring the thumb across the palm to touch the tip of the small finger, controlled by the opponens pollicis and abductor pollicis brevis muscles, both innervated by the median nerve. Another quick test for median nerve motor function is asking the patient to make an 'OK' sign (touching the tips of the thumb and index finger) or to flex the thumb interphalangeal joint against resistance. Median nerve sensory function is tested by checking sensation on the palmar surface of the first three and a half digits (thumb, index, middle, and radial half of ring finger). Spreading the fingers apart (finger abduction) tests the ulnar nerve motor function (dorsal interossei muscles). Wrist extension tests the radial nerve motor function (extensor carpi radialis muscles). Sensation on the dorsal hand between thumb and index finger (first dorsal web space) tests the radial nerve sensory function (superficial branch of radial nerve). The emergency nurse must document a thorough neurovascular assessment before AND after any fracture reduction or splint application, including: motor function of median, ulnar, and radial nerves, sensory function of all three nerves, and distal vascular status (radial and ulnar pulses, capillary refill, skin color, temperature).",
    learningObjective: "Assess median nerve motor function by testing thumb opposition in distal radius fractures",
    blueprintCategory: "Trauma Emergencies",
    subtopic: "Upper Extremity Injuries",
    difficulty: 2,
    cognitiveLevel: "recall",
    questionType: "MCQ_SINGLE",
    examTrap: "Know the quick nerve tests: median = thumb opposition, ulnar = finger spreading, radial = wrist extension",
    clinicalPearls: [
      "Median nerve motor: thumb opposition or OK sign",
      "Ulnar nerve motor: finger abduction (spreading fingers apart)",
      "Radial nerve motor: wrist extension (wrist drop if injured)",
      "Always document neurovascular status before AND after reduction/splinting"
    ],
    safetyNote: "Acute carpal tunnel syndrome from distal radius fracture swelling requires emergent release to prevent permanent median nerve damage",
    distractorRationales: [
      "Thumb opposition tests median nerve motor function (thenar muscles)",
      "Finger spreading tests ulnar nerve motor function (interossei)",
      "Wrist extension tests radial nerve motor function (extensors)",
      "Dorsal hand sensation between thumb and index finger tests radial nerve sensory function"
    ],
    lessonLink: "/emergency/lessons/upper-extremity-injuries"
  },
  {
    stem: "A 35-year-old pregnant female at 32 weeks gestation is involved in a high-speed motor vehicle collision. She is hemodynamically stable with BP 118/74 mmHg, HR 96 bpm. FAST exam is negative. Fetal heart tones are 145 bpm. What minimum monitoring period does the emergency nurse anticipate?",
    options: [
      "2 hours of fetal monitoring if asymptomatic",
      "4-6 hours of continuous fetal and tocodynamometry monitoring",
      "24 hours of continuous fetal monitoring and serial FAST exams",
      "Immediate discharge if FAST is negative and fetal heart tones are normal"
    ],
    correctAnswer: 1,
    rationaleLong: "Current trauma guidelines recommend a minimum of 4-6 hours of continuous cardiotocographic (fetal heart rate and uterine contraction) monitoring for pregnant trauma patients beyond 20 weeks gestation, even when the initial presentation appears stable. This monitoring period is critical because placental abruption - the most common cause of fetal death in maternal trauma - can present with a delayed onset. The placenta lacks elastic tissue and cannot stretch with the uterine wall during deceleration forces, making it susceptible to shearing from the uterine wall. Early placental abruption may not show external vaginal bleeding (concealed abruption) or hemodynamic changes initially, but will manifest as uterine contractions, fetal heart rate abnormalities (decelerations, loss of variability, bradycardia), and uterine tenderness on the tocodynamometry monitor. The monitoring period should be extended to 24 hours if any of the following are present: contractions more frequent than every 10 minutes, vaginal bleeding, uterine tenderness, rupture of membranes, fetal heart rate abnormalities, or Kleihauer-Betke test positive for fetal-maternal hemorrhage. A Kleihauer-Betke test should be obtained on all Rh-negative pregnant trauma patients to determine the need for RhoGAM administration. Additional considerations unique to pregnant trauma patients include: (1) left lateral tilt (15-30 degrees) to prevent aortocaval compression by the gravid uterus, (2) normal pregnancy physiology masks blood loss (up to 30-35% blood volume can be lost before maternal signs develop), and (3) fetal distress may be the earliest sign of maternal hemorrhage. Immediate discharge is never appropriate for significant mechanism trauma in pregnancy.",
    learningObjective: "Apply appropriate fetal monitoring duration guidelines for pregnant trauma patients to detect delayed placental abruption",
    blueprintCategory: "Trauma Emergencies",
    subtopic: "Trauma in Pregnancy",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Normal maternal vitals in pregnancy don't exclude significant hemorrhage - pregnancy increases blood volume by 40-50%",
    clinicalPearls: [
      "Minimum 4-6 hours continuous fetal monitoring for pregnant trauma patients > 20 weeks",
      "Extend to 24 hours if: contractions, bleeding, uterine tenderness, or fetal HR abnormalities",
      "Left lateral tilt prevents aortocaval compression in pregnant patients > 20 weeks",
      "Kleihauer-Betke test for all Rh-negative pregnant trauma patients"
    ],
    safetyNote: "Fetal distress may be the earliest sign of maternal hemorrhage - the fetus is more sensitive to hypoperfusion than the mother",
    distractorRationales: [
      "2 hours is insufficient to detect delayed placental abruption",
      "4-6 hours is the recommended minimum monitoring period for stable pregnant trauma patients",
      "24 hours is reserved for patients with concerning findings during initial monitoring",
      "Immediate discharge is never appropriate after significant mechanism trauma in pregnancy"
    ],
    lessonLink: "/emergency/lessons/trauma-in-pregnancy"
  },
  {
    stem: "A 18-year-old male presents with a penetrating wound to the left groin from a broken glass table. He has active arterial bleeding from the wound. Direct pressure is being applied but bleeding continues. Vital signs are BP 90/58 mmHg, HR 132 bpm. What is the most appropriate hemorrhage control method?",
    options: [
      "Apply a standard extremity tourniquet above the wound",
      "Pack the wound with hemostatic gauze and apply direct pressure for 3 minutes",
      "Apply a pelvic binder to compress the bleeding vessel",
      "Clamp the visible bleeding vessel with a hemostat"
    ],
    correctAnswer: 1,
    rationaleLong: "Junctional hemorrhage (bleeding from areas where the extremity meets the trunk - groin, axilla, neck) presents a unique challenge because standard extremity tourniquets cannot be effectively applied to these anatomic locations. The groin is a junctional zone where the femoral artery exits the pelvis, and injuries here can result in rapid, life-threatening hemorrhage. When direct pressure alone fails to control junctional hemorrhage, the recommended approach is wound packing with hemostatic gauze (such as QuikClot Combat Gauze or Celox) combined with sustained direct pressure. The technique involves: (1) packing the hemostatic gauze directly into the wound cavity, pushing it firmly against the bleeding vessel, (2) continuing to pack until the wound is completely filled, (3) applying direct manual pressure over the packed wound for a minimum of 3 minutes (5 minutes for hemostatic agents to activate). This technique has shown effectiveness rates of 79-91% in controlling junctional hemorrhage in both military and civilian settings. Standard extremity tourniquets cannot be placed high enough in the groin to compress the proximal femoral artery against the pelvic bone. Specialized junctional tourniquets (Combat Ready Clamp, SAM Junctional Tourniquet) exist but are not commonly available in most civilian EDs. A pelvic binder is for pelvic fracture-related hemorrhage, not penetrating groin wounds. Blindly clamping a visible vessel with a hemostat is not recommended as it can damage adjacent nerves and vessels and is rarely effective for deep wounds.",
    learningObjective: "Apply wound packing with hemostatic gauze for junctional hemorrhage control when direct pressure fails",
    blueprintCategory: "Trauma Emergencies",
    subtopic: "Hemorrhage Control",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Standard tourniquets cannot be applied to junctional zones (groin, axilla, neck) - use wound packing instead",
    clinicalPearls: [
      "Junctional zones: groin, axilla, neck - standard tourniquets don't work here",
      "Pack hemostatic gauze directly into wound and against bleeding vessel",
      "Maintain direct pressure over packed wound for minimum 3-5 minutes",
      "Specialized junctional tourniquets exist but are not widely available in civilian EDs"
    ],
    safetyNote: "Do not remove initial packing to check for bleeding - add more gauze on top if blood soaks through",
    distractorRationales: [
      "Standard tourniquets cannot be applied effectively to junctional zones like the groin",
      "Hemostatic wound packing with sustained pressure is the correct approach for junctional hemorrhage",
      "Pelvic binders are for pelvic fracture hemorrhage, not penetrating groin wounds",
      "Blind clamping of vessels can damage adjacent structures and is rarely effective"
    ],
    lessonLink: "/emergency/lessons/hemorrhage-control"
  },
  {
    stem: "A 52-year-old male falls from a roof and sustains an unstable pelvic fracture (open book). BP is 78/42 mmHg, HR 140 bpm. FAST exam shows free fluid in the pelvis. What is the emergency nurse's priority intervention?",
    options: [
      "Apply a pelvic binder at the level of the greater trochanters",
      "Insert a urinary catheter to monitor urine output",
      "Obtain CT pelvis with contrast for definitive fracture characterization",
      "Start IV normal saline at wide-open rate through bilateral large-bore IVs"
    ],
    correctAnswer: 0,
    rationaleLong: "In an unstable (open book) pelvic fracture with hemodynamic instability, the immediate priority is application of a pelvic binder (circumferential pelvic compression device) at the level of the greater trochanters. An open book pelvic fracture disrupts the pubic symphysis and/or sacroiliac joints, causing the pelvic ring to 'open' and increasing the pelvic volume. The pelvis can accommodate up to 4 liters of blood in this expanded space, leading to massive retroperitoneal hemorrhage from disrupted venous plexuses and arterial branches. The pelvic binder works by mechanically closing the pelvic ring, reducing the pelvic volume, and creating a tamponade effect on the bleeding vessels. Correct placement is critical: the binder must be placed at the level of the greater trochanters (NOT at the iliac crests) because the greater trochanters are the widest point of the pelvis and the binder needs to compress the pelvis at this level to effectively reduce the fracture. Applying the binder takes less than 30 seconds and can be lifesaving. A urinary catheter should NOT be inserted until a pelvic fracture has been evaluated because pelvic fractures are associated with urethral disruption. Signs of urethral injury include: blood at the meatus, high-riding prostate on rectal exam, perineal ecchymosis, and inability to void. If urethral injury is suspected, a retrograde urethrogram must be performed before catheter insertion. CT is inappropriate for this hemodynamically unstable patient. IV fluids are important but the pelvic binder addresses the hemorrhage source.",
    learningObjective: "Apply a pelvic binder at the greater trochanters for hemodynamically unstable open book pelvic fractures",
    blueprintCategory: "Trauma Emergencies",
    subtopic: "Pelvic Fractures",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Pelvic binder placement: at the GREATER TROCHANTERS, not the iliac crests - this is the most common error",
    clinicalPearls: [
      "Pelvic binder at greater trochanters - takes < 30 seconds and can be lifesaving",
      "Unstable pelvis can hold up to 4 liters of blood",
      "Do NOT insert urinary catheter until urethral injury is excluded (blood at meatus, high-riding prostate)",
      "Pelvic binder should not be removed until patient is in OR or angiography suite"
    ],
    safetyNote: "Never insert a urinary catheter in pelvic fracture patients until urethral injury is ruled out - can create a false passage",
    distractorRationales: [
      "Pelvic binder is the immediate priority to reduce pelvic volume and tamponade hemorrhage",
      "Urinary catheter must be deferred until urethral injury is excluded",
      "CT is inappropriate for a hemodynamically unstable patient",
      "IV fluids are supportive but do not address the hemorrhage source"
    ],
    lessonLink: "/emergency/lessons/pelvic-fractures"
  },
  {
    stem: "A 27-year-old male sustains an isolated, closed mid-shaft femur fracture from a skiing accident. In the field, EMS applied a traction splint. Upon ED arrival, the emergency nurse should reassess for which potential complication specific to femur fractures?",
    options: [
      "Fat embolism syndrome developing 24-72 hours after the fracture",
      "Compartment syndrome of the thigh from internal hemorrhage",
      "Popliteal artery injury from displaced fracture fragments",
      "All of the above are potential complications that should be monitored"
    ],
    correctAnswer: 3,
    rationaleLong: "All three complications listed are potential complications of mid-shaft femur fractures that the emergency nurse should monitor for, making 'all of the above' the correct answer. (1) Fat embolism syndrome (FES) develops 24-72 hours after long bone fractures when fat globules from the bone marrow enter the venous circulation and embolize to the lungs, brain, and skin. The classic triad is respiratory distress, neurological changes (confusion, agitation), and petechial rash (typically on the chest, axillae, and conjunctivae). FES occurs in 3-10% of isolated long bone fractures and up to 33% of bilateral femur fractures. It is a clinical diagnosis with no definitive diagnostic test. (2) Compartment syndrome of the thigh can develop from internal hemorrhage - a closed femur fracture can cause 1-1.5 liters of blood loss into the thigh compartment. Signs include pain out of proportion to injury, pain with passive stretch of the thigh muscles, tense swelling, and eventually neurovascular compromise. While thigh compartment syndrome is less common than leg compartment syndrome, it can occur, particularly with significant displacement. (3) Popliteal artery injury can occur when displaced femur fracture fragments (particularly distal third fractures) damage the popliteal artery as it passes through the popliteal fossa. Signs include absent pedal pulses, pale or cool foot, and ankle-brachial index < 0.9. The emergency nurse should perform serial neurovascular assessments including: distal pulses, sensation, motor function, compartment pressure assessment (pain, swelling, tension), and monitoring for signs of FES (respiratory status, mental status, skin rash). A traction splint maintains alignment, reduces pain, and helps control hemorrhage by stabilizing the fracture fragments.",
    learningObjective: "Monitor for multiple potential complications of femur fractures including fat embolism, compartment syndrome, and vascular injury",
    blueprintCategory: "Trauma Emergencies",
    subtopic: "Lower Extremity Injuries",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Fat embolism syndrome presents 24-72 hours after fracture - don't miss the delayed presentation",
    clinicalPearls: [
      "FES triad: respiratory distress + neurological changes + petechial rash (24-72 hours post-fracture)",
      "Closed femur fracture blood loss: 1-1.5 liters per fracture",
      "Distal third femur fractures have highest risk of popliteal artery injury",
      "Traction splint maintains alignment, reduces pain, and helps control hemorrhage"
    ],
    safetyNote: "Serial neurovascular assessments every 1-2 hours are essential after femur fracture - document pulses, sensation, motor, and compartment status",
    distractorRationales: [
      "Fat embolism is a real risk 24-72 hours after long bone fractures",
      "Thigh compartment syndrome can develop from internal hemorrhage",
      "Popliteal artery injury is possible with displaced fracture fragments",
      "All three are valid complications that should be monitored"
    ],
    lessonLink: "/emergency/lessons/lower-extremity-injuries"
  }
];
