import type { ExamQuestion } from "./types";

export const rpnExpansionGQuestions: ExamQuestion[] = [
  {
    q: "A nurse is administering metoprolol (Lopressor) 50 mg PO to a client. Before giving the medication, the nurse assesses the client's heart rate at 52 bpm. What should the nurse do?",
    o: ["Administer the medication with a glass of orange juice", "Administer the medication as ordered", "Administer half the dose and reassess in 1 hour", "Hold the medication and notify the healthcare provider"],
    a: 3,
    r: "Metoprolol is a beta-blocker that decreases heart rate and blood pressure. The nurse should hold the medication when the heart rate is below 60 bpm because administering a beta-blocker to a bradycardic client can cause dangerously low heart rate, hypotension, and cardiac arrest. The healthcare provider must be notified so the dose or medication can be adjusted. Administering half a dose is not within the nurse's scope without an order. Orange juice does not affect the medication's cardiac effects.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is teaching a client prescribed lithium carbonate for bipolar disorder. Which instruction is most important for the client's safety?",
    o: ["Avoid all dairy products while taking this medication", "Restrict sodium intake to prevent fluid retention", "Take the medication only when mood symptoms worsen", "Maintain adequate sodium and fluid intake and have lithium levels checked regularly"],
    a: 3,
    r: "Lithium has a very narrow therapeutic range (0.6–1.2 mmol/L). Sodium depletion and dehydration cause lithium retention and toxicity, which can be fatal. Regular blood level monitoring is essential. Restricting sodium increases lithium reabsorption in the kidneys, raising serum levels dangerously. Lithium must be taken consistently, not PRN. Dairy products do not interact with lithium. Signs of toxicity include coarse tremor, vomiting, diarrhea, and confusion.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client who is prescribed metformin (Glucophage) for type 2 diabetes. The client is scheduled for a contrast CT scan tomorrow. What should the nurse communicate to the healthcare provider?",
    o: ["The dose of metformin should be doubled on the day of the scan", "Metformin can be continued safely during the procedure", "Metformin should be held before and for 48 hours after the procedure due to risk of lactic acidosis", "Metformin should be taken with the contrast dye to stabilize blood glucose"],
    a: 2,
    r: "Metformin must be held before and for 48 hours after contrast dye administration because the combination increases the risk of lactic acidosis, a rare but potentially fatal complication. Contrast dye can impair renal function, and metformin is excreted renally. Impaired clearance leads to metformin accumulation. Renal function should be reassessed before restarting the medication. Continuing or increasing metformin is contraindicated in this situation.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is administering morphine sulfate 4 mg IV to a postoperative client. After administration, the client's respiratory rate drops to 8 breaths per minute and the client is difficult to arouse. What should the nurse do first?",
    o: ["Continue to monitor the client since drowsiness is expected after morphine", "Administer naloxone (Narcan) as prescribed and stimulate the client", "Administer another dose of morphine for breakthrough pain", "Position the client flat and wait for the medication to wear off"],
    a: 1,
    r: "Respiratory depression (fewer than 12 breaths per minute) and excessive sedation are signs of opioid toxicity. Naloxone is the opioid antagonist that rapidly reverses respiratory depression. The nurse should administer naloxone, stimulate the client, maintain the airway, and monitor closely. Naloxone has a shorter half-life than morphine, so repeated doses may be needed. Continuing to monitor without intervention risks respiratory arrest. Additional morphine would be fatal. Supine position does not address the respiratory compromise.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client taking phenytoin (Dilantin) for seizure prevention. The client's serum phenytoin level is 35 mcg/mL. Which signs should the nurse expect?",
    o: ["Improved seizure control with no adverse effects", "Nystagmus, ataxia, and slurred speech", "Hypertension and tachycardia", "Polyuria and polydipsia"],
    a: 1,
    r: "The therapeutic range for phenytoin is 10–20 mcg/mL. A level of 35 mcg/mL is toxic. Early toxicity signs include nystagmus (involuntary eye movements), ataxia (unsteady gait), and slurred speech. Higher levels can cause confusion, seizures paradoxically, and cardiac arrhythmias. The medication should be held, the provider notified, and the client monitored. Improved seizure control occurs within therapeutic range. Phenytoin toxicity does not cause the other listed symptoms.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is teaching a client about the proper use of a metered-dose inhaler (MDI) with a spacer. Which client action indicates correct technique?",
    o: ["Hold the inhaler 15 cm from the mouth and inhale through the nose", "Inhale quickly and forcefully immediately after pressing the canister without a spacer", "Shake the inhaler, attach the spacer, press the canister, then inhale slowly and deeply", "Take two rapid puffs in succession without waiting between doses"],
    a: 2,
    r: "Correct MDI technique with a spacer involves shaking the inhaler, attaching the spacer, exhaling fully, pressing the canister, and then inhaling slowly and deeply through the mouth. The spacer holds the medication allowing better lung deposition. Rapid forceful inhalation deposits medication in the throat rather than the lungs. Nose breathing does not deliver medication to the lungs. Doses should be separated by 1 minute to allow optimal absorption of each puff.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client receiving vancomycin IV. During the infusion, the client develops flushing of the face, neck, and upper trunk with pruritus. What is the most likely cause?",
    o: ["Red man syndrome from rapid infusion of vancomycin", "An anaphylactic reaction requiring epinephrine", "A normal expected response to vancomycin therapy", "An allergic reaction to the IV fluid"],
    a: 0,
    r: "Red man syndrome is a histamine-mediated reaction caused by rapid vancomycin infusion (typically less than 60 minutes). It presents with flushing, pruritus, and erythema of the face, neck, and upper body. The nurse should stop the infusion, notify the provider, and anticipate slowing the rate and premedicating with diphenhydramine. It is not a true allergy. Anaphylaxis involves hypotension, bronchospasm, and airway compromise. This is not normal and is preventable by infusing over at least 60 minutes.",
    s: "Pharmacology"
  },
  {
    q: "A nurse is caring for a client who has been taking prednisone 40 mg daily for 3 weeks. The client states they want to stop the medication because they feel better. What should the nurse advise?",
    o: ["Continue taking the full dose indefinitely for best results", "It is safe to stop prednisone abruptly at any time", "Do not stop suddenly; the dose must be tapered gradually under provider supervision", "Switch to taking it every other day without consulting the provider"],
    a: 2,
    r: "Prolonged corticosteroid use suppresses the hypothalamic-pituitary-adrenal (HPA) axis and endogenous cortisol production. Abrupt discontinuation can cause adrenal crisis (acute adrenal insufficiency), which is life-threatening with symptoms of hypotension, hypoglycemia, and cardiovascular collapse. The dose must be tapered gradually to allow the adrenal glands to resume cortisol production. Self-adjusting the schedule without medical guidance is dangerous.",
    s: "Pharmacology"
  },
  {
    q: "A nurse arrives at the scene of a motor vehicle collision. A victim is unresponsive and not breathing but has a pulse. What should the nurse do first?",
    o: ["Begin chest compressions immediately", "Open the airway using a jaw-thrust maneuver and provide rescue breaths", "Move the victim to a more comfortable location", "Wait for emergency medical services to arrive before intervening"],
    a: 1,
    r: "In a trauma victim who is not breathing but has a pulse, the priority is to open the airway and provide rescue breaths. The jaw-thrust maneuver is used instead of head-tilt chin-lift because cervical spine injury must be assumed in trauma. Chest compressions are indicated only if there is no pulse. Moving the victim risks worsening spinal injuries. Delaying intervention can result in death from respiratory arrest progressing to cardiac arrest within minutes.",
    s: "Emergency"
  },
  {
    q: "A nurse is caring for a client in the emergency department who presents with severe epigastric pain radiating to the back, nausea, and vomiting. The serum lipase is 850 U/L. Which condition should the nurse suspect?",
    o: ["Acute pancreatitis", "Peptic ulcer disease", "Cholecystitis", "Appendicitis"],
    a: 0,
    r: "Severe epigastric pain radiating to the back with markedly elevated serum lipase (normal less than 160 U/L) is the classic presentation of acute pancreatitis. Lipase is more specific for pancreatic inflammation than amylase. Peptic ulcer disease causes epigastric pain but does not typically elevate lipase significantly. Cholecystitis causes right upper quadrant pain. Appendicitis causes periumbilical pain migrating to the right lower quadrant. Management includes NPO status, IV fluids, and pain management.",
    s: "Emergency"
  },
  {
    q: "A nurse is triaging clients in the emergency department after a mass casualty event. Which client should the nurse prioritize for treatment first?",
    o: ["A client with a tension pneumothorax who is dyspneic and has tracheal deviation", "A client with a minor laceration on the forearm that has stopped bleeding", "A client with a small closed fracture of the left wrist with good distal pulses", "A client who is alert with abrasions and contusions on both knees"],
    a: 0,
    r: "In mass casualty triage, the nurse prioritizes clients with life-threatening but survivable injuries. A tension pneumothorax causes mediastinal shift, tracheal deviation, and cardiovascular collapse without immediate intervention (needle decompression). This client is categorized as immediate (red tag). The laceration, closed fracture, and abrasions are non-life-threatening and can be categorized as delayed (yellow) or minor (green). Triage decisions maximize survival across all casualties.",
    s: "Emergency"
  },
  {
    q: "A nurse is caring for a client who is experiencing anaphylaxis after a bee sting. The client has wheezing, facial swelling, and a blood pressure of 78/42 mmHg. What is the priority medication?",
    o: ["Diphenhydramine (Benadryl) 50 mg IV", "Epinephrine (adrenaline) 0.3 mg intramuscular into the lateral thigh", "Hydrocortisone 100 mg IV", "Albuterol nebulizer treatment"],
    a: 1,
    r: "Epinephrine is the first-line emergency treatment for anaphylaxis. It reverses bronchospasm, increases blood pressure through vasoconstriction, and reduces mucosal edema. It must be administered intramuscularly into the anterolateral thigh for fastest absorption. Diphenhydramine treats histamine-mediated symptoms but does not reverse cardiovascular collapse. Corticosteroids prevent biphasic reactions but take hours to work. Albuterol helps bronchospasm but does not address hypotension or angioedema.",
    s: "Emergency"
  },
  {
    q: "A nurse is caring for a client who ingested a large quantity of acetaminophen (Tylenol) approximately 4 hours ago. Which medication should the nurse anticipate administering?",
    o: ["Flumazenil to reverse the sedative effects", "Activated charcoal to absorb the remaining medication", "N-acetylcysteine (Mucomyst) as the antidote for acetaminophen toxicity", "Naloxone to reverse the respiratory depression"],
    a: 2,
    r: "N-acetylcysteine (NAC) is the specific antidote for acetaminophen overdose. It replenishes glutathione stores in the liver, preventing hepatotoxicity. It is most effective when administered within 8 hours of ingestion but can be given up to 72 hours. Activated charcoal is effective only within 1–2 hours of ingestion. Flumazenil reverses benzodiazepines, not acetaminophen. Naloxone reverses opioids. Acetaminophen toxicity can cause fatal hepatic necrosis within 3–5 days without treatment.",
    s: "Emergency"
  },
  {
    q: "A nurse is caring for a client who presents with sudden severe headache described as the worst headache of my life, neck stiffness, and photophobia. What should the nurse suspect?",
    o: ["Migraine headache requiring analgesics", "Subarachnoid hemorrhage requiring emergent evaluation", "Tension headache from muscle strain", "Sinusitis from upper respiratory infection"],
    a: 1,
    r: "A thunderclap headache described as the worst headache of my life with nuchal rigidity (neck stiffness) and photophobia is the classic presentation of subarachnoid hemorrhage (SAH) caused by a ruptured cerebral aneurysm. This is a neurosurgical emergency with high mortality. Immediate CT scan without contrast is needed. Migraine headaches develop gradually. Tension headaches are bilateral band-like pressure. Sinusitis causes facial pain and congestion without meningeal signs.",
    s: "Emergency"
  },
  {
    q: "A nurse is assessing a client with diabetic ketoacidosis (DKA). Which findings does the nurse expect?",
    o: ["Shallow respirations, blood glucose of 4.5 mmol/L, and pH 7.45", "Kussmaul respirations, fruity breath odour, blood glucose of 28 mmol/L, and pH 7.18", "Bradypnea, blood glucose of 6.0 mmol/L, and pH 7.50", "Normal respirations, blood glucose of 5.5 mmol/L, and pH 7.40"],
    a: 1,
    r: "Diabetic ketoacidosis presents with hyperglycemia (often above 14 mmol/L), metabolic acidosis (pH below 7.35), and compensatory Kussmaul respirations (deep, rapid breathing to blow off CO2). The fruity acetone breath odour results from ketone metabolism. Additional findings include dehydration, polyuria, nausea, and abdominal pain. Treatment includes IV insulin, aggressive fluid resuscitation, and electrolyte monitoring, particularly potassium. The other options describe normal or alkalotic findings inconsistent with DKA.",
    s: "Emergency"
  },
  {
    q: "A nurse is caring for a client with severe burns covering 40% of total body surface area. The client is at greatest risk for which complication in the first 24 hours?",
    o: ["Hyperkalemia from excessive IV fluid administration", "Infection from bacterial colonization of the burn wounds", "Contractures from scar tissue formation", "Hypovolemic shock from massive fluid shifts into interstitial spaces"],
    a: 3,
    r: "In the first 24–48 hours after major burns (emergent phase), massive capillary permeability causes fluid to shift from the intravascular space into the interstitium, resulting in hypovolemic shock. Aggressive fluid resuscitation using the Parkland formula is critical. Infection risk increases after 48–72 hours as the immune response is compromised. Contractures develop during the rehabilitative phase. Hyperkalemia in burns results from cellular destruction releasing intracellular potassium, not from IV fluids.",
    s: "Emergency"
  },
  {
    q: "A nurse is caring for a client who is experiencing a tonic-clonic seizure. What is the nurse's priority action during the seizure?",
    o: ["Protect the client from injury by clearing the area, cushioning the head, and timing the seizure", "Insert an oral airway or tongue blade to prevent the client from biting their tongue", "Restrain the client's arms and legs to prevent injury from thrashing", "Attempt to place the client in a seated position during the seizure"],
    a: 0,
    r: "During an active tonic-clonic seizure, the priority is safety. The nurse should lower the client to the floor if standing, clear nearby objects, cushion the head, loosen restrictive clothing, and time the seizure. Nothing should be placed in the mouth as it can break teeth, obstruct the airway, or injure the nurse. Restraining limbs can cause fractures or dislocations against the powerful muscle contractions. After the seizure, position the client on their side to maintain airway patency.",
    s: "Emergency"
  },
  {
    q: "A nurse is caring for a client diagnosed with stage III colon cancer who is receiving chemotherapy. The client's white blood cell count is 1,800/mm³. Which precaution is most important?",
    o: ["Encourage the client to have visitors to maintain emotional well-being", "Implement neutropenic precautions including strict hand hygiene and avoiding fresh flowers and raw foods", "Administer live vaccines to boost the client's immune response", "Encourage the client to eat sushi and salads for protein and vitamins"],
    a: 1,
    r: "A WBC of 1,800/mm³ indicates leukopenia and places the client at high risk for infection (neutropenia). Neutropenic precautions include strict hand hygiene, private room, no fresh flowers or plants (harbour Aspergillus), no raw fruits/vegetables/meats, and monitoring for fever (may be the only sign of infection). Visitors should be limited and screened for illness. Live vaccines are contraindicated in immunosuppressed clients. Raw foods carry high bacterial contamination risk.",
    s: "Oncology"
  },
  {
    q: "A nurse is caring for a client receiving cisplatin chemotherapy who reports severe nausea and vomiting. Which antiemetic regimen does the nurse expect to be prescribed?",
    o: ["Bismuth subsalicylate (Pepto-Bismol) taken orally as needed", "Ondansetron (Zofran) combined with dexamethasone, administered before and after chemotherapy", "Ginger tea only, as natural remedies are preferred for chemotherapy nausea", "Metoclopramide after chemotherapy completion only"],
    a: 1,
    r: "Cisplatin is highly emetogenic. Best practice is to administer a 5-HT3 receptor antagonist (ondansetron) combined with dexamethasone (corticosteroid) before chemotherapy begins (prophylactically) and continue after. NK-1 receptor antagonists (aprepitant) may also be added. Bismuth subsalicylate is insufficient for chemotherapy-induced nausea. Ginger may be adjunctive but not primary treatment. Metoclopramide alone is inadequate for highly emetogenic regimens.",
    s: "Oncology"
  },
  {
    q: "A nurse is caring for a client with breast cancer who is receiving doxorubicin (Adriamycin). Which assessment is most critical during treatment?",
    o: ["Monitor liver function tests weekly", "Monitor for signs of cardiotoxicity including heart failure symptoms and obtain baseline echocardiogram", "Assess for hearing loss after each treatment", "Check serum calcium levels daily"],
    a: 1,
    r: "Doxorubicin is an anthracycline with a dose-dependent risk of irreversible cardiotoxicity leading to heart failure. A baseline echocardiogram or MUGA scan assesses left ventricular ejection fraction before treatment, and monitoring continues throughout therapy. Total lifetime dose must be tracked. Signs include dyspnea, tachycardia, peripheral edema, and fatigue. While hepatotoxicity can occur, cardiotoxicity is the most serious and unique concern. Hearing loss is associated with cisplatin, not doxorubicin.",
    s: "Oncology"
  },
  {
    q: "A nurse is providing education to a client who will begin radiation therapy for cervical cancer. Which information should the nurse include?",
    o: ["Radiation therapy does not cause fatigue or dietary changes", "Radiation effects are limited to the treatment day and cause no lasting skin changes", "Apply generous amounts of perfumed lotion to the treatment area to keep skin moisturised", "Skin in the treatment area may become red and irritated; avoid lotions, powders, and sun exposure to the area"],
    a: 3,
    r: "Radiation therapy causes cumulative skin changes in the treatment field including erythema, desquamation, and sensitivity. Clients should avoid lotions, powders, deodorants, and sun exposure to the treated area because these can intensify skin reactions. Skin changes develop over the treatment course and may persist weeks after completion. Fatigue is the most common systemic side effect. Dietary modifications may be needed depending on the treatment area and associated side effects.",
    s: "Oncology"
  },
  {
    q: "A nurse is caring for a client with lung cancer who develops a serum calcium of 3.4 mmol/L. Which symptom does the nurse anticipate?",
    o: ["Confusion, lethargy, constipation, and polyuria", "Muscle spasms, tetany, and tingling around the mouth", "Diarrhea and hyperactive deep tendon reflexes", "Peripheral edema and weight gain"],
    a: 0,
    r: "Hypercalcemia of malignancy (normal calcium 2.1–2.6 mmol/L) is common in squamous cell lung cancer, breast cancer, and multiple myeloma. Elevated calcium causes neurological depression (confusion, lethargy), decreased GI motility (constipation, nausea), polyuria from impaired renal concentrating ability, and cardiac effects (shortened QT interval). Muscle spasms and tetany occur with hypocalcemia. Treatment includes aggressive IV hydration with normal saline, bisphosphonates, and calcitonin.",
    s: "Oncology"
  },
  {
    q: "A nurse is caring for a client receiving chemotherapy who has developed mucositis with painful oral ulcers. Which intervention is most appropriate?",
    o: ["Encourage hot spicy foods to stimulate appetite", "Instruct the client to use an alcohol-based mouthwash for disinfection", "Provide oral care with a soft-bristle toothbrush and bland rinses such as normal saline or sodium bicarbonate", "Defer oral care until the ulcers heal to avoid further irritation"],
    a: 2,
    r: "Chemotherapy-induced mucositis requires gentle oral care with soft-bristle or foam toothbrushes and soothing rinses (normal saline or baking soda solution). This reduces bacterial colonization and promotes comfort. Alcohol-based mouthwashes cause pain and dry fragile mucosa. Hot and spicy foods irritate ulcerated tissue. Deferring oral care allows bacterial overgrowth, worsens infection risk, and delays healing. Cool bland soft foods and adequate hydration are also recommended.",
    s: "Oncology"
  },
  {
    q: "A nurse is preparing a client for a total knee replacement surgery. Which preoperative teaching is most important?",
    o: ["Advise the client to eat a large meal the morning of surgery", "Inform the client they will not need to perform any exercises after surgery", "Demonstrate postoperative exercises including ankle pumps, quad sets, and the use of an incentive spirometer", "Tell the client pain medication will not be available in the first 24 hours"],
    a: 2,
    r: "Preoperative teaching for joint replacement includes demonstrating exercises the client will perform postoperatively: ankle pumps to prevent deep vein thrombosis, quadriceps sets to strengthen muscles around the joint, and incentive spirometry to prevent atelectasis. Teaching before surgery improves compliance and outcomes because the client learns while pain-free and alert. Clients are typically NPO after midnight. Multimodal pain management begins immediately postoperatively to facilitate early mobilization.",
    s: "Perioperative"
  },
  {
    q: "A nurse is monitoring a client in the post-anaesthesia care unit (PACU) after abdominal surgery. The client's blood pressure drops from 128/78 to 88/54 mmHg and the heart rate increases from 76 to 112 bpm. What should the nurse suspect?",
    o: ["Dehydration from preoperative NPO status alone", "Normal recovery from general anaesthesia", "An adverse reaction to antiemetic medication", "Internal hemorrhage requiring immediate assessment and intervention"],
    a: 3,
    r: "Hypotension combined with tachycardia in the immediate postoperative period is the hallmark presentation of hypovolemic shock, most commonly from internal hemorrhage. The nurse should assess the surgical site and dressings, check drain output, monitor vital signs continuously, increase IV fluid rate, and notify the surgeon immediately. Normal anaesthesia recovery does not cause this degree of hemodynamic instability. While NPO status causes mild dehydration, the rapid change in vitals suggests active blood loss.",
    s: "Perioperative"
  },
  {
    q: "A nurse is caring for a client 6 hours after laparoscopic cholecystectomy who reports sharp pain in the right shoulder. What should the nurse explain?",
    o: ["The shoulder pain is referred pain caused by residual carbon dioxide gas irritating the diaphragm", "The shoulder pain indicates a surgical complication requiring reoperation", "The pain is caused by positioning during surgery and will require physiotherapy", "The client likely injured the shoulder while being transferred after surgery"],
    a: 0,
    r: "During laparoscopic surgery, carbon dioxide is insufflated into the abdomen to create a working space. Residual CO2 can irritate the phrenic nerve and diaphragm, causing referred pain to the shoulder. This is common and self-limiting, typically resolving within 24–72 hours. Walking and positioning on the left side with knees drawn up may help. This is not a surgical complication. While positioning injuries can occur, referred pain from CO2 is the most common explanation for post-laparoscopic shoulder pain.",
    s: "Perioperative"
  },
  {
    q: "A nurse is caring for a preoperative client who reports taking acetylsalicylic acid (ASA/aspirin) 81 mg daily. Why is this information important?",
    o: ["ASA has no effect on surgical outcomes", "ASA increases blood pressure during anaesthesia", "ASA causes hyperglycemia during the perioperative period", "ASA inhibits platelet aggregation and increases the risk of surgical bleeding"],
    a: 3,
    r: "Aspirin irreversibly inhibits cyclooxygenase, impairing platelet aggregation for the lifespan of the platelet (7–10 days). This significantly increases the risk of intraoperative and postoperative bleeding. Surgeons typically request ASA be stopped 7–10 days before elective surgery. The nurse must document all medications including over-the-counter drugs and herbal supplements. ASA does not directly cause hypertension or hyperglycemia. Failing to report ASA use can lead to hemorrhagic complications.",
    s: "Perioperative"
  },
  {
    q: "A nurse is assessing a postoperative client who had spinal anaesthesia. The client reports a severe headache that worsens when sitting up and improves when lying flat. What does the nurse suspect?",
    o: ["Post-dural puncture headache from cerebrospinal fluid leakage", "Migraine triggered by anaesthesia medications", "Increased intracranial pressure from a cerebral bleed", "Tension headache from postoperative stress"],
    a: 0,
    r: "A positional headache that worsens with upright positioning and improves when lying down is characteristic of a post-dural puncture (spinal) headache. It results from cerebrospinal fluid leaking through the dural puncture site, causing decreased intracranial pressure. Treatment includes bed rest, hydration, caffeine, analgesics, and if severe, an epidural blood patch. Migraine is not typically positional. Increased ICP headache worsens when lying down. Tension headaches are not position-dependent.",
    s: "Perioperative"
  },
  {
    q: "A nurse is caring for a client on the first postoperative day after abdominal surgery. The client has not used the incentive spirometer and the nurse auscultates diminished breath sounds bilaterally at the bases. What complication is developing?",
    o: ["Atelectasis from inadequate lung expansion", "Pneumothorax from surgical trauma", "Pulmonary embolism from deep vein thrombosis", "Pleural effusion from fluid overload"],
    a: 0,
    r: "Atelectasis (collapse of alveoli) is the most common postoperative pulmonary complication, typically developing within 24–48 hours. Causes include shallow breathing from pain, immobility, and anaesthesia effects. Diminished breath sounds at the bases indicate collapsed alveoli. Prevention and treatment include incentive spirometry every 1–2 hours, deep breathing and coughing exercises, early ambulation, and adequate pain management. Pneumothorax produces absent breath sounds unilaterally. PE presents with sudden dyspnea and tachycardia.",
    s: "Perioperative"
  },
  {
    q: "A nurse in the operating room notices that the surgical count of sponges at wound closure is incorrect. One sponge is missing. What should the nurse do?",
    o: ["Document the discrepancy and report it after the surgery is complete", "Immediately inform the surgeon, halt wound closure, and initiate a recount and search", "Assume the sponge was discarded and allow wound closure to proceed", "Ask another nurse to recount without informing the surgeon"],
    a: 1,
    r: "A retained surgical item is a never event and serious patient safety issue. When a count discrepancy is identified, the nurse must immediately inform the surgeon before wound closure is completed. The surgical team must conduct a thorough search of the operative field, drapes, and floor. An intraoperative radiograph may be needed. Documenting after the fact or assuming discarding allows a retained foreign body. The surgeon must be informed as part of the time-out and safe surgery checklist requirements.",
    s: "Perioperative"
  },
  {
    q: "A nurse is caring for a client with a femur fracture who is in skeletal traction. Which assessment finding requires immediate intervention?",
    o: ["The weights are resting on the floor", "The client reports mild discomfort at the pin insertion site", "The traction rope is in the pulley groove", "The client's foot on the affected side is in a neutral position"],
    a: 0,
    r: "Traction weights must hang freely at all times to maintain the prescribed pull and proper bone alignment. Weights resting on the floor eliminate the traction force, allowing bone fragments to shift and potentially causing further injury, pain, and delayed healing. The nurse must ensure weights hang freely, ropes are not frayed and are in pulley grooves, and the client maintains proper body alignment. Mild pin site discomfort is expected. Rope in the groove and neutral foot position are correct findings.",
    s: "Musculoskeletal"
  },
  {
    q: "A nurse is caring for a client who had a below-knee amputation 2 days ago. The client reports pain in the amputated foot. What should the nurse understand about this pain?",
    o: ["The client is confused and should be reoriented to the amputation", "Phantom limb pain is a real neurological phenomenon and should be treated with appropriate pain management", "The pain is psychosomatic and requires psychiatric referral", "Phantom pain does not exist and the client is seeking attention"],
    a: 1,
    r: "Phantom limb pain is a well-documented neurological phenomenon affecting up to 80% of amputees. It results from reorganization of neural pathways in the brain and spinal cord. The pain is real, not imaginary or attention-seeking. Treatment includes mirror therapy, gabapentin or pregabalin, transcutaneous electrical nerve stimulation (TENS), and desensitization techniques. Dismissing the client's pain is non-therapeutic, invalidating, and constitutes inadequate pain management.",
    s: "Musculoskeletal"
  },
  {
    q: "A nurse is caring for a client with a newly applied plaster cast on the right forearm. Which assessment finding indicates neurovascular compromise?",
    o: ["Warmth and slight swelling of the fingers on the casted arm", "Numbness and tingling in the fingers, capillary refill greater than 3 seconds, and inability to move fingers", "Mild itching under the cast", "Visible cast padding at the proximal and distal edges"],
    a: 1,
    r: "Neurovascular compromise from cast-related compartment syndrome is assessed using the 6 P's: Pain (disproportionate), Pallor, Pulselessness, Paresthesia (numbness/tingling), Paralysis (inability to move), and Poikilothermia (coolness). Capillary refill greater than 3 seconds indicates impaired circulation. The nurse must notify the provider immediately; the cast may need to be bivalved (cut in half). Slight warmth and mild itching are expected. Visible padding indicates proper cast application.",
    s: "Musculoskeletal"
  },
  {
    q: "A nurse is caring for a client with osteoporosis. Which teaching is most important for fall prevention?",
    o: ["Remove loose rugs, ensure adequate lighting, install grab bars in the bathroom, and wear non-skid footwear", "Recommend bed rest to prevent falls from occurring", "Encourage the client to move quickly to reduce time at risk for falling", "Advise the client that falls are unavoidable with osteoporosis"],
    a: 0,
    r: "Environmental modification is the cornerstone of fall prevention for clients with osteoporosis, who are at high risk for fractures with minimal trauma. Removing trip hazards, ensuring lighting, installing grab bars, and wearing proper footwear significantly reduce fall risk. Bed rest leads to further bone loss and deconditioning. Moving quickly increases fall risk. Falls are not inevitable; evidence-based prevention strategies including exercise programs, vision correction, medication review, and home safety modifications are effective.",
    s: "Musculoskeletal"
  },
  {
    q: "A nurse is assessing a client who reports low back pain radiating down the left leg with numbness in the foot. The client has difficulty dorsiflexing the left foot. Which condition should the nurse suspect?",
    o: ["Muscle strain from improper lifting technique", "Lumbar disc herniation compressing the sciatic nerve", "Osteoarthritis of the lumbar spine", "Urinary tract infection causing referred back pain"],
    a: 1,
    r: "Radiculopathy with pain radiating from the lower back down the leg (sciatica) combined with neurological deficits (numbness, difficulty with dorsiflexion indicating foot drop) strongly suggests lumbar disc herniation compressing a nerve root, typically at L4-L5 or L5-S1. Muscle strain causes localized pain without neurological deficits. Osteoarthritis may cause stiffness but typically not acute radiculopathy with motor deficits. UTI causes suprapubic or flank pain without neurological symptoms.",
    s: "Musculoskeletal"
  },
  {
    q: "A nurse is caring for a client who had an open reduction internal fixation (ORIF) of the right tibia. The client reports severe unrelenting pain that is not relieved by prescribed analgesics. The calf is tense and swollen. What should the nurse suspect?",
    o: ["Infection at the surgical site", "Normal postoperative swelling that will resolve with elevation", "Deep vein thrombosis requiring anticoagulation", "Compartment syndrome requiring emergency fasciotomy"],
    a: 3,
    r: "Severe pain disproportionate to the injury that is unrelieved by analgesics, combined with a tense swollen compartment, is the hallmark of acute compartment syndrome. This is an orthopedic emergency because increasing pressure within the fascial compartment compromises blood flow, leading to muscle and nerve death within 6 hours. Treatment is emergency fasciotomy. Elevation and ice do not resolve compartment syndrome. DVT causes edema but not typically tense compartments. Infection develops later and presents with warmth, erythema, and fever.",
    s: "Musculoskeletal"
  },
  {
    q: "A nurse is caring for an older adult client with a hip fracture who is awaiting surgery. The client asks the nurse to withhold information about the diagnosis from the family because it is too stressful for them. What should the nurse do?",
    o: ["Document the request and ignore it because family members always need to be informed", "Tell the family the diagnosis despite the client's wishes because they have a right to know", "Respect the client's autonomy and right to confidentiality while encouraging the client to share when ready", "Refuse to care for the client because the request creates an ethical conflict"],
    a: 2,
    r: "Client autonomy and confidentiality are fundamental ethical and legal principles. A competent adult has the right to decide who receives their health information, including family members. The nurse should respect this right, document the client's request, and gently explore the client's concerns. Encouraging the client to share information when ready supports both autonomy and family coping. Disclosing without consent violates privacy legislation (e.g., PHIPA in Ontario). The nurse cannot abandon care based on a confidentiality request.",
    s: "Ethics/Legal"
  },
  {
    q: "A nurse witnesses a colleague diverting narcotics by taking controlled substances from the medication dispensing system but not administering them to clients. What is the nurse's legal and ethical obligation?",
    o: ["Report the observation immediately to the nurse manager and follow the facility's reporting protocol", "Confront the colleague privately and ask them to stop", "Ignore the situation to avoid conflict with a coworker", "Wait to see if the behaviour continues before reporting"],
    a: 0,
    r: "Narcotic diversion is a serious legal violation and patient safety issue. The nurse has an ethical and legal obligation to report immediately through proper channels (nurse manager, charge nurse, or the facility's reporting system). Failure to report makes the observing nurse complicit and liable. Private confrontation allows continued diversion and does not protect patients. Ignoring the situation constitutes negligence. Waiting to gather more evidence delays protection of patients who may be receiving inadequate pain management.",
    s: "Ethics/Legal"
  },
  {
    q: "A nurse is providing care to a client who is a Jehovah's Witness and has signed an advance directive refusing blood transfusions. The client is hemorrhaging and requires a blood transfusion to survive. What should the nurse do?",
    o: ["Ask the family to override the client's decision", "Administer the blood transfusion because preserving life overrides the advance directive", "Respect the client's advance directive, ensure comfort measures, and notify the healthcare provider of the client's wishes", "Delay the decision until the client becomes unconscious and then transfuse"],
    a: 2,
    r: "A competent adult's advance directive is a legally binding document that must be respected. The right to refuse treatment, including life-saving treatment, is protected by law regardless of the healthcare team's disagreement. The nurse must honour the directive, provide alternative interventions, ensure the client is comfortable, and notify the provider. Administering blood against the client's documented wishes constitutes battery. Family members cannot override a competent client's directive. Waiting for unconsciousness to override the directive is unethical and illegal.",
    s: "Ethics/Legal"
  },
  {
    q: "A nurse accidentally administers the wrong dose of medication to a client. The client shows no adverse effects. What is the nurse's first action?",
    o: ["Wait 24 hours to see if the client develops any problems before reporting", "Document the correct dose was given and do not report the error", "Tell only the charge nurse and request they keep it confidential", "Assess the client, notify the healthcare provider, and complete an incident report"],
    a: 3,
    r: "All medication errors must be reported immediately regardless of whether harm occurred. The nurse must first assess the client for any effects, then notify the healthcare provider who may order monitoring or interventions. An incident report must be completed per facility policy. Incident reports are for quality improvement and are not placed in the client's chart. Concealing errors is dishonest, unethical, and potentially harmful. Delayed reporting could compromise client safety if monitoring is needed.",
    s: "Ethics/Legal"
  },
  {
    q: "A nurse is caring for a client who is being discharged. The client does not speak English and requires discharge instructions. An interpreter is not immediately available. The client's 10-year-old child offers to translate. What should the nurse do?",
    o: ["Use the child to translate since no other option is available", "Wait for a certified medical interpreter and do not use the child to relay medical information", "Provide written instructions in English and assume the client will find a translator later", "Use hand gestures and pictures to communicate the discharge instructions fully"],
    a: 1,
    r: "Using children as medical interpreters is inappropriate because they may not accurately translate complex medical terminology, they may omit or alter sensitive information, and it places an unfair emotional burden on the child. Professional medical interpreters ensure accuracy, confidentiality, and cultural sensitivity. Telephone and video interpretation services are available 24/7 in most healthcare settings. Providing English-only written materials does not meet communication standards. While visual aids can supplement teaching, they cannot replace proper interpretation for discharge instructions.",
    s: "Ethics/Legal"
  },
  {
    q: "A nurse is asked by a police officer to provide a blood sample from an unconscious client involved in a motor vehicle collision to test for alcohol levels. No consent or court order is presented. What should the nurse do?",
    o: ["Draw the blood and give it to the officer if the nurse suspects the client was drinking", "Draw the blood sample immediately because the police have authority in criminal investigations", "Decline the request and explain that a court order or client consent is required before releasing the sample", "Contact the client's family for consent to draw the blood"],
    a: 2,
    r: "Without a court order, warrant, or the client's informed consent, the nurse cannot draw blood or release health information to law enforcement. Client rights to privacy and bodily integrity are protected by law. An unconscious client cannot provide consent. Family members cannot consent to forensic evidence collection. The nurse should inform the officer of the legal requirements and document the interaction. Complying without proper legal authority could result in disciplinary action, legal liability, and violation of client rights.",
    s: "Ethics/Legal"
  },
  {
    q: "A nurse is caring for a terminally ill client who asks the nurse to help them die. The client is in significant pain despite medication adjustments. How should the nurse respond?",
    o: ["Tell the client they should not talk about dying and change the subject", "Agree to help the client and increase the opioid dose beyond what is prescribed", "Acknowledge the client's suffering, advocate for improved pain management, and consult the palliative care team", "Ignore the request and continue routine care without addressing the statement"],
    a: 2,
    r: "When a client expresses a desire to die, the nurse should respond with empathy, explore the underlying reasons (usually inadequate symptom management, fear, or loss of dignity), and advocate aggressively for improved palliative care. Many clients who express this wish have undertreated pain or psychosocial distress that can be addressed. Increasing medication beyond orders is outside the nurse's scope and illegal. Dismissing the client's feelings is non-therapeutic. Ignoring the request misses an opportunity to provide critical psychosocial and spiritual support.",
    s: "Ethics/Legal"
  },
  {
    q: "A nurse is working on a medical unit and receives a request to delegate the task of feeding a client who has dysphagia to a personal support worker (PSW). What should the nurse do?",
    o: ["Assess the client's swallowing ability first and provide specific instructions about thickened fluid consistency and positioning before delegating", "Delegate the task without additional instruction since feeding is a basic care task", "Refuse to delegate because feeding any client is always a nursing responsibility", "Ask the PSW to assess the client's swallowing and decide the best approach independently"],
    a: 0,
    r: "Feeding a client with dysphagia can be delegated to a PSW but only after the nurse assesses the client's swallowing ability and provides specific instructions about diet texture, fluid consistency (thickened liquids), proper positioning (upright at 90 degrees), pacing, and signs of aspiration to watch for. Delegating without instruction puts the client at risk for aspiration pneumonia. Feeding is a basic care task but dysphagia adds complexity requiring nursing assessment. PSWs cannot independently assess swallowing capacity.",
    s: "Delegation"
  },
  {
    q: "A nurse is delegating care for four clients to an unregulated care provider (UCP). Which task is outside the UCP's scope and must be retained by the nurse?",
    o: ["Assessing a client's wound for signs of infection and determining if the treatment plan needs modification", "Obtaining vital signs on a stable client as directed by the nurse", "Assisting a client with bathing and personal hygiene", "Transporting a stable client to the radiology department by wheelchair"],
    a: 0,
    r: "Wound assessment and clinical judgment about treatment plan modifications require professional nursing knowledge, critical thinking, and clinical decision-making that cannot be delegated to unregulated care providers. The five rights of delegation are: right task, right circumstance, right person, right direction/communication, and right supervision. UCPs can perform tasks such as vital signs collection, hygiene assistance, and transport for stable clients. The nurse retains responsibility for assessment, evaluation, and clinical judgment.",
    s: "Delegation"
  },
  {
    q: "A nurse is supervising a newly hired licensed practical nurse (LPN) who is caring for a client with a complex wound requiring negative-pressure wound therapy (NPWT). The LPN states they have never used this equipment before. What should the nurse do?",
    o: ["Provide hands-on training and direct supervision until the LPN demonstrates competence with the equipment", "Allow the LPN to figure out the equipment independently since they are licensed", "Assign the task to a different nurse and never allow the LPN to learn", "Instruct the LPN to watch an online video and then perform the procedure unsupervised"],
    a: 0,
    r: "When a delegatee lacks competence for a specific task, the delegating nurse must provide education, demonstration, and supervised practice before allowing independent performance. Licensure does not guarantee competence with all equipment. Allowing independent use without training risks client harm. While reassigning is a temporary solution, it prevents skill development. Online videos supplement but do not replace hands-on supervised training for complex equipment. The nurse retains accountability for ensuring competence before delegating.",
    s: "Delegation"
  },
  {
    q: "A nurse is working in a long-term care facility and delegates blood glucose monitoring to a personal support worker (PSW). The PSW reports a blood glucose of 2.8 mmol/L. What should the nurse do?",
    o: ["Thank the PSW and document the result without further action", "Verify the result, assess the client for hypoglycemia symptoms, and intervene with fast-acting glucose immediately", "Ask the PSW to recheck the glucose in 1 hour", "Instruct the PSW to give the client juice without the nurse assessing first"],
    a: 1,
    r: "A blood glucose of 2.8 mmol/L is critically low and requires immediate nursing assessment and intervention. While blood glucose monitoring can be delegated, interpretation and clinical response cannot. The nurse must verify the result, assess for hypoglycemia symptoms (diaphoresis, tremor, confusion), and administer fast-acting glucose per the hypoglycemia protocol. Documenting without action is negligent. Delaying rechecking risks seizure or loss of consciousness. The PSW should not independently manage hypoglycemia treatment.",
    s: "Delegation"
  },
  {
    q: "A charge nurse is making shift assignments on a busy surgical unit. A registered nurse (RN) asks the charge nurse to reassign a client because the RN does not agree with the client's religious practices. How should the charge nurse respond?",
    o: ["Report the RN to the regulatory body without discussing the issue", "Immediately reassign the client to accommodate the RN's preference", "Allow all nurses to choose clients based on personal preferences", "Explain that personal beliefs do not constitute grounds for refusing a client assignment and the RN must provide non-discriminatory care"],
    a: 3,
    r: "Nurses are ethically and legally obligated to provide non-discriminatory care regardless of the client's religion, ethnicity, gender identity, or lifestyle. Personal disagreement with a client's beliefs is not a valid reason for refusing an assignment. The charge nurse should explain this professional obligation, offer support in providing culturally sensitive care, and if needed, refer to the code of ethics. Immediate reassignment reinforces discrimination. Reporting to the regulatory body without first educating and addressing the issue is premature.",
    s: "Delegation"
  },
  {
    q: "A nurse is performing a medication administration check. The medication administration record indicates metoprolol 25 mg PO, but the pharmacy has dispensed metoprolol 50 mg tablets. What should the nurse do?",
    o: ["Hold the medication until the next shift and let them deal with it", "Cut the 50 mg tablet in half and administer it", "Administer the 50 mg tablet and document the discrepancy", "Contact the pharmacy to obtain the correct dose and do not administer until the discrepancy is resolved"],
    a: 3,
    r: "When there is a discrepancy between the prescribed dose and what is dispensed, the nurse must resolve it before administration. Not all tablets can be safely split (enteric-coated, extended-release, or scored tablets have specific splitting rules). The nurse should contact the pharmacy for the correct formulation. Administering the wrong dose is a medication error. Holding a cardiac medication without communicating the issue to the provider and pharmacy may compromise client care. This is part of the right dose verification in medication safety checks.",
    s: "Safety"
  },
  {
    q: "A nurse is admitting a client to the hospital and asks the client to state their name and date of birth. The client provides a name that does not match the armband. What should the nurse do?",
    o: ["Ask a family member to confirm the client's identity", "Proceed with admission using the armband information since it was applied at registration", "Verify the client's identity using two identifiers, recheck the armband, and resolve the discrepancy before proceeding with any care", "Apply a new armband with the name the client provided without further verification"],
    a: 2,
    r: "Correct client identification using at least two independent identifiers (name and date of birth, medical record number) is a foundational patient safety practice. A discrepancy between the client's stated identity and the armband must be resolved before any care, medication administration, or procedures. Proceeding with mismatched identifiers risks wrong-patient errors. Family confirmation alone is insufficient as the sole verification method. Applying a new armband without verifying the cause of discrepancy may perpetuate an error.",
    s: "Safety"
  },
  {
    q: "A nurse finds a client on the floor next to the bed. The client states they slipped while getting up to use the bathroom. What should the nurse do first?",
    o: ["Call the healthcare provider before assessing the client", "Help the client back into bed immediately to prevent further falls", "Assess the client for injuries before moving them", "Complete an incident report and then check the client"],
    a: 2,
    r: "After a fall, the nurse must assess the client for injuries before moving them. Moving a client with a potential spinal injury, fracture, or head injury can cause further harm. Assessment includes level of consciousness, pain, ability to move extremities, visible injuries, and vital signs. Once assessed, the client can be safely assisted. Notifying the provider occurs after assessment findings are available. The incident report is completed after the client is safe and assessed. Bed rails, lighting, call bell placement, and fall risk should be reassessed and documented.",
    s: "Safety"
  },
  {
    q: "A nurse is caring for a client who has been prescribed a vest restraint. Which action ensures safe restraint application?",
    o: ["Check the restraint once per shift to minimise disturbance to the client", "Apply the restraint as tightly as possible to prevent the client from removing it", "Tie the restraint to the side rail so it moves with the bed position", "Check circulation and skin integrity every 2 hours, release the restraint for range of motion, and offer toileting and nutrition"],
    a: 3,
    r: "Safe restraint use requires neurovascular checks every 1–2 hours (circulation, sensation, movement, skin integrity), periodic release for range of motion, toileting, nutrition, and repositioning. Restraints must be tied with quick-release knots to a non-movable part of the bed frame, not side rails, because lowering rails can tighten the restraint and cause strangulation. Tight application causes skin breakdown and compromises circulation. Infrequent checking increases risk of injury and violates safety standards and regulations.",
    s: "Safety"
  },
  {
    q: "A nurse is preparing to administer a medication via a client's nasogastric (NG) tube. What should the nurse do before administering the medication?",
    o: ["Flush the tube with cola to ensure patency", "Administer the medication without checking placement since the tube was verified on insertion", "Verify NG tube placement by checking pH of aspirate and confirming the tube marking at the naris", "Crush all medications together and administer them simultaneously through the tube"],
    a: 2,
    r: "NG tube placement must be verified before each use to ensure the tube has not migrated into the lungs. Best practice is to check the pH of gastric aspirate (should be 5.5 or less) and confirm the tube marking at the naris matches the documented measurement. Tube position can change with movement, coughing, or vomiting. Administering medication into a displaced tube causes aspiration. Cola is acidic and not an appropriate flush; normal saline or water is used. Medications should be given separately to prevent interactions and clogging.",
    s: "Safety"
  }
];
