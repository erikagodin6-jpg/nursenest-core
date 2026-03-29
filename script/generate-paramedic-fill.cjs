const pg = require('pg');
const crypto = require('crypto');

const BATCH_ID = `paramedic-fill-${Date.now()}`;

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function hashStem(stem) {
  return crypto.createHash('md5').update(stem.toLowerCase().trim()).digest('hex');
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

const AGES = { adult: [22,25,28,31,34,37,42,45,48,52,55,58,61,64,67,71,74,78,82,86], peds: [2,3,4,5,6,7,8,10,12,14], infant: [3,6,9,12,15,18], neonate: [0], ob: [18,20,22,24,26,28,30,32,34,36,38,40] };
const SEX = ['male', 'female'];

function vitals(context) {
  const templates = {
    normal: { sbp: [112,118,124,130], dbp: [68,72,76,80], hr: [72,78,82,86], rr: [14,16,18], spo2: [97,98,99] },
    tachycardic: { sbp: [108,112,118], dbp: [64,68,72], hr: [108,118,124,132,138], rr: [22,24,26], spo2: [94,96,97] },
    hypotensive: { sbp: [72,78,82,86,88,92], dbp: [40,44,48,52], hr: [118,124,132,138,144], rr: [24,26,28,30], spo2: [88,90,92,94] },
    hypertensive: { sbp: [178,186,192,198,204,212], dbp: [96,102,108,114], hr: [82,88,92], rr: [18,20,22], spo2: [96,97,98] },
    bradycardic: { sbp: [82,88,92], dbp: [48,52,56], hr: [32,36,38,42,44], rr: [12,14,16], spo2: [92,94,96] },
    respiratory: { sbp: [118,124,132], dbp: [72,76,80], hr: [108,112,118,124], rr: [28,32,36,40], spo2: [78,82,84,86,88] },
    peds_normal: { sbp: [88,92,96], dbp: [56,60,64], hr: [98,108,118], rr: [22,24,26], spo2: [97,98,99] },
    peds_shock: { sbp: [68,72,76], dbp: [40,44,48], hr: [148,156,164,172], rr: [30,34,38], spo2: [88,90,92] },
  };
  const t = templates[context] || templates.normal;
  return { sbp: pick(t.sbp), dbp: pick(t.dbp), hr: pick(t.hr), rr: pick(t.rr), spo2: pick(t.spo2) };
}

function generateRationale(domain, subtopic, correct, wrongs, lessonSlug) {
  return `## Correct Answer Analysis

The correct answer is "${correct}". This represents the most appropriate intervention based on current evidence-based prehospital practice guidelines for ${subtopic.toLowerCase()} within ${domain}.

In the emergency prehospital setting, paramedics must rapidly assess patients and prioritize interventions based on clinical presentation. This clinical vignette tests the candidate's ability to identify the highest-priority action when managing a ${subtopic.toLowerCase()} scenario. The correct response follows established protocols from the American Heart Association (AHA), National Association of EMS Physicians (NAEMSP), International Trauma Life Support (ITLS), and Prehospital Trauma Life Support (PHTLS) guidelines.

The pathophysiological rationale for choosing this answer centers on understanding the underlying mechanism of the patient's presentation. When vital signs, assessment findings, and clinical context align as described in the vignette, the correct intervention directly addresses the most immediate physiological derangement. This may involve airway management, circulatory support, pharmacological intervention, or rapid transport decision-making depending on the specific clinical scenario.

Key considerations that make this the best answer include: the timing and urgency of the intervention, alignment with the primary survey priorities (ABCDE approach), evidence-based efficacy of the treatment, and the specific clinical indicators present in the patient's presentation.

## Why Each Incorrect Answer Is Wrong

**"${wrongs[0]}"** — While this may seem like a reasonable option, it is incorrect in this specific clinical context. This answer either addresses a lower-priority concern, represents an intervention that would be appropriate at a different stage of care, or reflects an outdated practice that has been superseded by current evidence. Candidates who select this answer typically confuse the priority hierarchy or fail to identify the most critical finding in the patient's presentation. In prehospital care, understanding the difference between "correct intervention, wrong timing" and "best immediate action" is essential for both exam success and patient outcomes.

**"${wrongs[1]}"** — This distractor is designed to attract candidates who have partial knowledge of the topic. While the intervention described may have clinical merit in a related scenario, the specific patient presentation in this vignette makes it suboptimal. Common errors include: applying hospital-based protocols to the prehospital setting, reversing the order of assessment and treatment steps, or selecting an intervention that is appropriate for a different pathology with similar presenting symptoms. The key differentiating factors in this scenario include the vital sign pattern, the specific assessment findings, and the clinical timeline described.

**"${wrongs[2]}"** — This option represents a common misconception or a less-preferred alternative that candidates may select if they have not thoroughly reviewed current guidelines. While there may be limited circumstances where this approach is used, the clinical scenario presented here clearly indicates a different course of action. Selecting this answer demonstrates either unfamiliarity with current treatment algorithms, confusion between similar clinical presentations, or failure to integrate all the clinical data provided in the vignette.

## Clinical Pearl

Evidence-based management of ${subtopic.toLowerCase()} requires integration of assessment findings, vital sign interpretation, and protocol-based decision-making. Key clinical pearls include: (1) Always complete a systematic primary survey before initiating definitive treatment. (2) Trending vital signs provides more clinical value than a single measurement. (3) Treatment protocols may vary by jurisdiction — always follow local medical direction. (4) Documentation of findings, interventions, and patient response is critical for continuity of care and quality improvement. (5) Reassessment after every intervention is mandatory to evaluate treatment effectiveness.

## How Exam Writers Try to Trick You

This question uses several common exam-writing techniques to test depth of knowledge: (1) Including interventions that are correct but not highest priority — forcing the candidate to rank rather than simply recognize correct answers. (2) Using clinical findings that could suggest multiple conditions — testing differential diagnosis skills. (3) Including vital sign values that require interpretation in the clinical context. (4) Placing the correct answer in a randomized position to prevent pattern recognition. The key to answering correctly is to read the entire clinical vignette, identify ALL relevant findings, and select the answer that addresses the most immediate clinical priority based on the ABCDE approach.

## Intervention Considerations and Priority Hierarchy

The management priority for this scenario follows: (1) Scene safety and appropriate PPE. (2) Primary assessment using ABCDE. (3) Address immediate life threats. (4) Targeted interventions based on clinical findings. (5) Reassessment after each intervention. (6) Transport decision including destination selection. (7) Ongoing monitoring and documentation during transport. (8) Structured handover communication at the receiving facility.

## Scenario Variations

If the patient's presentation differed (e.g., different vital signs, altered mental status, additional injuries/conditions), the correct answer might change significantly. Understanding how clinical variables affect decision-making is essential for adaptive patient care and exam success.

Learn more: /paramedic/lessons/${lessonSlug}`;
}

const QUESTION_TEMPLATES = [
  {
    domain: "Pediatric Emergencies",
    questions: [
      { subtopic: "Pediatric Assessment Triangle", generate: () => {
        const age = pick([6,8,12,18,24]); const ageStr = age < 12 ? `${age}-month-old` : `${Math.floor(age/12)}-year-old`;
        const presentations = [
          { finding: "limp in the parent's arms with mottled skin and weak cry, not tracking movements", question: "Using the Pediatric Assessment Triangle, what does this overall presentation suggest?", options: ["Cardiopulmonary failure with all three sides abnormal (appearance, breathing, circulation)", "Compensated respiratory distress with increased work of breathing only", "Simple febrile illness with normal appearance and circulation", "Behavioral emergency with abnormal appearance only"], correct: 0, diff: 3 },
          { finding: "sitting upright, alert and crying, with visible intercostal retractions, nasal flaring, and audible stridor, but with pink warm skin", question: "Based on the PAT, what is the most accurate assessment?", options: ["Respiratory distress with abnormal work of breathing but adequate circulation and appearance", "Respiratory failure requiring immediate intubation", "Normal pediatric presentation with expected crying behavior", "Cardiopulmonary failure with circulatory compromise"], correct: 0, diff: 2 },
          { finding: "alert and playful but with diffuse petechiae, pale skin, and prolonged capillary refill >4 seconds", question: "Using the PAT, which component is most concerning?", options: ["Circulation to skin is abnormal suggesting compensated shock despite normal appearance", "Appearance is the most concerning component in this presentation", "Work of breathing is abnormal requiring respiratory intervention", "All three components are abnormal suggesting decompensated shock"], correct: 0, diff: 3 },
        ];
        const p = pick(presentations);
        return { stem: `You respond to a ${ageStr} child with fever. On your across-the-room assessment, the child appears ${p.finding}. ${p.question}`, options: p.options, correct: p.correct, difficulty: p.diff };
      }},
      { subtopic: "Pediatric Airway", generate: () => {
        const scenarios = [
          { stem: (a) => `A ${a}-year-old child presents with high fever, drooling, tripod positioning, and a muffled "hot potato" voice. The child refuses to lie down and appears toxic. SpO2 is 94%. What is the most critical consideration for airway management?`, options: ["Allow the child to maintain a position of comfort, provide humidified oxygen, and avoid agitating the child; prepare for possible complete airway obstruction during transport", "Immediately examine the oropharynx with a tongue depressor to visualize the epiglottis", "Lay the child supine and attempt oral intubation using direct laryngoscopy", "Suction the airway aggressively and insert a nasopharyngeal airway"], correct: 0, diff: 4 },
          { stem: (a) => `A ${a}-year-old child is in respiratory failure with a respiratory rate of 8, SpO2 78%, and altered mental status. BVM ventilation with an appropriately sized mask is ineffective despite repositioning and OPA insertion. What is the next step?`, options: ["Attempt placement of an appropriately sized supraglottic airway device", "Continue BVM with two-person technique before any other intervention", "Perform an emergency surgical cricothyrotomy", "Insert a nasopharyngeal airway and retry BVM ventilation"], correct: 0, diff: 3 },
          { stem: (a) => `A ${a}-year-old (25 kg) child requires endotracheal intubation. Using the age-based formula (age/4 + 3.5 for cuffed tubes), what is the appropriate uncuffed ETT size and the correct depth of insertion?`, options: ["Uncuffed ETT size 5.5 (age/4 + 4), inserted to approximately 16.5 cm at the lip (3x tube size)", "Uncuffed ETT size 4.0, inserted to 12 cm at the lip", "Uncuffed ETT size 7.0, inserted to 21 cm at the lip", "Use only cuffed tubes in children over 2 years old"], correct: 0, diff: 3 },
        ];
        const s = pick(scenarios);
        const age = pick([3,4,5,6,8]);
        return { stem: s.stem(age), options: s.options, correct: s.correct, difficulty: s.diff };
      }},
      { subtopic: "Pediatric Pharmacology", generate: () => {
        const weight = pick([10,12,15,18,20,22,25]);
        const scenarios = [
          { stem: `A ${pick([2,3,4,5])}-year-old child weighing ${weight} kg is having a generalized seizure lasting 7 minutes. No IV access is available. What is the most appropriate medication and dose?`, options: [`Midazolam ${(weight * 0.2).toFixed(1)} mg (0.2 mg/kg) intranasally`, `Diazepam ${weight * 0.5} mg (0.5 mg/kg) rectally`, `Lorazepam ${(weight * 0.1).toFixed(1)} mg (0.1 mg/kg) IV after establishing access first`, `Phenobarbital ${weight * 20} mg (20 mg/kg) IM`], correct: 0, diff: 3 },
          { stem: `A ${pick([4,5,6,7,8])}-year-old child weighing ${weight} kg is in anaphylaxis with stridor and hypotension. What is the correct epinephrine dose?`, options: [`Epinephrine 0.01 mg/kg (${(weight * 0.01).toFixed(2)} mg) of 1:1,000 IM in the anterolateral thigh`, `Epinephrine 0.1 mg/kg (${weight * 0.1} mg) of 1:10,000 IV push`, `Epinephrine 0.3 mg IM regardless of weight (adult EpiPen dose)`, `Epinephrine 0.01 mg/kg of 1:10,000 IM`], correct: 0, diff: 2 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Child Abuse Recognition", generate: () => {
        const scenarios = [
          { stem: `An 8-month-old is brought to the ambulance by a caregiver who states the child "fell off the bed." The infant has a spiral fracture of the humerus, multiple bruises on the back and buttocks in various stages of healing, and a torn frenulum. The caregiver's description of events is inconsistent between tellings. Which combination of findings is most suggestive of non-accidental trauma?`, options: ["Spiral long bone fracture in a pre-ambulatory infant combined with bruises to protected areas and an inconsistent history", "The spiral fracture alone, as all spiral fractures indicate child abuse", "Bruising on the back, which is common in active infants learning to roll", "The torn frenulum, which commonly occurs during bottle feeding"], correct: 0, diff: 3 },
          { stem: `You respond to a 3-year-old with scalding burns to both feet in a stocking distribution with a clear line of demarcation. The burns extend evenly up to the ankles bilaterally. The caregiver reports the child climbed into a hot bath. What pattern suggests this injury may be inflicted rather than accidental?`, options: ["The bilateral stocking pattern with uniform depth and clear demarcation lines is consistent with forced immersion rather than accidental exposure", "All pediatric scald burns should be assumed to be accidental", "The location on the feet is typical for accidental bath injuries in this age group", "A 3-year-old is developmentally capable of climbing into a bath, supporting the caregiver's story"], correct: 0, diff: 4 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Pediatric Trauma", generate: () => {
        const age = pick([4,5,6,7,8,10,12]);
        const weight = age * 2 + 8;
        const scenarios = [
          { stem: `A ${age}-year-old (${weight} kg) child is struck by a car while crossing the street (Waddell's triad mechanism). The child has a femur fracture, abdominal tenderness, and a head laceration. GCS 13, HR ${120 + randInt(0,30)}, RR ${24 + randInt(0,8)}, BP ${80 + randInt(0,10)}/${50 + randInt(0,10)}, capillary refill 3 seconds. What is the initial fluid resuscitation volume?`, options: [`20 mL/kg (${weight * 20} mL) isotonic crystalloid bolus, reassess after each bolus up to 3 boluses`, `10 mL/kg (${weight * 10} mL) isotonic crystalloid, then reassess`, `40 mL/kg (${weight * 40} mL) isotonic crystalloid as rapidly as possible`, `Immediate blood transfusion at 10 mL/kg without crystalloid`], correct: 0, diff: 2 },
          { stem: `A ${age}-year-old restrained passenger in a high-speed MVC presents with a seatbelt sign across the abdomen (ecchymosis in a linear pattern), abdominal pain and distension, and decreased bowel sounds. HR ${140 + randInt(0,20)}, RR 28, BP ${70 + randInt(0,10)}/${40 + randInt(0,10)}. What injury pattern is most concerning?`, options: ["Hollow viscus injury (bowel perforation) or mesenteric laceration associated with lap belt mechanism", "Isolated abdominal wall contusion without internal injury", "Lumbar spine fracture only (Chance fracture)", "Hepatic laceration from the shoulder belt component"], correct: 0, diff: 4 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Pediatric Medical Emergencies", generate: () => {
        const scenarios = [
          { stem: `A 2-year-old presents with a barking cough, inspiratory stridor at rest, and moderate suprasternal and intercostal retractions for the past 4 hours. Temperature 38.8°C, HR 142, RR 36, SpO2 91%. The child has a history of URI symptoms for 2 days. Based on the Westley Croup Score, this child has moderate-to-severe croup. What is the most appropriate prehospital management?`, options: ["Administer nebulized racemic epinephrine 0.5 mL of 2.25% in 3 mL NS, maintain position of comfort, and provide blow-by oxygen", "Place the child supine, suction the oropharynx, and prepare for immediate intubation", "Administer nebulized albuterol 2.5 mg for the stridor and provide supplemental oxygen", "Visualize the airway with direct laryngoscopy to rule out epiglottitis"], correct: 0, diff: 3 },
          { stem: `A 6-month-old is found by parents lying face down in the crib, apneic, cyanotic, and limp. On arrival, the infant has agonal gasps at 4/min, HR 62 by auscultation, and is unresponsive. SpO2 is unreadable. What is the immediate priority intervention?`, options: ["Begin positive pressure ventilation with BVM using room air or low-flow oxygen at 40-60 breaths/min", "Begin chest compressions at a rate of 100-120/min with a 15:2 ratio", "Establish IO access and administer epinephrine 0.01 mg/kg", "Apply the AED and analyze the rhythm"], correct: 0, diff: 3 },
          { stem: `A 10-year-old with known sickle cell disease presents with severe chest pain, fever of 39.5°C, tachypnea (RR 34), SpO2 86%, and bilateral pulmonary infiltrates on history. BP 98/62, HR 128. This presentation is most consistent with which life-threatening complication?`, options: ["Acute chest syndrome requiring high-flow oxygen, IV fluids, and emergent transport to a facility capable of exchange transfusion", "Simple pneumonia requiring outpatient antibiotics", "Sickle cell pain crisis requiring only analgesics and hydration", "Pulmonary embolism requiring anticoagulation"], correct: 0, diff: 4 },
          { stem: `A ${pick([3,4,5])}-year-old is brought to the ambulance after ingesting approximately 20 of their grandmother's iron tablets (325 mg each) approximately 2 hours ago. The child is vomiting and has bloody diarrhea. HR 138, BP 82/48. What is the critical prehospital concern and management?`, options: ["Iron poisoning can cause hemorrhagic gastritis, shock, and hepatic failure; provide IV fluid resuscitation for shock and rapid transport for deferoxamine therapy", "Administer activated charcoal 1 g/kg to absorb the iron tablets", "Induce vomiting with ipecac syrup to remove the tablets", "Iron tablets are generally benign; provide supportive care during transport"], correct: 0, diff: 4 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "PALS Algorithms", generate: () => {
        const scenarios = [
          { stem: `A 3-year-old (15 kg) is found in pulseless ventricular tachycardia. After the first defibrillation at 2 J/kg (30J) and 2 minutes of high-quality CPR, the rhythm check shows persistent pulseless VT. What is the correct next sequence of interventions?`, options: ["Defibrillate at 4 J/kg (60J), resume CPR, administer epinephrine 0.01 mg/kg (0.15 mg of 1:10,000) IV/IO", "Administer amiodarone 5 mg/kg IV before the next defibrillation attempt", "Continue CPR for 5 more minutes before the next rhythm check", "Administer adenosine 0.1 mg/kg rapid IV push"], correct: 0, diff: 3 },
          { stem: `An 8-year-old (25 kg) child presents with SVT at 260 bpm, is pale, diaphoretic, with delayed capillary refill and BP 72/40. Vagal maneuvers have been attempted without success. What is the first pharmacological intervention?`, options: ["Adenosine 0.1 mg/kg (2.5 mg) rapid IV push followed by immediate 10 mL NS flush", "Amiodarone 5 mg/kg (125 mg) IV over 20-60 minutes", "Synchronized cardioversion at 0.5 J/kg (12.5 joules)", "Verapamil 0.1 mg/kg IV slowly over 2 minutes"], correct: 0, diff: 3 },
          { stem: `A 5-year-old is in PEA cardiac arrest. After 2 minutes of CPR and epinephrine administration, the rhythm check still shows organized electrical activity but no pulse. The EtCO2 is 14 mmHg. Which of the H's and T's should be systematically evaluated?`, options: ["Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia, Tension pneumothorax, Tamponade, Toxins, Thromboembolism", "Only hypovolemia and hypoxia as these are the most common causes in pediatrics", "Tension pneumothorax only, as it is the most common reversible cause of PEA", "No further evaluation needed; continue CPR and epinephrine every 3-5 minutes"], correct: 0, diff: 3 },
        ];
        return pick(scenarios);
      }},
    ]
  },
  {
    domain: "OB Emergencies",
    questions: [
      { subtopic: "Normal Delivery", generate: () => {
        const scenarios = [
          { stem: `A 29-year-old G2P1 at 38 weeks is in active labor in the ambulance. Contractions are every 2 minutes. Crowning is visible. After delivery of the head, you notice the umbilical cord is wrapped once around the baby's neck (nuchal cord). The cord is loose. What is the most appropriate action?`, options: ["Gently slip the cord over the baby's head and continue delivery", "Immediately clamp and cut the cord before delivering the body", "Push the baby's head back in and prepare for emergency cesarean", "Stop the delivery and wait for additional resources"], correct: 0, diff: 2 },
          { stem: `You are delivering a baby in the field. The head has delivered but the baby's face appears dusky. After suctioning the mouth and nose, the next contraction occurs but the shoulders do not deliver. You recognize this as shoulder dystocia. After McRoberts maneuver and suprapubic pressure fail, what is the next maneuver to attempt?`, options: ["Deliver the posterior arm by sweeping it across the chest", "Apply fundal pressure to push the baby through the pelvis", "Rotate the baby's head 360 degrees to dislodge the shoulders", "Perform the Zavanelli maneuver (push the head back in)"], correct: 0, diff: 5 },
          { stem: `A primigravida at 40 weeks has just delivered a healthy newborn. The umbilical cord is still intact and pulsating. Per current evidence-based guidelines, when should the cord be clamped and cut?`, options: ["Delay cord clamping for at least 30-60 seconds after birth (or until cord stops pulsating) unless the neonate requires immediate resuscitation", "Immediately upon delivery of the infant to prevent polycythemia", "Only after the placenta delivers completely", "At exactly 5 minutes post-delivery regardless of circumstances"], correct: 0, diff: 2 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Breech Presentation", generate: () => {
        const scenarios = [
          { stem: `A 34-year-old G3P2 at 36 weeks presents with active labor and the baby's buttocks visible at the introitus (frank breech). The cervix is fully dilated and delivery is imminent. The nearest hospital is 20 minutes away. What is the most appropriate prehospital management?`, options: ["Support the delivery by allowing the body to deliver spontaneously up to the umbilicus, then provide gentle traction for the arms and apply Mauriceau-Smellie-Veit maneuver for the head", "Push the buttocks back in and transport in Trendelenburg with knees together", "Perform an emergency cesarean section in the field", "Apply traction to the buttocks to expedite delivery"], correct: 0, diff: 5 },
          { stem: `During a field delivery, you observe a single foot presenting at the vaginal opening (footling breech). Contractions are 3 minutes apart. The mother is 35 weeks gestation. What is the priority action?`, options: ["Do NOT pull on the presenting foot; position the mother in left lateral Trendelenburg, provide high-flow oxygen, and transport rapidly for hospital delivery", "Grasp the foot gently and apply downward traction during contractions", "Push the foot back into the birth canal and transport", "Begin pushing maneuvers to expedite the delivery"], correct: 0, diff: 4 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Cord Prolapse", generate: () => {
        const scenarios = [
          { stem: `A 28-year-old G2P1 at 34 weeks has spontaneous rupture of membranes. On visual examination, you see a loop of umbilical cord protruding from the vagina. Fetal heart tones are detected at 90 bpm (normally 120-160). What is the most critical immediate intervention?`, options: ["Insert a gloved hand into the vagina to elevate the presenting part off the cord, position the mother in exaggerated knee-chest or Trendelenburg, and transport emergently for cesarean delivery", "Attempt to push the cord back into the uterus to relieve compression", "Clamp and cut the cord and attempt to deliver the baby immediately", "Apply warm moist sterile dressing to the cord and transport without any other intervention"], correct: 0, diff: 3 },
          { stem: `A primigravida at 37 weeks reports feeling a "pulsating cord" in her vagina after her water broke. On exam, you confirm a cord prolapse with fetal heart tones of 72 bpm. You elevate the presenting part with your gloved hand. During transport, the fetal heart rate improves to 138 bpm. Should you remove your hand?`, options: ["No — maintain elevation of the presenting part off the cord throughout transport until surgical delivery", "Yes — since the heart rate normalized, the emergency is resolved", "Remove your hand only if the cord appears to stop pulsating", "Remove your hand and apply a clamp to prevent further prolapse"], correct: 0, diff: 3 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Eclampsia", generate: () => {
        const scenarios = [
          { stem: `A 24-year-old G1P0 at 32 weeks presents with severe headache, visual disturbances (seeing spots), and right upper quadrant pain. BP 182/114, HR 102, 3+ pedal edema, and brisk deep tendon reflexes. She has not had a seizure. Based on these findings suggesting severe preeclampsia, what is the priority prehospital medication?`, options: ["Magnesium sulfate 4g IV over 15-20 minutes for seizure prophylaxis, with close monitoring of respiratory rate and reflexes", "Hydralazine 5 mg IV to lower blood pressure below 140/90", "Labetalol 20 mg IV to achieve blood pressure reduction first", "Diazepam 5 mg IV for seizure prophylaxis"], correct: 0, diff: 4 },
          { stem: `A 31-year-old G2P1 at 36 weeks had an eclamptic seizure 3 minutes ago. She is now postictal. BP 196/122, HR 112, RR 18, SpO2 93%. Magnesium sulfate 4g IV was administered as a loading dose. She begins seizing again. What is the most appropriate intervention?`, options: ["Administer an additional 2g magnesium sulfate IV over 3-5 minutes as a rescue dose", "Administer diazepam 5-10 mg IV to terminate the seizure", "Administer labetalol 40 mg IV to lower blood pressure urgently", "No additional medication; position patient on side and protect from injury"], correct: 0, diff: 4 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Postpartum Hemorrhage", generate: () => {
        const scenarios = [
          { stem: `A 33-year-old delivered her baby 5 minutes ago. The placenta has been delivered intact. She is now experiencing heavy vaginal bleeding estimated at 700 mL. On palpation, the uterine fundus is soft and boggy above the umbilicus. BP 98/62, HR 126, skin is pale. What is the most important immediate intervention?`, options: ["Perform vigorous bimanual uterine massage to stimulate uterine contraction, while establishing IV access for fluid resuscitation", "Pack the vagina tightly with sterile gauze to tamponade the bleeding", "Administer tranexamic acid 1g IV immediately before any other intervention", "Elevate the legs and apply a pneumatic anti-shock garment"], correct: 0, diff: 3 },
          { stem: `After a field delivery, a 27-year-old continues to bleed heavily despite 10 minutes of continuous uterine massage. The uterus remains atonic. Estimated blood loss is now 1200 mL. BP 82/48, HR 144, SpO2 97%. Two large-bore IVs are running wide open. What additional pharmacological intervention may be available per protocols?`, options: ["Oxytocin 10-40 units in 1L NS infused rapidly if available per protocol, or misoprostol 800 mcg sublingual/rectal", "Epinephrine 1 mg IV push for the hemorrhagic shock", "Calcium gluconate 1g IV to promote uterine contraction", "Magnesium sulfate 4g IV to reduce uterine bleeding"], correct: 0, diff: 4 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Neonatal Care", generate: () => {
        const scenarios = [
          { stem: `A newborn delivered at 35 weeks gestation is breathing but has persistent central cyanosis with SpO2 of 78% at 5 minutes of life despite stimulation and blow-by oxygen. Heart rate is 132 bpm and the baby has good tone. What is the most appropriate next intervention?`, options: ["Provide free-flow oxygen or CPAP at 5-8 cmH2O and titrate to target SpO2 of 85-95% by 10 minutes of life", "Begin positive pressure ventilation immediately as the SpO2 is below 80%", "The SpO2 is expected for a 5-minute-old preterm infant; continue observation", "Intubate and provide mechanical ventilation for persistent cyanosis"], correct: 0, diff: 3 },
          { stem: `A term newborn is delivered at home and is crying vigorously with good tone, pink centrally, HR 148, and moving all extremities. After drying and suctioning, what are the priority initial steps?`, options: ["Maintain warmth (skin-to-skin with mother or warm blankets), assign APGAR scores at 1 and 5 minutes, clamp and cut the cord, and monitor", "Immediately suction deeply with a DeLee catheter to prevent meconium aspiration", "Administer naloxone 0.1 mg/kg IM as prophylaxis if the mother received opioids", "Begin BVM ventilation at 40-60 breaths/min to ensure adequate oxygenation"], correct: 0, diff: 1 },
          { stem: `During NRP of a newborn who is apneic and limp after delivery, you provide 30 seconds of effective PPV. The heart rate remains at 52 bpm. What is the next intervention per NRP guidelines?`, options: ["Begin chest compressions coordinated with PPV at a 3:1 ratio (90 compressions and 30 ventilations per minute)", "Continue PPV only for another 30 seconds before reassessing", "Administer epinephrine 0.01 mg/kg IV/IO immediately", "Defibrillate at 2 J/kg for assumed cardiac arrest"], correct: 0, diff: 3 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Placental Abruption", generate: () => {
        const scenarios = [
          { stem: `A 30-year-old G3P2 at 35 weeks presents after a fall down stairs with severe constant abdominal pain. Her uterus is rigid and tender on palpation. Dark red vaginal bleeding is present. BP 94/58, HR 132, RR 24. Fetal heart tones are 100 bpm and irregular. What is the most likely diagnosis and priority prehospital management?`, options: ["Placental abruption; establish two large-bore IVs, administer crystalloid for shock, position left lateral, and transport emergently to a facility capable of emergency cesarean section", "Placenta previa; avoid vaginal examination and transport in supine position", "Normal labor with bloody show; time contractions and transport routinely", "Uterine rupture; apply MAST garment and transport to nearest facility"], correct: 0, diff: 3 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Ectopic Pregnancy", generate: () => {
        const scenarios = [
          { stem: `A 26-year-old female presents with sudden onset sharp right lower quadrant pain, vaginal spotting, and dizziness. Her last menstrual period was 7 weeks ago. BP 88/52, HR 128, RR 22, skin is pale and diaphoretic. Abdominal exam reveals right-sided tenderness with rebound. What is the most likely life-threatening diagnosis?`, options: ["Ruptured ectopic pregnancy with intraperitoneal hemorrhage", "Appendicitis with peritonitis", "Ovarian torsion with ischemia", "Spontaneous abortion with incomplete passage"], correct: 0, diff: 3 },
        ];
        return pick(scenarios);
      }},
    ]
  },
  {
    domain: "Operations/EMS Systems",
    questions: [
      { subtopic: "Scene Safety", generate: () => {
        const scenarios = [
          { stem: `You respond to a residence for a "person not breathing." On arrival, you notice a strong chemical odor, the front door is open, and a person is lying just inside the doorway. A suicide note is visible on the porch. What is the most appropriate initial action?`, options: ["Do not enter; retreat to a safe distance upwind, request hazmat/fire resources, and consider possible chemical exposure or hazardous environment", "Enter quickly holding your breath to pull the patient out", "Put on an N95 mask and enter to assess the patient", "Wait for law enforcement to declare the scene safe before any action"], correct: 0, diff: 2 },
          { stem: `You arrive at a domestic violence call where the patient reportedly has stab wounds. Police have not yet arrived. As you approach, you hear yelling and breaking glass from inside the residence. What is the correct action?`, options: ["Stage at a safe distance and do not approach until law enforcement secures the scene", "Enter the residence to provide immediate care since the patient may be dying", "Announce your presence loudly and enter with your medical bag", "Drive past the scene and respond to the next call"], correct: 0, diff: 1 },
          { stem: `While responding to an accident on the highway at night, you arrive to find a vehicle overturned across both lanes. There is no fire department on scene yet. What is the first priority for crew safety?`, options: ["Position the ambulance to create a safe work zone upstream of traffic with emergency lights activated, and deploy traffic cones or flares", "Immediately begin patient extrication from the overturned vehicle", "Wait for fire department to arrive before approaching the scene", "Turn off all ambulance lights to avoid distracting oncoming traffic"], correct: 0, diff: 2 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "MCI and Triage", generate: () => {
        const scenarios = [
          { stem: `At a train derailment MCI, you are performing START triage. You encounter an adult who walks to you complaining of wrist pain and a laceration on the forehead with controlled bleeding. What triage tag color should this patient receive?`, options: ["GREEN (Minor/Walking Wounded) — the patient is ambulatory and has non-life-threatening injuries", "YELLOW (Delayed) — the forehead laceration needs assessment for possible head injury", "RED (Immediate) — all head injuries should be triaged as immediate priority", "BLACK (Expectant) — there are not enough resources for minor injuries during an MCI"], correct: 0, diff: 1 },
          { stem: `During START triage at an explosion, you approach a patient who is not breathing. You reposition the airway with a head-tilt chin-lift and the patient does not begin breathing. What is the correct triage decision?`, options: ["Tag BLACK (Expectant/Deceased) and move to the next patient", "Begin CPR for 2 minutes and then reassess", "Tag RED (Immediate) and begin airway interventions", "Attempt to insert an OPA and provide 2 rescue breaths before tagging"], correct: 0, diff: 2 },
          { stem: `You are incident commander at an MCI with 35 patients. You have 5 ambulances on scene. Using the START triage system, you have categorized: 5 RED, 12 YELLOW, 15 GREEN, 3 BLACK. Which patients should be transported first?`, options: ["RED (Immediate) patients should be transported first to the nearest appropriate facilities, distributing patients across hospitals to avoid overwhelming any single ED", "GREEN patients first since they can provide their own history", "YELLOW patients first since they represent the largest group", "Transport all patients to the nearest Level I trauma center"], correct: 0, diff: 2 },
          { stem: `At an MCI involving a school bus rollover with 20+ pediatric patients, you are using JumpSTART triage. You encounter a 4-year-old who is apneic after opening the airway but has a palpable pulse. Per JumpSTART protocol, what is the next step?`, options: ["Provide 5 rescue breaths; if the child begins breathing, tag RED; if not breathing, tag BLACK", "Immediately tag BLACK since the child is not breathing", "Begin full CPR with chest compressions and ventilations", "Tag RED and begin continuous BVM ventilation throughout triage"], correct: 0, diff: 3 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Vehicle Extrication", generate: () => {
        const scenarios = [
          { stem: `A patient is pinned in a vehicle with dashboard compression to both lower extremities. The patient has been trapped for approximately 30 minutes. HR 96, BP 118/78, complaining of bilateral leg numbness. As the fire department prepares to use hydraulic tools, what medical concern must you prepare for during extrication?`, options: ["Crush syndrome with potential hyperkalemia and cardiac arrest upon release; prepare for rapid IV fluid administration (NS 1-2L) before and during release of compression, cardiac monitoring, and sodium bicarbonate", "Compartment syndrome requiring immediate fasciotomy in the field", "Fat embolism that will occur immediately upon freeing the patient", "Rhabdomyolysis is only a concern after 6+ hours of entrapment"], correct: 0, diff: 4 },
          { stem: `During an extrication, the patient's condition suddenly deteriorates with increasing respiratory distress, absent breath sounds on the left, and tracheal deviation to the right. BP drops to 78/42. Fire department estimates 5 more minutes to free the patient. What is the immediate priority?`, options: ["Perform needle decompression of the left chest at the 2nd ICS MCL or 5th ICS MAL for tension pneumothorax before extrication is complete", "Wait until the patient is extricated before performing any interventions", "Request fire department to expedite extrication and prepare for rapid transport", "Begin BVM ventilation to address the respiratory distress"], correct: 0, diff: 3 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Hazmat Awareness", generate: () => {
        const scenarios = [
          { stem: `You respond to a warehouse where multiple workers are symptomatic with pinpoint pupils, excessive salivation, lacrimation, urination, vomiting, and muscle fasciculations. This SLUDGEM presentation suggests exposure to which class of substance?`, options: ["Organophosphate (cholinesterase inhibitor/nerve agent) requiring atropine and pralidoxime as antidotes", "Carbon monoxide requiring high-flow oxygen therapy", "Hydrogen cyanide requiring hydroxocobalamin", "Chlorine gas requiring bronchodilator therapy"], correct: 0, diff: 3 },
          { stem: `A tanker truck has overturned on the highway. You arrive first and observe a diamond-shaped placard with blue background and the number 4. Using the ERG (Emergency Response Guidebook), what does this indicate?`, options: ["The substance is a dangerous when wet/water-reactive material; do not apply water and establish a large isolation zone", "The substance is flammable and requires foam application", "The substance is an oxidizer that supports combustion", "The substance is a poison requiring specific antidote treatment"], correct: 0, diff: 3 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Air Medical Transport", generate: () => {
        const scenarios = [
          { stem: `You are establishing a helicopter landing zone (LZ) for a trauma patient. Which of the following is the minimum recommended LZ size and surface requirement for helicopter operations?`, options: ["100 x 100 feet (30 x 30 meters) minimum on flat, firm ground clear of debris, wires, and obstructions, with wind direction indicator", "50 x 50 feet on any available paved surface", "200 x 200 feet with runway-style lighting", "Any flat area large enough for the helicopter to fit"], correct: 0, diff: 2 },
          { stem: `A patient with suspected aortic dissection needs transfer to a cardiac surgery center 90 minutes away by ground. A helicopter can transport in 25 minutes but has not yet been dispatched. The patient currently has BP 92/54 in the right arm and 158/96 in the left arm, HR 108, and is receiving IV esmolol. What is the most appropriate transport decision?`, options: ["Request helicopter transport given the time-critical nature of aortic dissection and the significant time savings", "Transport by ground since the patient is hemodynamically stable on current medications", "Transfer the patient to the nearest ED for stabilization before any further transport", "Delay transport until a second IV line is established and blood pressure is controlled bilaterally"], correct: 0, diff: 3 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Handover Communication", generate: () => {
        const scenarios = [
          { stem: `You are transferring care of a multi-system trauma patient to the trauma team. Which communication framework provides the most structured and complete handover?`, options: ["MIST format: Mechanism of injury, Injuries found/suspected, Signs and vital signs, Treatment given and response", "Quick verbal summary of chief complaint and treatments given", "Written patient care report hand-off without verbal communication", "AVPU-based report focusing only on the patient's level of consciousness"], correct: 0, diff: 2 },
          { stem: `During handover of a STEMI patient to the cath lab team, the receiving cardiologist asks about the patient's current medications, allergies, and time of symptom onset. You realize your partner obtained this information but you don't recall the details. What is the most appropriate action?`, options: ["Ask your partner to provide the specific details rather than guessing; accurate information transfer is critical for patient safety", "Provide approximate information to avoid delaying the procedure", "Tell the cardiologist to check the patient care report for that information", "Skip those details as they are not critical for PCI"], correct: 0, diff: 2 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Documentation Standards", generate: () => {
        const scenarios = [
          { stem: `You responded to a patient who had a syncopal episode at a grocery store. After a thorough assessment (BP 118/72, HR 78, blood glucose 96, 12-lead NSR), the patient refuses transport AMA. They are alert, oriented x4, and demonstrate understanding of the risks. What is the minimum documentation required for an AMA refusal?`, options: ["Assessment findings demonstrating decision-making capacity, risks explained to the patient including potential death, patient verbalization of understanding, informed refusal signature with witness, and instructions to call 911 if symptoms recur", "Just the patient's signature on the AMA form", "Vital signs and a note stating 'patient refused'", "Only document if the patient becomes unresponsive later"], correct: 0, diff: 2 },
          { stem: `You administer 0.4 mg of naloxone IN to an unresponsive patient with suspected opioid overdose. The patient becomes responsive and refuses further care and transport. An error in documentation is discovered later — you accidentally wrote that 4 mg was administered. How should this error be corrected?`, options: ["Draw a single line through the error, write the correct information, initial and date the correction; never obliterate or white-out the original entry", "Delete the original entry and replace it with the correct information", "Write 'VOID' across the entire patient care report and create a new one", "Leave the error as-is since changing documentation after the fact could be considered falsification"], correct: 0, diff: 2 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Crew Resource Management", generate: () => {
        const scenarios = [
          { stem: `During a critical pediatric call, your experienced partner is about to administer a medication dose that you believe is 10 times the correct dose. You are a new paramedic. Using CRM principles, what is the most effective communication technique?`, options: ["Use the CUS framework: state your Concern, explain why you are Uncomfortable, and declare it a Safety issue; clearly state the correct dose you believe should be given", "Quietly prepare the correct dose yourself without saying anything", "Defer to your partner's experience since they have more years on the job", "Report the incident after the call during the debriefing without intervening now"], correct: 0, diff: 2 },
          { stem: `After a particularly difficult pediatric cardiac arrest call where the outcome was unfavorable, several crew members are visibly distressed. One medic is blaming themselves for not achieving ROSC. As the crew leader, what is the most appropriate immediate CRM action?`, options: ["Conduct an informal hot debrief on scene to discuss the call, normalize emotional responses, and ensure all crew members know about available peer support and CISM resources", "Tell the crew to 'shake it off' and prepare for the next call", "File a formal critical incident stress report without discussing it with the crew", "Wait to address it during the next scheduled training session"], correct: 0, diff: 2 },
        ];
        return pick(scenarios);
      }},
    ]
  },
  {
    domain: "Environmental Emergencies",
    questions: [
      { subtopic: "Hypothermia", generate: () => {
        const scenarios = [
          { stem: `A ${pick(AGES.adult)}-year-old ${pick(SEX)} is rescued from icy water after 20 minutes of submersion. The patient is responsive but confused, speaking slowly, and has stopped shivering. Core temperature reads 28°C (82.4°F). HR 38 and irregular on the monitor. What is the critical management consideration?`, options: ["Handle gently (rough handling can cause VF), remove wet clothing, begin passive and active rewarming, avoid aggressive interventions until core temp >30°C, and transport to a center capable of active core rewarming", "Aggressively rewarm with hot water immersion to rapidly raise core temperature", "Administer multiple rounds of atropine for the bradycardia", "Perform immediate cardioversion for the irregular rhythm"], correct: 0, diff: 4 },
          { stem: `A ${pick(AGES.adult)}-year-old ${pick(SEX)} hiker is found on a mountain trail in winter conditions. The patient has an altered mental status, is no longer shivering, and has a core temperature of 26°C (78.8°F). The monitor shows what appears to be ventricular fibrillation. Per AHA hypothermia guidelines, how should cardiac arrest resuscitation differ from standard protocols?`, options: ["Deliver one defibrillation attempt; if unsuccessful, defer further shocks and drugs until core temperature is above 30°C while continuing CPR and rewarming", "Follow standard ACLS protocols exactly as for normothermic patients", "Do not defibrillate at all until the patient is rewarmed to 35°C", "Administer all medications at double the standard doses due to decreased metabolism"], correct: 0, diff: 5 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Heat Stroke", generate: () => {
        const scenarios = [
          { stem: `A ${pick([18,22,25,28,32])}-year-old ${pick(SEX)} soldier collapsed during a training exercise in 38°C (100°F) heat. Core temperature is 41.5°C (106.7°F). The patient is combative, has hot dry skin, and a GCS of 10. HR 152, BP 88/52. What is the target and method for cooling?`, options: ["Rapid whole-body cooling targeting core temperature below 39°C (102.2°F) within 30 minutes using ice water immersion or ice packs to groin, axillae, neck, and cold water dousing", "Administer IV acetaminophen 1g to reduce the core temperature", "Apply tepid water sponging and fan for gradual cooling over 2-4 hours", "Administer dantrolene 1 mg/kg IV for malignant hyperthermia"], correct: 0, diff: 3 },
          { stem: `An elderly patient with dementia is found in a locked car on a hot day. Core temperature is 40.8°C (105.4°F). The patient is unresponsive with hot, flushed skin. HR 144, BP 94/52, RR 32. After initiating cooling measures, the patient develops a seizure. What is the most appropriate seizure management in this context?`, options: ["Administer benzodiazepine (midazolam 5-10 mg IM/IN) while continuing aggressive cooling measures simultaneously", "Stop cooling measures and focus entirely on seizure management", "Administer phenytoin as the first-line antiepileptic", "Wait for the seizure to terminate spontaneously before continuing cooling"], correct: 0, diff: 4 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Drowning", generate: () => {
        const scenarios = [
          { stem: `A ${pick([5,7,10,14,22,35])}-year-old ${pick(SEX)} is pulled from a pool after being submerged for approximately 3 minutes. The patient is unresponsive with agonal respirations at 6/min and a weak pulse of 48 bpm. SpO2 is unreadable. What is the priority in managing this drowning patient that differs from standard protocols?`, options: ["Prioritize airway management and early rescue breaths/ventilations, as drowning is fundamentally a respiratory emergency with hypoxia being the primary insult", "Focus on chest compressions first as in standard cardiac arrest protocols", "Perform abdominal thrusts (Heimlich maneuver) to expel water from the lungs", "Assume cervical spine injury in all drowning victims and avoid head-tilt"], correct: 0, diff: 3 },
          { stem: `A teenager is rescued from a lake after cold-water submersion of approximately 10 minutes. The patient is pulseless and apneic. Water temperature was approximately 4°C (39°F). EMS personnel are debating whether to initiate resuscitation. What is the guiding principle for cold-water drowning resuscitation?`, options: ["Initiate full resuscitation; 'No one is dead until they are warm and dead' — hypothermia may provide neuroprotection, and survival has been reported after prolonged cold-water submersion", "Do not resuscitate if submersion time exceeds 5 minutes", "Only initiate CPR if the patient's core temperature is above 30°C", "Pronounce death in the field if there is no response to 3 defibrillation attempts"], correct: 0, diff: 3 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "High Altitude Illness", generate: () => {
        const scenarios = [
          { stem: `A ${pick([25,30,35,42,48])}-year-old ${pick(SEX)} hiker at 4,200 meters (13,800 feet) altitude developed progressive headache, vomiting, ataxia, and confusion over the past 8 hours. SpO2 is 72% on room air. This presentation is most consistent with which altitude emergency?`, options: ["High-altitude cerebral edema (HACE); requires immediate descent, supplemental oxygen, and dexamethasone 8 mg IV/IM followed by 4 mg every 6 hours", "Acute mountain sickness (AMS); treat with rest and acetazolamide at current altitude", "High-altitude pulmonary edema (HAPE); treat with nifedipine and supplemental oxygen", "Dehydration from altitude; IV fluid bolus and acclimatization"], correct: 0, diff: 4 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Lightning Injuries", generate: () => {
        const scenarios = [
          { stem: `You respond to a park where lightning struck a group of 6 people. Three are standing and walking, two are lying on the ground moaning, and one is pulseless and apneic. Using the reverse triage principle specific to lightning injuries, which patient do you treat first?`, options: ["The pulseless/apneic patient — lightning strike victims in cardiac arrest have a higher resuscitation success rate than other trauma arrests, making reverse triage appropriate", "The walking wounded first as they are most likely to survive (standard triage)", "The two moaning patients as they may deteriorate if untreated", "All patients simultaneously if enough resources are available"], correct: 0, diff: 3 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Envenomation", generate: () => {
        const scenarios = [
          { stem: `A ${pick(AGES.adult)}-year-old ${pick(SEX)} was bitten on the forearm by a copperhead snake 45 minutes ago. The arm is swollen from the hand to the elbow with ecchymosis around the bite. Pain is severe. BP ${pick([118,124,132])}/${pick([72,78,82])}, HR ${pick([92,98,108])}. No signs of systemic envenomation (no coagulopathy symptoms, no neurological changes). What is the most appropriate prehospital management?`, options: ["Remove constrictive items (jewelry, watch), immobilize the extremity at or slightly below heart level, mark the leading edge of swelling with time, administer analgesia, and transport for possible antivenom evaluation", "Apply a tourniquet proximal to the bite to prevent venom spread", "Apply ice directly to the bite site to slow venom absorption", "Make an incision over the fang marks and apply suction to remove venom"], correct: 0, diff: 2 },
          { stem: `A ${pick([25,30,35,45])}-year-old ${pick(SEX)} was stung by a scorpion on the hand in the southwestern US. The patient has localized pain and paresthesias at the sting site, with no systemic symptoms. HR 88, BP 128/78, RR 16. What prehospital management is indicated and what signs would indicate the need for antivenom (Centruroides antivenom)?`, options: ["Clean the site, apply cool compress, provide analgesia, and monitor for systemic signs: cranial nerve dysfunction (blurred vision, roving eye movements, tongue fasciculations, dysphagia), excessive secretions, or neuromuscular agitation indicating need for antivenom", "Apply a tourniquet and transport for immediate antivenom regardless of symptoms", "All scorpion stings require antivenom administration in the field", "Observe at scene for 2 hours before deciding on transport"], correct: 0, diff: 3 },
        ];
        return pick(scenarios);
      }},
    ]
  },
  {
    domain: "ACLS/PALS Protocols",
    questions: [
      { subtopic: "ACLS Algorithms", generate: () => {
        const scenarios = [
          { stem: `A ${pick(AGES.adult)}-year-old ${pick(SEX)} is in witnessed pulseless ventricular tachycardia. After the first defibrillation at 200J biphasic and 2 minutes of CPR, the rhythm check shows persistent VT. After the second defibrillation at 300J and another 2 minutes of CPR with epinephrine 1 mg IV administered, the third rhythm check shows continued pulseless VT. What is the next medication to administer?`, options: ["Amiodarone 300 mg IV/IO bolus during CPR after the third shock", "Lidocaine 1.5 mg/kg IV/IO as an alternative to amiodarone", "Epinephrine 3 mg IV escalating dose", "Magnesium sulfate 2g IV regardless of rhythm characteristics"], correct: 0, diff: 3 },
          { stem: `A ${pick(AGES.adult)}-year-old ${pick(SEX)} is in asystolic cardiac arrest. High-quality CPR is in progress with an advanced airway in place. Which of the following is TRUE regarding asystole management?`, options: ["Asystole is NOT a shockable rhythm; continue CPR with epinephrine 1 mg IV/IO every 3-5 minutes and address reversible causes", "Attempt defibrillation at maximum joules in case of fine VF misidentified as asystole", "Administer atropine 1 mg IV every 3-5 minutes for asystole per current guidelines", "Transcutaneous pacing should be attempted for all asystolic patients"], correct: 0, diff: 2 },
          { stem: `During CPR on a ${pick(AGES.adult)}-year-old ${pick(SEX)}, you note the EtCO2 suddenly drops from 22 mmHg to 8 mmHg. CPR quality appears unchanged on the defibrillator feedback. What is the most likely cause of the drop in EtCO2?`, options: ["The endotracheal tube has become dislodged or migrated into the esophagus", "Return of spontaneous circulation (ROSC) has occurred", "Increased pulmonary blood flow from improved CPR quality", "Normal variation in EtCO2 during prolonged resuscitation"], correct: 0, diff: 4 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Cardiac Arrest Management", generate: () => {
        const scenarios = [
          { stem: `A ${pick([45,52,58,64,72])}-year-old ${pick(SEX)} with a history of dialysis is found in cardiac arrest. The rhythm is PEA with wide, peaked QRS complexes. The last dialysis session was 4 days ago. Which reversible cause should be addressed immediately and how?`, options: ["Hyperkalemia; administer calcium chloride 1g (10 mL of 10%) IV push over 2-3 minutes, followed by sodium bicarbonate 50 mEq IV", "Hypovolemia; administer 2L NS rapid IV bolus", "Hypothermia; begin active rewarming measures", "Tension pneumothorax; perform bilateral needle decompression"], correct: 0, diff: 4 },
          { stem: `You are performing CPR on a ${pick(AGES.adult)}-year-old ${pick(SEX)}. The defibrillator CPR feedback device shows compression depth of 1.5 inches and a rate of 90/min. What adjustments are needed based on current AHA guidelines?`, options: ["Increase compression depth to at least 2 inches (5 cm) and increase rate to 100-120/min; current compressions are too shallow and too slow", "The current depth and rate are acceptable; continue without changes", "Increase depth only; the rate of 90/min is acceptable", "Increase rate only; the depth of 1.5 inches is adequate"], correct: 0, diff: 2 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Post-Resuscitation Care", generate: () => {
        const scenarios = [
          { stem: `A ${pick([48,55,62,68])}-year-old ${pick(SEX)} achieves ROSC after 22 minutes of CPR for VF arrest. Current: BP 84/52, HR 102 sinus tachycardia, intubated with EtCO2 46, SpO2 100% on 100% FiO2. The patient has no purposeful movements. What are the priority post-ROSC interventions?`, options: ["Titrate FiO2 down targeting SpO2 94-99%, administer vasopressor (norepinephrine) for MAP >65 mmHg, obtain 12-lead ECG, and avoid hyperthermia", "Maintain 100% FiO2 to maximize cerebral oxygen delivery", "Administer amiodarone prophylactically to prevent recurrent VF", "Hyperventilate to EtCO2 <30 mmHg to reduce intracranial pressure"], correct: 0, diff: 4 },
          { stem: `After ROSC, a patient's 12-lead ECG shows ST elevation in leads V1-V4. The patient remains comatose. Per current guidelines, what is the recommended approach regarding cardiac catheterization?`, options: ["Emergent cardiac catheterization is recommended for STEMI regardless of neurological status post-cardiac arrest", "Defer catheterization until the patient regains consciousness", "Perform catheterization only if the patient has hemodynamic instability", "Administer thrombolytics in lieu of catheterization for post-arrest STEMI patients"], correct: 0, diff: 4 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Pediatric Resuscitation", generate: () => {
        const scenarios = [
          { stem: `An 8-month-old infant (8 kg) is in pulseless cardiac arrest with a rhythm of PEA. An IO line has been established. After 2 minutes of high-quality CPR (15:2 ratio with 2 rescuers), what is the correct epinephrine dose?`, options: ["Epinephrine 0.01 mg/kg (0.08 mg) = 0.8 mL of 1:10,000 concentration IV/IO", "Epinephrine 0.1 mg/kg (0.8 mg) IV/IO for cardiac arrest", "Epinephrine 0.01 mg/kg (0.08 mg) of 1:1,000 IM", "Epinephrine 1 mg IV/IO flat dose as in adult cardiac arrest"], correct: 0, diff: 3 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Neonatal Resuscitation", generate: () => {
        const scenarios = [
          { stem: `A newborn is delivered at 39 weeks with meconium-stained amniotic fluid. The baby is limp, not breathing, and has a heart rate of 70 bpm. Per current NRP guidelines, what is the initial approach to this meconium-exposed, non-vigorous newborn?`, options: ["Begin PPV immediately without routine tracheal suctioning; current NRP guidelines no longer recommend routine intubation and suctioning for meconium in non-vigorous neonates", "Intubate and suction the trachea before any PPV to prevent meconium aspiration syndrome", "Suction the mouth and nose vigorously with a DeLee catheter before stimulation", "Begin chest compressions immediately given the heart rate below 100 bpm"], correct: 0, diff: 4 },
          { stem: `During NRP, after 30 seconds of effective PPV with chest rise confirmed, a newborn's heart rate is 48 bpm. What is the correct intervention?`, options: ["Begin coordinated chest compressions and ventilations at a 3:1 ratio using the two-thumb encircling technique", "Continue PPV alone for another 30 seconds before initiating compressions", "Administer epinephrine 0.01-0.03 mg/kg via UVC before starting compressions", "Increase PPV rate to 60/min and reassess in 15 seconds"], correct: 0, diff: 3 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "ROSC Management", generate: () => {
        const scenarios = [
          { stem: `After ROSC, a ${pick([48,55,62,68])}-year-old ${pick(SEX)} has a blood pressure of 78/44 despite 1L NS bolus. The patient is intubated. EtCO2 is 52 mmHg, SpO2 94% on 40% FiO2. What is the vasopressor of choice and target?`, options: ["Norepinephrine infusion starting at 0.1 mcg/kg/min titrated to target MAP ≥65 mmHg and SBP ≥90 mmHg", "Dopamine at 2 mcg/kg/min for renal dose benefits", "Epinephrine 1 mg IV bolus every 5 minutes as in cardiac arrest", "Phenylephrine for pure alpha-agonist vasoconstriction"], correct: 0, diff: 3 },
          { stem: `A post-ROSC patient is being transported. The patient's temperature is 37.8°C, and you recall that targeted temperature management (TTM) is recommended. Which statement about TTM is most current?`, options: ["Target normothermia (≤37.5°C); actively prevent fever; TTM at 33°C vs 36°C showed no difference in outcomes in the TTM2 trial, but fever prevention remains critical", "Cool all post-arrest patients to 32-34°C for 24 hours", "TTM is only recommended for witnessed VF arrest patients", "Initiate rapid IV cold saline infusion in the field for pre-hospital cooling"], correct: 0, diff: 5 },
        ];
        return pick(scenarios);
      }},
    ]
  },
  {
    domain: "Pharmacology",
    questions: [
      { subtopic: "Drug Calculations", generate: () => {
        const weight = pick([60,65,70,75,80,85,90]);
        const scenarios = [
          { stem: `A ${pick(AGES.adult)}-year-old ${pick(SEX)} weighing ${weight} kg requires an epinephrine infusion at 0.3 mcg/kg/min. You have 4 mg epinephrine in 250 mL NS (16 mcg/mL). Using a 60 gtt/mL microdrip set, what is the correct drip rate?`, options: [`${Math.round(weight * 0.3 / 16 * 60 * 10) / 10} gtt/min`, `${Math.round(weight * 0.3 / 16 * 60 * 10 * 2) / 10} gtt/min`, `${Math.round(weight * 0.3 / 16 * 60 * 10 / 3) / 10} gtt/min`, `${Math.round(weight * 0.3 / 16 * 10) / 10} gtt/min`], correct: 0, diff: 3 },
          { stem: `You need to prepare a lidocaine infusion at 2 mg/min for a ${pick(AGES.adult)}-year-old patient. The available concentration is 2g lidocaine in 500 mL D5W. What is the infusion rate in mL/hr?`, options: ["30 mL/hr", "60 mL/hr", "15 mL/hr", "120 mL/hr"], correct: 0, diff: 3 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Cardiac Drugs", generate: () => {
        const scenarios = [
          { stem: `A ${pick(AGES.adult)}-year-old ${pick(SEX)} presents with new-onset atrial fibrillation with rapid ventricular response (HR 156). BP 132/82, SpO2 97%, no chest pain, no shortness of breath at rest. The patient is hemodynamically stable. Which medication and approach is most appropriate?`, options: ["Diltiazem 0.25 mg/kg (typically 15-20 mg) IV over 2 minutes for rate control", "Amiodarone 150 mg IV over 10 minutes for rhythm control", "Adenosine 6 mg rapid IV push to break the rhythm", "Synchronized cardioversion at 120-200J for any atrial fibrillation with HR >150"], correct: 0, diff: 3 },
          { stem: `A ${pick(AGES.adult)}-year-old ${pick(SEX)} with polymorphic ventricular tachycardia (Torsades de Pointes) is hemodynamically unstable with BP 74/42. What is the first-line pharmacological treatment specific to Torsades?`, options: ["Magnesium sulfate 1-2g IV over 5-20 minutes (or rapid push if pulseless)", "Amiodarone 150 mg IV over 10 minutes", "Procainamide 20 mg/min IV infusion", "Synchronized cardioversion without medication"], correct: 0, diff: 4 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Antidotes", generate: () => {
        const scenarios = [
          { stem: `A ${pick(AGES.adult)}-year-old ${pick(SEX)} firefighter is rescued from a structure fire with altered mental status, cherry-red skin coloring, and seizures. SpO2 reads 99% on pulse oximetry. ABG (if available) would show elevated carboxyhemoglobin. What is the specific antidote?`, options: ["High-flow 100% oxygen via NRB or BVM; consider hydroxocobalamin (Cyanokit) 5g IV if concurrent cyanide exposure is suspected", "Methylene blue 1-2 mg/kg IV for methemoglobinemia", "N-acetylcysteine (NAC) for hepatic protection", "Flumazenil 0.2 mg IV for benzodiazepine reversal"], correct: 0, diff: 3 },
          { stem: `A ${pick([22,25,28,32])}-year-old ${pick(SEX)} ingested an unknown quantity of acetaminophen 6 hours ago in a suicide attempt. The patient is currently asymptomatic but reports taking "a whole bottle" (approximately 50 tablets of 500 mg). What is the critical prehospital concern?`, options: ["Acetaminophen toxicity has a delayed presentation; hepatic failure may not manifest for 24-72 hours. Ensure rapid transport for NAC (N-acetylcysteine) administration and serum acetaminophen level, which should be drawn at 4+ hours post-ingestion", "The patient is asymptomatic and therefore not at risk for serious toxicity", "Administer activated charcoal 1 g/kg if within the first hour of ingestion", "Induce vomiting to remove the unabsorbed tablets"], correct: 0, diff: 3 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Toxicology and Poisoning", generate: () => {
        const scenarios = [
          { stem: `A ${pick([28,35,42,55])}-year-old ${pick(SEX)} presents with confusion, hyperthermia (40.2°C), agitation, clonus, hyperreflexia, diaphoresis, and diarrhea. The patient's medications include fluoxetine (SSRI), and they reportedly took "extra pills" of tramadol for pain. This clinical picture is most consistent with which toxidrome?`, options: ["Serotonin syndrome; treatment includes cyproheptadine (if available), benzodiazepines for agitation, and active cooling", "Neuroleptic malignant syndrome; treat with dantrolene", "Anticholinergic toxidrome; treat with physostigmine", "Sympathomimetic toxidrome; treat with beta-blockers"], correct: 0, diff: 4 },
          { stem: `A ${pick(AGES.adult)}-year-old ${pick(SEX)} is found unresponsive with a medication bottle of metoprolol nearby (possible overdose). HR 34, BP 62/38, blood glucose 52 mg/dL. The patient responds minimally to pain. What is the first-line treatment for beta-blocker toxicity beyond standard ACLS?`, options: ["Glucagon 3-5 mg IV bolus (may repeat), followed by infusion at 3-5 mg/hr; also administer D50W for hypoglycemia", "Atropine 1 mg IV as the sole treatment for bradycardia", "Isoproterenol infusion for chronotropic support", "Calcium chloride 1g IV for beta-blocker cardiotoxicity"], correct: 0, diff: 5 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Vasopressors", generate: () => {
        const scenarios = [
          { stem: `A ${pick(AGES.adult)}-year-old ${pick(SEX)} in septic shock has received 30 mL/kg crystalloid (2.5L) but remains hypotensive with MAP 52 mmHg. The patient is intubated. Per the Surviving Sepsis Campaign guidelines, which is the first-line vasopressor?`, options: ["Norepinephrine infusion starting at 5-15 mcg/min titrated to MAP ≥65 mmHg", "Dopamine infusion at 10-20 mcg/kg/min", "Phenylephrine infusion for pure vasoconstriction", "Vasopressin 0.04 units/min as a first-line single agent"], correct: 0, diff: 3 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Routes of Administration", generate: () => {
        const scenarios = [
          { stem: `A ${pick([4,6,8])}-year-old child in cardiac arrest has had three failed peripheral IV attempts. The nearest hospital is 12 minutes away. What is the preferred alternative vascular access?`, options: ["Intraosseous (IO) insertion in the proximal tibia, 1-2 cm below and medial to the tibial tuberosity; medications can be administered at the same doses as IV", "External jugular vein cannulation with a 22-gauge catheter", "Femoral vein cutdown for central access", "Subcutaneous fluid administration for medication delivery"], correct: 0, diff: 2 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "Sedation and Analgesia", generate: () => {
        const scenarios = [
          { stem: `A ${pick(AGES.adult)}-year-old ${pick(SEX)} has an isolated closed femur fracture with severe pain (10/10). BP 138/82, HR 108, RR 20, SpO2 98%. Your protocol authorizes ketamine for pain management as an alternative to opioids. What is the appropriate sub-dissociative analgesic dose of ketamine?`, options: ["Ketamine 0.1-0.3 mg/kg IV over 15 minutes (or 0.5-1 mg/kg IN) for analgesia without dissociation", "Ketamine 1-2 mg/kg IV push for rapid pain relief through dissociation", "Ketamine 4 mg/kg IM as a full dissociative dose", "Ketamine 0.01 mg/kg IV, which is the standard analgesic dose"], correct: 0, diff: 3 },
        ];
        return pick(scenarios);
      }},
      { subtopic: "RSI Medications", generate: () => {
        const scenarios = [
          { stem: `A ${pick(AGES.adult)}-year-old ${pick(SEX)} requires emergency RSI for airway protection. The patient has a history of renal failure with baseline potassium of 5.8 mEq/L per their dialysis records. Which paralytic agent is CONTRAINDICATED and which should be used instead?`, options: ["Succinylcholine is contraindicated (can raise K+ by 0.5-1.0 mEq/L causing lethal hyperkalemia); use rocuronium 1.0-1.2 mg/kg IV instead", "Rocuronium is contraindicated in renal failure; use succinylcholine 1.5 mg/kg", "Both agents are safe in renal failure at standard doses", "Vecuronium is the only safe paralytic in hyperkalemic patients"], correct: 0, diff: 4 },
        ];
        return pick(scenarios);
      }},
    ]
  },
];

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  const existingStems = await pool.query("SELECT stem FROM allied_questions WHERE career_type='paramedic'");
  const existingHashes = new Set(existingStems.rows.map(r => hashStem(r.stem)));

  const currentCounts = await pool.query("SELECT blueprint_category, COUNT(*) as cnt FROM allied_questions WHERE career_type='paramedic' AND status='approved' GROUP BY blueprint_category");
  const domainCounts = {};
  currentCounts.rows.forEach(r => { domainCounts[r.blueprint_category] = parseInt(r.cnt); });
  console.log('Current domain counts:', domainCounts);

  const TARGET_COUNTS = {
    "Airway Management": 180,
    "Cardiology/ECG": 210,
    "Trauma Management": 210,
    "Medical Emergencies": 210,
    "ACLS/PALS Protocols": 120,
    "Pharmacology": 150,
    "Pediatric Emergencies": 105,
    "OB Emergencies": 90,
    "Operations/EMS Systems": 120,
    "Environmental Emergencies": 60,
  };

  let totalInserted = 0;
  let totalFlashcards = 0;
  let totalNeeded = 0;
  for (const [d, t] of Object.entries(TARGET_COUNTS)) {
    totalNeeded += Math.max(0, t - (domainCounts[d] || 0));
  }
  console.log(`Total questions needed to reach targets: ${totalNeeded}`);

  for (const templateDomain of QUESTION_TEMPLATES) {
    const domain = templateDomain.domain;
    const target = TARGET_COUNTS[domain] || 100;
    const current = domainCounts[domain] || 0;
    let needed = target - current;

    if (needed <= 0) {
      console.log(`${domain}: already at target (${current}/${target}), skipping`);
      continue;
    }

    console.log(`\n${domain}: need ${needed} more (have ${current}/${target})`);

    let domainInserted = 0;
    let attempts = 0;
    const maxAttempts = needed * 5;

    while (domainInserted < needed && attempts < maxAttempts) {
      attempts++;
      const qTemplate = pick(templateDomain.questions);
      const question = qTemplate.generate();

      const stemHash = hashStem(question.stem);
      if (existingHashes.has(stemHash)) continue;

      const options = [...question.options];
      const correctIdx = question.correct;
      const difficulty = question.difficulty || 3;

      const indices = [0, 1, 2, 3];
      for (let i = 3; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      const shuffled = indices.map(i => options[i]);
      const newCorrect = shuffled.indexOf(options[correctIdx]);
      const cogLevel = difficulty <= 2 ? 'recall' : difficulty === 3 ? 'application' : 'analysis';
      const lessonSlug = `${slugify(domain)}/${slugify(qTemplate.subtopic)}`;
      const rationale = generateRationale(domain, qTemplate.subtopic, shuffled[newCorrect], shuffled.filter((_, i) => i !== newCorrect), lessonSlug);

      const clinicalPearls = [
        `Systematic assessment is critical in ${qTemplate.subtopic.toLowerCase()} scenarios`,
        `Always reassess after interventions to evaluate treatment effectiveness`,
        `Follow current evidence-based guidelines and local protocols`
      ];
      const safetyNote = `Ensure scene safety and proper PPE. Follow local protocols for ${qTemplate.subtopic.toLowerCase()} management.`;
      const distractorRationales = shuffled.map((opt, i) =>
        i === newCorrect ? `Correct: This is the best answer based on current guidelines` : `Incorrect: This does not address the primary clinical priority in this scenario`
      );
      const examTrap = `Tests ability to identify highest priority intervention in ${qTemplate.subtopic.toLowerCase()} scenarios`;

      try {
        const result = await pool.query(`
          INSERT INTO allied_questions (career_type, batch_id, stem, options, correct_answer, rationale_long,
            learning_objective, blueprint_category, subtopic, difficulty, cognitive_level, question_type,
            exam_trap, clinical_pearls, safety_note, distractor_rationales, is_free, status)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING id`,
          ['paramedic', BATCH_ID, question.stem, JSON.stringify(shuffled), newCorrect, rationale,
           `Understand ${qTemplate.subtopic.toLowerCase()} management in the prehospital setting`,
           domain, qTemplate.subtopic, difficulty, cogLevel, 'multiple-choice', examTrap,
           JSON.stringify(clinicalPearls), safetyNote, JSON.stringify(distractorRationales), false, 'approved']);

        const qId = result.rows[0].id;
        existingHashes.add(stemHash);
        domainInserted++;
        totalInserted++;

        const cards = [
          { cardType: 'definition', front: `Understand ${qTemplate.subtopic.toLowerCase()} management in the prehospital setting`, back: shuffled[newCorrect], rationale: rationale.substring(0, 500) },
          { cardType: 'clinical_decision', front: `Clinical decision: ${qTemplate.subtopic} - What is the key clinical pearl?`, back: clinicalPearls[0], rationale: clinicalPearls.slice(1).join(' | ') },
          { cardType: 'red_flag', front: `Red Flag: ${qTemplate.subtopic} - What safety concern must you remember?`, back: safetyNote, rationale: `From: ${domain}` }
        ];

        for (const c of cards) {
          await pool.query(`INSERT INTO allied_flashcards (career_type, question_id, card_type, front, back, rationale, blueprint_category, subtopic)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            ['paramedic', qId, c.cardType, c.front, c.back, c.rationale, domain, qTemplate.subtopic]);
          totalFlashcards++;
        }

        if (totalInserted % 25 === 0) {
          console.log(`  Progress: ${totalInserted} inserted (${domain}: ${domainInserted}/${needed})`);
        }
      } catch (err) {
        console.error(`  Insert error: ${err.message}`);
      }
    }

    console.log(`  ${domain}: inserted ${domainInserted}/${needed} questions`);
  }

  console.log('\n========== FILL GENERATION COMPLETE ==========');
  console.log(`Total questions inserted: ${totalInserted}`);
  console.log(`Total flashcards created: ${totalFlashcards}`);

  const finalCount = await pool.query("SELECT COUNT(*) as total FROM allied_questions WHERE career_type='paramedic' AND status='approved'");
  console.log(`\nTotal approved paramedic questions: ${finalCount.rows[0].total}`);

  const catRes = await pool.query("SELECT blueprint_category, COUNT(*) as cnt FROM allied_questions WHERE career_type='paramedic' AND status='approved' GROUP BY blueprint_category ORDER BY cnt DESC");
  console.log('\nFinal domain distribution:');
  catRes.rows.forEach(r => console.log(`  ${r.blueprint_category}: ${r.cnt}`));

  const diffRes = await pool.query("SELECT difficulty, COUNT(*) as cnt FROM allied_questions WHERE career_type='paramedic' AND status='approved' GROUP BY difficulty ORDER BY difficulty");
  console.log('\nDifficulty distribution:');
  diffRes.rows.forEach(r => console.log(`  Level ${r.difficulty}: ${r.cnt}`));

  const fcRes = await pool.query("SELECT COUNT(*) as total FROM allied_flashcards WHERE career_type='paramedic'");
  console.log(`\nTotal flashcards: ${fcRes.rows[0].total}`);

  await pool.end();
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
