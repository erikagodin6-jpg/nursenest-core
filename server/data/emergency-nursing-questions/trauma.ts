import { EmergencyNursingQuestion } from "./types";

export const traumaQuestions: EmergencyNursingQuestion[] = [
  {
    stem: "A 32-year-old male arrives to the ED after a high-speed motor vehicle collision. He is unresponsive with a GCS of 6, blood pressure 80/50 mmHg, heart rate 130 bpm, and respiratory rate 8. His pupils are unequal with the right pupil fixed and dilated at 6mm. The trauma team is assembling. As the primary nurse, what is your immediate priority intervention?",
    options: [
      "Prepare for rapid sequence intubation and secure the airway",
      "Establish two large-bore IV lines and initiate crystalloid resuscitation",
      "Administer mannitol 1g/kg IV for suspected increased intracranial pressure",
      "Prepare for emergent CT scan of the head"
    ],
    correctAnswer: 0,
    rationaleLong: "In the primary survey of a trauma patient, airway management with cervical spine protection takes absolute priority following the ABCDE approach. This patient presents with a GCS of 6, which is well below the threshold of 8 that mandates definitive airway management. The respiratory rate of 8 indicates inadequate ventilation that will rapidly lead to hypoxia and hypercarbia, both of which significantly worsen traumatic brain injury outcomes. While the unequal pupils suggest an expanding intracranial mass lesion (likely an epidural or subdural hematoma), securing the airway is the prerequisite for all subsequent interventions. Without adequate oxygenation and ventilation, no other intervention will be effective. The hypotension and tachycardia indicate hemorrhagic shock requiring fluid resuscitation, but this is addressed after airway and breathing. Mannitol may be considered later but is contraindicated in hypotensive patients as it can worsen hypovolemia. CT scanning requires a stable airway first. The emergency nurse must recognize that rapid sequence intubation with inline cervical stabilization is the critical first step in managing this polytrauma patient.",
    learningObjective: "Prioritize airway management in the trauma primary survey using the ABCDE framework",
    blueprintCategory: "Trauma",
    subtopic: "blunt trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The unilateral fixed dilated pupil may tempt the nurse to focus on neurological interventions first, but airway always precedes neurological management in the primary survey",
    clinicalPearls: [
      "GCS of 8 or less mandates definitive airway management",
      "Hypoxia and hypercarbia are the most preventable causes of secondary brain injury",
      "Mannitol is contraindicated in hypotensive patients due to osmotic diuresis worsening hypovolemia"
    ],
    safetyNote: "Never bypass airway management to address other injuries — a secured airway is the foundation for all subsequent trauma care",
    distractorRationales: [
      "IV access and fluid resuscitation address circulation (C) which comes after airway (A) and breathing (B)",
      "Mannitol is contraindicated in hypotensive patients and neurological interventions follow airway management",
      "CT scanning requires a secured airway and hemodynamic stability first"
    ],
    lessonPath: "/emergency/lessons/blunt-trauma"
  },
  {
    stem: "A 45-year-old construction worker presents to the ED after falling 25 feet from scaffolding. He is awake and alert, complaining of severe bilateral heel pain and mid-thoracic back pain. Vital signs are stable. The ED nurse should anticipate which associated injury pattern?",
    options: [
      "Cervical spine fracture with cord compression",
      "Thoracolumbar spine compression fracture",
      "Bilateral tibial plateau fractures",
      "Pelvic ring disruption"
    ],
    correctAnswer: 1,
    rationaleLong: "Falls from height where the patient lands on their feet produce a classic injury pattern known as the axial loading mechanism. The force travels from the calcaneal bones (heels) through the lower extremities and is transmitted superiorly along the spinal column. The thoracolumbar junction (T12-L2) is the most common site for compression fractures from this mechanism because it represents a transition zone between the relatively rigid thoracic spine (stabilized by the rib cage) and the more mobile lumbar spine. The bilateral heel pain strongly suggests calcaneal fractures, which are associated with thoracolumbar compression fractures in approximately 10% of cases. This is sometimes called Don Juan's fracture pattern. The mid-thoracic back pain localization further supports this association. Emergency nurses must recognize mechanism-based injury patterns to ensure comprehensive assessment and appropriate imaging. Cervical spine fractures are more commonly associated with axial loading from diving or head-first impacts. Tibial plateau fractures are associated with bumper-height impacts. Pelvic ring disruptions are associated with lateral compression or AP compression mechanisms such as motorcycle collisions or crush injuries.",
    learningObjective: "Recognize mechanism-based injury patterns in fall victims and anticipate associated injuries",
    blueprintCategory: "Trauma",
    subtopic: "blunt trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Students may not recognize the classic association between calcaneal fractures and thoracolumbar compression fractures from axial loading in falls from height",
    clinicalPearls: [
      "Calcaneal fractures from falls are associated with thoracolumbar compression fractures in approximately 10% of cases",
      "The T12-L2 junction is most vulnerable to compression fractures from axial loading",
      "Always assess the spine in any patient with calcaneal fractures from a fall"
    ],
    safetyNote: "Maintain spinal motion restriction until thoracolumbar injury is ruled out in any patient with calcaneal fractures from a fall",
    distractorRationales: [
      "Cervical spine fractures are more common with head-first impact mechanisms such as diving injuries",
      "Tibial plateau fractures are associated with bumper-height lateral impact mechanisms, not axial loading from falls",
      "Pelvic ring disruptions result from lateral or anteroposterior compression mechanisms, not vertical axial loading"
    ],
    lessonPath: "/emergency/lessons/blunt-trauma"
  },
  {
    stem: "A 19-year-old male presents to the ED with a single stab wound to the left chest at the 5th intercostal space, anterior axillary line. He is tachycardic at 124 bpm with BP 88/62 mmHg. On assessment, you note distended neck veins, muffled heart sounds, and pulsus paradoxus of 18 mmHg. What is the priority nursing intervention?",
    options: [
      "Prepare for immediate needle decompression of the left chest",
      "Prepare for emergent pericardiocentesis and notify the trauma surgeon",
      "Apply an occlusive dressing taped on three sides to the wound",
      "Establish bilateral large-bore IV access and begin massive transfusion protocol"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with Beck's triad — jugular venous distension (JVD), muffled heart sounds, and hypotension — which is pathognomonic for cardiac tamponade. The pulsus paradoxus greater than 10 mmHg further confirms the diagnosis. The stab wound location at the 5th intercostal space in the anterior axillary line is within the cardiac box and can easily penetrate the pericardium. Blood accumulates in the pericardial sac, restricting ventricular filling during diastole, which progressively decreases stroke volume and cardiac output. The priority intervention is emergent pericardiocentesis to evacuate the accumulated blood and restore cardiac filling. The nurse must prepare for this procedure by gathering an 18-gauge spinal needle, 60mL syringe, and cardiac monitoring equipment while simultaneously notifying the trauma surgeon. Needle decompression would be appropriate for tension pneumothorax, which presents with absent breath sounds, tracheal deviation, and hyperresonance — features not described here. An occlusive dressing is for open pneumothorax (sucking chest wound). While IV access is important and should be established simultaneously, it alone will not resolve the mechanical obstruction to cardiac filling caused by tamponade. As little as 150-200 mL of blood in the pericardial sac can cause hemodynamically significant tamponade.",
    learningObjective: "Identify Beck's triad and prepare for emergent pericardiocentesis in penetrating cardiac trauma",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Students often confuse cardiac tamponade with tension pneumothorax since both cause JVD and hypotension — the key differentiator is muffled heart sounds versus absent breath sounds",
    clinicalPearls: [
      "Beck's triad: JVD, muffled heart sounds, hypotension — pathognomonic for cardiac tamponade",
      "Pulsus paradoxus greater than 10 mmHg supports tamponade diagnosis",
      "As little as 150-200 mL of blood in the pericardial sac can cause hemodynamic compromise"
    ],
    safetyNote: "Cardiac tamponade from penetrating trauma requires emergent surgical intervention — pericardiocentesis is a temporizing measure while preparing for the OR",
    distractorRationales: [
      "Needle decompression treats tension pneumothorax, which presents with absent breath sounds and tracheal deviation, not muffled heart sounds",
      "Occlusive dressings are for open pneumothorax (sucking chest wounds), not cardiac tamponade",
      "IV access and fluids alone cannot overcome the mechanical obstruction to cardiac filling in tamponade"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 28-year-old female presents to the ED after a house fire. She has singed nasal hairs, carbonaceous sputum, and a hoarse voice. Her burns are circumferential to both upper extremities and the anterior trunk, estimated at 36% TBSA. Current SpO2 is 97% on room air. Which assessment finding should prompt the nurse to advocate for immediate intubation?",
    options: [
      "The SpO2 reading of 97% which may be falsely elevated due to carboxyhemoglobin",
      "The circumferential upper extremity burns requiring escharotomy",
      "The 36% TBSA burn requiring aggressive fluid resuscitation",
      "The patient's young age and female sex as risk factors for airway edema"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with multiple signs of inhalation injury: singed nasal hairs, carbonaceous sputum, and hoarseness. The SpO2 of 97% is critically misleading because standard pulse oximetry cannot differentiate between oxyhemoglobin and carboxyhemoglobin. Carbon monoxide binds to hemoglobin with approximately 200-250 times greater affinity than oxygen, forming carboxyhemoglobin. The pulse oximeter reads carboxyhemoglobin as oxyhemoglobin, giving a falsely reassuring reading. A patient with 30% carboxyhemoglobin levels could still show an SpO2 of 97-99% on standard pulse oximetry while being profoundly hypoxic at the cellular level. The combination of inhalation injury signs (singed nasal hairs, carbonaceous sputum, hoarseness) with a house fire exposure strongly suggests significant carbon monoxide exposure and thermal airway injury. The hoarseness indicates developing upper airway edema that will progressively worsen over the first 24-48 hours, potentially resulting in complete airway obstruction. Early intubation before the edema peaks is a critical safety intervention. The nurse must advocate for immediate intubation because waiting until the patient develops stridor or respiratory distress may result in a cannot-intubate, cannot-ventilate scenario. Circumferential burns and fluid resuscitation are important but secondary to airway management.",
    learningObjective: "Recognize the limitations of pulse oximetry in carbon monoxide exposure and advocate for early airway management in inhalation injury",
    blueprintCategory: "Trauma",
    subtopic: "burn injuries",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "A normal SpO2 in a burn patient does not rule out significant carbon monoxide poisoning — standard pulse oximetry cannot detect carboxyhemoglobin",
    clinicalPearls: [
      "Standard pulse oximetry cannot differentiate oxyhemoglobin from carboxyhemoglobin",
      "CO binds hemoglobin with 200-250 times greater affinity than oxygen",
      "Singed nasal hairs, carbonaceous sputum, and hoarseness are classic signs of inhalation injury requiring early intubation"
    ],
    safetyNote: "Never rely on standard pulse oximetry to assess oxygenation in suspected carbon monoxide exposure — obtain a co-oximetry level",
    distractorRationales: [
      "While escharotomy may be needed for circumferential burns, this is a circulation concern that follows airway management",
      "Fluid resuscitation is important but is a secondary priority to securing the airway in inhalation injury",
      "Age and sex are not the primary indications for intubation — the signs of inhalation injury are"
    ],
    lessonPath: "/emergency/lessons/burn-injuries"
  },
  {
    stem: "A 55-year-old male is brought to the ED after being pinned under a collapsed concrete wall for approximately 4 hours during a building demolition. His right lower extremity was crushed. He is conscious, alert, and conversational with vital signs: BP 142/88 mmHg, HR 92 bpm, RR 20. The rescue team is preparing to lift the wall. The ED nurse should anticipate which life-threatening complication upon extrication?",
    options: [
      "Hemorrhagic shock from acute blood loss at the crush site",
      "Reperfusion syndrome with hyperkalemia and metabolic acidosis",
      "Fat embolism syndrome from long bone fractures",
      "Tension pneumothorax from rib fractures sustained during entrapment"
    ],
    correctAnswer: 1,
    rationaleLong: "Crush syndrome (traumatic rhabdomyolysis) occurs when a large muscle mass is compressed for an extended period (generally greater than 1 hour) and then released. During compression, the ischemic muscle cells undergo necrosis and accumulate toxic metabolites including potassium, myoglobin, phosphorus, and lactic acid. While the extremity remains compressed, these toxins are sequestered in the affected limb. Upon release of the compression (extrication), these toxins are suddenly released into the systemic circulation, causing reperfusion syndrome. The most immediately life-threatening consequence is hyperkalemia, which can cause fatal cardiac dysrhythmias including ventricular fibrillation within minutes of extrication. Metabolic acidosis from lactic acid release compounds the cardiac risk. Myoglobinuria can cause acute renal failure. The emergency nurse must anticipate this complication and prepare accordingly before extrication occurs. Preparations include having cardiac monitoring in place, calcium gluconate or calcium chloride drawn up for hyperkalemia treatment, sodium bicarbonate for acidosis, aggressive IV crystalloid infusion already running (1-1.5 L/hr), and having a defibrillator immediately available. The relatively stable vital signs prior to extrication are typical and should not provide false reassurance. Fat embolism typically presents 24-72 hours after long bone fractures, not immediately during extrication.",
    learningObjective: "Anticipate and prepare for reperfusion syndrome in crush injury patients prior to extrication",
    blueprintCategory: "Trauma",
    subtopic: "crush injuries",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Stable vital signs before extrication do not predict the patient's response after release — reperfusion syndrome can cause cardiac arrest within minutes",
    clinicalPearls: [
      "Crush syndrome risk increases after 1+ hours of compression of large muscle mass",
      "Hyperkalemia from crush syndrome can cause fatal dysrhythmias within minutes of extrication",
      "Pre-extrication interventions include aggressive IV fluids (1-1.5 L/hr), calcium gluconate, sodium bicarbonate, and cardiac monitoring"
    ],
    safetyNote: "Always have calcium gluconate, sodium bicarbonate, and defibrillation equipment immediately available before extrication of crush injury patients",
    distractorRationales: [
      "Hemorrhagic shock is possible but the primary life threat upon extrication is reperfusion syndrome with hyperkalemia",
      "Fat embolism syndrome typically presents 24-72 hours after injury, not immediately during extrication",
      "Tension pneumothorax is unrelated to the mechanism of crush injury to the lower extremity"
    ],
    lessonPath: "/emergency/lessons/crush-injuries"
  },
  {
    stem: "A 72-year-old male on warfarin presents to the ED after a ground-level fall, striking his head on the tile floor. His initial GCS is 15 and neurological exam is normal. He denies loss of consciousness. What is the most important nursing consideration for this patient?",
    options: [
      "This is a low-mechanism injury and the patient can be safely discharged after observation",
      "The patient requires emergent CT head and serial neurological assessments due to increased risk of delayed intracranial hemorrhage",
      "A normal neurological exam rules out traumatic brain injury in this population",
      "The fall was ground-level so spinal imaging is not indicated"
    ],
    correctAnswer: 1,
    rationaleLong: "Elderly patients on anticoagulant therapy (warfarin, DOACs) represent a high-risk population for traumatic intracranial hemorrhage, even with seemingly minor mechanisms of injury. Ground-level falls are the leading cause of traumatic brain injury in patients over 65 years of age. Warfarin impairs the coagulation cascade by inhibiting vitamin K-dependent clotting factors (II, VII, IX, X), which means that even small intracranial vessels that are disrupted during head trauma will continue to bleed without the normal hemostatic response. The most concerning aspect is the potential for delayed hemorrhage expansion. A patient may present with a completely normal neurological examination initially, only to develop a significant subdural or epidural hematoma hours later as the bleeding continues unchecked. Studies have shown that up to 6% of anticoagulated patients with minor head trauma and initially normal CT scans can develop delayed intracranial hemorrhage on repeat imaging. Therefore, the standard of care includes emergent CT head imaging regardless of the initial neurological exam, INR measurement, reversal of anticoagulation if the INR is supratherapeutic or if hemorrhage is identified, serial neurological assessments every 1-2 hours for a minimum of 24 hours, and a low threshold for repeat CT imaging if any change in neurological status occurs. Age-related cerebral atrophy also increases the subdural space, allowing for larger hemorrhage collections before symptoms appear.",
    learningObjective: "Recognize the high-risk nature of head trauma in anticoagulated elderly patients and implement appropriate monitoring protocols",
    blueprintCategory: "Trauma",
    subtopic: "traumatic brain injury",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "A normal initial neurological exam does NOT rule out intracranial hemorrhage in anticoagulated patients — delayed hemorrhage expansion is a well-documented phenomenon",
    clinicalPearls: [
      "Ground-level falls are the leading cause of TBI in patients over 65",
      "Up to 6% of anticoagulated patients with minor head trauma develop delayed intracranial hemorrhage",
      "Age-related cerebral atrophy increases subdural space, allowing larger hemorrhage collections before symptoms appear"
    ],
    safetyNote: "All anticoagulated patients with head trauma require emergent CT imaging and serial neurological assessments regardless of initial presentation",
    distractorRationales: [
      "Low-mechanism injury does not equal low-risk in anticoagulated elderly patients",
      "A normal neurological exam cannot rule out evolving intracranial hemorrhage in anticoagulated patients",
      "Cervical spine imaging should be considered given age and fall mechanism"
    ],
    lessonPath: "/emergency/lessons/traumatic-brain-injury"
  },
  {
    stem: "A 22-year-old male presents to the ED after diving into shallow water and striking his head on the bottom. He reports bilateral upper extremity weakness and numbness with preserved lower extremity function. This neurological pattern is most consistent with which spinal cord injury syndrome?",
    options: [
      "Anterior cord syndrome",
      "Central cord syndrome",
      "Brown-Sequard syndrome",
      "Cauda equina syndrome"
    ],
    correctAnswer: 1,
    rationaleLong: "Central cord syndrome is the most common incomplete spinal cord injury and characteristically presents with greater motor deficit in the upper extremities than the lower extremities. This pattern occurs because the corticospinal tracts are organized somatotopically within the spinal cord — the nerve fibers serving the upper extremities are located centrally, while those serving the lower extremities are located peripherally. When a hyperextension injury causes central cord hemorrhage and edema (which is the typical mechanism in diving injuries), the central fibers are preferentially affected while the peripheral fibers are relatively preserved. The patient in this scenario demonstrates the classic presentation: bilateral upper extremity weakness and sensory changes with preserved lower extremity function. The mechanism of diving into shallow water causing hyperextension is a textbook scenario for this injury. Anterior cord syndrome presents with loss of motor function and pain/temperature sensation below the level of injury with preservation of proprioception and vibration (posterior column function). Brown-Sequard syndrome results from hemisection of the cord and presents with ipsilateral motor loss and proprioception loss with contralateral pain and temperature loss. Cauda equina syndrome affects nerve roots below the conus medullaris and presents with lower extremity weakness, saddle anesthesia, and bowel/bladder dysfunction. The emergency nurse must recognize these patterns to facilitate appropriate diagnostic workup and neurosurgical consultation.",
    learningObjective: "Differentiate between incomplete spinal cord injury syndromes based on clinical presentation",
    blueprintCategory: "Trauma",
    subtopic: "spinal cord injury",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Students may confuse central cord syndrome with anterior cord syndrome — remember that central cord preferentially affects upper extremities due to somatotopic organization",
    clinicalPearls: [
      "Central cord syndrome: upper extremity deficit greater than lower extremity deficit",
      "Most common incomplete spinal cord injury, often from hyperextension mechanism",
      "Corticospinal tract fibers are somatotopically organized: upper extremity fibers centrally, lower extremity fibers peripherally"
    ],
    safetyNote: "Maintain strict spinal immobilization and avoid hyperextension during airway management in suspected spinal cord injury",
    distractorRationales: [
      "Anterior cord syndrome preserves proprioception/vibration but loses motor function and pain/temperature below the level of injury bilaterally",
      "Brown-Sequard syndrome presents with ipsilateral motor and proprioception loss with contralateral pain/temperature loss (cord hemisection)",
      "Cauda equina syndrome affects lower extremities with saddle anesthesia and bowel/bladder dysfunction"
    ],
    lessonPath: "/emergency/lessons/spinal-cord-injury"
  },
  {
    stem: "A 40-year-old male is brought to the ED after a motorcycle collision. He has a flail chest segment involving the left anterolateral chest wall with paradoxical movement. His SpO2 is 86% on 15L non-rebreather mask. The nurse should understand that the primary cause of respiratory failure in flail chest is:",
    options: [
      "The paradoxical chest wall movement causing ineffective ventilation",
      "The underlying pulmonary contusion causing ventilation-perfusion mismatch",
      "Pain from the rib fractures limiting chest wall excursion",
      "Associated pneumothorax that always accompanies flail chest"
    ],
    correctAnswer: 1,
    rationaleLong: "While the paradoxical chest wall movement in flail chest is the most visually dramatic finding, the primary cause of respiratory failure is the underlying pulmonary contusion, not the mechanical flail segment itself. Pulmonary contusion occurs when blunt force causes hemorrhage and edema within the lung parenchyma. This leads to ventilation-perfusion (V/Q) mismatch because the affected alveoli fill with blood and edema fluid, preventing gas exchange even though the pulmonary vasculature continues to perfuse these areas. The result is intrapulmonary shunting — blood passes through the pulmonary capillary bed without being oxygenated. The paradoxical movement of the flail segment does contribute to ineffective ventilation but is not the predominant pathophysiology. Studies have demonstrated that surgically stabilizing the flail segment alone does not resolve the hypoxemia because the underlying contusion persists. Pain from rib fractures can limit chest excursion and worsen hypoventilation but is a contributing factor rather than the primary cause. Associated pneumothorax may occur but does not always accompany flail chest. The emergency nurse must understand this distinction because it guides management — the focus should be on treating the contusion through adequate oxygenation, judicious fluid resuscitation (avoiding fluid overload which worsens contusion), appropriate pain management, and potentially positive pressure ventilation to recruit atelectatic alveoli and improve V/Q matching. The SpO2 of 86% despite high-flow oxygen indicates significant shunting consistent with pulmonary contusion.",
    learningObjective: "Identify the underlying pulmonary contusion as the primary pathophysiology in flail chest respiratory failure",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Students focus on the visible paradoxical chest wall movement but the underlying pulmonary contusion is the primary driver of respiratory failure",
    clinicalPearls: [
      "Pulmonary contusion, not the flail segment, is the primary cause of respiratory failure in flail chest",
      "Pulmonary contusion causes intrapulmonary shunting through V/Q mismatch",
      "Avoid aggressive fluid resuscitation in pulmonary contusion as it worsens alveolar edema"
    ],
    safetyNote: "Monitor for progressive hypoxemia in flail chest — pulmonary contusion typically worsens over the first 24-48 hours",
    distractorRationales: [
      "Paradoxical movement contributes to respiratory compromise but is not the primary pathophysiology",
      "Pain is a contributing factor that can be managed with regional anesthesia but is not the primary cause",
      "Pneumothorax may accompany flail chest but does not always occur and is a separate pathology"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "A 35-year-old female presents to the ED after a restrained MVC with a seatbelt sign across her lower abdomen. She complains of increasing abdominal pain. Initial vital signs show HR 98 bpm, BP 110/72 mmHg. A FAST exam reveals free fluid in Morison's pouch. The nurse should anticipate which organ is most likely injured?",
    options: [
      "Spleen — the most commonly injured organ in blunt abdominal trauma",
      "Liver — located in the right upper quadrant where Morison's pouch is found",
      "Kidney — commonly injured in seatbelt mechanism injuries",
      "Bladder — vulnerable to rupture from a full bladder with seatbelt compression"
    ],
    correctAnswer: 1,
    rationaleLong: "Morison's pouch (the hepatorenal recess) is the most dependent space in the peritoneal cavity when the patient is supine, making it the first location where free fluid accumulates and is detected on FAST exam. Free fluid in Morison's pouch indicates intraperitoneal hemorrhage, and its location in the right upper quadrant between the liver and right kidney makes liver injury the most likely source. The seatbelt sign (ecchymosis pattern from the seatbelt across the lower abdomen) is associated with hollow viscus injury (small bowel), mesenteric tears, and lumbar spine fractures (Chance fractures). However, in blunt abdominal trauma overall, the liver is the most commonly injured organ when there is free fluid detected in Morison's pouch specifically. While the spleen is the most commonly injured solid organ in blunt abdominal trauma overall, free fluid in Morison's pouch specifically suggests right-sided pathology. Splenic injury typically produces free fluid in the splenorenal recess and left paracolic gutter first. The kidney can be injured but is retroperitoneal, so renal hemorrhage may not produce free intraperitoneal fluid unless the renal capsule is disrupted. Bladder injury, while possible with a seatbelt mechanism, would more commonly present with hematuria and pelvic free fluid. The emergency nurse must correlate FAST findings with mechanism of injury and physical examination to guide surgical decision-making.",
    learningObjective: "Correlate FAST exam findings with likely organ injuries in blunt abdominal trauma",
    blueprintCategory: "Trauma",
    subtopic: "abdominal trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "While the spleen is the most commonly injured organ overall in blunt abdominal trauma, free fluid in Morison's pouch specifically suggests right-sided (liver) pathology",
    clinicalPearls: [
      "Morison's pouch is the most dependent peritoneal space in supine patients — free fluid collects here first",
      "Seatbelt sign is associated with hollow viscus injury, mesenteric tears, and Chance fractures",
      "A positive FAST with hemodynamic instability may indicate need for emergent laparotomy"
    ],
    safetyNote: "A negative FAST does not rule out intra-abdominal injury — sensitivity is only 73-88% and serial exams or CT may be needed",
    distractorRationales: [
      "Spleen is the most commonly injured organ overall but free fluid in Morison's pouch specifically suggests right-sided liver pathology",
      "Kidneys are retroperitoneal and renal hemorrhage may not produce free intraperitoneal fluid",
      "Bladder injury would present with pelvic free fluid and hematuria rather than fluid in Morison's pouch"
    ],
    lessonPath: "/emergency/lessons/abdominal-trauma"
  },
  {
    stem: "A 68-year-old female with osteoporosis presents to the ED after a fall from standing. She has severe left hip pain with the left lower extremity shortened and externally rotated. The nurse notes the patient is on aspirin 81mg and clopidogrel 75mg daily. Which nursing priority is most important in the first 30 minutes?",
    options: [
      "Obtaining orthopedic consultation for immediate surgical repair",
      "Performing neurovascular assessment of the affected extremity and providing adequate pain management",
      "Initiating platelet transfusion to reverse the antiplatelet effects",
      "Applying Buck's traction to the affected extremity"
    ],
    correctAnswer: 1,
    rationaleLong: "The clinical presentation of a shortened, externally rotated lower extremity after a fall is classic for a femoral neck or intertrochanteric hip fracture. In the initial 30 minutes of ED management, the nursing priorities are performing a thorough neurovascular assessment of the affected extremity and providing adequate pain management. The neurovascular assessment includes evaluating distal pulses (dorsalis pedis and posterior tibial), capillary refill, sensation, motor function, and skin color/temperature. A hip fracture can compromise the blood supply to the femoral head (particularly in femoral neck fractures) and can injure the sciatic nerve. Documenting a baseline neurovascular status before any interventions or immobilization is critical for comparison. Adequate pain management in geriatric hip fractures is essential not only for comfort but to prevent delirium, facilitate assessment, and reduce the cardiovascular stress response. Options include IV analgesics (low-dose morphine or hydromorphone with careful titration) and regional anesthesia (fascia iliaca block). While orthopedic consultation is important, it is not a 30-minute priority — most hip fractures are repaired within 24-48 hours. Platelet transfusion is not standard practice for aspirin and clopidogrel — these medications irreversibly inhibit platelets but do not typically require reversal unless active hemorrhage is present. Buck's traction is rarely used in modern practice and is not an initial nursing priority.",
    learningObjective: "Prioritize neurovascular assessment and pain management in geriatric hip fracture patients",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Students may prioritize surgical consultation or antiplatelet reversal over the immediate nursing priorities of neurovascular assessment and pain management",
    clinicalPearls: [
      "Shortened, externally rotated extremity is classic for hip fracture",
      "Geriatric hip fracture pain management prevents delirium and facilitates assessment",
      "Fascia iliaca block is an excellent regional anesthesia option for hip fracture pain"
    ],
    safetyNote: "Document baseline neurovascular status before any interventions — changes may indicate vascular compromise requiring emergent intervention",
    distractorRationales: [
      "Orthopedic consultation is important but not the 30-minute priority — surgery is typically within 24-48 hours",
      "Platelet transfusion is not standard for aspirin/clopidogrel unless active hemorrhage exists",
      "Buck's traction is rarely used in modern emergency practice"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 4-year-old child is brought to the ED by his parents after being found unconscious at the bottom of the stairs. The parents state he fell. On examination, the child has bilateral retinal hemorrhages, a bulging fontanelle, and bruising at various stages of healing on the trunk. The emergency nurse should recognize this presentation as most concerning for:",
    options: [
      "Accidental fall with coagulopathy",
      "Abusive head trauma (shaken baby syndrome/non-accidental trauma)",
      "Idiopathic thrombocytopenic purpura with concurrent head injury",
      "Osteogenesis imperfecta with pathological fractures"
    ],
    correctAnswer: 1,
    rationaleLong: "This presentation is highly concerning for abusive head trauma (AHT), formerly known as shaken baby syndrome. The combination of bilateral retinal hemorrhages, bulging fontanelle, and bruising at various stages of healing is a classic triad that is pathognomonic for non-accidental trauma in pediatric patients. Bilateral retinal hemorrhages in the setting of trauma are found in over 85% of abusive head trauma cases and are extremely rare in accidental short falls. The mechanism of the injury described (found at bottom of stairs) is inconsistent with the severity of findings — short falls rarely cause bilateral retinal hemorrhages or subdural hematomas. Bruising at various stages of healing indicates repeated trauma over time, which is a red flag for ongoing abuse. A bulging fontanelle suggests increased intracranial pressure from subdural hemorrhage. The emergency nurse has a legal and ethical obligation to report suspected child abuse to Child Protective Services regardless of the explanation provided by the caregivers. The nurse must carefully document all findings including the exact location, size, color, and pattern of bruises, as well as the inconsistency between the reported mechanism and the clinical findings. Accidental falls from standing or short stairs typically produce unilateral injuries and single-event bruising patterns. ITP would present with petechiae and mucosal bleeding but not focal neurological findings. Osteogenesis imperfecta causes fractures but not retinal hemorrhages.",
    learningObjective: "Recognize the clinical presentation of abusive head trauma in pediatric patients and understand mandatory reporting obligations",
    blueprintCategory: "Trauma",
    subtopic: "pediatric trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Do not accept the caregiver's explanation at face value when the mechanism is inconsistent with the severity and pattern of injuries",
    clinicalPearls: [
      "Bilateral retinal hemorrhages are found in over 85% of abusive head trauma cases",
      "Bruising at various stages of healing indicates repeated trauma over time",
      "Mechanism inconsistent with injury severity is a hallmark of non-accidental trauma"
    ],
    safetyNote: "Emergency nurses are mandatory reporters of suspected child abuse — document all findings meticulously and report to Child Protective Services",
    distractorRationales: [
      "Accidental falls do not produce bilateral retinal hemorrhages with multi-stage bruising",
      "ITP presents with petechiae and bleeding tendency but not focal neurological findings or retinal hemorrhages from trauma",
      "Osteogenesis imperfecta causes pathological fractures but not bilateral retinal hemorrhages or multi-stage bruising"
    ],
    lessonPath: "/emergency/lessons/pediatric-trauma"
  },
  {
    stem: "A 78-year-old female with dementia presents to the ED after a mechanical fall. She has a large scalp laceration with active bleeding but denies pain. Her medications include rivaroxaban 20mg daily. INR is 1.3. The nurse should recognize that:",
    options: [
      "The normal INR indicates adequate coagulation and low bleeding risk",
      "Rivaroxaban affects factor Xa and is not reliably reflected by INR — the bleeding risk remains elevated",
      "The patient's denial of pain indicates the injury is minor",
      "Scalp lacerations rarely cause significant hemorrhage in elderly patients"
    ],
    correctAnswer: 1,
    rationaleLong: "Rivaroxaban is a direct oral anticoagulant (DOAC) that works by directly inhibiting factor Xa in the coagulation cascade. Unlike warfarin, which affects multiple vitamin K-dependent clotting factors and is reliably monitored by the INR, rivaroxaban's anticoagulant effect is NOT accurately reflected by the INR. A normal INR in a patient on rivaroxaban does not indicate normal hemostasis — the patient remains at significantly elevated risk for hemorrhage. The appropriate lab test to assess rivaroxaban's effect is a calibrated anti-Xa level, though even this test may not be readily available in all EDs. In this elderly patient with an active scalp laceration on rivaroxaban, the bleeding risk is substantial. Scalp lacerations can cause significant hemorrhage because the scalp is highly vascularized and the vessels in the scalp's galea aponeurotica do not constrict normally due to their fibrous attachments. In elderly patients, this can lead to surprising amounts of blood loss. The patient's denial of pain should not be relied upon to gauge injury severity — dementia significantly impairs pain perception and communication. Geriatric trauma patients frequently underreport symptoms. The specific reversal agent for rivaroxaban is andexanet alfa, though 4-factor prothrombin complex concentrate (4F-PCC) can also be used. The emergency nurse must recognize that DOACs require different assessment and management approaches compared to warfarin.",
    learningObjective: "Understand the limitations of INR in monitoring DOAC anticoagulation and recognize bleeding risks in geriatric patients on rivaroxaban",
    blueprintCategory: "Trauma",
    subtopic: "geriatric trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "A normal INR does NOT indicate normal hemostasis in patients on direct oral anticoagulants (DOACs) like rivaroxaban",
    clinicalPearls: [
      "INR does not reliably reflect DOAC anticoagulant effect — use calibrated anti-Xa levels for rivaroxaban",
      "Andexanet alfa is the specific reversal agent for factor Xa inhibitors",
      "Elderly patients with dementia frequently underreport pain and injury severity"
    ],
    safetyNote: "Never use INR alone to assess bleeding risk in patients on DOACs — always consider the anticoagulant mechanism and timing of last dose",
    distractorRationales: [
      "Normal INR does not reflect rivaroxaban's anticoagulant effect on factor Xa",
      "Denial of pain in a patient with dementia is unreliable for assessing injury severity",
      "Scalp lacerations are highly vascular and can cause significant hemorrhage, especially in anticoagulated patients"
    ],
    lessonPath: "/emergency/lessons/geriatric-trauma"
  },
  {
    stem: "A 30-year-old unrestrained driver is brought to the ED after a head-on collision at 55 mph. He has a sternal fracture, bilateral femur fractures, and a pelvic ring disruption. His GCS is 14, HR 140 bpm, BP 72/40 mmHg, and he is pale and diaphoretic. The massive transfusion protocol has been activated. What is the target ratio for packed red blood cells (PRBCs), fresh frozen plasma (FFP), and platelets?",
    options: [
      "3:1:1 (PRBCs to FFP to platelets)",
      "1:1:1 (PRBCs to FFP to platelets)",
      "2:1:1 (PRBCs to FFP to platelets)",
      "1:2:1 (PRBCs to FFP to platelets)"
    ],
    correctAnswer: 1,
    rationaleLong: "The current evidence-based practice for massive transfusion in trauma follows a balanced resuscitation strategy with a 1:1:1 ratio of packed red blood cells (PRBCs) to fresh frozen plasma (FFP) to platelets. This approach was validated by the landmark PROPPR (Pragmatic, Randomized Optimal Platelet and Plasma Ratios) trial, which demonstrated improved hemostasis and reduced 24-hour mortality in patients receiving a balanced 1:1:1 ratio compared to a 1:1:2 ratio. The rationale behind balanced resuscitation is to prevent the lethal triad of trauma: hypothermia, acidosis, and coagulopathy. When large volumes of PRBCs are transfused without corresponding plasma and platelets, the patient develops dilutional coagulopathy as the clotting factors and platelets are progressively diluted. This creates a vicious cycle where the patient continues to bleed despite receiving blood products because they lack the components necessary for clot formation. The 1:1:1 ratio approximates whole blood composition and maintains hemostatic competence during massive hemorrhage. This patient clearly meets criteria for massive transfusion protocol activation: multi-system trauma with hemodynamic instability (HR 140, BP 72/40), estimated significant blood loss from bilateral femur fractures (each can lose 750-1500 mL) and pelvic ring disruption (can lose 1500-3000+ mL). The emergency nurse plays a critical role in facilitating rapid blood product delivery, maintaining component ratios, monitoring for transfusion reactions, and tracking total products administered.",
    learningObjective: "Apply the 1:1:1 balanced resuscitation ratio in massive transfusion protocol for hemorrhagic trauma",
    blueprintCategory: "Trauma",
    subtopic: "multi-system trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Older protocols used higher PRBC-to-FFP ratios, but current evidence supports 1:1:1 balanced resuscitation to prevent dilutional coagulopathy",
    clinicalPearls: [
      "The PROPPR trial validated 1:1:1 ratio for massive transfusion in trauma",
      "The lethal triad of trauma: hypothermia, acidosis, and coagulopathy",
      "Pelvic ring disruption can lose 1500-3000+ mL of blood"
    ],
    safetyNote: "Monitor for transfusion reactions, hypocalcemia (from citrate in blood products), and hypothermia during massive transfusion",
    distractorRationales: [
      "A 3:1:1 ratio leads to dilutional coagulopathy and worsens the lethal triad",
      "A 2:1:1 ratio is suboptimal compared to the evidence-based 1:1:1 ratio",
      "A 1:2:1 ratio with excess FFP does not provide additional hemostatic benefit"
    ],
    lessonPath: "/emergency/lessons/multi-system-trauma"
  },
  {
    stem: "A 25-year-old male presents to the ED with a gunshot wound to the right lower chest at the 8th intercostal space, posterior axillary line. The entry wound is below the nipple line posteriorly. He has diminished breath sounds on the right and dullness to percussion. The nurse should suspect injury to which structure(s)?",
    options: [
      "Right lung only — this is a thoracic injury",
      "Right lung and liver — the thoracoabdominal zone extends below the nipple line posteriorly",
      "Right kidney only — this is a flank wound",
      "Diaphragm only — requiring diaphragmatic repair"
    ],
    correctAnswer: 1,
    rationaleLong: "The thoracoabdominal zone is a critical anatomical concept in penetrating trauma. Posteriorly, the thoracoabdominal zone extends from the tip of the scapulae (approximately the 7th thoracic vertebra) down to the costal margin. Any wound in this zone must be evaluated for both thoracic and abdominal injuries because the diaphragm can rise to the level of the 4th intercostal space during maximal expiration. At the 8th intercostal space posteriorly, the diaphragm may be at or above this level, meaning a projectile entering here could traverse the pleural space, penetrate the diaphragm, and injure the liver (on the right side) or spleen (on the left side). The diminished breath sounds on the right suggest hemothorax or pneumothorax from lung injury, while the dullness to percussion supports hemothorax (blood accumulation). However, the posterior location below the nipple line mandates evaluation for concurrent abdominal injury, specifically the liver on the right side. The liver dome extends superiorly under the right hemidiaphragm, making it vulnerable to any penetrating wound in the right thoracoabdominal zone. The nurse must prepare for chest tube insertion to manage the hemothorax while also anticipating the need for CT imaging or exploratory laparotomy to evaluate for hepatic injury. A kidney injury is possible but less likely given the intercostal space location. Isolated diaphragmatic injury is rare without concurrent organ injury.",
    learningObjective: "Recognize the thoracoabdominal zone and anticipate combined thoracic and abdominal injuries in penetrating trauma",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Penetrating wounds below the nipple line must be evaluated for BOTH thoracic and abdominal injuries — the diaphragm rises higher than most expect",
    clinicalPearls: [
      "The thoracoabdominal zone extends from the nipple line to the costal margin — wounds here may injure both thoracic and abdominal structures",
      "The diaphragm can rise to the 4th intercostal space during expiration",
      "Right-sided thoracoabdominal wounds commonly injure the liver; left-sided wounds commonly injure the spleen"
    ],
    safetyNote: "Always evaluate for dual-cavity injuries in penetrating wounds to the thoracoabdominal zone — missing an abdominal injury in a chest wound can be fatal",
    distractorRationales: [
      "Evaluating only the thoracic cavity misses potentially life-threatening hepatic injury",
      "While the kidney is in proximity, the intercostal space location makes liver injury more likely than isolated renal injury",
      "Isolated diaphragmatic injury without concurrent organ damage is uncommon in penetrating trauma"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 50-year-old male presents to the ED after being struck by a car while crossing the street. He has an obvious open tibial fracture with bone protruding through the skin. There is moderate bleeding from the wound. What is the appropriate initial wound management?",
    options: [
      "Irrigate the wound with normal saline, reduce the fracture by pushing the bone back under the skin, and apply a sterile dressing",
      "Apply a sterile moist dressing over the wound, splint the extremity in the position found, and administer IV antibiotics within 1 hour",
      "Apply a tourniquet above the fracture site to control bleeding and cover with a dry dressing",
      "Pack the wound with hemostatic gauze and apply a pressure bandage"
    ],
    correctAnswer: 1,
    rationaleLong: "Open fractures (previously called compound fractures) are orthopedic emergencies that carry a significant risk of infection, osteomyelitis, and compartment syndrome. The appropriate initial management includes covering the exposed bone and wound with a sterile moist dressing (saline-moistened gauze) to prevent desiccation of the exposed tissue, splinting the extremity in the position found to prevent further injury to soft tissue, nerves, and blood vessels, and administering IV antibiotics as early as possible — ideally within 1 hour of injury. The gold standard antibiotic regimen for open fractures is a first-generation cephalosporin (cefazolin) for Gustilo Type I and II fractures, with the addition of an aminoglycoside (gentamicin) for Type III fractures. Attempting to reduce the fracture in the ED by pushing the bone back under the skin is contraindicated because it can introduce contamination deeper into the wound, cause additional vascular or nerve damage, and worsen soft tissue injury. A tourniquet is reserved for life-threatening hemorrhage that cannot be controlled by direct pressure — moderate bleeding from an open fracture is typically managed with direct pressure and elevation. Wound packing with hemostatic agents is reserved for junctional wounds or hemorrhage that cannot be controlled with direct pressure. The emergency nurse must also document a thorough neurovascular assessment, administer tetanus prophylaxis if indicated, and prepare the patient for orthopedic consultation and likely operative washout and fixation.",
    learningObjective: "Apply appropriate initial wound management principles for open fractures in the emergency department",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Never attempt to reduce an open fracture by pushing protruding bone back under the skin in the ED — this introduces contamination and causes additional damage",
    clinicalPearls: [
      "IV antibiotics within 1 hour of open fracture injury significantly reduces infection risk",
      "Cefazolin is first-line for Gustilo Type I-II open fractures; add gentamicin for Type III",
      "Cover exposed bone with moist sterile dressing to prevent tissue desiccation"
    ],
    safetyNote: "Do not attempt field or ED reduction of open fractures — splint in position found and prepare for operative management",
    distractorRationales: [
      "Reducing an open fracture in the ED introduces contamination and causes additional soft tissue, nerve, and vascular damage",
      "Tourniquets are reserved for life-threatening hemorrhage — moderate bleeding is managed with direct pressure",
      "Hemostatic gauze wound packing is for junctional hemorrhage, not standard open fracture management"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 6-month-old infant is brought to the ED after a reported fall from a couch. The parents describe the infant rolling off and landing on a carpeted floor. Radiographs reveal bilateral posterior rib fractures and a metaphyseal corner fracture of the left humerus. These findings are most concerning for:",
    options: [
      "Accidental injury consistent with the reported mechanism",
      "Non-accidental trauma with fracture patterns highly specific for abuse",
      "Metabolic bone disease such as rickets",
      "Birth-related trauma with delayed healing"
    ],
    correctAnswer: 1,
    rationaleLong: "Bilateral posterior rib fractures and metaphyseal corner fractures (also known as classic metaphyseal lesions or bucket-handle fractures) are among the most specific skeletal indicators of non-accidental trauma (child abuse) in infants. Posterior rib fractures in infants typically result from forceful anteroposterior compression of the chest, as occurs when an infant is squeezed during violent shaking. A short fall from a couch (approximately 2-3 feet) onto a carpeted surface has been extensively studied and virtually never causes rib fractures or metaphyseal corner fractures. The energy transferred in such a fall is insufficient to produce these injuries. Metaphyseal corner fractures occur at the junction of the bone shaft and growth plate when the extremity is twisted or pulled forcefully — a mechanism inconsistent with a simple fall. The combination of these highly specific fracture patterns with an inconsistent mechanism of injury creates a very high index of suspicion for abuse. The emergency nurse must recognize these patterns, document findings meticulously, and initiate the mandatory reporting process to Child Protective Services. Additional workup should include a complete skeletal survey to identify occult fractures, ophthalmologic examination for retinal hemorrhages, and laboratory evaluation including CBC, coagulation studies, calcium, phosphorus, alkaline phosphatase, and vitamin D levels to rule out metabolic bone disease. Birth trauma typically involves clavicle fractures or occasionally humeral fractures, but bilateral posterior rib fractures are not consistent with birth injury.",
    learningObjective: "Identify fracture patterns highly specific for non-accidental trauma in pediatric patients",
    blueprintCategory: "Trauma",
    subtopic: "pediatric trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Short falls from couches or beds do not generate sufficient force to cause rib fractures or metaphyseal corner fractures in infants",
    clinicalPearls: [
      "Posterior rib fractures in infants are highly specific for non-accidental trauma",
      "Metaphyseal corner fractures result from twisting/pulling forces inconsistent with accidental falls",
      "A complete skeletal survey is indicated when abuse is suspected in children under 2 years"
    ],
    safetyNote: "Emergency nurses are mandatory reporters — report suspected child abuse regardless of parental explanations that are inconsistent with injury patterns",
    distractorRationales: [
      "A couch fall onto carpet does not generate sufficient force for bilateral rib fractures and metaphyseal lesions",
      "Rickets would show generalized osteopenia and metaphyseal fraying/cupping, not corner fractures",
      "Birth trauma causes clavicle or proximal humerus fractures, not bilateral posterior rib fractures"
    ],
    lessonPath: "/emergency/lessons/pediatric-trauma"
  },
  {
    stem: "A trauma patient arrives to the ED with an impaled knife in the left anterior chest. The patient is hemodynamically stable with BP 120/78 mmHg and HR 88 bpm. What is the priority nursing action regarding the impaled object?",
    options: [
      "Remove the knife to allow assessment and dressing of the wound",
      "Stabilize the knife in place with bulky dressings and prepare for operative removal",
      "Obtain a chest X-ray before deciding whether to remove the knife",
      "Gently attempt to advance the knife slightly to determine the depth of penetration"
    ],
    correctAnswer: 1,
    rationaleLong: "The cardinal rule of impaled object management is to never remove the object in the emergency department. Impaled objects must be stabilized in place and removed only in the operating room under controlled surgical conditions. The rationale is that the impaled object may be tamponading (compressing) a major vessel or cardiac structure. Removing the object could release this tamponade effect and result in rapid, uncontrolled hemorrhage or cardiac tamponade that may be impossible to manage in the ED setting. The knife should be stabilized using bulky dressings, rolled gauze, or commercial stabilization devices secured around the base of the object to prevent any movement. The only exceptions to this rule are objects impaled in the cheek (which may compromise the airway) or objects that physically prevent CPR in a pulseless patient. The emergency nurse should prepare the patient for operative removal, ensure large-bore IV access is established, type and crossmatch blood, and have massive transfusion protocol available. Chest X-ray can be obtained with the object in place and is useful for surgical planning but should not delay stabilization. Attempting to advance the knife would cause additional tissue damage. Even in a hemodynamically stable patient, the removal of an impaled object can cause sudden hemodynamic collapse. The operating room provides a controlled environment with surgical exposure, blood products immediately available, and the ability to repair injured structures directly.",
    learningObjective: "Apply the principle of impaled object stabilization and prepare for operative removal in penetrating trauma",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Never remove an impaled object in the ED — even in stable patients, removal can cause sudden hemorrhagic decompensation",
    clinicalPearls: [
      "Impaled objects may be tamponading major vessels — removal can cause uncontrolled hemorrhage",
      "Exceptions: objects in the cheek compromising airway, or preventing CPR in pulseless patients",
      "Stabilize with bulky dressings and prepare for OR removal with surgical team"
    ],
    safetyNote: "Removing an impaled object outside the OR can convert a stable patient into a rapidly deteriorating one — always stabilize in place",
    distractorRationales: [
      "Removing the knife could release tamponade and cause uncontrolled hemorrhage",
      "Chest X-ray can be done with the object in place but stabilization is the priority",
      "Advancing the object would cause additional tissue damage and is never appropriate"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "An ED nurse is caring for a 42-year-old male with a traumatic pneumothorax. A chest tube has been inserted and connected to a chest drainage system. Two hours later, the nurse observes continuous bubbling in the water seal chamber with each breath. This finding indicates:",
    options: [
      "Normal chest tube function with expected air evacuation",
      "A persistent air leak from the lung or a system connection leak",
      "The suction is set too high and needs to be reduced",
      "The chest tube is kinked and not functioning properly"
    ],
    correctAnswer: 1,
    rationaleLong: "Continuous bubbling in the water seal chamber of a chest drainage system indicates an air leak. Air leaks can originate from two sources: a persistent air leak from the injured lung (bronchopleural fistula) or a leak in the drainage system connections. The water seal chamber acts as a one-way valve — it should show tidaling (fluctuation with respiration) but not continuous vigorous bubbling at 2 hours post-insertion. Initial bubbling immediately after chest tube insertion is expected as the accumulated air is evacuated, but it should diminish within the first 1-2 hours if the lung is re-expanding. Persistent continuous bubbling at 2 hours suggests either the lung injury has not sealed (the air leak continues from the visceral pleura) or there is a connection leak in the tubing system. The nurse should systematically troubleshoot by first checking all connections from the chest tube to the drainage unit, ensuring they are tight and properly connected. If the connections are secure, the nurse should briefly clamp the chest tube close to the patient's chest wall — if bubbling stops, the air leak is from the patient (pulmonary origin); if bubbling continues, the leak is in the system. Continuous suction bubbling is seen in the suction control chamber, not the water seal chamber. A kinked tube would prevent air evacuation and cause worsening pneumothorax symptoms, not continuous bubbling. The nurse should document the finding and notify the provider for possible imaging and further management.",
    learningObjective: "Interpret chest drainage system findings and systematically troubleshoot air leaks",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Continuous bubbling in the water seal chamber is NOT normal at 2 hours post-insertion — distinguish between initial expected air evacuation and persistent air leak",
    clinicalPearls: [
      "Water seal chamber: tidaling is normal, continuous bubbling indicates air leak",
      "Systematic troubleshoot: clamp near patient — if bubbling stops, leak is pulmonary; if continues, leak is in system",
      "Suction control chamber bubbling is expected; water seal chamber bubbling indicates a problem"
    ],
    safetyNote: "Never clamp a chest tube for more than a few seconds during troubleshooting — prolonged clamping can cause tension pneumothorax",
    distractorRationales: [
      "Normal function shows tidaling in the water seal chamber, not continuous bubbling at 2 hours",
      "Suction level affects the suction control chamber, not the water seal chamber",
      "A kinked tube would cause decreased drainage and worsening symptoms, not continuous bubbling"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "A 16-year-old football player is brought to the ED after a helmet-to-helmet collision. He was initially lucid at the scene but became progressively confused during transport. In the ED, his GCS deteriorates from 13 to 8 over 20 minutes. His left pupil becomes fixed and dilated. This clinical pattern is most consistent with:",
    options: [
      "Acute subdural hematoma with midline shift",
      "Epidural hematoma with the classic lucid interval",
      "Diffuse axonal injury with progressive cerebral edema",
      "Subarachnoid hemorrhage with vasospasm"
    ],
    correctAnswer: 1,
    rationaleLong: "The classic lucid interval followed by rapid neurological deterioration is the hallmark presentation of an epidural hematoma. Epidural hematomas occur most commonly from rupture of the middle meningeal artery following a temporal bone fracture. The pathophysiology explains the clinical pattern: the initial impact causes a brief period of unconsciousness from concussive force, followed by a lucid interval as the patient regains consciousness while the arterial bleeding slowly expands the hematoma in the epidural space. As the hematoma enlarges, it creates increasing pressure on the brain, causing progressive neurological deterioration. The ipsilateral pupil dilation (left pupil in this case) occurs due to uncal herniation — the medial temporal lobe herniates through the tentorial notch, compressing the ipsilateral CN III (oculomotor nerve), causing parasympathetic nerve dysfunction and pupil dilation. This is an extreme neurosurgical emergency requiring emergent craniotomy and hematoma evacuation. The mortality rate approaches 100% without surgical intervention but can be as low as 5-10% with prompt surgical decompression. The emergency nurse must recognize this pattern and facilitate rapid CT imaging and neurosurgical intervention. An acute subdural hematoma typically presents with immediate neurological deficit without a lucid interval. Diffuse axonal injury causes prolonged unconsciousness from the time of injury without a lucid interval. Subarachnoid hemorrhage with vasospasm typically occurs days after the initial hemorrhage, not within the first hour.",
    learningObjective: "Recognize the classic lucid interval presentation of epidural hematoma and facilitate emergent neurosurgical intervention",
    blueprintCategory: "Trauma",
    subtopic: "traumatic brain injury",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The lucid interval may last from minutes to hours — do not be falsely reassured by initial improvement after head trauma",
    clinicalPearls: [
      "Epidural hematoma: lucid interval followed by rapid deterioration — most commonly from middle meningeal artery rupture",
      "Ipsilateral pupil dilation indicates uncal herniation compressing CN III",
      "Mortality approaches 100% without surgery but drops to 5-10% with prompt craniotomy"
    ],
    safetyNote: "Epidural hematoma with neurological deterioration is a neurosurgical emergency — delay in operative intervention directly increases mortality",
    distractorRationales: [
      "Acute subdural hematoma typically presents with immediate deficit without a lucid interval",
      "Diffuse axonal injury causes prolonged unconsciousness from the moment of injury",
      "Subarachnoid hemorrhage vasospasm occurs days later, not within the first hour"
    ],
    lessonPath: "/emergency/lessons/traumatic-brain-injury"
  },
  {
    stem: "A 38-year-old male is brought to the ED after an industrial explosion. He has burns to his face, neck, and bilateral upper extremities. His voice is becoming progressively hoarse, and you notice early stridor. Vital signs: HR 110, BP 130/85, RR 24, SpO2 94% on 100% NRB mask. What is the most critical time-sensitive intervention?",
    options: [
      "Initiate the Parkland formula for fluid resuscitation",
      "Obtain a stat carboxyhemoglobin level",
      "Perform rapid sequence intubation before complete airway obstruction develops",
      "Calculate the TBSA using the rule of nines"
    ],
    correctAnswer: 2,
    rationaleLong: "Progressive hoarseness and early stridor in a burn patient with facial and neck burns represent an evolving airway emergency. Upper airway edema from thermal and chemical injury can progress rapidly to complete airway obstruction. The supraglottic structures (epiglottis, arytenoids, false vocal cords) are particularly susceptible to edema because they are covered by loose areolar tissue that swells dramatically in response to thermal injury. Once stridor develops, it indicates greater than 50% narrowing of the airway lumen. The window for safe intubation closes rapidly as the edema progresses — within 1-2 hours, the swelling may make conventional intubation impossible, requiring a surgical airway (cricothyrotomy). Rapid sequence intubation should be performed by the most experienced provider available, ideally using a smaller endotracheal tube than usual (as the edema narrows the airway) and having a surgical airway kit immediately available as a backup. The SpO2 of 94% on 100% NRB mask indicates compromised gas exchange, and this will worsen rapidly as the airway narrows further. While the Parkland formula for fluid resuscitation is important, it is secondary to securing the airway. Carboxyhemoglobin levels are diagnostic but do not change the immediate need for intubation. TBSA calculation guides fluid resuscitation but does not take priority over an actively compromising airway. The emergency nurse must immediately prepare for intubation by gathering RSI medications, having the most experienced laryngoscopist at bedside, and ensuring a surgical airway kit is within arm's reach.",
    learningObjective: "Recognize progressive airway compromise in burn patients and facilitate emergent intubation before complete obstruction",
    blueprintCategory: "Trauma",
    subtopic: "burn injuries",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Stridor in burn patients indicates greater than 50% airway narrowing — waiting for further deterioration may result in a cannot-intubate scenario",
    clinicalPearls: [
      "Stridor indicates greater than 50% narrowing of the airway lumen",
      "Upper airway edema from burns can progress to complete obstruction within 1-2 hours",
      "Use a smaller ETT than usual and have surgical airway immediately available"
    ],
    safetyNote: "When in doubt, intubate early in burn patients with airway concerns — losing the airway in a burn patient is catastrophic",
    distractorRationales: [
      "Fluid resuscitation is secondary to securing the airway",
      "Carboxyhemoglobin level is diagnostic but does not change the immediate need for intubation",
      "TBSA calculation guides fluid therapy but is not time-critical compared to airway management"
    ],
    lessonPath: "/emergency/lessons/burn-injuries"
  },
  {
    stem: "A 27-year-old male arrives at the ED with a penetrating wound to the right neck in Zone II. There is an expanding hematoma, and the patient has a bruit audible over the wound. He is alert with stable vital signs. The nurse should prioritize which assessment finding to communicate to the trauma surgeon?",
    options: [
      "The patient's stable vital signs suggesting the injury is non-emergent",
      "The expanding hematoma and bruit indicating probable vascular injury requiring surgical exploration",
      "The Zone II location which allows for conservative observation",
      "The patient's alert status suggesting no neurological compromise"
    ],
    correctAnswer: 1,
    rationaleLong: "Penetrating neck injuries are classified into three anatomical zones: Zone I (clavicle to cricoid cartilage), Zone II (cricoid cartilage to angle of the mandible), and Zone III (angle of the mandible to base of skull). Zone II is the largest and most exposed zone, containing the carotid and vertebral arteries, jugular veins, esophagus, trachea, and larynx. The clinical findings of an expanding hematoma and an audible bruit are hard signs of vascular injury that mandate surgical exploration regardless of hemodynamic stability. Hard signs of vascular injury include: expanding or pulsatile hematoma, active arterial hemorrhage, bruit or thrill over the wound, absent distal pulses, and hemodynamic instability not explained by other injuries. An audible bruit suggests turbulent blood flow through a damaged vessel, possibly indicating a partial arterial laceration, arteriovenous fistula, or pseudoaneurysm formation. Even though the patient is currently hemodynamically stable, the expanding hematoma indicates ongoing hemorrhage that can rapidly progress to airway compromise (from external compression of the trachea) or hemodynamic collapse (from vessel rupture). The emergency nurse must communicate these hard signs clearly and urgently to the trauma surgeon while simultaneously preparing for possible emergent operative intervention. Stable vital signs do not negate the presence of hard signs. Conservative observation is appropriate for soft signs of injury, not hard signs.",
    learningObjective: "Identify hard signs of vascular injury in penetrating neck trauma and communicate findings for surgical decision-making",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Hemodynamic stability does NOT negate the need for surgical exploration when hard signs of vascular injury are present",
    clinicalPearls: [
      "Hard signs of vascular injury: expanding/pulsatile hematoma, active hemorrhage, bruit/thrill, absent distal pulses",
      "Zone II neck injuries with hard signs require surgical exploration",
      "Expanding neck hematoma can rapidly compromise the airway"
    ],
    safetyNote: "An expanding neck hematoma can cause airway compromise within minutes — have airway equipment immediately available and prepare for possible surgical airway",
    distractorRationales: [
      "Stable vital signs with hard signs of vascular injury still require surgical intervention",
      "Conservative observation is for soft signs, not hard signs of vascular injury",
      "An alert status does not exclude significant vascular injury requiring surgical exploration"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 60-year-old female is brought to the ED after a rollover MVC. She is complaining of severe abdominal pain with guarding and rigidity. Serial vital signs over 30 minutes show: initial BP 118/74 mmHg, HR 94 bpm; repeat BP 108/68 mmHg, HR 108 bpm; third set BP 96/60 mmHg, HR 120 bpm. What trend does the nurse identify?",
    options: [
      "Stable vital signs with pain-related tachycardia",
      "Compensatory shock transitioning to decompensated hemorrhagic shock",
      "Neurogenic shock from spinal cord injury",
      "Isolated anxiety response requiring anxiolytic medication"
    ],
    correctAnswer: 1,
    rationaleLong: "The serial vital sign trend demonstrates the classic progression from compensated to decompensated hemorrhagic shock. Initially, the body's compensatory mechanisms (sympathetic activation, catecholamine release, peripheral vasoconstriction) maintain a near-normal blood pressure despite ongoing hemorrhage. The heart rate increases as a compensatory mechanism to maintain cardiac output in the face of decreasing preload from blood loss. As the hemorrhage continues and blood volume decreases beyond the body's ability to compensate, the blood pressure begins to fall while the heart rate continues to climb. The progression from BP 118/74 with HR 94 (early compensation) to BP 108/68 with HR 108 (progressing compensation) to BP 96/60 with HR 120 (beginning decompensation) represents approximately a 15-30% blood volume loss transitioning to 30-40% loss (Class II to Class III hemorrhagic shock). The narrowing pulse pressure (from 44 to 40 to 36 mmHg) is another important indicator of declining stroke volume. The abdominal guarding and rigidity suggest intra-abdominal hemorrhage (likely splenic or hepatic injury) as the source. The emergency nurse must recognize this trajectory and advocate for immediate intervention — this patient is heading toward hemodynamic collapse. Interventions should include activation of the massive transfusion protocol, preparation for emergent surgery, and continued aggressive monitoring. Neurogenic shock would present with hypotension and bradycardia (loss of sympathetic tone), which is opposite to the tachycardia observed here. Pain or anxiety alone would not cause progressive hypotension.",
    learningObjective: "Recognize serial vital sign trends indicating progression from compensated to decompensated hemorrhagic shock",
    blueprintCategory: "Trauma",
    subtopic: "blunt trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Do not dismiss rising heart rate as pain or anxiety — serial vital sign trends with progressive tachycardia and falling BP indicate hemorrhagic shock",
    clinicalPearls: [
      "Narrowing pulse pressure is an early indicator of declining stroke volume",
      "Class III hemorrhagic shock (30-40% blood loss) marks the transition from compensated to decompensated shock",
      "Serial vital sign trending is more valuable than any single measurement"
    ],
    safetyNote: "Activate massive transfusion protocol early when vital sign trends suggest progression toward hemorrhagic shock — do not wait for severe hypotension",
    distractorRationales: [
      "Progressive hypotension with tachycardia is not stable — this is a dangerous trend",
      "Neurogenic shock presents with hypotension and bradycardia, not tachycardia",
      "Anxiety does not cause progressive hypotension — this pattern indicates hemorrhage"
    ],
    lessonPath: "/emergency/lessons/blunt-trauma"
  },
  {
    stem: "A 33-year-old male arrives to the ED with a stab wound to the left upper quadrant of the abdomen. He is hemodynamically unstable with BP 78/48 mmHg and HR 138 bpm despite 2 units of PRBCs. The FAST exam is positive. What is the most appropriate next step?",
    options: [
      "Obtain a CT scan of the abdomen and pelvis with IV contrast for surgical planning",
      "Continue fluid and blood product resuscitation until the patient stabilizes",
      "Emergent operative exploration (exploratory laparotomy) without further imaging",
      "Place a diagnostic peritoneal lavage catheter to quantify the hemorrhage"
    ],
    correctAnswer: 2,
    rationaleLong: "This patient meets clear criteria for emergent exploratory laparotomy: penetrating abdominal trauma with hemodynamic instability (hypotension and tachycardia) that is not responding to initial resuscitation (remains unstable after 2 units of PRBCs) and a positive FAST examination confirming intraperitoneal free fluid (hemorrhage). The definitive treatment for ongoing intra-abdominal hemorrhage is surgical control of the bleeding source. CT scanning is contraindicated in hemodynamically unstable patients because the time required for transport, scanning, and image acquisition delays definitive surgical intervention — and the patient could arrest during the scan. CT scanning is appropriate for hemodynamically stable patients where the question is whether surgery is needed. In this case, the answer is clearly yes, and further imaging only delays definitive care. Continuing fluid resuscitation without operative intervention perpetuates the cycle of ongoing hemorrhage and transfusion without addressing the source — the patient will eventually develop the lethal triad of hypothermia, acidosis, and coagulopathy. Diagnostic peritoneal lavage (DPL) has largely been replaced by FAST examination in modern trauma centers and would add no useful information in a patient who already has a positive FAST and clear indication for surgery. The left upper quadrant location suggests possible splenic injury, which is the most commonly injured organ in blunt abdominal trauma and second most commonly injured in penetrating trauma. The emergency nurse's role includes rapid preparation of the patient for the operating room, ensuring blood products are available, communicating the urgency to the surgical team, and maintaining ongoing resuscitation during transport.",
    learningObjective: "Identify criteria for emergent laparotomy in penetrating abdominal trauma with hemodynamic instability",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "CT scanning is CONTRAINDICATED in hemodynamically unstable trauma patients — do not delay operative intervention for imaging",
    clinicalPearls: [
      "Hemodynamically unstable + penetrating abdominal trauma + positive FAST = emergent laparotomy",
      "CT scanning should only be performed in hemodynamically stable trauma patients",
      "The lethal triad (hypothermia, acidosis, coagulopathy) develops with prolonged resuscitation without source control"
    ],
    safetyNote: "Never transport a hemodynamically unstable trauma patient to CT — the OR is the destination for definitive hemorrhage control",
    distractorRationales: [
      "CT scanning is contraindicated in hemodynamically unstable patients — it delays definitive surgical intervention",
      "Continuing resuscitation without source control perpetuates the lethal triad and does not address the hemorrhage",
      "DPL has been replaced by FAST and adds no value when FAST is already positive with clear surgical indication"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "An ED nurse is performing the secondary survey on a trauma patient and notes paradoxical abdominal breathing pattern with intercostal retractions. The patient has no breath sounds on the left side and the trachea is deviated to the right. SpO2 is 82% and dropping. Blood pressure is 74/40 mmHg. What is the immediate nursing action?",
    options: [
      "Prepare for emergent chest tube insertion with a 36 French tube",
      "Prepare for immediate needle decompression at the 2nd intercostal space, midclavicular line on the left",
      "Obtain a stat portable chest X-ray to confirm the diagnosis before intervention",
      "Administer a 1-liter crystalloid fluid bolus for the hypotension"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with a classic tension pneumothorax: absent breath sounds on one side, tracheal deviation away from the affected side, hypotension, and severe hypoxemia. Tension pneumothorax is a clinical diagnosis that requires immediate intervention — it is one of the few conditions in trauma where treatment precedes diagnostic confirmation. The mechanism involves air entering the pleural space through a one-way valve effect (either from a lung injury or chest wall defect) and becoming trapped. With each breath, more air enters but cannot escape, progressively increasing intrapleural pressure. This causes compression of the ipsilateral lung, mediastinal shift pushing the trachea and heart toward the contralateral side, compression of the contralateral lung, and kinking of the great vessels (particularly the superior and inferior vena cavae), severely reducing venous return and cardiac output. The immediate life-saving intervention is needle decompression (needle thoracentesis) at the 2nd intercostal space, midclavicular line, using a 14-gauge or 16-gauge angiocatheter on the affected side. This converts the tension pneumothorax to a simple pneumothorax by allowing the trapped air to escape. A chest tube will be needed subsequently for definitive management, but the needle decompression buys time and immediately improves hemodynamics. Waiting for a chest X-ray in a patient with clinical tension pneumothorax and hemodynamic collapse is inappropriate and dangerous — the diagnosis is clinical. Fluid administration alone will not improve hemodynamics because the problem is mechanical obstruction of venous return, not volume depletion.",
    learningObjective: "Recognize tension pneumothorax as a clinical diagnosis requiring immediate needle decompression without delay for imaging",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Tension pneumothorax is a CLINICAL diagnosis — never delay treatment to obtain imaging confirmation",
    clinicalPearls: [
      "Tension pneumothorax triad: absent breath sounds, tracheal deviation, hemodynamic instability",
      "Needle decompression: 2nd intercostal space, midclavicular line, with 14-16 gauge angiocatheter",
      "Tension pneumothorax causes obstructive shock from reduced venous return — fluids alone will not resolve it"
    ],
    safetyNote: "Tension pneumothorax can cause PEA cardiac arrest within minutes — immediate needle decompression is life-saving",
    distractorRationales: [
      "Chest tube is definitive management but needle decompression is the immediate life-saving intervention",
      "Chest X-ray delays treatment of a clinical diagnosis that requires immediate intervention",
      "IV fluids address volume depletion but cannot overcome the mechanical obstruction of venous return in tension pneumothorax"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "A 24-year-old pregnant female at 28 weeks gestation is involved in a motor vehicle collision. She arrives to the ED with a seatbelt sign across her lower abdomen, mild vaginal bleeding, and uterine tenderness. Fetal heart tones are present at 155 bpm. The nurse should be most concerned about which complication?",
    options: [
      "Preterm labor from the mechanical impact",
      "Placental abruption requiring emergent cesarean delivery",
      "Uterine rupture with fetal expulsion into the peritoneum",
      "Amniotic fluid embolism from traumatic membrane rupture"
    ],
    correctAnswer: 1,
    rationaleLong: "Placental abruption is the most common cause of fetal death in trauma during pregnancy and occurs in approximately 40-50% of major trauma and 5% of minor trauma during pregnancy. The mechanism involves shearing forces between the relatively rigid placenta and the elastic uterine wall during deceleration injury. The seatbelt sign across the lower abdomen indicates direct force transmission to the uterus, and the combination of vaginal bleeding and uterine tenderness are classic presenting signs of placental abruption. The significance of this condition lies in the potential for catastrophic maternal and fetal compromise: as the placenta separates from the uterine wall, the fetus loses its oxygen supply while the mother may develop life-threatening hemorrhage, disseminated intravascular coagulation (DIC), and hypovolemic shock. The currently normal fetal heart rate of 155 bpm does not rule out abruption — the separation may be partial and progressive. Continuous fetal monitoring for a minimum of 4-6 hours (and up to 24 hours in significant mechanisms) is mandatory because abruption can manifest hours after the initial injury. The emergency nurse must initiate continuous fetal monitoring, establish large-bore IV access, type and crossmatch blood, draw a Kleihauer-Betke test (to detect fetal-maternal hemorrhage), and prepare for emergent cesarean delivery if fetal distress develops. Uterine rupture is rare and more associated with direct blunt force to a term uterus. Amniotic fluid embolism is extremely rare and not directly caused by trauma.",
    learningObjective: "Recognize placental abruption as the primary concern in pregnant trauma patients and implement appropriate monitoring",
    blueprintCategory: "Trauma",
    subtopic: "multi-system trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Normal fetal heart tones do not rule out placental abruption — continuous monitoring for 4-24 hours is mandatory after trauma in pregnancy",
    clinicalPearls: [
      "Placental abruption occurs in 40-50% of major trauma and 5% of minor trauma during pregnancy",
      "Seatbelt sign + vaginal bleeding + uterine tenderness = suspect placental abruption",
      "Kleihauer-Betke test detects fetal-maternal hemorrhage and guides Rh immunoglobulin administration"
    ],
    safetyNote: "Continuous fetal monitoring for minimum 4 hours (up to 24 hours for significant mechanisms) is mandatory in pregnant trauma patients — abruption can present hours after injury",
    distractorRationales: [
      "Preterm labor is possible but placental abruption is the more life-threatening and likely complication",
      "Uterine rupture is rare, more associated with direct force to a term uterus, and would typically present with more dramatic findings",
      "Amniotic fluid embolism is extremely rare and not directly caused by mechanical trauma"
    ],
    lessonPath: "/emergency/lessons/multi-system-trauma"
  },
  {
    stem: "A 45-year-old male presents to the ED after sustaining bilateral lower extremity burns from a chemical spill of hydrofluoric acid at a manufacturing plant. The burns cover approximately 8% TBSA. The patient is complaining of severe pain despite IV morphine. His telemetry shows a prolonged QT interval. The nurse should anticipate which electrolyte abnormality?",
    options: [
      "Hypernatremia from fluid losses through the burn wound",
      "Hypocalcemia from fluoride ion binding to serum calcium",
      "Hyperkalemia from tissue destruction and rhabdomyolysis",
      "Hypomagnesemia from aggressive fluid resuscitation"
    ],
    correctAnswer: 1,
    rationaleLong: "Hydrofluoric acid (HF) burns represent a unique chemical burn emergency because of the systemic toxicity of the fluoride ion, distinct from the local tissue destruction. Fluoride ions penetrate deeply into tissues and avidly bind to calcium and magnesium ions, forming insoluble calcium fluoride and magnesium fluoride salts. This sequestration of calcium causes both local tissue necrosis (through disruption of intracellular calcium-dependent enzymatic processes) and systemic hypocalcemia. Systemic hypocalcemia is the primary cause of death in significant hydrofluoric acid exposures. The ECG finding of a prolonged QT interval is a hallmark of hypocalcemia and is an ominous sign in HF burns — it indicates that systemic fluoride absorption has occurred and calcium levels are critically depleted. Severe hypocalcemia can progress to ventricular fibrillation and cardiac arrest. The severe pain disproportionate to the burn appearance is characteristic of HF burns and results from the fluoride ion's deep tissue penetration and nerve stimulation. Treatment is unique among chemical burns: topical calcium gluconate gel is applied to the burn wound to neutralize the fluoride ions locally, and IV calcium gluconate is administered for systemic hypocalcemia. Cardiac monitoring is essential because dysrhythmias can occur rapidly. The emergency nurse must obtain a stat ionized calcium level, prepare calcium gluconate for both topical and IV administration, and maintain continuous cardiac monitoring. While hyperkalemia from rhabdomyolysis is possible with any burn, the QT prolongation and HF mechanism point specifically to hypocalcemia as the primary concern.",
    learningObjective: "Recognize the systemic toxicity of hydrofluoric acid burns and the critical importance of calcium monitoring and replacement",
    blueprintCategory: "Trauma",
    subtopic: "burn injuries",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Hydrofluoric acid burns are unique — the fluoride ion causes systemic hypocalcemia that can be fatal even with small burn areas",
    clinicalPearls: [
      "Fluoride ions bind serum calcium causing systemic hypocalcemia — the primary cause of death in HF burns",
      "Prolonged QT interval on ECG is an ominous sign of systemic fluoride absorption",
      "Treatment: topical calcium gluconate gel locally + IV calcium gluconate for systemic hypocalcemia"
    ],
    safetyNote: "Hydrofluoric acid burns can be fatal even with small TBSA — systemic calcium monitoring and replacement is essential regardless of burn size",
    distractorRationales: [
      "Hypernatremia is not the primary electrolyte concern in HF burns — fluoride-calcium binding is the mechanism",
      "Hyperkalemia from rhabdomyolysis is possible but the QT prolongation specifically indicates hypocalcemia",
      "Hypomagnesemia is not the primary concern — though magnesium is also bound by fluoride, calcium depletion is the life-threatening issue"
    ],
    lessonPath: "/emergency/lessons/burn-injuries"
  },
  {
    stem: "A 29-year-old male is brought to the ED after a high-speed motorcycle crash. He is wearing no helmet. He has a GCS of 3, bilateral fixed dilated pupils, and no spontaneous respirations. After intubation and initial resuscitation, a CT head shows diffuse subarachnoid hemorrhage, massive cerebral edema, and loss of gray-white differentiation throughout. The nurse should understand that these findings are consistent with:",
    options: [
      "A surgically correctable epidural hematoma requiring emergent craniotomy",
      "Severe diffuse axonal injury with a grave prognosis — likely non-survivable",
      "Cerebral vasospasm that may respond to nimodipine therapy",
      "Reversible global cerebral edema that will improve with osmotic therapy"
    ],
    correctAnswer: 1,
    rationaleLong: "The combination of GCS 3, bilateral fixed dilated pupils, absent spontaneous respirations, and CT findings of diffuse subarachnoid hemorrhage with massive cerebral edema and loss of gray-white matter differentiation indicates a catastrophic, non-survivable traumatic brain injury most consistent with severe diffuse axonal injury (DAI). DAI occurs from rotational acceleration-deceleration forces that shear axonal connections throughout the brain. The loss of gray-white matter differentiation on CT indicates diffuse cerebral edema so severe that the normal density differences between gray matter and white matter are obliterated — this finding has a near 100% mortality rate. Bilateral fixed dilated pupils in the absence of medications or hypothermia indicate bilateral uncal herniation or global brain death. GCS of 3 with no spontaneous respirations indicates loss of brainstem function. While individual components of this presentation could theoretically respond to treatment in isolation, the constellation of findings together represents irreversible brain damage. This is not a surgical lesion like an epidural hematoma where evacuation of the clot could restore function. The role of the emergency nurse at this point shifts toward providing compassionate end-of-life care, supporting the family, and potentially initiating organ donation evaluation if appropriate. It is important for the nurse to communicate the gravity of the situation to the family with sensitivity and involve social work, chaplaincy, and palliative care services. Osmotic therapy (mannitol or hypertonic saline) will not reverse this degree of injury.",
    learningObjective: "Recognize CT findings associated with non-survivable traumatic brain injury and understand the nursing role in end-of-life care",
    blueprintCategory: "Trauma",
    subtopic: "traumatic brain injury",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Loss of gray-white matter differentiation on CT with bilateral fixed dilated pupils and GCS 3 has near 100% mortality — recognize futility to support appropriate goals of care discussions",
    clinicalPearls: [
      "Loss of gray-white differentiation on CT indicates severe diffuse cerebral edema with near 100% mortality",
      "Bilateral fixed dilated pupils with GCS 3 and absent respirations suggest brainstem herniation or death",
      "Severe DAI is not a surgical lesion — no operative intervention will change the outcome"
    ],
    safetyNote: "Recognize non-survivable injury patterns early to facilitate family communication, goals of care discussions, and potential organ donation",
    distractorRationales: [
      "Epidural hematomas are focal surgical lesions — diffuse edema with loss of differentiation is not surgically correctable",
      "Vasospasm is a delayed complication of aneurysmal SAH, not acute traumatic brain injury",
      "This degree of edema with loss of gray-white differentiation is irreversible and will not respond to osmotic therapy"
    ],
    lessonPath: "/emergency/lessons/traumatic-brain-injury"
  },
  {
    stem: "A 52-year-old construction worker falls from a ladder and lands on an exposed rebar, which enters his right flank and exits his right lower back. He arrives to the ED ambulatory and in moderate distress. Vital signs are stable. The nurse performs a primary survey. What organ system is at greatest risk with this trajectory?",
    options: [
      "Hepatobiliary system — the liver extends into the right flank",
      "Right kidney — the trajectory passes through the retroperitoneal space",
      "Right lung — the wound may communicate with the pleural space",
      "Large bowel — the ascending colon occupies the right flank"
    ],
    correctAnswer: 1,
    rationaleLong: "A penetrating wound entering the right flank and exiting the right lower back traces a trajectory through the retroperitoneal space, placing the right kidney at greatest risk of injury. The kidneys are retroperitoneal organs located between the 12th thoracic and 3rd lumbar vertebrae, positioned in the posterior aspect of the abdominal cavity against the posterior body wall muscles (psoas and quadratus lumborum). A flank-to-back trajectory passes directly through this retroperitoneal space. Renal injuries from penetrating trauma are classified using the AAST (American Association for the Surgery of Trauma) organ injury scale from Grade I (contusion or subcapsular hematoma) to Grade V (completely shattered kidney or renal hilum avulsion). The fact that the patient is ambulatory and hemodynamically stable suggests the injury may be contained within the renal capsule or retroperitoneal space, which can tamponade hemorrhage effectively. However, stable vital signs do not rule out significant renal injury — delayed hemorrhage and urinoma formation are well-documented complications. The nurse should anticipate gross hematuria (present in approximately 80% of significant renal injuries), monitor for flank ecchymosis (Grey Turner's sign), and prepare for CT imaging with IV contrast and delayed images (to assess for urinary extravasation). While the liver, lung, and ascending colon could potentially be injured depending on the exact trajectory, the flank-to-back pathway most directly traverses the retroperitoneal space containing the kidney.",
    learningObjective: "Identify organ injury risk based on penetrating wound trajectory through anatomical spaces",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Flank-to-back penetrating wounds traverse the retroperitoneal space — think kidney first, then consider liver and bowel as secondary concerns",
    clinicalPearls: [
      "Kidneys are retroperitoneal organs vulnerable to flank penetrating injuries",
      "Hematuria is present in approximately 80% of significant renal injuries",
      "CT with IV contrast and delayed images assesses both vascular injury and urinary extravasation"
    ],
    safetyNote: "Retroperitoneal hemorrhage can be self-tamponading — stable vital signs do not rule out significant renal injury requiring serial monitoring",
    distractorRationales: [
      "The liver is primarily an intraperitoneal organ in the right upper quadrant — a flank-to-back trajectory is more posterior",
      "The right lung is above the trajectory described and would require entry above the 12th rib",
      "The ascending colon is more anterior than the kidney in the retroperitoneum"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A triage nurse in the ED is evaluating patients after a multi-vehicle highway collision. Which patient should be triaged as ESI Level 1 (most emergent)?",
    options: [
      "A 35-year-old with a closed forearm fracture, pain rated 8/10, and stable vital signs",
      "A 50-year-old with chest pain, diaphoresis, and a BP of 82/50 mmHg who is barely responsive",
      "A 28-year-old with a 3-cm forehead laceration, GCS 15, and stable vital signs",
      "A 42-year-old with bilateral lower leg abrasions and an ankle sprain"
    ],
    correctAnswer: 1,
    rationaleLong: "The Emergency Severity Index (ESI) is a five-level triage system used in emergency departments to prioritize patients based on acuity and resource needs. ESI Level 1 represents the most emergent patients who require immediate life-saving interventions. The 50-year-old patient presents with signs of cardiogenic shock or a massive acute coronary event: chest pain, diaphoresis, severe hypotension (BP 82/50), and altered mental status (barely responsive). This patient requires immediate intervention including cardiac monitoring, 12-lead ECG, IV access, vasopressor support, and potentially emergent cardiac catheterization or other resuscitative measures. Without immediate intervention, this patient is at imminent risk of cardiac arrest. ESI Level 1 criteria include: patients requiring immediate life-saving interventions, intubated patients, pulseless or apneic patients, and patients who are unresponsive or barely responsive. The patient with a closed forearm fracture (ESI Level 3 — stable with moderate resource needs), the forehead laceration (ESI Level 4 — one resource needed for suturing), and the abrasions with ankle sprain (ESI Level 5 — minimal resource needs) all have stable vital signs and do not meet ESI Level 1 criteria. Accurate triage is a critical emergency nursing competency that directly impacts patient outcomes — under-triage of critically ill patients delays life-saving care while over-triage of stable patients diverts resources from those in greater need.",
    learningObjective: "Apply the Emergency Severity Index triage system to prioritize patients based on acuity and resource needs",
    blueprintCategory: "Trauma",
    subtopic: "multi-system trauma",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Pain level alone does not determine triage priority — hemodynamic instability and altered mental status are the critical ESI Level 1 indicators",
    clinicalPearls: [
      "ESI Level 1: immediate life-saving intervention needed — intubated, pulseless, apneic, or unresponsive",
      "Hemodynamic instability with altered mental status = ESI Level 1 regardless of chief complaint",
      "Pain score does not determine ESI level — physiologic parameters take priority"
    ],
    safetyNote: "Under-triage of critically ill patients delays life-saving care — when in doubt, triage to a higher acuity level",
    distractorRationales: [
      "Closed forearm fracture with stable vital signs is ESI Level 3 — requires resources but no immediate life-saving intervention",
      "Forehead laceration with GCS 15 and stable vitals is ESI Level 4 — requires one resource for repair",
      "Bilateral abrasions and ankle sprain is ESI Level 5 — minimal resource needs"
    ],
    lessonPath: "/emergency/lessons/multi-system-trauma"
  },
  {
    stem: "A 7-year-old child presents to the ED after being struck by a car while riding a bicycle. The child weighs 25 kg. The Broselow tape indicates a pink zone. The child has a heart rate of 160 bpm and capillary refill of 4 seconds. Blood pressure is 75/45 mmHg. The nurse recognizes this child is in shock. What is the appropriate initial fluid bolus?",
    options: [
      "500 mL of normal saline over 20 minutes",
      "250 mL of normal saline over 15 minutes",
      "20 mL/kg (500 mL) of isotonic crystalloid as a rapid bolus",
      "10 mL/kg (250 mL) of isotonic crystalloid given slowly over 60 minutes"
    ],
    correctAnswer: 2,
    rationaleLong: "In pediatric trauma with signs of hemorrhagic shock, the standard initial fluid bolus is 20 mL/kg of isotonic crystalloid (normal saline or lactated Ringer's) given as a rapid bolus. For this 25 kg child, that equals 500 mL (25 kg x 20 mL/kg). The clinical findings confirm hemorrhagic shock: tachycardia (HR 160 — the normal range for a 7-year-old is 70-110 bpm), delayed capillary refill (greater than 2 seconds indicates poor perfusion), and hypotension (systolic BP of 75 mmHg — the lower limit of normal systolic BP for a child is calculated as 70 + (2 x age in years) = 70 + 14 = 84 mmHg, so 75 is below normal). Importantly, hypotension in children is a LATE finding of shock because children have remarkable compensatory mechanisms. By the time a child becomes hypotensive, they have typically lost 25-30% of their blood volume and are in decompensated shock. This makes the early recognition of compensated shock (tachycardia, delayed capillary refill, cool extremities, altered mental status) critically important in pediatric trauma. If the child does not respond to two 20 mL/kg crystalloid boluses (total 40 mL/kg), blood product transfusion should be initiated at 10 mL/kg of PRBCs. The Broselow tape is an excellent tool for weight-based medication dosing and equipment sizing in pediatric emergencies. The emergency nurse must be familiar with pediatric-specific vital sign ranges and resuscitation volumes to avoid under-resuscitation or over-resuscitation.",
    learningObjective: "Apply weight-based fluid resuscitation principles in pediatric hemorrhagic shock",
    blueprintCategory: "Trauma",
    subtopic: "pediatric trauma",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Hypotension in children is a LATE sign of shock — by the time BP drops, the child has lost 25-30% of blood volume and is in decompensated shock",
    clinicalPearls: [
      "Pediatric fluid bolus: 20 mL/kg of isotonic crystalloid given as a rapid bolus",
      "Minimum normal systolic BP in children: 70 + (2 x age in years) mmHg",
      "If no response to 40 mL/kg crystalloid, initiate blood products at 10 mL/kg PRBCs"
    ],
    safetyNote: "Recognize tachycardia and delayed capillary refill as early signs of pediatric shock — do not wait for hypotension to initiate resuscitation",
    distractorRationales: [
      "500 mL over 20 minutes is too slow for a child in decompensated hemorrhagic shock",
      "250 mL is only 10 mL/kg — this is half the recommended initial bolus volume",
      "10 mL/kg over 60 minutes is far too conservative for a hypotensive child in hemorrhagic shock"
    ],
    lessonPath: "/emergency/lessons/pediatric-trauma"
  },
  {
    stem: "A 70-year-old male on warfarin (INR 3.8) presents to the ED after a fall with a rapidly expanding intracranial hemorrhage on CT. His GCS is 10 and deteriorating. What is the most appropriate agent for emergent warfarin reversal?",
    options: [
      "Fresh frozen plasma (FFP) 4 units",
      "Vitamin K 10 mg IV alone",
      "4-factor prothrombin complex concentrate (4F-PCC) with vitamin K 10 mg IV",
      "Tranexamic acid (TXA) 1g IV"
    ],
    correctAnswer: 2,
    rationaleLong: "Emergent reversal of warfarin in the setting of life-threatening intracranial hemorrhage requires the fastest and most complete reversal strategy available. Four-factor prothrombin complex concentrate (4F-PCC, brand names Kcentra or Beriplex) is the preferred agent because it provides all four vitamin K-dependent clotting factors (II, VII, IX, X) as well as proteins C and S in a concentrated form that can be administered rapidly (as a fixed-dose infusion over 10-15 minutes). 4F-PCC reverses the INR within 10-30 minutes in most patients. It is combined with IV vitamin K 10 mg because 4F-PCC provides only transient reversal (factor half-lives range from 6-60 hours) while vitamin K promotes endogenous synthesis of clotting factors over 12-24 hours, preventing INR rebound. Fresh frozen plasma (FFP) was historically used but has significant disadvantages: it requires ABO typing, thawing (which takes 20-30 minutes), and large volumes (typically 4-6 units or 1000-1500 mL) that take considerable time to infuse and risk transfusion-related circulatory overload (TACO) and transfusion-related acute lung injury (TRALI), particularly in elderly patients. Studies have shown that 4F-PCC achieves more rapid and complete INR reversal than FFP. Vitamin K alone takes 12-24 hours to have effect and is insufficient as monotherapy for life-threatening hemorrhage. Tranexamic acid is an antifibrinolytic that prevents clot breakdown but does not reverse the coagulation factor deficiency caused by warfarin. The emergency nurse should prepare 4F-PCC (weight-based dosing per INR level), vitamin K 10 mg IV (infused slowly over 10 minutes to reduce anaphylaxis risk), and have the blood bank ready for additional products if needed.",
    learningObjective: "Apply appropriate emergent anticoagulation reversal strategy for warfarin-associated intracranial hemorrhage",
    blueprintCategory: "Trauma",
    subtopic: "traumatic brain injury",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "FFP requires thawing, ABO typing, and large volumes — 4F-PCC provides faster, more complete reversal with lower volume",
    clinicalPearls: [
      "4F-PCC reverses warfarin within 10-30 minutes with a small-volume infusion",
      "Always combine 4F-PCC with vitamin K to prevent INR rebound",
      "FFP is inferior to 4F-PCC for emergent warfarin reversal — slower onset, larger volume, higher complication rate"
    ],
    safetyNote: "Administer vitamin K IV slowly over 10+ minutes to reduce risk of anaphylactoid reaction — never give as a rapid IV push",
    distractorRationales: [
      "FFP requires ABO typing, thawing, and large volumes — it is slower and less effective than 4F-PCC",
      "Vitamin K alone takes 12-24 hours and is insufficient for life-threatening hemorrhage",
      "TXA prevents fibrinolysis but does not replace the clotting factors depleted by warfarin"
    ],
    lessonPath: "/emergency/lessons/traumatic-brain-injury"
  },
  {
    stem: "A nurse in the ED is managing a patient with a pelvic ring disruption from a motorcycle crash. The pelvis is mechanically unstable with lateral compression noted on physical exam. The patient is tachycardic at 130 bpm with BP 84/52 mmHg. What is the priority intervention for hemorrhage control?",
    options: [
      "Apply a pelvic binder at the level of the greater trochanters",
      "Place the patient in MAST (military anti-shock trousers)",
      "Apply bilateral lower extremity traction splints",
      "Position the patient in Trendelenburg to increase venous return"
    ],
    correctAnswer: 0,
    rationaleLong: "Pelvic ring disruptions can cause life-threatening hemorrhage because the pelvis contains a rich network of arterial and venous vessels, and an unstable pelvic fracture creates an enlarged pelvic volume that can accommodate massive blood loss (upwards of 3000-5000 mL in the retroperitoneal space). The priority intervention for hemorrhage control is application of a pelvic binder (or a sheet tied tightly in an emergency) at the level of the greater trochanters. The pelvic binder works by reducing the pelvic volume back toward anatomic position, which provides a tamponade effect on the bleeding vessels, reduces the fracture to promote bone-to-bone contact and clot formation, and decreases the overall volume available for hemorrhage. Proper placement is critical — the binder must be at the level of the greater trochanters, not at the iliac crests. Placement too high is a common error that fails to reduce the pelvic ring effectively. MAST (pneumatic anti-shock garment) is largely obsolete in modern trauma care due to complications including compartment syndrome and potential for worsening hemorrhage upon removal. Traction splints are indicated for femur fractures, not pelvic fractures — they can actually worsen pelvic ring displacement if applied to an unstable pelvis. Trendelenburg positioning has not been shown to improve hemodynamics and can impair respiratory function. The emergency nurse should apply the pelvic binder promptly while initiating fluid and blood product resuscitation, anticipating the need for angiographic embolization or preperitoneal packing if the patient remains unstable.",
    learningObjective: "Apply a pelvic binder correctly for hemorrhage control in unstable pelvic fractures",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The pelvic binder must be placed at the level of the greater trochanters, NOT the iliac crests — incorrect placement is ineffective",
    clinicalPearls: [
      "Pelvic fractures can hemorrhage 3000-5000 mL into the retroperitoneal space",
      "Pelvic binder placement: at the level of the greater trochanters, not the iliac crests",
      "The binder reduces pelvic volume, tamponades bleeding vessels, and promotes clot formation"
    ],
    safetyNote: "Do not remove a pelvic binder in the ED — removal should only occur in the OR with surgical team ready for hemorrhage control",
    distractorRationales: [
      "MAST is largely obsolete due to complications and is not first-line for pelvic hemorrhage",
      "Traction splints are for femur fractures and can worsen pelvic ring displacement",
      "Trendelenburg positioning has not been shown to improve hemodynamics and can impair breathing"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 34-year-old male presents to the ED with thermal burns after a workplace explosion. Burns are partial thickness to the entire right arm (9%), entire left arm (9%), and anterior trunk (18%). Using the Parkland formula, calculate the 24-hour fluid requirement for this 80 kg patient and determine the rate for the first 8 hours.",
    options: [
      "Total: 11,520 mL; First 8 hours: 720 mL/hr of lactated Ringer's",
      "Total: 5,760 mL; First 8 hours: 360 mL/hr of lactated Ringer's",
      "Total: 8,640 mL; First 8 hours: 540 mL/hr of lactated Ringer's",
      "Total: 2,880 mL; First 8 hours: 180 mL/hr of lactated Ringer's"
    ],
    correctAnswer: 0,
    rationaleLong: "The Parkland formula (Baxter formula) is the standard method for calculating fluid resuscitation requirements in burn patients during the first 24 hours: 4 mL x body weight (kg) x %TBSA burned. For this patient: 4 mL x 80 kg x 36% TBSA = 11,520 mL total over 24 hours. The TBSA calculation using the Rule of Nines: right arm (9%) + left arm (9%) + anterior trunk (18%) = 36% TBSA. The administration schedule is half of the total volume given in the first 8 hours from the time of injury (not from hospital arrival) and the remaining half over the next 16 hours. First 8 hours: 11,520 mL / 2 = 5,760 mL over 8 hours = 720 mL/hr. Remaining 16 hours: 5,760 mL over 16 hours = 360 mL/hr. The preferred fluid is lactated Ringer's solution (not normal saline) because it more closely approximates the electrolyte composition of extracellular fluid and produces less hyperchloremic metabolic acidosis compared to large-volume normal saline resuscitation. The emergency nurse must calculate the time of injury accurately because the 8-hour clock starts from the time of injury, not from ED arrival. If the patient arrives 2 hours after the burn, the first-period volume must be infused in the remaining 6 hours, requiring a higher rate. Fluid resuscitation should be titrated to urine output: 0.5-1.0 mL/kg/hr for adults and 1.0-2.0 mL/kg/hr for children. The Parkland formula is a starting estimate — the nurse must monitor urine output and titrate accordingly to avoid both under-resuscitation (organ failure) and over-resuscitation (pulmonary edema, abdominal compartment syndrome).",
    learningObjective: "Calculate burn fluid resuscitation requirements using the Parkland formula and implement appropriate fluid delivery schedules",
    blueprintCategory: "Trauma",
    subtopic: "burn injuries",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The 8-hour clock starts from the time of INJURY, not hospital arrival — arriving late to the ED means a higher initial infusion rate",
    clinicalPearls: [
      "Parkland formula: 4 mL x kg x %TBSA; half in first 8 hours, half in next 16 hours",
      "Preferred fluid is lactated Ringer's, not normal saline",
      "Titrate to urine output: 0.5-1.0 mL/kg/hr in adults"
    ],
    safetyNote: "Monitor for both under-resuscitation (renal failure, organ ischemia) and over-resuscitation (pulmonary edema, abdominal compartment syndrome)",
    distractorRationales: [
      "5,760 mL would be only half the calculated requirement using 2 mL/kg instead of 4 mL/kg",
      "8,640 mL uses 3 mL/kg instead of the standard 4 mL/kg",
      "2,880 mL uses 1 mL/kg which is far below the recommended resuscitation volume"
    ],
    lessonPath: "/emergency/lessons/burn-injuries"
  },
  {
    stem: "A 20-year-old football player is brought to the ED by athletic trainers after a tackle resulted in right shoulder pain and inability to move the arm. He is holding his right arm adducted and internally rotated. The shoulder appears squared off with a visible depression below the acromion. What should the nurse anticipate?",
    options: [
      "Acromioclavicular joint separation requiring surgical repair",
      "Anterior glenohumeral dislocation with potential axillary nerve injury",
      "Rotator cuff tear requiring MRI evaluation",
      "Humeral shaft fracture requiring emergent orthopedic consultation"
    ],
    correctAnswer: 1,
    rationaleLong: "The clinical presentation described is classic for an anterior glenohumeral (shoulder) dislocation: the arm held in adduction and internal rotation, the shoulder appearing squared-off (loss of the normal rounded deltoid contour), and a visible depression below the acromion where the humeral head has migrated anteriorly out of the glenoid fossa. Anterior dislocations account for approximately 95% of all shoulder dislocations and are common in young athletes following contact sports mechanisms. The most important associated injury to assess is axillary nerve damage, which occurs in approximately 5-35% of anterior shoulder dislocations. The axillary nerve wraps around the surgical neck of the humerus and is vulnerable to stretch injury when the humeral head displaces anteriorly. Assessment of axillary nerve function includes testing sensation over the lateral deltoid (the regimental badge area) and deltoid muscle strength (asking the patient to abduct against resistance if pain allows). The emergency nurse should obtain pre-reduction radiographs (AP and scapular Y or axillary views) to rule out associated fractures, perform and document a thorough neurovascular examination before any reduction attempt, prepare for procedural sedation, and have post-reduction radiographs ordered. Additional structures at risk include the brachial plexus, axillary artery (especially in older patients), and a Bankart lesion (labral tear) or Hill-Sachs lesion (impaction fracture of the posterolateral humeral head). AC joint separations present with pain at the AC joint with superior displacement of the clavicle, not the described pattern.",
    learningObjective: "Recognize the clinical presentation of anterior shoulder dislocation and assess for associated neurovascular injuries",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Always document axillary nerve function BEFORE reduction — post-procedure nerve deficits without pre-reduction documentation create medicolegal concerns",
    clinicalPearls: [
      "Anterior dislocations: arm in adduction/internal rotation, squared-off shoulder, depression below acromion",
      "Axillary nerve injury occurs in 5-35% of anterior dislocations — test regimental badge area sensation",
      "Obtain pre-reduction radiographs to rule out associated fractures before reduction attempt"
    ],
    safetyNote: "Document neurovascular examination both before and after reduction — axillary nerve and artery injuries must be identified early",
    distractorRationales: [
      "AC separation presents with AC joint tenderness and superior clavicular displacement, not the described pattern",
      "Rotator cuff tears present with weakness and pain but not the characteristic dislocation deformity",
      "Humeral shaft fractures present with mid-arm deformity and crepitus, not the shoulder contour changes described"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "An ED nurse receives a trauma patient who was ejected from a vehicle during a rollover crash. During the primary survey, the patient vomits a large volume of blood-tinged gastric contents. The patient is supine on a backboard with cervical collar in place. What is the immediate action?",
    options: [
      "Suction the oropharynx while maintaining cervical spine immobilization",
      "Log roll the patient to the lateral position while maintaining spinal alignment to clear the airway",
      "Remove the cervical collar to facilitate better suctioning access",
      "Proceed directly to rapid sequence intubation without clearing the emesis"
    ],
    correctAnswer: 1,
    rationaleLong: "When a trauma patient on a backboard with cervical immobilization vomits, the immediate priority is preventing aspiration while maintaining spinal precautions. The correct action is to log roll the entire patient (backboard and all) to the lateral position while maintaining spinal alignment. This allows gravity to clear the emesis from the airway. While suctioning is also important and should be performed simultaneously, suctioning alone in a supine patient who is actively vomiting may be insufficient to clear a large volume of emesis and prevent aspiration. The log roll technique requires a coordinated team effort — one person maintains inline cervical stabilization while others roll the patient's body as a unit to the lateral position. This maneuver can be performed with the patient still on the backboard by tilting the entire board. The key principle is that airway patency takes priority over spinal immobilization — if you must choose between the two, the airway always wins. However, in most situations, both can be maintained simultaneously with proper log roll technique. Removing the cervical collar is inappropriate as it removes cervical protection and the issue is not access for suctioning but rather the volume of emesis and the need for gravity drainage. Proceeding directly to intubation without clearing the emesis first creates a high risk of aspiration during laryngoscopy and may result in an obstructed view. Aspiration pneumonitis and aspiration pneumonia are significant causes of morbidity and mortality in trauma patients and can be largely prevented by proper airway management during emesis.",
    learningObjective: "Manage airway during emesis in a trauma patient with spinal precautions using the log roll technique",
    blueprintCategory: "Trauma",
    subtopic: "multi-system trauma",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Suctioning alone may be insufficient for large-volume emesis in a supine patient — log roll to lateral position provides gravity drainage while maintaining spinal alignment",
    clinicalPearls: [
      "Log roll the backboard to lateral position during emesis — gravity drainage plus suctioning is most effective",
      "Airway patency takes priority over spinal immobilization if you must choose",
      "Aspiration pneumonitis is a significant cause of morbidity in trauma patients"
    ],
    safetyNote: "Practice log roll technique regularly — the coordinated team maneuver must be smooth and efficient to prevent aspiration while maintaining spinal alignment",
    distractorRationales: [
      "Suctioning alone in a supine patient may be insufficient for large-volume emesis",
      "Removing the cervical collar removes spinal protection without improving the situation",
      "Intubating without clearing emesis first risks aspiration and obstructed laryngoscopic view"
    ],
    lessonPath: "/emergency/lessons/multi-system-trauma"
  },
  {
    stem: "A 48-year-old female presents to the ED after an assault. She has a Le Fort II midface fracture with extensive facial swelling and epistaxis. Her airway is currently patent but she is having difficulty managing her secretions. What is the nurse's greatest concern?",
    options: [
      "The cosmetic appearance of the facial fracture",
      "Progressive airway compromise from edema and posterior displacement of the maxilla",
      "The risk of meningitis from the fracture communicating with the cranial vault",
      "The need for immediate operative reduction of the fracture"
    ],
    correctAnswer: 1,
    rationaleLong: "Le Fort fractures are classified into three types based on the plane of fracture through the midface. Le Fort II (pyramidal fracture) involves a fracture through the maxilla in a pyramidal pattern from the nasal bridge through the orbital floor and across the pterygoid plates. The greatest immediate concern in the ED is progressive airway compromise. The fracture allows posterior displacement of the maxillary segment, which can push the soft palate posteriorly and obstruct the nasopharynx and oropharynx. Combined with the extensive facial edema that develops rapidly after these injuries and ongoing epistaxis (which contributes both blood and clot to the airway), the risk of complete airway obstruction is significant. The difficulty managing secretions described in this patient is an early warning sign that the airway is being progressively compromised. The nurse should prepare for potential intubation (likely a difficult airway given the facial anatomy disruption), position the patient sitting upright if spinal clearance allows (to reduce edema and facilitate drainage), have suction continuously available, and monitor for signs of increasing respiratory distress. Nasotracheal intubation is CONTRAINDICATED in Le Fort fractures due to the risk of intracranial passage through the cribriform plate disruption. While the risk of meningitis from CSF leak is a concern, it is not the immediate life threat. Cosmetic repair and definitive operative management are deferred until the patient is stabilized and swelling has peaked (typically 3-5 days after injury).",
    learningObjective: "Anticipate airway compromise in Le Fort midface fractures and prepare for difficult airway management",
    blueprintCategory: "Trauma",
    subtopic: "blunt trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Nasotracheal intubation is ABSOLUTELY CONTRAINDICATED in Le Fort fractures — risk of intracranial tube passage through the disrupted cribriform plate",
    clinicalPearls: [
      "Le Fort fractures allow posterior maxillary displacement causing progressive airway obstruction",
      "Nasotracheal intubation is contraindicated — use oral intubation or surgical airway",
      "Difficulty managing secretions is an early sign of progressive airway compromise"
    ],
    safetyNote: "Never attempt nasotracheal intubation or nasogastric tube insertion in patients with suspected midface fractures — the tube can pass intracranially",
    distractorRationales: [
      "Cosmetic concerns are not the immediate priority — airway management takes precedence",
      "While CSF leak and meningitis risk are valid long-term concerns, airway compromise is the immediate life threat",
      "Operative reduction is typically deferred 3-5 days until edema resolves — it is not an immediate ED concern"
    ],
    lessonPath: "/emergency/lessons/blunt-trauma"
  },
  {
    stem: "A 26-year-old male is brought to the ED after a stabbing. He has a wound to the left upper abdomen and is alert and oriented with HR 100 bpm and BP 116/72 mmHg. During your assessment, you note evisceration of a loop of small bowel through the wound. What is the appropriate management of the eviscerated bowel?",
    options: [
      "Gently push the bowel back into the abdominal cavity and apply a sterile occlusive dressing",
      "Cover the bowel with a sterile saline-moistened dressing, cover with an occlusive layer, and do not attempt to replace it",
      "Leave the bowel exposed to air and irrigate with povidone-iodine solution",
      "Apply direct pressure to the eviscerated bowel to reduce swelling before replacing it"
    ],
    correctAnswer: 1,
    rationaleLong: "Abdominal evisceration occurs when organs protrude through a traumatic wound in the abdominal wall. The management of eviscerated abdominal contents follows specific principles designed to prevent further injury, contamination, and ischemia of the exposed organ. The correct management is to cover the eviscerated bowel with a sterile saline-moistened dressing to keep the tissue moist and prevent desiccation, then cover this with a sterile occlusive layer (such as plastic wrap or a sterile drape) to maintain moisture and warmth. The eviscerated bowel must NOT be pushed back into the abdominal cavity for several critical reasons: (1) it may cause further injury to the bowel or mesentery, (2) it may introduce surface contaminants into the peritoneal cavity, (3) the evisceration may indicate a wound that is too small to accommodate the organ without causing ischemic compression, and (4) the bowel may have twisted or kinked during evisceration, and pushing it back could worsen the situation. The exposed bowel should never be left dry or exposed to air as this causes tissue desiccation and necrosis within minutes. Povidone-iodine is cytotoxic to exposed peritoneal surfaces and bowel serosa and should never be applied to eviscerated organs. Direct pressure on eviscerated bowel can cause mechanical injury and ischemia. The nurse should also keep the patient warm (evisceration leads to significant heat and fluid loss), establish large-bore IV access, prepare for emergent operative intervention, and keep the patient NPO. Definitive management requires surgical exploration and repair.",
    learningObjective: "Apply appropriate wound management principles for abdominal evisceration in penetrating trauma",
    blueprintCategory: "Trauma",
    subtopic: "abdominal trauma",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER push eviscerated bowel back into the abdomen — this can worsen injury, introduce contamination, and cause ischemia",
    clinicalPearls: [
      "Cover evisceration with saline-moistened sterile dressing + occlusive layer",
      "Never replace eviscerated organs in the ED — only in the operating room under controlled conditions",
      "Desiccation of exposed bowel leads to necrosis within minutes — keep tissue moist"
    ],
    safetyNote: "Do not apply antiseptics (betadine, alcohol) to eviscerated organs — they are cytotoxic to exposed peritoneal surfaces",
    distractorRationales: [
      "Pushing bowel back in can cause further injury, introduce contamination, and create ischemic compression",
      "Leaving bowel exposed to air causes rapid desiccation and tissue necrosis",
      "Direct pressure on eviscerated bowel causes mechanical injury and can compromise blood supply"
    ],
    lessonPath: "/emergency/lessons/abdominal-trauma"
  },
  {
    stem: "A 55-year-old male presents to the ED with bilateral lower extremity weakness and loss of pain and temperature sensation below the umbilicus after a T10 burst fracture from a fall. He has preserved proprioception and vibration sense. This incomplete spinal cord injury pattern is consistent with:",
    options: [
      "Posterior cord syndrome",
      "Anterior cord syndrome",
      "Central cord syndrome",
      "Complete spinal cord transection"
    ],
    correctAnswer: 1,
    rationaleLong: "Anterior cord syndrome results from damage to the anterior two-thirds of the spinal cord, typically from disruption of the anterior spinal artery or direct compression by bone fragments or disc herniation. The anterior spinal cord contains the corticospinal tracts (motor function), the spinothalamic tracts (pain and temperature sensation), and the lateral columns. The posterior columns, which carry proprioception, vibration, and light touch, are preserved because they are supplied by the posterior spinal arteries and are physically spared from the anterior compression or ischemia. This patient's presentation perfectly matches anterior cord syndrome: bilateral motor weakness below the level of injury (corticospinal tract damage), loss of pain and temperature sensation (spinothalamic tract damage), but preserved proprioception and vibration (intact posterior columns). Anterior cord syndrome has the worst prognosis of the incomplete spinal cord injuries, with only approximately 10-20% of patients regaining functional motor recovery. It is commonly caused by burst fractures (as in this case), anterior cord compression from retropulsed bone fragments, and anterior spinal artery thrombosis. Central cord syndrome preferentially affects the upper extremities more than the lower extremities. Posterior cord syndrome is extremely rare and would present with loss of proprioception and vibration with preserved motor function and pain/temperature sensation — the opposite of this presentation. Complete transection would result in total loss of all modalities below the level of injury with no preservation of any function.",
    learningObjective: "Differentiate anterior cord syndrome from other incomplete spinal cord injuries based on preserved and lost neurological functions",
    blueprintCategory: "Trauma",
    subtopic: "spinal cord injury",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Anterior cord syndrome preserves POSTERIOR column functions (proprioception, vibration) while losing ANTERIOR functions (motor, pain/temperature) — remember the anatomy",
    clinicalPearls: [
      "Anterior cord syndrome: loss of motor + pain/temperature with preserved proprioception/vibration",
      "Worst prognosis of incomplete SCIs — only 10-20% regain functional motor recovery",
      "Commonly caused by burst fractures and anterior spinal artery occlusion"
    ],
    safetyNote: "Document detailed neurological examination including specific modalities to accurately classify the spinal cord injury syndrome for prognostication and management",
    distractorRationales: [
      "Posterior cord syndrome would lose proprioception/vibration with preserved motor and pain/temperature — opposite of this presentation",
      "Central cord syndrome preferentially affects upper extremities more than lower extremities",
      "Complete transection would result in total loss of ALL neurological function below the injury level"
    ],
    lessonPath: "/emergency/lessons/spinal-cord-injury"
  },
  {
    stem: "A 3-year-old child weighing 15 kg presents to the ED with partial-thickness scald burns to the anterior trunk and both anterior legs after pulling a pot of boiling water off the stove. Using the pediatric-modified Lund-Browder chart, the TBSA is estimated at 25%. What is the initial fluid resuscitation rate using the Parkland formula?",
    options: [
      "94 mL/hr of lactated Ringer's for the first 8 hours",
      "188 mL/hr of lactated Ringer's for the first 8 hours",
      "375 mL/hr of lactated Ringer's for the first 8 hours",
      "47 mL/hr of lactated Ringer's for the first 8 hours"
    ],
    correctAnswer: 0,
    rationaleLong: "Using the Parkland formula for pediatric burn resuscitation: 4 mL x body weight (kg) x %TBSA = 4 x 15 x 25 = 1,500 mL total over 24 hours. Half of this total (750 mL) is given in the first 8 hours from the time of injury: 750 mL / 8 hours = approximately 94 mL/hr. The remaining 750 mL is given over the next 16 hours at approximately 47 mL/hr. In pediatric burn resuscitation, there is an important additional consideration: children under 30 kg require maintenance fluids IN ADDITION to the Parkland formula resuscitation volume because children have higher metabolic rates and lower glycogen reserves. The maintenance fluid should contain dextrose (typically D5LR or D5 1/2NS) calculated using the 4-2-1 rule: 4 mL/kg/hr for the first 10 kg + 2 mL/kg/hr for the next 10 kg = 40 + 10 = 50 mL/hr maintenance for this 15 kg child. The resuscitation fluid (LR without dextrose) runs separately from the maintenance fluid. The target urine output for pediatric burn resuscitation is 1.0-2.0 mL/kg/hr, which is higher than the adult target of 0.5-1.0 mL/kg/hr. The Lund-Browder chart is preferred over the Rule of Nines in pediatric patients because children have proportionally larger heads and smaller extremities compared to adults, making the standard Rule of Nines inaccurate for pediatric TBSA estimation. The nurse must ensure a Foley catheter is placed for accurate urine output monitoring and adjust fluid rates based on hourly urine output.",
    learningObjective: "Calculate pediatric burn fluid resuscitation using the Parkland formula and understand the need for additional maintenance fluids in children",
    blueprintCategory: "Trauma",
    subtopic: "pediatric trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Children under 30 kg require maintenance fluids WITH dextrose IN ADDITION to Parkland formula resuscitation fluids — failure to provide maintenance glucose can cause hypoglycemia",
    clinicalPearls: [
      "Pediatric Parkland formula: 4 mL x kg x %TBSA plus separate maintenance fluids with dextrose",
      "Target pediatric urine output: 1.0-2.0 mL/kg/hr (higher than adult target)",
      "Use Lund-Browder chart instead of Rule of Nines for pediatric TBSA estimation"
    ],
    safetyNote: "Monitor blood glucose frequently in pediatric burn patients — children are prone to hypoglycemia due to limited glycogen reserves and high metabolic demand",
    distractorRationales: [
      "188 mL/hr represents the total 1,500 mL given over only 8 hours instead of the correct 750 mL over 8 hours",
      "375 mL/hr uses 8 mL/kg instead of the standard 4 mL/kg",
      "47 mL/hr represents the 16-hour rate for the second half, not the initial 8-hour rate"
    ],
    lessonPath: "/emergency/lessons/pediatric-trauma"
  },
  {
    stem: "A 62-year-old male with a history of chronic alcoholism presents to the ED after a fall. CT head reveals bilateral chronic subdural hematomas with acute-on-chronic bleeding. The nurse should understand which factor makes this patient population especially susceptible to subdural hematomas?",
    options: [
      "Elevated INR from liver disease causing coagulopathy",
      "Cerebral atrophy from chronic alcoholism stretching the bridging veins and making them vulnerable to rupture",
      "Thrombocytopenia from alcohol-induced bone marrow suppression",
      "Hypertension from alcohol withdrawal causing vessel rupture"
    ],
    correctAnswer: 1,
    rationaleLong: "Chronic alcoholism causes cerebral atrophy through direct neurotoxic effects of alcohol on brain tissue. As the brain volume decreases with atrophy, the subdural space (between the dura mater and the arachnoid mater) enlarges. The bridging veins that traverse this space from the cerebral cortex to the dural sinuses become stretched across a greater distance. These elongated bridging veins are under tension and are extremely vulnerable to rupture from even minimal trauma — forces that would not cause bleeding in a patient with normal brain volume can cause subdural hemorrhage in patients with cerebral atrophy. This is why chronic alcoholics can develop significant subdural hematomas from seemingly trivial mechanisms such as a ground-level fall, bumping their head on a cabinet, or even from coughing or straining. The bilateral nature of the subdural hematomas in this patient is characteristic — with diffuse cerebral atrophy, the bridging veins are vulnerable bilaterally. The chronic component indicates previous bleeding episodes that may have been asymptomatic, while the acute component represents new bleeding from the current injury. While the other options contain elements of truth (alcoholics may have elevated INR from liver disease, thrombocytopenia from marrow suppression, and withdrawal-related hypertension), the primary structural predisposition is the cerebral atrophy with stretched bridging veins. This is the same mechanism that makes elderly patients with age-related cerebral atrophy susceptible to subdural hematomas.",
    learningObjective: "Understand the pathophysiology of subdural hematoma susceptibility in patients with cerebral atrophy",
    blueprintCategory: "Trauma",
    subtopic: "traumatic brain injury",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Cerebral atrophy stretches bridging veins, making them vulnerable to rupture from minimal trauma — this explains bilateral chronic subdural hematomas in alcoholics and elderly patients",
    clinicalPearls: [
      "Cerebral atrophy stretches bridging veins across an enlarged subdural space",
      "Chronic subdural hematomas can develop from trivial mechanisms in patients with atrophy",
      "Bilateral chronic subdurals are characteristic of cerebral atrophy from any cause"
    ],
    safetyNote: "Maintain a high index of suspicion for subdural hematoma in chronic alcoholics and elderly patients even with seemingly minor head trauma mechanisms",
    distractorRationales: [
      "Coagulopathy from liver disease contributes to bleeding risk but is not the primary structural predisposition",
      "Thrombocytopenia contributes to bleeding tendency but does not explain the specific vulnerability of bridging veins",
      "Alcohol withdrawal hypertension may worsen existing bleeding but is not the primary susceptibility factor"
    ],
    lessonPath: "/emergency/lessons/traumatic-brain-injury"
  },
  {
    stem: "A nurse is assessing a trauma patient who develops compartment syndrome of the right lower leg after a tibial fracture. Which finding is the EARLIEST clinical indicator?",
    options: [
      "Absent distal pulses (pulselessness)",
      "Pain disproportionate to the injury that worsens with passive stretch of the toes",
      "Complete paralysis of the foot and toes",
      "Pale, cool, cyanotic skin of the affected extremity"
    ],
    correctAnswer: 1,
    rationaleLong: "Compartment syndrome occurs when pressure within a closed fascial compartment rises to a level that compromises blood flow to the tissues within that compartment. The earliest and most reliable clinical indicator is pain that is disproportionate to the injury — particularly pain that increases with passive stretch of the muscles within the affected compartment. For the anterior compartment of the lower leg, this means pain that worsens when the toes are passively flexed (which stretches the anterior compartment muscles: tibialis anterior, extensor digitorum longus, extensor hallucis longus). The classic teaching uses the 6 Ps of compartment syndrome: Pain (disproportionate and with passive stretch), Pressure (tense compartment on palpation), Paresthesia, Paralysis, Pallor, and Pulselessness. However, it is critical to understand that these are NOT equal in timing — they represent a progression from early to late findings. Pain with passive stretch and pain disproportionate to injury are the earliest findings. Paresthesia develops next as nerve ischemia begins. Paralysis indicates advanced muscle and nerve ischemia. Pallor and pulselessness are LATE findings that indicate the compartment pressure has exceeded arterial pressure — by this time, irreversible tissue damage has likely occurred. Waiting for absent pulses to diagnose compartment syndrome means the diagnosis has been dangerously delayed. Compartment pressures greater than 30 mmHg or within 30 mmHg of the diastolic blood pressure (delta-P) are indications for emergent fasciotomy. The emergency nurse must recognize pain with passive stretch as the earliest warning and advocate for compartment pressure measurement.",
    learningObjective: "Identify the earliest clinical indicators of compartment syndrome and understand the progression of the 6 Ps",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Pulselessness is a LATE finding of compartment syndrome — do not wait for absent pulses to make the diagnosis",
    clinicalPearls: [
      "Pain disproportionate to injury with passive stretch is the EARLIEST indicator of compartment syndrome",
      "The 6 Ps progress from early to late: Pain, Pressure, Paresthesia, Paralysis, Pallor, Pulselessness",
      "Fasciotomy is indicated when compartment pressure is within 30 mmHg of diastolic pressure (delta-P)"
    ],
    safetyNote: "Advocate for compartment pressure measurement when pain with passive stretch is present — irreversible muscle damage begins within 6 hours of ischemia",
    distractorRationales: [
      "Absent distal pulses is a LATE finding indicating advanced compartment syndrome — diagnosis should be made much earlier",
      "Complete paralysis indicates advanced ischemic nerve damage — the diagnosis should have been made before paralysis develops",
      "Pallor and cyanosis are late findings that suggest the compartment pressure has exceeded perfusion pressure"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 42-year-old female is found down after being assaulted. She has extensive facial trauma with bilateral periorbital ecchymosis (raccoon eyes), mastoid ecchymosis (Battle's sign), and clear fluid draining from her right ear. These findings suggest:",
    options: [
      "Isolated facial fractures requiring maxillofacial surgery",
      "Basilar skull fracture with potential CSF otorrhea",
      "Orbital blowout fractures bilaterally",
      "Temporomandibular joint dislocation with parotid gland injury"
    ],
    correctAnswer: 1,
    rationaleLong: "The triad of bilateral periorbital ecchymosis (raccoon eyes), mastoid ecchymosis (Battle's sign), and clear fluid draining from the ear (otorrhea) is pathognomonic for a basilar skull fracture. Basilar skull fractures occur along the base of the skull and can involve the anterior fossa (causing raccoon eyes and CSF rhinorrhea), middle fossa (causing Battle's sign and CSF otorrhea), or posterior fossa. Raccoon eyes result from blood tracking along tissue planes from the fracture site to the periorbital tissues. Battle's sign results from blood tracking behind the mastoid process from a temporal bone fracture. The clear fluid from the ear is highly suspicious for cerebrospinal fluid (CSF) otorrhea, which occurs when the fracture disrupts the dura mater and creates a communication between the subarachnoid space and the ear canal (through the middle ear). CSF otorrhea can be confirmed by testing the fluid for the presence of beta-2 transferrin (highly specific for CSF) or by observing a halo sign (clear ring around a central blood spot on gauze). The clinical significance of basilar skull fracture with CSF leak includes: high risk of meningitis from bacteria ascending through the dural defect, absolute contraindication to nasogastric tube and nasotracheal intubation (which could pass intracranially), and the need for close monitoring of the CSF leak, which often resolves spontaneously within 7-10 days but may require surgical repair if persistent. The emergency nurse must avoid inserting anything through the nose, keep the head of bed elevated, and monitor for signs of meningitis.",
    learningObjective: "Recognize the clinical signs of basilar skull fracture and understand the implications for patient management",
    blueprintCategory: "Trauma",
    subtopic: "traumatic brain injury",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Raccoon eyes + Battle's sign + CSF otorrhea = basilar skull fracture. NEVER insert anything through the nose in these patients",
    clinicalPearls: [
      "Raccoon eyes = anterior fossa fracture; Battle's sign = middle fossa fracture",
      "CSF confirmed by beta-2 transferrin testing or halo sign on gauze",
      "Most CSF leaks resolve spontaneously within 7-10 days"
    ],
    safetyNote: "Absolute contraindications in basilar skull fracture: nasogastric tubes, nasotracheal intubation, nasal packing — all can pass intracranially",
    distractorRationales: [
      "Isolated facial fractures do not cause Battle's sign or CSF otorrhea",
      "Orbital blowout fractures cause periorbital ecchymosis but not Battle's sign or ear drainage",
      "TMJ dislocation presents with inability to close the mouth, not ecchymosis and CSF leak"
    ],
    lessonPath: "/emergency/lessons/traumatic-brain-injury"
  },
  {
    stem: "A 31-year-old male presents to the ED with a high-voltage electrical burn after contacting a downed power line. He has entrance and exit wounds on his right hand and left foot respectively. His ECG shows sinus tachycardia at 112 bpm. The nurse should prioritize which assessment?",
    options: [
      "Assessing the TBSA of the skin burns using the Rule of Nines",
      "Continuous cardiac monitoring for at least 24 hours and monitoring for rhabdomyolysis with serial CK and urine myoglobin",
      "Applying topical silver sulfadiazine to the entrance and exit wounds",
      "Obtaining a dermatology consultation for wound care"
    ],
    correctAnswer: 1,
    rationaleLong: "High-voltage electrical injuries (greater than 1000 volts) cause injuries that are fundamentally different from thermal burns, and the visible skin damage grossly underrepresents the extent of internal tissue destruction. Electric current follows the path of least resistance through the body, preferentially traveling through nerves, blood vessels, and muscles (which have low resistance) rather than through skin, bone, and fat (which have high resistance). This means that between the entrance wound (right hand) and exit wound (left foot), the current has traversed the entire body, potentially causing extensive internal muscle necrosis (rhabdomyolysis), cardiac dysrhythmias (the heart is directly in the current pathway from right hand to left foot), vascular damage with delayed thrombosis, and nerve injury. The priority assessment includes continuous cardiac monitoring for a minimum of 24 hours because electrical injuries can cause delayed cardiac dysrhythmias including ventricular fibrillation, ventricular tachycardia, and atrial fibrillation. The sinus tachycardia seen on initial ECG may progress to more dangerous rhythms. Simultaneously, monitoring for rhabdomyolysis is critical: as the damaged muscle releases myoglobin, creatine kinase (CK), and potassium into the bloodstream, the patient is at risk for acute renal failure from myoglobin precipitating in the renal tubules, hyperkalemia causing cardiac arrest, and metabolic acidosis. Serial CK levels, urine myoglobin, and urine output monitoring guide the aggressive IV hydration needed to prevent renal failure (target urine output 1-2 mL/kg/hr). Skin TBSA assessment is misleading in electrical burns because internal damage far exceeds surface burns.",
    learningObjective: "Understand the unique pathophysiology of high-voltage electrical burns and prioritize cardiac monitoring and rhabdomyolysis surveillance",
    blueprintCategory: "Trauma",
    subtopic: "burn injuries",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "The visible skin burns in electrical injuries GROSSLY underrepresent internal tissue damage — TBSA is misleading and should not guide resuscitation",
    clinicalPearls: [
      "Electrical current travels through low-resistance tissues: nerves, vessels, muscles — causing internal destruction not visible externally",
      "Cardiac monitoring for minimum 24 hours — delayed dysrhythmias are well-documented",
      "Rhabdomyolysis management: aggressive IV hydration targeting urine output 1-2 mL/kg/hr"
    ],
    safetyNote: "A hand-to-foot current pathway means electricity has traversed the heart — cardiac monitoring is mandatory regardless of initial ECG findings",
    distractorRationales: [
      "TBSA assessment using Rule of Nines is misleading in electrical burns — internal damage far exceeds visible skin injury",
      "Topical wound care is secondary to the life-threatening systemic complications",
      "Dermatology consultation is not the priority — cardiac and renal complications are the immediate threats"
    ],
    lessonPath: "/emergency/lessons/burn-injuries"
  },
  {
    stem: "A nurse in the ED is caring for a 75-year-old female who fell and hit her head on concrete. She takes apixaban (Eliquis) 5mg twice daily. She had a normal initial CT head 3 hours ago but is now developing increasing confusion and unilateral weakness. What should the nurse do?",
    options: [
      "Reassess vital signs and wait for the scheduled 6-hour re-evaluation",
      "Obtain an immediate repeat CT head and notify the physician of clinical deterioration indicating possible delayed intracranial hemorrhage",
      "Administer a dose of apixaban since the patient may have missed her scheduled dose",
      "Attribute the confusion to age-related delirium from the ED environment"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is demonstrating clinical deterioration consistent with delayed intracranial hemorrhage despite a normal initial CT scan. In anticoagulated patients (apixaban is a direct oral anticoagulant that inhibits factor Xa), the risk of delayed hemorrhage is well-documented. Apixaban impairs the clotting cascade, meaning that small vessels disrupted by trauma may continue to bleed slowly, accumulating hemorrhage that was not yet visible on the initial CT scan. The development of new confusion (indicating altered cerebral function) and unilateral weakness (indicating focal neurological deficit consistent with intracranial mass effect) demands immediate repeat CT imaging and physician notification. This is a time-critical situation — if an expanding hematoma is identified, emergent reversal of anticoagulation with andexanet alfa (the specific reversal agent for factor Xa inhibitors) or 4-factor PCC, and possible neurosurgical intervention may be needed. Waiting for a scheduled re-evaluation would be dangerous as the hemorrhage may expand rapidly to cause herniation and death. The nurse should never administer additional anticoagulant medication in a patient with suspected intracranial hemorrhage — this would worsen the bleeding. Attributing the neurological changes to age-related delirium without ruling out a structural cause is a dangerous cognitive error known as premature diagnostic closure. Any change in neurological status in an anticoagulated head trauma patient must be assumed to be hemorrhage until proven otherwise.",
    learningObjective: "Recognize delayed intracranial hemorrhage in anticoagulated patients and advocate for immediate repeat imaging when neurological changes occur",
    blueprintCategory: "Trauma",
    subtopic: "geriatric trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "A normal initial CT does NOT rule out delayed hemorrhage in anticoagulated patients — any neurological change demands immediate repeat imaging",
    clinicalPearls: [
      "Delayed intracranial hemorrhage can occur despite a normal initial CT in anticoagulated patients",
      "New confusion + focal neurological deficit in head trauma = repeat CT immediately",
      "Andexanet alfa is the specific reversal agent for factor Xa inhibitors (apixaban, rivaroxaban)"
    ],
    safetyNote: "Never dismiss neurological changes in anticoagulated head trauma patients as delirium or age-related — always rule out structural causes first",
    distractorRationales: [
      "Waiting for scheduled re-evaluation is dangerous when acute clinical deterioration is occurring",
      "Administering additional anticoagulant in suspected intracranial hemorrhage would be fatal",
      "Attributing focal neurological deficits to delirium without imaging is premature diagnostic closure"
    ],
    lessonPath: "/emergency/lessons/geriatric-trauma"
  },
  {
    stem: "During a mass casualty incident involving a building collapse, the ED charge nurse is implementing START triage. A patient is found with spontaneous respirations of 28/min, radial pulse present, and follows simple commands. What triage category should this patient receive?",
    options: [
      "Green (Minor/Walking Wounded)",
      "Yellow (Delayed)",
      "Red (Immediate)",
      "Black (Expectant/Deceased)"
    ],
    correctAnswer: 1,
    rationaleLong: "The START (Simple Triage and Rapid Treatment) system is a field triage algorithm used during mass casualty incidents (MCIs) to rapidly categorize patients into four priority levels. The algorithm follows a systematic decision tree: First, can the patient walk? If yes, they are categorized as Green (Minor). If no, assess respirations. If not breathing after repositioning the airway, they are Black (Expectant/Deceased). If breathing, assess respiratory rate. If the respiratory rate is greater than 30/min, categorize as Red (Immediate). If respiratory rate is less than 30/min, assess perfusion — check radial pulse or capillary refill. If no radial pulse or capillary refill greater than 2 seconds, categorize as Red (Immediate). If radial pulse is present and capillary refill is less than 2 seconds, assess mental status — can the patient follow simple commands? If no, categorize as Red (Immediate). If yes, categorize as Yellow (Delayed). In this scenario: the patient cannot walk (not mentioned as ambulatory), has spontaneous respirations at 28/min (less than 30, so proceed to next step), has a radial pulse present (perfusion adequate, proceed to next step), and follows simple commands (mental status intact). Therefore, this patient is categorized as Yellow (Delayed) — they have non-life-threatening injuries that can tolerate delayed treatment while immediate resources are directed to Red category patients. The emergency nurse must understand and apply START triage efficiently during MCIs because rapid, accurate triage directly impacts resource allocation and patient outcomes when the number of casualties exceeds available resources.",
    learningObjective: "Apply the START triage algorithm during mass casualty incidents to appropriately categorize patients",
    blueprintCategory: "Trauma",
    subtopic: "multi-system trauma",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The START algorithm threshold for respiratory rate is 30/min — rates above 30 are categorized as Immediate (Red) regardless of other findings",
    clinicalPearls: [
      "START triage flow: Walking? -> Respirations? -> Respiratory rate? -> Perfusion? -> Mental status?",
      "RR greater than 30 = Red; No radial pulse = Red; Cannot follow commands = Red",
      "Yellow category: RR less than 30, radial pulse present, follows commands but cannot walk"
    ],
    safetyNote: "START triage should take no more than 30-60 seconds per patient — prolonged assessments during MCIs delay care for all patients",
    distractorRationales: [
      "Green requires the ability to walk — this patient's ambulatory status is not confirmed",
      "Red requires at least one critical finding: RR greater than 30, absent radial pulse, or inability to follow commands — none are present",
      "Black is for non-breathing patients who do not begin breathing after airway repositioning"
    ],
    lessonPath: "/emergency/lessons/multi-system-trauma"
  },
  {
    stem: "A 40-year-old male arrives to the ED with a traumatic above-knee amputation of his right leg from a farming accident. The amputated limb has been recovered. What is the correct method for preserving the amputated part during transport to the receiving trauma center?",
    options: [
      "Place the amputated part directly on ice in a plastic bag to maximize cooling",
      "Wrap the amputated part in saline-moistened sterile gauze, place in a sealed plastic bag, then place the bag on ice",
      "Submerge the amputated part in a container of sterile saline solution kept at room temperature",
      "Apply a tourniquet to the proximal end of the amputated part and wrap in dry sterile gauze"
    ],
    correctAnswer: 1,
    rationaleLong: "Proper preservation of an amputated part maximizes the chance of successful reimplantation. The correct method follows a layered approach: first, the amputated part is gently rinsed with sterile normal saline to remove gross contamination, then wrapped in saline-moistened sterile gauze to keep the tissues hydrated. The wrapped part is placed in a sealed plastic bag to create a moisture barrier. This sealed bag is then placed on ice (in a container with ice and water) to provide indirect cooling. The indirect cooling is critical — the amputated part should NEVER be placed directly on ice or submerged in water. Direct contact with ice causes tissue freezing (frostbite injury to the amputated part), which destroys cells through ice crystal formation and renders the part non-viable for reimplantation. Similarly, submerging in water or saline causes tissue maceration and cellular swelling through osmotic effects. The goal is to cool the tissue to approximately 4 degrees Celsius (39 degrees Fahrenheit) without freezing. At this temperature, the metabolic demands of the tissue are reduced, extending the window for successful reimplantation. Cool ischemia time for amputated parts is approximately 12-24 hours for digits and 6-8 hours for major limbs. Warm ischemia time (without cooling) is dramatically shorter: only 4-6 hours for digits and 4 hours for limbs. The emergency nurse must also manage the patient's stump: control hemorrhage (tourniquet if needed), prevent contamination with sterile dressings, manage pain, and initiate fluid and blood product resuscitation as indicated.",
    learningObjective: "Apply correct preservation techniques for amputated parts to maximize reimplantation viability",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER place an amputated part directly on ice — tissue freezing from direct ice contact destroys cells and prevents reimplantation",
    clinicalPearls: [
      "Preservation: saline-moistened gauze, sealed bag, then on ice (indirect cooling)",
      "Cool ischemia time: 12-24 hours for digits, 6-8 hours for major limbs",
      "Target tissue temperature approximately 4 degrees C without freezing"
    ],
    safetyNote: "Direct ice contact causes frostbite injury to amputated parts — always use indirect cooling through a barrier layer",
    distractorRationales: [
      "Direct ice contact causes tissue freezing and cellular destruction from ice crystal formation",
      "Submersion in saline causes tissue maceration and cellular swelling from osmotic effects",
      "Applying a tourniquet to an amputated part serves no purpose and dry gauze allows tissue desiccation"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 58-year-old male presents to the ED with bilateral lower extremity paralysis after a T4 vertebral burst fracture. His blood pressure is 82/48 mmHg with a heart rate of 52 bpm. He is warm and well-perfused peripherally. This hemodynamic pattern is consistent with:",
    options: [
      "Hemorrhagic shock from internal bleeding",
      "Cardiogenic shock from myocardial contusion",
      "Neurogenic shock from loss of sympathetic tone",
      "Septic shock from an infectious source"
    ],
    correctAnswer: 2,
    rationaleLong: "This patient's hemodynamic presentation of hypotension with bradycardia and warm, well-perfused periphery in the setting of a high thoracic spinal cord injury is the classic triad of neurogenic shock. Neurogenic shock results from disruption of the sympathetic nervous system pathways that originate from the thoracolumbar spine (T1-L2). A T4 burst fracture with bilateral lower extremity paralysis indicates a high spinal cord injury that has disrupted the sympathetic outflow below the level of injury. The loss of sympathetic tone causes three physiologic effects: vasodilation of the peripheral vasculature (reducing systemic vascular resistance and causing hypotension), unopposed vagal (parasympathetic) tone to the heart (causing bradycardia), and loss of the sympathetic-mediated catecholamine response (preventing the normal tachycardic response to hypotension). This creates the distinctive hemodynamic pattern: hypotension with bradycardia — the opposite of hemorrhagic shock, which presents with hypotension and tachycardia. The warm, well-perfused periphery results from the loss of sympathetic vasoconstriction, which contrasts with hemorrhagic shock where peripheral vasoconstriction causes cool, pale, diaphoretic skin. Treatment of neurogenic shock includes IV fluid resuscitation as first-line therapy, vasopressor support with alpha-1 agonists (phenylephrine or norepinephrine) to restore vascular tone, and atropine or chronotropic agents for symptomatic bradycardia. The emergency nurse must also carefully differentiate neurogenic shock from hemorrhagic shock, as trauma patients may have both simultaneously — a high spinal cord injury does not preclude concurrent internal bleeding.",
    learningObjective: "Differentiate neurogenic shock from hemorrhagic shock based on hemodynamic parameters in spinal cord injury patients",
    blueprintCategory: "Trauma",
    subtopic: "spinal cord injury",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Neurogenic shock causes hypotension with BRADYCARDIA — hemorrhagic shock causes hypotension with TACHYCARDIA. This distinction is critical in trauma patients",
    clinicalPearls: [
      "Neurogenic shock triad: hypotension + bradycardia + warm periphery (loss of sympathetic tone)",
      "Hemorrhagic shock: hypotension + tachycardia + cool periphery (sympathetic activation)",
      "Trauma patients can have BOTH neurogenic and hemorrhagic shock simultaneously"
    ],
    safetyNote: "Always rule out concurrent hemorrhagic shock in spinal cord injury patients — neurogenic shock alone may mask ongoing hemorrhage",
    distractorRationales: [
      "Hemorrhagic shock presents with tachycardia and cool, pale, diaphoretic skin — not bradycardia with warm periphery",
      "Cardiogenic shock typically presents with tachycardia, JVD, and pulmonary edema — not isolated bradycardia with warm extremities",
      "Septic shock early phase may have warm periphery but includes tachycardia and fever, not bradycardia"
    ],
    lessonPath: "/emergency/lessons/spinal-cord-injury"
  },
  {
    stem: "A 22-year-old female presents to the ED after a rollover ATV crash wearing no helmet. She opens eyes to pain, makes incomprehensible sounds, and has abnormal flexion to painful stimuli. What is her Glasgow Coma Scale score?",
    options: [
      "GCS 5",
      "GCS 7",
      "GCS 8",
      "GCS 9"
    ],
    correctAnswer: 1,
    rationaleLong: "The Glasgow Coma Scale (GCS) is the standardized assessment tool for evaluating level of consciousness in trauma patients. It has three components: Eye Opening (E), Verbal Response (V), and Motor Response (M). Each component is scored independently and then summed for a total score ranging from 3 (worst) to 15 (best). For this patient: Eye Opening — opens eyes to pain = E2 (the scale is: 4=Spontaneous, 3=To voice/command, 2=To pain, 1=None). Verbal Response — incomprehensible sounds = V2 (the scale is: 5=Oriented, 4=Confused, 3=Inappropriate words, 2=Incomprehensible sounds, 1=None). Motor Response — abnormal flexion to pain = M3 (the scale is: 6=Obeys commands, 5=Localizes pain, 4=Withdrawal/Normal flexion, 3=Abnormal flexion/Decorticate, 2=Extension/Decerebrate, 1=None). Total GCS = E2 + V2 + M3 = 7. This score is clinically significant because a GCS of 8 or less defines severe traumatic brain injury and mandates endotracheal intubation for airway protection. This patient's GCS of 7 meets this threshold. The distinction between M3 (abnormal flexion/decorticate posturing) and M4 (normal withdrawal/flexion) is critical: abnormal flexion involves flexion of the arm at the elbow with wrist flexion and adduction of the arm, often with internal rotation — it is a stereotypical, non-purposeful response. Normal withdrawal flexion is a purposeful pulling away from a painful stimulus. The emergency nurse must accurately calculate and communicate the GCS to guide clinical decision-making and establish a neurological baseline for trending.",
    learningObjective: "Accurately calculate the Glasgow Coma Scale score and understand its clinical significance in trauma management",
    blueprintCategory: "Trauma",
    subtopic: "traumatic brain injury",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Distinguish between M3 (abnormal flexion/decorticate — stereotypical, non-purposeful) and M4 (normal withdrawal — purposeful pulling away). This distinction changes the GCS and clinical management",
    clinicalPearls: [
      "GCS of 8 or less = severe TBI requiring intubation for airway protection",
      "Report GCS as component scores (E2V2M3=7) not just total, to allow accurate trending",
      "Motor response is the most prognostically important GCS component"
    ],
    safetyNote: "Always document individual GCS components (E, V, M) in addition to the total score — component changes may be clinically significant even if the total remains unchanged",
    distractorRationales: [
      "GCS 5 would require one less point in one category — E1 or V1 or M2",
      "GCS 8 would require E2+V2+M4 (normal flexion instead of abnormal flexion)",
      "GCS 9 would require higher scores in multiple categories"
    ],
    lessonPath: "/emergency/lessons/traumatic-brain-injury"
  },
  {
    stem: "A restrained front-seat passenger in an MVC presents with a seatbelt sign across the neck. She has a hoarse voice, subcutaneous emphysema of the anterior neck, and hemoptysis. These findings are most concerning for:",
    options: [
      "Cervical spine fracture with cord contusion",
      "Laryngotracheal injury with potential airway disruption",
      "Esophageal perforation from direct compression",
      "Carotid artery dissection from hyperextension"
    ],
    correctAnswer: 1,
    rationaleLong: "The combination of a seatbelt sign across the neck, hoarseness, subcutaneous emphysema, and hemoptysis is highly suggestive of laryngotracheal injury (blunt laryngeal or tracheal disruption). The seatbelt across the neck during a collision creates a direct compression force against the anterior neck structures, which can fracture the laryngeal cartilages (thyroid cartilage, cricoid cartilage), disrupt the tracheal rings, and tear the tracheal mucosa. Hoarseness indicates injury to the vocal cords or recurrent laryngeal nerves. Subcutaneous emphysema of the anterior neck is pathognomonic for air leaking from a disrupted airway into the surrounding soft tissues. Hemoptysis (coughing up blood) indicates mucosal injury within the airway. This is a life-threatening injury because progressive subcutaneous emphysema can distort anatomy and make subsequent intubation extremely difficult or impossible. Additionally, the laryngeal skeleton may be so disrupted that standard intubation attempts could cause complete airway loss — the endotracheal tube could create a false passage through the disrupted trachea into the mediastinum. The emergency nurse must recognize that this patient requires immediate airway management by the most experienced provider available, with preparation for surgical airway (cricothyrotomy or tracheostomy) as the primary plan rather than a backup. In many cases of significant laryngotracheal disruption, awake tracheostomy in the operating room is the preferred approach if the patient can maintain their airway temporarily. CT imaging of the neck can help delineate the injury anatomy if the patient is stable enough. Cervical spine injury and carotid dissection should also be evaluated but are not the primary concern based on these specific findings.",
    learningObjective: "Recognize clinical signs of laryngotracheal injury from blunt neck trauma and prepare for difficult airway management",
    blueprintCategory: "Trauma",
    subtopic: "blunt trauma",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Attempting standard intubation in laryngotracheal injury may cause complete airway loss — surgical airway may be the primary plan",
    clinicalPearls: [
      "Seatbelt sign on neck + hoarseness + subcutaneous emphysema + hemoptysis = suspect laryngotracheal injury",
      "Subcutaneous emphysema in the neck indicates air escaping from a disrupted airway",
      "Awake tracheostomy in the OR may be preferred over ED intubation for significant laryngotracheal disruption"
    ],
    safetyNote: "Do NOT blindly attempt intubation in suspected laryngotracheal injury — the tube may pass through a disrupted trachea into the mediastinum causing complete airway loss",
    distractorRationales: [
      "Cervical spine fracture would present with neurological deficits, not subcutaneous emphysema and hemoptysis",
      "Esophageal perforation would present with dysphagia and mediastinal air but not hemoptysis",
      "Carotid dissection presents with neurological symptoms (stroke-like) and neck pain, not subcutaneous emphysema"
    ],
    lessonPath: "/emergency/lessons/blunt-trauma"
  },
  {
    stem: "A 46-year-old male is brought to the ED after being involved in an explosion at a chemical plant. He was 5 meters from the blast. He has no visible external injuries but complains of bilateral ear pain, abdominal cramping, and chest tightness. The nurse should recognize these symptoms as consistent with which type of blast injury?",
    options: [
      "Secondary blast injury from projectile fragments",
      "Primary blast injury from the blast pressure wave affecting air-filled organs",
      "Tertiary blast injury from being thrown by the blast",
      "Quaternary blast injury from burns and inhalation"
    ],
    correctAnswer: 1,
    rationaleLong: "Blast injuries are classified into four categories based on the mechanism of injury. Primary blast injury results from the blast overpressure wave (the sudden increase and then decrease in atmospheric pressure from the explosion) affecting air-filled organs. The organs most susceptible to primary blast injury are: the ears (tympanic membrane rupture — the most common primary blast injury), the lungs (blast lung — alveolar rupture, contusion, hemorrhage, and potential air embolism), the gastrointestinal tract (bowel perforation, mesenteric hemorrhage, and delayed rupture), and the eyes (globe rupture). This patient's symptoms perfectly align with primary blast injury: bilateral ear pain (tympanic membrane injury — the TM is the most sensitive pressure indicator and ruptures at relatively low overpressure), abdominal cramping (GI tract involvement), and chest tightness (potential blast lung). The absence of visible external injuries is characteristic of primary blast injury — the pressure wave damages internal air-filled structures without necessarily causing external wounds. This is why primary blast injury is the most commonly missed blast injury type. The nurse must anticipate delayed presentation of bowel perforation (which can occur 24-48 hours after the blast) and monitor for signs of blast lung (progressive hypoxemia, hemoptysis, pneumothorax). An otoscopic examination should be performed to assess for tympanic membrane perforation. Secondary injuries come from projectiles, tertiary from body displacement, and quaternary from burns, inhalation, and crush.",
    learningObjective: "Classify blast injuries and recognize primary blast injury affecting air-filled organs",
    blueprintCategory: "Trauma",
    subtopic: "blunt trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Primary blast injury may have NO external wounds — internal damage to air-filled organs can be severe and delayed in presentation",
    clinicalPearls: [
      "Primary blast injury affects air-filled organs: ears (most common), lungs (most lethal), GI tract, and eyes",
      "Tympanic membrane rupture is the most sensitive indicator of significant blast overpressure exposure",
      "Bowel perforation from blast can be delayed 24-48 hours — serial abdominal exams are essential"
    ],
    safetyNote: "All patients exposed to significant blast overpressure require extended observation (24+ hours) for delayed bowel perforation and blast lung progression",
    distractorRationales: [
      "Secondary blast injury involves projectile fragments causing penetrating trauma — not pressure wave effects",
      "Tertiary blast injury results from the body being thrown or displaced — causing blunt trauma patterns",
      "Quaternary blast injury includes burns, inhalation injury, and crush — not pressure wave effects on internal organs"
    ],
    lessonPath: "/emergency/lessons/blunt-trauma"
  },
  {
    stem: "A 65-year-old male taking rivaroxaban presents to the ED with a head laceration after falling off a ladder. His initial vital signs and neurological exam are normal. CT head shows no acute findings. The ED physician decides to discharge the patient. What is the most important discharge instruction the nurse should provide?",
    options: [
      "Apply ice to the head laceration for swelling and take acetaminophen for pain",
      "Return to the ED immediately for any new headache, confusion, vomiting, or difficulty with balance — delayed intracranial hemorrhage can occur in anticoagulated patients despite a normal initial CT",
      "Resume normal activities including rivaroxaban as prescribed since the CT was normal",
      "Schedule a follow-up with primary care within 2 weeks for wound check"
    ],
    correctAnswer: 1,
    rationaleLong: "The most critical discharge instruction for an anticoagulated patient with head trauma and a normal initial CT is education about the signs and symptoms of delayed intracranial hemorrhage. Studies have shown that up to 6-8% of anticoagulated patients with minor head trauma and initially normal CT scans can develop delayed intracranial hemorrhage. This occurs because the anticoagulant prevents normal hemostasis — small vessel injuries that would normally clot may continue to bleed slowly, eventually forming a clinically significant hematoma hours to days after the initial injury. The patient and their caregiver must be clearly instructed to return to the ED immediately if any of the following symptoms develop: new or worsening headache, confusion or difficulty thinking, nausea or vomiting, difficulty with balance or walking, vision changes, one-sided weakness or numbness, difficulty speaking, or excessive drowsiness. These instructions should be provided in written form and verbally confirmed with both the patient and a responsible adult who will be with the patient. The patient should not be alone for at least 24 hours following discharge. While ice application and pain management are reasonable, they are not the most important instruction. Resuming normal activities immediately may not be appropriate — many guidelines recommend restricted activity for 24-48 hours after head trauma. The rivaroxaban decision (whether to hold or continue) should be made by the physician in consultation with the patient's prescriber, weighing the thrombotic risk of stopping versus the hemorrhagic risk of continuing. Follow-up should be within 24-48 hours, not 2 weeks.",
    learningObjective: "Provide appropriate discharge education for anticoagulated patients with head trauma including recognition of delayed hemorrhage signs",
    blueprintCategory: "Trauma",
    subtopic: "geriatric trauma",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "A normal initial CT in an anticoagulated patient does NOT eliminate the risk of delayed intracranial hemorrhage — patient education is critical",
    clinicalPearls: [
      "6-8% of anticoagulated patients with normal initial CT can develop delayed intracranial hemorrhage",
      "Written discharge instructions with return precautions are essential",
      "Patient should not be alone for at least 24 hours and should have a responsible adult companion"
    ],
    safetyNote: "Always provide written and verbal return precautions to both the patient and a responsible caregiver — delayed hemorrhage can be fatal if not recognized early",
    distractorRationales: [
      "Ice and acetaminophen are appropriate but not the MOST important discharge instruction",
      "Resuming all normal activities immediately may not be appropriate after head trauma",
      "Follow-up in 2 weeks is too long — 24-48 hour follow-up is more appropriate for anticoagulated head trauma"
    ],
    lessonPath: "/emergency/lessons/geriatric-trauma"
  }
];
