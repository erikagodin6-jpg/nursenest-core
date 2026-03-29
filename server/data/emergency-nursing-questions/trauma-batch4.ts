import { EmergencyNursingQuestion } from "./types";

export const traumaBatch4Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 28-year-old male presents to the ED after being assaulted with a baseball bat to the left flank. He complains of severe left-sided abdominal pain radiating to the left shoulder. Vital signs: HR 118 bpm, BP 94/58 mmHg, RR 24, SpO2 97%. His abdomen is rigid with guarding in the left upper quadrant. The FAST exam shows free fluid in the left upper quadrant. What is the most likely injured organ?",
    options: [
      "Left kidney with retroperitoneal hemorrhage",
      "Spleen with intraperitoneal hemorrhage",
      "Descending colon with bowel perforation",
      "Left adrenal gland with hemorrhage"
    ],
    correctAnswer: 1,
    rationaleLong: "The spleen is the most commonly injured solid organ in blunt abdominal trauma, particularly with left flank impacts. This patient presents with the classic triad of splenic injury: left upper quadrant pain, left shoulder pain (Kehr's sign — referred pain from diaphragmatic irritation by blood), and hemodynamic instability. Kehr's sign occurs because the phrenic nerve (C3-C5) innervates both the diaphragm and refers pain to the ipsilateral shoulder tip. When blood from a ruptured spleen irritates the left hemidiaphragm, the patient perceives pain in the left shoulder. The positive FAST exam showing free fluid in the left upper quadrant (splenorenal recess/Morrison's pouch equivalent on the left) confirms intraperitoneal hemorrhage. The mechanism (direct blow to the left flank) is classic for splenic injury. The hemodynamic compromise (tachycardia and hypotension) indicates significant hemorrhage requiring emergent intervention. While the left kidney is also at risk from flank trauma, kidney injuries typically produce retroperitoneal hemorrhage that would not be detected on FAST examination and would not cause Kehr's sign. Colonic injuries from blunt trauma are less common and present with peritonitis rather than hemorrhagic shock. Left adrenal hemorrhage is rare and would not produce significant free fluid on FAST. Emergency nursing priorities include establishing large-bore IV access, type and crossmatch, preparation for potential operative intervention or interventional radiology embolization, and serial abdominal assessments.",
    learningObjective: "Identify splenic injury by clinical presentation including Kehr's sign and positive FAST examination",
    blueprintCategory: "Trauma",
    subtopic: "abdominal trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Kehr's sign (left shoulder pain from diaphragmatic irritation) is pathognomonic for splenic injury — do not confuse with musculoskeletal shoulder pain",
    clinicalPearls: [
      "Spleen is the most commonly injured solid organ in blunt abdominal trauma",
      "Kehr's sign: left shoulder pain from diaphragmatic irritation by splenic hemorrhage",
      "FAST detects intraperitoneal but not retroperitoneal hemorrhage"
    ],
    safetyNote: "A negative FAST does not rule out intra-abdominal injury — serial examinations and CT are indicated for high-mechanism injuries",
    distractorRationales: [
      "Left kidney injuries cause retroperitoneal hemorrhage not detected by FAST and do not cause Kehr's sign",
      "Colonic perforation presents with peritonitis, not hemorrhagic shock with free fluid on FAST",
      "Left adrenal hemorrhage is rare and would not produce hemodynamically significant intraperitoneal hemorrhage"
    ],
    lessonPath: "/emergency/lessons/abdominal-trauma"
  },
  {
    stem: "A 35-year-old restrained driver presents after a high-speed head-on collision. He has a seat belt sign across the lower abdomen. He complains of increasing abdominal pain and nausea. Initial CT shows no free fluid, but repeat CT at 8 hours reveals a grade II jejunal injury with mesenteric hematoma. What is the significance of the seat belt sign in this scenario?",
    options: [
      "It indicates the restraint system functioned properly and injuries are unlikely",
      "It is associated with hollow viscus injury and Chance fractures, warranting serial assessment",
      "It only correlates with superficial abdominal wall bruising and is clinically insignificant",
      "It mandates immediate surgical exploration regardless of imaging findings"
    ],
    correctAnswer: 1,
    rationaleLong: "The seat belt sign — a linear ecchymosis across the lower abdomen caused by the lap belt — is a critically important clinical finding that is associated with a significantly increased risk of intra-abdominal injury, particularly hollow viscus (small bowel) injury and lumbar spine Chance fractures. Studies show that patients with a seat belt sign have a 4-8 times higher risk of intra-abdominal injury compared to those without. The mechanism involves sudden deceleration causing the lap belt to compress the abdominal contents against the lumbar spine. This compression can rupture hollow organs (small bowel, colon) and cause mesenteric tears, as well as flexion-distraction injuries to the lumbar spine (Chance fractures at L1-L3). The clinical challenge illustrated in this case is that hollow viscus injuries are frequently missed on initial CT scan — they may not produce free fluid early, and bowel wall thickening or mesenteric hematoma may be subtle. This is why serial abdominal examinations every 2-4 hours are essential for patients with seat belt signs. The delayed diagnosis at 8 hours is classic for small bowel injury. Emergency nurses must document the presence of a seat belt sign, communicate this finding to the trauma team, and understand that a negative initial CT does not exclude injury. The patient requires admission for observation and serial assessment even with an initially negative CT when a seat belt sign is present.",
    learningObjective: "Recognize the seat belt sign as a predictor of hollow viscus and lumbar spine injuries requiring serial assessment",
    blueprintCategory: "Trauma",
    subtopic: "abdominal trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Initial CT may be negative in hollow viscus injury — the seat belt sign mandates serial assessment even with negative initial imaging",
    clinicalPearls: [
      "Seat belt sign increases risk of intra-abdominal injury 4-8 times",
      "Associated injuries: hollow viscus perforation and lumbar Chance fractures",
      "Hollow viscus injuries are frequently missed on initial CT scan"
    ],
    safetyNote: "Always document seat belt sign and ensure serial abdominal assessments every 2-4 hours — delayed diagnosis of bowel injury increases morbidity and mortality",
    distractorRationales: [
      "While seat belts save lives, the seat belt sign indicates significant force transfer and associated injury risk",
      "The seat belt sign has strong clinical significance beyond superficial bruising",
      "Immediate surgical exploration is not indicated without clear signs of peritonitis or hemodynamic instability"
    ],
    lessonPath: "/emergency/lessons/abdominal-trauma"
  },
  {
    stem: "A 6-year-old child is brought to the ED after being struck by a car while crossing the street. She has a left femur fracture, and the nurse notices bruising in various stages of healing on her back and buttocks. The parents state she is 'clumsy and falls frequently.' What is the emergency nurse's primary responsibility?",
    options: [
      "Accept the parents' explanation and focus on treating the femur fracture",
      "Document findings objectively, assess for non-accidental trauma patterns, and report concerns per mandatory reporting laws",
      "Confront the parents directly about suspected child abuse",
      "Defer to the physician to assess for child abuse after the femur fracture is managed"
    ],
    correctAnswer: 1,
    rationaleLong: "Emergency nurses are mandatory reporters of suspected child abuse in all 50 states. The clinical presentation raises significant concerns for non-accidental trauma (NAT): bruising in various stages of healing suggests injuries occurring at different times, bruising on the back and buttocks are sentinel locations for inflicted injury (these are not typical locations for accidental falls), and the parental explanation of 'clumsiness' is inconsistent with the pattern of injuries. While the femur fracture could certainly be from the reported pedestrian-struck-by-vehicle mechanism, the additional findings of unexplained bruising warrant further investigation. The nurse's primary responsibility is to document findings objectively and thoroughly: describe the location, size, color, and shape of each bruise; note the stated mechanism; document the child's developmental level; and assess for other concerning findings such as patterned injuries (belt marks, loop marks), oral injuries, or signs of neglect. The nurse must report concerns to child protective services and/or follow institutional protocols for suspected NAT — this is a legal obligation, not optional. Confronting parents directly is contraindicated as it may compromise the investigation and could place the child at further risk. While physician assessment is important, the nurse's independent obligation to report suspected abuse should not be deferred. The TEN-4 FACES P bruising rule helps identify concerning bruising patterns: bruising on the Torso, Ears, Neck in children under 4, or on the Frenulum, Angle of jaw, Cheeks, Eyelids, Subconjunctivae, or Patterned bruising at any age.",
    learningObjective: "Recognize indicators of non-accidental trauma and fulfill mandatory reporting obligations",
    blueprintCategory: "Trauma",
    subtopic: "pediatric trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Emergency nurses are MANDATORY reporters — suspected abuse must be reported based on reasonable suspicion, not confirmed diagnosis",
    clinicalPearls: [
      "TEN-4 FACES P rule identifies high-risk bruising locations for non-accidental trauma",
      "Bruising in various stages of healing suggests injuries at different times — a red flag for abuse",
      "Back and buttock bruising is sentinel for inflicted injury — not typical of accidental falls"
    ],
    safetyNote: "Never defer mandatory reporting obligations — report suspected abuse to child protective services regardless of parental explanation",
    distractorRationales: [
      "Accepting the explanation without investigation fails the mandatory reporting obligation and could endanger the child",
      "Confronting parents directly may compromise the investigation and could escalate the situation",
      "Mandatory reporting is an independent nursing obligation that should not be deferred to the physician"
    ],
    lessonPath: "/emergency/lessons/pediatric-trauma"
  },
  {
    stem: "A 4-year-old child presents to the ED after a fall from a second-story window. She is crying but consolable with a GCS of 14 (E4V4M6). She has a 3cm scalp hematoma over the left parietal region. No loss of consciousness was witnessed. According to the PECARN head injury decision rule, what is the most appropriate next step?",
    options: [
      "Immediate CT scan of the head given the mechanism and scalp hematoma",
      "Observation for 4-6 hours with serial neurological assessments before considering CT",
      "Discharge home with head injury precautions and return instructions",
      "MRI of the brain to avoid radiation exposure in a pediatric patient"
    ],
    correctAnswer: 1,
    rationaleLong: "The PECARN (Pediatric Emergency Care Applied Research Network) head injury prediction rule is a validated clinical decision tool for identifying children at low risk for clinically important traumatic brain injury (ciTBI) who may safely avoid CT scanning. For children aged 2 years and older, the PECARN algorithm considers: GCS less than 15, signs of altered mental status, signs of basilar skull fracture, history of loss of consciousness, vomiting, severe mechanism of injury, and severe headache. This patient has a GCS of 14 (not 15), which places her in the intermediate risk group under PECARN. She also has a significant mechanism (fall greater than 1.5 meters/5 feet). However, she has no altered mental status, no signs of basilar skull fracture, and no witnessed LOC. For intermediate-risk patients, PECARN recommends either observation for a minimum of 4-6 hours with serial neurological assessments OR CT scanning based on clinical judgment, physician experience, and parental preference. The observation approach is preferred when possible to minimize unnecessary radiation exposure. In the pediatric population, CT radiation carries a measurable increased lifetime cancer risk, making judicious use important. If the child remains neurologically stable during the observation period with a stable or improving GCS, CT can be safely deferred. However, any deterioration during observation (worsening GCS, new vomiting, altered behavior) should prompt immediate CT scanning. The emergency nurse plays a critical role in performing and documenting serial neurological assessments during the observation period, typically every 30-60 minutes.",
    learningObjective: "Apply the PECARN head injury decision rule to guide CT imaging decisions in pediatric head trauma",
    blueprintCategory: "Trauma",
    subtopic: "pediatric trauma",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "PECARN intermediate-risk patients may be observed rather than automatically scanned — observation with serial assessments is a valid management strategy",
    clinicalPearls: [
      "PECARN rule identifies children at very low risk for ciTBI who can safely avoid CT",
      "Intermediate-risk patients can be observed for 4-6 hours with serial neurological assessments",
      "Pediatric CT radiation carries measurable increased lifetime cancer risk"
    ],
    safetyNote: "Any neurological deterioration during observation mandates immediate CT scanning — do not delay imaging if the child's condition worsens",
    distractorRationales: [
      "Immediate CT is not mandated for intermediate-risk PECARN patients — observation is an appropriate alternative",
      "Discharge without observation is premature for a child with GCS 14 and significant mechanism",
      "MRI is not the standard emergent imaging modality for acute traumatic brain injury evaluation"
    ],
    lessonPath: "/emergency/lessons/pediatric-trauma"
  },
  {
    stem: "An 82-year-old female on warfarin (INR 3.8) presents after a ground-level fall, striking her head on a tile floor. She initially appears well with GCS 15 and a small frontal hematoma. Two hours later, her GCS drops to 12 and she becomes increasingly confused. What is the most likely explanation for this delayed deterioration?",
    options: [
      "Post-concussive syndrome with delayed symptom onset",
      "Expanding subdural hematoma potentiated by anticoagulation",
      "Epidural hematoma from middle meningeal artery rupture",
      "Cerebral vasospasm from subarachnoid hemorrhage"
    ],
    correctAnswer: 1,
    rationaleLong: "This clinical scenario represents a classic presentation of delayed neurological deterioration in an anticoagulated elderly patient with traumatic brain injury. Subdural hematomas (SDH) are the most common intracranial hemorrhage in elderly patients after minor trauma, and anticoagulation significantly increases both the risk of SDH and the rate of hematoma expansion. The mechanism involves tearing of bridging veins between the dura and arachnoid mater. In elderly patients, brain atrophy increases the distance these bridging veins must span, making them more susceptible to shearing with even minimal trauma such as a ground-level fall. The supratherapeutic INR of 3.8 further compounds the risk by impairing the coagulation cascade, allowing continued bleeding and hematoma expansion. The 'lucid interval' — initial normal presentation followed by delayed deterioration — is a hallmark of expanding intracranial hemorrhage. While classically associated with epidural hematomas, in elderly anticoagulated patients, subdural hematomas are far more common. Epidural hematomas are rare in the elderly because the dura is tightly adherent to the skull. The emergency nurse must recognize that elderly anticoagulated patients are at extremely high risk for delayed deterioration and require CT imaging regardless of initial presentation, serial neurological monitoring, and urgent anticoagulation reversal. For warfarin reversal, 4-factor prothrombin complex concentrate (PCC) provides rapid INR correction (within 15-30 minutes) and is preferred over fresh frozen plasma. Vitamin K should also be administered for sustained effect but takes 6-24 hours.",
    learningObjective: "Recognize delayed neurological deterioration in anticoagulated elderly patients with head trauma and initiate anticoagulation reversal",
    blueprintCategory: "Trauma",
    subtopic: "geriatric trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Ground-level falls in anticoagulated elderly patients can cause life-threatening intracranial hemorrhage — never dismiss as 'minor' trauma",
    clinicalPearls: [
      "Subdural hematomas are the most common intracranial hemorrhage in elderly patients",
      "Brain atrophy increases bridging vein vulnerability to shearing forces",
      "4-factor PCC provides rapid warfarin reversal within 15-30 minutes"
    ],
    safetyNote: "All anticoagulated elderly patients with head trauma require CT imaging and close monitoring regardless of initial GCS — delayed deterioration is common",
    distractorRationales: [
      "Post-concussive syndrome causes symptoms but not acute GCS decline — this presentation suggests structural pathology",
      "Epidural hematomas are rare in elderly patients because the dura is tightly adherent to the skull",
      "Cerebral vasospasm occurs days after SAH, not within hours of minor trauma"
    ],
    lessonPath: "/emergency/lessons/geriatric-trauma"
  },
  {
    stem: "A 77-year-old male with a history of hip replacement presents after a fall at home. He has right hip pain and external rotation of the right lower extremity. X-ray confirms a periprosthetic femur fracture. The nurse notes his home medications include metoprolol, lisinopril, and rivaroxaban. Which medication is most important to address in the context of potential surgical intervention?",
    options: [
      "Metoprolol — beta-blocker may cause intraoperative bradycardia",
      "Lisinopril — ACE inhibitor may cause intraoperative hypotension",
      "Rivaroxaban — direct oral anticoagulant increases perioperative bleeding risk",
      "All medications should be held equally before surgery"
    ],
    correctAnswer: 2,
    rationaleLong: "Rivaroxaban is a direct oral anticoagulant (DOAC) — specifically a factor Xa inhibitor — that significantly increases perioperative bleeding risk. In the context of a periprosthetic fracture requiring surgical fixation, managing anticoagulation is the most critical medication consideration. DOACs including rivaroxaban, apixaban, edoxaban (factor Xa inhibitors) and dabigatran (direct thrombin inhibitor) pose unique challenges in the emergency surgical setting. Unlike warfarin, standard coagulation tests (PT/INR, aPTT) do not reliably measure DOAC anticoagulant effect. Anti-factor Xa levels can be obtained for rivaroxaban/apixaban, but may not be rapidly available. The half-life of rivaroxaban is approximately 5-9 hours in patients with normal renal function, but may be prolonged in elderly patients with decreased renal clearance. For emergent surgery with active bleeding, andexanet alfa is the specific reversal agent for factor Xa inhibitors, though it is expensive and may not be available at all facilities. Four-factor PCC can also be used as an alternative. The emergency nurse should document the last dose of rivaroxaban, obtain renal function studies (as renal impairment prolongs DOAC half-life), communicate the anticoagulation status to the surgical team and anesthesia, and prepare for potential reversal if emergent surgery is planned. While metoprolol and lisinopril are relevant perioperative medications, they do not carry the same acute hemorrhagic risk as a DOAC in the surgical setting. Geriatric patients on anticoagulants represent a high-risk population that requires careful medication reconciliation in the ED.",
    learningObjective: "Identify DOAC anticoagulation as a critical perioperative concern and understand reversal strategies",
    blueprintCategory: "Trauma",
    subtopic: "geriatric trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Standard coagulation tests (PT/INR, aPTT) do NOT reliably measure DOAC effect — anti-factor Xa levels are needed for rivaroxaban",
    clinicalPearls: [
      "Andexanet alfa is the specific reversal agent for factor Xa inhibitors (rivaroxaban, apixaban)",
      "DOAC half-life is prolonged in elderly patients with decreased renal function",
      "Document the last dose timing of DOACs — this critically impacts surgical planning"
    ],
    safetyNote: "Always perform medication reconciliation for anticoagulants in geriatric trauma — communicate findings to surgical and anesthesia teams immediately",
    distractorRationales: [
      "While beta-blockers affect heart rate, this is a manageable anesthetic concern, not a hemorrhagic risk",
      "ACE inhibitors may cause mild hypotension but are not associated with surgical hemorrhage",
      "Not all medications carry equal perioperative risk — anticoagulants are the priority concern"
    ],
    lessonPath: "/emergency/lessons/geriatric-trauma"
  },
  {
    stem: "A 40-year-old male construction worker presents after a nail gun discharged into his left hand, with the nail embedded in the thenar eminence. There is no active hemorrhage, and sensation and motor function of all fingers are intact. The X-ray shows the nail in the soft tissue without bone involvement. What is the appropriate nursing management?",
    options: [
      "Remove the nail at bedside, irrigate the wound, and apply a sterile dressing",
      "Leave the nail in place, obtain surgical consultation, administer tetanus prophylaxis, and provide pain management",
      "Push the nail through to the other side for easier removal",
      "Apply ice and discharge with oral antibiotics and follow-up instructions"
    ],
    correctAnswer: 1,
    rationaleLong: "Embedded foreign bodies such as nail gun injuries require careful management. The nail should be left in place because removal at bedside carries risks of uncontrolled hemorrhage if the nail is tamponading a vascular injury, tendon or nerve damage during removal, and fragment retention. Although neurovascular function appears intact distally, the proximity of the nail to critical structures in the thenar eminence (median nerve recurrent motor branch, princeps pollicis artery, flexor pollicis brevis) warrants surgical consultation for controlled removal under direct visualization or with fluoroscopic guidance. The emergency nurse's management priorities include: stabilizing the embedded nail to prevent movement (padding around it with gauze and securing with a cup or splint), administering tetanus prophylaxis (the wound is tetanus-prone — deep, contaminated with a foreign body), providing adequate pain management (consider digital nerve block or systemic analgesia), obtaining appropriate imaging (X-ray to assess bone involvement and nail position), documenting neurovascular status thoroughly, and preparing the patient for possible operative intervention. Tetanus prophylaxis follows the standard guidelines: if the patient has completed the primary series and the last booster was more than 5 years ago for a tetanus-prone wound, administer Td or Tdap. If immunization history is unknown or incomplete, administer both Td/Tdap and tetanus immune globulin (TIG). Pushing the nail through is never appropriate as it would create a second wound tract and risk additional structural damage.",
    learningObjective: "Manage embedded foreign body injuries with appropriate stabilization, consultation, and tetanus prophylaxis",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Never remove an embedded foreign body at bedside without surgical consultation — the object may be tamponading a vascular injury",
    clinicalPearls: [
      "Stabilize embedded foreign bodies in place with padding and splinting",
      "Nail gun injuries are tetanus-prone wounds requiring prophylaxis",
      "The thenar eminence contains the median nerve recurrent motor branch — injury causes loss of thumb opposition"
    ],
    safetyNote: "Always assess and document distal neurovascular status before and after any intervention on extremity foreign body injuries",
    distractorRationales: [
      "Bedside removal risks uncontrolled hemorrhage and structural damage without direct visualization",
      "Pushing the nail through creates additional tissue damage and is never appropriate",
      "Discharge without evaluation of embedded foreign body and surgical consultation is inappropriate"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 22-year-old female arrives via EMS after a rollover ATV accident. She is 26 weeks pregnant. She has a scalp laceration, left wrist deformity, and complains of abdominal pain. Vital signs: HR 108 bpm, BP 100/68 mmHg, RR 22. The fetal heart rate is 155 bpm. What is the priority consideration unique to managing this pregnant trauma patient?",
    options: [
      "The fetus should be delivered immediately via emergency cesarean section",
      "Position the patient with a left lateral tilt to prevent aortocaval compression and treat the mother to treat the fetus",
      "Fetal monitoring takes priority over maternal assessment and stabilization",
      "Avoid all radiographic imaging to protect the fetus from radiation"
    ],
    correctAnswer: 1,
    rationaleLong: "The fundamental principle of managing pregnant trauma patients is that the best treatment for the fetus is optimal resuscitation of the mother. After approximately 20 weeks of gestation, the gravid uterus can compress the inferior vena cava and abdominal aorta when the patient is supine, reducing venous return by up to 30% and causing supine hypotensive syndrome. This is particularly dangerous in the trauma setting where hypovolemia may already be present. The patient should be positioned with a 15-30 degree left lateral tilt using a wedge under the right hip, or the uterus can be manually displaced to the left. This maneuver relieves aortocaval compression and can improve cardiac output by 25-30%. The trauma primary survey follows standard ABCDE principles with the mother as the primary patient. Maternal vital signs must be interpreted carefully: normal pregnancy produces a physiological tachycardia (increase of 10-15 bpm), increased blood volume (30-50% increase by the third trimester), and decreased blood pressure. This means a pregnant patient may lose 30-35% of blood volume before showing signs of hemodynamic compromise — fetal distress often manifests BEFORE maternal vital sign changes. The fetal heart rate of 155 bpm is within normal range (110-160 bpm). While fetal monitoring is important, it should not delay maternal assessment. Radiographic imaging should be performed as clinically indicated — the radiation dose from diagnostic imaging is far below the threshold for fetal harm, and failure to diagnose maternal injuries poses a greater risk to both mother and fetus. Rh status should be determined, and Rh-negative mothers should receive RhoGAM to prevent isoimmunization from potential fetomaternal hemorrhage.",
    learningObjective: "Apply trauma management principles specific to pregnant patients including positioning and maternal-first resuscitation",
    blueprintCategory: "Trauma",
    subtopic: "multi-system trauma",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Pregnant patients can lose 30-35% of blood volume before showing hemodynamic changes due to physiological hypervolemia — fetal distress often appears first",
    clinicalPearls: [
      "Left lateral tilt after 20 weeks prevents aortocaval compression and improves cardiac output 25-30%",
      "The best treatment for the fetus is optimal resuscitation of the mother",
      "Physiological hypervolemia of pregnancy masks hemorrhage — fetal distress appears before maternal vital sign changes"
    ],
    safetyNote: "Determine Rh status and administer RhoGAM to Rh-negative pregnant trauma patients to prevent isoimmunization",
    distractorRationales: [
      "Emergency cesarean is not indicated with a viable fetal heart rate and a mother who can be resuscitated",
      "Maternal assessment always takes priority — the mother is the primary patient",
      "Withholding indicated imaging endangers both mother and fetus — diagnostic radiation doses are below fetal harm thresholds"
    ],
    lessonPath: "/emergency/lessons/multi-system-trauma"
  },
  {
    stem: "A 55-year-old male is brought to the ED after a house fire. He was found in an enclosed room. He has singed nasal hairs, facial burns, carbonaceous sputum, and a hoarse voice. His SpO2 reads 98% on room air. Despite the normal SpO2 reading, the nurse is concerned about inhalation injury. Why is the pulse oximetry reading potentially misleading?",
    options: [
      "Pulse oximetry is always inaccurate in burn patients due to peripheral vasoconstriction",
      "Carbon monoxide binds to hemoglobin with higher affinity than oxygen, and standard pulse oximetry cannot distinguish carboxyhemoglobin from oxyhemoglobin",
      "The SpO2 sensor is affected by soot on the patient's skin",
      "Inhalation injury only affects the lower airways, which are not reflected in SpO2"
    ],
    correctAnswer: 1,
    rationaleLong: "Standard pulse oximetry measures the ratio of oxygenated to deoxygenated hemoglobin using two wavelengths of light (660nm red and 940nm infrared). However, carboxyhemoglobin (hemoglobin bound to carbon monoxide) absorbs light at wavelengths similar to oxyhemoglobin, causing standard pulse oximeters to read carboxyhemoglobin as oxyhemoglobin. This means a patient with significant carbon monoxide poisoning can have a falsely normal or falsely elevated SpO2 reading on standard pulse oximetry, even as their actual oxygen-carrying capacity is severely compromised. Carbon monoxide binds to hemoglobin with approximately 200-250 times the affinity of oxygen, displacing oxygen and shifting the oxyhemoglobin dissociation curve to the left (reducing oxygen delivery to tissues). This patient has multiple signs of inhalation injury: enclosed space exposure, singed nasal hairs, facial burns, carbonaceous sputum, and hoarseness (indicating supraglottic edema). The normal SpO2 of 98% is unreliable and should not reassure the clinician. Co-oximetry (available on arterial blood gas analyzers) can specifically measure carboxyhemoglobin, methemoglobin, and true oxyhemoglobin levels. The emergency nurse should obtain an ABG with co-oximetry, administer 100% oxygen via non-rebreather mask (which reduces the half-life of carboxyhemoglobin from 4-6 hours to 60-90 minutes), and prepare for possible intubation given the signs of airway compromise. The hoarse voice and carbonaceous sputum indicate impending airway obstruction from progressive edema — early intubation is essential before the airway becomes unmanageable.",
    learningObjective: "Recognize the limitations of pulse oximetry in carbon monoxide exposure and understand the need for co-oximetry",
    blueprintCategory: "Trauma",
    subtopic: "burn injuries",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Normal SpO2 does NOT rule out carbon monoxide poisoning — standard pulse oximetry cannot distinguish carboxyhemoglobin from oxyhemoglobin",
    clinicalPearls: [
      "CO binds hemoglobin with 200-250 times the affinity of oxygen",
      "100% O2 reduces CO half-life from 4-6 hours to 60-90 minutes",
      "Co-oximetry on ABG is required to measure true carboxyhemoglobin levels"
    ],
    safetyNote: "Signs of inhalation injury (singed nasal hairs, carbonaceous sputum, hoarseness) mandate early intubation before progressive edema makes it impossible",
    distractorRationales: [
      "While vasoconstriction may affect signal quality, the primary issue here is carboxyhemoglobin interference",
      "Soot on skin may affect signal but can be wiped off — the fundamental issue is CO-hemoglobin spectral similarity",
      "Inhalation injury affects both upper and lower airways and CO poisoning is a systemic process"
    ],
    lessonPath: "/emergency/lessons/burn-injuries"
  },
  {
    stem: "A 30-year-old male sustains circumferential deep partial-thickness and full-thickness burns to his right forearm after an industrial accident. Two hours post-injury, the nurse notes increasing pain, diminished radial pulse, paresthesias in the hand, and tense swelling of the forearm. What is the priority intervention?",
    options: [
      "Elevate the extremity above heart level and apply ice packs",
      "Prepare for emergent escharotomy to relieve compartment pressure",
      "Administer IV morphine for pain management and reassess",
      "Apply topical silver sulfadiazine and wrap with elastic bandage"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is developing compartment syndrome secondary to circumferential burn eschar. Circumferential deep partial-thickness and full-thickness burns create a rigid, non-compliant eschar (burned tissue) that acts as a constrictive band. As post-burn edema develops underneath the inelastic eschar, the compartment pressure rises, compressing neurovascular structures and threatening limb viability. The classic signs of compartment syndrome are represented by the 6 P's: Pain (especially pain out of proportion or with passive stretch), Paresthesias (nerve ischemia), Paralysis (late finding), Pulselessness (late finding — a diminished pulse is concerning), Pallor, and Poikilothermia. This patient demonstrates pain, diminished radial pulse, paresthesias, and tense swelling — these findings collectively indicate vascular compromise requiring emergent intervention. An escharotomy is a bedside surgical procedure in which longitudinal incisions are made through the full thickness of the burn eschar along the medial and lateral aspects of the extremity to release the constrictive effect and restore perfusion. Unlike fasciotomy, escharotomy only cuts through the eschar and does not penetrate the deep fascia. Full-thickness burn eschar has no sensation, so the procedure can be performed without anesthesia. The emergency nurse's role includes preparing sterile instruments, monitoring the limb for return of perfusion post-procedure, documenting neurovascular checks before and after, and preparing for potential blood loss. Elevation alone is insufficient when compartment syndrome is established. Ice is contraindicated in burns. Pain management alone does not address the mechanical cause of compression.",
    learningObjective: "Recognize burn-related compartment syndrome and the need for emergent escharotomy in circumferential burns",
    blueprintCategory: "Trauma",
    subtopic: "burn injuries",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Escharotomy cuts through eschar only (not fascia) and requires no anesthesia in full-thickness burns because the tissue has no sensation",
    clinicalPearls: [
      "Circumferential burns create a constrictive eschar that can cause compartment syndrome as edema develops",
      "The 6 P's of compartment syndrome: Pain, Paresthesias, Paralysis, Pulselessness, Pallor, Poikilothermia",
      "Escharotomy incisions are made along medial and lateral aspects of the affected extremity"
    ],
    safetyNote: "Pulselessness is a LATE finding of compartment syndrome — intervention should occur with earlier signs such as pain and paresthesias",
    distractorRationales: [
      "Elevation alone cannot overcome the constrictive pressure of circumferential eschar — mechanical release is required",
      "Pain management treats symptoms but does not address the vascular compromise threatening the limb",
      "Wrapping with elastic bandage would worsen compression and is absolutely contraindicated"
    ],
    lessonPath: "/emergency/lessons/burn-injuries"
  },
  {
    stem: "A 25-year-old male is brought to the ED after a diving accident in shallow water. He is awake and reports inability to move his arms or legs. He has priapism and is breathing using only his diaphragm with paradoxical abdominal breathing. His vital signs show HR 52 bpm and BP 82/50 mmHg. At what level of spinal cord injury are these findings most consistent?",
    options: [
      "T6 spinal cord injury with autonomic dysreflexia",
      "C3-C5 spinal cord injury with neurogenic shock",
      "L1-L2 spinal cord injury with cauda equina syndrome",
      "T12 spinal cord injury with conus medullaris syndrome"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with high cervical spinal cord injury complicated by neurogenic shock. The clinical findings are diagnostic: quadriplegia (inability to move arms and legs indicates a cervical injury above C5), diaphragmatic breathing with paradoxical abdominal breathing pattern (the diaphragm is innervated by the phrenic nerve, C3-C5 — if breathing is diaphragmatic only, this indicates the injury is at or near C3-C5, with loss of intercostal muscle function), priapism (an involuntary sustained erection resulting from loss of sympathetic tone to the penile vasculature — a classic sign of spinal cord injury), and neurogenic shock (bradycardia and hypotension from disruption of sympathetic outflow). Neurogenic shock results from the loss of sympathetic nervous system tone below the level of injury. In high spinal cord injuries (above T6), the sympathetic chain is disrupted, causing unopposed vagal (parasympathetic) activity leading to bradycardia, peripheral vasodilation causing hypotension, and loss of the ability to vasoconstrict below the injury. This is distinct from spinal shock, which refers to the temporary loss of all neurological function below the injury level, including reflexes. The cardiovascular findings of neurogenic shock (warm, dry skin below the injury with bradycardia and hypotension) help differentiate it from hemorrhagic shock (cool, clammy skin with tachycardia and hypotension). Management includes judicious fluid resuscitation, vasopressors (norepinephrine or phenylephrine to restore SVR), atropine for symptomatic bradycardia, strict spinal motion restriction, and anticipating the need for ventilatory support as the patient may fatigue with diaphragmatic-only breathing.",
    learningObjective: "Identify the level and complications of cervical spinal cord injury including neurogenic shock",
    blueprintCategory: "Trauma",
    subtopic: "spinal cord injury",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Neurogenic shock causes BRADYCARDIA and hypotension (loss of sympathetic tone) — hemorrhagic shock causes TACHYCARDIA and hypotension (sympathetic activation)",
    clinicalPearls: [
      "Phrenic nerve (C3-C5) innervates the diaphragm — diaphragmatic-only breathing localizes the injury to C3-C5",
      "Priapism is a classic sign of spinal cord injury indicating loss of sympathetic tone",
      "Neurogenic shock: bradycardia + hypotension + warm dry skin (below injury level)"
    ],
    safetyNote: "Patients with C3-C5 injuries are at risk for respiratory failure — prepare for intubation and have a difficult airway cart available",
    distractorRationales: [
      "Autonomic dysreflexia occurs in chronic (not acute) SCI above T6 and causes hypertension, not hypotension",
      "L1-L2 injury would produce lower extremity deficits only, not quadriplegia or respiratory compromise",
      "T12 conus medullaris syndrome affects bowel/bladder and lower extremities, not upper extremities or respiration"
    ],
    lessonPath: "/emergency/lessons/spinal-cord-injury"
  },
  {
    stem: "A 45-year-old female presents after a motorcycle collision with an open tibial fracture (bone visible through a 4cm wound). The wound is contaminated with road debris. The nurse notes brisk bleeding from the wound site. After controlling hemorrhage, what are the priority nursing interventions for this open fracture?",
    options: [
      "Reduce the fracture by pushing the bone back under the skin, irrigate with normal saline, and splint",
      "Apply a moist sterile dressing over the wound, splint the extremity in position found, administer IV antibiotics and tetanus prophylaxis",
      "Pack the wound tightly with gauze, apply a tourniquet proximal to the fracture, and prepare for immediate amputation",
      "Irrigate the wound with povidone-iodine solution, reduce the fracture, and apply a circumferential cast"
    ],
    correctAnswer: 1,
    rationaleLong: "Open fractures require a systematic approach focused on hemorrhage control, wound protection, infection prevention, and immobilization. After hemorrhage control is achieved, the priority nursing interventions include: (1) Applying a moist sterile dressing over the wound — saline-moistened gauze prevents tissue desiccation while maintaining a clean environment. Do NOT attempt to reduce the fracture or push the bone back into the wound, as this can introduce contaminants deeper into the tissue and trap debris; (2) Splinting the extremity in the position found — immobilization reduces pain, prevents further soft tissue damage, minimizes hemorrhage from bone ends, and prevents further contamination; (3) Administering IV antibiotics — early antibiotic administration within 1 hour significantly reduces infection rates in open fractures. First-generation cephalosporin (cefazolin) is standard for Gustilo-Anderson Grade I-II fractures, with the addition of an aminoglycoside (gentamicin) for Grade III fractures and penicillin if soil contamination is present (for Clostridium coverage); (4) Tetanus prophylaxis — open fractures are tetanus-prone wounds; (5) Documenting neurovascular status — assess and document distal pulses, sensation, motor function, and capillary refill before and after splinting. The Gustilo-Anderson classification guides management: Grade I (wound less than 1cm, clean), Grade II (wound 1-10cm, moderate contamination), Grade IIIA (adequate soft tissue coverage despite extensive wound), Grade IIIB (requires soft tissue coverage procedure), Grade IIIC (associated vascular injury requiring repair). This patient's 4cm contaminated wound with visible bone is consistent with Grade II-IIIA, requiring surgical irrigation and debridement in the operating room.",
    learningObjective: "Manage open fractures with appropriate wound care, antibiotic prophylaxis, and immobilization",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Never attempt to reduce an open fracture in the ED — pushing bone back under skin can introduce contaminants and worsen contamination",
    clinicalPearls: [
      "IV antibiotics within 1 hour significantly reduce open fracture infection rates",
      "Gustilo-Anderson classification guides antibiotic selection: Grade I-II = cefazolin; Grade III add gentamicin",
      "Moist sterile dressing prevents tissue desiccation while maintaining wound cleanliness"
    ],
    safetyNote: "Always assess and document distal neurovascular status before AND after splinting — changes may indicate vascular compromise requiring intervention",
    distractorRationales: [
      "Fracture reduction in the ED risks introducing contaminants deeper into the wound",
      "Tourniquet and preparation for amputation is excessive for a manageable open fracture with controlled hemorrhage",
      "Povidone-iodine is cytotoxic to wound tissues, and circumferential casting prevents wound assessment and risks compartment syndrome"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 60-year-old male presents to the ED after a witnessed seizure followed by a fall. He has a large occipital scalp laceration that is bleeding profusely. Despite direct pressure with gauze, the bleeding continues. His hemoglobin returns at 9.2 g/dL (baseline unknown). What is the most effective technique for controlling this scalp hemorrhage?",
    options: [
      "Apply a scalp tourniquet using a Penrose drain",
      "Perform Raney clip application along wound edges",
      "Use running locked sutures or staples for rapid wound closure to achieve hemostasis",
      "Pack the wound with hemostatic gauze and apply a pressure bandage"
    ],
    correctAnswer: 2,
    rationaleLong: "Scalp lacerations can produce dramatic and life-threatening hemorrhage due to the rich vascular supply of the scalp. The scalp has five layers (remembered by the mnemonic SCALP: Skin, Connective tissue, Aponeurosis, Loose areolar tissue, Periosteum), and the dense arterial network within the connective tissue layer does not vasoconstrict effectively after injury because the vessels are tethered within the dense connective tissue. This tethering prevents the normal retraction and constriction of severed vessels that occurs in other body tissues, leading to continued bleeding despite direct pressure. The most effective ED intervention for controlling scalp hemorrhage is rapid wound closure using running locked sutures or staples. Staples are particularly efficient and can achieve hemostasis within minutes. The mechanical closure compresses the wound edges together, occluding the severed vessels. This technique is faster than individual interrupted sutures and more effective than direct pressure alone. Before closure, the wound should be briefly explored for skull fractures or foreign bodies, and irrigated. Raney clips are specialized surgical instruments used in the operating room during craniotomy, not typically available or appropriate in the ED setting. A scalp tourniquet using a Penrose drain can be used as a temporizing measure but is uncomfortable and can slip. Hemostatic packing may help but does not address the tethered vessel anatomy as effectively as wound closure. The emergency nurse should prepare for rapid closure by having staple guns or suture material ready, irrigating the wound, and monitoring the patient for signs of hypovolemia.",
    learningObjective: "Manage scalp hemorrhage using rapid wound closure techniques and understand scalp vascular anatomy",
    blueprintCategory: "Trauma",
    subtopic: "multi-system trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Scalp vessels do not vasoconstrict after injury because they are tethered in dense connective tissue — direct pressure alone may be insufficient",
    clinicalPearls: [
      "SCALP layers: Skin, Connective tissue, Aponeurosis, Loose areolar tissue, Periosteum",
      "Scalp arteries are tethered in connective tissue preventing normal vasoconstriction after injury",
      "Rapid stapling is the most time-efficient method for scalp hemorrhage control in the ED"
    ],
    safetyNote: "Always explore scalp lacerations for underlying skull fractures before closure — depressed fractures may be hidden beneath scalp wounds",
    distractorRationales: [
      "Scalp tourniquets are difficult to maintain, uncomfortable, and less effective than wound closure",
      "Raney clips are specialized OR instruments not typically available in the ED setting",
      "Hemostatic packing is less effective for tethered scalp vessels compared to mechanical wound closure"
    ],
    lessonPath: "/emergency/lessons/multi-system-trauma"
  },
  {
    stem: "A 33-year-old male presents after a blast injury from an IED during a military training exercise. He has bilateral tympanic membrane perforation, blast lung injury with bilateral pulmonary contusions, and fragment wounds to the lower extremities. He is hypoxic with SpO2 88% on 15L non-rebreather. What is a critical consideration when managing this patient's ventilatory needs?",
    options: [
      "High-frequency oscillatory ventilation is the standard of care for blast lung",
      "If mechanical ventilation is needed, use low tidal volumes (6 mL/kg) and avoid high PEEP to prevent barotrauma in injured lung parenchyma",
      "Non-invasive positive pressure ventilation (BiPAP) is preferred to avoid intubation",
      "The patient should be hyperventilated to compensate for metabolic acidosis"
    ],
    correctAnswer: 1,
    rationaleLong: "Blast lung injury (BLI) is the most common fatal primary blast injury and requires careful ventilatory management. The blast wave creates differential pressures at air-tissue interfaces within the lung, causing alveolar hemorrhage, pulmonary contusion, and pneumothoraces. The injured lung parenchyma is extremely susceptible to barotrauma (pressure-related injury) and volutrauma (volume-related injury) from mechanical ventilation. If mechanical ventilation is required, lung-protective strategies must be employed: low tidal volumes (6 mL/kg of ideal body weight) based on the ARDSNet protocol reduce ventilator-induced lung injury; PEEP should be titrated cautiously — while some PEEP may be needed to maintain oxygenation, high PEEP in the setting of BLI can worsen air leaks and cause tension pneumothorax in patients with existing pulmonary tears; peak airway pressures should be limited (plateau pressures less than 30 cmH2O). Bilateral TM perforation is a marker of significant blast pressure exposure and strongly correlates with blast lung injury — approximately 50% of patients with BLI have TM rupture. The emergency nurse should anticipate chest tube placement (bilateral if indicated) before or simultaneously with intubation, as positive pressure ventilation can convert a simple pneumothorax to a tension pneumothorax. Non-invasive positive pressure ventilation is relatively contraindicated in BLI because positive pressure can worsen air leaks and cause gastric distension in a patient who may have concurrent hollow viscus injury. Hyperventilation is not therapeutic and can worsen cerebral ischemia if concurrent TBI is present. The nurse should also be aware of secondary (fragment) and tertiary (displacement) blast injuries requiring simultaneous assessment.",
    learningObjective: "Apply lung-protective ventilation strategies in blast lung injury and recognize associated blast injury patterns",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Bilateral TM perforation is a marker of significant blast exposure and strongly correlates with blast lung injury — always assess for BLI when TM rupture is present",
    clinicalPearls: [
      "Blast lung injury occurs at air-tissue interfaces from differential blast wave pressures",
      "Low tidal volume ventilation (6 mL/kg IBW) reduces ventilator-induced lung injury",
      "Place chest tubes before positive pressure ventilation in blast lung to prevent tension pneumothorax"
    ],
    safetyNote: "Anticipate bilateral pneumothoraces in blast lung — positive pressure ventilation can convert simple to tension pneumothorax",
    distractorRationales: [
      "High-frequency oscillatory ventilation is not the standard of care and lacks evidence of benefit in BLI",
      "NIPPV is relatively contraindicated due to risk of worsening air leaks and gastric distension",
      "Hyperventilation is not therapeutic and may cause cerebral vasoconstriction if concurrent TBI is present"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "A 48-year-old female unrestrained driver presents after striking the steering wheel in a frontal collision. She has a sternal fracture visible on chest X-ray. Her ECG shows new-onset atrial fibrillation with a rapid ventricular response. Troponin I is elevated at 2.8 ng/mL. What is the most concerning complication the nurse should monitor for?",
    options: [
      "Delayed hemothorax from intercostal artery injury",
      "Blunt cardiac injury with risk of dysrhythmia deterioration and cardiac pump failure",
      "Esophageal rupture from the steering wheel impact",
      "Fat embolism syndrome from the sternal fracture"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has sustained blunt cardiac injury (BCI), previously termed myocardial contusion. The mechanism (steering wheel impact to the sternum), sternal fracture, ECG abnormalities (new atrial fibrillation), and elevated troponin are all consistent with BCI. Blunt cardiac injury exists on a spectrum from minor contusion with ECG changes to full-thickness myocardial rupture. The most common clinical manifestation is dysrhythmia, with atrial fibrillation, premature ventricular contractions, and right bundle branch block being most frequent. The right ventricle is most commonly affected because of its anterior position against the sternum. The elevated troponin (2.8 ng/mL) indicates myocardial cell damage and necrosis, similar to an acute myocardial infarction. However, the setting of trauma distinguishes this from coronary artery disease. The priority concern is that BCI can progress to more serious complications including: sustained ventricular dysrhythmias (ventricular tachycardia, ventricular fibrillation) that can be fatal; cardiac pump failure if a significant portion of the myocardium is contused; valvular injury (particularly the tricuspid valve) with acute regurgitation; or cardiac tamponade from myocardial rupture. The emergency nurse should place the patient on continuous cardiac monitoring for a minimum of 24-48 hours, obtain serial ECGs, trend troponin levels, and prepare for echocardiography to assess ventricular wall motion, valvular function, and pericardial effusion. Hemodynamic monitoring is essential, and the nurse should have emergency dysrhythmia medications (amiodarone, lidocaine) readily available. The sternal fracture itself should raise suspicion for other associated injuries including thoracic aortic injury, pulmonary contusion, and tracheobronchial disruption.",
    learningObjective: "Identify blunt cardiac injury from mechanism, clinical findings, and diagnostic markers, and anticipate serious complications",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "The right ventricle is most commonly injured in BCI because of its anterior position — new right-sided ECG changes are concerning",
    clinicalPearls: [
      "Sternal fracture + ECG changes + elevated troponin = blunt cardiac injury until proven otherwise",
      "Right ventricle is most commonly affected due to anterior position behind the sternum",
      "Continuous cardiac monitoring for 24-48 hours is standard for confirmed BCI"
    ],
    safetyNote: "BCI can progress to lethal ventricular dysrhythmias — continuous cardiac monitoring and readily available emergency medications are essential",
    distractorRationales: [
      "Hemothorax from intercostal injury is possible but is not the primary concern with these cardiac findings",
      "Esophageal rupture from blunt trauma is extremely rare compared to BCI with a sternal fracture",
      "Fat embolism from sternal fractures is essentially unheard of — it occurs with long bone and pelvic fractures"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "A 38-year-old male is brought in by EMS after a bar fight. He has a stab wound to the right upper quadrant of the abdomen. He is hemodynamically unstable with HR 134 bpm and BP 72/40 mmHg. The FAST exam is positive for free fluid. The trauma surgeon is in the operating room with another case. What is the ED nurse's immediate priority?",
    options: [
      "Wait for the surgeon before initiating any resuscitation",
      "Activate massive transfusion protocol, establish large-bore IV access, and prepare for emergent laparotomy",
      "Perform a diagnostic peritoneal lavage to confirm the need for surgery",
      "Obtain a CT scan of the abdomen to grade the liver injury before calling the surgeon"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with penetrating abdominal trauma with hemodynamic instability — a surgical emergency requiring immediate intervention. The stab wound to the right upper quadrant is concerning for liver injury, which is the most commonly injured organ in penetrating abdominal trauma. The combination of hemodynamic instability (HR 134, BP 72/40) and positive FAST (free intraperitoneal fluid) in the setting of penetrating abdominal trauma mandates emergent operative intervention. The emergency nurse's priorities include: (1) Activating the massive transfusion protocol — this patient needs blood products, not crystalloid. The MTP provides a balanced ratio (1:1:1) of PRBCs, FFP, and platelets; (2) Establishing at least two large-bore (14-16 gauge) IV lines or obtaining intraosseous access if IV access is difficult; (3) Communicating urgently with the trauma surgeon about the need for emergent laparotomy — this case takes priority and may require calling in another surgeon; (4) Preparing the patient for the operating room (consent if possible, pre-operative labs including type and crossmatch, Foley catheter, NG tube, pre-operative antibiotics); (5) Maintaining damage control resuscitation principles: permissive hypotension (targeting SBP 80-90 mmHg), warming blood products, limiting crystalloid. CT scanning is contraindicated in hemodynamically unstable trauma patients because it delays definitive surgical care, requires transport to the scanner (where the patient may decompensate), and does not change the management plan. DPL has been largely replaced by FAST and is not needed when FAST is already positive. Waiting for the surgeon without initiating resuscitation wastes critical time.",
    learningObjective: "Initiate damage control resuscitation for hemodynamically unstable penetrating abdominal trauma",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "CT scan is CONTRAINDICATED in hemodynamically unstable trauma patients — it delays definitive surgical care",
    clinicalPearls: [
      "Liver is the most commonly injured organ in penetrating abdominal trauma",
      "Hemodynamic instability + positive FAST + penetrating mechanism = emergent laparotomy",
      "Massive transfusion protocol provides 1:1:1 ratio of PRBCs:FFP:platelets"
    ],
    safetyNote: "Never delay resuscitation while waiting for surgical availability — initiate MTP and communicate urgency to all available surgical staff",
    distractorRationales: [
      "Waiting for the surgeon without initiating resuscitation is dangerous and delays care",
      "DPL is unnecessary when FAST is already positive — it does not change management",
      "CT scanning in hemodynamically unstable patients delays definitive surgical care and risks patient decompensation"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 70-year-old female with osteoporosis presents after a ground-level fall with right hip pain. She is unable to bear weight. The right lower extremity is shortened and externally rotated. X-ray confirms a displaced femoral neck fracture. The nurse is preparing the patient for admission. What is the most important time-sensitive consideration for this patient's outcome?",
    options: [
      "Surgical repair should be performed within 24-48 hours to reduce morbidity and mortality",
      "The patient should be placed in skeletal traction for 2 weeks before surgery",
      "MRI should be performed to evaluate the extent of soft tissue injury",
      "The patient should be observed for 72 hours before deciding on surgical intervention"
    ],
    correctAnswer: 0,
    rationaleLong: "Hip fractures in elderly patients are a time-sensitive orthopedic emergency. Current evidence strongly supports surgical repair within 24-48 hours of presentation to reduce morbidity and mortality. Delays beyond 48 hours are associated with increased rates of: deep vein thrombosis and pulmonary embolism (immobility), pneumonia (immobility and atelectasis), pressure injuries (immobility), urinary tract infections (catheterization), delirium (hospital environment plus pain), and overall mortality (30-day mortality increases approximately 1% for each day of delay). For this patient with a displaced femoral neck fracture, the surgical options include hemiarthroplasty or total hip arthroplasty (for displaced fractures in elderly patients), as opposed to internal fixation which is preferred for non-displaced fractures. The emergency nurse's role includes: obtaining pre-operative labs (CBC, BMP, coagulation studies, type and crossmatch), ECG and chest X-ray for pre-operative clearance, pain management (femoral nerve block is ideal for hip fractures — provides excellent analgesia without systemic sedation effects), DVT prophylaxis initiation, pressure injury prevention (off-loading the sacrum), delirium prevention strategies (orientation, family presence, sleep hygiene), foley catheter placement, and communication with orthopedics regarding the time-sensitive nature of surgical repair. Skeletal traction is no longer standard practice for hip fractures and delays surgery. Extended observation without repair increases complications.",
    learningObjective: "Recognize the time-sensitive nature of hip fracture repair in elderly patients and initiate appropriate pre-operative preparation",
    blueprintCategory: "Trauma",
    subtopic: "geriatric trauma",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Each day of surgical delay increases 30-day mortality by approximately 1% in elderly hip fracture patients",
    clinicalPearls: [
      "Hip fracture surgical repair within 24-48 hours reduces morbidity and mortality",
      "Femoral nerve block provides excellent analgesia for hip fractures without systemic sedation",
      "Displaced femoral neck fractures in elderly patients typically require arthroplasty rather than internal fixation"
    ],
    safetyNote: "Implement pressure injury prevention immediately — elderly hip fracture patients are at extremely high risk for sacral pressure injuries during the pre-operative period",
    distractorRationales: [
      "Skeletal traction is an outdated approach that delays surgical repair and increases complications",
      "MRI is not routinely needed when X-ray confirms the fracture — it delays surgical planning",
      "Extended observation increases morbidity from immobility complications without improving outcomes"
    ],
    lessonPath: "/emergency/lessons/geriatric-trauma"
  },
  {
    stem: "A 16-year-old male football player is brought to the ED after a helmet-to-helmet collision. He briefly lost consciousness on the field. In the ED, his GCS is 15, but he reports headache, dizziness, and feeling 'foggy.' He had a similar concussion 3 weeks ago. What is the most critical concern for this patient?",
    options: [
      "Post-concussive syndrome requiring symptom management",
      "Second impact syndrome with risk of catastrophic cerebral edema",
      "Chronic traumatic encephalopathy (CTE) development",
      "Epidural hematoma requiring emergency surgical evacuation"
    ],
    correctAnswer: 1,
    rationaleLong: "Second impact syndrome (SIS) is a rare but potentially fatal condition that occurs when an individual sustains a second concussion before fully recovering from the first. The pathophysiology involves loss of cerebral autoregulation — the brain's ability to control its own blood flow is impaired after the initial concussion. When a second impact occurs during this vulnerable period, the brain loses the ability to regulate intracranial blood volume, leading to rapid, diffuse cerebral edema, markedly elevated intracranial pressure, and potential uncal herniation. SIS can progress from alert and oriented to comatose within minutes, and mortality approaches 50% with an additional 50% of survivors having permanent severe disability. This patient is at extreme risk because: (1) he had a concussion only 3 weeks ago (most concussions require a minimum of 7-10 days for basic recovery, and full recovery may take weeks to months in adolescents), (2) he sustained a second head impact before the first injury resolved, and (3) adolescents are particularly vulnerable to SIS due to the still-developing brain. Current return-to-play protocols (Consensus Statement on Concussion in Sport) mandate complete symptom resolution at rest, followed by a graduated return-to-activity protocol over a minimum of 6 stages, with each stage lasting at least 24 hours. No athlete should return to contact sports while still symptomatic from a prior concussion. The emergency nurse should perform serial neurological assessments, prepare for potential rapid deterioration, obtain emergent CT if symptoms worsen, and educate the patient and family about the catastrophic risk. This patient should be admitted for observation given the second impact concern.",
    learningObjective: "Identify second impact syndrome risk in athletes with recurrent concussions and understand return-to-play protocols",
    blueprintCategory: "Trauma",
    subtopic: "traumatic brain injury",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Second impact syndrome can progress from GCS 15 to herniation within MINUTES — a normal GCS does not ensure safety",
    clinicalPearls: [
      "Second impact syndrome has approximately 50% mortality and 50% severe disability rate among survivors",
      "Adolescents are particularly vulnerable to second impact syndrome",
      "Return-to-play protocols require complete symptom resolution before any graduated return to activity"
    ],
    safetyNote: "No athlete should return to contact sports while symptomatic from a prior concussion — communicate this to the patient, family, and coaching staff",
    distractorRationales: [
      "Post-concussive syndrome is a concern but not the most critical — SIS is potentially lethal",
      "CTE is a chronic degenerative process, not an acute emergency concern",
      "Epidural hematoma is possible but the most critical concern with a recent prior concussion is specifically SIS"
    ],
    lessonPath: "/emergency/lessons/traumatic-brain-injury"
  },
  {
    stem: "A 29-year-old male presents to the ED after being shot in the right groin with a handgun. He has active arterial bleeding from the wound that is not controlled by direct pressure. The wound is at the inguinal crease, proximal to where a tourniquet can be effectively placed. What is the most appropriate hemorrhage control intervention?",
    options: [
      "Apply a second tourniquet above the first and increase pressure",
      "Pack the wound with hemostatic gauze (such as QuikClot Combat Gauze) and apply direct pressure for a minimum of 3 minutes",
      "Apply a blood pressure cuff as a tourniquet at the waist level",
      "Clamp the visible bleeding vessel with a hemostat"
    ],
    correctAnswer: 1,
    rationaleLong: "Junctional hemorrhage — bleeding from areas where the extremities meet the trunk (groin, axilla, neck) — represents a significant challenge because these anatomical locations are not amenable to conventional tourniquet application. The inguinal region contains the femoral artery and vein, and penetrating injuries here can produce rapid exsanguination. When a wound is too proximal for tourniquet placement, wound packing with hemostatic gauze is the recommended intervention. Hemostatic agents such as QuikClot Combat Gauze (kaolin-impregnated) or Celox (chitosan-based) accelerate clot formation when packed directly into the wound cavity. The technique requires: (1) packing the gauze deep into the wound cavity, directly against the bleeding source; (2) filling the entire wound cavity tightly with gauze; (3) applying firm direct pressure for a minimum of 3 minutes (some agents recommend 5 minutes); (4) maintaining pressure and reassessing. This technique is endorsed by the Committee on Tactical Combat Casualty Care (TCCC) and the American College of Surgeons Stop the Bleed campaign. The evidence shows that hemostatic gauze combined with wound packing achieves hemostasis in 70-90% of junctional hemorrhage cases. Alternative junctional hemorrhage control devices include the SAM Junctional Tourniquet and the Combat Ready Clamp, which are specifically designed for inguinal and axillary hemorrhage but may not be available in all EDs. Blind clamping of vessels is strongly discouraged as it risks damage to adjacent nerves and veins and may incompletely control hemorrhage. A blood pressure cuff at the waist is not effective and cannot generate sufficient pressure.",
    learningObjective: "Manage junctional hemorrhage using wound packing with hemostatic agents when tourniquets cannot be applied",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Junctional hemorrhage (groin, axilla, neck) cannot be controlled by conventional tourniquets — wound packing with hemostatic gauze is the primary intervention",
    clinicalPearls: [
      "Hemostatic gauze must be packed deep into the wound cavity directly against the bleeding source",
      "Maintain direct pressure for minimum 3-5 minutes after packing for hemostatic agent activation",
      "QuikClot Combat Gauze (kaolin) and Celox (chitosan) are the most common hemostatic agents"
    ],
    safetyNote: "Never release direct pressure to 'check if bleeding has stopped' before the recommended hold time — premature release disrupts clot formation",
    distractorRationales: [
      "A tourniquet cannot be placed proximal enough for an inguinal wound — there is insufficient tissue between the wound and the trunk",
      "A blood pressure cuff cannot generate adequate circumferential pressure at the waist to compress the femoral vessels",
      "Blind vessel clamping risks nerve injury, incomplete hemostasis, and is not recommended in the ED setting"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 42-year-old male presents to the ED with a large laceration to the left neck in Zone II (angle of the mandible to the cricoid cartilage) after a knife attack. He has an expanding hematoma, hoarse voice, and subcutaneous emphysema. He is hemodynamically stable with controlled bleeding. Which combination of structures is at highest risk in this zone?",
    options: [
      "Vertebral artery and spinal cord",
      "Carotid artery, jugular vein, trachea, and esophagus",
      "Submandibular gland and facial nerve",
      "Thoracic duct and subclavian vessels"
    ],
    correctAnswer: 1,
    rationaleLong: "Zone II of the neck extends from the cricoid cartilage to the angle of the mandible and contains the highest concentration of vital structures, making penetrating injuries to this zone particularly dangerous. The major structures at risk include: the common carotid artery and its bifurcation (injury can cause hemorrhagic shock, stroke, or air embolism), the internal jugular vein (hemorrhage and air embolism), the cervical trachea and larynx (airway compromise — hoarseness in this patient suggests laryngeal involvement), the esophagus (perforation risk — often clinically occult initially), the vagus nerve, the recurrent laryngeal nerve (hoarseness), and the cervical spinal cord. The clinical findings support multi-structure involvement: the expanding hematoma suggests vascular injury (carotid or jugular), hoarseness indicates laryngeal or recurrent laryngeal nerve involvement, and subcutaneous emphysema suggests aerodigestive tract violation (tracheal or esophageal injury). Zone II injuries have historically been managed with mandatory surgical exploration, though current practice increasingly uses CT angiography for stable patients to guide selective operative management. The neck is divided into three zones for penetrating injuries: Zone I (sternal notch to cricoid cartilage — contains subclavian vessels, brachiocephalic vessels, trachea, esophagus, thoracic duct, lung apices), Zone II (cricoid to angle of mandible — most accessible surgically), and Zone III (angle of mandible to skull base — contains distal carotid, vertebral arteries, jugular veins, and cranial nerves). The emergency nurse should prepare for potential emergent surgical exploration, maintain airway vigilance (prepare for difficult airway management), establish large-bore IV access, and maintain cervical spine precautions.",
    learningObjective: "Identify the anatomical zones of the neck and structures at risk in Zone II penetrating injuries",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Zone II is the most surgically accessible neck zone — Zones I and III require angiographic evaluation due to difficult surgical access",
    clinicalPearls: [
      "Zone II: cricoid to angle of mandible — contains carotid, jugular, trachea, esophagus",
      "Subcutaneous emphysema in neck trauma indicates aerodigestive tract violation",
      "Hoarseness after neck trauma suggests laryngeal or recurrent laryngeal nerve injury"
    ],
    safetyNote: "Penetrating neck injuries with expanding hematoma may compromise the airway at any time — prepare for emergent surgical airway",
    distractorRationales: [
      "Vertebral artery is primarily a Zone III concern; spinal cord is protected by the vertebral column posteriorly",
      "Submandibular gland and facial nerve are Zone III structures above the angle of mandible",
      "Thoracic duct and subclavian vessels are Zone I structures below the cricoid cartilage"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 5-year-old child is brought to the ED after being found submerged in a backyard pool for an estimated 3-4 minutes. Bystander CPR was performed. On arrival, the child has spontaneous respirations but is obtunded. SpO2 is 82% on bag-valve-mask with 15L O2. Temperature is 34.2°C (93.6°F). What is the priority nursing intervention?",
    options: [
      "Immediate active rewarming with forced-air warming blankets before any airway intervention",
      "Prepare for endotracheal intubation, support oxygenation and ventilation, and initiate gentle rewarming",
      "Perform a CT head to evaluate for anoxic brain injury before deciding on airway management",
      "Administer activated charcoal in case of concurrent ingestion while submerged"
    ],
    correctAnswer: 1,
    rationaleLong: "This drowning victim presents with significant respiratory compromise (SpO2 82% despite supplemental oxygen) and altered mental status, indicating the need for definitive airway management. Drowning causes lung injury through aspiration of water, which disrupts surfactant function, causes atelectasis, alveolar collapse, ventilation-perfusion mismatch, and intrapulmonary shunting. The net effect is severe hypoxemia resistant to supplemental oxygen alone. The obtunded mental status (likely GCS less than 8) combined with the severe hypoxemia mandates endotracheal intubation. The key pathophysiology difference between freshwater and saltwater drowning (osmotic effects on surfactant vs. fluid shift into alveoli) is clinically irrelevant — both result in similar lung injury patterns requiring similar management. Post-intubation, positive end-expiratory pressure (PEEP) is essential to recruit collapsed alveoli and improve oxygenation — start with 5 cmH2O and titrate up as needed. Lung-protective ventilation strategies should be employed (6 mL/kg tidal volumes). The mild hypothermia (34.2°C) should be addressed with gentle rewarming, but should NOT delay airway management. Passive rewarming (removing wet clothing, warm blankets) and active external rewarming (forced-air warming devices) can be performed simultaneously with resuscitation. The brain cooling from submersion may actually provide some neuroprotective benefit in children — avoid aggressive hyperthermia. The emergency nurse should also prepare for potential gastric decompression (swallowed water causes gastric distension impeding ventilation), continuous cardiac monitoring (hypothermia and hypoxia predispose to dysrhythmias), and serial neurological assessments. All drowning victims with any respiratory symptoms should be observed for a minimum of 6-8 hours due to risk of delayed pulmonary edema.",
    learningObjective: "Manage pediatric drowning victims with airway management, oxygenation support, and appropriate rewarming",
    blueprintCategory: "Trauma",
    subtopic: "pediatric trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Airway management takes priority over rewarming — never delay intubation to correct hypothermia in a drowning victim",
    clinicalPearls: [
      "PEEP is essential in drowning to recruit collapsed alveoli — surfactant washout causes widespread atelectasis",
      "All symptomatic drowning victims require 6-8 hours minimum observation for delayed pulmonary edema",
      "Hypothermia in pediatric drowning may provide some neuroprotection — avoid aggressive rewarming to hyperthermia"
    ],
    safetyNote: "Decompress the stomach early in drowning victims — gastric distension from swallowed water impedes ventilation and increases aspiration risk",
    distractorRationales: [
      "Rewarming should not delay definitive airway management in a hypoxic obtunded patient",
      "CT head is not indicated before securing the airway — imaging can wait until the patient is stabilized",
      "Activated charcoal has no role in drowning management"
    ],
    lessonPath: "/emergency/lessons/pediatric-trauma"
  },
  {
    stem: "A 50-year-old male presents to the ED after a motorcycle crash at highway speed. He was wearing a helmet. He has bilateral rib fractures (ribs 4-9 on the left, 5-8 on the right), bilateral pulmonary contusions, and a sternal fracture. His pain score is 9/10, and he is splinting with shallow respirations. RR 28, SpO2 91% on 4L nasal cannula. What is the most important intervention to prevent respiratory failure in this patient?",
    options: [
      "Immediate intubation and mechanical ventilation",
      "Aggressive multimodal pain management including thoracic epidural analgesia to restore adequate ventilation",
      "Application of an external chest binder to stabilize the rib fractures",
      "Prone positioning to improve ventilation of the posterior lung segments"
    ],
    correctAnswer: 1,
    rationaleLong: "Pain management is the cornerstone of preventing respiratory failure in patients with multiple rib fractures. The pathophysiology of respiratory deterioration involves a vicious cycle: rib fractures cause severe pain → pain causes splinting (voluntary restriction of chest wall movement) → splinting leads to shallow breathing (reduced tidal volumes) → reduced tidal volumes cause atelectasis → atelectasis impairs gas exchange → atelectasis leads to pneumonia → pneumonia and respiratory failure → need for mechanical ventilation, which carries its own complications. Breaking this cycle with aggressive pain management is the single most important intervention. Thoracic epidural analgesia is considered the gold standard for pain management in multiple rib fractures. It provides continuous, titratable analgesia directly to the thoracic dermatomes without systemic sedation, allowing the patient to breathe deeply, cough effectively, and participate in pulmonary hygiene (incentive spirometry, chest physiotherapy). If epidural is contraindicated or unavailable, alternative regional techniques include paravertebral nerve blocks, serratus anterior plane blocks, or intercostal nerve blocks. A multimodal systemic approach may include IV acetaminophen, NSAIDs (if renal function is adequate), low-dose ketamine infusion, and judicious use of opioids. Immediate intubation is not indicated if adequate analgesia can restore ventilation — mechanical ventilation in rib fracture patients increases complications including ventilator-associated pneumonia. External chest binding is absolutely contraindicated as it restricts chest wall expansion and worsens hypoventilation. Prone positioning is used in ARDS patients on mechanical ventilation, not in spontaneously breathing patients.",
    learningObjective: "Implement multimodal pain management strategies to prevent respiratory failure in patients with multiple rib fractures",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Pain management — not intubation — is the priority intervention for rib fractures with respiratory compromise. Mechanical ventilation increases complications.",
    clinicalPearls: [
      "Thoracic epidural analgesia is the gold standard for multiple rib fracture pain management",
      "The pain-splinting-atelectasis-pneumonia cycle is the primary cause of respiratory failure in rib fractures",
      "Each additional rib fracture increases pneumonia risk by approximately 27% and mortality by 19%"
    ],
    safetyNote: "External chest binding is ABSOLUTELY CONTRAINDICATED in rib fractures — it restricts chest expansion and worsens hypoventilation",
    distractorRationales: [
      "Immediate intubation is premature if adequate analgesia can restore ventilation — mechanical ventilation increases complications",
      "External chest binding restricts chest wall movement and is contraindicated",
      "Prone positioning is for mechanically ventilated ARDS patients, not spontaneously breathing rib fracture patients"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "A 34-year-old male presents with a high-pressure paint injection injury to his left index finger. The entry wound appears small (2mm puncture) and the finger appears only mildly swollen. The patient rates his pain as 4/10. Based on this presentation, what is the critical nursing assessment finding?",
    options: [
      "The injury is minor given the small wound size and moderate pain — clean and dress the wound",
      "The small wound appearance is deceptive — high-pressure injection injuries cause extensive deep tissue damage requiring emergent surgical consultation",
      "Apply ice and elevate the hand to reduce swelling",
      "Perform a digital nerve block for pain management and discharge with antibiotics"
    ],
    correctAnswer: 1,
    rationaleLong: "High-pressure injection injuries are surgical emergencies that are frequently underestimated due to their deceptively benign external appearance. These injuries occur when industrial equipment (paint guns, grease guns, fuel injectors) operating at pressures of 2,000-10,000+ PSI inject material through a tiny entry wound into the deep tissues of the digit or hand. The injected material rapidly dissects along tendon sheaths, neurovascular bundles, and fascial planes, causing widespread deep tissue damage far beyond what the small entry wound suggests. The pathological process involves: immediate mechanical tissue disruption from the high-pressure injection, chemical inflammation from the injected substance (paints, solvents, grease), vascular compromise as the material compresses digital arteries within the confined spaces of the digit, and progressive edema further compromising circulation. Without emergent surgical debridement (within 6-10 hours), amputation rates range from 30-60% depending on the substance injected. Oil-based paints and organic solvents have the highest amputation rates (up to 80%) due to intense chemical inflammation. The emergency nurse must recognize this mechanism as a surgical emergency regardless of external appearance, obtain an X-ray (which may show radio-opaque material tracking along tissue planes), avoid digital blocks (which can further increase compartment pressure within the digit), elevate the hand, administer systemic analgesia, update tetanus status, start broad-spectrum antibiotics, and obtain emergent hand surgery consultation. The key teaching point is that the wound appearance does NOT correlate with the severity of deep tissue damage in high-pressure injection injuries.",
    learningObjective: "Recognize high-pressure injection injuries as surgical emergencies despite deceptively benign external appearance",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "The external wound size does NOT reflect the severity of deep tissue damage in high-pressure injection injuries — these are surgical emergencies",
    clinicalPearls: [
      "High-pressure injection injuries have 30-60% amputation rates without emergent surgical debridement",
      "Oil-based paints and organic solvents have the highest amputation rates (up to 80%)",
      "X-ray may show radio-opaque material tracking along tissue planes and tendon sheaths"
    ],
    safetyNote: "Avoid digital nerve blocks in high-pressure injection injuries — the additional volume increases compartment pressure and worsens ischemia",
    distractorRationales: [
      "Treating this as a minor wound based on appearance will result in delayed surgical consultation and likely amputation",
      "Ice causes vasoconstriction worsening already compromised digital circulation",
      "Digital nerve blocks increase compartment pressure and discharge without surgical evaluation risks limb loss"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 27-year-old female presents after a sexual assault. She has facial contusions, a torn frenulum, and vaginal lacerations. She is trembling and tearful. The forensic nurse examiner is not available for 2 hours. What is the emergency nurse's priority in this situation?",
    options: [
      "Begin the forensic examination immediately to preserve evidence",
      "Provide trauma-informed care, treat acute injuries, preserve evidence by having the patient not eat/drink/wash, and coordinate forensic examination timing with the patient",
      "Focus exclusively on emotional support and defer all physical examination until the forensic nurse arrives",
      "Obtain a detailed history of the assault for the medical record before any examination"
    ],
    correctAnswer: 1,
    rationaleLong: "Sexual assault patients require a trauma-informed approach that balances acute medical care, evidence preservation, emotional support, and patient autonomy. The emergency nurse's priorities include: (1) Immediate life threats — assess and treat any acute medical injuries (facial contusions may indicate significant head trauma, the torn frenulum may indicate forced oral assault, and vaginal lacerations may cause significant hemorrhage); (2) Trauma-informed care — approach the patient with sensitivity, explain all procedures before performing them, ask permission before touching the patient, allow the patient to make choices about their care to restore a sense of control, and use a quiet, private environment; (3) Evidence preservation — while awaiting the forensic nurse examiner (FNE), instruct the patient not to eat, drink, smoke, urinate, defecate, wash, brush teeth, change clothes, or comb hair, as these activities can destroy trace evidence. If clothing must be removed for medical treatment, place each item in a separate paper bag (not plastic, which promotes bacterial growth and degrades DNA evidence); (4) Documentation — document objective findings using neutral, clinical language. Document the patient's words in quotation marks. Use body diagrams for injury documentation; (5) Coordination — communicate with the FNE about timing and inform the patient about the forensic examination process, allowing them to consent to or decline any portion; (6) Support services — contact victim advocacy services, offer emergency contraception, provide STI prophylaxis per protocol. The torn frenulum (frenulum of the lip) is a recognized indicator of forced oral penetration and should be carefully documented. The emergency nurse should never begin the forensic evidence collection process (SAFE kit) unless trained and certified — improper evidence collection can compromise legal proceedings.",
    learningObjective: "Provide trauma-informed care for sexual assault patients including evidence preservation and patient autonomy",
    blueprintCategory: "Trauma",
    subtopic: "multi-system trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Evidence preservation instructions (no eating/drinking/washing) should be given immediately, but the forensic exam should only be performed by a trained forensic nurse examiner",
    clinicalPearls: [
      "Place removed clothing in separate PAPER bags — plastic bags degrade DNA evidence",
      "Torn frenulum of the lip is a recognized indicator of forced oral penetration",
      "Patient autonomy is paramount — the patient may consent to or decline any portion of the examination"
    ],
    safetyNote: "Screen for strangulation in all sexual assault patients — ask about neck pain, voice changes, difficulty swallowing, and petechiae above the clavicles",
    distractorRationales: [
      "Only trained and certified forensic nurse examiners should perform the forensic evidence collection (SAFE kit)",
      "Deferring all physical examination is inappropriate — acute medical injuries may require immediate treatment",
      "Pressuring the patient for a detailed assault history re-traumatizes the patient — let the forensic examiner conduct the forensic interview"
    ],
    lessonPath: "/emergency/lessons/multi-system-trauma"
  },
  {
    stem: "A 44-year-old male is brought to the ED by EMS after a trench collapse at a construction site. He was buried under soil for approximately 30 minutes with both lower extremities compressed. He is now extricated and alert. Prior to extrication, EMS administered a 1L NS bolus. The nurse is aware that the greatest immediate threat after extrication is related to which electrolyte abnormality?",
    options: [
      "Hypernatremia causing cerebral dehydration",
      "Hyperkalemia causing lethal cardiac dysrhythmias",
      "Hypocalcemia causing tetany and seizures",
      "Hypomagnesemia causing torsades de pointes"
    ],
    correctAnswer: 1,
    rationaleLong: "Crush syndrome occurs when prolonged compression of muscle tissue (typically greater than 1 hour, but can occur with shorter durations depending on the force) causes rhabdomyolysis — the breakdown of skeletal muscle fibers releasing their intracellular contents into the systemic circulation upon reperfusion. The most immediately life-threatening release is potassium. Normal intracellular potassium concentration is approximately 150 mEq/L — roughly 35 times the normal serum concentration of 3.5-5.0 mEq/L. When crushed muscle tissue is reperfused upon extrication, massive amounts of potassium flood the circulation, potentially causing lethal hyperkalemia within minutes. Hyperkalemia affects cardiac conduction by decreasing the resting membrane potential, which can lead to peaked T waves, widened QRS complex, sine wave pattern, ventricular fibrillation, and asystole. Other dangerous intracellular contents released include myoglobin (which causes renal tubular obstruction and acute kidney injury), phosphate (which chelates calcium causing secondary hypocalcemia), lactic acid (causing metabolic acidosis), and creatine kinase. The emergency nurse's management priorities include: (1) Continuous cardiac monitoring starting before extrication if possible; (2) Pre-extrication fluid loading (ideally 1-1.5 L/hour of NS before and during extrication to dilute the potassium surge); (3) Calcium gluconate or calcium chloride at bedside for cardiac membrane stabilization if hyperkalemic ECG changes develop; (4) Sodium bicarbonate to treat acidosis and shift potassium intracellularly; (5) Insulin with dextrose for potassium shifting; (6) Aggressive IV fluid resuscitation (target urine output 200-300 mL/hour) to prevent myoglobin-induced renal failure; (7) Avoid tourniquets on crushed extremities as this delays reperfusion and concentrates toxins.",
    learningObjective: "Recognize hyperkalemia as the most immediate life-threatening complication of crush injury reperfusion",
    blueprintCategory: "Trauma",
    subtopic: "crush injuries",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "The most dangerous moment in crush injury is the EXTRICATION — reperfusion releases lethal potassium levels. Pre-extrication fluid loading is critical.",
    clinicalPearls: [
      "Intracellular potassium is ~150 mEq/L — reperfusion of crushed muscle causes massive hyperkalemia",
      "Pre-extrication fluid loading (1-1.5 L/hr NS) dilutes the potassium surge upon reperfusion",
      "Target urine output 200-300 mL/hour to prevent myoglobin-induced acute kidney injury"
    ],
    safetyNote: "Have calcium gluconate at bedside BEFORE extrication — hyperkalemic cardiac arrest can occur within minutes of reperfusion",
    distractorRationales: [
      "Hypernatremia is not the immediate life-threatening concern in crush syndrome",
      "Hypocalcemia occurs secondarily from phosphate release but is not the immediate lethal threat",
      "Hypomagnesemia is not a primary feature of crush syndrome"
    ],
    lessonPath: "/emergency/lessons/crush-injuries"
  },
  {
    stem: "A 65-year-old male on aspirin and clopidogrel presents after a fall, striking the back of his head. He is anticoagulated for coronary stents placed 6 months ago. His initial GCS is 15 with a small occipital hematoma. CT head shows a small subdural hematoma with no midline shift. The neurosurgery team recommends non-operative management with close monitoring. What is the critical nursing assessment schedule?",
    options: [
      "Neurological checks every 4 hours for 24 hours",
      "Neurological assessments including GCS, pupillary response, and motor strength every 1-2 hours for at least 24 hours with immediate CT for any deterioration",
      "A single repeat CT at 24 hours with no interval neurological monitoring",
      "Neurological checks every shift (every 12 hours) with repeat CT in 1 week"
    ],
    correctAnswer: 1,
    rationaleLong: "Non-operative management of subdural hematoma in an anticoagulated patient requires vigilant, frequent neurological monitoring because antiplatelet therapy (aspirin and clopidogrel) increases the risk of hematoma expansion. Dual antiplatelet therapy inhibits platelet aggregation through two different mechanisms: aspirin irreversibly inhibits cyclooxygenase-1 (blocking thromboxane A2 production), while clopidogrel irreversibly inhibits the P2Y12 ADP receptor on platelets. The combined effect significantly impairs primary hemostasis, increasing the risk of continued or expanding intracranial hemorrhage. Neurological assessments should be performed every 1-2 hours for at least the first 24 hours and should include: (1) Glasgow Coma Scale — a decrease of 2 or more points warrants immediate CT; (2) Pupillary response — size, shape, reactivity bilaterally (asymmetry suggests uncal herniation); (3) Motor strength and symmetry — new weakness suggests expanding hematoma; (4) Level of consciousness — the most sensitive early indicator of deterioration; (5) Vital signs — Cushing's triad (hypertension, bradycardia, irregular respirations) is a late sign of increased ICP. Any neurological deterioration mandates immediate repeat CT scan, neurosurgical notification, and consideration of platelet transfusion to reverse the antiplatelet effect. The decision regarding antiplatelet reversal is complex: platelet transfusion can help restore hemostasis but carries the risk of stent thrombosis — this decision should be made in consultation with neurosurgery and cardiology. The patient's coronary stent history adds a critical dimension: premature discontinuation of dual antiplatelet therapy within the first 6-12 months after stent placement carries a 5-30% risk of stent thrombosis, which has a 20-40% mortality rate.",
    learningObjective: "Implement appropriate neurological monitoring frequency for non-operative subdural hematoma in anticoagulated patients",
    blueprintCategory: "Trauma",
    subtopic: "traumatic brain injury",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Antiplatelet reversal for intracranial hemorrhage must be balanced against the risk of stent thrombosis — this requires multidisciplinary decision-making",
    clinicalPearls: [
      "Dual antiplatelet therapy significantly increases risk of subdural hematoma expansion",
      "A GCS decrease of 2 or more points warrants immediate repeat CT scan",
      "Level of consciousness is the most sensitive early indicator of neurological deterioration"
    ],
    safetyNote: "Do not independently reverse antiplatelet therapy — stent thrombosis from premature antiplatelet cessation carries 20-40% mortality",
    distractorRationales: [
      "Every 4 hours is insufficient monitoring frequency for an anticoagulated patient with intracranial hemorrhage",
      "A single CT at 24 hours without interval monitoring risks missing rapid deterioration",
      "Every 12-hour checks are dangerously infrequent for an anticoagulated patient with active intracranial hemorrhage"
    ],
    lessonPath: "/emergency/lessons/traumatic-brain-injury"
  },
  {
    stem: "A 31-year-old male presents to the ED after a skateboarding accident with a posterior shoulder dislocation. The mechanism was a fall onto an outstretched hand with the arm in internal rotation. X-ray shows the 'lightbulb sign' on AP view. The nurse is preparing for reduction. What clinical finding distinguishes a posterior from an anterior shoulder dislocation?",
    options: [
      "The arm is held in external rotation and abduction",
      "The arm is locked in internal rotation and adduction with a flattened anterior shoulder contour",
      "There is a prominent bump on the lateral aspect of the shoulder",
      "The patient can freely move the arm in all directions despite pain"
    ],
    correctAnswer: 1,
    rationaleLong: "Posterior shoulder dislocations are uncommon (approximately 2-4% of all shoulder dislocations) but are frequently missed on initial evaluation, with missed diagnosis rates as high as 50-60%. Understanding the clinical and radiographic distinguishing features is essential. In a posterior dislocation, the humeral head displaces posteriorly behind the glenoid fossa. The arm is locked in internal rotation and adduction — the patient cannot externally rotate the arm. The anterior shoulder appears flattened (loss of normal anterior deltoid fullness) because the humeral head has moved posteriorly, while a posterior fullness may be palpable behind the shoulder. This contrasts with anterior dislocation (95% of shoulder dislocations) where the arm is held in external rotation and abduction, with a palpable humeral head anteriorly and loss of normal deltoid contour laterally. The 'lightbulb sign' on AP X-ray is pathognomonic for posterior dislocation: the internally rotated humerus projects as a rounded, symmetric humeral head resembling a lightbulb because the greater tuberosity is superimposed on the humeral head rather than seen in lateral profile. Posterior dislocations are classically associated with seizures, electrocution, and high-energy trauma (the forceful internal rotation from muscle contraction drives the humeral head posteriorly). Associated injuries include reverse Hill-Sachs lesion (impaction fracture of the anteromedial humeral head) and posterior labral tear. The emergency nurse should assess and document axillary nerve function (sensation over the lateral deltoid — the regimental badge area) and distal neurovascular status before and after reduction attempts.",
    learningObjective: "Distinguish posterior from anterior shoulder dislocation by clinical presentation and radiographic findings",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Posterior shoulder dislocations are missed 50-60% of the time — the lightbulb sign on AP X-ray and inability to externally rotate are key diagnostic clues",
    clinicalPearls: [
      "Posterior dislocations: arm locked in internal rotation/adduction; anterior: external rotation/abduction",
      "Lightbulb sign on AP X-ray is pathognomonic for posterior dislocation",
      "Classic causes: seizures, electrocution, and high-energy falls with internal rotation"
    ],
    safetyNote: "Always assess axillary nerve function (lateral deltoid sensation) before and after shoulder reduction — axillary nerve injury is the most common neurological complication",
    distractorRationales: [
      "External rotation and abduction describe anterior dislocation, not posterior",
      "A lateral bump may be seen with acromioclavicular separation, not posterior shoulder dislocation",
      "The arm is locked and cannot move freely in dislocation — inability to externally rotate is the hallmark"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 72-year-old female with dementia is brought from a nursing facility after staff noticed increased agitation and refusal to bear weight on the right leg. There is no reported trauma. Examination reveals right leg shortening and external rotation. X-ray confirms a right femoral neck fracture. What should the nurse consider regarding the mechanism of injury?",
    options: [
      "Pathological fracture from osteoporosis — the fracture caused the fall, not vice versa",
      "The patient is simply confused and the fracture is an old injury",
      "The fracture must have occurred from a high-energy mechanism that was not witnessed",
      "Femoral neck fractures in elderly patients always require a fall mechanism"
    ],
    correctAnswer: 0,
    rationaleLong: "In elderly patients with significant osteoporosis, pathological fractures can occur with minimal or no trauma — the weakened bone fractures spontaneously or with normal physiological loading (such as standing up from a chair or turning in bed), and the resulting fracture CAUSES the fall rather than the fall causing the fracture. This concept of 'fracture preceding fall' is well-established in geriatric orthopedics and changes the clinical approach. The nursing facility reported no observed trauma, and the patient's dementia makes history unreliable. The classic presentation of a femoral neck fracture — shortened, externally rotated leg with inability to bear weight — is present regardless of whether the fracture preceded or followed a fall. For the emergency nurse, several important considerations arise: (1) Evaluate for underlying bone pathology — osteoporosis screening (DEXA scan as outpatient), vitamin D levels, calcium levels, and consideration of pathological fracture from metastatic disease (particularly in elderly patients with known or suspected malignancy); (2) Assess for elder abuse or neglect — unexplained injuries in nursing facility residents require assessment per mandatory reporting obligations, similar to pediatric abuse assessment; (3) Fall risk assessment — identify and address modifiable fall risk factors (medications, orthostatic hypotension, visual impairment, footwear, environmental hazards); (4) Pain assessment in cognitively impaired patients — use validated non-verbal pain assessment tools such as the PAINAD (Pain Assessment in Advanced Dementia) scale, as patients with dementia may not verbalize pain but manifest it through agitation, guarding, or behavioral changes. The agitation described may be the patient's expression of pain from the fracture.",
    learningObjective: "Recognize pathological fractures in elderly patients and apply appropriate pain assessment for cognitively impaired patients",
    blueprintCategory: "Trauma",
    subtopic: "geriatric trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "In elderly osteoporotic patients, the fracture may CAUSE the fall rather than the fall causing the fracture — this concept changes the diagnostic approach",
    clinicalPearls: [
      "Pathological fractures in osteoporotic bone can occur with minimal or no trauma",
      "PAINAD scale is validated for pain assessment in patients with advanced dementia",
      "Always screen for elder abuse/neglect in nursing facility residents with unexplained injuries"
    ],
    safetyNote: "Use non-verbal pain assessment tools (PAINAD) for cognitively impaired patients — agitation may be the only manifestation of pain",
    distractorRationales: [
      "A hip fracture cannot be dismissed as an old injury — the acute inability to bear weight indicates a new fracture",
      "High-energy mechanisms are not required for fractures in severely osteoporotic bone",
      "Spontaneous fractures from osteoporosis are well-documented and do not require a fall mechanism"
    ],
    lessonPath: "/emergency/lessons/geriatric-trauma"
  },
  {
    stem: "A 10-year-old child presents after a bicycle accident with a displaced supracondylar humerus fracture. The nurse assesses the injured arm and finds the radial pulse is absent, the hand is cool and pale, and the child cannot extend the wrist or fingers. Which neurovascular structure is most likely compromised?",
    options: [
      "Ulnar nerve and ulnar artery",
      "Median nerve and brachial artery",
      "Radial nerve and radial artery",
      "Anterior interosseous nerve and brachial artery"
    ],
    correctAnswer: 3,
    rationaleLong: "Supracondylar humerus fractures are the most common elbow fracture in children and carry significant risk of neurovascular compromise. The anterior interosseous nerve (AIN) — a pure motor branch of the median nerve — and the brachial artery are the structures most commonly injured in displaced extension-type supracondylar fractures. The AIN innervates the flexor pollicis longus, the lateral half of the flexor digitorum profundus (index and middle fingers), and the pronator quadratus. However, the clinical presentation described — inability to extend the wrist and fingers — actually points to the radial nerve (posterior interosseous nerve). The absent radial pulse and cool, pale hand indicate brachial artery compromise. Let me clarify the precise clinical correlation: the brachial artery courses directly anterior to the distal humerus at the level of the supracondylar region and is tethered by fascial attachments, making it susceptible to compression, kinking, or laceration by displaced fracture fragments. The anterior interosseous nerve (AIN) is actually the most commonly injured nerve in supracondylar fractures, but the presentation described (inability to extend wrist/fingers) is consistent with posterior interosseous nerve/radial nerve injury, which occurs less commonly. The most critical immediate concern is the absent radial pulse indicating vascular compromise that threatens limb viability. The emergency nurse must: document the neurovascular status immediately, notify orthopedics emergently (a 'white hand' — pulseless with pallor — is an orthopedic emergency requiring emergent reduction within 1-2 hours), prepare for emergent reduction and possible vascular surgery, apply a well-padded posterior splint in 20-30 degrees of flexion (avoid hyperflexion which can worsen vascular compromise), and reassess neurovascular status after splinting.",
    learningObjective: "Assess neurovascular complications of supracondylar humerus fractures and recognize limb-threatening vascular compromise",
    blueprintCategory: "Trauma",
    subtopic: "pediatric trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "A pulseless pale hand after supracondylar fracture is an ORTHOPEDIC EMERGENCY requiring reduction within 1-2 hours to prevent limb loss",
    clinicalPearls: [
      "Brachial artery is the most commonly injured vessel in supracondylar fractures due to its anterior position",
      "The anterior interosseous nerve (AIN) is the most commonly injured nerve in these fractures",
      "Splint at 20-30 degrees flexion — hyperflexion worsens vascular compromise"
    ],
    safetyNote: "A pulseless, pale extremity after fracture reduction requires immediate vascular surgery consultation — do not accept 'spasm' as an explanation for a persistently absent pulse",
    distractorRationales: [
      "Ulnar nerve is less commonly injured in supracondylar fractures and ulnar artery is not the primary vascular concern",
      "While the median nerve/brachial artery are closely associated, the motor findings described point to radial nerve territory",
      "The brachial artery (not the radial artery at the wrist level) is the primary vascular structure at risk at the supracondylar level"
    ],
    lessonPath: "/emergency/lessons/pediatric-trauma"
  },
  {
    stem: "A 39-year-old male presents with bilateral periorbital ecchymosis (raccoon eyes), postauricular ecchymosis (Battle's sign), and clear fluid draining from his right nostril after a motorcycle accident 6 hours ago. The nurse suspects basilar skull fracture. What nursing intervention is CONTRAINDICATED?",
    options: [
      "Elevating the head of bed to 30 degrees",
      "Insertion of a nasogastric tube",
      "Testing the clear nasal drainage for glucose (halo test)",
      "Administering IV antibiotics as ordered"
    ],
    correctAnswer: 1,
    rationaleLong: "Nasogastric (NG) tube insertion is absolutely contraindicated in patients with suspected or confirmed basilar skull fracture because the fracture may create a communication between the nasal cavity and the intracranial space through the cribriform plate of the ethmoid bone. Inserting an NG tube through the nose risks passage of the tube through the fracture site into the cranial vault, potentially penetrating the brain, introducing infection (meningitis), causing additional brain injury, or creating a CSF fistula. The clinical triad of basilar skull fracture signs in this patient — bilateral periorbital ecchymosis (raccoon eyes indicating anterior fossa fracture), postauricular ecchymosis (Battle's sign indicating middle fossa/temporal bone fracture), and clear rhinorrhea (suggesting CSF leak through a cribriform plate fracture) — represents classic findings. CSF rhinorrhea can be distinguished from nasal mucus by: the halo test (place a drop of the fluid on a paper towel or gauze — CSF produces a double ring with a clear outer halo and blood-tinged center); testing for glucose (CSF contains glucose while nasal mucus does not); and beta-2 transferrin testing (the gold standard — beta-2 transferrin is found exclusively in CSF and perilymph). If gastric decompression is needed, an orogastric (OG) tube should be placed instead of an NG tube. Elevating the head of bed to 30 degrees is appropriate — it reduces intracranial pressure and promotes CSF drainage. IV antibiotics may be indicated for prophylaxis against meningitis in the setting of CSF leak, though this remains somewhat controversial. The emergency nurse should gently collect the rhinorrhea for testing, avoid applying any nasal packing or suction that could disrupt the dura, and instruct the patient not to blow their nose or suppress sneezes.",
    learningObjective: "Identify contraindications in basilar skull fracture management, specifically the prohibition of nasogastric tube insertion",
    blueprintCategory: "Trauma",
    subtopic: "traumatic brain injury",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER insert an NG tube in suspected basilar skull fracture — the tube can penetrate the cranial vault through the fractured cribriform plate. Use an OG tube instead.",
    clinicalPearls: [
      "Raccoon eyes = anterior fossa fracture; Battle's sign = middle fossa/temporal bone fracture",
      "Beta-2 transferrin is the gold standard test for CSF leak confirmation",
      "Use orogastric (OG) tube instead of nasogastric (NG) tube in basilar skull fracture"
    ],
    safetyNote: "Instruct the patient not to blow their nose, sneeze forcefully, or use nasal suction — these actions can worsen CSF leak and introduce infection",
    distractorRationales: [
      "Head elevation to 30 degrees is appropriate and recommended to reduce ICP",
      "The halo test is appropriate and helps identify CSF rhinorrhea",
      "Prophylactic antibiotics may be indicated and are not contraindicated"
    ],
    lessonPath: "/emergency/lessons/traumatic-brain-injury"
  },
  {
    stem: "A 52-year-old male firefighter presents to the ED after a structural collapse with a large wooden beam across his right thigh for approximately 45 minutes. He is alert with stable vital signs. His right thigh is markedly swollen and tense. His urine is dark brown (tea-colored). Labs show CK 48,000 U/L and potassium 6.2 mEq/L. ECG shows peaked T waves. What are the THREE immediate priorities?",
    options: [
      "Fasciotomy, CT scan of the thigh, and oral potassium binders",
      "IV calcium gluconate for cardiac stabilization, aggressive IV fluid resuscitation, and continuous cardiac monitoring",
      "Tourniquet application to the right thigh, CT scan, and oral fluid challenge",
      "Skeletal traction, warming blankets, and repeat labs in 6 hours"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with crush syndrome/traumatic rhabdomyolysis with immediately life-threatening hyperkalemia. The clinical picture is classic: prolonged muscle compression (45 minutes), markedly elevated CK (48,000 U/L indicating massive muscle breakdown), dark brown (tea-colored) urine (myoglobinuria), and dangerously elevated potassium (6.2 mEq/L) with ECG changes (peaked T waves indicating cardiac membrane irritability). The three immediate priorities are: (1) IV calcium gluconate (10 mL of 10% solution over 2-3 minutes) — this does NOT lower potassium levels but stabilizes the cardiac membrane by raising the threshold potential, protecting against lethal dysrhythmias. This is the FIRST intervention because it provides immediate cardiac protection within 1-3 minutes; (2) Aggressive IV fluid resuscitation — NS at 1-2 L/hour targeting urine output of 200-300 mL/hour. Vigorous hydration serves two purposes: it dilutes serum potassium and it maintains high urine flow to flush myoglobin through the renal tubules, preventing acute kidney injury from myoglobin cast obstruction. Sodium bicarbonate may be added to alkalinize the urine (target urine pH greater than 6.5), which increases myoglobin solubility and reduces tubular precipitation; (3) Continuous cardiac monitoring — hyperkalemia can cause lethal dysrhythmias without warning, and continuous telemetry allows immediate intervention. Additional potassium-lowering strategies include: regular insulin (10 units IV) with 25g dextrose (D50) to shift potassium intracellularly, sodium bicarbonate IV, and nebulized albuterol (10-20 mg). Kayexalate (sodium polystyrene sulfonate) may be considered but works too slowly for acute management. If potassium remains refractory, emergent hemodialysis may be required.",
    learningObjective: "Manage life-threatening hyperkalemia and rhabdomyolysis from crush syndrome with cardiac stabilization and aggressive fluid resuscitation",
    blueprintCategory: "Trauma",
    subtopic: "crush injuries",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Calcium gluconate does NOT lower potassium — it stabilizes the cardiac membrane. Always follow with potassium-lowering interventions.",
    clinicalPearls: [
      "CK greater than 5,000 U/L significantly increases risk of acute kidney injury from rhabdomyolysis",
      "Target urine output 200-300 mL/hour with alkalinized urine (pH >6.5) to prevent myoglobin nephropathy",
      "Peaked T waves on ECG are the earliest hyperkalemic change — followed by widened QRS, then sine wave"
    ],
    safetyNote: "Monitor potassium levels every 1-2 hours in rhabdomyolysis — potassium can rise rapidly as muscle breakdown continues",
    distractorRationales: [
      "Fasciotomy may be needed later but is not the immediate priority with lethal hyperkalemia — cardiac stabilization comes first",
      "A tourniquet would prevent reperfusion and is inappropriate — the extremity needs blood flow monitoring",
      "Skeletal traction is not indicated for crush injuries and repeating labs in 6 hours ignores the acute life threat"
    ],
    lessonPath: "/emergency/lessons/crush-injuries"
  },
  {
    stem: "A 20-year-old male presents after being ejected from a vehicle during a rollover accident. He has multiple injuries including facial lacerations, a pneumothorax requiring chest tube, and a femur fracture. During the secondary survey, the nurse notes blood at the urethral meatus, a high-riding prostate on digital rectal exam, and perineal ecchymosis. What does this constellation of findings indicate, and what nursing action is critical?",
    options: [
      "Bladder rupture — prepare for immediate surgical repair",
      "Urethral injury — do NOT insert a Foley catheter until urethrography is performed",
      "Testicular torsion — prepare for emergent scrotal exploration",
      "Renal laceration — obtain CT abdomen with contrast"
    ],
    correctAnswer: 1,
    rationaleLong: "The triad of blood at the urethral meatus, high-riding prostate, and perineal ecchymosis (butterfly perineal bruising) is the classic presentation of urethral injury, most commonly posterior urethral disruption associated with pelvic fractures. This triad indicates disruption of the membranous urethra at the level of the urogenital diaphragm, which is the most common location for posterior urethral injuries. The mechanism in this case — high-energy ejection from a vehicle — is consistent with pelvic ring disruption (even if not yet identified radiographically). The critical nursing action is to NOT insert a urinary catheter until urethral integrity is confirmed by retrograde urethrography (RUG). Insertion of a Foley catheter through a disrupted urethra can: (1) convert a partial tear to a complete transection; (2) create false passages through the periurethral tissues; (3) introduce infection into the periurethral and pelvic spaces; (4) make subsequent surgical repair more difficult. If the urethrogram confirms urethral disruption, a suprapubic catheter will be placed for bladder drainage instead. If the urethrogram shows an intact urethra, careful Foley insertion may proceed. The emergency nurse must communicate the findings of blood at the meatus immediately to the trauma team and clearly document in the chart that Foley catheter insertion is contraindicated until urethrography is performed. Additional concerning findings for urethral injury include inability to void, pelvic fracture (especially bilateral pubic rami fractures or straddle-type injuries), and scrotal hematoma. Blood at the meatus is present in approximately 37-93% of posterior urethral injuries.",
    learningObjective: "Recognize the triad of urethral injury and understand the contraindication to Foley catheter insertion",
    blueprintCategory: "Trauma",
    subtopic: "multi-system trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Blood at the urethral meatus = DO NOT insert a Foley catheter until urethrography confirms urethral integrity",
    clinicalPearls: [
      "Triad of urethral injury: blood at meatus, high-riding prostate, perineal ecchymosis",
      "Posterior urethral injuries are associated with pelvic fractures in 90% of cases",
      "Suprapubic catheter is the alternative for bladder drainage when urethral injury is confirmed"
    ],
    safetyNote: "Document 'NO FOLEY' prominently in the chart when urethral injury is suspected — communicate this to all team members to prevent inadvertent insertion",
    distractorRationales: [
      "Bladder rupture may coexist but does not produce the classic triad of blood at meatus, high-riding prostate, and perineal ecchymosis",
      "Testicular torsion presents with acute scrotal pain and testicular malpositioning, not this triad",
      "Renal laceration causes flank pain and hematuria on catheter specimen, not blood at the meatus"
    ],
    lessonPath: "/emergency/lessons/multi-system-trauma"
  },
  {
    stem: "A 43-year-old female presents to the ED with a chemical burn to her face and eyes from an industrial alkaline solution (sodium hydroxide). She is screaming in pain with swollen, erythematous eyelids and inability to open her eyes. What is the FIRST priority intervention?",
    options: [
      "Identify the specific chemical agent before beginning treatment",
      "Immediate and copious irrigation with normal saline or water for a minimum of 20-30 minutes, prioritizing the eyes",
      "Apply neutralizing acid solution to the affected areas",
      "Administer IV morphine for pain control before examination"
    ],
    correctAnswer: 1,
    rationaleLong: "Chemical burns, particularly alkaline (base) burns, require IMMEDIATE copious irrigation as the absolute first priority — irrigation should begin within seconds to minutes of presentation and should not be delayed for any reason, including identification of the chemical, pain management, or examination. Alkaline burns are more dangerous than acid burns because alkalis cause liquefactive necrosis: they saponify (dissolve) fats, denature proteins, and penetrate deeply into tissues, continuing to cause damage as long as the chemical is in contact with tissue. Acids, in contrast, cause coagulative necrosis which forms a protective eschar that limits penetration depth. For ocular chemical exposure, irrigation is particularly urgent because the cornea and conjunctiva are exquisitely sensitive to alkaline injury, and delay increases the risk of permanent corneal opacification, scarring, symblepharon formation (adhesion of eyelids to the globe), and blindness. The Morgan lens (a contact lens-like device connected to IV tubing) facilitates continuous hands-free eye irrigation and should be used after initial manual irrigation. Irrigation should continue for a minimum of 20-30 minutes, with the goal of normalizing the pH of the ocular surface. Check the conjunctival sac pH with litmus paper every 5-10 minutes — continue irrigation until pH is 7.0-7.4 and remains stable 30 minutes after irrigation stops. For facial chemical burns, remove all contaminated clothing and jewelry, and irrigate the skin extensively. Never apply neutralizing agents (acids to neutralize bases or vice versa) as the exothermic reaction generates additional thermal burn injury. The emergency nurse should use topical anesthetic drops (proparacaine or tetracaine) to facilitate eye opening and irrigation, as the patient's inability to open the eyes due to pain should not delay irrigation.",
    learningObjective: "Initiate immediate irrigation for chemical burns prioritizing ocular exposure and understand the difference between alkaline and acid burn mechanisms",
    blueprintCategory: "Trauma",
    subtopic: "burn injuries",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER apply a neutralizing agent to a chemical burn — the exothermic reaction causes additional thermal injury. Always use water or normal saline.",
    clinicalPearls: [
      "Alkaline burns cause liquefactive necrosis with deep penetration — more dangerous than acid burns",
      "Morgan lens provides continuous hands-free eye irrigation after initial manual irrigation",
      "Target conjunctival pH 7.0-7.4 — recheck 30 minutes after stopping irrigation to confirm stability"
    ],
    safetyNote: "Do NOT delay irrigation for ANY reason — every minute of delay increases tissue damage and risk of permanent visual loss",
    distractorRationales: [
      "Delaying irrigation to identify the chemical allows continued tissue destruction — irrigate first, identify later",
      "Neutralizing agents cause exothermic reactions producing additional thermal burns",
      "Pain management is important but must not delay irrigation — use topical anesthetic drops to facilitate eye opening during irrigation"
    ],
    lessonPath: "/emergency/lessons/burn-injuries"
  },
  {
    stem: "A 58-year-old male presents to the ED after a fall from a 12-foot ladder. He landed on his feet and has bilateral calcaneal fractures. After addressing the calcaneal injuries, the nurse should assess for which commonly associated injury pattern?",
    options: [
      "Bilateral wrist fractures (Colles fractures)",
      "Thoracolumbar spine compression fractures",
      "Bilateral knee ligament injuries",
      "Cervical spine fractures"
    ],
    correctAnswer: 1,
    rationaleLong: "Falls from height where the patient lands on their feet produce a classic axial loading injury pattern. The force of impact is transmitted from the calcaneal bones (heels) through the lower extremities and upward along the spinal column. The thoracolumbar junction (T12-L2) is the most vulnerable site for compression fractures from this mechanism because it represents the biomechanical transition zone between the relatively rigid thoracic spine (stabilized by the rib cage and the costovertebral articulations) and the more mobile lumbar spine. This transition zone concentrates the axial loading force, making compression fractures at this level common. The association between calcaneal fractures and thoracolumbar compression fractures is well-established, with studies showing concurrent spinal fractures in approximately 10% of patients with calcaneal fractures from falls. This is sometimes referred to as the 'Don Juan' fracture pattern or the 'lover's fracture' — named for the legend of a man jumping from a balcony to escape a jealous husband. The emergency nurse must maintain a high index of suspicion for this associated injury and ensure that spinal imaging (thoracolumbar X-rays or CT) is obtained in all patients with calcaneal fractures from falls, even if the patient does not initially complain of back pain. Pain from the severe calcaneal fractures may act as a 'distracting injury' masking spinal pain. Spinal motion restriction should be maintained until thoracolumbar imaging clears the spine. Other less common but possible associated injuries include pilon (tibial plafond) fractures, acetabular fractures, and femoral neck fractures — essentially any structure along the axial loading transmission pathway.",
    learningObjective: "Identify associated injury patterns with calcaneal fractures from falls, particularly thoracolumbar compression fractures",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 2,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Calcaneal fracture pain is a 'distracting injury' that may mask thoracolumbar spine pain — always image the spine regardless of symptoms",
    clinicalPearls: [
      "Calcaneal fractures from falls are associated with thoracolumbar compression fractures in ~10% of cases",
      "T12-L2 is the transition zone between rigid thoracic and mobile lumbar spine — most vulnerable to axial loading",
      "Don Juan fracture pattern: calcaneal fractures + thoracolumbar compression fractures from falls"
    ],
    safetyNote: "Maintain spinal motion restriction until thoracolumbar imaging clears the spine in all calcaneal fracture patients from falls",
    distractorRationales: [
      "Wrist fractures (FOOSH injuries) occur when landing on outstretched hands, not when landing on feet",
      "Knee ligament injuries are associated with dashboard impacts or lateral force mechanisms, not axial loading",
      "Cervical spine fractures are more associated with head-first impacts (diving) than feet-first landings"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 36-year-old male presents with an anterior hip dislocation after a motorcycle collision. The affected leg is externally rotated, abducted, and extended. The nurse is preparing for emergent reduction. What is the critical time-sensitive concern?",
    options: [
      "Peroneal nerve palsy affecting ankle dorsiflexion",
      "Avascular necrosis of the femoral head increases significantly if reduction is delayed beyond 6 hours",
      "Compartment syndrome of the anterior thigh compartment",
      "Fat embolism syndrome from the associated femoral head fracture"
    ],
    correctAnswer: 1,
    rationaleLong: "Hip dislocation is an orthopedic emergency with a critical 6-hour window for reduction to minimize the risk of avascular necrosis (AVN) of the femoral head. The femoral head receives its primary blood supply through the medial and lateral circumflex femoral arteries (branches of the profunda femoris artery), which form a ring at the base of the femoral neck and send retinacular arteries along the femoral neck to the femoral head. During dislocation, these retinacular vessels are kinked, stretched, or torn, interrupting blood supply to the femoral head. If blood flow is not restored promptly through reduction, the femoral head undergoes ischemic necrosis (AVN). Studies demonstrate that the risk of AVN increases dramatically when reduction is delayed beyond 6 hours — some studies show AVN rates as high as 40-50% with delays beyond 12 hours, compared to 4-10% with prompt reduction. Anterior hip dislocations (10-15% of hip dislocations) present with the leg externally rotated, abducted, and extended — the opposite of posterior dislocations (85-90%) where the leg is internally rotated, adducted, and flexed. Associated injuries with anterior dislocation include femoral head impaction fractures, labral tears, and vascular injury (the femoral artery is at risk). The emergency nurse's priorities include: rapid assessment and documentation of neurovascular status (sciatic nerve in posterior; femoral nerve in anterior dislocations), obtaining pre-reduction X-rays, preparing procedural sedation, communicating urgency to the orthopedic team regarding the 6-hour reduction window, and monitoring for post-reduction complications.",
    learningObjective: "Recognize the time-critical nature of hip dislocation reduction and the 6-hour window to prevent avascular necrosis",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Anterior hip dislocation: externally rotated, abducted, extended. Posterior: internally rotated, adducted, flexed. The time-critical concern is the SAME — reduce within 6 hours.",
    clinicalPearls: [
      "The 6-hour reduction window is critical — AVN rates increase from 4-10% to 40-50% with delays beyond 12 hours",
      "Anterior dislocation: externally rotated, abducted, extended; Posterior: internally rotated, adducted, flexed",
      "Posterior dislocations (85-90%) risk sciatic nerve injury; anterior dislocations (10-15%) risk femoral neurovascular injury"
    ],
    safetyNote: "Communicate the 6-hour time sensitivity to the orthopedic team and monitor closely — every hour of delay increases AVN risk",
    distractorRationales: [
      "Peroneal nerve palsy is more associated with knee dislocations and fibular fractures, not hip dislocations",
      "Compartment syndrome of the thigh is rare with hip dislocation — the primary concern is AVN",
      "Fat embolism syndrome is associated with long bone fractures, not hip dislocations"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 14-year-old presents to the ED after a skiing accident with a tibial shaft fracture. The fracture is stable and a cast is applied. Twelve hours later, the nurse notes increasing pain not relieved by IV morphine, pain with passive toe extension, paresthesias of the foot, and a tense anterior compartment. The posterior tibial and dorsalis pedis pulses are still palpable. Does the presence of pulses rule out compartment syndrome?",
    options: [
      "Yes — intact pulses indicate adequate circulation and rule out compartment syndrome",
      "No — compartment syndrome causes microvascular compromise at the capillary level while arterial flow may remain intact until very late",
      "Yes — compartment syndrome always presents with absent pulses as the first sign",
      "The diagnosis cannot be made without measuring compartment pressures"
    ],
    correctAnswer: 1,
    rationaleLong: "This is a critically important teaching point: the presence of intact distal pulses does NOT rule out compartment syndrome. Compartment syndrome occurs when pressure within a closed fascial compartment rises to a level that compromises the microvascular circulation at the capillary level. The systemic arterial pressure (typically 80-120 mmHg systolic) is significantly higher than compartment pressures needed to cause ischemia (typically 30 mmHg or within 30 mmHg of diastolic blood pressure). This means that arterial flow can continue to produce palpable distal pulses even as the capillary beds within the compartment are being compressed and muscle ischemia is progressing. Pulselessness is a VERY LATE finding that indicates vascular collapse and usually means irreversible damage has already occurred. The clinical diagnosis of compartment syndrome is based on the 6 P's, but the most reliable early indicators are: (1) Pain out of proportion to the injury — the hallmark finding; (2) Pain with passive stretch of the muscles within the affected compartment (passive toe/finger extension); (3) Paresthesias — nerve ischemia produces numbness and tingling before motor loss; (4) A tense, firm compartment on palpation. Paralysis and pulselessness are LATE findings indicating irreversible damage. This patient demonstrates classic early compartment syndrome: increasing pain unresponsive to narcotics, pain with passive stretch, paresthesias, and a tense compartment — all with intact pulses. The treatment is emergent fasciotomy — every hour of delay increases the risk of irreversible muscle necrosis, nerve damage, and potential limb loss. The cast must be immediately bivalved (cut along both sides and spread open) to relieve external compression, and if symptoms do not rapidly improve, fasciotomy is performed.",
    learningObjective: "Recognize that intact pulses do NOT rule out compartment syndrome and identify early clinical indicators",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "PULSES ARE PRESERVED in compartment syndrome until very late — waiting for pulse loss means irreversible damage has occurred",
    clinicalPearls: [
      "Pain out of proportion + pain with passive stretch are the most reliable early indicators",
      "Pulselessness is a LATE finding — by the time pulses are lost, muscle necrosis is likely irreversible",
      "Bivalve the cast immediately if compartment syndrome is suspected — this alone may relieve symptoms"
    ],
    safetyNote: "If compartment syndrome is suspected, bivalve the cast immediately and prepare for emergent fasciotomy — do not wait for compartment pressure measurement",
    distractorRationales: [
      "Intact pulses absolutely do not rule out compartment syndrome — this is a dangerous misconception",
      "Absent pulses are a late finding, not a first sign — early signs are pain and paresthesias",
      "While compartment pressure measurement can confirm the diagnosis, clinical findings alone can warrant emergent fasciotomy — do not delay treatment for testing"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 67-year-old male with chronic obstructive pulmonary disease and a history of right pneumonectomy presents after a fall, sustaining left-sided rib fractures (ribs 3-7). His baseline SpO2 is 89% on 2L NC. He is now on 4L NC with SpO2 90% and increasing work of breathing. Why is this patient at particularly high risk compared to a patient with normal bilateral lung function?",
    options: [
      "COPD patients are more likely to develop hemothorax from rib fractures",
      "With only one functional lung, any left-sided injury eliminates all respiratory reserve — he has no contralateral compensation",
      "The previous pneumonectomy makes him immune to left-sided pneumothorax",
      "Rib fractures are more painful in COPD patients"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient represents an extremely high-risk clinical scenario because he has only one functional lung (the left) after a right pneumonectomy. Under normal circumstances, when one lung is injured, the contralateral lung compensates by increasing ventilation and perfusion to maintain gas exchange. This patient has NO contralateral compensation available — any injury to his remaining left lung threatens his entire respiratory capacity. The left-sided rib fractures (ribs 3-7) can cause: (1) Underlying pulmonary contusion reducing gas exchange in his only functional lung; (2) Pneumothorax — a left-sided pneumothorax in this patient would be rapidly fatal as there is no right lung to compensate (essentially equivalent to a bilateral tension pneumothorax); (3) Hemothorax — blood accumulation in the left pleural space further compresses his only lung; (4) Pain-induced splinting reducing already-compromised ventilation (his COPD already limits his baseline respiratory function). His baseline SpO2 of 89% on supplemental oxygen demonstrates severely limited respiratory reserve even at baseline. The emergency nurse must recognize that this patient's risk of respiratory failure is dramatically higher than a patient with bilateral lung function and the same injury pattern. Management priorities include: aggressive multimodal pain management (consider early epidural placement), continuous pulse oximetry and capnography monitoring, high-flow oxygen (or non-invasive positive pressure ventilation if needed), bedside chest ultrasound or X-ray to evaluate for pneumothorax and hemothorax, ICU admission for close monitoring, and preparation for possible mechanical ventilation (noting that single-lung ventilation has unique challenges). Any chest tube placement must be on the LEFT side — right-sided intervention would be into the post-pneumonectomy space.",
    learningObjective: "Assess the amplified risk of thoracic injury in patients with prior pneumonectomy or single-lung function",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "A pneumothorax on the side of the only functional lung is equivalent to a bilateral tension pneumothorax — immediately life-threatening",
    clinicalPearls: [
      "Post-pneumonectomy patients have NO contralateral respiratory compensation for ipsilateral lung injuries",
      "Baseline SpO2 on supplemental oxygen indicates severely limited respiratory reserve",
      "Chest tubes in post-pneumonectomy patients must be on the side of the remaining lung, never the pneumonectomy side"
    ],
    safetyNote: "ICU-level monitoring is mandatory for any thoracic injury in a patient with prior pneumonectomy — rapid deterioration can occur without warning",
    distractorRationales: [
      "COPD does not increase hemothorax risk — the critical issue is the absence of contralateral lung compensation",
      "The previous pneumonectomy on the right does not affect left-sided pneumothorax risk",
      "While pain management is important, the fundamental issue is the elimination of respiratory reserve, not differential pain sensitivity"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "A 41-year-old female presents to the ED after a high-speed MVC with a seatbelt sign across her neck. She reports difficulty swallowing and has subcutaneous emphysema in her neck. Her voice is hoarse. The nurse suspects blunt laryngeal trauma. What is the most critical concern?",
    options: [
      "Esophageal perforation requiring emergency surgery",
      "Progressive airway compromise from laryngeal edema and hematoma requiring emergent airway management",
      "Carotid artery dissection causing stroke symptoms",
      "Tracheal ring fracture requiring tracheostomy in the operating room"
    ],
    correctAnswer: 1,
    rationaleLong: "Blunt laryngeal trauma is an uncommon but potentially lethal injury that can rapidly progress to complete airway obstruction. The seatbelt compression mechanism across the anterior neck has caused laryngeal injury, evidenced by hoarseness (vocal cord involvement), subcutaneous emphysema (disruption of the airway wall allowing air to escape into subcutaneous tissues), and dysphagia (edema and structural disruption affecting the hypopharynx/larynx). The most critical concern is progressive airway compromise: post-traumatic laryngeal edema and hematoma formation can progressively narrow the airway lumen over hours, and the patient can transition from stable to complete obstruction rapidly. This progression can be insidious — the patient may appear stable initially but deteriorate suddenly. Key management considerations include: (1) Prepare for difficult airway management — standard orotracheal intubation may fail due to distorted airway anatomy, and the attempt itself can convert a partial obstruction to complete obstruction. Have a surgical airway (cricothyrotomy) tray immediately available; (2) Fiberoptic or video laryngoscopy should be used for intubation attempts to directly visualize the airway and avoid traumatic intubation; (3) CT neck with IV contrast can evaluate the extent of injury but should NOT delay airway management if the patient is deteriorating; (4) The Schaefer-Fuhrman classification grades blunt laryngeal trauma from Grade I (minor endolaryngeal hematoma, no fracture) to Grade V (complete laryngotracheal separation). The emergency nurse should maintain constant proximity to the patient for continuous assessment, have emergency airway equipment at bedside (including a surgical cricothyrotomy kit), administer humidified oxygen, avoid agitating the patient (which increases respiratory demand), and monitor for signs of progressive obstruction (stridor, increasing work of breathing, inability to handle secretions, decreasing voice volume).",
    learningObjective: "Recognize blunt laryngeal trauma as a progressive airway emergency and prepare for difficult airway management",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Blunt laryngeal trauma can present with stable vital signs initially but progress to complete airway obstruction within hours — constant reassessment is essential",
    clinicalPearls: [
      "Subcutaneous emphysema + hoarseness + dysphagia = blunt laryngeal trauma until proven otherwise",
      "Standard intubation may fail and can worsen the obstruction — have a surgical airway kit ready",
      "Seatbelt injuries to the neck require evaluation for laryngeal, vascular, and esophageal injury"
    ],
    safetyNote: "Keep a surgical cricothyrotomy tray at bedside for all patients with suspected laryngeal trauma — airway obstruction can occur suddenly",
    distractorRationales: [
      "Esophageal perforation is possible but the immediate life threat is airway compromise, not esophageal injury",
      "Carotid dissection should be evaluated but does not explain the hoarseness and subcutaneous emphysema",
      "While tracheal ring fracture may coexist, the immediate concern is progressive airway obstruction, not operative planning"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 75-year-old female on warfarin presents to the ED after a mechanical fall at home. She reports neck pain but has no neurological deficits. CT cervical spine shows a type II odontoid (dens) fracture with minimal displacement. What makes this injury particularly concerning in the elderly population?",
    options: [
      "Type II odontoid fractures have a high rate of non-union due to the tenuous blood supply to the odontoid process",
      "All odontoid fractures require immediate surgical fixation regardless of patient age",
      "Odontoid fractures in the elderly always present with quadriplegia",
      "The fracture will heal spontaneously within 2 weeks with a soft collar"
    ],
    correctAnswer: 0,
    rationaleLong: "Type II odontoid fractures are the most common cervical spine fracture in elderly patients (over age 70) and represent a significant management challenge. The odontoid process (dens) of C2 has a tenuous blood supply — the blood vessels enter primarily at the tip and at the base. Type II fractures occur at the base of the dens, disrupting the ascending blood supply and leaving the fractured fragment dependent on the smaller apical blood supply. This tenuous vascularity results in high non-union rates, reported as 20-40% in elderly patients treated conservatively with external immobilization (halo vest or rigid cervical collar). The non-union rate is even higher in patients with fracture displacement greater than 5mm, posterior displacement, and advanced age. Additionally, elderly patients have several factors that increase risk: osteoporotic bone that provides poor fracture surface for healing, comorbidities that increase surgical risk, anticoagulation (warfarin in this patient) that may have contributed to a more significant displacement injury, and the risk of falls increasing the chance of re-displacement. Management decisions are complex and typically involve multidisciplinary discussion between emergency medicine, spine surgery, and geriatric medicine. Options include: rigid cervical immobilization (halo vest — though poorly tolerated in elderly with complications including pin loosening, respiratory compromise, and skin breakdown), rigid cervical collar (better tolerated but higher non-union rate), or surgical fixation (anterior odontoid screw or posterior C1-C2 fusion — definitive but carries surgical risk). The emergency nurse's role includes maintaining strict cervical immobilization, performing serial neurological assessments (any development of neurological deficits changes the urgency of intervention), managing anticoagulation (INR correction may be needed for surgical planning), and providing clear communication about the significance of this injury despite the patient's current normal neurological examination.",
    learningObjective: "Understand the significance of type II odontoid fractures in elderly patients and the challenges of management",
    blueprintCategory: "Trauma",
    subtopic: "geriatric trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "A normal neurological exam does NOT mean the odontoid fracture is benign — type II fractures have high non-union rates and risk of delayed cord compression",
    clinicalPearls: [
      "Type II odontoid fractures are the most common C-spine fracture in patients over 70",
      "Non-union rate is 20-40% in elderly patients due to tenuous blood supply at the dens base",
      "Halo vest immobilization is poorly tolerated in elderly patients with high complication rates"
    ],
    safetyNote: "Maintain strict cervical immobilization and perform serial neurological assessments — neurological status can change if the fracture displaces",
    distractorRationales: [
      "Not all odontoid fractures require immediate surgical fixation — management is individualized based on fracture type, displacement, and patient factors",
      "Odontoid fractures can be neurologically intact initially — quadriplegia is not universal",
      "Type II odontoid fractures do NOT heal spontaneously in 2 weeks — they require prolonged immobilization or surgery"
    ],
    lessonPath: "/emergency/lessons/geriatric-trauma"
  },
  {
    stem: "A 23-year-old male presents to the ED after sustaining a stab wound to the left chest. He has a large open wound that produces a sucking sound with each breath. SpO2 is dropping to 84%. What is the immediate nursing intervention?",
    options: [
      "Insert a chest tube through the wound",
      "Apply a three-sided occlusive dressing (vented chest seal) over the wound",
      "Cover the wound completely with a four-sided occlusive dressing",
      "Leave the wound open to air and prepare for intubation"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has an open pneumothorax (sucking chest wound) — a penetrating thoracic injury that creates a direct communication between the external environment and the pleural space. When the wound diameter is approximately two-thirds the diameter of the trachea, air preferentially enters the pleural space through the wound (path of least resistance) rather than through the trachea, causing progressive pneumothorax and respiratory failure. The immediate treatment is application of a vented chest seal or, if not available, a three-sided occlusive dressing. The three-sided technique (taping the dressing on three sides while leaving one side open) creates a one-way valve effect: during inspiration, the negative intrapleural pressure pulls the dressing against the wound, sealing it and preventing air entry; during expiration, the positive intrapleural pressure pushes the untaped side open, allowing trapped air to escape from the pleural space. This prevents both ongoing pneumothorax and the development of tension pneumothorax. Commercial vented chest seals (such as the Halo Chest Seal or Bolin Chest Seal) provide this same one-way valve function with a manufactured valve. A completely occlusive (four-sided) dressing is DANGEROUS because it seals the wound completely, but if the visceral pleural injury continues to leak air (which is common), the air has no escape route and accumulates, converting the open pneumothorax to a tension pneumothorax — a potentially lethal progression. After the chest seal is applied, the patient will still need a chest tube — but the tube should be placed at a SEPARATE site (typically the 4th-5th intercostal space at the anterior axillary line), NOT through the wound itself. The emergency nurse should prepare for chest tube insertion, continue oxygen supplementation, and obtain a chest X-ray after the initial stabilization.",
    learningObjective: "Apply a three-sided occlusive dressing for open pneumothorax and understand the one-way valve mechanism",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "A four-sided (completely occlusive) dressing can convert an open pneumothorax to a TENSION pneumothorax — always leave one side untaped or use a vented chest seal",
    clinicalPearls: [
      "Three-sided dressing creates a one-way valve: seals on inspiration, vents on expiration",
      "Commercial vented chest seals provide the same one-way valve function as a three-sided dressing",
      "Chest tube should be placed at a SEPARATE site, not through the wound"
    ],
    safetyNote: "After applying the chest seal, reassess frequently — if the patient develops signs of tension pneumothorax, temporarily lift the dressing to release trapped air",
    distractorRationales: [
      "Never insert a chest tube through the wound — use a separate intercostal site to avoid contamination and ensure proper positioning",
      "A four-sided occlusive dressing can cause tension pneumothorax by trapping air with no escape route",
      "Leaving the wound open to air allows continued atmospheric air entry and worsening pneumothorax"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "A 8-year-old child is brought to the ED after being hit by a car. Unlike adult pedestrians struck by vehicles, pediatric patients have different injury patterns due to their body proportions. The nurse should anticipate which pediatric-specific pattern compared to adults?",
    options: [
      "Isolated lower extremity injuries only",
      "Waddell's triad: femur fracture, thoracoabdominal injuries, and contralateral head injury from the unique mechanism of pediatric pedestrian impacts",
      "Primarily cervical spine injuries from the proportionally larger head",
      "Isolated upper extremity injuries from bracing for impact"
    ],
    correctAnswer: 1,
    rationaleLong: "Waddell's triad is the classic pediatric pedestrian-struck-by-vehicle injury pattern and differs significantly from adult injury patterns due to the child's smaller stature and different body proportions relative to a vehicle's bumper height. In children, the typical sequence of injuries from a bumper-height impact includes: (1) FEMUR FRACTURE — the bumper strikes the child at mid-thigh level (unlike adults where the bumper typically strikes below the knee, causing tibial fractures); (2) THORACOABDOMINAL INJURIES — as the child is propelled onto the vehicle's hood, the trunk impacts the hood surface, causing thoracic and abdominal injuries (rib fractures, pulmonary contusion, splenic/hepatic injury); (3) CONTRALATERAL HEAD INJURY — as the child is then thrown from the hood, they typically strike the ground on the opposite side from the vehicle impact, sustaining head injury contralateral to the other injuries. Understanding this pattern is essential for the emergency nurse because it guides the secondary survey: when a child presents with a femur fracture from a pedestrian vs. vehicle mechanism, the nurse should specifically assess for intra-abdominal solid organ injuries and contralateral intracranial injuries, even if they are not immediately apparent. Additionally, pediatric patients differ from adults in several trauma-relevant ways: proportionally larger head (higher center of gravity, leading to head-first falls), more compliant chest wall (rib fractures are less common, but pulmonary contusion can occur without fractures), proportionally larger abdominal organs with less protective musculature and fat, and more pliable bones (greenstick and buckle fractures). The emergency nurse should also be aware that children compensate for blood loss more effectively than adults — tachycardia and peripheral vasoconstriction can maintain blood pressure until 25-30% blood volume loss, at which point decompensation is rapid and dramatic.",
    learningObjective: "Identify Waddell's triad and understand pediatric-specific injury patterns in pedestrian-struck-by-vehicle mechanisms",
    blueprintCategory: "Trauma",
    subtopic: "pediatric trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Children compensate for blood loss until 25-30% volume loss, then decompensate rapidly — tachycardia is the earliest sign, hypotension is a LATE finding",
    clinicalPearls: [
      "Waddell's triad: femur fracture, thoracoabdominal injury, contralateral head injury",
      "Bumper strikes children at femur level (mid-thigh) versus below the knee in adults",
      "Children have more compliant chest walls — pulmonary contusion occurs WITHOUT rib fractures"
    ],
    safetyNote: "Actively look for all three components of Waddell's triad — abdominal and head injuries may not be immediately apparent in a distracted patient with femur fracture pain",
    distractorRationales: [
      "Pediatric pedestrian injuries are multi-system, not isolated to lower extremities",
      "While the proportionally larger head increases head injury risk, cervical spine fractures are less common in children due to ligamentous laxity",
      "Upper extremity bracing injuries are more common in adults; children are typically struck before they can react"
    ],
    lessonPath: "/emergency/lessons/pediatric-trauma"
  },
  {
    stem: "A 55-year-old male presents after a motor vehicle collision with anterior chest wall tenderness and increasing respiratory distress. Chest X-ray shows a widened mediastinum greater than 8cm. The nurse suspects thoracic aortic injury. Which additional clinical or imaging finding supports this diagnosis?",
    options: [
      "Bilateral clear lung fields on chest X-ray",
      "Blood pressure differential greater than 20 mmHg between the upper extremities, left-sided hemothorax, and deviation of the nasogastric tube to the right",
      "Isolated right-sided rib fractures without mediastinal abnormality",
      "Normal chest X-ray with an isolated small left pleural effusion"
    ],
    correctAnswer: 1,
    rationaleLong: "Traumatic thoracic aortic injury (TTAI) is a life-threatening condition that occurs in high-energy deceleration mechanisms such as high-speed MVCs, falls from great height, and motorcycle crashes. The aortic isthmus (just distal to the left subclavian artery at the ligamentum arteriosum) is the most common site of injury because it represents a transition between the relatively fixed descending aorta and the more mobile aortic arch, creating differential deceleration forces that tear the vessel wall. Chest X-ray findings suggestive of TTAI include: widened mediastinum (greater than 8 cm at the aortic knob level — the most sensitive but least specific finding), deviation of the nasogastric tube (or trachea) to the right (displaced by the mediastinal hematoma), left apical pleural cap (blood tracking over the left lung apex), depression of the left mainstem bronchus, obscured aortic knob, and left-sided hemothorax (blood from the mediastinal injury extending into the left pleural space). The blood pressure differential between upper extremities suggests involvement of the aortic arch branches. CT angiography is the definitive diagnostic study and should be obtained urgently when CXR findings are suggestive. The emergency nurse's priorities include: bilateral upper extremity blood pressure measurement (documenting any differential), maintaining mean arterial pressure 60-70 mmHg with short-acting beta-blockers (esmolol) and vasodilators (nicardipine) to reduce aortic wall shear stress (anti-impulse therapy), avoiding hypertension and tachycardia (which increase aortic wall stress), establishing large-bore IV access with type and crossmatch, and coordinating rapid CT angiography. Up to 80-90% of TTAI patients die at the scene — those who survive to the ED have a contained aortic injury (the adventitia or surrounding mediastinal pleura is tamponading the hemorrhage) that can rupture at any time.",
    learningObjective: "Identify chest X-ray and clinical findings suggestive of traumatic thoracic aortic injury",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Anti-impulse therapy (beta-blockers + vasodilators) must be initiated BEFORE CT angiography — hypertension and tachycardia increase the risk of aortic rupture",
    clinicalPearls: [
      "Widened mediastinum >8 cm is the most sensitive CXR finding for TTAI but is not specific",
      "The aortic isthmus (distal to left subclavian artery) is the most common injury site",
      "80-90% of TTAI patients die at the scene — ED survivors have a contained injury that can rupture"
    ],
    safetyNote: "Avoid any procedure or intervention that could increase blood pressure or heart rate — strict anti-impulse therapy is critical to prevent free rupture",
    distractorRationales: [
      "Clear lung fields do not support the diagnosis — TTAI typically produces mediastinal and/or pleural abnormalities",
      "Isolated right-sided rib fractures without mediastinal abnormality do not suggest aortic injury",
      "A normal CXR essentially rules out significant TTAI — the widened mediastinum is the key screening finding"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "A 26-year-old female presents with a displaced midshaft clavicle fracture after a mountain biking accident. She has intact neurovascular status distally. During assessment, the nurse notes tenting of the skin over the fracture fragment. Why is skin tenting a concerning finding?",
    options: [
      "It indicates the fracture is pathological and suggests underlying malignancy",
      "The sharp fracture fragment is at risk for penetrating the skin, converting a closed fracture to an open fracture requiring more aggressive management",
      "Skin tenting always indicates an associated pneumothorax",
      "It suggests the patient has poor nutritional status and impaired healing"
    ],
    correctAnswer: 1,
    rationaleLong: "Skin tenting over a fracture fragment occurs when a displaced bone end pushes against the overlying skin from underneath, stretching the skin tautly over the sharp fracture edge. This is a concerning finding because: (1) The tented skin is at risk of ischemic necrosis — the sharp bone fragment compresses the skin from beneath, reducing blood flow to the overlying tissue, which can lead to skin breakdown; (2) If the bone penetrates the skin, the injury converts from a closed fracture to an open fracture, which dramatically changes the management — open fractures require operative irrigation and debridement, IV antibiotics, tetanus prophylaxis, and carry a significantly higher risk of infection (including osteomyelitis); (3) The degree of displacement causing skin tenting may also indicate injury to underlying structures. For midshaft clavicle fractures specifically, the proximity of the subclavian vessels, brachial plexus, and lung apex means that significant displacement can be associated with pneumothorax, vascular injury, or brachial plexus injury — though skin tenting itself is not diagnostic of these. The emergency nurse should: carefully assess and document the degree of skin tenting, reassess frequently for skin color changes or imminent breakdown, apply a well-padded sling to reduce tension on the tented skin, avoid any manipulation that could cause the bone to penetrate the skin, communicate the finding to the orthopedic consultant (skin tenting may influence the decision toward operative fixation rather than conservative management), and document neurovascular status comprehensively. The presence of skin tenting often shifts the management decision toward surgical fixation to reduce the displacement and eliminate the risk of skin breakdown.",
    learningObjective: "Recognize skin tenting as a concerning finding in fracture assessment that may influence management decisions",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 2,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Skin tenting can convert a closed fracture to an open fracture if not managed — this changes the treatment plan significantly",
    clinicalPearls: [
      "Skin tenting may shift management from conservative to surgical fixation",
      "Closed-to-open fracture conversion dramatically increases infection risk and surgical requirements",
      "Midshaft clavicle fractures with significant displacement require assessment for subclavian vessel and brachial plexus injury"
    ],
    safetyNote: "Reassess skin tenting frequently — progressive skin color change (pale, dusky) over the tented area indicates impending breakdown requiring urgent orthopedic intervention",
    distractorRationales: [
      "Skin tenting is a mechanical finding from fracture displacement, not an indicator of pathological fracture",
      "Skin tenting does not diagnose pneumothorax — though pneumothorax should be assessed independently in clavicle fractures",
      "Skin tenting is related to fracture displacement, not nutritional status"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 19-year-old male is brought to the ED by friends after a diving accident into shallow water. He has quadriplegia, is breathing only with diaphragm, and has a HR of 48 bpm with BP 80/52 mmHg. The trauma team initiates fluid resuscitation but the hypotension persists despite 2L of crystalloid. What vasopressor is first-line for neurogenic shock in spinal cord injury?",
    options: [
      "Dopamine for its combined inotropic and chronotropic effects",
      "Norepinephrine for its alpha-1 mediated vasoconstriction and mild beta-1 cardiac stimulation",
      "Phenylephrine for pure alpha-1 vasoconstriction",
      "Epinephrine for its potent combined alpha and beta effects"
    ],
    correctAnswer: 1,
    rationaleLong: "Neurogenic shock from high spinal cord injury (above T6) results from disruption of sympathetic nervous system outflow, causing loss of vasomotor tone (vasodilation below the injury level) and loss of cardiac sympathetic innervation (bradycardia). The hemodynamic profile shows decreased SVR (vasodilation), decreased heart rate (unopposed vagal/parasympathetic tone), and decreased cardiac output. Treatment requires both volume resuscitation AND vasopressor support. After initial fluid resuscitation (1-2L of crystalloid — being careful not to overload as these patients lack the compensatory vasoconstriction to handle excess fluid), norepinephrine is the first-line vasopressor for neurogenic shock. Norepinephrine provides: (1) Potent alpha-1 receptor agonism causing vasoconstriction, which directly addresses the pathological vasodilation causing hypotension; (2) Mild beta-1 receptor agonism providing some cardiac stimulation (increased contractility and heart rate), which helps address the bradycardia component. This dual mechanism makes it ideal for neurogenic shock where BOTH vasodilation and bradycardia contribute to the hemodynamic compromise. Phenylephrine (pure alpha-1 agonist) provides vasoconstriction but can reflexively worsen bradycardia through baroreceptor stimulation — since the patient is already bradycardic at 48 bpm, this is undesirable. Dopamine is a less preferred option in modern practice due to increased dysrhythmia risk compared to norepinephrine (SOAP II trial). Epinephrine is typically reserved for more severe situations or cardiac arrest. If bradycardia is severe and symptomatic despite norepinephrine, atropine (0.5-1 mg IV) can be used to block vagal tone. For refractory bradycardia, transcutaneous or transvenous pacing may be needed. The mean arterial pressure (MAP) target in acute SCI is 85-90 mmHg for 5-7 days to maintain spinal cord perfusion pressure, which requires vasopressor infusion titration by the emergency nurse.",
    learningObjective: "Select appropriate vasopressor therapy for neurogenic shock and understand the hemodynamic rationale",
    blueprintCategory: "Trauma",
    subtopic: "spinal cord injury",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Neurogenic shock causes BRADYCARDIA + hypotension — phenylephrine worsens bradycardia through baroreceptor reflex. Norepinephrine provides both vasoconstriction and mild chronotropy.",
    clinicalPearls: [
      "MAP target in acute SCI: 85-90 mmHg for 5-7 days to maintain spinal cord perfusion",
      "Norepinephrine provides alpha-1 vasoconstriction + mild beta-1 cardiac stimulation",
      "Atropine 0.5-1 mg IV can treat symptomatic bradycardia from unopposed vagal tone"
    ],
    safetyNote: "Avoid fluid overloading neurogenic shock patients — without sympathetic tone, they cannot vasoconstrict to accommodate excess volume, leading to pulmonary edema",
    distractorRationales: [
      "Dopamine has higher dysrhythmia risk than norepinephrine (SOAP II trial) and is a less preferred first-line agent",
      "Phenylephrine's pure alpha-1 effect can reflexively worsen bradycardia through baroreceptor stimulation",
      "Epinephrine is overly potent for initial management and is typically reserved for refractory cases or cardiac arrest"
    ],
    lessonPath: "/emergency/lessons/spinal-cord-injury"
  },
  {
    stem: "A 47-year-old male presents to the ED after a workplace explosion with full-thickness burns to his entire right upper extremity (9%), anterior trunk (18%), and perineum (1%). His weight is 80 kg. Using the Parkland formula, what is the calculated fluid resuscitation volume for the first 24 hours?",
    options: [
      "2,240 mL of lactated Ringer's",
      "4,480 mL of lactated Ringer's",
      "8,960 mL of lactated Ringer's",
      "17,920 mL of lactated Ringer's"
    ],
    correctAnswer: 2,
    rationaleLong: "The Parkland formula (also called the Baxter formula) is the standard calculation for initial fluid resuscitation in burn patients: 4 mL × body weight in kg × total body surface area (TBSA) burned = total fluid for the first 24 hours. First, calculate the TBSA burned using the Rule of Nines: Right upper extremity (entire) = 9%, Anterior trunk = 18%, Perineum = 1%. Total TBSA = 9% + 18% + 1% = 28%. Now apply the Parkland formula: 4 mL × 80 kg × 28% = 8,960 mL of lactated Ringer's (LR) solution over 24 hours. The administration schedule is crucial: the first HALF (4,480 mL) is given in the first 8 hours from the TIME OF INJURY (not time of ED arrival), and the second half (4,480 mL) is given over the remaining 16 hours. Lactated Ringer's is preferred over normal saline because: (1) it more closely approximates the electrolyte composition of lost plasma, (2) the lactate acts as a buffer against the metabolic acidosis of burn injury, and (3) large-volume NS resuscitation causes hyperchloremic metabolic acidosis. Critical nursing considerations include: the Parkland formula provides a STARTING POINT — actual fluid rates should be titrated to maintain urine output of 0.5-1 mL/kg/hour (30-50 mL/hour in adults, 1 mL/kg/hour in children). The nurse should insert a Foley catheter for accurate urine output measurement and adjust IV rates accordingly. Over-resuscitation ('fluid creep') is a recognized complication that can cause abdominal compartment syndrome, pulmonary edema, and worsening of extremity compartment syndrome. Under-resuscitation leads to acute kidney injury and organ failure. Colloid solutions (albumin) are generally avoided in the first 24 hours because capillary leak syndrome allows proteins to extravasate into the interstitial space, worsening edema.",
    learningObjective: "Calculate fluid resuscitation using the Parkland formula and apply the Rule of Nines for burn assessment",
    blueprintCategory: "Trauma",
    subtopic: "burn injuries",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The first half of the Parkland volume is given in the first 8 hours from the TIME OF INJURY, not from ED arrival — recalculate if there is a delay",
    clinicalPearls: [
      "Parkland formula: 4 mL × kg × %TBSA = 24-hour fluid volume; half in first 8 hours, half in next 16",
      "Titrate to urine output 0.5-1 mL/kg/hour — the formula is a starting point, not a fixed prescription",
      "Lactated Ringer's is preferred over NS to avoid hyperchloremic metabolic acidosis"
    ],
    safetyNote: "Monitor for 'fluid creep' (over-resuscitation) — excessive fluid causes abdominal compartment syndrome, pulmonary edema, and worsens extremity edema",
    distractorRationales: [
      "2,240 mL uses a factor of 1 mL/kg/% instead of the correct 4 mL/kg/%",
      "4,480 mL uses a factor of 2 mL/kg/% — this is the volume for the first 8 hours, not the full 24-hour volume",
      "17,920 mL uses a factor of 8 mL/kg/% which would cause dangerous over-resuscitation"
    ],
    lessonPath: "/emergency/lessons/burn-injuries"
  },
  {
    stem: "An 85-year-old male with atrial fibrillation on apixaban presents after a fall from standing height. He has a small frontal scalp abrasion. He denies headache, dizziness, or loss of consciousness. GCS is 15 with a normal neurological exam. Should CT head be performed?",
    options: [
      "No — the mechanism is minor and the patient is neurologically intact",
      "Yes — all anticoagulated patients with head trauma, regardless of mechanism severity, require CT imaging due to increased risk of intracranial hemorrhage",
      "Only if the patient develops symptoms within the next 24 hours",
      "An MRI would be more appropriate than CT for this patient"
    ],
    correctAnswer: 1,
    rationaleLong: "All patients on anticoagulant therapy (including DOACs such as apixaban, warfarin, and antiplatelet agents) who sustain any head trauma — regardless of the apparent severity of the mechanism — require CT imaging of the head. This recommendation exists because anticoagulated patients have a significantly higher risk of intracranial hemorrhage (ICH) from even minor mechanisms, and the clinical presentation can be initially benign with delayed deterioration. Studies show that anticoagulated patients have a 5-10 fold increased risk of ICH after head trauma compared to non-anticoagulated patients. Furthermore, intracranial hemorrhages in anticoagulated patients are more likely to expand over time due to the impaired hemostatic mechanisms. The concept of 'low-risk' head trauma based on mechanism alone (as applied in decision rules like NEXUS and Canadian CT Head Rule) does not safely apply to anticoagulated patients. These clinical decision rules were developed and validated in populations that largely excluded anticoagulated patients, so their sensitivity for detecting ICH in this population is unknown and potentially inadequate. This 85-year-old male on apixaban represents the highest-risk demographic: advanced age (brain atrophy increases bridging vein vulnerability), male sex (higher ICH risk), and DOAC use. Even a ground-level fall can produce sufficient force to cause SDH in an elderly, anticoagulated patient. The emergency nurse should: obtain CT head, document the anticoagulation status prominently, determine and document the last dose of apixaban (this affects reversal agent timing if needed), draw renal function labs (apixaban clearance is partially renal-dependent), and plan for observation or admission even if the initial CT is negative, as delayed hemorrhage can occur. If ICH is identified, andexanet alfa is the specific reversal agent for apixaban.",
    learningObjective: "Apply the guideline that all anticoagulated patients with head trauma require CT imaging regardless of mechanism severity",
    blueprintCategory: "Trauma",
    subtopic: "geriatric trauma",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Clinical decision rules (Canadian CT Head Rule, NEXUS) were NOT validated in anticoagulated patients — do not use them to defer imaging in this population",
    clinicalPearls: [
      "Anticoagulated patients have 5-10 fold increased risk of ICH from head trauma",
      "All anticoagulated patients with any head trauma require CT imaging regardless of symptoms",
      "Andexanet alfa is the specific reversal agent for apixaban (factor Xa inhibitors)"
    ],
    safetyNote: "A negative initial CT in an anticoagulated patient does not rule out delayed hemorrhage — consider observation/admission and repeat CT if symptoms develop",
    distractorRationales: [
      "Minor mechanism does NOT safely exclude ICH in anticoagulated patients — always image",
      "Waiting for symptom development risks delayed diagnosis of expanding hemorrhage that could be caught early",
      "CT is the appropriate emergent imaging modality for acute intracranial hemorrhage — MRI is not the initial study"
    ],
    lessonPath: "/emergency/lessons/geriatric-trauma"
  }
];
