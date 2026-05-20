import { EmergencyNursingQuestion } from "./types";

export const traumaBatch2Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 44-year-old male is brought to the ED after being found face-down in a shallow pool. He is cyanotic, apneic, and pulseless. Water is noted in the oropharynx. Core temperature is 32°C (89.6°F). What is the appropriate sequence of interventions?",
    options: [
      "Perform the Heimlich maneuver to expel water from the lungs before starting CPR",
      "Begin CPR immediately, warm the patient actively, and continue resuscitation until the patient reaches normothermia or return of spontaneous circulation",
      "Pronounce the patient deceased due to the drowning mechanism and hypothermia",
      "Defer CPR until the patient is rewarmed to 35°C using passive warming techniques"
    ],
    correctAnswer: 1,
    rationaleLong: "Drowning victims who are pulseless require immediate CPR regardless of water in the airway. The Heimlich maneuver is NOT recommended for drowning because it does not effectively remove water from the lungs (which rapidly absorbs into pulmonary tissue), delays effective ventilations, and increases the risk of gastric aspiration. Standard CPR with emphasis on rescue breathing should begin immediately. The hypothermia (32°C) is a critical consideration — the well-known axiom 'no one is dead until they are warm and dead' applies here. Hypothermic patients have dramatically reduced metabolic demands and may survive prolonged cardiac arrest with good neurological outcomes that would be impossible at normal body temperature. Active rewarming should occur simultaneously with CPR using warmed IV fluids (40-42°C), warm humidified oxygen, warm blankets, and potentially peritoneal lavage or extracorporeal membrane oxygenation (ECMO) for severe hypothermia. Defibrillation may be ineffective below 30°C, but attempts should be made. CPR should continue until the core temperature reaches at least 32-35°C before any decision to terminate resuscitation is made. The emergency nurse must maintain continuous core temperature monitoring (esophageal or rectal probe), coordinate active rewarming measures, and support prolonged resuscitation efforts. Survival with intact neurological function has been documented after 45+ minutes of submersion in cold water, particularly in pediatric patients.",
    learningObjective: "Apply appropriate resuscitation protocols for hypothermic drowning victims including the principle of warming before declaring death",
    blueprintCategory: "Trauma",
    subtopic: "multi-system trauma",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The Heimlich maneuver is NOT recommended for drowning — it delays ventilation, does not remove water from lungs, and increases aspiration risk",
    clinicalPearls: [
      "No one is dead until they are warm and dead — continue CPR until normothermic",
      "Heimlich maneuver is contraindicated in drowning — begin CPR with emphasis on ventilations",
      "Defibrillation may be ineffective below 30°C but attempts should still be made"
    ],
    safetyNote: "Do not terminate resuscitation in a hypothermic patient until core temperature reaches at least 32-35°C — survival with intact neurological function is possible",
    distractorRationales: [
      "Heimlich maneuver is not recommended for drowning and delays effective resuscitation",
      "Pronouncing death without rewarming violates the warm-and-dead principle",
      "Deferring CPR until passive rewarming occurs wastes critical time — active warming with concurrent CPR is required"
    ],
    lessonPath: "/emergency/lessons/multi-system-trauma"
  },
  {
    stem: "A 36-year-old female is struck by a car at approximately 30 mph while walking. She presents with a deformed right femur, an unstable pelvis, and left-sided abdominal tenderness. She is pale, diaphoretic, with HR 142 bpm and BP 70/40 mmHg. The nurse estimates she is in which class of hemorrhagic shock?",
    options: [
      "Class I — less than 15% blood volume loss",
      "Class II — 15-30% blood volume loss",
      "Class III — 30-40% blood volume loss",
      "Class IV — greater than 40% blood volume loss"
    ],
    correctAnswer: 3,
    rationaleLong: "This patient's presentation is consistent with Class IV hemorrhagic shock, representing greater than 40% blood volume loss (greater than 2000 mL in an average adult). The classification of hemorrhagic shock is based on estimated blood loss and clinical findings: Class I (up to 15%, up to 750 mL) — normal vital signs, slight anxiety. Class II (15-30%, 750-1500 mL) — tachycardia, narrowed pulse pressure, anxiety. Class III (30-40%, 1500-2000 mL) — tachycardia greater than 120, decreased BP, confusion. Class IV (greater than 40%, greater than 2000 mL) — marked tachycardia, severely decreased BP, lethargy/obtunded. This patient has multiple sources of hemorrhage: a femur fracture (750-1500 mL), an unstable pelvis (1500-3000+ mL), and suspected splenic or other solid organ injury (left abdominal tenderness). The severely depressed blood pressure (70/40), marked tachycardia (142), and signs of poor perfusion (pale, diaphoretic) indicate that compensatory mechanisms have been overwhelmed. In Class IV shock, the patient is in imminent danger of cardiac arrest. The emergency nurse must immediately activate the massive transfusion protocol, apply a pelvic binder, prepare for emergent operative intervention, and provide damage control resuscitation with a 1:1:1 ratio of PRBCs, FFP, and platelets. Every minute of delay increases mortality. The pale, diaphoretic presentation indicates maximal sympathetic activation with peripheral vasoconstriction — the body's last attempt to maintain perfusion to vital organs.",
    learningObjective: "Classify hemorrhagic shock by class based on clinical parameters and estimated blood loss",
    blueprintCategory: "Trauma",
    subtopic: "multi-system trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Class IV shock with BP 70/40 and HR 142 indicates more than 40% blood volume loss — multiple hemorrhage sources must be identified and controlled simultaneously",
    clinicalPearls: [
      "Class IV shock: greater than 40% blood loss, marked tachycardia, severely decreased BP, altered mental status",
      "Combined femur fracture + pelvic disruption + abdominal injury can easily exceed 40% blood volume loss",
      "Massive transfusion protocol should be activated without delay in Class IV shock"
    ],
    safetyNote: "Class IV hemorrhagic shock has a mortality rate exceeding 50% without immediate aggressive intervention — do not underestimate the severity",
    distractorRationales: [
      "Class I has normal vital signs and minimal anxiety — this patient is far more compromised",
      "Class II has tachycardia but maintains blood pressure — this patient has severe hypotension",
      "Class III has tachycardia greater than 120 and decreased BP but this patient's severity exceeds Class III parameters"
    ],
    lessonPath: "/emergency/lessons/multi-system-trauma"
  },
  {
    stem: "A 50-year-old male presents to the ED after being kicked in the chest by a horse. He has a large flail segment of the left chest wall. On auscultation, breath sounds are absent on the left side with hyperresonance to percussion. He is increasingly dyspneic with SpO2 of 85%. The nurse prepares for which immediate intervention?",
    options: [
      "Application of a commercial chest wall stabilization device over the flail segment",
      "Needle decompression followed by chest tube insertion for the associated pneumothorax",
      "Administration of high-flow oxygen and preparation for non-invasive positive pressure ventilation",
      "Immediate intubation with mechanical ventilation to internally splint the flail segment"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has both a flail chest AND an associated tension pneumothorax on the same side. The absent breath sounds and hyperresonance to percussion on the left are classic findings of pneumothorax — not flail chest alone. Flail chest would produce paradoxical chest wall movement and decreased breath sounds from the underlying pulmonary contusion, but hyperresonance indicates free air in the pleural space. The combination of flail chest with pneumothorax is common because the rib fractures that create the flail segment can also lacerate the visceral pleura, allowing air to escape from the lung into the pleural space. The worsening dyspnea and SpO2 of 85% suggest the pneumothorax is becoming a tension pneumothorax. The immediate intervention is needle decompression at the 2nd intercostal space, midclavicular line, to convert the tension pneumothorax to a simple pneumothorax, followed by chest tube insertion for definitive management. The chest tube will also serve to evacuate any associated hemothorax. While flail chest management may ultimately require intubation and mechanical ventilation, addressing the pneumothorax is the more immediately life-threatening condition. Positive pressure ventilation in the setting of an untreated pneumothorax can worsen the tension pneumothorax by forcing more air into the pleural space. A chest wall stabilization device alone will not address the pneumothorax. The nurse must recognize that multiple pathologies can coexist and must be prioritized based on immediate life threat.",
    learningObjective: "Identify and prioritize coexisting thoracic injuries — pneumothorax takes priority over flail chest management",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Hyperresonance with absent breath sounds indicates pneumothorax, NOT just flail chest — distinguish between the two coexisting pathologies",
    clinicalPearls: [
      "Flail chest and pneumothorax commonly coexist — rib fractures can lacerate the visceral pleura",
      "Hyperresonance = air (pneumothorax); dullness = fluid (hemothorax)",
      "Positive pressure ventilation can worsen an untreated pneumothorax"
    ],
    safetyNote: "Always rule out and treat pneumothorax BEFORE initiating positive pressure ventilation in chest trauma — PPV can convert a simple to tension pneumothorax",
    distractorRationales: [
      "Chest wall stabilization addresses the flail segment but not the pneumothorax — the more immediate life threat",
      "NIPPV with an untreated pneumothorax can worsen tension and cause cardiac arrest",
      "Intubation with PPV before treating the pneumothorax will worsen the tension pneumothorax"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "A 23-year-old male presents to the ED with a superficial laceration to the right forearm from a broken window. The wound is clean, 4 cm long, and not involving tendons or neurovascular structures. His last tetanus immunization was 12 years ago. What is the appropriate tetanus prophylaxis?",
    options: [
      "No tetanus prophylaxis needed for a clean superficial wound",
      "Tdap or Td vaccine only",
      "Tetanus immune globulin (TIG) only",
      "Both Tdap/Td vaccine AND tetanus immune globulin (TIG)"
    ],
    correctAnswer: 1,
    rationaleLong: "Tetanus prophylaxis decisions in wound management are based on two factors: the patient's tetanus immunization history and the wound classification (clean vs. tetanus-prone). Clean, minor wounds include those that are superficial, not contaminated, not devitalized, and do not involve deep puncture wounds, crush injuries, or contact with soil, feces, or rusty metal. Tetanus-prone wounds include those that are contaminated, devitalized, contain foreign bodies, involve crush mechanisms, are deep puncture wounds, or have been open for more than 6 hours. For this patient with a clean, superficial laceration: the wound is clean (broken window glass, not soil or rusty metal), superficial (not deep puncture), and not contaminated. His last tetanus immunization was 12 years ago — for clean minor wounds, a booster is recommended if the last dose was more than 10 years ago. For tetanus-prone wounds, the threshold is more than 5 years. Since his last dose was 12 years ago and this is a clean wound (threshold 10 years), he needs the Tdap or Td vaccine but does NOT need tetanus immune globulin (TIG). TIG provides passive immunity with preformed antibodies and is only indicated for tetanus-prone wounds in patients who have received fewer than 3 prior tetanus immunizations or whose immunization history is unknown. The emergency nurse should administer the Tdap vaccine (preferred over Td if the patient has not received Tdap before, as it also provides pertussis protection) and document the administration for the patient's records.",
    learningObjective: "Apply tetanus prophylaxis guidelines based on wound classification and immunization history",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Clean wounds need a booster if the last dose was more than 10 years ago; tetanus-prone wounds need a booster if more than 5 years ago",
    clinicalPearls: [
      "Clean wounds: vaccine booster if last dose was more than 10 years ago",
      "Tetanus-prone wounds: vaccine booster if last dose was more than 5 years ago",
      "TIG is only for tetanus-prone wounds in patients with fewer than 3 prior immunizations or unknown history"
    ],
    safetyNote: "Tdap is preferred over Td for the first booster to provide pertussis protection — check prior Tdap history",
    distractorRationales: [
      "A clean wound still needs a booster if the last immunization was more than 10 years ago",
      "TIG is not needed for clean minor wounds regardless of immunization timing",
      "Both vaccine and TIG are only needed for tetanus-prone wounds in incompletely immunized patients"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 38-year-old male construction worker is brought to the ED after a concrete wall collapsed on his lower body. His right leg was trapped for approximately 6 hours before extrication. The rescue team started IV fluids in the field. Upon arrival, his ECG shows peaked T waves and a widened QRS complex. What medication should the nurse prepare to administer FIRST?",
    options: [
      "Sodium bicarbonate 50 mEq IV push",
      "Calcium gluconate 10% 30 mL IV over 2-3 minutes",
      "Regular insulin 10 units IV with D50W 25g",
      "Albuterol 10 mg via nebulizer"
    ],
    correctAnswer: 1,
    rationaleLong: "Peaked T waves and a widened QRS complex on ECG are hallmark findings of severe hyperkalemia, which in this clinical context is caused by crush syndrome with massive rhabdomyolysis. After 6 hours of entrapment, the crushed muscle tissue has released enormous amounts of intracellular potassium into the circulation upon extrication. The most immediately life-threatening consequence of hyperkalemia is its effect on cardiac conduction — the peaked T waves represent accelerated repolarization, and the widened QRS indicates slowed ventricular conduction. Without treatment, this will progress to sine wave pattern and ultimately ventricular fibrillation or asystole. Calcium gluconate (or calcium chloride) is the FIRST medication to administer because it works within 1-3 minutes by stabilizing the cardiac cell membrane. Calcium does not lower the serum potassium level — it provides cardioprotection by raising the threshold potential of myocardial cells, making them less excitable and less likely to develop fatal dysrhythmias. The effect lasts approximately 30-60 minutes, which provides a window to institute other therapies that actually lower potassium. After calcium administration, the next steps include sodium bicarbonate (shifts potassium intracellularly and treats acidosis), insulin with dextrose (drives potassium into cells over 15-30 minutes), and albuterol nebulization (shifts potassium intracellularly). Loop diuretics and sodium polystyrene sulfonate promote potassium excretion but work more slowly. If the patient remains unstable, emergent hemodialysis may be required. The emergency nurse must recognize these ECG changes as an immediate life threat requiring urgent intervention.",
    learningObjective: "Prioritize calcium gluconate as the first-line cardioprotective agent in hyperkalemia with ECG changes from crush syndrome",
    blueprintCategory: "Trauma",
    subtopic: "crush injuries",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Calcium gluconate does NOT lower potassium — it stabilizes the cardiac membrane. It must be followed by therapies that actually shift or remove potassium",
    clinicalPearls: [
      "Peaked T waves + widened QRS = severe hyperkalemia requiring immediate intervention",
      "Calcium gluconate works in 1-3 minutes by stabilizing cardiac membrane — first-line for ECG changes",
      "Follow calcium with insulin/dextrose, sodium bicarbonate, and albuterol to shift potassium intracellularly"
    ],
    safetyNote: "Hyperkalemia with ECG changes is a cardiac arrest precursor — calcium gluconate administration should not be delayed for lab confirmation",
    distractorRationales: [
      "Sodium bicarbonate shifts potassium intracellularly but calcium should be given first for cardiac membrane stabilization",
      "Insulin with dextrose takes 15-30 minutes to work — calcium provides immediate cardioprotection",
      "Albuterol helps shift potassium but takes 15-30 minutes and does not provide immediate cardiac stabilization"
    ],
    lessonPath: "/emergency/lessons/crush-injuries"
  },
  {
    stem: "A 17-year-old female cheerleader presents to the ED after a fall from a pyramid formation, landing on her outstretched right hand. She has pain and deformity at the right wrist with dorsal displacement. Radiographs confirm a dorsally angulated distal radius fracture (Colles fracture). The nurse notes the hand is cool with weak radial pulse and delayed capillary refill. What is the priority nursing concern?",
    options: [
      "Pain management with IV analgesics before any manipulation",
      "Neurovascular compromise requiring urgent fracture reduction to restore perfusion",
      "Applying a plaster splint for immobilization before orthopedic evaluation",
      "Obtaining CT imaging for surgical planning before any intervention"
    ],
    correctAnswer: 1,
    rationaleLong: "The cool hand with weak radial pulse and delayed capillary refill indicates neurovascular compromise distal to the fracture site. This is an orthopedic emergency — the dorsally displaced fracture fragment is likely compressing or stretching the radial artery, compromising blood flow to the hand. Without urgent reduction to restore anatomic alignment and relieve vascular compression, the hand is at risk for ischemic injury. Prolonged ischemia (greater than 6 hours) can lead to irreversible muscle and nerve damage, potentially resulting in loss of hand function or even requiring amputation. The priority is urgent fracture reduction — typically performed in the ED under procedural sedation or hematoma block — to restore anatomic alignment and relieve vascular compression. After reduction, the nurse must immediately reassess the neurovascular status (radial pulse strength, capillary refill, hand warmth, sensation, and motor function) to confirm that perfusion has been restored. If neurovascular compromise persists after reduction, emergent surgical exploration is required. While pain management is important and should be provided, it should not delay reduction when neurovascular compromise is present. Splinting without reduction perpetuates the vascular compromise. CT imaging is not needed and would delay the time-critical intervention. The nurse must clearly communicate the neurovascular findings to the treating physician and advocate for urgent reduction.",
    learningObjective: "Recognize neurovascular compromise in extremity fractures and prioritize urgent reduction to restore perfusion",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "A cool extremity with weak or absent pulses distal to a fracture is an emergency — reduction to restore perfusion takes priority over imaging and definitive fixation",
    clinicalPearls: [
      "Cool extremity + weak pulse + delayed cap refill distal to fracture = neurovascular compromise",
      "Irreversible ischemic damage begins after approximately 6 hours",
      "Post-reduction neurovascular assessment is mandatory to confirm restoration of perfusion"
    ],
    safetyNote: "Document neurovascular status before and after every fracture reduction — any persistent compromise after reduction requires emergent surgical exploration",
    distractorRationales: [
      "Pain management should not delay reduction when neurovascular compromise is present",
      "Splinting without reduction perpetuates the vascular compromise and risks ischemic injury",
      "CT imaging delays time-critical reduction and is not needed for ED management of neurovascular compromise"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 28-year-old male is brought to the ED after a motorcycle crash. He has a significant scalp laceration with profuse bleeding. Despite pressure, the bleeding continues. His hemoglobin drops from 12 to 8 g/dL over 2 hours. What does the nurse recognize about scalp hemorrhage?",
    options: [
      "Scalp lacerations rarely cause significant blood loss in adults",
      "The scalp has extensive vascularity and lacerated vessels within the galea cannot constrict normally, leading to potentially life-threatening hemorrhage",
      "Scalp bleeding always indicates an underlying skull fracture requiring urgent CT",
      "Direct pressure for 5 minutes is always sufficient to control scalp hemorrhage"
    ],
    correctAnswer: 1,
    rationaleLong: "The scalp is one of the most highly vascularized regions of the body, supplied by branches of both the internal and external carotid arteries (supraorbital, supratrochlear, superficial temporal, posterior auricular, and occipital arteries). What makes scalp hemorrhage particularly dangerous is the anatomy of the galea aponeurotica — a tough fibrous layer that connects the frontalis and occipitalis muscles. Blood vessels within and beneath the galea are tethered to this fibrous tissue and cannot retract and constrict normally when lacerated, unlike vessels in most other body regions. This means that scalp lacerations continue to bleed actively until mechanically controlled. In trauma patients, especially those with coagulopathy, hypothermia, or on anticoagulant medications, scalp hemorrhage can be profoundly significant. A large scalp laceration can lose blood rapidly enough to cause hemorrhagic shock. The hemoglobin drop from 12 to 8 g/dL represents significant blood loss. Control measures include direct pressure, wound edge approximation using Raney clips or sutures, figure-of-eight suture techniques, or in severe cases, direct clamping of identified bleeding vessels. In pediatric patients, scalp hemorrhage is even more dangerous because of their smaller total blood volume — a scalp laceration that might be manageable in an adult could cause life-threatening shock in a small child. The emergency nurse must recognize that persistent scalp bleeding despite pressure requires escalated interventions and close hemodynamic monitoring.",
    learningObjective: "Understand the unique vascular anatomy of the scalp and the potential for significant hemorrhage from scalp lacerations",
    blueprintCategory: "Trauma",
    subtopic: "blunt trauma",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Scalp hemorrhage can be life-threatening — vessels within the galea cannot constrict normally, leading to continued active bleeding",
    clinicalPearls: [
      "Scalp vessels are tethered to the galea aponeurotica and cannot retract and constrict when lacerated",
      "Raney clips, sutures, or figure-of-eight technique may be needed to control persistent bleeding",
      "Pediatric scalp hemorrhage is especially dangerous due to smaller total blood volume"
    ],
    safetyNote: "Never underestimate scalp hemorrhage — monitor hemoglobin and hemodynamic status closely in patients with large scalp lacerations",
    distractorRationales: [
      "Scalp lacerations CAN cause significant, life-threatening blood loss due to the unique vascular anatomy",
      "Scalp bleeding does not always indicate skull fracture — it can occur from isolated soft tissue injury",
      "Direct pressure for 5 minutes may be insufficient — scalp vessels require mechanical closure techniques"
    ],
    lessonPath: "/emergency/lessons/blunt-trauma"
  },
  {
    stem: "A 60-year-old female presents after a ground-level fall. She has tenderness over the right hip with limited range of motion. Radiographs reveal a right femoral neck fracture. The nurse notices the right lower extremity is shortened and internally rotated. What does this position indicate compared to the typical external rotation seen in intertrochanteric fractures?",
    options: [
      "The internal rotation is a normal variant with no clinical significance",
      "Internal rotation suggests a posterior hip dislocation rather than a femoral neck fracture",
      "Internal rotation with a femoral neck fracture may indicate a displaced fracture with vascular compromise to the femoral head",
      "Internal rotation indicates the fracture is stable and does not require surgical fixation"
    ],
    correctAnswer: 2,
    rationaleLong: "The position of the lower extremity in hip fractures provides important clinical information. Most hip fractures (both femoral neck and intertrochanteric) present with the classic shortened and externally rotated position due to the pull of the iliopsoas and external rotator muscles on the proximal femur. When a femoral neck fracture presents with internal rotation instead, this is clinically significant and suggests a displaced fracture pattern (Garden classification III or IV). In a displaced femoral neck fracture, the femoral head may be rotated within the acetabulum, and the displacement pattern can cause the extremity to assume an internally rotated position. The critical concern with displaced femoral neck fractures is disruption of the blood supply to the femoral head. The primary blood supply comes from the medial femoral circumflex artery, which runs along the femoral neck. Displaced fractures can stretch, kink, or tear this artery, leading to avascular necrosis (AVN) of the femoral head if blood flow is not restored within 6-12 hours. This makes displaced femoral neck fractures a time-sensitive surgical emergency — ideally repaired within 6 hours to reduce the risk of AVN. Non-displaced fractures (Garden I-II) may be treated with internal fixation, while displaced fractures in elderly patients often require hemiarthroplasty or total hip arthroplasty. The nurse must communicate the atypical positioning to the orthopedic team and facilitate timely surgical consultation. Posterior hip dislocation also causes internal rotation and shortening but the femoral head would not be in the acetabulum on radiograph.",
    learningObjective: "Correlate extremity positioning with fracture pattern and vascular complications in femoral neck fractures",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Internal rotation in a femoral neck fracture is atypical and suggests displacement with potential vascular compromise — this changes the surgical urgency",
    clinicalPearls: [
      "Most hip fractures: shortened + externally rotated; atypical internal rotation suggests displacement",
      "Displaced femoral neck fractures risk avascular necrosis from disrupted blood supply",
      "Surgical repair within 6 hours reduces AVN risk in displaced femoral neck fractures"
    ],
    safetyNote: "Report atypical extremity positioning in hip fractures promptly — displaced femoral neck fractures are time-sensitive emergencies due to AVN risk",
    distractorRationales: [
      "Internal rotation in a femoral neck fracture is NOT a normal variant — it has specific clinical implications",
      "While posterior hip dislocation causes internal rotation, the radiographs confirmed a femoral neck fracture",
      "Internal rotation with displacement suggests an unstable fracture pattern that requires surgical fixation"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 9-year-old child is brought to the ED after a bicycle collision with a car. The child has handlebar marks on the epigastric region. He initially appeared well but over 4 hours develops increasing abdominal pain, guarding, and bilious vomiting. What injury should the nurse suspect?",
    options: [
      "Splenic laceration with delayed hemorrhage",
      "Pancreatic or duodenal injury from handlebar compression against the spine",
      "Gastric rupture from blunt force to a full stomach",
      "Renal contusion from flank impact"
    ],
    correctAnswer: 1,
    rationaleLong: "Handlebar injuries in pediatric patients are a classic mechanism for pancreatic and duodenal injuries. The handlebar end creates a focal point of compression that drives the anterior abdominal wall structures (pancreas and duodenum, which lie retroperitoneally against the lumbar spine) between the handlebar and the vertebral column. The pancreas is particularly vulnerable because it crosses the midline draped over the lumbar spine. Duodenal injuries (hematoma or perforation) can occur from the same mechanism because the duodenum is also retroperitoneal and compressed against the spine. The clinical presentation described is classic for these injuries: an initially well-appearing child (because retroperitoneal injuries may not cause immediate peritoneal signs) who develops delayed symptoms over hours. Increasing abdominal pain, guarding, and bilious vomiting suggest either duodenal obstruction (from an intramural hematoma) or perforation with bile peritonitis. Serum lipase and amylase levels should be obtained and will likely be elevated if the pancreas is injured. CT scan with IV contrast is the diagnostic study of choice. The epigastric location of the handlebar marks further supports this diagnosis — the epigastrium overlies the pancreas and duodenum, not the spleen (left upper quadrant) or kidneys (flanks). The delayed presentation is a hallmark of retroperitoneal injuries and should not provide false reassurance. The nurse must maintain a high index of suspicion for handlebar injuries and advocate for serial examinations and appropriate imaging.",
    learningObjective: "Recognize handlebar mechanism injuries in pediatric patients as high-risk for pancreatic and duodenal injury with delayed presentation",
    blueprintCategory: "Trauma",
    subtopic: "pediatric trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Handlebar injuries to the epigastrium can cause retroperitoneal injuries that present hours later — an initially well-appearing child does not rule out significant injury",
    clinicalPearls: [
      "Handlebar injuries compress the pancreas and duodenum against the spine",
      "Retroperitoneal injuries may have delayed presentation — serial exams are essential",
      "Elevated lipase/amylase supports pancreatic injury in the setting of handlebar mechanism"
    ],
    safetyNote: "Children with handlebar injuries to the abdomen require extended observation (minimum 8-12 hours) even if initially asymptomatic — delayed presentations are common",
    distractorRationales: [
      "Splenic injuries are left upper quadrant — the epigastric handlebar marks localize to the midline",
      "Gastric rupture is uncommon from this mechanism and would present with immediate peritonitis",
      "Renal contusion from flank impact does not cause bilious vomiting and epigastric findings"
    ],
    lessonPath: "/emergency/lessons/pediatric-trauma"
  },
  {
    stem: "An ED nurse is preparing to assist with a resuscitative thoracotomy on a trauma patient who arrested after a penetrating chest wound. The patient has been in PEA arrest for 8 minutes. Which statement about ED thoracotomy is correct?",
    options: [
      "ED thoracotomy is indicated for all traumatic cardiac arrest regardless of mechanism",
      "ED thoracotomy for penetrating thoracic trauma with witnessed arrest and less than 15 minutes of CPR has the best survival outcomes",
      "ED thoracotomy is only performed by cardiothoracic surgeons in the operating room",
      "ED thoracotomy is contraindicated in penetrating trauma due to high infection risk"
    ],
    correctAnswer: 1,
    rationaleLong: "Resuscitative (emergency department) thoracotomy is a last-resort procedure performed in the ED for patients in traumatic cardiac arrest. The best outcomes are seen in penetrating thoracic trauma (primarily stab wounds) with witnessed arrest and less than 15 minutes of prehospital CPR. Survival rates for this specific subset of patients approach 15-35%, with the highest rates in isolated cardiac injuries amenable to repair (cardiac tamponade with a single chamber laceration). The procedure involves a left anterolateral thoracotomy (clamshell if bilateral access is needed), which allows for pericardiotomy to relieve tamponade, direct cardiac repair, cross-clamping of the descending aorta to redirect blood flow to the coronary and cerebral circulation, and open cardiac massage. The indications for ED thoracotomy are differentiated by mechanism: penetrating thoracic trauma with witnessed arrest or signs of life within 15 minutes has the best outcomes. Penetrating abdominal trauma with witnessed arrest has lower but still meaningful survival. Blunt trauma with arrest has the poorest outcomes (less than 1-2% survival) and is generally only considered if arrest is witnessed in the ED with less than 10 minutes of CPR. The procedure is typically performed by emergency physicians or trauma surgeons — it does not require a cardiothoracic surgeon. The emergency nurse's role includes preparing the thoracotomy tray, managing IV access and blood products, providing suction, and assisting the proceduralist. Understanding the indications helps the nurse anticipate the procedure and prepare appropriately.",
    learningObjective: "Understand the indications and survival data for ED thoracotomy in traumatic cardiac arrest",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "ED thoracotomy outcomes vary dramatically by mechanism — penetrating thoracic trauma has 15-35% survival, while blunt trauma has less than 1-2%",
    clinicalPearls: [
      "Best outcomes: penetrating thoracic trauma + witnessed arrest + less than 15 min CPR = 15-35% survival",
      "Purposes: relieve tamponade, repair cardiac injury, aortic cross-clamp, open cardiac massage",
      "Blunt trauma arrest has less than 1-2% survival with ED thoracotomy"
    ],
    safetyNote: "Ensure sharps safety during ED thoracotomy — the procedure involves open surgical instruments in a high-stress, time-critical environment",
    distractorRationales: [
      "ED thoracotomy is NOT indicated for all traumatic arrest — outcomes vary significantly by mechanism and time",
      "ED thoracotomy is performed by emergency physicians and trauma surgeons in the ED, not only in the OR",
      "ED thoracotomy is specifically indicated for penetrating trauma — it is not contraindicated"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 43-year-old male presents to the ED with a degloving injury to his right hand after it was caught in industrial machinery. The skin and subcutaneous tissue have been stripped from the dorsum of the hand, exposing the extensor tendons. What are the nurse's immediate priorities?",
    options: [
      "Apply a tourniquet to the wrist and prepare for emergent hand surgery",
      "Control hemorrhage with direct pressure, cover the wound with saline-moistened sterile dressing, assess neurovascular status, provide pain management, and elevate the extremity",
      "Irrigate the wound with hydrogen peroxide to prevent infection",
      "Attempt to reattach the avulsed skin flap using adhesive strips"
    ],
    correctAnswer: 1,
    rationaleLong: "Degloving injuries involve the avulsion of skin and subcutaneous tissue from the underlying structures, exposing tendons, muscles, nerves, and potentially bone. The immediate nursing priorities follow a systematic approach: hemorrhage control using direct pressure (tourniquets are reserved for life-threatening hemorrhage that cannot be controlled by direct pressure — most degloving injuries can be managed with direct pressure and elevation). The exposed tissues must be covered with saline-moistened sterile dressings to prevent desiccation, which would cause tissue necrosis and compromise potential reconstruction. Dry gauze can adhere to exposed tendons and cause further damage when removed. A thorough neurovascular assessment is essential — assess digital capillary refill, Allen test, sensation to light touch in each digital nerve distribution (radial and ulnar digital nerves of each finger), and motor function (tendon integrity). Pain management is critical both for patient comfort and to facilitate adequate assessment. The hand should be elevated above the level of the heart to reduce edema, which can compromise the remaining blood supply. Hydrogen peroxide is cytotoxic to exposed tissues and should never be used on wounds with exposed deep structures. Attempting to reattach avulsed skin in the ED is not appropriate — this requires specialized microsurgical or plastic surgery intervention in the operating room. The nurse should also ensure tetanus prophylaxis is current, administer IV antibiotics as ordered, and obtain radiographs to assess for underlying fractures. Hand injuries require specialized consultation and the nurse should facilitate timely referral.",
    learningObjective: "Apply appropriate wound management and assessment priorities for degloving injuries of the hand",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Cover exposed deep structures with saline-moistened gauze, NOT dry gauze — dry gauze adheres to tendons and causes further damage upon removal",
    clinicalPearls: [
      "Saline-moistened sterile dressing prevents tissue desiccation of exposed deep structures",
      "Complete neurovascular assessment including individual digital nerve distributions",
      "Hand elevation reduces edema and preserves remaining blood supply"
    ],
    safetyNote: "Never apply hydrogen peroxide, alcohol, or betadine to wounds with exposed tendons, nerves, or bone — these agents are cytotoxic to deep structures",
    distractorRationales: [
      "Tourniquets are reserved for life-threatening hemorrhage — most degloving injuries can be managed with direct pressure",
      "Hydrogen peroxide is cytotoxic to exposed tissues and should never be used on deep wounds",
      "Reattaching avulsed skin requires microsurgical expertise in the operating room, not ED adhesive strips"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 15-year-old male presents to the ED after a skiing accident. He reports that his knee 'popped' and gave way. On examination, the knee is swollen with a positive Lachman test and anterior drawer sign. He has no distal neurovascular deficits. What associated injury must the nurse assess for?",
    options: [
      "Achilles tendon rupture from the same mechanism",
      "Concomitant meniscal and collateral ligament injuries (the unhappy triad)",
      "Patellar dislocation requiring immediate reduction",
      "Growth plate (physis) fracture that may be misdiagnosed as a ligament injury in an adolescent"
    ],
    correctAnswer: 3,
    rationaleLong: "In adolescent patients with open growth plates (physes), what appears clinically to be a ligament injury may actually be a growth plate fracture. The growth plate is structurally weaker than the surrounding ligaments, tendons, and bone, making it the most vulnerable structure to injury in the immature skeleton. In adults, the same mechanism of injury would tear the ACL (as suggested by the positive Lachman and anterior drawer tests), but in adolescents with open growth plates, the force may instead cause a physeal fracture of the distal femur or proximal tibia. This distinction is critically important because growth plate fractures, if not properly diagnosed and managed, can lead to growth arrest, limb length discrepancy, and angular deformity. The Salter-Harris classification system is used to categorize physeal fractures, with Types III, IV, and V carrying the highest risk of growth disturbance. The emergency nurse must recognize that adolescent patients warrant different injury considerations than adults. Appropriate imaging should include standard knee radiographs with careful evaluation of the growth plates, and MRI may be needed to evaluate both the growth plate and ligamentous structures. While the unhappy triad (ACL tear, MCL tear, medial meniscus tear) is a valid concern, the age-specific consideration of growth plate injury takes priority in the differential. The nurse should ensure the provider is aware of the patient's skeletal maturity status. Achilles tendon rupture and patellar dislocation present with different clinical findings than described.",
    learningObjective: "Recognize that physeal fractures in adolescents can mimic ligament injuries and require age-appropriate diagnostic evaluation",
    blueprintCategory: "Trauma",
    subtopic: "pediatric trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "In adolescents with open growth plates, the physis is weaker than ligaments — what looks like an ACL tear may be a growth plate fracture with different treatment implications",
    clinicalPearls: [
      "Growth plates are weaker than ligaments in adolescents — physeal fractures can mimic ligament injuries",
      "Salter-Harris Type III-V fractures carry the highest risk of growth disturbance",
      "MRI may be needed to differentiate physeal fractures from ligament injuries in adolescents"
    ],
    safetyNote: "Always consider growth plate injury in adolescent patients with joint injuries — missed physeal fractures can lead to growth arrest and permanent deformity",
    distractorRationales: [
      "Achilles tendon rupture presents with posterior ankle pain and positive Thompson test, not knee findings",
      "While the unhappy triad is possible, the age-specific concern of growth plate fracture takes diagnostic priority",
      "Patellar dislocation presents with lateral patellar displacement, not positive Lachman and anterior drawer"
    ],
    lessonPath: "/emergency/lessons/pediatric-trauma"
  },
  {
    stem: "A 55-year-old male presents to the ED after a car-versus-pedestrian accident. He has bilateral rib fractures (ribs 9-12 on the left). The nurse should be concerned about injury to which organ given the specific rib fracture location?",
    options: [
      "Left lung — all rib fractures indicate pulmonary injury",
      "Spleen — lower left rib fractures (ribs 9-12) overlie the spleen",
      "Heart — left-sided rib fractures always indicate cardiac contusion",
      "Left kidney — lower rib fractures suggest posterior injury"
    ],
    correctAnswer: 1,
    rationaleLong: "Lower rib fractures (ribs 9-12) on the left side have a strong association with splenic injury. The spleen is located in the left upper quadrant of the abdomen, protected posterolaterally by ribs 9-12. When these specific ribs are fractured, the force of impact has been transmitted directly over the spleen, and the fractured rib ends themselves can lacerate the splenic capsule or parenchyma. Studies have shown that left lower rib fractures are associated with splenic injury in approximately 20-30% of cases. The spleen is the most commonly injured solid organ in blunt abdominal trauma overall, and its location beneath the left lower ribs makes it particularly vulnerable when these ribs are fractured. The emergency nurse must recognize this association and advocate for appropriate evaluation — typically a FAST exam (looking for free fluid in the left upper quadrant/splenorenal recess) and/or CT scan of the abdomen with IV contrast. Similarly, right-sided lower rib fractures (ribs 10-12) are associated with hepatic injury, and bilateral lower rib fractures may indicate kidney injury. The nurse should monitor for signs of delayed splenic hemorrhage including left shoulder pain (Kehr's sign — referred pain from diaphragmatic irritation by splenic blood), increasing left upper quadrant pain, and hemodynamic instability. Not all rib fractures indicate pulmonary injury — upper rib fractures (1-3) indicate high-energy impact and are associated with vascular injury, while mid-rib fractures (4-8) are most commonly associated with pulmonary contusion and pneumothorax.",
    learningObjective: "Correlate specific rib fracture locations with likely associated organ injuries",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Left lower rib fractures (9-12) = think spleen. Right lower rib fractures (10-12) = think liver. This association guides further workup",
    clinicalPearls: [
      "Left ribs 9-12 fractures associated with splenic injury in 20-30% of cases",
      "Kehr's sign: left shoulder pain from diaphragmatic irritation by splenic blood",
      "Upper rib fractures (1-3) indicate high-energy impact and potential vascular injury"
    ],
    safetyNote: "Monitor for delayed splenic hemorrhage in all patients with left lower rib fractures — delayed rupture can occur hours to days after injury",
    distractorRationales: [
      "Not all rib fractures indicate pulmonary injury — location-specific organ associations exist",
      "Left-sided rib fractures do not automatically indicate cardiac contusion — cardiac contusion is associated with sternal fractures",
      "While kidney injury is possible with lower posterior rib fractures, the left 9-12 pattern is most strongly associated with splenic injury"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "A 30-year-old male presents with a traumatic anterior hip dislocation after a dashboard impact in an MVC. The nurse notes the hip is flexed, abducted, and externally rotated. Which neurovascular structure is most at risk?",
    options: [
      "Sciatic nerve — which is posterior to the hip joint",
      "Femoral artery and nerve — which are anterior to the hip joint and vulnerable in anterior dislocations",
      "Obturator nerve — which runs through the obturator foramen",
      "Superior gluteal artery — which is superior to the piriformis"
    ],
    correctAnswer: 1,
    rationaleLong: "In anterior hip dislocations, the femoral head displaces anteriorly out of the acetabulum, positioning it in close proximity to the femoral artery, femoral vein, and femoral nerve, which traverse the anterior aspect of the hip joint within the femoral triangle. The femoral artery and nerve are at greatest risk because the anteriorly displaced femoral head can directly compress these structures against the anterior pelvic structures. The clinical presentation of a flexed, abducted, externally rotated hip is the classic position for an anterior dislocation — which is the opposite of the more common posterior dislocation that presents with flexion, adduction, and internal rotation. This distinction is important because the neurovascular structures at risk differ based on the direction of dislocation. In posterior dislocations, the sciatic nerve is at greatest risk because the femoral head displaces posteriorly toward the sciatic nerve as it exits the greater sciatic notch. The emergency nurse must perform a thorough neurovascular assessment including femoral pulse palpation, comparison of dorsalis pedis and posterior tibial pulses bilaterally, assessment of femoral nerve function (hip flexion strength, anterior thigh sensation, patellar reflex), and assessment of sciatic nerve function (plantarflexion, dorsiflexion, posterior leg sensation). Hip dislocations require urgent reduction within 6 hours to prevent avascular necrosis of the femoral head, as the blood supply (medial femoral circumflex artery) is disrupted in both anterior and posterior dislocations.",
    learningObjective: "Differentiate neurovascular risk structures based on the direction of hip dislocation",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Anterior dislocation = femoral artery/nerve at risk; Posterior dislocation = sciatic nerve at risk. Know the direction to know the risk",
    clinicalPearls: [
      "Anterior dislocation: flexed, abducted, externally rotated — femoral vessels/nerve at risk",
      "Posterior dislocation: flexed, adducted, internally rotated — sciatic nerve at risk",
      "Both directions: urgent reduction within 6 hours to prevent avascular necrosis"
    ],
    safetyNote: "Check and document femoral pulse and distal neurovascular status in all hip dislocations — vascular compromise requires emergent reduction",
    distractorRationales: [
      "The sciatic nerve is posterior and at risk in posterior dislocations, not anterior",
      "The obturator nerve is not the primary structure at risk in anterior hip dislocations",
      "The superior gluteal artery is not the primary concern in anterior dislocations"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 39-year-old female presents to the ED after a motor vehicle collision. She has right chest wall tenderness with decreased breath sounds and dullness to percussion on the right. Chest X-ray shows opacification of the right hemithorax with a meniscus sign. A chest tube is inserted and immediately drains 1,800 mL of blood. What should the nurse anticipate?",
    options: [
      "The hemorrhage has been fully evacuated and the patient can be monitored",
      "The volume of initial drainage (greater than 1500 mL) indicates a massive hemothorax requiring emergent surgical thoracotomy",
      "Continue observation with hourly chest tube output monitoring",
      "Clamp the chest tube to prevent further blood loss and reimage the chest"
    ],
    correctAnswer: 1,
    rationaleLong: "A massive hemothorax is defined by initial drainage of greater than 1500 mL of blood upon chest tube insertion OR ongoing output of greater than 200 mL/hour for 2-4 consecutive hours. This patient's initial drainage of 1800 mL clearly exceeds the 1500 mL threshold, indicating a massive hemothorax that requires emergent surgical thoracotomy for hemorrhage control. The source of this volume of bleeding is typically an intercostal artery, internal mammary artery, or a major pulmonary vessel — these sources are unlikely to stop bleeding spontaneously and require direct surgical repair. The emergency nurse must immediately notify the trauma surgeon, prepare the patient for the operating room, ensure blood products are available (activate massive transfusion protocol if not already running), and maintain ongoing resuscitation. Simply monitoring the output is insufficient when the initial drainage exceeds the surgical threshold — the patient has already demonstrated a massive hemorrhage source that is unlikely to resolve without surgical intervention. Clamping the chest tube is absolutely contraindicated in a hemothorax as it prevents drainage of blood from the pleural space, can cause a tension hemothorax (blood accumulation causing mediastinal shift and hemodynamic compromise), and provides no benefit — the blood is coming from a vessel, not from the chest tube. The dullness to percussion and meniscus sign on chest X-ray were classic findings for hemothorax before the chest tube was placed.",
    learningObjective: "Identify the criteria for emergent thoracotomy in massive hemothorax based on chest tube output volumes",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Greater than 1500 mL initial drainage OR greater than 200 mL/hr for 2-4 hours = emergent thoracotomy. These are surgical thresholds, not observation thresholds",
    clinicalPearls: [
      "Massive hemothorax surgical criteria: initial drainage greater than 1500 mL OR greater than 200 mL/hr ongoing",
      "Dullness to percussion = fluid (hemothorax); hyperresonance = air (pneumothorax)",
      "Common massive hemothorax sources: intercostal artery, internal mammary artery, major pulmonary vessel"
    ],
    safetyNote: "NEVER clamp a chest tube in a hemothorax — this can cause tension hemothorax and rapid hemodynamic collapse",
    distractorRationales: [
      "1800 mL initial drainage indicates an active bleeding source requiring surgery, not just monitoring",
      "Observation alone is insufficient when the surgical threshold has been exceeded",
      "Clamping the chest tube is contraindicated and can cause tension hemothorax"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "A 71-year-old male presents to the ED after a ground-level fall. He is on metoprolol 50mg twice daily. His vital signs show HR 72 bpm and BP 88/52 mmHg. He has abdominal tenderness and a positive FAST exam. What should the nurse understand about the heart rate in this clinical context?",
    options: [
      "The heart rate of 72 is reassuringly normal, suggesting the injury is not severe",
      "Beta-blockers blunt the tachycardic response to hemorrhage — this patient may be in significant shock despite a normal heart rate",
      "The heart rate confirms the patient is not in hemorrhagic shock since tachycardia is absent",
      "The metoprolol should be discontinued immediately to allow appropriate tachycardia"
    ],
    correctAnswer: 1,
    rationaleLong: "Beta-adrenergic blockers (such as metoprolol) work by blocking beta-1 receptors on the heart, preventing the catecholamine-driven increase in heart rate that normally occurs during hemorrhagic shock. This pharmacological effect masks one of the earliest and most important clinical indicators of hemorrhage — tachycardia. In a non-medicated patient, a blood pressure of 88/52 would typically be accompanied by a heart rate of 120-140+ bpm as the sympathetic nervous system compensates for decreased preload. However, in this beta-blocked patient, the heart is pharmacologically prevented from mounting this compensatory response. The heart rate of 72 is therefore falsely reassuring — the patient may actually be in significant hemorrhagic shock (the positive FAST exam confirms intra-abdominal hemorrhage) with the severity masked by the medication. This concept is critical for emergency nurses caring for geriatric trauma patients, who frequently take beta-blockers, calcium channel blockers, and other medications that alter the normal physiological response to hemorrhage. The nurse must recognize that vital sign parameters used to assess shock severity (particularly heart rate) are unreliable in patients on cardiac medications. Other indicators of shock perfusion must be relied upon: mental status changes, urine output, base deficit, lactate level, and the trend of blood pressure. The metoprolol should not be abruptly discontinued as this could cause rebound hypertension and tachycardia. The key point is to not be falsely reassured by a normal heart rate in a medicated patient.",
    learningObjective: "Recognize that beta-blockers mask tachycardic response to hemorrhage in geriatric trauma patients, potentially causing underestimation of shock severity",
    blueprintCategory: "Trauma",
    subtopic: "geriatric trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "A normal heart rate in a beta-blocked patient does NOT rule out hemorrhagic shock — the tachycardic response is pharmacologically suppressed",
    clinicalPearls: [
      "Beta-blockers prevent compensatory tachycardia in hemorrhagic shock — heart rate is unreliable",
      "Use alternative shock indicators: mental status, urine output, base deficit, lactate",
      "Geriatric patients commonly take medications that alter normal shock physiology"
    ],
    safetyNote: "Never use heart rate alone to assess hemorrhagic shock severity in patients on beta-blockers or calcium channel blockers — rely on perfusion markers and trending",
    distractorRationales: [
      "A normal heart rate in a beta-blocked patient with hypotension and positive FAST is NOT reassuring",
      "The absence of tachycardia does not confirm the absence of hemorrhagic shock in medicated patients",
      "Abruptly discontinuing beta-blockers can cause rebound tachycardia and hypertension"
    ],
    lessonPath: "/emergency/lessons/geriatric-trauma"
  },
  {
    stem: "A 27-year-old male presents to the ED with a traumatic globe rupture of the right eye after being struck by a baseball. There is obvious distortion of the globe with prolapse of vitreous humor. What is the correct nursing management?",
    options: [
      "Apply a pressure patch to the affected eye to tamponade any bleeding",
      "Irrigate the eye copiously with normal saline to remove any foreign material",
      "Place a rigid shield (Fox shield or cup) over the eye WITHOUT applying pressure and elevate the head of bed to 30 degrees",
      "Attempt to gently push the prolapsed vitreous back into the globe and apply an eye patch"
    ],
    correctAnswer: 2,
    rationaleLong: "Traumatic globe rupture is an ophthalmologic emergency that requires meticulous handling to prevent further extrusion of intraocular contents and preserve any remaining chance of vision. The correct management includes placing a rigid shield (Fox shield or a paper/styrofoam cup) over the affected eye WITHOUT applying any pressure to the globe. The rigid shield protects the eye from further injury and inadvertent pressure while avoiding contact with the damaged globe. The head of the bed should be elevated to 30 degrees to reduce intraocular pressure and prevent further herniation of intraocular contents. Additional nursing interventions include: restricting the patient from vomiting, coughing, or bearing down (Valsalva maneuver), which increases intraocular pressure — administer antiemetics prophylactically. Both eyes should ideally be shielded (the consensual eye movement reflex means that moving the uninjured eye will cause the injured eye to move as well, potentially worsening the injury). Keep the patient NPO for likely operative repair. Administer systemic antibiotics and tetanus prophylaxis. Provide pain management without medications that cause vomiting (morphine may cause nausea). A pressure patch is absolutely contraindicated because any pressure on a ruptured globe forces more intraocular contents out through the defect. Irrigation is contraindicated for the same reason — the fluid pressure would extrude intraocular contents. Never attempt to push prolapsed tissue back into the globe. Urgent ophthalmology consultation is mandatory for surgical repair.",
    learningObjective: "Apply appropriate protective measures for traumatic globe rupture without increasing intraocular pressure",
    blueprintCategory: "Trauma",
    subtopic: "blunt trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER apply pressure to a ruptured globe — a rigid shield protects without compressing. Pressure patches and irrigation are both contraindicated",
    clinicalPearls: [
      "Rigid shield (Fox shield) over the eye without contact or pressure on the globe",
      "Elevate HOB to 30 degrees to reduce intraocular pressure",
      "Prevent Valsalva (coughing, vomiting, straining) — administer prophylactic antiemetics"
    ],
    safetyNote: "Shield both eyes to prevent consensual eye movement, and keep NPO for probable surgical repair",
    distractorRationales: [
      "Pressure patches compress the globe and force intraocular contents through the rupture",
      "Irrigation creates fluid pressure that extrudes intraocular contents through the defect",
      "Attempting to replace prolapsed vitreous causes further damage to intraocular structures"
    ],
    lessonPath: "/emergency/lessons/blunt-trauma"
  },
  {
    stem: "A 35-year-old male presents to the ED after sustaining a deep laceration to the medial aspect of the right wrist from broken glass. On examination, the wound extends to the depth of the tendons. The nurse cannot palpate a radial pulse but the ulnar pulse is strong. Allen's test is positive for intact ulnar collateral circulation. What is the priority nursing assessment?",
    options: [
      "Test grip strength to assess median nerve motor function",
      "Assess sensation in the thumb, index, and middle fingers (median nerve territory), thenar muscle function, and flexor tendon integrity of each digit individually",
      "Apply a tourniquet and prepare for emergent vascular surgery",
      "Obtain a hand X-ray to rule out foreign body"
    ],
    correctAnswer: 1,
    rationaleLong: "A deep laceration to the medial wrist with loss of radial pulse and intact ulnar circulation requires a thorough, systematic assessment of all structures that course through the wrist — particularly the median nerve and flexor tendons. The median nerve enters the hand through the carpal tunnel on the volar (palmar) aspect of the wrist and provides motor function to the thenar muscles (thumb opposition and abduction) and sensation to the thumb, index finger, middle finger, and radial half of the ring finger (palmar surface). Given the wound depth extends to the tendons, multiple structures may be injured including the radial artery (confirmed by absent radial pulse), the flexor carpi radialis tendon, the palmaris longus tendon, the median nerve, and potentially the flexor digitorum superficialis and profundus tendons. Each structure must be individually assessed: test FDS function by holding the adjacent fingers in extension and asking the patient to flex the affected finger at the PIP joint. Test FDP function by stabilizing the middle phalanx and asking for DIP flexion. Test median nerve sensation with two-point discrimination in the thumb, index, and middle fingers. Test thenar motor function by asking the patient to oppose the thumb to the small finger against resistance. The absent radial pulse with intact ulnar circulation (positive Allen's test) means the hand has adequate perfusion through the ulnar artery, but the radial artery laceration will need surgical repair. A tourniquet is not needed if there is no active hemorrhage threatening hemodynamic stability.",
    learningObjective: "Perform systematic assessment of nerve, tendon, and vascular structures in penetrating wrist injuries",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Individual assessment of EACH tendon and nerve is required — testing grip strength alone misses specific tendon and nerve injuries",
    clinicalPearls: [
      "Median nerve: sensation to thumb, index, middle, radial ring finger; motor to thenar muscles",
      "FDS test: hold adjacent fingers extended, flex at PIP; FDP test: stabilize middle phalanx, flex at DIP",
      "Allen's test determines if collateral circulation can maintain hand perfusion with one artery occluded"
    ],
    safetyNote: "Document detailed neurovascular and tendon function assessment before any wound exploration or repair — this establishes the baseline injury inventory",
    distractorRationales: [
      "Grip strength alone does not differentiate which specific tendons or nerves are injured",
      "A tourniquet is not needed when bleeding is controlled and the hand has adequate perfusion through the ulnar artery",
      "While X-ray for foreign body is reasonable, the priority is assessing the functional structures at risk"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 48-year-old male is brought to the ED after being found in the cab of his overturned semi-truck where the engine compartment was pushed into the passenger compartment. He is awake with stable vital signs but has bilateral Waddell's triad findings: bumper-height tibial fracture, truncal injury, and contralateral head injury. What mechanism most commonly produces this injury pattern?",
    options: [
      "Restrained driver in a rollover collision",
      "Pedestrian struck by a vehicle with initial bumper impact",
      "Cyclist struck by a car at an intersection",
      "Passenger in a rear-end collision"
    ],
    correctAnswer: 1,
    rationaleLong: "Waddell's triad is a classic injury pattern most commonly seen in pediatric pedestrians struck by vehicles but can also occur in adults. The triad consists of: (1) bumper-height lower extremity injury (tibial or femoral fracture from the initial bumper impact), (2) truncal injury (chest or abdominal injury as the body folds over the hood), and (3) contralateral head injury (head strikes the ground or vehicle on the opposite side from the bumper impact). The mechanism involves three sequential impacts: First, the vehicle bumper strikes the pedestrian's lower extremities (the height of the bumper determines the level of the fracture — bumper height in passenger cars typically aligns with the tibia/fibula in adults and the femur in children). Second, the body is scooped onto the hood, causing truncal (thoracoabdominal) injury from impact with the hood and windshield. Third, the victim is thrown from the vehicle, landing on the contralateral side and striking the head on the ground. Understanding mechanism-based injury patterns allows the emergency nurse to anticipate injuries that may not be immediately apparent. When a patient presents with findings consistent with Waddell's triad, the nurse should anticipate multi-system injuries and ensure comprehensive imaging includes the affected lower extremity, chest/abdomen CT, and head CT. The contralateral nature of the head injury (opposite side from the lower extremity fracture) is a key distinguishing feature of the pedestrian-struck mechanism.",
    learningObjective: "Recognize Waddell's triad injury pattern and its association with the pedestrian-struck-by-vehicle mechanism",
    blueprintCategory: "Trauma",
    subtopic: "blunt trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Waddell's triad involves three sequential impacts producing injuries at three different body regions — the contralateral head injury is the distinguishing feature",
    clinicalPearls: [
      "Waddell's triad: bumper-height lower extremity fracture + truncal injury + contralateral head injury",
      "Originally described in pediatric pedestrians but applicable to adult pedestrians as well",
      "The three sequential impacts: bumper to legs, body to hood, head to ground"
    ],
    safetyNote: "Anticipate occult injuries in all three body regions when Waddell's triad is identified — comprehensive CT imaging is indicated",
    distractorRationales: [
      "Rollover collisions produce different injury patterns — typically cervical spine and ejection injuries",
      "Cyclist injuries have different biomechanics due to the bicycle frame interaction",
      "Rear-end collisions typically produce whiplash-pattern cervical injuries, not Waddell's triad"
    ],
    lessonPath: "/emergency/lessons/blunt-trauma"
  },
  {
    stem: "A 25-year-old male presents to the ED with a through-and-through gunshot wound to the right thigh. The entrance wound is medial and the exit wound is lateral. He has an active arterial bleed from the entrance wound with blood spurting with each heartbeat. What is the most appropriate tourniquet placement?",
    options: [
      "Place the tourniquet directly over the wound to compress the injured vessel",
      "Place the tourniquet 2-3 inches proximal to the wound (between the wound and the heart)",
      "Place the tourniquet distal to the wound to prevent further blood loss to the extremity",
      "Apply two tourniquets, one above and one below the wound"
    ],
    correctAnswer: 1,
    rationaleLong: "In life-threatening extremity hemorrhage from a penetrating wound with active arterial bleeding, a tourniquet should be placed 2-3 inches (approximately 5-7 cm) proximal to the wound — meaning between the wound and the heart. This placement compresses the arterial supply ABOVE the site of vessel injury, stopping blood flow to the damaged segment and controlling the hemorrhage. The medial thigh location with arterial spurting strongly suggests injury to the femoral artery or one of its major branches (the profunda femoris). This is a life-threatening hemorrhage that can result in exsanguination within minutes if not controlled. Tourniquet placement directly over the wound is less effective because the tourniquet may not adequately compress the artery against bone when placed over soft tissue damage, and the wound area may be too disrupted for effective compression. Placing the tourniquet distal to the wound would not stop arterial flow to the injured vessel — blood would still flow past the injury site before being stopped by the tourniquet, providing no hemorrhage control. Two tourniquets (one proximal, one distal) may be used in specific situations (such as very proximal injuries near the groin where a single tourniquet cannot be placed high enough), but the standard practice is a single tourniquet placed proximal to the wound. The nurse should document the time of tourniquet application, never cover the tourniquet with blankets or dressings that might obscure it, and ensure the tourniquet is tight enough to eliminate the distal pulse. Pain from a properly applied tourniquet is expected and should not prompt loosening.",
    learningObjective: "Apply correct tourniquet placement principles for life-threatening extremity hemorrhage",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Tourniquet placement is PROXIMAL to the wound (between wound and heart) — placing it over or distal to the wound will not control arterial hemorrhage",
    clinicalPearls: [
      "Tourniquet placement: 2-3 inches proximal to the wound, over long bone if possible",
      "Document the time of tourniquet application — ischemia time must be tracked",
      "A properly applied tourniquet should eliminate the distal pulse — verify effectiveness"
    ],
    safetyNote: "Never loosen a tourniquet in the field or ED once applied — this can cause reperfusion injury. Only remove in the OR with surgical control available",
    distractorRationales: [
      "Placing over the wound is less effective due to soft tissue disruption preventing adequate compression",
      "Placing distal to the wound does not stop arterial flow to the injury site",
      "Two tourniquets (above and below) is not standard — one proximal tourniquet is correct placement"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 82-year-old female nursing home resident presents to the ED after a ground-level fall. She has a C2 (odontoid/dens) fracture identified on CT. She is neurologically intact. Why are C2 fractures particularly common in the elderly population?",
    options: [
      "The elderly have weaker neck muscles that cannot support the head during falls",
      "Osteoporotic changes weaken the odontoid process, making it susceptible to fracture from minimal hyperextension force",
      "The elderly experience more violent falls due to loss of protective reflexes",
      "Cervical disc degeneration creates abnormal motion at C1-C2 increasing fracture risk"
    ],
    correctAnswer: 1,
    rationaleLong: "C2 odontoid (dens) fractures are the most common cervical spine fracture in patients over 70 years of age, and the primary reason is osteoporosis. The odontoid process (dens) of C2 is a finger-like projection that extends superiorly from the body of C2 into the ring of C1 (atlas). In elderly patients with osteoporotic bone, the odontoid becomes progressively weakened at its base (the most common fracture site — Anderson and D'Alonzo Type II). The mechanism of injury is typically a ground-level fall with hyperextension of the cervical spine. The force required to fracture an osteoporotic dens is dramatically less than in a young person — the same fall that would cause a soft tissue injury in a 30-year-old may cause an odontoid fracture in an 80-year-old. The fact that this patient is neurologically intact is common with odontoid fractures because the spinal canal at C1-C2 is relatively spacious (the rule of thirds: one-third cord, one-third dens, one-third space). However, the injury is still potentially life-threatening because the fracture creates instability at the C1-C2 junction, and secondary displacement could cause spinal cord compression. Treatment options range from rigid cervical collar immobilization to surgical fixation, depending on the fracture type, displacement, and the patient's operative risk. The emergency nurse must maintain strict cervical immobilization and understand that ground-level falls in the elderly can cause cervical fractures that would not occur in younger patients with the same mechanism.",
    learningObjective: "Understand the pathophysiology of C2 odontoid fractures in the elderly and the role of osteoporosis",
    blueprintCategory: "Trauma",
    subtopic: "geriatric trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "C2 odontoid fractures are the most common cervical fracture in the elderly — ground-level falls can cause them due to osteoporosis",
    clinicalPearls: [
      "C2 odontoid fracture: most common cervical fracture in patients over 70",
      "Rule of thirds at C1-C2: one-third cord, one-third dens, one-third space — explains why patients may be neurologically intact",
      "Type II odontoid fractures (at the base) are most common and have the highest nonunion rate"
    ],
    safetyNote: "Maintain strict cervical immobilization in all elderly patients with head/neck trauma until C-spine is cleared — low-mechanism falls can cause fractures",
    distractorRationales: [
      "While elderly patients may have weaker neck muscles, the primary factor is osteoporotic weakening of the dens itself",
      "Ground-level falls in the elderly are typically low-energy — the issue is bone weakness, not fall violence",
      "Disc degeneration may alter cervical biomechanics but is not the primary factor in odontoid fracture susceptibility"
    ],
    lessonPath: "/emergency/lessons/geriatric-trauma"
  },
  {
    stem: "A patient with a traumatic hemothorax has a chest tube in place. The nurse observes that the drainage has changed from sanguineous to milky white in appearance. What does this finding suggest?",
    options: [
      "Normal dilution of the blood as the hemothorax resolves",
      "Chylothorax from thoracic duct injury requiring dietary modification and possible surgical repair",
      "Empyema developing from infection of the hemothorax",
      "The chest tube is draining intravenous fluid from a misplaced central line"
    ],
    correctAnswer: 1,
    rationaleLong: "Milky white drainage from a chest tube following trauma is the hallmark finding of a chylothorax — accumulation of chyle (lymphatic fluid) in the pleural space from injury to the thoracic duct. The thoracic duct is the largest lymphatic vessel in the body, running from the cisterna chyli in the abdomen through the posterior mediastinum alongside the esophagus and vertebral bodies, eventually draining into the venous system at the junction of the left subclavian and internal jugular veins. Thoracic trauma (especially penetrating trauma to the posterior mediastinum or vertebral fractures) can lacerate the thoracic duct, allowing chyle to leak into the pleural space. Chyle has a characteristic milky white appearance due to its high content of chylomicrons (fat particles absorbed from the intestine). The diagnosis is confirmed by analysis of the pleural fluid: triglyceride level greater than 110 mg/dL is diagnostic. Chylothorax is clinically significant because chyle is rich in lymphocytes, immunoglobulins, and fat-soluble vitamins — prolonged drainage leads to immunocompromise, malnutrition, and lymphocyte depletion. Initial management includes dietary modification (medium-chain triglyceride diet or NPO with total parenteral nutrition), as medium-chain triglycerides are absorbed directly into the portal venous system rather than the lymphatic system, reducing chyle production. If conservative management fails after 2 weeks or if output exceeds 1 liter per day, surgical ligation of the thoracic duct or thoracic duct embolization may be required. Empyema would produce purulent (pus-like) drainage, typically with fever and elevated WBC.",
    learningObjective: "Identify chylothorax by characteristic milky drainage and understand the significance of thoracic duct injury",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Milky white chest tube drainage = chylothorax (thoracic duct injury). Purulent drainage = empyema. Do not confuse the two",
    clinicalPearls: [
      "Chylothorax: milky white drainage with triglycerides greater than 110 mg/dL",
      "Thoracic duct injury leads to lymphocyte depletion and immunocompromise",
      "Medium-chain triglyceride diet reduces chyle production by bypassing lymphatic absorption"
    ],
    safetyNote: "Monitor for immunocompromise and malnutrition in patients with prolonged chylothorax — chyle contains essential immunoglobulins and lymphocytes",
    distractorRationales: [
      "Normal hemothorax resolution produces serosanguineous then serous drainage, not milky white",
      "Empyema produces purulent (pus-like) drainage, typically yellow-green with high WBC",
      "A misplaced central line would drain clear IV fluid, not milky white chyle"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "An ED nurse is receiving a pediatric patient via helicopter transport. The 2-year-old was an unrestrained rear-seat passenger in a high-speed MVC. The flight nurse reports the child has abdominal distension and is lethargic. Which unique anatomical feature makes pediatric abdominal trauma different from adults?",
    options: [
      "Children have a thicker abdominal wall that provides more protection to solid organs",
      "Children have proportionally larger solid organs with less rib cage and omental protection, making them more vulnerable to injury",
      "Children have more abdominal fat providing cushioning from blunt impact",
      "Children's solid organs are identical in proportion and protection to adults"
    ],
    correctAnswer: 1,
    rationaleLong: "Pediatric abdominal anatomy differs significantly from adults in ways that increase vulnerability to traumatic injury. Children have proportionally larger solid organs (liver and spleen) relative to their body size. The liver and spleen extend below the costal margin to a greater degree than in adults, reducing the protective bony cage coverage. The rib cage in children is more flexible and less calcified, providing less rigid protection to underlying organs. The abdominal wall musculature is thinner and less developed, offering less cushioning from blunt force. Additionally, children have less omental fat (the omentum is a fatty apron that covers and protects abdominal organs in adults), which means less natural padding between the abdominal wall and the viscera. These anatomical differences mean that the same force that might cause a minor soft tissue injury in an adult can produce a significant solid organ injury in a child. The combination of abdominal distension and lethargy in this 2-year-old is highly concerning for significant intra-abdominal hemorrhage — the distension suggests blood accumulation, and lethargy indicates hypoperfusion of the brain from hemorrhagic shock. In children, hypotension is a very late finding (occurring after 25-30% blood volume loss), so lethargy may be the earliest sign of significant hemorrhage. The emergency nurse must recognize these pediatric-specific anatomical vulnerabilities and have a lower threshold for imaging and surgical consultation. Pediatric FAST exam sensitivity is lower than in adults, making CT scan the preferred definitive imaging study.",
    learningObjective: "Understand pediatric anatomical differences that increase vulnerability to abdominal trauma",
    blueprintCategory: "Trauma",
    subtopic: "pediatric trauma",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Children's larger solid organs with less rib cage protection make them MORE vulnerable to abdominal trauma — do not be falsely reassured by the mechanism",
    clinicalPearls: [
      "Children have proportionally larger liver and spleen extending below the costal margin",
      "Less rib cage protection, thinner abdominal wall, and less omental fat increase injury vulnerability",
      "Lethargy in a child may be the earliest sign of significant hemorrhage — hypotension is LATE"
    ],
    safetyNote: "Maintain a low threshold for abdominal imaging in pediatric trauma — the same mechanism that causes minor adult injury can cause significant pediatric organ damage",
    distractorRationales: [
      "Children have a THINNER abdominal wall with less muscular protection, not thicker",
      "Children have LESS abdominal and omental fat, not more",
      "Children's organs are proportionally LARGER with LESS protection than adults"
    ],
    lessonPath: "/emergency/lessons/pediatric-trauma"
  },
  {
    stem: "A 33-year-old male presents with a through-and-through stab wound to the left neck in Zone I (below the cricoid cartilage). He has stable vital signs but develops a left-sided pneumothorax on chest X-ray. What vascular structure unique to Zone I makes injuries here particularly dangerous?",
    options: [
      "The external jugular vein which is superficial in Zone I",
      "The subclavian vessels, which are difficult to access surgically and can cause massive hemorrhage or air embolism",
      "The vertebral arteries which are only accessible in Zone I",
      "The thyrocervical trunk which provides blood supply to the thyroid"
    ],
    correctAnswer: 1,
    rationaleLong: "Zone I of the neck extends from the clavicles/sternal notch to the cricoid cartilage. This zone contains critical structures that are uniquely challenging to manage surgically: the subclavian arteries and veins, the proximal common carotid arteries, the vertebral arteries, the thoracic duct (on the left), the lung apices, the esophagus, the trachea, and the thoracic inlet. The subclavian vessels are particularly dangerous for several reasons: they are large-caliber vessels that can hemorrhage rapidly if lacerated, they are anatomically difficult to access because they course behind the clavicle and sternum (requiring sternotomy or thoracotomy for surgical exposure rather than a simple neck incision), and laceration of the subclavian vein can cause air embolism due to the negative intrathoracic pressure during inspiration that can suck air through the vein laceration into the venous circulation. The pneumothorax seen on chest X-ray in this patient is consistent with the Zone I stab wound traversing the lung apex, which extends above the clavicle into the root of the neck. The combination of Zone I penetrating trauma with a pneumothorax raises concern for subclavian vessel injury, lung apex laceration, and potentially thoracic duct injury (on the left side). Zone I injuries typically require angiography and/or surgical exploration with potential median sternotomy for adequate exposure. Zone II (cricoid to angle of mandible) is the most surgically accessible zone. Zone III (above the angle of mandible) is challenging due to the proximity to the skull base.",
    learningObjective: "Identify the critical structures at risk in Zone I neck injuries and understand the surgical challenges they present",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Zone I injuries are the most surgically challenging of all neck zones — subclavian vessels require sternotomy for exposure, not just a neck incision",
    clinicalPearls: [
      "Zone I: clavicle to cricoid — contains subclavian vessels, proximal carotids, lung apices",
      "Left Zone I also contains the thoracic duct — injury causes chylothorax",
      "Subclavian vein laceration can cause air embolism from negative intrathoracic pressure"
    ],
    safetyNote: "Zone I neck injuries require advanced imaging (CTA) before or alongside surgical planning — blind exploration is dangerous due to the complex anatomy",
    distractorRationales: [
      "The external jugular vein is superficial but not the most dangerous structure in Zone I",
      "Vertebral arteries traverse all three zones, not only Zone I",
      "The thyrocervical trunk is not the primary concern in Zone I penetrating trauma"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 41-year-old male is brought to the ED after a lightning strike. He was found pulseless and apneic. Which unique aspect of lightning-related cardiac arrest affects the resuscitation approach?",
    options: [
      "Lightning victims should not receive CPR due to the risk of residual electrical charge harming the rescuer",
      "Lightning causes massive cardiac standstill (asystole) that may respond to prolonged resuscitation because the heart can recover its automaticity if supported long enough",
      "Defibrillation is contraindicated in lightning strike victims",
      "Lightning victims in cardiac arrest have a 0% survival rate and resuscitation should not be attempted"
    ],
    correctAnswer: 1,
    rationaleLong: "Lightning strike cardiac arrest has a unique pathophysiology that creates a more favorable resuscitation profile compared to other types of cardiac arrest. The massive DC current from a lightning strike causes simultaneous depolarization of the entire myocardium, resulting in cardiac standstill (asystole). Unlike asystole from other causes (which typically represents the end-stage of a deteriorating cardiac rhythm with minimal chance of recovery), the heart after lightning strike is often a relatively healthy heart that has been suddenly and completely depolarized. The cardiac pacemaker cells may recover their automaticity if the patient can be supported with CPR long enough for spontaneous rhythm to resume. This is similar to a cardioversion/defibrillation reset of the heart. Additionally, lightning also causes respiratory arrest through paralysis of the medullary respiratory center in the brainstem. Interestingly, the cardiac automaticity may recover before respiratory drive returns, creating a situation where the heart restarts spontaneously but the patient stops breathing again from respiratory arrest, causing secondary hypoxic cardiac arrest. This is why prolonged resuscitation and aggressive ventilatory support are particularly important in lightning victims. There is no residual electrical charge on a lightning victim — they are safe to touch immediately. Defibrillation IS indicated if the patient is in a shockable rhythm (VF/VT). The survival rate for lightning-related cardiac arrest with immediate bystander CPR is approximately 70-80%, making it one of the most survivable forms of cardiac arrest.",
    learningObjective: "Understand the unique pathophysiology of lightning-induced cardiac arrest and the rationale for prolonged resuscitation",
    blueprintCategory: "Trauma",
    subtopic: "burn injuries",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Lightning cardiac arrest has a much better prognosis than other causes — 70-80% survival with immediate CPR. Do NOT give up early",
    clinicalPearls: [
      "Lightning causes cardiac standstill (asystole) in an otherwise healthy heart — automaticity can recover",
      "Respiratory arrest may outlast cardiac arrest — support ventilation aggressively",
      "70-80% survival with immediate CPR — one of the most survivable forms of cardiac arrest"
    ],
    safetyNote: "There is NO residual electrical charge on lightning victims — they are safe to touch immediately. Begin CPR without delay",
    distractorRationales: [
      "There is no residual charge — lightning victims are safe to touch and CPR should begin immediately",
      "Defibrillation is indicated if a shockable rhythm is present",
      "Lightning cardiac arrest has one of the highest survival rates of any cardiac arrest cause with prompt intervention"
    ],
    lessonPath: "/emergency/lessons/burn-injuries"
  },
  {
    stem: "An ED nurse is caring for a 56-year-old male who sustained a traumatic aortic injury in a high-speed MVC. CT angiography shows a contained aortic tear at the isthmus. He is hemodynamically stable with BP 158/92 mmHg and HR 94 bpm. What pharmacological management should the nurse prepare?",
    options: [
      "Vasopressor infusion to maintain systolic BP above 160 mmHg for cerebral perfusion",
      "Anti-impulse therapy with IV esmolol or labetalol to maintain HR less than 80 and SBP 100-120 mmHg to prevent aortic rupture",
      "Heparin infusion for anticoagulation to prevent clot formation at the tear site",
      "IV nitroprusside alone for rapid blood pressure reduction"
    ],
    correctAnswer: 1,
    rationaleLong: "Traumatic aortic injury (TAI) at the isthmus (the junction between the aortic arch and the descending aorta, just distal to the left subclavian artery) is a life-threatening injury that occurs in high-speed deceleration mechanisms. The isthmus is the most common site of traumatic aortic injury because it represents a transition between the relatively mobile aortic arch and the fixed descending aorta. In this patient, the tear is described as contained — meaning the adventitia (outermost layer) is still intact, preventing free rupture. However, the risk of progressing to free rupture is significant, especially with uncontrolled blood pressure and heart rate. The priority pharmacological management is anti-impulse therapy aimed at reducing the force exerted on the aortic wall (dP/dt — the rate of rise of aortic pressure). This is achieved with short-acting IV beta-blockers (esmolol or labetalol) targeting a heart rate less than 80 bpm and systolic blood pressure of 100-120 mmHg. Beta-blockers are preferred because they reduce both the rate of rise of aortic pressure AND the blood pressure, addressing the two main forces that promote rupture. Esmolol is particularly useful because of its ultra-short half-life (approximately 9 minutes), allowing rapid titration. Nitroprusside alone is CONTRAINDICATED as monotherapy because it causes a reflex tachycardia that actually increases the rate of rise of aortic pressure, paradoxically increasing the risk of rupture. If additional blood pressure control is needed beyond beta-blockers, nicardipine or nitroprusside can be added AFTER heart rate control is established. Anticoagulation is contraindicated in an acute aortic tear. The definitive management is either endovascular stent-graft repair (preferred in most centers) or open surgical repair.",
    learningObjective: "Manage anti-impulse therapy for traumatic aortic injury to prevent progression to free rupture",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 5,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Nitroprusside alone is CONTRAINDICATED in aortic injury — it causes reflex tachycardia that increases dP/dt and rupture risk. Always achieve HR control with beta-blockers FIRST",
    clinicalPearls: [
      "Anti-impulse therapy: IV beta-blocker targeting HR less than 80, SBP 100-120 mmHg",
      "Esmolol preferred for ultra-short half-life allowing rapid titration",
      "The isthmus (junction of arch and descending aorta) is the most common site of traumatic aortic injury"
    ],
    safetyNote: "Continuously monitor arterial blood pressure during anti-impulse therapy — overcorrection can cause end-organ ischemia, undercorrection risks aortic rupture",
    distractorRationales: [
      "Maintaining high BP would increase the risk of free aortic rupture — the goal is controlled reduction",
      "Anticoagulation is contraindicated in acute aortic tear — it would worsen hemorrhage if rupture occurs",
      "Nitroprusside alone causes reflex tachycardia that increases aortic wall stress — must be combined with prior beta-blockade"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "A 19-year-old male is brought to the ED after a diving accident in a shallow lake. He reports he cannot move his arms or legs and has no sensation below his shoulders. He is breathing with only diaphragmatic excursions and his respiratory rate is 8. His SpO2 is 88%. At what spinal cord level is the injury most likely?",
    options: [
      "C3-C4 — above the diaphragm innervation, requiring immediate ventilatory support",
      "C5-C6 — below the diaphragm but above the intercostal muscle innervation, causing respiratory insufficiency",
      "T1-T2 — affecting intercostal muscles but preserving upper extremity function",
      "L1-L2 — affecting only lower extremity function"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient's presentation of quadriplegia (no arm or leg movement), sensory loss below the shoulders, and compromised breathing with only diaphragmatic excursions points to a high cervical spinal cord injury. The diaphragm is innervated by the phrenic nerve, which originates from C3-C5 (remembered by the mnemonic: C3, 4, 5 keeps the diaphragm alive). The fact that the patient has diaphragmatic breathing (belly breathing) but no intercostal muscle function indicates the injury is at approximately the C3-C4 level — high enough to be affecting the upper portion of the phrenic nerve origin but not completely ablating diaphragmatic function. The respiratory rate of 8 and SpO2 of 88% indicate respiratory insufficiency because the patient has lost intercostal and abdominal muscle function (which normally contribute 30-40% of the tidal volume and are essential for forced exhalation, coughing, and clearing secretions). The diaphragm alone provides approximately 60-70% of the tidal volume at rest but cannot compensate for the total loss of accessory respiratory muscles, especially under stress or if the diaphragm fatigues. This patient requires immediate ventilatory support — either non-invasive positive pressure ventilation as a bridge or, more likely, endotracheal intubation and mechanical ventilation. If the injury were at C5-C6, the patient would have some shoulder and biceps function (deltoid C5, biceps C5-C6). Injuries at T1 or below preserve upper extremity function, which is clearly absent in this patient.",
    learningObjective: "Correlate respiratory function with spinal cord injury level and recognize the need for ventilatory support in high cervical injuries",
    blueprintCategory: "Trauma",
    subtopic: "spinal cord injury",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "C3-4-5 keeps the diaphragm alive — injuries at or above C3-C5 compromise respiratory function. Even with intact diaphragm, loss of intercostals causes respiratory insufficiency",
    clinicalPearls: [
      "Phrenic nerve: C3-C5 — diaphragm innervation. Injury above C3 = apnea",
      "Intercostal muscles contribute 30-40% of tidal volume — their loss causes respiratory insufficiency",
      "Diaphragmatic breathing only (no intercostal contribution) = high cervical injury"
    ],
    safetyNote: "High cervical cord injuries can cause progressive respiratory failure as the diaphragm fatigues — prepare for intubation even if initial respirations are present",
    distractorRationales: [
      "C5-C6 injury would preserve some shoulder and biceps function — this patient has no arm movement",
      "T1-T2 injury would preserve full upper extremity function — this patient has quadriplegia",
      "L1-L2 injury would only affect the lower extremities — this patient has no arm or leg function"
    ],
    lessonPath: "/emergency/lessons/spinal-cord-injury"
  },
  {
    stem: "A 37-year-old male presents to the ED with second-degree burns to both hands circumferentially after grabbing a hot pipe. He has no other injuries. Despite the relatively small TBSA (approximately 5%), why do these burns warrant hospital admission?",
    options: [
      "All second-degree burns require inpatient management regardless of location",
      "Circumferential burns to the hands risk compartment syndrome, functional impairment, and require specialized burn center management due to the critical importance of hand function",
      "5% TBSA always requires Parkland formula resuscitation requiring ICU monitoring",
      "Second-degree hand burns always progress to third-degree requiring skin grafting"
    ],
    correctAnswer: 1,
    rationaleLong: "Burns to the hands, feet, face, genitalia, perineum, and major joints are classified as special-area burns that require admission to a specialized burn center regardless of the TBSA percentage. Hand burns warrant particular attention for several critical reasons. First, circumferential burns create the risk of compartment syndrome as the burned tissue swells within the confined fascial compartments of the hand. Progressive edema beneath the inelastic eschar can compress blood vessels, nerves, and tendons, leading to ischemia and permanent functional loss if escharotomy is not performed. Second, the hands are functionally critical — even minor contractures or loss of range of motion from improper burn management can result in significant disability. The hand has 27 bones, numerous tendons, and a complex web of nerves that require specialized rehabilitation. Third, second-degree (partial thickness) burns to the hands require meticulous wound care, splinting in the position of function (metacarpophalangeal joints flexed 70-90 degrees, interphalangeal joints extended, thumb abducted), and early active range of motion exercises supervised by occupational therapists. Outpatient management does not provide the continuous monitoring, frequent dressing changes, and therapy needed for optimal outcomes. The American Burn Association criteria for burn center referral include: partial-thickness burns greater than 10% TBSA, burns involving the face, hands, feet, genitalia, perineum, or major joints, full-thickness burns, electrical burns, chemical burns, inhalation injury, and burns in patients with significant comorbidities.",
    learningObjective: "Identify special-area burns requiring burn center referral regardless of TBSA percentage",
    blueprintCategory: "Trauma",
    subtopic: "burn injuries",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "TBSA percentage alone does not determine the need for admission — special-area burns (hands, face, feet, genitalia, joints) require burn center referral regardless of size",
    clinicalPearls: [
      "ABA burn center referral criteria: hands, face, feet, genitalia, perineum, major joints regardless of TBSA",
      "Circumferential hand burns risk compartment syndrome requiring escharotomy monitoring",
      "Position of function for hand splinting: MCPs flexed 70-90 degrees, IPs extended, thumb abducted"
    ],
    safetyNote: "Monitor circumferential hand burns for compartment syndrome — progressive edema, increasing pain, and loss of capillary refill in digits require emergent escharotomy",
    distractorRationales: [
      "Not all second-degree burns require admission — small burns in non-critical areas can be managed outpatient",
      "5% TBSA does not typically require Parkland formula resuscitation — the threshold is generally 15-20% for adults",
      "Second-degree burns do not always progress to third-degree — proper wound care can promote healing"
    ],
    lessonPath: "/emergency/lessons/burn-injuries"
  },
  {
    stem: "A 29-year-old male restrained driver presents to the ED after a head-on collision. He has a bruise on his anterior chest from the steering wheel. He complains of chest pain and his ECG shows ST elevation in leads V1-V3 with frequent PVCs. Troponin I is elevated at 2.4 ng/mL. What is the most likely diagnosis?",
    options: [
      "Acute myocardial infarction from coronary artery disease unrelated to the trauma",
      "Myocardial contusion (blunt cardiac injury) from direct sternal impact",
      "Pericarditis from the traumatic impact",
      "Costochondritis causing ECG artifact"
    ],
    correctAnswer: 1,
    rationaleLong: "The clinical presentation is classic for myocardial contusion (blunt cardiac injury): direct sternal/anterior chest impact (steering wheel), chest pain, ECG abnormalities (ST elevation, PVCs), and elevated cardiac biomarkers (troponin I). Myocardial contusion occurs when the heart is compressed between the sternum and the thoracic spine during blunt thoracic trauma. The right ventricle is most commonly affected because it is the most anterior cardiac chamber and lies directly behind the sternum. The injury causes myocardial cell damage with release of troponin, similar to a myocardial infarction but from a mechanical rather than ischemic mechanism. ECG findings can include ST changes, T-wave abnormalities, new bundle branch blocks (especially right BBB given the RV location), and dysrhythmias including PVCs, atrial fibrillation, and in severe cases, ventricular tachycardia or fibrillation. The presence of frequent PVCs is concerning because myocardial contusion can cause life-threatening dysrhythmias, particularly in the first 24-48 hours after injury. The emergency nurse must ensure continuous cardiac monitoring for at least 24 hours, have antidysrhythmic medications readily available, obtain serial troponin levels to track the trajectory, and perform an echocardiogram to assess for wall motion abnormalities, valvular dysfunction, or pericardial effusion. While an AMI in a 29-year-old without risk factors is statistically unlikely, it cannot be completely excluded — cardiology consultation may be warranted. Pericarditis typically develops days after trauma, and costochondritis does not cause ECG changes or troponin elevation.",
    learningObjective: "Recognize myocardial contusion from mechanism, ECG findings, and cardiac biomarker elevation in blunt chest trauma",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Myocardial contusion can mimic acute MI with ST changes and elevated troponin — the mechanism of injury (sternal impact) differentiates the two",
    clinicalPearls: [
      "Right ventricle is most commonly contused — most anterior chamber behind the sternum",
      "Dysrhythmias from contusion are most dangerous in the first 24-48 hours — continuous monitoring is essential",
      "Right bundle branch block is the most common conduction abnormality in myocardial contusion"
    ],
    safetyNote: "Continuous cardiac monitoring for minimum 24 hours — myocardial contusion can cause fatal dysrhythmias without warning",
    distractorRationales: [
      "AMI in a 29-year-old without risk factors is unlikely — the mechanism points to traumatic cause",
      "Pericarditis develops days after trauma with diffuse ST elevation and PR depression, not the acute presentation described",
      "Costochondritis is a musculoskeletal condition that does not cause ECG changes or troponin elevation"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  }
];
