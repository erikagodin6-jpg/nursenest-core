import { EmergencyNursingQuestion } from "./types";

export const traumaBatch7Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 34-year-old male presents with an isolated Le Fort II midface fracture after being struck by a baseball. He has periorbital edema, nasal bleeding, and facial elongation. The nurse notes CSF rhinorrhea mixed with blood. On testing the nasal drainage with a gauze pad, a 'double ring' or 'halo' pattern appears. What does this finding confirm?",
    options: [
      "Normal nasal mucus drainage mixed with blood",
      "CSF leak indicating a basilar skull fracture communicating with the nasal cavity",
      "Allergic rhinitis triggered by the trauma",
      "Sinusitis with bacterial drainage"
    ],
    correctAnswer: 1,
    rationaleLong: "The halo test (also called the double ring sign or target sign) is a bedside screening test for cerebrospinal fluid (CSF) leak. When a drop of fluid containing both blood and CSF is placed on gauze or a paper towel, the blood (being more viscous and containing cells) concentrates in the center, while the CSF (being less viscous and containing no cells) diffuses outward forming a clear halo around the blood-tinged center. This creates the characteristic 'double ring' appearance. In the context of Le Fort II and III midface fractures, the fracture lines traverse the cribriform plate of the ethmoid bone and/or the frontal sinus, creating a communication between the intracranial space and the nasal cavity that allows CSF to drain (CSF rhinorrhea). Le Fort II fractures (pyramidal pattern) extend from the nasal bridge laterally through the infraorbital rim, maxillary sinus walls, and pterygoid plates — this pattern can involve the cribriform plate or ethmoid roof. The clinical significance of CSF rhinorrhea includes: (1) Risk of ascending meningitis — bacteria from the nasal cavity can travel retrograde through the CSF fistula to the meninges; (2) The need for antibiotics prophylaxis (controversial but often given); (3) Contraindication to nasogastric tube insertion and nasal packing (risk of intracranial tube placement or pressure on the skull base defect). While the halo test is a useful bedside screening tool, the gold standard for confirming CSF leak is beta-2 transferrin testing — beta-2 transferrin is found exclusively in CSF and perilymph, making it 94-100% sensitive and specific. The emergency nurse should collect a sample of the drainage for beta-2 transferrin testing, elevate the head of bed to 30 degrees to reduce CSF pressure at the leak site, and avoid any nasal manipulation.",
    learningObjective: "Perform the halo test to screen for CSF rhinorrhea and understand its significance in midface fractures",
    blueprintCategory: "Trauma",
    subtopic: "blunt trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The halo test is a SCREENING test — beta-2 transferrin is the gold standard confirmatory test for CSF leak",
    clinicalPearls: [
      "Halo test: blood concentrates centrally, CSF diffuses to form a clear outer ring on gauze",
      "Beta-2 transferrin is 94-100% sensitive and specific for CSF — the gold standard test",
      "Le Fort II and III fractures can involve the cribriform plate causing CSF rhinorrhea"
    ],
    safetyNote: "No nasogastric tube, nasal packing, or nasal suctioning when CSF rhinorrhea is suspected — risk of intracranial contamination",
    distractorRationales: [
      "Normal nasal mucus does not produce a halo pattern — it lacks the differential diffusion properties of CSF",
      "Allergic rhinitis produces clear mucus but not the halo pattern seen with CSF and blood mixture",
      "Bacterial drainage from sinusitis would be purulent, not producing a clear halo pattern"
    ],
    lessonPath: "/emergency/lessons/blunt-trauma"
  },
  {
    stem: "A 28-year-old male is brought to the ED after a surfing accident where he was held underwater by a wave. He was submerged for approximately 90 seconds. He is alert and oriented with SpO2 96% on room air. He has a mild cough and feels 'fine.' Can this patient be safely discharged?",
    options: [
      "Yes — he is asymptomatic and can be discharged immediately",
      "No — all drowning patients with any submersion event require a minimum 6-8 hours of observation due to risk of delayed pulmonary edema",
      "Yes — if the chest X-ray is normal he can be discharged within 1 hour",
      "He only needs observation if he required CPR at the scene"
    ],
    correctAnswer: 1,
    rationaleLong: "All drowning patients who have had any submersion event, even those who appear well initially, require a minimum observation period of 6-8 hours due to the risk of delayed pulmonary edema. The pathophysiology of drowning involves aspiration of water (even small amounts) that disrupts pulmonary surfactant, damages the alveolar-capillary membrane, and triggers an inflammatory cascade. This process can evolve over hours, meaning a patient who appears well initially can develop progressive respiratory distress, worsening oxygenation, and pulmonary edema 2-8 hours after the submersion event. The 'mild cough' in this patient is significant — it indicates some degree of aspiration and airway irritation, reinforcing the need for observation. During the observation period, the emergency nurse should: (1) Monitor SpO2 continuously; (2) Perform serial respiratory assessments every 1-2 hours (respiratory rate, work of breathing, auscultation for crackles, cough progression); (3) Obtain a baseline chest X-ray (which may initially be normal even with significant aspiration); (4) Monitor for any deterioration in oxygenation (decreasing SpO2, increasing supplemental oxygen requirement); (5) Monitor temperature (hypothermia may be present depending on water temperature). If the patient remains asymptomatic with normal SpO2 on room air, normal serial respiratory assessments, and no progression of symptoms over 6-8 hours, discharge with clear return precautions is appropriate. Return precautions should include: any difficulty breathing, cough worsening, chest tightness, or feeling generally unwell. The term 'delayed drowning' or 'dry drowning' has been used in popular media but is not recognized terminology — the correct term is drowning with delayed respiratory deterioration.",
    learningObjective: "Apply the minimum observation period for drowning patients and recognize the risk of delayed pulmonary edema",
    blueprintCategory: "Trauma",
    subtopic: "blunt trauma",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "An initially well-appearing drowning patient can develop pulmonary edema hours later — 6-8 hours minimum observation is mandatory",
    clinicalPearls: [
      "All submersion events require 6-8 hours minimum observation regardless of initial presentation",
      "A mild cough after submersion indicates aspiration — this is not insignificant",
      "Chest X-ray may be initially normal despite significant aspiration — serial monitoring is essential"
    ],
    safetyNote: "Provide clear return precautions at discharge: return immediately for any difficulty breathing, worsening cough, or feeling unwell",
    distractorRationales: [
      "Immediate discharge is inappropriate — delayed pulmonary edema can develop hours after an apparently benign submersion",
      "A normal chest X-ray at 1 hour does not exclude delayed pulmonary complications",
      "The requirement for CPR is not the threshold for observation — any submersion event requires monitoring"
    ],
    lessonPath: "/emergency/lessons/blunt-trauma"
  },
  {
    stem: "A 39-year-old male presents to the ED with a fish hook embedded in his right earlobe. The hook has passed through the lobe with the barbed tip visible on the other side. The patient is anxious. What is the most appropriate technique for hook removal?",
    options: [
      "Pull the hook backward out the way it entered",
      "Advance the hook through (advance-and-cut technique) — push the barbed tip out through the exit, cut the barb, and withdraw the hook",
      "Surgically excise the entire section of earlobe containing the hook",
      "Leave the hook in place and refer to ENT for removal under general anesthesia"
    ],
    correctAnswer: 1,
    rationaleLong: "When a fishhook has fully penetrated through tissue with the barbed tip visible on the exit side, the advance-and-cut technique is the most straightforward and least traumatic removal method. The technique involves: (1) Administer local anesthesia (field block or direct infiltration around the entry and exit sites); (2) Advance the hook through the tissue in the direction it was already traveling until the barbed tip exits the skin; (3) Cut the barb off the exposed tip with wire cutters or a small needle driver; (4) Withdraw the now-barbless hook backward through the entry site. This technique works well when the hook tip is already near or through the exit surface, as in this case where it is visible on the other side of the earlobe. The earlobe is an ideal location for this technique because it is thin, well-vascularized tissue that heals well. Alternative techniques for hooks where the barb has NOT penetrated through include: the string-yank technique (wrapping a string around the hook bend and pulling with a quick jerk while pressing down on the shank to disengage the barb), the needle technique (using an 18-gauge needle to sheath the barb and allow retrograde withdrawal), or the simple retrograde technique (only works with barbless hooks). After removal, the nurse should: irrigate the wound thoroughly, assess for retained foreign material, update tetanus prophylaxis (fishhook wounds are tetanus-prone), consider prophylactic antibiotics if the wound is contaminated (especially saltwater or bait contamination), and provide wound care instructions. Pulling the hook backward without cutting the barb would cause significant additional tissue damage as the barb tears through tissue.",
    learningObjective: "Apply the advance-and-cut technique for fishhook removal when the barbed tip is visible at the exit site",
    blueprintCategory: "Trauma",
    subtopic: "blunt trauma",
    difficulty: 1,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Never pull a barbed fishhook backward through tissue — the barb will cause significant tissue damage. Always cut the barb before retrograde withdrawal.",
    clinicalPearls: [
      "Advance-and-cut: advance tip through, cut the barb, withdraw the de-barbed hook",
      "String-yank technique: for embedded hooks where the barb has not penetrated through",
      "Fishhook wounds are tetanus-prone — update tetanus prophylaxis"
    ],
    safetyNote: "Assess for retained hook fragments after removal — the barb and any cut wire pieces must be accounted for",
    distractorRationales: [
      "Pulling a barbed hook backward causes additional tissue damage from the barb",
      "Surgical excision of the earlobe is unnecessarily aggressive for a straightforward hook removal",
      "ENT referral under general anesthesia is excessive for an earlobe hook that can be removed with local anesthesia"
    ],
    lessonPath: "/emergency/lessons/blunt-trauma"
  },
  {
    stem: "A 47-year-old male presents after a workplace accident where a hydraulic press crushed his dominant right hand. He has multiple metacarpal fractures, tendon lacerations, and devascularized digits. The hand surgery team assesses replantation potential. Which digit has the HIGHEST priority for replantation or revascularization?",
    options: [
      "Index finger — it is the most used finger",
      "Thumb — loss of the thumb eliminates 40-50% of hand function, making it the highest priority for replantation",
      "Ring finger — it is important for grip strength",
      "Little finger — it provides the ulnar border for power grip"
    ],
    correctAnswer: 1,
    rationaleLong: "The thumb is the single most important digit in terms of hand function — its loss eliminates approximately 40-50% of overall hand function. The thumb's unique importance derives from its ability to oppose (face toward) the other digits, enabling precision grip (pinch), power grip, and fine manipulation. No other single digit contributes as much to hand function. For this reason, thumb replantation or revascularization receives the highest priority in multi-digit injuries. The indications for replantation have evolved over decades of microsurgical experience. Current priority hierarchy for replantation includes: (1) Thumb — always attempt replantation if the amputated part is available and in reasonable condition; (2) Multiple digits — replanting multiple fingers restores more function than a single finger; (3) Individual digits in children — children have superior nerve regeneration and functional outcomes; (4) Hand at wrist or forearm level — preserving any hand function is preferable to prosthesis; (5) Individual fingers distal to FDS insertion — these heal well and preserve function. Relative contraindications to replantation include: single finger amputations proximal to the FDS insertion in adults (particularly the index finger, where amputation revision may provide better function than a stiff replanted finger), severe crush/avulsion mechanisms (poor replantation success rates), multiple-level injuries within the same digit, prolonged warm ischemia beyond tolerance, and significant patient comorbidities. The emergency nurse should preserve all amputated parts using the correct technique (moist gauze, sealed bag, on ice), document the exact mechanism (sharp vs. crush vs. avulsion), record the warm ischemia time, and contact the replantation team immediately.",
    learningObjective: "Understand the priority hierarchy for digit replantation with emphasis on thumb importance",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Loss of the thumb eliminates 40-50% of hand function — thumb replantation is ALWAYS the highest priority in multi-digit injuries",
    clinicalPearls: [
      "Thumb replantation is always attempted when feasible — 40-50% of hand function depends on the thumb",
      "Single finger amputation proximal to FDS in adults may be better served by revision than replantation",
      "Children have superior nerve regeneration — replantation indications are broader in pediatric patients"
    ],
    safetyNote: "Preserve ALL amputated parts regardless of condition — the replantation surgeon makes the final viability determination",
    distractorRationales: [
      "Index finger replantation in adults (proximal amputations) may actually produce worse function than revision amputation",
      "While the ring finger contributes to grip, its loss is less functionally devastating than thumb loss",
      "The little finger is important for power grip but its functional loss is less significant than the thumb"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 62-year-old male presents to the ED after a MVC with a flail chest segment (ribs 4-7 fractured in two places each on the left). He has paradoxical chest wall movement and is in respiratory distress with SpO2 89% on 15L NRB. ABG shows PaO2 58 mmHg and PaCO2 52 mmHg. What is the primary cause of respiratory failure in flail chest?",
    options: [
      "The paradoxical chest wall movement alone causes all the respiratory compromise",
      "The underlying pulmonary contusion causes the majority of respiratory failure — the flail segment is a marker of the severe force that created the contusion",
      "Air leak from the fractured ribs causes bilateral pneumothoraces",
      "The fractured ribs directly puncture the diaphragm causing diaphragmatic paralysis"
    ],
    correctAnswer: 1,
    rationaleLong: "In flail chest, the primary cause of respiratory failure is the underlying pulmonary contusion, NOT the paradoxical chest wall movement itself. This is a critical distinction that changed the management paradigm from external stabilization (taping, sandbags) to internal management (pain control and ventilatory support). A flail segment occurs when three or more consecutive ribs are fractured in two or more places, creating a segment of chest wall that moves paradoxically during respiration (inward during inspiration, outward during expiration). While this paradoxical movement does contribute to some inefficiency in ventilation, the force required to create a flail segment is enormous — and that same force invariably creates significant pulmonary contusion of the underlying lung parenchyma. The pulmonary contusion causes: alveolar hemorrhage, edema, atelectasis, ventilation-perfusion mismatch, and intrapulmonary shunting — these are the primary drivers of hypoxemia and respiratory failure. The ABG in this patient confirms respiratory failure: PaO2 58 mmHg (severe hypoxemia) and PaCO2 52 mmHg (hypercarbia indicating ventilatory failure). This patient will likely require intubation and mechanical ventilation. The 'internal pneumatic splinting' effect of positive pressure ventilation eliminates the paradoxical movement and maintains alveolar recruitment. However, the cornerstone of management before intubation is aggressive multimodal pain management (epidural analgesia is the gold standard) to prevent the pain-splinting-atelectasis-pneumonia cascade. The emergency nurse should: apply continuous pulse oximetry and capnography, prepare for intubation if indicated (PaO2 less than 60 on maximal supplemental oxygen, PaCO2 greater than 50, or clinical exhaustion), facilitate pain management consultation for epidural placement, and position the patient with the flail side down (if lateral positioning is possible) to splint the flail segment against the bed.",
    learningObjective: "Identify the underlying pulmonary contusion as the primary cause of respiratory failure in flail chest",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "The flail segment itself is a MARKER of the severe force that caused the underlying pulmonary contusion — the contusion drives the respiratory failure, not the paradoxical movement",
    clinicalPearls: [
      "Pulmonary contusion, not paradoxical movement, is the primary cause of respiratory failure in flail chest",
      "Positive pressure ventilation provides 'internal pneumatic splinting' of the flail segment",
      "Position with flail side down to splint against the bed when lateral positioning is possible"
    ],
    safetyNote: "Flail chest with respiratory failure (PaO2 <60, PaCO2 >50, or clinical exhaustion) requires intubation and mechanical ventilation",
    distractorRationales: [
      "Paradoxical movement contributes but is not the primary cause — the underlying contusion drives respiratory failure",
      "Fractured ribs do not automatically cause pneumothorax, though it should be assessed for",
      "Rib fractures do not puncture the diaphragm — diaphragmatic paralysis is not a mechanism in flail chest"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "A 19-year-old female presents to the ED after being involved in a rollover vehicle accident. She was restrained. She has no visible injuries, stable vital signs, and a normal neurological exam. However, she is tearful, trembling, and repeatedly saying 'I should have died.' The nurse recognizes these as signs of acute stress reaction. What is the appropriate nursing intervention?",
    options: [
      "Administer a benzodiazepine to calm the patient",
      "Provide psychological first aid — offer a calm, safe environment, normalize the emotional response, and connect with crisis support resources",
      "Tell the patient she is fine and there is nothing to worry about",
      "Discharge immediately since she has no physical injuries"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is experiencing an acute stress reaction (ASR) — a normal psychological response to a traumatic event characterized by emotional distress, anxiety, trembling, tearfulness, intrusive thoughts, and a sense of disbelief. While her physical injuries are absent or minor, the psychological impact of the traumatic event requires appropriate nursing intervention. Psychological first aid (PFA) is the evidence-based approach for acute stress reactions in the emergency department and includes: (1) SAFETY — ensure the patient feels physically and emotionally safe. Provide a quiet, private space if possible; (2) CALMING — use a calm, empathetic approach. Speak slowly and clearly. Offer warm blankets, water, and basic comfort; (3) CONNECTEDNESS — help the patient connect with support persons (call family members, friends); (4) SELF-EFFICACY — empower the patient by providing information about what to expect (normalize the emotional response as a natural reaction to an abnormal event); (5) HOPE — provide reassurance that most people recover well from acute stress reactions. The nurse should NOT dismiss the emotional response ('you're fine') or immediately sedate the patient. Benzodiazepines for acute stress reactions are not routinely recommended — evidence suggests they may actually impair the natural psychological recovery process and increase the risk of subsequent PTSD. Discharging without addressing the psychological impact ignores a significant component of the patient's emergency. The nurse should provide crisis resources (National Suicide Prevention Lifeline, Crisis Text Line, SAMHSA helpline), screen for prior trauma history and mental health conditions that may increase vulnerability to PTSD, document the emotional status, and arrange follow-up with mental health services if the patient desires.",
    learningObjective: "Provide psychological first aid for acute stress reactions following traumatic events in the emergency department",
    blueprintCategory: "Trauma",
    subtopic: "multi-system trauma",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Benzodiazepines for acute stress reactions may INCREASE PTSD risk — they are not routinely recommended for psychological distress after trauma",
    clinicalPearls: [
      "Psychological first aid: Safety, Calming, Connectedness, Self-efficacy, Hope",
      "Acute stress reaction is a NORMAL response to an abnormal event — normalize it",
      "Screen for risk factors for PTSD: prior trauma, psychiatric history, poor social support"
    ],
    safetyNote: "Screen for suicidal ideation in patients expressing guilt or 'should have died' statements — these may indicate more than acute stress",
    distractorRationales: [
      "Benzodiazepines are not first-line for acute stress and may worsen long-term psychological outcomes",
      "Dismissing emotional responses is harmful and prevents appropriate intervention",
      "Discharge without addressing psychological needs ignores a significant component of trauma care"
    ],
    lessonPath: "/emergency/lessons/multi-system-trauma"
  },
  {
    stem: "A 44-year-old male construction worker presents with a nail gun injury to his right foot. The nail penetrated through his work boot into the plantar surface of the foot at the first metatarsophalangeal joint. After nail removal, wound care, and tetanus prophylaxis, what organism-specific antibiotic coverage should the nurse anticipate?",
    options: [
      "Only standard wound prophylaxis with cephalexin is needed",
      "Fluoroquinolone (ciprofloxacin) coverage for Pseudomonas aeruginosa — puncture wounds through footwear have a unique risk for Pseudomonas osteomyelitis",
      "Azithromycin for atypical bacterial coverage",
      "No antibiotics are needed for puncture wounds"
    ],
    correctAnswer: 1,
    rationaleLong: "Puncture wounds through footwear (shoes, boots) to the plantar surface of the foot carry a specific and unique risk for Pseudomonas aeruginosa osteomyelitis. This association was first described by Johanson in 1968 and has been consistently validated. The mechanism involves: (1) The puncture device (nail) passes through the rubber or foam sole of the shoe, picking up Pseudomonas organisms that thrive in the warm, moist environment of footwear; (2) The nail inoculates these organisms deep into the foot tissues, potentially reaching the periosteum or joint capsule; (3) The depth of the wound and the small entry site create an anaerobic environment conducive to Pseudomonas proliferation. Pseudomonas osteomyelitis of the foot from puncture wounds through footwear typically presents 2-4 weeks after the initial injury with increasing pain, swelling, and drainage. The most common locations are the metatarsal heads and the calcaneus — areas where the bone is closest to the plantar surface. Fluoroquinolones (ciprofloxacin or levofloxacin) provide excellent coverage for Pseudomonas and have good bone penetration. The nurse should anticipate the physician prescribing a fluoroquinolone in addition to standard wound care. Additional management includes: thorough wound irrigation (avoiding high-pressure irrigation which can force debris deeper), exploration for retained foreign material (shoe sole fragments), X-ray to rule out retained foreign body and establish a baseline for comparison if osteomyelitis develops, and clear return precautions: return for increasing pain, redness, swelling, or drainage — especially if these develop 1-3 weeks after the initial injury.",
    learningObjective: "Recognize the Pseudomonas risk in plantar puncture wounds through footwear and anticipate appropriate antibiotic coverage",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Puncture wounds through FOOTWEAR = Pseudomonas risk. Without footwear, Pseudomonas is much less likely — the shoe is the reservoir.",
    clinicalPearls: [
      "Pseudomonas thrives in the warm, moist environment of footwear",
      "Pseudomonas osteomyelitis presents 2-4 weeks after puncture — give return precautions for this timeline",
      "Fluoroquinolones have excellent Pseudomonas coverage and bone penetration"
    ],
    safetyNote: "Provide clear return precautions: any increasing pain, swelling, or drainage 1-3 weeks after a plantar puncture wound warrants evaluation for osteomyelitis",
    distractorRationales: [
      "Standard cephalexin does not cover Pseudomonas — specific coverage is needed for puncture wounds through footwear",
      "Azithromycin covers atypical organisms but does not cover Pseudomonas",
      "Puncture wounds through footwear carry a specific infection risk that warrants prophylactic antibiotics"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 37-year-old male presents after a stabbing to the left lateral chest at the 8th intercostal space in the midaxillary line. Chest tube is placed and initially drains 400 mL of blood. However, the nurse also notes bile-stained fluid in the chest tube output. What does this finding suggest?",
    options: [
      "The chest tube is malfunctioning and needs replacement",
      "Diaphragmatic perforation with concurrent abdominal organ injury — the stab wound has traversed the diaphragm",
      "Normal chest tube drainage that may appear discolored",
      "The patient has a pre-existing gallbladder disease unrelated to the trauma"
    ],
    correctAnswer: 1,
    rationaleLong: "Bile-stained fluid in chest tube output after a penetrating injury at the thoracoabdominal junction (the area below the nipple line where the diaphragm may be at the level of the injury) strongly suggests diaphragmatic perforation with concurrent upper abdominal organ injury. The thoracoabdominal junction extends from the 4th intercostal space anteriorly (nipple level) to the 7th intercostal space posteriorly (tip of the scapula). Wounds in this region can traverse the diaphragm and injure intra-abdominal organs while appearing to be purely thoracic injuries. The 8th intercostal space in the midaxillary line on the left side overlies the diaphragm and the spleen, left kidney, splenic flexure of the colon, and potentially the stomach. Bile in the chest tube drainage specifically suggests injury to the liver, gallbladder, or biliary system (if right-sided) or stomach/duodenum (if left-sided, bile could be gastric contents containing bile reflux). The presence of bile transforms this from a simple hemothorax (managed with chest tube alone) to a combined thoracoabdominal injury requiring: (1) Surgical exploration — the diaphragmatic defect must be repaired to prevent future diaphragmatic hernia (where abdominal organs herniate into the thorax through the defect); (2) Assessment and repair of the injured abdominal organ; (3) Abdominal contamination control (if hollow viscus is perforated). The emergency nurse should: document the character of the chest tube drainage carefully (color, consistency, odor), notify the trauma surgeon immediately of the bile-stained output, prepare for possible operative intervention, and obtain a CT scan if the patient is stable (to evaluate the diaphragm and abdominal organs). Diaphragmatic injuries from stab wounds are frequently missed on initial imaging — CT has sensitivity of only 30-50% for left-sided diaphragmatic injuries.",
    learningObjective: "Recognize thoracoabdominal penetrating injuries by chest tube drainage characteristics and understand the significance of diaphragmatic perforation",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Any penetrating wound below the nipple line can traverse the diaphragm — the thoracoabdominal junction is a danger zone for dual-cavity injury",
    clinicalPearls: [
      "Thoracoabdominal junction: 4th ICS anteriorly to 7th ICS posteriorly — wounds here may traverse the diaphragm",
      "Bile, fecal material, or food particles in chest tube output indicates diaphragmatic violation with abdominal injury",
      "CT sensitivity for diaphragmatic injury is only 30-50% on the left side — surgical exploration may be needed"
    ],
    safetyNote: "Unrepaired diaphragmatic injuries can lead to delayed herniation of abdominal organs into the thorax — this can present years later as bowel obstruction or strangulation",
    distractorRationales: [
      "Bile-stained fluid is not a chest tube malfunction — it indicates true pathology requiring urgent evaluation",
      "Bile in chest tube drainage is never normal — it always indicates diaphragmatic violation",
      "Pre-existing gallbladder disease does not cause bile in the pleural space"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "A 50-year-old male with chronic liver disease and known esophageal varices presents to the ED after a fall from standing height. He has a small forehead laceration and stable vital signs. His platelet count is 45,000/μL and INR is 2.1. He is neurologically intact. What specific concerns does the nurse have regarding this patient's coagulopathy?",
    options: [
      "The coagulopathy is irrelevant since the mechanism is minor",
      "Chronic liver disease coagulopathy increases risk of intracranial hemorrhage and wound bleeding — CT head is indicated, hemostatic agents should be available, and wound closure may require absorbable sutures or hemostatic agents",
      "The low platelet count only affects surgical bleeding, not traumatic wound bleeding",
      "The INR elevation is protective against intracranial hemorrhage by promoting blood flow"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with an intrinsic coagulopathy from chronic liver disease — a condition that significantly impacts trauma management. The liver synthesizes nearly all coagulation factors (except von Willebrand factor and factor VIII, which are endothelial products), thrombopoietin (the primary regulator of platelet production), and proteins C and S (natural anticoagulants). Chronic liver disease produces a complex coagulopathy: (1) Decreased coagulation factor production (reflected by the elevated INR of 2.1); (2) Thrombocytopenia (platelet count 45,000 — caused by decreased thrombopoietin production and splenic sequestration from portal hypertension/splenomegaly); (3) Dysfibrinogenemia (qualitatively abnormal fibrinogen); (4) Decreased clearance of fibrinolytic proteins. This coagulopathy creates multiple clinical concerns: INTRACRANIAL HEMORRHAGE — even minor head trauma can cause clinically significant intracranial bleeding in coagulopathic patients. CT head is indicated regardless of the trivial mechanism. WOUND HEMOSTASIS — the forehead laceration may bleed more than expected due to the combined effect of thrombocytopenia and coagulation factor deficiency. Topical hemostatic agents (thrombin, fibrin sealant, tranexamic acid-soaked gauze) and absorbable sutures (which provide ongoing hemostasis as they dissolve) may be needed. BLEEDING RISK — the known esophageal varices add another hemorrhagic risk if the patient vomits from head injury or stress. The emergency nurse should: obtain CT head (same principle as anticoagulated patients), closely monitor for signs of hemorrhage, have hemostatic supplies available for wound closure, check coagulation studies and platelet count, consider platelet transfusion if active bleeding occurs (typically transfuse for platelets less than 50,000 with active bleeding), and monitor for variceal bleeding.",
    learningObjective: "Manage trauma in patients with hepatic coagulopathy and understand the multifaceted bleeding risk",
    blueprintCategory: "Trauma",
    subtopic: "multi-system trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Chronic liver disease coagulopathy involves BOTH factor deficiency AND thrombocytopenia — correcting only one does not fully address the bleeding risk",
    clinicalPearls: [
      "Chronic liver disease coagulopathy: decreased factors + thrombocytopenia + dysfibrinogenemia",
      "CT head is indicated in coagulopathic patients with any head trauma regardless of mechanism severity",
      "Platelet transfusion threshold for active bleeding: typically <50,000/μL"
    ],
    safetyNote: "Monitor for variceal bleeding in patients with known varices — vomiting from head injury or stress can trigger variceal hemorrhage",
    distractorRationales: [
      "The coagulopathy is clinically significant regardless of the mechanism — minor trauma can cause major hemorrhage",
      "Low platelet count affects ALL bleeding — traumatic and surgical — not just surgical bleeding",
      "An elevated INR reflects impaired coagulation, which INCREASES hemorrhage risk, not protects against it"
    ],
    lessonPath: "/emergency/lessons/multi-system-trauma"
  },
  {
    stem: "A 25-year-old male presents after a motorcycle accident with a tibial plateau fracture. The orthopedic team plans for ORIF in 48 hours. During the waiting period, the nurse notes progressive calf swelling, increasing pain, and the patient develops shortness of breath and pleuritic chest pain on day 2. SpO2 drops to 90%. What complication has likely developed?",
    options: [
      "Compartment syndrome of the lower leg",
      "Deep vein thrombosis with pulmonary embolism — a well-known complication of lower extremity fractures and immobility",
      "Fat embolism syndrome from the tibial fracture",
      "Pneumonia from immobility"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with classic findings of deep vein thrombosis (DVT) with subsequent pulmonary embolism (PE). The progressive calf swelling and increasing pain represent DVT formation in the lower extremity, while the sudden onset shortness of breath, pleuritic chest pain, and hypoxemia represent PE from embolization of the thrombus to the pulmonary vasculature. Lower extremity fractures carry a significantly elevated risk of venous thromboembolism (VTE) due to all three components of Virchow's triad: (1) VENOUS STASIS — immobilization from the fracture reduces the calf muscle pump that normally assists venous return; (2) ENDOTHELIAL INJURY — the fracture itself damages local blood vessels, and surgical manipulation further injures the endothelium; (3) HYPERCOAGULABILITY — the trauma-induced inflammatory response activates the coagulation cascade, and the tissue factor released from injured tissues promotes thrombin generation. Without prophylaxis, the VTE rate after lower extremity fractures can be as high as 40-80% (DVT detected by sensitive imaging). The emergency nurse should: immediately administer oxygen, obtain a CT pulmonary angiography (the gold standard for PE diagnosis), draw D-dimer (though in trauma patients D-dimer is often elevated regardless), obtain lower extremity duplex ultrasound to confirm DVT, initiate anticoagulation (typically heparin infusion for PE unless contraindicated), monitor hemodynamics closely (massive PE can cause right heart failure and cardiovascular collapse), and communicate the VTE to the orthopedic team regarding surgical timing implications. VTE prophylaxis should have been initiated on admission — low-molecular-weight heparin (enoxaparin) or unfractionated heparin is standard for immobilized lower extremity fracture patients.",
    learningObjective: "Recognize DVT with PE as a complication of lower extremity fractures and immobility, and understand VTE prophylaxis importance",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "VTE prophylaxis should be initiated on admission for all immobilized lower extremity fracture patients — failure to do so is a preventable medical error",
    clinicalPearls: [
      "Virchow's triad in fracture patients: venous stasis, endothelial injury, hypercoagulability — all three present",
      "CT pulmonary angiography is the gold standard for PE diagnosis",
      "VTE rate without prophylaxis after lower extremity fracture can reach 40-80%"
    ],
    safetyNote: "Initiate VTE prophylaxis (LMWH or UFH) on admission for all immobilized lower extremity fracture patients unless actively bleeding",
    distractorRationales: [
      "Compartment syndrome presents with pain with passive stretch and tense compartments — the shortness of breath and pleuritic chest pain point to PE",
      "Fat embolism syndrome presents within 24-72 hours with the triad of respiratory distress, neurological changes, and petechial rash — this timeline and presentation is more consistent with PE",
      "Pneumonia would present with fever, productive cough, and focal findings on auscultation, not acute pleuritic chest pain and acute-onset hypoxemia"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 33-year-old female presents to the ED after a motor vehicle accident with bilateral pneumothoraces identified on chest CT. She is hemodynamically stable with SpO2 94% on 4L NC. Both pneumothoraces are less than 2 cm in size with no midline shift. What is the appropriate initial management?",
    options: [
      "Immediate bilateral chest tube insertion",
      "Close observation with serial chest X-rays — small traumatic pneumothoraces without respiratory distress can be managed with observation and supplemental oxygen in select stable patients",
      "Discharge with outpatient follow-up chest X-ray in 1 week",
      "Needle decompression of both sides followed by chest tubes"
    ],
    correctAnswer: 1,
    rationaleLong: "The management of traumatic pneumothoraces has evolved from mandatory chest tube insertion for all pneumothoraces to selective observation for small, uncomplicated pneumothoraces in hemodynamically stable patients. This approach is supported by multiple studies demonstrating that occult pneumothoraces (those identified on CT but not visible on plain chest X-ray) and small pneumothoraces (less than 2 cm in depth) in stable patients can be safely observed without tube thoracostomy. The OPTICC trial and similar studies demonstrated that observation of small traumatic pneumothoraces in ventilated and non-ventilated patients had similar outcomes to chest tube placement, with the observational group avoiding the morbidity of chest tube insertion. Observation protocol includes: (1) Admission to a monitored bed; (2) Serial chest X-rays every 6-12 hours to monitor for pneumothorax progression; (3) Continuous pulse oximetry; (4) Supplemental oxygen (high-flow oxygen increases the rate of pneumothorax absorption by creating a nitrogen gradient that promotes pleural air reabsorption); (5) Serial respiratory assessments; (6) IMPORTANT CAVEAT — if the patient requires positive pressure ventilation (for any reason), chest tubes should be placed before intubation because PPV can rapidly convert a simple pneumothorax to a tension pneumothorax. Indications for chest tube despite small size include: respiratory distress, hemodynamic instability, need for positive pressure ventilation, need for air transport (altitude changes increase pneumothorax size), progression on serial imaging, or associated hemothorax. This patient meets criteria for observation: hemodynamically stable, adequate oxygenation on supplemental oxygen, bilateral but small pneumothoraces without tension, and not requiring positive pressure ventilation.",
    learningObjective: "Apply selective observation for small traumatic pneumothoraces in stable patients and identify indications for tube thoracostomy",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Small occult pneumothoraces in stable patients can be observed — but if positive pressure ventilation is needed, chest tubes must be placed FIRST",
    clinicalPearls: [
      "High-flow oxygen increases pneumothorax reabsorption rate by creating a nitrogen gradient",
      "Small pneumothoraces (<2 cm) in stable patients can be safely observed with serial imaging",
      "OPTICC trial supports observation over routine chest tube for small traumatic pneumothoraces"
    ],
    safetyNote: "If the patient requires intubation for any reason, bilateral chest tubes MUST be placed before positive pressure ventilation to prevent tension pneumothorax",
    distractorRationales: [
      "Immediate bilateral chest tubes are unnecessarily invasive for small stable pneumothoraces",
      "Discharge without monitoring is inappropriate for bilateral traumatic pneumothoraces — they require inpatient observation",
      "Needle decompression is for tension pneumothorax, not small stable simple pneumothoraces"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "A 71-year-old male presents after a fall at home. He has a C2 (hangman's) fracture identified on CT cervical spine. He is neurologically intact. The nurse understands this fracture type. What is the typical mechanism that causes a hangman's fracture?",
    options: [
      "Axial loading with flexion, as in diving injuries",
      "Hyperextension with axial loading, causing bilateral pars interarticularis fractures of C2",
      "Pure rotational force to the cervical spine",
      "Direct blow to the occiput causing odontoid fracture"
    ],
    correctAnswer: 1,
    rationaleLong: "A hangman's fracture is a bilateral fracture of the pars interarticularis (the bony bridge between the superior and inferior articular facets) of C2 (the axis vertebra). Despite its ominous name (derived from judicial hangings where the mechanism was hyperextension-distraction), the majority of hangman's fractures today result from motor vehicle accidents and falls where the mechanism is hyperextension combined with axial loading — such as when the face or forehead strikes a dashboard or ground, forcing the head backward and upward. This mechanism causes the pars interarticularis of C2 to fail under the combined compressive and extension forces. Paradoxically, hangman's fractures are often neurologically intact because the fracture actually WIDENS the spinal canal at C2. The bilateral pars fractures allow the anterior fragment (C2 body) to translate forward while the posterior arch of C2 stays with the lower cervical spine, effectively 'auto-decompressing' the spinal canal. This widening is in contrast to burst fractures or dislocations that narrow the canal and compress the cord. However, the fracture is still a significant injury requiring management because: (1) The stability of the C2-C3 segment is compromised; (2) Further displacement could occur, potentially compromising the spinal cord; (3) Associated vascular injuries (vertebral artery injury) can occur. Management is typically external immobilization with a rigid cervical collar or halo vest for stable fracture patterns, with surgical fixation reserved for unstable patterns (significant angulation or translation). The emergency nurse should maintain strict cervical immobilization, perform serial neurological assessments, and understand that the patient's intact neurological status does not mean the fracture is benign.",
    learningObjective: "Understand the mechanism, anatomy, and paradoxical neurological sparing of hangman's fractures",
    blueprintCategory: "Trauma",
    subtopic: "spinal cord injury",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Hangman's fractures are often neurologically intact because the bilateral pars fractures WIDEN the spinal canal — but the fracture still requires stabilization",
    clinicalPearls: [
      "Hangman's fracture: bilateral pars interarticularis fractures of C2 from hyperextension + axial loading",
      "Neurologically intact because the canal widens at the fracture site — auto-decompression",
      "Most are treated with external immobilization (collar or halo) — surgery for unstable patterns"
    ],
    safetyNote: "Strict cervical immobilization is essential — despite neurological sparing, further displacement could compromise the spinal cord",
    distractorRationales: [
      "Axial loading with flexion causes burst fractures or teardrop fractures, not hangman's fractures",
      "Pure rotation causes facet dislocations, not bilateral pars fractures",
      "Direct occipital blows more commonly cause occipital condyle fractures or odontoid fractures"
    ],
    lessonPath: "/emergency/lessons/spinal-cord-injury"
  }
];
