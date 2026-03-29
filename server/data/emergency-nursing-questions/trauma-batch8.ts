import { EmergencyNursingQuestion } from "./types";

export const traumaBatch8Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 22-year-old male is brought to the ED after a high-speed motorcycle crash. He is unconscious with GCS 6. Primary survey reveals bilateral fixed, dilated pupils, asymmetric chest rise, and a large scalp avulsion with visible skull. His blood pressure is 210/110 with HR 52. What clinical syndrome do these vital signs represent, and what is the priority intervention?",
    options: [
      "Neurogenic shock — administer IV fluids and vasopressors",
      "Cushing's triad (hypertension, bradycardia, irregular respirations) indicating severely elevated ICP — emergent neurosurgical intervention and ICP-lowering measures are the priority",
      "Hypovolemic shock — initiate massive transfusion protocol",
      "Autonomic dysreflexia — search for and remove the noxious stimulus below the level of injury"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is demonstrating Cushing's triad: hypertension, bradycardia, and (implied by the GCS 6 and bilateral fixed dilated pupils) irregular respirations. Cushing's triad is a late and ominous sign of critically elevated intracranial pressure (ICP) that indicates the brainstem is being compressed by transtentorial herniation. The pathophysiology is as follows: as ICP rises and approaches mean arterial pressure, cerebral perfusion pressure (CPP = MAP - ICP) drops dangerously low. The brainstem's vasomotor center responds by triggering massive sympathetic discharge to raise blood pressure (the Cushing response) in an attempt to maintain cerebral perfusion. The resulting hypertension stimulates baroreceptors in the carotid sinus and aortic arch, causing a reflex bradycardia via vagal (parasympathetic) activation. As brainstem compression progresses, the respiratory centers in the medulla and pons are affected, producing irregular breathing patterns (Cheyne-Stokes, ataxic, or apneustic breathing) before eventual respiratory arrest. Bilateral fixed, dilated pupils indicate bilateral uncal herniation compressing both oculomotor nerves (CN III) — this is a pre-terminal finding. Emergency nursing priorities: (1) Definitive airway with rapid sequence intubation — protect the airway and control ventilation (target PaCO2 35-40 mmHg; avoid hyperventilation unless herniation is imminent); (2) Elevate head of bed 30 degrees with head midline to promote venous drainage; (3) Administer hyperosmolar therapy — mannitol 1 g/kg IV or hypertonic saline (23.4% 30 mL via central line or 3% 250 mL IV) to osmotically reduce brain edema; (4) Emergent neurosurgical consultation for possible decompressive craniectomy or evacuation of any mass lesion. The scalp avulsion with visible skull suggests a possible underlying skull fracture with epidural or subdural hematoma that may be surgically evacuable. Time to intervention is critical — bilateral fixed dilated pupils carry a mortality rate exceeding 90% but survivors have been reported when surgical decompression occurs within minutes.",
    learningObjective: "Recognize Cushing's triad as a sign of brainstem herniation and implement emergency ICP-lowering interventions",
    blueprintCategory: "Trauma",
    subtopic: "traumatic brain injury",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Cushing's triad is a LATE sign — by the time you see it, herniation is already occurring. Do not wait for all three components to act.",
    clinicalPearls: [
      "Cushing's triad: hypertension + bradycardia + irregular respirations = brainstem compression from elevated ICP",
      "Bilateral fixed dilated pupils = bilateral uncal herniation compressing CN III — pre-terminal finding",
      "Hyperosmolar therapy (mannitol or hypertonic saline) can temporize while awaiting neurosurgery"
    ],
    safetyNote: "Avoid hyperventilation unless signs of active herniation — routine hyperventilation worsens outcomes by causing cerebral vasoconstriction and ischemia",
    distractorRationales: [
      "Neurogenic shock causes hypOtension and bradycardia (not hypertension) — from loss of sympathetic tone below the SCI level",
      "Hypovolemic shock causes tachycardia and hypotension — the opposite of this presentation",
      "Autonomic dysreflexia occurs in chronic SCI (T6 and above), not in acute trauma — and presents with hypertension and bradycardia but with different context"
    ],
    lessonPath: "/emergency/lessons/traumatic-brain-injury"
  },
  {
    stem: "A 45-year-old female restrained driver is brought to the ED after a T-bone collision. She has right-sided chest pain and dyspnea. Chest X-ray shows opacification of the right hemithorax with shift of the mediastinum to the LEFT. The emergency nurse notes the patient is becoming progressively more tachycardic and hypotensive. What is the most likely diagnosis?",
    options: [
      "Right-sided tension pneumothorax",
      "Massive right hemothorax — blood filling the pleural space is shifting the mediastinum contralaterally and causing hemorrhagic shock",
      "Right main bronchus rupture with subcutaneous emphysema",
      "Diaphragmatic rupture with abdominal contents in the thorax"
    ],
    correctAnswer: 1,
    rationaleLong: "The combination of opacification (whitening) of the right hemithorax with contralateral (leftward) mediastinal shift, progressive tachycardia, and hypotension is classic for a massive hemothorax. A massive hemothorax is defined as the accumulation of more than 1,500 mL of blood (or more than one-third of the patient's blood volume) in the pleural space. The blood accumulation causes two simultaneous problems: (1) RESPIRATORY COMPROMISE — the blood compresses the ipsilateral lung, causing atelectasis and ventilation-perfusion mismatch. As blood accumulates, it pushes the mediastinum toward the contralateral side, potentially compressing the opposite lung as well; (2) HEMORRHAGIC SHOCK — the bleeding represents significant intravascular volume loss. The sources of bleeding in massive hemothorax include intercostal arteries, internal mammary artery, pulmonary hilar vessels, or great vessels. The emergency nurse should immediately: (1) Establish large-bore IV access and begin resuscitation; (2) Activate the massive transfusion protocol if hemorrhagic shock is present; (3) Prepare for chest tube insertion — a large-bore (36-40 Fr) chest tube should be placed in the 4th or 5th intercostal space, mid-axillary line; (4) Collect initial output — if more than 1,500 mL drains immediately or output exceeds 200 mL/hour for 2-4 consecutive hours, emergent thoracotomy is indicated; (5) Consider autotransfusion of chest tube output if available. Key distinction from tension pneumothorax: tension pneumothorax causes hyperresonance to percussion and absent breath sounds (air in the pleural space), while hemothorax causes dullness to percussion (fluid/blood in the pleural space). Both can cause mediastinal shift, but the mechanism differs. On chest X-ray, air (pneumothorax) appears as hyperlucency (blackness), while blood (hemothorax) appears as opacification (whiteness). The mediastinal shift in massive hemothorax is away from the affected side (contralateral), same as tension pneumothorax.",
    learningObjective: "Differentiate massive hemothorax from tension pneumothorax and understand the indications for emergent thoracotomy",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Opacification (white) = fluid/blood (hemothorax); hyperlucency (black) = air (pneumothorax). Both can cause mediastinal shift away from the affected side.",
    clinicalPearls: [
      "Massive hemothorax: >1,500 mL initial output or >200 mL/hr for 2-4 hours = emergent thoracotomy",
      "Hemothorax = dull to percussion; pneumothorax = hyperresonant to percussion",
      "Autotransfusion of chest tube blood can be life-saving in massive hemothorax"
    ],
    safetyNote: "Clamping a chest tube in a hemothorax to 'slow the drainage' can cause tension physiology — never clamp a draining chest tube",
    distractorRationales: [
      "Tension pneumothorax causes hyperlucency (not opacification) on chest X-ray — air appears black, not white",
      "Main bronchus rupture typically presents with massive subcutaneous emphysema and persistent air leak — not opacification",
      "Diaphragmatic rupture shows abdominal visceral shadows (bowel gas pattern) in the thorax — not homogeneous opacification"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "A 30-year-old male presents after a fall from a roof (approximately 15 feet). He landed on his feet and now has bilateral heel pain and inability to bear weight. X-rays confirm bilateral calcaneal fractures. What associated injury must the emergency nurse specifically assess for in this patient?",
    options: [
      "Cervical spine fracture from whiplash mechanism",
      "Thoracolumbar spine compression fracture — axial loading from a fall on the feet transmits force up the skeletal column to the thoracolumbar junction",
      "Bilateral hip dislocations from the impact force",
      "Traumatic aortic transection from deceleration"
    ],
    correctAnswer: 1,
    rationaleLong: "Bilateral calcaneal (heel) fractures from a fall onto the feet are strongly associated with thoracolumbar spine compression fractures, particularly at the T12-L1 (thoracolumbar junction). This association occurs because the axial loading force from landing on the feet is transmitted directly up the skeletal column through the tibia, femur, pelvis, and vertebral bodies. The thoracolumbar junction (T12-L1) is the transition point between the relatively rigid thoracic spine (stabilized by the rib cage) and the more mobile lumbar spine, making it a stress concentration point where compression fractures commonly occur. Studies have shown that 10-15% of patients with calcaneal fractures from falls have an associated thoracolumbar spine fracture, and this rate increases with bilateral calcaneal fractures and greater fall heights. The emergency nurse must: (1) Maintain spinal precautions until the thoracolumbar spine is cleared; (2) Specifically assess for midline thoracolumbar tenderness, step-off deformity, or paraspinal muscle spasm; (3) Perform a thorough neurological examination of the lower extremities (motor strength, sensation, reflexes, rectal tone) — compression fractures at T12-L1 can cause cauda equina syndrome if fragment retropulsion compresses the conus medullaris or cauda equina; (4) Obtain thoracolumbar spine imaging (CT is preferred over plain radiographs for sensitivity). The 'Don Juan fracture' or 'lover's fracture' is a colloquial term for calcaneal fractures from falls (named after lovers jumping from balconies to escape discovery), and the association with spinal fractures is a classic teaching point in emergency medicine. Additional associated injuries from falls on feet include tibial plateau fractures, acetabular fractures, and wrist fractures (if the patient attempted to break the fall with outstretched hands).",
    learningObjective: "Recognize the association between calcaneal fractures and thoracolumbar spine compression fractures from axial loading mechanism",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Bilateral calcaneal fractures = always image the thoracolumbar spine. This is one of the most tested injury associations in emergency medicine.",
    clinicalPearls: [
      "10-15% of calcaneal fractures from falls have associated thoracolumbar spine fractures",
      "The T12-L1 junction is the most vulnerable point — transition from rigid thoracic to mobile lumbar spine",
      "Compression fractures at T12-L1 can cause cauda equina syndrome — check rectal tone and perineal sensation"
    ],
    safetyNote: "Maintain full spinal precautions in any patient with calcaneal fractures from a fall until the thoracolumbar spine is definitively cleared by imaging",
    distractorRationales: [
      "Cervical spine injury is associated with head strikes and hyperextension/flexion — not axial loading from landing on feet",
      "Bilateral hip dislocations require tremendous force typically from dashboard impacts — not the mechanism of falling onto feet",
      "Aortic transection is associated with rapid horizontal deceleration (e.g., high-speed MVC) — not vertical falls onto feet"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 19-year-old male presents to the ED with a stab wound to the left neck in Zone II (between the cricoid cartilage and the angle of the mandible). He is hemodynamically stable with an expanding hematoma. The nurse notes a bruit over the wound. What vascular injury should be suspected, and what is the priority imaging study?",
    options: [
      "Internal jugular vein laceration — obtain a venogram",
      "Carotid artery injury — emergent CT angiography (CTA) of the neck is the priority imaging study to evaluate for arterial injury",
      "Vertebral artery dissection — obtain an MRI of the cervical spine",
      "Subclavian artery injury — obtain a chest X-ray"
    ],
    correctAnswer: 1,
    rationaleLong: "A penetrating wound to Zone II of the neck (between the cricoid cartilage inferiorly and the angle of the mandible superiorly) with an expanding hematoma and a bruit is highly suspicious for carotid artery injury. Zone II is the most commonly injured zone in penetrating neck trauma because it contains the carotid artery, internal jugular vein, esophagus, trachea, larynx, and cervical spine within a relatively accessible and exposed area. The bruit (an abnormal vascular sound heard with a stethoscope) indicates turbulent blood flow, which occurs when blood flows through a damaged or narrowed vessel — in the context of penetrating trauma, this suggests a partial arterial laceration, pseudoaneurysm, or arteriovenous fistula. The expanding hematoma indicates active bleeding contained within the tissue planes of the neck. CT angiography (CTA) is the imaging study of choice for evaluating penetrating neck trauma in hemodynamically stable patients. CTA provides rapid, high-resolution imaging of all vascular structures in the neck and can simultaneously evaluate the aerodigestive tract. It has sensitivity and specificity exceeding 95% for significant vascular injuries. CTA has largely replaced the previous standard of mandatory surgical exploration for all Zone II injuries that penetrate the platysma. The emergency nurse should: (1) Avoid probing or exploring the wound — this can dislodge clot and precipitate uncontrolled hemorrhage; (2) Apply direct pressure if active external bleeding is present but do not apply circumferential compression (risk of occluding the contralateral carotid and compromising cerebral perfusion); (3) Maintain cervical spine precautions (mechanism may cause concurrent spine injury); (4) Ensure two large-bore IVs and type-and-crossmatch; (5) Prepare for emergent surgical exploration if the patient becomes hemodynamically unstable. Hard signs of vascular injury (active hemorrhage, expanding hematoma, bruit/thrill, pulse deficit, stroke symptoms) mandate either emergent CTA or direct surgical exploration.",
    learningObjective: "Identify hard signs of vascular injury in penetrating neck trauma and prioritize CT angiography for evaluation",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "A bruit over a penetrating wound = arterial injury until proven otherwise. Do NOT probe penetrating neck wounds — risk of dislodging clot and catastrophic hemorrhage.",
    clinicalPearls: [
      "Zone II (cricoid to angle of mandible) is the most commonly injured zone in penetrating neck trauma",
      "Hard signs of vascular injury: active hemorrhage, expanding hematoma, bruit/thrill, pulse deficit, stroke symptoms",
      "CTA has >95% sensitivity for vascular injury and has replaced mandatory exploration in stable patients"
    ],
    safetyNote: "Never apply circumferential neck compression — it can occlude the contralateral carotid and vertebral arteries, causing cerebral ischemia",
    distractorRationales: [
      "Jugular vein injury would not produce a bruit — bruits indicate arterial turbulence, not venous flow",
      "Vertebral artery is posterior and deep — less likely with anterior Zone II wound, and MRI is not the emergent study of choice",
      "Subclavian artery is below Zone II in the thoracic outlet — not the location of this injury"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 67-year-old female on chronic prednisone therapy for rheumatoid arthritis falls and sustains a hip fracture. In the ED, she becomes progressively hypotensive (BP 78/42) despite 2 liters of normal saline. Her HR is 88, temperature 36.0°C, and cortisol level returns at 2.1 mcg/dL. What is the cause of her refractory hypotension?",
    options: [
      "Occult internal hemorrhage from the fall requiring surgical exploration",
      "Acute adrenal crisis (adrenal insufficiency) from chronic corticosteroid use causing HPA axis suppression — stress-dose hydrocortisone is the treatment",
      "Cardiogenic shock from a concurrent acute MI triggered by the stress of the fall",
      "Neurogenic shock from a concurrent spinal cord injury"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is experiencing acute adrenal crisis (Addisonian crisis) precipitated by the physiological stress of the hip fracture in the setting of chronic corticosteroid therapy. Chronic exogenous corticosteroid use (prednisone for rheumatoid arthritis) causes suppression of the hypothalamic-pituitary-adrenal (HPA) axis through negative feedback. The adrenal glands atrophy from chronic suppression and lose the ability to mount an appropriate cortisol response to physiological stress. Under normal conditions, the adrenal glands increase cortisol production 5-10 fold during acute illness or injury. When this cortisol surge cannot occur, the patient develops hemodynamic instability that is refractory to fluid resuscitation and vasopressors. The critically low cortisol level of 2.1 mcg/dL confirms the diagnosis (a random cortisol level below 3 mcg/dL in the setting of acute illness is diagnostic of adrenal insufficiency; levels below 10-15 mcg/dL in critical illness are considered inadequate). The hallmarks of adrenal crisis include: hypotension refractory to fluids and vasopressors, hyponatremia, hyperkalemia, hypoglycemia, weakness, and altered mental status. Treatment is emergent stress-dose hydrocortisone: 100 mg IV bolus followed by 50 mg IV every 8 hours (or 200 mg continuous infusion over 24 hours). Hydrocortisone is preferred over dexamethasone because it has both glucocorticoid and mineralocorticoid activity (mineralocorticoid activity helps with sodium and water retention). The response to hydrocortisone is often dramatic — blood pressure may improve within 1-2 hours. The emergency nurse should also: correct hypoglycemia (D50 IV), monitor electrolytes closely, and ensure the patient continues stress-dose steroids through the perioperative period for the hip fracture repair. Any patient on chronic corticosteroids (equivalent to prednisone ≥5 mg/day for ≥3 weeks) who presents with acute illness should receive stress-dose steroids empirically if they show any hemodynamic instability.",
    learningObjective: "Recognize adrenal crisis in patients on chronic corticosteroids and initiate emergent stress-dose hydrocortisone",
    blueprintCategory: "Trauma",
    subtopic: "geriatric trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Hypotension refractory to fluids + chronic steroid use = adrenal crisis until proven otherwise. A random cortisol <3 mcg/dL in acute illness is diagnostic.",
    clinicalPearls: [
      "Chronic prednisone ≥5 mg/day for ≥3 weeks suppresses the HPA axis — patients cannot mount a cortisol stress response",
      "Stress-dose hydrocortisone: 100 mg IV bolus then 50 mg IV q8h — response is often dramatic within hours",
      "Random cortisol <3 mcg/dL in acute illness is diagnostic; <10-15 mcg/dL is inadequate for critical illness"
    ],
    safetyNote: "Do not wait for cortisol results to treat suspected adrenal crisis — give stress-dose hydrocortisone empirically if clinical suspicion is high",
    distractorRationales: [
      "While occult hemorrhage is possible, the cortisol of 2.1 and chronic steroid history point strongly to adrenal crisis as the primary cause",
      "Cardiogenic shock would present with signs of heart failure (JVD, pulmonary edema) — not seen here",
      "Neurogenic shock requires a spinal cord injury — no neurological deficits suggesting SCI are described"
    ],
    lessonPath: "/emergency/lessons/geriatric-trauma"
  },
  {
    stem: "A 5-year-old boy is brought to the ED by ambulance after being found floating face-down in a backyard pool. CPR was initiated by bystanders. He arrives with spontaneous circulation restored (ROSC). His GCS is 7, temperature is 33.5°C, and SpO2 is 88% on high-flow oxygen. What is the priority management for this child?",
    options: [
      "Rapidly rewarm to 37°C using warmed IV fluids and warming blankets, then begin neurological assessment",
      "Endotracheal intubation for airway protection, targeted temperature management (TTM) maintaining 32-36°C for neuroprotection, and careful avoidance of hyperthermia during rewarming",
      "Immediate CT head to evaluate for traumatic brain injury before any other interventions",
      "Administer prophylactic antibiotics for aspiration pneumonia and discharge if chest X-ray is normal"
    ],
    correctAnswer: 1,
    rationaleLong: "This pediatric drowning victim with ROSC but impaired consciousness (GCS 7) requires comprehensive post-cardiac arrest care with particular attention to neuroprotection. The priorities are: (1) AIRWAY — Endotracheal intubation is indicated because GCS ≤8 means the child cannot protect his own airway, and the SpO2 of 88% on high-flow oxygen indicates significant pulmonary compromise from aspiration. Mechanical ventilation allows precise control of oxygenation (target SpO2 94-98%; avoid hyperoxia which causes oxidative injury to vulnerable neurons) and ventilation (target normocapnia PaCO2 35-45 mmHg); (2) TARGETED TEMPERATURE MANAGEMENT (TTM) — Current evidence supports maintaining temperature at 32-36°C for 24 hours after cardiac arrest for neuroprotection. The child's current temperature of 33.5°C falls within the therapeutic range, so the priority is to AVOID REWARMING to normothermia. Controlled TTM reduces cerebral metabolic demand, decreases excitotoxic neurotransmitter release, limits free radical production, and attenuates the post-ischemic inflammatory cascade. If active cooling is needed, methods include surface cooling (cooling blankets, ice packs), endovascular cooling catheters, and cold IV saline boluses (4°C, 30 mL/kg). After the TTM period, rewarming should be slow and controlled (0.25-0.5°C per hour) because rapid rewarming can trigger rebound cerebral edema, seizures, and hemodynamic instability; (3) AVOID HYPERTHERMIA — Fever in the post-arrest period (>38°C) is independently associated with worse neurological outcomes and must be aggressively prevented; (4) Additional post-arrest care includes: continuous EEG monitoring for seizures (which may be subclinical), blood glucose monitoring and treatment of hypoglycemia, hemodynamic support as needed, and neurological prognostication delayed until at least 72 hours after ROSC (earlier prognostication is unreliable, especially in children and in hypothermic drowning). Rapid rewarming to 37°C would be harmful — it eliminates the neuroprotective effects of therapeutic hypothermia.",
    learningObjective: "Implement post-cardiac arrest care in pediatric drowning including targeted temperature management and avoidance of hyperthermia",
    blueprintCategory: "Trauma",
    subtopic: "pediatric trauma",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Do NOT rapidly rewarm a post-arrest patient who is already in the therapeutic hypothermia range (32-36°C) — this eliminates neuroprotection and worsens outcomes",
    clinicalPearls: [
      "Post-arrest TTM: maintain 32-36°C for 24 hours — do not rapidly rewarm if already hypothermic within this range",
      "Rewarm slowly at 0.25-0.5°C per hour — rapid rewarming causes rebound cerebral edema",
      "Neurological prognostication should be delayed at least 72 hours post-ROSC — earlier assessment is unreliable"
    ],
    safetyNote: "Avoid both hyperoxia (SpO2 >98%) and hyperthermia (>38°C) in the post-arrest period — both worsen neurological outcomes",
    distractorRationales: [
      "Rapid rewarming eliminates neuroprotective benefits and can cause rebound cerebral edema — harmful in post-arrest care",
      "CT head is not the priority when the patient needs immediate airway management and neuroprotective measures — imaging can follow stabilization",
      "Discharge is inappropriate for any drowning patient with cardiac arrest — this child requires ICU-level care"
    ],
    lessonPath: "/emergency/lessons/pediatric-trauma"
  },
  {
    stem: "A 40-year-old female presents to the ED after a motor vehicle crash with complaints of neck pain and bilateral arm tingling. She has weakness in both upper extremities (grip strength 2/5 bilaterally) but full strength in both lower extremities (5/5 bilaterally). Sensation is diminished in a cape-like distribution across the shoulders and upper arms. What spinal cord injury pattern does this represent?",
    options: [
      "Anterior cord syndrome — loss of motor and pain/temperature below the level of injury",
      "Central cord syndrome — upper extremity weakness greater than lower extremity weakness due to central gray matter injury, most common incomplete SCI",
      "Brown-Séquard syndrome — ipsilateral motor loss and contralateral pain/temperature loss",
      "Complete spinal cord transection at C4 — quadriplegia"
    ],
    correctAnswer: 1,
    rationaleLong: "This presentation is classic for central cord syndrome, the most common incomplete spinal cord injury pattern. Central cord syndrome is characterized by motor weakness that is disproportionately greater in the upper extremities compared to the lower extremities, often with variable sensory loss (typically in a cape-like distribution affecting the upper extremities and upper trunk). The pathophysiology relates to the somatotopic organization of the corticospinal tracts within the spinal cord: fibers controlling the upper extremities are located centrally (medially) within the lateral corticospinal tract, while fibers controlling the lower extremities are located peripherally (laterally). When the central portion of the cord is injured (typically from hyperextension injury causing cord compression between anterior osteophytes and a buckled ligamentum flavum posteriorly), the centrally located upper extremity fibers are damaged while the peripheral lower extremity fibers are relatively spared. This injury pattern is most common in older adults with pre-existing cervical spondylosis (degenerative narrowing of the spinal canal) who sustain a hyperextension injury such as a fall or rear-end collision. However, it can also occur in younger patients with traumatic cervical disc herniations. The cape-like sensory distribution corresponds to the central location of spinothalamic tract fibers for the dermatomes around the shoulders and upper arms (C4-T2). Emergency nursing care: (1) Maintain strict cervical spine immobilization; (2) Serial neurological examinations documenting exact motor scores in all muscle groups (using MRC scale 0-5); (3) MRI of the cervical spine is the imaging modality of choice (shows cord edema, hemorrhage, and compression); (4) Urgent neurosurgical consultation — surgical decompression may be indicated, especially if there is ongoing cord compression. The prognosis for central cord syndrome is better than other SCI patterns — many patients recover significant function, with lower extremity recovery first, then bladder function, then upper extremity function (hands recover last).",
    learningObjective: "Identify central cord syndrome by its characteristic pattern of upper > lower extremity weakness and understand its mechanism",
    blueprintCategory: "Trauma",
    subtopic: "spinal cord injury",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Central cord = upper extremity weakness GREATER than lower extremity weakness. If lower > upper, consider anterior cord syndrome.",
    clinicalPearls: [
      "Central cord syndrome is the most common incomplete SCI — upper extremity weakness > lower extremity weakness",
      "Somatotopic organization: upper extremity fibers are central (medial), lower extremity fibers are peripheral (lateral) in the corticospinal tract",
      "Recovery pattern: legs first → bladder → arms → hands (hands recover last)"
    ],
    safetyNote: "Serial neurological exams are essential — central cord syndrome can progress if ongoing cord compression is not identified and treated",
    distractorRationales: [
      "Anterior cord syndrome causes complete motor loss and pain/temperature loss below the level — lower extremities would be affected equally or more",
      "Brown-Séquard is a hemisection pattern with ipsilateral motor/proprioception loss and contralateral pain/temperature loss — not bilateral symmetric weakness",
      "Complete cord transection at C4 would cause quadriplegia with no motor function in any extremity — this patient has full lower extremity strength"
    ],
    lessonPath: "/emergency/lessons/spinal-cord-injury"
  },
  {
    stem: "A 55-year-old male presents to the ED with a traumatic amputation of his right hand at the wrist level from a table saw accident. The amputated part has been brought in a plastic bag directly on ice. What is the critical error in how the amputated part was transported?",
    options: [
      "The amputated part should not have been brought to the ED — it cannot be replanted",
      "The amputated part should be wrapped in saline-moistened gauze, placed in a sealed plastic bag, and then placed on ice — direct contact with ice causes frostbite and cell destruction, making replantation impossible",
      "The amputated part should have been placed in warm water to maintain tissue viability",
      "The amputated part should have been submerged in alcohol for sterilization"
    ],
    correctAnswer: 1,
    rationaleLong: "The critical error is that the amputated part was placed directly on ice. Direct contact between tissue and ice causes frostbite injury — ice crystal formation within the cells destroys cellular architecture, ruptures cell membranes, and makes successful replantation significantly less likely or impossible. The correct method for transporting an amputated part is the 'bag-in-bag' or 'double bag' technique: (1) Wrap the amputated part in saline-moistened (or water-moistened) sterile gauze; (2) Place the wrapped part in a sealed waterproof plastic bag (this prevents the tissue from becoming waterlogged); (3) Place this sealed bag into a SECOND container or bag filled with ice water (a mixture of ice and water maintains a temperature of approximately 4°C, which is the optimal preservation temperature). This technique cools the tissue without direct ice contact, dramatically extending the viability window. Cool ischemia times for replantation vary by tissue type: digits can tolerate up to 12 hours of cool ischemia (and longer for complete amputations without warm ischemia), while major limb amputations with significant muscle mass have a shorter window (approximately 6 hours) because skeletal muscle is more susceptible to ischemic injury. Warm ischemia (tissue at body temperature without blood supply) significantly shortens these windows — digits tolerate only about 6-8 hours of warm ischemia. Emergency nursing responsibilities for amputated parts include: (1) Correct any transport errors immediately upon arrival (rewrap in moist gauze, proper bag-in-bag cooling); (2) Control hemorrhage at the stump with direct pressure (avoid clamping or tourniquet unless pressure fails); (3) Obtain X-rays of both the stump and the amputated part; (4) Contact the replantation/hand surgery team immediately; (5) NPO the patient (replantation requires general anesthesia and lengthy surgery); (6) Document the mechanism (clean cut vs. crush/avulsion — clean cuts have better replantation outcomes); (7) Update tetanus immunization status.",
    learningObjective: "Apply correct amputated part preservation technique and understand the bag-in-bag cooling method",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER place an amputated part directly on ice — frostbite destroys tissue. Use the bag-in-bag method: moist gauze → sealed bag → ice water bath.",
    clinicalPearls: [
      "Bag-in-bag technique: moist gauze → sealed plastic bag → second bag with ice water (4°C optimal)",
      "Cool ischemia time for digits: up to 12 hours; for major limbs: approximately 6 hours",
      "Clean-cut amputations have significantly better replantation outcomes than crush or avulsion injuries"
    ],
    safetyNote: "Do not submerge amputated tissue directly in any liquid (water, saline, or alcohol) — cellular swelling from direct immersion damages tissue architecture",
    distractorRationales: [
      "Replantation is often possible, especially for hand/digit amputations — all amputated parts should be preserved properly and evaluated by a specialist",
      "Warm water accelerates ischemic injury and bacterial growth — the exact opposite of proper preservation",
      "Alcohol causes severe chemical injury to exposed tissue — it would destroy cellular viability"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 28-year-old pregnant female at 32 weeks gestation is involved in a high-speed MVC. She presents with vaginal bleeding, a rigid (board-like) uterus, and severe abdominal pain. Fetal heart tones show late decelerations with a baseline of 100 bpm. What is the most likely diagnosis and priority intervention?",
    options: [
      "Placenta previa — perform a vaginal examination to assess cervical dilation",
      "Placental abruption — emergent cesarean section is indicated given fetal distress and the high likelihood of complete or near-complete placental separation",
      "Uterine rupture — administer tocolytics to stop contractions",
      "Normal labor with bloody show — continue to monitor and await spontaneous delivery"
    ],
    correctAnswer: 1,
    rationaleLong: "This presentation is classic for traumatic placental abruption — the premature separation of the placenta from the uterine wall before delivery. The triad of vaginal bleeding, rigid (board-like) uterus, and severe abdominal pain after trauma is highly diagnostic. The rigid uterus results from blood dissecting between the placental interface and the myometrium, causing uterine irritability, tetanic contractions, and the characteristic 'board-like' feel on palpation. Placental abruption is the most common cause of fetal death in trauma during pregnancy. The fetal heart rate pattern (baseline 100 bpm with late decelerations) indicates fetal distress: a baseline below 110 bpm is fetal bradycardia, and late decelerations (FHR nadir occurring after the peak of the contraction) indicate uteroplacental insufficiency — the remaining attached placenta cannot provide adequate oxygenation during contractions. This pattern, combined with the clinical findings, suggests significant (>50%) placental separation, which is almost uniformly fatal to the fetus without immediate delivery. Emergency nursing priorities: (1) Left lateral displacement or left lateral decubitus position (displaces the gravid uterus off the IVC, improving venous return and cardiac output by 25-30%); (2) Two large-bore IVs with aggressive fluid resuscitation; (3) Continuous fetal monitoring; (4) Type and crossmatch for at least 4 units PRBCs; (5) Rh testing — if the mother is Rh-negative, administer RhoGAM (Rh immune globulin) to prevent Rh sensitization from fetomaternal hemorrhage; (6) Obtain a Kleihauer-Betke test to quantify fetomaternal hemorrhage; (7) EMERGENT OB consultation for cesarean delivery. Critical teaching point: NEVER perform a digital vaginal examination when placental abruption or placenta previa is suspected — in previa, the examining finger could penetrate the placenta and cause catastrophic hemorrhage. Use ultrasound to evaluate placental location first. The DIC (disseminated intravascular coagulation) panel (fibrinogen, PT/INR, platelets, D-dimer) should be sent because severe abruption frequently triggers consumptive coagulopathy.",
    learningObjective: "Recognize traumatic placental abruption and initiate emergent obstetric intervention for fetal distress",
    blueprintCategory: "Trauma",
    subtopic: "trauma in pregnancy",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER perform a digital vaginal exam in suspected abruption or previa — use ultrasound first. Vaginal exam can precipitate catastrophic hemorrhage.",
    clinicalPearls: [
      "Abruption triad: vaginal bleeding + rigid uterus + abdominal pain — most common cause of traumatic fetal death",
      "Left lateral positioning increases cardiac output 25-30% by relieving IVC compression from the gravid uterus",
      "Kleihauer-Betke test quantifies fetomaternal hemorrhage and guides RhoGAM dosing in Rh-negative mothers"
    ],
    safetyNote: "All pregnant trauma patients >20 weeks require minimum 4-6 hours of continuous fetal monitoring — abruption can present hours after the initial injury",
    distractorRationales: [
      "Placenta previa typically presents with painLESS vaginal bleeding and a soft uterus — not the rigid, painful uterus seen here",
      "Uterine rupture is extremely rare in an intact uterus without prior cesarean scars — and tocolytics are not the treatment",
      "Normal labor does not produce a board-like uterus or fetal bradycardia — these are ominous signs requiring emergent intervention"
    ],
    lessonPath: "/emergency/lessons/trauma-in-pregnancy"
  },
  {
    stem: "A 35-year-old male construction worker is brought to the ED after a concrete wall collapsed onto his legs. He was trapped for approximately 4 hours before extrication. He is alert with stable vital signs upon arrival. The emergency nurse knows that a life-threatening complication can occur AFTER the crushing object is removed. What is this complication, and what prophylactic intervention should have been initiated BEFORE extrication?",
    options: [
      "Compartment syndrome — perform fasciotomy before extrication",
      "Crush syndrome (rhabdomyolysis-induced hyperkalemia causing cardiac arrest) — aggressive IV normal saline should have been started before or immediately upon extrication to prevent acute renal failure and fatal hyperkalemia",
      "Fat embolism syndrome — administer prophylactic heparin before extrication",
      "Tension pneumothorax from rib fractures — perform needle decompression before extrication"
    ],
    correctAnswer: 1,
    rationaleLong: "Crush syndrome is one of the most dangerous and predictable complications of prolonged entrapment. When muscle tissue is crushed for more than 1 hour (though risk increases significantly after 4-6 hours), the compressed myocytes undergo ischemic necrosis. While trapped, the toxic intracellular contents remain sequestered in the crushed limb because there is no blood flow through the compressed tissue. The moment the crushing weight is removed and blood flow resumes (reperfusion), a massive bolus of toxic intracellular contents is released into the systemic circulation: (1) POTASSIUM — crushed myocytes release enormous quantities of intracellular potassium into the bloodstream. The resulting hyperkalemia (levels can exceed 7-8 mEq/L within minutes of reperfusion) causes fatal cardiac arrhythmias (peaked T waves → widened QRS → sine wave → VF/asystole); (2) MYOGLOBIN — released from damaged muscle fibers, myoglobin precipitates in the renal tubules (especially in acidic urine), causing acute tubular necrosis and acute kidney injury (oliguric renal failure); (3) PHOSPHATE — hyperphosphatemia binds calcium, causing hypocalcemia (which further predisposes to arrhythmias); (4) LACTIC ACID — causes severe metabolic acidosis; (5) URIC ACID and PURINES — contribute to renal tubular injury. The critical prophylactic intervention is aggressive IV normal saline infusion (1-1.5 L/hour) ideally BEFORE extrication (while the patient is still trapped, if IV access can be established) and continuing during and after release. The rationale: (1) Volume expansion dilutes the potassium bolus; (2) Increased renal blood flow and urine output (target >200-300 mL/hour) helps flush myoglobin through the tubules before it can precipitate; (3) Normal saline (not lactated Ringer's — which contains potassium) is the fluid of choice. Additional measures include: continuous cardiac monitoring with 12-lead ECG, calcium gluconate at bedside (for immediate treatment of hyperkalemic cardiac effects), sodium bicarbonate (alkalinizes urine to prevent myoglobin precipitation), and preparation for emergent dialysis if renal failure develops despite aggressive fluid resuscitation.",
    learningObjective: "Anticipate crush syndrome after prolonged entrapment and initiate aggressive fluid resuscitation before extrication",
    blueprintCategory: "Trauma",
    subtopic: "crush injuries",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The most dangerous moment in crush injury is RELEASE — not the crush itself. Hyperkalemia can cause cardiac arrest within minutes of reperfusion.",
    clinicalPearls: [
      "Crush syndrome risk increases significantly after >1 hour of entrapment — start IV NS before extrication if possible",
      "Use normal saline, NOT lactated Ringer's — LR contains potassium which would worsen hyperkalemia",
      "Target urine output >200-300 mL/hour to prevent myoglobin precipitation in renal tubules"
    ],
    safetyNote: "Have calcium gluconate drawn up and ready at the bedside before extrication — IV calcium is the first-line treatment for hyperkalemic cardiac toxicity",
    distractorRationales: [
      "Compartment syndrome may develop but fasciotomy before extrication is not standard — the immediate lethal risk is hyperkalemia, not compartment syndrome",
      "Fat embolism occurs 24-72 hours after long bone fractures — it is not an immediate post-extrication risk, and heparin is not preventive",
      "Tension pneumothorax is unrelated to lower extremity crush injury and would not develop from removing a crushing weight from the legs"
    ],
    lessonPath: "/emergency/lessons/crush-injuries"
  }
];
