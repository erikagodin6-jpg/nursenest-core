const pg = require('pg');
const crypto = require('crypto');

const BATCH_ID = `paramedic-fill2-${Date.now()}`;
function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
function hashStem(s) { return crypto.createHash('md5').update(s.toLowerCase().trim()).digest('hex'); }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function ri(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

function makeRationale(domain, sub, correct, wrongs, slug) {
  return `## Correct Answer Analysis

The correct answer is "${correct}". This represents the most appropriate intervention based on current evidence-based prehospital practice guidelines for ${sub.toLowerCase()} within ${domain}.

In the emergency prehospital setting, paramedics must rapidly assess patients and prioritize interventions based on clinical presentation. This clinical vignette tests the candidate's ability to identify the highest-priority action when managing a ${sub.toLowerCase()} scenario. The correct response follows established protocols from the American Heart Association (AHA), National Association of EMS Physicians (NAEMSP), International Trauma Life Support (ITLS), and Prehospital Trauma Life Support (PHTLS) guidelines.

The pathophysiological rationale for choosing this answer centers on understanding the underlying mechanism of the patient's presentation. When vital signs, assessment findings, and clinical context align as described in the vignette, the correct intervention directly addresses the most immediate physiological derangement. This may involve airway management, circulatory support, pharmacological intervention, or rapid transport decision-making depending on the specific clinical scenario.

Key considerations that make this the best answer include: the timing and urgency of the intervention, alignment with the primary survey priorities (ABCDE approach), evidence-based efficacy of the treatment, and the specific clinical indicators present in the patient's presentation.

## Why Each Incorrect Answer Is Wrong

**"${wrongs[0]}"** — While this may seem like a reasonable option, it is incorrect in this specific clinical context. This answer either addresses a lower-priority concern, represents an intervention that would be appropriate at a different stage of care, or reflects an outdated practice that has been superseded by current evidence. Candidates who select this answer typically confuse the priority hierarchy or fail to identify the most critical finding in the patient's presentation. In prehospital care, understanding the difference between "correct intervention, wrong timing" and "best immediate action" is essential for both exam success and patient outcomes.

**"${wrongs[1]}"** — This distractor is designed to attract candidates who have partial knowledge of the topic. While the intervention described may have clinical merit in a related scenario, the specific patient presentation in this vignette makes it suboptimal. Common errors include: applying hospital-based protocols to the prehospital setting, reversing the order of assessment and treatment steps, or selecting an intervention that is appropriate for a different pathology with similar presenting symptoms. The key differentiating factors in this scenario include the vital sign pattern, the specific assessment findings, and the clinical timeline described.

**"${wrongs[2]}"** — This option represents a common misconception or a less-preferred alternative that candidates may select if they have not thoroughly reviewed current guidelines. While there may be limited circumstances where this approach is used, the clinical scenario presented here clearly indicates a different course of action. Selecting this answer demonstrates either unfamiliarity with current treatment algorithms, confusion between similar clinical presentations, or failure to integrate all the clinical data provided in the vignette.

## Clinical Pearl

Evidence-based management of ${sub.toLowerCase()} requires integration of assessment findings, vital sign interpretation, and protocol-based decision-making. Key clinical pearls include: (1) Always complete a systematic primary survey before initiating definitive treatment. (2) Trending vital signs provides more clinical value than a single measurement. (3) Treatment protocols may vary by jurisdiction — always follow local medical direction. (4) Documentation of findings, interventions, and patient response is critical for continuity of care and quality improvement. (5) Reassessment after every intervention is mandatory to evaluate treatment effectiveness.

## How Exam Writers Try to Trick You

This question uses several common exam-writing techniques to test depth of knowledge: (1) Including interventions that are correct but not highest priority — forcing the candidate to rank rather than simply recognize correct answers. (2) Using clinical findings that could suggest multiple conditions — testing differential diagnosis skills. (3) Including vital sign values that require interpretation in the clinical context. (4) Placing the correct answer in a randomized position to prevent pattern recognition. The key to answering correctly is to read the entire clinical vignette, identify ALL relevant findings, and select the answer that addresses the most immediate clinical priority based on the ABCDE approach.

## Intervention Considerations and Priority Hierarchy

The management priority for this scenario follows: (1) Scene safety and appropriate PPE. (2) Primary assessment using ABCDE. (3) Address immediate life threats. (4) Targeted interventions based on clinical findings. (5) Reassessment after each intervention. (6) Transport decision including destination selection. (7) Ongoing monitoring and documentation during transport. (8) Structured handover communication at the receiving facility.

## Scenario Variations

If the patient's presentation differed (e.g., different vital signs, altered mental status, additional injuries/conditions), the correct answer might change significantly. Understanding how clinical variables affect decision-making is essential for adaptive patient care and exam success.

Learn more: /paramedic/lessons/${slug}`;
}

const AGES = [22,25,28,31,34,37,42,45,48,52,55,58,61,64,67,71,74,78,82,86];
const SEX = ['male','female'];

const TEMPLATES = {
  "OB Emergencies": [
    { sub: "Normal Delivery", gen: () => {
      const s = [
        { stem: `A 32-year-old G4P3 at 39 weeks delivers a baby in the ambulance. The newborn's head has delivered with clear amniotic fluid. After suctioning, you note the baby's color is dusky but improving. The next contraction occurs. What is the priority action?`, opts: ["Guide the head downward gently to deliver the anterior shoulder, then upward for the posterior shoulder", "Wait for the next contraction and apply fundal pressure to assist delivery", "Apply traction to the baby's head to expedite delivery before the contraction ends", "Clamp the cord immediately and prepare to cut before shoulder delivery"], c: 0, d: 2 },
        { stem: `A 26-year-old primigravida at 41 weeks has been pushing for 30 minutes. The perineum is bulging and the baby's head is crowning with each contraction. You are the only ALS provider. What technique prevents perineal tearing during delivery?`, opts: ["Apply gentle counterpressure to the baby's head during crowning (modified Ritgen maneuver) to control the rate of delivery", "Perform an episiotomy with surgical scissors to widen the opening", "Push the baby's head back in between contractions to slow the delivery", "Allow the baby to deliver rapidly to minimize time of head compression"], c: 0, d: 2 },
        { stem: `After delivering a full-term newborn in the field, the baby is crying vigorously, pink, with a heart rate of 152. The placenta has not yet delivered. It has been 15 minutes since birth. What is the appropriate management of the placenta?`, opts: ["Do not pull on the cord; allow the placenta to deliver spontaneously with gentle traction only when signs of placental separation appear (cord lengthening, gush of blood, uterine firming)", "Apply steady firm traction on the umbilical cord to expedite placental delivery", "Manually extract the placenta by inserting your hand into the uterus", "Transport immediately without waiting for placental delivery if it has not delivered within 10 minutes"], c: 0, d: 2 },
        { stem: `During a field delivery, you notice the amniotic fluid is thick green (meconium-stained). The baby delivers and is crying vigorously with good tone and a heart rate of 148. Per current NRP guidelines, what action is indicated for this vigorous meconium-exposed newborn?`, opts: ["Routine care: dry, stimulate, and suction the mouth and nose as needed; intubation for tracheal suctioning is NOT recommended for vigorous neonates", "Immediately intubate and suction the trachea before any stimulation", "Suction the nose before delivery of the shoulders to prevent aspiration", "Skip all suctioning as meconium is benign when the baby is vigorous"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
    { sub: "Preterm Labor", gen: () => {
      const wks = pick([24,26,28,30,32,34]);
      const s = [
        { stem: `A ${pick([20,24,28,32])}-year-old G2P1 at ${wks} weeks gestation presents with regular contractions every 3 minutes, cervical dilation of 4 cm, and intact membranes. The nearest hospital with a NICU is 35 minutes away. What is the priority prehospital management?`, opts: [`Position in left lateral recumbent, administer oxygen if SpO2 <94%, establish IV access, prepare for potential field delivery of a premature infant, and transport to the facility with NICU capability`, "Administer tocolytics (terbutaline) to stop labor in the field", "Transport to the nearest facility regardless of NICU availability", "Instruct the patient to resist the urge to push to delay delivery"], c: 0, d: 3 },
        { stem: `You are transporting a ${pick([22,26,30])}-year-old at ${wks} weeks when she delivers a premature infant. The baby weighs approximately ${pick([800,1000,1200,1500])}g, is making weak respiratory effort, and has central cyanosis. What is the critical concern for premature neonatal management?`, opts: ["Thermoregulation is paramount — wrap in plastic wrap or bag from neck down without drying first (for <32 weeks), provide gentle PPV if needed, and avoid excessive oxygen", "Aggressively dry and stimulate the infant as for full-term neonates", "Administer surfactant via ETT in the field for premature lungs", "Delay resuscitation until arrival at the hospital for NICU team assessment"], c: 0, d: 4 },
      ];
      return pick(s);
    }},
    { sub: "Eclampsia", gen: () => {
      const s = [
        { stem: `A 22-year-old G1P0 at 34 weeks presents with a generalized tonic-clonic seizure witnessed by family. She has had no prenatal care. On arrival, the seizure has stopped. BP 198/118, HR 108, RR 22. She is postictal but responsive to pain. Bilateral pedal edema and hyperreflexia are noted. What is the most critical medication to administer?`, opts: ["Magnesium sulfate 4-6g IV over 15-20 minutes as loading dose for seizure prevention and treatment in eclampsia", "Diazepam 10 mg IV to prevent seizure recurrence", "Labetalol 20 mg IV to rapidly reduce blood pressure as the first priority", "Phenytoin 15-20 mg/kg IV as a long-acting anticonvulsant"], c: 0, d: 3 },
        { stem: `A 35-year-old G1P0 at 37 weeks is being treated for eclampsia with magnesium sulfate. After receiving 6g IV, her respiratory rate drops to 8/min, deep tendon reflexes are absent, and she becomes drowsy. What complication has occurred and what is the treatment?`, opts: ["Magnesium toxicity — administer calcium gluconate 1g IV over 3 minutes as an antidote and support ventilations", "The magnesium is working as expected; monitor and continue infusion", "Administer additional magnesium sulfate 2g IV for persistent seizure risk", "Intubate immediately without any pharmacological intervention"], c: 0, d: 4 },
        { stem: `A 28-year-old at 30 weeks is being transported for severe preeclampsia. She suddenly complains of severe headache and blurred vision, then has a generalized seizure lasting 90 seconds. After the seizure, fetal heart tones decrease to 80 bpm (baseline was 145). What should you understand about fetal bradycardia following eclamptic seizures?`, opts: ["Transient fetal bradycardia for up to 3-5 minutes is expected following eclamptic seizures; it typically recovers spontaneously with maternal resuscitation (left lateral positioning, O2, IV fluids)", "Fetal bradycardia after seizure indicates immediate need for perimortem cesarean section in the field", "The fetus has already suffered irreversible brain injury if heart rate drops below 100", "Fetal bradycardia should be treated with maternal epinephrine administration"], c: 0, d: 5 },
      ];
      return pick(s);
    }},
    { sub: "Postpartum Hemorrhage", gen: () => {
      const s = [
        { stem: `A 36-year-old G5P4 delivered twins 10 minutes ago. She is now experiencing heavy vaginal bleeding estimated at 1000 mL. The uterus is large, soft, and boggy at 3 fingerbreadths above the umbilicus. Vital signs: BP 86/52, HR 142, RR 28, SpO2 96%. What is the primary cause and management?`, opts: ["Uterine atony is the most common cause of PPH; perform continuous firm uterine massage, administer oxytocin if available, establish bilateral large-bore IVs for crystalloid resuscitation", "Cervical laceration requiring surgical repair — pack the vagina tightly", "Retained placental fragments requiring manual extraction", "Uterine inversion requiring gentle repositioning"], c: 0, d: 3 },
        { stem: `After a field delivery, a 29-year-old is bleeding from an obvious perineal laceration despite a firm, contracted uterus. The laceration is actively bleeding and blood loss is estimated at 600 mL. BP 102/64, HR 118. What is the most appropriate prehospital management of the laceration?`, opts: ["Apply direct pressure to the perineal laceration with sterile gauze, elevate the pelvis if possible, establish IV access for fluid support, and transport for surgical repair", "Suture the laceration in the field using a local anesthetic", "Pack the vagina to tamponade the perineal bleeding", "Apply a tourniquet to the upper thigh to reduce blood flow"], c: 0, d: 2 },
        { stem: `A 33-year-old delivered 20 minutes ago. Despite aggressive uterine massage and 20 units of oxytocin in 1L NS infusing, the uterus remains atonic with ongoing hemorrhage. Total estimated blood loss is now 1800 mL. She is altered, BP 70/40, HR 156. What is the transfusion threshold concern?`, opts: ["Massive hemorrhage protocol activation is indicated; crystalloid alone is insufficient for Class III-IV hemorrhagic shock; consider TXA 1g IV if within 3 hours, and transport to the closest facility capable of blood product transfusion and surgical intervention", "Continue crystalloid resuscitation up to 6 liters before considering blood products", "Administer vasopressors as primary treatment for hemorrhagic shock", "Clamp the uterine arteries externally to stop the bleeding"], c: 0, d: 5 },
      ];
      return pick(s);
    }},
    { sub: "Cord Prolapse", gen: () => {
      const s = [
        { stem: `A ${pick([24,28,32,36])}-year-old at ${pick([32,34,36,38])} weeks has spontaneous rupture of membranes. As you examine her, you see the umbilical cord presenting through the cervix ahead of the baby's head. FHR is 70 bpm. Your partner is driving and you are alone in the patient compartment. What position should you place the patient in?`, opts: ["Exaggerated Trendelenburg or knee-chest position to use gravity to shift the presenting part off the cord while you elevate it with your hand", "Left lateral recumbent position only, with no manual cord intervention", "Supine flat position for best assessment access during transport", "Sitting upright to facilitate breathing and reduce anxiety"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
    { sub: "Ectopic Pregnancy", gen: () => {
      const s = [
        { stem: `A ${pick([22,26,30,34])}-year-old female with an IUD (intrauterine device) presents with sudden left lower quadrant pain radiating to the shoulder, and vaginal spotting. Her last menstrual period was 6 weeks ago. She feels faint when standing. BP 82/48 supine, HR 136, RR 24, skin pale and diaphoretic. What is the clinical significance of the shoulder pain?`, opts: ["Referred pain from diaphragmatic irritation by intraperitoneal blood (Kehr sign) suggests ruptured ectopic pregnancy with significant hemoperitoneum", "Musculoskeletal strain from recent physical activity", "Cardiac referred pain suggesting acute coronary syndrome", "Gallbladder disease causing referred shoulder pain via the phrenic nerve"], c: 0, d: 4 },
        { stem: `A 28-year-old female with known history of pelvic inflammatory disease (PID) presents with right adnexal pain, positive pregnancy test, and syncope. BP 76/44, HR 148. On exam, she has significant abdominal rigidity and rebound tenderness. What risk factor and expected finding guide your field impression?`, opts: ["Prior PID is a major risk factor for ectopic pregnancy; peritoneal signs with hemodynamic instability suggest ruptured ectopic with hemoperitoneum requiring emergent surgical intervention", "PID history makes appendicitis the most likely diagnosis", "The positive pregnancy test is likely a false positive due to PID", "Ovarian torsion is more likely than ectopic in patients with PID history"], c: 0, d: 4 },
      ];
      return pick(s);
    }},
    { sub: "Placental Abruption", gen: () => {
      const s = [
        { stem: `A ${pick([26,30,34,38])}-year-old at 36 weeks with a history of cocaine use presents with sudden onset severe constant abdominal pain and dark vaginal bleeding. The uterus is tender, rigid, and hypertonic on palpation. FHR is 90 bpm with late decelerations. BP 88/54, HR 138. Besides rapid transport, what key intervention addresses the most likely diagnosis?`, opts: ["Establish bilateral large-bore IVs and administer aggressive crystalloid resuscitation for suspected placental abruption with hemorrhagic shock; left lateral positioning and high-flow oxygen for fetal benefit", "Perform a vaginal examination to assess cervical dilation and source of bleeding", "Administer tocolytics to relax the hypertonic uterus", "Apply external fetal monitoring and wait for contractions to assess labor pattern"], c: 0, d: 3 },
        { stem: `A 32-year-old at 34 weeks presents with painless bright red vaginal bleeding that started 30 minutes ago. The uterus is soft, non-tender, and the baby is in a high (unengaged) position. FHR is 140 and regular. BP 112/72, HR 94. This presentation is most consistent with which condition, and what intervention should be AVOIDED?`, opts: ["Placenta previa; avoid vaginal or digital cervical examination as it may cause catastrophic hemorrhage from disruption of the low-lying placenta", "Placental abruption; avoid IV fluid administration", "Normal labor with bloody show; avoid any intervention and await spontaneous delivery", "Vasa previa; avoid all oxygen administration"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
  ],
  "Operations/EMS Systems": [
    { sub: "Scene Safety", gen: () => {
      const s = [
        { stem: `You arrive at a multi-vehicle accident on a rural highway. One vehicle is on its roof with fuel leaking. A second vehicle is on fire with occupants still inside. Power lines are down across the roadway near the first vehicle. What is the correct order of priorities for scene management?`, opts: ["Establish a perimeter outside the downed power line zone, request fire department for suppression and utility company for power isolation, and do NOT approach vehicles until the scene is made safe by fire/hazmat", "Approach the burning vehicle first to rescue occupants while avoiding the power lines", "Use the ambulance to push the power lines away from the roadway", "Extinguish the car fire with the ambulance fire extinguisher and then assess patients"], c: 0, d: 2 },
        { stem: `You respond to a report of a child bitten by a dog. On arrival, an aggressive large dog is loose in the front yard where the child is sitting on the ground crying. The child has visible blood on their arm. What is the appropriate action?`, opts: ["Remain in the ambulance, request animal control or law enforcement to secure the dog before approaching the patient", "Exit the ambulance and slowly approach the child while avoiding eye contact with the dog", "Attempt to distract the dog with food from your lunch bag while your partner retrieves the child", "Honk the ambulance horn repeatedly to scare the dog away"], c: 0, d: 1 },
        { stem: `During a response to a known drug house for an overdose, you notice that the white powder residue on surfaces could be fentanyl or carfentanil. What PPE precautions are appropriate?`, opts: ["Don nitrile gloves (double-gloving recommended), avoid disturbing powder residues, avoid touching your face, consider N95 respirator if powder is aerosolized, and request law enforcement clearance before entry", "Standard gloves only are sufficient for fentanyl exposure concerns", "Full Level A hazmat suit is required for all fentanyl exposure scenes", "No additional PPE is needed since dermal fentanyl absorption is a myth"], c: 0, d: 2 },
      ];
      return pick(s);
    }},
    { sub: "MCI and Triage", gen: () => {
      const s = [
        { stem: `You are performing SALT (Sort, Assess, Lifesaving Interventions, Treatment/Transport) triage at an active shooter incident. The first step in SALT is a global sort. How is global sorting performed?`, opts: ["Give a verbal command: 'Everyone who can walk, move to this area.' Walking patients are assigned MINIMAL (GREEN). Remaining patients are assessed individually starting with those who are still/obviously injured", "Assess each patient individually starting with the closest patient to you", "Sort patients by age — children first, then adults, then elderly", "Assign triage categories based solely on mechanism of injury"], c: 0, d: 3 },
        { stem: `At an MCI, you encounter a patient who is not walking, is breathing at 32/min after opening the airway, has a radial pulse present, and follows simple commands when instructed. Under the START triage algorithm, what category does this patient receive?`, opts: ["YELLOW (Delayed) — the patient is breathing (though tachypneic), has adequate perfusion (radial pulse present), and follows commands (adequate mental status)", "RED (Immediate) — the respiratory rate above 30 classifies as immediate", "GREEN (Minor) — the patient follows commands indicating minor injuries", "BLACK (Expectant) — respiratory distress with altered mentation"], c: 0, d: 3 },
        { stem: `As incident commander at an MCI, you must establish the NIMS/ICS organizational structure. Which section is responsible for tracking and accounting for all personnel operating on the scene?`, opts: ["Planning Section — responsible for tracking resources, maintaining personnel accountability, and developing the Incident Action Plan", "Operations Section — responsible for tactical operations only", "Logistics Section — responsible for supplies and equipment only", "Finance/Administration Section — responsible for costs only"], c: 0, d: 3 },
        { stem: `During an MCI, the medical branch director reports that the closest hospital ED is on diversion and cannot accept additional patients. Three RED patients need immediate transport. What is the most appropriate decision?`, opts: ["Distribute patients across multiple hospitals based on capability and capacity; contact medical control or the hospital for guidance — a hospital on diversion may still accept critical MCI patients with notification", "Transport all three RED patients to the diverted hospital since they are the closest", "Hold all patients on scene until the hospital comes off diversion", "Downgrade the RED patients to YELLOW to match available hospital capacity"], c: 0, d: 3 },
        { stem: `You arrive first on scene at a building collapse with an estimated 50+ casualties. No other emergency units have arrived. What is the correct initial action per NIMS/ICS?`, opts: ["Assume Incident Commander role, transmit a brief size-up report (conditions, estimated casualties, hazards), establish command post, request additional resources, and begin rapid triage", "Begin treating the most critically injured patients immediately", "Wait for fire department to arrive and assume command", "Search the building interior for trapped victims"], c: 0, d: 2 },
      ];
      return pick(s);
    }},
    { sub: "Vehicle Extrication", gen: () => {
      const s = [
        { stem: `A patient trapped in a vehicle has an unstable pelvis and bilateral femur fractures. The fire department asks you for medical guidance on extrication approach. What is the recommended technique for this patient?`, opts: ["Long-axis extrication (roof removal or dashboard roll) with spinal motion restriction and pelvic binder applied BEFORE patient movement, coordinated rapid extrication if hemodynamically unstable", "Standard rapid extrication through the nearest door opening", "Delay all extrication until the patient is fully immobilized on a long backboard through the window", "Have the patient self-extricate to minimize spinal motion"], c: 0, d: 4 },
        { stem: `During extrication, the patient becomes pulseless and apneic while still partially trapped. The steering column is pinning the patient's chest. What is the correct medical decision?`, opts: ["Communicate urgently with fire/rescue to expedite chest clearance while attempting CPR in the most effective manner possible given access limitations; consider bilateral needle decompression if traumatic arrest is suspected", "Pronounce death in the field — cardiac arrest from trauma while entrapped is not survivable", "Wait until full extrication before initiating any resuscitation efforts", "Begin compressions on the dashboard to provide external cardiac massage"], c: 0, d: 4 },
      ];
      return pick(s);
    }},
    { sub: "Hazmat Awareness", gen: () => {
      const s = [
        { stem: `You arrive at a chemical plant where workers report a chlorine gas release. Several workers are coughing, wheezing, and have tearing eyes. They walked out of the building toward you. What is the correct initial zone establishment?`, opts: ["Establish a Hot Zone (contamination area), Warm Zone (decontamination corridor), and Cold Zone (treatment/command) positioned UPWIND and UPHILL from the release; decontaminate patients in the Warm Zone before medical treatment", "Treat all patients immediately at the ambulance since they self-extricated", "Enter the building to search for additional victims before setting up zones", "Position the ambulance directly outside the building entrance for rapid access"], c: 0, d: 2 },
        { stem: `During a hazmat incident, a contaminated patient arrives at the ambulance before decontamination. The patient is in severe respiratory distress with stridor and altered mental status. No decontamination resources have arrived. What is the protocol?`, opts: ["Perform life-saving interventions using appropriate PPE (minimum Level C with SCBA if available); attempt gross decontamination (remove clothing, water rinse) before or during treatment; do not delay life-saving care for decontamination", "Refuse to treat the patient until proper decontamination is completed", "Treat the patient with standard PPE (gloves and gown) since the chemical is unknown", "Place the patient in the ambulance and transport to the hospital for decontamination there"], c: 0, d: 4 },
        { stem: `You respond to a natural gas leak inside a residence. On arrival, you smell a strong odorant (mercaptan). The patient is inside and reported to be unconscious. What hazard does natural gas present in an enclosed space?`, opts: ["Explosion and fire hazard from gas accumulation reaching the lower explosive limit; also risk of asphyxiation (displacement of oxygen); do NOT enter — stage upwind and request fire department with gas detection equipment", "Natural gas is primarily a poisoning risk similar to carbon monoxide", "The odorant indicates the gas concentration is below dangerous levels", "Enter with an N95 mask to protect from the gas while rescuing the patient"], c: 0, d: 2 },
      ];
      return pick(s);
    }},
    { sub: "Air Medical Transport", gen: () => {
      const s = [
        { stem: `A patient with a penetrating chest injury has a chest seal with flutter valve in place. During helicopter transport at altitude, the patient develops increasing respiratory distress. What physiological principle explains the worsening condition?`, opts: ["Boyle's Law: as altitude increases, atmospheric pressure decreases, causing trapped air (pneumothorax) to expand; the patient may need needle decompression even if previously stable at ground level", "The flutter valve has become displaced during helicopter vibration", "Altitude-related hypoxia is causing the respiratory distress", "The helicopter noise is causing anxiety-related dyspnea"], c: 0, d: 4 },
        { stem: `You are establishing safety protocols for helicopter landing zone operations. Which of the following is a critical safety rule that all ground personnel must follow?`, opts: ["Never approach the helicopter from the rear (tail rotor) — always approach from the front or sides within the pilot's field of vision, and only when signaled by flight crew", "Ground personnel should approach from any direction as long as they duck below the main rotor", "Only the most experienced crew member should guide the helicopter to the LZ", "Ground personnel should shine flashlights directly at the cockpit to guide the pilot"], c: 0, d: 1 },
      ];
      return pick(s);
    }},
    { sub: "Handover Communication", gen: () => {
      const s = [
        { stem: `You are handing over a patient with a suspected stroke to the ED team. Using the SBAR framework, which component includes the paramedic's clinical impression and recommended actions?`, opts: ["Recommendation — where the paramedic suggests specific actions or assessments needed (e.g., 'I recommend immediate CT scan as the patient is within the thrombolytic window')", "Situation — the opening statement of what is happening", "Background — the patient's relevant medical history", "Assessment — the paramedic's findings and clinical impression"], c: 0, d: 2 },
        { stem: `During handover, the receiving nurse questions your clinical decision to administer a medication, suggesting it was inappropriate. How should you respond professionally?`, opts: ["Explain your clinical reasoning calmly, citing the protocol or medical direction that supported your decision, and include the patient's response to the treatment in your handover", "Refuse to discuss it and refer them to your supervisor", "Admit the medication was likely wrong to avoid conflict", "Escalate to the ED attending physician to validate your decision"], c: 0, d: 2 },
      ];
      return pick(s);
    }},
    { sub: "Crew Resource Management", gen: () => {
      const s = [
        { stem: `During a complex resuscitation, you notice that the team is becoming disorganized — medications are being given without clear communication, chest compressions are interrupted frequently, and no one is tracking time intervals. As team leader, what CRM technique should you implement?`, opts: ["Use closed-loop communication: assign specific roles to each team member, require read-back of all orders, and designate a timer/recorder to track intervals and medications", "Take over all roles yourself to ensure quality", "Continue the current approach but speak louder to be heard over the chaos", "Stop the resuscitation to regroup and reorganize before continuing"], c: 0, d: 3 },
        { stem: `You are a paramedic riding with a new EMT partner for the first time. During your first call together, you notice the EMT is performing a skill incorrectly but safely. When is the most appropriate time to address this?`, opts: ["During the post-call debrief in a private, constructive manner; if the error is not endangering the patient, real-time correction during the call may cause stress and distraction", "Immediately in front of the patient to correct the error", "Document the error in writing and submit to the supervisor without discussing it", "Never address it — the EMT will learn from experience over time"], c: 0, d: 2 },
      ];
      return pick(s);
    }},
    { sub: "Documentation Standards", gen: () => {
      const s = [
        { stem: `You respond to a patient who fell at a nursing facility. The nursing staff tells you the patient fell 3 hours ago but they just now called 911. How should you document the discrepancy between the time of injury and the time of the 911 call?`, opts: ["Document the time of the reported fall, the time 911 was called, and the time of your arrival factually; quote the nursing staff's statements about the timeline using quotation marks", "Only document your arrival time since you did not witness the fall", "Document your opinion that the nursing staff was negligent in delaying the call", "Backdate your arrival time to closer to the time of the fall"], c: 0, d: 2 },
        { stem: `During documentation of a call, you realize you need to document the administration of morphine but your partner administered it and you did not directly observe the dose drawn up. What is the most legally appropriate documentation approach?`, opts: ["Document that your partner administered the medication, include their name, the reported dose, route, time, and the patient's response; your partner should co-sign or complete their own documentation of the medication administration", "Document as if you administered the medication yourself to simplify the record", "Do not document the medication at all if you didn't directly administer it", "Estimate the dose based on the patient's response and document that"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
  ],
  "Airway Management": [
    { sub: "BVM Ventilation", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} is found unresponsive with agonal respirations at 4/min. GCS 3. You are unable to maintain a mask seal with one-person BVM technique due to the patient's facial hair and large face. SpO2 is 72% and falling. What is the most effective technique to improve ventilation?`, opts: ["Use a two-person BVM technique: one rescuer uses both hands to create a mask seal with jaw thrust (thenar grip or VE grip) while the second rescuer squeezes the bag", "Continue single-person BVM technique with more force on the mask", "Switch to a nasal cannula at 15 LPM for better oxygen delivery", "Remove the patient's facial hair before reattempting the single-person technique"], c: 0, d: 2 },
        { stem: `A ${a}-year-old ${sx} is being ventilated with BVM. The patient's abdomen is progressively distending and SpO2 is not improving despite visible chest rise. The EtCO2 waveform is flat. What is the most likely problem?`, opts: ["Gastric insufflation from excessive ventilation volume or rate; reduce tidal volume to just visible chest rise (6-7 mL/kg), slow the rate to 10-12/min, and consider inserting an OPA/NPA or OG/NG tube to decompress the stomach", "The BVM is defective and needs replacement", "The patient has a tension pneumothorax requiring decompression", "The oxygen tubing is kinked; check all connections"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
    { sub: "Supraglottic Airways", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} in cardiac arrest has had two failed intubation attempts. You decide to place a supraglottic airway (King LT or i-gel). After insertion, you ventilate with the BVM but hear a significant air leak and the EtCO2 reading is very low. What is the most likely cause?`, opts: ["The device is the wrong size or not seated properly; withdraw slightly, attempt reinsertion, or try a different size; also ensure the cuff (if applicable) is adequately inflated", "Supraglottic airways cannot be used during CPR due to chest compression interference", "The patient has a foreign body airway obstruction that requires removal first", "Cardiac arrest patients cannot be effectively ventilated with supraglottic devices"], c: 0, d: 3 },
        { stem: `A ${a}-year-old ${sx} has a supraglottic airway (i-gel) in place during cardiac arrest. ROSC is achieved and the patient begins having a gag reflex. What is the appropriate airway management?`, opts: ["If the patient is gagging on the device but maintaining adequate ventilation, plan for either removal with equipment ready for reintubation, or consider conversion to endotracheal intubation through the supraglottic device if designed for this", "Remove the supraglottic airway immediately and allow the patient to breathe on their own", "Leave the device in place and administer sedation to suppress the gag reflex", "The gag reflex return always means the patient can protect their own airway"], c: 0, d: 4 },
      ];
      return pick(s);
    }},
    { sub: "Endotracheal Intubation", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `After intubating a ${a}-year-old ${sx}, you note the EtCO2 waveform shows a normal square wave with a reading of 38 mmHg. Breath sounds are present on the right side but diminished on the left. SpO2 is 94%. What is the most likely issue?`, opts: ["Right mainstem bronchus intubation — the tube is inserted too deep; withdraw the ETT 1-2 cm, reconfirm bilateral breath sounds, and resecure at the new depth", "Left-sided tension pneumothorax requiring needle decompression", "Esophageal intubation confirmed by the diminished sounds on the left", "Normal variation in breath sounds due to patient positioning"], c: 0, d: 3 },
        { stem: `You are preparing to intubate a ${a}-year-old ${sx} trauma patient with suspected cervical spine injury. The patient has a GCS of 5, is breathing at 6/min, and SpO2 is 81%. What is the appropriate intubation technique for suspected c-spine injury?`, opts: ["Maintain manual in-line stabilization (MILS) during intubation with a second provider, remove the front of the cervical collar if applied, and use video laryngoscopy if available for best first-pass success", "Apply a cervical collar and perform nasotracheal intubation to avoid neck manipulation", "Avoid intubation entirely in suspected c-spine injuries; use supraglottic airway only", "Hyperextend the neck slightly for optimal visualization as the injury is only suspected"], c: 0, d: 3 },
        { stem: `During intubation of a ${a}-year-old ${sx}, you achieve a Grade III Cormack-Lehane view (only the epiglottis is visible). What does this grade mean and what technique may improve visualization?`, opts: ["Grade III means only the epiglottis is visible (no vocal cords seen); use a bougie/gum elastic bougie as an intubation adjunct, apply BURP maneuver (backward-upward-rightward pressure on the thyroid cartilage), or switch to video laryngoscopy", "Grade III is the best view possible; proceed with blind intubation through the epiglottis", "Grade III means no structures are visible; abort intubation immediately", "Increase the force on the laryngoscope blade to improve the view"], c: 0, d: 4 },
      ];
      return pick(s);
    }},
    { sub: "Surgical Airway", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} has complete upper airway obstruction from severe angioedema. BVM ventilation is impossible, intubation has failed twice, and a supraglottic airway cannot be placed. SpO2 is 55% and the patient is cyanotic and bradycardic. What is the definitive airway intervention?`, opts: ["Emergency cricothyrotomy: identify the cricothyroid membrane between the thyroid and cricoid cartilage, make a horizontal incision, insert a 6.0 cuffed tracheostomy or ETT, and confirm placement with EtCO2", "Perform a tracheostomy below the cricoid cartilage", "Continue attempting BVM with repositioning as cricothyrotomy is too risky", "Perform needle cricothyrotomy with jet ventilation using a 14-gauge catheter"], c: 0, d: 5 },
        { stem: `You are considering a surgical airway for a patient who cannot be intubated or ventilated. Which anatomical landmark must you correctly identify for cricothyrotomy?`, opts: ["The cricothyroid membrane — the soft tissue space between the inferior border of the thyroid cartilage (Adam's apple) and the superior border of the cricoid cartilage", "The space between the cricoid cartilage and the first tracheal ring", "The thyrohyoid membrane above the thyroid cartilage", "Any soft tissue space in the anterior neck below the jaw"], c: 0, d: 2 },
      ];
      return pick(s);
    }},
    { sub: "Capnography", gen: () => {
      const s = [
        { stem: `During transport, an intubated patient's EtCO2 suddenly rises from 35 mmHg to 58 mmHg over 5 minutes. The patient's respiratory rate on the ventilator has not changed. Tidal volume appears adequate. What is the most likely cause of rising EtCO2?`, opts: ["Hypoventilation relative to metabolic demand, increased CO2 production (fever, seizure activity, shivering), or developing respiratory failure; increase ventilatory rate slightly and assess for cause", "The ETT has migrated into the esophagus", "The capnography sensor is malfunctioning and needs replacement", "Rising EtCO2 always indicates improving cardiac output"], c: 0, d: 4 },
        { stem: `You are monitoring EtCO2 during CPR. The waveform has been showing 12-15 mmHg for the past 15 minutes. Suddenly, the EtCO2 jumps to 42 mmHg. What does this change most likely indicate?`, opts: ["Return of spontaneous circulation (ROSC) — a sudden sustained rise in EtCO2 during CPR strongly suggests ROSC; check for a pulse", "Improved CPR quality by the compressor", "The endotracheal tube has been displaced", "An artifact from movement during compressions"], c: 0, d: 3 },
        { stem: `A patient with an advanced airway has a capnography waveform that shows a gradually rising baseline (Phase I does not return to zero) while the peak values remain normal. What does this shark-fin or rising baseline pattern suggest?`, opts: ["Rebreathing of CO2, often due to an exhausted CO2 absorber (if using a rebreathing circuit), inadequate fresh gas flow, or a faulty expiratory valve; check the circuit for malfunction", "Bronchospasm causing prolonged expiration (shark-fin pattern)", "Normal capnography variation during prolonged ventilation", "Esophageal intubation with gastric CO2 washout"], c: 0, d: 5 },
      ];
      return pick(s);
    }},
    { sub: "RSI Technique", gen: () => {
      const a = pick(AGES); const sx = pick(SEX); const wt = pick([60,70,75,80,85,90]);
      const s = [
        { stem: `A ${a}-year-old ${sx} weighing ${wt} kg requires RSI for airway control. After preoxygenation, you administer ketamine 2 mg/kg IV followed by succinylcholine 1.5 mg/kg IV. Fasciculations occur and then the patient becomes flaccid. What is the optimal timing for laryngoscopy?`, opts: [`Begin laryngoscopy 45-60 seconds after succinylcholine administration, when fasciculations have ceased and complete paralysis is achieved`, "Begin laryngoscopy immediately after the medications are pushed", "Wait 3-5 minutes after succinylcholine for optimal relaxation conditions", "Begin laryngoscopy during the fasciculation phase for best jaw relaxation"], c: 0, d: 3 },
        { stem: `During RSI preparation, your partner asks why preoxygenation with 100% O2 for 3-5 minutes is critical before medication administration. What is the physiological rationale?`, opts: ["Preoxygenation replaces nitrogen in the functional residual capacity with oxygen (denitrogenation), creating an oxygen reservoir that extends the safe apnea time from ~1 minute to 5-8 minutes in a healthy adult", "Preoxygenation raises the blood oxygen level above 100% for safety margin", "It is a formality that does not significantly affect patient outcomes", "Preoxygenation is only important in pediatric patients with smaller lung volumes"], c: 0, d: 2 },
      ];
      return pick(s);
    }},
    { sub: "Difficult Airway Assessment", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} with obesity (BMI 42), limited neck extension, a Mallampati Class IV score (only hard palate visible), and a thyromental distance of 5 cm presents with acute respiratory failure requiring intubation. What predictive finding is MOST concerning for difficult intubation?`, opts: ["Mallampati IV combined with limited neck mobility is highly predictive of a difficult airway (Grade III-IV view); prepare backup devices (video laryngoscope, bougie, supraglottic airway, surgical airway kit) before first attempt", "BMI alone predicts difficult intubation regardless of other factors", "Short thyromental distance is the single most reliable predictor", "Only the LEMON assessment determines difficult airway prediction"], c: 0, d: 4 },
        { stem: `Using the LEMON assessment tool for difficult airway prediction, what does each letter stand for?`, opts: ["Look externally (facial features), Evaluate 3-3-2 rule (mouth opening, hyoid-chin, thyroid cartilage-floor of mouth distances), Mallampati score, Obstruction assessment, Neck mobility evaluation", "Laryngoscopy grade, Edema assessment, Mouth opening, Obesity, Nostril patency", "Lip competence, Epiglottis visibility, Mandible size, Occiput prominence, Nasal airway assessment", "Lung capacity, Edentulous status, Muscle relaxation needed, Oxygen reserve, Nasopharyngeal anatomy"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
    { sub: "Oxygen Delivery Devices", gen: () => {
      const s = [
        { stem: `A COPD patient with baseline SpO2 of 88% on room air presents with increased work of breathing. SpO2 is currently 82%. The patient is alert, speaking in short sentences, and using accessory muscles. What is the most appropriate initial oxygen delivery method and target?`, opts: ["Start with a Venturi mask at 28-31% FiO2, titrating to target SpO2 88-92% for COPD patients to avoid suppressing the hypoxic drive; increase FiO2 if SpO2 remains below 88%", "Apply a non-rebreather mask at 15 LPM targeting SpO2 >99%", "Use a nasal cannula at 2 LPM only, regardless of SpO2 response", "Withhold supplemental oxygen entirely due to COPD hypoxic drive concerns"], c: 0, d: 3 },
        { stem: `A patient in acute respiratory failure is on a non-rebreather mask at 15 LPM but SpO2 remains at 84%. The patient is alert, sitting upright, and has significant work of breathing. What is the next escalation in oxygen delivery before intubation?`, opts: ["CPAP at 5-10 cmH2O or BiPAP if available; non-invasive positive pressure ventilation can improve oxygenation and reduce work of breathing, potentially avoiding intubation", "Switch to a simple face mask at 10 LPM", "Add a nasal cannula under the non-rebreather for additional flow", "Proceed directly to intubation since the NRB has failed"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
    { sub: "Suctioning Techniques", gen: () => {
      const s = [
        { stem: `A patient is vomiting large amounts of blood (hematemesis) and is at risk of aspiration. You need to suction the airway. What is the maximum recommended suction catheter insertion depth for oropharyngeal suctioning in an adult, and how long should each suction attempt last?`, opts: ["Insert a rigid (Yankauer) catheter only as far as you can see (to the base of the tongue/oropharynx); limit each suction attempt to no more than 10-15 seconds to avoid hypoxia", "Insert the catheter to the carina (about 30 cm) for thorough suctioning lasting up to 30 seconds", "Insert the catheter just past the teeth for 5 seconds maximum", "Continuous suction for as long as needed to clear the entire airway"], c: 0, d: 2 },
      ];
      return pick(s);
    }},
  ],
  "Medical Emergencies": [
    { sub: "Stroke Assessment", gen: () => {
      const a = pick([52,58,62,67,72,78,82]); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} presents with sudden onset right-sided facial droop, right arm weakness (drift), and slurred speech. Symptom onset was witnessed 45 minutes ago. Blood glucose is 118 mg/dL. BP 178/96, HR 82. Using the Cincinnati Prehospital Stroke Scale, how many positive findings does this patient have?`, opts: ["Three out of three positive findings (facial droop, arm drift, and speech abnormality); any one positive finding suggests stroke with high sensitivity — transport to a designated stroke center within the treatment window", "Two positive findings — arm drift alone does not count as a stroke sign", "One positive finding — facial droop is the only validated indicator", "Zero positive findings until confirmed by CT scan at the hospital"], c: 0, d: 2 },
        { stem: `A ${a}-year-old ${sx} presents with stroke symptoms that began 3 hours and 45 minutes ago. The nearest primary stroke center (PSC) is 15 minutes away. The nearest comprehensive stroke center (CSC) with endovascular capability is 45 minutes away. Which transport destination is most appropriate?`, opts: ["Transport to the PSC — within the 4.5-hour tPA window, getting to the closest stroke-capable facility quickly is the priority; the PSC can administer tPA and transfer for endovascular therapy if needed (drip and ship model)", "Transport to the CSC for definitive endovascular treatment", "Transport to the nearest ED regardless of stroke designation", "Hold on scene until a stroke neurologist is consulted by phone"], c: 0, d: 3 },
        { stem: `A ${a}-year-old ${sx} has a sudden severe headache ('worst headache of my life'), vomiting, neck stiffness, and altered consciousness. BP 192/108, HR 62, GCS 12. What type of stroke does this presentation most suggest?`, opts: ["Hemorrhagic stroke (subarachnoid hemorrhage) — characterized by sudden onset severe headache, nuchal rigidity, photophobia, and altered LOC; avoid anticoagulants and thrombolytics; rapid transport for CT and neurosurgical evaluation", "Ischemic stroke requiring tPA within the treatment window", "Transient ischemic attack (TIA) that will resolve spontaneously", "Hypertensive crisis without stroke involvement"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
    { sub: "Diabetic Emergencies", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} with type 1 diabetes presents with Kussmaul respirations (deep, rapid breathing), a fruity breath odor, altered mental status, and abdominal pain. Blood glucose is 486 mg/dL. BP 88/52, HR 128, RR 32, temperature 37.8°C. This presentation is consistent with DKA. What is the priority prehospital treatment?`, opts: ["Aggressive IV fluid resuscitation with NS (initial bolus of 1-2L) to address severe dehydration and hypovolemia; do NOT administer insulin in the prehospital setting", "Administer rapid-acting insulin to lower the blood glucose immediately", "Administer oral glucose or D50W since the patient has altered mental status", "Sodium bicarbonate 50 mEq IV to correct the metabolic acidosis"], c: 0, d: 3 },
        { stem: `A ${a}-year-old ${sx} is found unresponsive by family. They have diabetes and take insulin. No recent meals. Blood glucose reads 28 mg/dL. No IV access can be obtained after two attempts. What is the most appropriate next intervention?`, opts: ["Glucagon 1 mg IM (or intranasal glucagon if available) — it stimulates hepatic glycogenolysis and should raise blood glucose within 10-20 minutes", "Oral glucose paste placed in the cheek of the unresponsive patient", "IO access for D50W administration", "Transport without treatment — the hospital will establish IV access more quickly"], c: 0, d: 2 },
        { stem: `A ${a}-year-old ${sx} with type 2 diabetes on oral medications presents with confusion, excessive thirst, polyuria, and weakness developing over several days. Blood glucose is 842 mg/dL. BP 94/58, HR 116, RR 20 (not Kussmaul). There is no fruity breath odor. This presentation suggests HHS (Hyperosmolar Hyperglycemic State) rather than DKA. What is the key differentiating feature?`, opts: ["HHS typically has extreme hyperglycemia (>600 mg/dL) WITHOUT significant ketoacidosis (no Kussmaul breathing, no fruity odor); the primary pathology is severe dehydration from osmotic diuresis, requiring aggressive fluid replacement", "HHS only occurs in type 1 diabetes patients", "The absence of polyuria differentiates HHS from DKA", "HHS always presents with seizures which DKA does not"], c: 0, d: 4 },
      ];
      return pick(s);
    }},
    { sub: "Seizures", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} has been having a continuous generalized tonic-clonic seizure for 8 minutes without regaining consciousness. This meets the criteria for status epilepticus. IV access has been established. What is the first-line medication?`, opts: ["Benzodiazepine: lorazepam 4 mg IV or midazolam 10 mg IM/IN; benzodiazepines are first-line for status epilepticus to terminate the seizure", "Phenytoin 15-20 mg/kg IV infused over 30 minutes as the first medication", "Phenobarbital 20 mg/kg IV as the initial anticonvulsant", "Levetiracetam 60 mg/kg IV as the preferred first-line agent"], c: 0, d: 3 },
        { stem: `A ${a}-year-old ${sx} had a witnessed generalized seizure that lasted 45 seconds and self-terminated. The patient is now postictal — confused, drowsy, and responding slowly to questions. Blood glucose is 96 mg/dL, SpO2 97%, BP 142/88, HR 92. What is the most appropriate management?`, opts: ["Protect the airway (position on side), provide supplemental oxygen if SpO2 drops, perform a full neurological assessment, obtain 12-lead ECG, and transport for evaluation — monitor for recurrent seizure activity", "Administer a prophylactic benzodiazepine to prevent seizure recurrence", "Clear the patient to refuse transport since the seizure has stopped and glucose is normal", "Immediately intubate the patient to protect the airway during the postictal period"], c: 0, d: 2 },
      ];
      return pick(s);
    }},
    { sub: "Anaphylaxis", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} ate shellfish 15 minutes ago and now presents with generalized urticaria, tongue swelling, inspiratory stridor, and wheezing. BP 78/42, HR 134, RR 28, SpO2 88%. This is severe anaphylaxis with both airway compromise and distributive shock. What is the FIRST intervention?`, opts: ["Epinephrine 0.3-0.5 mg (1:1,000) IM in the anterolateral thigh — this is the MOST important and time-critical intervention in anaphylaxis", "Diphenhydramine 50 mg IV for the allergic reaction", "Albuterol nebulizer for the wheezing", "IV fluid bolus of 1L NS for the hypotension"], c: 0, d: 2 },
        { stem: `A ${a}-year-old ${sx} was treated for anaphylaxis with epinephrine IM 0.3 mg. Symptoms initially improved but 20 minutes later, the patient develops worsening urticaria, recurrent wheezing, and BP drops from 112/78 to 82/48. What is occurring and what is the treatment?`, opts: ["Biphasic anaphylaxis — a recurrence of symptoms after initial improvement; administer a second dose of epinephrine IM, continue aggressive IV fluid resuscitation, and strongly consider transport for prolonged observation (4-6 hours minimum)", "The first dose of epinephrine was ineffective and a different medication is needed", "This is a separate allergic reaction to the epinephrine itself", "Administer glucocorticoids as they will provide immediate symptom relief"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
    { sub: "Sepsis", gen: () => {
      const a = pick([62,68,72,78,82,86]); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} nursing home resident presents with fever 39.8°C, altered mental status (baseline alert, now confused), HR 118, RR 24, BP 86/48, SpO2 93%, and a productive cough with purulent sputum. Using the qSOFA criteria (RR ≥22, altered mentation, SBP ≤100), this patient scores 3/3. What does this indicate and what is the priority?`, opts: ["High risk for sepsis with organ dysfunction (septic shock); initiate aggressive IV fluid resuscitation with 30 mL/kg crystalloid, monitor for fluid responsiveness, maintain SpO2 >94%, and transport to an ED capable of early goal-directed therapy", "The qSOFA score is only relevant for ICU patients, not prehospital care", "A qSOFA of 3 means the patient is unlikely to survive and should receive comfort care only", "IV fluids should be withheld to avoid pulmonary edema in elderly patients with infection"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
    { sub: "Respiratory Distress", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} with a history of COPD presents with severe dyspnea, pursed-lip breathing, barrel chest, and speaks in 1-2 word phrases. SpO2 84%, RR 32, HR 112, BP 142/88. Bilateral diffuse wheezes and rhonchi are auscultated. What is the most appropriate initial treatment?`, opts: ["Nebulized albuterol 2.5 mg AND ipratropium 0.5 mg (combination bronchodilator therapy), supplemental oxygen titrated to SpO2 88-92%, and CPAP if available for work of breathing", "Intubation immediately for SpO2 below 85%", "100% oxygen via NRB and no bronchodilators until hospital evaluation", "Epinephrine 0.3 mg IM for severe bronchospasm"], c: 0, d: 3 },
        { stem: `A ${a}-year-old ${sx} presents with acute onset pleuritic chest pain, dyspnea, tachycardia (HR 122), and SpO2 91%. The patient had recent hip replacement surgery 5 days ago. Lung sounds are clear bilaterally. ECG shows sinus tachycardia with S1Q3T3 pattern. What is the most likely diagnosis?`, opts: ["Pulmonary embolism — recent surgery is a major risk factor; the combination of sudden dyspnea, pleuritic pain, tachycardia, clear lungs, and S1Q3T3 pattern is highly suggestive; administer oxygen, IV access, and rapid transport", "Acute MI with atypical presentation", "Pneumothorax based on the pleuritic pain", "Acute COPD exacerbation despite clear lung sounds"], c: 0, d: 4 },
      ];
      return pick(s);
    }},
    { sub: "Shock Recognition", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} presents with warm, flushed, dry skin, bounding pulses, tachycardia, and hypotension. The patient has a known spinal cord injury at T6 level from a diving accident 2 hours ago. What type of shock is this presentation most consistent with?`, opts: ["Neurogenic (distributive) shock — loss of sympathetic tone below the injury level causes vasodilation (warm skin), and loss of cardiac accelerator fibers causes relative bradycardia; treat with IV fluids and vasopressors if needed", "Hypovolemic shock from occult internal hemorrhage", "Cardiogenic shock from cardiac contusion", "Septic shock from early systemic infection"], c: 0, d: 3 },
        { stem: `A ${a}-year-old ${sx} with a known bee sting allergy was stung 10 minutes ago. The patient has generalized urticaria, wheezing, and presents with hypotension (BP 72/40), tachycardia (HR 138), warm flushed skin. Epinephrine 0.3 mg IM was given. BP is now 78/44. What type of shock and next step?`, opts: ["Anaphylactic (distributive) shock — administer a second dose of epinephrine IM, begin aggressive IV NS fluid bolus (1-2L), and consider epinephrine infusion if available for refractory anaphylactic shock", "Cardiogenic shock requiring dobutamine", "Hemorrhagic shock requiring blood products", "Obstructive shock requiring pericardiocentesis"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
    { sub: "Neurological Assessment", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} is found unresponsive. On assessment: eyes open to pain (E2), patient makes incomprehensible sounds to stimuli (V2), and demonstrates flexion withdrawal from pain (M4). What is the patient's Glasgow Coma Scale score and its clinical significance?`, opts: ["GCS 8 (E2+V2+M4) — this score indicates severe brain injury and the patient is unable to protect their airway; intubation should be considered as the patient meets the classic threshold of GCS ≤8 for airway intervention", "GCS 10 — moderate injury not requiring airway intervention", "GCS 6 — indicating brain death", "GCS 8 but no airway intervention is needed until GCS drops below 5"], c: 0, d: 2 },
        { stem: `A ${a}-year-old ${sx} presents after a fall. Left pupil is 6 mm and non-reactive. Right pupil is 3 mm and reactive. The patient has right-sided hemiparesis and a GCS of 9 (E2V3M4). What do these findings suggest?`, opts: ["Left-sided uncal herniation causing compression of the left CN III (oculomotor nerve) resulting in ipsilateral pupil dilation; this is a neurosurgical emergency requiring rapid transport to a trauma center with neurosurgical capability", "Right-sided brain hemorrhage causing contralateral pupil dilation", "Normal pupil asymmetry (anisocoria) present in 20% of the population", "Bilateral brain injury causing diffuse neurological deficits"], c: 0, d: 4 },
      ];
      return pick(s);
    }},
    { sub: "Abdominal Emergencies", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} presents with sudden onset of severe periumbilical pain that has migrated to the right lower quadrant over the past 12 hours. The patient has fever (38.6°C), nausea, and rebound tenderness at McBurney's point. BP 128/78, HR 96. What is the most likely diagnosis and prehospital concern?`, opts: ["Acute appendicitis with possible perforation; prehospital management includes IV access, analgesia per protocol, anti-emetic if needed, and transport for surgical evaluation — do NOT give oral fluids or food", "Kidney stone requiring ketorolac and fluid hydration", "Ovarian torsion requiring emergent gynecological consultation", "Small bowel obstruction requiring nasogastric decompression"], c: 0, d: 2 },
        { stem: `A ${pick([62,68,72,78,82])}-year-old ${sx} presents with sudden onset severe tearing abdominal pain radiating to the back. The patient has a known history of hypertension and smoking. BP 78/42 (had been 188/94 per nursing facility), HR 128, the abdomen is distended and tender with a pulsatile mass palpable above the umbilicus. What is the most likely diagnosis?`, opts: ["Ruptured abdominal aortic aneurysm (AAA) — a surgical emergency; establish bilateral large-bore IVs, permissive hypotension (target SBP 80-90 only), and transport IMMEDIATELY to a facility with vascular surgery capability", "Aortic dissection requiring blood pressure control with esmolol", "Acute mesenteric ischemia requiring anticoagulation", "Perforated peptic ulcer requiring nasogastric decompression"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
    { sub: "Electrolyte Disorders", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} dialysis patient presents with muscle weakness, paresthesias, and palpitations. ECG shows peaked T waves, widened QRS complexes, and a sine wave pattern. What is the diagnosis and immediate life-saving intervention?`, opts: ["Severe hyperkalemia — administer calcium chloride 1g IV (or calcium gluconate 3g) over 2-3 minutes to stabilize the cardiac membrane, then consider sodium bicarbonate 50 mEq IV and albuterol nebulizer to shift potassium intracellularly", "Hypocalcemia — administer calcium chloride 1g IV", "Hyponatremia — administer hypertonic saline 100 mL IV", "Hypomagnesemia — administer magnesium sulfate 2g IV"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
  ],
  "Trauma Management": [
    { sub: "Primary Survey", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} is involved in a motorcycle crash at estimated speed of ${pick([40,50,60,70])} mph. The patient is found 20 feet from the motorcycle. Primary survey reveals: airway patent with blood in mouth, breathing present but labored at RR 28, radial pulse present but weak at HR 128, GCS 12 (E3V4M5). What is the most immediate priority?`, opts: ["Clear the airway of blood with suction while maintaining cervical spine protection — airway always comes first in the ABCDE primary survey, even with other concerning findings", "Address the tachycardia and weak pulse with IV fluid bolus", "Obtain a complete set of vital signs and blood glucose before intervention", "Fully expose the patient to find the source of potential hemorrhage"], c: 0, d: 2 },
        { stem: `During a primary survey of a trauma patient, you identify a sucking chest wound on the right lateral chest wall. The patient has decreased breath sounds on the right, HR 118, BP 94/62, RR 28, SpO2 88%. What is the immediate intervention?`, opts: ["Apply a vented chest seal (or three-sided occlusive dressing) over the wound to prevent air entrainment while allowing pressure relief; monitor for tension pneumothorax development", "Immediately intubate the patient to achieve positive pressure ventilation", "Apply a fully occlusive dressing sealed on all four sides", "Perform needle decompression of the right chest before sealing the wound"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
    { sub: "Hemorrhage Control", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} has a traumatic amputation of the right leg below the knee from a farming accident. Bright red blood is spurting from the stump. Direct pressure and elevation are insufficient to control the hemorrhage. What is the next intervention per TCCC/TECC guidelines?`, opts: ["Apply a commercial tourniquet high and tight on the proximal thigh, tighten until bleeding stops, note the time of application, and apply a second tourniquet proximal to the first if bleeding continues", "Pack the wound with hemostatic gauze as the primary intervention for amputations", "Apply a pressure bandage with elastic wrap tightly around the stump", "Clamp the visible vessels with hemostats to achieve surgical hemostasis"], c: 0, d: 2 },
        { stem: `A ${a}-year-old ${sx} has a deep penetrating wound to the inguinal (groin) area with uncontrolled hemorrhage. A tourniquet cannot be applied effectively to this junctional area. What is the most appropriate hemorrhage control technique?`, opts: ["Apply hemostatic gauze (such as QuikClot Combat Gauze or Celox) packed tightly into the wound with sustained direct pressure for a minimum of 3-5 minutes, or use a junctional tourniquet device if available", "Apply a standard tourniquet to the upper thigh above the wound", "Use your fist to apply pressure directly to the femoral artery above the wound", "Transport immediately without attempting hemorrhage control in this location"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
    { sub: "Spinal Motion Restriction", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} is ambulatory after a rear-end motor vehicle collision at low speed. The patient complains of neck pain but has no midline tenderness, no neurological deficits, no distracting injuries, is not intoxicated, and is alert and oriented. Using the NEXUS criteria, does this patient require spinal motion restriction (SMR)?`, opts: ["No — the patient meets all NEXUS low-risk criteria (no midline tenderness, no focal neuro deficit, normal alertness, no intoxication, no distracting injury); clinical clearance can be considered per protocol", "Yes — all MVC patients require full spinal immobilization regardless of exam findings", "Yes — neck pain alone mandates cervical collar and long backboard application", "No — ambulatory patients never require any spinal assessment or restriction"], c: 0, d: 3 },
        { stem: `A ${a}-year-old ${sx} fell from a 15-foot ladder and landed on concrete. The patient has midline cervical tenderness at C5-C6, bilateral upper extremity paresthesias, and grip weakness bilaterally. GCS 15. What spinal motion restriction is indicated?`, opts: ["Apply a properly fitted cervical collar, use a vacuum mattress or long board for transport, maintain neutral alignment, and log-roll with manual in-line stabilization for any patient repositioning", "Apply a cervical collar only; a backboard is no longer used in modern EMS", "No SMR is needed since the patient has a GCS of 15 and is fully alert", "Apply a soft cervical collar for comfort and transport in position of comfort"], c: 0, d: 2 },
      ];
      return pick(s);
    }},
    { sub: "Chest Trauma", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} is stabbed in the left chest at the 5th intercostal space, midclavicular line. After sealing the wound, the patient rapidly deteriorates: HR 132, BP 68/40, distended neck veins, muffled heart sounds. SpO2 82%. What is the most likely diagnosis?`, opts: ["Cardiac tamponade (Beck's triad: hypotension, distended neck veins, muffled heart sounds); this is a surgical emergency requiring emergent transport for pericardiocentesis or thoracotomy", "Tension pneumothorax requiring needle decompression", "Massive hemothorax requiring chest tube insertion", "Simple pneumothorax that will resolve with observation"], c: 0, d: 3 },
        { stem: `A ${a}-year-old ${sx} involved in a high-speed MVC presents with paradoxical chest wall movement over the left anterolateral chest during breathing. The patient has severe pain, respiratory distress, RR 32, SpO2 86%, and crepitus over multiple rib lines. What injury does paradoxical chest wall movement indicate?`, opts: ["Flail chest — three or more adjacent ribs fractured in two or more places creating a free-floating segment; underlying pulmonary contusion is the primary concern; manage with positive pressure ventilation (CPAP or BVM/intubation) and analgesia", "Simple rib fractures that will be painful but are not life-threatening", "Tension pneumothorax causing the chest wall to move abnormally", "Diaphragmatic rupture with abdominal contents in the chest"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
    { sub: "Abdominal Trauma", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} is struck in the left upper quadrant by a baseball bat. The patient has left upper quadrant tenderness with guarding, pain referred to the left shoulder (Kehr sign), and progressive signs of shock (HR 128, BP 88/52). What organ is most likely injured?`, opts: ["Spleen — the most commonly injured solid organ in blunt abdominal trauma; Kehr sign (referred left shoulder pain from diaphragmatic irritation by blood) is classic for splenic injury with hemoperitoneum", "Kidney — left flank trauma causing renal laceration", "Stomach — blunt gastric rupture from the direct blow", "Pancreas — located deep in the retroperitoneum"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
    { sub: "Burns", gen: () => {
      const a = pick(AGES); const sx = pick(SEX); const wt = pick([60,70,75,80,85]);
      const s = [
        { stem: `A ${a}-year-old ${sx} (${wt} kg) suffered burns in a house fire. Using the Rule of Nines, the entire right leg (18%) and anterior trunk (18%) are burned, totaling 36% TBSA with mixed partial and full thickness burns. Using the Parkland formula (4 mL x kg x %TBSA), what is the fluid resuscitation plan for the first 8 hours?`, opts: [`Total 24-hour volume = ${4 * wt * 36} mL; give half (${Math.round(4 * wt * 36 / 2)} mL) in the first 8 hours from the time of burn (not from arrival), the remaining half over the next 16 hours, using Lactated Ringer's solution`, `Total volume = ${2 * wt * 36} mL; give all in the first 8 hours`, `Total volume = ${4 * wt * 36} mL; give it all evenly over 24 hours`, `No fluid calculation needed until hospital arrival; just run NS wide open`], c: 0, d: 3 },
      ];
      return pick(s);
    }},
    { sub: "Musculoskeletal Injuries", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} has a closed femur fracture with severe angulation. The distal foot is pale, cool, and pulseless (absent dorsalis pedis and posterior tibial pulses). What does the absence of distal pulses indicate and what is the appropriate prehospital intervention?`, opts: ["Vascular compromise from the fracture; attempt gentle traction and realignment to restore anatomical position and re-establish blood flow, then reassess distal pulses, motor function, and sensation; splint and rapidly transport if circulation does not improve", "Splint in the position found without any realignment attempts", "The absent pulses are expected with femur fractures and will return after hospital treatment", "Apply a tourniquet above the fracture to prevent further vascular injury"], c: 0, d: 3 },
        { stem: `A ${a}-year-old ${sx} has a traction splint applied for a mid-shaft femur fracture. After application, the patient reports increasing pain in the calf, the calf feels tense on palpation, and passive dorsiflexion of the ankle causes severe pain. What complication is developing?`, opts: ["Acute compartment syndrome — pressure within the fascial compartment is compromising tissue perfusion; this is a limb-threatening emergency requiring hospital surgical intervention (fasciotomy); document findings and transport urgently", "The traction splint is applying too much traction and needs adjustment", "Deep vein thrombosis (DVT) from the immobilization", "Normal post-fracture swelling and pain that will resolve with elevation and ice"], c: 0, d: 4 },
      ];
      return pick(s);
    }},
    { sub: "Penetrating Trauma", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} has a knife impaled in the right upper quadrant of the abdomen. The knife is still in place with approximately 4 inches visible externally. The patient has BP 98/64, HR 112, and mild abdominal tenderness around the wound. What is the correct management of the impaled object?`, opts: ["Stabilize the impaled object in place with bulky dressings, do NOT remove it (it may be tamponading internal hemorrhage), establish IV access, and transport for surgical evaluation and removal in the OR", "Remove the knife to allow wound assessment and bleeding control", "Push the knife deeper to ensure it is fully tamponading any internal bleeding", "Cut the knife handle off flush with the skin surface for easier transport"], c: 0, d: 2 },
      ];
      return pick(s);
    }},
    { sub: "Blast Injuries", gen: () => {
      const s = [
        { stem: `Following a nearby explosion, a patient presents with bilateral tympanic membrane rupture, sudden onset dyspnea, hemoptysis, and abdominal pain. These findings represent which category of blast injury?`, opts: ["Primary blast injury — caused by the blast overpressure wave affecting gas-filled organs (ears, lungs, GI tract); blast lung is the most life-threatening primary blast injury", "Secondary blast injury from projectiles/fragments", "Tertiary blast injury from being thrown by the blast wave", "Quaternary blast injury from burns and inhalation"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
    { sub: "Blunt Trauma", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} unrestrained driver is involved in a frontal MVC at 55 mph with a starred windshield and deformed steering wheel. What injury pattern should you suspect based on the mechanism (up-and-over vs down-and-under pathways)?`, opts: ["Up-and-over: head/cervical spine injury, chest trauma (sternal fracture, cardiac contusion, aortic injury), abdominal injuries. Down-and-under: knee-femur-hip injuries (dashboard mechanism), patellar fracture, posterior hip dislocation", "Only extremity injuries from airbag deployment", "Isolated head injury from windshield contact only", "Seatbelt-pattern injuries (which apply to restrained occupants)"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
  ],
  "Cardiology/ECG": [
    { sub: "12-Lead ECG Interpretation", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} presents with chest pain. The 12-lead ECG shows ST elevation in leads II, III, and aVF with reciprocal ST depression in leads I and aVL. Which coronary artery territory is most likely involved?`, opts: ["Right coronary artery (RCA) — leads II, III, aVF represent the inferior wall of the heart supplied by the RCA (or in some patients, the left circumflex)", "Left anterior descending (LAD) — representing anterior wall ischemia", "Left circumflex (LCx) — representing lateral wall ischemia", "Left main coronary artery — representing global ischemia"], c: 0, d: 3 },
        { stem: `A ${a}-year-old ${sx} presents with chest pain and the 12-lead ECG shows ST elevation in leads V1-V4. This represents which STEMI territory, and what complication should you prepare for?`, opts: ["Anterior STEMI (LAD territory) — the LAD supplies the anterior wall and interventricular septum; prepare for cardiogenic shock, heart block, and left ventricular failure; this carries the highest mortality of all STEMI locations", "Inferior STEMI with right ventricular involvement", "Lateral STEMI from circumflex occlusion", "Posterior STEMI requiring mirror-image interpretation"], c: 0, d: 3 },
        { stem: `A ${a}-year-old ${sx} presents with acute chest pain. The 12-lead shows ST depression and tall R waves in V1-V3. You suspect a posterior STEMI. What additional leads should you obtain to confirm?`, opts: ["Posterior leads V7-V9 (placed on the patient's back at the 5th intercostal space) — ST elevation ≥0.5 mm in these leads confirms posterior STEMI", "Right-sided leads V3R-V6R for right ventricular infarction", "Lewis lead for atrial flutter detection", "Modified chest leads placed 2 intercostal spaces higher"], c: 0, d: 4 },
      ];
      return pick(s);
    }},
    { sub: "Acute Coronary Syndrome", gen: () => {
      const a = pick([42,48,52,55,58,62,67,72]); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} presents with substernal crushing chest pain radiating to the left arm and jaw for 30 minutes, diaphoresis, and nausea. BP 148/92, HR 88, RR 20, SpO2 97%. 12-lead shows ST elevation in V1-V4. Using the STEMI treatment mnemonic, what medications should be administered?`, opts: ["Aspirin 324 mg PO (chewed), nitroglycerin 0.4 mg SL (if SBP >90 and no RV involvement or PDE5 inhibitor use), analgesia per protocol, establish IV access, and activate cath lab notification", "Aspirin 81 mg PO, heparin 5000 units IV, and clopidogrel 300 mg PO", "Nitroglycerin 0.4 mg SL first, then aspirin only if chest pain persists", "Morphine 4 mg IV as the first medication to reduce myocardial oxygen demand"], c: 0, d: 3 },
        { stem: `A ${a}-year-old ${sx} with an inferior STEMI (leads II, III, aVF) suddenly develops hypotension (BP 72/44) after receiving one sublingual nitroglycerin. Right-sided ECG shows ST elevation in V4R. What has occurred and what is the corrective action?`, opts: ["Right ventricular infarction — nitroglycerin caused preload reduction in an already preload-dependent RV; treatment is aggressive IV fluid bolus (250-500 mL NS boluses) to restore RV preload; AVOID further nitroglycerin and other preload reducers", "Left ventricular failure requiring vasopressor support", "Nitroglycerin-induced allergic reaction requiring epinephrine", "The patient is having a vagal response to nitroglycerin; treat with atropine"], c: 0, d: 4 },
      ];
      return pick(s);
    }},
    { sub: "Dysrhythmia Recognition", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} presents with palpitations and dizziness. The monitor shows a narrow-complex tachycardia at 188 bpm with regular R-R intervals and no discernible P waves. BP 108/72. What is the most likely rhythm and initial treatment?`, opts: ["Supraventricular tachycardia (SVT) — attempt vagal maneuvers first (modified Valsalva with leg elevation, or carotid sinus massage); if unsuccessful, administer adenosine 6 mg rapid IV push with 20 mL NS flush", "Atrial fibrillation with rapid ventricular response requiring diltiazem", "Ventricular tachycardia requiring synchronized cardioversion", "Sinus tachycardia requiring only fluid resuscitation"], c: 0, d: 2 },
        { stem: `A ${a}-year-old ${sx} presents with near-syncope. The ECG shows regular wide-complex tachycardia at 158 bpm. The patient is diaphoretic with BP 94/58. You are unsure whether this is VT or SVT with aberrant conduction. What is the safest approach?`, opts: ["Treat as ventricular tachycardia until proven otherwise — wide-complex tachycardia should be assumed to be VT; if hemodynamically unstable, perform synchronized cardioversion at 100J biphasic", "Administer adenosine 6 mg IV to differentiate SVT with aberrancy from VT", "Administer verapamil 5 mg IV which is safe for both SVT and VT", "Wait for a 12-lead ECG interpretation before treating"], c: 0, d: 3 },
        { stem: `A ${a}-year-old ${sx} with a pacemaker presents with dizziness and near-syncope. The ECG shows a heart rate of 35 bpm. Pacemaker spikes are visible but not followed by QRS complexes (failure to capture). What is the initial management?`, opts: ["Apply transcutaneous pacing as a bridge while preparing for transport; the implanted pacemaker has failed to capture and external pacing may override the malfunction; also prepare atropine 0.5 mg IV if pacing is not immediately available", "Administer atropine 3 mg IV total to maximize heart rate", "Place a magnet over the pacemaker generator to reset it", "Defibrillate at 200J to reset the pacemaker circuitry"], c: 0, d: 4 },
      ];
      return pick(s);
    }},
    { sub: "Cardioversion/Defibrillation", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} is in unstable atrial fibrillation with a rapid ventricular response (HR 178). BP 72/44, altered mental status, diaphoretic. What is the correct energy level and technique for cardioversion?`, opts: ["Synchronized cardioversion starting at 120-200J biphasic (or 200J monophasic); ensure the sync mode is activated on the defibrillator so the shock is delivered on the R wave to avoid inducing VF", "Unsynchronized defibrillation at 360J monophasic", "Synchronized cardioversion at 50J as the starting energy", "Chemical cardioversion with amiodarone 300 mg IV push is preferred over electrical"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
    { sub: "Pacing", gen: () => {
      const a = pick([62,68,72,78,82]); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} presents with syncope. ECG shows a third-degree (complete) heart block with a ventricular rate of 28 bpm. BP 68/38, altered mental status. Atropine 0.5 mg IV has been given without effect. What is the next intervention?`, opts: ["Initiate transcutaneous pacing: set rate to 60-80 bpm, start at 0 mA and increase current output until electrical capture (pacing spike followed by wide QRS) and mechanical capture (palpable pulse) are achieved; provide sedation/analgesia if the patient is conscious", "Administer a second dose of atropine 1 mg IV", "Apply a dopamine infusion at 2-5 mcg/kg/min for chronotropic effect", "Third-degree heart block is a stable rhythm that rarely requires emergent treatment"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
    { sub: "Heart Failure", gen: () => {
      const a = pick([52,58,62,67,72,78]); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} with known CHF presents sitting bolt upright (orthopnea), with severe dyspnea, bilateral crackles to the lung apices, pink frothy sputum, JVD, and 3+ pedal edema. BP 188/112, HR 112, RR 32, SpO2 82%. What is the most important initial intervention?`, opts: ["CPAP at 5-10 cmH2O — non-invasive positive pressure ventilation reduces preload and afterload while improving oxygenation; also administer nitroglycerin SL or IV for preload/afterload reduction if SBP >100", "Furosemide 40-80 mg IV to rapidly reduce fluid overload", "Morphine 2-4 mg IV to reduce preload and anxiety", "Intubation with RSI for the severe hypoxia"], c: 0, d: 3 },
        { stem: `A ${a}-year-old ${sx} with CHF presents with acute pulmonary edema. BP 82/52 (cardiogenic shock), HR 128, SpO2 78%, altered mental status. CPAP and nitroglycerin are contraindicated due to the hypotension. What is the appropriate approach?`, opts: ["This is cardiogenic shock with pulmonary edema; manage with positive pressure ventilation (BVM or intubation), vasopressor/inotrope support (dopamine or norepinephrine), and rapid transport — avoid aggressive fluid resuscitation which will worsen pulmonary edema", "Administer large-volume IV fluid bolus for the hypotension", "Administer nitroglycerin SL regardless of blood pressure to reduce pulmonary edema", "CPAP at 15 cmH2O can still be used safely with low blood pressure"], c: 0, d: 4 },
      ];
      return pick(s);
    }},
    { sub: "Hypertensive Emergencies", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} presents with BP 232/138, severe headache, visual disturbances, confusion, and vomiting. Fundoscopic exam (if performed) would show papilledema. This presentation represents hypertensive encephalopathy. What is the blood pressure management goal?`, opts: ["Reduce MAP by no more than 20-25% in the first hour using a titratable IV antihypertensive (nicardipine, labetalol, or clevidipine); rapid reduction risks watershed cerebral infarction", "Lower BP to normal (120/80) within 30 minutes using nitroprusside", "Administer nifedipine 10 mg sublingual for rapid BP reduction", "No treatment is needed — hypertension alone is not a prehospital emergency"], c: 0, d: 4 },
      ];
      return pick(s);
    }},
    { sub: "Cardiac Tamponade", gen: () => {
      const a = pick(AGES); const sx = pick(SEX);
      const s = [
        { stem: `A ${a}-year-old ${sx} in a motor vehicle collision has a penetrating chest wound. Assessment reveals Beck's triad: muffled heart sounds, JVD, and hypotension (BP 68/48). Pulsus paradoxus (>10 mmHg drop in SBP during inspiration) is noted. What is the underlying pathophysiology?`, opts: ["Fluid (blood) accumulating in the pericardial sac compresses the heart, preventing adequate ventricular filling during diastole; this reduces stroke volume and cardiac output causing obstructive shock", "Air trapped in the pericardial space from a pneumopericardium", "Myocardial rupture with exsanguination into the chest cavity", "Acute pericarditis causing inflammatory restriction of cardiac motion"], c: 0, d: 3 },
      ];
      return pick(s);
    }},
  ],
};

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const existingStems = await pool.query("SELECT stem FROM allied_questions WHERE career_type='paramedic'");
  const existingHashes = new Set(existingStems.rows.map(r => hashStem(r.stem)));

  const currentCounts = await pool.query("SELECT blueprint_category, COUNT(*) as cnt FROM allied_questions WHERE career_type='paramedic' AND status='approved' GROUP BY blueprint_category");
  const domainMap = {};
  currentCounts.rows.forEach(r => { domainMap[r.blueprint_category] = parseInt(r.cnt); });

  const TARGET = { "Airway Management": 180, "Cardiology/ECG": 210, "Trauma Management": 210, "Medical Emergencies": 210, "ACLS/PALS Protocols": 120, "Pharmacology": 150, "Pediatric Emergencies": 105, "OB Emergencies": 90, "Operations/EMS Systems": 120, "Environmental Emergencies": 60 };

  let totalIns = 0, totalFC = 0;

  for (const [domain, templates] of Object.entries(TEMPLATES)) {
    const target = TARGET[domain] || 100;
    const current = domainMap[domain] || 0;
    let needed = target - current;
    if (needed <= 0) { console.log(`${domain}: already at target (${current}/${target})`); continue; }
    console.log(`\n${domain}: need ${needed} more (have ${current}/${target})`);

    let ins = 0, attempts = 0;
    while (ins < needed && attempts < needed * 8) {
      attempts++;
      const tpl = pick(templates);
      const q = tpl.gen();
      const stem = q.stem;
      const hash = hashStem(stem);
      if (existingHashes.has(hash)) continue;

      const opts = [...q.opts];
      const ci = q.c;
      const diff = q.d || 3;
      const indices = [0,1,2,3];
      for (let i=3;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [indices[i],indices[j]]=[indices[j],indices[i]]; }
      const sh = indices.map(i=>opts[i]);
      const nc = sh.indexOf(opts[ci]);
      const cog = diff<=2?'recall':diff===3?'application':'analysis';
      const slug = `${slugify(domain)}/${slugify(tpl.sub)}`;
      const rat = makeRationale(domain, tpl.sub, sh[nc], sh.filter((_,i)=>i!==nc), slug);
      const pearls = [`Systematic assessment is critical in ${tpl.sub.toLowerCase()} scenarios`,`Reassess after interventions`,`Follow current evidence-based guidelines`];
      const safety = `Ensure scene safety and PPE for ${tpl.sub.toLowerCase()} management.`;
      const dRat = sh.map((o,i)=> i===nc?'Correct answer based on guidelines':'Incorrect for this clinical scenario');
      const trap = `Tests priority identification in ${tpl.sub.toLowerCase()} scenarios`;

      try {
        const r = await pool.query(`INSERT INTO allied_questions (career_type, batch_id, stem, options, correct_answer, rationale_long, learning_objective, blueprint_category, subtopic, difficulty, cognitive_level, question_type, exam_trap, clinical_pearls, safety_note, distractor_rationales, is_free, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING id`,
          ['paramedic', BATCH_ID, stem, JSON.stringify(sh), nc, rat, `Understand ${tpl.sub.toLowerCase()} management`, domain, tpl.sub, diff, cog, 'multiple-choice', trap, JSON.stringify(pearls), safety, JSON.stringify(dRat), false, 'approved']);
        const qid = r.rows[0].id;
        existingHashes.add(hash);
        ins++; totalIns++;
        const cards = [
          {t:'definition',f:`Define key concept in ${tpl.sub}`,b:sh[nc],r:rat.substring(0,500)},
          {t:'clinical_decision',f:`Clinical decision: ${tpl.sub}`,b:pearls[0],r:pearls.slice(1).join(' | ')},
          {t:'red_flag',f:`Safety: ${tpl.sub}`,b:safety,r:`Domain: ${domain}`}
        ];
        for (const c of cards) {
          await pool.query(`INSERT INTO allied_flashcards (career_type, question_id, card_type, front, back, rationale, blueprint_category, subtopic) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            ['paramedic', qid, c.t, c.f, c.b, c.r, domain, tpl.sub]);
          totalFC++;
        }
        if (totalIns % 25 === 0) console.log(`  Progress: ${totalIns} total (${domain}: ${ins}/${needed})`);
      } catch(e) { console.error(`  Err: ${e.message}`); }
    }
    console.log(`  ${domain}: inserted ${ins}/${needed}`);
  }

  console.log('\n========== FILL2 COMPLETE ==========');
  console.log(`Inserted: ${totalIns} questions, ${totalFC} flashcards`);
  const fc = await pool.query("SELECT COUNT(*) as t FROM allied_questions WHERE career_type='paramedic' AND status='approved'");
  console.log(`Total approved: ${fc.rows[0].t}`);
  const cats = await pool.query("SELECT blueprint_category, COUNT(*) as cnt FROM allied_questions WHERE career_type='paramedic' AND status='approved' GROUP BY blueprint_category ORDER BY cnt DESC");
  cats.rows.forEach(r => console.log(`  ${r.blueprint_category}: ${r.cnt}`));
  const diffs = await pool.query("SELECT difficulty, COUNT(*) as cnt FROM allied_questions WHERE career_type='paramedic' AND status='approved' GROUP BY difficulty ORDER BY difficulty");
  diffs.rows.forEach(r => console.log(`  Level ${r.difficulty}: ${r.cnt}`));
  const fcs = await pool.query("SELECT COUNT(*) as t FROM allied_flashcards WHERE career_type='paramedic'");
  console.log(`Total flashcards: ${fcs.rows[0].t}`);
  await pool.end();
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
