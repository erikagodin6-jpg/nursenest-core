import type { ExamQuestion } from "./types";

export const rnExpansionEQuestions: ExamQuestion[] = [
  {
    q: "A nurse is caring for a client with acute pancreatitis who reports severe epigastric pain radiating to the back. The client's serum lipase is 820 U/L and amylase is 640 U/L. Which position should the nurse assist the client into for pain relief?",
    o: ["Side-lying with knees flexed toward the chest (foetal position)", "Supine with legs elevated on two pillows", "High Fowler's position with arms raised overhead", "Prone position with a pillow under the abdomen"],
    a: 0,
    r: "The foetal position (side-lying with knees drawn up) reduces tension on the abdominal muscles and decreases pressure on the inflamed pancreas, providing pain relief. Supine positioning increases abdominal distension and worsens pain. High Fowler's with arms overhead stretches the abdomen. Prone position is uncomfortable and increases intra-abdominal pressure. The elevated lipase and amylase confirm pancreatitis; lipase is more specific to the pancreas.",
    s: "GI"
  },
  {
    q: "A nurse is caring for a client with a chest tube connected to a water-seal drainage system. During assessment, the nurse observes continuous bubbling in the water-seal chamber. What does this finding indicate?",
    o: ["An air leak in the system that requires identification and intervention", "The system is functioning normally and draining appropriately", "The suction level is set too high and should be reduced", "The chest tube is ready for removal"],
    a: 0,
    r: "Continuous bubbling in the water-seal chamber indicates an air leak, which could be at the insertion site, a tubing connection, or within the lung itself. The nurse should systematically check connections, inspect the insertion site dressing, and notify the provider. Intermittent bubbling with respiration is normal (tidaling), but continuous bubbling is not. Suction level affects the suction control chamber, not the water-seal chamber. A chest tube is ready for removal when there is no air leak and drainage has decreased.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client who was admitted following a motor vehicle collision with a suspected spinal cord injury at C5. Which assessment finding requires the most urgent intervention?",
    o: ["Respiratory rate of 8 breaths per minute with accessory muscle use", "Blood pressure of 88/52 mmHg with a heart rate of 54", "Absence of sensation below the clavicles bilaterally", "Urinary retention requiring catheterisation"],
    a: 0,
    r: "A C5 spinal cord injury affects the phrenic nerve (C3-C5), which innervates the diaphragm. A respiratory rate of 8 with accessory muscle use indicates impending respiratory failure, which is life-threatening and requires immediate intervention (intubation preparation, bag-valve-mask ventilation). Neurogenic shock (hypotension with bradycardia) is expected and concerning but is managed with vasopressors. Loss of sensation and urinary retention are expected findings that require monitoring but are not immediately life-threatening.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for a client with type 1 diabetes who is found unconscious with a blood glucose of 2.1 mmol/L. The client has no IV access. What is the priority nursing action?",
    o: ["Administer glucagon 1 mg intramuscularly and position the client on their side", "Attempt to administer oral glucose gel sublingually", "Begin CPR and call a code", "Wait for IV access to be established before administering dextrose"],
    a: 0,
    r: "Severe hypoglycaemia with loss of consciousness in a client without IV access requires immediate intramuscular glucagon administration. Glucagon stimulates hepatic glycogenolysis, raising blood glucose within 10 to 15 minutes. The client should be positioned on their side to prevent aspiration in case of vomiting, a common side effect of glucagon. Oral glucose is contraindicated in an unconscious client due to aspiration risk. CPR is not indicated unless the client is pulseless. Waiting for IV access delays critical treatment.",
    s: "Endocrine"
  },
  {
    q: "A nurse is caring for a client with heart failure who is receiving furosemide 40 mg IV daily. The morning laboratory results show potassium 2.9 mEq/L, sodium 138 mEq/L, and creatinine 1.1 mg/dL. Which action should the nurse take first?",
    o: ["Withhold the furosemide dose and notify the provider of the critical potassium level", "Administer the furosemide as ordered and recheck the potassium in 4 hours", "Encourage the client to eat a banana and recheck the potassium tomorrow", "Administer potassium chloride 40 mEq IV push immediately"],
    a: 0,
    r: "A potassium of 2.9 mEq/L is critically low (normal 3.5-5.0 mEq/L) and places the client at risk for fatal cardiac dysrhythmias, including ventricular fibrillation. Furosemide is a loop diuretic that further depletes potassium and must be withheld until the level is corrected. The provider needs to be notified for potassium replacement orders. Administering furosemide would worsen hypokalaemia. Dietary potassium alone is insufficient for critical levels. IV potassium must never be given by push; it must be diluted and infused slowly.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is performing a neurological assessment on a client who sustained a head injury. The client opens eyes to pain, makes incomprehensible sounds, and demonstrates abnormal flexion to painful stimuli. What is the client's Glasgow Coma Scale score?",
    o: ["7", "9", "5", "11"],
    a: 0,
    r: "The Glasgow Coma Scale (GCS) scores three components: Eye opening to pain = 2 (spontaneous=4, to voice=3, to pain=2, none=1). Verbal response of incomprehensible sounds = 2 (oriented=5, confused=4, inappropriate words=3, incomprehensible=2, none=1). Motor response of abnormal flexion (decorticate) = 3 (obeys commands=6, localises=5, withdrawal=4, abnormal flexion=3, extension=2, none=1). Total GCS = 2 + 2 + 3 = 7. A GCS of 8 or below indicates severe brain injury requiring intubation for airway protection.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for a client with cirrhosis who has a distended abdomen and is scheduled for a paracentesis. Which nursing action is essential before the procedure?",
    o: ["Have the client empty their bladder to reduce the risk of bladder perforation during needle insertion", "Position the client in a left lateral decubitus position", "Administer a sedative to ensure the client remains still during the procedure", "Insert a nasogastric tube for gastric decompression"],
    a: 1,
    r: "A full bladder rises above the symphysis pubis and into the abdominal cavity, placing it at risk for perforation during paracentesis needle insertion. Emptying the bladder before the procedure is a critical safety measure. The client should be positioned upright or sitting at the edge of the bed (not lateral decubitus) to allow fluid to pool inferiorly. Sedation is not routinely required as paracentesis is performed under local anaesthesia. A nasogastric tube is not indicated for this procedure.",
    s: "GI"
  },
  {
    q: "A nurse is caring for a client in the emergency department with a suspected ruptured ectopic pregnancy. The client's blood pressure is 82/50 mmHg, heart rate 128, and the abdomen is rigid and tender. What is the priority nursing action?",
    o: ["Prepare for an immediate ultrasound to confirm the diagnosis", "Establish two large-bore IV lines and initiate rapid fluid resuscitation while preparing for emergency surgery", "Administer methotrexate as prescribed for ectopic pregnancy management", "Obtain a quantitative serum hCG level and wait for results before intervening"],
    a: 1,
    r: "A ruptured ectopic pregnancy is a surgical emergency with life-threatening haemorrhage. The client's haemodynamic instability (hypotension, tachycardia) and rigid abdomen indicate active intra-abdominal bleeding requiring immediate fluid resuscitation through two large-bore IVs (16 or 18 gauge) and preparation for emergency laparotomy or laparoscopy. Methotrexate is only used for unruptured ectopic pregnancies. While ultrasound and hCG are diagnostic tools, delaying resuscitation for diagnostic confirmation in a haemodynamically unstable client could be fatal.",
    s: "Maternal-Newborn"
  },
  {
    q: "A nurse is caring for a client with Addison's disease who reports nausea, vomiting, and severe fatigue. Vital signs show BP 78/48 mmHg, HR 118, and temperature 38.9°C. Which complication should the nurse suspect?",
    o: ["Myxoedema coma requiring IV levothyroxine", "Addisonian crisis (acute adrenal insufficiency) requiring IV hydrocortisone and fluid resuscitation", "Diabetic ketoacidosis requiring insulin infusion", "Cushing syndrome requiring surgical intervention"],
    a: 1,
    r: "Addisonian crisis is a life-threatening emergency caused by acute cortisol and aldosterone deficiency, often triggered by physiological stress, infection, or abrupt corticosteroid withdrawal. Presenting signs include severe hypotension, tachycardia, hyperthermia, nausea, vomiting, and altered consciousness. Immediate treatment includes IV hydrocortisone 100 mg bolus, aggressive IV fluid resuscitation with normal saline and dextrose, and haemodynamic monitoring. Myxoedema relates to thyroid dysfunction. DKA presents with hyperglycaemia. Cushing syndrome involves cortisol excess, the opposite of Addison's.",
    s: "Endocrine"
  },
  {
    q: "A nurse is caring for a client who underwent a thyroidectomy 6 hours ago. The client reports tingling around the mouth and numbness in the fingertips. Which complication should the nurse suspect and what assessment should be performed?",
    o: ["Hypocalcaemia; check for Chvostek's and Trousseau's signs", "Thyroid storm; assess for hyperthermia and tachycardia", "Recurrent laryngeal nerve damage; assess voice quality", "Haemorrhage; inspect the surgical dressing and posterior neck"],
    a: 2,
    r: "Perioral tingling and fingertip numbness following thyroidectomy are classic early signs of hypocalcaemia caused by inadvertent removal or damage to the parathyroid glands during surgery. The nurse should check Chvostek's sign (tapping the facial nerve anterior to the ear causes facial twitching) and Trousseau's sign (inflating a BP cuff above systolic for 3 minutes causes carpal spasm). Serum calcium should be drawn immediately, and IV calcium gluconate should be available. Thyroid storm presents with extreme hyperthermia and tachycardia. Laryngeal nerve damage causes hoarseness.",
    s: "Endocrine"
  },
  {
    q: "A nurse is caring for a client with acute kidney injury whose laboratory results show potassium 6.8 mEq/L. The cardiac monitor shows peaked T waves. Which intervention should the nurse anticipate first?",
    o: ["Administer sodium polystyrene sulfonate (Kayexalate) orally", "Administer IV calcium gluconate to stabilise the cardiac membrane", "Prepare for emergent haemodialysis", "Restrict dietary potassium and recheck levels in 4 hours"],
    a: 1,
    r: "A potassium of 6.8 mEq/L with ECG changes (peaked T waves) is a cardiac emergency. IV calcium gluconate is the first intervention because it directly stabilises the myocardial cell membrane and reduces the risk of fatal dysrhythmias within minutes, although it does not lower potassium. Subsequent interventions include IV insulin with dextrose (shifts potassium intracellularly), sodium bicarbonate, nebulised salbutamol, and Kayexalate (promotes GI excretion). Haemodialysis is definitive but takes time to arrange. Dietary restriction alone is dangerously insufficient for this level.",
    s: "Renal"
  },
  {
    q: "A nurse is triaging clients in the emergency department after a mass casualty incident. Which client should be categorised as emergent (red tag) and treated first?",
    o: ["A client with a compound fracture of the femur and a palpable pedal pulse", "A client with a tension pneumothorax, absent breath sounds on the left, and tracheal deviation to the right", "A client with multiple lacerations that are bleeding but controlled with direct pressure", "A client with singed nasal hairs, hoarseness, and carbonaceous sputum after a fire"],
    a: 3,
    r: "In mass casualty triage, inhalation injury with singed nasal hairs, hoarseness, and carbonaceous sputum indicates impending airway compromise from thermal oedema, which can progress rapidly to complete airway obstruction. This client requires immediate intubation before oedema worsens. The tension pneumothorax is also emergent and requires needle decompression, but airway takes priority over breathing in the ABC framework. The compound fracture is urgent but not immediately life-threatening with intact distal perfusion. Controlled bleeding lacerations are delayed priority.",
    s: "Emergency"
  },
  {
    q: "A nurse is caring for a client receiving a blood transfusion who develops fever, chills, flank pain, and dark-coloured urine 15 minutes after the transfusion began. What is the priority nursing action?",
    o: ["Slow the infusion rate and administer acetaminophen for the fever", "Stop the transfusion immediately, disconnect the blood tubing, and infuse normal saline through new tubing", "Continue the transfusion and monitor the client closely for additional symptoms", "Administer diphenhydramine and continue the transfusion at a slower rate"],
    a: 1,
    r: "Fever, chills, flank pain, and dark urine (haemoglobinuria) indicate an acute haemolytic transfusion reaction, a life-threatening emergency caused by ABO incompatibility. The blood must be stopped immediately and the tubing disconnected to prevent any residual incompatible blood from entering the client. New tubing with normal saline maintains IV access. The blood bag and tubing are sent to the blood bank for analysis. Slowing the rate or continuing allows more incompatible blood to cause further haemolysis, potentially leading to disseminated intravascular coagulation, renal failure, and death.",
    s: "Fundamentals"
  },
  {
    q: "A nurse is caring for a client with bacterial meningitis. Which nursing intervention is the highest priority during the acute phase?",
    o: ["Maintain droplet precautions with a surgical mask for all persons entering the room", "Institute seizure precautions, dim the lights, and minimise environmental stimulation", "Encourage frequent ambulation to prevent deep vein thrombosis", "Offer a regular diet to maintain adequate nutritional intake"],
    a: 1,
    r: "During acute bacterial meningitis, the inflamed meninges cause extreme sensitivity to stimulation. Seizures are a common and dangerous complication due to cerebral irritation and increased intracranial pressure. Seizure precautions (padded side rails, suction at bedside, oxygen available), dimmed lighting, reduced noise, and limited visitors are essential. Bacterial meningitis caused by N. meningitidis requires droplet precautions, which is important but secondary to preventing injury from seizures. Ambulation is inappropriate during the acute phase. Nausea and vomiting often preclude oral intake.",
    s: "Neurological"
  },
  {
    q: "A nurse is assessing a client 4 hours after cardiac catheterisation via the right femoral artery. Which finding requires immediate intervention?",
    o: ["Mild bruising at the insertion site", "A firm, expanding mass palpated at the right groin with a bruit on auscultation", "Client reports mild soreness at the puncture site", "Right pedal pulse is 2+ and equal to the left"],
    a: 1,
    r: "A firm, expanding mass with a bruit at the femoral catheterisation site indicates a pseudoaneurysm or haematoma formation with active arterial bleeding, which is a vascular emergency requiring immediate provider notification. Interventions may include manual compression, ultrasound-guided thrombin injection, or surgical repair. Mild bruising and soreness are expected findings. Equal bilateral pedal pulses (2+) indicate adequate distal perfusion. The nurse should also assess for retroperitoneal bleeding (back pain, tachycardia, dropping haemoglobin).",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with syndrome of inappropriate antidiuretic hormone (SIADH). The client's serum sodium is 118 mEq/L and the client is confused and lethargic. Which intervention should the nurse anticipate?",
    o: ["Administer IV normal saline rapidly to correct the sodium deficit within 6 hours", "Initiate strict fluid restriction and administer hypertonic (3%) saline IV slowly as ordered", "Encourage oral fluid intake to dilute the excess ADH", "Administer desmopressin to regulate ADH levels"],
    a: 1,
    r: "SIADH causes excessive water retention, leading to dilutional hyponatraemia. A sodium of 118 mEq/L with neurological symptoms (confusion, lethargy) is a medical emergency. Treatment includes strict fluid restriction (typically 500-1000 mL/day) and slow infusion of 3% hypertonic saline. Sodium must be corrected slowly (no more than 8-12 mEq/L in 24 hours) to prevent osmotic demyelination syndrome (central pontine myelinolysis). Rapid correction is dangerous. Encouraging fluids worsens the dilution. Desmopressin is synthetic ADH and would worsen the condition.",
    s: "Endocrine"
  },
  {
    q: "A nurse is caring for a client with a new tracheostomy performed 24 hours ago. During suctioning, the client becomes cyanotic with an oxygen saturation of 82%. What should the nurse do?",
    o: ["Continue suctioning to clear the airway obstruction causing the desaturation", "Immediately withdraw the suction catheter, hyperventilate the client with 100% oxygen, and allow recovery before reattempting", "Remove the tracheostomy tube and ventilate via the stoma using bag-valve-mask", "Call a code and begin chest compressions"],
    a: 1,
    r: "Suctioning removes oxygen along with secretions, and prolonged suctioning can cause hypoxaemia, vagal stimulation (bradycardia), and mucosal trauma. When desaturation occurs during suctioning, the catheter must be immediately withdrawn and the client hyperventilated with 100% oxygen to restore oxygen levels. Suctioning should be limited to 10-15 seconds per pass. Continuing to suction worsens hypoxaemia. Removing a new tracheostomy is contraindicated as the stoma tract is not yet mature. CPR is not indicated for hypoxaemia alone without cardiac arrest.",
    s: "Respiratory"
  },
  {
    q: "A nurse is caring for a client prescribed warfarin for atrial fibrillation. The client's INR is 5.2 and there is no active bleeding. What should the nurse anticipate?",
    o: ["Administer vitamin K IV immediately and prepare for fresh frozen plasma", "Hold warfarin, administer oral vitamin K as ordered, and monitor the INR closely", "Continue warfarin at the current dose and recheck the INR in one week", "Administer protamine sulfate to reverse the warfarin effect"],
    a: 1,
    r: "An INR of 5.2 without active bleeding indicates supratherapeutic anticoagulation (therapeutic range for atrial fibrillation is 2.0-3.0). Warfarin should be held and oral vitamin K administered to gradually reduce the INR. IV vitamin K and FFP are reserved for active or life-threatening bleeding because IV vitamin K carries a risk of anaphylaxis and rapid reversal may cause thromboembolic events. Continuing warfarin would further increase bleeding risk. Protamine sulfate reverses heparin, not warfarin.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client with a spinal cord injury at T6 who suddenly develops a severe headache, blood pressure of 230/120 mmHg, bradycardia, diaphoresis above the level of injury, and flushing. What is the priority nursing action?",
    o: ["Administer an antihypertensive medication immediately", "Sit the client upright and check for a distended bladder or other noxious stimulus below the level of injury", "Lower the head of the bed and administer IV fluids for suspected orthostatic hypotension", "Apply a cold compress to the forehead and continue monitoring"],
    a: 1,
    r: "This presentation is classic autonomic dysreflexia, a life-threatening emergency in clients with spinal cord injuries at T6 or above. The priority is to sit the client upright (lowers BP through orthostatic effect) and immediately identify and remove the triggering noxious stimulus, most commonly a distended bladder (kinked catheter, full drainage bag) or bowel impaction. If the stimulus is not removed, the severe hypertension can cause stroke, seizures, or death. Antihypertensives may be needed if BP remains elevated after removing the stimulus, but removing the cause is the priority.",
    s: "Neurological"
  },
  {
    q: "A nurse is caring for a client admitted with diabetic ketoacidosis (DKA). Initial laboratory values show blood glucose 28.5 mmol/L, pH 7.18, serum potassium 5.6 mEq/L. After starting IV insulin and fluid resuscitation, the nurse should monitor most closely for which electrolyte imbalance?",
    o: ["Hypernatraemia from excessive sodium chloride infusion", "Hypokalaemia as insulin drives potassium intracellularly", "Hypercalcaemia from metabolic acidosis correction", "Hypermagnesaemia from fluid resuscitation"],
    a: 1,
    r: "In DKA, serum potassium may appear normal or elevated due to the extracellular shift caused by acidosis and insulin deficiency, but total body potassium is depleted from osmotic diuresis. When insulin is administered, it drives potassium back into cells, causing a rapid and potentially fatal drop in serum potassium. The nurse must monitor potassium levels every 1-2 hours during insulin infusion and ensure potassium replacement is initiated when levels fall below 5.3 mEq/L. Hypokalaemia can cause lethal cardiac dysrhythmias.",
    s: "Endocrine"
  },
  {
    q: "A nurse is delegating tasks to a licensed practical nurse (LPN/RPN) and an unregulated care provider (UCP) on a medical-surgical unit. Which task is appropriate to delegate to the UCP?",
    o: ["Administering an oral analgesic to a stable postoperative client", "Obtaining vital signs on a stable client 2 days post-appendectomy", "Performing a focused respiratory assessment on a client with pneumonia", "Educating a newly diagnosed diabetic client about insulin injection technique"],
    a: 1,
    r: "Obtaining vital signs on a stable client is an appropriate task for a UCP because it is a routine, standard procedure that does not require clinical judgment. The RN must provide clear parameters for reporting abnormal findings. Medication administration (even oral) requires a licensed professional. Focused assessments require clinical judgment and are within the RN scope. Client education about a new diagnosis and skill (insulin injection) requires nursing knowledge and is not delegable to unlicensed personnel.",
    s: "Delegation"
  },
  {
    q: "A nurse is caring for a client with a pulmonary embolism who is receiving a continuous heparin infusion. The client's aPTT result is 120 seconds (therapeutic range 60-80 seconds). What should the nurse do?",
    o: ["Continue the infusion at the current rate since the client has a pulmonary embolism", "Stop the heparin infusion, notify the provider, and assess the client for signs of bleeding", "Increase the heparin infusion rate to achieve better clot resolution", "Administer vitamin K to counteract the elevated aPTT"],
    a: 1,
    r: "An aPTT of 120 seconds significantly exceeds the therapeutic range (60-80 seconds), indicating excessive anticoagulation and a high risk for haemorrhage. The heparin infusion must be stopped immediately, the provider notified for adjusted dosing orders, and the client assessed for signs of bleeding (haematuria, melena, gum bleeding, petechiae, altered consciousness). Continuing or increasing the infusion risks life-threatening haemorrhage. Vitamin K reverses warfarin, not heparin; protamine sulfate is the antidote for heparin.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a child with nephrotic syndrome. The child has periorbital oedema, abdominal distension, and 3+ proteinuria. Which dietary modification should the nurse include in the care plan?",
    o: ["High-protein diet to replace urinary protein losses", "Normal protein intake with sodium restriction", "Fluid restriction to 500 mL per day", "High-sodium diet to promote renal perfusion"],
    a: 1,
    r: "In nephrotic syndrome, massive proteinuria causes hypoalbuminaemia and generalised oedema. Current evidence supports a normal protein diet (not high protein, which can worsen glomerular damage) with sodium restriction to minimise fluid retention and oedema. High-protein diets were previously recommended but are now known to increase glomerular hyperfiltration and worsen protein loss. Severe fluid restriction is not typically necessary unless there is significant hyponatraemia. High sodium would worsen oedema dramatically.",
    s: "Pediatrics"
  },
  {
    q: "A nurse is caring for a postoperative client who underwent a right total hip arthroplasty (posterior approach) 8 hours ago. Which finding indicates the client needs immediate repositioning?",
    o: ["The client is lying supine with an abduction pillow between the legs", "The client's right leg is adducted and internally rotated past midline", "The client is sitting in a chair with hips at 85 degrees of flexion", "The client is performing ankle circles and quadriceps sets in bed"],
    a: 1,
    r: "After a posterior approach total hip arthroplasty, the client must avoid hip adduction past midline, internal rotation, and flexion greater than 90 degrees to prevent prosthetic dislocation. An adducted and internally rotated leg indicates the hip may have already dislocated or is at imminent risk, requiring immediate repositioning and provider notification. Signs of dislocation include sudden severe pain, leg shortening, and external rotation. An abduction pillow maintains proper alignment. Sitting at 85 degrees is within the safe range. Ankle exercises are encouraged.",
    s: "Musculoskeletal"
  },
  {
    q: "A nurse is providing care for a client in the intensive care unit who is intubated and mechanically ventilated. The high-pressure alarm on the ventilator sounds. What should the nurse assess first?",
    o: ["Check if the ventilator tubing has become disconnected", "Assess the client for secretions, biting on the tube, or bronchospasm", "Increase the tidal volume to compensate for the high pressure", "Silence the alarm and continue monitoring the client"],
    a: 1,
    r: "A high-pressure alarm indicates increased resistance in the airway or decreased lung compliance. Common causes include secretion accumulation requiring suctioning, the client biting the endotracheal tube (requiring a bite block), bronchospasm, kinking of the tubing, pneumothorax, or the client coughing. Disconnection causes a low-pressure alarm, not high. Increasing tidal volume would further increase pressure and risk barotrauma. Silencing the alarm without identifying the cause is unsafe and could result in harm to the client.",
    s: "Respiratory"
  }
];
