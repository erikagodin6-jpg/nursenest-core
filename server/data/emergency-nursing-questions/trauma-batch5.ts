import { EmergencyNursingQuestion } from "./types";

export const traumaBatch5Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 33-year-old male presents to the ED after a bar fight with a stab wound to the left anterior chest at the 4th intercostal space, parasternal. He is alert and initially hemodynamically stable. Over 30 minutes, he becomes increasingly tachycardic (140 bpm), hypotensive (70/40 mmHg), and develops distended neck veins. FAST reveals a pericardial effusion. What definitive management does this patient need?",
    options: [
      "Pericardiocentesis followed by observation",
      "Emergent thoracotomy in the operating room for surgical repair of the cardiac wound",
      "Bilateral chest tube insertion for presumed tension pneumothorax",
      "CT angiography to determine the exact location of the cardiac injury"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with progressive cardiac tamponade from penetrating cardiac trauma. While pericardiocentesis can temporize the situation by aspirating as little as 15-20 mL of blood from the pericardial sac (which can dramatically improve hemodynamics by relieving the constrictive pressure on the ventricles), it is NOT definitive treatment. The underlying cardiac wound must be surgically repaired to prevent ongoing hemorrhage and recurrent tamponade. The definitive management is emergent thoracotomy (typically median sternotomy or left anterolateral thoracotomy) in the operating room for direct visualization and repair of the cardiac injury. The emergency nurse's role includes: activating the trauma surgery team and operating room immediately, establishing bilateral large-bore IV access (14-16 gauge minimum), initiating massive transfusion protocol, preparing for emergency pericardiocentesis as a bridge to the OR if the patient is deteriorating, cross-matching at least 6 units of PRBCs, and preparing the patient for emergent transport to the OR. If the patient arrests or becomes peri-arrest before reaching the OR, an emergency department thoracotomy (EDT — also called a resuscitative thoracotomy) may be performed. EDT is most successful in penetrating cardiac trauma with witnessed arrest, with survival rates of approximately 35% compared to less than 2% for blunt trauma arrests. The wound location (4th intercostal space, parasternal) is within the cardiac box and directly overlies the right ventricle, making penetrating cardiac injury highly likely. CT angiography would dangerously delay definitive surgical care and is not indicated in a patient with progressive hemodynamic deterioration from known pericardial effusion.",
    learningObjective: "Distinguish temporizing measures from definitive management in penetrating cardiac trauma",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Pericardiocentesis is a temporizing bridge, NOT definitive treatment — the cardiac wound requires surgical repair",
    clinicalPearls: [
      "ED thoracotomy has ~35% survival in penetrating cardiac trauma with witnessed arrest",
      "As little as 15-20 mL of blood removed from pericardium can dramatically improve hemodynamics",
      "The cardiac box extends from the clavicles to the costal margins, between the midclavicular lines"
    ],
    safetyNote: "Never delay OR notification for diagnostic studies in progressive cardiac tamponade — the patient needs the operating room, not more tests",
    distractorRationales: [
      "Pericardiocentesis provides temporary relief but the cardiac wound continues to bleed — surgical repair is required",
      "Chest tubes address pneumothorax/hemothorax, not cardiac tamponade",
      "CT angiography delays definitive surgical care in a critically unstable patient"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 62-year-old female with type 2 diabetes presents with a burn to her right foot sustained when she stepped into a bath that was too hot. She states she 'didn't feel it at first' due to diabetic neuropathy. The burn is white, waxy, painless, and extends across the entire dorsum of the foot. What burn depth classification does this represent, and why is the absence of pain significant?",
    options: [
      "Superficial burn — painless because the nerve endings are still intact",
      "Superficial partial-thickness — will heal within 7-10 days without intervention",
      "Full-thickness burn — painless because the dermal nerve endings have been destroyed",
      "Deep partial-thickness — painful but the patient's neuropathy masks the pain"
    ],
    correctAnswer: 2,
    rationaleLong: "This burn presents classic full-thickness (third-degree) characteristics: white, waxy appearance (indicating coagulation of dermal proteins), and painlessness (indicating destruction of the dermal nerve endings). In a normal patient, the absence of pain in a burn injury is paradoxically concerning because it indicates deeper injury. Superficial burns (first-degree) and partial-thickness burns (second-degree) are painful because intact nerve endings in the remaining dermis are stimulated. Full-thickness burns destroy the entire epidermis and dermis including all dermal appendages (hair follicles, sweat glands) and nerve endings, rendering the burned area insensate. In this patient, the diabetic neuropathy adds complexity: she already had reduced sensation in her feet (a common complication of diabetes), which both contributed to the injury mechanism (she didn't feel the hot water) and makes clinical assessment of burn depth more challenging. Diabetic patients are at higher risk for burns to their extremities due to sensory neuropathy, and their burns often present later because the initial injury is not felt. Additionally, diabetic patients have impaired wound healing due to microvascular disease, immunosuppression, and neuropathy, making burn management more complex. Full-thickness burns do not heal by re-epithelialization (there are no remaining dermal appendages to serve as sources of new epithelium) and require surgical management — typically skin grafting. The emergency nurse should: assess the burn depth across the entire wound (full-thickness burns are often surrounded by areas of partial-thickness injury that ARE painful), document the extent using the Rule of Nines or Lund-Browder chart, elevate the affected foot, assess perfusion status (diabetic foot may have concurrent peripheral arterial disease), obtain baseline labs including blood glucose and HbA1c, and facilitate burn surgery or burn center consultation.",
    learningObjective: "Classify burn depth by clinical characteristics and understand the implications of painless burns",
    blueprintCategory: "Trauma",
    subtopic: "burn injuries",
    difficulty: 2,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "A painless burn is MORE concerning, not less — it indicates full-thickness injury with nerve ending destruction. Do not be falsely reassured by absence of pain.",
    clinicalPearls: [
      "Full-thickness burns: white/waxy, painless, no blanching, leathery texture",
      "Diabetic neuropathy patients are at high risk for burns they don't feel — assess feet in all diabetic ED patients",
      "Full-thickness burns require skin grafting — they cannot re-epithelialize from dermal appendages"
    ],
    safetyNote: "Assess peripheral vascular status in all diabetic patients with foot burns — concurrent PAD significantly affects healing and may change the management plan",
    distractorRationales: [
      "Superficial burns are painful (intact nerve endings) and appear red and moist",
      "Superficial partial-thickness burns are painful, blistered, and weeping — not white and painless",
      "If this were deep partial-thickness, the injury would still have some sensation — the complete absence of pain indicates full-thickness involvement"
    ],
    lessonPath: "/emergency/lessons/burn-injuries"
  },
  {
    stem: "A 28-year-old male presents to the ED after an MMA fight with a suspected mandible fracture. He has malocclusion, trismus, and blood in the oral cavity. The nurse notices his tongue is falling posteriorly and he is having difficulty maintaining his airway. What is the anatomical basis for the airway compromise?",
    options: [
      "Swelling of the parotid glands obstructing the oropharynx",
      "Bilateral mandible fractures causing loss of anterior tongue support, allowing posterior displacement",
      "Temporomandibular joint dislocation preventing mouth opening",
      "Fractured teeth lodged in the hypopharynx"
    ],
    correctAnswer: 1,
    rationaleLong: "The mandible provides the structural foundation for the anterior floor of the mouth and the attachment point for the genioglossus muscle — the primary muscle responsible for protruding the tongue and maintaining it in an anterior position. In bilateral mandible fractures (particularly bilateral body or parasymphysis fractures), the anterior segment of the mandible loses its structural support and can displace posteriorly under the pull of the suprahyoid muscles (mylohyoid, geniohyoid, digastric). This posterior displacement of the anterior mandibular segment allows the tongue (attached via the genioglossus to the genial tubercle on the inner surface of the mandible) to fall posteriorly, obstructing the oropharynx. This mechanism of airway obstruction is sometimes called a 'flail mandible' and represents a life-threatening emergency. The emergency nurse's immediate priorities include: (1) Jaw thrust or chin lift to bring the mandible and tongue anteriorly; (2) If the patient can tolerate it, sitting upright or leaning forward to allow gravity to assist with tongue positioning; (3) Suctioning blood and debris from the oral cavity; (4) Preparing for potential endotracheal intubation (anticipating a difficult airway due to blood, swelling, trismus, and altered anatomy); (5) Having a surgical airway kit immediately available. Additionally, mandible fractures are often associated with concurrent cervical spine injury due to the force transmission mechanism, and c-spine precautions should be maintained. Open mandible fractures (fractures communicating with the oral cavity through tooth sockets) are common and require prophylactic antibiotics (typically penicillin or clindamycin for oral flora coverage).",
    learningObjective: "Understand the anatomical mechanism of airway compromise in bilateral mandible fractures",
    blueprintCategory: "Trauma",
    subtopic: "blunt trauma",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Bilateral mandible fractures can cause life-threatening airway obstruction from posterior tongue displacement — this is a 'flail mandible' emergency",
    clinicalPearls: [
      "Genioglossus muscle attaches the tongue to the mandible — loss of mandibular support allows tongue to fall posteriorly",
      "Sitting upright position uses gravity to help maintain tongue position when supine positioning worsens obstruction",
      "Open mandible fractures through tooth sockets require prophylactic antibiotics for oral flora"
    ],
    safetyNote: "Keep suction readily available — blood, saliva, and tooth fragments in the oral cavity compound the airway compromise",
    distractorRationales: [
      "Parotid gland swelling does not cause acute airway obstruction in mandible fractures",
      "TMJ dislocation causes inability to close the mouth (open-lock), not posterior tongue displacement",
      "While fractured teeth can be aspirated, this is not the primary mechanism of airway compromise described"
    ],
    lessonPath: "/emergency/lessons/blunt-trauma"
  },
  {
    stem: "A 45-year-old male is brought in by EMS after being entrapped in heavy machinery. His right arm is amputated at the mid-forearm level. EMS has brought the amputated part wrapped in a moist gauze inside a plastic bag. What is the correct method for preserving the amputated part for potential replantation?",
    options: [
      "Place the amputated part directly on ice to cool it as quickly as possible",
      "Wrap the amputated part in moist saline-soaked gauze, place in a sealed plastic bag, and place the bag on ice — never allow direct contact between the tissue and ice",
      "Submerge the amputated part in normal saline at room temperature",
      "Place the amputated part in a container of warm water to maintain viability"
    ],
    correctAnswer: 1,
    rationaleLong: "Correct preservation of an amputated part is critical for maximizing the chance of successful replantation. The optimal method follows the principle of 'cool but not freeze': (1) Wrap the amputated part in sterile saline-moistened gauze to prevent desiccation of the tissues; (2) Place the wrapped part inside a sealed, watertight plastic bag to prevent direct tissue contact with water or ice; (3) Place this sealed bag on ice or in ice water. This indirect cooling maintains the tissue temperature at approximately 4°C (39°F), which slows cellular metabolism and extends the viable ischemia time. Direct ice contact causes frostbite injury to the tissues, which destroys cells and eliminates replantation potential. Submersion in water (even saline) causes tissue waterlogging and cellular damage through osmotic effects. Warm storage accelerates metabolic demand and tissue death. Cold ischemia tolerance varies by tissue type: muscle tissue tolerates approximately 6-8 hours of warm ischemia and 12-18 hours of cold ischemia; digits (with less muscle mass) can tolerate up to 12 hours warm and 24+ hours cold ischemia. The emergency nurse's priorities for the amputated stump include: hemorrhage control (direct pressure, pressure dressing, tourniquet if needed), wound assessment and documentation, IV access and fluid resuscitation if needed, tetanus prophylaxis, prophylactic antibiotics, pain management, and communication with the replantation/hand surgery team. For the amputated part: verify correct preservation, X-ray the amputated part separately, and document the condition. Replantation candidacy depends on mechanism (sharp guillotine-type amputations have better outcomes than crush/avulsion), patient factors (age, smoking status, comorbidities), and ischemia time.",
    learningObjective: "Apply correct preservation techniques for amputated parts to maximize replantation potential",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER place amputated tissue directly on ice — this causes frostbite. The correct method is indirect cooling: tissue → moist gauze → sealed bag → on ice.",
    clinicalPearls: [
      "Cold ischemia tolerance: digits up to 24+ hours cold ischemia vs. muscle-containing parts 12-18 hours",
      "Sharp amputations have better replantation outcomes than crush/avulsion amputations",
      "X-ray both the stump AND the amputated part separately for operative planning"
    ],
    safetyNote: "Do not discard any amputated tissue — even seemingly non-viable parts should be preserved and sent with the patient for surgical assessment",
    distractorRationales: [
      "Direct ice contact causes frostbite injury and destroys tissue viability for replantation",
      "Room temperature saline immersion causes tissue waterlogging and does not slow metabolic demand",
      "Warm water accelerates tissue death by maintaining high metabolic demand without blood supply"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 38-year-old pregnant female at 32 weeks gestation presents after a motor vehicle collision. She reports decreased fetal movement since the accident. Fetal heart rate monitoring shows late decelerations. The nurse notes vaginal bleeding and a rigid, tender uterus. What obstetric emergency is most likely?",
    options: [
      "Placenta previa with painless vaginal bleeding",
      "Placental abruption with uterine hypertonicity and fetal distress",
      "Uterine rupture with complete expulsion of the fetus into the abdominal cavity",
      "Normal labor onset triggered by the trauma"
    ],
    correctAnswer: 1,
    rationaleLong: "This pregnant trauma patient presents with the classic triad of placental abruption: vaginal bleeding, rigid/tender uterus (uterine hypertonicity from blood irritating the myometrium), and fetal distress (late decelerations indicating uteroplacental insufficiency). Placental abruption — premature separation of the normally implanted placenta from the uterine wall — is the most common cause of fetal death in maternal trauma, occurring in approximately 1-5% of minor trauma and up to 40-50% of major abdominal trauma. The mechanism involves sudden deceleration or direct abdominal impact causing shear forces between the relatively elastic uterine wall and the inelastic placenta. The clinical features in this case are diagnostic: decreased fetal movement (indicating fetal compromise), late decelerations on fetal heart rate monitoring (indicating uteroplacental insufficiency — the partially separated placenta cannot adequately exchange oxygen and nutrients), vaginal bleeding (from the abruption site), and a rigid, tender uterus (tetanic contraction from blood extravasation into the myometrium — also called a Couvelaire uterus). Abruption severity ranges from mild (small marginal separation with minimal bleeding) to complete (total placental separation with fetal demise). The emergency nurse's priorities include: (1) Left lateral positioning to optimize uteroplacental blood flow; (2) Continuous fetal monitoring with obstetric consultation; (3) Large-bore IV access with type and crossmatch (abruption can cause massive hemorrhage and DIC); (4) Labs including CBC, coagulation studies (PT, aPTT, fibrinogen — DIC screening), type and crossmatch, Kleihauer-Betke test (to quantify fetomaternal hemorrhage for RhoGAM dosing); (5) Preparation for emergent cesarean delivery if fetal distress progresses. Placenta previa is unlikely given the painful presentation — previa classically presents with painless vaginal bleeding.",
    learningObjective: "Identify placental abruption in pregnant trauma patients and initiate appropriate maternal-fetal assessment",
    blueprintCategory: "Trauma",
    subtopic: "multi-system trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Placental abruption can present with CONCEALED hemorrhage — a rigid uterus with fetal distress but minimal external bleeding indicates blood is trapped behind the placenta",
    clinicalPearls: [
      "Placental abruption is the most common cause of fetal death in maternal trauma",
      "Kleihauer-Betke test quantifies fetomaternal hemorrhage to guide RhoGAM dosing",
      "DIC is a serious complication of severe abruption — check fibrinogen levels urgently"
    ],
    safetyNote: "All pregnant trauma patients >20 weeks require a minimum of 4 hours continuous fetal monitoring — abruption can have delayed onset",
    distractorRationales: [
      "Placenta previa presents with PAINLESS vaginal bleeding — the rigid tender uterus is characteristic of abruption",
      "Uterine rupture is rare in an intact uterus and presents with sudden loss of fetal heart tones and palpable fetal parts in the abdomen",
      "Normal labor presents with regular contractions and cervical change, not a rigid board-like uterus with fetal distress"
    ],
    lessonPath: "/emergency/lessons/multi-system-trauma"
  },
  {
    stem: "A 17-year-old male presents to the ED after a high-speed ATV rollover. He has a GCS of 7 (E2V2M3) and requires intubation. During RSI preparation, the nurse notes CSF otorrhea from the right ear. What intubation approach is indicated?",
    options: [
      "Nasotracheal intubation to avoid manipulating the cervical spine",
      "Orotracheal intubation with inline cervical stabilization — nasotracheal intubation is contraindicated with basilar skull fracture",
      "Blind nasotracheal intubation is faster and safer in this scenario",
      "Awake fiberoptic intubation through the nose"
    ],
    correctAnswer: 1,
    rationaleLong: "CSF otorrhea (cerebrospinal fluid leaking from the ear) is a definitive sign of basilar skull fracture, specifically a temporal bone fracture that has disrupted the dura and allowed CSF to drain through the ear canal. In any patient with suspected or confirmed basilar skull fracture, nasotracheal intubation is ABSOLUTELY CONTRAINDICATED because there is a risk of the endotracheal tube passing through a fractured cribriform plate into the cranial cavity, potentially penetrating the brain. This same principle applies to nasogastric tube insertion. The appropriate airway management approach is orotracheal intubation with rapid sequence induction (RSI) and inline cervical stabilization (ICS). RSI involves administration of an induction agent (etomidate, ketamine, or propofol — ketamine and etomidate are preferred in trauma as they maintain hemodynamic stability) followed by a neuromuscular blocking agent (succinylcholine or rocuronium) to provide optimal intubating conditions. Inline cervical stabilization (ICS) involves a designated team member maintaining manual stabilization of the cervical spine in neutral position throughout the intubation attempt by placing their hands on the mastoid processes and occiput while the cervical collar is opened. This replaces the collar during intubation, maintaining cervical alignment while allowing mouth opening for laryngoscopy. Video laryngoscopy is preferred over direct laryngoscopy in trauma patients as it provides better visualization with less cervical spine movement. The emergency nurse's role in RSI includes: preparing all equipment (laryngoscope, ET tubes in multiple sizes, stylet, bougie, suction, bag-valve-mask, surgical airway kit), drawing up and verifying medications, pre-oxygenating the patient, performing cricoid pressure (Sellick maneuver) if requested, and monitoring vital signs and SpO2 throughout the procedure. Post-intubation, the nurse should verify tube placement with continuous waveform capnography (the gold standard for confirming ET tube position), auscultate bilateral breath sounds, and obtain a chest X-ray.",
    learningObjective: "Select the appropriate intubation approach in the setting of basilar skull fracture and understand RSI components",
    blueprintCategory: "Trauma",
    subtopic: "traumatic brain injury",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "CSF otorrhea = basilar skull fracture = NEVER use the nasal route for any tube (ET tube, NG tube, or temperature probe)",
    clinicalPearls: [
      "CSF otorrhea and CSF rhinorrhea are definitive signs of basilar skull fracture",
      "Video laryngoscopy produces less cervical spine movement than direct laryngoscopy",
      "Waveform capnography is the gold standard for confirming endotracheal tube placement"
    ],
    safetyNote: "Have a surgical airway kit immediately available during all trauma intubations — if oral intubation fails, cricothyrotomy may be the only option when nasal route is contraindicated",
    distractorRationales: [
      "Nasotracheal intubation is absolutely contraindicated with basilar skull fracture",
      "Blind nasotracheal intubation is both dangerous (basilar skull fracture) and unreliable in an obtunded patient",
      "Nasal fiberoptic intubation uses the contraindicated nasal route"
    ],
    lessonPath: "/emergency/lessons/traumatic-brain-injury"
  },
  {
    stem: "A 50-year-old male presents to the ED with an industrial degloving injury to his right hand and forearm. The skin and subcutaneous tissue have been peeled back from the underlying fascia and muscle. The denuded tissue is viable but exposed. What is the priority nursing management for this wound?",
    options: [
      "Scrub the wound vigorously with betadine to prevent infection",
      "Apply the degloved skin flap back over the wound, cover with moist sterile dressings, splint the extremity, and prepare for emergent plastic/hand surgery consultation",
      "Trim away the degloved skin as it is non-viable and apply dry dressings",
      "Apply a tourniquet proximally and prepare for likely amputation"
    ],
    correctAnswer: 1,
    rationaleLong: "Degloving injuries occur when the skin and subcutaneous tissue are forcibly separated from the underlying deep fascia, typically by rotational or shearing mechanisms (e.g., ring avulsion injuries, industrial machinery, motor vehicle ejection). The management principles focus on tissue preservation, wound protection, and surgical consultation. The degloved skin flap should be gently repositioned over the wound bed if possible — even if the skin appears compromised, it serves as a biological dressing that protects the underlying exposed structures (tendons, nerves, vessels) from desiccation, contamination, and further injury. The viability of the degloved flap depends on the degree of disruption of its blood supply, and this assessment is best made by the surgical team, not in the initial ED management. The exposed tissues should be kept moist with saline-moistened sterile dressings to prevent desiccation of tendons and other structures — dry tendons lose their gliding function and become non-viable. The extremity should be immobilized with a well-padded splint in a position of function. The emergency nurse should: gently irrigate the wound with copious normal saline (NOT betadine, which is cytotoxic to exposed tissues), reposition the skin flap if possible, apply moist sterile dressings, splint the extremity, provide adequate analgesia, update tetanus prophylaxis, administer prophylactic antibiotics, perform and document detailed neurovascular assessment of each digit, and arrange emergent surgical consultation. The surgical options may include direct flap reattachment, full-thickness skin grafting using the degloved skin (processed and re-applied as a graft), local or regional flap coverage, or free tissue transfer for large defects. Degloving injuries may also be associated with underlying fractures or vascular injuries requiring concurrent management.",
    learningObjective: "Manage degloving injuries with tissue preservation, wound protection, and emergent surgical consultation",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Never discard degloved skin — even if it appears non-viable, it can be processed as a full-thickness skin graft by the surgical team",
    clinicalPearls: [
      "Degloved skin can be reprocessed as a full-thickness graft — always preserve it",
      "Keep exposed tendons moist — desiccated tendons lose gliding function and become non-viable",
      "Betadine and hydrogen peroxide are cytotoxic to exposed tissues — use normal saline for irrigation"
    ],
    safetyNote: "Perform individual digit neurovascular assessment in all hand degloving injuries — digital nerve and artery injuries are common and may be masked by the primary wound",
    distractorRationales: [
      "Vigorous scrubbing with betadine damages exposed tissues — gentle saline irrigation is appropriate",
      "Trimming the degloved skin eliminates the potential for biological dressing and graft material",
      "Degloving injuries are not automatic indications for amputation — many can be surgically reconstructed"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 40-year-old female presents after a rollover MVC with a seat belt sign across her neck. She has hoarseness, subcutaneous emphysema, and hemoptysis. CT angiography of the neck shows a Grade III blunt carotid artery injury. The nurse should prepare for which monitoring and management priorities?",
    options: [
      "Immediate carotid endarterectomy to remove the clot",
      "Systemic anticoagulation with heparin, serial neurological assessments for stroke symptoms, and blood pressure management",
      "Bilateral carotid massage to assess for sensitivity",
      "Observation only with repeat CT angiography in 1 week"
    ],
    correctAnswer: 1,
    rationaleLong: "Blunt cerebrovascular injury (BCVI) — injury to the carotid or vertebral arteries from blunt trauma — is increasingly recognized as a cause of post-traumatic stroke with devastating consequences. The Denver Screening Criteria identify patients at risk for BCVI based on mechanism and associated injuries: seat belt sign across the neck, cervical spine fractures (particularly subluxation, transverse foramen fractures), basilar skull fractures extending to the carotid canal, and diffuse axonal injury with GCS less than 6. This patient has a Grade III blunt carotid injury, which on the Biffl grading scale represents a pseudoaneurysm (weakened arterial wall with outpouching). The management priorities include: (1) Systemic anticoagulation — heparin infusion (target aPTT 40-60 seconds) or antiplatelet therapy is the mainstay of treatment for BCVI to prevent thrombus formation and distal embolization causing stroke. The choice between heparin and antiplatelet therapy depends on the presence of contraindications (intracranial hemorrhage, other active bleeding); (2) Serial neurological assessments — focused on detecting new or evolving stroke symptoms (facial droop, arm drift, speech changes, vision changes, altered consciousness). The nurse should perform and document neurological checks every 1-2 hours initially; (3) Blood pressure management — avoid both hypotension (which reduces cerebral perfusion pressure) and hypertension (which stresses the injured arterial wall). The MAP target is typically 80-100 mmHg. Higher-grade injuries (Grade IV — complete occlusion, Grade V — transection) may require endovascular intervention (stenting) or surgical repair. The emergency nurse should establish continuous monitoring, prepare heparin infusion per protocol, obtain baseline coagulation studies, and ensure the patient is admitted to an ICU or step-down unit with neurovascular monitoring capabilities.",
    learningObjective: "Manage blunt cerebrovascular injury with anticoagulation, serial neurological monitoring, and blood pressure management",
    blueprintCategory: "Trauma",
    subtopic: "blunt trauma",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Seat belt sign across the NECK is an indication for CT angiography to screen for blunt cerebrovascular injury — this is different from the abdominal seat belt sign",
    clinicalPearls: [
      "Denver Screening Criteria identify patients at risk for blunt cerebrovascular injury",
      "BCVI-related stroke can occur days after the initial injury — anticoagulation prevents embolization",
      "Biffl grading: I = intimal irregularity, II = dissection/intramural hematoma, III = pseudoaneurysm, IV = occlusion, V = transection"
    ],
    safetyNote: "Post-traumatic stroke from BCVI can occur up to 72 hours or more after injury — maintain anticoagulation and neurological monitoring throughout this period",
    distractorRationales: [
      "Carotid endarterectomy is for atherosclerotic disease, not acute traumatic vascular injury",
      "Carotid massage is dangerous in any patient with known carotid pathology and could dislodge thrombus causing stroke",
      "Observation without treatment risks thromboembolic stroke from the injured vessel"
    ],
    lessonPath: "/emergency/lessons/blunt-trauma"
  },
  {
    stem: "A 30-year-old male presents to the ED after a lightning strike while hiking. He was found unconscious by his companions. In the ED, he is responsive but confused with bilateral tympanic membrane perforations, fernlike skin markings (Lichtenberg figures), and reports bilateral lower extremity weakness. ECG shows prolonged QT interval. What is the primary cause of death from lightning strike?",
    options: [
      "Thermal burns from the electrical energy",
      "Cardiac arrest from dysrhythmia (asystole or ventricular fibrillation)",
      "Respiratory failure from pulmonary contusion",
      "Rhabdomyolysis with acute kidney failure"
    ],
    correctAnswer: 1,
    rationaleLong: "Lightning strike is a unique form of electrical injury with distinct pathophysiology and management considerations. The primary cause of death from lightning strike is cardiac arrest, which can manifest as either asystole (more common) or ventricular fibrillation. Lightning delivers a massive direct current (DC) shock of approximately 300 million volts over a very brief duration (1-5 milliseconds). This enormous DC current simultaneously depolarizes the entire myocardium, causing asystole. In many cases, the heart's intrinsic automaticity will restart cardiac activity spontaneously, but if respiratory arrest persists (from brainstem stunning or diaphragmatic spasm), secondary hypoxic cardiac arrest can occur. This leads to the unique triage principle for lightning injuries: 'reverse triage' — in mass casualty lightning events, priority is given to patients who APPEAR dead (pulseless, apneic) because they may be recoverable with CPR and ventilation, while conscious patients are already recovering. This is the opposite of standard mass casualty triage. This patient's findings are characteristic of lightning injury: Lichtenberg figures (fernlike, arborescent skin markings that are pathognomonic for lightning strike — they are not true burns but rather patterns of electron showering across the skin), bilateral TM perforation (from the pressure wave), transient lower extremity weakness (keraunoparalysis — temporary paralysis and vasospasm of the lower extremities unique to lightning injury), and prolonged QT interval (cardiac conduction abnormality requiring monitoring). The emergency nurse should: place on continuous cardiac monitoring for minimum 24 hours, obtain serial ECGs, assess for secondary injuries (falls, blast effects), treat concurrent burns (lightning burns are typically superficial), assess for rhabdomyolysis (CK levels, urine myoglobin), and monitor for delayed neurological complications.",
    learningObjective: "Understand the pathophysiology of lightning strike injury and the concept of reverse triage",
    blueprintCategory: "Trauma",
    subtopic: "burn injuries",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Lightning mass casualty triage is REVERSED — treat apparently dead patients first because they may be recoverable, while conscious patients are already recovering",
    clinicalPearls: [
      "Lichtenberg figures are pathognomonic for lightning strike — not true burns but electron showering patterns",
      "Keraunoparalysis: temporary lower extremity paralysis and vasospasm unique to lightning injury",
      "Lightning causes asystole more commonly than VF — intrinsic automaticity may spontaneously restart the heart"
    ],
    safetyNote: "Continuous cardiac monitoring for minimum 24 hours after lightning strike — delayed dysrhythmias can occur, especially with prolonged QT interval",
    distractorRationales: [
      "Lightning burns are typically superficial because the brief current duration limits thermal tissue damage",
      "Respiratory failure is a secondary concern — respiratory arrest contributes to cardiac arrest but is not the primary cause of death",
      "While rhabdomyolysis can occur, it is not the primary cause of death — cardiac dysrhythmia is"
    ],
    lessonPath: "/emergency/lessons/burn-injuries"
  },
  {
    stem: "A 24-year-old male presents after being stabbed in the right midaxillary line at the 7th intercostal space. A chest tube is placed and immediately drains 1,500 mL of blood. After the initial drainage, the output continues at 300 mL/hour. What does this ongoing output indicate?",
    options: [
      "Normal expected drainage that will taper off over the next 6-12 hours",
      "Massive hemothorax with ongoing hemorrhage requiring emergent thoracotomy",
      "The chest tube is draining old blood from a previous injury",
      "The blood is from an intercostal vessel laceration that will self-resolve"
    ],
    correctAnswer: 1,
    rationaleLong: "The indications for emergent surgical intervention (thoracotomy) in hemothorax are well-defined: (1) Initial chest tube output greater than 1,500 mL (suggesting a major vascular or parenchymal injury), OR (2) Ongoing output greater than 200 mL/hour for 2-4 consecutive hours. This patient meets BOTH criteria — 1,500 mL initial output AND ongoing 300 mL/hour — indicating major intrathoracic hemorrhage that will not stop without surgical intervention. The ongoing hemorrhage at this rate suggests injury to a major vessel (intercostal artery, internal mammary artery, pulmonary hilum, or thoracic aortic branch) or a significant pulmonary parenchymal laceration. Self-limited bleeding from minor pulmonary lacerations or small intercostal vessels typically produces less than 500 mL initial output and slows progressively. The wound location (7th intercostal space at the midaxillary line) is at the thoracoabdominal junction, and the injury may also involve the diaphragm and upper abdominal organs (liver on the right side). The emergency nurse's immediate actions include: (1) Notify the trauma surgeon immediately about the ongoing output meeting surgical criteria; (2) Activate massive transfusion protocol; (3) Send the drained blood for autotransfusion if the collection system has this capability (the patient's own blood can be processed and re-infused); (4) Monitor vital signs continuously; (5) Prepare the patient for emergent OR transfer; (6) Maintain chest tube patency (milking/stripping the tubing to prevent clots from obstructing drainage); (7) Document the hourly output meticulously — this data drives surgical decision-making. The nurse should NOT clamp the chest tube to slow the output — this would cause a retained hemothorax, tension physiology, and mask the severity of ongoing hemorrhage.",
    learningObjective: "Recognize the surgical indications for hemothorax based on chest tube output criteria",
    blueprintCategory: "Trauma",
    subtopic: "thoracic trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Surgical thoracotomy criteria: >1,500 mL initial output OR >200 mL/hour for 2-4 hours — memorize these thresholds",
    clinicalPearls: [
      "Thoracotomy criteria: >1,500 mL initial output or >200 mL/hour for 2-4 consecutive hours",
      "7th intercostal space injuries may involve the diaphragm and intra-abdominal organs",
      "Autotransfusion of chest tube blood can be lifesaving in massive hemothorax"
    ],
    safetyNote: "NEVER clamp a chest tube to slow output — this masks ongoing hemorrhage and can cause tension hemothorax",
    distractorRationales: [
      "1,500 mL initial + 300 mL/hour ongoing is not normal and will not self-resolve — this requires surgery",
      "Fresh bright red blood at this volume indicates active hemorrhage, not old blood from a prior injury",
      "Intercostal vessel lacerations that produce this volume of output require surgical control"
    ],
    lessonPath: "/emergency/lessons/thoracic-trauma"
  },
  {
    stem: "A 68-year-old male with Parkinson's disease presents after a fall from his wheelchair. He has a right hip fracture and is in significant pain. His caregiver mentions he takes carbidopa-levodopa, pramipexole, and benztropine. What is an important medication-related consideration for this patient's pain management?",
    options: [
      "Parkinson's medications should all be held in the perioperative period",
      "Continue Parkinson's medications on schedule as much as possible — abrupt discontinuation can cause neuroleptic malignant-like syndrome, and avoid dopamine-blocking antiemetics",
      "Parkinson's medications interact with all analgesics and pain management should be withheld",
      "Switch all Parkinson's medications to IV formulations during the hospital stay"
    ],
    correctAnswer: 1,
    rationaleLong: "Patients with Parkinson's disease presenting with trauma require careful medication management. The most critical principle is that Parkinson's medications (particularly levodopa) should NEVER be abruptly discontinued. Sudden withdrawal of dopaminergic medications can precipitate parkinsonism-hyperpyrexia syndrome (also called neuroleptic malignant-like syndrome) — a potentially fatal condition characterized by severe rigidity, hyperthermia, autonomic instability, altered consciousness, and markedly elevated CK. This syndrome has a significant mortality rate and mimics neuroleptic malignant syndrome. The emergency nurse should: (1) Obtain a complete medication list with exact dosing schedule from the caregiver; (2) Ensure Parkinson's medications are administered on their usual schedule (timing is critical — even small delays can cause symptom exacerbation); (3) Communicate the medication schedule to admitting and perioperative teams; (4) Avoid dopamine-blocking antiemetics — metoclopramide and prochlorperazine block dopamine receptors and can dramatically worsen Parkinson's symptoms. Safe antiemetic alternatives include ondansetron (serotonin antagonist), domperidone (does not cross the blood-brain barrier), or trimethobenzamide; (5) Use caution with antipsychotics for delirium management (haloperidol and typical antipsychotics are dopamine blockers — quetiapine is generally safer in Parkinson's patients); (6) Pain management with opioids is generally safe but monitor for respiratory depression and constipation (both of which Parkinson's patients are already prone to). The nurse should also be aware that Parkinson's patients have an increased fall risk (postural instability is a cardinal feature), increased risk of dysphagia and aspiration (affecting medication administration), and may have cognitive impairment affecting their ability to participate in care decisions.",
    learningObjective: "Manage medication considerations for Parkinson's disease patients in the trauma setting",
    blueprintCategory: "Trauma",
    subtopic: "geriatric trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER abruptly discontinue Parkinson's medications — withdrawal can cause parkinsonism-hyperpyrexia syndrome with significant mortality",
    clinicalPearls: [
      "Parkinson's medications must be continued on exact schedule — even small delays worsen symptoms",
      "Avoid dopamine-blocking antiemetics (metoclopramide, prochlorperazine) — use ondansetron instead",
      "Abrupt levodopa withdrawal causes parkinsonism-hyperpyrexia syndrome mimicking NMS"
    ],
    safetyNote: "Clearly document the Parkinson's medication schedule and communicate to ALL care teams — perioperative NPO orders should not include Parkinson's medications",
    distractorRationales: [
      "Holding all Parkinson's medications risks life-threatening withdrawal syndrome",
      "Parkinson's medications do not broadly interact with all analgesics — pain management should not be withheld",
      "Most Parkinson's medications are only available orally — IV formulations do not exist for most of them"
    ],
    lessonPath: "/emergency/lessons/geriatric-trauma"
  },
  {
    stem: "A 35-year-old male presents to the ED with an electrical burn from grasping a high-voltage power line (>1000 volts). He has entry wounds on both hands and exit wound on his right foot. The burns appear relatively small externally. Why should the nurse anticipate injuries far more extensive than what is visible on the skin surface?",
    options: [
      "High-voltage electrical burns always affect only the superficial skin layers",
      "Electrical current travels through the body along the path of least resistance (nerves, blood vessels, muscles), causing extensive deep tissue damage with minimal external evidence",
      "The small external wounds indicate the injury is minor and self-limited",
      "Electrical burns only damage tissue at the entry and exit points"
    ],
    correctAnswer: 1,
    rationaleLong: "High-voltage electrical injuries (greater than 1,000 volts) are among the most deceptive trauma presentations because the external wound appearance dramatically underrepresents the extent of internal damage. Electrical current travels through the body along the path of least resistance, which is determined by tissue impedance: nerves have the lowest resistance (current flows preferentially through them), followed by blood vessels, muscle, skin, tendon, fat, and bone (highest resistance). As the current flows through these tissues, it generates heat proportional to the current density and tissue resistance (Joule heating), causing thermal coagulative necrosis from the INSIDE out. This means that muscles, nerves, and blood vessels along the current pathway are extensively damaged while the overlying skin may show only small entry and exit wounds. The 'iceberg' analogy is commonly used — the visible surface injury represents only a fraction of the underlying damage. Clinical implications that the emergency nurse must anticipate include: (1) Rhabdomyolysis — massive muscle necrosis releases myoglobin, potassium, CK, and phosphate (similar to crush syndrome). Dark urine indicates myoglobinuria requiring aggressive IV fluid resuscitation targeting urine output 200-300 mL/hr; (2) Cardiac dysrhythmias — the current may have traversed the heart (hand-to-hand or hand-to-foot pathway), requiring continuous cardiac monitoring for 24-48 hours; (3) Compartment syndrome — edema within damaged muscle compartments can develop rapidly; (4) Vascular thrombosis — thermal damage to vessel walls causes intimal damage and clot formation, threatening distal perfusion; (5) Neurological injury — both peripheral nerve damage and spinal cord injury can occur; (6) Delayed tissue necrosis — damaged tissue may appear viable initially but undergo necrosis over 48-72 hours, requiring repeated surgical assessment.",
    learningObjective: "Understand the mechanism of deep tissue injury in high-voltage electrical burns and anticipate complications",
    blueprintCategory: "Trauma",
    subtopic: "burn injuries",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "The 'iceberg effect' — external wounds in electrical burns represent only a small fraction of the total injury. Always assume extensive deep tissue damage.",
    clinicalPearls: [
      "Current path: hand-to-hand crosses the heart; hand-to-foot may or may not depending on pathway",
      "Tissue resistance hierarchy: nerve < blood vessel < muscle < skin < tendon < fat < bone",
      "Delayed tissue necrosis at 48-72 hours is common — initial assessment underestimates the final extent of injury"
    ],
    safetyNote: "Aggressive IV fluid resuscitation targeting urine output 200-300 mL/hr is critical to prevent myoglobin-induced acute kidney injury",
    distractorRationales: [
      "High-voltage burns cause DEEP tissue damage, not superficial — this is the opposite of the correct answer",
      "Small external wounds are deceptive — internal damage is typically extensive",
      "Current damages all tissue along its pathway between entry and exit, not just at those two points"
    ],
    lessonPath: "/emergency/lessons/burn-injuries"
  },
  {
    stem: "A 7-year-old child presents to the ED after a dog bite to the face. The wound is a 3cm laceration on the right cheek with some tissue loss. The injury occurred 2 hours ago. The parents ask if the wound should be closed. What is the evidence-based approach to facial bite wound management?",
    options: [
      "All bite wounds should be left open to heal by secondary intention due to infection risk",
      "Facial bite wounds can be primarily closed after thorough irrigation and debridement due to the face's excellent blood supply, which provides superior infection resistance",
      "The wound should be packed with iodoform gauze and allowed to granulate",
      "Wait 48-72 hours to ensure no infection develops before considering delayed primary closure"
    ],
    correctAnswer: 1,
    rationaleLong: "Facial bite wounds represent an exception to the general principle that bite wounds should be left open. While bite wounds on the extremities, hands, and feet have high infection rates (15-20% for dog bites, up to 50% for cat bites) and are often managed with delayed primary closure or secondary intention healing, facial bite wounds can be primarily closed for several important reasons: (1) The face has an exceptionally rich blood supply — the extensive vascular network provides superior perfusion, oxygen delivery, and immune cell access to the wound, resulting in significantly lower infection rates (less than 5%) even with primary closure; (2) Cosmetic outcome is critically important on the face — secondary intention healing or delayed closure on the face produces significantly worse scarring and aesthetic results; (3) Functional structures on the face (eyelids, lips, nose) require precise anatomic realignment best achieved with primary closure. The management protocol includes: thorough wound irrigation with copious normal saline (at least 150-250 mL using an 18-gauge needle and 30-60 mL syringe to achieve adequate pressure — approximately 7-8 PSI), debridement of devitalized tissue (preserving as much viable tissue as possible on the face), primary closure with fine sutures (5-0 or 6-0 nylon or absorbable sutures), prophylactic antibiotics (amoxicillin-clavulanate is first-line for bite wounds — covers Pasteurella multocida, Staphylococcus, Streptococcus, and anaerobes), tetanus prophylaxis, and rabies risk assessment. The nurse should document: the animal's vaccination status, whether the attack was provoked or unprovoked, whether the animal can be observed, and report to animal control per local regulations.",
    learningObjective: "Apply evidence-based management of facial bite wounds including primary closure and antibiotic prophylaxis",
    blueprintCategory: "Trauma",
    subtopic: "pediatric trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Facial bite wounds are an EXCEPTION to the rule — they CAN be primarily closed due to the face's excellent blood supply and low infection rate (<5%)",
    clinicalPearls: [
      "Facial wound infection rate after primary closure is <5% due to rich vascular supply",
      "Amoxicillin-clavulanate is first-line prophylactic antibiotic for bite wounds",
      "High-pressure irrigation (7-8 PSI) using an 18-gauge needle reduces infection risk"
    ],
    safetyNote: "Always assess rabies risk for animal bites — document the animal's vaccination status and whether it can be quarantined for observation",
    distractorRationales: [
      "Not all bite wounds should be left open — facial wounds are an important exception",
      "Packing with iodoform gauze is inappropriate for facial wounds and produces inferior cosmetic outcomes",
      "Delayed closure on the face produces significantly worse scarring — primary closure is preferred"
    ],
    lessonPath: "/emergency/lessons/pediatric-trauma"
  },
  {
    stem: "A 29-year-old male is brought to the ED following an explosion at a chemical plant. He presents with bilateral hearing loss, pulmonary hemorrhage, abdominal pain, and fragment wounds. The nurse recognizes these injuries represent different blast injury categories. Which category causes the pulmonary hemorrhage?",
    options: [
      "Secondary blast injury from projectile fragments",
      "Primary blast injury from the blast wave pressure differential at air-tissue interfaces",
      "Tertiary blast injury from being thrown by the blast",
      "Quaternary blast injury from burns and inhalation"
    ],
    correctAnswer: 1,
    rationaleLong: "Blast injuries are classified into four categories based on the mechanism of injury, and understanding these categories helps predict injury patterns and guide assessment: PRIMARY blast injuries result from the direct effect of the blast wave (overpressure wave) on the body. The blast wave causes damage at air-tissue interfaces where there is a significant difference in density — primarily the lungs (blast lung), ears (tympanic membrane perforation), and bowel (perforation, hemorrhage). Blast lung injury occurs because the blast wave creates alternating overpressure and underpressure as it passes through the lung tissue, causing alveolar hemorrhage, pneumothorax, and air embolism. The pulmonary hemorrhage in this patient is a classic primary blast injury. SECONDARY blast injuries result from projectiles propelled by the blast — fragments, debris, shrapnel. The fragment wounds in this patient are secondary blast injuries. TERTIARY blast injuries result from the victim being physically thrown or displaced by the blast wind, causing blunt trauma injuries (fractures, head injuries) from impact with structures. QUATERNARY blast injuries encompass everything else: burns, inhalation injury, crush injuries from structural collapse, and exacerbation of pre-existing conditions. In this patient: bilateral hearing loss = primary (TM perforation from blast wave), pulmonary hemorrhage = primary (blast wave at air-tissue interface), abdominal pain = potentially primary (bowel at air-tissue interface) or tertiary (blunt impact), fragment wounds = secondary. The emergency nurse should systematically assess for all four categories in any blast injury patient, as multiple categories frequently coexist. Blast lung is the most common cause of death in survivors who reach the ED.",
    learningObjective: "Classify blast injury categories and understand primary blast injury mechanisms at air-tissue interfaces",
    blueprintCategory: "Trauma",
    subtopic: "multi-system trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Primary blast injuries affect AIR-TISSUE interfaces: lungs, ears, and bowel. Bilateral TM perforation is a marker of significant blast exposure — always assess for blast lung.",
    clinicalPearls: [
      "Primary: blast wave at air-tissue interfaces (lungs, ears, bowel); Secondary: projectile fragments",
      "Tertiary: body displacement/throw; Quaternary: burns, inhalation, crush, other",
      "Bilateral TM perforation strongly correlates with blast lung injury"
    ],
    safetyNote: "Place chest tubes BEFORE positive pressure ventilation in blast lung patients — PPV can convert simple pneumothorax to tension",
    distractorRationales: [
      "Fragment wounds are secondary blast injuries, not the cause of pulmonary hemorrhage",
      "Being thrown by the blast is a tertiary mechanism causing blunt trauma, not pulmonary hemorrhage",
      "Burns and inhalation are quaternary mechanisms — the blast wave itself causes the pulmonary hemorrhage"
    ],
    lessonPath: "/emergency/lessons/multi-system-trauma"
  },
  {
    stem: "A 45-year-old male presents to the ED after a motorcycle accident with a knee dislocation that spontaneously reduced before arrival. He has significant knee swelling but palpable pedal pulses. The nurse understands that a popliteal artery injury may still be present despite palpable pulses. What diagnostic study is indicated?",
    options: [
      "No further vascular evaluation is needed since pulses are present",
      "CT angiography of the lower extremity to evaluate for popliteal artery injury — ankle-brachial index (ABI) should also be calculated",
      "Duplex ultrasound in 1 week as an outpatient",
      "MRI of the knee to assess ligamentous injury only"
    ],
    correctAnswer: 1,
    rationaleLong: "Knee dislocation is one of the most serious orthopedic emergencies due to the high incidence of associated popliteal artery injury (approximately 20-40% of knee dislocations). The popliteal artery is tethered as it passes through the popliteal fossa behind the knee, making it vulnerable to stretch, intimal tear, or complete transection during knee dislocation. Critically, palpable distal pulses do NOT exclude vascular injury — intimal tears can maintain initial flow but progress to thrombosis and limb-threatening ischemia over hours to days. This is why all patients with knee dislocation (including spontaneously reduced dislocations) require vascular assessment. The evaluation begins with calculating the ankle-brachial index (ABI): systolic blood pressure at the ankle (posterior tibial or dorsalis pedis) divided by the brachial systolic pressure. An ABI less than 0.9 is abnormal and indicates significant vascular compromise requiring immediate CT angiography (CTA) or conventional angiography. Even with a normal ABI (≥0.9), many trauma centers still obtain CTA for all knee dislocations due to the devastating consequences of missed popliteal artery injury. CTA has a sensitivity of 95-100% for significant vascular injury. If popliteal artery injury is identified, the warm ischemia time is critical: limb salvage rates drop significantly if reperfusion is not achieved within 6-8 hours. The emergency nurse should: perform bilateral ABI measurements, arrange urgent CTA, prepare for possible vascular surgery consultation, perform serial neurovascular assessments (documenting pulse quality, capillary refill, skin temperature, sensation, and motor function), apply a well-padded posterior splint at 20 degrees of flexion, and monitor for compartment syndrome. Common peroneal nerve injury (foot drop) is also common with knee dislocation (25-35%).",
    learningObjective: "Recognize the high incidence of popliteal artery injury with knee dislocation and perform appropriate vascular assessment",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Palpable pulses do NOT rule out popliteal artery injury — intimal tears can maintain initial flow but progress to thrombosis. ALWAYS get vascular imaging.",
    clinicalPearls: [
      "20-40% of knee dislocations have associated popliteal artery injury",
      "ABI <0.9 indicates significant vascular compromise requiring CT angiography",
      "Common peroneal nerve injury (foot drop) occurs in 25-35% of knee dislocations"
    ],
    safetyNote: "Warm ischemia time is critical — limb salvage rates drop significantly if reperfusion is not achieved within 6-8 hours",
    distractorRationales: [
      "Normal pulses do not exclude vascular injury — intimal tears progress to thrombosis over hours",
      "Delayed outpatient ultrasound risks missing a vascular injury that could progress to limb loss",
      "MRI evaluates ligaments but does not assess vascular integrity — vascular assessment takes priority"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 52-year-old male presents with a penetrating injury to the right posterior triangle of the neck from a broken glass bottle. There is no active external hemorrhage, but the patient reports right arm weakness and numbness in the C5-C6 distribution. What structure is most likely injured?",
    options: [
      "Internal jugular vein",
      "Brachial plexus",
      "Vertebral artery",
      "Phrenic nerve"
    ],
    correctAnswer: 1,
    rationaleLong: "The posterior triangle of the neck is bounded by the posterior border of the sternocleidomastoid (SCM) anteriorly, the anterior border of the trapezius posteriorly, and the middle third of the clavicle inferiorly. Important structures traversing this triangle include the spinal accessory nerve (CN XI), brachial plexus trunks (as they emerge from between the anterior and middle scalene muscles), external jugular vein, subclavian artery (third part), and branches of the cervical plexus. The clinical findings of right arm weakness and numbness in the C5-C6 distribution are consistent with injury to the upper trunk of the brachial plexus (formed by the C5 and C6 nerve roots). This pattern produces an Erb-Duchenne type palsy: weakness of shoulder abduction, external rotation, elbow flexion, forearm supination, and wrist extension, with sensory loss in the lateral arm and forearm (C5-C6 dermatomes). The brachial plexus is particularly vulnerable in the posterior triangle because the trunks are relatively superficial as they emerge between the scalene muscles. Penetrating trauma to this region can directly lacerate or contuse the nerve trunks. The emergency nurse should perform a detailed neurological examination documenting motor strength in each myotome and sensory function in each dermatome of the upper extremity, as this baseline assessment is critical for surgical planning and monitoring. CT angiography should also be obtained to evaluate for concurrent vascular injury (subclavian artery), as the brachial plexus and subclavian vessels are in close proximity. The internal jugular vein is located more anteriorly under the SCM, not typically in the posterior triangle.",
    learningObjective: "Identify structures at risk in posterior triangle neck injuries based on neurological examination findings",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Posterior triangle of the neck contains the brachial plexus trunks — C5-C6 weakness/numbness pattern indicates upper trunk (Erb-Duchenne) injury",
    clinicalPearls: [
      "Posterior triangle boundaries: SCM anteriorly, trapezius posteriorly, middle clavicle inferiorly",
      "Upper trunk brachial plexus injury (C5-C6): Erb-Duchenne palsy — waiter's tip position",
      "Always obtain CTA for posterior triangle penetrating injuries — subclavian vessels are at risk"
    ],
    safetyNote: "Document detailed neurological baseline before any intervention — this is critical for surgical planning and medicolegal purposes",
    distractorRationales: [
      "Internal jugular vein is deep to the SCM in the anterior triangle, not the posterior triangle",
      "Vertebral artery runs through the transverse foramina of the cervical vertebrae, not the posterior triangle",
      "Phrenic nerve injury would cause diaphragmatic paralysis with dyspnea, not arm weakness and numbness"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 40-year-old male is brought to the ED after a building collapse. He has been trapped under concrete for approximately 6 hours. Before extrication, the field team establishes IV access and begins aggressive fluid resuscitation. Telemetry shows peaked T waves. What pre-extrication intervention is MOST critical?",
    options: [
      "Administer oral activated charcoal for potential toxin ingestion",
      "Administer IV calcium gluconate to stabilize the cardiac membrane before the potassium surge of reperfusion",
      "Apply bilateral tourniquets to both lower extremities before extrication",
      "Administer IV furosemide to promote diuresis"
    ],
    correctAnswer: 1,
    rationaleLong: "This scenario represents the critical pre-extrication management of crush syndrome. After 6 hours of muscle compression, extensive rhabdomyolysis has occurred, and intracellular contents (particularly potassium, at a concentration of ~150 mEq/L intracellularly) are poised to flood the systemic circulation upon reperfusion when the compressive force is removed. The peaked T waves on telemetry BEFORE extrication suggest that some potassium leakage is already occurring, making the reperfusion surge even more dangerous. The most critical pre-extrication intervention is IV calcium gluconate (10-20 mL of 10% solution). Calcium does not lower potassium levels — it stabilizes the cardiac myocyte membrane by raising the threshold potential, making the heart less susceptible to the arrhythmogenic effects of hyperkalemia. This cardiac membrane stabilization provides a protective buffer against the massive potassium surge that will occur upon extrication and reperfusion. The effect begins within 1-3 minutes and lasts 30-60 minutes, buying time for other potassium-lowering interventions. Additional pre-extrication measures include: aggressive IV fluid loading (1-1.5 L/hour of NS to dilute the anticipated potassium surge and maintain renal perfusion for myoglobin clearance), sodium bicarbonate (shifts potassium intracellularly and alkalinizes urine), and continuous cardiac monitoring. Tourniquets should generally be avoided because they concentrate the toxic metabolites in the extremity and when released cause an even larger bolus of potassium. However, in some protocols for limb crush injuries where the patient is in cardiac arrest, tourniquet application prior to extrication may be considered as a last resort to prevent the potassium surge. Furosemide is counterproductive — it promotes volume depletion when aggressive hydration is needed.",
    learningObjective: "Implement pre-extrication interventions for crush syndrome to prevent lethal reperfusion hyperkalemia",
    blueprintCategory: "Trauma",
    subtopic: "crush injuries",
    difficulty: 5,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Peaked T waves BEFORE extrication means potassium is already elevated — the reperfusion surge will be even more dangerous. Calcium gluconate MUST be given pre-extrication.",
    clinicalPearls: [
      "Calcium gluconate stabilizes the cardiac membrane within 1-3 minutes — it does NOT lower potassium",
      "Pre-extrication fluid loading (1-1.5 L/hr NS) dilutes the anticipated potassium surge",
      "Crush injury >1 hour creates significant rhabdomyolysis risk; >4-6 hours = high risk for lethal hyperkalemia"
    ],
    safetyNote: "Extrication teams should have cardiac monitoring, calcium gluconate, and IV fluids available AT THE SCENE — do not wait until ED arrival to treat",
    distractorRationales: [
      "Activated charcoal has no role in crush syndrome management",
      "Tourniquets concentrate toxic metabolites and generally worsen the situation — they are avoided except in extreme circumstances",
      "Furosemide promotes volume depletion when the patient needs aggressive hydration"
    ],
    lessonPath: "/emergency/lessons/crush-injuries"
  },
  {
    stem: "A 22-year-old male presents to the ED after a football tackle with his arm in full extension. He has a posterior elbow dislocation with the olecranon prominently palpable posteriorly. Before reduction, the nurse performs a neurovascular assessment. Which nerve is MOST commonly injured in posterior elbow dislocation?",
    options: [
      "Radial nerve",
      "Median nerve",
      "Ulnar nerve",
      "Musculocutaneous nerve"
    ],
    correctAnswer: 2,
    rationaleLong: "The ulnar nerve is the most commonly injured nerve in posterior elbow dislocation due to its anatomical position. The ulnar nerve passes through the cubital tunnel — a fibro-osseous tunnel posterior to the medial epicondyle of the humerus. When the elbow dislocates posteriorly, the ulnar nerve is stretched over the medial epicondyle and can be compressed, stretched, or contused. The clinical assessment for ulnar nerve injury includes: (1) Motor testing — ask the patient to spread their fingers apart (interossei) and to pinch a piece of paper between the thumb and index finger without bending the thumb IP joint (Froment's sign — if the thumb IP flexes, it indicates ulnar nerve palsy with adductor pollicis weakness); (2) Sensory testing — assess sensation over the ulnar 1.5 digits (ring finger ulnar half and entire little finger) and the corresponding area on the dorsal hand; (3) Assess for intrinsic hand muscle weakness — the ulnar nerve innervates most of the intrinsic hand muscles (interossei, hypothenar muscles, medial two lumbricals). The emergency nurse should document detailed neurovascular findings BEFORE any reduction attempt, including: radial pulse, ulnar pulse, capillary refill of all digits, motor function of all three major nerves (radial — wrist/finger extension; median — thumb opposition, index finger flexion; ulnar — finger abduction), and sensory function in all nerve distributions. After reduction, the neurovascular assessment must be immediately repeated and documented. Any new deficit post-reduction may indicate nerve entrapment within the joint and requires urgent orthopedic evaluation. Additional complications of posterior elbow dislocation include brachial artery injury (less common than nerve injury), coronoid process fractures, and radial head fractures (terrible triad of the elbow: dislocation + coronoid fracture + radial head fracture).",
    learningObjective: "Identify the ulnar nerve as most vulnerable in posterior elbow dislocation and perform a comprehensive neurovascular assessment",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "The 'terrible triad' of the elbow: posterior dislocation + coronoid fracture + radial head fracture — this combination has poor outcomes and requires surgical intervention",
    clinicalPearls: [
      "Ulnar nerve passes posterior to the medial epicondyle — vulnerable in posterior dislocation",
      "Froment's sign tests adductor pollicis (ulnar nerve) — thumb IP flexion compensating for weak adduction",
      "Terrible triad: dislocation + coronoid fracture + radial head fracture = poor prognosis without surgery"
    ],
    safetyNote: "Document neurovascular status before AND after reduction — any new deficit post-reduction suggests nerve entrapment requiring urgent orthopedic evaluation",
    distractorRationales: [
      "Radial nerve is more commonly injured in humeral shaft fractures (spiral groove), not elbow dislocations",
      "Median nerve can be injured but is less commonly affected than the ulnar nerve in posterior dislocation",
      "Musculocutaneous nerve injury with elbow dislocation is rare"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 18-year-old female presents after a cheerleading accident where she fell from the top of a pyramid (approximately 10 feet). She landed on her back and reports severe thoracic back pain. She has full neurological function in all extremities. CT reveals a Chance fracture (flexion-distraction injury) of L1. The nurse should anticipate assessment for which commonly associated injury?",
    options: [
      "Bilateral femur fractures",
      "Intra-abdominal hollow viscus injury, particularly small bowel perforation",
      "Bilateral shoulder dislocations",
      "Cervical spine fractures"
    ],
    correctAnswer: 1,
    rationaleLong: "Chance fractures (flexion-distraction injuries) of the thoracolumbar spine are strongly associated with intra-abdominal injuries, particularly hollow viscus injuries such as small bowel perforation. This association exists because the same flexion mechanism that causes the Chance fracture — acute forward flexion of the trunk over a fulcrum (such as a seatbelt lap belt, or in this case, the landing impact) — also compresses the abdominal contents against the lumbar spine. The flexion-distraction force causes the vertebral body to fail in compression anteriorly while the posterior elements fail in tension (the posterior ligaments, facet joints, and pedicles are pulled apart). This same force vector crushes the small bowel and mesentery between the abdominal wall anteriorly and the spine posteriorly. The association between Chance fractures and intra-abdominal injury is particularly strong when a seat belt mechanism is involved (rates as high as 30-50%), but the same principle applies to any significant flexion mechanism. The emergency nurse should: (1) Maintain spinal motion restriction; (2) Perform serial abdominal assessments every 2-4 hours; (3) Understand that hollow viscus injuries may not be apparent on initial CT — bowel perforation can be initially subtle with only minimal free fluid, mesenteric stranding, or bowel wall thickening; (4) Monitor for signs of peritonitis (increasing abdominal pain, rigidity, guarding, absent bowel sounds, fever); (5) Document the presence or absence of a seat belt sign; (6) Communicate the Chance fracture association to the trauma team. Even with a negative initial CT, the patient should be admitted for serial clinical assessment due to the high incidence of associated abdominal injury.",
    learningObjective: "Recognize the association between Chance fractures and intra-abdominal hollow viscus injuries",
    blueprintCategory: "Trauma",
    subtopic: "spinal cord injury",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Chance fracture = ALWAYS assess for intra-abdominal injury, especially small bowel perforation. Initial CT may be negative — serial assessment is essential.",
    clinicalPearls: [
      "Chance fractures with seat belt mechanism have 30-50% incidence of associated intra-abdominal injury",
      "Hollow viscus injuries may not be visible on initial CT — serial abdominal assessment is critical",
      "Chance fracture mechanism: anterior compression failure + posterior tension failure from acute flexion"
    ],
    safetyNote: "Admit for serial abdominal assessment even with negative initial CT when a Chance fracture is identified — delayed diagnosis of bowel perforation increases morbidity",
    distractorRationales: [
      "Bilateral femur fractures are associated with high-energy axial loading, not flexion-distraction mechanisms",
      "Bilateral shoulder dislocations are associated with seizures or electrocution, not spinal flexion mechanisms",
      "Cervical spine fractures are less commonly associated with thoracolumbar Chance fractures than abdominal injuries"
    ],
    lessonPath: "/emergency/lessons/spinal-cord-injury"
  },
  {
    stem: "A 55-year-old male presents to the ED after being gored by a bull during a rural event. He has a large penetrating wound to the right flank extending into the retroperitoneum. He is hemodynamically stable with HR 98 and BP 122/78. CT shows a grade III right kidney laceration with a contained perirenal hematoma. What is the current evidence-based management approach?",
    options: [
      "Immediate nephrectomy to prevent delayed hemorrhage",
      "Non-operative management with bed rest, serial hemoglobin monitoring, and repeat imaging — the majority of renal injuries heal with conservative management",
      "Selective renal artery embolization regardless of clinical stability",
      "Exploratory laparotomy to assess all retroperitoneal structures"
    ],
    correctAnswer: 1,
    rationaleLong: "The management of traumatic renal injuries has shifted significantly toward non-operative management (NOM) over the past two decades. The current evidence supports NOM for the majority of renal injuries (Grades I-IV) in hemodynamically stable patients. The American Association for the Surgery of Trauma (AAST) grading system classifies renal injuries from Grade I (subcapsular hematoma, contusion) to Grade V (shattered kidney or renal hilum avulsion). For this patient with a Grade III injury (greater than 1 cm laceration without collecting system involvement) who is hemodynamically stable with a contained perirenal hematoma, NOM is the standard of care. The success rate of NOM for Grade I-III injuries is greater than 95%. NOM protocol includes: (1) Bed rest with close monitoring in a monitored unit; (2) Serial hemoglobin measurements every 6-8 hours for the first 24-48 hours; (3) Serial vital sign monitoring; (4) Repeat CT imaging at 48-72 hours or sooner if clinical status changes (increasing pain, decreasing hemoglobin, hemodynamic instability); (5) Strict activity restrictions for 2-4 weeks after discharge; (6) Serial blood pressure monitoring (renovascular hypertension is a delayed complication). Indications for operative intervention include: hemodynamic instability not responsive to resuscitation, expanding or pulsatile perirenal hematoma, Grade V injury (shattered kidney or hilar avulsion), and associated injuries requiring laparotomy where the renal injury can be addressed simultaneously. Angiographic embolization is reserved for patients with active contrast extravasation on CT (active hemorrhage) or pseudoaneurysm formation, not for stable contained hematomas. The emergency nurse should ensure adequate IV access, type and screen, serial hemoglobin draws, and continuous monitoring while communicating the NOM plan to the patient.",
    learningObjective: "Apply non-operative management principles for traumatic renal injuries in hemodynamically stable patients",
    blueprintCategory: "Trauma",
    subtopic: "abdominal trauma",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Non-operative management is successful in >95% of Grade I-III renal injuries — nephrectomy is reserved for Grade V or hemodynamically unstable patients",
    clinicalPearls: [
      "AAST renal injury grading: I-II (minor), III-IV (moderate), V (shattered kidney/hilar avulsion)",
      "NOM success rate >95% for Grades I-III and approximately 80% for Grade IV in stable patients",
      "Delayed complications: urinoma, abscess, pseudoaneurysm, renovascular hypertension"
    ],
    safetyNote: "Serial hemoglobin monitoring is critical — delayed hemorrhage can occur up to 2 weeks after injury in conservatively managed renal trauma",
    distractorRationales: [
      "Immediate nephrectomy is overly aggressive for a stable Grade III injury — it removes a functioning kidney unnecessarily",
      "Embolization is reserved for active hemorrhage or pseudoaneurysm, not stable contained hematomas",
      "Exploratory laparotomy is not indicated for stable retroperitoneal injuries — opening the retroperitoneum can worsen hemorrhage by releasing tamponade"
    ],
    lessonPath: "/emergency/lessons/abdominal-trauma"
  },
  {
    stem: "A 35-year-old male presents to the ED after falling from a tree and landing on a fence post, sustaining a perineal impalement injury. The wooden post is still embedded. He has blood at the urethral meatus and rectal bleeding. The nurse is preparing for evaluation. What are the THREE primary anatomical concerns with perineal impalement?",
    options: [
      "Femoral artery, sciatic nerve, and hip joint",
      "Urethral injury, rectal perforation, and vascular injury to the internal iliac vessels",
      "Spleen laceration, diaphragm rupture, and phrenic nerve injury",
      "Tibial fracture, popliteal artery injury, and compartment syndrome"
    ],
    correctAnswer: 1,
    rationaleLong: "Perineal impalement injuries involve penetrating trauma to the complex anatomical region between the pubic symphysis anteriorly, coccyx posteriorly, and ischial tuberosities laterally. The three primary anatomical concerns are: (1) URETHRAL INJURY — the perineum contains the bulbar and membranous portions of the urethra. Blood at the urethral meatus is a classic indicator of urethral disruption. As with all suspected urethral injuries, Foley catheter insertion is contraindicated until retrograde urethrography confirms urethral integrity; (2) RECTAL PERFORATION — the rectum traverses the posterior perineum, and impalement injuries frequently penetrate the rectal wall. Rectal bleeding in this patient strongly suggests rectal perforation. Rectal injuries carry high infection risk from fecal contamination and require surgical repair, proximal diversion (colostomy), presacral drainage, and distal washout. Digital rectal examination should assess for blood, rectal wall disruption, and impaled object proximity; (3) VASCULAR INJURY — the internal iliac (hypogastric) vessels and their branches (internal pudendal, inferior rectal, obturator) supply the pelvis and perineum. Injury to these vessels can cause massive retroperitoneal or perineal hemorrhage that is difficult to control due to the deep anatomical location. The emergency nurse's management priorities include: leaving the impaling object in place (it may be tamponading vessels), stabilizing the object to prevent movement, establishing large-bore IV access with type and crossmatch, NOT inserting a Foley catheter (blood at the meatus), preparing for emergent surgical consultation (likely requiring a combined urological, colorectal, and trauma surgery approach), administering broad-spectrum antibiotics (covering enteric organisms due to rectal contamination risk), and tetanus prophylaxis.",
    learningObjective: "Identify the three primary anatomical concerns in perineal impalement injuries and initiate appropriate management",
    blueprintCategory: "Trauma",
    subtopic: "penetrating trauma",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Perineal impalement = leave the object in place, do NOT insert a Foley (blood at meatus), and prepare for multidisciplinary surgical management",
    clinicalPearls: [
      "Perineal impalement threatens urethra, rectum, and internal iliac vessels simultaneously",
      "Rectal perforation requires colostomy, presacral drainage, and distal rectal washout",
      "Broad-spectrum antibiotics covering enteric organisms are essential for perineal/rectal contamination"
    ],
    safetyNote: "The impaling object may be tamponading vascular injury — removal should ONLY occur in the operating room with surgical control available",
    distractorRationales: [
      "Femoral artery, sciatic nerve, and hip joint are not the primary perineal structures at risk",
      "Spleen, diaphragm, and phrenic nerve are thoracoabdominal structures not related to perineal anatomy",
      "Tibial fracture and popliteal artery are lower extremity structures unrelated to perineal injury"
    ],
    lessonPath: "/emergency/lessons/penetrating-trauma"
  },
  {
    stem: "A 60-year-old female presents after a ground-level fall with right wrist pain and deformity. X-ray shows a dorsally displaced distal radius fracture (Colles fracture) with dorsal angulation creating a 'dinner fork' deformity. The nurse notes the patient's median nerve function is intact. After closed reduction and splinting, the nurse reassesses and finds the patient now has decreased sensation in the thumb, index, and middle fingers. What has likely occurred?",
    options: [
      "The patient is experiencing normal post-reduction numbness that will resolve",
      "Acute carpal tunnel syndrome from post-reduction edema compressing the median nerve, requiring urgent evaluation",
      "The splint is too tight and needs loosening only",
      "Ulnar nerve entrapment from the reduction maneuver"
    ],
    correctAnswer: 1,
    rationaleLong: "This presentation describes new-onset median nerve deficit after distal radius fracture reduction — a finding consistent with acute carpal tunnel syndrome. The median nerve passes through the carpal tunnel along with the flexor tendons, and this tunnel has rigid bony walls that do not expand to accommodate increased volume. Several mechanisms can cause acute post-reduction carpal tunnel syndrome: (1) Edema — the reduction maneuver and subsequent tissue swelling can increase pressure within the carpal tunnel, compressing the median nerve; (2) Fracture fragment displacement — the reduced fracture position may place a bone fragment in closer proximity to the median nerve; (3) Hematoma — bleeding within the carpal tunnel increases compartment pressure. The median nerve supplies sensation to the palmar surface of the thumb, index finger, middle finger, and radial half of the ring finger. Motor function includes thumb opposition (opponens pollicis), thumb abduction (abductor pollicis brevis), and the lateral two lumbricals. This is a time-sensitive condition — prolonged median nerve compression causes progressive and potentially irreversible nerve damage. The emergency nurse must: immediately notify the treating physician of the new neurological deficit, document the before-and-after neurovascular status thoroughly, loosen or bivalve the splint to rule out external compression, reassess after splint modification, and if symptoms persist after splint loosening, prepare for possible emergent carpal tunnel release. While a tight splint can cause similar symptoms and should be addressed first, the fact that median nerve function was intact pre-reduction and is now impaired post-reduction suggests a change in carpal tunnel dynamics related to the reduction itself. This requires urgent orthopedic evaluation beyond simply loosening the splint.",
    learningObjective: "Recognize acute carpal tunnel syndrome as a complication of distal radius fracture reduction requiring urgent evaluation",
    blueprintCategory: "Trauma",
    subtopic: "orthopedic emergencies",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "New neurological deficit AFTER fracture reduction is never 'normal' — it requires urgent evaluation for nerve compression that may need surgical release",
    clinicalPearls: [
      "Median nerve: thumb, index, middle finger sensation; thumb opposition motor function",
      "Acute carpal tunnel after distal radius fracture may require emergent surgical release",
      "Always document neurovascular status BEFORE and AFTER reduction — new deficits demand immediate action"
    ],
    safetyNote: "First step is to loosen/bivalve the splint — but if symptoms persist after splint modification, this is NOT just a tight splint but true carpal tunnel syndrome requiring orthopedic evaluation",
    distractorRationales: [
      "New post-reduction numbness is never normal — it indicates nerve compromise requiring evaluation",
      "While splint loosening is the first step, persistent symptoms after loosening indicate carpal tunnel syndrome, not just a tight splint",
      "The sensory distribution (thumb, index, middle fingers) is median nerve territory, not ulnar"
    ],
    lessonPath: "/emergency/lessons/orthopedic-emergencies"
  },
  {
    stem: "A 42-year-old male presents to the ED after an assault with a baseball bat to the left side of his head. CT scan reveals a temporal bone fracture with an epidural hematoma. He initially had a loss of consciousness, then regained consciousness and is now becoming progressively lethargic. What is the classic clinical progression of an epidural hematoma?",
    options: [
      "Immediate coma without any lucid interval",
      "The 'lucid interval' — initial loss of consciousness, followed by a period of apparent improvement, then rapid deterioration from expanding hematoma",
      "Gradual onset of headache over days to weeks",
      "Immediate seizure activity without any loss of consciousness"
    ],
    correctAnswer: 1,
    rationaleLong: "The epidural hematoma (EDH) classically presents with the 'lucid interval' — a characteristic triphasic clinical progression: (1) INITIAL LOSS OF CONSCIOUSNESS — from the concussive force of the initial impact; (2) LUCID INTERVAL — the patient regains consciousness and may appear relatively well for a variable period (minutes to hours). During this time, the epidural hematoma is actively expanding as arterial blood (typically from a torn middle meningeal artery) accumulates between the dura mater and the inner table of the skull; (3) RAPID DETERIORATION — as the hematoma expands beyond the cranial compliance threshold, intracranial pressure (ICP) rises rapidly, causing progressive decline in consciousness, contralateral hemiparesis (the expanding hematoma compresses the ipsilateral cerebral peduncle against the tentorial edge), and ipsilateral pupil dilation (uncal herniation compresses the third cranial nerve). If untreated, progression to Cushing's triad (hypertension, bradycardia, irregular respirations) and death from transtentorial herniation occurs. The temporal bone location in this case is classic — the middle meningeal artery runs in a groove on the internal surface of the temporal bone and is particularly vulnerable to laceration from temporal bone fractures. Epidural hematomas appear as biconvex (lens-shaped) hyperdense collections on CT scan because the dura is tightly adherent to the skull and the accumulating blood pushes the dura inward in a convex pattern. This is in contrast to subdural hematomas, which appear as crescent-shaped (concave) collections because the blood spreads freely in the subdural space. The lucid interval represents a critical window of opportunity — if the EDH is identified and surgically evacuated during this period, outcomes are excellent (mortality less than 5% with timely intervention). The emergency nurse must recognize that apparent clinical improvement does NOT mean the patient is out of danger — serial neurological monitoring is essential.",
    learningObjective: "Recognize the classic lucid interval presentation of epidural hematoma and understand the urgency of surgical evacuation",
    blueprintCategory: "Trauma",
    subtopic: "traumatic brain injury",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "The lucid interval is DECEPTIVE — apparent improvement does not mean the patient is safe. The hematoma is actively expanding during this period.",
    clinicalPearls: [
      "EDH: biconvex (lens-shaped) on CT; SDH: crescent-shaped (concave) on CT",
      "Middle meningeal artery injury is the most common cause of epidural hematoma",
      "The lucid interval can last minutes to hours — serial neurological monitoring is critical during this period"
    ],
    safetyNote: "A patient who 'looks better' after head trauma may be in the lucid interval of an EDH — this is the time for intervention, not reassurance",
    distractorRationales: [
      "While immediate coma can occur with severe EDH, the classic presentation includes a lucid interval",
      "Gradual onset over days to weeks is more consistent with chronic subdural hematoma, not epidural",
      "While seizures can occur, the classic progression is the lucid interval pattern described"
    ],
    lessonPath: "/emergency/lessons/traumatic-brain-injury"
  },
  {
    stem: "A 75-year-old female with severe kyphosis presents after a minor fall. She reports acute mid-thoracic back pain. X-ray reveals an acute T8 compression fracture with 50% loss of vertebral body height. She is neurologically intact. The nurse notes she is on chronic prednisone 20mg daily for rheumatoid arthritis. How does chronic corticosteroid use affect this injury?",
    options: [
      "Corticosteroids have no effect on bone health or fracture healing",
      "Chronic corticosteroids cause secondary osteoporosis through multiple mechanisms, predisposing to pathological fractures and impairing healing",
      "Corticosteroids only affect cortical bone, not the trabecular bone of vertebral bodies",
      "Corticosteroids strengthen bone by reducing inflammation"
    ],
    correctAnswer: 1,
    rationaleLong: "Chronic glucocorticoid use is the most common cause of secondary osteoporosis and one of the most common causes of medication-induced osteoporosis. Corticosteroids affect bone through multiple mechanisms: (1) Direct suppression of osteoblast function (cells that build bone), reducing bone formation; (2) Promotion of osteoclast activity and survival (cells that resorb bone), increasing bone resorption; (3) Decreased intestinal calcium absorption leading to secondary hyperparathyroidism and further bone resorption; (4) Increased renal calcium excretion; (5) Decreased gonadal hormone production (estrogen and testosterone), which are protective for bone; (6) Decreased muscle mass and strength (steroid myopathy), increasing fall risk. The vertebral bodies are particularly vulnerable because they are composed primarily of trabecular (cancellous) bone, which has a much higher metabolic turnover rate than cortical bone and is therefore more rapidly affected by corticosteroid-induced changes. The rapid bone loss occurs primarily in the first 3-6 months of corticosteroid therapy, with ongoing losses at a lower rate with continued use. For this patient, the clinical implications include: the fracture occurred with a 'minor' fall mechanism that would not typically cause fracture in normal bone, indicating significantly compromised bone quality; healing may be impaired by the ongoing corticosteroid use; and pain management is essential. The emergency nurse should assess for other osteoporotic fractures (rib fractures, hip, wrist), document the corticosteroid history and communicate it to the admitting team, implement fall prevention strategies, and provide pain management. Vertebral compression fractures in the elderly are associated with significant morbidity: chronic pain, progressive kyphosis, restricted lung capacity, and decreased quality of life.",
    learningObjective: "Understand the effects of chronic corticosteroid use on bone health and its role in pathological fracture risk",
    blueprintCategory: "Trauma",
    subtopic: "geriatric trauma",
    difficulty: 2,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Chronic corticosteroids are the most common cause of secondary osteoporosis — bone loss is most rapid in the first 3-6 months of therapy",
    clinicalPearls: [
      "Vertebral bodies (trabecular bone) are most vulnerable to corticosteroid-induced osteoporosis",
      "Corticosteroids suppress osteoblasts and promote osteoclasts — simultaneous decreased formation and increased resorption",
      "Bone loss is most rapid in first 3-6 months of corticosteroid therapy"
    ],
    safetyNote: "Patients on chronic corticosteroids who present with any fracture should be evaluated for osteoporosis and started on bone-protective therapy",
    distractorRationales: [
      "Corticosteroids significantly affect bone health through multiple mechanisms — they are not benign to bone",
      "Corticosteroids affect BOTH cortical and trabecular bone, with trabecular bone affected earlier and more severely",
      "While corticosteroids reduce inflammation, this does not translate to bone strengthening — the net effect is bone weakening"
    ],
    lessonPath: "/emergency/lessons/geriatric-trauma"
  }
];
