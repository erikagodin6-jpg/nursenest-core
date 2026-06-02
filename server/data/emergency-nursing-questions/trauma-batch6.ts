import { EmergencyNursingQuestion } from "./types";

export const traumaBatch6Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 30-year-old male presents to the ED with a gunshot wound to the right buttock. He has no external exit wound visible. He is hemodynamically stable. The nurse understands that this wound trajectory puts multiple structures at risk. Which diagnostic study is MOST important to evaluate for occult injuries?",
    options: [
      "X-ray of the pelvis only to locate the bullet",
      "CT scan of the abdomen and pelvis with IV and rectal contrast to evaluate for intraperitoneal, vascular, and rectal injuries",
      "Ultrasound of the buttock to assess soft tissue damage",
      "MRI of the pelvis for detailed soft tissue evaluation"
    ],
    correctAnswer: 1,
    rationaleLong: "Gunshot wounds (GSWs) to the buttock are deceptively dangerous because the trajectory can involve multiple critical structures that are not apparent from the external wound location. The buttock region overlies the pelvis, and projectiles can traverse into the peritoneal cavity, retroperitoneum, or pelvic organs. Structures at risk include: the rectum and sigmoid colon (rectal perforation requires colostomy), iliac vessels (life-threatening hemorrhage), bladder, urethra, sciatic nerve (the largest nerve in the body traverses the buttock), pelvic bones with potential for fracture and associated hemorrhage, and small bowel if the projectile enters the peritoneal cavity. CT scan with IV contrast (to evaluate vascular structures) and rectal contrast (to evaluate for rectal perforation) is the imaging modality of choice for hemodynamically stable patients with transpelvic GSWs. Rectal contrast is particularly important because clinical signs of rectal perforation may be initially absent, and delayed diagnosis significantly increases morbidity (sepsis, necrotizing fasciitis). The emergency nurse should: perform a digital rectal exam (checking for blood, rectal wall disruption, and tone), assess for gross hematuria (suggesting bladder/urethral injury), perform a thorough lower extremity neurological assessment (sciatic nerve), establish large-bore IV access with type and crossmatch, administer broad-spectrum antibiotics if rectal perforation is suspected, and monitor for signs of hemorrhage. All GSWs to the buttock in the zone between the iliac crests and greater trochanters should be considered potential transpelvic injuries until proven otherwise. MRI is contraindicated when a ferromagnetic projectile may be present.",
    learningObjective: "Evaluate the potential injury trajectory of buttock gunshot wounds and order appropriate diagnostic imaging",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Buttock GSWs are NOT 'minor' injuries — the trajectory can traverse the pelvis and injure intraperitoneal, vascular, and rectal structures",
    clinicalPearls: [
      "CT with IV and rectal contrast is the standard for evaluating transpelvic GSWs",
      "Digital rectal exam is essential — blood on exam suggests rectal perforation requiring colostomy",
      "Assess sciatic nerve function (dorsiflexion, plantarflexion, sensation) in all buttock penetrating injuries"
    ],
    safetyNote: "MRI is CONTRAINDICATED when a ferromagnetic projectile may be retained — always verify with plain films first",
    distractorRationales: [
      "X-ray alone identifies bullet location but does not evaluate organ injury along the trajectory",
      "Ultrasound cannot adequately evaluate the deep pelvic structures or bowel perforation",
      "MRI is contraindicated with potential retained metallic foreign bodies and is too slow for acute evaluation"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 48-year-old female presents after being thrown from a horse. She landed on her left shoulder and has a visible 'step-off' deformity at the distal clavicle. She has pain with any arm movement but intact neurovascular status distally. X-ray confirms a Type III acromioclavicular (AC) joint separation. What is the key clinical finding that distinguishes AC separation from clavicle fracture?",
    options: [
      "Pain with arm movement is only present in clavicle fractures",
      "The 'step-off' deformity at the AC joint with a positive cross-body adduction test distinguishes AC separation from mid-shaft clavicle fracture",
      "Neurovascular compromise is always present in AC separation but not clavicle fracture",
      "AC separation only occurs in elderly patients"
    ],
    correctAnswer: 1,
    rationaleLong: "Acromioclavicular (AC) joint separation (also called AC joint sprain or 'separated shoulder') results from direct force to the acromion, driving it inferiorly while the clavicle remains in position, disrupting the AC and coracoclavicular (CC) ligaments. The classification system (Rockwood Types I-VI) describes the severity: Type I — AC ligament sprain without displacement; Type II — AC ligament rupture with CC ligament sprain, mild superior displacement of the distal clavicle; Type III — both AC and CC ligaments ruptured, the distal clavicle displaces superiorly creating a visible 'step-off' deformity (25-100% displacement); Types IV-VI involve progressively more severe displacement. The key clinical findings that distinguish AC separation from clavicle fracture include: (1) The 'step-off' deformity is localized to the AC joint (the prominence of the distal clavicle above the acromion), not at the mid-shaft of the clavicle; (2) The cross-body adduction test (bringing the affected arm across the body toward the opposite shoulder) specifically stresses the AC joint and reproduces pain — this test is positive in AC separation but does not specifically stress a clavicle fracture site; (3) Point tenderness is directly over the AC joint; (4) The 'piano key sign' — pushing down on the elevated distal clavicle causes it to spring back up when released, similar to pressing a piano key. The emergency nurse should apply a sling for comfort, provide ice and analgesia, document neurovascular status, and arrange orthopedic follow-up. Type III separations are managed conservatively (sling, activity modification, rehabilitation) in most patients, though some active/young patients may benefit from surgical reconstruction.",
    learningObjective: "Distinguish acromioclavicular joint separation from clavicle fracture by clinical examination findings",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 2,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "A 'separated shoulder' (AC separation) is different from a 'dislocated shoulder' (glenohumeral dislocation) — do not confuse the two",
    clinicalPearls: [
      "Piano key sign: depress the elevated clavicle — it springs back when released",
      "Cross-body adduction test specifically stresses the AC joint",
      "Type III AC separations: conservative management is effective for most patients"
    ],
    safetyNote: "Document neurovascular status thoroughly — Type IV-VI AC separations involve more severe displacement that can compromise the brachial plexus",
    distractorRationales: [
      "Pain with arm movement occurs in both AC separation and clavicle fracture",
      "Neurovascular compromise is uncommon in both conditions unless severe displacement occurs",
      "AC separation occurs across all age groups, not exclusively in the elderly"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 15-year-old male presents after a wrestling injury with immediate knee swelling. He reports feeling a 'pop' and the knee giving way. Examination reveals a large hemarthrosis and positive Lachman test. What is the most likely diagnosis, and what is the nursing priority?",
    options: [
      "Meniscal tear — apply ice and arrange outpatient MRI",
      "ACL tear — apply a knee immobilizer, provide crutches and pain management, and arrange urgent orthopedic referral",
      "Patellar dislocation — reduce the patella immediately",
      "Tibial plateau fracture — prepare for surgical fixation"
    ],
    correctAnswer: 1,
    rationaleLong: "The clinical triad of immediate swelling (hemarthrosis developing within 2 hours), a 'pop' sensation, and a positive Lachman test is highly suggestive of an anterior cruciate ligament (ACL) tear. The Lachman test (performed with the knee at 20-30 degrees of flexion by stabilizing the femur and pulling the tibia anteriorly) is the most sensitive physical examination test for ACL injury, with approximately 85-95% sensitivity. A positive test reveals increased anterior tibial translation compared to the uninjured knee, with a soft or absent endpoint. Acute hemarthrosis within 2 hours of knee injury has a specific differential: ACL tear accounts for approximately 70% of acute traumatic hemarthroses, patellar dislocation approximately 10%, meniscal tear with peripheral rim involvement approximately 10%, and intra-articular fractures approximately 10%. The emergency nurse's priorities include: (1) Applying a well-fitted knee immobilizer in extension to provide stability and comfort; (2) Providing crutches and instruction on non-weight-bearing or partial weight-bearing ambulation; (3) Pain management (ice, elevation, NSAIDs, and/or opioids depending on pain severity); (4) Arranging urgent orthopedic referral — ACL injuries in adolescent patients require specialized evaluation because the growth plates may still be open, which affects surgical planning; (5) Educating the patient about activity restrictions. MRI is the gold standard for confirming ACL tear (98% sensitivity) and evaluating for associated injuries (meniscal tears, bone bruising, other ligament injuries). In adolescent athletes, ACL tears are increasingly common and surgical reconstruction is often recommended for active patients to prevent recurrent instability, meniscal damage, and early-onset osteoarthritis.",
    learningObjective: "Identify the clinical presentation of ACL tear and implement appropriate emergency department management",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Acute hemarthrosis (within 2 hours) = ACL tear until proven otherwise. The Lachman test is more sensitive than the anterior drawer test for ACL assessment.",
    clinicalPearls: [
      "ACL tear accounts for ~70% of acute traumatic hemarthroses",
      "Lachman test (knee at 20-30° flexion) is 85-95% sensitive for ACL tear",
      "Adolescent ACL injuries require evaluation of growth plate status before surgical planning"
    ],
    safetyNote: "Assess for associated injuries — ACL tears commonly coexist with meniscal tears and MCL sprains (the 'unhappy triad' or O'Donoghue triad)",
    distractorRationales: [
      "Meniscal tears typically cause delayed swelling (6-12 hours) and a positive McMurray test, not acute hemarthrosis with a positive Lachman",
      "Patellar dislocation presents with lateral patellar displacement or apprehension, not a positive Lachman test",
      "Tibial plateau fractures present with valgus/varus instability and are typically seen on X-ray"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 55-year-old male presents to the ED with a penetrating stab wound to the epigastric region. He is hemodynamically stable. The wound appears to be superficial but the depth cannot be determined on examination. What is the appropriate assessment approach?",
    options: [
      "Clean the wound, apply steri-strips, and discharge with wound care instructions",
      "Perform local wound exploration to determine fascial penetration — if the anterior fascia is violated, further evaluation with CT or serial examination is required",
      "Insert a finger into the wound to feel for organ damage",
      "Immediate exploratory laparotomy for all epigastric stab wounds"
    ],
    correctAnswer: 1,
    rationaleLong: "The management of anterior abdominal stab wounds in hemodynamically stable patients follows an algorithmic approach based on fascial penetration. Local wound exploration (LWE) is a bedside procedure performed under local anesthesia to determine whether the wound penetrates the anterior fascia of the abdominal wall. If the fascia is intact, the wound is superficial and the patient can be safely discharged with wound care instructions (after appropriate cleaning, irrigation, and tetanus prophylaxis). If the fascia is violated, the wound has the potential to have injured intra-abdominal structures, and further evaluation is required. Options for further evaluation include: CT scan with triple contrast (IV, oral, and sometimes rectal) to detect organ injury, serial clinical examinations (physical exam, vital signs, and labs every 4-8 hours for 24 hours), or diagnostic laparoscopy. The current evidence-based approach for stable patients with fascial penetration is selective non-operative management with serial clinical examination — approximately 50-70% of anterior abdominal stab wounds that penetrate the fascia do NOT cause significant intra-abdominal injury. This selective approach avoids unnecessary laparotomy (which carries its own morbidity: wound infection, adhesion formation, ileus, DVT). Mandatory surgical exploration is reserved for hemodynamically unstable patients, signs of peritonitis (rigid abdomen, rebound tenderness), evisceration (protruding omentum or bowel), or evidence of specific organ injury on imaging. The emergency nurse should: prepare for LWE (local anesthesia, adequate lighting, sterile instruments), assist with the procedure, prepare for potential CT if fascia is violated, and understand the serial examination protocol if the patient is admitted for observation.",
    learningObjective: "Apply the algorithmic approach to anterior abdominal stab wound evaluation based on fascial penetration",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "50-70% of stab wounds that penetrate the anterior fascia do NOT cause significant intra-abdominal injury — selective non-operative management avoids unnecessary laparotomy",
    clinicalPearls: [
      "Local wound exploration determines fascial integrity — intact fascia = superficial wound",
      "Fascial penetration requires further evaluation: CT, serial exams, or diagnostic laparoscopy",
      "Mandatory exploration: hemodynamic instability, peritonitis, or evisceration"
    ],
    safetyNote: "Serial examination for admitted patients includes abdominal exam, vital signs, and labs (CBC, lactate) every 4-8 hours for 24 hours",
    distractorRationales: [
      "Discharging without determining fascial penetration risks missing a potentially life-threatening intra-abdominal injury",
      "Blindly inserting a finger into a wound is inappropriate — LWE is a systematic examination under direct visualization",
      "Mandatory laparotomy for all stab wounds results in a high rate of non-therapeutic surgery (30-50%)"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 3-year-old child is brought to the ED after pulling a pot of boiling water off the stove. She has scald burns to her face, anterior neck, and bilateral upper extremities. She is crying but speaking in a hoarse voice. What is the MOST time-critical concern?",
    options: [
      "Calculating fluid resuscitation using the Parkland formula",
      "Airway compromise from thermal edema — early intubation may be needed before progressive swelling makes it impossible",
      "Pain management with oral acetaminophen",
      "Applying silver sulfadiazine to all burned areas immediately"
    ],
    correctAnswer: 1,
    rationaleLong: "In this pediatric scald burn patient, the hoarse voice is an ominous sign indicating supraglottic edema from thermal injury to the upper airway. The combination of facial burns, anterior neck burns, and voice changes suggests thermal inhalation injury affecting the airway. In pediatric patients, the airway is anatomically smaller (the cricoid ring is the narrowest point in children under 8, as opposed to the vocal cords in adults), which means that even small amounts of edema can cause proportionally greater airway narrowing. A 1mm circumferential edema in an infant's 4mm-diameter subglottic airway reduces the cross-sectional area by approximately 75% and increases airway resistance 16-fold (Poiseuille's law). The hoarse voice indicates that edema is already affecting the larynx. This edema will PROGRESS over the next 12-24 hours as the inflammatory response peaks, potentially converting a manageable airway into one that is impossible to intubate. The principle of 'when in doubt, intubate early' is paramount in burn airway management — it is far better to intubate an airway that can be managed than to attempt emergency intubation on a massively edematous, unrecognizable airway. The emergency nurse should: prepare age-appropriate intubation equipment (uncuffed ET tube for children under 8 using the formula [age/4] + 4 for ET tube size, though cuffed tubes are increasingly accepted), have a surgical airway kit available (needle cricothyrotomy preferred over surgical cricothyrotomy in children under 12), pre-oxygenate the child, suction equipment ready, and communicate the urgency to the physician. Fluid resuscitation and wound care are important but secondary to securing the airway.",
    learningObjective: "Recognize signs of impending airway compromise in pediatric burn patients and prioritize early intubation",
    blueprintCategory: "Trauma",
    subtopic: "burn injuries",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "In pediatric burns, airway edema PROGRESSES over 12-24 hours — if you wait until the airway is compromised, intubation may be impossible. Intubate EARLY.",
    clinicalPearls: [
      "1mm edema in a pediatric airway reduces cross-sectional area by ~75% and increases resistance 16-fold",
      "Pediatric ET tube size: (age/4) + 4 for uncuffed; (age/4) + 3.5 for cuffed",
      "Needle cricothyrotomy is preferred over surgical cricothyrotomy in children under 12"
    ],
    safetyNote: "Never apply silver sulfadiazine to the face — it can cause permanent skin discoloration. Use bacitracin or aqueous silver-based agents for facial burns.",
    distractorRationales: [
      "Fluid resuscitation is important but airway management always takes priority in the ABC approach",
      "Oral pain management is insufficient for significant burns and may be contraindicated if the patient may need intubation",
      "Silver sulfadiazine should not be applied to the face, and wound care is secondary to airway management"
    ],
    lessonPath: "/emergency/lessons/burn-injuries"
  },
  {
    stem: "A 28-year-old female presents with a Lisfranc injury (tarsometatarsal joint complex disruption) to her right foot after stepping into a hole while running. She has midfoot swelling, inability to bear weight, and plantar ecchymosis. Why is plantar ecchymosis a significant clinical finding?",
    options: [
      "It indicates a superficial skin bruise only",
      "Plantar ecchymosis is pathognomonic for Lisfranc injury and indicates disruption of the plantar ligamentous complex with associated instability",
      "It is a normal finding after any foot injury",
      "Plantar ecchymosis indicates a calcaneal fracture, not a Lisfranc injury"
    ],
    correctAnswer: 1,
    rationaleLong: "Plantar ecchymosis (bruising on the sole of the foot) is a highly significant clinical finding that is pathognomonic for Lisfranc injury — disruption of the tarsometatarsal (TMT) joint complex. The Lisfranc ligament is a strong plantar ligament connecting the medial cuneiform to the base of the second metatarsal, and it is the primary stabilizer of the midfoot arch. When this ligament is disrupted (along with the associated dorsal and interosseous ligaments), blood dissects through the disrupted plantar tissues and becomes visible as plantar ecchymosis. Lisfranc injuries are frequently missed (up to 20% are missed on initial presentation), which is clinically devastating because delayed or missed diagnosis leads to chronic midfoot instability, post-traumatic arthritis, chronic pain, and significant disability. The mechanism can be seemingly minor (as in this case — stepping into a hole while running), which contributes to the high missed diagnosis rate. Standard weight-bearing X-rays may show subtle findings: widening between the first and second metatarsal bases (greater than 2mm), loss of the normal alignment between the medial border of the second metatarsal and the medial border of the middle cuneiform, and small avulsion fractures at the Lisfranc ligament attachment (the 'fleck sign'). CT scan is superior for detecting subtle fractures and dislocations. The emergency nurse should: recognize plantar ecchymosis as a red flag finding, ensure weight-bearing X-rays are obtained if possible (non-weight-bearing films may miss subtle instability), communicate the significance of this finding to the treating physician, splint the foot in a posterior splint, provide crutches for non-weight-bearing ambulation, and arrange urgent orthopedic follow-up. Unstable Lisfranc injuries require surgical fixation.",
    learningObjective: "Recognize plantar ecchymosis as pathognomonic for Lisfranc injury and understand the importance of early diagnosis",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Lisfranc injuries are missed 20% of the time — plantar ecchymosis is the KEY clinical finding that should trigger further evaluation",
    clinicalPearls: [
      "Plantar ecchymosis is pathognomonic for Lisfranc ligamentous disruption",
      "The 'fleck sign' on X-ray (small avulsion fragment between 1st and 2nd metatarsal bases) indicates Lisfranc avulsion",
      "Weight-bearing X-rays are more sensitive than non-weight-bearing for detecting Lisfranc instability"
    ],
    safetyNote: "Missed Lisfranc injuries result in chronic midfoot instability and arthritis — always have a high index of suspicion with midfoot injuries",
    distractorRationales: [
      "Plantar ecchymosis is not a superficial finding — it indicates deep ligamentous disruption",
      "Plantar ecchymosis is not normal after any foot injury — it is specific to Lisfranc and midfoot injuries",
      "Calcaneal fractures present with heel pain and lateral heel widening, not midfoot plantar ecchymosis"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 40-year-old male is brought to the ED after a workplace incident where a pressurized air hose was held against his skin as a prank by a coworker. He has subcutaneous emphysema tracking across the right arm and into the chest. CXR shows subcutaneous air and a small pneumomediastinum. What is the primary concern with compressed air injection injuries?",
    options: [
      "The subcutaneous air will be absorbed harmlessly within hours",
      "Compressed air can dissect along fascial planes causing compartment syndrome, mediastinal air can cause tension pneumomediastinum, and air embolism is possible if air enters the venous system",
      "The injury is purely cosmetic and requires no treatment",
      "The air injection only causes local skin damage at the entry site"
    ],
    correctAnswer: 1,
    rationaleLong: "Compressed air injection injuries from industrial air sources (typically operating at 80-150 PSI) are dangerous injuries that are frequently underestimated. The high-pressure air enters through the skin and rapidly dissects along fascial planes and tissue spaces, traveling far from the entry site. The clinical concerns include: (1) COMPARTMENT SYNDROME — air accumulation within closed fascial compartments increases pressure, potentially compromising neurovascular function. The subcutaneous emphysema tracking from the arm to the chest demonstrates the ability of the injected air to travel along fascial planes; (2) TENSION PNEUMOMEDIASTINUM — air tracking into the mediastinum can cause compression of the great vessels and heart, similar to tension pneumothorax. The pneumomediastinum on CXR in this patient is concerning; (3) AIR EMBOLISM — if the pressurized air enters the venous system (through damaged vessels at the injection site), air emboli can travel to the pulmonary vasculature (causing hemodynamic collapse) or, if a patent foramen ovale exists, can cross to the arterial side causing stroke or coronary air embolism; (4) TISSUE NECROSIS — the rapid expansion of air in tissue spaces causes mechanical tissue disruption and ischemia; (5) INFECTION — introduction of environmental contaminants into deep tissue spaces risks necrotizing soft tissue infection. The emergency nurse should: place on continuous cardiac monitoring, obtain serial CXR to monitor pneumomediastinum, assess for compartment syndrome in the affected arm (pain with passive stretch, tense compartments), prepare for potential needle decompression if tension physiology develops, measure compartment pressures if clinically indicated, and administer prophylactic antibiotics. The patient requires admission for monitoring as the clinical picture can evolve over hours.",
    learningObjective: "Recognize the serious complications of compressed air injection injuries including compartment syndrome and air embolism",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Compressed air injection is NOT a trivial 'prank injury' — it can cause compartment syndrome, pneumomediastinum, air embolism, and death",
    clinicalPearls: [
      "Industrial compressed air operates at 80-150 PSI — sufficient to dissect along fascial planes extensively",
      "Air embolism can occur if pressurized air enters the venous system at the injection site",
      "Subcutaneous emphysema tracking from extremity to chest indicates extensive fascial plane dissection"
    ],
    safetyNote: "Admit for monitoring — pneumomediastinum can progress to tension physiology, and compartment syndrome can develop over hours",
    distractorRationales: [
      "While small amounts of subcutaneous air may be absorbed, the volumes from pressurized injection can cause serious complications",
      "These injuries are far from cosmetic — they can cause life-threatening compartment syndrome and air embolism",
      "Air travels extensively along fascial planes — damage extends far beyond the entry site"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 66-year-old male with a history of aortic valve replacement (mechanical valve) on warfarin presents after a fall with a large scalp laceration and altered mental status. His INR is 8.2. CT head shows an acute subdural hematoma with 8mm of midline shift. What is the MOST rapid warfarin reversal strategy?",
    options: [
      "Fresh frozen plasma (FFP) infusion over 2-4 hours",
      "4-factor prothrombin complex concentrate (PCC) plus IV vitamin K — PCC provides immediate reversal within 15-30 minutes",
      "Vitamin K 10mg IV alone and recheck INR in 6 hours",
      "Recombinant factor VIIa as the sole reversal agent"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with a life-threatening intracranial hemorrhage requiring emergent warfarin reversal. The supratherapeutic INR of 8.2 combined with an expanding subdural hematoma with midline shift creates a time-critical situation where rapid reversal is essential. The optimal strategy is 4-factor prothrombin complex concentrate (4F-PCC, brand name KCentra in the US) plus IV vitamin K. 4F-PCC contains concentrated vitamin K-dependent clotting factors (II, VII, IX, and X) plus proteins C and S, providing immediate restoration of coagulation capacity within 15-30 minutes of infusion. The dose is based on the current INR and patient weight (typically 25-50 units/kg). PCC is preferred over FFP for several critical reasons: (1) Rapid action — PCC reverses INR within 15-30 minutes compared to 4-8 hours for FFP; (2) Small volume — PCC is a concentrated product requiring only 50-100 mL compared to 1,500-2,000 mL of FFP for full reversal, avoiding volume overload (especially important in elderly patients who may have concurrent heart failure); (3) No need for thawing — PCC is a lyophilized powder reconstituted in minutes, while FFP requires 30-45 minutes to thaw; (4) Predictable dose-response — PCC produces more predictable INR correction than FFP. IV vitamin K (10mg administered over 15-30 minutes) is given simultaneously but has a delayed onset (6-24 hours). It is essential because PCC's effect is temporary (12-24 hours) — vitamin K provides sustained reversal by enabling the liver to produce new clotting factors. Without vitamin K, the INR will re-elevate as the PCC factors are consumed. The mechanical valve adds complexity: these patients require lifelong anticoagulation, and reversal increases the short-term risk of valve thrombosis. However, in the setting of life-threatening ICH, reversal takes priority. The decision to restart anticoagulation is made collaboratively after the acute hemorrhage is controlled.",
    learningObjective: "Implement emergent warfarin reversal with 4-factor PCC and vitamin K for life-threatening hemorrhage",
    blueprintCategory: "Trauma",
    subtopic: "traumatic brain injury",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "4F-PCC reverses INR in 15-30 minutes vs. FFP which takes 4-8 hours — in life-threatening ICH, speed of reversal directly impacts survival",
    clinicalPearls: [
      "4F-PCC: 15-30 min reversal, small volume (50-100 mL), no thawing required",
      "FFP: 4-8 hours reversal, large volume (1500-2000 mL), requires 30-45 min thawing",
      "Always give vitamin K with PCC — PCC provides temporary reversal while vitamin K provides sustained reversal"
    ],
    safetyNote: "PCC in mechanical valve patients increases short-term valve thrombosis risk — restart anticoagulation discussions require cardiology and neurosurgery input",
    distractorRationales: [
      "FFP is too slow (4-8 hours) and requires too much volume for emergent warfarin reversal in ICH",
      "Vitamin K alone takes 6-24 hours — this is too slow for acute life-threatening hemorrhage",
      "Recombinant factor VIIa is not the standard of care and carries higher thrombotic risk than PCC"
    ],
    lessonPath: "/emergency/lessons/traumatic-brain-injury"
  },
  {
    stem: "A 12-year-old child presents with a Salter-Harris Type II fracture of the distal radius. The parents ask about potential growth complications. The nurse explains that this fracture type has what prognosis regarding growth plate complications?",
    options: [
      "Type II Salter-Harris fractures have the worst prognosis for growth disturbance",
      "Type II fractures generally have a good prognosis — the fracture line extends through the growth plate and exits through the metaphysis, sparing the germinal layer of the physis",
      "All Salter-Harris fractures inevitably cause growth arrest",
      "Type II fractures do not involve the growth plate at all"
    ],
    correctAnswer: 1,
    rationaleLong: "The Salter-Harris classification system describes pediatric fractures involving the physis (growth plate) and is critical for predicting growth complications. The classification uses the mnemonic SALTR: Type I — Slip (fracture through the physis only), Type II — Above (fracture through the physis exiting through the metaphysis), Type III — Lower (fracture through the physis exiting through the epiphysis), Type IV — Through (fracture through the metaphysis, physis, and epiphysis), Type V — Rammed/crushed (compression injury to the physis). Type II fractures are the most common Salter-Harris type (approximately 75% of all growth plate fractures). They have a generally good prognosis because the fracture line passes through the hypertrophic zone of the physis (the layer farthest from the germinal/reserve zone) and exits through the metaphysis, leaving the critical germinal layer of the growth plate intact. The germinal zone (reserve zone and proliferative zone) is responsible for continued growth, and because it is undisturbed in Type II fractures, normal growth typically continues. Prognosis worsens as the classification number increases: Types III and IV involve the epiphysis and can disrupt the germinal layer, carrying a higher risk of growth arrest, angular deformity, or limb length discrepancy. Type V injuries (crush) have the worst prognosis because the entire physis is compressed, often causing complete growth arrest. The emergency nurse should: explain to the parents that while the prognosis is generally good, all growth plate injuries require orthopedic follow-up to monitor for potential growth disturbance over the next 1-2 years, as growth arrest can manifest as angular deformity or limb length discrepancy during the remaining growth period.",
    learningObjective: "Apply the Salter-Harris classification system and communicate prognosis for growth plate fractures to families",
    blueprintCategory: "Trauma",
    subtopic: "pediatric trauma",
    difficulty: 2,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "SALTR mnemonic: Slip, Above, Lower, Through, Rammed. Prognosis worsens as the number increases — Type I-II good, Type III-IV moderate, Type V worst.",
    clinicalPearls: [
      "Type II is the most common Salter-Harris fracture (~75% of growth plate fractures)",
      "The germinal (reserve/proliferative) zone is critical for growth — Types I-II spare it",
      "All growth plate injuries require orthopedic follow-up for 1-2 years to monitor growth"
    ],
    safetyNote: "Type V (crush) injuries may appear normal on initial X-ray — diagnosis is often retrospective when growth arrest is identified on follow-up",
    distractorRationales: [
      "Type V (not Type II) has the worst prognosis for growth disturbance",
      "Not all Salter-Harris fractures cause growth arrest — Types I-II generally have good prognoses",
      "Type II fractures by definition involve the growth plate (physis) — the fracture line passes through it"
    ],
    lessonPath: "/emergency/lessons/pediatric-trauma"
  },
  {
    stem: "A 26-year-old female presents after a head-on MVC with a dashboard impact to her right knee. She has a posterior hip dislocation — the right leg is shortened, internally rotated, and adducted. A large sciatic nerve deficit is noted (foot drop and decreased sensation in the posterior leg). After successful closed reduction under sedation, the foot drop persists. What is the expected timeline for sciatic nerve recovery?",
    options: [
      "Immediate recovery is expected as soon as the hip is reduced",
      "Sciatic nerve recovery after traction injury may take months to years, with incomplete recovery expected in some cases — monitor with serial examinations and electromyography at 3-4 weeks",
      "Sciatic nerve injuries from hip dislocation never recover",
      "Surgical nerve repair should be performed immediately in the ED"
    ],
    correctAnswer: 1,
    rationaleLong: "Sciatic nerve injury occurs in approximately 10-15% of posterior hip dislocations due to the nerve's anatomical proximity to the posterior acetabulum. As the femoral head displaces posteriorly, it can compress, stretch, or directly contuse the sciatic nerve (or its peroneal division, which is more commonly affected due to its more lateral position and less protective tissue coverage). The mechanism is typically a neuropraxia (nerve bruise with intact structural continuity) or axonotmesis (axonal disruption with preserved nerve sheath), rather than neurotmesis (complete nerve transection). Recovery from sciatic nerve traction injury follows nerve regeneration physiology: (1) Neuropraxia — recovery within days to weeks as the nerve conduction block resolves (best prognosis); (2) Axonotmesis — recovery takes months to years as axons must regenerate at approximately 1mm/day from the injury site to the target muscle. For a hip-level injury to reach the muscles of the foot, this can take 12-18 months; (3) Complete recovery occurs in approximately 40-60% of cases, with partial recovery in an additional 20-30%, and some patients retain permanent deficits. Electromyography (EMG) and nerve conduction studies should be obtained at 3-4 weeks post-injury (earlier studies are unreliable because Wallerian degeneration takes 2-3 weeks to complete). The emergency nurse should: document the neurological deficit thoroughly before and after reduction, apply an ankle-foot orthosis (AFO) to prevent equinus contracture from the foot drop, educate the patient about the expected timeline for recovery, arrange neurology and orthopedic follow-up, and provide fall prevention education (foot drop significantly increases fall risk).",
    learningObjective: "Manage sciatic nerve injury associated with posterior hip dislocation and set appropriate recovery expectations",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "The peroneal division of the sciatic nerve is more commonly affected than the tibial division — foot drop (peroneal) is the most common finding",
    clinicalPearls: [
      "Sciatic nerve injury occurs in 10-15% of posterior hip dislocations",
      "Nerve regeneration rate: approximately 1mm/day from injury site to target muscle",
      "EMG at 3-4 weeks post-injury — earlier testing is unreliable before Wallerian degeneration completes"
    ],
    safetyNote: "Apply an ankle-foot orthosis (AFO) immediately to prevent equinus contracture from foot drop — this preserves functional potential during the recovery period",
    distractorRationales: [
      "Immediate recovery after reduction only occurs with neuropraxia — most injuries involve some axonal damage requiring months of regeneration",
      "Complete permanent loss is not inevitable — 40-60% of patients achieve complete recovery",
      "Surgical nerve repair is not indicated acutely — most injuries recover with observation, and surgery is reserved for cases without EMG evidence of recovery at 3-6 months"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 45-year-old male presents with a traumatic amputation of the tip of his right index finger (distal to the DIP joint) sustained while using a table saw. The amputated tip was not recovered. The bone is exposed at the stump. What is the appropriate wound management?",
    options: [
      "Primary closure by suturing skin flaps over the exposed bone",
      "Allow the wound to heal by secondary intention with moist wound care — fingertip amputations distal to the DIP joint have excellent healing potential without surgical reconstruction",
      "Immediate referral for microsurgical replantation of the amputated tip",
      "Shortening the bone and closing the wound under tension"
    ],
    correctAnswer: 1,
    rationaleLong: "Fingertip amputations distal to the distal interphalangeal (DIP) joint represent a common hand injury with several management options depending on the wound characteristics. When the amputated part is not available for replantation and the defect is relatively small (less than 1 cm² of exposed bone), conservative management with moist wound care and healing by secondary intention is well-established and produces excellent functional and cosmetic outcomes. The fingertip has remarkable regenerative capacity, particularly in younger patients. Secondary intention healing involves: (1) Gentle wound cleansing and irrigation; (2) Application of a non-adherent moist wound dressing (petrolatum gauze or specialized wound care products); (3) Regular dressing changes (typically every 2-3 days initially); (4) The wound granulates from the base upward, with soft tissue gradually covering the exposed bone as it resorbs slightly. Complete healing typically takes 3-6 weeks, and the resulting fingertip often has surprisingly good sensation and functional soft tissue coverage. This approach is preferred over primary closure techniques such as: V-Y advancement flaps (which are appropriate for larger defects), cross-finger flaps, or thenar flaps — these surgical techniques add complexity, potential complications, and may not produce superior outcomes for small distal fingertip amputations. Shortening the bone to allow tension-free closure is an option but unnecessarily sacrifices finger length. Since the amputated tip was not recovered, replantation is not possible. The emergency nurse should: perform a digital block for pain management, irrigate the wound thoroughly, apply a moist non-adherent dressing, apply a protective finger splint, update tetanus prophylaxis, educate the patient about wound care and expected healing timeline, and arrange hand surgery follow-up.",
    learningObjective: "Apply conservative wound management for fingertip amputations distal to the DIP joint",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Small fingertip amputations distal to the DIP heal remarkably well with secondary intention — surgical reconstruction is often unnecessary and may not produce better outcomes",
    clinicalPearls: [
      "Fingertips have excellent regenerative capacity for wounds healing by secondary intention",
      "Moist wound environment promotes faster healing than dry dressings",
      "Complete healing by secondary intention takes 3-6 weeks with good functional outcomes"
    ],
    safetyNote: "Larger defects (>1 cm² exposed bone) or amputations proximal to the DIP joint require hand surgery consultation for potential flap coverage",
    distractorRationales: [
      "Primary closure under tension risks flap necrosis and wound breakdown",
      "Replantation requires the amputated part — it is not possible when the tip is not recovered",
      "Shortening the bone unnecessarily sacrifices finger length when secondary intention healing produces good results"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 32-year-old male presents to the ED after a motorcycle accident with an open-book pelvic fracture (anteroposterior compression type). He is hypotensive with HR 140 bpm and BP 68/40 mmHg. FAST is negative. Where is the hemorrhage most likely occurring?",
    options: [
      "Intraperitoneal hemorrhage from a liver laceration",
      "Retroperitoneal hemorrhage from disrupted pelvic venous plexus and fractured bone ends — not visible on FAST",
      "External hemorrhage from a perineal wound",
      "Intrathoracic hemorrhage from a rib fracture"
    ],
    correctAnswer: 1,
    rationaleLong: "Open-book (anteroposterior compression) pelvic fractures disrupt the anterior pelvic ring (pubic symphysis and/or rami) and can disrupt the posterior ring (sacroiliac joints). This disruption massively increases the volume of the pelvic cavity — in a normal pelvis, the pelvic volume is approximately 1.5 liters, but an open-book fracture can increase this to 4+ liters by allowing the hemipelves to externally rotate. The sacral venous plexus and internal iliac venous system are disrupted by the fracture, and hemorrhage into this expanded retroperitoneal space can be massive (3-4+ liters). Critically, this retroperitoneal hemorrhage is NOT visible on FAST examination — FAST detects INTRAperitoneal free fluid (in Morrison's pouch, splenorenal recess, pelvis, and pericardium), but retroperitoneal blood does not enter the peritoneal cavity unless the peritoneum is disrupted. This explains the paradox of hemodynamic instability with a negative FAST in this patient. Management priorities include: (1) Pelvic binder application — a circumferential pelvic compression device (commercial binder or bedsheet wrapped tightly around the greater trochanters) reduces the pelvic volume, tamponading venous hemorrhage. This is the single most important temporizing intervention; (2) Massive transfusion protocol activation; (3) Angiographic embolization for arterial hemorrhage (approximately 10-15% of pelvic hemorrhage is arterial); (4) Preperitoneal pelvic packing if embolization is unavailable; (5) External fixation if a binder is insufficient. The emergency nurse should apply the pelvic binder at the level of the greater trochanters (NOT the iliac crests), initiate MTP, establish large-bore IV access, and avoid log-rolling the patient (which can disrupt any clot that has formed in the pelvic hematoma).",
    learningObjective: "Recognize retroperitoneal hemorrhage from pelvic fracture as the cause of hemodynamic instability with negative FAST",
    blueprintCategory: "Trauma",
    subtopic: "blunt trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "A negative FAST does NOT rule out significant hemorrhage — retroperitoneal pelvic hemorrhage is invisible on FAST examination",
    clinicalPearls: [
      "Open-book pelvic fractures can increase pelvic volume from 1.5L to 4+ liters",
      "Pelvic binder applied at the greater trochanters (not iliac crests) reduces volume and tamponades venous bleeding",
      "85-90% of pelvic hemorrhage is venous — pelvic binder addresses this; 10-15% is arterial requiring embolization"
    ],
    safetyNote: "Do NOT log-roll patients with unstable pelvic fractures — this can disrupt the retroperitoneal tamponade and worsen hemorrhage",
    distractorRationales: [
      "Intraperitoneal hemorrhage would produce a positive FAST — the negative FAST rules this out",
      "While external perineal hemorrhage is possible, the hemodynamic instability is from internal retroperitoneal bleeding",
      "Intrathoracic hemorrhage would present with respiratory symptoms and be visible on CXR"
    ],
    lessonPath: "/emergency/lessons/blunt-trauma"
  },
  {
    stem: "A 50-year-old male presents to the ED after being bitten by a rattlesnake on his right hand while hiking. His hand is markedly swollen with ecchymosis tracking up the forearm. He reports tingling in his lips and a metallic taste. Vital signs: HR 110, BP 100/62. What is the definitive treatment?",
    options: [
      "Apply a tourniquet proximal to the bite to contain the venom",
      "Administer Crotalidae polyvalent immune Fab (CroFab) antivenom — the only definitive treatment for crotalid envenomation",
      "Incise the wound and attempt to suction out the venom",
      "Apply ice directly to the bite site and observe"
    ],
    correctAnswer: 1,
    rationaleLong: "Crotalid (pit viper) envenomation requires antivenom as the definitive treatment. CroFab (Crotalidae polyvalent immune Fab) is the FDA-approved antivenom for North American pit viper bites (rattlesnakes, copperheads, cottonmouths/water moccasins). This patient demonstrates moderate-to-severe envenomation: local effects (marked swelling with ecchymosis tracking beyond the bite site), systemic effects (perioral tingling and metallic taste indicating venom absorption), and hemodynamic changes (tachycardia and mild hypotension). The venom of pit vipers contains a complex mixture of enzymes and toxins causing: local tissue destruction (metalloproteinases, phospholipases), coagulopathy (thrombin-like enzymes consuming fibrinogen, thrombocytopenia), hemodynamic instability (vasoactive compounds), and neurotoxic effects (some rattlesnake species). CroFab is administered as an initial dose of 4-6 vials reconstituted and diluted in NS, infused IV over 60 minutes after a test dose observation period. If initial control is achieved (swelling stabilizes, coagulopathy improves, systemic symptoms resolve), maintenance doses of 2 vials every 6 hours for 18 hours (3 doses) may be given to prevent recurrence. The emergency nurse should: establish IV access on the unaffected extremity, remove all rings and constrictive jewelry from the affected hand immediately (edema will progress and can cause digital ischemia), mark the leading edge of swelling with a pen and time stamp every 15-30 minutes to track progression, draw baseline labs (CBC, PT/INR, fibrinogen, BMP, CK), administer tetanus prophylaxis, and prepare for antivenom administration. Outdated treatments that are HARMFUL include: tourniquets (concentrate venom and cause ischemia), incision and suction (ineffective and causes additional tissue damage), ice application (causes vasoconstriction worsening local tissue damage), and electric shock therapy (completely ineffective and dangerous).",
    learningObjective: "Manage crotalid envenomation with antivenom administration and appropriate monitoring",
    blueprintCategory: "Trauma",
    subtopic: "multi-system trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Outdated snakebite treatments (tourniquet, incision/suction, ice) are HARMFUL and should NEVER be used — antivenom is the only definitive treatment",
    clinicalPearls: [
      "CroFab initial dose: 4-6 vials IV over 60 minutes; maintenance: 2 vials q6h × 3 doses if needed",
      "Mark the leading edge of swelling every 15-30 minutes to track progression",
      "Remove all rings and constrictive jewelry immediately — progressive edema can cause digital ischemia"
    ],
    safetyNote: "Monitor for anaphylaxis during antivenom administration — have epinephrine and resuscitation equipment at bedside",
    distractorRationales: [
      "Tourniquets concentrate venom, worsen tissue damage, and can cause limb ischemia",
      "Incision and suction is ineffective, causes additional tissue damage, and delays definitive treatment",
      "Ice causes vasoconstriction worsening local tissue damage from the venom"
    ],
    lessonPath: "/emergency/lessons/multi-system-trauma"
  },
  {
    stem: "A 57-year-old male presents to the ED after a fall from a ladder with a calcaneal fracture. After initial management, the nurse is preparing discharge instructions. The patient asks when he can return to work as a construction foreman. What is an important long-term consideration the nurse should communicate?",
    options: [
      "He should be able to return to full duty within 2 weeks",
      "Calcaneal fractures are associated with prolonged recovery (6-12 months), high rates of chronic pain, and up to 20% of patients cannot return to their previous occupation",
      "Calcaneal fractures heal without complications in all cases",
      "He will need a permanent wheelchair after a calcaneal fracture"
    ],
    correctAnswer: 1,
    rationaleLong: "Calcaneal fractures are among the most debilitating orthopedic injuries in terms of long-term outcomes. The calcaneus is the largest tarsal bone and bears the entire body weight during gait. When fractured, particularly when the subtalar joint is involved (which occurs in approximately 75% of calcaneal fractures), the long-term functional outcomes can be significantly impacted. Key considerations include: (1) PROLONGED RECOVERY — most calcaneal fractures require 3-6 months of non-weight-bearing followed by progressive weight-bearing, with full recovery taking 6-12 months or longer; (2) CHRONIC PAIN — subtalar arthritis develops in a significant percentage of patients (30-50%), causing chronic heel pain, difficulty walking on uneven surfaces, and stiffness; (3) OCCUPATIONAL IMPACT — studies show that 10-20% of patients with calcaneal fractures cannot return to their previous occupation, particularly if their work involves prolonged standing, walking on uneven terrain, climbing, or heavy lifting. Construction work falls squarely in this high-risk category; (4) SHOE FITTING — loss of calcaneal height and widening of the heel can cause chronic difficulty fitting into standard footwear; (5) SUBTALAR FUSION — some patients ultimately require subtalar joint fusion for intractable pain, which eliminates inversion/eversion of the foot. The emergency nurse should provide realistic expectations without being discouraging, emphasize the importance of orthopedic follow-up for definitive management decisions (ORIF vs. non-operative management), advise strict non-weight-bearing until cleared by orthopedics, and facilitate appropriate referrals for occupational rehabilitation. Workers' compensation documentation should be initiated early.",
    learningObjective: "Communicate realistic long-term recovery expectations for calcaneal fractures",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Calcaneal fractures have some of the WORST long-term outcomes of any orthopedic injury — patients need realistic expectations from the beginning",
    clinicalPearls: [
      "75% of calcaneal fractures involve the subtalar joint, affecting long-term function",
      "Subtalar arthritis develops in 30-50% of patients, causing chronic pain",
      "10-20% of patients cannot return to their previous occupation after calcaneal fracture"
    ],
    safetyNote: "Strict non-weight-bearing until cleared by orthopedics — premature weight-bearing can worsen displacement and outcomes",
    distractorRationales: [
      "Two-week return to construction work is unrealistic — recovery takes 6-12+ months",
      "Calcaneal fractures frequently have significant long-term complications and are not universally benign",
      "Permanent wheelchair use is not expected — most patients walk again but may have chronic limitations"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 22-year-old male presents with bilateral femur fractures after a high-speed motorcycle crash. On the second hospital day, he develops acute onset confusion, petechial rash on the chest and axillae, and worsening hypoxia (SpO2 85% on 6L NC). What is the most likely diagnosis?",
    options: [
      "Pulmonary embolism from deep vein thrombosis",
      "Fat embolism syndrome — the classic triad of respiratory distress, neurological changes, and petechial rash 24-72 hours after long bone fracture",
      "Hospital-acquired pneumonia",
      "Acute myocardial infarction"
    ],
    correctAnswer: 1,
    rationaleLong: "Fat embolism syndrome (FES) is a clinical syndrome that typically develops 24-72 hours after long bone fractures (particularly femur and tibia) or orthopedic surgery. The classic triad is: (1) RESPIRATORY DISTRESS — fat globules embolize to the pulmonary vasculature, causing mechanical obstruction of pulmonary capillaries and triggering inflammatory mediator release (free fatty acids generated by lipase activity are directly toxic to the pulmonary endothelium). This manifests as progressive hypoxemia, tachypnea, and bilateral pulmonary infiltrates on CXR ('snowstorm' pattern); (2) NEUROLOGICAL CHANGES — fat emboli cross into the cerebral circulation (either through pulmonary arteriovenous shunts or a patent foramen ovale), causing confusion, agitation, and potentially coma. Cerebral edema from free fatty acid-induced inflammation contributes; (3) PETECHIAL RASH — pathognomonic but present in only 50-60% of cases. Petechiae appear on the chest, axillae, conjunctivae, and oral mucosa. They result from fat embolism to dermal capillaries causing localized capillary fragility and rupture. The petechiae are typically non-palpable and transient (resolving within 24 hours). FES is a clinical diagnosis — there is no definitive laboratory test. Supportive findings include thrombocytopenia, anemia, elevated ESR, fat globules in urine (lipiduria), and retinal changes (Purtscher-like retinopathy) on fundoscopy. Bilateral long bone fractures significantly increase FES risk compared to unilateral fractures. Management is primarily supportive: supplemental oxygen (mechanical ventilation if needed with lung-protective strategies), hemodynamic support, early fracture fixation (which reduces FES risk by preventing ongoing fat embolization from the fracture site), and hydration. Corticosteroids have been studied for FES prophylaxis but remain controversial.",
    learningObjective: "Recognize the classic triad of fat embolism syndrome and understand its temporal relationship to long bone fractures",
    blueprintCategory: "Trauma",
    subtopic: "multi-system trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "FES develops 24-72 hours after fracture — if respiratory distress occurs IMMEDIATELY after fracture, consider pulmonary embolism or other causes instead",
    clinicalPearls: [
      "Classic FES triad: respiratory distress, neurological changes, petechial rash — 24-72 hours post-fracture",
      "Petechiae on chest/axillae are pathognomonic but present in only 50-60% of cases",
      "Early fracture fixation reduces FES risk by preventing ongoing fat embolization"
    ],
    safetyNote: "Bilateral long bone fractures significantly increase FES risk — heightened monitoring is warranted in the first 72 hours",
    distractorRationales: [
      "PE typically presents with sudden dyspnea, pleuritic chest pain, and tachycardia without petechial rash or confusion",
      "Hospital-acquired pneumonia presents with fever, productive cough, and focal infiltrate — not petechial rash",
      "MI presents with chest pain and ECG changes, not the triad of respiratory, neurological, and dermatological findings"
    ],
    lessonPath: "/emergency/lessons/multi-system-trauma"
  }
];
